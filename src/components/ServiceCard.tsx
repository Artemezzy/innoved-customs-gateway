import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  slug: string;
}

export function ServiceCard({ title, icon, slug }: ServiceCardProps) {
  return (
    <Link to={`/services/${slug}`} className="block">
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-card border border-border cursor-pointer h-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 text-4xl text-accent group-hover:text-accent/80 transition-colors duration-300">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="h-1 bg-accent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </CardContent>
      </Card>
    </Link>
  );
}
