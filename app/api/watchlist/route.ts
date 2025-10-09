import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Item from '@/models/Item';
import mongoose from 'mongoose';

// GET /api/watchlist - Get user's watchlist
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Optimize: Fetch all watchlist items in a single query instead of N queries
    const items = await Item.find({ _id: { $in: user.watchlist } }).lean();
    
    // Map items to the response format
    const watchlistItems = items.map((item) => ({
      _id: String(item._id),
      title: item.title,
      brand: item.brand,
      price_cents: item.price_cents,
      images: item.images,
      condition: item.condition,
      isActive: item.isActive,
      isApproved: item.isApproved,
      isSold: item.isSold,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: watchlistItems,
    });
  } catch (error: any) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

// POST /api/watchlist - Add item to watchlist
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await connectDB();
    
    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if item is already in watchlist
    const isInWatchlist = user.watchlist.some((id: mongoose.Types.ObjectId) => id.toString() === itemId);
    
    if (isInWatchlist) {
      return NextResponse.json({ 
        success: true, 
        message: 'Item already in watchlist',
        data: user.watchlist 
      });
    }

    // Add item to watchlist
    user.watchlist.push(new mongoose.Types.ObjectId(itemId));
    await user.save();

    // Increment item favorites count
    await Item.findByIdAndUpdate(itemId, {
      $inc: { 'stats.favorites': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Item added to watchlist',
      data: user.watchlist,
    });
  } catch (error: any) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to add item to watchlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/watchlist - Remove item from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if item was actually in watchlist
    const wasInWatchlist = user.watchlist.some((id: mongoose.Types.ObjectId) => id.toString() === itemId);

    // Remove item from watchlist
    user.watchlist = user.watchlist.filter((id: mongoose.Types.ObjectId) => id.toString() !== itemId);
    await user.save();

    // Decrement item favorites count only if it was in the watchlist
    if (wasInWatchlist) {
      await Item.findByIdAndUpdate(itemId, {
        $inc: { 'stats.favorites': -1 }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from watchlist',
      data: user.watchlist,
    });
  } catch (error: any) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from watchlist' },
      { status: 500 }
    );
  }
}
