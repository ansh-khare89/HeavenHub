/**
 * Centralized API Configuration
 * 
 * Provides a single source of truth for the backend API base URL.
 * Uses environment variable VITE_API_URL if available (production builds, dev overrides).
 * Falls back to VITE_API_BASE_URL for backward compatibility.
 * @deprecated VITE_API_BASE_URL - use VITE_API_URL instead (prefer shorter env var name)
 */

// Default production backend URL
const PRODUCTION_API_URL = 'https://heavenhub-7hwn.onrender.com';

// Export the resolved API base URL - uses env vars with fallback to production
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  PRODUCTION_API_URL;