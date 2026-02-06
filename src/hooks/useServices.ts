import { useQuery } from '@tanstack/react-query';
import { type Locale, type HygraphService } from '@/services/hygraph';
import { getServicesForLocale } from '@/data/services';

// Fetch services from local static data
const fetchServices = (locale: Locale): HygraphService[] => {
  return getServicesForLocale(locale);
};

export const useServices = (locale: Locale) => {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => fetchServices(locale),
    staleTime: Infinity, // Static data never stales
    gcTime: Infinity,
  });
};
