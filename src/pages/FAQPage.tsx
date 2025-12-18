import { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { faqItems, faqCategories } from '@/data/faq-items';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const content = {
  ru: {
    title: 'Часто задаваемые вопросы',
    subtitle: 'Ответы на популярные вопросы о таможенном оформлении',
    all: 'Все'
  },
  en: {
    title: 'FAQ',
    subtitle: 'Answers to popular questions about customs clearance',
    all: 'All'
  },
  zh: {
    title: '常见问题',
    subtitle: '关于清关的热门问题解答',
    all: '全部'
  }
};

export default function FAQPage() {
  const { language } = useLanguage();
  const text = content[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    analytics.pageView('/faq', 'ИННОВЭД - FAQ');
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const categories = Object.keys(faqCategories);

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {text.title}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('all')}
                className="animate-fade-in"
              >
                {text.all}
              </Button>
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  {faqCategories[category as keyof typeof faqCategories][language]}
                </Button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {filteredItems.map((item, index) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="bg-card rounded-lg border shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="text-foreground font-medium pr-4">
                      {item.question[language]}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer[language]}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
