"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
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
  }>;
  conversionRates: {
    viewToFavorite: number;
    favoriteToSale: number;
    viewToSale: number;
  };
}

interface AnalyticsProps {
  analytics: AnalyticsData;
  onRefresh: () => void;
}

export default function Analytics({ analytics, onRefresh }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'views' | 'revenue' | 'conversion'>('views');

  const viewsOverTime = analytics.viewsOverTime || [];
  const topPerformingItems = analytics.topPerformingItems || [];
  const conversionRates = analytics.conversionRates || {
    viewToFavorite: 0,
    favoriteToSale: 0,
    viewToSale: 0
  };

  const totalViews = viewsOverTime.reduce((sum, item) => sum + item.views, 0);
  const totalRevenue = topPerformingItems.reduce((sum, item) => sum + item.price, 0);
  const averageViews = viewsOverTime.length > 0 ? totalViews / viewsOverTime.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-porcelain">Analytics</h2>
          <p className="text-nickel text-sm">Track your performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-porcelain">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Avg. Views/Day</p>
              <p className="text-2xl font-bold text-porcelain">{Math.round(averageViews)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-porcelain">{conversionRates.viewToSale.toFixed(1)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Top Item Views</p>
              <p className="text-2xl font-bold text-porcelain">
                {topPerformingItems[0]?.views || 0}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time Chart */}
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-porcelain">Views Over Time</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('views')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-sap ${
                  chartType === 'views'
                    ? 'bg-titanium text-ink'
                    : 'bg-ink/20 text-nickel hover:text-porcelain'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-sap ${
                  chartType === 'revenue'
                    ? 'bg-titanium text-ink'
                    : 'bg-ink/20 text-nickel hover:text-porcelain'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {viewsOverTime.slice(-14).map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-titanium rounded-t"
                  style={{ height: `${(item.views / Math.max(...viewsOverTime.map(i => i.views))) * 200}px` }}
                ></div>
                <div className="text-xs text-nickel mt-2 transform -rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-porcelain mb-6">Conversion Funnel</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-ink/20">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-porcelain font-medium">Views</span>
              </div>
              <span className="text-porcelain font-bold">{totalViews.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-ink/20">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-porcelain font-medium">Favorites</span>
              </div>
              <span className="text-porcelain font-bold">
                {Math.round(totalViews * (conversionRates.viewToFavorite / 100)).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-ink/20">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-porcelain font-medium">Sales</span>
              </div>
              <span className="text-porcelain font-bold">
                {Math.round(totalViews * (conversionRates.viewToSale / 100)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-porcelain mb-6">Top Performing Items</h3>
        
        <div className="space-y-4">
          {topPerformingItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-ink/20">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-titanium text-ink flex items-center justify-center font-bold text-sm mr-4">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-porcelain">{item.title}</div>
                  <div className="text-nickel text-sm">${item.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-porcelain font-bold">{item.views}</div>
                  <div className="text-nickel text-xs">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-porcelain font-bold">{item.favorites}</div>
                  <div className="text-nickel text-xs">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-porcelain font-bold">
                    {item.views > 0 ? ((item.favorites / item.views) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-nickel text-xs">Conversion</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-porcelain mb-4">Performance Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-nickel">View to Favorite Rate</span>
              <span className="text-porcelain font-medium">{conversionRates.viewToFavorite.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-nickel">Favorite to Sale Rate</span>
              <span className="text-porcelain font-medium">{conversionRates.favoriteToSale.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-nickel">Overall Conversion Rate</span>
              <span className="text-porcelain font-medium">{conversionRates.viewToSale.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-porcelain mb-4">Recommendations</h3>
          <div className="space-y-3">
            {conversionRates.viewToSale < 5 && (
              <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm">
                💡 Consider optimizing your item descriptions and photos to improve conversion rates
              </div>
            )}
            {totalViews < 100 && (
              <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 text-sm">
                📈 Try promoting your listings on social media to increase visibility
              </div>
            )}
            {topPerformingItems.length > 0 && topPerformingItems[0].views > 1000 && (
              <div className="p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
                🎉 Great job! Your top item is performing well. Consider creating similar listings
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
