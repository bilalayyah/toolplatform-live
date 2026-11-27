import React, { useState, useMemo } from 'react';
import { Copy, Check, Clock, AlertCircle, RefreshCw, DollarSign, Calculator, Plus, Trash2, Printer, History } from 'lucide-react';
import {
  parseTime24,
  formatClockTime,
  formatDuration,
  formatDurationHm,
  minutesBetween,
  calculateBreakMinutes,
  validateBreaks,
  toDecimalHours,
  minutesToDecimalHours,
  fromDecimalHours,
  formatMoney,
  calculatePay,
  type TimeFormat,
  type CurrencyCode,
  type BreakPeriod,
} from '../../lib/hourlyCalculations';

export function OnlineHourlyCalculator() {
  const [activeMode, setActiveMode] = useState<'between' | 'workHours' | 'addSubtract' | 'decimal' | 'pay'>('between');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');
  const [copied, setCopied] = useState<string | null>(null);

  // Mode 1 State
  const [m1Start, setM1Start] = useState<string>('08:30');
  const [m1End, setM1End] = useState<string>('16:30');
  const [m1Overnight, setM1Overnight] = useState<boolean>(false);

  // Mode 2 State
  const [m2Start, setM2Start] = useState<string>('08:00');
  const [m2End, setM2End] = useState<string>('16:30');
  const [m2Overnight, setM2Overnight] = useState<boolean>(false);
  const [breaks, setBreaks] = useState<BreakPeriod[]>([
    { id: '1', start: '12:30', end: '13:00' },
  ]);
  const [unpaidExtra, setUnpaidExtra] = useState<string>('0');

  // Mode 3 State
  const [m3Action, setM3Action] = useState<'add' | 'subtract'>('add');
  const [m3BaseH, setM3BaseH] = useState<string>('3');
  const [m3BaseM, setM3BaseM] = useState<string>('20');
  const [m3DiffH, setM3DiffH] = useState<string>('0');
  const [m3DiffM, setM3DiffM] = useState<string>('45');

  // Mode 4 State
  const [m4Type, setM4Type] = useState<'hm2dec' | 'dec2hm'>('hm2dec');
  const [m4Hours, setM4Hours] = useState<string>('2');
  const [m4Mins, setM4Mins] = useState<string>('45');
  const [m4Dec, setM4Dec] = useState<string>('2.75');
  const [m4Precision, setM4Precision] = useState<number>(2);

  // Mode 5 State
  const [m5Rate, setM5Rate] = useState<string>('25');
  const [m5Currency, setM5Currency] = useState<CurrencyCode>('USD');
  const [m5Hours, setM5Hours] = useState<string>('8');
  const [m5Mins, setM5Mins] = useState<string>('0');
  const [m5OtHours, setM5OtHours] = useState<string>('0');
  const [m5OtMult, setM5OtMult] = useState<string>('1.5');

  // History (max 8)
  const [history, setHistory] = useState<string[]>([]);

  const addHistory = (item: string) => {
    setHistory((prev) => [item, ...prev.filter((h) => h !== item)].slice(0, 8));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Mode 1 computation
  const resBetween = useMemo(() => {
    try {
      const s = parseTime24(m1Start);
      const e = parseTime24(m1End);
      const mins = minutesBetween(s, e, m1Overnight);
      const dec = minutesToDecimalHours(mins, 2);
      return {
        totalMins: mins,
        formatted: formatDuration(mins),
        hm: formatDurationHm(mins),
        decimal: dec,
        error: null,
      };
    } catch (err: any) {
      return { totalMins: 0, formatted: '', hm: '', decimal: 0, error: err?.message || 'Invalid time.' };
    }
  }, [m1Start, m1End, m1Overnight]);

  // Mode 2 computation
  const resWork = useMemo(() => {
    try {
      const s = parseTime24(m2Start);
      const e = parseTime24(m2End);
      const shiftMins = minutesBetween(s, e, m2Overnight);
      const extra = parseInt(unpaidExtra, 10) || 0;
      const breakErr = validateBreaks(s, e, m2Overnight, breaks);
      if (breakErr) {
        return { shiftMins: 0, breakMins: 0, netMins: 0, formatted: '', decimal: 0, error: breakErr };
      }
      const bMins = calculateBreakMinutes(breaks, extra);
      const net = Math.max(0, shiftMins - bMins);
      return {
        shiftMins,
        breakMins: bMins,
        netMins: net,
        formatted: formatDuration(net),
        decimal: minutesToDecimalHours(net, 2),
        error: null,
      };
    } catch (err: any) {
      return { shiftMins: 0, breakMins: 0, netMins: 0, formatted: '', decimal: 0, error: err?.message || 'Calculation error.' };
    }
  }, [m2Start, m2End, m2Overnight, breaks, unpaidExtra]);

  // Mode 3 computation
  const resAddSub = useMemo(() => {
    const bh = parseInt(m3BaseH, 10) || 0;
    const bm = parseInt(m3BaseM, 10) || 0;
    const dh = parseInt(m3DiffH, 10) || 0;
    const dm = parseInt(m3DiffM, 10) || 0;
    const baseTotal = bh * 60 + bm;
    const diffTotal = dh * 60 + dm;

    const resultMins = m3Action === 'add' ? baseTotal + diffTotal : baseTotal - diffTotal;
    return {
      totalMins: resultMins,
      formatted: formatDuration(resultMins),
      hm: formatDurationHm(resultMins),
      decimal: minutesToDecimalHours(resultMins, 2),
      error: null,
    };
  }, [m3Action, m3BaseH, m3BaseM, m3DiffH, m3DiffM]);

  // Mode 4 computation
  const resDecimal = useMemo(() => {
    if (m4Type === 'hm2dec') {
      const h = parseFloat(m4Hours) || 0;
      const m = parseFloat(m4Mins) || 0;
      const dec = toDecimalHours(h, m, m4Precision);
      return { output: `${dec} decimal hours`, error: null };
    } else {
      const dec = parseFloat(m4Dec) || 0;
      const { hours, minutes } = fromDecimalHours(dec);
      return { output: `${hours} hours ${minutes} minutes`, error: null };
    }
  }, [m4Type, m4Hours, m4Mins, m4Dec, m4Precision]);

  // Mode 5 computation
  const resPay = useMemo(() => {
    const rate = parseFloat(m5Rate) || 0;
    const h = parseFloat(m5Hours) || 0;
    const m = parseFloat(m5Mins) || 0;
    const totalWorkMins = h * 60 + m;
    const otH = parseFloat(m5OtHours) || 0;
    const otMult = parseFloat(m5OtMult) || 1.5;

    const pay = calculatePay({
      hourlyRate: rate,
      currency: m5Currency,
      totalWorkingMinutes: totalWorkMins,
      overtimeHours: otH,
      overtimeMultiplier: otMult,
    });

    return {
      ...pay,
      regularStr: formatMoney(pay.regularEarnings, m5Currency),
      overtimeStr: formatMoney(pay.overtimeEarnings, m5Currency),
      totalStr: formatMoney(pay.totalEarnings, m5Currency),
      avgStr: formatMoney(pay.averageHourlyRate, m5Currency),
      error: null,
    };
  }, [m5Rate, m5Currency, m5Hours, m5Mins, m5OtHours, m5OtMult]);

  return (
    <div className="space-y-6">
      {/* Top controls: Mode pills & Time Format toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'between', label: 'Hours Between' },
            { id: 'workHours', label: 'Work Hours & Breaks' },
            { id: 'addSubtract', label: 'Add / Subtract Time' },
            { id: 'decimal', label: 'Decimal Hours' },
            { id: 'pay', label: 'Hourly Pay' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeMode === mode.id
                  ? 'bg-[#0A8CFF] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Format:</span>
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setTimeFormat('12h')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                timeFormat === '12h' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              12h AM/PM
            </button>
            <button
              type="button"
              onClick={() => setTimeFormat('24h')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                timeFormat === '24h' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              24h
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Hours Between Two Times */}
      {activeMode === 'between' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={m1Start}
                onChange={(e) => setM1Start(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={m1End}
                onChange={(e) => setM1End(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="m1Overnight"
              checked={m1Overnight}
              onChange={(e) => setM1Overnight(e.target.checked)}
              className="rounded border-slate-300 text-[#0A8CFF]"
            />
            <label htmlFor="m1Overnight" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Overnight shift (ends on the next day)
            </label>
          </div>

          {/* Quick Fresh Examples */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Fresh Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setM1Start('08:30'); setM1End('16:30'); setM1Overnight(false); }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
              >
                08:30 AM – 04:30 PM (8h)
              </button>
              <button
                type="button"
                onClick={() => { setM1Start('23:15'); setM1End('07:15'); setM1Overnight(true); }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
              >
                11:15 PM – 07:15 AM (Overnight 8h)
              </button>
            </div>
          </div>

          {resBetween.error ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{resBetween.error}</span>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Elapsed Time
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF]">
                {resBetween.formatted}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {resBetween.hm} ({resBetween.decimal} decimal hours)
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(`${resBetween.formatted} (${resBetween.decimal} decimal hours)`, 'm1Res');
                    addHistory(`Elapsed: ${resBetween.formatted}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  {copied === 'm1Res' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied === 'm1Res' ? 'Copied!' : 'Copy Result'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Work Hours & Breaks */}
      {activeMode === 'workHours' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Shift Start Time
              </label>
              <input
                type="time"
                value={m2Start}
                onChange={(e) => setM2Start(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Shift End Time
              </label>
              <input
                type="time"
                value={m2End}
                onChange={(e) => setM2End(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="m2Overnight"
              checked={m2Overnight}
              onChange={(e) => setM2Overnight(e.target.checked)}
              className="rounded border-slate-300 text-[#0A8CFF]"
            />
            <label htmlFor="m2Overnight" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Overnight shift
            </label>
          </div>

          {/* Timed Breaks */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Timed Break Periods (Unpaid)
              </span>
              <button
                type="button"
                onClick={() => setBreaks([...breaks, { id: String(Date.now()), start: '12:00', end: '12:30' }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A8CFF] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Break</span>
              </button>
            </div>

            {breaks.map((b, idx) => (
              <div key={b.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-500 w-16">Break #{idx + 1}</span>
                <input
                  type="time"
                  value={b.start}
                  onChange={(e) => {
                    const next = [...breaks];
                    next[idx].start = e.target.value;
                    setBreaks(next);
                  }}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="time"
                  value={b.end}
                  onChange={(e) => {
                    const next = [...breaks];
                    next[idx].end = e.target.value;
                    setBreaks(next);
                  }}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setBreaks(breaks.filter((_, i) => i !== idx))}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Fresh Examples */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Fresh Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setM2Start('08:00');
                  setM2End('16:30');
                  setM2Overnight(false);
                  setBreaks([{ id: '1', start: '12:30', end: '13:00' }]);
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
              >
                08:00 AM – 04:30 PM (30m break → 8h net)
              </button>
            </div>
          </div>

          {resWork.error ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{resWork.error}</span>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Net Working Hours (Less Breaks)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF]">
                {resWork.formatted}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Gross: {formatDuration(resWork.shiftMins)} | Break: {formatDuration(resWork.breakMins)} | {resWork.decimal} decimal hours
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(`${resWork.formatted} (${resWork.decimal} decimal hours)`, 'm2Res');
                    addHistory(`Net Work: ${resWork.formatted}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  {copied === 'm2Res' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied === 'm2Res' ? 'Copied!' : 'Copy Result'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: Add or Subtract Time */}
      {activeMode === 'addSubtract' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Operation:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setM3Action('add')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  m3Action === 'add' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600'
                }`}
              >
                Add Time (+)
              </button>
              <button
                type="button"
                onClick={() => setM3Action('subtract')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  m3Action === 'subtract' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600'
                }`}
              >
                Subtract Time (−)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Base Duration / Time</span>
              <div className="flex gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Hours</label>
                  <input
                    type="number"
                    value={m3BaseH}
                    onChange={(e) => setM3BaseH(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={m3BaseM}
                    onChange={(e) => setM3BaseM(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Amount to {m3Action === 'add' ? 'Add' : 'Subtract'}</span>
              <div className="flex gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Hours</label>
                  <input
                    type="number"
                    value={m3DiffH}
                    onChange={(e) => setM3DiffH(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={m3DiffM}
                    onChange={(e) => setM3DiffM(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resulting Duration
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF]">
              {resAddSub.formatted}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {resAddSub.hm} ({resAddSub.decimal} decimal hours)
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(resAddSub.formatted, 'm3Res');
                  addHistory(`Time Math: ${resAddSub.formatted}`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
              >
                {copied === 'm3Res' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied === 'm3Res' ? 'Copied!' : 'Copy Result'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: Decimal Hours Calculator */}
      {activeMode === 'decimal' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Conversion Mode:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setM4Type('hm2dec')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  m4Type === 'hm2dec' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600'
                }`}
              >
                Hours & Mins → Decimal
              </button>
              <button
                type="button"
                onClick={() => setM4Type('dec2hm')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  m4Type === 'dec2hm' ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs' : 'text-slate-600'
                }`}
              >
                Decimal → Hours & Mins
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {m4Type === 'hm2dec' ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hours</label>
                  <input
                    type="number"
                    value={m4Hours}
                    onChange={(e) => setM4Hours(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={m4Mins}
                    onChange={(e) => setM4Mins(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Decimal Hours</label>
                <input
                  type="number"
                  step="0.01"
                  value={m4Dec}
                  onChange={(e) => setM4Dec(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Decimal Precision (0–4 dp)</label>
              <select
                value={m4Precision}
                onChange={(e) => setM4Precision(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              >
                <option value={0}>0 decimal places</option>
                <option value={1}>1 decimal place</option>
                <option value={2}>2 decimal places (default)</option>
                <option value={3}>3 decimal places</option>
                <option value={4}>4 decimal places</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Converted Result
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#0A8CFF]">
              {resDecimal.output}
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(resDecimal.output, 'm4Res');
                  addHistory(`Decimal: ${resDecimal.output}`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
              >
                {copied === 'm4Res' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied === 'm4Res' ? 'Copied!' : 'Copy Result'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 5: Hourly Pay Calculator */}
      {activeMode === 'pay' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hourly Rate
              </label>
              <input
                type="number"
                value={m5Rate}
                onChange={(e) => setM5Rate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Currency
              </label>
              <select
                value={m5Currency}
                onChange={(e) => setM5Currency(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (AU$)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overtime Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={m5OtMult}
                onChange={(e) => setM5OtMult(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                value={m5Hours}
                onChange={(e) => setM5Hours(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minutes Worked
              </label>
              <input
                type="number"
                value={m5Mins}
                onChange={(e) => setM5Mins(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overtime Hours
              </label>
              <input
                type="number"
                value={m5OtHours}
                onChange={(e) => setM5OtHours(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Earnings Breakdown
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF]">
              {resPay.totalStr}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="block text-slate-500">Regular Pay</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">{resPay.regularStr}</strong>
              </div>
              <div>
                <span className="block text-slate-500">Overtime Pay</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">{resPay.overtimeStr}</strong>
              </div>
              <div>
                <span className="block text-slate-500">Effective Rate</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">{resPay.avgStr}/hr</strong>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(`Total Pay: ${resPay.totalStr} (${resPay.totalWorkingHours} hours)`, 'm5Res');
                  addHistory(`Earnings: ${resPay.totalStr}`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
              >
                {copied === 'm5Res' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied === 'm5Res' ? 'Copied!' : 'Copy Earnings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print button & Session History */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Result</span>
        </button>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setHistory([])}
            className="text-xs text-rose-600 hover:underline font-medium"
          >
            Clear History ({history.length})
          </button>
        )}
      </div>
    </div>
  );
}
