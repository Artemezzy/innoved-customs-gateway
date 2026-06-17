export type Role = 'manager' | 'client';

export interface LKUser {
  id: number;
  name: string;
  role: Role;
  clientId: number | null;
}

export interface Client {
  id: number;
  name: string;
  inn: string;
  contact_person: string;
  phone: string;
  email: string;
  shipment_count: number;
  created_at: string;
}

export type ShipmentStatus =
  | 'new'
  | 'documents_requested'
  | 'documents_received'
  | 'declaration_filed'
  | 'customs_inspection'
  | 'released'
  | 'on_hold';

export interface Shipment {
  id: number;
  client_id: number;
  client_name: string;
  title: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  new: 'Новая',
  documents_requested: 'Запрос документов',
  documents_received: 'Документы получены',
  declaration_filed: 'Декларация подана',
  customs_inspection: 'Таможенный контроль',
  released: 'Выпущен',
  on_hold: 'Задержан',
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  new: 'bg-gray-100 text-gray-700',
  documents_requested: 'bg-yellow-100 text-yellow-800',
  documents_received: 'bg-blue-100 text-blue-800',
  declaration_filed: 'bg-indigo-100 text-indigo-800',
  customs_inspection: 'bg-orange-100 text-orange-800',
  released: 'bg-green-100 text-green-800',
  on_hold: 'bg-red-100 text-red-800',
};

export interface LKDocument {
  id: number;
  shipment_id: number;
  filename_original: string;
  doc_type: string;
  uploader_role: Role;
  visible_to_client: boolean;
  editable_by_client: boolean;
  created_at: string;
}

export interface Message {
  id: number;
  shipment_id: number;
  user_id: number;
  sender_name: string;
  role: Role;
  text: string;
  is_read: boolean;
  created_at: string;
}

export interface ManagerStats {
  clients_total: number;
  shipments_active: number;
  messages_unread: number;
}
