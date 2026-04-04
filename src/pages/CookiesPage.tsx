import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHero } from '@/components/PageHero';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    title: 'Политика использования файлов cookies',
    sections: [
      {
        title: '1. Что такое cookies',
        content: [
          'Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайтов. Они помогают сайту «запоминать» ваши действия и предпочтения, чтобы вам не приходилось вводить их заново при каждом визите.',
          'Помимо cookies, мы также можем использовать похожие технологии: localStorage, sessionStorage и пиксели отслеживания. В данной политике термин «cookies» используется обобщённо и охватывает все перечисленные технологии.'
        ]
      },
      {
        title: '2. Какие cookies мы используем',
        content: [
          'Строго необходимые cookies\nЦель: обеспечение базовой работы сайта — работа форм обратной связи, сохранение ваших настроек cookies.\nПримеры данных: идентификатор сессии, статус согласия на cookies.\nСрок хранения: сессионные (удаляются при закрытии браузера) или до 12 месяцев.',
          'Функциональные cookies\nЦель: сохранение ваших предпочтений — выбранного языка, города или региона.\nПримеры данных: код языка (ru/en), название выбранного города.\nСрок хранения: от 1 дня до 12 месяцев.',
          'Аналитические cookies\nЦель: сбор обезличенной статистики о посещениях сайта — просмотры страниц, источники трафика, поведение пользователей.\nПримеры данных: уникальный идентификатор посетителя, время визита, просмотренные страницы.\nСрок хранения: от 1 дня до 24 месяцев.\nУстанавливаются аналитическими сервисами третьих лиц.',
          'Маркетинговые cookies\nЦель: показ релевантной рекламы пользователям, посещавшим наш сайт, и оценка эффективности рекламных кампаний.\nПримеры данных: идентификатор рекламной аудитории, история взаимодействия с рекламой.\nСрок хранения: от 1 дня до 24 месяцев.\nУстанавливаются рекламными и ремаркетинговыми сервисами третьих лиц.'
        ]
      },
      {
        title: '3. Как мы используем аналитические и маркетинговые cookies',
        content: [
          'Данные, полученные с помощью аналитических cookies, используются в обобщённом виде для улучшения работы сайта: мы анализируем, какие страницы наиболее популярны, откуда приходят посетители и как они взаимодействуют с контентом.',
          'Маркетинговые cookies помогают повысить эффективность нашей рекламы и показывать вам более релевантные объявления на сторонних площадках.',
          'Мы не продаём персональные данные третьим лицам. Данные cookies обрабатываются исключительно для целей, описанных в настоящей политике.'
        ]
      },
      {
        title: '4. Управление cookies',
        content: [
          'При первом посещении сайта вам предлагается выбор: принять все cookies или отклонить необязательные (аналитические и маркетинговые). Строго необходимые cookies устанавливаются всегда, так как без них сайт не сможет работать корректно.',
          'Вы можете изменить свой выбор в любой момент через ссылку «Настройки cookies» в подвале сайта.',
          'Кроме того, большинство браузеров позволяют управлять cookies через собственные настройки: блокировать все cookies, удалять существующие или получать уведомление при установке нового cookie. Обратите внимание, что блокировка всех cookies может повлиять на функциональность сайта.'
        ]
      },
      {
        title: '5. Хранение данных и срок действия cookies',
        content: [
          'Сессионные cookies автоматически удаляются при закрытии браузера. Постоянные cookies хранятся на вашем устройстве в течение установленного срока (от 1 дня до 24 месяцев) или до момента их удаления вами вручную.',
          'Мы периодически пересматриваем список используемых cookies и обновляем его при необходимости.'
        ]
      },
      {
        title: '6. Обновления политики cookies',
        content: [
          'Мы можем время от времени обновлять настоящую политику — например, при подключении новых сервисов аналитики или изменении применимого законодательства о защите данных. Актуальная версия всегда размещена на этой странице с указанием даты последнего обновления.',
          'Дата последнего обновления: апрель 2026 г.'
        ]
      },
      {
        title: '7. Контакты',
        content: [
          'Если у вас есть вопросы о том, как мы используем cookies или обрабатываем персональные данные, напишите нам: info@innovedbroker.ru.'
        ]
      }
    ]
  },
  en: {
    title: 'Cookie Policy',
    sections: [
      {
        title: '1. What Are Cookies',
        content: [
          'Cookies are small text files stored on your device when you visit websites. They help the site "remember" your actions and preferences so you don\'t have to re-enter them each time you visit.',
          'In addition to cookies, we may also use similar technologies: localStorage, sessionStorage, and tracking pixels. In this policy, the term "cookies" is used broadly to cover all of these technologies.'
        ]
      },
      {
        title: '2. What Cookies We Use',
        content: [
          'Strictly Necessary Cookies\nPurpose: ensuring basic website functionality — contact forms, saving your cookie preferences.\nExamples of data: session identifier, cookie consent status.\nRetention period: session-based (deleted when the browser is closed) or up to 12 months.',
          'Functional Cookies\nPurpose: saving your preferences — selected language, city, or region.\nExamples of data: language code (ru/en), selected city name.\nRetention period: from 1 day to 12 months.',
          'Analytical Cookies\nPurpose: collecting anonymized visitor statistics — page views, traffic sources, user behavior.\nExamples of data: unique visitor identifier, visit time, pages viewed.\nRetention period: from 1 day to 24 months.\nSet by third-party analytics services.',
          'Marketing Cookies\nPurpose: showing relevant ads to users who have visited our website and measuring ad campaign effectiveness.\nExamples of data: advertising audience identifier, ad interaction history.\nRetention period: from 1 day to 24 months.\nSet by third-party advertising and remarketing services.'
        ]
      },
      {
        title: '3. How We Use Analytical and Marketing Cookies',
        content: [
          'Data collected through analytical cookies is used in aggregate to improve the website: we analyze which pages are most popular, where visitors come from, and how they interact with content.',
          'Marketing cookies help us improve our advertising effectiveness and show you more relevant ads on third-party platforms.',
          'We do not sell personal data to third parties. Cookie data is processed solely for the purposes described in this policy.'
        ]
      },
      {
        title: '4. Managing Cookies',
        content: [
          'On your first visit, you are offered a choice: accept all cookies or decline non-essential ones (analytical and marketing). Strictly necessary cookies are always set, as the website cannot function properly without them.',
          'You can change your choice at any time via the "Cookie Settings" link in the website footer.',
          'Additionally, most browsers allow you to manage cookies through their own settings: block all cookies, delete existing ones, or receive a notification when a new cookie is set. Please note that blocking all cookies may affect website functionality.'
        ]
      },
      {
        title: '5. Data Storage and Cookie Duration',
        content: [
          'Session cookies are automatically deleted when you close your browser. Persistent cookies remain on your device for a set period (from 1 day to 24 months) or until you manually delete them.',
          'We periodically review the list of cookies used and update it as needed.'
        ]
      },
      {
        title: '6. Cookie Policy Updates',
        content: [
          'We may update this policy from time to time — for example, when adding new analytics services or when applicable data protection legislation changes. The current version is always available on this page with the date of the last update.',
          'Last updated: April 2026.'
        ]
      },
      {
        title: '7. Contact Us',
        content: [
          'If you have questions about how we use cookies or process personal data, please contact us at: info@innovedbroker.ru.'
        ]
      }
    ]
  }
};

export default function CookiesPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/cookies', 'ИННОВЭД - Политика cookies');
  }, []);

  return (
    <>
      <SEOHead language={language} page="cookies" />
      <PageHero title={text.title} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {text.sections.map((section, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-foreground">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
