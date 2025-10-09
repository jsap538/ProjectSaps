"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import EnhancedFilters from "@/components/EnhancedFilters";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { EmptyBrowse } from "@/components/EmptyStates";
import type { IItem } from "@/types";

interface FilterState {
  brands: string[];
  colors: string[];
  materials: string[];
  sizes: string[];
  conditions: string[];
  categories: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
}

export default function BrowsePage() {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    brands: [],
    colors: [],
    materials: [],
    sizes: [],
    conditions: [],
    categories: [],
    priceRange: { min: 0, max: Infinity },
    sortBy: 'Newest First'
  });
  const [tempFilters, setTempFilters] = useState<FilterState>({
    brands: [],
    colors: [],
    materials: [],
    sizes: [],
    conditions: [],
    categories: [],
    priceRange: { min: 0, max: Infinity },
    sortBy: 'Newest First'
  });

  useEffect(() => {
    fetchItems();
  }, [appliedFilters, searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filters
      if (appliedFilters.brands.length > 0) {
        appliedFilters.brands.forEach(brand => params.append('brands', brand));
      }
      if (appliedFilters.categories.length > 0) {
        appliedFilters.categories.forEach(category => params.append('categories', category.toLowerCase()));
      }
      if (appliedFilters.conditions.length > 0) {
        appliedFilters.conditions.forEach(condition => params.append('conditions', condition));
      }
      if (appliedFilters.colors.length > 0) {
        appliedFilters.colors.forEach(color => params.append('colors', color.toLowerCase()));
      }
      if (appliedFilters.materials.length > 0) {
        appliedFilters.materials.forEach(material => params.append('materials', material));
      }
      if (appliedFilters.sizes.length > 0) {
        appliedFilters.sizes.forEach(size => params.append('sizes', size));
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (appliedFilters.priceRange.min > 0) {
        params.append('minPrice', (appliedFilters.priceRange.min / 100).toString());
      }
      if (appliedFilters.priceRange.max < Infinity) {
        params.append('maxPrice', (appliedFilters.priceRange.max / 100).toString());
      }
      
      // Add sorting
      const sortMapping: { [key: string]: string } = {
        'Newest First': 'newest',
        'Oldest First': 'oldest',
        'Price: Low to High': 'price_low',
        'Price: High to Low': 'price_high',
        'Most Popular': 'popular',
        'Best Deals': 'deals',
        'Recently Updated': 'updated'
      };
      params.append('sortBy', sortMapping[appliedFilters.sortBy] || 'newest');
      params.append('sortOrder', 'desc');

      const response = await fetch(`/api/items?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
        setTotalItems(data.pagination?.total || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setTempFilters(newFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      brands: [],
      colors: [],
      materials: [],
      sizes: [],
      conditions: [],
      categories: [],
      priceRange: { min: 0, max: Infinity },
      sortBy: 'Newest First'
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
            Premium Collection
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 md:text-5xl text-porcelain mb-6 text-display">
            Browse Collection
          </h1>
          <p className="text-lg text-nickel max-w-2xl mx-auto text-body">
            Discover luxury men's accessories from the world's finest brands. {totalItems} items available.
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search items, brands, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-porcelain/20 bg-graphite/60 px-6 py-4 pl-12 text-porcelain placeholder-nickel transition-all duration-sap focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-nickel transition-colors duration-sap group-focus-within:text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="text-sm font-medium text-nickel">
              Sort by:
            </label>
            <select
              id="sort"
              value={tempFilters.sortBy}
              onChange={(e) => setTempFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="rounded-xl border border-porcelain/20 bg-graphite/60 px-4 py-3 text-sm text-porcelain transition-all duration-sap focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
            >
              <option value="newest" className="bg-graphite text-porcelain">Newest First</option>
              <option value="price_cents" className="bg-graphite text-porcelain">Price: Low to High</option>
              <option value="price_cents_desc" className="bg-graphite text-porcelain">Price: High to Low</option>
              <option value="views" className="bg-graphite text-porcelain">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 lg:items-start">
          {/* Filters Sidebar */}
          <aside className="lg:w-96 lg:flex-shrink-0">
            <div className="sticky top-4 bg-graphite/60 border border-porcelain/10 shadow-soft rounded-xl overflow-hidden">
              <div className="lg:hidden p-4 border-b border-porcelain/10">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full text-nickel hover:text-porcelain transition-colors duration-sap"
                >
                  <span className="text-lg font-medium">Filters</span>
                  <svg
                    className={`h-5 w-5 transition duration-sap ${showFilters ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div className={`p-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                <EnhancedFilters 
                  onFiltersChange={handleFiltersChange} 
                  initialFilters={tempFilters}
                />
                
                {/* Apply Filters Button */}
                <div className="mt-6 pt-6 border-t border-porcelain/10">
                  <button
                    onClick={applyFilters}
                    className="w-full rounded-xl bg-titanium/20 border border-titanium/30 text-titanium px-4 py-3 font-medium transition-all duration-sap hover:bg-titanium/30 hover:border-titanium/50"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-graphite/60 border border-porcelain/10 shadow-subtle p-16 text-center rounded-xl">
                <p className="text-lg text-red-400 mb-4">
                  Error: {error}
                </p>
                <button
                  onClick={fetchItems}
                  className="rounded-xl bg-porcelain text-ink px-6 py-3 font-medium hover:bg-titanium transition-colors duration-sap"
                >
                  Try Again
                </button>
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {items.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyBrowse />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

