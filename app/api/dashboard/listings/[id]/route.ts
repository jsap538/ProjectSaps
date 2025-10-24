import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders, sanitizeObjectId } from '@/lib/security';

export const DELETE = withErrorHandling(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  const itemId = sanitizeObjectId(params.id);

  await connectDB();

  // Get user
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User not found');

  // Find and delete item
  const item = await Item.findOneAndDelete({
    _id: itemId,
    sellerId: user._id
  });

  if (!item) {
    throw ApiErrors.notFound('Item not found or not owned by user');
  }

  return successResponse(
    { itemId },
    'Item deleted successfully'
  );
});

export const PATCH = withErrorHandling(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  const itemId = sanitizeObjectId(params.id);
  const { action, data } = await request.json();

  await connectDB();

  // Get user
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User not found');

  let result;

  switch (action) {
    case 'toggle_active':
      result = await Item.findOneAndUpdate(
        { _id: itemId, sellerId: user._id },
        { $set: { isActive: !data.currentActive } },
        { new: true }
      );
      break;

    case 'update_price':
      if (!data.price || data.price <= 0) {
        throw ApiErrors.badRequest('Invalid price');
      }
      result = await Item.findOneAndUpdate(
        { _id: itemId, sellerId: user._id },
        { $set: { price_cents: Math.round(data.price * 100) } },
        { new: true }
      );
      break;

    default:
      throw ApiErrors.badRequest('Invalid action');
  }

  if (!result) {
    throw ApiErrors.notFound('Item not found or not owned by user');
  }

  return successResponse(
    { item: result },
    'Item updated successfully'
  );
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
