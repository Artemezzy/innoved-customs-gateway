export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  title: { ru: string; en: string; zh: string };
  excerpt: { ru: string; en: string; zh: string };
  content: { ru: string; en: string; zh: string };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'customs-clearance-2024-changes',
    date: '2024-12-15',
    category: 'customs',
    title: {
      ru: 'Изменения в таможенном законодательстве 2024: что нужно знать',
      en: 'Customs Legislation Changes 2024: What You Need to Know',
      zh: '2024年海关法规变更：您需要了解的内容'
    },
    excerpt: {
      ru: 'Обзор ключевых изменений в таможенном законодательстве, вступающих в силу в 2024 году.',
      en: 'Overview of key changes in customs legislation coming into force in 2024.',
      zh: '2024年生效的海关法规主要变更概述。'
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

INNOVED is ready to help you adapt to the new requirements.`,
      zh: `2024年，俄罗斯联邦海关法规的一系列重要变更将生效。

## 主要变更

### 1. 电子申报
所有类别货物完全过渡到电子申报。不再接受纸质申报。

### 2. 新的认证要求
进口时需要强制认证的商品清单已扩大。

### 3. 关税税率变更
欧亚经济联盟框架内多个商品类别的进口关税税率已修订。

## 对进口商的建议

- 提前检查当前文件要求
- 确保您有用于申报的电子签名
- 联系专业海关代理以最大限度降低风险

INNOVED随时准备帮助您适应新要求。`
    }
  },
  {
    slug: 'import-from-china-guide',
    date: '2024-12-10',
    category: 'ved',
    title: {
      ru: 'Полное руководство по импорту товаров из Китая',
      en: 'Complete Guide to Importing Goods from China',
      zh: '从中国进口商品完整指南'
    },
    excerpt: {
      ru: 'Пошаговая инструкция по организации импорта товаров из Китая: от поиска поставщика до получения груза.',
      en: 'Step-by-step instructions for organizing imports from China: from finding a supplier to receiving cargo.',
      zh: '从中国组织进口的分步说明：从寻找供应商到接收货物。'
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

INNOVED will help organize the entire import process from A to Z.`,
      zh: `从中国进口商品是俄罗斯公司最受欢迎的对外经济活动领域之一。

## 进口阶段

### 1. 寻找和验证供应商
- 使用可信平台：阿里巴巴、中国制造、环球资源
- 检查供应商声誉，索取样品
- 签订包含详细产品描述的合同

### 2. 物流
- 选择运输方式：海运、铁路或空运
- 海运对大批量货物最经济
- 运输时间：海运25至45天

### 3. 清关
- 提前准备所有必要文件
- 确定产品的HS编码
- 计算关税

## 常见错误

- 产品分类错误
- 供应商验证不足
- 缺少必要证书

INNOVED将帮助组织从头到尾的整个进口流程。`
    }
  },
  {
    slug: 'eaeu-certificates-guide',
    date: '2024-12-05',
    category: 'certification',
    title: {
      ru: 'Сертификация товаров для ЕАЭС: виды и требования',
      en: 'EAEU Product Certification: Types and Requirements',
      zh: '欧亚经济联盟产品认证：类型和要求'
    },
    excerpt: {
      ru: 'Разбираемся в видах сертификатов для ввоза товаров на территорию ЕАЭС и требованиях к их получению.',
      en: 'Understanding the types of certificates for importing goods into the EAEU and requirements for obtaining them.',
      zh: '了解进口商品到欧亚经济联盟的证书类型及获取要求。'
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

Trust certification to INNOVED professionals!`,
      zh: `认证是进口到欧亚经济联盟的许多商品类别的强制性步骤。

## 证书类型

### TR CU合格证书
- 确认符合关税同盟技术法规
- TR CU清单中的商品必须持有
- 有效期：最长5年

### 合格声明
- 简化的合格确认程序
- 申请人承担责任
- 适用于低风险商品

### 国家注册证书（SGR）
- 用于与食品接触的商品
- 用于化妆品、儿童用品
- 无期限签发

## 获取程序

1. 确定适用法规
2. 收集技术文件
3. 在认可实验室进行测试
4. 获得证书

将认证交给INNOVED专业人员！`
    }
  }
];

export const blogCategories = {
  customs: { ru: 'Таможенное оформление', en: 'Customs Clearance', zh: '海关清关' },
  ved: { ru: 'ВЭД', en: 'Foreign Trade', zh: '对外贸易' },
  certification: { ru: 'Сертификация', en: 'Certification', zh: '认证' },
  logistics: { ru: 'Логистика', en: 'Logistics', zh: '物流' }
};
