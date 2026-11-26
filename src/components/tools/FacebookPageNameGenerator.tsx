import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Info,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import {SITE_CONFIG, buildCanonicalUrl} from '../../config/site';
import {
  CATEGORIES,
  NAMING_STYLES,
  PAGE_NAME_TIPS,
  TONE_OPTIONS,
  type CategoryName,
  type NamingStyle,
  type Tone,
} from '../../lib/facebookPageNameData';
import {generate, type NameResult} from '../../lib/facebookPageNameEngine';

const FAVS_STORAGE_KEY = 'tp_fb_page_name_favs';
const DEBOUNCE_MS = 150;

function readFavouritesFromStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

function writeFavouritesToStorage(items: string[]): void {
  try {
    window.localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors (e.g. private mode or blocked storage); state remains in memory
  }
}

function downloadPlainTextFile(text: string, filename: string): void {
  const encoded = new TextEncoder().encode(text);
  const copyBuf = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  copyBuf.set(encoded);
  const blob = new Blob([copyBuf], {type: 'text/plain;charset=utf-8'});
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

async function copyStringToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback
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

export function FacebookPageNameGenerator() {
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const resultsRegionRef = useRef<HTMLDivElement>(null);
  const lastActionTimestampRef = useRef<number>(0);
  const toastTimerRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  // Form inputs (1-4 always visible, 5-8 inside More options)
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<CategoryName>('General');
  const [tone, setTone] = useState<Tone>('neutral');
  const [style, setStyle] = useState<NamingStyle>('mixAll');

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [maxWords, setMaxWords] = useState<2 | 3 | 4>(4);
  const [location, setLocation] = useState('');
  const [avoid, setAvoid] = useState('');
  const [count, setCount] = useState<12 | 24 | 36>(12);

  // Generation state
  const [results, setResults] = useState<NameResult[]>([]);
  const [batch, setBatch] = useState<number>(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Saved favourites + feedback UI state
  const [favourites, setFavourites] = useState<string[]>(() => readFavouritesFromStorage());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');

  // Inject SoftwareApplication JSON-LD for this tool without altering shared layout components
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['SoftwareApplication', 'WebApplication'],
      name: 'Facebook Page Name Generator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Runs locally in browser.',
      url: buildCanonicalUrl('/facebook-page-name-generator'),
      description:
        'Create catchy brand-style Facebook Page names from your keyword. Pick a category and tone, copy names instantly. Free, no sign-up, no AI.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.siteName,
        url: buildCanonicalUrl('/'),
      },
    };

    const existing = document.head.querySelectorAll(
      'script[data-fb-page-name-schema="true"]',
    );
    existing.forEach((n) => n.remove());

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-fb-page-name-schema', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const cleanup = document.head.querySelectorAll(
        'script[data-fb-page-name-schema="true"]',
      );
      cleanup.forEach((n) => n.remove());
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const triggerCopiedFeedback = useCallback((key: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    setCopiedKey(key);
    setToastVisible(true);
    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  }, []);

  const handleCopy = useCallback(
    async (text: string, key: string) => {
      const ok = await copyStringToClipboard(text);
      if (ok) {
        triggerCopiedFeedback(key);
      }
    },
    [triggerCopiedFeedback],
  );

  const toggleFavourite = useCallback((name: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((item) => item !== name) : [name, ...prev];
      writeFavouritesToStorage(next);
      return next;
    });
  }, []);

  const runGeneration = useCallback(
    (nextBatch: number, appendMode: boolean) => {
      const now = Date.now();
      if (now - lastActionTimestampRef.current < DEBOUNCE_MS) {
        return;
      }
      lastActionTimestampRef.current = now;

      const excludeSet = appendMode ? new Set(results.map((r) => r.name)) : undefined;

      const output = generate({
        keyword,
        category,
        tone,
        style,
        maxWords,
        location,
        avoid,
        count,
        batch: nextBatch,
        maxChars: 40,
        exclude: excludeSet,
      });

      if (output.errors.length > 0) {
        setKeywordError(output.errors[0]);
        setWarnings(output.warnings);
        if (!appendMode) {
          setResults([]);
          setHasGenerated(false);
          setPoolExhausted(false);
        }
        setLiveStatus(output.errors[0]);
        keywordInputRef.current?.focus();
        return;
      }

      setKeywordError(null);
      setWarnings(output.warnings);
      setPoolExhausted(output.poolExhausted);
      setBatch(nextBatch);
      setHasGenerated(true);

      const updatedResults = appendMode ? [...results, ...output.names] : output.names;
      setResults(updatedResults);
      setLiveStatus(
        `${output.names.length} ${output.names.length === 1 ? 'name' : 'names'} generated`,
      );

      if (!appendMode) {
        requestAnimationFrame(() => {
          resultsRegionRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        });
      }
    },
    [avoid, category, count, keyword, location, maxWords, results, style, tone],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runGeneration(0, false);
  };

  const handleGenerateMore = () => {
    runGeneration(batch + 1, true);
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('General');
    setTone('neutral');
    setStyle('mixAll');
    setMaxWords(4);
    setLocation('');
    setAvoid('');
    setCount(12);
    setResults([]);
    setBatch(0);
    setWarnings([]);
    setKeywordError(null);
    setPoolExhausted(false);
    setHasGenerated(false);
    setLiveStatus('Form and results reset');
    keywordInputRef.current?.focus();
  };

  const bestMatchSet = useMemo(() => {
    const picked = new Set<string>();
    for (const item of results) {
      if (item.score >= 80) {
        picked.add(item.name);
        if (picked.size >= 3) break;
      }
    }
    return picked;
  }, [results]);

  const needsLocationHelper = style === 'brandPlace' && !location.trim();

  return (
    <div className="space-y-6">
      {/* Existing non-AI notice */}
      <div
        role="note"
        className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/90 dark:bg-amber-950/35 px-4 py-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100 flex items-start gap-2.5"
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <span>
          <strong>Template/formula-based only — NOT AI-generated.</strong> Combines your keyword with fixed word lists inside your browser. Keywords you type never leave your device.
        </span>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 sm:p-6 space-y-5"
      >
        {/* 1. Keyword + 2. Category */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label
              htmlFor="fb-page-keyword"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
            >
              Keyword <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <input
              ref={keywordInputRef}
              id="fb-page-keyword"
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                if (keywordError) setKeywordError(null);
              }}
              placeholder="e.g. Yalla Ludo"
              aria-required="true"
              aria-invalid={keywordError ? 'true' : 'false'}
              aria-describedby={keywordError ? 'fb-page-keyword-error' : 'fb-page-keyword-help'}
              className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${
                keywordError
                  ? 'border-rose-500 dark:border-rose-400'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {keywordError ? (
              <p
                id="fb-page-keyword-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-rose-700 dark:text-rose-300"
              >
                {keywordError}
              </p>
            ) : (
              <p
                id="fb-page-keyword-help"
                className="mt-1.5 text-xs text-slate-600 dark:text-slate-400"
              >
                2–40 characters. Letters in any script, numbers, hyphen, apostrophe, or &amp;.
              </p>
            )}
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="fb-page-category"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
            >
              Category <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <select
              id="fb-page-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryName)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Tone single-select chips */}
        <div>
          <span
            id="fb-page-tone-label"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2"
          >
            Tone
          </span>
          <div
            role="radiogroup"
            aria-labelledby="fb-page-tone-label"
            className="flex flex-wrap gap-2"
          >
            {TONE_OPTIONS.map((t) => {
              const selected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTone(t.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${
                    selected
                      ? 'bg-[#0A8CFF] text-white border-[#0A8CFF] shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#0A8CFF]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Naming Style + More Options Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-7">
            <label
              htmlFor="fb-page-style"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
            >
              Naming style
            </label>
            <select
              id="fb-page-style"
              value={style}
              onChange={(e) => setStyle(e.target.value as NamingStyle)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900"
            >
              {NAMING_STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <button
              type="button"
              aria-expanded={showMoreOptions}
              aria-controls="fb-page-more-options"
              onClick={() => setShowMoreOptions((prev) => !prev)}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-[#0A8CFF] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900"
            >
              <span>More options</span>
              {showMoreOptions ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {needsLocationHelper && (
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-2.5 text-xs sm:text-sm text-sky-900 dark:text-sky-100 flex flex-wrap items-center justify-between gap-2">
            <span>
              Add a location to use this style (otherwise results fall back to Mix all).
            </span>
            {!showMoreOptions && (
              <button
                type="button"
                onClick={() => setShowMoreOptions(true)}
                className="font-semibold underline text-[#0066CC] dark:text-sky-300 cursor-pointer min-h-[44px] px-2"
              >
                Add location
              </button>
            )}
          </div>
        )}

        {/* 5-8. Collapsible More Options */}
        {showMoreOptions && (
          <div
            id="fb-page-more-options"
            className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="fb-page-length"
                className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
              >
                Name length
              </label>
              <select
                id="fb-page-length"
                value={String(maxWords)}
                onChange={(e) => setMaxWords(Number(e.target.value) as 2 | 3 | 4)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
              >
                <option value="4">Any (up to 4 words)</option>
                <option value="3">Up to 3 words</option>
                <option value="2">Up to 2 words</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fb-page-quantity"
                className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
              >
                Quantity
              </label>
              <select
                id="fb-page-quantity"
                value={String(count)}
                onChange={(e) => setCount(Number(e.target.value) as 12 | 24 | 36)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fb-page-location"
                className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
              >
                Location
              </label>
              <input
                id="fb-page-location"
                type="text"
                maxLength={25}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dubai"
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
              />
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Up to 25 chars. Needed for Brand + Place.
              </p>
            </div>

            <div>
              <label
                htmlFor="fb-page-avoid"
                className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
              >
                Words to avoid
              </label>
              <input
                id="fb-page-avoid"
                type="text"
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder="e.g. Club, Zone"
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
              />
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Comma or new-line separated, case-insensitive.
              </p>
            </div>
          </div>
        )}

        {/* Primary Generate CTA */}
        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-6 py-3 text-base font-bold shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Generate Names</span>
          </button>
        </div>
      </form>

      {/* Polite live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveStatus}
      </div>

      {/* Results Section */}
      <div ref={resultsRegionRef} className="space-y-4">
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                role="status"
                className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/35 px-4 py-2.5 text-xs sm:text-sm text-amber-950 dark:text-amber-100 flex items-start gap-2"
              >
                <AlertTriangle
                  className="h-4 w-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-300"
                  aria-hidden="true"
                />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {hasGenerated && results.length === 0 && !keywordError && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 text-center text-sm text-slate-700 dark:text-slate-300">
            No matching Page names found for this combination of settings. Try Mix all, another tone, or fewer avoided words.
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {results.length} {results.length === 1 ? 'name' : 'names'} generated
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(results.map((r) => r.name).join('\n'), 'all')}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-[#0A8CFF] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                >
                  {copiedKey === 'all' ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>Copy all</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadPlainTextFile(
                      results.map((r) => r.name).join('\n'),
                      'facebook-page-names.txt',
                    )
                  }
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-[#0A8CFF] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download .txt</span>
                </button>

                <button
                  type="button"
                  disabled={poolExhausted}
                  onClick={handleGenerateMore}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  <span>Generate More</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Cards Grid: 1 col mobile, 2 cols from 640px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {results.map((item, idx) => {
                const isBestMatch = bestMatchSet.has(item.name);
                const isFav = favourites.includes(item.name);
                const isCopied = copiedKey === `item-${idx}`;
                const fbSearchUrl = `https://www.facebook.com/search/pages/?q=${encodeURIComponent(item.name)}`;

                return (
                  <article
                    key={`${item.name}-${idx}`}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p
                          dir="auto"
                          className="text-lg font-bold text-slate-950 dark:text-white leading-snug break-words"
                        >
                          {item.name}
                        </p>
                        {isBestMatch && (
                          <span className="shrink-0 inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                            Best match
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span>
                          {item.chars} chars · {item.words} {item.words === 1 ? 'word' : 'words'}
                        </span>
                        {item.fanSafe && (
                          <span
                            title="Signals that the Page is run by fans. Facebook still reviews every name."
                            aria-label="Fan-friendly: Signals that the Page is run by fans. Facebook still reviews every name."
                            className="inline-flex items-center gap-1 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 text-[11px] font-semibold text-sky-900 dark:text-sky-200"
                          >
                            Fan-friendly
                          </span>
                        )}
                      </div>

                      {item.handle && (
                        <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                          Suggested handle: @{item.handle}{' '}
                          <span className="font-sans text-slate-500 dark:text-slate-400">
                            (suggestion only)
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Copy ${item.name}`}
                        onClick={() => handleCopy(item.name, `item-${idx}`)}
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-[#0A8CFF] px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        aria-label={
                          isFav
                            ? `Remove ${item.name} from favourites`
                            : `Star ${item.name} as favourite`
                        }
                        aria-pressed={isFav}
                        onClick={() => toggleFavourite(item.name)}
                        className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] ${
                          isFav
                            ? 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`}
                          aria-hidden="true"
                        />
                        <span>{isFav ? 'Saved' : 'Star'}</span>
                      </button>

                      <a
                        href={fbSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Check ${item.name} on Facebook in a new tab`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-[#0A8CFF] px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] ml-auto"
                      >
                        <span>Check on Facebook</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Saved Favourites */}
        {favourites.length > 0 && (
          <section
            aria-label="Saved favourite Page names"
            className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-current" aria-hidden="true" />
                <span>Saved Favourites ({favourites.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(favourites.join('\n'), 'favs-all')}
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy favourites</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {favourites.map((fav) => (
                <div
                  key={fav}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 pl-3 pr-1.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100"
                >
                  <span dir="auto">{fav}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${fav} from favourites`}
                    onClick={() => toggleFavourite(fav)}
                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Tips for choosing a Page name (6 bullets) */}
      <section
        aria-label="Tips for choosing a Page name"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-5 space-y-2.5"
      >
        <h3 className="text-base font-bold text-slate-950 dark:text-white">
          Tips for choosing a Page name
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc list-inside text-sm text-slate-700 dark:text-slate-300">
          {PAGE_NAME_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Copied Toast */}
      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2.5 text-sm font-semibold shadow-lg flex items-center gap-2"
        >
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" aria-hidden="true" />
          <span>Copied</span>
        </div>
      )}
    </div>
  );
}
