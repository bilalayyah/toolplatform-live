import React, {useEffect, useState} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Copy,
  Download,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Palette,
  Share2,
  Trash2,
} from 'lucide-react';
import {extractDominantPaletteFromPixels} from '../instagramHelpers';

const MAX_IG_IMAGE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateIgImageFile(file: File): string | null {
  const mime = file.type.toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ALLOWED_MIME_TYPES.has(mime) && !extOk) {
    return `Unsupported file format (${file.type || file.name}). Please upload a JPG, PNG, or WebP image.`;
  }
  if (file.size > MAX_IG_IMAGE_BYTES) {
    return `File size (${formatBytes(file.size)}) exceeds the 20 MB browser limit.`;
  }
  return null;
}

function loadIgImage(file: File): Promise<{img: HTMLImageElement; dataUrl: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => resolve({img, dataUrl});
      img.onerror = () => reject(new Error('The selected file could not be decoded as an image.'));
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function IgInlineError({message}: {message: string | null}) {
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
) {
  const tr = tw / th;
  const ir = img.naturalWidth / img.naturalHeight;
  let dw = tw;
  let dh = th;
  if (ir > tr) {
    dw = th * ir;
  } else {
    dh = tw / ir;
  }
  const slackX = dw - tw;
  const slackY = dh - th;
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

// ============================================================================
// 1. Instagram Image Resizer (1080x1080, 1080x1350, 1080x1920)
// ============================================================================
export function InstagramImageResizer() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState<'1080x1080' | '1080x1350' | '1080x1920'>('1080x1080');
  const [fitMode, setFitMode] = useState<'crop' | 'pad'>('crop');
  const [padColor, setPadColor] = useState<string>('#ffffff');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const tw = 1080;
    const th = preset === '1080x1350' ? 1350 : preset === '1080x1920' ? 1920 : 1080;
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (fitMode === 'crop') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, tw, th);
      drawCoverImage(ctx, srcImg, tw, th);
    } else {
      drawFitImage(ctx, srcImg, tw, th, padColor);
    }
    setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [srcImg, preset, fitMode, padColor]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadIgImage(f);
      setFileName(f.name);
      setSrcImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Image' : 'Upload Image to Resize'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            aria-label="Upload Image to Resize"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Preset:</span>
          {([
            ['1080x1080', '1:1 Square (1080×1080)'],
            ['1080x1350', '4:5 Portrait (1080×1350)'],
            ['1080x1920', '9:16 Story/Reel (1080×1920)'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setPreset(val)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                preset === val
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Framing Mode:</span>
        <button
          type="button"
          onClick={() => setFitMode('crop')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'crop' ? 'bg-pink-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
        >
          Fill &amp; Center Crop
        </button>
        <button
          type="button"
          onClick={() => setFitMode('pad')}
          className={`px-2.5 py-1 rounded font-medium ${fitMode === 'pad' ? 'bg-pink-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
        >
          Fit Whole Photo (Border Pad)
        </button>
        {fitMode === 'pad' && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500">Backdrop:</span>
            {['#ffffff', '#0f172a', '#000000'].map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Backdrop ${c}`}
                onClick={() => setPadColor(c)}
                className={`h-5 w-5 rounded border ${padColor === c ? 'ring-2 ring-pink-500 border-pink-500' : 'border-slate-300'}`}
                style={{backgroundColor: c}}
              />
            ))}
          </div>
        )}
      </div>

      <IgInlineError message={error} />

      {outUrl ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="max-h-80 w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
            <img src={outUrl} alt="Resized Instagram graphic" className="max-h-80 object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {fileName ? `${fileName} · ` : ''}Output: {preset.replace('x', ' × ')} px (Unwatermarked)
            </span>
            <a
              href={outUrl}
              download={`instagram_${preset}.jpg`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Resized JPG
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload any JPG, PNG, or WebP photo (up to 20 MB) to resize to 1080×1080, 1080×1350, or 1080×1920 locally in your browser.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. Instagram Image Compressor (Real toBlob byte size + % savings)
// ============================================================================
export function InstagramImageCompressor() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [origSize, setOrigSize] = useState<number | null>(null);
  const [compSize, setCompSize] = useState<number | null>(null);
  const [outDims, setOutDims] = useState<{w: number; h: number} | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(82);
  const [capWidth1080, setCapWidth1080] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    let active = true;
    const scale = capWidth1080 && srcImg.naturalWidth > 1080 ? 1080 / srcImg.naturalWidth : 1;
    const tw = Math.max(1, Math.round(srcImg.naturalWidth * scale));
    const th = Math.max(1, Math.round(srcImg.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tw, th);
    ctx.drawImage(srcImg, 0, 0, tw, th);

    canvas.toBlob(
      (blob) => {
        if (!active || !blob) return;
        setCompSize(blob.size);
        setOutDims({w: tw, h: th});
        const reader = new FileReader();
        reader.onload = () => {
          if (active) setOutUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      quality / 100,
    );

    return () => {
      active = false;
    };
  }, [srcImg, quality, capWidth1080]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setOrigSize(f.size);
    try {
      const {img} = await loadIgImage(f);
      setSrcImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to decode image.');
    }
  };

  const savedPercent =
    origSize && compSize !== null
      ? Math.round(((origSize - compSize) / origSize) * 1000) / 10
      : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Choose Another Photo' : 'Upload Photo to Compress'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            aria-label="Upload Photo to Compress"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">JPEG Quality: {quality}%</span>
            <input
              type="range"
              min={40}
              max={95}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-pink-600 w-24"
            />
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={capWidth1080}
              onChange={(e) => setCapWidth1080(e.target.checked)}
              className="accent-pink-600 rounded"
            />
            <span>Max width 1080px (recommended)</span>
          </label>
        </div>
      </div>

      <IgInlineError message={error} />

      {outUrl && origSize !== null && compSize !== null ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Original Size</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{formatBytes(origSize)}</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-400">Compressed Size</span>
              <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{formatBytes(compSize)}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Size Change</span>
              <div className="text-lg font-bold text-pink-600 mt-0.5">
                {savedPercent !== null
                  ? savedPercent >= 0
                    ? `${savedPercent}% smaller`
                    : `${Math.abs(savedPercent)}% larger`
                  : '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {outDims ? `${outDims.w} × ${outDims.h} px · ` : ''}Unwatermarked sRGB JPEG
            </span>
            <a
              href={outUrl}
              download="compressed_instagram_photo.jpg"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Compressed JPG
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload a JPG, PNG, or WebP photo (up to 20 MB) to compress it cleanly in your browser.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Instagram Square Image Cropper (1080x1080 + focal shift / white-border pad)
// ============================================================================
export function InstagramSquareCropper() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'crop' | 'pad'>('crop');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'crop') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1080, 1080);
      drawCoverImage(ctx, srcImg, 1080, 1080, offsetX, offsetY);
    } else {
      drawFitImage(ctx, srcImg, 1080, 1080, '#ffffff');
    }
    setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [srcImg, mode, offsetX, offsetY]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadIgImage(f);
      setOffsetX(0);
      setOffsetY(0);
      setSrcImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Photo' : 'Upload Photo to Crop 1:1 Square'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            aria-label="Upload Photo to Crop 1:1 Square"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('crop')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'crop' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            1:1 Square Crop
          </button>
          <button
            type="button"
            onClick={() => setMode('pad')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'pad' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            White-Border Square Fit
          </button>
        </div>
      </div>

      {srcImg && mode === 'crop' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <label className="flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Horizontal Pan ({offsetX}%)</span>
            <input type="range" min={-100} max={100} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="accent-pink-600 w-32" />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Vertical Pan ({offsetY}%)</span>
            <input type="range" min={-100} max={100} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="accent-pink-600 w-32" />
          </label>
        </div>
      )}

      <IgInlineError message={error} />

      {outUrl ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="aspect-square max-w-xs mx-auto rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img src={outUrl} alt="1:1 Square crop preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">1080 × 1080 px (1:1 Square · Zero Watermark)</span>
            <a
              href={outUrl}
              download="square_crop_1080x1080.jpg"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Square JPG
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload any JPG, PNG, or WebP photo (up to 20 MB) to frame a 1080×1080 square post.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. Instagram Story Image Resizer (1080x1920 + Safe-Zone Guide + Fit/Crop)
// ============================================================================
export function InstagramStoryResizer() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'fit' | 'crop'>('fit');
  const [bgColor, setBgColor] = useState<string>('#0f172a');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'fit') {
      drawFitImage(ctx, srcImg, 1080, 1920, bgColor);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1080, 1920);
      drawCoverImage(ctx, srcImg, 1080, 1920);
    }
    setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [srcImg, mode, bgColor]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadIgImage(f);
      setSrcImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>{srcImg ? 'Change Story Image' : 'Upload Photo for 9:16 Story Frame'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            aria-label="Upload Photo for 9:16 Story Frame"
            onChange={handleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('fit')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'fit' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Fit With Backdrop
          </button>
          <button
            type="button"
            onClick={() => setMode('crop')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'crop' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Full-Bleed Crop
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={showSafeZones}
              onChange={(e) => setShowSafeZones(e.target.checked)}
              className="accent-pink-600 rounded"
            />
            <span>Safe-zone guides</span>
          </label>
        </div>
      </div>

      {mode === 'fit' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Backdrop Fill:</span>
          {[
            ['#0f172a', 'Midnight'],
            ['#000000', 'Black'],
            ['#ffffff', 'White'],
            ['#fdf2f8', 'Soft Rose'],
          ].map(([hex, label]) => (
            <button
              key={hex}
              type="button"
              onClick={() => setBgColor(hex)}
              className={`px-2.5 py-1 rounded border text-[11px] font-medium ${
                bgColor === hex
                  ? 'border-pink-600 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <IgInlineError message={error} />

      {outUrl ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="relative h-80 aspect-[9/16] mx-auto rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img src={outUrl} alt="Story 9:16 preview" className="w-full h-full object-cover" />
            {showSafeZones && (
              <>
                <div className="absolute inset-x-0 top-0 h-[13%] bg-rose-500/20 border-b border-dashed border-rose-300 pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">Top Story Header Zone</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[16%] bg-rose-500/20 border-t border-dashed border-rose-300 pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">Reply Bar Zone</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">1080 × 1920 px (9:16 Vertical · Clean Unwatermarked Export)</span>
            <a
              href={outUrl}
              download="story_1080x1920.jpg"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Story JPG
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload any JPG, PNG, or WebP photo (up to 20 MB) to size cleanly for 1080×1920 Instagram Stories.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. Instagram Reel Cover Maker (Aspect-preserving cover + Title overlay)
// ============================================================================
export function InstagramReelCoverMaker() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [coverTitle, setCoverTitle] = useState('');
  const [titleColor, setTitleColor] = useState<'light' | 'dark'>('light');
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!srcImg) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1080, 1920);
    drawCoverImage(ctx, srcImg, 1080, 1920);

    const trimmed = coverTitle.trim();
    if (trimmed) {
      ctx.save();
      ctx.font = 'bold 64px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const words = trimmed.split(/\s+/);
      const lines: string[] = [];
      let current = '';
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (ctx.measureText(candidate).width <= 840) {
          current = candidate;
        } else {
          if (current) lines.push(current);
          current = word;
        }
      }
      if (current) lines.push(current);

      const lineHeight = 82;
      const boxWidth = Math.min(920, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 96);
      const boxHeight = lines.length * lineHeight + 56;
      const bx = (1080 - boxWidth) / 2;
      const by = (1920 - boxHeight) / 2;

      ctx.fillStyle = titleColor === 'light' ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.88)';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxWidth, boxHeight, 28);
      ctx.fill();

      ctx.fillStyle = titleColor === 'light' ? '#ffffff' : '#0f172a';
      lines.forEach((line, idx) => {
        const y = 1920 / 2 + (idx - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, 540, y);
      });
      ctx.restore();
    }

    setOutUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [srcImg, coverTitle, titleColor]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img} = await loadIgImage(f);
      setSrcImg(img);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/60 text-xs text-pink-800 dark:text-pink-300">
        Preserves image proportions cleanly at 1080×1920 and previews the central 1:1 profile-grid safe area!
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Optional Cover Title Overlay (Centered in 1:1 Safe Zone)
          </label>
          <input
            type="text"
            value={coverTitle}
            placeholder="e.g., 3 Hooks That Doubled Reach"
            onChange={(e) => setCoverTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
            <ImageIcon className="h-4 w-4 shrink-0" />
            <span>{srcImg ? 'Change Cover Image' : 'Upload Reel Cover Graphic'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              aria-label="Upload Reel Cover Graphic"
              onChange={handleUpload}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          <button
            type="button"
            onClick={() => setTitleColor((c) => (c === 'light' ? 'dark' : 'light'))}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            Badge: {titleColor === 'light' ? 'Dark Pill' : 'Light Pill'}
          </button>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input type="checkbox" checked={showSafeZone} onChange={(e) => setShowSafeZone(e.target.checked)} className="accent-pink-600 rounded" />
            <span>Grid guide</span>
          </label>
        </div>
      </div>

      <IgInlineError message={error} />

      {outUrl ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="relative h-80 aspect-[9/16] mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img src={outUrl} alt="Reel Cover 1080x1920" className="w-full h-full object-cover" />
            {showSafeZone && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square border-2 border-dashed border-white/85 pointer-events-none flex items-end justify-center pb-2">
                <span className="bg-black/65 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  1:1 Profile Grid Safe Zone
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">1080 × 1920 px (9:16 Cover · Zero Watermark)</span>
            <a
              href={outUrl}
              download="reel_cover_1080x1920.jpg"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Cover JPG
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload a JPG, PNG, or WebP photo (up to 20 MB) to build a distortion-free 1080×1920 Reel cover.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. Instagram Grid Preview Maker (Up to 12 photos + Reordering + 1:1 vs 3:4)
// ============================================================================
export function InstagramGridPreviewMaker() {
  const [images, setImages] = useState<{id: string; url: string; name: string}[]>([]);
  const [aspectMode, setAspectMode] = useState<'1:1' | '3:4'>('1:1');
  const [handle, setHandle] = useState('your.feed.preview');
  const [error, setError] = useState<string | null>(null);

  const handleMultipleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = 12 - images.length;
    if (remaining <= 0) {
      setError('Grid board is full (maximum 12 images). Remove a tile before adding another.');
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) {
      const err = validateIgImageFile(f);
      if (err) {
        setError(err);
        return;
      }
    }

    Promise.all(picked.map((f) => loadIgImage(f).then((res) => ({id: `${Date.now()}-${Math.random()}`, url: res.dataUrl, name: f.name}))))
      .then((newTiles) => {
        setImages((prev) => [...prev, ...newTiles].slice(0, 12));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load selected images.');
      });
  };

  const moveTile = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
      return copy;
    });
  };

  const removeTile = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-xs text-slate-600 dark:text-slate-300">
        Local preview simulator only — never connects to your Instagram account. Reorder up to 12 photos using tile arrows.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>Upload Feed Photos (Up to 12)</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/*"
            aria-label="Upload Feed Photos up to 12"
            onChange={handleMultipleUpload}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setAspectMode('1:1')}
            className={`px-2.5 py-1 rounded font-medium ${aspectMode === '1:1' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            1:1 Square Grid
          </button>
          <button
            type="button"
            onClick={() => setAspectMode('3:4')}
            className={`px-2.5 py-1 rounded font-medium ${aspectMode === '3:4' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            3:4 Portrait Grid
          </button>
          <span className="text-slate-500 font-mono">{images.length} / 12 tiles</span>
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => setImages([])}
              className="text-rose-600 font-semibold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <IgInlineError message={error} />

      <div className="max-w-md mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
            IG
          </div>
          <div className="text-xs min-w-0 flex-1">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              aria-label="Grid preview username"
              className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none w-full"
            />
            <div className="text-slate-400 mt-0.5">{images.length} planned posts · {aspectMode} grid</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-3">
          {Array.from({length: 12}).map((_, i) => (
            <div
              key={images[i]?.id || `slot-${i}`}
              className={`relative group ${aspectMode === '1:1' ? 'aspect-square' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded overflow-hidden`}
            >
              {images[i] ? (
                <>
                  <img src={images[i].url} alt={`Grid tile ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-1 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveTile(i, -1)}
                      aria-label={`Move tile ${i + 1} left`}
                      className="p-0.5 text-white disabled:opacity-30 hover:text-pink-300"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTile(i)}
                      aria-label={`Remove tile ${i + 1}`}
                      className="p-0.5 text-rose-300 hover:text-rose-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={i === images.length - 1}
                      onClick={() => moveTile(i, 1)}
                      aria-label={`Move tile ${i + 1} right`}
                      className="p-0.5 text-white disabled:opacity-30 hover:text-pink-300"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-mono">
                  Slot {i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. Instagram Color Palette Extractor (Quantized HEX + RGB + Copy All + Card PNG)
// ============================================================================
export function InstagramColorExtractor({
  onCopy,
  copiedKey,
}: {
  onCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}) {
  const [colors, setColors] = useState<{hex: string; rgb: string; percent: number}[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img, dataUrl} = await loadIgImage(f);
      setPreviewUrl(dataUrl);
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 120, 120);
      const data = ctx.getImageData(0, 0, 120, 120).data;
      const palette = extractDominantPaletteFromPixels(data, 6);
      setColors(palette);

      if (palette.length > 0) {
        const card = document.createElement('canvas');
        card.width = 1080;
        card.height = 360;
        const cctx = card.getContext('2d');
        if (cctx) {
          cctx.fillStyle = '#ffffff';
          cctx.fillRect(0, 0, 1080, 360);
          const colW = 1080 / palette.length;
          palette.forEach((swatch, idx) => {
            cctx.fillStyle = swatch.hex;
            cctx.fillRect(idx * colW, 0, colW, 250);
            cctx.fillStyle = '#0f172a';
            cctx.font = 'bold 24px monospace';
            cctx.textAlign = 'center';
            cctx.fillText(swatch.hex, idx * colW + colW / 2, 295);
            cctx.fillStyle = '#64748b';
            cctx.font = '15px sans-serif';
            cctx.fillText(swatch.rgb, idx * colW + colW / 2, 326);
          });
          setCardUrl(card.toDataURL('image/png'));
        }
      }
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to extract palette.');
    }
  };

  const wholePaletteText = colors.map((c) => `${c.hex} (${c.rgb})`).join('\n');

  return (
    <div className="space-y-4">
      <label className="relative overflow-hidden block p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-pink-400 focus-within:ring-2 focus-within:ring-pink-500">
        <Palette className="h-8 w-8 text-pink-500 mx-auto mb-2" />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
          Upload photo to extract dominant brand colors
        </span>
        <p className="text-[11px] text-slate-400 mt-1">
          Runs pixel quantization locally in your browser (JPG, PNG, WebP up to 20 MB).
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          aria-label="Upload photo to extract brand color palette"
          onChange={handleUpload}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
        />
      </label>

      <IgInlineError message={error} />

      {colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Extracted Brand Palette ({colors.length} Dominant Swatches)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onCopy(wholePaletteText, 'copy-whole-palette')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
              >
                {copiedKey === 'copy-whole-palette' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Whole Palette
              </button>
              {cardUrl && (
                <a
                  href={cardUrl}
                  download="instagram_color_palette.png"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Swatch Card PNG
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
            {previewUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-square">
                <img src={previewUrl} alt="Source image" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {colors.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  <div className="h-16 w-full" style={{backgroundColor: c.hex}} />
                  <div className="p-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{c.hex}</span>
                      <button
                        type="button"
                        onClick={() => onCopy(c.hex, `c-hex-${i}`)}
                        aria-label={`Copy ${c.hex}`}
                        className="text-pink-600 font-semibold text-[11px]"
                      >
                        {copiedKey === `c-hex-${i}` ? 'Copied' : 'HEX'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono truncate mr-1">{c.rgb}</span>
                      <button
                        type="button"
                        onClick={() => onCopy(c.rgb, `c-rgb-${i}`)}
                        aria-label={`Copy ${c.rgb}`}
                        className="text-slate-400 hover:text-pink-600 shrink-0"
                      >
                        {copiedKey === `c-rgb-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
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
// 8. Instagram Screenshot Mockup Generator (Editable + Dark/Light + PNG Export)
// ============================================================================
export function InstagramMockupGenerator() {
  const [srcImg, setSrcImg] = useState<HTMLImageElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [handle, setHandle] = useState('creative.studio');
  const [likes, setLikes] = useState('1,420');
  const [caption, setCaption] = useState('Clean typography & interactive workflow systems for modern creators ✨');
  const [darkCard, setDarkCard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateIgImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const {img, dataUrl} = await loadIgImage(f);
      setSrcImg(img);
      setImgUrl(dataUrl);
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to read image.');
    }
  };

  const downloadMockupPng = () => {
    if (!srcImg) {
      setError('Please upload a post graphic first before downloading the mockup PNG.');
      return;
    }
    setError(null);

    const w = 1080;
    const headerH = 128;
    const mediaH = 1080;
    const footerH = 290;
    const h = headerH + mediaH + footerH;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = darkCard ? '#0f172a' : '#ffffff';
    const fg = darkCard ? '#f8fafc' : '#0f172a';
    const muted = darkCard ? '#94a3b8' : '#475569';
    const border = darkCard ? '#1e293b' : '#e2e8f0';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Header
    const grad = ctx.createLinearGradient(36, 30, 100, 94);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(1, '#ec4899');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(72, 64, 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = darkCard ? '#1e293b' : '#f1f5f9';
    ctx.beginPath();
    ctx.arc(72, 64, 28, 0, Math.PI * 2);
    ctx.fill();

    const cleanHandle = handle.trim().replace(/^@/, '') || 'creative.studio';
    ctx.fillStyle = fg;
    ctx.font = 'bold 30px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(`@${cleanHandle}`, 124, 64);

    ctx.fillStyle = muted;
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('•••', w - 40, 64);
    ctx.textAlign = 'left';

    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(w, headerH);
    ctx.stroke();

    // Media area (square cover)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, headerH, w, mediaH);
    ctx.clip();
    const tr = w / mediaH;
    const ir = srcImg.naturalWidth / srcImg.naturalHeight;
    let dw = w;
    let dh = mediaH;
    let dx = 0;
    let dy = headerH;
    if (ir > tr) {
      dw = mediaH * ir;
      dx = (w - dw) / 2;
    } else {
      dh = w / ir;
      dy = headerH + (mediaH - dh) / 2;
    }
    ctx.drawImage(srcImg, dx, dy, dw, dh);
    ctx.restore();

    // Footer bar
    const fy = headerH + mediaH;
    ctx.fillStyle = fg;
    ctx.font = 'bold 30px Inter, system-ui, sans-serif';
    ctx.fillText(`${likes.trim() || '0'} likes`, 40, fy + 64);

    // Caption wrap
    ctx.font = '28px Inter, system-ui, sans-serif';
    const fullCap = `@${cleanHandle}  ${caption.trim()}`;
    const words = fullCap.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const word of words) {
      const next = cur ? `${cur} ${word}` : word;
      if (ctx.measureText(next).width <= w - 80) {
        cur = next;
      } else {
        if (cur) lines.push(cur);
        cur = word;
      }
    }
    if (cur) lines.push(cur);

    ctx.fillStyle = muted;
    lines.slice(0, 4).forEach((line, idx) => {
      ctx.fillText(line, 40, fy + 124 + idx * 40);
    });

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_mockup_${cleanHandle}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Account Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Likes Display
          </label>
          <input
            type="text"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Mockup Caption
        </label>
        <textarea
          rows={2}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative overflow-hidden inline-flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-700 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2">
            <ImageIcon className="h-4 w-4 shrink-0" />
            <span>{imgUrl ? 'Change Post Image' : 'Upload Post Graphic'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              aria-label="Upload Post Screenshot or Graphic"
              onChange={handleUpload}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>

          <button
            type="button"
            onClick={() => setDarkCard((d) => !d)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            Frame: {darkCard ? 'Dark Card' : 'Light Card'}
          </button>
        </div>

        <button
          type="button"
          onClick={downloadMockupPng}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          <Download className="h-3.5 w-3.5" />
          Download Mockup PNG
        </button>
      </div>

      <IgInlineError message={error} />

      <div
        className={`max-w-sm mx-auto rounded-3xl border-4 border-slate-900 overflow-hidden shadow-xl ${
          darkCard ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}
      >
        <div
          className={`p-3 flex items-center justify-between border-b text-xs ${
            darkCard ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shrink-0">
              <div className={`w-full h-full rounded-full ${darkCard ? 'bg-slate-900' : 'bg-white'}`} />
            </div>
            <span className="font-bold truncate">@{handle.trim().replace(/^@/, '') || 'creative.studio'}</span>
          </div>
          <span className="text-slate-400 font-bold">•••</span>
        </div>

        <div className={`aspect-square flex items-center justify-center overflow-hidden ${darkCard ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {imgUrl ? (
            <img src={imgUrl} alt="Instagram post mockup" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400 px-4 text-center">Upload a post image above to preview mockup</span>
          )}
        </div>

        <div className="p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5" />
              <MessageCircle className="h-5 w-5" />
              <Share2 className="h-5 w-5" />
            </div>
            <Bookmark className="h-5 w-5" />
          </div>
          <div className="font-bold">{likes.trim() || '0'} likes</div>
          <p className={`break-words ${darkCard ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className="font-bold mr-1.5">@{handle.trim().replace(/^@/, '') || 'creative.studio'}</span>
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
