"use client";

import { useState, useEffect } from 'react';
import SearchableDropdown from './SearchableDropdown';
import { BRANDS, COLORS, MATERIALS, SIZES, CONDITIONS, CATEGORIES, PRICE_RANGES, SORT_OPTIONS } from '@/data/filterData';

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

interface EnhancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  className?: string;
}

export default function EnhancedFilters({ onFiltersChange, initialFilters, className = "" }: EnhancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
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
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    updateFilter('priceRange', range);
  };

  const handleSortChange = (sortBy: string) => {
    updateFilter('sortBy', sortBy);
  };

  const clearAllFilters = () => {
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
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.brands.length > 0 ||
      filters.colors.length > 0 ||
      filters.materials.length > 0 ||
      filters.sizes.length > 0 ||
      filters.conditions.length > 0 ||
      filters.categories.length > 0 ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max < Infinity
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-porcelain">Filters</h2>
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-titanium hover:text-porcelain transition-colors duration-sap"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-porcelain mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option} value={option} className="bg-ink text-porcelain">
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-porcelain mb-3">
          Price Range
        </label>
        
        {/* Price Range Slider */}
        <div className="mb-4">
          <div className="relative">
            {/* Slider Track */}
            <div className="h-2 bg-porcelain/20 rounded-full relative">
              {/* Active Range */}
              <div 
                className="absolute h-2 bg-titanium/60 rounded-full"
                style={{
                  left: `${Math.max(0, ((filters.priceRange.min - 0) / (100000 - 0)) * 100)}%`,
                  width: `${Math.min(100, ((filters.priceRange.max - filters.priceRange.min) / (100000 - 0)) * 100)}%`
                }}
              />
              
              {/* Min Handle */}
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filters.priceRange.min}
                onChange={(e) => {
                  const minValue = parseInt(e.target.value);
                  const maxValue = Math.max(minValue, filters.priceRange.max);
                  handlePriceRangeChange({ min: minValue, max: maxValue });
                }}
                className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                style={{ zIndex: 2 }}
              />
              
              {/* Max Handle */}
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filters.priceRange.max === Infinity ? 100000 : filters.priceRange.max}
                onChange={(e) => {
                  const maxValue = parseInt(e.target.value);
                  const minValue = Math.min(maxValue, filters.priceRange.min);
                  handlePriceRangeChange({ min: minValue, max: maxValue });
                }}
                className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                style={{ zIndex: 1 }}
              />
            </div>
            
            {/* Price Labels */}
            <div className="flex justify-between mt-2 text-xs text-nickel">
              <span>${Math.floor(filters.priceRange.min / 100)}</span>
              <span>{filters.priceRange.max === Infinity ? '$1000+' : `$${Math.floor(filters.priceRange.max / 100)}`}</span>
            </div>
          </div>
        </div>

        {/* Quick Price Ranges */}
        <div className="space-y-2">
          <div className="text-xs text-nickel mb-2">Quick Select:</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '<$10', min: 0, max: 1000 },
              { label: '$10-$50', min: 1000, max: 5000 },
              { label: '$50-$250', min: 5000, max: 25000 },
              { label: '>$250', min: 25000, max: Infinity }
            ].map(range => (
              <button
                key={range.label}
                onClick={() => handlePriceRangeChange({ min: range.min, max: range.max })}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-sap ${
                  filters.priceRange.min === range.min && filters.priceRange.max === range.max
                    ? 'bg-titanium/20 text-titanium border border-titanium/30'
                    : 'bg-graphite/60 text-nickel border border-porcelain/20 hover:bg-graphite/80 hover:text-porcelain'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <SearchableDropdown
        label="Categories"
        placeholder="Select categories"
        options={CATEGORIES}
        selectedValues={filters.categories}
        onSelectionChange={(values) => updateFilter('categories', values)}
      />

      {/* Brands */}
      <SearchableDropdown
        label="Brands"
        placeholder="Select brands"
        options={BRANDS}
        selectedValues={filters.brands}
        onSelectionChange={(values) => updateFilter('brands', values)}
      />

      {/* Colors */}
      <SearchableDropdown
        label="Colors"
        placeholder="Select colors"
        options={COLORS}
        selectedValues={filters.colors}
        onSelectionChange={(values) => updateFilter('colors', values)}
      />

      {/* Materials */}
      <SearchableDropdown
        label="Materials"
        placeholder="Select materials"
        options={MATERIALS}
        selectedValues={filters.materials}
        onSelectionChange={(values) => updateFilter('materials', values)}
      />

      {/* Sizes */}
      <SearchableDropdown
        label="Sizes"
        placeholder="Select sizes"
        options={SIZES}
        selectedValues={filters.sizes}
        onSelectionChange={(values) => updateFilter('sizes', values)}
      />

      {/* Conditions */}
      <SearchableDropdown
        label="Conditions"
        placeholder="Select conditions"
        options={CONDITIONS}
        selectedValues={filters.conditions}
        onSelectionChange={(values) => updateFilter('conditions', values)}
      />

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="pt-4 border-t border-porcelain/10">
          <h3 className="text-sm font-medium text-porcelain mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.brands.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.brands.length} brand{filters.brands.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.colors.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.colors.length} color{filters.colors.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.materials.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.materials.length} material{filters.materials.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.sizes.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.sizes.length} size{filters.sizes.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.conditions.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.conditions.length} condition{filters.conditions.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.categories.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                {filters.categories.length} categor{filters.categories.length > 1 ? 'ies' : 'y'}
              </span>
            )}
            {(filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
              <span className="px-2 py-1 rounded-md bg-titanium/10 text-titanium text-xs">
                Price range
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
