import { API_BASE_URL } from '../config/api.config.js';

export class ApiError extends Error {
  constructor(status, message, fieldErrors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.set(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export async function request(path, { method = 'GET', body, query, headers } = {}) {
  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;
  const opts = {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    let fieldErrors;
    let message = res.statusText || 'Request failed';
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const vals = Object.values(data);
      const looksLikeValidation = vals.every((x) => typeof x === 'string');
      if (looksLikeValidation && vals.length) {
        fieldErrors = data;
        message = vals.join(' ');
      } else if (typeof data.message === 'string') {
        message = data.message;
      }
    } else if (typeof data === 'string' && data.trim()) {
      message = data;
    }
    throw new ApiError(res.status, message, fieldErrors);
  }

  return data;
}
