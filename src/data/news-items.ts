export interface NewsItem {
  slug: string;
  date: string;
  title: { ru: string; en: string; zh: string };
  excerpt: { ru: string; en: string; zh: string };
  content: { ru: string; en: string; zh: string };
}

export const newsItems: NewsItem[] = [
  {
    slug: 'office-expansion-2024',
    date: '2024-12-12',
    title: {
      ru: 'ИННОВЭД расширяет географию присутствия',
      en: 'INNOVED Expands Geographic Presence',
      zh: 'INNOVED扩大地理覆盖范围'
    },
    excerpt: {
      ru: 'Открытие нового представительства в Владивостоке для улучшения обслуживания клиентов на Дальнем Востоке.',
      en: 'Opening a new representative office in Vladivostok to improve customer service in the Far East.',
      zh: '在符拉迪沃斯托克开设新代表处，以改善远东地区的客户服务。'
    },
    content: {
      ru: `Компания ИННОВЭД рада объявить об открытии нового представительства во Владивостоке!

## Почему Владивосток?

Дальний Восток России — стратегически важный регион для внешнеэкономической деятельности, особенно в торговле со странами Азии. Открытие офиса во Владивостоке позволит нам:

- Сократить время обработки заявок для клиентов из региона
- Обеспечить личное присутствие на ключевых таможенных постах
- Расширить партнёрскую сеть с азиатскими компаниями

## Новые возможности для клиентов

Теперь наши клиенты на Дальнем Востоке получат:
- Круглосуточную поддержку в местном часовом поясе
- Ускоренное оформление грузов из Китая, Кореи и Японии
- Личные консультации в офисе

Мы продолжаем развиваться, чтобы предоставлять лучший сервис нашим клиентам по всей России!`,
      en: `INNOVED is pleased to announce the opening of a new representative office in Vladivostok!

## Why Vladivostok?

The Russian Far East is a strategically important region for foreign economic activity, especially in trade with Asian countries. Opening an office in Vladivostok will allow us to:

- Reduce processing time for clients from the region
- Ensure personal presence at key customs posts
- Expand partnership network with Asian companies

## New Opportunities for Clients

Now our Far East clients will receive:
- 24/7 support in the local time zone
- Accelerated clearance of cargo from China, Korea, and Japan
- Personal consultations at the office

We continue to grow to provide the best service to our clients across Russia!`,
      zh: `INNOVED很高兴宣布在符拉迪沃斯托克开设新代表处！

## 为什么选择符拉迪沃斯托克？

俄罗斯远东地区是对外经济活动的战略重要区域，特别是在与亚洲国家的贸易中。在符拉迪沃斯托克开设办事处将使我们能够：

- 缩短该地区客户的处理时间
- 确保在关键海关哨所的亲身存在
- 扩大与亚洲公司的合作网络

## 客户的新机会

现在我们的远东客户将获得：
- 当地时区的全天候支持
- 来自中国、韩国和日本货物的加速清关
- 办公室的个人咨询

我们继续发展，为全俄罗斯的客户提供最好的服务！`
    }
  },
  {
    slug: 'partnership-with-logistics',
    date: '2024-12-01',
    title: {
      ru: 'Новое партнёрство с логистической компанией',
      en: 'New Partnership with Logistics Company',
      zh: '与物流公司建立新合作伙伴关系'
    },
    excerpt: {
      ru: 'ИННОВЭД заключил стратегическое партнёрство для комплексного обслуживания клиентов.',
      en: 'INNOVED has entered into a strategic partnership for comprehensive customer service.',
      zh: 'INNOVED已达成战略合作伙伴关系，提供综合客户服务。'
    },
    content: {
      ru: `Мы рады сообщить о заключении стратегического партнёрства с ведущей логистической компанией!

## Преимущества для наших клиентов

Благодаря этому партнёрству мы теперь можем предложить:

### Комплексный сервис
- Таможенное оформление + доставка «под ключ»
- Единый договор на все услуги
- Один менеджер для решения всех вопросов

### Выгодные условия
- Специальные тарифы на перевозку для наших клиентов
- Приоритетная обработка грузов
- Расширенное страхование грузов

### Гибкость
- Мультимодальные перевозки
- Складское хранение
- Консолидация грузов

Обращайтесь к нам для получения комплексного решения по доставке и оформлению вашего груза!`,
      en: `We are pleased to announce a strategic partnership with a leading logistics company!

## Benefits for Our Clients

Thanks to this partnership, we can now offer:

### Comprehensive Service
- Customs clearance + turnkey delivery
- Single contract for all services
- One manager to solve all issues

### Favorable Terms
- Special transportation rates for our clients
- Priority cargo processing
- Extended cargo insurance

### Flexibility
- Multimodal transportation
- Warehouse storage
- Cargo consolidation

Contact us for a comprehensive solution for delivery and clearance of your cargo!`,
      zh: `我们很高兴宣布与领先的物流公司达成战略合作伙伴关系！

## 客户优势

通过此合作，我们现在可以提供：

### 综合服务
- 清关 + 交钥匙交付
- 所有服务的单一合同
- 一位经理解决所有问题

### 优惠条件
- 为我们的客户提供特别运输费率
- 优先处理货物
- 扩展货物保险

### 灵活性
- 多式联运
- 仓储
- 货物拼装

联系我们获取货物交付和清关的综合解决方案！`
    }
  },
  {
    slug: 'team-growth',
    date: '2024-11-20',
    title: {
      ru: 'Команда ИННОВЭД продолжает расти',
      en: 'INNOVED Team Continues to Grow',
      zh: 'INNOVED团队持续壮大'
    },
    excerpt: {
      ru: 'В нашу команду присоединились новые специалисты по таможенному оформлению.',
      en: 'New customs clearance specialists have joined our team.',
      zh: '新的清关专家加入了我们的团队。'
    },
    content: {
      ru: `Мы рады приветствовать новых членов команды ИННОВЭД!

## Укрепление экспертизы

В этом месяце к нам присоединились три опытных специалиста:

- **Специалист по ВЭД с Китаем** — 8 лет опыта работы с китайскими поставщиками
- **Эксперт по сертификации** — знание всех технических регламентов ЕАЭС
- **Специалист по транспортной логистике** — оптимизация маршрутов и снижение затрат

## Что это значит для клиентов?

- Ещё более быстрая обработка заявок
- Расширенная экспертиза в специфических направлениях
- Больше возможностей для комплексного обслуживания

Добро пожаловать в команду!`,
      en: `We are pleased to welcome new members to the INNOVED team!

## Strengthening Expertise

This month, three experienced specialists joined us:

- **China Trade Specialist** — 8 years of experience working with Chinese suppliers
- **Certification Expert** — knowledge of all EAEU technical regulations
- **Transport Logistics Specialist** — route optimization and cost reduction

## What Does This Mean for Clients?

- Even faster application processing
- Expanded expertise in specific areas
- More opportunities for comprehensive service

Welcome to the team!`,
      zh: `我们很高兴欢迎新成员加入INNOVED团队！

## 加强专业知识

本月，三位经验丰富的专家加入了我们：

- **中国贸易专家** — 8年与中国供应商合作经验
- **认证专家** — 了解所有欧亚经济联盟技术法规
- **运输物流专家** — 路线优化和成本降低

## 这对客户意味着什么？

- 更快的申请处理
- 特定领域的扩展专业知识
- 更多综合服务机会

欢迎加入团队！`
    }
  }
];
