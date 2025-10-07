const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  isSeller: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  stripeAccountId: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSales: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the first user and make them admin
    const user = await User.findOne();
    
    if (!user) {
      console.log('No users found in database');
      return;
    }

    user.isAdmin = true;
    await user.save();
    
    console.log(`User ${user.firstName} ${user.lastName} (${user.email}) is now an admin!`);
    console.log('Clerk ID:', user.clerkId);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
