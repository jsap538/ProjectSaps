import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';
import { corsHeaders } from '@/lib/security';

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
    title: "Forest Green Knit Tie",
    description: "Hand-knitted forest green tie with rich texture. Casual yet sophisticated, perfect for smart-casual occasions. Made from premium wool blend with traditional knitting techniques.",
    brand: "Brunello Cucinelli",
    price_cents: 7200,
    shipping_cents: 699,
    images: [
      "https://placehold.co/600x750/1a3725/FFFFFF?text=Green+Knit+Tie",
      "https://placehold.co/600x750/2a4725/FFFFFF?text=Knit+Texture"
    ],
    condition: "Like New",
    category: "tie",
    color: "Forest Green",
    material: "Wool Blend",
    width_cm: 7,
    location: "Chicago, IL",
    isActive: true,
    isApproved: true,
    views: 28
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
    title: "Brown Crocodile Belt",
    description: "Exquisite brown crocodile leather belt with gold buckle. Made from genuine crocodile leather with hand-polished finish. A statement piece for the discerning gentleman.",
    brand: "Bottega Veneta",
    price_cents: 18900,
    shipping_cents: 999,
    images: [
      "https://placehold.co/600x750/8B4513/FFFFFF?text=Crocodile+Belt",
      "https://placehold.co/600x750/9B5513/FFFFFF?text=Crocodile+Texture"
    ],
    condition: "New",
    category: "belt",
    color: "Brown",
    material: "Crocodile Leather",
    width_cm: 3.5,
    location: "San Francisco, CA",
    isActive: true,
    isApproved: true,
    views: 124
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
  },
  {
    title: "Charcoal Wool Tie",
    description: "Classic charcoal wool tie perfect for winter months. Soft texture with subtle pattern. Made from premium wool with traditional construction. Versatile for business and casual wear.",
    brand: "Ralph Lauren",
    price_cents: 4200,
    shipping_cents: 599,
    images: [
      "https://placehold.co/600x750/36454F/FFFFFF?text=Charcoal+Wool+Tie",
      "https://placehold.co/600x750/46554F/FFFFFF?text=Wool+Texture"
    ],
    condition: "Good",
    category: "tie",
    color: "Charcoal",
    material: "Wool",
    width_cm: 8,
    location: "Seattle, WA",
    isActive: true,
    isApproved: true,
    views: 29
  },
  {
    title: "Tan Suede Belt",
    description: "Stylish tan suede belt with brass buckle. Casual elegance with soft texture. Perfect for smart-casual occasions and weekend wear. Made from premium Italian suede.",
    brand: "Gucci",
    price_cents: 9800,
    shipping_cents: 699,
    images: [
      "https://placehold.co/600x750/D2B48C/FFFFFF?text=Tan+Suede+Belt",
      "https://placehold.co/600x750/E2C48C/FFFFFF?text=Suede+Texture"
    ],
    condition: "Like New",
    category: "belt",
    color: "Tan",
    material: "Italian Suede",
    width_cm: 3.5,
    location: "Austin, TX",
    isActive: true,
    isApproved: true,
    views: 52
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    await connectDB();
    
    // Check if user is admin (or allow any authenticated user for now)
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    // Create or get a mock seller user
    let mockSeller = await User.findOne({ email: 'mock-seller@saps.com' });
    if (!mockSeller) {
      mockSeller = new User({
        clerkId: 'mock_seller_' + Date.now(),
        email: 'mock-seller@saps.com',
        firstName: 'John',
        lastName: 'Smith',
        isSeller: true,
        rating: 4.8,
        totalSales: 156
      });
      await mockSeller.save();
      console.log('✅ Created mock seller user');
    }

    // Clear existing mock items from this seller
    await Item.deleteMany({ sellerId: mockSeller._id });
    console.log('✅ Cleared existing mock items');

    // Add new mock items
    const itemsWithSeller = mockItems.map(item => ({
      ...item,
      sellerId: mockSeller._id
    }));

    const createdItems = await Item.insertMany(itemsWithSeller);
    console.log(`✅ Added ${createdItems.length} mock items`);

    // Get summary
    const totalItems = await Item.countDocuments();
    const approvedItems = await Item.countDocuments({ isApproved: true });
    const activeItems = await Item.countDocuments({ isActive: true });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${createdItems.length} mock items to the database`,
      summary: {
        totalItems,
        approvedItems,
        activeItems,
        newItems: createdItems.length
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error populating mock items:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to populate mock items',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
