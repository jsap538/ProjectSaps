import mongoose, { Document, Schema, Model } from 'mongoose';

// Shipping address subdocument
export interface IOrderAddress {
  fullName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Order item subdocument
export interface IOrderItem {
  itemId: mongoose.Types.ObjectId;
  title: string; // Snapshot at time of purchase
  brand: string;
  price_cents: number; // Price at time of purchase
  shipping_cents: number;
  condition: string;
  imageUrl: string; // Main image snapshot
  quantity: number;
}

// Tracking information subdocument
export interface ITrackingInfo {
  carrier: string; // USPS, FedEx, UPS, etc.
  trackingNumber: string;
  trackingUrl?: string;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

// Refund information subdocument
export interface IRefundInfo {
  amount_cents: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: mongoose.Types.ObjectId; // Admin user ID
}

// Order methods interface
interface IOrderMethods {
  canBeCancelled(): boolean;
  canBeShipped(): boolean;
  canBeRefunded(): boolean;
  getSellerPayout(): number;
}

// Order statics interface
interface IOrderModel extends Model<IOrder, {}, IOrderMethods> {
  generateOrderNumber(): Promise<string>;
  findByBuyer(buyerId: mongoose.Types.ObjectId, filters?: any): Promise<IOrder[]>;
  findBySeller(sellerId: mongoose.Types.ObjectId, filters?: any): Promise<IOrder[]>;
}

export interface IOrder extends Document {
  // Order number for customer reference
  orderNumber: string; // e.g., "SAPS-20240101-ABCD"
  
  // Parties involved
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  
  // Order items
  items: IOrderItem[];
  
  // Pricing breakdown
  subtotal_cents: number; // Sum of item prices
  shipping_cents: number; // Sum of shipping costs
  tax_cents: number;
  serviceFee_cents: number; // Platform fee
  total_cents: number;
  
  // Payment information
  paymentIntentId?: string; // Stripe payment intent ID
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paidAt?: Date;
  
  // Shipping information
  shippingAddress: IOrderAddress;
  tracking?: ITrackingInfo;
  
  // Order status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'disputed' | 'completed';
  
  // Fulfillment
  confirmedAt?: Date; // When seller confirmed order
  shippedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date; // When order marked as complete
  cancelledAt?: Date;
  cancellationReason?: string;
  
  // Dispute & refund
  isDisputed: boolean;
  disputeReason?: string;
  disputedAt?: Date;
  refund?: IRefundInfo;
  
  // Notes
  buyerNotes?: string; // Note to seller
  sellerNotes?: string; // Note to buyer
  adminNotes?: string; // Internal notes
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const OrderAddressSchema = new Schema<IOrderAddress>({
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
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: true });

const TrackingInfoSchema = new Schema<ITrackingInfo>({
  carrier: {
    type: String,
    required: true,
    trim: true,
  },
  trackingNumber: {
    type: String,
    required: true,
    trim: true,
  },
  trackingUrl: String,
  shippedAt: Date,
  estimatedDelivery: Date,
  deliveredAt: Date,
}, { _id: false });

const RefundInfoSchema = new Schema<IRefundInfo>({
  amount_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  processedAt: Date,
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // Parties involved
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Order items
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: function(items: IOrderItem[]) {
        return items.length > 0;
      },
      message: 'Order must have at least one item',
    },
  },
  
  // Pricing breakdown
  subtotal_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  tax_cents: {
    type: Number,
    default: 0,
    min: 0,
  },
  serviceFee_cents: {
    type: Number,
    default: 0,
    min: 0,
  },
  total_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Payment information
  paymentIntentId: String,
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true,
  },
  paidAt: Date,
  
  // Shipping information
  shippingAddress: {
    type: OrderAddressSchema,
    required: true,
  },
  tracking: TrackingInfoSchema,
  
  // Order status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'disputed', 'completed'],
    default: 'pending',
    index: true,
  },
  
  // Fulfillment
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: {
    type: String,
    maxlength: 500,
  },
  
  // Dispute & refund
  isDisputed: {
    type: Boolean,
    default: false,
    index: true,
  },
  disputeReason: {
    type: String,
    maxlength: 1000,
  },
  disputedAt: Date,
  refund: RefundInfoSchema,
  
  // Notes
  buyerNotes: {
    type: String,
    maxlength: 500,
  },
  sellerNotes: {
    type: String,
    maxlength: 500,
  },
  adminNotes: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
OrderSchema.index({ buyerId: 1, status: 1 }); // Buyer's orders by status
OrderSchema.index({ sellerId: 1, status: 1 }); // Seller's orders by status
OrderSchema.index({ buyerId: 1, createdAt: -1 }); // Buyer's order history
OrderSchema.index({ sellerId: 1, createdAt: -1 }); // Seller's order history
OrderSchema.index({ status: 1, createdAt: -1 }); // Orders by status and date
OrderSchema.index({ paymentStatus: 1, status: 1 }); // Payment and order status
OrderSchema.index({ 'items.itemId': 1 }); // Find orders containing specific item

// Methods
OrderSchema.methods = {
  // Check if order can be cancelled
  canBeCancelled(): boolean {
    return ['pending', 'confirmed'].includes(this.status) && !this.shippedAt;
  },
  
  // Check if order can be shipped
  canBeShipped(): boolean {
    return this.status === 'confirmed' && this.paymentStatus === 'paid' && !this.shippedAt;
  },
  
  // Check if order can be refunded
  canBeRefunded(): boolean {
    return this.paymentStatus === 'paid' && !this.refund && this.status !== 'cancelled';
  },
  
  // Calculate seller payout (total - fees)
  getSellerPayout(): number {
    return this.total_cents - this.serviceFee_cents;
  },
};

// Statics
OrderSchema.statics = {
  // Generate unique order number
  async generateOrderNumber(this: IOrderModel): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SAPS-${date}-${random}`;
  },
  
  // Find orders by buyer
  async findByBuyer(this: IOrderModel, buyerId: mongoose.Types.ObjectId, filters = {}) {
    return this.find({ buyerId, ...filters }).sort({ createdAt: -1 });
  },
  
  // Find orders by seller
  async findBySeller(this: IOrderModel, sellerId: mongoose.Types.ObjectId, filters = {}) {
    return this.find({ sellerId, ...filters }).sort({ createdAt: -1 });
  },
};

const Order = (mongoose.models.Order || mongoose.model<IOrder, IOrderModel>('Order', OrderSchema)) as IOrderModel;

export default Order;

