import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Report, Item } from '@/models';
import { isValidObjectId, corsHeaders } from '@/lib/security';

// POST /api/reports/[id]/resolve - Resolve a report (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  await connectDB();
  
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Report ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify user is admin
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const { action, adminNotes } = await request.json();

    // Validate action
    const validActions = ['dismissed', 'item_removed', 'user_warned', 'user_banned'];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Valid action is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find the report
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Update report status
    report.status = 'resolved';
    report.action = action;
    report.reviewedBy = user._id;
    report.reviewedAt = new Date();
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }
    await report.save();

    // Take action based on admin decision
    if (action === 'item_removed') {
      await Item.findByIdAndUpdate(report.itemId, {
        isActive: false,
        moderationNotes: `Removed by admin: ${adminNotes || 'Violation of terms'}`,
      });
    }

    console.log(`Report ${id} resolved by admin ${userId} with action: ${action}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Report resolved successfully',
        data: report,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error resolving report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve report' },
      { status: 500, headers: corsHeaders }
    );
  }
}


