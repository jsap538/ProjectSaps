import mongoose, { Document, Schema, Model } from 'mongoose';

// Image subdocument
export interface IItemImage {
  url: string;
  publicId?: string; // For Cloudinary or similar services
  order: number; // Display order
  isMain: boolean; // Primary listing image
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
  favorites: number; // Count of users who watchlisted
  timesShared: number;
  clicks: number;
}

// Item methods interface
interface IItemMethods {
  isAvailable(): boolean;
  getMainImageUrl(): string | null;
  getTotalPrice(): number;
  isOfferAcceptable(offerAmount: number): boolean;
}

// Item statics interface
interface IItemModel extends Model<IItem, {}, IItemMethods> {
  findAvailable(filters?: any): Promise<IItem[]>;
  findBySeller(sellerId: mongoose.Types.ObjectId): Promise<IItem[]>;
}

export interface IItem extends Document {
  // Basic Information
  title: string;
  description: string;
  brand: string;
  
  // Pricing
  price_cents: number;
  originalPrice_cents?: number; // For showing discounts
  shipping_cents: number;
  acceptsOffers: boolean;
  lowestOfferPrice_cents?: number; // Minimum acceptable offer
  
  // Images (supporting multiple)
  images: IItemImage[];
  
  // Classification
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: 'tie' | 'belt' | 'cufflinks' | 'pocket-square' | 
            'dress-shirt' | 'casual-shirt' | 't-shirt' | 'polo-shirt' | 'sweater' |
            'dress-pants' | 'jeans' | 'chinos' | 'shorts' |
            'suit-jacket' | 'blazer' | 'coat' |
            'dress-shoes' | 'sneakers' | 'boots' |
            'watch' | 'bag' | 'wallet' | 'sunglasses' | 'hat' | 'scarf';
  color: string;
  material?: string;
  
  // Measurements
  dimensions: IItemDimensions;
  
  // Category-specific attributes (flexible schema for dynamic fields)
  categoryAttributes?: Record<string, any>;
  
  // Location & Shipping
  location: string;
  shipsFrom?: string; // City/State for shipping calculation
  shipsTo: string[]; // Countries item ships to
  processingTime_days?: number; // Days to ship after purchase
  
  // Seller Information
  sellerId: mongoose.Types.ObjectId;
  
  // Status
  isActive: boolean;
  isApproved: boolean;
  isSold: boolean;
  soldAt?: Date;
  soldTo?: mongoose.Types.ObjectId; // Buyer user ID
  
  // Featured/Promotion
  isFeatured: boolean;
  featuredUntil?: Date;
  
  // Statistics
  stats: IItemStats;
  
  // Admin/Moderation
  rejectionReason?: string;
  moderationNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ItemImageSchema = new Schema<IItemImage>({
  url: {
    type: String,
    required: true,
  },
  publicId: String, // For cloud storage management
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const ItemDimensionsSchema = new Schema<IItemDimensions>({
  width_cm: {
    type: Number,
    min: 0,
  },
  length_cm: {
    type: Number,
    min: 0,
  },
  height_cm: {
    type: Number,
    min: 0,
  },
  weight_g: {
    type: Number,
    min: 0,
  },
}, { _id: false });

const ItemStatsSchema = new Schema<IItemStats>({
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  favorites: {
    type: Number,
    default: 0,
    min: 0,
  },
  timesShared: {
    type: Number,
    default: 0,
    min: 0,
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

const ItemSchema = new Schema<IItem>({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  
  // Pricing
  price_cents: {
    type: Number,
    required: true,
    min: 100, // Minimum $1.00
    index: true,
  },
  originalPrice_cents: {
    type: Number,
    min: 100,
  },
  shipping_cents: {
    type: Number,
    required: true,
    min: 0,
    default: 599, // Default $5.99
  },
  acceptsOffers: {
    type: Boolean,
    default: false,
  },
  lowestOfferPrice_cents: {
    type: Number,
    min: 100,
  },
  
  // Images (supporting multiple)
  images: {
    type: [ItemImageSchema],
    required: true,
    validate: {
      validator: function(images: IItemImage[]) {
        return images.length > 0 && images.length <= 10;
      },
      message: 'Item must have between 1 and 10 images',
    },
  },
  
  // Classification
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Original categories
      'tie', 'belt', 'cufflinks', 'pocket-square',
      // Tops
      'dress-shirt', 'casual-shirt', 't-shirt', 'polo-shirt', 'sweater',
      // Bottoms
      'dress-pants', 'jeans', 'chinos', 'shorts',
      // Outerwear
      'suit-jacket', 'blazer', 'coat',
      // Footwear
      'dress-shoes', 'sneakers', 'boots',
      // Accessories
      'watch', 'bag', 'wallet', 'sunglasses', 'hat', 'scarf',
    ],
    index: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  material: {
    type: String,
    trim: true,
  },
  
  // Measurements
  dimensions: {
    type: ItemDimensionsSchema,
    default: () => ({}),
  },

  // Category-specific attributes (flexible schema for dynamic fields)
  categoryAttributes: {
    type: Schema.Types.Mixed,
    default: () => ({}),
  },
  
  // Location & Shipping
  location: {
    type: String,
    required: true,
    trim: true,
  },
  shipsFrom: {
    type: String,
    trim: true,
  },
  shipsTo: {
    type: [String],
    default: ['US'],
  },
  processingTime_days: {
    type: Number,
    min: 0,
    max: 30,
    default: 3,
  },
  
  // Seller Information
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true,
  },
  isSold: {
    type: Boolean,
    default: false,
    index: true,
  },
  soldAt: {
    type: Date,
    index: true,
  },
  soldTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Featured/Promotion
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  featuredUntil: Date,
  
  // Statistics
  stats: {
    type: ItemStatsSchema,
    default: () => ({}),
  },
  
  // Admin/Moderation
  rejectionReason: {
    type: String,
    maxlength: 500,
  },
  moderationNotes: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
ItemSchema.index({ isActive: 1, isApproved: 1, isSold: 1 }); // Browse active listings
ItemSchema.index({ sellerId: 1, isActive: 1 }); // Seller's active listings
ItemSchema.index({ category: 1, condition: 1, price_cents: 1 }); // Filter by category
ItemSchema.index({ brand: 1, condition: 1 }); // Brand filtering
ItemSchema.index({ isFeatured: 1, featuredUntil: 1 }); // Featured items
ItemSchema.index({ createdAt: -1 }); // Newest first
ItemSchema.index({ 'stats.views': -1 }); // Most viewed
ItemSchema.index({ 'stats.favorites': -1 }); // Most favorited

// Text search index for searching
ItemSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text',
  color: 'text',
  material: 'text',
});

// Virtual for main image
ItemSchema.virtual('mainImage').get(function() {
  const main = this.images.find((img: IItemImage) => img.isMain);
  return main || this.images[0];
});

// Methods
ItemSchema.methods = {
  // Check if item is available for purchase
  isAvailable(): boolean {
    return this.isActive && this.isApproved && !this.isSold;
  },
  
  // Get main image URL
  getMainImageUrl(): string | null {
    const main = this.images.find((img: IItemImage) => img.isMain);
    return main ? main.url : (this.images[0]?.url || null);
  },
  
  // Calculate total price (item + shipping)
  getTotalPrice(): number {
    return this.price_cents + this.shipping_cents;
  },
  
  // Check if offer is acceptable
  isOfferAcceptable(offerAmount: number): boolean {
    if (!this.acceptsOffers) return false;
    if (this.lowestOfferPrice_cents && offerAmount < this.lowestOfferPrice_cents) return false;
    return offerAmount > 0 && offerAmount <= this.price_cents;
  },
};

// Statics
ItemSchema.static('findAvailable', async function(filters = {}) {
  return this.find({
    isActive: true,
    isApproved: true,
    isSold: false,
    ...filters,
  });
});

ItemSchema.static('findBySeller', async function(sellerId: mongoose.Types.ObjectId) {
  return this.find({ sellerId }).sort({ createdAt: -1 });
});

const Item = (mongoose.models.Item || mongoose.model<IItem, IItemModel>('Item', ItemSchema)) as IItemModel;

export default Item;
