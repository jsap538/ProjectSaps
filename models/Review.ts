import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  // What is being reviewed
  orderId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  
  // Who is reviewing whom
  reviewerId: mongoose.Types.ObjectId; // Person leaving the review
  revieweeId: mongoose.Types.ObjectId; // Person being reviewed (seller or buyer)
  reviewType: 'seller' | 'buyer'; // Is this a seller review or buyer review?
  
  // Rating (1-5 stars)
  rating: number;
  
  // Review content
  title?: string;
  comment?: string;
  
  // Detailed ratings (optional)
  communicationRating?: number; // 1-5
  accuracyRating?: number; // Item as described (1-5)
  shippingRating?: number; // Shipping speed (1-5)
  
  // Status
  isPublished: boolean;
  isEdited: boolean;
  editedAt?: Date;
  
  // Moderation
  isFlagged: boolean;
  flagReason?: string;
  isHidden: boolean; // Hidden by admin
  hiddenReason?: string;
  
  // Response from reviewee
  response?: string;
  respondedAt?: Date;
  
  // Helpful votes
  helpfulCount: number;
  notHelpfulCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  // What is being reviewed
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true,
  },
  
  // Who is reviewing whom
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  revieweeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reviewType: {
    type: String,
    required: true,
    enum: ['seller', 'buyer'],
    index: true,
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true,
  },
  
  // Review content
  title: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  
  // Detailed ratings (optional)
  communicationRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  accuracyRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  shippingRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  
  // Status
  isPublished: {
    type: Boolean,
    default: true,
    index: true,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  
  // Moderation
  isFlagged: {
    type: Boolean,
    default: false,
    index: true,
  },
  flagReason: {
    type: String,
    maxlength: 500,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  hiddenReason: {
    type: String,
    maxlength: 500,
  },
  
  // Response from reviewee
  response: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  respondedAt: Date,
  
  // Helpful votes
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  notHelpfulCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
ReviewSchema.index({ revieweeId: 1, isPublished: 1, isHidden: 1 }); // User's reviews
ReviewSchema.index({ itemId: 1, isPublished: 1 }); // Item reviews
ReviewSchema.index({ orderId: 1, reviewType: 1 }); // Order reviews
ReviewSchema.index({ reviewerId: 1, revieweeId: 1, orderId: 1 }, { unique: true }); // Prevent duplicate reviews
ReviewSchema.index({ rating: -1, createdAt: -1 }); // Sort by rating
ReviewSchema.index({ helpfulCount: -1 }); // Most helpful
ReviewSchema.index({ createdAt: -1 }); // Most recent

// Virtual for average detailed rating
ReviewSchema.virtual('averageDetailedRating').get(function() {
  const ratings = [
    this.communicationRating,
    this.accuracyRating,
    this.shippingRating,
  ].filter((r: number | undefined) => r !== undefined && r !== null) as number[];
  
  if (ratings.length === 0) return null;
  return ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
});

// Methods
ReviewSchema.methods = {
  // Check if review can be edited
  canBeEdited(userId: mongoose.Types.ObjectId): boolean {
    return this.reviewerId.equals(userId) && !this.isHidden;
  },
  
  // Check if review can be responded to
  canBeRespondedTo(userId: mongoose.Types.ObjectId): boolean {
    return this.revieweeId.equals(userId) && !this.response;
  },
  
  // Check if review is visible
  isVisible(): boolean {
    return this.isPublished && !this.isHidden;
  },
  
  // Calculate helpfulness score
  getHelpfulnessScore(): number {
    const total = this.helpfulCount + this.notHelpfulCount;
    if (total === 0) return 0;
    return (this.helpfulCount / total) * 100;
  },
};

// Statics
ReviewSchema.statics = {
  // Find reviews for a user (seller or buyer)
  async findForUser(userId: mongoose.Types.ObjectId, reviewType?: 'seller' | 'buyer') {
    const query: any = {
      revieweeId: userId,
      isPublished: true,
      isHidden: false,
    };
    if (reviewType) query.reviewType = reviewType;
    
    return this.find(query).sort({ createdAt: -1 });
  },
  
  // Calculate average rating for a user
  async calculateAverageRating(userId: mongoose.Types.ObjectId, reviewType?: 'seller' | 'buyer') {
    const match: any = {
      revieweeId: userId,
      isPublished: true,
      isHidden: false,
    };
    if (reviewType) match.reviewType = reviewType;
    
    const result = await this.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          averageCommunication: { $avg: '$communicationRating' },
          averageAccuracy: { $avg: '$accuracyRating' },
          averageShipping: { $avg: '$shippingRating' },
        },
      },
    ]);
    
    return result[0] || {
      averageRating: 0,
      totalReviews: 0,
      averageCommunication: 0,
      averageAccuracy: 0,
      averageShipping: 0,
    };
  },
  
  // Find reviews for an item
  async findForItem(itemId: mongoose.Types.ObjectId) {
    return this.find({
      itemId,
      isPublished: true,
      isHidden: false,
    }).sort({ createdAt: -1 });
  },
  
  // Check if user can review an order
  async canReviewOrder(
    orderId: mongoose.Types.ObjectId,
    reviewerId: mongoose.Types.ObjectId,
    revieweeId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const existing = await this.findOne({
      orderId,
      reviewerId,
      revieweeId,
    });
    return !existing;
  },
};

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

