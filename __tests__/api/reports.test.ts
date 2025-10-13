import { POST as CreateReport, GET as GetReports } from '@/app/api/reports/route';
import { POST as ResolveReport } from '@/app/api/reports/[id]/resolve/route';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User';
import Item from '@/models/Item';
import Report from '@/models/Report';

let mongoServer: MongoMemoryServer;
let testUser: any;
let testAdmin: any;
let testItem: any;

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
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
  const { auth } = require('@clerk/nextjs/server');
  auth.mockResolvedValue({ userId: 'test-clerk-id' });

  testUser = await User.create({
    clerkId: 'test-clerk-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  });

  testAdmin = await User.create({
    clerkId: 'admin-clerk-id',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
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
  await Report.deleteMany({});
});

describe('Reports API', () => {
  describe('POST /api/reports - Create Report', () => {
    it('should create a report successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          reason: 'counterfeit',
          description: 'This looks fake',
        }),
      });

      const response = await CreateReport(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toContain('submitted successfully');
    });

    it('should prevent duplicate reports from same user', async () => {
      // Create first report
      await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });

      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          reason: 'inappropriate',
        }),
      });

      const response = await CreateReport(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('already reported');
    });

    it('should auto-takedown item after 3 reports', async () => {
      // Create 2 existing reports
      await Report.create([
        {
          itemId: testItem._id,
          reporterId: new mongoose.Types.ObjectId(),
          reason: 'counterfeit',
        },
        {
          itemId: testItem._id,
          reporterId: new mongoose.Types.ObjectId(),
          reason: 'inappropriate',
        },
      ]);

      // Submit 3rd report
      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          reason: 'misleading',
        }),
      });

      const response = await CreateReport(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.autoTakenDown).toBe(true);

      // Verify item is deactivated
      const updatedItem = await Item.findById(testItem._id);
      expect(updatedItem?.isActive).toBe(false);
    });

    it('should reject invalid report reason', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          reason: 'invalid_reason',
        }),
      });

      const response = await CreateReport(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid report reason');
    });

    it('should reject report for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: fakeId.toString(),
          reason: 'spam',
        }),
      });

      const response = await CreateReport(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Item not found');
    });

    it('should require authentication', async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValueOnce({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          itemId: testItem._id.toString(),
          reason: 'spam',
        }),
      });

      const response = await CreateReport(request);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/reports - Get Reports (Admin)', () => {
    beforeEach(async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValue({ userId: 'admin-clerk-id' });

      // Create some test reports
      await Report.create([
        {
          itemId: testItem._id,
          reporterId: testUser._id,
          reason: 'counterfeit',
          status: 'pending',
        },
        {
          itemId: testItem._id,
          reporterId: new mongoose.Types.ObjectId(),
          reason: 'spam',
          status: 'resolved',
        },
      ]);
    });

    it('should return pending reports for admin', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports?status=pending');
      const response = await GetReports(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].status).toBe('pending');
    });

    it('should reject non-admin users', async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValueOnce({ userId: 'test-clerk-id' });

      const request = new NextRequest('http://localhost:3000/api/reports');
      const response = await GetReports(request);

      expect(response.status).toBe(403);
    });

    it('should return all reports when status=all', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports?status=all');
      const response = await GetReports(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
    });
  });

  describe('POST /api/reports/[id]/resolve - Resolve Report', () => {
    let testReport: any;

    beforeEach(async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValue({ userId: 'admin-clerk-id' });

      testReport = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });
    });

    it('should resolve report with dismiss action', async () => {
      const request = new NextRequest(`http://localhost:3000/api/reports/${testReport._id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'dismissed',
          adminNotes: 'No violation found',
        }),
      });

      const params = Promise.resolve({ id: testReport._id.toString() });
      const response = await ResolveReport(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const updatedReport = await Report.findById(testReport._id);
      expect(updatedReport?.status).toBe('resolved');
      expect(updatedReport?.action).toBe('dismissed');
    });

    it('should deactivate item when removing', async () => {
      const request = new NextRequest(`http://localhost:3000/api/reports/${testReport._id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'item_removed',
          adminNotes: 'Violation confirmed',
        }),
      });

      const params = Promise.resolve({ id: testReport._id.toString() });
      await ResolveReport(request, { params });

      const updatedItem = await Item.findById(testItem._id);
      expect(updatedItem?.isActive).toBe(false);
    });

    it('should require admin privileges', async () => {
      const { auth } = require('@clerk/nextjs/server');
      auth.mockResolvedValueOnce({ userId: 'test-clerk-id' });

      const request = new NextRequest(`http://localhost:3000/api/reports/${testReport._id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action: 'dismissed' }),
      });

      const params = Promise.resolve({ id: testReport._id.toString() });
      const response = await ResolveReport(request, { params });

      expect(response.status).toBe(403);
    });

    it('should reject invalid action', async () => {
      const request = new NextRequest(`http://localhost:3000/api/reports/${testReport._id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action: 'invalid_action' }),
      });

      const params = Promise.resolve({ id: testReport._id.toString() });
      const response = await ResolveReport(request, { params });

      expect(response.status).toBe(400);
    });
  });
});

