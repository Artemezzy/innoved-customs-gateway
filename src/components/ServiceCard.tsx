import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  variant?: 'default' | 'light';
}

export function ServiceCard({ title, icon, variant = 'default' }: ServiceCardProps) {
  return (
    <Card className={cn(
      "group transition-all duration-300 hover:-translate-y-1 border",
      variant === 'light' 
        ? "bg-muted hover:bg-muted/80 border-transparent hover:shadow-md" 
        : "bg-card hover:shadow-hover border-border"
    )}>
      <CardHeader className="pb-3">
        <div className={cn(
          "mb-3 text-3xl transition-colors duration-300",
          variant === 'light' 
            ? "text-olive group-hover:text-olive-hover" 
            : "text-primary group-hover:text-primary-glow"
        )}>
          {icon}
        </div>
        <CardTitle className={cn(
          "text-base font-semibold transition-colors duration-300",
          variant === 'light' 
            ? "text-foreground" 
            : "text-card-foreground group-hover:text-primary"
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
          variant === 'light' ? "bg-olive" : "bg-gradient-primary"
        )} />
      </CardContent>
    </Card>
  );
}
