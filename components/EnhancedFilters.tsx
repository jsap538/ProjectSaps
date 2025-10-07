"use client";

import { useState } from 'react';
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
  className?: string;
}

export default function EnhancedFilters({ onFiltersChange, className = "" }: EnhancedFiltersProps) {
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
        <label className="block text-sm font-medium text-porcelain mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          {PRICE_RANGES.map(range => (
            <label key={range.label} className="flex items-center space-x-2">
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange.min === range.min &&
                  filters.priceRange.max === range.max
                }
                onChange={() => handlePriceRangeChange({ min: range.min, max: range.max })}
                className="text-titanium focus:ring-titanium/20"
              />
              <span className="text-sm text-nickel">{range.label}</span>
            </label>
          ))}
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
