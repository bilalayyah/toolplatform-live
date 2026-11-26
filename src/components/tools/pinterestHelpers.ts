// Pure deterministic browser helpers for Pinterest tools (ZERO AI, ZERO network calls)
import {countUnicodeChars} from './instagramHelpers';

export {countUnicodeChars};

export const PINTEREST_LIMITS = {
  pinTitle: 100,
  pinDescription: 500,
  boardDescription: 500,
  profileBio: 160,
  usernameMin: 3,
  usernameMax: 30,
  altText: 500,
} as const;

export function sliceUnicodeChars(text: string, maxChars: number): string {
  if (maxChars <= 0) return '';
  return Array.from(text).slice(0, maxChars).join('');
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length <= 1) return items;
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

// ---------------------------------------------------------------------------
// 1. Pinterest Username Generator (3–30 chars, letters/numbers/underscores ONLY)
// ---------------------------------------------------------------------------
export type PinterestUsernameStyle = 'descriptive' | 'creative' | 'short';

export interface PinterestUsernameOption {
  id: string;
  username: string;
  chars: number;
  valid: boolean;
}

export function isValidPinterestUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username) && !/^_+$/.test(username);
}

function toPinterestToken(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function generatePinterestUsernames(params: {
  keywords: string;
  style?: PinterestUsernameStyle;
  count?: 5 | 10;
  variation?: number;
}): PinterestUsernameOption[] {
  const cleanedTokens = params.keywords
    .split(/[\s,;&/+-]+/)
    .map(toPinterestToken)
    .filter(Boolean);

  if (cleanedTokens.length === 0) return [];

  const style = params.style ?? 'descriptive';
  const count = params.count ?? 10;
  const variation = params.variation ?? 0;

  const first = cleanedTokens[0];
  const second = cleanedTokens[1] ?? '';
  const joinedUnder = cleanedTokens.slice(0, 3).join('_');
  const joinedCompact = cleanedTokens.slice(0, 3).join('');

  const descriptiveSuffixes = ['ideas', 'guides', 'notes', 'board', 'studio', 'daily', 'hub', 'archive', 'atelier', 'edit'];
  const creativePrefixes = ['curated', 'inspired', 'aesthetic', 'mood', 'hello', 'the', 'simply', 'slow', 'warm', 'modern'];
  const shortSuffixes = ['co', 'pin', 'hq', 'ly', 'lab', 'kit', 'box', 'den', 'bay', 'way'];

  const shift = variation * 2;
  const descRotated = rotateArray(descriptiveSuffixes, shift);
  const creaRotated = rotateArray(creativePrefixes, shift);
  const shortRotated = rotateArray(shortSuffixes, shift);

  const candidates: string[] = [];

  if (style === 'descriptive') {
    candidates.push(
      joinedUnder,
      joinedCompact,
      second ? `${first}${second}_hub` : `${first}_curator`,
      ...descRotated.map((suf) => `${joinedUnder}_${suf}`),
      ...descRotated.map((suf) => `${first}_${suf}`),
    );
  } else if (style === 'creative') {
    candidates.push(
      ...creaRotated.map((pre) => `${pre}_${joinedUnder}`),
      ...creaRotated.map((pre) => `${pre}${joinedCompact}`),
      `${joinedUnder}_mood`,
    );
  } else {
    const shortBase = first.slice(0, 12) + (second ? second.slice(0, 8) : '');
    candidates.push(
      shortBase,
      second ? `${first.slice(0, 10)}_${second.slice(0, 10)}` : `${first.slice(0, 14)}_pins`,
      ...shortRotated.map((suf) => `${shortBase.slice(0, 22)}_${suf}`),
      ...shortRotated.map((suf) => `${first.slice(0, 16)}${suf}`),
    );
  }

  const seen = new Set<string>();
  const validResults: PinterestUsernameOption[] = [];

  for (const raw of candidates) {
    let candidate = toPinterestToken(raw);
    if (candidate.length > PINTEREST_LIMITS.usernameMax) {
      candidate = candidate.slice(0, PINTEREST_LIMITS.usernameMax).replace(/_+$/g, '');
    }
    if (candidate.length < PINTEREST_LIMITS.usernameMin || !isValidPinterestUsername(candidate)) {
      continue;
    }
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    validResults.push({
      id: `pin-u-${candidate}`,
      username: candidate,
      chars: candidate.length,
      valid: true,
    });
    if (validResults.length >= count) break;
  }

  return validResults;
}

// ---------------------------------------------------------------------------
// 2. Pinterest Bio Generator (3–5 bios, strict ≤ 160 chars)
// ---------------------------------------------------------------------------
export type PinterestBioTone = 'friendly' | 'professional' | 'playful';

export interface PinterestBioOption {
  id: string;
  label: string;
  bio: string;
  chars: number;
  withinLimit: boolean;
}

function fitToBioLimit(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (countUnicodeChars(normalized) <= PINTEREST_LIMITS.profileBio) return normalized;
  const sliced = sliceUnicodeChars(normalized, PINTEREST_LIMITS.profileBio - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;.\s]+$/, '')}.`;
}

export function generatePinterestBios(params: {
  niche: string;
  tone?: PinterestBioTone;
  keywords?: string;
  variation?: number;
}): PinterestBioOption[] {
  const niche = params.niche.trim();
  if (!niche) return [];

  const tone = params.tone ?? 'friendly';
  const variation = params.variation ?? 0;
  const kwList = (params.keywords ?? '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 3);
  const kwPhrase = kwList.length > 0 ? kwList.join(', ') : niche;

  const bank: Record<PinterestBioTone, Array<{label: string; build: () => string}>> = {
    friendly: [
      {
        label: 'Curated Inspiration',
        build: () => `Daily ${niche} inspiration featuring ${kwPhrase}. Save boards for simple ideas you can actually try this week.`,
      },
      {
        label: 'Warm Creator',
        build: () => `Sharing practical ${niche} tips, visual checklists & ${kwPhrase} guides to spark your next project.`,
      },
      {
        label: 'Helpful Resource',
        build: () => `Your cozy corner for ${niche}: organized boards on ${kwPhrase} and step-by-step tutorials.`,
      },
      {
        label: 'Community Maker',
        build: () => `Helping creators explore ${niche} with fresh ideas around ${kwPhrase}. Follow for weekly board updates.`,
      },
    ],
    professional: [
      {
        label: 'Editorial Authority',
        build: () => `${niche} specialist curating structured guides, templates & resources on ${kwPhrase}.`,
      },
      {
        label: 'Clear Value Prop',
        build: () => `Actionable ${niche} frameworks & visual lookbooks covering ${kwPhrase}. Explore links for full guides.`,
      },
      {
        label: 'Studio / Brand',
        build: () => `Curated ${niche} archive focused on ${kwPhrase}. Save boards for project planning and design reference.`,
      },
      {
        label: 'Resource Hub',
        build: () => `Practical ${niche} checklists, workflows, and reference boards featuring ${kwPhrase}.`,
      },
    ],
    playful: [
      {
        label: 'Bright & Visual',
        build: () => `Obsessed with ${niche} ✨ Pinning fresh ${kwPhrase} ideas, moodboards & fun weekend projects.`,
      },
      {
        label: 'Spark & Save',
        build: () => `Come for the ${niche} inspo, stay for the ${kwPhrase} deep-dives 📌 New pins saved weekly!`,
      },
      {
        label: 'Creative Moodboard',
        build: () => `Collecting bold ${niche} vibes + clever ${kwPhrase} finds. Hit follow for scroll-worthy boards.`,
      },
      {
        label: 'Weekend Studio',
        build: () => `All things ${niche} — ${kwPhrase}, visual experiments & ideas worth bookmarking for later.`,
      },
    ],
  };

  return rotateArray(bank[tone], variation).map((tpl, idx) => {
    const bio = fitToBioLimit(tpl.build());
    const chars = countUnicodeChars(bio);
    return {
      id: `pin-bio-${tone}-${idx}-${variation}`,
      label: tpl.label,
      bio,
      chars,
      withinLimit: chars <= PINTEREST_LIMITS.profileBio,
    };
  });
}

// ---------------------------------------------------------------------------
// 3. Pinterest Pin Idea Generator
// ---------------------------------------------------------------------------
export type PinterestPinFormatFilter = 'any' | 'infographic' | 'howto' | 'list' | 'quote' | 'product';

export interface PinterestPinIdea {
  id: string;
  number: number;
  format: string;
  pinTitle: string;
  sentence: string;
}

export function generatePinterestPinIdeas(params: {
  niche: string;
  audience?: string;
  pinType?: PinterestPinFormatFilter;
  count?: 5 | 10;
  variation?: number;
}): PinterestPinIdea[] {
  const niche = params.niche.trim();
  if (!niche) return [];

  const audience = params.audience?.trim() || 'beginners and busy creators';
  const pinType = params.pinType ?? 'any';
  const count = params.count ?? 5;
  const variation = params.variation ?? 0;

  const catalog: Array<{type: Exclude<PinterestPinFormatFilter, 'any'>; format: string; pinTitle: string; sentence: string}> = [
    {
      type: 'list',
      format: 'List Pin',
      pinTitle: `10 Practical ${niche} Ideas for ${audience}`,
      sentence: `10 practical ${niche} ideas tailored for ${audience} — use a clean numbered list graphic with bright before-and-after thumbnails.`,
    },
    {
      type: 'howto',
      format: 'How-To Guide',
      pinTitle: `How to Start ${niche} in 5 Simple Steps`,
      sentence: `Step-by-step ${niche} starter walkthrough for ${audience} — showcase numbered step photos stacked vertically in a 2:3 layout.`,
    },
    {
      type: 'infographic',
      format: 'Infographic',
      pinTitle: `${niche} Cheat Sheet & Comparison Chart`,
      sentence: `One-glance ${niche} cheat sheet comparing common options and costs — design a high-contrast infographic Pin built for saves.`,
    },
    {
      type: 'product',
      format: 'Product / Gear Pin',
      pinTitle: `Essential ${niche} Setup Checklist`,
      sentence: `Labeled flatlay or product spotlight highlighting core ${niche} essentials for ${audience} with concise price/feature callouts.`,
    },
    {
      type: 'quote',
      format: 'Quote / Tip Card',
      pinTitle: `One ${niche} Habit Worth Keeping`,
      sentence: `Bold editorial tip card sharing a memorable ${niche} rule of thumb for ${audience} set against minimal textured photography.`,
    },
    {
      type: 'list',
      format: 'List Pin',
      pinTitle: `7 Common ${niche} Mistakes to Skip`,
      sentence: `Visual "Do This / Avoid That" ${niche} comparison list helping ${audience} fix common bottlenecks quickly.`,
    },
    {
      type: 'howto',
      format: 'How-To Guide',
      pinTitle: `Weekend ${niche} Project Blueprint`,
      sentence: `Time-boxed weekend guide to completing a ${niche} refresh from prep to finish with clear tool labels on each panel.`,
    },
    {
      type: 'infographic',
      format: 'Infographic',
      pinTitle: `Seasonal ${niche} Planning Timeline`,
      sentence: `Calendar-style vertical diagram mapping key ${niche} prep milestones for ${audience} 4–6 weeks ahead of peak season.`,
    },
    {
      type: 'product',
      format: 'Product / Gear Pin',
      pinTitle: `Budget vs Splurge: ${niche} Edition`,
      sentence: `Side-by-side split Pin pairing budget-friendly and premium ${niche} picks so ${audience} can compare style and value.`,
    },
    {
      type: 'quote',
      format: 'Quote / Tip Card',
      pinTitle: `Quick Reminder for Your ${niche} Routine`,
      sentence: `Clean serif headline quote card paired with a practical two-line ${niche} caption prompting pinners to bookmark for later.`,
    },
    {
      type: 'list',
      format: 'List Pin',
      pinTitle: `5 Quick ${niche} Upgrades Under 30 Minutes`,
      sentence: `Fast-win 5-card collage spotlighting small ${niche} adjustments that noticeably improve results for ${audience}.`,
    },
    {
      type: 'howto',
      format: 'How-To Guide',
      pinTitle: `Beginner Checklist Before Trying ${niche}`,
      sentence: `Printable-style checklist Pin outlining materials, prep time, and measurements ${audience} need before starting ${niche}.`,
    },
  ];

  const filtered = pinType === 'any' ? catalog : catalog.filter((item) => item.type === pinType);
  // If user filters to a single specific pinType and wants 10, expand with angle variations
  const expanded =
    filtered.length >= count
      ? filtered
      : [
          ...filtered,
          ...filtered.map((item, idx) => ({
            ...item,
            pinTitle: `${item.pinTitle} — Angle ${idx + 2}`,
            sentence: `${item.sentence} Highlight a fresh seasonal or budget focus for ${audience}.`,
          })),
          ...filtered.map((item, idx) => ({
            ...item,
            pinTitle: `Updated ${niche}: ${item.format} #${idx + 3}`,
            sentence: `Fresh visual remix covering ${niche} essentials designed specifically for ${audience} to save and revisit.`,
          })),
        ];

  return rotateArray(expanded, variation)
    .slice(0, count)
    .map((item, idx) => ({
      id: `pin-idea-${idx}-${variation}`,
      number: idx + 1,
      format: item.format,
      pinTitle: item.pinTitle,
      sentence: item.sentence,
    }));
}

// ---------------------------------------------------------------------------
// 4. Pinterest Content Calendar Generator (PLAN ONLY — dated week from startDate)
// ---------------------------------------------------------------------------
export type PinterestCalendarMix = 'any' | 'infographics' | 'howto' | 'quotes' | 'product' | 'mixed';

export interface PinterestCalendarEntry {
  id: string;
  date: string;
  weekday: string;
  format: string;
  pinIdea: string;
  angle: string;
}

const PIN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const DAY_OFFSETS_BY_CADENCE: Record<2 | 3 | 5 | 7, number[]> = {
  2: [0, 3], // e.g., Start + 3 days
  3: [0, 2, 4],
  5: [0, 1, 2, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

const FORMAT_BANK: Record<PinterestCalendarMix, string[]> = {
  any: ['How-To Guide Pin', 'List / Collage Pin', 'Infographic Pin', 'Product Spotlight Pin', 'Tip / Quote Pin'],
  mixed: ['How-To Guide Pin', '2:3 Multi-Photo Collage', 'Infographic Cheat Sheet', 'Product Comparison Pin', 'Quick Tip Card'],
  infographics: ['Step-by-Step Infographic', 'Comparison Matrix Pin', 'Checklist Infographic'],
  howto: ['5-Step Tutorial Pin', 'Before & After Walkthrough', 'Beginner Quick-Start Pin'],
  quotes: ['Editorial Quote Card', 'Rule-of-Thumb Tip Pin', 'Save-Worthy Checklist Quote'],
  product: ['Labeled Flatlay Pin', 'Budget vs Splurge Split', 'Essential Toolkit Pin'],
};

export function buildPinterestContentCalendar(params: {
  niche: string;
  pinsPerWeek: 2 | 3 | 5 | 7;
  startDate: string;
  mix?: PinterestCalendarMix;
}): {valid: boolean; error?: string; entries: PinterestCalendarEntry[]} {
  const niche = params.niche.trim();
  if (!niche) {
    return {valid: false, error: 'Please enter a niche or topic to build your Pin schedule.', entries: []};
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.startDate)) {
    return {valid: false, error: 'Please select a valid start date (YYYY-MM-DD).', entries: []};
  }
  const [y, m, d] = params.startDate.split('-').map(Number);
  const startUtc = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(startUtc.getTime())) {
    return {valid: false, error: 'Invalid calendar start date.', entries: []};
  }

  const mix = params.mix ?? 'mixed';
  const offsets = DAY_OFFSETS_BY_CADENCE[params.pinsPerWeek] ?? DAY_OFFSETS_BY_CADENCE[3];
  const formats = FORMAT_BANK[mix];

  const ideaTemplates = [
    (n: string, f: string) => `7 Essential ${n} Ideas Worth Saving (${f})`,
    (n: string, f: string) => `Step-by-Step ${n} Starter Walkthrough (${f})`,
    (n: string, f: string) => `${n} Planning Checklist: Prep 30–45 Days Early`,
    (n: string, f: string) => `Common ${n} Mistakes & Easy Fixes (${f})`,
    (n: string, f: string) => `Budget-Friendly ${n} Swaps & Visual Lookbook`,
    (n: string, f: string) => `Top 5 ${n} Formulas for Faster Results`,
    (n: string, f: string) => `Weekend ${n} Refresh: Before & After Showcase`,
  ];

  const angleTemplates = [
    (n: string) => `High-contrast 1000×1500 overlay targeting "${n} ideas" searches`,
    (n: string) => `Numbered step tiles with concise keyword hook in first 100 chars`,
    (n: string) => `Vertical diagram built for high bookmark / save intent`,
    (n: string) => `Split 2-photo comparison linking to evergreen guide`,
    (n: string) => `Clean serif headline over warm lifestyle imagery`,
    (n: string) => `4-panel moodboard showcasing cohesive ${n} palette`,
    (n: string) => `Seasonal lead-time refresher pinned to primary ${n} board`,
  ];

  const entries: PinterestCalendarEntry[] = offsets.map((dayOffset, idx) => {
    const dt = new Date(startUtc.getTime() + dayOffset * 86_400_000);
    const isoDate = dt.toISOString().slice(0, 10);
    const weekday = PIN_WEEKDAYS[dt.getUTCDay()];
    const format = formats[idx % formats.length];
    return {
      id: `pin-cal-${isoDate}-${idx}`,
      date: isoDate,
      weekday,
      format,
      pinIdea: ideaTemplates[idx % ideaTemplates.length](niche, format),
      angle: angleTemplates[idx % angleTemplates.length](niche),
    };
  });

  return {valid: true, entries};
}

function escapeCsvCell(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

export function serializePinterestCalendarCsv(entries: PinterestCalendarEntry[]): string {
  const header = ['Date', 'Day', 'Format', 'Pin Idea', 'Angle'].map(escapeCsvCell).join(',');
  const rows = entries.map((e) => [e.date, e.weekday, e.format, e.pinIdea, e.angle].map(escapeCsvCell).join(','));
  return [header, ...rows].join('\n');
}

export function serializePinterestCalendarText(entries: PinterestCalendarEntry[]): string {
  return entries.map((e) => `${e.date} (${e.weekday}) [${e.format}] — ${e.pinIdea}\nAngle: ${e.angle}`).join('\n\n');
}

// ---------------------------------------------------------------------------
// 5. Pinterest Engagement Rate Calculator
//    ER by Impressions = (Saves + Close-ups + Link clicks + Comments) / Impressions * 100
//    ER by Followers   = (Saves + Close-ups + Link clicks + Comments) / Followers * 100
// ---------------------------------------------------------------------------
export interface PinterestEngagementResult {
  valid: boolean;
  error?: string;
  method: 'impressions' | 'followers';
  totalInteractions: number;
  engagementRate: number;
  saveRate: number;
  clickThroughRate: number;
  formulaUsed: string;
}

export function calculatePinterestEngagement(params: {
  method: 'impressions' | 'followers';
  denominator: number;
  saves: number;
  closeUps: number;
  linkClicks: number;
  comments: number;
}): PinterestEngagementResult {
  const {method, denominator, saves, closeUps, linkClicks, comments} = params;

  if (
    !Number.isFinite(denominator) ||
    !Number.isFinite(saves) ||
    !Number.isFinite(closeUps) ||
    !Number.isFinite(linkClicks) ||
    !Number.isFinite(comments)
  ) {
    return {
      valid: false,
      error: 'Please enter valid numbers in every field.',
      method,
      totalInteractions: 0,
      engagementRate: 0,
      saveRate: 0,
      clickThroughRate: 0,
      formulaUsed: '',
    };
  }

  if (saves < 0 || closeUps < 0 || linkClicks < 0 || comments < 0 || denominator < 0) {
    return {
      valid: false,
      error: 'Metrics cannot be negative. Enter 0 or positive values.',
      method,
      totalInteractions: 0,
      engagementRate: 0,
      saveRate: 0,
      clickThroughRate: 0,
      formulaUsed: '',
    };
  }

  if (denominator <= 0) {
    return {
      valid: false,
      error:
        method === 'impressions'
          ? 'Impressions must be greater than 0 because engagement rate divides total actions by Impressions (cannot divide by zero).'
          : 'Followers must be greater than 0 because engagement rate divides total actions by Followers (cannot divide by zero).',
      method,
      totalInteractions: saves + closeUps + linkClicks + comments,
      engagementRate: 0,
      saveRate: 0,
      clickThroughRate: 0,
      formulaUsed: '',
    };
  }

  const totalInteractions = saves + closeUps + linkClicks + comments;
  const engagementRate = Number(((totalInteractions / denominator) * 100).toFixed(2));
  const saveRate = Number(((saves / denominator) * 100).toFixed(2));
  const clickThroughRate = Number(((linkClicks / denominator) * 100).toFixed(2));
  const denomLabel = method === 'impressions' ? 'Impressions' : 'Followers';
  const formulaUsed = `(${saves} Saves + ${closeUps} Close-ups + ${linkClicks} Link clicks + ${comments} Comments) ÷ ${denominator.toLocaleString()} ${denomLabel} × 100 = ${engagementRate}%`;

  return {
    valid: true,
    method,
    totalInteractions,
    engagementRate,
    saveRate,
    clickThroughRate,
    formulaUsed,
  };
}

// ---------------------------------------------------------------------------
// 6. Pinterest Follower Growth Calculator
//    Growth Rate = ((Current - Previous) / Previous) * 100
// ---------------------------------------------------------------------------
export interface PinterestFollowerGrowthResult {
  valid: boolean;
  error?: string;
  growthRatePercent: number;
  absoluteGrowth: number;
  avgGrowthPerDay: number;
  totalDays: number;
  formulaUsed: string;
}

export function calculatePinterestFollowerGrowth(params: {
  previousFollowers: number;
  currentFollowers: number;
  periodValue: number;
  periodUnit: 'days' | 'weeks' | 'months';
}): PinterestFollowerGrowthResult {
  const {previousFollowers, currentFollowers, periodValue, periodUnit} = params;

  if (!Number.isFinite(previousFollowers) || !Number.isFinite(currentFollowers) || !Number.isFinite(periodValue)) {
    return {
      valid: false,
      error: 'Please enter valid numbers for previous followers, current followers, and time period.',
      growthRatePercent: 0,
      absoluteGrowth: 0,
      avgGrowthPerDay: 0,
      totalDays: 0,
      formulaUsed: '',
    };
  }

  if (previousFollowers < 0 || currentFollowers < 0) {
    return {
      valid: false,
      error: 'Follower counts cannot be negative.',
      growthRatePercent: 0,
      absoluteGrowth: 0,
      avgGrowthPerDay: 0,
      totalDays: 0,
      formulaUsed: '',
    };
  }

  if (periodValue <= 0) {
    return {
      valid: false,
      error: 'Time period must be greater than 0 to compute average daily growth.',
      growthRatePercent: 0,
      absoluteGrowth: 0,
      avgGrowthPerDay: 0,
      totalDays: 0,
      formulaUsed: '',
    };
  }

  if (previousFollowers === 0) {
    return {
      valid: false,
      error:
        'Growth rate percentage cannot be computed when Previous Followers is 0 (division by zero). Enter at least 1 starting follower.',
      growthRatePercent: 0,
      absoluteGrowth: currentFollowers,
      avgGrowthPerDay: 0,
      totalDays: 0,
      formulaUsed: '',
    };
  }

  const multiplier = periodUnit === 'weeks' ? 7 : periodUnit === 'months' ? 30 : 1;
  const totalDays = periodValue * multiplier;
  const absoluteGrowth = currentFollowers - previousFollowers;
  const growthRatePercent = Number((((currentFollowers - previousFollowers) / previousFollowers) * 100).toFixed(2));
  const avgGrowthPerDay = Number((absoluteGrowth / totalDays).toFixed(2));
  const formulaUsed = `((${currentFollowers.toLocaleString()} − ${previousFollowers.toLocaleString()}) ÷ ${previousFollowers.toLocaleString()}) × 100 = ${growthRatePercent}%`;

  return {
    valid: true,
    growthRatePercent,
    absoluteGrowth,
    avgGrowthPerDay,
    totalDays,
    formulaUsed,
  };
}

// ---------------------------------------------------------------------------
// 7. Existing + Enhanced Copy Generators (Board Desc, SEO Desc, Alt Text)
// ---------------------------------------------------------------------------
function fitToLimit(text: string, limit: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (countUnicodeChars(normalized) <= limit) return normalized;
  const sliced = sliceUnicodeChars(normalized, limit - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > Math.floor(limit * 0.6) ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;.\s]+$/, '')}.`;
}

export function generatePinterestBoardDescriptions(keyword: string, extraKeywords = '', variation = 0): string[] {
  const kw = keyword.trim();
  if (!kw) return [];
  const extras = extraKeywords
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const kwSuffix = extras.length > 0 ? ` Featuring ${extras.slice(0, 3).join(', ')}.` : '';

  const base = [
    `Explore curated ideas, step-by-step guides, and visual inspiration for ${kw}.${kwSuffix} Save your favorite pins to plan upcoming projects effortlessly.`,
    `Your organized board dedicated to ${kw}.${kwSuffix} Discover practical tutorials, visual checklists, and fresh creative references updated regularly.`,
    `Handpicked ${kw} inspiration in one place.${kwSuffix} Browse layouts, how-to guides, and bookmarkable tips you can revisit anytime.`,
  ];
  return rotateArray(base, variation).map((item) => fitToLimit(item, PINTEREST_LIMITS.boardDescription));
}

export function generatePinterestSeoDescriptions(params: {
  topic: string;
  keywords?: string;
  cta?: string;
  variation?: number;
}): {label: string; text: string; chars: number}[] {
  const topic = params.topic.trim();
  if (!topic) return [];
  const kwList = (params.keywords ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  const kwNatural = kwList.length > 0 ? kwList.join(', ') : topic;
  const cta = params.cta?.trim() || 'Save this Pin for later or tap to read the full guide.';
  const variation = params.variation ?? 0;

  const variants = [
    {
      label: 'Search Hook + Benefit',
      text: `Looking for practical ${topic} ideas? This visual guide covers ${kwNatural} with clear steps you can apply right away. ${cta}`,
    },
    {
      label: 'Checklist & Save Intent',
      text: `${topic} breakdown featuring ${kwNatural}. Bookmark this Pin to keep key tips and examples organized on your favorite board. ${cta}`,
    },
    {
      label: 'Editorial Story Style',
      text: `Simplify your next ${topic} project with actionable ideas around ${kwNatural} — designed for clarity and quick reference. ${cta}`,
    },
  ];

  return rotateArray(variants, variation).map((v) => {
    const fitted = fitToLimit(v.text, PINTEREST_LIMITS.pinDescription);
    return {
      label: v.label,
      text: fitted,
      chars: countUnicodeChars(fitted),
    };
  });
}

export function generatePinterestAltText(params: {
  subject: string;
  colors: string;
  style: string;
  overlayText?: string;
}): string {
  const subj = params.subject.trim();
  const col = params.colors.trim();
  const sty = params.style.trim();
  const overlay = (params.overlayText ?? '').trim();

  if (!subj && !col && !sty && !overlay) return '';

  const parts: string[] = [];
  if (subj) {
    parts.push(`${subj}${col ? ` featuring ${col}` : ''}${sty ? ` in a ${sty}` : ''}.`);
  } else {
    parts.push(`Pin graphic featuring ${col || 'balanced tones'}${sty ? ` in a ${sty}` : ''}.`);
  }
  if (overlay) {
    parts.push(`Text on image reads: "${overlay}".`);
  }
  return fitToLimit(parts.join(' '), PINTEREST_LIMITS.altText);
}
