import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { PageHero } from '@/components/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import caseImage from '@/assets/case-tech.webp';
import maxIcon from '@/assets/max-icon.png';

const keywords = 'растаможка техники, таможенное оформление техники, растаможка бытовой техники, белый импорт электроприборов, кейс, сертификация EAC, маркировка Честный ЗНАК';

export default function CaseTechnikiPage() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log('[SEO] Applied keywords:', keywords);
    analytics.pageView('/rastamojka-tehniki', 'Растаможка техники — кейс ИННОВЭД');
  }, []);

  const isRu = language === 'ru';

  return (
    <>
      <SEOHead
        language={language}
        page="caseTehniki"
        canonicalPath="/rastamojka-tehniki"
      />
      <PageHero
        title={isRu ? 'Растаможка бытовой техники' : 'Household Appliance Customs Clearance'}
        subtitle={isRu
          ? 'Кейс: от регулярных блокировок партий к стабильным поставкам без остановок'
          : 'Case Study: from regular shipment blocks to stable deliveries without interruptions'}
      />

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={caseImage} alt="Таможенное оформление бытовой техники" className="w-full h-auto object-cover" />
          </div>

          {/* Intro */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {isRu
              ? 'К нам обратился дистрибьютор бытовой техники, который регулярно сталкивался с блокировкой партий на таможне из-за проблем с сертификацией EAC и маркировкой «Честный ЗНАК». Предыдущие брокеры не уделяли внимания подготовке разрешительной документации заранее, что приводило к срывам поставок и финансовым потерям. Мы выстроили комплексный процесс с упреждающей подготовкой всех документов.'
              : 'A household appliance distributor contacted us about regular shipment blocks at customs due to EAC certification and "Chestniy ZNAK" labeling issues. Previous brokers didn\'t prepare permits in advance, leading to delivery disruptions and financial losses. We built a comprehensive process with proactive document preparation.'}
          </p>

          {/* Кратко о проекте */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Кратко о проекте' : 'Project Summary'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong>{isRu ? 'Клиент' : 'Client'}:</strong> {isRu ? 'дистрибьютор бытовой техники и электроники из Китая и Южной Кореи, развитая сеть региональных партнёров и розничных точек.' : 'distributor of household appliances and electronics from China and South Korea, with an extensive network of regional partners and retail outlets.'}</li>
              <li><strong>{isRu ? 'Задача' : 'Goal'}:</strong> {isRu ? 'устранить регулярные блокировки партий бытовой техники на таможне из-за отсутствия или некорректного оформления сертификатов EAC и маркировки.' : 'eliminate regular shipment blocks due to missing or incorrect EAC certificates and labeling.'}</li>
              <li><strong>{isRu ? 'Проблема' : 'Problem'}:</strong> {isRu ? 'прежние брокеры занимались только декларированием, не координировали получение сертификатов соответствия и кодов маркировки заранее — в результате груз приходил, а оформить его было невозможно.' : 'previous brokers only handled declarations without coordinating certification and labeling codes in advance — cargo arrived but couldn\'t be cleared.'}</li>
              <li><strong>{isRu ? 'Решение' : 'Solution'}:</strong> {isRu ? 'комплексное сопровождение импорта бытовой техники — от предварительной сертификации EAC и регистрации в системе «Честный ЗНАК» до таможенного оформления и выпуска груза.' : 'comprehensive import support — from preliminary EAC certification and "Chestniy ZNAK" registration to customs clearance and cargo release.'}</li>
            </ul>
          </section>

          {/* Исходная ситуация */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Исходная ситуация: регулярные блокировки из-за документов' : 'Initial Situation: Regular Blocks Due to Documents'}
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Клиент импортировал широкий ассортимент бытовой техники из Китая и Южной Кореи: холодильники, стиральные машины, посудомоечные машины, пылесосы, микроволновые печи, мультиварки, кондиционеры, телевизоры, аудиосистемы и мелкую бытовую технику. Объёмы поставок были значительными — несколько контейнеров в месяц.'
                : 'The client imported a wide range of appliances from China and South Korea: refrigerators, washing machines, dishwashers, vacuums, microwaves, multicookers, air conditioners, TVs, audio systems, and small appliances. Volumes were significant — several containers per month.'}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Таможенным оформлением занимались разные брокеры. Однако практически каждая партия сталкивалась с одной и той же проблемой: груз прибывал в Россию, подавалась декларация, и таможня требовала сертификаты соответствия EAC и коды маркировки «Честный ЗНАК». Брокеры начинали паниковать и перекладывать ответственность на клиента.'
                : 'Different brokers handled customs clearance. However, nearly every shipment faced the same problem: cargo arrived in Russia, a declaration was filed, and customs demanded EAC certificates and "Chestniy ZNAK" labeling codes. Brokers panicked and shifted responsibility to the client.'}
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Партии регулярно блокировались на таможне на срок от 3 до 8 недель до получения всех разрешительных документов.' : 'Shipments were regularly blocked at customs for 3 to 8 weeks until all permits were obtained.'}</li>
              <li>{isRu ? 'Расходы на хранение достигали 150–300 тысяч рублей за контейнер.' : 'Storage costs reached 150–300 thousand rubles per container.'}</li>
              <li>{isRu ? 'Высокий риск возврата или уничтожения груза при невозможности своевременного получения сертификатов.' : 'High risk of cargo return or destruction if certificates couldn\'t be obtained in time.'}</li>
              <li>{isRu ? 'Срывы договорённостей с розничными сетями и региональными партнёрами.' : 'Broken agreements with retail chains and regional partners.'}</li>
              <li>{isRu ? 'Брокеры снимали с себя ответственность: «Мы занимаемся только декларированием, сертификация — это ваша задача».' : 'Brokers disclaimed responsibility: "We only handle declarations, certification is your task."'}</li>
            </ul>
          </section>

          {/* Цели клиента */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Цели клиента' : 'Client Goals'}
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>{isRu ? 'Устранить регулярные блокировки партий бытовой техники на таможне из-за отсутствия сертификатов EAC и маркировки.' : 'Eliminate regular blocks due to missing EAC certificates and labeling.'}</li>
              <li>{isRu ? 'Получить предсказуемый и управляемый процесс импорта.' : 'Achieve a predictable and manageable import process.'}</li>
              <li>{isRu ? 'Сократить общий цикл поставки от размещения заказа до поступления товара на склад в России.' : 'Reduce the overall delivery cycle from order placement to warehouse arrival in Russia.'}</li>
              <li>{isRu ? 'Найти партнёра, который возьмёт на себя координацию всей цепочки: сертификацию, маркировку и декларирование.' : 'Find a partner to coordinate the entire chain: certification, labeling, and declaration.'}</li>
              <li>{isRu ? 'Минимизировать риски штрафов, возврата груза или уничтожения товара.' : 'Minimize risks of fines, cargo returns, or product destruction.'}</li>
            </ul>
          </section>

          {/* Наше решение */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Наше решение' : 'Our Solution'}
            </h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Предварительный аудит номенклатуры и требований к сертификации' : 'Preliminary Nomenclature Audit and Certification Requirements'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Мы начали работу с полного аудита номенклатуры импортируемой бытовой техники. Для каждой товарной группы определили: требуется ли обязательная сертификация EAC или достаточно декларации о соответствии, какие технические регламенты применяются, требуется ли маркировка «Честный ЗНАК», какие испытания необходимы. Составили чёткую матрицу по каждой модели техники.'
                : 'We started with a full audit of imported appliance nomenclature. For each product group, we determined: whether mandatory EAC certification or a declaration of conformity is required, which technical regulations apply, whether "Chestniy ZNAK" labeling is needed, and what tests are necessary. We created a clear matrix for each appliance model.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Организация получения сертификатов EAC до отгрузки товара' : 'EAC Certificate Acquisition Before Shipment'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Ключевое изменение — начинать процесс сертификации ещё до отгрузки товара из страны-производителя. Мы подключали аккредитованные сертификационные центры, запрашивали у производителя техническую документацию и протоколы испытаний. Параллельно согласовывали нанесение знака EAC на упаковку с производителем.'
                : 'The key change was starting certification before shipment from the manufacturing country. We engaged accredited certification centers, requested technical documentation and test protocols from manufacturers. Simultaneously coordinated EAC marking on packaging with manufacturers.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Регистрация в системе маркировки «Честный ЗНАК»' : '"Chestniy ZNAK" Labeling Registration'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Мы выстроили процесс заблаговременной регистрации товара в системе и получения кодов маркировки. Зарегистрировали клиента как участника оборота маркированной продукции, согласовали с производителями порядок нанесения кодов Data Matrix на упаковку ещё на заводе. К моменту прибытия груза все коды были внесены в систему.'
                : 'We built a process for advance product registration and labeling code acquisition. Registered the client as a participant in labeled product circulation, coordinated Data Matrix code application on packaging at the factory. By arrival, all codes were entered in the system.'}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
              {isRu ? 'Комплексное таможенное оформление с готовым пакетом документов' : 'Comprehensive Clearance with Complete Document Package'}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {isRu
                ? 'Когда партия прибывала в Россию, мы подавали декларацию с уже готовым полным пакетом документов: контракт, инвойс, упаковочные листы, транспортные документы, сертификаты EAC, документы о регистрации в системе маркировки. Оформление проходило за 2–3 рабочих дня без блокировок.'
                : 'When shipments arrived in Russia, we filed declarations with a complete document package: contract, invoice, packing lists, transport documents, EAC certificates, labeling registration documents. Clearance was completed in 2–3 business days without blocks.'}
            </p>
          </section>

          {/* Результаты */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Результаты' : 'Results'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isRu
                ? 'За первый год работы мы полностью изменили ситуацию с импортом бытовой техники. Блокировки партий прекратились, цикл поставки сократился, финансовые потери от простоев и штрафов исчезли. Экономия на прямых затратах за первый год составила более 8 миллионов рублей.'
                : 'In the first year, we completely transformed the appliance import situation. Shipment blocks ceased, delivery cycles shortened, and financial losses from downtime and fines disappeared. Direct cost savings in the first year exceeded 8 million rubles.'}
            </p>
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
                    <td className="p-4">{isRu ? 'Доля заблокированных партий' : 'Blocked shipments share'}</td>
                    <td className="p-4">{isRu ? 'около 30%' : 'about 30%'}</td>
                    <td className="p-4 text-primary font-semibold">0%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Средний срок блокировки партии' : 'Average block duration'}</td>
                    <td className="p-4">{isRu ? '3–8 недель' : '3–8 weeks'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Блокировки устранены' : 'Blocks eliminated'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Затраты на хранение' : 'Storage costs'}</td>
                    <td className="p-4">{isRu ? '150–300 тыс. руб. за контейнер' : '150–300K RUB/container'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Отсутствуют' : 'None'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Общий цикл поставки' : 'Total delivery cycle'}</td>
                    <td className="p-4">{isRu ? '60–80 дней' : '60–80 days'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? '15–30 дней' : '15–30 days'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Срывы поставок партнёрам' : 'Delivery disruptions to partners'}</td>
                    <td className="p-4">{isRu ? '40–50% заказов' : '40–50% of orders'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Менее 5%' : 'Less than 5%'}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">{isRu ? 'Риски штрафов и возврата груза' : 'Fine & cargo return risks'}</td>
                    <td className="p-4">{isRu ? 'Высокие' : 'High'}</td>
                    <td className="p-4 text-primary font-semibold">{isRu ? 'Минимизированы до нуля' : 'Minimized to zero'}</td>
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
                ? '«Работа с бытовой техникой из Азии превратилась в кошмар после ужесточения требований по сертификации и введения обязательной маркировки. Каждая партия становилась лотереей. Брокеры разводили руками и говорили "это не наша зона ответственности". Когда вы взялись за проект, впервые кто-то объяснил нам всю цепочку и предложил готовить все документы заранее. Сейчас у нас нет блокировок на таможне, все партии проходят оформление за 2–3 дня, мы можем давать чёткие сроки нашим клиентам. Это полностью изменило качество нашей работы и репутацию на рынке».'
                : '"Working with household appliances from Asia became a nightmare after stricter certification requirements and mandatory labeling. Every shipment was a lottery. Brokers shrugged and said \'that\'s not our responsibility.\' When you took on the project, for the first time someone explained the entire chain and proposed preparing all documents in advance. Now we have no customs blocks, all shipments clear in 2–3 days, and we can give firm timelines to our clients. This completely changed the quality of our work and market reputation."'}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-3">
              — {isRu ? 'Генеральный директор компании-дистрибьютора бытовой техники' : 'CEO, household appliance distribution company'}
            </p>
          </section>

          {/* CTA + контакты */}
          <section className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRu ? 'Нужна помощь с таможенным оформлением бытовой техники?' : 'Need help with appliance customs clearance?'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isRu
                ? 'Специализируемся на комплексном сопровождении импорта бытовой техники и электроники с полным циклом подготовки разрешительных документов: сертификация EAC, регистрация в системе маркировки «Честный ЗНАК», таможенное декларирование и выпуск груза. Опишите вашу номенклатуру или отправьте спецификацию — проведём аудит требований и рассчитаем сроки.'
                : 'We specialize in comprehensive household appliance and electronics import support with full permit preparation: EAC certification, "Chestniy ZNAK" labeling registration, customs declaration and cargo release. Describe your product range or send a specification — we\'ll audit requirements and calculate timelines.'}
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
                <a href="tel:+79331881009">
                  <Phone className="w-4 h-4 mr-2" />
                  8 933 188 10 09
                </a>
              </Button>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
