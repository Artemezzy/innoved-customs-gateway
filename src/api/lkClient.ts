import { getAuthToken, triggerLogout } from '@/contexts/AuthContext';
import * as mock from './lkMock';
import type { LKUser } from '@/types/lk';

export const USE_MOCK = false;
const BASE_URL = '/api';

type LoginResponseRaw = {
  token: string;
  role: 'manager' | 'client' | 'cert_center';
  name: string;
  id?: number;
  client_id?: number | null;
  cert_center_id?: number | null;
};


async function request<T>(
  method: string,
  path: string,
  body?: any,
  isFormData = false
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  console.log('REQUEST', {
    method,
    url: `${BASE_URL}${path}`,
    body,
    token,
  });

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  if (res.status === 401) {
    console.warn('REQUEST 401, triggering logout');
    triggerLogout();
    if (typeof window !== 'undefined') {
      window.location.href = '/lk/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();

  if (!text) {
    // пустой ответ — вернём undefined и не будем падать
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error('Failed to parse JSON', { text, e });
    throw new Error('Некорректный ответ сервера');
  }
}

// ---------- Public API ----------

export async function lkLogin(email: string, password: string) {
  if (USE_MOCK) return mock.mockLogin(email, password);

  console.log('lkLogin called', { email });

  const res = await request<LoginResponseRaw>('POST', '/auth/login', {
    email,
    password,
  });

  const user: LKUser = {
    id: res.id ?? 0,
    name: res.name,
    role: res.role,
    clientId: res.client_id ?? null,
    certCenterId: res.cert_center_id ?? null,
  };


  console.log('lkLogin result', { token: res.token, user });

  return { token: res.token, user };
}

export const lkApi = {
  managerStats: () =>
    USE_MOCK
      ? mock.mockManagerStats()
      : request<import('@/types/lk').ManagerStats>('GET', '/managers/stats'),

  managerMessages: () =>
    USE_MOCK
      ? mock.mockManagerMessages()
      : request<any[]>('GET', '/managers/messages'),

  clients: (q?: string) =>
    USE_MOCK
      ? mock.mockClients(q)
      : request<import('@/types/lk').Client[]>(
        'GET',
        `/clients${q ? `?q=${encodeURIComponent(q)}` : ''}`
      ),

  createClient: (data: Partial<import('@/types/lk').Client>) =>
    USE_MOCK
      ? mock.mockCreateClient(data)
      : request<{
        client: import('@/types/lk').Client;
        credentials: { email: string; password: string };
      }>('POST', '/clients', data),

  client: (id: number) =>
    USE_MOCK
      ? mock.mockClient(id)
      : request<import('@/types/lk').Client>('GET', `/clients/${id}`),

  shipments: (params: { status?: string; client_id?: number } = {}) => {
    if (USE_MOCK) return mock.mockShipments(params);
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.client_id) qs.set('client_id', String(params.client_id));
    const q = qs.toString();
    return request<import('@/types/lk').Shipment[]>(
      'GET',
      `/shipments${q ? `?${q}` : ''}`
    );
  },

  createShipment: (data: { title: string; client_id?: number }) =>
    USE_MOCK
      ? mock.mockCreateShipment({ client_id: data.client_id ?? 0, title: data.title })
      : request<{ id: number }>('POST', '/shipments', data),

  deleteShipment: (id: number) =>
    request<{ ok: boolean }>('DELETE', `/shipments/${id}`),

  shipment: (id: number) =>
    USE_MOCK
      ? mock.mockShipment(id)
      : request<import('@/types/lk').Shipment>('GET', `/shipments/${id}`),

  updateShipment: (id: number, data: Partial<import('@/types/lk').Shipment>) =>
    USE_MOCK
      ? mock.mockUpdateShipment(id, data)
      : request<import('@/types/lk').Shipment>(
        'PUT',
        `/shipments/${id}`,
        data
      ),

  documents: (shipmentId: number) =>
    USE_MOCK
      ? mock.mockDocuments(shipmentId)
      : request<import('@/types/lk').LKDocument[]>(
        'GET',
        `/shipments/${shipmentId}/documents`
      ),

  uploadDocument: (shipmentId: number, form: FormData) =>
    USE_MOCK
      ? mock.mockUploadDocument(shipmentId, form)
      : request<import('@/types/lk').LKDocument>(
        'POST',
        `/shipments/${shipmentId}/documents`,
        form,
        true
      ),

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
    sender?: { role: import('@/types/lk').Role; name: string; user_id: number }
  ) =>
    USE_MOCK
      ? mock.mockSendMessage(shipmentId, text, sender)
      : request<import('@/types/lk').Message>('POST', `/shipments/${shipmentId}/messages`, {
        text,
      }),

  // НОВОЕ: сброс пароля клиента
  resetClientPassword: (clientId: number) =>
    // если когда-нибудь захочешь замокать, можно добавить в lkMock такую функцию
    request<{
      user_id: number;
      client_id: number;
      login: string;
      name: string;
      new_password: string;
    }>('POST', `/clients/${clientId}/reset-password`),

  // ============ Certification centers ============
  certCenters: (q?: string) =>
    USE_MOCK
      ? mock.mockCertCenters(q)
      : request<import('@/types/lk').CertCenter[]>(
        'GET',
        `/cert-centers${q ? `?q=${encodeURIComponent(q)}` : ''}`
      ),

  createCertCenter: (data: Partial<import('@/types/lk').CertCenter>) =>
    USE_MOCK
      ? mock.mockCreateCertCenter(data)
      : request<{
        center: import('@/types/lk').CertCenter;
        credentials: { email: string; password: string };
      }>('POST', '/cert-centers', data),

  resetCertCenterPassword: (id: number) =>
    request<{
      user_id: number;
      cert_center_id: number;
      login: string;
      name: string;
      new_password: string;
    }>('POST', `/cert-centers/${id}/reset-password`),

  // ============ Certification requests ============
  certRequests: (params: { status?: string; cert_center_id?: number } = {}) => {
    if (USE_MOCK) return mock.mockCertRequests(params);
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.cert_center_id) qs.set('cert_center_id', String(params.cert_center_id));
    const q = qs.toString();
    return request<import('@/types/lk').CertRequest[]>(
      'GET',
      `/cert-requests${q ? `?${q}` : ''}`
    );
  },

  createCertRequest: (data: { company: string; cert_center_id: number }) =>
    USE_MOCK
      ? mock.mockCreateCertRequest(data)
      : request<{ id: number }>('POST', '/cert-requests', data),

  certRequest: (id: number) =>
    USE_MOCK
      ? mock.mockCertRequest(id)
      : request<import('@/types/lk').CertRequestDetails>('GET', `/cert-requests/${id}`),

  certRequestItems: (id: number) =>
    request<import('@/types/lk').CertRequestItem[]>('GET', `/cert-requests/${id}/items`),

  addCertRequestItem: (id: number, data?: Partial<import('@/types/lk').CertRequestItem>) =>
    request<import('@/types/lk').CertRequestItem>('POST', `/cert-requests/${id}/items`, data ?? {}),

  updateCertRequestItem: (
    id: number,
    itemId: number,
    data: Partial<import('@/types/lk').CertRequestItem>
  ) =>
    request<import('@/types/lk').CertRequestItem>(
      'PUT',
      `/cert-requests/${id}/items/${itemId}`,
      data
    ),

  deleteCertRequestItem: (id: number, itemId: number) =>
    request<{ ok: boolean }>('DELETE', `/cert-requests/${id}/items/${itemId}`),

  updateCertRequestStatus: (id: number, status: import('@/types/lk').CertRequestStatus) =>
    USE_MOCK
      ? mock.mockUpdateCertRequestStatus(id, status)
      : request<{ ok: boolean }>('PUT', `/cert-requests/${id}`, { status }),

  deleteCertRequest: (id: number) =>
    USE_MOCK
      ? mock.mockDeleteCertRequest(id)
      : request<{ ok: boolean }>('DELETE', `/cert-requests/${id}`),

  uploadCertFile: (id: number, form: FormData) =>
    USE_MOCK
      ? mock.mockUploadCertFile(id, form)
      : request<import('@/types/lk').CertFile>(
        'POST',
        `/cert-requests/${id}/files`,
        form,
        true
      ),

  addCertFileUrl: (id: number, url: string) => {
    const fd = new FormData();
    fd.append('url', url);
    if (USE_MOCK) return mock.mockUploadCertFile(id, fd);
    return request<import('@/types/lk').CertFile>(
      'POST',
      `/cert-requests/${id}/files`,
      fd,
      true
    );
  },

  downloadCertFile: async (id: number, fileId: number, filename?: string) => {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/cert-requests/${id}/files/${fileId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Не удалось скачать (HTTP ${res.status})`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `file-${fileId}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  certMessages: (id: number, since?: number) =>
    USE_MOCK
      ? mock.mockCertMessages(id, since)
      : request<import('@/types/lk').CertMessage[]>(
        'GET',
        `/cert-requests/${id}/messages${since ? `?since=${since}` : ''}`
      ),

  sendCertMessage: (
    id: number,
    text: string,
    sender?: { role: import('@/types/lk').Role; name: string; user_id: number }
  ) =>
    USE_MOCK
      ? mock.mockSendCertMessage(id, text, sender)
      : request<import('@/types/lk').CertMessage>('POST', `/cert-requests/${id}/messages`, {
        text,
      }),
};
