import { request } from './client.js';

export function fetchWishlist(userId) {
  return request('/api/wishlist', { query: { userId } });
}

export function checkWishlist(userId, propertyId) {
  return request('/api/wishlist/check', { query: { userId, propertyId } });
}

export function addWishlist(userId, propertyId) {
  return request('/api/wishlist', { method: 'POST', body: { userId, propertyId } });
}

export function removeWishlist(userId, propertyId) {
  return request('/api/wishlist', { method: 'DELETE', query: { userId, propertyId } });
}
