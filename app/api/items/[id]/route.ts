import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { sanitizeAndValidate, updateItemSchema } from '@/lib/validation';
import { isValidObjectId } from '@/lib/security';
import { corsHeaders } from '@/lib/security';

// GET /api/items/[id] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  
  try {
    if (!isValidObjectId(resolvedParams.id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();

    const item = await Item.findOne({
      _id: resolvedParams.id,
      isActive: true,
      isApproved: true,
    })
      .populate('sellerId', 'firstName lastName stats')
      .lean();

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Increment view count (fire and forget)
    Item.findByIdAndUpdate(resolvedParams.id, { $inc: { 'stats.views': 1 } }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT /api/items/[id] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!isValidObjectId(resolvedParams.id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();

    // Check if user owns this item
    const item = await Item.findById(resolvedParams.id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get the user to verify ownership
    const user = await User.findOne({ clerkId: userId });
    if (!user || !item.sellerId.equals(user._id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const validation = sanitizeAndValidate(updateItemSchema, { ...body, id: resolvedParams.id });
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    const { id, ...updateData } = validation.data!; // Remove ID from update data

    // Prepare update object with proper typing
    const updateObject: any = { ...updateData, updatedAt: new Date() };

    // If item was approved and we're updating, it needs re-approval
    if (item.isApproved) {
      updateObject.isApproved = false;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      resolvedParams.id,
      updateObject,
      { new: true, runValidators: true }
    ).populate('sellerId', 'firstName lastName stats');

    return NextResponse.json(
      {
        success: true,
        data: updatedItem,
        message: item.isApproved 
          ? 'Item updated successfully. Changes will be reviewed before going live.'
          : 'Item updated successfully.',
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/items/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!isValidObjectId(resolvedParams.id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();

    // Check if user owns this item
    const item = await Item.findById(resolvedParams.id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get the user to verify ownership
    const user = await User.findOne({ clerkId: userId });
    if (!user || !item.sellerId.equals(user._id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: corsHeaders }
      );
    }

    // Soft delete - mark as inactive instead of actually deleting
    await Item.findByIdAndUpdate(resolvedParams.id, { 
      isActive: false,
      updatedAt: new Date()
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Item deleted successfully',
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
