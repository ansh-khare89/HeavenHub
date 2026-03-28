import { request } from './client.js';

export function fetchProperties(params) {
  return request('/api/properties', { query: params });
}

export function fetchProperty(id) {
  return request(`/api/properties/${id}`);
}

export function createProperty(body) {
  return request('/api/properties', { method: 'POST', body });
}

export function updateProperty(id, hostId, body) {
  return request(`/api/properties/${id}`, {
    method: 'PUT',
    query: { hostId },
    body,
  });
}

export function deleteProperty(id, hostId) {
  return request(`/api/properties/${id}`, {
    method: 'DELETE',
    query: { hostId },
  });
}
