import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@store': path.resolve(__dirname, './src/store'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@theme': path.resolve(__dirname, './src/theme')
    }
  },
  build: {
    outDir: 'dist'
  },
  base: './', // ⚠️ SUPER IMPORTANT for routing to work correctly.
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
