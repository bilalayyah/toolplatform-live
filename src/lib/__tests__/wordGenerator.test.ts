import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  canBuildWord,
  countLetterFrequency,
  DICTIONARY_METADATA,
  filterWordsByLength,
  findExactAnagrams,
  findPossibleWords,
  loadDictionaryFromText,
  MAX_WORD_GENERATOR_INPUT_LENGTH,
  normalizeLetters,
  sortWords,
  validateWordInput,
} from '../wordGenerator';

describe('Alphabets to Word Generator Engine (Real Bundled Dictionary)', () => {
  beforeAll(() => {
    const dictPath = path.resolve(process.cwd(), 'public/dictionaries/letterpress-english-words.txt');
    const raw = fs.readFileSync(dictPath, 'utf8');
    const count = loadDictionaryFromText(raw);
    expect(count).toBe(DICTIONARY_METADATA.wordCount);
  });

  it('normalizes letters, counts frequencies, and enforces letter-frequency rules', () => {
    expect(normalizeLetters('  a p p l e ! 123 ')).toBe('APPLE');
    const freq = countLetterFrequency('apple');
    expect(freq.get('A')).toBe(1);
    expect(freq.get('P')).toBe(2);
    expect(freq.get('L')).toBe(1);
    expect(freq.get('E')).toBe(1);

    expect(canBuildWord('PALE', freq)).toBe(true);
    expect(canBuildWord('PEAL', freq)).toBe(true);
    expect(canBuildWord('APPLE', freq)).toBe(true);
    expect(canBuildWord('PAL', freq)).toBe(true);
    // Rejects words exceeding available letter counts (APPLE has only 1 A and 2 Ps)
    expect(canBuildWord('APPEAL', freq)).toBe(false); // needs 2 As
    expect(canBuildWord('PPPAL', freq)).toBe(false); // needs 3 Ps
    expect(canBuildWord('ZEBRA', freq)).toBe(false);
  });

  it('validates inputs strictly (empty, numbers/symbols, case-insensitive, max length)', () => {
    expect(validateWordInput('').valid).toBe(false);
    expect(validateWordInput('   ').valid).toBe(false);
    expect(validateWordInput('LISTEN1').valid).toBe(false);
    expect(validateWordInput('L!STEN').valid).toBe(false);
    expect(validateWordInput('listen').valid).toBe(true);
    expect(validateWordInput('L I S T E N').valid).toBe(true);

    const overLimit = 'A'.repeat(MAX_WORD_GENERATOR_INPUT_LENGTH + 1);
    const overResult = validateWordInput(overLimit);
    expect(overResult.valid).toBe(false);
    expect(overResult.error).toContain(String(MAX_WORD_GENERATOR_INPUT_LENGTH));

    const exactLimit = 'A'.repeat(MAX_WORD_GENERATOR_INPUT_LENGTH);
    expect(validateWordInput(exactLimit).valid).toBe(true);
  });

  it('finds all canonical LISTEN words in Generate Words and Exact Anagrams', () => {
    const possible = findPossibleWords('LISTEN');
    const exact = findExactAnagrams('LISTEN');

    for (const expected of ['LISTEN', 'SILENT', 'ENLIST', 'TINSEL', 'INLETS']) {
      expect(possible).toContain(expected);
      expect(exact).toContain(expected);
    }

    // Exact anagrams must all match exact input length (6)
    expect(exact.every((w) => w.length === 6)).toBe(true);
    // Lowercase yields identical results
    expect(findPossibleWords('listen')).toEqual(possible);
    expect(findExactAnagrams('listen')).toEqual(exact);
  });

  it('enforces repeated-letter frequency limit for APPLE and finds canonical words', () => {
    const words = findPossibleWords('APPLE');
    for (const expected of ['APPLE', 'PALE', 'PEAL', 'LEAP', 'APE', 'LAP']) {
      expect(words).toContain(expected);
    }
    // No generated word may use more than 2 P letters
    for (const w of words) {
      const pCount = (w.match(/P/g) ?? []).length;
      expect(pCount).toBeLessThanOrEqual(2);
    }
  });

  it('matches canonical EARTH, STONE, CARE, ANGLE, and PLANET results', () => {
    const earth = findExactAnagrams('EARTH');
    expect(earth).toEqual(expect.arrayContaining(['EARTH', 'HEART', 'HATER']));

    const stone = findExactAnagrams('STONE');
    expect(stone).toEqual(expect.arrayContaining(['STONE', 'NOTES', 'ONSET', 'TONES']));

    const care = findExactAnagrams('CARE');
    expect(care).toEqual(expect.arrayContaining(['CARE', 'RACE', 'ACRE']));

    const angle = findPossibleWords('ANGLE');
    expect(angle).toEqual(expect.arrayContaining(['ANGLE', 'ANGEL', 'GLEAN']));

    const planetStartsP = findPossibleWords('PLANET', { startsWith: 'P' });
    expect(planetStartsP).toContain('PLANET');
    expect(planetStartsP.every((w) => w.startsWith('P'))).toBe(true);
  });

  it('handles one-letter input, no-matching-words, length filters, pattern filters, and sorting', () => {
    expect(findPossibleWords('A')).toEqual([]);
    expect(findExactAnagrams('A')).toEqual([]);
    expect(findPossibleWords('QQQQQ')).toEqual([]);
    expect(findExactAnagrams('QQQQQ')).toEqual([]);

    const listenWords = findPossibleWords('LISTEN');
    const twoToThree = filterWordsByLength(listenWords, 2, 3);
    expect(twoToThree.length).toBeGreaterThan(0);
    expect(twoToThree.every((w) => w.length >= 2 && w.length <= 3)).toBe(true);

    const startsSEndsT = findPossibleWords('LISTEN', {
      startsWith: 'S',
      endsWith: 'T',
      minLength: 4,
      maxLength: 6,
    });
    expect(startsSEndsT).toContain('SILENT');
    expect(startsSEndsT.every((w) => w.startsWith('S') && w.endsWith('T'))).toBe(true);

    const excludedT = findPossibleWords('LISTEN', { excludeLetters: 'T' });
    expect(excludedT.every((w) => !w.includes('T'))).toBe(true);

    const includedNI = findPossibleWords('LISTEN', { includeLetters: 'NI' });
    expect(includedNI.every((w) => w.includes('N') && w.includes('I'))).toBe(true);

    const patternMatch = findPossibleWords('PLANET', { pattern: 'P_A___' });
    expect(patternMatch).toContain('PLANET');

    const sortedDesc = sortWords(['APE', 'APPLE', 'LAP', 'PALE'], 'length-desc');
    expect(sortedDesc).toEqual(['APPLE', 'PALE', 'APE', 'LAP']);

    const sortedAsc = sortWords(['APPLE', 'PALE', 'LAP', 'APE'], 'length-asc');
    expect(sortedAsc).toEqual(['APE', 'LAP', 'PALE', 'APPLE']);

    const sortedAlpha = sortWords(['PALE', 'APE', 'LAP'], 'alphabetical');
    expect(sortedAlpha).toEqual(['APE', 'LAP', 'PALE']);
  });
});
