import { Customer, CustomerFollowUp, Order } from '@/types/crm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface DashboardStatsResponse {
  total_customers: number;
  total_orders: number;
  pending_orders: number;
  followups_due: number;
  currency: string;
  source: string;
  notes: string;
}

export interface CustomerCreatePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tier?: string;
}

// Helper to gracefully fallback or handle fetch errors
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMsg = `Server error: ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorMsg = typeof errorJson.detail === 'string' 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[ConnectCRM API] Request to ${endpoint} failed:`, message);
    throw err;
  }
}

export const api = {
  // Check backend health
  getHealth: () => fetchApi<{ status: string; service: string }>('/health'),

  // Dashboard Stats
  getDashboardStats: () => fetchApi<DashboardStatsResponse>('/api/dashboard/stats'),

  // Customers
  getCustomers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi<Customer[]>(`/api/customers${query}`);
  },

  createCustomer: (data: CustomerCreatePayload) =>
    fetchApi<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Follow-ups
  getFollowUps: () => fetchApi<CustomerFollowUp[]>('/api/follow-ups'),

  markFollowUpDone: (id: string) =>
    fetchApi<CustomerFollowUp>(`/api/follow-ups/${encodeURIComponent(id)}/mark-done`, {
      method: 'PATCH',
    }),

  // Orders
  getOrders: () => fetchApi<Order[]>('/api/orders'),

  updateOrderStatus: (id: string, status: string) =>
    fetchApi<Order>(`/api/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Integrations
  testIntegration: (payload: { store_url: string; consumer_key: string; consumer_secret?: string }) =>
    fetchApi<{ status: string; message: string; store_url: string }>('/api/integrations/test-connection', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
