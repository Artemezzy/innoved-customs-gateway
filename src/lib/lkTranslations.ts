import { LKLanguage } from '@/contexts/LKLanguageContext';

export const lkDict = {
  // Навигация сайдбара
  nav_dashboard: { ru: 'Дашборд', en: 'Dashboard', zh: '仪表盘' },
  nav_clients: { ru: 'Клиенты', en: 'Clients', zh: '客户' },
  nav_shipments: { ru: 'Поставки', en: 'Shipments', zh: '货运' },
  nav_messages: { ru: 'Сообщения', en: 'Messages', zh: '消息' },
  nav_cert_centers: { ru: 'Серт. центры', en: 'Cert. Centers', zh: '认证中心' },
  nav_cert_requests: { ru: 'Заявки на сертификацию', en: 'Certification Requests', zh: '认证申请' },
  nav_notifications: { ru: 'Уведомления', en: 'Notifications', zh: '通知' },
  nav_logout: { ru: 'Выйти', en: 'Log out', zh: '退出登录' },

  // Роли
  role_manager: { ru: 'Менеджер', en: 'Manager', zh: '经理' },
  role_client: { ru: 'Клиент', en: 'Client', zh: '客户' },
  role_cert_center: { ru: 'Сертификационный центр', en: 'Certification Center', zh: '认证中心' },

  // Общие кнопки/действия
  btn_save: { ru: 'Сохранить', en: 'Save', zh: '保存' },
  btn_save_block: { ru: 'Сохранить блок', en: 'Save block', zh: '保存部分' },
  btn_cancel: { ru: 'Отмена', en: 'Cancel', zh: '取消' },
  btn_delete: { ru: 'Удалить', en: 'Delete', zh: '删除' },
  btn_add: { ru: 'Добавить', en: 'Add', zh: '添加' },
  btn_add_item: { ru: 'Добавить товар', en: 'Add item', zh: '添加商品' },
  btn_upload: { ru: 'Загрузить', en: 'Upload', zh: '上传' },
  btn_download: { ru: 'Скачать', en: 'Download', zh: '下载' },
  btn_send: { ru: 'Отправить', en: 'Send', zh: '发送' },
  btn_reply: { ru: 'Ответить', en: 'Reply', zh: '回复' },
  btn_edit: { ru: 'Редактировать', en: 'Edit', zh: '编辑' },
  btn_close: { ru: 'Закрыть', en: 'Close', zh: '关闭' },
  btn_confirm: { ru: 'Подтвердить', en: 'Confirm', zh: '确认' },
  btn_generate_request: { ru: 'Сформировать заявку', en: 'Generate request', zh: '生成申请' },
  btn_generate_cert_request: { ru: 'Сформировать заявку на сертификацию', en: 'Generate certification request', zh: '生成认证申请' },
  btn_sync: { ru: 'Синхронизировать', en: 'Sync', zh: '同步' },

  // Общие подписи
  label_loading: { ru: 'Загрузка…', en: 'Loading…', zh: '加载中…' },
  label_no_data: { ru: 'Нет данных', en: 'No data', zh: '暂无数据' },
  label_search: { ru: 'Поиск', en: 'Search', zh: '搜索' },
  label_all_statuses: { ru: 'Все статусы', en: 'All statuses', zh: '所有状态' },
  label_all_clients: { ru: 'Все клиенты', en: 'All clients', zh: '所有客户' },
  label_status: { ru: 'Статус', en: 'Status', zh: '状态' },
  label_updated: { ru: 'Обновлена', en: 'Updated', zh: '更新时间' },
  label_number: { ru: '№', en: 'No.', zh: '编号' },
  label_title: { ru: 'Название', en: 'Title', zh: '名称' },
  label_client: { ru: 'Клиент', en: 'Client', zh: '客户' },
  label_actions: { ru: 'Действия', en: 'Actions', zh: '操作' },

  // Языковой переключатель
  language_switcher: { ru: 'Язык', en: 'Language', zh: '语言' },
} as const;

export type LKDictKey = keyof typeof lkDict;

export function lkT(key: LKDictKey, lang: LKLanguage): string {
  return lkDict[key][lang] ?? lkDict[key].ru;
}
