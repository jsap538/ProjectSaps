import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User, { ICartItem } from '@/models/User';
import Item from '@/models/Item';
import { sanitizeObjectId } from '@/lib/security';
import mongoose from 'mongoose';

// GET /api/cart - Get user's cart
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

    // Optimize: Fetch all cart items in a single query instead of N queries
    const itemIds = user.cart.map((cartItem: ICartItem) => cartItem.itemId);
    const items = await Item.find({ _id: { $in: itemIds } }).lean();
    
    // Create a Map for O(1) lookup
    const itemMap = new Map(
      items.map(item => [item._id.toString(), item])
    );
    
    // Map cart items with their full details
    const cartItems = user.cart.map((cartItem: ICartItem) => {
      const item = itemMap.get(cartItem.itemId.toString());
      return {
        itemId: cartItem.itemId.toString(),
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
        item: item ? {
          _id: String(item._id),
          title: item.title,
          brand: item.brand,
          price_cents: item.price_cents,
          images: item.images,
          condition: item.condition,
          isActive: item.isActive,
          isApproved: item.isApproved,
          isSold: item.isSold,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId: rawItemId, quantity = 1 } = await request.json();

    // SECURITY: Sanitize itemId to prevent NoSQL injection
    const itemId = sanitizeObjectId(rawItemId);
    if (!itemId) {
      return NextResponse.json({ error: 'Invalid Item ID' }, { status: 400 });
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

    // Check if item is already in cart
    const existingCartItem = user.cart.find((cartItem: ICartItem) => cartItem.itemId.toString() === itemId);
    
    if (existingCartItem) {
      return NextResponse.json({ 
        error: 'Item is already in your cart. Each item is unique in our marketplace.' 
      }, { status: 400 });
    } else {
      // Add new item to cart
      user.cart.push({
        itemId: new mongoose.Types.ObjectId(itemId),
        quantity,
        addedAt: new Date(),
      } as ICartItem);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: user.cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('DELETE request body:', body); // Debug log
    
    const { itemId: rawItemId } = body;

    // SECURITY: Sanitize itemId to prevent NoSQL injection
    const itemId = sanitizeObjectId(rawItemId);
    if (!itemId) {
      console.error('Invalid itemId in request body:', body);
      return NextResponse.json({ error: 'Invalid Item ID' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove item from cart
    user.cart = user.cart.filter((cartItem: ICartItem) => cartItem.itemId.toString() !== itemId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      data: user.cart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
