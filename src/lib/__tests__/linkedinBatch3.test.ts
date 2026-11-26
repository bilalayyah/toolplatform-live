import {describe, it, expect} from 'vitest';
import {LINKEDIN_TOOLS} from '../../data/linkedinTools';
import {
  analyzeLinkedInHashtags,
  analyzeLinkedInTextLength,
  buildLinkedInContentCalendar,
  calculateLinkedInEngagement,
  countUnicodeChars,
  formatLinkedInProfileUrl,
  generateLinkedInCaptions,
  generateLinkedInColdDms,
  generateLinkedInComments,
  generateLinkedInConnectionMessages,
  generateLinkedInContentIdeas,
  generateLinkedInExperienceBullets,
  generateLinkedInJobApplicationMessages,
  generateLinkedInJobDescription,
  generateLinkedInRecommendations,
  generateLinkedInReplies,
  generateLinkedInSkills,
  generateLinkedInUsernames,
  isValidLinkedInSlug,
  serializeLinkedInCalendarCsv,
  serializeLinkedInCalendarMarkdown,
} from '../../components/tools/linkedinHelpers';

describe('Batch 3 — LinkedIn Registry & Slugs Audit', () => {
  it('contains all 24 LinkedIn tools with unique slugs and no stale Once live copy', () => {
    expect(LINKEDIN_TOOLS).toHaveLength(24);
    expect(new Set(LINKEDIN_TOOLS.map((t) => t.slug)).size).toBe(24);

    const serialized = JSON.stringify(LINKEDIN_TOOLS).toLowerCase();
    expect(serialized).not.toContain('once live,');
  });
});

describe('Batch 3 — LinkedIn Counters, URL Formatter & Calculators', () => {
  it('countUnicodeChars treats surrogate-pair emojis as 1 character each', () => {
    expect(countUnicodeChars('Hi 🚀✨')).toBe(5);
  });

  it('analyzeLinkedInTextLength enforces all LinkedIn character presets accurately', () => {
    const postOk = analyzeLinkedInTextLength('Hello 🚀', 'post');
    expect(postOk.chars).toBe(7);
    expect(postOk.limit).toBe(3000);
    expect(postOk.overLimit).toBe(false);

    const postOver = analyzeLinkedInTextLength('a'.repeat(3001), 'post');
    expect(postOver.overLimit).toBe(true);
    expect(postOver.remaining).toBe(-1);
    expect(postOver.isTruncatedAtFold).toBe(true);

    expect(analyzeLinkedInTextLength('a'.repeat(221), 'headline').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(2601), 'about').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(2001), 'experience').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(1251), 'comment').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(301), 'connection').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(141), 'poll_question').overLimit).toBe(true);
    expect(analyzeLinkedInTextLength('a'.repeat(31), 'poll_option').overLimit).toBe(true);
  });

  it('formatLinkedInProfileUrl strips tracking queries and rejects non-LinkedIn domains', () => {
    const clean = formatLinkedInProfileUrl(
      'https://www.linkedin.com/in/jane-doe-pm/?trk=public_profile&utm_source=share#about',
      'Jane Doe',
    );
    expect(clean.valid).toBe(true);
    expect(clean.canonicalUrl).toBe('https://www.linkedin.com/in/jane-doe-pm');
    expect(clean.shortUrl).toBe('linkedin.com/in/jane-doe-pm');
    expect(clean.strippedParams).toContain('trk');
    expect(clean.strippedParams).toContain('#fragment');

    const rawHandle = formatLinkedInProfileUrl('jane-doe-pm');
    expect(rawHandle.valid).toBe(true);
    expect(rawHandle.canonicalUrl).toBe('https://www.linkedin.com/in/jane-doe-pm');

    expect(formatLinkedInProfileUrl('').valid).toBe(false);
    expect(formatLinkedInProfileUrl('https://twitter.com/janedoe').valid).toBe(false);
    expect(formatLinkedInProfileUrl('https://www.linkedin.com/in/a').valid).toBe(false);
  });

  it('calculateLinkedInEngagement computes exact formulas and rejects zero or negative inputs', () => {
    const zeroFollowers = calculateLinkedInEngagement({mode: 'followers', denominator: 0, likes: 10, comments: 2, reposts: 1});
    expect(zeroFollowers.valid).toBe(false);
    expect(zeroFollowers.error).toContain('greater than 0');

    const negativeLikes = calculateLinkedInEngagement({mode: 'impressions', denominator: 1000, likes: -1, comments: 2, reposts: 0});
    expect(negativeLikes.valid).toBe(false);

    const imp = calculateLinkedInEngagement({
      mode: 'impressions',
      denominator: 10000,
      likes: 200,
      comments: 30,
      reposts: 20,
      clicks: 50,
    });
    expect(imp.valid).toBe(true);
    expect(imp.total).toBe(300);
    expect(imp.er).toBe(3);
    expect(imp.tier).toContain('High');
    expect(imp.formula).toContain('3%');
  });

  it('analyzeLinkedInHashtags counts duplicates and flags >5 over-tagging', () => {
    const res = analyzeLinkedInHashtags('#SaaS #saas #B2B #Growth #Hiring #Remote #Tech');
    expect(res.totalCount).toBe(7);
    expect(res.uniqueCount).toBe(6);
    expect(res.duplicates).toHaveLength(1);
    expect(res.status).toBe('over_5');
    expect(res.recommendedFooter.split(' ')).toHaveLength(5);
  });
});

describe('Batch 3 — LinkedIn Generators & Content Calendar', () => {
  it('generateLinkedInUsernames enforces valid /in/ handle rules', () => {
    const list = generateLinkedInUsernames({firstName: 'José', lastName: 'Álvarez', keyword: 'UX Design'});
    expect(list.length).toBeGreaterThan(3);
    expect(list.every((o) => o.valid && isValidLinkedInSlug(o.handle))).toBe(true);
    expect(generateLinkedInUsernames({firstName: '', lastName: ''})).toHaveLength(0);
  });

  it('generateLinkedInCaptions rotates deterministically and enforces 3,000 limit', () => {
    const a = generateLinkedInCaptions({topic: 'Testing', variation: 0});
    const b = generateLinkedInCaptions({topic: 'Testing', variation: 1});
    expect(a.length).toBe(3);
    expect(a[0].text).not.toBe(b[0].text);
    expect(a.every((c) => !c.overLimit && c.text.includes('Testing'))).toBe(true);
    expect(generateLinkedInCaptions({topic: '   '})).toHaveLength(0);
  });

  it('connection notes enforce 300-char and 200-char caps strictly', () => {
    const longContext = 'enterprise cloud migration infrastructure & reliability engineering leadership '.repeat(2);
    const notes300 = generateLinkedInConnectionMessages({
      recipientName: 'Sam',
      sharedContext: longContext,
      category: 'peer',
      maxLimit: 300,
    });
    expect(notes300.length).toBe(3);

    const notes200 = generateLinkedInConnectionMessages({
      recipientName: 'Sam',
      sharedContext: longContext,
      category: 'peer',
      maxLimit: 200,
    });
    expect(notes200.every((n) => n.chars <= 200 && n.withinLimit)).toBe(true);
  });

  it('remaining generators produce structured outputs with valid bounds', () => {
    expect(generateLinkedInContentIdeas({role: 'PM', topic: 'Onboarding'}).length).toBe(6);
    expect(generateLinkedInComments({topic: 'Hiring', point: 'clear rubrics'}).every((c) => c.withinLimit)).toBe(true);
    expect(generateLinkedInReplies({commenterName: 'Lee', topic: 'Docs'}).every((r) => r.withinLimit)).toBe(true);
    expect(generateLinkedInColdDms({companyOrWork: 'Series B launch', yourValue: 'QA automation'}).length).toBe(3);
    expect(
      generateLinkedInJobDescription({
        roleTitle: 'QA Engineer',
        teamSummary: 'Own browser tests',
        responsibilities: 'Write Playwright specs',
        qualifications: 'TypeScript',
      }).text,
    ).toContain('QA Engineer');
    expect(
      generateLinkedInJobApplicationMessages({
        roleTitle: 'PM',
        company: 'Acme',
        proofMetric: 'launched v2',
        mode: 'connection_note',
      }).every((m) => m.chars <= 300),
    ).toBe(true);
    expect(
      generateLinkedInExperienceBullets({
        roleTitle: 'Engineer',
        actionOwned: 'optimized queries',
        metricOutcome: 'cut p95 by 40%',
      }).withinLimit,
    ).toBe(true);
    const skills = generateLinkedInSkills({track: 'engineering', customTools: 'Rust, TypeScript'});
    expect(skills.totalCount).toBeLessThanOrEqual(50);
    expect(skills.priorityTop5).toHaveLength(5);
    expect(
      generateLinkedInRecommendations({
        personName: 'Nina',
        relationship: 'peer',
        strengths: 'clarity',
        projectOutcome: 'billing launch',
      }).every((r) => r.chars <= 3000),
    ).toBe(true);
  });

  it('buildLinkedInContentCalendar generates dated slots and escapes CSV safely', () => {
    const cal = buildLinkedInContentCalendar({
      pillars: ['Product, Strategy', 'Team "Culture"'],
      postsPerWeek: 3,
      weeks: 2,
      startDate: '2026-04-06',
    });
    expect(cal.valid).toBe(true);
    expect(cal.slots).toHaveLength(6);
    const csv = serializeLinkedInCalendarCsv(cal.slots);
    expect(csv).toContain('"Product, Strategy"');
    expect(csv).toContain('"Team ""Culture"""');
    expect(serializeLinkedInCalendarMarkdown(cal.slots)).toContain('| W1 |');
    expect(buildLinkedInContentCalendar({pillars: [], postsPerWeek: 3, weeks: 2, startDate: '2026-04-06'}).valid).toBe(false);
  });
});
