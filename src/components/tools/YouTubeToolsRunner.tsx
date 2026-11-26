import React, {useState, useMemo} from 'react';
import {
  Copy,
  Check,
  Youtube,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  Palette,
  RotateCcw,
  Upload,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Pencil,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  extractYouTubeInfo,
  validateYouTubeHandleFormat,
  calculateYouTubeEarnings,
  formatSecondsToHMS,
  parseDurationToSeconds,
  generateYouTubeTags,
  generateYouTubeHashtags,
  generateYouTubeTitles,
  generateYouTubeHooks,
  generateYouTubeChannelNames,
  generateYouTubeVideoIdeas,
  generateYouTubeShortsIdeas,
  generateYouTubeDescription,
  generateYouTubeScript,
  parseYouTubeChapters,
  calculateAspectRatio,
  estimateVideoFileSize,
  countCodePoints,
  sliceCodePoints,
} from './youtubeHelpers';

interface Props {
  tool: Tool;
}

export function YouTubeToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Workspace Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10 text-red-600 dark:text-red-500">
            <Youtube className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · Zero AI · Runs locally in your browser
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* 1. URL & Video Link Tools */}
        {tool.slug === 'youtube-video-id-extractor' && <YouTubeIdExtractor onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-url-parser' && <YouTubeUrlParser onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-embed-code-generator' && <YouTubeEmbedGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-timestamp-link-generator' && <YouTubeTimestampGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-handle-format-validator' && <YouTubeHandleValidator onCopy={copyText} copiedKey={copiedKey} />}

        {/* 2. Thumbnail & Canvas Tools */}
        {tool.slug === 'youtube-thumbnail-preview' && <YouTubeThumbnailPreview onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-thumbnail-size-checker' && <YouTubeThumbnailSizeChecker />}
        {tool.slug === 'youtube-thumbnail-resizer' && <YouTubeThumbnailResizer />}
        {tool.slug === 'youtube-thumbnail-compressor' && <YouTubeThumbnailCompressor />}
        {tool.slug === 'youtube-thumbnail-color-extractor' && <YouTubeThumbnailColorExtractor onCopy={copyText} copiedKey={copiedKey} />}

        {/* 3. Character Counters & Constraints */}
        {tool.slug === 'youtube-title-character-counter' && <YouTubeTitleCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-description-character-counter' && <YouTubeDescriptionCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-tags-character-counter' && <YouTubeTagsCounter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-hashtag-counter' && <YouTubeHashtagCounter onCopy={copyText} copiedKey={copiedKey} />}

        {/* 4. Creative & Template Generators */}
        {tool.slug === 'youtube-tag-generator' && <YouTubeTagGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-hashtag-generator' && <YouTubeHashtagGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-title-generator' && <YouTubeTitleGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-description-generator' && <YouTubeDescriptionGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-channel-name-generator' && <YouTubeChannelNameGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-username-generator' && <YouTubeUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-script-generator' && <YouTubeScriptGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-hook-generator' && <YouTubeHookGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-video-idea-generator' && <YouTubeVideoIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-shorts-idea-generator' && <YouTubeShortsIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-pinned-comment-generator' && <YouTubePinnedCommentGenerator onCopy={copyText} copiedKey={copiedKey} />}

        {/* 5. Production & Planning Tools */}
        {tool.slug === 'youtube-chapter-generator' && <YouTubeChapterGenerator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-upload-checklist' && <YouTubeUploadChecklist />}
        {tool.slug === 'youtube-content-calendar-generator' && <YouTubeContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} />}

        {/* 6. Growth & Monetization Calculators */}
        {tool.slug === 'youtube-earnings-calculator' && <YouTubeEarningsCalculator />}
        {tool.slug === 'youtube-rpm-calculator' && <YouTubeRpmCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-cpm-calculator' && <YouTubeCpmCalculator onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'youtube-watch-hours-calculator' && <YouTubeWatchHoursCalculator />}
        {tool.slug === 'youtube-subscriber-goal-calculator' && <YouTubeSubGoalCalculator />}
        {tool.slug === 'youtube-engagement-rate-calculator' && <YouTubeEngagementCalculator />}
        {tool.slug === 'youtube-playlist-duration-calculator' && <YouTubePlaylistDurationCalculator />}
        {tool.slug === 'youtube-video-aspect-ratio-checker' && <YouTubeAspectRatioChecker />}
        {tool.slug === 'youtube-video-file-size-estimator' && <YouTubeFileSizeEstimator />}
      </div>
    </div>
  );
}

// ============================================================================
// 1. URL & LINK TOOLS
// ============================================================================

function YouTubeIdExtractor({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [input, setInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const parsed = useMemo(() => extractYouTubeInfo(input), [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Paste YouTube URL or 11-Character Video ID
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {parsed.valid && parsed.videoId ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Extracted 11-Character Video ID</span>
              <div className="text-xl font-mono font-bold text-red-600 dark:text-red-400">{parsed.videoId}</div>
            </div>
            <button
              type="button"
              onClick={() => onCopy(parsed.videoId || '', 'yt-id')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
            >
              {copiedKey === 'yt-id' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'yt-id' ? 'Copied ID' : 'Copy ID'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="truncate mr-2 font-mono">{parsed.cleanWatchUrl}</span>
              <button
                type="button"
                aria-label="Copy clean watch URL"
                onClick={() => onCopy(parsed.cleanWatchUrl || '', 'yt-clean')}
                className="text-slate-500 hover:text-red-600 shrink-0"
              >
                {copiedKey === 'yt-clean' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="truncate mr-2 font-mono">{parsed.shortUrl}</span>
              <button
                type="button"
                aria-label="Copy short URL"
                onClick={() => onCopy(parsed.shortUrl || '', 'yt-short')}
                className="text-slate-500 hover:text-red-600 shrink-0"
              >
                {copiedKey === 'yt-short' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {parsed.error || 'No 11-character video ID found in this YouTube link.'}
        </div>
      )}
    </div>
  );
}

function YouTubeUrlParser({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL9tY0BWXOZFu8M&index=2&t=42s&si=tracking123');
  const parsed = useMemo(() => extractYouTubeInfo(urlInput), [urlInput]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter YouTube URL to Inspect
        </label>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {parsed.valid ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Value</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">URL Type</td>
                <td className="py-2.5 px-4 capitalize font-sans">{parsed.urlType}</td>
                <td className="py-2.5 px-4 text-right">—</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Video ID</td>
                <td className="py-2.5 px-4 font-bold text-red-600 dark:text-red-400">{parsed.videoId || 'None'}</td>
                <td className="py-2.5 px-4 text-right">
                  {parsed.videoId ? (
                    <button
                      type="button"
                      onClick={() => onCopy(parsed.videoId || '', 'parse-vid')}
                      className="text-slate-500 hover:text-red-600"
                    >
                      {copiedKey === 'parse-vid' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  ) : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Playlist ID &amp; Index</td>
                <td className="py-2.5 px-4">
                  {parsed.playlistId
                    ? `${parsed.playlistId}${parsed.playlistIndex ? ` (index #${parsed.playlistIndex})` : ''}`
                    : <span className="font-sans text-slate-400">None</span>}
                </td>
                <td className="py-2.5 px-4 text-right">
                  {parsed.playlistId ? (
                    <button
                      type="button"
                      onClick={() => onCopy(parsed.playlistId || '', 'parse-list')}
                      className="text-slate-500 hover:text-red-600"
                    >
                      {copiedKey === 'parse-list' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  ) : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Start Timestamp</td>
                <td className="py-2.5 px-4 font-sans">
                  {parsed.startSeconds !== null ? `${parsed.startSeconds}s (${formatSecondsToHMS(parsed.startSeconds)})` : 'None (Starts at 0:00)'}
                </td>
                <td className="py-2.5 px-4 text-right">—</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Clean Watch URL</td>
                <td className="py-2.5 px-4 truncate max-w-xs">{parsed.cleanWatchUrl || 'None'}</td>
                <td className="py-2.5 px-4 text-right">
                  {parsed.cleanWatchUrl ? (
                    <button
                      type="button"
                      onClick={() => onCopy(parsed.cleanWatchUrl || '', 'parse-watch')}
                      className="text-slate-500 hover:text-red-600"
                    >
                      {copiedKey === 'parse-watch' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  ) : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Clean Short URL</td>
                <td className="py-2.5 px-4 truncate max-w-xs">{parsed.shortUrl || 'None'}</td>
                <td className="py-2.5 px-4 text-right">
                  {parsed.shortUrl ? (
                    <button
                      type="button"
                      onClick={() => onCopy(parsed.shortUrl || '', 'parse-short')}
                      className="text-slate-500 hover:text-red-600"
                    >
                      {copiedKey === 'parse-short' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  ) : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-white">Clean Embed URL</td>
                <td className="py-2.5 px-4 truncate max-w-xs">{parsed.embedUrl || 'None'}</td>
                <td className="py-2.5 px-4 text-right">
                  {parsed.embedUrl ? (
                    <button
                      type="button"
                      onClick={() => onCopy(parsed.embedUrl || '', 'parse-embed')}
                      className="text-slate-500 hover:text-red-600"
                    >
                      {copiedKey === 'parse-embed' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  ) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {parsed.error}
        </div>
      )}
    </div>
  );
}

function YouTubeEmbedGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [videoInput, setVideoInput] = useState('dQw4w9WgXcQ');
  const [autoplay, setAutoplay] = useState(false);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [startSec, setStartSec] = useState('');
  const [endSec, setEndSec] = useState('');

  const parsed = useMemo(() => extractYouTubeInfo(videoInput), [videoInput]);
  const hasValidVideo = parsed.valid && Boolean(parsed.videoId);

  const timeValidationError = useMemo(() => {
    const s = startSec.trim() ? parseInt(startSec, 10) : null;
    const e = endSec.trim() ? parseInt(endSec, 10) : null;
    if (s !== null && (isNaN(s) || s < 0)) return 'Start time cannot be negative.';
    if (e !== null && (isNaN(e) || e < 0)) return 'End time cannot be negative.';
    if (s !== null && e !== null && e > 0 && e <= s) return 'End time must be greater than start time.';
    return null;
  }, [startSec, endSec]);

  const embedCode = useMemo(() => {
    if (!hasValidVideo || !parsed.videoId) return '';
    const videoId = parsed.videoId;
    const domain = privacyMode ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (mute) params.set('mute', '1');
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', videoId);
    }
    const s = parseInt(startSec, 10);
    if (!isNaN(s) && s > 0) params.set('start', s.toString());
    const e = parseInt(endSec, 10);
    if (!isNaN(e) && e > 0 && (isNaN(s) || e > s)) params.set('end', e.toString());

    const qs = params.toString() ? `?${params.toString()}` : '';
    const src = `${domain}/embed/${videoId}${qs}`;

    const iframe = `<iframe ${responsive ? 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"' : 'width="560" height="315" frameborder="0"'} src="${src}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    if (responsive) {
      return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">\n  ${iframe}\n</div>`;
    }
    return iframe;
  }, [hasValidVideo, parsed.videoId, autoplay, mute, loop, privacyMode, responsive, startSec, endSec]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Video Link or 11-Char ID
          </label>
          <input
            type="text"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Start Time (Seconds)
          </label>
          <input
            type="number"
            min="0"
            value={startSec}
            onChange={(e) => setStartSec(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            End Time (Seconds)
          </label>
          <input
            type="number"
            min="0"
            value={endSec}
            onChange={(e) => setEndSec(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={responsive} onChange={(e) => setResponsive(e.target.checked)} />
          <span>Responsive 16:9 Wrapper</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={privacyMode} onChange={(e) => setPrivacyMode(e.target.checked)} />
          <span>Enhanced Privacy Mode (youtube-nocookie.com)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
          <span>Autoplay</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={mute} onChange={(e) => setMute(e.target.checked)} />
          <span>Mute Audio</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
          <span>Loop Video</span>
        </label>
      </div>

      {!hasValidVideo ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {parsed.error || 'Please enter a valid YouTube link or 11-character video ID.'}
        </div>
      ) : timeValidationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300">
          {timeValidationError}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Generated Embed HTML (Template-Based · Zero AI)
            </span>
            <button
              type="button"
              onClick={() => onCopy(embedCode, 'yt-embed-html')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              {copiedKey === 'yt-embed-html' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'yt-embed-html' ? 'Copied HTML' : 'Copy HTML Code'}
            </button>
          </div>
          <textarea
            readOnly
            rows={4}
            value={embedCode}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs p-3 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

function YouTubeTimestampGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [hrs, setHrs] = useState('0');
  const [mins, setMins] = useState('1');
  const [secs, setSecs] = useState('30');

  const parsed = useMemo(() => extractYouTubeInfo(url), [url]);
  const hasValidVideo = parsed.valid && Boolean(parsed.videoId);

  const timeParsed = useMemo(() => {
    const h = hrs.trim() === '' ? 0 : Number(hrs);
    const m = mins.trim() === '' ? 0 : Number(mins);
    const s = secs.trim() === '' ? 0 : Number(secs);
    if ([h, m, s].some((n) => isNaN(n) || n < 0 || !Number.isFinite(n))) {
      return {valid: false, totalSeconds: 0, error: 'Hours, minutes, and seconds must be zero or positive numbers.'};
    }
    return {valid: true, totalSeconds: Math.round(h * 3600 + m * 60 + s), error: null};
  }, [hrs, mins, secs]);

  const timestampWatchUrl = hasValidVideo ? `https://www.youtube.com/watch?v=${parsed.videoId}&t=${timeParsed.totalSeconds}s` : '';
  const timestampShortUrl = hasValidVideo ? `https://youtu.be/${parsed.videoId}?t=${timeParsed.totalSeconds}` : '';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          YouTube Video Link or ID
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Hours
          </label>
          <input
            type="number"
            min="0"
            value={hrs}
            onChange={(e) => setHrs(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Minutes
          </label>
          <input
            type="number"
            min="0"
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Seconds
          </label>
          <input
            type="number"
            min="0"
            value={secs}
            onChange={(e) => setSecs(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {!hasValidVideo ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {parsed.error || 'Please enter a valid YouTube link or 11-character video ID.'}
        </div>
      ) : !timeParsed.valid ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300">
          {timeParsed.error}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Target Time: {formatSecondsToHMS(timeParsed.totalSeconds)} ({timeParsed.totalSeconds.toLocaleString()} total seconds)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-mono truncate mr-2">{timestampShortUrl}</span>
              <button
                type="button"
                onClick={() => onCopy(timestampShortUrl, 'ts-short')}
                className="inline-flex items-center gap-1 text-red-600 font-semibold shrink-0"
              >
                {copiedKey === 'ts-short' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                Short Link
              </button>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-mono truncate mr-2">{timestampWatchUrl}</span>
              <button
                type="button"
                onClick={() => onCopy(timestampWatchUrl, 'ts-watch')}
                className="inline-flex items-center gap-1 text-red-600 font-semibold shrink-0"
              >
                {copiedKey === 'ts-watch' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                Watch Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeHandleValidator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [handle, setHandle] = useState('@creator_hub');
  const res = useMemo(() => validateYouTubeHandleFormat(handle), [handle]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter YouTube @handle to Validate Syntax
        </label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@myhandle"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Format Status:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${res.valid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'}`}>
              {res.valid ? 'VALID FORMAT' : 'INVALID FORMAT'}
            </span>
          </div>
          {res.valid && (
            <button
              type="button"
              onClick={() => onCopy(`https://www.youtube.com/${res.normalized}`, 'yt-handle')}
              className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold"
            >
              {copiedKey === 'yt-handle' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              Copy youtube.com/{res.normalized}
            </button>
          )}
        </div>

        {res.error && (
          <div role="alert" className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300">
            {res.error}
          </div>
        )}

        {res.checks.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            {res.checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {chk.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                )}
                <span className={chk.passed ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                  {chk.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          * Note: Validates YouTube @handle syntax rules locally only. Live handle claim availability must be checked on YouTube.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 2. THUMBNAIL & CANVAS TOOLS
// ============================================================================

function YouTubeThumbnailPreview({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [videoInput, setVideoInput] = useState('dQw4w9WgXcQ');
  const [uploadedThumb, setUploadedThumb] = useState<{src: string; name: string} | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [title, setTitle] = useState('How to Design High-Contrast YouTube Thumbnails That Stand Out');
  const [channelName, setChannelName] = useState('Creator Studio');
  const [duration, setDuration] = useState('12:34');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const parsed = useMemo(() => extractYouTubeInfo(videoInput), [videoInput]);
  const hasValidVideo = parsed.valid && Boolean(parsed.videoId);
  const titleChars = countCodePoints(title);
  const isOver100 = titleChars > 100;
  const isMobileTruncated = titleChars > 60;

  const activeThumbUrl = uploadedThumb
    ? uploadedThumb.src
    : hasValidVideo
      ? `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`
      : '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid JPG, PNG, or WebP image file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image exceeds the 20 MB local preview limit.');
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedThumb({src: reader.result, name: file.name});
      }
    };
    reader.onerror = () => setUploadError('Could not read the selected image file.');
    reader.readAsDataURL(file);
  };

  const resolutions = hasValidVideo && parsed.videoId
    ? [
        {name: 'Max Resolution (1280×720)', key: 'maxresdefault', url: `https://i.ytimg.com/vi/${parsed.videoId}/maxresdefault.jpg`},
        {name: 'Standard Definition (640×480)', key: 'sddefault', url: `https://i.ytimg.com/vi/${parsed.videoId}/sddefault.jpg`},
        {name: 'High Quality (480×360)', key: 'hqdefault', url: `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`},
        {name: 'Medium Quality (320×180)', key: 'mqdefault', url: `https://i.ytimg.com/vi/${parsed.videoId}/mqdefault.jpg`},
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        Simulated YouTube feed mockup preview only — local images stay in your browser and public links load official i.ytimg.com thumbnails. Not affiliated with YouTube.
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Upload Local Thumbnail (JPG, PNG, WebP · max 20 MB)
            </label>
            <div className="relative rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4 text-center hover:border-red-500 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleImageUpload}
                aria-label="Upload local thumbnail image"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-5 w-5 text-red-500 mx-auto mb-1 pointer-events-none" />
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none">
                {uploadedThumb ? `Loaded: ${uploadedThumb.name}` : 'Click or drop a local thumbnail image'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 pointer-events-none">
                Processed locally inside your browser
              </div>
            </div>
            {uploadedThumb && (
              <button
                type="button"
                onClick={() => setUploadedThumb(null)}
                className="mt-1.5 text-xs font-semibold text-red-600 hover:underline"
              >
                Clear uploaded image &amp; switch back to Video ID
              </button>
            )}
            {uploadError && (
              <div role="alert" className="mt-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {uploadError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Or Load Public Video URL / 11-Char ID
            </label>
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
            />
            {!uploadedThumb && !hasValidVideo && (
              <div role="alert" className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                {parsed.error || 'Enter a valid YouTube link/ID or upload a local thumbnail image.'}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Draft Video Title
              </label>
              <span className={`text-xs font-mono font-bold ${isOver100 ? 'text-rose-600' : isMobileTruncated ? 'text-amber-600' : 'text-emerald-600'}`}>
                {titleChars} / 100 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title to test truncation..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white"
            />
            <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded font-medium ${isOver100 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                {isOver100 ? 'Exceeds 100-char limit' : 'Within 100-char limit'}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${isMobileTruncated ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                {isMobileTruncated ? 'Mobile cutoff risk (>60 chars)' : 'Visible on Mobile (≤60 chars)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Duration Overlay
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="12:34"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feed Mockup Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Feed Layout Mockup
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold ${deviceView === 'desktop' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop Feed
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold ${deviceView === 'mobile' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Feed
              </button>
            </div>
            <button
              type="button"
              onClick={() => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {themeMode === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              {themeMode === 'light' ? 'Dark Card' : 'Light Card'}
            </button>
          </div>
        </div>

        {/* Rendered Mockup */}
        {activeThumbUrl ? (
          <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex justify-center ${themeMode === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-white text-slate-900'}`}>
            {deviceView === 'desktop' ? (
              <div className="w-full max-w-sm space-y-2.5">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={activeThumbUrl}
                    alt="Desktop thumbnail feed preview"
                    className="w-full h-full object-cover"
                  />
                  {duration.trim() && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                      {duration}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(channelName.trim()[0] || 'C').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                      {title.trim() || 'Untitled Video'}
                    </h3>
                    <p className={`text-xs mt-1 ${themeMode === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>
                      {channelName.trim() || 'Channel Name'}
                    </p>
                    <p className={`text-xs ${themeMode === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>
                      18K views · 3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`w-full max-w-[340px] rounded-2xl border p-3 space-y-2.5 ${themeMode === 'dark' ? 'border-neutral-800 bg-[#141414]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={activeThumbUrl}
                    alt="Mobile thumbnail feed preview"
                    className="w-full h-full object-cover"
                  />
                  {duration.trim() && (
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                      {duration}
                    </span>
                  )}
                </div>
                <div className="flex gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(channelName.trim()[0] || 'C').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold leading-snug line-clamp-2">
                      {isMobileTruncated ? `${sliceCodePoints(title, 58)}...` : (title.trim() || 'Untitled Video')}
                    </h3>
                    <p className={`text-[11px] mt-0.5 truncate ${themeMode === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>
                      {channelName.trim() || 'Channel Name'} · 18K views · 3h ago
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
            Upload a local thumbnail image or enter a valid YouTube video URL/ID above to render the feed mockup.
          </div>
        )}
      </div>

      {/* Public i.ytimg.com Resolution Cards */}
      {resolutions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Public YouTube CDN Thumbnail URLs (i.ytimg.com)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resolutions.map((res) => (
              <div key={res.key} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={res.url}
                    alt={res.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fallbackApplied && parsed.videoId) {
                        img.dataset.fallbackApplied = '1';
                        img.src = `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`;
                      }
                    }}
                  />
                </div>
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{res.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(res.url, res.key)}
                      className="text-slate-500 hover:text-red-600 flex items-center gap-1"
                    >
                      {copiedKey === res.key ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy URL
                    </button>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${res.name} thumbnail`}
                      className="text-slate-500 hover:text-red-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeThumbnailSizeChecker() {
  const [stats, setStats] = useState<{
    width: number;
    height: number;
    sizeKB: number;
    sizeMB: number;
    format: string;
    is16x9: boolean;
    isRecommendedDim: boolean;
    under2MB: boolean;
    name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid JPG, PNG, or WebP image file.');
      setStats(null);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File exceeds the 20 MB browser limit.');
      setStats(null);
      return;
    }
    setError(null);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = h > 0 ? w / h : 0;
      const is16x9 = Math.abs(ratio - 16 / 9) < 0.05;
      const isRecommendedDim = w >= 1280 && h >= 720;
      const sizeKB = Math.round(file.size / 1024);
      const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));
      const under2MB = file.size <= 2 * 1024 * 1024;

      setStats({
        width: w,
        height: h,
        sizeKB,
        sizeMB,
        format: file.type.replace('image/', '').toUpperCase(),
        is16x9,
        isRecommendedDim,
        under2MB,
        name: file.name,
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError('Could not read image dimensions from this file.');
      setStats(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-4">
      <div className="relative p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={handleFile}
          aria-label="Upload thumbnail image file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <ImageIcon className="h-10 w-10 text-red-500 mx-auto mb-2 pointer-events-none" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 pointer-events-none">
          Click or drop thumbnail image file (JPG, PNG, WebP · max 20 MB)
        </span>
        <p className="text-xs text-slate-500 mt-1 pointer-events-none">Evaluated 100% locally in your browser. No files uploaded to any server.</p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      {stats && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">{stats.name}</h3>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
              {stats.format}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-lg border ${stats.under2MB ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'}`}>
              <div className="font-semibold">File Size</div>
              <div className="text-lg font-bold mt-1">{stats.sizeMB} MB ({stats.sizeKB} KB)</div>
              <div className="text-[11px] mt-0.5">{stats.under2MB ? '✓ Under YouTube 2MB limit' : '✗ Exceeds 2MB limit'}</div>
            </div>

            <div className={`p-3 rounded-lg border ${stats.is16x9 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'}`}>
              <div className="font-semibold">Aspect Ratio</div>
              <div className="text-lg font-bold mt-1">{stats.is16x9 ? '16:9 (Standard)' : 'Custom Ratio'}</div>
              <div className="text-[11px] mt-0.5">{stats.is16x9 ? '✓ Matches YouTube player' : '⚠️ May show black bars'}</div>
            </div>

            <div className={`p-3 rounded-lg border ${stats.isRecommendedDim ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'}`}>
              <div className="font-semibold">Dimensions</div>
              <div className="text-lg font-bold mt-1">{stats.width} × {stats.height}</div>
              <div className="text-[11px] mt-0.5">{stats.isRecommendedDim ? '✓ HD (≥1280x720)' : '⚠️ Below 1280x720 HD standard'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeThumbnailResizer() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [targetSize, setTargetSize] = useState<'1280x720' | '1920x1080'>('1280x720');
  const [outFormat, setOutFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processResize = (source: string, mode: 'cover' | 'contain', sizeKey: '1280x720' | '1920x1080', fmt: 'jpeg' | 'png') => {
    const img = new Image();
    img.onload = () => {
      const targetW = sizeKey === '1920x1080' ? 1920 : 1280;
      const targetH = sizeKey === '1920x1080' ? 1080 : 720;
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, targetW, targetH);

      const targetRatio = targetW / targetH;
      const srcRatio = img.naturalWidth / img.naturalHeight;

      if (mode === 'cover') {
        let dw = targetW;
        let dh = targetH;
        let dx = 0;
        let dy = 0;
        if (srcRatio > targetRatio) {
          dw = targetH * srcRatio;
          dx = (targetW - dw) / 2;
        } else {
          dh = targetW / srcRatio;
          dy = (targetH - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        let dw = targetW;
        let dh = targetH;
        let dx = 0;
        let dy = 0;
        if (srcRatio > targetRatio) {
          dh = targetW / srcRatio;
          dy = (targetH - dh) / 2;
        } else {
          dw = targetH * srcRatio;
          dx = (targetW - dw) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      setOutUrl(fmt === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => {
      setError('Could not decode this image file.');
      setOutUrl(null);
    };
    img.src = source;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid JPG, PNG, or WebP image file.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File exceeds the 20 MB browser limit.');
      return;
    }
    setError(null);
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      setImgSrc(result);
      processResize(result, fitMode, targetSize, outFormat);
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
          <ImageIcon className="h-4 w-4 pointer-events-none" />
          <span className="pointer-events-none">Upload Image to Resize</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            onChange={handleUpload}
            aria-label="Upload image to resize"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setTargetSize('1280x720');
              if (imgSrc) processResize(imgSrc, fitMode, '1280x720', outFormat);
            }}
            className={`px-2.5 py-1 rounded font-medium ${targetSize === '1280x720' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            1280×720
          </button>
          <button
            type="button"
            onClick={() => {
              setTargetSize('1920x1080');
              if (imgSrc) processResize(imgSrc, fitMode, '1920x1080', outFormat);
            }}
            className={`px-2.5 py-1 rounded font-medium ${targetSize === '1920x1080' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            1920×1080
          </button>
          <button
            type="button"
            onClick={() => {
              setFitMode('cover');
              if (imgSrc) processResize(imgSrc, 'cover', targetSize, outFormat);
            }}
            className={`px-2.5 py-1 rounded font-medium ${fitMode === 'cover' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Crop to Fill
          </button>
          <button
            type="button"
            onClick={() => {
              setFitMode('contain');
              if (imgSrc) processResize(imgSrc, 'contain', targetSize, outFormat);
            }}
            className={`px-2.5 py-1 rounded font-medium ${fitMode === 'contain' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Fit Padded
          </button>
          <button
            type="button"
            onClick={() => {
              const nextFmt = outFormat === 'jpeg' ? 'png' : 'jpeg';
              setOutFormat(nextFmt);
              if (imgSrc) processResize(imgSrc, fitMode, targetSize, nextFmt);
            }}
            className="px-2.5 py-1 rounded font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            Format: {outFormat.toUpperCase()}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      {outUrl ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img src={outUrl} alt={`Resized ${targetSize}`} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono">Output: {targetSize.replace('x', ' × ')} px (16:9 HD · {outFormat.toUpperCase()})</span>
            <a
              href={outUrl}
              download={`youtube_thumbnail_${targetSize}.${outFormat === 'png' ? 'png' : 'jpg'}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download {targetSize} {outFormat.toUpperCase()}
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload any photo or graphic above to automatically scale and center to exact 1280×720 or 1920×1080 YouTube specifications.
        </div>
      )}
    </div>
  );
}

function YouTubeThumbnailCompressor() {
  const [origSize, setOrigSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compressImage = (img: HTMLImageElement, q: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', q / 100);
    setCompressedUrl(dataUrl);

    const base64Part = dataUrl.split(',')[1] || '';
    const padding = base64Part.endsWith('==') ? 2 : base64Part.endsWith('=') ? 1 : 0;
    const exactBytes = Math.max(0, Math.floor((base64Part.length * 3) / 4) - padding);
    setCompressedSize(exactBytes);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid JPG, PNG, or WebP image file.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File exceeds the 20 MB browser limit.');
      return;
    }
    setError(null);
    setOrigSize(f.size);
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        setLoadedImg(img);
        compressImage(img, quality);
      };
      img.onerror = () => setError('Could not decode this image file.');
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
          <ImageIcon className="h-4 w-4 pointer-events-none" />
          <span className="pointer-events-none">Upload Image to Compress</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            onChange={handleUpload}
            aria-label="Upload thumbnail image to compress"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {loadedImg && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Quality: {quality}%</span>
            <input
              type="range"
              min="20"
              max="95"
              value={quality}
              aria-label="Compression quality percentage"
              onChange={(e) => {
                const q = parseInt(e.target.value, 10);
                setQuality(q);
                compressImage(loadedImg, q);
              }}
              className="w-32 accent-red-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      {compressedUrl && origSize !== null && compressedSize !== null ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Original Size</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {(origSize / 1024).toFixed(1)} KB ({(origSize / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-400">Compressed Size</span>
              <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                {(compressedSize / 1024).toFixed(1)} KB ({(compressedSize / (1024 * 1024)).toFixed(2)} MB)
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                {compressedSize <= origSize
                  ? `Saved ${Math.round(((origSize - compressedSize) / origSize) * 100)}%`
                  : 'Lower quality slider to shrink further'}
              </div>
            </div>
          </div>

          <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img src={compressedUrl} alt="Compressed thumbnail preview" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="text-xs text-slate-500">
              {compressedSize <= 2 * 1024 * 1024 ? '✓ Safe for YouTube (≤2MB limit)' : '⚠️ Still exceeds 2MB limit. Lower quality slider.'}
            </span>
            <a
              href={compressedUrl}
              download="compressed_youtube_thumbnail.jpg"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Compressed Thumbnail
            </a>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500">
          Upload an image up to 20 MB to compress it cleanly under YouTube&apos;s 2 MB thumbnail cap inside your browser.
        </div>
      )}
    </div>
  );
}

function YouTubeThumbnailColorExtractor({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [colors, setColors] = useState<{hex: string; rgb: string; luminance: number}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid JPG, PNG, or WebP image file.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File exceeds the 20 MB browser limit.');
      return;
    }
    setError(null);

    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 80, 80);
        const data = ctx.getImageData(0, 0, 80, 80).data;

        const buckets = new Map<string, {rSum: number; gSum: number; bSum: number; count: number}>();
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          const qr = Math.round(data[i] / 32) * 32;
          const qg = Math.round(data[i + 1] / 32) * 32;
          const qb = Math.round(data[i + 2] / 32) * 32;
          const key = `${qr},${qg},${qb}`;
          const existing = buckets.get(key) || {rSum: 0, gSum: 0, bSum: 0, count: 0};
          existing.rSum += data[i];
          existing.gSum += data[i + 1];
          existing.bSum += data[i + 2];
          existing.count += 1;
          buckets.set(key, existing);
        }

        const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
        const picked: {r: number; g: number; b: number; hex: string; rgb: string; luminance: number}[] = [];

        for (const b of sorted) {
          const red = Math.round(b.rSum / b.count);
          const green = Math.round(b.gSum / b.count);
          const blue = Math.round(b.bSum / b.count);
          const tooClose = picked.some(
            (p) => Math.hypot(p.r - red, p.g - green, p.b - blue) < 42
          );
          if (tooClose) continue;
          const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1).toUpperCase()}`;
          const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
          picked.push({r: red, g: green, b: blue, hex, rgb: `rgb(${red}, ${green}, ${blue})`, luminance});
          if (picked.length >= 6) break;
        }

        setColors(picked.map(({hex, rgb, luminance}) => ({hex, rgb, luminance})));
      };
      img.onerror = () => setError('Could not decode this image file.');
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <div className="relative p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={handleUpload}
          aria-label="Upload thumbnail image for color extraction"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Palette className="h-8 w-8 text-red-500 mx-auto mb-2 pointer-events-none" />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none">
          Upload thumbnail (JPG, PNG, WebP · max 20 MB) to extract dominant brand colors
        </span>
        <p className="text-[11px] text-slate-400 mt-1 pointer-events-none">Quantizes RGB pixels locally in your browser to find HEX, RGB, and contrast values.</p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      {colors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {colors.map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="h-16 w-full flex items-center justify-center font-mono text-xs font-bold" style={{backgroundColor: c.hex, color: c.luminance > 0.5 ? '#0f172a' : '#ffffff'}}>
                {c.luminance > 0.5 ? 'Light BG' : 'Dark BG'}
              </div>
              <div className="p-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{c.hex}</div>
                  <div className="text-[10px] text-slate-500">{c.rgb}</div>
                </div>
                <button
                  type="button"
                  aria-label={`Copy ${c.hex}`}
                  onClick={() => onCopy(c.hex, `hex-${i}`)}
                  className="text-slate-400 hover:text-red-600"
                >
                  {copiedKey === `hex-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. COUNTERS & VALIDATORS
// ============================================================================

function YouTubeTitleCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [title, setTitle] = useState('How to Build a Modern Web App in 2026 (Full Beginner Tutorial)');
  const len = countCodePoints(title);
  const words = title.trim() ? title.trim().split(/\s+/).length : 0;
  const isOver100 = len > 100;
  const isCutoffRisk = len > 60;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            YouTube Video Title
          </label>
          <span className={`text-xs font-mono font-bold ${isOver100 ? 'text-rose-600' : len > 70 ? 'text-amber-500' : 'text-emerald-600'}`}>
            {len} / 100 characters
          </span>
        </div>
        <textarea
          rows={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type or paste your YouTube video title..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setTitle('')}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={len === 0}
            onClick={() => onCopy(title, 'yt-title-cnt')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            {copiedKey === 'yt-title-cnt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Title
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Characters</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{len}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Words</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{words}</div>
        </div>
        <div className={`p-3 rounded-lg border ${!isOver100 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
          <span className="font-semibold">YouTube Limit</span>
          <div className="text-base font-bold mt-0.5">{isOver100 ? 'EXCEEDS 100' : 'Within Limit'}</div>
        </div>
        <div className={`p-3 rounded-lg border ${!isCutoffRisk ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'}`}>
          <span className="font-semibold">Mobile Search Cutoff</span>
          <div className="text-base font-bold mt-0.5">{isCutoffRisk ? 'May Truncate' : 'Fully Visible'}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Search Snippet Preview (approx. 55 chars):</span>
        <div className="mt-1 font-medium text-slate-900 dark:text-white">
          {sliceCodePoints(title, 55)}{len > 55 ? '...' : ''}
        </div>
      </div>
    </div>
  );
}

function YouTubeDescriptionCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [desc, setDesc] = useState(`In this video, we cover everything you need to know about productivity systems in 2026.\n\nTimestamps:\n00:00 - Introduction\n01:30 - Setting Up Your Workspace\n05:45 - Key Habit Loops\n10:15 - Final Thoughts\n\nLinks mentioned in this video:\nhttps://example.com/resources`);
  const len = countCodePoints(desc);
  const lines = desc ? desc.split('\n').length : 0;
  const words = desc.trim() ? desc.trim().split(/\s+/).length : 0;
  const links = (desc.match(/https?:\/\/[^\s]+/g) || []).length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            YouTube Video Description (5,000 char maximum)
          </label>
          <span className={`text-xs font-mono font-bold ${len > 5000 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {len} / 5,000 chars
          </span>
        </div>
        <textarea
          rows={6}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Paste your YouTube video description..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setDesc('')}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={len === 0}
            onClick={() => onCopy(desc, 'yt-desc-cnt')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            {copiedKey === 'yt-desc-cnt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Description
          </button>
        </div>
      </div>

      {len > 5000 && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-700 text-xs font-semibold text-rose-800 dark:text-rose-200">
          Exceeds YouTube&apos;s 5,000-character maximum by {(len - 5000).toLocaleString()} {len - 5000 === 1 ? 'character' : 'characters'}.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Characters Remaining</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{Math.max(0, 5000 - len).toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Words</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{words.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Lines</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{lines}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Links Detected</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{links}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Above-the-Fold Fold Preview (First ~150 chars before &ldquo;Show More&rdquo;):</span>
        <div className="mt-1 font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 whitespace-pre-line">
          {desc.trim() ? `${sliceCodePoints(desc, 150)}${len > 150 ? '...' : ''}` : '(Empty description)'}
        </div>
      </div>
    </div>
  );
}

function YouTubeTagsCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [tagsInput, setTagsInput] = useState('productivity, habits, time management, deep work, focus tips, daily routine, organization');
  const tags = useMemo(() => tagsInput.split(',').map((t) => t.trim()).filter(Boolean), [tagsInput]);
  const totalChars = useMemo(() => countCodePoints(tags.join(',')), [tags]);
  const isOver500 = totalChars > 500;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            YouTube Tags (Comma-Separated, 500 Character Limit)
          </label>
          <div className="flex items-center gap-2">
            {isOver500 && (
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wide">
                OVER BY {(totalChars - 500).toLocaleString()}
              </span>
            )}
            <span className={`text-xs font-mono font-bold ${isOver500 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {totalChars} / 500 characters
            </span>
          </div>
        </div>
        <textarea
          rows={3}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Enter comma-separated video tags..."
          className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 font-mono ${isOver500 ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-red-500'}`}
        />
      </div>

      {isOver500 && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-700 text-xs font-semibold text-rose-800 dark:text-rose-200">
          Tag list exceeds YouTube&apos;s 500-character limit by {totalChars - 500} {totalChars - 500 === 1 ? 'character' : 'characters'}. Remove extra tags before saving in YouTube Studio.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500 font-medium">
          Tag Count: {tags.length} tags · Remaining room: {Math.max(0, 500 - totalChars)} chars
        </span>
        <button
          type="button"
          disabled={tags.length === 0}
          onClick={() => onCopy(tags.join(', '), 'yt-tags-copy')}
          className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold disabled:opacity-40"
        >
          {copiedKey === 'yt-tags-copy' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          Copy All Formatted Tags
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {tag}
            <span className="text-[10px] text-slate-400 font-mono">({countCodePoints(tag)})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function YouTubeHashtagCounter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState('#productivity #timemanagement #habits #focus #deepwork');
  const hashtags = useMemo(() => (text.match(/#[\p{L}\p{N}_]+/gu) || []), [text]);

  const analysis = useMemo(() => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    const unique: string[] = [];
    for (const tag of hashtags) {
      const lower = tag.toLowerCase();
      if (seen.has(lower)) {
        if (!duplicates.some((d) => d.toLowerCase() === lower)) {
          duplicates.push(tag);
        }
      } else {
        seen.set(lower, tag);
        unique.push(tag);
      }
    }
    return {unique, duplicates};
  }, [hashtags]);

  const isOver15 = hashtags.length > 15;
  const isOver60 = hashtags.length > 60;

  const policyTone =
    isOver60
      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200'
      : isOver15
        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200'
        : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';

  const policyLabel =
    isOver60
      ? '⚠️ Over 60: YouTube ignores ALL hashtags'
      : isOver15
        ? '⚠️ Over 15 recommended cap (risk of suppression)'
        : hashtags.length === 0
          ? 'None detected'
          : '✓ Safe (≤ 15 recommended)';

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Paste Text or Hashtags
          </label>
          <span className={`text-xs font-mono font-bold ${isOver60 ? 'text-rose-600' : isOver15 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {hashtags.length} / 15 recommended
          </span>
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="#tutorial #editing #workflow"
          className={`w-full rounded-xl border bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white ${isOver60 ? 'border-rose-500' : isOver15 ? 'border-amber-500' : 'border-slate-300 dark:border-slate-700'}`}
        />
      </div>

      {isOver15 && (
        <div
          role="alert"
          className={`p-3 rounded-xl border-2 text-xs font-semibold ${isOver60 ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200'}`}
        >
          {isOver60
            ? `${hashtags.length} hashtags entered — exceeds YouTube's hard 60-hashtag threshold by ${hashtags.length - 60}. YouTube ignores all hashtags above 60.`
            : `${hashtags.length} hashtags entered — ${hashtags.length - 15} over YouTube's 15-hashtag recommended cap (risk of suppression).`}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Total / Unique Hashtags</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {hashtags.length} <span className="text-xs font-normal text-slate-500">({analysis.unique.length} unique)</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Top 3 Title Bar Display</span>
          <div className="text-xs font-mono font-medium text-red-600 mt-1 truncate">
            {analysis.unique.slice(0, 3).join(' ') || 'None'}
          </div>
        </div>
        <div className={`p-3 rounded-lg border ${policyTone}`}>
          <span className="font-semibold">YouTube Policy Check</span>
          <div className="text-xs font-bold mt-1">{policyLabel}</div>
        </div>
      </div>

      {analysis.duplicates.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2">
          <span>Duplicate hashtags detected: <strong className="font-mono">{analysis.duplicates.join(', ')}</strong></span>
          <button
            type="button"
            onClick={() => onCopy(analysis.unique.join(' '), 'yt-hash-uniq')}
            className="inline-flex items-center gap-1 font-semibold text-red-600"
          >
            {copiedKey === 'yt-hash-uniq' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Unique Only
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. GENERATORS (TEMPLATE-BASED, ZERO AI)
// ============================================================================

function YouTubeTagGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('web development');
  const [details, setDetails] = useState('');
  const [batchIndex, setBatchIndex] = useState(0);
  const [excluded, setExcluded] = useState<string[]>([]);

  const tags = useMemo(() => generateYouTubeTags(topic, details, batchIndex), [topic, details, batchIndex]);
  const selectedTags = useMemo(() => tags.filter((t) => !excluded.includes(t)), [tags, excluded]);
  const joined = selectedTags.join(', ');
  const charCount = countCodePoints(joined);

  const toggleTag = (tag: string) => {
    setExcluded((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  };

  const handleReset = () => {
    setTopic('');
    setDetails('');
    setBatchIndex(0);
    setExcluded([]);
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based tag suggestions only · Zero AI · NOT live trending data or search volume. Automatically capped at YouTube&apos;s 500-character limit.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Primary Video Topic / Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setExcluded([]);
            }}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Details / Sub-Topics (Optional)
          </label>
          <input
            type="text"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setExcluded([]);
            }}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!topic.trim()}
            onClick={() => {
              setBatchIndex((b) => b + 1);
              setExcluded([]);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Reset
          </button>
        </div>

        <button
          type="button"
          disabled={selectedTags.length === 0}
          onClick={() => onCopy(joined, 'yt-tags-gen')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          {copiedKey === 'yt-tags-gen' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy All ({selectedTags.length})
        </button>
      </div>

      {!topic.trim() ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a video topic or keyword to generate structured tags.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-mono font-bold ${charCount > 500 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
              Selected ({selectedTags.length} tags): {charCount}/500 characters
            </span>
            <span className="text-[11px] text-slate-500">Click tag label to include/exclude or Copy icon for one tag</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t, idx) => {
              const active = !excluded.includes(t);
              return (
                <div
                  key={`${batchIndex}-${idx}`}
                  className={`inline-flex items-center rounded-full text-xs border transition-colors ${active ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`pl-3 pr-1.5 py-1 text-left ${!active ? 'line-through' : ''}`}
                  >
                    {t}
                  </button>
                  <button
                    type="button"
                    aria-label={`Copy tag ${t}`}
                    onClick={() => onCopy(t, `yt-tag-one-${idx}`)}
                    className="pr-2.5 pl-1 py-1 text-slate-400 hover:text-red-600"
                  >
                    {copiedKey === `yt-tag-one-${idx}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Comma-Separated Output ({charCount}/500 characters)
              </span>
            </div>
            <textarea
              readOnly
              rows={3}
              value={joined}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </>
      )}
    </div>
  );
}

function YouTubeHashtagGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [keyword, setKeyword] = useState('video editing');
  const [details, setDetails] = useState('');
  const [includeShorts, setIncludeShorts] = useState(true);

  const hashtags = useMemo(
    () => generateYouTubeHashtags(keyword, details, includeShorts),
    [keyword, details, includeShorts]
  );

  const joined = hashtags.join(' ');

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based CamelCase hashtag suggestions · NOT live trending data · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Topic Keyword(s)
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Details / Sub-Topics (Optional)
          </label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          checked={includeShorts}
          onChange={(e) => setIncludeShorts(e.target.checked)}
        />
        Include #Shorts preset
      </label>

      {hashtags.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter at least one alphanumeric keyword to format hashtags.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Generated {hashtags.length} formatted hashtags (YouTube highlights top 3 above title)
            </span>
            <button
              type="button"
              onClick={() => onCopy(joined, 'yt-hash-copy')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              {copiedKey === 'yt-hash-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hashtags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 font-mono text-xs text-red-600 dark:text-red-400"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  aria-label={`Copy ${tag}`}
                  onClick={() => onCopy(tag, `ht-single-${idx}`)}
                  className="text-slate-400 hover:text-red-600 inline-flex items-center gap-1 font-sans"
                >
                  {copiedKey === `ht-single-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function YouTubeTitleGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('Sourdough Bread');
  const [details, setDetails] = useState('');
  const [style, setStyle] = useState<'all' | 'tutorial' | 'mistakes' | 'review'>('all');
  const [batchIndex, setBatchIndex] = useState(0);
  const [editedTitles, setEditedTitles] = useState<Record<number, string>>({});
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const generatedTitles = useMemo(
    () => generateYouTubeTitles(topic, style, batchIndex, details),
    [topic, style, batchIndex, details]
  );

  const displayTitles = useMemo(
    () => generatedTitles.map((t, idx) => (editedTitles[idx] !== undefined ? editedTitles[idx] : t)),
    [generatedTitles, editedTitles]
  );

  const handleReset = () => {
    setTopic('');
    setDetails('');
    setStyle('all');
    setBatchIndex(0);
    setEditedTitles({});
    setEditingIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based headline formulas only — NOT AI-generated. Tracks YouTube&apos;s 100-char limit and ~60-char mobile cutoff.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Video Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setEditedTitles({});
              setEditingIdx(null);
            }}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Details / Angle (Optional)
          </label>
          <input
            type="text"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setEditedTitles({});
              setEditingIdx(null);
            }}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Title Formula Angle
          </label>
          <select
            value={style}
            onChange={(e) => {
              setStyle(e.target.value as 'all' | 'tutorial' | 'mistakes' | 'review');
              setBatchIndex(0);
              setEditedTitles({});
              setEditingIdx(null);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="all">Mixed Formats (10 Formulas)</option>
            <option value="tutorial">Tutorial &amp; How-To</option>
            <option value="mistakes">Mistakes &amp; Contrarian</option>
            <option value="review">Testing &amp; Review</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={displayTitles.length === 0}
            onClick={() => {
              setBatchIndex((b) => b + 1);
              setEditedTitles({});
              setEditingIdx(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate Set
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Reset
          </button>
        </div>

        <button
          type="button"
          disabled={displayTitles.length === 0}
          onClick={() => onCopy(displayTitles.join('\n'), 'yt-titles-all')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          {copiedKey === 'yt-titles-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy All ({displayTitles.length})
        </button>
      </div>

      {displayTitles.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a video topic above to generate title formulas.
        </div>
      ) : (
        <div className="space-y-2">
          {displayTitles.map((t, idx) => {
            const len = countCodePoints(t);
            const overLimit = len > 100;
            const mobileCutoff = len > 60;
            const isEditing = editingIdx === idx;
            return (
              <div key={`${batchIndex}-${idx}`} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                {isEditing ? (
                  <input
                    type="text"
                    value={t}
                    aria-label={`Edit title ${idx + 1}`}
                    onChange={(e) => setEditedTitles((prev) => ({...prev, [idx]: e.target.value}))}
                    className="flex-1 min-w-[200px] rounded-lg border border-red-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                ) : (
                  <span className="font-medium text-slate-900 dark:text-white pr-2 flex-1 min-w-[200px]">{t}</span>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                      overLimit
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : mobileCutoff
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {len}/100 {overLimit ? 'Over Limit' : mobileCutoff ? 'Cutoff >60' : 'Fits Mobile'}
                  </span>
                  <button
                    type="button"
                    aria-label={isEditing ? `Done editing title ${idx + 1}` : `Edit title ${idx + 1}`}
                    onClick={() => setEditingIdx(isEditing ? null : idx)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"
                  >
                    <Pencil className="h-3 w-3" />
                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    aria-label={`Copy title ${idx + 1}`}
                    onClick={() => onCopy(t, `title-${idx}`)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 font-semibold"
                  >
                    {copiedKey === `title-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function YouTubeDescriptionGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [summary, setSummary] = useState('In this video we cover the exact workflow to get consistent results.');
  const [keyDetails, setKeyDetails] = useState('');
  const [cta, setCta] = useState('Subscribe for weekly tutorials and resources!');
  const [resourceLinks, setResourceLinks] = useState('');
  const [socialHandles, setSocialHandles] = useState('');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);
  const [includeSocials, setIncludeSocials] = useState(true);
  const [includeDisclosure, setIncludeDisclosure] = useState(false);

  const template = useMemo(
    () =>
      generateYouTubeDescription({
        summary,
        keyDetails,
        cta,
        resourceLinks,
        socialHandles,
        includeTimestamps,
        includeResources,
        includeSocials,
        includeDisclosure,
      }),
    [summary, keyDetails, cta, resourceLinks, socialHandles, includeTimestamps, includeResources, includeSocials, includeDisclosure]
  );

  const charCount = countCodePoints(template);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based YouTube description formatter · Zero AI · Checks YouTube&apos;s 5,000-character limit. Only includes links or handles you actually enter.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Video Summary / Hook
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Summarize what viewers will learn..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Steps / Topics (Optional, Comma-Separated)
          </label>
          <input
            type="text"
            value={keyDetails}
            onChange={(e) => setKeyDetails(e.target.value)}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom, slow spiral pours"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Primary Call to Action
          </label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="Subscribe for weekly guides..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Resource URLs (Optional, One Per Line)
          </label>
          <input
            type="text"
            value={resourceLinks}
            onChange={(e) => setResourceLinks(e.target.value)}
            placeholder="https://yoursite.com/guide (blank = omitted)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Social Handles (Optional)
          </label>
          <input
            type="text"
            value={socialHandles}
            onChange={(e) => setSocialHandles(e.target.value)}
            placeholder="@yourchannel (blank = omitted)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeTimestamps} onChange={(e) => setIncludeTimestamps(e.target.checked)} />
          <span>Topic Timestamps Block</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeResources} onChange={(e) => setIncludeResources(e.target.checked)} />
          <span>Include Entered Resources</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeSocials} onChange={(e) => setIncludeSocials(e.target.checked)} />
          <span>Include Entered Socials</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeDisclosure} onChange={(e) => setIncludeDisclosure(e.target.checked)} />
          <span>Affiliate Disclosure</span>
        </label>
      </div>

      {!summary.trim() ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a video summary or intro hook to build the description template.
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">Structured Description Template</span>
              <span className={`text-xs font-mono font-bold ${charCount > 5000 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {charCount.toLocaleString()} / 5,000 chars
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(template, 'desc-template')}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold"
            >
              {copiedKey === 'desc-template' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Template
            </button>
          </div>
          <textarea
            readOnly
            rows={11}
            value={template}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

function YouTubeChannelNameGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Coffee Craft');
  const [detail, setDetail] = useState('');
  const [style, setStyle] = useState('standard');
  const [batchIndex, setBatchIndex] = useState(0);
  const names = useMemo(
    () => generateYouTubeChannelNames(niche, style, detail, batchIndex),
    [niche, style, detail, batchIndex]
  );

  const handleReset = () => {
    setNiche('');
    setDetail('');
    setStyle('standard');
    setBatchIndex(0);
  };

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template word-combination builder · NOT AI · Live channel name availability must be checked on YouTube
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Niche or Focus Topic
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => {
              setNiche(e.target.value);
              setBatchIndex(0);
            }}
            placeholder="e.g. pour-over coffee, design"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Tone / Sub-Topic Word (Optional)
          </label>
          <input
            type="text"
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setBatchIndex(0);
            }}
            placeholder="e.g. V60, grind size, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Style Theme
          </label>
          <select
            value={style}
            onChange={(e) => {
              setStyle(e.target.value);
              setBatchIndex(0);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="standard">Modern / Brandable</option>
            <option value="minimal">Minimal / Studio</option>
            <option value="creator">Creator / Show</option>
            <option value="tech">Tech / Systems</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={names.length === 0}
            onClick={() => setBatchIndex((b) => b + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Reset
          </button>
        </div>
        <button
          type="button"
          disabled={names.length === 0}
          onClick={() => onCopy(names.join('\n'), 'yt-chnames-all')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          {copiedKey === 'yt-chnames-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copy All ({names.length})
        </button>
      </div>

      {names.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter at least one letter or number for your niche keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {names.map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <span className="font-bold text-slate-900 dark:text-white pr-2">{name}</span>
              <button type="button" aria-label={`Copy ${name}`} onClick={() => onCopy(name, `ch-${i}`)} className="text-slate-400 hover:text-red-600 shrink-0">
                {copiedKey === `ch-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouTubeUsernameGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [base, setBase] = useState('alex');
  const clean = base.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const usernames = clean
    ? [
        `@${clean}official`,
        `@${clean}hq`,
        `@the_${clean}`,
        `@${clean}.create`,
        `@hey${clean}`,
        `@${clean}_daily`,
        `@${clean}zone`,
        `@watch_${clean}`,
      ].map((u) => u.slice(0, 31))
    : [];

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Rule-based @handle formatter · Zero AI · Live handle availability must be checked in YouTube Studio
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Name or Brand Handle Base
        </label>
        <input
          type="text"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          placeholder="e.g. studioforge"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
        />
      </div>

      {usernames.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter letters or numbers to build compliant @handle variations.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {usernames.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <span className="font-mono font-medium text-red-600 truncate mr-1">{u}</span>
              <button type="button" aria-label={`Copy ${u}`} onClick={() => onCopy(u, `un-${i}`)} className="text-slate-400 hover:text-red-600 shrink-0">
                {copiedKey === `un-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouTubeScriptGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('How to organize your digital workspace');
  const [keyPoints, setKeyPoints] = useState('');
  const [targetMins, setTargetMins] = useState('5');
  const [format, setFormat] = useState<'tutorial' | 'review' | 'listicle' | 'story'>('tutorial');

  const minsNum = parseFloat(targetMins);
  const validMins = !isNaN(minsNum) && minsNum > 0;

  const script = useMemo(
    () => (validMins ? generateYouTubeScript({topic, targetMins: minsNum, format, keyPoints}) : ''),
    [topic, minsNum, validMins, format, keyPoints]
  );

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Structured TEMPLATE outline only — NOT AI-written prose. Fill in your own talking points inside the timed sections.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Video Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Outline Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'tutorial' | 'review' | 'listicle' | 'story')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="tutorial">Tutorial</option>
            <option value="review">Review</option>
            <option value="listicle">Listicle</option>
            <option value="story">Story</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Target Runtime (Minutes)
          </label>
          <input
            type="number"
            min="1"
            step="0.5"
            value={targetMins}
            onChange={(e) => setTargetMins(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Key Points / Steps (Optional, Comma-Separated)
        </label>
        <input
          type="text"
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="e.g. V60, grind size, 1:16 coffee-to-water ratio, bloom, slow spiral pours"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
        />
      </div>

      {!topic.trim() || !validMins ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {!topic.trim() ? 'Please enter a video subject to build an outline.' : 'Target runtime must be greater than 0 minutes.'}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">Timed Script Outline</span>
            <button
              type="button"
              onClick={() => onCopy(script, 'yt-script-copy')}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold"
            >
              {copiedKey === 'yt-script-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Outline
            </button>
          </div>
          <textarea
            readOnly
            rows={12}
            value={script}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

function YouTubeHookGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [topic, setTopic] = useState('learning to code');
  const [detail, setDetail] = useState('');
  const [batchIndex, setBatchIndex] = useState(0);
  const hooks = useMemo(() => generateYouTubeHooks(topic, detail, batchIndex), [topic, detail, batchIndex]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based opening hook frameworks · Deterministic formatting · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Topic / Core Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Angle / Specific Detail (Optional)
          </label>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {hooks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setBatchIndex((b) => b + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rotate Hooks
          </button>
          <button
            type="button"
            onClick={() => onCopy(hooks.map((h) => h.hook).join('\n\n'), 'hooks-all')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            {copiedKey === 'hooks-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy All ({hooks.length})
          </button>
        </div>
      )}

      {hooks.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a topic or core subject to format opening hooks.
        </div>
      ) : (
        <div className="space-y-2.5">
          {hooks.map((h, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-red-600 uppercase tracking-wide text-[10px]">{h.style} Hook</span>
                <button type="button" aria-label={`Copy ${h.style} hook`} onClick={() => onCopy(h.hook, `hook-${i}`)} className="text-slate-400 hover:text-red-600">
                  {copiedKey === `hook-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">&ldquo;{h.hook}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouTubeVideoIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Personal Finance');
  const [detail, setDetail] = useState('');
  const [category, setCategory] = useState<'all' | 'tutorial' | 'comparison' | 'listicle'>('all');

  const ideas = useMemo(
    () => generateYouTubeVideoIdeas(niche, category, detail),
    [niche, category, detail]
  );

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Editorial format-matrix templates · Deterministic topic pairing · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Channel Niche / Topic
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Target Audience / Key Details (Optional)
          </label>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Format Filter
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'all' | 'tutorial' | 'comparison' | 'listicle')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Formats</option>
            <option value="tutorial">Tutorials</option>
            <option value="comparison">Comparisons &amp; Tests</option>
            <option value="listicle">Listicles &amp; Routines</option>
          </select>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a channel niche to generate episode templates.
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onCopy(ideas.map((i) => i.text).join('\n'), 'ideas-all')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              {copiedKey === 'ideas-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy All ({ideas.length})
            </button>
          </div>
          <div className="space-y-2">
            {ideas.map((idea, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <span className="font-medium text-slate-900 dark:text-white pr-2">{idea.text}</span>
                <button type="button" aria-label={`Copy idea ${i + 1}`} onClick={() => onCopy(idea.text, `idea-${i}`)} className="text-slate-400 hover:text-red-600 shrink-0">
                  {copiedKey === `idea-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function YouTubeShortsIdeaGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [niche, setNiche] = useState('Cooking');
  const [detail, setDetail] = useState('');
  const shorts = useMemo(() => generateYouTubeShortsIdeas(niche, detail), [niche, detail]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Deterministic 15–60s Shorts templates · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Shorts Niche / Topic
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. how to brew pour-over coffee"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Step / Detail (Optional)
          </label>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="e.g. V60, grind size, 1:16 ratio, bloom"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {shorts.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a Shorts niche or topic above.
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onCopy(shorts.join('\n'), 'shorts-all')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              {copiedKey === 'shorts-all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy All ({shorts.length})
            </button>
          </div>
          <div className="space-y-2">
            {shorts.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <span className="font-medium text-slate-900 dark:text-white pr-2">{s}</span>
                <button type="button" aria-label={`Copy short idea ${i + 1}`} onClick={() => onCopy(s, `short-${i}`)} className="text-slate-400 hover:text-red-600 shrink-0">
                  {copiedKey === `short-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function YouTubePinnedCommentGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [goal, setGoal] = useState<'question' | 'poll' | 'resource' | 'subscribe'>('question');
  const [question, setQuestion] = useState('Which habit are you planning to start this week?');
  const [link, setLink] = useState('https://example.com/free-checklist');

  const comment = useMemo(() => {
    const q = question.trim();
    const l = link.trim();
    if (!q && !l) return '';
    if (goal === 'poll') {
      return `Quick community poll 👇\n${q || 'Which option fits your workflow best?'}\n\n👍 = Option A\n❤️ = Option B\n💬 = Reply with your pick below!${l ? `\n\n📌 Resource link:\n${l}` : ''}`;
    }
    if (goal === 'resource') {
      return `📌 Resources mentioned in this video:\n${l || 'https://example.com/resources'}\n\n${q ? `💬 ${q}` : 'Let me know in the replies if you have questions!'}`;
    }
    if (goal === 'subscribe') {
      return `Thanks for watching! If this helped you, subscribe and tell me below:\n"${q || 'What topic should we break down next?'}"${l ? `\n\n🔗 Related link: ${l}` : ''}`;
    }
    return `Question for the community: 👇\n"${q}"${l ? `\n\n📌 Grab the resource mentioned in the video here:\n${l}` : ''}\n\nDrop your answer below so others can compare notes!`;
  }, [goal, question, link]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Template-based pinned comment formatter · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Comment Template
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as 'question' | 'poll' | 'resource' | 'subscribe')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="question">Engagement Question</option>
            <option value="poll">Emoji Poll</option>
            <option value="resource">Resource Link</option>
            <option value="subscribe">Subscribe CTA</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Engagement Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Resource Link (Optional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {!comment ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter an engagement question or a resource link.
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">Pinned Comment Preview</span>
            <button
              type="button"
              onClick={() => onCopy(comment, 'pinned-copy')}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold"
            >
              {copiedKey === 'pinned-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Comment
            </button>
          </div>
          <textarea
            readOnly
            rows={6}
            value={comment}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. PRODUCTION & PLANNING
// ============================================================================

function YouTubeChapterGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [rawText, setRawText] = useState(`00:00 Introduction & Overview\n01:15 Step 1: Planning\n03:40 Step 2: Implementation\n07:10 Step 3: Testing & Polish\n10:25 Final Thoughts`);
  const parsed = useMemo(() => parseYouTubeChapters(rawText), [rawText]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Raw Chapters or Timestamps (one per line)
        </label>
        <textarea
          rows={5}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="00:00 Introduction&#10;01:15 Main Topic&#10;03:30 Summary"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      {parsed.errors.length > 0 && (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
          <span className="font-semibold text-amber-800 dark:text-amber-300">YouTube Chapter Validation Notice:</span>
          {parsed.errors.map((err, i) => (
            <p key={i} className="text-amber-700 dark:text-amber-400">• {err}</p>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
            Formatted Chapters ({parsed.chapters.length} chapters)
          </span>
          <button
            type="button"
            disabled={!parsed.formatted}
            onClick={() => onCopy(parsed.formatted, 'chapters-copy')}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold disabled:opacity-40"
          >
            {copiedKey === 'chapters-copy' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Formatted Chapters
          </button>
        </div>
        <textarea
          readOnly
          rows={5}
          value={parsed.formatted}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 font-mono text-xs text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
}

const LONG_FORM_CHECKLIST = [
  {id: 1, label: 'Thumbnail designed at 1280x720 and file size under 2MB', done: true},
  {id: 2, label: 'Title is under 60-70 characters to prevent mobile truncation', done: true},
  {id: 3, label: 'Video description includes first 3-line hook + links + socials', done: false},
  {id: 4, label: 'Timestamps added with first chapter starting at 00:00', done: false},
  {id: 5, label: 'End screen elements and cards scheduled at the end', done: false},
  {id: 6, label: 'Monetization & ad placement settings confirmed', done: false},
  {id: 7, label: 'Captions / Subtitles reviewed for clarity', done: false},
  {id: 8, label: 'Pinned comment prepared with engagement question', done: false},
];

const SHORTS_CHECKLIST = [
  {id: 101, label: 'Vertical 9:16 (1080x1920) or 1:1 framing checked with no UI overlap', done: true},
  {id: 102, label: 'Total runtime is 60 seconds or under for Shorts shelf eligibility', done: false},
  {id: 103, label: 'Opening 2 seconds deliver an immediate visual or spoken hook', done: false},
  {id: 104, label: 'Clear burned-in or auto captions verified inside safe margins', done: false},
  {id: 105, label: 'Concise title under 60 chars includes #Shorts cleanly', done: false},
  {id: 106, label: 'Related long-form video linked in Shorts Studio settings', done: false},
];

function YouTubeUploadChecklist() {
  const [mode, setMode] = useState<'long' | 'shorts'>('long');
  const [longItems, setLongItems] = useState(LONG_FORM_CHECKLIST);
  const [shortsItems, setShortsItems] = useState(SHORTS_CHECKLIST);

  const items = mode === 'long' ? longItems : shortsItems;
  const setItems = mode === 'long' ? setLongItems : setShortsItems;

  const toggle = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? {...item, done: !item.done} : item)));
  };

  const clearAll = () => {
    setItems((prev) => prev.map((item) => ({...item, done: false})));
  };

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setMode('long')}
            className={`px-3 py-1.5 font-semibold ${mode === 'long' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Long-Form Video
          </button>
          <button
            type="button"
            onClick={() => setMode('shorts')}
            className={`px-3 py-1.5 font-semibold ${mode === 'shorts' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            YouTube Shorts
          </button>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-red-500"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Ticks
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Upload Readiness Progress: {doneCount} of {items.length} completed
        </span>
        <span className="font-bold text-red-600">{pct}%</span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-300" style={{width: `${pct}%`}} />
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <label
            key={it.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${it.done ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <input
              type="checkbox"
              checked={it.done}
              onChange={() => toggle(it.id)}
              className="accent-red-600 rounded"
            />
            <span className={it.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}>{it.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function YouTubeContentCalendarGenerator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [frequency, setFrequency] = useState('2');
  const [pillar, setPillar] = useState('Tutorials & Tech Reviews');
  const [startDate, setStartDate] = useState('2026-06-01');

  const schedule = useMemo(() => {
    const cleanPillar = pillar.trim();
    if (!cleanPillar) return [];

    const baseDate = new Date(`${startDate || '2026-06-01'}T12:00:00`);
    const validDate = !isNaN(baseDate.getTime()) ? baseDate : new Date('2026-06-01T12:00:00');
    const perWeek = parseInt(frequency, 10) || 2;

    const offsetsByWeek: Record<number, number[]> = {
      1: [0],
      2: [0, 3],
      3: [0, 2, 4],
    };
    const offsets = offsetsByWeek[perWeek] || [0, 3];
    const topics = [
      {type: 'Long-Form', title: `${cleanPillar}: Deep Dive & Walkthrough`},
      {type: 'Short', title: `30s Quick Tip from ${cleanPillar}`},
      {type: 'Long-Form', title: `${cleanPillar}: 5 Common Mistakes & Fixes`},
      {type: 'Short', title: `Before / After Case Study (${cleanPillar})`},
      {type: 'Long-Form', title: `${cleanPillar}: Workflow Comparison & Review`},
      {type: 'Short', title: `Rapid Q&A Highlight (${cleanPillar})`},
      {type: 'Long-Form', title: `${cleanPillar}: Monthly Recap & Checklist`},
      {type: 'Short', title: `1-Minute Myth Busting (${cleanPillar})`},
      {type: 'Long-Form', title: `${cleanPillar}: Beginner Q&A Session`},
      {type: 'Short', title: `Behind-the-Scenes Setup (${cleanPillar})`},
      {type: 'Long-Form', title: `${cleanPillar}: Tools & Template Breakdown`},
      {type: 'Short', title: `60s Mistakes Recap (${cleanPillar})`},
    ];

    const rows: {week: string; dateLabel: string; type: string; topic: string}[] = [];
    let topicIdx = 0;
    for (let w = 0; w < 4; w++) {
      for (const dayOffset of offsets) {
        const d = new Date(validDate);
        d.setDate(validDate.getDate() + w * 7 + dayOffset);
        const weekday = d.toLocaleDateString('en-US', {weekday: 'short'});
        const isoDate = d.toISOString().slice(0, 10);
        const item = topics[topicIdx % topics.length];
        rows.push({
          week: `Week ${w + 1}`,
          dateLabel: `${weekday} · ${isoDate}`,
          type: item.type,
          topic: item.title,
        });
        topicIdx++;
      }
    }
    return rows;
  }, [frequency, pillar, startDate]);

  const csv = useMemo(() => {
    if (schedule.length === 0) return '';
    return 'Week,Date,Format,Video Topic\n' + schedule.map((s) => `"${s.week}","${s.dateLabel}","${s.type}","${s.topic.replace(/"/g, '""')}"`).join('\n');
  }, [schedule]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        Formula-based upload schedule planner · Uses local calendar math · Zero AI
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Upload Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="1">1 Video / Week</option>
            <option value="2">2 Videos / Week</option>
            <option value="3">3 Videos / Week</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Core Content Pillar
          </label>
          <input
            type="text"
            value={pillar}
            onChange={(e) => setPillar(e.target.value)}
            placeholder="e.g. Tutorials & Tech Reviews"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {schedule.length === 0 ? (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Please enter a core content pillar to populate your monthly upload plan.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase">4-Week Upload Plan ({schedule.length} slots)</span>
            <button
              type="button"
              onClick={() => onCopy(csv, 'cal-csv')}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold"
            >
              {copiedKey === 'cal-csv' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy CSV Text
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
            {schedule.map((row, idx) => (
              <div key={idx} className="p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{row.week}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.type === 'Long-Form' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {row.type}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">({row.dateLabel})</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs">{row.topic}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// 6. GROWTH & MONETIZATION CALCULATORS
// ============================================================================

function YouTubeEarningsCalculator() {
  const [views, setViews] = useState('50000');
  const [rpm, setRpm] = useState('3.00');

  const parsed = useMemo(() => {
    if (views.trim() === '' || rpm.trim() === '') {
      return {valid: false, numViews: 0, numRpm: 0, error: 'Please enter both daily views and expected RPM.'};
    }
    const v = Number(views);
    const r = Number(rpm);
    if (isNaN(v) || isNaN(r) || v < 0 || r < 0) {
      return {valid: false, numViews: 0, numRpm: 0, error: 'Daily views and RPM must be zero or positive numbers.'};
    }
    return {valid: true, numViews: v, numRpm: r, error: null};
  }, [views, rpm]);

  const earnings = useMemo(
    () => calculateYouTubeEarnings(parsed.numViews, parsed.numRpm),
    [parsed.numViews, parsed.numRpm]
  );

  const fmt = (n: number) => n.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        Estimate-only calculation · Formula: (Daily Views / 1,000) × RPM (±30% variance range) · Actual earnings vary by niche, country and ad rates.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Daily Views
          </label>
          <input
            type="number"
            min="0"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Expected RPM (Revenue Per 1k Views) in USD ($)
          </label>
          <input
            type="number"
            step="0.25"
            min="0"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {!parsed.valid ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {parsed.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Daily Estimated</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${fmt(earnings.dailyMid)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">${fmt(earnings.dailyLow)} – ${fmt(earnings.dailyHigh)} range</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Monthly Estimated (30d)</span>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">${fmt(earnings.monthlyMid)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">${fmt(earnings.monthlyLow)} – ${fmt(earnings.monthlyHigh)} range</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Yearly Estimated (365d)</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">${fmt(earnings.yearlyMid)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">${fmt(earnings.yearlyLow)} – ${fmt(earnings.yearlyHigh)} range</span>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeRpmCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [revenue, setRevenue] = useState('1500');
  const [views, setViews] = useState('500000');

  const revNum = Number(revenue);
  const viewNum = Number(views);
  const validationError =
    revenue.trim() === '' || views.trim() === '' || isNaN(revNum) || isNaN(viewNum)
      ? 'Please enter valid numbers for revenue and total views.'
      : revNum < 0
        ? 'Revenue cannot be negative.'
        : viewNum <= 0
          ? 'Total views must be greater than 0 to calculate RPM.'
          : null;

  const rpm = !validationError ? (revNum / viewNum) * 1000 : null;

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        Formula: (Total Creator Revenue ÷ Total Views) × 1,000 · Actual RPM rates vary by niche, country and ad formats.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Total Creator Revenue Earned ($)
          </label>
          <input
            type="number"
            min="0"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Total Views Received
          </label>
          <input
            type="number"
            min="1"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError || rpm === null ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Calculated RPM</span>
            <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              ${rpm.toFixed(2)} <span className="text-sm font-normal text-slate-500">per 1,000 views</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Formula: (${revNum.toLocaleString()} ÷ {viewNum.toLocaleString()}) × 1,000</p>
          </div>
          <button
            type="button"
            onClick={() => onCopy(`$${rpm.toFixed(2)}`, 'rpm-copy')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            {copiedKey === 'rpm-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy RPM
          </button>
        </div>
      )}
    </div>
  );
}

function YouTubeCpmCalculator({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [adSpend, setAdSpend] = useState('3000');
  const [monetizedPlaybacks, setMonetizedPlaybacks] = useState('400000');

  const spendNum = Number(adSpend);
  const pbNum = Number(monetizedPlaybacks);
  const validationError =
    adSpend.trim() === '' || monetizedPlaybacks.trim() === '' || isNaN(spendNum) || isNaN(pbNum)
      ? 'Please enter valid numbers for ad spend and monetized playbacks.'
      : spendNum < 0
        ? 'Ad spend cannot be negative.'
        : pbNum <= 0
          ? 'Monetized playbacks must be greater than 0 to calculate CPM.'
          : null;

  const cpm = !validationError ? (spendNum / pbNum) * 1000 : null;
  const creatorEstimateAt55Pct = cpm !== null ? cpm * 0.55 : null;

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        Formula: (Total Ad Spend ÷ Monetized Playbacks) × 1,000 · Standard 55% creator share is illustrative; actual rates vary by niche and region.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Total Advertiser Cost / Ad Spend ($)
          </label>
          <input
            type="number"
            min="0"
            value={adSpend}
            onChange={(e) => setAdSpend(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Monetized Playbacks
          </label>
          <input
            type="number"
            min="1"
            value={monetizedPlaybacks}
            onChange={(e) => setMonetizedPlaybacks(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError || cpm === null || creatorEstimateAt55Pct === null ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold">Gross Advertiser CPM</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${cpm.toFixed(2)}</div>
              <span className="text-[11px] text-slate-500 mt-1 block">Cost per 1,000 monetized ad impressions</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(`$${cpm.toFixed(2)}`, 'cpm-copy')}
              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 shrink-0"
            >
              {copiedKey === 'cpm-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 uppercase font-semibold">Estimated Creator Share (55%)</span>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">${creatorEstimateAt55Pct.toFixed(2)}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">After YouTube&apos;s standard 45% revenue split</span>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeWatchHoursCalculator() {
  const [currentHours, setCurrentHours] = useState('1200');
  const [targetHours, setTargetHours] = useState('4000');
  const [avgViewMins, setAvgViewMins] = useState('4.5');

  const cur = Number(currentHours);
  const target = Number(targetHours);
  const avgM = Number(avgViewMins);

  const validationError =
    currentHours.trim() === '' || targetHours.trim() === '' || avgViewMins.trim() === '' || isNaN(cur) || isNaN(target) || isNaN(avgM)
      ? 'Please enter valid numbers in all fields.'
      : cur < 0
        ? 'Current watch hours cannot be negative.'
        : target <= 0
          ? 'Target watch hours must be greater than 0.'
          : avgM <= 0
            ? 'Average view duration must be greater than 0 minutes.'
            : null;

  const remainingHours = !validationError ? Math.max(0, target - cur) : 0;
  const viewsNeeded = !validationError ? Math.ceil((remainingHours * 60) / avgM) : 0;
  const dailyHoursNeededIn90Days = !validationError ? (remainingHours / 90).toFixed(1) : '0.0';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Current Watch Hours
          </label>
          <input
            type="number"
            min="0"
            value={currentHours}
            onChange={(e) => setCurrentHours(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Target Hours (YPP = 4,000)
          </label>
          <input
            type="number"
            min="1"
            value={targetHours}
            onChange={(e) => setTargetHours(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Average View Duration (Mins)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={avgViewMins}
            onChange={(e) => setAvgViewMins(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-500 uppercase">Hours Remaining</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {remainingHours === 0 ? '0 hrs (Reached!)' : `${remainingHours.toLocaleString()} hrs`}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-500 uppercase">Views Required</span>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{viewsNeeded.toLocaleString()} views</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-500 uppercase">Daily Hours for 90d Goal</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{dailyHoursNeededIn90Days} hrs/day</div>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeSubGoalCalculator() {
  const [currentSubs, setCurrentSubs] = useState('450');
  const [goalSubs, setGoalSubs] = useState('1000');
  const [subsPerDay, setSubsPerDay] = useState('5');

  const cur = Number(currentSubs);
  const goal = Number(goalSubs);
  const rate = Number(subsPerDay);

  const validationError =
    currentSubs.trim() === '' || goalSubs.trim() === '' || subsPerDay.trim() === '' || isNaN(cur) || isNaN(goal) || isNaN(rate)
      ? 'Please enter valid numbers in all fields.'
      : cur < 0
        ? 'Current subscribers cannot be negative.'
        : goal <= 0
          ? 'Subscriber goal must be greater than 0.'
          : rate <= 0
            ? 'Average new subscribers per day must be greater than 0.'
            : null;

  const needed = !validationError ? Math.max(0, goal - cur) : 0;
  const daysToGoal = !validationError ? Math.ceil(needed / rate) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 self-center mr-1">Quick Goal Presets:</span>
        {[500, 1000, 10000, 100000, 1000000].map((preset) => (
          <button
            type="button"
            key={preset}
            onClick={() => setGoalSubs(preset.toString())}
            className={`px-2.5 py-1 rounded-lg border font-mono font-semibold ${Number(goalSubs) === preset ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
          >
            {preset.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Current Subscribers
          </label>
          <input
            type="number"
            min="0"
            value={currentSubs}
            onChange={(e) => setCurrentSubs(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Subscriber Goal (e.g. 1k YPP)
          </label>
          <input
            type="number"
            min="1"
            value={goalSubs}
            onChange={(e) => setGoalSubs(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Avg New Subs Per Day
          </label>
          <input
            type="number"
            step="0.5"
            min="0.1"
            value={subsPerDay}
            onChange={(e) => setSubsPerDay(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Projected Linear Timeline</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {needed === 0 ? 'Goal already reached (0 days)' : `${daysToGoal.toLocaleString()} days (~${(daysToGoal / 30.4).toFixed(1)} months)`}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {needed === 0
                ? `Your current ${cur.toLocaleString()} subscribers meet the ${goal.toLocaleString()} target.`
                : `Need ${needed.toLocaleString()} more subscribers to reach ${goal.toLocaleString()}.`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold uppercase">Weekly Pace Needed</span>
            <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">{(rate * 7).toFixed(1)} subs/week</div>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeEngagementCalculator() {
  const [views, setViews] = useState('25000');
  const [likes, setLikes] = useState('1200');
  const [comments, setComments] = useState('140');
  const [shares, setShares] = useState('95');

  const v = Number(views);
  const l = Number(likes || 0);
  const c = Number(comments || 0);
  const s = Number(shares || 0);

  const validationError =
    views.trim() === '' || isNaN(v) || isNaN(l) || isNaN(c) || isNaN(s)
      ? 'Please enter valid numbers.'
      : v <= 0
        ? 'Views must be greater than 0 to calculate engagement rate.'
        : l < 0 || c < 0 || s < 0
          ? 'Likes, comments, and shares cannot be negative.'
          : null;

  const totalInteractions = l + c + s;
  const er = !validationError ? (totalInteractions / v) * 100 : 0;

  let benchmark = 'Below Average (< 2%)';
  if (er >= 6) benchmark = 'Exceptional / Viral (6%+)';
  else if (er >= 4) benchmark = 'High Engagement (4% – 6%)';
  else if (er >= 2) benchmark = 'Good / Average (2% – 4%)';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Views</label>
          <input
            type="number"
            min="1"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Likes</label>
          <input
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Comments</label>
          <input
            type="number"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">Shares</label>
          <input
            type="number"
            min="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
          />
        </div>
      </div>

      {validationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Engagement Rate</span>
            <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">{er.toFixed(2)}%</div>
            <span className="text-xs font-medium text-emerald-600 mt-1 block">{benchmark}</span>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1">
            <div>Total Interactions: {totalInteractions.toLocaleString()}</div>
            <div>Like Rate: {((l / v) * 100).toFixed(2)}%</div>
            <div>Comment Rate: {((c / v) * 100).toFixed(2)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubePlaylistDurationCalculator() {
  const [durationsText, setDurationsText] = useState(`12:30\n08:45\n15:20\n04:10\n22:15`);

  const stats = useMemo(() => {
    const lines = durationsText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let totalSecs = 0;
    let count = 0;
    const invalidLines: string[] = [];
    for (const line of lines) {
      const s = parseDurationToSeconds(line);
      if (s !== null) {
        totalSecs += s;
        count++;
      } else {
        invalidLines.push(line);
      }
    }
    const avgSecs = count > 0 ? totalSecs / count : 0;
    return {
      count,
      invalidLines,
      totalSecs,
      formattedTotal: formatSecondsToHMS(totalSecs),
      formattedAvg: formatSecondsToHMS(avgSecs),
      at125x: formatSecondsToHMS(totalSecs / 1.25),
      at150x: formatSecondsToHMS(totalSecs / 1.5),
      at175x: formatSecondsToHMS(totalSecs / 1.75),
      at200x: formatSecondsToHMS(totalSecs / 2.0),
    };
  }, [durationsText]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Paste Video Durations (e.g. MM:SS or HH:MM:SS, one per line)
        </label>
        <textarea
          rows={5}
          value={durationsText}
          onChange={(e) => setDurationsText(e.target.value)}
          placeholder="12:30&#10;08:45&#10;1:05:10"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      {stats.invalidLines.length > 0 && (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          Ignored {stats.invalidLines.length} invalid duration line(s): <span className="font-mono">{stats.invalidLines.join(', ')}</span>. Use MM:SS or HH:MM:SS format.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Total Videos</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{stats.count}</div>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <span className="text-red-700 dark:text-red-400 font-semibold">Total Watch Time (1x)</span>
          <div className="text-lg font-bold text-red-800 dark:text-red-300 mt-0.5">{stats.formattedTotal}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Average Duration</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{stats.formattedAvg}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">At 1.25x Speed</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.at125x}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">At 1.5x Speed</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.at150x}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">At 1.75x Speed</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.at175x}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">At 2x Speed</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.at200x}</div>
        </div>
      </div>
    </div>
  );
}

function YouTubeAspectRatioChecker() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');

  const wNum = Number(width);
  const hNum = Number(height);
  const validationError =
    width.trim() === '' || height.trim() === '' || isNaN(wNum) || isNaN(hNum) || wNum <= 0 || hNum <= 0
      ? 'Width and height must both be positive numbers greater than 0.'
      : null;

  const result = useMemo(() => calculateAspectRatio(Math.round(wNum), Math.round(hNum)), [wNum, hNum]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 self-center mr-1">Presets:</span>
        {[
          {label: '1080p (1920×1080)', w: '1920', h: '1080'},
          {label: '4K (3840×2160)', w: '3840', h: '2160'},
          {label: 'Shorts (1080×1920)', w: '1080', h: '1920'},
          {label: 'Square (1080×1080)', w: '1080', h: '1080'},
        ].map((p) => (
          <button
            type="button"
            key={p.label}
            onClick={() => {
              setWidth(p.w);
              setHeight(p.h);
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:border-red-500"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">Width (px)</label>
          <input
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">Height (px)</label>
          <input
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Detected Aspect Ratio</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {result.simplified} <span className="text-sm font-normal text-slate-500">({result.orientation})</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {result.isStandardYouTube
                ? '✓ Standard 16:9 YouTube format (No black pillarboxes)'
                : result.isShorts
                  ? '✓ Vertical 9:16 format (Perfect for YouTube Shorts)'
                  : '⚠️ Non-standard ratio. YouTube player will letterbox or pillarbox this video.'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              YouTube 16:9 targets: 1280×720 (720p) · 1920×1080 (1080p) · 2560×1440 (1440p) · 3840×2160 (4K)
            </p>
          </div>
          <div className={`px-3 py-1 rounded text-xs font-bold ${result.isStandardYouTube || result.isShorts ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'}`}>
            {result.isStandardYouTube ? '16:9 LANDSCAPE' : result.isShorts ? '9:16 SHORTS' : 'CUSTOM'}
          </div>
        </div>
      )}
    </div>
  );
}

function YouTubeFileSizeEstimator() {
  const [mins, setMins] = useState('10');
  const [bitrate, setBitrate] = useState('15');
  const [uploadMbps, setUploadMbps] = useState('20');

  const minsNum = Number(mins);
  const brMbps = Number(bitrate);
  const upMbps = Number(uploadMbps);

  const validationError =
    mins.trim() === '' || isNaN(minsNum) || minsNum <= 0
      ? 'Video length must be greater than 0 minutes.'
      : isNaN(brMbps) || brMbps <= 0
        ? 'Please select a valid video bitrate.'
        : uploadMbps.trim() !== '' && (isNaN(upMbps) || upMbps <= 0)
          ? 'Upload speed must be greater than 0 Mbps.'
          : null;

  const durationSecs = !validationError ? minsNum * 60 : 0;
  const estimate = useMemo(
    () =>
      estimateVideoFileSize({
        durationSeconds: durationSecs,
        bitrateMbps: brMbps || 15,
        audioBitrateKbps: 0,
      }),
    [durationSecs, brMbps]
  );

  const audioTrackEstimate = useMemo(
    () =>
      estimateVideoFileSize({
        durationSeconds: durationSecs,
        bitrateMbps: 0,
        audioBitrateKbps: 384,
      }),
    [durationSecs]
  );

  const uploadTimeLabel = useMemo(() => {
    if (validationError || !uploadMbps.trim() || upMbps <= 0) return '—';
    const totalMegabits = estimate.sizeMB * 8;
    const secs = totalMegabits / upMbps;
    return formatSecondsToHMS(secs);
  }, [validationError, uploadMbps, upMbps, estimate.sizeMB]);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        Estimates only (VBR exports vary by scene motion) · Formula: (Duration in seconds × Bitrate in Mbps) ÷ 8 = MB (1 GB = 1,000 MB).
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Video Length (Minutes)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.5"
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Total Export Bitrate Preset
          </label>
          <select
            value={bitrate}
            onChange={(e) => setBitrate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="8">1080p 30fps Standard (8 Mbps)</option>
            <option value="15">1080p 60fps High Quality (15 Mbps)</option>
            <option value="25">1440p (2K) 60fps (25 Mbps)</option>
            <option value="45">2160p (4K) 30fps (45 Mbps)</option>
            <option value="68">2160p (4K) 60fps Ultra (68 Mbps)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Upload Speed (Mbps)
          </label>
          <input
            type="number"
            min="1"
            value={uploadMbps}
            onChange={(e) => setUploadMbps(e.target.value)}
            placeholder="e.g. 20"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {validationError ? (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 uppercase">Estimated Size (MB)</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{estimate.sizeMB.toLocaleString()} MB</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 uppercase">Estimated Size (GB)</span>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{estimate.sizeGB} GB</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">YouTube max: 256 GB / 12 hrs</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 uppercase">Est. Upload Time</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{uploadTimeLabel}</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">At {uploadMbps} Mbps</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Separate 384 kbps stereo audio track adds +{audioTrackEstimate.audioMB.toLocaleString()} MB (combined total: {(estimate.sizeMB + audioTrackEstimate.audioMB).toLocaleString()} MB).
          </p>
        </>
      )}
    </div>
  );
}
