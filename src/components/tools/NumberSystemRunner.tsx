import React, {useState, useMemo} from 'react';
import {Copy, Check, ArrowRightLeft, Cpu, Binary, AlertCircle, Sparkles, RefreshCw} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

export function NumberSystemRunner({tool}: Props) {
  const isBcd = tool.slug === 'number-bcd-converter';

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            {isBcd ? <Binary className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser calculation · Instant formula execution · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8">
        {isBcd ? <BcdConverter /> : <BinaryGrayConverter />}
      </div>
    </div>
  );
}

// ==========================================
// BCD Converter (8421 Binary-Coded Decimal)
// ==========================================
function BcdConverter() {
  const [direction, setDirection] = useState<'dec2bcd' | 'bcd2dec'>('dec2bcd');
  const [inputVal, setInputVal] = useState<string>('259');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const bcdResult = useMemo(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      return {valid: true, empty: true, output: '', groups: [], error: null};
    }

    if (direction === 'dec2bcd') {
      // Validate decimal digits
      if (!/^\d+$/.test(trimmed)) {
        return {
          valid: false,
          empty: false,
          output: '',
          groups: [],
          error: 'Please enter a valid non-negative decimal integer (digits 0-9 only).',
        };
      }

      const digits = trimmed.split('');
      const groups = digits.map((digit) => {
        const num = parseInt(digit, 10);
        const bits = num.toString(2).padStart(4, '0');
        return {
          digit,
          bits,
          b8: bits[0],
          b4: bits[1],
          b2: bits[2],
          b1: bits[3],
        };
      });

      const spaced = groups.map((g) => g.bits).join(' ');
      const compact = groups.map((g) => g.bits).join('');

      return {
        valid: true,
        empty: false,
        output: spaced,
        compact,
        groups,
        error: null,
      };
    } else {
      // BCD to Decimal
      const cleaned = trimmed.replace(/\s+/g, '');
      if (!/^[01]+$/.test(cleaned)) {
        return {
          valid: false,
          empty: false,
          output: '',
          groups: [],
          error: 'Invalid bit sequence: BCD requires binary digits (0 and 1 only).',
        };
      }

      // Pad leading zeros if length is not multiple of 4
      const remainder = cleaned.length % 4;
      const padded = remainder === 0 ? cleaned : cleaned.padStart(cleaned.length + (4 - remainder), '0');
      const wasPadded = remainder !== 0;

      const nibbles: string[] = [];
      for (let i = 0; i < padded.length; i += 4) {
        nibbles.push(padded.slice(i, i + 4));
      }

      const groups = [];
      let decStr = '';
      let invalidNibble: string | null = null;

      for (const nibble of nibbles) {
        const val = parseInt(nibble, 2);
        if (val > 9) {
          invalidNibble = `${nibble} (value ${val})`;
          break;
        }
        decStr += val.toString();
        groups.push({
          digit: val.toString(),
          bits: nibble,
          b8: nibble[0],
          b4: nibble[1],
          b2: nibble[2],
          b1: nibble[3],
        });
      }

      if (invalidNibble) {
        return {
          valid: false,
          empty: false,
          output: '',
          groups: [],
          error: `Invalid 8421 BCD nibble: ${invalidNibble}. Each 4-bit group in 8421 BCD must represent 0–9 (0000 to 1001). Values 10–15 (1010–1111) are invalid.`,
        };
      }

      return {
        valid: true,
        empty: false,
        output: decStr,
        compact: decStr,
        groups,
        wasPadded,
        paddedBits: padded,
        error: null,
      };
    }
  }, [inputVal, direction]);

  return (
    <div className="space-y-6">
      {/* Direction selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              setDirection('dec2bcd');
              setInputVal('259');
            }}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              direction === 'dec2bcd'
                ? 'bg-white dark:bg-slate-700 text-[#0A8CFF] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Decimal → 8421 BCD
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection('bcd2dec');
              setInputVal('0010 0101 1001');
            }}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              direction === 'bcd2dec'
                ? 'bg-white dark:bg-slate-700 text-[#0A8CFF] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            8421 BCD → Decimal
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Samples:</span>
          {direction === 'dec2bcd' ? (
            <>
              {['42', '259', '1024', '9870'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setInputVal(sample)}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-[#0A8CFF]/10 hover:text-[#0A8CFF] transition-colors"
                >
                  {sample}
                </button>
              ))}
            </>
          ) : (
            <>
              {['0100 0010', '0010 0101 1001', '1001 1000 0111 0000'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setInputVal(sample)}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 hover:bg-[#0A8CFF]/10 hover:text-[#0A8CFF] transition-colors"
                >
                  {sample}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Input section */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {direction === 'dec2bcd' ? 'Enter Decimal Number (Integer):' : 'Enter 8421 BCD Bits (Spaces Allowed):'}
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={direction === 'dec2bcd' ? 'e.g., 259' : 'e.g., 0010 0101 1001'}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear input"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {bcdResult.error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
          <p>{bcdResult.error}</p>
        </div>
      )}

      {/* Padding warning if BCD was auto-padded */}
      {direction === 'bcd2dec' && bcdResult.wasPadded && !bcdResult.error && (
        <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3 text-xs text-sky-800 dark:text-sky-200">
          Note: Input was padded with leading zeros to complete 4-bit nibbles: <code>{bcdResult.paddedBits}</code>
        </div>
      )}

      {/* Results Box */}
      {bcdResult.valid && !bcdResult.empty && (
        <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {direction === 'dec2bcd' ? 'Converted 8421 BCD Output' : 'Converted Decimal Output'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(bcdResult.output, 'main')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all shadow-xs"
              >
                {copied === 'main' ? (
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
          </div>

          {/* Primary result display */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#0A8CFF] break-all">
              {bcdResult.output}
            </div>
            {direction === 'dec2bcd' && bcdResult.compact && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Compact (no spaces): <code className="font-mono font-semibold text-slate-700 dark:text-slate-300">{bcdResult.compact}</code></span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bcdResult.compact || '', 'compact')}
                  className="text-xs text-[#0A8CFF] hover:underline"
                >
                  {copied === 'compact' ? 'Copied' : 'Copy Compact'}
                </button>
              </div>
            )}
          </div>

          {/* Nibble Breakdown Visual Cards */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Per-Digit 8421 Nibble Mapping ({bcdResult.groups.length} decimal {bcdResult.groups.length === 1 ? 'digit' : 'digits'}):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {bcdResult.groups.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center"
                >
                  <div className="text-xs text-slate-400 font-medium">Digit {idx + 1}</div>
                  <div className="my-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {group.digit}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0A8CFF] bg-sky-50 dark:bg-sky-950/40 rounded px-1 py-0.5">
                    {group.bits}
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-500 font-mono">
                    8·{group.b8} + 4·{group.b4} + 2·{group.b2} + 1·{group.b1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Educational info card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong className="text-slate-800 dark:text-slate-200">How 8421 BCD Works: </strong>
        Unlike pure binary (where the entire number is converted into powers of two), BCD encodes each decimal digit (0–9) individually into a 4-bit nibble using weights 8, 4, 2, and 1. Values 1010 through 1111 (10 to 15) are invalid in standard 8421 BCD.
      </div>
    </div>
  );
}

// ==========================================
// Binary to Gray Code & Gray to Binary Converter
// ==========================================
function BinaryGrayConverter() {
  const [mode, setMode] = useState<'bin2gray' | 'gray2bin'>('bin2gray');
  const [bits, setBits] = useState<string>('1010');
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapModes = () => {
    if (result.valid && result.output) {
      setBits(result.output);
    }
    setMode(mode === 'bin2gray' ? 'gray2bin' : 'bin2gray');
  };

  const result = useMemo(() => {
    const cleaned = bits.replace(/\s+/g, '');
    if (!cleaned) {
      return {valid: true, empty: true, output: '', steps: [], error: null, dec: null};
    }

    if (!/^[01]+$/.test(cleaned)) {
      return {
        valid: false,
        empty: false,
        output: '',
        steps: [],
        error: 'Invalid input: Please enter binary bits (0 and 1 only).',
        dec: null,
      };
    }

    const n = cleaned.length;
    const steps = [];

    if (mode === 'bin2gray') {
      // Binary to Gray Code:
      // MSB: G[0] = B[0]
      // For i = 1 to n-1: G[i] = B[i-1] XOR B[i]
      let grayStr = cleaned[0];
      steps.push({
        index: 0,
        inputBit: cleaned[0],
        prevBit: '-',
        op: 'MSB is copied directly',
        outBit: cleaned[0],
        explanation: `Most significant bit G[0] = B[0] = ${cleaned[0]}`,
      });

      for (let i = 1; i < n; i++) {
        const bPrev = parseInt(cleaned[i - 1], 10);
        const bCurr = parseInt(cleaned[i], 10);
        const gBit = (bPrev ^ bCurr).toString();
        grayStr += gBit;
        steps.push({
          index: i,
          inputBit: cleaned[i],
          prevBit: cleaned[i - 1],
          op: `${cleaned[i - 1]} ⊕ ${cleaned[i]}`,
          outBit: gBit,
          explanation: `B[${i - 1}] ⊕ B[${i}] = ${bPrev} ⊕ ${bCurr} = ${gBit}`,
        });
      }

      const decVal = parseInt(cleaned, 2);

      return {
        valid: true,
        empty: false,
        output: grayStr,
        steps,
        error: null,
        dec: decVal,
      };
    } else {
      // Gray Code to Binary:
      // MSB: B[0] = G[0]
      // For i = 1 to n-1: B[i] = B[i-1] XOR G[i]
      let binStr = cleaned[0];
      steps.push({
        index: 0,
        inputBit: cleaned[0],
        prevBit: '-',
        op: 'MSB is copied directly',
        outBit: cleaned[0],
        explanation: `Most significant bit B[0] = G[0] = ${cleaned[0]}`,
      });

      for (let i = 1; i < n; i++) {
        const bPrev = parseInt(binStr[i - 1], 10);
        const gCurr = parseInt(cleaned[i], 10);
        const bBit = (bPrev ^ gCurr).toString();
        binStr += bBit;
        steps.push({
          index: i,
          inputBit: cleaned[i],
          prevBit: binStr[i - 1],
          op: `${binStr[i - 1]} ⊕ ${cleaned[i]}`,
          outBit: bBit,
          explanation: `B[${i - 1}] ⊕ G[${i}] = ${bPrev} ⊕ ${gCurr} = ${bBit}`,
        });
      }

      const decVal = parseInt(binStr, 2);

      return {
        valid: true,
        empty: false,
        output: binStr,
        steps,
        error: null,
        dec: decVal,
      };
    }
  }, [bits, mode]);

  return (
    <div className="space-y-6">
      {/* Direction & Swap Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setMode('bin2gray')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                mode === 'bin2gray'
                  ? 'bg-white dark:bg-slate-700 text-[#0A8CFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Binary → Gray Code
            </button>
            <button
              type="button"
              onClick={() => setMode('gray2bin')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                mode === 'gray2bin'
                  ? 'bg-white dark:bg-slate-700 text-[#0A8CFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gray Code → Binary
            </button>
          </div>

          <button
            type="button"
            onClick={swapModes}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all"
            title="Swap direction and use result"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Samples */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Samples:</span>
          {['1010', '11001', '10110', '11110000'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setBits(sample)}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 hover:bg-[#0A8CFF]/10 hover:text-[#0A8CFF] transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {mode === 'bin2gray' ? 'Enter Binary String (e.g., 1010):' : 'Enter Gray Code Bitstring (e.g., 1111):'}
        </label>
        <div className="relative">
          <input
            type="text"
            value={bits}
            onChange={(e) => setBits(e.target.value)}
            placeholder="e.g., 1010"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base sm:text-lg tracking-widest text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
          />
          {bits && (
            <button
              type="button"
              onClick={() => setBits('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear input"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {result.error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
          <p>{result.error}</p>
        </div>
      )}

      {/* Result Display */}
      {result.valid && !result.empty && (
        <div className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {mode === 'bin2gray' ? 'Resulting Reflected Gray Code' : 'Resulting Standard Binary'}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(result.output)}
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
                  <span>Copy Bitstring</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <div className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-[#0A8CFF] break-all">
              {result.output}
            </div>
            {result.dec !== null && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Decimal magnitude of binary value: <strong className="font-mono text-slate-800 dark:text-slate-200">{result.dec}</strong>
              </div>
            )}
          </div>

          {/* Step-by-Step XOR Working Table */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5">
              Step-by-Step XOR Working:
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">Bit Pos</th>
                    <th className="px-3.5 py-2.5 font-semibold">{mode === 'bin2gray' ? 'Binary Bit (B[i])' : 'Gray Bit (G[i])'}</th>
                    <th className="px-3.5 py-2.5 font-semibold">XOR Operation</th>
                    <th className="px-3.5 py-2.5 font-semibold">{mode === 'bin2gray' ? 'Gray Bit (G[i])' : 'Binary Bit (B[i])'}</th>
                    <th className="px-3.5 py-2.5 font-semibold">Logic Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
                  {result.steps.map((st) => (
                    <tr key={st.index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="px-3.5 py-2 text-slate-500 font-medium">[{st.index}]</td>
                      <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-slate-100">{st.inputBit}</td>
                      <td className="px-3.5 py-2 text-sky-600 dark:text-sky-400 font-semibold">{st.op}</td>
                      <td className="px-3.5 py-2 font-bold text-[#0A8CFF]">{st.outBit}</td>
                      <td className="px-3.5 py-2 font-sans text-slate-600 dark:text-slate-400 text-[11px]">{st.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Logic rules reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3.5">
          <strong className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Binary → Gray Code Rule:
          </strong>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
            G[0] = B[0]<br />
            G[i] = B[i-1] ⊕ B[i]
          </p>
          <span className="text-[11px] text-slate-500">Each Gray bit is the XOR of the adjacent binary bits.</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3.5">
          <strong className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Gray Code → Binary Rule:
          </strong>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
            B[0] = G[0]<br />
            B[i] = B[i-1] ⊕ G[i]
          </p>
          <span className="text-[11px] text-slate-500">Each binary bit is the XOR of the previous binary bit and current Gray bit.</span>
        </div>
      </div>
    </div>
  );
}
