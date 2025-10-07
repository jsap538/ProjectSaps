import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  isSeller: boolean;
  stripeAccountId?: string;
  rating?: number;
  totalSales?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
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
    index: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  profileImageUrl: String,
  isSeller: {
    type: Boolean,
    default: false,
  },
  stripeAccountId: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes are now defined in the schema fields above

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
