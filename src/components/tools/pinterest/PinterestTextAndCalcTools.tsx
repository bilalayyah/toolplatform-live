import React, {useState, useMemo} from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  RotateCcw,
  Download,
  AlertCircle,
  Calculator,
  TrendingUp,
  Calendar,
  Sparkles,
  AtSign,
  CircleUserRound,
  Pin,
  AlignLeft,
  Eye,
  Type,
} from 'lucide-react';
import {
  PINTEREST_LIMITS,
  countUnicodeChars,
  generatePinterestUsernames,
  generatePinterestBios,
  generatePinterestPinIdeas,
  buildPinterestContentCalendar,
  serializePinterestCalendarCsv,
  serializePinterestCalendarText,
  calculatePinterestEngagement,
  calculatePinterestFollowerGrowth,
  generatePinterestBoardDescriptions,
  generatePinterestSeoDescriptions,
  generatePinterestAltText,
  type PinterestUsernameStyle,
  type PinterestBioTone,
  type PinterestPinFormatFilter,
  type PinterestCalendarMix,
  type PinterestCalendarEntry,
} from '../pinterestHelpers';
import {convertToUnicodeFonts, convertToStylishDecorations} from '../instagramHelpers';

interface CopyProps {
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
}

function CopyButton({
  text,
  copyKey,
  onCopy,
  copiedKey,
  label = 'Copy',
}: {
  text: string;
  copyKey: string;
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  label?: string;
}) {
  const isCopied = copiedKey === copyKey;
  return (
    <button
      type="button"
      onClick={() => onCopy(text, copyKey)}
      aria-label={`${label} ${copyKey}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
    >
      {isCopied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function ErrorAlert({message}: {message: string | null}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function DisclaimerBanner({text}: {text: string}) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Pinterest Username Generator
// ---------------------------------------------------------------------------
export function PinterestUsernameGenerator({onCopy, copiedKey}: CopyProps) {
  const [keywords, setKeywords] = useState('cozy home decor');
  const [style, setStyle] = useState<PinterestUsernameStyle>('descriptive');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [submitted, setSubmitted] = useState<{
    keywords: string;
    style: PinterestUsernameStyle;
    count: 5 | 10;
    variation: number;
  }>({keywords: 'cozy home decor', style: 'descriptive', count: 10, variation: 0});
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => generatePinterestUsernames(submitted), [submitted]);

  const handleGenerate = (nextVariation = 0) => {
    const generated = generatePinterestUsernames({keywords, style, count, variation: nextVariation});
    if (generated.length === 0) {
      setError('Please enter at least one brand or niche keyword (letters or numbers, min 3 characters combined).');
      return;
    }
    setError(null);
    setVariation(nextVariation);
    setSubmitted({keywords, style, count, variation: nextVariation});
  };

  const handleReset = () => {
    setKeywords('cozy home decor');
    setStyle('descriptive');
    setCount(10);
    setVariation(0);
    setError(null);
    setSubmitted({keywords: 'cozy home decor', style: 'descriptive', count: 10, variation: 0});
  };

  const allHandlesText = results.map((r) => r.username).join('\n');

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Deterministic rules-based handle formatter (NOT AI). Does not verify live Pinterest account availability — check directly inside Pinterest Settings." />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="pin-username-kw" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Brand / Niche Keywords
          </label>
          <input
            id="pin-username-kw"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. cozy home decor, studio craft"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-username-style" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Style
          </label>
          <select
            id="pin-username-style"
            value={style}
            onChange={(e) => setStyle(e.target.value as PinterestUsernameStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="descriptive">Descriptive</option>
            <option value="creative">Creative</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div>
          <label htmlFor="pin-username-count" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Options
          </label>
          <select
            id="pin-username-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value={5}>5 usernames</option>
            <option value={10}>10 usernames</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleGenerate(0)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <AtSign className="h-3.5 w-3.5" />
          Generate Usernames
        </button>
        <button
          type="button"
          onClick={() => handleGenerate(variation + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
        {results.length > 0 && (
          <CopyButton text={allHandlesText} copyKey="pin-usernames-all" onCopy={onCopy} copiedKey={copiedKey} label="Copy All" />
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white truncate">
                  @{item.username}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.chars} / {PINTEREST_LIMITS.usernameMax} chars · a–z, 0–9, _
                </p>
              </div>
              <CopyButton text={item.username} copyKey={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Pinterest Bio Generator (≤ 160 chars)
// ---------------------------------------------------------------------------
export function PinterestBioGenerator({onCopy, copiedKey}: CopyProps) {
  const [niche, setNiche] = useState('Minimalist home styling');
  const [tone, setTone] = useState<PinterestBioTone>('friendly');
  const [keywords, setKeywords] = useState('small spaces, DIY decor, warm neutral palette');
  const [variation, setVariation] = useState(0);
  const [submitted, setSubmitted] = useState({
    niche: 'Minimalist home styling',
    tone: 'friendly' as PinterestBioTone,
    keywords: 'small spaces, DIY decor, warm neutral palette',
    variation: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const bios = useMemo(() => generatePinterestBios(submitted), [submitted]);

  const handleGenerate = (nextVar = 0) => {
    if (!niche.trim()) {
      setError('Please enter your niche or primary topic before generating bios.');
      return;
    }
    setError(null);
    setVariation(nextVar);
    setSubmitted({niche, tone, keywords, variation: nextVar});
  };

  const handleReset = () => {
    setNiche('Minimalist home styling');
    setTone('friendly');
    setKeywords('small spaces, DIY decor, warm neutral palette');
    setVariation(0);
    setError(null);
    setSubmitted({
      niche: 'Minimalist home styling',
      tone: 'friendly',
      keywords: 'small spaces, DIY decor, warm neutral palette',
      variation: 0,
    });
  };

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Template-based bio builder (NOT AI). Every bio is formatted to stay within Pinterest's 160-character profile bio limit." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="pin-bio-niche" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Niche / Topic
          </label>
          <input
            id="pin-bio-niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Vegan weeknight recipes"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-bio-tone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tone
          </label>
          <select
            id="pin-bio-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as PinterestBioTone)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="playful">Playful</option>
          </select>
        </div>
        <div>
          <label htmlFor="pin-bio-kw" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Keywords (comma-separated, optional)
          </label>
          <input
            id="pin-bio-kw"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. meal prep, budget, 30-min"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleGenerate(0)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <CircleUserRound className="h-3.5 w-3.5" />
          Generate Bios
        </button>
        <button
          type="button"
          onClick={() => handleGenerate(variation + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
        {bios.length > 0 && (
          <CopyButton
            text={bios.map((b) => b.bio).join('\n\n')}
            copyKey="pin-bios-all"
            onCopy={onCopy}
            copiedKey={copiedKey}
            label="Copy All"
          />
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && bios.length > 0 && (
        <div className="space-y-3">
          {bios.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                    {item.chars} / {PINTEREST_LIMITS.profileBio} chars
                  </span>
                </div>
                <CopyButton text={item.bio} copyKey={item.id} onCopy={onCopy} copiedKey={copiedKey} />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Pinterest Pin Idea Generator
// ---------------------------------------------------------------------------
export function PinterestPinIdeaGenerator({onCopy, copiedKey}: CopyProps) {
  const [niche, setNiche] = useState('Small apartment storage');
  const [audience, setAudience] = useState('renters and busy homeowners');
  const [pinType, setPinType] = useState<PinterestPinFormatFilter>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [submitted, setSubmitted] = useState({
    niche: 'Small apartment storage',
    audience: 'renters and busy homeowners',
    pinType: 'any' as PinterestPinFormatFilter,
    count: 5 as 5 | 10,
    variation: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const ideas = useMemo(() => generatePinterestPinIdeas(submitted), [submitted]);

  const handleGenerate = (nextVar = 0) => {
    if (!niche.trim()) {
      setError('Please enter a niche or topic to build Pin ideas.');
      return;
    }
    setError(null);
    setVariation(nextVar);
    setSubmitted({niche, audience, pinType, count, variation: nextVar});
  };

  const handleReset = () => {
    setNiche('Small apartment storage');
    setAudience('renters and busy homeowners');
    setPinType('any');
    setCount(5);
    setVariation(0);
    setError(null);
    setSubmitted({
      niche: 'Small apartment storage',
      audience: 'renters and busy homeowners',
      pinType: 'any',
      count: 5,
      variation: 0,
    });
  };

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Structured visual Pin angle templates (NOT AI). Build fresh infographic, list, how-to, quote, and product concepts." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="pin-idea-niche" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Niche / Topic
          </label>
          <input
            id="pin-idea-niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Meal prep, Wedding florals"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-idea-aud" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Audience (optional)
          </label>
          <input
            id="pin-idea-aud"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. first-time bakers"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-idea-type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pin Type
          </label>
          <select
            id="pin-idea-type"
            value={pinType}
            onChange={(e) => setPinType(e.target.value as PinterestPinFormatFilter)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="any">Any Format (Mix)</option>
            <option value="infographic">Infographic</option>
            <option value="howto">How-to Guide</option>
            <option value="list">List Pin</option>
            <option value="quote">Quote / Tip</option>
            <option value="product">Product</option>
          </select>
        </div>
        <div>
          <label htmlFor="pin-idea-count" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ideas Count
          </label>
          <select
            id="pin-idea-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value={5}>5 Pin ideas</option>
            <option value={10}>10 Pin ideas</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleGenerate(0)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <Pin className="h-3.5 w-3.5" />
          Generate Pin Ideas
        </button>
        <button
          type="button"
          onClick={() => handleGenerate(variation + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
        {ideas.length > 0 && (
          <CopyButton
            text={ideas.map((i) => `${i.number}. [${i.format}] ${i.pinTitle}\n${i.sentence}`).join('\n\n')}
            copyKey="pin-ideas-all"
            onCopy={onCopy}
            copiedKey={copiedKey}
            label="Copy All"
          />
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && ideas.length > 0 && (
        <div className="space-y-3">
          {ideas.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-red-600 text-[11px] font-bold text-white">
                    {item.number}
                  </span>
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                    {item.format}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.pinTitle}</h3>
                </div>
                <CopyButton
                  text={`${item.pinTitle} — ${item.sentence}`}
                  copyKey={item.id}
                  onCopy={onCopy}
                  copiedKey={copiedKey}
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.sentence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Pinterest Content Calendar Generator (PLAN ONLY — dated week, CSV export)
// ---------------------------------------------------------------------------
function getDefaultStartDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PinterestContentCalendarGenerator({onCopy, copiedKey}: CopyProps) {
  const [niche, setNiche] = useState('Seasonal Home & DIY');
  const [pinsPerWeek, setPinsPerWeek] = useState<2 | 3 | 5 | 7>(5);
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [mix, setMix] = useState<PinterestCalendarMix>('mixed');
  const [entries, setEntries] = useState<PinterestCalendarEntry[]>(() => {
    const res = buildPinterestContentCalendar({
      niche: 'Seasonal Home & DIY',
      pinsPerWeek: 5,
      startDate: getDefaultStartDate(),
      mix: 'mixed',
    });
    return res.entries;
  });
  const [error, setError] = useState<string | null>(null);

  const handleBuild = () => {
    const res = buildPinterestContentCalendar({niche, pinsPerWeek, startDate, mix});
    if (!res.valid) {
      setError(res.error ?? 'Could not build calendar.');
      setEntries([]);
      return;
    }
    setError(null);
    setEntries(res.entries);
  };

  const handleReset = () => {
    const defDate = getDefaultStartDate();
    setNiche('Seasonal Home & DIY');
    setPinsPerWeek(5);
    setStartDate(defDate);
    setMix('mixed');
    setError(null);
    setEntries(buildPinterestContentCalendar({niche: 'Seasonal Home & DIY', pinsPerWeek: 5, startDate: defDate, mix: 'mixed'}).entries);
  };

  const handleUpdateEntry = (id: string, field: 'pinIdea' | 'angle', value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? {...e, [field]: value} : e)));
  };

  const handleDownloadCsv = () => {
    if (entries.length === 0) return;
    const csv = serializePinterestCalendarCsv(entries);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pinterest-content-calendar-${startDate}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="PLAN ONLY — Builds an editable local Pin schedule and CSV export (NOT AI). Does not connect to Pinterest or auto-publish Pins." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="pin-cal-niche" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Niche / Board Focus
          </label>
          <input
            id="pin-cal-niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Organic Gardening"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-cal-cadence" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pins per Week
          </label>
          <select
            id="pin-cal-cadence"
            value={pinsPerWeek}
            onChange={(e) => setPinsPerWeek(Number(e.target.value) as 2 | 3 | 5 | 7)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value={2}>2 Pins / week</option>
            <option value={3}>3 Pins / week</option>
            <option value={5}>5 Pins / week</option>
            <option value={7}>7 Pins / week</option>
          </select>
        </div>
        <div>
          <label htmlFor="pin-cal-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Start Date
          </label>
          <input
            id="pin-cal-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-cal-mix" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pin Types Mix
          </label>
          <select
            id="pin-cal-mix"
            value={mix}
            onChange={(e) => setMix(e.target.value as PinterestCalendarMix)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="mixed">Balanced Mix</option>
            <option value="any">Any Format</option>
            <option value="infographics">Infographics</option>
            <option value="howto">How-To Guides</option>
            <option value="quotes">Quotes & Tips</option>
            <option value="product">Product Pins</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleBuild}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <Calendar className="h-3.5 w-3.5" />
          Generate Calendar
        </button>
        {entries.length > 0 && (
          <>
            <CopyButton
              text={serializePinterestCalendarText(entries)}
              copyKey="pin-cal-all"
              onCopy={onCopy}
              copiedKey={copiedKey}
              label="Copy Schedule"
            />
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-3.5 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {entry.date} ({entry.weekday})
                  </span>
                  <span className="rounded bg-red-50 dark:bg-red-950/40 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-300">
                    {entry.format}
                  </span>
                </div>
                <CopyButton
                  text={`${entry.date} (${entry.weekday}) [${entry.format}] — ${entry.pinIdea} | ${entry.angle}`}
                  copyKey={entry.id}
                  onCopy={onCopy}
                  copiedKey={copiedKey}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  aria-label={`Pin Idea for ${entry.date}`}
                  value={entry.pinIdea}
                  onChange={(e) => handleUpdateEntry(entry.id, 'pinIdea', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  aria-label={`Angle note for ${entry.date}`}
                  value={entry.angle}
                  onChange={(e) => handleUpdateEntry(entry.id, 'angle', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Pinterest Engagement Rate Calculator
// ---------------------------------------------------------------------------
export function PinterestEngagementCalculator({onCopy, copiedKey}: CopyProps) {
  const [method, setMethod] = useState<'impressions' | 'followers'>('impressions');
  const [denominatorStr, setDenominatorStr] = useState('10000');
  const [savesStr, setSavesStr] = useState('140');
  const [closeUpsStr, setCloseUpsStr] = useState('210');
  const [linkClicksStr, setLinkClicksStr] = useState('85');
  const [commentsStr, setCommentsStr] = useState('15');

  const parseMetric = (raw: string): number => {
    const trimmed = raw.trim();
    if (!trimmed) return Number.NaN;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : Number.NaN;
  };

  const result = useMemo(
    () =>
      calculatePinterestEngagement({
        method,
        denominator: parseMetric(denominatorStr),
        saves: parseMetric(savesStr),
        closeUps: parseMetric(closeUpsStr),
        linkClicks: parseMetric(linkClicksStr),
        comments: parseMetric(commentsStr),
      }),
    [method, denominatorStr, savesStr, closeUpsStr, linkClicksStr, commentsStr],
  );

  const handleReset = () => {
    setMethod('impressions');
    setDenominatorStr('10000');
    setSavesStr('140');
    setCloseUpsStr('210');
    setLinkClicksStr('85');
    setCommentsStr('15');
  };

  const summaryCopy = result.valid
    ? `Pinterest Engagement (${method === 'impressions' ? 'by Impressions' : 'by Followers'}): ${result.engagementRate}% | Save Rate: ${result.saveRate}% | Outbound CTR: ${result.clickThroughRate}% | Formula: ${result.formulaUsed}`
    : '';

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Manual entry only — Computes engagement ratios strictly from the Pin numbers you type below. Never fetches live Pinterest Analytics." />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 text-xs space-y-1 text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-white">Transparent Formulas Used:</p>
        <p className="font-mono">
          By Impressions: (Saves + Close-ups + Link clicks + Comments) ÷ Impressions × 100
        </p>
        <p className="font-mono">
          By Followers: (Saves + Close-ups + Link clicks + Comments) ÷ Followers × 100
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMethod('impressions')}
          className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
            method === 'impressions'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Divide by Impressions
        </button>
        <button
          type="button"
          onClick={() => setMethod('followers')}
          className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
            method === 'followers'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Divide by Followers
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="pin-er-denom" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {method === 'impressions' ? 'Impressions' : 'Followers'}
          </label>
          <input
            id="pin-er-denom"
            type="number"
            min="0"
            value={denominatorStr}
            onChange={(e) => setDenominatorStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-er-saves" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Saves
          </label>
          <input
            id="pin-er-saves"
            type="number"
            min="0"
            value={savesStr}
            onChange={(e) => setSavesStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-er-closeups" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Close-ups
          </label>
          <input
            id="pin-er-closeups"
            type="number"
            min="0"
            value={closeUpsStr}
            onChange={(e) => setCloseUpsStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-er-clicks" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Link clicks
          </label>
          <input
            id="pin-er-clicks"
            type="number"
            min="0"
            value={linkClicksStr}
            onChange={(e) => setLinkClicksStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-er-comments" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Comments
          </label>
          <input
            id="pin-er-comments"
            type="number"
            min="0"
            value={commentsStr}
            onChange={(e) => setCommentsStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {!result.valid ? (
        <ErrorAlert message={result.error ?? 'Invalid metrics entered.'} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calculator className="h-4 w-4 text-red-600" />
              <span>Calculated Pinterest Metrics</span>
            </div>
            <CopyButton text={summaryCopy} copyKey="pin-er-summary" onCopy={onCopy} copiedKey={copiedKey} label="Copy Summary" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Engagement Rate</span>
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{result.engagementRate}%</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Save Rate</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{result.saveRate}%</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Outbound Click Rate</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{result.clickThroughRate}%</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Actions</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {result.totalInteractions.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
            {result.formulaUsed}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Pinterest Follower Growth Calculator
// ---------------------------------------------------------------------------
export function PinterestFollowerGrowthCalculator({onCopy, copiedKey}: CopyProps) {
  const [previousStr, setPreviousStr] = useState('1200');
  const [currentStr, setCurrentStr] = useState('1560');
  const [periodStr, setPeriodStr] = useState('30');
  const [periodUnit, setPeriodUnit] = useState<'days' | 'weeks' | 'months'>('days');

  const parseNum = (raw: string): number => {
    const t = raw.trim();
    if (!t) return Number.NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : Number.NaN;
  };

  const result = useMemo(
    () =>
      calculatePinterestFollowerGrowth({
        previousFollowers: parseNum(previousStr),
        currentFollowers: parseNum(currentStr),
        periodValue: parseNum(periodStr),
        periodUnit,
      }),
    [previousStr, currentStr, periodStr, periodUnit],
  );

  const handleReset = () => {
    setPreviousStr('1200');
    setCurrentStr('1560');
    setPeriodStr('30');
    setPeriodUnit('days');
  };

  const summaryCopy = result.valid
    ? `Pinterest Follower Growth: ${result.growthRatePercent}% (${result.absoluteGrowth >= 0 ? '+' : ''}${result.absoluteGrowth} followers, ${result.avgGrowthPerDay}/day over ${result.totalDays} days) | ${result.formulaUsed}`
    : '';

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Manual entry only — Calculates Pinterest follower growth rate and daily pace purely from the counts you enter below." />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 text-xs space-y-1 text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-white">Formula Used:</p>
        <p className="font-mono">Growth Rate (%) = ((Current Followers − Previous Followers) ÷ Previous Followers) × 100</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label htmlFor="pin-fg-prev" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Previous Followers
          </label>
          <input
            id="pin-fg-prev"
            type="number"
            min="0"
            value={previousStr}
            onChange={(e) => setPreviousStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-fg-curr" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Followers
          </label>
          <input
            id="pin-fg-curr"
            type="number"
            min="0"
            value={currentStr}
            onChange={(e) => setCurrentStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-fg-period" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Time Period
          </label>
          <input
            id="pin-fg-period"
            type="number"
            min="1"
            value={periodStr}
            onChange={(e) => setPeriodStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-fg-unit" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Period Unit
          </label>
          <select
            id="pin-fg-unit"
            value={periodUnit}
            onChange={(e) => setPeriodUnit(e.target.value as 'days' | 'weeks' | 'months')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months (30d)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {!result.valid ? (
        <ErrorAlert message={result.error ?? 'Invalid follower metrics entered.'} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span>Follower Growth Summary</span>
            </div>
            <CopyButton text={summaryCopy} copyKey="pin-fg-summary" onCopy={onCopy} copiedKey={copiedKey} label="Copy Summary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Growth Rate</span>
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{result.growthRatePercent}%</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Absolute Growth</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {result.absoluteGrowth >= 0 ? '+' : ''}
                {result.absoluteGrowth.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                Avg Growth / Day ({result.totalDays}d)
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {result.avgGrowthPerDay >= 0 ? '+' : ''}
                {result.avgGrowthPerDay}
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
            {result.formulaUsed}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. Pinterest Board Description Generator (Verified + Enhanced ≤ 500 chars)
// ---------------------------------------------------------------------------
export function PinterestBoardDescGenerator({onCopy, copiedKey}: CopyProps) {
  const [kw, setKw] = useState('Minimalist Home Decor');
  const [extra, setExtra] = useState('neutral palette, apartment styling, cozy living');
  const [variation, setVariation] = useState(0);
  const [submitted, setSubmitted] = useState({kw: 'Minimalist Home Decor', extra: 'neutral palette, apartment styling, cozy living', variation: 0});
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => generatePinterestBoardDescriptions(submitted.kw, submitted.extra, submitted.variation),
    [submitted],
  );

  const handleGenerate = (nextVar = 0) => {
    if (!kw.trim()) {
      setError('Please enter your board focus keyword.');
      return;
    }
    setError(null);
    setVariation(nextVar);
    setSubmitted({kw, extra, variation: nextVar});
  };

  const handleReset = () => {
    setKw('Minimalist Home Decor');
    setExtra('neutral palette, apartment styling, cozy living');
    setVariation(0);
    setError(null);
    setSubmitted({kw: 'Minimalist Home Decor', extra: 'neutral palette, apartment styling, cozy living', variation: 0});
  };

  return (
    <div className="space-y-4">
      <DisclaimerBanner text="Template-based board description helper (NOT AI). Formatted cleanly within Pinterest's 500-character limit." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pin-board-kw" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Board Topic / Name
          </label>
          <input
            id="pin-board-kw"
            type="text"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="e.g. Minimalist Home Decor"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-board-extra" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Extra Search Keywords (comma-separated, optional)
          </label>
          <input
            id="pin-board-extra"
            type="text"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. neutral tones, DIY decor"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleGenerate(0)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <AlignLeft className="h-3.5 w-3.5" />
          Generate Descriptions
        </button>
        <button
          type="button"
          onClick={() => handleGenerate(variation + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
        {items.length > 0 && (
          <CopyButton text={items.join('\n\n')} copyKey="p-board-all" onCopy={onCopy} copiedKey={copiedKey} label="Copy All" />
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((desc, i) => {
            const chars = countUnicodeChars(desc);
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="inline-block rounded bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                    {chars} / {PINTEREST_LIMITS.boardDescription} chars
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{desc}</p>
                </div>
                <CopyButton text={desc} copyKey={`p-desc-${i}`} onCopy={onCopy} copiedKey={copiedKey} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. Pinterest SEO Description Generator (Dedicated Pin SEO Copy ≤ 500 chars)
// ---------------------------------------------------------------------------
export function PinterestSeoDescGenerator({onCopy, copiedKey}: CopyProps) {
  const [topic, setTopic] = useState('Cozy Reading Nook Makeover');
  const [keywords, setKeywords] = useState('reading corner ideas, warm lighting, small space bookshelf');
  const [cta, setCta] = useState('Save this Pin for your weekend refresh!');
  const [variation, setVariation] = useState(0);
  const [submitted, setSubmitted] = useState({
    topic: 'Cozy Reading Nook Makeover',
    keywords: 'reading corner ideas, warm lighting, small space bookshelf',
    cta: 'Save this Pin for your weekend refresh!',
    variation: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => generatePinterestSeoDescriptions(submitted), [submitted]);

  const handleGenerate = (nextVar = 0) => {
    if (!topic.trim()) {
      setError('Please enter a Pin title or topic before generating SEO descriptions.');
      return;
    }
    setError(null);
    setVariation(nextVar);
    setSubmitted({topic, keywords, cta, variation: nextVar});
  };

  const handleReset = () => {
    setTopic('Cozy Reading Nook Makeover');
    setKeywords('reading corner ideas, warm lighting, small space bookshelf');
    setCta('Save this Pin for your weekend refresh!');
    setVariation(0);
    setError(null);
    setSubmitted({
      topic: 'Cozy Reading Nook Makeover',
      keywords: 'reading corner ideas, warm lighting, small space bookshelf',
      cta: 'Save this Pin for your weekend refresh!',
      variation: 0,
    });
  };

  return (
    <div className="space-y-4">
      <DisclaimerBanner text="Template-based Pin SEO copy builder (NOT AI). Weaves your natural search keywords within Pinterest's 500-character limit." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="pin-seo-topic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pin Title / Topic
          </label>
          <input
            id="pin-seo-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Cozy Reading Nook"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-seo-kw" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Search Keywords (comma-separated)
          </label>
          <input
            id="pin-seo-kw"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. shelf styling, apartment lighting"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-seo-cta" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Call to Action (optional)
          </label>
          <input
            id="pin-seo-cta"
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g. Tap for step-by-step guide"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleGenerate(0)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <AlignLeft className="h-3.5 w-3.5" />
          Generate Pin SEO Copy
        </button>
        <button
          type="button"
          onClick={() => handleGenerate(variation + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
        {items.length > 0 && (
          <CopyButton
            text={items.map((x) => `${x.label}: ${x.text}`).join('\n\n')}
            copyKey="p-seo-all"
            onCopy={onCopy}
            copiedKey={copiedKey}
            label="Copy All"
          />
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <ErrorAlert message={error} />

      {!error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                    {item.chars} / {PINTEREST_LIMITS.pinDescription} chars
                  </span>
                </div>
                <CopyButton text={item.text} copyKey={`p-seo-${idx}`} onCopy={onCopy} copiedKey={copiedKey} />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9. Pinterest Alt Text Generator (Verified + Enhanced, NOT auto-vision)
// ---------------------------------------------------------------------------
export function PinterestAltTextGenerator({onCopy, copiedKey}: CopyProps) {
  const [subject, setSubject] = useState('Living room shelf decor');
  const [colors, setColors] = useState('warm earth tones');
  const [style, setStyle] = useState('minimalist aesthetic');
  const [overlayText, setOverlayText] = useState('');

  const alt = useMemo(
    () => generatePinterestAltText({subject, colors, style, overlayText}),
    [subject, colors, style, overlayText],
  );
  const chars = countUnicodeChars(alt);

  const handleReset = () => {
    setSubject('Living room shelf decor');
    setColors('warm earth tones');
    setStyle('minimalist aesthetic');
    setOverlayText('');
  };

  return (
    <div className="space-y-4">
      <DisclaimerBanner text="Generated strictly from YOUR own typed visual description — NOT auto-vision and NOT AI." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pin-alt-subj" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Main Subject
          </label>
          <input
            id="pin-alt-subj"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Ceramic vase on oak table"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-alt-col" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Colors & Lighting
          </label>
          <input
            id="pin-alt-col"
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="e.g. warm earth tones, soft sunlight"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-alt-style" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Visual Style / Setting
          </label>
          <input
            id="pin-alt-style"
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g. minimalist aesthetic"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-alt-overlay" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Visible On-Image Text (optional)
          </label>
          <input
            id="pin-alt-overlay"
            type="text"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="e.g. 5 Shelf Styling Rules"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {!alt ? (
        <ErrorAlert message="Please enter at least one visual detail (subject, colors, style, or overlay text) to format alt text." />
      ) : (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Generated Alt Text</span>
              <span className="rounded bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                {chars} / {PINTEREST_LIMITS.altText} chars
              </span>
            </div>
            <CopyButton text={alt} copyKey="alt-copy" onCopy={onCopy} copiedKey={copiedKey} />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{alt}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10. Pinterest Stylish Text Generator (Separate page — decorative symbols + Unicode)
// ---------------------------------------------------------------------------
export function PinterestStylishTextGenerator({onCopy, copiedKey}: CopyProps) {
  const [txt, setTxt] = useState('Aesthetic Board Ideas');
  const [fontBase, setFontBase] = useState('plain');

  const trimmed = txt.trim();
  const baseFonts = useMemo(() => (trimmed ? convertToUnicodeFonts(trimmed) : []), [trimmed]);
  const decorations = useMemo(() => (trimmed ? convertToStylishDecorations(trimmed, fontBase) : []), [trimmed, fontBase]);

  return (
    <div className="space-y-5">
      <DisclaimerBanner text="Fixed Unicode symbol frames & aesthetic dividers (NOT AI). Keep main searchable board keywords in plain letters alongside styled headers." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="pin-stylish-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Board Title or Profile Heading
          </label>
          <input
            id="pin-stylish-input"
            type="text"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="Type text to decorate..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pin-stylish-base" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lettering Base
          </label>
          <select
            id="pin-stylish-base"
            value={fontBase}
            onChange={(e) => setFontBase(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="plain">Plain Letters</option>
            {baseFonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!trimmed ? (
        <ErrorAlert message="Please type a board title or heading above to generate styled Unicode frames." />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {decorations.map((d, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 block">{d.name}</span>
                  <span className="text-sm text-slate-900 dark:text-white break-all">{d.result}</span>
                </div>
                <CopyButton text={d.result} copyKey={`stylish-dec-${idx}`} onCopy={onCopy} copiedKey={copiedKey} />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-red-600" />
              Unframed Unicode Styles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {baseFonts.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">{f.name}</span>
                    <span className="text-sm text-slate-900 dark:text-white break-all">{f.result}</span>
                  </div>
                  <CopyButton text={f.result} copyKey={`stylish-font-${f.id}`} onCopy={onCopy} copiedKey={copiedKey} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 11. Pinterest Font Generator (Separate page — clean Unicode fonts)
// ---------------------------------------------------------------------------
export function PinterestFontGenerator({onCopy, copiedKey}: CopyProps) {
  const [txt, setTxt] = useState('Pinterest Curation');
  const trimmed = txt.trim();
  const list = useMemo(() => (trimmed ? convertToUnicodeFonts(trimmed) : []), [trimmed]);

  return (
    <div className="space-y-4">
      <DisclaimerBanner text="Deterministic Unicode font table converter (NOT AI). No font files needed — copy and paste directly into Pinterest." />

      <div>
        <label htmlFor="pin-font-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Text to Convert
        </label>
        <input
          id="pin-font-input"
          type="text"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Type tagline or board subtitle..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {!trimmed ? (
        <ErrorAlert message="Please enter text above to convert into Unicode fonts." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex justify-between items-center gap-3"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Type className="h-3 w-3" /> {f.name}
                </span>
                <span className="text-sm text-slate-900 dark:text-white break-all">{f.result}</span>
              </div>
              <CopyButton text={f.result} copyKey={`font-${f.id}`} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
