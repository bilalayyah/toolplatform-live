// Pure deterministic browser helpers for Reddit tools (ZERO AI, ZERO network calls)

export function countUnicodeChars(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as unknown as {Segmenter: new (loc: string, opt: {granularity: string}) => {segment: (s: string) => Iterable<unknown>}}).Segmenter('en', {granularity: 'grapheme'});
      return Array.from(segmenter.segment(text)).length;
    } catch {
      // Fallback below
    }
  }
  return Array.from(text).length;
}

export function sliceUnicodeChars(text: string, maxChars: number): string {
  if (maxChars <= 0) return '';
  return Array.from(text).slice(0, maxChars).join('');
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length <= 1) return items;
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

// ---------------------------------------------------------------------------
// 1. Reddit Subreddit Name Generator (3–21 chars, letters, numbers, underscores ONLY)
// ---------------------------------------------------------------------------
export type SubredditStyle = 'descriptive' | 'creative' | 'short';

export interface SubredditNameItem {
  rawName: string;
  formattedName: string; // r/Name
  chars: number;
  style: string;
  isValid: boolean;
}

export function isValidSubredditName(name: string): boolean {
  return /^[a-zA-Z0-9_]{3,21}$/.test(name);
}

export function generateSubredditNames(params: {
  keywords: string;
  style: SubredditStyle;
  count: number;
  variation?: number;
}): { items: SubredditNameItem[]; error?: string } {
  const raw = params.keywords.trim();
  if (!raw) {
    return { items: [], error: 'Please enter 1 or more keywords for your subreddit topic.' };
  }

  // Clean keywords into clean alphanumeric tokens
  const cleanTokens = raw
    .replace(/[^a-zA-Z0-9\s_]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanTokens.length === 0) {
    return { items: [], error: 'Please enter valid alphanumeric keywords (letters and numbers).' };
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const pascalBase = cleanTokens.map(capitalize).join('');
  const primaryWord = capitalize(cleanTokens[0]);
  const secondaryWord = cleanTokens[1] ? capitalize(cleanTokens[1]) : '';
  const firstLetterInitials = cleanTokens.map((w) => w.charAt(0).toUpperCase()).join('');

  const descriptiveTemplates = [
    `${pascalBase}Club`,
    `${pascalBase}Hub`,
    `${pascalBase}Talk`,
    `Ask${pascalBase}`,
    `${pascalBase}Lounge`,
    `${pascalBase}Central`,
    `${pascalBase}_Community`,
    `AllAbout${pascalBase}`,
    `${pascalBase}Help`,
    `${pascalBase}Discuss`,
    `${primaryWord}_${secondaryWord || 'Reddit'}`,
    `The${pascalBase}Place`,
    `${pascalBase}Corner`,
    `${pascalBase}Daily`,
    `${pascalBase}Network`,
    `${pascalBase}World`,
  ];

  const creativeTemplates = [
    `${pascalBase}Crafters`,
    `Pure${pascalBase}`,
    `${pascalBase}Pulse`,
    `${pascalBase}Lab`,
    `${pascalBase}Den`,
    `ObsessedWith${primaryWord}`,
    `${pascalBase}Geeks`,
    `${pascalBase}Spot`,
    `${pascalBase}Vibes`,
    `Everyday${primaryWord}`,
    `${pascalBase}Circle`,
    `${pascalBase}Collective`,
    `${pascalBase}HQ`,
    `${pascalBase}Zone`,
    `Real${pascalBase}`,
    `${pascalBase}Nirvana`,
  ];

  const shortTemplates = [
    `${primaryWord.slice(0, 8)}Hq`,
    `${primaryWord.slice(0, 8)}Zone`,
    `Go${primaryWord.slice(0, 10)}`,
    `Just${primaryWord.slice(0, 8)}`,
    `${pascalBase.slice(0, 14)}_io`,
    `${primaryWord.slice(0, 8)}Pro`,
    `${firstLetterInitials.slice(0, 4)}_${primaryWord.slice(0, 8)}`,
    `r_${pascalBase.slice(0, 12)}`,
    `${primaryWord.slice(0, 8)}Mod`,
    `${primaryWord.slice(0, 10)}Net`,
    `${primaryWord.slice(0, 8)}Lab`,
    `My${primaryWord.slice(0, 10)}`,
    `${pascalBase.slice(0, 12)}App`,
    `${primaryWord.slice(0, 10)}X`,
  ];

  let pool: string[];
  if (params.style === 'descriptive') pool = descriptiveTemplates;
  else if (params.style === 'creative') pool = creativeTemplates;
  else pool = shortTemplates;

  // Add mixed backups
  const combinedPool = [
    ...pool,
    ...descriptiveTemplates,
    ...creativeTemplates,
    ...shortTemplates,
  ];

  const offset = params.variation || 0;
  const rotated = rotateArray(combinedPool, offset);

  const seen = new Set<string>();
  const validItems: SubredditNameItem[] = [];

  for (const rawCandidate of rotated) {
    // Sanitize candidate to strictly 3-21 chars and [a-zA-Z0-9_]
    const sanitized = rawCandidate.replace(/[^a-zA-Z0-9_]/g, '');
    if (sanitized.length > 21) {
      // Try truncation if meaningful
      const truncated = sanitized.slice(0, 21);
      if (isValidSubredditName(truncated) && !seen.has(truncated.toLowerCase())) {
        seen.add(truncated.toLowerCase());
        validItems.push({
          rawName: truncated,
          formattedName: `r/${truncated}`,
          chars: truncated.length,
          style: params.style,
          isValid: true,
        });
      }
    } else if (isValidSubredditName(sanitized) && !seen.has(sanitized.toLowerCase())) {
      seen.add(sanitized.toLowerCase());
      validItems.push({
        rawName: sanitized,
        formattedName: `r/${sanitized}`,
        chars: sanitized.length,
        style: params.style,
        isValid: true,
      });
    }

    if (validItems.length >= params.count) break;
  }

  // Guaranteed fallback generator if keywords were very long
  if (validItems.length < params.count) {
    const compact = pascalBase.slice(0, 12) || 'Community';
    const suffixes = ['Hub', 'HQ', 'Lab', 'Net', 'Sub', 'Zone', 'Club', 'Talk', 'Den', 'Ask', 'Pro', 'App'];
    for (const suf of suffixes) {
      const candidate = `${compact.slice(0, 21 - suf.length)}${suf}`;
      if (isValidSubredditName(candidate) && !seen.has(candidate.toLowerCase())) {
        seen.add(candidate.toLowerCase());
        validItems.push({
          rawName: candidate,
          formattedName: `r/${candidate}`,
          chars: candidate.length,
          style: params.style,
          isValid: true,
        });
      }
      if (validItems.length >= params.count) break;
    }
  }

  return { items: validItems.slice(0, params.count) };
}

// ---------------------------------------------------------------------------
// 2. Reddit Subreddit Description Generator (<= 500 chars limit)
// ---------------------------------------------------------------------------
export type SubredditDescriptionTone = 'casual' | 'serious' | 'welcoming';

export interface SubredditDescriptionItem {
  id: string;
  title: string;
  description: string;
  chars: number;
  isWithinLimit: boolean;
}

export function generateSubredditDescriptions(params: {
  topic: string;
  communityFocus: string;
  tone: SubredditDescriptionTone;
  rules?: string;
  count?: number;
  variation?: number;
}): { items: SubredditDescriptionItem[]; error?: string } {
  const topic = params.topic.trim();
  const focus = params.communityFocus.trim();
  if (!topic) {
    return { items: [], error: 'Please enter your subreddit topic or name.' };
  }
  if (!focus) {
    return { items: [], error: 'Please enter what your subreddit community is for.' };
  }

  const rawRules = (params.rules || '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);

  const cleanSubreddit = topic.startsWith('r/') ? topic : `r/${topic.replace(/\s+/g, '')}`;
  const ruleBullets = rawRules.length > 0
    ? `\nRules: ${rawRules.join(' · ')}`
    : '';

  const templates: { title: string; build: () => string }[] = [];

  if (params.tone === 'welcoming') {
    templates.push(
      {
        title: 'Friendly Community Hub',
        build: () =>
          `Welcome to ${cleanSubreddit}! A supportive space dedicated to ${focus}. Whether you are just getting started or sharing years of hard-won experience, all enthusiasts are welcome here.\n\nShare projects, ask questions, and connect with fellow members.${ruleBullets}`,
      },
      {
        title: 'Open Discussion Lounge',
        build: () =>
          `${cleanSubreddit} is an inclusive community centered around ${focus}. Drop in to share discoveries, troubleshoot challenges, and learn alongside peers at every level.\n\nBe kind, stay helpful, and enjoy the discussions.${ruleBullets}`,
      },
      {
        title: 'Knowledge Sharing & Showcase',
        build: () =>
          `The front page for ${focus}. ${cleanSubreddit} brings together creators, hobbyists, and learners to exchange practical tips, reviews, and constructive feedback.${ruleBullets}\n\nHave something to show off? Post your work!`,
      },
      {
        title: 'Collaborative Space',
        build: () =>
          `Welcome to the ${cleanSubreddit} community! We gather here to discuss, explore, and master ${focus}. Everyone from beginners to veteran contributors is encouraged to participate.${ruleBullets}`,
      },
    );
  } else if (params.tone === 'serious') {
    templates.push(
      {
        title: 'Curated Technical Forum',
        build: () =>
          `${cleanSubreddit} is a curated forum dedicated to serious discussion, analysis, and research regarding ${focus}. High-signal discussions, in-depth writeups, and evidence-based contributions are prioritized.${ruleBullets}\n\nPlease search prior threads before posting.`,
      },
      {
        title: 'Deep-Dive Knowledge Base',
        build: () =>
          `A dedicated community for in-depth discussion and practical documentation of ${focus}. ${cleanSubreddit} aims for thorough, constructive exchange without low-effort fluff.${ruleBullets}\n\nHigh-quality submissions only.`,
      },
      {
        title: 'Practitioners & Research',
        build: () =>
          `Discussion, news, and critical perspectives on ${focus}. ${cleanSubreddit} serves professionals, researchers, and dedicated practitioners seeking substantive exchange.${ruleBullets}\n\nRespect community standards and verify sources.`,
      },
      {
        title: 'Standards & Best Practices',
        build: () =>
          `${cleanSubreddit} maintains focused discourse on ${focus}. We emphasize technical accuracy, clear explanations, and respectful debate.${ruleBullets}\n\nReview submission guidelines before posting.`,
      },
    );
  } else {
    // Casual tone
    templates.push(
      {
        title: 'Relaxed Hangout',
        build: () =>
          `r/${topic.replace(/^r\//, '')} is the community hangout for ${focus}. Share cool finds, ask quick questions, swap recommendations, and show off your progress.${ruleBullets}\n\nKeep it chill, be respectful, and have fun!`,
      },
      {
        title: 'Showcase & Discussion',
        build: () =>
          `The unofficial gathering spot for all things ${focus}! Post your latest setups, funny moments, quick tips, and honest reviews.${ruleBullets}\n\nNo gatekeeping—just genuine conversation and good vibes.`,
      },
      {
        title: 'Everyday Tips & Chat',
        build: () =>
          `Got questions about ${focus}? You found the right spot. ${cleanSubreddit} is where members share daily experiences, discoveries, and practical hacks.${ruleBullets}\n\nPull up a chair and join the thread!`,
      },
      {
        title: 'Enthusiast Meetup',
        build: () =>
          `Your neighborhood Reddit home for ${focus}. Chat about current trends, share memes, troubleshoot hurdles, and discover new ideas together.${ruleBullets}`,
      },
    );
  }

  const offset = params.variation || 0;
  const rotated = rotateArray(templates, offset);
  const targetCount = params.count || 4;

  const items: SubredditDescriptionItem[] = [];

  for (let i = 0; i < rotated.length && items.length < targetCount; i++) {
    const t = rotated[i];
    let text = t.build().trim();
    let charCount = countUnicodeChars(text);

    // If over 500 characters, safely trim down to stay under Reddit's 500 cap
    if (charCount > 500) {
      text = sliceUnicodeChars(text, 497) + '...';
      charCount = countUnicodeChars(text);
    }

    items.push({
      id: `desc-${i + 1}`,
      title: t.title,
      description: text,
      chars: charCount,
      isWithinLimit: charCount <= 500,
    });
  }

  return { items };
}

// ---------------------------------------------------------------------------
// 3. Reddit Flair Generator (<= 64 chars limit)
// ---------------------------------------------------------------------------
export type RedditFlairStyle = 'question' | 'discussion' | 'guide' | 'news' | 'help' | 'any';

export interface RedditFlairItem {
  id: string;
  text: string;
  chars: number;
  category: string;
  isWithinLimit: boolean;
}

export function generateRedditFlairs(params: {
  topic: string;
  style: RedditFlairStyle;
  count: number;
  variation?: number;
}): { items: RedditFlairItem[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { items: [], error: 'Please enter a subreddit or topic name.' };
  }

  const cleanTopic = topic.replace(/^r\//, '').trim();

  const presetsByStyle: Record<string, string[]> = {
    question: [
      `[Question]`,
      `[Ask ${cleanTopic}]`,
      `[Beginner Question]`,
      `[Advice Needed]`,
      `[Quick Question]`,
      `[What Should I Choose?]`,
      `[Identification Help]`,
      `[Question / Help]`,
      `[Critique Request]`,
      `[Second Opinion]`,
    ],
    discussion: [
      `[Discussion]`,
      `[Community Debate]`,
      `[Hot Take]`,
      `[Unpopular Opinion]`,
      `[Weekly Discussion]`,
      `[Experience / Review]`,
      `[Showcase & Feedback]`,
      `[Open Thread]`,
      `[Theory / Speculation]`,
      `[Community Poll]`,
    ],
    guide: [
      `[Guide]`,
      `[Step-by-Step Tutorial]`,
      `[Tips & Best Practices]`,
      `[Deep Dive / Analysis]`,
      `[Curated Resource List]`,
      `[Troubleshooting Guide]`,
      `[Beginner Handbook]`,
      `[Reference Sheet]`,
      `[Comprehensive Breakdown]`,
      `[Tools & Recommendations]`,
    ],
    news: [
      `[News / Update]`,
      `[Official Announcement]`,
      `[Industry News]`,
      `[Release Notes]`,
      `[Rumor / Unconfirmed]`,
      `[Event Megathread]`,
      `[Article Breakdown]`,
      `[Development Log]`,
      `[PSA / Notice]`,
      `[Community Spotlight]`,
    ],
    help: [
      `[Help Needed]`,
      `[Troubleshooting]`,
      `[Issue Solved ✓]`,
      `[Bug / Error]`,
      `[Setup Diagnosis]`,
      `[Configuration Help]`,
      `[Emergency Help]`,
      `[Repair / Fix]`,
      `[Hardware / Software]`,
      `[Before & After]`,
    ],
  };

  let candidatePool: { text: string; category: string }[] = [];

  if (params.style === 'any') {
    Object.keys(presetsByStyle).forEach((cat) => {
      presetsByStyle[cat].forEach((txt) => candidatePool.push({ text: txt, category: cat }));
    });
  } else {
    const list = presetsByStyle[params.style] || presetsByStyle.discussion;
    list.forEach((txt) => candidatePool.push({ text: txt, category: params.style }));
  }

  const offset = params.variation || 0;
  const rotated = rotateArray(candidatePool, offset);

  const seen = new Set<string>();
  const items: RedditFlairItem[] = [];

  for (let i = 0; i < rotated.length && items.length < params.count; i++) {
    const item = rotated[i];
    let flairText = item.text.trim();
    if (flairText.length > 64) {
      flairText = flairText.slice(0, 64);
    }

    if (!seen.has(flairText.toLowerCase())) {
      seen.add(flairText.toLowerCase());
      items.push({
        id: `flair-${i + 1}`,
        text: flairText,
        chars: countUnicodeChars(flairText),
        category: item.category,
        isWithinLimit: countUnicodeChars(flairText) <= 64,
      });
    }
  }

  return { items };
}

// ---------------------------------------------------------------------------
// 4. Reddit Engagement Rate Calculator (Subscribers vs Views)
// ---------------------------------------------------------------------------
export interface RedditEngagementResult {
  ratePercent: number;
  totalInteractions: number;
  discussionRatioPercent: number; // comments / interactions
  formulaUsed: string;
  formulaDescription: string;
  metricType: 'subscribers' | 'views';
  status: 'valid' | 'invalid';
  errorMessage?: string;
}

export function calculateRedditEngagement(params: {
  upvotes: number;
  comments: number;
  metricType: 'subscribers' | 'views';
  metricValue: number;
}): RedditEngagementResult {
  const { upvotes, comments, metricType, metricValue } = params;

  if (isNaN(upvotes) || isNaN(comments) || isNaN(metricValue)) {
    return {
      ratePercent: 0,
      totalInteractions: 0,
      discussionRatioPercent: 0,
      formulaUsed: '',
      formulaDescription: '',
      metricType,
      status: 'invalid',
      errorMessage: 'Please enter valid non-negative numbers for all fields.',
    };
  }

  if (upvotes < 0 || comments < 0 || metricValue < 0) {
    return {
      ratePercent: 0,
      totalInteractions: 0,
      discussionRatioPercent: 0,
      formulaUsed: '',
      formulaDescription: '',
      metricType,
      status: 'invalid',
      errorMessage: 'Inputs cannot be negative numbers.',
    };
  }

  if (metricValue === 0) {
    const denominatorLabel = metricType === 'subscribers' ? 'Subscribers' : 'Views';
    return {
      ratePercent: 0,
      totalInteractions: upvotes + comments,
      discussionRatioPercent: 0,
      formulaUsed: `(Upvotes + Comments) / ${denominatorLabel} × 100`,
      formulaDescription: `Cannot divide by zero. Please enter a ${denominatorLabel.toLowerCase()} count greater than 0 to calculate engagement rate.`,
      metricType,
      status: 'invalid',
      errorMessage: `${denominatorLabel} count must be greater than 0 to evaluate engagement percentage.`,
    };
  }

  const totalInteractions = upvotes + comments;
  const ratePercent = (totalInteractions / metricValue) * 100;
  const discussionRatioPercent = totalInteractions > 0 ? (comments / totalInteractions) * 100 : 0;

  const formulaUsed =
    metricType === 'subscribers'
      ? `(${upvotes.toLocaleString()} upvotes + ${comments.toLocaleString()} comments) / ${metricValue.toLocaleString()} subscribers × 100`
      : `(${upvotes.toLocaleString()} upvotes + ${comments.toLocaleString()} comments) / ${metricValue.toLocaleString()} views × 100`;

  const formulaDescription =
    metricType === 'subscribers'
      ? 'Engagement Rate by Subscribers measures how active the community is relative to total subscriber base.'
      : 'Engagement Rate by Views measures the proportion of post viewers who actively voted or commented.';

  return {
    ratePercent: Number(ratePercent.toFixed(2)),
    totalInteractions,
    discussionRatioPercent: Number(discussionRatioPercent.toFixed(1)),
    formulaUsed,
    formulaDescription,
    metricType,
    status: 'valid',
  };
}

// ---------------------------------------------------------------------------
// 5. Reddit Post Idea Generator (distinct from Tool 8 — structured topic)
// ---------------------------------------------------------------------------
export type RedditPostType = 'any' | 'question' | 'discussion' | 'guide' | 'story' | 'advice';

export interface RedditPostIdeaItem {
  id: string;
  title: string;
  angle: string;
  postType: string;
  charCount: number;
}

export function generateRedditPostIdeas(params: {
  subredditOrTopic: string;
  audience?: string;
  postType: RedditPostType;
  count: number;
  variation?: number;
}): { items: RedditPostIdeaItem[]; error?: string } {
  const topic = params.subredditOrTopic.trim();
  if (!topic) {
    return { items: [], error: 'Please enter a subreddit name or topic.' };
  }

  const cleanSub = topic.startsWith('r/') ? topic : `r/${topic.replace(/\s+/g, '')}`;
  const audience = params.audience?.trim() || 'community members';

  const templates: { title: string; angle: string; type: string }[] = [
    // Discussions
    {
      title: `What is the single best investment under $50 you've made for ${topic}?`,
      angle: `An inviting discussion post for ${cleanSub} that encourages ${audience} to share high-utility gear recommendations without self-promotion.`,
      type: 'Discussion',
    },
    {
      title: `What is one common piece of advice in ${topic} that you think is completely wrong?`,
      angle: `A contrarian debate prompt for ${cleanSub} that sparks passionate opinions, debunking misconceptions, and nuanced community discussion.`,
      type: 'Discussion',
    },
    {
      title: `Where do you see the ${topic} landscape heading over the next 2-3 years?`,
      angle: `A forward-looking macro discussion prompt for ${cleanSub} tracking industry shifts, emerging standards, and trend predictions.`,
      type: 'Discussion',
    },
    {
      title: `What is the most overrated feature or trend in ${topic} right now?`,
      angle: `A grounded consumer critique for ${cleanSub} that invites members to vent about hyped features that deliver low real-world value.`,
      type: 'Discussion',
    },
    {
      title: `Unpopular opinion: Simpler workflows in ${topic} beat complex modern setups every time`,
      angle: `A philosophical community debate for ${cleanSub} celebrating minimalism and reducing cognitive overhead.`,
      type: 'Discussion',
    },
    {
      title: `What is the biggest compromise you made when designing your ${topic} routine?`,
      angle: `A practical trade-offs thread for ${cleanSub} helping peers balance budget, time, and performance expectations.`,
      type: 'Discussion',
    },
    {
      title: `How has your philosophy toward ${topic} changed after years of experience?`,
      angle: `A reflective discussion prompt for ${cleanSub} inviting senior contributors and veterans to share wisdom with newcomers.`,
      type: 'Discussion',
    },
    {
      title: `What is one rule or standard in ${topic} that you knowingly violate on purpose?`,
      angle: `A lighthearted, honest confessional thread for ${cleanSub} that humanizes practitioners and sparks lively comments.`,
      type: 'Discussion',
    },
    {
      title: `What does the average person outside of ${topic} completely misunderstand?`,
      angle: `An observational thread for ${cleanSub} analyzing public misconceptions and niche industry realities.`,
      type: 'Discussion',
    },
    {
      title: `If you could change one fundamental thing about ${topic}, what would it be?`,
      angle: `A broad brainstorming question for ${cleanSub} that surfaces creative wishlist ideas and systemic pain points.`,
      type: 'Discussion',
    },

    // Guides
    {
      title: `Beginner's breakdown: 5 things I wish someone had explained when I first started ${topic}`,
      angle: `A structured, high-value guide for ${cleanSub} tailored to help newer ${audience} avoid classic pitfalls and costly beginner errors.`,
      type: 'Guide',
    },
    {
      title: `Complete checklist: How to audit and optimize your ${topic} setup in 30 minutes`,
      angle: `An actionable, step-by-step checklist guide for ${cleanSub} with zero external affiliate links to maximize community trust.`,
      type: 'Guide',
    },
    {
      title: `The 3 biggest myths about ${topic} that hold beginners back`,
      angle: `An educational myth-busting guide for ${cleanSub} clarifying fundamental principles with clear practical examples.`,
      type: 'Guide',
    },
    {
      title: `Troubleshooting 101: A decision tree for the most common ${topic} errors`,
      angle: `A reference flowchart guide for ${cleanSub} that members can save and reference whenever their setup misbehaves.`,
      type: 'Guide',
    },
    {
      title: `Budget vs Mid-tier vs End-game: Practical tiers for ${topic} gear and tools`,
      angle: `A realistic price-to-performance matrix guide for ${cleanSub} preventing users from overspending on diminishing returns.`,
      type: 'Guide',
    },
    {
      title: `How to build a sustainable daily ${topic} habit without burning out`,
      angle: `A behavioral productivity guide for ${cleanSub} focusing on small incremental improvements and consistent practice.`,
      type: 'Guide',
    },
    {
      title: `Mastering the fundamentals: Why basics matter more than fancy tricks in ${topic}`,
      angle: `A craftsmanship-first tutorial for ${cleanSub} breaking down core mechanics that separate amateurs from pros.`,
      type: 'Guide',
    },
    {
      title: `Step-by-step audit: How to clean up and organize your ${topic} workspace`,
      angle: `A tactical maintenance guide for ${cleanSub} keeping equipment and digital assets functioning reliably.`,
      type: 'Guide',
    },
    {
      title: `Safety & Longevity: How to prevent wear and tear in your ${topic} setup`,
      angle: `A preventative care guide for ${cleanSub} saving community members money over the long term.`,
      type: 'Guide',
    },
    {
      title: `Essential glossary: Demystifying jargon and acronyms across ${topic}`,
      angle: `An indispensable newcomer primer for ${cleanSub} deciphering complex terms into simple plain English.`,
      type: 'Guide',
    },

    // Advice
    {
      title: `How do you handle burnout or plateaus when working on ${topic}?`,
      angle: `An honest, empathetic advice request for ${cleanSub} that invites personal troubleshooting techniques, mental frameworks, and routine resets.`,
      type: 'Advice',
    },
    {
      title: `Am I overthinking this? Seeking community feedback on my approach to ${topic}`,
      angle: `A collaborative peer-review post for ${cleanSub} presenting a specific scenario and welcoming constructive critique.`,
      type: 'Advice',
    },
    {
      title: `Looking for recommendations: Best offline resources or books for mastering ${topic}`,
      angle: `A focused recommendation request for ${cleanSub} seeking curated reading lists from experienced ${audience}.`,
      type: 'Advice',
    },
    {
      title: `How do you balance time spent on ${topic} with work and family commitments?`,
      angle: `A lifestyle advice prompt for ${cleanSub} exploring pragmatic time management and boundary setting.`,
      type: 'Advice',
    },
    {
      title: `Transitioning from amateur to professional in ${topic}: What surprised you most?`,
      angle: `A mentorship advice thread for ${cleanSub} gathering career transitions and freelance realities.`,
      type: 'Advice',
    },
    {
      title: `What is the best way to introduce a friend or kid to ${topic} without overwhelming them?`,
      angle: `A pedagogical advice question for ${cleanSub} sharing engaging starter exercises and bite-sized challenges.`,
      type: 'Advice',
    },
    {
      title: `How do you organize your project files, parts, or notes for ${topic}?`,
      angle: `An organizational workflow advice prompt for ${cleanSub} swapping folder structures and storage systems.`,
      type: 'Advice',
    },
    {
      title: `Is it time to upgrade or keep practicing with what I have? Evaluating my ${topic} setup`,
      angle: `A gear acquisition syndrome (GAS) reality-check post for ${cleanSub} helping members make rational choices.`,
      type: 'Advice',
    },
    {
      title: `How do you recover after making a devastating mistake on a ${topic} project?`,
      angle: `A resilience advice thread for ${cleanSub} offering emotional recovery frameworks and technical salvaging tips.`,
      type: 'Advice',
    },
    {
      title: `What questions should I ask before hiring a coach, mentor, or service in ${topic}?`,
      angle: `A consumer-protection advice guide for ${cleanSub} vetting providers and avoiding predatory courses.`,
      type: 'Advice',
    },

    // Stories
    {
      title: `My biggest failure with ${topic} and the expensive lesson it taught me`,
      angle: `A transparent, story-driven post for ${cleanSub} demonstrating vulnerability and real-world lessons that readers respect and upvote.`,
      type: 'Story',
    },
    {
      title: `Before vs After: A 6-month retrospective on upgrading my ${topic} workflow`,
      angle: `A detailed case-study showcase for ${cleanSub} showing actionable benchmarks, setup comparisons, and honest takeaways.`,
      type: 'Story',
    },
    {
      title: `How a lucky accident completely transformed my technique in ${topic}`,
      angle: `An entertaining serendipity narrative for ${cleanSub} exploring how unexpected errors led to breakthrough innovations.`,
      type: 'Story',
    },
    {
      title: `A 10-year journey through ${topic}: What mattered and what was complete noise`,
      angle: `A long-form decade retrospective for ${cleanSub} filtering out fads to emphasize enduring principles.`,
      type: 'Story',
    },
    {
      title: `The weekend build that almost went horribly wrong (and how I salvaged it)`,
      angle: `A suspenseful DIY problem-solving story for ${cleanSub} detailing on-the-fly improvisation and stubborn determination.`,
      type: 'Story',
    },
    {
      title: `Why I almost quit ${topic} last year, and the subtle change that brought my passion back`,
      angle: `An emotionally resonant personal essay for ${cleanSub} connecting with readers who have felt similar creative fatigue.`,
      type: 'Story',
    },
    {
      title: `From zero experience to shipping my first complete ${topic} build: A honest breakdown`,
      angle: `A realistic novice journey log for ${cleanSub} detailing hours invested, tools bought, and final outcomes.`,
      type: 'Story',
    },
    {
      title: `The story behind my custom ${topic} setup and the weird constraints that shaped it`,
      angle: `An unconventional workspace case study for ${cleanSub} showcasing creative problem-solving in cramped spaces.`,
      type: 'Story',
    },
    {
      title: `What happened when I restricted myself to basic tools for 30 days of ${topic}`,
      angle: `A forced-constraint experiment report for ${cleanSub} testing whether limitation breeds greater creativity.`,
      type: 'Story',
    },
    {
      title: `How our local community rallied together to rescue an abandoned ${topic} project`,
      angle: `An uplifting collective action narrative for ${cleanSub} celebrating teamwork and shared hobby passion.`,
      type: 'Story',
    },

    // Questions
    {
      title: `What is your favorite 'hidden gem' resource, tool, or shortcut for ${topic}?`,
      angle: `A crowd-sourced curation post for ${cleanSub} designed to build a high-signal bookmarkable resource list from ${audience}.`,
      type: 'Question',
    },
    {
      title: `What is the most underrated skill or habit in ${topic} that nobody talks about?`,
      angle: `A thoughtful exploration prompt for ${cleanSub} targeting experienced ${audience} to share deep craftsmanship nuances.`,
      type: 'Question',
    },
    {
      title: `What was the exact moment or milestone when ${topic} finally 'clicked' for you?`,
      angle: `A nostalgic milestone prompt for ${cleanSub} evoking memorable early learning breakthroughs.`,
      type: 'Question',
    },
    {
      title: `What is the strangest edge-case problem you have encountered while doing ${topic}?`,
      angle: `A technical curiosity question for ${cleanSub} inviting veteran problem solvers to share wild bug tales.`,
      type: 'Question',
    },
    {
      title: `If you could only keep three essential items for ${topic}, which three make the cut?`,
      angle: `A forced-ranking desert island question for ${cleanSub} isolating indispensable bedrock utilities.`,
      type: 'Question',
    },
    {
      title: `What is the most satisfying small win you experienced this week in ${topic}?`,
      angle: `A low-pressure celebration prompt for ${cleanSub} encouraging lurkers to share incremental micro-achievements.`,
      type: 'Question',
    },
    {
      title: `Who is the most influential creator, writer, or builder in ${topic} today?`,
      angle: `A community attribution question for ${cleanSub} honoring high-effort contributors and open-source advocates.`,
      type: 'Question',
    },
    {
      title: `What product in ${topic} looked like a gimmick at first but turned out to be genuinely amazing?`,
      angle: `A skepticism-to-advocacy review thread for ${cleanSub} uncovering surprisingly capable underdog tools.`,
      type: 'Question',
    },
    {
      title: `How do you explain what you do in ${topic} to people outside our community?`,
      angle: `A humorous, relatable communication challenge for ${cleanSub} swapping elevator pitches and funny blank stares.`,
      type: 'Question',
    },
    {
      title: `What is your ultimate dream project or holy grail milestone in ${topic}?`,
      angle: `An aspirational showcase thread for ${cleanSub} inviting members to daydream about ambitious future builds.`,
      type: 'Question',
    },
  ];

  let filtered = templates;
  if (params.postType !== 'any') {
    const matched = templates.filter((t) => t.type.toLowerCase() === params.postType.toLowerCase());
    if (matched.length > 0) {
      filtered = matched;
    }
  }

  const offset = params.variation || 0;
  const rotated = rotateArray(filtered, offset);

  // If rotated has fewer than count (e.g. if count=10), loop backfill
  const selected: typeof templates = [];
  for (let i = 0; i < params.count; i++) {
    selected.push(rotated[i % rotated.length]);
  }

  const items: RedditPostIdeaItem[] = selected.map((item, idx) => ({
    id: `post-idea-${idx + 1}`,
    title: item.title,
    angle: item.angle,
    postType: item.type,
    charCount: countUnicodeChars(item.title),
  }));

  return { items };
}

// ---------------------------------------------------------------------------
// 6. Reddit Question Generator (AskReddit / Q&A thread style <= 300 chars)
// ---------------------------------------------------------------------------
export type RedditQuestionStyle = 'any' | 'opinion' | 'advice' | 'experience' | 'debate';

export interface RedditQuestionItem {
  id: string;
  question: string;
  chars: number;
  style: string;
  withinLimit: boolean;
}

export function generateRedditQuestions(params: {
  topic: string;
  style: RedditQuestionStyle;
  count: number;
  variation?: number;
}): { items: RedditQuestionItem[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { items: [], error: 'Please enter a topic for your Reddit questions.' };
  }

  const cleanTopic = topic.replace(/^r\//, '');

  const questionsByStyle: Record<string, string[]> = {
    opinion: [
      `What is an opinion about ${cleanTopic} that would get you downvoted into oblivion?`,
      `What is something in the ${cleanTopic} community that everyone pretends to love, but actually hates?`,
      `In your opinion, what is the single most overrated trend in ${cleanTopic} right now?`,
      `What is the hill you are willing to die on when it comes to ${cleanTopic}?`,
      `What do people outside of ${cleanTopic} consistently misunderstand about it?`,
      `Which product or technique in ${cleanTopic} is worth every single penny, and which is pure hype?`,
      `If you could instantly ban one buzzword or cliche from ${cleanTopic} discussions, what would it be?`,
    ],
    advice: [
      `What is the best piece of advice you have received regarding ${cleanTopic} that actually made a difference?`,
      `If you had to start learning ${cleanTopic} from scratch today with zero budget, what would your step-by-step roadmap be?`,
      `What is the #1 mistake you see beginners make with ${cleanTopic}, and how can they prevent it?`,
      `For anyone struggling with consistency in ${cleanTopic}, what routine helped you break through?`,
      `What safety, quality, or etiquette rule in ${cleanTopic} should never be compromised?`,
      `What is the most practical shortcut you wish someone had shown you on Day 1 of ${cleanTopic}?`,
      `How do you evaluate whether a recommendation or review about ${cleanTopic} is trustworthy?`,
    ],
    experience: [
      `What was your biggest 'Oh no, what have I done' moment while working on ${cleanTopic}?`,
      `What unexpected benefit or life lesson has your journey with ${cleanTopic} brought you?`,
      `What was the breakthrough moment where ${cleanTopic} finally 'clicked' for you?`,
      `People who walked away from ${cleanTopic} and later returned: what made you come back?`,
      `What is the most bizarre or unforgettable encounter you have had related to ${cleanTopic}?`,
      `What project or milestone in ${cleanTopic} are you proudest of completing?`,
      `What surprised you the most when you transitioned from an amateur to an experienced practitioner in ${cleanTopic}?`,
    ],
    debate: [
      `Is it better to master the fundamentals of ${cleanTopic} first, or jump straight into modern tools and shortcuts?`,
      `DIY vs Buying pre-made in ${cleanTopic}: where is the sweet spot between saving money and saving time?`,
      `Has modern technology made ${cleanTopic} better or has it lost its original charm and craft?`,
      `Are paid certifications, courses, or premium gear in ${cleanTopic} worth it, or is free documentation superior?`,
      `Which school of thought in ${cleanTopic} has the strongest argument, and why?`,
      `Strict rules vs creative freedom: where should ${cleanTopic} draw the line?`,
    ],
  };

  let pool: { text: string; style: string }[] = [];

  if (params.style === 'any') {
    Object.keys(questionsByStyle).forEach((cat) => {
      questionsByStyle[cat].forEach((q) => pool.push({ text: q, style: cat }));
    });
  } else {
    const list = questionsByStyle[params.style] || questionsByStyle.opinion;
    list.forEach((q) => pool.push({ text: q, style: params.style }));
  }

  const offset = params.variation || 0;
  const rotated = rotateArray(pool, offset);

  const seen = new Set<string>();
  const items: RedditQuestionItem[] = [];

  for (let i = 0; i < rotated.length && items.length < params.count; i++) {
    const item = rotated[i];
    let qText = item.text.trim();
    if (qText.length > 300) {
      qText = qText.slice(0, 297) + '...';
    }

    if (!seen.has(qText.toLowerCase())) {
      seen.add(qText.toLowerCase());
      items.push({
        id: `q-${i + 1}`,
        question: qText,
        chars: countUnicodeChars(qText),
        style: item.style,
        withinLimit: countUnicodeChars(qText) <= 300,
      });
    }
  }

  return { items };
}

// ---------------------------------------------------------------------------
// 7. Reddit Poll Generator (question <= 300, options 2–6, duration <= 7 days)
// ---------------------------------------------------------------------------
export type RedditPollDuration = '1 day' | '3 days' | '7 days';

export interface RedditPollResult {
  question: string;
  questionChars: number;
  options: { text: string; chars: number; isWithinLimit: boolean }[];
  duration: RedditPollDuration;
  formattedText: string;
  isValid: boolean;
  errors: string[];
}

export function formatRedditPoll(params: {
  question: string;
  options: string[];
  duration: RedditPollDuration;
  includeResultsOption?: boolean;
}): RedditPollResult {
  const errors: string[] = [];
  const q = params.question.trim();
  const qChars = countUnicodeChars(q);

  if (!q) {
    errors.push('Poll question is required.');
  } else if (qChars > 300) {
    errors.push(`Poll question is ${qChars} characters (exceeds Reddit's 300-character title limit).`);
  }

  const rawOpts = params.options.map((o) => o.trim()).filter(Boolean);

  if (params.includeResultsOption && !rawOpts.some((o) => /result|curious|checking/i.test(o))) {
    rawOpts.push('View Results / Just curious');
  }

  if (rawOpts.length < 2) {
    errors.push('Reddit polls require at least 2 options.');
  } else if (rawOpts.length > 6) {
    errors.push('Reddit polls support a maximum of 6 options.');
  }

  const formattedOptions = rawOpts.map((opt) => {
    const chars = countUnicodeChars(opt);
    return {
      text: opt,
      chars,
      isWithinLimit: chars <= 120,
    };
  });

  const overLimitOptions = formattedOptions.filter((o) => !o.isWithinLimit);
  if (overLimitOptions.length > 0) {
    errors.push(`${overLimitOptions.length} option(s) exceed Reddit's 120-character option limit.`);
  }

  const optionLines = formattedOptions.map((o, idx) => `${idx + 1}. ${o.text}`).join('\n');
  const formattedText = `**Poll Question:** ${q}\n\n**Options:**\n${optionLines}\n\n**Duration:** ${params.duration}\n\n*(Note: Native Reddit polls can only be created directly on Reddit. Copy this structured outline into Reddit's Create Post -> Poll tab.)*`;

  return {
    question: q,
    questionChars: qChars,
    options: formattedOptions,
    duration: params.duration,
    formattedText,
    isValid: errors.length === 0,
    errors,
  };
}

// ---------------------------------------------------------------------------
// 8. Reddit Random Post Idea Generator (Wildcard / diverse angles — DISTINCT from Tool 5)
// ---------------------------------------------------------------------------
export interface RandomRedditPostIdeaItem {
  id: string;
  suggestedSubreddit: string;
  title: string;
  angle: string;
  category: string;
}

export function generateRandomRedditPostIdeas(params: {
  topicFilter?: string;
  count: number;
  variation?: number;
}): { items: RandomRedditPostIdeaItem[] } {
  const filter = (params.topicFilter || '').trim().toLowerCase();

  const curatedBank: RandomRedditPostIdeaItem[] = [
    {
      id: 'rnd-1',
      suggestedSubreddit: 'r/AskReddit',
      title: 'What is a small, everyday inconvenience that you are convinced could be solved tomorrow with common sense?',
      angle: 'A universally relatable prompt that rapidly accumulates hundreds of hilarious and passionate comment anecdotes.',
      category: 'General Discussion',
    },
    {
      id: 'rnd-2',
      suggestedSubreddit: 'r/LifeProTips',
      title: 'LPT: If you are hesitating on a major purchase, calculate the price in terms of your hourly wage, not dollars.',
      angle: 'A pragmatic mental model post that generates healthy personal finance debates and actionable savings stories.',
      category: 'Practical Advice',
    },
    {
      id: 'rnd-3',
      suggestedSubreddit: 'r/TodayILearned',
      title: 'TIL that the world\'s oldest operating airline has kept the same logo and identity for over a century.',
      angle: 'A fascinating historical trivia hook that invites related rabbit holes and verified sources in the comments.',
      category: 'Education / Trivia',
    },
    {
      id: 'rnd-4',
      suggestedSubreddit: 'r/UnpopularOpinion',
      title: "Most 'luxury' home appliances are significantly worse to maintain and repair than budget workhorses.",
      angle: 'A grounded consumer critique that challenges brand status symbols and invites technician reviews.',
      category: 'Hot Takes',
    },
    {
      id: 'rnd-5',
      suggestedSubreddit: 'r/DIY',
      title: 'Turned a $15 thrifted wooden crate into a modular cable-management station (Step-by-step build notes)',
      angle: 'A high-effort visual project breakdown highlighting budget constraints, mistakes made, and final results.',
      category: 'Showcase / Project',
    },
    {
      id: 'rnd-6',
      suggestedSubreddit: 'r/technology',
      title: 'Why offline-first open formats and local storage are making a massive resurgence in 2026',
      angle: 'An insightful tech trends analysis contrasting subscription fatigue against local data ownership.',
      category: 'Technology',
    },
    {
      id: 'rnd-7',
      suggestedSubreddit: 'r/Cooking',
      title: 'What is the one basic cooking technique that instantly elevated your home meals more than any recipe?',
      angle: 'A skills-focused community Q&A that surfaces real culinary fundamentals and kitchen tips.',
      category: 'Culinary',
    },
    {
      id: 'rnd-8',
      suggestedSubreddit: 'r/booksuggestions',
      title: 'Looking for fast-paced non-fiction that reads like a thriller and keeps you up past 2 AM',
      angle: 'A tightly defined recommendation request that triggers enthusiastic book suggestions from voracious readers.',
      category: 'Entertainment',
    },
    {
      id: 'rnd-9',
      suggestedSubreddit: 'r/personalfinance',
      title: 'The unexpected hidden costs of moving into a larger apartment that caught me completely off guard',
      angle: 'A transparent expense post-mortem detailing utility spikes, furnishings, and commute trade-offs.',
      category: 'Finance',
    },
    {
      id: 'rnd-10',
      suggestedSubreddit: 'r/productivity',
      title: 'How replacing complex task manager apps with a single plain text file fixed my procrastination',
      angle: 'A refreshing anti-productivity-tool reflection celebrating simplicity and reducing friction.',
      category: 'Productivity',
    },
  ];

  let pool = curatedBank;
  if (filter) {
    const matched = curatedBank.filter(
      (item) =>
        item.suggestedSubreddit.toLowerCase().includes(filter) ||
        item.title.toLowerCase().includes(filter) ||
        item.category.toLowerCase().includes(filter) ||
        item.angle.toLowerCase().includes(filter),
    );
    if (matched.length > 0) {
      pool = matched;
    }
  }

  const offset = params.variation || 0;
  const rotated = rotateArray(pool, offset);
  return { items: rotated.slice(0, params.count) };
}

// ---------------------------------------------------------------------------
// 9. Reddit Username Checker (FORMAT-ONLY — never claims live availability)
// ---------------------------------------------------------------------------
export interface RedditUsernameRuleCheck {
  id: string;
  label: string;
  passed: boolean;
  explanation: string;
  fixSuggestion?: string;
}

export interface RedditUsernameCheckResult {
  username: string;
  cleanHandle: string;
  charCount: number;
  isValid: boolean;
  rules: RedditUsernameRuleCheck[];
}

export function checkRedditUsernameFormat(rawInput: string): RedditUsernameCheckResult {
  const trimmed = rawInput.trim();
  // Strip optional u/ or /u/ prefix if typed
  const clean = trimmed.replace(/^(\/)?u\//i, '');
  const charCount = countUnicodeChars(clean);

  const lengthPassed = charCount >= 3 && charCount <= 20;
  const noSpacesPassed = clean.length > 0 && !/\s/.test(clean);
  const allowedCharsPassed = clean.length > 0 && /^[a-zA-Z0-9_-]+$/.test(clean);
  const edgeCharsPassed = clean.length > 0 && !/^[-_]/.test(clean) && !/[-_]$/.test(clean);

  const rules: RedditUsernameRuleCheck[] = [
    {
      id: 'length',
      label: 'Length between 3 and 20 characters',
      passed: lengthPassed,
      explanation: lengthPassed
        ? `Username is ${charCount} character(s) long (meets the 3–20 character constraint).`
        : charCount < 3
          ? `Username is too short (${charCount} char). Reddit usernames must be at least 3 characters long.`
          : `Username is too long (${charCount} chars). Reddit usernames cannot exceed 20 characters.`,
      fixSuggestion: charCount < 3
        ? 'Add more letters or numbers to reach at least 3 characters.'
        : charCount > 20
          ? 'Shorten or abbreviate words to fit within 20 characters.'
          : undefined,
    },
    {
      id: 'allowed-chars',
      label: 'Letters, numbers, underscores, and hyphens only',
      passed: allowedCharsPassed,
      explanation: allowedCharsPassed
        ? 'Only letters (a–z), numbers (0–9), underscores (_), and hyphens (-) are used.'
        : 'Contains forbidden characters (such as punctuation, emojis, periods, or special symbols).',
      fixSuggestion: !allowedCharsPassed
        ? 'Remove all symbols, emojis, and punctuation except underscores and hyphens.'
        : undefined,
    },
    {
      id: 'no-spaces',
      label: 'No spaces anywhere',
      passed: noSpacesPassed,
      explanation: noSpacesPassed
        ? 'No spaces found.'
        : 'Reddit usernames cannot contain spaces.',
      fixSuggestion: !noSpacesPassed
        ? 'Remove spaces or replace spaces with hyphens (-) or underscores (_).'
        : undefined,
    },
    {
      id: 'edge-chars',
      label: 'Cannot start or end with a hyphen or underscore',
      passed: edgeCharsPassed,
      explanation: edgeCharsPassed
        ? 'Does not start or end with a hyphen or underscore.'
        : /^[-_]/.test(clean)
          ? 'Username cannot begin with a hyphen or underscore.'
          : 'Username cannot end with a hyphen or underscore.',
      fixSuggestion: !edgeCharsPassed
        ? 'Begin and end your username with an alphanumeric letter or number.'
        : undefined,
    },
  ];

  const isValid = rules.every((r) => r.passed);

  return {
    username: rawInput,
    cleanHandle: clean,
    charCount,
    isValid,
    rules,
  };
}

// ---------------------------------------------------------------------------
// 10. Reddit Text to Markdown Converter
// ---------------------------------------------------------------------------
export function convertTextToRedditMarkdown(
  rawText: string,
  options: {
    autoLineBreaks: boolean;
    convertEmphasis: boolean;
    convertLists: boolean;
    convertTables: boolean;
  },
): string {
  if (!rawText.trim()) return '';

  const lines = rawText.split(/\r?\n/);
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Table detection (lines with tab or multiple commas/pipes)
    if (options.convertTables && (line.includes('\t') || (line.includes(',') && lines[i + 1]?.includes(',')))) {
      const delimiter = line.includes('\t') ? '\t' : ',';
      const cells = line.split(delimiter).map((c) => c.trim());
      if (cells.length >= 2) {
        line = `| ${cells.join(' | ')} |`;
        // If this is the header row, inject markdown separator
        if (processedLines.length === 0 || !processedLines[processedLines.length - 1].startsWith('|')) {
          const sep = `| ${cells.map(() => '---').join(' | ')} |`;
          processedLines.push(line);
          processedLines.push(sep);
          continue;
        }
      }
    }

    // Convert list markers (e.g. • or - into standard markdown list)
    if (options.convertLists) {
      if (/^\s*[•*]\s+/.test(line)) {
        line = line.replace(/^\s*[•*]\s+/, '- ');
      } else if (/^\s*\d+[\.\)]\s+/.test(line)) {
        line = line.replace(/^\s*(\d+)[\.\)]\s+/, '$1. ');
      }
    }

    // Convert emphasis conventions
    if (options.convertEmphasis) {
      // Convert _italic_ or ~strikethrough~
      line = line.replace(/~([^~]+)~/g, '~~$1~~');
    }

    processedLines.push(line);
  }

  // Reddit line breaks normalization: Reddit requires a blank line between paragraphs
  if (options.autoLineBreaks) {
    const result: string[] = [];
    for (let i = 0; i < processedLines.length; i++) {
      const cur = processedLines[i];
      const prev = processedLines[i - 1];

      // If both lines are non-empty text (and neither is a list or table row), ensure blank line between them
      if (
        i > 0 &&
        cur.trim() &&
        prev?.trim() &&
        !cur.startsWith('- ') &&
        !cur.startsWith('* ') &&
        !cur.startsWith('|') &&
        !/^\d+\.\s/.test(cur) &&
        !prev.startsWith('|')
      ) {
        result.push('');
      }
      result.push(cur);
    }
    return result.join('\n');
  }

  return processedLines.join('\n');
}

// ---------------------------------------------------------------------------
// 11. Reddit Markdown to HTML Converter
// ---------------------------------------------------------------------------
export function convertRedditMarkdownToHtml(markdown: string): { html: string; error?: string } {
  if (!markdown.trim()) {
    return { html: '', error: 'Please paste Reddit Markdown to convert to HTML.' };
  }

  try {
    const lines = markdown.split(/\r?\n/);
    const htmlLines: string[] = [];
    let inList: 'ul' | 'ol' | null = null;
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableBuffer: string[] = [];

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const parseInline = (text: string): string => {
      let s = escapeHtml(text);

      // Spoilers: >!spoiler text!<
      s = s.replace(/&gt;!(.+?)!&lt;/g, '<span class="reddit-spoiler" title="Click to reveal spoiler">$1</span>');

      // Inline code `code`
      s = s.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-sm">$1</code>');

      // Bold & Italic: ***text***
      s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

      // Bold: **text**
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // Italic: *text* or _text_
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      s = s.replace(/(^|\s)_([^_]+)_(\s|$)/g, '$1<em>$2</em>$3');

      // Strikethrough: ~~text~~
      s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');

      // Links: [text](url)
      s = s.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>',
      );

      return s;
    };

    const flushTable = () => {
      if (!inTable || tableBuffer.length === 0) return;
      const rows = tableBuffer.map((r) =>
        r
          .split('|')
          .map((c) => c.trim())
          .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1),
      );

      let tableHtml = '<table class="min-w-full border-collapse border border-slate-300 dark:border-slate-700 my-4 text-sm">\n';
      if (rows.length > 0) {
        tableHtml += '  <thead>\n    <tr class="bg-slate-100 dark:bg-slate-800">\n';
        rows[0].forEach((head) => {
          tableHtml += `      <th class="border border-slate-300 dark:border-slate-700 p-2 font-semibold text-left">${parseInline(head)}</th>\n`;
        });
        tableHtml += '    </tr>\n  </thead>\n';

        if (rows.length > 2) {
          tableHtml += '  <tbody>\n';
          // Skip header row and separator row
          for (let i = 2; i < rows.length; i++) {
            tableHtml += '    <tr>\n';
            rows[i].forEach((cell) => {
              tableHtml += `      <td class="border border-slate-300 dark:border-slate-700 p-2">${parseInline(cell)}</td>\n`;
            });
            tableHtml += '    </tr>\n';
          }
          tableHtml += '  </tbody>\n';
        }
      }
      tableHtml += '</table>';
      htmlLines.push(tableHtml);
      tableBuffer = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks ```
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          htmlLines.push(`<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-3"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Tables | col | col |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableBuffer.push(line.trim());
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Close open list if line is not a list item
      const isUl = /^\s*[-*]\s+(.+)/.test(line);
      const isOl = /^\s*\d+\.\s+(.+)/.test(line);

      if (!isUl && inList === 'ul') {
        htmlLines.push('</ul>');
        inList = null;
      }
      if (!isOl && inList === 'ol') {
        htmlLines.push('</ol>');
        inList = null;
      }

      if (!line.trim()) {
        continue;
      }

      // Headings # ## ###
      if (/^###\s+(.+)/.test(line)) {
        htmlLines.push(`<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">${parseInline(line.replace(/^###\s+/, ''))}</h3>`);
        continue;
      }
      if (/^##\s+(.+)/.test(line)) {
        htmlLines.push(`<h2 class="text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2">${parseInline(line.replace(/^##\s+/, ''))}</h2>`);
        continue;
      }
      if (/^#\s+(.+)/.test(line)) {
        htmlLines.push(`<h1 class="text-xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3">${parseInline(line.replace(/^#\s+/, ''))}</h1>`);
        continue;
      }

      // Whole-line or stand-alone spoiler: >!spoiler!<
      if (/^>!.*!<$/.test(line.trim())) {
        htmlLines.push(`<p class="my-2 leading-relaxed text-slate-800 dark:text-slate-200">${parseInline(line.trim())}</p>`);
        continue;
      }

      // Blockquote > (exclude spoiler >!)
      if (/^>(?!!)\s*(.*)/.test(line)) {
        htmlLines.push(`<blockquote class="border-l-4 border-orange-500 pl-4 py-1 italic text-slate-700 dark:text-slate-300 my-2">${parseInline(line.replace(/^>\s*/, ''))}</blockquote>`);
        continue;
      }

      // Bullet List
      if (isUl) {
        if (inList !== 'ul') {
          htmlLines.push('<ul class="list-disc list-inside space-y-1 my-2 pl-2">');
          inList = 'ul';
        }
        const match = line.match(/^\s*[-*]\s+(.+)/);
        htmlLines.push(`  <li>${parseInline(match ? match[1] : '')}</li>`);
        continue;
      }

      // Numbered List
      if (isOl) {
        if (inList !== 'ol') {
          htmlLines.push('<ol class="list-decimal list-inside space-y-1 my-2 pl-2">');
          inList = 'ol';
        }
        const match = line.match(/^\s*\d+\.\s+(.+)/);
        htmlLines.push(`  <li>${parseInline(match ? match[1] : '')}</li>`);
        continue;
      }

      // Standard paragraph
      htmlLines.push(`<p class="my-2 leading-relaxed text-slate-800 dark:text-slate-200">${parseInline(line)}</p>`);
    }

    if (inCodeBlock) {
      htmlLines.push(`<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-3"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
    }
    if (inTable) {
      flushTable();
    }
    if (inList === 'ul') htmlLines.push('</ul>');
    if (inList === 'ol') htmlLines.push('</ol>');

    return { html: htmlLines.join('\n') };
  } catch (err) {
    return { html: '', error: `Failed to convert markdown: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// ---------------------------------------------------------------------------
// 12. Reddit Content Calendar Generator
// ---------------------------------------------------------------------------
export type RedditCalendarCadence = 2 | 3 | 5 | 7;
export type RedditContentMix = 'any' | 'questions' | 'discussions' | 'guides' | 'stories' | 'mixed';

export interface RedditCalendarDay {
  dayIndex: number; // 1-7
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string; // e.g. Monday
  postTitle: string;
  postType: string;
  strategicAngle: string;
  targetSubreddit: string;
}

export function generateRedditCalendar(params: {
  topic: string;
  postsPerWeek: RedditCalendarCadence;
  startDate: string;
  contentMix: RedditContentMix;
  variation?: number;
}): { days: RedditCalendarDay[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { days: [], error: 'Please enter a target topic or subreddit.' };
  }

  const rawDate = params.startDate ? new Date(params.startDate + 'T00:00:00') : new Date();
  if (isNaN(rawDate.getTime())) {
    return { days: [], error: 'Please select a valid start date.' };
  }

  const cleanSub = topic.startsWith('r/') ? topic : `r/${topic.replace(/\s+/g, '')}`;

  const dayTemplates: { title: string; type: string; angle: string }[] = [
    {
      title: `[Weekly Discussion] What did you accomplish with ${topic} this week?`,
      type: 'Discussion',
      angle: 'Community progress megathread that builds regular engagement and peer support.',
    },
    {
      title: `What is the biggest myth about ${topic} that needs to die?`,
      angle: 'Debate starter addressing common newcomer misconceptions and high-effort replies.',
      type: 'Debate',
    },
    {
      title: `Beginner Roadmap: 5 free resources that actually helped me understand ${topic}`,
      angle: 'High-signal bookmarkable guide with zero affiliate links to build community trust.',
      type: 'Guide',
    },
    {
      title: `Quick Question: What tool, shortcut, or setting in ${topic} saved you the most time?`,
      angle: 'Low-friction comment prompt that gets readers dropping instant practical recommendations.',
      type: 'Question',
    },
    {
      title: `Showcase: My honest review of working with ${topic} after 6 months`,
      angle: 'Personal case study detailing realistic expectations, costs, and key takeaways.',
      type: 'Story',
    },
    {
      title: `Troubleshooting Saturday: Drop your trickiest ${topic} questions below`,
      angle: 'Weekend Q&A clinic where power users help newcomers solve stubborn hurdles.',
      type: 'Help / Q&A',
    },
    {
      title: `Sunday Retrospective: 1 thing I wish I knew before investing in ${topic}`,
      angle: 'Reflective personal story that resonates strongly with lurkers and active voters.',
      type: 'Advice',
    },
  ];

  const offset = params.variation || 0;
  const rotated = rotateArray(dayTemplates, offset);

  // Active days indices based on cadence (e.g. 2 posts: Monday & Thursday; 3 posts: Mon, Wed, Fri; etc.)
  let activeIndices: number[];
  if (params.postsPerWeek === 2) activeIndices = [0, 3];
  else if (params.postsPerWeek === 3) activeIndices = [0, 2, 4];
  else if (params.postsPerWeek === 5) activeIndices = [0, 1, 2, 3, 4];
  else activeIndices = [0, 1, 2, 3, 4, 5, 6];

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const days: RedditCalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(rawDate);
    curDate.setDate(rawDate.getDate() + i);

    const isPostDay = activeIndices.includes(i);
    const dayOfWeek = weekdayNames[curDate.getDay()];
    const yyyy = curDate.getFullYear();
    const mm = String(curDate.getMonth() + 1).padStart(2, '0');
    const dd = String(curDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    if (isPostDay) {
      const template = rotated[i % rotated.length];
      days.push({
        dayIndex: i + 1,
        dateString: dateStr,
        dayOfWeek,
        postTitle: template.title,
        postType: template.type,
        strategicAngle: template.angle,
        targetSubreddit: cleanSub,
      });
    } else {
      days.push({
        dayIndex: i + 1,
        dateString: dateStr,
        dayOfWeek,
        postTitle: 'Rest / Community Interaction Day (Browse, upvote, and comment on peers\' posts)',
        postType: 'Lurking & Feedback',
        strategicAngle: 'Participate authentically in comments to keep Reddit account ratios healthy.',
        targetSubreddit: cleanSub,
      });
    }
  }

  return { days };
}

export function serializeRedditCalendarCsv(days: RedditCalendarDay[]): string {
  const header = ['Day', 'Date', 'Weekday', 'Target Subreddit', 'Post Type', 'Post Title Idea', 'Strategic Angle'];
  const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const rows = days.map((d) => [
    d.dayIndex,
    d.dateString,
    d.dayOfWeek,
    d.targetSubreddit,
    d.postType,
    escapeCsv(d.postTitle),
    escapeCsv(d.strategicAngle),
  ].join(','));

  return [header.join(','), ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// 13. Reddit Markdown Formatter Toolbar Action
// ---------------------------------------------------------------------------
export type MarkdownFormatAction =
  | 'bold'
  | 'italic'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'code'
  | 'codeblock'
  | 'link'
  | 'spoiler'
  | 'bullet'
  | 'number'
  | 'table';

export function applyRedditMarkdownFormat(text: string, action: MarkdownFormatAction): string {
  const t = text || 'Sample text';
  switch (action) {
    case 'bold':
      return `**${t}**`;
    case 'italic':
      return `*${t}*`;
    case 'h1':
      return `# ${t}`;
    case 'h2':
      return `## ${t}`;
    case 'h3':
      return `### ${t}`;
    case 'quote':
      return t
        .split('\n')
        .map((l) => `> ${l}`)
        .join('\n');
    case 'code':
      return `\`${t}\``;
    case 'codeblock':
      return `\`\`\`\n${t}\n\`\`\``;
    case 'link':
      return `[${t}](https://example.com)`;
    case 'spoiler':
      return `>!${t}!<\n*(Note: ensure no space between ! and your text)*`;
    case 'bullet':
      return t
        .split('\n')
        .map((l) => (l.trim() ? `- ${l.trim()}` : l))
        .join('\n');
    case 'number':
      return t
        .split('\n')
        .filter(Boolean)
        .map((l, i) => `${i + 1}. ${l.trim()}`)
        .join('\n');
    case 'table':
      return `| Category | Description | Status |\n|---|---|---|\n| Setup | ${t} | Verified |\n| Feature | Core utilities | Active |`;
    default:
      return t;
  }
}

// ---------------------------------------------------------------------------
// 14. Reddit Text Formatter Operations
// ---------------------------------------------------------------------------
export type TextFormatAction =
  | 'normalizeSpacing'
  | 'titleCase'
  | 'uppercase'
  | 'lowercase'
  | 'bulletList'
  | 'removeEmptyLines';

export function formatRedditText(text: string, action: TextFormatAction): string {
  if (!text) return '';

  switch (action) {
    case 'normalizeSpacing': {
      // Normalizes single-line breaks into Reddit-compliant double line breaks
      const cleanLines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      return cleanLines.join('\n\n');
    }
    case 'titleCase': {
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    case 'uppercase': {
      return text.toUpperCase();
    }
    case 'lowercase': {
      return text.toLowerCase();
    }
    case 'bulletList': {
      return text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `- ${l}`)
        .join('\n');
    }
    case 'removeEmptyLines': {
      return text
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0)
        .join('\n');
    }
    default:
      return text;
  }
}

// ---------------------------------------------------------------------------
// 15 & 16. Character Counter Limits
// ---------------------------------------------------------------------------
export const REDDIT_LIMITS = {
  postTitle: 300,
  postBody: 40000,
  comment: 10000,
  subredditNameMin: 3,
  subredditNameMax: 21,
  usernameMin: 3,
  usernameMax: 20,
  subredditDescription: 500,
  flair: 64,
  pollOption: 120,
} as const;

// ---------------------------------------------------------------------------
// 17. Reddit Karma Calculator (diminishing return curve simulation)
// ---------------------------------------------------------------------------
export function calculateRedditKarma(params: {
  postUpvotes: number;
  commentUpvotes: number;
}): {
  estimatedKarma: number;
  postKarma: number;
  commentKarma: number;
  ratioNote: string;
} {
  const p = Math.max(0, Math.floor(params.postUpvotes));
  const c = Math.max(0, Math.floor(params.commentUpvotes));

  // Diminishing logarithmic model for Reddit karma
  // Early upvotes (1-100) are near 1:1, then diminishing returns kick in
  const postKarma = p <= 100 ? p : Math.round(100 + Math.pow(p - 100, 0.82));
  const commentKarma = c <= 500 ? c : Math.round(500 + Math.pow(c - 500, 0.9));
  const total = postKarma + commentKarma;

  const ratioNote =
    p > 1000
      ? 'High vote volume experiences non-linear diminishing returns per Reddit community benchmarks.'
      : 'Low-to-moderate vote volume scales close to 1:1 with karma.';

  return {
    estimatedKarma: total,
    postKarma,
    commentKarma,
    ratioNote,
  };
}

// ---------------------------------------------------------------------------
// 18. Reddit Comment Picker (Random winners strictly from pasted comments)
// ---------------------------------------------------------------------------
export function pickRedditCommentWinners(params: {
  rawText: string;
  winnerCount: number;
  backupCount: number;
  removeDuplicates: boolean;
  filterKeyword?: string;
}): {
  winners: string[];
  backups: string[];
  totalEligible: number;
  duplicateCount: number;
  error?: string;
} {
  const lines = params.rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      winners: [],
      backups: [],
      totalEligible: 0,
      duplicateCount: 0,
      error: 'Please paste comments or u/usernames (one per line).',
    };
  }

  const keyword = (params.filterKeyword || '').trim().toLowerCase();

  // Filter by keyword if provided
  let filtered = keyword ? lines.filter((line) => line.toLowerCase().includes(keyword)) : lines;

  if (filtered.length === 0) {
    return {
      winners: [],
      backups: [],
      totalEligible: 0,
      duplicateCount: 0,
      error: `No comments matched the required keyword "${params.filterKeyword}".`,
    };
  }

  let duplicateCount = 0;
  if (params.removeDuplicates) {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const item of filtered) {
      // Normalize handle for comparison if it starts with u/
      const normalized = item.toLowerCase().replace(/^\/?u\//, '');
      if (seen.has(normalized)) {
        duplicateCount++;
      } else {
        seen.add(normalized);
        unique.push(item);
      }
    }
    filtered = unique;
  }

  // Shuffle using browser crypto
  const pool = [...filtered];
  for (let i = pool.length - 1; i > 0; i--) {
    let randIndex = 0;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      randIndex = arr[0] % (i + 1);
    } else {
      randIndex = Math.floor(Math.random() * (i + 1));
    }
    const temp = pool[i];
    pool[i] = pool[randIndex];
    pool[randIndex] = temp;
  }

  const winnersNeeded = Math.min(params.winnerCount, pool.length);
  const winners = pool.slice(0, winnersNeeded);

  const remaining = pool.slice(winnersNeeded);
  const backupsNeeded = Math.min(params.backupCount, remaining.length);
  const backups = remaining.slice(0, backupsNeeded);

  return {
    winners,
    backups,
    totalEligible: filtered.length,
    duplicateCount,
  };
}
