import { describe, it, expect } from 'vitest';
import { THREADS_TOOLS } from '../../data/threadsTools';
import { SNAPCHAT_TOOLS } from '../../data/snapchatTools';
import {
  countUnicodeChars,
  validateThreadsUsername,
  generateThreadsUsernames,
  generateThreadsBios,
  generateThreadsPosts,
  generateThreadsCaptions,
  generateThreadsHashtags,
  generateThreadsHooks,
  generateThreadsPostIdeas,
  generateThreadsReplies,
  generateThreadsComments,
  generateThreadsCalendar,
  serializeThreadsCalendarCsv,
  formatThreadsPoll,
  generateThreadsQuotePosts,
  splitThreadsPost,
  calculateThreadsEngagement,
  generateThreadsStylishText,
  generateThreadsUnicodeFonts,
} from '../../components/tools/threadsHelpers';

describe('BATCH 7: Section 0 — Snapchat Streak Calculator Wording Fix', () => {
  it('snapchat-streak-calculator has updated How-to step 1 describing date inputs', () => {
    const tool = SNAPCHAT_TOOLS.find((t) => t.slug === 'snapchat-streak-calculator');
    expect(tool).toBeDefined();
    expect(tool?.howTo[0].title).toBe('Enter streak start date & last snap date/time');
    expect(tool?.howTo[0].description).toContain(
      'Enter your streak start date and the date/time of your last snap — the calculator works out your streak length and your next deadline from those dates.'
    );
  });
});

describe('BATCH 7: Step 0 — Threads Tools Registry & Slugs', () => {
  const expectedSlugs = [
    'threads-username-generator',
    'threads-bio-generator',
    'threads-post-generator',
    'threads-thread-generator',
    'threads-caption-generator',
    'threads-hashtag-generator',
    'threads-hook-generator',
    'threads-post-idea-generator',
    'threads-reply-generator',
    'threads-comment-generator',
    'threads-stylish-text-generator',
    'threads-font-generator',
    'threads-character-counter',
    'threads-engagement-rate-calculator',
    'threads-content-calendar-generator',
    'threads-poll-generator',
    'threads-quote-generator',
    'threads-profile-picture-resizer',
    'threads-post-image-resizer',
    'threads-bio-character-counter',
  ];

  it('contains exactly 20 Threads tools in THREADS_TOOLS', () => {
    expect(THREADS_TOOLS.length).toBe(20);
  });

  it('all 20 expected slugs exist with matching category and metadata', () => {
    expectedSlugs.forEach((slug) => {
      const tool = THREADS_TOOLS.find((t) => t.slug === slug);
      expect(tool, `Tool with slug ${slug} should exist`).toBeDefined();
      expect(tool?.category).toBe('threads-tools');
      expect(tool?.name.length).toBeGreaterThan(3);
      expect(tool?.description.length).toBeGreaterThan(10);
      expect(tool?.howTo.length).toBeGreaterThanOrEqual(3);
      expect(tool?.faqs.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('contains zero occurrences of "Once live, " in descriptions or howTo', () => {
    THREADS_TOOLS.forEach((tool) => {
      expect(tool.description).not.toContain('Once live, ');
      tool.howTo.forEach((step) => {
        expect(step.description).not.toContain('Once live, ');
      });
    });
  });

  it('contains zero pricing mentions or export view UI references', () => {
    const raw = JSON.stringify(THREADS_TOOLS);
    expect(raw).not.toContain('$11.99');
    expect(raw).not.toContain('Lifetime Premium');
    expect(raw).not.toContain('export preview');
  });
});

describe('BATCH 7: Unicode grapheme cluster character counting', () => {
  it('counts ASCII characters accurately', () => {
    expect(countUnicodeChars('Hello')).toBe(5);
    expect(countUnicodeChars('')).toBe(0);
  });

  it('counts emoji as 1 character', () => {
    expect(countUnicodeChars('☕')).toBe(1);
    expect(countUnicodeChars('🧵')).toBe(1);
    expect(countUnicodeChars('Threads 🧵')).toBe(9); // 7 + 1 space + 1 emoji = 9
  });
});

describe('BATCH 7: Threads Username Validator & Generator', () => {
  it('validates compliant usernames', () => {
    const res = validateThreadsUsername('alex_dev');
    expect(res.valid).toBe(true);
    expect(res.charCount).toBe(8);
    expect(res.checks.every((c) => c.passed)).toBe(true);
  });

  it('rejects empty, over 30 chars, spaces, forbidden symbols, and double periods', () => {
    expect(validateThreadsUsername('').valid).toBe(false);
    expect(validateThreadsUsername('a'.repeat(31)).valid).toBe(false);
    expect(validateThreadsUsername('user name').valid).toBe(false);
    expect(validateThreadsUsername('user@name').valid).toBe(false);
    expect(validateThreadsUsername('.username').valid).toBe(false);
    expect(validateThreadsUsername('username.').valid).toBe(false);
    expect(validateThreadsUsername('user..name').valid).toBe(false);
  });

  it('generates compliant username variations within 30 characters', () => {
    const res = generateThreadsUsernames({
      keyword: 'sarah',
      style: 'cool',
      count: 10,
    });
    expect(res.error).toBeUndefined();
    expect(res.usernames.length).toBe(10);
    res.usernames.forEach((u) => {
      expect(u.valid).toBe(true);
      expect(u.chars).toBeLessThanOrEqual(30);
      expect(validateThreadsUsername(u.username).valid).toBe(true);
    });
  });
});

describe('BATCH 7: Threads Bio Generator (≤ 150 chars)', () => {
  it('generates bios strictly within the 150 character limit', () => {
    const vibes: ('casual' | 'professional' | 'funny' | 'minimal')[] = [
      'casual',
      'professional',
      'funny',
      'minimal',
    ];
    vibes.forEach((vibe) => {
      const res = generateThreadsBios({
        input: 'Software Architecture and Design',
        vibe,
        count: 5,
      });
      expect(res.error).toBeUndefined();
      expect(res.bios.length).toBe(5);
      res.bios.forEach((b) => {
        expect(b.chars).toBeLessThanOrEqual(150);
        expect(b.isWithinLimit).toBe(true);
      });
    });
  });
});

describe('BATCH 7: Threads Post Generator (≤ 500 chars)', () => {
  it('generates single posts strictly within 500 characters', () => {
    const tones: ('casual' | 'thoughtful' | 'funny' | 'bold')[] = [
      'casual',
      'thoughtful',
      'funny',
      'bold',
    ];
    tones.forEach((tone) => {
      const res = generateThreadsPosts({
        topic: 'Building minimalist software apps',
        tone,
        count: 5,
      });
      expect(res.error).toBeUndefined();
      expect(res.posts.length).toBe(5);
      res.posts.forEach((p) => {
        expect(p.chars).toBeLessThanOrEqual(500);
        expect(p.isWithinLimit).toBe(true);
      });
    });
  });
});

describe('BATCH 7: Threads Caption Generator (≤ 500 chars)', () => {
  it('generates photo captions strictly within 500 characters', () => {
    const styles: ('punchy' | 'storytelling' | 'question' | 'humorous')[] = [
      'punchy',
      'storytelling',
      'question',
      'humorous',
    ];
    styles.forEach((style) => {
      const res = generateThreadsCaptions({
        topic: 'Morning coffee & coding',
        style,
        count: 5,
      });
      expect(res.error).toBeUndefined();
      expect(res.captions.length).toBe(5);
      res.captions.forEach((c) => {
        expect(c.chars).toBeLessThanOrEqual(500);
        expect(c.isWithinLimit).toBe(true);
      });
    });
  });
});

describe('BATCH 7: Threads Hashtag Generator (One Topic Tag Rule)', () => {
  it('generates single topic tags preventing tag stuffing', () => {
    const res = generateThreadsHashtags({
      topic: 'React Development',
      count: 10,
    });
    expect(res.error).toBeUndefined();
    expect(res.tags.length).toBe(10);
    res.tags.forEach((t) => {
      expect(t.tag.startsWith('#')).toBe(true);
      expect(t.tag).not.toContain(' ');
      expect(t.label).toContain('Single Topic Tag');
    });
  });
});

describe('BATCH 7: Threads Hook Generator (≤ 500 chars)', () => {
  it('generates punchy hooks within 500 characters', () => {
    const styles: ('question' | 'bold' | 'story' | 'contrarian')[] = [
      'question',
      'bold',
      'story',
      'contrarian',
    ];
    styles.forEach((style) => {
      const res = generateThreadsHooks({
        topic: 'Remote work discipline',
        style,
        count: 5,
      });
      expect(res.error).toBeUndefined();
      expect(res.hooks.length).toBe(5);
      res.hooks.forEach((h) => {
        expect(h.chars).toBeLessThanOrEqual(500);
        expect(h.isWithinLimit).toBe(true);
      });
    });
  });
});

describe('BATCH 7: Threads Post Idea Generator', () => {
  it('generates structured post ideas with concept angle and why-it-works notes', () => {
    const res = generateThreadsPostIdeas({
      topic: 'Personal Finance for Freelancers',
      audience: 'independent contractors',
      postType: 'any',
      count: 5,
    });
    expect(res.error).toBeUndefined();
    expect(res.ideas.length).toBe(5);
    res.ideas.forEach((idea) => {
      expect(idea.title.length).toBeGreaterThan(5);
      expect(idea.conceptAngle.length).toBeGreaterThan(10);
      expect(idea.whyItWorks.length).toBeGreaterThan(10);
      expect(idea.postType.length).toBeGreaterThan(2);
    });
  });
});

describe('BATCH 7: Threads Reply Generator (Conversation Responses)', () => {
  it('generates contextual replies within 500 characters', () => {
    const res = generateThreadsReplies({
      originalPost: 'The best way to build momentum is shipping small features daily.',
      intent: 'agree',
      tone: 'thoughtful',
    });
    expect(res.error).toBeUndefined();
    expect(res.replies.length).toBeGreaterThanOrEqual(1);
    res.replies.forEach((r) => {
      expect(r.chars).toBeLessThanOrEqual(500);
      expect(r.isWithinLimit).toBe(true);
    });
  });
});

describe('BATCH 7: Threads Comment Generator (Standalone)', () => {
  it('generates standalone comments within 500 characters', () => {
    const res = generateThreadsComments({
      topic: 'Healthy work boundaries',
      style: 'supportive',
      count: 5,
    });
    expect(res.error).toBeUndefined();
    expect(res.comments.length).toBe(5);
    res.comments.forEach((c) => {
      expect(c.chars).toBeLessThanOrEqual(500);
      expect(c.isWithinLimit).toBe(true);
    });
  });
});

describe('BATCH 7: Threads Content Calendar Generator & CSV Export', () => {
  it('generates calendar entries matching cadence', () => {
    const res = generateThreadsCalendar({
      topic: 'Productivity Hacks',
      postsPerWeek: 3,
      startDate: '2026-11-30',
      contentMix: 'mixed',
    });
    expect(res.error).toBeUndefined();
    expect(res.entries.length).toBe(3);
    res.entries.forEach((e) => {
      expect(e.dateStr).toBeDefined();
      expect(e.dayOfWeek).toBeDefined();
      expect(e.title.length).toBeGreaterThan(3);
      expect(e.suggestedTag.startsWith('#')).toBe(true);
    });

    const csv = serializeThreadsCalendarCsv(res.entries);
    expect(csv).toContain('Day,Date,Day of Week,Post Type,Post Title & Concept,Single Topic Tag');
    expect(csv).toContain('Day 1');
  });
});

describe('BATCH 7: Threads Poll Generator (2–4 options, ≤ 25 chars per option)', () => {
  it('formats valid poll with 2–4 options and ≤ 25 chars per option', () => {
    const poll = formatThreadsPoll({
      question: 'What is your preferred programming language in 2026?',
      options: ['TypeScript', 'Rust', 'Python', 'Go'],
      duration: '24h',
    });
    expect(poll.isValid).toBe(true);
    expect(poll.errors.length).toBe(0);
    expect(poll.durationHours).toBe(24);
    expect(poll.formattedText).toContain('[ Option 1 ]: TypeScript');
  });

  it('rejects polls with fewer than 2 options or options > 25 chars', () => {
    const pollFew = formatThreadsPoll({
      question: 'Are you here?',
      options: ['Yes'],
      duration: '24h',
    });
    expect(pollFew.isValid).toBe(false);
    expect(pollFew.errors.some((e) => e.includes('at least 2 options'))).toBe(true);

    const pollLong = formatThreadsPoll({
      question: 'Are you here?',
      options: ['This option is definitely way longer than 25 characters cap', 'Short'],
      duration: '24h',
    });
    expect(pollLong.isValid).toBe(false);
    expect(pollLong.errors.some((e) => e.includes('25-character button cap'))).toBe(true);
  });
});

describe('BATCH 7: Threads Quote Generator (≤ 500 chars total)', () => {
  it('formats quote posts with user angle and snippet within 500 characters', () => {
    const res = generateThreadsQuotePosts({
      quotedPost: 'Consistency is not about never missing a day, it is about never giving up.',
      userComment: 'This perspective completely reframes burnout for creators.',
      tone: 'thoughtful',
    });
    expect(res.error).toBeUndefined();
    expect(res.quotePosts.length).toBeGreaterThanOrEqual(1);
    res.quotePosts.forEach((qp) => {
      expect(qp.chars).toBeLessThanOrEqual(500);
      expect(qp.isWithinLimit).toBe(true);
    });
  });
});

describe('BATCH 7: Threads Thread Generator (Splits > 500 chars into connected posts)', () => {
  it('returns single post if text is under 500 chars', () => {
    const chunks = splitThreadsPost('Short post that fits well within 500 characters.');
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toBe('Short post that fits well within 500 characters.');
  });

  it('splits long text (> 500 chars) into numbered posts (1/N) each ≤ 500 chars', () => {
    const longText = Array(12)
      .fill('This is a detailed paragraph discussing system architecture and clean scalable code.')
      .join('\n\n');
    expect(countUnicodeChars(longText)).toBeGreaterThan(500);

    const chunks = splitThreadsPost(longText);
    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach((chunk, i) => {
      expect(countUnicodeChars(chunk)).toBeLessThanOrEqual(500);
      expect(chunk).toContain(`(${i + 1}/${chunks.length})`);
    });
  });
});

describe('BATCH 7: Threads Engagement Rate Calculator', () => {
  it('calculates ER accurately: ((Likes + Replies + Reposts) / Followers) * 100', () => {
    const res = calculateThreadsEngagement({
      followers: 10000,
      likes: 250,
      replies: 50,
      reposts: 20,
    });
    expect(res.status).toBe('valid');
    expect(res.totalInteractions).toBe(320);
    expect(res.erPercent).toBe(3.2); // (320 / 10000) * 100 = 3.2%
    expect(res.tier).toContain('High Engagement');
  });

  it('handles zero followers safely without dividing by zero', () => {
    const res = calculateThreadsEngagement({
      followers: 0,
      likes: 10,
      replies: 5,
      reposts: 2,
    });
    expect(res.status).toBe('invalid');
    expect(res.error).toContain('Cannot divide by 0 followers');
  });

  it('rejects negative numbers', () => {
    const res = calculateThreadsEngagement({
      followers: 1000,
      likes: -5,
      replies: 2,
      reposts: 1,
    });
    expect(res.status).toBe('invalid');
    expect(res.error).toContain('Metrics cannot be negative');
  });
});

describe('BATCH 7: Threads Stylish Text & Font Generators', () => {
  it('generates stylish decorative brackets and embellishments', () => {
    const items = generateThreadsStylishText('New Thread');
    expect(items.length).toBeGreaterThanOrEqual(10);
    expect(items.some((i) => i.result.includes('『'))).toBe(true);
    expect(items.some((i) => i.result.includes('꧁'))).toBe(true);
    expect(items.some((i) => i.result.includes('★彡'))).toBe(true);
  });

  it('generates Unicode font alphabets (distinct from stylish text)', () => {
    const fonts = generateThreadsUnicodeFonts('Hello 123');
    expect(fonts.length).toBeGreaterThanOrEqual(7);
    const boldSans = fonts.find((f) => f.id === 'bold-sans');
    expect(boldSans).toBeDefined();
    expect(boldSans?.result).toBe('𝗛𝗲𝗹𝗹𝗼 𝟭𝟮𝟯');

    const doubleStruck = fonts.find((f) => f.id === 'double-struck');
    expect(doubleStruck).toBeDefined();
    expect(doubleStruck?.result).toBe('ℍ𝕖𝕝𝕝𝕠 𝟙𝟚𝟛');
  });
});
