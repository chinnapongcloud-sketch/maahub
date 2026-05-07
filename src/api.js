const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'เกิดข้อผิดพลาด');
  }
  return data;
}

// Auth
export async function login(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export async function register(userData) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: userData,
  });
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

// Fields
export async function getFields() {
  return apiFetch('/fields');
}

export async function getField(id) {
  return apiFetch(`/fields/${id}`);
}

export async function createField(data) {
  return apiFetch('/fields', { method: 'POST', body: data });
}

export async function updateField(id, data) {
  return apiFetch(`/fields/${id}`, { method: 'PUT', body: data });
}

export async function deleteField(id) {
  return apiFetch(`/fields/${id}`, { method: 'DELETE' });
}

// Bookings
export async function getBookings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/bookings${qs ? '?' + qs : ''}`);
}

export async function getBookedSlots(fieldId, date) {
  return apiFetch(`/bookings/booked-slots?fieldId=${fieldId}&date=${date}`);
}

export async function createBooking(data) {
  return apiFetch('/bookings', { method: 'POST', body: data });
}

export async function updateBookingStatus(id, status) {
  return apiFetch(`/bookings/${id}/status`, { method: 'PUT', body: { status } });
}

// Upload
export async function uploadSlip(file) {
  const formData = new FormData();
  formData.append('slip', file);
  const token = getToken();
  const res = await fetch(`${API_BASE}/upload/slip`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'อัปโหลดไม่สําเร็จ');
  return data;
}

// Chat
export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
  return data;
}
