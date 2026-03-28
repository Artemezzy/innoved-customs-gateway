import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { PageHero } from '@/components/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import caseImage from '@/assets/case-zapchasti.webp';
import maxIcon from '@/assets/max-icon.png';

const keywords = 'растаможка запчастей, таможенное оформление запчастей из Китая, растаможка запчастей, бу запчасти растаможка, белый импорт запчастей, кейс, автозапчасти таможня, импорт автозапчастей';

export default function CaseZapchasteyPage() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log('[SEO] Applied keywords:', keywords);
    analytics.pageView('/rastamojka-zapchastey', 'Растаможка запчастей — кейс ИННОВЭД');
  }, []);

  const isRu = language === 'ru';

  return (
    <>
      <SEOHead
        language={language}
        page="caseZapchastey"
        canonicalPath="/rastamojka-zapchastey"
      />
      <PageHero
        title={isRu ? 'Растаможка запчастей' : 'Auto Parts Customs Clearance'}
        subtitle={isRu
          ? 'Кейс: экономия до 18% и сокращение сроков до 2 дней'
          : 'Case Study: up to 18% savings and 2-day clearance'}
      />

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={caseImage} alt="Склад автозапчастей" className="w-full h-auto object-cover" />
          </div>

          {/* Intro */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {isRu
              ? 'Помогли оптовому поставщику автозапчастей наладить стабильное таможенное оформление регулярных партий товаров без задержек и штрафов, с прозрачными сроками и понятной стоимостью.'
              : 'We helped a wholesale auto parts supplier establish stable customs clearance for regular shipments without delays or penalties, with transparent timelines and clear pricing.'}
          </p>

          {/* Кратко о проекте */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Кратко о проекте' : 'Project Summary'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong>{isRu ? 'Клиент' : 'Client'}:</strong> {isRu ? 'оптовый поставщик автозапчастей для легковых и грузовых автомобилей, поставки из Китая и Европы.' : 'wholesale auto parts supplier for passenger and commercial vehicles, imports from China and Europe.'}</li>
              <li><strong>{isRu ? 'Задача' : 'Goal'}:</strong> {isRu ? 'сократить сроки таможенного оформления автозапчастей и снизить совокупные затраты на импорт.' : 'reduce customs clearance timelines and total import costs.'}</li>
              <li><strong>{isRu ? 'Решение' : 'Solution'}:</strong> {isRu ? 'комплексное таможенное сопровождение — подбор кодов ТН ВЭД, подготовка документов, взаимодействие с таможней и логистами.' : 'comprehensive customs support — HS code selection, document preparation, customs and logistics coordination.'}</li>
              <li><strong>{isRu ? 'Результат' : 'Result'}:</strong> {isRu ? 'сокращение срока оформления с 5 до 2 дней, снижение дополнительных расходов на хранение и штрафы на 18% за партию.' : 'clearance time reduced from 5 to 2 days, additional costs cut by 18% per shipment.'}</li>
              <li><strong>{isRu ? 'Формат работы' : 'Engagement'}:</strong> {isRu ? 'постоянное сопровождение по договору, фиксированные сроки и понятная стоимость услуг.' : 'ongoing contract-based support with fixed timelines and transparent pricing.'}</li>
            </ul>
          </section>

          {/* Исходная ситуация */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Исходная ситуация' : 'Initial Situation'}
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Клиент самостоятельно занимался таможенным оформлением автозапчастей и привлекал разных брокеров под каждую поставку. Номенклатура была широкой: кузовные элементы, двигатели, коробки передач, подвеска, оптика и расходные материалы.'
                : 'The client handled customs clearance independently and engaged different brokers for each shipment. The product range was wide: body parts, engines, transmissions, suspension, optics, and consumables.'}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Из-за сложной номенклатуры и частой смены исполнителей регулярно возникали ошибки в кодах ТН ВЭД и документах, что приводило к дополнительным проверкам, досмотрам и задержкам на складе временного хранения.'
                : 'Due to complex nomenclature and frequent broker changes, HS code and document errors were common, leading to additional inspections, examinations, and delays at temporary storage facilities.'}
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Средний срок таможенного оформления автозапчастей составлял 5–7 дней.' : 'Average clearance time was 5–7 days.'}</li>
              <li>{isRu ? 'До 30% деклараций уходили на дополнительную проверку или досмотр.' : 'Up to 30% of declarations went for additional checks or examinations.'}</li>
              <li>{isRu ? 'Регулярные допзатраты на хранение и простой транспорта на терминале.' : 'Regular extra costs for storage and transport idle time at terminal.'}</li>
              <li>{isRu ? 'Риски доначислений и штрафов из-за некорректных документов и кодирования.' : 'Risks of additional charges and fines due to incorrect documents and coding.'}</li>
            </ul>
          </section>

          {/* Цели клиента */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Цели клиента' : 'Client Goals'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Стабилизировать сроки таможенного оформления автозапчастей в пределах 2–3 рабочих дней.' : 'Stabilize clearance timelines within 2–3 business days.'}</li>
              <li>{isRu ? 'Снизить суммарные расходы на импорт: пошлины, хранение, штрафы и простои транспорта.' : 'Reduce total import costs: duties, storage, fines, and transport downtime.'}</li>
              <li>{isRu ? 'Минимизировать риски дополнительных проверок, доначислений и претензий со стороны таможни.' : 'Minimize risks of additional inspections, charges, and customs claims.'}</li>
              <li>{isRu ? 'Построить предсказуемый процесс растаможки автозапчастей под регулярные поставки.' : 'Build a predictable clearance process for regular shipments.'}</li>
            </ul>
          </section>

          {/* Наше решение */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Наше решение' : 'Our Solution'}
            </h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Анализ номенклатуры и кодов ТН ВЭД' : 'Nomenclature and HS Code Analysis'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Сначала мы провели детальный анализ номенклатуры автозапчастей: выделили основные группы товаров (двигатели, коробки передач, кузовные элементы, шасси, расходники) и проверили применяемые коды ТН ВЭД. Для спорных позиций подготовили аргументацию и технические описания, чтобы минимизировать риск переклассификации и доначислений при таможенном оформлении автозапчастей.'
                : 'We performed a detailed analysis of the auto parts nomenclature: identified main product groups (engines, transmissions, body parts, chassis, consumables) and verified applied HS codes. For disputed items, we prepared argumentation and technical descriptions to minimize reclassification risks.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Подготовка полного пакета документов' : 'Complete Document Preparation'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Совместно с клиентом мы выстроили стандартный пакет документов под каждую поставку: контракт, инвойс, упаковочный лист, спецификацию, сертификаты, техническое описание и подтверждение стоимости. Для б/у автозапчастей и агрегатов заранее организовали получение заключений об оценочной стоимости.'
                : 'Together with the client, we built a standard document package for each shipment: contract, invoice, packing list, specification, certificates, technical description, and cost confirmation. For used auto parts, we arranged valuation reports in advance.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Взаимодействие с таможней и логистами' : 'Customs and Logistics Coordination'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Взяли на себя оперативное взаимодействие с таможенными органами, терминалом и транспортными компаниями: отслеживание статусов деклараций, ответы на запросы, согласование досмотров и осмотров. Клиент получил одного ответственного менеджера, который контролирует весь цикл.'
                : 'We handled all communication with customs authorities, terminal, and transport companies: declaration tracking, responding to inquiries, coordinating inspections. The client got a dedicated manager overseeing the entire cycle.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Оптимизация схемы поставок' : 'Supply Chain Optimization'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Совместно с клиентом мы оптимизировали маршруты и схему поставок: разделили партии по типам товара, учли особенности по б/у запчастям, двигателям и кузовным элементам, выбрали оптимальные таможенные посты.'
                : 'Together with the client, we optimized routes and supply chains: split shipments by product type, accounted for used parts specifics, and selected optimal customs posts.'}
            </p>
          </section>

          {/* Результаты */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Результаты' : 'Results'}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-foreground">{isRu ? 'Показатель' : 'Metric'}</th>
                    <th className="p-4 text-sm font-semibold text-foreground">{isRu ? 'До' : 'Before'}</th>
                    <th className="p-4 text-sm font-semibold text-foreground">{isRu ? 'После' : 'After'}</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Средний срок оформления' : 'Average clearance time'}</td>
                    <td className="p-4">{isRu ? '5–7 дней' : '5–7 days'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? '2 дня' : '2 days'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Доля деклараций с досмотром' : 'Declarations with inspection'}</td>
                    <td className="p-4">20%</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'менее 5%' : 'less than 5%'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Срывы и переносы сроков' : 'Delays and reschedules'}</td>
                    <td className="p-4">{isRu ? 'Регулярно' : 'Regular'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Единичные случаи' : 'Rare cases'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Отзыв */}
          <section className="mb-10 bg-muted/50 rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Что говорит клиент' : 'Client Testimonial'}
            </h2>
            <blockquote className="text-muted-foreground italic text-lg leading-relaxed border-l-4 border-primary pl-4">
              {isRu
                ? '«До начала сотрудничества каждая партия автозапчастей была лотереей по срокам и затратам. Сейчас мы понимаем, когда груз будет выпущен и сколько будет стоить оформление. Это позволило нам увеличить оборот и спокойно планировать поставки на несколько месяцев вперёд».'
                : '"Before working together, every shipment of auto parts was a lottery in terms of timelines and costs. Now we know when the cargo will be released and how much clearance will cost. This allowed us to increase turnover and plan shipments months ahead."'}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-3">
              — {isRu ? 'Руководитель отдела ВЭД оптовой компании по продаже автозапчастей' : 'Head of Foreign Trade, wholesale auto parts company'}
            </p>
          </section>

          {/* CTA + контакты */}
          <section className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Нужна помощь с таможенным оформлением автозапчастей?' : 'Need help with auto parts customs clearance?'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isRu
                ? 'Работаем с поставками автозапчастей из Китая, Европы и других стран, сопровождаем новые и б/у запчасти, агрегаты и комплектующие для легковых и грузовых автомобилей. Отправьте спецификацию или кратко опишите ваш проект — предложим решение и ориентировочную стоимость.'
                : 'We work with auto parts imports from China, Europe, and other countries, handling new and used parts, assemblies, and components for passenger and commercial vehicles. Send us a specification or briefly describe your project.'}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact">
                  <Send className="w-4 h-4 mr-2" />
                  {isRu ? 'Оставить заявку' : 'Submit Request'}
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Telegram
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href="https://max.ru/id3849109300_bot" target="_blank" rel="noopener noreferrer">
                  <img src={maxIcon} alt="MAX" className="w-4 h-4 mr-2" />
                  MAX
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href="mailto:info@innovedbroker.ru">
                  <Mail className="w-4 h-4 mr-2" />
                  info@innovedbroker.ru
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href="tel:+79331881009">
                  <Phone className="w-4 h-4 mr-2" />
                  +7 933 188-10-09
                </a>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
