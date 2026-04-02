import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calculator, ChevronDown, AlertTriangle, ArrowRight, Settings2 } from 'lucide-react';
import { calculate, findHsCode, defaultExchangeRates, type CalculationResult } from '@/utils/customs-calculator';

interface CustomsCalculatorProps {
  language: 'ru' | 'en';
  compact?: boolean;
}

const content = {
  ru: {
    title: 'Калькулятор таможенных платежей',
    subtitle: 'Рассчитайте ориентировочную стоимость импорта за 30 секунд',
    hsCode: 'Код ТН ВЭД или описание товара',
    hsCodePlaceholder: 'Например: 8703 или «автомобили» (4 цифры)',
    value: 'Стоимость партии',
    currency: 'Валюта',
    country: 'Страна происхождения',
    countryPlaceholder: 'Китай, Турция, Германия…',
    excisable: 'Подакцизный товар',
    calculate: 'Рассчитать платежи',
    advanced: 'Дополнительные параметры',
    exchangeRate: 'Курс валюты',
    additionalCosts: 'Доп. расходы до границы, ₽',
    vatRate: 'Ставка НДС',
    manualDuty: 'Ставка пошлины вручную, %',
    exciseAmount: 'Сумма акциза, ₽',
    resultTitle: 'Предварительные таможенные платежи',
    duty: 'Ввозная пошлина',
    vat: 'НДС',
    fee: 'Таможенный сбор',
    excise: 'Акциз',
    total: 'Итого платежей',
    cta: 'Получить точный расчёт',
    warning: 'Код не найден — укажите ставку пошлины вручную в «Дополнительных параметрах»',
    disclaimer: 'Расчёт носит ориентировочный характер и не является публичной офертой',
    dutyRate: 'Ставка пошлины',
  },
  en: {
    title: 'Customs Duty Calculator',
    subtitle: 'Estimate your import costs in 30 seconds',
    hsCode: 'HS Code or product description',
    hsCodePlaceholder: 'e.g. 8703 or "cars" (4 digits)',
    value: 'Shipment value',
    currency: 'Currency',
    country: 'Country of origin',
    countryPlaceholder: 'China, Turkey, Germany…',
    excisable: 'Excisable goods',
    calculate: 'Calculate duties',
    advanced: 'Advanced parameters',
    exchangeRate: 'Exchange rate',
    additionalCosts: 'Additional costs to border, ₽',
    vatRate: 'VAT rate',
    manualDuty: 'Manual duty rate, %',
    exciseAmount: 'Excise amount, ₽',
    resultTitle: 'Estimated Customs Duties',
    duty: 'Import duty',
    vat: 'VAT',
    fee: 'Customs fee',
    excise: 'Excise',
    total: 'Total payments',
    cta: 'Get an exact quote',
    warning: 'Code not found — enter the duty rate manually in "Advanced parameters"',
    disclaimer: 'This is an estimate and does not constitute a public offer',
    dutyRate: 'Duty rate',
  },
};

const currencies = ['RUB', 'USD', 'EUR', 'CNY'];
const vatOptions = [
  { label: '20%', value: '20' },
  { label: '10%', value: '10' },
];

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}

export function CustomsCalculator({ language, compact = false }: CustomsCalculatorProps) {
  const t = content[language];
  const navigate = useNavigate();

  const [hsQuery, setHsQuery] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [country, setCountry] = useState('');
  const [isExcisable, setIsExcisable] = useState(false);

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customRate, setCustomRate] = useState('');
  const [additionalCosts, setAdditionalCosts] = useState('');
  const [vatRate, setVatRate] = useState('20');
  const [manualDuty, setManualDuty] = useState('');
  const [exciseAmount, setExciseAmount] = useState('');

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [codeNotFound, setCodeNotFound] = useState(false);

  const exchangeRate = useMemo(() => {
    const custom = parseFloat(customRate);
    if (custom > 0) return custom;
    return defaultExchangeRates[currency] || 1;
  }, [currency, customRate]);

  const handleCalculate = () => {
    const numValue = parseFloat(value);
    if (!numValue || numValue <= 0) return;

    const hsEntry = findHsCode(hsQuery);
    let dutyRate = hsEntry?.dutyRate ?? 0;

    if (!hsEntry) {
      setCodeNotFound(true);
      const manual = parseFloat(manualDuty);
      if (manual >= 0) dutyRate = manual;
    } else {
      setCodeNotFound(false);
    }

    const res = calculate({
      value: numValue,
      currency,
      exchangeRate,
      dutyRate,
      vatRate: parseFloat(vatRate),
      additionalCosts: parseFloat(additionalCosts) || 0,
      isExcisable,
      exciseAmount: parseFloat(exciseAmount) || 0,
    });
    setResult(res);
  };

  const handleCta = () => {
    if (!result) return;

    const hsEntry = findHsCode(hsQuery);
    const dutyRateValue = hsEntry ? `${hsEntry.dutyRate}%` : `${manualDuty}%`;
    const productDesc = hsEntry ? `${hsEntry.code} — ${hsEntry.description}` : hsQuery;

    const greeting = language === 'ru'
      ? 'Добрый день!\nМеня зовут ..., пишу от компании ...\nПрошу помочь с расчётом таможенных платежей.\n'
      : 'Hello!\nMy name is ..., I am writing on behalf of ...\nPlease help me calculate customs duties.\n';

    const details = [
      `${t.hsCode}: ${productDesc}`,
      `${t.dutyRate}: ${dutyRateValue}`,
      `${t.value}: ${formatNumber(parseFloat(value))} ${currency}`,
      country.trim() ? `${t.country}: ${country.trim()}` : '',
    ].filter(Boolean).join('\n');

    navigate('/contact', { state: { prefill: greeting + '\n' + details } });
  };

  if (compact) {
    return (
      <div className="p-5 md:p-6 space-y-4 text-primary-foreground">
        <div className="flex items-center gap-2 text-sm font-medium text-accent mb-1">
          <Calculator className="h-4 w-4" />
          {t.title}
        </div>
        {/* HS code */}
        <div className="space-y-1.5">
          <Label htmlFor="hs-code" className="text-primary-foreground/80">{t.hsCode}</Label>
          <Input id="hs-code" value={hsQuery} onChange={e => setHsQuery(e.target.value)} placeholder={t.hsCodePlaceholder} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40" />
        </div>
        {/* Value + Currency */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="shipment-value" className="text-primary-foreground/80">{t.value}</Label>
            <Input id="shipment-value" type="number" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder="100 000" className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-primary-foreground/80">{t.currency}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-white/10 border-white/20 text-primary-foreground"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Country */}
        <div className="space-y-1.5">
          <Label htmlFor="country" className="text-primary-foreground/80">{t.country}</Label>
          <Input id="country" value={country} onChange={e => setCountry(e.target.value)} placeholder={t.countryPlaceholder} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40" />
        </div>
        {/* Warning */}
        {codeNotFound && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/20 p-3 text-sm text-red-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            {t.warning}
          </div>
        )}
        <Button onClick={handleCalculate} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          {t.calculate}
        </Button>
        {/* Result */}
        {result && (
          <div className="border-t border-white/20 pt-4 space-y-3">
            <p className="text-sm text-primary-foreground/60">{t.resultTitle}</p>
            <p className="text-2xl font-bold text-accent">{formatNumber(result.total)}&nbsp;₽</p>
            <div className="space-y-1.5 text-sm">
              <RowCompact label={t.duty} value={result.duty} />
              <RowCompact label={t.vat} value={result.vat} />
              <RowCompact label={t.fee} value={result.customsFee} />
              {result.excise > 0 && <RowCompact label={t.excise} value={result.excise} />}
            </div>
            <Button onClick={handleCta} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {t.cta}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
        <p className="text-xs text-primary-foreground/40 text-center">{t.disclaimer}</p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-2">
            <Calculator className="h-4 w-4" />
            {t.title}
          </div>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form — 3 cols */}
          <Card className="lg:col-span-3 shadow-md">
            <CardContent className="p-5 md:p-6 space-y-4">
              {/* HS code */}
              <div className="space-y-1.5">
                <Label htmlFor="hs-code">{t.hsCode}</Label>
                <Input id="hs-code" value={hsQuery} onChange={e => setHsQuery(e.target.value)} placeholder={t.hsCodePlaceholder} />
              </div>

              {/* Value + Currency row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="shipment-value">{t.value}</Label>
                  <Input id="shipment-value" type="number" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder="100 000" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.currency}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <Label htmlFor="country">{t.country}</Label>
                <Input id="country" value={country} onChange={e => setCountry(e.target.value)} placeholder={t.countryPlaceholder} />
              </div>

              {/* Excisable */}
              <div className="flex items-center gap-2">
                <Checkbox id="excisable" checked={isExcisable} onCheckedChange={v => setIsExcisable(v === true)} />
                <Label htmlFor="excisable" className="cursor-pointer">{t.excisable}</Label>
              </div>

              {/* Warning */}
              {codeNotFound && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  {t.warning}
                </div>
              )}

              {/* Advanced */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Settings2 className="h-4 w-4" />
                  {t.advanced}
                  <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3 border-t pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>{t.exchangeRate} ({currency}/₽)</Label>
                      <Input type="number" min="0" step="0.01" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder={String(defaultExchangeRates[currency] || 1)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t.additionalCosts}</Label>
                      <Input type="number" min="0" value={additionalCosts} onChange={e => setAdditionalCosts(e.target.value)} placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>{t.vatRate}</Label>
                      <Select value={vatRate} onValueChange={setVatRate}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {vatOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t.manualDuty}</Label>
                      <Input type="number" min="0" max="100" step="0.1" value={manualDuty} onChange={e => setManualDuty(e.target.value)} placeholder="—" />
                    </div>
                  </div>
                  {isExcisable && (
                    <div className="space-y-1.5">
                      <Label>{t.exciseAmount}</Label>
                      <Input type="number" min="0" value={exciseAmount} onChange={e => setExciseAmount(e.target.value)} placeholder="0" />
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <Button onClick={handleCalculate} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                {t.calculate}
              </Button>
            </CardContent>
          </Card>

          {/* Result — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className={`shadow-md flex-1 transition-all ${result ? 'border-primary/30' : 'border-border'}`}>
              <CardContent className="p-5 md:p-6 flex flex-col justify-center h-full">
                {result ? (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.resultTitle}</p>
                      <p className="text-3xl md:text-4xl font-bold text-primary">
                        {formatNumber(result.total)}&nbsp;₽
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <Row label={t.duty} value={result.duty} />
                      <Row label={t.vat} value={result.vat} />
                      <Row label={t.fee} value={result.customsFee} />
                      {result.excise > 0 && <Row label={t.excise} value={result.excise} />}
                      <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-foreground">
                        <span>{t.total}</span>
                        <span>{formatNumber(result.total)} ₽</span>
                      </div>
                    </div>

                    <Button onClick={handleCta} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t.subtitle}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground text-center">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{formatNumber(value)} ₽</span>
    </div>
  );
}

function RowCompact({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-primary-foreground/70">
      <span>{label}</span>
      <span>{formatNumber(value)} ₽</span>
    </div>
  );
}
