import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Report from '@/models/Report';
import Item from '@/models/Item';
import User from '@/models/User';

let mongoServer: MongoMemoryServer;
let testUser: any;
let testSeller: any;
let testItem: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test users and item
  testUser = await User.create({
    clerkId: 'user_test123',
    email: 'user@example.com',
    firstName: 'Test',
    lastName: 'User',
  });

  testSeller = await User.create({
    clerkId: 'seller_test123',
    email: 'seller@example.com',
    firstName: 'Seller',
    lastName: 'User',
    isSeller: true,
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
    sellerId: testSeller._id,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Report.deleteMany({});
});

describe('Report Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid report', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'counterfeit',
        description: 'This item appears to be fake',
      });

      expect(report.itemId.toString()).toBe(testItem._id.toString());
      expect(report.reporterId.toString()).toBe(testUser._id.toString());
      expect(report.reason).toBe('counterfeit');
      expect(report.status).toBe('pending');
    });

    it('should validate reason enum', async () => {
      await expect(
        Report.create({
          itemId: testItem._id,
          reporterId: testUser._id,
          reason: 'invalid_reason' as any,
        })
      ).rejects.toThrow();
    });

    it('should validate status enum', async () => {
      await expect(
        Report.create({
          itemId: testItem._id,
          reporterId: testUser._id,
          reason: 'spam',
          status: 'invalid_status' as any,
        })
      ).rejects.toThrow();
    });

    it('should prevent duplicate reports from same user', async () => {
      await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });

      await expect(
        Report.create({
          itemId: testItem._id,
          reporterId: testUser._id,
          reason: 'inappropriate',
        })
      ).rejects.toThrow();
    });
  });

  describe('Priority Auto-Assignment', () => {
    it('should set urgent priority for counterfeit reports', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'counterfeit',
      });

      expect(report.priority).toBe('urgent');
    });

    it('should set urgent priority for prohibited reports', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'prohibited',
      });

      expect(report.priority).toBe('urgent');
    });

    it('should set high priority for inappropriate reports', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'inappropriate',
      });

      expect(report.priority).toBe('high');
    });

    it('should set normal priority for misleading reports', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'misleading',
      });

      expect(report.priority).toBe('normal');
    });

    it('should set low priority for other reports', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'other',
      });

      expect(report.priority).toBe('low');
    });
  });

  describe('Report Methods', () => {
    it('isResolved() should return true for resolved status', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
        status: 'resolved',
      });

      expect(report.isResolved()).toBe(true);
    });

    it('isResolved() should return true for dismissed status', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
        status: 'dismissed',
      });

      expect(report.isResolved()).toBe(true);
    });

    it('isResolved() should return false for pending status', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });

      expect(report.isResolved()).toBe(false);
    });

    it('markAsResolved() should update status and metadata', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });

      const adminId = new mongoose.Types.ObjectId();
      await report.markAsResolved('dismissed', adminId);

      expect(report.status).toBe('resolved');
      expect(report.action).toBe('dismissed');
      expect(report.reviewedBy?.toString()).toBe(adminId.toString());
      expect(report.reviewedAt).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create multiple reports with different statuses
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
          status: 'pending',
        },
        {
          itemId: testItem._id,
          reporterId: new mongoose.Types.ObjectId(),
          reason: 'misleading',
          status: 'resolved',
        },
      ]);
    });

    it('countReportsForItem() should count pending and under_review reports', async () => {
      const count = await Report.countReportsForItem(testItem._id);
      expect(count).toBe(2); // Only pending, not resolved
    });

    it('shouldAutoTakedown() should return true with 3+ reports', async () => {
      // Add one more report to reach 3
      await Report.create({
        itemId: testItem._id,
        reporterId: new mongoose.Types.ObjectId(),
        reason: 'inappropriate',
        status: 'pending',
      });

      const shouldTakedown = await Report.shouldAutoTakedown(testItem._id);
      expect(shouldTakedown).toBe(true);
    });

    it('shouldAutoTakedown() should return false with less than 3 reports', async () => {
      const shouldTakedown = await Report.shouldAutoTakedown(testItem._id);
      expect(shouldTakedown).toBe(false);
    });

    it('findReportsForItem() should return all reports for item', async () => {
      const reports = await Report.findReportsForItem(testItem._id);
      expect(reports).toHaveLength(3);
    });

    it('findPendingReports() should return only pending reports', async () => {
      const reports = await Report.findPendingReports();
      expect(reports).toHaveLength(2);
      reports.forEach(report => {
        expect(report.status).toBe('pending');
      });
    });
  });

  describe('Description Validation', () => {
    it('should accept report without description', async () => {
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
      });

      expect(report.description).toBeUndefined();
    });

    it('should accept description up to 1000 characters', async () => {
      const description = 'A'.repeat(1000);
      const report = await Report.create({
        itemId: testItem._id,
        reporterId: testUser._id,
        reason: 'spam',
        description,
      });

      expect(report.description).toBe(description);
    });

    it('should reject description over 1000 characters', async () => {
      const description = 'A'.repeat(1001);
      
      await expect(
        Report.create({
          itemId: testItem._id,
          reporterId: testUser._id,
          reason: 'spam',
          description,
        })
      ).rejects.toThrow();
    });
  });
});

