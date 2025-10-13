import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';
import { isValidObjectId } from '@/lib/security';

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

describe('Access Control and Security', () => {
  describe('User Permissions', () => {
    it('should not allow non-seller to list items', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isSeller: false,
      });

      expect(user.canSell()).toBe(false);
    });

    it('should allow verified seller to list items', async () => {
      const user = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isActive: true,
      });

      expect(user.canSell()).toBe(true);
    });

    it('should not allow suspended seller to list items', async () => {
      const user = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
        isSuspended: true,
      });

      expect(user.canSell()).toBe(false);
    });

    it('should not allow suspended user to buy items', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isSuspended: true,
      });

      expect(user.canBuy()).toBe(false);
    });

    it('should not allow inactive user to buy items', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: false,
      });

      expect(user.canBuy()).toBe(false);
    });
  });

  describe('Item Ownership', () => {
    let seller: any;
    let otherUser: any;
    let item: any;

    beforeEach(async () => {
      seller = await User.create({
        clerkId: 'seller_test123',
        email: 'seller@example.com',
        firstName: 'Seller',
        lastName: 'User',
        isSeller: true,
      });

      otherUser = await User.create({
        clerkId: 'other_user123',
        email: 'other@example.com',
        firstName: 'Other',
        lastName: 'User',
      });

      item = await Item.create({
        title: 'Test Item',
        description: 'Item for ownership testing',
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
    });

    it('should verify seller owns their item', () => {
      expect(item.sellerId.toString()).toBe(seller._id.toString());
    });

    it('should detect when user does not own item', () => {
      expect(item.sellerId.equals(otherUser._id)).toBe(false);
    });
  });

  describe('Admin Privileges', () => {
    it('should identify admin users', async () => {
      const admin = await User.create({
        clerkId: 'admin_test123',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
      });

      expect(admin.isAdmin).toBe(true);
    });

    it('should identify non-admin users', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(user.isAdmin).toBe(false);
    });
  });

  describe('ObjectId Validation', () => {
    it('should validate correct ObjectId format', () => {
      const validId = new mongoose.Types.ObjectId().toString();
      expect(isValidObjectId(validId)).toBe(true);
    });

    it('should reject invalid ObjectId format', () => {
      expect(isValidObjectId('invalid-id')).toBe(false);
      expect(isValidObjectId('123')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
    });

    it('should reject ObjectId that is too short', () => {
      expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // 23 chars
    });

    it('should reject ObjectId that is too long', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011a')).toBe(false); // 25 chars
    });

    it('should reject ObjectId with invalid characters', () => {
      expect(isValidObjectId('507f1f77bcf86cd79943901z')).toBe(false); // 'z' is invalid
    });
  });

  describe('Item Availability Checks', () => {
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

    it('should mark item as unavailable when inactive', async () => {
      const item = await Item.create({
        title: 'Test Item',
        description: 'Test description',
        brand: "Drake's",
        price_cents: 5000,
        shipping_cents: 599,
        images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
        condition: 'New',
        category: 'tie',
        color: 'Navy',
        location: 'New York',
        sellerId: seller._id,
        isActive: false,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('should mark item as unavailable when not approved', async () => {
      const item = await Item.create({
        title: 'Test Item',
        description: 'Test description',
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
        isApproved: false,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('should mark item as unavailable when sold', async () => {
      const item = await Item.create({
        title: 'Test Item',
        description: 'Test description',
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
        isSold: true,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('should mark item as available only when active, approved, and not sold', async () => {
      const item = await Item.create({
        title: 'Test Item',
        description: 'Test description',
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
        isSold: false,
      });

      expect(item.isAvailable()).toBe(true);
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize email to lowercase', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'TEST@EXAMPLE.COM',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should trim whitespace from fields', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: '  test@example.com  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
      });

      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
    });

    it('should handle special characters in bio', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        bio: 'I love selling premium accessories! Check out my collection.',
      });

      expect(user.bio).toBeDefined();
    });
  });
});

