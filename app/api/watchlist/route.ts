import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Item from '@/models/Item';

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

    // Get full item details for watchlist items
    const watchlistItems = await Promise.all(
      user.watchlist.map(async (itemId: string) => {
        const item = await Item.findById(itemId);
        return item ? {
          _id: item._id.toString(),
          title: item.title,
          brand: item.brand,
          price_cents: item.price_cents,
          images: item.images,
          condition: item.condition,
          createdAt: item.createdAt,
        } : null;
      })
    );

    // Filter out null items (deleted items)
    const validItems = watchlistItems.filter(item => item !== null);

    return NextResponse.json({
      success: true,
      data: validItems,
    });
  } catch (error) {
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
    if (user.watchlist.includes(itemId)) {
      return NextResponse.json({ 
        success: true, 
        message: 'Item already in watchlist',
        data: user.watchlist 
      });
    }

    // Add item to watchlist
    user.watchlist.push(itemId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to watchlist',
      data: user.watchlist,
    });
  } catch (error) {
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

    // Remove item from watchlist
    user.watchlist = user.watchlist.filter(id => id !== itemId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item removed from watchlist',
      data: user.watchlist,
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from watchlist' },
      { status: 500 }
    );
  }
}
