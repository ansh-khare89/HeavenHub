import { request } from './client.js';

export function createBooking(body) {
  return request('/api/bookings', { method: 'POST', body });
}

export function fetchGuestBookings(guestId) {
  return request(`/api/bookings/guest/${guestId}`);
}

export function fetchHostPendingBookings(hostId) {
  return request(`/api/bookings/host/${hostId}/pending`);
}

export function fetchHostAllBookings(hostId) {
  return request(`/api/bookings/host/${hostId}`);
}

export function approveBooking(id, hostId) {
  return request(`/api/bookings/${id}/approve`, { method: 'PUT', query: { hostId } });
}

export function rejectBooking(id, hostId) {
  return request(`/api/bookings/${id}/reject`, { method: 'PUT', query: { hostId } });
}

export function cancelBooking(id, guestId) {
  return request(`/api/bookings/${id}/cancel`, { method: 'PUT', query: { guestId } });
}

export function completeBooking(id, hostId) {
  return request(`/api/bookings/${id}/complete`, { method: 'PUT', query: { hostId } });
}
