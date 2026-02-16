import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import type { CityServicesData } from '@/data/cities-config';

interface CityInfoPanelProps {
  data: CityServicesData | null;
  isLoading: boolean;
  error: string | null;
  language: 'ru' | 'en';
}

const emptyText = {
  ru: 'Выберите город на карте, чтобы увидеть доступные услуги',
  en: 'Select a city on the map to see available services',
};

const errorText = {
  ru: 'Не удалось загрузить информацию по этому городу. Попробуйте обновить страницу или выбрать другой город.',
  en: 'Failed to load information for this city. Please refresh the page or select another city.',
};

export function CityInfoPanel({ data, isLoading, error, language }: CityInfoPanelProps) {
  return (
    <Card className="shadow-[var(--shadow-card)] min-h-[200px] lg:min-w-[320px] lg:max-w-[400px]">
      {/* Empty state */}
      {!data && !isLoading && !error && (
        <CardContent className="flex items-center justify-center h-full p-8">
          <p className="text-muted-foreground text-center text-sm">
            <MapPin className="inline-block mr-2 h-4 w-4 text-accent" />
            {emptyText[language]}
          </p>
        </CardContent>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 flex-wrap mt-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <CardContent className="flex items-center justify-center h-full p-8">
          <p className="text-destructive text-center text-sm">{errorText[language]}</p>
        </CardContent>
      )}

      {/* Data state */}
      {data && !isLoading && !error && (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{data.description}</p>
            <div className="flex flex-wrap gap-2">
              {data.services.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
