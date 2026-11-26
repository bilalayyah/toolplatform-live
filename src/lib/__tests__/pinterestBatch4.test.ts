import {describe, it, expect} from 'vitest';
import {TOOLS} from '../../data/tools';
import {PINTEREST_TOOLS} from '../../data/pinterestTools';
import {
  PINTEREST_LIMITS,
  countUnicodeChars,
  isValidPinterestUsername,
  generatePinterestUsernames,
  generatePinterestBios,
  generatePinterestPinIdeas,
  buildPinterestContentCalendar,
  serializePinterestCalendarCsv,
  calculatePinterestEngagement,
  calculatePinterestFollowerGrowth,
  generatePinterestBoardDescriptions,
  generatePinterestSeoDescriptions,
  generatePinterestAltText,
} from '../../components/tools/pinterestHelpers';
import {convertToUnicodeFonts, convertToStylishDecorations} from '../../components/tools/instagramHelpers';

describe('Batch 4 — Pinterest Registry, Slugs & Metadata Audit', () => {
  it('contains all 17 Pinterest tools with unique slugs, correct active/coming-soon split, and 439 total catalog', () => {
    expect(PINTEREST_TOOLS).toHaveLength(17);
    expect(new Set(PINTEREST_TOOLS.map((t) => t.slug)).size).toBe(17);
    expect(TOOLS.length).toBeGreaterThanOrEqual(439);

    const comingSoonTools = PINTEREST_TOOLS.filter((t) => t.status === 'coming-soon');
    expect(comingSoonTools.map((t) => t.slug)).toEqual(['pinterest-pin-text-extractor']);

    const activeTools = PINTEREST_TOOLS.filter((t) => t.status === 'active');
    expect(activeTools).toHaveLength(16);
    expect(JSON.stringify(activeTools).toLowerCase()).not.toContain('once live,');

    const bioMeta = PINTEREST_TOOLS.find((t) => t.slug === 'pinterest-bio-generator');
    expect(bioMeta?.description).toContain('160');
    expect(bioMeta?.longDescription).toContain('160');

    const paletteMeta = PINTEREST_TOOLS.find((t) => t.slug === 'pinterest-color-palette-extractor');
    expect(paletteMeta?.maxFileSizeMB).toBe(10);

    const richMeta = PINTEREST_TOOLS.find((t) => t.slug === 'pinterest-rich-pin-preview-generator');
    expect(richMeta?.acceptedFormats).toContain('PNG');
  });
});

describe('Batch 4 — Pinterest Usernames & Bios', () => {
  it('generatePinterestUsernames returns 3–30 char [a-z0-9_] handles only and rotates with variation', () => {
    expect(generatePinterestUsernames({keywords: '   !!! '})).toEqual([]);

    const five = generatePinterestUsernames({keywords: 'Cozy Home Studio!', style: 'descriptive', count: 5, variation: 0});
    expect(five).toHaveLength(5);
    for (const u of five) {
      expect(isValidPinterestUsername(u.username)).toBe(true);
      expect(u.chars).toBeGreaterThanOrEqual(3);
      expect(u.chars).toBeLessThanOrEqual(30);
      expect(u.username).toMatch(/^[a-z0-9_]{3,30}$/);
    }

    const ten = generatePinterestUsernames({keywords: 'Minimalist Craft Studio', style: 'creative', count: 10, variation: 0});
    const tenRot = generatePinterestUsernames({keywords: 'Minimalist Craft Studio', style: 'creative', count: 10, variation: 1});
    expect(ten).toHaveLength(10);
    expect(tenRot.map((x) => x.username)).not.toEqual(ten.map((x) => x.username));
  });

  it('generatePinterestBios always stays <= 160 Unicode chars across tones and long keywords', () => {
    expect(generatePinterestBios({niche: '   '})).toEqual([]);

    const tones = ['friendly', 'professional', 'playful'] as const;
    for (const tone of tones) {
      const bios = generatePinterestBios({
        niche: 'Sustainable Tiny House Architecture & Modular Interior Design',
        tone,
        keywords: 'off grid cabin living, compact woodworking furniture, solar kitchen design',
      });
      expect(bios.length).toBeGreaterThanOrEqual(3);
      expect(bios.length).toBeLessThanOrEqual(5);
      for (const b of bios) {
        expect(b.chars).toBe(countUnicodeChars(b.bio));
        expect(b.chars).toBeLessThanOrEqual(PINTEREST_LIMITS.profileBio);
        expect(b.withinLimit).toBe(true);
      }
    }
  });
});

describe('Batch 4 — Pinterest Pin Ideas & Content Calendar', () => {
  it('generatePinterestPinIdeas supports 5/10 count, format filter, and variation', () => {
    expect(generatePinterestPinIdeas({niche: ''})).toEqual([]);

    const five = generatePinterestPinIdeas({niche: 'Indoor Plants', pinType: 'howto', count: 5, variation: 0});
    expect(five).toHaveLength(5);
    expect(five[0].format).toBe('How-To Guide');
    expect(five[0].sentence.length).toBeGreaterThan(25);

    const ten = generatePinterestPinIdeas({niche: 'Indoor Plants', pinType: 'any', count: 10, variation: 2});
    expect(ten).toHaveLength(10);
  });

  it('buildPinterestContentCalendar creates dated entries from startDate and escapes CSV safely', () => {
    const emptyErr = buildPinterestContentCalendar({niche: '', pinsPerWeek: 3, startDate: '2026-06-01'});
    expect(emptyErr.valid).toBe(false);

    const badDateErr = buildPinterestContentCalendar({niche: 'Baking', pinsPerWeek: 3, startDate: 'not-a-date'});
    expect(badDateErr.valid).toBe(false);

    const cal = buildPinterestContentCalendar({
      niche: 'Sourdough "Artisan" Baking',
      pinsPerWeek: 5,
      startDate: '2026-06-01',
      mix: 'mixed',
    });
    expect(cal.valid).toBe(true);
    expect(cal.entries).toHaveLength(5);
    expect(cal.entries[0].date).toBe('2026-06-01');
    expect(cal.entries[0].weekday).toBe('Mon');

    const csv = serializePinterestCalendarCsv(cal.entries);
    expect(csv.split('\n')).toHaveLength(6);
    expect(csv).toContain('""Artisan""');
  });
});

describe('Batch 4 — Pinterest Calculators (Independent Math Verification)', () => {
  it('calculatePinterestEngagement computes both Impressions and Followers formulas accurately and rejects bad inputs', () => {
    const zeroImp = calculatePinterestEngagement({
      method: 'impressions',
      denominator: 0,
      saves: 50,
      closeUps: 100,
      linkClicks: 25,
      comments: 5,
    });
    expect(zeroImp.valid).toBe(false);
    expect(zeroImp.error).toContain('greater than 0');

    const negSaves = calculatePinterestEngagement({
      method: 'followers',
      denominator: 500,
      saves: -1,
      closeUps: 10,
      linkClicks: 5,
      comments: 0,
    });
    expect(negSaves.valid).toBe(false);

    // (140 + 210 + 85 + 15) / 10000 * 100 = 450 / 10000 * 100 = 4.5%
    const byImp = calculatePinterestEngagement({
      method: 'impressions',
      denominator: 10000,
      saves: 140,
      closeUps: 210,
      linkClicks: 85,
      comments: 15,
    });
    expect(byImp.valid).toBe(true);
    expect(byImp.totalInteractions).toBe(450);
    expect(byImp.engagementRate).toBe(4.5);
    expect(byImp.saveRate).toBe(1.4);
    expect(byImp.clickThroughRate).toBe(0.85);

    // (140 + 210 + 85 + 15) / 2500 * 100 = 18%
    const byFol = calculatePinterestEngagement({
      method: 'followers',
      denominator: 2500,
      saves: 140,
      closeUps: 210,
      linkClicks: 85,
      comments: 15,
    });
    expect(byFol.valid).toBe(true);
    expect(byFol.engagementRate).toBe(18);
  });

  it('calculatePinterestFollowerGrowth computes ((Current - Previous) / Previous) * 100 and rejects previous=0 or negative', () => {
    const zeroPrev = calculatePinterestFollowerGrowth({
      previousFollowers: 0,
      currentFollowers: 250,
      periodValue: 30,
      periodUnit: 'days',
    });
    expect(zeroPrev.valid).toBe(false);
    expect(zeroPrev.error).toContain('Previous Followers is 0');

    const zeroPeriod = calculatePinterestFollowerGrowth({
      previousFollowers: 1000,
      currentFollowers: 1200,
      periodValue: 0,
      periodUnit: 'weeks',
    });
    expect(zeroPeriod.valid).toBe(false);

    // ((1560 - 1200) / 1200) * 100 = 30%, abs = +360, 30 days => +12/day
    const growth = calculatePinterestFollowerGrowth({
      previousFollowers: 1200,
      currentFollowers: 1560,
      periodValue: 30,
      periodUnit: 'days',
    });
    expect(growth.valid).toBe(true);
    expect(growth.growthRatePercent).toBe(30);
    expect(growth.absoluteGrowth).toBe(360);
    expect(growth.avgGrowthPerDay).toBe(12);
    expect(growth.totalDays).toBe(30);

    // Weeks unit: 2 weeks = 14 days, 800 -> 1080 = +35%, +280, +20/day
    const weeksGrowth = calculatePinterestFollowerGrowth({
      previousFollowers: 800,
      currentFollowers: 1080,
      periodValue: 2,
      periodUnit: 'weeks',
    });
    expect(weeksGrowth.valid).toBe(true);
    expect(weeksGrowth.growthRatePercent).toBe(35);
    expect(weeksGrowth.totalDays).toBe(14);
    expect(weeksGrowth.avgGrowthPerDay).toBe(20);
  });
});

describe('Batch 4 — Board Desc, SEO Desc, Alt Text, Fonts & Stylish Text', () => {
  it('board descriptions, SEO descriptions, and alt text stay <= 500 chars', () => {
    const board = generatePinterestBoardDescriptions('Minimalist Desk Setup', 'ergonomic lighting, walnut desk');
    expect(board.length).toBe(3);
    for (const d of board) expect(countUnicodeChars(d)).toBeLessThanOrEqual(500);

    const seo = generatePinterestSeoDescriptions({
      topic: 'Patio Herb Garden Guide',
      keywords: 'container herbs, balcony gardening, basil care',
      cta: 'Save this guide for spring planting.',
    });
    expect(seo.length).toBe(3);
    for (const item of seo) {
      expect(item.chars).toBeLessThanOrEqual(500);
      expect(item.text).toContain('Patio Herb Garden Guide');
    }

    const emptyAlt = generatePinterestAltText({subject: '', colors: '', style: '', overlayText: ''});
    expect(emptyAlt).toBe('');

    const alt = generatePinterestAltText({
      subject: 'Terracotta mugs on linen runner',
      colors: 'warm ochre and cream',
      style: 'minimalist editorial flatlay',
      overlayText: 'Autumn Kitchen Favorites',
    });
    expect(alt).toContain('Terracotta mugs on linen runner');
    expect(alt).toContain('Autumn Kitchen Favorites');
    expect(countUnicodeChars(alt)).toBeLessThanOrEqual(500);
  });

  it('stylish text decorations and Unicode font mappings work cleanly', () => {
    const fonts = convertToUnicodeFonts('Pinterest');
    expect(fonts.length).toBeGreaterThan(4);
    expect(fonts.some((f) => f.result !== 'Pinterest')).toBe(true);

    const decs = convertToStylishDecorations('Minimalist Board', 'bold');
    expect(decs.length).toBeGreaterThan(4);
    expect(decs[0].result).toContain('✧');
  });
});
