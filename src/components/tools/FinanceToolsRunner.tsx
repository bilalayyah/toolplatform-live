import React, {useState, useMemo} from 'react';
import {Copy, Check, DollarSign, Percent, Calculator, TrendingUp, Landmark, ShieldAlert, ArrowRightLeft, Sparkles, Clock} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {OnlineHourlyCalculator} from './OnlineHourlyCalculator';

interface Props {
  tool: Tool;
}

export function FinanceToolsRunner({tool}: Props) {
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
            {tool.slug === 'online-hourly-calculator' ? <Clock className="h-5 w-5" /> : <Calculator className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic financial calculations · Exact banking & tax formulas · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'online-hourly-calculator' && <OnlineHourlyCalculator />}
        {tool.slug === 'finance-emi-calculator' && <EmiCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-gst-calculator' && <GstCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-income-tax-calculator' && <IncomeTaxCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-salary-calculator' && <SalaryCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-discount-calculator' && <DiscountCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-sip-calculator' && <SipCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-fd-calculator' && <FdCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'finance-advanced-scientific-calculator' && <ScientificCalculator onCopy={copyText} copiedKey={copiedKey} />}
      </div>
    </div>
  );
}

// =========================================================================
// 1. EMI CALCULATOR
// Verification requirement: EMI for $10,000 at 10% annual interest over 12 months ≈ $879.16/month
// =========================================================================
function EmiCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('10');
  const [tenure, setTenure] = useState<string>('12');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('months');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const t = parseFloat(tenure);

  const isValid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r >= 0 && t > 0;

  const result = useMemo(() => {
    if (!isValid) return null;

    const nMonths = tenureType === 'years' ? t * 12 : t;
    if (nMonths <= 0) return null;

    if (r === 0) {
      const emi = p / nMonths;
      return {
        emi: Number(emi.toFixed(2)),
        totalPayment: Number(p.toFixed(2)),
        totalInterest: 0,
        nMonths,
      };
    }

    const monthlyRate = r / (12 * 100);
    // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, nMonths);
    const emi = (p * monthlyRate * factor) / (factor - 1);
    const totalPayment = emi * nMonths;
    const totalInterest = totalPayment - p;

    return {
      emi: Number(emi.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      nMonths,
    };
  }, [p, r, t, tenureType, isValid]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Loan Principal Amount ($ / ₹)
          </label>
          <input
            type="number"
            min="1"
            step="any"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="10"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Loan Tenure
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="any"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="12"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
            />
            <select
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value as 'months' | 'years')}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold"
            >
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Monthly Equated Installment (EMI)
            </span>
            <button
              type="button"
              onClick={() => onCopy(`$${result.emi}/month`, 'emi')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copiedKey === 'emi' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy EMI</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <span className="text-xs text-slate-400">Monthly Payment:</span>
            <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
              ${result.emi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              <span className="text-lg font-sans font-bold text-slate-700 dark:text-slate-300"> / month</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              For {result.nMonths} monthly installments at {rate}% annual interest
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Principal Loan</span>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                ${p.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Total Interest Due</span>
              <div className="mt-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                ${result.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Total Amount Payable</span>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                ${result.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. GST CALCULATOR (INDIA-SPECIFIC CGST / SGST SPLIT)
// =========================================================================
function GstCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [amount, setAmount] = useState<string>('1000');
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [rate, setRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('');

  const numAmount = parseFloat(amount);
  const activeRate = rate === -1 ? parseFloat(customRate) || 0 : rate;

  const result = useMemo(() => {
    if (isNaN(numAmount) || numAmount < 0 || activeRate < 0) return null;

    if (gstType === 'exclusive') {
      const gstAmount = (numAmount * activeRate) / 100;
      const total = numAmount + gstAmount;
      const half = gstAmount / 2;
      return {
        base: numAmount,
        gstAmount,
        total,
        cgst: half,
        sgst: half,
      };
    } else {
      // Inclusive: Base = Total / (1 + Rate / 100)
      const base = numAmount / (1 + activeRate / 100);
      const gstAmount = numAmount - base;
      const half = gstAmount / 2;
      return {
        base,
        gstAmount,
        total: numAmount,
        cgst: half,
        sgst: half,
      };
    }
  }, [numAmount, activeRate, gstType]);

  return (
    <div className="space-y-6">
      {/* Slabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {[5, 12, 18, 28].map((slab) => (
          <button
            key={slab}
            type="button"
            onClick={() => setRate(slab)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
              rate === slab
                ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {slab}% GST Slab
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRate(-1)}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border transition-all ${
            rate === -1
              ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Custom %
        </button>
      </div>

      {rate === -1 && (
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Rate (%)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder="e.g. 7.5"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-sm font-bold"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            GST Inclusion Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGstType('exclusive')}
              className={`rounded-xl py-2.5 text-xs font-bold border ${
                gstType === 'exclusive' ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]' : 'border-slate-200 bg-white dark:bg-slate-900'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              type="button"
              onClick={() => setGstType('inclusive')}
              className={`rounded-xl py-2.5 text-xs font-bold border ${
                gstType === 'inclusive' ? 'border-[#0A8CFF] bg-sky-50 dark:bg-slate-800 text-[#0A8CFF]' : 'border-slate-200 bg-white dark:bg-slate-900'
              }`}
            >
              Extract GST (Inclusive)
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Indian GST Breakdown ({activeRate}%)
            </span>
            <button
              type="button"
              onClick={() => onCopy(`₹${result.total.toFixed(2)} (GST: ₹${result.gstAmount.toFixed(2)})`, 'gst')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copiedKey === 'gst' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Net / Base Price</span>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                ₹{result.base.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">CGST ({activeRate / 2}%)</span>
              <div className="mt-1 font-mono text-xl font-bold text-sky-600 dark:text-sky-400">
                ₹{result.cgst.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">SGST ({activeRate / 2}%)</span>
              <div className="mt-1 font-mono text-xl font-bold text-sky-600 dark:text-sky-400">
                ₹{result.sgst.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Total Invoice Amount</span>
              <div className="mt-1 font-mono text-2xl font-extrabold text-[#0A8CFF]">
                ₹{result.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Honest India-Specific Note */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
        <strong>India-Specific Tax Rule: </strong>
        For intra-state sales within India, GST is split equally into <strong>CGST (Central GST)</strong> and <strong>SGST (State GST)</strong>. For inter-state sales, the entire amount is billed as <strong>IGST (Integrated GST = ₹{result?.gstAmount.toFixed(2) || '0.00'})</strong>.
      </div>
    </div>
  );
}

// =========================================================================
// 3. INCOME TAX CALCULATOR (INDIA NEW VS OLD REGIME)
// =========================================================================
function IncomeTaxCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [income, setIncome] = useState<string>('900000'); // 9 Lakhs
  const [deductions80C, setDeductions80C] = useState<string>('150000');
  const [otherDeductions, setOtherDeductions] = useState<string>('50000');

  const inc = parseFloat(income) || 0;
  const d80c = Math.min(parseFloat(deductions80C) || 0, 150000);
  const dOther = parseFloat(otherDeductions) || 0;

  // New Regime Calculation (FY 2024-25 default)
  const newRegime = useMemo(() => {
    const stdDed = 75000;
    const taxable = Math.max(0, inc - stdDed);

    let tax = 0;
    if (taxable <= 300000) {
      tax = 0;
    } else if (taxable <= 700000) {
      tax = (taxable - 300000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 400000 * 0.05 + (taxable - 700000) * 0.10;
    } else if (taxable <= 1200000) {
      tax = 400000 * 0.05 + 300000 * 0.10 + (taxable - 1000000) * 0.15;
    } else if (taxable <= 1500000) {
      tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxable - 1200000) * 0.20;
    } else {
      tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxable - 1500000) * 0.30;
    }

    // 87A Rebate: if taxable income <= 7,00,000, tax is zero
    if (taxable <= 700000) tax = 0;

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {stdDed, taxable, tax, cess, totalTax};
  }, [inc]);

  // Old Regime Calculation
  const oldRegime = useMemo(() => {
    const stdDed = 50000;
    const totalDeductions = stdDed + d80c + dOther;
    const taxable = Math.max(0, inc - totalDeductions);

    let tax = 0;
    if (taxable <= 250000) {
      tax = 0;
    } else if (taxable <= 500000) {
      tax = (taxable - 250000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 250000 * 0.05 + (taxable - 500000) * 0.20;
    } else {
      tax = 250000 * 0.05 + 500000 * 0.20 + (taxable - 1000000) * 0.30;
    }

    // Sec 87A rebate for old regime (taxable <= 5,00,000)
    if (taxable <= 500000) tax = 0;

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {totalDeductions, taxable, tax, cess, totalTax};
  }, [inc, d80c, dOther]);

  const diff = oldRegime.totalTax - newRegime.totalTax;
  const best = diff > 0 ? 'New Tax Regime' : diff < 0 ? 'Old Tax Regime' : 'Both Regimes Equal';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Gross Annual Income (₹)
          </label>
          <input
            type="number"
            min="0"
            step="10000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            80C Deductions (Max ₹1.5L)
          </label>
          <input
            type="number"
            min="0"
            max="150000"
            value={deductions80C}
            onChange={(e) => setDeductions80C(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Other Deductions (80D/HRA)
          </label>
          <input
            type="number"
            min="0"
            value={otherDeductions}
            onChange={(e) => setOtherDeductions(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`rounded-2xl border p-5 space-y-3 ${
          best === 'New Tax Regime'
            ? 'border-emerald-500 bg-emerald-50/30 dark:bg-slate-800/60'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white">New Tax Regime (115BAC)</h4>
            {best === 'New Tax Regime' && (
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold">
                Saves ₹{Math.abs(diff).toFixed(0)}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">Standard Deduction: ₹75,000 | Zero tax up to ₹7.75 Lakhs</div>
          <div className="font-mono text-2xl font-extrabold text-[#0A8CFF]">
            ₹{newRegime.totalTax.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Taxable: ₹{newRegime.taxable.toLocaleString()} | 4% Cess: ₹{newRegime.cess.toFixed(0)}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 space-y-3 ${
          best === 'Old Tax Regime'
            ? 'border-emerald-500 bg-emerald-50/30 dark:bg-slate-800/60'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white">Old Tax Regime</h4>
            {best === 'Old Tax Regime' && (
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold">
                Saves ₹{Math.abs(diff).toFixed(0)}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">Total Deductions: ₹{oldRegime.totalDeductions.toLocaleString()}</div>
          <div className="font-mono text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            ₹{oldRegime.totalTax.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Taxable: ₹{oldRegime.taxable.toLocaleString()} | 4% Cess: ₹{oldRegime.cess.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50/70 dark:bg-slate-800/40 p-4 text-xs text-sky-950 dark:text-sky-200">
        <strong>Indian Income Tax Notice: </strong>
        Calculations reflect Indian Finance Act tax slabs (including ₹75,000 standard deduction under the New Tax Regime and Section 87A rebate). Consult a Chartered Accountant for final filing.
      </div>
    </div>
  );
}

// =========================================================================
// 4. SALARY CALCULATOR (CTC TO IN-HAND TAKE HOME)
// =========================================================================
function SalaryCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [ctc, setCtc] = useState<string>('1200000'); // 12 LPA

  const annualCtc = parseFloat(ctc) || 0;

  const salary = useMemo(() => {
    if (annualCtc <= 0) return null;

    // Standard Indian corporate breakdown:
    // Basic: 40% of CTC
    const annualBasic = annualCtc * 0.40;
    // HRA: 50% of Basic
    const annualHra = annualBasic * 0.50;
    // Special allowances: remaining balance
    // Deductions:
    // Employee PF: 12% of Basic (capped or uncapped, standard 12% of basic)
    const annualEpf = Math.min(annualBasic * 0.12, 1800 * 12);
    // Professional tax: approx ₹200/month = ₹2,400/yr
    const annualPt = 2400;
    // Estimated tax (TDS) under new regime
    const taxable = Math.max(0, annualCtc - 75000);
    let tax = 0;
    if (taxable > 700000) {
      if (taxable <= 1000000) tax = 400000 * 0.05 + (taxable - 700000) * 0.10;
      else if (taxable <= 1200000) tax = 400000 * 0.05 + 300000 * 0.10 + (taxable - 1000000) * 0.15;
      else tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxable - 1200000) * 0.20;
      tax *= 1.04; // Cess
    }

    const annualInHand = annualCtc - (annualEpf * 2) - annualPt - tax; // employee + employer PF
    const monthlyInHand = annualInHand / 12;

    return {
      monthlyInHand: Number(monthlyInHand.toFixed(0)),
      annualInHand: Number(annualInHand.toFixed(0)),
      monthlyBasic: (annualBasic / 12).toFixed(0),
      monthlyHra: (annualHra / 12).toFixed(0),
      monthlyEpf: (annualEpf / 12).toFixed(0),
      monthlyPt: 200,
      monthlyTds: (tax / 12).toFixed(0),
    };
  }, [annualCtc]);

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Annual CTC (Cost to Company in ₹)
        </label>
        <input
          type="number"
          min="0"
          step="50000"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          placeholder="1200000"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
        />
        <span className="text-[11px] text-slate-500 mt-1 block">e.g. ₹12,00,000 (12 LPA)</span>
      </div>

      {salary && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Monthly In-Hand Salary
            </span>
            <button
              type="button"
              onClick={() => onCopy(`₹${salary.monthlyInHand.toLocaleString()}/month`, 'sal')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copiedKey === 'sal' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <div className="font-mono text-3xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{salary.monthlyInHand.toLocaleString()}
              <span className="text-base font-sans font-bold text-slate-700 dark:text-slate-300"> / month</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Annual In-Hand: ₹{salary.annualInHand.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3">
              <span className="text-slate-400">Monthly Basic</span>
              <div className="font-mono text-base font-bold">₹{salary.monthlyBasic}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3">
              <span className="text-slate-400">Monthly HRA</span>
              <div className="font-mono text-base font-bold">₹{salary.monthlyHra}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3">
              <span className="text-slate-400">Monthly EPF (Deduction)</span>
              <div className="font-mono text-base font-bold text-rose-600">-₹{salary.monthlyEpf}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-3">
              <span className="text-slate-400">Est. Monthly TDS</span>
              <div className="font-mono text-base font-bold text-rose-600">-₹{salary.monthlyTds}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. DISCOUNT CALCULATOR
// =========================================================================
function DiscountCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [originalPrice, setOriginalPrice] = useState<string>('120');
  const [discountPercent, setDiscountPercent] = useState<string>('25');
  const [extraPercent, setExtraPercent] = useState<string>('10');
  const [taxPercent, setTaxPercent] = useState<string>('8');

  const p = parseFloat(originalPrice) || 0;
  const d1 = parseFloat(discountPercent) || 0;
  const d2 = parseFloat(extraPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const result = useMemo(() => {
    if (p <= 0) return null;
    const afterD1 = p * (1 - d1 / 100);
    const afterD2 = afterD1 * (1 - d2 / 100);
    const savings = p - afterD2;
    const taxAmount = (afterD2 * tax) / 100;
    const finalTotal = afterD2 + taxAmount;

    return {
      savings: Number(savings.toFixed(2)),
      afterDiscount: Number(afterD2.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      effectiveDiscount: Number((((p - afterD2) / p) * 100).toFixed(1)),
    };
  }, [p, d1, d2, tax]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Original Price ($ / ₹)
          </label>
          <input
            type="number"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Extra Coupon (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={extraPercent}
            onChange={(e) => setExtraPercent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Sales Tax (%)
          </label>
          <input
            type="number"
            min="0"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <span className="text-xs text-slate-400">Final Price (with Tax):</span>
            <div className="font-mono text-4xl font-extrabold text-[#0A8CFF]">
              ${result.finalTotal.toFixed(2)}
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              You Save: ${result.savings.toFixed(2)} ({result.effectiveDiscount}% total discount)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 6. SIP CALCULATOR (WITH REQUIRED ESTIMATE-ONLY DISCLAIMER)
// =========================================================================
function SipCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [monthlyInvest, setMonthlyInvest] = useState<string>('5000');
  const [returnRate, setReturnRate] = useState<string>('12');
  const [years, setYears] = useState<string>('10');

  const p = parseFloat(monthlyInvest) || 0;
  const r = parseFloat(returnRate) || 0;
  const y = parseFloat(years) || 0;

  const result = useMemo(() => {
    if (p <= 0 || r <= 0 || y <= 0) return null;
    const nMonths = y * 12;
    const i = r / (12 * 100);

    // FV = P * ((1 + i)^n - 1) / i * (1 + i)
    const factor = Math.pow(1 + i, nMonths);
    const maturity = p * ((factor - 1) / i) * (1 + i);
    const invested = p * nMonths;
    const gain = maturity - invested;

    return {
      invested: Number(invested.toFixed(0)),
      gain: Number(gain.toFixed(0)),
      maturity: Number(maturity.toFixed(0)),
      nMonths,
    };
  }, [p, r, y]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Investment ($ / ₹)
          </label>
          <input
            type="number"
            min="100"
            step="500"
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            step="0.5"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Time Period (Years)
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <span className="text-xs text-slate-400">Total Expected Maturity Value:</span>
            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${result.maturity.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Total Invested</span>
              <div className="mt-1 font-mono text-xl font-bold">${result.invested.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 text-center">
              <span className="text-xs text-slate-400">Estimated Wealth Gain</span>
              <div className="mt-1 font-mono text-xl font-bold text-[#0A8CFF]">
                ${result.gain.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prominent ESTIMATE-ONLY Disclaimer (Strict Requirement) */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p>
          <strong>ESTIMATE-ONLY DISCLAIMER: </strong>
          Mutual fund investments are subject to market risks. Historical and expected rates of return are strictly hypothetical estimates for financial illustration purposes and do not guarantee future performance. Read all scheme-related documents carefully before investing.
        </p>
      </div>
    </div>
  );
}

// =========================================================================
// 7. FD CALCULATOR (FIXED DEPOSIT)
// =========================================================================
function FdCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [deposit, setDeposit] = useState<string>('100000');
  const [rate, setRate] = useState<string>('7.1');
  const [years, setYears] = useState<string>('5');
  const [compounding, setCompounding] = useState<number>(4); // Quarterly

  const p = parseFloat(deposit) || 0;
  const r = parseFloat(rate) || 0;
  const y = parseFloat(years) || 0;

  const result = useMemo(() => {
    if (p <= 0 || r <= 0 || y <= 0) return null;
    const n = compounding;
    const rateDec = r / 100;
    // A = P * (1 + r/n)^(n*t)
    const maturity = p * Math.pow(1 + rateDec / n, n * y);
    const interest = maturity - p;

    return {
      maturity: Number(maturity.toFixed(2)),
      interest: Number(interest.toFixed(2)),
    };
  }, [p, r, y, compounding]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Deposit Amount ($ / ₹)
          </label>
          <input
            type="number"
            min="1000"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Interest Rate (%)
          </label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Tenure (Years)
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Compounding
          </label>
          <select
            value={compounding}
            onChange={(e) => setCompounding(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-bold"
          >
            <option value="4">Quarterly (Bank standard)</option>
            <option value="12">Monthly</option>
            <option value="2">Half-Yearly</option>
            <option value="1">Annually</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-5 text-center">
            <span className="text-xs text-slate-400">Total Maturity Value:</span>
            <div className="font-mono text-4xl font-extrabold text-[#0A8CFF]">
              ${result.maturity.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Interest Earned: ${result.interest.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 8. ADVANCED SCIENTIFIC CALCULATOR
// =========================================================================
function ScientificCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [expr, setExpr] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState<number>(0);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const append = (str: string) => {
    if (expr === '0' || expr === 'Error') {
      setExpr(str);
    } else {
      setExpr((prev) => prev + str);
    }
  };

  const clear = () => setExpr('0');
  const backspace = () => setExpr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));

  const calculate = () => {
    try {
      // Safe sanitized math evaluator
      let sanitized = expr
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Functions mapping
      // Handle sin/cos/tan with deg/rad
      const degFactor = angleMode === 'deg' ? `* (${Math.PI} / 180)` : '';

      sanitized = sanitized
        .replace(/sin\(([^)]+)\)/g, `Math.sin(($1) ${degFactor})`)
        .replace(/cos\(([^)]+)\)/g, `Math.cos(($1) ${degFactor})`)
        .replace(/tan\(([^)]+)\)/g, `Math.tan(($1) ${degFactor})`)
        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/\^/g, '**');

      // Evaluator
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        const str = Number(res.toFixed(8)).toString();
        setExpr(str);
        setLastResult(str);
      } else {
        setExpr('Error');
      }
    } catch {
      setExpr('Error');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Display Screen */}
      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-900 p-5 text-right font-mono text-white shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold">{angleMode.toUpperCase()}</span>
          <span>{memory !== 0 ? `M: ${memory}` : ''}</span>
        </div>
        <div className="text-3xl font-extrabold tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
          {expr}
        </div>
      </div>

      {/* Button Controls */}
      <div className="grid grid-cols-5 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
          className="rounded-xl p-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          {angleMode.toUpperCase()}
        </button>
        <button
          type="button"
          onClick={() => setExpr((prev) => (prev === '0' ? 'sin(' : prev + 'sin('))}
          className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800"
        >
          sin
        </button>
        <button
          type="button"
          onClick={() => setExpr((prev) => (prev === '0' ? 'cos(' : prev + 'cos('))}
          className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800"
        >
          cos
        </button>
        <button
          type="button"
          onClick={() => setExpr((prev) => (prev === '0' ? 'tan(' : prev + 'tan('))}
          className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800"
        >
          tan
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-xl p-3 bg-rose-100 dark:bg-rose-950/40 text-rose-600 font-extrabold"
        >
          AC
        </button>

        <button type="button" onClick={() => append('ln(')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">ln</button>
        <button type="button" onClick={() => append('log(')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">log</button>
        <button type="button" onClick={() => append('sqrt(')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">√</button>
        <button type="button" onClick={() => append('^')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">xʸ</button>
        <button type="button" onClick={backspace} className="rounded-xl p-3 bg-slate-200 dark:bg-slate-700">⌫</button>

        <button type="button" onClick={() => append('π')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">π</button>
        <button type="button" onClick={() => append('(')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">(</button>
        <button type="button" onClick={() => append(')')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">)</button>
        <button type="button" onClick={() => append('%')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">%</button>
        <button type="button" onClick={() => append('÷')} className="rounded-xl p-3 bg-sky-100 text-[#0A8CFF]">÷</button>

        <button type="button" onClick={() => append('7')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">7</button>
        <button type="button" onClick={() => append('8')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">8</button>
        <button type="button" onClick={() => append('9')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">9</button>
        <button type="button" onClick={() => append('e')} className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800">e</button>
        <button type="button" onClick={() => append('×')} className="rounded-xl p-3 bg-sky-100 text-[#0A8CFF]">×</button>

        <button type="button" onClick={() => append('4')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">4</button>
        <button type="button" onClick={() => append('5')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">5</button>
        <button type="button" onClick={() => append('6')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">6</button>
        <button type="button" onClick={() => append('+')} className="rounded-xl p-3 bg-sky-100 text-[#0A8CFF]">+</button>
        <button type="button" onClick={() => append('-')} className="rounded-xl p-3 bg-sky-100 text-[#0A8CFF]">-</button>

        <button type="button" onClick={() => append('1')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">1</button>
        <button type="button" onClick={() => append('2')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">2</button>
        <button type="button" onClick={() => append('3')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">3</button>
        <button type="button" onClick={() => append('0')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">0</button>
        <button type="button" onClick={() => append('.')} className="rounded-xl p-3 bg-white dark:bg-slate-800 border text-base">.</button>
      </div>

      <button
        type="button"
        onClick={calculate}
        className="w-full rounded-2xl bg-[#0A8CFF] hover:bg-[#0077E6] py-3.5 text-white font-extrabold text-lg shadow-sm transition-all"
      >
        = Calculate
      </button>
    </div>
  );
}
