import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withRateLimit, rateLimiters } from '@/lib/rate-limit';
import { corsHeaders } from '@/lib/security';

// POST /api/profile/become-seller - Make user a seller
export const POST = withRateLimit(rateLimiters.general, async (_request: NextRequest) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    if (user.isSeller) {
      return NextResponse.json(
        { error: 'User is already a seller' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update user to be a seller
    user.isSeller = true;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully became a seller',
        data: {
          isSeller: user.isSeller,
        },
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error updating seller status:', error);
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
