import { defineConfig } from '@rstest/core';

export default defineConfig({
  globals: true,
  testEnvironment: 'node',
  include: ['test/**/*.test.ts'],
  resolve: {
    alias: {
      'fs-extra': './__mocks__/fs-extra.ts',
    },
  },
  coverage: {
    provider: 'v8',
    include: ['src/**/*.ts'],
    reportsDirectory: './coverage',
  },
});
