/**
 * API origin.
 * - Always uses Railway backend URL in production.
 * - Override with VITE_API_BASE_URL in .env for local development.
 */
const PRODUCTION_API_BASE = 'https://heavenhub-production.up.railway.app';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? PRODUCTION_API_BASE;