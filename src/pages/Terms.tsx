import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHero } from '@/components/PageHero';

const content = {
  ru: {
    title: 'Пользовательское соглашение',
    sections: [
      {
        title: '1. Общие положения',
        content: [
          '1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует порядок использования сайта ИННОВЭД (далее — «Сайт») и получение информации об услугах по таможенному оформлению товаров.',
          '1.2. Используя Сайт (в том числе направляя любую заявку через формы Сайта), пользователь подтверждает, что ознакомился с Соглашением и полностью принимает его условия.',
          '1.3. Соглашение не является договором возмездного оказания услуг; любые платные услуги оказываются на основании отдельных договоров/договоров-оферт, заключаемых между ИННОВЭД и клиентом.'
        ]
      },
      {
        title: '2. Услуги и информация на сайте',
        content: [
          '2.1. На Сайте размещается общая информация об услугах ИННОВЭД по таможенному оформлению товаров (импорт, экспорт, транзит и иные операции на территории Российской Федерации).',
          '2.2. Информация на Сайте носит справочный и информационный характер и ни при каких условиях не является публичной офертой в смысле ст. 437 ГК РФ.',
          '2.3. Конкретные условия оказания услуг (объём, сроки, стоимость, ответственность сторон и т.д.) определяются в соответствующем договоре между ИННОВЭД и клиентом и имеют приоритет по отношению к Соглашению в части противоречий.'
        ]
      },
      {
        title: '3. Обязательства и гарантии пользователя',
        content: [
          '3.1. Пользователь обязуется при заполнении форм на Сайте предоставлять актуальную и достоверную информацию, необходимую для обратной связи и/или подготовки предложения о заключении договора.',
          '3.2. Пользователь несёт полную ответственность за последствия предоставления недостоверных, неполных или ошибочных данных, в том числе за возможные задержки и дополнительные расходы, связанные с корректировкой сведений и документов.',
          '3.3. Пользователь обязуется использовать Сайт только в законных целях и не совершать действий, направленных на нарушение работы Сайта, несанкционированный доступ к данным, размещение вредоносной информации и др.'
        ]
      },
      {
        title: '4. Ограничение ответственности ИННОВЭД',
        content: [
          '4.1. ИННОВЭД оказывает услуги по таможенному оформлению товаров только на основании отдельно заключаемых договоров с клиентами — юридическими лицами и/или индивидуальными предпринимателями. Ответственность ИННОВЭД по таким договорам определяется исключительно их условиями и применимым законодательством РФ.',
          '4.2. ИННОВЭД не гарантирует безошибочность, актуальность и полноту информации, размещённой на Сайте, и вправе в любое время изменять такую информацию без предварительного уведомления пользователей. Информация на Сайте носит исключительно информационный характер и не является индивидуальной консультацией либо публичной офертой.',
          '4.3. ИННОВЭД не несёт ответственности за любые прямые или косвенные убытки, упущенную выгоду, утрату данных, репутационный вред, возникшие в связи с использованием либо невозможностью использования Сайта, в том числе вследствие технических сбоев, действий третьих лиц, перебоев в работе сети Интернет, хостинг‑провайдера, операторов связи и др.',
          '4.4. Установленные настоящим Соглашением ограничения ответственности не применяются в части, в которой их применение прямо запрещено законодательством РФ, в том числе при умышленном причинении убытков.'
        ]
      },
      {
        title: '5. Стоимость услуг',
        content: [
          '5.1. Стоимость услуг ИННОВЭД определяется в индивидуальном порядке и сообщается клиенту до заключения соответствующего договора или акцепта публичной оферты (если таковая размещена).',
          '5.2. Любые сведения о ценах и тарифах, размещённые на Сайте, носят ориентировочный характер и не являются окончательным расчётом стоимости услуг до согласования условий с ИННОВЭД.'
        ]
      },
      {
        title: '6. Изменение Соглашения и работа сайта',
        content: [
          '6.1. ИННОВЭД вправе в одностороннем порядке изменять Соглашение и/или функционал Сайта. Обновлённая редакция Соглашения вступает в силу с момента размещения на Сайте, если иной срок не указан в тексте Соглашения.',
          '6.2. Продолжение использования Сайта пользователем после размещения новой редакции Соглашения означает согласие пользователя с такими изменениями.',
          '6.3. ИННОВЭД вправе в любое время приостановить или прекратить работу Сайта (полностью или частично) без предварительного уведомления, не неся ответственности за возможные последствия такого приостановления/прекращения для пользователей.'
        ]
      },
      {
        title: '7. Применимое право и разрешение споров',
        content: [
          '7.1. К настоящему Соглашению и отношениям между ИННОВЭД и пользователями в связи с использованием Сайта подлежит применению право Российской Федерации.',
          '7.2. Все споры и разногласия по поводу использования Сайта по возможности разрешаются путём переговоров. При недостижении соглашения спор подлежит рассмотрению в суде по месту нахождения ИННОВЭД, если иное не предусмотрено императивными нормами законодательства РФ.'
        ]
      }
    ]
  },
  en: {
    title: 'Terms of Service',
    sections: [
      {
        title: '1. General Provisions',
        content: [
          '1.1. This User Agreement (hereinafter — the "Agreement") governs the use of the INNOVED website (hereinafter — the "Website") and obtaining information about customs clearance services.',
          '1.2. By using the Website (including submitting any request through the Website forms), the user confirms that they have read the Agreement and fully accept its terms.',
          '1.3. The Agreement is not a paid services contract; any paid services are provided on the basis of separate contracts/offer agreements between INNOVED and the client.'
        ]
      },
      {
        title: '2. Services and Information on the Website',
        content: [
          '2.1. The Website provides general information about INNOVED customs clearance services (import, export, transit and other operations in the Russian Federation).',
          '2.2. Information on the Website is for reference and informational purposes only and under no circumstances constitutes a public offer within the meaning of Article 437 of the Civil Code of the Russian Federation.',
          '2.3. Specific terms of service (scope, deadlines, cost, liability of parties, etc.) are determined in the relevant contract between INNOVED and the client and take priority over the Agreement in case of contradictions.'
        ]
      },
      {
        title: '3. User Obligations and Guarantees',
        content: [
          '3.1. The user undertakes to provide current and accurate information when filling out forms on the Website, necessary for feedback and/or preparation of a contract proposal.',
          '3.2. The user bears full responsibility for the consequences of providing inaccurate, incomplete or erroneous data, including possible delays and additional costs associated with correcting information and documents.',
          '3.3. The user undertakes to use the Website only for lawful purposes and not to perform actions aimed at disrupting the Website, unauthorized access to data, posting malicious information, etc.'
        ]
      },
      {
        title: '4. Limitation of INNOVED Liability',
        content: [
          '4.1. INNOVED provides customs clearance services only on the basis of separately concluded contracts with clients — legal entities and/or individual entrepreneurs. INNOVED liability under such contracts is determined exclusively by their terms and applicable legislation of the Russian Federation.',
          '4.2. INNOVED does not guarantee the accuracy, relevance and completeness of information posted on the Website and reserves the right to change such information at any time without prior notice. Information on the Website is for informational purposes only and does not constitute individual consultation or a public offer.',
          '4.3. INNOVED is not liable for any direct or indirect damages, lost profits, data loss, reputational harm arising from the use or inability to use the Website, including due to technical failures, actions of third parties, Internet disruptions, hosting provider, telecom operators, etc.',
          '4.4. The limitations of liability established by this Agreement do not apply to the extent that their application is directly prohibited by the legislation of the Russian Federation, including in case of intentional causing of damages.'
        ]
      },
      {
        title: '5. Service Cost',
        content: [
          '5.1. The cost of INNOVED services is determined individually and communicated to the client before concluding the relevant contract or accepting the public offer (if posted).',
          '5.2. Any price and tariff information posted on the Website is approximate and does not constitute a final cost calculation until terms are agreed with INNOVED.'
        ]
      },
      {
        title: '6. Agreement Changes and Website Operation',
        content: [
          '6.1. INNOVED has the right to unilaterally change the Agreement and/or Website functionality. The updated version of the Agreement takes effect from the moment it is posted on the Website, unless otherwise specified.',
          '6.2. Continued use of the Website by the user after posting a new version of the Agreement means the user agrees to such changes.',
          '6.3. INNOVED has the right to suspend or terminate the Website (in whole or in part) at any time without prior notice, without being liable for possible consequences for users.'
        ]
      },
      {
        title: '7. Applicable Law and Dispute Resolution',
        content: [
          '7.1. The law of the Russian Federation applies to this Agreement and the relationship between INNOVED and users in connection with the use of the Website.',
          '7.2. All disputes and disagreements regarding the use of the Website shall be resolved through negotiations where possible. If no agreement is reached, the dispute shall be considered by a court at the location of INNOVED, unless otherwise provided by mandatory rules of the legislation of the Russian Federation.'
        ]
      }
    ]
  }
};

const Terms = () => {
  const { language } = useLanguage();
  const text = content[language];

  return (
    <>
      <SEOHead language={language} page="terms" />
      <PageHero title={text.title} />
      
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {text.sections.map((section, index) => (
              <section key={index} className="bg-card p-6 rounded-lg shadow-card border border-border">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
