import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHero } from '@/components/PageHero';

const content = {
  ru: {
    title: 'Политика конфиденциальности',
    sections: [
      {
        title: '1. Общие положения',
        content: [
          '1.1. Настоящая политика в отношении обработки персональных данных (далее — Политика) подготовлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и иными нормами действующего законодательства Российской Федерации в области защиты персональных данных.',
          '1.2. Политика определяет общий порядок обработки персональных данных пользователей сайта ИННОВЭД (далее — Сайт) и общие подходы к обеспечению их конфиденциальности.',
          '1.3. Используя Сайт и направляя свои персональные данные, Пользователь подтверждает, что ознакомился с настоящей Политикой и соглашается с описанными в ней условиями обработки персональных данных.'
        ]
      },
      {
        title: '2. Термины и статус оператора',
        content: [
          '2.1. Под персональными данными понимается любая информация, относящаяся к прямо или косвенно определённому или определяемому физическому лицу (субъекту персональных данных).',
          '2.2. Оператором персональных данных в рамках настоящей Политики является ИННОВЭД (индивидуальный предприниматель / организация; реквизиты и юридический адрес указываются в учредительных документах и договорных отношениях).',
          '2.3. Настоящая Политика не устанавливает для Оператора дополнительных обязанностей по сравнению с требованиями законодательства Российской Федерации и носит информационный характер.'
        ]
      },
      {
        title: '3. Состав и источники персональных данных',
        content: [
          '3.1. Оператор обрабатывает следующие категории данных, которые Пользователь предоставляет самостоятельно при обращении через формы Сайта или иными способами коммуникации:',
          '• фамилия, имя, при наличии — отчество;\n• контактные данные (телефон, адрес электронной почты, никнейм в мессенджерах, например Telegram);\n• сведения о грузах, необходимые для оказания услуг по таможенному оформлению;\n• иные данные, которые Пользователь может сообщить по собственной инициативе при обращении.',
          '3.2. Также могут автоматически собираться обезличенные данные о посещении Сайта (файлы cookie, техническая информация о браузере и устройстве) для аналитики и улучшения работы Сайта, если такие технологии подключены.'
        ]
      },
      {
        title: '4. Цели обработки персональных данных',
        content: [
          'Персональные данные обрабатываются Оператором в объёме, необходимом для достижения следующих целей:',
          '• предоставление услуг по таможенному оформлению грузов;\n• взаимодействие с Пользователем (обработка запросов, информирование о статусе услуг, направление необходимой служебной информации);\n• ведение учёта и внутренней отчётности, предусмотренной законодательством;\n• улучшение качества сервисов и работы Сайта, анализ обращений и оптимизация бизнес-процессов.'
        ]
      },
      {
        title: '5. Правовые основания обработки',
        content: [
          '5.1. Основаниями для обработки персональных данных являются:',
          '• согласие субъекта персональных данных, выраженное, в том числе, путём отправки формы на Сайте или обращения через указанные средства связи;\n• заключение и исполнение договора с субъектом персональных данных или его представителем;\n• исполнение обязанностей Оператора, предусмотренных законодательством Российской Федерации.',
          '5.2. В случаях, прямо предусмотренных законом, обработка персональных данных может осуществляться без отдельного согласия субъекта, строго в пределах требований законодательства.'
        ]
      },
      {
        title: '6. Условия и способы обработки',
        content: [
          '6.1. Обработка персональных данных осуществляется с использованием и без использования средств автоматизации в соответствии с принципами и правилами, установленными 152-ФЗ.',
          '6.2. Доступ к персональным данным предоставляется только тем лицам, которым он необходим для выполнения своих служебных обязанностей и оказания услуг Пользователю.',
          '6.3. В отдельных случаях Оператор может поручить обработку персональных данных третьим лицам на основании договора, при условии соблюдения такими лицами требований конфиденциальности и безопасности персональных данных.'
        ]
      },
      {
        title: '7. Сроки хранения и уничтожение данных',
        content: [
          '7.1. Персональные данные хранятся до достижения целей обработки либо в течение срока, предусмотренного законодательством Российской Федерации и (или) договором с Пользователем.',
          '7.2. По достижении целей обработки либо при утрате необходимости в таких данных они подлежат уничтожению или обезличиванию в порядке, установленном внутренними актами Оператора и законодательством.'
        ]
      },
      {
        title: '8. Меры по обеспечению безопасности',
        content: [
          '8.1. Оператор применяет предусмотренные законодательством организационные и технические меры, направленные на защиту персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий с персональными данными.',
          '8.2. Конкретный перечень используемых средств и технологий защиты не раскрывается в целях безопасности и может изменяться Оператором по мере развития технических решений и требований законодательства.'
        ]
      },
      {
        title: '9. Права субъектов персональных данных',
        content: [
          '9.1. Субъект персональных данных имеет право на получение информации, касающейся обработки его персональных данных, требование об их уточнении, блокировании или уничтожении в случаях, предусмотренных законодательством.',
          '9.2. Пользователь вправе отозвать ранее предоставленное согласие на обработку персональных данных, направив соответствующее обращение Оператору. При этом Оператор вправе продолжить обработку данных при наличии иных правовых оснований, предусмотренных законодательством.'
        ]
      },
      {
        title: '10. Ограничение ответственности',
        content: [
          '10.1. Оператор стремится соблюдать требования законодательства Российской Федерации в области персональных данных, однако не может гарантировать абсолютную защищённость информации при передаче данных по открытым каналам связи в сети «Интернет» и не несёт ответственность за действия третьих лиц, получивших доступ к данным не по вине Оператора.',
          '10.2. Оператор не несёт ответственности за сведения, предоставленные Пользователем о третьих лицах, а также за последствия предоставления Пользователем недостоверных или неполных данных.',
          '10.3. Настоящая Политика не является договором с Пользователем и не устанавливает для Оператора дополнительных обязательств, помимо прямо предусмотренных законодательством Российской Федерации.'
        ]
      },
      {
        title: '11. Контакты по вопросам персональных данных',
        content: [
          'По вопросам, связанным с обработкой персональных данных, а также для реализации прав субъекта персональных данных, Пользователь может обратиться к Оператору, в том числе через Telegram: @innovedbroker.'
        ]
      },
      {
        title: '12. Изменение Политики',
        content: [
          '12.1. Оператор вправе в одностороннем порядке вносить изменения в настоящую Политику без предварительного уведомления Пользователя, если иное не вытекает из требований законодательства.',
          '12.2. Актуальная редакция Политики всегда размещается на Сайте; продолжение использования Сайта после внесения изменений означает согласие Пользователя с новой редакцией Политики.'
        ]
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. General Provisions',
        content: [
          '1.1. This policy regarding the processing of personal data (hereinafter — the Policy) has been prepared in accordance with Federal Law No. 152-FZ dated 27.07.2006 "On Personal Data" and other applicable legislation of the Russian Federation in the field of personal data protection.',
          '1.2. The Policy defines the general procedure for processing personal data of users of the INNOVED website (hereinafter — the Website) and general approaches to ensuring their confidentiality.',
          '1.3. By using the Website and submitting personal data, the User confirms that they have read this Policy and agree to the terms of personal data processing described herein.'
        ]
      },
      {
        title: '2. Terms and Operator Status',
        content: [
          '2.1. Personal data refers to any information relating to a directly or indirectly identified or identifiable natural person (personal data subject).',
          '2.2. The personal data operator under this Policy is INNOVED (individual entrepreneur / organization; details and legal address are specified in founding documents and contractual relations).',
          '2.3. This Policy does not impose additional obligations on the Operator beyond the requirements of the legislation of the Russian Federation and is of an informational nature.'
        ]
      },
      {
        title: '3. Composition and Sources of Personal Data',
        content: [
          '3.1. The Operator processes the following categories of data that the User provides independently when contacting through the Website forms or other means of communication:',
          '• surname, first name, patronymic (if available);\n• contact details (phone, email address, messenger username, e.g. Telegram);\n• cargo information necessary for customs clearance services;\n• other data that the User may provide on their own initiative when contacting.',
          '3.2. Anonymized data about Website visits (cookies, technical information about the browser and device) may also be automatically collected for analytics and Website improvement, if such technologies are enabled.'
        ]
      },
      {
        title: '4. Purposes of Personal Data Processing',
        content: [
          'Personal data is processed by the Operator to the extent necessary to achieve the following purposes:',
          '• provision of customs clearance services;\n• interaction with the User (processing requests, informing about service status, sending necessary service information);\n• record keeping and internal reporting required by law;\n• improving the quality of services and Website operation, analyzing inquiries and optimizing business processes.'
        ]
      },
      {
        title: '5. Legal Basis for Processing',
        content: [
          '5.1. The grounds for processing personal data are:',
          '• consent of the personal data subject, expressed, among other things, by submitting a form on the Website or contacting through the specified means of communication;\n• conclusion and performance of a contract with the personal data subject or their representative;\n• fulfillment of the Operator\'s obligations under the legislation of the Russian Federation.',
          '5.2. In cases directly provided by law, personal data processing may be carried out without separate consent of the subject, strictly within the requirements of the legislation.'
        ]
      },
      {
        title: '6. Conditions and Methods of Processing',
        content: [
          '6.1. Personal data processing is carried out with and without the use of automation in accordance with the principles and rules established by 152-FZ.',
          '6.2. Access to personal data is granted only to those persons who need it to perform their official duties and provide services to the User.',
          '6.3. In certain cases, the Operator may entrust the processing of personal data to third parties on the basis of a contract, provided that such persons comply with the requirements of confidentiality and security of personal data.'
        ]
      },
      {
        title: '7. Data Storage and Destruction',
        content: [
          '7.1. Personal data is stored until the purposes of processing are achieved or for the period provided by the legislation of the Russian Federation and/or the contract with the User.',
          '7.2. Upon achieving the purposes of processing or when such data is no longer needed, it shall be destroyed or anonymized in accordance with the Operator\'s internal policies and legislation.'
        ]
      },
      {
        title: '8. Security Measures',
        content: [
          '8.1. The Operator applies organizational and technical measures provided by law to protect personal data from unauthorized or accidental access, destruction, modification, blocking, copying, distribution, and other unlawful actions.',
          '8.2. The specific list of protective tools and technologies used is not disclosed for security purposes and may be changed by the Operator as technical solutions and legislative requirements evolve.'
        ]
      },
      {
        title: '9. Rights of Personal Data Subjects',
        content: [
          '9.1. The personal data subject has the right to receive information concerning the processing of their personal data, to request its clarification, blocking, or destruction in cases provided by law.',
          '9.2. The User has the right to withdraw previously given consent to the processing of personal data by sending a corresponding request to the Operator. The Operator may continue processing data if there are other legal grounds provided by law.'
        ]
      },
      {
        title: '10. Limitation of Liability',
        content: [
          '10.1. The Operator strives to comply with the requirements of the legislation of the Russian Federation regarding personal data, but cannot guarantee absolute security of information when transmitting data through open communication channels on the Internet and is not liable for the actions of third parties who gained access to data through no fault of the Operator.',
          '10.2. The Operator is not responsible for information provided by the User about third parties, as well as for the consequences of the User providing inaccurate or incomplete data.',
          '10.3. This Policy is not a contract with the User and does not establish additional obligations for the Operator beyond those directly provided by the legislation of the Russian Federation.'
        ]
      },
      {
        title: '11. Contacts for Personal Data Inquiries',
        content: [
          'For questions related to the processing of personal data, as well as for exercising the rights of the personal data subject, the User may contact the Operator, including via Telegram: @innovedbroker.'
        ]
      },
      {
        title: '12. Policy Changes',
        content: [
          '12.1. The Operator has the right to unilaterally make changes to this Policy without prior notice to the User, unless otherwise required by law.',
          '12.2. The current version of the Policy is always posted on the Website; continued use of the Website after changes are made means the User agrees to the new version of the Policy.'
        ]
      }
    ]
  }
};

const Privacy = () => {
  const { language } = useLanguage();
  const text = content[language];

  return (
    <>
      <SEOHead language={language} page="privacy" />
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
                    <p key={pIndex} className="text-muted-foreground leading-relaxed whitespace-pre-line">
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

export default Privacy;
