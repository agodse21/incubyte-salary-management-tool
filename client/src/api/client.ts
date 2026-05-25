import type {
  CountryStats,
  Employee,
  EmployeeInput,
  EmployeeListResponse,
  JobTitleStats,
  OrgSummary,
} from '../types/employee';

const baseUrl = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listEmployees(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    country?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.search) query.set('search', params.search);
    if (params.country) query.set('country', params.country);
    const qs = query.toString();
    return request<EmployeeListResponse>(`/employees${qs ? `?${qs}` : ''}`);
  },

  getEmployee(id: string) {
    return request<Employee>(`/employees/${id}`);
  },

  createEmployee(data: EmployeeInput) {
    return request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEmployee(id: string, data: Partial<EmployeeInput>) {
    return request<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEmployee(id: string) {
    return request<void>(`/employees/${id}`, { method: 'DELETE' });
  },

  getCountryStats() {
    return request<CountryStats[]>('/insights/by-country');
  },

  getJobTitleStats(country: string) {
    return request<JobTitleStats[]>(
      `/insights/by-job-title?country=${encodeURIComponent(country)}`
    );
  },

  getSummary() {
    return request<OrgSummary>('/insights/summary');
  },
};
