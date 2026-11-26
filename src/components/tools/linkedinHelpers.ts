// Pure deterministic browser helpers for LinkedIn tools (ZERO AI, ZERO network/API calls)

export function countUnicodeChars(text: string): number {
  return Array.from(text).length;
}

export function sliceUnicodeChars(text: string, maxChars: number): string {
  if (maxChars <= 0) return '';
  return Array.from(text).slice(0, maxChars).join('');
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function cleanInput(v: string | undefined, fallback = ''): string {
  return (v ?? '').trim() || fallback;
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length <= 1) return items;
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

// ---------------------------------------------------------------------------
// 1. LinkedIn Caption Generator (3,000 char limit, ~210 char "See more" fold)
// ---------------------------------------------------------------------------
export type LinkedInCaptionTone = 'story' | 'framework' | 'contrarian' | 'milestone';

export interface LinkedInCaptionVariation {
  id: string;
  label: string;
  text: string;
  chars: number;
  hookChars: number;
  overLimit: boolean;
  hookOverFold: boolean;
}

export function generateLinkedInCaptions(params: {
  topic: string;
  takeaway?: string;
  example?: string;
  cta?: string;
  tone?: LinkedInCaptionTone;
  variation?: number;
}): LinkedInCaptionVariation[] {
  const topic = params.topic.trim();
  if (!topic) return [];

  const takeaway = cleanInput(
    params.takeaway,
    `Consistent execution on ${topic} beats over-engineering every time.`,
  );
  const example = cleanInput(
    params.example,
    `We simplified our weekly review around ${topic} and cut wasted back-and-forth in half.`,
  );
  const cta = cleanInput(params.cta, `What is your go-to approach for ${topic}?`);
  const tone = params.tone ?? 'framework';
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInCaptionTone, Array<{label: string; text: string}>> = {
    framework: [
      {
        label: '3-Step Framework',
        text: `Most teams overcomplicate ${topic}.\nHere is the simple structure that actually moves the needle:\n\n1. Define the bottleneck clearly before picking tools\n2. ${takeaway}\n3. Review real proof weekly: ${example}\n\n${cta}`,
      },
      {
        label: 'Checklist Breakdown',
        text: `A practical checklist I keep coming back to for ${topic}:\n\n• Core principle: ${takeaway}\n• Real-world test: ${example}\n• Rule of thumb: keep every step measurable and repeatable\n\nSave this for your next sprint — ${cta}`,
      },
      {
        label: 'Before vs After',
        text: `How our approach to ${topic} changed this quarter:\n\nBefore: scattered guesses and slow feedback loops.\nAfter: ${takeaway}\n\nConcrete example:\n${example}\n\n${cta}`,
      },
    ],
    story: [
      {
        label: 'Lesson Learned',
        text: `The biggest lesson I learned recently about ${topic}:\n\n${takeaway}\n\nIn practice, it looked like this:\n${example}\n\nSmall habits compound faster than big rewrites.\n\n${cta}`,
      },
      {
        label: 'Behind the Scenes',
        text: `A quick behind-the-scenes note on ${topic}.\n\nEarlier on, we assumed more complexity meant better output. Turns out the opposite held true:\n\n→ ${takeaway}\n→ ${example}\n\n${cta}`,
      },
      {
        label: 'Field Note',
        text: `Something I wish I had known sooner about ${topic}:\n\n${example}\n\nWhy it mattered:\n${takeaway}\n\n${cta}`,
      },
    ],
    contrarian: [
      {
        label: 'Myth vs Reality',
        text: `Unpopular opinion on ${topic}:\n\nYou do not need a 20-page strategy doc to see results.\n\nWhat actually works:\n— ${takeaway}\n— ${example}\n\nAgree or disagree? ${cta}`,
      },
      {
        label: 'Stop Doing This',
        text: `If ${topic} feels harder than it should, look at what you can remove.\n\nInstead of adding extra steps, focus on one shift:\n${takeaway}\n\nProof from our own work:\n${example}\n\n${cta}`,
      },
      {
        label: 'Quiet Truth',
        text: `Everyone talks about best practices for ${topic}.\nFew talk about execution discipline.\n\n${takeaway}\n\nCase in point: ${example}\n\n${cta}`,
      },
    ],
    milestone: [
      {
        label: 'Project Update',
        text: `Sharing a quick milestone on ${topic}.\n\nWhat helped most along the way:\n• ${takeaway}\n• ${example}\n\nGrateful for everyone who shared candid feedback.\n\n${cta}`,
      },
      {
        label: 'Retrospective Note',
        text: `Wrapping up a focused push on ${topic} — 2 takeaways worth sharing:\n\n1. ${takeaway}\n2. ${example}\n\nOnto the next iteration.\n\n${cta}`,
      },
      {
        label: 'Team Win',
        text: `Milestone reflection on ${topic}:\n\nResults rarely show up overnight, yet steady iteration pays off:\n${example}\n\nCore takeaway: ${takeaway}\n\n${cta}`,
      },
    ],
  };

  return rotateArray(bank[tone], variation).map((item, idx) => {
    const chars = countUnicodeChars(item.text);
    const firstLines = item.text.split('\n').slice(0, 2).join('\n');
    const hookChars = countUnicodeChars(firstLines);
    return {
      id: `${tone}-${idx}-${variation}`,
      label: item.label,
      text: item.text,
      chars,
      hookChars,
      overLimit: chars > 3000,
      hookOverFold: hookChars > 210,
    };
  });
}

// ---------------------------------------------------------------------------
// 2. LinkedIn Username Generator (/in/ handle rules: 3–100 chars [a-z0-9-])
// ---------------------------------------------------------------------------
export interface LinkedInUsernameOption {
  id: string;
  handle: string;
  url: string;
  style: string;
  chars: number;
  valid: boolean;
}

function toLinkedInSlugToken(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function isValidLinkedInSlug(slug: string): boolean {
  return /^[a-zA-Z0-9-]{3,100}$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-') && !slug.includes('--');
}

export function generateLinkedInUsernames(params: {
  firstName: string;
  lastName: string;
  keyword?: string;
  credential?: string;
  variation?: number;
}): LinkedInUsernameOption[] {
  const first = toLinkedInSlugToken(params.firstName);
  const last = toLinkedInSlugToken(params.lastName);
  if (!first && !last) return [];

  const kw = toLinkedInSlugToken(params.keyword ?? '');
  const cred = toLinkedInSlugToken(params.credential ?? '');
  const firstInit = first ? first[0] : '';
  const lastInit = last ? last[0] : '';
  const variation = params.variation ?? 0;

  const baseCandidates: Array<{style: string; raw: string}> = [];

  if (first && last) {
    baseCandidates.push(
      {style: 'Standard Hyphenated', raw: `${first}-${last}`},
      {style: 'Compact Full Name', raw: `${first}${last}`},
      {style: 'Initial + Last Name', raw: `${firstInit}-${last}`},
      {style: 'First + Last Initial', raw: `${first}-${lastInit}`},
    );
  } else {
    const single = first || last;
    baseCandidates.push({style: 'Primary Name', raw: single});
  }

  if (kw) {
    baseCandidates.push(
      {style: 'Name + Specialty', raw: [first, last, kw].filter(Boolean).join('-')},
      {style: 'Compact + Specialty', raw: `${first}${last}-${kw}`},
    );
  }
  if (cred) {
    baseCandidates.push({
      style: 'Name + Credential',
      raw: [first, last, cred].filter(Boolean).join('-'),
    });
  }
  if (kw && cred) {
    baseCandidates.push({
      style: 'Full Pro Handle',
      raw: [first, last, kw, cred].filter(Boolean).join('-'),
    });
  }

  const extraSuffixes = ['pro', 'work', 'hq', 'official', 'dev', 'co'];
  if (variation > 0) {
    const s1 = extraSuffixes[(variation - 1) % extraSuffixes.length];
    const s2 = extraSuffixes[variation % extraSuffixes.length];
    if (first && last) {
      baseCandidates.unshift(
        {style: `Alternate (${s1})`, raw: `${first}-${last}-${s1}`},
        {style: `Alternate (${s2})`, raw: `${first}${last}-${s2}`},
      );
    }
  } else {
    baseCandidates.push({
      style: 'Professional Suffix',
      raw: [first, last, 'pro'].filter(Boolean).join('-'),
    });
  }

  const seen = new Set<string>();
  const results: LinkedInUsernameOption[] = [];

  for (const cand of baseCandidates) {
    const clean = toLinkedInSlugToken(cand.raw).slice(0, 100).replace(/-+$/g, '');
    if (clean.length < 3 || seen.has(clean)) continue;
    seen.add(clean);
    results.push({
      id: `li-user-${clean}`,
      handle: clean,
      url: `https://www.linkedin.com/in/${clean}`,
      style: cand.style,
      chars: clean.length,
      valid: isValidLinkedInSlug(clean),
    });
  }

  return rotateArray(results, variation > 0 ? 1 : 0);
}

// ---------------------------------------------------------------------------
// 3. LinkedIn Profile URL Formatter
// ---------------------------------------------------------------------------
export interface LinkedInUrlFormatResult {
  valid: boolean;
  error?: string;
  kind?: 'profile' | 'company';
  slug?: string;
  canonicalUrl?: string;
  shortUrl?: string;
  markdownLink?: string;
  htmlLink?: string;
  strippedParams: string[];
}

export function formatLinkedInProfileUrl(rawInput: string, displayName?: string): LinkedInUrlFormatResult {
  const input = rawInput.trim();
  if (!input) {
    return {valid: false, error: 'Please paste a LinkedIn profile URL or custom /in/ handle.', strippedParams: []};
  }

  // Handle raw handle or /in/handle without scheme
  let candidate = input.replace(/\s+/g, '');
  if (!/^https?:\/\//i.test(candidate)) {
    if (/^(www\.|m\.|[a-z]{2}\.)?linkedin\.com\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    } else if (/^\/?(in|company)\//i.test(candidate)) {
      candidate = `https://www.linkedin.com/${candidate.replace(/^\/+/, '')}`;
    } else if (/^[a-zA-Z0-9-]{3,100}$/.test(candidate)) {
      candidate = `https://www.linkedin.com/in/${candidate}`;
    } else {
      return {
        valid: false,
        error: 'Enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/your-name) or a 3–100 char handle (letters, numbers, hyphens).',
        strippedParams: [],
      };
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      valid: false,
      error: 'Could not parse that URL. Check for spaces or unsupported characters.',
      strippedParams: [],
    };
  }

  if (!/(^|\.)linkedin\.com$/i.test(parsed.hostname)) {
    return {
      valid: false,
      error: `Expected a linkedin.com domain, but received "${parsed.hostname}".`,
      strippedParams: [],
    };
  }

  const strippedParams: string[] = [];
  parsed.searchParams.forEach((_, key) => strippedParams.push(key));
  if (parsed.hash) strippedParams.push('#fragment');

  const parts = parsed.pathname.split('/').filter(Boolean);
  if (parts.length < 2 || (parts[0].toLowerCase() !== 'in' && parts[0].toLowerCase() !== 'company')) {
    return {
      valid: false,
      error: 'URL path must include /in/<handle> (or /company/<slug>).',
      strippedParams,
    };
  }

  const kind: 'profile' | 'company' = parts[0].toLowerCase() === 'company' ? 'company' : 'profile';
  const slug = decodeURIComponent(parts[1]).trim();
  if (!/^[a-zA-Z0-9-]{3,100}$/.test(slug)) {
    return {
      valid: false,
      error: `The slug "${slug}" contains invalid characters or is outside LinkedIn's 3–100 character limit (letters, numbers, hyphens only).`,
      strippedParams,
    };
  }

  const canonicalUrl = `https://www.linkedin.com/${kind === 'company' ? 'company' : 'in'}/${slug}`;
  const shortUrl = `linkedin.com/${kind === 'company' ? 'company' : 'in'}/${slug}`;
  const label = cleanInput(displayName, 'LinkedIn Profile');
  return {
    valid: true,
    kind,
    slug,
    canonicalUrl,
    shortUrl,
    markdownLink: `[${label}](${canonicalUrl})`,
    htmlLink: `<a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    strippedParams,
  };
}

// ---------------------------------------------------------------------------
// 4. LinkedIn Content Idea Generator
// ---------------------------------------------------------------------------
export type LinkedInIdeaFocus = 'career' | 'founder' | 'b2b';

export interface LinkedInContentIdea {
  id: string;
  angle: string;
  recommendedFormat: string;
  hook: string;
  outline: string[];
}

export function generateLinkedInContentIdeas(params: {
  role: string;
  topic: string;
  audience?: string;
  focus?: LinkedInIdeaFocus;
  variation?: number;
}): LinkedInContentIdea[] {
  const role = params.role.trim();
  const topic = params.topic.trim();
  if (!role || !topic) return [];

  const audience = cleanInput(params.audience, 'peers and hiring managers');
  const focus = params.focus ?? 'b2b';
  const variation = params.variation ?? 0;

  const focusContext: Record<LinkedInIdeaFocus, {outcome: string; angleTag: string}> = {
    career: {outcome: 'career growth & interviews', angleTag: 'Career Playbook'},
    founder: {outcome: 'customer trust & shipping speed', angleTag: 'Build in Public'},
    b2b: {outcome: 'pipeline efficiency & team execution', angleTag: 'B2B Field Notes'},
  };
  const ctx = focusContext[focus];

  const ideas: LinkedInContentIdea[] = [
    {
      id: 'idea-lesson',
      angle: `${ctx.angleTag}: Hard-Earned Lesson`,
      recommendedFormat: 'Text Post (800–1,400 chars)',
      hook: `What working as a ${role} taught me about ${topic} that nobody mentions early on:`,
      outline: [
        `Describe the common mistake ${audience} make when tackling ${topic}`,
        `Explain the turning point that improved ${ctx.outcome}`,
        'Close with 1 question inviting readers to share their experience',
      ],
    },
    {
      id: 'idea-carousel',
      angle: 'Step-by-Step Carousel Deck',
      recommendedFormat: 'Carousel PDF (6–8 slides, 1080×1350)',
      hook: `My 5-step ${topic} checklist for ${audience} (save for later):`,
      outline: [
        'Slide 1: Clear promise + target audience',
        `Slides 2–6: One actionable ${topic} step per slide with a concrete metric`,
        'Final Slide: Summary takeaway + comment prompt',
      ],
    },
    {
      id: 'idea-myth',
      angle: 'Myth vs Reality Breakdown',
      recommendedFormat: '1200×627 Visual + Caption',
      hook: `Stop believing this common myth about ${topic}:`,
      outline: [
        `State the overhyped advice around ${topic}`,
        `Contrast it with what works day-to-day as a ${role}`,
        `Share 2 practical fixes ${audience} can try this week`,
      ],
    },
    {
      id: 'idea-case',
      angle: 'Mini Case Study',
      recommendedFormat: 'Before / After Text Story',
      hook: `How we fixed a messy ${topic} workflow without adding headcount:`,
      outline: [
        'Baseline problem & why the old process slowed down',
        'The specific change implemented in week 1',
        `Measurable result & lesson for ${audience}`,
      ],
    },
    {
      id: 'idea-tools',
      angle: 'Curated Workflow / Stack',
      recommendedFormat: 'Bullet List Post',
      hook: `The exact ${topic} routine I use every Monday as a ${role}:`,
      outline: [
        '15-minute audit question to start the week',
        'Core metric tracked (and why vanity metrics are ignored)',
        'End-of-week reflection prompt',
      ],
    },
    {
      id: 'idea-poll',
      angle: 'Community Poll / Debate',
      recommendedFormat: 'LinkedIn Poll (140q / 30o)',
      hook: `Quick pulse check for ${audience}: What is your biggest blocker with ${topic} right now?`,
      outline: [
        'Option A: Lack of time / focus (≤30 chars)',
        'Option B: Unclear metrics / ROI (≤30 chars)',
        'Option C: Tooling / team buy-in (≤30 chars)',
      ],
    },
  ];

  return rotateArray(ideas, variation);
}

// ---------------------------------------------------------------------------
// 5. LinkedIn Comment Generator (1,250 char limit)
// ---------------------------------------------------------------------------
export type LinkedInCommentAngle = 'addition' | 'praise' | 'question' | 'example';

export interface LinkedInShortMessage {
  id: string;
  label: string;
  text: string;
  chars: number;
  limit: number;
  withinLimit: boolean;
}

export function generateLinkedInComments(params: {
  topic: string;
  point: string;
  angle?: LinkedInCommentAngle;
  variation?: number;
}): LinkedInShortMessage[] {
  const topic = params.topic.trim();
  const point = params.point.trim();
  if (!topic || !point) return [];

  const angle = params.angle ?? 'addition';
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInCommentAngle, Array<{label: string; text: string}>> = {
    addition: [
      {
        label: 'Constructive Build-On',
        text: `Spot on regarding ${topic}. One detail I have seen amplify this even further: ${point}. Adding that step makes the whole workflow far easier to sustain.`,
      },
      {
        label: 'Nuance & Context',
        text: `Great breakdown on ${topic}. In our experience, pairing that approach with ${point} prevents the usual drop-off after week two.`,
      },
      {
        label: 'Practical Add-On',
        text: `Really appreciate this perspective on ${topic}. Another lever worth highlighting here is ${point} — small change, outsized payoff.`,
      },
    ],
    praise: [
      {
        label: 'Specific Appreciation',
        text: `This framing on ${topic} deserves more attention. Especially your takeaway on ${point} — super clear and immediately actionable.`,
      },
      {
        label: 'Bookmark-Worthy',
        text: `Saving this post on ${topic}. Calling out ${point} cuts straight through the usual noise in the feed.`,
      },
      {
        label: 'Resonated Strongly',
        text: `Such a grounded take on ${topic}. Highlighting ${point} hits the exact challenge most teams gloss over.`,
      },
    ],
    question: [
      {
        label: 'Thoughtful Follow-Up',
        text: `Great insights on ${topic}! Curious how you handle ${point} when teams are short on time or working across time zones?`,
      },
      {
        label: 'Implementation Question',
        text: `Love this angle on ${topic}. When rolling out ${point}, what early signal tells you it is actually sticking?`,
      },
      {
        label: 'Edge-Case Question',
        text: `Really helpful summary on ${topic}. Have you found ${point} works equally well for smaller teams as it does at larger scale?`,
      },
    ],
    example: [
      {
        label: 'Shared Proof',
        text: `Can confirm this works well for ${topic}. Last quarter we focused on ${point} and saw the exact clarity lift you described here.`,
      },
      {
        label: 'Team Experience',
        text: `We tested a very similar idea around ${topic} recently — ${point} ended up being the single highest-leverage adjustment we made.`,
      },
      {
        label: 'Real-World Echo',
        text: `100% aligns with what we saw on ${topic}: once we prioritized ${point}, adoption stopped stalling.`,
      },
    ],
  };

  return rotateArray(bank[angle], variation).map((item, idx) => {
    const chars = countUnicodeChars(item.text);
    return {
      id: `comment-${angle}-${idx}`,
      label: item.label,
      text: item.text,
      chars,
      limit: 1250,
      withinLimit: chars <= 1250,
    };
  });
}

// ---------------------------------------------------------------------------
// 6. LinkedIn Reply Generator (1,250 char limit)
// ---------------------------------------------------------------------------
export type LinkedInReplyGoal = 'followup' | 'thanks' | 'resource' | 'clarify';

export function generateLinkedInReplies(params: {
  commenterName?: string;
  topic: string;
  detail?: string;
  goal?: LinkedInReplyGoal;
  variation?: number;
}): LinkedInShortMessage[] {
  const topic = params.topic.trim();
  if (!topic) return [];

  const name = params.commenterName?.trim();
  const greet = name ? `${name}, ` : '';
  const detail = cleanInput(params.detail, `keeping ${topic} simple and repeatable`);
  const goal = params.goal ?? 'followup';
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInReplyGoal, Array<{label: string; text: string}>> = {
    followup: [
      {
        label: 'Keep Thread Going',
        text: `${greet}appreciate you chiming in on ${topic}! ${detail} has been huge for us — how has your team been approaching that piece lately?`,
      },
      {
        label: 'Invite Deeper Insight',
        text: `${greet}thank you for adding that perspective on ${topic}. Curious what part of ${detail} made the biggest difference in your workflow?`,
      },
      {
        label: 'Compare Notes',
        text: `${greet}great point on ${topic}! Have you tested ${detail} recently, or are you leaning toward a different setup this quarter?`,
      },
    ],
    thanks: [
      {
        label: 'Warm Appreciation',
        text: `${greet}thank you for taking the time to read and share that note on ${topic}! Glad the point about ${detail} resonated.`,
      },
      {
        label: 'Concise Creator Reply',
        text: `${greet}really appreciate the thoughtful comment on ${topic} — always helpful hearing how ${detail} shows up in practice.`,
      },
      {
        label: 'Peer Recognition',
        text: `${greet}means a lot coming from you! Completely agree that ${detail} makes all the difference with ${topic}.`,
      },
    ],
    resource: [
      {
        label: 'Point to Next Step',
        text: `${greet}glad ${topic} was helpful! A quick note to pair with this: ${detail}. Happy to share the full checklist if useful.`,
      },
      {
        label: 'Share Summary Pointer',
        text: `${greet}thanks for asking about ${topic}. The core takeaway we rely on is ${detail} — let me know if you want a template breakdown.`,
      },
      {
        label: 'Actionable Follow-Up',
        text: `${greet}great question on ${topic}. For anyone tackling this now, start with ${detail} before expanding scope.`,
      },
    ],
    clarify: [
      {
        label: 'Polite Nuance',
        text: `${greet}great nuance to bring up on ${topic}. To clarify my earlier point: ${detail} works best once the baseline workflow is steady.`,
      },
      {
        label: 'Context Clarification',
        text: `${greet}fair point! Context matters a lot with ${topic} — what I meant specifically was ${detail}, rather than a one-size-fits-all rule.`,
      },
      {
        label: 'Balanced Framing',
        text: `${greet}totally agree there is nuance around ${topic}. In most cases ${detail} helps, though team size definitely shapes the trade-offs.`,
      },
    ],
  };

  return rotateArray(bank[goal], variation).map((item, idx) => {
    const text = item.text.charAt(0).toUpperCase() + item.text.slice(1);
    const chars = countUnicodeChars(text);
    return {
      id: `reply-${goal}-${idx}`,
      label: item.label,
      text,
      chars,
      limit: 1250,
      withinLimit: chars <= 1250,
    };
  });
}

// ---------------------------------------------------------------------------
// 7. LinkedIn Connection Message Generator (300 or 200 char limit toggle)
// ---------------------------------------------------------------------------
export type LinkedInConnectionCategory = 'recruiter' | 'hiring_manager' | 'peer' | 'alumni' | 'admirer';

export function generateLinkedInConnectionMessages(params: {
  recipientName?: string;
  sharedContext: string;
  yourRole?: string;
  category?: LinkedInConnectionCategory;
  maxLimit?: 300 | 200;
  variation?: number;
}): LinkedInShortMessage[] {
  const sharedContext = params.sharedContext.trim();
  if (!sharedContext) return [];

  const name = params.recipientName?.trim() || 'there';
  const roleSuffix = params.yourRole?.trim() ? ` as a ${params.yourRole.trim()}` : '';
  const category = params.category ?? 'peer';
  const maxLimit = params.maxLimit ?? 300;
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInConnectionCategory, Array<{label: string; text: string}>> = {
    recruiter: [
      {
        label: 'Concise Recruiter Intro',
        text: `Hi ${name}, I noticed your work recruiting for ${sharedContext}. I bring experience${roleSuffix} and would love to connect and stay on your radar for relevant openings.`,
      },
      {
        label: 'Short Role Alignment',
        text: `Hi ${name} — came across your profile while exploring ${sharedContext}. Would welcome connecting to follow your team's updates and upcoming roles.`,
      },
      {
        label: 'Direct & Respectful',
        text: `Hi ${name}, reaching out after seeing your focus on ${sharedContext}. I work${roleSuffix} and would appreciate adding you to my LinkedIn network.`,
      },
    ],
    hiring_manager: [
      {
        label: 'Team Context Note',
        text: `Hi ${name}, I've been following your team's work on ${sharedContext}. Working${roleSuffix}, I'd love to connect and learn from what you're building.`,
      },
      {
        label: 'Sharp Peer-Level Intro',
        text: `Hi ${name} — really admired your recent perspective on ${sharedContext}. Would love to connect here and follow your team's progress.`,
      },
      {
        label: 'Role Interest Note',
        text: `Hi ${name}, I'm excited about your team's focus on ${sharedContext} and bring background${roleSuffix}. Happy to connect here!`,
      },
    ],
    peer: [
      {
        label: 'Shared Industry Peer',
        text: `Hi ${name}, great crossing paths around ${sharedContext}! Working${roleSuffix}, I'd love to connect and trade notes in our field.`,
      },
      {
        label: 'Event / Community Peer',
        text: `Hi ${name} — enjoyed seeing your takeaways on ${sharedContext}. Would be glad to stay connected here on LinkedIn.`,
      },
      {
        label: 'Casual Professional',
        text: `Hi ${name}, connecting after seeing your work in ${sharedContext}. Always appreciate following thoughtful peers${roleSuffix}.`,
      },
    ],
    alumni: [
      {
        label: 'Warm Alumni Note',
        text: `Hi ${name}, fellow ${sharedContext} alum here! I'm currently working${roleSuffix} and always enjoy connecting with alumni on LinkedIn.`,
      },
      {
        label: 'Short Alumni Greeting',
        text: `Hi ${name} — noticed we share the ${sharedContext} connection! Would love to add you to my network and follow your work.`,
      },
      {
        label: 'Career Alumni Intro',
        text: `Hi ${name}, fellow ${sharedContext} grad working${roleSuffix}. Hope we can connect and stay in touch here!`,
      },
    ],
    admirer: [
      {
        label: 'Content Reader Note',
        text: `Hi ${name}, your posts on ${sharedContext} have been genuinely helpful in my work${roleSuffix}. Thanks for sharing — would love to connect!`,
      },
      {
        label: 'Specific Post Appreciation',
        text: `Hi ${name} — appreciated your recent breakdown on ${sharedContext}. Looking forward to following more of your insights here.`,
      },
      {
        label: 'Clean & Brief',
        text: `Hi ${name}, really enjoy following your insights on ${sharedContext}. Would welcome connecting!`,
      },
    ],
  };

  return rotateArray(bank[category], variation).map((item, idx) => {
    const rawText = item.text.replace(/\s+/g, ' ').trim();
    const text = maxLimit === 200 && countUnicodeChars(rawText) > 200
      ? `${sliceUnicodeChars(rawText, 197).replace(/[,\s]+$/, '')}...`
      : rawText;
    const chars = countUnicodeChars(text);
    return {
      id: `conn-${category}-${idx}`,
      label: item.label,
      text,
      chars,
      limit: maxLimit,
      withinLimit: chars <= maxLimit,
    };
  });
}

// ---------------------------------------------------------------------------
// 8. LinkedIn Cold DM Generator
// ---------------------------------------------------------------------------
export type LinkedInDmGoal = 'info_chat' | 'partnership' | 'b2b_intro' | 'followup';

export interface LinkedInLongMessage {
  id: string;
  label: string;
  text: string;
  chars: number;
  words: number;
}

export function generateLinkedInColdDms(params: {
  recipientName?: string;
  companyOrWork: string;
  yourValue: string;
  goal?: LinkedInDmGoal;
  variation?: number;
}): LinkedInLongMessage[] {
  const companyOrWork = params.companyOrWork.trim();
  const yourValue = params.yourValue.trim();
  if (!companyOrWork || !yourValue) return [];

  const name = params.recipientName?.trim() || 'there';
  const goal = params.goal ?? 'info_chat';
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInDmGoal, Array<{label: string; text: string}>> = {
    info_chat: [
      {
        label: '15-Minute Curiosity Chat',
        text: `Hi ${name},\n\nI noticed your recent work around ${companyOrWork} and appreciated how clearly you framed the challenges involved.\n\nIn my own work, ${yourValue}, and I am always looking to compare notes with practitioners who are actually in the weeds.\n\nIf you ever have 15 minutes over the next couple of weeks for a quick virtual coffee—no pitch, just swapping perspectives—let me know. Either way, thanks for sharing your work here!`,
      },
      {
        label: 'Asynchronous Question First',
        text: `Hi ${name},\n\nThanks for connecting! Your path with ${companyOrWork} caught my eye because ${yourValue}.\n\nNo pressure for a call—curious by message: what surprised you most about tackling ${companyOrWork} this year?\n\nAppreciate any quick perspective when you have a spare moment.`,
      },
      {
        label: 'Respectful Peer Intro',
        text: `Hi ${name},\n\nBeen following your updates on ${companyOrWork}. Given my background where ${yourValue}, I would value hearing how you prioritize next steps.\n\nIf you are open to a brief 10–15 minute chat sometime this month, I would be happy to work around your calendar. No rush at all.`,
      },
    ],
    partnership: [
      {
        label: 'Co-Marketing / Collaboration',
        text: `Hi ${name},\n\nSaw what you and your team are building with ${companyOrWork} — strong overlap with the audience we serve.\n\nOn our end, ${yourValue}. I think a lightweight collaboration (such as a joint breakdown, webinar, or resource swap) could add real value without heavy lift.\n\nOpen to me sending a 3-bullet concept over here to see if it fits your Q2/Q3 plans?`,
      },
      {
        label: 'Mutual Value Proposal',
        text: `Hi ${name},\n\nReally respect your team's focus on ${companyOrWork}.\n\nSince ${yourValue}, we regularly hear questions right in your wheelhouse. Would love to explore whether a mutual referral or co-authored LinkedIn guide makes sense.\n\nHappy to share details asynchronously if that sounds interesting.`,
      },
      {
        label: 'Low-Friction Intro',
        text: `Hi ${name},\n\nQuick note after reading about ${companyOrWork}: ${yourValue}.\n\nAre you the right person to chat briefly about potential partner collaborations, or should I reach out to someone else on your team?\n\nThanks in advance!`,
      },
    ],
    b2b_intro: [
      {
        label: 'Relevance + No-Pressure CTA',
        text: `Hi ${name},\n\nNoticed ${companyOrWork} has been a focus for your team lately.\n\nWe recently helped similar teams because ${yourValue} — without requiring a big overhaul of existing tools.\n\nIf solving that is on your roadmap this quarter, happy to send over a 2-minute summary or case example. If timing isn't right, totally understand!`,
      },
      {
        label: 'Observation-First Outreach',
        text: `Hi ${name},\n\nFollowing your recent update on ${companyOrWork} — sharp move.\n\nQuick context on why I'm reaching out: ${yourValue}. Teams usually look at this when trying to remove manual bottlenecks.\n\nWorth sharing a quick outline here, or not a priority right now?`,
      },
      {
        label: 'Concise Executive Note',
        text: `Hi ${name},\n\nI'll keep this brief — saw your team's work on ${companyOrWork}.\n\nIn short: ${yourValue}.\n\nWould you be open to reviewing a short benchmark note tailored to your setup, or is someone else leading that initiative?`,
      },
    ],
    followup: [
      {
        label: 'Helpful Bump',
        text: `Hi ${name},\n\nWanted to float this back up gently in case my earlier note on ${companyOrWork} got buried.\n\nSince we last spoke, ${yourValue}, which reminded me of your team's goals.\n\nHappy to pick things back up whenever timing is better—no rush on my end.`,
      },
      {
        label: 'Value-Add Follow-Up',
        text: `Hi ${name},\n\nHope your week is going well! Circling back on ${companyOrWork} with one quick thought: ${yourValue}.\n\nLet me know if revisiting this next week or next month makes more sense.`,
      },
      {
        label: 'Clean Close-the-Loop',
        text: `Hi ${name},\n\nQuick follow-up regarding ${companyOrWork}. Totally understand if priorities shifted—especially while ${yourValue}.\n\nShould I pause follow-ups for now, or check back next quarter?`,
      },
    ],
  };

  return rotateArray(bank[goal], variation).map((item, idx) => ({
    id: `dm-${goal}-${idx}`,
    label: item.label,
    text: item.text,
    chars: countUnicodeChars(item.text),
    words: countWords(item.text),
  }));
}

// ---------------------------------------------------------------------------
// 9. LinkedIn Job Description Generator
// ---------------------------------------------------------------------------
function toBulletLines(raw: string, fallbackItems: string[]): string[] {
  const split = raw
    .split(/\r?\n|;|•/)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);
  return split.length > 0 ? split : fallbackItems;
}

export function generateLinkedInJobDescription(params: {
  roleTitle: string;
  company?: string;
  workModel?: 'Remote' | 'Hybrid' | 'On-site';
  location?: string;
  level?: string;
  salaryRange?: string;
  teamSummary: string;
  responsibilities: string;
  qualifications: string;
  benefits?: string;
}): {text: string; chars: number; words: number} {
  const roleTitle = params.roleTitle.trim();
  if (!roleTitle) return {text: '', chars: 0, words: 0};

  const company = cleanInput(params.company, 'Our Team');
  const workModel = params.workModel ?? 'Hybrid';
  const location = cleanInput(params.location, 'United States / Flexible');
  const level = cleanInput(params.level, 'Mid-Senior');
  const salaryRange = params.salaryRange?.trim();
  const teamSummary = cleanInput(
    params.teamSummary,
    `Join ${company} as a ${roleTitle} where you will partner across functions to ship high-impact customer outcomes.`,
  );

  const respList = toBulletLines(params.responsibilities, [
    `Own end-to-end execution for core ${roleTitle} initiatives and quarterly milestones`,
    'Collaborate closely with cross-functional stakeholders to clarify scope and remove blockers',
    'Measure results weekly, document learnings, and raise team engineering/operational standards',
  ]);
  const qualList = toBulletLines(params.qualifications, [
    `Proven hands-on track record in a ${level.toLowerCase()} ${roleTitle} or closely related role`,
    'Clear written and verbal communication skills across technical and business partners',
    'Bias for structured problem-solving, ownership, and pragmatic delivery',
  ]);
  const benefitList = params.benefits?.trim()
    ? toBulletLines(params.benefits, [])
    : [
        'Comprehensive health, dental, and vision coverage',
        'Flexible PTO and dedicated annual learning budget',
        `${workModel} work setup (${location})`,
      ];

  const lines: string[] = [
    `${roleTitle} — ${company}`,
    `Level: ${level} · Work Model: ${workModel} (${location})`,
  ];
  if (salaryRange) {
    lines.push(`Compensation: ${salaryRange}`);
  }
  lines.push(
    '',
    'ABOUT THE ROLE',
    teamSummary,
    '',
    'KEY RESPONSIBILITIES',
    ...respList.map((r) => `• ${r}`),
    '',
    'WHAT WE ARE LOOKING FOR',
    ...qualList.map((q) => `• ${q}`),
    '',
    'COMPENSATION & BENEFITS',
    ...benefitList.map((b) => `• ${b}`),
    '',
    'HOW TO APPLY',
    `Apply directly via LinkedIn with your updated profile or portfolio highlighting work relevant to ${roleTitle}.`,
  );

  const text = lines.join('\n');
  return {
    text,
    chars: countUnicodeChars(text),
    words: countWords(text),
  };
}

// ---------------------------------------------------------------------------
// 10. LinkedIn Job Application Message Generator
// ---------------------------------------------------------------------------
export type LinkedInJobAppTemplate = 'post_apply' | 'referral' | 'hiring_manager';

export function generateLinkedInJobApplicationMessages(params: {
  recipientName?: string;
  roleTitle: string;
  company: string;
  proofMetric: string;
  mode?: 'full_dm' | 'connection_note';
  template?: LinkedInJobAppTemplate;
  variation?: number;
}): LinkedInShortMessage[] {
  const roleTitle = params.roleTitle.trim();
  const company = params.company.trim();
  const proof = params.proofMetric.trim();
  if (!roleTitle || !company || !proof) return [];

  const name = params.recipientName?.trim() || 'there';
  const mode = params.mode ?? 'full_dm';
  const template = params.template ?? 'post_apply';
  const variation = params.variation ?? 0;

  if (mode === 'connection_note') {
    const shortBank: Record<LinkedInJobAppTemplate, Array<{label: string; text: string}>> = {
      post_apply: [
        {
          label: 'Post-Apply Note (≤300)',
          text: `Hi ${name}, I just applied for the ${roleTitle} role at ${company}. Recently I ${proof}. Would love to connect and follow your team's work!`,
        },
        {
          label: 'Direct Recruiter Connect (≤300)',
          text: `Hi ${name} — submitted my application for ${roleTitle} at ${company}. Highlight: ${proof}. Happy to connect here!`,
        },
      ],
      referral: [
        {
          label: 'Warm Referral Connect (≤300)',
          text: `Hi ${name}, I'm eyeing the ${roleTitle} opening at ${company} (${proof}). Would value connecting for a quick perspective on the team!`,
        },
        {
          label: 'Team Insight Connect (≤300)',
          text: `Hi ${name} — saw you work at ${company}. Exploring the ${roleTitle} role after ${proof}; would be grateful to connect!`,
        },
      ],
      hiring_manager: [
        {
          label: 'Hiring Manager Note (≤300)',
          text: `Hi ${name}, excited about the ${roleTitle} opening on your team at ${company}. Background highlight: ${proof}. Would love to connect!`,
        },
        {
          label: 'Concise Proof Note (≤300)',
          text: `Hi ${name} — applied for ${roleTitle} at ${company} after ${proof}. Looking forward to connecting and following your team!`,
        },
      ],
    };

    return rotateArray(shortBank[template], variation).map((item, idx) => {
      const normalized = item.text.replace(/\s+/g, ' ').trim();
      const chars = countUnicodeChars(normalized);
      return {
        id: `jobapp-short-${template}-${idx}`,
        label: item.label,
        text: normalized,
        chars,
        limit: 300,
        withinLimit: chars <= 300,
      };
    });
  }

  const fullBank: Record<LinkedInJobAppTemplate, Array<{label: string; text: string}>> = {
    post_apply: [
      {
        label: 'Recruiter Follow-Up DM',
        text: `Hi ${name},\n\nI recently submitted my application for the ${roleTitle} position at ${company} and wanted to introduce myself directly.\n\nA quick snapshot of relevant proof: ${proof}.\n\nThank you for reviewing applications on a busy schedule—happy to share any extra work samples if helpful!`,
      },
      {
        label: 'Concise Application Check-In',
        text: `Hi ${name},\n\nHope your week is going smoothly. Sharing a quick note that I applied for ${roleTitle} at ${company}.\n\nGiven that ${proof}, the scope aligns closely with what I enjoy building most.\n\nAppreciate your time and consideration!`,
      },
    ],
    referral: [
      {
        label: 'Respectful Referral Ask',
        text: `Hi ${name},\n\nI noticed you are on the team at ${company} and saw the open ${roleTitle} role.\n\nMost recently I ${proof}, so the role looks like a strong match. No pressure at all—if you have 5 minutes to share what the team values most (or feel comfortable pointing me in the right direction), I would really appreciate it!`,
      },
      {
        label: 'Insider Question First',
        text: `Hi ${name},\n\nExploring the ${roleTitle} opening at ${company} right now. In my previous role I ${proof}.\n\nBefore I reach out formally, I'd love to hear your quick take on the team's culture and priorities if you have a spare moment.`,
      },
    ],
    hiring_manager: [
      {
        label: 'Hiring Manager Value Note',
        text: `Hi ${name},\n\nI just applied for the ${roleTitle} role on your team at ${company}.\n\nSeeing what your group is focused on, one relevant milestone from my recent work stands out: ${proof}.\n\nWould welcome the chance to discuss how I could contribute cleanly from week one. Thanks for your time!`,
      },
      {
        label: 'Brief Proof-First Outreach',
        text: `Hi ${name},\n\nReaching out directly regarding the ${roleTitle} opening at ${company}.\n\nWhy I'm excited about the role: ${proof}, and your team's direction matches the exact problems I love solving.\n\nThank you for considering my application!`,
      },
    ],
  };

  return rotateArray(fullBank[template], variation).map((item, idx) => {
    const chars = countUnicodeChars(item.text);
    return {
      id: `jobapp-full-${template}-${idx}`,
      label: item.label,
      text: item.text,
      chars,
      limit: 1900,
      withinLimit: chars <= 1900,
    };
  });
}

// ---------------------------------------------------------------------------
// 11. LinkedIn Experience Description Generator (2,000 char Experience limit)
// ---------------------------------------------------------------------------
export type LinkedInExperienceFormat = 'summary_plus_bullets' | 'impact_first' | 'car_method';

export function generateLinkedInExperienceBullets(params: {
  roleTitle: string;
  company?: string;
  actionOwned: string;
  metricOutcome: string;
  toolsUsed?: string;
  format?: LinkedInExperienceFormat;
  variation?: number;
}): {text: string; chars: number; limit: number; withinLimit: boolean} {
  const roleTitle = params.roleTitle.trim();
  const actionOwned = params.actionOwned.trim();
  const metricOutcome = params.metricOutcome.trim();
  if (!roleTitle || !actionOwned || !metricOutcome) {
    return {text: '', chars: 0, limit: 2000, withinLimit: true};
  }

  const company = params.company?.trim();
  const tools = params.toolsUsed?.trim();
  const format = params.format ?? 'summary_plus_bullets';
  const variation = params.variation ?? 0;

  const actions = toBulletLines(actionOwned, [actionOwned]);
  const outcomes = toBulletLines(metricOutcome, [metricOutcome]);
  const companyPhrase = company ? ` at ${company}` : '';
  const toolsLine = tools ? `\nCore Stack & Skills: ${tools}` : '';

  const variants: Record<LinkedInExperienceFormat, string[]> = {
    summary_plus_bullets: [
      `${roleTitle}${companyPhrase} focused on measurable execution and cross-functional delivery.\n\nKey Achievements:\n• ${actions[0]} — resulting in ${outcomes[0]}.${actions[1] ? `\n• ${actions[1]} — driving ${outcomes[1] ?? outcomes[0]}.` : `\n• Standardized repeatable workflows and documentation across stakeholders to sustain ${outcomes[0]}.`}${tools ? `\n• Leveraged ${tools} to streamline reporting and execution quality.` : ''}${toolsLine}`,
      `Led core initiatives as ${roleTitle}${companyPhrase} with direct ownership of delivery speed and quality.\n\nHighlights:\n• Delivered ${outcomes[0]} by spearheading ${actions[0]}.\n• Partnered across product, operations, and leadership to remove bottlenecks and scale best practices.${toolsLine}`,
    ],
    impact_first: [
      `• ${outcomes[0]} achieved by executing ${actions[0]} as ${roleTitle}${companyPhrase}.\n• ${actions[1] ? `${actions[1]} (${outcomes[1] ?? 'improved team velocity'}).` : `Built clear operating cadences and quality checks across ${company || 'the team'}.`}${tools ? `\n• Applied ${tools} across daily delivery.` : ''}${toolsLine}`,
      `• Impact: ${outcomes[0]} — driven through ${actions[0]}.\n• Ownership: Managed end-to-end milestones as ${roleTitle}${companyPhrase} with transparent metrics.${toolsLine}`,
    ],
    car_method: [
      `Context & Action: Stepped in as ${roleTitle}${companyPhrase} to lead ${actions[0]}.\nResult: ${outcomes[0]}.\n\nSupporting Wins:\n• Documented playbooks for repeatable handoffs across the team.${tools ? `\n• Tools utilized: ${tools}.` : ''}${toolsLine}`,
      `Challenge → Action → Result:\n• Action: ${actions[0]} (${roleTitle}${companyPhrase}).\n• Result: ${outcomes[0]}.\n• Sustainability: Established ongoing weekly tracking to preserve gains.${toolsLine}`,
    ],
  };

  const options = variants[format];
  const chosen = options[variation % options.length];
  const chars = countUnicodeChars(chosen);
  return {
    text: chosen,
    chars,
    limit: 2000,
    withinLimit: chars <= 2000,
  };
}

// ---------------------------------------------------------------------------
// 12. LinkedIn Skills Generator (Max 50 LinkedIn profile skills)
// ---------------------------------------------------------------------------
export type LinkedInSkillTrack =
  | 'engineering'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'ops'
  | 'product'
  | 'sales'
  | 'custom';

export interface LinkedInSkillsResult {
  priorityTop5: string[];
  hardSkills: string[];
  toolsAndPlatforms: string[];
  domainCompetencies: string[];
  allSkills: string[];
  totalCount: number;
  limit: number;
}

const SKILL_TRACK_DATA: Record<
  Exclude<LinkedInSkillTrack, 'custom'>,
  {hard: string[]; tools: string[]; domain: string[]}
> = {
  engineering: {
    hard: ['TypeScript', 'JavaScript', 'System Design', 'REST APIs', 'Unit Testing', 'Automated CI/CD', 'Database Modeling', 'Performance Optimization', 'Web Accessibility (WCAG)', 'Code Review'],
    tools: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'GitHub Actions', 'Vite', 'Redis', 'Playwright', 'Tailwind CSS'],
    domain: ['Technical Architecture', 'Cross-Functional Collaboration', 'Agile Software Delivery', 'Incident Response', 'Mentoring Engineers', 'Technical Documentation'],
  },
  design: {
    hard: ['UI Design', 'UX Research', 'Design Systems', 'Wireframing', 'Interactive Prototyping', 'Information Architecture', 'Usability Testing', 'Accessibility Design', 'Responsive Layout', 'Typography'],
    tools: ['Figma', 'FigJam', 'Adobe Creative Cloud', 'Framer', 'Storybook', 'Maze', 'Miro', 'Notion', 'HTML5', 'CSS3'],
    domain: ['Product Discovery', 'Design Critique', 'Stakeholder Alignment', 'User Journey Mapping', 'Brand Consistency', 'Design Handoff'],
  },
  marketing: {
    hard: ['B2B Content Strategy', 'SEO & Organic Growth', 'Demand Generation', 'Lifecycle Email Marketing', 'Conversion Rate Optimization', 'Copywriting', 'Campaign Attribution', 'Product Positioning', 'Social Media Strategy', 'A/B Testing'],
    tools: ['Google Analytics 4', 'Google Search Console', 'HubSpot', 'Semrush', 'Ahrefs', 'Mailchimp', 'Looker Studio', 'LinkedIn Campaign Manager', 'Webflow', 'Notion'],
    domain: ['Go-to-Market Strategy', 'Brand Messaging', 'Pipeline Generation', 'Editorial Calendar Management', 'Customer Interviews', 'Cross-Channel Reporting'],
  },
  finance: {
    hard: ['Financial Modeling', 'FP&A', 'Budgeting & Forecasting', 'Variance Analysis', 'Cash Flow Management', 'GAAP Accounting', 'Unit Economics', 'Valuation', 'Audit Preparation', 'Risk Management'],
    tools: ['Microsoft Excel', 'SQL', 'NetSuite', 'QuickBooks', 'Tableau', 'Power BI', 'Anaplan', 'Python', 'SAP', 'Bloomberg Terminal'],
    domain: ['Board Reporting', 'Strategic Finance', 'Capital Allocation', 'Vendor Negotiation', 'Internal Controls', 'Executive Decision Support'],
  },
  ops: {
    hard: ['Process Improvement', 'Supply Chain Operations', 'SOP Documentation', 'Capacity Planning', 'Vendor Management', 'Quality Assurance', 'KPI Dashboarding', 'Project Management', 'Inventory Control', 'SLA Management'],
    tools: ['Asana', 'Jira', 'Monday.com', 'Airtable', 'Microsoft Excel', 'Zapier', 'Slack Workflows', 'Looker', 'Salesforce', 'Google Workspace'],
    domain: ['Cross-Functional Operations', 'Change Management', 'Cost Optimization', 'Risk Mitigation', 'Stakeholder Communication', 'Scaling Teams'],
  },
  product: {
    hard: ['Product Strategy', 'Roadmap Prioritization', 'User Story Writing', 'Product Analytics', 'Experimentation (A/B Testing)', 'PRDs & Specs', 'Pricing & Packaging', 'Customer Discovery', 'Backlog Grooming', 'Competitive Analysis'],
    tools: ['Jira', 'Linear', 'Amplitude', 'Mixpanel', 'Productboard', 'Figma', 'SQL', 'Notion', 'Loom', 'PostHog'],
    domain: ['Cross-Functional Leadership', 'Go-to-Market Execution', 'Stakeholder Management', 'Outcome-Driven Planning', 'Voice of the Customer', 'Product Launches'],
  },
  sales: {
    hard: ['B2B Prospecting', 'Enterprise Account Management', 'Discovery Calls', 'Pipeline Management', 'Contract Negotiation', 'Forecasting', 'Account-Based Selling', 'Renewal & Expansion', 'Solution Selling', 'Executive Presentations'],
    tools: ['Salesforce', 'HubSpot CRM', 'LinkedIn Sales Navigator', 'Gong', 'Outreach', 'Apollo.io', 'Slack', 'ZoomInfo', 'DocuSign', 'Google Slides'],
    domain: ['Revenue Growth', 'Customer Retention', 'Strategic Partnerships', 'Territory Planning', 'Executive Relationship Building', 'Sales Playbooks'],
  },
};

export function generateLinkedInSkills(params: {
  track: LinkedInSkillTrack;
  customTools?: string;
}): LinkedInSkillsResult {
  const base =
    params.track === 'custom'
      ? {hard: [], tools: [], domain: []}
      : SKILL_TRACK_DATA[params.track];

  const customList = (params.customTools ?? '')
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const addUnique = (arr: string[], cap: number): string[] => {
    const out: string[] = [];
    for (const item of arr) {
      if (out.length >= cap) break;
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
    return out;
  };

  // Custom user inputs take top priority
  const customDeduped = addUnique(customList, 50);
  const remainingBudget = () => Math.max(0, 50 - seen.size);

  const hardSkills = addUnique(base.hard, remainingBudget());
  const toolsAndPlatforms = [...customDeduped, ...addUnique(base.tools, remainingBudget())].slice(0, 50);
  const domainCompetencies = addUnique(base.domain, remainingBudget());

  const allSkills = [...customDeduped, ...hardSkills, ...base.tools.filter((t) => toolsAndPlatforms.includes(t)), ...domainCompetencies].slice(0, 50);

  return {
    priorityTop5: allSkills.slice(0, 5),
    hardSkills,
    toolsAndPlatforms,
    domainCompetencies,
    allSkills,
    totalCount: allSkills.length,
    limit: 50,
  };
}

// ---------------------------------------------------------------------------
// 13. LinkedIn Recommendation Generator (3,000 char cap, 100–180w sweet spot)
// ---------------------------------------------------------------------------
export type LinkedInRelationship = 'peer' | 'direct_report' | 'manager' | 'mentor' | 'client';

export function generateLinkedInRecommendations(params: {
  personName: string;
  relationship: LinkedInRelationship;
  strengths: string;
  projectOutcome: string;
  variation?: number;
}): LinkedInLongMessage[] {
  const personName = params.personName.trim();
  const strengths = params.strengths.trim();
  const projectOutcome = params.projectOutcome.trim();
  if (!personName || !strengths || !projectOutcome) return [];

  const rel = params.relationship;
  const variation = params.variation ?? 0;

  const bank: Record<LinkedInRelationship, Array<{label: string; text: string}>> = {
    peer: [
      {
        label: 'Collaborative Teammate',
        text: `Working alongside ${personName} was one of the highlights of our time collaborating together. ${personName} consistently brings ${strengths} to every project, making complex work feel calm and organized for the entire group.\n\nA standout moment was ${projectOutcome}, where ${personName} stepped up early, kept communication crystal clear, and helped everyone cross the finish line smoothly.\n\nAny team would be fortunate to have ${personName} as a colleague—I recommend ${personName} wholeheartedly.`,
      },
      {
        label: 'Outcome-Focused Peer',
        text: `I had the pleasure of partnering closely with ${personName}, and I was continually impressed by their ${strengths}.\n\nDuring ${projectOutcome}, ${personName} combined sharp execution with steady teamwork, proactively unblocking peers and raising the bar for the final result.\n\nI would jump at the chance to work with ${personName} again.`,
      },
    ],
    direct_report: [
      {
        label: 'Manager Endorsing Report',
        text: `As ${personName}'s manager, I watched them raise the standard across our team through ${strengths}.\n\nOn ${projectOutcome}, ${personName} took full ownership from initial scoping through delivery, navigating ambiguous trade-offs thoughtfully and keeping stakeholders aligned the entire way.\n\n${personName} is reliable, proactive, and deeply committed to quality—any organization bringing ${personName} onto their team is gaining an immediate impact player.`,
      },
      {
        label: 'Growth & Ownership Praise',
        text: `Managing ${personName} was a genuine privilege. What sets ${personName} apart is the combination of ${strengths} and genuine accountability.\n\nWhether driving ${projectOutcome} or mentoring teammates day to day, ${personName} delivered consistently without needing micromanagement. I recommend ${personName} without hesitation.`,
      },
    ],
    manager: [
      {
        label: 'Report Endorsing Manager',
        text: `${personName} is the kind of leader people actively want to work for again. Under ${personName}'s guidance, our team benefited daily from their ${strengths}.\n\nThroughout ${projectOutcome}, ${personName} shielded the team from unnecessary noise, gave candid and constructive feedback, and made sure everyone's contributions were visible.\n\nI learned a tremendous amount working under ${personName} and recommend them enthusiastically.`,
      },
      {
        label: 'Supportive Leadership',
        text: `Reporting to ${personName} shaped how I think about leadership. They paired ${strengths} with high trust and clear priorities.\n\nDuring ${projectOutcome}, ${personName} balanced ambitious goals with practical support so the team could do its best work. Anyone joining ${personName}'s organization is in great hands.`,
      },
    ],
    mentor: [
      {
        label: 'Mentor Gratitude',
        text: `${personName} has been an invaluable mentor, bringing ${strengths} to every conversation.\n\nWhile navigating ${projectOutcome}, ${personName} asked the exact right questions to sharpen my thinking and offered practical guidance I still apply today.\n\nI am grateful for ${personName}'s generosity and perspective—anyone fortunate enough to learn from or partner with ${personName} will see immediate value.`,
      },
      {
        label: 'Advisor Endorsement',
        text: `Few people match ${personName}'s clarity and generosity as a mentor. Their ${strengths} directly influenced how I approached ${projectOutcome}.\n\nI cannot recommend ${personName} highly enough for leadership, advisory, or strategic roles.`,
      },
    ],
    client: [
      {
        label: 'Client / Vendor Endorsement',
        text: `Partnering with ${personName} exceeded expectations from day one. They brought ${strengths} to our engagement and operated like an extension of our internal team.\n\nAcross ${projectOutcome}, ${personName} hit every milestone cleanly, communicated proactively, and delivered measurable results.\n\nI happily recommend ${personName} to any team looking for a dependable, high-craft partner.`,
      },
      {
        label: 'Reliable Partner Review',
        text: `Working with ${personName} as an external partner was refreshingly smooth. Their ${strengths} stood out immediately during ${projectOutcome}.\n\nThoughtful, responsive, and outcome-driven—I look forward to collaborating with ${personName} again.`,
      },
    ],
  };

  return rotateArray(bank[rel], variation).map((item, idx) => ({
    id: `rec-${rel}-${idx}`,
    label: item.label,
    text: item.text,
    chars: countUnicodeChars(item.text),
    words: countWords(item.text),
  }));
}

// ---------------------------------------------------------------------------
// 14. LinkedIn Engagement Rate Calculator
// ---------------------------------------------------------------------------
export interface LinkedInEngagementResult {
  valid: boolean;
  error?: string;
  mode: 'impressions' | 'followers';
  total: number;
  er: number;
  tier: string;
  formula: string;
  breakdown: {
    likesPct: number;
    commentsPct: number;
    repostsPct: number;
    clicksPct: number;
  };
}

export function calculateLinkedInEngagement(params: {
  mode?: 'impressions' | 'followers';
  denominator?: number;
  followers?: number; // legacy compatibility alias
  likes: number;
  comments: number;
  reposts: number;
  clicks?: number;
}): LinkedInEngagementResult {
  const mode = params.mode ?? 'followers';
  const denominator = params.denominator ?? params.followers ?? 0;
  const clicks = params.clicks ?? 0;
  const {likes, comments, reposts} = params;

  if (
    !Number.isFinite(denominator) ||
    !Number.isFinite(likes) ||
    !Number.isFinite(comments) ||
    !Number.isFinite(reposts) ||
    !Number.isFinite(clicks)
  ) {
    return {
      valid: false,
      error: 'Please enter valid numbers in all fields.',
      mode,
      total: 0,
      er: 0,
      tier: 'Invalid input',
      formula: '',
      breakdown: {likesPct: 0, commentsPct: 0, repostsPct: 0, clicksPct: 0},
    };
  }

  if (likes < 0 || comments < 0 || reposts < 0 || clicks < 0) {
    return {
      valid: false,
      error: 'Engagement metrics (reactions, comments, reposts, clicks) cannot be negative.',
      mode,
      total: 0,
      er: 0,
      tier: 'Invalid input',
      formula: '',
      breakdown: {likesPct: 0, commentsPct: 0, repostsPct: 0, clicksPct: 0},
    };
  }

  if (denominator <= 0) {
    return {
      valid: false,
      error:
        mode === 'impressions'
          ? 'Impressions must be greater than 0 to divide engagement rate.'
          : 'Follower count must be greater than 0 to divide engagement rate.',
      mode,
      total: likes + comments + reposts + clicks,
      er: 0,
      tier: 'Denominator required',
      formula: '',
      breakdown: {likesPct: 0, commentsPct: 0, repostsPct: 0, clicksPct: 0},
    };
  }

  const total = likes + comments + reposts + clicks;
  const er = Number(((total / denominator) * 100).toFixed(2));
  const denomLabel = mode === 'impressions' ? 'Impressions' : 'Followers';
  const clicksPart = clicks > 0 ? ` + ${clicks} Clicks` : '';
  const formula = `(${likes} Reactions + ${comments} Comments + ${reposts} Reposts${clicksPart}) ÷ ${denominator.toLocaleString()} ${denomLabel} × 100 = ${er}%`;

  let tier: string;
  if (mode === 'impressions') {
    if (er >= 5) tier = 'Exceptional / Viral Impressions ER (5%+)';
    else if (er >= 2.5) tier = 'High Impressions ER (2.5%–5%)';
    else if (er >= 1) tier = 'Healthy Impressions ER (1%–2.5%)';
    else tier = 'Below Average Impressions ER (<1%)';
  } else {
    if (er >= 4) tier = 'Viral / Exceptional Follower ER (4%+)';
    else if (er >= 2) tier = 'High Follower ER (2%–4%)';
    else if (er >= 1) tier = 'Good / Solid Follower ER (1%–2%)';
    else tier = 'Below Average Follower ER (<1%)';
  }

  const pct = (part: number) => (total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0);

  return {
    valid: true,
    mode,
    total,
    er,
    tier,
    formula,
    breakdown: {
      likesPct: pct(likes),
      commentsPct: pct(comments),
      repostsPct: pct(reposts),
      clicksPct: pct(clicks),
    },
  };
}

// ---------------------------------------------------------------------------
// 15. LinkedIn Post & Field Character Counter
// ---------------------------------------------------------------------------
export type LinkedInLimitPreset =
  | 'post'
  | 'headline'
  | 'about'
  | 'comment'
  | 'connection'
  | 'experience'
  | 'poll_question'
  | 'poll_option';

export const LINKEDIN_FIELD_LIMITS: Record<
  LinkedInLimitPreset,
  {label: string; limit: number; seeMoreFold?: number}
> = {
  post: {label: 'Feed Post', limit: 3000, seeMoreFold: 210},
  headline: {label: 'Profile Headline', limit: 220},
  about: {label: 'About / Summary', limit: 2600, seeMoreFold: 260},
  comment: {label: 'Post Comment', limit: 1250},
  connection: {label: 'Connection Note', limit: 300},
  experience: {label: 'Experience Description', limit: 2000},
  poll_question: {label: 'Poll Question', limit: 140},
  poll_option: {label: 'Poll Option', limit: 30},
};

export interface LinkedInTextAnalysis {
  preset: LinkedInLimitPreset;
  label: string;
  chars: number;
  limit: number;
  remaining: number;
  overLimit: boolean;
  words: number;
  lines: number;
  seeMoreFold?: number;
  beforeFold: string;
  afterFold: string;
  isTruncatedAtFold: boolean;
}

export function analyzeLinkedInTextLength(
  text: string,
  preset: LinkedInLimitPreset = 'post',
): LinkedInTextAnalysis {
  const cfg = LINKEDIN_FIELD_LIMITS[preset];
  const codePoints = Array.from(text);
  const chars = codePoints.length;
  const remaining = cfg.limit - chars;
  const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;

  let beforeFold = text;
  let afterFold = '';
  let isTruncatedAtFold = false;

  if (cfg.seeMoreFold) {
    // LinkedIn desktop fold hits at ~210 chars OR after 3 line breaks
    const lineSplit = text.split(/\r?\n/);
    if (chars > cfg.seeMoreFold) {
      beforeFold = codePoints.slice(0, cfg.seeMoreFold).join('');
      afterFold = codePoints.slice(cfg.seeMoreFold).join('');
      isTruncatedAtFold = true;
    } else if (preset === 'post' && lineSplit.length > 3) {
      beforeFold = lineSplit.slice(0, 3).join('\n');
      afterFold = '\n' + lineSplit.slice(3).join('\n');
      isTruncatedAtFold = true;
    }
  }

  return {
    preset,
    label: cfg.label,
    chars,
    limit: cfg.limit,
    remaining,
    overLimit: chars > cfg.limit,
    words: countWords(text),
    lines,
    seeMoreFold: cfg.seeMoreFold,
    beforeFold,
    afterFold,
    isTruncatedAtFold,
  };
}

// ---------------------------------------------------------------------------
// 16. LinkedIn Hashtag Counter
// ---------------------------------------------------------------------------
export interface LinkedInHashtagAnalysis {
  totalCount: number;
  uniqueCount: number;
  uniqueTags: string[];
  duplicates: Array<{tag: string; count: number}>;
  status: 'empty' | 'under_3' | 'optimal_3_5' | 'over_5';
  recommendation: string;
  recommendedFooter: string;
  allUniqueFooter: string;
  hasMalformedHash: boolean;
}

export function analyzeLinkedInHashtags(text: string): LinkedInHashtagAnalysis {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      totalCount: 0,
      uniqueCount: 0,
      uniqueTags: [],
      duplicates: [],
      status: 'empty',
      recommendation: 'Paste a LinkedIn post or tag list to count hashtags.',
      recommendedFooter: '',
      allUniqueFooter: '',
      hasMalformedHash: false,
    };
  }

  const matches = trimmed.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  const hasMalformedHash = /(?:^|\s)#(?:\s|$)/.test(trimmed) || /#[\p{L}\p{N}_]+#/u.test(trimmed);

  const counts = new Map<string, {display: string; count: number}>();
  for (const m of matches) {
    const key = m.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, {display: m, count: 1});
    }
  }

  const uniqueTags = Array.from(counts.values()).map((v) => v.display);
  const duplicates = Array.from(counts.values())
    .filter((v) => v.count > 1)
    .map((v) => ({tag: v.display, count: v.count}));

  let status: LinkedInHashtagAnalysis['status'] = 'optimal_3_5';
  let recommendation = 'Ideal LinkedIn tag range (3–5 focused hashtags).';
  if (uniqueTags.length === 0) {
    status = 'under_3';
    recommendation = 'No valid #hashtags detected. Add 3–5 relevant industry hashtags.';
  } else if (uniqueTags.length < 3) {
    status = 'under_3';
    recommendation = `Light tagging (${uniqueTags.length} unique). Most creators aim for 3–5 targeted tags.`;
  } else if (uniqueTags.length > 5) {
    status = 'over_5';
    recommendation = `Over-tagged (${uniqueTags.length} unique). LinkedIn posts usually read cleanest with 3–5 focused tags.`;
  }

  return {
    totalCount: matches.length,
    uniqueCount: uniqueTags.length,
    uniqueTags,
    duplicates,
    status,
    recommendation,
    recommendedFooter: uniqueTags.slice(0, 5).join(' '),
    allUniqueFooter: uniqueTags.join(' '),
    hasMalformedHash,
  };
}

// ---------------------------------------------------------------------------
// 17. LinkedIn Content Calendar Generator (PLAN ONLY — deterministic dates)
// ---------------------------------------------------------------------------
export interface LinkedInCalendarSlot {
  id: string;
  week: number;
  date: string;
  weekday: string;
  pillar: string;
  format: string;
  prompt: string;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// Preferred B2B weekday indices (Tue=2, Thu=4, Wed=3, Mon=1, Fri=5, Sat=6, Sun=0)
const B2B_CADENCE_DAYS: Record<number, number[]> = {
  1: [2],
  2: [2, 4],
  3: [2, 3, 4],
  4: [1, 2, 3, 4],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
};

const FORMAT_ROTATION = [
  'Text Insight (≤1,400 chars)',
  'Carousel PDF (1080×1350)',
  '1200×627 Visual + Takeaway',
  'Case Study / Metric Breakdown',
  'Community Poll (140q / 30o)',
];

const PROMPT_TEMPLATES = [
  (p: string) => `Lesson learned in ${p}: one bottleneck solved this month`,
  (p: string) => `5-slide step-by-step framework for ${p}`,
  (p: string) => `Annotated chart or before/after screenshot on ${p}`,
  (p: string) => `Mini case study: what changed when we refined ${p}`,
  (p: string) => `Quick audience poll comparing 3 approaches to ${p}`,
];

export function buildLinkedInContentCalendar(params: {
  pillars: string[];
  postsPerWeek: number;
  weeks: number;
  startDate: string;
}): {valid: boolean; error?: string; slots: LinkedInCalendarSlot[]} {
  const pillars = params.pillars.map((p) => p.trim()).filter(Boolean);
  if (pillars.length === 0) {
    return {valid: false, error: 'Enter at least one content pillar to build your schedule.', slots: []};
  }
  const postsPerWeek = Math.min(7, Math.max(1, Math.round(params.postsPerWeek || 3)));
  const weeks = Math.min(12, Math.max(1, Math.round(params.weeks || 4)));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.startDate)) {
    return {valid: false, error: 'Choose a valid start date (YYYY-MM-DD).', slots: []};
  }
  const [y, m, d] = params.startDate.split('-').map(Number);
  const startUtc = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(startUtc.getTime())) {
    return {valid: false, error: 'Invalid calendar start date.', slots: []};
  }

  const targetDays = new Set(B2B_CADENCE_DAYS[postsPerWeek]);
  const slots: LinkedInCalendarSlot[] = [];
  let slotIdx = 0;

  // Iterate forward day by day across weeks * 7 days
  for (let offset = 0; offset < weeks * 7; offset++) {
    const cur = new Date(startUtc.getTime() + offset * 86_400_000);
    const dow = cur.getUTCDay();
    if (!targetDays.has(dow)) continue;

    const weekNum = Math.floor(offset / 7) + 1;
    const isoDate = cur.toISOString().slice(0, 10);
    const pillar = pillars[slotIdx % pillars.length];
    const fmtIdx = slotIdx % FORMAT_ROTATION.length;
    slots.push({
      id: `li-cal-${isoDate}-${slotIdx}`,
      week: weekNum,
      date: isoDate,
      weekday: WEEKDAY_LABELS[dow],
      pillar,
      format: FORMAT_ROTATION[fmtIdx],
      prompt: PROMPT_TEMPLATES[fmtIdx](pillar),
    });
    slotIdx += 1;
  }

  return {valid: true, slots};
}

function escapeCsvCell(val: string): string {
  const safe = val.replace(/"/g, '""');
  return `"${safe}"`;
}

export function serializeLinkedInCalendarCsv(slots: LinkedInCalendarSlot[]): string {
  const header = ['Week', 'Date', 'Day', 'Content Pillar', 'Format', 'Draft Prompt'].map(escapeCsvCell).join(',');
  const rows = slots.map((s) =>
    [String(s.week), s.date, s.weekday, s.pillar, s.format, s.prompt].map(escapeCsvCell).join(','),
  );
  return [header, ...rows].join('\n');
}

export function serializeLinkedInCalendarMarkdown(slots: LinkedInCalendarSlot[]): string {
  const lines = [
    '| Week | Date | Day | Content Pillar | Format | Draft Prompt |',
    '| --- | --- | --- | --- | --- | --- |',
    ...slots.map(
      (s) =>
        `| W${s.week} | ${s.date} | ${s.weekday} | ${s.pillar.replace(/\|/g, '\\|')} | ${s.format.replace(/\|/g, '\\|')} | ${s.prompt.replace(/\|/g, '\\|')} |`,
    ),
  ];
  return lines.join('\n');
}
