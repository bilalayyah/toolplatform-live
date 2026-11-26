import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FilePlus2,
  Image as ImageIcon,
  Layers,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {PDFDocument} from 'pdf-lib';

const MAX_LI_IMAGE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateLiImageFile(file: File): string | null {
  const mime = file.type.toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ALLOWED_MIME_TYPES.has(mime) && !extOk) {
    return `Unsupported file format (${file.type || file.name}). Please upload a JPG, PNG, or WebP image.`;
  }
  if (file.size > MAX_LI_IMAGE_BYTES) {
    return `File size (${formatBytes(file.size)}) exceeds the 20 MB browser limit.`;
  }
  return null;
}

function loadLiImage(file: File): Promise<{img: HTMLImageElement; dataUrl: string}> {
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

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode slide image.'));
    img.src = dataUrl;
  });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function LiInlineError({message}: {message: string | null}) {
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

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tw: number,
  th: number,
  offsetXPercent = 0,
  offsetYPercent = 0,
  zoom = 1,
) {
  const tr = tw / th;
  const ir = img.naturalWidth / img.naturalHeight;
  let baseW = tw;
  let baseH = th;
  if (ir > tr) {
    baseW = th * ir;
  } else {
    baseH = tw / ir;
  }
  const dw = baseW * zoom;
  const dh = baseH * zoom;
  const slackX = Math.max(0, dw - tw);
  const slackY = Math.max(0, dh - th);
  const dx = -slackX / 2 + (offsetXPercent / 100) * (slackX / 2);
  const dy = -slackY / 2 + (offsetYPercent / 100) * (slackY / 2);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tw: number,
  th: number,
  bgColor: string,
) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, tw, th);
  const tr = tw / th;
  const ir = img.naturalWidth / img.naturalHeight;
  let dw = tw;
  let dh = th;
  let dx = 0;
  let dy = 0;
  if (ir > tr) {
    dh = tw / ir;
    dy = (th - dh) / 2;
  } else {
    dw = th * ir;
    dx = (tw - dw) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 8,
): string[] {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
        if (lines.length >= maxLines) break;
      }
    }
    if (lines.length < maxLines) lines.push(current);
    if (lines.length >= maxLines) break;
  }
  return lines.slice(0, maxLines);
}

// ============================================================================
// 1. LinkedIn Profile Picture Resizer (400 x 400 + Circle Crop Preview)
// ============================================================================
export function LinkedinProfilePictureResizer() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'crop' | 'pad'>('crop');
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [padColor, setPadColor] = useState('#ffffff');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (fitMode === 'crop') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      drawCoverImage(ctx, srcImg, 400, 400, offsetX, offsetY, zoom);
    } else {
      drawFitImage(ctx, srcImg, 400, 400, padColor);
    }
    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    setOutUrl(canvas.toDataURL(mime, 0.95));
  }, [srcImg, fitMode, zoom, offsetX, offsetY, padColor, format]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateLiImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadLiImage(f);
      setSrcImg(img);
      setFileName(f.name);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load photo.');
    }
  };

  const handleDownload = () => {
    if (!outUrl) {
      setError('Please upload a JPG, PNG, or WebP portrait image first.');
      return;
    }
    setError(null);
    triggerDownload(outUrl, `linkedin_profile_400x400.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Resizes locally in your browser to LinkedIn’s recommended <strong>400 × 400 px</strong> square with live circular avatar preview. Zero server uploads · zero watermarks.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-700 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Headshot' : 'Upload Portrait (Max 20 MB)'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload LinkedIn Profile Photo"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFitMode('crop')}
            className={`px-3 py-1.5 rounded-lg font-medium ${fitMode === 'crop' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Fill &amp; Circle Frame
          </button>
          <button
            type="button"
            onClick={() => setFitMode('pad')}
            className={`px-3 py-1.5 rounded-lg font-medium ${fitMode === 'pad' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Fit Whole Image (Pad)
          </button>
          <select
            aria-label="Export image format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs"
          >
            <option value="png">PNG (Lossless)</option>
            <option value="jpeg">JPG (Compressed)</option>
          </select>
        </div>
      </div>

      {fitMode === 'crop' && srcImg && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs">
          <label className="space-y-1">
            <span className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
              <span>Zoom</span>
              <span className="font-mono">{zoom.toFixed(2)}×</span>
            </span>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-sky-600"
            />
          </label>
          <label className="space-y-1">
            <span className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
              <span>Horizontal Pan</span>
              <span className="font-mono">{offsetX}%</span>
            </span>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600"
            />
          </label>
          <label className="space-y-1">
            <span className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
              <span>Vertical Pan</span>
              <span className="font-mono">{offsetY}%</span>
            </span>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600"
            />
          </label>
        </div>
      )}

      {fitMode === 'pad' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Border Backdrop:</span>
          {['#ffffff', '#f1f5f9', '#0f172a', '#0a66c2'].map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Backdrop ${c}`}
              onClick={() => setPadColor(c)}
              className={`h-6 w-6 rounded-md border ${padColor === c ? 'ring-2 ring-sky-500 border-sky-600' : 'border-slate-300'}`}
              style={{backgroundColor: c}}
            />
          ))}
        </div>
      )}

      <LiInlineError message={error} />

      {outUrl ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-950">
              <div className="relative h-44 w-44 rounded-lg overflow-hidden border border-slate-700">
                <img src={outUrl} alt="Square 400x400 output" className="h-full w-full object-cover" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-sky-400/90"
                />
              </div>
              <span className="text-[11px] text-slate-400">400 × 400 Square + Circle Crop Guide</span>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              <img
                src={outUrl}
                alt="LinkedIn circular avatar preview"
                className="h-44 w-44 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Live LinkedIn Profile Circle Preview</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">
              {fileName} · 400 × 400 px (Unwatermarked)
            </span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download 400×400 {format.toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-xs text-slate-500">
          <span>Supports JPG, PNG, and WebP portraits up to 20 MB. Export is clean and unwatermarked.</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" /> Download 400×400
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. LinkedIn Banner Maker (1584 x 396 with Avatar Safe-Zone Overlay)
// ============================================================================
const BANNER_THEMES = [
  {id: 'linkedin-blue', name: 'LinkedIn Navy', bgStart: '#0a66c2', bgEnd: '#004182', text: '#ffffff', accent: '#bae6fd'},
  {id: 'executive-slate', name: 'Executive Slate', bgStart: '#0f172a', bgEnd: '#1e293b', text: '#f8fafc', accent: '#38bdf8'},
  {id: 'emerald-growth', name: 'Forest Emerald', bgStart: '#064e3b', bgEnd: '#047857', text: '#ecfdf5', accent: '#6ee7b7'},
  {id: 'warm-editorial', name: 'Minimal Cream', bgStart: '#f8fafc', bgEnd: '#e2e8f0', text: '#0f172a', accent: '#0369a1'},
];

export function LinkedinBannerMaker() {
  const [headline, setHeadline] = useState('Building Reliable Cloud Systems & Developer Tools');
  const [subheadline, setSubheadline] = useState('Staff Engineer · Technical Architecture · Open Source');
  const [ctaLine, setCtaLine] = useState('linkedin.com/in/your-name · Newsletter every Tuesday');
  const [themeId, setThemeId] = useState(BANNER_THEMES[0].id);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [alignment, setAlignment] = useState<'right' | 'center'>('right');
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [bgFileName, setBgFileName] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0.55);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [exportUrl, setExportUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const renderBannerCanvas = (includeSafeGuide: boolean): string => {
    const W = 1584;
    const H = 396;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const theme = BANNER_THEMES.find((t) => t.id === themeId) ?? BANNER_THEMES[0];

    if (bgImg) {
      drawCoverImage(ctx, bgImg, W, H);
      ctx.fillStyle = `rgba(15, 23, 42, ${overlayOpacity})`;
      ctx.fillRect(0, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, theme.bgStart);
      grad.addColorStop(1, theme.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle geometric grid accent
      ctx.strokeStyle = theme.id === 'warm-editorial' ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 66) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.fillStyle = theme.accent;
      ctx.globalAlpha = 0.16;
      ctx.beginPath();
      ctx.arc(W - 90, 60, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    const textColor = bgImg ? '#ffffff' : theme.text;
    const accentColor = bgImg ? '#7dd3fc' : theme.accent;

    // Frame text safely right of bottom-left avatar overlap zone (~0..460px)
    const textX = alignment === 'right' ? W - 80 : 950;
    ctx.textAlign = alignment === 'right' ? 'right' : 'center';
    ctx.textBaseline = 'top';

    ctx.fillStyle = textColor;
    ctx.font = 'bold 50px Inter, system-ui, -apple-system, sans-serif';
    const maxW = alignment === 'right' ? 980 : 880;
    const headLines = wrapCanvasText(ctx, headline || 'Your LinkedIn Value Proposition', maxW, 2);
    let y = 88;
    for (const line of headLines) {
      ctx.fillText(line, textX, y);
      y += 60;
    }

    if (subheadline.trim()) {
      ctx.fillStyle = accentColor;
      ctx.font = '600 28px Inter, system-ui, -apple-system, sans-serif';
      const subLines = wrapCanvasText(ctx, subheadline, maxW, 2);
      y += 8;
      for (const line of subLines) {
        ctx.fillText(line, textX, y);
        y += 38;
      }
    }

    if (ctaLine.trim()) {
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.85;
      ctx.font = '500 22px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillText(ctaLine, textX, Math.min(H - 54, y + 18));
      ctx.globalAlpha = 1;
    }

    if (includeSafeGuide) {
      // Desktop & mobile profile circle overlap zone (~bottom left)
      ctx.save();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.fillRect(0, H - 185, 420, 185);
      ctx.strokeRect(2, H - 185, 418, 183);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('AVATAR SAFE ZONE (Keep text clear)', 24, H - 108);
      ctx.restore();
    }

    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mime, 0.95);
  };

  useEffect(() => {
    setExportUrl(renderBannerCanvas(false));
    setPreviewUrl(renderBannerCanvas(showSafeZone));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headline, subheadline, ctaLine, themeId, showSafeZone, alignment, bgImg, overlayOpacity, format]);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateLiImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadLiImage(f);
      setBgImg(img);
      setBgFileName(f.name);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load background.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Composes exact <strong>1584 × 396 px</strong> LinkedIn banners locally. Toggle the avatar safe-zone guide while designing — it is automatically excluded from your downloaded file. Zero watermarks.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Main Banner Headline</span>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Your core specialty or value proposition"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Subheadline / Role Tags</span>
          <input
            type="text"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            placeholder="Role · Domain · Outcome"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Portfolio / CTA Footer Line</span>
          <input
            type="text"
            value={ctaLine}
            onChange={(e) => setCtaLine(e.target.value)}
            placeholder="yoursite.com · Weekly notes"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-500">Theme:</span>
          {BANNER_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setThemeId(t.id);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium border ${
                themeId === t.id
                  ? 'border-sky-600 bg-sky-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 font-medium hover:bg-slate-50">
            <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
            <span>{bgImg ? 'Replace Background' : 'Optional Photo BG'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload optional banner background image"
              onChange={handleBgUpload}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          {bgImg && (
            <button
              type="button"
              onClick={() => {
                setBgImg(null);
                setBgFileName('');
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear BG
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowSafeZone((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
            showSafeZone ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <Eye className="h-3.5 w-3.5" /> {showSafeZone ? 'Hide Avatar Safe-Zone' : 'Show Avatar Safe-Zone'}
        </button>

        <button
          type="button"
          onClick={() => setAlignment((a) => (a === 'right' ? 'center' : 'right'))}
          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
        >
          Text Align: {alignment === 'right' ? 'Right Safe Layout' : 'Right-Center'}
        </button>

        {bgImg && (
          <label className="flex items-center gap-2">
            <span className="text-slate-500">Tint:</span>
            <input
              type="range"
              min={0}
              max={0.85}
              step={0.05}
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="accent-sky-600"
            />
          </label>
        )}

        <select
          aria-label="Banner export format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="ml-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs"
        >
          <option value="png">PNG (1584×396)</option>
          <option value="jpeg">JPG (1584×396)</option>
        </select>
      </div>

      <LiInlineError message={error} />

      {previewUrl && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
            <img src={previewUrl} alt="LinkedIn 1584x396 banner preview" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">
              {bgFileName ? `${bgFileName} · ` : ''}1584 × 396 px (4:1 · Unwatermarked)
            </span>
            <button
              type="button"
              onClick={() => triggerDownload(exportUrl, `linkedin_banner_1584x396.${format === 'jpeg' ? 'jpg' : 'png'}`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download 1584×396 {format.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. LinkedIn Banner Resizer (1584x396 Personal / 1128x191 Company Cover)
// ============================================================================
export function LinkedinBannerResizer() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [preset, setPreset] = useState<'personal' | 'company'>('personal');
  const [fitMode, setFitMode] = useState<'crop' | 'pad'>('crop');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [padColor, setPadColor] = useState('#0f172a');
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dims = preset === 'personal' ? {w: 1584, h: 396, label: 'Personal Profile Banner'} : {w: 1128, h: 191, label: 'Company Page Cover'};

  useEffect(() => {
    if (!srcImg) return;
    const render = (withGuide: boolean): string => {
      const canvas = document.createElement('canvas');
      canvas.width = dims.w;
      canvas.height = dims.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      if (fitMode === 'crop') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, dims.w, dims.h);
        drawCoverImage(ctx, srcImg, dims.w, dims.h, offsetX, offsetY);
      } else {
        drawFitImage(ctx, srcImg, dims.w, dims.h, padColor);
      }
      if (withGuide && preset === 'personal') {
        ctx.save();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.fillRect(0, dims.h - 185, 420, 185);
        ctx.strokeRect(2, dims.h - 185, 418, 183);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('AVATAR SAFE ZONE', 24, dims.h - 104);
        ctx.restore();
      }
      return canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
    };
    setExportUrl(render(false));
    setPreviewUrl(render(showSafeZone));
  }, [srcImg, dims.w, dims.h, preset, fitMode, offsetX, offsetY, padColor, showSafeZone, format]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateLiImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadLiImage(f);
      setSrcImg(img);
      setFileName(f.name);
      setOffsetX(0);
      setOffsetY(0);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  const handleDownload = () => {
    if (!exportUrl) {
      setError('Please upload a JPG, PNG, or WebP image first.');
      return;
    }
    setError(null);
    triggerDownload(exportUrl, `linkedin_banner_${dims.w}x${dims.h}.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Fits existing artwork cleanly to LinkedIn’s <strong>1584 × 396 px</strong> Personal Banner or <strong>1128 × 191 px</strong> Company Page cover without stretching. Zero watermarks.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700 focus-within:ring-2 focus-within:ring-sky-500">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Graphic' : 'Upload Banner Image (Max 20 MB)'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload Banner Image to Resize"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreset('personal')}
            className={`px-3 py-1.5 rounded-lg font-medium ${preset === 'personal' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Personal (1584×396)
          </button>
          <button
            type="button"
            onClick={() => setPreset('company')}
            className={`px-3 py-1.5 rounded-lg font-medium ${preset === 'company' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Company Page (1128×191)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setFitMode('crop')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'crop' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
        >
          Fill &amp; Center Crop
        </button>
        <button
          type="button"
          onClick={() => setFitMode('pad')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'pad' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
        >
          Fit Whole Image (Pad)
        </button>
        {preset === 'personal' && (
          <button
            type="button"
            onClick={() => setShowSafeZone((v) => !v)}
            className={`px-2.5 py-1 rounded font-medium ${showSafeZone ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
          >
            {showSafeZone ? 'Hide Safe Zone' : 'Show Safe Zone'}
          </button>
        )}
        <select
          aria-label="Export format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="ml-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
        </select>
      </div>

      {fitMode === 'crop' && srcImg && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Horizontal Offset</span>
              <span className="font-mono">{offsetX}%</span>
            </span>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600"
            />
          </label>
          <label className="space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Vertical Offset</span>
              <span className="font-mono">{offsetY}%</span>
            </span>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600"
            />
          </label>
        </div>
      )}

      {fitMode === 'pad' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Backdrop:</span>
          {['#0f172a', '#ffffff', '#0a66c2', '#000000'].map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Pad backdrop ${c}`}
              onClick={() => setPadColor(c)}
              className={`h-6 w-6 rounded border ${padColor === c ? 'ring-2 ring-sky-500 border-sky-500' : 'border-slate-300'}`}
              style={{backgroundColor: c}}
            />
          ))}
        </div>
      )}

      <LiInlineError message={error} />

      {previewUrl ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
            <img src={previewUrl} alt="Resized LinkedIn banner" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">
              {fileName} · {dims.w} × {dims.h} px (Unwatermarked)
            </span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download {dims.w}×{dims.h} {format.toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-xs text-slate-500">
          <span>Upload a JPG, PNG, or WebP banner up to 20 MB to crop or fit to {dims.w} × {dims.h} px.</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" /> Download Resized Banner
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. LinkedIn Post Image Resizer (1200x627 Landscape, 1080x1080 Square, 1080x1350)
// ============================================================================
export function LinkedinPostImageResizer() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [preset, setPreset] = useState<'1200x627' | '1080x1080' | '1080x1350'>('1200x627');
  const [fitMode, setFitMode] = useState<'crop' | 'pad'>('crop');
  const [padColor, setPadColor] = useState('#ffffff');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dims =
    preset === '1200x627'
      ? {w: 1200, h: 627}
      : preset === '1080x1350'
        ? {w: 1080, h: 1350}
        : {w: 1080, h: 1080};

  useEffect(() => {
    if (!srcImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (fitMode === 'crop') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dims.w, dims.h);
      drawCoverImage(ctx, srcImg, dims.w, dims.h);
    } else {
      drawFitImage(ctx, srcImg, dims.w, dims.h, padColor);
    }
    setOutUrl(canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95));
  }, [srcImg, dims.w, dims.h, fitMode, padColor, format]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateLiImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadLiImage(f);
      setSrcImg(img);
      setFileName(f.name);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load photo.');
    }
  };

  const handleDownload = () => {
    if (!outUrl) {
      setError('Please upload a JPG, PNG, or WebP post photo first.');
      return;
    }
    setError(null);
    triggerDownload(outUrl, `linkedin_post_${dims.w}x${dims.h}.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700 focus-within:ring-2 focus-within:ring-sky-500">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Image' : 'Upload Feed Photo (Max 20 MB)'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload LinkedIn Post Image"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {([
            ['1200x627', 'Link / Landscape (1200×627)'],
            ['1080x1080', 'Square (1080×1080)'],
            ['1080x1350', 'Portrait 4:5 (1080×1350)'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setPreset(val)}
              className={`px-3 py-1.5 rounded-lg font-medium ${preset === val ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setFitMode('crop')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'crop' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
        >
          Fill &amp; Center Crop
        </button>
        <button
          type="button"
          onClick={() => setFitMode('pad')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'pad' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
        >
          Fit Whole Image (Pad)
        </button>
        {fitMode === 'pad' && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Backdrop:</span>
            {['#ffffff', '#0f172a', '#0a66c2'].map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Post backdrop ${c}`}
                onClick={() => setPadColor(c)}
                className={`h-5 w-5 rounded border ${padColor === c ? 'ring-2 ring-sky-500 border-sky-500' : 'border-slate-300'}`}
                style={{backgroundColor: c}}
              />
            ))}
          </div>
        )}
        <select
          aria-label="Export image format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="ml-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
        </select>
      </div>

      <LiInlineError message={error} />

      {outUrl ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="max-h-80 w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
            <img src={outUrl} alt="Resized LinkedIn post image" className="max-h-80 object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-slate-500">
              {fileName} · {dims.w} × {dims.h} px (Unwatermarked)
            </span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" /> Download {dims.w}×{dims.h} {format.toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-xs text-slate-500">
          <span>Supports JPG, PNG, and WebP up to 20 MB. Outputs clean unwatermarked {dims.w} × {dims.h} px files.</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" /> Download Resized Image
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. LinkedIn Carousel Maker (1080x1080 or 1080x1350 Slides + Combined PDF)
// ============================================================================
interface CarouselSlide {
  id: string;
  badge: string;
  title: string;
  body: string;
  bgDataUrl?: string;
}

const CAROUSEL_THEMES = [
  {id: 'slate', name: 'Deep Navy', bg: '#0f172a', card: '#1e293b', text: '#f8fafc', accent: '#38bdf8'},
  {id: 'linkedin', name: 'LinkedIn Blue', bg: '#0a66c2', card: '#004182', text: '#ffffff', accent: '#bae6fd'},
  {id: 'paper', name: 'Clean Paper', bg: '#f8fafc', card: '#ffffff', text: '#0f172a', accent: '#0369a1'},
  {id: 'forest', name: 'Emerald', bg: '#064e3b', card: '#065f46', text: '#ecfdf5', accent: '#6ee7b7'},
];

async function renderCarouselSlideToDataUrl(
  slide: CarouselSlide,
  index: number,
  total: number,
  size: '1080x1080' | '1080x1350',
  theme: (typeof CAROUSEL_THEMES)[number],
  authorHandle: string,
): Promise<string> {
  const W = 1080;
  const H = size === '1080x1350' ? 1350 : 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  if (slide.bgDataUrl) {
    try {
      const bgImg = await loadImageFromDataUrl(slide.bgDataUrl);
      drawCoverImage(ctx, bgImg, W, H);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.fillRect(0, 0, W, H);
    } catch {
      // Fallback safely to solid theme background
    }
  } else {
    // Clean framed card background
    ctx.fillStyle = theme.card;
    ctx.beginPath();
    ctx.roundRect(56, 56, W - 112, H - 112, 36);
    ctx.fill();
  }

  const textCol = slide.bgDataUrl ? '#ffffff' : theme.text;
  const accentCol = slide.bgDataUrl ? '#7dd3fc' : theme.accent;

  // Header badge + Slide number
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = accentCol;
  ctx.font = 'bold 28px Inter, system-ui, sans-serif';
  ctx.fillText((slide.badge || `SLIDE ${index + 1}`).toUpperCase(), 110, 120);

  ctx.textAlign = 'right';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, W - 110, 120);

  // Accent bar
  ctx.fillStyle = accentCol;
  ctx.fillRect(110, 178, 120, 8);

  // Slide Title
  ctx.textAlign = 'left';
  ctx.fillStyle = textCol;
  ctx.font = 'bold 62px Inter, system-ui, sans-serif';
  const titleLines = wrapCanvasText(ctx, slide.title || 'Slide Headline', W - 220, 4);
  let y = 232;
  for (const line of titleLines) {
    ctx.fillText(line, 110, y);
    y += 78;
  }

  // Body Text
  y += 28;
  ctx.globalAlpha = 0.92;
  ctx.font = '500 38px Inter, system-ui, sans-serif';
  const bodyLines = wrapCanvasText(ctx, slide.body || '', W - 220, 9);
  for (const line of bodyLines) {
    ctx.fillText(line, 110, y);
    y += 54;
  }
  ctx.globalAlpha = 1;

  // Footer
  ctx.fillStyle = accentCol;
  ctx.font = '600 26px Inter, system-ui, sans-serif';
  ctx.fillText(authorHandle.trim() || '@your-linkedin-handle', 110, H - 140);

  ctx.textAlign = 'right';
  ctx.fillStyle = textCol;
  ctx.globalAlpha = 0.75;
  ctx.fillText(index === total - 1 ? 'Follow & Share ↺' : 'Swipe →', W - 110, H - 140);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/png');
}

export function LinkedinCarouselMaker() {
  const [size, setSize] = useState<'1080x1080' | '1080x1350'>('1080x1350');
  const [themeId, setThemeId] = useState(CAROUSEL_THEMES[0].id);
  const [authorHandle, setAuthorHandle] = useState('linkedin.com/in/your-name');
  const [slides, setSlides] = useState<CarouselSlide[]>([
    {
      id: 's1',
      badge: 'Cover · Playbook',
      title: '5 Steps to Cleaner B2B Onboarding',
      body: 'A practical framework we used to cut customer setup time by 40% without adding meetings.',
    },
    {
      id: 's2',
      badge: 'Step 01',
      title: 'Audit the First 15 Minutes',
      body: 'Remove optional profile fields from day one. Ask only for the single input required to reach the first win.',
    },
    {
      id: 's3',
      badge: 'Summary & CTA',
      title: 'Start Simple, Measure Weekly',
      body: 'Save this deck for your next sprint. Comment your favorite onboarding tip below.',
    },
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useMemo(() => CAROUSEL_THEMES.find((t) => t.id === themeId) ?? CAROUSEL_THEMES[0], [themeId]);
  const safeIdx = Math.min(activeIdx, Math.max(0, slides.length - 1));
  const activeSlide = slides[safeIdx];

  useEffect(() => {
    let cancelled = false;
    if (!activeSlide) return;
    renderCarouselSlideToDataUrl(activeSlide, safeIdx, slides.length, size, theme, authorHandle).then((url) => {
      if (!cancelled) setPreviewUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [activeSlide, safeIdx, slides.length, size, theme, authorHandle]);

  const updateSlide = (patch: Partial<CarouselSlide>) => {
    setSlides((prev) => prev.map((s, idx) => (idx === safeIdx ? {...s, ...patch} : s)));
  };

  const addSlide = () => {
    if (slides.length >= 20) {
      setError('Maximum 20 slides reached per carousel deck.');
      return;
    }
    setError(null);
    const nextNum = slides.length + 1;
    setSlides((prev) => [
      ...prev,
      {
        id: `slide-${Date.now()}`,
        badge: `Step ${String(nextNum).padStart(2, '0')}`,
        title: `Key Point #${nextNum}`,
        body: 'Summarize one clear action or metric for this slide.',
      },
    ]);
    setActiveIdx(slides.length);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) {
      setError('A carousel needs at least 1 slide.');
      return;
    }
    setError(null);
    setSlides((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(Math.max(0, idx - 1));
  };

  const handleSlideBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateLiImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {dataUrl} = await loadLiImage(f);
      updateSlide({bgDataUrl: dataUrl});
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load slide image.');
    }
  };

  const exportCurrentPng = () => {
    if (!previewUrl) return;
    triggerDownload(previewUrl, `linkedin_carousel_slide_${safeIdx + 1}.png`);
  };

  const exportCombinedPdf = async () => {
    if (slides.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.create();
      const W = 1080;
      const H = size === '1080x1350' ? 1350 : 1080;
      for (let i = 0; i < slides.length; i++) {
        const pngDataUrl = await renderCarouselSlideToDataUrl(
          slides[i],
          i,
          slides.length,
          size,
          theme,
          authorHandle,
        );
        const pngImage = await pdfDoc.embedPng(dataUrlToUint8Array(pngDataUrl));
        const page = pdfDoc.addPage([W, H]);
        page.drawImage(pngImage, {x: 0, y: 0, width: W, height: H});
      }
      const pdfBytes = await pdfDoc.save();
      triggerBlobDownload(new Blob([new Uint8Array(pdfBytes)], {type: 'application/pdf'}), `linkedin_carousel_${size}.pdf`);
    } catch (pdfErr) {
      setError(pdfErr instanceof Error ? pdfErr.message : 'Failed to generate PDF deck.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
        Template-based carousel designer (NOT AI). Compose up to 20 slides at 1080×1080 or 1080×1350 and export crisp PNGs or a combined LinkedIn Document PDF—zero watermarks.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSize('1080x1350')}
            className={`px-3 py-1.5 rounded-lg font-medium ${size === '1080x1350' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            4:5 Portrait (1080×1350)
          </button>
          <button
            type="button"
            onClick={() => setSize('1080x1080')}
            className={`px-3 py-1.5 rounded-lg font-medium ${size === '1080x1080' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            1:1 Square (1080×1080)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CAROUSEL_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeId(t.id)}
              className={`px-2.5 py-1.5 rounded-lg font-medium border ${
                themeId === t.id
                  ? 'border-sky-600 bg-sky-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <LiInlineError message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Slide list + editor */}
        <div className="lg:col-span-7 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold ${
                    idx === safeIdx
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 dark:bg-sky-600 px-3 py-1.5 font-semibold text-white hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" /> Add Slide ({slides.length}/20)
            </button>
          </div>

          {activeSlide && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Editing Slide {safeIdx + 1} of {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => removeSlide(safeIdx)}
                  className="inline-flex items-center gap-1 text-rose-600 hover:underline font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove Slide
                </button>
              </div>

              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">Kicker / Slide Label</span>
                <input
                  type="text"
                  value={activeSlide.badge}
                  onChange={(e) => updateSlide({badge: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">Slide Headline</span>
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => updateSlide({title: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">Body Copy</span>
                <textarea
                  rows={3}
                  value={activeSlide.body}
                  onChange={(e) => updateSlide({body: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">Footer Handle / Name</span>
                <input
                  type="text"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <label className="relative overflow-hidden inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium">
                  <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                  <span>{activeSlide.bgDataUrl ? 'Replace Slide Photo' : 'Optional Slide BG Photo'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Upload optional slide background image"
                    onChange={handleSlideBgUpload}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
                  />
                </label>
                {activeSlide.bgDataUrl && (
                  <button
                    type="button"
                    onClick={() => updateSlide({bgDataUrl: undefined})}
                    className="text-rose-600 hover:underline font-medium"
                  >
                    Clear Slide Photo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live preview + exports */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 flex flex-col items-center gap-2">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={`Carousel slide ${safeIdx + 1} preview`}
                className="max-h-96 w-auto rounded-lg object-contain"
              />
            )}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <button
                type="button"
                aria-label="Previous slide"
                disabled={safeIdx === 0}
                onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                className="rounded p-1 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono">
                Slide {safeIdx + 1} / {slides.length} ({size})
              </span>
              <button
                type="button"
                aria-label="Next slide"
                disabled={safeIdx >= slides.length - 1}
                onClick={() => setActiveIdx((i) => Math.min(slides.length - 1, i + 1))}
                className="rounded p-1 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={exportCurrentPng}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" /> Slide {safeIdx + 1} PNG
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={exportCombinedPdf}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Layers className="h-3.5 w-3.5" /> {busy ? 'Building PDF...' : 'Download Carousel PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. LinkedIn Carousel PDF Generator (Combine up to 20 images -> 1 PDF)
// ============================================================================
interface PdfSlideItem {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export function LinkedinCarouselPdfGenerator() {
  const [items, setItems] = useState<PdfSlideItem[]>([]);
  const [pagePreset, setPagePreset] = useState<'1080x1350' | '1080x1080' | 'original'>('1080x1350');
  const [fitMode, setFitMode] = useState<'pad' | 'crop'>('pad');
  const [padColor, setPadColor] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (fileList.length === 0) return;

    if (items.length + fileList.length > 20) {
      setError(`You can bundle at most 20 slides per LinkedIn carousel PDF (currently ${items.length}).`);
      return;
    }

    const added: PdfSlideItem[] = [];
    for (const file of fileList) {
      const err = validateLiImageFile(file);
      if (err) {
        setError(err);
        return;
      }
      try {
        const {img, dataUrl} = await loadLiImage(file);
        added.push({
          id: `pdf-slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch (loadErr) {
        setError(loadErr instanceof Error ? loadErr.message : `Failed to load ${file.name}.`);
        return;
      }
    }

    setError(null);
    setDoneMsg(null);
    setItems((prev) => [...prev, ...added]);
  };

  const addTemplateCoverSlide = () => {
    if (items.length >= 20) {
      setError('Maximum 20 slides reached.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = pagePreset === '1080x1080' ? 1080 : 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0a66c2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillText('LinkedIn Document Carousel', 90, 260);
    ctx.fillStyle = '#bae6fd';
    ctx.font = '500 34px Inter, system-ui, sans-serif';
    ctx.fillText('Template Title Card · Ready to Swipe →', 90, 360);

    setError(null);
    setItems((prev) => [
      {
        id: `tpl-cover-${Date.now()}`,
        name: 'Template Cover Slide.png',
        dataUrl: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height,
      },
      ...prev,
    ]);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setDoneMsg(null);
  };

  const generatePdf = async () => {
    if (items.length === 0) {
      setError('Please upload at least one JPG, PNG, or WebP slide image (or add a template cover) first.');
      return;
    }
    setBusy(true);
    setError(null);
    setDoneMsg(null);

    try {
      const pdfDoc = await PDFDocument.create();
      for (const item of items) {
        const img = await loadImageFromDataUrl(item.dataUrl);
        const tw = pagePreset === 'original' ? item.width : 1080;
        const th =
          pagePreset === 'original'
            ? item.height
            : pagePreset === '1080x1350'
              ? 1350
              : 1080;

        const canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        if (pagePreset === 'original') {
          ctx.drawImage(img, 0, 0, tw, th);
        } else if (fitMode === 'crop') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tw, th);
          drawCoverImage(ctx, img, tw, th);
        } else {
          drawFitImage(ctx, img, tw, th, padColor);
        }

        const pngBytes = dataUrlToUint8Array(canvas.toDataURL('image/png'));
        const embedded = await pdfDoc.embedPng(pngBytes);
        const page = pdfDoc.addPage([tw, th]);
        page.drawImage(embedded, {x: 0, y: 0, width: tw, height: th});
      }

      const pdfBytes = await pdfDoc.save();
      triggerBlobDownload(new Blob([new Uint8Array(pdfBytes)], {type: 'application/pdf'}), `linkedin_carousel_${items.length}_slides.pdf`);
      setDoneMsg(`Generated unwatermarked ${items.length}-page PDF (${formatBytes(pdfBytes.byteLength)}).`);
    } catch (pdfErr) {
      setError(pdfErr instanceof Error ? pdfErr.message : 'Failed to build carousel PDF.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900 px-3.5 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        Combines up to 20 ordered JPG, PNG, or WebP slides (max 20 MB each) into one multi-page LinkedIn Document Carousel PDF inside your browser. Zero uploads · zero watermarks.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700 focus-within:ring-2 focus-within:ring-sky-500">
            <FilePlus2 className="h-4 w-4 shrink-0" />
            <span>Add Slide Images ({items.length}/20)</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload slide images for LinkedIn Carousel PDF"
              onChange={handleFilesSelected}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          <button
            type="button"
            onClick={addTemplateCoverSlide}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-medium hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> Insert Template Cover
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {([
            ['1080x1350', '1080×1350 (4:5)'],
            ['1080x1080', '1080×1080 (1:1)'],
            ['original', 'Original Sizes'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setPagePreset(val)}
              className={`px-2.5 py-1.5 rounded-lg font-medium ${pagePreset === val ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {pagePreset !== 'original' && (
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Slide Fit:</span>
          <button
            type="button"
            onClick={() => setFitMode('pad')}
            className={`px-2.5 py-1 rounded font-medium ${fitMode === 'pad' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
          >
            Fit Entire Slide (Pad)
          </button>
          <button
            type="button"
            onClick={() => setFitMode('crop')}
            className={`px-2.5 py-1 rounded font-medium ${fitMode === 'crop' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'}`}
          >
            Fill &amp; Crop
          </button>
          {fitMode === 'pad' && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-500">Page Margin:</span>
              {['#ffffff', '#0f172a'].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`PDF margin ${c}`}
                  onClick={() => setPadColor(c)}
                  className={`h-5 w-5 rounded border ${padColor === c ? 'ring-2 ring-sky-500 border-sky-500' : 'border-slate-300'}`}
                  style={{backgroundColor: c}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <LiInlineError message={error} />

      {doneMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          <span>{doneMsg}</span>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={item.dataUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    #{idx + 1} · {item.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {item.width} × {item.height} px
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label={`Move slide ${idx + 1} up`}
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, -1)}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Move slide ${idx + 1} down`}
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, 1)}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove slide ${idx + 1}`}
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setItems([]);
              setDoneMsg(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear Slides
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={generatePdf}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> {busy ? 'Packaging PDF...' : `Generate & Download PDF (${items.length} slides)`}
        </button>
      </div>
    </div>
  );
}
