import mongoose from 'mongoose';

// MongoDB connection string - should come from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.error('Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

// Define schemas directly in the script
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

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price_cents: { type: Number, required: true },
  shipping_cents: { type: Number, required: true },
  images: [{ type: String, required: true }],
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], required: true },
  category: { type: String, enum: ['tie', 'belt', 'cufflinks', 'pocket-square'], required: true },
  color: { type: String, required: true },
  material: String,
  width_cm: Number,
  location: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

// Mock items data
const mockItems = [
  {
    title: "Navy Grenadine Silk Tie",
    description: "Handcrafted navy grenadine silk tie from Italy. Features a subtle texture and classic width. Perfect for business and formal occasions. Made from the finest silk with traditional craftsmanship.",
    brand: "Drake's",
    price_cents: 6500,
    shipping_cents: 599,
    images: [
      "https://placehold.co/600x750/1a2742/FFFFFF?text=Navy+Grenadine+Tie",
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Tie+Detail",
      "https://placehold.co/600x750/3a4752/FFFFFF?text=Tie+Back"
    ],
    condition: "Like New",
    category: "tie",
    color: "Navy",
    material: "Grenadine Silk",
    width_cm: 8,
    location: "New York, NY",
    isActive: true,
    isApproved: true,
    views: 45
  },
  {
    title: "Bar Stripe Repp Tie",
    description: "Classic bar stripe repp tie in navy and white. Traditional English design with diagonal stripes. Made from premium silk with hand-rolled edges. A timeless addition to any gentleman's wardrobe.",
    brand: "Brooks Brothers",
    price_cents: 3500,
    shipping_cents: 599,
    images: [
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Bar+Stripe+Tie",
      "https://placehold.co/600x750/3a4752/FFFFFF?text=Stripe+Detail"
    ],
    condition: "Good",
    category: "tie",
    color: "Navy",
    material: "Repp Silk",
    width_cm: 8,
    location: "Boston, MA",
    isActive: true,
    isApproved: true,
    views: 32
  },
  {
    title: "Burgundy Silk Tie",
    description: "Luxurious burgundy silk tie with subtle sheen. Perfect for evening events and special occasions. Made from premium Italian silk with meticulous attention to detail.",
    brand: "Tom Ford",
    price_cents: 8900,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/3a1722/FFFFFF?text=Burgundy+Silk+Tie",
      "https://placehold.co/600x750/4a2722/FFFFFF?text=Silk+Detail"
    ],
    condition: "New",
    category: "tie",
    color: "Burgundy",
    material: "Silk",
    width_cm: 8,
    location: "Los Angeles, CA",
    isActive: true,
    isApproved: true,
    views: 67
  },
  {
    title: "Classic Black Leather Belt",
    description: "Premium black leather belt with silver buckle. Handcrafted from Italian leather with traditional construction. Adjustable sizing with multiple holes for perfect fit.",
    brand: "Hermès",
    price_cents: 12500,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/0a0a0a/FFFFFF?text=Black+Leather+Belt",
      "https://placehold.co/600x750/1a1a1a/FFFFFF?text=Belt+Buckle"
    ],
    condition: "Like New",
    category: "belt",
    color: "Black",
    material: "Italian Leather",
    width_cm: 3.5,
    location: "Miami, FL",
    isActive: true,
    isApproved: true,
    views: 89
  },
  {
    title: "Silver Cufflinks Set",
    description: "Elegant silver cufflinks with geometric pattern. Made from sterling silver with polished finish. Perfect for formal occasions and business meetings. Comes in presentation box.",
    brand: "Tiffany & Co.",
    price_cents: 15000,
    shipping_cents: 699,
    images: [
      "https://placehold.co/600x750/4a5568/FFFFFF?text=Silver+Cufflinks",
      "https://placehold.co/600x750/5a6578/FFFFFF?text=Cufflink+Detail"
    ],
    condition: "New",
    category: "cufflinks",
    color: "Silver",
    material: "Sterling Silver",
    location: "New York, NY",
    isActive: true,
    isApproved: true,
    views: 56
  },
  {
    title: "Gold Cufflinks",
    description: "Luxurious gold cufflinks with subtle engraving. Made from 18k gold with satin finish. Classic design that never goes out of style. Ideal for special occasions.",
    brand: "Tom Ford",
    price_cents: 20000,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/FFD700/000000?text=Gold+Cufflinks",
      "https://placehold.co/600x750/FFE700/000000?text=Gold+Detail"
    ],
    condition: "Good",
    category: "cufflinks",
    color: "Gold",
    material: "18k Gold",
    location: "Los Angeles, CA",
    isActive: true,
    isApproved: true,
    views: 73
  },
  {
    title: "Red Pocket Square",
    description: "Vibrant red pocket square in pure silk. Hand-rolled edges with subtle sheen. Adds a perfect pop of color to any suit. Made in Italy with traditional techniques.",
    brand: "Brunello Cucinelli",
    price_cents: 5000,
    shipping_cents: 499,
    images: [
      "https://placehold.co/600x750/FF0000/FFFFFF?text=Red+Pocket+Square",
      "https://placehold.co/600x750/FF1000/FFFFFF?text=Silk+Texture"
    ],
    condition: "Like New",
    category: "pocket-square",
    color: "Red",
    material: "Pure Silk",
    location: "Boston, MA",
    isActive: true,
    isApproved: true,
    views: 41
  },
  {
    title: "Navy Paisley Pocket Square",
    description: "Sophisticated navy paisley pocket square in silk. Intricate pattern with hand-rolled edges. Perfect for adding elegance to any formal attire.",
    brand: "Drake's",
    price_cents: 4500,
    shipping_cents: 499,
    images: [
      "https://placehold.co/600x750/1a2742/FFFFFF?text=Navy+Paisley",
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Paisley+Pattern"
    ],
    condition: "New",
    category: "pocket-square",
    color: "Navy",
    material: "Silk",
    location: "Chicago, IL",
    isActive: true,
    isApproved: true,
    views: 38
  }
];

async function populateDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // First, let's get or create a seller user
    let seller = await User.findOne({ email: 'seller@saps.com' });
    if (!seller) {
      console.log('👤 Creating seller user...');
      seller = new User({
        clerkId: 'mock_seller_123',
        email: 'seller@saps.com',
        firstName: 'John',
        lastName: 'Smith',
        isSeller: true,
        rating: 4.8,
        totalSales: 156
      });
      await seller.save();
      console.log('✅ Seller user created');
    } else {
      console.log('✅ Found existing seller user');
    }

    // Clear existing mock items (optional - remove this if you want to keep existing items)
    console.log('🗑️ Clearing existing mock items...');
    await Item.deleteMany({ sellerId: seller._id });
    console.log('✅ Existing mock items cleared');

    // Add mock items
    console.log('📦 Adding mock items...');
    const itemsWithSeller = mockItems.map(item => ({
      ...item,
      sellerId: seller._id
    }));

    const createdItems = await Item.insertMany(itemsWithSeller);
    console.log(`✅ Successfully added ${createdItems.length} mock items to the database`);

    // Display summary
    console.log('\n📊 Database Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`📦 Items: ${await Item.countDocuments()}`);
    console.log(`✅ Approved Items: ${await Item.countDocuments({ isApproved: true })}`);
    console.log(`🟢 Active Items: ${await Item.countDocuments({ isActive: true })}`);

    console.log('\n🎉 Database population completed successfully!');
    console.log('🌐 Your SAPS marketplace should now show these items in the browse section.');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase();
