import { ServiceCard } from './ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesProps {
  language: 'ru' | 'en';
}

export function Services({ language }: ServicesProps) {
  const { data: services = [], isLoading } = useServices(language);

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard 
                  title={service.title}
                  slug={service.slug}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
