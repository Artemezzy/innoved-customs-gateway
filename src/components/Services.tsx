import { ServiceCard } from './ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Truck, FileSearch, UserPlus, Shield, Mail, ScanLine, Languages, Package, Plane 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServicesProps {
  language: 'ru' | 'en' | 'zh';
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
  ru: 'Наши услуги',
  en: 'Our Services',
  zh: '我们的服务'
};

export function Services({ language }: ServicesProps) {
  const { data: services = [], isLoading } = useServices(language);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon /> : <Package />;
  };

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {sectionTitle[language]}
        </h2>
        
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card rounded-xl p-6 border shadow-sm">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <ServiceCard 
                  title={service.title}
                  icon={getIcon(service.icon)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
