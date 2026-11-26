import React, {useState, useMemo} from 'react';
import {Copy, Check, MapPin, AlertCircle, Info, Compass} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

interface StatePreset {
  id: string;
  name: string;
  bighaNote: string;
  units: {id: string; name: string; sqFt: number}[];
}

const INDIAN_STATE_PRESETS: StatePreset[] = [
  {
    id: 'up',
    name: 'Uttar Pradesh & Uttarakhand',
    bighaNote: '1 Pucca Bigha = 27,225 sq ft (approx 3,025 sq yd); 1 Kacha Bigha = 9,075 sq ft (⅓ Pucca).',
    units: [
      {id: 'pucca_bigha', name: 'Pucca Bigha', sqFt: 27225},
      {id: 'kacha_bigha', name: 'Kacha Bigha', sqFt: 9075},
      {id: 'biswa', name: 'Biswa (1/20 Bigha)', sqFt: 1361.25},
      {id: 'biswansi', name: 'Biswansi (1/20 Biswa)', sqFt: 68.0625},
      {id: 'gaj', name: 'Gaj (Square Yard)', sqFt: 9},
      {id: 'acre', name: 'Acre (Killa)', sqFt: 43560},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
      {id: 'sq_meter', name: 'Square Meter', sqFt: 10.76391},
    ],
  },
  {
    id: 'punjab_haryana',
    name: 'Punjab & Haryana',
    bighaNote: '1 Killa (Acre) = 8 Kanals = 160 Marlas = 43,560 sq ft. 1 Bigha = 9,075 sq ft.',
    units: [
      {id: 'killa', name: 'Killa / Acre', sqFt: 43560},
      {id: 'kanal', name: 'Kanal (1/8 Killa)', sqFt: 5445},
      {id: 'marla', name: 'Marla (1/20 Kanal)', sqFt: 272.25},
      {id: 'sarsahi', name: 'Sarsahi (1/9 Marla)', sqFt: 30.25},
      {id: 'bigha_punjab', name: 'Bigha (Punjab/Haryana)', sqFt: 9075},
      {id: 'biswa_punjab', name: 'Biswa', sqFt: 453.75},
      {id: 'gaj', name: 'Gaj (Square Yard)', sqFt: 9},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    bighaNote: '1 Pucca Bigha = 27,225 sq ft (165 ft × 165 ft); 1 Kacha/Standard Bigha = 17,424 sq ft.',
    units: [
      {id: 'pucca_bigha_raj', name: 'Pucca Bigha', sqFt: 27225},
      {id: 'bigha_raj', name: 'Standard Bigha', sqFt: 17424},
      {id: 'biswa_raj', name: 'Biswa (1/20 Bigha)', sqFt: 871.2},
      {id: 'biswansi_raj', name: 'Biswansi', sqFt: 43.56},
      {id: 'acre', name: 'Acre', sqFt: 43560},
      {id: 'gaj', name: 'Gaj', sqFt: 9},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
    ],
  },
  {
    id: 'bihar',
    name: 'Bihar',
    bighaNote: '1 Bigha = 20 Kathas = 27,220 sq ft. 1 Katha = 20 Dhurs = 1,361 sq ft.',
    units: [
      {id: 'bigha_bihar', name: 'Bigha', sqFt: 27220},
      {id: 'katha_bihar', name: 'Katha (1/20 Bigha)', sqFt: 1361},
      {id: 'dhur_bihar', name: 'Dhur (1/20 Katha)', sqFt: 68.05},
      {id: 'dhurki', name: 'Dhurki (1/20 Dhur)', sqFt: 3.4025},
      {id: 'acre', name: 'Acre', sqFt: 43560},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
    ],
  },
  {
    id: 'bengal',
    name: 'West Bengal',
    bighaNote: '1 Bigha = 20 Cottahs = 14,400 sq ft. 1 Cottah = 16 Chataks = 720 sq ft (80 sq yd).',
    units: [
      {id: 'bigha_bengal', name: 'Bigha', sqFt: 14400},
      {id: 'cottah_bengal', name: 'Cottah (Katha)', sqFt: 720},
      {id: 'chatak_bengal', name: 'Chatak (1/16 Cottah)', sqFt: 45},
      {id: 'acre', name: 'Acre', sqFt: 43560},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
      {id: 'sq_meter', name: 'Square Meter', sqFt: 10.76391},
    ],
  },
  {
    id: 'assam',
    name: 'Assam',
    bighaNote: '1 Bigha = 5 Kathas = 14,400 sq ft. 1 Katha = 20 Lessas = 2,880 sq ft. 1 Lessa = 144 sq ft.',
    units: [
      {id: 'bigha_assam', name: 'Bigha', sqFt: 14400},
      {id: 'katha_assam', name: 'Katha (1/5 Bigha)', sqFt: 2880},
      {id: 'lessa_assam', name: 'Lessa (1/20 Katha)', sqFt: 144},
      {id: 'acre', name: 'Acre', sqFt: 43560},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
    ],
  },
  {
    id: 'maharashtra_gujarat',
    name: 'Maharashtra & Gujarat',
    bighaNote: '1 Guntha = 121 sq yd = 1,089 sq ft (40 Gunthas = 1 Acre). 1 Vigha / Bigha in Gujarat = 17,424 sq ft.',
    units: [
      {id: 'guntha', name: 'Guntha (121 sq yd)', sqFt: 1089},
      {id: 'vigha_gujarat', name: 'Vigha / Bigha', sqFt: 17424},
      {id: 'acre', name: 'Acre (40 Gunthas)', sqFt: 43560},
      {id: 'hectare', name: 'Hectare (100 Ares)', sqFt: 107639.104},
      {id: 'gaj', name: 'Gaj (Square Yard)', sqFt: 9},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
      {id: 'sq_meter', name: 'Square Meter', sqFt: 10.76391},
    ],
  },
  {
    id: 'south_india',
    name: 'Tamil Nadu, AP, Telangana & Karnataka',
    bighaNote: '1 Ground = 2,400 sq ft. 1 Cent = 435.6 sq ft (100 Cents = 1 Acre). 1 Guntha = 1,089 sq ft. 1 Ankanam = 72 sq ft.',
    units: [
      {id: 'ground_tn', name: 'Ground (Tamil Nadu)', sqFt: 2400},
      {id: 'cent_south', name: 'Cent (1/100 Acre)', sqFt: 435.6},
      {id: 'guntha_south', name: 'Guntha (AP/TG/KA)', sqFt: 1089},
      {id: 'ankanam', name: 'Ankanam (AP/TG)', sqFt: 72},
      {id: 'kuncham', name: 'Kuncham (10 Cents)', sqFt: 4356},
      {id: 'acre', name: 'Acre', sqFt: 43560},
      {id: 'hectare', name: 'Hectare', sqFt: 107639.104},
      {id: 'sq_ft', name: 'Square Feet', sqFt: 1},
    ],
  },
];

export function IndianLandUnitRunner({tool}: Props) {
  const [selectedStateId, setSelectedStateId] = useState<string>('up');
  const [amount, setAmount] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('pucca_bigha');
  const [toUnitId, setToUnitId] = useState<string>('sq_ft');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeState = useMemo(() => {
    return INDIAN_STATE_PRESETS.find((s) => s.id === selectedStateId) || INDIAN_STATE_PRESETS[0];
  }, [selectedStateId]);

  // When state changes, reset unit selections to default available in that state
  const handleStateChange = (newId: string) => {
    setSelectedStateId(newId);
    const stateObj = INDIAN_STATE_PRESETS.find((s) => s.id === newId) || INDIAN_STATE_PRESETS[0];
    setFromUnitId(stateObj.units[0].id);
    setToUnitId(stateObj.units.find((u) => u.id === 'sq_ft')?.id || stateObj.units[1].id);
  };

  const fromUnit = useMemo(() => {
    return activeState.units.find((u) => u.id === fromUnitId) || activeState.units[0];
  }, [activeState, fromUnitId]);

  const toUnit = useMemo(() => {
    return activeState.units.find((u) => u.id === toUnitId) || activeState.units[1];
  }, [activeState, toUnitId]);

  const numVal = parseFloat(amount);
  const isValid = !isNaN(numVal) && numVal >= 0;

  // Convert to sq ft first, then to target
  const sqFtTotal = isValid ? numVal * fromUnit.sqFt : 0;
  const convertedResult = isValid && toUnit.sqFt > 0 ? sqFtTotal / toUnit.sqFt : 0;

  // Full breakdown across all units in this state
  const breakdown = useMemo(() => {
    if (!isValid || sqFtTotal <= 0) return [];
    return activeState.units.map((u) => ({
      id: u.id,
      name: u.name,
      value: sqFtTotal / u.sqFt,
    }));
  }, [activeState, isValid, sqFtTotal]);

  const copyToClipboard = (text: string, key: string) => {
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
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              State-wise regional conversion factors · Transparent bigha sizes · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* State / Region selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            1. Select State / Revenue Region (Determines Local Unit Definitions)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {INDIAN_STATE_PRESETS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStateChange(st.id)}
                className={`rounded-xl p-3 text-left border transition-all text-xs font-semibold ${
                  selectedStateId === st.id
                    ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF] shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{st.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Regional note banner */}
          <div className="mt-3 rounded-lg border border-sky-200 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/20 p-3 text-xs text-sky-900 dark:text-sky-200 font-mono">
            <strong>{activeState.name} Benchmark: </strong>
            {activeState.bighaNote}
          </div>
        </div>

        {/* Amount & Unit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Quantity
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

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              From Unit
            </label>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {activeState.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.sqFt.toLocaleString()} sq ft)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              To Unit
            </label>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {activeState.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation error */}
        {!isValid && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Please enter a valid positive number.</span>
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
                  copyToClipboard(
                    `${numVal} ${fromUnit.name} = ${convertedResult.toLocaleString(undefined, {
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
                {numVal.toLocaleString()} {fromUnit.name} ({activeState.name}) =
              </div>
              <div className="mt-1 font-mono text-3xl sm:text-4xl font-extrabold text-[#0A8CFF]">
                {convertedResult.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{' '}
                <span className="text-xl sm:text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">
                  {toUnit.name}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-mono">
                Total Land Area: {sqFtTotal.toLocaleString(undefined, {maximumFractionDigits: 2})} Square Feet (sq ft)
              </div>
            </div>

            {/* Complete Regional Breakdown Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Equivalent Area in All Regional Units ({activeState.name}):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {breakdown.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-slate-500 truncate">{item.name}</span>
                    <span className="mt-1 font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {item.value.toLocaleString(undefined, {maximumFractionDigits: 4})}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Honest Legal Disclosure (Strict Requirement) */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
          <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p>
            <strong>Important Legal Notice on Indian Land Records: </strong>
            Traditional land measurements such as Bigha, Biswa, Katha, and Marla are state-defined conventions rather than nationally standardized SI units. Multipliers can vary between adjoining districts or historical cadastral surveys. Always consult your official village land revenue record (Khasra / Khatauni / Jamabandi / Patta) and local Patwari / Tehsildar before executing property transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
