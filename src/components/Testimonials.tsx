import { Language } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface Testimonial {
  id: number;
  name: { ru: string; en: string };
  company: { ru: string; en: string };
  text: { ru: string; en: string };
  initials: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: { ru: 'Александр М.', en: 'Alexander M.' },
    company: { ru: 'ООО "ТрансЛогистик"', en: 'TransLogistic LLC' },
    text: {
      ru: 'Работаем с ИННОВЭД уже третий год. Всегда быстрое оформление документов и профессиональный подход к решению любых вопросов. Рекомендую как надёжного партнёра!',
      en: 'We have been working with INNOVAD for three years now. Always quick document processing and professional approach to solving any issues. I recommend them as a reliable partner!'
    },
    initials: 'АМ',
    rating: 5
  },
  {
    id: 2,
    name: { ru: 'Елена К.', en: 'Elena K.' },
    company: { ru: 'ИП Козлова', en: 'IE Kozlova' },
    text: {
      ru: 'Очень удобно работать дистанционно — всё решается оперативно через мессенджеры и электронную почту. Сэкономила много времени и нервов на таможенном оформлении.',
      en: 'It is very convenient to work remotely — everything is resolved promptly via messengers and email. Saved a lot of time and effort on customs clearance.'
    },
    initials: 'ЕК',
    rating: 5
  },
  {
    id: 3,
    name: { ru: 'Дмитрий С.', en: 'Dmitry S.' },
    company: { ru: 'ООО "ИмпортПро"', en: 'ImportPro LLC' },
    text: {
      ru: 'Обратились с нестандартной задачей по импорту оборудования. Специалисты ИННОВЭД нашли оптимальное решение и помогли избежать лишних расходов. Отличная работа!',
      en: 'We approached them with a non-standard task for importing equipment. INNOVAD specialists found the optimal solution and helped avoid unnecessary expenses. Excellent work!'
    },
    initials: 'ДС',
    rating: 5
  },
  {
    id: 4,
    name: { ru: 'Ольга В.', en: 'Olga V.' },
    company: { ru: 'ООО "ГлобалТрейд"', en: 'GlobalTrade LLC' },
    text: {
      ru: 'Сотрудничаем более 5 лет. За это время ни одной ошибки в документах, всегда чёткие сроки и прозрачные цены. Настоящие профессионалы своего дела!',
      en: 'We have been cooperating for more than 5 years. During this time, not a single error in documents, always clear deadlines and transparent prices. True professionals!'
    },
    initials: 'ОВ',
    rating: 5
  }
];

const content = {
  ru: {
    title: 'Отзывы клиентов',
    subtitle: 'Что говорят о нас наши партнёры'
  },
  en: {
    title: 'Client Testimonials',
    subtitle: 'What our partners say about us'
  }
};

interface TestimonialsProps {
  language: Language;
}

export function Testimonials({ language }: TestimonialsProps) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content[language].subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-12">
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <Card className="bg-card shadow-card border-0">
                    <CardContent className="p-8 md:p-10">
                      {/* Rating */}
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                        "{testimonial.text[language]}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">
                            {testimonial.name[language]}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.company[language]}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
