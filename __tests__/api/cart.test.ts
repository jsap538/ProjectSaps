import { POST, DELETE, GET } from '@/app/api/cart/route';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';

let mongoServer: MongoMemoryServer;
let testUser: any;
let testItem: any;

// Mock auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => Promise.resolve({ userId: 'test-clerk-id' })),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Create test user and item
  testUser = await User.create({
    clerkId: 'test-clerk-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  });

  testItem = await Item.create({
    title: 'Test Item',
    description: 'Test description for item',
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

afterEach(async () => {
  await User.deleteMany({});
  await Item.deleteMany({});
});

describe('Cart API', () => {
  describe('GET /api/cart', () => {
    it('should return empty cart for user with no items', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });

    it('should return cart items with full details', async () => {
      // Add item to cart
      testUser.cart.push({
        itemId: testItem._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await testUser.save();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].item.title).toBe('Test Item');
      expect(data.data[0].quantity).toBe(1);
    });

    it('should return 401 if not authenticated', async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValueOnce({ userId: null });

      const response = await GET();
      expect(response.status).toBe(401);
    });

    it('should handle deleted items gracefully', async () => {
      // Add item to cart
      testUser.cart.push({
        itemId: testItem._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await testUser.save();

      // Delete the item
      await Item.findByIdAndDelete(testItem._id);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data[0].item).toBeNull();
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          quantity: 1,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('added');
    });

    it('should reject adding item already in cart', async () => {
      // Add item to cart first
      testUser.cart.push({
        itemId: testItem._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await testUser.save();

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          quantity: 1,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('already in your cart');
    });

    it('should reject adding non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          itemId: fakeId.toString(),
          quantity: 1,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Item not found');
    });

    it('should require itemId', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ quantity: 1 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Item ID is required');
    });
  });

  describe('DELETE /api/cart', () => {
    it('should remove item from cart successfully', async () => {
      // Add item to cart first
      testUser.cart.push({
        itemId: testItem._id,
        quantity: 1,
        addedAt: new Date(),
      });
      await testUser.save();

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('removed');
    });

    it('should handle removing item not in cart gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should require itemId', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        body: JSON.stringify({}),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Item ID is required');
    });
  });

  describe('Cart Performance Optimization', () => {
    it('should batch fetch multiple cart items efficiently', async () => {
      // Create multiple items
      const items = await Promise.all([
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 1' }),
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 2' }),
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 3' }),
      ]);

      // Add all to cart
      testUser.cart = items.map(item => ({
        itemId: item._id,
        quantity: 1,
        addedAt: new Date(),
      }));
      await testUser.save();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
      
      // Verify all items returned with correct data
      data.data.forEach((cartItem: any) => {
        expect(cartItem.item).toBeDefined();
        expect(cartItem.item.title).toBeTruthy();
      });
    });
  });
});

