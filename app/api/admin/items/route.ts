import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

// GET /api/admin/items - Get all items for admin review
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  await connectDB();
  
  try {
    // Verify user is an admin
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Access denied. Administrator privileges required.' 
      }, { status: 403, headers: corsHeaders });
    }

    // Get all items with seller information
    const items = await Item.find({})
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: items
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error fetching admin items:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500, headers: corsHeaders });
  }
}
