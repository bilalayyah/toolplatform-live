// Pure deterministic browser helpers for TikTok tools (zero AI, zero server calls)

export function generateTikTokBios(params: {
  niche: string;
  cta: string;
}): {title: string; bio: string; length: number}[] {
  const n = params.niche.trim() || 'Content Creator';
  const c = params.cta.trim() || 'Grab free guides 👇';

  const templates = [
    {
      title: 'Minimal Creator Bio',
      bio: `${n} ✨\n${c}`,
    },
    {
      title: 'Bulleted Bio',
      bio: `📍 Creator\n💡 ${n}\n🔗 ${c}`,
    },
    {
      title: 'Action Bio',
      bio: `🚀 Daily ${n} tips\n👇 Get started here`,
    },
  ];

  return templates.map((t) => ({
    title: t.title,
    bio: t.bio,
    length: t.bio.length,
  }));
}

export function formatTikTokProfileBio(lines: string[]): {bio: string; length: number; valid: boolean} {
  const joined = lines.filter(Boolean).join('\n');
  return {
    bio: joined,
    length: joined.length,
    valid: joined.length <= 80,
  };
}

export function validateTikTokUsername(raw: string): {
  valid: boolean;
  normalized: string;
  checks: {label: string; passed: boolean}[];
} {
  const trimmed = raw.trim();
  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  const lengthOk = handle.length >= 2 && handle.length <= 24;
  const charsOk = /^[a-zA-Z0-9._]+$/.test(handle);
  const noEndingPeriod = !/\.$/.test(handle);

  const checks = [
    {label: 'Length is between 2 and 24 characters', passed: lengthOk},
    {label: 'Only letters, numbers, underscores, and periods', passed: charsOk},
    {label: 'Does not end with a period (.)', passed: noEndingPeriod},
  ];

  const valid = checks.every((c) => c.passed);
  return {
    valid,
    normalized: '@' + handle,
    checks,
  };
}

export function generateTikTokUsernames(base: string): {handle: string; length: number}[] {
  const clean = base.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'creator';
  const rawList = [
    `@${clean}`,
    `@${clean}tok`,
    `@${clean}.official`,
    `@hey${clean}`,
    `@real_${clean}`,
    `@${clean}_diaries`,
    `@${clean}vlog`,
    `@the${clean}`,
  ];
  return rawList.map(h => ({handle: h, length: h.length}));
}

export function calculateTikTokEngagement(params: {
  mode: 'followers' | 'views';
  baseCount: number;
  likes: number;
  comments: number;
  shares: number;
}): {totalInteractions: number; er: number; tier: string} {
  const totalInteractions = params.likes + params.comments + params.shares;
  const divisor = Math.max(1, params.baseCount);
  const er = (totalInteractions / divisor) * 100;
  let tier = 'Below Average (<1%)';
  if (er >= 8) tier = 'Viral / Exceptional (8%+)';
  else if (er >= 4) tier = 'High Engagement (4%–8%)';
  else if (er >= 2) tier = 'Good / Solid (2%–4%)';

  return {
    totalInteractions,
    er: Number(er.toFixed(2)),
    tier,
  };
}

export function calculateTikTokEarnings(params: {
  views: number;
  cpm: number;
}): {min: number; mid: number; max: number} {
  const v = Math.max(0, params.views);
  const c = Math.max(0, params.cpm);
  const mid = (v / 1000) * c;
  return {
    min: Number((mid * 0.7).toFixed(2)),
    mid: Number(mid.toFixed(2)),
    max: Number((mid * 1.3).toFixed(2)),
  };
}

export function calculateTikTokCreatorEarningsProjected(params: {
  avgViews: number;
  videosPerMonth: number;
  engagementRate: number;
  rpm: number;
  sponsorshipFee: number;
}): {monthlyViews: number; rewardsMonthly: number; sponsorshipMonthly: number; totalMonthly: number} {
  const monthlyViews = Math.max(0, params.avgViews) * Math.max(0, params.videosPerMonth);
  const rewardsMonthly = (monthlyViews / 1000) * Math.max(0, params.rpm);
  const sponsorshipMonthly = Math.max(0, params.videosPerMonth) * Math.max(0, params.sponsorshipFee) * (1 + params.engagementRate / 50);
  const totalMonthly = rewardsMonthly + sponsorshipMonthly;
  return {
    monthlyViews,
    rewardsMonthly: Number(rewardsMonthly.toFixed(2)),
    sponsorshipMonthly: Number(sponsorshipMonthly.toFixed(2)),
    totalMonthly: Number(totalMonthly.toFixed(2)),
  };
}

export function generateTikTokHashtags(keyword: string, count: number = 10): string[] {
  const kw = keyword.toLowerCase().trim().replace(/[^a-z0-9]/g, '') || 'baking';
  const map: Record<string, string[]> = {
    'baking': ['#Sourdough', '#BakeFromScratch', '#BreadMaking', '#HomeBaker', '#PastryChef', '#BakingHacks', '#SweetTreats', '#KitchenDiaries', '#CakeArt', '#CookieRecipe', '#BakingTips', '#Croissant', '#BakersOfTikTok'],
    'fitness': ['#WorkoutRoutine', '#GymMotivation', '#FitnessGoals', '#FitTok', '#StrengthTraining', '#HealthyHabits', '#CoreWorkout', '#CardioRoutine', '#GymTips', '#MuscleBuilding', '#DailyMovement', '#FormCheck'],
    'travel': ['#TravelHack', '#HiddenGem', '#SoloTravel', '#Wanderlust', '#TravelItinerary', '#BudgetTravel', '#TravelDiaries', '#ExploreTheWorld', '#TripPlanner', '#TravelGuide', '#Backpacking', '#AirportHacks'],
    'finance': ['#PersonalFinance', '#MoneyTips', '#Budgeting101', '#SideHustle', '#WealthBuilding', '#SmartSaving', '#FinancialFreedom', '#InvestingForBeginners', '#MoneyHacks', '#CreditTips'],
  };

  const matched = map[kw] || [
    `#${kw}`,
    `#${kw}Tips`,
    `#learn${kw}`,
    `#${kw}Hacks`,
    `#pro${kw}`,
    `#${kw}Community`,
    `#discover${kw}`,
    `#${kw}Diaries`,
    `#master${kw}`,
    `#${kw}Guide`,
    `#${kw}Life`,
    `#${kw}101`,
  ];

  return matched.slice(0, Math.max(3, Math.min(count, matched.length)));
}

export function generateTikTokCaptions(topic: string, style: string, count: number): string[] {
  const t = topic.trim() || 'my daily routine';
  const templates: Record<string, string[]> = {
    'Short & punchy': [
      `Wait until you see how this changes ${t}. 🔥`,
      `The secret to ${t} nobody tells you. 🤫`,
      `POV: You finally figured out ${t}. ✨`,
      `Stop scrolling if you care about ${t}. 👇`,
      `This is how you master ${t} in 30 seconds. ⚡`,
      `Everything you need to know about ${t}. 🎯`,
      `I wish I knew this about ${t} sooner. 💡`,
      `The ultimate hack for ${t}. 🚀`,
      `Quick breakdown of ${t}. 👀`,
      `Let’s talk about ${t}. 💬`,
    ],
    'Storytelling': [
      `Storytime: How I completely transformed my approach to ${t} after months of trial and error. Let me know if you relate! 📖✨`,
      `I used to struggle so much with ${t} until I discovered this one simple mindset shift. Here is what happened. 💭👇`,
      `Nobody prepared me for how important ${t} would be. Here is my honest experience and what I learned along the way. 🌟`,
      `Day 30 of mastering ${t}: Here is the exact progress and the biggest lesson I learned this week. 📈`,
      `Here is the exact story of how ${t} changed everything for my routine. Drop a comment if you want part 2! 🎬`,
    ],
    'Question': [
      `Have you tried this approach to ${t} yet? Tell me your thoughts in the comments! 👇`,
      `What is your biggest struggle when it comes to ${t}? Let’s discuss below! 💬`,
      `Be honest: how do you usually handle ${t} in your daily routine? 🤔`,
      `Would you try this method for ${t}? Yes or no? 👇`,
      `Who else has been obsessed with ${t} lately? Raise your hand! 🙋‍♂️`,
    ],
    'Humorous': [
      `Me pretending I have total control over ${t}. 🤡😂`,
      `My therapist: "${t} can't hurt you." Me: 👀`,
      `Day 1 vs Day 100 of trying to figure out ${t}. We don't talk about Day 1. 💀`,
      `How I act when someone asks me for advice on ${t}. 💅✨`,
      `Me thinking I mastered ${t} before realizing I forgot the most important step. 🤦‍♂️`,
    ],
  };

  const pool = templates[style] || templates['Short & punchy'];
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(pool[i % pool.length]);
  }
  return results;
}

export function generateTikTokTrendingHashtagIdeas(niche: string, count: number): {angle: string; tags: string[]}[] {
  const n = niche.trim().replace(/[^a-zA-Z0-9]/g, '') || 'Niche';
  const categories = [
    {angle: 'Broad Discovery', tags: [`#${n}`, `#${n}Tok`, `#${n}Community`, `#Top${n}`, `#Explore${n}`]},
    {angle: 'Tutorial & Education', tags: [`#Learn${n}`, `#${n}Tips`, `#${n}Hacks`, `#HowTo${n}`, `#${n}Guide`]},
    {angle: 'Behind the Scenes & Vlogs', tags: [`#${n}Life`, `#${n}Diaries`, `#${n}Vlog`, `#DayInTheLife`, `#BehindTheScenes`]},
  ];
  return categories.slice(0, Math.max(1, Math.min(count, categories.length)));
}

export function generateTikTokVideoIdeas(niche: string, audience: string, type: string, count: number): {title: string; angle: string; why: string}[] {
  const n = niche.trim() || 'content creation';
  const aud = audience.trim() ? ` for ${audience}` : '';
  const ideas = [
    {title: `3 Mistakes Beginners Make with ${n}`, angle: 'Call out common errors early in the hook', why: 'Drives high comment engagement and debate'},
    {title: `A Day in the Life Working on ${n}`, angle: 'Fast-cut aesthetic montage with voiceover', why: 'Builds personal connection and relatability'},
    {title: `How to Start with ${n} in Under 60 Seconds`, angle: 'Step-by-step rapid tutorial', why: 'High save and share rate for beginners'},
    {title: `Testing the Biggest Myth About ${n}`, angle: 'Experiment format with a clear reveal', why: 'Creates strong curiosity gap'},
    {title: `Tools I Wish I Knew Earlier for ${n}`, angle: 'Curated resource breakdown', why: 'Drives saves and profile visits'},
    {title: `The Ultimate Guide to Mastering ${n}`, angle: 'Comprehensive step-by-step walkthrough', why: 'Establish authority and bookmark saves'},
  ];
  return ideas.slice(0, Math.max(1, Math.min(count, ideas.length))).map(item => ({
    ...item,
    title: `${item.title}${aud}`,
  }));
}

export function generateTikTokViralVideoIdeas(niche: string, audience: string, type: string, count: number): {title: string; format: string; note: string}[] {
  const n = niche.trim() || 'your niche';
  const aud = audience.trim() ? ` for ${audience}` : '';
  const ideas = [
    {title: `Unpopular opinion about ${n} that everyone secretly agrees with`, format: 'Hot Take / Talking Head', note: 'Encourages comment section discussions'},
    {title: `Before vs After achieving success in ${n}`, format: 'Transformation Transition', note: 'Visual contrast grabs immediate attention'},
    {title: `Stop doing ${n} like this — do this instead`, format: 'Correction / Value Bomb', note: 'Delivers instant actionable value'},
    {title: `Reacting to ridiculous advice about ${n}`, format: 'Reaction Duet / Stitch', note: 'Leverages existing trending formats'},
    {title: `The 1 trick nobody tells you about ${n}`, format: 'Curiosity Gap Hook', note: 'Maximizes initial watch time retention'},
  ];
  return ideas.slice(0, Math.max(5, Math.min(count, ideas.length))).map(item => ({
    ...item,
    title: `${item.title}${aud}`,
  }));
}

export function generateTikTokHooks(topic: string, style: string, count: number): string[] {
  const t = topic.trim() || 'this topic';
  const styles: Record<string, string[]> = {
    'Question': [
      `Did you know this secret about ${t}?`,
      `Why is nobody talking about ${t}?`,
      `Have you been making this mistake with ${t}?`,
      `Want to know the truth about ${t}?`,
      `What if I told you everything you know about ${t} is wrong?`,
    ],
    'Bold claim': [
      `This is the single most important rule of ${t}.`,
      `This will completely change how you view ${t}.`,
      `Nobody has ever explained ${t} as simply as this.`,
      `This is the ultimate cheat code for ${t}.`,
    ],
    'Story opener': [
      `I spent 3 years figuring out ${t} so you don't have to.`,
      `Here is what happened when I tested ${t} for 30 days.`,
      `My biggest regret with ${t} was not knowing this earlier.`,
    ],
    'Contrarian': [
      `Stop doing ${t} the traditional way. Do this instead.`,
      `Everything you've been taught about ${t} is a lie.`,
    ],
    'POV': [
      `POV: You finally mastered ${t} without burning out.`,
      `POV: Discovering the easiest shortcut for ${t}.`,
    ],
  };

  const pool = styles[style] || styles['Question'];
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(pool[i % pool.length]);
  }
  return results;
}

export function generateTikTokScript(topic: string, length: string, tone: string): {sections: {title: string; duration: string; script: string; words: number}[]; totalWords: number} {
  const t = topic.trim() || 'your video topic';
  const targetWords = length === '15s' ? 38 : length === '60s' ? 150 : 72;

  const sections = [
    {title: 'Hook (0–3s)', duration: '0–3s', script: `Stop scrolling if you want to understand ${t} faster and easier.`, words: 12},
    {title: 'Core Value / Body', duration: '3–' + (length === '15s' ? '12s' : length === '60s' ? '50s' : '25s'), script: `Here is the key breakdown of ${t}: First, focus on consistency. Second, eliminate distractions. Third, execute daily with clear intent.`, words: Math.max(20, targetWords - 22)},
    {title: 'Call to Action (CTA)', duration: 'Final 3s', script: `Save this video and follow for more ${t} tips!`, words: 10},
  ];

  const totalWords = sections.reduce((acc, s) => acc + s.words, 0);
  return {sections, totalWords};
}

export function generateTikTokTitles(topic: string, style: string, count: number): {title: string; length: number}[] {
  const t = topic.trim() || 'Creator Guide';
  const styles: Record<string, string[]> = {
    'Clicky': [
      `You Won't Believe This ${t} Hack`,
      `The Secret Behind ${t}`,
      `Why Everyone Is Wrong About ${t}`,
      `The Ultimate Truth About ${t}`,
      `I Tried ${t} For 7 Days`,
      `Don't Start ${t} Without Watching This`,
      `How I Mastered ${t} So Fast`,
      `The 1 Rule of ${t} Everyone Ignores`,
      `Stop Doing ${t} The Hard Way`,
      `Inside My ${t} Setup & Routine`,
    ],
    'Descriptive': [
      `Complete Step-by-Step Guide to ${t}`,
      `Everything You Need To Know About ${t}`,
      `Beginner's Walkthrough for ${t}`,
      `How To Setup And Run ${t}`,
      `Top Strategies For ${t} in 2026`,
      `The Ultimate Breakdown Of ${t}`,
      `Essential Checklist For ${t}`,
      `A Practical Masterclass On ${t}`,
      `Understanding ${t} In 5 Minutes`,
      `The Complete ${t} Playbook`,
    ],
    'Funny': [
      `How Not To Do ${t} 💀`,
      `Me Trying To Figure Out ${t} At 3 AM`,
      `Expectation vs Reality: ${t}`,
      `Things I Wish Someone Told Me About ${t}`,
      `My ${t} Era (Gone Wrong)`,
      `Trying ${t} So You Don't Have To`,
      `How I Pretend To Be Good At ${t}`,
      `The Chaos Of Learning ${t}`,
      `When ${t} Goes Completely Sideways`,
      `Day 1 Of ${t} Be Like...`,
    ],
    'Question': [
      `Are You Making This ${t} Mistake?`,
      `Can You Actually Master ${t} Today?`,
      `What Happens When You Try ${t}?`,
      `Is ${t} Worth Your Time in 2026?`,
      `Have You Ever Tried This ${t} Method?`,
      `Why Is ${t} So Hard To Get Right?`,
      `Are You Guilty Of These ${t} Errors?`,
      `Does This Simple Trick Fix ${t}?`,
      `Ready To Transform Your ${t}?`,
      `Who Else Struggles With ${t}?`,
    ],
  };

  const pool = styles[style] || styles['Clicky'];
  const uniqueList: string[] = [];
  const seen = new Set<string>();
  for (const item of pool) {
    if (!seen.has(item)) {
      seen.add(item);
      uniqueList.push(item);
    }
  }
  let i = 0;
  while (uniqueList.length < count) {
    const base = pool[i % pool.length];
    const variant = `${base} (Part ${Math.floor(uniqueList.length / pool.length) + 1})`;
    if (!seen.has(variant)) {
      seen.add(variant);
      uniqueList.push(variant);
    }
    i++;
  }

  const selected = uniqueList.slice(0, Math.max(1, Math.min(count, uniqueList.length)));
  return selected.map(title => ({title, length: title.length}));
}

export function generateTikTokDescriptions(topic: string, tone: string, includeTags: boolean): string[] {
  const t = topic.trim() || 'creator growth';
  const tags = includeTags ? `\n\n#${t.replace(/[^a-zA-Z0-9]/g, '')} #TikTokTips #ContentCreator #FYP` : '';
  const templates = [
    `Everything you need to know about ${t} explained in simple steps. Let me know your thoughts in the comments below! 👇${tags}`,
    `A quick breakdown of how to approach ${t} effectively. Drop a comment if you have questions! 💡${tags}`,
    `Sharing my top insights on ${t} today. Make sure to save this video for your next planning session! 📌${tags}`,
  ];
  return templates;
}

export function generateTikTokComments(topic: string, style: string, count: number): string[] {
  const t = topic.trim() || 'this video';
  const pool = [
    `This is such a helpful breakdown of ${t}! 🔥`,
    `Waiting for part 2 on ${t} 👀`,
    `Absolute game changer for ${t}. Thank you! 🙏`,
    `Mind = blown. Never thought about ${t} this way. 🤯`,
    `Where can I learn more about ${t}? 🔗`,
    `Needed this today! Thanks for sharing. 🙌`,
  ];
  return pool.slice(0, Math.max(1, Math.min(count, pool.length)));
}

export function generateTikTokReplies(comment: string, intent: string, tone: string): string[] {
  const c = comment.trim() || 'Great video!';
  return [
    `Thanks for watching! Glad this helped clarify things about "${c}". 🙌`,
    `Appreciate the support! Let me know if you want a deeper dive on this. 💡`,
    `Spot on! Thanks for adding to the conversation. 🤝`,
    `Couldn't agree more with your point! ✨`,
  ];
}

export function generateTikTokDMs(purpose: string, recipient: string, tone: string): string[] {
  const p = purpose || 'collab';
  const r = recipient ? `Hey ${recipient}!` : 'Hey there!';
  return [
    `${r} Love your recent content! Would love to chat about a quick ${p} opportunity whenever you have a moment. 🚀`,
    `${r} Huge fan of your page. Reaching out regarding a potential ${p} partnership. Let me know if you're open to connecting! ✨`,
    `${r} Quick question regarding your recent ${p} video — would love to exchange notes! 💬`,
  ];
}

export function parseTikTokHashtags(text: string): {count: number; tags: string[]; duplicates: string[]; chars: number} {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const seen = new Set<string>();
  const tags: string[] = [];
  const duplicates: string[] = [];

  for (const m of matches) {
    const lower = m.toLowerCase();
    if (seen.has(lower)) {
      if (!duplicates.includes(m)) duplicates.push(m);
    } else {
      seen.add(lower);
      tags.push(m);
    }
  }

  return {
    count: tags.length,
    tags,
    duplicates,
    chars: text.length,
  };
}

export function removeDuplicateHashtags(text: string): string {
  const parsed = parseTikTokHashtags(text);
  return parsed.tags.join(' ');
}

export function mixTikTokHashtags(setA: string, setB: string, setC: string, shuffle: boolean, limit: number): {result: string; count: number} {
  const raw = `${setA}\n${setB}\n${setC}`.match(/#[a-zA-Z0-9_]+/g) || [];
  const unique = Array.from(new Set(raw.map(t => t.toLowerCase())));
  if (shuffle) {
    unique.sort(() => Math.random() - 0.5);
  }
  const sliced = unique.slice(0, Math.max(1, Math.min(limit, unique.length)));
  return {
    result: sliced.join(' '),
    count: sliced.length,
  };
}

export function formatTikTokText(text: string, actions: {upper?: boolean; lower?: boolean; capitalize?: boolean; trimSpaces?: boolean; trimBreaks?: boolean}): string {
  let res = text;
  if (actions.trimSpaces) res = res.replace(/[ \t]+/g, ' ');
  if (actions.trimBreaks) res = res.replace(/\n\s*\n/g, '\n').trim();
  if (actions.upper) res = res.toUpperCase();
  if (actions.lower) res = res.toLowerCase();
  if (actions.capitalize) {
    res = res.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return res;
}

export function countTikTokCharacters(text: string, limitType: 'bio' | 'nickname' | 'comment' | 'caption' | 'handle'): {count: number; limit: number; remaining: number; exceeded: boolean} {
  const count = text.length;
  const limits = {bio: 80, nickname: 30, comment: 150, caption: 4000, handle: 24};
  const limit = limits[limitType] || 80;
  return {
    count,
    limit,
    remaining: limit - count,
    exceeded: count > limit,
  };
}

export function calculateTikTokGrowth(start: number, now: number, days: number): {growth: number; pct: number; perDay: number} {
  const s = start;
  const n = Math.max(0, now);
  const d = Math.max(1, days);
  const growth = n - s;
  const pct = s > 0 ? (growth / s) * 100 : n > 0 ? 100 : 0;
  const perDay = growth / d;
  return {growth, pct: Number(pct.toFixed(2)), perDay: Number(perDay.toFixed(2))};
}

export function calculateTikTokLength(script: string, wpm: number, targetSecs: number): {words: number; durationSecs: number; formatted: string; targetBudgetMin: number; targetBudgetMax: number} {
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  const rate = Math.max(60, wpm || 150);
  const durationSecs = Math.round((words / rate) * 60);
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;
  const targetWords = Math.round((targetSecs / 60) * rate);

  return {
    words,
    durationSecs,
    formatted: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
    targetBudgetMin: Math.round(targetWords * 0.9),
    targetBudgetMax: Math.round(targetWords * 1.1),
  };
}

export function generateTikTokCalendar(niche: string, perWeek: number, startDate: string, mix: string): {day: string; date: string; idea: string; type: string}[] {
  const n = niche.trim() || 'digital marketing';
  const start = startDate ? new Date(startDate) : new Date();
  const count = Math.max(1, Math.min(7, perWeek));
  const results = [];

  const ideaBank = [
    {idea: `Film a 30-second screen recording showing one free tool for ${n}`, type: 'Tutorial / Tip'},
    {idea: `Record a 3-step breakdown of auditing a client's ${n} profile`, type: 'Educational'},
    {idea: `Share one common myth about ${n} and why it fails`, type: 'Hot Take / Story'},
    {idea: `Show your exact morning setup and workflow for ${n}`, type: 'Behind the Scenes'},
    {idea: `React to a beginner mistake in ${n} with a quick correction`, type: 'Reaction / Stitch'},
    {idea: `List 3 resources every beginner in ${n} should bookmark`, type: 'Resource Guide'},
    {idea: `Walk through a real before-and-after case study in ${n}`, type: 'Case Study'},
  ];

  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', {weekday: 'long'});
    const formattedDate = d.toLocaleDateString();
    const template = ideaBank[i % ideaBank.length];
    results.push({
      day: dayName,
      date: formattedDate,
      idea: template.idea,
      type: template.type,
    });
  }
  return results;
}

export function getTikTokPostingTimes(region: string, audienceType: string): {day: string; window: string; note: string}[] {
  const shiftHours = region.includes('PST') ? -3 : region.includes('UK') ? +5 : region.includes('Europe') ? +6 : region.includes('Asia') ? +12 : 0;
  
  const base = [
    {day: 'Monday', hourStart: 9, hourEnd: 11, note: `${audienceType} morning engagement peak`},
    {day: 'Tuesday', hourStart: 14, hourEnd: 16, note: `${audienceType} mid-day scroll window`},
    {day: 'Wednesday', hourStart: 18, hourEnd: 20, note: `${audienceType} evening relaxation peak`},
    {day: 'Thursday', hourStart: 12, hourEnd: 15, note: `${audienceType} lunchtime activity`},
    {day: 'Friday', hourStart: 17, hourEnd: 19, note: `${audienceType} weekend kickoff`},
    {day: 'Saturday', hourStart: 10, hourEnd: 12, note: `${audienceType} morning leisure`},
    {day: 'Sunday', hourStart: 19, hourEnd: 21, note: `${audienceType} Sunday evening prep`},
  ];

  return base.map(b => {
    const startH = (b.hourStart + shiftHours + 24) % 24;
    const endH = (b.hourEnd + shiftHours + 24) % 24;
    const formatH = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 === 0 ? 12 : h % 12;
      return `${hr}:00 ${ampm}`;
    };
    return {
      day: b.day,
      window: `${formatH(startH)} – ${formatH(endH)} (${region})`,
      note: b.note,
    };
  });
}

export function checkTikTokAspectRatio(width: number, height: number): {ratio: string; match: boolean; diff: string; recommendedHeight: number} {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const target = 9 / 16;
  const current = w / h;
  const match = Math.abs(current - target) < 0.02;
  const recommendedHeight = Math.round(w * (16 / 9));
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const div = gcd(w, h);
  const rw = w / div;
  const rh = h / div;

  return {
    ratio: `${rw}:${rh} (${current.toFixed(2)})`,
    match,
    diff: match ? 'Perfect 9:16 vertical match!' : current > target ? `Too wide (landscape/square). Closest 9:16 height for width ${w}px is ${recommendedHeight}px` : 'Too tall or narrow',
    recommendedHeight,
  };
}

export function parseDurationToSeconds(input: string): number {
  const trimmed = input.trim();
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return parseInt(trimmed, 10) || 0;
}

export function estimateTikTokFileSize(durationInput: string | number, bitrateMbps: number): {sizeMB: number; formula: string} {
  const dur = typeof durationInput === 'string' ? parseDurationToSeconds(durationInput) : Math.max(0, durationInput);
  const rate = Math.max(0.1, bitrateMbps);
  const sizeMB = Number(((dur * rate) / 8).toFixed(2));
  return {
    sizeMB,
    formula: `(${dur}s duration × ${rate} Mbps) ÷ 8 = ${sizeMB} MB`,
  };
}

// Distinct Stylish Text vs Font Generator sets
export function convertToStylishText(text: string): {id: string; name: string; result: string}[] {
  const t = text || 'TikTok';
  return [
    {id: 'box', name: 'Squared Box', result: t.split('').map(c => `[${c}]`).join('')},
    {id: 'gothic', name: 'Gothic Framed', result: `𝔄 ${t} 𝔄`},
    {id: 'star', name: 'Star Frame', result: `★彡 ${t} 彡★`},
    {id: 'slash', name: 'Slash Strike', result: t.split('').map(c => `${c}̸`).join('')},
    {id: 'wave', name: 'Wave Underline', result: t.split('').map(c => `${c}̳`).join('')},
    {id: 'wings', name: 'Winged Decor', result: `ʚïɞ ${t} ʚïɞ`},
  ];
}
