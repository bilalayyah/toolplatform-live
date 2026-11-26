import type {FFmpeg} from '@ffmpeg/ffmpeg';
import {SITE_CONFIG} from '../config/site';

export type VideoToolId = keyof typeof SITE_CONFIG.videoLimits;

export interface FfmpegPhase2Spec {
  engine: 'ffmpeg-wasm-opensource';
  runtime: 'browser';
  paidApi: false;
  toolId: VideoToolId;
  limits: (typeof SITE_CONFIG.videoLimits)[VideoToolId];
}

/**
 * Lazy-loaded video processing specification & FFmpeg WebAssembly runner.
 * Imported dynamically ONLY when a video tool route opens so non-video routes
 * (homepage, All Tools, PDF tools, Image tools) never load FFmpeg code.
 */
export function getVideoProcessingSpec(toolId: VideoToolId): FfmpegPhase2Spec {
  return {
    engine: 'ffmpeg-wasm-opensource',
    runtime: 'browser',
    paidApi: false,
    toolId,
    limits: SITE_CONFIG.videoLimits[toolId],
  };
}

const CORE_CDN_BASES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm',
  'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm',
] as const;

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let jobQueue: Promise<void> = Promise.resolve();

export function isFFmpegReady(): boolean {
  return Boolean(ffmpegInstance?.loaded);
}

export async function loadFFmpegEngine(
  onStatus?: (status: string) => void,
): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) {
    return ffmpegInstance;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    onStatus?.('Loading FFmpeg WebAssembly modules...');
    const [{FFmpeg}, {toBlobURL}] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util'),
    ]);

    const instance = new FFmpeg();
    let lastErr: unknown = null;

    for (const baseURL of CORE_CDN_BASES) {
      try {
        onStatus?.('Fetching open-source FFmpeg core (~30 MB, cached in browser)...');
        const [coreURL, wasmURL] = await Promise.all([
          toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        ]);
        onStatus?.('Initializing FFmpeg WebAssembly worker...');
        await instance.load({coreURL, wasmURL});
        ffmpegInstance = instance;
        return instance;
      } catch (err) {
        lastErr = err;
      }
    }

    loadPromise = null;
    throw new Error(
      lastErr instanceof Error
        ? `Could not initialize FFmpeg WebAssembly: ${lastErr.message}`
        : 'Could not initialize FFmpeg WebAssembly in your browser.',
    );
  })();

  return loadPromise;
}

export interface FFmpegJobOptions {
  inputFile: File;
  inputName: string;
  outputName: string;
  outputMime: string;
  args: string[];
  expectedDurationSec?: number;
  onStatus?: (status: string) => void;
  onProgress?: (percent: number) => void;
}

export interface FFmpegJobResult {
  blob: Blob;
  url: string;
  bytes: number;
}

export function runFFmpegJob(options: FFmpegJobOptions): Promise<FFmpegJobResult> {
  const execute = async (): Promise<FFmpegJobResult> => {
    const ffmpeg = await loadFFmpegEngine(options.onStatus);
    const {fetchFile} = await import('@ffmpeg/util');

    const logs: string[] = [];
    const handleLog = ({message}: {type: string; message: string}) => {
      if (message) {
        logs.push(message);
        if (logs.length > 40) logs.shift();
      }
    };

    const handleProgress = ({progress, time}: {progress: number; time: number}) => {
      let pct = Number.isFinite(progress) ? Math.round(progress * 100) : 0;
      if (
        (!Number.isFinite(progress) || progress <= 0 || progress > 1.2) &&
        options.expectedDurationSec &&
        options.expectedDurationSec > 0 &&
        Number.isFinite(time) &&
        time > 0
      ) {
        pct = Math.round((time / 1_000_000 / options.expectedDurationSec) * 100);
      }
      options.onProgress?.(Math.max(1, Math.min(99, pct)));
    };

    ffmpeg.on('log', handleLog);
    ffmpeg.on('progress', handleProgress);

    try {
      options.onStatus?.('Reading media into FFmpeg memory...');
      options.onProgress?.(2);
      const inputBytes = await fetchFile(options.inputFile);
      await ffmpeg.writeFile(options.inputName, inputBytes);

      options.onStatus?.('Transcoding in your browser...');
      const exitCode = await ffmpeg.exec(options.args);

      if (exitCode !== 0) {
        const joined = logs.join('\n');
        if (/does not contain any stream|Output file #0 does not contain/i.test(joined)) {
          throw new Error(
            'No audio track was detected in this file. Please choose a video with an audio track.',
          );
        }
        const tail = logs.slice(-4).join(' ').trim();
        throw new Error(
          tail
            ? `FFmpeg transcoding failed: ${tail}`
            : `FFmpeg exited with code ${exitCode}.`,
        );
      }

      options.onStatus?.('Preparing download file...');
      const rawOutput = await ffmpeg.readFile(options.outputName);
      const bytes =
        rawOutput instanceof Uint8Array
          ? new Uint8Array(rawOutput)
          : new TextEncoder().encode(String(rawOutput));

      if (bytes.byteLength === 0) {
        throw new Error('FFmpeg produced an empty output file.');
      }

      const blob = new Blob([bytes], {type: options.outputMime});
      const url = URL.createObjectURL(blob);
      options.onProgress?.(100);

      return {blob, url, bytes: blob.size};
    } finally {
      ffmpeg.off('log', handleLog);
      ffmpeg.off('progress', handleProgress);
      await Promise.allSettled([
        ffmpeg.deleteFile(options.inputName),
        ffmpeg.deleteFile(options.outputName),
      ]);
    }
  };

  const next = jobQueue.then(execute, execute);
  jobQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export interface MediaMetadata {
  durationSec: number;
  width: number;
  height: number;
}

export function probeMediaMetadata(
  file: File,
  kind: 'video' | 'audio',
): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(kind);
    el.preload = 'metadata';

    let settled = false;
    const cleanup = () => {
      el.removeAttribute('src');
      el.load();
      URL.revokeObjectURL(url);
    };

    const finish = (dur: number, width = 0, height = 0) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({
        durationSec: Number.isFinite(dur) && dur > 0 ? dur : 0,
        width,
        height,
      });
    };

    const timeout = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error(`Timed out reading ${kind} metadata.`));
      }
    }, 8000);

    el.onloadedmetadata = () => {
      const width = kind === 'video' ? (el as HTMLVideoElement).videoWidth : 0;
      const height = kind === 'video' ? (el as HTMLVideoElement).videoHeight : 0;

      if (el.duration === Infinity || !Number.isFinite(el.duration)) {
        // Chromium MediaRecorder WebM blobs report Infinity until seeked once
        el.ontimeupdate = () => {
          el.ontimeupdate = null;
          window.clearTimeout(timeout);
          finish(el.duration, width, height);
        };
        el.currentTime = 1e9;
      } else {
        window.clearTimeout(timeout);
        finish(el.duration, width, height);
      }
    };

    el.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      cleanup();
      reject(
        new Error(
          `Could not read "${file.name}". Check that it is a valid ${kind} file supported by your browser.`,
        ),
      );
    };

    el.src = url;
  });
}

/**
 * Generates a real ~3.2s animated 640x360 test video in the browser using
 * HTMLCanvasElement + Web Audio MediaStream + MediaRecorder.
 * Includes an audible gentle 3-note chime so Video to Audio also works cleanly.
 */
export async function generateSampleVideoFile(
  fileName = 'sample-clip.webm',
): Promise<File> {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder is not supported in this browser.');
  }

  const width = 640;
  const height = 360;
  const durationMs = 3200;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const canvasStream = canvas.captureStream(30);
  const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

  let audioCtx: AudioContext | null = null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();
      const now = audioCtx.currentTime;
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.9);
        gain.gain.setValueAtTime(0.001, now + idx * 0.9);
        gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.9 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.9 + 0.85);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.9);
        osc.stop(now + idx * 0.9 + 0.88);
      });
      tracks.push(...dest.stream.getAudioTracks());
    }
  } catch {
    // Proceed with video-only sample if Web Audio creation fails
  }

  const combinedStream = new MediaStream(tracks);
  const mimeCandidates = [
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm',
    'video/mp4',
  ];
  const chosenMime =
    mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';

  const recorder = chosenMime
    ? new MediaRecorder(combinedStream, {
        mimeType: chosenMime,
        videoBitsPerSecond: 900_000,
      })
    : new MediaRecorder(combinedStream);

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  const startTime = performance.now();
  let rafId = 0;

  const drawFrame = () => {
    const elapsed = performance.now() - startTime;
    const t = Math.min(1, elapsed / durationMs);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#1E3A8A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Animated moving circle
    const orbX = 80 + t * (width - 160);
    const orbY = height * 0.52 + Math.sin(t * Math.PI * 4) * 36;
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(orbX, orbY, 26, 0, Math.PI * 2);
    ctx.fill();

    // Header text & timer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ToolPlatform Sample Video', width / 2, 72);

    ctx.fillStyle = '#BAE6FD';
    ctx.font = '18px monospace';
    ctx.fillText(
      `640x360 · ${(elapsed / 1000).toFixed(1)}s / 3.2s`,
      width / 2,
      110,
    );

    // Progress bar at bottom
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(60, height - 56, width - 120, 14);
    ctx.fillStyle = '#0A8CFF';
    ctx.fillRect(60, height - 56, (width - 120) * t, 14);

    if (elapsed < durationMs) {
      rafId = requestAnimationFrame(drawFrame);
    }
  };

  recorder.start(200);
  drawFrame();

  await new Promise((r) => setTimeout(r, durationMs));
  cancelAnimationFrame(rafId);

  if (recorder.state !== 'inactive') {
    recorder.stop();
  }
  await stopped;
  combinedStream.getTracks().forEach((tr) => tr.stop());
  if (audioCtx) {
    await audioCtx.close().catch(() => undefined);
  }

  const finalMime = recorder.mimeType || chosenMime || 'video/webm';
  const ext = finalMime.includes('mp4') ? 'mp4' : 'webm';
  const resolvedName = fileName.replace(/\.\w+$/, `.${ext}`);
  const blob = new Blob(chunks, {type: finalMime});
  return new File([blob], resolvedName, {type: finalMime});
}

/**
 * Generates a real 3-second 16-bit PCM WAV sample audio file in the browser
 * for testing Audio Converter with zero files on disk.
 */
export function generateSampleAudioFile(fileName = 'sample-audio.wav'): File {
  const sampleRate = 44100;
  const durationSec = 3.0;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset + i, s.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  const notes = [261.63, 329.63, 392.0, 523.25];
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(notes.length - 1, Math.floor(t / 0.75));
    const localT = t - noteIdx * 0.75;
    const env = Math.min(1, localT * 18) * Math.exp(-localT * 3.2);
    const sample = Math.sin(2 * Math.PI * notes[noteIdx] * t) * 0.45 * env;
    view.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, sample * 32767)), true);
  }

  const blob = new Blob([buffer], {type: 'audio/wav'});
  return new File([blob], fileName, {type: 'audio/wav'});
}
