import { Zap, PiggyBank, Target, Headphones, Laptop } from 'lucide-react';

interface WhyChooseUsProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Почему выбирают нас?',
    advantages: [
      { icon: Zap, title: 'Скорость', description: 'Быстрое оформление документов и прохождение таможни' },
      { icon: PiggyBank, title: 'Финансовая экономия', description: 'Оптимизация таможенных платежей и снижение издержек' },
      { icon: Target, title: 'Эффективность', description: 'Гарантия результата и соблюдение сроков' },
      { icon: Headphones, title: 'Экспертная поддержка 24/7', description: 'Консультации специалистов в любое время' },
      { icon: Laptop, title: 'Дистанционный формат', description: 'Работа с клиентами по всей России удалённо' }
    ]
  },
  en: {
    title: 'Why Choose Us?',
    advantages: [
      { icon: Zap, title: 'Speed', description: 'Fast document processing and customs clearance' },
      { icon: PiggyBank, title: 'Financial Savings', description: 'Customs payment optimization and cost reduction' },
      { icon: Target, title: 'Efficiency', description: 'Guaranteed results and deadline compliance' },
      { icon: Headphones, title: 'Expert Support 24/7', description: 'Specialist consultations at any time' },
      { icon: Laptop, title: 'Remote Format', description: 'Working with clients across Russia remotely' }
    ]
  }
};

export function WhyChooseUs({ language }: WhyChooseUsProps) {
  const text = content[language];

  return (
    <section className="py-16 md:py-24 bg-[hsl(222.2,84%,4.9%)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 md:mb-16">
          {text.title}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {text.advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3">
                  {advantage.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
