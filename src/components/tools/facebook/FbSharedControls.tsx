import React, {useState} from 'react';
import {AlertCircle, AlertTriangle, Check, Copy, RefreshCw, RotateCcw} from 'lucide-react';

export async function copyToClipboardSafe(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to textarea execCommand below
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function downloadTextFile(content: string, filename: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useClipboardState() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copy = async (text: string, id: string) => {
    const ok = await copyToClipboardSafe(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    }
    return ok;
  };
  return {copiedId, copy};
}

export function FbCopyButton({
  text,
  id,
  copiedId,
  onCopy,
  label = 'Copy',
  copiedLabel = 'Copied',
  className = '',
}: {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const isCopied = copiedId === id;
  return (
    <button
      type="button"
      onClick={() => onCopy(text, id)}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
        isCopied
          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
      } ${className}`}
    >
      {isCopied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{isCopied ? copiedLabel : label}</span>
    </button>
  );
}

export function FbErrorAlert({errors}: {errors: string[]}) {
  if (!errors.length) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5"
    >
      <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1">
        {errors.map((err, i) => (
          <p key={i} className="font-medium leading-relaxed">{err}</p>
        ))}
      </div>
    </div>
  );
}

export function FbWarningAlert({warnings}: {warnings: string[]}) {
  if (!warnings.length) return null;
  return (
    <div
      role="status"
      className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
    >
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1">
        {warnings.map((w, i) => (
          <p key={i} className="leading-relaxed">{w}</p>
        ))}
      </div>
    </div>
  );
}

export function FbGeneratorActionBar({
  primaryLabel,
  hasOutput,
  onGenerate,
  onRegenerate,
  onReset,
}: {
  primaryLabel: string;
  hasOutput: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-1">
      <button
        type="button"
        onClick={onGenerate}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
      >
        <span>{primaryLabel}</span>
      </button>
      {hasOutput && (
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0A8CFF] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Regenerate / Generate More</span>
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
