import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) => {
  // Resolve original vite config
  const baseConfig = typeof viteConfig === 'function' ? viteConfig(configEnv) : viteConfig;
  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        fileParallelism: false,
      },
    })
  );
});
