// Pure deterministic browser helpers for Facebook tools (zero AI, zero server calls)

export function fitBioWithinCap(text: string, maxChars: number): string {
  const chars = Array.from(text.trim());
  if (chars.length <= maxChars) return text.trim();
  const sliced = chars.slice(0, maxChars).join('');
  // Try trimming cleanly at the last whitespace / separator if at least half remains
  const lastBreak = Math.max(
    sliced.lastIndexOf(' '),
    sliced.lastIndexOf('\n'),
    sliced.lastIndexOf('|'),
    sliced.lastIndexOf('•')
  );
  if (lastBreak >= Math.floor(maxChars * 0.55)) {
    const clean = sliced.slice(0, lastBreak).replace(/[\s|•\-–—→🔗✓]+$/u, '').trim();
    if (clean.length > 0 && Array.from(clean).length <= maxChars) {
      return clean;
    }
  }
  const compact = chars.slice(0, Math.max(1, maxChars - 1)).join('').trimEnd();
  return `${compact}…`;
}

export function generateFacebookBios(params: {
  niche: string;
  value: string;
  cta: string;
  maxIntroChars?: number;
  batch?: number;
}): {title: string; bio: string; length: number; cap: number}[] {
  const n = params.niche.trim() || 'Digital Creator & Community';
  const v = params.value.trim() || 'Practical tips & weekly resources';
  const cta = params.cta.trim() || 'Join our community 👇';
  const introCap = params.maxIntroChars ?? 101;
  const batch = params.batch ?? 0;

  const variants = [
    [
      {
        title: 'Professional Intro Bio',
        raw: `${n} • ${v}\n\n🔗 ${cta}`,
        cap: introCap,
      },
      {
        title: 'Bullet Point Summary',
        raw: `✓ ${n}\n✓ ${v}\n→ ${cta}`,
        cap: introCap,
      },
      {
        title: 'Short & Punchy',
        raw: `${n} | ${v} | ${cta}`,
        cap: introCap,
      },
    ],
    [
      {
        title: 'Value-First Bio',
        raw: `${v} — by ${n}. ${cta}`,
        cap: introCap,
      },
      {
        title: 'Clean Minimal Bio',
        raw: `${n}\n${v}\n${cta}`,
        cap: introCap,
      },
      {
        title: 'Action-Focused Bio',
        raw: `${n}: ${v}. 👉 ${cta}`,
        cap: introCap,
      },
    ],
  ];

  const selected = variants[batch % variants.length];
  return selected.map((t) => {
    const fitted = fitBioWithinCap(t.raw, t.cap);
    return {
      title: t.title,
      bio: fitted,
      length: Array.from(fitted).length,
      cap: t.cap,
    };
  });
}

export function validateFacebookUsername(raw: string): {
  valid: boolean;
  normalized: string;
  checks: {label: string; passed: boolean}[];
} {
  const trimmed = raw.trim();
  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  const lengthOk = handle.length >= 5 && handle.length <= 50;
  const charsOk = /^[a-zA-Z0-9.]+$/.test(handle);
  const noConsecutiveDots = !/\.\./.test(handle);
  const notAllNumbers = !/^\d+$/.test(handle);

  const checks = [
    {label: 'Length is between 5 and 50 characters', passed: lengthOk},
    {label: 'Contains only alphanumeric characters and periods (.)', passed: charsOk},
    {label: 'No consecutive periods (..)', passed: noConsecutiveDots},
    {label: 'Not composed exclusively of numbers', passed: notAllNumbers},
  ];

  const valid = checks.every((c) => c.passed);
  return {
    valid,
    normalized: '@' + handle,
    checks,
  };
}

export function calculateFacebookEngagement(params: {
  followers: number;
  reactions: number;
  comments: number;
  shares: number;
}): {totalInteractions: number; er: number; tier: string} {
  const totalInteractions = params.reactions + params.comments + params.shares;
  const er = params.followers > 0 ? (totalInteractions / params.followers) * 100 : 0;
  let tier = 'Below Average (<1%)';
  if (er >= 5) tier = 'Viral / Exceptional (5%+)';
  else if (er >= 2) tier = 'High Engagement (2%–5%)';
  else if (er >= 1) tier = 'Good / Solid (1%–2%)';

  return {
    totalInteractions,
    er: Number(er.toFixed(2)),
    tier,
  };
}

export function generateFacebookHashtags(keyword: string): string[] {
  const kw = keyword.toLowerCase().trim().replace(/[^a-z0-9]/g, '') || 'community';
  return [
    `#${kw}`,
    `#${kw}community`,
    `#${kw}tips`,
    `#facebook${kw}`,
    `#${kw}groups`,
    `#trending${kw}`,
    `#${kw}daily`,
  ];
}
