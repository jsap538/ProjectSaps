import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item, Order } from '@/models';
import { ICartItem } from '@/models/User';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders } from '@/lib/security';

/**
 * GET /api/orders - Get user's orders (buyer or seller)
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User');

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'buyer'; // 'buyer' or 'seller'
  const status = searchParams.get('status'); // Optional filter

  const query: any = role === 'seller' 
    ? { sellerId: user._id }
    : { buyerId: user._id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('buyerId', 'firstName lastName email')
    .populate('sellerId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return successResponse(orders);
});

/**
 * POST /api/orders - Create new order (checkout)
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User');
  if (!user.canBuy()) throw ApiErrors.forbidden('Account suspended or inactive');

  const { items: itemIds, shippingAddressIndex, buyerNotes } = await request.json();

  // Validate inputs
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    throw ApiErrors.badRequest('At least one item is required');
  }

  // Get shipping address
  const shippingAddress = user.addresses[shippingAddressIndex ?? user.defaultShippingAddressIndex ?? 0];
  if (!shippingAddress) {
    throw ApiErrors.badRequest('Shipping address is required');
  }

  // Fetch all items and validate availability
  const items = await Item.find({
    _id: { $in: itemIds },
    isActive: true,
    isApproved: true,
    isSold: false,
  });

  if (items.length !== itemIds.length) {
    throw ApiErrors.badRequest('Some items are no longer available');
  }

  // TODO: Validate all items have same seller (single-seller checkout for now)
  const sellerIds = [...new Set(items.map(item => item.sellerId.toString()))];
  if (sellerIds.length > 1) {
    throw ApiErrors.badRequest('Cannot checkout items from multiple sellers at once');
  }

  const sellerId = items[0].sellerId;

  // Calculate pricing
  const subtotal_cents = items.reduce((sum, item) => sum + item.price_cents, 0);
  const shipping_cents = items.reduce((sum, item) => sum + (item.shipping_cents || 0), 0);
  const serviceFee_cents = Math.round(subtotal_cents * 0.10); // 10% platform fee
  const tax_cents = 0; // TODO: Implement tax calculation
  const total_cents = subtotal_cents + shipping_cents + serviceFee_cents + tax_cents;

  // Generate order number
  const orderNumber = await Order.generateOrderNumber();

  // Create order items snapshot
  const orderItems = items.map(item => ({
    itemId: item._id,
    title: item.title,
    brand: item.brand,
    price_cents: item.price_cents,
    shipping_cents: item.shipping_cents,
    condition: item.condition,
    imageUrl: item.getMainImageUrl() || '',
    quantity: 1,
  }));

  // Create order
  const order = await Order.create({
    orderNumber,
    buyerId: user._id,
    sellerId,
    items: orderItems,
    subtotal_cents,
    shipping_cents,
    tax_cents,
    serviceFee_cents,
    total_cents,
    paymentStatus: 'pending',
    status: 'pending',
    shippingAddress: {
      fullName: shippingAddress.fullName,
      street1: shippingAddress.street1,
      street2: shippingAddress.street2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
    },
    buyerNotes,
  });

  // TODO: Create Stripe Payment Intent
  // const paymentIntent = await stripe.paymentIntents.create({...});
  // order.paymentIntentId = paymentIntent.id;
  // await order.save();

  // Remove items from cart
  user.cart = user.cart.filter((cartItem: ICartItem) => 
    !itemIds.includes(cartItem.itemId.toString())
  );
  await user.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('buyerId', 'firstName lastName email')
    .populate('sellerId', 'firstName lastName email')
    .lean();

  return successResponse(
    {
      order: populatedOrder,
      // paymentClientSecret: paymentIntent.client_secret, // TODO: Return for frontend
    },
    'Order created successfully. Complete payment to confirm.',
    201
  );
});

/**
 * OPTIONS /api/orders - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

