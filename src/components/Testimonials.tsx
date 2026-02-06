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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

import victoriaPhoto from '@/assets/testimonial-victoria.png';
import svetlanaPhoto from '@/assets/testimonial-svetlana.jpg';
import bairPhoto from '@/assets/testimonial-bair.jpg';
import alexanderPhoto from '@/assets/testimonial-alexander.jpg';

interface Testimonial {
  id: number;
  name: { ru: string; en: string };
  company: { ru: string; en: string };
  text: { ru: string; en: string };
  initials: string;
  rating: number;
  photo?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: { ru: 'Александр М.', en: 'Alexander M.' },
    company: { ru: 'ООО "ТСЛОГИСТИКА"', en: 'TSLOGISTIKA LLC' },
    text: {
      ru: 'Работаем с ИННОВЭД с лета 2025 года. Всегда быстрое оформление документов и профессиональный подход к решению любых вопросов. Рекомендую как надёжного партнёра!',
      en: 'We have been working with INNOVAD since summer 2025. Always quick document processing and professional approach to solving any issues. I recommend them as a reliable partner!'
    },
    initials: 'АМ',
    rating: 5,
    photo: alexanderPhoto
  },
  {
    id: 2,
    name: { ru: 'Виктория С.', en: 'Victoria S.' },
    company: { ru: 'ИП Староспичихина В.', en: 'IE Starospichihina V.' },
    text: {
      ru: 'Очень удобно работать дистанционно — всё решается оперативно через мессенджеры и электронную почту. Сэкономила много времени и нервов на таможенном оформлении.',
      en: 'It is very convenient to work remotely — everything is resolved promptly via messengers and email. Saved a lot of time and effort on customs clearance.'
    },
    initials: 'ВС',
    rating: 5,
    photo: victoriaPhoto
  },
  {
    id: 3,
    name: { ru: 'Светлана С.', en: 'Svetlana S.' },
    company: { ru: 'ООО "ИмпортПроТехно"', en: 'ImportProTechno LLC' },
    text: {
      ru: 'Обратились с нестандартной задачей по импорту оборудования по направлению Циндао - Забайкальск - Новосибирск. Специалисты ИННОВЭД помогли и с сертификцией и с прохождением таможни. Отличная работа!',
      en: 'We approached them with a non-standard task for importing equipment on the Qingdao - Zabaykalsk - Novosibirsk route. INNOVAD specialists helped with both certification and customs clearance. Excellent work!'
    },
    initials: 'СС',
    rating: 5,
    photo: svetlanaPhoto
  },
  {
    id: 4,
    name: { ru: 'Баир Б.', en: 'Bair B.' },
    company: { ru: 'ООО "ГлобалТрейдВектор"', en: 'GlobalTradeVector LLC' },
    text: {
      ru: 'Сотрудничаем уже три месяца. За это время ни одной ошибки в документах, всегда чёткие сроки и прозрачные цены. Более 20 выпусков во Владивостоке и Находке. Настоящие профессионалы своего дела!',
      en: 'We have been cooperating for three months now. During this time, not a single error in documents, always clear deadlines and transparent prices. Over 20 releases in Vladivostok and Nakhodka. True professionals!'
    },
    initials: 'ББ',
    rating: 5,
    photo: bairPhoto
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
                          {testimonial.photo && (
                            <AvatarImage src={testimonial.photo} alt={testimonial.name.ru} className="object-cover" />
                          )}
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
