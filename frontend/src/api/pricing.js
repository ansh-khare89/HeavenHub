import { request } from './client.js';

export function estimatePricing(body) {
  return request('/api/pricing/estimate', { method: 'POST', body });
}
