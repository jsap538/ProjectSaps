"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  Eye, 
  Heart, 
  Clock, 
  TrendingUp,
  ShoppingCart,
  Settings,
  Plus
} from 'lucide-react';
import MyListings from '@/components/dashboard/MyListings';
import MySales from '@/components/dashboard/MySales';
import Analytics from '@/components/dashboard/Analytics';

interface SellerStats {
  totalRevenue: number;
  activeListings: number;
  pendingApprovals: number;
  totalViews: number;
  totalFavorites: number;
  recentOrders: number;
  ordersRequiringShipping: number;
}

interface DashboardData {
  stats: SellerStats;
  recentListings: any[];
  recentOrders: any[];
  analytics: {
    viewsOverTime: any[];
    topPerformingItems: any[];
    conversionRates: any[];
  };
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'sales' | 'analytics'>('overview');

  useEffect(() => {
    if (isLoaded && !user) {
      redirect('/sign-in');
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-titanium border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = dashboardData?.stats || {
    totalRevenue: 0,
    activeListings: 0,
    pendingApprovals: 0,
    totalViews: 0,
    totalFavorites: 0,
    recentOrders: 0,
    ordersRequiringShipping: 0,
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="bg-graphite/60 border-b border-porcelain/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-porcelain">Seller Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/items/new"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-titanium text-ink font-medium transition-colors duration-sap hover:bg-titanium/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Link>
              <Link
                href="/dashboard/settings"
                className="p-2 rounded-xl bg-graphite/60 text-porcelain hover:bg-graphite/80 transition-colors duration-sap"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'listings', label: 'My Listings', icon: Package },
              { id: 'sales', label: 'My Sales', icon: ShoppingCart },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors duration-sap ${
                  activeTab === id
                    ? 'bg-titanium text-ink'
                    : 'text-nickel hover:text-porcelain hover:bg-graphite/60'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nickel text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-porcelain">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nickel text-sm font-medium">Active Listings</p>
                    <p className="text-2xl font-bold text-porcelain">{stats.activeListings}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nickel text-sm font-medium">Pending Approvals</p>
                    <p className="text-2xl font-bold text-porcelain">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nickel text-sm font-medium">Total Views</p>
                    <p className="text-2xl font-bold text-porcelain">{stats.totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-porcelain mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/items/new"
                    className="flex items-center p-3 rounded-xl bg-titanium/10 text-porcelain hover:bg-titanium/20 transition-colors duration-sap"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Listing
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center p-3 rounded-xl bg-titanium/10 text-porcelain hover:bg-titanium/20 transition-colors duration-sap"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    View Orders
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center p-3 rounded-xl bg-titanium/10 text-porcelain hover:bg-titanium/20 transition-colors duration-sap"
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    View Analytics
                  </Link>
                </div>
              </div>

              <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-porcelain mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ink/20">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-porcelain text-sm">New order received</span>
                    </div>
                    <span className="text-nickel text-xs">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ink/20">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-porcelain text-sm">Item approved</span>
                    </div>
                    <span className="text-nickel text-xs">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ink/20">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <span className="text-porcelain text-sm">New view on item</span>
                    </div>
                    <span className="text-nickel text-xs">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <MyListings 
            listings={dashboardData?.recentListings || []} 
            onRefresh={fetchDashboardData}
          />
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <MySales 
            sales={dashboardData?.recentOrders || []} 
            onRefresh={fetchDashboardData}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Analytics 
            analytics={dashboardData?.analytics || { viewsOverTime: [], topPerformingItems: [], conversionRates: { viewToFavorite: 0, favoriteToSale: 0, viewToSale: 0 } }} 
            onRefresh={fetchDashboardData}
          />
        )}
      </div>
    </div>
  );
}