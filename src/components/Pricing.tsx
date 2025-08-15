import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Цены',
    tableHeaders: ['Услуга', 'Стоимость'],
    pricing: [
      {
        service: 'Оформление импорта и экспорта',
        price: 'от 10000 ₽'
      },
      {
        service: 'Определение кода ТН ВЭД',
        price: 'от 1000 ₽'
      },
      {
        service: 'Регистрация импортёра в ЛК ФТС',
        price: 'от 5000 ₽'
      },
      {
        service: 'Организация получения сертификатов и декларация соответствия',
        price: 'по договорённости'
      }
    ]
  },
  en: {
    title: 'Pricing',
    tableHeaders: ['Service', 'Cost'],
    pricing: [
      {
        service: 'Import and Export Registration',
        price: 'from 10000 ₽'
      },
      {
        service: 'HS Code Determination',
        price: 'from 1000 ₽'
      },
      {
        service: 'Importer Registration in FCS Personal Account',
        price: 'from 5000 ₽'
      },
      {
        service: 'Organization of Certificates and Declaration of Conformity',
        price: 'by agreement'
      }
    ]
  }
};

export function Pricing({ language }: PricingProps) {
  const text = content[language];

  return (
    <section id="pricing" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {text.title}
        </h2>
        <div className="max-w-4xl mx-auto">
          <Card className="animate-slide-in-right shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold text-primary">
                {text.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-foreground">
                      {text.tableHeaders[0]}
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground">
                      {text.tableHeaders[1]}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {text.pricing.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell className="text-muted-foreground">
                        {item.service}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}