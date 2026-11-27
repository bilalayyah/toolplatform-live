import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Filter,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Type,
} from 'lucide-react';
import type { Tool } from '../../data/tools';
import {
  DEFAULT_WORD_RESULT_LIMIT,
  DICTIONARY_METADATA,
  ensureDictionaryLoaded,
  filterWordsByLength,
  findExactAnagrams,
  findPossibleWords,
  isDictionaryLoaded,
  MAX_WORD_GENERATOR_INPUT_LENGTH,
  normalizeLetters,
  sortWords,
  validateWordInput,
  type WordSortMode,
} from '../../lib/wordGenerator';

interface Props {
  tool: Tool;
}

type GeneratorMode =
  | 'generate'
  | 'anagrams'
  | 'short'
  | 'long'
  | 'exact-anagrams'
  | 'pattern';

const MODE_OPTIONS: ReadonlyArray<{ id: GeneratorMode; label: string; hint: string }> = [
  {
    id: 'generate',
    label: 'Generate Words',
    hint: 'All valid English words (2+ letters) formed from your letters.',
  },
  {
    id: 'anagrams',
    label: 'Find Anagrams',
    hint: 'Full anagrams using every supplied letter once (no shorter words).',
  },
  {
    id: 'short',
    label: 'Find Short Words',
    hint: 'Quickly group and browse 2-, 3-, 4-, and 5-letter words.',
  },
  {
    id: 'long',
    label: 'Find Long Words',
    hint: 'Highlights all words tied for maximum length first, plus shorter alternatives.',
  },
  {
    id: 'exact-anagrams',
    label: 'Exact Letter Anagrams',
    hint: 'Strict exact-anagram matching respecting every repeated letter count.',
  },
  {
    id: 'pattern',
    label: 'Word Pattern Finder',
    hint: 'Filter by known positions (e.g. P_A___), starting/ending, and include/exclude rules.',
  },
];

function downloadTxtFile(text: string, fileName: string) {
  const encoded = new TextEncoder().encode(text);
  const blob = new Blob([encoded], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AlphabetsToWordWorkspace({ tool }: Props) {
  const [dictStatus, setDictStatus] = useState<'loading' | 'ready' | 'error'>(
    isDictionaryLoaded() ? 'ready' : 'loading',
  );
  const [dictError, setDictError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(
    isDictionaryLoaded() ? DICTIONARY_METADATA.wordCount : 0,
  );

  const [mode, setMode] = useState<GeneratorMode>('generate');
  const [letterInput, setLetterInput] = useState<string>('LISTEN');
  const [submittedLetters, setSubmittedLetters] = useState<string>('LISTEN');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasCleared, setHasCleared] = useState<boolean>(false);

  // Filters & options
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [minLength, setMinLength] = useState<number>(2);
  const [maxLength, setMaxLength] = useState<number>(MAX_WORD_GENERATOR_INPUT_LENGTH);
  const [shortPreset, setShortPreset] = useState<'all' | 2 | 3 | 4 | 5>('all');
  const [startsWith, setStartsWith] = useState<string>('');
  const [endsWith, setEndsWith] = useState<string>('');
  const [includeLetters, setIncludeLetters] = useState<string>('');
  const [excludeLetters, setExcludeLetters] = useState<string>('');
  const [pattern, setPattern] = useState<string>('');
  const [sortMode, setSortMode] = useState<WordSortMode>('length-desc');
  const [resultLimit, setResultLimit] = useState<number>(DEFAULT_WORD_RESULT_LIMIT);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Lazy-load the dictionary asset only when this tool mounts
  useEffect(() => {
    let active = true;
    setDictStatus(isDictionaryLoaded() ? 'ready' : 'loading');
    ensureDictionaryLoaded()
      .then((count) => {
        if (!active) return;
        setLoadedCount(count);
        setDictStatus('ready');
        setDictError(null);
      })
      .catch((err) => {
        if (!active) return;
        setDictStatus('error');
        setDictError(
          err instanceof Error ? err.message : 'Unable to load English word dictionary.',
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const copyText = useCallback(async (text: string, key: string) => {
    let ok = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }

    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800);
    }
  }, []);

  const runWithMode = useCallback(
    (targetMode?: GeneratorMode) => {
      const check = validateWordInput(letterInput);
      if (!check.valid) {
        setValidationError(check.error);
        setSubmittedLetters('');
        setHasCleared(false);
        return;
      }
      setValidationError(null);
      setHasCleared(false);
      if (targetMode) {
        setMode(targetMode);
      }
      setSubmittedLetters(normalizeLetters(letterInput));
    },
    [letterInput],
  );

  const handleModeSwitch = (nextMode: GeneratorMode) => {
    setMode(nextMode);
    if (nextMode === 'pattern') {
      setFiltersOpen(true);
    }
    if (nextMode === 'long') {
      setSortMode('length-desc');
    }
    if (nextMode === 'short') {
      setShortPreset('all');
      setMinLength(2);
      setMaxLength(5);
    }
  };

  const handleResetFilters = () => {
    setMinLength(2);
    setMaxLength(MAX_WORD_GENERATOR_INPUT_LENGTH);
    setShortPreset('all');
    setStartsWith('');
    setEndsWith('');
    setIncludeLetters('');
    setExcludeLetters('');
    setPattern('');
    setSortMode('length-desc');
    setResultLimit(DEFAULT_WORD_RESULT_LIMIT);
  };

  const handleClearAll = () => {
    setLetterInput('');
    setSubmittedLetters('');
    setValidationError(null);
    setHasCleared(true);
    handleResetFilters();
  };

  const effectiveMinLength = useMemo(() => {
    if (mode === 'short' && shortPreset !== 'all') {
      return shortPreset;
    }
    return Math.max(2, Math.min(minLength, MAX_WORD_GENERATOR_INPUT_LENGTH));
  }, [mode, shortPreset, minLength]);

  const effectiveMaxLength = useMemo(() => {
    if (mode === 'short') {
      if (shortPreset !== 'all') return shortPreset;
      return Math.min(5, Math.max(2, maxLength));
    }
    return Math.max(effectiveMinLength, Math.min(maxLength, MAX_WORD_GENERATOR_INPUT_LENGTH));
  }, [mode, shortPreset, maxLength, effectiveMinLength]);

  const patternError = useMemo(() => {
    const cleaned = pattern.trim().replace(/\s+/g, '');
    if (cleaned && !/^[a-zA-Z_?*]+$/.test(cleaned)) {
      return 'Pattern may only contain A–Z letters and _, ?, or * wildcards.';
    }
    return null;
  }, [pattern]);

  const searchComputation = useMemo(() => {
    if (dictStatus !== 'ready' || !submittedLetters || validationError || hasCleared || patternError) {
      return {
        allMatches: [] as string[],
        displayed: [] as string[],
        maxWordLen: 0,
        tiedLongest: [] as string[],
        shorterAlternatives: [] as string[],
      };
    }

    const filterObj = {
      minLength: effectiveMinLength,
      maxLength: effectiveMaxLength,
      startsWith,
      endsWith,
      includeLetters,
      excludeLetters,
      pattern: mode === 'pattern' || pattern.trim().length > 0 ? pattern : undefined,
    };

    let rawMatches: string[] = [];
    if (mode === 'anagrams' || mode === 'exact-anagrams') {
      rawMatches = findExactAnagrams(submittedLetters, filterObj);
    } else if (mode === 'short') {
      const base = findPossibleWords(submittedLetters, {
        ...filterObj,
        minLength: 2,
        maxLength: 5,
      });
      rawMatches = filterWordsByLength(base, effectiveMinLength, effectiveMaxLength);
    } else {
      rawMatches = findPossibleWords(submittedLetters, filterObj);
    }

    const activeSort: WordSortMode = mode === 'long' ? 'length-desc' : sortMode;
    const sorted = sortWords(rawMatches, activeSort);
    const displayed = sorted.slice(0, resultLimit);

    const maxWordLen = displayed.reduce((acc, w) => Math.max(acc, w.length), 0);
    const tiedLongest =
      mode === 'long' && maxWordLen > 0
        ? displayed.filter((w) => w.length === maxWordLen)
        : [];
    const shorterAlternatives =
      mode === 'long' && maxWordLen > 0
        ? displayed.filter((w) => w.length < maxWordLen)
        : [];

    return {
      allMatches: sorted,
      displayed,
      maxWordLen,
      tiedLongest,
      shorterAlternatives,
    };
  }, [
    dictStatus,
    submittedLetters,
    validationError,
    hasCleared,
    patternError,
    effectiveMinLength,
    effectiveMaxLength,
    startsWith,
    endsWith,
    includeLetters,
    excludeLetters,
    pattern,
    mode,
    sortMode,
    resultLimit,
  ]);

  const groupedShortWords = useMemo(() => {
    if (mode !== 'short') return [];
    const groups = new Map<number, string[]>();
    for (const w of searchComputation.displayed) {
      const arr = groups.get(w.length);
      if (arr) arr.push(w);
      else groups.set(w.length, [w]);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [mode, searchComputation.displayed]);

  const activeModeInfo = MODE_OPTIONS.find((m) => m.id === mode) ?? MODE_OPTIONS[0];
  const isExactAnagramMode = mode === 'anagrams' || mode === 'exact-anagrams';

  const handleDownloadTxt = () => {
    if (searchComputation.displayed.length === 0) return;
    const header = `# ${tool.name} Results\n# Letters: ${submittedLetters}\n# Mode: ${activeModeInfo.label}\n# Total matches: ${searchComputation.allMatches.length} (showing ${searchComputation.displayed.length})\n# Dictionary: ${DICTIONARY_METADATA.name}\n\n`;
    const body = searchComputation.displayed.join('\n') + '\n';
    downloadTxtFile(header + body, `words-${submittedLetters.toLowerCase()}.txt`);
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A8CFF]/10 text-[#0A8CFF]">
            <Type className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white truncate">
              {tool.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter your letters and discover all the words you can make from them.
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {dictStatus === 'ready'
            ? `${loadedCount.toLocaleString()} English words ready · Max ${MAX_WORD_GENERATOR_INPUT_LENGTH} letters`
            : dictStatus === 'loading'
              ? 'Loading English dictionary...'
              : 'Dictionary unavailable'}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 6 Mode Selector Buttons */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Word Finder Mode
          </span>
          <div
            role="tablist"
            aria-label="Word generation modes"
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {MODE_OPTIONS.map((item) => {
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleModeSwitch(item.id)}
                  className={`min-h-[42px] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#0A8CFF] text-white border-[#0A8CFF] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{activeModeInfo.hint}</p>
        </div>

        {/* Main Letter Input & Primary Actions */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runWithMode();
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="alphabets-letter-input" className="sr-only">
                Enter letters (A–Z)
              </label>
              <input
                id="alphabets-letter-input"
                type="text"
                value={letterInput}
                onChange={(e) => {
                  setLetterInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter letters (e.g. LISTEN)"
                autoComplete="off"
                spellCheck={false}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-base sm:text-lg font-mono font-semibold tracking-wider uppercase text-slate-950 dark:text-white placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
              />
            </div>

            <button
              type="submit"
              disabled={dictStatus === 'loading'}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-60 px-6 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Generate Words</span>
            </button>
          </div>

          {/* Secondary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => runWithMode('anagrams')}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
                <span>Find Anagrams</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                aria-expanded={filtersOpen}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
                <span>Filters & Pattern</span>
                {filtersOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {normalizeLetters(letterInput).length} / {MAX_WORD_GENERATOR_INPUT_LENGTH} letters
            </div>
          </div>
        </form>

        {/* Quick Short-Word Length Selector (Mode 3) */}
        {mode === 'short' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 space-y-2.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Short Word Length Filter
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 2, 3, 4, 5] as const).map((preset) => (
                <button
                  key={String(preset)}
                  type="button"
                  onClick={() => setShortPreset(preset)}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                    shortPreset === preset
                      ? 'bg-[#0A8CFF] text-white border-[#0A8CFF]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {preset === 'all' ? 'All Short (2–5)' : `${preset}-Letter Words`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Filters & Pattern Panel */}
        {(filtersOpen || mode === 'pattern') && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Advanced Filters & Pattern Options
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div>
                <label
                  htmlFor="filter-starts-with"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Starts With
                </label>
                <input
                  id="filter-starts-with"
                  type="text"
                  maxLength={5}
                  value={startsWith}
                  onChange={(e) => setStartsWith(e.target.value.toUpperCase())}
                  placeholder="e.g. P"
                  className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-ends-with"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Ends With
                </label>
                <input
                  id="filter-ends-with"
                  type="text"
                  maxLength={5}
                  value={endsWith}
                  onChange={(e) => setEndsWith(e.target.value.toUpperCase())}
                  placeholder="e.g. T"
                  className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-pattern"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Known Positions Pattern
                </label>
                <input
                  id="filter-pattern"
                  type="text"
                  maxLength={MAX_WORD_GENERATOR_INPUT_LENGTH}
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value.toUpperCase())}
                  placeholder="e.g. P_A___"
                  className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-include"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Must Include Letters
                </label>
                <input
                  id="filter-include"
                  type="text"
                  maxLength={10}
                  value={includeLetters}
                  onChange={(e) => setIncludeLetters(e.target.value.toUpperCase())}
                  placeholder="e.g. N, I"
                  className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-exclude"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Must Exclude Letters
                </label>
                <input
                  id="filter-exclude"
                  type="text"
                  maxLength={15}
                  value={excludeLetters}
                  onChange={(e) => setExcludeLetters(e.target.value.toUpperCase())}
                  placeholder="e.g. X, Z"
                  className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="filter-min-len"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Min Length
                  </label>
                  <input
                    id="filter-min-len"
                    type="number"
                    min={2}
                    max={MAX_WORD_GENERATOR_INPUT_LENGTH}
                    value={minLength}
                    onChange={(e) =>
                      setMinLength(
                        Math.max(2, Math.min(MAX_WORD_GENERATOR_INPUT_LENGTH, Number(e.target.value) || 2)),
                      )
                    }
                    className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="filter-max-len"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Max Length
                  </label>
                  <input
                    id="filter-max-len"
                    type="number"
                    min={2}
                    max={MAX_WORD_GENERATOR_INPUT_LENGTH}
                    value={maxLength}
                    onChange={(e) =>
                      setMaxLength(
                        Math.max(2, Math.min(MAX_WORD_GENERATOR_INPUT_LENGTH, Number(e.target.value) || MAX_WORD_GENERATOR_INPUT_LENGTH)),
                      )
                    }
                    className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label
                    htmlFor="filter-sort"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Sort Results
                  </label>
                  <select
                    id="filter-sort"
                    value={mode === 'long' ? 'length-desc' : sortMode}
                    onChange={(e) => setSortMode(e.target.value as WordSortMode)}
                    className="min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="length-desc">Longest Words First</option>
                    <option value="length-asc">Shortest Words First</option>
                    <option value="alphabetical">Alphabetical (A–Z)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="filter-limit"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Result Limit
                  </label>
                  <select
                    id="filter-limit"
                    value={resultLimit}
                    onChange={(e) => setResultLimit(Number(e.target.value))}
                    className="min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 tabular-nums"
                  >
                    <option value={50}>50 results</option>
                    <option value={100}>100 results</option>
                    <option value={200}>200 results (Default)</option>
                    <option value={500}>500 results</option>
                    <option value={1000}>1,000 results</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Pattern syntax: type fixed letters and use <code className="font-mono">_</code> or{' '}
                <code className="font-mono">?</code> for unknown positions (e.g.{' '}
                <code className="font-mono">P_A___</code> matches 6-letter words like{' '}
                <code className="font-mono">PLANET</code>).
              </p>
            </div>
          </div>
        )}

        {/* Errors (Input Validation / Pattern / Dictionary) */}
        {(validationError || patternError || dictError) && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4 flex items-start gap-3 text-sm text-red-800 dark:text-red-200"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div>{validationError ?? patternError ?? dictError}</div>
          </div>
        )}

        {/* Loading State */}
        {dictStatus === 'loading' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-8 text-center text-sm text-slate-600 dark:text-slate-300">
            Loading bundled English dictionary (274,137 words)...
          </div>
        )}

        {/* Results Toolbar & Output */}
        {dictStatus === 'ready' && !validationError && !patternError && submittedLetters && !hasCleared && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-950 dark:text-white tabular-nums">
                  {searchComputation.allMatches.length === 0
                    ? `0 words found for "${submittedLetters}"`
                    : searchComputation.allMatches.length > searchComputation.displayed.length
                      ? `Showing ${searchComputation.displayed.length} of ${searchComputation.allMatches.length} matching words`
                      : `${searchComputation.allMatches.length} ${
                          searchComputation.allMatches.length === 1 ? 'word' : 'words'
                        } found`}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Source letters: {submittedLetters}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isExactAnagramMode ? 'Exact full-length anagrams only' : activeModeInfo.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Sort displayed words"
                  value={mode === 'long' ? 'length-desc' : sortMode}
                  onChange={(e) => setSortMode(e.target.value as WordSortMode)}
                  className="min-h-[38px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="length-desc">Longest first</option>
                  <option value="length-asc">Shortest first</option>
                  <option value="alphabetical">A–Z alphabetical</option>
                </select>

                <button
                  type="button"
                  disabled={searchComputation.displayed.length === 0}
                  onClick={() => copyText(searchComputation.displayed.join('\n'), 'all')}
                  className="min-h-[38px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copiedKey === 'all' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copiedKey === 'all' ? 'Copied All!' : 'Copy All'}</span>
                </button>

                <button
                  type="button"
                  disabled={searchComputation.displayed.length === 0}
                  onClick={handleDownloadTxt}
                  className="min-h-[38px] inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 px-3.5 py-1.5 text-xs font-semibold text-white dark:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {searchComputation.displayed.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/30 p-7 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isExactAnagramMode
                    ? `No exact dictionary anagrams found using all letters of "${submittedLetters}".`
                    : `No dictionary words matched "${submittedLetters}" with your active filters.`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {submittedLetters.length < 2
                    ? 'Dictionary entries start at 2 letters. Enter at least 2 letters (A–Z) to find words.'
                    : isExactAnagramMode
                      ? 'Exact anagram mode requires every letter to be used once with none omitted. Try "Generate Words" to see shorter words formed from a subset of these letters.'
                      : 'Try relaxing your length, start/end letter, pattern, or exclude-letter filters.'}
                </p>
              </div>
            ) : mode === 'long' ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 tabular-nums">
                    Longest Words ({searchComputation.maxWordLen} letters · {searchComputation.tiedLongest.length}{' '}
                    {searchComputation.tiedLongest.length === 1 ? 'word' : 'words'})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {searchComputation.tiedLongest.map((word) => (
                      <WordResultCard
                        key={word}
                        word={word}
                        highlight
                        copied={copiedKey === word}
                        onCopy={() => copyText(word, word)}
                      />
                    ))}
                  </div>
                </div>

                {searchComputation.shorterAlternatives.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 tabular-nums">
                      Shorter Alternatives ({searchComputation.shorterAlternatives.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {searchComputation.shorterAlternatives.map((word) => (
                        <WordResultCard
                          key={word}
                          word={word}
                          copied={copiedKey === word}
                          onCopy={() => copyText(word, word)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : mode === 'short' ? (
              <div className="space-y-5">
                {groupedShortWords.map(([len, words]) => (
                  <div key={len}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 tabular-nums">
                      {len}-Letter Words ({words.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {words.map((word) => (
                        <WordResultCard
                          key={word}
                          word={word}
                          copied={copiedKey === word}
                          onCopy={() => copyText(word, word)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {searchComputation.displayed.map((word) => (
                  <WordResultCard
                    key={word}
                    word={word}
                    copied={copiedKey === word}
                    onCopy={() => copyText(word, word)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {hasCleared && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/30 p-7 text-center text-sm text-slate-600 dark:text-slate-400">
            Results cleared. Enter letters above (for example, <span className="font-mono font-semibold">LISTEN</span>) and click{' '}
            <strong className="text-slate-900 dark:text-white">Generate Words</strong>.
          </div>
        )}

        {/* Dictionary Source & Honest Scope Notice */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <BookOpen className="h-4 w-4 text-[#0A8CFF] shrink-0" aria-hidden="true" />
            <span>Dictionary Source & Honest Limits</span>
          </div>
          <p>
            <strong>Bundled dictionary:</strong> {DICTIONARY_METADATA.name} ({DICTIONARY_METADATA.source}) —{' '}
            {DICTIONARY_METADATA.license}. {DICTIONARY_METADATA.scopeNote}
          </p>
          <p>
            <strong>Honest limits:</strong> Results come exclusively from this client-side dictionary (no AI or server lookups).
            Words outside this list will not appear, and because different word games use distinct official word lists, acceptance in every game is not guaranteed. Input supports up to{' '}
            <span className="font-mono tabular-nums">{MAX_WORD_GENERATOR_INPUT_LENGTH}</span> letters, and displayed results default to a{' '}
            <span className="font-mono tabular-nums">{DEFAULT_WORD_RESULT_LIMIT}</span>-word cap (adjustable up to 1,000 in Filters).
          </p>
        </div>
      </div>
    </section>
  );
}

function WordResultCard({
  word,
  highlight = false,
  copied,
  onCopy,
}: {
  word: string;
  highlight?: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 ${
        highlight
          ? 'border-[#0A8CFF]/40 bg-sky-50/70 dark:bg-sky-950/30'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60'
      }`}
    >
      <div className="min-w-0">
        <div className="font-mono text-sm sm:text-base font-bold tracking-wide text-slate-950 dark:text-white truncate">
          {word}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
          {word.length} letters
        </div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${word}`}
        className="min-h-[34px] inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
