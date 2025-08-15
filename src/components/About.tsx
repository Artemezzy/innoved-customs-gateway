import containerImage from '@/assets/container.jpg';

interface AboutProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'О компании',
    text: `Компания «ИННОВЭД» — надежный партнер в сфере таможенного оформления товаров по всей России. Мы объединяем профессиональную команду с более чем десятью годами опыта, чтобы обеспечить нашим клиентам максимально оперативное и качественное сопровождение на всех этапах таможенного оформления.

Благодаря современным технологиям и отлаженным дистанционным процессам взаимодействия, «ИННОВЭД» предоставляет услуги быстро и эффективно, независимо от географического положения клиента. Мы ценим время и доверие наших заказчиков, поэтому ставим в приоритет скорость и точность в работе.

Особое внимание в нашей деятельности уделяется защите конфиденциальной информации – мы гарантируем надежную сохранность данных и безопасность ваших документов от доступа третьих лиц.

Став нашим клиентом, вы получаете профессиональное сопровождение, минимизацию рисков, а также уверенность в том, что ваши грузы будут оформлены в полном соответствии с действующим законодательством и международными стандартами.

«ИННОВЭД» — ваш бизнес — без преград, таможня — без забот.`
  },
  en: {
    title: 'About Company',
    text: `INNOVVED Company is a reliable partner in the field of customs clearance of goods throughout Russia. We unite a professional team with more than ten years of experience to provide our clients with the most efficient and high-quality support at all stages of customs clearance.

Thanks to modern technologies and well-established remote interaction processes, INNOVVED provides services quickly and efficiently, regardless of the client's geographical location. We value the time and trust of our customers, so we prioritize speed and accuracy in our work.

Special attention in our activities is paid to the protection of confidential information - we guarantee reliable data preservation and security of your documents from third-party access.

By becoming our client, you get professional support, risk minimization, and confidence that your cargo will be processed in full compliance with current legislation and international standards.

INNOVVED - your business without barriers, customs without worries.`
  }
};

export function About({ language }: AboutProps) {
  const text = content[language];

  return (
    <section id="about" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {text.title}
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              {text.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="animate-slide-in-right">
            <img
              src={containerImage}
              alt="Professional shipping container"
              className="w-full h-auto rounded-lg shadow-card hover:shadow-hover transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}