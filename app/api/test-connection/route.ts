import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to MongoDB',
        error: errorMessage,
        stack: errorStack,
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      },
      { status: 500 }
    );
  }
}
