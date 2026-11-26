import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  Upload,
  Download,
  Copy,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Palette,
  Grid,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

export function SocialImageCanvasTools({tool}: Props) {
  const slug = tool.slug;

  if (slug === 'youtube-thumbnail-preview') return <YouTubeThumbnailPreview tool={tool} />;
  if (slug === 'youtube-thumbnail-size-checker') return <YouTubeThumbnailSizeChecker tool={tool} />;
  if (slug === 'youtube-thumbnail-color-extractor' || slug === 'instagram-color-palette-extractor') {
    return <ImageColorExtractor tool={tool} />;
  }
  if (
    slug === 'youtube-thumbnail-resizer' ||
    slug === 'instagram-image-resizer' ||
    slug === 'instagram-square-image-cropper' ||
    slug === 'instagram-story-image-resizer'
  ) {
    return <CanvasImageResizer tool={tool} />;
  }
  if (slug === 'youtube-thumbnail-compressor' || slug === 'instagram-image-compressor') {
    return <CanvasImageCompressor tool={tool} />;
  }
  if (slug === 'instagram-reel-cover-maker') return <InstagramReelCoverMaker tool={tool} />;
  if (slug === 'instagram-grid-preview-maker') return <InstagramGridPreviewMaker tool={tool} />;
  if (slug === 'instagram-screenshot-mockup-generator') return <InstagramMockupGenerator tool={tool} />;

  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// =========================================================================
// 1. YOUTUBE THUMBNAIL PREVIEW
// =========================================================================
function YouTubeThumbnailPreview({tool}: {tool: Tool}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [title, setTitle] = useState<string>('How to Build Fast Browser Tools Without Heavy Backend Servers');
  const [channel, setChannel] = useState<string>('Creator Studio Demo');
  const [duration, setDuration] = useState<string>('12:34');
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid JPG, PNG, or WebP image file.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Upload Thumbnail Image (Local Browser Only)
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-5 text-center hover:border-[#0A8CFF] transition-colors">
            <Upload className="h-6 w-6 text-[#0A8CFF] mb-1.5" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Choose JPG, PNG, or WebP file
            </span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Video Title Preview ({title.length}/100 chars)
            </label>
            <input
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Channel Name</label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration Badge</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5">
        {/* Desktop Home Card */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Desktop Home Feed (16:9)
          </span>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              {imageSrc ? (
                <img src={imageSrc} alt="Thumbnail preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400">Upload thumbnail to preview</span>
              )}
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/85 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                {duration || '12:34'}
              </span>
            </div>
            <div className="mt-2.5 flex gap-2.5">
              <div className="h-9 w-9 shrink-0 rounded-full bg-[#0A8CFF]/20 flex items-center justify-center font-bold text-xs text-[#0A8CFF]">
                {(channel || 'C')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {title || 'Untitled Video'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{channel} · 14K views · 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Sidebar Compact Card */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Sidebar / Suggested Small Card
          </span>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex gap-2.5">
              <div className="relative w-40 shrink-0 aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                {imageSrc ? (
                  <img src={imageSrc} alt="Sidebar thumbnail" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[10px] font-bold text-white">
                  {duration || '12:34'}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {title || 'Untitled Video'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">{channel}</p>
                <p className="text-[11px] text-slate-400">14K views · New</p>
              </div>
            </div>

            <div className="rounded-lg bg-sky-50/70 dark:bg-sky-950/30 p-3 text-[11px] text-sky-900 dark:text-sky-200">
              <strong>Readability Tip:</strong> At compact sidebar size (168×94 px), ensure your text and focal subject remain crisp and unobstructed by the bottom-right timestamp badge.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. YOUTUBE THUMBNAIL SIZE CHECKER
// =========================================================================
function YouTubeThumbnailSizeChecker({tool}: {tool: Tool}) {
  const [info, setInfo] = useState<{
    name: string;
    sizeBytes: number;
    width: number;
    height: number;
    type: string;
    previewUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Invalid file: Please upload an image file (JPG, PNG, or WebP).');
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: file.name,
        sizeBytes: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: file.type,
        previewUrl: url,
      });
    };
    img.onerror = () => {
      setError('Could not read image dimensions from this file.');
    };
    img.src = url;
  };

  const checks = useMemo(() => {
    if (!info) return null;
    const ratio = info.width / info.height;
    const is16by9 = Math.abs(ratio - 16 / 9) < 0.03;
    const minWidthOk = info.width >= 640;
    const hdOk = info.width >= 1280 && info.height >= 720;
    const under2Mb = info.sizeBytes <= 2 * 1024 * 1024;
    return [
      {label: `Resolution is 1280×720 HD or larger (Current: ${info.width}×${info.height})`, ok: hdOk, warnOnly: !hdOk && minWidthOk},
      {label: `Minimum width at least 640px (Current: ${info.width}px)`, ok: minWidthOk, warnOnly: false},
      {label: `16:9 widescreen aspect ratio (Current ratio: ${ratio.toFixed(2)}:1 vs 1.78:1)`, ok: is16by9, warnOnly: false},
      {label: `File size under YouTube’s 2 MB limit (Current: ${formatBytes(info.sizeBytes)})`, ok: under2Mb, warnOnly: false},
    ];
  }, [info]);

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-[#0A8CFF]">
        <Upload className="h-7 w-7 text-[#0A8CFF] mb-2" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Select Thumbnail Image to Inspect
        </span>
        <span className="text-xs text-slate-500 mt-1">Checks dimensions, 16:9 ratio, and 2 MB cap locally</span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {info && checks && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5">
          <div>
            <img src={info.previewUrl} alt="Uploaded thumbnail" className="w-full rounded-xl border border-slate-200 object-contain max-h-60 bg-slate-900" />
            <p className="mt-2 text-xs text-slate-500 truncate">{info.name}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              YouTube Specification Checks
            </h4>
            {checks.map((c, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
                  c.ok
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                    : c.warnOnly
                    ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                    : 'border-rose-200 bg-rose-50/70 text-rose-900'
                }`}
              >
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 3. CANVAS COLOR PALETTE EXTRACTOR (YT & IG)
// =========================================================================
function ImageColorExtractor({tool}: {tool: Tool}) {
  const [preview, setPreview] = useState<string>('');
  const [colors, setColors] = useState<{hex: string; rgb: string; pct: number}[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid JPG, PNG, or WebP image file.');
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Quantize colors into 24-level buckets for clean dominant clustering
      const buckets = new Map<string, {r: number; g: number; b: number; count: number}>();
      let totalSampled = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const r = Math.round(data[i] / 24) * 24;
        const g = Math.round(data[i + 1] / 24) * 24;
        const b = Math.round(data[i + 2] / 24) * 24;
        const key = `${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)}`;
        const existing = buckets.get(key);
        if (existing) {
          existing.count++;
        } else {
          buckets.set(key, {
            r: Math.min(255, r),
            g: Math.min(255, g),
            b: Math.min(255, b),
            count: 1,
          });
        }
        totalSampled++;
      }

      const sorted = Array.from(buckets.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map((c) => {
          const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
          return {
            hex: `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`,
            rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
            pct: Math.round((c.count / Math.max(1, totalSampled)) * 100),
          };
        });

      setColors(sorted);
    };
    img.src = url;
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-[#0A8CFF]">
        <Palette className="h-7 w-7 text-[#0A8CFF] mb-2" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Upload Image for Local Color Sampling
        </span>
        <span className="text-xs text-slate-500 mt-1">
          Runs pixel quantization locally on HTML5 Canvas — samples strictly from your uploaded image
        </span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {preview && colors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5">
          <div>
            <img src={preview} alt="Sampled image" className="w-full rounded-xl border border-slate-200 max-h-64 object-contain bg-slate-900" />
          </div>
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dominant Color Swatches
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => copyHex(c.hex)}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-2.5 text-left hover:border-[#0A8CFF] transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 shadow-inner" style={{backgroundColor: c.hex}} />
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{c.hex}</span>
                      {copiedHex === c.hex && <Check className="h-3 w-3 text-emerald-500" />}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{c.rgb}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. CANVAS IMAGE RESIZER / CROPPER (YT 1280x720, IG 1080x1080/1350/1920)
// =========================================================================
function CanvasImageResizer({tool}: {tool: Tool}) {
  const isYt = tool.slug === 'youtube-thumbnail-resizer';
  const isSquareOnly = tool.slug === 'instagram-square-image-cropper';
  const isStoryOnly = tool.slug === 'instagram-story-image-resizer';

  const defaultPreset = isYt
    ? '1280x720'
    : isStoryOnly
    ? '1080x1920'
    : '1080x1080';

  const [preset, setPreset] = useState<string>(defaultPreset);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState<string>('#0f172a');
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const dims = useMemo(() => {
    const [w, h] = preset.split('x').map(Number);
    return {w, h};
  }, [preset]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid JPG, PNG, or WebP image file.');
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = url;
  };

  useEffect(() => {
    if (!sourceImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, dims.w, dims.h);

    const scaleX = dims.w / sourceImg.width;
    const scaleY = dims.h / sourceImg.height;
    const scale = fitMode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

    const drawW = sourceImg.width * scale;
    const drawH = sourceImg.height * scale;
    const dx = (dims.w - drawW) / 2;
    const dy = (dims.h - drawH) / 2;

    ctx.drawImage(sourceImg, dx, dy, drawW, drawH);
    setOutputUrl(canvas.toDataURL('image/jpeg', 0.92));
  }, [sourceImg, dims, fitMode, bgColor]);

  const downloadOutput = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${tool.slug}-${dims.w}x${dims.h}.jpg`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {!isYt && !isSquareOnly && !isStoryOnly && (
            <>
              <button
                type="button"
                onClick={() => setPreset('1080x1080')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${preset === '1080x1080' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
              >
                Square (1080×1080)
              </button>
              <button
                type="button"
                onClick={() => setPreset('1080x1350')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${preset === '1080x1350' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
              >
                Portrait 4:5 (1080×1350)
              </button>
              <button
                type="button"
                onClick={() => setPreset('1080x1920')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${preset === '1080x1920' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
              >
                Story / Reel (1080×1920)
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setFitMode('cover')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${fitMode === 'cover' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
          >
            Crop to Fill
          </button>
          <button
            type="button"
            onClick={() => setFitMode('contain')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${fitMode === 'contain' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
          >
            Fit with Padding
          </button>
        </div>

        {fitMode === 'contain' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Padding Color:</span>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-7 w-7 rounded cursor-pointer" />
          </div>
        )}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-[#0A8CFF]">
        <Upload className="h-7 w-7 text-[#0A8CFF] mb-2" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Upload Photo to Resize to {dims.w}×{dims.h} px
        </span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {outputUrl && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rendered Canvas Output ({dims.w} × {dims.h} px)
            </span>
            <button
              type="button"
              onClick={downloadOutput}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs font-bold text-white"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download {dims.w}×{dims.h} JPG</span>
            </button>
          </div>
          <img src={outputUrl} alt="Resized output" className="mx-auto max-h-80 rounded-xl border border-slate-200 shadow-sm" />
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. CANVAS IMAGE COMPRESSOR (YT < 2MB, IG QUALITY SLIDER)
// =========================================================================
function CanvasImageCompressor({tool}: {tool: Tool}) {
  const [quality, setQuality] = useState<number>(80);
  const [origSize, setOrigSize] = useState<number>(0);
  const [compSize, setCompSize] = useState<number>(0);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('compressed.jpg');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setOrigSize(file.size);
    setFileName(file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg');
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = url;
  };

  useEffect(() => {
    if (!sourceImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = sourceImg.width;
    canvas.height = sourceImg.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(sourceImg, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCompSize(blob.size);
        setOutputUrl(URL.createObjectURL(blob));
      },
      'image/jpeg',
      quality / 100
    );
  }, [sourceImg, quality]);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          JPEG Compression Quality: <strong>{quality}%</strong>
        </label>
        <input
          type="range"
          min="10"
          max="95"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value, 10))}
          className="w-full max-w-md"
        />
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-[#0A8CFF]">
        <Upload className="h-7 w-7 text-[#0A8CFF] mb-2" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Select Image to Compress Locally
        </span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {outputUrl && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <div>Original: <strong className="font-mono">{formatBytes(origSize)}</strong></div>
              <div>
                Compressed: <strong className="font-mono text-emerald-600">{formatBytes(compSize)}</strong>{' '}
                {origSize > 0 && `(${Math.max(0, Math.round(((origSize - compSize) / origSize) * 100))}% smaller)`}
              </div>
            </div>
            <a
              href={outputUrl}
              download={fileName}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs font-bold text-white"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Compressed JPG</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 6. INSTAGRAM REEL COVER MAKER (1080x1920 WITH 1:1 GRID SAFE ZONE)
// =========================================================================
function InstagramReelCoverMaker({tool}: {tool: Tool}) {
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [headline, setHeadline] = useState<string>('5 Quick Workflow Tips');
  const [showSafeGuide, setShowSafeGuide] = useState<boolean>(true);
  const [outputUrl, setOutputUrl] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = url;
  };

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 540, 960);

    if (sourceImg) {
      const scale = Math.max(540 / sourceImg.width, 960 / sourceImg.height);
      const dw = sourceImg.width * scale;
      const dh = sourceImg.height * scale;
      ctx.drawImage(sourceImg, (540 - dw) / 2, (960 - dh) / 2, dw, dh);
    }

    if (headline.trim()) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(40, 415, 460, 130);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(headline.trim().slice(0, 32), 270, 480);
    }

    if (showSafeGuide) {
      // 1:1 profile grid safe zone in center (540x540 -> y from 210 to 750)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(2, 210, 536, 540);
    }

    setOutputUrl(canvas.toDataURL('image/png'));
  }, [sourceImg, headline, showSafeGuide]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Title Overlay</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={showSafeGuide}
              onChange={(e) => setShowSafeGuide(e.target.checked)}
            />
            <span>Show 1:1 Profile Grid Crop Guide</span>
          </label>
        </div>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-5 text-center hover:border-[#0A8CFF]">
        <Upload className="h-6 w-6 text-[#0A8CFF] mb-1" />
        <span className="text-xs font-bold">Upload Background Image (Optional)</span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {outputUrl && (
        <div className="flex flex-col items-center gap-4">
          <img src={outputUrl} alt="Reel cover preview" className="max-h-96 rounded-xl border border-slate-200 shadow-md" />
          <a
            href={outputUrl}
            download="instagram-reel-cover.png"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] px-5 py-2.5 text-xs font-bold text-white"
          >
            <Download className="h-4 w-4" />
            <span>Download Reel Cover PNG</span>
          </a>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 7. INSTAGRAM 3-COLUMN GRID PREVIEW MAKER (UP TO 12 IMAGES)
// =========================================================================
function InstagramGridPreviewMaker({tool}: {tool: Tool}) {
  const [tiles, setTiles] = useState<{id: string; url: string; name: string}[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 12 - tiles.length);
    const added = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(f),
        name: f.name,
      }));
    setTiles((prev) => [...prev, ...added].slice(0, 12));
  };

  const moveTile = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= tiles.length) return;
    setTiles((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeTile = (id: string) => {
    setTiles((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-[#0A8CFF]">
        <Grid className="h-7 w-7 text-[#0A8CFF] mb-2" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Add up to {12 - tiles.length} Photos to Your 3-Column Profile Grid ({tiles.length}/12)
        </span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>

      {tiles.length > 0 && (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="grid grid-cols-3 gap-1">
            {tiles.map((tile, idx) => (
              <div key={tile.id} className="group relative aspect-square overflow-hidden bg-slate-100">
                <img src={tile.url} alt={tile.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveTile(idx, -1)}
                    disabled={idx === 0}
                    className="rounded bg-white/90 p-1 text-slate-900 disabled:opacity-30"
                    title="Move Left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTile(idx, 1)}
                    disabled={idx === tiles.length - 1}
                    className="rounded bg-white/90 p-1 text-slate-900 disabled:opacity-30"
                    title="Move Right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTile(tile.id)}
                    className="rounded bg-rose-600 p-1 text-white"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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

// =========================================================================
// 8. INSTAGRAM SCREENSHOT MOCKUP GENERATOR
// =========================================================================
function InstagramMockupGenerator({tool}: {tool: Tool}) {
  const [handle, setHandle] = useState<string>('studio.design');
  const [location, setLocation] = useState<string>('London, UK');
  const [likes, setLikes] = useState<string>('1,284');
  const [caption, setCaption] = useState<string>('Clean mockup templates built directly inside your browser.');
  const [photoSrc, setPhotoSrc] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Likes Count</label>
            <input
              type="text"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Caption</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs"
          />
        </div>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 text-center hover:border-[#0A8CFF]">
          <Upload className="h-5 w-5 text-[#0A8CFF] mb-1" />
          <span className="text-xs font-bold">Upload Post Image</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {/* Rendered Mockup Card */}
      <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm overflow-hidden max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-slate-100">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-800">
              {(handle || 'U')[0].toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold leading-none">{handle}</div>
            {location && <div className="text-[10px] text-slate-500 mt-0.5">{location}</div>}
          </div>
        </div>
        <div className="aspect-square w-full bg-slate-100 flex items-center justify-center overflow-hidden">
          {photoSrc ? (
            <img src={photoSrc} alt="Mockup post" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">Upload image to preview post</span>
          )}
        </div>
        <div className="p-3.5 space-y-1.5 text-xs">
          <div className="font-bold">{likes} likes</div>
          <div>
            <span className="font-bold mr-1.5">{handle}</span>
            <span>{caption}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
