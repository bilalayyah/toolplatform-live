import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AlertCircle,
  AudioLines,
  Check,
  Download,
  Film,
  FlaskConical,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  generateSampleAudioFile,
  generateSampleVideoFile,
  isFFmpegReady,
  loadFFmpegEngine,
  probeMediaMetadata,
  runFFmpegJob,
} from '../../lib/videoProcessor';

interface Props {
  tool: Tool;
}

interface LoadedMedia {
  file: File;
  url: string;
  durationSec: number;
  width: number;
  height: number;
  inputFormat: string;
}

interface TranscodedOutput {
  url: string;
  outputName: string;
  mime: string;
  outputFormat: string;
  inputBytes: number;
  outputBytes: number;
  durationSec: number;
  width?: number;
  height?: number;
  mediaKind: 'video' | 'audio' | 'gif';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '0:00';
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem.toFixed(1).replace(/\.0$/, '')}`;
}

function getFileExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function stripExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(0, idx) : name;
}

function computeTargetDimensions(
  srcW: number,
  srcH: number,
  maxPreset: '720p' | '480p' | '360p',
): {width: number; height: number; vf: string} | null {
  if (srcW <= 0 || srcH <= 0) {
    if (maxPreset === '480p') {
      return {width: 854, height: 480, vf: 'scale=-2:480'};
    }
    if (maxPreset === '360p') {
      return {width: 640, height: 360, vf: 'scale=-2:360'};
    }
    return {width: 1280, height: 720, vf: 'scale=trunc(iw/2)*2:trunc(ih/2)*2'};
  }

  const maxH = maxPreset === '720p' ? 720 : maxPreset === '480p' ? 480 : 360;
  const maxW = Math.round((maxH * 16) / 9);
  const ratio = Math.min(1, maxW / srcW, maxH / srcH);

  const width = Math.max(2, Math.floor((srcW * ratio) / 2) * 2);
  const height = Math.max(2, Math.floor((srcH * ratio) / 2) * 2);
  return {width, height, vf: `scale=${width}:${height}`};
}

// =========================================================================
// Shared FFmpeg Engine Lazy-Load Hook
// =========================================================================
function useFFmpegEngine() {
  const [engineReady, setEngineReady] = useState<boolean>(() => isFFmpegReady());
  const [engineLoading, setEngineLoading] = useState<boolean>(false);
  const [engineStatus, setEngineStatus] = useState<string>('');
  const [engineError, setEngineError] = useState<string | null>(null);

  const initEngine = useCallback(async () => {
    if (isFFmpegReady()) {
      setEngineReady(true);
      setEngineError(null);
      return true;
    }
    setEngineLoading(true);
    setEngineError(null);
    try {
      await loadFFmpegEngine((msg) => setEngineStatus(msg));
      setEngineReady(true);
      setEngineStatus('FFmpeg WebAssembly ready in browser');
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load FFmpeg WebAssembly engine.';
      setEngineError(message);
      setEngineReady(false);
      return false;
    } finally {
      setEngineLoading(false);
    }
  }, []);

  useEffect(() => {
    void initEngine();
  }, [initEngine]);

  return {engineReady, engineLoading, engineStatus, engineError, retryEngine: initEngine};
}

// =========================================================================
// Shared Media Loader & Limit Enforcement Hook
// =========================================================================
function useMediaFile(tool: Tool, kind: 'video' | 'audio') {
  const maxMB = tool.maxFileSizeMB ?? 100;
  const maxDurationSec =
    tool.maxDurationMinutes !== undefined ? tool.maxDurationMinutes * 60 : null;

  const [media, setMedia] = useState<LoadedMedia | null>(null);
  const mediaRef = useRef<LoadedMedia | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMediaClean = useCallback((next: LoadedMedia | null) => {
    if (mediaRef.current) {
      URL.revokeObjectURL(mediaRef.current.url);
    }
    mediaRef.current = next;
    setMedia(next);
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        URL.revokeObjectURL(mediaRef.current.url);
        mediaRef.current = null;
      }
    };
  }, []);

  const loadFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.size > maxMB * 1024 * 1024) {
        setError(
          `"${file.name}" is ${formatBytes(file.size)}, which exceeds the ${maxMB} MB maximum limit.`,
        );
        return false;
      }

      const ext = getFileExtension(file.name).toUpperCase();
      const isMediaType =
        kind === 'video'
          ? file.type.startsWith('video/') ||
            ['MP4', 'MOV', 'WEBM', 'AVI', 'MKV', 'M4V'].includes(ext)
          : file.type.startsWith('audio/') ||
            ['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC', 'WEBM'].includes(ext);

      if (!isMediaType) {
        setError(
          `Unsupported file type "${file.name}". Supported formats: ${tool.acceptedFormats.join(', ')}.`,
        );
        return false;
      }

      let durationSec = 0;
      let width = 0;
      let height = 0;
      try {
        const meta = await probeMediaMetadata(file, kind);
        durationSec = meta.durationSec;
        width = meta.width;
        height = meta.height;
      } catch {
        // Containers like AVI or MKV may not decode natively in HTML5 <video>,
        // yet FFmpeg can still transcode them cleanly.
        durationSec = 0;
      }

      if (maxDurationSec !== null && durationSec > maxDurationSec + 0.5) {
        setError(
          `Clip duration (${formatDuration(durationSec)}) exceeds the ${tool.maxDurationMinutes} min (${maxDurationSec}s) limit.`,
        );
        return false;
      }

      const url = URL.createObjectURL(file);
      setMediaClean({
        file,
        url,
        durationSec,
        width,
        height,
        inputFormat: ext || (kind === 'video' ? 'VIDEO' : 'AUDIO'),
      });
      return true;
    },
    [kind, maxDurationSec, maxMB, setMediaClean, tool.acceptedFormats, tool.maxDurationMinutes],
  );

  const clearMedia = useCallback(() => {
    setMediaClean(null);
    setError(null);
  }, [setMediaClean]);

  return {
    media,
    error,
    setError,
    loadFile,
    clearMedia,
    loadingSample,
    setLoadingSample,
    maxMB,
  };
}

function useTranscodeOutput() {
  const [output, setOutputState] = useState<TranscodedOutput | null>(null);
  const outputRef = useRef<TranscodedOutput | null>(null);

  const setOutput = useCallback((next: TranscodedOutput | null) => {
    if (outputRef.current) {
      URL.revokeObjectURL(outputRef.current.url);
    }
    outputRef.current = next;
    setOutputState(next);
  }, []);

  useEffect(() => {
    return () => {
      if (outputRef.current) {
        URL.revokeObjectURL(outputRef.current.url);
        outputRef.current = null;
      }
    };
  }, []);

  return {output, setOutput};
}

// =========================================================================
// Shared UI Subcomponents
// =========================================================================
function FFmpegStatusBar({
  ready,
  loading,
  status,
  error,
  onRetry,
}: {
  ready: boolean;
  loading: boolean;
  status: string;
  error: string | null;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs text-rose-800 dark:text-rose-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 px-4 py-2.5 text-xs text-sky-900 dark:text-sky-100">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#0A8CFF]" />
        <span>{status || 'Loading FFmpeg WebAssembly engine in browser...'}</span>
      </div>
    );
  }

  if (ready) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-2 text-xs text-slate-600 dark:text-slate-300">
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <span>Open-source FFmpeg WebAssembly loaded locally — files never leave your device.</span>
      </div>
    );
  }

  return null;
}

function MediaUploadZone({
  tool,
  kind,
  media,
  maxMB,
  limitSummary,
  loadingSample,
  onSelectFile,
  onTrySample,
  onClear,
}: {
  tool: Tool;
  kind: 'video' | 'audio';
  media: LoadedMedia | null;
  maxMB: number;
  limitSummary: string;
  loadingSample: boolean;
  onSelectFile: (file: File) => void;
  onTrySample: () => void;
  onClear: () => void;
}) {
  const acceptStr =
    kind === 'video'
      ? 'video/*,.mp4,.mov,.webm,.avi,.mkv'
      : 'audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac';

  return (
    <div className="space-y-3">
      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 p-6 sm:p-8 text-center hover:border-[#0A8CFF] hover:bg-sky-50/40 dark:hover:bg-sky-900/10 transition-colors">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40 text-[#0A8CFF] group-hover:scale-105 transition-transform">
          <Upload className="h-6 w-6" />
        </div>
        <span className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {kind === 'video' ? 'Click to select a video file' : 'Click to select an audio file'}
        </span>
        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Formats: {tool.acceptedFormats.join(', ')} · {limitSummary}
        </span>
        <input
          type="file"
          accept={acceptStr}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSelectFile(f);
            e.target.value = '';
          }}
          className="hidden"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          disabled={loadingSample}
          onClick={onTrySample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] hover:bg-sky-100 dark:hover:bg-sky-900/60 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          {loadingSample ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>
            {loadingSample
              ? 'Generating sample clip...'
              : kind === 'video'
                ? 'Try sample video'
                : 'Try sample audio'}
          </span>
        </button>

        {media && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-mono tabular-nums">
              {media.file.name} · {media.inputFormat} · {formatBytes(media.file.size)}
              {media.durationSec > 0 ? ` · ${formatDuration(media.durationSec)}` : ''}
              {media.width > 0 && media.height > 0 ? ` · ${media.width}×${media.height}` : ''}
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

      {!media && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Max file size: {maxMB} MB. Processing runs locally in your browser.
        </p>
      )}
    </div>
  );
}

function TranscodeProgressBar({
  processing,
  progress,
  status,
}: {
  processing: boolean;
  progress: number;
  status: string;
}) {
  if (!processing) return null;
  return (
    <div className="mt-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/20 p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-100 mb-2">
        <span className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0A8CFF]" />
          <span>{status || 'Processing media...'}</span>
        </span>
        <span className="font-mono tabular-nums">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-[#0A8CFF] transition-all duration-200"
          style={{width: `${Math.max(4, Math.min(100, progress))}%`}}
        />
      </div>
    </div>
  );
}

function TranscodeResultCard({
  output,
  inputFormat,
}: {
  output: TranscodedOutput;
  inputFormat: string;
}) {
  const diffPct =
    output.inputBytes > 0
      ? Math.round(((output.inputBytes - output.outputBytes) / output.inputBytes) * 100)
      : 0;

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Ready to download — zero watermarks</span>
        </div>
        <span className="font-mono text-xs text-emerald-800 dark:text-emerald-300 tabular-nums">
          {inputFormat} → {output.outputFormat}
        </span>
      </div>

      {output.mediaKind === 'video' && (
        <video
          src={output.url}
          controls
          playsInline
          className="max-h-72 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950"
        />
      )}

      {output.mediaKind === 'gif' && (
        <div className="flex justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950/90 p-3">
          <img
            src={output.url}
            alt={output.outputName}
            className="max-h-72 w-auto rounded"
          />
        </div>
      )}

      {output.mediaKind === 'audio' && (
        <audio src={output.url} controls className="w-full" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-3.5">
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
            {output.outputName}
          </p>
          <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
            Input: {formatBytes(output.inputBytes)} → Output: {formatBytes(output.outputBytes)} (
            {diffPct >= 0 ? `${diffPct}% smaller` : `${Math.abs(diffPct)}% larger`})
          </p>
          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            Format: {output.outputFormat}
            {output.durationSec > 0 ? ` · Duration: ${formatDuration(output.durationSec)}` : ''}
            {output.width && output.height ? ` · ${output.width}×${output.height} px` : ''}
          </p>
        </div>

        <a
          href={output.url}
          download={output.outputName}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 text-xs font-semibold text-white transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download {output.outputFormat}</span>
        </a>
      </div>
    </div>
  );
}

// =========================================================================
// Main Category Router
// =========================================================================
export function VideoToolsRunner({tool}: Props) {
  const slug = tool.slug;

  if (slug === 'compress-video') return <CompressVideoRunner key={slug} tool={tool} />;
  if (slug === 'video-to-mp4') return <VideoToMp4Runner key={slug} tool={tool} />;
  if (slug === 'video-to-gif') return <VideoToGifRunner key={slug} tool={tool} />;
  if (slug === 'video-to-audio') return <VideoToAudioRunner key={slug} tool={tool} />;
  if (slug === 'audio-converter') return <AudioConverterRunner key={slug} tool={tool} />;
  return <VideoConverterRunner key={slug} tool={tool} />;
}

// =========================================================================
// 1. COMPRESS VIDEO
// =========================================================================
function CompressVideoRunner({tool}: {tool: Tool}) {
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'video');
  const {output, setOutput} = useTranscodeOutput();

  const [mode, setMode] = useState<'quality' | 'targetSize'>('quality');
  const [crfPreset, setCrfPreset] = useState<24 | 28 | 34>(28);
  const [targetMB, setTargetMB] = useState<number>(5);
  const [maxRes, setMaxRes] = useState<'720p' | '480p' | '360p'>('720p');
  const [keepAudio, setKeepAudio] = useState<boolean>(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = await generateSampleVideoFile('sample-video.webm');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample video.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleCompress = async () => {
    if (!media) {
      setError('Please upload a video or click "Try sample video" above.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const dims = computeTargetDimensions(media.width, media.height, maxRes);
      const inExt = getFileExtension(media.file.name) || 'mp4';
      const inputName = `input_compress.${inExt}`;
      const outputName = 'output_compressed.mp4';

      const args: string[] = ['-i', inputName];
      if (dims?.vf) args.push('-vf', dims.vf);
      args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p');

      if (mode === 'targetSize') {
        const dur = media.durationSec > 0 ? media.durationSec : 10;
        const audioKbps = keepAudio ? 96 : 0;
        const totalKbps = Math.floor((targetMB * 8 * 1024) / dur);
        const videoKbps = Math.max(120, Math.min(2500, totalKbps - audioKbps));
        args.push('-b:v', `${videoKbps}k`, '-maxrate', `${videoKbps}k`, '-bufsize', `${videoKbps * 2}k`);
      } else {
        args.push('-crf', String(crfPreset));
      }

      if (keepAudio) {
        args.push('-c:a', 'aac', '-b:a', '96k');
      } else {
        args.push('-an');
      }
      args.push('-movflags', '+faststart', outputName);

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: 'video/mp4',
        args,
        expectedDurationSec: media.durationSec,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}-compressed.mp4`,
        mime: 'video/mp4',
        outputFormat: 'MP4',
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: media.durationSec,
        width: dims?.width,
        height: dims?.height,
        mediaKind: 'video',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video compression failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Compress MP4, MOV, WebM, and AVI clips in your browser. Limits: 100 MB max · 3 min max · 720p max output.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="video"
        media={media}
        maxMB={maxMB}
        limitSummary="100 MB · 3 min max · 720p max"
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

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
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Quality Preset
            </button>
            <button
              type="button"
              onClick={() => setMode('targetSize')}
              className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'targetSize'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Target MB
            </button>
          </div>
        </div>

        <div>
          {mode === 'quality' ? (
            <>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Compression Strength
              </label>
              <select
                value={crfPreset}
                onChange={(e) => setCrfPreset(Number(e.target.value) as 24 | 28 | 34)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
              >
                <option value={24}>High Quality (Larger)</option>
                <option value={28}>Balanced (Recommended)</option>
                <option value={34}>Maximum Compression (Smallest)</option>
              </select>
            </>
          ) : (
            <>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Size (MB)
              </label>
              <input
                type="number"
                min={1}
                max={95}
                value={targetMB}
                onChange={(e) => setTargetMB(Math.max(1, Math.min(95, Number(e.target.value) || 1)))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono tabular-nums"
              />
            </>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Max Resolution (720p cap)
            </label>
            <select
              value={maxRes}
              onChange={(e) => setMaxRes(e.target.value as '720p' | '480p' | '360p')}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
            >
              <option value="720p">720p max (Keep if ≤720p)</option>
              <option value="480p">480p (Smaller)</option>
              <option value="360p">360p (Smallest)</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={keepAudio}
              onChange={(e) => setKeepAudio(e.target.checked)}
              className="rounded border-slate-300 accent-[#0A8CFF]"
            />
            <span>Keep audio track (AAC)</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleCompress}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
          <span>{processing ? 'Compressing...' : 'Compress Video'}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}

// =========================================================================
// 2. VIDEO TO MP4
// =========================================================================
function VideoToMp4Runner({tool}: {tool: Tool}) {
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'video');
  const {output, setOutput} = useTranscodeOutput();

  const [crf, setCrf] = useState<22 | 26 | 30>(26);
  const [maxRes, setMaxRes] = useState<'720p' | '480p' | '360p'>('720p');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = await generateSampleVideoFile('sample-recording.webm');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample video.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleConvert = async () => {
    if (!media) {
      setError('Please upload a video or click "Try sample video" above.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const dims = computeTargetDimensions(media.width, media.height, maxRes);
      const inExt = getFileExtension(media.file.name) || 'webm';
      const inputName = `input_mp4.${inExt}`;
      const outputName = 'output.mp4';

      const args: string[] = ['-i', inputName];
      if (dims?.vf) args.push('-vf', dims.vf);
      args.push(
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        String(crf),
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-movflags',
        '+faststart',
        outputName,
      );

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: 'video/mp4',
        args,
        expectedDurationSec: media.durationSec,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}.mp4`,
        mime: 'video/mp4',
        outputFormat: 'MP4',
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: media.durationSec,
        width: dims?.width,
        height: dims?.height,
        mediaKind: 'video',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MP4 conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Convert MOV, WebM, AVI, and MKV recordings into H.264 MP4 locally. Limits: 100 MB max · 3 min max · 720p max.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="video"
        media={media}
        maxMB={maxMB}
        limitSummary="100 MB · 3 min max · 720p max"
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            H.264 Video Quality
          </label>
          <select
            value={crf}
            onChange={(e) => setCrf(Number(e.target.value) as 22 | 26 | 30)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
          >
            <option value={22}>High Quality (CRF 22)</option>
            <option value={26}>Standard Balanced (CRF 26)</option>
            <option value={30}>Compact File (CRF 30)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Max Output Resolution (720p cap)
          </label>
          <select
            value={maxRes}
            onChange={(e) => setMaxRes(e.target.value as '720p' | '480p' | '360p')}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
          >
            <option value="720p">720p max (Keep if ≤720p)</option>
            <option value="480p">480p max</option>
            <option value="360p">360p max</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
          <span>{processing ? 'Converting to MP4...' : 'Convert to MP4'}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}

// =========================================================================
// 3. VIDEO TO GIF (10 SEC CLIP MAX)
// =========================================================================
function VideoToGifRunner({tool}: {tool: Tool}) {
  const maxClipSec = tool.maxClipSeconds ?? 10;
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'video');
  const {output, setOutput} = useTranscodeOutput();

  const [startTimeSec, setStartTimeSec] = useState<number>(0);
  const [clipSec, setClipSec] = useState<number>(3);
  const [fps, setFps] = useState<10 | 12 | 15>(12);
  const [gifWidth, setGifWidth] = useState<360 | 480 | 600>(480);
  const [loopForever, setLoopForever] = useState<boolean>(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (media) {
      setStartTimeSec(0);
      const maxAvailable =
        media.durationSec > 0 ? Math.min(maxClipSec, media.durationSec) : maxClipSec;
      setClipSec(Math.max(1, Number(Math.min(5, maxAvailable).toFixed(1))));
    }
  }, [media, maxClipSec]);

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = await generateSampleVideoFile('sample-gif-source.webm');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample video.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleCreateGif = async () => {
    if (!media) {
      setError('Please upload a video or click "Try sample video" above.');
      return;
    }
    if (clipSec <= 0 || clipSec > maxClipSec) {
      setError(`GIF clip duration must be between 0.5 and ${maxClipSec} seconds max.`);
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const safeStart = Math.max(0, startTimeSec);
      const safeClip = Math.max(0.5, Math.min(maxClipSec, clipSec));
      const inExt = getFileExtension(media.file.name) || 'mp4';
      const inputName = `input_gif.${inExt}`;
      const outputName = 'output.gif';

      const vf = `fps=${fps},scale=${gifWidth}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3`;

      const args: string[] = [
        '-ss',
        safeStart.toFixed(2),
        '-t',
        safeClip.toFixed(2),
        '-i',
        inputName,
        '-vf',
        vf,
        '-loop',
        loopForever ? '0' : '-1',
        outputName,
      ];

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: 'image/gif',
        args,
        expectedDurationSec: safeClip,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}-clip.gif`,
        mime: 'image/gif',
        outputFormat: 'GIF',
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: safeClip,
        mediaKind: 'gif',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GIF conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  const maxStart = media && media.durationSec > 0.5 ? Math.max(0, media.durationSec - 0.5) : 180;

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Turn a short clip up to {maxClipSec} seconds into an animated GIF in your browser (the full video is never converted). Limits: 100 MB max · {maxClipSec} sec clip max.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="video"
        media={media}
        maxMB={maxMB}
        limitSummary={`100 MB max · ${maxClipSec} sec clip max`}
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

      {media && (
        <div className="mt-4">
          <video
            src={media.url}
            controls
            playsInline
            className="max-h-60 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950"
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Start Time (sec)
          </label>
          <input
            type="number"
            min={0}
            max={Number(maxStart.toFixed(1))}
            step={0.5}
            value={startTimeSec}
            onChange={(e) =>
              setStartTimeSec(Math.max(0, Math.min(maxStart, Number(e.target.value) || 0)))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Clip Length (1–{maxClipSec} sec max)
          </label>
          <input
            type="number"
            min={0.5}
            max={maxClipSec}
            step={0.5}
            value={clipSec}
            onChange={(e) =>
              setClipSec(Math.max(0.5, Math.min(maxClipSec, Number(e.target.value) || 1)))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Frame Rate & Width
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value) as 10 | 12 | 15)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold"
            >
              <option value={10}>10 fps</option>
              <option value={12}>12 fps</option>
              <option value={15}>15 fps</option>
            </select>
            <select
              value={gifWidth}
              onChange={(e) => setGifWidth(Number(e.target.value) as 360 | 480 | 600)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold"
            >
              <option value={360}>360 px</option>
              <option value={480}>480 px</option>
              <option value={600}>600 px</option>
            </select>
          </div>
        </div>

        <div className="flex items-end pb-1.5">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={loopForever}
              onChange={(e) => setLoopForever(e.target.checked)}
              className="rounded border-slate-300 accent-[#0A8CFF]"
            />
            <span>Loop infinitely</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleCreateGif}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
          <span>{processing ? 'Creating GIF...' : 'Create GIF'}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}

// =========================================================================
// 4. VIDEO TO AUDIO (MP3 OUTPUT)
// =========================================================================
function VideoToAudioRunner({tool}: {tool: Tool}) {
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'video');
  const {output, setOutput} = useTranscodeOutput();

  const [bitrate, setBitrate] = useState<128 | 192 | 256 | 320>(192);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = await generateSampleVideoFile('sample-audio-source.webm');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample video.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleExtract = async () => {
    if (!media) {
      setError('Please upload a video or click "Try sample video" above.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const inExt = getFileExtension(media.file.name) || 'mp4';
      const inputName = `input_v2a.${inExt}`;
      const outputName = 'extracted.mp3';

      const args: string[] = [
        '-i',
        inputName,
        '-vn',
        '-c:a',
        'libmp3lame',
        '-b:a',
        `${bitrate}k`,
        outputName,
      ];

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: 'audio/mpeg',
        args,
        expectedDurationSec: media.durationSec,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}.mp3`,
        mime: 'audio/mpeg',
        outputFormat: 'MP3',
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: media.durationSec,
        mediaKind: 'audio',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio extraction failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Audio is extracted in your browser — your video never leaves your device. Limits: 100 MB max · 3 min max · MP3 output.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="video"
        media={media}
        maxMB={maxMB}
        limitSummary="100 MB · 3 min max · MP3 output"
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

      <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          MP3 Bitrate
        </span>
        <div className="grid grid-cols-4 gap-2 max-w-md">
          {([128, 192, 256, 320] as const).map((kbps) => (
            <button
              key={kbps}
              type="button"
              onClick={() => setBitrate(kbps)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono font-semibold transition-colors ${
                bitrate === kbps
                  ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
              }`}
            >
              {kbps} kbps
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleExtract}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AudioLines className="h-4 w-4" />
          )}
          <span>{processing ? 'Extracting MP3...' : 'Extract MP3 Audio'}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}

// =========================================================================
// 5. AUDIO CONVERTER (MP3 / WAV / OGG · 128–320 KBPS)
// =========================================================================
function AudioConverterRunner({tool}: {tool: Tool}) {
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'audio');
  const {output, setOutput} = useTranscodeOutput();

  const [targetFormat, setTargetFormat] = useState<'mp3' | 'wav' | 'ogg'>('mp3');
  const [bitrate, setBitrate] = useState<128 | 192 | 256 | 320>(192);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = generateSampleAudioFile('sample-audio.wav');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample audio.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleConvert = async () => {
    if (!media) {
      setError('Please upload an audio file or click "Try sample audio" above.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const inExt = getFileExtension(media.file.name) || 'wav';
      const inputName = `input_audio.${inExt}`;
      const outputName = `converted.${targetFormat}`;

      const mimeMap: Record<'mp3' | 'wav' | 'ogg', string> = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        ogg: 'audio/ogg',
      };

      const args: string[] = ['-i', inputName, '-vn'];
      if (targetFormat === 'mp3') {
        args.push('-c:a', 'libmp3lame', '-b:a', `${bitrate}k`);
      } else if (targetFormat === 'ogg') {
        args.push('-c:a', 'libvorbis', '-b:a', `${bitrate}k`);
      } else {
        args.push('-c:a', 'pcm_s16le', '-ar', '44100');
      }
      args.push(outputName);

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: mimeMap[targetFormat],
        args,
        expectedDurationSec: media.durationSec,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}.${targetFormat}`,
        mime: mimeMap[targetFormat],
        outputFormat: targetFormat.toUpperCase(),
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: media.durationSec,
        mediaKind: 'audio',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Convert audio files between MP3, WAV, and OGG locally in your browser. Limits: 100 MB max · Bitrate 128–320 kbps.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="audio"
        media={media}
        maxMB={maxMB}
        limitSummary="100 MB max · Bitrate 128–320 kbps"
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

      {media && (
        <div className="mt-4">
          <audio src={media.url} controls className="w-full" />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Output Format
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['mp3', 'wav', 'ogg'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setTargetFormat(fmt)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase transition-colors ${
                  targetFormat === fmt
                    ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {targetFormat === 'wav' ? 'PCM Lossless Audio' : 'Bitrate (128–320 kbps)'}
          </span>
          {targetFormat === 'wav' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1.5">
              WAV outputs uncompressed 16-bit 44.1 kHz PCM audio.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5">
              {([128, 192, 256, 320] as const).map((kbps) => (
                <button
                  key={kbps}
                  type="button"
                  onClick={() => setBitrate(kbps)}
                  className={`rounded-lg border px-2 py-2 text-xs font-mono font-semibold transition-colors ${
                    bitrate === kbps
                      ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {kbps}k
                </button>
              ))}
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

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AudioLines className="h-4 w-4" />
          )}
          <span>{processing ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}

// =========================================================================
// 6. VIDEO CONVERTER (MP4 / WEBM / MOV)
// =========================================================================
function VideoConverterRunner({tool}: {tool: Tool}) {
  const engine = useFFmpegEngine();
  const {media, error, setError, loadFile, clearMedia, loadingSample, setLoadingSample, maxMB} =
    useMediaFile(tool, 'video');
  const {output, setOutput} = useTranscodeOutput();

  const [targetFormat, setTargetFormat] = useState<'mp4' | 'webm' | 'mov'>('mp4');
  const [qualityTier, setQualityTier] = useState<'high' | 'balanced' | 'compact'>('balanced');
  const [maxRes, setMaxRes] = useState<'720p' | '480p' | '360p'>('720p');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleTrySample = async () => {
    setLoadingSample(true);
    setOutput(null);
    setError(null);
    try {
      const sample = await generateSampleVideoFile('sample-video.webm');
      await loadFile(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate sample video.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleConvert = async () => {
    if (!media) {
      setError('Please upload a video or click "Try sample video" above.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setOutput(null);

    try {
      const dims = computeTargetDimensions(media.width, media.height, maxRes);
      const inExt = getFileExtension(media.file.name) || 'mp4';
      const inputName = `input_vc.${inExt}`;
      const outputName = `converted.${targetFormat}`;

      const mimeMap: Record<'mp4' | 'webm' | 'mov', string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mov: 'video/quicktime',
      };

      const args: string[] = ['-i', inputName];
      if (dims?.vf) args.push('-vf', dims.vf);

      if (targetFormat === 'webm') {
        const vp8Bitrate =
          qualityTier === 'high' ? '1200k' : qualityTier === 'balanced' ? '800k' : '450k';
        const vp8Crf = qualityTier === 'high' ? '10' : qualityTier === 'balanced' ? '18' : '26';
        args.push(
          '-c:v',
          'libvpx',
          '-b:v',
          vp8Bitrate,
          '-crf',
          vp8Crf,
          '-deadline',
          'realtime',
          '-cpu-used',
          '4',
          '-c:a',
          'libvorbis',
          '-b:a',
          '128k',
          outputName,
        );
      } else {
        const x264Crf = qualityTier === 'high' ? '22' : qualityTier === 'balanced' ? '26' : '31';
        args.push(
          '-c:v',
          'libx264',
          '-preset',
          'ultrafast',
          '-crf',
          x264Crf,
          '-pix_fmt',
          'yuv420p',
          '-c:a',
          'aac',
          '-b:a',
          '128k',
        );
        if (targetFormat === 'mov') {
          args.push('-f', 'mov');
        } else {
          args.push('-movflags', '+faststart');
        }
        args.push(outputName);
      }

      const res = await runFFmpegJob({
        inputFile: media.file,
        inputName,
        outputName,
        outputMime: mimeMap[targetFormat],
        args,
        expectedDurationSec: media.durationSec,
        onStatus: setStatusText,
        onProgress: setProgress,
      });

      setOutput({
        url: res.url,
        outputName: `${stripExtension(media.file.name)}.${targetFormat}`,
        mime: mimeMap[targetFormat],
        outputFormat: targetFormat.toUpperCase(),
        inputBytes: media.file.size,
        outputBytes: res.bytes,
        durationSec: media.durationSec,
        width: dims?.width,
        height: dims?.height,
        mediaKind: 'video',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          {tool.name} Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Convert video clips between MP4, WebM, and MOV directly in your browser. Limits: 100 MB max · 3 min max · 720p max.
        </p>
      </div>

      <FFmpegStatusBar
        ready={engine.engineReady}
        loading={engine.engineLoading}
        status={engine.engineStatus}
        error={engine.engineError}
        onRetry={engine.retryEngine}
      />

      <MediaUploadZone
        tool={tool}
        kind="video"
        media={media}
        maxMB={maxMB}
        limitSummary="100 MB · 3 min max · 720p max"
        loadingSample={loadingSample}
        onSelectFile={(f) => {
          setOutput(null);
          void loadFile(f);
        }}
        onTrySample={() => void handleTrySample()}
        onClear={() => {
          setOutput(null);
          clearMedia();
        }}
      />

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Output Format
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['mp4', 'webm', 'mov'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setTargetFormat(fmt)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold uppercase transition-colors ${
                  targetFormat === fmt
                    ? 'border-[#0A8CFF] bg-[#0A8CFF] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Quality Preset
          </label>
          <select
            value={qualityTier}
            onChange={(e) => setQualityTier(e.target.value as 'high' | 'balanced' | 'compact')}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
          >
            <option value="high">High Quality</option>
            <option value="balanced">Balanced (Recommended)</option>
            <option value="compact">Compact Size</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Max Resolution (720p cap)
          </label>
          <select
            value={maxRes}
            onChange={(e) => setMaxRes(e.target.value as '720p' | '480p' | '360p')}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold"
          >
            <option value="720p">720p max</option>
            <option value="480p">480p max</option>
            <option value="360p">360p max</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <TranscodeProgressBar processing={processing} progress={progress} status={statusText} />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          disabled={processing || !media}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-50 px-6 text-sm font-semibold text-white transition-colors"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
          <span>{processing ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}</span>
        </button>
      </div>

      {output && media && <TranscodeResultCard output={output} inputFormat={media.inputFormat} />}
    </section>
  );
}
