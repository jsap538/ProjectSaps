/**
 * Jest Configuration for Integration Tests
 * 
 * Runs MongoDB-dependent integration tests with MongoDB Memory Server.
 * These tests are separated from unit tests to avoid ESM/module issues.
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/integration/**/*.test.ts',
    '**/__tests__/models/**/*.test.ts',
    '**/__tests__/features/**/*.test.ts',
    '**/__tests__/security/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  // Don't transform node_modules except for ESM-only packages
  transformIgnorePatterns: [
    'node_modules/(?!(mongodb-memory-server|bson)/)',
  ],
  // Increase timeout for MongoDB Memory Server startup
  testTimeout: 60000,
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  collectCoverageFrom: [
    'models/**/*.ts',
    'lib/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  // Run tests serially to avoid MongoDB port conflicts
  maxWorkers: 1,
  verbose: true,
};

