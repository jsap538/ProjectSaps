import mongoose from 'mongoose';

// MongoDB connection string - should come from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.error('Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

// Define User schema
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  profileImageUrl: String,
  isSeller: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  stripeAccountId: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSales: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function makeUserAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Please provide an email address');
      console.error('Usage: node scripts/run-with-env.js scripts/make-admin.mjs <email>');
      console.error('Example: node scripts/run-with-env.js scripts/make-admin.mjs user@example.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      console.log('Available users:');
      const allUsers = await User.find({}, 'email firstName lastName');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.firstName} ${u.lastName})`);
      });
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.firstName} ${user.lastName}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Clerk ID: ${user.clerkId}`);
    console.log(`👑 Current admin status: ${user.isAdmin}`);

    if (user.isAdmin) {
      console.log('✅ User is already an admin!');
    } else {
      // Make user admin
      user.isAdmin = true;
      await user.save();
      console.log('🎉 User is now an admin!');
    }

    console.log('\n📊 User Summary:');
    console.log(`👤 Name: ${user.firstName} ${user.lastName}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👑 Admin: ${user.isAdmin}`);
    console.log(`🛍️ Seller: ${user.isSeller}`);
    console.log(`⭐ Rating: ${user.rating}`);
    console.log(`💰 Total Sales: ${user.totalSales}`);

  } catch (error) {
    console.error('❌ Error making user admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
makeUserAdmin();
