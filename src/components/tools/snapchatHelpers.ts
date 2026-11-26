// Pure deterministic browser helpers for Snapchat tools (zero AI, zero server calls)

/**
 * Counts user-perceived Unicode grapheme clusters (emojis, surrogate pairs) accurately.
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
// 1. Snapchat Username Validator & Generator
// ---------------------------------------------------------------------------

export interface SnapchatUsernameRuleCheck {
  id: string;
  label: string;
  passed: boolean;
  explanation: string;
  fixSuggestion?: string;
}

export interface SnapchatUsernameCheckResult {
  username: string;
  normalized: string;
  charCount: number;
  valid: boolean;
  checks: SnapchatUsernameRuleCheck[];
}

/**
 * Evaluates a username string against official Snapchat username format rules.
 * Disclaimer: FORMAT-ONLY. Checks syntax rules only. Live availability must be checked in the official Snapchat app.
 */
export function validateSnapchatUsername(raw: string): SnapchatUsernameCheckResult {
  const trimmed = raw.trim();
  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  const charCount = handle.length;

  const lengthOk = charCount >= 3 && charCount <= 15;
  const startsWithLetter = /^[a-zA-Z]/.test(handle);
  const charsOk = handle.length > 0 && /^[a-zA-Z0-9._-]+$/.test(handle);
  const noEndSymbols = handle.length > 0 && !/[-._]$/.test(handle);
  const noSpaces = handle.length > 0 && !/\s/.test(handle);
  const noConsecutiveSymbols = handle.length > 0 && !/[-._]{2,}/.test(handle);

  const checks: SnapchatUsernameRuleCheck[] = [
    {
      id: 'length',
      label: 'Length is between 3 and 15 characters',
      passed: lengthOk,
      explanation: lengthOk
        ? `Username is ${charCount} character(s) long (within the 3–15 character limit).`
        : charCount < 3
          ? `Too short (${charCount} characters). Snapchat requires at least 3 characters.`
          : `Too long (${charCount} characters). Snapchat usernames cannot exceed 15 characters.`,
      fixSuggestion: charCount < 3
        ? 'Add letters or numbers to reach at least 3 characters.'
        : charCount > 15
          ? 'Shorten or abbreviate words to fit within 15 characters.'
          : undefined,
    },
    {
      id: 'starts-with-letter',
      label: 'Starts with a letter (a–z)',
      passed: startsWithLetter,
      explanation: startsWithLetter
        ? 'Begins with an alphabetical letter.'
        : 'Snapchat usernames must always start with a letter (cannot start with a number or symbol).',
      fixSuggestion: !startsWithLetter ? 'Start your handle with a letter (e.g. a–z).' : undefined,
    },
    {
      id: 'allowed-chars',
      label: 'Contains only letters, numbers, periods, underscores, or hyphens',
      passed: charsOk,
      explanation: charsOk
        ? 'Uses only allowed characters (a–z, 0–9, ., _, -).'
        : 'Contains forbidden characters (such as emojis, spaces, or special symbols like @, #, $, !).',
      fixSuggestion: !charsOk ? 'Remove all special symbols or emojis and use only letters, numbers, or . _ -' : undefined,
    },
    {
      id: 'no-end-symbols',
      label: 'Does not end with a period, underscore, or hyphen',
      passed: noEndSymbols,
      explanation: noEndSymbols
        ? 'Ends with a letter or number.'
        : 'Snapchat usernames cannot end with a period (.), underscore (_), or hyphen (-).',
      fixSuggestion: !noEndSymbols ? 'Remove the trailing symbol at the end of the username.' : undefined,
    },
    {
      id: 'no-spaces',
      label: 'No spaces anywhere',
      passed: noSpaces,
      explanation: noSpaces ? 'Contains no spaces.' : 'Snapchat usernames cannot contain spaces.',
      fixSuggestion: !noSpaces ? 'Remove spaces or replace with an underscore or period.' : undefined,
    },
    {
      id: 'no-consecutive-symbols',
      label: 'No consecutive symbols (e.g. .., --, __)',
      passed: noConsecutiveSymbols,
      explanation: noConsecutiveSymbols
        ? 'No repeated or consecutive punctuation marks.'
        : 'Snapchat does not permit consecutive symbols like "..", "__", or "-_".',
      fixSuggestion: !noConsecutiveSymbols ? 'Use single symbols between words instead of double symbols.' : undefined,
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

export type SnapchatUsernameStyle = 'cool' | 'cute' | 'funny' | 'short';

export function generateSnapchatUsernames(params: {
  keyword: string;
  style: SnapchatUsernameStyle;
  count: 5 | 10;
  variation?: number;
}): { usernames: { username: string; chars: number; valid: boolean }[]; error?: string } {
  const kw = params.keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!kw) {
    return { usernames: [], error: 'Please enter a name, nickname, or keyword to generate username ideas.' };
  }

  // Ensure keyword starts with a letter if possible
  const base = /^[a-z]/.test(kw) ? kw : `snap${kw}`;
  const truncatedBase = base.slice(0, 10);

  const styleTemplates: Record<SnapchatUsernameStyle, string[]> = {
    cool: [
      `${truncatedBase}.snap`,
      `the.${truncatedBase}`,
      `real.${truncatedBase}`,
      `${truncatedBase}_vibe`,
      `iam.${truncatedBase}`,
      `${truncatedBase}_xo`,
      `${truncatedBase}.hq`,
      `its.${truncatedBase}`,
      `${truncatedBase}_live`,
      `prime.${truncatedBase}`,
      `${truncatedBase}_99`,
      `${truncatedBase}.zone`,
      `just.${truncatedBase}`,
      `${truncatedBase}_on`,
    ],
    cute: [
      `lil.${truncatedBase}`,
      `${truncatedBase}.pie`,
      `mini.${truncatedBase}`,
      `${truncatedBase}_puff`,
      `cozy.${truncatedBase}`,
      `${truncatedBase}.xo`,
      `honey.${truncatedBase}`,
      `${truncatedBase}_bun`,
      `soft.${truncatedBase}`,
      `${truncatedBase}.pup`,
      `tiny.${truncatedBase}`,
      `${truncatedBase}.tea`,
    ],
    funny: [
      `not.${truncatedBase}`,
      `${truncatedBase}.exe`,
      `whois.${truncatedBase}`,
      `send.${truncatedBase}`,
      `${truncatedBase}.lol`,
      `fake.${truncatedBase}`,
      `lazy.${truncatedBase}`,
      `${truncatedBase}_afk`,
      `zero.${truncatedBase}`,
      `${truncatedBase}.rip`,
      `oops.${truncatedBase}`,
      `${truncatedBase}_no`,
    ],
    short: [
      `z_${truncatedBase.slice(0, 7)}`,
      `v.${truncatedBase.slice(0, 7)}`,
      `${truncatedBase.slice(0, 8)}x`,
      `q_${truncatedBase.slice(0, 7)}`,
      `${truncatedBase.slice(0, 7)}_7`,
      `x.${truncatedBase.slice(0, 7)}`,
      `${truncatedBase.slice(0, 6)}sn`,
      `j_${truncatedBase.slice(0, 7)}`,
      `${truncatedBase.slice(0, 7)}z`,
      `k.${truncatedBase.slice(0, 7)}`,
    ],
  };

  const pool = styleTemplates[params.style] || styleTemplates.cool;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const validList: { username: string; chars: number; valid: boolean }[] = [];
  for (const candidate of rotated) {
    const check = validateSnapchatUsername(candidate);
    if (check.valid && !validList.some((u) => u.username === candidate)) {
      validList.push({
        username: candidate,
        chars: candidate.length,
        valid: true,
      });
      if (validList.length >= params.count) break;
    }
  }

  // Fallback safety if pool elements were over-limit
  if (validList.length < params.count) {
    const compactBase = truncatedBase.slice(0, 8);
    let counter = 1;
    while (validList.length < params.count) {
      const candidate = `${compactBase}_${counter}`;
      const check = validateSnapchatUsername(candidate);
      if (check.valid && !validList.some((u) => u.username === candidate)) {
        validList.push({
          username: candidate,
          chars: candidate.length,
          valid: true,
        });
      }
      counter++;
      if (counter > 50) break;
    }
  }

  return { usernames: validList };
}

// ---------------------------------------------------------------------------
// 2. Snapchat Story & Snap Bar Caption Generator (STRICT ≤ 80 CHARS)
// ---------------------------------------------------------------------------

export type SnapchatCaptionStyle = 'funny' | 'cute' | 'chill' | 'savage';

export function generateSnapchatCaptions(params: {
  topic: string;
  style: SnapchatCaptionStyle;
  count: 5 | 10;
  variation?: number;
}): { captions: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { captions: [], error: 'Please enter a moment, mood, or topic for your Snap caption.' };
  }

  const cleanTopic = topic.length > 25 ? topic.slice(0, 25).trim() : topic;

  const templatesByStyle: Record<SnapchatCaptionStyle, string[]> = {
    chill: [
      `Just here for ${cleanTopic} ☕`,
      `Low key loving ${cleanTopic} today ✨`,
      `${cleanTopic} mood on repeat 🕊️`,
      `Nothing but good vibes and ${cleanTopic} ☁️`,
      `Current state: ${cleanTopic} 🍃`,
      `Unbothered, enjoying ${cleanTopic} ✌️`,
      `Slow days, sweet moments: ${cleanTopic} 🕯️`,
      `Peaceful hours with ${cleanTopic} 🌿`,
      `Zero complaints about ${cleanTopic} 💫`,
      `${cleanTopic} and quiet hours 🌙`,
      `Keeping it simple: ${cleanTopic} ☕`,
      `Golden hour feeling with ${cleanTopic} 🌅`,
    ],
    funny: [
      `I swear ${cleanTopic} was an accident 💀`,
      `Mentally I am 100% at ${cleanTopic} 🙃`,
      `Who let me participate in ${cleanTopic}? 😂`,
      `Send help, it is ${cleanTopic} time 😭`,
      `10/10 would not recommend ${cleanTopic} 🤡`,
      `My last two brain cells during ${cleanTopic} 🫠`,
      `Plot twist: ${cleanTopic} won 🏆`,
      `This is what happens during ${cleanTopic} 🤷`,
      `Professional ${cleanTopic} enthusiast 🍟`,
      `Surviving ${cleanTopic} on pure luck 🔋`,
      `Can we pretend ${cleanTopic} made sense? 🫣`,
      `Not me crying over ${cleanTopic} 🥲`,
    ],
    cute: [
      `A little happiness called ${cleanTopic} 🌸`,
      `Living in a world of ${cleanTopic} 🧸`,
      `${cleanTopic} brings the brightest smiles 🎀`,
      `Forever grateful for ${cleanTopic} 💕`,
      `Sweet little moment: ${cleanTopic} 🍯`,
      `All heart for ${cleanTopic} today 🌷`,
      `My favorite part of today: ${cleanTopic} 🐣`,
      `Soft smiles and ${cleanTopic} 🍰`,
      `Cute memories with ${cleanTopic} 💌`,
      `Making magic with ${cleanTopic} ✨`,
      `Small joy: ${cleanTopic} 🍓`,
      `Sprinkling some ${cleanTopic} love 💖`,
    ],
    savage: [
      `Can’t compete with ${cleanTopic} 💅`,
      `Too busy with ${cleanTopic} to care 🥱`,
      `Leveling up through ${cleanTopic} 👑`,
      `${cleanTopic} hit different when you win ⚡`,
      `Unapologetically all about ${cleanTopic} 🖤`,
      `They talk, I just enjoy ${cleanTopic} 🐍`,
      `Out of your league and at ${cleanTopic} 💋`,
      `Done playing small with ${cleanTopic} 🔥`,
      `Make them wish they had ${cleanTopic} 🥂`,
      `Not taking opinions on ${cleanTopic} 🚫`,
      `Living rent-free with ${cleanTopic} 🕶️`,
      `Watch and learn: ${cleanTopic} 💥`,
    ],
  };

  const pool = templatesByStyle[params.style] || templatesByStyle.chill;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const results = rotated.slice(0, params.count).map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 80,
    };
  });

  return { captions: results };
}

// ---------------------------------------------------------------------------
// 3. Snapchat Story Idea Generator
// ---------------------------------------------------------------------------

export type SnapchatStoryType = 'any' | 'day_in_life' | 'qna' | 'behind_scenes' | 'challenge' | 'poll';

export interface SnapchatStoryIdea {
  id: string;
  title: string;
  storyType: string;
  snapCount: string;
  description: string;
  interactiveSticker: string;
}

export function generateSnapchatStoryIdeas(params: {
  topic: string;
  audience?: string;
  storyType: SnapchatStoryType;
  count: 5 | 10;
  variation?: number;
}): { ideas: SnapchatStoryIdea[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { ideas: [], error: 'Please enter a topic or theme to generate filmable Snapchat Story ideas.' };
  }

  const audienceLabel = params.audience?.trim() ? `for ${params.audience.trim()}` : 'for your friends';

  const bank: SnapchatStoryIdea[] = [
    {
      id: 'story-1',
      title: `3-Snap Morning Routine centered on ${topic}`,
      storyType: 'Day in my life',
      snapCount: '3 Snaps',
      description: `Snap 1: Quick wake-up coffee selfie with time sticker. Snap 2: 5-second video prepping ${topic}. Snap 3: Final aesthetic flat-lay photo ${audienceLabel}.`,
      interactiveSticker: 'Time Sticker + Location Tag',
    },
    {
      id: 'story-2',
      title: `Rapid Fire Q&A: What everyone asks about ${topic}`,
      storyType: 'Q&A',
      snapCount: '4 Snaps',
      description: `Post a Questions sticker inviting your audience to ask anything about ${topic}. Answer top 3 responses directly on camera with playful filters.`,
      interactiveSticker: 'Questions Sticker (Ask Me Anything)',
    },
    {
      id: 'story-3',
      title: `Behind The Scenes: The honest reality of ${topic}`,
      storyType: 'Behind the scenes',
      snapCount: '3 Snaps',
      description: `Show the glamorous finished look vs the messy reality behind ${topic}. High authenticity creates the highest reply rates on Snapchat.`,
      interactiveSticker: 'Poll Sticker (Expectation vs Reality)',
    },
    {
      id: 'story-4',
      title: `This or That Voting on ${topic}`,
      storyType: 'Poll',
      snapCount: '4 Snaps',
      description: `Compare 2 popular approaches to ${topic} across consecutive snaps with the Voting sticker so friends can tap their preference.`,
      interactiveSticker: 'Poll / Voting Sticker',
    },
    {
      id: 'story-5',
      title: `24-Hour Mini Challenge: Tackling ${topic}`,
      storyType: 'Challenge',
      snapCount: '5 Snaps',
      description: `Challenge yourself to finish or experience ${topic} before your Story expires. Check in every few hours with countdown stickers.`,
      interactiveSticker: 'Countdown Sticker (24h timer)',
    },
    {
      id: 'story-6',
      title: `Spotlight-style 10-Second Teaser about ${topic}`,
      storyType: 'Behind the scenes',
      snapCount: '2 Snaps',
      description: `Film a snappy, fast-paced vertical video revealing a surprise tip on ${topic}, followed by a swipe-up or link sticker.`,
      interactiveSticker: 'Link / Mention Sticker',
    },
    {
      id: 'story-7',
      title: `Close Friends Confessional on ${topic}`,
      storyType: 'Q&A',
      snapCount: '2 Snaps',
      description: `Post an exclusive talking-head story sharing an unfiltered, candid take on ${topic} specifically ${audienceLabel}.`,
      interactiveSticker: 'Emoji Slider (Rate my take)',
    },
    {
      id: 'story-8',
      title: `Before & After Transformation with ${topic}`,
      storyType: 'Day in my life',
      snapCount: '3 Snaps',
      description: `Take a photo before starting ${topic}, film a 5-second time-lapse in the middle, and reveal the dramatic outcome on snap 3.`,
      interactiveSticker: 'Music Sticker + Fire GIF',
    },
    {
      id: 'story-9',
      title: `Friend Roast / Trivia: Who knows more about ${topic}`,
      storyType: 'Poll',
      snapCount: '4 Snaps',
      description: `Quiz your friends on an obscure fact or inside joke regarding ${topic} with a multiple-choice Quiz sticker.`,
      interactiveSticker: 'Quiz Sticker (4 Options)',
    },
    {
      id: 'story-10',
      title: `Night Owl Wrap-Up: Lessons learned from ${topic}`,
      storyType: 'Day in my life',
      snapCount: '2 Snaps',
      description: `A cozy bedside or evening snap sharing the biggest win or funniest mistake you made today while dealing with ${topic}.`,
      interactiveSticker: 'Weather / Temperature Sticker',
    },
  ];

  let filtered = bank;
  if (params.storyType !== 'any') {
    const typeLabel = params.storyType.replace(/_/g, ' ').toLowerCase();
    const matches = bank.filter((item) => item.storyType.toLowerCase().includes(typeLabel));
    if (matches.length > 0) filtered = matches;
  }

  const offset = params.variation || 0;
  const rotated = [...filtered.slice(offset % filtered.length), ...filtered.slice(0, offset % filtered.length)];

  // Fill up to requested count
  const items: SnapchatStoryIdea[] = [];
  let idx = 0;
  while (items.length < params.count && idx < 30) {
    items.push(rotated[idx % rotated.length]);
    idx++;
  }

  return { ideas: items };
}

// ---------------------------------------------------------------------------
// 4. Snapchat Streak Calculator (Real Date Math)
// ---------------------------------------------------------------------------

export interface SnapchatStreakResult {
  status: 'active' | 'urgent' | 'expired' | 'invalid';
  streakDays: number;
  deadlineIso: string;
  deadlineToDisplay: string;
  hoursRemaining: number;
  minutesRemaining: number;
  timeRemainingText: string;
  errorMessage?: string;
  warningNote: string;
}

export function calculateSnapchatStreak(params: {
  startDate: string; // YYYY-MM-DD
  lastSnapDateTime: string; // YYYY-MM-DDTHH:mm
}): SnapchatStreakResult {
  if (!params.startDate || !params.lastSnapDateTime) {
    return {
      status: 'invalid',
      streakDays: 0,
      deadlineIso: '',
      deadlineToDisplay: '',
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeRemainingText: '',
      errorMessage: 'Please select both your Streak Start Date and the Date & Time of your last snap.',
      warningNote: '',
    };
  }

  const start = new Date(params.startDate + 'T00:00:00');
  const lastSnap = new Date(params.lastSnapDateTime);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(lastSnap.getTime())) {
    return {
      status: 'invalid',
      streakDays: 0,
      deadlineIso: '',
      deadlineToDisplay: '',
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeRemainingText: '',
      errorMessage: 'Invalid date format provided. Please check the date pickers.',
      warningNote: '',
    };
  }

  if (start.getTime() > now.getTime()) {
    return {
      status: 'invalid',
      streakDays: 0,
      deadlineIso: '',
      deadlineToDisplay: '',
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeRemainingText: '',
      errorMessage: 'Streak start date cannot be in the future. Please choose today or an earlier date.',
      warningNote: '',
    };
  }

  if (lastSnap.getTime() < start.getTime()) {
    return {
      status: 'invalid',
      streakDays: 0,
      deadlineIso: '',
      deadlineToDisplay: '',
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeRemainingText: '',
      errorMessage: 'Last snap date & time cannot be earlier than your streak start date.',
      warningNote: '',
    };
  }

  // Exact 24-hour rule: A snap must be sent and received every 24 hours
  const deadlineMs = lastSnap.getTime() + 24 * 60 * 60 * 1000;
  const deadline = new Date(deadlineMs);
  const diffFromNowMs = deadlineMs - now.getTime();

  // Streak days calculation
  const totalDays = Math.max(1, Math.floor((lastSnap.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);

  const hoursRemaining = Math.floor(diffFromNowMs / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((diffFromNowMs % (60 * 60 * 1000)) / (60 * 1000));

  const deadlineDisplay = deadline.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  if (diffFromNowMs <= 0) {
    const expiredHoursAgo = Math.abs(Math.floor(diffFromNowMs / (60 * 60 * 1000)));
    return {
      status: 'expired',
      streakDays: totalDays,
      deadlineIso: deadline.toISOString(),
      deadlineToDisplay: deadlineDisplay,
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeRemainingText: `Expired ${expiredHoursAgo} hour(s) ago`,
      warningNote: '🚨 Streak has broken! It has been more than 24 hours since the last snap was exchanged.',
    };
  }

  if (diffFromNowMs <= 4 * 60 * 60 * 1000) {
    return {
      status: 'urgent',
      streakDays: totalDays,
      deadlineIso: deadline.toISOString(),
      deadlineToDisplay: deadlineDisplay,
      hoursRemaining,
      minutesRemaining,
      timeRemainingText: `${hoursRemaining}h ${minutesRemaining}m remaining`,
      warningNote: '⌛ HOURGLASS WARNING: You have under 4 hours to send a photo/video snap to keep this streak alive!',
    };
  }

  return {
    status: 'active',
    streakDays: totalDays,
    deadlineIso: deadline.toISOString(),
    deadlineToDisplay: deadlineDisplay,
    hoursRemaining,
    minutesRemaining,
    timeRemainingText: `${hoursRemaining}h ${minutesRemaining}m remaining`,
    warningNote: '🔥 Streak is healthy! Both sides must exchange a photo or video snap before the deadline.',
  };
}

// ---------------------------------------------------------------------------
// 5. Snapchat Engagement Calculator
// ---------------------------------------------------------------------------

export interface SnapchatEngagementResult {
  status: 'valid' | 'invalid';
  engagementRatePercent: number;
  replyRatePercent: number;
  shareRatePercent: number;
  totalInteractions: number;
  benchmarkTier: 'Low' | 'Average' | 'High' | 'Viral';
  benchmarkNote: string;
  formulaDisplay: string;
  error?: string;
}

export function calculateSnapchatEngagement(params: {
  views: number;
  replies: number;
  shares: number;
}): SnapchatEngagementResult {
  const { views, replies, shares } = params;

  if (isNaN(views) || isNaN(replies) || isNaN(shares)) {
    return {
      status: 'invalid',
      engagementRatePercent: 0,
      replyRatePercent: 0,
      shareRatePercent: 0,
      totalInteractions: 0,
      benchmarkTier: 'Low',
      benchmarkNote: '',
      formulaDisplay: '',
      error: 'Please enter valid numeric values for all three fields.',
    };
  }

  if (views < 0 || replies < 0 || shares < 0) {
    return {
      status: 'invalid',
      engagementRatePercent: 0,
      replyRatePercent: 0,
      shareRatePercent: 0,
      totalInteractions: 0,
      benchmarkTier: 'Low',
      benchmarkNote: '',
      formulaDisplay: '',
      error: 'Metrics cannot be negative numbers.',
    };
  }

  if (views === 0) {
    return {
      status: 'invalid',
      engagementRatePercent: 0,
      replyRatePercent: 0,
      shareRatePercent: 0,
      totalInteractions: replies + shares,
      benchmarkTier: 'Low',
      benchmarkNote: 'Story views must be at least 1 to calculate engagement rate.',
      formulaDisplay: 'Engagement Rate (%) = ((Replies + Shares) / Story Views) × 100',
      error: 'Story views must be greater than 0 to divide. (Cannot divide by zero views).',
    };
  }

  const totalInteractions = replies + shares;
  const rawRate = (totalInteractions / views) * 100;
  const engagementRatePercent = Math.round(rawRate * 100) / 100;

  const replyRatePercent = Math.round((replies / views) * 10000) / 100;
  const shareRatePercent = Math.round((shares / views) * 10000) / 100;

  let benchmarkTier: 'Low' | 'Average' | 'High' | 'Viral' = 'Average';
  let benchmarkNote = 'Solid performance within typical Snapchat Story benchmarks (2% – 5%).';

  if (engagementRatePercent < 2) {
    benchmarkTier = 'Low';
    benchmarkNote = 'Below average. Try using Interactive Poll stickers, Questions, or clearer call-to-actions.';
  } else if (engagementRatePercent > 8) {
    benchmarkTier = 'Viral';
    benchmarkNote = 'Exceptional high engagement! Friends and viewers are actively sharing and replying to your Snaps.';
  } else if (engagementRatePercent >= 5) {
    benchmarkTier = 'High';
    benchmarkNote = 'Above average! Strong conversational connection with your Story audience.';
  }

  return {
    status: 'valid',
    engagementRatePercent,
    replyRatePercent,
    shareRatePercent,
    totalInteractions,
    benchmarkTier,
    benchmarkNote,
    formulaDisplay: `Engagement Rate (%) = ((${replies} Replies + ${shares} Shares) / ${views} Views) × 100 = ${engagementRatePercent}%`,
  };
}

// ---------------------------------------------------------------------------
// 6. Snapchat Spotlight Idea Generator
// ---------------------------------------------------------------------------

export type SpotlightVideoStyle = 'any' | 'funny' | 'talent' | 'challenge' | 'life_hack' | 'reaction';

export interface SpotlightIdea {
  id: string;
  title: string;
  style: string;
  first3SecHook: string;
  storyboard: string;
  recommendedDuration: string;
  tags: string[];
}

export function generateSnapchatSpotlightIdeas(params: {
  topic: string;
  videoStyle: SpotlightVideoStyle;
  count: 5 | 10;
  variation?: number;
}): { ideas: SpotlightIdea[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { ideas: [], error: 'Please enter a topic or niche to generate filmable Spotlight ideas.' };
  }

  const bank: SpotlightIdea[] = [
    {
      id: 'spotlight-1',
      title: `30-Second Life Hack for ${topic}`,
      style: 'Life hack',
      first3SecHook: `"Stop doing ${topic} the hard way—watch this!"`,
      storyboard: `Quick jump cut showing the common mistake, followed by a 15-second visual demonstration of the shortcut, ending on the crisp result.`,
      recommendedDuration: '25–35 seconds',
      tags: ['#Spotlight', '#LifeHack', '#ProTip', '#FYP'],
    },
    {
      id: 'spotlight-2',
      title: `Expectation vs Brutal Reality of ${topic}`,
      style: 'Funny',
      first3SecHook: `"What I thought ${topic} would look like vs reality..."`,
      storyboard: `First 5 seconds shows aesthetic stock-style expectation clip. Sudden record scratch cut to chaotic, relatable bloopers.`,
      recommendedDuration: '15–20 seconds',
      tags: ['#Spotlight', '#Relatable', '#Humor', '#ExpectationVsReality'],
    },
    {
      id: 'spotlight-3',
      title: `Speedrun Challenge: Can I master ${topic} in 60s?`,
      style: 'Challenge',
      first3SecHook: `"Setting a 60-second timer to see if I can pull off ${topic}!"`,
      storyboard: `Split screen or picture-in-picture with countdown timer ticking down loudly. Energetic cuts with intense pacing.`,
      recommendedDuration: '50–59 seconds',
      tags: ['#Spotlight', '#Challenge', '#Speedrun', '#Viral'],
    },
    {
      id: 'spotlight-4',
      title: `Rating Viral Internet Trends about ${topic}`,
      style: 'Reaction',
      first3SecHook: `"Rating popular ${topic} hacks 1 to 10 so you don't have to."`,
      storyboard: `Green screen background showing the trend. You in corner giving immediate blunt reactions and score cards.`,
      recommendedDuration: '30–45 seconds',
      tags: ['#Spotlight', '#Reaction', '#Trending', '#Review'],
    },
    {
      id: 'spotlight-5',
      title: `Beginner Mistake Everyone Makes with ${topic}`,
      style: 'Talent',
      first3SecHook: `"If you're still doing this with ${topic}, please stop immediately!"`,
      storyboard: `Show the mistake with big red X graphic, followed by the expert method with green checkmark. Clean text overlay.`,
      recommendedDuration: '20–30 seconds',
      tags: ['#Spotlight', '#Education', '#SkillBuilding', '#Tutorial'],
    },
    {
      id: 'spotlight-6',
      title: `Oddly Satisfying Process Video: Crafting ${topic}`,
      style: 'Talent',
      first3SecHook: `"The most relaxing ${topic} video you'll see all day."`,
      storyboard: `Macro close-up video, ASMR natural audio without background noise, rhythmic cuts showing smooth completion.`,
      recommendedDuration: '20–35 seconds',
      tags: ['#Spotlight', '#Satisfying', '#ASMR', '#Relaxing'],
    },
    {
      id: 'spotlight-7',
      title: `What Nobody Warns You About ${topic}`,
      style: 'Reaction',
      first3SecHook: `"The harsh truth about ${topic} that took me months to figure out..."`,
      storyboard: `Intimate vertical framing looking directly at camera, rapid 3-point breakdown with text captions.`,
      recommendedDuration: '30–40 seconds',
      tags: ['#Spotlight', '#Storytime', '#RealTalk', '#Advice'],
    },
    {
      id: 'spotlight-8',
      title: `POV: You just discovered ${topic}`,
      style: 'Funny',
      first3SecHook: `"POV: Your friend mentions ${topic} once and your algorithm breaks."`,
      storyboard: `Play out both sides of a comedic conversation wearing different hats or angles. High meme replay value.`,
      recommendedDuration: '18–25 seconds',
      tags: ['#Spotlight', '#POV', '#Meme', '#Comedy'],
    },
  ];

  let filtered = bank;
  if (params.videoStyle !== 'any') {
    const styleLabel = params.videoStyle.replace(/_/g, ' ').toLowerCase();
    const matches = bank.filter((item) => item.style.toLowerCase().includes(styleLabel));
    if (matches.length > 0) filtered = matches;
  }

  const offset = params.variation || 0;
  const rotated = [...filtered.slice(offset % filtered.length), ...filtered.slice(0, offset % filtered.length)];

  const items: SpotlightIdea[] = [];
  let idx = 0;
  while (items.length < params.count && idx < 30) {
    items.push(rotated[idx % rotated.length]);
    idx++;
  }

  return { ideas: items };
}

// ---------------------------------------------------------------------------
// 7. Snapchat Spotlight Caption Generator
// ---------------------------------------------------------------------------

export type SpotlightCaptionStyle = 'funny' | 'relatable' | 'bold' | 'cute';

export function generateSpotlightCaptions(params: {
  topic: string;
  style: SpotlightCaptionStyle;
  count: 5 | 10;
  variation?: number;
}): { captions: { text: string; chars: number }[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { captions: [], error: 'Please enter a video topic or moment for your Spotlight caption.' };
  }

  const t = topic.length > 25 ? topic.slice(0, 25).trim() : topic;

  const styleTemplates: Record<SpotlightCaptionStyle, string[]> = {
    funny: [
      `I can’t believe this happened during ${t} 😭 #Spotlight #viral #lol`,
      `Don’t let my mom see this ${t} clip 💀 #Spotlight #fail #trending`,
      `The bloopers of ${t} were too chaotic 🫠 #Spotlight #funny #comedy`,
      `Why did nobody warn me about ${t}? 💀 #Spotlight #relatable #humor`,
      `Attempting ${t} gone completely wrong 🤡 #Spotlight #fails #fyp`,
      `If you laugh at this ${t} you owe me a follow 😂 #Spotlight #jokes`,
    ],
    relatable: [
      `Tell me you do this with ${t} without telling me 🙃 #Spotlight #mood`,
      `Anyone else experience ${t} every single day? 🤝 #Spotlight #real`,
      `The universal feeling when ${t} goes down 😭 #Spotlight #storytime`,
      `We’ve all had that one ${t} moment ✨ #Spotlight #relatable #foryou`,
      `Me trying to explain ${t} to literally anyone 🤷 #Spotlight #fyp`,
      `Tag someone who is obsessed with ${t} 📌 #Spotlight #relatable`,
    ],
    bold: [
      `The absolute best way to handle ${t} 🔥 #Spotlight #mastery #pro`,
      `Watch till the end if you care about ${t} ⚡ #Spotlight #viral #trending`,
      `This is why ${t} changes everything 💥 #Spotlight #gamechanger`,
      `Unpopular opinion on ${t}: someone had to say it 👑 #Spotlight #bold`,
      `Proof that ${t} is undefeated 🚀 #Spotlight #winner #elite`,
      `Stop doing ${t} the old way immediately 🚫 #Spotlight #hacks`,
    ],
    cute: [
      `Smallest sweet moment with ${t} 🌸 #Spotlight #cute #peace`,
      `The wholesome side of ${t} you needed today 🥺 #Spotlight #warmth`,
      `Can we appreciate how cute ${t} is? 💕 #Spotlight #wholesome`,
      `Pure joy caught on camera during ${t} 🧸 #Spotlight #smiles`,
      `Making everyday ${t} a little brighter ✨ #Spotlight #cozy`,
      `Sending good vibes with this ${t} clip 💌 #Spotlight #love`,
    ],
  };

  const pool = styleTemplates[params.style] || styleTemplates.relatable;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const results = rotated.slice(0, params.count).map((text) => ({
    text,
    chars: countUnicodeChars(text),
  }));

  return { captions: results };
}

// ---------------------------------------------------------------------------
// 8. Snapchat Filter Name Generator
// ---------------------------------------------------------------------------

export type SnapchatFilterStyle = 'fun' | 'elegant' | 'bold' | 'cute';

export function generateSnapchatFilterNames(params: {
  event: string;
  style: SnapchatFilterStyle;
  count: 5 | 10;
  variation?: number;
}): { names: { name: string; chars: number }[]; error?: string } {
  const event = params.event.trim();
  if (!event) {
    return { names: [], error: 'Please enter an event, party, or location name for your Snapchat Geofilter.' };
  }

  const base = event.length > 25 ? event.slice(0, 25).trim() : event;

  const templates: Record<SnapchatFilterStyle, string[]> = {
    fun: [
      `${base} Bash 🎉`,
      `Cheers to ${base} 🥂`,
      `${base} & Good Times ⚡`,
      `Living It Up @ ${base}`,
      `${base} Crew ✨`,
      `Celebrating ${base} 🎈`,
      `${base} Party Mode 🥳`,
      `${base} Memories 📸`,
      `Vibes at ${base} 🌴`,
      `${base} Squad Goals 💫`,
    ],
    elegant: [
      `The ${base} Affair 🕊️`,
      `Forever & Always: ${base}`,
      `Celebrating ${base} 💍`,
      `The Honor of ${base} 🕯️`,
      `${base} Elegance 🌸`,
      `A Night at ${base} 🌙`,
      `${base} Soirée ✨`,
      `To New Beginnings: ${base}`,
      `${base} Gala 🥂`,
      `Moments of ${base} 🤍`,
    ],
    bold: [
      `${base.toUpperCase()} 💥`,
      `OFFICIAL: ${base} ⚡`,
      `${base} NO LIMITS 🔥`,
      `THE ${base.toUpperCase()} EXPERIENCE`,
      `${base} TAKEOVER 🚀`,
      `${base} MAIN STAGE 🎤`,
      `${base} LIVE & LOUD 🏆`,
      `UNSTOPPABLE: ${base}`,
      `${base} VIP ACCESS 👑`,
      `DEFINING ${base.toUpperCase()}`,
    ],
    cute: [
      `Sweet ${base} 🍓`,
      `${base} & Smiles 🎀`,
      `Little Moments: ${base} 🌸`,
      `Love at ${base} 💕`,
      `${base} Daydream ☁️`,
      `Happy ${base} Day 🌷`,
      `${base} Snuggles 🧸`,
      `Sunny Days with ${base} ☀️`,
      `${base} Magic 🪄`,
      `Cute Memories of ${base} 💌`,
    ],
  };

  const pool = templates[params.style] || templates.fun;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const results = rotated.slice(0, params.count).map((name) => ({
    name,
    chars: countUnicodeChars(name),
  }));

  return { names: results };
}

// ---------------------------------------------------------------------------
// 9. Snapchat AR Lens Idea Generator (Concepts Only)
// ---------------------------------------------------------------------------

export type SnapchatLensType = 'any' | 'face_effect' | 'world_effect' | 'game' | 'try_on';

export interface SnapchatLensConcept {
  id: string;
  name: string;
  type: string;
  trigger: string;
  visualEffect: string;
  audioFeedback: string;
}

export function generateSnapchatLensIdeas(params: {
  theme: string;
  lensType: SnapchatLensType;
  count: 5 | 10;
  variation?: number;
}): { concepts: SnapchatLensConcept[]; error?: string } {
  const theme = params.theme.trim();
  if (!theme) {
    return { concepts: [], error: 'Please enter a theme or occasion to generate AR lens concepts.' };
  }

  const bank: SnapchatLensConcept[] = [
    {
      id: 'lens-1',
      name: `${theme} Neon Glow Face Mesh`,
      type: 'Face effect',
      trigger: 'Blink eyes or raise eyebrows',
      visualEffect: `Traces dynamic cybernetic or glowing neon lines across facial contours matched to ${theme} color palette.`,
      audioFeedback: 'Subtle high-tech chime upon eyebrow raise',
    },
    {
      id: 'lens-2',
      name: `${theme} Catch the Falling Icons`,
      type: 'Game',
      trigger: 'Open mouth to catch items',
      visualEffect: `3D animated items themed around ${theme} rain down from top of screen; open mouth to score points on a live floating counter.`,
      audioFeedback: 'Chime sound per caught item, fanfare upon 10 points',
    },
    {
      id: 'lens-3',
      name: `Virtual 3D Portal to ${theme}`,
      type: 'World effect',
      trigger: 'Rear camera surface plane tap',
      visualEffect: `Spawns a life-sized magical doorway on the floor. Walking through reveals a fully rendered 360-degree interactive environment of ${theme}.`,
      audioFeedback: 'Spatial ambient breeze and ethereal entrance sound',
    },
    {
      id: 'lens-4',
      name: `${theme} Virtual Try-On Sunglasses & Headwear`,
      type: 'Try-on',
      trigger: 'Face tracking with screen tap toggle',
      visualEffect: `Places photorealistic 3D branded glasses, hat, and ear accessories themed around ${theme} with realistic reflections and shadows.`,
      audioFeedback: 'Camera click shutter sound on tap',
    },
    {
      id: 'lens-5',
      name: `${theme} Mood Scanner & Aura Cloud`,
      type: 'Face effect',
      trigger: 'Smile at camera',
      visualEffect: `A neon holographic scanner glides down the face, generating a glowing pastel aura cloud around the head reflecting ${theme} vibes.`,
      audioFeedback: 'Pleasant harmonic frequency swell when smile is detected',
    },
    {
      id: 'lens-6',
      name: `Floor is ${theme} World AR Transform`,
      type: 'World effect',
      trigger: 'Point camera at ground',
      visualEffect: `Segments the floor surface and replaces it with animated water, lava, or sparkling crystals themed after ${theme}.`,
      audioFeedback: 'Immersive bubbling or crunching footstep soundscape',
    },
    {
      id: 'lens-7',
      name: `Fast 10-Second ${theme} Trivia Spinner`,
      type: 'Game',
      trigger: 'Nod head or tilt left/right',
      visualEffect: `A spinning wheel appears over the user's forehead and lands on a funny prompt or challenge about ${theme}.`,
      audioFeedback: 'Ticking clicker wheel wheel ending in a bell ding',
    },
    {
      id: 'lens-8',
      name: `${theme} Aesthetic Vintage Camcorder VFX`,
      type: 'Face effect',
      trigger: 'Always active with timestamp tap',
      visualEffect: `Applies 90s retro VHS scan lines, chromatic aberration, grain, and an authentic date overlay with custom ${theme} title card.`,
      audioFeedback: 'Vintage tape hiss and mechanical zoom hum',
    },
  ];

  let filtered = bank;
  if (params.lensType !== 'any') {
    const typeLabel = params.lensType.replace(/_/g, ' ').toLowerCase();
    const matches = bank.filter((item) => item.type.toLowerCase().includes(typeLabel));
    if (matches.length > 0) filtered = matches;
  }

  const offset = params.variation || 0;
  const rotated = [...filtered.slice(offset % filtered.length), ...filtered.slice(0, offset % filtered.length)];

  const items: SnapchatLensConcept[] = [];
  let idx = 0;
  while (items.length < params.count && idx < 30) {
    items.push(rotated[idx % rotated.length]);
    idx++;
  }

  return { concepts: items };
}

// ---------------------------------------------------------------------------
// 10. Snapchat Bitmoji Outfit Idea Generator
// ---------------------------------------------------------------------------

export type BitmojiStyle = 'casual' | 'sporty' | 'formal' | 'streetwear' | 'cute';
export type BitmojiOccasion = 'everyday' | 'party' | 'date' | 'work' | 'gym';

export interface BitmojiOutfitCombination {
  id: string;
  name: string;
  top: string;
  bottom: string;
  shoes: string;
  outerwear: string;
  accessory: string;
  palette: string;
}

export function generateBitmojiOutfitIdeas(params: {
  style: BitmojiStyle;
  occasion: BitmojiOccasion;
  colors?: string;
  count: 5 | 10;
  variation?: number;
}): { outfits: BitmojiOutfitCombination[] } {
  const colorNote = params.colors?.trim() ? params.colors.trim() : 'Monochrome & Earthy';

  const baseLibrary: Record<BitmojiStyle, BitmojiOutfitCombination[]> = {
    streetwear: [
      {
        id: 'outfit-s1',
        name: 'Oversized City Explorer',
        top: 'Heavyweight graphic boxy tee',
        bottom: 'Relaxed fit multi-pocket cargo pants',
        shoes: 'Chunky retro high-top basketball sneakers',
        outerwear: 'Cropped utility vest',
        accessory: 'Silver chain necklace & angled bucket hat',
        palette: colorNote,
      },
      {
        id: 'outfit-s2',
        name: 'Monochrome Techwear Fit',
        top: 'Mock-neck performance long-sleeve',
        bottom: 'Tapered nylon strap joggers',
        shoes: 'All-black waterproof trail runners',
        outerwear: 'Windbreaker zip shell with storm collar',
        accessory: 'Crossbody chest bag with quick-release buckle',
        palette: colorNote,
      },
      {
        id: 'outfit-s3',
        name: 'Skater Vintage Minimalist',
        top: 'Distressed vintage washed band tee',
        bottom: 'Baggy wide-leg medium wash denim',
        shoes: 'Low-top canvas skate shoes with white gum soles',
        outerwear: 'Oversized plaid flannel shirt (open front)',
        accessory: 'Folded knit beanie & mini hoop earring',
        palette: colorNote,
      },
      {
        id: 'outfit-s4',
        name: 'Varsity Hypebeast',
        top: 'Crisp plain white crewneck tee',
        bottom: 'Black stacked flared sweatpants',
        shoes: 'Two-tone leather low court sneakers',
        outerwear: 'Wool letterman varsity jacket with leather sleeves',
        accessory: 'Structured snapback cap worn backwards',
        palette: colorNote,
      },
    ],
    casual: [
      {
        id: 'outfit-c1',
        name: 'Everyday Cozy Loungewear',
        top: 'Soft fleece kangaroo pocket hoodie',
        bottom: 'Matching tapered fleece joggers',
        shoes: 'Slip-on suede mule slides with crew socks',
        outerwear: 'Lightweight quilted vest',
        accessory: 'Wire-rim reading glasses',
        palette: colorNote,
      },
      {
        id: 'outfit-c2',
        name: 'Weekend Coffee Run',
        top: 'Breton striped relaxed long sleeve',
        bottom: 'Straight-leg comfortable raw hem jeans',
        shoes: 'Clean minimalist white leather tennis sneakers',
        outerwear: 'Classic beige twill chore jacket',
        accessory: 'Canvas tote bag & minimal watch',
        palette: colorNote,
      },
      {
        id: 'outfit-c3',
        name: 'Autumn Knitted Warmth',
        top: 'Chunky ribbed cable-knit turtleneck sweater',
        bottom: 'Tailored dark olive corduroy trousers',
        shoes: 'Suede Chelsea boots with crepe sole',
        outerwear: 'Wool blend unlined overcoat',
        accessory: 'Plaid fringe blanket scarf',
        palette: colorNote,
      },
      {
        id: 'outfit-c4',
        name: 'Campus Casual Prep',
        top: 'Oxford cotton button-down shirt',
        bottom: 'Slim chino pants with single cuff',
        shoes: 'Classic brown leather penny loafers',
        outerwear: 'V-neck cable sweater vest',
        accessory: 'Leather strap wristwatch',
        palette: colorNote,
      },
    ],
    sporty: [
      {
        id: 'outfit-sp1',
        name: 'High Intensity Athletic Track',
        top: 'Breathable dry-fit compression t-shirt',
        bottom: '7-inch lined running shorts over compression tights',
        shoes: 'Cushioned carbon-plate marathon runners',
        outerwear: 'Reflective ultra-lightweight running windbreaker',
        accessory: 'Sweat-wicking performance headband & smartwatch',
        palette: colorNote,
      },
      {
        id: 'outfit-sp2',
        name: 'Retro Tracksuit Heritage',
        top: 'Full-zip color-blocked retro track jacket',
        bottom: 'Matching tear-away nylon track pants',
        shoes: 'Vintage gum-sole low training sneakers',
        outerwear: 'Integrated track jacket shell',
        accessory: 'Gym duffle bag & sports water bottle',
        palette: colorNote,
      },
      {
        id: 'outfit-sp3',
        name: 'Gym Bro Lifting Fit',
        top: 'Dropped armhole muscle tank',
        bottom: 'Heavyweight raw-edge gym sweatshorts',
        shoes: 'Flat-sole high-top lifting shoes',
        outerwear: 'Oversized fleece warm-up hoodie',
        accessory: 'Leather lifting belt & over-ear gym headphones',
        palette: colorNote,
      },
      {
        id: 'outfit-sp4',
        name: 'Court Ready Hoops',
        top: 'Mesh basketball jersey with custom number',
        bottom: 'Double-layer breathable basketball shorts',
        shoes: 'Ankle-support performance high-top court shoes',
        outerwear: 'Zip warm-up bomber jacket',
        accessory: 'Wrist sweatband & terry crew socks',
        palette: colorNote,
      },
    ],
    formal: [
      {
        id: 'outfit-f1',
        name: 'Sharp Black-Tie Evening',
        top: 'Pleated front tuxedo dress shirt with onyx studs',
        bottom: 'Tailored tuxedo trousers with satin side stripe',
        shoes: 'High-shine patent leather oxford dress shoes',
        outerwear: 'Midnight black velvet dinner jacket with shawl lapel',
        accessory: 'Silk butterfly bow tie & white pocket square',
        palette: colorNote,
      },
      {
        id: 'outfit-f2',
        name: 'Modern Executive Tailoring',
        top: 'Fitted light blue pinpoint cotton dress shirt',
        bottom: 'Slim-cut charcoal wool suit trousers',
        shoes: 'Burnished cognac brown cap-toe leather brogues',
        outerwear: 'Single-breasted two-button navy wool blazer',
        accessory: 'Knitted silk tie & brass cufflinks',
        palette: colorNote,
      },
      {
        id: 'outfit-f3',
        name: 'Smart Cocktail Gala',
        top: 'Silky knit dark polo or fine gauge turtleneck',
        bottom: 'High-waisted pleated suit trousers with side tabs',
        shoes: 'Polished velvet tassel smoking slippers',
        outerwear: 'Patterned houndstooth tailored sport coat',
        accessory: 'Printed silk pocket ascot',
        palette: colorNote,
      },
      {
        id: 'outfit-f4',
        name: 'Summer Linen Semi-Formal',
        top: 'Relaxed band-collar breathable linen shirt',
        bottom: 'Cream lightweight linen-cotton blend trousers',
        shoes: 'Woven leather driving moccasins',
        outerwear: 'Unstructured pastel linen blazer',
        accessory: 'Tortoiseshell polarized sunglasses',
        palette: colorNote,
      },
    ],
    cute: [
      {
        id: 'outfit-cu1',
        name: 'Pastel Sunshine Daydream',
        top: 'Baby tee with delicate embroidered daisy',
        bottom: 'High-waisted pleated tennis skirt',
        shoes: 'Chunky white platform trainers with frilly socks',
        outerwear: 'Fluffy cropped knit cardigan with floral buttons',
        accessory: 'Pastel butterfly hair clips & pearl choker',
        palette: colorNote,
      },
      {
        id: 'outfit-cu2',
        name: 'Strawberry Milk Shake',
        top: 'Fitted scoop-neck ribbed knit top',
        bottom: 'Wide-leg soft pink carpenter denim',
        shoes: 'Two-tone pastel canvas low-top sneakers',
        outerwear: 'Oversized plush sherpa teddy fleece jacket',
        accessory: 'Heart-shaped wire sunglasses & mini backpack',
        palette: colorNote,
      },
      {
        id: 'outfit-cu3',
        name: 'Picnic Cottagecore Charm',
        top: 'Puff-sleeve sweetheart neckline peasant blouse',
        bottom: 'Tiered floral print midi skirt with tie waist',
        shoes: 'Lace-up canvas espadrille wedges or Mary Janes',
        outerwear: 'Hand-crocheted open-weave bolero',
        accessory: 'Woven straw sunhat with ribbon bow',
        palette: colorNote,
      },
      {
        id: 'outfit-cu4',
        name: 'Kawaii Cozy Bear',
        top: 'Oversized fleece pullover with embroidered teddy bear',
        bottom: 'Pleated plaid uniform skirt or soft leggings',
        shoes: 'Plush ankle boots with faux fur lining',
        outerwear: 'Quilted pastel puffer jacket',
        accessory: 'Knit animal ear beanie & fingerless mittens',
        palette: colorNote,
      },
    ],
  };

  const pool = baseLibrary[params.style] || baseLibrary.casual;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const items: BitmojiOutfitCombination[] = [];
  let idx = 0;
  while (items.length < params.count && idx < 30) {
    items.push(rotated[idx % rotated.length]);
    idx++;
  }

  return { outfits: items };
}

// ---------------------------------------------------------------------------
// 11. Snapchat Birthday Caption Generator (STRICT ≤ 80 CHARS)
// ---------------------------------------------------------------------------

export type BirthdayRelationship = 'friend' | 'best_friend' | 'sibling' | 'partner' | 'family';
export type BirthdayCaptionStyle = 'funny' | 'sweet' | 'savage' | 'heartfelt';

export function generateSnapchatBirthdayCaptions(params: {
  name: string;
  relationship: BirthdayRelationship;
  style: BirthdayCaptionStyle;
  count: 5 | 10;
  variation?: number;
}): { captions: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const name = params.name.trim();
  if (!name) {
    return { captions: [], error: 'Please enter the birthday person’s name.' };
  }

  const cleanName = name.length > 15 ? name.slice(0, 15).trim() : name;

  const relationshipLabels: Record<BirthdayRelationship, string> = {
    friend: 'friend',
    best_friend: 'BFF',
    sibling: 'sib',
    partner: 'love',
    family: 'fam',
  };

  const rel = relationshipLabels[params.relationship] || 'friend';

  const bank: Record<BirthdayCaptionStyle, string[]> = {
    sweet: [
      `Happy birthday to my favorite person ${cleanName}! 🎂💕`,
      `Celebrating the sweetest ${rel} today: HBD ${cleanName}! 🌸✨`,
      `Happiest birthday ${cleanName}! Forever grateful for you 🥳💖`,
      `Wishing the best day to my one & only ${cleanName} 🎂🎈`,
      `Happy birthday ${cleanName}! Another year of bright smiles 🌷🧁`,
      `Cheers to your special day ${cleanName}! Love you lots 🥂🎂`,
      `HBD to my sunshine ${cleanName}! Keep shining bright ☀️💕`,
      `So lucky to have you in my life, happy birthday ${cleanName} 💌🍰`,
      `Sending the biggest birthday hug to ${cleanName}! 🧸🎉`,
      `Happy birthday ${cleanName}! Hope your year is full of joy 🌟🎂`,
      `To the kindest ${rel} ever: happiest birthday ${cleanName} 💐✨`,
      `HBD ${cleanName}! May all your birthday wishes come true 🎁🎈`,
    ],
    funny: [
      `Happy bday ${cleanName}! You’re officially older than me 👵🎉`,
      `HBD ${cleanName}! Still wondering how we’re both alive 💀🎂`,
      `Happy birthday ${cleanName}! I came strictly for the cake 🍰😂`,
      `Happy birthday to my partner in bad decisions ${cleanName} 🤡🍾`,
      `Happy birthday ${cleanName}! Aging like fine milk 🥛🥳`,
      `HBD ${cleanName}! You don’t look a day over yesterday 🤣🎂`,
      `Celebrating the miracle of you surviving another year ${cleanName} 😂🥂`,
      `Happy birthday ${cleanName}! Thanks for always being older than me 🎈😜`,
      `HBD ${cleanName}! Don't blow the candles too hard 💨🎂`,
      `Happy birthday ${cleanName}! You're one year closer to retirement 👴🎉`,
      `Another year wiser? Let's not get ahead of ourselves, HBD ${cleanName} 🤣🍾`,
      `Happy birthday ${cleanName}! Time to party like we don't have back pain 💀🎈`,
    ],
    savage: [
      `HBD ${cleanName}! You’re lucky to have an iconic friend like me 💅✨`,
      `Happy birthday ${cleanName}! Let’s see if you can act your age 🥱🎂`,
      `Another year older, none the wiser. HBD ${cleanName} 🐍🎉`,
      `Happy birthday ${cleanName}! Don’t worry, I won’t tell your real age 🤫🎈`,
      `HBD to my favorite troublemaker ${cleanName}! Try behaving today 💋🔥`,
      `Happy birthday ${cleanName}! Stay iconic and stay in your lane 👑🥂`,
      `HBD ${cleanName}! You’re aging, but at least your snaps are cute 💅🧁`,
      `Happy birthday ${cleanName}! We won’t count the gray hairs yet 🖤⚡`,
      `HBD ${cleanName}! Being this fabulous can't be easy 💅🎂`,
      `Happy birthday ${cleanName}! Remember, I'm the real gift here 🎁💋`,
      `HBD ${cleanName}! Looking good for your prehistoric age 🦖🥳`,
      `Another year of you tolerating my greatness, HBD ${cleanName} 👑🎈`,
    ],
    heartfelt: [
      `Happy birthday ${cleanName}. Thank you for always being there 🤍🎂`,
      `HBD to someone who makes every day better: ${cleanName} ✨🕊️`,
      `To my dearest ${rel} ${cleanName}: happiest of birthdays 🕯️💕`,
      `Wishing you peace, joy and all the happiness ${cleanName} 🌸🍰`,
      `Happy birthday ${cleanName}! So proud of everything you do 🥂💖`,
      `Happy birthday ${cleanName}. Here is to many more chapters together 📖🎂`,
      `HBD ${cleanName}! You have a heart of pure gold 💛🎈`,
      `Celebrating you today and every day, happy birthday ${cleanName} 🌷✨`,
      `Happy birthday ${cleanName}. The world is brighter with you in it ☀️🤍`,
      `HBD ${cleanName}! Grateful for every single memory we share 📸🎂`,
      `To a truly special ${rel}: happy birthday ${cleanName} 💐🕊️`,
      `Wishing ${cleanName} a peaceful, blessed, and joyous birthday 🕯️💖`,
    ],
  };

  const pool = bank[params.style] || bank.sweet;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const selected: string[] = [];
  let i = 0;
  while (selected.length < params.count && i < 40) {
    selected.push(rotated[i % rotated.length]);
    i++;
  }

  const results = selected.map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 80,
    };
  });

  return { captions: results };

  return { captions: results };
}

// ---------------------------------------------------------------------------
// 12. Snapchat Friend Emoji Meaning Guide Catalog
// ---------------------------------------------------------------------------

export interface SnapchatEmojiGuideItem {
  id: string;
  emoji: string;
  name: string;
  category: 'Best Friends' | 'Streaks' | 'Milestones' | 'Other';
  meaning: string;
  howToGet: string;
  howToLose: string;
}

export const SNAPCHAT_EMOJI_GUIDE: readonly SnapchatEmojiGuideItem[] = [
  {
    id: 'yellow-heart',
    emoji: '💛',
    name: 'Best Friends (#1 Best Friend)',
    category: 'Best Friends',
    meaning: 'You are each other’s #1 Best Friend. You send the most snaps to them, and they send the most snaps to you.',
    howToGet: 'Exchange the highest volume of photo/video snaps with this person compared to anyone else on your friend list.',
    howToLose: 'If either of you starts snapping someone else more frequently.',
  },
  {
    id: 'red-heart',
    emoji: '❤️',
    name: 'BFF (Best Friends for 2 Weeks)',
    category: 'Best Friends',
    meaning: 'You have been each other’s #1 Best Friend (💛) continuously for two weeks straight.',
    howToGet: 'Maintain the #1 Best Friend status with each other without interruption for 14 consecutive days.',
    howToLose: 'If the mutual #1 spot drops to anyone else even for a single day.',
  },
  {
    id: 'pink-hearts',
    emoji: '💕',
    name: 'Super BFF (Best Friends for 2 Months)',
    category: 'Best Friends',
    meaning: 'You have been each other’s #1 Best Friend continuously for two whole months straight (60 days).',
    howToGet: 'Keep the mutual #1 Best Friend relationship active for 60 consecutive days.',
    howToLose: 'If either person sends more snaps to someone else during the 2-month stretch.',
  },
  {
    id: 'smiley-face',
    emoji: '😊',
    name: 'Besties (One of your Best Friends)',
    category: 'Best Friends',
    meaning: 'This person is one of your top Best Friends. You snap each other often, but they are not your #1.',
    howToGet: 'Send frequent snaps back and forth to rank inside each other’s top 8 best friends list.',
    howToLose: 'Reduced snap volume drops them out of your top contacts.',
  },
  {
    id: 'grimacing-face',
    emoji: '😬',
    name: 'Mutual Besties (Shared #1 Best Friend)',
    category: 'Best Friends',
    meaning: 'Your #1 Best Friend is also their #1 Best Friend. You both send the most snaps to the exact same person.',
    howToGet: 'Both you and this friend have the same person as your top #1 contact.',
    howToLose: 'When your or their #1 contact shifts to a different friend.',
  },
  {
    id: 'sunglasses-face',
    emoji: '😎',
    name: 'Mutual Best Friends (Shared Close Contact)',
    category: 'Best Friends',
    meaning: 'One of your Best Friends is also one of their Best Friends. You share a common close snapping buddy.',
    howToGet: 'Snap a mutual friend often enough that you both share them on your respective best friends lists.',
    howToLose: 'When that mutual friend drops off either person’s top list.',
  },
  {
    id: 'smirk-face',
    emoji: '😏',
    name: 'Mutual Best Friends (They snap you more)',
    category: 'Best Friends',
    meaning: 'You are one of their Best Friends, but they are NOT one of yours. They snap you frequently, but you do not reply as much.',
    howToGet: 'Receive a high volume of snaps from a friend without snapping them back as much.',
    howToLose: 'Start snapping them back equally (they become an 😊) or they stop snapping you.',
  },
  {
    id: 'fire-streak',
    emoji: '🔥',
    name: 'Snapstreak (Consecutive Snapping Days)',
    category: 'Streaks',
    meaning: 'You are on an active Snapstreak! You and this friend have sent photo or video snaps to each other at least once every 24 hours on consecutive days.',
    howToGet: 'Both friends must send a photo or video snap (chat messages do NOT count) every single day.',
    howToLose: 'If either person fails to send a snap within 24 hours of the last snap.',
  },
  {
    id: 'hourglass',
    emoji: '⌛',
    name: 'Hourglass (Snapstreak Expiring Soon)',
    category: 'Streaks',
    meaning: 'Your Snapstreak with this person is about to end within 4 hours. Send a snap immediately to save the streak!',
    howToGet: 'Appears automatically when around 20 hours have passed since the last exchanged snap.',
    howToLose: 'Disappears back into the 🔥 fire icon once both users exchange a fresh snap.',
  },
  {
    id: 'birthday-cake',
    emoji: '🎂',
    name: 'Birthday Cake (Their Birthday Today)',
    category: 'Milestones',
    meaning: 'It is this friend’s birthday today! Send them a celebratory birthday snap.',
    howToGet: 'Appears automatically on the date registered in their Snapchat account settings (Birthday Party toggle enabled).',
    howToLose: 'Automatically disappears when their birthday date concludes at midnight.',
  },
  {
    id: 'baby-face',
    emoji: '👶',
    name: 'New Friend',
    category: 'Milestones',
    meaning: 'You recently added this person as a friend on Snapchat.',
    howToGet: 'Newly added contacts show this badge during the initial friendship period.',
    howToLose: 'Disappears automatically after a few days as regular snapping begins.',
  },
  {
    id: 'gold-star',
    emoji: '🌟',
    name: 'Snap Replayed / Gold Star',
    category: 'Other',
    meaning: 'Someone has replayed this person’s snap within the last 24 hours.',
    howToGet: 'When any viewer taps "Replay" on one of their photo or video snaps.',
    howToLose: 'Disappears 24 hours after the replay occurred.',
  },
  {
    id: 'crown',
    emoji: '👑',
    name: 'Official Verified Creator / Celebrity',
    category: 'Other',
    meaning: 'Verified public account or recognized creator officially authenticated by Snap Inc.',
    howToGet: 'Earned through Snapchat’s official Creator verification program.',
    howToLose: 'Retained as long as creator standing and community guidelines are maintained.',
  },
];

// ---------------------------------------------------------------------------
// 13. Snapchat Content Calendar Generator
// ---------------------------------------------------------------------------

export type SnapchatCalendarCadence = 2 | 3 | 5 | 7;
export type SnapchatContentMix = 'any' | 'stories' | 'spotlight' | 'behind_scenes' | 'challenges' | 'mixed';

export interface SnapchatCalendarEntry {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: string;
  format: 'Story' | 'Spotlight';
  title: string;
  concept: string;
  bestTime: string;
  suggestedStickerOrTag: string;
}

export function generateSnapchatCalendar(params: {
  topic: string;
  postsPerWeek: SnapchatCalendarCadence;
  startDate: string; // YYYY-MM-DD
  contentMix: SnapchatContentMix;
}): { entries: SnapchatCalendarEntry[]; error?: string } {
  const topic = params.topic.trim();
  if (!topic) {
    return { entries: [], error: 'Please enter a topic or focus for your Snapchat content calendar.' };
  }

  const start = new Date(params.startDate ? params.startDate + 'T00:00:00' : Date.now());
  if (isNaN(start.getTime())) {
    return { entries: [], error: 'Please choose a valid start date.' };
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Days to schedule depending on postsPerWeek
  const dayIntervals: Record<SnapchatCalendarCadence, number[]> = {
    2: [0, 4], // Day 1, Day 5
    3: [0, 2, 5], // Day 1, Day 3, Day 6
    5: [0, 1, 2, 4, 5], // Mon, Tue, Wed, Fri, Sat
    7: [0, 1, 2, 3, 4, 5, 6], // Daily
  };

  const activeDays = dayIntervals[params.postsPerWeek] || [0, 2, 5];

  const templates = [
    {
      format: 'Story' as const,
      title: `Morning Kickoff & Setup for ${topic}`,
      concept: `3-snap story showing your morning workspace and daily goal regarding ${topic}.`,
      bestTime: '8:00 AM – 10:00 AM',
      suggestedStickerOrTag: 'Time Sticker + Location Tag',
    },
    {
      format: 'Spotlight' as const,
      title: `15-Second Fast Hack: The secret to ${topic}`,
      concept: `High energy vertical short demonstrating a game-changing shortcut for ${topic}.`,
      bestTime: '12:00 PM – 2:00 PM',
      suggestedStickerOrTag: '#Spotlight #Hacks #FYP',
    },
    {
      format: 'Story' as const,
      title: `This or That Poll: Choosing styles for ${topic}`,
      concept: `Post 2 photos of contrasting choices and let your audience vote with the Poll sticker.`,
      bestTime: '4:00 PM – 6:00 PM',
      suggestedStickerOrTag: 'Poll / Voting Sticker',
    },
    {
      format: 'Spotlight' as const,
      title: `Expectation vs Reality bloopers of ${topic}`,
      concept: `Comedic 20-second vertical video contrasting aesthetic expectations with reality.`,
      bestTime: '6:00 PM – 9:00 PM',
      suggestedStickerOrTag: '#Humor #Relatable #Viral',
    },
    {
      format: 'Story' as const,
      title: `Ask Me Anything Q&A Session on ${topic}`,
      concept: `Post a Question sticker. Answer the top 3 questions on camera using casual lenses.`,
      bestTime: '7:00 PM – 9:30 PM',
      suggestedStickerOrTag: 'Questions Sticker (AMA)',
    },
    {
      format: 'Spotlight' as const,
      title: `Step-by-step Mini Tutorial for ${topic}`,
      concept: `Concise 40-second vertical breakdown with on-screen text overlays and subtitles.`,
      bestTime: '1:00 PM – 3:30 PM',
      suggestedStickerOrTag: '#Tutorial #LearnOnSnap #Guide',
    },
    {
      format: 'Story' as const,
      title: `Sunday Chill Wrap-up & Sneak Peek: ${topic}`,
      concept: `Bedside or cozy evening snap recapping the week’s progress and teasing next week.`,
      bestTime: '8:30 PM – 10:00 PM',
      suggestedStickerOrTag: 'Music Sticker + Mood GIF',
    },
  ];

  const entries: SnapchatCalendarEntry[] = [];

  for (let i = 0; i < activeDays.length; i++) {
    const dayOffset = activeDays[i];
    const curDate = new Date(start.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = dayNames[curDate.getDay()];
    const dateStr = curDate.toISOString().slice(0, 10);
    const template = templates[i % templates.length];

    let format: 'Story' | 'Spotlight' = template.format;
    if (params.contentMix === 'stories') format = 'Story';
    if (params.contentMix === 'spotlight') format = 'Spotlight';

    entries.push({
      dayNumber: i + 1,
      dateStr,
      dayOfWeek,
      format,
      title: template.title,
      concept: template.concept,
      bestTime: template.bestTime,
      suggestedStickerOrTag: template.suggestedStickerOrTag,
    });
  }

  return { entries };
}

export function serializeSnapchatCalendarCsv(entries: SnapchatCalendarEntry[]): string {
  const header = ['Day', 'Date', 'Day of Week', 'Format', 'Title & Concept', 'Best Time', 'Stickers & Tags'];
  const rows = entries.map((e) => [
    `Day ${e.dayNumber}`,
    e.dateStr,
    e.dayOfWeek,
    e.format,
    `"${e.title.replace(/"/g, '""')} — ${e.concept.replace(/"/g, '""')}"`,
    `"${e.bestTime}"`,
    `"${e.suggestedStickerOrTag}"`,
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// 14. Snapchat Bio Generator (STRICT ≤ 150 CHARS)
// ---------------------------------------------------------------------------

export type SnapchatBioVibe = 'casual' | 'creator' | 'minimal' | 'aesthetic' | 'fun';

export function generateSnapchatBiosDetailed(params: {
  handleOrName?: string;
  focus: string;
  vibe: SnapchatBioVibe;
  count: 5 | 10;
  variation?: number;
}): { bios: { text: string; chars: number; isWithinLimit: boolean }[]; error?: string } {
  const focus = params.focus.trim();
  if (!focus) {
    return { bios: [], error: 'Please enter what you share or do on Snapchat (e.g. daily vlogs, photography, fitness).' };
  }

  const name = params.handleOrName?.trim() ? params.handleOrName.trim() : 'Hey';
  const cleanFocus = focus.length > 25 ? focus.slice(0, 25).trim() : focus;

  const templates: Record<SnapchatBioVibe, string[]> = {
    casual: [
      `${name} 👻 | Snapping ${cleanFocus} daily • Add me for the chaos 👇`,
      `Just here for good snaps and ${cleanFocus} ✨ | ${name}`,
      `Living life through 10-second snaps 📸 | ${cleanFocus} • Tap to view story!`,
      `${name} ✌️ Sharing raw ${cleanFocus} moments • Friends & good vibes only`,
      `Low maintenance, high snap score 🔥 | ${cleanFocus} enthusiast`,
      `Welcome to my daily reality: ${cleanFocus} ☕ | Add for streaks & stories`,
    ],
    creator: [
      `Creating daily ${cleanFocus} clips on Spotlight 🎬 | ${name} 👻`,
      `Official Snap Creator 👑 | Exploring ${cleanFocus} • New story every day!`,
      `Your favorite ${cleanFocus} creator 🚀 | Spotlight & Stories • Join the ride`,
      `Sharing tips & behind the scenes of ${cleanFocus} 💡 | Add ${name}`,
      `Building in public with ${cleanFocus} ✨ | Check today’s story 👇`,
      `${cleanFocus} tutorials & wild stories 🔥 | Follow for daily updates`,
    ],
    minimal: [
      `${name} • ${cleanFocus} • 👻`,
      `${cleanFocus} in 10 seconds.`,
      `Less talk, more snaps: ${cleanFocus} ☁️`,
      `Capturing ${cleanFocus} 🕊️`,
      `${cleanFocus} / daily moments / ${name}`,
      `Living simply with ${cleanFocus} 🍃`,
    ],
    aesthetic: [
      `chasing golden hours & ${cleanFocus} 🕯️ | ${name}`,
      `soft moments and ${cleanFocus} aesthetic ✨ 🕊️`,
      `vintage soul snapping ${cleanFocus} 🎞️ | welcome to my world`,
      `cozy days + ${cleanFocus} ☕ 🌸 | tap my story for warmth`,
      `dreaming in color through ${cleanFocus} 🌷 | ${name}`,
      `aesthetic frames & real memories: ${cleanFocus} 🌙`,
    ],
    fun: [
      `Certified clown specializing in ${cleanFocus} 🤡💀 | Add me!`,
      `Here for a good time, not a long streak ⚡ | ${cleanFocus} 🥳`,
      `100% chance of unhinged ${cleanFocus} stories 😂 | ${name}`,
      `Send coffee or ${cleanFocus} memes 🍟 | Add up!`,
      `My life is 90% ${cleanFocus} and 10% sleep 🫠 | Enjoy the show`,
      `Warning: highly addictive ${cleanFocus} snaps ahead ⚠️ 👻`,
    ],
  };

  const pool = templates[params.vibe] || templates.casual;
  const offset = params.variation || 0;
  const rotated = [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)];

  const results = rotated.slice(0, params.count).map((text) => {
    const chars = countUnicodeChars(text);
    return {
      text,
      chars,
      isWithinLimit: chars <= 150,
    };
  });

  return { bios: results };
}

// ---------------------------------------------------------------------------
// 15. Snapchat Stylish Text Generator (DECORATIVE EMBELLISHMENTS & BRACKETS)
// ---------------------------------------------------------------------------

export interface StylishTextItem {
  id: string;
  name: string;
  result: string;
}

export function generateSnapchatStylishText(rawText: string): StylishTextItem[] {
  const t = rawText.trim() ? rawText : 'Snapchat Story';

  return [
    { id: 'sparkles', name: 'Sparkle Stars', result: `✧･ﾟ: *✧ ${t} ✧*:･ﾟ✧` },
    { id: 'corner-brackets', name: 'Japanese Corner Brackets', result: `『 ${t} 』` },
    { id: 'solid-brackets', name: 'Black Lenticular Brackets', result: `【 ${t} 】` },
    { id: 'shooting-star', name: 'Shooting Star', result: `★彡 ${t} 彡★` },
    { id: 'aesthetic-wings', name: 'Aesthetic Winged', result: `꧁ ${t} ꧂` },
    { id: 'lightning', name: 'Lightning Bolts', result: `⚡ ${t} ⚡` },
    { id: 'guillemets', name: 'Double Arrows', result: `« ${t} »` },
    { id: 'cloud-puff', name: 'Soft Clouds', result: `☁️ ${t} ☁️` },
    { id: 'heart-border', name: 'Heart Garland', result: `♡ ${t} ♡` },
    { id: 'flame-fire', name: 'Fire Streak', result: `🔥 ${t} 🔥` },
    { id: 'cross-star', name: 'Diamond Cross', result: `✦ ${t} ✦` },
    { id: 'ghost-snap', name: 'Snapchat Ghost', result: `👻 ${t} 👻` },
    { id: 'music-notes', name: 'Melody Notes', result: `♫ ${t} ♫` },
    { id: 'butterfly-charm', name: 'Butterfly Glow', result: `🦋 ${t} 🦋` },
  ];
}

// ---------------------------------------------------------------------------
// 16. Snapchat Font Generator (UNICODE ALPHABETS — DISTINCT TOOL)
// ---------------------------------------------------------------------------

export interface UnicodeFontItem {
  id: string;
  name: string;
  result: string;
}

export function generateSnapchatUnicodeFonts(rawText: string): UnicodeFontItem[] {
  const text = rawText.trim() ? rawText : 'Snapchat Story';

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
    n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
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
    n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
  };

  return [
    { id: 'bold-sans', name: 'Bold Sans', result: transform(boldSansMap) },
    { id: 'bold-serif', name: 'Bold Serif', result: transform(boldSerifMap) },
    { id: 'italic-sans', name: 'Italic Sans', result: transform(italicSansMap) },
    { id: 'cursive-script', name: 'Cursive Script', result: transform(scriptMap) },
    { id: 'double-struck', name: 'Double Struck / Chalkboard', result: transform(doubleStruckMap) },
    { id: 'monospace', name: 'Monospace Typewriter', result: transform(monospaceMap) },
    { id: 'circled', name: 'Circled Bubble', result: transform(circledMap) },
  ];
}

// ---------------------------------------------------------------------------
// 17. Snapchat Score Tracker Types & Utilities
// ---------------------------------------------------------------------------

export interface SnapchatScoreLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  score: number;
  note?: string;
}

export function computeSnapchatScoreStats(entries: SnapchatScoreLogEntry[]): {
  currentScore: number;
  initialScore: number;
  netGain: number;
  averageGainPerEntry: number;
  daysSpan: number;
} {
  if (entries.length === 0) {
    return {
      currentScore: 0,
      initialScore: 0,
      netGain: 0,
      averageGainPerEntry: 0,
      daysSpan: 0,
    };
  }

  // Sort ascending by date
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const initial = sorted[0].score;
  const current = sorted[sorted.length - 1].score;
  const netGain = current - initial;
  const averageGainPerEntry = sorted.length > 1 ? Math.round(netGain / (sorted.length - 1)) : 0;

  const firstDate = new Date(sorted[0].date).getTime();
  const lastDate = new Date(sorted[sorted.length - 1].date).getTime();
  const daysSpan = Math.max(1, Math.round((lastDate - firstDate) / (24 * 60 * 60 * 1000)) + 1);

  return {
    currentScore: current,
    initialScore: initial,
    netGain,
    averageGainPerEntry,
    daysSpan,
  };
}

// Backward compatibility export for bio generator
export function generateSnapchatBios(topic: string): string[] {
  return generateSnapchatBiosDetailed({ focus: topic, vibe: 'casual', count: 5 }).bios.map((b) => b.text);
}
