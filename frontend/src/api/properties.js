import { request } from './client.js';

export function fetchProperties(params) {
  return request('/api/properties', { query: params });
}

/**
 * Optimized search with pagination.
 * Returns a Page<PropertyDto> with content array and pagination metadata.
 * 
 * @param {Object} params - Search parameters
 * @param {number} params.page - Zero-indexed page (default: 0)
 * @param {number} params.size - Results per page (default: 20)
 * @param {string} params.sort - Sort field and direction, e.g., "superhost,desc"
 * @param {string} params.location - City or state search
 * @param {number} params.minPrice - Minimum price per night
 * @param {number} params.maxPrice - Maximum price per night
 * @param {number} params.minRating - Minimum average rating
 * @param {boolean} params.petFriendly - Filter for pet-friendly
 * @param {boolean} params.instantBook - Filter for instant booking
 * @param {boolean} params.superhost - Filter for superhost
 * @param {string} params.region - Filter by region
 * @param {string} params.propertyType - Filter by property type
 * @returns {Promise<Object>} Page object with { content: PropertyDto[], totalElements, totalPages, ... }
 */
export function searchPropertiesPageable(params) {
  return request('/api/properties/search', { 
    query: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? 'superhost,desc',
      location: params.location,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.minRating,
      petFriendly: params.petFriendly,
      instantBook: params.instantBook,
      superhost: params.superhost,
      region: params.region,
      propertyType: params.propertyType,
    }
  });
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
