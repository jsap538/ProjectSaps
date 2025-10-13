import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Item from '@/models/Item';
import User from '@/models/User';

let mongoServer: MongoMemoryServer;
let testSeller: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test seller
  testSeller = await User.create({
    clerkId: 'seller_test123',
    email: 'seller@example.com',
    firstName: 'Seller',
    lastName: 'User',
    isSeller: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Item.deleteMany({});
});

describe('Item Model', () => {
  const validItemData = {
    title: 'Navy Silk Tie',
    description: 'Premium silk tie in excellent condition',
    brand: "Drake's",
    price_cents: 5000,
    shipping_cents: 599,
    images: [
      { url: 'https://example.com/image1.jpg', order: 0, isMain: true },
    ],
    condition: 'Like New',
    category: 'tie',
    color: 'Navy',
    location: 'New York, NY',
    sellerId: testSeller._id,
  };

  describe('Schema Validation', () => {
    it('should create a valid item', async () => {
      const item = await Item.create(validItemData);
      
      expect(item.title).toBe(validItemData.title);
      expect(item.price_cents).toBe(validItemData.price_cents);
      expect(item.isActive).toBe(true);
      expect(item.isApproved).toBe(false);
      expect(item.isSold).toBe(false);
      expect(item.stats).toBeDefined();
      expect(item.stats.views).toBe(0);
    });

    it('should require at least 1 image', async () => {
      await expect(
        Item.create({ ...validItemData, images: [] })
      ).rejects.toThrow();
    });

    it('should reject more than 10 images', async () => {
      const manyImages = Array(11).fill({ 
        url: 'https://example.com/image.jpg', 
        order: 0, 
        isMain: false 
      });
      
      await expect(
        Item.create({ ...validItemData, images: manyImages })
      ).rejects.toThrow();
    });

    it('should enforce minimum price of $1.00', async () => {
      await expect(
        Item.create({ ...validItemData, price_cents: 99 })
      ).rejects.toThrow();
    });

    it('should accept minimum price of $1.00', async () => {
      const item = await Item.create({ ...validItemData, price_cents: 100 });
      expect(item.price_cents).toBe(100);
    });

    it('should initialize stats with default values', async () => {
      const item = await Item.create(validItemData);
      
      expect(item.stats.views).toBe(0);
      expect(item.stats.favorites).toBe(0);
      expect(item.stats.timesShared).toBe(0);
      expect(item.stats.clicks).toBe(0);
    });

    it('should validate condition enum', async () => {
      await expect(
        Item.create({ ...validItemData, condition: 'Excellent' as any })
      ).rejects.toThrow();
    });

    it('should validate category enum', async () => {
      await expect(
        Item.create({ ...validItemData, category: 'invalid' as any })
      ).rejects.toThrow();
    });
  });

  describe('Item Methods', () => {
    it('isAvailable() should return true for active, approved, unsold items', async () => {
      const item = await Item.create({
        ...validItemData,
        isActive: true,
        isApproved: true,
        isSold: false,
      });

      expect(item.isAvailable()).toBe(true);
    });

    it('isAvailable() should return false for inactive items', async () => {
      const item = await Item.create({
        ...validItemData,
        isActive: false,
        isApproved: true,
        isSold: false,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('isAvailable() should return false for unapproved items', async () => {
      const item = await Item.create({
        ...validItemData,
        isActive: true,
        isApproved: false,
        isSold: false,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('isAvailable() should return false for sold items', async () => {
      const item = await Item.create({
        ...validItemData,
        isActive: true,
        isApproved: true,
        isSold: true,
      });

      expect(item.isAvailable()).toBe(false);
    });

    it('getMainImageUrl() should return main image URL', async () => {
      const item = await Item.create(validItemData);
      expect(item.getMainImageUrl()).toBe('https://example.com/image1.jpg');
    });

    it('getMainImageUrl() should return first image if no main image set', async () => {
      const item = await Item.create({
        ...validItemData,
        images: [
          { url: 'https://example.com/first.jpg', order: 0, isMain: false },
          { url: 'https://example.com/second.jpg', order: 1, isMain: false },
        ],
      });

      expect(item.getMainImageUrl()).toBe('https://example.com/first.jpg');
    });

    it('getTotalPrice() should return item price plus shipping', async () => {
      const item = await Item.create(validItemData);
      expect(item.getTotalPrice()).toBe(5599); // 5000 + 599
    });

    it('isOfferAcceptable() should return false if offers not accepted', async () => {
      const item = await Item.create({
        ...validItemData,
        acceptsOffers: false,
      });

      expect(item.isOfferAcceptable(4000)).toBe(false);
    });

    it('isOfferAcceptable() should return true for valid offer', async () => {
      const item = await Item.create({
        ...validItemData,
        acceptsOffers: true,
        lowestOfferPrice_cents: 4000,
      });

      expect(item.isOfferAcceptable(4500)).toBe(true);
    });

    it('isOfferAcceptable() should return false for offer below minimum', async () => {
      const item = await Item.create({
        ...validItemData,
        acceptsOffers: true,
        lowestOfferPrice_cents: 4000,
      });

      expect(item.isOfferAcceptable(3500)).toBe(false);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test items
      await Item.create([
        { ...validItemData, title: 'Item 1', isActive: true, isApproved: true, isSold: false },
        { ...validItemData, title: 'Item 2', isActive: true, isApproved: true, isSold: false },
        { ...validItemData, title: 'Item 3', isActive: true, isApproved: false, isSold: false },
        { ...validItemData, title: 'Item 4', isActive: false, isApproved: true, isSold: false },
        { ...validItemData, title: 'Item 5', isActive: true, isApproved: true, isSold: true },
      ]);
    });

    it('findAvailable() should return only active, approved, unsold items', async () => {
      const items = await Item.findAvailable();
      expect(items).toHaveLength(2);
      items.forEach(item => {
        expect(item.isActive).toBe(true);
        expect(item.isApproved).toBe(true);
        expect(item.isSold).toBe(false);
      });
    });

    it('findBySeller() should return all items from seller', async () => {
      const items = await Item.findBySeller(testSeller._id);
      expect(items).toHaveLength(5);
    });

    it('findAvailable() should support additional filters', async () => {
      const items = await Item.findAvailable({ category: 'tie' });
      expect(items).toHaveLength(2);
    });
  });

  describe('Dimensions', () => {
    it('should accept optional dimensions', async () => {
      const item = await Item.create({
        ...validItemData,
        dimensions: {
          width_cm: 8.5,
          length_cm: 145,
          weight_g: 50,
        },
      });

      expect(item.dimensions.width_cm).toBe(8.5);
      expect(item.dimensions.length_cm).toBe(145);
      expect(item.dimensions.weight_g).toBe(50);
    });

    it('should reject negative dimensions', async () => {
      await expect(
        Item.create({
          ...validItemData,
          dimensions: { width_cm: -5 },
        })
      ).rejects.toThrow();
    });
  });

  describe('Featured Items', () => {
    it('should allow setting featured status with expiration', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const item = await Item.create({
        ...validItemData,
        isFeatured: true,
        featuredUntil: futureDate,
      });

      expect(item.isFeatured).toBe(true);
      expect(item.featuredUntil).toEqual(futureDate);
    });
  });
});

