"use client";

import { useState } from "react";
import ListingCard from "@/components/ListingCard";

// Mock data
const allItems = [
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
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = allItems.filter((item) => {
    if (selectedBrand !== "All Brands" && item.brand !== selectedBrand) return false;
    if (selectedCategory !== "All" && item.category !== selectedCategory.toLowerCase()) return false;
    if (selectedCondition !== "All" && item.condition !== selectedCondition) return false;
    if (selectedColor !== "All" && item.color !== selectedColor.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark md:text-4xl dark:text-white">
            Browse Collection
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {filteredItems.length} items available
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-[#1f2329] dark:ring-gray-800">
              <div className="mb-6 flex items-center justify-between lg:block">
                <h2 className="text-lg font-semibold text-dark dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-600 dark:text-gray-400 lg:hidden"
                >
                  <svg
                    className={`h-5 w-5 transition ${showFilters ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Category Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
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
                          className="h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
                    Brand
                  </h3>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
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
                          className="h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {condition}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
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
                          className="h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {color}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedBrand("All Brands");
                    setSelectedCategory("All");
                    setSelectedCondition("All");
                    setSelectedColor("All");
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#151821]"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:gap-7">
                {filteredItems.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-200 dark:bg-[#1f2329] dark:ring-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
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

