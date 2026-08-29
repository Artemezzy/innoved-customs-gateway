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

    // === LKShipmentsPage ===
  page_shipments_title: { ru: 'Поставки', en: 'Shipments', zh: '货运' },
  page_my_shipments_title: { ru: 'Мои поставки', en: 'My shipments', zh: '我的货运' },
  btn_new_shipment: { ru: 'Новая поставка', en: 'New shipment', zh: '新建货运' },
  th_number: { ru: '№', en: 'No.', zh: '编号' },
  th_title: { ru: 'Название', en: 'Title', zh: '名称' },
  th_client: { ru: 'Клиент', en: 'Client', zh: '客户' },
  th_status: { ru: 'Статус', en: 'Status', zh: '状态' },
  th_updated: { ru: 'Обновлена', en: 'Updated', zh: '更新时间' },
  th_actions: { ru: 'Действия', en: 'Actions', zh: '操作' },
  empty_no_shipments: { ru: 'Поставок нет', en: 'No shipments', zh: '暂无货运' },
  dialog_delete_shipment_title: { ru: 'Удалить поставку?', en: 'Delete shipment?', zh: '删除货运？' },
  dialog_delete_shipment_desc: { ru: 'Действие необратимо. Все документы и сообщения поставки будут удалены.', en: 'This action cannot be undone. All documents and messages for this shipment will be deleted.', zh: '此操作不可撤销。该货运的所有文件和消息都将被删除。' },

  // Статусы поставки
  status_new: { ru: 'Новая', en: 'New', zh: '新建' },
  status_documents_requested: { ru: 'Запрос документов', en: 'Documents requested', zh: '请求文件' },
  status_documents_received: { ru: 'Документы получены', en: 'Documents received', zh: '已收到文件' },
  status_declaration_filed: { ru: 'Декларация подана', en: 'Declaration filed', zh: '已提交报关单' },
  status_customs_inspection: { ru: 'Таможенный контроль', en: 'Customs inspection', zh: '海关检查' },
  status_released: { ru: 'Выпущен', en: 'Released', zh: '已放行' },
  status_on_hold: { ru: 'Задержан', en: 'On hold', zh: '暂缓' },
  cert_status_open: { ru: 'Открыто', en: 'Open', zh: '已开启' },
  cert_status_estimation: { ru: 'Просчёт', en: 'Estimation', zh: '核算中' },
  cert_status_documents_pending: { ru: 'Предоставление документов', en: 'Documents pending', zh: '待提交文件' },
  cert_status_layout_approved: { ru: 'Макет согласован', en: 'Layout approved', zh: '版式已批准' },
  cert_status_payment: { ru: 'Оплата', en: 'Payment', zh: '付款' },
  cert_status_certificate_issued: { ru: 'Сертификат выпущен', en: 'Certificate issued', zh: '证书已签发' },
  cert_status_rejected: { ru: 'Заявка отклонена', en: 'Request rejected', zh: '申请已拒绝' },
  cert_status_closed: { ru: 'Закрыто', en: 'Closed', zh: '已关闭' },

  // === ShipmentItemsPanel / CertItemsPanel (общие блоки) ===
  section_applicant: { ru: 'Заявитель (импортёр)', en: 'Applicant (Importer)', zh: '申请人（进口商）' },
  section_manufacturer: { ru: 'Изготовитель', en: 'Manufacturer', zh: '制造商' },
  section_products: { ru: 'Продукция', en: 'Products', zh: '产品' },
  field_org_name: { ru: 'Название организации', en: 'Organization name', zh: '组织名称' },
  field_legal_address: { ru: 'Юридический адрес', en: 'Legal address', zh: '法定地址' },
  field_head: { ru: 'Руководитель', en: 'Head', zh: '负责人' },
  field_position: { ru: 'Должность', en: 'Position', zh: '职位' },
  field_email: { ru: 'Электронная почта', en: 'Email', zh: '电子邮箱' },
  field_address: { ru: 'Адрес', en: 'Address', zh: '地址' },
  field_country: { ru: 'Страна', en: 'Country', zh: '国家' },

  // Заголовки таблицы товаров
  th_check: { ru: '✓', en: '✓', zh: '✓' },
  th_product: { ru: 'Наименование продукции', en: 'Product name', zh: '产品名称' },
  th_tech_description: { ru: 'Техническое описание', en: 'Technical description', zh: '技术说明' },
  th_model_article: { ru: 'Модель / артикул', en: 'Model / SKU', zh: '型号/货号' },
  th_trademark: { ru: 'Торговая марка', en: 'Trademark', zh: '商标' },
  th_tn_ved: { ru: 'ТН ВЭД', en: 'HS code', zh: '商品编码' },
  th_contract_invoice: { ru: 'Контракт / Договор / Инвойс', en: 'Contract / Invoice', zh: '合同/发票' },
  th_quantity: { ru: 'Количество', en: 'Quantity', zh: '数量' },
  th_price: { ru: 'Цена', en: 'Price', zh: '价格' },
  th_tr_ts: { ru: 'ТР ТС', en: 'TR CU', zh: '欧亚经济联盟技术法规' },
  th_cert_form: { ru: 'Форма сертификации', en: 'Certification form', zh: '认证形式' },
  th_cert_scheme: { ru: 'Схема сертификации', en: 'Certification scheme', zh: '认证方案' },
  th_cost: { ru: 'Стоимость', en: 'Cost', zh: '费用' },
  th_cert_price: { ru: 'Цена сертификации', en: 'Certification price', zh: '认证费用' },
  th_comment: { ru: 'Комментарий / Дополнительно', en: 'Comment / Additional', zh: '备注/附加信息' },
  th_production_deadline: { ru: 'Срок изготовления', en: 'Production deadline', zh: '生产周期' },
  th_samples_required: { ru: 'Необходимость образцов', en: 'Samples required', zh: '是否需要样品' },
  th_samples_city: { ru: 'В какой город доставлять образцы', en: 'City for sample delivery', zh: '样品寄送城市' },

  btn_hide_column: { ru: 'Скрыть столбец', en: 'Hide column', zh: '隐藏列' },
  hidden_columns_label: { ru: 'Скрытые столбцы:', en: 'Hidden columns:', zh: '隐藏的列：' },
  btn_show_attachments: { ru: 'Показать вложения', en: 'Show attachments', zh: '显示附件' },
  btn_hide_attachments: { ru: 'Скрыть вложения', en: 'Hide attachments', zh: '隐藏附件' },
  label_attachments_for_position: { ru: 'к позиции №', en: 'for item No.', zh: '项目编号' },
  dialog_delete_position_title: { ru: 'Удалить позицию №', en: 'Delete item No.', zh: '删除项目编号' },
  dialog_delete_position_desc: { ru: 'Данные позиции и её вложения будут удалены безвозвратно.', en: 'The item data and its attachments will be permanently deleted.', zh: '该项目数据及其附件将被永久删除。' },
  footer_note_checked_items: { ru: 'Для формирования заявки будут использованы только отмеченные чек-боксом товары.', en: 'Only items checked with the checkbox will be used to generate the request.', zh: '仅使用已勾选的商品生成申请。' },
  btn_generate_single: { ru: 'Сформировать заявку по этой позиции', en: 'Generate request for this item', zh: '为此项目生成申请' },
  position_label: { ru: 'Позиция №', en: 'Item No.', zh: '项目编号' },

  // Вкладки страницы поставки
  tab_products: { ru: 'Продукция', en: 'Products', zh: '产品' },
  tab_cert_requests: { ru: 'Заявки на сертификацию', en: 'Certification requests', zh: '认证申请' },
  tab_documents: { ru: 'Документы', en: 'Documents', zh: '文件' },
  tab_chat: { ru: 'Чат', en: 'Chat', zh: '聊天' },

  // LinkedCertRequestsPanel
  section_linked_requests: { ru: 'Связанные заявки на сертификацию', en: 'Linked certification requests', zh: '关联的认证申请' },
  empty_no_linked_requests: { ru: 'По этой поставке пока не сформировано ни одной заявки на сертификацию.', en: 'No certification requests have been generated for this shipment yet.', zh: '此货运尚未生成任何认证申请。' },
  btn_open: { ru: 'Открыть', en: 'Open', zh: '打开' },
  dialog_select_request_for_sync: { ru: 'Выберите заявку для синхронизации', en: 'Select a request to sync', zh: '选择要同步的申请' },
  btn_sync_confirm: { ru: 'Синхронизировать', en: 'Sync', zh: '同步' },

  // GenerateCertRequestModal
  modal_generate_cert_request_title: { ru: 'Сформировать заявку на сертификацию', en: 'Generate certification request', zh: '生成认证申请' },
  label_cert_center: { ru: 'Сертификационный центр', en: 'Certification center', zh: '认证中心' },
  label_selected_count: { ru: 'Выбрано товаров:', en: 'Selected items:', zh: '已选商品数：' },
  usage_warning_single: { ru: 'Одна из выбранных позиций уже участвует в другой активной заявке:', en: 'One of the selected items is already used in another active request:', zh: '所选商品中有一项已用于另一份有效申请：' },
  usage_warning_multi: { ru: 'из выбранных позиций уже участвуют в других активных заявках:', en: 'of the selected items are already used in other active requests:', zh: '项所选商品已用于其他有效申请：' },
  checkbox_confirm_anyway: { ru: 'Всё равно отправить эти позиции в новую заявку', en: 'Send these items to the new request anyway', zh: '仍然将这些商品发送到新申请' },
  checking_usage: { ru: 'Проверка использования позиций…', en: 'Checking item usage…', zh: '正在检查商品使用情况…' },
  placeholder_select_center: { ru: 'Выберите центр', en: 'Select center', zh: '选择中心' },

  // Chat panels
  label_no_messages: { ru: 'Сообщений пока нет', en: 'No messages yet', zh: '暂无消息' },
  placeholder_message_input: { ru: 'Введите сообщение…', en: 'Type a message…', zh: '输入消息…' },
  label_file_too_large: { ru: 'Файл слишком большой (макс. 20 МБ)', en: 'File is too large (max 20 MB)', zh: '文件过大（最大20MB）' },
  label_invalid_file_type: { ru: 'Недопустимый тип файла', en: 'Invalid file type', zh: '不支持的文件类型' },

  // Files panels
  btn_choose_file: { ru: 'Выбрать файл', en: 'Choose file', zh: '选择文件' },
  btn_add_link: { ru: 'Добавить ссылку', en: 'Add link', zh: '添加链接' },
  placeholder_url: { ru: 'https://…', en: 'https://…', zh: 'https://…' },
  empty_no_attachments: { ru: 'Вложений пока нет', en: 'No attachments yet', zh: '暂无附件' },
  label_uploading: { ru: 'Загрузка…', en: 'Uploading…', zh: '上传中…' },

  // Notifications
  section_notifications_title: { ru: 'Email-уведомления', en: 'Email notifications', zh: '邮件通知' },
  section_notifications_desc: { ru: 'Укажите список адресов, на которые отправлять уведомления по изменениям в заявках.', en: 'Specify the list of addresses to send notifications about changes in requests.', zh: '请指定用于接收申请变更通知的邮箱地址列表。' },
  label_send_notifications: { ru: 'Отправка уведомлений', en: 'Send notifications', zh: '发送通知' },
  label_notifications_hint: { ru: 'Если выключить, письма на все адреса из списка отправляться не будут.', en: 'If turned off, no emails will be sent to any address in the list.', zh: '关闭后，将不会向列表中的任何地址发送邮件。' },
  label_additional_email: { ru: 'Дополнительный email', en: 'Additional email', zh: '附加邮箱' },
  placeholder_email: { ru: 'you@example.com', en: 'you@example.com', zh: 'you@example.com' },
  empty_no_additional_emails: { ru: 'Дополнительные адреса пока не добавлены.', en: 'No additional addresses added yet.', zh: '尚未添加附加地址。' },
  toast_settings_saved: { ru: 'Настройки уведомлений сохранены', en: 'Notification settings saved', zh: '通知设置已保存' },

  page_cert_requests_title: { ru: 'Заявки на сертификацию', en: 'Certification requests', zh: '认证申请' },
  page_my_requests_title: { ru: 'Мои заявки', en: 'My requests', zh: '我的申请' },
  btn_new_request: { ru: 'Новая заявка', en: 'New request', zh: '新建申请' },
  th_company: { ru: 'Компания', en: 'Company', zh: '公司' },
  th_created_date: { ru: 'Дата создания', en: 'Created date', zh: '创建日期' },
  th_cert_center: { ru: 'Сертцентр', en: 'Cert. center', zh: '认证中心' },
  empty_no_requests: { ru: 'Заявок нет', en: 'No requests', zh: '暂无申请' },
  dialog_delete_request_title: { ru: 'Удалить заявку?', en: 'Delete request?', zh: '删除申请？' },
  dialog_delete_request_desc: { ru: 'Действие необратимо. Все файлы и сообщения заявки будут удалены.', en: 'This action cannot be undone. All files and messages for this request will be deleted.', zh: '此操作不可撤销。该申请的所有文件和消息都将被删除。' },

  page_cert_centers_title: { ru: 'Сертификационные центры', en: 'Certification centers', zh: '认证中心' },
  btn_add_center: { ru: 'Добавить центр', en: 'Add center', zh: '添加中心' },
  tab_active: { ru: 'Активные', en: 'Active', zh: '活跃' },
  tab_archive: { ru: 'Архив', en: 'Archive', zh: '存档' },
  placeholder_search_by_name: { ru: 'Поиск по названию', en: 'Search by name', zh: '按名称搜索' },
  th_contact_person: { ru: 'Контактное лицо', en: 'Contact person', zh: '联系人' },
  th_phone: { ru: 'Телефон', en: 'Phone', zh: '电话' },
  th_email: { ru: 'Email', en: 'Email', zh: '邮箱' },
  th_requests: { ru: 'Заявки', en: 'Requests', zh: '申请数' },
  empty_no_centers_active: { ru: 'Сертификационные центры не найдены', en: 'No certification centers found', zh: '未找到认证中心' },
  empty_archive_empty: { ru: 'Архив пуст', en: 'Archive is empty', zh: '存档为空' },
  dialog_delete_center_title: { ru: 'Удалить сертификационный центр?', en: 'Delete certification center?', zh: '删除认证中心？' },
  dialog_delete_center_desc_part1: { ru: 'будет перемещён в архив. Доступ к личному кабинету будет заблокирован, но все данные (заявки, файлы, переписка) сохранятся. Восстановить центр можно из вкладки «Архив».', en: 'will be moved to the archive. Access to the personal account will be blocked, but all data (requests, files, correspondence) will be preserved. The center can be restored from the "Archive" tab.', zh: '将被移至存档。个人账户的访问权限将被阻止，但所有数据（申请、文件、通信记录）将被保留。可以从"存档"标签页恢复该中心。' },
  toast_center_archived: { ru: 'Сертификационный центр перемещён в архив', en: 'Certification center moved to archive', zh: '认证中心已移至存档' },
  toast_center_restored: { ru: 'Сертификационный центр восстановлен', en: 'Certification center restored', zh: '认证中心已恢复' },

  toast_password_reset: { ru: 'Пароль сброшен', en: 'Password reset', zh: '密码已重置' },
  btn_reset_password: { ru: 'Сбросить пароль', en: 'Reset password', zh: '重置密码' },
  label_login: { ru: 'Логин', en: 'Login', zh: '登录名' },
  label_password: { ru: 'Пароль', en: 'Password', zh: '密码' },
  label_access_credentials: { ru: 'Доступы', en: 'Access credentials', zh: '访问凭证' },
  label_new_password_copy_hint: { ru: 'Сохраните пароль — повторно он не будет показан.', en: 'Save the password — it will not be shown again.', zh: '请保存密码——不会再次显示。' },

  card_total_clients: { ru: 'Всего клиентов', en: 'Total clients', zh: '客户总数' },
  card_active_shipments: { ru: 'Активных поставок', en: 'Active shipments', zh: '活跃货运数' },
  card_unread_messages: { ru: 'Непрочитанных сообщений', en: 'Unread messages', zh: '未读消息数' },

  page_messages_title: { ru: 'Сообщения', en: 'Messages', zh: '消息' },
  empty_no_messages_list: { ru: 'Сообщений нет', en: 'No messages', zh: '暂无消息' },

  label_create_shipment_title: { ru: 'Создать поставку', en: 'Create shipment', zh: '创建货运' },
  field_shipment_title: { ru: 'Название поставки', en: 'Shipment title', zh: '货运名称' },
  placeholder_select_client: { ru: 'Выберите клиента', en: 'Select client', zh: '选择客户' },
  btn_create: { ru: 'Создать', en: 'Create', zh: '创建' },

  page_clients_title: { ru: 'Клиенты', en: 'Clients', zh: '客户' },
  btn_add_client: { ru: 'Добавить клиента', en: 'Add client', zh: '添加客户' },
  placeholder_search_clients: { ru: 'Поиск по названию, ИНН, email', en: 'Search by name, tax ID, email', zh: '按名称、税号、邮箱搜索' },
  th_inn: { ru: 'ИНН', en: 'Tax ID', zh: '税号' },
  th_shipments: { ru: 'Поставки', en: 'Shipments', zh: '货运数' },
  empty_no_clients_active: { ru: 'Клиенты не найдены', en: 'No clients found', zh: '未找到客户' },
  dialog_delete_client_title: { ru: 'Удалить клиента?', en: 'Delete client?', zh: '删除客户？' },
  dialog_delete_client_desc_part1: { ru: 'будет перемещён в архив. Доступ к личному кабинету будет заблокирован, но все данные (поставки, документы, сообщения) сохранятся. Восстановить клиента можно из вкладки «Архив».', en: 'will be moved to the archive. Access to the personal account will be blocked, but all data (shipments, documents, messages) will be preserved. The client can be restored from the "Archive" tab.', zh: '将被移至存档。个人账户的访问权限将被阻止，但所有数据（货运、文件、消息）将被保留。可以从"存档"标签页恢复该客户。' },
  toast_client_archived: { ru: 'Клиент перемещён в архив', en: 'Client moved to archive', zh: '客户已移至存档' },
  toast_client_restored: { ru: 'Клиент восстановлен', en: 'Client restored', zh: '客户已恢复' },


} as const;

export type LKDictKey = keyof typeof lkDict;

export function lkT(key: LKDictKey, lang: LKLanguage): string {
  return lkDict[key][lang] ?? lkDict[key].ru;
}
