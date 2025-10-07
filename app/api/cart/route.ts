import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User, { ICartItem } from '@/models/User';
import Item from '@/models/Item';

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

    // Get full item details for cart items
    const cartItems = await Promise.all(
      user.cart.map(async (cartItem: ICartItem) => {
        const item = await Item.findById(cartItem.itemId);
        return {
          ...cartItem.toObject(),
          item: item ? {
            _id: item._id,
            title: item.title,
            brand: item.brand,
            price_cents: item.price_cents,
            images: item.images,
            condition: item.condition,
          } : null,
        };
      })
    );

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

    const { itemId, quantity = 1 } = await request.json();

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

    // Check if item is already in cart
    const existingCartItem = user.cart.find(cartItem => cartItem.itemId === itemId);
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        itemId,
        quantity,
        addedAt: new Date(),
      });
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

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove item from cart
    user.cart = user.cart.filter(cartItem => cartItem.itemId !== itemId);
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
