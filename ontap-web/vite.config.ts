import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    define: {
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      }
    },
    base: '/ontap/', /* 💖 Base path cho deployment */
    build: {
      outDir: '../public/ontap',
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
