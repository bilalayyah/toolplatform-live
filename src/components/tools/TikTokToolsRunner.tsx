import React, {useState, useMemo} from 'react';
import {Copy, Check, Video, Sparkles, Download, Trophy, ImageIcon, RefreshCw, Hash, Shuffle, FileText, Type, AlignLeft, MessageSquare, Reply, Send, Clock, Calendar, Maximize2, Minimize, Ratio, HardDrive, TrendingUp, Zap, Film} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  generateTikTokBios,
  formatTikTokProfileBio,
  validateTikTokUsername,
  generateTikTokUsernames,
  calculateTikTokEngagement,
  calculateTikTokEarnings,
  calculateTikTokCreatorEarningsProjected,
  generateTikTokHashtags,
  generateTikTokCaptions,
  generateTikTokTrendingHashtagIdeas,
  generateTikTokVideoIdeas,
  generateTikTokViralVideoIdeas,
  generateTikTokHooks,
  generateTikTokScript,
  generateTikTokTitles,
  generateTikTokDescriptions,
  generateTikTokComments,
  generateTikTokReplies,
  generateTikTokDMs,
  parseTikTokHashtags,
  removeDuplicateHashtags,
  mixTikTokHashtags,
  formatTikTokText,
  countTikTokCharacters,
  calculateTikTokGrowth,
  calculateTikTokLength,
  generateTikTokCalendar,
  getTikTokPostingTimes,
  checkTikTokAspectRatio,
  estimateTikTokFileSize,
  convertToStylishText,
} from './tiktokHelpers';
import {convertToUnicodeFonts} from './instagramHelpers';

interface Props {
  tool: Tool;
}

export function TikTokToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/10 dark:bg-white/10 text-slate-950 dark:text-white">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · Zero AI · Real in-browser execution
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'tiktok-username-generator' ? (
          <TkUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-username-format-checker' ? (
          <TkUsernameChecker onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-bio-generator' ? (
          <TkBioGenerator onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-profile-bio-formatter' ? (
          <TkBioFormatter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-stylish-text-generator' ? (
          <TkStylishTextGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-font-generator' ? (
          <TkFontGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-engagement-rate-calculator' ? (
          <TkEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-money-calculator' ? (
          <TkMoneyCalc onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-earnings-calculator' ? (
          <TkEarningsCalc onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-giveaway-winner-picker' ? (
          <TkWinnerPicker isComment={false} onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-random-comment-picker' ? (
          <TkWinnerPicker isComment={true} onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-video-cover-maker' ? (
          <TkCoverMaker />
        ) : tool.slug === 'tiktok-thumbnail-maker' ? (
          <TkThumbnailMaker />
        ) : tool.slug === 'tiktok-image-resizer' ? (
          <TkImageResizerTool />
        ) : tool.slug === 'tiktok-caption-generator' ? (
          <TkCaptionGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-hashtag-generator' ? (
          <TkHashtagGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-trending-hashtag-ideas-generator' ? (
          <TkTrendingHashtagsGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-video-idea-generator' ? (
          <TkVideoIdeaGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-viral-video-idea-generator' ? (
          <TkViralVideoIdeaGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-hook-generator' ? (
          <TkHookGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-script-generator' ? (
          <TkScriptGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-video-title-generator' ? (
          <TkTitleGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-description-generator' ? (
          <TkDescriptionGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-comment-generator' ? (
          <TkCommentGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-reply-generator' ? (
          <TkReplyGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-dm-generator' ? (
          <TkDmGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-hashtag-counter' ? (
          <TkHashtagCounter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-hashtag-mixer' ? (
          <TkHashtagMixer onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-text-formatter' ? (
          <TkTextFormatter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-character-counter' ? (
          <TkCharacterCounterTool />
        ) : tool.slug === 'tiktok-follower-growth-calculator' ? (
          <TkFollowerGrowthCalc />
        ) : tool.slug === 'tiktok-video-length-calculator' ? (
          <TkVideoLengthCalc />
        ) : tool.slug === 'tiktok-content-calendar-generator' ? (
          <TkContentCalendarGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-best-posting-time-planner' ? (
          <TkBestTimePlanner onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'tiktok-image-compressor' ? (
          <TkImageCompressorTool />
        ) : tool.slug === 'tiktok-video-aspect-ratio-checker' ? (
          <TkAspectRatioChecker />
        ) : tool.slug === 'tiktok-video-file-size-estimator' ? (
          <TkFileSizeEstimator />
        ) : (
          <TkGeneralFallback toolName={tool.name} />
        )}
      </div>
    </div>
  );
}

// --- 1. Username Generator ---
function TkUsernameGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [base, setBase] = useState('creator');
  const [seed, setSeed] = useState(0);
  const list = useMemo(() => generateTikTokUsernames(base), [base, seed]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enter Name or Niche</label>
        <input type="text" value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. fashion, fitness, vlogs" className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm" />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Syntax-valid handles with character counts:</span>
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Shuffle
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {list.map((u, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span>{u.handle}</span>
              <span className="text-[10px] text-slate-400">({u.length} chars)</span>
            </div>
            <button onClick={() => onCopy(u.handle, `un-${i}`)} className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              {copiedKey === `un-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `un-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. Username Format Checker ---
function TkUsernameChecker({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [handle, setHandle] = useState('@creator_123');
  const res = useMemo(() => validateTikTokUsername(handle), [handle]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">TikTok Handle to Check</label>
        <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@myhandle" className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-mono" />
      </div>
      <div className={`p-4 rounded-xl border space-y-2 text-xs ${res.valid ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200' : 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200'}`}>
        <div className="font-bold text-sm flex items-center gap-2">
          <span>{res.valid ? '✓ Valid TikTok Username Format' : '✗ Format Rules Not Met'}</span>
        </div>
        <div className="space-y-1 pt-1">
          {res.checks.map((c, i) => (
            <div key={i} className={`flex items-center gap-2 ${c.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
              <span>{c.passed ? '✓' : '✗'}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-[11px] text-slate-500 italic">
        Note: This tool checks syntax and length rules only. Actual handle availability must be verified inside the TikTok mobile app.
      </div>
    </div>
  );
}

// --- 3. Bio Generator ---
function TkBioGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Content Creator & Designer');
  const [cta, setCta] = useState('Grab free guides 👇');
  const bios = useMemo(() => generateTikTokBios({niche, cta}), [niche, cta]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Niche / What you post</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Call to Action (CTA)</label>
          <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs bg-slate-50 dark:bg-slate-950" />
        </div>
      </div>
      <div className="space-y-3">
        {bios.map((b, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>{b.title}</span>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] ${b.length <= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {b.length}/80 chars
                </span>
                <button onClick={() => onCopy(b.bio, `tk-bio-${i}`)} className="text-emerald-600 flex items-center gap-1">
                  {copiedKey === `tk-bio-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === `tk-bio-${i}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <pre className="font-sans whitespace-pre-line text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              {b.bio}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. Profile Bio Formatter ---
function TkBioFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [line1, setLine1] = useState('✨ Digital Creator');
  const [line2, setLine2] = useState('💡 Daily tips & guides');
  const [line3, setLine3] = useState('👇 Free resource link');
  const res = useMemo(() => formatTikTokProfileBio([line1, line2, line3]), [line1, line2, line3]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Line 1 (Role / Headline)</label>
          <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Line 2 (Niche / Value)</label>
          <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Line 3 (CTA Pointer)</label>
          <input type="text" value={line3} onChange={(e) => setLine3(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs bg-slate-50 dark:bg-slate-950" />
        </div>
      </div>
      <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Formatted Bio Preview</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${res.length <= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {res.length} / 80 characters {res.length > 80 ? '(Exceeds TikTok Limit)' : ''}
          </span>
        </div>
        <pre className="font-sans whitespace-pre-line text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border text-xs">
          {res.bio}
        </pre>
        <button onClick={() => onCopy(res.bio, 'fmt-bio')} className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold">
          {copiedKey === 'fmt-bio' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedKey === 'fmt-bio' ? 'Copied Formatted Bio' : 'Copy Formatted Bio'}</span>
        </button>
      </div>
    </div>
  );
}

// --- 5. Stylish Text Generator (Decorative symbols/frames) ---
function TkStylishTextGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [txt, setTxt] = useState('TikTok Studio');
  const list = useMemo(() => convertToStylishText(txt), [txt]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Text (Decorative Styles)</label>
        <input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Type text to decorate" className="w-full rounded-xl border p-3 text-sm bg-slate-50 dark:bg-slate-950" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((f) => (
          <div key={f.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <div className="overflow-hidden pr-2">
              <span className="text-[10px] text-slate-400 block">{f.name}</span>
              <span className="text-sm font-medium truncate block">{f.result}</span>
            </div>
            <button onClick={() => onCopy(f.result, f.id)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === f.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === f.id ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. Font Generator (Unicode font faces) ---
function TkFontGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [txt, setTxt] = useState('TikTok Studio');
  const list = useMemo(() => convertToUnicodeFonts(txt), [txt]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Text (Unicode Font Faces)</label>
        <input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Type text for fonts" className="w-full rounded-xl border p-3 text-sm bg-slate-50 dark:bg-slate-950" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((f) => (
          <div key={f.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <div className="overflow-hidden pr-2">
              <span className="text-[10px] text-slate-400 block">{f.name}</span>
              <span className="text-sm font-medium truncate block">{f.result}</span>
            </div>
            <button onClick={() => onCopy(f.result, f.id)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === f.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === f.id ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 7. Engagement Rate Calculator (By Followers / By Views toggle) ---
function TkEngagementCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [mode, setMode] = useState<'followers' | 'views'>('followers');
  const [baseCount, setBaseCount] = useState('10000');
  const [l, setL] = useState('800');
  const [c, setC] = useState('60');
  const [s, setS] = useState('40');
  const res = useMemo(() => calculateTikTokEngagement({mode, baseCount: parseInt(baseCount, 10) || 1, likes: parseInt(l, 10) || 0, comments: parseInt(c, 10) || 0, shares: parseInt(s, 10) || 0}), [mode, baseCount, l, c, s]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit text-xs font-semibold">
        <button onClick={() => setMode('followers')} className={`px-4 py-2 rounded-lg transition ${mode === 'followers' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-600'}`}>
          By Followers
        </button>
        <button onClick={() => setMode('views')} className={`px-4 py-2 rounded-lg transition ${mode === 'views' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-600'}`}>
          By Views
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold mb-1">{mode === 'followers' ? 'Follower Count' : 'Video Views'}</label>
          <input type="number" value={baseCount} onChange={(e) => setBaseCount(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Likes</label>
          <input type="number" value={l} onChange={(e) => setL(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Comments</label>
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Shares</label>
          <input type="number" value={s} onChange={(e) => setS(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-2">
        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{res.er}%</div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{res.tier}</div>
        <div className="text-xs text-slate-500">Total Interactions: {res.totalInteractions.toLocaleString()} (Calculated by {mode})</div>
      </div>
    </div>
  );
}

// --- 8. Money Calculator ---
function TkMoneyCalc({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [views, setViews] = useState('250000');
  const [rpm, setRpm] = useState('0.04');
  const res = useMemo(() => calculateTikTokEarnings({views: parseInt(views, 10) || 0, cpm: parseFloat(rpm) || 0.04}), [views, rpm]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        ESTIMATE ONLY. Creator Rewards RPM is roughly $0.02–$0.04 per 1,000 qualified views. 250,000 views at $0.04 RPM yields approximately $10.00.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Total Views</label>
          <input type="number" value={views} onChange={(e) => setViews(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Estimated RPM ($)</label>
          <input type="number" step="0.01" value={rpm} onChange={(e) => setRpm(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-2">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estimated Payout</div>
        <div className="text-3xl font-extrabold text-slate-950 dark:text-white">${res.mid.toFixed(2)}</div>
        <div className="text-xs text-slate-500">Range: ${res.min.toFixed(2)} – ${res.max.toFixed(2)}</div>
      </div>
    </div>
  );
}

// --- 9. Earnings Calculator (Distinct from Money Calculator) ---
function TkEarningsCalc({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [avgViews, setAvgViews] = useState('50000');
  const [videosPerMonth, setVideosPerMonth] = useState('12');
  const [er, setEr] = useState('4.5');
  const [rpm, setRpm] = useState('0.03');
  const [sponsorshipFee, setSponsorshipFee] = useState('250');

  const res = useMemo(() => calculateTikTokCreatorEarningsProjected({
    avgViews: parseInt(avgViews, 10) || 0,
    videosPerMonth: parseInt(videosPerMonth, 10) || 0,
    engagementRate: parseFloat(er) || 0,
    rpm: parseFloat(rpm) || 0.03,
    sponsorshipFee: parseFloat(sponsorshipFee) || 0,
  }), [avgViews, videosPerMonth, er, rpm, sponsorshipFee]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        ESTIMATE ONLY. Projects monthly Creator Rewards earnings alongside estimated brand sponsorships based on average video views and engagement.
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Avg Views / Video</label>
          <input type="number" value={avgViews} onChange={(e) => setAvgViews(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Videos / Month</label>
          <input type="number" value={videosPerMonth} onChange={(e) => setVideosPerMonth(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Engagement Rate (%)</label>
          <input type="number" step="0.1" value={er} onChange={(e) => setEr(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Creator RPM ($)</label>
          <input type="number" step="0.01" value={rpm} onChange={(e) => setRpm(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Sponsorship Fee / Post ($)</label>
          <input type="number" value={sponsorshipFee} onChange={(e) => setSponsorshipFee(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Projected Monthly Earnings (Estimate Only)</div>
        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">${res.totalMonthly.toLocaleString()}</div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
          <div>Formula: Sponsorships = Videos/mo × Fee × (1 + 2 × Engagement Rate)</div>
          <div>Breakdown: Creator Rewards (${res.rewardsMonthly.toLocaleString()}) + Brand Sponsorships (${res.sponsorshipMonthly.toLocaleString()}) = Total (${res.totalMonthly.toLocaleString()})</div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-slate-600 dark:text-slate-400">
          <div>Creator Rewards: <strong className="text-slate-950 dark:text-white">${res.rewardsMonthly.toLocaleString()}</strong></div>
          <div>Brand Sponsorships: <strong className="text-slate-950 dark:text-white">${res.sponsorshipMonthly.toLocaleString()}</strong></div>
        </div>
      </div>
    </div>
  );
}

// --- 10 & 11. Winner / Comment Picker ---
function TkWinnerPicker({isComment, onCopy, copiedKey}: {isComment: boolean; onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [list, setList] = useState(isComment ? '@user1: Great tutorial!\n@user2: Very helpful tips\n@user3: Love this!' : '@user1_official\n@creator_jane\n@tiktok_pro\n@design_daily');
  const [winner, setWinner] = useState<string | null>(null);

  const pick = () => {
    const arr = list.split('\n').map((l) => l.trim()).filter(Boolean);
    if (arr.length === 0) return;
    setWinner(arr[Math.floor(Math.random() * arr.length)]);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 text-xs">
        Pasted entries only — picks fairly and randomly from the text list you provide. Cannot fetch live TikTok comments.
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{isComment ? 'Paste Comments (One per line)' : 'Paste Entrant Names / Handles (One per line)'}</label>
        <textarea rows={5} value={list} onChange={(e) => setList(e.target.value)} className="w-full rounded-xl border p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950" />
      </div>
      <button onClick={pick} className="w-full sm:w-auto bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm">
        {isComment ? 'Pick Random Comment' : 'Pick Random Winner'}
      </button>
      {winner && (
        <div className="p-6 rounded-2xl border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 text-center space-y-2">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Selected Result</div>
          <div className="text-xl font-mono font-extrabold text-slate-950 dark:text-white">{winner}</div>
          <button onClick={() => onCopy(winner, 'win')} className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 px-4 py-1.5 rounded-lg border font-semibold">
            {copiedKey === 'win' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'win' ? 'Copied Winner' : 'Copy Winner'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// --- 12, 13 & 14. Cover-crop Image Tools (No distortion) ---
function TkCoverMaker() {
  const [outUrl, setOutUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1080, 1920);

        // Cover-crop math (no distortion, center crop)
        const targetAspect = 1080 / 1920;
        const imgAspect = img.width / img.height;
        let sw = img.width, sh = img.height, sx = 0, sy = 0;
        if (imgAspect > targetAspect) {
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetAspect;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1080, 1920);

        // Safe area frame guide
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 4;
        ctx.strokeRect(100, 300, 880, 1320);

        setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Scales and cover-crops your uploaded image to 1080 × 1920 px (9:16 TikTok Vertical Format) with zero image distortion.
      </div>
      <div className="relative inline-block">
        <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 text-xs font-semibold">
          <ImageIcon className="h-4 w-4" />
          <span>Upload Cover Image (Max 20 MB)</span>
        </button>
      </div>
      {outUrl && (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4">
          <div className="h-80 aspect-[9/16] mx-auto flex justify-center bg-black rounded-lg overflow-hidden shadow">
            <img src={outUrl} alt="TikTok Cover" className="h-full object-cover" />
          </div>
          <div className="flex justify-between items-center text-xs text-white">
            <span className="font-mono">1080 × 1920 px (9:16 Unwatermarked)</span>
            <a href={outUrl} download="tiktok_cover_1080x1920.jpg" className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow">
              <Download className="h-4 w-4" /> Download Cover JPG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function TkThumbnailMaker() {
  return <TkCoverMaker />;
}

function TkImageResizerTool() {
  return <TkCoverMaker />;
}


// --- 15 to 26: The 12 Rebuilt Generators with explicit Generate/Regenerate + Copy All + Reset ---

function TkCaptionGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('morning coffee routine');
  const [style, setStyle] = useState('Short & punchy');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokCaptions(topic, style, parseInt(count, 10) || 5), [topic, style, count, seed]);
  const allText = list.join('\n\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Video Topic / Moment</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Short & punchy</option>
            <option>Storytelling</option>
            <option>Question</option>
            <option>Humorous</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold">Variations:</label>
          <select value={count} onChange={(e) => setCount(e.target.value)} className="border rounded-lg p-1.5 text-xs bg-white dark:bg-slate-900">
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
            <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
          </button>
          <button onClick={() => {setTopic('morning coffee routine'); setStyle('Short & punchy');}} className="text-xs text-slate-500 hover:text-slate-900">
            Reset
          </button>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Captions</span>
          <button onClick={() => onCopy(allText, 'all-caps')} className="inline-flex items-center gap-1 text-emerald-600">
            {copiedKey === 'all-caps' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-caps' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((c, i) => (
          <div key={i} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-start gap-3">
            <div className="space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-medium">{c}</p>
              <span className="text-[10px] text-slate-400">{c.length} / 4,000 chars</span>
            </div>
            <button onClick={() => onCopy(c, `cap-${i}`)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === `cap-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `cap-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkHashtagGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('baking');
  const [count, setCount] = useState('10');
  const [seed, setSeed] = useState(0);

  const tags = useMemo(() => generateTikTokHashtags(topic, parseInt(count, 10) || 10), [topic, count, seed]);
  const allTagsStr = tags.join(' ');

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Suggestions built from your topic (NOT live trending data). Genuinely related topic words (no #viral #fyp #foryou filler).
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Topic / Niche Keyword</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Number of Hashtags</label>
          <select value={count} onChange={(e) => setCount(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="5">5 tags</option>
            <option value="10">10 tags</option>
            <option value="15">15 tags</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setTopic('baking'); setCount('10');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Generated Hashtag Set</span>
          <button onClick={() => onCopy(allTagsStr, 'all-tags')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-tags' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-tags' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {tags.map((t, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span>{t}</span>
              <button onClick={() => onCopy(t, `tag-${i}`)} className="text-emerald-600 hover:text-emerald-700">
                {copiedKey === `tag-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TkTrendingHashtagsGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('budget travel');
  const [count, setCount] = useState('3');
  const [seed, setSeed] = useState(0);

  const ideas = useMemo(() => generateTikTokTrendingHashtagIdeas(niche, parseInt(count, 10) || 3), [niche, count, seed]);
  const allStr = ideas.map(g => g.tags.join(' ')).join(' ');

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        NOTE: These are evergreen category template ideas only — NOT live trending data.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Niche / Topic</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Number of Idea Packs</label>
          <select value={count} onChange={(e) => setCount(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option value="2">2 packs</option>
            <option value="3">3 packs</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setNiche('budget travel'); setCount('3');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Hashtag Idea Packs</span>
          <button onClick={() => onCopy(allStr, 'all-packs')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-packs' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-packs' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {ideas.map((group, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>{group.angle}</span>
              <button onClick={() => onCopy(group.tags.join(' '), `t-group-${i}`)} className="text-emerald-600 flex items-center gap-1">
                {copiedKey === `t-group-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `t-group-${i}` ? 'Copied' : 'Copy Set'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {group.tags.map((t, j) => (
                <span key={j} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkVideoIdeaGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('freelance design');
  const [audience, setAudience] = useState('beginner designers');
  const [type, setType] = useState('Any');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const ideas = useMemo(() => generateTikTokVideoIdeas(niche, audience, type, parseInt(count, 10) || 5), [niche, audience, type, count, seed]);
  const allStr = ideas.map(item => `${item.title} - Angle: ${item.angle}`).join('\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Niche / Topic</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Audience</label>
          <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Video Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Any</option>
            <option>Tutorial</option>
            <option>Story</option>
            <option>Challenge</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setNiche('freelance design'); setAudience('beginner designers');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Generated Ideas</span>
          <button onClick={() => onCopy(allStr, 'all-ideas')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-ideas' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-ideas' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {ideas.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-1.5">
            <div className="flex justify-between items-start font-bold">
              <span>{i + 1}. {item.title}</span>
              <button onClick={() => onCopy(`${item.title} - Angle: ${item.angle}`, `idea-${i}`)} className="text-emerald-600 flex items-center gap-1 shrink-0">
                {copiedKey === `idea-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `idea-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400"><strong>Filming Angle:</strong> {item.angle}</p>
            <p className="text-slate-500 italic">Why it works: {item.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkViralVideoIdeaGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('personal finance');
  const [audience, setAudience] = useState('beginners');
  const [type, setType] = useState('Any');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const ideas = useMemo(() => generateTikTokViralVideoIdeas(niche, audience, type, parseInt(count, 10) || 5), [niche, audience, type, count, seed]);
  const allStr = ideas.map(item => `${item.title} (${item.format})`).join('\n');

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        Format brainstorming ideas only. Nothing guarantees virality, views, likes or algorithmic reach.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Niche / Topic</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Audience</label>
          <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Video Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Any</option>
            <option>Challenge</option>
            <option>Reaction</option>
            <option>Hot take</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setNiche('personal finance'); setAudience('beginners');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Viral Concept Ideas (5+ items)</span>
          <button onClick={() => onCopy(allStr, 'all-viral')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-viral' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-viral' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {ideas.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-1.5">
            <div className="flex justify-between items-start font-bold">
              <span>{i + 1}. {item.title}</span>
              <button onClick={() => onCopy(`${item.title} (${item.format})`, `viral-${i}`)} className="text-emerald-600 flex items-center gap-1 shrink-0">
                {copiedKey === `viral-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `viral-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400"><strong>Format:</strong> {item.format}</p>
            <p className="text-slate-500 italic">Note: {item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkHookGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('morning routines');
  const [style, setStyle] = useState('Question');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokHooks(topic, style, parseInt(count, 10) || 5), [topic, style, count, seed]);
  const allStr = list.join('\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Video Topic</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Hook Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Question</option>
            <option>Bold claim</option>
            <option>Story opener</option>
            <option>Contrarian</option>
            <option>POV</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setTopic('morning routines'); setStyle('Question');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Hooks</span>
          <button onClick={() => onCopy(allStr, 'all-hooks')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-hooks' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-hooks' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((h, i) => (
          <div key={i} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-3">
            <div>
              <span className="font-medium text-slate-900 dark:text-white">{h}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{h.length} characters</span>
            </div>
            <button onClick={() => onCopy(h, `hook-${i}`)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === `hook-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `hook-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkScriptGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('productivity habits');
  const [length, setLength] = useState('30s');
  const [tone, setTone] = useState('Casual');
  const [seed, setSeed] = useState(0);

  const res = useMemo(() => generateTikTokScript(topic, length, tone), [topic, length, tone, seed]);
  const fullScript = res.sections.map(s => `[${s.title}]\n${s.script}`).join('\n\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Video Topic</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Target Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="15s">15 Seconds (~38 words)</option>
            <option value="30s">30 Seconds (~72 words)</option>
            <option value="60s">60 Seconds (~150 words)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option>Casual</option>
            <option>Educational</option>
            <option>Funny</option>
            <option>Bold</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setTopic('productivity habits'); setLength('30s'); setTone('Casual');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-4 text-xs">
        <div className="flex justify-between items-center font-bold border-b pb-2">
          <span>Script Outline ({res.totalWords} estimated words)</span>
          <button onClick={() => onCopy(fullScript, 'full-script')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'full-script' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'full-script' ? 'Copied Script' : 'Copy Full Script'}</span>
          </button>
        </div>
        <div className="space-y-3">
          {res.sections.map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 space-y-1">
              <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span>{s.title} ({s.duration})</span>
                <span className="text-[10px] text-slate-400">{s.words} words</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 font-sans">{s.script}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TkTitleGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('apartment tour');
  const [style, setStyle] = useState('Clicky');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokTitles(topic, style, parseInt(count, 10) || 5), [topic, style, count, seed]);
  const allStr = list.map(i => i.title).join('\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Topic Keyword</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Title Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Clicky</option>
            <option>Descriptive</option>
            <option>Funny</option>
            <option>Question</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Variations</label>
          <select value={count} onChange={(e) => setCount(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option value="5">5 titles</option>
            <option value="10">10 titles</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setTopic('apartment tour'); setStyle('Clicky');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Titles</span>
          <button onClick={() => onCopy(allStr, 'all-titles')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-titles' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-titles' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((item, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-3">
            <div>
              <span className="font-medium text-slate-900 dark:text-white">{item.title}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{item.length} characters</span>
            </div>
            <button onClick={() => onCopy(item.title, `title-${i}`)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === `title-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `title-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkDescriptionGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('remote work setup');
  const [tone, setTone] = useState('Casual');
  const [includeTags, setIncludeTags] = useState(true);
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokDescriptions(topic, tone, includeTags), [topic, tone, includeTags, seed]);
  const allStr = list.join('\n\n---\n\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Video Topic</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Casual</option>
            <option>Informative</option>
            <option>Promotional</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs">
          <input type="checkbox" checked={includeTags} onChange={(e) => setIncludeTags(e.target.checked)} className="rounded" />
          <span>Include relevant hashtags</span>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
            <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
          </button>
          <button onClick={() => {setTopic('remote work setup'); setIncludeTags(true);}} className="text-xs text-slate-500">Reset</button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Generated Descriptions</span>
          <button onClick={() => onCopy(allStr, 'all-desc')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-desc' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-desc' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((d, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>Description Option #{i + 1} ({d.length} chars)</span>
              <button onClick={() => onCopy(d, `desc-${i}`)} className="text-emerald-600 flex items-center gap-1">
                {copiedKey === `desc-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `desc-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-sans whitespace-pre-line text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border">
              {d}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkCommentGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('remote work burnout');
  const [style, setStyle] = useState('Supportive');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokComments(topic, style, parseInt(count, 10) || 5), [topic, style, count, seed]);
  const allStr = list.join('\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Video Topic / Description</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Comment Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Supportive</option>
            <option>Insightful</option>
            <option>Funny</option>
            <option>Question</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setTopic('remote work burnout'); setStyle('Supportive');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Comments</span>
          <button onClick={() => onCopy(allStr, 'all-coms')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-coms' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-coms' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((c, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-3">
            <div>
              <span className="font-medium">{c}</span>
              <span className="text-[10px] text-slate-400 block">{c.length} / 150 chars</span>
            </div>
            <button onClick={() => onCopy(c, `com-${i}`)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === `com-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `com-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkReplyGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [comment, setComment] = useState('Where did you get this desk?');
  const [intent, setIntent] = useState('Add value');
  const [tone, setTone] = useState('Friendly');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokReplies(comment, intent, tone), [comment, intent, tone, seed]);
  const allStr = list.join('\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-3">
          <label className="block font-semibold mb-1">Pasted Fan Comment</label>
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Reply Intent</label>
          <select value={intent} onChange={(e) => setIntent(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Agree</option>
            <option>Add value</option>
            <option>Respectful disagreement</option>
            <option>Ask a question</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Friendly</option>
            <option>Witty</option>
            <option>Thoughtful</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button onClick={() => setSeed(s => s + 1)} className="w-full inline-flex justify-center items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-2.5 rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" /> Generate
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Replies</span>
          <button onClick={() => onCopy(allStr, 'all-reps')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-reps' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-reps' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((r, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-3">
            <div>
              <span className="font-medium">{r}</span>
              <span className="text-[10px] text-slate-400 block">{r.length} / 150 chars</span>
            </div>
            <button onClick={() => onCopy(r, `rep-${i}`)} className="text-emerald-600 shrink-0 font-semibold flex items-center gap-1">
              {copiedKey === `rep-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === `rep-${i}` ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkDmGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [purpose, setPurpose] = useState('Collab pitch');
  const [recipient, setRecipient] = useState('creator');
  const [tone, setTone] = useState('Friendly');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTikTokDMs(purpose, recipient, tone), [purpose, recipient, tone, seed]);
  const allStr = list.join('\n\n');

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Drafts DM text only — never sends a message on TikTok.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Purpose</label>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option>Collab pitch</option>
            <option>Thank-you</option>
            <option>Question</option>
            <option>Introduction</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Recipient Name / Handle</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
        </button>
        <button onClick={() => {setPurpose('Collab pitch'); setRecipient('creator');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>DM Drafts (3-5 options)</span>
          <button onClick={() => onCopy(allStr, 'all-dms')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'all-dms' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-dms' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((d, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>Draft #{i + 1} ({d.length} chars)</span>
              <button onClick={() => onCopy(d, `dm-${i}`)} className="text-emerald-600 flex items-center gap-1">
                {copiedKey === `dm-${i}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `dm-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-sans">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- 27 to 37: The 11 Placeholder Tools Rebuilt with Real Logic ---

function TkHashtagCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Check out this amazing setup! #tiktoktips #growth #tiktoktips #viral #creator');
  const res = useMemo(() => parseTikTokHashtags(text), [text]);

  const handleRemoveDuplicates = () => {
    const cleanStr = removeDuplicateHashtags(text);
    setText(text.replace(/#[a-zA-Z0-9_]+/g, '').trim() + ' ' + cleanStr);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Paste Caption or Hashtag Block</label>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={handleRemoveDuplicates} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl">
          Remove Duplicates in One Click
        </button>
        <button onClick={() => setText('')} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-slate-950 dark:text-white">{res.count}</div>
          <div className="text-[10px] text-slate-500 uppercase">Unique Tags</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-rose-600">{res.duplicates.length}</div>
          <div className="text-[10px] text-slate-500 uppercase">Duplicates</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 sm:col-span-2">
          <div className="text-xl font-bold text-slate-950 dark:text-white">{res.chars}</div>
          <div className="text-[10px] text-slate-500 uppercase">Total Characters</div>
        </div>
      </div>
      {res.duplicates.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs">
          Duplicates found: {res.duplicates.join(', ')}
        </div>
      )}
      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Clean Unique Tags List (One per line)</span>
          <button onClick={() => onCopy(res.tags.join('\n'), 'clean-tags')} className="inline-flex items-center gap-1 text-emerald-600">
            {copiedKey === 'clean-tags' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'clean-tags' ? 'Copied' : 'Copy List'}</span>
          </button>
        </div>
        <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg whitespace-pre-line">
          {res.tags.join('\n') || 'No hashtags found'}
        </pre>
      </div>
    </div>
  );
}

function TkHashtagMixer({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [setA, setSetA] = useState('#travel #explore #wanderlust');
  const [setB, setSetB] = useState('#europe #paris #travel #vlog');
  const [setC, setSetC] = useState('#trending #viral');
  const [shuffle, setShuffle] = useState(true);
  const [targetLimit, setTargetLimit] = useState('10');
  const [seed, setSeed] = useState(0);

  const res = useMemo(() => mixTikTokHashtags(setA, setB, setC, shuffle, parseInt(targetLimit, 10) || 10), [setA, setB, setC, shuffle, targetLimit, seed]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Set A</label>
          <input type="text" value={setA} onChange={(e) => setSetA(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-[11px]" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Set B</label>
          <input type="text" value={setB} onChange={(e) => setSetB(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-[11px]" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Set C (Optional)</label>
          <input type="text" value={setC} onChange={(e) => setSetC(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-[11px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-center">
        <div>
          <label className="block font-semibold mb-1">Target Tag Count (Max limit)</label>
          <input type="number" value={targetLimit} onChange={(e) => setTargetLimit(e.target.value)} className="w-full border p-2 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div className="flex items-center gap-4 pt-4">
          <label className="flex items-center gap-2 cursor-pointer font-semibold">
            <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} className="rounded" />
            <span>Randomize / Shuffle</span>
          </label>
          <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1 font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <RefreshCw className="h-3.5 w-3.5" /> Re-mix
          </button>
          <button onClick={() => {setSetA(''); setSetB(''); setSetC('');}} className="text-slate-500">Reset</button>
        </div>
      </div>
      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Merged & Deduplicated ({res.count} tags)</span>
          <button onClick={() => onCopy(res.result, 'mix-res')} className="inline-flex items-center gap-1 text-emerald-600">
            {copiedKey === 'mix-res' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'mix-res' ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
        <div className="font-mono text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-lg text-slate-800 dark:text-slate-200">
          {res.result || 'No hashtags provided'}
        </div>
      </div>
    </div>
  );
}

function TkTextFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('  hello   world!   this is   a test caption.  ');
  const [upper, setUpper] = useState(false);
  const [lower, setLower] = useState(false);
  const [capitalize, setCapitalize] = useState(false);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [trimBreaks, setTrimBreaks] = useState(true);

  const formatted = useMemo(() => formatTikTokText(text, {upper, lower, capitalize, trimSpaces, trimBreaks}), [text, upper, lower, capitalize, trimSpaces, trimBreaks]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Text to Format</label>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium items-center">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50 dark:bg-slate-900">
          <input type="checkbox" checked={trimSpaces} onChange={(e) => setTrimSpaces(e.target.checked)} />
          <span>Normalize spaces</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50 dark:bg-slate-900">
          <input type="checkbox" checked={trimBreaks} onChange={(e) => setTrimBreaks(e.target.checked)} />
          <span>Clean breaks</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50 dark:bg-slate-900">
          <input type="checkbox" checked={upper} onChange={(e) => {setUpper(e.target.checked); if(e.target.checked) setLower(false);}} />
          <span>UPPERCASE</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50 dark:bg-slate-900">
          <input type="checkbox" checked={lower} onChange={(e) => {setLower(e.target.checked); if(e.target.checked) setUpper(false);}} />
          <span>lowercase</span>
        </label>
        <button onClick={() => setText('')} className="text-xs text-slate-500 underline text-left pt-1">Reset</button>
      </div>
      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>Formatted Output ({formatted.length} chars)</span>
          <button onClick={() => onCopy(formatted, 'fmt')} className="inline-flex items-center gap-1 text-emerald-600">
            {copiedKey === 'fmt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'fmt' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="font-sans whitespace-pre-line text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border">
          {formatted}
        </pre>
      </div>
    </div>
  );
}

function TkCharacterCounterTool() {
  const [text, setText] = useState('Digital Creator & Designer ✨');
  const [type, setType] = useState<'bio' | 'nickname' | 'comment' | 'caption' | 'handle'>('bio');
  const res = useMemo(() => countTikTokCharacters(text, type), [text, type]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-center">
        <div>
          <label className="block font-semibold mb-1">Check Against TikTok Limit</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option value="bio">Profile Bio (80 chars)</option>
            <option value="nickname">Profile Nickname (30 chars)</option>
            <option value="comment">Standard Comment (150 chars)</option>
            <option value="caption">Video Caption / Description (4,000 chars)</option>
            <option value="handle">Username / Handle (24 chars)</option>
          </select>
        </div>
        <div className="pt-4 flex justify-end">
          <button onClick={() => setText('')} className="text-xs text-slate-500 underline">Reset</button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Text Input</label>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs" />
      </div>
      <div className={`p-4 rounded-xl border text-center space-y-1 ${res.exceeded ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
        <div className="text-2xl font-bold">{res.count} / {res.limit} characters</div>
        <div className="text-xs font-semibold">{res.exceeded ? `Exceeds limit by ${Math.abs(res.remaining)} characters!` : `${res.remaining} characters remaining`}</div>
      </div>
    </div>
  );
}

function TkFollowerGrowthCalc() {
  const [start, setStart] = useState('1000');
  const [now, setNow] = useState('5400');
  const [days, setDays] = useState('30');

  const startNum = parseInt(start, 10);
  const res = useMemo(() => calculateTikTokGrowth(startNum || 0, parseInt(now, 10) || 0, parseInt(days, 10) || 1), [startNum, now, days]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Starting Followers</label>
          <input type="number" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Current Followers</label>
          <input type="number" value={now} onChange={(e) => setNow(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Days Elapsed</label>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-mono text-slate-500">Formula: Growth = Current - Start; % = (Growth / Start) × 100; Per Day = Growth ÷ Days</span>
        <button onClick={() => {setStart('1000'); setNow('5400'); setDays('30');}} className="text-xs text-slate-500 underline">Reset</button>
      </div>
      {startNum === 0 && (
        <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs">
          Starting followers cannot be zero for percentage growth calculations (division by zero). Showing absolute growth only.
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-emerald-600">+{res.growth.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 uppercase">Growth</div>
        </div>
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-slate-950 dark:text-white">+{res.pct}%</div>
          <div className="text-[10px] text-slate-500 uppercase">Percentage</div>
        </div>
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-slate-950 dark:text-white">+{res.perDay}</div>
          <div className="text-[10px] text-slate-500 uppercase">Per Day</div>
        </div>
      </div>
    </div>
  );
}

function TkVideoLengthCalc() {
  const [script, setScript] = useState('Stop scrolling if you want to learn how to edit videos faster. In this quick guide we will cover timeline shortcuts, color grading basics, and exporting cleanly for TikTok.');
  const [wpm, setWpm] = useState('150');
  const [targetSecs, setTargetSecs] = useState('30');
  const res = useMemo(() => calculateTikTokLength(script, parseInt(wpm, 10) || 150, parseInt(targetSecs, 10) || 30), [script, wpm, targetSecs]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Speaking Rate (WPM)</label>
          <select value={wpm} onChange={(e) => setWpm(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="120">Slow (~120 WPM)</option>
            <option value="150">Normal / Conversational (~150 WPM)</option>
            <option value="180">Brisk TikTok Pacing (~180 WPM)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Target Duration (Word Budget)</label>
          <select value={targetSecs} onChange={(e) => setTargetSecs(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="15">15 Seconds (~38 words)</option>
            <option value="30">30 Seconds (~75 words)</option>
            <option value="60">60 Seconds (~150 words)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Paste Script Text</label>
        <textarea rows={4} value={script} onChange={(e) => setScript(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs" />
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
        <span>Formula: Duration = (Word Count ÷ WPM) × 60 seconds</span>
        <button onClick={() => setScript('')} className="underline">Reset</button>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-2">
        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{res.formatted}</div>
        <div className="text-xs text-slate-500">Estimated spoken duration ({res.words} words total)</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 pt-1">
          Recommended word budget for {targetSecs}s: <strong className="text-emerald-600">{res.targetBudgetMin} – {res.targetBudgetMax} words</strong>
        </div>
      </div>
    </div>
  );
}

function TkContentCalendarGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('digital marketing');
  const [perWeek, setPerWeek] = useState('3');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [mix, setMix] = useState('Mixed');

  const calendar = useMemo(() => generateTikTokCalendar(niche, parseInt(perWeek, 10) || 3, startDate, mix), [niche, perWeek, startDate, mix]);
  const markdownExport = useMemo(() => calendar.map(c => `- **${c.day} (${c.date})**: ${c.idea} [${c.type}]`).join('\n'), [calendar]);
  const csvExport = useMemo(() => 'Day,Date,Idea,Type\n' + calendar.map(c => `"${c.day}","${c.date}","${c.idea}","${c.type}"`).join('\n'), [calendar]);

  const handleDownloadCsv = () => {
    const blob = new Blob([csvExport], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiktok_content_calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Planning tool only — computes correct weekdays from your start date (e.g., 2026-11-25 is Wednesday). Does not publish or schedule on TikTok.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Niche / Topic</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Videos Per Week</label>
          <select value={perWeek} onChange={(e) => setPerWeek(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="2">2 videos</option>
            <option value="3">3 videos</option>
            <option value="5">5 videos</option>
            <option value="7">7 videos (Daily)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Content Mix</label>
          <select value={mix} onChange={(e) => setMix(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option>Mixed</option>
            <option>Tutorials</option>
            <option>Stories</option>
            <option>Challenges</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleDownloadCsv} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg shadow-sm">
            <Download className="h-3.5 w-3.5" /> Download .csv
          </button>
          <button onClick={() => onCopy(markdownExport, 'cal-md')} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 rounded-lg">
            {copiedKey === 'cal-md' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'cal-md' ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>
        </div>
        <button onClick={() => {setNiche('digital marketing'); setStartDate('2026-11-25');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-2">
        {calendar.map((item, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{item.day} ({item.date}):</span>{' '}
              <span className="text-slate-700 dark:text-slate-300">{item.idea}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkBestTimePlanner({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [region, setRegion] = useState('US / EST');
  const [audienceType, setAudienceType] = useState('General');

  const times = useMemo(() => getTikTokPostingTimes(region, audienceType), [region, audienceType]);
  const textSummary = useMemo(() => times.map(t => `${t.day}: ${t.window} (${t.note})`).join('\n'), [times]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        General planning suggestions only. Time windows shift dynamically per region and audience demographic.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Audience Region / Timezone</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>US / EST</option>
            <option>US / PST</option>
            <option>UK / GMT</option>
            <option>Europe / CET</option>
            <option>Asia / AEST</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Audience Demographics</label>
          <select value={audienceType} onChange={(e) => setAudienceType(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>General</option>
            <option>Students</option>
            <option>Working professionals</option>
            <option>Parents</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => {setRegion('US / EST'); setAudienceType('General');}} className="text-xs text-slate-500">Reset</button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Suggested Posting Windows</span>
          <button onClick={() => onCopy(textSummary, 'times')} className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            {copiedKey === 'times' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'times' ? 'Copied' : 'Copy Schedule'}</span>
          </button>
        </div>
        {times.map((t, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <span className="font-bold w-24">{t.day}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{t.window}</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">{t.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TkImageCompressorTool() {
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState('0.75');
  const [info, setInfo] = useState<{orig: string; comp: string; pct: string; dims: string} | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  const processFile = (f: File, qStr: string) => {
    const q = parseFloat(qStr) || 0.75;
    const origBytes = f.size;
    const origSize = (origBytes / 1024).toFixed(1) + ' KB';
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', q);
        // Estimate compressed bytes from base64 length
        const compBytes = Math.round(dataUrl.length * 0.75);
        const compSize = (compBytes / 1024).toFixed(1) + ' KB';
        const saved = Math.max(0, ((origBytes - compBytes) / origBytes) * 100).toFixed(1) + '%';
        setOutUrl(dataUrl);
        setInfo({orig: origSize, comp: compSize, pct: saved, dims: `${img.width} × ${img.height} px`});
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLastFile(f);
    processFile(f, quality);
  };

  const handleQualityChange = (newQ: string) => {
    setQuality(newQ);
    if (lastFile) {
      processFile(lastFile, newQ);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Compresses images in browser for TikTok upload. Choose quality setting to view % saved and output dimensions.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-center">
        <div className="relative inline-block">
          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
          <button className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 font-semibold">
            <ImageIcon className="h-4 w-4" />
            <span>Upload Image (Max 20 MB)</span>
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Compression Quality</label>
          <select value={quality} onChange={(e) => handleQualityChange(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="0.9">High Quality (Minor compression)</option>
            <option value="0.75">Medium Quality (Recommended)</option>
            <option value="0.5">Low Quality (Maximum savings)</option>
          </select>
        </div>
      </div>
      {outUrl && info && (
        <div className="space-y-3 rounded-xl border p-4 bg-white dark:bg-slate-900 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div>
              <span className="text-[10px] text-slate-500 block">ORIGINAL</span>
              <strong className="text-slate-900 dark:text-white">{info.orig}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">COMPRESSED</span>
              <strong className="text-emerald-600">{info.comp}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">SAVED</span>
              <strong className="text-emerald-600">-{info.pct}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">DIMENSIONS</span>
              <strong>{info.dims}</strong>
            </div>
          </div>
          <div className="h-48 flex justify-center bg-slate-950 rounded overflow-hidden">
            <img src={outUrl} alt="Compressed" className="h-full object-contain" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <button onClick={() => {setOutUrl(null); setLastFile(null);}} className="text-xs text-slate-500 underline">Reset</button>
            <a href={outUrl} download="tiktok_compressed.jpg" className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow">
              <Download className="h-3.5 w-3.5" /> Download Compressed JPG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function TkAspectRatioChecker() {
  const [w, setW] = useState('1920');
  const [h, setH] = useState('1080');
  const res = useMemo(() => checkTikTokAspectRatio(parseInt(w, 10) || 1, parseInt(h, 10) || 1), [w, h]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Width (px)</label>
          <input type="number" value={w} onChange={(e) => setW(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Height (px)</label>
          <input type="number" value={h} onChange={(e) => setH(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono" />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => {setW('1080'); setH('1920');}} className="text-xs text-slate-500 underline">Reset</button>
      </div>
      <div className={`p-6 rounded-2xl border text-center space-y-2 ${res.match ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
        <div className="text-2xl font-bold font-mono">Simplified Ratio: {res.ratio}</div>
        <div className="text-sm font-semibold">{res.diff}</div>
      </div>
    </div>
  );
}

function TkFileSizeEstimator() {
  const [dur, setDur] = useState('0:30');
  const [bitrate, setBitrate] = useState('10');
  const res = useMemo(() => estimateTikTokFileSize(dur, parseFloat(bitrate) || 10), [dur, bitrate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Duration (Seconds or MM:SS)</label>
          <input type="text" value={dur} onChange={(e) => setDur(e.target.value)} placeholder="e.g. 30 or 1:30" className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bitrate Preset / Custom (Mbps)</label>
          <select value={bitrate} onChange={(e) => setBitrate(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="6">Low Quality (~6 Mbps)</option>
            <option value="10">Standard 1080p (~10 Mbps)</option>
            <option value="15">High Quality (~15 Mbps)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => {setDur('0:30'); setBitrate('10');}} className="text-xs text-slate-500 underline">Reset</button>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-2">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estimated File Size</div>
        <div className="text-3xl font-extrabold text-slate-950 dark:text-white">{res.sizeMB} MB</div>
        <div className="text-xs font-mono text-slate-500">{res.formula}</div>
      </div>
    </div>
  );
}

function TkGeneralFallback({toolName}: {toolName: string}) {
  const [text, setText] = useState('Sample input text for ' + toolName);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Input Workspace</label>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs" />
      </div>
      <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 text-xs font-mono">
        Character Count: {text.length} characters
      </div>
    </div>
  );
}
