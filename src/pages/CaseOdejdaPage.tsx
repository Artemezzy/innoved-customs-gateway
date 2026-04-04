import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { PageHero } from '@/components/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import caseImage from '@/assets/case-dress.webp';
import maxIcon from '@/assets/max-icon.png';

const keywords = 'растаможка одежды, таможенное оформление одежды из Турции, растаможка одежды, ТО текстиля, белый импорт одежды, кейс, импорт турецкой одежды, таможенный брокер одежда';

export default function CaseOdejdaPage() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log('[SEO] Applied keywords:', keywords);
    analytics.pageView('/rastamojka-odejdi', 'Растаможка одежды — кейс ИННОВЭД');
  }, []);

  const isRu = language === 'ru';

  return (
    <>
      <SEOHead
        language={language}
        page="caseOdejda"
        canonicalPath="/rastamojka-odejdi"
      />
      <PageHero
        title={isRu ? 'Растаможка одежды из Турции' : 'Clothing Customs Clearance from Turkey'}
        subtitle={isRu
          ? 'Кейс: оформление сложного проекта, от которого отказались другие брокеры'
          : 'Case Study: handling a complex project rejected by other brokers'}
      />

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="sr-only">{isRu ? 'Как проходит таможенное оформление: этапы, документы и результат' : 'How customs clearance works: stages, documents and results'}</h2>
          <h3 className="sr-only">{isRu ? 'Практические детали кейса и особенности оформления' : 'Practical case details and clearance specifics'}</h3>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={caseImage} alt="Таможенное оформление одежды из Турции" className="w-full h-auto object-cover" />
          </div>

          {/* Intro */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {isRu
              ? 'К нам обратился дистрибьютор турецкой одежды среднего ценового сегмента, который столкнулся с отказами со стороны брокеров и завышенными тарифами на растаможку сложной партии товара. Мы взяли проект в работу, донастроили схему и довели его до выпуска без переплат и штрафов.'
              : 'A mid-range Turkish clothing distributor came to us after facing refusals from brokers and inflated tariffs for customs clearance of a complex shipment. We took the project, fine-tuned the process, and completed it without overpayments or penalties.'}
          </p>

          {/* Кратко о проекте */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Кратко о проекте' : 'Project Summary'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong>{isRu ? 'Клиент' : 'Client'}:</strong> {isRu ? 'дистрибьютор женской и мужской одежды из Турции, сеть розничных магазинов и онлайн-продажи в России.' : 'distributor of men\'s and women\'s clothing from Turkey, retail chain and online sales in Russia.'}</li>
              <li><strong>{isRu ? 'Задача' : 'Goal'}:</strong> {isRu ? 'оформить партию турецкой брендированной одежды с разными составами тканей и маркировкой, по адекватной цене и в чёткие сроки.' : 'clear a shipment of branded Turkish clothing with various fabric compositions and labeling, at a fair price and within clear deadlines.'}</li>
              <li><strong>{isRu ? 'Проблема' : 'Problem'}:</strong> {isRu ? 'другие брокеры отказывались вести проект из-за «сложной номенклатуры» или озвучивали завышенную стоимость оформления в 1,5–2 раза выше рыночной.' : 'other brokers refused the project due to "complex nomenclature" or quoted prices 1.5–2x above market rate.'}</li>
              <li><strong>{isRu ? 'Решение' : 'Solution'}:</strong> {isRu ? 'детальный анализ турецкой номенклатуры, корректный подбор кодов ТН ВЭД, выстраивание схемы с учётом маркировки и сертификации.' : 'detailed analysis of Turkish nomenclature, correct HS code selection, process setup accounting for labeling and certification.'}</li>
              <li><strong>{isRu ? 'Результат' : 'Result'}:</strong> {isRu ? 'выпуск партии за 3 рабочих дня, экономия до 22% по сравнению с предложениями других брокеров, без штрафов и претензий со стороны таможни.' : 'shipment released in 3 business days, up to 22% savings vs other brokers\' quotes, no fines or customs claims.'}</li>
            </ul>
          </section>

          {/* Исходная ситуация */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Исходная ситуация: отказы брокеров и завышенные цены' : 'Initial Situation: Broker Refusals and Inflated Prices'}
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Клиент планировал регулярный импорт одежды из Турции для своей сети магазинов: платья, костюмы, рубашки, верхняя одежда, трикотаж, джинсовые изделия. В одной партии было несколько десятков артикулов турецких производителей с разным составом тканей (хлопок, полиэстер, вискоза, смесовые ткани), размерной сеткой и назначением, а также товар с обязательной маркировкой «Честный ЗНАК».'
                : 'The client planned regular imports of clothing from Turkey for their retail chain: dresses, suits, shirts, outerwear, knitwear, denim. One shipment contained dozens of items from Turkish manufacturers with different fabric compositions (cotton, polyester, viscose, blends), size grids, and purposes, plus goods requiring mandatory "Chestniy ZNAK" labeling.'}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'При обращении к таможенным брокерам клиент столкнулся с неожиданными сложностями. Часть компаний прямо отказывалась от оформления турецкой одежды, аргументируя это «слишком сложной номенклатурой» и «высокими рисками по маркировке». Те немногие брокеры, кто соглашался работать, предлагали заведомо завышенные тарифы — на 50–100% выше обычных ставок.'
                : 'When approaching customs brokers, the client faced unexpected difficulties. Some companies outright refused Turkish clothing clearance, citing "overly complex nomenclature" and "high labeling risks." The few brokers who agreed offered deliberately inflated tariffs — 50–100% above standard rates.'}
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Прямые отказы: «берите проще товар или работайте с одним поставщиком» — типичный ответ от брокеров.' : 'Direct refusals: "take simpler goods or work with one supplier" — typical broker response.'}</li>
              <li>{isRu ? 'Завышенная стоимость: предложенная цена оформления была на 20–30% выше ожидаемой клиентом.' : 'Inflated costs: proposed clearance price was 20–30% above client expectations.'}</li>
              <li>{isRu ? 'Непрозрачность расчётов: многие брокеры не объясняли структуру цены и ссылались на абстрактные «риски».' : 'Opaque pricing: many brokers couldn\'t explain the price structure, citing vague "risks."'}</li>
              <li>{isRu ? 'Риск срыва сезона: затянувшийся поиск исполнителя грозил упустить период продаж турецких коллекций.' : 'Season risk: prolonged search for a broker threatened to miss the sales period for Turkish collections.'}</li>
            </ul>
          </section>

          {/* Цели клиента */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Цели клиента' : 'Client Goals'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Получить понятную и прозрачную схему растаможки турецкой одежды для сложной многопозиционной партии товара.' : 'Get a clear, transparent clearance process for a complex multi-item shipment.'}</li>
              <li>{isRu ? 'Снизить заявленную другими брокерами стоимость услуг без потери качества сопровождения.' : 'Reduce the cost quoted by other brokers without sacrificing service quality.'}</li>
              <li>{isRu ? 'Оформить первую тестовую поставку в чёткие сроки (не более 3–5 рабочих дней), чтобы успеть выйти в сезон продаж.' : 'Complete the first test shipment within 3–5 business days to hit the sales season.'}</li>
              <li>{isRu ? 'Найти надёжного партнёра для регулярных поставок турецкой одежды.' : 'Find a reliable partner for regular Turkish clothing imports.'}</li>
            </ul>
          </section>

          {/* Наше решение */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Наше решение' : 'Our Solution'}
            </h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Детальный разбор номенклатуры и подбор кодов ТН ВЭД' : 'Detailed Nomenclature Analysis and HS Code Selection'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Мы запросили у клиента детализированные данные по каждой позиции турецкой одежды: фотографии изделий, описание моделей, состав тканей по этикеткам, назначение, бренды турецких производителей, наличие маркировки «Честный ЗНАК». Для каждой группы подобрали корректные коды ТН ВЭД с учётом пола, размера, состава тканей и назначения изделий.'
                : 'We requested detailed data for each item: product photos, model descriptions, fabric composition from labels, purpose, Turkish brand names, and "Chestniy ZNAK" labeling status. For each group, we selected correct HS codes considering gender, size, fabric composition, and purpose.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Подготовка документов с учётом маркировки и сертификации' : 'Document Preparation with Labeling and Certification'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Совместно с клиентом сформировали полный пакет документов: контракт с турецким поставщиком, инвойс с детализацией по артикулам, упаковочные листы, спецификации по моделям и составу тканей, документы по маркировке «Честный ЗНАК» и сертификаты соответствия.'
                : 'Together with the client, we prepared a complete document package: contract with the Turkish supplier, itemized invoice, packing lists, model specifications and fabric composition, "Chestniy ZNAK" labeling documents, and compliance certificates.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Прозрачная ценовая модель' : 'Transparent Pricing Model'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Вместо общей завышенной ставки «за риск и сложность», как предлагали другие брокеры, мы разложили стоимость услуг по конкретным этапам: работа с номенклатурой и подбор кодов ТН ВЭД, подготовка документов, оформление декларации, таможенное сопровождение до выпуска груза. Никаких скрытых платежей и «надбавок за сложность».'
                : 'Instead of a general inflated rate "for risk and complexity" as other brokers offered, we broke down costs by specific stages: nomenclature work and HS code selection, document preparation, declaration processing, customs support until release. No hidden fees or "complexity surcharges."'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Полное таможенное сопровождение' : 'Full Customs Support'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Мы взяли на себя всё взаимодействие с таможенными органами, складом временного хранения и логистическими компаниями. У клиента был персональный менеджер, который держал его в курсе по всем этапам оформления.'
                : 'We handled all communication with customs authorities, temporary storage facilities, and logistics companies. The client had a dedicated manager keeping them updated at every stage.'}
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
                    <td className="p-4">{isRu ? 'Готовность брокеров взять проект' : 'Broker willingness to take project'}</td>
                    <td className="p-4">{isRu ? 'Отказы или условие «упростить номенклатуру»' : 'Refusals or "simplify nomenclature" condition'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Проект принят в исходном виде' : 'Project accepted as-is'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Стоимость услуг' : 'Service cost'}</td>
                    <td className="p-4">{isRu ? '+20–30% к ожиданиям клиента' : '+20–30% above client expectations'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Экономия до 22%' : 'Up to 22% savings'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Срок оформления' : 'Clearance time'}</td>
                    <td className="p-4">{isRu ? 'Под вопросом, без гарантий' : 'Uncertain, no guarantees'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? '3 рабочих дня' : '3 business days'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Риски штрафов и доначислений' : 'Fine and surcharge risks'}</td>
                    <td className="p-4">{isRu ? 'Высокие' : 'High'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Минимизированы' : 'Minimized'}</td>
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
                ? '«До обращения к вам мы потратили несколько недель на поиск таможенного брокера для турецкой одежды: кто-то сразу отказывался из-за якобы сложности партии, кто-то называл такую цену, словно речь идёт о сверхрисковом грузе. В результате ваш профессиональный подход с подробным разбором номенклатуры, честным объяснением всех нюансов и прозрачной ценой без накруток позволил нам не только уложиться в бюджет, но и успеть вывести турецкую коллекцию к началу сезона продаж. Теперь работаем с вами на постоянной основе».'
                : '"Before contacting you, we spent several weeks searching for a customs broker for Turkish clothing: some immediately refused due to the supposed complexity, others quoted prices as if it were a high-risk cargo. Your professional approach with detailed nomenclature analysis, honest explanation of all nuances, and transparent pricing allowed us to stay within budget and launch the Turkish collection for the sales season. Now we work with you on a permanent basis."'}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-3">
              — {isRu ? 'Собственник компании-дистрибьютора турецкой одежды' : 'Owner, Turkish clothing distribution company'}
            </p>
          </section>

          {/* CTA + контакты */}
          <section className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Нужна помощь с растаможкой турецкой одежды?' : 'Need help with Turkish clothing customs clearance?'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isRu
                ? 'Берём в работу сложные партии турецкой одежды с большим количеством артикулов и разнообразной номенклатурой. Опишите ваш проект по импорту или прикрепите спецификацию — предложим оптимальные варианты оформления и детальный расчёт стоимости.'
                : 'We handle complex Turkish clothing shipments with many items and diverse nomenclature. Describe your import project or attach a specification — we\'ll offer optimal clearance options and a detailed cost estimate.'}
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
