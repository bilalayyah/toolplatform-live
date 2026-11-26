import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const TIKTOK_TOOLS: readonly Tool[] = [
  {
    id: 'tiktok-username-generator',
    name: 'TikTok Username Generator',
    slug: 'tiktok-username-generator',
    category: 'tiktok-tools',
    url: '/tiktok-username-generator',
    description: 'Build clean @username variations from your name or niche using rules and templates (not AI).',
    longDescription:
      'Turn your creator name, brand, or niche keywords into clean TikTok handles. TikTok Username Generator is strictly rule- and template-based inside your browser (NOT AI-written)—applying TikTok’s 24-character limit and allowed letters, numbers, underscores, and periods.',
    keywords: ['tiktok username generator', 'tt handle templates', 'tiktok name combinator', 'username ideas not ai'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'TikTok Username Generator combines keywords with deterministic handle templates locally in your browser (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter name or niche keywords',
        description: 'Enter your details and input your main name, topic word, and preferred prefix or suffix.',
      },
      {
        title: 'Generate template handle variations',
        description: 'Browser rules combine underscores, periods, and niche tags deterministically (NOT AI).',
      },
      {
        title: 'Validate syntax & copy',
        description: 'Check each handle against TikTok’s 24-character format rules before testing in the app.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Username Generator use AI?',
        answer: 'No. It uses keyword combinations and structural handle rules in your browser—NOT AI-written.',
      },
      {
        question: 'Does it check if the TikTok username is actually available?',
        answer: 'No. It formats and generates syntax-valid candidates only; availability must be checked on TikTok.',
      },
      {
        question: 'What is TikTok’s username character limit?',
        answer: 'TikTok usernames allow up to 24 characters using letters, numbers, underscores, and periods.',
      },
      {
        question: 'Are any outputs watermarked?',
        answer: 'No. Every TikTok tool is 100% free with zero watermarks.',
      },
    ],
    relatedTools: [
      'tiktok-username-format-checker',
      'tiktok-bio-generator',
      'tiktok-profile-bio-formatter',
      'tiktok-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-username-format-checker',
    name: 'TikTok Username Format Checker',
    slug: 'tiktok-username-format-checker',
    category: 'tiktok-tools',
    url: '/tiktok-username-format-checker',
    description: 'Validate TikTok handle syntax and 24-character format rules ONLY—never checks real availability.',
    longDescription:
      'Test whether a candidate handle obeys TikTok’s official syntax rules (2–24 characters, allowed characters, and no trailing period) before updating your profile. Checks FORMAT ONLY in your browser—it cannot query TikTok or verify real username availability.',
    keywords: ['tiktok username format checker', 'tt handle validator', 'check tiktok username rules', 'username syntax'],
    icon: 'CheckSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Username Format Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check TikTok @username length and character format rules locally in your browser. Format validation only—does not check live availability.',
    howTo: [
      {
        title: 'Type a candidate TikTok handle',
        description: 'Enter your details and enter the handle with or without the leading @ symbol.',
      },
      {
        title: 'Inspect character & period rules',
        description: 'Browser logic checks length (2–24 chars) and flags disallowed symbols or trailing periods.',
      },
      {
        title: 'Copy a syntax-safe handle',
        description: 'Review cleaned suggestions and check real availability inside the TikTok app.',
      },
    ],
    faqs: [
      {
        question: 'Does this check real TikTok username availability?',
        answer: 'No. It checks FORMAT ONLY (length, allowed characters, and period rules)—never live availability.',
      },
      {
        question: 'Can a TikTok username end with a period?',
        answer: 'No. Periods are allowed inside TikTok usernames but cannot be placed at the very end.',
      },
      {
        question: 'Is this tool browser-based?',
        answer: 'Yes. Instant regex and character checks run locally with no network lookups.',
      },
      {
        question: 'Can I build new handle ideas first?',
        answer: 'Yes. Pair it with TikTok Username Generator to combine keyword patterns.',
      },
    ],
    relatedTools: [
      'tiktok-username-generator',
      'tiktok-profile-bio-formatter',
      'tiktok-bio-generator',
      'tiktok-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-bio-generator',
    name: 'TikTok Bio Generator',
    slug: 'tiktok-bio-generator',
    category: 'tiktok-tools',
    url: '/tiktok-bio-generator',
    description: 'Assemble concise 80-character TikTok profile bios from structured templates (not AI).',
    longDescription:
      'Fit your niche, proof point, and link call-to-action cleanly inside TikTok’s tight 80-character bio cap. TikTok Bio Generator is strictly template-based inside your browser (NOT AI-generated)—giving you stacked single-line and CTA layouts with live counting.',
    keywords: ['tiktok bio generator', 'tt bio templates', '80 character bio', 'tiktok profile bio not ai'],
    icon: 'CircleUserRound',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Bio Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build crisp 80-character TikTok bios using editable templates in your browser (NOT AI). Free with live character counter.',
    howTo: [
      {
        title: 'Enter topic, value & CTA',
        description: 'Enter your details and fill short phrases for what you post and where followers should tap.',
      },
      {
        title: 'Choose structured bio templates',
        description: 'Pick compact divider, stacked-line, or link-arrow templates deterministically (NOT AI).',
      },
      {
        title: 'Copy within 80 characters',
        description: 'Verify your text stays inside TikTok’s 80-character bio limit and paste into Edit Profile.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Bio Generator use AI?',
        answer: 'No. Every bio layout comes from editable structural templates inside your browser—NOT AI.',
      },
      {
        question: 'Does it track TikTok’s 80-character bio limit?',
        answer: 'Yes. A live counter warns immediately if your selected template exceeds 80 characters.',
      },
      {
        question: 'Can I format line breaks and symbols cleanly?',
        answer: 'Yes. Pair it with TikTok Profile Bio Formatter and TikTok Font Generator.',
      },
      {
        question: 'Is there any cost or watermark?',
        answer: 'No. All outputs are plain copyable text with zero fees or watermarks.',
      },
    ],
    relatedTools: [
      'tiktok-profile-bio-formatter',
      'tiktok-character-counter',
      'tiktok-username-generator',
      'tiktok-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-caption-generator',
    name: 'TikTok Caption Generator',
    slug: 'tiktok-caption-generator',
    category: 'tiktok-tools',
    url: '/tiktok-caption-generator',
    description: 'Draft punchy TikTok video captions from hook, context, and CTA templates (not AI).',
    longDescription:
      'Pair your video with a clear opener, quick takeaway, and comment prompt without staring at a blank caption field. TikTok Caption Generator uses editable structural templates in your browser (NOT AI-written) sized for TikTok’s caption display.',
    keywords: ['tiktok caption generator', 'tt caption templates', 'short form caption helper', 'caption builder not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Assemble structured TikTok captions from editable hook and CTA templates in your browser (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Add video topic & CTA',
        description: 'Enter your details and enter your subject, core tip, and desired viewer question.',
      },
      {
        title: 'Pick a caption template',
        description: 'Choose tutorial, storytime, teaser, or question templates formatted deterministically (NOT AI).',
      },
      {
        title: 'Append tags & copy',
        description: 'Combine with hashtags and paste directly into TikTok before posting.',
      },
    ],
    faqs: [
      {
        question: 'Are captions generated with AI?',
        answer: 'No. This tool fills editable creator templates from your own inputs—NOT AI-written.',
      },
      {
        question: 'How long can TikTok captions be?',
        answer: 'TikTok supports up to 4,000 characters, though keeping key hooks in the first ~100 characters improves mobile legibility.',
      },
      {
        question: 'Can I count characters and hashtags together?',
        answer: 'Yes. Check final length with TikTok Character Counter and TikTok Hashtag Counter.',
      },
      {
        question: 'Are outputs free and unwatermarked?',
        answer: 'Yes. Copy clean plain text directly with no watermarks.',
      },
    ],
    relatedTools: [
      'tiktok-hashtag-generator',
      'tiktok-character-counter',
      'tiktok-hook-generator',
      'tiktok-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-hashtag-generator',
    name: 'TikTok Hashtag Generator',
    slug: 'tiktok-hashtag-generator',
    category: 'tiktok-tools',
    url: '/tiktok-hashtag-generator',
    description: 'Build balanced TikTok hashtag sets from seed keywords using rule templates (not AI).',
    longDescription:
      'Organize broad, niche, and format tags cleanly before publishing. TikTok Hashtag Generator expands your topic words through deterministic keyword templates inside your browser (NOT AI and NOT live TikTok API scraping).',
    keywords: ['tiktok hashtag generator', 'tt hashtags', 'tiktok tag builder', 'niche hashtag templates'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Hashtag Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format clean TikTok hashtag sets from seed keywords using deterministic browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter 1–3 topic keywords',
        description: 'Enter your details and enter your core subject, video style, and audience niche.',
      },
      {
        title: 'Combine broad & niche templates',
        description: 'Browser rules format camelCase/lowercase tags from curated word lists (NOT AI).',
      },
      {
        title: 'Copy a 3–6 tag block',
        description: 'Pick a concise set, copy to clipboard, and pair with your caption.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Hashtag Generator use AI or live TikTok trends?',
        answer: 'No. It expands your seed words using local browser templates only—NOT AI and not live view-count scraping.',
      },
      {
        question: 'How many hashtags should I use on TikTok?',
        answer: 'Most creators stick to 3–6 relevant niche hashtags so captions stay readable.',
      },
      {
        question: 'Can I mix saved hashtag groups cleanly?',
        answer: 'Yes. Use TikTok Hashtag Mixer to blend and shuffle existing lists.',
      },
      {
        question: 'Is there any limit or fee?',
        answer: 'No. It runs cleanly in your browser for free.',
      },
    ],
    relatedTools: [
      'tiktok-hashtag-counter',
      'tiktok-hashtag-mixer',
      'tiktok-trending-hashtag-ideas-generator',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-hashtag-counter',
    name: 'TikTok Hashtag Counter',
    slug: 'tiktok-hashtag-counter',
    category: 'tiktok-tools',
    url: '/tiktok-hashtag-counter',
    description: 'Count hashtags, detect duplicates, and check tag length in TikTok captions locally.',
    longDescription:
      'Keep TikTok descriptions clean and avoid repeating tags or cluttering your caption space. Paste any draft caption into TikTok Hashtag Counter to tally total #hashtags, highlight duplicate tags, and measure character share.',
    keywords: ['tiktok hashtag counter', 'count tiktok tags', 'duplicate hashtag checker', 'tt tag counter'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Hashtag Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Count TikTok hashtags, spot duplicates, and check caption tag balance instantly in your browser. Free and unwatermarked.',
    howTo: [
      {
        title: 'Paste caption or hashtag block',
        description: 'Enter your details and paste your full draft TikTok caption or raw tag list.',
      },
      {
        title: 'Review count & duplicates',
        description: 'Browser parsing tallies unique vs duplicate hashtags and flags malformed tags.',
      },
      {
        title: 'Trim & copy clean tags',
        description: 'Remove duplicates in one click and copy the tidy hashtag string.',
      },
    ],
    faqs: [
      {
        question: 'Does it strip duplicate TikTok hashtags automatically?',
        answer: 'Yes. Enter your details and it flags repeated tags regardless of capitalization so you can deduplicate cleanly.',
      },
      {
        question: 'Does it measure caption character count too?',
        answer: 'Yes. It reports both total hashtag count and combined caption character length.',
      },
      {
        question: 'Does this run offline in my browser?',
        answer: 'Yes. Pure client-side text parsing runs privately in your tab.',
      },
      {
        question: 'Can I shuffle or build tag sets alongside this?',
        answer: 'Yes. Use TikTok Hashtag Mixer and TikTok Hashtag Generator.',
      },
    ],
    relatedTools: [
      'tiktok-hashtag-generator',
      'tiktok-hashtag-mixer',
      'tiktok-character-counter',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-hashtag-mixer',
    name: 'TikTok Hashtag Mixer',
    slug: 'tiktok-hashtag-mixer',
    category: 'tiktok-tools',
    url: '/tiktok-hashtag-mixer',
    description: 'Combine, deduplicate, and randomly shuffle up to 3 TikTok hashtag buckets in your browser.',
    longDescription:
      'Stop pasting the exact same hashtag block onto every TikTok post. Paste your niche, format, and community tag lists into TikTok Hashtag Mixer to sample balanced combinations deterministically or randomly in your browser.',
    keywords: ['tiktok hashtag mixer', 'shuffle tiktok hashtags', 'combine tt tag lists', 'hashtag randomizer'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Hashtag Mixer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Blend, deduplicate, and sample fresh TikTok hashtag combinations from your pasted tag lists in the browser.',
    howTo: [
      {
        title: 'Paste 2 or 3 tag lists',
        description: 'Enter your details and enter niche tags, video-type tags, and audience tags in separate boxes.',
      },
      {
        title: 'Set target tag count',
        description: 'Choose how many hashtags to pull from each group (for example 2 niche + 2 format + 1 broad).',
      },
      {
        title: 'Shuffle & copy cleanly',
        description: 'Remove duplicates automatically and copy a fresh set for your caption.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Hashtag Mixer invent tags with AI?',
        answer: 'No. It combines and shuffles only the hashtags you paste using local browser randomization.',
      },
      {
        question: 'Will it prevent duplicate hashtags across lists?',
        answer: 'Yes. Case-insensitive deduplication ensures the same tag never appears twice.',
      },
      {
        question: 'Can I check total tag count before copying?',
        answer: 'Yes. Output length and tag count display live next to the copy button.',
      },
      {
        question: 'Is any account login required?',
        answer: 'No. Everything runs locally in your browser tab.',
      },
    ],
    relatedTools: [
      'tiktok-hashtag-generator',
      'tiktok-hashtag-counter',
      'tiktok-trending-hashtag-ideas-generator',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-trending-hashtag-ideas-generator',
    name: 'TikTok Trending Hashtag Ideas Generator',
    slug: 'tiktok-trending-hashtag-ideas-generator',
    category: 'tiktok-tools',
    url: '/tiktok-trending-hashtag-ideas-generator',
    description: 'Template hashtag-idea starter packs by category—NOT live trending data and NOT AI.',
    longDescription:
      'Need quick inspiration for evergreen seasonal, tutorial, and challenge-style TikTok hashtag buckets? TikTok Trending Hashtag Ideas Generator serves curated TEMPLATE ideas in your browser—NOT live TikTok trending feed data and NOT AI-generated.',
    keywords: ['tiktok trending hashtag ideas', 'tiktok hashtag templates', 'evergreen hashtag ideas not live', 'tt tags'],
    icon: 'TrendingUp',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Trending Hashtag Ideas Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Browse template TikTok hashtag idea packs locally in your browser (NOT live trending data, NOT AI). Free to copy.',
    howTo: [
      {
        title: 'Pick niche & content angle',
        description: 'Enter your details and choose a creator category and optional seasonal or format theme.',
      },
      {
        title: 'Load curated template packs',
        description: 'Browser presets assemble structured hashtag idea groups from static templates (NOT live trends, NOT AI).',
      },
      {
        title: 'Verify live inside TikTok',
        description: 'Check current tag relevance inside the TikTok search bar before publishing.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch real-time trending hashtags from TikTok?',
        answer: 'No. These are static TEMPLATE hashtag ideas for brainstorming only—NOT live trending data.',
      },
      {
        question: 'Does it use AI?',
        answer: 'No. It uses curated template packs and keyword substitution in your browser—NOT AI.',
      },
      {
        question: 'Why verify tags in the TikTok app?',
        answer: 'Live challenge tags change hourly, so checking TikTok Creative Center or search directly gives real-time volume.',
      },
      {
        question: 'Can I customize and mix the template tags?',
        answer: 'Yes. Send selected tags to TikTok Hashtag Mixer or TikTok Hashtag Counter.',
      },
    ],
    relatedTools: [
      'tiktok-hashtag-generator',
      'tiktok-hashtag-mixer',
      'tiktok-hashtag-counter',
      'tiktok-video-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-idea-generator',
    name: 'TikTok Video Idea Generator',
    slug: 'tiktok-video-idea-generator',
    category: 'tiktok-tools',
    url: '/tiktok-video-idea-generator',
    description: 'Pair your niche with repeatable vertical video formats using editable templates (not AI).',
    longDescription:
      'Eliminate creative block for daily vertical filming. TikTok Video Idea Generator matches your topic keywords with proven repeatable series formats (how-to, myth-busting, 30-second breakdown, day-in-the-life) using local browser templates—NOT AI.',
    keywords: ['tiktok video idea generator', 'tt content ideas', 'vertical video formats', 'video prompts not ai'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Video Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate repeatable TikTok video concept prompts from editable niche templates in your browser (NOT AI). Free and fast.',
    howTo: [
      {
        title: 'Enter topic & audience level',
        description: 'Enter your details and input your niche topic and pick beginner, intermediate, or behind-the-scenes style.',
      },
      {
        title: 'Mix format templates',
        description: 'Browser rules pair your topic with structured short-form templates deterministically (NOT AI).',
      },
      {
        title: 'Move winners into a script',
        description: 'Copy promising prompts into TikTok Hook Generator or TikTok Script Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Video Idea Generator use AI?',
        answer: 'No. Prompts are built strictly from structured topic + format templates inside your browser—NOT AI.',
      },
      {
        question: 'Can I plan multiple weeks of videos at once?',
        answer: 'Yes. Export selected ideas directly into TikTok Content Calendar Generator.',
      },
      {
        question: 'Does it work for faceless or B-roll accounts?',
        answer: 'Yes. Filter templates for tutorial, listicle, voiceover, and POV angles.',
      },
      {
        question: 'Are outputs free to use commercially?',
        answer: 'Yes. All templates are free with zero restrictions or watermarks.',
      },
    ],
    relatedTools: [
      'tiktok-viral-video-idea-generator',
      'tiktok-hook-generator',
      'tiktok-script-generator',
      'tiktok-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-viral-video-idea-generator',
    name: 'TikTok Viral Video Idea Generator',
    slug: 'tiktok-viral-video-idea-generator',
    category: 'tiktok-tools',
    url: '/tiktok-viral-video-idea-generator',
    description: 'High-retention hook & angle templates for TikTok—cannot guarantee virality and not AI.',
    longDescription:
      'Explore popular high-curiosity and strong-opinion short-form content frameworks for brainstorming. TikTok Viral Video Idea Generator uses structured storytelling templates in your browser (NOT AI) and cannot guarantee virality or views.',
    keywords: ['tiktok viral video idea generator', 'high retention tiktok ideas', 'viral video templates not ai'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Viral Video Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Brainstorm high-retention TikTok angles using browser templates (NOT AI). Ideas cannot guarantee virality or algorithm reach.',
    howTo: [
      {
        title: 'Type your topic & tension point',
        description: 'Enter your details and enter a common mistake, contrarian tip, or quick transformation in your niche.',
      },
      {
        title: 'Apply curiosity-gap templates',
        description: 'Browser templates organize strong openers and visual pacing cues (NOT AI, cannot guarantee virality).',
      },
      {
        title: 'Outline & film cleanly',
        description: 'Test strong hooks alongside concise pacing using TikTok Hook Generator.',
      },
    ],
    faqs: [
      {
        question: 'Can this tool guarantee a viral TikTok video?',
        answer: 'No. No generator can guarantee virality—reach depends on execution, timing, watch time, and audience response.',
      },
      {
        question: 'Is this tool AI-powered?',
        answer: 'No. It uses structured storytelling and hook templates locally in your browser—NOT AI.',
      },
      {
        question: 'What makes a template high-retention?',
        answer: 'Clear visual payoff, an immediate 2-second hook, and concise pacing rather than slow intros.',
      },
      {
        question: 'Can I adapt the concepts into full outlines?',
        answer: 'Yes. Expand any concept in TikTok Script Generator.',
      },
    ],
    relatedTools: [
      'tiktok-video-idea-generator',
      'tiktok-hook-generator',
      'tiktok-script-generator',
      'tiktok-video-title-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-hook-generator',
    name: 'TikTok Hook Generator',
    slug: 'tiktok-hook-generator',
    category: 'tiktok-tools',
    url: '/tiktok-hook-generator',
    description: 'Draft 2-second spoken and on-screen TikTok opening hooks via editable templates (not AI).',
    longDescription:
      'Win the first two seconds before viewers swipe away. TikTok Hook Generator maps your video topic into curiosity, mistake-avoidance, proof, and step-by-step opener formulas inside your browser—strictly template-based, NOT AI.',
    keywords: ['tiktok hook generator', '2 second hook templates', 'tiktok intro lines', 'opening hook builder not ai'],
    icon: 'Zap',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Hook Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build punchy 2-second TikTok spoken & text-overlay hooks using browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter payoff or common mistake',
        description: 'Enter your details and enter the outcome your TikTok delivers or myth you disprove.',
      },
      {
        title: 'Pick opener frameworks',
        description: 'Templates populate spoken hooks and short on-screen text lines deterministically (NOT AI).',
      },
      {
        title: 'Combine into your video script',
        description: 'Copy your favorite opening line directly into TikTok Script Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Hook Generator use AI?',
        answer: 'No. It applies proven structural hook formulas to your own inputs in the browser—NOT AI.',
      },
      {
        question: 'How long should an on-screen TikTok hook be?',
        answer: 'Aim for 5–9 concise words that can be read effortlessly in under two seconds.',
      },
      {
        question: 'Can I pair spoken hooks with visual cover text?',
        answer: 'Yes. Format cover overlays inside TikTok Video Cover Maker.',
      },
      {
        question: 'Is there any usage cap?',
        answer: 'No. Generate and copy template hooks freely in your browser.',
      },
    ],
    relatedTools: [
      'tiktok-script-generator',
      'tiktok-viral-video-idea-generator',
      'tiktok-video-title-generator',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-script-generator',
    name: 'TikTok Script Generator',
    slug: 'tiktok-script-generator',
    category: 'tiktok-tools',
    url: '/tiktok-script-generator',
    description: 'Build editable 15–60 second TikTok script outlines using structured templates ONLY (not AI).',
    longDescription:
      'Organize your filming points cleanly before hitting record. TikTok Script Generator creates an editable template outline only—covering 0–2s Hook, Setup, Value Steps, and Closing CTA—using deterministic browser templates, NOT AI-written.',
    keywords: ['tiktok script generator', 'tiktok script outline template', 'short form script template not ai'],
    icon: 'FileText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Script Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create editable TikTok script outlines (Hook, Value, CTA) from browser templates ONLY—NOT AI-written.',
    howTo: [
      {
        title: 'Select target length (15s, 30s, or 60s)',
        description: 'Enter your details and pick duration and fill in your topic, key point, and ending CTA.',
      },
      {
        title: 'Generate template outline',
        description: 'Creates a structured bullet-point filming outline (template outline only, NOT AI-written).',
      },
      {
        title: 'Check speaking pace & film',
        description: 'Verify word-count timing with TikTok Video Length Calculator before filming.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Script Generator write complete scripts using AI?',
        answer: 'No. It generates an editable template outline ONLY inside your browser—you fill in your authentic voice, NOT AI.',
      },
      {
        question: 'Can I estimate how many seconds my outline will take to read?',
        answer: 'Yes. Check speaking words-per-minute with TikTok Video Length Calculator.',
      },
      {
        question: 'Does it include B-roll or shot-cue slots?',
        answer: 'Yes. Every outline includes optional shot-change reminders every 3–5 seconds.',
      },
      {
        question: 'Is there any upload or sign-in required?',
        answer: 'No. Everything stays privately in your browser.',
      },
    ],
    relatedTools: [
      'tiktok-hook-generator',
      'tiktok-video-length-calculator',
      'tiktok-video-idea-generator',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-title-generator',
    name: 'TikTok Video Title Generator',
    slug: 'tiktok-video-title-generator',
    category: 'tiktok-tools',
    url: '/tiktok-video-title-generator',
    description: 'Craft concise TikTok cover and clip titles via structured word templates (not AI).',
    longDescription:
      'Create punchy cover titles and search-friendly clip headlines that read clearly inside TikTok’s profile grid. TikTok Video Title Generator runs deterministically in your browser using editable headline formulas—never AI.',
    keywords: ['tiktok video title generator', 'tiktok cover title', 'tt video headline templates', 'title builder not ai'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Video Title Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build scannable TikTok clip & cover titles using deterministic browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter main topic keyword',
        description: 'Enter your details and type what your video teaches, reviews, or demonstrates.',
      },
      {
        title: 'Browse headline formulas',
        description: 'Browser templates format numbered, how-to, and comparison titles deterministically (NOT AI).',
      },
      {
        title: 'Place on your cover or caption',
        description: 'Copy clean short headlines straight into TikTok Video Cover Maker or your caption opener.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Video Title Generator use AI?',
        answer: 'No. Titles are formatted strictly from structural headline formulas in your browser—NOT AI.',
      },
      {
        question: 'Why do concise cover titles matter on TikTok?',
        answer: 'Clear 3–6 word titles help profile visitors scan your 9:16 video grid immediately.',
      },
      {
        question: 'Can I pair titles with cover artwork?',
        answer: 'Yes. Design your 1080x1920 cover layout using TikTok Video Cover Maker.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes. Zero fees and zero watermarks.',
      },
    ],
    relatedTools: [
      'tiktok-video-cover-maker',
      'tiktok-hook-generator',
      'tiktok-caption-generator',
      'tiktok-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-description-generator',
    name: 'TikTok Description Generator',
    slug: 'tiktok-description-generator',
    category: 'tiktok-tools',
    url: '/tiktok-description-generator',
    description: 'Assemble keyword-clear TikTok post descriptions using editable browser templates (not AI).',
    longDescription:
      'Structure longer TikTok descriptions cleanly with a search-friendly summary, quick bullet points, CTA, and curated hashtags. Built from deterministic browser templates—NOT AI-written.',
    keywords: ['tiktok description generator', 'tt post description template', 'tiktok seo caption template'],
    icon: 'AlignLeft',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format structured TikTok video descriptions from editable summary and CTA templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Fill summary, steps & CTA',
        description: 'Enter your details and input your topic keyword, quick key points, and desired viewer action.',
      },
      {
        title: 'Pick a layout template',
        description: 'Browser rules assemble readable line breaks, dividers, and tag slots (NOT AI).',
      },
      {
        title: 'Check character count & copy',
        description: 'Verify caption readability and paste directly into the TikTok upload screen.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Description Generator use AI?',
        answer: 'No. It populates fixed layout templates with your own wording—NOT AI-written.',
      },
      {
        question: 'How is a description different from a short caption?',
        answer: 'TikTok allows longer search-friendly context and bullet summaries alongside your top 100-character hook.',
      },
      {
        question: 'Can I check total characters and hashtags?',
        answer: 'Yes. Verify length using TikTok Character Counter and TikTok Hashtag Counter.',
      },
      {
        question: 'Is everything private?',
        answer: 'Yes. All text assembly runs locally inside your browser tab.',
      },
    ],
    relatedTools: [
      'tiktok-caption-generator',
      'tiktok-character-counter',
      'tiktok-hashtag-generator',
      'tiktok-text-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-comment-generator',
    name: 'TikTok Comment Generator',
    slug: 'tiktok-comment-generator',
    category: 'tiktok-tools',
    url: '/tiktok-comment-generator',
    description: 'Draft thoughtful pinned & community TikTok comments from editable templates (not AI).',
    longDescription:
      'Pin helpful follow-up links, timestamps, or conversation starters on your videos cleanly. TikTok Comment Generator builds polite, engaging comment prompts from browser templates only—NOT AI.',
    keywords: ['tiktok comment generator', 'pinned comment templates', 'tt community comment ideas not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build pinned questions and creator comment starters using browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Choose comment purpose',
        description: 'Enter your details and pick pinned question, bonus tip, poll prompt, or creator support.',
      },
      {
        title: 'Fill your video context',
        description: 'Templates insert your topic and keep comments concise under 150 characters (NOT AI).',
      },
      {
        title: 'Copy & post on TikTok',
        description: 'Paste your drafted comment cleanly without repetitive phrasing.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Comment Generator use AI?',
        answer: 'No. Comments are assembled strictly from editable browser templates—NOT AI.',
      },
      {
        question: 'Can this auto-post comments on TikTok?',
        answer: 'No. It generates clean draft text for you to review and post manually.',
      },
      {
        question: 'What is TikTok’s comment character limit?',
        answer: 'Standard TikTok comments allow up to 150 characters per comment.',
      },
      {
        question: 'Need replies to follower questions too?',
        answer: 'Yes. Try TikTok Reply Generator for quick fan-reply templates.',
      },
    ],
    relatedTools: [
      'tiktok-reply-generator',
      'tiktok-dm-generator',
      'tiktok-character-counter',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-reply-generator',
    name: 'TikTok Reply Generator',
    slug: 'tiktok-reply-generator',
    category: 'tiktok-tools',
    url: '/tiktok-reply-generator',
    description: 'Organize fast, friendly TikTok comment reply templates locally in your browser (not AI).',
    longDescription:
      'Reply quickly to FAQ comments, product requests, or video-reply prompts without typing the same sentence fifty times. TikTok Reply Generator formats concise 150-character reply templates locally in your browser—NOT AI.',
    keywords: ['tiktok reply generator', 'comment reply templates', 'creator faq replies not ai'],
    icon: 'Reply',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Reply Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build consistent TikTok comment reply templates in your browser (NOT AI). Free, private, and unwatermarked.',
    howTo: [
      {
        title: 'Pick reply scenario',
        description: 'Enter your details and select thank-you, link pointer, clarification, or video-reply follow-up.',
      },
      {
        title: 'Customize editable template fields',
        description: 'Browser templates substitute your custom link label or answer inside 150 characters (NOT AI).',
      },
      {
        title: 'Copy & respond faster',
        description: 'Copy clean replies straight from your browser into TikTok comments.',
      },
    ],
    faqs: [
      {
        question: 'Is TikTok Reply Generator powered by AI?',
        answer: 'No. It is strictly template-based inside your browser—NOT AI-written.',
      },
      {
        question: 'Does it respect TikTok’s 150-character comment limit?',
        answer: 'Yes. Every template includes live character checking up to 150 characters.',
      },
      {
        question: 'Can it connect to my TikTok inbox?',
        answer: 'No. It works completely offline in your browser tab with copy-paste convenience.',
      },
      {
        question: 'Can I draft collaboration DMs as well?',
        answer: 'Yes. Use TikTok DM Generator for creator and brand outreach templates.',
      },
    ],
    relatedTools: [
      'tiktok-comment-generator',
      'tiktok-dm-generator',
      'tiktok-character-counter',
      'tiktok-random-comment-picker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-dm-generator',
    name: 'TikTok DM Generator',
    slug: 'tiktok-dm-generator',
    category: 'tiktok-tools',
    url: '/tiktok-dm-generator',
    description: 'Draft collab, sponsorship, and follower TikTok DM templates in your browser (not AI).',
    longDescription:
      'Send crisp outreach or community DMs without awkward phrasing. TikTok DM Generator structures creator collab pitches, UGC introductions, and giveaway winner notices using editable browser templates—NOT AI.',
    keywords: ['tiktok dm generator', 'creator collab dm template', 'ugc outreach template not ai'],
    icon: 'Send',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok DM Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build clean TikTok collab, UGC, and winner DM templates locally in your browser (NOT AI). Free and private.',
    howTo: [
      {
        title: 'Select DM use case',
        description: 'Enter your details and choose creator collab, UGC pitch, follower thank-you, or giveaway winner notice.',
      },
      {
        title: 'Fill recipient & offer details',
        description: 'Structured templates merge your handle, niche angle, and contact link (NOT AI).',
      },
      {
        title: 'Copy & send inside TikTok',
        description: 'Review your personalized message and send it directly in TikTok Messages.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok DM Generator use AI?',
        answer: 'No. All DM outlines come strictly from structured fill-in templates—NOT AI.',
      },
      {
        question: 'Does this send bulk automated messages?',
        answer: 'No. It formats draft messages locally for manual copy-and-paste only.',
      },
      {
        question: 'Does it include giveaway winner notification templates?',
        answer: 'Yes. Pair it with TikTok Giveaway Winner Picker when contacting winners.',
      },
      {
        question: 'Are any templates locked behind a sign-up?',
        answer: 'No. Everything is free to preview and use in your browser.',
      },
    ],
    relatedTools: [
      'tiktok-reply-generator',
      'tiktok-comment-generator',
      'tiktok-giveaway-winner-picker',
      'tiktok-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-stylish-text-generator',
    name: 'TikTok Stylish Text Generator',
    slug: 'tiktok-stylish-text-generator',
    category: 'tiktok-tools',
    url: '/tiktok-stylish-text-generator',
    description: 'Convert plain text into decorative Unicode styles for TikTok bios and captions (not AI).',
    longDescription:
      'Highlight key phrases in your TikTok display name, bio, or pinned comments. TikTok Stylish Text Generator applies deterministic Unicode character mapping and template symbol dividers inside your browser—NOT AI.',
    keywords: ['tiktok stylish text generator', 'fancy tiktok text', 'unicode bio symbols', 'cute tiktok fonts'],
    icon: 'Sparkles',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Style TikTok bios and display names using instant Unicode character templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your short phrase',
        description: 'Enter your details and enter your display name, CTA header, or bio tagline.',
      },
      {
        title: 'Preview Unicode text styles',
        description: 'Deterministic character tables map letters into bold, script, frame, or symbol presets (NOT AI).',
      },
      {
        title: 'Copy & check TikTok readability',
        description: 'Keep decorative Unicode limited to short headers so screen readers stay accessible.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Stylish Text Generator use AI?',
        answer: 'No. It maps ASCII characters directly to Unicode symbol presets in your browser—NOT AI.',
      },
      {
        question: 'Will styled Unicode characters work in TikTok bios?',
        answer: 'Yes, most standard Unicode bold, italic, and small-caps glyphs paste cleanly into TikTok bios and nicknames.',
      },
      {
        question: 'Why avoid styling every word of a long caption?',
        answer: 'Heavy Unicode text is harder for screen readers and search indexing; use it sparingly for emphasis.',
      },
      {
        question: 'Is it different from TikTok Font Generator?',
        answer: 'This tool emphasizes frames, dividers, and decorative presets alongside character glyphs.',
      },
    ],
    relatedTools: [
      'tiktok-font-generator',
      'tiktok-text-formatter',
      'tiktok-profile-bio-formatter',
      'tiktok-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-font-generator',
    name: 'TikTok Font Generator',
    slug: 'tiktok-font-generator',
    category: 'tiktok-tools',
    url: '/tiktok-font-generator',
    description: 'Generate copy-paste Unicode bold, italic, serif, and monospace TikTok text (not AI).',
    longDescription:
      'Make headlines stand out in TikTok profile bios and captions without leaving your browser. TikTok Font Generator performs deterministic Unicode glyph conversion and template style presets locally—NOT AI-generated and zero font downloads required.',
    keywords: ['tiktok font generator', 'unicode fonts for tiktok', 'bold italic tiktok bio', 'copy paste fonts'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Font Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert plain text into copy-paste Unicode bold, serif, italic, and monospace styles for TikTok in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter text to style',
        description: 'Enter your details and type any bio line, display name, or caption callout.',
      },
      {
        title: 'Compare Unicode font styles',
        description: 'Instant browser mapping outputs serif, sans-bold, monospace, cursive, and circled glyphs (NOT AI).',
      },
      {
        title: 'One-click copy to TikTok',
        description: 'Copy the styled string and paste directly into TikTok Edit Profile or captions.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Font Generator use AI?',
        answer: 'No. It uses fixed Unicode code-point lookup tables locally in your browser—NOT AI.',
      },
      {
        question: 'Are these real font files?',
        answer: 'No. They are universal Unicode characters that travel inside plain text across iOS, Android, and web.',
      },
      {
        question: 'Can I count how many characters styled text uses?',
        answer: 'Yes. Note that some Unicode glyphs count as 2 code units in strict counters like TikTok’s 80-char bio.',
      },
      {
        question: 'Can I pair this with line-break spacing?',
        answer: 'Yes. Use TikTok Text Formatter or TikTok Profile Bio Formatter.',
      },
    ],
    relatedTools: [
      'tiktok-stylish-text-generator',
      'tiktok-text-formatter',
      'tiktok-profile-bio-formatter',
      'tiktok-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-text-formatter',
    name: 'TikTok Text Formatter',
    slug: 'tiktok-text-formatter',
    category: 'tiktok-tools',
    url: '/tiktok-text-formatter',
    description: 'Clean line breaks, bullet spacing, and casing for TikTok captions and bios locally.',
    longDescription:
      'Prevent TikTok captions and profile text from collapsing into messy walls of text. Format clean line breaks, normalize punctuation, switch title/sentence case, and strip extra whitespace directly inside your browser.',
    keywords: ['tiktok text formatter', 'tiktok line break formatter', 'clean caption spacing', 'tt text cleaner'],
    icon: 'WrapText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Text Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format clean TikTok line breaks, bullet alignment, and case styles instantly in your browser. Free and unwatermarked.',
    howTo: [
      {
        title: 'Paste draft caption or bio',
        description: 'Enter your details and paste multi-line text or messy notes copied from another app.',
      },
      {
        title: 'Apply spacing & casing rules',
        description: 'Strip stray spaces, format bullet lists, or convert casing locally.',
      },
      {
        title: 'Copy ready-to-paste text',
        description: 'Copy the formatted block directly into TikTok.',
      },
    ],
    faqs: [
      {
        question: 'Why does TikTok collapse blank lines sometimes?',
        answer: 'Extra spaces or invisible control characters often break spacing; this formatter cleans lines reliably.',
      },
      {
        question: 'Does it work for TikTok comments too?',
        answer: 'Yes, though note comments are shorter (150 characters) and best kept compact.',
      },
      {
        question: 'Does this modify or rewrite my wording with AI?',
        answer: 'No. It strictly adjusts formatting, spacing, and capitalization deterministically.',
      },
      {
        question: 'Can I verify character count afterward?',
        answer: 'Yes. Open TikTok Character Counter to inspect exact TikTok limits.',
      },
    ],
    relatedTools: [
      'tiktok-profile-bio-formatter',
      'tiktok-character-counter',
      'tiktok-font-generator',
      'tiktok-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-character-counter',
    name: 'TikTok Character Counter',
    slug: 'tiktok-character-counter',
    category: 'tiktok-tools',
    url: '/tiktok-character-counter',
    description: 'Check text against TikTok bio (80), nickname (30), comment (150), and caption (4,000) limits.',
    longDescription:
      'Never get cut off mid-sentence on TikTok. Paste your text into TikTok Character Counter to check exact lengths against TikTok bio (80 chars), username (24 chars), nickname (30 chars), comment (150 chars), and caption (4,000 chars) limits.',
    keywords: ['tiktok character counter', 'tiktok bio limit 80', 'tiktok caption length checker', 'tt char limit'],
    icon: 'Ruler',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Measure TikTok bio (80), handle (24), comment (150), and caption (4,000) character limits locally in your browser.',
    howTo: [
      {
        title: 'Select TikTok field limit',
        description: 'Enter your details and switch between Bio (80), Handle (24), Nickname (30), Comment (150), and Caption (4,000).',
      },
      {
        title: 'Paste or type your draft',
        description: 'Browser logic calculates characters, words, lines, and above-the-fold caption preview length.',
      },
      {
        title: 'Trim & copy cleanly',
        description: 'Adjust over-limit text before pasting into TikTok.',
      },
    ],
    faqs: [
      {
        question: 'What are TikTok’s current character limits?',
        answer: 'TikTok allows 80 chars for bios, 24 for usernames, 30 for display names, 150 for comments, and up to 4,000 for video captions.',
      },
      {
        question: 'Does it show where the "More" fold truncates mobile captions?',
        answer: 'Yes. A visual marker flags the first ~90–100 characters visible before "See more".',
      },
      {
        question: 'Do emojis count as extra characters?',
        answer: 'Many emojis and styled Unicode symbols count as 2 UTF-16 code units, which this counter will display clearly.',
      },
      {
        question: 'Is any text uploaded?',
        answer: 'No. Counting runs 100% inside your browser tab.',
      },
    ],
    relatedTools: [
      'tiktok-bio-generator',
      'tiktok-caption-generator',
      'tiktok-hashtag-counter',
      'tiktok-profile-bio-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-engagement-rate-calculator',
    name: 'TikTok Engagement Rate Calculator',
    slug: 'tiktok-engagement-rate-calculator',
    category: 'tiktok-tools',
    url: '/tiktok-engagement-rate-calculator',
    description: 'Calculate TikTok engagement rate by views or followers using transparent math formulas.',
    longDescription:
      'Benchmark your video or profile performance cleanly without signing into any analytics app. Enter likes, comments, shares, saves, and total views or followers to calculate both view-based and follower-based engagement percentages.',
    keywords: ['tiktok engagement rate calculator', 'tt engagement formula', 'tiktok likes views ratio'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compute TikTok engagement rate by views or followers instantaneously inside your browser. Zero login required.',
    howTo: [
      {
        title: 'Enter likes, comments, shares & saves',
        description: 'Enter your details and input public interaction totals for a video or recent multi-video average.',
      },
      {
        title: 'Add views or follower count',
        description: 'Choose whether to calculate engagement rate by Views or by Followers.',
      },
      {
        title: 'Review percentage breakdown',
        description: 'See exact formula results locally in your browser with zero account connection.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch my private TikTok analytics?',
        answer: 'No. Calculations run strictly from the numbers you enter in your browser.',
      },
      {
        question: 'Which TikTok engagement formula is better: by views or followers?',
        answer: 'Engagement by views shows how strongly viewers reacted to a specific clip; by followers reflects core audience loyalty.',
      },
      {
        question: 'Does it include saves/favorites in total interactions?',
        answer: 'Yes. Saves are an optional input alongside likes, comments, and shares.',
      },
      {
        question: 'Are formulas transparent?',
        answer: 'Yes. The exact numerator and denominator equation is displayed with the result.',
      },
    ],
    relatedTools: [
      'tiktok-follower-growth-calculator',
      'tiktok-money-calculator',
      'tiktok-earnings-calculator',
      'tiktok-best-posting-time-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-follower-growth-calculator',
    name: 'TikTok Follower Growth Calculator',
    slug: 'tiktok-follower-growth-calculator',
    category: 'tiktok-tools',
    url: '/tiktok-follower-growth-calculator',
    description: 'Project TikTok follower milestones and daily growth rate targets using simple math.',
    longDescription:
      'See how long it takes to reach 1,000 (live/link thresholds), 10,000, or 100,000 followers at your current weekly gain. Runs deterministic linear and compound growth equations locally in your browser—projection only.',
    keywords: ['tiktok follower growth calculator', 'tt milestone estimator', 'tiktok growth projection'],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Follower Growth Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Estimate days and weeks to reach TikTok follower goals from your current pace in the browser. Zero login needed.',
    howTo: [
      {
        title: 'Enter current & goal followers',
        description: 'Enter your details and input starting follower count and target milestone.',
      },
      {
        title: 'Input average daily or weekly gain',
        description: 'Compare steady linear net additions vs percentage growth pace.',
      },
      {
        title: 'View milestone timeline',
        description: 'See projected date and required daily follower pace locally.',
      },
    ],
    faqs: [
      {
        question: 'Are growth timelines guaranteed?',
        answer: 'No. Mathematical projections reflect steady pacing only—actual TikTok follower growth moves unevenly with video spikes.',
      },
      {
        question: 'Does this track my TikTok account live?',
        answer: 'No. You enter your counts manually inside your browser.',
      },
      {
        question: 'Does it highlight TikTok creator milestones like 1K and 10K?',
        answer: 'Yes. Quick presets let you project 1,000, 10,000, and 100,000 follower targets.',
      },
      {
        question: 'Can I calculate engagement rates too?',
        answer: 'Yes. Pair it with TikTok Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'tiktok-engagement-rate-calculator',
      'tiktok-earnings-calculator',
      'tiktok-content-calendar-generator',
      'tiktok-best-posting-time-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-money-calculator',
    name: 'TikTok Money Calculator',
    slug: 'tiktok-money-calculator',
    category: 'tiktok-tools',
    url: '/tiktok-money-calculator',
    description: 'Estimate potential TikTok creator revenue ranges from views and RPM assumptions—ESTIMATE ONLY.',
    longDescription:
      'Model hypothetical TikTok creator earnings across Creator Rewards view rates and brand-deal CPM benchmarks. ESTIMATE ONLY—actual payouts vary dramatically by country, audience niche, watch duration, and monetization eligibility.',
    keywords: ['tiktok money calculator', 'tiktok earnings estimator', 'creator rewards estimate only'],
    icon: 'DollarSign',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Money Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Estimate hypothetical TikTok creator payout ranges in your browser. Estimate only—actual payouts vary widely.',
    howTo: [
      {
        title: 'Enter estimated monthly or per-video views',
        description: 'Enter your details and input qualified 1-minute+ views or total sponsorship reach.',
      },
      {
        title: 'Adjust RPM / sponsorship range',
        description: 'Test conservative to optimistic payout-per-1,000-views assumptions locally.',
      },
      {
        title: 'Review low–high estimate range',
        description: 'Read estimate-only monthly and annual projections with formula transparency.',
      },
    ],
    faqs: [
      {
        question: 'Are TikTok Money Calculator numbers exact?',
        answer: 'No. All results are ESTIMATE ONLY—actual earnings vary widely by viewer country, niche, watch time, and brand terms.',
      },
      {
        question: 'Do all TikTok views qualify for Creator Rewards payouts?',
        answer: 'No. Generally only qualified For You views on eligible longer videos (such as 1+ minute clips in supported regions) count.',
      },
      {
        question: 'Does this pull data from my TikTok Creator Center?',
        answer: 'No. Calculations run purely in your browser from numbers you enter.',
      },
      {
        question: 'How does it differ from TikTok Earnings Calculator?',
        answer: 'Both provide transparent estimate-only ranges; Earnings Calculator breaks down Creator Rewards vs sponsorship scenarios.',
      },
    ],
    relatedTools: [
      'tiktok-earnings-calculator',
      'tiktok-engagement-rate-calculator',
      'tiktok-follower-growth-calculator',
      'tiktok-video-length-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-earnings-calculator',
    name: 'TikTok Earnings Calculator',
    slug: 'tiktok-earnings-calculator',
    category: 'tiktok-tools',
    url: '/tiktok-earnings-calculator',
    description: 'Project hypothetical Creator Rewards & sponsorship earnings—ESTIMATE ONLY.',
    longDescription:
      'Compare potential ad-share/rewards income alongside estimated sponsored-post value based on views, engagement rate, and RPM. ESTIMATE ONLY—real TikTok income varies by region, qualified view percentage, niche, and advertiser demand.',
    keywords: ['tiktok earnings calculator', 'tiktok rpm calculator', 'tiktok sponsorship estimate only'],
    icon: 'DollarSign',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Earnings Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Simulate TikTok Creator Rewards and sponsorship payouts locally. Estimate only—actual income varies significantly.',
    howTo: [
      {
        title: 'Input average views & videos/month',
        description: 'Enter your average views per video, monthly video count, and engagement rate.',
      },
      {
        title: 'Set Creator RPM & sponsorship fee',
        description: 'Input your estimated Creator Rewards RPM and per-post brand sponsorship rate.',
      },
      {
        title: 'Inspect formula & per-component breakdown',
        description: 'View transparent earnings calculations and component totals.',
      },
    ],
    faqs: [
      {
        question: 'Is TikTok Earnings Calculator official or guaranteed?',
        answer: 'No. It is ESTIMATE ONLY for creator planning—actual payouts vary by region, niche, program rules, and qualified views.',
      },
      {
        question: 'What affects TikTok RPM most?',
        answer: 'Audience geography, watch-through rate, niche advertiser value, and video length over 60 seconds.',
      },
      {
        question: 'Does this tool collect or store my revenue numbers?',
        answer: 'No. Pure client-side math runs inside your browser tab.',
      },
      {
        question: 'Can I benchmark engagement rate first?',
        answer: 'Yes. Compute your engagement percentage using TikTok Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'tiktok-money-calculator',
      'tiktok-engagement-rate-calculator',
      'tiktok-follower-growth-calculator',
      'tiktok-video-length-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-length-calculator',
    name: 'TikTok Video Length Calculator',
    slug: 'tiktok-video-length-calculator',
    category: 'tiktok-tools',
    url: '/tiktok-video-length-calculator',
    description: 'Estimate spoken video runtime from your script word count and speaking pace locally.',
    longDescription:
      'Make sure your script hits 15s, 30s, or clears the 60-second Creator Rewards threshold before filming. Paste your script outline into TikTok Video Length Calculator to estimate playback duration across slow, normal, and fast TikTok narration speeds.',
    keywords: ['tiktok video length calculator', 'script to seconds calculator', '60 second script timer'],
    icon: 'Clock',
    acceptedFormats: ['Text', 'Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Video Length Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert script word count into estimated TikTok playback seconds (15s, 30s, 60s+) locally in your browser.',
    howTo: [
      {
        title: 'Paste script or enter word count',
        description: 'Enter your details and paste your draft narration or type a target word count.',
      },
      {
        title: 'Select speaking pace (WPM)',
        description: 'Choose slow (~125 WPM), conversational (~150 WPM), or brisk TikTok pacing (~175 WPM).',
      },
      {
        title: 'Review target duration indicator',
        description: 'See exact seconds estimated and whether your script clears 60 seconds.',
      },
    ],
    faqs: [
      {
        question: 'How many words is a 60-second TikTok script?',
        answer: 'At brisk conversational TikTok pacing (~150–165 words per minute), 150–170 words usually takes about 60 seconds.',
      },
      {
        question: 'Does this upload my script or audio?',
        answer: 'No. Word counting and pace math run instantaneously inside your browser.',
      },
      {
        question: 'Can it help trim a 90-second script down to 60 seconds?',
        answer: 'Yes. It shows the exact excess word count to cut for your target second goal.',
      },
      {
        question: 'Can I outline scripts before timing them?',
        answer: 'Yes. Draft structured outlines in TikTok Script Generator.',
      },
    ],
    relatedTools: [
      'tiktok-script-generator',
      'tiktok-hook-generator',
      'tiktok-video-file-size-estimator',
      'tiktok-earnings-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-content-calendar-generator',
    name: 'TikTok Content Calendar Generator',
    slug: 'tiktok-content-calendar-generator',
    category: 'tiktok-tools',
    url: '/tiktok-content-calendar-generator',
    description: 'Create an editable weekly/monthly TikTok posting plan using browser templates (not AI).',
    longDescription:
      'Stay consistent without burning out. TikTok Content Calendar Generator builds a clean weekly or 30-day rotating content schedule from your niche pillars and posting frequency using structured browser templates—NOT AI and no account syncing.',
    keywords: ['tiktok content calendar generator', 'tt posting schedule template', '30 day tiktok planner not ai'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate an editable TikTok weekly or 30-day content schedule from browser templates (NOT AI). Free CSV/text export.',
    howTo: [
      {
        title: 'Enter 3 content pillars & cadence',
        description: 'Enter your details and input your topic themes and how many TikToks per week you plan to film.',
      },
      {
        title: 'Generate balanced rotation',
        description: 'Browser templates rotate tutorials, storytimes, Q&As, and quick tips deterministically (NOT AI).',
      },
      {
        title: 'Export or copy checklist',
        description: 'Copy clean Markdown or CSV to manage filming days offline.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Content Calendar Generator use AI?',
        answer: 'No. It uses rotating pillar templates and cadence scheduling rules in your browser—NOT AI.',
      },
      {
        question: 'Can this publish posts directly to TikTok?',
        answer: 'No. It is a planning and CSV/checklist export tool only.',
      },
      {
        question: 'How can I pair it with optimal time slots?',
        answer: 'Use TikTok Best Posting Time Planner alongside your calendar.',
      },
      {
        question: 'Is there any limit on calendar exports?',
        answer: 'No. Build and export plans freely inside your browser.',
      },
    ],
    relatedTools: [
      'tiktok-best-posting-time-planner',
      'tiktok-video-idea-generator',
      'tiktok-script-generator',
      'tiktok-follower-growth-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-best-posting-time-planner',
    name: 'TikTok Best Posting Time Planner',
    slug: 'tiktok-best-posting-time-planner',
    category: 'tiktok-tools',
    url: '/tiktok-best-posting-time-planner',
    description: 'Plan TikTok upload windows from general benchmarks and your own inputs—no live analytics.',
    longDescription:
      'Pick consistent daily posting slots matched to your target audience timezone and weekday vs weekend routines. TikTok Best Posting Time Planner uses general benchmark windows plus your own manual schedule inputs—it cannot fetch real TikTok account analytics.',
    keywords: ['tiktok best posting time planner', 'when to post on tiktok', 'tt time slot planner'],
    icon: 'Clock',
    acceptedFormats: ['Text', 'Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Best Posting Time Planner | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Plan consistent TikTok posting slots using audience timezone benchmarks and manual inputs. Does not fetch live analytics.',
    howTo: [
      {
        title: 'Set audience timezone & niche',
        description: 'Enter your details and pick your viewers’ primary timezone and weekday/weekend rhythm.',
      },
      {
        title: 'Review benchmark windows',
        description: 'Combine general high-activity slots with your own TikTok Analytics notes manually.',
      },
      {
        title: 'Save weekly upload routine',
        description: 'Copy your consistent 3–7 day slot plan for filming and scheduling.',
      },
    ],
    faqs: [
      {
        question: 'Does this connect to TikTok Analytics for real follower activity?',
        answer: 'No. It uses general industry time-window benchmarks plus your own inputs—it cannot fetch private TikTok analytics.',
      },
      {
        question: 'Where do I see my real active follower hours?',
        answer: 'Open TikTok Studio / Creator Tools -> Analytics -> Followers in the official app and enter those peak hours here.',
      },
      {
        question: 'Can it convert slots across US, UK, and APAC timezones?',
        answer: 'Yes. Built-in browser timezone math maps local filming times cleanly.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes. Runs 100% client-side with zero login.',
      },
    ],
    relatedTools: [
      'tiktok-content-calendar-generator',
      'tiktok-engagement-rate-calculator',
      'tiktok-follower-growth-calculator',
      'tiktok-video-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-giveaway-winner-picker',
    name: 'TikTok Giveaway Winner Picker',
    slug: 'tiktok-giveaway-winner-picker',
    category: 'tiktok-tools',
    url: '/tiktok-giveaway-winner-picker',
    description: 'Pick fair random winners ONLY from pasted TikTok entrant names—never fetches live comments.',
    longDescription:
      'Run transparent community giveaways locally inside your browser. Paste your list of eligible entrant names or @handles—TikTok Giveaway Winner Picker uses unbiased browser randomness strictly from pasted text and cannot fetch real TikTok comments.',
    keywords: ['tiktok giveaway winner picker', 'paste entrant picker', 'tiktok raffle drawer', 'random name picker'],
    icon: 'Trophy',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Giveaway Winner Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draw random TikTok giveaway winners locally from names you paste. Pasted lists only—cannot fetch live TikTok comments.',
    howTo: [
      {
        title: 'Paste entrant names or handles',
        description: 'Enter your details and paste one entrant per line from your copied spreadsheet or notes.',
      },
      {
        title: 'Set deduplication & winner count',
        description: 'Optionally remove duplicate entries and select how many winners and backups to draw.',
      },
      {
        title: 'Draw fairly in browser',
        description: 'Crypto-random selection picks winners transparently with zero account login.',
      },
    ],
    faqs: [
      {
        question: 'Can this tool automatically fetch entrants from a TikTok video URL?',
        answer: 'No. It works ONLY from names or handles you paste directly—it cannot connect to TikTok or scrape live comments.',
      },
      {
        question: 'Can I prevent someone from winning twice or filter duplicate entries?',
        answer: 'Yes. Toggle duplicate-handle filtering before running the random draw.',
      },
      {
        question: 'How is randomness generated?',
        answer: 'Uses browser Web Crypto randomness locally on your device.',
      },
      {
        question: 'Need a DM message to contact winners?',
        answer: 'Yes. Prepare winner notification text using TikTok DM Generator.',
      },
    ],
    relatedTools: [
      'tiktok-random-comment-picker',
      'tiktok-dm-generator',
      'tiktok-reply-generator',
      'tiktok-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-random-comment-picker',
    name: 'TikTok Random Comment Picker',
    slug: 'tiktok-random-comment-picker',
    category: 'tiktok-tools',
    url: '/tiktok-random-comment-picker',
    description: 'Select random TikTok comments ONLY from text you paste—cannot fetch live post comments.',
    longDescription:
      'Pick a lucky comment or Q&A prompt transparently from copied viewer feedback. Paste comments line by line into TikTok Random Comment Picker—works strictly from pasted comments inside your browser and cannot pull live comments from TikTok.',
    keywords: ['tiktok random comment picker', 'pasted comment selector', 'tt comment winner picker'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Random Comment Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Pick random TikTok comments strictly from comments you paste in the browser. Cannot fetch live TikTok post comments.',
    howTo: [
      {
        title: 'Paste copied comments',
        description: 'Enter your details and paste comments one per line from your notes or export.',
      },
      {
        title: 'Optional keyword or duplicate filter',
        description: 'Filter pasted lines by required keyword or unique username prefix.',
      },
      {
        title: 'Draw a random comment',
        description: 'Pick 1 or more random comments fairly inside your browser tab.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Random Comment Picker pull comments from a TikTok link?',
        answer: 'No. It selects ONLY from comments you paste into the tool—it cannot log into TikTok or fetch real comments.',
      },
      {
        question: 'Can I filter pasted comments by a keyword?',
        answer: 'Yes. Enter an optional keyword rule so only matching pasted comments qualify.',
      },
      {
        question: 'Are pasted comments uploaded anywhere?',
        answer: 'No. Filtering and random selection happen locally in browser memory.',
      },
      {
        question: 'Is this different from Giveaway Winner Picker?',
        answer: 'Random Comment Picker focuses on full comment lines (like Q&A or contest entries), while Giveaway Picker works cleanly for pure @handle lists.',
      },
    ],
    relatedTools: [
      'tiktok-giveaway-winner-picker',
      'tiktok-comment-generator',
      'tiktok-reply-generator',
      'tiktok-dm-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-profile-bio-formatter',
    name: 'TikTok Profile Bio Formatter',
    slug: 'tiktok-profile-bio-formatter',
    category: 'tiktok-tools',
    url: '/tiktok-profile-bio-formatter',
    description: 'Format stacked lines, dividers, and emojis cleanly inside TikTok’s 80-character bio cap.',
    longDescription:
      'Keep multi-line TikTok bios aligned and crisp without wasting precious characters on stray whitespace. TikTok Profile Bio Formatter structures stacked bio lines, arrow CTAs, and clean dividers while watching the strict 80-character budget.',
    keywords: ['tiktok profile bio formatter', 'tiktok bio line breaks', '80 char bio formatter', 'tt bio layout'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Profile Bio Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format stacked TikTok profile bio lines and dividers cleanly within the 80-character limit in your browser.',
    howTo: [
      {
        title: 'Enter 2–4 short bio lines',
        description: 'Enter your details and fill role, proof/schedule, and link-below pointer.',
      },
      {
        title: 'Clean spacing & separators',
        description: 'Normalize line breaks, add subtle bullets/dividers, and track remaining characters out of 80.',
      },
      {
        title: 'Copy directly to Edit Profile',
        description: 'Paste formatted text into TikTok with clean vertical stacking.',
      },
    ],
    faqs: [
      {
        question: 'How many characters does TikTok allow in a profile bio?',
        answer: 'TikTok profile bios are capped strictly at 80 characters including line breaks and emojis.',
      },
      {
        question: 'Does this rewrite my bio using AI?',
        answer: 'No. It formats spacing, line breaks, and dividers from the exact words you enter.',
      },
      {
        question: 'Need template bio ideas first?',
        answer: 'Yes. Start in TikTok Bio Generator and refine spacing here.',
      },
      {
        question: 'Can I style part of my bio with bold Unicode text?',
        answer: 'Yes. Copy short bold labels from TikTok Font Generator.',
      },
    ],
    relatedTools: [
      'tiktok-bio-generator',
      'tiktok-character-counter',
      'tiktok-text-formatter',
      'tiktok-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-cover-maker',
    name: 'TikTok Video Cover Maker',
    slug: 'tiktok-video-cover-maker',
    category: 'tiktok-tools',
    url: '/tiktok-video-cover-maker',
    description: 'Design 1080x1920 (9:16) TikTok grid-safe cover images in your browser with zero watermarks.',
    longDescription:
      'Create scannable custom covers that stay legible inside both full-screen 9:16 playback and TikTok’s center-cropped 3:4 profile grid. Compose backgrounds, titles, and safe-zone guides locally in your browser up to 20 MB—no watermark.',
    keywords: ['tiktok video cover maker', '1080x1920 tiktok cover', 'tt profile grid cover', 'tiktok cover no watermark'],
    icon: 'Camera',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `TikTok Video Cover Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create 1080x1920 TikTok video covers with profile-grid safe zones locally in your browser. Free with zero watermarks.',
    howTo: [
      {
        title: 'Load a base frame or backdrop',
        description: 'Enter your details and open a JPG, PNG, or WEBP image up to 20 MB inside your browser.',
      },
      {
        title: 'Align title within grid safe-zone',
        description: 'Preview how text sits inside both 1080x1920 full screen and the profile grid crop.',
      },
      {
        title: 'Export unwatermarked cover',
        description: 'Save clean PNG or JPG artwork ready for TikTok upload with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What size does TikTok Video Cover Maker export?',
        answer: 'It outputs standard vertical 1080x1920 (9:16) images with safe-area guides for profile grid thumbnails.',
      },
      {
        question: 'Will my TikTok cover include a watermark?',
        answer: 'No. Every TikTok tool exports completely clean images with zero watermarks.',
      },
      {
        question: 'What is the file size limit?',
        answer: 'Source images up to 20 MB are supported directly inside your browser.',
      },
      {
        question: 'Need punchy cover headline ideas first?',
        answer: 'Yes. Try TikTok Video Title Generator for short 3–6 word headlines.',
      },
    ],
    relatedTools: [
      'tiktok-thumbnail-maker',
      'tiktok-image-resizer',
      'tiktok-video-title-generator',
      'tiktok-video-aspect-ratio-checker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-thumbnail-maker',
    name: 'TikTok Thumbnail Maker',
    slug: 'tiktok-thumbnail-maker',
    category: 'tiktok-tools',
    url: '/tiktok-thumbnail-maker',
    description: 'Build crisp 1080x1920 TikTok thumbnails & photo-mode covers in your browser—no watermark.',
    longDescription:
      'Frame clean 9:16 thumbnails with high-contrast labels, subtle border frames, and safe margins that clear TikTok’s right-side icons and bottom caption overlay. Runs client-side on files up to 20 MB with zero watermarks.',
    keywords: ['tiktok thumbnail maker', '9 16 thumbnail creator', '1080x1920 thumbnail', 'tt thumbnail no watermark'],
    icon: 'Image',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `TikTok Thumbnail Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Design 1080x1920 TikTok thumbnails with UI overlay safe margins locally in your browser. Free and unwatermarked.',
    howTo: [
      {
        title: 'Choose image up to 20 MB',
        description: 'Enter your details and select a photo or exported video still in JPG, PNG, or WEBP format.',
      },
      {
        title: 'Preview TikTok UI overlay zones',
        description: 'Toggle safe-zone guides showing where TikTok action buttons and captions sit.',
      },
      {
        title: 'Download clean thumbnail',
        description: 'Export crisp 1080x1920 artwork in your browser without any watermark.',
      },
    ],
    faqs: [
      {
        question: 'Why use UI safe-zone guides on TikTok thumbnails?',
        answer: 'TikTok overlays like/comment buttons on the right and captions at the bottom, so centering labels protects legibility.',
      },
      {
        question: 'Does TikTok Thumbnail Maker add any logo watermark?',
        answer: 'No. Exports are 100% unwatermarked.',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'Up to 20 MB per image.',
      },
      {
        question: 'Can I compress finished thumbnails further?',
        answer: 'Yes. Shrink file weight cleanly in TikTok Image Compressor.',
      },
    ],
    relatedTools: [
      'tiktok-video-cover-maker',
      'tiktok-image-resizer',
      'tiktok-image-compressor',
      'tiktok-video-title-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-image-resizer',
    name: 'TikTok Image Resizer',
    slug: 'tiktok-image-resizer',
    category: 'tiktok-tools',
    url: '/tiktok-image-resizer',
    description: 'Resize photos to 1080x1920 TikTok Photo Mode & slide specs locally—no watermark.',
    longDescription:
      'Prepare crisp photos for TikTok Photo Mode carousels, green-screen backdrops, and profile artwork without awkward auto-stretching. Resize JPG, PNG, or WEBP files up to 20 MB to exact 1080x1920 (9:16) or square/portrait presets in your browser with zero watermarks.',
    keywords: ['tiktok image resizer', '1080x1920 photo resizer', 'tiktok photo mode dimensions', 'resize for tiktok'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `TikTok Image Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize images to exact 1080x1920 TikTok Photo Mode dimensions inside your browser. Free with zero watermarks.',
    howTo: [
      {
        title: 'Select image (max 20 MB)',
        description: 'Enter your details and load any JPG, PNG, or WEBP photo directly inside your browser.',
      },
      {
        title: 'Pick 1080x1920 or crop fit',
        description: 'Choose fill-crop or blurred-padding fit for exact TikTok vertical proportions.',
      },
      {
        title: 'Download unwatermarked image',
        description: 'Save resized output instantaneously with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What is the best resolution for TikTok Photo Mode?',
        answer: '1080x1920 pixels (9:16 vertical aspect ratio) fills the TikTok mobile feed cleanly.',
      },
      {
        question: 'Does TikTok Image Resizer add a watermark?',
        answer: 'No. Unlike general Resize Image, every TikTok tool exports completely without watermarks.',
      },
      {
        question: 'Do my images upload to a server?',
        answer: 'No. Canvas resizing happens locally inside your browser tab.',
      },
      {
        question: 'What is the max file size?',
        answer: 'Up to 20 MB per image.',
      },
    ],
    relatedTools: [
      'tiktok-image-compressor',
      'tiktok-video-cover-maker',
      'tiktok-thumbnail-maker',
      'tiktok-video-aspect-ratio-checker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-image-compressor',
    name: 'TikTok Image Compressor',
    slug: 'tiktok-image-compressor',
    category: 'tiktok-tools',
    url: '/tiktok-image-compressor',
    description: 'Compress TikTok carousel photos & covers up to 20 MB locally in your browser—no watermark.',
    longDescription:
      'Reduce heavy PNG/JPG carousel slides and green-screen backgrounds before uploading so TikTok’s mobile pipeline keeps crisp edges without excessive re-compression. Runs completely in your browser with zero watermarks.',
    keywords: ['tiktok image compressor', 'shrink tiktok cover image', 'compress carousel photos', 'no watermark'],
    icon: 'Minimize',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `TikTok Image Compressor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compress TikTok covers and Photo Mode slides up to 20 MB privately in your browser. Zero uploads and zero watermarks.',
    howTo: [
      {
        title: 'Choose cover or photo',
        description: 'Enter your details and load a JPG, PNG, or WEBP image up to 20 MB.',
      },
      {
        title: 'Adjust quality slider',
        description: 'Compare file weight savings vs visual crispness side by side in your browser.',
      },
      {
        title: 'Save clean compressed file',
        description: 'Download smaller artwork ready for TikTok with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Does TikTok Image Compressor add any watermark?',
        answer: 'No. All TikTok tools produce 100% clean, unwatermarked files.',
      },
      {
        question: 'Are photos sent over the internet?',
        answer: 'No. Browser compression keeps your images on your own device.',
      },
      {
        question: 'What file types and size limit apply?',
        answer: 'Supports JPG, PNG, and WEBP up to 20 MB per image.',
      },
      {
        question: 'Can I resize to 1080x1920 before compressing?',
        answer: 'Yes. Use TikTok Image Resizer first for exact vertical dimensions.',
      },
    ],
    relatedTools: [
      'tiktok-image-resizer',
      'tiktok-video-cover-maker',
      'tiktok-thumbnail-maker',
      'tiktok-video-file-size-estimator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-aspect-ratio-checker',
    name: 'TikTok Video Aspect Ratio Checker',
    slug: 'tiktok-video-aspect-ratio-checker',
    category: 'tiktok-tools',
    url: '/tiktok-video-aspect-ratio-checker',
    description: 'Verify clip dimensions against TikTok 9:16 (1080x1920) vertical & letterbox specs in browser.',
    longDescription:
      'Ensure your export width and height match TikTok’s native 9:16 vertical feed without unwanted black bars or awkward cropping. Enter video pixel dimensions to inspect ratio, 1080x1920 readiness, and crop allowances locally.',
    keywords: ['tiktok video aspect ratio checker', '9 16 video ratio', '1080x1920 tiktok check'],
    icon: 'Ratio',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Video Aspect Ratio Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check pixel dimensions against TikTok 9:16 (1080x1920) feed specs locally in your browser. Zero upload needed.',
    howTo: [
      {
        title: 'Enter pixel width & height',
        description: 'Enter your details and input your timeline export resolution (for example 1080 x 1920 or 2160 x 3840).',
      },
      {
        title: 'Check 9:16 compliance',
        description: 'Browser math computes simplified aspect ratio and flags landscape or 4:5 crop margins.',
      },
      {
        title: 'Copy clean export dimensions',
        description: 'Use recommended 1080p vertical values in your video editor.',
      },
    ],
    faqs: [
      {
        question: 'What is TikTok’s standard video aspect ratio?',
        answer: 'TikTok uses 9:16 vertical full-screen video (1080x1920 pixels recommended).',
      },
      {
        question: 'Do I have to upload a video file to check its aspect ratio?',
        answer: 'No. Simply type the pixel width and height for instantaneous math in your browser.',
      },
      {
        question: 'What happens if I upload 16:9 horizontal video to TikTok?',
        answer: 'TikTok plays 16:9 landscape clips letterboxed unless rotated or zoomed to 9:16.',
      },
      {
        question: 'Can I estimate exported video megabytes too?',
        answer: 'Yes. Open TikTok Video File Size Estimator.',
      },
    ],
    relatedTools: [
      'tiktok-video-file-size-estimator',
      'tiktok-image-resizer',
      'tiktok-video-cover-maker',
      'compress-video',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiktok-video-file-size-estimator',
    name: 'TikTok Video File Size Estimator',
    slug: 'tiktok-video-file-size-estimator',
    category: 'tiktok-tools',
    url: '/tiktok-video-file-size-estimator',
    description: 'Estimate TikTok video export size in MB from duration and bitrate locally in your browser.',
    longDescription:
      'Keep vertical MP4 exports lean and under upload targets before leaving your editor. Enter clip length plus video and audio bitrates to compute approximate file size in MB/GB instantaneously in your browser—estimate only.',
    keywords: ['tiktok video file size estimator', 'tiktok mp4 bitrate calculator', 'video export size math'],
    icon: 'HardDrive',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `TikTok Video File Size Estimator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Estimate vertical TikTok MP4 export size from clip duration and bitrate locally in your browser. Zero upload needed.',
    howTo: [
      {
        title: 'Enter duration in seconds or minutes',
        description: 'Enter your details and input your planned TikTok runtime.',
      },
      {
        title: 'Choose 1080p bitrate preset',
        description: 'Pick standard 6–15 Mbps vertical export bitrates and 128–192 kbps audio.',
      },
      {
        title: 'View estimated MB output',
        description: 'Instant browser math approximates final MP4 file weight without uploading anything.',
      },
    ],
    faqs: [
      {
        question: 'Why does TikTok Video File Size Estimator show an approximate size?',
        answer: 'Variable bitrate (VBR) codecs adjust to scene motion, so bitrate math gives a close planning estimate.',
      },
      {
        question: 'What bitrate works well for 1080x1920 30/60fps TikTok clips?',
        answer: 'Most creators export 1080p vertical MP4s between 8 and 15 Mbps for crisp detail and fast uploads.',
      },
      {
        question: 'Can I also shrink an oversized video under 100 MB?',
        answer: 'Yes. Check our browser-based Compress Video tool (up to 100 MB, 3 min, 720p).',
      },
      {
        question: 'Does this require uploading a clip?',
        answer: 'No. Pure math runs instantly inside your browser tab.',
      },
    ],
    relatedTools: [
      'tiktok-video-aspect-ratio-checker',
      'tiktok-video-length-calculator',
      'compress-video',
      'video-to-mp4',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
