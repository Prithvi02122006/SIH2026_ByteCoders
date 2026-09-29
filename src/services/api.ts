/**
 * FoodLoop API Client
 * Connects frontend to FastAPI backend (/api proxy or direct)
 */

// In development, Vite proxies /api → http://127.0.0.1:8000 (see vite.config.ts).
// In production on Vercel, set VITE_API_URL to your Render backend URL, e.g.:
//   https://foodloop-backend.onrender.com
// The /api prefix is kept so local dev always works without extra config.
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export interface UserSession {
  user_id: number;
  email: string;
  full_name: string;
  role: 'kitchen' | 'ngo' | 'driver' | 'safety_officer' | 'admin';
  organization_name: string;
  is_demo: boolean;
  access_token: string;
  profile?: any;
}

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem('foodloop_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession) {
  localStorage.setItem('foodloop_session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('foodloop_session');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = getStoredSession();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text() as any;
}

export const api = {
  // Auth & Demo
  login: (data: { email: string; password: string }) =>
    apiRequest<UserSession>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { email: string; password: string; full_name: string; role: string; organization_name: string; phone_number: string }) =>
    apiRequest<UserSession>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  demoQuickLogin: (role: string) =>
    apiRequest<UserSession>(`/demo/quick-login?role=${role}`, { method: 'POST' }),

  getMe: () => apiRequest('/auth/me'),

  // Onboarding Wizard
  saveStep1: (data: { kitchen_name: string; kitchen_type: string }) =>
    apiRequest('/onboarding/kitchen/step1', { method: 'POST', body: JSON.stringify(data) }),

  saveStep2: (data: { city: string; ward: string; landmark?: string; pincode: string; latitude?: number; longitude?: number }) =>
    apiRequest('/onboarding/kitchen/step2', { method: 'POST', body: JSON.stringify(data) }),

  saveStep3: (data: { typical_meals_per_day: number; breakfast_time: string; lunch_time: string; dinner_time: string }) =>
    apiRequest('/onboarding/kitchen/step3', { method: 'POST', body: JSON.stringify(data) }),

  saveStep4: (data: { fssai_licence_number: string; fssai_cert_url?: string }) =>
    apiRequest('/onboarding/kitchen/step4', { method: 'POST', body: JSON.stringify(data) }),

  saveStep5: (data: { menu_items: any[]; consent_insights_lab: boolean }) =>
    apiRequest('/onboarding/kitchen/step5', { method: 'POST', body: JSON.stringify(data) }),

  // Kitchen Daily Logs
  getDailyLogs: () => apiRequest('/kitchen/daily-logs'),
  createDailyLog: (data: any) =>
    apiRequest('/kitchen/daily-logs', { method: 'POST', body: JSON.stringify(data) }),
  updateDailyLog: (id: number, data: any) =>
    apiRequest(`/kitchen/daily-logs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  bulkImportDailyLogs: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/kitchen/daily-logs/bulk-import', { method: 'POST', body: formData });
  },

  // Inventory
  getInventory: () => apiRequest('/kitchen/inventory'),
  createInventoryItem: (data: any) =>
    apiRequest('/kitchen/inventory', { method: 'POST', body: JSON.stringify(data) }),

  // ML Demand Forecast
  getForecast: (data: { target_date: string; target_meal: string; expected_headcount: number; event_flag?: string }) =>
    apiRequest('/kitchen/forecast', { method: 'POST', body: JSON.stringify(data) }),

  // Surplus Listings
  createSurplus: (data: any) =>
    apiRequest('/surplus/create', { method: 'POST', body: JSON.stringify(data) }),

  getPendingInspections: () => apiRequest('/safety/pending-inspections'),
  inspectSurplus: (data: any) =>
    apiRequest('/safety/inspect', { method: 'POST', body: JSON.stringify(data) }),

  getAvailableSurplus: () => apiRequest('/surplus/available'),
  claimSurplus: (data: { listing_id: number; beneficiaries_expected: number }) =>
    apiRequest('/ngo/claim', { method: 'POST', body: JSON.stringify(data) }),

  // Driver Jobs
  getDriverJobs: () => apiRequest('/driver/my-jobs'),
  verifyPickup: (data: { listing_id: number; qr_token: string; otp_code: string }) =>
    apiRequest('/driver/verify-pickup', { method: 'POST', body: JSON.stringify(data) }),
  verifyDropoff: (data: { listing_id: number; beneficiary_count: number; notes?: string }) =>
    apiRequest('/driver/verify-dropoff', { method: 'POST', body: JSON.stringify(data) }),
  escalateJob: (data: { listing_id: number; reason: string }) =>
    apiRequest('/driver/escalate', { method: 'POST', body: JSON.stringify(data) }),

  // Temperature & IoT
  getTemperatureLogs: () => apiRequest('/temperature/logs'),
  logTemperature: (data: { probe_location: string; temperature_c: number; sensor_id?: string; source?: string }) =>
    apiRequest('/temperature/log', { method: 'POST', body: JSON.stringify(data) }),
  generateSensorKey: (key_name: string) =>
    apiRequest(`/sensors/generate-key?key_name=${encodeURIComponent(key_name)}`, { method: 'POST' }),

  // Admin / ESG
  getAdminMetrics: () => apiRequest('/admin/metrics'),

  // Public Insights Lab
  getPublicInsights: () => apiRequest('/insights/public'),

  // Data Export & Deletion
  exportDataUrl: '/api/data/export',
  deleteAccount: () => apiRequest('/data/delete', { method: 'DELETE' }),
};
