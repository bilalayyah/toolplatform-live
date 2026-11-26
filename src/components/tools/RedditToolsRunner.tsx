import React, {useState, useMemo} from 'react';
import {
  Copy,
  Check,
  MessageSquare,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  FileText,
  FileCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  countUnicodeChars,
  generateSubredditNames,
  generateSubredditDescriptions,
  generateRedditFlairs,
  calculateRedditEngagement,
  generateRedditPostIdeas,
  generateRedditQuestions,
  formatRedditPoll,
  generateRandomRedditPostIdeas,
  checkRedditUsernameFormat,
  convertTextToRedditMarkdown,
  convertRedditMarkdownToHtml,
  generateRedditCalendar,
  serializeRedditCalendarCsv,
  applyRedditMarkdownFormat,
  formatRedditText,
  calculateRedditKarma,
  pickRedditCommentWinners,
  REDDIT_LIMITS,
  type SubredditStyle,
  type SubredditDescriptionTone,
  type RedditFlairStyle,
  type RedditPostType,
  type RedditQuestionStyle,
  type RedditPollDuration,
  type RedditCalendarCadence,
  type RedditContentMix,
  type MarkdownFormatAction,
  type TextFormatAction,
} from './redditHelpers';

interface Props {
  tool: Tool;
}

export function RedditToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], {type: mimeType});
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4500]/10 text-[#FF4500]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser utility · Zero AI · Zero external network calls · No Reddit login required
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
        {tool.slug === 'reddit-subreddit-name-generator' && (
          <SubredditNameGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 2 */}
        {tool.slug === 'reddit-subreddit-description-generator' && (
          <SubredditDescriptionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 3 */}
        {tool.slug === 'reddit-flair-generator' && (
          <RedditFlairGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 4 */}
        {tool.slug === 'reddit-engagement-rate-calculator' && (
          <RedditEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 5 */}
        {tool.slug === 'reddit-post-idea-generator' && (
          <RedditPostIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 6 */}
        {tool.slug === 'reddit-question-generator' && (
          <RedditQuestionGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 7 */}
        {tool.slug === 'reddit-poll-generator' && (
          <RedditPollGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 8 */}
        {tool.slug === 'reddit-random-post-idea-generator' && (
          <RedditRandomPostIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 9 */}
        {tool.slug === 'reddit-username-checker' && (
          <RedditUsernameChecker onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 10 */}
        {tool.slug === 'reddit-text-to-markdown-converter' && (
          <RedditTextToMarkdownConverter onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 11 */}
        {tool.slug === 'reddit-markdown-to-html-converter' && (
          <RedditMarkdownToHtmlConverter onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 12 */}
        {tool.slug === 'reddit-content-calendar-generator' && (
          <RedditContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 13 */}
        {tool.slug === 'reddit-markdown-formatter' && (
          <RedditMarkdownFormatter onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 14 */}
        {tool.slug === 'reddit-text-formatter' && (
          <RedditTextFormatter onCopy={copyText} copiedKey={copiedKey} onDownload={downloadFile} />
        )}

        {/* Tool 15 */}
        {tool.slug === 'reddit-post-character-counter' && (
          <RedditPostCharacterCounter onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 16 */}
        {tool.slug === 'reddit-title-character-counter' && (
          <RedditTitleCharacterCounter onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 17 */}
        {tool.slug === 'reddit-karma-calculator' && (
          <RedditKarmaCalculator onCopy={copyText} copiedKey={copiedKey} />
        )}

        {/* Tool 18 */}
        {tool.slug === 'reddit-comment-picker' && (
          <RedditCommentPicker onCopy={copyText} copiedKey={copiedKey} />
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// 1. Reddit Subreddit Name Generator
// ===========================================================================
function SubredditNameGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [keywords, setKeywords] = useState('mechanical keyboards');
  const [style, setStyle] = useState<SubredditStyle>('descriptive');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  const result = useMemo(() => {
    if (!hasGenerated) return { items: [] };
    return generateSubredditNames({ keywords, style, count, variation });
  }, [keywords, style, count, variation, hasGenerated]);

  const handleGenerate = () => {
    setHasGenerated(true);
    setVariation(0);
  };

  const handleRegenerate = () => {
    setHasGenerated(true);
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setKeywords('');
    setStyle('descriptive');
    setCount(10);
    setVariation(0);
    setHasGenerated(false);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i) => i.formattedName).join('\n');
    onCopy(all, 'subnames-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Format compliance only:</strong> Subreddit names must be 3–21 characters long using letters, numbers, and underscores only with no spaces. Availability must be verified on Reddit when creating a community — this tool cannot check live availability or whether a name is already claimed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Keywords / Community Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. home cooking, mechanical keyboards, indie hacking"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Naming Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SubredditStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="descriptive">Descriptive (e.g. AskTopic, TopicClub)</option>
            <option value="creative">Creative (e.g. TopicCrafters, TopicPulse)</option>
            <option value="short">Short & Catchy (e.g. TopicHq, Topic_io)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Variations:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCount(5)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 5 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              5
            </button>
            <button
              type="button"
              onClick={() => setCount(10)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 10 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              10
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Generate More
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Generate Subreddit Names
          </button>
        </div>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.items.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Generated Subreddit Candidates ({result.items.length})
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'subnames-all' ? 'Copied all!' : 'Copy All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.items.map((item, idx) => (
              <div
                key={`${item.rawName}-${idx}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-mono text-[11px] text-slate-400">#{idx + 1}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white truncate">
                    {item.formattedName}
                  </span>
                  <span className="shrink-0 rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                    {item.chars} chars
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(item.formattedName, `sub-${idx}`)}
                  className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                >
                  {copiedKey === `sub-${idx}` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 2. Reddit Subreddit Description Generator (<= 500 chars)
// ===========================================================================
function SubredditDescriptionGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('r/espresso');
  const [focus, setFocus] = useState('home espresso machines, grinder dial-ins, bean recommendations, and latte art');
  const [tone, setTone] = useState<SubredditDescriptionTone>('welcoming');
  const [rules, setRules] = useState('no self-promo, share gear details with setups, be respectful');
  const [variation, setVariation] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  const result = useMemo(() => {
    if (!hasGenerated) return { items: [] };
    return generateSubredditDescriptions({
      topic,
      communityFocus: focus,
      tone,
      rules,
      count: 4,
      variation,
    });
  }, [topic, focus, tone, rules, variation, hasGenerated]);

  const handleGenerate = () => {
    setHasGenerated(true);
    setVariation(0);
  };

  const handleRegenerate = () => {
    setHasGenerated(true);
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopic('');
    setFocus('');
    setTone('welcoming');
    setRules('');
    setVariation(0);
    setHasGenerated(false);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i) => `=== ${i.title} (${i.chars} chars) ===\n${i.description}`).join('\n\n');
    onCopy(all, 'desc-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>500-character description cap:</strong> Reddit limits community sidebar/about descriptions to 500 characters. Every description below tracks character length and is guaranteed to fit within Reddit’s 500-char box.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Subreddit Name or Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. r/mechanicalkeyboards or Coffee Roasting"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as SubredditDescriptionTone)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="welcoming">Welcoming & Supportive (Inclusive community hub)</option>
            <option value="casual">Casual & Relaxed (Hangout, setup swaps & tips)</option>
            <option value="serious">Serious & Technical (Curated, high-signal focus)</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Community Focus / What is the Subreddit for? <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="e.g. sharing keyboard builds, switch modifications, sound tests, and keycap designs"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Rules to Mention (Optional, comma-separated)
          </label>
          <input
            type="text"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="e.g. no self-promotion, search before asking, keep it civil"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleRegenerate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          Generate More
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
        >
          Generate Descriptions
        </button>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.items.length > 0 && (
        <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Community Description Variations ({result.items.length})
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'desc-all' ? 'Copied all!' : 'Copy All'}
            </button>
          </div>

          <div className="space-y-3">
            {result.items.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                    <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-mono font-medium">
                      {item.chars} / 500 chars
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(item.description, `desc-${idx}`)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                  >
                    {copiedKey === `desc-${idx}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 3. Reddit Flair Generator (<= 64 chars)
// ===========================================================================
function RedditFlairGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('r/cooking');
  const [style, setStyle] = useState<RedditFlairStyle>('any');
  const [count, setCount] = useState<5 | 10>(10);
  const [variation, setVariation] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  const result = useMemo(() => {
    if (!hasGenerated) return { items: [] };
    return generateRedditFlairs({ topic, style, count, variation });
  }, [topic, style, count, variation, hasGenerated]);

  const handleGenerate = () => {
    setHasGenerated(true);
    setVariation(0);
  };

  const handleRegenerate = () => {
    setHasGenerated(true);
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopic('');
    setStyle('any');
    setCount(10);
    setVariation(0);
    setHasGenerated(false);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i) => i.text).join('\n');
    onCopy(all, 'flairs-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Reddit 64-character flair cap:</strong> Individual user and post flairs allow up to 64 characters on Reddit. All tags generated below track exact character length and are verified to fit within Reddit’s 64-char flair limit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Subreddit or Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. r/cooking, r/webdev, Mechanical Keyboards"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Flair Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as RedditFlairStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="any">Any / Balanced Mix</option>
            <option value="question">Question & Advice Tags</option>
            <option value="discussion">Discussion & Debate Tags</option>
            <option value="guide">Guide & Tutorial Tags</option>
            <option value="news">News & Update Tags</option>
            <option value="help">Help & Troubleshooting Tags</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Variations:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCount(5)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 5 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              5
            </button>
            <button
              type="button"
              onClick={() => setCount(10)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 10 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              10
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Generate More
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Generate Flairs
          </button>
        </div>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.items.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Community Flair Tags ({result.items.length})
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'flairs-all' ? 'Copied all!' : 'Copy All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-mono text-[11px] text-slate-400">#{idx + 1}</span>
                  <span className="font-medium text-slate-900 dark:text-white truncate">
                    {item.text}
                  </span>
                  <span className="shrink-0 rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                    {item.chars} / 64
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(item.text, `flair-${idx}`)}
                  className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                >
                  {copiedKey === `flair-${idx}` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 4. Reddit Engagement Rate Calculator (Subscribers vs Views)
// ===========================================================================
function RedditEngagementCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [upvotes, setUpvotes] = useState('240');
  const [comments, setComments] = useState('65');
  const [metricType, setMetricType] = useState<'subscribers' | 'views'>('views');
  const [metricValue, setMetricValue] = useState('4200');

  const parsedUpvotes = parseFloat(upvotes);
  const parsedComments = parseFloat(comments);
  const parsedMetricValue = parseFloat(metricValue);

  const result = useMemo(() => {
    return calculateRedditEngagement({
      upvotes: parsedUpvotes,
      comments: parsedComments,
      metricType,
      metricValue: parsedMetricValue,
    });
  }, [parsedUpvotes, parsedComments, metricType, parsedMetricValue]);

  const handleReset = () => {
    setUpvotes('');
    setComments('');
    setMetricValue('');
  };

  const handleCopySummary = () => {
    if (result.status !== 'valid') return;
    const summary = `Reddit Post Engagement Breakdown:
- Engagement Rate (${result.metricType}): ${result.ratePercent}%
- Total Interactions: ${result.totalInteractions.toLocaleString()}
- Upvotes: ${parsedUpvotes.toLocaleString()}
- Comments: ${parsedComments.toLocaleString()} (${result.discussionRatioPercent}% of interactions)
- ${result.metricType === 'subscribers' ? 'Subscribers' : 'Post Views'}: ${parsedMetricValue.toLocaleString()}
Formula: ${result.formulaUsed}`;
    onCopy(summary, 'eng-summary');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Manual entry only:</strong> This calculator computes deterministic ratios from numbers you enter manually (e.g. from Reddit Post Insights). It does not connect to Reddit or fetch live statistics.
        </p>
      </div>

      {/* Formula explanation cards showing BOTH formulas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            metricType === 'subscribers'
              ? 'border-orange-400 bg-orange-50/60 dark:bg-orange-950/20 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-1">
            <span>Formula A: By Subscribers</span>
            {metricType === 'subscribers' && (
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-mono">Active</span>
            )}
          </div>
          <p className="font-mono text-[11px] text-orange-600 dark:text-orange-400">
            Engagement Rate = (Upvotes + Comments) / Subscribers × 100
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Measures how actively a subreddit community participates relative to its total member base.
          </p>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            metricType === 'views'
              ? 'border-orange-400 bg-orange-50/60 dark:bg-orange-950/20 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-1">
            <span>Formula B: By Post Views (Insights)</span>
            {metricType === 'views' && (
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-mono">Active</span>
            )}
          </div>
          <p className="font-mono text-[11px] text-orange-600 dark:text-orange-400">
            Engagement Rate = (Upvotes + Comments) / Views × 100
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Measures conversion from readers who viewed your post to those who upvoted or commented.
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Net Upvotes</label>
          <input
            type="number"
            min="0"
            value={upvotes}
            onChange={(e) => setUpvotes(e.target.value)}
            placeholder="e.g. 250"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Comment Count</label>
          <input
            type="number"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="e.g. 45"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {metricType === 'subscribers' ? 'Subscribers Total' : 'Post Views (Insights)'}
            </label>
            <div className="inline-flex gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setMetricType('views')}
                className={`underline ${metricType === 'views' ? 'font-bold text-[#FF4500]' : 'text-slate-400'}`}
              >
                Views
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setMetricType('subscribers')}
                className={`underline ${metricType === 'subscribers' ? 'font-bold text-[#FF4500]' : 'text-slate-400'}`}
              >
                Subscribers
              </button>
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            placeholder={metricType === 'subscribers' ? 'e.g. 50000' : 'e.g. 4200'}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {result.status === 'invalid' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">{result.errorMessage || 'Invalid inputs'}</p>
            {result.formulaDescription && <p className="mt-1 text-slate-600 dark:text-slate-400">{result.formulaDescription}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Engagement Rate ({result.metricType})
              </div>
              <div className="mt-1 text-3xl font-extrabold text-[#FF4500] font-mono">
                {result.ratePercent}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Total Interactions / {result.metricType === 'subscribers' ? 'Subscribers' : 'Views'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Interactions
              </div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {result.totalInteractions.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {parsedUpvotes.toLocaleString()} votes + {parsedComments.toLocaleString()} comments
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Discussion Share
              </div>
              <div className="mt-1 text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                {result.discussionRatioPercent}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Proportion of interactions that were comments
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 dark:text-white">Active calculation:</span>
              <p className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{result.formulaUsed}</p>
            </div>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
            >
              {copiedKey === 'eng-summary' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 5. Reddit Post Idea Generator (Specific Topic & Angle — DISTINCT from Tool 8)
// ===========================================================================
function RedditPostIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('r/Cooking');
  const [audience, setAudience] = useState('home cooks & culinary hobbyists');
  const [postType, setPostType] = useState<RedditPostType>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  const result = useMemo(() => {
    if (!hasGenerated) return { items: [] };
    return generateRedditPostIdeas({
      subredditOrTopic: topic,
      audience,
      postType,
      count,
      variation,
    });
  }, [topic, audience, postType, count, variation, hasGenerated]);

  const handleGenerate = () => {
    setHasGenerated(true);
    setVariation(0);
  };

  const handleRegenerate = () => {
    setHasGenerated(true);
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopic('');
    setAudience('');
    setPostType('any');
    setCount(5);
    setVariation(0);
    setHasGenerated(false);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i, idx) => `${idx + 1}. [${i.postType}] ${i.title}\n   Angle: ${i.angle}`).join('\n\n');
    onCopy(all, 'post-ideas-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Community-first post concepts:</strong> Generates authentic, non-promotional Reddit thread concepts with clickable title candidates and strategic angles designed to trigger comments and debate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Target Subreddit or Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. r/Cooking, Mechanical Keyboards, Personal Finance"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Audience (Optional)</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. beginners, solo founders, college students"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Post Type</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as RedditPostType)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="any">Any / Balanced Mix</option>
            <option value="question">Question / Recommendation Prompt</option>
            <option value="discussion">Community Discussion / Debate</option>
            <option value="guide">Educational Guide / Breakdown</option>
            <option value="story">Personal Story / Case Study</option>
            <option value="advice">Advice / Feedback Request</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Ideas count:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCount(5)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 5 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              5
            </button>
            <button
              type="button"
              onClick={() => setCount(10)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 10 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              10
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Generate More
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Generate Post Ideas
          </button>
        </div>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.items.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Specific Post Ideas ({result.items.length})
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'post-ideas-all' ? 'Copied all!' : 'Copy All'}
            </button>
          </div>

          <div className="space-y-3">
            {result.items.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      {item.postType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.charCount} / 300 chars
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onCopy(item.title, `pi-title-${idx}`)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                    >
                      {copiedKey === `pi-title-${idx}` ? 'Title Copied' : 'Copy Title'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(`${item.title}\n\nAngle: ${item.angle}`, `pi-full-${idx}`)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                    >
                      {copiedKey === `pi-full-${idx}` ? 'Full Copied' : 'Copy Full'}
                    </button>
                  </div>
                </div>

                <div className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                  {item.title}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  <strong>Strategic angle:</strong> {item.angle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 6. Reddit Question Generator (AskReddit & Community Q&A)
// ===========================================================================
function RedditQuestionGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('home baking');
  const [style, setStyle] = useState<RedditQuestionStyle>('any');
  const [count, setCount] = useState<5 | 10>(5);
  const [variation, setVariation] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  const result = useMemo(() => {
    if (!hasGenerated) return { items: [] };
    return generateRedditQuestions({ topic, style, count, variation });
  }, [topic, style, count, variation, hasGenerated]);

  const handleGenerate = () => {
    setHasGenerated(true);
    setVariation(0);
  };

  const handleRegenerate = () => {
    setHasGenerated(true);
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopic('');
    setStyle('any');
    setCount(5);
    setVariation(0);
    setHasGenerated(false);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i, idx) => `${idx + 1}. ${i.question}`).join('\n');
    onCopy(all, 'questions-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Open-ended discussion prompts:</strong> Generates authentic, conversational questions in genuine AskReddit community style that invite detailed replies rather than simple yes/no answers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Discussion Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. sourdough bread, remote work, indie game development"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as RedditQuestionStyle)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="any">Any / Mixed Angles</option>
            <option value="opinion">Unpopular Opinion & Hot Takes</option>
            <option value="advice">Pragmatic Advice & Lessons</option>
            <option value="experience">Stories & Breakthrough Moments</option>
            <option value="debate">Debates & Trade-Offs</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Questions count:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCount(5)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 5 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              5
            </button>
            <button
              type="button"
              onClick={() => setCount(10)}
              className={`px-3 py-1 rounded-md transition-colors ${count === 10 ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              10
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Generate More
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Generate Questions
          </button>
        </div>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.items.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Reddit Question Headlines ({result.items.length})
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'questions-all' ? 'Copied all!' : 'Copy All'}
            </button>
          </div>

          <div className="space-y-2.5">
            {result.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-3.5 text-xs gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">#{idx + 1}</span>
                    <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      {item.chars} / 300 chars
                    </span>
                    <span className="rounded bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-1.5 py-0.5 text-[10px] font-medium capitalize">
                      {item.style}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm leading-relaxed">
                    {item.question}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(item.question, `q-${idx}`)}
                  className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                >
                  {copiedKey === `q-${idx}` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 7. Reddit Poll Generator (question <= 300, options 2–6, duration <= 7 days)
// ===========================================================================
function RedditPollGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [question, setQuestion] = useState('Which monitor setup do you prefer for coding and productivity?');
  const [options, setOptions] = useState<string[]>([
    'Single ultrawide (34" or 49")',
    'Dual monitors (27" + 27")',
    'Single 27"–32" 4K display',
    'Laptop screen only',
  ]);
  const [duration, setDuration] = useState<RedditPollDuration>('3 days');
  const [includeResults, setIncludeResults] = useState(true);
  const [selectedMockOption, setSelectedMockOption] = useState<number | null>(null);

  const pollResult = useMemo(() => {
    return formatRedditPoll({
      question,
      options,
      duration,
      includeResultsOption: includeResults,
    });
  }, [question, options, duration, includeResults]);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, idx) => idx !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleReset = () => {
    setQuestion('');
    setOptions(['', '']);
    setDuration('3 days');
    setIncludeResults(true);
    setSelectedMockOption(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Poll preparation only:</strong> Reddit polls must be submitted through Reddit’s native Create Post interface (Poll tab). This tool validates your title length (max 300 chars), formats 2–6 choices (max 120 chars each), and sets up a clean, copyable poll package with a neutral 'Results' option.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Poll Question <span className="text-rose-500">*</span>
            </label>
            <span className={`font-mono ${countUnicodeChars(question) > 300 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
              {countUnicodeChars(question)} / 300 chars
            </span>
          </div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Which mechanical keyboard switch type is best for office work?"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Poll Options (2 to 6 options, max 120 chars each) <span className="text-rose-500">*</span>
            </label>
            {options.length < 6 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Option ({options.length}/6)
              </button>
            )}
          </div>

          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 w-5 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
                <span className="text-[10px] font-mono text-slate-400 w-16 text-right">
                  {countUnicodeChars(opt)}/120
                </span>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Remove option"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Poll Duration (Max 7 Days)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as RedditPollDuration)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="1 day">1 day</option>
              <option value="3 days">3 days (Recommended)</option>
              <option value="7 days">7 days (Maximum Reddit allows)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="includeResults"
              checked={includeResults}
              onChange={(e) => setIncludeResults(e.target.checked)}
              className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500] h-4 w-4"
            />
            <label htmlFor="includeResults" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Include neutral &quot;View Results&quot; option (prevents random votes from skewing data)
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => onCopy(pollResult.formattedText, 'poll-copy')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
        >
          {copiedKey === 'poll-copy' ? (
            <>
              <Check className="h-3.5 w-3.5 text-white" />
              <span>Poll Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Poll Details</span>
            </>
          )}
        </button>
      </div>

      {pollResult.errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-700 dark:text-rose-300 space-y-1">
          {pollResult.errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Poll Preview Card */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Reddit Poll Mockup Preview
        </span>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                r/Community Poll
              </span>
              <span className="text-slate-400 text-xs">· Duration: {duration}</span>
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base">
              {question || 'Poll Question Here'}
            </h3>
          </div>

          <div className="space-y-2">
            {pollResult.options.map((opt, idx) => (
              <label
                key={idx}
                onClick={() => setSelectedMockOption(idx)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedMockOption === idx
                    ? 'border-[#FF4500] bg-orange-50/70 dark:bg-orange-950/20 font-semibold text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      selectedMockOption === idx
                        ? 'border-[#FF4500] bg-[#FF4500]'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selectedMockOption === idx && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <span>{opt.text || `Option ${idx + 1}`}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {opt.chars} chars
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>{selectedMockOption !== null ? '1 mock vote recorded' : 'Select an option to test preview'}</span>
            <span className="font-medium text-slate-600 dark:text-slate-400">Prepares outline for Reddit Create Post</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 8. Reddit Random Post Idea Generator (Wildcard / diverse angles — DISTINCT from Tool 5)
// ===========================================================================
function RedditRandomPostIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topicFilter, setTopicFilter] = useState('');
  const [count, setCount] = useState<3 | 5>(5);
  const [variation, setVariation] = useState(0);

  const result = useMemo(() => {
    return generateRandomRedditPostIdeas({
      topicFilter,
      count,
      variation,
    });
  }, [topicFilter, count, variation]);

  const handleRandomize = () => {
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopicFilter('');
    setCount(5);
    setVariation(0);
  };

  const handleCopyAll = () => {
    const all = result.items.map((i, idx) => `${idx + 1}. [${i.suggestedSubreddit}] ${i.title}\n   Angle: ${i.angle}`).join('\n\n');
    onCopy(all, 'random-ideas-all');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Wildcard thread prompt spinner:</strong> Discovers unexpected angles across diverse popular Reddit communities (e.g. AskReddit, LifeProTips, TodayILearned, DIY, UnpopularOpinion). Distinct from Tool 5—no mandatory topic required!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Optional Category / Keyword Filter
          </label>
          <input
            type="text"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            placeholder="Optional: e.g. technology, finance, advice (or leave blank for all)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number of Ideas</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 3 | 5)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value={3}>3 Ideas</option>
            <option value={5}>5 Ideas</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleRandomize}
          className="inline-flex items-center gap-2 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Surprise Me / Spin Random Ideas
        </button>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Random Community Prompt Ideas ({result.items.length})
          </span>
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
          >
            <Copy className="h-3.5 w-3.5" />
            {copiedKey === 'random-ideas-all' ? 'Copied all!' : 'Copy All'}
          </button>
        </div>

        <div className="space-y-3">
          {result.items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 text-xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-2 py-0.5 text-[10px] font-bold font-mono">
                    {item.suggestedSubreddit}
                  </span>
                  <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(`${item.title}\n\nSuggested: ${item.suggestedSubreddit}\nAngle: ${item.angle}`, `rnd-copy-${idx}`)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
                >
                  {copiedKey === `rnd-copy-${idx}` ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                {item.title}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                <strong>Why it works:</strong> {item.angle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 9. Reddit Username Checker (FORMAT-ONLY — never claims live availability)
// ===========================================================================
function RedditUsernameChecker({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [inputHandle, setInputHandle] = useState('tech_writer-99');

  const checkResult = useMemo(() => {
    return checkRedditUsernameFormat(inputHandle);
  }, [inputHandle]);

  const handleReset = () => {
    setInputHandle('');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-semibold">Format check only — no live availability check:</p>
          <p className="mt-0.5 text-amber-900 dark:text-amber-300">
            This checker tests the format only. It cannot tell you whether a username is available — check availability on Reddit during sign-up. It verifies Reddit’s 3–20 character limits, allowed characters (letters, numbers, underscores, hyphens), and edge restrictions.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Enter u/Username to Validate
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">u/</span>
          <input
            type="text"
            value={inputHandle.replace(/^(\/)?u\//i, '')}
            onChange={(e) => setInputHandle(e.target.value)}
            placeholder="desired_username"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          Evaluated length: {checkResult.charCount} / 20 characters
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Result Checklist */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Reddit Username Format Checklist
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              checkResult.isValid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
            }`}
          >
            {checkResult.isValid ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Valid Reddit Format
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                Format Issues Detected
              </>
            )}
          </span>
        </div>

        <div className="space-y-2">
          {checkResult.rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 transition-colors ${
                rule.passed
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                  : 'border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  {rule.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span className={rule.passed ? 'text-emerald-950 dark:text-emerald-200' : 'text-rose-950 dark:text-rose-200'}>
                    {rule.label}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold">
                  {rule.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-6">
                {rule.explanation}
              </p>
              {!rule.passed && rule.fixSuggestion && (
                <p className="text-rose-700 dark:text-rose-300 pl-6 font-medium">
                  <strong>Fix suggestion:</strong> {rule.fixSuggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 10. Reddit Text to Markdown Converter
// ===========================================================================
function RedditTextToMarkdownConverter({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const [text, setText] = useState(
    'My Weekly Desk Setup\n\n- Monitor: 34" curved display\n- Keyboard: Gasket-mount 75%\n- Mouse: Ergonomic vertical wireless\n\nOverall productivity has improved significantly.',
  );
  const [autoLineBreaks, setAutoLineBreaks] = useState(true);
  const [convertEmphasis, setConvertEmphasis] = useState(true);
  const [convertLists, setConvertLists] = useState(true);
  const [convertTables, setConvertTables] = useState(true);

  const convertedMarkdown = useMemo(() => {
    return convertTextToRedditMarkdown(text, {
      autoLineBreaks,
      convertEmphasis,
      convertLists,
      convertTables,
    });
  }, [text, autoLineBreaks, convertEmphasis, convertLists, convertTables]);

  const handleReset = () => {
    setText('');
  };

  const handleSample = () => {
    setText(
      'Community Project Update\n\nPhase\tStatus\tNotes\nDesign\tComplete\tFigma wireframes approved\nFrontend\tIn Progress\tVite and Tailwind running\n\nKey takeaways:\n• Keep dependencies minimal\n• Test on narrow viewports early',
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Reddit-flavored Markdown:</strong> Reddit requires double line breaks for paragraph separation and specific list and table syntax. This tool converts raw notes, bullet points, and pasted tabular columns into clean Reddit Markdown.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Paste Plain Text / Raw Notes <span className="text-rose-500">*</span>
          </label>
          <button type="button" onClick={handleSample} className="text-[#FF4500] hover:underline font-medium">
            Try Sample
          </button>
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your plain text notes, lists, or tab-separated tables here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoLineBreaks}
            onChange={(e) => setAutoLineBreaks(e.target.checked)}
            className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500]"
          />
          <span>Double line breaks</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={convertLists}
            onChange={(e) => setConvertLists(e.target.checked)}
            className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500]"
          />
          <span>Markdown lists</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={convertEmphasis}
            onChange={(e) => setConvertEmphasis(e.target.checked)}
            className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500]"
          />
          <span>Emphasis (~strike~)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={convertTables}
            onChange={(e) => setConvertTables(e.target.checked)}
            className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500]"
          />
          <span>Pipe tables</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => onCopy(convertedMarkdown, 'txt-md-copy')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copiedKey === 'txt-md-copy' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Copied Markdown</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => onDownload(convertedMarkdown, 'reddit_post.md', 'text/markdown')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Download .md
        </button>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Converted Reddit Markdown</span>
          <span className="font-mono text-slate-400 font-normal">
            {countUnicodeChars(convertedMarkdown)} chars
          </span>
        </div>
        <textarea
          readOnly
          rows={6}
          value={convertedMarkdown}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>
    </div>
  );
}

// ===========================================================================
// 11. Reddit Markdown to HTML Converter
// ===========================================================================
function RedditMarkdownToHtmlConverter({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const [markdown, setMarkdown] = useState(
    '# Community Resource Guide\n\nWelcome to our complete breakdown of **best practices** and *workflows*.\n\n### Recommended Tools\n- Fast browser utilities\n- Offline-first storage\n\n> "Simplicity is the prerequisite for reliability."\n\n| Item | Tier | Status |\n|---|---|---|\n| Core App | Standard | Verified |\n| Wiki | Free | Live |\n\nHere is a hidden surprise: >!You found the secret spoiler!<',
  );

  const result = useMemo(() => {
    return convertRedditMarkdownToHtml(markdown);
  }, [markdown]);

  const handleReset = () => {
    setMarkdown('');
  };

  const handleSample = () => {
    setMarkdown(
      '# How to Build Custom Keyboards\n\n## 1. Choosing Switches\n* Linear switches: smooth and quiet\n* Tactile switches: noticeable bump\n\nCheck out the [subreddit wiki](https://reddit.com) for solder guides!',
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Republish Reddit guides cleanly:</strong> Converts Reddit Markdown syntax (headings, tables, spoilers, blockquotes, lists, bold/italic, code blocks) into clean semantic HTML with zero server execution.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Paste Reddit Markdown <span className="text-rose-500">*</span>
          </label>
          <button type="button" onClick={handleSample} className="text-[#FF4500] hover:underline font-medium">
            Try Sample
          </button>
        </div>
        <textarea
          rows={6}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Paste Reddit Markdown here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => onCopy(result.html, 'md-html-copy')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copiedKey === 'md-html-copy' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Copied HTML</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy HTML</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => onDownload(result.html, 'reddit_converted.html', 'text/html')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Download .html
        </button>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {/* HTML Code Output & Rendered Preview Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Clean HTML Code
          </span>
          <textarea
            readOnly
            rows={8}
            value={result.html}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 font-mono text-[11px] text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Rendered Preview
          </span>
          <div
            className="w-full h-[180px] overflow-y-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-xs prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: result.html || '<p class="text-slate-400 italic">Preview will appear here...</p>' }}
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 12. Reddit Content Calendar Generator
// ===========================================================================
function RedditContentCalendarGenerator({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const [topic, setTopic] = useState('r/personalfinance');
  const [cadence, setCadence] = useState<RedditCalendarCadence>(3);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [contentMix, setContentMix] = useState<RedditContentMix>('mixed');
  const [variation, setVariation] = useState(0);

  const result = useMemo(() => {
    return generateRedditCalendar({
      topic,
      postsPerWeek: cadence,
      startDate,
      contentMix,
      variation,
    });
  }, [topic, cadence, startDate, contentMix, variation]);

  const handleGenerate = () => {
    setVariation(0);
  };

  const handleRegenerate = () => {
    setVariation((prev) => prev + 1);
  };

  const handleReset = () => {
    setTopic('');
    setCadence(3);
    setStartDate(new Date().toISOString().split('T')[0]);
    setContentMix('mixed');
    setVariation(0);
  };

  const handleCopy = () => {
    const lines = result.days
      .map((d) => `${d.dayOfWeek} (${d.dateString}) — [${d.postType}]\nTitle: ${d.postTitle}\nAngle: ${d.strategicAngle}`)
      .join('\n\n');
    onCopy(lines, 'cal-copy');
  };

  const handleDownloadCsv = () => {
    const csv = serializeRedditCalendarCsv(result.days);
    onDownload(csv, `reddit_calendar_${startDate}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Planning tool only:</strong> Reddit Content Calendar organizes weekly community discussion megathreads and post pacing locally in your browser. It cannot publish or schedule posts on Reddit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Subreddit or Target Topic <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. r/personalfinance, Indie Hacking"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Posts Per Week</label>
          <select
            value={cadence}
            onChange={(e) => setCadence(Number(e.target.value) as RedditCalendarCadence)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value={2}>2 Posts / Week</option>
            <option value={3}>3 Posts / Week (Recommended)</option>
            <option value={5}>5 Posts / Week</option>
            <option value={7}>Daily (7 Posts / Week)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleRegenerate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          Regenerate Themes
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copiedKey === 'cal-copy' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Copied Schedule</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Schedule</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Download .csv
        </button>
      </div>

      {result.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result.days.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            7-Day Content Schedule ({startDate})
          </span>

          <div className="space-y-2.5">
            {result.days.map((day) => (
              <div
                key={day.dayIndex}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  day.postType.includes('Lurking')
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 opacity-75'
                    : 'border-orange-200 dark:border-orange-950/40 bg-orange-50/40 dark:bg-orange-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Day {day.dayIndex} · {day.dayOfWeek} ({day.dateString})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        day.postType.includes('Lurking')
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-[#FF4500] text-white'
                      }`}
                    >
                      {day.postType}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{day.targetSubreddit}</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {day.postTitle}
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  <strong>Pacing Strategy:</strong> {day.strategicAngle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// 13. Reddit Markdown Formatter (Toolbar & Real Markdown Actions)
// ===========================================================================
function RedditMarkdownFormatter({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const [text, setText] = useState(
    '### Welcome to the Megathread\n\nHere are the **core guidelines** and resources:\n\n- Read the sidebar before posting\n- Be civil and constructive\n\n> "Knowledge increases by sharing, not by saving."\n\n>!Secret surprise: remember no space next to exclamation marks!<\n\n| Project | Phase | Lead |\n|---|---|---|\n| Subreddit Wiki | Live | Mod Team |\n| Weekly Q&A | Active | Community |',
  );

  const applyFormat = (action: MarkdownFormatAction) => {
    setText((prev) => applyRedditMarkdownFormat(prev, action));
  };

  const handleReset = () => {
    setText('');
  };

  const handleSample = () => {
    setText(
      '# Subreddit Guide: Building a Custom Keyboard\n\n**Difficulty:** Intermediate\n*Estimated Build Time:* 2-3 hours\n\n### Required Tools\n1. Soldering iron\n2. Keycap puller\n3. Switch puller\n\n> Safety note: Always work in a well-ventilated area.',
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-700 dark:text-slate-300">
          Markdown Editor & Formatting Toolbar
        </label>
        <button type="button" onClick={handleSample} className="text-[#FF4500] hover:underline font-medium">
          Load Sample Guide
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:text-[#FF4500]"
          title="Bold (**text**)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 italic hover:text-[#FF4500]"
          title="Italic (*text*)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => applyFormat('h1')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] hover:text-[#FF4500]"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => applyFormat('h2')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] hover:text-[#FF4500]"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyFormat('h3')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] hover:text-[#FF4500]"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => applyFormat('quote')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
          title="Quote (> text)"
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => applyFormat('code')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] hover:text-[#FF4500]"
          title="Inline Code (`code`)"
        >
          `code`
        </button>
        <button
          type="button"
          onClick={() => applyFormat('codeblock')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] hover:text-[#FF4500]"
          title="Code Block"
        >
          ```Block```
        </button>
        <button
          type="button"
          onClick={() => applyFormat('spoiler')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] hover:text-[#FF4500]"
          title="Reddit Spoiler (>!hidden!<)"
        >
          &gt;!Spoiler!&lt;
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bullet')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] hover:text-[#FF4500]"
        >
          • Bullets
        </button>
        <button
          type="button"
          onClick={() => applyFormat('number')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] hover:text-[#FF4500]"
        >
          1. Numbers
        </button>
        <button
          type="button"
          onClick={() => applyFormat('table')}
          className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] hover:text-[#FF4500]"
          title="Insert Pipe Table"
        >
          | Table |
        </button>
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Draft your Reddit post or guide in Markdown mode..."
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-slate-400">
          Length: {countUnicodeChars(text)} characters
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => onCopy(text, 'rf-copy')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {copiedKey === 'rf-copy' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDownload(text, 'formatted_post.md', 'text/markdown')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download .md
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 14. Reddit Text Formatter (Spacing, Paragraphs, Casing)
// ===========================================================================
function RedditTextFormatter({
  onCopy,
  copiedKey,
  onDownload,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
  onDownload: (content: string, filename: string, mime: string) => void;
}) {
  const [text, setText] = useState(
    'first paragraph with notes\nsecond paragraph that would collapse on reddit without double spacing\nthird paragraph\n\n\n\nitem one\nitem two\nitem three',
  );

  const applyTextAction = (action: TextFormatAction) => {
    setText((prev) => formatRedditText(prev, action));
  };

  const handleReset = () => {
    setText('');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Reddit paragraph formatting:</strong> In Reddit Markdown, single line breaks collapse into a continuous line. Click <em>Normalize Spacing</em> to automatically insert Reddit-compliant blank lines between paragraphs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
        <button
          type="button"
          onClick={() => applyTextAction('normalizeSpacing')}
          className="px-3 py-1.5 rounded-lg bg-[#FF4500] text-white font-semibold shadow-xs hover:bg-[#e03d00]"
          title="Ensure blank line between paragraphs"
        >
          Normalize Line Breaks (Reddit Paragraphs)
        </button>
        <button
          type="button"
          onClick={() => applyTextAction('bulletList')}
          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => applyTextAction('removeEmptyLines')}
          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
        >
          Remove Blank Lines
        </button>
        <button
          type="button"
          onClick={() => applyTextAction('titleCase')}
          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
        >
          Title Case
        </button>
        <button
          type="button"
          onClick={() => applyTextAction('uppercase')}
          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
        >
          UPPERCASE
        </button>
        <button
          type="button"
          onClick={() => applyTextAction('lowercase')}
          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#FF4500]"
        >
          lowercase
        </button>
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text draft to format..."
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-slate-400">
          Length: {countUnicodeChars(text)} characters
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => onCopy(text, 'rt-copy')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {copiedKey === 'rt-copy' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDownload(text, 'formatted_text.txt', 'text/plain')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 15. Reddit Post Character Counter (40,000 Body Limit & 10,000 Comment)
// ===========================================================================
function RedditPostCharacterCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Detailed discussion post content...');
  const [mode, setMode] = useState<'post' | 'comment'>('post');

  const limit = mode === 'post' ? REDDIT_LIMITS.postBody : REDDIT_LIMITS.comment;
  const charCount = countUnicodeChars(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const charsNoSpaces = countUnicodeChars(text.replace(/\s+/g, ''));
  const remaining = limit - charCount;
  const isOver = remaining < 0;

  const handleReset = () => {
    setText('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mode:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('post')}
              className={`px-3 py-1 rounded-md transition-colors ${mode === 'post' ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Post Body (40,000)
            </button>
            <button
              type="button"
              onClick={() => setMode('comment')}
              className={`px-3 py-1 rounded-md transition-colors ${mode === 'comment' ? 'bg-white dark:bg-slate-900 text-[#FF4500] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Comment (10,000)
            </button>
          </div>
        </div>

        <div className="text-xs font-mono font-semibold">
          <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
            {charCount.toLocaleString()} / {limit.toLocaleString()} chars
          </span>
          <span className={`ml-2 px-2 py-0.5 rounded text-[11px] ${isOver ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60'}`}>
            {isOver ? `${Math.abs(remaining).toLocaleString()} over limit` : `${remaining.toLocaleString()} remaining`}
          </span>
        </div>
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your long-form Reddit guide, megathread, or comment here..."
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] text-slate-500 uppercase block">Total Characters</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
            {charCount.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] text-slate-500 uppercase block">Words</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
            {words.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] text-slate-500 uppercase block">Lines</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
            {lines.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] text-slate-500 uppercase block">Chars (no spaces)</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
            {charsNoSpaces.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-500">
          Emojis count as 1 character via Unicode code point measurement.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => onCopy(text, 'post-cnt-copy')}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FF4500]"
          >
            {copiedKey === 'post-cnt-copy' ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 16. Reddit Title Character Counter (Strict 300 Limit)
// ===========================================================================
function RedditTitleCharacterCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [title, setTitle] = useState('Interesting discussion title for subreddit [Guide]');

  const charCount = countUnicodeChars(title);
  const limit = REDDIT_LIMITS.postTitle;
  const remaining = limit - charCount;
  const isOver = remaining < 0;

  const handleReset = () => {
    setTitle('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-700 dark:text-slate-300">
          Reddit Post Title (Strict 300 Max Limit)
        </span>
        <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
          {charCount} / 300 chars
        </span>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type or paste your post headline (including any [Bracket Flair] tags)..."
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
      />

      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                isOver ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isOver ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Exceeds Reddit 300 Title Limit ({Math.abs(remaining)} chars over)
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Within 300-char limit ({remaining} chars remaining)
                </>
              )}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {charCount > 120
              ? 'Mobile tip: Reddit mobile apps typically truncate titles over 100–140 characters in home feeds.'
              : 'Headline fits comfortably on desktop and mobile feeds without ellipsis truncation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => onCopy(title, 'title-cnt-copy')}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FF4500]"
          >
            {copiedKey === 'title-cnt-copy' ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Title</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 17. Reddit Karma Calculator (Formula Simulation with Curve)
// ===========================================================================
function RedditKarmaCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [postUpvotes, setPostUpvotes] = useState('1200');
  const [commentUpvotes, setCommentUpvotes] = useState('3500');

  const pVotes = parseFloat(postUpvotes) || 0;
  const cVotes = parseFloat(commentUpvotes) || 0;

  const result = useMemo(() => {
    return calculateRedditKarma({
      postUpvotes: pVotes,
      commentUpvotes: cVotes,
    });
  }, [pVotes, cVotes]);

  const handleReset = () => {
    setPostUpvotes('0');
    setCommentUpvotes('0');
  };

  const handleCopy = () => {
    const text = `Reddit Karma Estimate:
- Estimated Total Karma: ${result.estimatedKarma.toLocaleString()}
- Post Karma Contribution: ${result.postKarma.toLocaleString()} (from ${pVotes.toLocaleString()} post upvotes)
- Comment Karma Contribution: ${result.commentKarma.toLocaleString()} (from ${cVotes.toLocaleString()} comment upvotes)
Note: ${result.ratioNote} (Reddit proprietary formula estimate)`;
    onCopy(text, 'karma-copy');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-semibold">Estimate-only disclaimer:</p>
          <p className="mt-0.5 text-amber-900 dark:text-amber-300">
            Reddit’s exact karma calculation formula is proprietary and non-public to prevent vote manipulation. Upvotes do not equal karma 1:1, especially at higher volumes. Results below model observed diminishing logarithmic return curves.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Post Net Upvotes
          </label>
          <input
            type="number"
            min="0"
            value={postUpvotes}
            onChange={(e) => setPostUpvotes(e.target.value)}
            placeholder="e.g. 1200"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Comment Net Upvotes
          </label>
          <input
            type="number"
            min="0"
            value={commentUpvotes}
            onChange={(e) => setCommentUpvotes(e.target.value)}
            placeholder="e.g. 3500"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Estimated Karma
          </span>
          <div className="mt-1 text-3xl font-extrabold text-[#FF4500] font-mono">
            {result.estimatedKarma.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Combined score estimate</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Post Karma Contribution
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {result.postKarma.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">From {pVotes.toLocaleString()} upvotes</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Comment Karma Contribution
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {result.commentKarma.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">From {cVotes.toLocaleString()} upvotes</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex items-center justify-between gap-3">
        <p className="text-slate-600 dark:text-slate-400">
          <strong>Observation:</strong> {result.ratioNote}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF4500]"
        >
          {copiedKey === 'karma-copy' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Breakdown</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ===========================================================================
// 18. Reddit Comment Picker (Random winners strictly from pasted comments)
// ===========================================================================
function RedditCommentPicker({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [rawText, setRawText] = useState(
    'u/coffee_geek\nu/mechanical_builder\nu/design_enthusiast\nu/coffee_geek\nu/web_dev_guru\nu/reddit_lurker\nu/audio_pro',
  );
  const [winnerCount, setWinnerCount] = useState<number>(1);
  const [backupCount, setBackupCount] = useState<number>(1);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [filterKeyword, setFilterKeyword] = useState<string>('');

  const [drawResult, setDrawResult] = useState<{
    winners: string[];
    backups: string[];
    totalEligible: number;
    duplicateCount: number;
    error?: string;
  } | null>(null);

  const handlePickWinners = () => {
    const res = pickRedditCommentWinners({
      rawText,
      winnerCount,
      backupCount,
      removeDuplicates,
      filterKeyword,
    });
    setDrawResult(res);
  };

  const handleReset = () => {
    setRawText('');
    setWinnerCount(1);
    setBackupCount(1);
    setFilterKeyword('');
    setDrawResult(null);
  };

  const handleSample = () => {
    setRawText(
      'u/keycap_collector\nu/switch_lubricator\nu/deskmat_art\nu/keycap_collector\nu/aluminum_case\nu/artisan_art\nu/cable_modder',
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <p>
          <strong>Pasted comments only:</strong> Reddit Comment Picker runs locally inside your browser using Web Crypto randomness. It operates strictly on text you copy and paste below—it cannot fetch live threads from a Reddit post URL or log into Reddit.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Paste Comments or u/Usernames (One per line) <span className="text-rose-500">*</span>
          </label>
          <button type="button" onClick={handleSample} className="text-[#FF4500] hover:underline font-medium">
            Try Sample Comments
          </button>
        </div>
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste u/usernames or full comments (one per line)..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">Winners Count</label>
          <input
            type="number"
            min="1"
            max="10"
            value={winnerCount}
            onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">Backup Winners</label>
          <input
            type="number"
            min="0"
            max="5"
            value={backupCount}
            onChange={(e) => setBackupCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Keyword Filter (Optional)
          </label>
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="e.g. entered, entered giveaway"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={removeDuplicates}
            onChange={(e) => setRemoveDuplicates(e.target.checked)}
            className="rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500]"
          />
          <span>Deduplicate repeated usernames (only 1 entry per person)</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={handlePickWinners}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-4 py-2 text-xs font-semibold shadow-xs"
          >
            Pick Random Winner(s)
          </button>
        </div>
      </div>

      {drawResult?.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{drawResult.error}</span>
        </div>
      )}

      {drawResult && !drawResult.error && (
        <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Draw Results ({drawResult.totalEligible} eligible entries
              {drawResult.duplicateCount > 0 ? `, ${drawResult.duplicateCount} duplicates removed` : ''})
            </span>
            <button
              type="button"
              onClick={() => {
                const text = `🏆 Selected Winner(s):\n${drawResult.winners.join('\n')}${drawResult.backups.length > 0 ? `\n\n🎯 Backup Winner(s):\n${drawResult.backups.join('\n')}` : ''}`;
                onCopy(text, 'pick-all-copy');
              }}
              className="inline-flex items-center gap-1 text-[#FF4500] font-semibold hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedKey === 'pick-all-copy' ? 'Copied all!' : 'Copy Winner(s)'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                🏆 Winner(s) Selected
              </span>
              <div className="space-y-1.5">
                {drawResult.winners.map((win, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  >
                    <span>{win}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(win, `win-${idx}`)}
                      className="text-xs font-sans text-emerald-600 hover:underline font-normal"
                    >
                      {copiedKey === `win-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {drawResult.backups.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  🎯 Backup Winner(s) (If primary winners are unresponsive)
                </span>
                <div className="space-y-1.5">
                  {drawResult.backups.map((bak, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                    >
                      <span>{bak}</span>
                      <button
                        type="button"
                        onClick={() => onCopy(bak, `bak-${idx}`)}
                        className="text-xs font-sans text-slate-500 hover:underline font-normal"
                      >
                        {copiedKey === `bak-${idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
