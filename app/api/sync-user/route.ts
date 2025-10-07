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

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });
    
    if (user) {
      return NextResponse.json({
        success: true,
        message: 'User already exists in MongoDB',
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSeller: user.isSeller,
        }
      }, { headers: corsHeaders });
    }

    // Create new user record
    user = new User({
      clerkId: userId,
      email: 'jsap538@gmail.com', // Your email
      firstName: 'User', // Will be updated when you update your profile
      lastName: 'Name',
      isSeller: false,
      rating: 0,
      totalSales: 0,
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'User synced to MongoDB successfully',
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
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
