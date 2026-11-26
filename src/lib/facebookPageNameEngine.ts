import {
  BLOCKED_WORDS,
  CATEGORIES,
  CATEGORY_SUFFIXES,
  COMMUNITY_WORDS,
  END_STOP_WORDS,
  FAN_SAFE_WORDS,
  GENERIC_KEYWORDS,
  GENERIC_SUFFIXES,
  JOINERS,
  KNOWN_CITIES,
  SMALL_TITLE_WORDS,
  TONES_MAP,
  TRADEMARKED_BRANDS,
  type CategoryName,
  type NamingStyle,
  type Tone,
} from './facebookPageNameData';

export type {CategoryName, NamingStyle, Tone};

export interface Options {
  keyword: string;
  category: CategoryName | string;
  tone: Tone;
  style: NamingStyle;
  maxWords: 2 | 3 | 4;
  location?: string;
  avoid?: string;
  count: 12 | 24 | 36;
  batch: number;
  maxChars: number;
  exclude?: Set<string>;
}

export interface NameResult {
  name: string;
  handle: string | null;
  chars: number;
  words: number;
  style: NamingStyle;
  score: number;
  fanSafe: boolean;
}

export interface GenerateOutput {
  names: NameResult[];
  warnings: string[];
  errors: string[];
  poolExhausted: boolean;
}

interface RawCandidate {
  name: string;
  style: NamingStyle;
  prefixWord: string | null;
  suffixWord: string | null;
  addedTokens: string[];
  isAlliteration: boolean;
  usesToneModifier: boolean;
  usesCategorySuffix: boolean;
  usesLocation: boolean;
  isJoined: boolean;
}

const POOL_CAP = 600;

export function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hasNonLatinLetters(text: string): boolean {
  for (const ch of text) {
    if (/\p{L}/u.test(ch) && !/\p{Script=Latin}/u.test(ch)) {
      return true;
    }
  }
  return false;
}

function stripUnsupportedChars(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{M}\p{N}\s\-'&]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCaseLatinToken(word: string, index: number): string {
  const lower = word.toLowerCase();
  if (index > 0 && SMALL_TITLE_WORDS.has(lower)) {
    return lower;
  }
  const lettersOnly = word.replace(/[^A-Za-z]/g, '');
  if (
    lettersOnly.length >= 1 &&
    lettersOnly.length <= 4 &&
    word === word.toUpperCase() &&
    /[A-Z]/.test(word) &&
    !/^\d+$/.test(word)
  ) {
    return word;
  }
  const firstIdx = word.search(/\p{L}/u);
  if (firstIdx === -1) return word;
  return (
    word.slice(0, firstIdx) +
    word.charAt(firstIdx).toUpperCase() +
    word.slice(firstIdx + 1).toLowerCase()
  );
}

export function normaliseText(
  raw: string,
): {normalized: string; words: string[]; isLatin: boolean} {
  const cleaned = stripUnsupportedChars(raw);
  if (!cleaned) {
    return {normalized: '', words: [], isLatin: true};
  }
  const rawWords = cleaned.split(' ').filter(Boolean);
  const nonLatin = hasNonLatinLetters(cleaned);
  if (nonLatin) {
    return {
      normalized: rawWords.join(' '),
      words: rawWords,
      isLatin: false,
    };
  }
  const cased = rawWords.map((w, idx) => titleCaseLatinToken(w, idx));
  return {
    normalized: cased.join(' '),
    words: cased,
    isLatin: true,
  };
}

function firstCharLower(word: string): string {
  const match = word.match(/\p{L}/u);
  return match ? match[0].toLowerCase() : '';
}

function dedupeKey(name: string): string {
  return name.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsWholeWord(haystack: string, needle: string): boolean {
  if (!needle) return false;
  const regex = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`,
    'iu',
  );
  return regex.test(haystack);
}

function countSpecialChars(name: string): number {
  let count = 0;
  for (const ch of name) {
    if (!/[\p{L}\p{M}\p{N} ]/u.test(ch)) {
      count++;
    }
  }
  return count;
}

export function buildHandle(name: string): string | null {
  if (hasNonLatinLetters(name)) {
    return null;
  }
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 30);
  if (cleaned.length < 5) {
    return null;
  }
  return cleaned;
}

export function isFanSafe(name: string): boolean {
  const tokens = name.toLowerCase().split(/[\s\-_'&]+/).filter(Boolean);
  return tokens.some((token) => FAN_SAFE_WORDS.has(token));
}

function resolveCategory(category: string): CategoryName {
  const found = CATEGORIES.find((c) => c === category);
  return found ?? 'General';
}

function checkBlockedWords(words: string[]): boolean {
  for (const token of words) {
    const subTokens = token.split(/[\-_'&]+/).filter(Boolean);
    for (const part of subTokens) {
      if (BLOCKED_WORDS.has(part.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

function checkTrademarkedBrand(normalizedKeyword: string, words: string[]): boolean {
  const flatPhrase = normalizedKeyword
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const brand of TRADEMARKED_BRANDS) {
    if (brand.includes(' ')) {
      if (
        flatPhrase === brand ||
        flatPhrase.startsWith(`${brand} `) ||
        flatPhrase.endsWith(` ${brand}`) ||
        flatPhrase.includes(` ${brand} `)
      ) {
        return true;
      }
    }
  }
  for (const token of words) {
    const subTokens = token.split(/[\-_'&]+/).filter(Boolean);
    for (const part of subTokens) {
      const normalizedToken = part.toLowerCase().replace(/['’]/g, '');
      if (TRADEMARKED_BRANDS.has(normalizedToken)) {
        return true;
      }
    }
    const compact = subTokens.join('').toLowerCase();
    if (compact && TRADEMARKED_BRANDS.has(compact)) {
      return true;
    }
  }
  return false;
}

function parseAvoidTerms(
  avoidRaw: string | undefined,
  keywordNormalized: string,
  keywordWords: string[],
): {terms: string[]; warnings: string[]} {
  if (!avoidRaw || !avoidRaw.trim()) {
    return {terms: [], warnings: []};
  }
  const rawParts = avoidRaw
    .split(/[,\n]+/)
    .map((p) => stripUnsupportedChars(p))
    .filter(Boolean);

  const kwLower = keywordNormalized.toLowerCase();
  const kwWordsLower = new Set(keywordWords.map((w) => w.toLowerCase()));
  const terms: string[] = [];
  const warnings: string[] = [];
  let warnedKeyword = false;

  for (const part of rawParts) {
    const partLower = part.toLowerCase();
    if (partLower === kwLower || kwWordsLower.has(partLower)) {
      if (!warnedKeyword) {
        warnings.push(
          `Ignored "${part}" in Words to avoid because it is part of your keyword.`,
        );
        warnedKeyword = true;
      }
      continue;
    }
    if (!terms.some((t) => t.toLowerCase() === partLower)) {
      terms.push(part);
    }
  }
  return {terms, warnings};
}

export function generate(o: Options): GenerateOutput {
  const warnings: string[] = [];
  const errors: string[] = [];

  const rawTrimmed = (o.keyword ?? '').trim();
  if (!rawTrimmed) {
    errors.push('Enter a keyword (2–40 characters) to generate Page names.');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  if (rawTrimmed.length > 40) {
    errors.push('Keyword must be 40 characters or fewer.');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  const {normalized: K, words: kwWords} = normaliseText(rawTrimmed);

  if (!K || !/\p{L}/u.test(K)) {
    errors.push('Use letters in your keyword.');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  if (K.length < 2) {
    errors.push('Keyword must be at least 2 characters.');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  if (K.length > 40) {
    errors.push('Keyword must be 40 characters or fewer.');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  if (checkBlockedWords(kwWords)) {
    errors.push('Facebook does not allow this word in Page names');
    return {names: [], warnings, errors, poolExhausted: false};
  }

  if (checkTrademarkedBrand(K, kwWords)) {
    errors.push(
      'Trademarked brand names are not allowed without authorization. Enter your own original brand keyword instead.',
    );
    return {names: [], warnings, errors, poolExhausted: false};
  }

  const locRaw = (o.location ?? '').trim().slice(0, 25);
  const {normalized: L} = normaliseText(locRaw);
  const hasLocation = L.length > 0;

  // Generic / city-only warning (does not block generation)
  const kLower = K.toLowerCase();
  if (
    (kwWords.length === 1 && GENERIC_KEYWORDS.has(kLower)) ||
    KNOWN_CITIES.has(kLower) ||
    (hasLocation && kLower === L.toLowerCase())
  ) {
    warnings.push(
      'Facebook can reject Page names that are only a generic word or place. Add a brand word.',
    );
  }

  if (kwWords.length > 3) {
    warnings.push('1 to 3 words give the best results');
  }

  const effectiveMaxWords = Math.max(o.maxWords, kwWords.length + 1);
  if (effectiveMaxWords > o.maxWords) {
    warnings.push(
      `Your keyword already uses ${kwWords.length} words, so names can be longer than your limit.`,
    );
  }

  let activeStyle: NamingStyle = o.style;
  if (activeStyle === 'brandPlace' && !hasLocation) {
    warnings.push('Add a location to use this style');
    activeStyle = 'mixAll';
  }

  const category = resolveCategory(o.category);
  const tone: Tone = TONES_MAP[o.tone] ? o.tone : 'neutral';
  const toneData = TONES_MAP[tone];
  const catData = CATEGORY_SUFFIXES[category];
  const S = catData.suffixes;
  const F: readonly string[] = [...COMMUNITY_WORDS, ...catData.extraCommunity];
  const G = GENERIC_SUFFIXES;
  const J = JOINERS;

  const Kfirst = kwWords[0];
  const Klast = kwWords[kwWords.length - 1];
  const Khead = kwWords.slice(0, -1).join(' ');

  const kFirstChar = firstCharLower(Kfirst);
  const kLastChar = firstCharLower(Klast);

  const aalList = toneData.A.filter((adj) => firstCharLower(adj) === kFirstChar);
  const salList = S.filter((suf) => firstCharLower(suf) === kLastChar);

  const sSetLower = new Set(S.map((s) => s.toLowerCase()));
  const aSetLower = new Set(toneData.A.map((a) => a.toLowerCase()));

  const {terms: avoidTerms, warnings: avoidWarnings} = parseAvoidTerms(
    o.avoid,
    K,
    kwWords,
  );
  warnings.push(...avoidWarnings);

  const pickStyleOrder: NamingStyle[] =
    activeStyle === 'mixAll'
      ? hasLocation
        ? ['brandWord', 'prefixBrand', 'brandPlace', 'alliteration', 'joined', 'community']
        : ['brandWord', 'prefixBrand', 'alliteration', 'joined', 'community']
      : [activeStyle];

  const poolStyleOrder: NamingStyle[] =
    activeStyle === 'mixAll'
      ? hasLocation
        ? ['alliteration', 'brandWord', 'prefixBrand', 'brandPlace', 'joined', 'community']
        : ['alliteration', 'brandWord', 'prefixBrand', 'joined', 'community']
      : [activeStyle];

  const pool: RawCandidate[] = [];
  const pushCandidate = (c: RawCandidate) => {
    if (pool.length < POOL_CAP) {
      pool.push(c);
    }
  };

  for (const st of poolStyleOrder) {
    if (pool.length >= POOL_CAP) break;

    if (st === 'brandWord') {
      for (const s of S) {
        pushCandidate({
          name: `${K} ${s}`,
          style: 'brandWord',
          prefixWord: null,
          suffixWord: s,
          addedTokens: [s],
          isAlliteration: firstCharLower(s) === kLastChar,
          usesToneModifier: false,
          usesCategorySuffix: true,
          usesLocation: false,
          isJoined: false,
        });
      }
      for (const g of G) {
        pushCandidate({
          name: `${K} ${g}`,
          style: 'brandWord',
          prefixWord: null,
          suffixWord: g,
          addedTokens: [g],
          isAlliteration: firstCharLower(g) === kLastChar,
          usesToneModifier: false,
          usesCategorySuffix: sSetLower.has(g.toLowerCase()),
          usesLocation: false,
          isJoined: false,
        });
      }
    } else if (st === 'prefixBrand') {
      for (const p of toneData.P) {
        pushCandidate({
          name: `${p} ${K}`,
          style: 'prefixBrand',
          prefixWord: p,
          suffixWord: null,
          addedTokens: [p],
          isAlliteration: false,
          usesToneModifier: tone !== 'neutral',
          usesCategorySuffix: false,
          usesLocation: false,
          isJoined: false,
        });
      }
      for (const a of toneData.A) {
        pushCandidate({
          name: `${a} ${K}`,
          style: 'prefixBrand',
          prefixWord: a,
          suffixWord: null,
          addedTokens: [a],
          isAlliteration: firstCharLower(a) === kFirstChar,
          usesToneModifier: tone !== 'neutral',
          usesCategorySuffix: false,
          usesLocation: false,
          isJoined: false,
        });
      }
      for (const p of toneData.P) {
        for (const s of S) {
          pushCandidate({
            name: `${p} ${K} ${s}`,
            style: 'prefixBrand',
            prefixWord: p,
            suffixWord: s,
            addedTokens: [p, s],
            isAlliteration: firstCharLower(s) === kLastChar,
            usesToneModifier: tone !== 'neutral',
            usesCategorySuffix: true,
            usesLocation: false,
            isJoined: false,
          });
        }
      }
      for (const a of toneData.A) {
        for (const s of S) {
          pushCandidate({
            name: `${a} ${K} ${s}`,
            style: 'prefixBrand',
            prefixWord: a,
            suffixWord: s,
            addedTokens: [a, s],
            isAlliteration:
              firstCharLower(a) === kFirstChar || firstCharLower(s) === kLastChar,
            usesToneModifier: tone !== 'neutral',
            usesCategorySuffix: true,
            usesLocation: false,
            isJoined: false,
          });
        }
      }
    } else if (st === 'brandPlace' && hasLocation) {
      pushCandidate({
        name: `${K} ${L}`,
        style: 'brandPlace',
        prefixWord: null,
        suffixWord: null,
        addedTokens: [L],
        isAlliteration: false,
        usesToneModifier: false,
        usesCategorySuffix: false,
        usesLocation: true,
        isJoined: false,
      });
      pushCandidate({
        name: `${L} ${K}`,
        style: 'brandPlace',
        prefixWord: null,
        suffixWord: null,
        addedTokens: [L],
        isAlliteration: false,
        usesToneModifier: false,
        usesCategorySuffix: false,
        usesLocation: true,
        isJoined: false,
      });
      for (const s of S) {
        pushCandidate({
          name: `${K} ${s} ${L}`,
          style: 'brandPlace',
          prefixWord: null,
          suffixWord: s,
          addedTokens: [s, L],
          isAlliteration: false,
          usesToneModifier: false,
          usesCategorySuffix: true,
          usesLocation: true,
          isJoined: false,
        });
      }
      for (const s of S) {
        pushCandidate({
          name: `${K} ${L} ${s}`,
          style: 'brandPlace',
          prefixWord: null,
          suffixWord: s,
          addedTokens: [L, s],
          isAlliteration: false,
          usesToneModifier: false,
          usesCategorySuffix: true,
          usesLocation: true,
          isJoined: false,
        });
      }
    } else if (st === 'alliteration') {
      for (const aal of aalList) {
        pushCandidate({
          name: `${aal} ${K}`,
          style: 'alliteration',
          prefixWord: aal,
          suffixWord: null,
          addedTokens: [aal],
          isAlliteration: true,
          usesToneModifier: tone !== 'neutral' && aSetLower.has(aal.toLowerCase()),
          usesCategorySuffix: false,
          usesLocation: false,
          isJoined: false,
        });
      }
      for (const sal of salList) {
        pushCandidate({
          name: `${K} ${sal}`,
          style: 'alliteration',
          prefixWord: null,
          suffixWord: sal,
          addedTokens: [sal],
          isAlliteration: true,
          usesToneModifier: false,
          usesCategorySuffix: true,
          usesLocation: false,
          isJoined: false,
        });
      }
    } else if (st === 'joined') {
      for (const j of J) {
        const joinedName = Khead ? `${Khead} ${Klast}${j}` : `${K}${j}`;
        pushCandidate({
          name: joinedName,
          style: 'joined',
          prefixWord: null,
          suffixWord: j,
          addedTokens: [j],
          isAlliteration: false,
          usesToneModifier: false,
          usesCategorySuffix: sSetLower.has(j.toLowerCase()),
          usesLocation: false,
          isJoined: true,
        });
      }
    } else if (st === 'community') {
      for (const f of F) {
        pushCandidate({
          name: `${K} ${f}`,
          style: 'community',
          prefixWord: null,
          suffixWord: f,
          addedTokens: [f],
          isAlliteration: firstCharLower(f) === kLastChar,
          usesToneModifier: false,
          usesCategorySuffix: sSetLower.has(f.toLowerCase()),
          usesLocation: false,
          isJoined: false,
        });
      }
      for (const p of toneData.P) {
        for (const f of F) {
          pushCandidate({
            name: `${p} ${K} ${f}`,
            style: 'community',
            prefixWord: p,
            suffixWord: f,
            addedTokens: [p, f],
            isAlliteration: firstCharLower(f) === kLastChar,
            usesToneModifier: tone !== 'neutral',
            usesCategorySuffix: sSetLower.has(f.toLowerCase()),
            usesLocation: false,
            isJoined: false,
          });
        }
      }
      if (hasLocation) {
        for (const f of F) {
          pushCandidate({
            name: `${K} ${f} ${L}`,
            style: 'community',
            prefixWord: null,
            suffixWord: f,
            addedTokens: [f, L],
            isAlliteration: firstCharLower(f) === kLastChar,
            usesToneModifier: false,
            usesCategorySuffix: sSetLower.has(f.toLowerCase()),
            usesLocation: true,
            isJoined: false,
          });
        }
      }
    }
  }

  // 5.5 Hard filters + 5.6 Dedupe
  const maxAllowedChars = Math.min(40, o.maxChars || 40);
  const kLastLower = Klast.toLowerCase();
  const seenKeys = new Set<string>();
  const excludeSet = o.exclude;

  interface FilteredCandidate extends RawCandidate {
    wordCount: number;
    chars: number;
    score: number;
    orderIndex: number;
  }

  const filtered: FilteredCandidate[] = [];

  for (let i = 0; i < pool.length; i++) {
    const c = pool[i];
    const candName = c.name.replace(/\s+/g, ' ').trim();
    const chars = candName.length;
    if (chars < 6 || chars > maxAllowedChars) continue;

    const candWords = candName.split(' ').filter(Boolean);
    const wordCount = candWords.length;
    if (wordCount > effectiveMaxWords) continue;

    // Equal to keyword alone
    if (candName.toLowerCase() === kLower) continue;

    // Any word repeated case-insensitive
    const lowerWords = candWords.map((w) => w.toLowerCase());
    if (new Set(lowerWords).size !== lowerWords.length) continue;

    // Blocked words guard
    if (checkBlockedWords(candWords)) continue;

    // Suffix/joiner already part of keyword last word
    const overlapsKeywordLast = c.addedTokens.some((tok) => {
      const tokLower = tok.toLowerCase();
      return kLastLower.includes(tokLower) || tokLower === kLastLower;
    });
    if (overlapsKeywordLast) continue;

    // Contains words-to-avoid as whole word
    if (avoidTerms.some((term) => containsWholeWord(candName, term))) continue;

    // Ends with stop word
    const lastWordLower = lowerWords[lowerWords.length - 1];
    if (END_STOP_WORDS.has(lastWordLower)) continue;

    // >2 chars not letters/digits/spaces
    if (countSpecialChars(candName) > 2) continue;

    // 5.6 Dedupe
    const dKey = dedupeKey(candName);
    if (seenKeys.has(dKey)) continue;
    seenKeys.add(dKey);

    if (excludeSet && excludeSet.has(candName)) continue;

    // 5.7 Scoring 0-100 start 50
    let score = 50;
    if (wordCount === 2) score += 15;
    else if (wordCount === 3) score += 10;
    else if (wordCount === 1 && c.isJoined) score += 5;
    else if (wordCount === 4) score -= 5;

    if (chars >= 10 && chars <= 24) score += 15;
    else if (chars >= 25 && chars <= 32) score += 5;
    else if (chars > 32) score -= 10;

    if (candName.toLowerCase().startsWith(kLower)) score += 8;
    if (c.isAlliteration) score += 6;
    if (c.usesToneModifier && tone !== 'neutral') score += 4;
    if (c.usesCategorySuffix) score += 6;
    if (c.usesLocation && hasLocation) {
      score += 5;
      if (!c.usesCategorySuffix) score += 6;
    }

    if (
      wordCount >= 3 &&
      candWords.every((w) => [...w].length <= 3)
    ) {
      score -= 8;
    }

    score = Math.max(0, Math.min(100, score));

    filtered.push({
      ...c,
      name: candName,
      wordCount,
      chars,
      score,
      orderIndex: filtered.length,
    });
  }

  // 5.9 Seeded jitter -3 to +3
  const seedStr = `${K}|${category}|${tone}|${activeStyle}|${L}|${o.maxWords}|${o.batch}`;
  const rng = mulberry32(fnv1a(seedStr));

  for (const item of filtered) {
    const jitter = Math.floor(rng() * 7) - 3;
    item.score = item.score + jitter;
  }

  // 5.8 Sort by score desc (deterministic tie-break)
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.orderIndex - b.orderIndex;
  });

  // Round-robin picking one style at a time
  const buckets = new Map<NamingStyle, FilteredCandidate[]>();
  for (const st of pickStyleOrder) {
    buckets.set(st, []);
  }
  for (const item of filtered) {
    const bucket = buckets.get(item.style);
    if (bucket) bucket.push(item);
  }

  const prefixCounts = new Map<string, number>();
  const suffixCounts = new Map<string, number>();
  const picked: FilteredCandidate[] = [];
  const activeStyleQueue = pickStyleOrder.filter(
    (st) => (buckets.get(st)?.length ?? 0) > 0,
  );
  const bucketCursors = new Map<NamingStyle, number>();
  for (const st of activeStyleQueue) {
    bucketCursors.set(st, 0);
  }

  while (picked.length < o.count && activeStyleQueue.length > 0) {
    for (let i = 0; i < activeStyleQueue.length && picked.length < o.count; ) {
      const st = activeStyleQueue[i];
      const bucket = buckets.get(st)!;
      let cursor = bucketCursors.get(st) ?? 0;
      let chose = false;

      while (cursor < bucket.length) {
        const cand = bucket[cursor++];
        const pKey = cand.prefixWord ? cand.prefixWord.toLowerCase() : null;
        const sKey = cand.suffixWord ? cand.suffixWord.toLowerCase() : null;

        if (pKey && (prefixCounts.get(pKey) ?? 0) >= 3) continue;
        if (sKey && (suffixCounts.get(sKey) ?? 0) >= 3) continue;

        if (pKey) prefixCounts.set(pKey, (prefixCounts.get(pKey) ?? 0) + 1);
        if (sKey) suffixCounts.set(sKey, (suffixCounts.get(sKey) ?? 0) + 1);
        picked.push(cand);
        chose = true;
        break;
      }

      bucketCursors.set(st, cursor);
      if (!chose && cursor >= bucket.length) {
        activeStyleQueue.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  const names: NameResult[] = picked.map((p) => ({
    name: p.name,
    handle: buildHandle(p.name),
    chars: p.chars,
    words: p.wordCount,
    style: p.style,
    score: p.score,
    fanSafe: isFanSafe(p.name),
  }));

  const poolExhausted = names.length < o.count;
  if (poolExhausted) {
    warnings.push(
      'You have seen every combination for these settings. Try another tone, style or category.',
    );
  }

  return {
    names,
    warnings,
    errors,
    poolExhausted,
  };
}
