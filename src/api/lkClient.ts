import { getAuthToken, triggerLogout } from '@/contexts/AuthContext';
import * as mock from './lkMock';

export const USE_MOCK = true;
const BASE_URL = '/api';

async function request<T>(
  method: string,
  path: string,
  body?: any,
  isFormData = false
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    triggerLogout();
    if (typeof window !== 'undefined') window.location.href = '/lk/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---------- Public API (switches to mock when USE_MOCK) ----------

export async function lkLogin(email: string, password: string) {
  if (USE_MOCK) return mock.mockLogin(email, password);
  return request<{ token: string; user: import('@/types/lk').LKUser }>('POST', '/auth/login', {
    email,
    password,
  });
}

export const lkApi = {
  managerStats: () =>
    USE_MOCK ? mock.mockManagerStats() : request<import('@/types/lk').ManagerStats>('GET', '/managers/stats'),
  managerMessages: () =>
    USE_MOCK ? mock.mockManagerMessages() : request<any[]>('GET', '/managers/messages'),
  clients: (q?: string) =>
    USE_MOCK
      ? mock.mockClients(q)
      : request<import('@/types/lk').Client[]>('GET', `/clients${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  createClient: (data: Partial<import('@/types/lk').Client>) =>
    USE_MOCK
      ? mock.mockCreateClient(data)
      : request<{ client: import('@/types/lk').Client; credentials: { email: string; password: string } }>(
          'POST',
          '/clients',
          data
        ),
  client: (id: number) =>
    USE_MOCK ? mock.mockClient(id) : request<import('@/types/lk').Client>('GET', `/clients/${id}`),
  shipments: (params: { status?: string; client_id?: number } = {}) => {
    if (USE_MOCK) return mock.mockShipments(params);
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.client_id) qs.set('client_id', String(params.client_id));
    const q = qs.toString();
    return request<import('@/types/lk').Shipment[]>('GET', `/shipments${q ? `?${q}` : ''}`);
  },
  createShipment: (data: { client_id: number; title: string }) =>
    USE_MOCK
      ? mock.mockCreateShipment(data)
      : request<import('@/types/lk').Shipment>('POST', '/shipments', data),
  shipment: (id: number) =>
    USE_MOCK ? mock.mockShipment(id) : request<import('@/types/lk').Shipment>('GET', `/shipments/${id}`),
  updateShipment: (id: number, data: Partial<import('@/types/lk').Shipment>) =>
    USE_MOCK
      ? mock.mockUpdateShipment(id, data)
      : request<import('@/types/lk').Shipment>('PUT', `/shipments/${id}`, data),
  documents: (shipmentId: number) =>
    USE_MOCK
      ? mock.mockDocuments(shipmentId)
      : request<import('@/types/lk').LKDocument[]>('GET', `/shipments/${shipmentId}/documents`),
  uploadDocument: (shipmentId: number, form: FormData) =>
    USE_MOCK
      ? mock.mockUploadDocument(shipmentId, form)
      : request<import('@/types/lk').LKDocument>('POST', `/shipments/${shipmentId}/documents`, form, true),
  deleteDocument: (shipmentId: number, docId: number) =>
    USE_MOCK
      ? mock.mockDeleteDocument(shipmentId, docId)
      : request<void>('DELETE', `/shipments/${shipmentId}/documents/${docId}`),
  messages: (shipmentId: number, since?: number) =>
    USE_MOCK
      ? mock.mockMessages(shipmentId, since)
      : request<import('@/types/lk').Message[]>(
          'GET',
          `/shipments/${shipmentId}/messages${since ? `?since=${since}` : ''}`
        ),
  sendMessage: (
    shipmentId: number,
    text: string,
    sender?: { role: 'manager' | 'client'; name: string; user_id: number }
  ) =>
    USE_MOCK
      ? mock.mockSendMessage(shipmentId, text, sender)
      : request<import('@/types/lk').Message>('POST', `/shipments/${shipmentId}/messages`, { text }),
};
