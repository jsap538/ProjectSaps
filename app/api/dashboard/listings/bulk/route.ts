import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders, sanitizeObjectId } from '@/lib/security';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  const { action, itemIds } = await request.json();

  if (!action || !itemIds || !Array.isArray(itemIds)) {
    throw ApiErrors.badRequest('Invalid request data');
  }

  await connectDB();

  // Get user
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User not found');

  // Validate item IDs and ownership
  const validItemIds = itemIds.map(id => sanitizeObjectId(id));
  const items = await Item.find({
    _id: { $in: validItemIds },
    sellerId: user._id
  });

  if (items.length !== validItemIds.length) {
    throw ApiErrors.badRequest('Some items not found or not owned by user');
  }

  let result;

  switch (action) {
    case 'delete':
      result = await Item.deleteMany({
        _id: { $in: validItemIds },
        sellerId: user._id
      });
      break;

    case 'activate':
      result = await Item.updateMany(
        { _id: { $in: validItemIds }, sellerId: user._id },
        { $set: { isActive: true } }
      );
      break;

    case 'deactivate':
      result = await Item.updateMany(
        { _id: { $in: validItemIds }, sellerId: user._id },
        { $set: { isActive: false } }
      );
      break;

    default:
      throw ApiErrors.badRequest('Invalid action');
  }

  return successResponse(
    { 
      action, 
      affectedCount: 'modifiedCount' in result ? result.modifiedCount : result.deletedCount,
      itemIds: validItemIds 
    },
    `Bulk ${action} completed successfully`
  );
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
