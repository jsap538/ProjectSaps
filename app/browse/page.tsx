"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import EnhancedFilters from "@/components/EnhancedFilters";
import type { IItem, ItemFilters } from "@/types";

// Mock data (fallback)
const mockItems = [
  {
    id: "1",
    title: "Navy Grenadine Tie",
    brand: "Drake's",
    price_cents: 6500,
    image: "https://placehold.co/600x750/1a2742/33CC66?text=Navy+Grenadine",
    condition: "Like New",
    category: "tie",
    color: "navy",
  },
  {
    id: "2",
    title: "Bar Stripe Repp Tie",
    brand: "Brooks Brothers",
    price_cents: 3500,
    image: "https://placehold.co/600x750/2a3752/33CC66?text=Bar+Stripe",
    condition: "Good",
    category: "tie",
    color: "navy",
  },
  {
    id: "3",
    title: "Burgundy Silk Tie",
    brand: "Tom Ford",
    price_cents: 8900,
    image: "https://placehold.co/600x750/3a1722/33CC66?text=Burgundy+Silk",
    condition: "New",
    category: "tie",
    color: "red",
  },
  {
    id: "4",
    title: "Forest Green Knit Tie",
    brand: "Brunello Cucinelli",
    price_cents: 7200,
    image: "https://placehold.co/600x750/1a3725/33CC66?text=Green+Knit",
    condition: "Like New",
    category: "tie",
    color: "green",
  },
  {
    id: "5",
    title: "Classic Black Leather Belt",
    brand: "Hermes",
    price_cents: 12500,
    image: "https://placehold.co/600x750/0a0a0a/33CC66?text=Leather+Belt",
    condition: "Like New",
    category: "belt",
    color: "black",
  },
  {
    id: "6",
    title: "Silver Cufflinks",
    brand: "Tiffany & Co.",
    price_cents: 15000,
    image: "https://placehold.co/600x750/4a5568/33CC66?text=Silver+Cufflinks",
    condition: "New",
    category: "cufflinks",
    color: "silver",
  },
];

const brands = ["All Brands", "Drake's", "Brooks Brothers", "Tom Ford", "Brunello Cucinelli", "Hermes", "Tiffany & Co."];
const categories = ["All", "Tie", "Belt", "Cufflinks", "Pocket Square"];
const conditions = ["All", "New", "Like New", "Good", "Fair"];
const colors = ["All", "Navy", "Black", "Red", "Green", "Silver"];

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
  const [filters, setFilters] = useState<FilterState>({
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
  }, [filters, searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.brands.length > 0) {
        filters.brands.forEach(brand => params.append('brands', brand));
      }
      if (filters.categories.length > 0) {
        filters.categories.forEach(category => params.append('categories', category.toLowerCase()));
      }
      if (filters.conditions.length > 0) {
        filters.conditions.forEach(condition => params.append('conditions', condition));
      }
      if (filters.colors.length > 0) {
        filters.colors.forEach(color => params.append('colors', color.toLowerCase()));
      }
      if (filters.materials.length > 0) {
        filters.materials.forEach(material => params.append('materials', material));
      }
      if (filters.sizes.length > 0) {
        filters.sizes.forEach(size => params.append('sizes', size));
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (filters.priceRange.min > 0) {
        params.append('minPrice', (filters.priceRange.min / 100).toString());
      }
      if (filters.priceRange.max < Infinity) {
        params.append('maxPrice', (filters.priceRange.max / 100).toString());
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
      params.append('sortBy', sortMapping[filters.sortBy] || 'newest');
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
      // Fallback to mock data with client-side filtering
      const filteredMockItems = mockItems.filter((item) => {
        // Brand filter
        if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) return false;
        
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(item.category)) return false;
        
        // Condition filter
        if (filters.conditions.length > 0 && !filters.conditions.includes(item.condition)) return false;
        
        // Color filter
        if (filters.colors.length > 0 && !filters.colors.includes(item.color)) return false;
        
        // Search query
        if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        // Price range
        if (filters.priceRange.min > 0 && item.price_cents < filters.priceRange.min) return false;
        if (filters.priceRange.max < Infinity && item.price_cents > filters.priceRange.max) return false;
        
        return true;
      });
      setItems(filteredMockItems.map(item => ({ 
        ...item, 
        _id: item.id, 
        images: [item.image],
        description: 'Premium quality item',
        shipping_cents: 599,
        location: 'United States',
        sellerId: {} as any,
        condition: item.condition as 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor',
        category: item.category as 'tie' | 'belt' | 'cufflinks' | 'pocket-square',
        isActive: true,
        isApproved: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      } as IItem)));
      setTotalItems(filteredMockItems.length);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="rounded-xl border border-porcelain/20 bg-graphite/60 px-4 py-3 text-sm text-porcelain transition-all duration-sap focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
            >
              <option value="newest" className="bg-graphite text-porcelain">Newest First</option>
              <option value="price_cents" className="bg-graphite text-porcelain">Price: Low to High</option>
              <option value="price_cents_desc" className="bg-graphite text-porcelain">Price: High to Low</option>
              <option value="views" className="bg-graphite text-porcelain">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <div className="sticky top-24 bg-graphite/60 border border-porcelain/10 shadow-soft rounded-xl overflow-hidden">
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

              <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
                <EnhancedFilters onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-graphite/60 border border-porcelain/10 shadow-subtle p-4 rounded-xl">
                    <div className="aspect-[4/5] bg-onyx mb-4 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-onyx rounded w-3/4"></div>
                      <div className="h-4 bg-onyx rounded w-1/2"></div>
                      <div className="h-4 bg-onyx rounded w-2/3"></div>
                    </div>
                  </div>
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
              <div className="bg-graphite/60 border border-porcelain/10 shadow-subtle p-16 text-center rounded-xl">
                <p className="text-lg text-nickel">
                  No items match your filters. Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

