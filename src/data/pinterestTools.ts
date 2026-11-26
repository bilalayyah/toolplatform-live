import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const PINTEREST_TOOLS: readonly Tool[] = [
  {
    id: 'pinterest-board-description-generator',
    name: 'Pinterest Board Description Generator',
    slug: 'pinterest-board-description-generator',
    category: 'pinterest-tools',
    url: '/pinterest-board-description-generator',
    description: 'Build keyword-structured Pinterest board descriptions within 500 chars via templates (not AI).',
    longDescription:
      'Help Pinterest index your boards accurately with clear topic summaries and natural keywords. Pinterest Board Description Generator is strictly template-based inside your browser (NOT AI-written)—assembling clean board blurbs within Pinterest’s 500-character limit.',
    keywords: ['pinterest board description generator', 'board seo templates', '500 char board description not ai'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Board Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create keyword-clear Pinterest board descriptions up to 500 chars using browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter board name & 3 topic keywords',
        description: 'Fill your board focus and who the saved ideas help.',
      },
      {
        title: 'Pick a structured board template',
        description: 'Browser formulas weave your keywords into clean sentences deterministically (NOT AI).',
      },
      {
        title: 'Copy within 500 characters',
        description: 'Check character count and paste straight into Edit Board.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Board Description Generator use AI?',
        answer: 'No. It uses structured fill-in sentence templates in your browser—NOT AI-written.',
      },
      {
        question: 'What is Pinterest’s board description character limit?',
        answer: 'Pinterest board descriptions support up to 500 characters.',
      },
      {
        question: 'Should I stuff hashtags into Pinterest board descriptions?',
        answer: 'No. Natural descriptive phrases work far better for Pinterest search than hashtag stuffing.',
      },
      {
        question: 'Can I write Pin descriptions next?',
        answer: 'Yes. Open Pinterest SEO Description Generator for individual Pin copy.',
      },
    ],
    relatedTools: [
      'pinterest-seo-description-generator',
      'pinterest-board-cover-maker',
      'pinterest-pin-idea-generator',
      'pinterest-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-username-generator',
    name: 'Pinterest Username Generator',
    slug: 'pinterest-username-generator',
    category: 'pinterest-tools',
    url: '/pinterest-username-generator',
    description: 'Combine brand & niche words into clean Pinterest usernames via rules & templates (not AI).',
    longDescription:
      'Create readable @usernames aligned with your blog, shop, or design niche. Pinterest Username Generator runs deterministically inside your browser using separator rules and creator templates—NOT AI-generated.',
    keywords: ['pinterest username generator', 'pinterest handle ideas', 'blog username templates not ai'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format clean Pinterest @username variations from your brand keywords in your browser (NOT AI). Zero fees.',
    howTo: [
      {
        title: 'Enter brand or niche words',
        description: 'Type up to 2 core keywords and optional lifestyle or shop suffixes.',
      },
      {
        title: 'Generate rule-based handle options',
        description: 'Combines words cleanly within Pinterest’s 3–30 character alphanumeric handle rules (NOT AI).',
      },
      {
        title: 'Copy & verify inside Pinterest',
        description: 'Check handle availability directly inside your Pinterest Account Settings.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Username Generator use AI?',
        answer: 'No. It uses word-combining rules and templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does this verify live Pinterest handle availability?',
        answer: 'No. It formats syntax-safe handle suggestions only; test availability on Pinterest.',
      },
      {
        question: 'Are spaces or dashes allowed in Pinterest usernames?',
        answer: 'Pinterest usernames allow letters, numbers, and underscores up to 30 characters without spaces.',
      },
      {
        question: 'Can I build my profile bio next?',
        answer: 'Yes. Pair it with Pinterest Bio Generator.',
      },
    ],
    relatedTools: [
      'pinterest-bio-generator',
      'pinterest-board-description-generator',
      'pinterest-stylish-text-generator',
      'pinterest-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-bio-generator',
    name: 'Pinterest Bio Generator',
    slug: 'pinterest-bio-generator',
    category: 'pinterest-tools',
    url: '/pinterest-bio-generator',
    description: 'Draft keyword-friendly Pinterest profile bios within 160 characters using templates (not AI).',
    longDescription:
      'Tell visitors what you curate and why they should follow your boards without rambling. Pinterest Bio Generator builds clean About You blurbs inside your browser using structured role + topic templates (NOT AI) sized for Pinterest’s 160-char limit.',
    keywords: ['pinterest bio generator', 'pinterest about you template', '160 char bio not ai'],
    icon: 'CircleUserRound',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Bio Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build concise Pinterest profile bios using browser templates within 160 chars (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter what you share & audience',
        description: 'Input your niche, tone, and optional comma-separated keywords.',
      },
      {
        title: 'Choose structured bio formats',
        description: 'Templates organize clear creator and business summary patterns (NOT AI).',
      },
      {
        title: 'Check character count & paste',
        description: 'Stay neatly inside Pinterest’s 160-character profile bio cap.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Bio Generator use AI?',
        answer: 'No. All bio variations are strictly template-based inside your browser—NOT AI-written.',
      },
      {
        question: 'How long can a Pinterest profile bio be?',
        answer: 'Pinterest profile "About" bios support up to 160 characters.',
      },
      {
        question: 'Should my Pinterest bio include search keywords?',
        answer: 'Yes. Including 2–3 clear niche nouns helps profile discovery in Pinterest search.',
      },
      {
        question: 'Can I pair this with styled display headings?',
        answer: 'Yes. Try Pinterest Stylish Text Generator or Pinterest Font Generator.',
      },
    ],
    relatedTools: [
      'pinterest-username-generator',
      'pinterest-board-description-generator',
      'pinterest-seo-description-generator',
      'pinterest-stylish-text-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-stylish-text-generator',
    name: 'Pinterest Stylish Text Generator',
    slug: 'pinterest-stylish-text-generator',
    category: 'pinterest-tools',
    url: '/pinterest-stylish-text-generator',
    description: 'Style Pinterest board names & bio headings with Unicode symbol templates (not AI).',
    longDescription:
      'Add clean aesthetic dividers, brackets, and Unicode display styles to Pinterest board headers and profile names. Runs deterministically in your browser via fixed symbol templates—NOT AI.',
    keywords: ['pinterest stylish text generator', 'aesthetic pinterest fonts', 'board name symbols not ai'],
    icon: 'Sparkles',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate aesthetic Unicode board titles & bio accents for Pinterest locally in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type board title or header',
        description: 'Enter short text for a board header or profile tagline.',
      },
      {
        title: 'Select Unicode symbol style',
        description: 'Preview bordered, spaced, serif, and aesthetic symbol frames deterministically (NOT AI).',
      },
      {
        title: 'Copy & keep SEO keywords readable',
        description: 'Use styled Unicode sparingly on decorative boards while keeping core searchable boards plain ASCII.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Stylish Text Generator use AI?',
        answer: 'No. It uses fixed Unicode character maps and symbol dividers in your browser—NOT AI.',
      },
      {
        question: 'Do Unicode board names affect Pinterest search?',
        answer: 'Yes—Pinterest indexes standard letters most reliably, so keep main SEO keywords in normal text.',
      },
      {
        question: 'Will these characters display on both mobile and desktop?',
        answer: 'Standard Unicode sets render smoothly across modern browsers and Pinterest mobile apps.',
      },
      {
        question: 'Want pure bold or cursive Unicode styles?',
        answer: 'Use Pinterest Font Generator for clean font-family Unicode presets.',
      },
    ],
    relatedTools: [
      'pinterest-font-generator',
      'pinterest-bio-generator',
      'pinterest-board-description-generator',
      'pinterest-board-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-font-generator',
    name: 'Pinterest Font Generator',
    slug: 'pinterest-font-generator',
    category: 'pinterest-tools',
    url: '/pinterest-font-generator',
    description: 'Convert plain text to copy-paste Unicode bold, serif, italic & script styles (not AI).',
    longDescription:
      'Transform Pinterest profile taglines or aesthetic board subtitles using deterministic Unicode code-point mapping and template style presets inside your browser—NOT AI and no font installation required.',
    keywords: ['pinterest font generator', 'unicode fonts pinterest', 'bold serif script copy paste'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Font Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Map plain text to copy-paste Unicode serif, bold, and script styles for Pinterest in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your text',
        description: 'Enter a profile tagline, board subtitle, or header word.',
      },
      {
        title: 'Pick a Unicode font row',
        description: 'Instant local conversion renders serif bold, italic, cursive, and small-caps glyphs (NOT AI).',
      },
      {
        title: 'Copy to clipboard',
        description: 'Paste cleanly into Pinterest Edit Profile or board settings.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Font Generator use AI?',
        answer: 'No. It converts plain letters strictly via Unicode lookup tables inside your browser—NOT AI.',
      },
      {
        question: 'Can I use these fonts inside Pin graphic images?',
        answer: 'For Pin images, use standard typography inside Pin Mockup Generator or Board Cover Maker for crisp rendering.',
      },
      {
        question: 'Does it work offline without an account?',
        answer: 'Yes. Everything runs in your browser tab.',
      },
      {
        question: 'Are any watermarks or fees involved?',
        answer: 'No. Pure copyable Unicode text is free forever.',
      },
    ],
    relatedTools: [
      'pinterest-stylish-text-generator',
      'pinterest-bio-generator',
      'pinterest-username-generator',
      'pinterest-board-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-collage-maker',
    name: 'Pinterest Collage Maker',
    slug: 'pinterest-collage-maker',
    category: 'pinterest-tools',
    url: '/pinterest-collage-maker',
    description: 'Arrange multi-photo 1000x1500 (2:3) Pinterest Pin collages in browser—no watermark.',
    longDescription:
      'Combine product flatlays, step-by-step recipes, or outfit moodboards into a clean vertical 1000x1500 (2:3) Pin grid. Build multi-panel Pinterest collages locally from images up to 20 MB each—zero server uploads and zero watermarks.',
    keywords: ['pinterest collage maker', '2 3 pin collage', '1000x1500 pinterest collage', 'pin grid no watermark'],
    icon: 'Grid3x3',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 9,
    processingMethod: 'browser',
    seoTitle: `Pinterest Collage Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Combine up to 9 photos into crisp 1000x1500 (2:3) Pinterest collages in your browser. Zero uploads and zero watermarks.',
    howTo: [
      {
        title: 'Select 2–9 images (20 MB max each)',
        description: 'Load JPG, PNG, or WEBP photos directly in your browser.',
      },
      {
        title: 'Pick 2:3 collage layout & gutters',
        description: 'Choose split, 3-panel, 4-grid, or moodboard frames sized to 1000x1500 pixels.',
      },
      {
        title: 'Export unwatermarked Pin',
        description: 'Download crisp PNG or JPG collage ready for Pinterest with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What size do Pinterest collages export at?',
        answer: 'Standard vertical 1000x1500 pixels (2:3 aspect ratio), Pinterest’s recommended Pin size.',
      },
      {
        question: 'Does Pinterest Collage Maker add a watermark?',
        answer: 'No. Every Pinterest tool exports 100% clean artwork without watermarks.',
      },
      {
        question: 'How many photos can I combine per collage?',
        answer: 'Up to 9 photos per collage, max 20 MB per image.',
      },
      {
        question: 'Do my photos leave my computer or phone?',
        answer: 'No. Canvas composition runs completely in your browser.',
      },
    ],
    relatedTools: [
      'pinterest-pin-mockup-generator',
      'pinterest-board-cover-maker',
      'pinterest-color-palette-extractor',
      'pinterest-pin-text-extractor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-pin-idea-generator',
    name: 'Pinterest Pin Idea Generator',
    slug: 'pinterest-pin-idea-generator',
    category: 'pinterest-tools',
    url: '/pinterest-pin-idea-generator',
    description: 'Plan visual Pin formats & seasonal angle prompts using browser templates (not AI).',
    longDescription:
      'Turn blog posts, Etsy listings, or how-to guides into repeatable Pin visual angles—checklists, infographics, before/after splits, and seasonal roundups. Uses structured browser templates only, NOT AI.',
    keywords: ['pinterest pin idea generator', 'pin angle templates', 'pinterest content prompts not ai'],
    icon: 'Pin',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Pin Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build fresh Pinterest Pin layout & angle concepts from editable browser templates (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter blog, shop, or niche topic',
        description: 'Input your core keyword and target pinner goal.',
      },
      {
        title: 'Browse Pin template frameworks',
        description: 'Deterministic rules combine checklist, infographic, quote, and guide prompts (NOT AI).',
      },
      {
        title: 'Schedule across fresh Pins',
        description: 'Move chosen concepts into Pinterest Content Calendar Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Pin Idea Generator use AI?',
        answer: 'No. All Pin concept cards come from structured format templates inside your browser—NOT AI.',
      },
      {
        question: 'Why create multiple Pin angles per URL?',
        answer: 'Pinterest favors fresh visual Pin designs paired with distinct search keywords over identical re-pins.',
      },
      {
        question: 'Can I write Pin descriptions for each idea?',
        answer: 'Yes. Pair it with Pinterest SEO Description Generator.',
      },
      {
        question: 'Is there any usage cap?',
        answer: 'No. Free to browse and copy anytime.',
      },
    ],
    relatedTools: [
      'pinterest-content-calendar-generator',
      'pinterest-seo-description-generator',
      'pinterest-collage-maker',
      'pinterest-pin-mockup-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-content-calendar-generator',
    name: 'Pinterest Content Calendar Generator',
    slug: 'pinterest-content-calendar-generator',
    category: 'pinterest-tools',
    url: '/pinterest-content-calendar-generator',
    description: 'Build an editable seasonal & fresh-Pin publishing calendar using browser templates (not AI).',
    longDescription:
      'Plan Pinterest boards ahead of seasonal search waves (usually 30–45 days early). Pinterest Content Calendar Generator rotates your URL pillars and Pin types across weekly schedules using local browser templates—NOT AI and no auto-posting.',
    keywords: ['pinterest content calendar generator', 'pin schedule planner not ai', 'seasonal pin calendar'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate an editable weekly or seasonal Pinterest Pin publishing plan using browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter boards & weekly Pin target',
        description: 'Enter your niche focus, weekly Pin cadence, start date, and format mix.',
      },
      {
        title: 'Apply seasonal lead-time template',
        description: 'Browser templates build a rotated schedule with 30–45 day seasonal reminders (NOT AI).',
      },
      {
        title: 'Export CSV checklist',
        description: 'Download your plan cleanly—no Pinterest login or auto-posting involved.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Content Calendar Generator use AI?',
        answer: 'No. Schedules are generated deterministically from rotating board/format templates—NOT AI.',
      },
      {
        question: 'Does it connect to Pinterest to auto-publish Pins?',
        answer: 'No. It is a planning and CSV/text schedule tool only.',
      },
      {
        question: 'Why plan Pinterest content 30–45 days ahead of holidays?',
        answer: 'Pinners search early for holidays and events, giving new Pins time to index.',
      },
      {
        question: 'Can I generate matching Pin concepts first?',
        answer: 'Yes. Start in Pinterest Pin Idea Generator.',
      },
    ],
    relatedTools: [
      'pinterest-pin-idea-generator',
      'pinterest-seo-description-generator',
      'pinterest-follower-growth-calculator',
      'pinterest-board-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-engagement-rate-calculator',
    name: 'Pinterest Engagement Rate Calculator',
    slug: 'pinterest-engagement-rate-calculator',
    category: 'pinterest-tools',
    url: '/pinterest-engagement-rate-calculator',
    description: 'Compute Pinterest Pin engagement, save rate, and outbound click rate locally in browser.',
    longDescription:
      'Measure how well your Pins convert impressions into saves and website traffic. Enter impressions, saves, Pin clicks, and outbound clicks to calculate clean percentage ratios inside your browser with zero account connection.',
    keywords: ['pinterest engagement rate calculator', 'pin save rate calculator', 'outbound click rate'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate Pinterest engagement, save rate, and outbound CTR from your Pin numbers locally in your browser.',
    howTo: [
      {
        title: 'Enter impressions & Pin actions',
        description: 'Enter total impressions or followers alongside saves, close-ups, link clicks, and comments.',
      },
      {
        title: 'Inspect 3 core ratios',
        description: 'View Save Rate %, Outbound Click-Through Rate %, and overall Engagement Rate %.',
      },
      {
        title: 'Compare visual Pin tests',
        description: 'Use clear browser math to compare which Pin titles or collages drive more outbound traffic.',
      },
    ],
    faqs: [
      {
        question: 'Does this pull live metrics from Pinterest Analytics?',
        answer: 'No. All calculations run strictly from the impression and click numbers you enter.',
      },
      {
        question: 'What is the difference between Pin clicks and Outbound clicks?',
        answer: 'Pin clicks measure close-ups inside Pinterest, while Outbound clicks measure taps going to your destination link.',
      },
      {
        question: 'Does it calculate Save Rate separately?',
        answer: 'Yes. Saves divided by impressions highlights content-bookmark appeal cleanly.',
      },
      {
        question: 'Are formulas transparent?',
        answer: 'Yes. Exact equations display beside every percentage.',
      },
    ],
    relatedTools: [
      'pinterest-follower-growth-calculator',
      'pinterest-seo-description-generator',
      'pinterest-rich-pin-preview-generator',
      'pinterest-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-follower-growth-calculator',
    name: 'Pinterest Follower Growth Calculator',
    slug: 'pinterest-follower-growth-calculator',
    category: 'pinterest-tools',
    url: '/pinterest-follower-growth-calculator',
    description: 'Calculate Pinterest follower growth rate %, net gain, and average daily pace locally in browser.',
    longDescription:
      'Measure your exact Pinterest audience growth percentage, total followers gained, and average daily gain from your previous and current follower counts over any time period. Pure browser math only—never accesses live Pinterest accounts.',
    keywords: ['pinterest follower growth calculator', 'pinterest growth rate percentage', 'follower pace calculator'],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Follower Growth Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate Pinterest follower growth rate percentage, net change, and daily average inside your browser.',
    howTo: [
      {
        title: 'Enter previous & current followers',
        description: 'Input your previous and current Pinterest follower counts plus time period.',
      },
      {
        title: 'Select days, weeks, or months',
        description: 'Choose the unit matching your measurement window (days, weeks, or 30-day months).',
      },
      {
        title: 'Inspect growth rate & daily pace',
        description: 'View Growth Rate %, Absolute Growth, Avg Growth per day, and the exact equation.',
      },
    ],
    faqs: [
      {
        question: 'What formula is used for Pinterest follower growth rate?',
        answer: 'Growth Rate (%) = ((Current Followers − Previous Followers) ÷ Previous Followers) × 100.',
      },
      {
        question: 'Does this connect to my Pinterest account?',
        answer: 'No. You enter numbers manually inside your browser.',
      },
      {
        question: 'Which metrics matter alongside followers on Pinterest?',
        answer: 'Impressions, saves, and outbound link clicks—measure those in Pinterest Engagement Rate Calculator.',
      },
      {
        question: 'Is this free to use?',
        answer: 'Yes. Instant client-side math with zero account needed.',
      },
    ],
    relatedTools: [
      'pinterest-engagement-rate-calculator',
      'pinterest-content-calendar-generator',
      'pinterest-pin-idea-generator',
      'pinterest-seo-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-board-cover-maker',
    name: 'Pinterest Board Cover Maker',
    slug: 'pinterest-board-cover-maker',
    category: 'pinterest-tools',
    url: '/pinterest-board-cover-maker',
    description: 'Create clean 600x600 square Pinterest board cover images in your browser—no watermark.',
    longDescription:
      'Unify your Pinterest profile aesthetic with cohesive branded board covers. Compose 600x600 square covers with clean typography, solid or image backdrops (up to 20 MB), and brand colors locally in your browser with zero watermarks.',
    keywords: ['pinterest board cover maker', '600x600 board cover', 'aesthetic board covers no watermark'],
    icon: 'Bookmark',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Pinterest Board Cover Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Design cohesive 600x600 square Pinterest board covers locally in your browser. Free with zero watermarks.',
    howTo: [
      {
        title: 'Pick color or background photo (max 20 MB)',
        description: 'Choose solid palette swatches or load an optional JPG, PNG, or WEBP image.',
      },
      {
        title: 'Center your board title',
        description: 'Preview how the square 600x600 cover sits cleanly inside Pinterest board grid tiles.',
      },
      {
        title: 'Download unwatermarked cover',
        description: 'Save crisp PNG/JPG cover artwork locally with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What dimensions are best for Pinterest board covers?',
        answer: 'Square 600x600 pixels (1:1 aspect ratio) displays cleanly without awkward edge trimming.',
      },
      {
        question: 'Will exported board covers carry a watermark?',
        answer: 'No. Every Pinterest tool outputs clean, unwatermarked images.',
      },
      {
        question: 'Can I extract colors from my brand logo first?',
        answer: 'Yes. Grab exact hex codes in Pinterest Color Palette Extractor.',
      },
      {
        question: 'Do images stay on my device?',
        answer: 'Yes. All canvas rendering occurs inside your browser tab.',
      },
    ],
    relatedTools: [
      'pinterest-color-palette-extractor',
      'pinterest-collage-maker',
      'pinterest-board-description-generator',
      'pinterest-stylish-text-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-pin-text-extractor',
    name: 'Pinterest Pin Text Extractor',
    slug: 'pinterest-pin-text-extractor',
    category: 'pinterest-tools',
    url: '/pinterest-pin-text-extractor',
    description: 'Extract on-image Pin titles & recipe/checklist text (Coming Soon).',
    longDescription: 'Copy headlines, quote text, or infographic notes straight off a Pin image. Reliable in-browser optical character recognition is not yet supported, so this tool is currently coming soon.',
    keywords: ['pinterest pin text extractor', 'pin image ocr', 'free in browser ocr', 'copy text from pin image'],
    icon: 'ScanText',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Pinterest Pin Text Extractor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Extract text from Pinterest Pin images using free in-browser OCR locally on your device. No paid APIs or uploads.',
    howTo: [
      {
        title: 'Open a Pin image (max 20 MB)',
        description: 'Once live, load a JPG, PNG, or WEBP Pin graphic from your device into the browser.',
      },
      {
        title: 'Run free in-browser OCR',
        description: 'Local client-side OCR scans headline and body text directly on your machine without uploads.',
      },
      {
        title: 'Copy extracted text',
        description: 'Edit or copy clean recognized text for alt text notes, accessibility, or study.',
      },
    ],
    faqs: [
      {
        question: 'Is Pinterest Pin Text Extractor available yet?',
        answer: 'No, this tool is currently coming soon. Reliable in-browser optical character recognition is not yet supported.',
      },
      {
        question: 'Can OCR read thin cursive script or low-contrast overlays?',
        answer: 'Accuracy is highest on crisp sans-serif/serif text with strong contrast; decorative scripts may need light cleanup.',
      },
      {
        question: 'Can I paste extracted text into an accessible alt description?',
        answer: 'Yes. Pair your extracted copy with your visual description inside Pinterest Alt Text Generator.',
      },
      {
        question: 'What file limit applies?',
        answer: 'Supports JPG, PNG, and WEBP images up to 20 MB.',
      },
    ],
    relatedTools: [
      'pinterest-alt-text-generator',
      'pinterest-color-palette-extractor',
      'pinterest-seo-description-generator',
      'pinterest-collage-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'pinterest-color-palette-extractor',
    name: 'Pinterest Color Palette Extractor',
    slug: 'pinterest-color-palette-extractor',
    category: 'pinterest-tools',
    url: '/pinterest-color-palette-extractor',
    description: 'Pull dominant HEX & RGB moodboard palettes from Pin images up to 10 MB locally.',
    longDescription:
      'Sample cohesive HEX and RGB swatches straight from interior, fashion, or branding Pin images you select. Runs pixel quantization privately inside your browser on files up to 10 MB—zero uploads and zero watermarks.',
    keywords: ['pinterest color palette extractor', 'moodboard hex swatches', 'extract colors from pin'],
    icon: 'Palette',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Pinterest Color Palette Extractor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Extract dominant HEX & RGB brand palettes from Pinterest Pin moodboard images locally in your browser.',
    howTo: [
      {
        title: 'Load a Pin or inspiration photo',
        description: 'Pick any JPG, PNG, or WEBP image up to 10 MB in your browser.',
      },
      {
        title: 'Inspect dominant swatches',
        description: 'Local canvas sampling detects 5–6 dominant colors with HEX and RGB codes.',
      },
      {
        title: 'Copy swatches to design tools',
        description: 'Apply extracted HEX codes directly inside Pinterest Board Cover Maker.',
      },
    ],
    faqs: [
      {
        question: 'Does this upload my inspiration image to extract colors?',
        answer: 'No. Color sampling reads image pixels locally via HTML Canvas in your browser.',
      },
      {
        question: 'Which color formats can I copy?',
        answer: 'Copy individual HEX codes or all extracted HEX swatches in one click, with RGB values shown alongside each swatch.',
      },
      {
        question: 'Can I use these colors for cohesive board covers?',
        answer: 'Yes. Apply them inside Pinterest Board Cover Maker.',
      },
      {
        question: 'What is the maximum image size?',
        answer: 'Up to 10 MB per image.',
      },
    ],
    relatedTools: [
      'pinterest-board-cover-maker',
      'pinterest-collage-maker',
      'pinterest-pin-mockup-generator',
      'pinterest-pin-text-extractor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-seo-description-generator',
    name: 'Pinterest SEO Description Generator',
    slug: 'pinterest-seo-description-generator',
    category: 'pinterest-tools',
    url: '/pinterest-seo-description-generator',
    description: 'Build search-clear 500-char Pinterest Pin descriptions from editable templates (not AI).',
    longDescription:
      'Turn your target keywords, benefit summary, and click CTA into natural, search-friendly Pin copy without sounding robotic. Pinterest SEO Description Generator uses structured editorial templates in your browser (NOT AI-written) inside Pinterest’s 500-character limit.',
    keywords: ['pinterest seo description generator', 'pin description template', 'pinterest seo copy not ai'],
    icon: 'AlignLeft',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest SEO Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format natural 500-char Pinterest Pin descriptions from keyword templates locally in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter Pin title & 2–4 search keywords',
        description: 'Input what the Pin shows and why a user would save or click it.',
      },
      {
        title: 'Select natural SEO templates',
        description: 'Browser formulas weave your exact keywords smoothly within 500 characters (NOT AI).',
      },
      {
        title: 'Copy alongside alt text',
        description: 'Paste cleanly into Pinterest Create Pin alongside accessible alt text.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest SEO Description Generator use AI?',
        answer: 'No. Every Pin description comes from structured fill-in templates inside your browser—NOT AI.',
      },
      {
        question: 'How long can a Pinterest Pin description be?',
        answer: 'Standard Pins support up to 500 characters, with the first ~100 characters carrying the clearest hook.',
      },
      {
        question: 'Should I put hashtags in Pinterest Pin descriptions?',
        answer: 'Current best practice favors clear keyword sentences over hashtag blocks.',
      },
      {
        question: 'Can I write descriptive alt text right after?',
        answer: 'Yes. Open Pinterest Alt Text Generator next.',
      },
    ],
    relatedTools: [
      'pinterest-alt-text-generator',
      'pinterest-board-description-generator',
      'pinterest-rich-pin-preview-generator',
      'pinterest-pin-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-alt-text-generator',
    name: 'Pinterest Alt Text Generator',
    slug: 'pinterest-alt-text-generator',
    category: 'pinterest-tools',
    url: '/pinterest-alt-text-generator',
    description: 'Format accessible Pinterest alt text from YOUR own image description—NOT auto-vision, NOT AI.',
    longDescription:
      'Make your Pins accessible to screen-reader users and clearer to search context. Pinterest Alt Text Generator builds concise alt text strictly from the USER’s own description of the image (subject, setting, and any on-image text) via browser templates—NOT auto-vision and NOT AI.',
    keywords: ['pinterest alt text generator', 'accessible pin alt text', 'alt text template not auto vision'],
    icon: 'Eye',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pinterest Alt Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format clean Pinterest alt text from your own visual description locally in browser. Not auto-vision, not AI.',
    howTo: [
      {
        title: 'Describe what appears in your image',
        description: 'Enter main subject, visual details/colors, and any visible overlay text.',
      },
      {
        title: 'Apply screen-reader formatting rules',
        description: 'Templates organize concise alt text without redundant "image of" prefixes (NOT auto-vision, NOT AI).',
      },
      {
        title: 'Verify limit & paste into Pin Alt Text',
        description: 'Stay neatly inside Pinterest’s 500-character alt text field.',
      },
    ],
    faqs: [
      {
        question: 'Does this tool inspect images automatically with AI vision?',
        answer: 'No. It builds alt text strictly from YOUR own typed visual description using local templates—NOT auto-vision and NOT AI.',
      },
      {
        question: 'Can I include text already printed on my Pin graphic?',
        answer: 'Yes. Enter any visible headline or overlay wording into the Optional On-Image Text field so screen readers hear it cleanly.',
      },
      {
        question: 'How long should Pinterest alt text be?',
        answer: 'Pinterest allows up to 500 characters; 1–2 descriptive sentences (100–250 characters) work best.',
      },
      {
        question: 'Does it upload images or text?',
        answer: 'No. Formatting runs completely locally in your browser.',
      },
    ],
    relatedTools: [
      'pinterest-pin-text-extractor',
      'pinterest-seo-description-generator',
      'pinterest-rich-pin-preview-generator',
      'pinterest-pin-mockup-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-rich-pin-preview-generator',
    name: 'Pinterest Rich Pin Preview Generator',
    slug: 'pinterest-rich-pin-preview-generator',
    category: 'pinterest-tools',
    url: '/pinterest-rich-pin-preview-generator',
    description: 'Preview Product, Recipe & Article Rich Pin cards from your Open Graph inputs (not AI).',
    longDescription:
      'Check how your site’s Product price, Recipe ingredients/time, or Article headline displays alongside a Pin card before publishing. Uses deterministic layout templates in your browser from your entered metadata—NOT AI and no live URL scraping.',
    keywords: ['pinterest rich pin preview generator', 'open graph pin preview', 'product recipe rich pin mockup not ai'],
    icon: 'FileCode2',
    acceptedFormats: ['Text', 'JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Pinterest Rich Pin Preview Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Preview Article, Product, and Recipe Rich Pin card layouts from your own metadata locally in the browser (NOT AI).',
    howTo: [
      {
        title: 'Choose Rich Pin type',
        description: 'Switch between Article, Product (price/stock), and Recipe (prep time/servings).',
      },
      {
        title: 'Enter title, domain, Open Graph fields & optional image',
        description: 'Type your 100-char title, 500-char description, metadata values, and optionally attach a JPG/PNG/WEBP Pin image (NOT AI).',
      },
      {
        title: 'Toggle Desktop/Mobile preview & export PNG',
        description: 'Check truncation and wrapping across Desktop and Mobile card views, then download an unwatermarked PNG preview.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Rich Pin Preview Generator use AI or scrape live websites?',
        answer: 'No. It builds a local template preview strictly from the title, domain, and Open Graph details you type—NOT AI.',
      },
      {
        question: 'What types of Rich Pins can I preview?',
        answer: 'Article, Product, and Recipe Rich Pin layouts.',
      },
      {
        question: 'Does this validate live meta tags on my server?',
        answer: 'No. Use Pinterest’s official Rich Pin Validator after testing title/text length here.',
      },
      {
        question: 'Want to preview full feed Pin cards too?',
        answer: 'Yes. Open Pinterest Pin Mockup Generator.',
      },
    ],
    relatedTools: [
      'pinterest-pin-mockup-generator',
      'pinterest-seo-description-generator',
      'pinterest-alt-text-generator',
      'pinterest-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pinterest-pin-mockup-generator',
    name: 'Pinterest Pin Mockup Generator',
    slug: 'pinterest-pin-mockup-generator',
    category: 'pinterest-tools',
    url: '/pinterest-pin-mockup-generator',
    description: 'Preview 2:3 Pinterest feed Pin cards with your image & copy via templates (not AI, no watermark).',
    longDescription:
      'Check how your vertical Pin graphic, title truncation, domain badge, and Save button look inside a realistic Pinterest feed frame before publishing. Renders strictly from your local image (max 20 MB) and text templates in the browser—NOT AI and zero watermarks.',
    keywords: ['pinterest pin mockup generator', 'pin feed preview', '2 3 pin preview template not ai'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Pinterest Pin Mockup Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Preview your Pin artwork, headline, and profile attribution inside a clean feed mockup template (NOT AI, no watermark).',
    howTo: [
      {
        title: 'Load Pin graphic (max 20 MB)',
        description: 'Open a JPG, PNG, or WEBP Pin design locally inside your browser.',
      },
      {
        title: 'Fill title, board & domain text',
        description: 'Populate template preview slots with your exact headline and creator name (NOT AI).',
      },
      {
        title: 'Check readability & export',
        description: 'Inspect mobile/desktop card wrapping and save clean preview screenshots with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Does Pinterest Pin Mockup Generator use AI?',
        answer: 'No. It arranges your own image and text inside an editable browser feed frame—NOT AI.',
      },
      {
        question: 'Are exported mockups watermarked?',
        answer: 'No. Every Pinterest tool is 100% free with zero watermarks.',
      },
      {
        question: 'What image size limit applies?',
        answer: 'Supports JPG, PNG, and WEBP Pin graphics up to 20 MB.',
      },
      {
        question: 'Can I build multi-image collages before previewing?',
        answer: 'Yes. Create a 1000x1500 collage in Pinterest Collage Maker.',
      },
    ],
    relatedTools: [
      'pinterest-rich-pin-preview-generator',
      'pinterest-collage-maker',
      'pinterest-seo-description-generator',
      'pinterest-color-palette-extractor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
