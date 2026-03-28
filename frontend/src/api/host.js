import { request } from './client.js';

export function fetchHostAnalytics(hostId) {
  return request(`/api/host/${hostId}/analytics`);
}

export function fetchHostReviews(hostId) {
  return request(`/api/host/${hostId}/reviews`);
}
