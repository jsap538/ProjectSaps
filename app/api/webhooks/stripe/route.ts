import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import { Order, Item } from '@/models';
import { stripe } from '@/lib/stripe';

/**
 * Stripe Webhook Handler
 * Processes events from Stripe (payment confirmations, failures, refunds, etc.)
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`✅ Webhook received: ${event.type}`);

  try {
    await connectDB();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      case 'account.updated':
        // Handle Connect seller account updates
        console.log('Seller account updated:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    console.error(`Order not found: ${orderId}`);
    return;
  }

  // Update order status
  order.paymentStatus = 'paid';
  order.paidAt = new Date();
  order.status = 'confirmed'; // Move from pending to confirmed
  order.confirmedAt = new Date();
  await order.save();

  // Mark items as sold
  const itemIds = order.items.map((item: any) => item.itemId);
  await Item.updateMany(
    { _id: { $in: itemIds } },
    {
      isSold: true,
      soldAt: new Date(),
      soldTo: order.buyerId,
      isActive: false, // Remove from marketplace
    }
  );

  console.log(`✅ Order ${order.orderNumber} marked as paid and confirmed`);
  // TODO: Send confirmation email to buyer and seller
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    console.error(`Order not found: ${orderId}`);
    return;
  }

  // Update order status
  order.paymentStatus = 'failed';
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = 'Payment failed';
  await order.save();

  // CRITICAL: Release reserved items back to marketplace
  // Clear the reservation so items can be purchased by others
  const itemIds = order.items.map((item: any) => item.itemId);
  await Item.updateMany(
    { _id: { $in: itemIds } },
    {
      $set: { moderationNotes: '' }, // Clear reservation
    }
  );

  console.log(`❌ Order ${order.orderNumber} payment failed - items released back to marketplace`);
  // TODO: Send failure notification to buyer
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) return;

  const order = await Order.findById(orderId);
  if (!order) return;

  order.paymentStatus = 'failed';
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = 'Payment canceled';
  await order.save();

  // CRITICAL: Release reserved items back to marketplace
  const itemIds = order.items.map((item: any) => item.itemId);
  await Item.updateMany(
    { _id: { $in: itemIds } },
    {
      $set: { moderationNotes: '' }, // Clear reservation
    }
  );

  console.log(`🚫 Order ${order.orderNumber} payment canceled - items released back to marketplace`);
}

/**
 * Handle charge refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  const order = await Order.findOne({ paymentIntentId });
  if (!order) {
    console.error(`Order not found for payment intent: ${paymentIntentId}`);
    return;
  }

  order.paymentStatus = 'refunded';
  order.refund = {
    amount_cents: charge.amount_refunded,
    reason: 'Refund processed',
    status: 'completed',
    requestedAt: new Date(),
    processedAt: new Date(),
  };
  await order.save();

  console.log(`💰 Order ${order.orderNumber} refunded`);
  // TODO: Send refund confirmation email
}

/**
 * Handle dispute created
 */
async function handleDisputeCreated(dispute: Stripe.Dispute) {
  const paymentIntentId = dispute.payment_intent as string;

  const order = await Order.findOne({ paymentIntentId });
  if (!order) {
    console.error(`Order not found for payment intent: ${paymentIntentId}`);
    return;
  }

  order.isDisputed = true;
  order.disputedAt = new Date();
  order.disputeReason = dispute.reason || 'Dispute opened by customer';
  await order.save();

  console.log(`⚠️ Dispute opened for order ${order.orderNumber}`);
  // TODO: Send alert to admin and seller
}

