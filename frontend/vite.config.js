import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Default production backend URL for dev proxy
const DEFAULT_PROXY_TARGET = 'https://heavenhub-7hwn.onrender.com';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Uses VITE_DEV_PROXY_TARGET for dev, or VITE_API_URL, or falls back to production URL
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || env.VITE_API_URL || DEFAULT_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Same-origin /api in dev → proxy to API (default: Render production).
        '/api': { target: proxyTarget, changeOrigin: true, secure: true },
      },
    },
    preview: {
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true, secure: true },
      },
    },
  };
});
