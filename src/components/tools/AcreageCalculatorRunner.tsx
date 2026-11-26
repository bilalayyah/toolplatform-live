import React, {useState, useMemo} from 'react';
import {Copy, Check, LandPlot, AlertCircle, Sparkles, Ruler} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

type ShapeType = 'rectangle' | 'triangle-base-height' | 'triangle-3-sides' | 'circle';

interface LengthUnit {
  id: string;
  label: string;
  toFeet: number; // multiplier to convert to feet
}

const LENGTH_UNITS: LengthUnit[] = [
  {id: 'ft', label: 'Feet (ft)', toFeet: 1},
  {id: 'm', label: 'Meters (m)', toFeet: 3.280839895},
  {id: 'yd', label: 'Yards (yd)', toFeet: 3},
  {id: 'rod', label: 'Rods (16.5 ft)', toFeet: 16.5},
  {id: 'ch', label: 'Chains (66 ft)', toFeet: 66},
];

export function AcreageCalculatorRunner({tool}: Props) {
  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [unit, setUnit] = useState<string>('ft');

  // Rectangular inputs
  const [rectLength, setRectLength] = useState<string>('208.71');
  const [rectWidth, setRectWidth] = useState<string>('208.71');

  // Triangle Base/Height
  const [triBase, setTriBase] = useState<string>('300');
  const [triHeight, setTriHeight] = useState<string>('290.4');

  // Triangle 3 Sides
  const [triA, setTriA] = useState<string>('300');
  const [triB, setTriB] = useState<string>('300');
  const [triC, setTriC] = useState<string>('300');

  // Circular plot
  const [circleMeasure, setCircleMeasure] = useState<'radius' | 'diameter'>('radius');
  const [circleVal, setCircleVal] = useState<string>('117.75');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const unitFactor = useMemo(() => {
    const found = LENGTH_UNITS.find((u) => u.id === unit);
    return found ? found.toFeet : 1;
  }, [unit]);

  // Compute area in Square Feet
  const calculation = useMemo(() => {
    let sqFt = 0;
    let error: string | null = null;

    if (shape === 'rectangle') {
      const l = parseFloat(rectLength);
      const w = parseFloat(rectWidth);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
        error = 'Please enter positive numbers for length and width.';
      } else {
        sqFt = (l * unitFactor) * (w * unitFactor);
      }
    } else if (shape === 'triangle-base-height') {
      const b = parseFloat(triBase);
      const h = parseFloat(triHeight);
      if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
        error = 'Please enter positive numbers for base and height.';
      } else {
        sqFt = 0.5 * (b * unitFactor) * (h * unitFactor);
      }
    } else if (shape === 'triangle-3-sides') {
      const a = parseFloat(triA);
      const b = parseFloat(triB);
      const c = parseFloat(triC);
      if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
        error = 'Please enter positive numbers for all three sides.';
      } else {
        const aFt = a * unitFactor;
        const bFt = b * unitFactor;
        const cFt = c * unitFactor;
        // Check triangle inequality
        if (aFt + bFt <= cFt || aFt + cFt <= bFt || bFt + cFt <= aFt) {
          error = 'Invalid triangle: The sum of any two sides must be strictly greater than the third side.';
        } else {
          const s = (aFt + bFt + cFt) / 2;
          sqFt = Math.sqrt(s * (s - aFt) * (s - bFt) * (s - cFt));
        }
      }
    } else if (shape === 'circle') {
      const v = parseFloat(circleVal);
      if (isNaN(v) || v <= 0) {
        error = 'Please enter a positive number for radius/diameter.';
      } else {
        const rFt = circleMeasure === 'radius' ? v * unitFactor : (v / 2) * unitFactor;
        sqFt = Math.PI * rFt * rFt;
      }
    }

    if (error || sqFt <= 0) {
      return {valid: false, error, sqFt: 0, acres: 0, sqMeters: 0, hectares: 0, sqYards: 0, sqMiles: 0, cents: 0, gunthas: 0};
    }

    const acres = sqFt / 43560;
    const sqMeters = sqFt * 0.09290304;
    const hectares = sqMeters / 10000;
    const sqYards = sqFt / 9;
    const sqMiles = acres / 640;
    const cents = sqFt / 435.6;
    const gunthas = sqFt / 1089;

    return {
      valid: true,
      error: null,
      sqFt,
      acres,
      sqMeters,
      hectares,
      sqYards,
      sqMiles,
      cents,
      gunthas,
    };
  }, [shape, unitFactor, rectLength, rectWidth, triBase, triHeight, triA, triB, triC, circleMeasure, circleVal]);

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
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
              {tool.name} — Interactive Plot Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exact geometric acreage math (1 acre = 43,560 sq ft) · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Shape Mode Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            1. Select Land Plot Geometry
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setShape('rectangle')}
              className={`rounded-xl p-3 text-center border transition-all ${
                shape === 'rectangle'
                  ? 'border-[#0A8CFF] bg-sky-50/80 dark:bg-slate-800 text-[#0A8CFF] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm">Rectangular Lot</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Length × Width</div>
            </button>
            <button
              type="button"
              onClick={() => setShape('triangle-base-height')}
              className={`rounded-xl p-3 text-center border transition-all ${
                shape === 'triangle-base-height'
                  ? 'border-[#0A8CFF] bg-sky-50/80 dark:bg-slate-800 text-[#0A8CFF] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm">Triangle (Base/Ht)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">½ × Base × Height</div>
            </button>
            <button
              type="button"
              onClick={() => setShape('triangle-3-sides')}
              className={`rounded-xl p-3 text-center border transition-all ${
                shape === 'triangle-3-sides'
                  ? 'border-[#0A8CFF] bg-sky-50/80 dark:bg-slate-800 text-[#0A8CFF] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm">Triangle (3 Sides)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Heron's Formula</div>
            </button>
            <button
              type="button"
              onClick={() => setShape('circle')}
              className={`rounded-xl p-3 text-center border transition-all ${
                shape === 'circle'
                  ? 'border-[#0A8CFF] bg-sky-50/80 dark:bg-slate-800 text-[#0A8CFF] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm">Circular Plot</div>
              <div className="text-[10px] text-slate-500 mt-0.5">π × r²</div>
            </button>
          </div>
        </div>

        {/* Input Dimensions and Measurement Unit */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Enter Plot Dimensions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Input Unit:</span>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100"
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rectangular Lot Fields */}
          {shape === 'rectangle' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Length ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={rectLength}
                  onChange={(e) => setRectLength(e.target.value)}
                  placeholder="e.g., 208.71"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Tip: 208.71 ft × 208.71 ft = exactly 1 acre</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Width ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={rectWidth}
                  onChange={(e) => setRectWidth(e.target.value)}
                  placeholder="e.g., 208.71"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Triangle Base/Height Fields */}
          {shape === 'triangle-base-height' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Base ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={triBase}
                  onChange={(e) => setTriBase(e.target.value)}
                  placeholder="300"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Perpendicular Height ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={triHeight}
                  onChange={(e) => setTriHeight(e.target.value)}
                  placeholder="290.4"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Triangle 3 Sides Fields */}
          {shape === 'triangle-3-sides' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Side A ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={triA}
                  onChange={(e) => setTriA(e.target.value)}
                  placeholder="300"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Side B ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={triB}
                  onChange={(e) => setTriB(e.target.value)}
                  placeholder="300"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Side C ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={triC}
                  onChange={(e) => setTriC(e.target.value)}
                  placeholder="300"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Circular Plot Fields */}
          {shape === 'circle' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <div className="flex items-center gap-4 mb-2 text-xs">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="circleMeasure"
                      checked={circleMeasure === 'radius'}
                      onChange={() => setCircleMeasure('radius')}
                      className="text-[#0A8CFF]"
                    />
                    <span>Radius (r)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="circleMeasure"
                      checked={circleMeasure === 'diameter'}
                      onChange={() => setCircleMeasure('diameter')}
                      className="text-[#0A8CFF]"
                    />
                    <span>Diameter (d)</span>
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={circleVal}
                  onChange={(e) => setCircleVal(e.target.value)}
                  placeholder="117.75"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="text-xs text-slate-500 pb-2">
                Tip: A circular lot with radius 117.75 ft has an area of approx 1.000 acre (43,560 sq ft).
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {calculation.error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
            <p>{calculation.error}</p>
          </div>
        )}

        {/* Results Grid */}
        {calculation.valid && (
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Calculated Land Plot Area
              </span>
              <button
                type="button"
                onClick={() =>
                  copyValue(
                    `${calculation.acres.toFixed(4)} Acres (${calculation.sqFt.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} sq ft)`,
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
                    <span>Copy Acreage</span>
                  </>
                )}
              </button>
            </div>

            {/* Hero acreage banner */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Plot Acreage
              </div>
              <div className="mt-1 font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
                {calculation.acres.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                })}{' '}
                <span className="text-xl sm:text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">
                  {calculation.acres === 1 ? 'Acre' : 'Acres'}
                </span>
              </div>
              <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
                = {calculation.sqFt.toLocaleString(undefined, {maximumFractionDigits: 2})} Square Feet (sq ft)
              </div>
            </div>

            {/* Standard unit breakdown cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Square Feet (sq ft)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.sqFt.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Square Meters (m²)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.sqMeters.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Hectares (ha)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.hectares.toLocaleString(undefined, {maximumFractionDigits: 4})}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Square Yards (yd²)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.sqYards.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Cents (435.6 sq ft)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.cents.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 flex flex-col justify-between">
                <span className="text-xs text-slate-500">Gunthas (1,089 sq ft)</span>
                <span className="mt-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {calculation.gunthas.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
