import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item, Order } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders } from '@/lib/security';
import { AnalyticsService } from '@/lib/analytics';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  // Get user data
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw ApiErrors.notFound('User not found');

  // Get seller stats
  const [
    totalRevenue,
    activeListings,
    pendingApprovals,
    totalViews,
    totalFavorites,
    recentOrders,
    ordersRequiringShipping,
    recentListings,
    recentOrdersList,
    analyticsData
  ] = await Promise.all([
    // Total revenue from completed orders
    Order.aggregate([
      { $match: { sellerId: user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total_cents' } } }
    ]).then(result => result[0]?.total || 0),

    // Active listings count
    Item.countDocuments({ sellerId: user._id, isActive: true, isApproved: true, isSold: false }),

    // Pending approvals count
    Item.countDocuments({ sellerId: user._id, isApproved: false }),

    // Total views across all items
    Item.aggregate([
      { $match: { sellerId: user._id } },
      { $group: { _id: null, total: { $sum: '$stats.views' } } }
    ]).then(result => result[0]?.total || 0),

    // Total favorites across all items
    Item.aggregate([
      { $match: { sellerId: user._id } },
      { $group: { _id: null, total: { $sum: '$stats.favorites' } } }
    ]).then(result => result[0]?.total || 0),

    // Recent orders count (last 30 days)
    Order.countDocuments({
      sellerId: user._id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }),

    // Orders requiring shipping
    Order.countDocuments({
      sellerId: user._id,
      status: { $in: ['confirmed', 'shipped'] }
    }),

    // Recent listings (last 10)
    Item.find({ sellerId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('category', 'name')
      .lean(),

    // Recent orders (last 10)
    Order.find({ sellerId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyerId', 'firstName lastName email')
      .lean(),

    // Get analytics data using the service
    AnalyticsService.getSellerAnalytics(user._id.toString(), '30d')
  ]);

  const dashboardData = {
    stats: {
      totalRevenue: totalRevenue / 100, // Convert cents to dollars
      activeListings,
      pendingApprovals,
      totalViews,
      totalFavorites,
      recentOrders,
      ordersRequiringShipping
    },
    recentListings: recentListings.map(item => ({
      id: item._id,
      title: item.title,
      price: item.price_cents / 100,
      status: item.isSold ? 'sold' : !item.isActive ? 'draft' : !item.isApproved ? 'pending' : 'active',
      views: item.stats?.views || 0,
      favorites: item.stats?.favorites || 0,
      createdAt: item.createdAt,
      imageUrl: item.images?.[0]?.url
    })),
    recentOrders: recentOrdersList.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      buyerName: `${(order.buyerId as any).firstName} ${(order.buyerId as any).lastName}`,
      buyerEmail: (order.buyerId as any).email,
      total: order.total_cents / 100,
      status: order.status,
      shippingStatus: order.status === 'delivered' ? 'delivered' : 
                     order.status === 'shipped' ? 'shipped' : 'pending',
      items: order.items.map((item: any) => ({
        title: item.title,
        price: item.price_cents / 100,
        quantity: item.quantity
      })),
      createdAt: order.createdAt,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        street1: order.shippingAddress.street1,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode
      }
    })),
    analytics: analyticsData
  };

  return successResponse(dashboardData, 'Dashboard data retrieved successfully');
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
