import swc from 'unplugin-swc';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // SWC emits decorator metadata, which NestJS dependency injection relies on.
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['test/**/*.e2e-spec.ts'],
    env: loadEnv('test', process.cwd(), ''),
    fileParallelism: false,
  },
});
