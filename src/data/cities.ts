export interface City {
  slug: string;
  name: { ru: string; en: string };
}

export const cities: City[] = [
  { slug: 'vladivostok', name: { ru: 'Владивосток', en: 'Vladivostok' } },
  { slug: 'novorossiysk', name: { ru: 'Новороссийск', en: 'Novorossiysk' } },
  { slug: 'kazan', name: { ru: 'Казань', en: 'Kazan' } },
  { slug: 'irkutsk', name: { ru: 'Иркутск', en: 'Irkutsk' } },
  { slug: 'novosibirsk', name: { ru: 'Новосибирск', en: 'Novosibirsk' } },
  { slug: 'ekaterinburg', name: { ru: 'Екатеринбург', en: 'Ekaterinburg' } },
];
