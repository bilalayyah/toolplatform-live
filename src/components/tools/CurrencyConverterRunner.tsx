import React, {useState, useEffect, useMemo} from 'react';
import {Copy, Check, ArrowRightLeft, RefreshCw, AlertCircle, Info, DollarSign} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

// Major fallback rates against USD in case user is offline or free API rate-limited
const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.45,
  JPY: 154.5,
  CAD: 1.36,
  AUD: 1.51,
  CHF: 0.91,
  CNY: 7.24,
  SGD: 1.35,
  NZD: 1.64,
  AED: 3.6725,
  SAR: 3.75,
  PKR: 278.5,
  BDT: 117.5,
  LKR: 301.2,
  BRL: 5.15,
  MXN: 16.7,
  ZAR: 18.3,
  KRW: 1365.0,
  SEK: 10.7,
  NOK: 10.8,
  DKK: 6.87,
  PLN: 3.95,
  THB: 36.6,
  IDR: 16100.0,
  MYR: 4.71,
  PHP: 57.6,
  TRY: 32.2,
  RUB: 91.5,
  HKD: 7.82,
  TWD: 32.4,
  ILS: 3.71,
  EGP: 47.1,
  QAR: 3.64,
  KWD: 0.307,
  BHD: 0.377,
  OMR: 0.385,
  VND: 25400.0,
  NGN: 1420.0,
  KES: 131.0,
  ARS: 885.0,
  CLP: 935.0,
  COP: 3880.0,
  PEN: 3.72,
};

const CURRENCY_DETAILS: Record<string, {name: string; symbol: string}> = {
  USD: {name: 'US Dollar', symbol: '$'},
  EUR: {name: 'Euro', symbol: '€'},
  GBP: {name: 'British Pound', symbol: '£'},
  INR: {name: 'Indian Rupee', symbol: '₹'},
  JPY: {name: 'Japanese Yen', symbol: '¥'},
  CAD: {name: 'Canadian Dollar', symbol: 'CA$'},
  AUD: {name: 'Australian Dollar', symbol: 'AU$'},
  CHF: {name: 'Swiss Franc', symbol: 'CHF'},
  CNY: {name: 'Chinese Yuan', symbol: '¥'},
  SGD: {name: 'Singapore Dollar', symbol: 'S$'},
  NZD: {name: 'New Zealand Dollar', symbol: 'NZ$'},
  AED: {name: 'UAE Dirham', symbol: 'AED'},
  SAR: {name: 'Saudi Riyal', symbol: 'SAR'},
  PKR: {name: 'Pakistani Rupee', symbol: 'PKR'},
  BDT: {name: 'Bangladeshi Taka', symbol: '৳'},
  LKR: {name: 'Sri Lankan Rupee', symbol: 'Rs'},
  BRL: {name: 'Brazilian Real', symbol: 'R$'},
  MXN: {name: 'Mexican Peso', symbol: 'Mex$'},
  ZAR: {name: 'South African Rand', symbol: 'R'},
  KRW: {name: 'South Korean Won', symbol: '₩'},
  SEK: {name: 'Swedish Krona', symbol: 'kr'},
  NOK: {name: 'Norwegian Krone', symbol: 'kr'},
  DKK: {name: 'Danish Krone', symbol: 'kr'},
  PLN: {name: 'Polish Zloty', symbol: 'zł'},
  THB: {name: 'Thai Baht', symbol: '฿'},
  IDR: {name: 'Indonesian Rupiah', symbol: 'Rp'},
  MYR: {name: 'Malaysian Ringgit', symbol: 'RM'},
  PHP: {name: 'Philippine Peso', symbol: '₱'},
  TRY: {name: 'Turkish Lira', symbol: '₺'},
  RUB: {name: 'Russian Ruble', symbol: '₽'},
  HKD: {name: 'Hong Kong Dollar', symbol: 'HK$'},
  TWD: {name: 'Taiwan New Dollar', symbol: 'NT$'},
  ILS: {name: 'Israeli Shekel', symbol: '₪'},
  EGP: {name: 'Egyptian Pound', symbol: 'E£'},
  QAR: {name: 'Qatari Riyal', symbol: 'QR'},
  KWD: {name: 'Kuwaiti Dinar', symbol: 'KD'},
  BHD: {name: 'Bahraini Dinar', symbol: 'BD'},
  OMR: {name: 'Omani Rial', symbol: 'OMR'},
  VND: {name: 'Vietnamese Dong', symbol: '₫'},
  NGN: {name: 'Nigerian Naira', symbol: '₦'},
  KES: {name: 'Kenyan Shilling', symbol: 'KSh'},
  ARS: {name: 'Argentine Peso', symbol: 'AR$'},
  CLP: {name: 'Chilean Peso', symbol: 'CLP$'},
  COP: {name: 'Colombian Peso', symbol: 'COL$'},
  PEN: {name: 'Peruvian Sol', symbol: 'S/.'},
};

export function CurrencyConverterRunner({tool}: Props) {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_USD_RATES);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<'live' | 'fallback'>('fallback');
  const [customRateMode, setCustomRateMode] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch live exchange rates from free open endpoint
  const fetchLiveRates = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      if (data && data.rates) {
        setRates((prev) => ({...prev, ...data.rates}));
        setApiSource('live');
        setLastUpdated(data.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleDateString() : 'Today');
      }
    } catch {
      // Graceful fallback to static rates
      setApiSource('fallback');
      setLastUpdated('Indicative Baseline Rates');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const availableCurrencies = useMemo(() => {
    const list = Object.keys(rates).sort();
    return list;
  }, [rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (customRateMode && customRate) {
      const num = parseFloat(customRate);
      if (num > 0) {
        setCustomRate((1 / num).toFixed(6).replace(/\.?0+$/, ''));
      }
    }
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate rate: 1 FROM = X TO
  const conversionRate = useMemo(() => {
    if (customRateMode && customRate) {
      const cr = parseFloat(customRate);
      return isNaN(cr) || cr <= 0 ? null : cr;
    }
    const fromUsdRate = rates[fromCurrency];
    const toUsdRate = rates[toCurrency];
    if (!fromUsdRate || !toUsdRate) return null;
    return toUsdRate / fromUsdRate;
  }, [fromCurrency, toCurrency, rates, customRateMode, customRate]);

  const numAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numAmount) && numAmount >= 0;

  const convertedTotal = useMemo(() => {
    if (!isValidAmount || conversionRate === null) return null;
    return numAmount * conversionRate;
  }, [numAmount, isValidAmount, conversionRate]);

  const fromDetail = CURRENCY_DETAILS[fromCurrency] || {name: fromCurrency, symbol: fromCurrency};
  const toDetail = CURRENCY_DETAILS[toCurrency] || {name: toCurrency, symbol: toCurrency};

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live mid-market rates via open feed · Optional manual rate · Zero tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLiveRates}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin text-[#0A8CFF]' : ''}`} />
            <span>{isFetching ? 'Updating...' : 'Refresh Rates'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Converter Controls Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          {/* Amount input */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
              />
            </div>
          </div>

          {/* From Currency */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              From Currency
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {availableCurrencies.map((cur) => {
                const info = CURRENCY_DETAILS[cur];
                return (
                  <option key={cur} value={cur}>
                    {cur} {info ? `— ${info.name}` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-2 flex justify-center pb-1">
            <button
              type="button"
              onClick={swapCurrencies}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF] hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-[#0A8CFF] transition-all"
              title="Swap currencies"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* To Currency */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              To Currency
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {availableCurrencies.map((cur) => {
                const info = CURRENCY_DETAILS[cur];
                return (
                  <option key={cur} value={cur}>
                    {cur} {info ? `— ${info.name}` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Custom Rate Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={customRateMode}
              onChange={(e) => {
                setCustomRateMode(e.target.checked);
                if (e.target.checked && !customRate && conversionRate) {
                  setCustomRate(conversionRate.toFixed(4));
                }
              }}
              className="rounded border-slate-300 text-[#0A8CFF] focus:ring-[#0A8CFF]"
            />
            <span>Enable manual rate mode (custom exchange rate override)</span>
          </label>

          {lastUpdated && (
            <span className="text-[11px] text-slate-400">
              Rate Source: {apiSource === 'live' ? 'Live Open API' : 'Static Baseline'} ({lastUpdated})
            </span>
          )}
        </div>

        {customRateMode && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-4">
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Custom Exchange Rate: 1 {fromCurrency} =
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder={conversionRate ? conversionRate.toFixed(4) : 'e.g. 1.08'}
                className="w-48 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-mono text-sm font-bold text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{toCurrency}</span>
            </div>
          </div>
        )}

        {/* Invalid amount alert */}
        {!isValidAmount && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Please enter a valid positive number for the amount.</span>
          </div>
        )}

        {/* Primary Result Display */}
        {isValidAmount && conversionRate !== null && convertedTotal !== null && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Conversion Result
              </span>
              <button
                type="button"
                onClick={() =>
                  copyResult(
                    `${numAmount.toLocaleString()} ${fromCurrency} = ${convertedTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })} ${toCurrency}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {numAmount.toLocaleString()} {fromDetail.name} ({fromCurrency}) =
              </div>
              <div className="mt-1 font-mono text-3xl sm:text-4xl font-extrabold text-[#0A8CFF]">
                {toDetail.symbol}{' '}
                {convertedTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                })}{' '}
                <span className="text-lg font-sans font-bold text-slate-900 dark:text-white">{toCurrency}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div>
                  1 {fromCurrency} = <strong className="text-slate-800 dark:text-slate-200">{conversionRate.toFixed(4)}</strong> {toCurrency}
                </div>
                <div>
                  1 {toCurrency} = <strong className="text-slate-800 dark:text-slate-200">{(1 / conversionRate).toFixed(4)}</strong> {fromCurrency}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Honest Mid-Market Note (Strict Requirement) */}
        <div className="flex items-start gap-3 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-950/20 p-4 text-xs text-sky-950 dark:text-sky-200 leading-relaxed">
          <Info className="h-4 w-4 shrink-0 text-[#0A8CFF] mt-0.5" />
          <p>
            <strong>Transparent Exchange Rate Notice: </strong>
            Rates shown are indicative mid-market reference rates derived from free open financial feeds and are intended for informational calculations. They are not guaranteed commercial transaction or bank transfer rates (which include retail spreads, margins, and bank fees). You can toggle manual rate mode above to compute with any exact rate quoted by your bank.
          </p>
        </div>
      </div>
    </div>
  );
}
