const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('pfs_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('pfs_token', token);
  else localStorage.removeItem('pfs_token');
}

async function request<T>(path: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  // auth
  signup: (name: string, email: string, password: string) => request<{ token: string; user: any }>(`/auth/signup`, 'POST', { name, email, password }),
  login: (email: string, password: string) => request<{ token: string; user: any }>(`/auth/login`, 'POST', { email, password }),
  me: () => request(`/auth/me`, 'GET'),

  // settings
  getTheme: () => request(`/settings/theme`, 'GET'),
  setTheme: (theme: string) => request(`/settings/theme`, 'PUT', { theme }),
  getBudget: () => request(`/settings/budget`, 'GET'),
  setBudget: (monthlyBudget: number, currency: string) => request(`/settings/budget`, 'PUT', { monthlyBudget, currency }),
  getEmailReminders: () => request(`/settings/email-reminders`, 'GET'),
  setEmailReminders: (emailReminders: boolean, reminderTime: string) => request(`/settings/email-reminders`, 'PUT', { emailReminders, reminderTime }),
  resetData: () => request(`/settings/reset-data`, 'POST'),
  exportCsv: () => request(`/settings/export`, 'GET'),

  // generic CRUD helpers
  list: (resource: string) => request(`/${resource}`, 'GET'),
  create: (resource: string, item: any) => request(`/${resource}`, 'POST', item),
  update: (resource: string, id: string, item: any) => request(`/${resource}/${id}`, 'PUT', item),
  remove: (resource: string, id: string) => request(`/${resource}/${id}`, 'DELETE'),
  patch: (resource: string, path: string, body?: any) => request(`/${resource}${path}`, 'PATCH', body),
};

export default api;

