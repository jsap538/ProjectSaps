import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not signed in' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    // Find user and make them a seller
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { isSeller: true },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'User is now a seller',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSeller: user.isSeller,
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error making user a seller:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
