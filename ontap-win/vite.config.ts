import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      }
    },
    base: './', /* 💖 Force relative paths for Electron reliability */
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('recharts')) return 'vendor-recharts';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('xlsx') || id.includes('sheetjs') || id.includes('@sheetjs')) return 'vendor-xlsx';
              return 'vendor';
            }
          }
        }
      }
    },
  };
});
