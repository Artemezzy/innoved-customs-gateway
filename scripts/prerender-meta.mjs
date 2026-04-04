/**
 * Post-build script: generates static HTML files for each route
 * with correct <title>, <meta>, <link rel="canonical">, OG and Twitter tags,
 * prerendered H1/H2/H3 headings AND crawlable nav links inside <div id="root">
 * for SEO crawlers that don't execute JavaScript.
 */

import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://www.innovedbroker.ru';
const DIST = path.resolve('dist');

// ── Shared link sets ──

const COMMON_LINKS = [
  { href: '/', text: 'Главная' },
  { href: '/services', text: 'Услуги' },
  { href: '/contact', text: 'Контакты' },
  { href: '/about', text: 'О компании' },
];

const ALL_SERVICES = [
  { href: '/services/import', text: 'Таможенное оформление импорта' },
  { href: '/services/export', text: 'Таможенное оформление экспорта' },
  { href: '/services/certification', text: 'Сертификация' },
  { href: '/services/hs-code', text: 'Код ТН ВЭД' },
  { href: '/services/customs-letters', text: 'Письма в таможню' },
  { href: '/services/ved-consulting', text: 'ВЭД-консалтинг' },
  { href: '/services/inspection', text: 'Досмотр товаров' },
  { href: '/services/translation', text: 'Перевод документов' },
  { href: '/services/rastamozhka-tovarov', text: 'Растаможка товаров' },
  { href: '/services/rastamozhka-gruzov', text: 'Растаможка грузов' },
  { href: '/services/tamozhennaya-ochistka', text: 'Таможенная очистка' },
];

const ALL_CASES = [
  { href: '/rastamojka-tehniki', text: 'Растаможка техники' },
  { href: '/rastamojka-zapchastey', text: 'Растаможка запчастей' },
  { href: '/rastamojka-odejdi', text: 'Растаможка одежды' },
  { href: '/rastamojka-oborudovaniya', text: 'Растаможка оборудования' },
];

const SECTION_LINKS = [
  { href: '/how-we-work', text: 'Как мы работаем' },
  { href: '/blog', text: 'Блог' },
  { href: '/faq', text: 'FAQ' },
  { href: '/news', text: 'Новости' },
  { href: '/tamozhennyj-broker', text: 'География' },
];

const cities = [
  { slug: 'barnaul', name: 'Барнаул' },
  { slug: 'vladivostok', name: 'Владивосток' },
  { slug: 'volgograd', name: 'Волгоград' },
  { slug: 'voronezh', name: 'Воронеж' },
  { slug: 'ekaterinburg', name: 'Екатеринбург' },
  { slug: 'izhevsk', name: 'Ижевск' },
  { slug: 'irkutsk', name: 'Иркутск' },
  { slug: 'kazan', name: 'Казань' },
  { slug: 'krasnodar', name: 'Краснодар' },
  { slug: 'krasnoyarsk', name: 'Красноярск' },
  { slug: 'makhachkala', name: 'Махачкала' },
  { slug: 'moskva', name: 'Москва' },
  { slug: 'nakhodka', name: 'Находка' },
  { slug: 'nizhny-novgorod', name: 'Нижний Новгород' },
  { slug: 'novorossiysk', name: 'Новороссийск' },
  { slug: 'novosibirsk', name: 'Новосибирск' },
  { slug: 'omsk', name: 'Омск' },
  { slug: 'rostov-na-donu', name: 'Ростов‑на‑Дону' },
  { slug: 'samara', name: 'Самара' },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург' },
  { slug: 'saratov', name: 'Саратов' },
  { slug: 'tolyatti', name: 'Тольятти' },
  { slug: 'tyumen', name: 'Тюмень' },
  { slug: 'ulyanovsk', name: 'Ульяновск' },
  { slug: 'khabarovsk', name: 'Хабаровск' },
  { slug: 'chelyabinsk', name: 'Челябинск' },
  { slug: 'yaroslavl', name: 'Ярославль' },
  { slug: 'zabaykalsk', name: 'Забайкальск' },
];

const ALL_CITY_LINKS = cities.map(c => ({
  href: `/tamozhennyj-broker/${c.slug}`,
  text: `Таможенный брокер ${c.name}`,
}));

// ── Helper: get neighbor city links (5 before/after in the list) ──
function getNeighborCityLinks(slug) {
  const idx = cities.findIndex(c => c.slug === slug);
  const neighbors = [];
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    const ni = idx + i;
    if (ni >= 0 && ni < cities.length) {
      neighbors.push({
        href: `/tamozhennyj-broker/${cities[ni].slug}`,
        text: `Таможенный брокер ${cities[ni].name}`,
      });
    }
  }
  return neighbors;
}

// ── Default links for generic pages ──
const DEFAULT_LINKS = [...COMMON_LINKS, { href: '/faq', text: 'FAQ' }, { href: '/blog', text: 'Блог' }];

// ── Page definitions ──

const pages = [
  {
    path: '/',
    title: 'Таможенный брокер "ИННОВЭД". Оказываем услуги таможенного оформления в Москве и по всей России',
    description: 'Услуги таможенного брокера, таможенное оформление товаров, растаможка грузов, таможенное оформление импорта, таможенное оформление экспорта, таможенный брокер из китая',
    keywords: 'таможенное оформление, таможенный брокер, импорт, экспорт, россия, customs clearance, broker, белый импорт, растаможка грузов, декларирование товаров, сертификация товаров, ВЭД, консалтинг, таможенный транзит',
    h1: 'ТАМОЖЕННОЕ ОФОРМЛЕНИЕ И СЕРТИФИКАЦИЯ',
    h2: 'Услуги таможенного брокера и таможенное оформление',
    h3: 'Кейсы таможенного оформления и логистики',
    links: [...COMMON_LINKS, ...SECTION_LINKS, ...ALL_SERVICES, ...ALL_CASES],
  },
  {
    path: '/about',
    title: 'О компании ИННОВЭД | Таможенный брокер с опытом более 10 лет в России',
    description: 'Компания ИННОВЭД — надёжный таможенный брокер с опытом более 10 лет. Профессиональная команда, прозрачные условия, работа по всей России.',
    keywords: 'о компании, инновэд, таможенный брокер москва, команда специалистов, опыт ВЭД, растаможка, декларирование',
    h1: 'О компании ИННОВЭД',
    h2: 'О компании и команде таможенного брокера ИННОВЭД',
    links: DEFAULT_LINKS,
  },
  {
    path: '/services',
    title: 'Услуги таможенного брокера, таможенное оформление',
    description: 'Все виды таможенных услуг от компании "ИННОВЭД"',
    keywords: 'таможенные услуги, импорт, экспорт, сертификация, классификация ТН ВЭД, ВЭД услуги, растаможка, декларирование, консалтинг, ИННОВЭД',
    h1: 'Наши услуги',
    h2: 'Услуги таможенного брокера для импорта и экспорта',
    links: [...COMMON_LINKS, ...ALL_SERVICES],
  },
  {
    path: '/how-we-work',
    title: 'Как мы работаем | Прозрачный процесс таможенного оформления | ИННОВЭД',
    description: 'Пошаговый процесс таможенного оформления с ИННОВЭД: от заявки до получения груза. Чёткие сроки, прозрачные условия, гарантия результата.',
    keywords: 'процесс оформления, этапы работы, сроки таможенного оформления, как оформить груз, растаможка пошагово',
    h1: 'Как мы работаем',
    links: DEFAULT_LINKS,
  },
  {
    path: '/contact',
    title: 'Контакты ИННОВЭД | Заказать таможенное оформление | Консультация',
    description: 'Свяжитесь с ИННОВЭД для консультации по таможенному оформлению и растаможке грузов. Телефон, email, Telegram. Ответим в течение 15 минут.',
    keywords: 'контакты инновэд, таможенный брокер телефон, заказать оформление, консультация ВЭД, растаможка заявка',
    h1: 'Контакты',
    h2: 'Контакты таможенного брокера и форма заявки',
    links: DEFAULT_LINKS,
  },
  {
    path: '/blog',
    title: 'Блог ИННОВЭД | Статьи о таможенном оформлении, ВЭД и растаможке',
    description: 'Полезные статьи о таможенном оформлении, изменениях в законодательстве ВЭД, советы по импорту, экспорту и сертификации от экспертов ИННОВЭД.',
    keywords: 'блог инновэд, статьи таможня, законодательство ВЭД, советы импорт экспорт, растаможка, декларирование',
    h1: 'Блог',
    h2: 'Статьи о таможенном оформлении и ВЭД',
    links: DEFAULT_LINKS,
  },
  {
    path: '/faq',
    title: 'Часто задаваемые вопросы о таможенном оформлении | ИННОВЭД',
    description: 'Ответы на популярные вопросы о таможенном оформлении и растаможке: сроки, стоимость, документы, порядок работы с ИННОВЭД.',
    keywords: 'FAQ таможня, вопросы ответы, сколько стоит оформление, какие документы нужны, растаможка FAQ, ВЭД вопросы',
    h1: 'Часто задаваемые вопросы',
    h2: 'Частые вопросы по таможенному оформлению',
    links: DEFAULT_LINKS,
  },
  {
    path: '/privacy',
    title: 'Политика конфиденциальности - ИННОВЭД',
    description: 'Политика конфиденциальности компании ИННОВЭД по обработке персональных данных',
    keywords: 'политика конфиденциальности, персональные данные, ИННОВЭД',
    h1: 'Политика конфиденциальности',
    links: DEFAULT_LINKS,
  },
  {
    path: '/terms',
    title: 'Пользовательское соглашение - ИННОВЭД',
    description: 'Пользовательское соглашение компании ИННОВЭД об использовании сайта',
    keywords: 'пользовательское соглашение, условия использования, ИННОВЭД',
    h1: 'Пользовательское соглашение',
    links: DEFAULT_LINKS,
  },
  {
    path: '/news',
    title: 'Новости ИННОВЭД | Новости таможенной отрасли',
    description: 'Новости компании ИННОВЭД и таможенной отрасли. Актуальная информация о таможенном оформлении.',
    keywords: 'новости инновэд, новости таможня, таможенное оформление новости',
    h1: 'Новости',
    h2: 'Новости компании и таможенной отрасли',
    links: DEFAULT_LINKS,
  },
  // Geography main page
  {
    path: '/tamozhennyj-broker',
    title: 'Таможенный брокер по всей России | География услуг ИННОВЭД',
    description: 'Услуги таможенного брокера в 28 городах России. Москва, Санкт-Петербург, Владивосток, Новосибирск и другие регионы.',
    keywords: 'таможенный брокер россия, география услуг, таможенное оформление регионы, растаможка города',
    h1: 'Таможенный брокер',
    h2: 'Города, где доступны услуги таможенного брокера',
    links: [...COMMON_LINKS, ...ALL_CITY_LINKS],
  },
  // Case studies
  {
    path: '/rastamojka-tehniki',
    title: 'Растаможка техники | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление бытовой техники. Перевод клиента из режима блокировок в стабильные поставки без остановок.',
    keywords: 'растаможка техники, таможенное оформление техники, белый импорт электроприборов, кейс ИННОВЭД',
    h1: 'Растаможка техники',
    h2: 'Как проходит таможенное оформление: этапы, документы и результат',
    h3: 'Практические детали кейса и особенности оформления',
    links: [...COMMON_LINKS, ...ALL_CASES.filter(c => c.href !== '/rastamojka-tehniki'), { href: '/services', text: 'Услуги' }],
  },
  {
    path: '/rastamojka-zapchastey',
    title: 'Растаможка запчастей | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление автозапчастей. Оптимизация логистики и снижение таможенных платежей.',
    keywords: 'растаможка запчастей, таможенное оформление автозапчастей, импорт запчастей, кейс ИННОВЭД',
    h1: 'Растаможка запчастей',
    h2: 'Как проходит таможенное оформление: этапы, документы и результат',
    h3: 'Практические детали кейса и особенности оформления',
    links: [...COMMON_LINKS, ...ALL_CASES.filter(c => c.href !== '/rastamojka-zapchastey'), { href: '/services', text: 'Услуги' }],
  },
  {
    path: '/rastamojka-odejdi',
    title: 'Растаможка одежды | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление одежды и текстиля. Сертификация, маркировка и белый импорт.',
    keywords: 'растаможка одежды, таможенное оформление одежды, импорт текстиля, кейс ИННОВЭД',
    h1: 'Растаможка одежды',
    h2: 'Как проходит таможенное оформление: этапы, документы и результат',
    h3: 'Практические детали кейса и особенности оформления',
    links: [...COMMON_LINKS, ...ALL_CASES.filter(c => c.href !== '/rastamojka-odejdi'), { href: '/services', text: 'Услуги' }],
  },
  {
    path: '/rastamojka-oborudovaniya',
    title: 'Растаможка оборудования | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление промышленного оборудования. Сокращение сроков оформления с 10-14 до 1-2 дней.',
    keywords: 'растаможка оборудования, таможенное оформление станков, импорт оборудования, кейс ИННОВЭД',
    h1: 'Растаможка оборудования',
    h2: 'Как проходит таможенное оформление: этапы, документы и результат',
    h3: 'Практические детали кейса и особенности оформления',
    links: [...COMMON_LINKS, ...ALL_CASES.filter(c => c.href !== '/rastamojka-oborudovaniya'), { href: '/services', text: 'Услуги' }],
  },
  // Service detail pages
  ...generateServicePages(),
  // City pages
  ...generateCityPages(),
];

function generateServicePages() {
  const services = [
    { slug: 'import', name: 'Таможенное оформление импорта', desc: 'Услуги по таможенному оформление импорта. Официальный импорт грузов. Официальный импорт товаров. Растаможка товаров из Китая. Белый импорт.', kw: 'таможенное оформление импорта, импорт в россию, таможенный брокер, электронное декларирование, ВЭД, растаможка товаров, ИННОВЭД' },
    { slug: 'export', name: 'Таможенное оформление экспорта', desc: 'Экспортное таможенное оформление грузов и товаров. Подготовка документов, декларирование, валютный контроль. Быстро и без ошибок.', kw: 'таможенное оформление экспорта, экспорт из россии, декларирование экспорта, таможенный брокер, ВЭД, ИННОВЭД' },
    { slug: 'certification', name: 'Сертификация и декларация соответствия', desc: 'Оформление сертификатов и деклараций соответствия для импортируемых товаров. Быстро, официально, под ключ.', kw: 'сертификация товаров, декларация соответствия, сертификат ТР ТС, таможенный брокер, ИННОВЭД' },
    { slug: 'hs-code', name: 'Определение кода ТН ВЭД', desc: 'Профессиональный подбор кодов ТН ВЭД ЕАЭС. Минимизация рисков, оптимизация пошлин, предварительные решения.', kw: 'код ТН ВЭД, классификация товаров, таможенный тариф, ЕАЭС, таможенный брокер, ИННОВЭД' },
    { slug: 'customs-letters', name: 'Подготовка писем в таможенные органы', desc: 'Подготовка официальных писем и обращений в таможенные органы. Обжалование решений, разъяснения, запросы.', kw: 'письма в таможню, обращение в таможенные органы, обжалование решений, таможенный брокер, ИННОВЭД' },
    { slug: 'ved-consulting', name: 'ВЭД-консалтинг', desc: 'Консультации по внешнеэкономической деятельности. Оптимизация ВЭД-процессов, анализ рисков, сопровождение сделок.', kw: 'ВЭД консалтинг, консультации ВЭД, внешнеэкономическая деятельность, таможенный брокер, ИННОВЭД' },
    { slug: 'inspection', name: 'Организация досмотра товаров', desc: 'Организация и сопровождение таможенного досмотра товаров. Подготовка к проверке, присутствие при досмотре.', kw: 'таможенный досмотр, организация досмотра, проверка товаров, таможенный брокер, ИННОВЭД' },
    { slug: 'translation', name: 'Перевод документов', desc: 'Профессиональный перевод документов для таможенного оформления. Китайский, английский, немецкий и другие языки.', kw: 'перевод документов, перевод для таможни, нотариальный перевод, таможенный брокер, ИННОВЭД' },
    { slug: 'rastamozhka-tovarov', name: 'Растаможка товаров', desc: 'Полный цикл растаможки товаров из любой страны. Электронное декларирование, расчёт платежей, выпуск груза.', kw: 'растаможка товаров, таможенное оформление, декларирование, таможенный брокер, ИННОВЭД' },
    { slug: 'rastamozhka-gruzov', name: 'Растаможка грузов', desc: 'Растаможка грузов любой сложности. Контейнерные, сборные, негабаритные грузы. Быстрое оформление.', kw: 'растаможка грузов, таможенное оформление грузов, контейнерные грузы, таможенный брокер, ИННОВЭД' },
    { slug: 'tamozhennaya-ochistka', name: 'Таможенная очистка', desc: 'Услуги таможенной очистки товаров и грузов. Полное сопровождение от подачи декларации до выпуска.', kw: 'таможенная очистка, customs clearance, таможенное оформление, таможенный брокер, ИННОВЭД' },
  ];

  return services.map(s => ({
    path: `/services/${s.slug}`,
    title: s.name,
    description: s.desc,
    keywords: s.kw,
    h1: s.name,
    h2: `${s.name}: этапы, преимущества и смежные услуги`,
    h3: 'Преимущества работы с ИННОВЭД и этапы оказания услуги',
    links: [
      ...COMMON_LINKS,
      ...ALL_SERVICES.filter(sv => sv.href !== `/services/${s.slug}`),
    ],
  }));
}

function generateCityPages() {
  return cities.map(city => ({
    path: `/tamozhennyj-broker/${city.slug}`,
    title: `Таможенный брокер ${city.name} | ИННОВЭД`,
    description: `Услуги таможенного брокера в городе ${city.name}. Таможенное оформление импорта и экспорта, растаможка грузов, сертификация. ИННОВЭД.`,
    keywords: `таможенный брокер ${city.name}, растаможка ${city.name}, таможенное оформление ${city.name}, ИННОВЭД`,
    h1: `Таможенный брокер ${city.name}`,
    h2: `Услуги таможенного брокера в ${city.name}: логистика, оформление и сопровождение`,
    h3: `Преимущества работы в ${city.name} и этапы сопровождения ВЭД`,
    links: [
      ...COMMON_LINKS,
      { href: '/tamozhennyj-broker', text: 'География услуг' },
      ...getNeighborCityLinks(city.slug),
    ],
  }));
}

// ── Build helpers ──

function buildPrerenderedContent(page) {
  if (!page.h1) return '';
  const parts = [];
  parts.push(`<h1>${page.h1}</h1>`);
  if (page.h2) parts.push(`<h2>${page.h2}</h2>`);
  if (page.h3) parts.push(`<h3>${page.h3}</h3>`);

  if (page.links && page.links.length > 0) {
    const linkTags = page.links.map(l => `<a href="${l.href}">${l.text}</a>`).join('');
    parts.push(`<nav>${linkTags}</nav>`);
  }

  return parts.join('');
}

function processHtml(templateHtml, page) {
  let html = templateHtml;
  const canonicalUrl = `${DOMAIN}${page.path === '/' ? '' : page.path}`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${page.description}"`);
  html = html.replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${page.keywords}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`);
  html = html.replace(/<link rel="alternate" hreflang="ru" href="[^"]*"/, `<link rel="alternate" hreflang="ru" href="${canonicalUrl}"`);
  html = html.replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"/, `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${page.title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${page.description}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${page.title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${page.description}"`);

  const contentHtml = buildPrerenderedContent(page);
  if (contentHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${contentHtml}</div>`);
  }

  return html;
}

// ── Main ──

const templateHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

let created = 0;
for (const page of pages) {
  const html = processHtml(templateHtml, page);

  if (page.path === '/') {
    fs.writeFileSync(path.join(DIST, 'index.html'), html);
  } else {
    const dir = path.join(DIST, page.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  created++;
}

console.log(`✅ Prerendered meta + headings + nav links for ${created} pages`);
