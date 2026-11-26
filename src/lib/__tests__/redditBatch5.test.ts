import {describe, it, expect} from 'vitest';
import {REDDIT_TOOLS} from '../../data/redditTools';
import {
  countUnicodeChars,
  generateSubredditNames,
  generateSubredditDescriptions,
  generateRedditFlairs,
  calculateRedditEngagement,
  generateRedditPostIdeas,
  generateRedditQuestions,
  formatRedditPoll,
  generateRandomRedditPostIdeas,
  checkRedditUsernameFormat,
  convertTextToRedditMarkdown,
  convertRedditMarkdownToHtml,
  generateRedditCalendar,
  serializeRedditCalendarCsv,
  applyRedditMarkdownFormat,
  formatRedditText,
  calculateRedditKarma,
  pickRedditCommentWinners,
  REDDIT_LIMITS,
} from '../../components/tools/redditHelpers';

describe('Batch 5 — Reddit Registry & Slugs Audit', () => {
  it('contains all 18 Reddit tools with unique slugs and active status', () => {
    expect(REDDIT_TOOLS).toHaveLength(18);
    const slugs = REDDIT_TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(18);

    const expectedSlugs = [
      'reddit-subreddit-name-generator',
      'reddit-subreddit-description-generator',
      'reddit-flair-generator',
      'reddit-engagement-rate-calculator',
      'reddit-post-idea-generator',
      'reddit-question-generator',
      'reddit-poll-generator',
      'reddit-random-post-idea-generator',
      'reddit-username-checker',
      'reddit-text-to-markdown-converter',
      'reddit-markdown-to-html-converter',
      'reddit-content-calendar-generator',
      'reddit-markdown-formatter',
      'reddit-text-formatter',
      'reddit-post-character-counter',
      'reddit-title-character-counter',
      'reddit-karma-calculator',
      'reddit-comment-picker',
    ];

    for (const expected of expectedSlugs) {
      expect(slugs).toContain(expected);
    }
  });

  it('contains zero stale "Once live" or pricing promises in metadata', () => {
    const serialized = JSON.stringify(REDDIT_TOOLS).toLowerCase();
    expect(serialized).not.toContain('once live,');
    expect(serialized).not.toContain('$11.99');
    expect(serialized).not.toContain('lifetime access');
  });
});

describe('Batch 5 — 1. Reddit Subreddit Name Generator', () => {
  it('generates compliant 3–21 character names using letters, numbers, and underscores only', () => {
    const res = generateSubredditNames({
      keywords: 'mechanical keyboards',
      style: 'descriptive',
      count: 10,
    });

    expect(res.error).toBeUndefined();
    expect(res.items.length).toBe(10);
    for (const item of res.items) {
      expect(item.chars).toBeGreaterThanOrEqual(3);
      expect(item.chars).toBeLessThanOrEqual(21);
      expect(item.rawName).toMatch(/^[a-zA-Z0-9_]{3,21}$/);
      expect(item.formattedName).toBe(`r/${item.rawName}`);
      expect(item.isValid).toBe(true);
    }
  });

  it('handles creative and short styles and rejects empty keywords', () => {
    expect(generateSubredditNames({ keywords: '   ', style: 'short', count: 5 }).error).toBeDefined();

    const shortRes = generateSubredditNames({
      keywords: 'gaming',
      style: 'short',
      count: 5,
    });
    expect(shortRes.items.length).toBe(5);
    for (const item of shortRes.items) {
      expect(item.chars).toBeLessThanOrEqual(21);
    }
  });
});

describe('Batch 5 — 2. Reddit Subreddit Description Generator', () => {
  it('produces tailored descriptions strictly under Reddit’s 500-character cap', () => {
    const res = generateSubredditDescriptions({
      topic: 'r/espresso',
      communityFocus: 'home espresso machines, grinder dial-ins, and latte art',
      tone: 'welcoming',
      rules: 'no self-promotion, be respectful',
      count: 4,
    });

    expect(res.error).toBeUndefined();
    expect(res.items.length).toBe(4);
    for (const item of res.items) {
      expect(item.chars).toBeLessThanOrEqual(500);
      expect(item.isWithinLimit).toBe(true);
      expect(item.description).toContain('r/espresso');
    }
  });

  it('rejects empty topic or focus inputs', () => {
    expect(generateSubredditDescriptions({ topic: '', communityFocus: 'focus', tone: 'casual' }).error).toBeDefined();
    expect(generateSubredditDescriptions({ topic: 'r/test', communityFocus: '', tone: 'casual' }).error).toBeDefined();
  });
});

describe('Batch 5 — 3. Reddit Flair Generator', () => {
  it('generates flair tags strictly under Reddit’s 64-character limit', () => {
    const res = generateRedditFlairs({
      topic: 'r/cooking',
      style: 'question',
      count: 5,
    });

    expect(res.error).toBeUndefined();
    expect(res.items.length).toBe(5);
    for (const item of res.items) {
      expect(item.chars).toBeLessThanOrEqual(64);
      expect(item.isWithinLimit).toBe(true);
    }
  });
});

describe('Batch 5 — 4. Reddit Engagement Rate Calculator', () => {
  it('calculates Engagement Rate by Subscribers correctly', () => {
    // (200 + 50) / 10000 * 100 = 2.5%
    const res = calculateRedditEngagement({
      upvotes: 200,
      comments: 50,
      metricType: 'subscribers',
      metricValue: 10000,
    });

    expect(res.status).toBe('valid');
    expect(res.ratePercent).toBe(2.5);
    expect(res.totalInteractions).toBe(250);
    expect(res.discussionRatioPercent).toBe(20); // 50 / 250 * 100
    expect(res.formulaUsed).toContain('subscribers');
  });

  it('calculates Engagement Rate by Views correctly', () => {
    // (150 + 50) / 2000 * 100 = 10%
    const res = calculateRedditEngagement({
      upvotes: 150,
      comments: 50,
      metricType: 'views',
      metricValue: 2000,
    });

    expect(res.status).toBe('valid');
    expect(res.ratePercent).toBe(10);
    expect(res.formulaUsed).toContain('views');
  });

  it('handles zero denominator without Infinity and rejects negative inputs', () => {
    const zeroRes = calculateRedditEngagement({
      upvotes: 100,
      comments: 20,
      metricType: 'views',
      metricValue: 0,
    });
    expect(zeroRes.status).toBe('invalid');
    expect(zeroRes.ratePercent).toBe(0);
    expect(zeroRes.errorMessage).toContain('greater than 0');

    const negRes = calculateRedditEngagement({
      upvotes: -10,
      comments: 5,
      metricType: 'views',
      metricValue: 100,
    });
    expect(negRes.status).toBe('invalid');
    expect(negRes.errorMessage).toContain('negative');
  });
});

describe('Batch 5 — 5. Reddit Post Idea Generator', () => {
  it('generates full publishable post concepts with title <= 300 chars and angle', () => {
    const res = generateRedditPostIdeas({
      subredditOrTopic: 'r/webdev',
      audience: 'frontend developers',
      postType: 'discussion',
      count: 5,
    });

    expect(res.error).toBeUndefined();
    expect(res.items.length).toBe(5);
    for (const item of res.items) {
      expect(item.charCount).toBeLessThanOrEqual(300);
      expect(item.title).toContain('webdev');
      expect(item.angle.length).toBeGreaterThan(15);
    }
  });
});

describe('Batch 5 — 6. Reddit Question Generator', () => {
  it('generates genuine AskReddit-style questions fitting within the 300-char title limit', () => {
    const res = generateRedditQuestions({
      topic: 'home baking',
      style: 'opinion',
      count: 5,
    });

    expect(res.error).toBeUndefined();
    expect(res.items.length).toBe(5);
    for (const q of res.items) {
      expect(q.chars).toBeLessThanOrEqual(300);
      expect(q.withinLimit).toBe(true);
      expect(q.question.endsWith('?')).toBe(true);
    }
  });
});

describe('Batch 5 — 7. Reddit Poll Generator', () => {
  it('validates 2–6 options, 120-char limit per option, and prepares formatted text', () => {
    const poll = formatRedditPoll({
      question: 'Which switch type do you prefer?',
      options: ['Linear (Red)', 'Tactile (Brown)', 'Clicky (Blue)'],
      duration: '3 days',
      includeResultsOption: true,
    });

    expect(poll.isValid).toBe(true);
    expect(poll.options.length).toBe(4); // 3 + View Results
    expect(poll.formattedText).toContain('Poll Question:');
    expect(poll.formattedText).toContain('Linear (Red)');
  });

  it('rejects fewer than 2 options or over-length question', () => {
    const badPoll = formatRedditPoll({
      question: '',
      options: ['Only one option'],
      duration: '1 day',
    });
    expect(badPoll.isValid).toBe(false);
    expect(badPoll.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Batch 5 — 8. Reddit Random Post Idea Generator', () => {
  it('generates wildcard prompts across diverse subreddits without requiring a topic', () => {
    const res = generateRandomRedditPostIdeas({ count: 5 });
    expect(res.items.length).toBe(5);
    for (const item of res.items) {
      expect(item.suggestedSubreddit.startsWith('r/')).toBe(true);
      expect(item.title.length).toBeGreaterThan(20);
      expect(item.angle.length).toBeGreaterThan(10);
    }
  });
});

describe('Batch 5 — 9. Reddit Username Checker', () => {
  it('validates 3–20 character limits, allowed characters, and edge rules accurately', () => {
    const valid = checkRedditUsernameFormat('tech_writer-99');
    expect(valid.isValid).toBe(true);
    expect(valid.rules.every((r) => r.passed)).toBe(true);

    const tooShort = checkRedditUsernameFormat('ab');
    expect(tooShort.isValid).toBe(false);
    expect(tooShort.rules.find((r) => r.id === 'length')?.passed).toBe(false);

    const tooLong = checkRedditUsernameFormat('a'.repeat(21));
    expect(tooLong.isValid).toBe(false);
    expect(tooLong.rules.find((r) => r.id === 'length')?.passed).toBe(false);

    const withSpaces = checkRedditUsernameFormat('tech writer');
    expect(withSpaces.isValid).toBe(false);
    expect(withSpaces.rules.find((r) => r.id === 'no-spaces')?.passed).toBe(false);

    const invalidEdges = checkRedditUsernameFormat('-techwriter');
    expect(invalidEdges.isValid).toBe(false);
    expect(invalidEdges.rules.find((r) => r.id === 'edge-chars')?.passed).toBe(false);
  });
});

describe('Batch 5 — 10. Reddit Text to Markdown Converter', () => {
  it('converts single newlines to double newlines and tabbed data to pipe tables', () => {
    const input = 'Header 1\tHeader 2\nVal 1\tVal 2\n\nNotes line one\nNotes line two';
    const md = convertTextToRedditMarkdown(input, {
      autoLineBreaks: true,
      convertEmphasis: true,
      convertLists: true,
      convertTables: true,
    });

    expect(md).toContain('| Header 1 | Header 2 |');
    expect(md).toContain('| --- | --- |');
    expect(md).toContain('Notes line one');
    expect(md).toContain('Notes line two');
  });
});

describe('Batch 5 — 11. Reddit Markdown to HTML Converter', () => {
  it('converts headings, bold, italic, code, quotes, and spoilers to semantic HTML', () => {
    const md = '# Title\n\n**Bold text** and *italic*\n\n> Quote line\n\n>!Secret spoiler!<';
    const res = convertRedditMarkdownToHtml(md);

    expect(res.error).toBeUndefined();
    expect(res.html).toContain('<h1');
    expect(res.html).toContain('<strong>Bold text</strong>');
    expect(res.html).toContain('<em>italic</em>');
    expect(res.html).toContain('<blockquote');
    expect(res.html).toContain('reddit-spoiler');
  });
});

describe('Batch 5 — 12. Reddit Content Calendar Generator', () => {
  it('generates a 7-day schedule with dates and serializes to CSV', () => {
    const res = generateRedditCalendar({
      topic: 'r/personalfinance',
      postsPerWeek: 3,
      startDate: '2026-12-01',
      contentMix: 'mixed',
    });

    expect(res.error).toBeUndefined();
    expect(res.days.length).toBe(7);
    expect(res.days[0].dateString).toBe('2026-12-01');

    const csv = serializeRedditCalendarCsv(res.days);
    expect(csv).toContain('Day,Date,Weekday,Target Subreddit');
    expect(csv).toContain('2026-12-01');
  });
});

describe('Batch 5 — 13 & 14. Reddit Formatters', () => {
  it('applyRedditMarkdownFormat formats markdown elements cleanly', () => {
    expect(applyRedditMarkdownFormat('hello', 'bold')).toBe('**hello**');
    expect(applyRedditMarkdownFormat('code', 'code')).toBe('`code`');
    expect(applyRedditMarkdownFormat('quote', 'quote')).toBe('> quote');
  });

  it('formatRedditText applies whitespace normalization and casing', () => {
    const messy = 'line one\n\n\nline two';
    expect(formatRedditText(messy, 'normalizeSpacing')).toBe('line one\n\nline two');
    expect(formatRedditText('hello world', 'titleCase')).toBe('Hello World');
    expect(formatRedditText('item', 'bulletList')).toBe('- item');
  });
});

describe('Batch 5 — 15 & 16. Reddit Character Counters & Emojis', () => {
  it('counts surrogate pair emojis as 1 character and checks limits', () => {
    const emojiText = '🚀🔥✨';
    expect(countUnicodeChars(emojiText)).toBe(3);

    expect(REDDIT_LIMITS.postTitle).toBe(300);
    expect(REDDIT_LIMITS.postBody).toBe(40000);
    expect(REDDIT_LIMITS.comment).toBe(10000);
  });
});

describe('Batch 5 — 17. Reddit Karma Calculator', () => {
  it('calculates diminishing karma returns mathematically', () => {
    const early = calculateRedditKarma({ postUpvotes: 50, commentUpvotes: 100 });
    expect(early.postKarma).toBe(50);
    expect(early.commentKarma).toBe(100);
    expect(early.estimatedKarma).toBe(150);

    const viral = calculateRedditKarma({ postUpvotes: 10000, commentUpvotes: 5000 });
    // Post upvotes > 100 receive diminishing returns
    expect(viral.postKarma).toBeLessThan(10000);
    expect(viral.commentKarma).toBeLessThan(5000);
    expect(viral.estimatedKarma).toBeGreaterThan(1000);
  });
});

describe('Batch 5 — 18. Reddit Comment Picker', () => {
  it('draws random winners from pasted text with deduplication and keyword filter', () => {
    const raw = 'u/alice\nu/bob\nu/alice\nu/charlie win\nu/david win';

    const res = pickRedditCommentWinners({
      rawText: raw,
      winnerCount: 1,
      backupCount: 1,
      removeDuplicates: true,
      filterKeyword: 'win',
    });

    expect(res.error).toBeUndefined();
    expect(res.winners.length).toBe(1);
    expect(res.backups.length).toBe(1);
    expect(res.totalEligible).toBe(2); // only charlie & david match 'win'
  });

  it('returns clear error when empty or no comments match keyword', () => {
    expect(pickRedditCommentWinners({ rawText: '  ', winnerCount: 1, backupCount: 0, removeDuplicates: false }).error).toBeDefined();
    expect(pickRedditCommentWinners({ rawText: 'alice\nbob', winnerCount: 1, backupCount: 0, removeDuplicates: false, filterKeyword: 'xyz' }).error).toBeDefined();
  });
});
