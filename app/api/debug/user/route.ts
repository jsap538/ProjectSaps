import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not signed in' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    // Check if user exists in MongoDB
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // User doesn't exist in MongoDB, create them
      user = await User.create({
        clerkId: userId,
        email: 'user@example.com', // This will be updated by webhook
        firstName: 'User',
        lastName: 'Name',
        isSeller: false,
      });
      
      return NextResponse.json({
        success: true,
        message: 'User created in MongoDB',
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          isSeller: user.isSeller,
          createdAt: user.createdAt,
        }
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'User found in MongoDB',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSeller: user.isSeller,
        createdAt: user.createdAt,
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
