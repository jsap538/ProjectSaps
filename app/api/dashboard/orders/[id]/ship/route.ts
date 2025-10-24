import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Order } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders, sanitizeObjectId } from '@/lib/security';

export const POST = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  const { id } = await params;
  const orderId = sanitizeObjectId(id);
  const { trackingNumber, carrier } = await request.json();

  await connectDB();

  // Get user
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User not found');

  // Find and update order
  const order = await Order.findOneAndUpdate(
    { 
      _id: orderId, 
      sellerId: user._id,
      status: 'confirmed' // Only confirmed orders can be shipped
    },
    { 
      $set: { 
        status: 'shipped',
        shippingStatus: 'shipped',
        trackingNumber,
        carrier,
        shippedAt: new Date()
      } 
    },
    { new: true }
  );

  if (!order) {
    throw ApiErrors.notFound('Order not found, not owned by user, or not in confirmed status');
  }

  return successResponse(
    { 
      orderId,
      status: order.status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier
    },
    'Order marked as shipped successfully'
  );
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
