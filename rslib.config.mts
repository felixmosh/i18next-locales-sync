import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
      cli: './src/cli.ts',
    },
  },
  lib: [
    {
      format: 'cjs',
      bundle: true,
      dts: true,
    },
  ],
  output: {
    target: 'node',
  },
});