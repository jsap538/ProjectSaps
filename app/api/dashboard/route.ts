import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User, Item, Order } from '@/models';
import { withErrorHandling, ApiErrors, successResponse } from '@/lib/errors';
import { corsHeaders } from '@/lib/security';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) throw ApiErrors.unauthorized();

  await connectDB();

  // Get user data
  const user = await User.findOne({ clerkId: userId }).lean();
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
    viewsOverTime,
    topPerformingItems,
    conversionRates
  ] = await Promise.all([
    // Total revenue from completed orders
    Order.aggregate([
      { $match: { sellerId: user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total_cents' } } }
    ]).then(result => result[0]?.total || 0),

    // Active listings count
    Item.countDocuments({ sellerId: user._id, status: 'active' }),

    // Pending approvals count
    Item.countDocuments({ sellerId: user._id, status: 'pending' }),

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
      status: { $in: ['confirmed', 'shipped'] },
      shippingStatus: { $ne: 'delivered' }
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

    // Views over time (last 30 days)
    Item.aggregate([
      { $match: { sellerId: user._id } },
      { $unwind: '$stats.viewsHistory' },
      { $match: { 'stats.viewsHistory.date': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$stats.viewsHistory.date' } }, views: { $sum: '$stats.viewsHistory.count' } } },
      { $sort: { _id: 1 } }
    ]),

    // Top performing items
    Item.find({ sellerId: user._id })
      .sort({ 'stats.views': -1 })
      .limit(5)
      .select('title price_cents stats.views stats.favorites')
      .lean(),

    // Conversion rates
    Item.aggregate([
      { $match: { sellerId: user._id } },
      { $group: { 
        _id: null, 
        totalViews: { $sum: '$stats.views' },
        totalFavorites: { $sum: '$stats.favorites' },
        totalSold: { $sum: '$stats.sold' }
      } }
    ]).then(result => {
      const data = result[0] || { totalViews: 0, totalFavorites: 0, totalSold: 0 };
      return {
        viewToFavorite: data.totalViews > 0 ? (data.totalFavorites / data.totalViews * 100).toFixed(2) : 0,
        favoriteToSale: data.totalFavorites > 0 ? (data.totalSold / data.totalFavorites * 100).toFixed(2) : 0,
        viewToSale: data.totalViews > 0 ? (data.totalSold / data.totalViews * 100).toFixed(2) : 0
      };
    })
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
      status: item.status,
      views: item.stats?.views || 0,
      favorites: item.stats?.favorites || 0,
      createdAt: item.createdAt
    })),
    recentOrders: recentOrdersList.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      buyerName: `${order.buyerId.firstName} ${order.buyerId.lastName}`,
      total: order.total_cents / 100,
      status: order.status,
      createdAt: order.createdAt
    })),
    analytics: {
      viewsOverTime: viewsOverTime.map(item => ({
        date: item._id,
        views: item.views
      })),
      topPerformingItems: topPerformingItems.map(item => ({
        id: item._id,
        title: item.title,
        price: item.price_cents / 100,
        views: item.stats?.views || 0,
        favorites: item.stats?.favorites || 0
      })),
      conversionRates
    }
  };

  return successResponse(dashboardData, 'Dashboard data retrieved successfully');
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
