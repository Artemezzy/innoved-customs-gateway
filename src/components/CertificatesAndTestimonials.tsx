import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';
import certBkBest from '@/assets/cert-bk-best.webp';
import certGhv from '@/assets/cert-ghv.webp';
import certSvidetelstvo from '@/assets/cert-svidetelstvo.webp';
import victoriaPhoto from '@/assets/testimonial-victoria.webp';
import svetlanaPhoto from '@/assets/testimonial-svetlana.webp';
import bairPhoto from '@/assets/testimonial-bair.webp';
import alexanderPhoto from '@/assets/testimonial-alexander.webp';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CertificatesAndTestimonialsProps {
  language: 'ru' | 'en';
}

// Вынесено из CityCustomLanding.tsx в переиспользуемый компонент,
// чтобы можно было подключить блок "Сертификаты" + "Отзывы клиентов"
// на странице /about/ (усиление E-E-A-T: Trust через сертификаты,
// Experience через отзывы с реальными фото и рейтингом), без дублирования
// кода и без затягивания на About весь городского лендинг.
const certificates = [
  { src: certBkBest, alt: 'Сертификат качества компании БК-БЕСТ ТЕК', label: { ru: 'Сертификат качества компании БК-БЕСТ ТЕК', en: 'Quality certificate of BK-BEST TEK company' } },
  { src: certGhv, alt: 'Сертификат качества компании GHV (Китай)', label: { ru: 'Сертификат качества компании GHV (Китай)', en: 'Quality certificate of GHV company (China)' } },
  { src: certSvidetelstvo, alt: 'Свидетельство о государственной регистрации (ОГРН)', label: { ru: 'Свидетельство ОГРН', en: 'Certificate of State Registration (OGRN)' } },
];

const testimonials = [
  { name: { ru: 'Александр М.', en: 'Alexander M.' }, company: { ru: 'ООО "ТСЛОГИСТИКА"', en: 'TSLOGISTIKA LLC' }, text: { ru: 'Работаем с ИННОВЭД с лета 2025 года. Всегда быстрое оформление документов и профессиональный подход.', en: 'Working with INNOVAD since summer 2025. Always quick processing and professional approach.' }, initials: 'АМ', rating: 5, photo: alexanderPhoto },
  { name: { ru: 'Виктория С.', en: 'Victoria S.' }, company: { ru: 'ИП Староспичихина В.', en: 'IE Starospichihina V.' }, text: { ru: 'Очень удобно работать дистанционно — всё решается оперативно через мессенджеры.', en: 'Very convenient to work remotely — everything resolved via messengers.' }, initials: 'ВС', rating: 5, photo: victoriaPhoto },
  { name: { ru: 'Светлана К.', en: 'Светлана К.' }, company: { ru: 'ООО "Мебельный Мир"', en: 'Furniture World LLC' }, text: { ru: 'Грамотные специалисты, помогли с сертификацией и оформлением сложного груза.', en: 'Competent specialists, helped with certification and clearance of complex cargo.' }, initials: 'СК', rating: 5, photo: svetlanaPhoto },
  { name: { ru: 'Баир Д.', en: 'Bair D.' }, company: { ru: 'ООО "ВостокТрейд"', en: 'VostokTrade LLC' }, text: { ru: 'Надёжный партнёр для ВЭД. Быстро решают любые вопросы с таможней.', en: 'Reliable FTA partner. Quickly resolve any customs issues.' }, initials: 'БД', rating: 5, photo: bairPhoto },
];

export function CertificatesAndTestimonials({ language }: CertificatesAndTestimonialsProps) {
  const autoplayPlugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true, stopOnMouseEnter: true }));
  const [zoomedCert, setZoomedCert] = useState<string | null>(null);

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6 text-left">
              {language === 'ru' ? 'Сертификаты' : 'Certificates'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {certificates.map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                  <img src={cert.src} alt={cert.alt} className="w-36 h-auto rounded-lg shadow-sm cursor-pointer transition-transform duration-300 hover:scale-110" loading="lazy" onClick={() => setZoomedCert(cert.src)} />
                  <p className="text-foreground font-medium text-center sm:text-left text-sm">
                    {cert.label[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6 text-left">
              {language === 'ru' ? 'Отзывы клиентов' : 'Client Testimonials'}
            </h2>
            <Carousel opts={{ align: 'center', loop: true }} plugins={[autoplayPlugin.current]} className="w-full">
              <CarouselContent>
                {testimonials.map((t, i) => (
                  <CarouselItem key={i}>
                    <Card className="bg-card shadow-sm border border-border">
                      <CardContent className="p-5">
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-sm text-foreground mb-4 leading-relaxed">
                          "{t.text[language]}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-primary">
                            {t.photo && <AvatarImage src={t.photo} alt={t.name.ru} className="object-cover" />}
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">{t.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{t.name[language]}</div>
                            <div className="text-xs text-muted-foreground">{t.company[language]}</div>
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
      </div>

      <Dialog open={!!zoomedCert} onOpenChange={() => setZoomedCert(null)}>
        <DialogContent className="max-w-2xl p-2 bg-background">
          {zoomedCert && <img src={zoomedCert} alt="Сертификат" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
