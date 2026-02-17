import { useState } from 'react';
import { FileText, Send, FileCheck, FolderOpen, Upload, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HowWeWorkProps {
  language: 'ru' | 'en';
  showHeader?: boolean;
}

const text = {
  ru: {
    title: 'Как мы работаем',
    subtitle: 'Простой и понятный процесс оформления декларации',
    steps: [
      { id: 'application', title: 'Заявка', fullTitle: 'Получение заявки', description: 'Вы оставляете заявку через форму на сайте или звоните нам', details: 'Наш менеджер свяжется с вами в течение 15 минут для уточнения деталей. Вы можете отправить заявку любым удобным способом: через форму на сайте, по телефону, email или в мессенджере.', icon: FileText },
      { id: 'proposal', title: 'Предложение', fullTitle: 'Коммерческое предложение', description: 'Отправляем детальное предложение с расчетом стоимости', details: 'После анализа вашего запроса мы готовим индивидуальное коммерческое предложение с детальной калькуляцией всех расходов, сроками выполнения и необходимыми документами.', icon: Send },
      { id: 'contract', title: 'Договор', fullTitle: 'Заключение договора', description: 'Подписываем договор и определяем сроки выполнения работ', details: 'Оформляем все юридические документы. Договор включает полный перечень услуг, ответственность сторон, гарантии и порядок расчетов. Возможна работа по оферте.', icon: FileCheck },
      { id: 'documents', title: 'Документы', fullTitle: 'Сбор документов', description: 'Собираем и анализируем все необходимые документы', details: 'Мы запрашиваем у вас минимальный пакет документов и самостоятельно проверяем их на соответствие требованиям таможенных органов. При необходимости помогаем с получением недостающих документов.', icon: FolderOpen },
      { id: 'declaration', title: 'Декларация', fullTitle: 'Подача декларации', description: 'Подготавливаем и подаем декларацию в соответствующие органы', details: 'Заполняем декларацию на товары, классифицируем товар по ТН ВЭД, рассчитываем таможенные платежи и подаем документы в электронном виде. Контролируем процесс на всех этапах.', icon: Upload },
      { id: 'completion', title: 'Готово', fullTitle: 'Выдача документов', description: 'Предоставляем готовые документы после выпуска товаров', details: 'После успешного выпуска товаров вы получаете полный пакет документов: выпущенную декларацию, отчёт о таможенных платежах и все сопутствующие документы в электронном и бумажном виде.', icon: CheckCircle }
    ]
  },
  en: {
    title: 'How We Work',
    subtitle: 'Simple and clear declaration process',
    steps: [
      { id: 'application', title: 'Application', fullTitle: 'Receiving Application', description: 'You submit an application through our website form or call us', details: 'Our manager will contact you within 15 minutes to clarify details. You can submit an application in any convenient way: through the website form, by phone, email or messenger.', icon: FileText },
      { id: 'proposal', title: 'Proposal', fullTitle: 'Commercial Proposal', description: 'We send a detailed proposal with cost calculation', details: 'After analyzing your request, we prepare an individual commercial proposal with detailed calculation of all costs, execution timelines and required documents.', icon: Send },
      { id: 'contract', title: 'Contract', fullTitle: 'Contract Signing', description: 'We sign the contract and determine work completion deadlines', details: 'We process all legal documents. The contract includes a complete list of services, party responsibilities, guarantees and payment procedures. Working under offer agreement is possible.', icon: FileCheck },
      { id: 'documents', title: 'Documents', fullTitle: 'Document Collection', description: 'We collect and analyze all necessary documents', details: 'We request a minimum package of documents from you and independently verify their compliance with customs requirements. If necessary, we help obtain missing documents.', icon: FolderOpen },
      { id: 'declaration', title: 'Declaration', fullTitle: 'Declaration Submission', description: 'We prepare and submit the declaration to relevant authorities', details: 'We fill out the goods declaration, classify goods according to HS codes, calculate customs payments and submit documents electronically. We control the process at all stages.', icon: Upload },
      { id: 'completion', title: 'Complete', fullTitle: 'Document Delivery', description: 'We provide ready documents after product release', details: 'After successful release of goods, you receive a complete package of documents: released declaration, customs payment report and all accompanying documents in electronic and paper form.', icon: CheckCircle }
    ]
  }
};

export const HowWeWork = ({ language, showHeader = true }: HowWeWorkProps) => {
  const [activeTab, setActiveTab] = useState('application');
  const content = text[language];

  return (
    <section id="how-we-work" className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-foreground mb-4">
              {content.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-6 h-auto p-2 bg-muted/50 rounded-xl mb-8">
              {content.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    className="flex flex-col items-center gap-2 py-4 px-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300"
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-accent/20 text-[10px] flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{step.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Mobile Tabs */}
            <TabsList className="md:hidden flex w-full overflow-x-auto gap-2 h-auto p-2 bg-muted/50 rounded-xl mb-8 scrollbar-hide">
              {content.steps.map((step) => {
                const Icon = step.icon;
                return (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium whitespace-nowrap">{step.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content Area */}
            {content.steps.map((step) => {
              const Icon = step.icon;
              return (
                <TabsContent key={step.id} value={step.id} className="mt-0 animate-fade-in">
                  <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                          {step.fullTitle}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-4">{step.description}</p>
                        <p className="text-foreground/80 leading-relaxed">{step.details}</p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{language === 'ru' ? 'Этап' : 'Step'} {content.steps.findIndex(s => s.id === step.id) + 1} {language === 'ru' ? 'из' : 'of'} {content.steps.length}</span>
                        <div className="flex gap-1">
                          {content.steps.map((s, i) => (
                            <button
                              key={s.id}
                              onClick={() => setActiveTab(s.id)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                s.id === step.id 
                                  ? 'bg-accent w-6' 
                                  : i < content.steps.findIndex(st => st.id === step.id)
                                    ? 'bg-accent/60'
                                    : 'bg-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
};
