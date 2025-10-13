import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Order } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders } from '@/lib/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/orders/[id] - Get single order details
 */
export const GET = withErrorHandling(async (
  request: NextRequest,
  context: RouteContext
) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User');

  const { id } = await context.params;
  
  const order = await Order.findById(id)
    .populate('buyerId', 'firstName lastName email profileImageUrl')
    .populate('sellerId', 'firstName lastName email profileImageUrl stats')
    .lean();

  if (!order) throw ApiErrors.notFound('Order');

  // Verify user has access to this order
  const isBuyer = order.buyerId._id.toString() === user._id.toString();
  const isSeller = order.sellerId._id.toString() === user._id.toString();
  const isAdmin = user.isAdmin;

  if (!isBuyer && !isSeller && !isAdmin) {
    throw ApiErrors.forbidden('You do not have access to this order');
  }

  return successResponse(order);
});

/**
 * PATCH /api/orders/[id] - Update order status
 */
export const PATCH = withErrorHandling(async (
  request: NextRequest,
  context: RouteContext
) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User');

  const { id } = await context.params;
  const { action, tracking, cancellationReason } = await request.json();

  const order = await Order.findById(id);
  if (!order) throw ApiErrors.notFound('Order');

  // Verify user has permission
  const isBuyer = order.buyerId.toString() === user._id.toString();
  const isSeller = order.sellerId.toString() === user._id.toString();
  const isAdmin = user.isAdmin;

  // Handle different actions
  switch (action) {
    case 'confirm':
      // Seller confirms order
      if (!isSeller && !isAdmin) {
        throw ApiErrors.forbidden('Only seller can confirm order');
      }
      if (order.status !== 'pending') {
        throw ApiErrors.badRequest('Order cannot be confirmed in current state');
      }
      order.status = 'confirmed';
      order.confirmedAt = new Date();
      break;

    case 'ship':
      // Seller marks as shipped with tracking
      if (!isSeller && !isAdmin) {
        throw ApiErrors.forbidden('Only seller can ship order');
      }
      if (!order.canBeShipped()) {
        throw ApiErrors.badRequest('Order cannot be shipped in current state');
      }
      if (!tracking?.carrier || !tracking?.trackingNumber) {
        throw ApiErrors.badRequest('Tracking information is required');
      }
      order.status = 'shipped';
      order.shippedAt = new Date();
      order.tracking = {
        carrier: tracking.carrier,
        trackingNumber: tracking.trackingNumber,
        trackingUrl: tracking.trackingUrl,
        shippedAt: new Date(),
        estimatedDelivery: tracking.estimatedDelivery,
      };
      break;

    case 'deliver':
      // Mark as delivered (can be auto-triggered by tracking webhook)
      if (order.status !== 'shipped') {
        throw ApiErrors.badRequest('Order must be shipped first');
      }
      order.status = 'delivered';
      order.deliveredAt = new Date();
      if (order.tracking) {
        order.tracking.deliveredAt = new Date();
      }
      break;

    case 'complete':
      // Buyer confirms receipt and completes order
      if (!isBuyer && !isAdmin) {
        throw ApiErrors.forbidden('Only buyer can complete order');
      }
      if (order.status !== 'delivered') {
        throw ApiErrors.badRequest('Order must be delivered first');
      }
      order.status = 'completed';
      order.completedAt = new Date();
      // TODO: Release payment to seller
      break;

    case 'cancel':
      // Buyer or seller can cancel before shipping
      if (!isBuyer && !isSeller && !isAdmin) {
        throw ApiErrors.forbidden('You cannot cancel this order');
      }
      if (!order.canBeCancelled()) {
        throw ApiErrors.badRequest('Order cannot be cancelled in current state');
      }
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancellationReason = cancellationReason || 'Cancelled by user';
      // TODO: Refund payment if already paid
      break;

    case 'dispute':
      // Buyer disputes order
      if (!isBuyer && !isAdmin) {
        throw ApiErrors.forbidden('Only buyer can dispute order');
      }
      order.isDisputed = true;
      order.disputedAt = new Date();
      order.disputeReason = cancellationReason || 'Dispute opened';
      break;

    default:
      throw ApiErrors.badRequest(`Unknown action: ${action}`);
  }

  await order.save();

  const updatedOrder = await Order.findById(order._id)
    .populate('buyerId', 'firstName lastName email')
    .populate('sellerId', 'firstName lastName email')
    .lean();

  return successResponse(updatedOrder, 'Order updated successfully');
});

/**
 * OPTIONS /api/orders/[id] - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

