import { useQuery } from '@tanstack/react-query';
import {
  hygraphClient,
  isHygraphConfigured,
  toHygraphLocale,
  type Locale,
  type HygraphService,
  type ServicesResponse,
} from '@/services/hygraph';
import { GET_SERVICES } from '@/graphql/queries';

// Fallback static data (from original Services component)
const fallbackServices: Record<Locale, { title: string; icon: string }[]> = {
  ru: [
    { title: 'Оформление импорта', icon: 'Package' },
    { title: 'Оформление экспорта', icon: 'Plane' },
    { title: 'Определение кода ТН ВЭД', icon: 'FileSearch' },
    { title: 'Регистрация импортёра в ЛК ФТС', icon: 'UserPlus' },
    { title: 'Организация получения сертификатов и декларация соответствия', icon: 'Shield' },
    { title: 'Подготовка писем в таможенные органы', icon: 'Mail' },
    { title: 'Организация досмотра товаров', icon: 'ScanLine' },
    { title: 'Перевод документов', icon: 'Languages' },
  ],
  en: [
    { title: 'Import Registration', icon: 'Package' },
    { title: 'Export Registration', icon: 'Plane' },
    { title: 'HS Code Determination', icon: 'FileSearch' },
    { title: 'Importer Registration in FCS Personal Account', icon: 'UserPlus' },
    { title: 'Organization of Certificates and Declaration of Conformity', icon: 'Shield' },
    { title: 'Preparation of Letters to Customs Authorities', icon: 'Mail' },
    { title: 'Organization of Goods Inspection', icon: 'ScanLine' },
    { title: 'Document Translation', icon: 'Languages' },
  ],
};

// Transform fallback to match HygraphService interface
const getFallbackServices = (locale: Locale): HygraphService[] => {
  return fallbackServices[locale].map((service, index) => ({
    id: `fallback-${index}`,
    title: service.title,
    description: '',
    icon: service.icon,
    order: index,
    isActive: true,
  }));
};

// Fetch services from Hygraph
const fetchServices = async (locale: Locale): Promise<HygraphService[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback data');
    return getFallbackServices(locale);
  }

  try {
    const data = await hygraphClient.request<ServicesResponse>(GET_SERVICES, {
      locale: toHygraphLocale(locale),
    });
    return data.services;
  } catch (error) {
    console.error('Error fetching services from Hygraph:', error);
    return getFallbackServices(locale);
  }
};

export const useServices = (locale: Locale) => {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => fetchServices(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
};
