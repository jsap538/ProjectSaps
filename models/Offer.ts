import mongoose, { Document, Schema, Model } from 'mongoose';

// Offer methods interface
interface IOfferMethods {
  isActive(): boolean;
  isExpired(): boolean;
  getDiscountPercentage(): number;
  accept(responseMessage?: string): Promise<void>;
  decline(responseMessage?: string): Promise<void>;
  counter(counterAmount: number, counterMessage?: string): Promise<void>;
  withdraw(): Promise<void>;
}

// Offer statics interface
interface IOfferModel extends Model<IOffer, {}, IOfferMethods> {
  findActiveForItem(itemId: mongoose.Types.ObjectId): Promise<IOffer[]>;
  findByBuyer(buyerId: mongoose.Types.ObjectId, status?: string): Promise<IOffer[]>;
  findBySeller(sellerId: mongoose.Types.ObjectId, status?: string): Promise<IOffer[]>;
  hasActiveOffer(itemId: mongoose.Types.ObjectId, buyerId: mongoose.Types.ObjectId): Promise<boolean>;
  expireOldOffers(): Promise<any>;
  getHighestOffer(itemId: mongoose.Types.ObjectId): Promise<IOffer | null>;
}

export interface IOffer extends Document {
  // What is being offered on
  itemId: mongoose.Types.ObjectId;
  
  // Who is making the offer
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  
  // Offer details
  offerAmount_cents: number;
  originalPrice_cents: number; // Item's listing price at time of offer
  message?: string; // Optional message to seller
  
  // Status
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired' | 'withdrawn';
  
  // Counter offer
  counterOffer_cents?: number;
  counterMessage?: string;
  counteredAt?: Date;
  
  // Response
  respondedAt?: Date;
  responseMessage?: string;
  
  // Expiration
  expiresAt: Date;
  
  // If accepted, track the order
  orderId?: mongoose.Types.ObjectId;
  acceptedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>({
  // What is being offered on
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true,
  },
  
  // Who is making the offer
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
  
  // Offer details
  offerAmount_cents: {
    type: Number,
    required: true,
    min: 100, // Minimum $1.00
  },
  originalPrice_cents: {
    type: Number,
    required: true,
    min: 100,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'declined', 'countered', 'expired', 'withdrawn'],
    default: 'pending',
    index: true,
  },
  
  // Counter offer
  counterOffer_cents: {
    type: Number,
    min: 100,
  },
  counterMessage: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  counteredAt: Date,
  
  // Response
  respondedAt: Date,
  responseMessage: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  
  // Expiration (default 48 hours from creation)
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  
  // If accepted, track the order
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  acceptedAt: Date,
}, {
  timestamps: true,
});

// Compound indexes for common queries
OfferSchema.index({ itemId: 1, status: 1 }); // Offers on item
OfferSchema.index({ buyerId: 1, status: 1, createdAt: -1 }); // Buyer's offers
OfferSchema.index({ sellerId: 1, status: 1, createdAt: -1 }); // Seller's offers
OfferSchema.index({ status: 1, expiresAt: 1 }); // Expiring offers
OfferSchema.index({ itemId: 1, buyerId: 1, status: 1 }); // Prevent duplicate active offers

// Pre-save hook to set expiration if not set
OfferSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    // Default expiration: 48 hours from now
    this.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  }
  next();
});

// Methods
OfferSchema.methods = {
  // Check if offer is active
  isActive(): boolean {
    return this.status === 'pending' && new Date() < this.expiresAt;
  },
  
  // Check if offer is expired
  isExpired(): boolean {
    return new Date() >= this.expiresAt && this.status === 'pending';
  },
  
  // Calculate discount percentage
  getDiscountPercentage(): number {
    const discount = this.originalPrice_cents - this.offerAmount_cents;
    return (discount / this.originalPrice_cents) * 100;
  },
  
  // Accept offer
  async accept(responseMessage?: string): Promise<void> {
    if (!this.isActive()) {
      throw new Error('Cannot accept inactive or expired offer');
    }
    this.status = 'accepted';
    this.acceptedAt = new Date();
    this.respondedAt = new Date();
    if (responseMessage) {
      this.responseMessage = responseMessage;
    }
    await this.save();
  },
  
  // Decline offer
  async decline(responseMessage?: string): Promise<void> {
    if (!this.isActive()) {
      throw new Error('Cannot decline inactive or expired offer');
    }
    this.status = 'declined';
    this.respondedAt = new Date();
    if (responseMessage) {
      this.responseMessage = responseMessage;
    }
    await this.save();
  },
  
  // Counter offer
  async counter(counterAmount: number, counterMessage?: string): Promise<void> {
    if (!this.isActive()) {
      throw new Error('Cannot counter inactive or expired offer');
    }
    this.status = 'countered';
    this.counterOffer_cents = counterAmount;
    this.counterMessage = counterMessage;
    this.counteredAt = new Date();
    this.respondedAt = new Date();
    // Extend expiration by 24 hours when countered
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.save();
  },
  
  // Withdraw offer
  async withdraw(): Promise<void> {
    if (this.status !== 'pending') {
      throw new Error('Can only withdraw pending offers');
    }
    this.status = 'withdrawn';
    await this.save();
  },
};

// Statics
OfferSchema.statics = {
  // Find active offers for an item
  async findActiveForItem(this: IOfferModel, itemId: mongoose.Types.ObjectId) {
    return this.find({
      itemId,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
  },
  
  // Find offers for a buyer
  async findByBuyer(this: IOfferModel, buyerId: mongoose.Types.ObjectId, status?: string) {
    const query: any = { buyerId };
    if (status) query.status = status;
    return this.find(query).sort({ createdAt: -1 });
  },
  
  // Find offers for a seller
  async findBySeller(this: IOfferModel, sellerId: mongoose.Types.ObjectId, status?: string) {
    const query: any = { sellerId };
    if (status) query.status = status;
    return this.find(query).sort({ createdAt: -1 });
  },
  
  // Check if buyer has active offer on item
  async hasActiveOffer(this: IOfferModel, itemId: mongoose.Types.ObjectId, buyerId: mongoose.Types.ObjectId): Promise<boolean> {
    const offer = await this.findOne({
      itemId,
      buyerId,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    });
    return !!offer;
  },
  
  // Expire old offers (to be run by cron job)
  async expireOldOffers(this: IOfferModel) {
    return this.updateMany(
      {
        status: 'pending',
        expiresAt: { $lt: new Date() },
      },
      {
        $set: { status: 'expired' },
      }
    );
  },
  
  // Get highest active offer for an item
  async getHighestOffer(this: IOfferModel, itemId: mongoose.Types.ObjectId) {
    const offers = await this.find({
      itemId,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    }).sort({ offerAmount_cents: -1 }).limit(1);
    
    return offers[0] || null;
  },
};

const Offer = (mongoose.models.Offer || mongoose.model<IOffer, IOfferModel>('Offer', OfferSchema)) as IOfferModel;

export default Offer;

