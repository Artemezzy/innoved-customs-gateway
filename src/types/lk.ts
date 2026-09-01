export type Role = 'manager' | 'client' | 'cert_center';

export type OrganizationProfileType = 'applicant' | 'manufacturer';

export interface OrganizationProfile {
  id: number;
  client_id: number;
  profile_type: OrganizationProfileType;
  name: string;
  address: string;
  head: string;
  position: string;
  email: string;
  country: string;
  created_by_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationProfileCheck {
  exists: boolean;
  profile: OrganizationProfile | null;
}

export interface LKUser {
  id: number;
  name: string;
  role: Role;
  clientId: number | null;
  certCenterId: number | null;
}

export interface Client {
  id: number;
  name: string;
  inn: string;
  contact_person: string;
  phone: string;
  email: string;
  shipment_count: number;
  is_active: number;
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
  document_number: number;
  number: string;
  client_id: number;
  client_name: string;
  title: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
  applicant_org: string;
  applicant_address: string;
  applicant_head: string;
  applicant_position: string;
  applicant_email: string;
  manufacturer_org: string;
  manufacturer_address: string;
  manufacturer_country: string;
  linked_cert_requests?: LinkedCertRequest[];
  cert_requests_count?: number;
}

export interface ShipmentItem {
  id: number;
  shipment_id: number;
  position_no: number;
  product: string;
  tech_description: string;
  model_article: string;
  trademark: string;
  tn_ved: string;
  contract_invoice: string;
  quantity: string;
  price: string;
  tr_ts: string;
  cert_form: string;
  cert_price: string;
  comment: string;
}

export interface ShipmentFile {
  id: number;
  file_type: 'file' | 'link';
  url: string;
  filename?: string;
  filename_original?: string;
  created_at: string;
}

export interface LinkedCertRequest {
  id: number;
  document_number: number;
  number: string;
  status: CertRequestStatus;
  updated_at: string;
  cert_center_name: string;
}

export interface ShipmentItemUsage {
  source_shipment_item_id: number;
  cert_request_id: number;
  document_number: number;
  cert_center_name: string;
  status: CertRequestStatus;
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
  attachment_original?: string | null;
  attachment_stored?: string | null;
  attachment_size?: number | null;
  reply_to_id?: number | null;
  reply_text?: string | null;
  reply_attachment_original?: string | null;
  reply_sender_name?: string | null;
}

export interface ManagerStats {
  clients_total: number;
  shipments_active: number;
  messages_unread: number;
}

export interface CertCenter {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  requests_count: number;
  is_active: number;
  created_at: string;
}

export type CertRequestStatus =
  | 'open'
  | 'estimation'
  | 'documents_pending'
  | 'layout_approved'
  | 'payment'
  | 'certificate_issued'
  | 'rejected'
  | 'closed';

export const CERT_STATUS_LABELS: Record<CertRequestStatus, string> = {
  open: 'Открыто',
  estimation: 'Просчёт',
  documents_pending: 'Предоставление документов',
  layout_approved: 'Макет согласован',
  payment: 'Оплата',
  certificate_issued: 'Сертификат выпущен',
  rejected: 'Заявка отклонена',
  closed: 'Закрыто',
};

export const CERT_STATUS_COLORS: Record<CertRequestStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  estimation: 'bg-purple-100 text-purple-800',
  documents_pending: 'bg-yellow-100 text-yellow-800',
  layout_approved: 'bg-indigo-100 text-indigo-800',
  payment: 'bg-orange-100 text-orange-800',
  certificate_issued: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-700',
};

export const CERT_STATUS_ORDER: CertRequestStatus[] = [
  'open',
  'estimation',
  'documents_pending',
  'layout_approved',
  'payment',
  'certificate_issued',
  'rejected',
  'closed',
];

export interface CertRequest {
  id: number;
  document_number: number;
  number: string;
  company: string;
  cert_center_id: number;
  cert_center_name: string;
  status: CertRequestStatus;
  created_at: string;
  updated_at: string;
  has_unread_messages: boolean;
  has_unread_changes: boolean;
  has_unread: boolean;
  applicant_org: string;
  applicant_address: string;
  applicant_head: string;
  applicant_position: string;
  applicant_email: string;
  manufacturer_org: string;
  manufacturer_address: string;
  manufacturer_country: string;
}

export interface CertRequestItem {
  id: number;
  position_no: number;
  is_checked: boolean;
  company: string;
  product: string;
  tech_description: string;
  model_article: string;
  trademark: string;
  tn_ved: string;
  contract_invoice: string;
  quantity: string;
  tr_ts: string;
  cert_form: string;
  cert_scheme: string;
  cost: string;
  production_deadline: string;
  samples_required: string;
  samples_city: string;
  comment: string;
}

export interface CertFile {
  id: number;
  file_type: 'file' | 'link';
  url: string;
  filename?: string;
  filename_original?: string;
  created_at: string;
}

export interface CertRequestDetails {
  request: CertRequest;
  items: CertRequestItem[];
}

export interface CertMessage {
  id: number;
  cert_request_id: number;
  user_id: number;
  sender_name: string;
  role: Role;
  text: string;
  is_read: boolean;
  created_at: string;
  attachment_original?: string | null;
  attachment_stored?: string | null;
  attachment_size?: number | null;
  reply_to_id?: number | null;
  reply_text?: string | null;
  reply_attachment_original?: string | null;
  reply_sender_name?: string | null;
}

export interface NotificationSettings {
  enabled: boolean;
  emails: string[];
}
