import { getServiceBySlug, type ServiceData } from '@/data/services';
import type { Locale } from '@/services/hygraph';

export interface ServiceDetailResult {
  service: ServiceData | undefined;
  isFound: boolean;
  hasContent: boolean;
}

export const useServiceDetail = (slug: string): ServiceDetailResult => {
  const service = getServiceBySlug(slug);
  
  return {
    service,
    isFound: !!service,
    hasContent: !!(service?.content?.ru || service?.content?.en),
  };
};
