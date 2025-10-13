import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { corsHeaders } from '@/lib/security';

// GET /api/items/my-items - Get current user's items
export const GET = withRateLimit(rateLimiters.general, async (_request: NextRequest) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get user's items
    const items = await Item.find({ 
      sellerId: user._id,
      isActive: true // Only show active items
    })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: items,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
});

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
