import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
}

export function ServiceCard({ title, icon }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-card border border-border">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 text-4xl text-primary group-hover:text-primary-glow transition-colors duration-300">
          {icon}
        </div>
        <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="h-1 bg-gradient-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </CardContent>
    </Card>
  );
}