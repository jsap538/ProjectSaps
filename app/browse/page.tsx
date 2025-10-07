"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
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

export default function BrowsePage() {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchItems();
  }, [selectedBrand, selectedCategory, selectedCondition, selectedColor, searchQuery, minPrice, maxPrice, sortBy]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filters
      if (selectedBrand !== "All Brands") {
        params.append('brand', selectedBrand);
      }
      if (selectedCategory !== "All") {
        params.append('category', selectedCategory.toLowerCase());
      }
      if (selectedCondition !== "All") {
        params.append('condition', selectedCondition);
      }
      if (selectedColor !== "All") {
        params.append('color', selectedColor.toLowerCase());
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }
      
      // Add sorting
      params.append('sortBy', sortBy);
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
        if (selectedBrand !== "All Brands" && item.brand !== selectedBrand) return false;
        if (selectedCategory !== "All" && item.category !== selectedCategory.toLowerCase()) return false;
        if (selectedCondition !== "All" && item.condition !== selectedCondition) return false;
        if (selectedColor !== "All" && item.color !== selectedColor.toLowerCase()) return false;
        if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (minPrice && item.price_cents < parseInt(minPrice) * 100) return false;
        if (maxPrice && item.price_cents > parseInt(maxPrice) * 100) return false;
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

  const clearAllFilters = () => {
    setSelectedBrand("All Brands");
    setSelectedCategory("All");
    setSelectedCondition("All");
    setSelectedColor("All");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
          <aside className="lg:w-64">
            <div className="sticky top-24 bg-graphite/60 border border-porcelain/10 shadow-soft p-6 rounded-xl">
              <div className="mb-6 flex items-center justify-between lg:block">
                <h2 className="text-lg font-medium text-porcelain">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-nickel lg:hidden"
                >
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

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Category Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-nickel">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex cursor-pointer items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-titanium accent-titanium"
                        />
                        <span className="ml-3 text-sm text-porcelain/90">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-nickel">
                    Brand
                  </h3>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full rounded-xl border border-porcelain/20 bg-graphite/60 px-3 py-2 text-sm text-porcelain focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand} className="bg-graphite text-porcelain">
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-nickel">
                    Condition
                  </h3>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex cursor-pointer items-center">
                        <input
                          type="radio"
                          name="condition"
                          checked={selectedCondition === condition}
                          onChange={() => setSelectedCondition(condition)}
                          className="h-4 w-4 text-titanium accent-titanium"
                        />
                        <span className="ml-3 text-sm text-porcelain/90">
                          {condition}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-nickel">
                    Color
                  </h3>
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <label key={color} className="flex cursor-pointer items-center">
                        <input
                          type="radio"
                          name="color"
                          checked={selectedColor === color}
                          onChange={() => setSelectedColor(color)}
                          className="h-4 w-4 text-titanium accent-titanium"
                        />
                        <span className="ml-3 text-sm text-porcelain/90">
                          {color}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-nickel">
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="minPrice" className="block text-xs text-nickel mb-1">
                        Min Price ($)
                      </label>
                      <input
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-xl border border-porcelain/20 bg-graphite/60 px-3 py-2 text-sm text-porcelain placeholder-nickel focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxPrice" className="block text-xs text-nickel mb-1">
                        Max Price ($)
                      </label>
                      <input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="No limit"
                        min="0"
                        className="w-full rounded-xl border border-porcelain/20 bg-graphite/60 px-3 py-2 text-sm text-porcelain placeholder-nickel focus:border-titanium focus:outline-none focus:ring-2 focus:ring-titanium/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearAllFilters}
                  className="w-full rounded-xl border border-porcelain/20 px-4 py-2.5 text-sm font-medium text-porcelain/90 transition-colors duration-sap hover:bg-porcelain/5 hover:text-porcelain"
                >
                  Clear All Filters
                </button>
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

