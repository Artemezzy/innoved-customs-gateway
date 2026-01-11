import { Zap, PiggyBank, Laptop, Headphones } from 'lucide-react';
import teamProfessionals from '@/assets/team-professionals.jpg';

interface WhyChooseUsProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Почему выбирают нас?',
    advantages: [
      { icon: Zap, title: 'Скорость и эффективность', description: 'Быстрое оформление документов и прохождение таможни с гарантией результата' },
      { icon: PiggyBank, title: 'Финансовая экономия', description: 'Оптимизация таможенных платежей и снижение издержек' },
      { icon: Laptop, title: 'Дистанционный формат', description: 'Работа с клиентами по всей России удалённо' },
      { icon: Headphones, title: 'Экспертная поддержка 24/7', description: 'Консультации специалистов в любое время' }
    ]
  },
  en: {
    title: 'Why Choose Us?',
    advantages: [
      { icon: Zap, title: 'Speed and Efficiency', description: 'Fast document processing and customs clearance with guaranteed results' },
      { icon: PiggyBank, title: 'Financial Savings', description: 'Customs payment optimization and cost reduction' },
      { icon: Laptop, title: 'Remote Format', description: 'Working with clients across Russia remotely' },
      { icon: Headphones, title: 'Expert Support 24/7', description: 'Specialist consultations at any time' }
    ]
  }
};

export function WhyChooseUs({ language }: WhyChooseUsProps) {
  const text = content[language];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <img 
        src={teamProfessionals} 
        alt="Team"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-navy/90" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left side - Title */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {text.title}
            </h2>
          </div>
          
          {/* Right side - Advantages Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {text.advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-olive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
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
      </div>
    </section>
  );
}
