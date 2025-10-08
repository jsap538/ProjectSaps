import mongoose, { Document, Schema, Model } from 'mongoose';

// Stripe details subdocument
export interface IStripeDetails {
  chargeId?: string;
  paymentIntentId?: string;
  refundId?: string;
  payoutId?: string;
  fee_cents: number; // Stripe processing fee
  net_cents: number; // Amount after Stripe fee
}

// Transaction methods interface
interface ITransactionMethods {
  isComplete(): boolean;
  isFailed(): boolean;
  getPlatformRevenue(): number;
  getSellerEarnings(): number;
}

// Transaction statics interface  
interface ITransactionModel extends Model<ITransaction, {}, ITransactionMethods> {
  createPayment(orderId: mongoose.Types.ObjectId, buyerId: mongoose.Types.ObjectId, sellerId: mongoose.Types.ObjectId, amount_cents: number, platformFee_cents: number, stripeFee_cents: number): Promise<ITransaction>;
  findByOrder(orderId: mongoose.Types.ObjectId): Promise<ITransaction[]>;
  calculatePlatformRevenue(startDate?: Date, endDate?: Date): Promise<number>;
}

export interface ITransaction extends Document {
  // Reference to order
  orderId: mongoose.Types.ObjectId;
  
  // Parties involved
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  
  // Transaction type
  type: 'payment' | 'refund' | 'payout' | 'fee' | 'adjustment';
  
  // Amount details
  amount_cents: number; // Transaction amount
  platformFee_cents: number; // SAPS platform fee
  stripeFee_cents: number; // Stripe processing fee
  netAmount_cents: number; // Amount after all fees
  currency: string; // USD, EUR, etc.
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  
  // Payment details
  stripeDetails?: IStripeDetails;
  
  // Description
  description: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Failure information
  failureCode?: string;
  failureMessage?: string;
  
  // Timestamps
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StripeDetailsSchema = new Schema<IStripeDetails>({
  chargeId: String,
  paymentIntentId: String,
  refundId: String,
  payoutId: String,
  fee_cents: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  net_cents: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const TransactionSchema = new Schema<ITransaction>({
  // Reference to order
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
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
  
  // Transaction type
  type: {
    type: String,
    required: true,
    enum: ['payment', 'refund', 'payout', 'fee', 'adjustment'],
    index: true,
  },
  
  // Amount details
  amount_cents: {
    type: Number,
    required: true,
    min: 0,
  },
  platformFee_cents: {
    type: Number,
    default: 0,
    min: 0,
  },
  stripeFee_cents: {
    type: Number,
    default: 0,
    min: 0,
  },
  netAmount_cents: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true,
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  
  // Payment details
  stripeDetails: StripeDetailsSchema,
  
  // Description
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  
  // Metadata
  metadata: {
    type: Schema.Types.Mixed,
  },
  
  // Failure information
  failureCode: String,
  failureMessage: {
    type: String,
    maxlength: 500,
  },
  
  // Timestamps
  processedAt: Date,
  completedAt: Date,
  failedAt: Date,
}, {
  timestamps: true,
});

// Compound indexes for common queries
TransactionSchema.index({ orderId: 1, type: 1 }); // Transactions by order
TransactionSchema.index({ buyerId: 1, status: 1, createdAt: -1 }); // Buyer's transactions
TransactionSchema.index({ sellerId: 1, status: 1, createdAt: -1 }); // Seller's transactions
TransactionSchema.index({ type: 1, status: 1 }); // Transactions by type and status
TransactionSchema.index({ status: 1, createdAt: -1 }); // All transactions by status
TransactionSchema.index({ 'stripeDetails.paymentIntentId': 1 }); // Lookup by Stripe ID

// Methods
TransactionSchema.methods = {
  // Check if transaction is complete
  isComplete(): boolean {
    return this.status === 'completed';
  },
  
  // Check if transaction failed
  isFailed(): boolean {
    return this.status === 'failed';
  },
  
  // Calculate platform's revenue
  getPlatformRevenue(): number {
    return this.platformFee_cents;
  },
  
  // Calculate seller's net earnings
  getSellerEarnings(): number {
    if (this.type === 'payout') {
      return this.netAmount_cents;
    }
    return 0;
  },
};

// Statics
TransactionSchema.static('createPayment', async function(
  orderId: mongoose.Types.ObjectId,
  buyerId: mongoose.Types.ObjectId,
  sellerId: mongoose.Types.ObjectId,
  amount_cents: number,
  platformFee_cents: number,
  stripeFee_cents: number
) {
  return this.create({
    orderId,
    buyerId,
    sellerId,
    type: 'payment',
    amount_cents,
    platformFee_cents,
    stripeFee_cents,
    netAmount_cents: amount_cents - platformFee_cents - stripeFee_cents,
    currency: 'USD',
    description: `Payment for order ${orderId}`,
    status: 'pending',
  });
});

TransactionSchema.static('findByOrder', async function(orderId: mongoose.Types.ObjectId) {
  return this.find({ orderId }).sort({ createdAt: -1 });
});

TransactionSchema.static('calculatePlatformRevenue', async function(startDate?: Date, endDate?: Date) {
  const match: any = { status: 'completed', type: 'payment' };
  if (startDate) match.createdAt = { $gte: startDate };
  if (endDate) match.createdAt = { ...match.createdAt, $lte: endDate };
  
  const result = await this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$platformFee_cents' } } },
  ]);
  
  return result[0]?.total || 0;
});

const Transaction = (mongoose.models.Transaction || mongoose.model<ITransaction, ITransactionModel>('Transaction', TransactionSchema)) as ITransactionModel;

export default Transaction;

