import React, {useState, useMemo} from 'react';
import {Copy, Check, ArrowRightLeft, LandPlot, AlertCircle, Info} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

interface LandUnit {
  id: string;
  name: string;
  sqFt: number;
  category: 'standard' | 'regional';
  description?: string;
}

const LAND_UNITS: LandUnit[] = [
  {id: 'acre', name: 'Acre (ac)', sqFt: 43560, category: 'standard', description: '43,560 sq ft / 4,840 sq yd'},
  {id: 'sq_ft', name: 'Square Feet (sq ft)', sqFt: 1, category: 'standard', description: 'Base Imperial unit'},
  {id: 'hectare', name: 'Hectare (ha)', sqFt: 107639.1041671, category: 'standard', description: '10,000 sq m / 2.471 acres'},
  {id: 'sq_meter', name: 'Square Meter (m²)', sqFt: 10.76391041671, category: 'standard', description: '10.764 sq ft'},
  {id: 'sq_yard', name: 'Square Yard (sq yd)', sqFt: 9, category: 'standard', description: '9 sq ft (1 Gaj)'},
  {id: 'sq_mile', name: 'Square Mile (sq mi)', sqFt: 27878400, category: 'standard', description: '640 acres / 1 Section'},
  {id: 'sq_km', name: 'Square Kilometer (km²)', sqFt: 10763910.41671, category: 'standard', description: '100 hectares'},
  {id: 'perch', name: 'Perch / Pole / Rod²', sqFt: 272.25, category: 'standard', description: '1/160 acre / 30.25 sq yd'},
  {id: 'cent', name: 'Cent', sqFt: 435.6, category: 'regional', description: '1/100 acre (Common in South India)'},
  {id: 'guntha', name: 'Guntha', sqFt: 1089, category: 'regional', description: '121 sq yd (Maharashtra, Gujarat, KA)'},
  {id: 'marla', name: 'Marla', sqFt: 272.25, category: 'regional', description: '1/160 acre / 9 Sarsahi (Punjab/Haryana)'},
  {id: 'kanal', name: 'Kanal', sqFt: 5445, category: 'regional', description: '20 Marlas / 1/8 Acre (Punjab/Haryana)'},
  {id: 'ground', name: 'Ground', sqFt: 2400, category: 'regional', description: '2,400 sq ft (Tamil Nadu)'},
  {id: 'bigha_pucca', name: 'Bigha (Standard Pucca)', sqFt: 27225, category: 'regional', description: '27,225 sq ft (UP/Rajasthan standard)'},
  {id: 'bigha_bengal', name: 'Bigha (Bengal/Assam)', sqFt: 14400, category: 'regional', description: '14,400 sq ft (20 Cottahs)'},
  {id: 'bigha_kacha', name: 'Bigha (Kacha / Punjab)', sqFt: 9075, category: 'regional', description: '9,075 sq ft (⅓ Pucca)'},
];

export function LandAreaConverterRunner({tool}: Props) {
  const [amount, setAmount] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('acre');
  const [toUnitId, setToUnitId] = useState<string>('sq_ft');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fromUnit = useMemo(() => {
    return LAND_UNITS.find((u) => u.id === fromUnitId) || LAND_UNITS[0];
  }, [fromUnitId]);

  const toUnit = useMemo(() => {
    return LAND_UNITS.find((u) => u.id === toUnitId) || LAND_UNITS[1];
  }, [toUnitId]);

  const swapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const numVal = parseFloat(amount);
  const isValid = !isNaN(numVal) && numVal >= 0;

  const sqFtTotal = isValid ? numVal * fromUnit.sqFt : 0;
  const convertedTotal = isValid && toUnit.sqFt > 0 ? sqFtTotal / toUnit.sqFt : 0;

  // Equivalents across all major land units
  const comparisonList = useMemo(() => {
    if (!isValid || sqFtTotal <= 0) return [];
    return LAND_UNITS.map((u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
      value: sqFtTotal / u.sqFt,
    }));
  }, [isValid, sqFtTotal]);

  const copyResult = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            <LandPlot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Universal land conversion · Standard & regional units · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Area Amount
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              From Unit
            </label>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              <optgroup label="Standard / International Units">
                {LAND_UNITS.filter((u) => u.category === 'standard').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Regional Land Units">
                {LAND_UNITS.filter((u) => u.category === 'regional').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center pb-1">
            <button
              type="button"
              onClick={swapUnits}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF] hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-[#0A8CFF] transition-all"
              title="Swap units"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              To Unit
            </label>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              <optgroup label="Standard / International Units">
                {LAND_UNITS.filter((u) => u.category === 'standard').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Regional Land Units">
                {LAND_UNITS.filter((u) => u.category === 'regional').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Validation error */}
        {!isValid && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Please enter a valid positive area number.</span>
          </div>
        )}

        {/* Result banner */}
        {isValid && (
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Conversion Result
              </span>
              <button
                type="button"
                onClick={() =>
                  copyResult(
                    `${numVal} ${fromUnit.name} = ${convertedTotal.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })} ${toUnit.name}`,
                    'primary'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all shadow-xs"
              >
                {copiedKey === 'primary' ? (
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

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {numVal.toLocaleString()} {fromUnit.name} =
              </div>
              <div className="mt-1 font-mono text-3xl sm:text-4xl font-extrabold text-[#0A8CFF]">
                {convertedTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{' '}
                <span className="text-xl sm:text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">
                  {toUnit.name}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-mono">
                = {sqFtTotal.toLocaleString(undefined, {maximumFractionDigits: 2})} Square Feet (sq ft)
              </div>
            </div>

            {/* Equivalents in all other units */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                All Equivalent Land Units:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {comparisonList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-slate-500 truncate" title={item.name}>
                      {item.name}
                    </span>
                    <span className="mt-1 font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {item.value.toLocaleString(undefined, {maximumFractionDigits: 4})}
                    </span>
                    {item.description && (
                      <span className="text-[9px] text-slate-400 truncate mt-0.5">{item.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Honest Regional Variation Disclosure (Strict Requirement) */}
        <div className="flex items-start gap-3 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/20 p-4 text-xs text-sky-950 dark:text-sky-200 leading-relaxed">
          <Info className="h-4 w-4 shrink-0 text-[#0A8CFF] mt-0.5" />
          <p>
            <strong>Regional Measurement Notice: </strong>
            Units such as Bigha vary substantially by geographic region (from 9,075 sq ft in Punjab to 14,400 sq ft in Bengal and 27,225 sq ft for Pucca Bigha in Uttar Pradesh and Rajasthan). For region-specific calculations, choose the corresponding Bigha variant above or visit our dedicated <strong>Indian Land Unit Converter</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
