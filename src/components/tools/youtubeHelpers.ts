// Pure deterministic browser helpers for YouTube tools (zero AI, zero server calls)

export interface ParsedYouTubeUrl {
  valid: boolean;
  videoId: string | null;
  playlistId: string | null;
  playlistIndex: string | null;
  startSeconds: number | null;
  urlType: 'watch' | 'shorts' | 'youtu.be' | 'embed' | 'live' | 'unknown';
  cleanWatchUrl: string | null;
  shortUrl: string | null;
  embedUrl: string | null;
  error: string | null;
}

export function countCodePoints(str: string): number {
  return [...str].length;
}

export function sliceCodePoints(str: string, max: number): string {
  return [...str].slice(0, max).join('');
}

export function parseYouTubeStartTime(t: string | null): number | null {
  if (!t) return null;
  const trimmed = t.trim();
  if (/^\d+s?$/i.test(trimmed)) {
    return parseInt(trimmed.replace(/s$/i, ''), 10);
  }
  const match = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);
  if (!match) return null;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  const total = h * 3600 + m * 60 + s;
  return total >= 0 ? total : null;
}

export function extractYouTubeInfo(rawInput: string): ParsedYouTubeUrl {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      valid: false,
      videoId: null,
      playlistId: null,
      playlistIndex: null,
      startSeconds: null,
      urlType: 'unknown',
      cleanWatchUrl: null,
      shortUrl: null,
      embedUrl: null,
      error: 'Please enter a YouTube URL or 11-character video ID.',
    };
  }

  // Raw 11-character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      valid: true,
      videoId: trimmed,
      playlistId: null,
      playlistIndex: null,
      startSeconds: null,
      urlType: 'watch',
      cleanWatchUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      shortUrl: `https://youtu.be/${trimmed}`,
      embedUrl: `https://www.youtube.com/embed/${trimmed}`,
      error: null,
    };
  }

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return {
      valid: false,
      videoId: null,
      playlistId: null,
      playlistIndex: null,
      startSeconds: null,
      urlType: 'unknown',
      cleanWatchUrl: null,
      shortUrl: null,
      embedUrl: null,
      error: 'Invalid URL format. Please paste a valid YouTube link such as https://www.youtube.com/watch?v=dQw4w9WgXcQ.',
    };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  const isYouTubeDomain =
    host === 'youtube.com' ||
    host === 'youtu.be' ||
    host === 'youtube-nocookie.com' ||
    host === 'music.youtube.com';

  if (!isYouTubeDomain) {
    return {
      valid: false,
      videoId: null,
      playlistId: null,
      playlistIndex: null,
      startSeconds: null,
      urlType: 'unknown',
      cleanWatchUrl: null,
      shortUrl: null,
      embedUrl: null,
      error: 'URL does not point to a recognized YouTube domain (youtube.com or youtu.be).',
    };
  }

  let videoId: string | null = null;
  let urlType: ParsedYouTubeUrl['urlType'] = 'unknown';

  if (host === 'youtu.be') {
    const seg = url.pathname.split('/').filter(Boolean)[0];
    if (seg && /^[a-zA-Z0-9_-]{11}$/.test(seg)) {
      videoId = seg;
      urlType = 'youtu.be';
    }
  } else {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'watch') {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        videoId = v;
        urlType = 'watch';
      }
    } else if (parts[0] === 'shorts' && parts[1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[1])) {
      videoId = parts[1];
      urlType = 'shorts';
    } else if (parts[0] === 'embed' && parts[1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[1])) {
      videoId = parts[1];
      urlType = 'embed';
    } else if (parts[0] === 'live' && parts[1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[1])) {
      videoId = parts[1];
      urlType = 'live';
    } else if (parts[0] === 'v' && parts[1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[1])) {
      videoId = parts[1];
      urlType = 'watch';
    }
  }

  const playlistId = url.searchParams.get('list');
  const playlistIndex = url.searchParams.get('index');
  const tParam = url.searchParams.get('t') || url.searchParams.get('start');
  const startSeconds = parseYouTubeStartTime(tParam);

  if (!videoId && !playlistId) {
    return {
      valid: false,
      videoId: null,
      playlistId: null,
      playlistIndex: null,
      startSeconds: null,
      urlType: 'unknown',
      cleanWatchUrl: null,
      shortUrl: null,
      embedUrl: null,
      error: 'Could not locate an 11-character YouTube video ID or playlist ID in this URL.',
    };
  }

  const timeSuffixWatch = startSeconds !== null && startSeconds > 0 ? `&t=${startSeconds}s` : '';
  const timeSuffixShort = startSeconds !== null && startSeconds > 0 ? `?t=${startSeconds}` : '';
  const timeSuffixEmbed = startSeconds !== null && startSeconds > 0 ? `?start=${startSeconds}` : '';

  return {
    valid: true,
    videoId,
    playlistId,
    playlistIndex,
    startSeconds,
    urlType,
    cleanWatchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}${timeSuffixWatch}` : null,
    shortUrl: videoId ? `https://youtu.be/${videoId}${timeSuffixShort}` : null,
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}${timeSuffixEmbed}` : null,
    error: null,
  };
}

export function validateYouTubeHandleFormat(raw: string): {
  valid: boolean;
  normalized: string;
  checks: {label: string; passed: boolean}[];
  error: string | null;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      valid: false,
      normalized: '',
      checks: [],
      error: 'Please enter a YouTube @handle to check its syntax.',
    };
  }

  const noAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  const normalized = '@' + noAt;

  const lengthOk = noAt.length >= 3 && noAt.length <= 30;
  const charsOk = /^[a-zA-Z0-9._-]+$/.test(noAt);
  const noLeadingTrailingDotOrDash = !/^[._-]|[._-]$/.test(noAt);
  const noConsecutiveDots = !/\.\./.test(noAt);
  const notUrlLike = !/^(https?|www\.|youtube)/i.test(noAt);
  const notPhoneLike = !/^\d+$/.test(noAt) && !/^[+\d][\d._-]{6,}$/.test(noAt);

  const checks = [
    {label: 'Length between 3 and 30 characters (excluding @)', passed: lengthOk},
    {label: 'Only Latin letters (A-Z), numbers (0-9), periods (.), hyphens (-), underscores (_)', passed: charsOk},
    {label: 'Does not start or end with a period, hyphen, or underscore', passed: noLeadingTrailingDotOrDash},
    {label: 'No consecutive periods (..)', passed: noConsecutiveDots},
    {label: 'Not formatted as a website URL', passed: notUrlLike},
    {label: 'Does not resemble a phone number or numeric-only sequence', passed: notPhoneLike},
  ];

  const valid = checks.every((c) => c.passed);

  return {
    valid,
    normalized,
    checks,
    error: valid ? null : 'Handle violates one or more YouTube @handle syntax rules.',
  };
}

export function calculateYouTubeEarnings(dailyViews: number, rpm: number) {
  const daily = (dailyViews / 1000) * rpm;
  const monthly = daily * 30;
  const yearly = daily * 365;
  return {
    dailyLow: Number((daily * 0.7).toFixed(2)),
    dailyMid: Number(daily.toFixed(2)),
    dailyHigh: Number((daily * 1.3).toFixed(2)),
    monthlyLow: Number((monthly * 0.7).toFixed(2)),
    monthlyMid: Number(monthly.toFixed(2)),
    monthlyHigh: Number((monthly * 1.3).toFixed(2)),
    yearlyLow: Number((yearly * 0.7).toFixed(2)),
    yearlyMid: Number(yearly.toFixed(2)),
    yearlyHigh: Number((yearly * 1.3).toFixed(2)),
  };
}

export function formatSecondsToHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function parseDurationToSeconds(line: string): number | null {
  const cleaned = line.trim();
  if (!cleaned) return null;
  const parts = cleaned.split(':').map((p) => p.trim());
  if (parts.length < 1 || parts.length > 3) return null;
  if (parts.some((p) => !/^\d+$/.test(p))) return null;
  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) {
    if (nums[1] >= 60) return null;
    return nums[0] * 60 + nums[1];
  }
  if (nums[1] >= 60 || nums[2] >= 60) return null;
  return nums[0] * 3600 + nums[1] * 60 + nums[2];
}

const TOPIC_STOPWORDS = new Set([
  'how', 'to', 'the', 'a', 'an', 'in', 'on', 'for', 'with', 'of', 'and', 'or', 'is', 'are', 'your', 'my', 'best', 'easy', 'learn',
]);

const LEADING_TUTORIAL_VERBS = new Set([
  'brew', 'make', 'build', 'cook', 'bake', 'write', 'code', 'edit', 'fix', 'clean', 'grow', 'start',
  'create', 'design', 'setup', 'draw', 'paint', 'play', 'shoot', 'record', 'run', 'use', 'tune',
  'organize', 'manage', 'master', 'study', 'practice', 'improve', 'film', 'photograph', 'roast', 'setup',
]);

function toTitleCaseWord(word: string): string {
  if (!word) return '';
  if (word.startsWith('@')) return word; // preserve handles/decorators like @wraps
  if (/^[A-Z0-9]{2,}$/.test(word)) return word; // preserve acronyms like V60, RGB, SEO
  return word
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ''))
    .join('-');
}

export function toSmartTitleCase(phrase: string): string {
  return phrase
    .trim()
    .split(/\s+/)
    .map((w, idx) => {
      const lower = w.toLowerCase();
      if (idx > 0 && ['to', 'for', 'with', 'of', 'and', 'or', 'in', 'on', 'a', 'an', 'the'].includes(lower)) {
        return lower;
      }
      return toTitleCaseWord(w);
    })
    .join(' ');
}

function toGerund(verb: string): string {
  const v = verb.toLowerCase();
  if (v === 'set') return 'setting';
  if (v === 'run') return 'running';
  if (v.endsWith('e') && !v.endsWith('ee') && !v.endsWith('ie')) {
    return v.slice(0, -1) + 'ing';
  }
  return v + 'ing';
}

export interface ParsedTopicContext {
  raw: string;
  action: string; // e.g. "brew pour-over coffee" or "master Python decorators"
  actionCap: string;
  subject: string; // e.g. "pour-over coffee" or "Python decorators"
  subjectCap: string;
  gerundPhrase: string; // e.g. "brewing pour-over coffee" or "mastering Python decorators"
  gerundCap: string;
  hasHowToPrefix: boolean;
  keywords: string[];
  details: string[];
}

export function parseTopicContext(rawTopic: string, rawDetails = ''): ParsedTopicContext | null {
  const raw = rawTopic.trim();
  if (!raw) return null;

  const hasHowToPrefix = /^(?:how\s+to|learn\s+how\s+to|learn\s+to|learn)\s+/i.test(raw);
  const stripped = raw.replace(/^(?:how\s+to|learn\s+how\s+to|learn\s+to|learn)\s+/i, '').trim() || raw;
  const words = stripped.split(/\s+/);
  const firstLower = words[0]?.toLowerCase() || '';

  let action = stripped;
  let subject = stripped;
  let gerundPhrase = stripped;

  if (LEADING_TUTORIAL_VERBS.has(firstLower) && words.length > 1) {
    subject = words.slice(1).join(' ');
    gerundPhrase = `${toGerund(firstLower)} ${subject}`;
  } else {
    action = `master ${stripped}`;
    gerundPhrase = `mastering ${stripped}`;
  }

  const rawDetailItems = rawDetails
    .split(/[,;|\n]+/)
    .map((d) => d.trim())
    .filter(Boolean);

  const seenDetails = new Set<string>();
  const details: string[] = [];
  for (const item of rawDetailItems) {
    const key = item.toLowerCase();
    if (!seenDetails.has(key)) {
      seenDetails.add(key);
      details.push(item);
    }
  }

  const keywordSet = new Set<string>();
  for (const w of subject.split(/\s+/)) {
    const clean = w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9-]+$/g, '');
    if (clean && !TOPIC_STOPWORDS.has(clean.toLowerCase())) {
      keywordSet.add(clean);
    }
  }

  return {
    raw,
    action,
    actionCap: toSmartTitleCase(action),
    subject,
    subjectCap: toSmartTitleCase(subject),
    gerundPhrase,
    gerundCap: toSmartTitleCase(gerundPhrase),
    hasHowToPrefix,
    keywords: Array.from(keywordSet),
    details,
  };
}

function hasDuplicateWordInsideTag(tag: string): boolean {
  const words = tag
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 1);
  const seen = new Set<string>();
  for (const w of words) {
    if (seen.has(w)) return true;
    seen.add(w);
  }
  return false;
}

function rotateArray<T>(arr: T[], shift: number): T[] {
  if (arr.length === 0) return [];
  const s = ((shift % arr.length) + arr.length) % arr.length;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

export function generateYouTubeTags(keyword: string, details = '', batchIndex = 0): string[] {
  const ctx = parseTopicContext(keyword, details);
  if (!ctx) return [];

  const subj = ctx.subject.toLowerCase();
  const act = ctx.action.toLowerCase();
  const mainFocus = ctx.keywords[ctx.keywords.length - 1]?.toLowerCase() || subj;
  const secondFocus = ctx.keywords.slice(0, 2).join(' ').toLowerCase() || subj;

  const candidates: string[] = [];
  const pushTag = (rawTag: string) => {
    const cleaned = rawTag.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!cleaned || countCodePoints(cleaned) < 2) return;
    if (hasDuplicateWordInsideTag(cleaned)) return;
    if (!candidates.includes(cleaned)) {
      candidates.push(cleaned);
    }
  };

  // Pass 1: clean detail tags (1 concise pairing per detail first)
  for (const d of ctx.details) {
    const dl = d.toLowerCase();
    pushTag(`${dl} ${mainFocus}`);
  }
  for (const d of ctx.details) {
    const dl = d.toLowerCase();
    pushTag(dl);
    pushTag(`${subj} ${dl}`);
  }

  // Diverse, non-repetitive topic & format combinations
  const baseAngles = rotateArray(
    [
      `how to ${act}`,
      `${subj} for beginners`,
      `${subj} step by step`,
      `${subj} mistakes to avoid`,
      `${gerundLower(ctx)} guide`,
      `best ${subj} technique`,
      `${mainFocus} tips 2026`,
      `${subj} workflow`,
      `easy ${subj} method`,
      `${secondFocus} basics`,
      `${subj} troubleshooting`,
      `home ${subj} setup`,
      `${mainFocus} fundamentals`,
      `improve your ${subj}`,
      `${subj} walkthrough 2026`,
    ],
    batchIndex * 3
  );

  for (const item of baseAngles) {
    pushTag(item);
  }

  // Enforce strict <= 500 character ceiling (measured with ", " separator so both "," and ", " stay <= 500)
  const fitTags: string[] = [];
  for (const tag of candidates) {
    const nextJoined = [...fitTags, tag].join(', ');
    if (countCodePoints(nextJoined) <= 500) {
      fitTags.push(tag);
    }
  }

  return fitTags;
}

function gerundLower(ctx: ParsedTopicContext): string {
  return ctx.gerundPhrase.toLowerCase();
}

export function generateYouTubeHashtags(keyword: string, details = '', includeShorts = true): string[] {
  const ctx = parseTopicContext(keyword, details);
  if (!ctx) return [];

  const toPascal = (phrase: string) => {
    const words = phrase
      .split(/[\s-]+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(Boolean);
    const deduped: string[] = [];
    for (const w of words) {
      const lower = w.toLowerCase();
      if (TOPIC_STOPWORDS.has(lower) && words.length > 2) continue;
      if (/^\d+$/.test(w) && words.length > 1) continue; // avoid messy "#116..." from "1:16"
      if (!deduped.some((x) => x.toLowerCase() === lower)) {
        deduped.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      }
    }
    return deduped.join('');
  };

  const subjTag = toPascal(ctx.subject) || toPascal(ctx.raw);
  const mainToken = ctx.keywords[ctx.keywords.length - 1]
    ? toPascal(ctx.keywords[ctx.keywords.length - 1])
    : subjTag;

  const limitBeforeShorts = includeShorts ? 9 : 10;
  const result: string[] = [];
  const pushHashtag = (raw: string) => {
    if (result.length >= limitBeforeShorts) return;
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleaned || cleaned.length < 2) return;
    const formatted = `#${cleaned}`;
    if (!result.some((h) => h.toLowerCase() === formatted.toLowerCase())) {
      result.push(formatted);
    }
  };

  if (subjTag) pushHashtag(subjTag);

  // Pass 1: primary CamelCase tag for each user-supplied detail
  const detailTags: string[] = [];
  for (const d of ctx.details) {
    const dt = toPascal(d);
    if (dt) {
      detailTags.push(dt);
      pushHashtag(dt);
    }
  }

  // Pass 2: compound mainToken + detail tags
  for (const dt of detailTags) {
    if (mainToken && !dt.toLowerCase().includes(mainToken.toLowerCase())) {
      pushHashtag(`${mainToken}${dt}`);
    }
  }

  // Pass 3: fill remaining slots with diverse topic angles
  const extras = [
    `${mainToken}Tips`,
    `Learn${mainToken}`,
    `${mainToken}Craft`,
    `${mainToken}Setup`,
    `${subjTag}Basics`,
    `${mainToken}Method`,
    `Better${mainToken}`,
    `${mainToken}Daily`,
    `${mainToken}2026`,
    `${subjTag}Community`,
  ];

  for (const ex of extras) {
    if (result.length >= limitBeforeShorts) break;
    pushHashtag(ex);
  }

  if (includeShorts) {
    result.push('#Shorts');
  }

  return result;
}

export function generateYouTubeTitles(
  keyword: string,
  style: 'all' | 'tutorial' | 'mistakes' | 'review' = 'all',
  batchIndex = 0,
  details = ''
): string[] {
  const ctx = parseTopicContext(keyword, details);
  if (!ctx) return [];

  const d0 = ctx.details[0] ? toSmartTitleCase(ctx.details[0]) : '';
  const d1 = ctx.details[1] ? toSmartTitleCase(ctx.details[1]) : '';
  const d2 = ctx.details[2] ? toSmartTitleCase(ctx.details[2]) : '';
  const d3 = ctx.details[3] ? toSmartTitleCase(ctx.details[3]) : '';
  const d4 = ctx.details[4] ? toSmartTitleCase(ctx.details[4]) : '';

  const pairDetails = d0 && d1 ? `${d0} & ${d1}` : d0 || 'Core Basics';
  const focusDetail = d1 || d0 || 'Technique';
  const ratioOrStep = d2 || d0 || 'Key Ratios';
  const lateStep = d3 || d1 || 'Timing';
  const finishStep = d4 || d2 || 'Consistency';

  const clip100 = (s: string) => (countCodePoints(s) <= 100 ? s : s.replace(/\s*\([^)]*\)\s*$/, '').trim());

  const pools: Record<'tutorial' | 'mistakes' | 'review', string[]> = {
    tutorial: [
      `How to ${ctx.actionCap} With ${pairDetails} (Step-by-Step)`,
      `${d0 ? `${d0} ` : ''}${ctx.subjectCap}: Dialing In ${focusDetail} & ${ratioOrStep}`,
      `From Zero to Confident ${ctx.gerundCap} (${ratioOrStep} Breakdown)`,
      `The Cleanest ${ctx.subjectCap} Method: ${lateStep} & ${finishStep}`,
      `Beginner-Friendly ${ctx.subjectCap} Guide (${pairDetails} Checklist)`,
      `Why ${focusDetail} Changes Everything When ${ctx.gerundCap}`,
      `${ratioOrStep} Explained: Get Better ${ctx.subjectCap} Results Fast`,
      `Master ${ctx.subjectCap} at Home in 2026 (${lateStep} Method)`,
      `Essential ${ctx.subjectCap} Fundamentals: ${d0 || 'Setup'} to ${finishStep}`,
      `A Practical Walkthrough for ${ctx.gerundCap} Without Guesswork`,
    ].map(clip100),
    mistakes: [
      `5 ${ctx.subjectCap} Mistakes Ruining Your Results (${focusDetail} & ${lateStep})`,
      `Stop Making These ${focusDetail} Errors When ${ctx.gerundCap}`,
      `Why Your ${ctx.subjectCap} Struggles Early On (Check ${ratioOrStep})`,
      `What Nobody Tells You About ${focusDetail} in ${ctx.subjectCap}`,
      `Avoid These Costly ${ctx.subjectCap} Traps in 2026`,
      `Before You Start ${ctx.gerundCap}, Fix Your ${ratioOrStep} First`,
      `The Biggest Myth About ${lateStep} in ${ctx.subjectCap} Tested`,
      `Why Ignoring ${finishStep} Holds Back Your ${ctx.subjectCap}`,
      `3 Common ${d0 || ctx.subjectCap} Habits That Hurt Consistency`,
      `Fix This One ${focusDetail} Problem in Your ${ctx.subjectCap} Routine`,
    ].map(clip100),
    review: [
      `I Tested ${pairDetails} Side by Side for Better ${ctx.subjectCap}`,
      `Honest ${ctx.subjectCap} Breakdown: ${ratioOrStep} vs. Standard Methods`,
      `Does ${lateStep} Really Improve ${ctx.subjectCap}? Let's Test It`,
      `Is Strict ${ratioOrStep} Still Worth It for ${ctx.subjectCap} in 2026?`,
      `The Real Pros & Cons of ${d0 || ctx.subjectCap} Nobody Mentions`,
      `What Changed After Fixing My ${focusDetail} & ${finishStep}`,
      `Simple vs. Precision ${ctx.subjectCap}: Which Approach Wins?`,
      `30 Days Testing ${d0 || ctx.subjectCap} Workflows — Real Takeaways`,
      `An Unfiltered Look at ${ctx.subjectCap} Trade-Offs (${pairDetails})`,
      `My Honest Verdict on ${finishStep} for Everyday ${ctx.subjectCap}`,
    ].map(clip100),
  };

  if (style !== 'all') {
    return rotateArray(pools[style], batchIndex * 3);
  }

  const combined = [
    pools.tutorial[0],
    pools.mistakes[0],
    pools.review[0],
    pools.tutorial[1],
    pools.mistakes[1],
    pools.review[1],
    pools.tutorial[2],
    pools.mistakes[2],
    pools.review[2],
    pools.tutorial[3],
    pools.tutorial[4],
    pools.mistakes[3],
    pools.review[3],
    pools.tutorial[5],
    pools.mistakes[4],
    pools.review[4],
    pools.tutorial[6],
    pools.mistakes[5],
    pools.review[5],
    pools.tutorial[7],
    pools.tutorial[8],
    pools.mistakes[6],
    pools.review[6],
    pools.tutorial[9],
    pools.mistakes[7],
    pools.review[7],
    pools.mistakes[8],
    pools.review[8],
    pools.mistakes[9],
    pools.review[9],
  ];

  const page = ((batchIndex % 3) + 3) % 3;
  return combined.slice(page * 10, page * 10 + 10);
}

export function generateYouTubeHooks(topic: string, detail = '', batchIndex = 0): {style: string; hook: string}[] {
  const ctx = parseTopicContext(topic, detail);
  if (!ctx) return [];

  const d0 = ctx.details[0] || 'your core setup';
  const d1 = ctx.details[1] || 'one overlooked detail';
  const d2 = ctx.details[2] || 'precise timing';
  const d3 = ctx.details[3] || 'consistency';

  const hooks = [
    {
      style: 'Curiosity Gap',
      hook: `If your ${ctx.subject} results feel inconsistent, the culprit is rarely the tools—it comes down to ${d0} and how you handle ${d1}.`,
    },
    {
      style: 'Bold Statement',
      hook: `Stop guessing when ${ctx.gerundPhrase}: dial in ${d1} and ${d2} once, and your results change immediately.`,
    },
    {
      style: 'Relatable Problem',
      hook: `Have you followed every step for ${ctx.gerundPhrase} and still wondered why the final outcome misses the mark? Check your ${d0} first.`,
    },
    {
      style: 'Mistake / Contrast',
      hook: `Most beginners rush straight past ${d3} and focus only on ${d0}—here is why reversing that order makes ${ctx.subject} far more repeatable.`,
    },
    {
      style: 'Quick Result Preview',
      hook: `Over the next few minutes, we will break down ${ctx.gerundPhrase} from ${d0} all the way through ${d2} so you can nail it on your next try.`,
    },
    {
      style: 'Before / After',
      hook: `I used to struggle with ${ctx.subject} every time I skipped ${d1}. Once I locked in ${d2} and ${d3}, everything clicked.`,
    },
  ];

  return rotateArray(hooks, batchIndex);
}

interface ChannelNicheFlavor {
  placeA: string;
  placeB: string;
  placeC: string;
  space: string;
  journal: string;
  almanac: string;
  makersLabel: string;
  altAction: string;
}

function detectChannelNicheFlavor(combinedText: string): ChannelNicheFlavor {
  if (/\b(coffee|espresso|pour-over|latte|tea|matcha|brew|barista|roast|v60|aeropress|cafe)\b/i.test(combinedText)) {
    return {
      placeA: 'Brew Lab',
      placeB: 'Kettle Room',
      placeC: 'Roastery',
      space: 'Bar',
      journal: 'Journal',
      almanac: 'Almanac',
      makersLabel: 'Brewers',
      altAction: 'Brew',
    };
  }
  if (/\b(bread|sourdough|bake|baking|cook|cooking|recipe|kitchen|pastry|ferment|starter|oven|chef|food|meal|cake)\b/i.test(combinedText)) {
    return {
      placeA: 'Test Kitchen',
      placeB: 'Bakehouse',
      placeC: 'Pantry',
      space: 'Oven',
      journal: 'Handbook',
      almanac: 'Almanac',
      makersLabel: 'Bakers',
      altAction: 'Bake',
    };
  }
  if (/\b(python|javascript|typescript|code|coding|dev|software|app|web|react|api|data|flask|algorithm|linux|tech)\b/i.test(combinedText)) {
    return {
      placeA: 'Code Lab',
      placeB: 'Terminal',
      placeC: 'Workbench',
      space: 'Stack',
      journal: 'Digest',
      almanac: 'Blueprint',
      makersLabel: 'Builders',
      altAction: 'Build',
    };
  }
  if (/\b(photo|photography|video|film|edit|editing|design|art|draw|paint|music|audio|guitar|thumbnail|creator)\b/i.test(combinedText)) {
    return {
      placeA: 'Workshop',
      placeB: 'Darkroom',
      placeC: 'Canvas',
      space: 'Frame',
      journal: 'Journal',
      almanac: 'Archive',
      makersLabel: 'Makers',
      altAction: 'Create',
    };
  }
  if (/\b(finance|money|budget|invest|investing|tax|business|startup|marketing|career|freelance)\b/i.test(combinedText)) {
    return {
      placeA: 'Strategy Desk',
      placeB: 'Briefing Room',
      placeC: 'Ledger',
      space: 'Desk',
      journal: 'Brief',
      almanac: 'Playbook',
      makersLabel: 'Founders',
      altAction: 'Grow',
    };
  }
  if (/\b(fitness|workout|gym|run|running|yoga|health|sleep|habit|mindset|productivity)\b/i.test(combinedText)) {
    return {
      placeA: 'Training Lab',
      placeB: 'Fieldhouse',
      placeC: 'Track',
      space: 'Form',
      journal: 'Log',
      almanac: 'Playbook',
      makersLabel: 'Athletes',
      altAction: 'Train',
    };
  }
  return {
    placeA: 'Workshop',
    placeB: 'Studio',
    placeC: 'Press',
    space: 'Desk',
    journal: 'Journal',
    almanac: 'Guide',
    makersLabel: 'Creators',
    altAction: 'Craft',
  };
}

const CHANNEL_GENERIC_TAILS = new Set([
  'craft', 'guide', 'guides', 'tips', 'basics', 'tutorial', 'tutorials',
  '101', 'ideas', 'methods', 'method', 'hacks', 'channel', 'videos',
  'blog', 'at', 'home', 'scratch', 'beginners', 'step',
]);

export function generateYouTubeChannelNames(
  topic: string,
  style: string,
  detail = '',
  batchIndex = 0
): string[] {
  if (!/[a-zA-Z0-9]/.test(topic)) return [];
  const ctx = parseTopicContext(topic, '');
  if (!ctx) return [];

  const cleanSubj = ctx.subject
    .replace(/\s+(?:at\s+home|from\s+scratch|for\s+beginners|step\s+by\s+step|in\s+\d+\s+(?:minutes|days|steps))$/i, '')
    .trim() || ctx.subject;

  const rawWords = cleanSubj
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9-]/g, ''))
    .filter((w) => w.length > 0 && !TOPIC_STOPWORDS.has(w.toLowerCase()));

  const meaningfulWords = rawWords.length > 0
    ? rawWords
    : cleanSubj.split(/\s+/).map((w) => w.replace(/[^a-zA-Z0-9-]/g, '')).filter(Boolean);

  if (meaningfulWords.length === 0) return [];

  const fullPhrase = toSmartTitleCase(meaningfulWords.slice(0, 3).join(' '));
  const nonGenericWords = meaningfulWords.filter((w) => !CHANNEL_GENERIC_TAILS.has(w.toLowerCase()));
  const anchorRaw = nonGenericWords[nonGenericWords.length - 1] || meaningfulWords[meaningfulWords.length - 1];
  const anchorWord = toTitleCaseWord(anchorRaw);

  const leadCandidate = nonGenericWords[0];
  const distinctShort =
    leadCandidate &&
    !leadCandidate.includes('-') &&
    leadCandidate.toLowerCase() !== anchorRaw.toLowerCase() &&
    !/^(personal|modern|everyday|better|simple|easy|quick|smart|basic|new)$/i.test(leadCandidate)
      ? toTitleCaseWord(leadCandidate)
      : anchorWord;

  // Parse details cleanly (supports comma, semicolon, pipe, newline, or " / ")
  const detailItems = detail
    .split(/[,;|\n]+|\s+\/\s+/)
    .map((d) => d.trim().replace(/^@+/, ''))
    .filter((d) => {
      if (!d || !/[a-zA-Z]/.test(d)) return false;
      if (/^\d/.test(d)) return false; // skip ratios/numbers like "1:16 ratio"
      const low = d.toLowerCase();
      if (low === fullPhrase.toLowerCase() || low === anchorWord.toLowerCase() || low === distinctShort.toLowerCase()) {
        return false;
      }
      return true;
    })
    .map((d) => {
      const words = d.split(/\s+/).slice(0, 2).join(' ');
      return toSmartTitleCase(words);
    });

  const uniqueDetails: string[] = [];
  for (const item of detailItems) {
    if (!uniqueDetails.some((x) => x.toLowerCase() === item.toLowerCase())) {
      uniqueDetails.push(item);
    }
  }

  const d0 = uniqueDetails[0] || '';
  const d1 = uniqueDetails[1] || '';
  const d2 = uniqueDetails[2] || '';
  const d3 = uniqueDetails[3] || '';

  const flavor = detectChannelNicheFlavor(`${topic} ${detail}`);
  const batch = ((batchIndex % 3) + 3) % 3;

  const isSameWord = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

  // Pick a second detail distinct from d0 for studio/notes slots
  const secondaryDetail = d2 || d1 || '';
  const tertiaryDetail = d1 && !isSameWord(d1, secondaryDetail) ? d1 : d3 || '';

  const standardBatches: string[][] = [
    [
      `${fullPhrase} Collective`,
      `The ${anchorWord} ${flavor.journal}`,
      d0 ? `${d0} ${flavor.placeA}` : `${flavor.placeC} Lab`,
      secondaryDetail ? `${secondaryDetail} ${flavor.placeB}` : `${flavor.makersLabel} Studio`,
      tertiaryDetail ? `${tertiaryDetail} Notes` : `Notes From the ${flavor.space}`,
      `Purely ${distinctShort}`,
    ],
    [
      `${fullPhrase} Society`,
      `The ${distinctShort} ${flavor.almanac}`,
      d0 ? `${d0} Method` : `${flavor.altAction} Workbench`,
      `Inside the ${flavor.placeB}`,
      tertiaryDetail ? `${tertiaryDetail} Dispatch` : `All Things ${anchorWord}`,
      `Just ${distinctShort}`,
    ],
    [
      `${fullPhrase} Club`,
      `${anchorWord} Field Guide`,
      d0 ? `${d0} Bench` : `${flavor.placeC} Desk`,
      secondaryDetail ? `The ${secondaryDetail} Room` : `Studio ${distinctShort}`,
      `${flavor.makersLabel} Roundtable`,
      `Open ${flavor.space}`,
    ],
  ];

  const minimalBatches: string[][] = [
    [
      `${fullPhrase} Lab`,
      `Just ${distinctShort}`,
      d0 ? `${d0} Studio` : `${flavor.placeC} Room`,
      `Purely ${distinctShort}`,
      secondaryDetail ? `${secondaryDetail} Notes` : `${flavor.space} Index`,
      `The ${flavor.placeB}`,
    ],
    [
      `${fullPhrase} Studio`,
      `Only ${distinctShort}`,
      d0 ? `${d0} Desk` : `Quiet ${flavor.placeB}`,
      `Simply ${anchorWord}`,
      `${flavor.makersLabel} Archive`,
      `${secondaryDetail || flavor.space} Minimal`,
    ],
    [
      `${fullPhrase} Index`,
      `Zero Noise ${anchorWord}`,
      d0 ? `${d0} Frame` : `${flavor.placeC} Notes`,
      `Clean ${distinctShort}`,
      `Inside the ${flavor.placeA}`,
      `${flavor.space} One`,
    ],
  ];

  const creatorBatches: string[][] = [
    [
      `The ${fullPhrase} Show`,
      `${d0 || anchorWord} Sessions`,
      `${flavor.makersLabel} Unfiltered`,
      `Inside the ${flavor.placeB}`,
      `Stories of ${distinctShort}`,
      `${anchorWord} With Us`,
    ],
    [
      `${fullPhrase} Chronicles`,
      `${d0 || distinctShort} Diaries`,
      `Behind the ${flavor.space}`,
      `${flavor.makersLabel} Table`,
      `Weekend ${secondaryDetail || anchorWord}`,
      `Conversations on ${anchorWord}`,
    ],
    [
      `${fullPhrase} Live`,
      `${d0 || flavor.placeC} Cast`,
      `Life Around ${distinctShort}`,
      `${flavor.makersLabel} Hangout`,
      `${secondaryDetail || anchorWord} Walkthroughs`,
      `Hello ${distinctShort}`,
    ],
  ];

  const techBatches: string[][] = [
    [
      `${fullPhrase} Systems`,
      `${d0 || distinctShort} Workflows`,
      `Applied ${anchorWord}`,
      `${secondaryDetail || flavor.placeC} Bench`,
      `The ${distinctShort} Blueprint`,
      `${flavor.makersLabel} Stack`,
    ],
    [
      `${fullPhrase} Lab`,
      `${d0 || anchorWord} Architecture`,
      `${distinctShort} Console`,
      `Practical ${secondaryDetail || anchorWord}`,
      `${flavor.makersLabel} Terminal`,
      `Modular ${distinctShort}`,
    ],
    [
      `${fullPhrase} Engine`,
      `${d0 || distinctShort} Playbook`,
      `Clean ${anchorWord} Ops`,
      `${secondaryDetail || flavor.placeC} Sandbox`,
      `The ${anchorWord} Protocol`,
      `${flavor.makersLabel} HQ`,
    ],
  ];

  const pools: Record<string, string[][]> = {
    standard: standardBatches,
    minimal: minimalBatches,
    creator: creatorBatches,
    tech: techBatches,
  };

  const selectedBatches = pools[style] || pools.standard;
  const candidateList = selectedBatches[batch];

  // Deduplicate cleanly and guarantee 6 distinct names
  const result: string[] = [];
  const pushClean = (raw: string) => {
    const cleaned = raw.replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    if (!result.some((x) => x.toLowerCase() === cleaned.toLowerCase())) {
      result.push(cleaned);
    }
  };

  for (const name of candidateList) {
    pushClean(name);
  }

  // Fallback fill from other batches only if deduplication removed any rare collision
  if (result.length < 6) {
    for (const fallbackBatch of selectedBatches) {
      for (const name of fallbackBatch) {
        if (result.length >= 6) break;
        pushClean(name);
      }
    }
  }

  return result.slice(0, 6);
}

export function generateYouTubeVideoIdeas(
  niche: string,
  category: 'all' | 'tutorial' | 'comparison' | 'listicle' = 'all',
  detail = ''
): {type: 'tutorial' | 'comparison' | 'listicle'; text: string}[] {
  const ctx = parseTopicContext(niche, detail);
  if (!ctx) return [];

  const d0 = ctx.details[0] ? toSmartTitleCase(ctx.details[0]) : 'Core Setup';
  const d1 = ctx.details[1] ? toSmartTitleCase(ctx.details[1]) : 'Key Adjustments';
  const d2 = ctx.details[2] ? toSmartTitleCase(ctx.details[2]) : 'Timing & Pacing';
  const d3 = ctx.details[3] ? toSmartTitleCase(ctx.details[3]) : 'Finishing Technique';

  const allIdeas: {type: 'tutorial' | 'comparison' | 'listicle'; text: string}[] = [
    {
      type: 'tutorial',
      text: `Step-by-Step ${ctx.subjectCap} Walkthrough: Setting Up ${d0} and ${d1}`,
    },
    {
      type: 'tutorial',
      text: `Dialing In ${d2} for Cleaner, More Consistent ${ctx.subjectCap} Results`,
    },
    {
      type: 'comparison',
      text: `Side-by-Side Test: How Small Changes to ${d1} Transform ${ctx.subjectCap}`,
    },
    {
      type: 'comparison',
      text: `Simple vs. Precision ${ctx.subjectCap}: Does ${d2} Really Make a Difference?`,
    },
    {
      type: 'listicle',
      text: `4 Fixable ${ctx.subjectCap} Mistakes: ${d0}, ${d1}, and Rushing ${d3}`,
    },
    {
      type: 'listicle',
      text: `My 5-Minute ${ctx.subjectCap} Checklist From ${d0} to ${d3}`,
    },
  ];

  return category === 'all' ? allIdeas : allIdeas.filter((x) => x.type === category);
}

export function generateYouTubeShortsIdeas(niche: string, detail = ''): string[] {
  const ctx = parseTopicContext(niche, detail);
  if (!ctx) return [];

  const d0 = ctx.details[0] || 'setup';
  const d1 = ctx.details[1] || 'the first adjustment';
  const d2 = ctx.details[2] || 'core ratios';
  const d3 = ctx.details[3] || 'pacing';

  return [
    `30s Fix: How tweaking ${d1} solves flat or uneven ${ctx.subject}`,
    `15s Side-by-Side: Skipping ${d3} vs. taking 30 extra seconds on ${ctx.subject}`,
    `45s Mini-Guide: My exact ${d0} + ${d2} starting point for ${ctx.subject}`,
    `30s Myth Check: Stop overcomplicating ${d0} before you nail ${d1}`,
    `60s Rapid Walkthrough: From ${d0} prep to clean finish in one continuous shot`,
  ];
}

export function generateYouTubeDescription(params: {
  summary: string;
  keyDetails?: string;
  cta?: string;
  resourceLinks?: string;
  socialHandles?: string;
  includeTimestamps: boolean;
  includeResources: boolean;
  includeSocials: boolean;
  includeDisclosure: boolean;
}): string {
  const sum = params.summary.trim();
  if (!sum) return '';

  // Clean summary for parsing topic & clauses without splitting ratio colons like 1:16
  const strippedSum = sum
    .replace(/^(?:in this video(?:\s+we|\s+i)?\s+(?:cover|show|break down|explain|walk through|explore)\s+|learn\s+how\s+to\s+|how\s+to\s+)/i, '')
    .replace(/[.!?]+$/, '')
    .trim();
  const [leadClause, ...afterDash] = strippedSum.split(/\s*(?:[—–]|:\s+)\s*/);
  const withMatch = leadClause.match(/\s+(?:with|using)\s+(?:a|an|the)?\s*([^,]+)$/i);
  const cleanLead = leadClause.replace(/\s+(?:with|using|for|to)\s+(?:a|an|the)?\s*[^,]+$/i, '').trim() || leadClause;

  const autoExtractedDetails = [
    ...(withMatch?.[1] ? [withMatch[1].trim()] : []),
    ...(afterDash.length > 0
      ? afterDash
          .join(', ')
          .replace(/\s+for\s+a\s+[^.]+$/i, '')
          .split(/\s*(?:,|and)\s+/i)
          .map((s) => s.trim())
          .filter((s) => s.length >= 2)
      : []),
  ];

  const effectiveDetails = params.keyDetails?.trim()
    ? params.keyDetails
    : autoExtractedDetails.join(', ');

  const ctx = parseTopicContext(cleanLead || sum, effectiveDetails);
  const subj = ctx?.subjectCap || 'Video Topic';
  const blocks: string[] = [sum];

  if (params.cta?.trim()) {
    blocks.push(`🔔 ${params.cta.trim()}`);
  }

  if (params.includeTimestamps) {
    const details = ctx?.details || [];
    let tsLines: string[];
    if (details.length >= 2) {
      const slotTimes = ['00:00', '01:15', '03:00', '05:15', '07:30', '09:45'];
      tsLines = [`00:00 - ${subj} Overview`];
      details.slice(0, 5).forEach((d, idx) => {
        const time = slotTimes[idx + 1] || `${idx * 2 + 1}:00`;
        tsLines.push(`${time} - ${toSmartTitleCase(d)}`);
      });
    } else if (details.length === 1) {
      const d0 = toSmartTitleCase(details[0]);
      tsLines = [
        `00:00 - ${subj} Intro & ${d0}`,
        `01:30 - Key ${d0} Setup`,
        `04:15 - Step-by-Step ${subj}`,
        `07:45 - Final Tips & Wrap-Up`,
      ];
    } else {
      tsLines = [
        `00:00 - ${subj} Intro & Goal`,
        `01:30 - Setting Up ${subj}`,
        `04:30 - Step-by-Step ${subj} Walkthrough`,
        `08:00 - Troubleshooting & Key Takeaways`,
      ];
    }
    blocks.push(`⏱️ TIMESTAMPS:\n${tsLines.join('\n')}`);
  }

  if (params.includeResources && params.resourceLinks?.trim()) {
    const lines = params.resourceLinks
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `• ${l}`);
    if (lines.length > 0) {
      blocks.push(`🔗 RESOURCES MENTIONED:\n${lines.join('\n')}`);
    }
  }

  if (params.includeSocials && params.socialHandles?.trim()) {
    const lines = params.socialHandles
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `• ${l}`);
    if (lines.length > 0) {
      blocks.push(`📱 CONNECT:\n${lines.join('\n')}`);
    }
  }

  if (params.includeDisclosure) {
    blocks.push('⚖️ DISCLOSURE:\nSome links shared by the creator may be affiliate links at no extra cost to you.');
  }

  const cleanTopicWords = (ctx?.keywords || [])
    .map((w) => w.replace(/[^a-zA-Z0-9-]/g, ''))
    .filter((w) => w.length >= 2 && !['clean', 'sweet', 'cup', 'video', 'exact', 'workflow', 'results'].includes(w.toLowerCase()));
  const seedForTags = cleanTopicWords.slice(0, 3).join(' ') || cleanLead.split(/\s+/).slice(0, 3).join(' ');
  const hashtags = generateYouTubeHashtags(seedForTags, effectiveDetails, false).slice(0, 4);
  if (hashtags.length > 0) {
    blocks.push(hashtags.join(' '));
  }

  return blocks.join('\n\n');
}

export function generateYouTubeScript(params: {
  topic: string;
  targetMins: number;
  format: 'tutorial' | 'review' | 'listicle' | 'story';
  keyPoints?: string;
}): string {
  const ctx = parseTopicContext(params.topic, params.keyPoints || '');
  if (!ctx || !Number.isFinite(params.targetMins) || params.targetMins <= 0) return '';

  const totalSecs = Math.round(params.targetMins * 60);
  const totalWords = Math.round(params.targetMins * 140);
  const steps = ctx.details;

  const tIntro = formatSecondsToHMS(Math.round(totalSecs * 0.08));
  const tSummary = formatSecondsToHMS(Math.round(totalSecs * 0.86));

  const hookWords = Math.round(totalWords * 0.08);
  const introWords = Math.round(totalWords * 0.12);
  const summaryWords = Math.round(totalWords * 0.14);
  const bodyWordsTotal = Math.max(20, totalWords - hookWords - introWords - summaryWords);

  const lines: string[] = [
    `TEMPLATE OUTLINE (~${params.targetMins} min target · ~${totalWords} spoken words at 140 WPM)`,
    '',
    `[0:00 - HOOK (~${hookWords} words)]`,
    `Open on the immediate outcome for ${ctx.gerundPhrase}${steps[0] ? ` (show ${steps[0]} right away)` : ''} without a long channel intro.`,
    '',
    `[${tIntro} - INTRO & GOAL (~${introWords} words)]`,
    `Explain who this ${params.format} is for and what viewers will have ready by ${formatSecondsToHMS(totalSecs)}.`,
  ];

  if (steps.length > 0) {
    const startSec = Math.round(totalSecs * 0.2);
    const endSec = Math.round(totalSecs * 0.84);
    const span = Math.max(10, endSec - startSec);
    const wordsPerStep = Math.round(bodyWordsTotal / steps.length);

    steps.forEach((step, idx) => {
      const secAt = Math.round(startSec + (span * idx) / steps.length);
      const stepLabel = toSmartTitleCase(step);
      lines.push('');
      lines.push(`[${formatSecondsToHMS(secAt)} - STEP ${idx + 1}: ${stepLabel.toUpperCase()} (~${wordsPerStep} words)]`);
      lines.push(`Demonstrate "${stepLabel}" for ${ctx.subject}: show exact setup, one visual cue to check, and one common mistake to avoid.`);
    });
  } else {
    const t2 = formatSecondsToHMS(Math.round(totalSecs * 0.22));
    const t3 = formatSecondsToHMS(Math.round(totalSecs * 0.54));
    const midHeading =
      params.format === 'review'
        ? 'PROS, CONS & REAL TEST RESULTS'
        : params.format === 'listicle'
          ? 'CORE ITEMS & KEY COMPARISONS'
          : params.format === 'story'
            ? 'THE TURNING POINT & LESSON LEARNED'
            : 'STEP-BY-STEP EXECUTION';

    lines.push('');
    lines.push(`[${t2} - SETUP & KEY VARIABLES (~${Math.round(bodyWordsTotal * 0.45)} words)]`);
    lines.push(`Walk through tools, baseline prep, and key inputs needed for ${ctx.gerundPhrase}.`);
    lines.push('');
    lines.push(`[${t3} - ${midHeading} (~${Math.round(bodyWordsTotal * 0.55)} words)]`);
    lines.push(`Show the full ${ctx.subject} process in real time, highlight common pitfalls, and add a visual check-in.`);
  }

  lines.push('');
  lines.push(`[${tSummary} - RECAP & CALL TO ACTION (~${summaryWords} words)]`);
  lines.push(`Summarize the essential takeaway on ${ctx.subject}${steps.length > 0 ? ` (${steps.slice(0, 3).join(', ')})` : ''} and invite questions in a pinned comment.`);

  return lines.join('\n');
}

export function parseYouTubeChapters(input: string): {
  chapters: {time: string; seconds: number; title: string}[];
  errors: string[];
  formatted: string;
} {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const chapters: {time: string; seconds: number; title: string}[] = [];
  const errors: string[] = [];

  if (lines.length === 0) {
    return {
      chapters: [],
      errors: ['Please enter at least 3 timestamp lines starting from 00:00.'],
      formatted: '',
    };
  }

  for (const line of lines) {
    const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)$/);
    if (match) {
      const timeStr = match[1];
      const title = match[2].trim();
      const secs = parseDurationToSeconds(timeStr);
      if (secs !== null) {
        chapters.push({time: timeStr, seconds: secs, title});
      } else {
        errors.push(`Invalid timestamp format in line: "${line}"`);
      }
    } else {
      errors.push(`Line does not start with timestamp (e.g. 01:23 Topic): "${line}"`);
    }
  }

  let isOutOfOrder = false;
  let hasShortChapter = false;
  for (let i = 1; i < chapters.length; i++) {
    if (chapters[i].seconds < chapters[i - 1].seconds) {
      isOutOfOrder = true;
    } else if (chapters[i].seconds - chapters[i - 1].seconds < 10) {
      hasShortChapter = true;
    }
  }

  if (isOutOfOrder) {
    errors.push('Timestamps are out of order — YouTube requires timestamps in strictly ascending chronological order.');
  }
  if (hasShortChapter) {
    errors.push('One or more chapters are shorter than 10 seconds — YouTube requires each chapter to be at least 10 seconds long.');
  }

  if (chapters.length > 0 && chapters[0].seconds !== 0) {
    errors.push('YouTube requires the first chapter to start at 00:00 (or 0:00).');
  }
  if (chapters.length < 3) {
    errors.push('YouTube requires at least 3 timestamps to enable video chapters.');
  }

  const formatted = chapters.map((c) => `${c.time} - ${c.title}`).join('\n');
  return {chapters, errors, formatted};
}

export function calculateAspectRatio(w: number, h: number): {
  ratioText: string;
  isStandardYouTube: boolean;
  isShorts: boolean;
  simplified: string;
  orientation: 'landscape' | 'portrait' | 'square';
} {
  if (w <= 0 || h <= 0) {
    return {ratioText: 'Invalid', isStandardYouTube: false, isShorts: false, simplified: '0:0', orientation: 'landscape'};
  }
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const div = gcd(w, h);
  const sw = w / div;
  const sh = h / div;
  const dec = w / h;

  let simplified = `${sw}:${sh}`;
  if (Math.abs(dec - 16 / 9) < 0.02) simplified = '16:9';
  else if (Math.abs(dec - 9 / 16) < 0.02) simplified = '9:16';
  else if (Math.abs(dec - 4 / 3) < 0.02) simplified = '4:3';
  else if (Math.abs(dec - 1) < 0.02) simplified = '1:1';
  else if (Math.abs(dec - 21 / 9) < 0.05) simplified = '21:9';

  const isStandardYouTube = simplified === '16:9';
  const isShorts = simplified === '9:16';
  const orientation = dec > 1.05 ? 'landscape' : dec < 0.95 ? 'portrait' : 'square';

  return {
    ratioText: `${w} × ${h} (${simplified})`,
    isStandardYouTube,
    isShorts,
    simplified,
    orientation,
  };
}

export function estimateVideoFileSize(params: {
  durationSeconds: number;
  bitrateMbps: number;
  audioBitrateKbps?: number;
}): {
  sizeMB: number;
  sizeGB: number;
  audioMB: number;
  exceedsYouTubeLimit: boolean;
} {
  // Exact decimal bitrate formula: (Mbps × seconds) ÷ 8 = MB (1 MB = 1,000,000 bytes, 1 GB = 1,000 MB)
  const videoMB = (params.bitrateMbps * params.durationSeconds) / 8;
  const audioKbps = params.audioBitrateKbps ?? 0;
  const audioMB = ((audioKbps / 1000) * params.durationSeconds) / 8;
  const sizeMB = Number((videoMB + audioMB).toFixed(2));
  const sizeGB = Number((sizeMB / 1000).toFixed(3));
  // YouTube limit is 256 GB or 12 hours
  const exceedsYouTubeLimit = sizeGB > 256 || params.durationSeconds > 12 * 3600;

  return {
    sizeMB,
    sizeGB,
    audioMB: Number(audioMB.toFixed(2)),
    exceedsYouTubeLimit,
  };
}
