import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const TWITTER_TOOLS: readonly Tool[] = [
  {
    id: 'twitter-stylish-text-generator',
    name: 'Twitter Stylish Text Generator',
    slug: 'twitter-stylish-text-generator',
    category: 'twitter-tools',
    url: '/twitter-stylish-text-generator',
    description: 'Style Twitter/X bios & headers with decorative Unicode templates in browser (not AI).',
    longDescription:
      'Add clean brackets, dividers, and decorative Unicode styles to short X/Twitter profile headers and callouts. Uses deterministic character tables and template symbol frames inside your browser—NOT AI and zero login required.',
    keywords: ['twitter stylish text generator', 'x bio fancy text', 'unicode twitter text not ai'],
    icon: 'Sparkles',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Style Twitter/X bios and highlights with instant Unicode templates locally in browser (NOT AI). No login needed.',
    howTo: [
      {
        title: 'Type short phrase or divider text',
        description: 'Enter your X profile tagline or key announcement phrase.',
      },
      {
        title: 'Preview Unicode symbol templates',
        description: 'Deterministic character tables apply Bracket Frame, Sparkle Border, Bubble Symbols, Gothic Deco, Strikethrough Line, and Wing Embellishment styles (NOT AI).',
      },
      {
        title: 'Copy styled text',
        description: 'Copy your decorated text instantly for X bios or posts.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Stylish Text Generator use AI?',
        answer: 'No. It uses fixed Unicode character maps and symbol templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does it work on both X web and mobile apps?',
        answer: 'Yes. Standard Unicode symbols render cleanly across iOS, Android, and desktop browsers.',
      },
      {
        question: 'Does it require signing into X/Twitter?',
        answer: 'No. None of these tools require social login.',
      },
      {
        question: 'Need plain bold/serif/italic styles without frames?',
        answer: 'Use Twitter Font Generator.',
      },
    ],
    relatedTools: [
      'twitter-font-generator',
      'twitter-character-counter',
      'twitter-bio-character-counter',
      'twitter-thread-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-font-generator',
    name: 'Twitter Font Generator',
    slug: 'twitter-font-generator',
    category: 'twitter-tools',
    url: '/twitter-font-generator',
    description: 'Generate copy-paste Unicode bold, italic, serif & monospace text for Twitter/X (not AI).',
    longDescription:
      'Make headlines pop in X/Twitter posts, pinned tweets, and profile bios without installing custom fonts. Performs deterministic Unicode glyph mapping and template presets inside your browser—NOT AI and zero social login.',
    keywords: ['twitter font generator', 'x bold text generator', 'copy paste fonts for twitter not ai'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Font Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert plain text into copy-paste Unicode bold, serif, italic & monospace styles for Twitter/X in browser (NOT AI).',
    howTo: [
      {
        title: 'Enter plain text headline',
        description: 'Type a bio phrase, hook line, or thread title.',
      },
      {
        title: 'Browse Unicode template presets',
        description: 'Generates serif bold, sans bold, italic, cursive, and monospace styles locally (NOT AI).',
      },
      {
        title: 'Copy & paste cleanly',
        description: 'Character counting on this site counts each character by code point (emoji = 1).',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Font Generator use AI?',
        answer: 'No. It uses fixed Unicode lookup tables and template presets inside your browser—NOT AI.',
      },
      {
        question: 'Why use Unicode bold sparingly on X/Twitter?',
        answer: 'Screen readers skip heavy Unicode styling and X search indexes plain ASCII text best, so bold only short titles.',
      },
      {
        question: 'How are characters counted?',
        answer: 'Characters are counted literally by code point (1 per character, emoji = 1).',
      },
      {
        question: 'Is any account login required?',
        answer: 'No. Runs client-side with zero login.',
      },
    ],
    relatedTools: [
      'twitter-stylish-text-generator',
      'twitter-character-counter',
      'twitter-thread-formatter',
      'twitter-bio-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-character-counter',
    name: 'Twitter Character Counter',
    slug: 'twitter-character-counter',
    category: 'twitter-tools',
    url: '/twitter-character-counter',
    description: 'Count standard posts cleanly against Twitter/X’s exact 280-character limit locally.',
    longDescription:
      'Measure draft posts accurately against X/Twitter’s classic 280-character limit—counting literally by code point (emoji = 1) and URLs at full length (no 23-char weighting). Runs 100% locally in your browser with zero login.',
    keywords: ['twitter character counter', '280 character limit counter', 'x tweet length checker'],
    icon: 'Ruler',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check draft tweets accurately against Twitter/X’s 280-character limit locally in your browser.',
    howTo: [
      {
        title: 'Type or paste draft tweet',
        description: 'Write your post including any links, @mentions, or hashtags.',
      },
      {
        title: 'Inspect 280-character meter',
        description: 'Counts characters literally by code point (emoji = 1) and URLs at full length (no 23-char weighting).',
      },
      {
        title: 'Split long drafts into a thread',
        description: 'Send multi-paragraph text straight to Twitter Thread Formatter if you exceed 280 characters.',
      },
    ],
    faqs: [
      {
        question: 'How does this tool count characters and URLs?',
        answer: 'Characters are counted literally by code point (emoji = 1) and URLs are counted at their full length.',
      },
      {
        question: 'Does this connect to X/Twitter?',
        answer: 'No. Counting stays inside your browser with zero social login.',
      },
      {
        question: 'Checking a profile bio instead?',
        answer: 'Use Twitter Bio Character Counter (160-character cap).',
      },
    ],
    relatedTools: [
      'twitter-thread-formatter',
      'twitter-bio-character-counter',
      'twitter-font-generator',
      'twitter-poll-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-thread-formatter',
    name: 'Twitter Thread Formatter',
    slug: 'twitter-thread-formatter',
    category: 'twitter-tools',
    url: '/twitter-thread-formatter',
    description: 'Split long essays cleanly into numbered 1/N posts under 280 characters in browser.',
    longDescription:
      'Turn an outline or blog summary into balanced, well-spaced X/Twitter thread posts without cutting sentences awkwardly in half. Automatically splits text at sentence or word boundaries under 280 characters with custom 1/N numbering—no AI and no social login.',
    keywords: ['twitter thread formatter', 'split text into 280 char thread', 'x thread splitter'],
    icon: 'Split',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Thread Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Split long drafts cleanly into numbered 1/N posts under 280 characters locally in your browser. Zero social login.',
    howTo: [
      {
        title: 'Paste full thread draft',
        description: 'Paste an article summary or use "---" markers for manual break points.',
      },
      {
        title: 'Format numbered thread cards',
        description: 'Formats text into cards with fixed (1/N) numbering suffixes under 280 characters.',
      },
      {
        title: 'Copy tweets one by one',
        description: 'One-click copy buttons let you paste each numbered post sequentially on X.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Thread Formatter rewrite my writing with AI?',
        answer: 'No. It preserves your exact words and splits cleanly on sentence/word boundaries.',
      },
      {
        question: 'Does this post threads automatically to Twitter/X?',
        answer: 'No. None of these tools require or store social logins—copy each post manually.',
      },
      {
        question: 'Does numbering count toward each tweet’s 280-character limit?',
        answer: 'Yes. The splitter reserves space for your chosen 1/N numbering prefix or suffix automatically.',
      },
      {
        question: 'Need a polished 1600x900 visual for tweet #1?',
        answer: 'Use Twitter Post Image Resizer.',
      },
    ],
    relatedTools: [
      'twitter-character-counter',
      'twitter-quote-generator',
      'twitter-post-image-resizer',
      'twitter-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-engagement-rate-calculator',
    name: 'Twitter Engagement Rate Calculator',
    slug: 'twitter-engagement-rate-calculator',
    category: 'twitter-tools',
    url: '/twitter-engagement-rate-calculator',
    description: 'Compute Twitter/X engagement rate by impressions or followers locally using clear math.',
    longDescription:
      'Measure how strongly your posts, threads, and polls perform on X/Twitter without connecting your account. Enter likes, replies, reposts, bookmarks, and impressions or followers to compute instant percentages inside your browser.',
    keywords: ['twitter engagement rate calculator', 'x post engagement ratio', 'tweet impressions formula'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate Twitter/X engagement rate by impressions or followers instantaneously in your browser. Zero login.',
    howTo: [
      {
        title: 'Enter likes, replies, reposts & bookmarks',
        description: 'Input public interaction counts from a tweet or weekly average.',
      },
      {
        title: 'Toggle Impression or Follower mode',
        description: 'Toggle between Impression-based or Follower-based ER% mode.',
      },
      {
        title: 'Inspect equation breakdown',
        description: 'View transparent percentages locally inside your browser tab.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch analytics from my X/Twitter account?',
        answer: 'No. Calculations run strictly from the numbers you enter—zero social login.',
      },
      {
        question: 'Does it include bookmarks in total interactions?',
        answer: 'Yes. Bookmarks and quote-posts can be included alongside likes, replies, and reposts.',
      },
      {
        question: 'Which ratio is used inside X Analytics?',
        answer: 'X Analytics highlights engagements divided by total post impressions.',
      },
      {
        question: 'Can I project follower milestones too?',
        answer: 'Yes. Open Twitter Follower Growth Calculator.',
      },
    ],
    relatedTools: [
      'twitter-follower-growth-calculator',
      'twitter-content-calendar-generator',
      'twitter-thread-formatter',
      'twitter-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-follower-growth-calculator',
    name: 'Twitter Follower Growth Calculator',
    slug: 'twitter-follower-growth-calculator',
    category: 'twitter-tools',
    url: '/twitter-follower-growth-calculator',
    description: 'Calculate X/Twitter follower growth and daily net gain via pure browser math.',
    longDescription:
      'Calculate follower growth, percentage change, and daily net gain from your starting and current totals in your browser. Uses only the numbers you enter. No live X data.',
    keywords: ['twitter follower growth calculator', 'x growth calculator', 'follower math calculator'],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Follower Growth Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate Twitter/X follower growth, percentage increase, and daily net gain locally in your browser. No live X data.',
    howTo: [
      {
        title: 'Enter starting and current followers',
        description: 'Input your initial follower count and current follower total.',
      },
      {
        title: 'Enter days elapsed',
        description: 'Specify the number of days between your start and current measurements.',
      },
      {
        title: 'Inspect growth and daily rate',
        description: 'View absolute growth, percentage increase, and average daily gain.',
      },
    ],
    faqs: [
      {
        question: 'Does this tool connect to live X/Twitter data?',
        answer: 'No. Uses only the numbers you enter. No live X data.',
      },
      {
        question: 'How is percentage growth handled if starting followers is zero?',
        answer: 'When starting followers is 0, percentage shows Not Applicable (N/A) to prevent division by zero.',
      },
      {
        question: 'Can I check engagement rates alongside growth?',
        answer: 'Yes. Use Twitter Engagement Rate Calculator.',
      },
      {
        question: 'Is any account login required?',
        answer: 'No. Pure client-side math runs freely anytime.',
      },
    ],
    relatedTools: [
      'twitter-engagement-rate-calculator',
      'twitter-content-calendar-generator',
      'twitter-thread-formatter',
      'twitter-poll-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-header-resizer',
    name: 'Twitter Header Resizer',
    slug: 'twitter-header-resizer',
    category: 'twitter-tools',
    url: '/twitter-header-resizer',
    description: 'Resize X/Twitter banner covers to exact 1500x500 specs with avatar safe-zone—no watermark.',
    longDescription:
      'Frame clean 1500x500 (3:1) Twitter/X profile headers without cropping important text behind your bottom-left circular avatar or top navigation bars. Processes JPG, PNG, or WEBP files up to 20 MB locally with zero watermarks.',
    keywords: ['twitter header resizer', '1500x500 x banner', 'twitter cover size no watermark'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Twitter Header Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize images to exact 1500x500 (3:1) Twitter/X headers with avatar safe-zone preview in browser. Zero watermarks.',
    howTo: [
      {
        title: 'Select header image (max 20 MB)',
        description: 'Load a JPG, PNG, or WEBP image directly in your browser.',
      },
      {
        title: 'Preview 1500x500 & avatar overlap',
        description: 'Position artwork cleanly clear of the bottom-left circular avatar overlap zone.',
      },
      {
        title: 'Download clean 1500x500 banner',
        description: 'Download crisp unwatermarked output ready for Edit Profile.',
      },
    ],
    faqs: [
      {
        question: 'What is the exact Twitter/X header size?',
        answer: '1500x500 pixels (3:1 aspect ratio) is X/Twitter’s official profile header banner specification.',
      },
      {
        question: 'Does Twitter Header Resizer add a watermark?',
        answer: 'No. Every Twitter tool exports completely clean, unwatermarked files.',
      },
      {
        question: 'Are uploaded photos saved on any server?',
        answer: 'No. All cropping happens locally inside your browser up to 20 MB.',
      },
      {
        question: 'Need to resize your 400x400 profile icon too?',
        answer: 'Yes. Open Twitter Profile Picture Resizer.',
      },
    ],
    relatedTools: [
      'twitter-profile-picture-resizer',
      'twitter-post-image-resizer',
      'twitter-card-preview-generator',
      'twitter-bio-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-profile-picture-resizer',
    name: 'Twitter Profile Picture Resizer',
    slug: 'twitter-profile-picture-resizer',
    category: 'twitter-tools',
    url: '/twitter-profile-picture-resizer',
    description: 'Resize X/Twitter avatars to crisp 400x400 squares with circle-crop preview—no watermark.',
    longDescription:
      'Prepare crisp 400x400 square profile avatars for personal X accounts (circle crop) or brand/organization badges directly in your browser. Accepts JPG, PNG, or WEBP files up to 20 MB with zero watermarks and zero login.',
    keywords: ['twitter profile picture resizer', '400x400 x avatar', 'twitter pfp resizer no watermark'],
    icon: 'CircleUserRound',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Twitter Profile Picture Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize Twitter/X avatars to exact 400x400 pixels with circle-crop preview in your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Choose avatar photo (max 20 MB)',
        description: 'Open a JPG, PNG, or WEBP photo inside your browser.',
      },
      {
        title: 'Center inside 400x400 circle preview',
        description: 'Adjust zoom and alignment cleanly so faces or logos sit balanced inside the circle.',
      },
      {
        title: 'Save clean 400x400 output',
        description: 'Download unwatermarked PNG/JPG artwork instantaneously.',
      },
    ],
    faqs: [
      {
        question: 'What resolution does Twitter Profile Picture Resizer download?',
        answer: 'Exact 400x400 pixels (1:1 square), X/Twitter’s recommended crisp avatar spec.',
      },
      {
        question: 'Will my downloaded avatar include a watermark?',
        answer: 'No. Zero watermarks on any Twitter tool output.',
      },
      {
        question: 'Does this upload my photo?',
        answer: 'No. Canvas resizing stays privately on your device.',
      },
      {
        question: 'Want to size feed photos to 1600x900 next?',
        answer: 'Open Twitter Post Image Resizer.',
      },
    ],
    relatedTools: [
      'twitter-header-resizer',
      'twitter-post-image-resizer',
      'twitter-card-preview-generator',
      'twitter-bio-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-post-image-resizer',
    name: 'Twitter Post Image Resizer',
    slug: 'twitter-post-image-resizer',
    category: 'twitter-tools',
    url: '/twitter-post-image-resizer',
    description: 'Resize X/Twitter post graphics cleanly to 1600x900 (16:9) in browser—no watermark.',
    longDescription:
      'Ensure screenshots, product shots, and promo cards display sharp without unexpected timeline clipping. Resize JPG, PNG, or WEBP graphics up to 20 MB to X/Twitter’s crisp 1600x900 (16:9) widescreen spec locally—zero watermarks.',
    keywords: ['twitter post image resizer', '1600x900 x photo', 'resize tweet image no watermark'],
    icon: 'Image',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Twitter Post Image Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize tweet images to exact 1600x900 (16:9) dimensions privately inside your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Load graphic (max 20 MB)',
        description: 'Open a JPG, PNG, or WEBP image inside your browser.',
      },
      {
        title: 'Select 1600x900 (16:9) fit',
        description: 'Choose clean fill-crop or padded border mode matching X timeline rendering.',
      },
      {
        title: 'Download unwatermarked image',
        description: 'Save crisp 1600x900 artwork with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Why target 1600x900 for X/Twitter post images?',
        answer: '1600x900 (16:9) renders sharp on Retina displays and displays cleanly across desktop and mobile timelines.',
      },
      {
        question: 'Is there any watermark on resized tweet images?',
        answer: 'No. Every Twitter tool is 100% free and unwatermarked.',
      },
      {
        question: 'Do images stay on my computer?',
        answer: 'Yes. Processing happens locally in your browser.',
      },
      {
        question: 'Want to preview link Summary Large Image cards?',
        answer: 'Try Twitter Card Preview Generator.',
      },
    ],
    relatedTools: [
      'twitter-header-resizer',
      'twitter-profile-picture-resizer',
      'twitter-card-preview-generator',
      'twitter-thread-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-card-preview-generator',
    name: 'Twitter Card Preview Generator',
    slug: 'twitter-card-preview-generator',
    category: 'twitter-tools',
    url: '/twitter-card-preview-generator',
    description: 'Preview X/Twitter Summary & Large Image link cards from your own meta inputs (not AI).',
    longDescription:
      'See how your blog headline, domain badge, description, and 16:9 thumbnail image look inside a realistic X/Twitter link card before publishing. Renders strictly from your entered metadata and local image templates—NOT AI and no live URL fetching.',
    keywords: ['twitter card preview generator', 'x summary_large_image mockup', 'og tag card preview not ai'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['JPG', 'PNG', 'WEBP', 'Text'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Twitter Card Preview Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Preview X/Twitter Summary & Large Image link cards from your own title and image locally (NOT AI, no watermark).',
    howTo: [
      {
        title: 'Choose Summary or Large Image card',
        description: 'Pick small square thumbnail or full 16:9 Summary Large Image card template.',
      },
      {
        title: 'Enter title, domain & local image',
        description: 'Fill your headline and load a thumbnail up to 20 MB to test headline truncation (NOT AI).',
      },
      {
        title: 'Inspect card framing & meta snippet',
        description: 'Copy matching `<meta name="twitter:...">` HTML tags cleanly for your site header.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Card Preview Generator use AI or scrape live URLs?',
        answer: 'No. It builds a local browser card preview strictly from the text and image you enter—NOT AI.',
      },
      {
        question: 'Does it output matching `twitter:card` meta tag code?',
        answer: 'Yes. Generates standard copyable HTML meta tags alongside the visual template preview.',
      },
      {
        question: 'Are downloaded card screenshots watermarked?',
        answer: 'No. Completely free and unwatermarked.',
      },
      {
        question: 'Does this require an X developer key or login?',
        answer: 'No. Everything runs locally in your browser.',
      },
    ],
    relatedTools: [
      'twitter-post-image-resizer',
      'twitter-character-counter',
      'twitter-thread-formatter',
      'twitter-header-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-content-calendar-generator',
    name: 'Twitter Content Calendar Generator',
    slug: 'twitter-content-calendar-generator',
    category: 'twitter-tools',
    url: '/twitter-content-calendar-generator',
    description: 'Schedule weekly X/Twitter tweets, threads & polls using browser templates (not AI).',
    longDescription:
      'Keep your X/Twitter feed active with a balanced cadence of short observations, 1600x900 visual posts, polls, and weekly deep-dive threads. Uses deterministic pillar templates in your browser—NOT AI and zero social login or auto-posting.',
    keywords: ['twitter content calendar generator', 'x posting schedule template', 'tweet planner not ai'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build an editable weekly X/Twitter post, thread & poll schedule using browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter niche topic & cadence',
        description: 'Enter your niche topic and choose daily or weekday posting rhythm.',
      },
      {
        title: 'Generate format rotation',
        description: 'Templates balance short hooks, quotes, polls, image posts, and threads deterministically (NOT AI).',
      },
      {
        title: 'Download CSV checklist',
        description: 'Download your plan offline—zero X account login needed.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Content Calendar Generator use AI?',
        answer: 'No. Schedules rotate strictly from structured browser templates—NOT AI.',
      },
      {
        question: 'Can this tool auto-post tweets for me?',
        answer: 'No. Zero X/Twitter login or auto-posting is involved.',
      },
      {
        question: 'Can I split thread drafts directly after planning?',
        answer: 'Yes. Open Twitter Thread Formatter.',
      },
      {
        question: 'Is there any usage cap?',
        answer: 'No. Free to generate and export anytime.',
      },
    ],
    relatedTools: [
      'twitter-thread-formatter',
      'twitter-poll-generator',
      'twitter-quote-generator',
      'twitter-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-poll-generator',
    name: 'Twitter Poll Generator',
    slug: 'twitter-poll-generator',
    category: 'twitter-tools',
    url: '/twitter-poll-generator',
    description: 'Draft punchy 2–4 option X/Twitter polls within 280 & 25-char limits via templates (not AI).',
    longDescription:
      'Create quick, engaging X/Twitter polls that fit cleanly inside both the 280-character question limit and X’s tight 25-character choice button limit. Strictly template-based in your browser—NOT AI and zero login required.',
    keywords: ['twitter poll generator', 'x poll 25 character options', 'poll question templates not ai'],
    icon: 'ListChecks',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Poll Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build 2–4 option X/Twitter polls obeying 280-char question & 25-char button limits via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter poll question & 2–4 options',
        description: 'Input your prompt and concise answer labels.',
      },
      {
        title: 'Check 25-character option limits',
        description: 'Templates format clear mutually exclusive options plus optional "See Results" label (NOT AI).',
      },
      {
        title: 'Copy into X/Twitter composer',
        description: 'Paste question and options manually into X’s native Poll tab.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Poll Generator use AI?',
        answer: 'No. Polls are organized using editable templates locally in your browser—NOT AI.',
      },
      {
        question: 'What is X/Twitter’s option character limit per poll choice?',
        answer: 'Each of the 2–4 poll options on X/Twitter is capped strictly at 25 characters.',
      },
      {
        question: 'Does this publish polls to Twitter automatically?',
        answer: 'No. Zero social login is needed.',
      },
      {
        question: 'Looking to measure poll impressions & votes?',
        answer: 'Check Twitter Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'twitter-character-counter',
      'twitter-content-calendar-generator',
      'twitter-engagement-rate-calculator',
      'twitter-quote-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-quote-generator',
    name: 'Twitter Quote Generator',
    slug: 'twitter-quote-generator',
    category: 'twitter-tools',
    url: '/twitter-quote-generator',
    description: 'Format crisp founder lessons, book quotes & short observations from templates (not AI).',
    longDescription:
      'Frame memorable single-post quotes, attribution lines, and crisp two-line takeaways under 280 characters cleanly. Twitter Quote Generator builds balanced layout templates in your browser—NOT AI and no social login.',
    keywords: ['twitter quote generator', 'x one liner templates', 'attributed quote formatter not ai'],
    icon: 'Quote',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Quote Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format clean single-tweet quotes, takeaways, and attributions under 280 chars via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter topic/theme & style',
        description: 'Type your subject and select motivational, thoughtful, funny, or short styles.',
      },
      {
        title: 'Select variations count & generate',
        description: 'Choose how many distinct quote variations to generate.',
      },
      {
        title: 'Copy ready-to-post text',
        description: 'Paste cleanly into X/Twitter with zero account connection.',
      },
    ],
    faqs: [
      {
        question: 'Does Twitter Quote Generator invent quotes with AI?',
        answer: 'No. It generates quote variations from Topic/Theme and Style using local browser templates—NOT AI.',
      },
      {
        question: 'Does it keep formatted quotes under 280 characters?',
        answer: 'Yes. Live character checking validates every formatted quote against 280 characters.',
      },
      {
        question: 'Can I turn a quote series into a numbered thread?',
        answer: 'Yes. Paste multiple quotes into Twitter Thread Formatter.',
      },
      {
        question: 'Is any login required?',
        answer: 'No. Runs client-side with zero sign-in.',
      },
    ],
    relatedTools: [
      'twitter-character-counter',
      'twitter-thread-formatter',
      'twitter-font-generator',
      'twitter-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'twitter-bio-character-counter',
    name: 'Twitter Bio Character Counter',
    slug: 'twitter-bio-character-counter',
    category: 'twitter-tools',
    url: '/twitter-bio-character-counter',
    description: 'Measure X/Twitter profile bios against the 160-character bio limit.',
    longDescription:
      'Keep your X/Twitter profile pitch sharp without getting truncated at Edit Profile. Paste your bio, @mentions, and link keywords to measure exact length against X’s 160-character bio cap locally.',
    keywords: ['twitter bio character counter', '160 char bio limit', 'x profile bio counter'],
    icon: 'CircleUserRound',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Twitter Bio Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check X/Twitter profile bios against the 160-character bio cap in browser.',
    howTo: [
      {
        title: 'Type or paste draft bio',
        description: 'Enter or paste your X profile bio text.',
      },
      {
        title: 'Measure 160-character limit',
        description: 'Counts characters literally by code point (emoji = 1) and URLs at full length.',
      },
      {
        title: 'Copy trimmed bio',
        description: 'Paste straight into X/Twitter Edit Profile with zero login required.',
      },
    ],
    faqs: [
      {
        question: 'What is X/Twitter’s profile bio character limit?',
        answer: 'Profile bios allow up to 160 characters.',
      },
      {
        question: 'Does this read my current X bio automatically?',
        answer: 'No. Zero social login is required—paste your bio manually.',
      },
      {
        question: 'Want to check standard 280-char tweets too?',
        answer: 'Use Twitter Character Counter.',
      },
    ],
    relatedTools: [
      'twitter-character-counter',
      'twitter-stylish-text-generator',
      'twitter-font-generator',
      'twitter-profile-picture-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
