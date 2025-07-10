import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode}) => {
  const env = loadEnv(mode, process.cwd());

  return {
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
        '/api': env.VITE_API_BASE_URL ||  'http://localhost:5000' 
      }
    }
  }
};