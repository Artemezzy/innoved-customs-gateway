/**
 * Post-build script: generates static HTML files for each route
 * with correct <title>, <meta>, <link rel="canonical">, OG and Twitter tags.
 * This ensures search engine bots (especially Yandex) see correct meta
 * without needing to execute JavaScript.
 */

import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://www.innovedbroker.ru';
const DIST = path.resolve('dist');

// All static page SEO data (Russian only — primary language for indexing)
const pages = [
  {
    path: '/',
    title: 'Таможенный брокер "ИННОВЭД". Оказываем услуги таможенного оформления в Москве и по всей России',
    description: 'Услуги таможенного брокера, таможенное оформление товаров, растаможка грузов, таможенное оформление импорта, таможенное оформление экспорта, таможенный брокер из китая',
    keywords: 'таможенное оформление, таможенный брокер, импорт, экспорт, россия, customs clearance, broker, белый импорт, растаможка грузов, декларирование товаров, сертификация товаров, ВЭД, консалтинг, таможенный транзит',
  },
  {
    path: '/about',
    title: 'О компании ИННОВЭД | Таможенный брокер с опытом более 10 лет в России',
    description: 'Компания ИННОВЭД — надёжный таможенный брокер с опытом более 10 лет. Профессиональная команда, прозрачные условия, работа по всей России.',
    keywords: 'о компании, инновэд, таможенный брокер москва, команда специалистов, опыт ВЭД, растаможка, декларирование',
  },
  {
    path: '/services',
    title: 'Услуги таможенного брокера, таможенное оформление',
    description: 'Все виды таможенных услуг от компании "ИННОВЭД"',
    keywords: 'таможенные услуги, импорт, экспорт, сертификация, классификация ТН ВЭД, ВЭД услуги, растаможка, декларирование, консалтинг, ИННОВЭД',
  },
  {
    path: '/how-we-work',
    title: 'Как мы работаем | Прозрачный процесс таможенного оформления | ИННОВЭД',
    description: 'Пошаговый процесс таможенного оформления с ИННОВЭД: от заявки до получения груза. Чёткие сроки, прозрачные условия, гарантия результата.',
    keywords: 'процесс оформления, этапы работы, сроки таможенного оформления, как оформить груз, растаможка пошагово',
  },
  {
    path: '/contact',
    title: 'Контакты ИННОВЭД | Заказать таможенное оформление | Консультация',
    description: 'Свяжитесь с ИННОВЭД для консультации по таможенному оформлению и растаможке грузов. Телефон, email, Telegram. Ответим в течение 15 минут.',
    keywords: 'контакты инновэд, таможенный брокер телефон, заказать оформление, консультация ВЭД, растаможка заявка',
  },
  {
    path: '/blog',
    title: 'Блог ИННОВЭД | Статьи о таможенном оформлении, ВЭД и растаможке',
    description: 'Полезные статьи о таможенном оформлении, изменениях в законодательстве ВЭД, советы по импорту, экспорту и сертификации от экспертов ИННОВЭД.',
    keywords: 'блог инновэд, статьи таможня, законодательство ВЭД, советы импорт экспорт, растаможка, декларирование',
  },
  {
    path: '/faq',
    title: 'Часто задаваемые вопросы о таможенном оформлении | ИННОВЭД',
    description: 'Ответы на популярные вопросы о таможенном оформлении и растаможке: сроки, стоимость, документы, порядок работы с ИННОВЭД.',
    keywords: 'FAQ таможня, вопросы ответы, сколько стоит оформление, какие документы нужны, растаможка FAQ, ВЭД вопросы',
  },
  {
    path: '/privacy',
    title: 'Политика конфиденциальности - ИННОВЭД',
    description: 'Политика конфиденциальности компании ИННОВЭД по обработке персональных данных',
    keywords: 'политика конфиденциальности, персональные данные, ИННОВЭД',
  },
  {
    path: '/terms',
    title: 'Пользовательское соглашение - ИННОВЭД',
    description: 'Пользовательское соглашение компании ИННОВЭД об использовании сайта',
    keywords: 'пользовательское соглашение, условия использования, ИННОВЭД',
  },
  // Geography main page
  {
    path: '/tamozhennyj-broker',
    title: 'Таможенный брокер по всей России | География услуг ИННОВЭД',
    description: 'Услуги таможенного брокера в 28 городах России. Москва, Санкт-Петербург, Владивосток, Новосибирск и другие регионы.',
    keywords: 'таможенный брокер россия, география услуг, таможенное оформление регионы, растаможка города',
  },
  // Case studies
  {
    path: '/rastamojka-tehniki',
    title: 'Растаможка техники | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление бытовой техники. Перевод клиента из режима блокировок в стабильные поставки без остановок.',
    keywords: 'растаможка техники, таможенное оформление техники, белый импорт электроприборов, кейс ИННОВЭД',
  },
  {
    path: '/rastamojka-zapchastey',
    title: 'Растаможка запчастей | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление автозапчастей. Оптимизация логистики и снижение таможенных платежей.',
    keywords: 'растаможка запчастей, таможенное оформление автозапчастей, импорт запчастей, кейс ИННОВЭД',
  },
  {
    path: '/rastamojka-odejdi',
    title: 'Растаможка одежды | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление одежды и текстиля. Сертификация, маркировка и белый импорт.',
    keywords: 'растаможка одежды, таможенное оформление одежды, импорт текстиля, кейс ИННОВЭД',
  },
  {
    path: '/rastamojka-oborudovaniya',
    title: 'Растаможка оборудования | Кейс ИННОВЭД',
    description: 'Кейс: таможенное оформление промышленного оборудования. Сокращение сроков оформления с 10-14 до 1-2 дней.',
    keywords: 'растаможка оборудования, таможенное оформление станков, импорт оборудования, кейс ИННОВЭД',
  },
  // Service detail pages
  {
    path: '/services/import',
    title: 'Таможенное оформление импорта',
    description: 'Услуги по таможенному оформление импорта. Официальный импорт грузов. Официальный импорт товаров. Растаможка товаров из Китая. Белый импорт.',
    keywords: 'таможенное оформление импорта, импорт в россию, таможенный брокер, электронное декларирование, ВЭД, растаможка товаров, ИННОВЭД',
  },
  {
    path: '/services/export',
    title: 'Таможенное оформление экспорта',
    description: 'Экспортное таможенное оформление грузов и товаров. Подготовка документов, декларирование, валютный контроль. Быстро и без ошибок.',
    keywords: 'таможенное оформление экспорта, экспорт из россии, декларирование экспорта, таможенный брокер, ВЭД, ИННОВЭД',
  },
  {
    path: '/services/certification',
    title: 'Сертификация и декларация соответствия',
    description: 'Оформление сертификатов и деклараций соответствия для импортируемых товаров. Быстро, официально, под ключ.',
    keywords: 'сертификация товаров, декларация соответствия, сертификат ТР ТС, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/hs-code',
    title: 'Определение кода ТН ВЭД',
    description: 'Профессиональный подбор кодов ТН ВЭД ЕАЭС. Минимизация рисков, оптимизация пошлин, предварительные решения.',
    keywords: 'код ТН ВЭД, классификация товаров, таможенный тариф, ЕАЭС, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/customs-letters',
    title: 'Подготовка писем в таможенные органы',
    description: 'Подготовка официальных писем и обращений в таможенные органы. Обжалование решений, разъяснения, запросы.',
    keywords: 'письма в таможню, обращение в таможенные органы, обжалование решений, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/ved-consulting',
    title: 'ВЭД-консалтинг',
    description: 'Консультации по внешнеэкономической деятельности. Оптимизация ВЭД-процессов, анализ рисков, сопровождение сделок.',
    keywords: 'ВЭД консалтинг, консультации ВЭД, внешнеэкономическая деятельность, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/inspection',
    title: 'Организация досмотра товаров',
    description: 'Организация и сопровождение таможенного досмотра товаров. Подготовка к проверке, присутствие при досмотре.',
    keywords: 'таможенный досмотр, организация досмотра, проверка товаров, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/translation',
    title: 'Перевод документов',
    description: 'Профессиональный перевод документов для таможенного оформления. Китайский, английский, немецкий и другие языки.',
    keywords: 'перевод документов, перевод для таможни, нотариальный перевод, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/rastamozhka-tovarov',
    title: 'Растаможка товаров',
    description: 'Полный цикл растаможки товаров из любой страны. Электронное декларирование, расчёт платежей, выпуск груза.',
    keywords: 'растаможка товаров, таможенное оформление, декларирование, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/rastamozhka-gruzov',
    title: 'Растаможка грузов',
    description: 'Растаможка грузов любой сложности. Контейнерные, сборные, негабаритные грузы. Быстрое оформление.',
    keywords: 'растаможка грузов, таможенное оформление грузов, контейнерные грузы, таможенный брокер, ИННОВЭД',
  },
  {
    path: '/services/tamozhennaya-ochistka',
    title: 'Таможенная очистка',
    description: 'Услуги таможенной очистки товаров и грузов. Полное сопровождение от подачи декларации до выпуска.',
    keywords: 'таможенная очистка, customs clearance, таможенное оформление, таможенный брокер, ИННОВЭД',
  },
  // City pages
  ...generateCityPages(),
];

function generateCityPages() {
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

  return cities.map(city => ({
    path: `/tamozhennyj-broker/${city.slug}`,
    title: `Таможенный брокер ${city.name} | ИННОВЭД`,
    description: `Услуги таможенного брокера в городе ${city.name}. Таможенное оформление импорта и экспорта, растаможка грузов, сертификация. ИННОВЭД.`,
    keywords: `таможенный брокер ${city.name}, растаможка ${city.name}, таможенное оформление ${city.name}, ИННОВЭД`,
  }));
}

function processHtml(templateHtml, page) {
  let html = templateHtml;
  const canonicalUrl = `${DOMAIN}${page.path === '/' ? '' : page.path}`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${page.description}"`
  );

  // Replace meta keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${page.keywords}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonicalUrl}"`
  );

  // Replace hreflang ru
  html = html.replace(
    /<link rel="alternate" hreflang="ru" href="[^"]*"/,
    `<link rel="alternate" hreflang="ru" href="${canonicalUrl}"`
  );

  // Replace hreflang x-default
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"/,
    `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}"`
  );

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${page.title}"`
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${page.description}"`
  );

  // Replace OG url
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${page.title}"`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${page.description}"`
  );

  return html;
}

// Main
const templateHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

let created = 0;
for (const page of pages) {
  const html = processHtml(templateHtml, page);

  if (page.path === '/') {
    // Overwrite root index.html (already correct, but ensure consistency)
    fs.writeFileSync(path.join(DIST, 'index.html'), html);
  } else {
    const dir = path.join(DIST, page.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  created++;
}

console.log(`✅ Prerendered meta tags for ${created} pages`);
