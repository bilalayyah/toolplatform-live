import {describe, it, expect} from 'vitest';
import {FACEBOOK_TOOLS} from '../../data/facebookTools';
import {
  generatePostCaptions,
  generateCamelCaseHashtags,
  generatePostIdeas,
  generateReelIdeas,
  generateStoryIdeas,
  generateReelCaptions,
  generateVideoTitles,
  generateVideoDescriptions,
  generateFacebookComments,
  generateFacebookReplies,
  generateFacebookDms,
  generateAdHeadlines,
  generateAdCopy,
  generateFacebookCtas,
  generateGroupNames,
  generateGroupDescriptions,
} from '../facebook/textGenerators';
import {
  analyzeFacebookCharacters,
  analyzeFacebookHashtags,
  calculateFacebookEngagementRate,
  calculateFollowerGrowth,
  formatFacebookText,
  pickGiveawayWinners,
} from '../facebook/utilityEngines';
import {fitBioWithinCap, generateFacebookBios} from '../../components/tools/facebookHelpers';

describe('Batch 1 — Facebook Tools Registry Audit', () => {
  it('contains all 39 Facebook tools with valid unique slugs and excludes orphan username-format-checker', () => {
    expect(FACEBOOK_TOOLS).toHaveLength(39);
    const slugs = FACEBOOK_TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(39);
    expect(slugs).not.toContain('facebook-username-format-checker');
  });

  it('aligns maxFileSizeMB with browser limits on rebuilt utilities', () => {
    const ppr = FACEBOOK_TOOLS.find((t) => t.slug === 'facebook-profile-picture-resizer');
    const ic = FACEBOOK_TOOLS.find((t) => t.slug === 'facebook-image-compressor');
    const ppg = FACEBOOK_TOOLS.find((t) => t.slug === 'facebook-post-preview-generator');
    expect(ppr?.maxFileSizeMB).toBe(10);
    expect(ic?.maxFileSizeMB).toBe(10);
    expect(ppg?.maxFileSizeMB).toBe(10);
  });
});

describe('Batch 1 — 16 Rebuilt Deterministic Text Generators (Section 5.1)', () => {
  it('generatePostCaptions builds topic-specific captions, rotates on batch, and rejects empty input', () => {
    expect(generatePostCaptions({topic: '   ', tone: 'Friendly', goal: 'Engagement', length: 'Medium', count: 3}).errors.length).toBeGreaterThan(0);
    const r0 = generatePostCaptions({topic: 'Cold Brew Launch', audience: 'Coffee Lovers', tone: 'Friendly', goal: 'Promote', length: 'Medium', count: 3, batch: 0});
    const r1 = generatePostCaptions({topic: 'Cold Brew Launch', audience: 'Coffee Lovers', tone: 'Friendly', goal: 'Promote', length: 'Medium', count: 3, batch: 1});
    expect(r0.items).toHaveLength(3);
    expect(r0.items[0]).toContain('Cold Brew Launch');
    expect(r1.items).not.toEqual(r0.items);
  });

  it('generateCamelCaseHashtags creates unique CamelCase tags and handles invalid input', () => {
    expect(generateCamelCaseHashtags({keywords: '', count: 5}).errors.length).toBeGreaterThan(0);
    const res = generateCamelCaseHashtags({keywords: 'specialty coffee austin', count: 10});
    expect(res.items.length).toBe(10);
    expect(res.items.every((tag) => tag.startsWith('#') && !tag.includes(' '))).toBe(true);
    expect(res.items.some((tag) => /#[A-Z]/.test(tag))).toBe(true);
  });

  it('generatePostIdeas creates topic-specific Facebook post ideas', () => {
    expect(generatePostIdeas({topic: '', contentType: 'Any', count: 5}).errors.length).toBeGreaterThan(0);
    const res = generatePostIdeas({topic: 'Home Baking', contentType: 'Poll', count: 5});
    expect(res.items).toHaveLength(5);
    expect(res.items[0]).toContain('Home Baking');
  });

  it('generateReelIdeas creates structured hook + concept + length items', () => {
    expect(generateReelIdeas({topic: '', style: 'Tutorial', count: 5}).errors.length).toBeGreaterThan(0);
    const res = generateReelIdeas({topic: 'Latte Art', style: 'Tutorial', count: 5});
    expect(res.items).toHaveLength(5);
    expect(res.items[0].hook).toBeTruthy();
    expect(res.items[0].concept).toContain('Latte Art');
  });

  it('generateStoryIdeas returns Story ideas with interactive formats', () => {
    const res = generateStoryIdeas({topic: 'Weekend Pop-up', storyType: 'Poll', count: 5});
    expect(res.items).toHaveLength(5);
    expect(res.items[0].format).toBeTruthy();
  });

  it('generateReelCaptions builds short captions with optional hashtags', () => {
    const noTags = generateReelCaptions({topic: 'Morning Stretch', tone: 'Casual', count: 3, includeHashtags: false});
    const withTags = generateReelCaptions({topic: 'Morning Stretch', tone: 'Casual', count: 3, includeHashtags: true});
    expect(noTags.items).toHaveLength(3);
    expect(withTags.items[0]).toContain('#');
  });

  it('generateVideoTitles creates distinct watchable video titles', () => {
    const res = generateVideoTitles({topic: 'Sourdough Starter', style: 'How-to', count: 5});
    expect(res.items).toHaveLength(5);
    expect(res.items[0].toLowerCase()).toContain('sourdough');
  });

  it('generateVideoDescriptions outputs structured sections and timestamps when enabled', () => {
    const res = generateVideoDescriptions({
      topic: 'Desk Setup Tour',
      videoTitle: 'Clean Minimalist Desk Tour',
      keyPoints: 'Monitor arm, mechanical keyboard, cable tray',
      includeTimestamps: true,
      cta: 'Subscribe to our Page',
    });
    expect(res.items.length).toBeGreaterThanOrEqual(2);
    expect(res.items[0]).toContain('00:00');
  });

  it('generateFacebookComments builds contextual comments', () => {
    const res = generateFacebookComments({postText: 'We just opened our second bakery location downtown!', tone: 'Congratulatory', count: 3});
    expect(res.items).toHaveLength(3);
  });

  it('generateFacebookReplies builds thoughtful Page replies', () => {
    const res = generateFacebookReplies({receivedComment: 'What hours are you open on Sundays?', tone: 'Friendly', count: 3});
    expect(res.items).toHaveLength(3);
  });

  it('generateFacebookDms returns structured Messenger variations', () => {
    const res = generateFacebookDms({purpose: 'Collaboration', keyDetails: 'local coffee tasting event', tone: 'Friendly'});
    expect(res.items.length).toBeGreaterThanOrEqual(2);
    expect(res.items[0].message).toContain('local coffee tasting event');
  });

  it('generateAdHeadlines enforces strict <= 40 char limit and rejects > 40 char product names', () => {
    const tooLong = generateAdHeadlines({
      product: 'Ultra Super Long Brand Name Over Forty Characters Here',
      style: 'Benefit',
      count: 5,
    });
    expect(tooLong.errors.length).toBeGreaterThan(0);

    const valid = generateAdHeadlines({
      product: 'FocusDesk',
      benefitOrOffer: 'Save 2 Hours',
      style: 'Benefit',
      count: 10,
    });
    expect(valid.items.length).toBeGreaterThan(0);
    expect(valid.items.every((h) => h.length <= 40 && h.valid)).toBe(true);
  });

  it('generateAdCopy structures Primary Text, <=40 char Headline, Description, and CTA', () => {
    const res = generateAdCopy({
      product: 'RoastBox',
      audience: 'Home Baristas',
      benefit: 'fresh roasted beans weekly',
      offer: '20% off first order',
      tone: 'Persuasive',
      cta: 'Shop Now',
    });
    expect(res.items.length).toBeGreaterThanOrEqual(2);
    expect(res.items[0].headlineLength).toBeLessThanOrEqual(40);
    expect(res.items[0].cta).toBe('Shop Now');
  });

  it('generateFacebookCtas builds goal-matched closing CTAs', () => {
    const res = generateFacebookCtas({goal: 'Comment', topic: 'our spring checklist', tone: 'Friendly', count: 5});
    expect(res.items).toHaveLength(5);
  });

  it('generateGroupNames creates community group names cleanly', () => {
    const res = generateGroupNames({topic: 'Austin Runners', purpose: 'Hobby', style: 'Descriptive', count: 5});
    expect(res.items).toHaveLength(5);
  });

  it('generateGroupDescriptions builds clear Group About sections and rules', () => {
    const res = generateGroupDescriptions({
      groupName: 'Austin Trail Runners',
      topic: 'trail running routes and weekend meetups',
      whoFor: 'runners of all paces in Central Texas',
      tone: 'Welcoming',
    });
    expect(res.items.length).toBeGreaterThanOrEqual(2);
    expect(res.items[0]).toContain('Austin Trail Runners');
  });
});

describe('Batch 1 — Built Utilities & Fixed Pickers/Calculators (Sections 5.2, 5.3, 5.4)', () => {
  it('analyzeFacebookHashtags counts tags, catches case-insensitive duplicates, warns > 10, handles 0 tags', () => {
    const zero = analyzeFacebookHashtags('Just a plain post without any hashtags at all.');
    expect(zero.totalCount).toBe(0);
    expect(zero.uniqueCount).toBe(0);

    const elevenAndDups = analyzeFacebookHashtags(
      '#Coffee #coffee #Latte #Cafe #Brew #Espresso #Roast #Beans #Barista #Morning #Local #Art'
    );
    expect(elevenAndDups.totalCount).toBe(12);
    expect(elevenAndDups.uniqueCount).toBe(11);
    expect(elevenAndDups.duplicates).toHaveLength(1);
    expect(elevenAndDups.duplicates[0].count).toBe(2);
    expect(elevenAndDups.exceedsBestPractice).toBe(true);
  });

  it('formatFacebookText performs all 6 text formatting transformations deterministically', () => {
    expect(formatFacebookText('Hello    world\n\n\n\nNext   line ', 'clean-spaces')).toBe('Hello world\n\nNext line');
    expect(formatFacebookText('guide to local coffee', 'title-case')).toBe('Guide to Local Coffee');
    expect(formatFacebookText('sale now', 'uppercase')).toBe('SALE NOW');
    expect(formatFacebookText('SALE NOW', 'lowercase')).toBe('sale now');
    expect(formatFacebookText('Item one\n- Item two', 'bullet-list')).toBe('• Item one\n• Item two');
    expect(formatFacebookText('Line 1\n\n\nLine 2', 'remove-empty-lines')).toBe('Line 1\nLine 2');
  });

  it('analyzeFacebookCharacters counts emojis as 1 Unicode code point and tracks all 5 field limits', () => {
    const sample = 'Hi 🎉🚀';
    const res = analyzeFacebookCharacters(sample, 'profile-bio');
    expect(res.characters).toBe(5);
    expect(res.utf16Units).toBe(7);
    expect(res.charactersWithoutSpaces).toBe(4);
    expect(res.words).toBe(2);
    expect(res.lines).toBe(1);
    expect(res.limit).toBe(101);
    expect(res.withinLimit).toBe(true);

    expect(analyzeFacebookCharacters('A'.repeat(76), 'page-name').withinLimit).toBe(false);
    expect(analyzeFacebookCharacters('A'.repeat(256), 'page-about').exceededBy).toBe(1);
    expect(analyzeFacebookCharacters('A', 'post').limit).toBe(63206);
    expect(analyzeFacebookCharacters('A', 'comment').limit).toBe(8000);
  });

  it('calculateFollowerGrowth computes Growth Rate formula, daily average, and 0-previous edge case', () => {
    const valid = calculateFollowerGrowth({previousRaw: '1200', currentRaw: '1500', periodRaw: '30', unit: 'days'});
    expect(valid.valid).toBe(true);
    expect(valid.absoluteGrowth).toBe(300);
    expect(valid.growthRatePercent).toBeCloseTo(25, 4);
    expect(valid.averagePerDay).toBeCloseTo(10, 4);

    const zeroPrev = calculateFollowerGrowth({previousRaw: '0', currentRaw: '50', periodRaw: '1', unit: 'weeks'});
    expect(zeroPrev.valid).toBe(true);
    expect(zeroPrev.growthRatePercent).toBeNull();
    expect(zeroPrev.zeroBaselineNotice).toContain('division by zero');
    expect(zeroPrev.averagePerDay).toBeCloseTo(50 / 7, 4);

    const neg = calculateFollowerGrowth({previousRaw: '-10', currentRaw: '50', periodRaw: '10', unit: 'days'});
    expect(neg.valid).toBe(false);
  });

  it('calculateFacebookEngagementRate cleanly separates Followers and Reach methods', () => {
    const byFollowers = calculateFacebookEngagementRate({
      method: 'followers',
      denominatorRaw: '5000',
      reactionsRaw: '200',
      commentsRaw: '30',
      sharesRaw: '15',
    });
    expect(byFollowers.valid).toBe(true);
    expect(byFollowers.totalEngagements).toBe(245);
    expect(byFollowers.engagementRate).toBe(4.9);

    const byReach = calculateFacebookEngagementRate({
      method: 'reach',
      denominatorRaw: '2000',
      reactionsRaw: '200',
      commentsRaw: '30',
      sharesRaw: '15',
    });
    expect(byReach.valid).toBe(true);
    expect(byReach.engagementRate).toBe(12.25);

    const zero = calculateFacebookEngagementRate({
      method: 'reach',
      denominatorRaw: '0',
      reactionsRaw: '10',
      commentsRaw: '0',
      sharesRaw: '0',
    });
    expect(zero.valid).toBe(false);
  });

  it('pickGiveawayWinners deduplicates, draws winners & backups, validates counts, and never invents names on shortfall', () => {
    const res = pickGiveawayWinners({
      rawEntries: 'Alice\nalice \nBob\nCharlie\nDiana',
      winnerCount: 2,
      backupCount: 2,
      removeDuplicates: true,
    });
    expect(res.valid).toBe(true);
    expect(res.duplicatesRemoved).toBe(1);
    expect(res.eligibleCount).toBe(4);
    expect(res.winners).toHaveLength(2);
    expect(res.backups).toHaveLength(2);
    expect(new Set([...res.winners, ...res.backups]).size).toBe(4);

    // Shortfall case: 2 unique people, requesting 3 winners + 2 backups
    const shortfall = pickGiveawayWinners({
      rawEntries: 'Alice\nBob',
      winnerCount: 3,
      backupCount: 2,
      removeDuplicates: true,
    });
    expect(shortfall.valid).toBe(true);
    expect(shortfall.warnings.length).toBeGreaterThan(0);
    expect(shortfall.winners).toHaveLength(2);
    expect(shortfall.backups).toHaveLength(0);

    // Out-of-range validation
    const invalid = pickGiveawayWinners({
      rawEntries: 'Alice',
      winnerCount: 11,
      backupCount: 6,
      removeDuplicates: true,
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBe(2);
  });
});

describe('Batch 1 Fix Pass — QA Regressions Covered', () => {
  it('Item 1: facebook-hashtag-generator metadata matches 5 / 10 / 15 selector copy', () => {
    const tool = FACEBOOK_TOOLS.find((t) => t.slug === 'facebook-hashtag-generator');
    expect(tool).toBeDefined();
    expect(tool?.howTo[2].title).toBe('Choose 5, 10 or 15 tags & copy');
    expect(JSON.stringify(tool)).not.toContain('Select 2–5 tags');
  });

  it('Item 2: generateReelCaptions assigns distinct CamelCase hashtag blocks per caption', () => {
    const res = generateReelCaptions({topic: 'Sourdough Baking Tips', tone: 'Casual', count: 5, includeHashtags: true});
    expect(res.items).toHaveLength(5);
    const hashtagLines = res.items.map((cap) => {
      const tags = cap.match(/#[A-Za-z0-9]+/g) ?? [];
      return tags.join(' ');
    });
    expect(hashtagLines.every((line) => line.length > 0)).toBe(true);
    expect(new Set(hashtagLines).size).toBe(5);
  });

  it('Item 3: generateVideoTitles preserves user casing and produces varied structures', () => {
    const res = generateVideoTitles({topic: 'how to bake sourdough at home', style: 'How-to', count: 5});
    expect(res.items).toHaveLength(5);
    expect(res.items.some((t) => t.includes('how to bake sourdough at home'))).toBe(true);
    expect(new Set(res.items).size).toBe(5);
  });

  it('Item 6: generateFacebookBios and fitBioWithinCap enforce 101-char cap cleanly', () => {
    const bios = generateFacebookBios({
      niche: 'GreenLeaf Coffee Roasters',
      value: 'Small-batch specialty coffee & weekend workshops in Austin',
      cta: 'Order online or visit daily 7am–5pm',
      maxIntroChars: 101,
    });
    expect(bios.every((b) => b.length <= 101 && b.cap === 101)).toBe(true);
    expect(fitBioWithinCap('word '.repeat(40), 101).length).toBeLessThanOrEqual(101);
  });
});

