import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { isValidObjectId, corsHeaders } from '@/lib/security';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  await connectDB();
  
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid Item ID' }, { status: 400, headers: corsHeaders });
    }

    // Check if user is admin
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.isAdmin) {
      return NextResponse.json({ success: false, error: 'Admin privileges required' }, { status: 403, headers: corsHeaders });
    }

    // Find and approve the item
    const item = await Item.findByIdAndUpdate(
      id,
      { 
        isApproved: true,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('sellerId', 'firstName lastName email');

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404, headers: corsHeaders });
    }

    console.log(`Item ${id} approved by admin ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Item approved successfully',
      data: item
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error approving item:', error);
    return NextResponse.json({ success: false, error: 'Failed to approve item' }, { status: 500, headers: corsHeaders });
  }
}
