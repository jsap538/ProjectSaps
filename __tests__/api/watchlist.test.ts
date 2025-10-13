import { POST, DELETE, GET } from '@/app/api/watchlist/route';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';

let mongoServer: MongoMemoryServer;
let testUser: any;
let testItem: any;

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

describe('Watchlist API', () => {
  describe('GET /api/watchlist', () => {
    it('should return empty watchlist for new user', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });

    it('should return watchlist items with full details', async () => {
      testUser.watchlist.push(testItem._id);
      await testUser.save();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].title).toBe('Test Item');
    });

    it('should handle deleted items gracefully', async () => {
      testUser.watchlist.push(testItem._id);
      await testUser.save();
      await Item.findByIdAndDelete(testItem._id);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });
  });

  describe('POST /api/watchlist', () => {
    it('should add item to watchlist successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('added');
    });

    it('should increment item favorites count', async () => {
      const initialFavorites = testItem.stats.favorites;

      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      await POST(request);

      const updatedItem = await Item.findById(testItem._id);
      expect(updatedItem?.stats.favorites).toBe(initialFavorites + 1);
    });

    it('should handle adding item already in watchlist', async () => {
      testUser.watchlist.push(testItem._id);
      await testUser.save();

      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('already in watchlist');
    });

    it('should reject adding non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ itemId: fakeId.toString() }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Item not found');
    });

    it('should require itemId', async () => {
      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Item ID is required');
    });
  });

  describe('DELETE /api/watchlist', () => {
    it('should remove item from watchlist successfully', async () => {
      testUser.watchlist.push(testItem._id);
      await testUser.save();

      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('removed');
    });

    it('should decrement item favorites count', async () => {
      testUser.watchlist.push(testItem._id);
      await testUser.save();

      // Increment favorites first
      testItem.stats.favorites = 5;
      await testItem.save();

      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      await DELETE(request);

      const updatedItem = await Item.findById(testItem._id);
      expect(updatedItem?.stats.favorites).toBe(4);
    });

    it('should not decrement if item was not in watchlist', async () => {
      testItem.stats.favorites = 5;
      await testItem.save();

      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      await DELETE(request);

      const updatedItem = await Item.findById(testItem._id);
      expect(updatedItem?.stats.favorites).toBe(5); // Unchanged
    });

    it('should handle removing item not in watchlist gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/watchlist', {
        method: 'DELETE',
        body: JSON.stringify({ itemId: testItem._id.toString() }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Watchlist Performance', () => {
    it('should efficiently fetch multiple watchlist items', async () => {
      // Create multiple items
      const items = await Promise.all([
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 1' }),
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 2' }),
        Item.create({ ...testItem.toObject(), _id: new mongoose.Types.ObjectId(), title: 'Item 3' }),
      ]);

      // Add all to watchlist
      testUser.watchlist = items.map(item => item._id);
      await testUser.save();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
    });
  });
});

