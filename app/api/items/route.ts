import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { sanitizeAndValidate, browseQuerySchema, itemSchema } from '@/lib/validation';
import { corsHeaders } from '@/lib/security';

// GET /api/items - Browse items with filters
export const GET = withRateLimit(rateLimiters.general, async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validation = sanitizeAndValidate(browseQuerySchema, queryParams);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.errors },
        { status: 400 }
      );
    }

    const { page, limit, category, brand, condition, color, minPrice, maxPrice, search, sortBy } = validation.data!;

    // Build filter object
    const filter: any = {
      isActive: true,
      isApproved: true,
    };

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (condition) filter.condition = condition;
    if (color) filter.color = new RegExp(color, 'i');
    
    if (minPrice || maxPrice) {
      filter.price_cents = {};
      if (minPrice) filter.price_cents.$gte = minPrice;
      if (maxPrice) filter.price_cents.$lte = maxPrice;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort: any = {};
    switch (sortBy) {
      case 'price_asc':
        sort.price_cents = 1;
        break;
      case 'price_desc':
        sort.price_cents = -1;
        break;
      case 'created_asc':
        sort.createdAt = 1;
        break;
      case 'created_desc':
      default:
        sort.createdAt = -1;
        break;
    }

    const skip = (page - 1) * limit;
    
    // Execute queries in parallel
    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('sellerId', 'firstName lastName rating totalSales')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Item.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
});

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
    
    // Create new item
    const item = new Item({
      ...itemData,
      sellerId: user._id,
      isActive: true,
      isApproved: false, // Items need approval
      views: 0,
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
