import mongoose, { Document, Schema } from 'mongoose';

// Attachment subdocument
export interface IMessageAttachment {
  type: 'image' | 'document';
  url: string;
  filename: string;
  size_bytes: number;
}

export interface IMessage extends Document {
  // Conversation context
  conversationId: string; // Group messages by conversation
  orderId?: mongoose.Types.ObjectId; // Optional order reference
  itemId?: mongoose.Types.ObjectId; // Optional item reference
  
  // Participants
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  
  // Message content
  content: string;
  attachments: IMessageAttachment[];
  
  // Message type
  type: 'text' | 'system' | 'offer'; // System messages for automated notifications
  
  // Status
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean; // Soft delete
  deletedBy?: mongoose.Types.ObjectId[];
  
  // Moderation
  isFlagged: boolean;
  flagReason?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>({
  type: {
    type: String,
    required: true,
    enum: ['image', 'document'],
  },
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  size_bytes: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: true });

const MessageSchema = new Schema<IMessage>({
  // Conversation context
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    index: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    index: true,
  },
  
  // Participants
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Message content
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  attachments: {
    type: [MessageAttachmentSchema],
    default: [],
    validate: {
      validator: function(attachments: IMessageAttachment[]) {
        return attachments.length <= 5;
      },
      message: 'Maximum 5 attachments per message',
    },
  },
  
  // Message type
  type: {
    type: String,
    required: true,
    enum: ['text', 'system', 'offer'],
    default: 'text',
    index: true,
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  
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
}, {
  timestamps: true,
});

// Compound indexes for common queries
MessageSchema.index({ conversationId: 1, createdAt: -1 }); // Messages in conversation
MessageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 }); // Direct messages
MessageSchema.index({ recipientId: 1, isRead: 1 }); // Unread messages
MessageSchema.index({ orderId: 1, createdAt: -1 }); // Order-related messages
MessageSchema.index({ itemId: 1, createdAt: -1 }); // Item-related messages

// Methods
MessageSchema.methods = {
  // Check if message is visible to user
  isVisibleTo(userId: mongoose.Types.ObjectId): boolean {
    if (this.isDeleted && this.deletedBy?.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
      return false;
    }
    return this.senderId.equals(userId) || this.recipientId.equals(userId);
  },
  
  // Mark as read by recipient
  async markAsRead(): Promise<void> {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date();
      await this.save();
    }
  },
  
  // Soft delete for a user
  async deleteForUser(userId: mongoose.Types.ObjectId): Promise<void> {
    if (!this.deletedBy) {
      this.deletedBy = [];
    }
    if (!this.deletedBy.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
      this.deletedBy.push(userId);
      await this.save();
    }
  },
};

// Statics
MessageSchema.statics = {
  // Generate conversation ID between two users
  generateConversationId(userId1: mongoose.Types.ObjectId, userId2: mongoose.Types.ObjectId): string {
    const ids = [userId1.toString(), userId2.toString()].sort();
    return ids.join('-');
  },
  
  // Find conversation between two users
  async findConversation(
    userId1: mongoose.Types.ObjectId,
    userId2: mongoose.Types.ObjectId,
    itemId?: mongoose.Types.ObjectId
  ) {
    const conversationId = this.generateConversationId(userId1, userId2);
    const query: any = { conversationId, isDeleted: false };
    if (itemId) query.itemId = itemId;
    
    return this.find(query).sort({ createdAt: 1 });
  },
  
  // Find all conversations for a user
  async findUserConversations(userId: mongoose.Types.ObjectId) {
    // Get all unique conversations
    const conversations = await this.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }],
          isDeleted: false,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$recipientId', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);
    
    return conversations;
  },
  
  // Count unread messages for user
  async countUnreadForUser(userId: mongoose.Types.ObjectId): Promise<number> {
    return this.countDocuments({
      recipientId: userId,
      isRead: false,
      isDeleted: false,
    });
  },
  
  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: mongoose.Types.ObjectId) {
    return this.updateMany(
      {
        conversationId,
        recipientId: userId,
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
};

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

