// Pure deterministic browser helpers for Threads tools (zero AI, zero server calls)

/**
 * Counts user-perceived Unicode grapheme clusters (emojis, surrogate pairs) accurately.
 * Guarantees that an emoji counts as 1 character, not 2.
 */
export function countUnicodeChars(text: string): number {
  if (!text) return 0;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
    let count = 0;
    for (const _ of segmenter.segment(text)) {
      count++;
    }
    return count;
  }
  return Array.from(text).length;
}

// ---------------------------------------------------------------------------
// 1. Threads Username Validator & Generator
// ---------------------------------------------------------------------------

export interface ThreadsUsernameRuleCheck {
  id: string;
  label: string;
  passed: boolean;
  explanation: string;
  fixSuggestion?: string;
}

export interface ThreadsUsernameCheckResult {
  username: string;
  normalized: string;
  charCount: number;
  valid: boolean;
  checks: ThreadsUsernameRuleCheck[];
}

/**
 * Threads usernames are linked to connected Instagram accounts.
 * Standard rule: Up to 30 characters, letters, numbers, periods, and underscores.
 * Cannot start or end with a period, and cannot have consecutive periods.
 */
export function validateThreadsUsername(raw: string): ThreadsUsernameCheckResult {
  const trimmed = raw.trim();
  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  const charCount = handle.length;

  const lengthOk = charCount >= 1 && charCount <= 30;
  const charsOk = handle.length > 0 && /^[a-zA-Z0-9._]+$/.test(handle);
  const noEdgePeriods = handle.length > 0 && !/^\./.test(handle) && !/\.$/.test(handle);
  const noConsecutivePeriods = handle.length > 0 && !/\.{2,}/.test(handle);
  const noSpaces = handle.length > 0 && !/\s/.test(handle);

  const checks: ThreadsUsernameRuleCheck[] = [
    {
      id: 'length',
      label: 'Length is up to 30 characters',
      passed: lengthOk,
      explanation: lengthOk
        ? `Username is ${charCount} character(s) long (within the 30-character Instagram/Threads limit).`
        : charCount === 0
          ? 'Username cannot be empty.'
          : `Too long (${charCount} characters). Threads usernames cannot exceed 30 characters.`,
      fixSuggestion: charCount > 30 ? 'Shorten or abbreviate words to fit within 30 characters.' : undefined,
    },
    {
      id: 'allowed-chars',
      label: 'Only letters, numbers, periods, and underscores',
      passed: charsOk,
      explanation: charsOk
        ? 'Uses only allowed characters (a–z, 0–9, ., _).'
        : 'Contains forbidden characters (such as emojis, hyphens, or symbols like @, #, $, !).',
      fixSuggestion: !charsOk ? 'Remove all special symbols or hyphens and use only letters, numbers, dots, or underscores.' : undefined,
    },
    {
      id: 'no-edge-periods',
      label: 'Cannot start or end with a period',
      passed: noEdgePeriods,
      explanation: noEdgePeriods
        ? 'Does not start or end with a dot.'
        : 'Threads usernames cannot begin or end with a period (.).',
      fixSuggestion: !noEdgePeriods ? 'Remove leading or trailing periods.' : undefined,
    },
    {
      id: 'no-consecutive-periods',
      label: 'No consecutive periods (..)',
      passed: noConsecutivePeriods,
      explanation: noConsecutivePeriods
        ? 'No double periods.'
        : 'Threads does not allow consecutive periods like "..".',
      fixSuggestion: !noConsecutivePeriods ? 'Use a single period or replace with an underscore.' : undefined,
    },
    {
      id: 'no-spaces',
      label: 'No spaces anywhere',
      passed: noSpaces,
      explanation: noSpaces ? 'Contains no spaces.' : 'Threads usernames cannot contain spaces.',
      fixSuggestion: !noSpaces ? 'Remove spaces or replace with an underscore or period.' : undefined,
    },
  ];

  const valid = checks.every((c) => c.passed);

  return {
    username: raw,
    normalized: handle.toLowerCase(),
    charCount,
    valid,
  checks,
  };
}

export type ThreadsUsernameStyle = 'cool' | 'cute' | 'short' | 'professional';

export function generateThreadsUsernames(params: {
  keyword: string;
  style: ThreadsUsernameStyle;
  count: 5 | 10;
  variation?: number;
}): { usernames: { username: string; chars: number; valid: boolean }[]; error?: string } {
  const kw = params.keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!kw) {
    return { usernames: [], error: 'Please enter a name, nickname, or keyword to generate username ideas.' };
  }

  const base = kw.slice(0, 16);

  const styleTemplates: Record<ThreadsUsernameStyle, string[]> = {
    cool: [
      `${base}.threads`,
      `the.${base}`,
      `real.${base}`,
      `${base}_daily`,
      `iam.${base}`,
      `${base}.raw`,
      `${base}_hq`,
      `its.${base}`,
      `${base}_online`,
      `prime.${base}`,
      `${base}.log`,
      `${base}_notes`,
    ],
    cute: [
      `little.${base}`,
      `${base}.cozy`,
      `mini.${base}`,
      `${base}_puff`,
      `soft.${base}`,
      `${base}.tea`,
      `honey.${base}`,
      `${base}_bun`,
      `sweet.${base}`,
      `${base}.cafe`,
    ],
    short: [
      `v_${base.slice(0, 8)}`,
      `z.${base.slice(0, 8)}`,
      `${base.slice(0, 10)}x`,
      `q_${base.slice(0, 8)}`,
      `${base.slice(0, 8)}_7`,
      `x.${base.slice(0, 8)}`,
      `j_${base.slice(0, 8)}`,
      `${base.slice(0, 8)}z`,
    ],
    professional: [
      `${base}.design`,
      `${base}_consulting`,
      `${base}.studio`,
      `build.with.${base}`,
      `${base}_works`,
      `${base}.insights`,
      `${base}_media`,
      `hello.${base}`,
      `${base}.agency`,
      `exec.${base}`,
    ],
  };

  const pool = styleTemplates[params.style] || styleTemplates.cool;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected: { username: string; chars: number; valid: boolean }[] = [];
  for (const candidate of rotated) {
    const check = validateThreadsUsername(candidate);
    if (check.valid && !selected.some((u) => u.username === candidate)) {
      selected.push({
        username: candidate,
        chars: candidate.length,
        valid: true,
      });
      if (selected.length >= params.count) break;
    }
  }

  // Fallback if needed
  if (selected.length < params.count) {
    let num = 1;
    while (selected.length < params.count && num < 50) {
      const fallback = `${base}_${num}`;
      if (!selected.some((u) => u.username === fallback)) {
        selected.push({
          username: fallback,
          chars: fallback.length,
          valid: true,
        });
      }
      num++;
    }
  }

  return { usernames: selected };
}

// ---------------------------------------------------------------------------
// 2. Threads Bio Generator (STRICT ≤ 150 CHARACTERS)
// ---------------------------------------------------------------------------

export type ThreadsBioVibe = 'casual' | 'professional' | 'funny' | 'minimal';

export function generateThreadsBios(params: {
  input: string;
  vibe: ThreadsBioVibe;
  count: 3 | 5;
  variation?: number;
}): { bios: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const input = params.input.trim();
  if (!input) {
    return { bios: [], error: 'Please enter your name, profession, or interests for your Threads bio.' };
  }

  const clean = input.length > 30 ? input.slice(0, 30).trim() : input;

  const templates: Record<ThreadsBioVibe, string[]> = {
    casual: [
      `Just here for unfiltered thoughts & ${clean} ☕ | Let’s chat in the replies 👇`,
      `Thinking out loud about ${clean} 💭 | Casual takes & honest conversations`,
      `Living somewhere between ${clean} and too much coffee ☕✨`,
      `Documenting ${clean} one thread at a time 🧵 | Say hi below!`,
      `Zero filter, just ${clean} thoughts and everyday observations 🍃`,
      `Here to share honest stories about ${clean} • Follow along ✌️`,
    ],
    professional: [
      `Building & sharing insights on ${clean} 💡 | Daily observations for builders`,
      `Helping creators master ${clean} 🚀 | Weekly case studies & lessons learned`,
      `Exploring the future of ${clean} 📈 | Frameworks, data & operator notes`,
      `${clean} strategist • Writing daily threads on growth & leadership 💼`,
      `Curating practical lessons on ${clean} 🔍 | Connect & share ideas below`,
      `Founder perspective on ${clean} 🛠️ | Actionable thoughts every morning`,
    ],
    funny: [
      `Overthinking ${clean} so you don’t have to 🙃 | Expert in accidental chaos`,
      `My hobbies include ${clean} and starting replies I never finish 💀`,
      `Here to deliver spicy hot takes about ${clean} and regret them later 😂`,
      `Probably distracted by ${clean} right now 🫠 | Professional doomscroller`,
      `10/10 would talk about ${clean} again 🍟 | Join my unhinged threads`,
      `My Threads account is 90% ${clean} and 10% poor impulse control 🤡`,
    ],
    minimal: [
      `${clean}. Thoughts & threads.`,
      `Exploring ${clean} 🕊️`,
      `${clean} / daily notes / 🧵`,
      `Less noise. More ${clean} ☁️`,
      `${clean} in practice.`,
      `Observing ${clean} daily 🍃`,
    ],
  };

  const pool = templates[params.vibe] || templates.casual;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected = rotated.slice(0, params.count).map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 150,
    };
  });

  return { bios: selected };
}

// ---------------------------------------------------------------------------
// 3. Threads Post Generator (SINGLE POST STRICT ≤ 500 CHARS)
// ---------------------------------------------------------------------------

export type ThreadsPostTone = 'casual' | 'thoughtful' | 'funny' | 'bold';

export function generateThreadsPosts(params: {
  topic: string;
  tone: ThreadsPostTone;
  count: 5;
  variation?: number;
}): { posts: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { posts: [], error: 'Please enter a topic or message for your Threads post.' };
  }

  const clean = topic.length > 50 ? topic.slice(0, 50).trim() : topic;

  const templates: Record<ThreadsPostTone, string[]> = {
    casual: [
      `Quick reminder about ${clean}:\n\nYou don’t need everything figured out to start making progress. The best insights usually come after you take messy action, not before.\n\nWhat’s your current take on this?`,
      `Can we talk about ${clean} for a second?\n\nIt feels like everyone is overcomplicating it right now. Keeping things simple almost always outperforms complex systems in the long run.\n\nAgree or disagree?`,
      `A small observation on ${clean} today:\n\nMost people quit right before things start compounding. Consistency is boring, but it works every single time.\n\nHow do you stay on track?`,
      `Unpopular opinion on ${clean}:\n\nFocusing on doing one thing really well beats trying to juggle ten trendy tactics at once.\n\nWhat’s one thing you’re doubling down on this week?`,
      `Thinking about ${clean} this morning:\n\nProgress isn’t linear. Some days are about momentum, other days are about resting so you don’t burn out. Give yourself permission to pace yourself.`,
      `If you’re currently dealing with ${clean}, here’s a thought:\n\nDon’t compare your day 1 to someone else’s day 1,000. Keep your head down and build your own lane.`,
    ],
    thoughtful: [
      `The biggest lesson I’ve learned about ${clean}:\n\nSuccess isn't about avoiding mistakes—it's about shortening the time it takes to learn from them and adapt.\n\nWhen you stop taking setbacks personally, you unlock genuine creative confidence.\n\nWhat lesson took you the longest to learn?`,
      `A framework that changed how I approach ${clean}:\n\n1. Identify the single highest-leverage bottleneck.\n2. Ignore 90% of the minor distractions.\n3. Iterate in public with honest feedback.\n\nSimplicity creates clarity. Clarity creates execution.`,
      `Most discussions about ${clean} focus on the wrong metric.\n\nWe obsess over speed, but direction matters infinitely more. Moving slowly toward the right goal beats sprinting in the wrong direction every time.`,
      `Reflecting on ${clean} after years of trial and error:\n\nThe people who succeed aren’t superhuman. They just built systems that made consistency easier than quitting.\n\nCurious what systems work best for you?`,
      `One counter-intuitive truth about ${clean}:\n\nSaying "no" to good opportunities is the only way to leave room for truly great ones. Protect your focus ruthlessly.`,
    ],
    funny: [
      `My relationship with ${clean} can be summarized in three stages:\n\n1. "This will be so easy!"\n2. "Wait, why is this happening?"\n3. "Send help, I have made a terrible mistake."\n\nWho else is currently at stage 2? 💀`,
      `Nobody warned me that adulthood would just be me trying to figure out ${clean} while pretending I know what I’m doing 😭`,
      `Plot twist: ${clean} wasn't the problem. My complete lack of patience was the problem 😂`,
      `Pro tip regarding ${clean}: Just pretend you have full confidence until the universe gets tired of questioning you 🙃`,
      `Mentally I am 100% committed to ${clean}. Physically I am lying on the couch drinking iced coffee ☕🫠`,
    ],
    bold: [
      `Hard truth about ${clean} that most people aren't ready to hear:\n\nStop waiting for the "perfect moment." It doesn’t exist. The only people who win are the ones willing to put their reputation on the line and execute now.\n\nProve me wrong.`,
      `Stop overthinking ${clean}.\n\nWhile you’re writing endless pros and cons lists, someone with half your talent is already shipping and collecting real feedback.\n\nAction beats contemplation every single day.`,
      `The secret to mastering ${clean} isn't another course or tool.\n\nIt’s discipline. Showing up when you don’t feel inspired is what separates professionals from hobbyists.`,
      `If your approach to ${clean} looks like everyone else’s, you’re guaranteed average results.\n\nDare to be distinct. Break the conventional playbook.`,
      `Here is the reality of ${clean}: Nobody is coming to save you or hand you success. Take total ownership of your craft and build relentlessly.`,
    ],
  };

  const pool = templates[params.tone] || templates.casual;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected = rotated.slice(0, params.count).map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { posts: selected };
}

// ---------------------------------------------------------------------------
// 4. Threads Caption Generator (STRICT ≤ 500 CHARACTERS)
// ---------------------------------------------------------------------------

export type ThreadsCaptionStyle = 'punchy' | 'storytelling' | 'question' | 'humorous';

export function generateThreadsCaptions(params: {
  topic: string;
  style: ThreadsCaptionStyle;
  count: 5 | 10;
  variation?: number;
}): { captions: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { captions: [], error: 'Please enter a moment or topic for your Threads photo caption.' };
  }

  const clean = topic.length > 40 ? topic.slice(0, 40).trim() : topic;

  const templates: Record<ThreadsCaptionStyle, string[]> = {
    punchy: [
      `Moments like this remind me why ${clean} matters so much. ☕✨`,
      `Current mood: completely immersed in ${clean}. 🕊️`,
      `Less talk, more ${clean}. 🌿`,
      `Found peace in ${clean} today. ☁️`,
      `${clean} hit different when the sun goes down. 🌅`,
      `Small wins, quiet hours, and ${clean}. 🕯️`,
      `Everything feels lighter when you focus on ${clean}. 🍃`,
      `Simple moments > everything else. (${clean}) ✨`,
      `Documenting ${clean} for future me. 📸`,
      `Good vibes and ${clean} on repeat. 💫`,
    ],
    storytelling: [
      `A few weeks ago, I couldn't have imagined enjoying ${clean} this much.\n\nIt’s funny how a small shift in routine changes your entire perspective. Sometimes the best things in life are the ones you didn't plan for.`,
      `Took a step back today to appreciate ${clean}.\n\nWe get so caught up chasing the next big milestone that we forget to enjoy the chapter we’re currently in. Hope everyone gets some downtime today.`,
      `Behind this photo of ${clean} was an hour of chaos, a spilled cup of coffee, and lots of laughter.\n\nSocial media always looks pristine, but real life is delightfully messy.`,
      `The story behind ${clean}:\n\nIt started as a random experiment and turned into one of my favorite parts of my week. Never underestimate trying something new on a whim.`,
      `Spent the afternoon reflecting on ${clean}.\n\nSurrounding yourself with good energy and quiet focus makes all the difference in the world. Grateful for this moment.`,
    ],
    question: [
      `Quick question for everyone on Threads:\n\nWhat’s your honest take on ${clean}? Are you all in, or still skeptical?\n\nDrop your thoughts in the replies 👇`,
      `Be honest: how often do you actually make time for ${clean} during the week?\n\nCurious how everyone here balances it!`,
      `If you could change one thing about how people approach ${clean}, what would it be?`,
      `What’s the best piece of advice you’ve ever received about ${clean}? Sharing mine in the replies!`,
      `Anyone else obsessed with ${clean} right now, or is it just my algorithm playing tricks on me? 😅`,
    ],
    humorous: [
      `I told myself I was only going to spend 5 minutes on ${clean}.\n\nThree hours later, here we are. Send reinforcements 💀☕`,
      `My brain: "You should go to sleep."\nMe: "Or I could spend 2 hours researching ${clean}." 🫠`,
      `Photographic evidence that I occasionally participate in ${clean} and leave the house 😂📸`,
      `Doing ${clean} purely for the aesthetic and the serotonin. Zero regrets 💅`,
      `If loving ${clean} is wrong, I don't want to be right 🍟🤡`,
    ],
  };

  const pool = templates[params.style] || templates.punchy;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected: string[] = [];
  let i = 0;
  while (selected.length < params.count && i < 30) {
    selected.push(rotated[i % rotated.length]);
    i++;
  }

  const results = selected.map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { captions: results };
}

// ---------------------------------------------------------------------------
// 5. Threads Hashtag Generator (ONE TOPIC TAG PER POST RULE)
// ---------------------------------------------------------------------------

export function generateThreadsHashtags(params: {
  topic: string;
  count: 5 | 10;
  variation?: number;
}): { tags: { tag: string; label: string }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { tags: [], error: 'Please enter a topic to generate relevant Threads topic tags.' };
  }

  // Clean words
  const words = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const camelTopic = words.map(capitalize).join('');
  const firstWord = words[0] ? capitalize(words[0]) : 'Topic';
  const secondWord = words[1] ? capitalize(words[1]) : '';

  const candidates = [
    `#${camelTopic}`,
    `#${firstWord}Life`,
    `#${firstWord}Community`,
    `#${firstWord}Daily`,
    `#${firstWord}Tips`,
    secondWord ? `#${secondWord}` : `#${firstWord}Chat`,
    `#${firstWord}Creators`,
    `#${firstWord}Talk`,
    `#${firstWord}Notes`,
    `#${camelTopic}Hub`,
    `#Ask${firstWord}`,
    `#${firstWord}Mindset`,
  ];

  const unique = Array.from(new Set(candidates));
  const offset = params.variation || 0;
  const rotated = [...unique.slice(offset % unique.length), ...unique.slice(0, offset % unique.length)];

  const selected = rotated.slice(0, params.count).map((tag) => ({
    tag,
    label: `Single Topic Tag for ${topic}`,
  }));

  return { tags: selected };
}

// ---------------------------------------------------------------------------
// 6. Threads Hook Generator (STRICT ≤ 500 CHARACTERS)
// ---------------------------------------------------------------------------

export type ThreadsHookStyle = 'question' | 'bold' | 'story' | 'contrarian';

export function generateThreadsHooks(params: {
  topic: string;
  style: ThreadsHookStyle;
  count: 5 | 10;
  variation?: number;
}): { hooks: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { hooks: [], error: 'Please enter a topic to generate punchy opening post hooks.' };
  }

  const clean = topic.length > 40 ? topic.slice(0, 40).trim() : topic;

  const templates: Record<ThreadsHookStyle, string[]> = {
    question: [
      `Why is almost everyone approaching ${clean} the wrong way?`,
      `What’s the one lesson about ${clean} you had to learn the hard way?`,
      `Is it just me, or has ${clean} completely changed over the last 6 months?`,
      `If you could only give one piece of advice on ${clean}, what would it be?`,
      `Have you noticed how the people who succeed at ${clean} rarely talk about luck?`,
      `What if everything you were told about ${clean} was outdated?`,
      `How much time do you actually waste overthinking ${clean}?`,
      `Are we ready to have an honest conversation about ${clean}?`,
      `What would happen if you stopped worrying about ${clean} and just executed?`,
      `Why do 90% of beginners quit ${clean} within their first month?`,
    ],
    bold: [
      `Stop overcomplicating ${clean}. Here is the only framework you need:`,
      `The harsh reality of ${clean} nobody wants to say out loud:`,
      `Most advice on ${clean} is written by people who don't actually do the work.`,
      `Here is the single biggest unlock for ${clean} that doubled my results:`,
      `If your strategy for ${clean} hasn't changed this year, you're falling behind.`,
      `I’m convinced that 99% of people fail at ${clean} for one simple reason:`,
      `You don’t have a ${clean} problem. You have a consistency problem.`,
      `The secret to ${clean} isn't complicated. Most people are just lazy.`,
      `Delete every generic playbook about ${clean}. Do this instead:`,
      `Mastering ${clean} takes 6 months of boring, disciplined execution. Period.`,
    ],
    story: [
      `Two years ago, I almost quit ${clean} completely. Here’s what changed:`,
      `A client asked me why their ${clean} wasn't working. The answer was brutal:`,
      `I spent 100 hours analyzing ${clean} so you don't have to waste time.`,
      `Last week, I made a huge mistake with ${clean}. Here is what it cost me:`,
      `When I started ${clean}, I believed three major lies. Let's break them down:`,
      `The best mentor I ever had gave me one piece of advice on ${clean}:`,
      `I used to think ${clean} was all about talent. Then I saw this:`,
      `My biggest breakthrough in ${clean} came after my worst failure.`,
      `Here’s the exact breakdown of how I transformed my approach to ${clean}:`,
      `A quick story about ${clean} that completely rewired how I work:`,
    ],
    contrarian: [
      `Popular opinion says ${clean} is essential. I disagree—here’s why:`,
      `Doing less is actually the fastest way to get ahead with ${clean}.`,
      `Why following traditional best practices for ${clean} is a trap:`,
      `You don't need expensive tools or software to win at ${clean}.`,
      `The best thing that ever happened to my ${clean} was ignoring common advice.`,
      `Why working harder on ${clean} won't fix a broken strategy:`,
      `Most "rules" about ${clean} were made to be broken.`,
      `Speed is overrated. When it comes to ${clean}, patience is the real moat.`,
      `Stop trying to optimize ${clean} before you have built the baseline habit.`,
      `The consensus view on ${clean} is completely backwards. Let me explain:`,
    ],
  };

  const pool = templates[params.style] || templates.question;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected: string[] = [];
  let i = 0;
  while (selected.length < params.count && i < 30) {
    selected.push(rotated[i % rotated.length]);
    i++;
  }

  const results = selected.map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { hooks: results };
}

// ---------------------------------------------------------------------------
// 7. Threads Post Idea Generator
// ---------------------------------------------------------------------------

export type ThreadsPostIdeaType = 'any' | 'opinion' | 'story' | 'advice' | 'question' | 'hot_take';

export interface ThreadsPostIdea {
  id: string;
  title: string;
  postType: string;
  conceptAngle: string;
  whyItWorks: string;
}

export function generateThreadsPostIdeas(params: {
  topic: string;
  audience?: string;
  postType: ThreadsPostIdeaType;
  count: 5 | 10;
  variation?: number;
}): { ideas: ThreadsPostIdea[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { ideas: [], error: 'Please enter a niche or topic to generate Threads post ideas.' };
  }

  const aud = params.audience?.trim() ? `for ${params.audience.trim()}` : 'for your readers';

  const bank: ThreadsPostIdea[] = [
    {
      id: 'th-idea-1',
      title: `The 1 Habit That Transformed My ${topic}`,
      postType: 'Advice',
      conceptAngle: `Break down the single daily habit that brought the biggest compounding gains in ${topic} ${aud}.`,
      whyItWorks: 'Actionable micro-habits spark high bookmark/save rates and direct replies sharing personal routines.',
    },
    {
      id: 'th-idea-2',
      title: `Unpopular Hot Take on ${topic}`,
      postType: 'Hot take',
      conceptAngle: `Challenge a sacred cow or trendy orthodoxy in ${topic}. Be polite but firmly grounded in real results.`,
      whyItWorks: 'Respectful controversy drives the algorithm through lively debate in the replies.',
    },
    {
      id: 'th-idea-3',
      title: `Before vs After: What I Wish I Knew About ${topic}`,
      postType: 'Story',
      conceptAngle: `Compare where you were when you started ${topic} vs today, highlighting the most embarrassing misconception.`,
      whyItWorks: 'Relatable vulnerability establishes authentic trust and human connection on Threads.',
    },
    {
      id: 'th-idea-4',
      title: `Open Discussion: What’s your biggest struggle with ${topic}?`,
      postType: 'Question',
      conceptAngle: `Ask a targeted question inviting peers ${aud} to vent or share their current roadblocks regarding ${topic}.`,
      whyItWorks: 'Low friction prompt makes it effortless for lurkers to leave their first reply.',
    },
    {
      id: 'th-idea-5',
      title: `The 3 Tools I Actually Use for ${topic}`,
      postType: 'Opinion',
      conceptAngle: `Cut through software bloat by sharing the only 3 lean tools or resources you rely on daily for ${topic}.`,
      whyItWorks: 'Curated simplicity provides immediate utility that people love to repost.',
    },
    {
      id: 'th-idea-6',
      title: `A 60-Second Framework for Tackling ${topic}`,
      postType: 'Advice',
      conceptAngle: `Condense a complex process in ${topic} into 3 clean, bulleted steps anyone can implement today.`,
      whyItWorks: 'Bite-sized frameworks make readers feel empowered and grateful.',
    },
    {
      id: 'th-idea-7',
      title: `The Expensive Mistake I Made in ${topic}`,
      postType: 'Story',
      conceptAngle: `Share a costly or time-wasting error you made in ${topic} and the exact adjustment that fixed it.`,
      whyItWorks: 'Loss prevention and cautionary tales have the highest read-through completion rates.',
    },
    {
      id: 'th-idea-8',
      title: `Why Most Beginners Quit ${topic}`,
      postType: 'Opinion',
      conceptAngle: `Analyze the psychological valley of despair people hit when learning ${topic} and how to push through.`,
      whyItWorks: 'Validates reader struggles and positions you as an empathetic leader.',
    },
  ];

  let filtered = bank;
  if (params.postType !== 'any') {
    const label = params.postType.replace(/_/g, ' ').toLowerCase();
    const matched = bank.filter((b) => b.postType.toLowerCase().includes(label));
    if (matched.length > 0) filtered = matched;
  }

  const offset = params.variation || 0;
  const rotated = [...filtered.slice(offset % filtered.length), ...filtered.slice(0, offset % filtered.length)];

  const selected: ThreadsPostIdea[] = [];
  let idx = 0;
  while (selected.length < params.count && idx < 30) {
    selected.push(rotated[idx % rotated.length]);
    idx++;
  }

  return { ideas: selected };
}

// ---------------------------------------------------------------------------
// 8. Threads Reply Generator (ANSWERS SOMEONE ELSE'S POST IN CONVERSATION)
// ---------------------------------------------------------------------------

export type ThreadsReplyIntent = 'agree' | 'add_value' | 'disagree' | 'question';
export type ThreadsReplyTone = 'friendly' | 'witty' | 'thoughtful';

export function generateThreadsReplies(params: {
  originalPost: string;
  intent: ThreadsReplyIntent;
  tone: ThreadsReplyTone;
}): { replies: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const original = params.originalPost.trim();
  if (!original) {
    return { replies: [], error: 'Please paste the original Threads post you want to reply to.' };
  }

  const snippet = original.length > 40 ? original.slice(0, 40).trim() + '...' : original;

  const responses: Record<ThreadsReplyIntent, Record<ThreadsReplyTone, string[]>> = {
    agree: {
      friendly: [
        `100% with you on this! Especially your point about "${snippet}". It took me a while to realize this, but once it clicked, everything got so much easier.`,
        `Couldn't agree more. So many people overlook this exact point. Thanks for putting words to what a lot of us have been feeling! 🙌`,
        `Spot on! The simplicity of this approach is what makes it so powerful. Appreciate you sharing this reminder today ✨`,
      ],
      witty: [
        `Finally, someone said it out loud! Printing this out and taping it to my monitor so I don't forget 😂🙌`,
        `Louder for the people in the back! 📢 Honestly one of the most accurate takes I’ve seen on Threads all week.`,
        `You just saved me about 6 months of overthinking with one post. Where do I send the thank you coffee? ☕💀`,
      ],
      thoughtful: [
        `This resonates deeply. In my experience, the hardest part isn't understanding this truth—it's having the daily discipline to stick with it when things get noisy.`,
        `Completely agree. What makes this perspective valuable is how it cuts through the common trend of over-engineering solutions. Well articulated.`,
        `Strongly second this. There is a compound benefit to this mindset that only reveals itself after sustained execution. Great reflection.`,
      ],
    },
    add_value: {
      friendly: [
        `Great post! To add a small tactical tip that helped me: pair this with a simple end-of-day review. Just 5 minutes of reflection doubles the retention of this concept.`,
        `Love this! One thing that worked wonders for me was setting a hard boundary on overthinking: give yourself 15 minutes to plan, then immediately execute the first step.`,
        `Such a good breakdown. Another angle worth considering is how your environment reinforces this—removing small points of friction makes following through effortless!`,
      ],
      witty: [
        `Great point! I'll add my golden rule: if the solution requires more than three bullet points, you’re probably doing too much 🙃 Keep it simple!`,
        `Adding this to my personal toolkit. Step 1: read your post. Step 2: actually stop procrastinating. (Step 2 is currently pending, but we’re making progress) 🫠`,
        `Brilliant. Pro tip from personal experience: don't tell yourself you'll do it "tomorrow." Tomorrow is a trap. Start with 2 minutes today! ⚡`,
      ],
      thoughtful: [
        `Fascinating point. Building on this, I’ve found that documenting the friction points along the way prevents you from repeating the same missteps next quarter.`,
        `Insightful take. One adjacent dimension that often gets overlooked is psychological safety: when people aren't afraid of messy first drafts, this execution accelerates tenfold.`,
        `Well said. An important corollary is knowing when to pivot—maintaining this momentum while staying receptive to real-world feedback is where the true leverage lies.`,
      ],
    },
    disagree: {
      friendly: [
        `Really interesting take! I see where you’re coming from, though in my experience, the opposite has often held true when dealing with early-stage projects. Appreciate the different perspective though! 🤝`,
        `Respectful counter-thought: while this works exceptionally well in mature systems, beginners often need a bit more structure before they can thrive with this freedom. Curious how you view that balance!`,
        `I love seeing different viewpoints on this! Personally, I’ve found that pacing and taking extra time upfront saved me from costly rewrites later on. Thanks for sparking the debate!`,
      ],
      witty: [
        `I respectfully submit my hot take: I tried this exact approach once and ended up in a multi-week existential crisis 😂 Different strokes for different folks!`,
        `Spicy take! I might be the odd one out here, but I think there’s a strong case for doing the exact opposite in certain scenarios. Love the debate though! 🍿`,
        `I want to agree with you, I really do, but my past mistakes are screaming at me from the corner 💀 Appreciate the challenge to conventional wisdom!`,
      ],
      thoughtful: [
        `A thoughtful post, though I’d offer a slight nuance. While this model holds in predictable environments, high-volatility contexts often require a more conservative risk buffer.`,
        `Respectfully challenging this premise: is it possible that the outcome here is a symptom rather than the root cause? In my observations, the underlying constraint is usually misaligned incentives.`,
        `I appreciate you putting this out there. While there’s clear merit to your reasoning, I wonder if this approach scales beyond smaller teams without introducing friction elsewhere.`,
      ],
    },
    question: {
      friendly: [
        `Really appreciate this perspective! How do you typically handle the transition phase when you're first putting this into practice? Would love to hear your approach!`,
        `Such a good reflection. What was the pivotal moment or experiment that made you realize this was the right way forward?`,
        `This is great! Do you find that this applies universally, or are there specific exceptions where you take a different route?`,
      ],
      witty: [
        `This sounds amazing in theory, but be honest: how many cups of coffee did it take to figure this out? ☕ Asking for a friend!`,
        `Love this! Question though: what do you do on the days when motivation is at zero and the couch is calling your name? 😂`,
        `Fascinating! How do you stop yourself from slipping back into old habits when the chaos inevitably hits? 🫠`,
      ],
      thoughtful: [
        `Compelling take. If you had to identify the single most critical leading indicator that tells you this is working, what metric would you track?`,
        `Thought-provoking post. How do you distinguish between necessary patience during the plateau vs realizing the strategy needs a fundamental pivot?`,
        `Really valuable insight. What is the most common counter-argument you hear when introducing this framework, and how do you address it?`,
      ],
    },
  };

  const pool = responses[params.intent]?.[params.tone] || responses.agree.friendly;

  const results = pool.map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { replies: results };
}

// ---------------------------------------------------------------------------
// 9. Threads Comment Generator (STANDALONE COMMENT ON TOPIC)
// ---------------------------------------------------------------------------

export type ThreadsCommentStyle = 'supportive' | 'insightful' | 'funny' | 'question';

export function generateThreadsComments(params: {
  topic: string;
  style: ThreadsCommentStyle;
  count: 5;
  variation?: number;
}): { comments: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { comments: [], error: 'Please enter a post topic or paste text to generate standalone comment drafts.' };
  }

  const clean = topic.length > 40 ? topic.slice(0, 40).trim() : topic;

  const templates: Record<ThreadsCommentStyle, string[]> = {
    supportive: [
      `This is such an important reminder about ${clean}. Taking the leap is always intimidating, but celebrating these small steps makes all the difference. Cheering you on! 👏✨`,
      `Really needed to read this take on ${clean} today. It’s so easy to feel isolated when working through this, but knowing others share the journey is huge. Thank you for sharing! 🤍`,
      `Huge kudos for putting this out there. The honesty around ${clean} is so refreshing in a space that often only showcases finished highlight reels. Keep going! 🚀`,
      `Love seeing people speak openly about ${clean}. It takes genuine courage to do things differently. Sending good energy your way! 🕊️`,
      `Standing ovation for this! The compound effect of staying dedicated to ${clean} will speak for itself. Beautifully said! 🌟`,
    ],
    insightful: [
      `The key takeaway with ${clean} is that clarity follows action, never the other way around. Most people stall because they wait to feel ready instead of building confidence through repetitions.`,
      `What makes ${clean} so tricky is that the feedback loop is often delayed by months. The people who win are the ones who evaluate their input habits rather than short-term vanity metrics.`,
      `A subtle but vital distinction regarding ${clean}: it’s not about working more hours—it’s about eliminating low-yield cognitive drag so you have peak energy for high-leverage tasks.`,
      `When analyzing ${clean}, the simplest diagnosis is almost always right: reduce complexity, establish a repeatable daily cadence, and protect your focus blocks relentlessly.`,
      `The real competitive advantage in ${clean} is emotional resilience. Tactics become commoditized quickly, but having the patience to stick with the basics is remarkably rare.`,
    ],
    funny: [
      `I feel personally attacked by this post about ${clean} 💀 (And by attacked, I mean I completely agree and need to fix my life immediately) 😂`,
      `Me nodding along to this post about ${clean} while actively doing the exact opposite on my other monitor 🙃☕`,
      `Not me taking screenshots of this ${clean} post like I’m actually going to review them later 🫠 (10/10 truth bomb though!)`,
      `Can we please make this mandatory reading for anyone attempting ${clean}? I could have saved two years of my youth 😭🤡`,
      `The way you just summarized my entire struggle with ${clean} in one post is borderline disrespectful 😂🙌`,
    ],
    question: [
      `Such a thoughtful angle on ${clean}! What was the initial catalyst that led you to rethink this whole process?`,
      `Fascinating perspective on ${clean}. Do you find that this mindset came naturally over time, or was there a specific mentor who helped you frame it?`,
      `Love this discussion. If someone is just starting out with ${clean} today, what is the single biggest trap you’d warn them to avoid?`,
      `Really compelling take! How do you balance sticking to this approach with ${clean} when client or peer expectations push for faster, lower-quality output?`,
      `Great post! What’s your favorite routine or resource for maintaining momentum with ${clean} when motivation is running low?`,
    ],
  };

  const pool = templates[params.style] || templates.supportive;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected = rotated.slice(0, params.count).map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { comments: selected };
}

// ---------------------------------------------------------------------------
// 10. Threads Content Calendar Generator
// ---------------------------------------------------------------------------

export type ThreadsCalendarCadence = 2 | 3 | 5 | 7;
export type ThreadsCalendarMix = 'any' | 'opinions' | 'stories' | 'advice' | 'questions' | 'mixed';

export interface ThreadsCalendarEntry {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  postType: string;
  title: string;
  concept: string;
  suggestedTag: string;
}

export function generateThreadsCalendar(params: {
  topic: string;
  postsPerWeek: ThreadsCalendarCadence;
  startDate: string;
  contentMix: ThreadsCalendarMix;
}): { entries: ThreadsCalendarEntry[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { entries: [], error: 'Please enter a niche or topic for your Threads content calendar.' };
  }

  const start = new Date(params.startDate ? params.startDate + 'T00:00:00' : Date.now());
  if (isNaN(start.getTime())) {
    return { entries: [], error: 'Please choose a valid start date.' };
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIntervals: Record<ThreadsCalendarCadence, number[]> = {
    2: [0, 4],
    3: [0, 2, 5],
    5: [0, 1, 2, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };

  const activeDays = dayIntervals[params.postsPerWeek] || [0, 2, 5];

  const firstWord = topic.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, '') || 'Threads';
  const tag = `#${firstWord}`;

  const templateBank = [
    {
      postType: 'Advice',
      title: `3 Unconventional Lessons in ${topic}`,
      concept: `Break down the non-obvious rules that brought you the biggest ROI in ${topic}.`,
    },
    {
      postType: 'Opinion',
      title: `Why the Standard Playbook on ${topic} Fails`,
      concept: `Highlight the flaw in common advice and explain your streamlined alternative.`,
    },
    {
      postType: 'Question',
      title: `What’s the 1 Thing Slowing Down Your ${topic}?`,
      concept: `Ask an open discussion question to invite peers to share their biggest current bottleneck.`,
    },
    {
      postType: 'Story',
      title: `The Mistake That Cost Me 3 Months in ${topic}`,
      concept: `Share a personal, relatable cautionary tale with the exact tactical fix you discovered.`,
    },
    {
      postType: 'Hot Take',
      title: `Doing Less is the Real Secret to ${topic}`,
      concept: `Challenge tool/tactic bloat by demonstrating how cutting distractions accelerated growth.`,
    },
    {
      postType: 'Advice',
      title: `60-Second Quick Guide to Mastering ${topic}`,
      concept: `Clean, 3-bullet framework anyone can screenshot or save to their notes app.`,
    },
    {
      postType: 'Story',
      title: `Before vs After: Reflecting on My Journey in ${topic}`,
      concept: `Inspiring comparison showing where you began vs today, celebrating messy consistency.`,
    },
  ];

  const entries: ThreadsCalendarEntry[] = [];
  for (let i = 0; i < activeDays.length; i++) {
    const dayOffset = activeDays[i];
    const curDate = new Date(start.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = dayNames[curDate.getDay()];
    const dateStr = curDate.toISOString().slice(0, 10);
    const tmpl = templateBank[i % templateBank.length];

    let postType = tmpl.postType;
    if (params.contentMix === 'opinions') postType = 'Opinion';
    if (params.contentMix === 'stories') postType = 'Story';
    if (params.contentMix === 'advice') postType = 'Advice';
    if (params.contentMix === 'questions') postType = 'Question';

    entries.push({
      dayNumber: i + 1,
      dateStr,
      dayOfWeek,
      postType,
      title: tmpl.title,
      concept: tmpl.concept,
      suggestedTag: tag,
    });
  }

  return { entries };
}

export function serializeThreadsCalendarCsv(entries: ThreadsCalendarEntry[]): string {
  const header = ['Day', 'Date', 'Day of Week', 'Post Type', 'Post Title & Concept', 'Single Topic Tag'];
  const rows = entries.map((e) => [
    `Day ${e.dayNumber}`,
    e.dateStr,
    e.dayOfWeek,
    e.postType,
    `"${e.title.replace(/"/g, '""')} — ${e.concept.replace(/"/g, '""')}"`,
    `"${e.suggestedTag}"`,
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// 11. Threads Poll Generator (2–4 OPTIONS, ≤25 CHARS PER OPTION, ≤500 QUESTION)
// ---------------------------------------------------------------------------

export interface ThreadsPollResult {
  question: string;
  options: string[];
  durationHours: number;
  durationLabel: string;
  formattedText: string;
  isValid: boolean;
  errors: string[];
}

export function formatThreadsPoll(params: {
  question: string;
  options: string[];
  duration: '24h' | '3d' | '7d';
}): ThreadsPollResult {
  const errors: string[] = [];
  const q = params.question.trim();
  const qChars = countUnicodeChars(q);

  if (!q) {
    errors.push('Please enter a poll question.');
  } else if (qChars > 500) {
    errors.push(`Poll question exceeds 500 characters (${qChars}/500).`);
  }

  const cleanedOptions = params.options.map((o) => o.trim()).filter(Boolean);
  if (cleanedOptions.length < 2) {
    errors.push('Threads polls require at least 2 options.');
  } else if (cleanedOptions.length > 4) {
    errors.push('Threads polls support a maximum of 4 options.');
  }

  cleanedOptions.forEach((opt, idx) => {
    const chars = countUnicodeChars(opt);
    if (chars > 25) {
      errors.push(`Option ${idx + 1} exceeds the 25-character button cap (${chars}/25): "${opt}".`);
    }
  });

  const durationMap: Record<string, { hours: number; label: string }> = {
    '24h': { hours: 24, label: '24 Hours (Standard)' },
    '3d': { hours: 72, label: '3 Days' },
    '7d': { hours: 168, label: '7 Days' },
  };

  const dur = durationMap[params.duration] || durationMap['24h'];

  const lines = [
    q,
    '',
    ...cleanedOptions.map((opt, i) => `[ Option ${i + 1} ]: ${opt}`),
    '',
    `Poll Duration: ${dur.label}`,
  ];

  return {
    question: q,
    options: cleanedOptions,
    durationHours: dur.hours,
    durationLabel: dur.label,
    formattedText: lines.join('\n'),
    isValid: errors.length === 0,
    errors,
  };
}

// ---------------------------------------------------------------------------
// 12. Threads Quote Generator (QUOTED POST + COMMENT/ANGLE ≤ 500 CHARS)
// ---------------------------------------------------------------------------

export type ThreadsQuoteTone = 'thoughtful' | 'funny' | 'bold' | 'supportive';

export function generateThreadsQuotePosts(params: {
  quotedPost: string;
  userComment: string;
  tone: ThreadsQuoteTone;
}): { quotePosts: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const quoted = params.quotedPost.trim();
  const comment = params.userComment.trim();

  if (!quoted) {
    return { quotePosts: [], error: 'Please paste the post you want to quote.' };
  }
  if (!comment) {
    return { quotePosts: [], error: 'Please enter your comment or angle about the quoted post.' };
  }

  // Truncate quoted snippet cleanly if very long so total post fits 500 chars
  const quoteSnippet = quoted.length > 120 ? quoted.slice(0, 115).trim() + '...' : quoted;

  const toneFrames: Record<ThreadsQuoteTone, (c: string, q: string) => string[]> = {
    thoughtful: (c, q) => [
      `${c}\n\nThis hits on a critical nuance often missed when discussing this:\n"“${q}”"`,
      `Worth pausing on this thought:\n\n${c}\n\nContext:\n"“${q}”"`,
      `${c}\n\nInsightful perspective from the original post:\n"“${q}”"`,
    ],
    bold: (c, q) => [
      `This needs to be shouted from the rooftops:\n\n${c}\n\nOriginal post:\n"“${q}”"`,
      `${c}\n\nProof that simplicity always wins:\n"“${q}”"`,
      `Stop scrolling and read this:\n\n${c}\n\n"“${q}”"`,
    ],
    funny: (c, q) => [
      `${c} 😂💀\n\n(Never related to a post more than this):\n"“${q}”"`,
      `I did not need to be called out like this on my feed today:\n\n${c}\n\n"“${q}”"`,
      `${c}\n\n10/10 truth bomb right here:\n"“${q}”"`,
    ],
    supportive: (c, q) => [
      `Couldn't agree more with this message. ${c}\n\nOriginal reflection:\n"“${q}”" 👏✨`,
      `Such an important reminder for everyone on Threads today. ${c}\n\n"“${q}”" 🤍`,
      `Huge yes to this. ${c}\n\n"“${q}”" 🙌`,
    ],
  };

  const builder = toneFrames[params.tone] || toneFrames.thoughtful;
  const candidates = builder(comment, quoteSnippet);

  const results = candidates.map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 500,
    };
  });

  return { quotePosts: results };
}

// ---------------------------------------------------------------------------
// 13. Threads Thread Generator (SPLITS LONG TEXT INTO CONNECTED POSTS ≤ 500 CHARS)
// ---------------------------------------------------------------------------

export function splitThreadsPost(text: string): string[] {
  const clean = text.trim();
  if (!clean) return [];

  // If text already fits within 500 characters, return single post
  if (countUnicodeChars(clean) <= 500) {
    return [clean];
  }

  // Split into paragraphs or sentences
  const paragraphs = clean.split(/\n\n+/);
  const rawChunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if (!currentChunk) {
      if (countUnicodeChars(para) <= 460) {
        currentChunk = para;
      } else {
        // Break large paragraph by sentences
        const sentences = para.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [para];
        for (const s of sentences) {
          if (!currentChunk) {
            currentChunk = s.trim();
          } else if (countUnicodeChars(currentChunk + ' ' + s.trim()) <= 460) {
            currentChunk = currentChunk + ' ' + s.trim();
          } else {
            rawChunks.push(currentChunk);
            currentChunk = s.trim();
          }
        }
      }
    } else if (countUnicodeChars(currentChunk + '\n\n' + para) <= 460) {
      currentChunk = currentChunk + '\n\n' + para;
    } else {
      rawChunks.push(currentChunk);
      currentChunk = para;
    }
  }
  if (currentChunk) {
    rawChunks.push(currentChunk);
  }

  // Format with numbered thread counters: (1/N)
  const total = rawChunks.length;
  return rawChunks.map((chunk, i) => `${chunk}\n\n(${i + 1}/${total})`);
}

// ---------------------------------------------------------------------------
// 14. Threads Engagement Calculator
// ---------------------------------------------------------------------------

export interface ThreadsEngagementResult {
  followers: number;
  likes: number;
  replies: number;
  reposts: number;
  totalInteractions: number;
  erPercent: number;
  formulaDisplay: string;
  tier: string;
  tierNote: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export function calculateThreadsEngagement(params: {
  followers: number;
  likes: number;
  replies: number;
  reposts: number;
}): ThreadsEngagementResult {
  const { followers, likes, replies, reposts } = params;

  if (isNaN(followers) || isNaN(likes) || isNaN(replies) || isNaN(reposts)) {
    return {
      followers: 0,
      likes: 0,
      replies: 0,
      reposts: 0,
      totalInteractions: 0,
      erPercent: 0,
      formulaDisplay: '',
      tier: 'Invalid',
      tierNote: '',
      status: 'invalid',
      error: 'Please enter valid numeric values for all fields.',
    };
  }

  if (followers < 0 || likes < 0 || replies < 0 || reposts < 0) {
    return {
      followers,
      likes,
      replies,
      reposts,
      totalInteractions: 0,
      erPercent: 0,
      formulaDisplay: '',
      tier: 'Invalid',
      tierNote: '',
      status: 'invalid',
      error: 'Metrics cannot be negative numbers.',
    };
  }

  if (followers === 0) {
    return {
      followers: 0,
      likes,
      replies,
      reposts,
      totalInteractions: likes + replies + reposts,
      erPercent: 0,
      formulaDisplay: 'Engagement Rate (%) = ((Likes + Replies + Reposts) / Followers) × 100',
      tier: 'Zero Base',
      tierNote: 'Followers count must be at least 1 to calculate engagement rate (cannot divide by zero).',
      status: 'invalid',
      error: 'Followers count must be greater than 0 to divide. (Cannot divide by 0 followers).',
    };
  }

  const totalInteractions = likes + replies + reposts;
  const rawEr = (totalInteractions / followers) * 100;
  const erPercent = Math.round(rawEr * 100) / 100;

  let tier = 'Average (1% – 2.5%)';
  let tierNote = 'Solid conversational performance within standard Threads benchmarks.';

  if (erPercent < 1) {
    tier = 'Below Average (<1%)';
    tierNote = 'Low interaction. Try adding an open question hook to encourage replies.';
  } else if (erPercent >= 5) {
    tier = 'Viral / Exceptional (5%+)';
    tierNote = 'Outstanding performance! Strong reply velocity and community sharing.';
  } else if (erPercent >= 2.5) {
    tier = 'High Engagement (2.5% – 5%)';
    tierNote = 'Above average! Active discussion in replies and healthy repost traction.';
  }

  return {
    followers,
    likes,
    replies,
    reposts,
    totalInteractions,
    erPercent,
    formulaDisplay: `Engagement Rate (%) = ((${likes} Likes + ${replies} Replies + ${reposts} Reposts) / ${followers} Followers) × 100 = ${erPercent}%`,
    tier,
    tierNote,
    status: 'valid',
  };
}

// ---------------------------------------------------------------------------
// 15. Threads Stylish Text Generator (DECORATIVE EMBELLISHMENTS & BRACKETS)
// ---------------------------------------------------------------------------

export interface ThreadsStylishItem {
  id: string;
  name: string;
  result: string;
}

export function generateThreadsStylishText(rawText: string): ThreadsStylishItem[] {
  const t = rawText.trim() ? rawText : 'Threads Conversation';

  return [
    { id: 'corner-brackets', name: 'Japanese Corner Brackets', result: `『 ${t} 』` },
    { id: 'solid-brackets', name: 'Black Lenticular Brackets', result: `【 ${t} 】` },
    { id: 'sparkles', name: 'Sparkle Stars', result: `✧･ﾟ: *✧ ${t} ✧*:･ﾟ✧` },
    { id: 'aesthetic-wings', name: 'Aesthetic Winged', result: `꧁ ${t} ꧂` },
    { id: 'shooting-star', name: 'Shooting Star', result: `★彡 ${t} 彡★` },
    { id: 'guillemets', name: 'Double Arrows', result: `« ${t} »` },
    { id: 'lightning', name: 'Lightning Bolts', result: `⚡ ${t} ⚡` },
    { id: 'cloud-puff', name: 'Soft Clouds', result: `☁️ ${t} ☁️` },
    { id: 'heart-border', name: 'Heart Border', result: `♡ ${t} ♡` },
    { id: 'cross-star', name: 'Diamond Cross', result: `✦ ${t} ✦` },
    { id: 'flame', name: 'Hot Take Flames', result: `🔥 ${t} 🔥` },
    { id: 'thread-spool', name: 'Thread Spool', result: `🧵 ${t} 🧵` },
  ];
}

// ---------------------------------------------------------------------------
// 16. Threads Unicode Font Generator (UNICODE ALPHABETS — DISTINCT TOOL)
// ---------------------------------------------------------------------------

export interface ThreadsFontItem {
  id: string;
  name: string;
  result: string;
}

export function generateThreadsUnicodeFonts(rawText: string): ThreadsFontItem[] {
  const text = rawText.trim() ? rawText : 'Threads Post';

  const transform = (map: Record<string, string>) => {
    return Array.from(text)
      .map((char) => map[char] || char)
      .join('');
  };

  const boldSansMap: Record<string, string> = {
    A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠',
    N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺',
    n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
  };

  const boldSerifMap: Record<string, string> = {
    A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌',
    N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
    a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦',
    n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
  };

  const italicSansMap: Record<string, string> = {
    A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔',
    N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
    a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮',
    n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
  };

  const scriptMap: Record<string, string> = {
    A: '𝒜', B: '𝐵', C: '𝒞', D: '𝒟', E: '𝐸', F: '𝐹', G: '𝒢', H: '𝐻', I: '𝐼', J: '𝒥', K: '𝒦', L: '𝐿', M: '𝑀',
    N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: '𝑅', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
    a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂',
    n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
  };

  const doubleStruckMap: Record<string, string> = {
    A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄',
    N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',
    a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞',
    n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
  };

  const monospaceMap: Record<string, string> = {
    A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
    N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
    a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
    n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
  };

  const circledMap: Record<string, string> = {
    A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ',
    N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',
    a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ',
    n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: '𝑞', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
  };

  return [
    { id: 'bold-sans', name: 'Bold Sans', result: transform(boldSansMap) },
    { id: 'bold-serif', name: 'Bold Serif', result: transform(boldSerifMap) },
    { id: 'italic-sans', name: 'Italic Sans', result: transform(italicSansMap) },
    { id: 'cursive-script', name: 'Cursive Script', result: transform(scriptMap) },
    { id: 'double-struck', name: 'Double Struck / Blackboard', result: transform(doubleStruckMap) },
    { id: 'monospace', name: 'Monospace Code', result: transform(monospaceMap) },
    { id: 'circled', name: 'Circled Bubble', result: transform(circledMap) },
  ];
}
