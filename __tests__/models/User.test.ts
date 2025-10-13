import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';

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
});

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = await User.create(userData);
      expect(user.clerkId).toBe(userData.clerkId);
      expect(user.email).toBe(userData.email);
      expect(user.isSeller).toBe(false);
      expect(user.stats).toBeDefined();
      expect(user.stats.totalListings).toBe(0);
    });

    it('should enforce unique clerkId', async () => {
      const userData = {
        clerkId: 'user_test123',
        email: 'test1@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      await User.create(userData);
      
      await expect(
        User.create({ ...userData, email: 'test2@example.com' })
      ).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData = {
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      await User.create(userData);
      
      await expect(
        User.create({ ...userData, clerkId: 'user_test456' })
      ).rejects.toThrow();
    });

    it('should lowercase email', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'TEST@EXAMPLE.COM',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should initialize stats with default values', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.stats.totalListings).toBe(0);
      expect(user.stats.totalSold).toBe(0);
      expect(user.stats.totalPurchased).toBe(0);
      expect(user.stats.totalRevenue).toBe(0);
      expect(user.stats.averageRating).toBe(0);
      expect(user.stats.totalReviews).toBe(0);
    });

    it('should validate bio max length', async () => {
      const longBio = 'A'.repeat(501);
      
      await expect(
        User.create({
          clerkId: 'user_test123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          bio: longBio,
        })
      ).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    it('canSell() should return true for active seller', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isSeller: true,
      });

      expect(user.canSell()).toBe(true);
    });

    it('canSell() should return false for suspended seller', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isSeller: true,
        isSuspended: true,
      });

      expect(user.canSell()).toBe(false);
    });

    it('canSell() should return false for non-seller', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isSeller: false,
      });

      expect(user.canSell()).toBe(false);
    });

    it('canBuy() should return true for active user', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.canBuy()).toBe(true);
    });

    it('canBuy() should return false for suspended user', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isSuspended: true,
      });

      expect(user.canBuy()).toBe(false);
    });

    it('getDefaultShippingAddress() should return first address if no default set', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        addresses: [
          {
            fullName: 'John Doe',
            street1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
          },
          {
            fullName: 'John Doe',
            street1: '456 Second St',
            city: 'Boston',
            state: 'MA',
            postalCode: '02101',
            country: 'US',
          },
        ],
      });

      const defaultAddress = user.getDefaultShippingAddress();
      expect(defaultAddress).toBeDefined();
      expect(defaultAddress?.street1).toBe('123 Main St');
    });
  });

  describe('Cart and Watchlist', () => {
    it('should initialize with empty cart and watchlist', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.cart).toEqual([]);
      expect(user.watchlist).toEqual([]);
    });

    it('should allow adding items to cart', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const itemId = new mongoose.Types.ObjectId();
      user.cart.push({
        itemId,
        quantity: 1,
        addedAt: new Date(),
      });
      await user.save();

      expect(user.cart).toHaveLength(1);
      expect(user.cart[0].itemId.toString()).toBe(itemId.toString());
      expect(user.cart[0].quantity).toBe(1);
    });

    it('should allow adding items to watchlist', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const itemId = new mongoose.Types.ObjectId();
      user.watchlist.push(itemId);
      await user.save();

      expect(user.watchlist).toHaveLength(1);
      expect(user.watchlist[0].toString()).toBe(itemId.toString());
    });
  });

  describe('Virtual Properties', () => {
    it('should have fullName virtual property', async () => {
      const user = await User.create({
        clerkId: 'user_test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.fullName).toBe('John Doe');
    });
  });
});

