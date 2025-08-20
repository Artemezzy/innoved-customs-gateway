import teamImage from '@/assets/vladivostok-port-real.jpg';

interface AboutProps {
  language: 'ru' | 'en' | 'zh';
}

const content = {
  ru: {
    title: 'О компании',
    text: `Компания «ИННОВЭД» — надежный партнер в сфере таможенного оформления товаров по всей России. Мы объединяем профессиональную команду с более чем десятью годами опыта, чтобы обеспечить нашим клиентам максимально оперативное и качественное сопровождение на всех этапах таможенного оформления.

Благодаря современным технологиям и отлаженным дистанционным процессам взаимодействия, «ИННОВЭД» предоставляет услуги быстро и эффективно, независимо от географического положения клиента. Мы ценим время и доверие наших заказчиков, поэтому ставим в приоритет скорость и точность в работе.

Став нашим клиентом, вы получаете профессиональное сопровождение, минимизацию рисков, а также уверенность в том, что ваши грузы будут оформлены в полном соответствии с действующим законодательством и международными стандартами.

«ИННОВЭД» — ваш бизнес — без преград, таможня — без забот.`
  },
  en: {
    title: 'About Company',
    text: `INNOVED Company is a reliable partner in the field of customs clearance of goods throughout Russia. We unite a professional team with more than ten years of experience to provide our clients with the most efficient and high-quality support at all stages of customs clearance.

Thanks to modern technologies and well-established remote interaction processes, INNOVED provides services quickly and efficiently, regardless of the client's geographical location. We value the time and trust of our customers, so we prioritize speed and accuracy in our work.

By becoming our client, you get professional support, risk minimization, and confidence that your cargo will be processed in full compliance with current legislation and international standards.

INNOVED - your business without barriers, customs without worries.`
  },
  zh: {
    title: '关于我们',
    text: `INNOVED公司是俄罗斯全境货物清关领域的可靠合作伙伴。我们汇集了一支拥有十多年经验的专业团队，为客户在清关各个环节提供最高效优质的服务。

凭借现代化技术和完善的远程互动流程，INNOVED能够快速高效地提供服务，无论客户身在何处。我们珍视客户的时间和信任，因此将速度和准确性作为工作重点。

成为我们的客户，您将获得专业支持、风险最小化，以及货物将完全按照现行法律法规和国际标准进行清关的保证。

INNOVED——让您的业务畅通无阻，清关无忧。`
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
              src={teamImage}
              alt="Владивостокский торговый порт - логистический терминал"
              className="w-full h-auto rounded-lg shadow-card hover:shadow-hover transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}