export interface CityConfig {
  name: string;
  nameEn: string;
  slug: string;
  x: number;
  y: number;
}

export interface CityServicesData {
  city: string;
  title: string;
  description: string;
  services: string[];
}

// Координаты x/y (0–100) относительно viewBox SVG карты России
// viewBox рассчитан на проекцию ~19°E–190°E долготы, ~40°N–78°N широты
export const citiesConfig: CityConfig[] = [
  // === 8 обязательных ===
  { name: 'Владивосток', nameEn: 'Vladivostok', slug: 'vladivostok', x: 89, y: 68 },
  { name: 'Иркутск', nameEn: 'Irkutsk', slug: 'irkutsk', x: 67, y: 62 },
  { name: 'Новосибирск', nameEn: 'Novosibirsk', slug: 'novosibirsk', x: 54, y: 58 },
  { name: 'Москва', nameEn: 'Moscow', slug: 'moscow', x: 24, y: 56 },
  { name: 'Санкт-Петербург', nameEn: 'Saint Petersburg', slug: 'saint-petersburg', x: 20, y: 44 },
  { name: 'Забайкальск', nameEn: 'Zabaikalsk', slug: 'zabaikalsk', x: 73, y: 65 },
  { name: 'Новороссийск', nameEn: 'Novorossiysk', slug: 'novorossiysk', x: 23, y: 73 },
  { name: 'Красноярск', nameEn: 'Krasnoyarsk', slug: 'krasnoyarsk', x: 59, y: 55 },

  // === 20 дополнительных ===
  { name: 'Екатеринбург', nameEn: 'Yekaterinburg', slug: 'yekaterinburg', x: 40, y: 55 },
  { name: 'Казань', nameEn: 'Kazan', slug: 'kazan', x: 32, y: 55 },
  { name: 'Самара', nameEn: 'Samara', slug: 'samara', x: 33, y: 61 },
  { name: 'Ростов-на-Дону', nameEn: 'Rostov-on-Don', slug: 'rostov-on-don', x: 25, y: 70 },
  { name: 'Краснодар', nameEn: 'Krasnodar', slug: 'krasnodar', x: 24, y: 72 },
  { name: 'Уфа', nameEn: 'Ufa', slug: 'ufa', x: 37, y: 57 },
  { name: 'Пермь', nameEn: 'Perm', slug: 'perm', x: 37, y: 50 },
  { name: 'Челябинск', nameEn: 'Chelyabinsk', slug: 'chelyabinsk', x: 40, y: 58 },
  { name: 'Нижний Новгород', nameEn: 'Nizhny Novgorod', slug: 'nizhny-novgorod', x: 28, y: 54 },
  { name: 'Волгоград', nameEn: 'Volgograd', slug: 'volgograd', x: 28, y: 66 },
  { name: 'Воронеж', nameEn: 'Voronezh', slug: 'voronezh', x: 25, y: 63 },
  { name: 'Омск', nameEn: 'Omsk', slug: 'omsk', x: 48, y: 57 },
  { name: 'Тюмень', nameEn: 'Tyumen', slug: 'tyumen', x: 44, y: 52 },
  { name: 'Хабаровск', nameEn: 'Khabarovsk', slug: 'khabarovsk', x: 88, y: 60 },
  { name: 'Калининград', nameEn: 'Kaliningrad', slug: 'kaliningrad', x: 13, y: 52 },
  { name: 'Мурманск', nameEn: 'Murmansk', slug: 'murmansk', x: 21, y: 28 },
  { name: 'Архангельск', nameEn: 'Arkhangelsk', slug: 'arkhangelsk', x: 26, y: 36 },
  { name: 'Якутск', nameEn: 'Yakutsk', slug: 'yakutsk', x: 81, y: 40 },
  { name: 'Петропавловск-Камчатский', nameEn: 'Petropavlovsk-Kamchatsky', slug: 'petropavlovsk-kamchatsky', x: 96, y: 48 },
  { name: 'Южно-Сахалинск', nameEn: 'Yuzhno-Sakhalinsk', slug: 'yuzhno-sakhalinsk', x: 93, y: 60 },
];

// Mock-сервисы для каждого города
const serviceVariants = {
  full: ['Таможенное оформление импорта', 'Таможенное оформление экспорта', 'Сертификация', 'Определение кода ТН ВЭД', 'ВЭД-консалтинг', 'Организация досмотра товаров', 'Перевод документов'],
  fullEn: ['Import Customs Clearance', 'Export Customs Clearance', 'Certification', 'HS Code Determination', 'FEA Consulting', 'Goods Inspection', 'Document Translation'],
  importExport: ['Таможенное оформление импорта', 'Таможенное оформление экспорта', 'Определение кода ТН ВЭД', 'ВЭД-консалтинг'],
  importExportEn: ['Import Customs Clearance', 'Export Customs Clearance', 'HS Code Determination', 'FEA Consulting'],
  basic: ['Таможенное оформление импорта', 'ВЭД-консалтинг', 'Перевод документов'],
  basicEn: ['Import Customs Clearance', 'FEA Consulting', 'Document Translation'],
};

const cityServiceMap: Record<string, { descRu: string; descEn: string; variant: 'full' | 'importExport' | 'basic' }> = {
  vladivostok: { descRu: 'Крупнейший порт на Дальнем Востоке. Полный спектр таможенных услуг для морских грузов из Азии.', descEn: 'Major Far East port. Full range of customs services for sea cargo from Asia.', variant: 'full' },
  irkutsk: { descRu: 'Региональный центр ВЭД в Восточной Сибири. Оформление грузов из Монголии и Китая.', descEn: 'Regional FEA center in Eastern Siberia. Customs clearance for goods from Mongolia and China.', variant: 'full' },
  novosibirsk: { descRu: 'Крупнейший логистический хаб Западной Сибири.', descEn: 'Largest logistics hub in Western Siberia.', variant: 'importExport' },
  moscow: { descRu: 'Главный офис и центральный хаб. Все виды таможенных услуг.', descEn: 'Main office and central hub. All types of customs services.', variant: 'full' },
  'saint-petersburg': { descRu: 'Морской порт для европейских грузов. Полный цикл таможенного оформления.', descEn: 'Seaport for European cargo. Full cycle of customs clearance.', variant: 'full' },
  zabaikalsk: { descRu: 'Ключевой погранпереход с КНР. Специализация на ж/д грузах.', descEn: 'Key border crossing with China. Specialization in rail cargo.', variant: 'importExport' },
  novorossiysk: { descRu: 'Крупнейший морской порт юга России. Оформление контейнерных грузов.', descEn: 'Largest seaport in southern Russia. Container cargo clearance.', variant: 'full' },
  krasnoyarsk: { descRu: 'Транспортный узел центральной Сибири.', descEn: 'Transport hub of central Siberia.', variant: 'importExport' },
};

/**
 * Mock-функция загрузки услуг по городу.
 * Замените на реальный fetch к /services/{slug} при появлении API.
 */
export async function fetchCityServices(slug: string, language: 'ru' | 'en' = 'ru'): Promise<CityServicesData> {
  // Имитация задержки сети
  await new Promise((r) => setTimeout(r, 300));

  const city = citiesConfig.find((c) => c.slug === slug);
  if (!city) throw new Error('City not found');

  const mapping = cityServiceMap[slug];
  const variant = mapping?.variant ?? 'basic';
  const isRu = language === 'ru';

  const services =
    variant === 'full'
      ? (isRu ? serviceVariants.full : serviceVariants.fullEn)
      : variant === 'importExport'
        ? (isRu ? serviceVariants.importExport : serviceVariants.importExportEn)
        : (isRu ? serviceVariants.basic : serviceVariants.basicEn);

  const description = mapping
    ? (isRu ? mapping.descRu : mapping.descEn)
    : isRu
      ? `Таможенные услуги и ВЭД-консалтинг в городе ${city.name}.`
      : `Customs services and FEA consulting in ${city.nameEn}.`;

  return {
    city: isRu ? city.name : city.nameEn,
    title: isRu
      ? `Таможенное оформление в ${city.name === 'Москва' ? 'Москве' : city.name === 'Санкт-Петербург' ? 'Санкт-Петербурге' : city.name}`
      : `Customs Clearance in ${city.nameEn}`,
    description,
    services,
  };
}
