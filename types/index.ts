import mongoose from 'mongoose';

// User statistics subdocument
export interface IUserStats {
  totalListings: number;
  totalSold: number;
  totalPurchased: number;
  totalRevenue: number; // in cents
  averageRating: number;
  totalReviews: number;
}

// Address subdocument
export interface IAddress {
  label?: string;
  fullName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Core domain types - optimized for minimal serialization overhead
export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
  isSeller: boolean;
  isAdmin?: boolean;
  isVerified?: boolean;
  stripeAccountId?: string;
  stripeCustomerId?: string;
  addresses?: IAddress[];
  defaultShippingAddressIndex?: number;
  stats: IUserStats;
  followers?: string[]; // Array of user IDs
  following?: string[]; // Array of user IDs
  isActive?: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Item image subdocument
export interface IItemImage {
  url: string;
  publicId?: string;
  order: number;
  isMain: boolean;
}

// Item dimensions subdocument
export interface IItemDimensions {
  width_cm?: number;
  length_cm?: number;
  height_cm?: number;
  weight_g?: number;
}

// Item statistics subdocument
export interface IItemStats {
  views: number;
  favorites: number;
  timesShared: number;
  clicks: number;
}

export interface IItem {
  _id: string;
  title: string;
  description: string;
  brand: string;
  price_cents: number;
  originalPrice_cents?: number;
  shipping_cents: number;
  acceptsOffers?: boolean;
  lowestOfferPrice_cents?: number;
  images: IItemImage[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: 'tie' | 'belt' | 'cufflinks' | 'pocket-square';
  color: string;
  material?: string;
  dimensions?: IItemDimensions;
  location: string;
  shipsFrom?: string;
  shipsTo?: string[];
  processingTime_days?: number;
  sellerId: mongoose.Types.ObjectId | IUser;
  isActive: boolean;
  isApproved: boolean;
  isSold?: boolean;
  soldAt?: Date;
  soldTo?: string;
  isFeatured?: boolean;
  featuredUntil?: Date;
  stats: IItemStats;
  rejectionReason?: string;
  moderationNotes?: string;
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
  originalPrice_cents?: number;
  shipping_cents: number;
  acceptsOffers?: boolean;
  lowestOfferPrice_cents?: number;
  images: string[]; // Frontend uses string array, API converts to IItemImage[]
  condition: string;
  category: string;
  color: string;
  material?: string;
  width_cm?: number; // Form still uses flat structure, API converts to dimensions object
  location: string;
  shipsFrom?: string;
  shipsTo?: string[];
  processingTime_days?: number;
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
