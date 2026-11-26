import {describe, expect, it} from 'vitest';
import {fnv1a, generate, mulberry32} from '../facebookPageNameEngine';

describe('facebookPageNameEngine acceptance tests T1-T10', () => {
  it('T1: Yalla Ludo, Gaming, Neutral, Mix all, Any, qty 12', () => {
    const res = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    expect(res.names).toHaveLength(12);

    const forbiddenPhrases = ['Top 5', 'Tips', 'Guide', 'How to'];
    const gamingSuffixes = new Set([
      'Hub',
      'Arena',
      'Squad',
      'Zone',
      'Club',
      'Gamers',
      'Clan',
      'Legends',
      'League',
      'Players',
    ]);

    let consecutiveYallaLudoCount = 0;
    let gamingSuffixEndCount = 0;

    for (const item of res.names) {
      expect(item.words).toBeGreaterThanOrEqual(2);
      expect(item.words).toBeLessThanOrEqual(4);
      expect(item.chars).toBeLessThanOrEqual(40);
      for (const phrase of forbiddenPhrases) {
        expect(item.name.toLowerCase()).not.toContain(phrase.toLowerCase());
      }
      if (/\bYalla Ludo\b/.test(item.name)) {
        consecutiveYallaLudoCount++;
      }
      const lastWord = item.name.split(' ').pop() ?? '';
      if (gamingSuffixes.has(lastWord)) {
        gamingSuffixEndCount++;
      }
    }

    expect(consecutiveYallaLudoCount).toBeGreaterThanOrEqual(8);
    expect(gamingSuffixEndCount).toBeGreaterThanOrEqual(3);
  });

  it('T2: Yalla Ludo, Gaming, style Alliteration', () => {
    const res = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'alliteration',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    expect(res.names.length).toBeGreaterThanOrEqual(1);

    const names = res.names.map((n) => n.name).sort();
    expect(names).toEqual([
      'Yalla Ludo League',
      'Yalla Ludo Legends',
      'Yalla Ludo Lounge',
    ]);
  });

  it('T3: Pizza, Food shows generic-word warning and generates names like Pizza Kitchen', () => {
    const res = generate({
      keyword: 'Pizza',
      category: 'Food',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    expect(
      res.warnings.some((w) =>
        w.includes(
          'Facebook can reject Page names that are only a generic word or place. Add a brand word.',
        ),
      ),
    ).toBe(true);
    expect(res.names.length).toBe(12);
    expect(res.names.some((n) => n.name === 'Pizza Kitchen')).toBe(true);
  });

  it('T4: Official Ludo shows error and zero names', () => {
    const res = generate({
      keyword: 'Official Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toContain('Facebook does not allow this word in Page names');
    expect(res.names).toHaveLength(0);
  });

  it('Trademarked brands like "Nike shoes" produce an error and zero names while non-brands still work', () => {
    const nikeRes = generate({
      keyword: 'Nike shoes',
      category: 'Fashion & Beauty',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(nikeRes.errors.length).toBeGreaterThan(0);
    expect(nikeRes.names).toHaveLength(0);

    const adidasRes = generate({
      keyword: 'Adidas Club',
      category: 'Sports',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(adidasRes.errors.length).toBeGreaterThan(0);
    expect(adidasRes.names).toHaveLength(0);

    const brandPhraseRes = generate({
      keyword: 'Louis Vuitton Bags',
      category: 'Fashion & Beauty',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(brandPhraseRes.errors.length).toBeGreaterThan(0);
    expect(brandPhraseRes.names).toHaveLength(0);

    const safeRes = generate({
      keyword: 'Summit Stride Shoes',
      category: 'Fashion & Beauty',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(safeRes.errors).toHaveLength(0);
    expect(safeRes.names).toHaveLength(12);
  });

  it('T5: Yalla Ludo, Gaming, location Dubai, style Brand + Place', () => {
    const res12 = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'brandPlace',
      location: 'Dubai',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(res12.errors).toHaveLength(0);
    expect(res12.names).toHaveLength(12);
    const names12 = res12.names.map((n) => n.name);
    expect(names12).toContain('Yalla Ludo Dubai');
    expect(names12).toContain('Dubai Yalla Ludo');
    expect(names12).toContain('Yalla Ludo Hub Dubai');
  });

  it('T6: Words to avoid Club, Zone excludes any word Club or Zone', () => {
    const res = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      avoid: 'Club, Zone',
      maxWords: 4,
      count: 36,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    for (const item of res.names) {
      expect(item.name).not.toMatch(/\bClub\b/i);
      expect(item.name).not.toMatch(/\bZone\b/i);
    }
  });

  it('T7: Same inputs twice match identically, Generate More repeats nothing', () => {
    const baseOpts = {
      keyword: 'Yalla Ludo',
      category: 'Gaming' as const,
      tone: 'neutral' as const,
      style: 'mixAll' as const,
      maxWords: 4 as const,
      count: 12 as const,
      batch: 0,
      maxChars: 40,
    };

    const firstA = generate(baseOpts);
    const firstB = generate(baseOpts);
    expect(firstA.names.map((n) => n.name)).toEqual(firstB.names.map((n) => n.name));

    const exclude = new Set(firstA.names.map((n) => n.name));
    const second = generate({...baseOpts, batch: 1, exclude});
    expect(second.names.length).toBeGreaterThan(0);

    for (const item of second.names) {
      expect(exclude.has(item.name)).toBe(false);
    }
  });

  it('T8: Keyword in Arabic script preserves script, null handle, generates names safely', () => {
    const res = generate({
      keyword: 'يلا لودو',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    expect(res.names).toHaveLength(12);
    for (const item of res.names) {
      expect(item.name).toContain('يلا لودو');
      expect(item.handle).toBeNull();
    }
  });

  it('T9: Yalla Ludo Hub, Gaming never repeats Hub or returns keyword alone', () => {
    const res = generate({
      keyword: 'Yalla Ludo Hub',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 36,
      batch: 0,
      maxChars: 40,
    });

    expect(res.errors).toHaveLength(0);
    expect(res.names.length).toBeGreaterThan(0);
    for (const item of res.names) {
      expect(item.name.toLowerCase()).not.toBe('yalla ludo hub');
      expect(item.name).not.toMatch(/Hub\s*Hub/i);
      const hubOccurrences = item.name.match(/\bHub\b/gi) ?? [];
      expect(hubOccurrences.length).toBeLessThanOrEqual(1);
    }
  });

  it('T10: Max words limits & automatic raise for 2-word keyword', () => {
    const upTo3 = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 3,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(upTo3.errors).toHaveLength(0);
    for (const item of upTo3.names) {
      expect(item.words).toBeLessThanOrEqual(3);
    }
    const names3 = upTo3.names.map((n) => n.name);
    expect(names3).toContain('Yalla Ludo Hub');
    expect(names3).toContain('Team Yalla Ludo');

    const upTo2 = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 2,
      count: 12,
      batch: 0,
      maxChars: 40,
    });

    expect(
      upTo2.warnings.some((w) =>
        w.includes('Your keyword already uses 2 words, so names can be longer than your limit.'),
      ),
    ).toBe(true);
    expect(upTo2.names.some((n) => n.words === 3)).toBe(true);
  });

  it('exports deterministic fnv1a and mulberry32 helpers and respects brandPlace fallback', () => {
    expect(fnv1a('abc')).toBe(fnv1a('abc'));
    const rngA = mulberry32(fnv1a('seed'));
    const rngB = mulberry32(fnv1a('seed'));
    expect([rngA(), rngA()]).toEqual([rngB(), rngB()]);

    const fallback = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'brandPlace',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(fallback.warnings).toContain('Add a location to use this style');
    expect(fallback.names).toHaveLength(12);
  });

  it('validates empty, digits-only, short, overlong keywords, non-Latin scripts, avoid-overlap, and <20ms runtime', () => {
    const emptyRes = generate({
      keyword: '   ',
      category: 'General',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(emptyRes.errors.length).toBeGreaterThan(0);

    const digitsRes = generate({
      keyword: '123456',
      category: 'General',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(digitsRes.errors).toContain('Use letters in your keyword.');

    const shortRes = generate({
      keyword: 'A',
      category: 'General',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(shortRes.errors).toContain('Keyword must be at least 2 characters.');

    const longRes = generate({
      keyword: 'A'.repeat(41),
      category: 'General',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(longRes.errors).toContain('Keyword must be 40 characters or fewer.');

    const hindiRes = generate({
      keyword: 'लुडो किंग',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(hindiRes.errors).toHaveLength(0);
    expect(hindiRes.names.length).toBe(12);
    expect(hindiRes.names.every((n) => n.name.includes('लुडो किंग') && n.handle === null)).toBe(true);

    const avoidKwRes = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'neutral',
      style: 'mixAll',
      avoid: 'Ludo',
      maxWords: 4,
      count: 12,
      batch: 0,
      maxChars: 40,
    });
    expect(avoidKwRes.warnings.some((w) => w.includes('part of your keyword'))).toBe(true);
    expect(avoidKwRes.names).toHaveLength(12);

    const start = performance.now();
    const perfRes = generate({
      keyword: 'Yalla Ludo',
      category: 'Gaming',
      tone: 'bold',
      style: 'mixAll',
      location: 'Dubai',
      maxWords: 4,
      count: 36,
      batch: 0,
      maxChars: 40,
    });
    const elapsedMs = performance.now() - start;
    expect(perfRes.names).toHaveLength(36);
    expect(elapsedMs).toBeLessThan(20);
  });
});
