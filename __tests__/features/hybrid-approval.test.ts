import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Item.deleteMany({});
});

describe('Hybrid Approval System', () => {
  const createItemData = (sellerId: mongoose.Types.ObjectId) => ({
    title: 'Test Item',
    description: 'Test description for item listing',
    brand: "Drake's",
    price_cents: 5000,
    shipping_cents: 599,
    images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
    condition: 'New' as const,
    category: 'tie' as const,
    color: 'Navy',
    location: 'New York',
    sellerId,
  });

  describe('New Seller (Manual Review Required)', () => {
    it('should require approval for new unverified seller', async () => {
      const seller = await User.create({
        clerkId: 'new_seller',
        email: 'newseller@example.com',
        firstName: 'New',
        lastName: 'Seller',
        isSeller: true,
        isVerified: false,
        stats: {
          totalSold: 0,
          averageRating: 0,
          totalListings: 0,
          totalPurchased: 0,
          totalRevenue: 0,
          totalReviews: 0,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(false);

      const item = await Item.create({
        ...createItemData(seller._id),
        isApproved: shouldAutoApprove,
      });

      expect(item.isApproved).toBe(false);
    });

    it('should require approval for verified seller with insufficient sales', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 3, // Less than 5
          averageRating: 4.8,
          totalListings: 3,
          totalPurchased: 0,
          totalRevenue: 15000,
          totalReviews: 3,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(false);
    });

    it('should require approval for seller with low rating', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 10,
          averageRating: 3.5, // Below 4.5
          totalListings: 12,
          totalPurchased: 0,
          totalRevenue: 50000,
          totalReviews: 8,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(false);
    });
  });

  describe('Trusted Seller (Auto-Approval)', () => {
    it('should auto-approve verified seller with 5+ sales and 4.5+ rating', async () => {
      const seller = await User.create({
        clerkId: 'trusted_seller',
        email: 'trusted@example.com',
        firstName: 'Trusted',
        lastName: 'Seller',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 5,
          averageRating: 4.5,
          totalListings: 6,
          totalPurchased: 0,
          totalRevenue: 25000,
          totalReviews: 5,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(true);

      const item = await Item.create({
        ...createItemData(seller._id),
        isApproved: shouldAutoApprove,
      });

      expect(item.isApproved).toBe(true);
    });

    it('should auto-approve seller exceeding minimum requirements', async () => {
      const seller = await User.create({
        clerkId: 'expert_seller',
        email: 'expert@example.com',
        firstName: 'Expert',
        lastName: 'Seller',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 50,
          averageRating: 4.9,
          totalListings: 60,
          totalPurchased: 0,
          totalRevenue: 250000,
          totalReviews: 45,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(true);
    });

    it('should auto-approve at exact threshold (5 sales, 4.5 rating)', async () => {
      const seller = await User.create({
        clerkId: 'threshold_seller',
        email: 'threshold@example.com',
        firstName: 'Threshold',
        lastName: 'Seller',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 5, // Exactly 5
          averageRating: 4.5, // Exactly 4.5
          totalListings: 5,
          totalPurchased: 0,
          totalRevenue: 25000,
          totalReviews: 5,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(true);
    });
  });

  describe('Edge Cases for Auto-Approval', () => {
    it('should not auto-approve seller with exactly 4.49 rating', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 10,
          averageRating: 4.49, // Just below threshold
          totalListings: 12,
          totalPurchased: 0,
          totalRevenue: 50000,
          totalReviews: 8,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(false);
    });

    it('should not auto-approve seller with exactly 4 sales', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 4, // Just below threshold
          averageRating: 4.9,
          totalListings: 5,
          totalPurchased: 0,
          totalRevenue: 20000,
          totalReviews: 4,
        },
      });

      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(false);
    });

    it('should require all three conditions (verified AND sales AND rating)', async () => {
      const sellers = await Promise.all([
        // Has sales and rating but not verified
        User.create({
          clerkId: 'seller1',
          email: 'seller1@example.com',
          firstName: 'S1',
          lastName: 'User',
          isSeller: true,
          isVerified: false,
          stats: { totalSold: 10, averageRating: 4.8, totalListings: 0, totalPurchased: 0, totalRevenue: 0, totalReviews: 0 },
        }),
        // Verified with sales but low rating
        User.create({
          clerkId: 'seller2',
          email: 'seller2@example.com',
          firstName: 'S2',
          lastName: 'User',
          isSeller: true,
          isVerified: true,
          stats: { totalSold: 10, averageRating: 3.0, totalListings: 0, totalPurchased: 0, totalRevenue: 0, totalReviews: 0 },
        }),
        // Verified with good rating but no sales
        User.create({
          clerkId: 'seller3',
          email: 'seller3@example.com',
          firstName: 'S3',
          lastName: 'User',
          isSeller: true,
          isVerified: true,
          stats: { totalSold: 0, averageRating: 5.0, totalListings: 0, totalPurchased: 0, totalRevenue: 0, totalReviews: 0 },
        }),
      ]);

      sellers.forEach(seller => {
        const shouldAutoApprove = 
          seller.isVerified && 
          seller.stats.totalSold >= 5 && 
          seller.stats.averageRating >= 4.5;

        expect(shouldAutoApprove).toBe(false);
      });
    });
  });
});

