import {describe, it, expect} from 'vitest';
import {INSTAGRAM_TOOLS} from '../../data/instagramTools';
import {
  analyzeInstagramHashtags,
  buildInstagramContentCalendar,
  calculateFollowerGrowthMilestones,
  calculateInstagramEngagementRate,
  calculatePostingTimes,
  convertToStylishDecorations,
  convertToUnicodeFonts,
  countUnicodeChars,
  extractDominantPaletteFromPixels,
  formatInstagramLineBreaks,
  formatInstagramTextStyles,
  formatInstagramUsernameBatch,
  formatRawNameToInstagramHandle,
  generateInstagramBios,
  generateInstagramCaptions,
  generateInstagramComments,
  generateInstagramDms,
  generateInstagramHashtags,
  generateInstagramPostIdeas,
  generateInstagramReelCaptions,
  generateInstagramReelHooks,
  generateInstagramReelIdeas,
  generateInstagramReplies,
  generateInstagramStoryIdeas,
  mixInstagramHashtagGroups,
  normalizeHashtagCopyInput,
  pickInstagramGiveawayWinners,
  validateInstagramUsernameFormat,
} from '../../components/tools/instagramHelpers';

describe('Batch 2 — Instagram Registry Audit', () => {
  it('contains all 38 Instagram tools with unique slugs', () => {
    expect(INSTAGRAM_TOOLS).toHaveLength(38);
    expect(new Set(INSTAGRAM_TOOLS.map((t) => t.slug)).size).toBe(38);
  });

  it('has no unfulfilled "planned" promises in Instagram tool FAQs/HowTo', () => {
    const serialized = JSON.stringify(INSTAGRAM_TOOLS).toLowerCase();
    expect(serialized).not.toContain('export is planned');
  });
});

describe('Batch 2 — Text Generators, Counters, Formatters & Planners', () => {
  it('generateInstagramBios preserves full copy with Unicode char count and empty check', () => {
    expect(
      generateInstagramBios({role: '', niche: '', locationOrProof: '', cta: '', includeLineBreaks: true}),
    ).toHaveLength(0);

    const baker = generateInstagramBios({
      role: 'Sourdough Baker & Teacher',
      niche: 'Home baking & starter care',
      locationOrProof: '50k+ bakers taught',
      cta: 'Get my free starter guide',
      includeLineBreaks: true,
    });
    expect(baker).toHaveLength(5);
    expect(baker.every((b) => b.bio.includes('Sourdough Baker & Teacher'))).toBe(true);
    expect(baker.every((b) => b.length === countUnicodeChars(b.bio))).toBe(true);
  });

  it('countUnicodeChars counts multi-byte emojis as 1 character each', () => {
    expect(countUnicodeChars('Hi ✨🚀')).toBe(5);
  });

  it('validateInstagramUsernameFormat validates syntax rules cleanly', () => {
    expect(validateInstagramUsernameFormat('').valid).toBe(false);
    expect(validateInstagramUsernameFormat('').error).toBeTruthy();
    expect(validateInstagramUsernameFormat('@jane.doe_99').valid).toBe(true);
    expect(validateInstagramUsernameFormat('bad..name').valid).toBe(false);
    expect(validateInstagramUsernameFormat('trailing.').valid).toBe(false);
    expect(validateInstagramUsernameFormat('123456').valid).toBe(false);
    expect(validateInstagramUsernameFormat('a'.repeat(31)).valid).toBe(false);
  });

  it('formatRawNameToInstagramHandle and batch formatter enforce 30-char ceiling', () => {
    const handles = formatRawNameToInstagramHandle('Sarah Miller Photography');
    expect(handles.length).toBeGreaterThan(3);
    expect(handles.every((h) => h.length <= 30 && validateInstagramUsernameFormat(h).valid)).toBe(true);

    const batch = formatInstagramUsernameBatch('Sarah Miller Photography\nNorth-Side Coffee!');
    expect(batch.lines).toHaveLength(2);
    expect(batch.variations.every((v) => v.length <= 31)).toBe(true);
  });

  it('generateInstagramCaptions incorporates CTA across every tone including inspirational', () => {
    const tones = ['educational', 'inspirational', 'casual', 'sales'] as const;
    for (const tone of tones) {
      const caps = generateInstagramCaptions({topic: 'Morning Focus', tone, cta: 'MY_CUSTOM_CTA'});
      expect(caps.length).toBeGreaterThan(0);
      expect(caps.every((c) => c.caption.includes('Morning Focus') && c.caption.includes('MY_CUSTOM_CTA'))).toBe(true);
    }
    expect(generateInstagramCaptions({topic: '   ', tone: 'educational', cta: 'Save'})).toHaveLength(0);
  });

  it('hashtag tools count duplicates, mix cleanly, and normalize comma-separated keywords', () => {
    const gen = generateInstagramHashtags('espresso, latte art', 10);
    expect(gen.all.length).toBe(10);
    expect(gen.all.some((t) => t.includes('espresso'))).toBe(true);

    const analyzed = analyzeInstagramHashtags('#Coffee #coffee #Latte #Art');
    expect(analyzed.totalCount).toBe(4);
    expect(analyzed.uniqueCount).toBe(3);
    expect(analyzed.duplicates).toHaveLength(1);

    const copied = normalizeHashtagCopyInput('street photography, nikon, #Nikon');
    expect(copied.tags).toEqual(['#streetphotography', '#nikon']);
    expect(copied.duplicatesRemoved).toBe(1);

    const mixed = mixInstagramHashtagGroups(['#Design #ui', '#design #ux #studio'], 3);
    expect(mixed.totalUniqueAvailable).toBe(4);
    expect(mixed.tags).toHaveLength(3);
  });

  it('unicode fonts, stylish decorations, line breaks, and text formatter behave deterministically', () => {
    const fonts = convertToUnicodeFonts('Hello');
    expect(fonts.length).toBe(8);
    expect(convertToStylishDecorations('Hello', 'bold-sans')[0].result).not.toContain('Hello');
    expect(formatInstagramLineBreaks('A \n\nB')).toBe('A\n\u2800\nB');
    const styles = formatInstagramTextStyles('hello   world\n\n- bullet one');
    expect(styles.find((s) => s.name.includes('Bullet'))?.val).toContain('• bullet one');
  });

  it('post, reel, story, comment, reply, and dm generators dynamically reflect inputs', () => {
    expect(generateInstagramPostIdeas('Pottery', 'educate').every((i) => i.title.includes('Pottery'))).toBe(true);
    expect(generateInstagramReelIdeas('Pottery', 'tutorial').every((r) => r.title.includes('Pottery'))).toBe(true);
    expect(generateInstagramStoryIdeas('Pottery', 'poll').every((s) => s.text.includes('Pottery'))).toBe(true);
    expect(generateInstagramComments('Pottery', 'all').every((c) => c.text.includes('Pottery'))).toBe(true);

    const linkReply = generateInstagramReplies('Where is the link to buy?', 'auto', 'bio shop');
    expect(linkReply.detectedIntent).toBe('Link Request');
    expect(linkReply.replies[0]).toContain('bio shop');

    const dms = generateInstagramDms({recipient: 'Maya', topic: 'spring shoot', category: 'collab'});
    expect(dms[0]).toContain('Maya');
    expect(dms[0]).toContain('spring shoot');
  });

  it('content calendar builds real sequential dates and posting planner shifts by timezone & industry', () => {
    const cal = buildInstagramContentCalendar({
      daysPerWeek: 3,
      startDate: '2026-05-04',
      pillars: ['Tips', 'Behind Scenes'],
      weeks: 2,
    });
    expect(cal).toHaveLength(6);
    expect(cal[0].date).toBe('2026-05-04');
    expect(cal[1].date).toBe('2026-05-06');

    const nyToLon = calculatePostingTimes({
      industry: 'tech',
      audienceTzId: 'America/New_York',
      creatorTzId: 'Europe/London',
    });
    const nyToTok = calculatePostingTimes({
      industry: 'tech',
      audienceTzId: 'America/New_York',
      creatorTzId: 'Asia/Tokyo',
    });
    expect(nyToLon[0].localPeak).not.toBe(nyToTok[0].localPeak);
  });
});

describe('Batch 2 — Calculators, Pickers & Dominant Color Quantizer', () => {
  it('calculateInstagramEngagementRate matches hand-verified ER math (5.5% and 5.0%)', () => {
    const caseA = calculateInstagramEngagementRate({
      followers: 10000,
      likes: 450,
      comments: 50,
      saves: 20,
      shares: 30,
    });
    expect(caseA.totalInteractions).toBe(550);
    expect(caseA.engagementByFollowers).toBe(5.5);
    expect(caseA.tierLabel).toBe('High Engagement (3%–6%)');

    const caseB = calculateInstagramEngagementRate({
      followers: 10000,
      likes: 450,
      comments: 50,
      saves: 0,
      shares: 0,
      reach: 2000,
    });
    expect(caseB.totalInteractions).toBe(500);
    expect(caseB.engagementByFollowers).toBe(5);
    expect(caseB.engagementByReach).toBe(25);
  });

  it('calculateFollowerGrowthMilestones computes milestones and validates invalid inputs cleanly', () => {
    expect(calculateFollowerGrowthMilestones({currentRaw: '0', rateRaw: '5', targetRaw: '1000'}).valid).toBe(false);
    expect(calculateFollowerGrowthMilestones({currentRaw: '2500', rateRaw: '-2', targetRaw: '10000'}).valid).toBe(false);

    const zeroRate = calculateFollowerGrowthMilestones({currentRaw: '2500', rateRaw: '0', targetRaw: '10000'});
    expect(zeroRate.valid).toBe(true);
    expect(zeroRate.month12).toBe(2500);
    expect(zeroRate.monthsToTarget).toBeNull();

    const growth = calculateFollowerGrowthMilestones({currentRaw: '2500', rateRaw: '5', targetRaw: '10000'});
    expect(growth.valid).toBe(true);
    expect(growth.month12).toBe(Math.round(2500 * Math.pow(1.05, 12)));
    expect(growth.monthsToTarget).toBe(Math.ceil(Math.log(4) / Math.log(1.05)));
    expect(growth.milestones.find((m) => m.label === '1K')?.status).toBe('reached');
    expect(growth.milestones.find((m) => m.label === '10K')?.status).toBe('projected');
  });

  it('pickInstagramGiveawayWinners deduplicates, filters keywords, and rejects empty input', () => {
    expect(
      pickInstagramGiveawayWinners({rawEntries: '  \n ', winnerCount: 1, backupCount: 0, removeDuplicates: true}).valid,
    ).toBe(false);

    const draw = pickInstagramGiveawayWinners({
      rawEntries: '@a yes\n@A yes\n@b no\n@c yes',
      winnerCount: 2,
      backupCount: 1,
      removeDuplicates: true,
      keywordFilter: 'yes',
    });
    expect(draw.valid).toBe(true);
    expect(draw.eligibleCount).toBe(2);
    expect(draw.duplicatesRemoved).toBe(1);
    expect(draw.winners).toHaveLength(2);
    expect(draw.backups).toHaveLength(0);
    expect(draw.warning).toBeTruthy();
  });

  it('extractDominantPaletteFromPixels extracts true RGB & HEX swatches', () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 128, 255, 255,
    ]);
    const swatches = extractDominantPaletteFromPixels(pixels, 4);
    expect(swatches[0].hex).toBe('#FF0000');
    expect(swatches[0].rgb).toBe('rgb(255, 0, 0)');
    expect(swatches[1].hex).toBe('#0080FF');
  });
});
