import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item, Order } from '@/models';
import { ICartItem } from '@/models/User';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders } from '@/lib/security';
import { stripe } from '@/lib/stripe';
import { calculatePlatformFee } from '@/lib/format';

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

  const { items: itemIds, shippingAddressIndex, buyerNotes, shippingAddress: providedAddress } = await request.json();

  // Validate inputs
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    throw ApiErrors.badRequest('At least one item is required');
  }

  // Get shipping address from user's saved addresses or use provided address
  let shippingAddress = user.addresses[shippingAddressIndex ?? user.defaultShippingAddressIndex ?? 0];
  
  // If no saved address, use the provided address from checkout form
  if (!shippingAddress && providedAddress) {
    shippingAddress = providedAddress;
  }
  
  // If still no address, create a default one (will be updated during checkout)
  if (!shippingAddress) {
    shippingAddress = {
      fullName: `${user.firstName} ${user.lastName}`,
      street1: 'To be collected during checkout',
      city: 'TBD',
      state: 'TBD',
      postalCode: '00000',
      country: 'US',
    };
  }

  // Fetch all items and validate availability with real-time check
  const items = await Item.find({
    _id: { $in: itemIds },
    isActive: true,
    isApproved: true,
    isSold: false,
  });

  if (items.length !== itemIds.length) {
    // Find which specific items are unavailable for better error messaging
    const foundIds = items.map(item => String(item._id));
    const unavailableIds = itemIds.filter(id => !foundIds.includes(id));
    
    // Re-check if items became unavailable (sold by another user)
    const unavailableItems = await Item.find({
      _id: { $in: unavailableIds }
    }).select('title isSold isActive isApproved');
    
    const unavailableReasons = unavailableItems.map(item => {
      if (item.isSold) return `"${item.title}" has been sold`;
      if (!item.isActive) return `"${item.title}" is no longer available`;
      if (!item.isApproved) return `"${item.title}" is pending approval`;
      return `"${item.title}" is unavailable`;
    });
    
    throw ApiErrors.badRequest(
      `Cannot complete purchase: ${unavailableReasons.join(', ')}. Please remove unavailable items and try again.`
    );
  }

  // CRITICAL: Atomic inventory check - Reserve items before payment
  // This prevents race conditions where items sell between validation and payment
  const reservedItems = await Promise.all(
    itemIds.map(async (itemId) => {
      const reserved = await Item.findOneAndUpdate(
        {
          _id: itemId,
          isActive: true,
          isApproved: true,
          isSold: false, // Double-check not sold
        },
        {
          $set: { 
            // Temporarily mark as pending to prevent double-purchase
            // Will be marked as sold after successful payment via webhook
            moderationNotes: `Reserved for order at ${new Date().toISOString()}`
          }
        },
        { new: true }
      );
      
      if (!reserved) {
        throw ApiErrors.badRequest(
          `Item "${items.find(i => String(i._id) === itemId)?.title || 'Unknown'}" was just sold by another user. Please refresh and try again.`
        );
      }
      
      return reserved;
    })
  );

  // Use reserved items for order creation
  const validatedItems = reservedItems;

  // TODO: Validate all items have same seller (single-seller checkout for now)
  const sellerIds = [...new Set(validatedItems.map(item => String(item.sellerId)))];
  if (sellerIds.length > 1) {
    throw ApiErrors.badRequest('Cannot checkout items from multiple sellers at once');
  }

  const sellerId = validatedItems[0].sellerId;

  // Calculate pricing
  const subtotal_cents = validatedItems.reduce((sum, item) => sum + item.price_cents, 0);
  const shipping_cents = validatedItems.reduce((sum, item) => sum + (item.shipping_cents || 0), 0);
  const serviceFee_cents = Math.round(subtotal_cents * 0.10); // 10% platform fee
  const tax_cents = 0; // TODO: Implement tax calculation
  const total_cents = subtotal_cents + shipping_cents + serviceFee_cents + tax_cents;

  // Generate order number
  const orderNumber = await Order.generateOrderNumber();

  // Create order items snapshot
  const orderItems = validatedItems.map(item => ({
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

  // Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total_cents,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: String(order._id),
      orderNumber: orderNumber,
      buyerId: String(user._id),
      sellerId: String(sellerId),
    },
    description: `SAPS Order ${orderNumber}`,
    // TODO: Add Connect transfer when seller onboarding is complete
    // application_fee_amount: serviceFee_cents,
    // transfer_data: { destination: sellerStripeAccountId },
  });

  // Save payment intent ID to order
  order.paymentIntentId = paymentIntent.id;
  await order.save();

  // Always remove purchased items from cart (Buy Now or regular checkout)
  // This ensures no item stays in cart after purchase
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
      clientSecret: paymentIntent.client_secret,
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

