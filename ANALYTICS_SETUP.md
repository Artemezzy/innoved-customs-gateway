# Настройка Google Analytics 4

## Быстрый старт

1. **Создайте GA4 аккаунт** на https://analytics.google.com
2. **Получите Measurement ID** (формат: G-XXXXXXXXXX)
3. **Добавьте в .env файл**:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Настройка кастомных параметров в GA4

### 1. Кастомные параметры событий
В GA4 Admin → Data display → Custom definitions → Custom metrics/dimensions:

**Custom Dimensions (Пользовательские параметры):**
- `event_category` → Dimension name: "Event Category"
- `event_label` → Dimension name: "Event Label"  
- `contact_method` → Dimension name: "Contact Method"
- `service_type` → Dimension name: "Service Type"
- `form_type` → Dimension name: "Form Type"

### 2. Конверсии
В GA4 Admin → Data display → Conversions, отметьте как конверсии:
- `contact_click` - клики по контактам
- `form_submit` - отправка форм
- `service_inquiry` - запросы услуг

### 3. Аудитории
Создайте аудитории для:
- Пользователи, кликающие контакты
- Пользователи, отправляющие формы
- Пользователи по типам услуг

## Отслеживаемые события

### Основные события:
- `page_view` - просмотры страниц
- `contact_click` - клики по контактам (Telegram, телефон, email)
- `form_submit` - отправка форм
- `service_inquiry` - запросы услуг
- `language_change` - смена языка
- `price_check` - проверка цен
- `file_download` - скачивание файлов
- `external_link_click` - клики по внешним ссылкам

### Параметры событий:
- `event_category` - категория события
- `event_label` - дополнительная информация
- `contact_method` - способ контакта (telegram/phone/email)
- `service_type` - тип услуги
- `form_type` - тип формы

## Просмотр данных

### Real-time отчеты:
GA4 → Reports → Realtime - видите события в реальном времени

### Стандартные отчеты:
GA4 → Reports → Engagement → Events - все события с параметрами

### Детальный анализ:
GA4 → Explore → Free form - создавайте кастомные отчеты

## Отладка

В режиме разработки:
- События логируются в консоль браузера
- Включен `debug_mode` для GA4
- Используйте GA4 DebugView для проверки событий

## Проверка работы

1. Откройте сайт в браузере
2. Выполните действия (клики, отправка форм)
3. Проверьте в GA4 → Reports → Realtime
4. Или в консоли браузера (в dev режиме)

## Дополнительные настройки

### Enhanced ecommerce (если нужно):
```javascript
analytics.event('purchase', 'ecommerce', 'service_name', 1000);
```

### Кастомные конверсии:
```javascript
analytics.conversion('AW-CONVERSION_ID/LABEL', 5000, 'RUB');
```