import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  console.log('User profile API - User ID:', userId);
  
  if (!userId) {
    console.log('User profile API - No user ID found, returning unauthorized');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  await connectDB();
  
  try {
    const user = await User.findOne({ clerkId: userId }).select('-__v');
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      user: user
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile' }, { status: 500, headers: corsHeaders });
  }
}
