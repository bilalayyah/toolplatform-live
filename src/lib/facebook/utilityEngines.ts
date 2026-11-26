// Pure deterministic engines for Facebook counters, formatters, calculators, and pickers.

// ============================================================================
// 1. Facebook Hashtag Counter
// ============================================================================
export interface HashtagAnalysis {
  totalCount: number;
  uniqueCount: number;
  tags: string[];
  uniqueTags: string[];
  duplicates: {tag: string; count: number; variants: string[]}[];
  exceedsBestPractice: boolean; // > 10 tags
  emptyInput: boolean;
}

export function analyzeFacebookHashtags(rawText: string): HashtagAnalysis {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return {
      totalCount: 0,
      uniqueCount: 0,
      tags: [],
      uniqueTags: [],
      duplicates: [],
      exceedsBestPractice: false,
      emptyInput: true,
    };
  }

  // Match #tags preceded by start of string or non-word/non-hash boundary
  const regex = /(?:^|[^a-zA-Z0-9_\u00C0-\u024F\u0600-\u06FF])(#[\p{L}\p{N}_]+)/gu;
  const tags: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawText)) !== null) {
    tags.push(match[1]);
  }

  const map = new Map<string, {canonical: string; variants: string[]; count: number}>();
  for (const tag of tags) {
    const key = tag.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.variants.includes(tag)) existing.variants.push(tag);
    } else {
      map.set(key, {canonical: tag, variants: [tag], count: 1});
    }
  }

  const uniqueTags = Array.from(map.values()).map((v) => v.canonical);
  const duplicates = Array.from(map.values())
    .filter((v) => v.count > 1)
    .map((v) => ({tag: v.canonical, count: v.count, variants: v.variants}));

  return {
    totalCount: tags.length,
    uniqueCount: uniqueTags.length,
    tags,
    uniqueTags,
    duplicates,
    exceedsBestPractice: tags.length > 10,
    emptyInput: false,
  };
}

// ============================================================================
// 2. Facebook Text Formatter
// ============================================================================
export type TextFormatAction =
  | 'clean-spaces'
  | 'title-case'
  | 'uppercase'
  | 'lowercase'
  | 'bullet-list'
  | 'remove-empty-lines';

const SMALL_TITLE_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'up', 'with',
]);

export function formatFacebookText(text: string, action: TextFormatAction): string {
  switch (action) {
    case 'clean-spaces':
      return text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'title-case':
      return text.replace(/\S+/g, (word, offset, full) => {
        const lower = word.toLowerCase();
        const isFirst = offset === 0 || full[offset - 1] === '\n';
        if (!isFirst && SMALL_TITLE_WORDS.has(lower)) {
          return lower;
        }
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      });

    case 'bullet-list':
      return text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => `• ${line.replace(/^[•\-*→✓✔▪▫]+\s*/, '')}`)
        .join('\n');

    case 'remove-empty-lines':
      return text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .join('\n');
  }
}

// ============================================================================
// 3. Facebook Character Counter (Unicode Code-Point Aware)
// ============================================================================
export type FacebookFieldKey = 'post' | 'comment' | 'page-name' | 'profile-bio' | 'page-about';

export interface FacebookFieldLimitSpec {
  key: FacebookFieldKey;
  label: string;
  limit: number;
  note: string;
}

export const FACEBOOK_FIELD_LIMITS: readonly FacebookFieldLimitSpec[] = [
  {
    key: 'post',
    label: 'Facebook Post',
    limit: 63206,
    note: 'Standard Facebook feed posts allow up to 63,206 characters (long posts collapse behind "...See more" after ~477 chars).',
  },
  {
    key: 'comment',
    label: 'Facebook Comment',
    limit: 8000,
    note: 'Facebook comments support up to 8,000 characters.',
  },
  {
    key: 'page-name',
    label: 'Facebook Page Name',
    limit: 75,
    note: 'Facebook Page names allow up to 75 characters.',
  },
  {
    key: 'profile-bio',
    label: 'Profile Intro Bio',
    limit: 101,
    note: 'Personal Facebook profile Intro bio limit is 101 characters.',
  },
  {
    key: 'page-about',
    label: 'Page Bio / Short Description',
    limit: 255,
    note: 'Facebook Page About / Short Description supports up to 255 characters.',
  },
];

export interface CharacterAnalysis {
  characters: number; // Unicode code points (emoji = 1 code point)
  utf16Units: number;
  charactersWithoutSpaces: number;
  words: number;
  lines: number;
  limit: number;
  remaining: number; // negative if exceeded
  exceededBy: number;
  percentUsed: number;
  withinLimit: boolean;
}

export function analyzeFacebookCharacters(text: string, fieldKey: FacebookFieldKey): CharacterAnalysis {
  const spec = FACEBOOK_FIELD_LIMITS.find((f) => f.key === fieldKey) ?? FACEBOOK_FIELD_LIMITS[0];
  const codePoints = Array.from(text);
  const characters = codePoints.length;
  const charactersWithoutSpaces = codePoints.filter((cp) => !/\s/.test(cp)).length;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;
  const remaining = spec.limit - characters;
  const exceededBy = remaining < 0 ? Math.abs(remaining) : 0;
  const percentUsed = spec.limit > 0 ? Math.min(100, Number(((characters / spec.limit) * 100).toFixed(1))) : 0;

  return {
    characters,
    utf16Units: text.length,
    charactersWithoutSpaces,
    words,
    lines,
    limit: spec.limit,
    remaining,
    exceededBy,
    percentUsed,
    withinLimit: characters <= spec.limit,
  };
}

// ============================================================================
// 4. Facebook Follower Growth Calculator
// ============================================================================
export type GrowthPeriodUnit = 'days' | 'weeks' | 'months';

export interface FollowerGrowthInput {
  previousRaw: string;
  currentRaw: string;
  periodRaw: string;
  unit: GrowthPeriodUnit;
}

export interface FollowerGrowthResult {
  valid: boolean;
  errors: string[];
  previous: number;
  current: number;
  absoluteGrowth: number;
  growthRatePercent: number | null; // null when previous === 0
  zeroBaselineNotice: string | null;
  totalDays: number;
  averagePerDay: number;
}

export function calculateFollowerGrowth(input: FollowerGrowthInput): FollowerGrowthResult {
  const errors: string[] = [];
  const prevTrim = input.previousRaw.trim();
  const currTrim = input.currentRaw.trim();
  const periodTrim = input.periodRaw.trim();

  const prev = prevTrim === '' ? NaN : Number(prevTrim);
  const curr = currTrim === '' ? NaN : Number(currTrim);
  const period = periodTrim === '' ? NaN : Number(periodTrim);

  if (!Number.isFinite(prev) || prevTrim === '') {
    errors.push('Previous follower count must be a valid number.');
  } else if (prev < 0) {
    errors.push('Previous follower count cannot be negative.');
  }

  if (!Number.isFinite(curr) || currTrim === '') {
    errors.push('Current follower count must be a valid number.');
  } else if (curr < 0) {
    errors.push('Current follower count cannot be negative.');
  }

  if (!Number.isFinite(period) || periodTrim === '') {
    errors.push('Time period must be a valid number.');
  } else if (period <= 0) {
    errors.push('Time period must be greater than 0.');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      previous: 0,
      current: 0,
      absoluteGrowth: 0,
      growthRatePercent: null,
      zeroBaselineNotice: null,
      totalDays: 0,
      averagePerDay: 0,
    };
  }

  const multiplier = input.unit === 'days' ? 1 : input.unit === 'weeks' ? 7 : 30;
  const totalDays = period * multiplier;
  const absoluteGrowth = curr - prev;
  const averagePerDay = absoluteGrowth / totalDays;

  if (prev === 0) {
    return {
      valid: true,
      errors: [],
      previous: prev,
      current: curr,
      absoluteGrowth,
      growthRatePercent: null,
      zeroBaselineNotice:
        'Growth rate (%) cannot be calculated when previous followers = 0 (division by zero). Absolute growth and daily average are shown below.',
      totalDays,
      averagePerDay,
    };
  }

  const growthRatePercent = ((curr - prev) / prev) * 100;
  return {
    valid: true,
    errors: [],
    previous: prev,
    current: curr,
    absoluteGrowth,
    growthRatePercent,
    zeroBaselineNotice: null,
    totalDays,
    averagePerDay,
  };
}

// ============================================================================
// 5. Facebook Engagement Rate Calculator (Followers vs Reach cleanly separated)
// ============================================================================
export type EngagementMethod = 'followers' | 'reach';

export interface EngagementRateInput {
  method: EngagementMethod;
  denominatorRaw: string;
  reactionsRaw: string;
  commentsRaw: string;
  sharesRaw: string;
}

export interface EngagementRateResult {
  valid: boolean;
  errors: string[];
  method: EngagementMethod;
  methodLabel: string;
  formulaLabel: string;
  totalEngagements: number;
  denominator: number;
  engagementRate: number;
  tier: string;
}

export function calculateFacebookEngagementRate(input: EngagementRateInput): EngagementRateResult {
  const errors: string[] = [];
  const denomLabel = input.method === 'followers' ? 'Total Followers' : 'Total Reach';
  const dTrim = input.denominatorRaw.trim();
  const rTrim = input.reactionsRaw.trim() || '0';
  const cTrim = input.commentsRaw.trim() || '0';
  const sTrim = input.sharesRaw.trim() || '0';

  const denominator = dTrim === '' ? NaN : Number(dTrim);
  const reactions = Number(rTrim);
  const comments = Number(cTrim);
  const shares = Number(sTrim);

  if (!Number.isFinite(denominator) || dTrim === '') {
    errors.push(`Please enter a valid number for ${denomLabel}.`);
  } else if (denominator <= 0) {
    errors.push(`${denomLabel} must be greater than 0.`);
  }

  if (!Number.isFinite(reactions) || reactions < 0) errors.push('Reactions must be 0 or a positive number.');
  if (!Number.isFinite(comments) || comments < 0) errors.push('Comments must be 0 or a positive number.');
  if (!Number.isFinite(shares) || shares < 0) errors.push('Shares must be 0 or a positive number.');

  const methodLabel =
    input.method === 'followers' ? 'Engagement Rate by Followers' : 'Engagement Rate by Reach';
  const formulaLabel =
    input.method === 'followers'
      ? '(Total Engagements / Total Followers) × 100'
      : '(Total Engagements / Total Reach) × 100';

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      method: input.method,
      methodLabel,
      formulaLabel,
      totalEngagements: 0,
      denominator: 0,
      engagementRate: 0,
      tier: '',
    };
  }

  const totalEngagements = reactions + comments + shares;
  const er = (totalEngagements / denominator) * 100;
  let tier = 'Low (< 1%)';
  if (er >= 5) tier = 'High (5%+)';
  else if (er >= 2) tier = 'Above Average (2%–5%)';
  else if (er >= 1) tier = 'Solid (1%–2%)';

  return {
    valid: true,
    errors: [],
    method: input.method,
    methodLabel,
    formulaLabel,
    totalEngagements,
    denominator,
    engagementRate: Number(er.toFixed(2)),
    tier,
  };
}

// ============================================================================
// 6. Facebook Giveaway & Comment Picker (Crypto-random Fisher-Yates)
// ============================================================================
export interface WinnerPickerParams {
  rawEntries: string;
  winnerCount: number;
  backupCount: number;
  removeDuplicates: boolean;
  keywordFilter?: string;
}

export interface WinnerPickerResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  totalLines: number;
  duplicatesRemoved: number;
  filteredOutCount: number;
  eligibleCount: number;
  winners: string[];
  backups: string[];
}

function cryptoRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  const g = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const cryptoObj = g && 'crypto' in g ? g.crypto : undefined;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive;
    let x: number;
    do {
      cryptoObj.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

export function pickGiveawayWinners(params: WinnerPickerParams): WinnerPickerResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isInteger(params.winnerCount) || params.winnerCount < 1 || params.winnerCount > 10) {
    errors.push('Number of winners must be a whole number between 1 and 10.');
  }
  if (!Number.isInteger(params.backupCount) || params.backupCount < 0 || params.backupCount > 5) {
    errors.push('Number of backup winners must be a whole number between 0 and 5.');
  }

  const lines = params.rawEntries
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    errors.push('Please paste at least one entrant name or comment (one per line).');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      warnings: [],
      totalLines: lines.length,
      duplicatesRemoved: 0,
      filteredOutCount: 0,
      eligibleCount: 0,
      winners: [],
      backups: [],
    };
  }

  let pool = [...lines];
  let filteredOutCount = 0;
  const kw = (params.keywordFilter || '').trim().toLowerCase();
  if (kw) {
    const before = pool.length;
    pool = pool.filter((entry) => entry.toLowerCase().includes(kw));
    filteredOutCount = before - pool.length;
    if (pool.length === 0) {
      return {
        valid: false,
        errors: [`No pasted entries matched the required keyword "${params.keywordFilter?.trim()}".`],
        warnings: [],
        totalLines: lines.length,
        duplicatesRemoved: 0,
        filteredOutCount,
        eligibleCount: 0,
        winners: [],
        backups: [],
      };
    }
  }

  let duplicatesRemoved = 0;
  if (params.removeDuplicates) {
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const item of pool) {
      const norm = item.toLowerCase();
      if (seen.has(norm)) {
        duplicatesRemoved++;
      } else {
        seen.add(norm);
        deduped.push(item);
      }
    }
    pool = deduped;
  }

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  const totalRequested = params.winnerCount + params.backupCount;
  if (shuffled.length < totalRequested) {
    warnings.push(
      `Only ${shuffled.length} eligible ${shuffled.length === 1 ? 'entry' : 'entries'} available for ${totalRequested} requested slots (${params.winnerCount} winner${params.winnerCount > 1 ? 's' : ''}${params.backupCount > 0 ? ` + ${params.backupCount} backup${params.backupCount > 1 ? 's' : ''}` : ''}). Picked only from real entries without inventing names.`
    );
  }

  const winners = shuffled.slice(0, Math.min(params.winnerCount, shuffled.length));
  const backups =
    params.backupCount > 0 && shuffled.length > winners.length
      ? shuffled.slice(winners.length, Math.min(winners.length + params.backupCount, shuffled.length))
      : [];

  return {
    valid: true,
    errors: [],
    warnings,
    totalLines: lines.length,
    duplicatesRemoved,
    filteredOutCount,
    eligibleCount: pool.length,
    winners,
    backups,
  };
}
