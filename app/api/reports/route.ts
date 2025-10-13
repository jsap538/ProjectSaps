import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item, Report } from '@/models';
import { corsHeaders } from '@/lib/security';

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const { itemId, reason, description } = await request.json();

    // Validate inputs
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: 'Report reason is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const validReasons = ['counterfeit', 'inappropriate', 'misleading', 'prohibited', 'spam', 'copyright', 'other'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid report reason' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if user already reported this item
    const existingReport = await Report.findOne({
      itemId,
      reporterId: user._id,
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this item' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create the report
    const report = await Report.create({
      itemId,
      reporterId: user._id,
      reason,
      description: description || '',
      status: 'pending',
    });

    // Check if item should be auto-taken down
    const shouldTakedown = await Report.shouldAutoTakedown(itemId);
    
    if (shouldTakedown) {
      // Auto-deactivate item after 3 reports
      await Item.findByIdAndUpdate(itemId, {
        isActive: false,
        moderationNotes: `Auto-deactivated due to ${await Report.countReportsForItem(itemId)} user reports`,
      });

      console.log(`Item ${itemId} auto-deactivated due to multiple reports`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Report submitted successfully. Our team will review it shortly.',
        data: report,
        autoTakenDown: shouldTakedown,
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET /api/reports - Get all reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();

    // Verify user is admin
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    // Get reports filtered by status
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('itemId', 'title brand images isActive')
      .populate('reporterId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: reports,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}


