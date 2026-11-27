import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRightLeft, Binary, AlertCircle, RefreshCw, Calendar, Hash, History } from 'lucide-react';
import {
  integerToRoman,
  romanToInteger,
  validateRoman,
  convertDateToRoman,
  formatRomanDate,
  convertRomanToDate,
  formatStandardDate,
} from '../../lib/romanNumerals';

export function RomanNumeralConverter() {
  const [activeTab, setActiveTab] = useState<'num2rom' | 'rom2num' | 'dateConv'>('num2rom');
  const [copied, setCopied] = useState<string | null>(null);

  // Tab 1 state
  const [numInput, setNumInput] = useState<string>('2026');

  // Tab 2 state
  const [romInput, setRomInput] = useState<string>('MMXXVI');

  // Tab 3 state
  const [dateMode, setDateMode] = useState<'std2rom' | 'rom2std'>('std2rom');
  const [dayInput, setDayInput] = useState<string>('27');
  const [monthInput, setMonthInput] = useState<string>('11');
  const [yearInput, setYearInput] = useState<string>('2026');
  const [dateFormat, setDateFormat] = useState<'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'>('DD/MM/YYYY');
  const [romDateInput, setRomDateInput] = useState<string>('XXVII/XI/MMXXVI');

  // Session history (max 8)
  const [history, setHistory] = useState<string[]>([]);

  const addHistory = (item: string) => {
    setHistory((prev) => [item, ...prev.filter((h) => h !== item)].slice(0, 8));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Tab 1 computation
  const numResult = useMemo(() => {
    const trimmed = numInput.trim();
    if (!trimmed) return { result: '', error: null };
    const n = Number(trimmed);
    if (!Number.isInteger(n) || n < 1 || n > 3999) {
      return { result: '', error: 'Please enter a whole number between 1 and 3999.' };
    }
    try {
      const res = integerToRoman(n);
      return { result: res, error: null };
    } catch (err: any) {
      return { result: '', error: err?.message || 'Conversion failed.' };
    }
  }, [numInput]);

  // Tab 2 computation
  const romResult = useMemo(() => {
    const trimmed = romInput.trim();
    if (!trimmed) return { value: null, error: null };
    const validation = validateRoman(trimmed);
    if (!validation.valid) {
      return { value: null, error: validation.error };
    }
    return { value: validation.value, error: null };
  }, [romInput]);

  // Tab 3 computation
  const dateResult = useMemo(() => {
    if (dateMode === 'std2rom') {
      const d = parseInt(dayInput, 10);
      const m = parseInt(monthInput, 10);
      const y = parseInt(yearInput, 10);
      if (isNaN(d) || isNaN(m) || isNaN(y)) {
        return { output: '', error: 'Please enter valid day, month, and year numbers.' };
      }
      try {
        const parts = convertDateToRoman(d, m, y);
        const formatted = formatRomanDate(parts, dateFormat);
        return {
          output: formatted,
          parts,
          standard: formatStandardDate(d, m, y, dateFormat),
          error: null,
        };
      } catch (err: any) {
        return { output: '', error: err?.message || 'Invalid calendar date.' };
      }
    } else {
      const trimmed = romDateInput.trim();
      if (!trimmed) return { output: '', error: null };
      try {
        const { day, month, year } = convertRomanToDate(trimmed);
        const std = formatStandardDate(day, month, year, dateFormat);
        const romanParts = convertDateToRoman(day, month, year);
        return {
          output: std,
          parts: romanParts,
          standard: std,
          error: null,
        };
      } catch (err: any) {
        return { output: '', error: err?.message || 'Invalid Roman date format.' };
      }
    }
  }, [dateMode, dayInput, monthInput, yearInput, dateFormat, romDateInput]);

  return (
    <div className="space-y-6">
      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('num2rom')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'num2rom'
              ? 'bg-[#0A8CFF] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Number to Roman
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rom2num')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'rom2num'
              ? 'bg-[#0A8CFF] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Roman to Number
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dateConv')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'dateConv'
              ? 'bg-[#0A8CFF] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Roman Date Converter
        </button>
      </div>

      {/* TAB 1: Number to Roman */}
      {activeTab === 'num2rom' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Whole Number (1–3999)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={3999}
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="e.g. 2026"
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono bg-white dark:bg-slate-900 text-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  setNumInput('');
                }}
                className="px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (numResult.result) {
                    setRomInput(numResult.result);
                    setActiveTab('rom2num');
                  }
                }}
                className="px-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs font-semibold text-[#0A8CFF] hover:bg-sky-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Swap</span>
              </button>
            </div>
          </div>

          {/* Fresh Example Buttons */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Fresh Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              {[7, 23, 58, 149, 1977, 2888].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setNumInput(String(ex))}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] transition-colors"
                >
                  {ex} → {integerToRoman(ex)}
                </button>
              ))}
            </div>
          </div>

          {/* Result Box */}
          {numResult.error ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{numResult.error}</span>
            </div>
          ) : (
            numResult.result && (
              <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Roman Numeral Result
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF] tracking-wider">
                  {numResult.result}
                </div>
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(numResult.result, 'numRes');
                      addHistory(`${numInput} = ${numResult.result}`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    {copied === 'numRes' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied === 'numRes' ? 'Copied!' : 'Copy Roman Numeral'}</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 2: Roman to Number */}
      {activeTab === 'rom2num' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Roman Numeral (e.g. MMXXVI, MCMXCIV)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={romInput}
                onChange={(e) => setRomInput(e.target.value)}
                placeholder="e.g. MMXXVI"
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono uppercase bg-white dark:bg-slate-900 text-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setRomInput('')}
                className="px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (romResult.value !== null) {
                    setNumInput(String(romResult.value));
                    setActiveTab('num2rom');
                  }
                }}
                className="px-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs font-semibold text-[#0A8CFF] hover:bg-sky-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Swap</span>
              </button>
            </div>
          </div>

          {/* Quick Example Buttons */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Fresh Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              {['VII', 'XXIII', 'LVIII', 'CXLIX', 'MCMLXXVII', 'MMDCCCLXXXVIII'].map((rom) => (
                <button
                  key={rom}
                  type="button"
                  onClick={() => setRomInput(rom)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] transition-colors"
                >
                  {rom} → {romanToInteger(rom)}
                </button>
              ))}
            </div>
          </div>

          {/* Result Box */}
          {romResult.error ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{romResult.error}</span>
            </div>
          ) : (
            romResult.value !== null && (
              <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Arabic Number Result
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A8CFF]">
                  {romResult.value}
                </div>
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(String(romResult.value), 'romRes');
                      addHistory(`${romInput.toUpperCase()} = ${romResult.value}`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    {copied === 'romRes' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied === 'romRes' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 3: Roman Date Converter */}
      {activeTab === 'dateConv' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date Mode:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setDateMode('std2rom')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  dateMode === 'std2rom'
                    ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Standard → Roman Date
              </button>
              <button
                type="button"
                onClick={() => setDateMode('rom2std')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  dateMode === 'rom2std'
                    ? 'bg-white dark:bg-slate-900 text-[#0A8CFF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Roman → Standard Date
              </button>
            </div>
          </div>

          {dateMode === 'std2rom' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Day (1–31)
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Month (1–12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Year (1–3999)
                </label>
                <input
                  type="number"
                  min={1}
                  max={3999}
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Roman Date (e.g. XXVII/XI/MMXXVI)
              </label>
              <input
                type="text"
                value={romDateInput}
                onChange={(e) => setRomDateInput(e.target.value)}
                placeholder="XXVII/XI/MMXXVI"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono uppercase bg-white dark:bg-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Result Box */}
          {dateResult.error ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{dateResult.error}</span>
            </div>
          ) : (
            dateResult.output && (
              <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-900 text-center space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {dateMode === 'std2rom' ? 'Roman Date Result' : 'Standard Date Result'}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0A8CFF] tracking-wider">
                  {dateResult.output}
                </div>
                {dateResult.parts && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    Components: Day: {dateResult.parts.day} ({dayInput}), Month: {dateResult.parts.month} ({monthInput}), Year: {dateResult.parts.year} ({yearInput})
                  </div>
                )}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(dateResult.output, 'dateRes');
                      addHistory(`Date: ${dateResult.output}`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    {copied === 'dateRes' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied === 'dateRes' ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Session History */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <History className="h-4 w-4 text-[#0A8CFF]" />
              <span>Recent Session Conversions (Max 8)</span>
            </div>
            <button
              type="button"
              onClick={() => setHistory([])}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
