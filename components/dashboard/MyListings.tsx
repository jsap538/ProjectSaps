"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Eye, 
  Heart, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Filter,
  Search,
  Plus
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  favorites: number;
  createdAt: string;
  imageUrl?: string;
}

interface MyListingsProps {
  listings: Listing[];
  onRefresh: () => void;
}

export default function MyListings({ listings, onRefresh }: MyListingsProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'sold' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'views'>('newest');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    let filtered = listings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter, sortBy]);

  const handleBulkAction = async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('/api/dashboard/listings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          itemIds: selectedItems
        }),
      });

      if (response.ok) {
        setSelectedItems([]);
        onRefresh();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'sold': return 'text-blue-400 bg-blue-400/10';
      case 'draft': return 'text-nickel bg-nickel/10';
      default: return 'text-nickel bg-nickel/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-porcelain">My Listings</h2>
          <p className="text-nickel text-sm">{filteredListings.length} listings</p>
        </div>
        <Link
          href="/dashboard/items/new"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-titanium text-ink font-medium transition-colors duration-sap hover:bg-titanium/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Listing
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-nickel" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain placeholder-nickel focus:outline-none focus:ring-2 focus:ring-titanium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-ink border border-porcelain/20 text-porcelain focus:outline-none focus:ring-2 focus:ring-titanium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Views</option>
          </select>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-nickel text-sm">{selectedItems.length} selected</span>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
              >
                Delete
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30"
              >
                Activate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink/20">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredListings.length && filteredListings.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredListings.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="rounded border-porcelain/20 text-titanium focus:ring-titanium"
                  />
                </th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Item</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Price</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Status</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Views</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Favorites</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Created</th>
                <th className="px-6 py-4 text-left text-nickel font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-porcelain/10">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-ink/10">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(listing.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, listing.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== listing.id));
                        }
                      }}
                      className="rounded border-porcelain/20 text-titanium focus:ring-titanium"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {listing.imageUrl && (
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                      )}
                      <div>
                        <div className="font-medium text-porcelain">{listing.title}</div>
                        <div className="text-nickel text-sm">ID: {listing.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-porcelain font-medium">
                    ${listing.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-porcelain">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1 text-nickel" />
                      {listing.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-porcelain">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-nickel" />
                      {listing.favorites}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-nickel text-sm">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/items/${listing.id}/edit`}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-sap"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this listing?')) {
                            // Handle delete
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-sap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-nickel mx-auto mb-4" />
          <h3 className="text-lg font-medium text-porcelain mb-2">No listings found</h3>
          <p className="text-nickel mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first listing.'
            }
          </p>
          <Link
            href="/dashboard/items/new"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-titanium text-ink font-medium transition-colors duration-sap hover:bg-titanium/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Link>
        </div>
      )}
    </div>
  );
}
