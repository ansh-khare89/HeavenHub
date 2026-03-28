/**
 * API origin. In Vite dev/preview, use same-origin `/api` so the dev server proxy
 * forwards to Spring (no CORS). Production builds use the full URL unless you
 * serve the UI behind a reverse proxy that maps `/api`.
 */
export const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:8080';
