import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get total count of items
    const totalItems = await Item.countDocuments();
    
    // Get all items (limit to 5 for testing)
    const items = await Item.find({}).limit(5).lean();
    
    return NextResponse.json({
      success: true,
      totalItems,
      items: items,
      message: 'Database connection and items query working!'
    });
    
  } catch (error) {
    console.error('Error testing items:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to database or fetch items'
    }, { status: 500 });
  }
}
