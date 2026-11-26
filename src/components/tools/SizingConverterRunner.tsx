import React, {useState, useMemo} from 'react';
import {Copy, Check, Shirt, Ruler, Sparkles, AlertCircle} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

export function SizingConverterRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            <Shirt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Sizing Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard international sizing specifications · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'unit-clothing-size-converter' && <ClothingConverter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'unit-shoe-size-converter' && <ShoeConverter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'unit-ring-size-converter' && <RingConverter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'unit-hat-size-converter' && <HatConverter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'unit-glove-size-calculator' && <GloveConverter onCopy={copyText} copiedKey={copiedKey} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. Clothing Size Converter
// ----------------------------------------------------
const CLOTHING_DATA: Record<
  string,
  {label: string; sizes: {intl: string; us: string; uk: string; eu: string; bustCm: string; waistCm: string}[]}
> = {
  womens_tops: {
    label: "Women's Tops & Dresses",
    sizes: [
      {intl: 'XXS', us: '0', uk: '4', eu: '32', bustCm: '76-80', waistCm: '58-62'},
      {intl: 'XS', us: '2', uk: '6', eu: '34', bustCm: '80-84', waistCm: '62-66'},
      {intl: 'S', us: '4-6', uk: '8-10', eu: '36-38', bustCm: '84-88', waistCm: '66-70'},
      {intl: 'M', us: '8-10', uk: '12-14', eu: '40-42', bustCm: '88-96', waistCm: '70-78'},
      {intl: 'L', us: '12-14', uk: '16-18', eu: '44-46', bustCm: '96-104', waistCm: '78-86'},
      {intl: 'XL', us: '16-18', uk: '20-22', eu: '48-50', bustCm: '104-114', waistCm: '86-96'},
      {intl: 'XXL', us: '20-22', uk: '24-26', eu: '52-54', bustCm: '114-124', waistCm: '96-106'},
    ],
  },
  mens_tops: {
    label: "Men's Shirts & Jackets",
    sizes: [
      {intl: 'XS', us: '34', uk: '34', eu: '44', bustCm: '86-91', waistCm: '71-76'},
      {intl: 'S', us: '36', uk: '36', eu: '46', bustCm: '91-96', waistCm: '76-81'},
      {intl: 'M', us: '38-40', uk: '38-40', eu: '48-50', bustCm: '96-102', waistCm: '81-86'},
      {intl: 'L', us: '42-44', uk: '42-44', eu: '52-54', bustCm: '107-112', waistCm: '91-97'},
      {intl: 'XL', us: '46-48', uk: '46-48', eu: '56-58', bustCm: '117-122', waistCm: '102-107'},
      {intl: 'XXL', us: '50-52', uk: '50-52', eu: '60-62', bustCm: '127-132', waistCm: '112-117'},
      {intl: '3XL', us: '54', uk: '54', eu: '64', bustCm: '137-142', waistCm: '122-127'},
    ],
  },
};

function ClothingConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [department, setDepartment] = useState<'womens_tops' | 'mens_tops'>('womens_tops');
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // Default 'S' or 'M'

  const currentDept = CLOTHING_DATA[department];
  const activeSize = currentDept.sizes[selectedIndex] || currentDept.sizes[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setDepartment('womens_tops');
            setSelectedIndex(2);
          }}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
            department === 'womens_tops'
              ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          Women's Tops & Dresses
        </button>
        <button
          type="button"
          onClick={() => {
            setDepartment('mens_tops');
            setSelectedIndex(2);
          }}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
            department === 'mens_tops'
              ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          Men's Shirts & Jackets
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Alpha / International Size
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {currentDept.sizes.map((s, idx) => (
            <button
              key={s.intl}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`rounded-xl py-3 text-center border font-bold text-sm sm:text-base transition-all ${
                selectedIndex === idx
                  ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300'
              }`}
            >
              {s.intl}
            </button>
          ))}
        </div>
      </div>

      {/* Cross-system Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Equivalent Sizes across Regional Standards
          </span>
          <button
            type="button"
            onClick={() =>
              onCopy(
                `${activeSize.intl} -> US: ${activeSize.us}, UK: ${activeSize.uk}, EU: ${activeSize.eu}`,
                'clothing'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
          >
            {copiedKey === 'clothing' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Sizes</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">United States (US)</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{activeSize.us}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">United Kingdom (UK)</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{activeSize.uk}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Europe (EU)</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{activeSize.eu}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">International</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{activeSize.intl}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-wrap justify-around gap-4 text-xs">
          <div>
            <span className="text-slate-400">Bust / Chest Range: </span>
            <strong className="text-slate-800 dark:text-slate-200 font-mono">{activeSize.bustCm} cm</strong>
          </div>
          <div>
            <span className="text-slate-400">Waist Range: </span>
            <strong className="text-slate-800 dark:text-slate-200 font-mono">{activeSize.waistCm} cm</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Shoe Size Converter
// ----------------------------------------------------
const SHOE_DATA_MENS = [
  {us: 6.0, uk: 5.5, eu: 38.5, cm: 24.0, in: 9.45},
  {us: 6.5, uk: 6.0, eu: 39.0, cm: 24.5, in: 9.65},
  {us: 7.0, uk: 6.5, eu: 40.0, cm: 25.0, in: 9.84},
  {us: 7.5, uk: 7.0, eu: 40.5, cm: 25.5, in: 10.04},
  {us: 8.0, uk: 7.5, eu: 41.0, cm: 26.0, in: 10.24},
  {us: 8.5, uk: 8.0, eu: 42.0, cm: 26.5, in: 10.43},
  {us: 9.0, uk: 8.5, eu: 42.5, cm: 27.0, in: 10.63},
  {us: 9.5, uk: 9.0, eu: 43.0, cm: 27.5, in: 10.83},
  {us: 10.0, uk: 9.5, eu: 44.0, cm: 28.0, in: 11.02},
  {us: 10.5, uk: 10.0, eu: 44.5, cm: 28.5, in: 11.22},
  {us: 11.0, uk: 10.5, eu: 45.0, cm: 29.0, in: 11.42},
  {us: 11.5, uk: 11.0, eu: 45.5, cm: 29.5, in: 11.61},
  {us: 12.0, uk: 11.5, eu: 46.0, cm: 30.0, in: 11.81},
  {us: 13.0, uk: 12.5, eu: 47.5, cm: 31.0, in: 12.20},
];

const SHOE_DATA_WOMENS = [
  {us: 5.0, uk: 3.0, eu: 35.5, cm: 22.0, in: 8.66},
  {us: 5.5, uk: 3.5, eu: 36.0, cm: 22.5, in: 8.86},
  {us: 6.0, uk: 4.0, eu: 36.5, cm: 23.0, in: 9.06},
  {us: 6.5, uk: 4.5, eu: 37.5, cm: 23.5, in: 9.25},
  {us: 7.0, uk: 5.0, eu: 38.0, cm: 24.0, in: 9.45},
  {us: 7.5, uk: 5.5, eu: 38.5, cm: 24.5, in: 9.65},
  {us: 8.0, uk: 6.0, eu: 39.0, cm: 25.0, in: 9.84},
  {us: 8.5, uk: 6.5, eu: 40.0, cm: 25.5, in: 10.04},
  {us: 9.0, uk: 7.0, eu: 40.5, cm: 26.0, in: 10.24},
  {us: 9.5, uk: 7.5, eu: 41.0, cm: 26.5, in: 10.43},
  {us: 10.0, uk: 8.0, eu: 42.0, cm: 27.0, in: 10.63},
  {us: 10.5, uk: 8.5, eu: 42.5, cm: 27.5, in: 10.83},
  {us: 11.0, uk: 9.0, eu: 43.0, cm: 28.0, in: 11.02},
];

function ShoeConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [gender, setGender] = useState<'mens' | 'womens'>('mens');
  const [selectedIdx, setSelectedIdx] = useState<number>(4); // US 8 or 7

  const data = gender === 'mens' ? SHOE_DATA_MENS : SHOE_DATA_WOMENS;
  const current = data[selectedIdx] || data[0];

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setGender('mens');
            setSelectedIdx(4);
          }}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
            gender === 'mens'
              ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          Men's Shoes
        </button>
        <button
          type="button"
          onClick={() => {
            setGender('womens');
            setSelectedIdx(4);
          }}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
            gender === 'womens'
              ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          Women's Shoes
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select US Shoe Size:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {data.map((row, idx) => (
            <button
              key={row.us}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-xl py-2.5 text-center border font-bold text-sm transition-all ${
                selectedIdx === idx
                  ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300'
              }`}
            >
              US {row.us}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Global Equivalent Sizes ({gender === 'mens' ? "Men's" : "Women's"})
          </span>
          <button
            type="button"
            onClick={() =>
              onCopy(
                `Shoe Size: US ${current.us} = UK ${current.uk} = EU ${current.eu} = ${current.cm} cm`,
                'shoes'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
          >
            {copiedKey === 'shoes' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Shoes</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">US / Canada</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.us}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">UK / Australia</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.uk}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Europe (EU)</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.eu}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Japan / Mondopoint</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.cm} cm</div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 font-mono">
          Approximate foot length: <strong>{current.cm} cm</strong> ({current.in} inches)
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Ring Size Converter
// ----------------------------------------------------
const RING_DATA = [
  {us: '4', uk: 'H', eu: '47', jp: '7', diamMm: 14.86, circMm: 46.68},
  {us: '4.5', uk: 'I', eu: '48', jp: '8', diamMm: 15.27, circMm: 47.97},
  {us: '5', uk: 'J ½', eu: '49', jp: '9', diamMm: 15.7, circMm: 49.32},
  {us: '5.5', uk: 'K ½', eu: '50', jp: '10', diamMm: 16.1, circMm: 50.58},
  {us: '6', uk: 'L ½', eu: '51.5', jp: '11', diamMm: 16.51, circMm: 51.87},
  {us: '6.5', uk: 'M ½', eu: '53', jp: '13', diamMm: 16.92, circMm: 53.16},
  {us: '7', uk: 'N ½', eu: '54', jp: '14', diamMm: 17.35, circMm: 54.51},
  {us: '7.5', uk: 'O ½', eu: '55.5', jp: '15', diamMm: 17.75, circMm: 55.76},
  {us: '8', uk: 'P ½', eu: '57', jp: '16', diamMm: 18.19, circMm: 57.15},
  {us: '8.5', uk: 'Q ½', eu: '58', jp: '17', diamMm: 18.53, circMm: 58.21},
  {us: '9', uk: 'R ½', eu: '59.5', jp: '18', diamMm: 18.89, circMm: 59.34},
  {us: '9.5', uk: 'S ½', eu: '61', jp: '19', diamMm: 19.41, circMm: 60.98},
  {us: '10', uk: 'T ½', eu: '62', jp: '20', diamMm: 19.84, circMm: 62.33},
  {us: '10.5', uk: 'U ½', eu: '63.5', jp: '22', diamMm: 20.24, circMm: 63.59},
  {us: '11', uk: 'V ½', eu: '65', jp: '23', diamMm: 20.68, circMm: 64.97},
  {us: '12', uk: 'X ½', eu: '67.5', jp: '25', diamMm: 21.49, circMm: 67.51},
];

function RingConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [selectedIdx, setSelectedIdx] = useState<number>(6); // US 7
  const current = RING_DATA[selectedIdx] || RING_DATA[0];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Standard US Ring Size:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {RING_DATA.map((row, idx) => (
            <button
              key={row.us}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-xl py-2 text-center border font-bold text-xs sm:text-sm transition-all ${
                selectedIdx === idx
                  ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300'
              }`}
            >
              US {row.us}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Equivalent Ring Sizes & Physical Inside Dimensions
          </span>
          <button
            type="button"
            onClick={() =>
              onCopy(
                `Ring Size US ${current.us} = UK ${current.uk} = EU ${current.eu} (Inside Diam: ${current.diamMm} mm)`,
                'ring'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
          >
            {copiedKey === 'ring' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Ring Size</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">US / Canada</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.us}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">UK / Australia</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.uk}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Europe / ISO</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.eu}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Japan / Asia</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.jp}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-wrap justify-around gap-4 text-xs font-mono">
          <div>
            Inside Diameter: <strong className="text-slate-900 dark:text-white">{current.diamMm} mm</strong> ({(current.diamMm / 25.4).toFixed(3)} in)
          </div>
          <div>
            Inside Circumference: <strong className="text-slate-900 dark:text-white">{current.circMm} mm</strong> ({(current.circMm / 25.4).toFixed(3)} in)
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. Hat Size Converter
// ----------------------------------------------------
const HAT_DATA = [
  {us: '6 5/8', uk: '6 1/2', cm: 53, in: '20 7/8', alpha: 'XS'},
  {us: '6 3/4', uk: '6 5/8', cm: 54, in: '21 1/4', alpha: 'S'},
  {us: '6 7/8', uk: '6 3/4', cm: 55, in: '21 5/8', alpha: 'S'},
  {us: '7', uk: '6 7/8', cm: 56, in: '22', alpha: 'M'},
  {us: '7 1/8', uk: '7', cm: 57, in: '22 1/2', alpha: 'M'},
  {us: '7 1/4', uk: '7 1/8', cm: 58, in: '22 3/4', alpha: 'L'},
  {us: '7 3/8', uk: '7 1/4', cm: 59, in: '23 1/8', alpha: 'L'},
  {us: '7 1/2', uk: '7 3/8', cm: 60, in: '23 1/2', alpha: 'XL'},
  {us: '7 5/8', uk: '7 1/2', cm: 61, in: '24', alpha: 'XL'},
  {us: '7 3/4', uk: '7 5/8', cm: 62, in: '24 3/8', alpha: 'XXL'},
  {us: '7 7/8', uk: '7 3/4', cm: 63, in: '24 3/4', alpha: 'XXL'},
  {us: '8', uk: '7 7/8', cm: 64, in: '25 1/8', alpha: '3XL'},
];

function HatConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [selectedIdx, setSelectedIdx] = useState<number>(4); // 7 1/8 (57cm)
  const current = HAT_DATA[selectedIdx] || HAT_DATA[0];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Head Circumference or US Hat Size:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {HAT_DATA.map((row, idx) => (
            <button
              key={row.us}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-xl py-2 px-1 text-center border font-bold text-xs transition-all ${
                selectedIdx === idx
                  ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300'
              }`}
            >
              <div>{row.cm} cm</div>
              <div className={`text-[10px] ${selectedIdx === idx ? 'text-white/80' : 'text-slate-400'}`}>US {row.us}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Equivalent Hat Sizing
          </span>
          <button
            type="button"
            onClick={() =>
              onCopy(
                `Hat Size: US ${current.us} = UK ${current.uk} = ${current.cm} cm (${current.alpha})`,
                'hat'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
          >
            {copiedKey === 'hat' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Hat Size</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">US Hat Size</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.us}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">UK Hat Size</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.uk}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">Circumference (cm)</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.cm} cm</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-400">General Size</span>
            <div className="mt-1 text-2xl font-extrabold text-[#0A8CFF]">{current.alpha}</div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Circumference in inches: <strong className="text-slate-800 dark:text-slate-200 font-mono">{current.in} in</strong>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. Glove Size Calculator
// ----------------------------------------------------
function GloveConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [handCirc, setHandCirc] = useState<string>('8.5');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [gender, setGender] = useState<'mens' | 'womens'>('mens');

  const gloveResult = useMemo(() => {
    const val = parseFloat(handCirc);
    if (isNaN(val) || val <= 0) {
      return {valid: false, error: 'Please enter a positive measurement.'};
    }

    const inches = unit === 'in' ? val : val / 2.54;

    let numSize = Math.round(inches * 2) / 2; // e.g. 7.5, 8.0, 8.5
    let alpha = 'M';

    if (gender === 'mens') {
      if (inches < 7.0) alpha = 'XS';
      else if (inches < 8.0) alpha = 'S';
      else if (inches < 9.0) alpha = 'M';
      else if (inches < 10.0) alpha = 'L';
      else if (inches < 11.0) alpha = 'XL';
      else alpha = 'XXL';
    } else {
      if (inches < 6.0) alpha = 'XS';
      else if (inches < 6.5) alpha = 'S';
      else if (inches < 7.5) alpha = 'M';
      else if (inches < 8.5) alpha = 'L';
      else alpha = 'XL';
    }

    return {
      valid: true,
      error: null,
      inches: inches.toFixed(2),
      cm: (inches * 2.54).toFixed(1),
      numSize: numSize.toFixed(1),
      alpha,
    };
  }, [handCirc, unit, gender]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGender('mens')}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
              gender === 'mens'
                ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
            }`}
          >
            Men's Gloves
          </button>
          <button
            type="button"
            onClick={() => setGender('womens')}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
              gender === 'womens'
                ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
            }`}
          >
            Women's Gloves
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Presets:</span>
          {['7.0', '8.0', '8.5', '9.5'].map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => {
                setUnit('in');
                setHandCirc(pr);
              }}
              className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300"
            >
              {pr} in
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Hand Circumference (Dominant hand around knuckles, excluding thumb)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={handCirc}
              onChange={(e) => setHandCirc(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'in' | 'cm')}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
            </select>
          </div>
        </div>
      </div>

      {gloveResult.valid && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended Glove Size
            </span>
            <button
              type="button"
              onClick={() =>
                onCopy(
                  `Glove Size: Size ${gloveResult.numSize} (${gloveResult.alpha}) for ${gloveResult.inches} in circumference`,
                  'glove'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF]"
            >
              {copiedKey === 'glove' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Size</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Numerical Glove Size</span>
              <div className="mt-1 text-3xl font-extrabold text-[#0A8CFF]">{gloveResult.numSize}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Standard Alpha Size</span>
              <div className="mt-1 text-3xl font-extrabold text-[#0A8CFF]">{gloveResult.alpha}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400">Hand Measurement</span>
              <div className="mt-1 text-base font-bold text-slate-900 dark:text-white font-mono">
                {gloveResult.inches} in / {gloveResult.cm} cm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
