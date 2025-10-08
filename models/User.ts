import mongoose, { Document, Schema } from 'mongoose';

// Cart Item subdocument
export interface ICartItem {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

// Address subdocument
export interface IAddress {
  label?: string; // e.g., "Home", "Work"
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

// User statistics subdocument
export interface IUserStats {
  totalListings: number;
  totalSold: number;
  totalPurchased: number;
  totalRevenue: number; // in cents
  averageRating: number;
  totalReviews: number;
}

export interface IUser extends Document {
  // Authentication
  clerkId: string;
  email: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
  
  // Roles & Permissions
  isSeller: boolean;
  isAdmin: boolean;
  isVerified: boolean; // KYC verified
  
  // Payment Information
  stripeAccountId?: string;
  stripeCustomerId?: string;
  
  // Addresses
  addresses: IAddress[];
  defaultShippingAddressIndex?: number;
  
  // Shopping
  cart: ICartItem[];
  watchlist: mongoose.Types.ObjectId[]; // Array of item IDs
  
  // Statistics
  stats: IUserStats;
  
  // Social
  followers: mongoose.Types.ObjectId[]; // User IDs
  following: mongoose.Types.ObjectId[]; // User IDs
  
  // Account Status
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  lastLoginAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  label: String,
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  street1: {
    type: String,
    required: true,
    trim: true,
  },
  street2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: 'US',
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const UserStatsSchema = new Schema<IUserStats>({
  totalListings: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalSold: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPurchased: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  // Authentication
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  profileImageUrl: String,
  bio: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  
  // Roles & Permissions
  isSeller: {
    type: Boolean,
    default: false,
    index: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  
  // Payment Information
  stripeAccountId: String,
  stripeCustomerId: String,
  
  // Addresses
  addresses: {
    type: [AddressSchema],
    default: [],
  },
  defaultShippingAddressIndex: {
    type: Number,
    min: 0,
  },
  
  // Shopping
  cart: [{
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  watchlist: {
    type: [Schema.Types.ObjectId],
    ref: 'Item',
    default: [],
  },
  
  // Statistics
  stats: {
    type: UserStatsSchema,
    default: () => ({}),
  },
  
  // Social
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspensionReason: String,
  lastLoginAt: Date,
}, {
  timestamps: true,
});

// Compound indexes for common queries
UserSchema.index({ isSeller: 1, isActive: 1 });
UserSchema.index({ 'stats.averageRating': -1 });
UserSchema.index({ createdAt: -1 });

// Text search index
UserSchema.index({
  username: 'text',
  firstName: 'text',
  lastName: 'text',
  bio: 'text',
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Methods
UserSchema.methods = {
  // Check if user can sell
  canSell(): boolean {
    return this.isSeller && this.isActive && !this.isSuspended;
  },
  
  // Check if user can buy
  canBuy(): boolean {
    return this.isActive && !this.isSuspended;
  },
  
  // Get default shipping address
  getDefaultShippingAddress(): IAddress | null {
    if (this.defaultShippingAddressIndex !== undefined && this.addresses[this.defaultShippingAddressIndex]) {
      return this.addresses[this.defaultShippingAddressIndex];
    }
    return this.addresses.find((addr: IAddress) => addr.isDefault) || this.addresses[0] || null;
  },
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
