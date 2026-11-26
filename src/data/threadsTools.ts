import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const THREADS_TOOLS: readonly Tool[] = [
  {
    id: 'threads-username-generator',
    name: 'Threads Username Generator',
    slug: 'threads-username-generator',
    category: 'threads-tools',
    url: '/threads-username-generator',
    description: 'Create clean Threads @username ideas from your brand keywords via rules & templates (not AI).',
    longDescription:
      'Generate crisp Threads handle ideas aligned with your brand or creator persona within standard 30-character alphanumeric/dot/underscore handle rules. Strictly template-based inside your browser—NOT AI and no Threads/Instagram login required.',
    keywords: ['threads username generator', 'threads handle ideas', 'threads naming template not ai'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build clean Threads @handle variations from your keywords using deterministic browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter name or creator keywords',
        description: 'Enter your core handle word and optional niche prefix/suffix.',
      },
      {
        title: 'Apply handle rules & templates',
        description: 'Browser logic creates clean underscore and period variants inside 30 characters (NOT AI).',
      },
      {
        title: 'Note Instagram handle link',
        description: 'Remember Threads shares your connected Instagram @username—review directly in your account settings.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Username Generator use AI?',
        answer: 'No. Handles are generated strictly from keyword rules and templates inside your browser—NOT AI.',
      },
      {
        question: 'Are Threads usernames linked to Instagram usernames?',
        answer: 'Yes. Threads uses your paired Instagram @username, so changing it updates both.',
      },
      {
        question: 'Does this check real username availability?',
        answer: 'No. Availability must be checked inside Instagram/Threads.',
      },
      {
        question: 'Is any social login needed here?',
        answer: 'No. Zero account connection is ever requested.',
      },
    ],
    relatedTools: [
      'threads-bio-generator',
      'threads-bio-character-counter',
      'threads-stylish-text-generator',
      'threads-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-bio-generator',
    name: 'Threads Bio Generator',
    slug: 'threads-bio-generator',
    category: 'threads-tools',
    url: '/threads-bio-generator',
    description: 'Craft sharp 150-character Threads profile bios using editable browser templates (not AI).',
    longDescription:
      'Introduce your conversation topics, specialty, and personality cleanly within Threads’ 150-character bio limit. Threads Bio Generator uses structured role + topic + vibe templates locally in your browser—NOT AI and zero login required.',
    keywords: ['threads bio generator', '150 char threads bio', 'threads profile bio not ai'],
    icon: 'CircleUserRound',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Bio Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build crisp 150-character Threads profile bios using editable browser templates (NOT AI). Zero login needed.',
    howTo: [
      {
        title: 'Enter what you post about',
        description: 'Input your main role, 2 favorite topics, and optional short CTA.',
      },
      {
        title: 'Pick structured bio templates',
        description: 'Organizes conversational multi-line or slash-separated bios within 150 chars (NOT AI).',
      },
      {
        title: 'Check count & paste cleanly',
        description: 'Verify length in Threads Bio Character Counter and paste into Edit Profile.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Bio Generator use AI?',
        answer: 'No. It uses structured fill-in templates inside your browser—NOT AI.',
      },
      {
        question: 'What is Threads’ profile bio character limit?',
        answer: 'Threads profile bios allow up to 150 characters (with one separate custom link slot).',
      },
      {
        question: 'Does this connect to my Threads profile?',
        answer: 'No. Runs client-side with zero social login.',
      },
      {
        question: 'Can I count exact remaining characters in my custom bio?',
        answer: 'Yes. Open Threads Bio Character Counter.',
      },
    ],
    relatedTools: [
      'threads-bio-character-counter',
      'threads-username-generator',
      'threads-stylish-text-generator',
      'threads-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-post-generator',
    name: 'Threads Post Generator',
    slug: 'threads-post-generator',
    category: 'threads-tools',
    url: '/threads-post-generator',
    description: 'Draft conversational 500-char Threads posts from editable browser templates (not AI).',
    longDescription:
      'Turn everyday hot takes, quick tips, and open conversation starters into crisp single posts tailored to Threads’ 500-character limit. Built strictly with structured browser templates—NOT AI and zero login required.',
    keywords: ['threads post generator', '500 char threads post', 'conversational post templates not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Post Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format conversational 500-character Threads posts using editable browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter topic & stance or tip',
        description: 'Type your core observation, question, or mini takeaway.',
      },
      {
        title: 'Choose post framework template',
        description: 'Formats quick observation, mini list, agree/disagree prompt, or honest confession (NOT AI).',
      },
      {
        title: 'Verify 500-char fit & copy',
        description: 'Check length against 500 characters and paste straight into Threads.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Post Generator use AI?',
        answer: 'No. Posts are structured from editable browser templates around your own words—NOT AI.',
      },
      {
        question: 'How long can a single Threads post be?',
        answer: 'Each individual Threads post allows up to 500 characters.',
      },
      {
        question: 'Want to format multi-post connected threads instead?',
        answer: 'Open Threads Thread Generator.',
      },
      {
        question: 'Is any social account login required?',
        answer: 'No. Runs 100% locally in your browser.',
      },
    ],
    relatedTools: [
      'threads-thread-generator',
      'threads-character-counter',
      'threads-hook-generator',
      'threads-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-thread-generator',
    name: 'Threads Thread Generator',
    slug: 'threads-thread-generator',
    category: 'threads-tools',
    url: '/threads-thread-generator',
    description: 'Structure multi-part 500-char connected Threads posts via local templates (not AI).',
    longDescription:
      'Break a story, step-by-step guide, or resource roundup into sequential connected Threads posts where every card stays neatly inside Threads’ 500-character limit. Uses deterministic splitting and layout templates in your browser—NOT AI.',
    keywords: ['threads thread generator', 'multi post threads builder', '500 char thread splitter not ai'],
    icon: 'Split',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Thread Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Organize multi-card 500-character Threads sequences using local templates (NOT AI). Zero login required.',
    howTo: [
      {
        title: 'Paste multi-point outline or notes',
        description: 'Write or paste multi-paragraph notes inside your browser.',
      },
      {
        title: 'Split & format 500-char cards',
        description: 'Template outlines arrange Hook Post -> Value Posts -> Closing Question within 500 chars each (NOT AI).',
      },
      {
        title: 'Copy posts sequentially',
        description: 'Copy each card cleanly into Threads’ "+ Add to thread" composer.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Thread Generator write content using AI?',
        answer: 'No. It uses structured card templates and deterministic 500-character splitting inside your browser—NOT AI.',
      },
      {
        question: 'How many characters fit per card in a Threads thread?',
        answer: 'Each post card in a chain supports up to 500 characters.',
      },
      {
        question: 'Does this connect or auto-post to Threads?',
        answer: 'No. Zero social login is needed.',
      },
      {
        question: 'Need stronger openers for card #1?',
        answer: 'Use Threads Hook Generator.',
      },
    ],
    relatedTools: [
      'threads-post-generator',
      'threads-hook-generator',
      'threads-character-counter',
      'threads-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-caption-generator',
    name: 'Threads Caption Generator',
    slug: 'threads-caption-generator',
    category: 'threads-tools',
    url: '/threads-caption-generator',
    description: 'Write concise photo, carousel & quote captions for Threads via browser templates (not AI).',
    longDescription:
      'Pair Threads photos or carousels with natural, conversation-inviting text instead of formal Instagram hashtags. Formats compact 1- to 3-line captions inside your browser using structured templates—NOT AI and zero social login.',
    keywords: ['threads caption generator', 'threads photo caption', 'casual threads caption not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create conversational Threads photo & carousel captions from editable browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Describe photo mood or context',
        description: 'Enter what your photo shows and the vibe (behind-the-scenes, quick tip, update).',
      },
      {
        title: 'Pick a caption template',
        description: 'Templates add light conversational prompts and clean spacing under 500 characters (NOT AI).',
      },
      {
        title: 'Copy alongside your resized photo',
        description: 'Pair with Threads Post Image Resizer before sharing.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Caption Generator use AI?',
        answer: 'No. Captions are assembled strictly from customizable browser templates—NOT AI.',
      },
      {
        question: 'Do Threads captions rely heavily on hashtags?',
        answer: 'No. Threads focuses on natural conversational text and optional single topic tags rather than hashtag blocks.',
      },
      {
        question: 'Does it track Threads’ 500-character post limit?',
        answer: 'Yes. Live counting verifies every template stays comfortably under 500 characters.',
      },
      {
        question: 'Is any login required?',
        answer: 'No. Runs client-side with zero account sign-in.',
      },
    ],
    relatedTools: [
      'threads-post-generator',
      'threads-post-image-resizer',
      'threads-hashtag-generator',
      'threads-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-hashtag-generator',
    name: 'Threads Hashtag Generator',
    slug: 'threads-hashtag-generator',
    category: 'threads-tools',
    url: '/threads-hashtag-generator',
    description: 'Format concise Threads topic tags & 1-tag labels via keyword templates (not AI).',
    longDescription:
      'Keep Threads posts clean with 1–2 focused topic tags matching Threads’ native single-tag design. Threads Hashtag Generator formats clean topic tags from your keywords via local browser templates—NOT AI and zero login.',
    keywords: ['threads hashtag generator', 'threads topic tag builder', 'single topic tag threads not ai'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Hashtag Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build clean Threads topic tags from your niche keywords using deterministic browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter topic or community keyword',
        description: 'Input your main subject word.',
      },
      {
        title: 'Generate concise tag templates',
        description: 'Browser rules format clean single-phrase topic tags suited to Threads (NOT AI).',
      },
      {
        title: 'Pick 1 primary tag',
        description: 'Copy 1 crisp topic tag directly into your Threads post.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Hashtag Generator use AI?',
        answer: 'No. It formats keyword combinations strictly from curated browser templates—NOT AI.',
      },
      {
        question: 'How many tags work best on Threads?',
        answer: 'Threads encourages 1 clean topic tag per post rather than long lists of hashtags.',
      },
      {
        question: 'Does this scrape live trending topics on Threads?',
        answer: 'No. Formatting runs completely locally in your browser without social login.',
      },
      {
        question: 'Need a full post template too?',
        answer: 'Open Threads Post Generator.',
      },
    ],
    relatedTools: [
      'threads-post-generator',
      'threads-caption-generator',
      'threads-character-counter',
      'threads-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-hook-generator',
    name: 'Threads Hook Generator',
    slug: 'threads-hook-generator',
    category: 'threads-tools',
    url: '/threads-hook-generator',
    description: 'Build strong first-line Threads conversation openers via editable templates (not AI).',
    longDescription:
      'Make readers stop scrolling and tap Reply. Threads Hook Generator converts your topic into curiosity, contrarian, practical-lesson, and honest-question opener lines using browser templates—NOT AI and zero login required.',
    keywords: ['threads hook generator', 'threads opening line', 'reply hook templates not ai'],
    icon: 'Zap',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Hook Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate crisp Threads opening lines and reply hooks using local browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter topic or common misconception',
        description: 'Input what people overlook or ask most in your niche.',
      },
      {
        title: 'Choose hook template framework',
        description: 'Applies proven conversational opener patterns deterministically (NOT AI).',
      },
      {
        title: 'Expand into a post or thread',
        description: 'Send your favorite opener into Threads Post Generator or Threads Thread Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Hook Generator use AI?',
        answer: 'No. Hooks use structured fill-in sentence formulas in your browser—NOT AI.',
      },
      {
        question: 'How long should a Threads hook line be?',
        answer: 'Keep the opening line under ~100 characters so it punches immediately in mobile feeds.',
      },
      {
        question: 'Does this guarantee higher engagement?',
        answer: 'No. Engagement depends on authentic conversation value and audience interest.',
      },
      {
        question: 'Is any social login needed?',
        answer: 'No. Runs locally in your browser.',
      },
    ],
    relatedTools: [
      'threads-post-generator',
      'threads-thread-generator',
      'threads-post-idea-generator',
      'threads-quote-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-post-idea-generator',
    name: 'Threads Post Idea Generator',
    slug: 'threads-post-idea-generator',
    category: 'threads-tools',
    url: '/threads-post-idea-generator',
    description: 'Generate daily conversational Threads prompts from niche templates in browser (not AI).',
    longDescription:
      'Keep your Threads account active with conversation-first prompts built around Q&As, quick polls, unpopular takes, and build-in-public check-ins. Strictly template-based inside your browser—NOT AI and zero login.',
    keywords: ['threads post idea generator', 'threads daily prompts', 'threads topic ideas not ai'],
    icon: 'BookOpen',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Post Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Brainstorm conversational Threads post prompts using editable browser templates (NOT AI). No social login.',
    howTo: [
      {
        title: 'Enter niche or creator style',
        description: 'Input your topic words and target community.',
      },
      {
        title: 'Mix discussion prompt templates',
        description: 'Browser presets map your topic across Q&A, Debate, Tip, and Milestone prompts (NOT AI).',
      },
      {
        title: 'Schedule across the week',
        description: 'Export favorite ideas into Threads Content Calendar Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Post Idea Generator use AI?',
        answer: 'No. Prompts come strictly from structured browser templates—NOT AI.',
      },
      {
        question: 'What kind of posts perform cleanly on Threads?',
        answer: 'Short honest questions, relatable work observations, and quick polls invite natural replies.',
      },
      {
        question: 'Does this log into Threads or Instagram?',
        answer: 'No. Zero social login required.',
      },
      {
        question: 'Want poll ideas specifically?',
        answer: 'Open Threads Poll Generator.',
      },
    ],
    relatedTools: [
      'threads-content-calendar-generator',
      'threads-post-generator',
      'threads-hook-generator',
      'threads-poll-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-reply-generator',
    name: 'Threads Reply Generator',
    slug: 'threads-reply-generator',
    category: 'threads-tools',
    url: '/threads-reply-generator',
    description: 'Draft friendly, engaging Threads replies under 500 characters via templates (not AI).',
    longDescription:
      'Keep community conversations going on your Threads posts with warm, specific follow-ups instead of dead-end replies. Built strictly from editable browser templates—NOT AI and zero Threads login.',
    keywords: ['threads reply generator', 'threads response templates', 'conversational reply builder not ai'],
    icon: 'Reply',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Reply Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Write friendly Threads conversation replies within 500 characters using browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Choose reply situation',
        description: 'Pick thank-you + follow-up question, clarification, resource share, or playful banter.',
      },
      {
        title: 'Customize template wording',
        description: 'Templates keep replies concise, human, and well within 500 characters (NOT AI).',
      },
      {
        title: 'Copy & reply on Threads',
        description: 'Paste manually inside Threads with zero account connection.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Reply Generator use AI?',
        answer: 'No. It provides structured conversational reply templates in your browser—NOT AI.',
      },
      {
        question: 'Does this auto-reply to mentions?',
        answer: 'No. None of these tools require social login or automate posting.',
      },
      {
        question: 'Looking to comment thoughtfully on others’ Threads too?',
        answer: 'Try Threads Comment Generator.',
      },
      {
        question: 'Is there any usage limit?',
        answer: 'No. Free anytime.',
      },
    ],
    relatedTools: [
      'threads-comment-generator',
      'threads-post-generator',
      'threads-character-counter',
      'threads-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-comment-generator',
    name: 'Threads Comment Generator',
    slug: 'threads-comment-generator',
    category: 'threads-tools',
    url: '/threads-comment-generator',
    description: 'Organize genuine conversation-adding Threads comments via local templates (not AI).',
    longDescription:
      'Join relevant Threads discussions meaningfully with perspective-adding, question-asking, or resource-sharing comment templates inside 500 characters. Runs strictly on browser templates—NOT AI and no social login.',
    keywords: ['threads comment generator', 'threads discussion starters', 'networking comments not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draft genuine conversation-adding Threads comments from editable browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Pick comment angle',
        description: 'Choose shared experience, thoughtful counter-point, or follow-up question.',
      },
      {
        title: 'Insert your point',
        description: 'Browser templates combine your input clearly inside 500 characters (NOT AI).',
      },
      {
        title: 'Personalize & post manually',
        description: 'Copy clean draft text into Threads directly.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Comment Generator use AI?',
        answer: 'No. All prompts are strictly template-based inside your browser—NOT AI.',
      },
      {
        question: 'Does this connect to Threads automatically?',
        answer: 'No. Zero social login is required.',
      },
      {
        question: 'How many characters can a Threads comment hold?',
        answer: 'Replies on Threads follow the same 500-character limit as standalone posts.',
      },
      {
        question: 'Need quick replies for people messaging your own Threads?',
        answer: 'Open Threads Reply Generator.',
      },
    ],
    relatedTools: [
      'threads-reply-generator',
      'threads-post-generator',
      'threads-character-counter',
      'threads-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-stylish-text-generator',
    name: 'Threads Stylish Text Generator',
    slug: 'threads-stylish-text-generator',
    category: 'threads-tools',
    url: '/threads-stylish-text-generator',
    description: 'Style Threads bios & short callouts with Unicode symbol templates in browser (not AI).',
    longDescription:
      'Give Threads bio headers and milestone shoutouts clean decorative Unicode styling, minimal dividers, and brackets directly inside your browser. Deterministic character mapping and template frames—NOT AI and no login required.',
    keywords: ['threads stylish text generator', 'fancy threads bio text', 'unicode threads symbols not ai'],
    icon: 'Sparkles',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Style Threads profile bios and headers with Unicode symbol templates locally in browser (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Type short title or bio text',
        description: 'Enter your profile line or divider header.',
      },
      {
        title: 'Select Unicode symbol template',
        description: 'Applies deterministic Unicode frames, spacing, and subtle dividers (NOT AI).',
      },
      {
        title: 'Verify bio length & copy',
        description: 'Check character count under 150 chars for bios or 500 chars for posts.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Stylish Text Generator use AI?',
        answer: 'No. It uses deterministic Unicode character tables and symbol templates—NOT AI.',
      },
      {
        question: 'Will decorative text affect searchability on Threads?',
        answer: 'Threads indexes standard ASCII words best, so keep searchable keywords plain and style only accents.',
      },
      {
        question: 'Does this require signing into Threads?',
        answer: 'No. Runs 100% locally in your browser.',
      },
      {
        question: 'Want pure serif/bold/italic fonts without symbol borders?',
        answer: 'Try Threads Font Generator.',
      },
    ],
    relatedTools: [
      'threads-font-generator',
      'threads-bio-generator',
      'threads-bio-character-counter',
      'threads-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-font-generator',
    name: 'Threads Font Generator',
    slug: 'threads-font-generator',
    category: 'threads-tools',
    url: '/threads-font-generator',
    description: 'Convert text into copy-paste Unicode bold, italic & serif styles for Threads (not AI).',
    longDescription:
      'Highlight key phrases in Threads bios or announcement headers with clean copy-paste Unicode typography presets inside your browser. Deterministic glyph mapping and template presets—NOT AI and zero social login.',
    keywords: ['threads font generator', 'bold italic threads text', 'unicode copy paste fonts not ai'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Font Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert plain text to copy-paste Unicode bold, serif, italic & monospace styles for Threads in browser (NOT AI).',
    howTo: [
      {
        title: 'Enter short text to style',
        description: 'Type a headline, role tag, or post subheader.',
      },
      {
        title: 'Pick a Unicode font preset',
        description: 'Instant local conversion outputs sans-bold, serif, italic, and monospace styles (NOT AI).',
      },
      {
        title: 'Copy cleanly to Threads',
        description: 'Paste straight into Threads posts or Edit Profile with zero login.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Font Generator use AI?',
        answer: 'No. It uses fixed Unicode lookup tables and style templates inside your browser—NOT AI.',
      },
      {
        question: 'Do Unicode styled letters count differently in Threads character limits?',
        answer: 'Some mathematical Unicode symbols count as 2 UTF-16 code units, so inspect totals in Threads Character Counter.',
      },
      {
        question: 'Is any account login required?',
        answer: 'No. Runs privately in your browser.',
      },
      {
        question: 'Need decorative symbol dividers too?',
        answer: 'Use Threads Stylish Text Generator.',
      },
    ],
    relatedTools: [
      'threads-stylish-text-generator',
      'threads-character-counter',
      'threads-bio-character-counter',
      'threads-quote-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-character-counter',
    name: 'Threads Character Counter',
    slug: 'threads-character-counter',
    category: 'threads-tools',
    url: '/threads-character-counter',
    description: 'Measure draft posts & replies cleanly against Threads’ exact 500-character limit locally.',
    longDescription:
      'Draft punchy Threads posts without getting stopped at character 501. Paste any post or reply draft into Threads Character Counter to track exact characters out of 500, word count, and line count locally—no login required.',
    keywords: ['threads character counter', '500 character limit threads', 'threads post length'],
    icon: 'Ruler',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check draft Threads posts and replies against the 500-character limit instantaneously in your browser.',
    howTo: [
      {
        title: 'Type or paste draft post',
        description: 'Paste your draft text, links, and line breaks inside the browser editor.',
      },
      {
        title: 'Track 500-character meter',
        description: 'Displays remaining characters out of 500 and highlights excess text cleanly.',
      },
      {
        title: 'Split overflow into a thread',
        description: 'Send multi-card text to Threads Thread Generator if your thought needs >500 characters.',
      },
    ],
    faqs: [
      {
        question: 'What is Threads’ post character limit?',
        answer: 'Each Threads post and reply supports up to 500 characters.',
      },
      {
        question: 'Does this check my profile bio 150-character limit too?',
        answer: 'Use Threads Bio Character Counter for dedicated 150-character bio checks.',
      },
      {
        question: 'Does this connect to Threads or Instagram?',
        answer: 'No. Zero social login is needed.',
      },
      {
        question: 'Is any pasted text stored?',
        answer: 'No. Counting stays inside your browser tab.',
      },
    ],
    relatedTools: [
      'threads-bio-character-counter',
      'threads-thread-generator',
      'threads-post-generator',
      'threads-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-engagement-rate-calculator',
    name: 'Threads Engagement Rate Calculator',
    slug: 'threads-engagement-rate-calculator',
    category: 'threads-tools',
    url: '/threads-engagement-rate-calculator',
    description: 'Compute Threads engagement rate by views or followers locally with transparent math.',
    longDescription:
      'Benchmark how well your Threads posts spark likes, replies, reposts, and quotes relative to views or follower count. Instant browser math with zero Threads/Meta account login required.',
    keywords: ['threads engagement rate calculator', 'threads views engagement ratio', 'reply rate formula'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate Threads engagement rate by views or followers instantaneously in your browser. Zero login needed.',
    howTo: [
      {
        title: 'Enter likes, replies, reposts & quotes',
        description: 'Input interaction totals from Threads Insights or recent post averages.',
      },
      {
        title: 'Add views or followers',
        description: 'Switch cleanly between View-based ER% and Follower-based ER%.',
      },
      {
        title: 'Inspect engagement breakdown',
        description: 'View exact numerator/denominator percentages inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch my Threads Insights automatically?',
        answer: 'No. Calculations run strictly from the numbers you enter—zero social login.',
      },
      {
        question: 'Why pay special attention to replies and quotes on Threads?',
        answer: 'Threads prioritizes conversation signals, making reply-to-view ratio a strong health metric.',
      },
      {
        question: 'Can I plan conversation-first schedules alongside this?',
        answer: 'Yes. Open Threads Content Calendar Generator.',
      },
      {
        question: 'Is it free?',
        answer: 'Yes. Instant client-side calculation.',
      },
    ],
    relatedTools: [
      'threads-content-calendar-generator',
      'threads-post-generator',
      'threads-poll-generator',
      'threads-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-content-calendar-generator',
    name: 'Threads Content Calendar Generator',
    slug: 'threads-content-calendar-generator',
    category: 'threads-tools',
    url: '/threads-content-calendar-generator',
    description: 'Build an editable weekly Threads posting schedule using local browser templates (not AI).',
    longDescription:
      'Keep your Threads conversation steady with a weekly cadence mixing quick questions, polls, photo updates, and multi-card mini threads. Uses rotating pillar templates in your browser—NOT AI and zero Threads login or auto-posting.',
    keywords: ['threads content calendar generator', 'threads weekly planner', 'threads schedule template not ai'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate an editable weekly Threads post & poll calendar using browser templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter 3–4 conversation pillars & pace',
        description: 'Input topic themes and target weekly Threads frequency.',
      },
      {
        title: 'Generate format rotation',
        description: 'Templates alternate quick prompts, polls, photo posts, and connected threads (NOT AI).',
      },
      {
        title: 'Export CSV/Markdown plan',
        description: 'Save your schedule offline—zero social login required.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Content Calendar Generator use AI?',
        answer: 'No. Schedules are generated deterministically from editable pillar templates—NOT AI.',
      },
      {
        question: 'Can this tool publish posts automatically to Threads?',
        answer: 'No. Zero Threads/Instagram login or auto-posting is connected.',
      },
      {
        question: 'Need post ideas to fill the calendar slots?',
        answer: 'Open Threads Post Idea Generator.',
      },
      {
        question: 'Is there any usage cap?',
        answer: 'No. Free anytime.',
      },
    ],
    relatedTools: [
      'threads-post-idea-generator',
      'threads-thread-generator',
      'threads-poll-generator',
      'threads-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-poll-generator',
    name: 'Threads Poll Generator',
    slug: 'threads-poll-generator',
    category: 'threads-tools',
    url: '/threads-poll-generator',
    description: 'Design balanced 2–4 option Threads polls inside character limits via templates (not AI).',
    longDescription:
      'Spark instant taps on Threads with crisp poll questions and balanced 2–4 button labels under Threads’ option character caps. Strictly template-based inside your browser—NOT AI and zero social login required.',
    keywords: ['threads poll generator', 'threads poll templates', 'poll question builder not ai'],
    icon: 'ListChecks',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Poll Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build 2–4 option Threads polls inside exact question & option character caps via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter poll question & choices',
        description: 'Enter your prompt and 2–4 short answer options.',
      },
      {
        title: 'Verify concise button formatting',
        description: 'Templates check option balance and clear wording inside 25-character button caps (NOT AI).',
      },
      {
        title: 'Copy into Threads poll composer',
        description: 'Paste manually when starting a new Poll on Threads.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Poll Generator use AI?',
        answer: 'No. Polls are formatted from structured templates locally in your browser—NOT AI.',
      },
      {
        question: 'How many options does a Threads poll support?',
        answer: 'Threads polls support 2 to 4 concise answer options (up to 25 characters each).',
      },
      {
        question: 'Does it connect to my Threads profile?',
        answer: 'No. Zero social login is needed.',
      },
      {
        question: 'Want more discussion ideas beyond polls?',
        answer: 'Use Threads Post Idea Generator.',
      },
    ],
    relatedTools: [
      'threads-post-idea-generator',
      'threads-character-counter',
      'threads-engagement-rate-calculator',
      'threads-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-quote-generator',
    name: 'Threads Quote Generator',
    slug: 'threads-quote-generator',
    category: 'threads-tools',
    url: '/threads-quote-generator',
    description: 'Format relatable creator quotes, insights & short notes for Threads via templates (not AI).',
    longDescription:
      'Share crisp reminders, attributed book quotes, or two-line founder lessons cleanly within 500 characters on Threads. Uses clean layout and attribution templates in your browser—NOT AI and zero social login.',
    keywords: ['threads quote generator', 'threads short quotes', 'insight formatter not ai'],
    icon: 'Quote',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Quote Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format relatable quotes, book excerpts, and insights under 500 chars for Threads via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter insight or cited quote',
        description: 'Input your core takeaway and optional author/source line.',
      },
      {
        title: 'Select quote layout template',
        description: 'Applies clean contrast spacing and attribution dashes deterministically (NOT AI).',
      },
      {
        title: 'Check 500-char limit & copy',
        description: 'Paste cleanly into Threads with zero account connection.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Quote Generator generate quotes with AI?',
        answer: 'No. It formats your own insights or attributed quotes using clean local templates—NOT AI.',
      },
      {
        question: 'Does it verify the 500-character Threads limit?',
        answer: 'Yes. Every formatted quote checks character length out of 500.',
      },
      {
        question: 'Can I turn a quote into a visual 1080x1080 image?',
        answer: 'Prepare crisp square or portrait images in Threads Post Image Resizer.',
      },
      {
        question: 'Is any social login required?',
        answer: 'No. Runs 100% client-side.',
      },
    ],
    relatedTools: [
      'threads-character-counter',
      'threads-font-generator',
      'threads-post-generator',
      'threads-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-profile-picture-resizer',
    name: 'Threads Profile Picture Resizer',
    slug: 'threads-profile-picture-resizer',
    category: 'threads-tools',
    url: '/threads-profile-picture-resizer',
    description: 'Resize Threads & paired Instagram avatars to crisp square specs with circle preview—no watermark.',
    longDescription:
      'Prepare crisp square 320x320 / 400x400 / 1080x1080 profile avatars with an accurate circular crop preview so faces and logos sit centered on Threads. Processes JPG, PNG, or WEBP files up to 20 MB locally—zero watermarks and zero login.',
    keywords: ['threads profile picture resizer', 'threads avatar resizer', '320x320 square no watermark'],
    icon: 'CircleUserRound',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Threads Profile Picture Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize Threads profile avatars to crisp square dimensions with circle-crop preview in browser. Zero watermarks.',
    howTo: [
      {
        title: 'Load avatar photo (max 20 MB)',
        description: 'Open a JPG, PNG, or WEBP photo directly inside your browser.',
      },
      {
        title: 'Center inside circle preview',
        description: 'Pan and zoom cleanly inside circular guides matching Threads profile display.',
      },
      {
        title: 'Download clean square image',
        description: 'Save unwatermarked PNG/JPG artwork instantaneously.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Profile Picture Resizer add a watermark?',
        answer: 'No. Every Threads tool exports 100% clean, unwatermarked files.',
      },
      {
        question: 'What sizes does it export?',
        answer: 'Supports crisp 320x320, 400x400, and 1080x1080 square avatar presets.',
      },
      {
        question: 'Are photos uploaded anywhere?',
        answer: 'No. Canvas resizing stays on your own device.',
      },
      {
        question: 'Want to resize feed & carousel photos too?',
        answer: 'Open Threads Post Image Resizer.',
      },
    ],
    relatedTools: [
      'threads-post-image-resizer',
      'threads-bio-generator',
      'threads-bio-character-counter',
      'threads-username-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-post-image-resizer',
    name: 'Threads Post Image Resizer',
    slug: 'threads-post-image-resizer',
    category: 'threads-tools',
    url: '/threads-post-image-resizer',
    description: 'Resize Threads photos & carousels to crisp 1080x1350, 1080x1080 & 1080x1920—no watermark.',
    longDescription:
      'Keep single photos and multi-image Threads carousels sharp without awkward feed crops. Resize JPG, PNG, or WEBP files up to 20 MB to crisp portrait (1080x1350 / 1080x1920) or square (1080x1080) presets locally—zero watermarks.',
    keywords: ['threads post image resizer', 'threads carousel photo size', '1080x1350 threads no watermark'],
    icon: 'Image',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Threads Post Image Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize Threads post and carousel photos to 1080x1350, 1080x1080, or 1080x1920 in browser. Zero watermarks.',
    howTo: [
      {
        title: 'Choose photo (max 20 MB)',
        description: 'Open a JPG, PNG, or WEBP photo inside your browser.',
      },
      {
        title: 'Pick 1080x1350, 1080x1080, or 1080x1920',
        description: 'Frame portrait, square, or vertical aspect cleanly with crop or padded margins.',
      },
      {
        title: 'Save clean unwatermarked image',
        description: 'Download crisp output ready for Threads posts or carousels.',
      },
    ],
    faqs: [
      {
        question: 'Does Threads Post Image Resizer add a watermark?',
        answer: 'No. Every Threads tool produces completely unwatermarked images.',
      },
      {
        question: 'What aspect ratio works nicely in Threads carousels?',
        answer: 'Portrait 1080x1350 (4:5) and square 1080x1080 keep swipeable carousel cards crisp and consistent.',
      },
      {
        question: 'What file limit applies?',
        answer: 'Up to 20 MB per image, running privately inside your browser.',
      },
      {
        question: 'Need a matching casual photo caption?',
        answer: 'Use Threads Caption Generator.',
      },
    ],
    relatedTools: [
      'threads-profile-picture-resizer',
      'threads-caption-generator',
      'threads-post-generator',
      'threads-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'threads-bio-character-counter',
    name: 'Threads Bio Character Counter',
    slug: 'threads-bio-character-counter',
    category: 'threads-tools',
    url: '/threads-bio-character-counter',
    description: 'Verify Threads profile bios cleanly against the exact 150-character limit locally.',
    longDescription:
      'Check every word, emoji, and line break in your Threads bio before saving Edit Profile. Counts characters, lines, and UTF-16 emoji weighting strictly against Threads’ 150-character bio cap in your browser—zero login required.',
    keywords: ['threads bio character counter', '150 char threads bio limit', 'threads profile bio counter'],
    icon: 'Ruler',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Threads Bio Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Measure Threads profile bios against the exact 150-character limit instantaneously in your browser. Zero login.',
    howTo: [
      {
        title: 'Type or paste draft Threads bio',
        description: 'Write your profile bio lines with emojis or dividers.',
      },
      {
        title: 'Inspect 150-character meter',
        description: 'Shows exact count remaining out of 150 and highlights any Unicode double-unit characters.',
      },
      {
        title: 'Copy trimmed bio',
        description: 'Paste cleanly into Threads Edit Profile without social login.',
      },
    ],
    faqs: [
      {
        question: 'What is Threads’ exact profile bio character limit?',
        answer: 'Threads profile bios allow up to 150 characters.',
      },
      {
        question: 'Do emojis take up more than 1 character?',
        answer: 'Yes—most emojis and styled Unicode fonts count as 2 characters in strict 150-character fields.',
      },
      {
        question: 'Need template bio ideas first?',
        answer: 'Try Threads Bio Generator.',
      },
      {
        question: 'Is any Threads login needed?',
        answer: 'No. Counting runs 100% locally in your browser.',
      },
    ],
    relatedTools: [
      'threads-bio-generator',
      'threads-character-counter',
      'threads-stylish-text-generator',
      'threads-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
