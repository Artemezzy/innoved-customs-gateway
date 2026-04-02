// Mock HS code database (ТН ВЭД)
export interface HsCodeEntry {
  code: string;
  description: string;
  dutyRate: number; // percent
}

export const hsCodeDatabase: HsCodeEntry[] = [
  { code: '8471', description: 'Компьютеры и вычислительные машины', dutyRate: 0 },
  { code: '8703', description: 'Автомобили легковые', dutyRate: 15 },
  { code: '8704', description: 'Грузовые автомобили', dutyRate: 10 },
  { code: '6109', description: 'Футболки, майки трикотажные', dutyRate: 12 },
  { code: '6110', description: 'Свитеры, пуловеры трикотажные', dutyRate: 12 },
  { code: '6201', description: 'Верхняя одежда мужская', dutyRate: 10 },
  { code: '6202', description: 'Верхняя одежда женская', dutyRate: 10 },
  { code: '8429', description: 'Бульдозеры, грейдеры, экскаваторы', dutyRate: 5 },
  { code: '8431', description: 'Части строительной техники', dutyRate: 0 },
  { code: '8708', description: 'Запасные части для автомобилей', dutyRate: 5 },
  { code: '8409', description: 'Части двигателей', dutyRate: 0 },
  { code: '8481', description: 'Краны, клапаны, задвижки', dutyRate: 0 },
  { code: '8501', description: 'Электродвигатели и генераторы', dutyRate: 5 },
  { code: '8517', description: 'Телефоны, смартфоны', dutyRate: 0 },
  { code: '8528', description: 'Телевизоры, мониторы', dutyRate: 8 },
  { code: '8443', description: 'Принтеры, копиры', dutyRate: 0 },
  { code: '3926', description: 'Изделия из пластмасс', dutyRate: 6.5 },
  { code: '7308', description: 'Металлоконструкции', dutyRate: 5 },
  { code: '9401', description: 'Мебель для сидения', dutyRate: 0 },
  { code: '9403', description: 'Прочая мебель', dutyRate: 0 },
  { code: '2204', description: 'Вина виноградные', dutyRate: 12.5 },
  { code: '2208', description: 'Спиртные напитки', dutyRate: 12.5 },
  { code: '2402', description: 'Сигары, сигареты', dutyRate: 17.1 },
  { code: '2710', description: 'Нефтепродукты', dutyRate: 5 },
  { code: '8474', description: 'Оборудование для обработки грунта', dutyRate: 0 },
];

// Exchange rates (mock defaults)
export const defaultExchangeRates: Record<string, number> = {
  RUB: 1,
  USD: 83.5,
  EUR: 91.2,
  CNY: 11.5,
};

// Customs fee table (mock, based on value ranges in RUB)
export function getCustomsFee(valueRub: number): number {
  if (valueRub <= 200_000) return 775;
  if (valueRub <= 450_000) return 1_550;
  if (valueRub <= 1_200_000) return 3_100;
  if (valueRub <= 2_700_000) return 8_530;
  if (valueRub <= 4_200_000) return 12_000;
  if (valueRub <= 5_500_000) return 15_500;
  if (valueRub <= 7_000_000) return 20_000;
  if (valueRub <= 8_000_000) return 23_000;
  if (valueRub <= 9_000_000) return 25_000;
  if (valueRub <= 10_000_000) return 27_000;
  return 30_000;
}

export function findHsCode(query: string): HsCodeEntry | null {
  const q = query.trim();
  if (!q) return null;
  // Try exact or prefix match on code
  const byCode = hsCodeDatabase.find(e => e.code === q || q.startsWith(e.code));
  if (byCode) return byCode;
  // Try description match
  const lower = q.toLowerCase();
  return hsCodeDatabase.find(e => e.description.toLowerCase().includes(lower)) || null;
}

export interface CalculationInput {
  value: number;
  currency: string;
  exchangeRate: number;
  dutyRate: number;
  vatRate: number;
  additionalCosts: number;
  isExcisable: boolean;
  exciseAmount: number;
}

export interface CalculationResult {
  valueRub: number;
  customsBase: number;
  duty: number;
  vat: number;
  customsFee: number;
  excise: number;
  total: number;
}

export function calculate(input: CalculationInput): CalculationResult {
  const valueRub = input.value * input.exchangeRate;
  const customsBase = valueRub + input.additionalCosts;
  const duty = Math.round(customsBase * (input.dutyRate / 100));
  const excise = input.isExcisable ? Math.round(input.exciseAmount) : 0;
  const vatBase = customsBase + duty + excise;
  const vat = Math.round(vatBase * (input.vatRate / 100));
  const customsFee = getCustomsFee(customsBase);
  const total = duty + vat + customsFee + excise;

  return { valueRub: Math.round(valueRub), customsBase: Math.round(customsBase), duty, vat, customsFee, excise, total };
}
