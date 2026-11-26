import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  Copy,
  Download,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  analyzeLinkedInHashtags,
  analyzeLinkedInTextLength,
  buildLinkedInContentCalendar,
  calculateLinkedInEngagement,
  formatLinkedInProfileUrl,
  LINKEDIN_FIELD_LIMITS,
  serializeLinkedInCalendarCsv,
  serializeLinkedInCalendarMarkdown,
  type LinkedInCalendarSlot,
  type LinkedInLimitPreset,
} from '../linkedinHelpers';

interface CopyProps {
  onCopy: (txt: string, key: string) => void;
  copiedKey: string | null;
}

function downloadFile(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function InlineErr({message}: {message: string | null}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function CopyBtn({text, copyId, onCopy, copiedKey, label = 'Copy'}: CopyProps & {text: string; copyId: string; label?: string}) {
  const isCopied = copiedKey === copyId;
  return (
    <button
      type="button"
      onClick={() => onCopy(text, copyId)}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
    >
      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{isCopied ? 'Copied' : label}</span>
    </button>
  );
}

// ============================================================================
// 1. LinkedIn Profile URL Formatter
// ============================================================================
export function LinkedinProfileUrlFormatter({onCopy, copiedKey}: CopyProps) {
  const [rawUrl, setRawUrl] = useState('https://www.linkedin.com/in/jordan-patel-pm/?trk=public_profile_browsemap&utm_source=share');
  const [displayName, setDisplayName] = useState('Jordan Patel — LinkedIn');

  const result = useMemo(() => formatLinkedInProfileUrl(rawUrl, displayName), [rawUrl, displayName]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Strips <code>?trk=</code>, <code>?utm_*</code>, and mobile share clutter locally to format clean resume and portfolio links. Does not alter live LinkedIn settings.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Messy LinkedIn URL or Raw /in/ Handle *</span>
          <input
            type="text"
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-name?trk=..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Anchor / Markdown Label</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setRawUrl('')}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear Input
        </button>
      </div>

      {!result.valid ? (
        <InlineErr message={result.error ?? 'Invalid LinkedIn URL.'} />
      ) : (
        <div className="space-y-3">
          {result.strippedParams.length > 0 && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2 text-xs text-emerald-800 dark:text-emerald-200">
              Stripped {result.strippedParams.length} tracking/query token(s):{' '}
              <span className="font-mono">{result.strippedParams.join(', ')}</span>
            </div>
          )}

          {[
            {id: 'url-canonical', label: `Clean Canonical URL (${result.kind === 'company' ? 'Company' : 'Personal'})`, val: result.canonicalUrl ?? ''},
            {id: 'url-short', label: 'Short Resume Display Link', val: result.shortUrl ?? ''},
            {id: 'url-md', label: 'Markdown Link', val: result.markdownLink ?? ''},
            {id: 'url-html', label: 'HTML Anchor Tag', val: result.htmlLink ?? ''},
          ].map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-xs">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-500">{row.label}</div>
                <div className="font-mono text-slate-900 dark:text-white break-all mt-0.5">{row.val}</div>
              </div>
              <CopyBtn text={row.val} copyId={row.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. LinkedIn Engagement Rate Calculator
// ============================================================================
export function LinkedinEngagementCalculator({onCopy, copiedKey}: CopyProps) {
  const [mode, setMode] = useState<'impressions' | 'followers'>('impressions');
  const [denominator, setDenominator] = useState('12000');
  const [likes, setLikes] = useState('210');
  const [comments, setComments] = useState('34');
  const [reposts, setReposts] = useState('18');
  const [clicks, setClicks] = useState('95');

  const res = useMemo(() => {
    const parseNum = (v: string) => (v.trim() === '' ? 0 : Number(v));
    const denomVal = denominator.trim() === '' ? 0 : Number(denominator);
    return calculateLinkedInEngagement({
      mode,
      denominator: denomVal,
      likes: parseNum(likes),
      comments: parseNum(comments),
      reposts: parseNum(reposts),
      clicks: parseNum(clicks),
    });
  }, [mode, denominator, likes, comments, reposts, clicks]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        <strong>Manual entry only</strong> — computes exact LinkedIn engagement percentages in your browser without connecting to your LinkedIn account.
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Formula Mode:</span>
        <button
          type="button"
          onClick={() => setMode('impressions')}
          className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'impressions' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          Impressions-Based ER (Recommended)
        </button>
        <button
          type="button"
          onClick={() => setMode('followers')}
          className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'followers' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          Follower-Based ER
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {mode === 'impressions' ? 'Impressions *' : 'Followers *'}
          </span>
          <input
            type="number"
            min={0}
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Reactions / Likes</span>
          <input
            type="number"
            min={0}
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Comments</span>
          <input
            type="number"
            min={0}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Reposts</span>
          <input
            type="number"
            min={0}
            value={reposts}
            onChange={(e) => setReposts(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Clicks (Optional)</span>
          <input
            type="number"
            min={0}
            value={clicks}
            onChange={(e) => setClicks(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      {!res.valid ? (
        <InlineErr message={res.error ?? 'Invalid engagement numbers.'} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-3xl font-extrabold text-sky-600">{res.er}%</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {res.tier} · {res.total.toLocaleString()} total interactions
              </div>
            </div>
            <CopyBtn
              text={`LinkedIn Engagement Rate: ${res.er}% (${res.tier})\nFormula: ${res.formula}`}
              copyId="li-er-copy"
              label="Copy Report"
              onCopy={onCopy}
              copiedKey={copiedKey}
            />
          </div>

          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-mono text-slate-600 dark:text-slate-300">
            {res.formula}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              ['Reactions Share', `${res.breakdown.likesPct}%`],
              ['Comments Share', `${res.breakdown.commentsPct}%`],
              ['Reposts Share', `${res.breakdown.repostsPct}%`],
              ['Clicks Share', `${res.breakdown.clicksPct}%`],
            ].map(([label, val]) => (
              <div key={label} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 text-center">
                <div className="text-[11px] text-slate-500">{label}</div>
                <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. LinkedIn Post Character Counter
// ============================================================================
export function LinkedinPostCounter({onCopy, copiedKey}: CopyProps) {
  const [preset, setPreset] = useState<LinkedInLimitPreset>('post');
  const [text, setText] = useState(
    'Most product updates bury the real customer outcome under feature checklists.\nHere is a quick 3-line structure that keeps LinkedIn readers past the fold:\n\n1. Open with the concrete bottleneck\n2. Share 1 measurable result or lesson\n3. End with one candid question 🚀',
  );

  const stats = useMemo(() => analyzeLinkedInTextLength(text, preset), [text, preset]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {(Object.keys(LINKEDIN_FIELD_LIMITS) as LinkedInLimitPreset[]).map((key) => {
          const cfg = LINKEDIN_FIELD_LIMITS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPreset(key)}
              className={`px-2.5 py-1.5 rounded-lg font-medium ${
                preset === key
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cfg.label} ({cfg.limit.toLocaleString()})
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <span>
          {stats.label} (Max {stats.limit.toLocaleString()} Unicode chars · emojis = 1 char)
        </span>
        <span className={stats.overLimit ? 'text-rose-600 font-bold' : 'text-sky-600'}>
          {stats.chars.toLocaleString()} / {stats.limit.toLocaleString()} chars ({stats.remaining >= 0 ? `${stats.remaining.toLocaleString()} left` : `${Math.abs(stats.remaining).toLocaleString()} over`})
        </span>
      </div>

      <textarea
        rows={6}
        aria-label="LinkedIn text to count"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or draft your LinkedIn text here..."
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-xs leading-relaxed"
      />

      {stats.overLimit && (
        <InlineErr
          message={`Your ${stats.label} exceeds LinkedIn's ${stats.limit.toLocaleString()}-character limit by ${Math.abs(stats.remaining).toLocaleString()} characters.`}
        />
      )}

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center">
          <div className="text-[11px] text-slate-500">Characters</div>
          <div className={`text-lg font-bold ${stats.overLimit ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{stats.chars.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center">
          <div className="text-[11px] text-slate-500">Words</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.words.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center">
          <div className="text-[11px] text-slate-500">Lines</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.lines.toLocaleString()}</div>
        </div>
      </div>

      {stats.seeMoreFold && text.trim().length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              “See more” Fold Preview (~{stats.seeMoreFold} chars / 3 lines)
            </span>
            <span className={`font-semibold ${stats.isTruncatedAtFold ? 'text-amber-600' : 'text-emerald-600'}`}>
              {stats.isTruncatedAtFold ? 'Wraps behind "...see more"' : 'Fits completely above fold'}
            </span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            <span>{stats.beforeFold}</span>
            {stats.isTruncatedAtFold && <span className="font-bold text-sky-600"> ...see more</span>}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => setText('')}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 font-medium"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear
        </button>
        <CopyBtn text={text} copyId="li-cnt" label="Copy Text" onCopy={onCopy} copiedKey={copiedKey} />
      </div>
    </div>
  );
}

// ============================================================================
// 4. LinkedIn Hashtag Counter
// ============================================================================
export function LinkedinHashtagCounter({onCopy, copiedKey}: CopyProps) {
  const [text, setText] = useState(
    'Practical habits for shipping cleaner docs in 2026.\n\n#ProductManagement #B2BSaaS #RemoteWork #productmanagement #EngineeringCulture',
  );

  const analysis = useMemo(() => analyzeLinkedInHashtags(text), [text]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Counts <code>#tags</code>, detects case-insensitive duplicates, and checks against LinkedIn’s recommended <strong>3–5 tag</strong> range locally. Does not query live LinkedIn volume.
      </div>

      <textarea
        rows={5}
        aria-label="Draft caption or hashtag block"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your LinkedIn post or #hashtag list..."
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-xs"
      />

      {analysis.status === 'empty' ? (
        <InlineErr message={analysis.recommendation} />
      ) : (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
              <div className="text-[11px] text-slate-500">Total #Tags</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{analysis.totalCount}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
              <div className="text-[11px] text-slate-500">Unique Tags</div>
              <div className="text-lg font-bold text-sky-600">{analysis.uniqueCount}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
              <div className="text-[11px] text-slate-500">Duplicates</div>
              <div className={`text-lg font-bold ${analysis.duplicates.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.duplicates.length}
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl border px-3.5 py-2.5 ${
              analysis.status === 'optimal_3_5'
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200'
            }`}
          >
            {analysis.recommendation}
            {analysis.hasMalformedHash ? ' Note: detected spacing issue around a # symbol.' : ''}
          </div>

          {analysis.duplicates.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 px-3.5 py-2.5 text-amber-900 dark:text-amber-200">
              Duplicate tags found:{' '}
              <span className="font-mono font-semibold">
                {analysis.duplicates.map((d) => `${d.tag} (${d.count}×)`).join(', ')}
              </span>
            </div>
          )}

          {analysis.uniqueTags.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100">Tidy Deduplicated Footer (Top 3–5)</span>
                <div className="flex items-center gap-2">
                  <CopyBtn
                    text={analysis.recommendedFooter}
                    copyId="li-hash-top5"
                    label="Copy Top 5"
                    onCopy={onCopy}
                    copiedKey={copiedKey}
                  />
                  {analysis.uniqueCount > 5 && (
                    <CopyBtn
                      text={analysis.allUniqueFooter}
                      copyId="li-hash-all"
                      label="Copy All Unique"
                      onCopy={onCopy}
                      copiedKey={copiedKey}
                    />
                  )}
                </div>
              </div>
              <div className="font-mono text-sky-700 dark:text-sky-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5">
                {analysis.recommendedFooter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. LinkedIn Profile Optimization Checklist (localStorage persisted + export)
// ============================================================================
const CHECKLIST_STORAGE_KEY = 'toolplatform_linkedin_checklist_v1';

interface ChecklistDef {
  id: string;
  section: string;
  label: string;
  emphasis: 'all' | 'job_search' | 'consulting' | 'founder';
  toolLink?: {label: string; url: string};
}

const CHECKLIST_ITEMS: ChecklistDef[] = [
  {
    id: 'headshot',
    section: 'Visual Identity',
    label: 'High-contrast portrait headshot sized cleanly to 400 × 400 px square',
    emphasis: 'all',
    toolLink: {label: '400×400 Resizer', url: '/linkedin-profile-picture-resizer'},
  },
  {
    id: 'banner',
    section: 'Visual Identity',
    label: 'Custom 1584 × 396 banner with value proposition clear of the bottom-left avatar zone',
    emphasis: 'all',
    toolLink: {label: '1584×396 Banner Maker', url: '/linkedin-banner-maker'},
  },
  {
    id: 'vanity-url',
    section: 'URL & Discovery',
    label: 'Clean custom /in/ handle claimed (3–100 chars, no random trailing digits) & tracking params stripped on CV links',
    emphasis: 'all',
    toolLink: {label: 'URL Formatter', url: '/linkedin-profile-url-formatter'},
  },
  {
    id: 'headline',
    section: 'Headline & Summary',
    label: 'Headline (≤220 chars) states target role/audience + measurable outcome instead of only a generic title',
    emphasis: 'all',
    toolLink: {label: 'Headline Counter', url: '/linkedin-post-character-counter'},
  },
  {
    id: 'about',
    section: 'Headline & Summary',
    label: 'About section (≤2,600 chars) hooks readers in the first 260 chars and includes clear proof + contact CTA',
    emphasis: 'all',
  },
  {
    id: 'featured',
    section: 'Featured & Proof',
    label: 'Featured section highlights 2–3 key links (case study, portfolio, calendar, or flagship carousel PDF)',
    emphasis: 'consulting',
    toolLink: {label: 'Carousel PDF Maker', url: '/linkedin-carousel-maker'},
  },
  {
    id: 'experience',
    section: 'Experience & Skills',
    label: 'Recent Experience entries use Action + Metric + Outcome bullets (≤2,000 chars per role)',
    emphasis: 'job_search',
    toolLink: {label: 'Experience Bullets', url: '/linkedin-experience-description-generator'},
  },
  {
    id: 'skills',
    section: 'Experience & Skills',
    label: 'Top 5 core skills prioritized at the top of your Skills section (≤50 total skills)',
    emphasis: 'job_search',
    toolLink: {label: 'Skills Generator', url: '/linkedin-skills-generator'},
  },
  {
    id: 'recommendations',
    section: 'Social Proof',
    label: 'At least 2–3 recent peer, manager, or client Recommendations visible on your profile',
    emphasis: 'founder',
    toolLink: {label: 'Recommendation Builder', url: '/linkedin-recommendation-generator'},
  },
];

export function LinkedinProfileChecklist({onCopy, copiedKey}: CopyProps) {
  const [goal, setGoal] = useState<'all' | 'job_search' | 'consulting' | 'founder'>('all');
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage read error
    }
    return {headshot: true, banner: true};
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage quota error
    }
  }, [checkedIds]);

  const visibleItems = useMemo(
    () => (goal === 'all' ? CHECKLIST_ITEMS : CHECKLIST_ITEMS.filter((it) => it.emphasis === 'all' || it.emphasis === goal)),
    [goal],
  );

  const completedCount = visibleItems.filter((it) => Boolean(checkedIds[it.id])).length;
  const pct = visibleItems.length > 0 ? Math.round((completedCount / visibleItems.length) * 100) : 0;

  const toggle = (id: string) => {
    setCheckedIds((prev) => ({...prev, [id]: !prev[id]}));
  };

  const exportMarkdown = visibleItems
    .map((it) => `- [${checkedIds[it.id] ? 'x' : ' '}] **${it.section}**: ${it.label}`)
    .join('\n');

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Interactive profile audit checklist saved automatically in your browser’s <code>localStorage</code>. Does not scan or log into LinkedIn.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Goal Focus:</span>
          {([
            ['all', 'Full Audit'],
            ['job_search', 'Job Search'],
            ['consulting', 'Consulting / Freelance'],
            ['founder', 'Founder / B2B'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setGoal(val)}
              className={`px-2.5 py-1.5 rounded-lg font-medium ${goal === val ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CopyBtn
            text={`LinkedIn Profile Checklist (${completedCount}/${visibleItems.length} · ${pct}%)\n\n${exportMarkdown}`}
            copyId="li-check-copy"
            label="Copy Report"
            onCopy={onCopy}
            copiedKey={copiedKey}
          />
          <button
            type="button"
            onClick={() => setCheckedIds({})}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between font-semibold">
          <span>Profile Readiness</span>
          <span className="font-mono text-sky-600">{completedCount} / {visibleItems.length} completed ({pct}%)</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-sky-600 transition-all" style={{width: `${pct}%`}} />
        </div>
      </div>

      <div className="space-y-2">
        {visibleItems.map((it) => {
          const done = Boolean(checkedIds[it.id]);
          return (
            <div
              key={it.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs"
            >
              <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-[220px]">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(it.id)}
                  className="mt-0.5 accent-sky-600"
                />
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {it.section}
                  </span>
                  <span className={done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                    {it.label}
                  </span>
                </span>
              </label>

              {it.toolLink && (
                <Link
                  to={it.toolLink.url}
                  className="inline-flex items-center gap-1 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100 shrink-0"
                >
                  {it.toolLink.label} <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 6. LinkedIn Content Calendar Generator (PLAN ONLY + CSV / Markdown export)
// ============================================================================
export function LinkedinContentCalendarGenerator({onCopy, copiedKey}: CopyProps) {
  const [pillarsInput, setPillarsInput] = useState('Engineering Lessons, Product Case Studies, Team Leadership');
  const [postsPerWeek, setPostsPerWeek] = useState('3');
  const [weeks, setWeeks] = useState('2');
  const [startDate, setStartDate] = useState('2026-04-06');
  const [customSlots, setCustomSlots] = useState<LinkedInCalendarSlot[] | null>(null);

  const built = useMemo(
    () =>
      buildLinkedInContentCalendar({
        pillars: pillarsInput.split(/[,\n]+/),
        postsPerWeek: Number(postsPerWeek),
        weeks: Number(weeks),
        startDate,
      }),
    [pillarsInput, postsPerWeek, weeks, startDate],
  );

  const slots = customSlots ?? built.slots;

  const updatePrompt = (id: string, prompt: string) => {
    setCustomSlots((prev) => (prev ?? built.slots).map((s) => (s.id === id ? {...s, prompt} : s)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
        <strong>PLAN ONLY — NOT AI &amp; no auto-publishing.</strong> Generates an editable weekly/monthly schedule offline; export clean CSV or Markdown without connecting any LinkedIn account.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Content Pillars (comma-separated) *</span>
          <input
            type="text"
            value={pillarsInput}
            onChange={(e) => {
              setPillarsInput(e.target.value);
              setCustomSlots(null);
            }}
            placeholder="e.g., Case Studies, Career Tips, Product Updates"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Posts / Week (1–7)</span>
          <select
            value={postsPerWeek}
            onChange={(e) => {
              setPostsPerWeek(e.target.value);
              setCustomSlots(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={String(n)}>
                {n} post{n > 1 ? 's' : ''} / week
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Weeks</span>
            <select
              value={weeks}
              onChange={(e) => {
                setWeeks(e.target.value);
                setCustomSlots(null);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2"
            >
              {[1, 2, 4, 6, 8].map((w) => (
                <option key={w} value={String(w)}>
                  {w}w
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCustomSlots(null);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2"
            />
          </label>
        </div>
      </div>

      {!built.valid ? (
        <InlineErr message={built.error ?? 'Check your calendar inputs.'} />
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <CalendarIcon className="h-4 w-4 text-sky-600" />
              {slots.length} Scheduled Slots ({weeks} weeks · {postsPerWeek}/wk)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <CopyBtn
                text={serializeLinkedInCalendarMarkdown(slots)}
                copyId="li-cal-md"
                label="Copy Markdown Table"
                onCopy={onCopy}
                copiedKey={copiedKey}
              />
              <button
                type="button"
                onClick={() => downloadFile('linkedin_content_calendar.csv', serializeLinkedInCalendarCsv(slots), 'text/csv;charset=utf-8')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700"
              >
                <Download className="h-3.5 w-3.5" /> Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Date</th>
                  <th className="px-3 py-2.5 font-semibold">Pillar</th>
                  <th className="px-3 py-2.5 font-semibold">Format</th>
                  <th className="px-3 py-2.5 font-semibold">Editable Draft Prompt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {slots.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2.5 font-mono whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{s.date}</div>
                      <div className="text-[11px] text-slate-500">W{s.week} · {s.weekday}</div>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-sky-700 dark:text-sky-300">{s.pillar}</td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{s.format}</td>
                    <td className="px-3 py-2.5 min-w-[240px]">
                      <input
                        type="text"
                        aria-label={`Prompt for ${s.date}`}
                        value={s.prompt}
                        onChange={(e) => updatePrompt(s.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs"
                      />
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
