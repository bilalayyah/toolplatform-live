import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  BookOpen,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Printer,
  RotateCcw,
  ShieldAlert,
  Thermometer,
  Trash2,
} from 'lucide-react';
import {
  calculateHeatIndex,
  calculateHeatIndexFromCelsius,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getRiskBand,
  getRiskThresholdRows,
  HEAT_INDEX_REFERENCES,
  HEAT_INDEX_SAFETY_DISCLAIMER,
  parseHeatIndexInputs,
  roundToOneDecimal,
  type HeatIndexResult,
  type HeatRiskBandId,
  type TemperatureUnit,
} from '../../lib/heatIndex';

interface Props {
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
}

interface HistoryEntry {
  id: string;
  tempInput: string;
  unit: TemperatureUnit;
  rhInput: string;
  heatIndexF: number;
  heatIndexC: number;
  bandLabel: string;
}

const FRESH_EXAMPLES: ReadonlyArray<{
  label: string;
  temp: string;
  unit: TemperatureUnit;
  rh: string;
}> = [
  { label: '95°F / 60%', temp: '95', unit: 'F', rh: '60' },
  { label: '88°F / 45%', temp: '88', unit: 'F', rh: '45' },
  { label: '102°F / 70%', temp: '102', unit: 'F', rh: '70' },
  { label: '30°C / 65%', temp: '30', unit: 'C', rh: '65' },
  { label: '27°C / 40%', temp: '27', unit: 'C', rh: '40' },
];

const CHART_TEMPS_F = [80, 84, 88, 90, 92, 96, 100, 104, 108, 110] as const;
const CHART_HUMIDITIES = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100] as const;

function getBandToneClasses(band: HeatRiskBandId): {
  surface: string;
  text: string;
  cell: string;
} {
  switch (band) {
    case 'below-caution':
      return {
        surface: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70',
        text: 'text-slate-700 dark:text-slate-200',
        cell: 'bg-slate-100/80 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200',
      };
    case 'caution':
      return {
        surface: 'border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30',
        text: 'text-amber-800 dark:text-amber-300',
        cell: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
      };
    case 'extreme-caution':
      return {
        surface: 'border-orange-200 dark:border-orange-800/70 bg-orange-50/70 dark:bg-orange-950/30',
        text: 'text-orange-800 dark:text-orange-300',
        cell: 'bg-orange-100/80 dark:bg-orange-950/50 text-orange-900 dark:text-orange-200',
      };
    case 'danger':
      return {
        surface: 'border-rose-200 dark:border-rose-800/70 bg-rose-50/70 dark:bg-rose-950/30',
        text: 'text-rose-800 dark:text-rose-300',
        cell: 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200',
      };
    case 'extreme-danger':
      return {
        surface: 'border-red-300 dark:border-red-800 bg-red-100/70 dark:bg-red-950/50',
        text: 'text-red-900 dark:text-red-200',
        cell: 'bg-red-200/80 dark:bg-red-950/80 text-red-950 dark:text-red-100 font-bold',
      };
  }
}

function formatSigned(value: number, unit: TemperatureUnit): string {
  const rounded = roundToOneDecimal(value);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded.toFixed(1)}°${unit}`;
}

function computeFromStrings(
  tempRaw: string,
  rhRaw: string,
  unit: TemperatureUnit,
): { result: HeatIndexResult; error: null } | { result: null; error: string } {
  const parsed = parseHeatIndexInputs(tempRaw, rhRaw);
  if (!parsed.valid) {
    return { result: null, error: parsed.error };
  }
  try {
    const result =
      unit === 'F'
        ? calculateHeatIndex(parsed.temp, parsed.rh)
        : calculateHeatIndexFromCelsius(parsed.temp, parsed.rh);
    return { result, error: null };
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Unable to calculate heat index.',
    };
  }
}

export function HeatIndexWorkspace({ onCopy, copiedKey }: Props) {
  // Primary calculator state (initialized with §1.4 fresh example 95°F / 60%)
  const [tempInput, setTempInput] = useState<string>('95');
  const [rhInput, setRhInput] = useState<string>('60');
  const [unit, setUnit] = useState<TemperatureUnit>('F');
  const [hasReset, setHasReset] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'initial-95F-60',
      tempInput: '95',
      unit: 'F',
      rhInput: '60',
      heatIndexF: 113.1,
      heatIndexC: 45.1,
      bandLabel: 'Danger',
    },
  ]);

  // Comparison mode state (initialized with §1.4 comparison example)
  const [compOpen, setCompOpen] = useState<boolean>(true);
  const [compATemp, setCompATemp] = useState<string>('90');
  const [compARh, setCompARh] = useState<string>('40');
  const [compAUnit, setCompAUnit] = useState<TemperatureUnit>('F');
  const [compBTemp, setCompBTemp] = useState<string>('90');
  const [compBRh, setCompBRh] = useState<string>('70');
  const [compBUnit, setCompBUnit] = useState<TemperatureUnit>('F');

  // Reference chart interactive selector
  const [chartTempF, setChartTempF] = useState<number>(100);
  const [chartRh, setChartRh] = useState<number>(55);

  const primaryEval = useMemo(() => {
    if (hasReset && !tempInput.trim() && !rhInput.trim()) {
      return { result: null, error: null };
    }
    return computeFromStrings(tempInput, rhInput, unit);
  }, [tempInput, rhInput, unit, hasReset]);

  const activeBand = useMemo(() => {
    if (!primaryEval.result) return null;
    return getRiskBand(primaryEval.result.heatIndexF);
  }, [primaryEval.result]);

  const thresholdRows = useMemo(() => getRiskThresholdRows(), []);

  const compAEval = useMemo(
    () => computeFromStrings(compATemp, compARh, compAUnit),
    [compATemp, compARh, compAUnit],
  );
  const compBEval = useMemo(
    () => computeFromStrings(compBTemp, compBRh, compBUnit),
    [compBTemp, compBRh, compBUnit],
  );

  const chartMatrix = useMemo(() => {
    return CHART_TEMPS_F.map((tF) => ({
      tempF: tF,
      tempC: roundToOneDecimal(fahrenheitToCelsius(tF)),
      cells: CHART_HUMIDITIES.map((rh) => {
        const res = calculateHeatIndex(tF, rh);
        const hiF = roundToOneDecimal(res.heatIndexF);
        const hiC = roundToOneDecimal(res.heatIndexC);
        const band = getRiskBand(res.heatIndexF);
        return { rh, hiF, hiC, band };
      }),
    }));
  }, []);

  const chartSelectedResult = useMemo(() => {
    const res = calculateHeatIndex(chartTempF, chartRh);
    return {
      res,
      band: getRiskBand(res.heatIndexF),
    };
  }, [chartTempF, chartRh]);

  const recordHistory = (tStr: string, rStr: string, u: TemperatureUnit, res: HeatIndexResult) => {
    const hiF = roundToOneDecimal(res.heatIndexF);
    const hiC = roundToOneDecimal(res.heatIndexC);
    const band = getRiskBand(res.heatIndexF);
    setHistory((prev) => {
      if (
        prev.length > 0 &&
        prev[0].tempInput === tStr.trim() &&
        prev[0].rhInput === rStr.trim() &&
        prev[0].unit === u
      ) {
        return prev;
      }
      const next: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tempInput: tStr.trim(),
        unit: u,
        rhInput: rStr.trim(),
        heatIndexF: hiF,
        heatIndexC: hiC,
        bandLabel: band.label,
      };
      return [next, ...prev].slice(0, 8);
    });
  };

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasReset(false);
    const ev = computeFromStrings(tempInput, rhInput, unit);
    if (ev.result) {
      recordHistory(tempInput, rhInput, unit, ev.result);
    }
  };

  const handleLoadExample = (ex: (typeof FRESH_EXAMPLES)[number]) => {
    setHasReset(false);
    setUnit(ex.unit);
    setTempInput(ex.temp);
    setRhInput(ex.rh);
    const ev = computeFromStrings(ex.temp, ex.rh, ex.unit);
    if (ev.result) {
      recordHistory(ex.temp, ex.rh, ex.unit, ev.result);
    }
  };

  const handleReset = () => {
    setTempInput('');
    setRhInput('');
    setHasReset(true);
  };

  const handleReuseHistory = (item: HistoryEntry) => {
    setHasReset(false);
    setUnit(item.unit);
    setTempInput(item.tempInput);
    setRhInput(item.rhInput);
  };

  const handleCopyResult = () => {
    if (!primaryEval.result || !activeBand) return;
    const r = primaryEval.result;
    const summary = [
      `Actual Temperature: ${roundToOneDecimal(r.airTempF).toFixed(1)}°F (${roundToOneDecimal(r.airTempC).toFixed(1)}°C)`,
      `Relative Humidity: ${roundToOneDecimal(r.relativeHumidity).toFixed(1)}%`,
      `Heat Index (Feels Like): ${roundToOneDecimal(r.heatIndexF).toFixed(1)}°F / ${roundToOneDecimal(r.heatIndexC).toFixed(1)}°C`,
      `Difference from Air Temperature: ${formatSigned(r.differenceF, 'F')} (${formatSigned(r.differenceC, 'C')})`,
      `Risk Band: ${activeBand.label} (${activeBand.thresholdLabelF} / ${activeBand.thresholdLabelC})`,
    ].join('\n');
    onCopy(summary, 'heat-index-summary');
  };

  const bandClasses = activeBand ? getBandToneClasses(activeBand.band) : null;

  return (
    <div className="space-y-8">
      {/* 1. Primary Calculator Form & Examples */}
      <form onSubmit={handleCalculateSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="hi-air-temp"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Air Temperature (°{unit})
            </label>
            <input
              id="hi-air-temp"
              type="text"
              inputMode="decimal"
              value={tempInput}
              onChange={(e) => {
                setHasReset(false);
                setTempInput(e.target.value);
              }}
              placeholder={unit === 'F' ? 'e.g. 95' : 'e.g. 30'}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 font-mono text-base font-bold tabular-nums text-slate-950 dark:text-white focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            />
          </div>

          <div className="sm:col-span-3">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Temperature Unit
            </span>
            <div
              role="group"
              aria-label="Temperature unit toggle"
              className="grid grid-cols-2 gap-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1 min-h-[46px]"
            >
              <button
                type="button"
                aria-pressed={unit === 'F'}
                onClick={() => setUnit('F')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  unit === 'F'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Fahrenheit
              </button>
              <button
                type="button"
                aria-pressed={unit === 'C'}
                onClick={() => setUnit('C')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  unit === 'C'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Celsius
              </button>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="hi-rel-humidity"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Relative Humidity (0–100%)
            </label>
            <input
              id="hi-rel-humidity"
              type="text"
              inputMode="decimal"
              value={rhInput}
              onChange={(e) => {
                setHasReset(false);
                setRhInput(e.target.value);
              }}
              placeholder="e.g. 60"
              className="w-full min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 font-mono text-base font-bold tabular-nums text-slate-950 dark:text-white focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <Thermometer className="h-4 w-4" aria-hidden="true" />
              <span>Calculate Heat Index</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              disabled={!primaryEval.result}
              onClick={handleCopyResult}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedKey === 'heat-index-summary' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copiedKey === 'heat-index-summary' ? 'Copied Result' : 'Copy Result'}</span>
            </button>

            <button
              type="button"
              disabled={!primaryEval.result}
              onClick={() => window.print()}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print Result</span>
            </button>
          </div>
        </div>

        {/* Try Example strip (§1.4 Fresh Examples only) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Try Example:
          </span>
          {FRESH_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleLoadExample(ex)}
              className="min-h-[36px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-[#0A8CFF] hover:text-[#0A8CFF] px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </form>

      {/* Validation Error Alert */}
      {primaryEval.error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50 dark:bg-rose-950/40 p-4 flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>{primaryEval.error}</div>
        </div>
      )}

      {/* Cleared Prompt */}
      {hasReset && !primaryEval.result && !primaryEval.error && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/40 p-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Inputs cleared. Enter an air temperature and relative humidity (0–100%) above, or pick a preset example.
        </div>
      )}

      {/* 2. Prominent Result Card + Printable Scope */}
      {primaryEval.result && activeBand && bandClasses && (
        <div id="heat-index-print-area" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Calculated Heat Index (Feels Like Temperature)
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono tabular-nums">
                  <span className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white">
                    {roundToOneDecimal(primaryEval.result.heatIndexF).toFixed(1)}°F
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-slate-500 dark:text-slate-400">
                    / {roundToOneDecimal(primaryEval.result.heatIndexC).toFixed(1)}°C
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className={`text-sm sm:text-base font-bold ${bandClasses.text}`}>
                  {activeBand.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {activeBand.thresholdLabelF} · {activeBand.thresholdLabelC}
                </div>
              </div>
            </div>

            {/* 4 Key Readouts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Actual Air Temperature
                </div>
                <div className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                  {roundToOneDecimal(primaryEval.result.airTempF).toFixed(1)}°F
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {roundToOneDecimal(primaryEval.result.airTempC).toFixed(1)}°C
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Relative Humidity
                </div>
                <div className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                  {roundToOneDecimal(primaryEval.result.relativeHumidity).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Water vapor saturation
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Heat Index (°F / °C)
                </div>
                <div className="mt-1 font-mono text-base sm:text-lg font-bold text-[#0A8CFF] tabular-nums">
                  {roundToOneDecimal(primaryEval.result.heatIndexF).toFixed(1)}°F /{' '}
                  {roundToOneDecimal(primaryEval.result.heatIndexC).toFixed(1)}°C
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {primaryEval.result.method === 'simple'
                    ? 'Simple NWS formula'
                    : 'Rothfusz regression'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Difference vs. Air Temp
                </div>
                <div className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                  {formatSigned(primaryEval.result.differenceF, 'F')}
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {formatSigned(primaryEval.result.differenceC, 'C')}
                </div>
              </div>
            </div>

            {/* Method & Applicability Explanation */}
            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-1.5 border-t border-slate-200 dark:border-slate-800 pt-3.5">
              <p>
                <strong>Apparent temperature context:</strong> Actual Temperature:{' '}
                <span className="font-mono tabular-nums">
                  {unit === 'F'
                    ? `${roundToOneDecimal(primaryEval.result.airTempF).toFixed(1)}°F`
                    : `${roundToOneDecimal(primaryEval.result.airTempC).toFixed(1)}°C`}
                </span>
                , Relative Humidity:{' '}
                <span className="font-mono tabular-nums">
                  {roundToOneDecimal(primaryEval.result.relativeHumidity).toFixed(1)}%
                </span>
                , Feels Like Temperature:{' '}
                <span className="font-mono tabular-nums">
                  {roundToOneDecimal(primaryEval.result.heatIndexF).toFixed(1)}°F
                </span>{' '}
                (Heat Index:{' '}
                <span className="font-mono tabular-nums">
                  {roundToOneDecimal(primaryEval.result.heatIndexF).toFixed(1)}°F /{' '}
                  {roundToOneDecimal(primaryEval.result.heatIndexC).toFixed(1)}°C
                </span>
                ). Heat index represents apparent temperature under shaded, light-wind model assumptions—it is not a measurement of internal body temperature.
              </p>
              {primaryEval.result.rangeNote && (
                <p className="text-amber-700 dark:text-amber-300">
                  <strong>Model note:</strong> {primaryEval.result.rangeNote}
                </p>
              )}
              {(primaryEval.result.lowHumidityAdjustmentApplied ||
                primaryEval.result.highHumidityAdjustmentApplied) && (
                <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  Raw Rothfusz: {roundToOneDecimal(primaryEval.result.rawRothfuszF ?? 0).toFixed(1)}°F ·
                  Adjustment applied: {formatSigned(primaryEval.result.adjustmentF, 'F')}
                </p>
              )}
            </div>
          </div>

          {/* 3. Risk Panel + Verbatim §17 Safety Disclaimer */}
          <div className={`rounded-2xl border p-5 space-y-3 ${bandClasses.surface}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`h-4 w-4 shrink-0 ${bandClasses.text}`} aria-hidden="true" />
                <h3 className={`text-sm font-bold ${bandClasses.text}`}>
                  Heat Risk Band: {activeBand.label}
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                {activeBand.thresholdLabelF} ({activeBand.thresholdLabelC})
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {activeBand.explanation} These bands provide general reference guidance rather than a personalized medical evaluation or an official local weather warning.
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-700/70 pt-3">
              {HEAT_INDEX_SAFETY_DISCLAIMER}
            </p>
          </div>
        </div>
      )}

      {/* 4. Risk Classification Threshold Table */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Heat Risk Categories (NWS Reference Bands)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Celsius thresholds converted directly from Fahrenheit cutoffs
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="py-2.5 px-3.5 font-semibold whitespace-nowrap">Category</th>
                <th className="py-2.5 px-3.5 font-semibold whitespace-nowrap">Fahrenheit</th>
                <th className="py-2.5 px-3.5 font-semibold whitespace-nowrap">Celsius</th>
                <th className="py-2.5 px-3.5 font-semibold">General Exposure Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {thresholdRows.map((row) => {
                const isActive = activeBand?.band === row.band;
                const tone = getBandToneClasses(row.band);
                return (
                  <tr
                    key={row.band}
                    className={isActive ? 'bg-sky-50/60 dark:bg-sky-950/25' : undefined}
                  >
                    <td className={`py-2.5 px-3.5 font-bold whitespace-nowrap ${tone.text}`}>
                      {row.label}
                      {isActive ? ' (Current)' : ''}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono tabular-nums whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {row.rangeF}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {row.rangeC}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 leading-relaxed min-w-[220px]">
                      {row.guidance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Side-by-Side Comparison Mode */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-[#0A8CFF]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Compare Two Conditions (A vs. B)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCompATemp('90');
                setCompARh('40');
                setCompAUnit('F');
                setCompBTemp('90');
                setCompBRh('70');
                setCompBUnit('F');
              }}
              className="text-xs font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
            >
              Reset Example (90°F/40% vs 70%)
            </button>
            <button
              type="button"
              onClick={() => setCompOpen((v) => !v)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
            >
              {compOpen ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compare two sets of entered temperature and humidity values side by side (manual comparison only—not a weather forecast).
        </p>

        {compOpen && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Condition A */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Condition A
                  </span>
                  <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCompAUnit('F')}
                      className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                        compAUnit === 'F'
                          ? 'bg-[#0A8CFF] text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      °F
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompAUnit('C')}
                      className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                        compAUnit === 'C'
                          ? 'bg-[#0A8CFF] text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      °C
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="comp-a-temp"
                      className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                    >
                      Temp (°{compAUnit})
                    </label>
                    <input
                      id="comp-a-temp"
                      type="text"
                      inputMode="decimal"
                      value={compATemp}
                      onChange={(e) => setCompATemp(e.target.value)}
                      className="w-full min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="comp-a-rh"
                      className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                    >
                      Humidity (%)
                    </label>
                    <input
                      id="comp-a-rh"
                      type="text"
                      inputMode="decimal"
                      value={compARh}
                      onChange={(e) => setCompARh(e.target.value)}
                      className="w-full min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                {compAEval.error ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{compAEval.error}</p>
                ) : (
                  compAEval.result && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 text-xs space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <span className="text-slate-500 dark:text-slate-400">Air / RH:</span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {roundToOneDecimal(compAEval.result.airTempF).toFixed(1)}°F /{' '}
                          {roundToOneDecimal(compAEval.result.relativeHumidity).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between font-mono tabular-nums">
                        <span className="text-slate-500 dark:text-slate-400">Heat Index:</span>
                        <span className="font-bold text-slate-950 dark:text-white">
                          {roundToOneDecimal(compAEval.result.heatIndexF).toFixed(1)}°F /{' '}
                          {roundToOneDecimal(compAEval.result.heatIndexC).toFixed(1)}°C
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Risk Band: {getRiskBand(compAEval.result.heatIndexF).label}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Condition B */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Condition B
                  </span>
                  <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCompBUnit('F')}
                      className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                        compBUnit === 'F'
                          ? 'bg-[#0A8CFF] text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      °F
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompBUnit('C')}
                      className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                        compBUnit === 'C'
                          ? 'bg-[#0A8CFF] text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      °C
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="comp-b-temp"
                      className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                    >
                      Temp (°{compBUnit})
                    </label>
                    <input
                      id="comp-b-temp"
                      type="text"
                      inputMode="decimal"
                      value={compBTemp}
                      onChange={(e) => setCompBTemp(e.target.value)}
                      className="w-full min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="comp-b-rh"
                      className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                    >
                      Humidity (%)
                    </label>
                    <input
                      id="comp-b-rh"
                      type="text"
                      inputMode="decimal"
                      value={compBRh}
                      onChange={(e) => setCompBRh(e.target.value)}
                      className="w-full min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                {compBEval.error ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{compBEval.error}</p>
                ) : (
                  compBEval.result && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 text-xs space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <span className="text-slate-500 dark:text-slate-400">Air / RH:</span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {roundToOneDecimal(compBEval.result.airTempF).toFixed(1)}°F /{' '}
                          {roundToOneDecimal(compBEval.result.relativeHumidity).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between font-mono tabular-nums">
                        <span className="text-slate-500 dark:text-slate-400">Heat Index:</span>
                        <span className="font-bold text-slate-950 dark:text-white">
                          {roundToOneDecimal(compBEval.result.heatIndexF).toFixed(1)}°F /{' '}
                          {roundToOneDecimal(compBEval.result.heatIndexC).toFixed(1)}°C
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Risk Band: {getRiskBand(compBEval.result.heatIndexF).label}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {compAEval.result && compBEval.result && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Difference Between Condition B and Condition A:
                </span>
                <span className="font-mono font-bold text-[#0A8CFF] tabular-nums">
                  {Math.abs(
                    roundToOneDecimal(
                      compBEval.result.heatIndexF - compAEval.result.heatIndexF,
                    ),
                  ).toFixed(1)}
                  °F (
                  {formatSigned(
                    compBEval.result.heatIndexF - compAEval.result.heatIndexF,
                    'F',
                  )}{' '}
                  /{' '}
                  {formatSigned(
                    compBEval.result.heatIndexC - compAEval.result.heatIndexC,
                    'C',
                  )}
                  )
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. Engine-Generated Interactive Reference Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interactive Heat Index Reference Table
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every cell is computed dynamically at render time using the Rothfusz engine. Select any temperature and humidity below to highlight a lookup.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label
                htmlFor="chart-temp-select"
                className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1"
              >
                Select Temp (°F / °C)
              </label>
              <select
                id="chart-temp-select"
                value={chartTempF}
                onChange={(e) => setChartTempF(Number(e.target.value))}
                className="min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100"
              >
                {CHART_TEMPS_F.map((tF) => (
                  <option key={tF} value={tF}>
                    {tF}°F ({roundToOneDecimal(fahrenheitToCelsius(tF)).toFixed(1)}°C)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="chart-rh-select"
                className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1"
              >
                Select Humidity (%)
              </label>
              <select
                id="chart-rh-select"
                value={chartRh}
                onChange={(e) => setChartRh(Number(e.target.value))}
                className="min-h-[38px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100"
              >
                {CHART_HUMIDITIES.map((rh) => (
                  <option key={rh} value={rh}>
                    {rh}%
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-mono tabular-nums text-slate-900 dark:text-white">
            Selected Lookup ({chartTempF}°F / {chartRh}%):{' '}
            <strong className="text-[#0A8CFF]">
              {roundToOneDecimal(chartSelectedResult.res.heatIndexF).toFixed(1)}°F
            </strong>{' '}
            ({roundToOneDecimal(chartSelectedResult.res.heatIndexC).toFixed(1)}°C ·{' '}
            <span className="font-sans font-semibold">{chartSelectedResult.band.label}</span>)
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-[11px] sm:text-xs text-center">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <th className="py-2 px-2.5 text-left font-bold whitespace-nowrap">
                  Temp \ RH
                </th>
                {CHART_HUMIDITIES.map((rh) => (
                  <th
                    key={rh}
                    className={`py-2 px-2 font-mono tabular-nums whitespace-nowrap ${
                      chartRh === rh ? 'text-[#0A8CFF] font-bold' : 'font-semibold'
                    }`}
                  >
                    {rh}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {chartMatrix.map((row) => (
                <tr key={row.tempF}>
                  <th
                    scope="row"
                    className={`py-2 px-2.5 text-left font-mono tabular-nums whitespace-nowrap bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 ${
                      chartTempF === row.tempF
                        ? 'text-[#0A8CFF] font-bold'
                        : 'text-slate-800 dark:text-slate-200 font-semibold'
                    }`}
                  >
                    {row.tempF}°F
                  </th>
                  {row.cells.map((cell) => {
                    const isSelected = row.tempF === chartTempF && cell.rh === chartRh;
                    const tone = getBandToneClasses(cell.band.band);
                    return (
                      <td
                        key={cell.rh}
                        onClick={() => {
                          setChartTempF(row.tempF);
                          setChartRh(cell.rh);
                        }}
                        title={`${row.tempF}°F / ${cell.rh}% -> ${cell.hiF.toFixed(1)}°F (${cell.hiC.toFixed(1)}°C) · ${cell.band.label}`}
                        className={`py-2 px-2 font-mono tabular-nums cursor-pointer transition-colors ${tone.cell} ${
                          isSelected ? 'ring-2 ring-inset ring-[#0A8CFF] font-extrabold' : ''
                        }`}
                      >
                        {cell.hiF.toFixed(1)}°
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Session-Only Calculation History (Max 8) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#0A8CFF]" aria-hidden="true" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Session Calculation History ({history.length} / 8)
            </h3>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No saved session calculations yet. Click Calculate Heat Index or choose an example to save an entry here (session-only, never stored on a server).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleReuseHistory(item)}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-[#0A8CFF] px-3 py-2 text-left transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums truncate">
                    {item.tempInput}°{item.unit} · {item.rhInput}% RH
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.bandLabel}
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-[#0A8CFF] tabular-nums shrink-0">
                  {item.heatIndexF.toFixed(1)}°F / {item.heatIndexC.toFixed(1)}°C
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 8. Honest Limits & NWS Methodology References */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 sm:p-5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <BookOpen className="h-4 w-4 text-[#0A8CFF] shrink-0" aria-hidden="true" />
          <span>Honest Limits & Methodology References</span>
        </div>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Standard heat-index calculations assume shaded conditions with light wind; they do not fully account for direct sunlight, wind speed, clothing insulation, physical activity level, or individual health factors.
          </li>
          <li>
            Heat index is not the same as Wet Bulb Globe Temperature (WBGT), which also incorporates solar radiation and wind.
          </li>
          <li>
            This is a manual formula calculator based strictly on the numbers you enter—it does not pull live weather data and is not a substitute for official weather warnings.
          </li>
        </ul>
        <div className="pt-1 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            Methodology references (independent technical sources; no affiliation with NOAA or the National Weather Service):
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {HEAT_INDEX_REFERENCES.map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A8CFF] hover:underline break-all"
              >
                <span>{ref.url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
