import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { Item } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders, sanitizeObjectId } from '@/lib/security';

export const POST = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  const { id } = await params;
  const itemId = sanitizeObjectId(id);

  await connectDB();

  // Find the item
  const item = await Item.findById(itemId);
  if (!item) throw ApiErrors.notFound('Item not found');

  // Increment view count
  item.stats.views += 1;
  item.stats.dailyViews += 1;
  item.stats.lastViewedAt = new Date();

  // Add to views history (daily aggregation)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingHistoryEntry = item.stats.viewsHistory.find(
    entry => entry.date.getTime() === today.getTime()
  );

  if (existingHistoryEntry) {
    existingHistoryEntry.count += 1;
  } else {
    item.stats.viewsHistory.push({
      date: today,
      count: 1
    });
  }

  // Keep only last 90 days of history
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  item.stats.viewsHistory = item.stats.viewsHistory.filter(
    entry => entry.date >= cutoffDate
  );

  await item.save();

  return successResponse(
    { views: item.stats.views },
    'View tracked successfully'
  );
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
