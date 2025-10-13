import mongoose, { Document, Schema, Model } from 'mongoose';

// Report methods interface
interface IReportMethods {
  isResolved(): boolean;
  markAsResolved(action: 'dismissed' | 'item_removed' | 'user_warned', adminId: mongoose.Types.ObjectId): Promise<void>;
}

// Report statics interface
interface IReportModel extends Model<IReport, {}, IReportMethods> {
  findPendingReports(): Promise<IReport[]>;
  findReportsForItem(itemId: mongoose.Types.ObjectId): Promise<IReport[]>;
  countReportsForItem(itemId: mongoose.Types.ObjectId): Promise<number>;
  findReportsByUser(reporterId: mongoose.Types.ObjectId): Promise<IReport[]>;
  shouldAutoTakedown(itemId: mongoose.Types.ObjectId): Promise<boolean>;
}

export interface IReport extends Document {
  // What is being reported
  itemId: mongoose.Types.ObjectId;
  
  // Who reported it
  reporterId: mongoose.Types.ObjectId;
  
  // Report details
  reason: 'counterfeit' | 'inappropriate' | 'misleading' | 'prohibited' | 'spam' | 'copyright' | 'other';
  description?: string; // Additional details from reporter
  
  // Status
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  
  // Admin action
  reviewedBy?: mongoose.Types.ObjectId; // Admin who reviewed
  reviewedAt?: Date;
  adminNotes?: string;
  action?: 'dismissed' | 'item_removed' | 'user_warned' | 'user_banned';
  
  // Priority (based on reason and reporter reputation)
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  // What is being reported
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true,
  },
  
  // Who reported it
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Report details
  reason: {
    type: String,
    required: true,
    enum: ['counterfeit', 'inappropriate', 'misleading', 'prohibited', 'spam', 'copyright', 'other'],
    index: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
    index: true,
  },
  
  // Admin action
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: Date,
  adminNotes: {
    type: String,
    maxlength: 1000,
  },
  action: {
    type: String,
    enum: ['dismissed', 'item_removed', 'user_warned', 'user_banned'],
  },
  
  // Priority
  priority: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true,
  },
}, {
  timestamps: true,
});

// Compound indexes
ReportSchema.index({ itemId: 1, status: 1 }); // Reports for item
ReportSchema.index({ reporterId: 1, createdAt: -1 }); // Reporter's reports
ReportSchema.index({ status: 1, priority: -1, createdAt: -1 }); // Admin queue
ReportSchema.index({ itemId: 1, reporterId: 1 }, { unique: true }); // Prevent duplicate reports

// Auto-set priority based on reason
ReportSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.reason) {
      case 'counterfeit':
      case 'prohibited':
        this.priority = 'urgent';
        break;
      case 'inappropriate':
      case 'copyright':
        this.priority = 'high';
        break;
      case 'misleading':
        this.priority = 'normal';
        break;
      default:
        this.priority = 'low';
    }
  }
  next();
});

// Methods
ReportSchema.methods = {
  isResolved(): boolean {
    return this.status === 'resolved' || this.status === 'dismissed';
  },
  
  async markAsResolved(
    action: 'dismissed' | 'item_removed' | 'user_warned',
    adminId: mongoose.Types.ObjectId
  ): Promise<void> {
    this.status = 'resolved';
    this.action = action;
    this.reviewedBy = adminId;
    this.reviewedAt = new Date();
    await this.save();
  },
};

// Statics
ReportSchema.static('findPendingReports', async function() {
  return this.find({ status: 'pending' })
    .populate('itemId', 'title brand images')
    .populate('reporterId', 'firstName lastName email')
    .sort({ priority: -1, createdAt: -1 });
});

ReportSchema.static('findReportsForItem', async function(itemId: mongoose.Types.ObjectId) {
  return this.find({ itemId })
    .populate('reporterId', 'firstName lastName')
    .sort({ createdAt: -1 });
});

ReportSchema.static('countReportsForItem', async function(itemId: mongoose.Types.ObjectId): Promise<number> {
  return this.countDocuments({ 
    itemId, 
    status: { $in: ['pending', 'under_review'] } 
  });
});

ReportSchema.static('findReportsByUser', async function(reporterId: mongoose.Types.ObjectId) {
  return this.find({ reporterId })
    .populate('itemId', 'title brand')
    .sort({ createdAt: -1 });
});

ReportSchema.static('shouldAutoTakedown', async function(itemId: mongoose.Types.ObjectId): Promise<boolean> {
  const reportCount = await this.countDocuments({
    itemId,
    status: { $in: ['pending', 'under_review'] },
  });
  
  // Auto-takedown if 3 or more unique users report the same item
  return reportCount >= 3;
});

const Report = (mongoose.models.Report || mongoose.model<IReport, IReportModel>('Report', ReportSchema)) as IReportModel;

export default Report;


