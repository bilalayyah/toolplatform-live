export const MAX_WORD_GENERATOR_INPUT_LENGTH = 15;
export const DEFAULT_WORD_RESULT_LIMIT = 200;
export const DICTIONARY_ASSET_PATH = '/dictionaries/letterpress-english-words.txt';

export const DICTIONARY_METADATA = {
  name: 'Letterpress English Word List (via word-list)',
  license: 'CC0 1.0 Universal (Public Domain) / MIT',
  source: 'atebits/Words & sindresorhus/word-list',
  wordCount: 274137,
  assetPath: DICTIONARY_ASSET_PATH,
  scopeNote:
    'Contains 274,137 lowercase alphabetic English words (2+ letters). Excludes proper nouns with capital letters, hyphenated compounds, and punctuated abbreviations.',
} as const;

export type WordSortMode = 'alphabetical' | 'length-desc' | 'length-asc';

export interface WordSearchFilters {
  minLength?: number;
  maxLength?: number;
  startsWith?: string;
  endsWith?: string;
  includeLetters?: string;
  excludeLetters?: string;
  pattern?: string;
}

interface IndexedDictionary {
  words: string[];
  masks: Uint32Array;
  anagramIndex: Map<string, string[]>;
}

let cachedDictionary: IndexedDictionary | null = null;
let loadingPromise: Promise<IndexedDictionary> | null = null;

/**
 * Uppercases input and strips spaces and any non A-Z characters.
 */
export function normalizeLetters(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Validates raw user letter input.
 * Accepts A-Z (case-insensitive) and optional spaces.
 * Rejects empty input, numbers, symbols, or inputs exceeding MAX_WORD_GENERATOR_INPUT_LENGTH.
 */
export function validateWordInput(input: string): {valid: boolean; error: string | null} {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter at least 2 letters (A–Z) to generate words.',
    };
  }

  if (/[^a-zA-Z\s]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Only English alphabet letters (A–Z) and spaces are allowed. Numbers and symbols are not permitted.',
    };
  }

  const normalized = normalizeLetters(trimmed);
  if (!normalized) {
    return {
      valid: false,
      error: 'Please enter English alphabet letters (A–Z).',
    };
  }

  if (normalized.length > MAX_WORD_GENERATOR_INPUT_LENGTH) {
    return {
      valid: false,
      error: `Input exceeds the maximum limit of ${MAX_WORD_GENERATOR_INPUT_LENGTH} letters (you entered ${normalized.length}). Please shorten your letter set.`,
    };
  }

  return {valid: true, error: null};
}

/**
 * Counts letter frequencies for normalized text.
 */
export function countLetterFrequency(text: string): Map<string, number> {
  const normalized = normalizeLetters(text);
  const map = new Map<string, number>();
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return map;
}

/**
 * Returns true only if every letter required by `word` exists in `availableLetters`
 * in sufficient quantity.
 */
export function canBuildWord(word: string, availableLetters: Map<string, number>): boolean {
  const normalized = normalizeLetters(word);
  if (!normalized) return false;

  const used = new Map<string, number>();
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const avail = availableLetters.get(ch) ?? 0;
    if (avail === 0) return false;
    const nextUsed = (used.get(ch) ?? 0) + 1;
    if (nextUsed > avail) return false;
    used.set(ch, nextUsed);
  }
  return true;
}

function computeMask(word: string): number {
  let mask = 0;
  for (let i = 0; i < word.length; i++) {
    const code = word.charCodeAt(i) - 65;
    if (code >= 0 && code < 26) {
      mask |= 1 << code;
    }
  }
  return mask >>> 0;
}

function sortedKey(word: string): string {
  return word.split('').sort().join('');
}

function buildIndexedDictionary(rawWords: string[]): IndexedDictionary {
  const seen = new Set<string>();
  const cleanWords: string[] = [];

  for (let i = 0; i < rawWords.length; i++) {
    const w = rawWords[i].trim().toUpperCase();
    if (w.length >= 2 && /^[A-Z]+$/.test(w) && !seen.has(w)) {
      seen.add(w);
      cleanWords.push(w);
    }
  }

  const masks = new Uint32Array(cleanWords.length);
  const anagramIndex = new Map<string, string[]>();

  for (let i = 0; i < cleanWords.length; i++) {
    const word = cleanWords[i];
    masks[i] = computeMask(word);
    const key = sortedKey(word);
    const bucket = anagramIndex.get(key);
    if (bucket) {
      bucket.push(word);
    } else {
      anagramIndex.set(key, [word]);
    }
  }

  return {words: cleanWords, masks, anagramIndex};
}

/**
 * Loads dictionary words from raw newline-delimited text and caches in memory.
 */
export function loadDictionaryFromText(rawText: string): number {
  const lines = rawText.split(/\r?\n/);
  cachedDictionary = buildIndexedDictionary(lines);
  return cachedDictionary.words.length;
}

export function isDictionaryLoaded(): boolean {
  return cachedDictionary !== null;
}

export function getLoadedDictionaryWordCount(): number {
  return cachedDictionary ? cachedDictionary.words.length : 0;
}

/**
 * Lazy-loads the dictionary asset from /dictionaries/letterpress-english-words.txt
 * and caches it in memory for offline/subsequent queries.
 */
export async function ensureDictionaryLoaded(): Promise<number> {
  if (cachedDictionary) {
    return cachedDictionary.words.length;
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      const response = await fetch(DICTIONARY_ASSET_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load dictionary asset (${response.status} ${response.statusText}).`);
      }
      const text = await response.text();
      const indexed = buildIndexedDictionary(text.split(/\r?\n/));
      cachedDictionary = indexed;
      return indexed;
    })().catch((err) => {
      loadingPromise = null;
      throw err;
    });
  }

  const dict = await loadingPromise;
  return dict.words.length;
}

function getDictionaryOrThrow(): IndexedDictionary {
  if (!cachedDictionary) {
    throw new Error('Dictionary has not been loaded yet. Call ensureDictionaryLoaded() first.');
  }
  return cachedDictionary;
}

function toAlphaCounts(normalized: string): Int32Array {
  const counts = new Int32Array(26);
  for (let i = 0; i < normalized.length; i++) {
    const idx = normalized.charCodeAt(i) - 65;
    if (idx >= 0 && idx < 26) {
      counts[idx]++;
    }
  }
  return counts;
}

function matchesPattern(word: string, cleanPattern: string): boolean {
  if (!cleanPattern) return true;
  if (word.length !== cleanPattern.length) return false;
  for (let i = 0; i < cleanPattern.length; i++) {
    const p = cleanPattern[i];
    if (p !== '_' && p !== '?' && p !== '*' && word[i] !== p) {
      return false;
    }
  }
  return true;
}

/**
 * Returns every valid dictionary word (length >= 2) buildable from the input letters,
 * respecting letter frequency counts and optional search filters.
 */
export function findPossibleWords(letters: string, filters?: WordSearchFilters): string[] {
  const dict = getDictionaryOrThrow();
  const normalized = normalizeLetters(letters);
  if (normalized.length < 2) return [];

  const maxAvailableLen = normalized.length;
  const minLen = Math.max(2, filters?.minLength ?? 2);
  const maxLen = Math.min(maxAvailableLen, filters?.maxLength ?? maxAvailableLen);
  if (minLen > maxLen) return [];

  const startsWith = normalizeLetters(filters?.startsWith ?? '');
  const endsWith = normalizeLetters(filters?.endsWith ?? '');
  const includeNorm = normalizeLetters(filters?.includeLetters ?? '');
  const excludeNorm = normalizeLetters(filters?.excludeLetters ?? '');
  const rawPattern = (filters?.pattern ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const hasPattern = rawPattern.length > 0 && /^[A-Z_?*]+$/.test(rawPattern);

  const inputCounts = toAlphaCounts(normalized);
  const inputMask = computeMask(normalized);

  const includeCounts = includeNorm ? toAlphaCounts(includeNorm) : null;
  const excludeMask = excludeNorm ? computeMask(excludeNorm) : 0;

  const results: string[] = [];
  const {words, masks} = dict;

  for (let i = 0; i < words.length; i++) {
    const wordMask = masks[i];
    if ((wordMask & ~inputMask) !== 0) continue;
    if (excludeMask !== 0 && (wordMask & excludeMask) !== 0) continue;

    const word = words[i];
    const len = word.length;
    if (len < minLen || len > maxLen) continue;
    if (startsWith && !word.startsWith(startsWith)) continue;
    if (endsWith && !word.endsWith(endsWith)) continue;
    if (hasPattern && !matchesPattern(word, rawPattern)) continue;

    // Verify exact letter frequency counts (no letter used more times than input provides)
    const wordCounts = new Int32Array(26);
    let ok = true;
    for (let j = 0; j < len; j++) {
      const idx = word.charCodeAt(j) - 65;
      const next = wordCounts[idx] + 1;
      if (next > inputCounts[idx]) {
        ok = false;
        break;
      }
      wordCounts[idx] = next;
    }
    if (!ok) continue;

    if (includeCounts) {
      let hasAllIncluded = true;
      for (let k = 0; k < 26; k++) {
        if (includeCounts[k] > 0 && wordCounts[k] < includeCounts[k]) {
          hasAllIncluded = false;
          break;
        }
      }
      if (!hasAllIncluded) continue;
    }

    results.push(word);
  }

  return results;
}

/**
 * Returns only exact dictionary anagrams using every supplied letter exactly once,
 * respecting repeated-letter counts.
 */
export function findExactAnagrams(letters: string, filters?: WordSearchFilters): string[] {
  const dict = getDictionaryOrThrow();
  const normalized = normalizeLetters(letters);
  if (normalized.length < 2) return [];

  const bucket = dict.anagramIndex.get(sortedKey(normalized)) ?? [];
  if (!filters) {
    return [...bucket];
  }

  const startsWith = normalizeLetters(filters.startsWith ?? '');
  const endsWith = normalizeLetters(filters.endsWith ?? '');
  const includeNorm = normalizeLetters(filters.includeLetters ?? '');
  const excludeNorm = normalizeLetters(filters.excludeLetters ?? '');
  const rawPattern = (filters.pattern ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const hasPattern = rawPattern.length > 0 && /^[A-Z_?*]+$/.test(rawPattern);
  const minLen = filters.minLength ?? 2;
  const maxLen = filters.maxLength ?? normalized.length;

  const includeCounts = includeNorm ? toAlphaCounts(includeNorm) : null;
  const excludeMask = excludeNorm ? computeMask(excludeNorm) : 0;

  return bucket.filter((word) => {
    if (word.length < minLen || word.length > maxLen) return false;
    if (startsWith && !word.startsWith(startsWith)) return false;
    if (endsWith && !word.endsWith(endsWith)) return false;
    if (excludeMask !== 0 && (computeMask(word) & excludeMask) !== 0) return false;
    if (hasPattern && !matchesPattern(word, rawPattern)) return false;
    if (includeCounts) {
      const wc = toAlphaCounts(word);
      for (let k = 0; k < 26; k++) {
        if (includeCounts[k] > 0 && wc[k] < includeCounts[k]) return false;
      }
    }
    return true;
  });
}

/**
 * Keeps words whose length falls within [min, max] (inclusive).
 */
export function filterWordsByLength(words: string[], min: number, max: number): string[] {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return words.filter((w) => w.length >= lo && w.length <= hi);
}

/**
 * Sorts words deterministically:
 * - 'alphabetical': A-Z
 * - 'length-desc': longest first, ties alphabetical
 * - 'length-asc': shortest first, ties alphabetical
 */
export function sortWords(words: string[], sortMode: WordSortMode): string[] {
  const copy = [...words];
  switch (sortMode) {
    case 'alphabetical':
      return copy.sort((a, b) => a.localeCompare(b));
    case 'length-desc':
      return copy.sort((a, b) => b.length - a.length || a.localeCompare(b));
    case 'length-asc':
      return copy.sort((a, b) => a.length - b.length || a.localeCompare(b));
  }
}
