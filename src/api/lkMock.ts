import {
  Client,
  LKDocument,
  LKUser,
  ManagerStats,
  Message,
  Shipment,
  ShipmentStatus,
} from '@/types/lk';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ----------- in-memory state -----------
let _clients: Client[] = [
  {
    id: 1,
    name: 'ООО «ТехноИмпорт»',
    inn: '7701234567',
    contact_person: 'Иванов И.И.',
    phone: '+7 (495) 123-45-67',
    email: 'ivanov@technoimport.ru',
    shipment_count: 3,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'ИП Петров А.С.',
    inn: '770234567890',
    contact_person: 'Петров А.С.',
    phone: '+7 (812) 555-12-34',
    email: 'petrov@example.com',
    shipment_count: 1,
    created_at: '2025-03-20T09:30:00Z',
  },
  {
    id: 3,
    name: 'ООО «ГлобалТрейд»',
    inn: '5407891234',
    contact_person: 'Сидорова М.В.',
    phone: '+7 (383) 222-33-44',
    email: 'sidorova@globaltrade.ru',
    shipment_count: 2,
    created_at: '2025-04-05T12:00:00Z',
  },
];

let _shipments: Shipment[] = [
  { id: 101, client_id: 1, client_name: _clients[0].name, title: 'Партия электроники из Китая', status: 'declaration_filed', created_at: '2026-05-10T08:00:00Z', updated_at: '2026-06-10T14:00:00Z' },
  { id: 102, client_id: 1, client_name: _clients[0].name, title: 'Запчасти для оборудования', status: 'released', created_at: '2026-04-12T08:00:00Z', updated_at: '2026-05-01T14:00:00Z' },
  { id: 103, client_id: 1, client_name: _clients[0].name, title: 'Комплектующие, Гуанчжоу', status: 'documents_requested', created_at: '2026-06-01T08:00:00Z', updated_at: '2026-06-12T14:00:00Z' },
  { id: 104, client_id: 2, client_name: _clients[1].name, title: 'Одежда, Турция', status: 'customs_inspection', created_at: '2026-06-05T08:00:00Z', updated_at: '2026-06-15T14:00:00Z' },
  { id: 105, client_id: 3, client_name: _clients[2].name, title: 'Станок ЧПУ, Германия', status: 'new', created_at: '2026-06-16T08:00:00Z', updated_at: '2026-06-16T08:00:00Z' },
  { id: 106, client_id: 3, client_name: _clients[2].name, title: 'Химическое сырьё', status: 'on_hold', created_at: '2026-05-20T08:00:00Z', updated_at: '2026-06-14T14:00:00Z' },
];

let _documents: LKDocument[] = [
  { id: 1, shipment_id: 101, filename_original: 'invoice_2026_05.pdf', doc_type: 'Инвойс', uploader_role: 'client', visible_to_client: true, editable_by_client: false, created_at: '2026-05-11T10:00:00Z' },
  { id: 2, shipment_id: 101, filename_original: 'packing_list.pdf', doc_type: 'Упаковочный лист', uploader_role: 'client', visible_to_client: true, editable_by_client: false, created_at: '2026-05-11T10:05:00Z' },
  { id: 3, shipment_id: 101, filename_original: 'declaration_draft.pdf', doc_type: 'Декларация', uploader_role: 'manager', visible_to_client: true, editable_by_client: false, created_at: '2026-06-10T13:00:00Z' },
];

let _messages: Message[] = [
  { id: 1, shipment_id: 101, user_id: 1, sender_name: 'Менеджер ИННОВЭД', role: 'manager', text: 'Здравствуйте! Принято в работу.', is_read: true, created_at: '2026-05-10T09:00:00Z' },
  { id: 2, shipment_id: 101, user_id: 2, sender_name: 'Иванов И.И.', role: 'client', text: 'Спасибо! Документы загрузил.', is_read: true, created_at: '2026-05-11T10:10:00Z' },
  { id: 3, shipment_id: 101, user_id: 1, sender_name: 'Менеджер ИННОВЭД', role: 'manager', text: 'Декларация подготовлена, ожидаем выпуск.', is_read: false, created_at: '2026-06-10T13:30:00Z' },
  { id: 4, shipment_id: 104, user_id: 1, sender_name: 'Менеджер ИННОВЭД', role: 'manager', text: 'Назначен таможенный досмотр на завтра.', is_read: false, created_at: '2026-06-15T15:00:00Z' },
];

let _nextClientId = 4;
let _nextShipmentId = 200;
let _nextDocId = 100;
let _nextMsgId = 100;

// ----------- mock users -----------
const MOCK_USERS: Array<{ email: string; password: string; user: LKUser }> = [
  { email: 'manager@innoved.ru', password: 'manager', user: { id: 1, name: 'Менеджер ИННОВЭД', role: 'manager', clientId: null } },
  { email: 'client@technoimport.ru', password: 'client', user: { id: 2, name: 'Иванов И.И.', role: 'client', clientId: 1 } },
];

export async function mockLogin(email: string, password: string) {
  await delay();
  const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
  if (!found) throw new Error('Неверный email или пароль');
  return { token: `mock-token-${found.user.id}-${Date.now()}`, user: found.user };
}

export async function mockManagerStats(): Promise<ManagerStats> {
  await delay(150);
  return {
    clients_total: _clients.length,
    shipments_active: _shipments.filter((s) => s.status !== 'released').length,
    messages_unread: _messages.filter((m) => !m.is_read && m.role === 'client').length,
  };
}

export async function mockManagerMessages() {
  await delay(150);
  // group last messages per shipment that have unread or recent activity
  const grouped: Record<number, Message[]> = {};
  for (const m of _messages) (grouped[m.shipment_id] ||= []).push(m);
  return Object.entries(grouped).map(([sid, msgs]) => {
    const shipment = _shipments.find((s) => s.id === Number(sid))!;
    const last = msgs[msgs.length - 1];
    const unread = msgs.filter((m) => !m.is_read).length;
    return {
      shipment_id: Number(sid),
      shipment_title: shipment?.title,
      client_name: shipment?.client_name,
      preview: last.text,
      last_at: last.created_at,
      unread,
    };
  });
}

export async function mockClients(q?: string) {
  await delay(150);
  const list = _clients.map((c) => ({
    ...c,
    shipment_count: _shipments.filter((s) => s.client_id === c.id).length,
  }));
  if (!q) return list;
  const lo = q.toLowerCase();
  return list.filter(
    (c) => c.name.toLowerCase().includes(lo) || c.inn.includes(q) || c.email.toLowerCase().includes(lo)
  );
}

export async function mockCreateClient(data: Partial<Client>) {
  await delay();
  const client: Client = {
    id: _nextClientId++,
    name: data.name || '',
    inn: data.inn || '',
    contact_person: data.contact_person || '',
    phone: data.phone || '',
    email: data.email || '',
    shipment_count: 0,
    created_at: new Date().toISOString(),
  };
  _clients.push(client);
  const password = Math.random().toString(36).slice(-10);
  return { client, credentials: { email: client.email, password } };
}

export async function mockClient(id: number) {
  await delay(100);
  const c = _clients.find((x) => x.id === id);
  if (!c) throw new Error('Клиент не найден');
  return { ...c, shipment_count: _shipments.filter((s) => s.client_id === id).length };
}

export async function mockShipments(params: { status?: string; client_id?: number } = {}) {
  await delay(150);
  let list = [..._shipments];
  if (params.status) list = list.filter((s) => s.status === params.status);
  if (params.client_id) list = list.filter((s) => s.client_id === params.client_id);
  return list.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

export async function mockCreateShipment(data: { client_id: number; title: string }) {
  await delay();
  const client = _clients.find((c) => c.id === data.client_id);
  const sh: Shipment = {
    id: _nextShipmentId++,
    client_id: data.client_id,
    client_name: client?.name || '',
    title: data.title,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  _shipments.push(sh);
  return sh;
}

export async function mockShipment(id: number) {
  await delay(100);
  const s = _shipments.find((x) => x.id === id);
  if (!s) throw new Error('Поставка не найдена');
  return s;
}

export async function mockUpdateShipment(id: number, data: Partial<Shipment>) {
  await delay(150);
  const idx = _shipments.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error('Поставка не найдена');
  _shipments[idx] = { ..._shipments[idx], ...data, updated_at: new Date().toISOString() };
  return _shipments[idx];
}

export async function mockDocuments(shipmentId: number) {
  await delay(150);
  return _documents.filter((d) => d.shipment_id === shipmentId);
}

export async function mockUploadDocument(shipmentId: number, form: FormData) {
  await delay();
  const file = form.get('file') as File | null;
  const doc: LKDocument = {
    id: _nextDocId++,
    shipment_id: shipmentId,
    filename_original: file?.name || 'file.pdf',
    doc_type: String(form.get('doc_type') || 'Документ'),
    uploader_role: (String(form.get('uploader_role') || 'client') as any) || 'client',
    visible_to_client: form.get('visible_to_client') !== 'false',
    editable_by_client: form.get('editable_by_client') === 'true',
    created_at: new Date().toISOString(),
  };
  _documents.push(doc);
  return doc;
}

export async function mockDeleteDocument(shipmentId: number, docId: number) {
  await delay(100);
  _documents = _documents.filter((d) => !(d.shipment_id === shipmentId && d.id === docId));
}

export async function mockMessages(shipmentId: number, _since?: number) {
  await delay(120);
  return _messages.filter((m) => m.shipment_id === shipmentId).sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
}

export async function mockSendMessage(
  shipmentId: number,
  text: string,
  sender?: { role: 'manager' | 'client'; name: string; user_id: number }
) {
  await delay(120);
  const msg: Message = {
    id: _nextMsgId++,
    shipment_id: shipmentId,
    user_id: sender?.user_id ?? 999,
    sender_name: sender?.name ?? 'Вы',
    role: sender?.role ?? 'client',
    text,
    is_read: true,
    created_at: new Date().toISOString(),
  };
  _messages.push(msg);
  return msg;
}

// Override role for sending based on current user (used from UI by passing via FormData/text only)
export function _setMockSenderHint(_role: 'manager' | 'client', _name: string) {
  // not used; UI passes through send and we infer; kept for future
}
