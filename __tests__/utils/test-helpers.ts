import mongoose from 'mongoose';
import User from '@/models/User';
import Item from '@/models/Item';

/**
 * Create a test user with customizable properties
 */
export async function createTestUser(overrides: any = {}) {
  const defaults = {
    clerkId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
  };

  return await User.create({ ...defaults, ...overrides });
}

/**
 * Create a test seller with customizable stats
 */
export async function createTestSeller(overrides: any = {}) {
  const defaults = {
    clerkId: `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: `seller${Date.now()}@example.com`,
    firstName: 'Seller',
    lastName: 'User',
    isSeller: true,
  };

  return await User.create({ ...defaults, ...overrides });
}

/**
 * Create a trusted seller (auto-approval eligible)
 */
export async function createTrustedSeller() {
  return await createTestSeller({
    isVerified: true,
    stats: {
      totalSold: 10,
      averageRating: 4.8,
      totalListings: 12,
      totalPurchased: 0,
      totalRevenue: 50000,
      totalReviews: 8,
    },
  });
}

/**
 * Create an admin user
 */
export async function createAdmin() {
  return await createTestUser({
    isAdmin: true,
  });
}

/**
 * Create a test item with customizable properties
 */
export async function createTestItem(sellerId: mongoose.Types.ObjectId, overrides: any = {}) {
  const defaults = {
    title: 'Test Item',
    description: 'Test description for marketplace item',
    brand: "Drake's",
    price_cents: 5000,
    shipping_cents: 599,
    images: [
      { url: 'https://example.com/image.jpg', order: 0, isMain: true }
    ],
    condition: 'New',
    category: 'tie',
    color: 'Navy',
    location: 'New York, NY',
    sellerId,
  };

  return await Item.create({ ...defaults, ...overrides });
}

/**
 * Create multiple test items
 */
export async function createTestItems(sellerId: mongoose.Types.ObjectId, count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      await createTestItem(sellerId, {
        title: `Test Item ${i + 1}`,
        price_cents: 5000 + (i * 1000),
      })
    );
  }
  return items;
}

/**
 * Clear all test data
 */
export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

/**
 * Simulate auto-approval check
 */
export function shouldAutoApprove(user: any): boolean {
  return (
    user.isVerified === true &&
    user.stats.totalSold >= 5 &&
    user.stats.averageRating >= 4.5
  );
}

/**
 * Calculate expected cart total
 */
export function calculateCartTotal(items: any[]): number {
  return items.reduce((total, item) => {
    return total + (item.price_cents * (item.quantity || 1));
  }, 0);
}

/**
 * Mock successful fetch response
 */
export function mockFetchSuccess(data: any) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data }),
  } as Response);
}

/**
 * Mock failed fetch response
 */
export function mockFetchError(error: string, status: number = 400) {
  return Promise.resolve({
    ok: false,
    status,
    json: async () => ({ success: false, error }),
  } as Response);
}

/**
 * Wait for async operations
 */
export function wait(ms: number = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create mock NextRequest
 */
export function createMockRequest(url: string, options: any = {}) {
  return new Request(url, {
    method: options.method || 'GET',
    headers: options.headers || { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

