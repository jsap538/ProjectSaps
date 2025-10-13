/**
 * Setup file for integration tests
 * 
 * Configures environment for MongoDB Memory Server tests
 */

// Increase timeout for MongoDB operations
jest.setTimeout(60000);

// Suppress console logs during tests (optional)
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

// Add global test utilities
global.testUtils = {
  createTestId: () => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
};

