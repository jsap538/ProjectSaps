"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Sale {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingStatus: 'pending' | 'shipped' | 'delivered' | 'returned';
  items: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface MySalesProps {
  sales: Sale[];
  onRefresh: () => void;
}

export default function MySales({ sales, onRefresh }: MySalesProps) {
  const [filteredSales, setFilteredSales] = useState<Sale[]>(sales);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [shippingFilter, setShippingFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'returned'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  useEffect(() => {
    let filtered = sales;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Filter by shipping status
    if (shippingFilter !== 'all') {
      filtered = filtered.filter(sale => sale.shippingStatus === shippingFilter);
    }

    // Sort sales
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-high':
          return b.total - a.total;
        case 'amount-low':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    setFilteredSales(filtered);
  }, [sales, statusFilter, shippingFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/10';
      case 'shipped': return 'text-blue-400 bg-blue-400/10';
      case 'delivered': return 'text-purple-400 bg-purple-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-nickel bg-nickel/10';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return 'text-blue-400 bg-blue-400/10';
      case 'delivered': return 'text-green-400 bg-green-400/10';
      case 'returned': return 'text-red-400 bg-red-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-nickel bg-nickel/10';
    }
  };

  const handleMarkAsShipped = async (orderId: string) => {
    const trackingNumber = prompt('Enter tracking number:');
    const carrier = prompt('Enter carrier (e.g., UPS, FedEx, USPS):');
    
    if (!trackingNumber || !carrier) {
      alert('Tracking number and carrier are required');
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber,
          carrier
        }),
      });

      if (response.ok) {
        onRefresh();
        alert('Order marked as shipped successfully');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to mark as shipped'}`);
      }
    } catch (error) {
      console.error('Error marking as shipped:', error);
      alert('Failed to mark as shipped');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const pendingOrders = sales.filter(sale => sale.status === 'pending').length;
  const shippedOrders = sales.filter(sale => sale.shippingStatus === 'shipped').length;
  const deliveredOrders = sales.filter(sale => sale.shippingStatus === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-porcelain">My Sales</h2>
          <p className="text-nickel text-sm">{filteredSales.length} orders</p>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-porcelain">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-porcelain">{pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Shipped</p>
              <p className="text-2xl font-bold text-porcelain">{shippedOrders}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nickel text-sm font-medium">Delivered</p>
              <p className="text-2xl font-bold text-porcelain">{deliveredOrders}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Shipping Filter */}
          <select
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="all">All Shipping</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink/20">
              <tr>
                <th className="px-6 py-4 text-left text-nickel font-medium">Order</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Buyer</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Items</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Total</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Status</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Shipping</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Date</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-porcelain/10">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-ink/10">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-porcelain">#{sale.orderNumber}</div>
                      <div className="text-nickel text-sm">ID: {sale.id.slice(-8)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-porcelain">{sale.buyerName}</div>
                      <div className="text-nickel text-sm">{sale.buyerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-porcelain">
                      {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-nickel text-sm">
                      {sale.items[0]?.title}
                      {sale.items.length > 1 && ` +${sale.items.length - 1} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-porcelain font-medium">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {getStatusIcon(sale.status)}
                      <span className="ml-1">{sale.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getShippingStatusColor(sale.shippingStatus)}`}>
                      {getStatusIcon(sale.shippingStatus)}
                      <span className="ml-1">{sale.shippingStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-nickel text-sm">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/orders/${sale.id}`}
                        className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors duration-sap"
                      >
                        View
                      </Link>
                      {sale.status === 'confirmed' && (
                        <button
                          onClick={() => handleMarkAsShipped(sale.id)}
                          className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors duration-sap"
                        >
                          Ship
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-nickel mx-auto mb-4" />
          <h3 className="text-lg font-medium text-porcelain mb-2">No sales found</h3>
          <p className="text-nickel mb-4">
            {statusFilter !== 'all' || shippingFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'You haven\'t made any sales yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
