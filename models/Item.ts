import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
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
  sellerId: mongoose.Types.ObjectId;
  isActive: boolean;
  isApproved: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  price_cents: {
    type: Number,
    required: true,
    min: 100, // Minimum $1.00
  },
  shipping_cents: {
    type: Number,
    required: true,
    min: 0,
    default: 599, // Default $5.99
  },
  images: [{
    type: String,
    required: true,
  }],
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
  },
  category: {
    type: String,
    required: true,
    enum: ['tie', 'belt', 'cufflinks', 'pocket-square'],
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  material: {
    type: String,
    trim: true,
  },
  width_cm: {
    type: Number,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
ItemSchema.index({ sellerId: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ brand: 1 });
ItemSchema.index({ condition: 1 });
ItemSchema.index({ price_cents: 1 });
ItemSchema.index({ isActive: 1, isApproved: 1 });
ItemSchema.index({ createdAt: -1 });

// Text search index
ItemSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text',
  color: 'text',
});

const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
