// Re-export types and full database from dedicated file
export type { HsCodeEntry } from '@/data/hs-codes-database';
export { hsCodeDatabase } from '@/data/hs-codes-database';

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
