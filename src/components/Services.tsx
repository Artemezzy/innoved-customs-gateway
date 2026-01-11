import { ServiceCard } from './ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Truck, FileSearch, UserPlus, Shield, Mail, ScanLine, Languages, Package, Plane 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServicesProps {
  language: 'ru' | 'en';
}

// Icon mapping for Hygraph icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Package,
  Plane,
  FileSearch,
  UserPlus,
  Shield,
  Mail,
  ScanLine,
  Languages,
  Truck,
};

const sectionTitle = {
  ru: 'Услуги',
  en: 'Services'
};

export function Services({ language }: ServicesProps) {
  const { data: services = [], isLoading } = useServices(language);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon /> : <Package />;
  };

  return (
    <section id="services" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-10 md:mb-12">
          {sectionTitle[language]}
        </h2>
        
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-muted rounded-xl p-5 md:p-6">
                <Skeleton className="h-10 w-10 rounded-full mb-3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard 
                  title={service.title}
                  icon={getIcon(service.icon)}
                  variant="light"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
