import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { sanitizeAndValidate, itemSchema } from '@/lib/validation';
import { corsHeaders, sanitizeSearchQuery } from '@/lib/security';
import { apiCache } from '@/lib/cache';
import type { IItem, ItemFilters, ApiResponse } from '@/types';

// GET /api/items - Browse items with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Generate cache key for this request
    const cacheKey = apiCache.generateKey('/api/items', queryParams);
    
    // Try to get from cache first
    const cachedResult = await apiCache.get<ApiResponse<IItem[]>>(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, { headers: corsHeaders });
    }

    // Parse query parameters with defaults
    const validSortOptions: readonly string[] = ['newest', 'price_cents', 'price_cents_desc', 'views'];
    const sortBy: ItemFilters['sortBy'] = validSortOptions.includes(queryParams.sortBy || '') 
      ? (queryParams.sortBy as ItemFilters['sortBy'])
      : 'newest';

    const filters: ItemFilters = {
      page: parseInt(queryParams.page || '1'),
      limit: Math.min(parseInt(queryParams.limit || '12'), 50), // Cap at 50 to prevent abuse
      category: queryParams.category,
      brand: queryParams.brand,
      condition: queryParams.condition,
      color: queryParams.color,
      minPrice: queryParams.minPrice ? parseInt(queryParams.minPrice) : undefined,
      maxPrice: queryParams.maxPrice ? parseInt(queryParams.maxPrice) : undefined,
      search: queryParams.search ? sanitizeSearchQuery(queryParams.search) : undefined,
      sortBy,
    };

    // Build filter object
    const filter: Record<string, unknown> = {
      isActive: true,
      isApproved: true,
    };

    // Category filtering (support multiple categories)
    const categories = searchParams.getAll('categories');
    if (categories.length > 0) {
      filter.category = { $in: categories };
    } else if (filters.category) {
      filter.category = filters.category;
    }

    // Brand filtering (support multiple brands)
    const brands = searchParams.getAll('brands');
    if (brands.length > 0) {
      filter.brand = { $in: brands };
    } else if (filters.brand) {
      filter.brand = new RegExp(filters.brand, 'i');
    }

    // Condition filtering (support multiple conditions)
    const conditions = searchParams.getAll('conditions');
    if (conditions.length > 0) {
      filter.condition = { $in: conditions };
    } else if (filters.condition) {
      filter.condition = filters.condition;
    }

    // Color filtering (support multiple colors)
    const colors = searchParams.getAll('colors');
    if (colors.length > 0) {
      filter.color = { $in: colors.map(c => new RegExp(c, 'i')) };
    } else if (filters.color) {
      filter.color = new RegExp(filters.color, 'i');
    }
    
    if (filters.minPrice || filters.maxPrice) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (filters.minPrice) priceFilter.$gte = filters.minPrice * 100;
      if (filters.maxPrice) priceFilter.$lte = filters.maxPrice * 100;
      filter.price_cents = priceFilter;
    }

    // Improved search with MongoDB text search and weighted relevance
    if (filters.search) {
      filter.$text = { $search: filters.search };
    }

    // Build sort object
    const sort: Record<string, 1 | -1 | { $meta: string }> = {};
    
    // If searching, sort by text search score relevance first
    if (filters.search) {
      sort.score = { $meta: 'textScore' };
    }
    
    // Then add secondary sort
    switch (filters.sortBy) {
      case 'price_cents':
        sort.price_cents = 1;
        break;
      case 'price_cents_desc':
        sort.price_cents = -1;
        break;
      case 'views':
        sort['stats.views'] = -1;
        break;
      case 'newest':
      default:
        if (!filters.search) {
          sort.createdAt = -1;
        }
        break;
    }

    const skip = ((filters.page || 1) - 1) * (filters.limit || 12);
    
    // Execute queries in parallel with optimized projection
    const queryBuilder = Item.find(filter);
    
    // Add text score to projection if searching
    if (filters.search) {
      queryBuilder.select('title brand price_cents shipping_cents images condition category color isActive isApproved isSold stats createdAt categoryAttributes score');
      queryBuilder.select({ score: { $meta: 'textScore' } });
    } else {
      queryBuilder.select('title brand price_cents shipping_cents images condition category color isActive isApproved isSold stats createdAt categoryAttributes');
    }
    
    const [items, total] = await Promise.all([
      queryBuilder
        .populate('sellerId', 'firstName lastName stats.averageRating stats.totalReviews')
        .sort(sort)
        .skip(skip)
        .limit(filters.limit || 12)
        .lean({ virtuals: false, getters: false }),
      Item.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / (filters.limit || 12));

    const response: ApiResponse<IItem[]> = {
      success: true,
      data: items as unknown as IItem[],
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 12,
        total,
        pages,
      },
    };

    // Cache the response
    await apiCache.set(cacheKey, response);

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error: unknown) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/items - Create new item
export const POST = withRateLimit(rateLimiters.createItem, async (request: NextRequest) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    // Check if user exists and is a seller
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.isSeller) {
      return NextResponse.json(
        { error: 'Seller account required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await request.json();
    console.log('Received item data:', body); // Debug log
    
    const validation = sanitizeAndValidate(itemSchema, body);
    
    if (!validation.success) {
      console.error('Validation failed:', validation.errors); // Debug log
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    const itemData = validation.data!;
    
    // Convert images from string array to new structure
    const images = itemData.images.map((url: string, index: number) => ({
      url,
      order: index,
      isMain: index === 0,
    }));
    
    // Extract category-specific attributes and dimensions
    const categoryAttributes: any = {};
    const dimensions: any = itemData.dimensions || {};
    
    // Known base fields to exclude from categoryAttributes
    const baseFields = ['title', 'description', 'brand', 'price_cents', 'shipping_cents', 
                         'images', 'condition', 'category', 'color', 'material', 'location', 'dimensions'];
    
    // Store all additional fields as category attributes
    Object.keys(itemData).forEach(key => {
      if (!baseFields.includes(key)) {
        categoryAttributes[key] = itemData[key];
      }
    });
    
    // Hybrid Approval Logic
    // Auto-approve for verified sellers with good track record
    const shouldAutoApprove = 
      user.isVerified && 
      user.stats.totalSold >= 5 && 
      user.stats.averageRating >= 4.5;
    
    // Prepare the new item data
    const newItemData: any = {
      title: itemData.title,
      description: itemData.description,
      brand: itemData.brand,
      price_cents: itemData.price_cents,
      shipping_cents: itemData.shipping_cents,
      images,
      condition: itemData.condition,
      category: itemData.category,
      color: itemData.color,
      location: itemData.location,
      sellerId: user._id,
      isActive: true,
      isApproved: shouldAutoApprove, // Auto-approve trusted sellers
      isSold: false,
      dimensions,
      categoryAttributes, // Store dynamic category-specific fields
    };
    
    // Add optional fields if present
    if (itemData.material) {
      newItemData.material = itemData.material;
    }
    
    // Create new item
    const item = new Item(newItemData);

    const savedItem = await item.save();
    const populatedItem = await Item.findById(savedItem._id)
      .populate('sellerId', 'firstName lastName stats')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedItem,
        message: shouldAutoApprove 
          ? 'Item created and approved! Your listing is now live.' 
          : 'Item created successfully. It will be reviewed before going live.',
        autoApproved: shouldAutoApprove,
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error: unknown) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
});

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
