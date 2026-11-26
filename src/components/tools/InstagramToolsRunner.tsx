import React, {useMemo, useState} from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Instagram,
  RotateCcw,
  Shuffle,
  Trophy,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  analyzeInstagramHashtags,
  buildInstagramContentCalendar,
  calculateFollowerGrowthMilestones,
  calculateInstagramEngagementRate,
  calculatePostingTimes,
  convertToStylishDecorations,
  convertToUnicodeFonts,
  countUnicodeChars,
  formatInstagramLineBreaks,
  formatInstagramTextStyles,
  formatInstagramUsernameBatch,
  formatRawNameToInstagramHandle,
  generateInstagramBios,
  generateInstagramCaptions,
  generateInstagramComments,
  generateInstagramDms,
  generateInstagramHashtags,
  generateInstagramPostIdeas,
  generateInstagramReelCaptions,
  generateInstagramReelHooks,
  generateInstagramReelIdeas,
  generateInstagramReplies,
  generateInstagramStoryIdeas,
  INSTAGRAM_FONT_PAIRS,
  mixInstagramHashtagGroups,
  normalizeHashtagCopyInput,
  pickInstagramGiveawayWinners,
  POSTING_TIMEZONES,
  validateInstagramUsernameFormat,
  type CalendarSlot,
} from './instagramHelpers';
import {
  InstagramColorExtractor,
  InstagramGridPreviewMaker,
  InstagramImageCompressor,
  InstagramImageResizer,
  InstagramMockupGenerator,
  InstagramReelCoverMaker,
  InstagramSquareCropper,
  InstagramStoryResizer,
} from './instagram/InstagramCanvasTools';

interface Props {
  tool: Tool;
}

function EmptyPromptAlert({message}: {message: string}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function ValidationErrorAlert({message}: {message: string}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function InstagramToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <Instagram className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-950 dark:text-white truncate">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · Zero AI · Real in-browser execution
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-5 sm:p-8 space-y-6 min-w-0">
        {tool.slug === 'instagram-bio-generator' && <InstagramBioGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-bio-character-counter' && <InstagramBioCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-username-generator' && <InstagramUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-username-availability-format-checker' && <InstagramUsernameFormatChecker onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-username-formatter' && <InstagramUsernameFormatter onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-caption-generator' && <InstagramCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-caption-character-counter' && <InstagramCaptionCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-reel-caption-generator' && <InstagramReelCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-reel-hook-generator' && <InstagramReelHookGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-line-break-generator' && <InstagramLineBreakGenerator onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-hashtag-generator' && <InstagramHashtagGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-hashtag-counter' && <InstagramHashtagCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-hashtag-mixer' && <InstagramHashtagMixer onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-hashtag-copy-tool' && <InstagramHashtagCopyTool onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-font-generator' && <InstagramFontGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-stylish-text-generator' && <InstagramStylishTextGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-text-formatter' && <InstagramTextFormatter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-font-pairing-generator' && <InstagramFontPairingGenerator onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-post-idea-generator' && <InstagramPostIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-reel-idea-generator' && <InstagramReelIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-story-idea-generator' && <InstagramStoryIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-content-calendar-generator' && <InstagramContentCalendar onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-best-posting-time-planner' && <InstagramPostingTimePlanner onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-comment-generator' && <InstagramCommentGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-reply-generator' && <InstagramReplyGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-dm-generator' && <InstagramDmGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-engagement-rate-calculator' && <InstagramEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-follower-growth-calculator' && <InstagramFollowerGrowthCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-giveaway-winner-picker' && <InstagramWinnerPicker isCommentPicker={false} onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-random-comment-picker' && <InstagramWinnerPicker isCommentPicker={true} onCopy={copyText} copiedKey={copiedKey} />}

        {tool.slug === 'instagram-image-resizer' && <InstagramImageResizer />}
        {tool.slug === 'instagram-image-compressor' && <InstagramImageCompressor />}
        {tool.slug === 'instagram-square-image-cropper' && <InstagramSquareCropper />}
        {tool.slug === 'instagram-story-image-resizer' && <InstagramStoryResizer />}
        {tool.slug === 'instagram-reel-cover-maker' && <InstagramReelCoverMaker />}
        {tool.slug === 'instagram-grid-preview-maker' && <InstagramGridPreviewMaker />}
        {tool.slug === 'instagram-color-palette-extractor' && <InstagramColorExtractor onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'instagram-screenshot-mockup-generator' && <InstagramMockupGenerator />}
      </div>
    </div>
  );
}

// ============================================================================
// 1. PROFILE & BIO TOOLS
// ============================================================================

function InstagramBioGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [role, setRole] = useState('Digital Creator & Designer');
  const [niche, setNiche] = useState('Minimalist UI & Productivity Systems');
  const [proof, setProof] = useState('10k+ Creators Guided');
  const [cta, setCta] = useState('Download free templates below 👇');
  const [lineBreaks, setLineBreaks] = useState(true);

  const bios = useMemo(
    () =>
      generateInstagramBios({
        role,
        niche,
        locationOrProof: proof,
        cta,
        includeLineBreaks: lineBreaks,
      }),
    [role, niche, proof, cta, lineBreaks],
  );

  return (
    <div className="space-y-4 min-w-0">
      <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/60 text-xs text-pink-800 dark:text-pink-300">
        Template-based Instagram bio generator · Real-time 150-character limit checks · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Your Title / Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Sourdough Baker & Teacher"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            What You Help With (Niche)
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Home baking & starter care"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Social Proof / Credibility
          </label>
          <input
            type="text"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="e.g., 50k+ bakers taught"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Call to Action (CTA)
          </label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g., Get my free starter guide"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={lineBreaks}
            onChange={(e) => setLineBreaks(e.target.checked)}
            className="accent-pink-600 rounded"
          />
          <span>Use clean line breaks (stacked bio style)</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setRole('');
            setNiche('');
            setProof('');
            setCta('');
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear fields
        </button>
      </div>

      {bios.length === 0 ? (
        <EmptyPromptAlert message="Enter at least one field above (Role, Niche, Social Proof, or CTA) to generate your Instagram bio templates." />
      ) : (
        <div className="space-y-3 min-w-0">
          {bios.map((b, i) => (
            <div
              key={i}
              data-result="true"
              className="min-w-0 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white">{b.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      b.withinLimit
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {b.length} / 150 chars{!b.withinLimit ? ` (Over by ${b.length - 150})` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(b.bio, `bio-${i}`)}
                  className="inline-flex items-center gap-1 text-pink-600 font-semibold hover:text-pink-700 shrink-0"
                >
                  {copiedKey === `bio-${i}` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy Bio
                </button>
              </div>
              <pre className="w-full max-w-full min-w-0 font-sans whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                {b.bio}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramBioCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [bio, setBio] = useState(
    `Digital Creator & Designer ✨\nHelping you master minimalist UI\n📍 100+ Free Figma Templates\n👇 Tap below for weekly resources`,
  );
  const len = countUnicodeChars(bio);
  const lines = bio.length === 0 ? 0 : bio.split(/\r?\n/).length;
  const isOver150 = len > 150;
  const exceededBy = Math.max(0, len - 150);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Instagram Bio Text (150 Character Limit · Emoji = 1 Char)
          </label>
          <span className={`text-xs font-mono font-bold ${isOver150 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {len} / 150 characters{isOver150 ? ` (Over by ${exceededBy})` : ''}
          </span>
        </div>
        <textarea
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Type or paste your Instagram bio here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white font-sans"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setBio('')}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Clear Text
        </button>
        <button
          type="button"
          disabled={!bio.trim()}
          onClick={() => onCopy(bio, 'bio-counter-copy')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
        >
          {copiedKey === 'bio-counter-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy Bio
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Characters Remaining</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{Math.max(0, 150 - len)}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Lines Used</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {lines} {lines > 4 ? '(...more fold)' : ''}
          </div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            !isOver150
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <span className="font-semibold">Instagram Limit</span>
          <div className="text-lg font-bold mt-0.5">{isOver150 ? `OVER (+${exceededBy})` : 'SAFE'}</div>
        </div>
      </div>
    </div>
  );
}

function InstagramUsernameGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [base, setBase] = useState('design studio');
  const [extraWord, setExtraWord] = useState('');
  const [style, setStyle] = useState<'all' | 'dots' | 'underscores' | 'prefixes'>('all');
  const handles = useMemo(() => formatRawNameToInstagramHandle(base, extraWord, style), [base, extraWord, style]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
        Deterministic handle syntax generator (not AI). Suggests rule-compliant ideas — never checks live Instagram availability.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Name or Brand Words
          </label>
          <input
            type="text"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="e.g., design studio"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Optional 2nd Niche Word
          </label>
          <input
            type="text"
            value={extraWord}
            onChange={(e) => setExtraWord(e.target.value)}
            placeholder="e.g., lab, daily, media"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Separator Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as 'all' | 'dots' | 'underscores' | 'prefixes')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Variations</option>
            <option value="dots">Period Separators (.)</option>
            <option value="underscores">Underscore Separators (_)</option>
            <option value="prefixes">Creator Prefixes (the / hey / iam)</option>
          </select>
        </div>
      </div>

      {handles.length === 0 ? (
        <EmptyPromptAlert message="Enter letters or numbers above to generate valid 30-character @username combinations." />
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onCopy(handles.map((h) => `@${h}`).join('\n'), 'copy-all-handles')}
              className="text-xs font-semibold text-pink-600 hover:underline inline-flex items-center gap-1"
            >
              {copiedKey === 'copy-all-handles' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy All ({handles.length})
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {handles.map((h, i) => (
              <div
                key={i}
                className="min-w-0 flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <span className="font-mono font-medium text-pink-600 truncate mr-2">@{h}</span>
                <button
                  type="button"
                  onClick={() => onCopy(`@${h}`, `handle-${i}`)}
                  aria-label={`Copy @${h}`}
                  className="text-slate-400 hover:text-pink-600 shrink-0"
                >
                  {copiedKey === `handle-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InstagramUsernameFormatChecker({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [input, setInput] = useState('@minimalist.creator');
  const res = useMemo(() => validateInstagramUsernameFormat(input), [input]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-900 dark:text-amber-200">
        <strong>FORMAT CHECK ONLY:</strong> Validates Instagram handle syntax rules locally in your browser. It <strong>never checks real live availability</strong> on Instagram.
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Instagram Username to Check Syntax
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., @your.handle"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {res.checks.length === 0 && res.error ? (
        <EmptyPromptAlert message={res.error} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Syntax Result:</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                  res.valid
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {res.valid ? 'VALID SYNTAX' : 'INVALID SYNTAX'}
              </span>
            </div>
            {res.valid && (
              <button type="button" onClick={() => onCopy(res.normalized, 'ig-handle')} className="text-xs font-semibold text-pink-600">
                {copiedKey === 'ig-handle' ? 'Copied' : `Copy ${res.normalized}`}
              </button>
            )}
          </div>

          {res.error && <ValidationErrorAlert message={res.error} />}

          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            {res.checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {chk.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                <span className={chk.passed ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 font-medium'}>{chk.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InstagramUsernameFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [rawNames, setRawNames] = useState('Sarah Miller Photography');
  const {lines, variations} = useMemo(() => formatInstagramUsernameBatch(rawNames), [rawNames]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Full Name or Business Phrase (One per line for batch cleanup)
        </label>
        <textarea
          rows={3}
          value={rawNames}
          onChange={(e) => setRawNames(e.target.value)}
          placeholder="e.g., Sarah Miller Photography&#10;Northside Coffee-Roasters!"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {variations.length === 0 ? (
        <EmptyPromptAlert message="Enter a name or phrase above to format compliant 30-character Instagram handles (syntax formatting only)." />
      ) : (
        <div className="space-y-4">
          {lines.length > 1 && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
              {lines.map((row, idx) => (
                <div key={idx} className="p-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{row.input}</span>
                  <div className="flex flex-wrap gap-2">
                    {[row.dot, row.underscore, row.compact].filter(Boolean).map((handle, hIdx) => (
                      <button
                        key={hIdx}
                        type="button"
                        onClick={() => onCopy(handle, `batch-${idx}-${hIdx}`)}
                        className="font-mono px-2 py-1 rounded bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 hover:bg-pink-100"
                      >
                        {copiedKey === `batch-${idx}-${hIdx}` ? `Copied ${handle}` : handle}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Formatted Handle Variations ({lines[0]?.input}, max 30 chars each)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {variations.map((v, i) => (
                <div
                  key={i}
                  className="min-w-0 flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                >
                  <div className="min-w-0 mr-2">
                    <div className="font-mono text-pink-600 font-medium truncate">{v}</div>
                    <div className="text-[10px] text-slate-400">{v.length - 1}/30 chars</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(v, `v-${i}`)}
                    aria-label={`Copy ${v}`}
                    className="text-slate-400 hover:text-pink-600 shrink-0"
                  >
                    {copiedKey === `v-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. CAPTIONS & HOOKS
// ============================================================================

function InstagramCaptionGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('Consistency in Creative Work');
  const [tone, setTone] = useState<'educational' | 'inspirational' | 'casual' | 'sales'>('educational');
  const [cta, setCta] = useState('Save this post for your next project!');

  const captions = useMemo(() => generateInstagramCaptions({topic, tone, cta}), [topic, tone, cta]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/60 text-xs text-pink-800 dark:text-pink-300">
        Template-based caption generator · Real-time 2,200-char &amp; ~125-char fold tracking · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Post Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Cold brew recipes"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Tone of Voice</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as 'educational' | 'inspirational' | 'casual' | 'sales')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="educational">Educational / Value</option>
            <option value="inspirational">Inspirational / Mindset</option>
            <option value="casual">Casual / Behind-The-Scenes</option>
            <option value="sales">Promotional / Sales</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Call to Action (CTA)</label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {captions.length === 0 ? (
        <EmptyPromptAlert message="Enter a Post Topic above to generate structured Instagram caption templates." />
      ) : (
        <div className="space-y-3">
          {captions.map((c, i) => (
            <div key={i} className="min-w-0 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {c.title} ({c.charCount} / 2,200 chars)
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(c.caption, `cap-${i}`)}
                  className="inline-flex items-center gap-1 text-pink-600 font-semibold"
                >
                  {copiedKey === `cap-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Caption
                </button>
              </div>
              <pre className="w-full max-w-full min-w-0 font-sans whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                {c.caption}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramCaptionCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [caption, setCaption] = useState(
    `Stop overcomplicating your workflow.\n\nHere are 3 simple shifts that doubled my focus this month:\n1. Zero notifications during deep work hours\n2. Timeboxing 45-minute sprint blocks\n3. Ending every day with a written plan for tomorrow\n\nWhich one are you going to try first? Drop a comment below! 👇\n\n#productivity #habits #focus #creativity`,
  );
  const len = countUnicodeChars(caption);
  const isCutoff = len > 125;
  const isOver2200 = len > 2200;
  const exceededBy = Math.max(0, len - 2200);
  const hashtagStats = useMemo(() => analyzeInstagramHashtags(caption), [caption]);
  const foldPreview = Array.from(caption).slice(0, 125).join('');

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Instagram Caption Text (2,200 Max Limit · Emoji = 1 Char)
          </label>
          <span className={`text-xs font-mono font-bold ${isOver2200 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {len} / 2,200 chars{isOver2200 ? ` (Over by ${exceededBy})` : ''}
          </span>
        </div>
        <textarea
          rows={6}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Paste or type your Instagram caption..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCaption('')}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Clear Caption
        </button>
        <button
          type="button"
          disabled={!caption.trim()}
          onClick={() => onCopy(caption, 'cap-counter-copy')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
        >
          {copiedKey === 'cap-counter-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy Caption
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Characters Left</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{Math.max(0, 2200 - len)}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Hashtags Found</span>
          <div className={`text-lg font-bold mt-0.5 ${hashtagStats.exceedsLimit ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            {hashtagStats.totalCount} / 30
          </div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            !isCutoff
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <span className="font-semibold">Feed &apos;...more&apos; Cutoff</span>
          <div className="text-base font-bold mt-0.5">{isCutoff ? 'Folded (~125c)' : 'Fully Visible'}</div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            !isOver2200
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <span className="font-semibold">Max Limit</span>
          <div className="text-base font-bold mt-0.5">{isOver2200 ? `OVER (+${exceededBy})` : 'PASS'}</div>
        </div>
      </div>

      {caption.trim() && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Feed Preview Before &ldquo;...more&rdquo; (First 125 Characters)
          </span>
          <p className="text-slate-700 dark:text-slate-300 break-words">
            {foldPreview}
            {isCutoff ? <span className="text-slate-400 font-semibold"> ...more</span> : null}
          </p>
        </div>
      )}
    </div>
  );
}

function InstagramReelCaptionGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [hook, setHook] = useState('3 design hacks that save hours every week');
  const [goal, setGoal] = useState<'save' | 'share' | 'follow' | 'comment'>('save');
  const captions = useMemo(() => generateInstagramReelCaptions(hook, goal), [hook, goal]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Reel Core Hook / Topic
          </label>
          <input
            type="text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="e.g., 3 lighting tricks for smartphone video"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Desired Action (CTA)
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as 'save' | 'share' | 'follow' | 'comment')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="save">Save for Later</option>
            <option value="share">Share with Friend</option>
            <option value="follow">Follow Profile</option>
            <option value="comment">Comment Keyword</option>
          </select>
        </div>
      </div>

      {captions.length === 0 ? (
        <EmptyPromptAlert message="Enter your Reel topic or hook above to assemble mobile-friendly Reel captions." />
      ) : (
        <div className="space-y-3">
          {captions.map((c, i) => (
            <div key={i} className="min-w-0 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{c.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Opener: {c.openerChars} chars
                  </span>
                </div>
                <button type="button" onClick={() => onCopy(c.caption, `rc-${i}`)} className="text-pink-600 font-semibold flex items-center gap-1">
                  {copiedKey === `rc-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="w-full min-w-0 font-sans whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {c.caption}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramReelHookGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('growing on Instagram');
  const hooks = useMemo(() => generateInstagramReelHooks(topic), [topic]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/60 text-xs text-pink-800 dark:text-pink-300">
        On-screen opening text templates for 9:16 Reels · Includes word-count cue · Zero AI
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Your Reel Topic / Core Value
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sourdough hydration, home office lighting"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {hooks.length === 0 ? (
        <EmptyPromptAlert message="Enter a Reel topic above to generate on-screen hook templates." />
      ) : (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onCopy(hooks.join('\n'), 'rh-all')}
              className="text-xs font-semibold text-pink-600 hover:underline inline-flex items-center gap-1"
            >
              {copiedKey === 'rh-all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy All Hooks
            </button>
          </div>
          {hooks.map((h, i) => {
            const words = h.trim().split(/\s+/).length;
            return (
              <div
                key={i}
                className="min-w-0 flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-medium text-slate-900 dark:text-white break-words">&ldquo;{h}&rdquo;</span>
                  <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {words} words
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(h, `rh-${i}`)}
                  aria-label={`Copy hook ${i + 1}`}
                  className="text-slate-400 hover:text-pink-600 shrink-0"
                >
                  {copiedKey === `rh-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InstagramLineBreakGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [raw, setRaw] = useState(
    `First paragraph of my caption.\n\nSecond paragraph that usually gets collapsed by Instagram without invisible spaces.\n\nThird paragraph with my call to action!`,
  );
  const formatted = useMemo(() => (raw ? formatInstagramLineBreaks(raw) : ''), [raw]);
  const charCount = countUnicodeChars(formatted);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
        Trims trailing spaces and inserts Braille blank spacers (U+2800) on empty lines so Instagram preserves paragraph spacing!
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Type or Paste Your Caption or Bio With Blank Lines
        </label>
        <textarea
          rows={5}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Write lines separated by blank lines..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white font-mono"
        />
      </div>

      {!raw.trim() ? (
        <EmptyPromptAlert message="Enter multi-paragraph text above to convert blank lines into Instagram-safe spacing." />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 font-semibold uppercase font-sans">Formatted Output:</span>
              <span className={`px-2 py-0.5 rounded ${charCount <= 150 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                Bio: {charCount}/150
              </span>
              <span className={`px-2 py-0.5 rounded ${charCount <= 2200 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'}`}>
                Caption: {charCount}/2,200
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(formatted, 'lines-copy')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
            >
              {copiedKey === 'lines-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Spaced Text
            </button>
          </div>

          <textarea
            readOnly
            rows={5}
            value={formatted}
            aria-label="Formatted safe text output"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 text-xs text-slate-800 dark:text-slate-200 font-mono"
          />
        </>
      )}
    </div>
  );
}

// ============================================================================
// 3. HASHTAGS
// ============================================================================

function InstagramHashtagGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('minimalism, workspace');
  const [targetCount, setTargetCount] = useState<number>(15);
  const [deselected, setDeselected] = useState<string[]>([]);
  const res = useMemo(() => generateInstagramHashtags(niche, targetCount), [niche, targetCount]);

  const activeTags = useMemo(() => res.all.filter((t) => !deselected.includes(t)), [res.all, deselected]);
  const toggleTag = (tag: string) => {
    setDeselected((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Enter 1–3 Topic Keywords (comma or space separated)
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => {
              setNiche(e.target.value);
              setDeselected([]);
            }}
            placeholder="e.g., espresso, latte art"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Hashtag Count (Max 30)
          </label>
          <select
            value={targetCount}
            onChange={(e) => {
              setTargetCount(Number(e.target.value));
              setDeselected([]);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            {[5, 10, 15, 20, 30].map((c) => (
              <option key={c} value={c}>
                Up to {c} tags
              </option>
            ))}
          </select>
        </div>
      </div>

      {res.all.length === 0 ? (
        <EmptyPromptAlert message="Enter at least one topic keyword above to generate clean hashtag groups." />
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Selected: <strong className="text-pink-600">{activeTags.length}</strong> / 30 max tags (click any tag to toggle)
            </span>
            <button
              type="button"
              disabled={activeTags.length === 0}
              onClick={() => onCopy(activeTags.join(' '), 'ht-all')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
            >
              {copiedKey === 'ht-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Selected ({activeTags.length})
            </button>
          </div>

          {[
            {key: 'hd', title: 'Broad / High Reach', tags: res.highDensity},
            {key: 'md', title: 'Mid-Competition Community', tags: res.midDensity},
            {key: 'nd', title: 'Niche Specific', tags: res.niche},
          ]
            .filter((g) => g.tags.length > 0)
            .map((grp) => (
              <div key={grp.key} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{grp.title}</span>
                  <button type="button" onClick={() => onCopy(grp.tags.join(' '), grp.key)} className="text-pink-600 font-semibold">
                    {copiedKey === grp.key ? 'Copied' : 'Copy Group'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {grp.tags.map((tag) => {
                    const selected = !deselected.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`font-mono px-2 py-1 rounded border text-[11px] transition ${
                          selected
                            ? 'border-pink-300 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function InstagramHashtagCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('#photography #portrait #art #lightroom #visualsoflife #streetphotography #sonyalpha #Art');
  const analysis = useMemo(() => analyzeInstagramHashtags(text), [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Paste Caption or Hashtag String
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text with #hashtags here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          disabled={analysis.duplicates.length === 0}
          onClick={() => onCopy(analysis.uniqueString, 'ht-unique-copy')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 disabled:opacity-40 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
        >
          {copiedKey === 'ht-unique-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy Unique Hashtags ({analysis.uniqueCount})
        </button>

        {analysis.duplicates.length > 0 && (
          <button
            type="button"
            onClick={() => setText(analysis.uniqueString)}
            className="text-xs font-semibold text-pink-600 hover:underline"
          >
            Remove Duplicates in Editor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Total / Unique Tags</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {analysis.totalCount} total · {analysis.uniqueCount} unique
          </div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            !analysis.exceedsLimit
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <span className="font-semibold">Instagram 30 Limit</span>
          <div className="text-xl font-bold mt-0.5">
            {analysis.exceedsLimit ? `EXCEEDS 30 (+${analysis.exceededBy})` : 'WITHIN LIMIT'}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Duplicate Flags</span>
          <div className={`text-sm font-bold mt-1 ${analysis.duplicates.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {analysis.duplicates.length > 0
              ? analysis.duplicates.map((d) => `${d.tag} (×${d.count})`).join(', ')
              : 'No duplicates'}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstagramHashtagMixer({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [groupA, setGroupA] = useState('#design #minimal #ui #ux #branding');
  const [groupB, setGroupB] = useState('#creative #workspace #freelance #studio #Design');
  const [groupC, setGroupC] = useState('#typography #webdesign');
  const [targetCount, setTargetCount] = useState(10);
  const [includeDots, setIncludeDots] = useState(false);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mix = () => {
    const res = mixInstagramHashtagGroups([groupA, groupB, groupC], targetCount);
    if (res.tags.length === 0) {
      setError('Enter at least one hashtag or keyword in Group A, B, or C before mixing.');
      setShuffled([]);
      return;
    }
    setError(null);
    setShuffled(res.tags);
  };

  const rawJoined = shuffled.join(' ');
  const output = includeDots && rawJoined ? `.\n.\n.\n${rawJoined}` : rawJoined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Hashtag Group A</label>
          <textarea
            rows={3}
            value={groupA}
            onChange={(e) => setGroupA(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Hashtag Group B</label>
          <textarea
            rows={3}
            value={groupB}
            onChange={(e) => setGroupB(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Hashtag Group C (Optional)</label>
          <textarea
            rows={3}
            value={groupC}
            onChange={(e) => setGroupC(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <span>Target Tags: {targetCount}</span>
            <input
              type="range"
              min={3}
              max={30}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="accent-pink-600 w-28"
            />
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDots}
              onChange={(e) => setIncludeDots(e.target.checked)}
              className="accent-pink-600 rounded"
            />
            <span>Prepend dot spacers (.)</span>
          </label>
        </div>

        <button
          type="button"
          onClick={mix}
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700"
        >
          <Shuffle className="h-4 w-4" />
          Mix &amp; Deduplicate Hashtags
        </button>
      </div>

      {error && <ValidationErrorAlert message={error} />}

      {output && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Mixed Unique Output ({shuffled.length} tags)</span>
            <button type="button" onClick={() => onCopy(output, 'mix-copy')} className="text-pink-600 font-semibold">
              {copiedKey === 'mix-copy' ? 'Copied' : 'Copy Mixed'}
            </button>
          </div>
          <pre className="font-mono text-xs whitespace-pre-wrap break-words text-pink-600 dark:text-pink-400">{output}</pre>
        </div>
      )}
    </div>
  );
}

function InstagramHashtagCopyTool({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [input, setInput] = useState('street photography, nikon, #photo, #Art, #art');
  const [includeDots, setIncludeDots] = useState(false);

  const normalized = useMemo(() => normalizeHashtagCopyInput(input), [input]);
  const spaceOutput = includeDots && normalized.dotSpaced ? normalized.dotSpaced : normalized.spaceSeparated;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Paste Keywords or Messy Hashtags (auto-adds missing # and strips duplicates)
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., street photography, nikon, portrait"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDots}
            onChange={(e) => setIncludeDots(e.target.checked)}
            className="accent-pink-600 rounded"
          />
          <span>Include dot-line spacer above tags</span>
        </label>
        <span className={`font-mono font-semibold ${normalized.exceeds30 ? 'text-rose-600' : 'text-slate-500'}`}>
          {normalized.tags.length} / 30 unique tags
          {normalized.duplicatesRemoved > 0 ? ` (${normalized.duplicatesRemoved} duplicate removed)` : ''}
        </span>
      </div>

      {normalized.exceeds30 && (
        <ValidationErrorAlert message={`Your normalized list has ${normalized.tags.length} unique tags, which exceeds Instagram's 30-tag limit by ${normalized.tags.length - 30}.`} />
      )}

      {normalized.tags.length === 0 ? (
        <EmptyPromptAlert message="Paste comma-separated keywords or hashtags above to clean and copy them." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Single-Line Clean</span>
              <button type="button" onClick={() => onCopy(spaceOutput, 'cp-space')} className="text-pink-600 font-semibold">
                {copiedKey === 'cp-space' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-[11px] whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
              {spaceOutput}
            </pre>
          </div>

          <div className="min-w-0 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Bullet Stacked Clean</span>
              <button type="button" onClick={() => onCopy(normalized.bulletStacked, 'cp-bullet')} className="text-pink-600 font-semibold">
                {copiedKey === 'cp-bullet' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-[11px] whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto">
              {normalized.bulletStacked}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. FONTS & TEXT STYLING
// ============================================================================

function InstagramFontGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Creative Studio');
  const fonts = useMemo(() => (text.trim() ? convertToUnicodeFonts(text) : []), [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Type Text to Convert into Unicode Fonts
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text for Unicode bio or name styling..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {fonts.length === 0 ? (
        <EmptyPromptAlert message="Type text above to preview bold, italic, serif, script, and monospace Unicode fonts." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fonts.map((f) => (
            <div
              key={f.id}
              className="min-w-0 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 text-xs shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{f.name}</span>
                <div className="text-base text-slate-900 dark:text-white mt-0.5 break-words [overflow-wrap:anywhere] select-all">
                  {f.result}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCopy(f.result, f.id)}
                className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold shrink-0"
              >
                {copiedKey === f.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramStylishTextGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Aesthetic');
  const [fontId, setFontId] = useState('plain');
  const styles = useMemo(() => (text.trim() ? convertToStylishDecorations(text, fontId) : []), [text, fontId]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Text to Decorate
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Featured Highlights"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Unicode Font Style
          </label>
          <select
            value={fontId}
            onChange={(e) => setFontId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="plain">Standard Letters</option>
            <option value="bold-sans">Bold Sans</option>
            <option value="bold-serif">Bold Serif</option>
            <option value="script">Cursive / Script</option>
            <option value="small-caps">Small Caps</option>
          </select>
        </div>
      </div>

      {styles.length === 0 ? (
        <EmptyPromptAlert message="Enter a word or short heading above to decorate it with frames and dividers." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {styles.map((s, i) => (
            <div
              key={i}
              className="min-w-0 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-semibold">{s.name}</span>
                <div className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 break-words [overflow-wrap:anywhere]">
                  {s.result}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCopy(s.result, `st-${i}`)}
                aria-label={`Copy ${s.name}`}
                className="text-pink-600 font-semibold shrink-0"
              >
                {copiedKey === `st-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramTextFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState(`design   inspiration   for creators\n\n- clean spacing\n- normalized bullets\n- quick copy`);
  const formats = useMemo(() => (text.trim() ? formatInstagramTextStyles(text) : []), [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Paste or Enter Multi-Line Caption / Notes to Format
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste rough text or hyphen bullet lists (- item) here..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white"
        />
      </div>

      {formats.length === 0 ? (
        <EmptyPromptAlert message="Enter or paste caption text above to clean spacing, convert bullets, or change text casing." />
      ) : (
        <div className="space-y-2.5">
          {formats.map((f, i) => (
            <div key={i} className="min-w-0 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{f.name}</span>
                <button
                  type="button"
                  onClick={() => onCopy(f.val, `fmt-${i}`)}
                  className="inline-flex items-center gap-1 text-pink-600 font-semibold shrink-0"
                >
                  {copiedKey === `fmt-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="w-full min-w-0 font-sans whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                {f.val}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramFontPairingGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [headline, setHeadline] = useState('Aesthetic Summer Curation');
  const [subtitle, setSubtitle] = useState('Effortless styling tips for your everyday feed.');
  const [mood, setMood] = useState<'all' | 'editorial' | 'bold' | 'minimal' | 'friendly'>('all');

  const pairs = useMemo(
    () => (mood === 'all' ? INSTAGRAM_FONT_PAIRS : INSTAGRAM_FONT_PAIRS.filter((p) => p.mood === mood)),
    [mood],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
            Sample Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
            Sample Body Text
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
            Aesthetic Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value as 'all' | 'editorial' | 'bold' | 'minimal' | 'friendly')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Moods</option>
            <option value="editorial">Editorial Serif</option>
            <option value="bold">Bold &amp; Punchy</option>
            <option value="minimal">Minimal Luxury</option>
            <option value="friendly">Friendly Creator</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pairs.map((pair, i) => {
          const spec = `${pair.name} — Heading: ${pair.headingFont.split(',')[0]} | Body: ${pair.bodyFont.split(',')[0]} | Ratio: ${pair.ratio}`;
          return (
            <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">{pair.name}</span>
                <button
                  type="button"
                  onClick={() => onCopy(spec, `fp-${pair.name}`)}
                  className="text-pink-600 font-semibold inline-flex items-center gap-1"
                >
                  {copiedKey === `fp-${pair.name}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Specs
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {pair.headingFont.split(',')[0]} + {pair.bodyFont.split(',')[0]} ({pair.ratio})
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white break-words" style={{fontFamily: pair.headingFont}}>
                  {headline.trim() || pair.sampleTitle}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 break-words" style={{fontFamily: pair.bodyFont}}>
                  {subtitle.trim() || pair.sampleSubtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 5. CONTENT IDEAS & CALENDAR
// ============================================================================

function InstagramPostIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Graphic Design');
  const [goal, setGoal] = useState<'all' | 'educate' | 'inspire' | 'promote' | 'bts'>('all');
  const ideas = useMemo(() => generateInstagramPostIdeas(niche, goal), [niche, goal]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Enter Your Profile Niche / Topic
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Home Espresso, Web Design"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Content Goal
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as 'all' | 'educate' | 'inspire' | 'promote' | 'bts')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Goals</option>
            <option value="educate">Educate &amp; Saves</option>
            <option value="inspire">Inspire &amp; Story</option>
            <option value="promote">Promote &amp; Offer</option>
            <option value="bts">Behind-the-Scenes</option>
          </select>
        </div>
      </div>

      {ideas.length === 0 ? (
        <EmptyPromptAlert message="Enter your profile niche or topic above to generate tailored Carousel and feed post prompts." />
      ) : (
        <div className="space-y-2.5">
          {ideas.map((idea, i) => {
            const copyStr = `${idea.format}: ${idea.title}\nOutline: ${idea.outline}`;
            return (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold text-[10px] mr-2">
                      {idea.format}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{idea.title}</span>
                  </div>
                  <button type="button" onClick={() => onCopy(copyStr, `pid-${i}`)} className="text-slate-400 hover:text-pink-600 shrink-0">
                    {copiedKey === `pid-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{idea.outline}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InstagramReelIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Fitness');
  const [style, setStyle] = useState<'all' | 'talking-head' | 'b-roll' | 'tutorial'>('all');
  const reels = useMemo(() => generateInstagramReelIdeas(niche, style), [niche, style]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Reel Focus Niche
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Fitness, Pottery, SaaS"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Filming Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as 'all' | 'talking-head' | 'b-roll' | 'tutorial')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Filming Styles</option>
            <option value="talking-head">Talking Head</option>
            <option value="b-roll">B-Roll + Text (Faceless)</option>
            <option value="tutorial">Step-by-Step Tutorial</option>
          </select>
        </div>
      </div>

      {reels.length === 0 ? (
        <EmptyPromptAlert message="Enter a Reel niche above to build filming prompts and shot pacing ideas." />
      ) : (
        <div className="space-y-2.5">
          {reels.map((r, i) => {
            const copyVal = `${r.title} (${r.duration})\n${r.shotPrompt}`;
            return (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] mr-2">
                      {r.duration}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{r.title}</span>
                  </div>
                  <button type="button" onClick={() => onCopy(copyVal, `rid-${i}`)} className="text-slate-400 hover:text-pink-600 shrink-0">
                    {copiedKey === `rid-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{r.shotPrompt}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InstagramStoryIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('Freelance Life');
  const [sticker, setSticker] = useState<'all' | 'poll' | 'quiz' | 'question' | 'countdown'>('all');
  const stories = useMemo(() => generateInstagramStoryIdeas(topic, sticker), [topic, sticker]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Story Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Client Onboarding"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Interactive Sticker
          </label>
          <select
            value={sticker}
            onChange={(e) => setSticker(e.target.value as 'all' | 'poll' | 'quiz' | 'question' | 'countdown')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Stickers</option>
            <option value="poll">Poll Sticker</option>
            <option value="quiz">Quiz Sticker</option>
            <option value="question">Question Box</option>
            <option value="countdown">Countdown Sticker</option>
          </select>
        </div>
      </div>

      {stories.length === 0 ? (
        <EmptyPromptAlert message="Enter a Story topic above to plan interactive sticker sequences." />
      ) : (
        <div className="space-y-2.5">
          {stories.map((s, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{s.sequenceTitle}</span>
                <button
                  type="button"
                  onClick={() => onCopy(`${s.sequenceTitle}\n${s.text}\n${s.stickerCopy}`, `stry-${i}`)}
                  className="text-pink-600 font-semibold shrink-0"
                >
                  {copiedKey === `stry-${i}` ? 'Copied' : 'Copy Sequence'}
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{s.text}</p>
              <div className="p-2 rounded bg-pink-50 dark:bg-pink-950/30 text-pink-800 dark:text-pink-300 font-mono text-[11px]">
                {s.stickerCopy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramContentCalendar({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 7>(3);
  const [weeks, setWeeks] = useState<number>(2);
  const [startDate, setStartDate] = useState<string>('2026-05-04');
  const [pillarsText, setPillarsText] = useState('Educational Tips, Behind-the-Scenes, Product Spotlight, Community Q&A');
  const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>({});

  const baseSchedule = useMemo<CalendarSlot[]>(
    () =>
      buildInstagramContentCalendar({
        daysPerWeek,
        startDate,
        pillars: pillarsText.split(','),
        weeks,
      }),
    [daysPerWeek, startDate, pillarsText, weeks],
  );

  const schedule = baseSchedule.map((row) => ({
    ...row,
    note: noteOverrides[row.id] ?? row.note,
  }));

  const csv =
    'Date,Day,Format,Pillar,Goal,Note\n' +
    schedule
      .map(
        (s) =>
          `"${s.date}","${s.dayName}","${s.format}","${s.pillar.replace(/"/g, '""')}","${s.goal}","${s.note.replace(/"/g, '""')}"`,
      )
      .join('\n');

  const downloadCsv = () => {
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_calendar_${startDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Posts Per Week</label>
          <select
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value) as 3 | 4 | 5 | 7)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            <option value={3}>3 days / week</option>
            <option value={4}>4 days / week</option>
            <option value={5}>5 days / week</option>
            <option value={7}>Daily (7 days / week)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Horizon</label>
          <select
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            <option value={1}>1 Week</option>
            <option value={2}>2 Weeks</option>
            <option value={4}>4 Weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
          Up to 4 Content Pillars (comma-separated)
        </label>
        <input
          type="text"
          value={pillarsText}
          onChange={(e) => setPillarsText(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Editable Schedule ({schedule.length} planned slots)
        </span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onCopy(csv, 'ig-cal-csv')} className="text-xs text-pink-600 font-semibold flex items-center gap-1">
            {copiedKey === 'ig-cal-csv' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy CSV
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
        {schedule.map((row) => (
          <div key={row.id} className="p-3 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-slate-900 dark:text-white">{row.date}</span>
                <span className="text-slate-500">({row.dayName})</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-400 font-semibold">
                  {row.format}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {row.pillar} · {row.goal}
              </span>
            </div>
            <input
              type="text"
              value={row.note}
              aria-label={`Post note for ${row.date}`}
              onChange={(e) => setNoteOverrides((prev) => ({...prev, [row.id]: e.target.value}))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InstagramPostingTimePlanner({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [industry, setIndustry] = useState<'tech' | 'creator' | 'fitness' | 'ecommerce'>('tech');
  const [audienceTzId, setAudienceTzId] = useState<string>('America/New_York');
  const [creatorTzId, setCreatorTzId] = useState<string>('Europe/London');

  const rows = useMemo(
    () => calculatePostingTimes({industry, audienceTzId, creatorTzId}),
    [industry, audienceTzId, creatorTzId],
  );

  const summaryText = rows.map((r) => `${r.day}: ${r.localPeak} (Audience: ${r.audiencePeak})`).join('\n');

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Uses general industry benchmark windows converted across your timezone inputs — never connects to Instagram or fetches real account analytics.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Industry Benchmark
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value as 'tech' | 'creator' | 'fitness' | 'ecommerce')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="tech">Technology &amp; Software</option>
            <option value="creator">Creators &amp; Lifestyle</option>
            <option value="fitness">Health &amp; Fitness</option>
            <option value="ecommerce">E-Commerce &amp; Fashion</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Target Audience Timezone
          </label>
          <select
            value={audienceTzId}
            onChange={(e) => setAudienceTzId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            {POSTING_TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Your Local Timezone
          </label>
          <select
            value={creatorTzId}
            onChange={(e) => setCreatorTzId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            {POSTING_TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => onCopy(summaryText, 'pt-copy')} className="text-xs font-semibold text-pink-600 inline-flex items-center gap-1">
          {copiedKey === 'pt-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          Copy Local Posting Windows
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
        {rows.map((t, i) => (
          <div key={i} className="p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-900 dark:text-white w-24">{t.day}</span>
            <div className="text-pink-600 font-semibold">Your Time: {t.localPeak}</div>
            <div className="text-slate-400 text-[11px]">
              Audience Peak: {t.audiencePeak} · Alt: {t.localSecondary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. ENGAGEMENT & COMMENTS
// ============================================================================

function InstagramCommentGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('design system tips');
  const [commentType, setCommentType] = useState<'all' | 'pinned' | 'compliment' | 'qa'>('all');
  const comments = useMemo(() => generateInstagramComments(topic, commentType), [topic, commentType]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Post Topic You Are Commenting On
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., minimalist photography"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Comment Style
          </label>
          <select
            value={commentType}
            onChange={(e) => setCommentType(e.target.value as 'all' | 'pinned' | 'compliment' | 'qa')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Comment Types</option>
            <option value="pinned">Pinned Creator Prompt</option>
            <option value="compliment">Peer Compliment</option>
            <option value="qa">Q&amp;A Follow-Up</option>
          </select>
        </div>
      </div>

      {comments.length === 0 ? (
        <EmptyPromptAlert message="Enter a post topic above to fill customizable engagement comment templates." />
      ) : (
        <div className="space-y-2">
          {comments.map((c, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">{c.label}</span>
                <span className="text-slate-800 dark:text-slate-200">&ldquo;{c.text}&rdquo;</span>
              </div>
              <button
                type="button"
                onClick={() => onCopy(c.text, `cm-${i}`)}
                aria-label={`Copy comment ${i + 1}`}
                className="text-pink-600 font-semibold shrink-0"
              >
                {copiedKey === `cm-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramReplyGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [comment, setComment] = useState('Where can I get this template?');
  const [scenario, setScenario] = useState<'auto' | 'link' | 'thanks' | 'support' | 'collab'>('auto');
  const [resourceHint, setResourceHint] = useState('link in bio');

  const {detectedIntent, replies} = useMemo(
    () => generateInstagramReplies(comment, scenario, resourceHint),
    [comment, scenario, resourceHint],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Comment You Received
          </label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g., How much does this cost? or Love this!"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Reply Scenario
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as 'auto' | 'link' | 'thanks' | 'support' | 'collab')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="auto">Auto-Detect from Comment</option>
            <option value="link">Link Request</option>
            <option value="thanks">Thank You / Praise</option>
            <option value="support">Support &amp; Pricing</option>
            <option value="collab">Collab Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Optional Link / Resource Label
        </label>
        <input
          type="text"
          value={resourceHint}
          onChange={(e) => setResourceHint(e.target.value)}
          placeholder="e.g., link in bio under Free Guides"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
        />
      </div>

      {replies.length === 0 ? (
        <EmptyPromptAlert message="Enter a received comment above to generate context-matched Saved Reply templates." />
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-slate-500">
            Matched Intent: <strong className="text-pink-600">{detectedIntent}</strong>
          </div>
          {replies.map((r, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-800 dark:text-slate-200">{r}</span>
              <button type="button" onClick={() => onCopy(r, `rp-${i}`)} className="text-pink-600 font-semibold shrink-0">
                {copiedKey === `rp-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramDmGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [recipient, setRecipient] = useState('Alex');
  const [topic, setTopic] = useState('collaborating on a video project');
  const [category, setCategory] = useState<'collab' | 'welcome' | 'event' | 'support'>('collab');

  const dms = useMemo(() => generateInstagramDms({recipient, topic, category}), [recipient, topic, category]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">DM Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'collab' | 'welcome' | 'event' | 'support')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="collab">Brand Collab</option>
            <option value="welcome">Welcome Message</option>
            <option value="event">Event Invite</option>
            <option value="support">Support Update</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Recipient Name</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g., Jordan"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Subject / Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., spring product shoot"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {dms.length === 0 ? (
        <EmptyPromptAlert message="Enter both Recipient Name and Subject/Topic above to draft editable DM scripts (never auto-sends)." />
      ) : (
        <div className="space-y-2">
          {dms.map((dm, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Option {i + 1}</span>
                <button type="button" onClick={() => onCopy(dm, `dm-${i}`)} className="text-pink-600 font-semibold">
                  {copiedKey === `dm-${i}` ? 'Copied' : 'Copy DM'}
                </button>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{dm}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramEngagementCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [followers, setFollowers] = useState('10000');
  const [reach, setReach] = useState('');
  const [likes, setLikes] = useState('450');
  const [comments, setComments] = useState('50');
  const [saves, setSaves] = useState('20');
  const [shares, setShares] = useState('30');

  const parsed = useMemo(() => {
    const fVal = Number(followers.trim());
    const lVal = Number(likes.trim() || '0');
    const cVal = Number(comments.trim() || '0');
    const sVal = Number(saves.trim() || '0');
    const shVal = Number(shares.trim() || '0');
    const rTrim = reach.trim();
    const rVal = rTrim ? Number(rTrim) : null;

    if (!followers.trim() || Number.isNaN(fVal) || fVal <= 0) {
      return {error: 'Follower count must be greater than 0 to compute Engagement Rate.', data: null};
    }
    if ([lVal, cVal, sVal, shVal].some((n) => Number.isNaN(n) || n < 0)) {
      return {error: 'Likes, comments, saves, and shares must be 0 or positive numbers.', data: null};
    }
    if (rVal !== null && (Number.isNaN(rVal) || rVal <= 0)) {
      return {error: 'Optional Post Reach must be greater than 0 when supplied.', data: null};
    }

    const res = calculateInstagramEngagementRate({
      followers: fVal,
      likes: lVal,
      comments: cVal,
      saves: sVal,
      shares: shVal,
      reach: rVal,
    });
    return {error: null, data: res};
  }, [followers, reach, likes, comments, saves, shares]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
        Manual metric calculator only — does not connect to Instagram or look up live accounts.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Followers *</label>
          <input
            type="number"
            min="1"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Likes</label>
          <input
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Comments</label>
          <input
            type="number"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Saves</label>
          <input
            type="number"
            min="0"
            value={saves}
            onChange={(e) => setSaves(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Shares</label>
          <input
            type="number"
            min="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Reach (Opt.)</label>
          <input
            type="number"
            min="1"
            value={reach}
            placeholder="Optional"
            onChange={(e) => setReach(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {parsed.error ? (
        <ValidationErrorAlert message={parsed.error} />
      ) : parsed.data ? (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Engagement Rate (by Followers)</span>
            <div className="text-3xl font-extrabold text-pink-600 mt-1">{parsed.data.engagementByFollowers}%</div>
            <span className="text-xs font-medium text-emerald-600 mt-1 block">{parsed.data.tierLabel}</span>
            {parsed.data.engagementByReach !== null && (
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                Engagement Rate by Reach: <span className="text-pink-600">{parsed.data.engagementByReach}%</span>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1.5">
            <div>Total Interactions: {parsed.data.totalInteractions.toLocaleString()}</div>
            <div>Industry Benchmark: 1% – 3% Solid, 3%+ High</div>
            <button
              type="button"
              onClick={() =>
                onCopy(
                  `ER by Followers: ${parsed.data!.engagementByFollowers}% (${parsed.data!.tierLabel})\nTotal Interactions: ${parsed.data!.totalInteractions}${
                    parsed.data!.engagementByReach !== null ? `\nER by Reach: ${parsed.data!.engagementByReach}%` : ''
                  }`,
                  'er-copy',
                )
              }
              className="inline-flex items-center gap-1 text-pink-600 font-semibold"
            >
              {copiedKey === 'er-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Result
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InstagramFollowerGrowthCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [current, setCurrent] = useState('2500');
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState('5');
  const [target, setTarget] = useState('10000');

  const res = useMemo(
    () =>
      calculateFollowerGrowthMilestones({
        currentRaw: current,
        rateRaw: monthlyGrowthRate,
        targetRaw: target,
      }),
    [current, monthlyGrowthRate, target],
  );

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
        Compound projection estimate from numbers you enter — not connected to live Instagram analytics and timelines are not guaranteed.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Current Followers</label>
          <input
            type="number"
            min="1"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Monthly Growth Rate (%)</label>
          <input
            type="number"
            min="0"
            max="500"
            step="0.5"
            value={monthlyGrowthRate}
            onChange={(e) => setMonthlyGrowthRate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Target Followers</label>
          <input
            type="number"
            min="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {!res.valid && res.error ? (
        <ValidationErrorAlert message={res.error} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-slate-500 uppercase">In 3 Months</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{res.month3.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-slate-500 uppercase">In 6 Months</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{res.month6.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-slate-500 uppercase">In 12 Months</span>
              <div className="text-xl font-bold text-pink-600 mt-1">{res.month12.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-center">
            {res.current >= res.target ? (
              <span>Target of {res.target.toLocaleString()} followers is already reached.</span>
            ) : res.monthsToTarget !== null ? (
              <span>
                At {res.rate}% monthly compounding growth, projected to reach {res.target.toLocaleString()} in approximately{' '}
                <strong className="text-pink-600 font-bold">{res.monthsToTarget} months</strong>.
              </span>
            ) : (
              <span>At 0% monthly growth, follower count remains flat at {res.current.toLocaleString()}.</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {res.milestones.map((m) => (
              <div key={m.label} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                <div className="font-bold text-slate-900 dark:text-white">{m.label} Milestone</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {m.status === 'reached' ? (
                    <span className="text-emerald-600 font-semibold">Reached</span>
                  ) : m.months !== null ? (
                    <span className="text-pink-600 font-semibold">~{m.months} months</span>
                  ) : (
                    <span>N/A at 0%</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                onCopy(
                  `Current: ${res.current.toLocaleString()} | Rate: ${res.rate}%/mo\n3m: ${res.month3.toLocaleString()} | 6m: ${res.month6.toLocaleString()} | 12m: ${res.month12.toLocaleString()}`,
                  'fg-copy',
                )
              }
              className="text-xs font-semibold text-pink-600 inline-flex items-center gap-1"
            >
              {copiedKey === 'fg-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Forecast
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function InstagramWinnerPicker({
  isCommentPicker,
  onCopy,
  copiedKey,
}: {
  isCommentPicker: boolean;
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}) {
  const [entrants, setEntrants] = useState(
    `@user_alpha\n@design_lover\n@studio_creative\n@minimalist_vibes\n@alex_photos\n@creator_hq`,
  );
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(1);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [drawResult, setDrawResult] = useState<ReturnType<typeof pickInstagramGiveawayWinners> | null>(null);

  const pickRandom = () => {
    const res = pickInstagramGiveawayWinners({
      rawEntries: entrants,
      winnerCount,
      backupCount,
      removeDuplicates,
      keywordFilter: isCommentPicker ? keywordFilter : '',
    });
    setDrawResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
        Works <strong>ONLY from text you paste below</strong> — cannot connect to Instagram or fetch real {isCommentPicker ? 'comments' : 'entrants'}. Uses local Web Crypto randomness.
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {isCommentPicker ? 'Paste Comments (One per line)' : 'Paste Entrant Usernames (One per line)'}
        </label>
        <textarea
          rows={5}
          value={entrants}
          onChange={(e) => setEntrants(e.target.value)}
          placeholder={isCommentPicker ? 'Paste one comment per line...' : 'Paste one @username or name per line...'}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
        <div>
          <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Winners</label>
          <select
            value={winnerCount}
            onChange={(e) => setWinnerCount(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Winner' : 'Winners'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Backup Alternates</label>
          <select
            value={backupCount}
            onChange={(e) => setBackupCount(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} Backups
              </option>
            ))}
          </select>
        </div>
        {isCommentPicker ? (
          <div>
            <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Keyword Filter (Opt.)</label>
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="e.g., GIVEAWAY"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        ) : (
          <label className="flex items-center gap-2 pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="accent-pink-600 rounded"
            />
            <span>Remove duplicate entries</span>
          </label>
        )}
      </div>

      {isCommentPicker && (
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={removeDuplicates}
            onChange={(e) => setRemoveDuplicates(e.target.checked)}
            className="accent-pink-600 rounded"
          />
          <span>Remove duplicate comment lines</span>
        </label>
      )}

      <button
        type="button"
        onClick={pickRandom}
        className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-pink-700"
      >
        <Trophy className="h-4 w-4" />
        {isCommentPicker ? 'Pick Random Comment' : 'Pick Random Winner'}
      </button>

      {drawResult && !drawResult.valid && drawResult.error && <ValidationErrorAlert message={drawResult.error} />}

      {drawResult && drawResult.valid && (
        <div className="p-5 rounded-xl border-2 border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40 text-center space-y-2">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-widest block">
            Selected {drawResult.winners.length > 1 ? 'Winners' : 'Winner'} ({drawResult.eligibleCount} eligible
            {drawResult.duplicatesRemoved > 0 ? `, ${drawResult.duplicatesRemoved} duplicate removed` : ''})
          </span>
          <div className="space-y-1">
            {drawResult.winners.map((w, idx) => (
              <div key={idx} className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                {drawResult.winners.length > 1 ? `#${idx + 1}: ` : ''}
                {w}
              </div>
            ))}
          </div>
          {drawResult.backups.length > 0 && (
            <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              Backup{drawResult.backups.length > 1 ? 's' : ''}: <span className="font-mono font-semibold">{drawResult.backups.join(', ')}</span>
            </div>
          )}
          {drawResult.warning && <div className="text-[11px] text-amber-700 dark:text-amber-300">{drawResult.warning}</div>}
          <button
            type="button"
            onClick={() =>
              onCopy(
                `Winners:\n${drawResult.winners.join('\n')}${
                  drawResult.backups.length ? `\nBackups:\n${drawResult.backups.join('\n')}` : ''
                }`,
                'winner-copy',
              )
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 pt-1"
          >
            {copiedKey === 'winner-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
}
