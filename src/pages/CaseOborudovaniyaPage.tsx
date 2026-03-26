import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { PageHero } from '@/components/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import caseImage from '@/assets/case-oborud.webp';
import maxIcon from '@/assets/max-icon.png';

const keywords = 'растаможка оборудования, таможенное оформление оборудования, растаможка станков, белый импорт оборудования, кейс, таможенный брокер оборудование, импорт технологического оборудования';

export default function CaseOborudovaniyaPage() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log('[SEO] Applied keywords:', keywords);
    analytics.pageView('/rastamojka-oborudovaniya', 'Растаможка оборудования — кейс ИННОВЭД');
  }, []);

  const isRu = language === 'ru';

  return (
    <>
      <SEOHead
        language={language}
        page="home"
        customTitle={isRu ? 'Растаможка оборудования — кейс ИННОВЭД' : 'Equipment Customs Clearance — INNOVED Case Study'}
        customDescription={isRu
          ? 'Таможенное оформление оборудования, растаможка станков, белый импорт оборудования, кейс.'
          : 'Customs clearance of equipment, CNC machines clearance, white import, case study.'}
        customKeywords={keywords}
        canonicalPath="/rastamojka-oborudovaniya"
      />
      <PageHero
        title={isRu ? 'Растаможка технологического оборудования' : 'Industrial Equipment Customs Clearance'}
        subtitle={isRu
          ? 'Кейс: сокращение сроков оформления с 10–14 дней до 2–3 дней'
          : 'Case Study: clearance time reduced from 10–14 to 2–3 days'}
      />

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={caseImage} alt="Таможенное оформление технологического оборудования" className="w-full h-auto object-cover" />
          </div>

          {/* Intro */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {isRu
              ? 'К нам обратился производственный холдинг, который регулярно сталкивался с простоями импортного технологического оборудования на складе временного хранения из-за медленной и неквалифицированной работы прежних таможенных брокеров. Мы взяли проект в работу, оптимизировали всю цепочку оформления и сократили простои до минимума.'
              : 'A manufacturing holding contacted us about regular delays of imported industrial equipment at temporary storage due to slow and unqualified work of previous customs brokers. We took on the project, optimized the entire clearance chain, and minimized downtime.'}
          </p>

          {/* Кратко о проекте */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Кратко о проекте' : 'Project Summary'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong>{isRu ? 'Клиент' : 'Client'}:</strong> {isRu ? 'производственный холдинг с несколькими заводами, регулярный импорт технологического оборудования из Европы и Азии.' : 'manufacturing holding with multiple factories, regular imports of industrial equipment from Europe and Asia.'}</li>
              <li><strong>{isRu ? 'Задача' : 'Goal'}:</strong> {isRu ? 'устранить регулярные простои оборудования на таможне и складе временного хранения, которые срывали производственные планы.' : 'eliminate regular equipment downtime at customs and temporary storage that disrupted production schedules.'}</li>
              <li><strong>{isRu ? 'Проблема' : 'Problem'}:</strong> {isRu ? 'прежние таможенные брокеры работали медленно и некачественно — каждая партия задерживалась на 7–14 дней, накапливались штрафы за хранение.' : 'previous brokers worked slowly — each shipment was delayed 7–14 days with accumulating storage penalties.'}</li>
              <li><strong>{isRu ? 'Решение' : 'Solution'}:</strong> {isRu ? 'полная перестройка процесса таможенного оформления — от предварительного анализа документов до координации всех участников цепочки.' : 'complete overhaul of the customs clearance process — from preliminary document analysis to coordination of all parties.'}</li>
              <li><strong>{isRu ? 'Результат' : 'Result'}:</strong> {isRu ? 'сокращение среднего срока оформления с 10–14 дней до 2–3 рабочих дней, снижение затрат на простои и хранение на 65%.' : 'average clearance time reduced from 10–14 to 2–3 business days, storage and downtime costs cut by 65%.'}</li>
            </ul>
          </section>

          {/* Исходная ситуация */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Исходная ситуация: постоянные простои из-за медленных контрагентов' : 'Initial Situation: Constant Delays Due to Slow Contractors'}
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Клиент регулярно импортировал сложное технологическое оборудование для модернизации производственных линий: станки с ЧПУ, прессы, литейное оборудование, промышленные роботы, системы автоматизации, измерительные приборы и запасные части. Поставки шли из Германии, Италии, Китая, Южной Кореи и других стран.'
                : 'The client regularly imported complex industrial equipment: CNC machines, presses, foundry equipment, industrial robots, automation systems, measuring instruments, and spare parts from Germany, Italy, China, South Korea, and other countries.'}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Таможенным оформлением занимались разные брокеры, результат был катастрофическим: каждая партия застревала на таможне и складе временного хранения на 7–14 дней. Брокеры работали медленно, допускали ошибки в документах, поздно реагировали на запросы таможни.'
                : 'Different brokers handled customs clearance with catastrophic results: each shipment was stuck at customs for 7–14 days. Brokers worked slowly, made document errors, and responded late to customs requests.'}
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Средний срок таможенного оформления составлял 10–14 дней вместо заявленных 2–3 дней.' : 'Average clearance time was 10–14 days instead of the stated 2–3 days.'}</li>
              <li>{isRu ? 'Каждая партия генерировала дополнительные расходы на хранение — от 50 до 200 тысяч рублей за простой.' : 'Each shipment generated additional storage costs — 50 to 200 thousand rubles per delay.'}</li>
              <li>{isRu ? 'Регулярные срывы производственных планов: оборудование не приходило вовремя, запуск новых линий откладывался.' : 'Regular production schedule disruptions: equipment didn\'t arrive on time, new line launches were delayed.'}</li>
              <li>{isRu ? 'Ошибки в документах и кодах ТН ВЭД приводили к дополнительным проверкам и досмотрам.' : 'Document and HS code errors led to additional inspections and examinations.'}</li>
            </ul>
          </section>

          {/* Цели клиента */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Цели клиента' : 'Client Goals'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Сократить фактический срок таможенного оформления с 10–14 дней до 2–3 рабочих дней.' : 'Reduce actual clearance time from 10–14 to 2–3 business days.'}</li>
              <li>{isRu ? 'Устранить регулярные простои на складе временного хранения и минимизировать затраты на хранение.' : 'Eliminate regular downtime at temporary storage and minimize storage costs.'}</li>
              <li>{isRu ? 'Получить предсказуемость: понимать заранее, когда оборудование будет выпущено.' : 'Gain predictability: know in advance when equipment will be released.'}</li>
              <li>{isRu ? 'Найти ответственного партнёра, который будет координировать всех участников цепочки.' : 'Find a responsible partner who will coordinate all parties in the chain.'}</li>
              <li>{isRu ? 'Исключить ошибки в документах и кодах ТН ВЭД.' : 'Eliminate document and HS code errors.'}</li>
            </ul>
          </section>

          {/* Наше решение */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Наше решение' : 'Our Solution'}
            </h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Предварительный анализ документов до прибытия груза' : 'Preliminary Document Analysis Before Cargo Arrival'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Вместо реактивной работы «груз пришёл — начали оформлять» мы внедрили проактивную модель: начинаем работу за 5–7 дней до прибытия оборудования. Запрашиваем полный пакет документов заранее, проверяем корректность данных, подбираем коды ТН ВЭД с учётом функционального назначения и технических характеристик.'
                : 'Instead of reactive "cargo arrived — start processing," we implemented a proactive model: work begins 5–7 days before equipment arrival. We request the full document package in advance, verify data accuracy, and select HS codes based on functional purpose and technical specifications.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Координация всех участников цепочки' : 'Coordination of All Chain Participants'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Взяли на себя функцию координатора: согласуем время прибытия груза с логистом, информируем склад о характере оборудования, синхронизируем подачу декларации. У клиента один ответственный менеджер, который знает статус каждой партии в режиме реального времени.'
                : 'We took on the coordinator role: coordinating arrival times with logistics, informing the warehouse about equipment specifics, synchronizing declaration submission. The client has one dedicated manager who knows every shipment\'s real-time status.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Оперативное взаимодействие с таможенными органами' : 'Rapid Customs Authority Communication'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Работаем по принципу «ответ в день запроса». Если таможня запрашивает дополнительные документы или пояснения — предоставляем в течение нескольких часов. Каждый лишний день на складе — прямые убытки для клиента.'
                : 'We work on a "same-day response" principle. If customs requests additional documents or explanations — we provide them within hours. Every extra day in storage means direct losses for the client.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Прозрачность и управление ожиданиями' : 'Transparency and Expectation Management'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Клиент получает ежедневные обновления по статусу каждой партии. Перед каждой поставкой даём прогноз по срокам с учётом специфики груза и таможенного поста. Если возникает задержка — сразу сообщаем причину и реальный срок выпуска.'
                : 'The client receives daily updates on every shipment\'s status. Before each delivery, we provide a timeline forecast considering cargo specifics and customs post. If delays occur — we immediately communicate the reason and realistic release date.'}
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
                    <td className="p-4">{isRu ? '10–14 дней' : '10–14 days'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? '2–3 рабочих дня' : '2–3 business days'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Доля партий с задержкой более 5 дней' : 'Shipments delayed 5+ days'}</td>
                    <td className="p-4">{isRu ? 'около 80%' : 'about 80%'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'менее 5%' : 'less than 5%'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Затраты на хранение за партию' : 'Storage costs per shipment'}</td>
                    <td className="p-4">{isRu ? '100–200 тыс. руб.' : '100–200K RUB'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? '15–30 тыс. руб.' : '15–30K RUB'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Снижение затрат на простои и хранение' : 'Cost reduction for downtime & storage'}</td>
                    <td className="p-4">—</td>
                    <td className="p-4 text-primary font-semibold">−65%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Срывы производственных планов' : 'Production schedule disruptions'}</td>
                    <td className="p-4">{isRu ? '2–3 раза в месяц' : '2–3 times/month'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Не более 1 раза в квартал' : 'No more than 1/quarter'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Предсказуемость сроков' : 'Timeline predictability'}</td>
                    <td className="p-4">{isRu ? 'Низкая' : 'Low'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Высокая, ±1 день' : 'High, ±1 day'}</td>
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
                ? '«Мы годами мирились с тем, что каждая партия импортного оборудования превращается в лотерею. Простои на таможне от недели до двух недель были нормой. Когда вы взялись за проект, первым делом навели порядок в документах и выстроили координацию между всеми участниками. Сейчас среднее оформление занимает 2–3 дня вместо прежних двух недель. Мы наконец-то можем планировать запуск оборудования и не держать аварийный запас времени на непредсказуемую таможню. Это изменило всю логистику наших проектов».'
                : '"For years we accepted that every imported equipment shipment was a lottery. Customs delays of 1–2 weeks were normal. When you took on the project, you first organized our documents and built coordination between all parties. Now average clearance takes 2–3 days instead of two weeks. We can finally plan equipment launches without emergency time buffers. This changed our entire project logistics."'}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-3">
              — {isRu ? 'Директор по логистике производственного холдинга' : 'Logistics Director, manufacturing holding'}
            </p>
          </section>

          {/* CTA + контакты */}
          <section className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Нужна помощь с таможенным оформлением оборудования?' : 'Need help with equipment customs clearance?'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isRu
                ? 'Специализируемся на растаможке сложного промышленного и технологического оборудования: станки с ЧПУ, прессы, литейное оборудование, промышленные роботы, системы автоматизации. Опишите ваш проект или отправьте спецификацию — предложим решение и рассчитаем реальные сроки.'
                : 'We specialize in customs clearance of complex industrial equipment: CNC machines, presses, foundry equipment, industrial robots, automation systems. Describe your project or send a specification — we\'ll propose a solution and calculate realistic timelines.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild className="w-full">
                <Link to="/contact">
                  <Send className="w-4 h-4 mr-2" />
                  {isRu ? 'Оставить заявку' : 'Submit Request'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://t.me/innovaborker" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Telegram
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://max.ru/call/innovedbroker" target="_blank" rel="noopener noreferrer">
                  <img src={maxIcon} alt="MAX" className="w-4 h-4 mr-2" />
                  MAX
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:info@innovedbroker.ru">
                  <Mail className="w-4 h-4 mr-2" />
                  info@innovedbroker.ru
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full sm:col-span-2">
                <a href="tel:+73952434977">
                  <Phone className="w-4 h-4 mr-2" />
                  +7 (3952) 43-49-77
                </a>
              </Button>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
