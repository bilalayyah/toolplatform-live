// Pure deterministic browser helpers for Instagram tools (zero AI, zero server calls)

export function countUnicodeChars(text: string): number {
  return Array.from(text).length;
}

export function generateInstagramBios(params: {
  role: string;
  niche: string;
  locationOrProof: string;
  cta: string;
  includeLineBreaks: boolean;
}): {title: string; bio: string; length: number; withinLimit: boolean}[] {
  const role = params.role.trim();
  const niche = params.niche.trim();
  const proof = params.locationOrProof.trim();
  const cta = params.cta.trim();

  if (!role && !niche && !proof && !cta) {
    return [];
  }

  const sep = params.includeLineBreaks ? '\n' : ' · ';
  const joinParts = (parts: (string | false | null | undefined)[], customSep = sep) =>
    parts.filter((p): p is string => Boolean(p && p.trim())).join(customSep);

  const safeRole = role || 'Creator';
  const safeNiche = niche || '';
  const headlineCombo = safeNiche ? `${role ? `${role} | ` : ''}${safeNiche}` : safeRole;

  const templates = [
    {
      title: 'Clean Stacked Creator',
      bio: joinParts([
        role || false,
        niche ? `Helping you with ${niche}` : false,
        proof ? `✨ ${proof}` : false,
        cta || false,
      ]),
    },
    {
      title: 'Minimalist Authority',
      bio: joinParts([
        headlineCombo,
        proof ? `📍 ${proof}` : false,
        cta ? `🔗 ${cta}` : false,
      ]),
    },
    {
      title: 'Punchy Value-First',
      bio: joinParts([
        niche ? `🚀 ${niche}` : role ? `🚀 ${role}` : false,
        role && proof ? `By ${role} • ${proof}` : proof ? `✨ ${proof}` : role && niche ? `By ${role}` : false,
        cta ? `👇 ${cta}` : false,
      ]),
    },
    {
      title: 'Bullet Checklist Style',
      bio: joinParts(
        [
          role ? `✓ ${role}` : false,
          niche ? `✓ ${niche}` : false,
          proof ? `✓ ${proof}` : false,
          cta ? `→ ${cta}` : false,
        ],
        '\n',
      ),
    },
    {
      title: 'Direct & Crisp',
      bio: joinParts([
        role && niche
          ? `${role} sharing ${niche}.`
          : role
            ? `${role}.`
            : niche
              ? `Sharing ${niche}.`
              : false,
        proof || false,
        cta || false,
      ]),
    },
  ];

  return templates.map((t) => {
    const length = countUnicodeChars(t.bio);
    return {
      title: t.title,
      bio: t.bio,
      length,
      withinLimit: length <= 150,
    };
  });
}

export function validateInstagramUsernameFormat(raw: string): {
  valid: boolean;
  normalized: string;
  charCount: number;
  checks: {label: string; passed: boolean}[];
  error: string | null;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      valid: false,
      normalized: '',
      charCount: 0,
      checks: [],
      error: 'Please enter an Instagram handle to validate its syntax.',
    };
  }

  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  if (!handle) {
    return {
      valid: false,
      normalized: '',
      charCount: 0,
      checks: [],
      error: 'Enter characters after the @ symbol to validate your handle.',
    };
  }

  const lengthOk = handle.length >= 1 && handle.length <= 30;
  const charsOk = /^[a-zA-Z0-9._]+$/.test(handle);
  const noTrailingPeriod = !/\.$/.test(handle);
  const noLeadingPeriod = !/^\./.test(handle);
  const noConsecutivePeriods = !/\.\./.test(handle);
  const notAllNumbers = !/^\d+$/.test(handle);

  const checks = [
    {label: `Length is between 1 and 30 characters (${handle.length}/30)`, passed: lengthOk},
    {label: 'Contains only letters (a-z), numbers (0-9), periods (.), and underscores (_)', passed: charsOk},
    {label: 'Does not start with a period (.)', passed: noLeadingPeriod},
    {label: 'Does not end with a period (.)', passed: noTrailingPeriod},
    {label: 'No consecutive periods (..)', passed: noConsecutivePeriods},
    {label: 'Not composed exclusively of numbers', passed: notAllNumbers},
  ];

  const valid = checks.every((c) => c.passed);
  return {
    valid,
    normalized: '@' + handle.toLowerCase(),
    charCount: handle.length,
    checks,
    error: valid ? null : 'Handle does not meet Instagram username syntax rules.',
  };
}

function sanitizeHandleCandidate(candidate: string): string {
  let clean = candidate
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '');
  clean = clean.slice(0, 30).replace(/\.+$/, '');
  if (/^\d+$/.test(clean)) {
    clean = `${clean}_ig`.slice(0, 30);
  }
  return clean;
}

export function formatRawNameToInstagramHandle(
  raw: string,
  extraWord = '',
  separatorStyle: 'all' | 'dots' | 'underscores' | 'prefixes' = 'all',
): string[] {
  const clean = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-–—/]+/g, ' ')
    .replace(/[^a-z0-9\s._]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const extra = extraWord
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (!clean && !extra) return [];

  const words = clean.split(' ').filter(Boolean);
  if (extra && !words.includes(extra)) {
    words.push(extra);
  }

  const baseDot = sanitizeHandleCandidate(words.join('.'));
  const baseUnder = sanitizeHandleCandidate(words.join('_'));
  const compact = sanitizeHandleCandidate(words.join(''));

  const dotVariants = [
    baseDot,
    sanitizeHandleCandidate(`${compact}.co`),
    sanitizeHandleCandidate(`${compact}.studio`),
    sanitizeHandleCandidate(`${words[0] || compact}.hq`),
  ];
  const underVariants = [
    baseUnder,
    sanitizeHandleCandidate(`${compact}_official`),
    sanitizeHandleCandidate(`${words[0] || compact}_${words.slice(1).join('') || 'hub'}`),
  ];
  const prefixVariants = [
    sanitizeHandleCandidate(`the.${baseDot || compact}`),
    sanitizeHandleCandidate(`hey.${baseDot || compact}`),
    sanitizeHandleCandidate(`iam.${compact}`),
    sanitizeHandleCandidate(`by.${baseDot || compact}`),
    compact,
  ];

  let chosen: string[] = [];
  if (separatorStyle === 'dots') chosen = dotVariants;
  else if (separatorStyle === 'underscores') chosen = underVariants;
  else if (separatorStyle === 'prefixes') chosen = prefixVariants;
  else chosen = [baseDot, baseUnder, compact, ...prefixVariants, ...dotVariants, ...underVariants];

  return [...new Set(chosen.filter((h) => h.length > 0 && validateInstagramUsernameFormat(h).valid))];
}

export function formatInstagramUsernameBatch(raw: string): {
  lines: {input: string; dot: string; underscore: string; compact: string}[];
  variations: string[];
} {
  const rows = raw
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return {lines: [], variations: []};
  }

  const lines = rows.map((line) => {
    const clean = line
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-–—/]+/g, ' ')
      .replace(/[^a-z0-9\s._]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = clean.split(' ').filter(Boolean);
    const dot = sanitizeHandleCandidate(words.join('.'));
    const underscore = sanitizeHandleCandidate(words.join('_'));
    const compact = sanitizeHandleCandidate(words.join(''));
    return {
      input: line,
      dot: dot ? `@${dot}` : '',
      underscore: underscore ? `@${underscore}` : '',
      compact: compact ? `@${compact}` : '',
    };
  });

  const first = rows[0];
  const variations = formatRawNameToInstagramHandle(first).map((h) => `@${h}`);

  return {lines, variations};
}

// Unicode stylized text transformer (Mathematical Alphanumeric Symbols)
const FONT_STYLES: {id: string; name: string; transform: (ch: string) => string}[] = [
  {
    id: 'bold-sans',
    name: 'Bold Sans',
    transform: (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + (code - 48));
      return ch;
    },
  },
  {
    id: 'italic-sans',
    name: 'Italic Sans',
    transform: (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d608 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d622 + (code - 97));
      return ch;
    },
  },
  {
    id: 'bold-italic-sans',
    name: 'Bold Italic Sans',
    transform: (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d63c + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d656 + (code - 97));
      return ch;
    },
  },
  {
    id: 'bold-serif',
    name: 'Bold Serif',
    transform: (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d400 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d41a + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ce + (code - 48));
      return ch;
    },
  },
  {
    id: 'script',
    name: 'Cursive / Script',
    transform: (ch) => {
      const special: Record<string, number> = {
        B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b,
        e: 0x212f, g: 0x210a, o: 0x2134,
      };
      if (special[ch]) return String.fromCodePoint(special[ch]);
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d49c + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d4b6 + (code - 97));
      return ch;
    },
  },
  {
    id: 'monospace',
    name: 'Monospace',
    transform: (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d670 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d68a + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7f6 + (code - 48));
      return ch;
    },
  },
  {
    id: 'double-struck',
    name: 'Double-Struck',
    transform: (ch) => {
      const special: Record<string, number> = {
        C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124,
      };
      if (special[ch]) return String.fromCodePoint(special[ch]);
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d538 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d552 + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7d8 + (code - 48));
      return ch;
    },
  },
  {
    id: 'small-caps',
    name: 'Small Caps',
    transform: (ch) => {
      const map: Record<string, string> = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
        k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',
        u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
      };
      return map[ch.toLowerCase()] || ch;
    },
  },
];

export function convertToUnicodeFonts(text: string): {id: string; name: string; result: string}[] {
  return FONT_STYLES.map((style) => ({
    id: style.id,
    name: style.name,
    result: Array.from(text).map(style.transform).join(''),
  }));
}

export function convertToStylishDecorations(text: string, fontId = 'plain'): {name: string; result: string}[] {
  const cleanInput = text.trim() || 'Aesthetic';
  const styled =
    fontId !== 'plain'
      ? convertToUnicodeFonts(cleanInput).find((f) => f.id === fontId)?.result || cleanInput
      : cleanInput;

  return [
    {name: 'Sparkle Wings', result: `✧･ﾟ: *✧･ﾟ:* ${styled} *:･ﾟ✧*:･ﾟ✧`},
    {name: 'Diamond Brackets', result: `◈ ${styled} ◈`},
    {name: 'Aesthetic Stars', result: `★彡 ${styled} 彡★`},
    {name: 'Japanese Corner Brackets', result: `【 ${styled} 】`},
    {name: 'Double Angle Quotes', result: `« ${styled} »`},
    {name: 'Flourish Dots', result: `˙ᵕ˙ ${styled} ˙ᵕ˙`},
    {name: 'Heart Accents', result: `♡ ${styled} ♡`},
    {name: 'Minimal Divider', result: `— ${styled} —`},
  ];
}

export function formatInstagramLineBreaks(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .map((line) => (line === '' ? '\u2800' : line))
    .join('\n');
}

export function formatInstagramTextStyles(text: string): {name: string; val: string}[] {
  const cleanedLines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const bulletsNormalized = cleanedLines
    .split('\n')
    .map((line) => line.replace(/^[-*+•]\s*/, '• ').trim())
    .join('\n');

  const safeText = cleanedLines;
  const upper = safeText.toUpperCase();
  const lower = safeText.toLowerCase();
  const title = safeText.replace(/\b([a-zA-Z])/g, (c) => c.toUpperCase());
  const boldUnicode = convertToUnicodeFonts(safeText).find((f) => f.id === 'bold-sans')?.result || safeText;
  const spaced = safeText
    .split('\n')
    .map((line) => Array.from(line).join(' '))
    .join('\n');
  const strike = safeText
    .split('\n')
    .map((line) => Array.from(line).map((c) => (c === ' ' ? ' ' : c + '\u0336')).join(''))
    .join('\n');

  return [
    {name: 'Cleaned Spacing & Paragraph Breaks', val: formatInstagramLineBreaks(cleanedLines)},
    {name: 'Clean Bullet List (•)', val: formatInstagramLineBreaks(bulletsNormalized)},
    {name: 'Bold Unicode Accent', val: boldUnicode},
    {name: 'Title Case', val: title},
    {name: 'UPPERCASE', val: upper},
    {name: 'lowercase', val: lower},
    {name: 'W i d e  S p a c e d', val: spaced},
    {name: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶', val: strike},
  ];
}

export function calculateInstagramEngagementRate(params: {
  followers: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach?: number | null;
}): {
  totalInteractions: number;
  engagementByFollowers: number;
  engagementByReach: number | null;
  tierLabel: string;
} {
  const totalInteractions = params.likes + params.comments + params.saves + params.shares;
  const er = params.followers > 0 ? (totalInteractions / params.followers) * 100 : 0;
  const erByReach =
    params.reach && params.reach > 0 ? Number(((totalInteractions / params.reach) * 100).toFixed(2)) : null;

  let tierLabel = 'Below Average (<1%)';
  if (er >= 6) tierLabel = 'Viral / Exceptional (6%+)';
  else if (er >= 3) tierLabel = 'High Engagement (3%–6%)';
  else if (er >= 1) tierLabel = 'Good / Solid (1%–3%)';

  return {
    totalInteractions,
    engagementByFollowers: Number(er.toFixed(2)),
    engagementByReach: erByReach,
    tierLabel,
  };
}

export function generateInstagramCaptions(params: {
  topic: string;
  tone: 'inspirational' | 'casual' | 'educational' | 'sales';
  cta: string;
}): {title: string; caption: string; charCount: number}[] {
  const t = params.topic.trim();
  if (!t) return [];
  const cta = params.cta.trim() || 'Save this for later!';

  if (params.tone === 'educational') {
    return [
      {
        title: '3-Step Breakdown',
        caption: `Stop overcomplicating ${t}.\n\nHere is the exact 3-step blueprint you can use today:\n\n1. Foundation — Focus on simplicity first.\n2. Consistency — Show up 15 minutes a day.\n3. Iteration — Review what works and refine.\n\nWhich step are you currently working on?\n\n📌 ${cta}`,
        charCount: 0,
      },
      {
        title: 'Myth vs Reality',
        caption: `Common myth: ${t} takes months to see any real results.\n\nThe reality? With the right fundamentals, small shifts compound rapidly.\n\nRead that again. 💡\n\n👇 ${cta}`,
        charCount: 0,
      },
    ].map((c) => ({...c, charCount: countUnicodeChars(c.caption)}));
  }

  if (params.tone === 'inspirational') {
    return [
      {
        title: 'Daily Reminder',
        caption: `Reminder for today: You don't need to have every detail of ${t} figured out before you begin.\n\nAction creates clarity. Start small, stay consistent, and let momentum do the rest. ✨\n\nDouble tap if you needed this today.\n\n${cta}`,
        charCount: 0,
      },
      {
        title: 'Mindset Shift',
        caption: `Your future self will thank you for the focus you put into ${t} today.\n\nSmall daily habits beat rare bursts of perfection every single time.\n\n📌 ${cta}`,
        charCount: 0,
      },
    ].map((c) => ({...c, charCount: countUnicodeChars(c.caption)}));
  }

  if (params.tone === 'sales') {
    return [
      {
        title: 'Direct Solution Offer',
        caption: `Tired of struggling with ${t}?\n\nWe built a straightforward, zero-fluff workflow designed to help you execute faster.\n\n✅ Clear step-by-step structure\n✅ Built for busy creators & teams\n✅ Practical results from day one\n\n🔗 ${cta}`,
        charCount: 0,
      },
      {
        title: 'Before & After Offer',
        caption: `Before: guessing every step of ${t}.\nAfter: a repeatable process that works every week.\n\nReady to simplify your workflow?\n\n👇 ${cta}`,
        charCount: 0,
      },
    ].map((c) => ({...c, charCount: countUnicodeChars(c.caption)}));
  }

  return [
    {
      title: 'Casual & Behind the Scenes',
      caption: `Just a quick check-in on ${t}.\n\nIt’s easy to get overwhelmed, but taking it one piece at a time makes all the difference.\n\nHow is your week going so far? Let me know below! 👇\n\n${cta}`,
      charCount: 0,
    },
    {
      title: 'Short & Punchy',
      caption: `Real talk about ${t}: consistency always wins.\n\nSave this for when you need a quick boost. ✨\n\n${cta}`,
      charCount: 0,
    },
  ].map((c) => ({...c, charCount: countUnicodeChars(c.caption)}));
}

export function generateInstagramReelCaptions(
  hook: string,
  goal: 'save' | 'share' | 'follow' | 'comment' = 'save',
): {label: string; caption: string; openerChars: number}[] {
  const h = hook.trim();
  if (!h) return [];

  const ctaMap: Record<'save' | 'share' | 'follow' | 'comment', string> = {
    save: '📌 Save this Reel so you can revisit it before your next project.',
    share: '🚀 Send this Reel to a friend who needs to see it today.',
    follow: '➕ Follow for weekly practical breakdowns without the fluff.',
    comment: '👇 Comment "GUIDE" below and let me know your biggest question.',
  };

  const cta = ctaMap[goal];
  const candidates = [
    {
      label: 'Ultra-Short Mobile Opener',
      caption: `${h}.\n\n${cta}\n\n#reels #instareels #creators`,
    },
    {
      label: 'Curiosity + Action Prompt',
      caption: `Most creators miss this about ${h.toLowerCase()} 👀\n\nFull steps in the clip.\n\n${cta}\n\n#reelstips #contentstrategy`,
    },
    {
      label: 'Quick Breakdown Caption',
      caption: `${h}\n\nWatch through the end for the quick recap.\n\n${cta}`,
    },
  ];

  return candidates.map((item) => ({
    label: item.label,
    caption: item.caption,
    openerChars: countUnicodeChars(item.caption.split('\n')[0] || ''),
  }));
}

export function generateInstagramReelHooks(topic: string): string[] {
  const t = topic.trim();
  if (!t) return [];
  return [
    `Stop scrolling if you're still struggling with ${t}!`,
    `The #1 habit for ${t} nobody talks about:`,
    `3 simple tweaks to improve your ${t}:`,
    `If you do ${t}, watch this before posting next.`,
    `Here is why your approach to ${t} stalls:`,
    `I tested ${t} for 30 days—here's what worked:`,
    `Unpopular opinion: most advice on ${t} is outdated.`,
    `My 60-second checklist for better ${t}:`,
  ];
}

export function generateInstagramHashtags(
  keyword: string,
  count = 15,
): {
  highDensity: string[];
  midDensity: string[];
  niche: string[];
  all: string[];
} {
  const rawTerms = keyword
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (rawTerms.length === 0) {
    return {highDensity: [], midDensity: [], niche: [], all: []};
  }

  const sanitizedTerms = rawTerms
    .map((term) => term.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  if (sanitizedTerms.length === 0) {
    return {highDensity: [], midDensity: [], niche: [], all: []};
  }

  const wordTokens = keyword
    .toLowerCase()
    .split(/[\s,\n]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 2);

  const primary = sanitizedTerms[0];
  const secondary = sanitizedTerms[1] || wordTokens[1] || '';

  const highPool = [
    `#${primary}`,
    ...(secondary ? [`#${secondary}`] : []),
    ...wordTokens.slice(0, 3).map((w) => `#${w}`),
    `#${primary}life`,
    `#${primary}daily`,
    `#${primary}love`,
    `#instadaily`,
    `#explorepage`,
    `#instagood`,
    `#photooftheday`,
  ];

  const midPool = [
    `#${primary}community`,
    `#${primary}tips`,
    `#learn${primary}`,
    `#${primary}goals`,
    `#${primary}vibes`,
    `#${primary}style`,
    `#${primary}inspo`,
    ...(secondary ? [`#${secondary}tips`, `#${secondary}community`, `#${primary}${secondary}`] : []),
    `#daily${primary}`,
  ];

  const nichePool = [
    `#${primary}hub`,
    `#${primary}creator`,
    `#${primary}inspiration`,
    `#${primary}strategy`,
    `#${primary}checklist`,
    `#${primary}workflow`,
    `#${primary}guide`,
    `#${primary}studio`,
    ...(secondary ? [`#${secondary}guide`, `#${secondary}studio`, `#${primary}for${secondary}`] : []),
    `#my${primary}journey`,
  ];

  const dedup = (arr: string[]) => [...new Set(arr.filter((t) => /^#[a-z0-9_]+$/.test(t)))];
  const allUnique = dedup([...highPool, ...midPool, ...nichePool]);
  const targetCount = Math.min(30, Math.max(1, count));
  const selectedAll = allUnique.slice(0, targetCount);
  const selectedSet = new Set(selectedAll);

  return {
    highDensity: dedup(highPool).filter((t) => selectedSet.has(t)),
    midDensity: dedup(midPool).filter((t) => selectedSet.has(t)),
    niche: dedup(nichePool).filter((t) => selectedSet.has(t)),
    all: selectedAll,
  };
}

export function analyzeInstagramHashtags(text: string): {
  totalCount: number;
  uniqueCount: number;
  duplicates: {tag: string; count: number}[];
  uniqueTags: string[];
  uniqueString: string;
  exceedsLimit: boolean;
  exceededBy: number;
} {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const counts = new Map<string, {display: string; count: number}>();
  const uniqueTags: string[] = [];

  for (const tag of matches) {
    const key = tag.toLowerCase();
    const existing = counts.get(key);
    if (!existing) {
      counts.set(key, {display: tag, count: 1});
      uniqueTags.push(tag);
    } else {
      existing.count += 1;
    }
  }

  const duplicates = [...counts.values()]
    .filter((entry) => entry.count > 1)
    .map((entry) => ({tag: entry.display, count: entry.count}));

  return {
    totalCount: matches.length,
    uniqueCount: uniqueTags.length,
    duplicates,
    uniqueTags,
    uniqueString: uniqueTags.join(' '),
    exceedsLimit: matches.length > 30,
    exceededBy: Math.max(0, matches.length - 30),
  };
}

export function normalizeHashtagCopyInput(raw: string): {
  tags: string[];
  duplicatesRemoved: number;
  spaceSeparated: string;
  bulletStacked: string;
  dotSpaced: string;
  exceeds30: boolean;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      tags: [],
      duplicatesRemoved: 0,
      spaceSeparated: '',
      bulletStacked: '',
      dotSpaced: '',
      exceeds30: false,
    };
  }

  // If input contains commas or newlines, treat each segment cleanly (e.g. "street photography, nikon" -> "#streetphotography", "#nikon")
  // Otherwise, split on whitespace for raw "#art #design photo" style lists.
  const rawTokens = /[,\n;]/.test(trimmed)
    ? trimmed
        .split(/[,\n;]+/)
        .flatMap((chunk) => {
          const c = chunk.trim();
          if (!c) return [];
          // If a comma-less chunk contains multiple explicit #hashtags, split them too
          if ((c.match(/#/g) || []).length > 1) {
            return c.split(/\s+/);
          }
          return [c];
        })
    : trimmed.split(/\s+/);

  const seen = new Set<string>();
  const tags: string[] = [];
  let duplicatesRemoved = 0;

  for (const token of rawTokens) {
    const cleanBody = token.replace(/^#+/, '').replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanBody) continue;
    const tag = `#${cleanBody}`;
    const lower = tag.toLowerCase();
    if (seen.has(lower)) {
      duplicatesRemoved++;
      continue;
    }
    seen.add(lower);
    tags.push(tag);
  }

  const spaceSeparated = tags.join(' ');
  const bulletStacked = tags.map((t) => `• ${t}`).join('\n');
  const dotSpaced = tags.length > 0 ? `.\n.\n.\n${spaceSeparated}` : '';

  return {
    tags,
    duplicatesRemoved,
    spaceSeparated,
    bulletStacked,
    dotSpaced,
    exceeds30: tags.length > 30,
  };
}

export function mixInstagramHashtagGroups(
  groups: string[],
  targetCount = 15,
): {tags: string[]; totalUniqueAvailable: number} {
  const normalized = normalizeHashtagCopyInput(groups.join('\n'));
  const pool = [...normalized.tags];

  for (let i = pool.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buf);
      const j = buf[0] % (i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    } else {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  const clamped = Math.min(30, Math.max(1, targetCount));
  return {
    tags: pool.slice(0, clamped),
    totalUniqueAvailable: normalized.tags.length,
  };
}

export function generateInstagramPostIdeas(
  niche: string,
  goal: 'all' | 'educate' | 'inspire' | 'promote' | 'bts' = 'all',
): {goal: 'educate' | 'inspire' | 'promote' | 'bts'; format: string; title: string; outline: string}[] {
  const n = niche.trim();
  if (!n) return [];

  const bank: {goal: 'educate' | 'inspire' | 'promote' | 'bts'; format: string; title: string; outline: string}[] = [
    {
      goal: 'educate',
      format: 'Carousel (7 Slides)',
      title: `5 Mistakes Holding Back Your ${n} Results (And Simple Fixes)`,
      outline: `Slide 1: Hook · Slides 2–6: Common ${n} mistakes & quick swaps · Slide 7: Save & Checklist CTA`,
    },
    {
      goal: 'educate',
      format: 'Infographic / Cheat Sheet',
      title: `The Beginner-to-Pro ${n} Framework on One Slide`,
      outline: `Visual pyramid breaking ${n} into Daily, Weekly, and Monthly fundamentals.`,
    },
    {
      goal: 'inspire',
      format: 'Before & After Carousel',
      title: `How Our ${n} Workflow Changed in 6 Months`,
      outline: `Slide 1: Old messy approach · Slide 2–4: Key ${n} turning points · Slide 5: Honest takeaway`,
    },
    {
      goal: 'inspire',
      format: 'Storytelling Single Post',
      title: `Unpopular Lesson After Focusing on ${n} Consistently`,
      outline: `Clean quote graphic + reflective caption sharing what mattered most in ${n}.`,
    },
    {
      goal: 'promote',
      format: 'Solution Carousel',
      title: `Everything Included in Our ${n} Starter Kit`,
      outline: `Show 3 real use cases for ${n}, who it helps most, and clear DM/bio link CTA.`,
    },
    {
      goal: 'bts',
      format: 'Photo Dump / BTS',
      title: `A Realistic Tuesday Building ${n} Projects`,
      outline: `4–5 candid workspace photos showing tools, notes, and iteration in ${n}.`,
    },
  ];

  return goal === 'all' ? bank : bank.filter((item) => item.goal === goal);
}

export function generateInstagramReelIdeas(
  niche: string,
  style: 'all' | 'talking-head' | 'b-roll' | 'tutorial' = 'all',
): {style: 'talking-head' | 'b-roll' | 'tutorial'; duration: string; title: string; shotPrompt: string}[] {
  const n = niche.trim();
  if (!n) return [];

  const bank: {style: 'talking-head' | 'b-roll' | 'tutorial'; duration: string; title: string; shotPrompt: string}[] = [
    {
      style: 'talking-head',
      duration: '20–30s',
      title: `POV: You Simplified ${n} to Just 3 Non-Negotiables`,
      shotPrompt: `Direct camera hook (0–3s) -> Cut every 2–3s showing each ${n} step -> Quick CTA.`,
    },
    {
      style: 'tutorial',
      duration: '30–45s',
      title: `Step-by-Step: 15-Minute ${n} Routine Anyone Can Copy`,
      shotPrompt: `Overhead or screen demo showing real ${n} setup -> Numbered captions 1, 2, 3.`,
    },
    {
      style: 'b-roll',
      duration: '8–12s',
      title: `Faceless B-Roll: The ${n} Checklist I Wish I Had Earlier`,
      shotPrompt: `3 calm workspace clips (2.5s each) + bold center-aligned ${n} takeaway in caption.`,
    },
    {
      style: 'talking-head',
      duration: '15–25s',
      title: `Stop Doing This One ${n} Habit—Try This Swap Instead`,
      shotPrompt: `Split contrast: "What most people do in ${n}" vs "What saves hours".`,
    },
    {
      style: 'b-roll',
      duration: '12–18s',
      title: `Day-in-the-Life Mini Recap: Working on ${n}`,
      shotPrompt: `Fast 1.5s rhythmic transitions across 5 ${n} milestones with short text labels.`,
    },
    {
      style: 'tutorial',
      duration: '25–35s',
      title: `3 Free Tools That Make ${n} Easier Today`,
      shotPrompt: `Show quick close-up of each tool solving a specific ${n} bottleneck.`,
    },
  ];

  return style === 'all' ? bank : bank.filter((item) => item.style === style);
}

export function generateInstagramStoryIdeas(
  topic: string,
  sticker: 'all' | 'poll' | 'quiz' | 'question' | 'countdown' = 'all',
): {sticker: 'poll' | 'quiz' | 'question' | 'countdown'; sequenceTitle: string; text: string; stickerCopy: string}[] {
  const t = topic.trim();
  if (!t) return [];

  const bank: {
    sticker: 'poll' | 'quiz' | 'question' | 'countdown';
    sequenceTitle: string;
    text: string;
    stickerCopy: string;
  }[] = [
    {
      sticker: 'poll',
      sequenceTitle: 'Quick Preference Poll',
      text: `3-Frame ${t} Pulse Check: Frame 1 context photo -> Frame 2 Poll on ${t} -> Frame 3 share result + tip.`,
      stickerCopy: `Poll Sticker: "Biggest hurdle with ${t}?" [Time | Consistency]`,
    },
    {
      sticker: 'quiz',
      sequenceTitle: 'Myth-Buster Quiz Sticker',
      text: `Test followers on a common misconception in ${t}, then explain the right option on the next frame.`,
      stickerCopy: `Quiz Sticker: "True or False about ${t}?" [Always true | Common myth ✓]`,
    },
    {
      sticker: 'question',
      sequenceTitle: 'Q&A Advice Sequence',
      text: `Open a clean Q&A prompt specifically focused on ${t} and answer 2–3 follower replies with text cards.`,
      stickerCopy: `Question Box: "Ask me anything about ${t} today 👇"`,
    },
    {
      sticker: 'countdown',
      sequenceTitle: 'Resource Drop Countdown',
      text: `Tease an upcoming ${t} guide, mini workshop, or new post with a reminder sticker followers can tap.`,
      stickerCopy: `Countdown Sticker: "${t} Guide Drops Friday"`,
    },
  ];

  return sticker === 'all' ? bank : bank.filter((item) => item.sticker === sticker);
}

export function generateInstagramComments(
  topic: string,
  type: 'all' | 'pinned' | 'compliment' | 'qa' = 'all',
): {type: 'pinned' | 'compliment' | 'qa'; label: string; text: string}[] {
  const t = topic.trim();
  if (!t) return [];

  const bank: {type: 'pinned' | 'compliment' | 'qa'; label: string; text: string}[] = [
    {
      type: 'pinned',
      label: 'Pinned Creator Prompt',
      text: `Curious to hear from everyone reading about ${t} — which step are you focusing on first this week? 👇`,
    },
    {
      type: 'compliment',
      label: 'Peer Compliment',
      text: `Such a clear breakdown of ${t}! Saving this post to revisit on our next project. 🙌`,
    },
    {
      type: 'compliment',
      label: 'Thoughtful Appreciation',
      text: `Really appreciate how practical you made ${t} feel—the second slide especially clicked for me. ✨`,
    },
    {
      type: 'qa',
      label: 'Q&A Follow-Up',
      text: `Great tips on ${t}! Quick question: how long did it take for this setup to feel second nature for you?`,
    },
    {
      type: 'pinned',
      label: 'Pinned Bonus Context',
      text: `Bonus note on ${t}: start with just one takeaway today instead of trying everything at once! 📌`,
    },
  ];

  return type === 'all' ? bank : bank.filter((c) => c.type === type);
}

export function generateInstagramReplies(
  comment: string,
  scenario: 'auto' | 'link' | 'thanks' | 'support' | 'collab' = 'auto',
  resourceHint = 'link in bio',
): {detectedIntent: string; replies: string[]} {
  const c = comment.trim();
  if (!c) {
    return {detectedIntent: 'none', replies: []};
  }
  const lower = c.toLowerCase();
  const hint = resourceHint.trim() || 'link in bio';

  let active = scenario;
  if (active === 'auto') {
    if (/(price|cost|how much|usd|\$|ship|deliver|stock|available|hours|open)/.test(lower)) {
      active = 'support';
    } else if (/(collab|partner|sponsor|brand|promo|dm|email|work together)/.test(lower)) {
      active = 'collab';
    } else if (/(link|where|get this|template|download|find|send)/.test(lower)) {
      active = 'link';
    } else if (/(thank|love|amazing|helpful|awesome|great|fire|spot on)/.test(lower)) {
      active = 'thanks';
    } else if (c.includes('?')) {
      active = 'support';
    } else {
      active = 'thanks';
    }
  }

  if (active === 'link') {
    return {
      detectedIntent: 'Link Request',
      replies: [
        `Just popped it in my ${hint}! Hope it helps with what you asked ("${c.slice(0, 48)}${c.length > 48 ? '...' : ''}") ✨`,
        `You can grab it anytime via the ${hint} — let me know how it works for you! 🙌`,
        `Happy to share! Check the top button in my ${hint} or send a quick DM if you need a direct pointer.`,
      ],
    };
  }

  if (active === 'support') {
    return {
      detectedIntent: 'Support & Pricing / Question',
      replies: [
        `Great question! All details and options are listed under our ${hint} — feel free to DM us if you want help picking the right fit.`,
        `Thanks for asking about "${c.slice(0, 48)}${c.length > 48 ? '...' : ''}"! We've shared full info in the ${hint}, and our inbox is open for specifics.`,
        `Happy to clarify! Send us a quick message so we can share the exact answer for your setup cleanly.`,
      ],
    };
  }

  if (active === 'collab') {
    return {
      detectedIntent: 'Collaboration Inquiry',
      replies: [
        `Appreciate you reaching out! Please send a quick brief via DM or the contact email in my ${hint} so we can review dates properly. 🙌`,
        `Thanks so much for the note! Drop your concept details in a DM and I'll take a look this week.`,
        `Always open to thoughtful partnerships — feel free to send your media kit or idea via our ${hint} contact!`,
      ],
    };
  }

  return {
    detectedIntent: 'Appreciation / Thank You',
    replies: [
      `Thank you so much! Really glad this resonated with you — appreciate you taking the time to comment 🙌`,
      `So happy to hear that! Let me know which part you try first ✨`,
      `Appreciate the kind words! More practical breakdowns coming soon.`,
    ],
  };
}

export function generateInstagramDms(params: {
  recipient: string;
  topic: string;
  category: 'collab' | 'welcome' | 'event' | 'support';
}): string[] {
  const name = params.recipient.trim();
  const topic = params.topic.trim();
  if (!name || !topic) return [];

  if (params.category === 'welcome') {
    return [
      `Hey ${name}! Thanks so much for following along here. Since you're into ${topic}, feel free to reply anytime with what you're working on—I always love hearing from people in the community!`,
      `Hi ${name}, glad to have you here! If you ever have questions around ${topic}, my inbox is always open. Cheers!`,
    ];
  }

  if (params.category === 'event') {
    return [
      `Hey ${name}! Hope your week is going well. We're hosting an upcoming session on ${topic} and thought of your work right away. Happy to share the details if you'd like to join or collaborate!`,
      `Hi ${name}, quick invite: we're putting together a community meetup around ${topic}. Let me know if you'd be free to stop by!`,
    ];
  }

  if (params.category === 'support') {
    return [
      `Hi ${name}, thanks for reaching out! Following up on ${topic} — here is a quick update so everything stays clear for you. Reply anytime if you need anything else adjusted.`,
      `Hey ${name}! Wanted to follow up directly regarding ${topic} to make sure you're all set. Let us know if you have any follow-up questions.`,
    ];
  }

  return [
    `Hey ${name}! Really enjoyed your recent posts. I was wondering if you'd be open to ${topic}? No rush at all, just thought it could be a natural fit for both of our audiences. Cheers!`,
    `Hi ${name}, love what you're building! Would love to share a quick 2-line pitch around ${topic} whenever you have a spare minute this week.`,
  ];
}

export function calculateFollowerGrowthMilestones(params: {
  currentRaw: string;
  rateRaw: string;
  targetRaw: string;
}): {
  valid: boolean;
  error: string | null;
  current: number;
  rate: number;
  target: number;
  month3: number;
  month6: number;
  month12: number;
  monthsToTarget: number | null;
  milestones: {label: string; value: number; status: 'reached' | 'projected' | 'flat'; months: number | null}[];
} {
  const cur = Number(params.currentRaw.trim());
  const rate = Number(params.rateRaw.trim());
  const target = Number(params.targetRaw.trim());

  if (!params.currentRaw.trim() || Number.isNaN(cur) || cur < 1) {
    return {
      valid: false,
      error: 'Current followers must be at least 1 to project percentage growth.',
      current: 0,
      rate: 0,
      target: 0,
      month3: 0,
      month6: 0,
      month12: 0,
      monthsToTarget: null,
      milestones: [],
    };
  }
  if (!params.rateRaw.trim() || Number.isNaN(rate) || rate < 0 || rate > 500) {
    return {
      valid: false,
      error: 'Monthly growth rate must be between 0% and 500%.',
      current: cur,
      rate: 0,
      target: 0,
      month3: 0,
      month6: 0,
      month12: 0,
      monthsToTarget: null,
      milestones: [],
    };
  }
  if (!params.targetRaw.trim() || Number.isNaN(target) || target < 1) {
    return {
      valid: false,
      error: 'Target followers must be a positive number.',
      current: cur,
      rate,
      target: 0,
      month3: 0,
      month6: 0,
      month12: 0,
      monthsToTarget: null,
      milestones: [],
    };
  }

  const r = rate / 100;
  const project = (m: number) => Math.round(cur * Math.pow(1 + r, m));
  const monthsTo = (goal: number): number | null => {
    if (cur >= goal) return 0;
    if (r <= 0) return null;
    return Math.ceil(Math.log(goal / cur) / Math.log(1 + r));
  };

  const milestoneTargets = [
    {label: '1K', value: 1000},
    {label: '10K', value: 10000},
    {label: '50K', value: 50000},
    {label: '100K', value: 100000},
  ];

  const milestones = milestoneTargets.map((m) => {
    if (cur >= m.value) {
      return {...m, status: 'reached' as const, months: 0};
    }
    if (r <= 0) {
      return {...m, status: 'flat' as const, months: null};
    }
    return {...m, status: 'projected' as const, months: monthsTo(m.value)};
  });

  return {
    valid: true,
    error: null,
    current: Math.round(cur),
    rate,
    target: Math.round(target),
    month3: project(3),
    month6: project(6),
    month12: project(12),
    monthsToTarget: cur >= target ? 0 : monthsTo(target),
    milestones,
  };
}

export function calculateFollowerGrowth(params: {
  current: number;
  monthlyGrowthRatePercent: number;
  target: number;
}): {
  month3: number;
  month6: number;
  month12: number;
  monthsToTarget: number | null;
} {
  const cur = Math.max(1, params.current);
  const r = Math.max(0, params.monthlyGrowthRatePercent) / 100;
  const project = (m: number) => Math.round(cur * Math.pow(1 + r, m));

  const month3 = project(3);
  const month6 = project(6);
  const month12 = project(12);

  let monthsToTarget: number | null = null;
  if (params.target > cur && r > 0) {
    monthsToTarget = Math.ceil(Math.log(params.target / cur) / Math.log(1 + r));
  }

  return {month3, month6, month12, monthsToTarget};
}

export function pickInstagramGiveawayWinners(params: {
  rawEntries: string;
  winnerCount: number;
  backupCount: number;
  removeDuplicates: boolean;
  keywordFilter?: string;
}): {
  valid: boolean;
  error: string | null;
  warning: string | null;
  eligibleCount: number;
  duplicatesRemoved: number;
  winners: string[];
  backups: string[];
} {
  const lines = params.rawEntries
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      valid: false,
      error: 'Please paste at least one entrant or comment line before drawing.',
      warning: null,
      eligibleCount: 0,
      duplicatesRemoved: 0,
      winners: [],
      backups: [],
    };
  }

  const kw = (params.keywordFilter || '').trim().toLowerCase();
  const filtered = kw ? lines.filter((line) => line.toLowerCase().includes(kw)) : lines;
  if (filtered.length === 0) {
    return {
      valid: false,
      error: `No pasted entries contain the keyword "${params.keywordFilter?.trim()}". Clear or change the filter.`,
      warning: null,
      eligibleCount: 0,
      duplicatesRemoved: 0,
      winners: [],
      backups: [],
    };
  }

  let pool: string[] = [];
  let duplicatesRemoved = 0;
  if (params.removeDuplicates) {
    const seen = new Set<string>();
    for (const item of filtered) {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        duplicatesRemoved++;
      } else {
        seen.add(key);
        pool.push(item);
      }
    }
  } else {
    pool = [...filtered];
  }

  const wantWinners = Math.min(10, Math.max(1, params.winnerCount));
  const wantBackups = Math.min(5, Math.max(0, params.backupCount));

  // Unbiased Fisher-Yates shuffle via crypto.getRandomValues
  for (let i = pool.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buf);
      const j = buf[0] % (i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    } else {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  const winners = pool.slice(0, wantWinners);
  const backups = pool.slice(wantWinners, wantWinners + wantBackups);

  let warning: string | null = null;
  if (pool.length < wantWinners + wantBackups) {
    warning = `Only ${pool.length} eligible ${pool.length === 1 ? 'entry' : 'entries'} available — drew ${winners.length} winner(s) and ${backups.length} backup(s).`;
  }

  return {
    valid: true,
    error: null,
    warning,
    eligibleCount: pool.length,
    duplicatesRemoved,
    winners,
    backups,
  };
}

export interface CalendarSlot {
  id: string;
  date: string;
  dayName: string;
  format: string;
  pillar: string;
  goal: string;
  note: string;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function buildInstagramContentCalendar(params: {
  daysPerWeek: 3 | 4 | 5 | 7;
  startDate: string;
  pillars: string[];
  weeks?: number;
}): CalendarSlot[] {
  const cleanPillars = params.pillars.map((p) => p.trim()).filter(Boolean);
  const pillars = cleanPillars.length > 0 ? cleanPillars.slice(0, 4) : ['Educational Tips', 'Behind-the-Scenes', 'Product / Offer', 'Community Q&A'];

  const startMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(params.startDate);
  const baseDate = startMatch
    ? new Date(Date.UTC(Number(startMatch[1]), Number(startMatch[2]) - 1, Number(startMatch[3])))
    : new Date(Date.UTC(2026, 0, 5));

  const offsetsByFrequency: Record<3 | 4 | 5 | 7, number[]> = {
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };

  const formats = ['Carousel Post', 'Reel (9:16)', 'Story Sequence', 'Single Graphic Post'];
  const goals = ['Saves & Shares', 'Explore Reach', 'Replies & DMs', 'Profile Visits'];
  const weeks = Math.min(4, Math.max(1, params.weeks ?? 2));
  const offsets = offsetsByFrequency[params.daysPerWeek];

  const rows: CalendarSlot[] = [];
  let idx = 0;
  for (let w = 0; w < weeks; w++) {
    for (const dayOffset of offsets) {
      const d = new Date(baseDate.getTime() + (w * 7 + dayOffset) * 86400000);
      const iso = d.toISOString().slice(0, 10);
      const dayName = WEEKDAY_NAMES[d.getUTCDay()];
      const format = formats[idx % formats.length];
      const pillar = pillars[idx % pillars.length];
      const goal = goals[idx % goals.length];
      rows.push({
        id: `${iso}-${idx}`,
        date: iso,
        dayName,
        format,
        pillar,
        goal,
        note: `${pillar} — ${format} focused on ${goal.toLowerCase()}`,
      });
      idx++;
    }
  }
  return rows;
}

export interface TimezoneOption {
  id: string;
  label: string;
  offsetMinutes: number;
}

export const POSTING_TIMEZONES: TimezoneOption[] = [
  {id: 'America/New_York', label: 'New York (EST, UTC-5)', offsetMinutes: -300},
  {id: 'America/Chicago', label: 'Chicago (CST, UTC-6)', offsetMinutes: -360},
  {id: 'America/Los_Angeles', label: 'Los Angeles (PST, UTC-8)', offsetMinutes: -480},
  {id: 'Europe/London', label: 'London (GMT, UTC+0)', offsetMinutes: 0},
  {id: 'Europe/Berlin', label: 'Berlin / Paris (CET, UTC+1)', offsetMinutes: 60},
  {id: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)', offsetMinutes: 240},
  {id: 'Asia/Karachi', label: 'Karachi (PKT, UTC+5)', offsetMinutes: 300},
  {id: 'Asia/Kolkata', label: 'Mumbai / Delhi (IST, UTC+5:30)', offsetMinutes: 330},
  {id: 'Asia/Tokyo', label: 'Tokyo (JST, UTC+9)', offsetMinutes: 540},
  {id: 'Australia/Sydney', label: 'Sydney (AEST, UTC+10)', offsetMinutes: 600},
];

type IndustryKey = 'tech' | 'creator' | 'fitness' | 'ecommerce';

const INDUSTRY_BENCHMARK_HOURS: Record<
  IndustryKey,
  {day: string; peakStartMin: number; peakEndMin: number; secStartMin: number; secEndMin: number}[]
> = {
  tech: [
    {day: 'Monday', peakStartMin: 11 * 60, peakEndMin: 13 * 60, secStartMin: 19 * 60, secEndMin: 20 * 60 + 30},
    {day: 'Tuesday', peakStartMin: 9 * 60, peakEndMin: 11 * 60, secStartMin: 17 * 60 + 30, secEndMin: 19 * 60},
    {day: 'Wednesday', peakStartMin: 11 * 60, peakEndMin: 13 * 60 + 30, secStartMin: 18 * 60, secEndMin: 20 * 60},
    {day: 'Thursday', peakStartMin: 12 * 60, peakEndMin: 14 * 60, secStartMin: 19 * 60, secEndMin: 20 * 60 + 30},
    {day: 'Friday', peakStartMin: 10 * 60, peakEndMin: 12 * 60, secStartMin: 16 * 60, secEndMin: 18 * 60},
    {day: 'Saturday', peakStartMin: 10 * 60, peakEndMin: 12 * 60, secStartMin: 17 * 60, secEndMin: 18 * 60 + 30},
    {day: 'Sunday', peakStartMin: 18 * 60, peakEndMin: 20 * 60, secStartMin: 11 * 60, secEndMin: 12 * 60 + 30},
  ],
  creator: [
    {day: 'Monday', peakStartMin: 12 * 60, peakEndMin: 14 * 60, secStartMin: 19 * 60, secEndMin: 21 * 60},
    {day: 'Tuesday', peakStartMin: 11 * 60, peakEndMin: 13 * 60, secStartMin: 18 * 60, secEndMin: 20 * 60},
    {day: 'Wednesday', peakStartMin: 12 * 60, peakEndMin: 14 * 60, secStartMin: 20 * 60, secEndMin: 21 * 60 + 30},
    {day: 'Thursday', peakStartMin: 13 * 60, peakEndMin: 15 * 60, secStartMin: 19 * 60, secEndMin: 21 * 60},
    {day: 'Friday', peakStartMin: 11 * 60, peakEndMin: 13 * 60, secStartMin: 17 * 60, secEndMin: 19 * 60},
    {day: 'Saturday', peakStartMin: 9 * 60 + 30, peakEndMin: 11 * 60 + 30, secStartMin: 16 * 60, secEndMin: 18 * 60},
    {day: 'Sunday', peakStartMin: 17 * 60, peakEndMin: 19 * 60 + 30, secStartMin: 10 * 60, secEndMin: 12 * 60},
  ],
  fitness: [
    {day: 'Monday', peakStartMin: 6 * 60 + 30, peakEndMin: 8 * 60 + 30, secStartMin: 17 * 60, secEndMin: 19 * 60},
    {day: 'Tuesday', peakStartMin: 7 * 60, peakEndMin: 9 * 60, secStartMin: 18 * 60, secEndMin: 19 * 60 + 30},
    {day: 'Wednesday', peakStartMin: 6 * 60 + 30, peakEndMin: 8 * 60 + 30, secStartMin: 17 * 60 + 30, secEndMin: 19 * 60},
    {day: 'Thursday', peakStartMin: 7 * 60, peakEndMin: 9 * 60, secStartMin: 18 * 60, secEndMin: 20 * 60},
    {day: 'Friday', peakStartMin: 7 * 60, peakEndMin: 9 * 60, secStartMin: 16 * 60, secEndMin: 17 * 60 + 30},
    {day: 'Saturday', peakStartMin: 8 * 60, peakEndMin: 10 * 60 + 30, secStartMin: 15 * 60, secEndMin: 17 * 60},
    {day: 'Sunday', peakStartMin: 9 * 60, peakEndMin: 11 * 60, secStartMin: 18 * 60, secEndMin: 20 * 60},
  ],
  ecommerce: [
    {day: 'Monday', peakStartMin: 12 * 60, peakEndMin: 14 * 60, secStartMin: 20 * 60, secEndMin: 21 * 60 + 30},
    {day: 'Tuesday', peakStartMin: 10 * 60, peakEndMin: 12 * 60, secStartMin: 19 * 60, secEndMin: 21 * 60},
    {day: 'Wednesday', peakStartMin: 11 * 60, peakEndMin: 13 * 60, secStartMin: 20 * 60, secEndMin: 22 * 60},
    {day: 'Thursday', peakStartMin: 12 * 60, peakEndMin: 14 * 60, secStartMin: 19 * 60 + 30, secEndMin: 21 * 60},
    {day: 'Friday', peakStartMin: 11 * 60, peakEndMin: 13 * 60, secStartMin: 15 * 60, secEndMin: 17 * 60},
    {day: 'Saturday', peakStartMin: 10 * 60, peakEndMin: 12 * 60, secStartMin: 19 * 60, secEndMin: 21 * 60},
    {day: 'Sunday', peakStartMin: 19 * 60, peakEndMin: 21 * 60, secStartMin: 11 * 60, secEndMin: 13 * 60},
  ],
};

function formatClock(totalMinutes: number): {text: string; dayShift: -1 | 0 | 1} {
  let dayShift: -1 | 0 | 1 = 0;
  let m = totalMinutes;
  if (m < 0) {
    dayShift = -1;
    m += 1440;
  } else if (m >= 1440) {
    dayShift = 1;
    m -= 1440;
  }
  const h24 = Math.floor(m / 60) % 24;
  const mins = m % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    text: `${h12}:${mins.toString().padStart(2, '0')} ${period}`,
    dayShift,
  };
}

function formatShiftedRange(startMin: number, endMin: number, deltaMin: number): string {
  const s = formatClock(startMin + deltaMin);
  const e = formatClock(endMin + deltaMin);
  const shiftSuffix =
    s.dayShift === 1 ? ' (+1d)' : s.dayShift === -1 ? ' (-1d)' : '';
  return `${s.text} – ${e.text}${shiftSuffix}`;
}

export function calculatePostingTimes(params: {
  industry: IndustryKey;
  audienceTzId: string;
  creatorTzId: string;
}): {day: string; audiencePeak: string; localPeak: string; localSecondary: string}[] {
  const aud = POSTING_TIMEZONES.find((t) => t.id === params.audienceTzId) || POSTING_TIMEZONES[0];
  const cre = POSTING_TIMEZONES.find((t) => t.id === params.creatorTzId) || POSTING_TIMEZONES[0];
  const delta = cre.offsetMinutes - aud.offsetMinutes;

  const base = INDUSTRY_BENCHMARK_HOURS[params.industry] || INDUSTRY_BENCHMARK_HOURS.tech;
  return base.map((row) => ({
    day: row.day,
    audiencePeak: formatShiftedRange(row.peakStartMin, row.peakEndMin, 0),
    localPeak: formatShiftedRange(row.peakStartMin, row.peakEndMin, delta),
    localSecondary: formatShiftedRange(row.secStartMin, row.secEndMin, delta),
  }));
}

export function extractDominantPaletteFromPixels(
  data: Uint8ClampedArray,
  maxColors = 6,
): {hex: string; rgb: string; percent: number}[] {
  const step = 24;
  const buckets = new Map<string, {count: number; rSum: number; gSum: number; bSum: number}>();
  let totalOpaque = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue;
    totalOpaque++;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.floor(r / step)}-${Math.floor(g / step)}-${Math.floor(b / step)}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count++;
      bucket.rSum += r;
      bucket.gSum += g;
      bucket.bSum += b;
    } else {
      buckets.set(key, {count: 1, rSum: r, gSum: g, bSum: b});
    }
  }

  if (totalOpaque === 0) return [];

  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
  const chosen: {r: number; g: number; b: number; count: number}[] = [];

  for (const b of sorted) {
    const r = Math.round(b.rSum / b.count);
    const g = Math.round(b.gSum / b.count);
    const bl = Math.round(b.bSum / b.count);
    const tooClose = chosen.some(
      (c) => Math.hypot(c.r - r, c.g - g, c.b - bl) < 42,
    );
    if (!tooClose) {
      chosen.push({r, g, b: bl, count: b.count});
    }
    if (chosen.length >= maxColors) break;
  }

  // Fallback if image is mostly monochromatic so user still gets swatches
  if (chosen.length < Math.min(maxColors, sorted.length)) {
    for (const b of sorted) {
      const r = Math.round(b.rSum / b.count);
      const g = Math.round(b.gSum / b.count);
      const bl = Math.round(b.bSum / b.count);
      const exactSame = chosen.some((c) => c.r === r && c.g === g && c.b === bl);
      if (!exactSame) {
        chosen.push({r, g, b: bl, count: b.count});
      }
      if (chosen.length >= maxColors) break;
    }
  }

  return chosen.map((c) => {
    const hex = `#${((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1).toUpperCase()}`;
    const percent = Math.max(1, Math.round((c.count / totalOpaque) * 100));
    return {hex, rgb: `rgb(${c.r}, ${c.g}, ${c.b})`, percent};
  });
}

export const INSTAGRAM_FONT_PAIRS = [
  {
    name: 'Modern Editorial',
    mood: 'editorial',
    headingFont: 'Playfair Display, Georgia, serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    ratio: '44px / 18px',
    sampleTitle: 'Aesthetic Summer Curation',
    sampleSubtitle: 'Effortless styling tips for your everyday feed.',
  },
  {
    name: 'Bold Punchy Tech',
    mood: 'bold',
    headingFont: 'Impact, Haettenschweiler, sans-serif',
    bodyFont: 'system-ui, sans-serif',
    ratio: '48px / 18px',
    sampleTitle: 'BREAKTHROUGH FORMULA',
    sampleSubtitle: 'Stop guessing your reach metrics. Measure what matters.',
  },
  {
    name: 'Minimal Luxury',
    mood: 'minimal',
    headingFont: 'Cinzel, Georgia, serif',
    bodyFont: 'Montserrat, system-ui, sans-serif',
    ratio: '40px / 16px',
    sampleTitle: 'MONOCHROME ESSENTIALS',
    sampleSubtitle: 'Timeless designs for conscious creators.',
  },
  {
    name: 'Friendly Creator',
    mood: 'friendly',
    headingFont: 'Outfit, system-ui, sans-serif',
    bodyFont: 'Open Sans, system-ui, sans-serif',
    ratio: '42px / 18px',
    sampleTitle: 'Quick Tips for Creators',
    sampleSubtitle: '5 bite-sized productivity habits to try this weekend.',
  },
] as const;
