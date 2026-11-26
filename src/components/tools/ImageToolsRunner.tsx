import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertCircle,
  BarChart3,
  Check,
  Crop as CropIcon,
  Download,
  FlaskConical,
  Image as ImageIcon,
  Loader2,
  PieChart,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {applyToolPlatformWatermark} from '../../lib/watermark';

interface Props {
  tool: Tool;
}

interface LoadedImageItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
}

interface ProcessedImageOutput {
  id: string;
  sourceName: string;
  outputName: string;
  mime: string;
  inputBytes: number;
  outputBytes: number;
  width: number;
  height: number;
  url: string;
  watermarked: boolean;
}

interface ChartRow {
  id: string;
  label: string;
  value: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image file.'));
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Browser could not encode ${mime}.`));
          return;
        }
        resolve(blob);
      },
      mime,
      quality,
    );
  });
}

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/webp') return 'webp';
  return 'png';
}

function mimeFromFile(file: File): 'image/jpeg' | 'image/png' | 'image/webp' {
  const lower = (file.type || file.name).toLowerCase();
  if (lower.includes('jpeg') || lower.includes('jpg')) return 'image/jpeg';
  if (lower.includes('webp')) return 'image/webp';
  return 'image/png';
}

function stripExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(0, idx) : name;
}

async function generateRichSampleImageFile(
  slug: string,
  fileName = 'sample-image.png',
): Promise<File> {
  const canvas = document.createElement('canvas');
  const isPortrait = slug === 'profile-photo';
  canvas.width = isPortrait ? 640 : slug === 'compress-image' ? 1200 : 960;
  canvas.height = isPortrait ? 640 : slug === 'compress-image' ? 800 : 640;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  if (isPortrait) {
    // Rich portrait-framed avatar illustration
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#DBEAFE');
    bgGrad.addColorStop(1, '#BFDBFE');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle soft glow circles
    ctx.fillStyle = 'rgba(10, 140, 255, 0.14)';
    ctx.beginPath();
    ctx.arc(140, 140, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(520, 500, 150, 0, Math.PI * 2);
    ctx.fill();

    // Stylized shoulders & head silhouette
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.ellipse(320, 580, 190, 140, 0, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#FDBA74';
    ctx.beginPath();
    ctx.arc(320, 275, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(320, 240, 114, Math.PI * 0.92, Math.PI * 2.08);
    ctx.fill();

    // Eyes & smile
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(282, 280, 9, 0, Math.PI * 2);
    ctx.arc(358, 280, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(320, 305, 34, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sample Portrait', 320, 595);
  } else {
    // Rich scenic + geometric graphic (great for compression, resize, crop, convert)
    const sky = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    sky.addColorStop(0, '#0EA5E9');
    sky.addColorStop(0.55, '#38BDF8');
    sky.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun + soft halo
    const sunX = canvas.width * 0.78;
    const sunY = canvas.height * 0.24;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 130);
    sunGrad.addColorStop(0, '#FEF08A');
    sunGrad.addColorStop(0.45, '#FDE047');
    sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
    ctx.fill();

    // Layered mountains
    ctx.fillStyle = '#0369A1';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.72);
    ctx.lineTo(canvas.width * 0.24, canvas.height * 0.42);
    ctx.lineTo(canvas.width * 0.48, canvas.height * 0.65);
    ctx.lineTo(canvas.width * 0.72, canvas.height * 0.38);
    ctx.lineTo(canvas.width, canvas.height * 0.68);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#075985';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.35, canvas.height * 0.54);
    ctx.lineTo(canvas.width * 0.64, canvas.height * 0.78);
    ctx.lineTo(canvas.width * 0.88, canvas.height * 0.56);
    ctx.lineTo(canvas.width, canvas.height * 0.74);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Subtle texture dots so PNG file size is meaningful for compression testing
    if (slug === 'compress-image') {
      for (let i = 0; i < 450; i++) {
        const px = (i * 73) % canvas.width;
        const py = (i * 139) % canvas.height;
        ctx.fillStyle =
          i % 2 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.08)';
        ctx.fillRect(px, py, 6, 6);
      }
    }

    // Crisp card overlay
    const cardW = Math.min(540, canvas.width * 0.65);
    const cardH = 160;
    const cardX = 48;
    const cardY = 48;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#0A8CFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('ToolPlatform Sample Graphic', cardX + 26, cardY + 58);
    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText(
      `${canvas.width} × ${canvas.height} px · Generated in browser`,
      cardX + 26,
      cardY + 98,
    );
    ctx.fillStyle = '#0A8CFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Ideal for testing Compress, Resize, Convert & Crop', cardX + 26, cardY + 132);
  }

  const blob = await canvasToBlob(canvas, 'image/png');
  return new File([blob], fileName, {type: 'image/png'});
}

export function ImageToolsRunner({tool}: Props) {
  const slug = tool.slug;

  if (slug === 'chart-maker') {
    return <ChartMakerRunner key={slug} tool={tool} />;
  }
  if (slug === 'profile-photo') {
    return <ProfilePhotoRunner key={slug} tool={tool} />;
  }
  if (slug === 'crop-image') {
    return <CropImageRunner key={slug} tool={tool} />;
  }
  if (slug === 'resize-image') {
    return <ResizeImageRunner key={slug} tool={tool} />;
  }
  if (slug === 'convert-image') {
    return <ConvertImageRunner key={slug} tool={tool} />;
  }
  return <CompressImageRunner key={slug} tool={tool} />;
}

// =========================================================================
// Shared File Loader & Output URL Helpers
// =========================================================================
function useImageOutputs() {
  const [outputs, setOutputsState] = useState<ProcessedImageOutput[]>([]);
  const outputsRef = useRef<ProcessedImageOutput[]>([]);

  const setOutputs = useCallback((next: ProcessedImageOutput[]) => {
    outputsRef.current.forEach((o) => URL.revokeObjectURL(o.url));
    outputsRef.current = next;
    setOutputsState(next);
  }, []);

  const clearOutputs = useCallback(() => {
    outputsRef.current.forEach((o) => URL.revokeObjectURL(o.url));
    outputsRef.current = [];
    setOutputsState([]);
  }, []);

  useEffect(() => {
    return () => {
      outputsRef.current.forEach((o) => URL.revokeObjectURL(o.url));
      outputsRef.current = [];
    };
  }, []);

  return {outputs, setOutputs, clearOutputs};
}

function useImageFiles(tool: Tool) {
  const maxMB = tool.maxFileSizeMB ?? 30;
  const maxFiles = tool.maxFiles ?? 1;
  const isMultiple = maxFiles > 1;

  const [items, setItems] = useState<LoadedImageItem[]>([]);
  const itemsRef = useRef<LoadedImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(
    async (fileList: File[]) => {
      setError(null);
      if (fileList.length === 0) return;

      let chosen = fileList;
      if (chosen.length > maxFiles) {
        setError(
          `Maximum ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'} allowed; extra files were ignored.`,
        );
        chosen = chosen.slice(0, maxFiles);
      }

      const nextItems: LoadedImageItem[] = [];
      for (const file of chosen) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" is not a supported image file.`);
          continue;
        }
        if (file.size > maxMB * 1024 * 1024) {
          setError(`"${file.name}" exceeds the ${maxMB} MB per-file limit.`);
          continue;
        }
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          nextItems.push({
            id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
            file,
            url,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        } catch {
          URL.revokeObjectURL(url);
          setError(`Could not decode "${file.name}". Your browser may not support this format.`);
        }
      }

      itemsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
      itemsRef.current = nextItems;
      setItems(nextItems);
    },
    [maxFiles, maxMB],
  );

  const clearFiles = useCallback(() => {
    itemsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    itemsRef.current = [];
    setItems([]);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
      itemsRef.current = [];
    };
  }, []);

  return {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles};
}

function ImageUploadPanel({
  tool,
  items,
  isMultiple,
  maxMB,
  maxFiles,
  onFileInput,
  onTrySample,
  onClear,
}: {
  tool: Tool;
  items: LoadedImageItem[];
  isMultiple: boolean;
  maxMB: number;
  maxFiles: number;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTrySample: () => void;
  onClear: () => void;
}) {
  const acceptStr = tool.acceptedFormats.includes('AVIF')
    ? 'image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif'
    : 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

  return (
    <div className="space-y-3">
      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 p-6 sm:p-8 text-center hover:border-[#0A8CFF] hover:bg-sky-50/40 dark:hover:bg-sky-900/10 transition-colors">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40 text-[#0A8CFF] group-hover:scale-105 transition-transform">
          <Upload className="h-6 w-6" />
        </div>
        <span className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {isMultiple ? `Click to select up to ${maxFiles} images` : 'Click to select an image'}
        </span>
        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Formats: {tool.acceptedFormats.join(', ')} · Max {maxMB} MB per file · Up to {maxFiles}{' '}
          {maxFiles === 1 ? 'file' : 'files'}
        </span>
        <input
          type="file"
          multiple={isMultiple}
          accept={acceptStr}
          onChange={onFileInput}
          className="hidden"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onTrySample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap"
        >
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Try sample image</span>
        </button>

        {items.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-mono tabular-nums">
              {items.length} selected · {items[0].width}×{items[0].height} px ·{' '}
              {formatBytes(items[0].file.size)}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 1. COMPRESS IMAGE (WITH TOOLPLATFORM WATERMARK)
// =========================================================================
function CompressImageRunner({tool}: {tool: Tool}) {
  const {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles} =
    useImageFiles(tool);
  const [mode, setMode] = useState<'quality' | 'targetSize'>('quality');
  const [quality, setQuality] = useState<number>(72);
  const [targetKB, setTargetKB] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'auto' | 'same' | 'jpeg' | 'webp' | 'png'>(
    'auto',
  );
  const [processing, setProcessing] = useState(false);
  const {outputs, setOutputs, clearOutputs} = useImageOutputs();

  const handleCompress = async () => {
    if (items.length === 0) {
      setError('Please upload an image or click "Try sample image" above.');
      return;
    }
    setProcessing(true);
    setError(null);
    clearOutputs();

    try {
      const nextOutputs: ProcessedImageOutput[] = [];
      for (const item of items) {
        const img = await loadImageElement(item.url);
        const origMime = mimeFromFile(item.file);
        let targetMime: string;
        if (outputFormat === 'jpeg') targetMime = 'image/jpeg';
        else if (outputFormat === 'webp') targetMime = 'image/webp';
        else if (outputFormat === 'png') targetMime = 'image/png';
        else if (outputFormat === 'same') targetMime = origMime;
        else {
          // Auto: WebP compresses both photos & PNGs with transparency much smaller
          targetMime = origMime === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
        }

        const renderCandidate = async (
          scale: number,
          q: number,
          quantizePng: boolean,
        ): Promise<{blob: Blob; w: number; h: number}> => {
          const w = Math.max(1, Math.round(item.width * scale));
          const h = Math.max(1, Math.round(item.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context unavailable.');

          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          if (quantizePng && targetMime === 'image/png') {
            // Color depth quantization so lossless PNG deflate compresses smaller
            const step = Math.max(4, Math.round((1 - q) * 48));
            const imgData = ctx.getImageData(0, 0, w, h);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              d[i] = Math.round(d[i] / step) * step;
              d[i + 1] = Math.round(d[i + 1] / step) * step;
              d[i + 2] = Math.round(d[i + 2] / step) * step;
            }
            ctx.putImageData(imgData, 0, 0);
          }

          applyToolPlatformWatermark(ctx, w, h, tool.slug);
          const blob = await canvasToBlob(canvas, targetMime, q);
          return {blob, w, h};
        };

        let result: {blob: Blob; w: number; h: number};
        if (mode === 'quality') {
          const q = Math.max(0.1, Math.min(0.95, quality / 100));
          result = await renderCandidate(1, q, targetMime === 'image/png');
        } else {
          const maxBytes = Math.max(5, targetKB) * 1024;
          let low = 0.12;
          let high = 0.92;
          let best = await renderCandidate(1, 0.72, targetMime === 'image/png');

          if (targetMime !== 'image/png') {
            for (let step = 0; step < 6; step++) {
              const mid = (low + high) / 2;
              const cand = await renderCandidate(1, mid, false);
              if (cand.blob.size <= maxBytes) {
                best = cand;
                low = mid;
              } else {
                high = mid;
                if (cand.blob.size < best.blob.size) best = cand;
              }
            }
          }

          // If still above target size, gently downscale until under target or floor
          let scale = 0.85;
          while (best.blob.size > maxBytes && scale >= 0.35) {
            best = await renderCandidate(scale, 0.55, targetMime === 'image/png');
            scale -= 0.15;
          }
          result = best;
        }

        const ext = extFromMime(targetMime);
        const outUrl = URL.createObjectURL(result.blob);
        nextOutputs.push({
          id: item.id,
          sourceName: item.file.name,
          outputName: `${stripExtension(item.file.name)}-compressed.${ext}`,
          mime: targetMime,
          inputBytes: item.file.size,
          outputBytes: result.blob.size,
          width: result.w,
          height: result.h,
          url: outUrl,
          watermarked: true,
        });
      }
      setOutputs(nextOutputs);
    } catch (err: any) {
      setError(err?.message || 'Compression failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Compress JPG, PNG, and WebP images directly in your browser.
        </p>
      </div>

      <ImageUploadPanel
        tool={tool}
        items={items}
        isMultiple={isMultiple}
        maxMB={maxMB}
        maxFiles={maxFiles}
        onFileInput={(e) => {
          clearOutputs();
          if (e.target.files) void loadFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        onTrySample={async () => {
          clearOutputs();
          const f = await generateRichSampleImageFile(tool.slug, 'sample-photo.png');
          await loadFiles([f]);
        }}
        onClear={() => {
          clearOutputs();
          clearFiles();
        }}
      />

      {/* Controls */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Compression Mode
          </span>
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setMode('quality')}
              className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'quality'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Quality %
            </button>
            <button
              type="button"
              onClick={() => setMode('targetSize')}
              className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'targetSize'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Target KB
            </button>
          </div>
        </div>

        <div>
          {mode === 'quality' ? (
            <>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quality: <span className="font-mono tabular-nums">{quality}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#0A8CFF]"
              />
            </>
          ) : (
            <>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Size (KB)
              </label>
              <input
                type="number"
                min={10}
                max={10000}
                value={targetKB}
                onChange={(e) => setTargetKB(Math.max(10, Number(e.target.value) || 10))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono tabular-nums"
              />
            </>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as any)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
          >
            <option value="auto">Auto (Smallest: WebP / JPG)</option>
            <option value="jpeg">JPG (.jpg)</option>
            <option value="webp">WebP (.webp)</option>
            <option value="same">Keep original format</option>
            <option value="png">PNG (.png)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleCompress}
          disabled={processing || items.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
          <span>{processing ? 'Compressing...' : 'Compress Image'}</span>
        </button>
      </div>

      {outputs.length > 0 && <ProcessedOutputsList outputs={outputs} showSavings />}
    </section>
  );
}

// =========================================================================
// 2. RESIZE IMAGE (WITH TOOLPLATFORM WATERMARK)
// =========================================================================
function ResizeImageRunner({tool}: {tool: Tool}) {
  const {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles} =
    useImageFiles(tool);
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percent'>('pixels');
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [percent, setPercent] = useState<number>(50);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'same' | 'png' | 'jpeg' | 'webp'>('same');
  const [processing, setProcessing] = useState(false);
  const {outputs, setOutputs, clearOutputs} = useImageOutputs();

  useEffect(() => {
    if (items.length > 0) {
      setTargetWidth(Math.max(1, Math.round(items[0].width / 2)));
      setTargetHeight(Math.max(1, Math.round(items[0].height / 2)));
    }
  }, [items]);

  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.min(8000, val || 1));
    setTargetWidth(w);
    if (lockAspect && items.length > 0 && items[0].width > 0) {
      const ratio = items[0].height / items[0].width;
      setTargetHeight(Math.max(1, Math.round(w * ratio)));
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.min(8000, val || 1));
    setTargetHeight(h);
    if (lockAspect && items.length > 0 && items[0].height > 0) {
      const ratio = items[0].width / items[0].height;
      setTargetWidth(Math.max(1, Math.round(h * ratio)));
    }
  };

  const handleResize = async () => {
    if (items.length === 0) {
      setError('Please upload an image or click "Try sample image" above.');
      return;
    }
    setProcessing(true);
    setError(null);
    clearOutputs();

    try {
      const nextOutputs: ProcessedImageOutput[] = [];
      for (const item of items) {
        const img = await loadImageElement(item.url);
        const w =
          resizeMode === 'percent'
            ? Math.max(1, Math.round((item.width * percent) / 100))
            : Math.max(1, targetWidth);
        const h =
          resizeMode === 'percent'
            ? Math.max(1, Math.round((item.height * percent) / 100))
            : lockAspect && items.length > 1
              ? Math.max(1, Math.round(w * (item.height / item.width)))
              : Math.max(1, targetHeight);

        const targetMime =
          outputFormat === 'same'
            ? mimeFromFile(item.file)
            : outputFormat === 'jpeg'
              ? 'image/jpeg'
              : outputFormat === 'webp'
                ? 'image/webp'
                : 'image/png';

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable.');

        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        applyToolPlatformWatermark(ctx, w, h, tool.slug);

        const blob = await canvasToBlob(canvas, targetMime, 0.92);
        const ext = extFromMime(targetMime);
        nextOutputs.push({
          id: item.id,
          sourceName: item.file.name,
          outputName: `${stripExtension(item.file.name)}-${w}x${h}.${ext}`,
          mime: targetMime,
          inputBytes: item.file.size,
          outputBytes: blob.size,
          width: w,
          height: h,
          url: URL.createObjectURL(blob),
          watermarked: true,
        });
      }
      setOutputs(nextOutputs);
    } catch (err: any) {
      setError(err?.message || 'Resize failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Scale images to exact pixel width & height or percentage with optional aspect-ratio lock.
        </p>
      </div>

      <ImageUploadPanel
        tool={tool}
        items={items}
        isMultiple={isMultiple}
        maxMB={maxMB}
        maxFiles={maxFiles}
        onFileInput={(e) => {
          clearOutputs();
          if (e.target.files) void loadFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        onTrySample={async () => {
          clearOutputs();
          const f = await generateRichSampleImageFile(tool.slug, 'sample-resize.png');
          await loadFiles([f]);
        }}
        onClear={() => {
          clearOutputs();
          clearFiles();
        }}
      />

      <div className="mt-5 space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setResizeMode('pixels')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                resizeMode === 'pixels'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Exact Width × Height
            </button>
            <button
              type="button"
              onClick={() => setResizeMode('percent')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                resizeMode === 'percent'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Percentage %
            </button>
          </div>

          <div className="flex items-center gap-3">
            {resizeMode === 'pixels' && (
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="rounded border-slate-300 accent-[#0A8CFF]"
                />
                <span>Keep aspect ratio</span>
              </label>
            )}
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as any)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="same">Same format</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>

        {resizeMode === 'pixels' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min={1}
                max={8000}
                value={targetWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min={1}
                max={8000}
                value={targetHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Scale: <span className="font-mono tabular-nums">{percent}%</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={200}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="flex-1 accent-[#0A8CFF]"
              />
              {[25, 50, 75, 150].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercent(p)}
                  className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-mono hover:border-[#0A8CFF]"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleResize}
          disabled={processing || items.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
          <span>{processing ? 'Resizing...' : 'Resize Image'}</span>
        </button>
      </div>

      {outputs.length > 0 && <ProcessedOutputsList outputs={outputs} />}
    </section>
  );
}

// =========================================================================
// 3. CONVERT IMAGE (WITH TOOLPLATFORM WATERMARK)
// =========================================================================
function ConvertImageRunner({tool}: {tool: Tool}) {
  const {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles} =
    useImageFiles(tool);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(
    'image/jpeg',
  );
  const [quality, setQuality] = useState<number>(90);
  const [bgFill, setBgFill] = useState<string>('#FFFFFF');
  const [processing, setProcessing] = useState(false);
  const {outputs, setOutputs, clearOutputs} = useImageOutputs();

  const handleConvert = async () => {
    if (items.length === 0) {
      setError('Please upload an image or click "Try sample image" above.');
      return;
    }
    setProcessing(true);
    setError(null);
    clearOutputs();

    try {
      const nextOutputs: ProcessedImageOutput[] = [];
      for (const item of items) {
        const img = await loadImageElement(item.url);
        const canvas = document.createElement('canvas');
        canvas.width = item.width;
        canvas.height = item.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable.');

        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = bgFill || '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        applyToolPlatformWatermark(ctx, canvas.width, canvas.height, tool.slug);

        const q = targetFormat === 'image/png' ? undefined : quality / 100;
        const blob = await canvasToBlob(canvas, targetFormat, q);
        const ext = extFromMime(targetFormat);

        nextOutputs.push({
          id: item.id,
          sourceName: item.file.name,
          outputName: `${stripExtension(item.file.name)}.${ext}`,
          mime: targetFormat,
          inputBytes: item.file.size,
          outputBytes: blob.size,
          width: item.width,
          height: item.height,
          url: URL.createObjectURL(blob),
          watermarked: true,
        });
      }
      setOutputs(nextOutputs);
    } catch (err: any) {
      setError(err?.message || 'Conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Convert images cleanly between PNG, JPG, and WebP formats in your browser.
        </p>
      </div>

      <ImageUploadPanel
        tool={tool}
        items={items}
        isMultiple={isMultiple}
        maxMB={maxMB}
        maxFiles={maxFiles}
        onFileInput={(e) => {
          clearOutputs();
          if (e.target.files) void loadFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        onTrySample={async () => {
          clearOutputs();
          const f = await generateRichSampleImageFile(tool.slug, 'sample-graphic.png');
          await loadFiles([f]);
        }}
        onClear={() => {
          clearOutputs();
          clearFiles();
        }}
      />

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Target Output Format
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              {mime: 'image/jpeg' as const, label: 'JPG'},
              {mime: 'image/png' as const, label: 'PNG'},
              {mime: 'image/webp' as const, label: 'WebP'},
            ].map((fmt) => (
              <button
                key={fmt.mime}
                type="button"
                onClick={() => setTargetFormat(fmt.mime)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  targetFormat === fmt.mime
                    ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF]'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {targetFormat === 'image/png'
              ? 'Lossless PNG Output'
              : `Quality: ${quality}%`}
          </label>
          {targetFormat === 'image/png' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Preserves full alpha transparency cleanly.
            </p>
          ) : (
            <input
              type="range"
              min={15}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[#0A8CFF]"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Background Fill (for JPG)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgFill}
              onChange={(e) => setBgFill(e.target.value)}
              disabled={targetFormat !== 'image/jpeg'}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5 disabled:opacity-40"
            />
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
              {targetFormat === 'image/jpeg' ? bgFill.toUpperCase() : 'Alpha kept'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          disabled={processing || items.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>{processing ? 'Converting...' : `Convert to ${extFromMime(targetFormat).toUpperCase()}`}</span>
        </button>
      </div>

      {outputs.length > 0 && <ProcessedOutputsList outputs={outputs} />}
    </section>
  );
}

// =========================================================================
// 4. CROP IMAGE (WITH TOOLPLATFORM WATERMARK)
// =========================================================================
function CropImageRunner({tool}: {tool: Tool}) {
  const {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles} =
    useImageFiles(tool);
  const current = items[0] ?? null;

  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '4:3' | '16:9' | '3:4'>('free');
  const [crop, setCrop] = useState({x: 0, y: 0, width: 400, height: 300});
  const [draftInputs, setDraftInputs] = useState({
    x: '0',
    y: '0',
    width: '400',
    height: '300',
  });
  const [processing, setProcessing] = useState(false);
  const {outputs, setOutputs, clearOutputs} = useImageOutputs();

  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    mode: 'move' | 'draw' | 'se';
    startClientX: number;
    startClientY: number;
    origCrop: {x: number; y: number; width: number; height: number};
    anchorX: number;
    anchorY: number;
  } | null>(null);

  const syncCropAndDrafts = useCallback(
    (next: {x: number; y: number; width: number; height: number}) => {
      setCrop(next);
      setDraftInputs({
        x: String(next.x),
        y: String(next.y),
        width: String(next.width),
        height: String(next.height),
      });
    },
    [],
  );

  useEffect(() => {
    if (current) {
      const marginX = Math.round(current.width * 0.1);
      const marginY = Math.round(current.height * 0.1);
      syncCropAndDrafts({
        x: marginX,
        y: marginY,
        width: Math.max(1, current.width - marginX * 2),
        height: Math.max(1, current.height - marginY * 2),
      });
    }
  }, [current, syncCropAndDrafts]);

  const clampCrop = useCallback(
    (
      next: {x: number; y: number; width: number; height: number},
      priorityField?: 'x' | 'y' | 'width' | 'height',
    ) => {
      if (!current) return next;
      const imgW = current.width;
      const imgH = current.height;

      let x = Math.max(0, Math.round(next.x));
      let y = Math.max(0, Math.round(next.y));
      let width = Math.max(1, Math.min(imgW, Math.round(next.width)));
      let height = Math.max(1, Math.min(imgH, Math.round(next.height)));

      if (priorityField === 'x') {
        x = Math.min(x, Math.max(0, imgW - 1));
        if (x + width > imgW) {
          width = Math.max(1, imgW - x);
        }
      } else {
        x = Math.min(x, Math.max(0, imgW - width));
      }

      if (priorityField === 'y') {
        y = Math.min(y, Math.max(0, imgH - 1));
        if (y + height > imgH) {
          height = Math.max(1, imgH - y);
        }
      } else {
        y = Math.min(y, Math.max(0, imgH - height));
      }

      return {x, y, width, height};
    },
    [current],
  );

  const applyAspectPreset = (preset: 'free' | '1:1' | '4:3' | '16:9' | '3:4') => {
    setAspectPreset(preset);
    if (!current || preset === 'free') return;
    const [aw, ah] = preset.split(':').map(Number);
    const ratio = aw / ah;
    let w = Math.min(current.width * 0.8, current.height * 0.8 * ratio);
    let h = w / ratio;
    if (h > current.height) {
      h = current.height * 0.8;
      w = h * ratio;
    }
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    syncCropAndDrafts({
      x: Math.round((current.width - w) / 2),
      y: Math.round((current.height - h) / 2),
      width: w,
      height: h,
    });
  };

  const handleNumericChange = (field: 'x' | 'y' | 'width' | 'height', raw: string) => {
    const nextDrafts = {...draftInputs, [field]: raw};
    setDraftInputs(nextDrafts);

    const trimmed = raw.trim();
    if (trimmed === '') return;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return;

    setCrop((prev) => clampCrop({...prev, [field]: parsed}, field));
  };

  const commitDraftField = (field: 'x' | 'y' | 'width' | 'height') => {
    const parsed = Number(draftInputs[field].trim());
    const nextValue =
      draftInputs[field].trim() !== '' && Number.isFinite(parsed) ? parsed : crop[field];
    const safe = clampCrop({...crop, [field]: nextValue}, field);
    syncCropAndDrafts(safe);
  };

  const getPointerImageCoords = (e: React.PointerEvent) => {
    const el = previewRef.current;
    if (!el || !current) return {ix: 0, iy: 0};
    const rect = el.getBoundingClientRect();
    const rx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ry = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return {
      ix: Math.round(rx * current.width),
      iy: Math.round(ry * current.height),
    };
  };

  const handleCropPointerDown = (
    e: React.PointerEvent,
    mode: 'move' | 'draw' | 'se',
  ) => {
    if (!current) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const {ix, iy} = getPointerImageCoords(e);
    dragStateRef.current = {
      mode,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origCrop: {...crop},
      anchorX: ix,
      anchorY: iy,
    };
  };

  const handleCropPointerMove = (e: React.PointerEvent) => {
    const st = dragStateRef.current;
    const el = previewRef.current;
    if (!st || !el || !current) return;
    const rect = el.getBoundingClientRect();
    const scaleX = current.width / rect.width;
    const scaleY = current.height / rect.height;
    const dx = Math.round((e.clientX - st.startClientX) * scaleX);
    const dy = Math.round((e.clientY - st.startClientY) * scaleY);

    if (st.mode === 'move') {
      syncCropAndDrafts(
        clampCrop({
          x: st.origCrop.x + dx,
          y: st.origCrop.y + dy,
          width: st.origCrop.width,
          height: st.origCrop.height,
        }),
      );
    } else if (st.mode === 'se') {
      let nextW = Math.max(20, Math.min(current.width - st.origCrop.x, st.origCrop.width + dx));
      let nextH = Math.max(20, Math.min(current.height - st.origCrop.y, st.origCrop.height + dy));
      if (aspectPreset !== 'free') {
        const [aw, ah] = aspectPreset.split(':').map(Number);
        const ratio = aw / ah;
        nextH = Math.round(nextW / ratio);
        if (st.origCrop.y + nextH > current.height) {
          nextH = current.height - st.origCrop.y;
          nextW = Math.round(nextH * ratio);
        }
      }
      syncCropAndDrafts(clampCrop({...st.origCrop, width: nextW, height: nextH}));
    } else {
      const {ix, iy} = getPointerImageCoords(e);
      const x = Math.min(st.anchorX, ix);
      const y = Math.min(st.anchorY, iy);
      const width = Math.max(20, Math.abs(ix - st.anchorX));
      let height = Math.max(20, Math.abs(iy - st.anchorY));
      if (aspectPreset !== 'free') {
        const [aw, ah] = aspectPreset.split(':').map(Number);
        height = Math.max(20, Math.round(width / (aw / ah)));
      }
      syncCropAndDrafts(clampCrop({x, y, width, height}));
    }
  };

  const handleCropPointerUp = () => {
    dragStateRef.current = null;
  };

  const handleCrop = async () => {
    if (!current) {
      setError('Please upload an image or click "Try sample image" above.');
      return;
    }
    setProcessing(true);
    setError(null);
    clearOutputs();

    try {
      const parseOrFallback = (raw: string, fallback: number) => {
        const t = raw.trim();
        if (t === '') return fallback;
        const n = Number(t);
        return Number.isFinite(n) ? n : fallback;
      };

      const authoritative = clampCrop({
        x: parseOrFallback(draftInputs.x, crop.x),
        y: parseOrFallback(draftInputs.y, crop.y),
        width: parseOrFallback(draftInputs.width, crop.width),
        height: parseOrFallback(draftInputs.height, crop.height),
      });
      syncCropAndDrafts(authoritative);

      const img = await loadImageElement(current.url);
      const targetMime = mimeFromFile(current.file);

      const canvas = document.createElement('canvas');
      canvas.width = authoritative.width;
      canvas.height = authoritative.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      if (targetMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, authoritative.width, authoritative.height);
      }
      ctx.drawImage(
        img,
        authoritative.x,
        authoritative.y,
        authoritative.width,
        authoritative.height,
        0,
        0,
        authoritative.width,
        authoritative.height,
      );

      applyToolPlatformWatermark(ctx, authoritative.width, authoritative.height, tool.slug);

      const blob = await canvasToBlob(canvas, targetMime, 0.92);
      const ext = extFromMime(targetMime);
      setOutputs([
        {
          id: current.id,
          sourceName: current.file.name,
          outputName: `${stripExtension(current.file.name)}-cropped-${authoritative.width}x${authoritative.height}.${ext}`,
          mime: targetMime,
          inputBytes: current.file.size,
          outputBytes: blob.size,
          width: authoritative.width,
          height: authoritative.height,
          url: URL.createObjectURL(blob),
          watermarked: true,
        },
      ]);
    } catch (err: any) {
      setError(err?.message || 'Crop failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Drag the crop box directly on the image or enter exact X, Y, Width, and Height pixel bounds.
        </p>
      </div>

      <ImageUploadPanel
        tool={tool}
        items={items}
        isMultiple={isMultiple}
        maxMB={maxMB}
        maxFiles={maxFiles}
        onFileInput={(e) => {
          clearOutputs();
          if (e.target.files) void loadFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        onTrySample={async () => {
          clearOutputs();
          const f = await generateRichSampleImageFile(tool.slug, 'sample-crop.png');
          await loadFiles([f]);
        }}
        onClear={() => {
          clearOutputs();
          clearFiles();
        }}
      />

      {current && (
        <div className="mt-5 space-y-4">
          {/* Aspect Ratio Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mr-1">
              Aspect Ratio:
            </span>
            {(['free', '1:1', '4:3', '16:9', '3:4'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyAspectPreset(preset)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  aspectPreset === preset
                    ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF]'
                }`}
              >
                {preset === 'free' ? 'Freehand' : preset}
              </button>
            ))}
          </div>

          {/* Interactive Drag Preview */}
          <div className="flex justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/90 p-3 select-none">
            <div
              ref={previewRef}
              onPointerDown={(e) => handleCropPointerDown(e, 'draw')}
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              className="relative inline-block max-w-full cursor-crosshair overflow-hidden touch-none"
            >
              <img
                src={current.url}
                alt="Crop workspace preview"
                draggable={false}
                className="block max-h-[380px] w-auto select-none"
              />
              {/* Highlighted crop frame */}
              <div
                onPointerDown={(e) => handleCropPointerDown(e, 'move')}
                style={{
                  left: `${(crop.x / current.width) * 100}%`,
                  top: `${(crop.y / current.height) * 100}%`,
                  width: `${(crop.width / current.width) * 100}%`,
                  height: `${(crop.height / current.height) * 100}%`,
                  boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55)',
                }}
                className="absolute border-2 border-[#0A8CFF] cursor-move"
              >
                <div
                  onPointerDown={(e) => handleCropPointerDown(e, 'se')}
                  title="Drag to resize crop"
                  className="absolute -bottom-2 -right-2 h-4 w-4 rounded-sm border-2 border-white bg-[#0A8CFF] cursor-nwse-resize"
                />
              </div>
            </div>
          </div>

          {/* Numeric X, Y, Width, Height */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div>
              <label
                htmlFor="crop-x-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                X (px)
              </label>
              <input
                id="crop-x-input"
                type="number"
                min={0}
                max={Math.max(0, current.width - 1)}
                value={draftInputs.x}
                onChange={(e) => handleNumericChange('x', e.target.value)}
                onBlur={() => commitDraftField('x')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitDraftField('x');
                  }
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="crop-y-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Y (px)
              </label>
              <input
                id="crop-y-input"
                type="number"
                min={0}
                max={Math.max(0, current.height - 1)}
                value={draftInputs.y}
                onChange={(e) => handleNumericChange('y', e.target.value)}
                onBlur={() => commitDraftField('y')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitDraftField('y');
                  }
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="crop-width-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Width (px)
              </label>
              <input
                id="crop-width-input"
                type="number"
                min={1}
                max={current.width}
                value={draftInputs.width}
                onChange={(e) => handleNumericChange('width', e.target.value)}
                onBlur={() => commitDraftField('width')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitDraftField('width');
                  }
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="crop-height-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Height (px)
              </label>
              <input
                id="crop-height-input"
                type="number"
                min={1}
                max={current.height}
                value={draftInputs.height}
                onChange={(e) => handleNumericChange('height', e.target.value)}
                onBlur={() => commitDraftField('height')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitDraftField('height');
                  }
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleCrop}
          disabled={processing || !current}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CropIcon className="h-4 w-4" />
          )}
          <span>{processing ? 'Cropping...' : 'Crop Image'}</span>
        </button>
      </div>

      {outputs.length > 0 && <ProcessedOutputsList outputs={outputs} />}
    </section>
  );
}

// =========================================================================
// 5. PROFILE PHOTO MAKER (NO WATERMARK, SIMPLE ROUND CROP + BG ONLY)
// =========================================================================
type BgMode = 'transparent' | 'solid' | 'pattern';
type PatternStyle = 'ocean' | 'sunset' | 'stripes' | 'dots' | 'grid';

function paintProfileBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  bgMode: BgMode,
  solidColor: string,
  patternStyle: PatternStyle,
) {
  if (bgMode === 'transparent') return;
  if (bgMode === 'solid') {
    ctx.fillStyle = solidColor;
    ctx.fillRect(0, 0, size, size);
    return;
  }

  if (patternStyle === 'ocean') {
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#0A8CFF');
    g.addColorStop(1, '#06B6D4');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  } else if (patternStyle === 'sunset') {
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#F97316');
    g.addColorStop(1, '#EC4899');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  } else if (patternStyle === 'stripes') {
    ctx.fillStyle = '#EFF6FF';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = Math.max(8, size * 0.035);
    for (let i = -size; i < size * 2; i += Math.max(24, size * 0.09)) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }
  } else if (patternStyle === 'dots') {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    const step = Math.max(20, size * 0.08);
    for (let y = step / 2; y < size; y += step) {
      for (let x = step / 2; x < size; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, step * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = Math.max(1, size * 0.004);
    const step = Math.max(24, size * 0.1);
    for (let p = step; p < size; p += step) {
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }
  }
}

function ProfilePhotoRunner({tool}: {tool: Tool}) {
  const {items, error, setError, loadFiles, clearFiles, isMultiple, maxMB, maxFiles} =
    useImageFiles(tool);
  const current = items[0] ?? null;

  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const [solidColor, setSolidColor] = useState<string>('#0A8CFF');
  const [patternStyle, setPatternStyle] = useState<PatternStyle>('ocean');
  const [frameInset, setFrameInset] = useState<number>(0);
  const [outputSize, setOutputSize] = useState<400 | 800>(800);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [outputBytes, setOutputBytes] = useState<number>(0);

  useEffect(() => {
    setPreviewDataUrl(null);
    setOutputBytes(0);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [tool.slug]);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      if (!current) {
        setPreviewDataUrl(null);
        setOutputBytes(0);
        return;
      }
      try {
        const img = await loadImageElement(current.url);
        if (cancelled) return;
        const size = outputSize;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);
        paintProfileBackground(ctx, size, bgMode, solidColor, patternStyle);

        const pad = bgMode === 'transparent' ? 0 : Math.round((frameInset / 100) * (size * 0.2));
        const radius = size / 2 - pad;

        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, Math.max(20, radius), 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Fill subtle neutral behind transparent source photos if bgMode is transparent
        if (bgMode !== 'transparent') {
          paintProfileBackground(ctx, size, bgMode, solidColor, patternStyle);
        }

        const coverScale = Math.max((radius * 2) / img.naturalWidth, (radius * 2) / img.naturalHeight);
        const drawW = img.naturalWidth * coverScale * zoom;
        const drawH = img.naturalHeight * coverScale * zoom;
        const drawX = (size - drawW) / 2 + (offsetX / 100) * (size * 0.35);
        const drawY = (size - drawH) / 2 + (offsetY / 100) * (size * 0.35);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // NO watermark on Profile Photo Maker!
        const blob = await canvasToBlob(canvas, 'image/png');
        if (cancelled) return;
        setOutputBytes(blob.size);
        setPreviewDataUrl(canvas.toDataURL('image/png'));
      } catch {
        // ignore transient errors
      }
    };
    void render();
    return () => {
      cancelled = true;
    };
  }, [current, bgMode, solidColor, patternStyle, frameInset, outputSize, zoom, offsetX, offsetY]);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          This tool crops your photo into a round profile picture with the background colour or pattern you choose. It does not use AI, automatic face detection, or background removal.
        </p>
      </div>

      <ImageUploadPanel
        tool={tool}
        items={items}
        isMultiple={isMultiple}
        maxMB={maxMB}
        maxFiles={maxFiles}
        onFileInput={(e) => {
          if (e.target.files) void loadFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        onTrySample={async () => {
          const f = await generateRichSampleImageFile(tool.slug, 'sample-portrait.png');
          await loadFiles([f]);
        }}
        onClear={clearFiles}
      />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Background Style (outside circle / transparent cutouts)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                {id: 'transparent' as const, label: 'Transparent'},
                {id: 'solid' as const, label: 'Solid Colour'},
                {id: 'pattern' as const, label: 'Pattern'},
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setBgMode(opt.id);
                    if (opt.id !== 'transparent' && frameInset === 0) {
                      setFrameInset(20);
                    }
                  }}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                    bgMode === opt.id
                      ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {bgMode === 'solid' && (
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pick Solid Colour
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {['#0A8CFF', '#0F172A', '#10B981', '#F59E0B', '#EC4899', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Select color ${c}`}
                    onClick={() => setSolidColor(c)}
                    style={{backgroundColor: c}}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      solidColor.toUpperCase() === c
                        ? 'border-slate-950 dark:border-white scale-110'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="h-7 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                />
              </div>
            </div>
          )}

          {bgMode === 'pattern' && (
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pick Background Pattern
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  {id: 'ocean' as const, label: 'Ocean'},
                  {id: 'sunset' as const, label: 'Sunset'},
                  {id: 'stripes' as const, label: 'Stripes'},
                  {id: 'dots' as const, label: 'Dots'},
                  {id: 'grid' as const, label: 'Grid'},
                ].map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => setPatternStyle(pat.id)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                      patternStyle === pat.id
                        ? 'border-[#0A8CFF] bg-sky-50 dark:bg-sky-900/40 text-[#0A8CFF]'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {pat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bgMode !== 'transparent' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Outer Backdrop Frame: <span className="font-mono tabular-nums">{frameInset}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={60}
                value={frameInset}
                onChange={(e) => setFrameInset(Number(e.target.value))}
                className="w-full accent-[#0A8CFF]"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Zoom ({zoom.toFixed(1)}x)
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#0A8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pan X ({offsetX}%)
              </label>
              <input
                type="range"
                min={-100}
                max={100}
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                className="w-full accent-[#0A8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pan Y ({offsetY}%)
              </label>
              <input
                type="range"
                min={-100}
                max={100}
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full accent-[#0A8CFF]"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Output Size (PNG)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {([400, 800] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setOutputSize(sz)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold ${
                    outputSize === sz
                      ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {sz} × {sz} px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Round Preview & Download */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%)] dark:bg-slate-950/60 bg-[length:20px_20px] bg-[position:0_0,10px_10px] p-6">
          {previewDataUrl ? (
            <>
              <img
                src={previewDataUrl}
                alt="Round profile preview"
                className="h-52 w-52 object-contain drop-shadow-md"
              />
              <p className="mt-3 font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                {outputSize}×{outputSize} px · PNG · {formatBytes(outputBytes)}
              </p>
              <a
                href={previewDataUrl}
                download={`profile-photo-${outputSize}x${outputSize}.png`}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 text-xs font-semibold text-white transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Round PNG</span>
              </a>
            </>
          ) : (
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              Upload a photo or click <strong>Try sample image</strong> to preview your round avatar.
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}

// =========================================================================
// 6. CHART MAKER (NO FILE UPLOAD, NO WATERMARK, PRELOADED SAMPLE ROWS)
// =========================================================================
const DEFAULT_CHART_ROWS: ChartRow[] = [
  {id: 'r1', label: 'Jan', value: '42'},
  {id: 'r2', label: 'Feb', value: '58'},
  {id: 'r3', label: 'Mar', value: '75'},
  {id: 'r4', label: 'Apr', value: '64'},
  {id: 'r5', label: 'May', value: '91'},
];

const CHART_PALETTES: Record<string, string[]> = {
  blue: ['#0A8CFF', '#38BDF8', '#0284C7', '#60A5FA', '#1D4ED8', '#0EA5E9'],
  vibrant: ['#0A8CFF', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#EF4444'],
  emerald: ['#059669', '#10B981', '#34D399', '#0D9488', '#14B8A6', '#047857'],
};

function ChartMakerRunner({tool}: {tool: Tool}) {
  const maxRows = tool.maxDataRows ?? 50;
  const [rows, setRows] = useState<ChartRow[]>(DEFAULT_CHART_ROWS);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [title, setTitle] = useState<string>('Monthly Revenue Growth');
  const [yLabel, setYLabel] = useState<string>('Units ($K)');
  const [paletteKey, setPaletteKey] = useState<'blue' | 'vibrant' | 'emerald'>('blue');
  const [chartPngUrl, setChartPngUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setRows(DEFAULT_CHART_ROWS);
    setChartType('bar');
    setTitle('Monthly Revenue Growth');
    setYLabel('Units ($K)');
  }, [tool.slug]);

  const parsedRows = useMemo(
    () =>
      rows.map((r) => ({
        label: r.label.trim() || 'Item',
        value: Number.isFinite(parseFloat(r.value)) ? Math.max(0, parseFloat(r.value)) : 0,
      })),
    [rows],
  );

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 1000;
    const H = 600;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = CHART_PALETTES[paletteKey] || CHART_PALETTES.blue;

    // Clean white canvas background (NO watermark on Chart Maker)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Subtle border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.trim() || 'Untitled Chart', W / 2, 54);

    if (parsedRows.length === 0) {
      ctx.fillStyle = '#64748B';
      ctx.font = '18px sans-serif';
      ctx.fillText('Add data rows to generate your chart.', W / 2, H / 2);
      setChartPngUrl(canvas.toDataURL('image/png'));
      return;
    }

    if (chartType === 'pie') {
      const total = parsedRows.reduce((sum, r) => sum + r.value, 0);
      const cx = W * 0.36;
      const cy = H * 0.54;
      const radius = 190;

      if (total <= 0) {
        ctx.fillStyle = '#64748B';
        ctx.font = '18px sans-serif';
        ctx.fillText('Enter positive values to render a pie chart.', W / 2, H / 2);
        setChartPngUrl(canvas.toDataURL('image/png'));
        return;
      }

      let startAngle = -Math.PI / 2;
      parsedRows.forEach((item, idx) => {
        const sliceAngle = (item.value / total) * Math.PI * 2;
        const color = palette[idx % palette.length];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Percentage inside slice if wide enough
        if (sliceAngle > 0.28) {
          const mid = startAngle + sliceAngle / 2;
          const tx = cx + Math.cos(mid) * (radius * 0.62);
          const ty = cy + Math.sin(mid) * (radius * 0.62);
          const pct = `${Math.round((item.value / total) * 100)}%`;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pct, tx, ty);
        }

        startAngle += sliceAngle;
      });

      // Legend on right
      const legendX = W * 0.64;
      let legendY = 120;
      const maxLegend = Math.min(parsedRows.length, 14);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < maxLegend; i++) {
        const item = parsedRows[i];
        const color = palette[i % palette.length];
        ctx.fillStyle = color;
        ctx.fillRect(legendX, legendY - 8, 16, 16);
        ctx.fillStyle = '#1E293B';
        ctx.font = '15px sans-serif';
        const pct = ((item.value / total) * 100).toFixed(1);
        ctx.fillText(`${item.label.slice(0, 18)} (${item.value} · ${pct}%)`, legendX + 26, legendY);
        legendY += 30;
      }
    } else {
      // Bar & Line chart coordinate box
      const padL = 95;
      const padR = 50;
      const padT = 95;
      const padB = 90;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;
      const maxVal = Math.max(10, ...parsedRows.map((r) => r.value)) * 1.12;

      // Y-axis title
      if (yLabel.trim()) {
        ctx.save();
        ctx.translate(28, padT + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(yLabel.trim(), 0, 0);
        ctx.restore();
      }

      // Horizontal gridlines & ticks
      const ticks = 5;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '13px sans-serif';
      for (let t = 0; t <= ticks; t++) {
        const val = (maxVal / ticks) * t;
        const y = padT + plotH - (t / ticks) * plotH;
        ctx.strokeStyle = t === 0 ? '#94A3B8' : '#E2E8F0';
        ctx.lineWidth = t === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(padL + plotW, y);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.fillText(Number.isInteger(val) ? String(val) : val.toFixed(1), padL - 12, y);
      }

      // Y axis line
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, padT + plotH);
      ctx.stroke();

      const count = parsedRows.length;
      const slotW = plotW / count;
      const labelStep = count > 26 ? 3 : count > 14 ? 2 : 1;

      if (chartType === 'bar') {
        const barW = Math.min(72, slotW * 0.62);
        parsedRows.forEach((item, idx) => {
          const barH = (item.value / maxVal) * plotH;
          const x = padL + idx * slotW + (slotW - barW) / 2;
          const y = padT + plotH - barH;
          ctx.fillStyle = palette[idx % palette.length];
          ctx.fillRect(x, y, barW, barH);

          // Value label above bar (thin on dense datasets)
          if (count <= 20) {
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(String(item.value), x + barW / 2, y - 6);
          }

          // X-axis label
          if (idx % labelStep === 0) {
            ctx.fillStyle = '#334155';
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(item.label.slice(0, 12), x + barW / 2, padT + plotH + 14);
          }
        });
      } else {
        // Line chart
        const points = parsedRows.map((item, idx) => ({
          x: padL + idx * slotW + slotW / 2,
          y: padT + plotH - (item.value / maxVal) * plotH,
          item,
        }));

        // Soft area fill
        ctx.fillStyle = 'rgba(10, 140, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(points[0].x, padT + plotH);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padT + plotH);
        ctx.closePath();
        ctx.fill();

        // Line stroke
        ctx.strokeStyle = palette[0];
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();

        // Markers + labels
        points.forEach((p, idx) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = palette[0];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, count > 24 ? 4 : 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (count <= 20) {
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(String(p.item.value), p.x, p.y - 10);
          }

          if (idx % labelStep === 0) {
            ctx.fillStyle = '#334155';
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(p.item.label.slice(0, 12), p.x, padT + plotH + 14);
          }
        });
      }
    }

    setChartPngUrl(canvas.toDataURL('image/png'));
  }, [chartType, paletteKey, parsedRows, title, yLabel]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const addRow = () => {
    if (rows.length >= maxRows) return;
    setRows((prev) => [
      ...prev,
      {id: `r-${Date.now()}-${prev.length}`, label: `Item ${prev.length + 1}`, value: '50'},
    ]);
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            {tool.name} Workspace
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enter up to {maxRows} data rows below — no file upload required. Exports clean PNG charts with zero watermarks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRows(DEFAULT_CHART_ROWS)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset sample data</span>
        </button>
      </div>

      {/* Chart Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Chart Type
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              {id: 'bar' as const, label: 'Bar', Icon: BarChart3},
              {id: 'line' as const, label: 'Line', Icon: TrendingUp},
              {id: 'pie' as const, label: 'Pie', Icon: PieChart},
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setChartType(t.id)}
                className={`inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                  chartType === t.id
                    ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                }`}
              >
                <t.Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chart title"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Y-Axis Label
            </label>
            <input
              type="text"
              value={yLabel}
              disabled={chartType === 'pie'}
              onChange={(e) => setYLabel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs disabled:opacity-40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Colors
            </label>
            <select
              value={paletteKey}
              onChange={(e) => setPaletteKey(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold"
            >
              <option value="blue">Ocean Blue</option>
              <option value="vibrant">Multi-Color</option>
              <option value="emerald">Emerald</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Rows Editor */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Data Rows ({rows.length}/{maxRows} max)
          </span>
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= maxRows}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add row</span>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {rows.map((row, idx) => (
            <div key={row.id} className="flex items-center gap-2">
              <span className="w-6 text-right font-mono text-xs text-slate-400 tabular-nums">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={row.label}
                placeholder="Label"
                onChange={(e) => {
                  const val = e.target.value;
                  setRows((prev) => prev.map((r) => (r.id === row.id ? {...r, label: val} : r)));
                }}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs"
              />
              <input
                type="number"
                value={row.value}
                placeholder="Value"
                onChange={(e) => {
                  const val = e.target.value;
                  setRows((prev) => prev.map((r) => (r.id === row.id ? {...r, value: val} : r)));
                }}
                className="w-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono tabular-nums"
              />
              <button
                type="button"
                aria-label={`Remove row ${idx + 1}`}
                disabled={rows.length <= 1}
                onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Canvas Preview + Download */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white shadow-xs"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            1000 × 600 px · PNG · Unwatermarked
          </span>
          {chartPngUrl && (
            <a
              href={chartPngUrl}
              download={`chart-${chartType}.png`}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 text-xs font-semibold text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Chart PNG</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// Shared Result List (Shows dimensions, input/output sizes, download link)
// =========================================================================
function ProcessedOutputsList({
  outputs,
  showSavings = false,
}: {
  outputs: ProcessedImageOutput[];
  showSavings?: boolean;
}) {
  return (
    <div className="mt-6 space-y-3 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
        <Check className="h-4 w-4 text-emerald-600" />
        <span>
          Processed {outputs.length} {outputs.length === 1 ? 'image' : 'images'} cleanly in your browser
        </span>
      </div>

      <div className="space-y-2.5">
        {outputs.map((out) => {
          const savedPct =
            out.inputBytes > 0
              ? Math.round(((out.inputBytes - out.outputBytes) / out.inputBytes) * 100)
              : 0;
          return (
            <div
              key={out.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={out.url}
                  alt={out.outputName}
                  className="h-14 w-14 shrink-0 rounded-md border border-slate-200 dark:border-slate-700 object-contain bg-slate-50"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {out.outputName}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                    {out.width}×{out.height} px · {out.mime}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    {showSavings
                      ? `Input: ${formatBytes(out.inputBytes)} → Output: ${formatBytes(out.outputBytes)} (${savedPct >= 0 ? `${savedPct}% smaller` : `${Math.abs(savedPct)}% larger`})`
                      : `Output size: ${formatBytes(out.outputBytes)}`}
                  </p>
                </div>
              </div>

              <a
                href={out.url}
                download={out.outputName}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 text-xs font-semibold text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
