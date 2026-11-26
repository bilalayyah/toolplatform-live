import React, {useState, useMemo} from 'react';
import {Copy, Check, Twitter, Sparkles, Download, ImageIcon, RefreshCw, Calendar, Calculator, TrendingUp, LayoutTemplate, ListChecks, Quote, Ruler, Split, Type, CircleUserRound, Maximize2} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  splitTwitterThread,
  calculateTwitterEngagement,
  calculateTwitterGrowth,
  generateTwitterQuotes,
  generateTwitterCalendar,
  convertToStylishTwitterText,
} from './twitterHelpers';
import {convertToUnicodeFonts} from './instagramHelpers';

interface Props {
  tool: Tool;
}

export function TwitterToolsRunner({tool}: Props) {
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <Twitter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · Zero AI · No Twitter login required
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'twitter-stylish-text-generator' ? (
          <TwStylishTextGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-font-generator' ? (
          <TwFontGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-character-counter' ? (
          <TwPostCharacterCounter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-bio-character-counter' ? (
          <TwBioCharacterCounter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-thread-formatter' ? (
          <TwThreadFormatter onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-engagement-rate-calculator' ? (
          <TwEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-follower-growth-calculator' ? (
          <TwFollowerGrowthCalc />
        ) : tool.slug === 'twitter-header-resizer' ? (
          <TwImageResizerTool targetWidth={1500} targetHeight={500} label="Twitter Header Banner (1500 × 500 px)" />
        ) : tool.slug === 'twitter-profile-picture-resizer' ? (
          <TwImageResizerTool targetWidth={400} targetHeight={400} label="Twitter Profile Avatar (400 × 400 px)" />
        ) : tool.slug === 'twitter-post-image-resizer' ? (
          <TwImageResizerTool targetWidth={1600} targetHeight={900} label="Twitter Post Image (1600 × 900 px / 16:9)" />
        ) : tool.slug === 'twitter-card-preview-generator' ? (
          <TwCardPreviewGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-content-calendar-generator' ? (
          <TwContentCalendarGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-poll-generator' ? (
          <TwPollGen onCopy={copyText} copiedKey={copiedKey} />
        ) : tool.slug === 'twitter-quote-generator' ? (
          <TwQuoteGen onCopy={copyText} copiedKey={copiedKey} />
        ) : (
          <TwGeneralFallback toolName={tool.name} />
        )}
      </div>
    </div>
  );
}

// 1. Stylish Text Generator
function TwStylishTextGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [txt, setTxt] = useState('Building in public');
  const list = useMemo(() => convertToStylishTwitterText(txt), [txt]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Your Text (Decorative Symbol Frames)</label>
        <input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} className="w-full rounded-xl border p-3 text-sm bg-slate-50 dark:bg-slate-950" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((f) => (
          <div key={f.id} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 block">{f.name}</span>
              <span className="text-sm font-medium">{f.result}</span>
            </div>
            <button onClick={() => onCopy(f.result, f.id)} className="text-sky-500 font-semibold flex items-center gap-1">
              {copiedKey === f.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === f.id ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Font Generator
function TwFontGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [txt, setTxt] = useState('Twitter Creator');
  const list = useMemo(() => convertToUnicodeFonts(txt), [txt]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Your Text (Unicode Font Faces)</label>
        <input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} className="w-full rounded-xl border p-3 text-sm bg-slate-50 dark:bg-slate-950" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((f) => (
          <div key={f.id} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 block">{f.name}</span>
              <span className="text-sm font-medium">{f.result}</span>
            </div>
            <button onClick={() => onCopy(f.result, f.id)} className="text-sky-500 font-semibold flex items-center gap-1">
              {copiedKey === f.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === f.id ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Post Character Counter (280 limit) - Code point counting
function TwPostCharacterCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Building awesome browser tools in public! 🚀');
  const max = 280;
  const len = [...text].length;
  const isOver = len > max;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span>Tweet / Post Character Counter (280 Limit)</span>
        <span className={isOver ? 'text-rose-600 font-bold' : 'text-sky-500'}>{len} / {max} chars</span>
      </div>
      <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border p-3 text-xs bg-slate-50 dark:bg-slate-950" />
      <div className="flex justify-between items-center text-xs">
        <span className={isOver ? 'text-rose-600 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
          {isOver ? `Exceeds 280 limit by ${len - max} characters` : `${max - len} characters remaining`}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setText('')} className="text-slate-500 underline">Reset</button>
          <button onClick={() => onCopy(text, 'tw-cnt')} className="bg-sky-500 text-white px-4 py-1.5 rounded-lg font-semibold">
            {copiedKey === 'tw-cnt' ? 'Copied' : 'Copy Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Bio Character Counter (160 limit) - Code point counting
function TwBioCharacterCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('Building tools for creators ✨ Open source mindset | Check my guides below 👇');
  const max = 160;
  const len = [...text].length;
  const isOver = len > max;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span>Twitter Bio Character Counter (160 Limit)</span>
        <span className={isOver ? 'text-rose-600 font-bold' : 'text-sky-500'}>{len} / {max} chars</span>
      </div>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border p-3 text-xs bg-slate-50 dark:bg-slate-950" />
      <div className="flex justify-between items-center text-xs">
        <span className={isOver ? 'text-rose-600 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
          {isOver ? `Exceeds 160 limit by ${len - max} characters` : `${max - len} characters remaining`}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setText('')} className="text-slate-500 underline">Reset</button>
          <button onClick={() => onCopy(text, 'bio-cnt')} className="bg-sky-500 text-white px-4 py-1.5 rounded-lg font-semibold">
            {copiedKey === 'bio-cnt' ? 'Copied' : 'Copy Bio'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Thread Formatter
function TwThreadFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [input, setInput] = useState('First thought on building in public and sharing progress daily. Second thought on consistency and shipping small features. Third thought on customer feedback loops and iterating fast.');
  const parts = useMemo(() => splitTwitterThread(input), [input]);
  const joined = parts.join('\n\n---\n\n');

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
        Splits long text deterministically into 280-character numbered thread posts.
      </div>
      <textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-xl border p-3 text-xs bg-slate-50 dark:bg-slate-950" />
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold">Split into {parts.length} Thread Tweets</span>
        <div className="flex gap-2">
          <button onClick={() => setInput('')} className="text-slate-500 underline">Reset</button>
          <button onClick={() => onCopy(joined, 'th-copy')} className="bg-sky-500 text-white px-4 py-1.5 rounded-lg font-semibold">
            {copiedKey === 'th-copy' ? 'Copied Thread' : 'Copy All Thread Parts'}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {parts.map((p, i) => (
          <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs font-mono flex justify-between items-center gap-2">
            <div className="space-y-1">
              <span>{p}</span>
              <span className="text-[10px] text-slate-400 block">{[...p].length}/280 chars</span>
            </div>
            <button onClick={() => onCopy(p, `part-${i}`)} className="text-sky-500 shrink-0 font-semibold">
              {copiedKey === `part-${i}` ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Engagement Rate Calculator
function TwEngagementCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [mode, setMode] = useState<'followers' | 'impressions'>('impressions');
  const [baseCount, setBaseCount] = useState('15000');
  const [l, setL] = useState('450');
  const [r, setR] = useState('60');
  const [rp, setRp] = useState('30');
  const [bms, setBms] = useState('15');
  const res = useMemo(() => calculateTwitterEngagement({mode, baseCount: parseInt(baseCount, 10) || 1, likes: parseInt(l, 10) || 0, replies: parseInt(r, 10) || 0, retweets: parseInt(rp, 10) || 0, bookmarks: parseInt(bms, 10) || 0}), [mode, baseCount, l, r, rp, bms]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit text-xs font-semibold">
        <button onClick={() => setMode('impressions')} className={`px-4 py-2 rounded-lg transition ${mode === 'impressions' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-600'}`}>
          By Impressions
        </button>
        <button onClick={() => setMode('followers')} className={`px-4 py-2 rounded-lg transition ${mode === 'followers' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-600'}`}>
          By Followers
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">{mode === 'impressions' ? 'Total Impressions' : 'Follower Count'}</label>
          <input type="number" value={baseCount} onChange={(e) => setBaseCount(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Likes</label>
          <input type="number" value={l} onChange={(e) => setL(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Replies</label>
          <input type="number" value={r} onChange={(e) => setR(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Reposts</label>
          <input type="number" value={rp} onChange={(e) => setRp(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bookmarks</label>
          <input type="number" value={bms} onChange={(e) => setBms(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 text-center space-y-2">
        <div className="text-3xl font-extrabold text-sky-500">{res.er}%</div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{res.tier}</div>
        <div className="text-xs text-slate-500">Total Interactions: {res.total.toLocaleString()} (Calculated by {mode})</div>
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
          Equation: ({l} + {r} + {rp} + {bms}) ÷ {baseCount} × 100 = {res.er}%
        </div>
      </div>
    </div>
  );
}

// 7, 8, 9. Image Resizers (Header 1500x500, Profile 400x400, Post 1600x900) with Zoom slider & Fit Mode selector
function TwImageResizerTool({targetWidth, targetHeight, label}: {targetWidth: number; targetHeight: number; label: string}) {
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [zoom, setZoom] = useState('1');
  const [lastFile, setLastFile] = useState<File | null>(null);

  const processFile = (f: File, mode: 'cover' | 'contain', zoomVal: string) => {
    const z = parseFloat(zoomVal) || 1;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        if (fitMode === 'cover') {
          const targetAspect = targetWidth / targetHeight;
          const imgAspect = img.width / img.height;
          let sw = img.width / z, sh = img.height / z, sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
          if (imgAspect > targetAspect) {
            sw = (img.height * targetAspect) / z;
            sx = (img.width - sw) / 2;
          } else {
            sh = (img.width / targetAspect) / z;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        } else {
          // Contain with padding
          const hRatio = targetWidth / img.width;
          const vRatio = targetHeight / img.height;
          const ratio = Math.min(hRatio, vRatio) * z;
          const tw = img.width * ratio;
          const th = img.height * ratio;
          const tx = (targetWidth - tw) / 2;
          const ty = (targetHeight - th) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, tx, ty, tw, th);
        }

        setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLastFile(f);
    processFile(f, fitMode, zoom);
  };

  const handleModeChange = (m: 'cover' | 'contain') => {
    setFitMode(m);
    if (lastFile) processFile(lastFile, m, zoom);
  };

  const handleZoomChange = (z: string) => {
    setZoom(z);
    if (lastFile) processFile(lastFile, fitMode, z);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Resizes and scales image locally in browser to exact {label} specifications with adjustable zoom & fit mode.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-center">
        <div className="relative inline-block">
          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
          <button className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-sky-500 text-white px-4 py-2.5 font-semibold shadow">
            <ImageIcon className="h-4 w-4" />
            <span>Upload Image (Max 20 MB)</span>
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Fit Mode</label>
          <select value={fitMode} onChange={(e) => handleModeChange(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="cover">Fill / Cover (No bars)</option>
            <option value="contain">Fit with Padding</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Zoom / Scale ({zoom}x)</label>
          <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={(e) => handleZoomChange(e.target.value)} className="w-full accent-sky-500" />
        </div>
      </div>
      {outUrl && (
        <div className="space-y-3 rounded-xl border p-4 bg-slate-950 text-xs text-white">
          <div className="flex justify-center bg-black rounded-lg overflow-hidden max-h-72">
            <img src={outUrl} alt="Resized" className="object-contain max-h-72" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono">{targetWidth} × {targetHeight} px</span>
            <a href={outUrl} download="twitter_graphic.jpg" className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">
              <Download className="h-4 w-4" /> Download JPG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// 10. Follower Growth Calculator
function TwFollowerGrowthCalc() {
  const [start, setStart] = useState('0');
  const [now, setNow] = useState('500');
  const [days, setDays] = useState('10');

  const startNum = parseInt(start, 10);
  const res = useMemo(() => calculateTwitterGrowth(startNum || 0, parseInt(now, 10) || 0, parseInt(days, 10) || 1), [startNum, now, days]);

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
      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
        <span>Formula: Growth = Current - Start; % = (Growth / Start) × 100</span>
        <button onClick={() => {setStart('0'); setNow('500'); setDays('10');}} className="underline">Reset</button>
      </div>
      {startNum === 0 && (
        <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs">
          Starting followers is 0: percentage growth is Not Applicable (N/A) to prevent division by zero. Showing absolute growth below.
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-sky-500">+{res.growth.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 uppercase">Growth</div>
        </div>
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900">
          <div className="text-xl font-bold text-slate-950 dark:text-white">{res.pct !== null ? `+${res.pct}%` : '— (N/A)'}</div>
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

// 11. Card Preview Generator with Page URL input and Summary vs Large Image selector
function TwCardPreviewGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [pageUrl, setPageUrl] = useState('https://toolplatform.dev/blog/ai-tools');
  const [cardType, setCardType] = useState<'summary_large_image' | 'summary'>('summary_large_image');
  const [title, setTitle] = useState('How to Build Modern AI Tools in 2026');
  const [desc, setDesc] = useState('A complete guide to building responsive browser-based applications with React, Tailwind, and Vite.');
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const domain = useMemo(() => {
    try {
      return new URL(pageUrl.trim()).hostname || 'example.com';
    } catch {
      return 'example.com (Invalid URL)';
    }
  }, [pageUrl]);

  const titleErr = title.length > 70 ? 'Title exceeds 70 characters!' : '';
  const descErr = desc.length > 200 ? 'Description exceeds 200 characters!' : '';

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImgUrl(r.result as string);
    r.readAsDataURL(f);
  };

  const metaSnippet = `<meta name="twitter:card" content="${cardType}" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />`;

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Preview mockup only — built from your entered page URL, title, description, and image. Never fetches a live URL.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Page URL (Required)</label>
          <input type="url" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} placeholder="https://example.com/article" className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Card Type Template</label>
          <select value={cardType} onChange={(e) => setCardType(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="summary_large_image">Summary Large Image (16:9)</option>
            <option value="summary">Summary (Square Thumbnail)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span>Card Title (max 70 chars)</span>
            <span className={title.length > 70 ? 'text-rose-600' : ''}>{title.length}/70</span>
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
          {titleErr && <div className="text-rose-600 text-[10px] mt-0.5">{titleErr}</div>}
        </div>
        <div className="sm:col-span-2">
          <div className="flex justify-between font-semibold mb-1">
            <span>Card Description (max 200 chars)</span>
            <span className={desc.length > 200 ? 'text-rose-600' : ''}>{desc.length}/200</span>
          </div>
          <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
          {descErr && <div className="text-rose-600 text-[10px] mt-0.5">{descErr}</div>}
        </div>
      </div>
      <div className="relative inline-block">
        <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 text-xs font-semibold">
          <ImageIcon className="h-4 w-4" /> Upload Card Thumbnail
        </button>
      </div>

      {/* Rendered Mockup Card */}
      <div className="p-4 rounded-2xl border bg-slate-950 text-white space-y-3 max-w-lg mx-auto shadow-lg">
        <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">Twitter Card Preview ({cardType === 'summary_large_image' ? 'Summary Large Image' : 'Summary'})</div>
        {cardType === 'summary_large_image' ? (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
            <div className="h-44 bg-slate-800 flex items-center justify-center overflow-hidden">
              {imgUrl ? <img src={imgUrl} alt="Card Thumb" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-500">1200 × 628 Image Area</span>}
            </div>
            <div className="p-3 space-y-1">
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">{domain}</div>
              <div className="text-sm font-bold leading-snug line-clamp-2">
                {title.length <= 70 ? (title || 'Card Title') : <span className="text-rose-500 text-xs">Title exceeds 70 character limit</span>}
              </div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {desc.length <= 200 ? (desc || 'Card description text...') : <span className="text-rose-500 text-xs">Description exceeds 200 character limit</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex">
            <div className="w-28 h-28 bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
              {imgUrl ? <img src={imgUrl} alt="Card Thumb" className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-500">Square</span>}
            </div>
            <div className="p-3 space-y-1 flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide truncate">{domain}</div>
              <div className="text-xs font-bold leading-snug line-clamp-2">
                {title.length <= 70 ? (title || 'Card Title') : <span className="text-rose-500 text-xs">Title exceeds 70 limit</span>}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1">
                {desc.length <= 200 ? (desc || 'Card description...') : <span className="text-rose-500 text-xs">Description exceeds 200 limit</span>}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <button onClick={() => onCopy(metaSnippet, 'meta')} disabled={title.length > 70 || desc.length > 200} className={`inline-flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg ${title.length > 70 || desc.length > 200 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {copiedKey === 'meta' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'meta' ? 'Copied Meta Tags' : 'Copy HTML Meta Tags'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 12. Content Calendar Generator
function TwContentCalendarGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Indie hacking & tech');
  const [perWeek, setPerWeek] = useState('3');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [mix, setMix] = useState('Mixed');

  const calendar = useMemo(() => generateTwitterCalendar(niche, parseInt(perWeek, 10) || 3, startDate, mix), [niche, perWeek, startDate, mix]);
  const markdownExport = useMemo(() => calendar.map(c => `- **${c.day} (${c.date})**: ${c.idea} [${c.type}]`).join('\n'), [calendar]);
  const csvExport = useMemo(() => 'Day,Date,Idea,Type\n' + calendar.map(c => `"${c.day}","${c.date}","${c.idea}","${c.type}"`).join('\n'), [calendar]);

  const handleDownloadCsv = () => {
    const blob = new Blob([csvExport], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twitter_content_calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Planning tool only — never claims to publish or schedule on X. Downloadable CSV and Markdown checklist.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Niche / Topic</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Posts Per Week</label>
          <select value={perWeek} onChange={(e) => setPerWeek(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option value="2">2 posts</option>
            <option value="3">3 posts</option>
            <option value="5">5 posts</option>
            <option value="7">7 posts (Daily)</option>
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
            <option>Tips</option>
            <option>Stories</option>
            <option>Questions</option>
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
        <button onClick={() => {setNiche('Indie hacking & tech');}} className="text-xs text-slate-500">Reset</button>
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

// 13. Poll Generator
function TwPollGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [question, setQuestion] = useState('What is your primary focus this week?');
  const [opt1, setOpt1] = useState('Building products');
  const [opt2, setOpt2] = useState('Marketing & Sales');
  const [opt3, setOpt3] = useState('Learning new tech');
  const [opt4, setOpt4] = useState('Taking time off');
  const [duration, setDuration] = useState('1 day');

  const options = [opt1, opt2, opt3, opt4].filter(o => o.trim().length > 0);
  const qErr = question.length > 280 ? 'Poll Question exceeds 280 characters limit!' : '';
  const opt1Err = opt1.length > 25 ? 'Option 1 exceeds 25 characters limit!' : '';
  const opt2Err = opt2.length > 25 ? 'Option 2 exceeds 25 characters limit!' : '';
  const opt3Err = opt3.length > 25 ? 'Option 3 exceeds 25 characters limit!' : '';
  const opt4Err = opt4.length > 25 ? 'Option 4 exceeds 25 characters limit!' : '';
  const countErr = options.length < 2 ? 'At least 2 options required!' : '';
  const anyErr = qErr || opt1Err || opt2Err || opt3Err || opt4Err || countErr;

  const pollDraft = `Poll Question:\n${question}\n\nOptions:\n` + options.map((o, i) => `${i + 1}. ${o} (${o.length}/25)`).join('\n') + `\n\nDuration: ${duration}`;

  const handleQuestion = (val: string) => {
    if (val.length <= 280) setQuestion(val);
  };
  const handleOpt1 = (val: string) => {
    if (val.length <= 25) setOpt1(val);
  };
  const handleOpt2 = (val: string) => {
    if (val.length <= 25) setOpt2(val);
  };
  const handleOpt3 = (val: string) => {
    if (val.length <= 25) setOpt3(val);
  };
  const handleOpt4 = (val: string) => {
    if (val.length <= 25) setOpt4(val);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
        Prepares poll content only — never publishes a poll and never collects votes on X.
      </div>
      <div>
        <div className="flex justify-between font-semibold text-xs mb-1">
          <span>Poll Question (max 280 chars)</span>
          <span className={question.length > 280 ? 'text-rose-600' : ''}>{question.length}/280</span>
        </div>
        <input type="text" value={question} onChange={(e) => handleQuestion(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs" />
        {qErr && <div className="text-rose-600 text-[10px] mt-0.5">{qErr}</div>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span>Option 1 (max 25 chars)</span>
            <span className={opt1.length > 25 ? 'text-rose-600' : ''}>{opt1.length}/25</span>
          </div>
          <input type="text" value={opt1} onChange={(e) => handleOpt1(e.target.value)} className="w-full border p-2 rounded-xl bg-white dark:bg-slate-900" />
          {opt1Err && <div className="text-rose-600 text-[10px] mt-0.5">{opt1Err}</div>}
        </div>
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span>Option 2 (max 25 chars)</span>
            <span className={opt2.length > 25 ? 'text-rose-600' : ''}>{opt2.length}/25</span>
          </div>
          <input type="text" value={opt2} onChange={(e) => handleOpt2(e.target.value)} className="w-full border p-2 rounded-xl bg-white dark:bg-slate-900" />
          {opt2Err && <div className="text-rose-600 text-[10px] mt-0.5">{opt2Err}</div>}
        </div>
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span>Option 3 (Optional)</span>
            <span className={opt3.length > 25 ? 'text-rose-600' : ''}>{opt3.length}/25</span>
          </div>
          <input type="text" value={opt3} onChange={(e) => handleOpt3(e.target.value)} className="w-full border p-2 rounded-xl bg-white dark:bg-slate-900" />
          {opt3Err && <div className="text-rose-600 text-[10px] mt-0.5">{opt3Err}</div>}
        </div>
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span>Option 4 (Optional)</span>
            <span className={opt4.length > 25 ? 'text-rose-600' : ''}>{opt4.length}/25</span>
          </div>
          <input type="text" value={opt4} onChange={(e) => handleOpt4(e.target.value)} className="w-full border p-2 rounded-xl bg-white dark:bg-slate-900" />
          {opt4Err && <div className="text-rose-600 text-[10px] mt-0.5">{opt4Err}</div>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-center">
        <div>
          <label className="block font-semibold mb-1">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white dark:bg-slate-900">
            <option>5 minutes</option>
            <option>1 hour</option>
            <option>1 day</option>
            <option>7 days</option>
          </select>
        </div>
        <div className="flex justify-end pt-4">
          <button onClick={() => {setQuestion(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('');}} className="text-xs text-slate-500 underline">Reset</button>
        </div>
      </div>
      {countErr && <div className="text-rose-600 text-xs font-semibold">{countErr}</div>}

      <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-3 text-xs">
        <div className="flex justify-between items-center font-bold">
          <span>Ready-to-Copy Poll Draft</span>
          <button onClick={() => onCopy(pollDraft, 'poll')} disabled={Boolean(anyErr)} className={`inline-flex items-center gap-1 text-sky-500 font-semibold ${anyErr ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {copiedKey === 'poll' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'poll' ? 'Copied Poll' : 'Copy All'}</span>
          </button>
        </div>
        <pre className="font-sans whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border text-slate-800 dark:text-slate-200">
          {pollDraft}
        </pre>
      </div>
    </div>
  );
}

// 14. Quote Generator
function TwQuoteGen({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('shipping products daily');
  const [style, setStyle] = useState('Motivational');
  const [count, setCount] = useState('5');
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => generateTwitterQuotes(topic, style, parseInt(count, 10) || 5), [topic, style, count, seed]);
  const allStr = list.map(q => q.quote).join('\n\n');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Topic / Theme</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Quote Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <option>Motivational</option>
            <option>Thoughtful</option>
            <option>Funny</option>
            <option>Short & punchy</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold">Variations:</label>
          <select value={count} onChange={(e) => setCount(e.target.value)} className="border rounded-lg p-1.5 bg-white dark:bg-slate-900">
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSeed(s => s + 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-500 text-white px-4 py-1.5 rounded-lg shadow">
            <RefreshCw className="h-3.5 w-3.5" /> Generate / Regenerate
          </button>
          <button onClick={() => {setTopic('shipping products daily');}} className="text-xs text-slate-500">Reset</button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold pt-2">
          <span>Generated Quote Posts (under 280 chars)</span>
          <button onClick={() => onCopy(allStr, 'all-quotes')} className="inline-flex items-center gap-1 text-sky-500 font-semibold">
            {copiedKey === 'all-quotes' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all-quotes' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        {list.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-1.5">
            <div className="flex justify-between items-start font-medium">
              <p className="text-slate-900 dark:text-slate-100 font-sans whitespace-pre-line">{item.quote}</p>
              <button onClick={() => onCopy(item.quote, `q-${i}`)} className="text-sky-500 shrink-0 font-semibold flex items-center gap-1 pl-3">
                {copiedKey === `q-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === `q-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block">{item.length} / 280 chars</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwGeneralFallback({toolName}: {toolName: string}) {
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
