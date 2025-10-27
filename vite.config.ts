import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ['zustand'],
  },
  build: {
    sourcemap: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendors';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack-vendors';
            }
            if (id.includes('zustand')) {
              return 'state-vendors';
            }
          }
          return undefined;
        },
      },
    },
  },
});
