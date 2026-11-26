import React, { useState, useMemo, useRef } from 'react';
import {
  Copy,
  Check,
  Ghost,
  Sparkles,
  Download,
  RotateCcw,
  Upload,
  Info,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Search,
  Eye,
  MessageCircle,
  Share2,
  Trophy,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkle,
} from 'lucide-react';
import type { Tool } from '../../data/tools';
import {
  countUnicodeChars,
  validateSnapchatUsername,
  generateSnapchatUsernames,
  generateSnapchatCaptions,
  generateSnapchatStoryIdeas,
  calculateSnapchatStreak,
  calculateSnapchatEngagement,
  generateSnapchatSpotlightIdeas,
  generateSpotlightCaptions,
  generateSnapchatFilterNames,
  generateSnapchatLensIdeas,
  generateBitmojiOutfitIdeas,
  generateSnapchatBirthdayCaptions,
  SNAPCHAT_EMOJI_GUIDE,
  generateSnapchatCalendar,
  serializeSnapchatCalendarCsv,
  generateSnapchatBiosDetailed,
  generateSnapchatStylishText,
  generateSnapchatUnicodeFonts,
  computeSnapchatScoreStats,
  type SnapchatUsernameStyle,
  type SnapchatCaptionStyle,
  type SnapchatStoryType,
  type SpotlightVideoStyle,
  type SpotlightCaptionStyle,
  type SnapchatFilterStyle,
  type SnapchatLensType,
  type BitmojiStyle,
  type BitmojiOccasion,
  type BirthdayRelationship,
  type BirthdayCaptionStyle,
  type SnapchatCalendarCadence,
  type SnapchatContentMix,
  type SnapchatBioVibe,
  type SnapchatScoreLogEntry,
} from './snapchatHelpers';

interface Props {
  tool: Tool;
}

export function SnapchatToolsRunner({ tool }: Props) {
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
      <div className="border-b border-slate-200 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-slate-950 shadow-sm font-bold">
            <Ghost className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Deterministic browser utility · Zero AI · Zero external network calls · No Snapchat login required
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
        {tool.slug === 'snapchat-username-generator' && (
          <SnUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 2 */}
        {tool.slug === 'snapchat-caption-generator' && (
          <SnCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 3 */}
        {tool.slug === 'snapchat-story-idea-generator' && (
          <SnStoryIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 4 */}
        {tool.slug === 'snapchat-streak-calculator' && (
          <SnStreakCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 5 */}
        {tool.slug === 'snapchat-engagement-calculator' && (
          <SnEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 6 */}
        {tool.slug === 'snapchat-spotlight-idea-generator' && (
          <SnSpotlightIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 7 */}
        {tool.slug === 'snapchat-spotlight-caption-generator' && (
          <SnSpotlightCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 8 */}
        {tool.slug === 'snapchat-filter-name-generator' && (
          <SnFilterNameGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 9 */}
        {tool.slug === 'snapchat-lens-idea-generator' && (
          <SnLensIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 10 */}
        {tool.slug === 'snapchat-bitmoji-outfit-idea-generator' && (
          <SnBitmojiOutfitGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 11 */}
        {tool.slug === 'snapchat-birthday-caption-generator' && (
          <SnBirthdayCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 12 */}
        {tool.slug === 'snapchat-emoji-meaning-guide' && (
          <SnEmojiMeaningGuide onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 13 */}
        {tool.slug === 'snapchat-content-calendar-generator' && (
          <SnContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 14 */}
        {tool.slug === 'snapchat-bio-generator' && (
          <SnBioGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 15 */}
        {tool.slug === 'snapchat-username-format-checker' && (
          <SnUsernameChecker onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 16 */}
        {tool.slug === 'snapchat-stylish-text-generator' && (
          <SnStylishTextGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 17 */}
        {tool.slug === 'snapchat-font-generator' && (
          <SnFontGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 18 */}
        {tool.slug === 'snapchat-score-tracker-template' && (
          <SnScoreTracker onDownload={downloadFile} />
        )}

        {/* Tool 19 & 20 */}
        {(tool.slug === 'snapchat-story-image-resizer' || tool.slug === 'snapchat-profile-picture-resizer') && (
          <SnImageResizer toolSlug={tool.slug} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Snapchat Username Generator
// ---------------------------------------------------------------------------
function SnUsernameGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [keyword, setKeyword] = useState('Alex');
  const [style, setStyle] = useState<SnapchatUsernameStyle>('cool');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatUsernames({ keyword, style, count, variation });
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
    onCopy(text, 'sn-un-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Username Syntax & Availability Disclosure</span>
          All suggested usernames adhere strictly to official Snapchat format rules: 3–15 characters, starting with a letter, using only permitted characters (letters, numbers, underscores, periods, and hyphens), and ending without punctuation. Availability must be checked in the official Snapchat app — this tool checks syntax rules only and never claims live availability.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Name, Nickname, or Keyword <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Alex, photographer, skater"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Username Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SnapchatUsernameStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="cool">Cool / Brand</option>
            <option value="cute">Cute / Soft</option>
            <option value="funny">Funny / Meme</option>
            <option value="short">Short / Compact (3–8 Chars)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Number of Ideas
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Username Ideas</option>
            <option value={10}>10 Username Ideas</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
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
              Valid Snapchat Handle Suggestions ({result.usernames.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-un-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-un-all' ? 'All Copied' : 'Copy All'}</span>
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
                    {u.chars}/15
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(u.username, `sn-un-${i}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 shrink-0 cursor-pointer"
                >
                  {copiedKey === `sn-un-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `sn-un-${i}` ? 'Copied' : 'Copy'}</span>
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
// 2. Snapchat Caption Generator (≤ 80 Chars)
// ---------------------------------------------------------------------------
function SnCaptionGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('beach day with besties');
  const [style, setStyle] = useState<SnapchatCaptionStyle>('chill');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatCaptions({ topic, style, count, variation });
  }, [topic, style, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a moment, mood, or topic for your Snap caption.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('beach day with besties');
    setStyle('chill');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.captions.map((c) => c.text).join('\n');
    onCopy(text, 'sn-cap-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Story Caption Rule: 80-Character Bar Limit</span>
          Snapchat's classic horizontal text bar accommodates up to 80 characters per text block cleanly on standard phone screens. All captions generated below are strictly bounded within 80 characters with live character counts displayed.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Moment, Mood, or Occasion <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. golden hour iced matcha, gym workout, study grind"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Caption Vibe / Tone
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SnapchatCaptionStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="chill">Chill & Casual ☕</option>
            <option value="funny">Funny & Self-deprecating 💀</option>
            <option value="cute">Cute & Wholesome 🌸</option>
            <option value="savage">Savage & Confident 💅</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Captions</option>
            <option value={10}>10 Captions</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
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
              Short Snap Story Captions ({result.captions.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-cap-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-cap-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.captions.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {c.text}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-mono">
                    {c.chars}/80
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(c.text, `sn-cap-${i}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 shrink-0 cursor-pointer"
                >
                  {copiedKey === `sn-cap-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `sn-cap-${i}` ? 'Copied' : 'Copy'}</span>
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
// 3. Snapchat Story Idea Generator
// ---------------------------------------------------------------------------
function SnStoryIdeaGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('study vlog and coffee run');
  const [audience, setAudience] = useState('Close Friends');
  const [storyType, setStoryType] = useState<SnapchatStoryType>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatStoryIdeas({ topic, audience, storyType, count, variation });
  }, [topic, audience, storyType, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic or theme to generate filmable Story ideas.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('study vlog and coffee run');
    setAudience('Close Friends');
    setStoryType('any');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.ideas.map((idea, i) => `${i + 1}. ${idea.title}\n${idea.description}\nSticker: ${idea.interactiveSticker}\n`).join('\n');
    onCopy(text, 'sn-story-all');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Topic or Daily Theme <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. baking cookies, weekend hike, dorm room tour"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Audience Focus (Optional)
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Close Friends, Public Story"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Story Structure
          </label>
          <select
            value={storyType}
            onChange={(e) => setStoryType(e.target.value as SnapchatStoryType)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="any">Any Structure</option>
            <option value="day_in_life">Day in My Life</option>
            <option value="qna">Q&A / Ask Me Anything</option>
            <option value="behind_scenes">Behind the Scenes</option>
            <option value="challenge">Mini Challenge</option>
            <option value="poll">Interactive Poll</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Number of Ideas
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Story Concepts</option>
            <option value={10}>10 Story Concepts</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Story Ideas
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
              Filmable Multi-Snap Story Concepts ({result.ideas.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-story-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-story-all' ? 'All Copied' : 'Copy All'}</span>
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
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {idea.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                      {idea.snapCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(`${idea.title}\n${idea.description}\nSticker: ${idea.interactiveSticker}`, `sn-story-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                    >
                      {copiedKey === `sn-story-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `sn-story-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                  {idea.description}
                </p>

                <div className="pl-7 pt-1 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  <Sparkle className="h-3 w-3" />
                  <span>Suggested Sticker: {idea.interactiveSticker}</span>
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
// 4. Snapchat Streak Calculator
// ---------------------------------------------------------------------------
function SnStreakCalculator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  // Default to 10 days ago, last snap 12 hours ago
  const getDefaultDates = () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      start: `${tenDaysAgo.getFullYear()}-${pad(tenDaysAgo.getMonth() + 1)}-${pad(tenDaysAgo.getDate())}`,
      lastSnap: `${twelveHoursAgo.getFullYear()}-${pad(twelveHoursAgo.getMonth() + 1)}-${pad(twelveHoursAgo.getDate())}T${pad(twelveHoursAgo.getHours())}:${pad(twelveHoursAgo.getMinutes())}`,
    };
  };

  const initial = useMemo(getDefaultDates, []);
  const [startDate, setStartDate] = useState(initial.start);
  const [lastSnapDateTime, setLastSnapDateTime] = useState(initial.lastSnap);

  const result = useMemo(() => {
    return calculateSnapchatStreak({ startDate, lastSnapDateTime });
  }, [startDate, lastSnapDateTime]);

  const handleReset = () => {
    const def = getDefaultDates();
    setStartDate(def.start);
    setLastSnapDateTime(def.lastSnap);
  };

  const copySummary = () => {
    if (result.status === 'invalid') return;
    const txt = `Snapchat Streak Status:
Current Streak: ${result.streakDays} Days 🔥
Deadline to Snap: ${result.deadlineToDisplay}
Time Remaining: ${result.timeRemainingText}
Status: ${result.warningNote}
(Calculated based on entered dates — zero live login required)`;
    onCopy(txt, 'sn-streak-sum');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Streak Rule & Honest Calculation Disclosure</span>
          A Snapstreak requires both friends to send a photo or video snap (text chats do NOT count) at least once every 24 hours on consecutive days. This calculator uses real date math based entirely on the dates you enter and cannot read live streak data from Snapchat.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Streak Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Last Snap Exchanged (Date & Time) <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={lastSnapDateTime}
            onChange={(e) => setLastSnapDateTime(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
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
          <span>Reset Sample Dates</span>
        </button>
      </div>

      {result.status === 'invalid' && result.errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.errorMessage}</span>
        </div>
      )}

      {result.status !== 'invalid' && (
        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Live Streak Health Status
            </span>
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-streak-sum' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-streak-sum' ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Streak Duration
              </span>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <Flame className="h-5 w-5 text-amber-500 animate-bounce" />
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {result.streakDays}
                </span>
                <span className="text-xs font-medium text-slate-500">Days</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Next Snap Deadline
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-2">
                {result.deadlineToDisplay}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (24h from last snap)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Time Remaining
              </span>
              <span className={`text-base font-extrabold block mt-1.5 ${
                result.status === 'expired'
                  ? 'text-rose-600 dark:text-rose-400'
                  : result.status === 'urgent'
                  ? 'text-amber-600 dark:text-amber-400 animate-pulse'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {result.timeRemainingText}
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            result.status === 'expired'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : result.status === 'urgent'
              ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
          }`}>
            <span>{result.warningNote}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Snapchat Engagement Calculator
// ---------------------------------------------------------------------------
function SnEngagementCalculator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [views, setViews] = useState('1200');
  const [replies, setReplies] = useState('48');
  const [shares, setShares] = useState('18');

  const result = useMemo(() => {
    return calculateSnapchatEngagement({
      views: Number(views),
      replies: Number(replies),
      shares: Number(shares),
    });
  }, [views, replies, shares]);

  const handleReset = () => {
    setViews('1200');
    setReplies('48');
    setShares('18');
  };

  const copyResults = () => {
    if (result.status === 'invalid') return;
    const txt = `Snapchat Story Engagement Calculation:
Views: ${views}
Replies: ${replies} (Reply Rate: ${result.replyRatePercent}%)
Shares/Screenshots: ${shares} (Share Rate: ${result.shareRatePercent}%)
Total Interactions: ${result.totalInteractions}
Engagement Rate: ${result.engagementRatePercent}%
Formula: ${result.formulaDisplay}
Tier: ${result.benchmarkTier} (${result.benchmarkNote})
(Manual entry only — no live Snapchat login)`;
    onCopy(txt, 'sn-eng-sum');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Story Engagement Formula</span>
          <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[11px]">
            Engagement Rate (%) = ((Replies + Shares) / Story Views) × 100
          </code>
          <p className="mt-1">
            Manual entry only — runs purely inside your browser without connecting to or fetching live private analytics from Snapchat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>Story Views</span> <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Replies Received</span> <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={replies}
            onChange={(e) => setReplies(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Share2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Shares / Screenshots</span> <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
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
              Engagement Metrics & Breakdown
            </span>
            <button
              type="button"
              onClick={copyResults}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-eng-sum' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-eng-sum' ? 'Copied' : 'Copy Metrics'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Engagement Rate
              </span>
              <span className="text-3xl font-extrabold text-amber-500 block mt-1">
                {result.engagementRatePercent}%
              </span>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold">
                {result.benchmarkTier} Tier
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Interactions
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                {result.totalInteractions.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Replies + Shares</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Reply Ratio
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                {result.replyRatePercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Replies / Views</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Share Ratio
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                {result.shareRatePercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Shares / Views</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
              {result.formulaDisplay}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Benchmark Analysis: {result.benchmarkNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Snapchat Spotlight Idea Generator
// ---------------------------------------------------------------------------
function SnSpotlightIdeaGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('coffee making hacks');
  const [videoStyle, setVideoStyle] = useState<SpotlightVideoStyle>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatSpotlightIdeas({ topic, videoStyle, count, variation });
  }, [topic, videoStyle, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic or niche to generate filmable Spotlight ideas.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('coffee making hacks');
    setVideoStyle('any');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.ideas.map((item, i) => `${i + 1}. ${item.title}\nHook: ${item.first3SecHook}\nStoryboard: ${item.storyboard}\nDuration: ${item.recommendedDuration}\nTags: ${item.tags.join(' ')}\n`).join('\n');
    onCopy(text, 'sn-spot-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Spotlight Rule: Short Vertical Videos Up to 60 Seconds</span>
          Spotlight videos are 9:16 vertical videos up to 60 seconds with engaging audio. These are text ideas and storyboards only — this tool does not record, upload, or publish content to Snapchat Spotlight.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Video Niche or Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. skateboarding tricks, street food review, DIY room decor"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Video Style
          </label>
          <select
            value={videoStyle}
            onChange={(e) => setVideoStyle(e.target.value as SpotlightVideoStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="any">Any Style</option>
            <option value="life_hack">Life Hack / Pro Tip</option>
            <option value="funny">Funny / Relatable</option>
            <option value="challenge">Speedrun Challenge</option>
            <option value="reaction">Reaction / Review</option>
            <option value="talent">Talent / Satisfying</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Ideas Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Video Ideas</option>
            <option value={10}>10 Video Ideas</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Spotlight Ideas
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
              Spotlight Vertical Video Concepts ({result.ideas.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-spot-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-spot-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.ideas.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                      {item.recommendedDuration}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(`${item.title}\nHook: ${item.first3SecHook}\nStoryboard: ${item.storyboard}\nTags: ${item.tags.join(' ')}`, `sn-spot-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                    >
                      {copiedKey === `sn-spot-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `sn-spot-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pl-7 space-y-1">
                  <p className="text-amber-700 dark:text-amber-400 font-semibold">
                    First 3s Hook: {item.first3SecHook}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Storyboard: {item.storyboard}
                  </p>
                  <p className="text-slate-400 text-[11px] font-mono pt-1">
                    {item.tags.join(' ')}
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
// 7. Snapchat Spotlight Caption Generator
// ---------------------------------------------------------------------------
function SnSpotlightCaptionGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [topic, setTopic] = useState('my dog trying to catch a bubble');
  const [style, setStyle] = useState<SpotlightCaptionStyle>('funny');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSpotlightCaptions({ topic, style, count, variation });
  }, [topic, style, count, variation]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a video topic or moment for your Spotlight caption.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTopic('my dog trying to catch a bubble');
    setStyle('funny');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.captions.map((c) => c.text).join('\n');
    onCopy(text, 'sn-spotcap-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Spotlight Discovery Captions Disclosure</span>
          These are copy-ready text captions prepared with trending tags. This tool prepares text only and never uploads or publishes to Snapchat Spotlight.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Spotlight Video Topic or Moment <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. failing a skateboard trick, unboxing tech, funny cat zoomies"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Caption Tone
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SpotlightCaptionStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="funny">Funny / Meme 💀</option>
            <option value="relatable">Relatable / Storytime 🤝</option>
            <option value="bold">Bold / High Energy 🔥</option>
            <option value="cute">Cute / Wholesome 🌸</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Captions</option>
            <option value={10}>10 Captions</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Spotlight Captions
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
              Spotlight Captions ({result.captions.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-spotcap-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-spotcap-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.captions.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {c.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {c.chars} ch
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(c.text, `sn-spotcap-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                  >
                    {copiedKey === `sn-spotcap-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `sn-spotcap-${i}` ? 'Copied' : 'Copy'}</span>
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
// 8. Snapchat Filter Name Generator
// ---------------------------------------------------------------------------
function SnFilterNameGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [event, setEvent] = useState("Sarah's 21st Birthday");
  const [style, setStyle] = useState<SnapchatFilterStyle>('fun');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatFilterNames({ event, style, count, variation });
  }, [event, style, count, variation]);

  const handleGenerate = () => {
    if (!event.trim()) {
      setError('Please enter an event, party, or location name for your Snapchat Geofilter.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setEvent("Sarah's 21st Birthday");
    setStyle('fun');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.names.map((n) => n.name).join('\n');
    onCopy(text, 'sn-flt-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Community Geofilter Name Disclosure</span>
          This tool generates text name ideas for community geofilters and on-demand party filters. It does not design graphic artwork or submit filters to Snap Inc.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Event, Party, or Location <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Liam's Graduation, Smith Wedding, Malibu Beach Party"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Filter Typography Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SnapchatFilterStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="fun">Fun & Celebratory 🎉</option>
            <option value="elegant">Elegant & Formal 🕊️</option>
            <option value="bold">Bold & Modern 🔥</option>
            <option value="cute">Cute & Playful 🌸</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Filter Names</option>
            <option value={10}>10 Filter Names</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Filter Names
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

      {result.names.length > 0 && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Filter Title Ideas ({result.names.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-flt-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-flt-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.names.map((n, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {n.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">{n.chars} ch</span>
                  <button
                    type="button"
                    onClick={() => onCopy(n.name, `sn-flt-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                  >
                    {copiedKey === `sn-flt-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `sn-flt-${i}` ? 'Copied' : 'Copy'}</span>
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
// 9. Snapchat Lens Idea Generator
// ---------------------------------------------------------------------------
function SnLensIdeaGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [theme, setTheme] = useState('Cyberpunk Anime');
  const [lensType, setLensType] = useState<SnapchatLensType>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatLensIdeas({ theme, lensType, count, variation });
  }, [theme, lensType, count, variation]);

  const handleGenerate = () => {
    if (!theme.trim()) {
      setError('Please enter a theme or occasion to generate AR lens concepts.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setTheme('Cyberpunk Anime');
    setLensType('any');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.concepts.map((c, i) => `${i + 1}. ${c.name} (${c.type})\nTrigger: ${c.trigger}\nVisual Effect: ${c.visualEffect}\nAudio: ${c.audioFeedback}\n`).join('\n');
    onCopy(text, 'sn-lens-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Augmented Reality (AR) Lens Concepts Disclosure</span>
          This tool generates creative AR concepts and interaction mechanics for Lens Studio creators. It does not build 3D assets or compile lenses into Snapchat.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Lens Theme or Occasion <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Halloween Monsters, Neon Y2K, Music Festival Aura"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Lens AR Category
          </label>
          <select
            value={lensType}
            onChange={(e) => setLensType(e.target.value as SnapchatLensType)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="any">Any AR Category</option>
            <option value="face_effect">Face Effect / Mesh</option>
            <option value="world_effect">World Effect / Portal</option>
            <option value="game">Interactive Game Lens</option>
            <option value="try_on">3D Virtual Try-On</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Number of Concepts
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Concepts</option>
            <option value={10}>10 Concepts</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Lens Ideas
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

      {result.concepts.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              AR Lens Specifications & Triggers ({result.concepts.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-lens-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-lens-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {result.concepts.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                      {c.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(`${c.name}\nTrigger: ${c.trigger}\nVisual Effect: ${c.visualEffect}\nAudio: ${c.audioFeedback}`, `sn-lens-${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                    >
                      {copiedKey === `sn-lens-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `sn-lens-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pl-7 space-y-1">
                  <p className="text-amber-700 dark:text-amber-400 font-semibold">
                    Trigger: {c.trigger}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Visual Effect: {c.visualEffect}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Audio Feedback: {c.audioFeedback}
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
// 10. Snapchat Bitmoji Outfit Idea Generator
// ---------------------------------------------------------------------------
function SnBitmojiOutfitGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [style, setStyle] = useState<BitmojiStyle>('streetwear');
  const [occasion, setOccasion] = useState<BitmojiOccasion>('everyday');
  const [colors, setColors] = useState('black, olive green and white');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);

  const result = useMemo(() => {
    return generateBitmojiOutfitIdeas({ style, occasion, colors, count, variation });
  }, [style, occasion, colors, count, variation]);

  const handleGenerate = () => {
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setStyle('streetwear');
    setOccasion('everyday');
    setColors('black, olive green and white');
    setCount(5);
    setVariation(0);
  };

  const copyAll = () => {
    const text = result.outfits.map((o, i) => `${i + 1}. ${o.name}\nTop: ${o.top}\nBottom: ${o.bottom}\nShoes: ${o.shoes}\nOuterwear: ${o.outerwear}\nAccessory: ${o.accessory}\nColors: ${o.palette}\n`).join('\n');
    onCopy(text, 'sn-bit-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Bitmoji Wardrobe Styling Template Disclosure</span>
          This tool generates curated outfit combinations and accessory ideas inspired by current fashion trends. It operates independently without Bitmoji API access or live avatar editing.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Aesthetic Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as BitmojiStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="streetwear">Streetwear & Hype</option>
            <option value="casual">Cozy & Casual</option>
            <option value="sporty">Athletic & Sporty</option>
            <option value="formal">Sharp & Formal</option>
            <option value="cute">Cute & Pastel</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Occasion
          </label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value as BitmojiOccasion)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="everyday">Everyday / Casual</option>
            <option value="party">Night Out / Party</option>
            <option value="date">Date Night</option>
            <option value="gym">Gym / Workout</option>
            <option value="work">School / Work</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Color Palette (Optional)
          </label>
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="e.g. pastel pink & cream"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Outfits Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Outfit Ideas</option>
            <option value={10}>10 Outfit Ideas</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Outfit Combinations
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Outfit Combinations ({result.outfits.length})
          </span>
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            {copiedKey === 'sn-bit-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'sn-bit-all' ? 'All Copied' : 'Copy All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.outfits.map((o, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {o.name}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(`${o.name}\nTop: ${o.top}\nBottom: ${o.bottom}\nShoes: ${o.shoes}\nOuterwear: ${o.outerwear}\nAccessory: ${o.accessory}`, `sn-bit-${i}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                >
                  {copiedKey === `sn-bit-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `sn-bit-${i}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1 text-slate-600 dark:text-slate-300">
                <div><strong className="text-slate-800 dark:text-slate-200">Top:</strong> {o.top}</div>
                <div><strong className="text-slate-800 dark:text-slate-200">Bottom:</strong> {o.bottom}</div>
                <div><strong className="text-slate-800 dark:text-slate-200">Shoes:</strong> {o.shoes}</div>
                <div><strong className="text-slate-800 dark:text-slate-200">Outerwear:</strong> {o.outerwear}</div>
                <div><strong className="text-slate-800 dark:text-slate-200">Accessory:</strong> {o.accessory}</div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium pt-1">
                  Palette: {o.palette}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 11. Snapchat Birthday Caption Generator (≤ 80 Chars)
// ---------------------------------------------------------------------------
function SnBirthdayCaptionGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [name, setName] = useState('Emma');
  const [relationship, setRelationship] = useState<BirthdayRelationship>('best_friend');
  const [style, setStyle] = useState<BirthdayCaptionStyle>('sweet');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatBirthdayCaptions({ name, relationship, style, count, variation });
  }, [name, relationship, style, count, variation]);

  const handleGenerate = () => {
    if (!name.trim()) {
      setError('Please enter the birthday person’s name.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setName('Emma');
    setRelationship('best_friend');
    setStyle('sweet');
    setCount(10);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.captions.map((c) => c.text).join('\n');
    onCopy(text, 'sn-bday-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Birthday Caption Rule: ≤80 Characters</span>
          All birthday captions generated below are guaranteed to fit within Snapchat's 80-character horizontal text bar with live character counting.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Birthday Person’s Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Emma, Dave, Sarah"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Relationship
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as BirthdayRelationship)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="best_friend">Best Friend (BFF)</option>
            <option value="friend">Friend</option>
            <option value="partner">Partner / Crush</option>
            <option value="sibling">Sibling</option>
            <option value="family">Family Member</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tone / Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as BirthdayCaptionStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="sweet">Sweet & Cute 🎂</option>
            <option value="funny">Funny & Teasing 😂</option>
            <option value="savage">Savage & Iconic 💅</option>
            <option value="heartfelt">Heartfelt & Deep 🤍</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Captions</option>
            <option value={10}>10 Captions</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Birthday Captions
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
              Birthday Snap Captions ({result.captions.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-bday-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-bday-all' ? 'All Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {result.captions.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {c.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-mono">
                    {c.chars}/80
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(c.text, `sn-bday-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                  >
                    {copiedKey === `sn-bday-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `sn-bday-${i}` ? 'Copied' : 'Copy'}</span>
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
// 12. Snapchat Emoji Meaning Guide (Reference Directory)
// ---------------------------------------------------------------------------
function SnEmojiMeaningGuide({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredEmojis = useMemo(() => {
    return SNAPCHAT_EMOJI_GUIDE.filter((item) => {
      const matchesSearch =
        item.emoji.includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Official Friend Emoji Reference Directory</span>
          Snapchat places emojis next to friend names in your chat feed based on how frequently you snap each other. Use this searchable reference guide to see what each emoji means, how to unlock it, and how it is lost. Note: emoji meanings reflect Snapchat’s official conventions and may update with app releases.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by emoji, name, or meaning (e.g. BFF, heart, streak)..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 pr-3.5 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Best Friends', 'Streaks', 'Milestones', 'Other'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredEmojis.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none" role="img" aria-label={item.name}>
                  {item.emoji}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.name}
                  </h3>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`${item.emoji} ${item.name}: ${item.meaning}`, item.id)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
              >
                {copiedKey === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {item.meaning}
            </p>

            <div className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
              <div>
                <strong className="text-emerald-700 dark:text-emerald-400">How to get it:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{item.howToGet}</span>
              </div>
              <div>
                <strong className="text-rose-600 dark:text-rose-400">How to lose it:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{item.howToLose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmojis.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          No Snapchat friend emojis found matching "{searchTerm}". Try searching for heart, streak, or besties.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 13. Snapchat Content Calendar Generator
// ---------------------------------------------------------------------------
function SnContentCalendarGenerator({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const getNextMonday = () => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    return d.toISOString().slice(0, 10);
  };

  const [topic, setTopic] = useState('Vintage Thrifting & Sustainable Fashion');
  const [postsPerWeek, setPostsPerWeek] = useState<SnapchatCalendarCadence>(5);
  const [startDate, setStartDate] = useState(getNextMonday());
  const [contentMix, setContentMix] = useState<SnapchatContentMix>('mixed');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatCalendar({ topic, postsPerWeek, startDate, contentMix });
  }, [topic, postsPerWeek, startDate, contentMix]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a topic or focus for your Snapchat content calendar.');
      return;
    }
    setError(null);
  };

  const handleReset = () => {
    setTopic('Vintage Thrifting & Sustainable Fashion');
    setPostsPerWeek(5);
    setStartDate(getNextMonday());
    setContentMix('mixed');
    setError(null);
  };

  const copySchedule = () => {
    const text = result.entries.map((e) => `[${e.dateStr} - ${e.dayOfWeek}] (${e.format}) ${e.title}\nConcept: ${e.concept}\nTime: ${e.bestTime} | Tag/Sticker: ${e.suggestedStickerOrTag}\n`).join('\n');
    onCopy(text, 'sn-cal-all');
  };

  const downloadCsv = () => {
    const csv = serializeSnapchatCalendarCsv(result.entries);
    onDownload(csv, `snapchat_calendar_${startDate}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Planning Tool Disclosure</span>
          This tool generates strategic Story & Spotlight content schedules. It is a planning template only and does not schedule or publish snaps to Snapchat.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Content Topic or Theme <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Fitness workouts, coding boot camp, coffee reviews"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Posting Cadence
          </label>
          <select
            value={postsPerWeek}
            onChange={(e) => setPostsPerWeek(Number(e.target.value) as SnapchatCalendarCadence)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={2}>2 Posts / Week</option>
            <option value={3}>3 Posts / Week</option>
            <option value={5}>5 Posts / Week (Recommended)</option>
            <option value={7}>7 Posts / Week (Daily)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Calendar Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Content Mix
          </label>
          <select
            value={contentMix}
            onChange={(e) => setContentMix(e.target.value as SnapchatContentMix)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="mixed">Mixed (Stories + Spotlight)</option>
            <option value="stories">Stories Only</option>
            <option value="spotlight">Spotlight Only</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
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
                className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                {copiedKey === 'sn-cal-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'sn-cal-all' ? 'Copied' : 'Copy Plan'}</span>
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
                  <th className="p-3">Format</th>
                  <th className="p-3">Post Title & Concept</th>
                  <th className="p-3">Best Time</th>
                  <th className="p-3">Stickers / Tags</th>
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.format === 'Story'
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          : 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300'
                      }`}>
                        {e.format}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{e.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{e.concept}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-300 text-[11px]">
                      {e.bestTime}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px]">
                      {e.suggestedStickerOrTag}
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
// 14. Snapchat Bio Generator (≤ 150 Chars)
// ---------------------------------------------------------------------------
function SnBioGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [handleOrName, setHandleOrName] = useState('Alex');
  const [focus, setFocus] = useState('Daily Vlogs & Skater Life');
  const [vibe, setVibe] = useState<SnapchatBioVibe>('casual');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    return generateSnapchatBiosDetailed({ handleOrName, focus, vibe, count, variation });
  }, [handleOrName, focus, vibe, count, variation]);

  const handleGenerate = () => {
    if (!focus.trim()) {
      setError('Please enter what you share or do on Snapchat.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  const handleReset = () => {
    setHandleOrName('Alex');
    setFocus('Daily Vlogs & Skater Life');
    setVibe('casual');
    setCount(5);
    setVariation(0);
    setError(null);
  };

  const copyAll = () => {
    const text = result.bios.map((b) => b.text).join('\n');
    onCopy(text, 'sn-bio-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Snapchat Public Profile Bio Limit: ≤150 Characters</span>
          Snapchat bios have a 150-character limit. All generated bios below are tailored to your focus and guaranteed within the 150-character limit.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Display Name or Greeting
          </label>
          <input
            type="text"
            value={handleOrName}
            onChange={(e) => setHandleOrName(e.target.value)}
            placeholder="e.g. Alex, Sam, @snapalex"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            What You Share / Focus <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={focus}
            onChange={(e) => {
              setFocus(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. college gym vlogs, vintage camera photography, tech tips"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Bio Tone & Vibe
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as SnapchatBioVibe)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="casual">Casual & Friendly 👻</option>
            <option value="creator">Creator & Spotlight 🎬</option>
            <option value="minimal">Minimalist & Clean 🕊️</option>
            <option value="aesthetic">Aesthetic & Moody ✨</option>
            <option value="fun">Fun & Chaotic 😂</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Variations Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 5 | 10)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value={5}>5 Bios</option>
            <option value={10}>10 Bios</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer shadow-sm"
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
              Snapchat Public Profile Bios ({result.bios.length})
            </span>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {copiedKey === 'sn-bio-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'sn-bio-all' ? 'All Copied' : 'Copy All'}</span>
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
                    onClick={() => onCopy(b.text, `sn-bio-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
                  >
                    {copiedKey === `sn-bio-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `sn-bio-${i}` ? 'Copied' : 'Copy'}</span>
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
// 15. Snapchat Username Format Checker
// ---------------------------------------------------------------------------
function SnUsernameChecker({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [inputHandle, setInputHandle] = useState('creator_alex');

  const result = useMemo(() => {
    return validateSnapchatUsername(inputHandle);
  }, [inputHandle]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">FORMAT-ONLY VALIDATION DISCLOSURE</span>
          This tool evaluates Snapchat username syntax and character constraints in real time according to Snapchat's developer guidelines. It checks format compliance only and cannot verify whether a username is currently taken or available on Snapchat. Live handle availability must always be confirmed directly in the Snapchat app.
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Snapchat Handle to Verify
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">@</span>
          <input
            type="text"
            value={inputHandle}
            onChange={(e) => setInputHandle(e.target.value)}
            placeholder="Type a username..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-8 pr-3.5 py-2.5 text-sm font-mono focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {result.valid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Valid Snapchat Username Format
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 text-xs font-bold">
                <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Invalid Snapchat Username Format
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-500">
            {result.charCount} / 15 chars
          </span>
        </div>

        <div className="space-y-3">
          {result.checks.map((rule) => (
            <div
              key={rule.id}
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                rule.passed
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  {rule.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  )}
                  <span>{rule.label}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  rule.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {rule.passed ? 'Pass' : 'Fail'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] pl-6">
                {rule.explanation}
              </p>
              {!rule.passed && rule.fixSuggestion && (
                <p className="text-amber-700 dark:text-amber-400 text-[11px] font-medium pl-6">
                  Tip: {rule.fixSuggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 16. Snapchat Stylish Text Generator (DISTINCT TOOL - DECORATIVE BRACKETS & EMOJIS)
// ---------------------------------------------------------------------------
function SnStylishTextGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Snapchat Story');

  const list = useMemo(() => {
    return generateSnapchatStylishText(input);
  }, [input]);

  const copyAll = () => {
    const text = list.map((item) => item.result).join('\n');
    onCopy(text, 'sn-sty-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Decorative Text Embellishments & Borders</span>
          Styles your typed text with artistic Japanese brackets, sparkle stars, wings, and borders. Copy and paste straight into your Snap captions, bio, or Display Name.
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Type Your Text to Decorate
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
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
            className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            {copiedKey === 'sn-sty-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'sn-sty-all' ? 'All Copied' : 'Copy All'}</span>
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
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 shrink-0 cursor-pointer"
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
// 17. Snapchat Font Generator (DISTINCT TOOL - UNICODE ALPHABETS)
// ---------------------------------------------------------------------------
function SnFontGenerator({ onCopy, copiedKey }: { onCopy: (t: string, k: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Snapchat Highlights');

  const list = useMemo(() => {
    return generateSnapchatUnicodeFonts(input);
  }, [input]);

  const copyAll = () => {
    const text = list.map((item) => item.result).join('\n');
    onCopy(text, 'sn-fnt-all');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Unicode Font Alphabets</span>
          Converts typed text into real Unicode mathematical and alphanumeric glyphs (Bold Sans, Serif, Cursive Script, Monospace, Double-Struck). Distinct from decorative styling; compatible with Snapchat display names and captions.
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
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
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
            className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            {copiedKey === 'sn-fnt-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'sn-fnt-all' ? 'All Copied' : 'Copy All'}</span>
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
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 shrink-0 cursor-pointer"
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
// 18. Snapchat Score Tracker Template
// ---------------------------------------------------------------------------
function SnScoreTracker({ onDownload }: { onDownload: (c: string, f: string, m: string) => void }) {
  const [entries, setEntries] = useState<SnapchatScoreLogEntry[]>([
    { id: '1', date: '2026-11-01', score: 142100, note: 'Initial milestone' },
    { id: '2', date: '2026-11-08', score: 144500, note: 'Active streak week' },
    { id: '3', date: '2026-11-15', score: 147800, note: 'Weekend roadtrip snaps' },
    { id: '4', date: '2026-11-22', score: 151200, note: 'Crossed 150k!' },
  ]);

  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [scoreInput, setScoreInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => computeSnapchatScoreStats(entries), [entries]);

  const handleSave = () => {
    setFormError(null);
    const scoreNum = parseInt(scoreInput.trim(), 10);
    if (!dateInput) {
      setFormError('Please select a valid date for this log entry.');
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 0) {
      setFormError('Please enter a valid positive Snap Score.');
      return;
    }

    if (editingId) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, date: dateInput, score: scoreNum, note: noteInput.trim() } : e)),
      );
      setEditingId(null);
    } else {
      const newEntry: SnapchatScoreLogEntry = {
        id: Date.now().toString(),
        date: dateInput,
        score: scoreNum,
        note: noteInput.trim(),
      };
      setEntries((prev) => [...prev, newEntry]);
    }

    setScoreInput('');
    setNoteInput('');
  };

  const handleEdit = (entry: SnapchatScoreLogEntry) => {
    setEditingId(entry.id);
    setDateInput(entry.date);
    setScoreInput(entry.score.toString());
    setNoteInput(entry.note || '');
    setFormError(null);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setScoreInput('');
      setNoteInput('');
    }
  };

  const handleDownloadCsv = () => {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const header = ['Date', 'Snap Score', 'Milestone Note'];
    const rows = sorted.map((e) => [e.date, e.score, `"${(e.note || '').replace(/"/g, '""')}"`]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    onDownload(csv, `snapchat_score_history.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Manual Entry Score Tracker Disclosure</span>
          This tool is a client-side personal log to track how your Snap Score grows over time. It relies 100% on manual entries from your profile screen, requires zero login credentials, and never connects to or fetches live scores from Snapchat.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Current Score</span>
          <span className="text-xl font-extrabold text-amber-500 block mt-1">{stats.currentScore.toLocaleString()}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Net Increase</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">+{stats.netGain.toLocaleString()}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Avg / Entry</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">+{stats.averageGainPerEntry.toLocaleString()}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Days Tracked</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">{stats.daysSpan} Days</span>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
          {editingId ? 'Edit Score Entry' : 'Log New Snap Score'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Snap Score Shown on Profile
            </label>
            <input
              type="number"
              min={0}
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              placeholder="e.g. 153400"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Milestone / Notes (Optional)
            </label>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. active streak with Sam"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {formError && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {formError}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{editingId ? 'Update Entry' : 'Add to Log'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setScoreInput('');
                setNoteInput('');
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Recorded Score History ({entries.length} entries)
          </span>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV History</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Snap Score</th>
                <th className="p-3">Notes / Milestone</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{entry.date}</td>
                  <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{entry.note || '—'}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(entry)}
                      className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    No entries recorded yet. Add your current Snap Score above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 19 & 20. Snapchat Image Resizers (Accessible File Input + Real Canvas Processing)
// ---------------------------------------------------------------------------
function SnImageResizer({ toolSlug }: { toolSlug: string }) {
  const isProfile = toolSlug.includes('profile');
  const dims = isProfile
    ? { w: 400, h: 400, label: 'Snapchat Profile Picture (400 × 400 px, 1:1)' }
    : { w: 1080, h: 1920, label: 'Snapchat Story Graphic (1080 × 1920 px, 9:16)' };

  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [srcInfo, setSrcInfo] = useState<{ name: string; size: number; w: number; h: number } | null>(null);
  const [scaleMode, setScaleMode] = useState<'cover' | 'contain'>('cover');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(2) + ' MB';
  };

  const processImage = (file: File, mode: 'cover' | 'contain') => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, or WEBP).');
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
        ctx.fillStyle = '#000000';
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
      setFileError('No file was chosen. Please pick an image.');
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
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold block mb-0.5">Exact Specifications: {dims.label}</span>
          Resizes and exports your image directly inside your browser canvas with zero server uploads and zero quality compression artifacts.
        </div>
      </div>

      <div className="space-y-4">
        {/* Real, Accessible File Input with visually-hidden focusable container */}
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="snap-resizer-file"
            className="relative inline-flex items-center gap-2 overflow-hidden cursor-pointer rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 shadow-sm"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{srcInfo ? 'Change Image' : 'Upload Image'}</span>
            <input
              ref={fileInputRef}
              id="snap-resizer-file"
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

        {/* Scaling Mode Controls */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Scaling Mode:</span>
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => handleModeChange('cover')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                scaleMode === 'cover'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Fill & Crop (Cover)
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('contain')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                scaleMode === 'contain'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Fit with Borders (Contain)
            </button>
          </div>
        </div>

        {/* Live Canvas Preview & Download */}
        {outUrl && (
          <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resized Canvas Preview ({dims.w} × {dims.h} px)
              </span>
              <a
                href={outUrl}
                download={isProfile ? 'snapchat_profile_picture.jpg' : 'snapchat_story_graphic.jpg'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download JPG</span>
              </a>
            </div>

            <div className="flex justify-center bg-slate-950 rounded-xl p-4 overflow-hidden border border-slate-800">
              <img
                src={outUrl}
                alt="Resized Snapchat Graphic"
                className={`${isProfile ? 'h-64 w-64 rounded-full' : 'h-80 w-auto rounded'} object-contain shadow-md`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
