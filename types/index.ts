import mongoose from 'mongoose';

// Core domain types - optimized for minimal serialization overhead
export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  isSeller: boolean;
  stripeAccountId?: string;
  rating: number;
  totalSales: number;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItem {
  _id: string;
  title: string;
  description: string;
  brand: string;
  price_cents: number;
  shipping_cents: number;
  images: string[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: 'tie' | 'belt' | 'cufflinks' | 'pocket-square';
  color: string;
  material?: string;
  width_cm?: number;
  location: string;
  sellerId: mongoose.Types.ObjectId | IUser;
  isActive: boolean;
  isApproved: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types - optimized for minimal payload
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types - optimized for validation
export interface ItemFormData {
  title: string;
  description: string;
  brand: string;
  price_cents: number;
  shipping_cents: number;
  images: string[];
  condition: string;
  category: string;
  color: string;
  material?: string;
  width_cm?: number;
  location: string;
}

// Filter types - optimized for query building
export interface ItemFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  condition?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price_cents' | 'price_cents_desc' | 'views';
}

// Admin types
export interface AdminItem extends IItem {
  sellerId: IUser;
}

// Dashboard types
export interface SellerStats {
  totalItems: number;
  activeItems: number;
  pendingItems: number;
  totalViews: number;
  totalSales: number;
}

// Constants - optimized for tree shaking
export const ITEM_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'] as const;
export const ITEM_CATEGORIES = ['tie', 'belt', 'cufflinks', 'pocket-square'] as const;
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_cents', label: 'Price: Low to High' },
  { value: 'price_cents_desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Popular' }
] as const;

// Utility types for performance optimization
export type ItemCondition = typeof ITEM_CONDITIONS[number];
export type ItemCategory = typeof ITEM_CATEGORIES[number];
export type SortOption = typeof SORT_OPTIONS[number]['value'];
