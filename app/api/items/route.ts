import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { sanitizeAndValidate, itemSchema } from '@/lib/validation';
import { corsHeaders } from '@/lib/security';
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
    const filters: ItemFilters = {
      page: parseInt(queryParams.page || '1'),
      limit: parseInt(queryParams.limit || '12'),
      category: queryParams.category,
      brand: queryParams.brand,
      condition: queryParams.condition,
      color: queryParams.color,
      minPrice: queryParams.minPrice ? parseInt(queryParams.minPrice) : undefined,
      maxPrice: queryParams.maxPrice ? parseInt(queryParams.maxPrice) : undefined,
      search: queryParams.search,
      sortBy: (queryParams.sortBy as any) || 'newest',
    };

    // Build filter object
    const filter: any = {
      isActive: true,
      isApproved: true,
    };

    if (filters.category) filter.category = filters.category;
    if (filters.brand) filter.brand = new RegExp(filters.brand, 'i');
    if (filters.condition) filter.condition = filters.condition;
    if (filters.color) filter.color = new RegExp(filters.color, 'i');
    
    if (filters.minPrice || filters.maxPrice) {
      filter.price_cents = {};
      if (filters.minPrice) filter.price_cents.$gte = filters.minPrice * 100; // Convert dollars to cents
      if (filters.maxPrice) filter.price_cents.$lte = filters.maxPrice * 100; // Convert dollars to cents
    }

    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { brand: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
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
        sort.createdAt = -1;
        break;
    }

    const skip = ((filters.page || 1) - 1) * (filters.limit || 12);
    
    // Execute queries in parallel
    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('sellerId', 'firstName lastName rating totalSales')
        .sort(sort)
        .skip(skip)
        .limit(filters.limit || 12)
        .lean(),
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

  } catch (error) {
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
    const validation = sanitizeAndValidate(itemSchema, body);
    
    if (!validation.success) {
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
    
    // Create new item
    const item = new Item({
      ...itemData,
      images, // Use the converted images
      sellerId: user._id,
      isActive: true,
      isApproved: false, // Items need approval
      isSold: false,
    });

    const savedItem = await item.save();
    const populatedItem = await Item.findById(savedItem._id)
      .populate('sellerId', 'firstName lastName rating totalSales')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedItem,
        message: 'Item created successfully. It will be reviewed before going live.',
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
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
