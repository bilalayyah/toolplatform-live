import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  CheckCircle2,
  Download,
  Globe,
  ImageIcon,
  MessageCircle,
  Monitor,
  RotateCcw,
  Share2,
  Smartphone,
  ThumbsUp,
  Upload,
} from 'lucide-react';
import {
  analyzeFacebookCharacters,
  analyzeFacebookHashtags,
  calculateFollowerGrowth,
  FACEBOOK_FIELD_LIMITS,
  formatFacebookText,
  type CharacterAnalysis,
  type FacebookFieldKey,
  type FollowerGrowthResult,
  type GrowthPeriodUnit,
  type HashtagAnalysis,
  type TextFormatAction,
} from '../../../lib/facebook/utilityEngines';
import {
  downloadTextFile,
  FbCopyButton,
  FbErrorAlert,
  FbWarningAlert,
  useClipboardState,
} from './FbSharedControls';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateImageFile(file: File): string | null {
  const mime = file.type.toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ALLOWED_IMAGE_MIME.has(mime) && !extOk) {
    return `Unsupported file type (${file.type || file.name}). Please upload a JPG, PNG, or WebP image.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `File size (${formatBytes(file.size)}) exceeds the 10 MB limit.`;
  }
  return null;
}

function loadImageFromFile(file: File): Promise<{img: HTMLImageElement; dataUrl: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => resolve({img, dataUrl});
      img.onerror = () => reject(new Error('Invalid or corrupted image file.'));
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// 1. Facebook Profile Picture Resizer (170x170 px display size)
// ============================================================================
export function FbProfilePictureResizer() {
  const [srcInfo, setSrcInfo] = useState<{
    name: string;
    size: number;
    width: number;
    height: number;
    img: HTMLImageElement;
  } | null>(null);
  const [fitMode, setFitMode] = useState<'crop' | 'fit'>('crop');
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [jpgQuality, setJpgQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [circlePreview, setCirclePreview] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const renderResized = (
    info = srcInfo,
    nextFit = fitMode,
    nextFmt = format,
    nextQual = jpgQuality,
    nextBg = bgColor
  ) => {
    if (!info) return;
    const target = 170;
    const canvas = document.createElement('canvas');
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (nextFmt === 'jpg' || nextFit === 'fit') {
      ctx.fillStyle = nextBg;
      ctx.fillRect(0, 0, target, target);
    } else {
      ctx.clearRect(0, 0, target, target);
    }

    const {width: iw, height: ih} = info.img;
    if (nextFit === 'crop') {
      const scale = Math.max(target / iw, target / ih);
      const sw = target / scale;
      const sh = target / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;
      ctx.drawImage(info.img, sx, sy, sw, sh, 0, 0, target, target);
    } else {
      const scale = Math.min(target / iw, target / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (target - dw) / 2;
      const dy = (target - dh) / 2;
      ctx.drawImage(info.img, 0, 0, iw, ih, dx, dy, dw, dh);
    }

    const mime = nextFmt === 'png' ? 'image/png' : 'image/jpeg';
    const quality = nextFmt === 'jpg' ? nextQual / 100 : undefined;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setOutputUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutputSize(blob.size);
      },
      mime,
      quality
    );
  };

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      setErrors([err]);
      setSrcInfo(null);
      setOutputUrl(null);
      setOutputSize(null);
      return;
    }
    try {
      const {img} = await loadImageFromFile(file);
      const info = {name: file.name, size: file.size, width: img.width, height: img.height, img};
      setErrors([]);
      setSrcInfo(info);
      renderResized(info, fitMode, format, jpgQuality, bgColor);
    } catch (loadErr) {
      setErrors([loadErr instanceof Error ? loadErr.message : 'Failed to load image.']);
    }
  };

  const triggerResizeClick = () => {
    if (!srcInfo) {
      setErrors(['Please upload a JPG, PNG, or WebP image (max 10 MB) first.']);
      return;
    }
    setErrors([]);
    renderResized();
  };

  const reset = () => {
    setSrcInfo(null);
    setOutputUrl(null);
    setOutputSize(null);
    setErrors([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const outFileName = srcInfo
    ? `${srcInfo.name.replace(/\.[^.]+$/, '')}_fb_170x170.${format}`
    : `facebook_profile_170x170.${format}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
        Resizes uploaded images locally via HTML5 Canvas to Facebook&apos;s exact <strong>170 × 170 px</strong> desktop profile display size (JPG, PNG, WebP · max 10 MB · zero upload).
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 lg:col-span-4">
          <span className={LABEL_CLASS}>Upload Profile Image (JPG, PNG, WebP · max 10 MB)</span>
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="fb-ppr-file"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0A8CFF] focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>{srcInfo ? 'Change Image' : 'Choose Image'}</span>
              <input
                ref={fileRef}
                id="fb-ppr-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={handleFile}
                aria-label={srcInfo ? 'Change Image' : 'Choose Image'}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
              />
            </label>
            {srcInfo && (
              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                {srcInfo.name} · {srcInfo.width} × {srcInfo.height} px · {formatBytes(srcInfo.size)}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="fb-ppr-fit" className={LABEL_CLASS}>Aspect Ratio Mode</label>
          <select
            id="fb-ppr-fit"
            value={fitMode}
            onChange={(e) => {
              const v = e.target.value as 'crop' | 'fit';
              setFitMode(v);
              if (srcInfo) renderResized(srcInfo, v, format, jpgQuality, bgColor);
            }}
            className={INPUT_CLASS}
          >
            <option value="crop">Crop to Square (Fill 170×170)</option>
            <option value="fit">Fit with Padding</option>
          </select>
        </div>

        <div>
          <label htmlFor="fb-ppr-fmt" className={LABEL_CLASS}>Output Format</label>
          <select
            id="fb-ppr-fmt"
            value={format}
            onChange={(e) => {
              const v = e.target.value as 'png' | 'jpg';
              setFormat(v);
              if (srcInfo) renderResized(srcInfo, fitMode, v, jpgQuality, bgColor);
            }}
            className={INPUT_CLASS}
          >
            <option value="png">PNG (Lossless)</option>
            <option value="jpg">JPG (Compressed)</option>
          </select>
        </div>

        {format === 'jpg' && (
          <div>
            <label htmlFor="fb-ppr-q" className={LABEL_CLASS}>JPG Quality ({jpgQuality}%)</label>
            <input
              id="fb-ppr-q"
              type="range"
              min={30}
              max={100}
              value={jpgQuality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setJpgQuality(q);
                if (srcInfo) renderResized(srcInfo, fitMode, format, q, bgColor);
              }}
              className="w-full mt-2"
            />
          </div>
        )}

        {(fitMode === 'fit' || format === 'jpg') && (
          <div>
            <label htmlFor="fb-ppr-bg" className={LABEL_CLASS}>Padding / Background</label>
            <input
              id="fb-ppr-bg"
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                if (srcInfo) renderResized(srcInfo, fitMode, format, jpgQuality, e.target.value);
              }}
              className="h-9 w-full rounded-xl border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900 cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={triggerResizeClick}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold cursor-pointer hover:opacity-90"
        >
          <span>Resize to 170 × 170 px</span>
        </button>
        <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" checked={circlePreview} onChange={(e) => setCirclePreview(e.target.checked)} />
          <span>Show Facebook circular mask preview</span>
        </label>
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

      {outputUrl && srcInfo && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <img
                src={outputUrl}
                alt="Resized 170x170 preview"
                width={170}
                height={170}
                className={`w-[170px] h-[170px] object-cover transition-all ${circlePreview ? 'rounded-full ring-2 ring-[#0A8CFF]' : 'rounded-lg'}`}
              />
            </div>
            <span className="text-[11px] text-slate-500">
              {circlePreview ? 'Circular feed mask preview (file exports 170×170 square)' : 'Exact 170×170 px output'}
            </span>
          </div>

          <div className="space-y-3 text-xs flex-1">
            <div data-result className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
                <span className="text-slate-500 block">Original</span>
                <strong className="font-mono text-slate-900 dark:text-slate-100">
                  {srcInfo.width} × {srcInfo.height} px ({formatBytes(srcInfo.size)})
                </strong>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
                <span className="text-slate-500 block">Processed Output</span>
                <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                  170 × 170 px ({outputSize !== null ? formatBytes(outputSize) : '—'})
                </strong>
              </div>
            </div>
            <a
              href={outputUrl}
              download={outFileName}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download {format.toUpperCase()} (170×170)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. Facebook Hashtag Counter
// ============================================================================
export function FbHashtagCounter() {
  const {copiedId, copy} = useClipboardState();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<HashtagAnalysis | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!text.trim()) {
      setErrors(['Please paste a Facebook post or Reel caption to count hashtags.']);
      setAnalysis(null);
      return;
    }
    setErrors([]);
    setAnalysis(analyzeFacebookHashtags(text));
  };

  const reset = () => {
    setText('');
    setAnalysis(null);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fb-hc-input" className={LABEL_CLASS}>Paste Post or Reel Draft</label>
        <textarea
          id="fb-hc-input"
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (analysis) setAnalysis(e.target.value.trim() ? analyzeFacebookHashtags(e.target.value) : null);
          }}
          placeholder="Paste your Facebook post text containing #hashtags here..."
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleAnalyze}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Count Hashtags</span>
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {analysis && (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div data-result className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-2xl font-bold font-mono text-[#0A8CFF]">{analysis.totalCount}</div>
              <div className="text-xs text-slate-500">
                {analysis.totalCount === 0 ? '0 hashtags found' : 'Total #hashtags'}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{analysis.uniqueCount}</div>
              <div className="text-xs text-slate-500">Unique hashtags</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className={`text-2xl font-bold font-mono ${analysis.duplicates.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.duplicates.length}
              </div>
              <div className="text-xs text-slate-500">Duplicate groups</div>
            </div>
          </div>

          {analysis.totalCount === 0 ? (
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>0 hashtags found</strong> in the pasted text. Add `#` before keywords if you want to include hashtags.
            </p>
          ) : (
            <>
              {analysis.exceedsBestPractice ? (
                <FbWarningAlert
                  warnings={[
                    `Best-practice guideline (not a platform rule): You have ${analysis.totalCount} hashtags. Using more than 10 hashtags in a single Facebook post can look cluttered—many Pages keep posts to 2–5 focused tags.`,
                  ]}
                />
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Within best-practice guideline (10 or fewer tags; guideline only, not a hard Facebook limit).</span>
                </div>
              )}

              {analysis.duplicates.length > 0 && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 p-3 text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200">Duplicate Hashtags Flagged (case-insensitive):</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.duplicates.map((d) => (
                      <span key={d.tag} className="rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 px-2 py-0.5 font-mono text-amber-900 dark:text-amber-200">
                        {d.variants.join(' / ')} ×{d.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    All Detected Tags ({analysis.tags.length})
                  </span>
                  <FbCopyButton
                    text={analysis.uniqueTags.join(' ')}
                    id="hc-unique"
                    copiedId={copiedId}
                    onCopy={copy}
                    label="Copy Unique Tags"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.tags.map((tag, i) => {
                    const isDup = analysis.duplicates.some((d) => d.tag.toLowerCase() === tag.toLowerCase());
                    return (
                      <span
                        key={`${tag}-${i}`}
                        className={`rounded-lg border px-2 py-0.5 font-mono text-xs ${
                          isDup
                            ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Facebook Text Formatter
// ============================================================================
export function FbTextFormatter() {
  const {copiedId, copy} = useClipboardState();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const applyFormat = (action: TextFormatAction, label: string) => {
    const source = output || input;
    if (!source.trim()) {
      setErrors(['Please paste or enter text to format first.']);
      return;
    }
    setErrors([]);
    const formatted = formatFacebookText(source, action);
    setOutput(formatted);
    setLastAction(label);
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setLastAction(null);
    setErrors([]);
  };

  const charCount = Array.from(output).length;
  const lineCount = output ? output.split(/\r?\n/).length : 0;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fb-tf-input" className={LABEL_CLASS}>Input Post Text</label>
        <textarea
          id="fb-tf-input"
          rows={5}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(e.target.value);
            setLastAction(null);
            if (errors.length) setErrors([]);
          }}
          placeholder="Paste your rough Facebook post text here, then click any formatting action below..."
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          {id: 'clean-spaces' as TextFormatAction, label: 'Remove Extra Spaces & Fix Breaks'},
          {id: 'title-case' as TextFormatAction, label: 'Title Case'},
          {id: 'uppercase' as TextFormatAction, label: 'UPPERCASE'},
          {id: 'lowercase' as TextFormatAction, label: 'lowercase'},
          {id: 'bullet-list' as TextFormatAction, label: 'Bullet List'},
          {id: 'remove-empty-lines' as TextFormatAction, label: 'Remove Empty Lines'},
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => applyFormat(btn.id, btn.label)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0A8CFF] hover:text-[#0A8CFF] px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
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

      {(output || lastAction) && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Formatted Output</strong>
              {lastAction && <span className="ml-2 text-blue-600 dark:text-blue-400">({lastAction})</span>}
              <span className="ml-3 font-mono text-slate-500">
                {charCount} chars · {lineCount} lines
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FbCopyButton text={output} id="tf-copy" copiedId={copiedId} onCopy={copy} label="Copy Formatted" />
              <button
                type="button"
                onClick={() => {
                  if (!output.trim()) {
                    setErrors(['Nothing to download yet.']);
                    return;
                  }
                  downloadTextFile(output, 'facebook-formatted-text.txt');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>
          <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. Facebook Character Counter (Unicode Code-Point Aware + Field Limits)
// ============================================================================
export function FbCharacterCounter() {
  const {copiedId, copy} = useClipboardState();
  const [fieldKey, setFieldKey] = useState<FacebookFieldKey>('post');
  const [text, setText] = useState('');
  const [submittedAnalysis, setSubmittedAnalysis] = useState<CharacterAnalysis | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const liveAnalysis = useMemo(() => analyzeFacebookCharacters(text, fieldKey), [text, fieldKey]);
  const activeAnalysis = text.length > 0 ? liveAnalysis : submittedAnalysis;
  const spec = FACEBOOK_FIELD_LIMITS.find((f) => f.key === fieldKey) ?? FACEBOOK_FIELD_LIMITS[0];

  const handleCheck = () => {
    if (!text.length) {
      setErrors(['Please enter or paste text to count characters against Facebook limits.']);
      setSubmittedAnalysis(null);
      return;
    }
    setErrors([]);
    setSubmittedAnalysis(analyzeFacebookCharacters(text, fieldKey));
  };

  const reset = () => {
    setText('');
    setSubmittedAnalysis(null);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-cc-field" className={LABEL_CLASS}>Facebook Field Limit</label>
          <select
            id="fb-cc-field"
            value={fieldKey}
            onChange={(e) => setFieldKey(e.target.value as FacebookFieldKey)}
            className={INPUT_CLASS}
          >
            {FACEBOOK_FIELD_LIMITS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label} ({f.limit.toLocaleString()} chars)
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 text-xs text-slate-600 dark:text-slate-300 flex items-center">
          {spec.note}
        </div>
      </div>

      <div>
        <label htmlFor="fb-cc-text" className={LABEL_CLASS}>Your Text (emoji = 1 Unicode code point)</label>
        <textarea
          id="fb-cc-text"
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (errors.length) setErrors([]);
          }}
          placeholder="Type or paste your Facebook post, comment, Page name, or bio..."
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Check Character Limit</span>
        </button>
        {text.length > 0 && <FbCopyButton text={text} id="cc-copy" copiedId={copiedId} onCopy={copy} label="Copy Text" />}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {activeAnalysis && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-3">
          <div data-result className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className={`text-xl font-bold font-mono ${activeAnalysis.withinLimit ? 'text-[#0A8CFF]' : 'text-rose-600'}`}>
                {activeAnalysis.characters.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Characters (code points)</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {activeAnalysis.charactersWithoutSpaces.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Without Spaces</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {activeAnalysis.words.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Words</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {activeAnalysis.lines.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Lines</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {spec.label}: {activeAnalysis.characters.toLocaleString()} / {activeAnalysis.limit.toLocaleString()}
              </span>
              <span className={`font-bold ${activeAnalysis.withinLimit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {activeAnalysis.withinLimit
                  ? `${activeAnalysis.remaining.toLocaleString()} remaining`
                  : `Exceeded by ${activeAnalysis.exceededBy.toLocaleString()} characters`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all ${activeAnalysis.withinLimit ? 'bg-[#0A8CFF]' : 'bg-rose-500'}`}
                style={{width: `${activeAnalysis.percentUsed}%`}}
              />
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Source note: Limits reflect documented Meta / Facebook field thresholds (Post: 63,206; Comment: 8,000; Page name: 75; Profile Bio: 101; Page Short Description: 255). Characters are counted as Unicode code points so standard emojis count as 1.
      </p>
    </div>
  );
}

// ============================================================================
// 5. Facebook Follower Growth Calculator
// ============================================================================
export function FbFollowerGrowthCalculator() {
  const {copiedId, copy} = useClipboardState();
  const [previousRaw, setPreviousRaw] = useState('');
  const [currentRaw, setCurrentRaw] = useState('');
  const [periodRaw, setPeriodRaw] = useState('30');
  const [unit, setUnit] = useState<GrowthPeriodUnit>('days');
  const [result, setResult] = useState<FollowerGrowthResult | null>(null);

  const handleCalculate = () => {
    setResult(calculateFollowerGrowth({previousRaw, currentRaw, periodRaw, unit}));
  };

  const reset = () => {
    setPreviousRaw('');
    setCurrentRaw('');
    setPeriodRaw('30');
    setUnit('days');
    setResult(null);
  };

  const summaryText = result?.valid
    ? [
        `Previous Followers: ${result.previous}`,
        `Current Followers: ${result.current}`,
        `Time Period: ${periodRaw} ${unit} (${result.totalDays} days)`,
        `Growth Rate: ${result.growthRatePercent !== null ? `${result.growthRatePercent.toFixed(2)}%` : 'N/A (previous = 0)'}`,
        `Absolute Growth: ${result.absoluteGrowth >= 0 ? '+' : ''}${result.absoluteGrowth}`,
        `Average Growth / Day: ${result.averagePerDay >= 0 ? '+' : ''}${result.averagePerDay.toFixed(2)} / day`,
      ].join('\n')
    : '';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
        <div>
          <strong>Formula:</strong>{' '}
          <code className="font-mono text-blue-700 dark:text-blue-300">
            Growth Rate (%) = ((Current − Previous) / Previous) × 100
          </code>
        </div>
        <div className="text-[11px] text-slate-500">
          Average Growth/Day divides absolute change across total days (1 week = 7 days, 1 month = 30 days).
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div>
          <label htmlFor="fb-fg-prev" className={LABEL_CLASS}>Previous Follower Count <span className="text-rose-500">*</span></label>
          <input id="fb-fg-prev" type="number" min={0} step="1" value={previousRaw} onChange={(e) => setPreviousRaw(e.target.value)} placeholder="e.g., 1200" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-fg-curr" className={LABEL_CLASS}>Current Follower Count <span className="text-rose-500">*</span></label>
          <input id="fb-fg-curr" type="number" min={0} step="1" value={currentRaw} onChange={(e) => setCurrentRaw(e.target.value)} placeholder="e.g., 1500" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-fg-period" className={LABEL_CLASS}>Time Period <span className="text-rose-500">*</span></label>
          <input id="fb-fg-period" type="number" min={1} step="any" value={periodRaw} onChange={(e) => setPeriodRaw(e.target.value)} placeholder="e.g., 30" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-fg-unit" className={LABEL_CLASS}>Period Unit</label>
          <select id="fb-fg-unit" value={unit} onChange={(e) => setUnit(e.target.value as GrowthPeriodUnit)} className={INPUT_CLASS}>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCalculate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Calculate Growth</span>
        </button>
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
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          {result.zeroBaselineNotice && <FbWarningAlert warnings={[result.zeroBaselineNotice]} />}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Growth Summary</span>
            <FbCopyButton text={summaryText} id="fg-copy" copiedId={copiedId} onCopy={copy} label="Copy Summary" />
          </div>
          <div data-result className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
              <div className="text-2xl font-bold font-mono text-[#0A8CFF]">
                {result.growthRatePercent !== null ? `${result.growthRatePercent >= 0 ? '+' : ''}${result.growthRatePercent.toFixed(2)}%` : 'N/A'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Growth Rate</div>
              {result.growthRatePercent === null && (
                <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300 mt-1">
                  Cannot calculate from 0 starting followers
                </div>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {result.absoluteGrowth >= 0 ? '+' : ''}{result.absoluteGrowth.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Absolute Growth</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {result.averagePerDay >= 0 ? '+' : ''}{result.averagePerDay.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Avg. Followers / Day ({result.totalDays}d)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. Facebook Image Compressor (Real HTML5 Canvas Compression)
// ============================================================================
type CompressFormatOption = 'original' | 'jpg' | 'png' | 'webp';

function browserSupportsWebp(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    c.width = 2;
    c.height = 2;
    return c.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

export function FbImageCompressor() {
  const webpSupported = useMemo(() => browserSupportsWebp(), []);
  const [srcInfo, setSrcInfo] = useState<{
    name: string;
    size: number;
    mime: string;
    width: number;
    height: number;
    dataUrl: string;
    img: HTMLImageElement;
  } | null>(null);
  const [quality, setQuality] = useState(70);
  const [formatOpt, setFormatOpt] = useState<CompressFormatOption>('original');
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [actualMime, setActualMime] = useState<string>('image/jpeg');
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const resolveMime = (opt: CompressFormatOption, origMime: string): string => {
    if (opt === 'jpg') return 'image/jpeg';
    if (opt === 'png') return 'image/png';
    if (opt === 'webp' && webpSupported) return 'image/webp';
    if (origMime === 'image/png' || origMime === 'image/jpeg' || (origMime === 'image/webp' && webpSupported)) {
      return origMime;
    }
    return 'image/jpeg';
  };

  const runCompression = (info = srcInfo, nextQuality = quality, nextFormat = formatOpt) => {
    if (!info) return;
    const targetMime = resolveMime(nextFormat, info.mime);
    const canvas = document.createElement('canvas');
    canvas.width = info.width;
    canvas.height = info.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(info.img, 0, 0, info.width, info.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setActualMime(targetMime);
        setCompressedSize(blob.size);
        setCompressedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      },
      targetMime,
      targetMime === 'image/png' ? undefined : nextQuality / 100
    );
  };

  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      setErrors([err]);
      setSrcInfo(null);
      setCompressedUrl(null);
      setCompressedSize(null);
      return;
    }
    try {
      const {img, dataUrl} = await loadImageFromFile(file);
      const mime = file.type || (file.name.toLowerCase().endsWith('.png') ? 'image/png' : file.name.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg');
      const info = {name: file.name, size: file.size, mime, width: img.width, height: img.height, dataUrl, img};
      setErrors([]);
      setSrcInfo(info);
      runCompression(info, quality, formatOpt);
    } catch (loadErr) {
      setErrors([loadErr instanceof Error ? loadErr.message : 'Failed to load image.']);
    }
  };

  const reset = () => {
    setSrcInfo(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setErrors([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const ext = actualMime === 'image/png' ? 'png' : actualMime === 'image/webp' ? 'webp' : 'jpg';
  const reductionPct =
    srcInfo && compressedSize !== null && srcInfo.size > 0
      ? ((srcInfo.size - compressedSize) / srcInfo.size) * 100
      : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
        Compresses JPG, PNG, or WebP images up to 10 MB locally via HTML5 Canvas. Note: lossless PNG re-encoding can sometimes produce a larger file—choose JPG or WebP for strongest byte savings.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
          <label
            htmlFor="fb-ic-file"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0A8CFF] focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{srcInfo ? 'Change Image' : 'Upload Image'}</span>
            <input
              ref={fileRef}
              id="fb-ic-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={handleFile}
              aria-label={srcInfo ? 'Change Image' : 'Upload Image'}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer file:cursor-pointer"
            />
          </label>
          {srcInfo && (
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
              {srcInfo.name} · {srcInfo.width}×{srcInfo.height} · {formatBytes(srcInfo.size)}
            </span>
          )}
        </div>

        <div>
          <label className={LABEL_CLASS}>Quality Preset</label>
          <div className="flex gap-1.5">
            {[
              {label: 'Low', val: 45},
              {label: 'Medium', val: 70},
              {label: 'High', val: 88},
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setQuality(p.val);
                  if (srcInfo) runCompression(srcInfo, p.val, formatOpt);
                }}
                className={`flex-1 rounded-lg border px-2.5 py-2 text-xs font-semibold cursor-pointer ${
                  quality === p.val
                    ? 'border-[#0A8CFF] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="fb-ic-q" className={LABEL_CLASS}>Quality Slider ({quality}%)</label>
          <input
            id="fb-ic-q"
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => {
              const q = Number(e.target.value);
              setQuality(q);
              if (srcInfo) runCompression(srcInfo, q, formatOpt);
            }}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="fb-ic-fmt" className={LABEL_CLASS}>Output Format</label>
          <select
            id="fb-ic-fmt"
            value={formatOpt}
            onChange={(e) => {
              const f = e.target.value as CompressFormatOption;
              setFormatOpt(f);
              if (srcInfo) runCompression(srcInfo, quality, f);
            }}
            className={INPUT_CLASS}
          >
            <option value="original">Keep Original</option>
            <option value="jpg">JPG (Lossy, Smallest Photos)</option>
            <option value="png">PNG (Lossless)</option>
            {webpSupported && <option value="webp">WebP (Modern Compression)</option>}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (!srcInfo) {
              setErrors(['Please upload a JPG, PNG, or WebP image (max 10 MB) first.']);
              return;
            }
            setErrors([]);
            runCompression();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <span>Compress Image</span>
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {srcInfo && compressedUrl && compressedSize !== null && (
        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4">
          <div data-result className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatBytes(srcInfo.size)}</div>
              <div className="text-[11px] text-slate-500">Original Size</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="text-lg font-bold font-mono text-[#0A8CFF]">{formatBytes(compressedSize)}</div>
              <div className="text-[11px] text-slate-500">Compressed Size ({ext.toUpperCase()})</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className={`text-lg font-bold font-mono ${reductionPct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                {reductionPct > 0 ? `-${reductionPct.toFixed(1)}%` : `+${Math.abs(reductionPct).toFixed(1)}%`}
              </div>
              <div className="text-[11px] text-slate-500">
                {reductionPct > 0 ? 'Size Reduction' : 'No reduction (try JPG or lower quality)'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Before ({formatBytes(srcInfo.size)})</div>
              <img src={srcInfo.dataUrl} alt="Original" className="max-h-52 mx-auto object-contain rounded" />
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">After ({formatBytes(compressedSize)})</div>
              <img src={compressedUrl} alt="Compressed" className="max-h-52 mx-auto object-contain rounded" />
            </div>
          </div>

          <a
            href={compressedUrl}
            download={`${srcInfo.name.replace(/\.[^.]+$/, '')}_compressed.${ext}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download Compressed {ext.toUpperCase()}</span>
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. Facebook Post Preview Generator (Desktop vs Mobile + Canvas PNG export)
// ============================================================================
function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (para === '') {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let current = '';
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export function FbPostPreviewGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [pageName, setPageName] = useState('');
  const [postText, setPostText] = useState('');
  const [metaLabel, setMetaLabel] = useState<'Just now' | 'Sponsored'>('Just now');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expanded, setExpanded] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null);
  const [postImgUrl, setPostImgUrl] = useState<string | null>(null);
  const [postImg, setPostImg] = useState<HTMLImageElement | null>(null);
  const [rendered, setRendered] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const avatarRef = useRef<HTMLInputElement>(null);
  const postImgRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) {
      setErrors([err]);
      return;
    }
    try {
      const {img, dataUrl} = await loadImageFromFile(f);
      setAvatarImg(img);
      setAvatarUrl(dataUrl);
      setErrors([]);
    } catch (loadErr) {
      setErrors([loadErr instanceof Error ? loadErr.message : 'Invalid profile image.']);
    }
  };

  const handlePostImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) {
      setErrors([err]);
      return;
    }
    try {
      const {img, dataUrl} = await loadImageFromFile(f);
      setPostImg(img);
      setPostImgUrl(dataUrl);
      setErrors([]);
    } catch (loadErr) {
      setErrors([loadErr instanceof Error ? loadErr.message : 'Invalid post image.']);
    }
  };

  const handleRender = () => {
    const errs: string[] = [];
    if (!pageName.trim()) errs.push('Please enter a Facebook Page name.');
    if (!postText.trim()) errs.push('Please enter post text.');
    if (errs.length > 0) {
      setErrors(errs);
      setRendered(false);
      return;
    }
    setErrors([]);
    setExpanded(false);
    setRendered(true);
  };

  const handleDownloadPng = () => {
    if (!pageName.trim() || !postText.trim()) {
      setErrors(['Enter Page name and Post text, then generate the preview before downloading PNG.']);
      return;
    }
    const isMobile = viewMode === 'mobile';
    const cardW = isMobile ? 380 : 580;
    const pad = isMobile ? 16 : 20;
    const measureCanvas = document.createElement('canvas');
    const mCtx = measureCanvas.getContext('2d');
    if (!mCtx) return;

    const fontSize = isMobile ? 14 : 15;
    const lineHeight = isMobile ? 20 : 22;
    mCtx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;

    const foldCharLimit = isMobile ? 160 : 320;
    const shouldTruncate = !expanded && postText.length > foldCharLimit;
    const visibleText = shouldTruncate ? `${postText.slice(0, foldCharLimit).trimEnd()}... See more` : postText;
    const wrapped = wrapCanvasText(mCtx, visibleText, cardW - pad * 2);

    const headerH = isMobile ? 64 : 72;
    const textBlockH = wrapped.length * lineHeight + 14;
    let imgH = 0;
    if (postImg) {
      const ratio = postImg.height / postImg.width;
      imgH = Math.min(isMobile ? 260 : 340, Math.round(cardW * ratio));
    }
    const footerH = 48;
    const totalH = headerH + textBlockH + imgH + footerH;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White card background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cardW, totalH);

    // Avatar circle
    const avatarSize = isMobile ? 38 : 42;
    const ax = pad;
    const ay = 14;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax + avatarSize / 2, ay + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (avatarImg) {
      ctx.drawImage(avatarImg, ax, ay, avatarSize, avatarSize);
    } else {
      ctx.fillStyle = '#1877F2';
      ctx.fillRect(ax, ay, avatarSize, avatarSize);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pageName.trim().slice(0, 2).toUpperCase(), ax + avatarSize / 2, ay + avatarSize / 2);
    }
    ctx.restore();

    // Page name & timestamp/Sponsored
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#050505';
    ctx.font = `bold ${isMobile ? 14 : 15}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(pageName.trim(), ax + avatarSize + 10, ay + 2, cardW - (ax + avatarSize + 24));
    ctx.fillStyle = '#65676B';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${metaLabel} · Public`, ax + avatarSize + 10, ay + 22);

    // Post text
    ctx.fillStyle = '#050505';
    ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    let ty = headerH;
    for (const line of wrapped) {
      ctx.fillText(line, pad, ty);
      ty += lineHeight;
    }

    // Post image
    const iy = headerH + textBlockH;
    if (postImg && imgH > 0) {
      ctx.drawImage(postImg, 0, iy, cardW, imgH);
    }

    // Divider & Like / Comment / Share row
    const fy = iy + imgH;
    ctx.strokeStyle = '#E4E6EB';
    ctx.beginPath();
    ctx.moveTo(pad, fy + 4);
    ctx.lineTo(cardW - pad, fy + 4);
    ctx.stroke();

    ctx.fillStyle = '#65676B';
    ctx.font = `600 ${isMobile ? 12 : 13}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Like', cardW * 0.18, fy + 18);
    ctx.fillText('Comment', cardW * 0.5, fy + 18);
    ctx.fillText('Share', cardW * 0.82, fy + 18);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `facebook-post-preview-${viewMode}.png`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setPageName('');
    setPostText('');
    setMetaLabel('Just now');
    setAvatarUrl(null);
    setAvatarImg(null);
    setPostImgUrl(null);
    setPostImg(null);
    setRendered(false);
    setExpanded(false);
    setErrors([]);
    if (avatarRef.current) avatarRef.current.value = '';
    if (postImgRef.current) postImgRef.current.value = '';
  };

  const foldLimit = viewMode === 'mobile' ? 160 : 320;
  const needsTruncate = postText.length > foldLimit || postText.split(/\r?\n/).length > (viewMode === 'mobile' ? 4 : 6);
  const shownText =
    !expanded && needsTruncate
      ? postText.slice(0, foldLimit).split(/\r?\n/).slice(0, viewMode === 'mobile' ? 4 : 6).join('\n').trimEnd()
      : postText;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-pp-name" className={LABEL_CLASS}>Page Name <span className="text-rose-500">*</span></label>
          <input id="fb-pp-name" type="text" value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder="e.g., GreenLeaf Coffee Roasters" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pp-meta" className={LABEL_CLASS}>Post Header Label</label>
          <select id="fb-pp-meta" value={metaLabel} onChange={(e) => setMetaLabel(e.target.value as 'Just now' | 'Sponsored')} className={INPUT_CLASS}>
            <option value="Just now">Just now (Organic)</option>
            <option value="Sponsored">Sponsored (Ad Preview)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fb-pp-text" className={LABEL_CLASS}>Post Text <span className="text-rose-500">*</span></label>
          <textarea id="fb-pp-text" rows={4} value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Write or paste your Facebook post copy to inspect Desktop/Mobile formatting and '...See more' truncation..." className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pp-avatar" className={LABEL_CLASS}>Page Profile Picture (optional, max 10 MB)</label>
          <input ref={avatarRef} id="fb-pp-avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} className="block w-full text-xs text-slate-600 dark:text-slate-300" />
        </div>
        <div>
          <label htmlFor="fb-pp-img" className={LABEL_CLASS}>Post Image (optional, max 10 MB)</label>
          <input ref={postImgRef} id="fb-pp-img" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePostImageUpload} className="block w-full text-xs text-slate-600 dark:text-slate-300" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleRender}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <span>Render Post Preview</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadPng}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>Download PNG</span>
        </button>
        {postText.trim() && <FbCopyButton text={postText} id="pp-copy-txt" copiedId={copiedId} onCopy={copy} label="Copy Post Text" />}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <FbErrorAlert errors={errors} />

      {(rendered || (pageName.trim() && postText.trim())) && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 space-y-4">
          {/* Desktop / Mobile Layout Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {viewMode === 'desktop' ? 'Desktop Feed Layout (540px wide)' : 'Mobile Feed Layout (340px phone frame)'}
            </span>
            <div className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'desktop' ? 'bg-[#0A8CFF] text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'mobile' ? 'bg-[#0A8CFF] text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Genuinely different Desktop vs Mobile Card */}
          <div className="flex justify-center">
            <article
              data-result
              className={
                viewMode === 'desktop'
                  ? 'w-full max-w-[540px] rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm overflow-hidden'
                  : 'w-[340px] rounded-[26px] border-4 border-slate-800 bg-white text-slate-900 shadow-lg overflow-hidden'
              }
            >
              {viewMode === 'mobile' && (
                <div className="bg-slate-900 text-white text-[10px] font-mono px-4 py-1 flex justify-between items-center">
                  <span>9:41</span>
                  <span>Mobile Feed Preview</span>
                </div>
              )}

              {/* Header */}
              <div className={viewMode === 'desktop' ? 'px-4 pt-3.5 pb-2.5 flex items-center gap-3' : 'px-3 pt-3 pb-2 flex items-center gap-2.5'}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={pageName}
                    className={viewMode === 'desktop' ? 'h-10 w-10 rounded-full object-cover border border-slate-200' : 'h-9 w-9 rounded-full object-cover border border-slate-200'}
                  />
                ) : (
                  <div className={`${viewMode === 'desktop' ? 'h-10 w-10 text-sm' : 'h-9 w-9 text-xs'} rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center shrink-0`}>
                    {(pageName.trim() || 'FB').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className={`${viewMode === 'desktop' ? 'text-[15px]' : 'text-[14px]'} font-bold text-slate-900 truncate`}>
                    {pageName}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>{metaLabel}</span>
                    <span>·</span>
                    <Globe className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Post Copy with working ...See more toggle */}
              <div className={viewMode === 'desktop' ? 'px-4 pb-3 text-[15px] leading-snug text-slate-900' : 'px-3 pb-2.5 text-[13.5px] leading-snug text-slate-900'}>
                <p className="whitespace-pre-wrap break-words">
                  {shownText}
                  {needsTruncate && !expanded && (
                    <>
                      {'... '}
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="font-semibold text-slate-600 hover:underline cursor-pointer"
                      >
                        See more
                      </button>
                    </>
                  )}
                </p>
                {needsTruncate && expanded && (
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="mt-1 text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                  >
                    See less
                  </button>
                )}
              </div>

              {/* Post Media */}
              {postImgUrl && (
                <div className="bg-slate-100 border-y border-slate-200">
                  <img
                    src={postImgUrl}
                    alt="Post preview media"
                    className={viewMode === 'desktop' ? 'w-full max-h-[360px] object-cover' : 'w-full max-h-[240px] object-cover'}
                  />
                </div>
              )}

              {/* Action Bar */}
              <div
                className={
                  viewMode === 'desktop'
                    ? 'mx-4 py-2 border-t border-slate-200 grid grid-cols-3 text-xs font-semibold text-slate-600'
                    : 'mx-2 py-1.5 border-t border-slate-200 grid grid-cols-3 text-[11px] font-semibold text-slate-600'
                }
              >
                <div className="flex items-center justify-center gap-1.5 py-1.5">
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                  <span>Like</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Comment</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5">
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  <span>Share</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
