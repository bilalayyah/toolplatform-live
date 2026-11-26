// Pure deterministic, template- and rule-based generators for the 16 rebuilt Facebook text tools.
// ZERO AI, ZERO network calls, ZERO invented facts or guarantees.

export interface GeneratorResult<T = string> {
  items: T[];
  errors: string[];
  warnings: string[];
  note?: string;
}

function cleanText(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

function titleCasePhrase(raw: string): string {
  return cleanText(raw)
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function rotateSlice<T>(pool: T[], count: number, batch: number): T[] {
  if (pool.length === 0) return [];
  const shift = (batch * count) % pool.length;
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    out.push(pool[(shift + i) % pool.length]);
  }
  return out;
}

function extractKeyTerms(text: string): string[] {
  const stop = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must',
    'can', 'this', 'that', 'these', 'those', 'it', 'its', 'my', 'your', 'our', 'their',
    'we', 'you', 'they', 'i', 'me', 'us', 'them', 'just', 'very', 'so', 'really', 'about',
    'into', 'over', 'out', 'up', 'down', 'more', 'most', 'some', 'any', 'all', 'not', 'no',
  ]);
  const words = cleanText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stop.has(w));
  return [...new Set(words)];
}

function sanitizeTopicPhrase(text: string, maxLen = 70): string {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?-]+$/, '');
}

// ============================================================================
// 1. Facebook Post Caption Generator
// ============================================================================
export type PostCaptionTone = 'Friendly' | 'Professional' | 'Funny' | 'Inspirational';
export type PostCaptionGoal = 'Engagement' | 'Inform' | 'Promote' | 'Celebrate';
export type PostCaptionLength = 'Short' | 'Medium' | 'Long';

export interface PostCaptionParams {
  topic: string;
  audience?: string;
  tone: PostCaptionTone;
  goal: PostCaptionGoal;
  length: PostCaptionLength;
  count: 3 | 5;
  cta?: string;
  batch?: number;
}

export function generatePostCaptions(params: PostCaptionParams): GeneratorResult<string> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a post topic or subject to generate captions.'], warnings: []};
  }
  const audience = cleanText(params.audience || '');
  const cta = cleanText(params.cta || '');
  const batch = params.batch ?? 0;

  const audPrefix = audience ? `For ${audience}, ` : '';
  const audClause = audience ? ` (especially if you're ${audience.toLowerCase()})` : '';
  const defaultCtaByGoal: Record<PostCaptionGoal, string> = {
    Engagement: `What has your experience with ${topic} been? Share in the comments below.`,
    Inform: `Save this post for reference and let us know which part of ${topic} you want covered next.`,
    Promote: `Send us a message or check our Page link if you'd like help with ${topic}.`,
    Celebrate: `Drop a comment to share your favorite milestone or win around ${topic}!`,
  };
  const closingCta = cta || defaultCtaByGoal[params.goal];

  const hooksByTone: Record<PostCaptionTone, string[]> = {
    Friendly: [
      `Quick note for everyone thinking about ${topic} this week:`,
      `Let's talk honestly about ${topic}${audClause}.`,
      `Something helpful came up around ${topic}, and I wanted to share it here:`,
      `If ${topic} has been on your to-do list lately, take two minutes for this.`,
      `Here is a simple way we have been looking at ${topic} lately.`,
      `Curious how you handle ${topic} day to day?`,
      `A small reminder on ${topic} that saved us plenty of guesswork:`,
    ],
    Professional: [
      `A practical perspective on ${topic}:`,
      `${audPrefix}here is what matters most when approaching ${topic}.`,
      `Three takeaways we keep seeing around ${topic}:`,
      `When planning around ${topic}, clarity beats complexity every time.`,
      `Let's break down ${topic} into steps your team can apply right away.`,
      `An important update for anyone focused on ${topic}:`,
      `Why consistency with ${topic} pays off over the long run:`,
    ],
    Funny: [
      `Plot twist: ${topic} sounded easy until we actually tried it on a Monday.`,
      `Raise your hand if ${topic} turned into a "quick 5-minute task" that took an hour.`,
      `Me thinking I have ${topic} figured out vs. reality five minutes later:`,
      `Hot take on ${topic}: half of us are just improvising and hoping for the best.`,
      `Before you overthink ${topic} again today, hear me out:`,
      `Nobody warned us that ${topic} comes with this much trial and error.`,
      `Confession time: how many tabs do you currently have open about ${topic}?`,
    ],
    Inspirational: [
      `Small, steady steps in ${topic} add up faster than you realize.`,
      `Every person who gets good at ${topic} started right where you are today.`,
      `Do not underestimate how much progress one focused week on ${topic} can bring.`,
      `Growth with ${topic} rarely happens overnight—it happens in the quiet daily reps.`,
      `Here is your reminder to keep going with ${topic}, even when progress feels slow.`,
      `You do not need perfection to make real headway with ${topic}.`,
      `Looking back, showing up consistently for ${topic} made all the difference.`,
    ],
  };

  const bodiesByGoal: Record<PostCaptionGoal, string[]> = {
    Engagement: [
      `${audPrefix}everyone seems to have a different routine for ${topic}. Some people start with a strict checklist, while others learn as they go.`,
      `When people ask about ${topic}, the details that help most are usually the small everyday lessons—not the textbook theory.`,
      `We noticed two very different camps when it comes to ${topic}: keeping things minimal vs. customizing every detail.`,
      `Whether you are just getting started with ${topic} or refining what already works, hearing real stories from this community helps everyone.`,
      `There is no single "right" setup for ${topic}, which is why comparing notes with other people here is so useful.`,
      `Most breakthroughs around ${topic} start with one simple tweak you try consistently for a week.`,
      `The best tips on ${topic} rarely come from manuals—they come from folks testing ideas in real life.`,
    ],
    Inform: [
      `Understanding ${topic} gets much easier once you focus on the fundamentals first and ignore the extra noise.`,
      `Here are the core points worth keeping in mind for ${topic}:\n• Start with a clear goal before adding complexity\n• Keep notes on what works so you can repeat it\n• Review your progress after a full week`,
      `A common mistake with ${topic} is trying to tackle everything at once instead of locking in one reliable habit first.`,
      `To make ${topic} smoother${audClause}, break your workflow into smaller checkpoints so nothing slips through the cracks.`,
      `Paying attention to timing, clarity, and follow-through makes ${topic} noticeably easier to manage.`,
      `Keep these essentials handy whenever you revisit ${topic}: keep it clear, keep it consistent, and focus on real outcomes.`,
      `Taking five minutes to prepare ahead of time removes most of the friction around ${topic}.`,
    ],
    Promote: [
      `We built our approach to ${topic} around saving time and keeping things straightforward${audClause}.`,
      `If ${topic} has felt overwhelming or time-consuming, having a clear, reliable resource changes the entire experience.`,
      `Everything we put together for ${topic} is designed to help you get cleaner results without extra back-and-forth.`,
      `From first setup to finishing touches, we focus on making ${topic} practical, dependable, and easy to use.`,
      `Instead of piecing ${topic} together from scattered notes, you can follow one clean process from start to finish.`,
      `We put real care into every detail of our ${topic} offering so you can move forward with confidence.`,
      `Looking for a simpler path on ${topic}? Here is how we help make the next step easier.`,
    ],
    Celebrate: [
      `Reaching a meaningful moment with ${topic} takes patience, late adjustments, and plenty of encouragement along the way.`,
      `We are genuinely grateful for everyone who supported, shared feedback, and helped shape this ${topic} milestone.`,
      `Moments like this around ${topic} remind us why building alongside a supportive community matters so much.`,
      `What started as a simple idea around ${topic} turned into something worth pausing to appreciate today.`,
      `A huge thank-you goes out to everyone who stuck with us through every chapter of ${topic}.`,
      `Celebrating progress with ${topic} feels even better when we get to share the moment right here with you.`,
      `Cheers to the effort, lessons, and teamwork behind every step forward in ${topic}.`,
    ],
  };

  const mediumExtras: string[] = [
    `What helped most was keeping expectations realistic and focusing on one clear improvement at a time.`,
    `Even a ten-minute reset around ${topic} can turn a messy week back into a focused one.`,
    `The biggest difference comes when ${topic} fits naturally into your actual routine rather than fighting against it.`,
    `Little adjustments compound quickly when you review what worked and refine what felt clunky.`,
    `Having a few grounded people to bounce ${topic} questions off makes the learning curve much lighter.`,
    `Simple habits beat complicated plans almost every day of the week.`,
    `Take what fits your situation, leave what does not, and keep testing steadily.`,
  ];

  const longExtras: string[] = [
    `Three quick questions to ask yourself this week:\n1. What is one part of ${topic} I can simplify right away?\n2. Where am I spending energy without seeing much return?\n3. What small step can I finish before Friday?`,
    `If you are sharing ${topic} with others${audClause}, remember that plain, honest examples resonate far more than polished buzzwords.`,
    `Here is a mini-checklist worth bookmarking:\n✓ Define what "good enough" looks like for ${topic}\n✓ Cut unnecessary steps\n✓ Ask for feedback early`,
    `Most people skip the review step on ${topic}, yet that five-minute check-in is where the clearest improvements show up.`,
    `Try writing down one lesson you learned about ${topic} this month—you might be surprised how helpful it is to someone else reading this.`,
    `Give yourself room to experiment, track what feels sustainable, and build from there.`,
    `Community conversations like this are where practical ideas get shared, tested, and improved together.`,
  ];

  const hooks = hooksByTone[params.tone];
  const bodies = bodiesByGoal[params.goal];
  const poolSize = hooks.length;
  const indices: number[] = [];
  for (let i = 0; i < poolSize; i++) {
    indices.push((i + batch * params.count) % poolSize);
  }

  const items: string[] = [];
  for (let k = 0; k < params.count; k++) {
    const hIdx = indices[k % indices.length];
    const bIdx = (indices[k % indices.length] + k + batch) % bodies.length;
    const mIdx = (hIdx + k * 2 + batch) % mediumExtras.length;
    const lIdx = (bIdx + k + batch) % longExtras.length;

    const parts = [hooks[hIdx], bodies[bIdx]];
    if (params.length === 'Medium' || params.length === 'Long') {
      parts.push(mediumExtras[mIdx]);
    }
    if (params.length === 'Long') {
      parts.push(longExtras[lIdx]);
    }
    parts.push(closingCta);
    items.push(parts.join('\n\n'));
  }

  return {
    items,
    errors: [],
    warnings: [],
    note: 'Template-based Facebook captions — edit personal details before posting.',
  };
}

// ============================================================================
// 2. Facebook Hashtag Generator
// ============================================================================
export interface HashtagGenParams {
  keywords: string;
  niche?: string;
  count: 5 | 10 | 15;
  batch?: number;
}

function toCamelTokens(raw: string): string[] {
  return raw
    .replace(/[^a-zA-Z0-9\s]+/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 || /^\d+$/.test(w))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function buildCamelCaseHashtagPool(keywordsRaw: string, nicheRaw = ''): string[] {
  const tokens = toCamelTokens(keywordsRaw);
  const nicheTokens = toCamelTokens(nicheRaw);
  if (!keywordsRaw || tokens.length === 0) return [];

  const primaryFull = tokens.slice(0, 4).join('');
  const primaryLead = tokens[0];
  const primaryTail = tokens.length > 1 ? tokens[tokens.length - 1] : tokens[0];
  const nicheFull = nicheTokens.slice(0, 3).join('');
  const nicheLead = nicheTokens[0] || '';

  const candidates: string[] = [];
  const pushTag = (raw: string) => {
    const clean = raw.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length < 2) return;
    const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
    candidates.push(`#${formatted}`);
  };

  pushTag(primaryFull);
  if (tokens.length >= 2) {
    for (let i = 0; i < tokens.length - 1; i++) {
      pushTag(tokens[i] + tokens[i + 1]);
    }
    tokens.forEach((t) => pushTag(t));
  }
  if (nicheFull) {
    pushTag(nicheFull);
    pushTag(primaryFull + nicheLead);
    pushTag(nicheLead + primaryLead);
  }

  const suffixes = [
    'Tips', 'Community', 'Ideas', 'Guide', 'Life', 'Hub', 'Daily', 'Updates',
    'Stories', 'Notes', 'Support', 'Basics', 'Checklist', 'Lovers', 'Club',
    'Talk', 'Insights', 'Trends', 'Resources', 'Inspiration', 'Goals', 'Network',
  ];
  const prefixes = [
    'Explore', 'Learn', 'Local', 'Daily', 'Better', 'Smart', 'Ask', 'Share', 'Real', 'Love',
  ];

  suffixes.forEach((s) => {
    pushTag(primaryFull + s);
    if (primaryLead !== primaryFull) pushTag(primaryLead + s);
    if (primaryTail !== primaryLead) pushTag(primaryTail + s);
    if (nicheFull) pushTag(nicheFull + s);
  });

  prefixes.forEach((p) => {
    pushTag(p + primaryFull);
    if (nicheFull) pushTag(p + nicheFull);
  });

  const seen = new Set<string>();
  const uniquePool: string[] = [];
  for (const tag of candidates) {
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniquePool.push(tag);
    }
  }
  return uniquePool;
}

export function generateCamelCaseHashtags(params: HashtagGenParams): GeneratorResult<string> {
  const keywordsRaw = cleanText(params.keywords);
  const nicheRaw = cleanText(params.niche || '');
  const uniquePool = buildCamelCaseHashtagPool(keywordsRaw, nicheRaw);

  if (uniquePool.length === 0) {
    return {
      items: [],
      errors: ['Please enter at least one topic or keyword (letters/numbers) to generate hashtags.'],
      warnings: [],
    };
  }

  const batch = params.batch ?? 0;
  const selected = rotateSlice(uniquePool, params.count, batch);

  return {
    items: selected,
    errors: [],
    warnings: [],
    note: 'Hashtag reach is not guaranteed. Keep hashtags concise and relevant to your Facebook post.',
  };
}

// ============================================================================
// 3. Facebook Post Idea Generator
// ============================================================================
export type PostIdeaContentType =
  | 'Any'
  | 'Question'
  | 'Story'
  | 'Tip'
  | 'Poll'
  | 'Behind-the-scenes'
  | 'Promotion';

export interface PostIdeaParams {
  topic: string;
  audience?: string;
  contentType: PostIdeaContentType;
  count: 5 | 10;
  batch?: number;
}

export function generatePostIdeas(params: PostIdeaParams): GeneratorResult<string> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a niche or topic to generate post ideas.'], warnings: []};
  }
  const audience = cleanText(params.audience || '');
  const forAud = audience ? ` aimed at ${audience}` : '';
  const batch = params.batch ?? 0;

  const banks: Record<Exclude<PostIdeaContentType, 'Any'>, string[]> = {
    Question: [
      `Ask followers what their biggest daily challenge with ${topic} is right now and invite honest answers in the comments.`,
      `Post a two-part question asking what beginners wish they had known before starting with ${topic}${forAud}.`,
      `Share a single bold statement about ${topic} and ask your audience whether they agree or would change one detail.`,
      `Ask community members to drop their favorite tool, habit, or resource related to ${topic} so everyone can discover new ideas.`,
      `Create a fill-in-the-blank prompt: "The one thing that finally made ${topic} click for me was ______."`,
      `Ask followers what specific question about ${topic} they want you to answer in your next post or live video.`,
      `Invite past readers or clients to share one small win they experienced recently with ${topic}.`,
    ],
    Story: [
      `Tell the story of an early mistake you made with ${topic}, what went wrong, and the practical lesson that changed your approach.`,
      `Share a short "before and after" reflection describing how your thinking about ${topic} has evolved over the past year.`,
      `Spotlight a real customer or community member story showing how a tiny change in ${topic} solved a recurring frustration.`,
      `Write a candid milestone story explaining why you first cared about ${topic} and what keeps you motivated today.`,
      `Recap a recent conversation you had${forAud} that revealed a surprising insight about ${topic}.`,
      `Describe a tough week where ${topic} felt stuck and walk through the exact turning point that got things moving again.`,
      `Share a throwback photo paired with the backstory of your very first project or lesson in ${topic}.`,
    ],
    Tip: [
      `Publish a 3-step quick checklist on how to get better results with ${topic} in under 15 minutes.`,
      `Break down one common myth about ${topic} and explain what actually works better in plain language${forAud}.`,
      `Create a "Do this / Skip this" comparison graphic covering everyday habits in ${topic}.`,
      `Share your personal starter toolkit or step-by-step routine for handling ${topic} smoothly on busy days.`,
      `Write a beginner-friendly glossary explaining three confusing terms people often hear around ${topic}.`,
      `Post a single underrated tip about ${topic} that takes zero extra budget to apply right away.`,
      `Summarize three recurring mistakes people make with ${topic} and show the straightforward fix for each.`,
    ],
    Poll: [
      `Run a Facebook Poll asking followers which ${topic} sub-topic they want covered in your next deep-dive guide.`,
      `Create an A-vs-B preference poll comparing two popular approaches to ${topic}${forAud}.`,
      `Ask followers how often they work on ${topic} (Daily / Weekly / Monthly / Just starting) to gauge community experience levels.`,
      `Poll your audience on their preferred format for ${topic} content: short Reels, step-by-step text posts, or photo carousels.`,
      `Set up a light weekend poll asking which classic ${topic} debate divides your community most.`,
      `Offer two potential ideas or themes for an upcoming ${topic} project and let followers vote on the winner.`,
      `Ask followers which part of ${topic} takes up the most time in their week so you can tailor helpful tips.`,
    ],
    'Behind-the-scenes': [
      `Post a candid photo of your workspace or prep setup while getting today's ${topic} project ready${forAud}.`,
      `Walk followers through your step-by-step preparation checklist before launching anything new in ${topic}.`,
      `Share an unpolished draft or early sketch from your ${topic} work and explain how it grew into the finished version.`,
      `Introduce a team member or collaborator and share their favorite practical habit related to ${topic}.`,
      `Show what an ordinary Tuesday actually looks like behind the scenes when managing ${topic}.`,
      `Reveal how you organize notes, supplies, or feedback for ${topic} so quality stays consistent.`,
      `Post a short reflection on a small detail in ${topic} that most people never notice from the outside.`,
    ],
    Promotion: [
      `Highlight one specific problem ${topic} solves${forAud}, share a clear real-world example, and invite readers to message you for details.`,
      `Showcase your featured ${topic} service or offer with three concise bullet outcomes and a direct next step in the caption.`,
      `Share an honest FAQ post answering the top three questions people ask before trying your ${topic} offering.`,
      `Post a spotlight explaining who your ${topic} solution is best suited for—and equally who might not need it yet.`,
      `Announce an upcoming deadline, seasonal slot, or limited opening tied to ${topic} with simple instructions on how to claim it.`,
      `Pair a helpful free mini-tip on ${topic} with a soft invitation to explore your full guide or offer.`,
      `Share feedback from someone who benefited from your ${topic} work and invite others with similar goals to reach out.`,
    ],
  };

  let pool: string[];
  if (params.contentType === 'Any') {
    const keys = Object.keys(banks) as Exclude<PostIdeaContentType, 'Any'>[];
    pool = [];
    const maxLen = Math.max(...keys.map((k) => banks[k].length));
    for (let i = 0; i < maxLen; i++) {
      for (const k of keys) {
        if (banks[k][i]) pool.push(`[${k}] ${banks[k][i]}`);
      }
    }
  } else {
    pool = banks[params.contentType];
  }

  return {
    items: rotateSlice(pool, params.count, batch),
    errors: [],
    warnings: [],
    note: 'Template-generated publishable Facebook post ideas.',
  };
}

// ============================================================================
// 4. Facebook Reel Idea Generator
// ============================================================================
export type ReelVideoStyle = 'Tutorial' | 'Funny' | 'Story' | 'Trend' | 'Behind-the-scenes';

export interface ReelIdeaItem {
  hook: string;
  concept: string;
  length: '15 sec' | '30 sec' | '60 sec' | '90 sec';
}

export interface ReelIdeaParams {
  topic: string;
  audience?: string;
  style: ReelVideoStyle;
  count: 5 | 10;
  batch?: number;
}

export function generateReelIdeas(params: ReelIdeaParams): GeneratorResult<ReelIdeaItem> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a niche or topic to generate Facebook Reel ideas.'], warnings: []};
  }
  const audience = cleanText(params.audience || '');
  const audSuffix = audience ? ` tailored for ${audience}` : '';
  const batch = params.batch ?? 0;

  const banks: Record<ReelVideoStyle, ReelIdeaItem[]> = {
    Tutorial: [
      {hook: `"Stop guessing with ${topic}—try this 3-step fix instead."`, concept: `Show three rapid on-screen text steps solving a common ${topic} problem${audSuffix}, ending with the finished result.`, length: '30 sec'},
      {hook: `"The fastest way to clean up your ${topic} workflow in under a minute."`, concept: `Record an over-the-shoulder walkthrough demonstrating one before-and-after improvement for ${topic}.`, length: '60 sec'},
      {hook: `"One mistake almost everyone makes with ${topic} (and how to fix it)."`, concept: `Split the frame: first show the wrong habit with ${topic}, then cut directly to the cleaner method.`, length: '30 sec'},
      {hook: `"Save this checklist before your next ${topic} session."`, concept: `Point to 4 short bullet overlays covering essential prep items for ${topic}${audSuffix}.`, length: '15 sec'},
      {hook: `"Here is what nobody explains clearly about ${topic} for beginners."`, concept: `Teach one foundational ${topic} rule using simple visual props or a quick whiteboard sketch.`, length: '60 sec'},
      {hook: `"How to handle ${topic} when you only have 10 minutes."`, concept: `Time-lapse a condensed version of your ${topic} routine while narrating the priority shortcuts.`, length: '30 sec'},
      {hook: `"Do this before you spend another dollar on ${topic}."`, concept: `Walk through three free checks anyone${audSuffix} can run to evaluate their ${topic} setup.`, length: '60 sec'},
      {hook: `"Comparing two ways to approach ${topic} side by side."`, concept: `Test method A vs. method B live on camera and show which holds up better for ${topic}.`, length: '90 sec'},
      {hook: `"A tiny tweak in ${topic} that saves hours every month."`, concept: `Zoom in on one overlooked setting or step in ${topic} and show the exact adjustment.`, length: '15 sec'},
      {hook: `"Full beginner roadmap for ${topic} in 90 seconds."`, concept: `Outline Week 1, Week 2, and Month 1 milestones for ${topic} with clear chapter cards.`, length: '90 sec'},
      {hook: `"Why your ${topic} results feel inconsistent—and the quick reset."`, concept: `Diagnose three quick symptoms in ${topic} and demonstrate the reset step on camera.`, length: '60 sec'},
    ],
    Funny: [
      {hook: `"Expectation vs. reality when trying ${topic} for the first time."`, concept: `Contrast a calm, idealized opening clip about ${topic} with a chaotic, relatable blooper cut.`, length: '15 sec'},
      {hook: `"Things people say about ${topic} vs. what they actually mean."`, concept: `Play both roles in a quick dialogue skit poking gentle fun at common ${topic} excuses${audSuffix}.`, length: '30 sec'},
      {hook: `"Me telling myself ${topic} will only take five minutes..."`, concept: `Use a fast time-jump clock edit showing how a quick ${topic} task turns into an all-afternoon project.`, length: '15 sec'},
      {hook: `"Ranking the funniest beginner habits in ${topic}."`, concept: `Act out three exaggerated rookie moments around ${topic} with playful on-screen captions.`, length: '30 sec'},
      {hook: `"When someone asks you to explain ${topic} in two sentences."`, concept: `Start calm, get progressively more animated with hand gestures, and end with a punchy one-liner.`, length: '15 sec'},
      {hook: `"If ${topic} had honest warning labels..."`, concept: `Hold up sticky notes listing humorous truths everyone learns the hard way in ${topic}.`, length: '30 sec'},
      {hook: `"POV: You finally solved that annoying ${topic} problem."`, concept: `Record a celebratory slow-motion reaction after finishing a tricky ${topic} task.`, length: '15 sec'},
      {hook: `"A day in the brain of someone obsessed with ${topic}."`, concept: `Rapid-cut montage of everyday situations turning back into ideas about ${topic}.`, length: '30 sec'},
      {hook: `"Three signs you spend way too much time thinking about ${topic}."`, concept: `Deliver three relatable deadpan scenarios${audSuffix} while doing an ordinary chore.`, length: '30 sec'},
      {hook: `"How ${topic} looks on Monday morning vs. Friday afternoon."`, concept: `Compare high-energy Monday planning against laid-back Friday wrap-up energy.`, length: '15 sec'},
      {hook: `"Attempting a ${topic} shortcut I found online..."`, concept: `React humorously to testing a viral-style shortcut for ${topic} and show what actually happens.`, length: '60 sec'},
    ],
    Story: [
      {hook: `"I almost gave up on ${topic} until this happened."`, concept: `Share a sincere 60-second story over B-roll footage about an early setback in ${topic} and what kept you going.`, length: '60 sec'},
      {hook: `"The honest story behind why I started working on ${topic}."`, concept: `Talk straight to camera while cutting to older photos or workspace clips tied to your ${topic} journey.`, length: '60 sec'},
      {hook: `"One conversation completely changed how I view ${topic}."`, concept: `Retell a brief, memorable moment with a mentor, friend, or customer about ${topic}${audSuffix}.`, length: '60 sec'},
      {hook: `"Here is what a full year of practicing ${topic} actually looked like."`, concept: `Stitch monthly 2-second progress clips showing realistic growth in ${topic} from Day 1 to Day 365.`, length: '30 sec'},
      {hook: `"The biggest lesson ${topic} taught me outside of work."`, concept: `Connect a relatable skill from ${topic}—like patience or preparation—to everyday life.`, length: '60 sec'},
      {hook: `"A mistake I made in ${topic} that turned into my best habit."`, concept: `Explain what went sideways, how you fixed it, and the permanent rule you use now for ${topic}.`, length: '90 sec'},
      {hook: `"Why I stopped following popular advice on ${topic}."`, concept: `Walk through the turning point when standard advice failed${audSuffix} and what worked instead.`, length: '60 sec'},
      {hook: `"Reading my earliest notes on ${topic} out loud."`, concept: `Flip through an old notebook or early post on ${topic} and reflect on how much changed.`, length: '30 sec'},
      {hook: `"How one small community comment shaped this ${topic} project."`, concept: `Show a screenshot of a real question or suggestion and tell how it inspired what you built.`, length: '30 sec'},
      {hook: `"From clueless beginner to confident in ${topic}: the messy middle."`, concept: `Highlight the unglamorous middle phase of learning ${topic} so newcomers feel encouraged.`, length: '90 sec'},
      {hook: `"Three chapters of my ${topic} journey in 30 seconds."`, concept: `Use three dated caption cards to narrate start, struggle, and breakthrough in ${topic}.`, length: '30 sec'},
    ],
    Trend: [
      {hook: `"30-second recap: what is changing in ${topic} right now."`, concept: `Speak clearly over clean background clips summarizing one timely shift happening in ${topic}.`, length: '30 sec'},
      {hook: `"Unpopular opinion about ${topic}—hear me out."`, concept: `Use a popular split-screen or walk-and-talk format to share a thoughtful contrarian angle on ${topic}.`, length: '30 sec'},
      {hook: `"Rating popular ${topic} habits from 1 to 10."`, concept: `React rapidly to 4 well-known ${topic} practices${audSuffix} with quick score overlays.`, length: '30 sec'},
      {hook: `"Yes or No: quick-fire myth check on ${topic}."`, concept: `Flash common ${topic} claims on screen for 2 seconds each and nod/shake with one-line explanations.`, length: '30 sec'},
      {hook: `"The 2-word rule changing how people handle ${topic}."`, concept: `Open with a punchy text hook on screen and illustrate the rule using two quick visual clips.`, length: '15 sec'},
      {hook: `"This or That: ${topic} edition."`, concept: `Tilt left or right between pairs of ${topic} choices and ask viewers to comment their picks.`, length: '15 sec'},
      {hook: `"Tell me you're into ${topic} without telling me..."`, concept: `Show 4 unmistakable visual clues from your ${topic} routine in fast 2-second cuts.`, length: '15 sec'},
      {hook: `"One thing I'm leaving behind vs. bringing forward in ${topic}."`, concept: `Use a simple two-column overlay comparing outdated vs. smarter ${topic} practices.`, length: '30 sec'},
      {hook: `"Green flags vs. red flags when looking at ${topic}."`, concept: `Alternate quick cuts showing helpful signs vs. warning signs in ${topic}${audSuffix}.`, length: '30 sec'},
      {hook: `"The 3-second test for better ${topic} decisions."`, concept: `Present a fast visual rule-of-thumb viewers can apply immediately when reviewing ${topic}.`, length: '15 sec'},
      {hook: `"Why everyone is talking about this side of ${topic}."`, concept: `Break down a trending conversation in ${topic} in calm, practical terms for your audience.`, length: '60 sec'},
    ],
    'Behind-the-scenes': [
      {hook: `"Come set up a ${topic} session with me from scratch."`, concept: `Film natural ASMR/ambient clips of unpacking tools, arranging the desk, and prepping ${topic}.`, length: '30 sec'},
      {hook: `"What 3 hours of ${topic} prep looks like in 30 seconds."`, concept: `Combine a clean hyperlapse of your work process with brief captions explaining each stage.`, length: '30 sec'},
      {hook: `"Everything in my bag/toolkit for ${topic}."`, concept: `Lay out the 5 everyday items you rely on most for ${topic} and tap each as you name its job.`, length: '30 sec'},
      {hook: `"The messy reality behind a finished ${topic} post."`, concept: `Pan from the polished final frame back to the notes, drafts, and outtakes that made it happen.`, length: '15 sec'},
      {hook: `"Answering a real viewer question while working on ${topic}."`, concept: `Pin a follower's question sticker on screen and chat naturally while continuing your hands-on task.`, length: '60 sec'},
      {hook: `"First 30 minutes of our workday focused on ${topic}."`, concept: `Show morning coffee, daily planning board, and the first concrete action on ${topic}.`, length: '30 sec'},
      {hook: `"Fixing a snag in ${topic} in real time."`, concept: `Document a small hiccup mid-project and walk viewers through how you troubleshooted it.`, length: '60 sec'},
      {hook: `"Tour of where we create everything around ${topic}."`, concept: `Give a casual 4-angle walkthrough of your studio, kitchen, desk, or field setup for ${topic}.`, length: '30 sec'},
      {hook: `"Packing or wrapping up today's ${topic} deliverable."`, concept: `Show the final quality check and finishing touches before sending work out.`, length: '15 sec'},
      {hook: `"Three drafts it took before getting ${topic} right."`, concept: `Flip through Version 1, Version 2, and the final Version 3 to show real creative iteration.`, length: '30 sec'},
      {hook: `"End-of-week reset for ${topic}."`, concept: `Show how you clean up files, tools, and next week's priorities on Friday.`, length: '30 sec'},
    ],
  };

  const pool = banks[params.style];
  return {
    items: rotateSlice(pool, params.count, batch),
    errors: [],
    warnings: [],
    note: 'Deterministic Reel concept frameworks — film with your own authentic voice and footage.',
  };
}

// ============================================================================
// 5. Facebook Story Idea Generator
// ============================================================================
export type StoryIdeaType = 'Any' | 'Poll' | 'Q&A' | 'Behind-the-scenes' | 'Tip' | 'Announcement';
export type StoryFormat = 'Poll' | 'Quiz' | 'Question sticker' | 'Photo' | 'Video';

export interface StoryIdeaItem {
  format: StoryFormat;
  content: string;
}

export interface StoryIdeaParams {
  topic: string;
  storyType: StoryIdeaType;
  count: 5 | 10;
  batch?: number;
}

export function generateStoryIdeas(params: StoryIdeaParams): GeneratorResult<StoryIdeaItem> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a niche or topic to generate Facebook Story ideas.'], warnings: []};
  }
  const batch = params.batch ?? 0;

  const banks: Record<Exclude<StoryIdeaType, 'Any'>, StoryIdeaItem[]> = {
    Poll: [
      {format: 'Poll', content: `Post a clean photo related to ${topic} and add a 2-option Poll sticker: "Which one do you prefer? Option A / Option B".`},
      {format: 'Poll', content: `Use a Poll sticker on a plain background: "How comfortable are you with ${topic} right now? Total beginner / Pretty confident".`},
      {format: 'Quiz', content: `Create a 3-choice Quiz sticker testing a surprising fact or common myth about ${topic} and reveal the answer on the next slide.`},
      {format: 'Poll', content: `Ask followers to vote on your next ${topic} post topic using a Poll sticker: "Step-by-step guide / Quick mistakes list".`},
      {format: 'Poll', content: `Share two draft titles or layouts for an upcoming ${topic} post and let viewers vote on their favorite.`},
      {format: 'Quiz', content: `Run a "Spot the mistake" Quiz sticker over a quick photo showing two ways to handle ${topic}.`},
      {format: 'Poll', content: `Check audience timing preferences: "When do you usually catch up on ${topic}? Morning coffee / Evening scroll".`},
    ],
    'Q&A': [
      {format: 'Question sticker', content: `Drop a Question sticker: "Ask me anything about ${topic}—answering the top questions in Stories today."`},
      {format: 'Question sticker', content: `Ask for community input with a Question sticker: "What is your #1 tip for someone new to ${topic}?" and reshare best answers.`},
      {format: 'Video', content: `Reply to one real question from your audience about ${topic} in a 20-second vertical talking-head video clip.`},
      {format: 'Question sticker', content: `Prompt feedback on a new idea: "Thinking about covering this angle of ${topic}—what would you want included?"`},
      {format: 'Quiz', content: `Turn your most frequently asked ${topic} question into an interactive Quiz sticker before sharing a short text explanation.`},
      {format: 'Question sticker', content: `Invite topic requests: "Drop a ${topic} hurdle you're stuck on right now and let's troubleshoot it together."`},
      {format: 'Photo', content: `Screenshot an anonymous follower question about ${topic} onto a clean card and write a concise 2-sentence answer underneath.`},
    ],
    'Behind-the-scenes': [
      {format: 'Photo', content: `Snap a natural desk or workspace photo showing what you are currently preparing for ${topic} with a short caption overlay.`},
      {format: 'Video', content: `Film a 15-second vertical clip walking viewers through one real step of your ${topic} routine in progress.`},
      {format: 'Photo', content: `Share an early rough draft or checklist for ${topic} and write "Work in progress—more coming later this week."`},
      {format: 'Video', content: `Record a quick morning check-in mentioning what goal around ${topic} is at the top of your list today.`},
      {format: 'Photo', content: `Show the everyday tools, apps, or supplies sitting in front of you while working on ${topic}.`},
      {format: 'Video', content: `Capture a 10-second time-lapse of setting up or wrapping up a ${topic} session with soft background music.`},
      {format: 'Photo', content: `Post a candid "wins and lessons from today" recap slide summarizing one thing that worked in ${topic}.`},
    ],
    Tip: [
      {format: 'Photo', content: `Design a 1-slide text card: "Quick ${topic} tip: [share one 15-word actionable takeaway]" on a high-contrast background.`},
      {format: 'Video', content: `Demonstrate a single 15-second shortcut for ${topic} on camera with large captions so muted viewers can follow.`},
      {format: 'Quiz', content: `Start slide 1 with a Quiz sticker ("Which ${topic} habit saves the most time?") and put the detailed breakdown on slide 2.`},
      {format: 'Photo', content: `Share a 3-bullet "Do / Avoid" checklist photo for ${topic} that viewers can screenshot easily.`},
      {format: 'Video', content: `Film a quick screen recording or hands-on demo fixing one common ${topic} friction point.`},
      {format: 'Photo', content: `Create a "Before / After" two-photo collage showing the difference one small adjustment makes in ${topic}.`},
      {format: 'Question sticker', content: `Pair a concise ${topic} tip with a Question sticker asking "Have you tried this method yet?"`},
    ],
    Announcement: [
      {format: 'Photo', content: `Post a bold clean slide announcing your latest ${topic} post, guide, or update with a direct "New post on the Page" pointer.`},
      {format: 'Video', content: `Record a 20-second face-to-camera teaser introducing what you just published about ${topic} and why it helps.`},
      {format: 'Poll', content: `Tease an upcoming ${topic} launch or live session and add a Poll sticker: "Reminder please! / Already marked it".`},
      {format: 'Photo', content: `Share a "Save the date" graphic for your upcoming ${topic} Q&A, workshop, or live event.`},
      {format: 'Video', content: `Show a quick sneak-peek pan over your new ${topic} resource with "Dropping soon—stay tuned" text.`},
      {format: 'Question sticker', content: `Announce an open slot or feedback round for ${topic} and attach a Question sticker for early questions.`},
      {format: 'Photo', content: `Celebrate a community milestone around ${topic} with a simple thank-you card tagging contributors if appropriate.`},
    ],
  };

  let pool: StoryIdeaItem[];
  if (params.storyType === 'Any') {
    const keys = Object.keys(banks) as Exclude<StoryIdeaType, 'Any'>[];
    pool = [];
    const maxLen = Math.max(...keys.map((k) => banks[k].length));
    for (let i = 0; i < maxLen; i++) {
      for (const k of keys) {
        if (banks[k][i]) pool.push(banks[k][i]);
      }
    }
  } else {
    pool = banks[params.storyType];
  }

  return {
    items: rotateSlice(pool, params.count, batch),
    errors: [],
    warnings: [],
    note: 'Story prompt ideas formatted for 9:16 vertical Facebook Stories.',
  };
}

// ============================================================================
// 6. Facebook Reel Caption Generator (short, punchy, hook-first, 1–3 lines)
// ============================================================================
export type ReelCaptionTone = 'Funny' | 'Informative' | 'Inspirational' | 'Casual';

export interface ReelCaptionParams {
  topic: string;
  tone: ReelCaptionTone;
  count: 3 | 5;
  includeHashtags: boolean;
  batch?: number;
}

export function generateReelCaptions(params: ReelCaptionParams): GeneratorResult<string> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a Reel topic to generate captions.'], warnings: []};
  }
  const batch = params.batch ?? 0;

  const hashtagPool = params.includeHashtags ? buildCamelCaseHashtagPool(topic) : [];

  const banks: Record<ReelCaptionTone, string[]> = {
    Funny: [
      `Wait until the end for the ${topic} twist.\nSpoiler: it took three tries.`,
      `Me thinking ${topic} would take 5 minutes.\nNarrator: it did not.`,
      `POV: you finally figured out ${topic} after way too much coffee.\nWorth it? Comment below.`,
      `Nobody warned me ${topic} came with this many plot twists.\nTag someone who gets it.`,
      `If ${topic} feels chaotic today, you're in good company.\nWatch step 2 closely.`,
      `Trying to look calm while mastering ${topic}.\nSend encouragement in the comments.`,
      `Expectation vs. real life with ${topic}.\nWhich part made you laugh first?`,
    ],
    Informative: [
      `The fastest fix for ${topic} in 30 seconds.\nSave this before your next try.`,
      `Stop making this common ${topic} mistake.\nTry step 2 instead and notice the difference.`,
      `3 quick takeaways on ${topic}:\nKeep it simple, test once, repeat what works.`,
      `What I wish I knew sooner about ${topic}.\nDrop a question if you want part two.`,
      `Bookmark this ${topic} breakdown for later.\nWhich tip surprised you most?`,
      `How to approach ${topic} without overcomplicating it.\nFull checklist is right in the clip.`,
      `One small change to level up your ${topic} routine today.\nSave and test this week.`,
    ],
    Inspirational: [
      `One small step in ${topic} still counts.\nKeep showing up today.`,
      `Progress with ${topic} looks quiet until you look back.\nDon't quit in the middle.`,
      `You don't have to master ${topic} overnight.\nJust start where you are.`,
      `Every win in ${topic} began with someone refusing to overthink Day 1.\nSave this reminder.`,
      `Built slowly, one honest rep at a time: ${topic}.\nKeep going.`,
      `A little patience with ${topic} goes a long way.\nSend this to someone who needs the nudge.`,
      `Proof that small daily habits around ${topic} really do compound.`,
    ],
    Casual: [
      `Quick behind-the-scenes look at ${topic} today.\nHow would you handle step two?`,
      `Just sharing what worked for us with ${topic} this week.\nThoughts?`,
      `A 20-second peek at our latest ${topic} setup.\nDrop your favorite tip below!`,
      `Keeping ${topic} simple and real today.\nTell me I'm not the only one who does this.`,
      `Little update on how ${topic} is going lately.\nTap like if you want the full breakdown.`,
      `Testing a fresh idea around ${topic}—let me know what you think!`,
      `Here's how today's ${topic} session actually played out.\nWhat are you working on?`,
    ],
  };

  const tagCountPerCaption = 4;
  const captions = rotateSlice(banks[params.tone], params.count, batch);
  const selected = captions.map((line, idx) => {
    if (!params.includeHashtags || hashtagPool.length === 0) {
      return line;
    }
    const perCaptionTags: string[] = [];
    const offset = (batch * params.count + idx) * tagCountPerCaption;
    const take = Math.min(tagCountPerCaption, hashtagPool.length);
    for (let j = 0; j < take; j++) {
      perCaptionTags.push(hashtagPool[(offset + j) % hashtagPool.length]);
    }
    return `${line}\n${perCaptionTags.join(' ')}`;
  });

  return {
    items: selected,
    errors: [],
    warnings: [],
    note: 'Short hook-first captions formatted for above the Facebook Reels player bar.',
  };
}

// ============================================================================
// 7. Facebook Video Title Generator
// ============================================================================
export type VideoTitleStyle = 'How-to' | 'List' | 'Question' | 'Curiosity' | 'Direct';

export interface VideoTitleParams {
  topic: string;
  audience?: string;
  style: VideoTitleStyle;
  count: 5 | 10;
  batch?: number;
}

export function generateVideoTitles(params: VideoTitleParams): GeneratorResult<string> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a video topic to generate titles.'], warnings: []};
  }
  const audience = cleanText(params.audience || '');
  const forAud = audience ? ` for ${audience}` : '';
  const batch = params.batch ?? 0;

  // Keep user's exact topic wording/casing untouched; vary sentence structures and angles widely per item.
  const banks: Record<VideoTitleStyle, string[]> = {
    'How-to': [
      `Step-by-step walkthrough: ${topic} from start to finish${forAud}`,
      `Get better results with ${topic} in under 10 minutes`,
      `Beginner checklist before starting ${topic}${forAud}`,
      `Fix these common ${topic} bottlenecks without extra gear`,
      `A simpler routine for ${topic} on busy days`,
      `From scratch to finished: ${topic} made repeatable`,
      `Stop second-guessing ${topic} — try this practical setup`,
      `Avoid the early slip-ups when learning ${topic}${forAud}`,
      `Inside our weekly workflow for ${topic}`,
      `Master the essentials of ${topic} in three clear stages`,
      `Before you retry ${topic}, adjust these small steps`,
    ],
    List: [
      `5 practical tips that actually help with ${topic}${forAud}`,
      `${topic}: 4 checkpoints before you begin`,
      `Stop making these 7 mistakes with ${topic}`,
      `Three tiny habits for faster ${topic} progress`,
      `Only 6 tools and habits you need for ${topic}${forAud}`,
      `Most people skip these 3 details in ${topic}`,
      `8 honest lessons learned from real ${topic} sessions`,
      `The top 5 questions we hear about ${topic}`,
      `4 simple myths about ${topic} cleared up fast`,
      `Beginners${forAud ? ` (${audience})` : ''}: save these 6 reminders for ${topic}`,
      `3 quick resets whenever ${topic} feels stuck`,
    ],
    Question: [
      `Why does ${topic} feel harder than it needs to be?`,
      `Is one overlooked step slowing down your ${topic}?`,
      `What actually works best for ${topic}${forAud}?`,
      `Have you been overcomplicating ${topic} this whole time?`,
      `Which ${topic} habit saves the most time week to week?`,
      `Can a 5-minute adjustment change your ${topic} results?`,
      `Are beginners better off keeping ${topic} minimal?`,
      `What happens when you strip ${topic} down to basics?`,
      `How long should ${topic} realistically take${forAud}?`,
      `What do most tutorials skip about ${topic}?`,
      `Ready to rethink your usual approach to ${topic}?`,
    ],
    Curiosity: [
      `The quiet detail that changes everything about ${topic}`,
      `Why we stopped handling ${topic} the usual way`,
      `Watch this before your next ${topic} attempt${forAud}`,
      `What 30 days of testing ${topic} actually taught us`,
      `Nobody mentions this trade-off with ${topic}`,
      `The part of ${topic} almost everyone walks right past`,
      `Why keeping ${topic} simple beat the advanced method`,
      `A fresh perspective on ${topic} you probably missed`,
      `One small switch that transformed our ${topic} results`,
      `What real consistency with ${topic} looks like behind the scenes${forAud}`,
      `The surprising culprit behind inconsistent ${topic}`,
    ],
    Direct: [
      `${topic} walkthrough & real examples${forAud}`,
      `Complete breakdown: getting started with ${topic}`,
      `Clear ${topic} demo in under 5 minutes`,
      `Real-world guide to ${topic} on a tight schedule`,
      `Common pitfalls & fixes in ${topic}`,
      `Honest review after trying ${topic}${forAud}`,
      `Q&A session covering top ${topic} questions`,
      `Essentials every beginner should know about ${topic}`,
      `Step-by-step routine: ${topic} without the fluff`,
      `Practical tips and setup notes for ${topic}`,
      `Everything worth checking before tackling ${topic}`,
    ],
  };

  return {
    items: rotateSlice(banks[params.style], params.count, batch),
    errors: [],
    warnings: [],
    note: 'Video titles aim for readable Watch & mobile feed length (~65 chars or fewer recommended).',
  };
}

// ============================================================================
// 8. Facebook Video Description Generator
// ============================================================================
export interface VideoDescriptionParams {
  topic: string;
  videoTitle?: string;
  keyPoints?: string;
  includeTimestamps: boolean;
  cta?: string;
  batch?: number;
}

export function generateVideoDescriptions(params: VideoDescriptionParams): GeneratorResult<string> {
  const topic = cleanText(params.topic);
  if (!topic) {
    return {items: [], errors: ['Please enter a video topic to generate descriptions.'], warnings: []};
  }
  const title = cleanText(params.videoTitle || '');
  const cta = cleanText(params.cta || '') || `Have a question about ${topic}? Drop it in the comments and follow our Page for upcoming walkthroughs.`;
  const batch = params.batch ?? 0;

  const rawPoints = (params.keyPoints || '')
    .split('\n')
    .map((l) => l.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

  const bulletPoints =
    rawPoints.length > 0
      ? rawPoints
      : [
          `Core fundamentals of ${topic} explained clearly`,
          `Common mistakes to watch out for when working on ${topic}`,
          `Practical next steps you can test right away`,
        ];

  const bulletBlock = bulletPoints.map((p) => `• ${p}`).join('\n');

  const timestampSlots = ['00:00', '00:45', '01:50', '03:10', '04:25', '05:40'];
  const timestampLines = params.includeTimestamps
    ? [
        `00:00 Intro — ${title || topic}`,
        ...bulletPoints.slice(0, 5).map((pt, idx) => `${timestampSlots[idx + 1] || `0${idx + 2}:00`} ${pt}`),
      ].join('\n')
    : '';

  const introAngles = [
    `In this video${title ? ` ("${title}")` : ''}, we walk step by step through ${topic} with clear examples you can put into practice right away without extra guesswork.`,
    `Looking for a straightforward breakdown of ${topic}? ${title ? `"${title}"` : 'This video'} covers what actually matters so you can save time and get cleaner results.`,
    `Whether you are exploring ${topic} for the first time or sharpening your existing routine, ${title ? `"${title}"` : 'this walkthrough'} gives you a clear, practical overview from start to finish.`,
    `Here is a practical look at ${topic}${title ? ` in "${title}"` : ''}—built around real steps, everyday trade-offs, and tips you can adapt to your own workflow.`,
  ];

  const variations: string[] = introAngles.map((intro, idx) => {
    const heading = idx % 2 === 0 ? 'What you will learn in this video:' : 'In this video:';
    const sections: string[] = [intro, `${heading}\n${bulletBlock}`];
    if (params.includeTimestamps && timestampLines) {
      sections.push(`Timestamps:\n${timestampLines}`);
    }
    sections.push(`Next step:\n${cta}`);
    return sections.join('\n\n');
  });

  // Always return 2 distinct structured options per batch so Regenerate produces fresh sets
  return {
    items: rotateSlice(variations, 2, batch),
    errors: [],
    warnings: [],
    note: rawPoints.length === 0
      ? 'No key points entered — included editable starter bullet points. Add your own key points above to customize.'
      : 'Built directly from your key points and video details.',
  };
}

// ============================================================================
// 9. Facebook Comment Generator
// ============================================================================
export type CommentTone = 'Supportive' | 'Funny' | 'Thoughtful' | 'Congratulatory';

export interface CommentGenParams {
  postText: string;
  tone: CommentTone;
  count: 3 | 5;
  batch?: number;
}

export function generateFacebookComments(params: CommentGenParams): GeneratorResult<string> {
  const rawPost = cleanText(params.postText);
  if (!rawPost) {
    return {
      items: [],
      errors: ['Please enter the post topic or paste the Facebook post text first.'],
      warnings: [],
    };
  }
  const batch = params.batch ?? 0;
  const focus = sanitizeTopicPhrase(rawPost, 55);
  const terms = extractKeyTerms(rawPost);
  const keyTerm = terms.length >= 2 ? `${terms[0]} ${terms[1]}` : terms[0] || focus;

  const banks: Record<CommentTone, string[]> = {
    Supportive: [
      `Really appreciate you breaking down ${keyTerm} so clearly here—needed that reminder today.`,
      `This perspective on ${keyTerm} makes a lot of sense. Thanks for sharing what actually worked for you!`,
      `Rooting for you on this! Posts like this about ${keyTerm} help so many people feel less stuck.`,
      `Bookmarking this point about ${keyTerm}—practical, honest, and easy to follow.`,
      `So glad you posted this update on ${keyTerm}. Excited to see how the next stage goes!`,
      `Thank you for putting real experience behind ${keyTerm} instead of just repeating generic advice.`,
      `This hits home, especially the part about ${keyTerm}. Keep sharing more like this!`,
    ],
    Funny: [
      `Not me reading this about ${keyTerm} and realizing I've been doing it the hard way all month.`,
      `Why does ${keyTerm} always sound simple until I'm knee-deep in it on a Tuesday afternoon?`,
      `Okay, that take on ${keyTerm} called me out directly and I respect it.`,
      `Adding this straight to my "wish I saw this before trying ${keyTerm}" folder.`,
      `Petition to make ${keyTerm} come with a giant easy button—until then, thanks for this!`,
      `My Monday confidence vs. my actual ${keyTerm} skills just had a moment reading this.`,
      `If ${keyTerm} were an Olympic sport, half of us would still be reading the rulebook halfway through.`,
    ],
    Thoughtful: [
      `What stands out most in what you shared about ${keyTerm} is how much the small details add up over time.`,
      `Interesting angle on ${keyTerm}—did you notice the biggest difference right away or after sticking with it a few weeks?`,
      `I used to overlook ${keyTerm}, too, until testing a simpler routine changed the whole outcome.`,
      `Good point on ${keyTerm}. Pairing consistency with clear expectations usually beats trying to rush the process.`,
      `Curious how you balance ${keyTerm} when things get busy—do you stick to a fixed checklist or adjust week by week?`,
      `One takeaway here on ${keyTerm} worth repeating: getting the fundamentals right solves half the headaches downstream.`,
      `Really thoughtful breakdown of ${keyTerm}. It is refreshing to see practical trade-offs discussed openly.`,
    ],
    Congratulatory: [
      `Huge congrats on this milestone with ${keyTerm}! Well earned after all the work behind the scenes.`,
      `So happy to see this win around ${keyTerm}—cheers to everything that went into making it happen!`,
      `What an exciting update on ${keyTerm}! Wishing you continued momentum from here.`,
      `Congratulations! Watching your progress with ${keyTerm} come together like this is genuinely inspiring.`,
      `Big applause on reaching this stage with ${keyTerm}. Take a moment to celebrate it properly!`,
      `Thrilled to read this news about ${keyTerm}—here is to many more milestones ahead!`,
      `Well deserved! All that patience and steady effort on ${keyTerm} clearly paid off.`,
    ],
  };

  return {
    items: rotateSlice(banks[params.tone], params.count, batch),
    errors: [],
    warnings: [],
    note: 'Draft comments tailored to your post input — customize slightly so they sound like your own voice.',
  };
}

// ============================================================================
// 10. Facebook Reply Generator
// ============================================================================
export type ReplyTone = 'Friendly' | 'Professional' | 'Funny' | 'Thankful';

export interface ReplyGenParams {
  receivedComment: string;
  tone: ReplyTone;
  count: 3 | 5;
  batch?: number;
}

export function generateFacebookReplies(params: ReplyGenParams): GeneratorResult<string> {
  const comment = cleanText(params.receivedComment);
  if (!comment) {
    return {
      items: [],
      errors: ['Please paste the comment you received so we can draft relevant replies.'],
      warnings: [],
    };
  }
  const batch = params.batch ?? 0;
  const isQuestion =
    /\?/.test(comment) ||
    /^(how|what|when|where|why|who|can|could|do|does|is|are|will|would|any)\b/i.test(comment);
  const terms = extractKeyTerms(comment);
  const topicRef = terms.length >= 2 ? `${terms[0]} ${terms[1]}` : terms[0] || 'that point';

  const banks: Record<ReplyTone, string[]> = {
    Friendly: isQuestion
      ? [
          `Great question about ${topicRef}! Here is the short answer: [insert your quick answer here]—happy to share more details if helpful.`,
          `Glad you asked about ${topicRef}! In short, [explain briefly here]. Let me know if you want me to send over the exact steps.`,
          `Thanks for bringing up ${topicRef}! The quick answer is [insert answer], and we can chat in comments or DM anytime.`,
          `Good catch asking about ${topicRef}—usually [insert your answer here] works best. Have you tried that approach yet?`,
          `Hey! To answer your question on ${topicRef}: [insert details here]. Appreciate you stopping by the post!`,
          `Love that you asked about ${topicRef}! [Add answer here]—hope that clears it up cleanly.`,
        ]
      : [
          `Love hearing your perspective on ${topicRef}—you nailed a detail we were thinking about too!`,
          `So glad you chimed in about ${topicRef}! Have you been testing that approach for a while now?`,
          `Totally agree with what you said about ${topicRef}. Thanks for adding real experience to the thread!`,
          `You make a really good point on ${topicRef}—appreciate you jumping into the conversation here.`,
          `That comment about ${topicRef} made my day! Always great seeing how everyone handles it differently.`,
          `Spot on regarding ${topicRef}! Thanks for sharing your take with the rest of the group.`,
        ],
    Professional: isQuestion
      ? [
          `Thank you for asking about ${topicRef}. To clarify: [insert exact detail/answer]. Please let us know if you need any follow-up information.`,
          `We appreciate your question regarding ${topicRef}. In brief, [insert answer/policy]. Feel free to message our Page for specifics.`,
          `Good question on ${topicRef}. Here is how it works: [insert key explanation]. Happy to provide additional details if needed.`,
          `Thank you for raising that question about ${topicRef}. The short summary is [insert answer], and we can share full resources via DM.`,
          `Glad to help clarify ${topicRef}: [insert concise response]. Let us know if anything else comes up.`,
          `Thanks for reaching out about ${topicRef}. Currently, [insert status/answer]—we appreciate your interest.`,
        ]
      : [
          `Thank you for sharing your insight on ${topicRef}. Practical feedback like this makes the discussion far more valuable for everyone.`,
          `We appreciate your thoughtful note on ${topicRef}. Consistency on that point is something we emphasize closely as well.`,
          `Thank you for taking the time to weigh in on ${topicRef}—it is great to hear how that aligns with your experience.`,
          `Well stated regarding ${topicRef}. Thanks for contributing to the conversation on our Page.`,
          `We value that observation on ${topicRef}. Thank you for engaging with the post today.`,
          `Great addition on ${topicRef}—thank you for highlighting that perspective for readers.`,
        ],
    Funny: isQuestion
      ? [
          `Asking the real question about ${topicRef}! Short version: [insert quick answer]—long version requires a cup of coffee first.`,
          `Ha, fair question on ${topicRef}! Here is the honest scoop: [insert answer]. No manual decoding required.`,
          `You caught us on ${topicRef}! Quick answer: [insert answer]. Let us know if that saves you a headache!`,
          `Love the curiosity on ${topicRef}—the non-boring answer is [insert details]. Happy to clarify more!`,
          `Plot twist: we actually have a straight answer on ${topicRef}! [Insert answer here]—hope that helps!`,
          `Asking about ${topicRef} like a pro! Short answer: [insert answer].`,
        ]
      : [
          `Honestly, your take on ${topicRef} deserves its own post—couldn't have said it better!`,
          `Haha, you nailed the truth about ${topicRef} right there. Glad we're on the same page!`,
          `That remark about ${topicRef} gave us a solid laugh—thanks for bringing good energy to the thread!`,
          `Wait, did you just summarize ${topicRef} better in one comment than my whole post did? Respect!`,
          `10/10 accuracy on ${topicRef}. You clearly have battle scars from this too!`,
          `Saving that line about ${topicRef}—pure gold right there.`,
        ],
    Thankful: isQuestion
      ? [
          `Thank you so much for asking about ${topicRef}! Here is the answer: [insert explanation]. Truly appreciate you engaging here.`,
          `Thanks a ton for bringing up ${topicRef}! To answer your question: [insert details]. Grateful you took a moment to comment.`,
          `Really appreciate your question about ${topicRef}—[insert answer here]. Thank you for being part of this community!`,
          `Thanks kindly for asking about ${topicRef}! [Insert clear answer]. Always happy to help however we can.`,
          `Thank you for your thoughtful question on ${topicRef}. Simply put: [insert answer]. Wishing you a great day!`,
          `So grateful you asked about ${topicRef}! Quick note: [insert details]. Thanks again for reaching out.`,
        ]
      : [
          `Thank you so much for taking the time to share that thought on ${topicRef}—it genuinely means a lot!`,
          `Truly grateful for your kind words on ${topicRef}. Feedback like yours keeps us creating useful updates here.`,
          `Thanks a bunch for adding your note about ${topicRef}! Appreciate your support more than you know.`,
          `So thankful for readers like you chiming in on ${topicRef}—glad this resonated with you today!`,
          `Thank you warmly for pointing out ${topicRef}. Hearing real encouragement from this community always helps!`,
          `Deeply appreciate your comment on ${topicRef}—thank you for being here and sharing!`,
        ],
  };

  return {
    items: rotateSlice(banks[params.tone], params.count, batch),
    errors: [],
    warnings: [],
    note: isQuestion
      ? 'Question detected in comment — replace bracketed placeholders with your exact answer before posting.'
      : 'Replies tailored to the pasted comment content.',
  };
}

// ============================================================================
// 11. Facebook DM Generator
// ============================================================================
export type DmPurpose = 'Outreach' | 'Follow-up' | 'Thank you' | 'Collaboration' | 'Customer reply';
export type DmTone = 'Friendly' | 'Professional' | 'Casual';

export interface DmGenParams {
  purpose: DmPurpose;
  recipientName?: string;
  keyDetails: string;
  tone: DmTone;
  batch?: number;
}

export interface DmVariation {
  label: string;
  message: string;
}

export function generateFacebookDms(params: DmGenParams): GeneratorResult<DmVariation> {
  const details = cleanText(params.keyDetails);
  if (!details) {
    return {
      items: [],
      errors: ['Please enter the key details of what your direct message is about.'],
      warnings: [],
    };
  }
  const name = cleanText(params.recipientName || '');
  const batch = params.batch ?? 0;

  const greetingByTone: Record<DmTone, string> = {
    Friendly: name ? `Hi ${name}!` : 'Hi there!',
    Professional: name ? `Hello ${name},` : 'Hello,',
    Casual: name ? `Hey ${name},` : 'Hey there,',
  };
  const greet = greetingByTone[params.tone];

  const signOffByTone: Record<DmTone, string> = {
    Friendly: 'Looking forward to hearing back whenever you have a minute!',
    Professional: 'Please let me know what works best for your schedule.',
    Casual: 'No rush—just drop a quick reply when you get a chance!',
  };
  const signOff = signOffByTone[params.tone];

  const polishedOptions: Record<DmPurpose, string[]> = {
    Outreach: [
      `${greet} Hope your week is going well.\n\nI wanted to reach out directly about ${details}. Based on what you have been sharing, I thought this could be a helpful fit.\n\nWould you be open to a quick chat or me sending over a couple more details? ${signOff}`,
      `${greet} Thanks for connecting here.\n\nI'm reaching out regarding ${details} because I noticed we share similar goals around this topic.\n\nIf it sounds relevant right now, let me know and I can send a quick summary here in Messenger. ${signOff}`,
    ],
    'Follow-up': [
      `${greet} Just checking back in gently regarding ${details}.\n\nI know messages get buried easily, so I wanted to bring this back to the top of your inbox in case you still wanted to move forward.\n\nWould you like me to share updated info or pause for another week? ${signOff}`,
      `${greet} Hope everything has been smooth on your end.\n\nWanted to follow up briefly on ${details} from our earlier conversation and see if any questions came up.\n\nReply anytime with what works best for you. ${signOff}`,
    ],
    'Thank you': [
      `${greet} Just wanted to send a personal thank-you note regarding ${details}.\n\nSupport and thoughtful engagement like yours really make a difference on our Page and in the community.\n\nIf you ever need help or have feedback on what we share next, just message anytime!`,
      `${greet} Quick message to say thank you for ${details}.\n\nWe genuinely appreciate you taking the time, and it was a pleasure connecting with you here.\n\nFeel free to reach back out whenever we can return the favor!`,
    ],
    Collaboration: [
      `${greet} I have really enjoyed following your recent posts.\n\nI'm messaging you about a potential collaboration around ${details}. I think our audiences would get real value out of teaming up on something simple and practical.\n\nIf you're open to exploring an idea, let me know what format works best for you! ${signOff}`,
      `${greet} Hope you're having a great week!\n\nI wanted to pitch a straightforward collaboration idea involving ${details}. No pressure at all—just thought it could be fun and mutually helpful.\n\nWant me to share a brief outline here? ${signOff}`,
    ],
    'Customer reply': [
      `${greet} Thanks so much for messaging us!\n\nHere are the details regarding ${details}: [confirm availability/pricing/link here].\n\nPlease let us know if you would like to go ahead or if we can clarify anything else for you. ${signOff}`,
      `${greet} Appreciate you reaching out to our Page.\n\nRegarding ${details}, we are happy to help—[insert exact next detail here].\n\nReply right here with your preference and we will get you taken care of! ${signOff}`,
    ],
  };

  const shortAlt1Pool: Record<DmPurpose, string[]> = {
    Outreach: [
      `${greet} Reaching out quickly about ${details}—happy to send a short overview here if you're interested?`,
      `${greet} Quick note on ${details}: thought this might be useful for you. Open to hearing a 2-line summary?`,
    ],
    'Follow-up': [
      `${greet} Just circling back on ${details}—let me know if you still want more info or if timing isn't right!`,
      `${greet} Friendly bump on ${details}. Any questions I can help clear up today?`,
    ],
    'Thank you': [
      `${greet} Quick thank-you for ${details}—genuinely appreciated!`,
      `${greet} Just wanted to say thanks again regarding ${details}. Means a lot!`,
    ],
    Collaboration: [
      `${greet} Would you be open to a quick collab idea around ${details}? Happy to share details here!`,
      `${greet} Loving your content! Any interest in partnering briefly on ${details}?`,
    ],
    'Customer reply': [
      `${greet} Thanks for reaching out about ${details}! [Insert quick answer]—reply here anytime if you need next steps.`,
      `${greet} Happy to help with ${details}! Let us know your preference and we'll follow right up.`,
    ],
  };

  const shortAlt2Pool: Record<DmPurpose, string[]> = {
    Outreach: [
      `${greet} Saw your work and wanted to connect on ${details}. Worth a quick chat this week?`,
      `${greet} Quick hello! Have a practical idea around ${details}—mind if I share it?`,
    ],
    'Follow-up': [
      `${greet} Checking in once more about ${details}—no pressure either way, just let me know!`,
      `${greet} Quick follow-up on ${details} whenever you have a spare moment.`,
    ],
    'Thank you': [
      `${greet} Huge thanks for ${details}! Reach out anytime if I can ever return the help.`,
      `${greet} Dropping a quick note of appreciation for ${details}. Thank you!`,
    ],
    Collaboration: [
      `${greet} Quick question: are you taking on collaborations related to ${details} this month?`,
      `${greet} Thought of a simple joint post idea for ${details}—interested in hearing it?`,
    ],
    'Customer reply': [
      `${greet} Got your note on ${details}! [Add short status/answer]—happy to assist further.`,
      `${greet} Thanks for your message about ${details}. Here's the quickest next step: [add step].`,
    ],
  };

  const pIdx = batch % polishedOptions[params.purpose].length;
  const s1Idx = batch % shortAlt1Pool[params.purpose].length;
  const s2Idx = batch % shortAlt2Pool[params.purpose].length;

  const items: DmVariation[] = [
    {label: 'Polished Full DM', message: polishedOptions[params.purpose][pIdx]},
    {label: 'Short Alternative #1', message: shortAlt1Pool[params.purpose][s1Idx]},
    {label: 'Short Alternative #2', message: shortAlt2Pool[params.purpose][s2Idx]},
  ];

  return {
    items,
    errors: [],
    warnings: [],
    note: 'Send manually via Facebook Messenger — review and personalize details before sending.',
  };
}

// ============================================================================
// 12. Facebook Ad Headline Generator (STRICT <= 40 chars)
// ============================================================================
export type AdHeadlineStyle = 'Benefit' | 'Question' | 'Offer' | 'Urgency';

export interface AdHeadlineParams {
  product: string;
  audience?: string;
  benefitOrOffer?: string;
  style: AdHeadlineStyle;
  count: 5 | 10;
  batch?: number;
}

export interface AdHeadlineItem {
  text: string;
  length: number;
  valid: boolean;
}

export function generateAdHeadlines(params: AdHeadlineParams): GeneratorResult<AdHeadlineItem> {
  const product = cleanText(params.product);
  if (!product) {
    return {items: [], errors: ['Please enter your product or offer name to generate ad headlines.'], warnings: []};
  }
  if (product.length > 40) {
    return {
      items: [],
      errors: [
        `Your product/offer name is ${product.length} characters long, which already exceeds Facebook's 40-character ad headline limit. Shorten it to 35 characters or fewer.`,
      ],
      warnings: [],
    };
  }

  const benefit = cleanText(params.benefitOrOffer || '');
  const audience = cleanText(params.audience || '');
  const batch = params.batch ?? 0;

  const templates: Record<AdHeadlineStyle, string[]> = {
    Benefit: [
      `${product}: Built to Save Time`,
      `Better Results With ${product}`,
      `Try ${product} Today`,
      `Smarter ${product}${audience ? ` for ${audience}` : ''}`,
      `${product} Made Simple`,
      `Upgrade to ${product}`,
      `Get More From ${product}`,
      `${product}: Clear & Reliable`,
      benefit ? `${product} — ${benefit}` : `${product} That Works`,
      `Discover ${product} Now`,
      `Everyday ${product} Solution`,
      `Simple ${product} Setup`,
      `Love Using ${product}`,
    ],
    Question: [
      `Need Better ${product}?`,
      `Ready for ${product}?`,
      `Still Searching for ${product}?`,
      `Tried ${product} Yet?`,
      `Want Easier ${product}?`,
      `Looking for ${product}?`,
      `Why Switch to ${product}?`,
      `Time to Upgrade ${product}?`,
      `Curated ${product} for You?`,
      `Need Faster ${product}?`,
      `Missing ${product}?`,
      `Could ${product} Help Today?`,
    ],
    Offer: [
      benefit ? `${product}: ${benefit}` : `Get ${product} Offer`,
      `Save on ${product} Today`,
      `Shop ${product} Now`,
      `Claim Your ${product}`,
      `${product} Special Offer`,
      `Start With ${product}`,
      `Explore ${product} Plans`,
      `Get Started: ${product}`,
      `${product} — Great Value`,
      `Order ${product} Online`,
      `Unlock ${product} Access`,
      `See ${product} Pricing`,
    ],
    Urgency: [
      `Get ${product} Today`,
      `Don't Miss ${product}`,
      `Limited ${product} Offer`,
      `Start ${product} Now`,
      `Act Fast on ${product}`,
      `${product}: Ends Soon`,
      `Grab ${product} Before Close`,
      `Last Chance for ${product}`,
      `Claim ${product} Today`,
      `Today Only: ${product}`,
      `Reserve ${product} Now`,
      `Fast Access: ${product}`,
    ],
  };

  // Deduplicate and strictly filter/flag <= 40 chars
  const seen = new Set<string>();
  const validPool: AdHeadlineItem[] = [];
  let rejectedCount = 0;

  for (const raw of templates[params.style]) {
    const clean = cleanText(raw);
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    if (clean.length <= 40) {
      validPool.push({text: clean, length: clean.length, valid: true});
    } else {
      rejectedCount++;
    }
  }

  if (validPool.length === 0) {
    return {
      items: [],
      errors: [
        `No headline template fit within 40 characters alongside "${product}" (${product.length} chars). Try a shorter product/offer phrase.`,
      ],
      warnings: [],
    };
  }

  const selected = rotateSlice(validPool, params.count, batch);
  const warnings: string[] = [];
  if (rejectedCount > 0) {
    warnings.push(
      `${rejectedCount} longer template candidate(s) exceeded Facebook's 40-character limit and were rejected automatically.`
    );
  }

  return {
    items: selected,
    errors: [],
    warnings,
    note: 'All displayed headlines are strictly 40 characters or fewer.',
  };
}

// ============================================================================
// 13. Facebook Ad Copy Generator
// ============================================================================
export type AdCopyTone = 'Persuasive' | 'Friendly' | 'Urgent';
export type AdCopyCta = 'Learn More' | 'Shop Now' | 'Sign Up' | 'Message Us';

export interface AdCopyParams {
  product: string;
  audience?: string;
  benefit: string;
  offer?: string;
  tone: AdCopyTone;
  cta: AdCopyCta;
  batch?: number;
}

export interface AdCopyVariation {
  primaryText: string;
  headline: string;
  headlineLength: number;
  descriptionLine: string;
  cta: AdCopyCta;
}

export function generateAdCopy(params: AdCopyParams): GeneratorResult<AdCopyVariation> {
  const product = cleanText(params.product);
  const benefit = cleanText(params.benefit);
  if (!product || !benefit) {
    const errs: string[] = [];
    if (!product) errs.push('Please enter your product or offer name.');
    if (!benefit) errs.push('Please enter the key benefit for your audience.');
    return {items: [], errors: errs, warnings: []};
  }

  const audience = cleanText(params.audience || '');
  const offer = cleanText(params.offer || '');
  const batch = params.batch ?? 0;

  const audPhrase = audience ? `for ${audience}` : 'for busy people';
  const offerParagraph = offer
    ? `Right now, take advantage of ${offer} when you get started with ${product}.`
    : `See how ${product} fits neatly into your routine from day one.`;

  const ctaPrompt: Record<AdCopyCta, string> = {
    'Learn More': `Tap "Learn More" below to explore how ${product} works.`,
    'Shop Now': `Tap "Shop Now" to order ${product} directly online.`,
    'Sign Up': `Tap "Sign Up" to reserve your spot with ${product}.`,
    'Message Us': `Tap "Message Us" to ask questions about ${product} right in Messenger.`,
  };

  const buildHeadline = (candidates: string[]): string => {
    for (const c of candidates) {
      if (c.length <= 40) return c;
    }
    return product.length <= 40 ? product : product.slice(0, 37) + '...';
  };

  const toneVariations: Record<AdCopyTone, AdCopyVariation[]> = {
    Persuasive: [
      {
        primaryText: [
          `Tired of extra steps getting in the way? Meet ${product}—built ${audPhrase} who want ${benefit}.`,
          `Instead of juggling scattered workarounds, ${product} keeps the process focused, practical, and easy to rely on.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`${product}: Built for Results`, `Try ${product} Today`, product]),
        headlineLength: 0,
        descriptionLine: `${benefit.slice(0, 55)}${offer ? ` · ${offer}` : ''}`,
        cta: params.cta,
      },
      {
        primaryText: [
          `If you are looking for ${benefit}, ${product} was designed specifically ${audPhrase}.`,
          `From quick setup to dependable everyday performance, ${product} helps you focus on what actually moves the needle.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Upgrade With ${product}`, `Get ${product} Today`, product]),
        headlineLength: 0,
        descriptionLine: `Designed ${audPhrase} · ${params.cta}`,
        cta: params.cta,
      },
      {
        primaryText: [
          `What changes when ${benefit} stops feeling out of reach?`,
          `${product} gives ${audience || 'users'} a clearer, more dependable path without unnecessary complexity.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Better Results: ${product}`, `Discover ${product}`, product]),
        headlineLength: 0,
        descriptionLine: offer ? `${offer} on ${product}` : `Simple setup with ${product}`,
        cta: params.cta,
      },
    ],
    Friendly: [
      {
        primaryText: [
          `Hey ${audience || 'friends'}—looking for ${benefit} without the usual headache?`,
          `We put together ${product} so you can spend less time troubleshooting and more time enjoying steady progress.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`${product} Made Easy`, `Say Hello to ${product}`, product]),
        headlineLength: 0,
        descriptionLine: `${benefit.slice(0, 55)} — clear & simple`,
        cta: params.cta,
      },
      {
        primaryText: [
          `Good news ${audPhrase}: ${product} makes getting ${benefit} noticeably simpler.`,
          `No steep learning curve—just a practical solution created around real day-to-day needs.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Explore ${product} Today`, `Love Using ${product}`, product]),
        headlineLength: 0,
        descriptionLine: offer ? `${offer} · ${params.cta}` : `${params.cta} about ${product}`,
        cta: params.cta,
      },
      {
        primaryText: [
          `Quick introduction to ${product}, especially if ${benefit} has been at the top of your list.`,
          `We designed ${product} to feel straightforward from your very first try.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Meet ${product}`, `Try ${product} Now`, product]),
        headlineLength: 0,
        descriptionLine: `Built ${audPhrase}`,
        cta: params.cta,
      },
    ],
    Urgent: [
      {
        primaryText: [
          `Don't put off ${benefit} another week—${product} is ready right now ${audPhrase}.`,
          `Get the clarity and speed of ${product} today instead of waiting for a quieter Monday.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Get ${product} Today`, `Act Now: ${product}`, product]),
        headlineLength: 0,
        descriptionLine: offer ? `${offer} — limited window` : `Start ${product} today`,
        cta: params.cta,
      },
      {
        primaryText: [
          `Ready for ${benefit} right away? ${product} helps ${audience || 'your team'} cut wasted effort starting today.`,
          `Everything is streamlined so you can step straight in and test ${product} for yourself.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Start ${product} Now`, `Claim ${product} Today`, product]),
        headlineLength: 0,
        descriptionLine: `${params.cta} before offer ends`,
        cta: params.cta,
      },
      {
        primaryText: [
          `This week is the right time to lock in ${benefit} with ${product}.`,
          `Designed ${audPhrase}, ${product} removes friction fast so you stay ahead of schedule.`,
          offerParagraph,
          ctaPrompt[params.cta],
        ].join('\n\n'),
        headline: buildHeadline([`Don't Miss ${product}`, `${product}: Limited Offer`, product]),
        headlineLength: 0,
        descriptionLine: offer || `${product} — ${params.cta}`,
        cta: params.cta,
      },
    ],
  };

  const pool = toneVariations[params.tone].map((v) => ({
    ...v,
    headlineLength: v.headline.length,
  }));

  return {
    items: rotateSlice(pool, 2, batch),
    errors: [],
    warnings: [],
    note: 'Structured Facebook ad copy — review primary text fold (~125 chars) and ad policies before launching.',
  };
}

// ============================================================================
// 14. Facebook CTA Generator
// ============================================================================
export type CtaGoal = 'Buy' | 'Sign up' | 'Learn more' | 'Comment' | 'Share' | 'Message' | 'Visit';
export type CtaTone = 'Direct' | 'Friendly' | 'Urgent';

export interface CtaGenParams {
  goal: CtaGoal;
  topic?: string;
  tone: CtaTone;
  count: 5 | 10;
  batch?: number;
}

export function generateFacebookCtas(params: CtaGenParams): GeneratorResult<string> {
  const topic = cleanText(params.topic || '');
  if (topic.length > 120) {
    return {items: [], errors: ['Please keep the optional product or topic under 120 characters.'], warnings: []};
  }
  const batch = params.batch ?? 0;
  const t = topic || 'this';
  const withT = topic ? ` ${topic}` : '';

  const goalBanks: Record<CtaGoal, Record<CtaTone, string[]>> = {
    Buy: {
      Direct: [
        `Shop${withT || ' our collection'} today using the link below.`,
        `Order ${t} online in just a couple of clicks.`,
        `Pick up your ${topic || 'order'} directly from our store.`,
        `Tap Shop Now to lock in ${t} for your home or team.`,
        `Browse sizes, options, and pricing for ${t} right here.`,
        `Add ${t} to your cart and check out seamlessly today.`,
        `Get ${t} delivered straight to your door—order below.`,
        `Choose your favorite ${topic || 'option'} and place your order now.`,
        `Ready to buy? Tap the button below to get ${t}.`,
        `Compare packages for ${t} and order online anytime.`,
        `Upgrade your setup with ${t}—available now.`,
      ],
      Friendly: [
        `Treat yourself to ${t} today—tap the link whenever you're ready!`,
        `Curious to bring ${t} home? Take a peek at our shop link below.`,
        `If ${t} has been on your wishlist, grab yours right here!`,
        `Pop over to our shop to see everything included with ${t}.`,
        `Ready when you are—order ${t} through the link below.`,
        `We saved a spot for your ${topic || 'order'}—tap below to pick yours out!`,
        `Take a quick look at ${t} in our store and find your match.`,
        `Love what you see? Bring ${t} into your routine today.`,
        `Tap below to browse ${t} and pick your favorite style!`,
        `Enjoy easy online ordering for ${t} right from this post.`,
        `Grab ${t} for yourself or a friend using the link below.`,
      ],
      Urgent: [
        `Order ${t} today before this current batch sells out.`,
        `Don't wait—grab ${t} now while spots remain open!`,
        `Claim your ${topic || 'order'} tonight before the offer closes.`,
        `Tap Shop Now immediately to secure ${t} at today's rate.`,
        `Last chance to pick up ${t} this week—order below.`,
        `Act quickly and lock in ${t} while supplies last.`,
        `Time is ticking—complete your ${topic || 'order'} before midnight.`,
        `Grab ${t} right now so you don't miss the current window.`,
        `Secure ${t} today before prices return to normal.`,
        `Limited availability on ${t}—order yours right away.`,
        `Don't miss out: tap below to get ${t} today.`,
      ],
    },
    'Sign up': {
      Direct: [
        `Sign up for ${t} updates using the link below.`,
        `Register your spot for ${t} in under 60 seconds.`,
        `Join the ${topic || 'free'} list today using the form below.`,
        `Enter your email to get access to ${t}.`,
        `Tap Sign Up to reserve your seat for ${t}.`,
        `Create your account now and get started with ${t}.`,
        `Subscribe below for upcoming ${topic || 'weekly'} resources.`,
        `Complete quick registration for ${t} before doors close.`,
        `Sign up today to receive our ${topic || 'starter'} checklist.`,
        `Book your place for ${t} directly through the link.`,
        `Join our ${topic || 'member'} list with one quick tap.`,
      ],
      Friendly: [
        `Join us inside ${t}—grab your free spot below!`,
        `Want to stay in the loop on ${t}? Pop your name on the list!`,
        `Come hang out with us—sign up for ${t} right here.`,
        `Save your seat for ${t} in less than a minute!`,
        `We'd love to have you—tap Sign Up to join ${t}.`,
        `Sign up below and we'll send our ${topic || 'welcome'} notes straight over.`,
        `Be the first to hear when ${t} opens—join the list below!`,
        `Take 30 seconds to register for ${t} and join the fun.`,
        `Tap below to subscribe so you never miss our ${topic || 'next'} update.`,
        `Hop onto the list for ${t} whenever you're ready!`,
        `Reserve your spot for ${t} and bring a friend along too.`,
      ],
      Urgent: [
        `Register for ${t} today before sign-ups close!`,
        `Spots for ${t} are filling fast—sign up right now.`,
        `Don't miss the cutoff: claim your ${topic || 'seat'} below today.`,
        `Tap Sign Up now to lock in early access for ${t}.`,
        `Final reminder to register for ${t} before registration ends.`,
        `Join ${t} before tonight's deadline passes.`,
        `Only a few places left for ${t}—save yours immediately!`,
        `Sign up now so you don't get locked out of ${t}.`,
        `Last call to join ${t} this round—register below.`,
        `Act now to get on the list for ${t} before it closes.`,
        `Grab one of the remaining spots in ${t} today.`,
      ],
    },
    'Learn more': {
      Direct: [
        `Tap Learn More below to read the full breakdown on ${t}.`,
        `See how ${t} works step by step on our info page.`,
        `Read the complete details and FAQs for ${t} here.`,
        `Explore specs, pricing, and examples for ${t} below.`,
        `Click through to review everything included in ${t}.`,
        `Get the full guide to ${t} by tapping the link.`,
        `Compare options and features for ${t} on our site.`,
        `View real case examples of ${t} in action below.`,
        `Tap below for clear answers to common ${topic || 'product'} questions.`,
        `Check out the full overview of ${t} at the link.`,
        `Inspect all details of ${t} before deciding.`,
      ],
      Friendly: [
        `Curious how ${t} actually works? Take a closer look below!`,
        `Tap Learn More to see the full story behind ${t}.`,
        `Want the behind-the-scenes details on ${t}? Check out the link!`,
        `Take two minutes to browse our ${topic || 'complete'} overview below.`,
        `Have a quick look at how ${t} can simplify your week.`,
        `We put all the helpful info on ${t} in one place—tap below!`,
        `Peek inside ${t} and see if it feels like the right fit for you.`,
        `Still deciding? Read our quick guide to ${t} right here.`,
        `Learn how ${t} came together by tapping the link below.`,
        `Explore more examples and tips for ${t} on our page!`,
        `Check out the full rundown on ${t} whenever you have a minute.`,
      ],
      Urgent: [
        `Tap Learn More now before today's ${topic || 'special'} window ends.`,
        `Get the details on ${t} right away while spots remain.`,
        `Read how ${t} works today so you can move before the deadline.`,
        `Click through now to catch full details on this limited ${topic || 'update'}.`,
        `Don't wait to check out ${t}—review the info today.`,
        `See what's changing with ${t} right now at the link below.`,
        `Tap Learn More immediately for today's updated ${topic || 'terms'}.`,
        `Check eligibility and details for ${t} before it closes.`,
        `Review ${t} today so you don't miss out this week.`,
        `Get informed fast—tap below to read about ${t} now.`,
        `Open the full breakdown of ${t} before tonight.`,
      ],
    },
    Comment: {
      Direct: [
        `Drop your answer about ${t} in the comments below.`,
        `Share your go-to tip for ${t} in one sentence below.`,
        `Tell us which option works best for your ${topic || 'setup'} in the comments.`,
        `Comment "INFO" or your question about ${t} right below.`,
        `Leave your honest thoughts on ${t} in the thread.`,
        `Vote Option A or Option B for ${t} in the comments.`,
        `Post your biggest takeaway on ${t} below so others can learn too.`,
        `Write one word describing how ${t} is going for you this week.`,
        `Ask your #1 question about ${t} in the comments and we'll reply.`,
        `Share your local recommendation for ${t} below.`,
        `Join the thread and tell us how you handle ${t}.`,
      ],
      Friendly: [
        `We'd love to hear your take on ${t}—drop a comment below!`,
        `Tell us your favorite story or tip around ${t} in the comments!`,
        `Jump into the comments and let us know what you think about ${t}!`,
        `Curious what everyone else does for ${t}—share yours below!`,
        `Drop an emoji or a quick thought if ${t} hits home for you today.`,
        `Who else relates to this about ${t}? Say hi in the comments!`,
        `Let's swap notes on ${t}—what has worked best for you lately?`,
        `Help a fellow reader out by sharing your top ${topic || 'quick'} tip below!`,
        `Don't be shy—leave your vote on ${t} in the comments.`,
        `What did we miss about ${t}? Add your favorite idea below!`,
        `Say hello below and tell us where you're tuning in from today!`,
      ],
      Urgent: [
        `Comment right now to get your ${topic || 'question'} answered in today's round!`,
        `Drop your vote on ${t} below before we tally results tonight!`,
        `Leave a comment today if you want to be included in our next ${topic || 'recap'}.`,
        `Tell us below right away before we finalize this week's ${topic || 'plan'}.`,
        `Quick—drop your favorite pick for ${t} in the comments before 5 PM!`,
        `Post your question about ${t} now while we are actively replying live.`,
        `Weigh in today so your input counts on ${t}!`,
        `Comment "YES" below right away if you want today's notes on ${t}.`,
        `Sound off in the comments today before this thread closes.`,
        `Get your voice heard on ${t}—comment now!`,
        `Reply below immediately with your top choice for ${t}.`,
      ],
    },
    Share: {
      Direct: [
        `Share this post about ${t} with someone who needs it today.`,
        `Save and share this ${topic || 'checklist'} so your friends can find it later.`,
        `Pass this update on ${t} along to your local Facebook Group.`,
        `Click Share to bookmark these ${topic || 'practical'} tips on your timeline.`,
        `Forward this post to a teammate working on ${t}.`,
        `Share this announcement about ${t} with anyone asking about it lately.`,
        `Hit Share so your community doesn't miss these details on ${t}.`,
        `Send this post to a friend who has been talking about ${t}.`,
        `Share this guide on ${t} to help spread the word cleanly.`,
        `Save or share this post before it scrolls out of your feed.`,
        `Help others find ${t} by sharing this post on your Page.`,
      ],
      Friendly: [
        `Know someone dealing with ${t}? Share this post to brighten their day!`,
        `Feel free to share this ${topic || 'helpful'} reminder with friends who'd appreciate it.`,
        `Tag a friend or hit Share so you both have ${t} saved for later!`,
        `Sharing is caring—pass this ${topic || 'post'} along to your crew!`,
        `If ${t} helped you today, hit Share so it can help someone else too.`,
        `Send this over to your group chat if you've all been chatting about ${t}!`,
        `Share this to your timeline so you can find our ${topic || 'tips'} easily next week.`,
        `Think of one friend who loves ${t} and share this with them!`,
        `Spread the word about ${t} by hitting that Share button below.`,
        `Bookmark this for later or share it with a neighbor who asked about ${t}.`,
        `Pass along a little inspiration on ${t} by sharing with your community!`,
      ],
      Urgent: [
        `Share this ${topic || 'notice'} today so friends catch it before the deadline!`,
        `Pass this alert on ${t} along right now while spots remain open.`,
        `Hit Share immediately if anyone in your circle needs ${t} this week!`,
        `Don't let friends miss ${t}—share this post before tonight!`,
        `Spread the word fast about ${t} while today's window is still open.`,
        `Share this update on ${t} today so nobody misses the cutoff.`,
        `Send this to your team right now before we close ${topic || 'entries'}.`,
        `Quick share: make sure people looking for ${t} see this today!`,
        `Hit Share now before this week's ${topic || 'schedule'} fills up.`,
        `Pass this along today—time is limited for ${t}.`,
        `Share immediately with anyone planning around ${t} this month.`,
      ],
    },
    Message: {
      Direct: [
        `Send us a direct message on Facebook for pricing and details on ${t}.`,
        `Tap Message Us below to chat one-on-one about ${t}.`,
        `Message our Page directly with your questions about ${t}.`,
        `Drop us a quick DM mentioning "${topic || 'INFO'}" to get started.`,
        `Tap the Messenger button to request availability for ${t}.`,
        `Send a private message so we can tailor ${t} to your exact needs.`,
        `Reach out in Messenger anytime for a fast quote on ${t}.`,
        `Message our inbox directly if you want personal guidance on ${t}.`,
        `Tap Send Message to confirm details about ${t} today.`,
        `Got specific questions on ${t}? Send them directly to our inbox.`,
        `Start a Messenger chat below and tell us what you need for ${t}.`,
      ],
      Friendly: [
        `Have a question about ${t}? Pop into our DMs—we love chatting!`,
        `Tap Message Us and say hello so we can help you with ${t}!`,
        `Slide into our Page Messenger anytime for friendly help with ${t}.`,
        `Not sure which ${topic || 'option'} fits best? Message us and we'll walk through it together!`,
        `Drop us a quick DM if you'd like extra details or photos of ${t}.`,
        `Feel free to message our inbox—no pressure, happy to answer questions on ${t}!`,
        `Tap the Message button and tell us a little about your goals with ${t}.`,
        `Want personal recommendations for ${t}? Send a quick hello in Messenger!`,
        `We're right on the other end of Messenger—message us anytime about ${t}!`,
        `Send us a friendly DM if you prefer chatting privately about ${t}.`,
        `Tap Message Us to check in—we reply to every note personally!`,
      ],
      Urgent: [
        `Message us right now to lock in today's availability for ${t}!`,
        `Tap Send Message immediately if you want priority details on ${t}.`,
        `DM us "${topic ? topic.split(' ')[0].toUpperCase() : 'NOW'}" today before our remaining slots fill up.`,
        `Reach out in Messenger today so we can hold your spot for ${t}.`,
        `Don't wait—message our Page now while openings for ${t} remain!`,
        `Send a quick DM right away for same-day info on ${t}.`,
        `Tap Message Us now before today's booking window closes.`,
        `Inbox us immediately with your request for ${t} this week!`,
        `Message us before 6 PM today to get included in ${t}.`,
        `Fastest path: tap Message Us now and get instant next steps on ${t}.`,
        `DM us right away—limited spots left for ${t}!`,
      ],
    },
    Visit: {
      Direct: [
        `Visit our website or Page link below to explore ${t}.`,
        `Stop by our shop today to see ${t} in person.`,
        `Check out the full directory for ${t} at the link below.`,
        `Visit our About tab for hours, directions, and details on ${t}.`,
        `Head over to our site to browse everything available for ${t}.`,
        `Click the link below to visit our ${topic || 'resource'} hub today.`,
        `Drop by our location this week and ask us about ${t}.`,
        `Visit our Facebook Page tab for the latest updates on ${t}.`,
        `Open the website link to inspect full details on ${t}.`,
        `Plan a visit this weekend to experience ${t} firsthand.`,
        `Tap the link below to head straight to our ${topic || 'main'} page.`,
      ],
      Friendly: [
        `Come say hello and check out ${t} at the link below!`,
        `Pop over to our site when you have a moment to see ${t}.`,
        `Swing by and visit us soon—we'd love to show you ${t}!`,
        `Take a quick stroll through our page below for more on ${t}.`,
        `Drop in anytime this week to check out what's new with ${t}!`,
        `Head on over to our website for extra behind-the-scenes on ${t}.`,
        `Come visit our community space and explore ${t} with us!`,
        `Tap the link to browse ${t} at your own pace.`,
        `Stop in and see why neighbors love our ${topic || 'latest'} updates!`,
        `Make time for a quick visit below to see full examples of ${t}.`,
        `Come check out our space and grab fresh tips on ${t}!`,
      ],
      Urgent: [
        `Visit us today before this weekend's ${topic || 'showcase'} wraps up!`,
        `Click over to the site right now to catch today's ${topic || 'update'}.`,
        `Stop by before closing today to check out ${t} while available!`,
        `Head to the link now before today's ${topic || 'featured'} window ends.`,
        `Visit our page today—limited-time details on ${t} are live now.`,
        `Swing by right away this week while ${t} is still on display!`,
        `Open the link immediately to catch our current ${topic || 'event'} info.`,
        `Visit today before hours end—don't miss seeing ${t} firsthand.`,
        `Tap through now while ${t} is featured at the top of our site!`,
        `Come visit before Sunday so you don't miss ${t}.`,
        `Check the site right now for today's live updates on ${t}.`,
      ],
    },
  };

  return {
    items: rotateSlice(goalBanks[params.goal][params.tone], params.count, batch),
    errors: [],
    warnings: [],
    note: 'Goal-matched Facebook CTAs — append to posts, Reels, or ad copy.',
  };
}

// ============================================================================
// 15. Facebook Group Name Generator
// ============================================================================
export type GroupPurpose = 'Community' | 'Learning' | 'Buy & Sell' | 'Support' | 'Hobby';
export type GroupNameStyle = 'Descriptive' | 'Creative' | 'Short & catchy';

export interface GroupNameParams {
  topic: string;
  purpose: GroupPurpose;
  audience?: string;
  style: GroupNameStyle;
  count: 5 | 10;
  batch?: number;
}

export function generateGroupNames(params: GroupNameParams): GeneratorResult<string> {
  const topicRaw = cleanText(params.topic);
  if (!topicRaw) {
    return {items: [], errors: ['Please enter a group topic or niche to generate group names.'], warnings: []};
  }
  const topic = titleCasePhrase(topicRaw);
  const audience = cleanText(params.audience || '');
  const aud = audience ? titleCasePhrase(audience) : '';
  const batch = params.batch ?? 0;

  const purposeWords: Record<GroupPurpose, string[]> = {
    Community: ['Community', 'Network', 'Club', 'Connect', 'Hub', 'Circle', 'Society', 'Talk', 'Chat', 'Crew'],
    Learning: ['Academy', 'Study Group', 'Workshop', 'Learners', 'Tips & Guides', 'Mastermind', 'Lab', 'School', 'Mentors', 'Notes'],
    'Buy & Sell': ['Buy & Sell', 'Marketplace', 'Swap & Trade', 'Deals & Finds', 'Exchange', 'Bazaar', 'Classifieds', 'Resale Hub', 'Buy Sell Trade', 'Shop & Swap'],
    Support: ['Support Group', 'Help Desk', 'Care Circle', 'Peer Support', 'Helpers', 'Advice & Support', 'Allies', 'Safe Space', 'Encouragement', 'Community Support'],
    Hobby: ['Enthusiasts', 'Lovers', 'Makers', 'Hobbyists', 'Guild', 'Hangout', 'Fans', 'Collectors', 'Lounge', 'Workshop'],
  };

  const pWords = purposeWords[params.purpose];
  const candidates: string[] = [];

  if (params.style === 'Descriptive') {
    pWords.forEach((pw) => {
      if (aud) {
        candidates.push(`${topic} ${pw} for ${aud}`);
        candidates.push(`${aud} ${topic} ${pw}`);
      } else {
        candidates.push(`${topic} ${pw}`);
        candidates.push(`${topic} Ideas & ${pw}`);
      }
    });
    candidates.push(
      aud ? `${aud} ${topic} Group` : `${topic} Discussion Group`,
      aud ? `${topic} & ${aud} Resource Group` : `Everything ${topic} Group`
    );
  } else if (params.style === 'Creative') {
    const prefixes = ['Inside', 'The Daily', 'Real', 'Beyond', 'Everyday', 'Rooted in', 'All Things', 'Simply', 'Next-Level', 'Open'];
    const suffixes = ['Lounge', 'Collective', 'Corner', 'Commons', 'Bench', 'Porch', 'Circle', 'Studio', 'Table', 'Beacon'];
    pWords.forEach((pw, idx) => {
      const pre = prefixes[idx % prefixes.length];
      const suf = suffixes[idx % suffixes.length];
      if (aud) {
        candidates.push(`${pre} ${topic} (${aud} ${pw})`);
        candidates.push(`${aud}'s ${topic} ${suf}`);
      } else {
        candidates.push(`${pre} ${topic} ${suf}`);
        candidates.push(`The ${topic} ${pw}`);
      }
    });
  } else {
    // Short & catchy
    const shortEndings = pWords.map((w) => w.split(' ')[0]);
    shortEndings.forEach((end, idx) => {
      if (aud && idx % 2 === 0) {
        candidates.push(`${aud} ${topic} ${end}`);
      } else {
        candidates.push(`${topic} ${end}`);
      }
    });
    candidates.push(
      `Team ${topic}`,
      `Just ${topic}`,
      `${topic} HQ`,
      `My ${topic}`
    );
  }

  const unique = [...new Set(candidates.map((n) => n.replace(/\s+/g, ' ').trim()))];
  return {
    items: rotateSlice(unique, params.count, batch),
    errors: [],
    warnings: [],
    note: 'Names are constructed strictly from your inputs without checking live Facebook availability.',
  };
}

// ============================================================================
// 16. Facebook Group Description Generator
// ============================================================================
export type GroupDescTone = 'Welcoming' | 'Professional' | 'Casual';

export interface GroupDescParams {
  groupName: string;
  topic: string;
  whoFor?: string;
  rulesSummary?: string;
  tone: GroupDescTone;
  batch?: number;
}

export function generateGroupDescriptions(params: GroupDescParams): GeneratorResult<string> {
  const groupName = cleanText(params.groupName);
  const topic = cleanText(params.topic);
  if (!groupName || !topic) {
    const errs: string[] = [];
    if (!groupName) errs.push('Please enter your Facebook Group name.');
    if (!topic) errs.push('Please enter the main Group topic.');
    return {items: [], errors: errs, warnings: []};
  }

  const whoFor = cleanText(params.whoFor || '');
  const batch = params.batch ?? 0;

  const userRules = (params.rulesSummary || '')
    .split('\n')
    .map((r) => r.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

  const usingStarterRules = userRules.length === 0;
  const rulesList = usingStarterRules
    ? [
        'Be kind and respectful—constructive feedback is welcome, personal attacks are not.',
        `Keep posts relevant to ${topic} so threads stay genuinely useful.`,
        'No unsolicited spam, self-promotion dumps, or affiliate link drops.',
      ]
    : userRules;

  const rulesHeader = usingStarterRules
    ? 'Group Rules (Starter suggestion — please edit to fit your group):'
    : 'Group Rules:';
  const rulesBlock = rulesList.map((r, i) => `${i + 1}. ${r}`).join('\n');

  const whoSection = whoFor
    ? `Who this group is for:\nThis space is designed for ${whoFor} who want practical conversations around ${topic}.`
    : `Who this group is for:\nAnyone interested in learning, sharing experiences, and connecting with others focused on ${topic}.`;

  const whatYouFind = [
    `• Honest discussions, Q&A threads, and real feedback on ${topic}`,
    `• Practical tips, helpful resources, and community-tested ideas`,
    `• Friendly check-ins and peer support from members sharing similar interests`,
  ].join('\n');

  const welcomeByTone: Record<GroupDescTone, string[]> = {
    Welcoming: [
      `Welcome to ${groupName}! We are glad you're here. This community is all about connecting around ${topic} in a supportive, practical, and friendly space.`,
      `Hello and welcome to ${groupName}—a warm community built for sharing real experiences, asking open questions, and growing together around ${topic}.`,
      `Glad you found ${groupName}! Whether you are brand new to ${topic} or have years of experience to share, you have a seat at the table here.`,
    ],
    Professional: [
      `Welcome to ${groupName}. This group provides a focused forum for constructive discussion, resource sharing, and peer insights centered on ${topic}.`,
      `Thank you for joining ${groupName}—a dedicated community for exchanging informed perspectives, practical strategies, and thoughtful dialogue on ${topic}.`,
      `${groupName} brings together focused members committed to sharing clear, reliable insights and real-world lessons on ${topic}.`,
    ],
    Casual: [
      `Hey, welcome to ${groupName}! Think of this as our laid-back hangout spot to swap notes, ask anything, and talk all things ${topic}.`,
      `Welcome in! ${groupName} is an easygoing space to share wins, troubleshoot ${topic}, and chat with people who get it.`,
      `Glad to have you in ${groupName}! Grab a coffee, introduce yourself, and jump into any ${topic} thread that catches your eye.`,
    ],
  };

  const descriptions = welcomeByTone[params.tone].map((welcome) =>
    [
      welcome,
      whoSection,
      `What you'll find here:\n${whatYouFind}`,
      `${rulesHeader}\n${rulesBlock}`,
    ].join('\n\n')
  );

  return {
    items: rotateSlice(descriptions, 2, batch),
    errors: [],
    warnings: [],
    note: usingStarterRules
      ? 'Includes starter community rules — customize them to match your group moderation policy.'
      : 'Built directly from your group details and rules.',
  };
}
