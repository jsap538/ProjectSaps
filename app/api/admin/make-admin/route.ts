import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    await connectDB();
    
    // Find the current user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    // Make the user an admin
    user.isAdmin = true;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'You are now an admin!',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to make user admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
