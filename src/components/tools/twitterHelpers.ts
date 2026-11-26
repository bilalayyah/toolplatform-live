// Pure deterministic browser helpers for Twitter (X) tools (zero AI, zero server calls)

export function splitTwitterThread(text: string): string[] {
  const clean = text.trim();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const tweets: string[] = [];
  let current = '';

  for (const w of words) {
    const next = current ? current + ' ' + w : w;
    if ([...next].length <= 265) {
      current = next;
    } else {
      if (current) tweets.push(current);
      current = w;
    }
  }
  if (current) tweets.push(current);

  const total = tweets.length;
  return tweets.map((t, i) => `${t} (${i + 1}/${total})`);
}

export function calculateTwitterEngagement(params: {
  mode: 'followers' | 'impressions';
  baseCount: number;
  likes: number;
  replies: number;
  retweets: number;
  bookmarks?: number;
}): {total: number; er: number; tier: string} {
  const bms = params.bookmarks || 0;
  const total = params.likes + params.replies + params.retweets + bms;
  const divisor = Math.max(1, params.baseCount);
  const er = (total / divisor) * 100;
  let tier = 'Below Average (<1%)';
  if (er >= 4) tier = 'Viral / Exceptional (4%+)';
  else if (er >= 2) tier = 'High Engagement (2%–4%)';
  else if (er >= 1) tier = 'Good / Solid (1%–2%)';

  return {total, er: Number(er.toFixed(2)), tier};
}

export function calculateTwitterGrowth(start: number, now: number, days: number): {growth: number; pct: number | null; perDay: number} {
  const s = start;
  const n = Math.max(0, now);
  const d = Math.max(1, days);
  const growth = n - s;
  const pct = s > 0 ? Number(((growth / s) * 100).toFixed(2)) : null;
  const perDay = Number((growth / d).toFixed(2));
  return {growth, pct, perDay};
}

export function generateTwitterQuotes(topic: string, style: string, count: number): {quote: string; length: number}[] {
  const t = topic.trim() || 'growth and consistency';
  const styles: Record<string, string[]> = {
    'Motivational': [
      `The secret to making progress with ${t} is simply starting before you feel ready.`,
      `Consistency in ${t} compounds quietly until success becomes undeniable.`,
      `Every master of ${t} was once a beginner who refused to quit on tough days.`,
      `Your future self will thank you for the effort you put into ${t} today.`,
      `Doubt kills more dreams of ${t} than failure ever will. Keep shipping.`,
      `Momentum in ${t} is built through small daily actions rather than occasional bursts.`,
      `Embrace the friction while learning ${t}; that is where real skill develops.`,
      `Discipline is choosing what you want most over what you want right now in ${t}.`,
      `Perfection is the enemy of momentum when building expertise in ${t}.`,
      `Your dedication to ${t} today determines your capability tomorrow.`,
    ],
    'Thoughtful': [
      `The most underrated skill in ${t} is knowing when to pause and reflect.`,
      `Depth in ${t} always beats breadth when building long-term leverage.`,
      `Simplicity is the ultimate sophistication when approaching ${t}.`,
      `We overestimate what we can achieve in a day with ${t}, and underestimate what we can do in a year.`,
      `True mastery in ${t} comes from removing unneeded complexity, not adding it.`,
      `Curiosity is the primary fuel for sustainable growth in ${t}.`,
      `Listen to feedback on your ${t} work with an open mind and a calm filter.`,
      `The quality of your inputs dictates the quality of your output in ${t}.`,
      `Patience with the process of ${t} protects you from premature burnout.`,
      `Refining your foundational principles in ${t} unlocks exponential leverage.`,
    ],
    'Funny': [
      `Me: I'm going to master ${t} today.\nAlso me: 3 hours watching tutorials on loop. 🤡`,
      `My relationship with ${t} is basically 90% stubbornness and 10% caffeine.`,
      `Day 1 of mastering ${t}: Feeling like a genius.\nDay 2: Why is this so hard?! 💀`,
      `I told myself I'd take a quick break from ${t}, and now it's 3 AM.`,
      `Debugging my approach to ${t} is like searching for keys that are already in my hand.`,
      `Professional ${t} expert: someone who makes mistakes look intentional.`,
      `My brain on ${t}: 10% brilliant insights, 90% wondering what to eat next.`,
      `If ${t} was easy, everyone would do it before breakfast.`,
      `Executing ${t} plan: expectation vs reality is a comedy special.`,
      `Running on pure optimism and cold brew while working on ${t}.`,
    ],
    'Short & punchy': [
      `Focus on the fundamentals of ${t} and ignore the noise.`,
      `Speed comes from clarity when working on ${t}.`,
      `Do the hard work on ${t} especially when nobody is watching.`,
      `Ship early. Learn fast. Master ${t}.`,
      `Keep it simple when tackling ${t}.`,
      `Action cures anxiety in ${t}.`,
      `Build the habit. Master ${t}.`,
      `Clarity beats cleverness in ${t}.`,
      `Stay consistent with ${t}.`,
      `Execute, evaluate, improve ${t}.`,
    ],
  };

  const pool = styles[style] || styles['Motivational'];
  const selected = pool.slice(0, Math.max(1, Math.min(count, pool.length)));
  return selected.map(q => ({quote: q, length: [...q].length}));
}

export function generateTwitterCalendar(niche: string, perWeek: number, startDate: string, mix: string): {day: string; date: string; idea: string; type: string}[] {
  const n = niche.trim() || 'tech & creators';
  const start = startDate ? new Date(startDate) : new Date();
  const count = Math.max(1, Math.min(7, perWeek));
  const results = [];

  const ideaBank = [
    {idea: `Share a 1-sentence hot take about ${n} to spark replies`, type: 'Quick Post'},
    {idea: `Publish a 3-part thread breaking down a key trend in ${n}`, type: 'Thread'},
    {idea: `Post a 1600x900 infographic breakdown for ${n}`, type: 'Visual Graphic'},
    {idea: `Run an X poll asking followers their biggest challenge with ${n}`, type: 'Poll'},
    {idea: `Share an honest lesson or failure you overcame in ${n}`, type: 'Story / Quote'},
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

export function convertToStylishTwitterText(text: string): {id: string; name: string; result: string}[] {
  const t = text || 'Twitter / X';
  return [
    {id: 'bracket', name: 'Bracket Frame', result: `【 ${t} 】`},
    {id: 'sparkle', name: 'Sparkle Border', result: `✨ ${t} ✨`},
    {id: 'bubble', name: 'Bubble Symbols', result: [...t].map(c => `${c}⃘`).join('') || t},
    {id: 'gothic', name: 'Gothic Deco', result: `𝔄 ${t} 𝔄`},
    {id: 'strike', name: 'Strikethrough Line', result: [...t].map(c => `${c}̶`).join('')},
    {id: 'wing', name: 'Wing Embellishment', result: `ʚïɞ ${t} ʚïɞ`},
  ];
}
