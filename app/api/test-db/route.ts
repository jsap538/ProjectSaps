import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get database stats
    const itemCount = await Item.countDocuments();
    const userCount = await User.countDocuments();
    
    // Get some sample items
    const sampleItems = await Item.find({}).limit(5).lean();
    
    // Get some sample users
    const sampleUsers = await User.find({}).limit(5).lean();
    
    return NextResponse.json({
      success: true,
      database: {
        name: process.env.MONGODB_URI?.split('/').pop()?.split('?')[0] || 'unknown',
        uri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      },
      counts: {
        items: itemCount,
        users: userCount
      },
      sampleItems,
      sampleUsers
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
