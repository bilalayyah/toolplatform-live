import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertTriangle,
  Calendar,
  Copy,
  Download,
  ImageIcon,
  Plus,
  RotateCcw,
  Trash2,
  Trophy,
  Upload,
} from 'lucide-react';
import {fitBioWithinCap, generateFacebookBios, validateFacebookUsername} from '../facebookHelpers';
import {convertToStylishDecorations, convertToUnicodeFonts} from '../instagramHelpers';
import {
  calculateFacebookEngagementRate,
  pickGiveawayWinners,
  type EngagementMethod,
  type EngagementRateResult,
  type WinnerPickerResult,
} from '../../../lib/facebook/utilityEngines';
import {
  downloadTextFile,
  FbCopyButton,
  FbErrorAlert,
  FbGeneratorActionBar,
  FbWarningAlert,
  useClipboardState,
} from './FbSharedControls';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

// ============================================================================
// 5.3 FIX + 5.4 Verify: Giveaway Winner Picker & Random Comment Picker
// ============================================================================
export function FbWinnerPicker({isComment}: {isComment: boolean}) {
  const {copiedId, copy} = useClipboardState();
  const [entries, setEntries] = useState(
    isComment
      ? 'Sarah Jenkins — Love this tip! #giveaway\nMarcus Chen — Count me in! #giveaway\nsarah jenkins — Love this tip! #giveaway\nPriya Patel — Best resource so far\nDevon Brooks — Entering for #giveaway\nElena Rostova — #giveaway awesome!'
      : 'Sarah Jenkins\nMarcus Chen\nSarah Jenkins\nPriya Patel\nDevon Brooks\nElena Rostova\nNoah Al-Mansoor'
  );
  const [winnerCountRaw, setWinnerCountRaw] = useState('1');
  const [backupCountRaw, setBackupCountRaw] = useState('1');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [result, setResult] = useState<WinnerPickerResult | null>(null);

  const handleDraw = () => {
    const wc = Number(winnerCountRaw);
    const bc = Number(backupCountRaw);
    const res = pickGiveawayWinners({
      rawEntries: entries,
      winnerCount: wc,
      backupCount: bc,
      removeDuplicates,
      keywordFilter: isComment ? keywordFilter : '',
    });
    setResult(res);
  };

  const reset = () => {
    setEntries('');
    setWinnerCountRaw('1');
    setBackupCountRaw('0');
    setRemoveDuplicates(true);
    setKeywordFilter('');
    setResult(null);
  };

  const allResultsText = result?.valid
    ? [
        '=== WINNERS ===',
        ...result.winners.map((w, i) => `${i + 1}. ${w}`),
        ...(result.backups.length > 0
          ? ['', '=== BACKUP WINNERS ===', ...result.backups.map((b, i) => `${i + 1}. ${b}`)]
          : []),
      ].join('\n')
    : '';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 text-xs text-emerald-900 dark:text-emerald-200">
        <strong>Pasted entries only:</strong> This tool draws winners using browser Web Crypto randomness strictly from the{' '}
        {isComment ? 'comments' : 'names'} you paste below. It cannot connect to Facebook or fetch live entrants.
      </div>

      <div>
        <label htmlFor="fb-wp-entries" className={LABEL_CLASS}>
          {isComment ? 'Paste Facebook Comments (one per line)' : 'Paste Entrant Names / Handles (one per line)'}{' '}
          <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="fb-wp-entries"
          rows={6}
          value={entries}
          onChange={(e) => setEntries(e.target.value)}
          placeholder="Paste one name or comment per line..."
          className={`${INPUT_CLASS} font-mono`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label htmlFor="fb-wp-winners" className={LABEL_CLASS}>
            Number of Winners (1–10)
          </label>
          <input
            id="fb-wp-winners"
            type="number"
            min={1}
            max={10}
            step={1}
            value={winnerCountRaw}
            onChange={(e) => setWinnerCountRaw(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="fb-wp-backups" className={LABEL_CLASS}>
            Backup Winners (0–5)
          </label>
          <input
            id="fb-wp-backups"
            type="number"
            min={0}
            max={5}
            step={1}
            value={backupCountRaw}
            onChange={(e) => setBackupCountRaw(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        {isComment ? (
          <div>
            <label htmlFor="fb-wp-kw" className={LABEL_CLASS}>
              Required Keyword Filter (optional)
            </label>
            <input
              id="fb-wp-kw"
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="e.g., #giveaway"
              className={INPUT_CLASS}
            />
          </div>
        ) : (
          <div className="flex items-end pb-1">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0A8CFF]"
              />
              <span>Remove duplicate names</span>
            </label>
          </div>
        )}
      </div>

      {isComment && (
        <div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0A8CFF]"
            />
            <span>Remove duplicate entries (case-insensitive, trimmed)</span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleDraw}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <Trophy className="h-4 w-4" aria-hidden="true" />
          <span>{isComment ? 'Pick Random Comment(s)' : 'Pick Random Winner(s)'}</span>
        </button>
        {result?.valid && (
          <FbCopyButton
            text={allResultsText}
            id="wp-copy-all"
            copiedId={copiedId}
            onCopy={copy}
            label="Copy All Results"
          />
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {result && !result.valid && <FbErrorAlert errors={result.errors} />}

      {result && result.valid && (
        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1">
              Total pasted lines: <strong>{result.totalLines}</strong>
            </span>
            {result.filteredOutCount > 0 && (
              <span className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1">
                Filtered out: <strong>{result.filteredOutCount}</strong>
              </span>
            )}
            <span className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1">
              Duplicates removed: <strong>{result.duplicatesRemoved}</strong>
            </span>
            <span className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 px-2.5 py-1">
              Eligible pool: <strong>{result.eligibleCount}</strong>
            </span>
          </div>

          <FbWarningAlert warnings={result.warnings} />

          <div data-result className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Selected Winners ({result.winners.length})
                </h3>
                <FbCopyButton
                  text={result.winners.map((w, i) => `${i + 1}. ${w}`).join('\n')}
                  id="wp-copy-winners"
                  copiedId={copiedId}
                  onCopy={copy}
                  label="Copy Winners"
                />
              </div>
              <ol className="space-y-2">
                {result.winners.map((w, i) => (
                  <li
                    key={`${w}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A8CFF] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white break-words">{w}</span>
                    </div>
                    <FbCopyButton text={w} id={`wp-w-${i}`} copiedId={copiedId} onCopy={copy} />
                  </li>
                ))}
              </ol>
            </div>

            {result.backups.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Backup Winners ({result.backups.length})
                  </h3>
                  <FbCopyButton
                    text={result.backups.map((b, i) => `${i + 1}. ${b}`).join('\n')}
                    id="wp-copy-backups"
                    copiedId={copiedId}
                    onCopy={copy}
                    label="Copy Backups"
                  />
                </div>
                <ol className="space-y-1.5">
                  {result.backups.map((b, i) => (
                    <li
                      key={`${b}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          {i + 1}
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 break-words">{b}</span>
                      </div>
                      <FbCopyButton text={b} id={`wp-b-${i}`} copiedId={copiedId} onCopy={copy} />
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Facebook Image Resizers & Makers (Cover/Post/Reel/Multi-Preset)
// ============================================================================
type ImagePresetKey = 'cover' | 'post' | 'square' | 'reel';

const IMAGE_PRESETS: Record<ImagePresetKey, {w: number; h: number; label: string}> = {
  cover: {w: 820, h: 312, label: 'Facebook Cover Photo (820 × 312 px)'},
  post: {w: 1200, h: 630, label: 'Facebook Feed / Link Post (1200 × 630 px)'},
  square: {w: 1080, h: 1080, label: 'Facebook Square Post (1080 × 1080 px)'},
  reel: {w: 1080, h: 1920, label: 'Facebook Reel Cover (1080 × 1920 px)'},
};

const MAX_RESIZER_BYTES = 20 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function FbImageResizer({toolSlug}: {toolSlug: string}) {
  const isMaker = toolSlug === 'facebook-cover-photo-maker' || toolSlug === 'facebook-reel-cover-maker';
  const showPresetSelector = toolSlug === 'facebook-image-resizer';
  const initialPreset: ImagePresetKey =
    toolSlug === 'facebook-reel-cover-maker'
      ? 'reel'
      : toolSlug === 'facebook-cover-photo-resizer' || toolSlug === 'facebook-cover-photo-maker'
        ? 'cover'
        : toolSlug === 'facebook-post-image-resizer'
          ? 'post'
          : 'post';

  const [preset, setPreset] = useState<ImagePresetKey>(initialPreset);
  const [fitMode, setFitMode] = useState<'crop' | 'fit'>('crop');
  const [format, setFormat] = useState<'jpg' | 'png'>(isMaker ? 'png' : 'jpg');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [headline, setHeadline] = useState(
    toolSlug === 'facebook-cover-photo-maker'
      ? 'Your Page Headline'
      : toolSlug === 'facebook-reel-cover-maker'
        ? 'REEL COVER TITLE'
        : ''
  );
  const [subtext, setSubtext] = useState(
    toolSlug === 'facebook-cover-photo-maker' ? 'Clear value proposition or community schedule' : ''
  );
  const [showSafeGuide, setShowSafeGuide] = useState(
    toolSlug === 'facebook-cover-photo-resizer' ||
      toolSlug === 'facebook-cover-photo-maker' ||
      toolSlug === 'facebook-reel-cover-maker'
  );
  const [srcInfo, setSrcInfo] = useState<{
    name: string;
    size: number;
    width: number;
    height: number;
    img: HTMLImageElement;
  } | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const dims = IMAGE_PRESETS[preset];

  const renderGraphic = (
    nextPreset = preset,
    nextFit = fitMode,
    nextFmt = format,
    nextBg = bgColor,
    nextHeadline = headline,
    nextSubtext = subtext,
    nextSrc = srcInfo
  ) => {
    if (!nextSrc && !isMaker) return;
    const target = IMAGE_PRESETS[nextPreset];
    const canvas = document.createElement('canvas');
    canvas.width = target.w;
    canvas.height = target.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = nextBg;
    ctx.fillRect(0, 0, target.w, target.h);

    if (nextSrc) {
      const {width: iw, height: ih} = nextSrc.img;
      if (nextFit === 'crop') {
        const scale = Math.max(target.w / iw, target.h / ih);
        const sw = target.w / scale;
        const sh = target.h / scale;
        const sx = (iw - sw) / 2;
        const sy = (ih - sh) / 2;
        ctx.drawImage(nextSrc.img, sx, sy, sw, sh, 0, 0, target.w, target.h);
      } else {
        const scale = Math.min(target.w / iw, target.h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (target.w - dw) / 2;
        const dy = (target.h - dh) / 2;
        ctx.drawImage(nextSrc.img, 0, 0, iw, ih, dx, dy, dw, dh);
      }
    } else if (isMaker) {
      const grad = ctx.createLinearGradient(0, 0, target.w, target.h);
      grad.addColorStop(0, nextBg);
      grad.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, target.w, target.h);
    }

    if (isMaker && (nextHeadline.trim() || nextSubtext.trim())) {
      if (nextSrc) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.48)';
        ctx.fillRect(0, 0, target.w, target.h);
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      const titleSize = nextPreset === 'reel' ? 76 : 42;
      const subSize = nextPreset === 'reel' ? 36 : 20;
      if (nextHeadline.trim()) {
        ctx.font = `800 ${titleSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(nextHeadline.trim(), target.w / 2, target.h * (nextSubtext.trim() ? 0.45 : 0.5), target.w - 140);
      }
      if (nextSubtext.trim()) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.font = `500 ${subSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(nextSubtext.trim(), target.w / 2, target.h * 0.58, target.w - 160);
      }
    }

    const mime = nextFmt === 'png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setOutUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutSize(blob.size);
      },
      mime,
      nextFmt === 'jpg' ? 0.92 : undefined
    );
  };

  useEffect(() => {
    if (isMaker) {
      renderGraphic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (outUrl) URL.revokeObjectURL(outUrl);
    };
  }, [outUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const extOk = /\.(jpe?g|png|webp)$/i.test(f.name);
    if (!ALLOWED_IMAGE_MIME.has(f.type.toLowerCase()) && !extOk) {
      setErrors([`Unsupported file type (${f.type || f.name}). Please upload JPG, PNG, or WebP.`]);
      return;
    }
    if (f.size > MAX_RESIZER_BYTES) {
      setErrors([`File exceeds the 20 MB limit (${(f.size / (1024 * 1024)).toFixed(2)} MB).`]);
      return;
    }
    const r = new FileReader();
    r.onerror = () => setErrors(['Could not read selected file.']);
    r.onload = () => {
      const img = new Image();
      img.onerror = () => setErrors(['Invalid or corrupted image file.']);
      img.onload = () => {
        const info = {name: f.name, size: f.size, width: img.width, height: img.height, img};
        setErrors([]);
        setSrcInfo(info);
        renderGraphic(preset, fitMode, format, bgColor, headline, subtext, info);
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  const reset = () => {
    setSrcInfo(null);
    if (!isMaker) {
      setOutUrl(null);
      setOutSize(null);
    } else {
      renderGraphic(preset, fitMode, format, bgColor, headline, subtext, null);
    }
    setErrors([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
        Processes graphics locally via HTML5 Canvas to exact <strong>{dims.label}</strong> specifications — zero uploads, zero watermarks.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {showPresetSelector && (
          <div>
            <label htmlFor="fb-ir-preset" className={LABEL_CLASS}>Facebook Placement Preset</label>
            <select
              id="fb-ir-preset"
              value={preset}
              onChange={(e) => {
                const p = e.target.value as ImagePresetKey;
                setPreset(p);
                if (srcInfo) renderGraphic(p, fitMode, format, bgColor, headline, subtext, srcInfo);
              }}
              className={INPUT_CLASS}
            >
              <option value="post">Feed / Link Post (1200×630)</option>
              <option value="cover">Cover Photo (820×312)</option>
              <option value="square">Square Post (1080×1080)</option>
              <option value="reel">Story / Reel Cover (1080×1920)</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="fb-ir-fit" className={LABEL_CLASS}>Scaling Mode</label>
          <select
            id="fb-ir-fit"
            value={fitMode}
            onChange={(e) => {
              const fm = e.target.value as 'crop' | 'fit';
              setFitMode(fm);
              renderGraphic(preset, fm, format, bgColor, headline, subtext, srcInfo);
            }}
            className={INPUT_CLASS}
          >
            <option value="crop">Center Crop (Fill Frame)</option>
            <option value="fit">Fit Inside (With Padding)</option>
          </select>
        </div>

        <div>
          <label htmlFor="fb-ir-fmt" className={LABEL_CLASS}>Download Format</label>
          <select
            id="fb-ir-fmt"
            value={format}
            onChange={(e) => {
              const fmt = e.target.value as 'jpg' | 'png';
              setFormat(fmt);
              renderGraphic(preset, fitMode, fmt, bgColor, headline, subtext, srcInfo);
            }}
            className={INPUT_CLASS}
          >
            <option value="jpg">JPG (Recommended for photos)</option>
            <option value="png">PNG (Lossless for text)</option>
          </select>
        </div>

        <div>
          <label htmlFor="fb-ir-bg" className={LABEL_CLASS}>Background / Padding Color</label>
          <input
            id="fb-ir-bg"
            type="color"
            value={bgColor}
            onChange={(e) => {
              setBgColor(e.target.value);
              renderGraphic(preset, fitMode, format, e.target.value, headline, subtext, srcInfo);
            }}
            className="h-9 w-full rounded-xl border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900 cursor-pointer"
          />
        </div>

        {isMaker && (
          <>
            <div className="sm:col-span-2">
              <label htmlFor="fb-ir-head" className={LABEL_CLASS}>Banner Headline Text (optional)</label>
              <input
                id="fb-ir-head"
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  renderGraphic(preset, fitMode, format, bgColor, e.target.value, subtext, srcInfo);
                }}
                placeholder="Enter headline..."
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="fb-ir-sub" className={LABEL_CLASS}>Subtitle / Tagline (optional)</label>
              <input
                id="fb-ir-sub"
                type="text"
                value={subtext}
                onChange={(e) => {
                  setSubtext(e.target.value);
                  renderGraphic(preset, fitMode, format, bgColor, headline, e.target.value, srcInfo);
                }}
                placeholder="Enter supporting line..."
                className={INPUT_CLASS}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="fb-ir-file"
          className="relative inline-flex items-center gap-2 overflow-hidden cursor-pointer rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0A8CFF] focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>{srcInfo ? 'Replace Image' : isMaker ? 'Upload Background Image (Optional)' : 'Upload Image'}</span>
          <input
            ref={fileRef}
            id="fb-ir-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={handleUpload}
            aria-label={srcInfo ? 'Replace Image' : isMaker ? 'Upload Background Image (Optional)' : 'Upload Image'}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        {!isMaker && (
          <button
            type="button"
            onClick={() => {
              if (!srcInfo) {
                setErrors(['Please upload a JPG, PNG, or WebP image (max 20 MB) first.']);
                return;
              }
              setErrors([]);
              renderGraphic();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            <span>Resize ({dims.w}×{dims.h})</span>
          </button>
        )}

        {(preset === 'cover' || preset === 'reel') && (
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" checked={showSafeGuide} onChange={(e) => setShowSafeGuide(e.target.checked)} />
            <span>Preview safe-zone guide (not included in export)</span>
          </label>
        )}

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {outUrl && (
        <div data-result className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div className="relative flex justify-center bg-slate-950 rounded-xl overflow-hidden p-2">
            <img src={outUrl} alt={`${dims.w}x${dims.h} preview`} className="max-h-72 object-contain" />
            {showSafeGuide && preset === 'cover' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-2 w-[78%] border-2 border-dashed border-amber-300/80 flex items-end justify-center pb-1"
              >
                <span className="bg-slate-950/75 text-amber-200 text-[10px] px-2 py-0.5 rounded">
                  Mobile-safe center zone
                </span>
              </div>
            )}
            {showSafeGuide && preset === 'reel' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-6 w-40 border-2 border-dashed border-amber-300/80 flex items-center justify-center"
              >
                <span className="bg-slate-950/75 text-amber-200 text-[10px] px-2 py-0.5 rounded">
                  Feed 1:1 / Title safe zone
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-between items-center gap-3 text-xs">
            <div className="font-mono text-slate-700 dark:text-slate-300">
              Output: <strong>{dims.w} × {dims.h} px</strong> · {format.toUpperCase()}
              {outSize !== null && ` · ${(outSize / 1024).toFixed(1)} KB`}
              {srcInfo && ` (from ${srcInfo.width}×${srcInfo.height})`}
            </div>
            <a
              href={outUrl}
              download={`facebook_${preset}_${dims.w}x${dims.h}.${format}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs sm:text-sm font-semibold"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download {format.toUpperCase()} ({dims.w}×{dims.h})</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Facebook Bio & Page Bio Generator
// ============================================================================
export function FbBioGenerator({isPageBio}: {isPageBio: boolean}) {
  const {copiedId, copy} = useClipboardState();
  const [niche, setNiche] = useState(isPageBio ? 'GreenLeaf Coffee Roasters' : 'Digital Creator');
  const [value, setValue] = useState(isPageBio ? 'Small-batch specialty coffee & weekend workshops in Austin' : 'Productivity & design tips');
  const [cta, setCta] = useState(isPageBio ? 'Order online or visit daily 7am–5pm' : 'Join our community');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState({niche, value, cta});
  const [batch, setBatch] = useState(0);

  const bios = useMemo(() => {
    const base = generateFacebookBios({
      niche: submitted.niche,
      value: submitted.value,
      cta: submitted.cta,
      maxIntroChars: 101,
      batch,
    });
    if (isPageBio) {
      const extendedRaw = `${submitted.niche} delivers ${submitted.value}. Trusted by our community for clear service and reliable updates. ${submitted.cta}`;
      const extendedFitted = fitBioWithinCap(extendedRaw, 255);
      base.push({
        title: 'Extended Page About Summary (255-char cap)',
        bio: extendedFitted,
        length: Array.from(extendedFitted).length,
        cap: 255,
      });
    }
    const rot = batch % base.length;
    const rotated = [...base.slice(rot), ...base.slice(0, rot)];
    return rotated.map((b) => ({
      ...b,
      length: Array.from(b.bio).length,
    }));
  }, [submitted, isPageBio, batch]);

  const handleGenerate = (nextBatch = 0) => {
    if (!niche.trim() && !value.trim()) {
      setErrors(['Please enter at least your niche/business name or what you offer.']);
      return;
    }
    setErrors([]);
    setSubmitted({niche: niche.trim() || 'Creator', value: value.trim() || 'helpful guides', cta: cta.trim() || 'Learn more'});
    setBatch(nextBatch);
  };

  const reset = () => {
    setNiche('');
    setValue('');
    setCta('');
    setSubmitted({niche: '', value: '', cta: ''});
    setBatch(0);
    setErrors([]);
  };

  const shown = errors.length === 0 && (submitted.niche || submitted.value);

  return (
    <div className="space-y-4 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label htmlFor="fb-bio-niche" className={LABEL_CLASS}>
            {isPageBio ? 'Business / Page Name' : 'Role / Niche'} <span className="text-rose-500">*</span>
          </label>
          <input id="fb-bio-niche" type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Digital Creator" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-bio-val" className={LABEL_CLASS}>
            {isPageBio ? 'What You Offer / Location' : 'Core Value / Topics'}
          </label>
          <input id="fb-bio-val" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g., Weekly design templates" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-bio-cta" className={LABEL_CLASS}>CTA / Hours / Link Note</label>
          <input id="fb-bio-cta" type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g., Message us for quotes" className={INPUT_CLASS} />
        </div>
      </div>

      <FbGeneratorActionBar
        primaryLabel={isPageBio ? 'Generate Page Bios' : 'Generate Profile Bios'}
        hasOutput={Boolean(shown)}
        onGenerate={() => handleGenerate(0)}
        onRegenerate={() => handleGenerate(batch + 1)}
        onReset={reset}
      />

      <FbErrorAlert errors={errors} />

      {shown && (
        <div data-result className="space-y-3 min-w-0">
          {bios.map((b, i) => {
            const overBy = Math.max(0, b.length - b.cap);
            const withinCap = overBy === 0;
            return (
              <div key={`${b.title}-${i}`} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 text-xs space-y-2 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{b.title}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
                        withinCap
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {b.length} / {b.cap} chars
                      {!withinCap ? ` (over limit by ${overBy} chars)` : ''}
                    </span>
                    <FbCopyButton text={b.bio} id={`fb-bio-${i}`} copiedId={copiedId} onCopy={copy} />
                  </div>
                </div>
                <pre className="font-sans whitespace-pre-line break-words [overflow-wrap:anywhere] max-w-full text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs sm:text-sm">
                  {b.bio}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Facebook Username Generator
// ============================================================================
export function FbUsernameGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [base, setBase] = useState('creatorhub');
  const [submitted, setSubmitted] = useState('creatorhub');
  const [batch, setBatch] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleGenerate = (nextBatch = 0) => {
    const cleaned = base.trim().replace(/[^a-zA-Z0-9\s.]/g, '').replace(/\s+/g, '.').replace(/^\.+|\.+$/g, '').replace(/\.{2,}/g, '.');
    if (cleaned.replace(/\./g, '').length < 2) {
      setErrors(['Please enter at least 2 letters or numbers to build valid 5–50 character Facebook usernames.']);
      return;
    }
    setErrors([]);
    setSubmitted(cleaned);
    setBatch(nextBatch);
  };

  const reset = () => {
    setBase('');
    setSubmitted('');
    setBatch(0);
    setErrors([]);
  };

  const candidates = useMemo(() => {
    if (!submitted) return [];
    const root = submitted.toLowerCase().replace(/[^a-z0-9.]/g, '');
    const compact = root.replace(/\./g, '') || 'page';
    const sets = [
      [
        `@${compact}.studio`,
        `@${compact}hq`,
        `@the.${compact}`,
        `@${compact}.hub`,
        `@${compact}.daily`,
        `@hello.${compact}`,
      ],
      [
        `@${compact}.media`,
        `@${compact}club`,
        `@${compact}.co`,
        `@${compact}notes`,
        `@team.${compact}`,
        `@${compact}.pro`,
      ],
    ];
    return sets[batch % sets.length]
      .map((u) => {
        const sanitized = '@' + u.slice(1).slice(0, 50).replace(/\.{2,}/g, '.').replace(/^\.+|\.+$/g, '');
        const check = validateFacebookUsername(sanitized);
        return {handle: sanitized, valid: check.valid};
      })
      .filter((x) => x.valid);
  }, [submitted, batch]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200">
        <strong>Syntax-only generator:</strong> Formats valid 5–50 char Facebook vanity handles (letters, numbers, and periods only — no underscores). Does <strong>not</strong> check live availability on Facebook.
      </div>

      <div>
        <label htmlFor="fb-un-input" className={LABEL_CLASS}>Brand Name or Keyword <span className="text-rose-500">*</span></label>
        <input
          id="fb-un-input"
          type="text"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          placeholder="e.g., GreenLeaf Coffee"
          className={INPUT_CLASS}
        />
      </div>

      <FbGeneratorActionBar
        primaryLabel="Generate Usernames"
        hasOutput={candidates.length > 0 && errors.length === 0}
        onGenerate={() => handleGenerate(0)}
        onRegenerate={() => handleGenerate(batch + 1)}
        onReset={reset}
      />

      <FbErrorAlert errors={errors} />

      {candidates.length > 0 && errors.length === 0 && (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Valid Syntax Candidates ({candidates.length})
            </span>
            <FbCopyButton
              text={candidates.map((c) => c.handle).join('\n')}
              id="un-copy-all"
              copiedId={copiedId}
              onCopy={copy}
              label="Copy All"
            />
          </div>
          <div data-result className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {candidates.map((c, i) => (
              <div
                key={c.handle}
                className="flex justify-between items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono min-w-0"
              >
                <span className="text-blue-600 dark:text-blue-400 truncate min-w-0">{c.handle}</span>
                <FbCopyButton text={c.handle} id={`un-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Font & Stylish Text Generator
// ============================================================================
export function FbFontGenerator({isStylish}: {isStylish: boolean}) {
  const {copiedId, copy} = useClipboardState();
  const [txt, setTxt] = useState(isStylish ? 'Weekend Flash Sale' : 'Facebook Studio');
  const [errors, setErrors] = useState<string[]>([]);

  const fonts = useMemo(() => (txt.trim() ? convertToUnicodeFonts(txt) : []), [txt]);
  const decorations = useMemo(() => (isStylish && txt.trim() ? convertToStylishDecorations(txt) : []), [isStylish, txt]);

  const allText = useMemo(() => {
    const f = fonts.map((x) => `${x.name}: ${x.result}`);
    const d = decorations.map((x) => `${x.name}: ${x.result}`);
    return [...f, ...d].join('\n');
  }, [fonts, decorations]);

  const handleApply = () => {
    if (!txt.trim()) {
      setErrors(['Please enter text to style or convert into Unicode characters.']);
      return;
    }
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fb-font-input" className={LABEL_CLASS}>Your Heading or Text <span className="text-rose-500">*</span></label>
        <input
          id="fb-font-input"
          type="text"
          value={txt}
          onChange={(e) => {
            setTxt(e.target.value);
            if (!e.target.value.trim()) {
              setErrors(['Please enter text to convert.']);
            } else if (errors.length) {
              setErrors([]);
            }
          }}
          placeholder="Type your Facebook heading..."
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Transform Text</span>
        </button>
        {allText && <FbCopyButton text={allText} id="font-copy-all" copiedId={copiedId} onCopy={copy} label="Copy All Styles" />}
        <button
          type="button"
          onClick={() => {
            setTxt('');
            setErrors(['Please enter text to convert.']);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {fonts.length > 0 && (
        <div data-result className="space-y-4 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fonts.map((f) => (
              <div key={f.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">{f.name}</span>
                  <span className="block text-sm text-slate-900 dark:text-white break-words [overflow-wrap:anywhere]">{f.result}</span>
                </div>
                <FbCopyButton text={f.result} id={f.id} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </div>
            ))}
          </div>

          {decorations.length > 0 && (
            <div className="space-y-2 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Framed & Divider Styles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {decorations.map((d, i) => (
                  <div key={d.name} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex justify-between items-center gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">{d.name}</span>
                      <span className="block text-sm text-slate-900 dark:text-white break-words [overflow-wrap:anywhere]">{d.result}</span>
                    </div>
                    <FbCopyButton text={d.result} id={`dec-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Engagement Rate Calculator (Followers & Reach clearly separated)
// ============================================================================
export function FbEngagementCalculator() {
  const {copiedId, copy} = useClipboardState();
  const [method, setMethod] = useState<EngagementMethod>('followers');
  const [denominatorRaw, setDenominatorRaw] = useState('5000');
  const [reactionsRaw, setReactionsRaw] = useState('200');
  const [commentsRaw, setCommentsRaw] = useState('30');
  const [sharesRaw, setSharesRaw] = useState('15');
  const [result, setResult] = useState<EngagementRateResult | null>(() =>
    calculateFacebookEngagementRate({
      method: 'followers',
      denominatorRaw: '5000',
      reactionsRaw: '200',
      commentsRaw: '30',
      sharesRaw: '15',
    })
  );

  const handleCalculate = () => {
    setResult(
      calculateFacebookEngagementRate({
        method,
        denominatorRaw,
        reactionsRaw,
        commentsRaw,
        sharesRaw,
      })
    );
  };

  const reset = () => {
    setDenominatorRaw('');
    setReactionsRaw('0');
    setCommentsRaw('0');
    setSharesRaw('0');
    setResult(null);
  };

  const summary = result?.valid
    ? `${result.methodLabel}: ${result.engagementRate}%\nFormula: ${result.formulaLabel}\nTotal Engagements: ${result.totalEngagements} (Reactions + Comments + Shares)\n${method === 'followers' ? 'Total Followers' : 'Total Reach'}: ${result.denominator}\nTier: ${result.tier}`
    : '';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          {id: 'followers' as EngagementMethod, label: 'Engagement Rate by Followers'},
          {id: 'reach' as EngagementMethod, label: 'Engagement Rate by Reach'},
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setMethod(tab.id);
              if (denominatorRaw.trim()) {
                setResult(
                  calculateFacebookEngagementRate({
                    method: tab.id,
                    denominatorRaw,
                    reactionsRaw,
                    commentsRaw,
                    sharesRaw,
                  })
                );
              }
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
              method === tab.id
                ? 'border-[#0A8CFF] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 text-xs text-slate-700 dark:text-slate-300">
        <strong>Active Formula ({method === 'followers' ? 'By Followers' : 'By Reach'}):</strong>{' '}
        <code className="font-mono text-blue-700 dark:text-blue-300">
          {method === 'followers'
            ? '(Total Engagements / Total Followers) × 100'
            : '(Total Engagements / Total Reach) × 100'}
        </code>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div>
          <label htmlFor="fb-er-denom" className={LABEL_CLASS}>
            {method === 'followers' ? 'Total Followers' : 'Total Reach'} <span className="text-rose-500">*</span>
          </label>
          <input id="fb-er-denom" type="number" min={1} value={denominatorRaw} onChange={(e) => setDenominatorRaw(e.target.value)} placeholder="e.g., 5000" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-er-react" className={LABEL_CLASS}>Reactions</label>
          <input id="fb-er-react" type="number" min={0} value={reactionsRaw} onChange={(e) => setReactionsRaw(e.target.value)} placeholder="200" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-er-comm" className={LABEL_CLASS}>Comments</label>
          <input id="fb-er-comm" type="number" min={0} value={commentsRaw} onChange={(e) => setCommentsRaw(e.target.value)} placeholder="30" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-er-share" className={LABEL_CLASS}>Shares</label>
          <input id="fb-er-share" type="number" min={0} value={sharesRaw} onChange={(e) => setSharesRaw(e.target.value)} placeholder="15" className={INPUT_CLASS} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCalculate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Calculate Engagement Rate</span>
        </button>
        {result?.valid && <FbCopyButton text={summary} id="er-copy" copiedId={copiedId} onCopy={copy} label="Copy Summary" />}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {result && !result.valid && <FbErrorAlert errors={result.errors} />}

      {result && result.valid && (
        <div data-result className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-5 text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{result.methodLabel}</div>
          <div className="text-3xl font-bold font-mono text-[#0A8CFF]">{result.engagementRate}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <strong>{result.tier}</strong> · {result.totalEngagements.toLocaleString()} total engagements / {result.denominator.toLocaleString()}{' '}
            {method === 'followers' ? 'followers' : 'reach'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5.4 Verify & Fix: Interactive Scheduler Planner & Content Calendar Generator
// ============================================================================
interface PlannedSlot {
  id: string;
  date: string;
  time: string;
  format: 'Feed Post' | 'Facebook Reel' | 'Story' | 'Group Prompt';
  topic: string;
  status: 'Draft' | 'Ready';
}

const DEFAULT_PLANNER_NICHE = 'Small Business Tips';
const DEFAULT_PLANNER_DATE = '2026-05-04';
const DEFAULT_PLANNER_FREQ = '3';
const DEFAULT_PLANNER_PILLARS = 'Educational Tip, Behind the Scenes, Community Question, Product Spotlight';

export function FbPlannerTool({isCalendar}: {isCalendar: boolean}) {
  const {copiedId, copy} = useClipboardState();
  const [niche, setNiche] = useState(DEFAULT_PLANNER_NICHE);
  const [startDate, setStartDate] = useState(DEFAULT_PLANNER_DATE);
  const [postsPerWeek, setPostsPerWeek] = useState(DEFAULT_PLANNER_FREQ);
  const [pillars, setPillars] = useState(DEFAULT_PLANNER_PILLARS);
  const [newDate, setNewDate] = useState(DEFAULT_PLANNER_DATE);
  const [newTime, setNewTime] = useState('10:00');
  const [newFormat, setNewFormat] = useState<PlannedSlot['format']>('Feed Post');
  const [newTopic, setNewTopic] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const [slots, setSlots] = useState<PlannedSlot[]>([
    {id: '1', date: '2026-05-04', time: '10:00', format: 'Feed Post', topic: 'Educational Tip: How to save 3 hours a week', status: 'Ready'},
    {id: '2', date: '2026-05-06', time: '13:00', format: 'Facebook Reel', topic: 'Behind the Scenes: Quick packaging walkthrough', status: 'Draft'},
    {id: '3', date: '2026-05-08', time: '18:00', format: 'Group Prompt', topic: 'Weekend check-in: What are you building?', status: 'Draft'},
  ]);

  const generateCalendar = () => {
    const count = Number(postsPerWeek);
    if (!niche.trim()) {
      setErrors(['Please enter your niche or Page topic to build a calendar.']);
      return;
    }
    if (!startDate) {
      setErrors(['Please pick a valid start date.']);
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 7) {
      setErrors(['Posts per week must be a whole number between 1 and 7.']);
      return;
    }
    const pillarList = pillars
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (pillarList.length === 0) {
      setErrors(['Please enter at least one content pillar (comma-separated).']);
      return;
    }
    setErrors([]);

    const formats: PlannedSlot['format'][] = ['Feed Post', 'Facebook Reel', 'Group Prompt', 'Story'];
    const times = ['09:30', '12:30', '17:30', '19:00'];
    const base = new Date(`${startDate}T00:00:00`);
    const generated: PlannedSlot[] = [];
    const totalPosts = count * 2; // 2-week plan
    const stepDays = Math.max(1, Math.floor(7 / count));

    for (let i = 0; i < totalPosts; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i * stepDays);
      const iso = d.toISOString().slice(0, 10);
      const pillar = pillarList[i % pillarList.length];
      generated.push({
        id: `cal-${i}-${Date.now()}`,
        date: iso,
        time: times[i % times.length],
        format: formats[i % formats.length],
        topic: `${pillar}: ${niche.trim()} update #${i + 1}`,
        status: 'Draft',
      });
    }
    setSlots(generated);
  };

  const resetPlanner = () => {
    setNiche(DEFAULT_PLANNER_NICHE);
    setStartDate(DEFAULT_PLANNER_DATE);
    setPostsPerWeek(DEFAULT_PLANNER_FREQ);
    setPillars(DEFAULT_PLANNER_PILLARS);
    setNewDate(DEFAULT_PLANNER_DATE);
    setNewTime('10:00');
    setNewFormat('Feed Post');
    setNewTopic('');
    setErrors([]);
    setSlots([]);
  };

  const addSlot = () => {
    if (!newDate || !newTopic.trim()) {
      setErrors(['Please provide both a date and post topic/copy before adding to the plan.']);
      return;
    }
    setErrors([]);
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-${Date.now()}`,
        date: newDate,
        time: newTime || '10:00',
        format: newFormat,
        topic: newTopic.trim(),
        status: 'Draft',
      },
    ]);
    setNewTopic('');
  };

  const csv = [
    'Date,Time,Format,Topic,Status',
    ...slots.map((s) => `"${s.date}","${s.time}","${s.format}","${s.topic.replace(/"/g, '""')}","${s.status}"`),
  ].join('\n');

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
        <span>
          <strong>Plan-only browser tool:</strong> Does not connect to Facebook, schedule live posts, or publish automatically. Export your CSV and queue posts manually in Meta Business Suite.
        </span>
      </div>

      {isCalendar ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="fb-cal-niche" className={LABEL_CLASS}>Page Niche / Theme <span className="text-rose-500">*</span></label>
              <input id="fb-cal-niche" type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="fb-cal-date" className={LABEL_CLASS}>Start Date</label>
              <input id="fb-cal-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="fb-cal-freq" className={LABEL_CLASS}>Posts per Week (1–7)</label>
              <input id="fb-cal-freq" type="number" min={1} max={7} value={postsPerWeek} onChange={(e) => setPostsPerWeek(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="fb-cal-pillars" className={LABEL_CLASS}>Content Pillars (comma-separated)</label>
              <input id="fb-cal-pillars" type="text" value={pillars} onChange={(e) => setPillars(e.target.value)} className={INPUT_CLASS} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={generateCalendar}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Generate 2-Week Calendar</span>
            </button>
            <button
              type="button"
              onClick={resetPlanner}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="fb-sp-date" className={LABEL_CLASS}>Planned Date</label>
              <input id="fb-sp-date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="fb-sp-time" className={LABEL_CLASS}>Time</label>
              <input id="fb-sp-time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="fb-sp-fmt" className={LABEL_CLASS}>Placement Format</label>
              <select id="fb-sp-fmt" value={newFormat} onChange={(e) => setNewFormat(e.target.value as PlannedSlot['format'])} className={INPUT_CLASS}>
                <option value="Feed Post">Feed Post</option>
                <option value="Facebook Reel">Facebook Reel</option>
                <option value="Story">Story</option>
                <option value="Group Prompt">Group Prompt</option>
              </select>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="fb-sp-topic" className={LABEL_CLASS}>Post Topic or Draft Copy <span className="text-rose-500">*</span></label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="fb-sp-topic"
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter planned post headline or caption summary..."
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={addSlot}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs font-semibold text-white shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Add Slot</span>
                </button>
                <button
                  type="button"
                  onClick={resetPlanner}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FbErrorAlert errors={errors} />

      <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {isCalendar ? 'Generated Content Calendar' : 'Scheduled Content Plan'} ({slots.length} rows)
        </span>
        {slots.length > 0 && (
          <div className="flex items-center gap-2">
            <FbCopyButton text={csv} id="planner-csv" copiedId={copiedId} onCopy={copy} label="Copy CSV" />
            <button
              type="button"
              onClick={() => downloadTextFile(csv, isCalendar ? 'facebook-content-calendar.csv' : 'facebook-post-schedule.csv', 'text/csv;charset=utf-8')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download .csv</span>
            </button>
          </div>
        )}
      </div>

      <div data-result className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
        {slots.length === 0 ? (
          <div className="p-4 text-center text-slate-500">No planned rows yet. Add a slot or generate a calendar above.</div>
        ) : (
          slots.map((row) => (
            <div key={row.id} className="p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{row.date}</span>
                  <span>{row.time}</span>
                  <span className="rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 font-sans font-semibold">
                    {row.format}
                  </span>
                </div>
                <div className="text-slate-800 dark:text-slate-100 font-medium break-words">{row.topic}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setSlots((prev) =>
                      prev.map((item) =>
                        item.id === row.id ? {...item, status: item.status === 'Ready' ? 'Draft' : 'Ready'} : item
                      )
                    )
                  }
                  className={`rounded-lg border px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                    row.status === 'Ready'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {row.status}
                </button>
                <button
                  type="button"
                  onClick={() => setSlots((prev) => prev.filter((item) => item.id !== row.id))}
                  aria-label="Remove row"
                  className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
