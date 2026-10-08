const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(BASE + path, {
      method,
      signal,
      cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    const error = new Error('We could not reach the booking service. Check that it is running and try again.');
    error.code = 'NETWORK';
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;

  const error = new Error(data.error || 'Something went wrong. Please try again.');
  error.status = response.status;
  error.code = data.code;
  error.fields = data.fields || {};
  throw error;
}

export function getServices(signal) {
  return request('/services', { signal });
}

export function getSlots(serviceId, date, signal) {
  return request(`/slots?serviceId=${serviceId}&date=${date}`, { signal });
}

export function createAppointment(payload) {
  return request('/appointments', { method: 'POST', body: payload });
}

export function getAppointments(email, signal) {
  return request(`/appointments?email=${encodeURIComponent(email)}`, { signal });
}

export function getAdminList(query, signal) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const search = params.toString();
  return request(search ? `/admin/list?${search}` : '/admin/list', { signal });
}

export function cancelAppointment(id, email) {
  return request(`/appointments/${id}/cancel`, { method: 'POST', body: { email } });
}
