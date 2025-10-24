import { Item, Order, User } from '@/models';
import connectDB from '@/lib/mongodb';

export interface AnalyticsData {
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
  topPerformingItems: Array<{
    id: string;
    title: string;
    price: number;
    views: number;
    favorites: number;
    sold: number;
    revenue: number;
  }>;
  conversionRates: {
    viewToFavorite: number;
    favoriteToSale: number;
    viewToSale: number;
  };
  dailyStats: {
    views: number;
    favorites: number;
    sales: number;
    revenue: number;
  };
}

export class AnalyticsService {
  static async getSellerAnalytics(sellerId: string, timeRange: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
    await connectDB();

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get views over time
    const viewsOverTime = await Item.aggregate([
      { $match: { sellerId: sellerId } },
      { $unwind: '$stats.viewsHistory' },
      { $match: { 'stats.viewsHistory.date': { $gte: startDate } } },
      { $group: { 
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$stats.viewsHistory.date' } }, 
        views: { $sum: '$stats.viewsHistory.count' } 
      } },
      { $sort: { _id: 1 } }
    ]);

    // Get top performing items
    const topPerformingItems = await Item.find({ sellerId: sellerId })
      .sort({ 'stats.views': -1 })
      .limit(10)
      .select('title price_cents stats.views stats.favorites stats.sold stats.revenue')
      .lean();

    // Get conversion rates
    const conversionData = await Item.aggregate([
      { $match: { sellerId: sellerId } },
      { $group: { 
        _id: null, 
        totalViews: { $sum: '$stats.views' },
        totalFavorites: { $sum: '$stats.favorites' },
        totalSold: { $sum: '$stats.sold' }
      } }
    ]);

    const conversion = conversionData[0] || { totalViews: 0, totalFavorites: 0, totalSold: 0 };
    
    const conversionRates = {
      viewToFavorite: conversion.totalViews > 0 ? (conversion.totalFavorites / conversion.totalViews * 100) : 0,
      favoriteToSale: conversion.totalFavorites > 0 ? (conversion.totalSold / conversion.totalFavorites * 100) : 0,
      viewToSale: conversion.totalViews > 0 ? (conversion.totalSold / conversion.totalViews * 100) : 0
    };

    // Get daily stats
    const dailyStats = await Item.aggregate([
      { $match: { sellerId: sellerId } },
      { $group: { 
        _id: null,
        views: { $sum: '$stats.dailyViews' },
        favorites: { $sum: '$stats.dailyFavorites' },
        sales: { $sum: '$stats.sold' },
        revenue: { $sum: '$stats.revenue' }
      } }
    ]);

    return {
      viewsOverTime: viewsOverTime.map(item => ({
        date: item._id,
        views: item.views
      })),
      topPerformingItems: topPerformingItems.map(item => ({
        id: item._id.toString(),
        title: item.title,
        price: item.price_cents / 100,
        views: item.stats?.views || 0,
        favorites: item.stats?.favorites || 0,
        sold: item.stats?.sold || 0,
        revenue: item.stats?.revenue || 0
      })),
      conversionRates,
      dailyStats: dailyStats[0] || { views: 0, favorites: 0, sales: 0, revenue: 0 }
    };
  }

  static async trackItemView(itemId: string, userId?: string): Promise<void> {
    await connectDB();

    const item = await Item.findById(itemId);
    if (!item) return;

    // Increment view count
    item.stats.views += 1;
    item.stats.dailyViews += 1;
    item.stats.lastViewedAt = new Date();

    // Add to views history
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingEntry = item.stats.viewsHistory.find(
      entry => entry.date.getTime() === today.getTime()
    );

    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      item.stats.viewsHistory.push({
        date: today,
        count: 1
      });
    }

    // Keep only last 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    item.stats.viewsHistory = item.stats.viewsHistory.filter(
      entry => entry.date >= cutoffDate
    );

    await item.save();
  }

  static async trackItemFavorite(itemId: string, userId: string): Promise<void> {
    await connectDB();

    const item = await Item.findById(itemId);
    if (!item) return;

    item.stats.favorites += 1;
    item.stats.dailyFavorites += 1;
    item.stats.lastFavoritedAt = new Date();

    await item.save();
  }

  static async trackItemSale(itemId: string, revenue: number): Promise<void> {
    await connectDB();

    const item = await Item.findById(itemId);
    if (!item) return;

    item.stats.sold += 1;
    item.stats.revenue += revenue;

    await item.save();
  }

  static async resetDailyStats(): Promise<void> {
    await connectDB();

    // Reset daily counters for all items
    await Item.updateMany(
      {},
      { 
        $set: { 
          'stats.dailyViews': 0,
          'stats.dailyFavorites': 0
        } 
      }
    );
  }
}
