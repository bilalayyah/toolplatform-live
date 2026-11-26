import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const FACEBOOK_TOOLS: readonly Tool[] = [
  {
    id: 'facebook-cover-photo-resizer',
    name: 'Facebook Cover Photo Resizer',
    slug: 'facebook-cover-photo-resizer',
    category: 'facebook-tools',
    url: '/facebook-cover-photo-resizer',
    description: 'Resize and crop wide banners to Facebook’s 820x312 desktop cover photo dimensions cleanly.',
    longDescription:
      'Prevent Facebook from stretching or clipping faces on Page and profile headers. Facebook Cover Photo Resizer crops and scales JPG, PNG, and WebP photos up to 20 MB inside your browser to exact 820x312 pixels with optional mobile-safe zone guides and zero watermarks.',
    keywords: ['facebook cover photo resizer', 'resize fb banner 820x312', 'facebook cover size'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Cover Photo Resizer — 820x312 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Cover Photo Resizer frames photos cleanly to 820x312 desktop dimensions inside your browser. Zero watermark.',
    howTo: [
      {
        title: 'Choose your banner photo',
        description: 'Open a JPG, PNG, or WebP photo up to 20 MB inside your browser.',
      },
      {
        title: 'Frame within 820x312 & safe zones',
        description: 'Crop or fit to 820x312 while previewing mobile-safe center zone guides.',
      },
      {
        title: 'Download unwatermarked cover',
        description: 'Save a crisp 820x312 JPG or PNG ready to upload to your Facebook profile or Page.',
      },
    ],
    faqs: [
      {
        question: 'What dimensions are used by Facebook Cover Photo Resizer?',
        answer: 'Exports at Facebook’s recommended 820x312 pixel desktop cover dimensions with optional mobile-safe center zone preview guides.',
      },
      {
        question: 'Does this add a watermark?',
        answer: 'No. Output downloads carry zero watermarks.',
      },
      {
        question: 'Want to compose text or branded layers over a cover?',
        answer: 'Try Facebook Cover Photo Maker.',
      },
      {
        question: 'Does resizing happen strictly on my device?',
        answer: 'Yes. HTML5 Canvas processes your image locally in the browser.',
      },
    ],
    relatedTools: [
      'facebook-cover-photo-maker',
      'facebook-profile-picture-resizer',
      'facebook-post-image-resizer',
      'facebook-image-compressor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-profile-picture-resizer',
    name: 'Facebook Profile Picture Resizer',
    slug: 'facebook-profile-picture-resizer',
    category: 'facebook-tools',
    url: '/facebook-profile-picture-resizer',
    description: 'Resize and center avatars to Facebook’s 170x170 profile display size with circular preview in your browser.',
    longDescription:
      'Facebook displays profile photos at 170x170 pixels on desktop and crops them into circles across comments, Pages, and Messenger. Facebook Profile Picture Resizer crops or fits JPG, PNG, and WebP photos up to 10 MB inside your browser to exact 170x170 pixels with circular mask preview and zero watermarks.',
    keywords: ['facebook profile picture resizer', 'fb dp resizer', 'facebook avatar cropper'],
    icon: 'CircleUserRound',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Profile Picture Resizer — 170x170 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Profile Picture Resizer crops or fits avatars cleanly to 170x170 px with circular mask preview locally in your browser.',
    howTo: [
      {
        title: 'Load your portrait or logo',
        description: 'Select a JPG, PNG, or WebP file up to 10 MB inside your browser.',
      },
      {
        title: 'Choose Crop vs Fit & circular guide',
        description: 'Switch between center square crop or fit with padding and toggle the circular feed preview.',
      },
      {
        title: 'Save unwatermarked 170x170 avatar',
        description: 'Download a crisp 170x170 PNG or JPG ready for Facebook.',
      },
    ],
    faqs: [
      {
        question: 'Why show a circular overlay when Facebook uploads expect square files?',
        answer: 'Facebook stores a square file while masking it as a circle in feeds and Messenger—the guide prevents edge text from getting clipped.',
      },
      {
        question: 'Will exported profile photos include a watermark?',
        answer: 'No. Outputs are 100% unwatermarked.',
      },
      {
        question: 'Does this automatically remove image backgrounds?',
        answer: 'No. For colored round backgrounds check Profile Photo Maker under Image Tools.',
      },
      {
        question: 'Does it work locally without uploads?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-cover-photo-resizer',
      'profile-photo',
      'facebook-image-resizer',
      'facebook-page-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-bio-generator',
    name: 'Facebook Bio Generator',
    slug: 'facebook-bio-generator',
    category: 'facebook-tools',
    url: '/facebook-bio-generator',
    description: 'Build a clear 101-character Facebook profile intro bio using browser templates (not AI).',
    longDescription:
      'Summarize what you do cleanly inside Facebook’s concise 101-character Intro Bio box. Facebook Bio Generator is strictly template-based inside your browser (NOT AI-written)—combining your role, tagline, or website hook into structured variations with live 101-char tracking.',
    keywords: ['facebook bio generator', 'fb profile intro bio', '101 char facebook bio'],
    icon: 'Facebook',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Bio Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Bio Generator builds crisp 101-character profile intro bios via browser templates (NOT AI). Free, no login.',
    howTo: [
      {
        title: 'Enter role, niche & short link CTA',
        description: 'Enter descriptive words about your role, offering, or community.',
      },
      {
        title: 'Format with concise templates',
        description: 'Browser formulas shape clean one-line and two-line bios (NOT AI).',
      },
      {
        title: 'Copy within 101 characters',
        description: 'Verify the character counter and paste into your Facebook Intro bio.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Bio Generator use AI?',
        answer: 'No. It uses deterministic fill-in-the-blank templates inside your browser—NOT AI.',
      },
      {
        question: 'How long can a Facebook personal profile bio be?',
        answer: 'Facebook caps personal profile Intro bios at 101 characters.',
      },
      {
        question: 'Need a longer Business Page About bio instead?',
        answer: 'Use Facebook Page Bio Generator.',
      },
      {
        question: 'Are my inputs saved anywhere?',
        answer: 'No. Runs strictly inside your browser tab.',
      },
    ],
    relatedTools: [
      'facebook-page-bio-generator',
      'facebook-character-counter',
      'facebook-username-generator',
      'instagram-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-username-generator',
    name: 'Facebook Username Generator',
    slug: 'facebook-username-generator',
    category: 'facebook-tools',
    url: '/facebook-username-generator',
    description: 'Format valid 5–50 char vanity Page & profile usernames from brand templates (not AI).',
    longDescription:
      'Create a clean facebook.com/YourName vanity URL without disallowed symbols or length errors. Facebook Username Generator is strictly template- and rule-based inside your browser (NOT AI-written)—generating clean alphanumeric and period-separated handle drafts.',
    keywords: ['facebook username generator', 'fb vanity url generator', 'facebook page @username'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Username Generator creates clean 5–50 char vanity username ideas from templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter name or Page keywords',
        description: 'Enter your business or creator keywords inside your browser.',
      },
      {
        title: 'Apply Facebook handle rules',
        description: 'Templates format alphanumeric and period-separated variations at least 5 chars long (NOT AI).',
      },
      {
        title: 'Copy candidate vanity URLs',
        description: 'Check live Page/Profile availability directly inside Facebook settings.',
      },
    ],
    faqs: [
      {
        question: 'Does this check real live availability on Facebook?',
        answer: 'No. It formats handle templates locally against Facebook syntax rules (at least 5 characters, alphanumeric + periods only) and cannot query Facebook.',
      },
      {
        question: 'Does Facebook allow underscores in usernames?',
        answer: 'No—unlike Instagram, Facebook usernames allow letters, numbers, and periods, never underscores.',
      },
      {
        question: 'Is this tool AI-powered?',
        answer: 'No. Purely rule- and template-based in your browser.',
      },
      {
        question: 'Looking for Facebook Page display names instead?',
        answer: 'Use Facebook Page Name Generator.',
      },
    ],
    relatedTools: [
      'facebook-page-name-generator',
      'facebook-group-name-generator',
      'facebook-bio-generator',
      'instagram-username-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-page-name-generator',
    name: 'Facebook Page Name Generator',
    slug: 'facebook-page-name-generator',
    category: 'facebook-tools',
    url: '/facebook-page-name-generator',
    description:
      'Create catchy brand-style Facebook Page names from your keyword, category, and tone inside your browser (not AI).',
    longDescription:
      'Build memorable 1–4 word brand-style Facebook Page names directly inside your browser without AI or sign-up. Enter your core keyword, pick one of 16 Page categories, choose a tone and naming style, add an optional city or words to avoid, and export or check names on Facebook.',
    keywords: ['facebook page name generator', 'fb business page names', 'page name ideas'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: 'Facebook Page Name Generator – Free Name Ideas',
    seoDescription:
      'Create catchy brand-style Facebook Page names from your keyword. Pick a category and tone, copy names instantly. Free, no sign-up, no AI.',
    howTo: [
      {
        title: 'Enter keyword & category',
        description:
          'Type a 2–40 character keyword and choose one of 16 Facebook Page categories.',
      },
      {
        title: 'Pick tone, style & options',
        description:
          'Select a tone chip and naming style, or expand More options for length, location, and words to avoid.',
      },
      {
        title: 'Copy, star, or check on Facebook',
        description:
          'Copy individual names or the full list, download .txt, star favourites, or search Facebook in a new tab.',
      },
    ],
    faqs: [
      {
        question: 'Is this tool AI-powered?',
        answer:
          'No. It combines your keyword with fixed word lists and patterns and ranks the results with simple rules, so the same inputs give the same first results.',
      },
      {
        question: 'How long should a Page name be?',
        answer:
          'Short and clear, usually 2 to 4 words. This tool keeps names within 40 characters so they stay readable on mobile. Facebook makes the final decision when it reviews a name.',
      },
      {
        question: 'Can I use emojis or special characters?',
        answer:
          "No. Facebook's guidelines discourage special characters, unnecessary symbols, emojis, excessive capital letters and excessive punctuation, so the tool outputs clean text.",
      },
      {
        question: 'Can I add Official or Facebook to the name?',
        answer:
          'No. Facebook does not allow variations of Facebook or Official in Page names, so the tool blocks them.',
      },
      {
        question: 'Does the tool check if a name is available?',
        answer:
          "No tool can promise that without Facebook's own systems. Use the Check on Facebook button on each name to search in a new tab.",
      },
      {
        question: 'Can I change the name later?',
        answer:
          'Usually yes, but Facebook limits how often a name can change and reviews each request without a guaranteed time frame.',
      },
      {
        question: "My keyword is another company's brand. Is that allowed?",
        answer:
          'Facebook does not allow names that mislead people into thinking an unofficial Page is connected to a brand, and trademarked terms need permission. Words such as Fans or Community make a fan Page clear. This is general information, not legal advice.',
      },
    ],
    relatedTools: [
      'facebook-group-name-generator',
      'facebook-username-generator',
      'facebook-page-bio-generator',
      'facebook-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-post-caption-generator',
    name: 'Facebook Post Caption Generator',
    slug: 'facebook-post-caption-generator',
    category: 'facebook-tools',
    url: '/facebook-post-caption-generator',
    description: 'Assemble shareable Facebook feed post captions from engagement templates (not AI).',
    longDescription:
      'Write clearer product updates, milestone announcements, and discussion posts for your Page or profile. Facebook Post Caption Generator is strictly template-based inside your browser—NOT AI-written—formatting hooks, story points, and comment prompts cleanly.',
    keywords: ['facebook post caption generator', 'fb caption templates', 'facebook post builder'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Post Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Post Caption Generator builds structured discussion and update posts from browser templates (NOT AI).',
    howTo: [
      {
        title: 'Choose post type & enter main message',
        description: 'Enter your topic, select tone & goal, and include optional hashtag preferences.',
      },
      {
        title: 'Populate structured template',
        description: 'Your inputs slot into clear multi-paragraph layouts locally in your browser (NOT AI).',
      },
      {
        title: 'Copy & preview feed layout',
        description: 'Verify length and preview before publishing on Facebook.',
      },
    ],
    faqs: [
      {
        question: 'Are captions written by AI?',
        answer: 'No. Outputs are constructed from editable editorial templates inside your browser—NOT AI-written.',
      },
      {
        question: 'Where should links sit in Facebook posts?',
        answer: 'Templates include layouts for putting links inline or referencing a pinned first comment.',
      },
      {
        question: 'Can I preview how the post looks in a Facebook feed?',
        answer: 'Yes—check Facebook Post Preview Generator.',
      },
      {
        question: 'Need captions specifically for Facebook Reels?',
        answer: 'Use Facebook Reel Caption Generator.',
      },
    ],
    relatedTools: [
      'facebook-post-preview-generator',
      'facebook-reel-caption-generator',
      'facebook-character-counter',
      'facebook-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-hashtag-generator',
    name: 'Facebook Hashtag Generator',
    slug: 'facebook-hashtag-generator',
    category: 'facebook-tools',
    url: '/facebook-hashtag-generator',
    description: 'Format 5, 10, or 15 clean Facebook post & Reels #CamelCase hashtags from topic templates (not AI).',
    longDescription:
      'Keep Facebook captions readable with a light touch of relevant hashtags instead of cluttered tag walls. Facebook Hashtag Generator is strictly template- and keyword-rule based inside your browser (NOT AI-written), generating concise CamelCase tags for Pages, Groups, and Reels.',
    keywords: ['facebook hashtag generator', 'fb reels hashtags', 'facebook tag templates'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Hashtag Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Hashtag Generator formats clean CamelCase #hashtags from topic templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter 1–3 topic keywords',
        description: 'Type your post subject, category, or niche inside your browser.',
      },
      {
        title: 'Build from keyword templates',
        description: 'Rule-based formatting generates clean #CamelCase tags locally (NOT AI).',
      },
      {
        title: 'Choose 5, 10 or 15 tags & copy',
        description: 'Pick individual hashtags or copy the full list for your post or Reel caption.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Hashtag Generator use AI?',
        answer: 'No. It uses deterministic keyword rules and CamelCase formatting templates inside your browser—NOT AI.',
      },
      {
        question: 'How many hashtags work best on Facebook posts?',
        answer: 'Many Facebook Pages keep posts to 2–5 focused tags, while this generator gives you batches of 5, 10, or 15 relevant #CamelCase options to choose from.',
      },
      {
        question: 'Can I check an existing post’s hashtag count?',
        answer: 'Yes—use Facebook Hashtag Counter.',
      },
      {
        question: 'Is this tool free with no uploads?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-hashtag-counter',
      'facebook-post-caption-generator',
      'facebook-reel-caption-generator',
      'instagram-hashtag-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-hashtag-counter',
    name: 'Facebook Hashtag Counter',
    slug: 'facebook-hashtag-counter',
    category: 'facebook-tools',
    url: '/facebook-hashtag-counter',
    description: 'Count #hashtags in Facebook posts and Reels drafts and strip duplicates cleanly.',
    longDescription:
      'Spot over-tagging or accidental duplicate hashtags before hitting Publish on your Page or Group. Facebook Hashtag Counter scans your pasted draft locally in your browser, lists every unique #tag, and highlights repeated tags in real time.',
    keywords: ['facebook hashtag counter', 'count fb hashtags', 'deduplicate facebook tags'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Hashtag Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Hashtag Counter counts unique #hashtags and catches duplicates in drafts locally inside your browser.',
    howTo: [
      {
        title: 'Paste your post draft',
        description: 'Paste your Facebook post or Reel caption into the browser.',
      },
      {
        title: 'Review detected #tags',
        description: 'Inspect unique count, duplicate flags, and overall tag-to-text balance.',
      },
      {
        title: 'Copy cleaned hashtag list',
        description: 'Remove repeats cleanly and keep focused tags.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Hashtag Counter check duplicates?',
        answer: 'Yes. Case-insensitive duplicate hashtags are highlighted cleanly.',
      },
      {
        question: 'Does it also count overall caption characters?',
        answer: 'Use Facebook Character Counter for full length checks.',
      },
      {
        question: 'Are any drafts transmitted online?',
        answer: 'No. Runs strictly inside your browser.',
      },
      {
        question: 'Is there an Instagram version?',
        answer: 'Yes—Instagram Hashtag Counter.',
      },
    ],
    relatedTools: [
      'facebook-hashtag-generator',
      'facebook-character-counter',
      'facebook-post-caption-generator',
      'instagram-hashtag-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-post-idea-generator',
    name: 'Facebook Post Idea Generator',
    slug: 'facebook-post-idea-generator',
    category: 'facebook-tools',
    url: '/facebook-post-idea-generator',
    description: 'Generate Page and Group post ideas from community & engagement templates (not AI).',
    longDescription:
      'Spark meaningful comments in Facebook Pages and Groups using proven community prompts. Facebook Post Idea Generator is strictly template-based inside your browser—NOT AI-written—combining your topic keyword with Poll, Fill-in-the-Blank, Throwback, and Local-Spotlight templates.',
    keywords: ['facebook post idea generator', 'fb group post prompts', 'facebook engagement ideas'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Post Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Post Idea Generator builds Page and Group discussion prompts using browser templates (NOT AI). Free.',
    howTo: [
      {
        title: 'Enter topic & audience context',
        description: 'Enter your Page or Group theme and choose your post format.',
      },
      {
        title: 'Browse prompt templates',
        description: 'Format matrices mix your topic into Question, Debate, Tutorial, and Resource prompts (NOT AI).',
      },
      {
        title: 'Schedule into your calendar',
        description: 'Copy top prompts straight into Facebook Content Calendar Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Post Idea Generator use AI?',
        answer: 'No. Every prompt is assembled from structured topic-format templates inside your browser—NOT AI.',
      },
      {
        question: 'Does it include Group conversation starters?',
        answer: 'Yes. Dedicated Group Icebreaker and Weekly Thread prompt templates are included.',
      },
      {
        question: 'Can I pair ideas with visual previews?',
        answer: 'Yes—check Facebook Post Preview Generator.',
      },
      {
        question: 'Is this tool completely free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reel-idea-generator',
      'facebook-story-idea-generator',
      'facebook-content-calendar-generator',
      'facebook-post-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-reel-idea-generator',
    name: 'Facebook Reel Idea Generator',
    slug: 'facebook-reel-idea-generator',
    category: 'facebook-tools',
    url: '/facebook-reel-idea-generator',
    description: 'Turn niche keywords into short vertical Facebook Reels concepts using templates (not AI).',
    longDescription:
      'Adapt business updates, how-tos, and product demos for vertical Facebook Reels. Facebook Reel Idea Generator is strictly template-based inside your browser (NOT AI-written)—building repeatable 30–60 second filming prompts directly from your subject words.',
    keywords: ['facebook reel idea generator', 'fb reels prompts', 'short vertical video fb'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Reel Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Reel Idea Generator turns keywords into vertical 30–60 sec Reels templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your topic & format',
        description: 'Enter your subject and pick a Reels angle such as Tip, Demo, Myth-Busting, or Behind-the-Scenes.',
      },
      {
        title: 'Generate template shot prompts',
        description: 'Browser templates combine hook, clip action, and CTA lines cleanly (NOT AI).',
      },
      {
        title: 'Draft matching Reel caption & cover',
        description: 'Jump directly into Facebook Reel Caption Generator and Reel Cover Maker.',
      },
    ],
    faqs: [
      {
        question: 'Are Reel ideas written by an AI model?',
        answer: 'No. Suggestions come strictly from structured vertical-video templates in your browser—NOT AI.',
      },
      {
        question: 'Can I design a Reel thumbnail too?',
        answer: 'Yes—use Facebook Reel Cover Maker.',
      },
      {
        question: 'Are captions generated separately?',
        answer: 'Yes—use Facebook Reel Caption Generator.',
      },
      {
        question: 'Does everything stay private in the browser?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reel-caption-generator',
      'facebook-reel-cover-maker',
      'facebook-post-idea-generator',
      'instagram-reel-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-story-idea-generator',
    name: 'Facebook Story Idea Generator',
    slug: 'facebook-story-idea-generator',
    category: 'facebook-tools',
    url: '/facebook-story-idea-generator',
    description: 'Build interactive daily Facebook Story prompts with Poll & Question templates (not AI).',
    longDescription:
      'Keep Page followers engaged between feed posts with lightweight Stories. Facebook Story Idea Generator is strictly template-based inside your browser (NOT AI-written)—giving you quick Poll, Customer Shoutout, Quick-Tip, and Behind-the-Scenes frame prompts.',
    keywords: ['facebook story idea generator', 'fb story poll prompts', 'daily stories template'],
    icon: 'Camera',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Story Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Story Idea Generator provides Poll, Tip, and Q&A Story sequence templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Select topic & Story theme',
        description: 'Enter your keyword and choose interactive Story styles like Poll, Question Sticker, Tip, or Offer.',
      },
      {
        title: 'Populate frame templates',
        description: 'Deterministic templates output multi-frame prompts and sticker ideas locally (NOT AI).',
      },
      {
        title: 'Prepare 9:16 assets & post',
        description: 'Size accompanying images cleanly before sharing to Stories.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Story Idea Generator use AI?',
        answer: 'No. It uses repeatable Story prompt templates inside your browser—NOT AI.',
      },
      {
        question: 'Can these frames be cross-posted from Instagram?',
        answer: 'Yes. Standard 1080x1920 vertical ratios work seamlessly across both.',
      },
      {
        question: 'Does it connect to my Facebook Page?',
        answer: 'No. Client-side planning only.',
      },
      {
        question: 'Need feed post ideas as well?',
        answer: 'Try Facebook Post Idea Generator.',
      },
    ],
    relatedTools: [
      'facebook-post-idea-generator',
      'facebook-reel-idea-generator',
      'instagram-story-idea-generator',
      'facebook-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-reel-caption-generator',
    name: 'Facebook Reel Caption Generator',
    slug: 'facebook-reel-caption-generator',
    category: 'facebook-tools',
    url: '/facebook-reel-caption-generator',
    description: 'Assemble concise Facebook Reels captions and engagement prompts via templates (not AI).',
    longDescription:
      'Keep Facebook Reels captions punchy enough to read cleanly above the bottom player bar. Facebook Reel Caption Generator is strictly template-based inside your browser (NOT AI-written)—pairing brief curiosity lines with share and comment prompts.',
    keywords: ['facebook reel caption generator', 'fb reels caption templates', 'short fb reel text'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Reel Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Reel Caption Generator builds short Reels captions and CTA templates locally in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter Reel takeaway & CTA',
        description: 'Describe your core clip topic, tone, and optional call-to-action.',
      },
      {
        title: 'Generate template caption options',
        description: 'Browser formulas format crisp mobile-length caption options cleanly (NOT AI).',
      },
      {
        title: 'Attach hashtags & copy',
        description: 'Add 2–4 clean hashtags and copy into Facebook Reels.',
      },
    ],
    faqs: [
      {
        question: 'Are captions generated by AI?',
        answer: 'No. Captions are built locally from customizable browser templates—NOT AI-written.',
      },
      {
        question: 'Does it include character count feedback?',
        answer: 'Yes. Highlights concise under-80-char visibility before "...more".',
      },
      {
        question: 'Can I generate long-form Facebook video descriptions too?',
        answer: 'Yes—use Facebook Video Description Generator.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reel-idea-generator',
      'facebook-video-description-generator',
      'facebook-hashtag-generator',
      'instagram-reel-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-video-title-generator',
    name: 'Facebook Video Title Generator',
    slug: 'facebook-video-title-generator',
    category: 'facebook-tools',
    url: '/facebook-video-title-generator',
    description: 'Slot topics into clear Facebook Watch & Page video headline formulas (template-based, not AI).',
    longDescription:
      'Facebook Page video titles appear directly beneath thumbnails in Watch feeds and Search. Facebook Video Title Generator is strictly formula- and template-based inside your browser—NOT AI-written—slotting your topic into proven Tutorial, Breakdown, and Story headline patterns.',
    keywords: ['facebook video title generator', 'fb watch title formulas', 'video headline builder'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Video Title Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Video Title Generator formats Facebook Watch headlines using editorial templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter video subject & outcome',
        description: 'Enter your main video keyword, angle, and audience focus.',
      },
      {
        title: 'Apply title formula templates',
        description: 'Browser templates build concise under-65-char headlines deterministically (NOT AI).',
      },
      {
        title: 'Refine & copy into Creator Studio',
        description: 'Transfer your verified title alongside a structured description.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Video Title Generator use AI?',
        answer: 'No. All headlines use pre-built editorial formulas and keyword templates locally—NOT AI.',
      },
      {
        question: 'What is the ideal title length for Facebook videos?',
        answer: 'Keeping titles concise under ~60–65 characters prevents mobile feed truncation.',
      },
      {
        question: 'Can I draft the matching video description next?',
        answer: 'Yes—use Facebook Video Description Generator.',
      },
      {
        question: 'Are any titles saved online?',
        answer: 'No. Client-side only.',
      },
    ],
    relatedTools: [
      'facebook-video-description-generator',
      'facebook-character-counter',
      'youtube-title-generator',
      'facebook-post-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-video-description-generator',
    name: 'Facebook Video Description Generator',
    slug: 'facebook-video-description-generator',
    category: 'facebook-tools',
    url: '/facebook-video-description-generator',
    description: 'Build structured Facebook video descriptions with hooks, links, and tags via templates (not AI).',
    longDescription:
      'Organize video summaries, resource links, and follow calls-to-action cleanly inside Meta Business Suite. Facebook Video Description Generator is strictly template-based inside your browser (NOT AI-written), assembling repeatable sections and tracking character length automatically.',
    keywords: ['facebook video description generator', 'meta video description template', 'fb watch copy'],
    icon: 'FileText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Video Description Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Video Description Generator structures hooks, links, and tags via browser templates (NOT AI). Free.',
    howTo: [
      {
        title: 'Fill summary, link & Page CTA fields',
        description: 'Input your video summary, key points, optional resource URL, and CTA in the browser.',
      },
      {
        title: 'Assemble structured template',
        description: 'Deterministic layouts organize spacing, timestamps, and boilerplate cleanly (NOT AI).',
      },
      {
        title: 'Copy directly into Meta Business Suite',
        description: 'Paste clean formatting with zero manual spacing fixes.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Video Description Generator write text using AI?',
        answer: 'No. It organizes your own notes and links inside repeatable formatting templates—NOT AI-written.',
      },
      {
        question: 'Can I include timestamps and website links?',
        answer: 'Yes. Dedicated fields cleanly format both optional timestamps and URLs.',
      },
      {
        question: 'Can I pair this with Facebook Video Title Generator?',
        answer: 'Yes.',
      },
      {
        question: 'Does anything leave my browser?',
        answer: 'No.',
      },
    ],
    relatedTools: [
      'facebook-video-title-generator',
      'facebook-post-caption-generator',
      'facebook-hashtag-generator',
      'youtube-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-comment-generator',
    name: 'Facebook Comment Generator',
    slug: 'facebook-comment-generator',
    category: 'facebook-tools',
    url: '/facebook-comment-generator',
    description: 'Draft thoughtful Page, Group, and first-comment link prompts via templates (not AI).',
    longDescription:
      'Prepare friendly first-comment links under Page posts or community conversation prompts cleanly. Facebook Comment Generator is strictly template-based inside your browser—NOT AI-written—helping Page admins prepare consistent editable replies and link comments manually.',
    keywords: ['facebook comment generator', 'first comment link template', 'fb group comment templates'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Comment Generator builds customizable Page, Group, and first-comment templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Choose comment scenario',
        description: 'Enter post context and pick Friendly, Curious, Supportive, or First-Comment Link.',
      },
      {
        title: 'Fill custom topic & URL details',
        description: 'Editable placeholders populate clean text deterministically (NOT AI).',
      },
      {
        title: 'Copy & post manually',
        description: 'Personalize to match your Page voice before posting in Facebook.',
      },
    ],
    faqs: [
      {
        question: 'Does this use AI or auto-comment on Facebook?',
        answer: 'No. It uses editable browser templates ONLY (NOT AI) and cannot post or automate Facebook actions.',
      },
      {
        question: 'Why put links in the first comment on some Facebook Pages?',
        answer: 'Dedicated templates let Pages drop clean resource URLs right below image posts.',
      },
      {
        question: 'Need templates for replying to customer questions?',
        answer: 'Check Facebook Reply Generator.',
      },
      {
        question: 'Is this tool completely free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reply-generator',
      'facebook-dm-generator',
      'facebook-random-comment-picker',
      'instagram-comment-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-reply-generator',
    name: 'Facebook Reply Generator',
    slug: 'facebook-reply-generator',
    category: 'facebook-tools',
    url: '/facebook-reply-generator',
    description: 'Build helpful customer support, pricing, and thank-you comment replies via templates (not AI).',
    longDescription:
      'Respond promptly to common Page inquiries with warm, consistent Saved Replies. Facebook Reply Generator is strictly template-based inside your browser—NOT AI-written—organizing polite support, hours, shipping, and positive feedback templates.',
    keywords: ['facebook reply generator', 'fb page reply templates', 'saved reply copy'],
    icon: 'Reply',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Reply Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Reply Generator builds consistent customer support and feedback replies via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Select reply category',
        description: 'Choose Support, Thanks, Pricing, Booking, or Question Follow-Up and enter your context.',
      },
      {
        title: 'Customize customer & link fields',
        description: 'Templates populate structured polite text locally inside your browser (NOT AI).',
      },
      {
        title: 'Copy directly into Page Inbox or comments',
        description: 'Use manually across Meta Business Suite without sharing credentials.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Reply Generator use AI?',
        answer: 'No. Every reply comes from customizable browser templates—NOT AI-written.',
      },
      {
        question: 'Can it access my Facebook Page Inbox?',
        answer: 'No. Everything runs locally inside your browser tab with zero Facebook login.',
      },
      {
        question: 'Want Messenger welcome & order DM scripts too?',
        answer: 'Try Facebook DM Generator.',
      },
      {
        question: 'Are typed details private?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-dm-generator',
      'facebook-comment-generator',
      'instagram-reply-generator',
      'facebook-cta-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-dm-generator',
    name: 'Facebook DM Generator',
    slug: 'facebook-dm-generator',
    category: 'facebook-tools',
    url: '/facebook-dm-generator',
    description: 'Craft Messenger welcome, inquiry, and booking DM templates locally in your browser (not AI).',
    longDescription:
      'Keep Page Messenger replies clear and helpful for quotes, appointments, and Marketplace inquiries. Facebook DM Generator is strictly template-based inside your browser (NOT AI-written)—helping you assemble concise message scripts you personalize and send yourself.',
    keywords: ['facebook dm generator', 'messenger reply templates', 'fb marketplace dm script'],
    icon: 'Send',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook DM Generator — Messenger | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook DM Generator formats Messenger welcome, booking, and support templates inside your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick Messenger script template',
        description: 'Choose Welcome, Inquiry Reply, Collaboration, or Marketplace Meetup and enter your brand details.',
      },
      {
        title: 'Customize hours, URLs & greeting',
        description: 'Template fields populate polite, clear messaging locally (NOT AI).',
      },
      {
        title: 'Copy into Messenger Saved Replies',
        description: 'Send manually inside Facebook Messenger or Meta Business Suite.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook DM Generator use AI or auto-message users?',
        answer: 'No. It uses editable templates ONLY inside your browser (NOT AI) and never connects to Messenger.',
      },
      {
        question: 'Are Marketplace availability and meetup templates included?',
        answer: 'Yes. Dedicated Welcome, Booking Inquiry, Support, and Marketplace response templates are built directly into the tool.',
      },
      {
        question: 'Is there a matching Instagram DM tool?',
        answer: 'Yes—Instagram DM Generator.',
      },
      {
        question: 'Is this free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reply-generator',
      'facebook-comment-generator',
      'instagram-dm-generator',
      'facebook-page-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-stylish-text-generator',
    name: 'Facebook Stylish Text Generator',
    slug: 'facebook-stylish-text-generator',
    category: 'facebook-tools',
    url: '/facebook-stylish-text-generator',
    description: 'Style post headings with Unicode fonts, brackets, and divider templates in your browser (not AI).',
    longDescription:
      'Highlight event announcements, Group rules headers, and sale callouts inside plain-text Facebook posts. Facebook Stylish Text Generator applies deterministic Unicode mappings and frame templates locally in your browser (NOT AI) for instant one-click copying.',
    keywords: ['facebook stylish text generator', 'fancy text facebook posts', 'fb post dividers'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Stylish Text Generator transforms headings with Unicode styles and divider templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your heading or callout',
        description: 'Type the short title or offer line you want highlighted.',
      },
      {
        title: 'Pick font & symbol border template',
        description: 'Browser rules map letters to bold Unicode styles and clean dividers (NOT AI).',
      },
      {
        title: 'Copy straight into Facebook',
        description: 'Paste cleanly into Group announcements or Page posts.',
      },
    ],
    faqs: [
      {
        question: 'Is Facebook Stylish Text Generator AI-powered?',
        answer: 'No. It uses fixed Unicode lookup tables and framing templates in your browser—NOT AI.',
      },
      {
        question: 'Should whole paragraphs use decorative Unicode fonts?',
        answer: 'No—keep styling limited to short headings for clean readability and accessibility.',
      },
      {
        question: 'Want bold/italic fonts only without borders?',
        answer: 'Use Facebook Font Generator.',
      },
      {
        question: 'Does text stay on my device?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-font-generator',
      'facebook-text-formatter',
      'instagram-stylish-text-generator',
      'facebook-post-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-font-generator',
    name: 'Facebook Font Generator',
    slug: 'facebook-font-generator',
    category: 'facebook-tools',
    url: '/facebook-font-generator',
    description: 'Convert text into bold, italic, serif, and monospace Unicode characters for Facebook (not AI).',
    longDescription:
      'Add bold scannable subheadings inside long Facebook posts or Group announcements. Facebook Font Generator converts regular ASCII text into standard Unicode Bold, Italic, Script, and Monospace variants inside your browser (character mapping only, NOT AI).',
    keywords: ['facebook font generator', 'bold text in facebook post', 'unicode fb fonts'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Font Generator — Bold & Italic | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Font Generator converts headings into bold and italic Unicode styles in your browser (NOT AI). Free copy-paste.',
    howTo: [
      {
        title: 'Enter plain heading text',
        description: 'Type the text phrase you want bolded or italicized.',
      },
      {
        title: 'Preview Unicode styles instantly',
        description: 'Deterministic character mapping generates Sans Bold, Serif Italic, Script, and Mono previews (NOT AI).',
      },
      {
        title: 'Copy & paste into Facebook',
        description: 'Paste into Page posts, comments, or Group pinned announcements.',
      },
    ],
    faqs: [
      {
        question: 'How does bold text work on personal Facebook posts without Markdown?',
        answer: 'Facebook lacks bold buttons on standard feed posts, so copying mathematical bold Unicode letters preserves emphasis cleanly.',
      },
      {
        question: 'Does Facebook Font Generator use AI?',
        answer: 'No. Pure client-side Unicode character lookup.',
      },
      {
        question: 'Need clean bullet formatting for full posts?',
        answer: 'Try Facebook Text Formatter.',
      },
      {
        question: 'Are typed lines stored anywhere?',
        answer: 'No.',
      },
    ],
    relatedTools: [
      'facebook-stylish-text-generator',
      'facebook-text-formatter',
      'instagram-font-generator',
      'facebook-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-text-formatter',
    name: 'Facebook Text Formatter',
    slug: 'facebook-text-formatter',
    category: 'facebook-tools',
    url: '/facebook-text-formatter',
    description: 'Clean spaces & line breaks, change case, build bullet lists, and download clean Facebook text.',
    longDescription:
      'Turn rough notes into readable, well-spaced Facebook updates and Group announcements. Facebook Text Formatter cleans extra spaces, normalizes line breaks, switches case (Title Case, UPPERCASE, lowercase), removes empty lines, and converts lines into clean bullet lists inside your browser.',
    keywords: ['facebook text formatter', 'format fb post bullets', 'clean facebook spacing'],
    icon: 'WrapText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Text Formatter — Clean Copy | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Text Formatter removes extra spaces, fixes line breaks, builds bullets, and downloads clean .txt copy in your browser.',
    howTo: [
      {
        title: 'Paste rough post text',
        description: 'Paste draft notes into the input box inside your browser.',
      },
      {
        title: 'Apply formatting transformations',
        description: 'Clean extra spaces & breaks, switch case, remove empty lines, or build a clean bullet list.',
      },
      {
        title: 'Copy or download formatted update',
        description: 'Copy clean text or save it as a .txt file ready for Facebook.',
      },
    ],
    faqs: [
      {
        question: 'Can Facebook Text Formatter turn plain lines into clean bullet lists?',
        answer: 'Yes. Convert plain lines into neat bulleted (•) lists with one click.',
      },
      {
        question: 'Can I download formatted text or clean extra line breaks?',
        answer: 'Yes. Remove Extra Spaces & Fix Breaks, Remove Empty Lines, Copy Formatted, and Download .txt are all included.',
      },
      {
        question: 'Is there an accompanying character counter?',
        answer: 'Yes—check Facebook Character Counter.',
      },
      {
        question: 'Does text stay on my device?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-character-counter',
      'facebook-font-generator',
      'facebook-post-preview-generator',
      'instagram-text-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-character-counter',
    name: 'Facebook Character Counter',
    slug: 'facebook-character-counter',
    category: 'facebook-tools',
    url: '/facebook-character-counter',
    description: 'Count characters against Facebook Post (63,206), Comment (8,000), Page Name (75), Bio (101), and Page About (255) limits.',
    longDescription:
      'Track exact Unicode code-point character counts (emojis counted as 1), characters without spaces, words, and lines locally in your browser against documented Facebook thresholds: Post (63,206), Comment (8,000), Page Name (75), Profile Intro Bio (101), and Page Short Description (255).',
    keywords: ['facebook character counter', 'fb post character limit', 'facebook bio character counter'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Character Counter tracks Post (63,206), Comment (8,000), Page Name (75), Profile Bio (101), and Page About (255) limits locally.',
    howTo: [
      {
        title: 'Choose Facebook field threshold',
        description: 'Select Post (63,206), Comment (8,000), Page Name (75), Profile Bio (101), or Page Short Description (255).',
      },
      {
        title: 'Paste or type your copy',
        description: 'Monitor exact Unicode character count (emoji = 1), characters without spaces, words, lines, and remaining allowance.',
      },
      {
        title: 'Verify limit & copy text',
        description: 'Check if your text exceeds the limit and copy verified text directly.',
      },
    ],
    faqs: [
      {
        question: 'Which Facebook field limits does the counter track?',
        answer: 'Includes Facebook Post (63,206), Comment (8,000), Page Name (75), Profile Intro Bio (101), and Page Short Description / About (255).',
      },
      {
        question: 'How does it count emojis and accented characters?',
        answer: 'Characters are counted as Unicode code points so standard emojis count as 1 character rather than 2 UTF-16 code units.',
      },
      {
        question: 'Does it also count hashtags?',
        answer: 'Pair with Facebook Hashtag Counter for tag checks.',
      },
      {
        question: 'Does everything run client-side?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-ad-headline-generator',
      'facebook-ad-copy-generator',
      'facebook-bio-generator',
      'facebook-hashtag-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-engagement-rate-calculator',
    name: 'Facebook Engagement Rate Calculator',
    slug: 'facebook-engagement-rate-calculator',
    category: 'facebook-tools',
    url: '/facebook-engagement-rate-calculator',
    description: 'Compute Facebook Page or post engagement rate % from reactions, comments, shares, and reach.',
    longDescription:
      'Measure how effectively your posts resonate across your Page audience or campaign reports. Facebook Engagement Rate Calculator computes standard Engagement Rate by Reach and Engagement Rate by Page Followers locally in your browser from the counts you supply.',
    keywords: ['facebook engagement rate calculator', 'fb page er calculator', 'reactions comments reach ratio'],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Engagement Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Engagement Rate Calculator computes Page and post engagement % from reactions, comments, shares, and reach.',
    howTo: [
      {
        title: 'Enter reach/followers & interactions',
        description: 'Choose Engagement Rate by Followers or by Reach and input reactions, comments, and shares.',
      },
      {
        title: 'Calculate engagement breakdown',
        description: 'Browser formulas return overall engagement % plus separate reaction, comment, and share rates.',
      },
      {
        title: 'Benchmark post types cleanly',
        description: 'Compare photo updates, Reels, and link posts across campaigns.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch metrics directly from Meta Insights?',
        answer: 'No. Calculations run purely in your browser from numbers you type in manually.',
      },
      {
        question: 'Should I measure by Reach or Page Followers?',
        answer: 'Measuring by Reach best reflects content resonance, while measuring by Followers benchmarks overall Page size—both formulas are included.',
      },
      {
        question: 'Can I project follower growth milestones too?',
        answer: 'Yes—use Facebook Follower Growth Calculator.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-follower-growth-calculator',
      'instagram-engagement-rate-calculator',
      'youtube-engagement-rate-calculator',
      'facebook-post-scheduler-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-follower-growth-calculator',
    name: 'Facebook Follower Growth Calculator',
    slug: 'facebook-follower-growth-calculator',
    category: 'facebook-tools',
    url: '/facebook-follower-growth-calculator',
    description: 'Calculate Facebook follower growth rate %, net follower gain, and average daily growth.',
    longDescription:
      'Measure real audience momentum across any campaign window. Facebook Follower Growth Calculator computes exact Growth Rate = ((Current - Previous) / Previous) * 100, absolute follower change, and average followers gained per day across days, weeks, or months inside your browser.',
    keywords: ['facebook follower growth calculator', 'fb follower growth rate formula', 'page growth rate calculator'],
    icon: 'Users',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Follower Growth Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Follower Growth Calculator computes growth rate %, absolute change, and average growth per day locally in your browser.',
    howTo: [
      {
        title: 'Enter previous, current & time period',
        description: 'Enter your starting follower count, current follower count, and time period (days, weeks, or months).',
      },
      {
        title: 'Calculate exact growth rate',
        description: 'Applies Growth Rate = ((Current - Previous) / Previous) x 100 alongside net growth and daily average.',
      },
      {
        title: 'Copy your growth summary',
        description: 'Copy clean formatted stats for weekly or monthly Page reporting.',
      },
    ],
    faqs: [
      {
        question: 'Does this connect to Facebook to read real Page counts?',
        answer: 'No. You enter numbers manually inside your browser for instant offline calculation.',
      },
      {
        question: 'What happens if the previous follower count is 0?',
        answer: 'Because percentage growth requires dividing by the starting count, the calculator handles 0 safely without dividing by zero while still showing absolute and daily growth.',
      },
      {
        question: 'How are weeks and months converted to daily averages?',
        answer: 'Weeks count as 7 days and months count as 30 days for clean average followers-per-day comparisons.',
      },
      {
        question: 'Can I measure engagement alongside growth?',
        answer: 'Yes—pair with Facebook Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'facebook-engagement-rate-calculator',
      'instagram-follower-growth-calculator',
      'youtube-subscriber-goal-calculator',
      'facebook-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-giveaway-winner-picker',
    name: 'Facebook Giveaway Winner Picker',
    slug: 'facebook-giveaway-winner-picker',
    category: 'facebook-tools',
    url: '/facebook-giveaway-winner-picker',
    description: 'Draw fair giveaway winners strictly from entrant names you paste in your browser.',
    longDescription:
      'Run honest Page or Group prize draws without granting third-party Facebook permissions. Facebook Giveaway Winner Picker works ONLY from names or comments you paste into the browser—it cannot connect to Facebook or fetch real entrants/comments—and uses `crypto.getRandomValues` for fair selection.',
    keywords: ['facebook giveaway winner picker', 'fb group raffle picker', 'pasted entrant winner picker'],
    icon: 'Trophy',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Giveaway Winner Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Giveaway Winner Picker selects random winners ONLY from pasted entrant names in your browser (cannot fetch live FB data).',
    howTo: [
      {
        title: 'Paste entrant names one per line',
        description: 'Paste names or handles into your browser—it cannot fetch live Facebook comments.',
      },
      {
        title: 'Set winners, backups & deduplication',
        description: 'Choose 1–10 winners, 0–5 backup winners, and keep duplicate-name removal enabled.',
      },
      {
        title: 'Draw & copy winners cleanly',
        description: 'Web Crypto Fisher-Yates selects numbered winners and backups without inventing entries if fewer names exist.',
      },
    ],
    faqs: [
      {
        question: 'Can Facebook Giveaway Winner Picker fetch entrants automatically from a Facebook post URL?',
        answer: 'No. It works ONLY from names or comments that you paste manually—it cannot access Facebook or fetch real entrants/comments.',
      },
      {
        question: 'Can I draw backup winners if someone fails to claim a prize?',
        answer: 'Yes. Select 1–10 primary winners and 0–5 backup winners in a single draw.',
      },
      {
        question: 'Does it deduplicate repeated names cleanly?',
        answer: 'Yes. Case-insensitive duplicate removal is enabled by default and can be toggled before drawing.',
      },
      {
        question: 'Is entrant data uploaded anywhere?',
        answer: 'No. Everything remains strictly inside your browser tab.',
      },
    ],
    relatedTools: [
      'facebook-random-comment-picker',
      'instagram-giveaway-winner-picker',
      'instagram-random-comment-picker',
      'facebook-comment-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-random-comment-picker',
    name: 'Facebook Random Comment Picker',
    slug: 'facebook-random-comment-picker',
    category: 'facebook-tools',
    url: '/facebook-random-comment-picker',
    description: 'Select random winning comments strictly from the list you paste inside your browser.',
    longDescription:
      'Choose fair winners from Facebook Group polls or Page comment threads with zero Page-admin token risks. Facebook Random Comment Picker operates ONLY on comments you paste manually—it cannot fetch real Facebook comments—picking random rows cleanly via browser Web Crypto.',
    keywords: ['facebook random comment picker', 'pasted fb comment picker', 'random group comment draw'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Random Comment Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Random Comment Picker draws random winners ONLY from pasted comments in your browser (cannot fetch live FB comments).',
    howTo: [
      {
        title: 'Paste copied Facebook comments',
        description: 'Paste comments or lines into the tool—it cannot fetch real comments from Facebook.',
      },
      {
        title: 'Filter keywords or duplicates',
        description: 'Optionally require a specific answer word and remove duplicate commenters.',
      },
      {
        title: 'Pick random comments locally',
        description: 'Draw fair, non-repeating winners inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Can this connect to a Facebook Page or Group URL to load comments?',
        answer: 'No. It works ONLY from comments that you paste manually—it cannot fetch real entrants or comments from Facebook.',
      },
      {
        question: 'Can I filter pasted entries by a keyword answer?',
        answer: 'Yes. Client-side text filtering narrows entries before the random draw.',
      },
      {
        question: 'How is randomness generated?',
        answer: 'Uses `crypto.getRandomValues` in your browser rather than predictable lists.',
      },
      {
        question: 'Is there an Instagram version too?',
        answer: 'Yes—Instagram Random Comment Picker.',
      },
    ],
    relatedTools: [
      'facebook-giveaway-winner-picker',
      'instagram-random-comment-picker',
      'instagram-giveaway-winner-picker',
      'facebook-reply-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-post-scheduler-planner',
    name: 'Facebook Post Scheduler Planner',
    slug: 'facebook-post-scheduler-planner',
    category: 'facebook-tools',
    url: '/facebook-post-scheduler-planner',
    description: 'Plan and export an upcoming Facebook publishing schedule locally (PLAN ONLY, cannot auto-post).',
    longDescription:
      'Map out upcoming Page, Group, and Reels slots before loading them into Meta Business Suite. Facebook Post Scheduler Planner is PLAN ONLY—it cannot connect to Facebook, schedule live posts, or publish automatically—giving teams a clean local schedule builder with CSV export.',
    keywords: ['facebook post scheduler planner', 'fb publishing schedule plan', 'meta post planner'],
    icon: 'Calendar',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Post Scheduler Planner | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Post Scheduler Planner lets you plan and export upcoming publishing slots in your browser (PLAN ONLY, cannot auto-post).',
    howTo: [
      {
        title: 'Add planned dates, times & post copy',
        description: 'List upcoming Page, Group, and Reels slots inside your browser.',
      },
      {
        title: 'Organize by campaign & status',
        description: 'Tag each planned row locally—remember this tool is PLAN ONLY and does not post to Facebook.',
      },
      {
        title: 'Export CSV for team review',
        description: 'Download your organized schedule and queue posts manually in Meta Business Suite.',
      },
    ],
    faqs: [
      {
        question: 'Can Facebook Post Scheduler Planner actually schedule or publish posts to my Facebook Page?',
        answer: 'No. It is PLAN ONLY inside your browser—it cannot connect to Facebook, schedule live posts, or publish automatically.',
      },
      {
        question: 'Why use a local scheduler planner first?',
        answer: 'Drafting dates, post types, and copy in one browser workspace makes team approval and CSV handoff clean before entering Meta Business Suite.',
      },
      {
        question: 'Does it store any Page credentials?',
        answer: 'No. Zero Facebook login or OAuth permissions required.',
      },
      {
        question: 'Need multi-week pillar templates?',
        answer: 'Try Facebook Content Calendar Generator.',
      },
    ],
    relatedTools: [
      'facebook-content-calendar-generator',
      'facebook-post-preview-generator',
      'instagram-best-posting-time-planner',
      'csv-to-excel',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-content-calendar-generator',
    name: 'Facebook Content Calendar Generator',
    slug: 'facebook-content-calendar-generator',
    category: 'facebook-tools',
    url: '/facebook-content-calendar-generator',
    description: 'Build weekly Facebook Page, Group, and Reels calendars from templates in your browser (not AI).',
    longDescription:
      'Balance product updates, community threads, links, and Reels across the month effortlessly. Facebook Content Calendar Generator uses deterministic date formulas and pillar rotation templates inside your browser (NOT AI-written) with clean CSV export.',
    keywords: ['facebook content calendar generator', 'fb monthly content plan', 'page schedule builder'],
    icon: 'Calendar',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Content Calendar Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Content Calendar Generator creates editable weekly Page and Group schedules via formulas in your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick upload frequency & pillars',
        description: 'Select weekly post frequency, start date, niche topic, and recurring content pillars.',
      },
      {
        title: 'Generate balanced schedule template',
        description: 'Browser date formulas map Posts, Reels, and Group prompts automatically (NOT AI).',
      },
      {
        title: 'Customize slots & export CSV',
        description: 'Edit titles locally and download a clean CSV publishing table.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Content Calendar Generator use AI?',
        answer: 'No. Schedules are generated using calendar date formulas and rotation templates inside your browser—NOT AI.',
      },
      {
        question: 'Can it actually post to Facebook?',
        answer: 'No. Like our Scheduler Planner, it creates local planning schedules you publish manually.',
      },
      {
        question: 'Can I pair this with post prompt ideas?',
        answer: 'Yes—use Facebook Post Idea Generator.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-post-scheduler-planner',
      'facebook-post-idea-generator',
      'instagram-content-calendar-generator',
      'youtube-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-image-resizer',
    name: 'Facebook Image Resizer',
    slug: 'facebook-image-resizer',
    category: 'facebook-tools',
    url: '/facebook-image-resizer',
    description: 'Resize photos cleanly for Facebook Covers (820x312), Link/Feed Posts (1200x630), and Squares.',
    longDescription:
      'Format graphics cleanly for every Facebook placement without manual pixel math. Facebook Image Resizer scales JPG, PNG, and WebP photos up to 20 MB inside your browser to 1200x630 feed/link posts, 1080x1080 square posts, 820x312 covers, or 1080x1920 Stories/Reels with zero watermarks.',
    keywords: ['facebook image resizer', 'resize image for facebook', 'fb post dimensions'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Image Resizer — All Sizes | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Image Resizer scales photos for 1200x630 posts, 820x312 covers, and 1080x1080 squares in your browser. No watermark.',
    howTo: [
      {
        title: 'Select your image file',
        description: 'Open a JPG, PNG, or WebP photo up to 20 MB inside your browser.',
      },
      {
        title: 'Choose Facebook placement preset',
        description: 'Switch cleanly between Feed Post, Cover Photo, Square, or Stories/Reels dimensions.',
      },
      {
        title: 'Download crisp resized photo',
        description: 'Save unwatermarked artwork ready for Facebook upload.',
      },
    ],
    faqs: [
      {
        question: 'Which Facebook image size presets are included?',
        answer: 'Includes 820x312 Cover Photo, 1200x630 Link/Post image, 1080x1080 Square post, and 1080x1920 Story/Reel sizes.',
      },
      {
        question: 'Will resized images have a watermark?',
        answer: 'No. Every download is unwatermarked.',
      },
      {
        question: 'Does this run locally in my browser?',
        answer: 'Yes. HTML5 Canvas processes your file on your device.',
      },
      {
        question: 'Need compression too?',
        answer: 'Pair with Facebook Image Compressor.',
      },
    ],
    relatedTools: [
      'facebook-image-compressor',
      'facebook-cover-photo-resizer',
      'facebook-post-image-resizer',
      'instagram-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-image-compressor',
    name: 'Facebook Image Compressor',
    slug: 'facebook-image-compressor',
    category: 'facebook-tools',
    url: '/facebook-image-compressor',
    description: 'Compress heavy photos in your browser before uploading so Facebook stays sharp without bloat.',
    longDescription:
      'Large multi-megabyte photos trigger heavy server-side re-compression when uploaded to Facebook Pages or Groups. Facebook Image Compressor optimizes JPG, PNG, and WebP files up to 10 MB locally inside your browser using HTML5 Canvas quality presets and format conversion—zero watermarks.',
    keywords: ['facebook image compressor', 'optimize fb photo', 'reduce facebook image size'],
    icon: 'Minimize',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Image Compressor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Image Compressor reduces photo size up to 10 MB locally in your browser with quality presets and before/after comparison.',
    howTo: [
      {
        title: 'Choose your image file',
        description: 'Select a JPG, PNG, or WebP file up to 10 MB inside your browser.',
      },
      {
        title: 'Tune compression & format',
        description: 'Compare byte savings and preview crisp graphic or portrait text edges.',
      },
      {
        title: 'Download clean file',
        description: 'Save unwatermarked artwork locally for fast Facebook uploads.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Image Compressor add any watermark?',
        answer: 'No. Zero watermarks.',
      },
      {
        question: 'Why choose PNG or high-quality JPEG for Facebook graphics with text?',
        answer: 'Clean resolution plus controlled JPEG/PNG size keeps Facebook’s automatic re-encoder from smearing sharp text.',
      },
      {
        question: 'Does it upload images anywhere?',
        answer: 'No. Compression runs client-side in your browser.',
      },
      {
        question: 'Should I resize before compressing?',
        answer: 'Yes—pair with Facebook Image Resizer or Cover Photo Resizer.',
      },
    ],
    relatedTools: [
      'facebook-image-resizer',
      'facebook-cover-photo-resizer',
      'facebook-post-image-resizer',
      'instagram-image-compressor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-cover-photo-maker',
    name: 'Facebook Cover Photo Maker',
    slug: 'facebook-cover-photo-maker',
    category: 'facebook-tools',
    url: '/facebook-cover-photo-maker',
    description: 'Compose branded 820x312 Facebook Page banners with text and safe-zone templates (not AI).',
    longDescription:
      'Build clean hero banners for Facebook Pages with headline overlays, taglines, and background colors—without desktop design software. Facebook Cover Photo Maker is template-based locally inside your browser (NOT AI), outputting exact 820x312 graphics up to 20 MB source images with zero watermarks.',
    keywords: ['facebook cover photo maker', '820x312 banner maker', 'fb page header template'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Cover Photo Maker — 820x312 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Cover Photo Maker builds 820x312 Page headers with editable banner templates in your browser (NOT AI). No watermark.',
    howTo: [
      {
        title: 'Pick background color or upload photo',
        description: 'Set a background color or load a local JPG, PNG, or WebP photo up to 20 MB.',
      },
      {
        title: 'Add headline within center safe zone',
        description: 'Place titles inside the desktop/mobile overlap safe rectangle cleanly (NOT AI).',
      },
      {
        title: 'Export unwatermarked 820x312 PNG/JPG',
        description: 'Download crisp header artwork ready to set as your Facebook Cover.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Cover Photo Maker use AI image generation?',
        answer: 'No. It uses clean editable layout templates and canvas composition inside your browser—NOT AI.',
      },
      {
        question: 'What dimensions are generated?',
        answer: 'Exports at Facebook’s exact 820x312 desktop banner size (with mobile safe-area guides).',
      },
      {
        question: 'Will exported covers have a watermark?',
        answer: 'No. Completely free and unwatermarked.',
      },
      {
        question: 'Want to only crop/resize an existing photo without adding text?',
        answer: 'Use Facebook Cover Photo Resizer.',
      },
    ],
    relatedTools: [
      'facebook-cover-photo-resizer',
      'facebook-profile-picture-resizer',
      'facebook-page-bio-generator',
      'facebook-post-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-post-image-resizer',
    name: 'Facebook Post Image Resizer',
    slug: 'facebook-post-image-resizer',
    category: 'facebook-tools',
    url: '/facebook-post-image-resizer',
    description: 'Resize landscape graphics and link share cards to Facebook’s 1200x630 standard in your browser.',
    longDescription:
      'Fix blurry or cropped blog share thumbnails and feed announcements before posting. Facebook Post Image Resizer crops or pads JPG, PNG, and WebP images up to 20 MB locally inside your browser to exact 1200x630 OpenGraph and feed proportions—completely unwatermarked.',
    keywords: ['facebook post image resizer', '1200x630 resizer', 'fb og share image size'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Post Image Resizer — 1200x630 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Post Image Resizer formats photos cleanly to 1200x630 feed/link card specs in your browser. Zero watermark.',
    howTo: [
      {
        title: 'Choose your source image',
        description: 'Select a JPG, PNG, or WebP file up to 20 MB in your browser.',
      },
      {
        title: 'Crop or pad to 1200x630',
        description: 'Frame subjects cleanly inside Facebook’s 1.91:1 shared post and OpenGraph card ratio.',
      },
      {
        title: 'Download unwatermarked 1200x630 file',
        description: 'Save crisp JPG or PNG output for feeds or link previews.',
      },
    ],
    faqs: [
      {
        question: 'Why does Facebook recommend 1200x630 for shared post and link preview images?',
        answer: '1200x630 matches Facebook’s 1.91:1 OpenGraph card and landscape feed container cleanly across desktop and mobile.',
      },
      {
        question: 'Will exported 1200x630 images include a watermark?',
        answer: 'No. Downloads carry zero watermarks.',
      },
      {
        question: 'What if I want 1080x1080 square posts instead?',
        answer: 'Use Facebook Image Resizer.',
      },
      {
        question: 'Does everything stay local in my browser?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-image-resizer',
      'facebook-cover-photo-resizer',
      'facebook-post-preview-generator',
      'facebook-image-compressor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-reel-cover-maker',
    name: 'Facebook Reel Cover Maker',
    slug: 'facebook-reel-cover-maker',
    category: 'facebook-tools',
    url: '/facebook-reel-cover-maker',
    description: 'Create 1080x1920 vertical Facebook Reel cover thumbnails with safe-zone guides (no watermark).',
    longDescription:
      'Keep your Page’s Reels tab organized with cohesive vertical thumbnail covers. Facebook Reel Cover Maker frames local JPG, PNG, or WebP photos up to 20 MB inside your browser into crisp 1080x1920 9:16 covers with title safe zones and zero watermarks.',
    keywords: ['facebook reel cover maker', 'fb reel thumbnail 1080x1920', 'reels cover designer'],
    icon: 'Film',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Reel Cover Maker — 1080x1920 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Reel Cover Maker prepares 1080x1920 vertical Reels covers locally in your browser with safe guides. Zero watermark.',
    howTo: [
      {
        title: 'Choose cover frame or photo',
        description: 'Load a JPG, PNG, or WebP image up to 20 MB inside your browser or design cleanly on canvas.',
      },
      {
        title: 'Position text within Reels safe zones',
        description: 'Keep headlines clear of right-side action buttons and bottom caption text.',
      },
      {
        title: 'Save clean 1080x1920 artwork',
        description: 'Export unwatermarked JPG/PNG artwork ready for Meta Business Suite.',
      },
    ],
    faqs: [
      {
        question: 'What dimensions are used for Facebook Reel covers?',
        answer: 'Vertical 1080x1920 pixels (9:16 aspect ratio) for full Reels tab clarity.',
      },
      {
        question: 'Are exported Reel covers free of watermarks?',
        answer: 'Yes. Zero watermarks.',
      },
      {
        question: 'Can I generate Reels captions alongside my cover?',
        answer: 'Yes—use Facebook Reel Caption Generator.',
      },
      {
        question: 'Does rendering happen locally in my browser?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-reel-idea-generator',
      'facebook-reel-caption-generator',
      'instagram-reel-cover-maker',
      'facebook-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-ad-headline-generator',
    name: 'Facebook Ad Headline Generator',
    slug: 'facebook-ad-headline-generator',
    category: 'facebook-tools',
    url: '/facebook-ad-headline-generator',
    description: 'Draft punchy under-40-char Facebook Ad headlines from formula templates (not AI).',
    longDescription:
      'Meta Ads Manager cuts off ad headlines cleanly past ~27–40 characters on mobile cards. Facebook Ad Headline Generator is strictly formula- and template-based inside your browser—NOT AI-written—fitting your offer, benefit, and urgency into concise headline formulas.',
    keywords: ['facebook ad headline generator', 'meta ad headline templates', '40 char ad headline'],
    icon: 'Megaphone',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Ad Headline Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Ad Headline Generator builds concise under-40-char ad headlines from browser formulas (NOT AI). Free.',
    howTo: [
      {
        title: 'Enter product, core benefit & offer',
        description: 'Enter your product name, core benefit, or guarantee (headlines stay within 40 characters).',
      },
      {
        title: 'Slot into concise headline templates',
        description: 'Browser formulas return crisp under-40-character variations deterministically (NOT AI).',
      },
      {
        title: 'Pair with Ad Copy & CTA',
        description: 'Copy winning options straight into Ads Manager or Facebook Character Counter.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Ad Headline Generator use AI?',
        answer: 'No. Every line is built deterministically from proven direct-response headline templates inside your browser—NOT AI.',
      },
      {
        question: 'Why aim under 40 characters for Facebook Ad headlines?',
        answer: 'Meta displays roughly 27–40 characters cleanly below creative cards without ellipsis truncation.',
      },
      {
        question: 'Can I write the matching Primary Ad Text too?',
        answer: 'Yes—use Facebook Ad Copy Generator.',
      },
      {
        question: 'Are ad details sent to external servers?',
        answer: 'No.',
      },
    ],
    relatedTools: [
      'facebook-ad-copy-generator',
      'facebook-cta-generator',
      'facebook-character-counter',
      'facebook-post-preview-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-ad-copy-generator',
    name: 'Facebook Ad Copy Generator',
    slug: 'facebook-ad-copy-generator',
    category: 'facebook-tools',
    url: '/facebook-ad-copy-generator',
    description: 'Structure Problem-Agitation-Solution & Offer Primary Ad Copy via templates (not AI).',
    longDescription:
      'Keep Primary Text tight within Facebook’s visible 125-character top fold before "See more". Facebook Ad Copy Generator is strictly template-based inside your browser—NOT AI-written—organizing your pain point, benefit bullets, proof, and CTA cleanly.',
    keywords: ['facebook ad copy generator', 'meta primary text templates', 'ad copy formula builder'],
    icon: 'Megaphone',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Ad Copy Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Ad Copy Generator structures Problem-Solution and Offer templates locally in your browser (NOT AI). Tracks 125-char fold.',
    howTo: [
      {
        title: 'Enter target audience, problem & offer',
        description: 'Input your product, pain point, benefit, and call to action.',
      },
      {
        title: 'Fill direct-response templates',
        description: 'Templates organize PAS, Feature-Benefit, and Testimonial frameworks locally (NOT AI).',
      },
      {
        title: 'Verify 125-char visible lead & copy',
        description: 'Ensure the main promise lands before the fold.',
      },
    ],
    faqs: [
      {
        question: 'Are ads written by an AI model?',
        answer: 'No. Copy is assembled deterministically from editable marketing templates inside your browser—NOT AI.',
      },
      {
        question: 'Why track the 125-character threshold?',
        answer: 'Meta recommends keeping Primary Text around 125 characters so mobile feeds avoid cutting off key hooks.',
      },
      {
        question: 'Does it connect to Meta Ads Manager?',
        answer: 'No. Draft and copy privately offline.',
      },
      {
        question: 'Need crisp action buttons or headline ideas?',
        answer: 'Use Facebook CTA Generator and Ad Headline Generator.',
      },
    ],
    relatedTools: [
      'facebook-ad-headline-generator',
      'facebook-cta-generator',
      'facebook-character-counter',
      'facebook-post-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-cta-generator',
    name: 'Facebook CTA Generator',
    slug: 'facebook-cta-generator',
    category: 'facebook-tools',
    url: '/facebook-cta-generator',
    description: 'Select goal-matched closing Call-to-Action lines from conversion templates (not AI).',
    longDescription:
      'Turn passive scrollers into commenters, leads, or store visitors with clear next-step closing lines. Facebook CTA Generator is strictly template-based inside your browser (NOT AI-written)—offering editable closing CTAs for Leads, Comments, Messenger DMs, Events, and Shop visits.',
    keywords: ['facebook cta generator', 'call to action templates fb', 'facebook closing cta'],
    icon: 'MousePointerClick',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook CTA Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook CTA Generator produces goal-based closing Call-to-Action templates locally in your browser (NOT AI). Free.',
    howTo: [
      {
        title: 'Pick campaign goal & action keyword',
        description: 'Choose Comment Trigger, Messenger Quote, Shop Offer, or Event RSVP and enter your topic.',
      },
      {
        title: 'Customize CTA templates',
        description: 'Browser formulas slot your keyword or link cue into concise closing lines (NOT AI).',
      },
      {
        title: 'Paste at the end of posts or ads',
        description: 'Drop straight into Page updates or Meta Ad Primary Text.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook CTA Generator use AI?',
        answer: 'No. It uses curated action-line templates locally inside your browser—NOT AI.',
      },
      {
        question: 'Can it suggest low-friction comment/DM triggers?',
        answer: 'Yes. Includes conversation-starter CTAs aligned with organic Page posts and Messenger replies.',
      },
      {
        question: 'Can I pair CTAs with full ad copy?',
        answer: 'Yes—use Facebook Ad Copy Generator.',
      },
      {
        question: 'Is there any usage cap?',
        answer: 'No.',
      },
    ],
    relatedTools: [
      'facebook-ad-copy-generator',
      'facebook-ad-headline-generator',
      'facebook-post-caption-generator',
      'facebook-dm-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-page-bio-generator',
    name: 'Facebook Page Bio Generator',
    slug: 'facebook-page-bio-generator',
    category: 'facebook-tools',
    url: '/facebook-page-bio-generator',
    description: 'Draft clear Facebook Business Page About & Intro summaries via templates (not AI).',
    longDescription:
      'Tell local customers or online shoppers what you sell, where you serve, and how to reach you in the first glance of your Facebook Page. Facebook Page Bio Generator is strictly template-based inside your browser (NOT AI-written) and tracks both the 101-char Intro and 255-char About summary.',
    keywords: ['facebook page bio generator', 'fb business page about text', 'page intro builder'],
    icon: 'Facebook',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Page Bio Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Page Bio Generator formats clear Business Page Intro and About summaries via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter business name, service & area',
        description: 'Input what your Page offers, location/reach, and hours or CTA.',
      },
      {
        title: 'Select short & extended templates',
        description: 'Browser templates assemble both 101-char Intro and 255-char About blocks cleanly (NOT AI).',
      },
      {
        title: 'Copy into Facebook Page Info',
        description: 'Paste cleanly into your Page Details settings.',
      },
    ],
    faqs: [
      {
        question: 'Is Facebook Page Bio Generator powered by AI?',
        answer: 'No. Everything builds deterministically from structured business templates inside your browser—NOT AI.',
      },
      {
        question: 'How does Page Bio differ from personal Facebook Bio?',
        answer: 'Business Pages benefit from service area, value prop, and trust cues across both 101-char Intro and longer About boxes.',
      },
      {
        question: 'Need help naming the Page first?',
        answer: 'Use Facebook Page Name Generator.',
      },
      {
        question: 'Is this tool completely free?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-bio-generator',
      'facebook-page-name-generator',
      'facebook-cover-photo-maker',
      'facebook-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-group-name-generator',
    name: 'Facebook Group Name Generator',
    slug: 'facebook-group-name-generator',
    category: 'facebook-tools',
    url: '/facebook-group-name-generator',
    description: 'Brainstorm welcoming community names from niche + format templates in your browser (not AI).',
    longDescription:
      'Pick a clear, searchable name that signals who belongs in your Facebook Group immediately. Facebook Group Name Generator is strictly template-based inside your browser (NOT AI-written)—combining your niche subject, audience identity, and community descriptors like Club, Circle, Lounge, or Network.',
    keywords: ['facebook group name generator', 'fb community name templates', 'group naming helper'],
    icon: 'Users',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Group Name Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Group Name Generator builds searchable community names from browser templates (NOT AI). Zero login required.',
    howTo: [
      {
        title: 'Enter topic & member identity',
        description: 'Enter your shared interest, location, or member role inside your browser.',
      },
      {
        title: 'Mix community naming templates',
        description: 'Browser combinations pair keywords with Club, Hub, Creators, Support, and Local formats (NOT AI).',
      },
      {
        title: 'Check search clarity & copy',
        description: 'Pick a clear, descriptive Group title and draft the matching rules/bio next.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Group Name Generator use AI?',
        answer: 'No. Combinations come from curated community prefix/suffix matrices inside your browser—NOT AI.',
      },
      {
        question: 'Why include clear topic keywords in a Group name?',
        answer: 'Descriptive keywords help ideal members find your community in Facebook Search.',
      },
      {
        question: 'Can I write the Group description & welcome rules next?',
        answer: 'Yes—use Facebook Group Description Generator.',
      },
      {
        question: 'Does this check whether a Group already exists?',
        answer: 'No—verify live Group names in Facebook Search.',
      },
    ],
    relatedTools: [
      'facebook-group-description-generator',
      'facebook-page-name-generator',
      'facebook-post-idea-generator',
      'facebook-dm-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-group-description-generator',
    name: 'Facebook Group Description Generator',
    slug: 'facebook-group-description-generator',
    category: 'facebook-tools',
    url: '/facebook-group-description-generator',
    description: 'Create welcoming Group About descriptions and starter community rules via templates (not AI).',
    longDescription:
      'Set clear expectations before members click Join Group. Facebook Group Description Generator is strictly template-based inside your browser (NOT AI-written)—formatting Who It Is For, What To Post, and Be-Kind / No-Spam starter rules in clean scannable sections.',
    keywords: ['facebook group description generator', 'fb group about template', 'community rules template'],
    icon: 'ListChecks',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Facebook Group Description Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Group Description Generator builds Group About sections and starter rules from browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter Group focus & allowed topics',
        description: 'Fill in ideal members, allowed topics, and starter rule options.',
      },
      {
        title: 'Generate structured Group template',
        description: 'Browser templates organize Mission, Allowed Topics, and 3–5 Community Rules locally (NOT AI).',
      },
      {
        title: 'Copy into Facebook Group Settings',
        description: 'Paste cleanly into your About section and Rule cards.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Group Description Generator use AI?',
        answer: 'No. Every description builds deterministically from structured community templates in your browser—NOT AI.',
      },
      {
        question: 'Does it include ready-to-edit Group rules?',
        answer: 'Yes. Toggleable No-Spam, Respectful Feedback, and Relevant Posts templates are included.',
      },
      {
        question: 'Can I pair this with a Group name brainstormer?',
        answer: 'Yes—check Facebook Group Name Generator.',
      },
      {
        question: 'Is this tool free and private?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'facebook-group-name-generator',
      'facebook-page-bio-generator',
      'facebook-post-idea-generator',
      'facebook-text-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'facebook-post-preview-generator',
    name: 'Facebook Post Preview Generator',
    slug: 'facebook-post-preview-generator',
    category: 'facebook-tools',
    url: '/facebook-post-preview-generator',
    description: 'Preview Facebook feed posts across Desktop & Mobile with "...See more" toggle and PNG export.',
    longDescription:
      'See how your Page name, profile picture, post copy, and post image appear together in a realistic Facebook feed card before publishing. Facebook Post Preview Generator runs strictly in your browser (NOT AI)—allowing local image previews up to 10 MB across genuinely different Desktop and Mobile layouts with unwatermarked PNG download.',
    keywords: ['facebook post preview generator', 'fb feed mockup tool', 'preview facebook post layout'],
    icon: 'Eye',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Facebook Post Preview Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Facebook Post Preview Generator visualizes Page posts on Desktop & Mobile with See More toggle and PNG export in your browser.',
    howTo: [
      {
        title: 'Enter Page name, copy & optional image',
        description: 'Enter Page name, post text, and optionally upload a profile picture and post image up to 10 MB.',
      },
      {
        title: 'Inspect desktop & mobile feed template',
        description: 'Check where "...See more" collapses and verify image proportions cleanly (NOT AI).',
      },
      {
        title: 'Export unwatermarked PNG mockup',
        description: 'Download a crisp preview card for client sign-off or team review.',
      },
    ],
    faqs: [
      {
        question: 'Does Facebook Post Preview Generator use AI or post to Facebook?',
        answer: 'No. It renders an offline browser layout template locally—NOT AI and never connects to Facebook.',
      },
      {
        question: 'Will exported mockup PNGs include a watermark?',
        answer: 'No. Clean, unwatermarked downloads.',
      },
      {
        question: 'Does it show accurate "...See more" line truncation?',
        answer: 'Yes. Highlights desktop and mobile line cutoff approximations cleanly.',
      },
      {
        question: 'Is there an Instagram post mockup tool too?',
        answer: 'Yes—check Instagram Screenshot Mockup Generator.',
      },
    ],
    relatedTools: [
      'instagram-screenshot-mockup-generator',
      'facebook-post-image-resizer',
      'facebook-post-caption-generator',
      'facebook-post-scheduler-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
] as const;
