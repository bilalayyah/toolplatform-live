import { describe, it, expect } from 'vitest';
import { SNAPCHAT_TOOLS } from '../../data/snapchatTools';
import {
  countUnicodeChars,
  validateSnapchatUsername,
  generateSnapchatUsernames,
  generateSnapchatCaptions,
  generateSnapchatStoryIdeas,
  calculateSnapchatStreak,
  calculateSnapchatEngagement,
  generateSnapchatSpotlightIdeas,
  generateSpotlightCaptions,
  generateSnapchatFilterNames,
  generateSnapchatLensIdeas,
  generateBitmojiOutfitIdeas,
  generateSnapchatBirthdayCaptions,
  SNAPCHAT_EMOJI_GUIDE,
  generateSnapchatCalendar,
  serializeSnapchatCalendarCsv,
  generateSnapchatBiosDetailed,
  generateSnapchatStylishText,
  generateSnapchatUnicodeFonts,
  computeSnapchatScoreStats,
} from '../../components/tools/snapchatHelpers';

describe('Batch 6 — Step 0: Registry & Slug Verification', () => {
  const expectedSlugs = [
    'snapchat-username-generator',
    'snapchat-caption-generator',
    'snapchat-story-idea-generator',
    'snapchat-streak-calculator',
    'snapchat-engagement-calculator',
    'snapchat-spotlight-idea-generator',
    'snapchat-spotlight-caption-generator',
    'snapchat-filter-name-generator',
    'snapchat-lens-idea-generator',
    'snapchat-bitmoji-outfit-idea-generator',
    'snapchat-birthday-caption-generator',
    'snapchat-emoji-meaning-guide',
    'snapchat-content-calendar-generator',
    'snapchat-bio-generator',
    'snapchat-username-format-checker',
    'snapchat-stylish-text-generator',
    'snapchat-font-generator',
    'snapchat-score-tracker-template',
    'snapchat-story-image-resizer',
    'snapchat-profile-picture-resizer',
  ];

  it('contains exactly the 20 requested Snapchat tools in SNAPCHAT_TOOLS', () => {
    const slugs = SNAPCHAT_TOOLS.map((t) => t.slug);
    expect(slugs.length).toBe(20);
    for (const expected of expectedSlugs) {
      expect(slugs).toContain(expected);
    }
  });

  it('contains zero placeholder phrases ("Once live") in descriptions or how-tos', () => {
    const json = JSON.stringify(SNAPCHAT_TOOLS);
    expect(json.includes('Once live')).toBe(false);
  });

  it('contains zero pricing mentions ($11.99, Lifetime Premium) in SNAPCHAT_TOOLS', () => {
    const json = JSON.stringify(SNAPCHAT_TOOLS);
    expect(json.includes('11.99')).toBe(false);
    expect(json.includes('Lifetime Premium')).toBe(false);
  });
});

describe('Batch 6 — Tool 15: Snapchat Username Format Checker', () => {
  it('validates compliant 3–15 character usernames starting with a letter', () => {
    const res = validateSnapchatUsername('alex_skate');
    expect(res.valid).toBe(true);
    expect(res.charCount).toBe(10);
    expect(res.checks.every((c) => c.passed)).toBe(true);
  });

  it('rejects handles shorter than 3 characters', () => {
    const res = validateSnapchatUsername('ab');
    expect(res.valid).toBe(false);
    expect(res.checks.find((c) => c.id === 'length')?.passed).toBe(false);
  });

  it('rejects handles longer than 15 characters', () => {
    const res = validateSnapchatUsername('supercalifragilistic');
    expect(res.valid).toBe(false);
    expect(res.checks.find((c) => c.id === 'length')?.passed).toBe(false);
  });

  it('rejects handles starting with numbers or symbols', () => {
    const resNumber = validateSnapchatUsername('9alex');
    expect(resNumber.valid).toBe(false);
    expect(resNumber.checks.find((c) => c.id === 'starts-with-letter')?.passed).toBe(false);

    const resSymbol = validateSnapchatUsername('_alex');
    expect(resSymbol.valid).toBe(false);
    expect(resSymbol.checks.find((c) => c.id === 'starts-with-letter')?.passed).toBe(false);
  });

  it('rejects handles ending with symbols or containing spaces/consecutive symbols', () => {
    const resEnd = validateSnapchatUsername('alex.');
    expect(resEnd.valid).toBe(false);
    expect(resEnd.checks.find((c) => c.id === 'no-end-symbols')?.passed).toBe(false);

    const resSpace = validateSnapchatUsername('alex snap');
    expect(resSpace.valid).toBe(false);
    expect(resSpace.checks.find((c) => c.id === 'no-spaces')?.passed).toBe(false);

    const resConsec = validateSnapchatUsername('alex..snap');
    expect(resConsec.valid).toBe(false);
    expect(resConsec.checks.find((c) => c.id === 'no-consecutive-symbols')?.passed).toBe(false);
  });
});

describe('Batch 6 — Tool 1: Snapchat Username Generator', () => {
  it('generates username ideas that strictly comply with Snapchat rules', () => {
    const res = generateSnapchatUsernames({
      keyword: 'alex',
      style: 'cool',
      count: 10,
    });

    expect(res.error).toBeUndefined();
    expect(res.usernames.length).toBe(10);

    for (const item of res.usernames) {
      expect(item.chars).toBeGreaterThanOrEqual(3);
      expect(item.chars).toBeLessThanOrEqual(15);
      const check = validateSnapchatUsername(item.username);
      expect(check.valid).toBe(true);
    }
  });

  it('handles short style generating compact handles', () => {
    const res = generateSnapchatUsernames({
      keyword: 'sam',
      style: 'short',
      count: 5,
    });

    expect(res.usernames.length).toBe(5);
    for (const item of res.usernames) {
      expect(item.chars).toBeLessThanOrEqual(10);
    }
  });

  it('returns an inline error on empty input', () => {
    const res = generateSnapchatUsernames({
      keyword: '   ',
      style: 'cool',
      count: 5,
    });
    expect(res.error).toBeDefined();
    expect(res.usernames.length).toBe(0);
  });
});

describe('Batch 6 — Tool 2: Snapchat Caption Generator', () => {
  it('generates captions strictly ≤ 80 characters (Snapchat text bar limit)', () => {
    const res = generateSnapchatCaptions({
      topic: 'watching the golden hour sunset with friends',
      style: 'chill',
      count: 10,
    });

    expect(res.error).toBeUndefined();
    expect(res.captions.length).toBe(10);

    for (const cap of res.captions) {
      expect(cap.chars).toBeLessThanOrEqual(80);
      expect(cap.isWithinLimit).toBe(true);
    }
  });

  it('rejects empty input cleanly', () => {
    const res = generateSnapchatCaptions({
      topic: '',
      style: 'funny',
      count: 5,
    });
    expect(res.error).toBeDefined();
    expect(res.captions.length).toBe(0);
  });
});

describe('Batch 6 — Tool 3: Snapchat Story Idea Generator', () => {
  it('generates filmable multi-snap story concepts with interactive stickers', () => {
    const res = generateSnapchatStoryIdeas({
      topic: 'making homemade ramen',
      audience: 'Close Friends',
      storyType: 'day_in_life',
      count: 5,
    });

    expect(res.error).toBeUndefined();
    expect(res.ideas.length).toBe(5);
    for (const idea of res.ideas) {
      expect(idea.title.length).toBeGreaterThan(10);
      expect(idea.description.length).toBeGreaterThan(20);
      expect(idea.interactiveSticker.length).toBeGreaterThan(5);
    }
  });
});

describe('Batch 6 — Tool 4: Snapchat Streak Calculator', () => {
  it('calculates active streak duration and 24h deadline correctly', () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16);

    const res = calculateSnapchatStreak({
      startDate: tenDaysAgo,
      lastSnapDateTime: twoHoursAgo,
    });

    expect(res.status).toBe('active');
    expect(res.streakDays).toBeGreaterThanOrEqual(10);
    expect(res.hoursRemaining).toBeGreaterThanOrEqual(21);
    expect(res.warningNote).toContain('Streak is healthy');
  });

  it('triggers hourglass urgency warning when under 4 hours remaining', () => {
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    // Last snap was 22 hours ago -> 2 hours left
    const twentyTwoHoursAgo = new Date(now.getTime() - 22 * 60 * 60 * 1000).toISOString().slice(0, 16);

    const res = calculateSnapchatStreak({
      startDate: fiveDaysAgo,
      lastSnapDateTime: twentyTwoHoursAgo,
    });

    expect(res.status).toBe('urgent');
    expect(res.hoursRemaining).toBeLessThanOrEqual(4);
    expect(res.warningNote).toContain('HOURGLASS WARNING');
  });

  it('detects expired broken streak when past 24 hours', () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    // Last snap was 26 hours ago
    const twentySixHoursAgo = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString().slice(0, 16);

    const res = calculateSnapchatStreak({
      startDate: tenDaysAgo,
      lastSnapDateTime: twentySixHoursAgo,
    });

    expect(res.status).toBe('expired');
    expect(res.timeRemainingText).toContain('Expired');
    expect(res.warningNote).toContain('broken');
  });

  it('rejects future start date and last-snap date before start date', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const pastSnap = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16);

    const resFuture = calculateSnapchatStreak({
      startDate: futureDate,
      lastSnapDateTime: pastSnap,
    });
    expect(resFuture.status).toBe('invalid');
    expect(resFuture.errorMessage).toContain('future');

    const resBefore = calculateSnapchatStreak({
      startDate: '2026-11-20',
      lastSnapDateTime: '2026-11-15T12:00',
    });
    expect(resBefore.status).toBe('invalid');
    expect(resBefore.errorMessage).toContain('earlier than your streak start date');
  });
});

describe('Batch 6 — Tool 5: Snapchat Engagement Calculator', () => {
  it('calculates ((Replies + Shares) / Views) * 100 accurately', () => {
    // (50 + 25) / 1000 * 100 = 7.5%
    const res = calculateSnapchatEngagement({
      views: 1000,
      replies: 50,
      shares: 25,
    });

    expect(res.status).toBe('valid');
    expect(res.engagementRatePercent).toBe(7.5);
    expect(res.replyRatePercent).toBe(5);
    expect(res.shareRatePercent).toBe(2.5);
    expect(res.totalInteractions).toBe(75);
    expect(res.benchmarkTier).toBe('High');
  });

  it('safely guards against zero views without returning NaN or Infinity', () => {
    const res = calculateSnapchatEngagement({
      views: 0,
      replies: 10,
      shares: 5,
    });

    expect(res.status).toBe('invalid');
    expect(res.engagementRatePercent).toBe(0);
    expect(res.error).toContain('greater than 0');
  });

  it('rejects negative numbers', () => {
    const res = calculateSnapchatEngagement({
      views: 500,
      replies: -5,
      shares: 10,
    });

    expect(res.status).toBe('invalid');
    expect(res.error).toContain('negative');
  });
});

describe('Batch 6 — Tools 6 & 7: Spotlight Ideas & Captions', () => {
  it('generates Spotlight ideas with hooks under 60-second duration', () => {
    const res = generateSnapchatSpotlightIdeas({
      topic: 'skateboarding flatground tricks',
      videoStyle: 'life_hack',
      count: 5,
    });

    expect(res.error).toBeUndefined();
    expect(res.ideas.length).toBe(5);
    for (const idea of res.ideas) {
      expect(idea.first3SecHook.length).toBeGreaterThan(5);
      expect(idea.recommendedDuration).toContain('seconds');
      expect(idea.tags.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('generates Spotlight captions with hashtags', () => {
    const res = generateSpotlightCaptions({
      topic: 'my puppy learning to fetch',
      style: 'funny',
      count: 5,
    });

    expect(res.captions.length).toBe(5);
    for (const cap of res.captions) {
      expect(cap.text).toContain('#Spotlight');
      expect(cap.chars).toBeGreaterThan(15);
    }
  });
});

describe('Batch 6 — Tool 8: Snapchat Filter Name Generator', () => {
  it('generates filter title concepts tailored to events', () => {
    const res = generateSnapchatFilterNames({
      event: 'Chloe 21st Birthday',
      style: 'fun',
      count: 5,
    });

    expect(res.names.length).toBe(5);
    for (const name of res.names) {
      expect(name.name).toContain('Chloe');
      expect(name.chars).toBeGreaterThan(5);
    }
  });
});

describe('Batch 6 — Tool 9: Snapchat Lens Idea Generator', () => {
  it('generates AR lens concepts with interaction triggers and visual effects', () => {
    const res = generateSnapchatLensIdeas({
      theme: 'Retro 80s Synthwave',
      lensType: 'face_effect',
      count: 5,
    });

    expect(res.concepts.length).toBe(5);
    for (const concept of res.concepts) {
      expect(concept.trigger.length).toBeGreaterThan(5);
      expect(concept.visualEffect.length).toBeGreaterThan(10);
      expect(concept.audioFeedback.length).toBeGreaterThan(5);
    }
  });
});

describe('Batch 6 — Tool 10: Snapchat Bitmoji Outfit Idea Generator', () => {
  it('generates complete outfit combinations naming top, bottom, shoes, and accessories', () => {
    const res = generateBitmojiOutfitIdeas({
      style: 'streetwear',
      occasion: 'everyday',
      colors: 'black and neon lime',
      count: 5,
    });

    expect(res.outfits.length).toBe(5);
    for (const outfit of res.outfits) {
      expect(outfit.top.length).toBeGreaterThan(5);
      expect(outfit.bottom.length).toBeGreaterThan(5);
      expect(outfit.shoes.length).toBeGreaterThan(5);
      expect(outfit.accessory.length).toBeGreaterThan(5);
      expect(outfit.palette).toContain('neon lime');
    }
  });
});

describe('Batch 6 — Tool 11: Snapchat Birthday Caption Generator', () => {
  it('generates birthday captions strictly ≤ 80 characters incorporating name and relationship', () => {
    const res = generateSnapchatBirthdayCaptions({
      name: 'Jessica',
      relationship: 'best_friend',
      style: 'sweet',
      count: 10,
    });

    expect(res.error).toBeUndefined();
    expect(res.captions.length).toBe(10);
    for (const cap of res.captions) {
      expect(cap.text).toContain('Jessica');
      expect(cap.chars).toBeLessThanOrEqual(80);
      expect(cap.isWithinLimit).toBe(true);
    }
  });
});

describe('Batch 6 — Tool 12: Snapchat Emoji Meaning Guide', () => {
  it('contains comprehensive and accurate definitions for all official Snapchat friend emojis', () => {
    expect(SNAPCHAT_EMOJI_GUIDE.length).toBeGreaterThanOrEqual(12);

    const bestFriends = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '💛');
    expect(bestFriends).toBeDefined();
    expect(bestFriends?.name).toContain('#1 Best Friend');

    const bff = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '❤️');
    expect(bff).toBeDefined();
    expect(bff?.meaning).toContain('two weeks');

    const superBff = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '💕');
    expect(superBff).toBeDefined();
    expect(superBff?.meaning).toContain('two whole months');

    const streak = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '🔥');
    expect(streak).toBeDefined();
    expect(streak?.meaning).toContain('Snapstreak');

    const hourglass = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '⌛');
    expect(hourglass).toBeDefined();
    expect(hourglass?.meaning).toContain('about to end');

    const bday = SNAPCHAT_EMOJI_GUIDE.find((e) => e.emoji === '🎂');
    expect(bday).toBeDefined();
    expect(bday?.meaning).toContain('birthday');
  });
});

describe('Batch 6 — Tool 13: Snapchat Content Calendar Generator', () => {
  it('generates dated weekly schedules with CSV export capability', () => {
    const res = generateSnapchatCalendar({
      topic: 'Fitness & Meal Prep',
      postsPerWeek: 5,
      startDate: '2026-12-01',
      contentMix: 'mixed',
    });

    expect(res.error).toBeUndefined();
    expect(res.entries.length).toBe(5);
    expect(res.entries[0].dateStr).toBe('2026-12-01');

    const csv = serializeSnapchatCalendarCsv(res.entries);
    expect(csv).toContain('Day,Date,Day of Week,Format');
    expect(csv).toContain('Fitness & Meal Prep');
  });
});

describe('Batch 6 — Tool 14: Snapchat Bio Generator', () => {
  it('generates bios strictly under Snapchat’s 150-character limit', () => {
    const res = generateSnapchatBiosDetailed({
      handleOrName: 'Alex',
      focus: 'Street photography and daily coffee runs',
      vibe: 'casual',
      count: 5,
    });

    expect(res.bios.length).toBe(5);
    for (const bio of res.bios) {
      expect(bio.chars).toBeLessThanOrEqual(150);
      expect(bio.isWithinLimit).toBe(true);
    }
  });
});

describe('Batch 6 — Tools 16 & 17: Distinct Stylish Text vs Font Generator', () => {
  it('Stylish Text produces decorative brackets and embellishments', () => {
    const res = generateSnapchatStylishText('Weekend Snap');
    expect(res.length).toBeGreaterThanOrEqual(10);
    const brackets = res.find((r) => r.id === 'corner-brackets');
    expect(brackets?.result).toContain('『 Weekend Snap 』');
    const wings = res.find((r) => r.id === 'aesthetic-wings');
    expect(wings?.result).toContain('꧁ Weekend Snap ꧂');
  });

  it('Font Generator produces distinct Unicode mathematical alphanumeric transformations', () => {
    const res = generateSnapchatUnicodeFonts('Snap');
    expect(res.length).toBeGreaterThanOrEqual(6);
    const boldSans = res.find((r) => r.id === 'bold-sans');
    expect(boldSans?.result).toBe('𝗦𝗻𝗮𝗽');
    const monospace = res.find((r) => r.id === 'monospace');
    expect(monospace?.result).toBe('𝚂𝚗𝚊𝚙');
  });
});

describe('Batch 6 — Tool 18: Score Tracker Stats Utility', () => {
  it('accurately computes current score, net increase, and average gain', () => {
    const entries = [
      { id: '1', date: '2026-11-01', score: 10000 },
      { id: '2', date: '2026-11-05', score: 12000 },
      { id: '3', date: '2026-11-10', score: 15000 },
    ];

    const stats = computeSnapchatScoreStats(entries);
    expect(stats.initialScore).toBe(10000);
    expect(stats.currentScore).toBe(15000);
    expect(stats.netGain).toBe(5000);
    expect(stats.averageGainPerEntry).toBe(2500); // 5000 / 2
    expect(stats.daysSpan).toBe(10);
  });
});
