import { useState } from 'react';

interface HowWeWorkProps {
  language: 'ru' | 'en' | 'zh';
}

const text = {
  ru: {
    title: 'Как мы работаем',
    subtitle: 'Простой и понятный процесс оформления декларации',
    steps: [
      {
        title: 'Получение заявки',
        description: 'Вы оставляете заявку через форму на сайте или звоните нам'
      },
      {
        title: 'Коммерческое предложение',
        description: 'Отправляем детальное предложение с расчетом стоимости'
      },
      {
        title: 'Заключение договора',
        description: 'Подписываем договор и определяем сроки выполнения работ'
      },
      {
        title: 'Сбор документов',
        description: 'Собираем и анализируем все необходимые документы'
      },
      {
        title: 'Подача декларации',
        description: 'Подготавливаем и подаем декларацию в соответствующие органы'
      },
      {
        title: 'Выдача документов',
        description: 'Предоставляем готовые документы после выпуска товаров'
      }
    ]
  },
  en: {
    title: 'How We Work',
    subtitle: 'Simple and clear declaration process',
    steps: [
      {
        title: 'Receiving Application',
        description: 'You submit an application through our website form or call us'
      },
      {
        title: 'Commercial Proposal',
        description: 'We send a detailed proposal with cost calculation'
      },
      {
        title: 'Contract Signing',
        description: 'We sign the contract and determine work completion deadlines'
      },
      {
        title: 'Document Collection',
        description: 'We collect and analyze all necessary documents'
      },
      {
        title: 'Declaration Submission',
        description: 'We prepare and submit the declaration to relevant authorities'
      },
      {
        title: 'Document Delivery',
        description: 'We provide ready documents after product release'
      }
    ]
  },
  zh: {
    title: '我们如何工作',
    subtitle: '简单明了的申报流程',
    steps: [
      {
        title: '接收申请',
        description: '您通过网站表单提交申请或致电我们'
      },
      {
        title: '商业提案',
        description: '我们发送详细的提案和费用计算'
      },
      {
        title: '签署合同',
        description: '我们签署合同并确定工作完成期限'
      },
      {
        title: '文件收集',
        description: '我们收集和分析所有必要文件'
      },
      {
        title: '提交申报',
        description: '我们准备并向相关部门提交申报'
      },
      {
        title: '文件交付',
        description: '产品发布后我们提供准备好的文件'
      }
    ]
  }
};

export const HowWeWork = ({ language }: HowWeWorkProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const content = text[language];

  return (
    <section id="how-we-work" className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Horizontal Stepper */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-muted rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(activeStep / (content.steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-6 gap-4">
                {content.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step Circle */}
                    <div 
                      className={`w-8 h-8 rounded-full border-4 transition-all duration-500 z-10 ${
                        index <= activeStep 
                          ? 'bg-primary border-primary shadow-glow' 
                          : 'bg-background border-muted'
                      }`}
                    >
                      <div className={`w-full h-full rounded-full transition-all duration-300 ${
                        index === activeStep ? 'animate-pulse' : ''
                      }`} />
                    </div>

                    {/* Step Content */}
                    <div className={`mt-6 text-center transition-all duration-500 ${
                      index === activeStep ? 'transform scale-105' : ''
                    }`}>
                      <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                        index <= activeStep ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed transition-all duration-500 ${
                        index === activeStep 
                          ? 'text-foreground opacity-100' 
                          : 'text-muted-foreground opacity-60'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Vertical Stepper */}
          <div className="lg:hidden space-y-6">
            {content.steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-6 rounded-xl transition-all duration-500 cursor-pointer ${
                  index === activeStep 
                    ? 'bg-primary/10 border-2 border-primary/20 shadow-elegant' 
                    : 'bg-card border border-border hover:bg-muted/50'
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Number */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= activeStep
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    index === activeStep ? 'text-primary' : 'text-foreground'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {content.steps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep 
                    ? 'bg-primary scale-125 shadow-glow' 
                    : index < activeStep 
                      ? 'bg-primary/60' 
                      : 'bg-muted'
                }`}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};