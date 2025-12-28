export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  title: { ru: string; en: string };
  excerpt: { ru: string; en: string };
  content: { ru: string; en: string };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'customs-clearance-2024-changes',
    date: '2024-12-15',
    category: 'customs',
    title: {
      ru: 'Изменения в таможенном законодательстве 2024: что нужно знать',
      en: 'Customs Legislation Changes 2024: What You Need to Know'
    },
    excerpt: {
      ru: 'Обзор ключевых изменений в таможенном законодательстве, вступающих в силу в 2024 году.',
      en: 'Overview of key changes in customs legislation coming into force in 2024.'
    },
    content: {
      ru: `В 2024 году вступает в силу ряд важных изменений в таможенном законодательстве Российской Федерации.

## Основные изменения

### 1. Электронное декларирование
Полный переход на электронное декларирование для всех категорий товаров. Бумажные декларации больше не принимаются.

### 2. Новые требования к сертификации
Расширен список товаров, требующих обязательной сертификации при импорте.

### 3. Изменения в ставках пошлин
Пересмотрены ставки ввозных пошлин для ряда товарных категорий в рамках ЕАЭС.

## Рекомендации для импортёров

- Заблаговременно проверяйте актуальные требования к документации
- Убедитесь в наличии электронной подписи для декларирования
- Обратитесь к профессиональным таможенным брокерам для минимизации рисков

Компания ИННОВЭД готова помочь вам адаптироваться к новым требованиям.`,
      en: `A number of important changes to the customs legislation of the Russian Federation come into force in 2024.

## Main Changes

### 1. Electronic Declaration
Complete transition to electronic declaration for all categories of goods. Paper declarations are no longer accepted.

### 2. New Certification Requirements
The list of goods requiring mandatory certification upon import has been expanded.

### 3. Changes in Duty Rates
Import duty rates for a number of product categories have been revised within the EAEU.

## Recommendations for Importers

- Check the current documentation requirements in advance
- Ensure you have an electronic signature for declaration
- Contact professional customs brokers to minimize risks

INNOVED is ready to help you adapt to the new requirements.`
    }
  },
  {
    slug: 'import-from-china-guide',
    date: '2024-12-10',
    category: 'ved',
    title: {
      ru: 'Полное руководство по импорту товаров из Китая',
      en: 'Complete Guide to Importing Goods from China'
    },
    excerpt: {
      ru: 'Пошаговая инструкция по организации импорта товаров из Китая: от поиска поставщика до получения груза.',
      en: 'Step-by-step instructions for organizing imports from China: from finding a supplier to receiving cargo.'
    },
    content: {
      ru: `Импорт товаров из Китая — один из самых популярных направлений внешнеэкономической деятельности российских компаний.

## Этапы импорта

### 1. Поиск и проверка поставщика
- Используйте проверенные площадки: Alibaba, Made-in-China, Global Sources
- Проверьте репутацию поставщика, запросите образцы
- Заключите контракт с детальным описанием товара

### 2. Логистика
- Выберите способ доставки: морской, железнодорожный или авиа
- Морской транспорт — самый экономичный для крупных партий
- Время доставки: от 25 до 45 дней морем

### 3. Таможенное оформление
- Подготовьте все необходимые документы заранее
- Определите код ТН ВЭД для вашего товара
- Рассчитайте таможенные платежи

## Типичные ошибки

- Неправильная классификация товара
- Недостаточная проверка поставщика
- Отсутствие необходимых сертификатов

ИННОВЭД поможет организовать весь процесс импорта от А до Я.`,
      en: `Importing goods from China is one of the most popular areas of foreign economic activity for Russian companies.

## Import Stages

### 1. Finding and Verifying Suppliers
- Use trusted platforms: Alibaba, Made-in-China, Global Sources
- Check supplier reputation, request samples
- Sign a contract with detailed product description

### 2. Logistics
- Choose delivery method: sea, rail, or air
- Sea transport is most economical for large shipments
- Delivery time: 25 to 45 days by sea

### 3. Customs Clearance
- Prepare all necessary documents in advance
- Determine the HS code for your product
- Calculate customs payments

## Common Mistakes

- Incorrect product classification
- Insufficient supplier verification
- Lack of required certificates

INNOVED will help organize the entire import process from A to Z.`
    }
  },
  {
    slug: 'eaeu-certificates-guide',
    date: '2024-12-05',
    category: 'certification',
    title: {
      ru: 'Сертификация товаров для ЕАЭС: виды и требования',
      en: 'EAEU Product Certification: Types and Requirements'
    },
    excerpt: {
      ru: 'Разбираемся в видах сертификатов для ввоза товаров на территорию ЕАЭС и требованиях к их получению.',
      en: 'Understanding the types of certificates for importing goods into the EAEU and requirements for obtaining them.'
    },
    content: {
      ru: `Сертификация — обязательный этап для многих категорий товаров, ввозимых на территорию ЕАЭС.

## Виды сертификатов

### Сертификат соответствия ТР ТС
- Подтверждает соответствие техническим регламентам Таможенного союза
- Обязателен для товаров из перечня ТР ТС
- Срок действия: до 5 лет

### Декларация соответствия
- Упрощённая процедура подтверждения соответствия
- Ответственность несёт заявитель
- Подходит для менее рискованных товаров

### Свидетельство о государственной регистрации (СГР)
- Для товаров, контактирующих с пищевыми продуктами
- Для косметики, детских товаров
- Выдаётся бессрочно

## Процедура получения

1. Определение применимых регламентов
2. Сбор технической документации
3. Проведение испытаний в аккредитованной лаборатории
4. Получение сертификата

Доверьте сертификацию профессионалам ИННОВЭД!`,
      en: `Certification is a mandatory step for many categories of goods imported into the EAEU.

## Types of Certificates

### TR CU Conformity Certificate
- Confirms compliance with Technical Regulations of the Customs Union
- Mandatory for goods from the TR CU list
- Validity period: up to 5 years

### Declaration of Conformity
- Simplified conformity confirmation procedure
- Applicant bears responsibility
- Suitable for lower-risk goods

### State Registration Certificate (SGR)
- For goods in contact with food products
- For cosmetics, children's goods
- Issued indefinitely

## Obtaining Procedure

1. Determining applicable regulations
2. Collecting technical documentation
3. Testing in an accredited laboratory
4. Obtaining the certificate

Trust certification to INNOVED professionals!`
    }
  }
];

export const blogCategories = {
  customs: { ru: 'Таможенное оформление', en: 'Customs Clearance' },
  ved: { ru: 'ВЭД', en: 'Foreign Trade' },
  certification: { ru: 'Сертификация', en: 'Certification' },
  logistics: { ru: 'Логистика', en: 'Logistics' }
};
