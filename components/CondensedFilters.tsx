"use client";

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

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

interface CondensedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function CondensedFilters({ filters, onFiltersChange }: CondensedFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Mock data for filter options
  const filterOptions = {
    brands: ['Hermès', 'Gucci', 'Tom Ford', 'Brioni', 'Kiton', 'Zegna', 'Canali', 'Hugo Boss'],
    colors: ['Black', 'Navy', 'Brown', 'Gray', 'White', 'Red', 'Blue', 'Green'],
    materials: ['Silk', 'Wool', 'Cotton', 'Leather', 'Cashmere', 'Linen', 'Polyester'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    conditions: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    categories: ['Ties', 'Belts', 'Cufflinks', 'Pocket Squares', 'Watches', 'Jewelry']
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string, isArray = true) => {
    if (isArray) {
      const currentValues = filters[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFiltersChange({ ...filters, [filterType]: newValues });
    } else {
      onFiltersChange({ ...filters, [filterType]: value });
    }
  };

  const clearFilter = (filterType: keyof FilterState) => {
    if (Array.isArray(filters[filterType])) {
      onFiltersChange({ ...filters, [filterType]: [] });
    } else if (filterType === 'priceRange') {
      onFiltersChange({ ...filters, priceRange: { min: 0, max: Infinity } });
    } else {
      onFiltersChange({ ...filters, [filterType]: '' });
    }
  };

  const getFilterCount = (filterType: keyof FilterState) => {
    const value = filters[filterType];
    if (Array.isArray(value)) {
      return value.length;
    }
    if (filterType === 'priceRange') {
      return value.min > 0 || value.max < Infinity ? 1 : 0;
    }
    return value ? 1 : 0;
  };

  const FilterDropdown = ({ 
    label, 
    filterType, 
    options, 
    isArray = true 
  }: { 
    label: string; 
    filterType: keyof FilterState; 
    options: string[]; 
    isArray?: boolean;
  }) => {
    const isOpen = openDropdown === filterType;
    const count = getFilterCount(filterType);
    const currentValues = filters[filterType] as string[];

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : filterType)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-sap ${
            count > 0
              ? 'bg-titanium/20 text-titanium border border-titanium/30'
              : 'bg-graphite/80 text-nickel border border-porcelain/20 hover:bg-graphite/60 hover:text-porcelain'
          }`}
        >
          <span>{label}</span>
          {count > 0 && (
            <span className="bg-titanium text-ink text-xs px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-sap ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-graphite border border-porcelain/20 shadow-soft rounded-xl z-50 max-h-80 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-porcelain">{label}</h3>
                {count > 0 && (
                  <button
                    onClick={() => clearFilter(filterType)}
                    className="text-xs text-nickel hover:text-porcelain transition-colors duration-sap"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {options.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isArray ? currentValues.includes(option) : filters[filterType] === option}
                      onChange={() => handleFilterChange(filterType, option, isArray)}
                      className="w-4 h-4 text-titanium bg-graphite border-porcelain/20 rounded focus:ring-titanium/20 focus:ring-2"
                    />
                    <span className="text-sm text-porcelain">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const PriceRangeFilter = () => {
    const isOpen = openDropdown === 'priceRange';
    const count = getFilterCount('priceRange');

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : 'priceRange')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-sap ${
            count > 0
              ? 'bg-titanium/20 text-titanium border border-titanium/30'
              : 'bg-graphite/80 text-nickel border border-porcelain/20 hover:bg-graphite/60 hover:text-porcelain'
          }`}
        >
          <span>Price</span>
          {count > 0 && (
            <span className="bg-titanium text-ink text-xs px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-sap ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-graphite border border-porcelain/20 shadow-soft rounded-xl z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-porcelain">Price Range</h3>
                {count > 0 && (
                  <button
                    onClick={() => clearFilter('priceRange')}
                    className="text-xs text-nickel hover:text-porcelain transition-colors duration-sap"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-nickel mb-1">Min Price</label>
                    <input
                      type="number"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-ink border border-porcelain/20 rounded-lg text-sm text-porcelain placeholder-nickel focus:border-titanium focus:outline-none focus:ring-1 focus:ring-titanium/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-nickel mb-1">Max Price</label>
                    <input
                      type="number"
                      value={filters.priceRange.max === Infinity ? '' : filters.priceRange.max}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || Infinity }
                      })}
                      placeholder="No limit"
                      className="w-full px-3 py-2 bg-ink border border-porcelain/20 rounded-lg text-sm text-porcelain placeholder-nickel focus:border-titanium focus:outline-none focus:ring-1 focus:ring-titanium/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown label="Brand" filterType="brands" options={filterOptions.brands} />
      <FilterDropdown label="Color" filterType="colors" options={filterOptions.colors} />
      <FilterDropdown label="Material" filterType="materials" options={filterOptions.materials} />
      <FilterDropdown label="Size" filterType="sizes" options={filterOptions.sizes} />
      <FilterDropdown label="Condition" filterType="conditions" options={filterOptions.conditions} />
      <FilterDropdown label="Category" filterType="categories" options={filterOptions.categories} />
      <PriceRangeFilter />
      
      {/* Clear All Filters */}
      {(Object.keys(filters).some(key => {
        const value = filters[key as keyof FilterState];
        if (Array.isArray(value)) return value.length > 0;
        if (key === 'priceRange') return value.min > 0 || value.max < Infinity;
        return value && value !== 'Newest First';
      })) && (
        <button
          onClick={() => onFiltersChange({
            brands: [],
            colors: [],
            materials: [],
            sizes: [],
            conditions: [],
            categories: [],
            priceRange: { min: 0, max: Infinity },
            sortBy: 'Newest First'
          })}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-sap"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
          Clear All
        </button>
      )}
    </div>
  );
}
