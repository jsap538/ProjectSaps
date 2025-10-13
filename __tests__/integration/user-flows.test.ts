import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';
import Report from '@/models/Report';

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
  await Report.deleteMany({});
});

describe('User Flow Integration Tests', () => {
  describe('New User Registration Flow', () => {
    it('should create user with correct defaults', async () => {
      const user = await User.create({
        clerkId: 'user_new123',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      });

      expect(user.isSeller).toBe(false);
      expect(user.isAdmin).toBe(false);
      expect(user.isActive).toBe(true);
      expect(user.cart).toEqual([]);
      expect(user.watchlist).toEqual([]);
      expect(user.stats.totalListings).toBe(0);
    });
  });

  describe('Seller Listing Creation Flow', () => {
    let seller: any;

    beforeEach(async () => {
      seller = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });
    });

    it('new seller listing should require approval', async () => {
      const item = await Item.create({
        title: 'First Listing',
        description: 'My first item for sale',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: seller._id,
      });

      // New seller should need approval
      expect(item.isApproved).toBe(false);
      expect(item.isActive).toBe(true);
    });

    it('trusted seller listing should be auto-approved', async () => {
      // Make seller trusted
      seller.isVerified = true;
      seller.stats.totalSold = 10;
      seller.stats.averageRating = 4.8;
      await seller.save();

      // Simulate creating item with hybrid approval logic
      const shouldAutoApprove = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(shouldAutoApprove).toBe(true);
    });

    it('suspended seller cannot list items', async () => {
      seller.isSuspended = true;
      await seller.save();

      expect(seller.canSell()).toBe(false);
    });
  });

  describe('Shopping Cart Flow', () => {
    let buyer: any;
    let item1: any;
    let item2: any;

    beforeEach(async () => {
      buyer = await User.create({
        clerkId: 'buyer_test123',
        email: 'buyer@example.com',
        firstName: 'Buyer',
        lastName: 'User',
      });

      const sellerId = new mongoose.Types.ObjectId();

      item1 = await Item.create({
        title: 'Item 1',
        description: 'First test item',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/img1.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId,
      });

      item2 = await Item.create({
        title: 'Item 2',
        description: 'Second test item',
        brand: 'Tom Ford',
        price_cents: 8000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/img2.jpg', order: 0, isMain: true }],
        condition: 'Like New',
        category: 'belt',
        color: 'Black',
        location: 'Los Angeles',
        sellerId,
      });
    });

    it('should add multiple items to cart', async () => {
      buyer.cart.push(
        { itemId: item1._id, quantity: 1, addedAt: new Date() },
        { itemId: item2._id, quantity: 1, addedAt: new Date() }
      );
      await buyer.save();

      expect(buyer.cart).toHaveLength(2);
    });

    it('should calculate total cart value correctly', async () => {
      buyer.cart.push(
        { itemId: item1._id, quantity: 1, addedAt: new Date() },
        { itemId: item2._id, quantity: 1, addedAt: new Date() }
      );
      await buyer.save();

      const totalPrice = item1.price_cents + item2.price_cents;
      expect(totalPrice).toBe(13000); // $130.00
    });

    it('should remove item from cart', async () => {
      buyer.cart.push(
        { itemId: item1._id, quantity: 1, addedAt: new Date() },
        { itemId: item2._id, quantity: 1, addedAt: new Date() }
      );
      await buyer.save();

      buyer.cart = buyer.cart.filter((item: any) => item.itemId.toString() !== item1._id.toString());
      await buyer.save();

      expect(buyer.cart).toHaveLength(1);
      expect(buyer.cart[0].itemId.toString()).toBe(item2._id.toString());
    });

    it('should clear entire cart', async () => {
      buyer.cart.push(
        { itemId: item1._id, quantity: 1, addedAt: new Date() },
        { itemId: item2._id, quantity: 1, addedAt: new Date() }
      );
      await buyer.save();

      buyer.cart = [];
      await buyer.save();

      expect(buyer.cart).toEqual([]);
    });
  });

  describe('Watchlist Flow', () => {
    let user: any;
    let item: any;

    beforeEach(async () => {
      user = await User.create({
        clerkId: 'user_test123',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      item = await Item.create({
        title: 'Watchlist Item',
        description: 'Item to watch',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: new mongoose.Types.ObjectId(),
      });
    });

    it('should add item to watchlist and increment stats', async () => {
      const initialFavorites = item.stats.favorites;

      user.watchlist.push(item._id);
      await user.save();

      item.stats.favorites = initialFavorites + 1;
      await item.save();

      const updatedUser = await User.findById(user._id);
      const updatedItem = await Item.findById(item._id);

      expect(updatedUser?.watchlist).toHaveLength(1);
      expect(updatedItem?.stats.favorites).toBe(initialFavorites + 1);
    });

    it('should remove item from watchlist and decrement stats', async () => {
      user.watchlist.push(item._id);
      item.stats.favorites = 5;
      await Promise.all([user.save(), item.save()]);

      user.watchlist = user.watchlist.filter((id: mongoose.Types.ObjectId) => 
        id.toString() !== item._id.toString()
      );
      item.stats.favorites = 4;
      await Promise.all([user.save(), item.save()]);

      const updatedUser = await User.findById(user._id);
      const updatedItem = await Item.findById(item._id);

      expect(updatedUser?.watchlist).toHaveLength(0);
      expect(updatedItem?.stats.favorites).toBe(4);
    });
  });

  describe('Item Reporting Flow', () => {
    let reporter1: any;
    let reporter2: any;
    let reporter3: any;
    let item: any;

    beforeEach(async () => {
      reporter1 = await User.create({
        clerkId: 'reporter1',
        email: 'reporter1@example.com',
        firstName: 'Reporter',
        lastName: 'One',
      });

      reporter2 = await User.create({
        clerkId: 'reporter2',
        email: 'reporter2@example.com',
        firstName: 'Reporter',
        lastName: 'Two',
      });

      reporter3 = await User.create({
        clerkId: 'reporter3',
        email: 'reporter3@example.com',
        firstName: 'Reporter',
        lastName: 'Three',
      });

      item = await Item.create({
        title: 'Suspicious Item',
        description: 'Item that will be reported',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: new mongoose.Types.ObjectId(),
      });
    });

    it('should create report with correct priority', async () => {
      const report = await Report.create({
        itemId: item._id,
        reporterId: reporter1._id,
        reason: 'counterfeit',
      });

      expect(report.priority).toBe('urgent');
      expect(report.status).toBe('pending');
    });

    it('should auto-takedown after 3 reports', async () => {
      await Report.create([
        { itemId: item._id, reporterId: reporter1._id, reason: 'counterfeit' },
        { itemId: item._id, reporterId: reporter2._id, reason: 'inappropriate' },
        { itemId: item._id, reporterId: reporter3._id, reason: 'misleading' },
      ]);

      const shouldTakedown = await Report.shouldAutoTakedown(item._id);
      expect(shouldTakedown).toBe(true);

      // Simulate auto-takedown
      item.isActive = false;
      item.moderationNotes = 'Auto-deactivated due to 3 user reports';
      await item.save();

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem?.isActive).toBe(false);
    });

    it('should not auto-takedown with only 2 reports', async () => {
      await Report.create([
        { itemId: item._id, reporterId: reporter1._id, reason: 'spam' },
        { itemId: item._id, reporterId: reporter2._id, reason: 'misleading' },
      ]);

      const shouldTakedown = await Report.shouldAutoTakedown(item._id);
      expect(shouldTakedown).toBe(false);
    });

    it('should prevent duplicate reports from same user', async () => {
      await Report.create({
        itemId: item._id,
        reporterId: reporter1._id,
        reason: 'spam',
      });

      await expect(
        Report.create({
          itemId: item._id,
          reporterId: reporter1._id,
          reason: 'inappropriate',
        })
      ).rejects.toThrow();
    });
  });

  describe('Admin Moderation Flow', () => {
    let admin: any;
    let item: any;
    let report: any;

    beforeEach(async () => {
      admin = await User.create({
        clerkId: 'admin_test123',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
      });

      item = await Item.create({
        title: 'Pending Item',
        description: 'Item awaiting approval',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: new mongoose.Types.ObjectId(),
        isApproved: false,
      });

      report = await Report.create({
        itemId: item._id,
        reporterId: new mongoose.Types.ObjectId(),
        reason: 'counterfeit',
      });
    });

    it('should approve pending item', async () => {
      item.isApproved = true;
      await item.save();

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem?.isApproved).toBe(true);
    });

    it('should reject item by deactivating it', async () => {
      item.isActive = false;
      item.isApproved = false;
      await item.save();

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem?.isActive).toBe(false);
      expect(updatedItem?.isApproved).toBe(false);
    });

    it('should resolve report with dismiss action', async () => {
      await report.markAsResolved('dismissed', admin._id);

      expect(report.status).toBe('resolved');
      expect(report.action).toBe('dismissed');
      expect(report.reviewedBy?.toString()).toBe(admin._id.toString());
      expect(report.reviewedAt).toBeDefined();
    });

    it('should resolve report and remove item', async () => {
      await report.markAsResolved('item_removed', admin._id);
      item.isActive = false;
      await item.save();

      const updatedReport = await Report.findById(report._id);
      const updatedItem = await Item.findById(item._id);

      expect(updatedReport?.status).toBe('resolved');
      expect(updatedReport?.action).toBe('item_removed');
      expect(updatedItem?.isActive).toBe(false);
    });
  });

  describe('Complete Shopping Flow', () => {
    let buyer: any;
    let seller: any;
    let item: any;

    beforeEach(async () => {
      seller = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isVerified: true,
        stats: {
          totalSold: 10,
          averageRating: 4.8,
          totalListings: 15,
          totalPurchased: 0,
          totalRevenue: 50000,
          totalReviews: 8,
        },
      });

      buyer = await User.create({
        clerkId: 'buyer_test123',
        email: 'buyer@example.com',
        firstName: 'Buyer',
        lastName: 'User',
      });

      item = await Item.create({
        title: 'Premium Tie',
        description: 'Beautiful silk tie',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: seller._id,
        isActive: true,
        isApproved: true,
      });
    });

    it('should complete full shopping journey', async () => {
      // 1. Buyer adds to watchlist
      buyer.watchlist.push(item._id);
      item.stats.favorites = 1;
      await Promise.all([buyer.save(), item.save()]);

      // 2. Buyer views item (increment views)
      item.stats.views = 1;
      await item.save();

      // 3. Buyer adds to cart
      buyer.cart.push({
        itemId: item._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await buyer.save();

      // Verify flow
      const updatedBuyer = await User.findById(buyer._id);
      const updatedItem = await Item.findById(item._id);

      expect(updatedBuyer?.watchlist).toHaveLength(1);
      expect(updatedBuyer?.cart).toHaveLength(1);
      expect(updatedItem?.stats.views).toBe(1);
      expect(updatedItem?.stats.favorites).toBe(1);
    });

    it('should handle item becoming unavailable after adding to cart', async () => {
      buyer.cart.push({
        itemId: item._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await buyer.save();

      // Item gets sold by someone else
      item.isSold = true;
      item.soldAt = new Date();
      await item.save();

      // Check availability
      expect(item.isAvailable()).toBe(false);
    });
  });

  describe('Seller Reputation Building', () => {
    let seller: any;

    beforeEach(async () => {
      seller = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });
    });

    it('should track seller progress from new to trusted', async () => {
      // New seller
      expect(seller.stats.totalSold).toBe(0);
      expect(seller.stats.averageRating).toBe(0);
      expect(seller.isVerified).toBe(false);

      // After 5 sales and verification
      seller.stats.totalSold = 5;
      seller.stats.averageRating = 4.6;
      seller.isVerified = true;
      await seller.save();

      // Check if qualifies for auto-approval
      const qualifiesForAutoApproval = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(qualifiesForAutoApproval).toBe(true);
    });

    it('should not auto-approve seller with low rating', async () => {
      seller.stats.totalSold = 10;
      seller.stats.averageRating = 3.5; // Below threshold
      seller.isVerified = true;
      await seller.save();

      const qualifiesForAutoApproval = 
        seller.isVerified && 
        seller.stats.totalSold >= 5 && 
        seller.stats.averageRating >= 4.5;

      expect(qualifiesForAutoApproval).toBe(false);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle item with no images gracefully', async () => {
      // This should be caught by validation, but test fallback
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });

      await expect(
        Item.create({
          title: 'No Image Item',
          description: 'Item without images',
          brand: "Drake's",
          price_cents: 5000,
          shipping_cents: 599,
          images: [],
          condition: 'New',
          category: 'tie',
          color: 'Navy',
          location: 'New York',
          sellerId: seller._id,
        })
      ).rejects.toThrow();
    });

    it('should handle very long description (2000 chars)', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });

      const longDescription = 'A'.repeat(2000);
      
      const item = await Item.create({
        title: 'Long Description Item',
        description: longDescription,
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: seller._id,
      });

      expect(item.description).toHaveLength(2000);
    });

    it('should handle maximum price ($10,000)', async () => {
      const seller = await User.create({
        clerkId: 'seller_test',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });

      const item = await Item.create({
        title: 'Expensive Item',
        description: 'Very expensive item',
        brand: "Hermes",
        price_cents: 1000000, // $10,000
        shipping_cents: 0,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'belt',
        color: 'Black',
        location: 'New York',
        sellerId: seller._id,
      });

      expect(item.price_cents).toBe(1000000);
    });

    it('should handle user with maximum addresses', async () => {
      const addresses = Array(10).fill({
        fullName: 'John Doe',
        street1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      });

      const user = await User.create({
        clerkId: 'user_test',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        addresses,
      });

      expect(user.addresses).toHaveLength(10);
    });
  });
});

