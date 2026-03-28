import { request } from './client.js';

export function fetchPropertyReviews(propertyId) {
  return request(`/api/properties/${propertyId}/reviews`);
}

export function createReview(propertyId, body) {
  return request(`/api/properties/${propertyId}/reviews`, { method: 'POST', body });
}

export function replyToReview(reviewId, body) {
  return request(`/api/reviews/${reviewId}/reply`, { method: 'PUT', body });
}
