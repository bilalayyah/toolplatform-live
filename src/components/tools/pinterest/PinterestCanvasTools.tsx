import React, {useEffect, useState} from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Monitor,
  Palette,
  RotateCcw,
  Smartphone,
  Trash2,
} from 'lucide-react';
import {extractDominantPaletteFromPixels} from '../instagramHelpers';
import {countUnicodeChars, PINTEREST_LIMITS} from '../pinterestHelpers';

const MAX_PIN_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_PALETTE_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validatePinImageFile(file: File, maxBytes = MAX_PIN_IMAGE_BYTES, maxLabel = '20 MB'): string | null {
  const mime = file.type.toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ALLOWED_MIME_TYPES.has(mime) && !extOk) {
    return `Unsupported file format (${file.type || file.name}). Please upload a JPG, PNG, or WebP image.`;
  }
  if (file.size > maxBytes) {
    return `File size (${formatBytes(file.size)}) exceeds the ${maxLabel} browser limit.`;
  }
  return null;
}

function loadPinImage(file: File): Promise<{img: HTMLImageElement; dataUrl: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => resolve({img, dataUrl});
      img.onerror = () => reject(new Error('The selected file could not be decoded as a valid image.'));
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function loadImgFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image.'));
    img.src = dataUrl;
  });
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function PinInlineError({message}: {message: string | null}) {
  if (!message) return null;
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

function drawCoverToRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const tr = w / h;
  const ir = img.naturalWidth / img.naturalHeight;
  let dw = w;
  let dh = h;
  if (ir > tr) {
    dw = h * ir;
  } else {
    dh = w / ir;
  }
  const dx = x - (dw - w) / 2;
  const dy = y - (dh - h) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 4): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let cur = words[0];
  for (let i = 1; i < words.length; i++) {
    const cand = `${cur} ${words[i]}`;
    if (ctx.measureText(cand).width <= maxWidth) {
      cur = cand;
    } else {
      lines.push(cur);
      cur = words[i];
      if (lines.length >= maxLines) break;
    }
  }
  if (lines.length < maxLines) lines.push(cur);
  return lines.slice(0, maxLines);
}

// ============================================================================
// 1. Pinterest Color Palette Extractor (Max 10 MB JPG/PNG/WebP -> 5–6 swatches)
// ============================================================================
export function PinterestColorPaletteExtractor({
  onCopy,
  copiedKey,
}: {
  onCopy: (txt: string, key: string) => void;
  copiedKey: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [swatches, setSwatches] = useState<{hex: string; rgb: string; percent: number}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sampleFromImage = (img: HTMLImageElement) => {
    const sampleSize = 96;
    const canvas = document.createElement('canvas');
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const {data} = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const palette = extractDominantPaletteFromPixels(data, 6);
    setSwatches(palette);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const err = validatePinImageFile(f, MAX_PALETTE_IMAGE_BYTES, '10 MB');
    if (err) {
      setError(err);
      setPreviewUrl(null);
      setSwatches([]);
      return;
    }
    setError(null);
    try {
      const {img, dataUrl} = await loadPinImage(f);
      setFileName(f.name);
      setPreviewUrl(dataUrl);
      sampleFromImage(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to decode uploaded image.');
      setSwatches([]);
    }
  };

  const handleExtractClick = async () => {
    if (!previewUrl) {
      setError('Please upload a JPG, PNG, or WebP image first to sample its pixel colors.');
      return;
    }
    setError(null);
    const img = await loadImgFromDataUrl(previewUrl);
    sampleFromImage(img);
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setFileName('');
    setSwatches([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
        Samples 5–6 dominant HEX &amp; RGB colors directly from the pixels of <strong>your uploaded image</strong> via HTML5 Canvas (JPG/PNG/WebP, max 10 MB). Never uses fixed demo swatches.
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 focus-within:ring-2 focus-within:ring-red-500">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{previewUrl ? 'Change Pin Image' : 'Upload Image (Max 10 MB)'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload Pin image to extract color palette"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <button
          type="button"
          onClick={handleExtractClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50"
        >
          <Palette className="h-4 w-4 text-red-600" /> Extract Colors
        </button>

        {swatches.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => onCopy(swatches.map((s) => s.hex).join(', '), 'pin-pal-all')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 px-3.5 py-2.5 font-semibold text-white"
            >
              {copiedKey === 'pin-pal-all' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'pin-pal-all' ? 'Copied All HEX' : 'Copy All HEX'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </>
        )}
      </div>

      <PinInlineError message={error} />

      {previewUrl && swatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="md:col-span-5 flex flex-col items-center justify-center rounded-xl bg-slate-950 p-3">
            <img src={previewUrl} alt="Uploaded inspiration pin" className="max-h-72 rounded-lg object-contain" />
            <span className="mt-2 text-[11px] font-mono text-slate-400 truncate max-w-full">{fileName}</span>
          </div>

          <div className="md:col-span-7 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Sampled Palette ({swatches.length} Dominant Colors)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {swatches.map((sw, idx) => (
                <div
                  key={`${sw.hex}-${idx}`}
                  className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="h-10 w-10 rounded-lg border border-black/10 shrink-0"
                      style={{backgroundColor: sw.hex}}
                    />
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{sw.hex}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {sw.rgb} · ~{sw.percent}%
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Copy ${sw.hex}`}
                    onClick={() => onCopy(sw.hex, `sw-${idx}`)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-semibold"
                  >
                    {copiedKey === `sw-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `sw-${idx}` ? 'Copied' : 'Copy'}</span>
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
// 2. Pinterest Rich Pin Preview Generator (100 title / 500 desc + Desktop/Mobile + PNG)
// ============================================================================
export function PinterestRichPinPreviewGenerator({
  onCopy,
  copiedKey,
}: {
  onCopy: (txt: string, key: string) => void;
  copiedKey: string | null;
}) {
  const [richType, setRichType] = useState<'article' | 'product' | 'recipe'>('article');
  const [pinTitle, setPinTitle] = useState('Small Entryway Mudroom Organization Guide: 7 Functional Storage Ideas');
  const [pinDesc, setPinDesc] = useState(
    'Transform narrow entryways with wall-mounted hooks, slim shoe benches, woven baskets, and vertical shelving. Save this practical step-by-step storage blueprint so every bag, coat, and umbrella has a tidy spot before busy weekday mornings start.',
  );
  const [domain, setDomain] = useState('craftstudio.example');
  const [boardName, setBoardName] = useState('Small Space Organization');
  const [extraMeta, setExtraMeta] = useState('5 min read · Updated Checklist');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expanded, setExpanded] = useState(false);
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const titleChars = countUnicodeChars(pinTitle);
  const descChars = countUnicodeChars(pinDesc);
  const titleOver = titleChars > PINTEREST_LIMITS.pinTitle;
  const descOver = descChars > PINTEREST_LIMITS.pinDescription;
  const isLongDesc = descChars > 110;
  const displayDesc = expanded || !isLongDesc ? pinDesc : `${Array.from(pinDesc).slice(0, 110).join('').trim()}…`;

  const validateFields = (): boolean => {
    if (!pinTitle.trim()) {
      setError('Pin Title is required (max 100 characters).');
      return false;
    }
    if (!pinDesc.trim()) {
      setError('Pin Description is required (max 500 characters).');
      return false;
    }
    if (titleOver) {
      setError(`Pin Title exceeds Pinterest's ${PINTEREST_LIMITS.pinTitle}-character limit.`);
      return false;
    }
    if (descOver) {
      setError(`Pin Description exceeds Pinterest's ${PINTEREST_LIMITS.pinDescription}-character limit.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const err = validatePinImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img, dataUrl} = await loadPinImage(f);
      setImgEl(img);
      setImgDataUrl(dataUrl);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to decode image.');
    }
  };

  const handleDownloadPng = () => {
    if (!validateFields()) return;
    const canvas = document.createElement('canvas');
    const isDesktop = viewMode === 'desktop';
    const W = isDesktop ? 920 : 460;
    const H = isDesktop ? 560 : 820;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(24, 24, W - 48, H - 48, 28);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    const imgX = 44;
    const imgY = 44;
    const imgW = isDesktop ? 340 : W - 88;
    const imgH = isDesktop ? H - 88 : 440;

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 20);
    ctx.fill();

    if (imgEl) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 20);
      ctx.clip();
      drawCoverToRect(ctx, imgEl, imgX, imgY, imgW, imgH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 20px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pin Visual Preview (Optional Image)', imgX + imgW / 2, imgY + imgH / 2);
      ctx.textAlign = 'left';
    }

    const tx = isDesktop ? 420 : 44;
    let ty = isDesktop ? 56 : 510;
    const tw = isDesktop ? W - tx - 52 : W - 88;

    // Save button + board badge
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(tx + tw - 92, ty, 92, 38, 19);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Save', tx + tw - 46, ty + 25);
    ctx.textAlign = 'left';

    if (boardName.trim()) {
      ctx.fillStyle = '#334155';
      ctx.font = '600 15px Inter, system-ui, sans-serif';
      ctx.fillText(`Board: ${boardName}`, tx, ty + 25);
    }
    ty += 62;

    // Rich type + domain
    ctx.fillStyle = '#64748b';
    ctx.font = '600 15px Inter, system-ui, sans-serif';
    const metaHeader = [richType.toUpperCase(), domain.trim(), extraMeta.trim()].filter(Boolean).join(' · ');
    ctx.fillText(metaHeader, tx, ty);
    ty += 34;

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    const tLines = wrapCanvasText(ctx, pinTitle, tw, 3);
    for (const line of tLines) {
      ctx.fillText(line, tx, ty);
      ty += 32;
    }

    ty += 12;
    ctx.fillStyle = '#334155';
    ctx.font = '400 16px Inter, system-ui, sans-serif';
    const dLines = wrapCanvasText(ctx, pinDesc, tw, isDesktop ? 7 : 5);
    for (const line of dLines) {
      ctx.fillText(line, tx, ty);
      ty += 24;
    }

    triggerDownload(canvas.toDataURL('image/png'), `pinterest_rich_pin_preview_${viewMode}.png`);
  };

  const handleReset = () => {
    setPinTitle('');
    setPinDesc('');
    setDomain('');
    setBoardName('');
    setExtraMeta('');
    setImgDataUrl(null);
    setImgEl(null);
    setExpanded(false);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
        Previews Article, Product &amp; Recipe Rich Pins strictly from <strong>your entered metadata</strong> (no URL scraping, no AI, zero watermarks).
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Rich Pin Type</span>
          <select
            value={richType}
            onChange={(e) => {
              const t = e.target.value as 'article' | 'product' | 'recipe';
              setRichType(t);
              if (t === 'product') setExtraMeta('$48.00 · In Stock');
              else if (t === 'recipe') setExtraMeta('Prep: 20m · 4 Servings');
              else setExtraMeta('5 min read · Guide');
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="article">Article Rich Pin</option>
            <option value="product">Product Rich Pin</option>
            <option value="recipe">Recipe Rich Pin</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Website / Domain (Optional)</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Board Name (Optional)</span>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Home Organization"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
            <span>Pin Title *</span>
            <span className={`font-mono ${titleOver ? 'text-rose-600' : 'text-slate-500'}`}>
              {titleChars} / {PINTEREST_LIMITS.pinTitle}
            </span>
          </span>
          <input
            type="text"
            value={pinTitle}
            onChange={(e) => {
              setPinTitle(e.target.value);
              if (e.target.value.trim() && pinDesc.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {richType === 'product' ? 'Price / Availability' : richType === 'recipe' ? 'Time / Servings' : 'Article Metadata'}
          </span>
          <input
            type="text"
            value={extraMeta}
            onChange={(e) => setExtraMeta(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>

        <label className="space-y-1 sm:col-span-3">
          <span className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
            <span>Pin Description *</span>
            <span className={`font-mono ${descOver ? 'text-rose-600' : 'text-slate-500'}`}>
              {descChars} / {PINTEREST_LIMITS.pinDescription}
            </span>
          </span>
          <textarea
            rows={3}
            value={pinDesc}
            onChange={(e) => {
              setPinDesc(e.target.value);
              if (pinTitle.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 font-semibold hover:bg-slate-50">
            <ImageIcon className="h-3.5 w-3.5 text-red-600" />
            <span>{imgDataUrl ? 'Change Pin Image' : 'Optional Pin Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload optional Rich Pin image"
              onChange={handleUpload}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold ${
              viewMode === 'desktop' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold ${
              viewMode === 'mobile' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Mobile Preview
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!validateFields()) return;
              onCopy(`${pinTitle}\n\n${pinDesc}${domain ? `\n${domain}` : ''}`, 'rich-pin-copy');
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-semibold"
          >
            {copiedKey === 'rich-pin-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'rich-pin-copy' ? 'Copied Pin Text' : 'Copy Pin Text'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            <Download className="h-3.5 w-3.5" /> Download PNG
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-600 dark:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <PinInlineError message={error} />

      {/* Live Preview Mockup (Desktop side-by-side vs Mobile stacked feed card) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-4 sm:p-6 flex justify-center">
        <div
          data-testid="rich-pin-mockup"
          data-layout={viewMode}
          className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden ${
            viewMode === 'desktop' ? 'w-full max-w-2xl grid grid-cols-1 md:grid-cols-12' : 'w-full max-w-[320px] flex flex-col'
          }`}
        >
          <div className={`${viewMode === 'desktop' ? 'md:col-span-5 min-h-[280px]' : 'h-64 w-full'} bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden`}>
            {imgDataUrl ? (
              <img src={imgDataUrl} alt="Rich Pin visual" className="h-full w-full object-cover" />
            ) : (
              <span className="px-4 text-center text-xs font-medium text-slate-500">
                Pin Visual Area (upload optional image above)
              </span>
            )}
          </div>

          <div className={`${viewMode === 'desktop' ? 'md:col-span-7' : ''} p-4 sm:p-5 flex flex-col justify-between gap-3 text-xs`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 truncate">
                  {boardName.trim() || 'Unsorted Board'}
                </span>
                <span className="inline-flex items-center rounded-full bg-red-600 px-3.5 py-1.5 text-[11px] font-bold text-white">
                  Save
                </span>
              </div>

              {(domain.trim() || extraMeta.trim()) && (
                <div className="text-[11px] font-semibold text-slate-500 flex flex-wrap gap-1.5">
                  <span className="uppercase tracking-wide text-red-600">{richType}</span>
                  {domain.trim() && <span>· {domain}</span>}
                  {extraMeta.trim() && <span>· {extraMeta}</span>}
                </div>
              )}

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {pinTitle.trim() || 'Pin Headline'}
              </h3>

              <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <span>{displayDesc || 'Pin description preview appears here.'}</span>
                {isLongDesc && (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="ml-1 font-bold text-slate-900 dark:text-white hover:underline"
                  >
                    {expanded ? 'See less' : '…more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. Pinterest Collage Maker (2–9 Photos -> 1000 x 1500 2:3 Canvas Collage)
// ============================================================================
interface CollagePhoto {
  id: string;
  name: string;
  dataUrl: string;
}

type CollageLayout = 'split-v' | 'split-h' | 'hero-3' | 'grid-4' | 'grid-6' | 'grid-9';

export function PinterestCollageMaker() {
  const [photos, setPhotos] = useState<CollagePhoto[]>([]);
  const [layout, setLayout] = useState<CollageLayout>('grid-4');
  const [gutter, setGutter] = useState(16);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    if (photos.length + files.length > 9) {
      setError(`Maximum 9 photos allowed per collage (currently ${photos.length}).`);
      return;
    }

    const next: CollagePhoto[] = [];
    for (const f of files) {
      const err = validatePinImageFile(f);
      if (err) {
        setError(err);
        return;
      }
      try {
        const {dataUrl} = await loadPinImage(f);
        next.push({
          id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: f.name,
          dataUrl,
        });
      } catch (loadErr) {
        setError(loadErr instanceof Error ? loadErr.message : `Failed to load ${f.name}.`);
        return;
      }
    }
    setError(null);
    setPhotos((prev) => [...prev, ...next]);
  };

  useEffect(() => {
    let cancelled = false;
    if (photos.length === 0) {
      setOutUrl(null);
      return;
    }
    (async () => {
      const W = 1000;
      const H = 1500;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      const imgs = await Promise.all(photos.map((p) => loadImgFromDataUrl(p.dataUrl)));
      if (cancelled) return;

      const g = gutter;
      const slots: {x: number; y: number; w: number; h: number}[] = [];

      if (layout === 'split-v') {
        const cw = (W - g * 3) / 2;
        slots.push({x: g, y: g, w: cw, h: H - g * 2}, {x: g * 2 + cw, y: g, w: cw, h: H - g * 2});
      } else if (layout === 'split-h') {
        const ch = (H - g * 3) / 2;
        slots.push({x: g, y: g, w: W - g * 2, h: ch}, {x: g, y: g * 2 + ch, w: W - g * 2, h: ch});
      } else if (layout === 'hero-3') {
        const topH = (H - g * 3) * 0.58;
        const botH = (H - g * 3) * 0.42;
        const cw = (W - g * 3) / 2;
        slots.push(
          {x: g, y: g, w: W - g * 2, h: topH},
          {x: g, y: g * 2 + topH, w: cw, h: botH},
          {x: g * 2 + cw, y: g * 2 + topH, w: cw, h: botH},
        );
      } else if (layout === 'grid-4') {
        const cw = (W - g * 3) / 2;
        const ch = (H - g * 3) / 2;
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 2; c++) {
            slots.push({x: g + c * (cw + g), y: g + r * (ch + g), w: cw, h: ch});
          }
        }
      } else if (layout === 'grid-6') {
        const cw = (W - g * 3) / 2;
        const ch = (H - g * 4) / 3;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 2; c++) {
            slots.push({x: g + c * (cw + g), y: g + r * (ch + g), w: cw, h: ch});
          }
        }
      } else {
        const cw = (W - g * 4) / 3;
        const ch = (H - g * 4) / 3;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            slots.push({x: g + c * (cw + g), y: g + r * (ch + g), w: cw, h: ch});
          }
        }
      }

      slots.forEach((slot, idx) => {
        const img = imgs[idx % imgs.length];
        drawCoverToRect(ctx, img, slot.x, slot.y, slot.w, slot.h);
      });

      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      setOutUrl(canvas.toDataURL(mime, 0.94));
    })();
    return () => {
      cancelled = true;
    };
  }, [photos, layout, gutter, bgColor, format]);

  const movePhoto = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= photos.length) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const handleDownload = () => {
    if (!outUrl) {
      setError('Please upload 2–9 JPG, PNG, or WebP photos first.');
      return;
    }
    setError(null);
    triggerDownload(outUrl, `pinterest_collage_1000x1500.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
        Combines up to 9 photos into a clean <strong>1000 × 1500 px (2:3)</strong> Pinterest collage in your browser. Zero uploads · zero watermarks.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 focus-within:ring-2 focus-within:ring-red-500">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>Add Collage Photos ({photos.length}/9)</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload photos for Pinterest collage"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          {([
            ['split-v', '2 Split V'],
            ['split-h', '2 Split H'],
            ['hero-3', '3 Hero'],
            ['grid-4', '4 Grid (2×2)'],
            ['grid-6', '6 Grid (2×3)'],
            ['grid-9', '9 Grid (3×3)'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setLayout(val)}
              className={`px-2.5 py-1.5 rounded-lg font-medium ${layout === val ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
        <label className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Gutter: {gutter}px</span>
          <input
            type="range"
            min={0}
            max={40}
            step={4}
            value={gutter}
            onChange={(e) => setGutter(parseInt(e.target.value, 10))}
            className="accent-red-600"
          />
        </label>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Frame Color:</span>
          {['#ffffff', '#fdf2f8', '#0f172a'].map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Collage background ${c}`}
              onClick={() => setBgColor(c)}
              className={`h-5 w-5 rounded border ${bgColor === c ? 'ring-2 ring-red-500 border-red-500' : 'border-slate-300'}`}
              style={{backgroundColor: c}}
            />
          ))}
        </div>

        <select
          aria-label="Collage format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="ml-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1"
        >
          <option value="png">PNG (1000×1500)</option>
          <option value="jpeg">JPG (1000×1500)</option>
        </select>
      </div>

      <PinInlineError message={error} />

      {photos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-5 space-y-2 text-xs">
            {photos.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={p.dataUrl} alt={p.name} className="h-10 w-10 rounded object-cover shrink-0" />
                  <span className="truncate font-medium">#{idx + 1} · {p.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" aria-label={`Move photo ${idx + 1} up`} disabled={idx === 0} onClick={() => movePhoto(idx, -1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" aria-label={`Move photo ${idx + 1} down`} disabled={idx === photos.length - 1} onClick={() => movePhoto(idx, 1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" aria-label={`Remove photo ${idx + 1}`} onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))} className="p-1 rounded text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {outUrl && (
            <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
              <div className="h-80 aspect-[2/3] mx-auto flex justify-center bg-slate-950 rounded-lg overflow-hidden">
                <img src={outUrl} alt="Pinterest 1000x1500 collage preview" className="h-full object-contain" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-slate-500">1000 × 1500 px (2:3 · Unwatermarked)</span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                >
                  <Download className="h-3.5 w-3.5" /> Download 1000×1500 {format.toUpperCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {photos.length === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-xs text-slate-500">
          <span>Upload 2–9 JPG, PNG, or WebP images to build a crisp 1000×1500 (2:3) Pin collage.</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" /> Download Collage
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. Pinterest Board Cover Maker (600 x 600 Square + optional 222 x 150 preset)
// ============================================================================
const COVER_PALETTES = [
  {id: 'terracotta', name: 'Warm Clay', bg: '#9a3412', text: '#fff7ed', accent: '#fed7aa'},
  {id: 'sage', name: 'Sage Editorial', bg: '#14532d', text: '#f0fdf4', accent: '#bbf7d0'},
  {id: 'cream', name: 'Minimal Cream', bg: '#f8fafc', text: '#0f172a', accent: '#b91c1c'},
  {id: 'espresso', name: 'Deep Charcoal', bg: '#1e293b', text: '#f8fafc', accent: '#fda4af'},
];

export function PinterestBoardCoverMaker() {
  const [boardTitle, setBoardTitle] = useState('Minimalist Living Room');
  const [subtitle, setSubtitle] = useState('CURATED INSPIRATION');
  const [sizePreset, setSizePreset] = useState<'600x600' | '222x150'>('600x600');
  const [paletteId, setPaletteId] = useState(COVER_PALETTES[0].id);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [outUrl, setOutUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dims = sizePreset === '600x600' ? {w: 600, h: 600} : {w: 222, h: 150};

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pal = COVER_PALETTES.find((p) => p.id === paletteId) ?? COVER_PALETTES[0];
    if (bgImg) {
      drawCoverToRect(ctx, bgImg, 0, 0, dims.w, dims.h);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(0, 0, dims.w, dims.h);
    } else {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, dims.w, dims.h);
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = Math.max(2, Math.round(dims.w * 0.01));
      const pad = Math.round(dims.w * 0.06);
      ctx.strokeRect(pad, pad, dims.w - pad * 2, dims.h - pad * 2);
    }

    const titleColor = bgImg ? '#ffffff' : pal.text;
    const subColor = bgImg ? '#fecdd3' : pal.accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (subtitle.trim()) {
      ctx.fillStyle = subColor;
      ctx.font = `bold ${sizePreset === '600x600' ? 20 : 10}px Inter, system-ui, sans-serif`;
      ctx.fillText(subtitle.trim().toUpperCase(), dims.w / 2, dims.h * (sizePreset === '600x600' ? 0.37 : 0.34));
    }

    ctx.fillStyle = titleColor;
    ctx.font = `bold ${sizePreset === '600x600' ? 48 : 20}px Georgia, serif`;
    const lines = wrapCanvasText(ctx, boardTitle || 'Board Title', dims.w * 0.8, 3);
    const lineHeight = sizePreset === '600x600' ? 56 : 24;
    const startY = dims.h * 0.52 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, dims.w / 2, startY + i * lineHeight);
    });

    setOutUrl(canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95));
  }, [boardTitle, subtitle, sizePreset, dims.w, dims.h, paletteId, bgImg, format]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const err = validatePinImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadPinImage(f);
      setBgImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
        Designs cohesive <strong>600 × 600 px</strong> square Pinterest board covers (or classic <strong>222 × 150 px</strong> thumbnail covers) locally with zero watermarks.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Board Cover Title</span>
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Kicker Label (Optional)</span>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-1.5 cursor-pointer rounded-xl bg-red-600 px-3.5 py-2 font-semibold text-white hover:bg-red-700">
            <ImageIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{bgImg ? 'Replace Photo BG' : 'Upload Photo BG (Optional)'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload optional board cover background image"
              onChange={handleUpload}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          {bgImg && (
            <button
              type="button"
              onClick={() => setBgImg(null)}
              className="rounded-lg border border-rose-200 px-2.5 py-2 text-rose-600 font-medium"
            >
              Clear Photo
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSizePreset('600x600')}
            className={`px-3 py-1.5 rounded-lg font-medium ${sizePreset === '600x600' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            600 × 600 Square
          </button>
          <button
            type="button"
            onClick={() => setSizePreset('222x150')}
            className={`px-3 py-1.5 rounded-lg font-medium ${sizePreset === '222x150' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            222 × 150 Cover
          </button>
          <select
            aria-label="Board cover format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
          </select>
        </div>
      </div>

      {!bgImg && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Palette:</span>
          {COVER_PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaletteId(p.id)}
              className={`px-2.5 py-1.5 rounded-lg font-medium border ${
                paletteId === p.id ? 'border-red-600 bg-red-600 text-white' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <PinInlineError message={error} />

      {outUrl && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex justify-center bg-slate-100 dark:bg-slate-950 rounded-xl p-4">
            <img src={outUrl} alt="Pinterest board cover preview" className="max-h-64 rounded-xl shadow border border-slate-200" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">
              {dims.w} × {dims.h} px (Unwatermarked)
            </span>
            <button
              type="button"
              onClick={() => triggerDownload(outUrl, `pinterest_board_cover_${dims.w}x${dims.h}.${format === 'jpeg' ? 'jpg' : 'png'}`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download {dims.w}×{dims.h} {format.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. Pinterest Pin Mockup Generator (1000 x 1500 Pin Feed Mockup PNG/JPG)
// ============================================================================
export function PinterestPinMockupGenerator() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [pinTitle, setPinTitle] = useState('Cozy Reading Nook Styling Ideas');
  const [boardName, setBoardName] = useState('Home Interiors');
  const [creatorDomain, setCreatorDomain] = useState('studio-notes.example');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const W = 1000;
    const H = 1500;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Soft feed frame backdrop
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, W, H);

    // Pin Card container
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(48, 48, W - 96, H - 96, 44);
    ctx.fill();

    // Artwork area (2:3 inner card)
    const artX = 76;
    const artY = 76;
    const artW = W - 152;
    const artH = 1080;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, 32);
    ctx.clip();
    drawCoverToRect(ctx, srcImg, artX, artY, artW, artH);
    ctx.restore();

    // Save button pill on top right of image
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(artX + artW - 160, artY + 28, 132, 56, 28);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Save', artX + artW - 94, artY + 65);
    ctx.textAlign = 'left';

    // Board & domain meta
    let y = artY + artH + 56;
    ctx.fillStyle = '#64748b';
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillText([creatorDomain.trim(), boardName.trim()].filter(Boolean).join(' · ') || 'Pinterest Feed Mockup', 84, y);

    // Pin Title
    y += 54;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 40px Inter, system-ui, sans-serif';
    const lines = wrapCanvasText(ctx, pinTitle || 'Pin Title Preview', W - 168, 3);
    for (const line of lines) {
      ctx.fillText(line, 84, y);
      y += 52;
    }

    setOutUrl(canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95));
  }, [srcImg, pinTitle, boardName, creatorDomain, format]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const err = validatePinImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadPinImage(f);
      setSrcImg(img);
      setFileName(f.name);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load Pin graphic.');
    }
  };

  const handleDownload = () => {
    if (!outUrl) {
      setError('Please upload a JPG, PNG, or WebP Pin graphic first.');
      return;
    }
    setError(null);
    triggerDownload(outUrl, `pinterest_pin_mockup_1000x1500.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
        Previews your Pin artwork, headline, board &amp; domain attribution inside a crisp <strong>1000 × 1500 px</strong> Pinterest feed mockup (zero AI, zero watermarks).
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Pin Title</span>
          <input
            type="text"
            value={pinTitle}
            onChange={(e) => setPinTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Board Name</span>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Creator / Domain</span>
          <input
            type="text"
            value={creatorDomain}
            onChange={(e) => setCreatorDomain(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 focus-within:ring-2 focus-within:ring-red-500">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Pin Image' : 'Upload Pin Image (Max 20 MB)'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload Pin graphic for mockup preview"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <select
          aria-label="Mockup export format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
        >
          <option value="png">PNG (1000×1500)</option>
          <option value="jpeg">JPG (1000×1500)</option>
        </select>
      </div>

      <PinInlineError message={error} />

      {outUrl ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="h-96 aspect-[2/3] mx-auto flex justify-center bg-slate-950 rounded-lg overflow-hidden">
            <img src={outUrl} alt="Pinterest 1000x1500 Pin mockup preview" className="h-full object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">{fileName} · 1000 × 1500 px (Unwatermarked)</span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download Mockup {format.toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-xs text-slate-500">
          <span>Upload a JPG, PNG, or WebP Pin graphic (max 20 MB) to render a 1000×1500 feed card mockup.</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" /> Download Mockup
          </button>
        </div>
      )}
    </div>
  );
}
