import React, { useState, useMemo, useRef } from 'react';
import {
  Copy,
  Check,
  AtSign,
  Sparkles,
  Download,
  RotateCcw,
  Upload,
  Info,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  MessageSquare,
  Repeat,
  Heart,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Quote,
  Layers,
  Sparkle,
  Hash,
} from 'lucide-react';
import type { Tool } from '../../data/tools';
import {
  countUnicodeChars,
  validateThreadsUsername,
  generateThreadsUsernames,
  generateThreadsBios,
  generateThreadsPosts,
  generateThreadsCaptions,
  generateThreadsHashtags,
  generateThreadsHooks,
  generateThreadsPostIdeas,
  generateThreadsReplies,
  generateThreadsComments,
  generateThreadsCalendar,
  serializeThreadsCalendarCsv,
  formatThreadsPoll,
  generateThreadsQuotePosts,
  splitThreadsPost,
  calculateThreadsEngagement,
  generateThreadsStylishText,
  generateThreadsUnicodeFonts,
  type ThreadsUsernameStyle,
  type ThreadsBioVibe,
  type ThreadsPostTone,
  type ThreadsCaptionStyle,
  type ThreadsHookStyle,
  type ThreadsPostIdeaType,
  type ThreadsReplyIntent,
  type ThreadsReplyTone,
  type ThreadsCommentStyle,
  type ThreadsCalendarCadence,
  type ThreadsCalendarMix,
  type ThreadsQuoteTone,
} from './threadsHelpers';

interface Props {
  tool: Tool;
}

export function ThreadsToolsRunner({ tool }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Workspace Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm font-bold">
            <AtSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Deterministic browser utility · Zero AI · Zero external network calls · No Threads login required
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Tool 1 */}
        {tool.slug === 'threads-username-generator' && (
          <ThUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 2 */}
        {tool.slug === 'threads-bio-generator' && (
          <ThBioGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 3 */}
        {tool.slug === 'threads-post-generator' && (
          <ThPostGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 4 */}
        {tool.slug === 'threads-caption-generator' && (
          <ThCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 5 */}
        {tool.slug === 'threads-hashtag-generator' && (
          <ThHashtagGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 6 */}
        {tool.slug === 'threads-hook-generator' && (
          <ThHookGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 7 */}
        {tool.slug === 'threads-post-idea-generator' && (
          <ThPostIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 8 */}
        {tool.slug === 'threads-reply-generator' && (
          <ThReplyGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 9 */}
        {tool.slug === 'threads-comment-generator' && (
          <ThCommentGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 10 */}
        {tool.slug === 'threads-content-calendar-generator' && (
          <ThContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 11 */}
        {tool.slug === 'threads-poll-generator' && (
          <ThPollGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 12 */}
        {tool.slug === 'threads-quote-generator' && (
          <ThQuoteGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 13 */}
        {tool.slug === 'threads-thread-generator' && (
          <ThThreadFormatter onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 14 */}
        {tool.slug === 'threads-stylish-text-generator' && (
          <ThStylishTextGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 15 */}
        {tool.slug === 'threads-font-generator' && (
          <ThFontGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 16 */}
        {tool.slug === 'threads-character-counter' && (
          <ThCharacterCounter max={500} label="Threads Post (500 Character Limit)" onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 17 */}
        {tool.slug === 'threads-engagement-rate-calculator' && (
          <ThEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 18 */}
        {tool.slug === 'threads-profile-picture-resizer' && (
          <ThImageResizer isProfile={true} />
        )}

        {/* Tool 19 */}
        {tool.slug === 'threads-post-image-resizer' && (
          <ThImageResizer isProfile={false} />
        )}

        {/* Tool 20 */}
        {tool.slug === 'threads-bio-character-counter' && (
          <ThCharacterCounter max={150} label="Threads Bio (150 Character Limit)" onCopy={copyText} copiedKey={copiedKey} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Threads Username Generator
// ---------------------------------------------------------------------------
function ThUsernameGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [keyword, setKeyword] = useState('Alex');
  const [style, setStyle] = useState<ThreadsUsernameStyle>('cool');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsUsernames({ keyword, style, count, variation });
  }, [keyword, style, count, variation]);

  const handleGenerate = () => {
    if (!keyword.trim()) {
      setError('Please enter a name, nickname, or keyword to generate username ideas.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setKeyword('Alex');
    setStyle('cool');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.usernames.map((u) => u.username).join('\n');
    onCopy(text, 'th-un-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Threads & Instagram Username Connection Disclosure
          </span>
          Threads usernames are tied directly to your connected Instagram @handle. Format rules allow up to 30 characters using letters, numbers, periods, and underscores. Availability must be checked in the Threads/Instagram app — this tool checks syntax rules only and never claims live availability.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Name, Nickname, or Creator Focus <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Alex, Designer, Writer"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 dark:focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Username Vibe
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as ThreadsUsernameStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="cool">Cool / Brand</option>
            <option value="cute">Cute / Cozy</option>
            <option value="short">Short / Compact (≤10 chars)</option>
            <option value="professional">Professional / Agency</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={5}>5 Username Ideas</option>
            <option value={10}>10 Username Ideas</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Ideas
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.usernames.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Valid Threads/Instagram Handle Ideas ({result.usernames.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-un-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-un-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.usernames.map((u, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    @{u.username}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {u.chars}/30
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(u.username, `th-un-${i}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shrink-0 cursor-pointer"
                >
                  {copiedKey === `th-un-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `th-un-${i}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Threads Bio Generator (≤ 150 Chars)
// ---------------------------------------------------------------------------
function ThBioGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Maya, graphic designer, coffee lover');
  const [vibe, setVibe] = useState<ThreadsBioVibe>('casual');
  const [count, setCount] = useState<3 | 5>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsBios({ input, vibe, count, variation });
  }, [input, vibe, count, variation]);

  const handleGenerate = () => {
    if (!input.trim()) {
      setError('Please enter your name, profession, or interests for your Threads bio.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setInput('Maya, graphic designer, coffee lover');
    setVibe('casual');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.bios.map((b) => b.text).join('\n');
    onCopy(text, 'th-bio-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Threads Bio Rule: ≤150 Characters
          </span>
          Threads profile bios support up to 150 characters. All generated variations below are strictly guaranteed to fit within 150 characters with live character counts shown.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Name, Profession, or Focus <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Maya, product designer, building SaaS & brewing espresso"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Bio Tone & Vibe
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as ThreadsBioVibe)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="casual">Casual & Conversational ☕</option>
            <option value="professional">Professional & Insightful 💡</option>
            <option value="funny">Funny & Self-Deprecating 😂</option>
            <option value="minimal">Minimalist & Clean 🕊️</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 3 | 5)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={3}>3 Bios</option>
            <option value={5}>5 Bios</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Bios
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.bios.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Threads Profile Bios ({result.bios.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-bio-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-bio-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.bios.map((b, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {b.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {b.chars}/150
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(b.text, `th-bio-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                  >
                    {copiedKey === `th-bio-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `th-bio-${i}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Threads Post Generator (SINGLE POST ≤ 500 CHARS - DISTINCT TOOL)
// ---------------------------------------------------------------------------
function ThPostGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('why I quit my 9-to-5 to freelance');
  const [tone, setTone] = useState<ThreadsPostTone>('casual');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsPosts({ topic, tone, count: 5, variation });
  }, [topic, tone, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic or message for your Threads post.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('why I quit my 9-to-5 to freelance');
    setTone('casual');
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.posts.map((p, i) => `[Post Option ${i + 1}]\n${p.text}\n`).join('\n---\n\n');
    onCopy(text, 'th-post-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Single Post Generator (≤500 Characters)
          </span>
          This tool writes ONE single standalone post per variation, kept strictly within Threads’ 500-character post limit. It is distinct from the Thread Generator (which formats a multi-post connected series).
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Post Topic or Core Message <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. lessons from my first startup, why consistency beats talent"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ThreadsPostTone)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="casual">Casual & Conversational ☕</option>
            <option value="thoughtful">Thoughtful & Analytical 💡</option>
            <option value="funny">Funny & Self-Deprecating 😂</option>
            <option value="bold">Bold & Direct 🔥</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Single Posts
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.posts.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Single Threads Post Variations ({result.posts.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-post-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-post-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.posts.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Post Variation {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {p.chars}/500 chars
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(p.text, `th-post-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-post-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-post-${i}` ? 'Copied' : 'Copy Post'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Threads Caption Generator (≤ 500 Chars)
// ---------------------------------------------------------------------------
function ThCaptionGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('sunset hike with friends');
  const [style, setStyle] = useState<ThreadsCaptionStyle>('punchy');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsCaptions({ topic, style, count, variation });
  }, [topic, style, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a moment or topic for your Threads photo caption.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('sunset hike with friends');
    setStyle('punchy');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.captions.map((c) => c.text).join('\n\n---\n\n');
    onCopy(text, 'th-cap-all');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Photo Topic or Moment <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. coffee shop work session, mountain hike, weekend cooking"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Caption Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as ThreadsCaptionStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="punchy">Short & Punchy ⚡</option>
            <option value="storytelling">Storytelling & Reflection 📖</option>
            <option value="question">Question & Discussion 💬</option>
            <option value="humorous">Humorous & Witty 😂</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={5}>5 Captions</option>
            <option value={10}>10 Captions</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Captions
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.captions.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Threads Photo Captions ({result.captions.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-cap-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-cap-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.captions.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {c.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {c.chars}/500
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(c.text, `th-cap-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                  >
                    {copiedKey === `th-cap-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `th-cap-${i}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Threads Hashtag Generator (ONE TOPIC TAG PER POST RULE)
// ---------------------------------------------------------------------------
function ThHashtagGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('home baking');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsHashtags({ topic, count, variation });
  }, [topic, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate relevant Threads topic tags.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('home baking');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.tags.map((t) => t.tag).join('\n');
    onCopy(text, 'th-tag-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Hash className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Threads Rule: Exactly ONE Topic Tag per Post
          </span>
          Unlike Instagram, Threads is engineered around single clickable topic tags. Multiple hashtag blocks look like spam and are discouraged. Use the single topic tag below that best classifies your post into discovery feeds.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Post Niche or Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. freelance design, home baking, morning routine"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={5}>5 Tags</option>
            <option value={10}>10 Tags</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Topic Tags
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.tags.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Single Topic Tags for Your Post ({result.tags.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-tag-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-tag-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.tags.map((t, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {t.tag}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(t.tag, `th-tag-${i}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                >
                  {copiedKey === `th-tag-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `th-tag-${i}` ? 'Copied Tag' : 'Copy Tag'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Threads Hook Generator (≤ 500 Chars)
// ---------------------------------------------------------------------------
function ThHookGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('morning routines');
  const [style, setStyle] = useState<ThreadsHookStyle>('question');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsHooks({ topic, style, count, variation });
  }, [topic, style, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate opening post hooks.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('morning routines');
    setStyle('question');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.hooks.map((h) => h.text).join('\n');
    onCopy(text, 'th-hook-all');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Topic or Conversation Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. morning routines, remote work, learning in public"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Hook Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as ThreadsHookStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="question">Open Question ❓</option>
            <option value="bold">Bold Statement 🔥</option>
            <option value="story">Story Opener 📖</option>
            <option value="contrarian">Contrarian Take ⚡</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={5}>5 Hooks</option>
            <option value={10}>10 Hooks</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Hooks
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.hooks.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Opening Line Hooks ({result.hooks.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-hook-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-hook-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.hooks.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {h.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {h.chars} ch
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(h.text, `th-hook-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                  >
                    {copiedKey === `th-hook-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `th-hook-${i}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. Threads Post Idea Generator
// ---------------------------------------------------------------------------
function ThPostIdeaGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('beginner photography');
  const [audience, setAudience] = useState('aspiring creators');
  const [postType, setPostType] = useState<ThreadsPostIdeaType>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsPostIdeas({ topic, audience, postType, count, variation });
  }, [topic, audience, postType, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a niche or topic to generate post ideas.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('beginner photography');
    setAudience('aspiring creators');
    setPostType('any');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.ideas.map((idea, i) => `${i + 1}. [${idea.postType}] ${idea.title}\nAngle: ${idea.conceptAngle}\nWhy it works: ${idea.whyItWorks}\n`).join('\n');
    onCopy(text, 'th-idea-all');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Niche or Focus Area <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. coffee brewing, indie software, landscape photography"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Target Audience (Optional)
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. beginners, founders, students"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Post Format
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as ThreadsPostIdeaType)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="any">Any Format</option>
            <option value="advice">Tactical Advice</option>
            <option value="opinion">Strong Opinion</option>
            <option value="story">Personal Story</option>
            <option value="question">Discussion Question</option>
            <option value="hot_take">Contrarian Hot Take</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Number of Ideas
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={5}>5 Post Ideas</option>
            <option value={10}>10 Post Ideas</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Ideas
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.ideas.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Structured Threads Post Concepts ({result.ideas.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-idea-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-idea-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.ideas.map((idea, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {idea.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                      {idea.postType}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(`[${idea.postType}] ${idea.title}\nAngle: ${idea.conceptAngle}\nWhy it works: ${idea.whyItWorks}`, `th-idea-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-idea-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-idea-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pl-7 space-y-1">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    Draft Angle: {idea.conceptAngle}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Why it works: {idea.whyItWorks}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. Threads Reply Generator (ANSWERS SOMEONE ELSE'S POST IN CONVERSATION)
// ---------------------------------------------------------------------------
function ThReplyGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [originalPost, setOriginalPost] = useState('Most advice on building a business is just people trying to sell you their course. Simplicity and consistency are the only real secrets.');
  const [intent, setIntent] = useState<ThreadsReplyIntent>('agree');
  const [tone, setTone] = useState<ThreadsReplyTone>('friendly');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsReplies({ originalPost, intent, tone });
  }, [originalPost, intent, tone]);

  const handleGenerate = () => {
    if (!originalPost.trim()) {
      setError('Please paste the original Threads post you want to reply to.');
      return;
    }
    setError(null);
  };

  const handleReset = () => {
    setOriginalPost('Most advice on building a business is just people trying to sell you their course. Simplicity and consistency are the only real secrets.');
    setIntent('agree');
    setTone('friendly');
    setError(null);
  };

  const copyAll = () => {
    const text = result.replies.map((r, i) => `[Reply Option ${i + 1}]\n${r.text}\n`).join('\n---\n\n');
    onCopy(text, 'th-rep-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Conversational Reply Generator (Answers Someone Else's Post)
          </span>
          This tool crafts genuine, thoughtful replies that directly answer and contextualize a specific post you paste. It is distinct from the Comment Generator (which drafts standalone reflections on a topic).
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Original Post Text (Paste from Threads) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={originalPost}
            onChange={(e) => {
              setOriginalPost(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste the post you want to reply to..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reply Intent
            </label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value as ThreadsReplyIntent)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
            >
              <option value="agree">Agree & Validate 🤝</option>
              <option value="add_value">Add Value & Pro Tip 💡</option>
              <option value="disagree">Respectful Disagreement / Nuance ⚖️</option>
              <option value="question">Ask a Follow-Up Question ❓</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reply Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ThreadsReplyTone)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
            >
              <option value="friendly">Friendly & Warm ☕</option>
              <option value="witty">Witty & Sharp 😂</option>
              <option value="thoughtful">Thoughtful & In-Depth 💭</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Draft Conversational Replies
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.replies.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Contextual Reply Drafts ({result.replies.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-rep-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-rep-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.replies.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Reply Option {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {r.chars}/500 chars
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(r.text, `th-rep-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-rep-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-rep-${i}` ? 'Copied' : 'Copy Reply'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9. Threads Comment Generator (STANDALONE COMMENT ON TOPIC - DISTINCT TOOL)
// ---------------------------------------------------------------------------
function ThCommentGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('remote work burnout and screen fatigue');
  const [style, setStyle] = useState<ThreadsCommentStyle>('insightful');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsComments({ topic, style, count: 5, variation });
  }, [topic, style, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a post topic or paste text to generate standalone comment drafts.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('remote work burnout and screen fatigue');
    setStyle('insightful');
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.comments.map((c, i) => `[Comment ${i + 1}]\n${c.text}\n`).join('\n---\n\n');
    onCopy(text, 'th-com-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Standalone Comment Generator (General Reflections on a Topic)
          </span>
          This tool generates standalone perspectives and thoughtful remarks about a general topic or trend. It is distinct from the Reply Generator (which specifically responds to another person's pasted post).
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Post Topic or Discussion Theme <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. remote work burnout, career pivots, creator economy"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Comment Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as ThreadsCommentStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="insightful">Insightful & Analytical 💡</option>
            <option value="supportive">Supportive & Encouraging 👏</option>
            <option value="funny">Funny & Relatable 😂</option>
            <option value="question">Discussion Starter ❓</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Standalone Comments
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.comments.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Standalone Comment Drafts ({result.comments.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-com-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-com-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.comments.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Comment Draft {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {c.chars}/500 chars
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(c.text, `th-com-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-com-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-com-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10. Threads Content Calendar Generator
// ---------------------------------------------------------------------------
function ThContentCalendarGenerator({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (c: string, f: string, m: string) => void;
}) {
  const getNextMonday = () => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    return d.toISOString().slice(0, 10);
  };

  const [topic, setTopic] = useState('Remote Work & Productivity');
  const [postsPerWeek, setPostsPerWeek] = useState<ThreadsCalendarCadence>(5);
  const [startDate, setStartDate] = useState(getNextMonday());
  const [contentMix, setContentMix] = useState<ThreadsCalendarMix>('mixed');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsCalendar({ topic, postsPerWeek, startDate, contentMix });
  }, [topic, postsPerWeek, startDate, contentMix]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a niche or topic for your Threads content calendar.');
      return;
    }
    setError(null);
  };

  const handleReset = () => {
    setTopic('Remote Work & Productivity');
    setPostsPerWeek(5);
    setStartDate(getNextMonday());
    setContentMix('mixed');
    setError(null);
  };

  const copySchedule = () => {
    const text = result.entries.map((e) => `[${e.dateStr} - ${e.dayOfWeek}] (${e.postType}) ${e.title}\nConcept: ${e.concept}\nTag: ${e.suggestedTag}\n`).join('\n');
    onCopy(text, 'th-cal-all');
  };

  const downloadCsv = () => {
    const csv = serializeThreadsCalendarCsv(result.entries);
    onDownload(csv, `threads_calendar_${startDate}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Planning Tool Disclosure
          </span>
          This tool generates strategic weekly posting schedules. It is a planning template only and does not schedule or publish posts to Threads.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Topic or Niche <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. UX design, personal finance, indie hacking"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Posting Cadence
          </label>
          <select
            value={postsPerWeek}
            onChange={(e) => setPostsPerWeek(Number(e.target.value) as ThreadsCalendarCadence)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value={2}>2 Posts / Week</option>
            <option value={3}>3 Posts / Week</option>
            <option value={5}>5 Posts / Week (Recommended)</option>
            <option value={7}>7 Posts / Week (Daily)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Content Mix
          </label>
          <select
            value={contentMix}
            onChange={(e) => setContentMix(e.target.value as ThreadsCalendarMix)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="mixed">Mixed (Opinions, Stories, Advice)</option>
            <option value="advice">Advice & Frameworks</option>
            <option value="stories">Personal Stories</option>
            <option value="opinions">Hot Takes & Opinions</option>
            <option value="questions">Questions & Polls</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Calendar className="h-3.5 w-3.5" />
            Generate Calendar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.entries.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Scheduled Calendar Entries ({result.entries.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copySchedule}
                className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
              >
                {copiedKey === 'th-cal-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'th-cal-all' ? 'Copied' : 'Copy Plan'}</span>
              </button>
              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Day / Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Post Title & Concept</th>
                  <th className="p-3">Single Topic Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {result.entries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      <div>Day {e.dayNumber}</div>
                      <div className="text-[10px] text-slate-400">{e.dateStr} ({e.dayOfWeek})</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                        {e.postType}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{e.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{e.concept}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                      {e.suggestedTag}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 11. Threads Poll Generator (2–4 Options, ≤25 Chars Each, Question ≤500 Chars)
// ---------------------------------------------------------------------------
function ThPollGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [question, setQuestion] = useState('What’s the biggest bottleneck in your daily routine?');
  const [options, setOptions] = useState<string[]>([
    'Context switching',
    'Too many meetings',
    'Unclear priorities',
    'Overthinking details',
  ]);
  const [duration, setDuration] = useState<'24h' | '3d' | '7d'>('24h');

  const pollResult = useMemo(() => {
    return formatThreadsPoll({ question, options, duration });
  }, [question, options, duration]);

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleReset = () => {
    setQuestion('What’s the biggest bottleneck in your daily routine?');
    setOptions([
      'Context switching',
      'Too many meetings',
      'Unclear priorities',
      'Overthinking details',
    ]);
    setDuration('24h');
  };

  const copyPoll = () => {
    onCopy(pollResult.formattedText, 'th-poll-copy');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Threads Poll Rules & Disclosure
          </span>
          Threads polls support 2 to 4 answer options with a strict 25-character button label limit per option. Questions can be up to 500 characters. The poll itself can only be created on Threads — this tool prepares and validates content only, and does not publish.
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Poll Question <span className="text-rose-500">*</span></span>
            <span className="font-mono text-slate-500">{countUnicodeChars(question)}/500</span>
          </div>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your poll question..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Poll Options (2–4 options, max 25 characters each)
          </label>
          {options.map((opt, i) => {
            const charCount = countUnicodeChars(opt);
            const isOver = charCount > 25;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-16">
                  Option {i + 1}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1} (max 25 chars)`}
                  className={`flex-1 rounded-xl border bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none ${
                    isOver ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-slate-900'
                  }`}
                />
                <span className={`text-[10px] font-mono w-12 text-right ${isOver ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {charCount}/25
                </span>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                    title="Remove option"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {options.length < 4 && (
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Option ({options.length}/4)</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Duration:</span>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as '24h' | '3d' | '7d')}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
            >
              <option value="24h">24 Hours (Standard)</option>
              <option value="3d">3 Days</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={copyPoll}
            disabled={!pollResult.isValid}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-sm ${
              pollResult.isValid
                ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {copiedKey === 'th-poll-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'th-poll-copy' ? 'Poll Copied' : 'Copy Poll Text'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {pollResult.errors.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
          {pollResult.errors.map((err, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* Live Preview Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Threads Poll Composer Preview</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
            {pollResult.durationLabel}
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
          {pollResult.question || 'Your poll question preview will appear here...'}
        </p>

        <div className="space-y-2 pt-1">
          {pollResult.options.map((opt, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs hover:border-slate-400 cursor-pointer"
            >
              <span>{opt || `Option ${i + 1}`}</span>
              <span className="text-[10px] text-slate-400">0%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 12. Threads Quote Generator (QUOTED POST + COMMENT/ANGLE ≤ 500 CHARS)
// ---------------------------------------------------------------------------
function ThQuoteGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [quotedPost, setQuotedPost] = useState('Build in public. It keeps you accountable and attracts the exact people who care about your mission.');
  const [userComment, setUserComment] = useState('This changed everything for our team this year. When you stop hiding your mistakes, people actually want to help you win.');
  const [tone, setTone] = useState<ThreadsQuoteTone>('thoughtful');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateThreadsQuotePosts({ quotedPost, userComment, tone });
  }, [quotedPost, userComment, tone]);

  const handleGenerate = () => {
    if (!quotedPost.trim()) {
      setError('Please paste the post you want to quote.');
      return;
    }
    if (!userComment.trim()) {
      setError('Please enter your comment or angle about the quoted post.');
      return;
    }
    setError(null);
  };

  const handleReset = () => {
    setQuotedPost('Build in public. It keeps you accountable and attracts the exact people who care about your mission.');
    setUserComment('This changed everything for our team this year. When you stop hiding your mistakes, people actually want to help you win.');
    setTone('thoughtful');
    setError(null);
  };

  const copyAll = () => {
    const text = result.quotePosts.map((q, i) => `[Quote Post ${i + 1}]\n${q.text}\n`).join('\n---\n\n');
    onCopy(text, 'th-quote-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Quote className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Quote Post Drafts Disclosure
          </span>
          This tool structures quote-post text drafts combining your perspective with a reference to the quoted post inside 500 characters. It prepares text drafts only and never publishes to Threads.
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            The Post Being Quoted (Paste Text) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={quotedPost}
            onChange={(e) => {
              setQuotedPost(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste the post you are quoting..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Comment or Angle <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={userComment}
            onChange={(e) => {
              setUserComment(e.target.value);
              if (error) setError(null);
            }}
            placeholder="What do you want to say about it?"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ThreadsQuoteTone)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          >
            <option value="thoughtful">Thoughtful & In-depth 💭</option>
            <option value="bold">Bold & High Conviction 🔥</option>
            <option value="funny">Funny & Relatable 😂</option>
            <option value="supportive">Supportive & Validating 👏</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Quote Post Drafts
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result.quotePosts.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quote Post Drafts ({result.quotePosts.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-quote-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-quote-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.quotePosts.map((q, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Quote Draft {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {q.chars}/500 chars
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(q.text, `th-quote-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-quote-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-quote-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {q.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 13. Threads Thread Generator (SPLITS LONG TEXT INTO CONNECTED POSTS)
// ---------------------------------------------------------------------------
function ThThreadFormatter({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState(
    'Building a thriving community on Threads comes down to three repeatable habits. First, respond to every genuine reply in your notifications within the first hour. Threads prioritizes reply velocity, so keeping the conversation alive signals to the algorithm that your post is sparking real discussion.\n\nSecond, write opening hooks that ask an open-ended question rather than lecturing your audience. Nobody likes a know-it-all on their feed, but everyone loves being invited to share their own perspective.\n\nThird, format your thoughts into clean, bite-sized paragraphs without emoji clutter. High clarity always wins in the long run.',
  );

  const parts = useMemo(() => splitThreadsPost(input), [input]);
  const joined = parts.join('\n\n---\n\n');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Layers className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Multi-Post Connected Thread Formatter
          </span>
          Splits long articles, essays, or thoughts into connected numbered posts (1/N), ensuring every post strictly fits within Threads’ 500-character limit. This tool formats multi-post threads, distinct from the single Post Generator.
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Long Text or Article Body</span>
            <span className="font-mono text-slate-500">{countUnicodeChars(input)} Total Characters</span>
          </div>
          <textarea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste long text to split into connected Thread posts..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Split into {parts.length} Connected Post{parts.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={() => onCopy(joined, 'th-thread-all')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 font-semibold text-xs cursor-pointer shadow-sm"
          >
            {copiedKey === 'th-thread-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'th-thread-all' ? 'Thread Copied' : 'Copy All Posts'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {parts.map((p, i) => {
            const chars = countUnicodeChars(p);
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Thread Post {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {chars}/500 chars
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(p, `th-part-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === `th-part-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `th-part-${i}` ? 'Copied' : 'Copy Post'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {p}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 14. Threads Stylish Text Generator (DISTINCT TOOL - DECORATIVE BRACKETS & WINGS)
// ---------------------------------------------------------------------------
function ThStylishTextGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Threads Community');

  const list = useMemo(() => {
    return generateThreadsStylishText(input);
  }, [input]);

  const copyAll = () => {
    const text = list.map((item) => item.result).join('\n');
    onCopy(text, 'th-sty-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Decorative Text Embellishments & Borders (Distinct from Fonts)
          </span>
          Frames your actual typed text with aesthetic Japanese brackets, stars, wings, and borders. Distinct from alphanumeric Unicode font conversions.
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Type Your Text to Embellish
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Decorative Styles ({list.length})
          </span>
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
          >
            {copiedKey === 'th-sty-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'th-sty-all' ? 'All Copied' : 'Copy All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="truncate pr-2">
                <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">{item.name}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white select-all">{item.result}</span>
              </div>
              <button
                type="button"
                onClick={() => onCopy(item.result, item.id)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shrink-0 cursor-pointer"
              >
                {copiedKey === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 15. Threads Font Generator (DISTINCT TOOL - UNICODE ALPHABETS)
// ---------------------------------------------------------------------------
function ThFontGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Threads Discussion');

  const list = useMemo(() => {
    return generateThreadsUnicodeFonts(input);
  }, [input]);

  const copyAll = () => {
    const text = list.map((item) => item.result).join('\n');
    onCopy(text, 'th-fnt-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Unicode Mathematical Alphanumeric Font Transforms
          </span>
          Converts actual typed letters and numbers into real Unicode typographic alphabets (Bold Sans, Serif, Cursive Script, Monospace, Circled). Works on your actual text and preserves emojis. Distinct from decorative bracket styling.
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Type Your Text to Convert to Unicode Fonts
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Font Alphabets ({list.length})
          </span>
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
          >
            {copiedKey === 'th-fnt-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'th-fnt-all' ? 'All Copied' : 'Copy All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="truncate pr-2">
                <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">{item.name}</span>
                <span className="text-sm text-slate-900 dark:text-white select-all">{item.result}</span>
              </div>
              <button
                type="button"
                onClick={() => onCopy(item.result, item.id)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shrink-0 cursor-pointer"
              >
                {copiedKey === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 16 & 20. Threads Character Counters (Unicode-Aware, Emojis Count as 1)
// ---------------------------------------------------------------------------
function ThCharacterCounter({
  max,
  label,
  onCopy,
  copiedKey,
}: {
  max: number;
  label: string;
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}) {
  const [text, setText] = useState('Building thoughtful conversations on Threads with clean typography! 🚀');

  // Segmenter-aware counting: surrogate pair emojis count as 1 character!
  const charCount = useMemo(() => countUnicodeChars(text), [text]);
  const isOver = charCount > max;
  const remaining = max - charCount;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-900 dark:text-white">{label}</span>
        <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
          isOver
            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          {charCount} / {max} characters ({remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over limit`})
        </span>
      </div>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste or type text to check against the ${max}-character limit...`}
        className={`w-full rounded-xl border p-3.5 text-xs focus:outline-none ${
          isOver
            ? 'border-rose-500 focus:border-rose-600 bg-rose-50/20 dark:bg-rose-950/10'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-slate-900'
        }`}
      />

      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isOver ? (
            <span className="text-rose-600 font-bold flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              Exceeds {max}-character limit by {Math.abs(remaining)} character{Math.abs(remaining) === 1 ? '' : 's'}.
            </span>
          ) : (
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Fits within {max}-character limit ({remaining} characters left). Emojis counted accurately as 1 char.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onCopy(text, `th-cnt-${max}`)}
          className="inline-flex items-center gap-1 text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
        >
          {copiedKey === `th-cnt-${max}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedKey === `th-cnt-${max}` ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 17. Threads Engagement Rate Calculator
// ---------------------------------------------------------------------------
function ThEngagementCalculator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [followers, setFollowers] = useState('8000');
  const [likes, setLikes] = useState('350');
  const [replies, setReplies] = useState('45');
  const [reposts, setReposts] = useState('30');

  const result = useMemo(() => {
    return calculateThreadsEngagement({
      followers: Number(followers),
      likes: Number(likes),
      replies: Number(replies),
      reposts: Number(reposts),
    });
  }, [followers, likes, replies, reposts]);

  const handleReset = () => {
    setFollowers('8000');
    setLikes('350');
    setReplies('45');
    setReposts('30');
  };

  const copyResults = () => {
    if (result.status === 'invalid') return;
    const txt = `Threads Engagement Calculation:
Followers: ${followers}
Likes: ${likes} | Replies: ${replies} | Reposts: ${reposts}
Total Interactions: ${result.totalInteractions}
Engagement Rate: ${result.erPercent}%
Formula: ${result.formulaDisplay}
Tier: ${result.tier} (${result.tierNote})
(Manual entry only — no live Threads login)`;
    onCopy(txt, 'th-eng-copy');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Threads Engagement Rate Formula & Manual Entry Disclosure
          </span>
          <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            Engagement Rate (%) = ((Likes + Replies + Reposts) / Followers) × 100
          </code>
          <p className="mt-1">
            Manual entry only — runs privately inside your browser without connecting to or fetching live private account data from Threads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Followers <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Heart className="h-3 w-3 text-slate-400" />
            <span>Likes</span>
          </label>
          <input
            type="number"
            min={0}
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-slate-400" />
            <span>Replies</span>
          </label>
          <input
            type="number"
            min={0}
            value={replies}
            onChange={(e) => setReplies(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Repeat className="h-3 w-3 text-slate-400" />
            <span>Reposts</span>
          </label>
          <input
            type="number"
            min={0}
            value={reposts}
            onChange={(e) => setReposts(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Sample Inputs</span>
        </button>
      </div>

      {result.status === 'invalid' && result.error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.status === 'valid' && (
        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Engagement Metrics & Benchmark Tier
            </span>
            <button
              type="button"
              onClick={copyResults}
              className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-white font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'th-eng-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'th-eng-copy' ? 'Copied' : 'Copy Metrics'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Engagement Rate
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block mt-1">
                {result.erPercent}%
              </span>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                {result.tier}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Interactions
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                {result.totalInteractions.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Likes + Replies + Reposts</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Interactions / Follower
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                {(result.totalInteractions / (result.followers || 1)).toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Per Follower Ratio</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
              {result.formulaDisplay}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Benchmark Analysis: {result.tierNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 18 & 19. Threads Image Resizers (Accessible Upload + Real Canvas Processing)
// ---------------------------------------------------------------------------
function ThImageResizer({ isProfile }: { isProfile: boolean }) {
  // Stated sizes: Profile (400x400 / 1080x1080), Post (1080x1350 portrait 4:5, 1080x1080 square, 1080x1920 vertical)
  const [preset, setPreset] = useState<'portrait' | 'square' | 'vertical'>('portrait');
  const [scaleMode, setScaleMode] = useState<'cover' | 'contain'>('cover');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [srcInfo, setSrcInfo] = useState<{ name: string; size: number; w: number; h: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(2) + ' MB';
  };

  const dims = useMemo(() => {
    if (isProfile) {
      return { w: 400, h: 400, label: 'Threads Profile Picture (400 × 400 px, 1:1)' };
    }
    if (preset === 'square') {
      return { w: 1080, h: 1080, label: 'Threads Square Post (1080 × 1080 px, 1:1)' };
    }
    if (preset === 'vertical') {
      return { w: 1080, h: 1920, label: 'Threads Vertical Story/Post (1080 × 1920 px, 9:16)' };
    }
    return { w: 1080, h: 1350, label: 'Threads Portrait Feed Post (1080 × 1350 px, 4:5)' };
  }, [isProfile, preset]);

  const processImage = (file: File, mode: 'cover' | 'contain') => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError('File exceeds the 20 MB size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setSrcInfo({
          name: file.name,
          size: file.size,
          w: img.width,
          h: img.height,
        });

        const canvas = document.createElement('canvas');
        canvas.width = dims.w;
        canvas.height = dims.h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, dims.w, dims.h);

        let renderW = dims.w;
        let renderH = dims.h;
        let offsetX = 0;
        let offsetY = 0;

        if (mode === 'contain') {
          const scale = Math.min(dims.w / img.width, dims.h / img.height);
          renderW = img.width * scale;
          renderH = img.height * scale;
          offsetX = (dims.w - renderW) / 2;
          offsetY = (dims.h - renderH) / 2;
        } else {
          // Cover crop
          const scale = Math.max(dims.w / img.width, dims.h / img.height);
          renderW = img.width * scale;
          renderH = img.height * scale;
          offsetX = (dims.w - renderW) / 2;
          offsetY = (dims.h - renderH) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        setOutUrl(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => {
        setFileError('Failed to read and render the uploaded image.');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileError('No file was chosen. Please select an image.');
      return;
    }
    processImage(file, scaleMode);
  };

  const handleModeChange = (newMode: 'cover' | 'contain') => {
    setScaleMode(newMode);
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      processImage(file, newMode);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-900 dark:text-white" />
        <div>
          <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">
            Exact Specifications: {dims.label}
          </span>
          Resizes and exports your image directly inside your browser canvas with zero server uploads and zero watermarks (Max 20 MB).
        </div>
      </div>

      <div className="space-y-4">
        {/* Real Accessible Upload File Input */}
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="threads-resizer-file"
            className="relative inline-flex items-center gap-2 overflow-hidden cursor-pointer rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 shadow-sm"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{srcInfo ? 'Change Image' : 'Upload Image'}</span>
            <input
              ref={fileInputRef}
              id="threads-resizer-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              aria-label={srcInfo ? 'Change Image' : 'Upload Image'}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>

          {srcInfo && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <span>{srcInfo.name}</span>
              <span>·</span>
              <span>{srcInfo.w} × {srcInfo.h} px</span>
              <span>·</span>
              <span>{formatBytes(srcInfo.size)}</span>
            </div>
          )}
        </div>

        {fileError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Dimension & Scaling Presets */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {!isProfile && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Preset:</span>
              <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setPreset('portrait')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    preset === 'portrait' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Portrait 1080×1350 (4:5)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset('square')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    preset === 'square' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Square 1080×1080 (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset('vertical')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    preset === 'vertical' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Vertical 1080×1920 (9:16)
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Scaling:</span>
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => handleModeChange('cover')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  scaleMode === 'cover' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Fill & Crop (Cover)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('contain')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  scaleMode === 'contain' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Fit with Borders (Contain)
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        {outUrl && (
          <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resized Canvas Preview ({dims.w} × {dims.h} px)
              </span>
              <a
                href={outUrl}
                download={isProfile ? 'threads_profile_picture.jpg' : 'threads_post_image.jpg'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download JPG</span>
              </a>
            </div>

            <div className="flex justify-center bg-slate-950 rounded-xl p-4 overflow-hidden border border-slate-800">
              <img
                src={outUrl}
                alt="Resized Threads Output"
                className={`${isProfile ? 'h-64 w-64 rounded-full' : 'h-80 w-auto rounded'} object-contain shadow-md`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
