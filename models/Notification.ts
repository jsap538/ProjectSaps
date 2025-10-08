import mongoose, { Document, Schema } from 'mongoose';

// Action link subdocument (where notification should redirect)
export interface INotificationAction {
  label: string; // e.g., "View Order", "Reply", "View Item"
  url: string; // Relative URL in the app
}

export interface INotification extends Document {
  // Who receives the notification
  userId: mongoose.Types.ObjectId;
  
  // Notification content
  type: 
    | 'order_placed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'payment_received'
    | 'offer_received'
    | 'offer_accepted'
    | 'offer_declined'
    | 'offer_countered'
    | 'message_received'
    | 'item_sold'
    | 'item_approved'
    | 'item_rejected'
    | 'review_received'
    | 'watchlist_item_price_drop'
    | 'watchlist_item_sold'
    | 'follow_new'
    | 'system';
  
  title: string;
  message: string;
  icon?: string; // Icon name or emoji
  
  // Action (where to go when clicked)
  action?: INotificationAction;
  
  // Related entities (for quick lookup)
  relatedOrder?: mongoose.Types.ObjectId;
  relatedItem?: mongoose.Types.ObjectId;
  relatedUser?: mongoose.Types.ObjectId;
  relatedOffer?: mongoose.Types.ObjectId;
  relatedMessage?: mongoose.Types.ObjectId;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  isArchived: boolean;
  archivedAt?: Date;
  
  // Priority
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Delivery channels
  sentViaEmail: boolean;
  sentViaSMS: boolean;
  emailSentAt?: Date;
  smsSentAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const NotificationActionSchema = new Schema<INotificationAction>({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { _id: false });

const NotificationSchema = new Schema<INotification>({
  // Who receives the notification
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Notification content
  type: {
    type: String,
    required: true,
    enum: [
      'order_placed',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'payment_received',
      'offer_received',
      'offer_accepted',
      'offer_declined',
      'offer_countered',
      'message_received',
      'item_sold',
      'item_approved',
      'item_rejected',
      'review_received',
      'watchlist_item_price_drop',
      'watchlist_item_sold',
      'follow_new',
      'system',
    ],
    index: true,
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  icon: String,
  
  // Action (where to go when clicked)
  action: NotificationActionSchema,
  
  // Related entities (for quick lookup)
  relatedOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    index: true,
  },
  relatedItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    index: true,
  },
  relatedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  relatedOffer: {
    type: Schema.Types.ObjectId,
    ref: 'Offer',
  },
  relatedMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: Date,
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
  archivedAt: Date,
  
  // Priority
  priority: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true,
  },
  
  // Delivery channels
  sentViaEmail: {
    type: Boolean,
    default: false,
  },
  sentViaSMS: {
    type: Boolean,
    default: false,
  },
  emailSentAt: Date,
  smsSentAt: Date,
}, {
  timestamps: true,
});

// Compound indexes for common queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 }); // User's unread notifications
NotificationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 }); // User's active notifications
NotificationSchema.index({ userId: 1, type: 1 }); // Notifications by type
NotificationSchema.index({ priority: 1, createdAt: -1 }); // High priority notifications
NotificationSchema.index({ createdAt: -1 }); // All notifications by date

// Methods
NotificationSchema.methods = {
  // Mark as read
  async markAsRead(): Promise<void> {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date();
      await this.save();
    }
  },
  
  // Mark as unread
  async markAsUnread(): Promise<void> {
    if (this.isRead) {
      this.isRead = false;
      this.readAt = undefined;
      await this.save();
    }
  },
  
  // Archive notification
  async archive(): Promise<void> {
    if (!this.isArchived) {
      this.isArchived = true;
      this.archivedAt = new Date();
      await this.save();
    }
  },
  
  // Unarchive notification
  async unarchive(): Promise<void> {
    if (this.isArchived) {
      this.isArchived = false;
      this.archivedAt = undefined;
      await this.save();
    }
  },
};

// Statics
NotificationSchema.statics = {
  // Create notification
  async createNotification(data: Partial<INotification>) {
    return this.create(data);
  },
  
  // Find user's notifications
  async findForUser(
    userId: mongoose.Types.ObjectId,
    options: {
      unreadOnly?: boolean;
      includeArchived?: boolean;
      limit?: number;
      skip?: number;
    } = {}
  ) {
    const query: any = { userId };
    
    if (options.unreadOnly) {
      query.isRead = false;
    }
    
    if (!options.includeArchived) {
      query.isArchived = false;
    }
    
    return this.find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 50)
      .skip(options.skip || 0);
  },
  
  // Count unread notifications for user
  async countUnreadForUser(userId: mongoose.Types.ObjectId): Promise<number> {
    return this.countDocuments({
      userId,
      isRead: false,
      isArchived: false,
    });
  },
  
  // Mark all as read for user
  async markAllAsReadForUser(userId: mongoose.Types.ObjectId) {
    return this.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );
  },
  
  // Delete old notifications (cleanup job)
  async deleteOldNotifications(daysOld: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return this.deleteMany({
      createdAt: { $lt: cutoffDate },
      isArchived: true,
    });
  },
  
  // Send notification to user (helper method)
  async notifyUser(
    userId: mongoose.Types.ObjectId,
    type: string,
    title: string,
    message: string,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      action?: INotificationAction;
      relatedOrder?: mongoose.Types.ObjectId;
      relatedItem?: mongoose.Types.ObjectId;
      relatedUser?: mongoose.Types.ObjectId;
      relatedOffer?: mongoose.Types.ObjectId;
      relatedMessage?: mongoose.Types.ObjectId;
      icon?: string;
    } = {}
  ) {
    return this.create({
      userId,
      type,
      title,
      message,
      priority: options.priority || 'normal',
      action: options.action,
      relatedOrder: options.relatedOrder,
      relatedItem: options.relatedItem,
      relatedUser: options.relatedUser,
      relatedOffer: options.relatedOffer,
      relatedMessage: options.relatedMessage,
      icon: options.icon,
    });
  },
};

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

