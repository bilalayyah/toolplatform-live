import React, {useState, useMemo} from 'react';
import {Copy, Check, FlaskConical, Atom, Dna, AlertCircle, Sparkles, RefreshCw, Download, Thermometer} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {HeatIndexWorkspace} from './HeatIndexWorkspace';

interface Props {
  tool: Tool;
}

export function ScienceToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            {tool.slug === 'science-chemistry-solutions-calculator' && <FlaskConical className="h-5 w-5" />}
            {tool.slug === 'science-physics-calculator' && <Atom className="h-5 w-5" />}
            {tool.slug === 'science-dna-rna-converter' && <Dna className="h-5 w-5" />}
            {tool.slug === 'heat-index-calculator' && <Thermometer className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic scientific formula calculations · Zero AI · Real browser computation
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'science-chemistry-solutions-calculator' && (
          <ChemistryCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}
        {tool.slug === 'science-physics-calculator' && (
          <PhysicsCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}
        {tool.slug === 'science-dna-rna-converter' && (
          <DnaRnaConverter onCopy={copyText} copiedKey={copiedKey} />
        )}
        {tool.slug === 'heat-index-calculator' && (
          <HeatIndexWorkspace onCopy={copyText} copiedKey={copiedKey} />
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 1. CHEMISTRY SOLUTIONS CALCULATOR
// =========================================================================
type ChemMode = 'molarity' | 'dilution' | 'ph' | 'molality' | 'normality' | 'mole_fraction';

function ChemistryCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [mode, setMode] = useState<ChemMode>('molarity');

  // Molarity inputs (M = mass / (MW * V_L))
  const [molMass, setMolMass] = useState<string>('58.44'); // NaCl
  const [molMw, setMolMw] = useState<string>('58.44'); // g/mol
  const [molVol, setMolVol] = useState<string>('1000'); // mL
  const [molVolUnit, setMolVolUnit] = useState<'ml' | 'l'>('ml');

  // Dilution inputs (M1 * V1 = M2 * V2) - solve whichever is empty
  const [m1, setM1] = useState<string>('1.0');
  const [v1, setV1] = useState<string>('50');
  const [m2, setM2] = useState<string>('0.1');
  const [v2, setV2] = useState<string>(''); // leaving empty to solve

  // pH inputs
  const [phInputType, setPhInputType] = useState<'ph' | 'h' | 'poh' | 'oh'>('ph');
  const [phVal, setPhVal] = useState<string>('7.0');

  // Molality inputs (m = moles / kg solvent)
  const [molalSoluteG, setMolalSoluteG] = useState<string>('10');
  const [molalSoluteMw, setMolalSoluteMw] = useState<string>('58.44');
  const [molalSolventG, setMolalSolventG] = useState<string>('500');

  // Normality inputs (N = M * eq)
  const [normM, setNormM] = useState<string>('0.5');
  const [normEq, setNormEq] = useState<string>('2'); // e.g. H2SO4 has 2 eq

  // Mole fraction inputs (nA / (nA + nB))
  const [mfMolesA, setMfMolesA] = useState<string>('2');
  const [mfMolesB, setMfMolesB] = useState<string>('8');

  // Molarity calc
  const molarityResult = useMemo(() => {
    const mass = parseFloat(molMass);
    const mw = parseFloat(molMw);
    const volRaw = parseFloat(molVol);
    if (isNaN(mass) || isNaN(mw) || isNaN(volRaw) || mass <= 0 || mw <= 0 || volRaw <= 0) {
      return {valid: false, error: 'Please enter positive numbers for mass, molar mass, and volume.'};
    }
    const volL = molVolUnit === 'ml' ? volRaw / 1000 : volRaw;
    const moles = mass / mw;
    const M = moles / volL;
    return {
      valid: true,
      error: null,
      molarity: M,
      moles,
      volL,
    };
  }, [molMass, molMw, molVol, molVolUnit]);

  // Dilution calc
  const dilutionResult = useMemo(() => {
    const pM1 = parseFloat(m1);
    const pV1 = parseFloat(v1);
    const pM2 = parseFloat(m2);
    const pV2 = parseFloat(v2);

    const values = [
      {name: 'M1', val: pM1, str: m1},
      {name: 'V1', val: pV1, str: v1},
      {name: 'M2', val: pM2, str: m2},
      {name: 'V2', val: pV2, str: v2},
    ];

    const empty = values.filter((x) => x.str.trim() === '' || isNaN(x.val));
    if (empty.length !== 1) {
      return {
        valid: false,
        error: 'Please fill in exactly 3 values and leave exactly 1 value blank to solve for it.',
      };
    }

    const missing = empty[0].name;
    let solved = 0;
    let label = '';

    if (missing === 'V2') {
      if (pM2 <= 0) return {valid: false, error: 'M2 must be greater than zero.'};
      solved = (pM1 * pV1) / pM2;
      label = `Final Volume (V2) = ${(pM1 * pV1) / pM2}`;
    } else if (missing === 'M2') {
      if (pV2 <= 0) return {valid: false, error: 'V2 must be greater than zero.'};
      solved = (pM1 * pV1) / pV2;
      label = `Final Concentration (M2) = ${(pM1 * pV1) / pV2}`;
    } else if (missing === 'V1') {
      if (pM1 <= 0) return {valid: false, error: 'M1 must be greater than zero.'};
      solved = (pM2 * pV2) / pM1;
      label = `Stock Volume Needed (V1) = ${(pM2 * pV2) / pM1}`;
    } else if (missing === 'M1') {
      if (pV1 <= 0) return {valid: false, error: 'V1 must be greater than zero.'};
      solved = (pM2 * pV2) / pV1;
      label = `Initial Stock Concentration (M1) = ${(pM2 * pV2) / pV1}`;
    }

    return {
      valid: true,
      error: null,
      missing,
      solved: Number(solved.toFixed(4)),
      label,
    };
  }, [m1, v1, m2, v2]);

  // pH calc
  const phResult = useMemo(() => {
    const val = parseFloat(phVal);
    if (isNaN(val) || val <= 0) {
      return {valid: false, error: 'Please enter a valid positive value.'};
    }

    let pH = 7.0;
    let pOH = 7.0;
    let hConc = 1e-7;
    let ohConc = 1e-7;

    if (phInputType === 'ph') {
      pH = val;
      pOH = 14 - pH;
      hConc = Math.pow(10, -pH);
      ohConc = Math.pow(10, -pOH);
    } else if (phInputType === 'poh') {
      pOH = val;
      pH = 14 - pOH;
      hConc = Math.pow(10, -pH);
      ohConc = Math.pow(10, -pOH);
    } else if (phInputType === 'h') {
      hConc = val;
      pH = -Math.log10(hConc);
      pOH = 14 - pH;
      ohConc = Math.pow(10, -pOH);
    } else if (phInputType === 'oh') {
      ohConc = val;
      pOH = -Math.log10(ohConc);
      pH = 14 - pOH;
      hConc = Math.pow(10, -pH);
    }

    let status = 'Neutral';
    if (pH < 6.99) status = 'Acidic';
    else if (pH > 7.01) status = 'Basic / Alkaline';

    return {
      valid: true,
      error: null,
      pH: Number(pH.toFixed(3)),
      pOH: Number(pOH.toFixed(3)),
      hConc: hConc.toExponential(3),
      ohConc: ohConc.toExponential(3),
      status,
    };
  }, [phInputType, phVal]);

  // Molality calc
  const molalityResult = useMemo(() => {
    const gSolute = parseFloat(molalSoluteG);
    const mw = parseFloat(molalSoluteMw);
    const gSolvent = parseFloat(molalSolventG);
    if (isNaN(gSolute) || isNaN(mw) || isNaN(gSolvent) || gSolute <= 0 || mw <= 0 || gSolvent <= 0) {
      return {valid: false, error: 'Please enter positive numbers.'};
    }
    const moles = gSolute / mw;
    const kgSolvent = gSolvent / 1000;
    const m = moles / kgSolvent;
    return {valid: true, error: null, molality: Number(m.toFixed(4)), moles};
  }, [molalSoluteG, molalSoluteMw, molalSolventG]);

  // Normality calc
  const normalityResult = useMemo(() => {
    const m = parseFloat(normM);
    const eq = parseFloat(normEq);
    if (isNaN(m) || isNaN(eq) || m <= 0 || eq <= 0) {
      return {valid: false, error: 'Please enter positive values for molarity and equivalents.'};
    }
    const N = m * eq;
    return {valid: true, error: null, normality: Number(N.toFixed(4))};
  }, [normM, normEq]);

  // Mole fraction calc
  const moleFractionResult = useMemo(() => {
    const nA = parseFloat(mfMolesA);
    const nB = parseFloat(mfMolesB);
    if (isNaN(nA) || isNaN(nB) || nA < 0 || nB < 0 || nA + nB === 0) {
      return {valid: false, error: 'Please enter valid non-negative mole quantities (total > 0).'};
    }
    const xA = nA / (nA + nB);
    const xB = nB / (nA + nB);
    return {valid: true, error: null, xA: Number(xA.toFixed(4)), xB: Number(xB.toFixed(4))};
  }, [mfMolesA, mfMolesB]);

  return (
    <div className="space-y-6">
      {/* Mode selection tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          {id: 'molarity', label: 'Molarity (M)'},
          {id: 'dilution', label: 'Dilution (M1V1 = M2V2)'},
          {id: 'ph', label: 'pH / pOH / [H+]'},
          {id: 'molality', label: 'Molality (m)'},
          {id: 'normality', label: 'Normality (N)'},
          {id: 'mole_fraction', label: 'Mole Fraction (X)'},
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id as ChemMode)}
            className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold border transition-all ${
              mode === tab.id
                ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF] shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Molarity Mode */}
      {mode === 'molarity' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solute Mass (grams)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={molMass}
                onChange={(e) => setMolMass(e.target.value)}
                placeholder="58.44"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Molar Mass (MW in g/mol)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={molMw}
                onChange={(e) => setMolMw(e.target.value)}
                placeholder="58.44"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solution Volume
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={molVol}
                  onChange={(e) => setMolVol(e.target.value)}
                  placeholder="1000"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
                />
                <select
                  value={molVolUnit}
                  onChange={(e) => setMolVolUnit(e.target.value as 'ml' | 'l')}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-bold"
                >
                  <option value="ml">mL</option>
                  <option value="l">L</option>
                </select>
              </div>
            </div>
          </div>

          {molarityResult.valid && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Calculated Molarity:
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(`${molarityResult.molarity?.toFixed(4)} M`, 'molar')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copiedKey === 'molar' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
                <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
                  {molarityResult.molarity?.toFixed(4)}{' '}
                  <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100">M (mol/L)</span>
                </div>
                <div className="mt-2 text-xs text-slate-500 font-mono">
                  Moles of Solute = {molarityResult.moles?.toFixed(4)} mol in {molarityResult.volL} Liters
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dilution Mode */}
      {mode === 'dilution' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Fill in any 3 values and leave the 4th blank to solve for it ($M_1 V_1 = M_2 V_2$).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Molarity (M1)
              </label>
              <input
                type="number"
                step="any"
                value={m1}
                onChange={(e) => setM1(e.target.value)}
                placeholder="e.g. 1.0"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Volume (V1)
              </label>
              <input
                type="number"
                step="any"
                value={v1}
                onChange={(e) => setV1(e.target.value)}
                placeholder="e.g. 50"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Final Molarity (M2)
              </label>
              <input
                type="number"
                step="any"
                value={m2}
                onChange={(e) => setM2(e.target.value)}
                placeholder="e.g. 0.1"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Final Volume (V2)
              </label>
              <input
                type="number"
                step="any"
                value={v2}
                onChange={(e) => setV2(e.target.value)}
                placeholder="Leave blank to solve"
                className="w-full rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
              />
            </div>
          </div>

          {dilutionResult.error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{dilutionResult.error}</span>
            </div>
          )}

          {dilutionResult.valid && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Solved Dilution Value ({dilutionResult.missing}):
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(`${dilutionResult.label}`, 'dil')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copiedKey === 'dil' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
                <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
                  {dilutionResult.solved}{' '}
                  <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100">
                    {dilutionResult.missing?.startsWith('V') ? 'Volume Units' : 'M (mol/L)'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 font-mono">
                  Formula: M1 × V1 = M2 × V2
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* pH Mode */}
      {mode === 'ph' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Given Value Type
              </label>
              <select
                value={phInputType}
                onChange={(e) => setPhInputType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
              >
                <option value="ph">pH value (0 - 14)</option>
                <option value="poh">pOH value (0 - 14)</option>
                <option value="h">[H+] Ion Concentration (M)</option>
                <option value="oh">[OH-] Ion Concentration (M)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Value
              </label>
              <input
                type="number"
                step="any"
                value={phVal}
                onChange={(e) => setPhVal(e.target.value)}
                placeholder="7.0"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
              />
            </div>
          </div>

          {phResult.valid && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Solution Acid-Base Profile
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  phResult.status === 'Acidic' ? 'bg-rose-100 text-rose-700' :
                  phResult.status === 'Neutral' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {phResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                  <span className="text-xs text-slate-400">pH</span>
                  <div className="mt-1 font-mono text-2xl font-extrabold text-[#0A8CFF]">{phResult.pH}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                  <span className="text-xs text-slate-400">pOH</span>
                  <div className="mt-1 font-mono text-2xl font-extrabold text-[#0A8CFF]">{phResult.pOH}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                  <span className="text-xs text-slate-400">[H+] (mol/L)</span>
                  <div className="mt-1 font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{phResult.hConc}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                  <span className="text-xs text-slate-400">[OH-] (mol/L)</span>
                  <div className="mt-1 font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{phResult.ohConc}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Molality Mode */}
      {mode === 'molality' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solute Mass (grams)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={molalSoluteG}
                onChange={(e) => setMolalSoluteG(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solute Molar Mass (g/mol)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={molalSoluteMw}
                onChange={(e) => setMolalSoluteMw(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solvent Mass (grams)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={molalSolventG}
                onChange={(e) => setMolalSolventG(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
          </div>
          {molalityResult.valid && (
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
              <span className="text-xs text-slate-400">Molality:</span>
              <div className="font-mono text-3xl font-extrabold text-[#0A8CFF]">
                {molalityResult.molality} <span className="text-base font-sans font-bold">m (mol/kg)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Normality Mode */}
      {mode === 'normality' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Molarity (M in mol/L)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={normM}
                onChange={(e) => setNormM(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Equivalence Factor (n / valence)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={normEq}
                onChange={(e) => setNormEq(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
          </div>
          {normalityResult.valid && (
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
              <span className="text-xs text-slate-400">Normality (N = M × eq):</span>
              <div className="font-mono text-3xl font-extrabold text-[#0A8CFF]">
                {normalityResult.normality} <span className="text-base font-sans font-bold">N (eq/L)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mole Fraction Mode */}
      {mode === 'mole_fraction' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Moles of Substance A (nA)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={mfMolesA}
                onChange={(e) => setMfMolesA(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Moles of Substance B (nB)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={mfMolesB}
                onChange={(e) => setMfMolesB(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono font-bold"
              />
            </div>
          </div>
          {moleFractionResult.valid && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                <span className="text-xs text-slate-400">Mole Fraction XA:</span>
                <div className="font-mono text-2xl font-bold text-[#0A8CFF]">{moleFractionResult.xA}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
                <span className="text-xs text-slate-400">Mole Fraction XB:</span>
                <div className="font-mono text-2xl font-bold text-[#0A8CFF]">{moleFractionResult.xB}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. PHYSICS CALCULATOR (SOLVES FOR WHICHEVER VALUE IS LEFT EMPTY)
// =========================================================================
type PhysicsFormula =
  | 'f_ma'
  | 'ke'
  | 'pe'
  | 'work'
  | 'power'
  | 'pressure'
  | 'speed'
  | 'wave'
  | 'ohms';

interface FormulaDef {
  id: PhysicsFormula;
  name: string;
  formula: string;
  vars: {key: string; label: string; unit: string; defaultVal: string}[];
  solve: (vals: Record<string, number>, emptyKey: string) => {val: number; step: string};
}

const G_CONST = 9.80665; // m/s²

const PHYSICS_FORMULAS: FormulaDef[] = [
  {
    id: 'f_ma',
    name: 'Force (Newton’s 2nd Law)',
    formula: 'F = m · a',
    vars: [
      {key: 'F', label: 'Force (F)', unit: 'N', defaultVal: ''},
      {key: 'm', label: 'Mass (m)', unit: 'kg', defaultVal: '10'},
      {key: 'a', label: 'Acceleration (a)', unit: 'm/s²', defaultVal: '9.8'},
    ],
    solve: (v, empty) => {
      if (empty === 'F') return {val: v.m * v.a, step: `F = ${v.m} kg × ${v.a} m/s²`};
      if (empty === 'm') return {val: v.F / v.a, step: `m = ${v.F} N ÷ ${v.a} m/s²`};
      return {val: v.F / v.m, step: `a = ${v.F} N ÷ ${v.m} kg`};
    },
  },
  {
    id: 'ke',
    name: 'Kinetic Energy',
    formula: 'KE = ½ · m · v²',
    vars: [
      {key: 'KE', label: 'Kinetic Energy (KE)', unit: 'J', defaultVal: ''},
      {key: 'm', label: 'Mass (m)', unit: 'kg', defaultVal: '2'},
      {key: 'v', label: 'Velocity (v)', unit: 'm/s', defaultVal: '15'},
    ],
    solve: (v, empty) => {
      if (empty === 'KE') return {val: 0.5 * v.m * v.v * v.v, step: `KE = 0.5 × ${v.m} × (${v.v})²`};
      if (empty === 'm') return {val: (2 * v.KE) / (v.v * v.v), step: `m = 2 × ${v.KE} ÷ (${v.v})²`};
      return {val: Math.sqrt((2 * v.KE) / v.m), step: `v = √((2 × ${v.KE}) ÷ ${v.m})`};
    },
  },
  {
    id: 'pe',
    name: 'Potential Energy',
    formula: 'PE = m · g · h (g = 9.81 m/s²)',
    vars: [
      {key: 'PE', label: 'Potential Energy (PE)', unit: 'J', defaultVal: ''},
      {key: 'm', label: 'Mass (m)', unit: 'kg', defaultVal: '5'},
      {key: 'h', label: 'Height (h)', unit: 'm', defaultVal: '10'},
    ],
    solve: (v, empty) => {
      if (empty === 'PE') return {val: v.m * G_CONST * v.h, step: `PE = ${v.m} kg × 9.81 m/s² × ${v.h} m`};
      if (empty === 'm') return {val: v.PE / (G_CONST * v.h), step: `m = ${v.PE} J ÷ (9.81 × ${v.h})`};
      return {val: v.PE / (v.m * G_CONST), step: `h = ${v.PE} J ÷ (${v.m} × 9.81)`};
    },
  },
  {
    id: 'work',
    name: 'Work Done',
    formula: 'W = F · d',
    vars: [
      {key: 'W', label: 'Work (W)', unit: 'J', defaultVal: ''},
      {key: 'F', label: 'Force (F)', unit: 'N', defaultVal: '50'},
      {key: 'd', label: 'Displacement (d)', unit: 'm', defaultVal: '4'},
    ],
    solve: (v, empty) => {
      if (empty === 'W') return {val: v.F * v.d, step: `W = ${v.F} N × ${v.d} m`};
      if (empty === 'F') return {val: v.W / v.d, step: `F = ${v.W} J ÷ ${v.d} m`};
      return {val: v.W / v.F, step: `d = ${v.W} J ÷ ${v.F} N`};
    },
  },
  {
    id: 'power',
    name: 'Power',
    formula: 'P = W / t',
    vars: [
      {key: 'P', label: 'Power (P)', unit: 'W', defaultVal: ''},
      {key: 'W', label: 'Work / Energy (W)', unit: 'J', defaultVal: '1000'},
      {key: 't', label: 'Time (t)', unit: 's', defaultVal: '5'},
    ],
    solve: (v, empty) => {
      if (empty === 'P') return {val: v.W / v.t, step: `P = ${v.W} J ÷ ${v.t} s`};
      if (empty === 'W') return {val: v.P * v.t, step: `W = ${v.P} W × ${v.t} s`};
      return {val: v.W / v.P, step: `t = ${v.W} J ÷ ${v.P} W`};
    },
  },
  {
    id: 'pressure',
    name: 'Pressure',
    formula: 'P = F / A',
    vars: [
      {key: 'P', label: 'Pressure (P)', unit: 'Pa', defaultVal: ''},
      {key: 'F', label: 'Force (F)', unit: 'N', defaultVal: '500'},
      {key: 'A', label: 'Area (A)', unit: 'm²', defaultVal: '0.05'},
    ],
    solve: (v, empty) => {
      if (empty === 'P') return {val: v.F / v.A, step: `P = ${v.F} N ÷ ${v.A} m²`};
      if (empty === 'F') return {val: v.P * v.A, step: `F = ${v.P} Pa × ${v.A} m²`};
      return {val: v.F / v.P, step: `A = ${v.F} N ÷ ${v.P} Pa`};
    },
  },
  {
    id: 'speed',
    name: 'Speed / Velocity',
    formula: 'v = d / t',
    vars: [
      {key: 'v', label: 'Speed (v)', unit: 'm/s', defaultVal: ''},
      {key: 'd', label: 'Distance (d)', unit: 'm', defaultVal: '100'},
      {key: 't', label: 'Time (t)', unit: 's', defaultVal: '9.58'},
    ],
    solve: (v, empty) => {
      if (empty === 'v') return {val: v.d / v.t, step: `v = ${v.d} m ÷ ${v.t} s`};
      if (empty === 'd') return {val: v.v * v.t, step: `d = ${v.v} m/s × ${v.t} s`};
      return {val: v.d / v.v, step: `t = ${v.d} m ÷ ${v.v} m/s`};
    },
  },
  {
    id: 'wave',
    name: 'Wave Speed',
    formula: 'v = f · λ',
    vars: [
      {key: 'v', label: 'Wave Speed (v)', unit: 'm/s', defaultVal: ''},
      {key: 'f', label: 'Frequency (f)', unit: 'Hz', defaultVal: '440'},
      {key: 'lambda', label: 'Wavelength (λ)', unit: 'm', defaultVal: '0.772'},
    ],
    solve: (v, empty) => {
      if (empty === 'v') return {val: v.f * v.lambda, step: `v = ${v.f} Hz × ${v.lambda} m`};
      if (empty === 'f') return {val: v.v / v.lambda, step: `f = ${v.v} m/s ÷ ${v.lambda} m`};
      return {val: v.v / v.f, step: `λ = ${v.v} m/s ÷ ${v.f} Hz`};
    },
  },
  {
    id: 'ohms',
    name: 'Ohm’s Law',
    formula: 'V = I · R',
    vars: [
      {key: 'V', label: 'Voltage (V)', unit: 'V', defaultVal: ''},
      {key: 'I', label: 'Current (I)', unit: 'A', defaultVal: '2.5'},
      {key: 'R', label: 'Resistance (R)', unit: 'Ω', defaultVal: '4.8'},
    ],
    solve: (v, empty) => {
      if (empty === 'V') return {val: v.I * v.R, step: `V = ${v.I} A × ${v.R} Ω`};
      if (empty === 'I') return {val: v.V / v.R, step: `I = ${v.V} V ÷ ${v.R} Ω`};
      return {val: v.V / v.I, step: `R = ${v.V} V ÷ ${v.I} A`};
    },
  },
];

function PhysicsCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [selectedFormulaId, setSelectedFormulaId] = useState<PhysicsFormula>('f_ma');
  const formulaDef = useMemo(
    () => PHYSICS_FORMULAS.find((f) => f.id === selectedFormulaId) || PHYSICS_FORMULAS[0],
    [selectedFormulaId]
  );

  // Initialize input state for current formula's variables
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    formulaDef.vars.forEach((v) => {
      init[v.key] = v.defaultVal;
    });
    return init;
  });

  const handleFormulaChange = (id: PhysicsFormula) => {
    setSelectedFormulaId(id);
    const target = PHYSICS_FORMULAS.find((f) => f.id === id) || PHYSICS_FORMULAS[0];
    const init: Record<string, string> = {};
    target.vars.forEach((v) => {
      init[v.key] = v.defaultVal;
    });
    setInputs(init);
  };

  const handleInputChange = (key: string, val: string) => {
    setInputs((prev) => ({...prev, [key]: val}));
  };

  // Solve for whichever is empty
  const calculation = useMemo(() => {
    const emptyKeys = formulaDef.vars.filter(
      (v) => !inputs[v.key] || inputs[v.key].trim() === '' || isNaN(parseFloat(inputs[v.key]))
    );

    if (emptyKeys.length !== 1) {
      return {
        valid: false,
        error: `Please enter values for any ${formulaDef.vars.length - 1} variables and leave exactly 1 variable empty to solve for it.`,
      };
    }

    const empty = emptyKeys[0];
    const numericVals: Record<string, number> = {};
    for (const v of formulaDef.vars) {
      if (v.key !== empty.key) {
        const parsed = parseFloat(inputs[v.key]);
        if (isNaN(parsed)) return {valid: false, error: 'Please enter valid numbers.'};
        numericVals[v.key] = parsed;
      }
    }

    try {
      const {val, step} = formulaDef.solve(numericVals, empty.key);
      if (isNaN(val) || !isFinite(val)) {
        return {valid: false, error: 'Mathematical error (division by zero or invalid root).'};
      }
      return {
        valid: true,
        error: null,
        solvedKey: empty.key,
        solvedLabel: empty.label,
        solvedUnit: empty.unit,
        value: Number(val.toFixed(4)),
        step,
      };
    } catch {
      return {valid: false, error: 'Computation error.'};
    }
  }, [formulaDef, inputs]);

  return (
    <div className="space-y-6">
      {/* Formula selector pills */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Physics Law / Relationship:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PHYSICS_FORMULAS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFormulaChange(f.id)}
              className={`rounded-xl p-3 text-left border transition-all ${
                selectedFormulaId === f.id
                  ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold truncate">{f.name}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">{f.formula}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enter Knowns (Leave 1 Variable Blank to Solve)
          </span>
          <span className="text-xs font-mono text-[#0A8CFF] font-semibold">{formulaDef.formula}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {formulaDef.vars.map((v) => {
            const isBlank = !inputs[v.key] || inputs[v.key].trim() === '';
            return (
              <div key={v.key}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {v.label} ({v.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputs[v.key] || ''}
                  onChange={(e) => handleInputChange(v.key, e.target.value)}
                  placeholder={isBlank ? 'Leave blank to solve' : ''}
                  className={`w-full rounded-xl border px-3.5 py-2.5 font-mono text-base font-bold transition-all ${
                    isBlank
                      ? 'border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-slate-800'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {calculation.error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{calculation.error}</span>
        </div>
      )}

      {calculation.valid && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solved: {calculation.solvedLabel}
            </span>
            <button
              type="button"
              onClick={() => onCopy(`${calculation.value} ${calculation.solvedUnit}`, 'phys')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copiedKey === 'phys' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy Result</span>
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
              {calculation.value}{' '}
              <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100">
                {calculation.solvedUnit}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-mono">
              Working Step: {calculation.step}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 3. DNA / RNA CONVERTER
// =========================================================================
function DnaRnaConverter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [seq, setSeq] = useState<string>('ATGCGATCGATCGATCGATCGATCGATC');
  const [copied, setCopied] = useState<boolean>(false);

  // Clean sequence (uppercase, remove whitespace)
  const cleanedSeq = useMemo(() => seq.toUpperCase().replace(/\s+/g, ''), [seq]);

  const validation = useMemo(() => {
    if (!cleanedSeq) return {valid: true, empty: true, invalidChars: []};
    const invalid = cleanedSeq.split('').filter((c) => !'ATCGU'.includes(c));
    return {
      valid: invalid.length === 0,
      empty: false,
      invalidChars: [...new Set(invalid)],
    };
  }, [cleanedSeq]);

  // Conversions
  const conversions = useMemo(() => {
    if (!validation.valid || validation.empty) return null;

    // 1. Transcribe DNA -> RNA (T -> U)
    const rna = cleanedSeq.replace(/T/g, 'U');

    // 2. Reverse Transcribe RNA -> DNA (U -> T)
    const dna = cleanedSeq.replace(/U/g, 'T');

    // 3. Complement (DNA: A<->T, C<->G; RNA: A->U, U->A)
    const compMap: Record<string, string> = {A: 'T', T: 'A', U: 'A', C: 'G', G: 'C'};
    const complement = cleanedSeq
      .split('')
      .map((c) => compMap[c] || c)
      .join('');

    // 4. Reverse Complement
    const revComplement = complement.split('').reverse().join('');

    // 5. Reverse sequence
    const reverse = cleanedSeq.split('').reverse().join('');

    // Stats
    const total = cleanedSeq.length;
    const aCount = (cleanedSeq.match(/A/g) || []).length;
    const tCount = (cleanedSeq.match(/T/g) || []).length;
    const uCount = (cleanedSeq.match(/U/g) || []).length;
    const cCount = (cleanedSeq.match(/C/g) || []).length;
    const gCount = (cleanedSeq.match(/G/g) || []).length;

    const gcContent = total > 0 ? (((gCount + cCount) / total) * 100).toFixed(1) : '0';
    const atContent = total > 0 ? (((aCount + tCount + uCount) / total) * 100).toFixed(1) : '0';

    return {
      rna,
      dna,
      complement,
      revComplement,
      reverse,
      total,
      aCount,
      tCount,
      uCount,
      cCount,
      gCount,
      gcContent,
      atContent,
    };
  }, [cleanedSeq, validation]);

  const downloadFasta = () => {
    if (!conversions) return;
    const text = `>original_sequence length=${conversions.total}\n${cleanedSeq}\n>transcribed_rna\n${conversions.rna}\n>reverse_complement\n${conversions.revComplement}\n`;
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sequence.fasta';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Sample presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Sample sequences:</span>
          <button
            type="button"
            onClick={() => setSeq('ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGAC')}
            className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300"
          >
            GFP Start
          </button>
          <button
            type="button"
            onClick={() => setSeq('TATAAAAGGGGCGCGCCCTATAAATAG')}
            className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300"
          >
            TATA Box
          </button>
        </div>

        {conversions && (
          <button
            type="button"
            onClick={downloadFasta}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download FASTA</span>
          </button>
        )}
      </div>

      {/* Sequence Textarea */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter DNA or RNA Nucleotide Sequence (A, T, C, G, U):
        </label>
        <textarea
          rows={4}
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          placeholder="e.g. ATGCGATCGATC..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-sm tracking-wider uppercase text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none"
        />
      </div>

      {/* Invalid Character Alert */}
      {!validation.valid && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>
            Invalid nucleotide characters detected: <strong>{validation.invalidChars.join(', ')}</strong>. Please use only A, T, C, G, and U.
          </span>
        </div>
      )}

      {/* Results & Stats */}
      {conversions && (
        <div className="space-y-4">
          {/* Quick nucleotide composition stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-[11px] text-slate-400">Length</span>
              <div className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                {conversions.total} <span className="text-xs font-sans text-slate-500">bp/nt</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-[11px] text-slate-400">GC Content</span>
              <div className="font-mono text-xl font-extrabold text-[#0A8CFF]">
                {conversions.gcContent}%
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-[11px] text-slate-400">AT / AU Content</span>
              <div className="font-mono text-xl font-extrabold text-amber-500">
                {conversions.atContent}%
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3 text-center font-mono text-xs">
              <span className="text-[11px] font-sans text-slate-400 block mb-0.5">Base Counts</span>
              A:{conversions.aCount} | C:{conversions.cCount} | G:{conversions.gCount} | T:{conversions.tCount}
            </div>
          </div>

          {/* Transformed sequences */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Transcribed RNA (T → U):
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(conversions.rna, 'rna')}
                  className="text-xs text-[#0A8CFF] hover:underline"
                >
                  {copiedKey === 'rna' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all">
                {conversions.rna}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reverse Complement (5' → 3'):
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(conversions.revComplement, 'revcomp')}
                  className="text-xs text-[#0A8CFF] hover:underline"
                >
                  {copiedKey === 'revcomp' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all">
                {conversions.revComplement}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Direct Complement:
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(conversions.complement, 'comp')}
                  className="text-xs text-[#0A8CFF] hover:underline"
                >
                  {copiedKey === 'comp' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all">
                {conversions.complement}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
