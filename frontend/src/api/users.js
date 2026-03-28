import { request } from './client.js';

export function registerUser(payload) {
  return request('/api/users/register', { method: 'POST', body: payload });
}

export function loginUser(payload) {
  return request('/api/users/login', { method: 'POST', body: payload });
}

export function getUser(id) {
  return request(`/api/users/${id}`);
}
