import {SITE_CONFIG} from '../config/site';
import {DEVELOPER_TOOLS} from './developerTools';
import {DOCUMENT_TOOLS} from './documentTools';
import {FACEBOOK_TOOLS} from './facebookTools';
import {FINANCE_TOOLS} from './financeTools';
import {GENERATOR_TOOLS} from './generatorTools';
import {INSTAGRAM_TOOLS} from './instagramTools';
import {LAND_AREA_UNIT_TOOLS} from './landAreaTools';
import {LINKEDIN_TOOLS} from './linkedinTools';
import {LOOKUP_TOOLS} from './lookupTools';
import {NUMBER_SYSTEM_TOOLS} from './numberSystemTools';
import {PINTEREST_TOOLS} from './pinterestTools';
import {PRODUCTIVITY_TOOLS} from './productivityTools';
import {REDDIT_TOOLS} from './redditTools';
import {SCIENCE_TOOLS} from './scienceTools';
import {SNAPCHAT_TOOLS} from './snapchatTools';
import {THREADS_TOOLS} from './threadsTools';
import {TIKTOK_TOOLS} from './tiktokTools';
import {TWITTER_TOOLS} from './twitterTools';
import {UNIT_CONVERTER_ADDITIONS} from './unitConverterAdditions';
import {UNIT_CONVERTER_TOOLS} from './unitConverters';

export type ProcessingMethod = 'browser' | 'server-service' | 'external-api';

export type ToolCategoryId =
  | 'pdf-tools'
  | 'image-tools'
  | 'video-tools'
  | 'converter-tools'
  | 'youtube-tools'
  | 'instagram-tools'
  | 'facebook-tools'
  | 'tiktok-tools'
  | 'pinterest-tools'
  | 'linkedin-tools'
  | 'reddit-tools'
  | 'twitter-tools'
  | 'snapchat-tools'
  | 'threads-tools'
  | 'productivity-tools'
  | 'unit-converters'
  | 'science-tools'
  | 'generators'
  | 'developer-tools'
  | 'document-tools'
  | 'finance-tools'
  | 'number-system-converters'
  | 'lookup-tools'
  | 'file-tools'
  | 'web-tools';

export interface ToolHowToStep {
  title: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  shortName: string;
  slug: string;
  url: string;
  description: string;
  intro: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  faqs: ToolFaq[];
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: ToolCategoryId;
  url: string;
  description: string;
  longDescription: string;
  keywords: string[];
  icon: string;
  acceptedFormats: string[];
  maxFileSizeMB: number | null;
  maxFiles: number | null;
  maxDurationMinutes?: number;
  maxResolution?: string;
  maxClipSeconds?: number;
  maxDataRows?: number;
  processingMethod: ProcessingMethod;
  seoTitle: string;
  seoDescription: string;
  howTo: [ToolHowToStep, ToolHowToStep, ToolHowToStep];
  faqs: ToolFaq[];
  relatedTools: [string, string, string, string];
  popular: boolean;
  featured: boolean;
  rating: null;
  status: 'active' | 'coming-soon';
}

export const CATEGORIES: readonly ToolCategory[] = [
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDF',
    slug: 'pdf-tools',
    url: '/pdf-tools',
    description:
      'Combine, split, compress, convert, rotate, sign, and manage PDF documents cleanly.',
    intro:
      'Our browser PDF suite covers everyday document tasks—from merging reports and compressing PDFs to converting Office files and annotating pages—with transparent limits and instant client-side processing.',
    icon: 'FileText',
    seoTitle: `PDF Tools — Online PDF Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 34 PDF tools including Merge PDF, Split PDF, PDF Editor, PDF to Excel, and Compress PDF in one clean workspace.',
    faqs: [
      {
        question: 'Are the PDF tools live and accepting uploads right now?',
        answer:
          'Yes! Core PDF tools including Merge, Split, Compress, Rotate, PDF to JPG/PNG, PDF Editor, PDF to Word, PDF to Excel, Excel to PDF, and Text/Word to PDF are now fully functional in your browser. Advanced cryptographic security features such as Sign PDF, Unlock PDF, and Protect PDF remain Coming Soon in Phase 3.',
      },
      {
        question: 'Are PDF files processed in my browser or on a server?',
        answer:
          'All active PDF tools—including merging, splitting, compressing, rotating, editing, and document conversions—run directly in your browser without uploading files to external servers.',
      },
      {
        question: 'Will signing a PDF create a legally certified digital signature?',
        answer:
          'No. The planned Sign PDF tool will place a basic electronic signature (drawn, typed, or image-based) and will not issue cryptographic or CA-certified signatures.',
      },
      {
        question: 'Can Unlock PDF bypass forgotten passwords?',
        answer:
          'No. Unlock PDF will only remove password protection when you supply the valid existing password. There will be no password cracking or security bypass.',
      },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    shortName: 'Image',
    slug: 'image-tools',
    url: '/image-tools',
    description:
      'Compress, resize, crop, convert images, build round profile photos, and generate PNG charts.',
    intro:
      'Our browser Image Tools workspace helps photographers, designers, and everyday creators compress heavy assets, resize social graphics, crop to exact aspect ratios, craft round profile photos, turn data rows into charts, and convert formats directly in the browser.',
    icon: 'Image',
    seoTitle: `Image Tools — Resize, Compress & Convert | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 6 free browser image utilities: Compress Image, Resize Image, Convert Image, Crop Image, Profile Photo Maker, and Chart Maker.',
    faqs: [
      {
        question: 'Which image formats are supported across the image tools?',
        answer:
          'Image tools work with common web and print raster formats including JPG, PNG, and WebP, with AVIF input supported on Convert Image.',
      },
      {
        question: 'Do image tools run locally in the browser?',
        answer:
          'Yes. All 6 Image Tools—including Profile Photo Maker and Chart Maker—run client-side in your browser without sending pixels to an external server.',
      },
      {
        question: 'Can I batch process multiple images at once?',
        answer:
          'Compress Image, Resize Image, and Convert Image handle up to 20 images per batch (max 30 MB each), while Crop Image and Profile Photo Maker focus on single-frame precision.',
      },
      {
        question: 'Do image tools strip camera EXIF metadata?',
        answer:
          'Re-encoding via browser HTML5 canvas strips unnecessary EXIF metadata automatically for smaller, privacy-clean web files.',
      },
    ],
  },
  {
    id: 'video-tools',
    name: 'Video Tools',
    shortName: 'Video',
    slug: 'video-tools',
    url: '/video-tools',
    description:
      'Compress and convert clips, switch audio formats, extract MP3 tracks, and turn short scenes into GIFs.',
    intro:
      'Video and audio files quickly outgrow email attachments and messaging limits. Our 6 Video Tools handle MP4/WebM/MOV/MKV conversion, compression, MP3/WAV/OGG audio conversion, browser MP3 extraction, and lightweight GIF creation locally in your browser without desktop installs.',
    icon: 'Film',
    seoTitle: `Video Tools — Compress & Convert Clips | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 6 free browser video and audio tools: Compress Video, Video Converter, Audio Converter, Video to MP4, Video to GIF, and Video to Audio.',
    faqs: [
      {
        question: 'How do video tools process clips without server uploads?',
        answer:
          'All 6 video and audio tools run locally inside your browser using free open-source FFmpeg compiled to WebAssembly. The FFmpeg engine loads lazily only when you open a video tool page so the rest of the site stays fast.',
      },
      {
        question: 'What maximum limits apply to the video tools?',
        answer:
          'Compress Video, Video Converter, Video to MP4, and Video to Audio support files up to 100 MB and 3 minutes max duration (720p max output for video files). Video to GIF accepts source files up to 100 MB with a 10-second maximum GIF clip, and Audio Converter supports audio files up to 100 MB at 128–320 kbps.',
      },
      {
        question: 'Does Video to GIF convert an entire long video?',
        answer:
          'No. For Video to GIF, you pick a short clip of up to 10 seconds only—the whole video is never converted to GIF.',
      },
      {
        question: 'Can I convert audio files or extract MP3 tracks without uploading?',
        answer:
          'Yes. Both Audio Converter and Video to Audio run locally in your browser so your media never leaves your device.',
      },
    ],
  },
  {
    id: 'converter-tools',
    name: 'Converter Tools',
    shortName: 'Converter',
    slug: 'converter-tools',
    url: '/converter-tools',
    description:
      'Convert and split Excel, CSV, XML, JSON, and simple spreadsheet PDFs directly in your browser.',
    intro:
      'Converter Tools brings together 12 lightweight spreadsheet and structured-data utilities—making it simple to transform Excel workbooks, CSV tables, XML feeds, and JSON payloads locally in your browser without uploads or account sign-ups.',
    icon: 'ArrowLeftRight',
    seoTitle: `Converter Tools — Excel, CSV, XML & JSON | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 12 free browser-based Converter Tools for Excel, CSV, XML, JSON, and simple Excel-to-PDF workflows.',
    faqs: [
      {
        question: 'Do Converter Tools run in my browser or on a server?',
        answer:
          'All 12 Converter Tools run locally inside your web browser—your spreadsheets, CSV tables, XML files, and JSON data stay on your device.',
      },
      {
        question: 'What file size limits apply to Converter Tools?',
        answer:
          'Standard CSV, Excel, XML, and JSON utilities support files up to 10 MB per file, while Excel to PDF supports simple workbooks up to 25 MB.',
      },
      {
        question: 'Are complex Excel formulas and charts preserved in Excel to PDF?',
        answer:
          'No. Excel to PDF is built for simple spreadsheets only—complex formatting, formulas, macros, and embedded charts are not preserved.',
      },
      {
        question: 'Are any outputs watermarked in Converter Tools?',
        answer:
          'No. Every Converter Tool produces clean, unwatermarked files with zero daily fees.',
      },
    ],
  },
  {
    id: 'youtube-tools',
    name: 'YouTube Tools',
    shortName: 'YouTube',
    slug: 'youtube-tools',
    url: '/youtube-tools',
    description:
      'Thumbnail utilities, URL & ID parsers, character counters, template generators, and creator calculators.',
    intro:
      'YouTube Tools packs 40 browser-based creator utilities—covering thumbnail checks and formatting, character counters, template-based title/script/tag helpers (no AI), and monetization/channel calculators—all free with zero watermarks.',
    icon: 'Youtube',
    seoTitle: `YouTube Tools — 40 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 40 browser-based YouTube Tools: thumbnail utilities, counters, template generators, and creator calculators.',
    faqs: [
      {
        question: 'Do the YouTube generator tools use AI?',
        answer:
          'No. Every generator under YouTube Tools (titles, descriptions, tags, hooks, scripts, ideas, channel names, chapters, and calendars) is strictly template- or formula-based inside your browser—NOT AI-written.',
      },
      {
        question: 'Are YouTube Earnings, RPM, and CPM Calculators exact?',
        answer:
          'No. Earnings, RPM, and CPM calculators are estimates only—actual earnings vary by niche, country, and ad rates.',
      },
      {
        question: 'Is YouTube Thumbnail Text Extractor available yet?',
        answer:
          'YouTube Thumbnail Text Extractor is currently coming soon, as reliable text extraction from thumbnail images is not yet available in-browser.',
      },
      {
        question: 'Will any YouTube Tools add watermarks to downloads?',
        answer:
          'No. Every YouTube Tool output is completely free and unwatermarked.',
      },
    ],
  },
  {
    id: 'instagram-tools',
    name: 'Instagram Tools',
    shortName: 'Instagram',
    slug: 'instagram-tools',
    url: '/instagram-tools',
    description:
      'Template bio & caption builders, Unicode fonts, exact 1080px resizers, giveaway pickers, and creator calculators.',
    intro:
      'Instagram Tools includes 38 browser-based utilities for creators and social managers—covering template-based bio/caption/hashtag helpers (no AI), line-break and font formatters, 1080px image & Story/Reel resizers, grid previews, pasted-list giveaway pickers, and engagement calculators—all free with zero watermarks.',
    icon: 'Instagram',
    seoTitle: `Instagram Tools — 38 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 38 upcoming browser-based Instagram Tools: template bio & caption helpers, 1080px resizers, grid previews, and pasted giveaway pickers.',
    faqs: [
      {
        question: 'Do Instagram generators use AI?',
        answer:
          'No. Every generator under Instagram Tools (bios, usernames, captions, hashtags, hooks, scripts, comments, replies, and DMs) is strictly template-based inside your browser—never AI-generated.',
      },
      {
        question: 'Can Giveaway or Comment Pickers fetch real Instagram comments?',
        answer:
          'No. Both pickers work exclusively from names or comments you paste directly into the tool—they cannot log into Instagram or fetch real entrants/comments.',
      },
      {
        question: 'What dimensions do Instagram resizers target?',
        answer:
          'Instagram Image Resizer covers square (1080x1080), portrait (1080x1350), and vertical (1080x1920), while Story Image Resizer and Reel Cover Maker target 1080x1920—all without watermarks.',
      },
      {
        question: 'Does the Username Checker verify real Instagram availability?',
        answer:
          'No. It checks username format, allowed characters, and length rules only—it cannot query Instagram for real handle availability.',
      },
    ],
  },
  {
    id: 'facebook-tools',
    name: 'Facebook Tools',
    shortName: 'Facebook',
    slug: 'facebook-tools',
    url: '/facebook-tools',
    description:
      'Page & post template helpers, 820x312 cover & 1200x630 post resizers, pasted giveaway pickers, and calculators.',
    intro:
      'Facebook Tools packs 39 browser-based utilities for Page managers, Groups, and Marketplace sellers—covering template post/bio/ad/CTA helpers (no AI), Unicode & spacing formatters, exact 820x312 cover and 1200x630 post resizers, pasted-only giveaway pickers, and a plan-only post scheduler—all free with zero watermarks.',
    icon: 'Facebook',
    seoTitle: `Facebook Tools — 39 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 39 upcoming browser-based Facebook Tools: template page & ad helpers, 820x312 cover & 1200x630 resizers, and pasted giveaway pickers.',
    faqs: [
      {
        question: 'Do Facebook generators use AI?',
        answer:
          'No. Every generator under Facebook Tools (bios, page names, captions, hashtags, posts, ads, CTAs, polls, replies, and Marketplace descriptions) is strictly template-based—NOT AI.',
      },
      {
        question: 'Can Facebook Post Scheduler Planner publish posts automatically?',
        answer:
          'No. Facebook Post Scheduler Planner is a plan-only calendar and checklist builder—it cannot connect to Facebook or schedule or publish posts automatically.',
      },
      {
        question: 'Do Facebook Giveaway and Comment Pickers pull live Facebook data?',
        answer:
          'No. They select winners strictly from names or comments you paste into the browser and cannot fetch real entrants or comments from Facebook.',
      },
      {
        question: 'What sizes do Facebook Cover and Post Image tools use?',
        answer:
          'Cover Photo Resizer and Cover Photo Maker target Facebook’s 820x312 cover size, and Post Image Resizer targets 1200x630—all free with zero watermarks.',
      },
    ],
  },
  {
    id: 'tiktok-tools',
    name: 'TikTok Tools',
    shortName: 'TikTok',
    slug: 'tiktok-tools',
    url: '/tiktok-tools',
    description:
      'Template bio, caption & script helpers, 1080x1920 cover & thumbnail makers, pasted giveaway pickers, and calculators.',
    intro:
      'TikTok Tools includes 37 browser-based utilities for short-form creators—covering template-based bio/caption/hook/script helpers (no AI), Unicode font & character limits, 1080x1920 cover and photo resizers, pasted-list giveaway pickers, and estimate-only revenue/growth calculators—all free with zero watermarks.',
    icon: 'Music2',
    seoTitle: `TikTok Tools — 37 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 37 upcoming browser-based TikTok Tools: template captions & hooks, 1080x1920 cover makers, pasted pickers, and calculators.',
    faqs: [
      {
        question: 'Do TikTok generators use AI?',
        answer:
          'No. Every generator under TikTok Tools (usernames, bios, captions, hashtags, hooks, script outlines, titles, descriptions, comments, replies, and DMs) is strictly template-based inside your browser—never AI-generated.',
      },
      {
        question: 'Are Trending Hashtag Ideas or Viral Video Ideas live data or guaranteed?',
        answer:
          'No. Trending Hashtag Ideas are curated template ideas (NOT live trending data), and Viral Video Idea Generator uses structured hook templates that cannot guarantee virality.',
      },
      {
        question: 'Are TikTok Money and Earnings Calculators exact payouts?',
        answer:
          'No. Both calculators provide ESTIMATE ONLY ranges—actual payouts vary by region, qualified views, niche, and brand terms.',
      },
      {
        question: 'Do TikTok Giveaway or Comment Pickers fetch live TikTok comments?',
        answer:
          'No. Both pickers work exclusively from names or comments you paste into the browser—they cannot pull live comments from TikTok.',
      },
    ],
  },
  {
    id: 'pinterest-tools',
    name: 'Pinterest Tools',
    shortName: 'Pinterest',
    slug: 'pinterest-tools',
    url: '/pinterest-tools',
    description:
      'Template board & SEO descriptions, 1000x1500 Pin collages, 600x600 board covers, free in-browser OCR, and previews.',
    intro: 'Pinterest Tools brings 17 browser-based creator utilities—covering template board/bio/SEO/alt-text helpers (no AI, no auto-vision), 1000x1500 collage and Pin mockup builders, 600x600 board covers, color palette extraction, and Pin engagement calculators—all free with zero watermarks.',
    icon: 'Pin',
    seoTitle: `Pinterest Tools — 17 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 17 browser-based Pinterest Tools: template SEO copy, 1000x1500 collages, 600x600 board covers, and Pin previews.',
    faqs: [
      {
        question: 'Do Pinterest generators use AI?',
        answer:
          'No. Every generator under Pinterest Tools (board descriptions, usernames, bios, Pin ideas, SEO descriptions, alt text, calendars, Rich Pin previews, and Pin mockups) is strictly template-based inside your browser—NOT AI.',
      },
      {
        question: 'How does Pinterest Alt Text Generator work?',
        answer:
          'It formats accessible alt text strictly from YOUR own visual description of the image using browser templates—it does NOT use auto-vision or AI.',
      },
      {
        question: 'Is Pinterest Pin Text Extractor available yet?',
        answer:
          'Pinterest Pin Text Extractor is currently Coming Soon because reliable client-side in-browser OCR is not yet supported.',
      },
      {
        question: 'Will any Pinterest Tools add watermarks to collages or covers?',
        answer:
          'No. Every Pinterest Tool exports clean, unwatermarked artwork.',
      },
    ],
  },
  {
    id: 'linkedin-tools',
    name: 'LinkedIn Tools',
    shortName: 'LinkedIn',
    slug: 'linkedin-tools',
    url: '/linkedin-tools',
    description:
      'Browser-based LinkedIn text formatters, 1584x396 banners, 400x400 profile resizers, template copy helpers, and profile tools with zero login.',
    intro:
      'LinkedIn Tools brings 24 browser-based professional creator utilities—covering Unicode text formatting, 3,000-character post counting, 1584x396 banner builders, 400x400 profile photo and 1200x627 post resizers, template-based bio/headline/InMail helpers (NOT AI), and a browser-saved profile optimization checklist—all free, watermark-free, and requiring zero LinkedIn login.',
    icon: 'Linkedin',
    seoTitle: `LinkedIn Tools — 24 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 24 browser-based LinkedIn Tools: template headline & summary helpers, 1584x396 banners, text formatting, and zero login.',
    faqs: [
      {
        question: 'Do any LinkedIn Tools require signing in with a LinkedIn account?',
        answer:
          'No. Every LinkedIn Tool runs locally inside your browser tab without LinkedIn OAuth or account credentials.',
      },
      {
        question: 'Are LinkedIn headline, summary, post, and comment generators AI-written?',
        answer:
          'No. Every generator under LinkedIn Tools is strictly template-based inside your browser—NOT AI.',
      },
      {
        question: 'What image dimensions do the LinkedIn resizers and banner maker support?',
        answer:
          'Profile Picture Resizer targets 400x400 px, Banner Maker & Resizer target 1584x396 px, and Post Image Resizer targets 1200x627 px.',
      },
      {
        question: 'Will LinkedIn carousels, quote cards, or resized banners include a watermark?',
        answer:
          'No. Every LinkedIn Tool exports clean, unwatermarked files.',
      },
    ],
  },
  {
    id: 'reddit-tools',
    name: 'Reddit Tools',
    shortName: 'Reddit',
    slug: 'reddit-tools',
    url: '/reddit-tools',
    description:
      'Browser-based Reddit Markdown editors, character counters, format-only username checks, karma estimators, and comment helpers with no posting or login.',
    intro:
      'Reddit Tools brings 18 browser-based utilities designed for Reddit users—covering 40,000-character post and 300-character title counters, Reddit Markdown and spoiler formatting, format-only username validation, ESTIMATE-ONLY karma calculations, pasted-comment random pickers, and template-based copy helpers (NOT AI)—with zero Reddit login and no live posting to Reddit.',
    icon: 'MessageCircle',
    seoTitle: `Reddit Tools — 18 Community Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 18 upcoming browser-based Reddit Tools: Markdown formatting, 40,000-char counter, format checks, karma estimator, and no login.',
    faqs: [
      {
        question: 'Can any of these Reddit Tools post directly to Reddit or log into my account?',
        answer:
          'No. These tools are strictly for Reddit users to draft, format, and plan locally in the browser—they do not post on Reddit and require zero Reddit login.',
      },
      {
        question: 'Is the Reddit Karma Calculator exact?',
        answer:
          "No. It is ESTIMATE ONLY because Reddit's exact karma calculation formula is not public.",
      },
      {
        question: 'Does Reddit Username Checker check real username availability?',
        answer:
          'No. Reddit Username Checker checks FORMAT ONLY (3–20 characters and allowed syntax) and never queries live Reddit accounts.',
      },
      {
        question: 'Do Reddit generators use AI?',
        answer:
          'No. Every Reddit generator (post, comment, title, AMA questions, post ideas, subreddit description, and bio) is strictly template-based inside your browser—NOT AI.',
      },
    ],
  },
  {
    id: 'twitter-tools',
    name: 'Twitter Tools',
    shortName: 'Twitter',
    slug: 'twitter-tools',
    url: '/twitter-tools',
    description:
      'Browser-based Twitter/X 280-char counters, thread splitters, 1500x500 headers, template tweet helpers, and post resizers with zero login.',
    intro:
      'Twitter Tools brings 14 browser-based post and profile utilities—covering 280-character tweet counters, 160-character bio counters, automatic thread splitting, 1500x500 header, 400x400 avatar, and 1600x900 post resizers, Unicode fonts, and template-based tweet/bio/thread/hashtag/quote generators (NOT AI)—free, watermark-free, and requiring no X/Twitter login.',
    icon: 'Twitter',
    seoTitle: `Twitter Tools — 14 Post & Thread Tools | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 14 upcoming browser-based Twitter Tools: 280-char counter, thread maker, 1500x500 headers, template copy helpers, and zero login.',
    faqs: [
      {
        question: 'Do Twitter Tools require connecting an X or Twitter account?',
        answer:
          'No. Every tool in this category runs directly in your browser without Twitter/X login or posting permissions.',
      },
      {
        question: 'Do the tweet, thread, bio, quote, or hashtag generators use AI?',
        answer:
          'No. All Twitter generators are strictly template-based and rule-driven inside your browser—NOT AI.',
      },
      {
        question: 'What exact dimensions and limits are built into the Twitter tools?',
        answer:
          'Standard tweets count up to 280 characters, bios up to 160 characters, headers resize to 1500x500 px, profile pictures to 400x400 px, and post images to 1600x900 px.',
      },
      {
        question: 'Will resized Twitter headers or post images have watermarks?',
        answer:
          'No. Every Twitter Tool exports clean images with zero watermarks.',
      },
    ],
  },
  {
    id: 'snapchat-tools',
    name: 'Snapchat Tools',
    shortName: 'Snapchat',
    slug: 'snapchat-tools',
    url: '/snapchat-tools',
    description:
      'Browser-based 1080x1920 Snapchat story resizers, Snapcode helpers, format-only username checks, streak tools, and template captions with no login.',
    intro:
      'Snapchat Tools brings 20 browser-based creator utilities—covering 1080x1920 vertical story resizers, geofilter canvas sizes, Snapcode card builders, format-only username syntax validation, streak & score calculators, a browser-saved Snap Score tracker template, and template-based caption, bio, username, and Spotlight idea helpers (NOT AI)—all free with no Snapchat login or watermarks.',
    icon: 'Ghost',
    seoTitle: `Snapchat Tools — 20 Story & Creator Tools | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 20 upcoming browser-based Snapchat Tools: 1080x1920 story resizer, Snapcode helper, streak calculator, format checks, and no login.',
    faqs: [
      {
        question: 'Does Snapchat Username Format Checker verify live username availability?',
        answer:
          'No. It checks Snapchat username FORMAT ONLY (length and permitted characters) locally in your browser without querying Snapchat.',
      },
      {
        question: 'How does Snapchat Score Tracker Template work without login?',
        answer:
          'It is a browser-saved manual tracker where you record Snap Score milestones locally on your device—no Snapchat login or live account syncing is needed.',
      },
      {
        question: 'Are Snapchat caption, bio, username, story, or Bitmoji idea generators AI?',
        answer:
          'No. Every generator under Snapchat Tools is strictly template-based inside your browser—NOT AI.',
      },
      {
        question: 'Do Snapchat story resizers or Snapcode graphics include watermarks?',
        answer:
          'No. Every Snapchat Tool exports unwatermarked images and text.',
      },
    ],
  },
  {
    id: 'threads-tools',
    name: 'Threads Tools',
    shortName: 'Threads',
    slug: 'threads-tools',
    url: '/threads-tools',
    description:
      'Browser-based Threads 500-char counters, 150-char bio counters, thread splitters, Unicode fonts, and template post helpers with zero login.',
    intro:
      'Threads Tools brings 20 browser-based short-form writing and visual utilities—covering 500-character post and 150-character bio counters, multi-post thread splitting, engagement calculators, Unicode text styling, and template-based post, bio, hook, poll, reply, CTA, and carousel idea helpers (NOT AI)—all free, watermark-free, and requiring zero social login.',
    icon: 'AtSign',
    seoTitle: `Threads Tools — 20 Creator Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 20 upcoming browser-based Threads Tools: 500-char counter, thread splitter, Unicode fonts, template hooks & bios, and zero login.',
    faqs: [
      {
        question: 'What character limits do the Threads counters track?',
        answer:
          'Threads Character Counter tracks the 500-character post limit, and Threads Bio Character Counter tracks the 150-character profile bio limit.',
      },
      {
        question: 'Do any Threads generators use AI?',
        answer:
          'No. Every generator under Threads Tools (posts, threads, bios, usernames, hooks, questions, polls, quotes, CTAs, replies, calendars, and carousel text) is template-based only—NOT AI.',
      },
      {
        question: 'Do I need to connect my Threads or Instagram account?',
        answer:
          'No. All 20 Threads Tools run locally in your browser tab with zero social login.',
      },
      {
        question: 'Are exported Threads graphics or formatted posts watermarked?',
        answer:
          'No. Every Threads Tool produces clean exports with zero watermarks.',
      },
    ],
  },
  {
    id: 'productivity-tools',
    name: 'Productivity Tools',
    shortName: 'Productivity',
    slug: 'productivity-tools',
    url: '/productivity-tools',
    description:
      'Browser-based to-do lists, Kanban boards, planners, sticky notes, timers, habit/water/mood logs, and local reminders.',
    intro:
      'Productivity Tools gathers 12 browser-based personal planning and focus utilities—including Smart To-Do List, Kanban Task Board, Daily Planner, Sticky Notes, Meeting Notes (.txt download), Countdown and Pomodoro Timers, Habit Streak, Water Tracker, Mood Tracker, currency-neutral Expense Reminder, and daily-reset Medicine Reminder—all free, watermark-free, and saved locally in your browser without AI or login.',
    icon: 'CheckSquare',
    seoTitle: `Productivity Tools — 12 Local Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 12 browser-based Productivity Tools: to-do lists, Kanban board, planners, timers, sticky notes, and trackers.',
    faqs: [
      {
        question: 'Where do Productivity Tools store my tasks, notes, and logs?',
        answer:
          'All entries save locally in your browser storage on your device without creating an account or syncing to a remote server.',
      },
      {
        question: 'Do any Productivity Tools use AI?',
        answer:
          'No. Every planner, note editor, timer, tracker, and checklist operates deterministically from your own inputs—no AI is used.',
      },
      {
        question: 'Can I use Expense Reminder in my local currency?',
        answer:
          'Yes. Expense Reminder is currency-neutral so you can type any currency symbol or code you prefer.',
      },
      {
        question: 'Will Meeting Notes or checklists include watermarks?',
        answer:
          'No. Every Productivity Tool is free with zero watermarks.',
      },
    ],
  },
  {
    id: 'unit-converters',
    name: 'Unit Converters',
    shortName: 'Units',
    slug: 'unit-converters',
    url: '/unit-converters',
    description:
      'Browser-based exact formula conversions for acreage, land area, length, weight, pressure, temperature, speed, clothing/shoe/ring sizes, and 150+ currencies.',
    intro:
      'Unit Converters offers 62 pure-formula measurement calculators running in your browser: acreage geometry and acre/hectare/perch/sq ft/sq m/sq yd/sq mi conversions, state-wise Indian land units, length, weight/mass, temperature, pressure, speed, torque, power, energy, frequency/wavelength, scale models, apparel/sizing charts, file sizes, data rates, and 150+ Currency Converter.',
    icon: 'Scale',
    seoTitle: `Unit Converters — 62 Measurement Tools | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 62 upcoming browser Unit Converters: acreage, acres/hectares/sq ft/perches, Indian land units, length, mass, pressure, sizing & currency.',
    faqs: [
      {
        question: 'Are all Unit Converters pure formula calculators without AI?',
        answer:
          'Yes. All physical, metric/Imperial, apparel/sizing, and scale conversions use exact mathematical formulas and standard charts locally in your browser—NOT AI.',
      },
      {
        question: 'Why does Land Area Converter note that bigha size varies by region?',
        answer:
          'Traditional units like bigha, biswa, and katha have different official sq ft values across states and localities, whereas acres, hectares, gunthas, cents, and gaj follow fixed multipliers.',
      },
      {
        question: 'Are Currency Converter exchange rates bank rates?',
        answer:
          'No. Live rates fetched from the free keyless public exchange-rate API are indicative mid-market rates, not bank or remittance rates, and you can also enter a rate manually.',
      },
      {
        question: 'Do inches, cm, feet, kg, lbs, bar, kPa, and psi conversions run offline?',
        answer:
          'Yes. All unit conversion math runs instantaneously inside your browser with zero uploads or login.',
      },
    ],
  },
  {
    id: 'science-tools',
    name: 'Science Tools',
    shortName: 'Science',
    slug: 'science-tools',
    url: '/science-tools',
    description:
      'Browser-based chemistry solution calculators, multi-formula physics solvers, and DNA/RNA sequence converters.',
    intro:
      'Science Tools brings 3 deterministic STEM calculators directly to your browser: Chemistry Solutions Calculator (molarity, molality, normality, mole fraction, M1V1 = M2V2 dilution, pH/[H+]/pOH), Physics Calculator (solving whichever variable is left empty across mechanics, waves, and Ohm’s Law), and DNA/RNA Converter (T↔U, complement, and reverse complement).',
    icon: 'FlaskConical',
    seoTitle: `Science Tools — 3 STEM Calculators | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 3 upcoming browser-based Science Tools: Chemistry Solutions Calculator, Physics Calculator, and DNA/RNA Converter.',
    faqs: [
      {
        question: 'Do Science Tools use AI or server computation?',
        answer:
          'No. Every chemistry, physics, and DNA/RNA formula runs deterministically inside your browser tab.',
      },
      {
        question: 'Can Physics Calculator solve for any missing variable?',
        answer:
          'Yes. Enter known variables and leave the target variable empty across F = ma, KE, PE, W, P, pressure, speed, wave speed, and V = IR.',
      },
      {
        question: 'What chemistry calculations are supported?',
        answer:
          'Molarity, molality, normality, mole fraction, dilution (M1V1 = M2V2), and pH from pH, [H+], or pOH.',
      },
      {
        question: 'Are Science Tools free without sign-up?',
        answer:
          'Yes. All 3 tools are free, private, and require zero login.',
      },
    ],
  },
  {
    id: 'generators',
    name: 'Generators',
    shortName: 'Generators',
    slug: 'generators',
    url: '/generators',
    description:
      'Browser-based static QR codes, barcodes, Web Crypto passwords, bulk UUIDs, URL slugs, name lists, MACs, and Django/WordPress secrets.',
    intro:
      'Generators provides 9 fast, deterministic utilities running locally in your browser (NOT AI): static QR codes (never expire), retail Code 128/39/EAN-13/UPC-A barcodes (PNG/PDF), Web Crypto passwords, 1–1,000 v4 UUIDs, URL slugs, random English name lists, locally-administered test MAC addresses, Django SECRET_KEYs, and WordPress salts.',
    icon: 'QrCode',
    seoTitle: `Generators — 9 Browser Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 9 browser Generators: QR codes, barcodes, passwords, UUIDs, slugs, names, MACs, Django & WordPress secret keys.',
    faqs: [
      {
        question: 'Do any tools in Generators use AI?',
        answer:
          'No. QR/barcode encoders, Web Crypto secret/key/MAC generators, slug rules, and wordlist randomizers run strictly deterministically—NOT AI.',
      },
      {
        question: 'Do generated passwords, Django keys, or WordPress salts get saved or sent?',
        answer:
          'No. Static QR codes never expire, and all generated passwords and secret keys use Web Crypto randomness locally without ever being sent or stored.',
      },
      {
        question: 'Do MAC Address Generator addresses belong to real physical hardware?',
        answer:
          'No. MAC Address Generator creates random locally-administered test addresses for development and network testing—never real physical device addresses.',
      },
      {
        question: 'Will QR codes or barcodes carry a platform watermark?',
        answer:
          'No. All Generator downloads are completely unwatermarked.',
      },
    ],
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Developer',
    slug: 'developer-tools',
    url: '/developer-tools',
    description:
      'Browser-based JSON/XML formatters, auto-detected code beautifier, color picker, TTS/STT, Base64, and URL encoders.',
    intro:
      'Developer Tools gathers 8 zero-upload browser utilities—JSON Formatter, XML Formatter (native browser XML parser validation), JS/HTML/CSS/JSON Code Beautifier, Color Picker (HEX/RGB/HSL + harmonies), browser SpeechSynthesis Text to Speech, microphone Speech to Text, Base64 Encoder/Decoder, and URL Encoder/Decoder.',
    icon: 'Code2',
    seoTitle: `Developer Tools — 8 Web Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 8 upcoming browser Developer Tools: JSON/XML formatters, Code Beautifier, Color Picker, TTS/STT, Base64, and URL tools.',
    faqs: [
      {
        question: 'Are source snippets or JSON/XML payloads uploaded to servers?',
        answer:
          'No. JSON, XML, Code Beautifier, Color Picker, Base64, and URL tools run locally inside your browser tab.',
      },
      {
        question: 'How do Text to Speech and Speech to Text work without servers?',
        answer:
          'Text to Speech uses your browser SpeechSynthesis API (available voices depend on device/browser), while Speech to Text uses microphone permission and Web Speech Recognition (browser support varies—works mainly in Chrome/Safari).',
      },
      {
        question: 'Which languages does Code Beautifier auto-detect?',
        answer:
          'JavaScript, HTML, CSS, and JSON, with selectable 2 spaces, 4 spaces, or tabs.',
      },
      {
        question: 'Do Developer Tools use AI?',
        answer:
          'No. Formatters, encoders, and native browser APIs operate deterministically without AI.',
      },
    ],
  },
  {
    id: 'document-tools',
    name: 'Document Tools',
    shortName: 'Documents',
    slug: 'document-tools',
    url: '/document-tools',
    description:
      'Template-based PDF/print generators for receipts, certificates, letters, contracts, proposals, quotes, bills, and invoices.',
    intro:
      'Document Tools brings 8 clean, template-based business and personal document builders directly to your browser (NOT AI): Receipts, Certificates (4 templates), Letters, Contracts (general templates, not legal advice), Proposals, Quotes, Bills, and Invoices—with automatic totals, currency-neutral financial fields, and watermark-free PDF/PNG/print output.',
    icon: 'FileText',
    seoTitle: `Document Tools — 8 Template Builders | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Use 8 browser Document Tools: Receipt, Certificate, Letter, Contract, Proposal, Quote, Bill, and Invoice PDF generators (NOT AI).',
    faqs: [
      {
        question: 'Do Document Tools write agreements or invoices using AI?',
        answer:
          'No. Every Document Tool renders deterministically from structured layout templates and your entered fields—NOT AI.',
      },
      {
        question: 'Are Contract Generator templates legal advice?',
        answer:
          'No. Contract Generator provides general document templates (such as simple NDAs) and is NOT legal advice.',
      },
      {
        question: 'Are Bill Generator and Invoice Generator tied to one currency?',
        answer:
          'No. Both Bill Generator and Invoice Generator are currency-neutral—type any currency symbol or code you prefer.',
      },
      {
        question: 'Will exported PDFs or PNGs carry a ToolPlatform watermark?',
        answer:
          'No. Every Document Tool exports completely watermark-free.',
      },
    ],
  },
  {
    id: 'finance-tools',
    name: 'Finance Tools',
    shortName: 'Finance',
    slug: 'finance-tools',
    url: '/finance-tools',
    description:
      'Browser calculators for Indian GST/Income Tax/Salary, discounts, EMI, mutual fund SIP estimates, FD schedules, and scientific math.',
    intro:
      'Finance Tools compiles 8 client-side financial and math calculators: India-specific GST, Income Tax (FY 2025–26 & 2026–27), and Salary CTC tools, plus universal Discount, EMI, FD (with yearly schedule), ESTIMATE-ONLY mutual fund SIP projections, and an Advanced Scientific Calculator with Basic/Scientific mode switch.',
    icon: 'Landmark',
    seoTitle: `Finance Tools — 8 Financial Calculators | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 8 upcoming Finance Tools: India-specific GST/Tax/Salary, Discount, EMI, estimate-only SIP, FD schedule, and Scientific Calculator.',
    faqs: [
      {
        question: 'Which Finance Tools are India-specific?',
        answer:
          'GST Calculator (Indian GST/CGST/SGST), Income Tax Calculator (Indian FY 2025–26 & 2026–27 slabs), and Salary Calculator (Indian CTC/PF/tax) are explicitly India-specific.',
      },
      {
        question: 'Are SIP Calculator returns guaranteed?',
        answer:
          'No. SIP Calculator carries an ESTIMATE-ONLY disclaimer because mutual fund returns vary with market conditions.',
      },
      {
        question: 'Does FD Calculator show a compounding schedule?',
        answer:
          'Yes. It supports monthly, quarterly, half-yearly, and yearly compounding with a year-by-year schedule.',
      },
      {
        question: 'Is personal income data sent to any server?',
        answer:
          'No. Every financial formula runs privately inside your browser.',
      },
    ],
  },
  {
    id: 'number-system-converters',
    name: 'Number System Converters',
    shortName: 'Number Systems',
    slug: 'number-system-converters',
    url: '/number-system-converters',
    description:
      'Pure formula digital logic converters for Binary-Coded Decimal (BCD) and reflected Binary ↔ Gray code.',
    intro:
      'Number System Converters brings 2 pure-formula digital electronics utilities to your browser (NOT AI): BCD Converter (decimal ↔ 4-bit Binary-Coded Decimal per digit) and Binary to Gray Code Converter (two-way conversions with step-by-step XOR working).',
    icon: 'Binary',
    seoTitle: `Number System Converters — BCD & Gray Code | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 2 pure-formula Number System Converters: BCD Converter and Binary to Gray Code Converter with step-by-step working.',
    faqs: [
      {
        question: 'Are Number System Converters pure formula calculators?',
        answer:
          'Yes. Both BCD and Binary ↔ Gray code tools apply deterministic digital logic rules in your browser without AI.',
      },
      {
        question: 'Do both tools support two-way conversions?',
        answer:
          'Yes. BCD converts decimal ↔ BCD in both directions, and Binary to Gray Code converts binary ↔ Gray code with step-by-step working.',
      },
      {
        question: 'Why does BCD use 4 bits per decimal digit?',
        answer:
          'Each decimal digit from 0 to 9 fits into a dedicated 4-bit nibble (0000 to 1001) so decimal displays map directly without base conversion rounding.',
      },
      {
        question: 'Are Number System Converters free without sign-in?',
        answer:
          'Yes. Both utilities are free, browser-based, and watermark-free.',
      },
    ],
  },
  {
    id: 'lookup-tools',
    name: 'Lookup Tools',
    shortName: 'Lookup',
    slug: 'lookup-tools',
    url: '/lookup-tools',
    description:
      'Browser reference lookups for public IEEE MAC vendor OUIs and Nice Classification trademark classes.',
    intro:
      'Lookup Tools provides 2 transparent reference search utilities in your browser (NOT AI): MAC Address Lookup (searches public IEEE OUI vendor prefixes—manufacturer only, never an individual device owner) and Trademark Class Finder (narrows the 45 standard Nice Classification classes as a preliminary guide only, never legal advice).',
    icon: 'Search',
    seoTitle: `Lookup Tools — MAC OUI & Nice Classes | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Explore 2 browser Lookup Tools: public MAC OUI vendor lookup (manufacturer only) and Nice Classification Trademark Class Finder.',
    faqs: [
      {
        question: 'Can MAC Address Lookup trace who owns a personal phone or laptop?',
        answer:
          'No—never. OUI lookup identifies the network hardware manufacturer only, never an individual device owner or location.',
      },
      {
        question: 'Is Trademark Class Finder official legal advice?',
        answer:
          'No. It helps match goods/services descriptions against the 45 standard Nice Classification classes as a guide only—not legal advice.',
      },
      {
        question: 'Do either Lookup Tools use AI or require social login?',
        answer:
          'No. Both tools use deterministic index matching directly in your browser without AI or login.',
      },
      {
        question: 'Can I also generate dummy test MAC addresses?',
        answer:
          'Yes. Use MAC Address Generator under Generators to create locally-administered test MACs.',
      },
    ],
  },
  {
    id: 'file-tools',
    name: 'File Tools',
    shortName: 'Files',
    slug: 'file-tools',
    url: '/file-tools',
    description:
      'Upcoming utilities for archives, checksums, spreadsheets, and everyday file prep.',
    intro:
      'File Tools is a dedicated upcoming category for archive packaging, structured data conversion, and file inspection utilities. No individual tools are listed here yet while we finalize specifications.',
    icon: 'FolderArchive',
    seoTitle: `File Tools — Archive & Data Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'File Tools category on ToolPlatform. Dedicated archive, CSV, and file inspection utilities are planned and coming soon.',
    faqs: [
      {
        question: 'Why are there no tools listed under File Tools yet?',
        answer:
          'We are launching the platform in focused stages. Our initial 439 planned tools span PDF, Image, Video, Converter, social creator suites, Productivity, Unit Converters, Number Systems, Lookup, Science, Generators, Developer, Document, and Finance Tools, while File Tools utilities are scheduled for a later phase.',
      },
      {
        question: 'What kind of utilities are planned for File Tools?',
        answer:
          'Planned candidates include ZIP archive creation and extraction, archive inspection, and local SHA-256 file checksum verification.',
      },
      {
        question: 'Will File Tools run in the browser?',
        answer:
          'Yes, wherever feasible. Checksum verification and standard ZIP packaging can operate entirely client-side inside modern browsers.',
      },
      {
        question: 'Can I suggest a specific file utility to prioritize?',
        answer:
          'Yes. Visit our Contact page to share which archive or file utility would help your workflow most.',
      },
    ],
  },
  {
    id: 'web-tools',
    name: 'Web Tools',
    shortName: 'Web',
    slug: 'web-tools',
    url: '/web-tools',
    description:
      'Upcoming browser-first utilities for formatting code, URLs, colors, and metadata.',
    intro:
      'Web Tools will bring lightweight developer and publisher utilities—such as JSON formatting, URL encoding, and color contrast checks—into the same fast interface. Tools in this category are planned for a future release.',
    icon: 'Globe',
    seoTitle: `Web Tools — Developer & Web Utilities | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Web Tools category on ToolPlatform. Lightweight formatting, encoding, and web inspection tools are planned and coming soon.',
    faqs: [
      {
        question: 'Are any Web Tools available to preview right now?',
        answer:
          'Not yet. This category is part of our 25-category architecture and will be populated after the initial 439 tools across our active suites are rolled out.',
      },
      {
        question: 'What tools are planned for the Web Tools category?',
        answer:
          'Planned additions include a JSON formatter and validator, Base64 encoder/decoder, URL parser, and WCAG color contrast checker.',
      },
      {
        question: 'Will Web Tools require an account or API key?',
        answer:
          'No. Standard formatting and encoding utilities are planned to run locally in your browser with zero login required.',
      },
      {
        question: 'Where can I browse the 439 tools already in the catalog?',
        answer:
          'You can browse every currently cataloged tool on the All Tools directory page or explore all populated categories across media, social, productivity, unit converter, number system, lookup, science, generator, developer, document, and finance suites.',
      },
    ],
  },
] as const;

export const TOOLS: readonly Tool[] = [
  // ========================
  // PDF TOOLS (34)
  // ========================
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    category: 'pdf-tools',
    url: '/merge-pdf',
    description: 'Combine multiple PDF documents into one ordered file in seconds.',
    longDescription:
      'Merge PDF lets you select two or more PDF documents, keep them in the sequence you need, and compile them into a single clean PDF right inside your browser without uploading sensitive drafts to a remote queue.',
    keywords: [
      'merge pdf',
      'combine pdf',
      'join pdf',
      'append pdf',
      'concatenate pdf',
      'pdf binder',
      'unite pdf',
    ],
    icon: 'Files',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `Merge PDF — Combine Multiple PDFs | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Merge PDF combines up to 20 PDF files (50 MB each) into one ordered document directly in your browser with no watermark.',
    howTo: [
      {
        title: 'Select your PDF files',
        description:
          'Choose up to 20 PDF documents (up to 50 MB each) or click Try sample PDF to test with generated files.',
      },
      {
        title: 'Review document order',
        description:
          'Verify your uploaded PDF list or remove unwanted items before building the combined output.',
      },
      {
        title: 'Generate the merged PDF',
        description:
          'Your browser assembles the unified PDF locally and prepares it for immediate download.',
      },
    ],
    faqs: [
      {
        question: 'Does Merge PDF upload my documents to a server?',
        answer:
          'No. Merge PDF runs directly in your browser, keeping contracts, invoices, and personal forms on your device.',
      },
      {
        question: 'How many PDF files can I combine at once?',
        answer:
          'You can combine up to 20 PDF files per merge session, with a limit of 50 MB per file.',
      },
      {
        question: 'Do text searchability and vector quality stay intact?',
        answer:
          'Yes. Merging copies page objects directly, preserving vector text, selectable fonts, and existing page dimensions without rasterizing pages into images.',
      },
      {
        question: 'Can I merge password-protected PDFs directly?',
        answer:
          'Encrypted PDFs must be unlocked with their valid password first before their pages can be combined.',
      },
    ],
    relatedTools: ['split-pdf', 'compress-pdf', 'rotate-pdf', 'jpg-to-pdf'],
    popular: true,
    featured: true,
    rating: null,
    status: 'active',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    category: 'pdf-tools',
    url: '/split-pdf',
    description: 'Extract specific pages or divide a large PDF into separate files.',
    longDescription:
      'Split PDF breaks bulky packets, ebooks, and scanned binders into focused documents. Pick individual page numbers or define custom page ranges to extract selected pages into a standalone PDF directly in your browser.',
    keywords: [
      'split pdf',
      'extract pdf pages',
      'separate pdf',
      'cut pdf',
      'divide pdf',
      'pdf page extractor',
    ],
    icon: 'Scissors',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Split PDF — Extract & Divide Pages | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Split PDF extracts selected pages or ranges from PDF documents up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Choose a PDF document',
        description:
          'Load a single PDF file up to 50 MB (or try the built-in 3-page sample PDF) to inspect its page count.',
      },
      {
        title: 'Define pages or ranges',
        description:
          'Enter exact page numbers or ranges (such as 1-2 or 1, 3) to extract into a new document.',
      },
      {
        title: 'Export the extracted PDF',
        description:
          'Your browser extracts the requested pages into a clean, standalone PDF document.',
      },
    ],
    faqs: [
      {
        question: 'Does Split PDF let me extract non-consecutive pages?',
        answer:
          'Yes. The range selector supports single pages and comma-separated intervals (for example, 1, 3-5).',
      },
      {
        question: 'Does splitting a PDF reduce page quality?',
        answer:
          'No. Extracting pages copies the original page objects directly, preserving original fonts, vector graphics, and image resolution.',
      },
      {
        question: 'Does Split PDF run locally in my browser?',
        answer:
          'Yes. Splitting runs completely in your browser so your source document never leaves your device.',
      },
      {
        question: 'What if I want to recombine pages from different PDFs?',
        answer:
          'Split out the pages you need first and then combine them using the Merge PDF tool.',
      },
    ],
    relatedTools: ['merge-pdf', 'rotate-pdf', 'compress-pdf', 'pdf-to-jpg'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    category: 'pdf-tools',
    url: '/compress-pdf',
    description: 'Reduce PDF file size for faster email attachments and uploads.',
    longDescription:
      'Large reports and exports often exceed portal upload caps. Compress PDF optimizes object streams and strips redundant metadata directly in your browser while keeping text crisp and readable.',
    keywords: [
      'compress pdf',
      'shrink pdf',
      'reduce pdf size',
      'optimize pdf',
      'smaller pdf',
      'pdf compressor',
    ],
    icon: 'Minimize2',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 5,
    processingMethod: 'browser',
    seoTitle: `Compress PDF — Reduce PDF File Size | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compress PDF optimizes PDF files up to 50 MB in your browser while keeping text sharp and readable.',
    howTo: [
      {
        title: 'Choose your PDF file',
        description:
          'Select a PDF file (max 50 MB) or use Try sample PDF to load a test document.',
      },
      {
        title: 'Run browser optimization',
        description:
          'Click Run Compress PDF to rewrite object streams and remove redundant metadata.',
      },
      {
        title: 'Save the optimized PDF',
        description:
          'Download your re-packed PDF directly in the browser with no file uploads.',
      },
    ],
    faqs: [
      {
        question: 'Does Compress PDF run locally in my browser?',
        answer:
          'Yes. Object-stream optimization runs directly in your browser tab so documents stay private on your device.',
      },
      {
        question: 'Does compressing a PDF blur my text?',
        answer:
          'No. Vector text and fonts remain sharp while compression uses PDF object streams and metadata cleanup.',
      },
      {
        question: 'How much smaller will my PDF become?',
        answer:
          'Savings depend on how uncompressed the input PDF structure is; already compressed PDFs or image-heavy scans may see modest reductions.',
      },
      {
        question: 'What is the maximum file size for Compress PDF?',
        answer:
          'Compress PDF accepts PDF files up to 50 MB.',
      },
    ],
    relatedTools: ['merge-pdf', 'split-pdf', 'pdf-to-word', 'compress-image'],
    popular: true,
    featured: true,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    category: 'pdf-tools',
    url: '/pdf-to-jpg',
    description: 'Render PDF pages into crisp JPG images for slides and previews.',
    longDescription:
      'When you need to embed a document page inside a presentation, social post, or CMS gallery, PDF to JPG renders your PDF pages cleanly into high-resolution JPG images inside your browser.',
    keywords: [
      'pdf to jpg',
      'pdf to jpeg',
      'pdf to image',
      'convert pdf to jpg',
      'export pdf pages as images',
    ],
    icon: 'ImageDown',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to JPG — Convert Pages to Images | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to JPG converts PDF pages up to 50 MB into clear JPG images right in your browser.',
    howTo: [
      {
        title: 'Load a PDF file',
        description:
          'Open a PDF up to 50 MB directly in the browser workspace or click Try sample PDF.',
      },
      {
        title: 'Pick page to render',
        description:
          'Choose which page number to convert into a high-resolution JPG image.',
      },
      {
        title: 'Save the JPG image',
        description:
          'Your browser renders the selected page as a crisp JPG image ready for slides or web use.',
      },
    ],
    faqs: [
      {
        question: 'Can I pick which page to convert to JPG?',
        answer:
          'Yes. Enter any page number in the workspace to export that specific page cleanly.',
      },
      {
        question: 'Does PDF to JPG run locally in the browser?',
        answer:
          'Yes. Page rasterization executes client-side using PDF.js and browser canvas rendering so files stay private.',
      },
      {
        question: 'Can I also convert JPG images back into a PDF?',
        answer:
          'Yes. Use our companion JPG to PDF tool to bundle multiple photos or scans into a single PDF document.',
      },
    ],
    relatedTools: ['jpg-to-pdf', 'split-pdf', 'compress-image', 'convert-image'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'pdf-tools',
    url: '/jpg-to-pdf',
    description: 'Turn JPG and PNG photos into a clean, multi-page PDF document.',
    longDescription:
      'Receipt photos, scanned IDs, and design mockups are easier to share as a single document. JPG to PDF lets you select images and compile them into one standardized PDF entirely inside your browser.',
    keywords: [
      'jpg to pdf',
      'jpeg to pdf',
      'image to pdf',
      'photos to pdf',
      'png to pdf',
      'pictures to pdf',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['JPG', 'JPEG', 'PNG'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `JPG to PDF — Images to PDF Document | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'JPG to PDF converts and combines up to 20 JPG and PNG images (20 MB each) into a PDF document in your browser.',
    howTo: [
      {
        title: 'Select your images',
        description:
          'Choose up to 20 JPG or PNG images (up to 20 MB each), or click Try sample image to test immediately.',
      },
      {
        title: 'Review image order',
        description:
          'Check your selected image files before compiling each photo onto its own PDF page.',
      },
      {
        title: 'Build the PDF locally',
        description:
          'Your browser assembles all images into one crisp, shareable PDF with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Does JPG to PDF also accept PNG screenshots?',
        answer:
          'Yes. In addition to JPG and JPEG, JPG to PDF accepts PNG images so screenshots and scans can be combined together.',
      },
      {
        question: 'How are pages sized for each image?',
        answer:
          'Each PDF page automatically fits the dimensions of the embedded image so photos remain sharp and uncropped.',
      },
      {
        question: 'Are my photos uploaded to external servers?',
        answer:
          'No. JPG to PDF processes images locally inside your browser.',
      },
      {
        question: 'How many images can I combine into one PDF?',
        answer:
          'You can combine up to 20 images per PDF, up to 20 MB per image.',
      },
    ],
    relatedTools: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf', 'resize-image'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    slug: 'word-to-pdf',
    category: 'pdf-tools',
    url: '/word-to-pdf',
    description: 'Convert DOCX files into clean, readable PDFs right in your browser.',
    longDescription:
      'Sending editable Word documents can cause layout shifts across devices. Word to PDF extracts document text from DOCX files directly in your browser and generates a universally readable PDF for fast sharing.',
    keywords: [
      'word to pdf',
      'docx to pdf',
      'doc to pdf',
      'convert word to pdf',
      'rtf to pdf',
    ],
    icon: 'FileOutput',
    acceptedFormats: ['DOCX'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Word to PDF — Convert DOCX to PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Word to PDF converts DOCX documents up to 50 MB into clean PDFs directly inside your browser.',
    howTo: [
      {
        title: 'Select a Word document',
        description:
          'Pick a DOCX document up to 50 MB or click Try sample Word (.docx) to test conversion right away.',
      },
      {
        title: 'Run browser conversion',
        description:
          'Your browser reads paragraphs from the DOCX file and lays them out onto clean A4 PDF pages.',
      },
      {
        title: 'Save your PDF',
        description:
          'Download a clean, unwatermarked PDF that opens reliably across desktop and mobile viewers.',
      },
    ],
    faqs: [
      {
        question: 'Does Word to PDF upload my DOCX files to a server?',
        answer:
          'No. Word to PDF extracts text from your DOCX file directly inside your browser using client-side libraries.',
      },
      {
        question: 'Which Word format is supported?',
        answer:
          'Word to PDF supports modern .docx files. Output focuses on clean text flow rather than pixel-perfect preservation of complex Word macros or custom themes.',
      },
      {
        question: 'What is the maximum file size?',
        answer:
          'Word to PDF accepts DOCX files up to 50 MB.',
      },
      {
        question: 'Can I convert a PDF back into an editable Word document?',
        answer:
          'Yes. Use our PDF to Word tool when you need to extract PDF text into an editable .docx file.',
      },
    ],
    relatedTools: ['pdf-to-word', 'merge-pdf', 'compress-pdf', 'sign-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    slug: 'pdf-to-word',
    category: 'pdf-tools',
    url: '/pdf-to-word',
    description: 'Turn PDF pages into editable DOCX documents for easy revisions.',
    longDescription:
      'When you need to update text locked inside a finished PDF, PDF to Word extracts selectable text locally in your browser and writes an editable .docx file. Note: this is a text-based conversion for simple layouts and is not pixel-perfect.',
    keywords: [
      'pdf to word',
      'pdf to docx',
      'pdf to doc',
      'convert pdf to word',
      'editable word from pdf',
    ],
    icon: 'FileInput',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to Word — Convert PDF to DOCX | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to Word converts PDF documents up to 50 MB into editable DOCX files locally in your browser (text-based, simple layout).',
    howTo: [
      {
        title: 'Choose your PDF document',
        description:
          'Load a PDF file up to 50 MB (or click Try sample PDF) inside your browser.',
      },
      {
        title: 'Extract text into DOCX',
        description:
          'Your browser reads selectable text across every page and builds standard Word paragraphs.',
      },
      {
        title: 'Edit in Word or Docs',
        description:
          'Download a standard .docx file ready for revisions in Microsoft Word or compatible editors.',
      },
    ],
    faqs: [
      {
        question: 'Is PDF to Word pixel-perfect?',
        answer:
          'No. PDF to Word performs text-based conversion suited for simple layouts—complex columns, custom fonts, and graphics positioning are not preserved.',
      },
      {
        question: 'What happens with scanned image-only PDFs?',
        answer:
          'Digital PDFs with selectable text convert cleanly. Scanned image-only PDFs do not contain selectable text layers for browser extraction.',
      },
      {
        question: 'Is there a file size limit for PDF to Word?',
        answer:
          'PDF to Word supports PDF files up to 50 MB directly in your browser.',
      },
      {
        question: 'Can I convert the edited Word file back to PDF afterward?',
        answer:
          'Yes. Once you finish your edits, use Word to PDF to produce a clean PDF document.',
      },
    ],
    relatedTools: ['word-to-pdf', 'compress-pdf', 'merge-pdf', 'split-pdf'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    category: 'pdf-tools',
    url: '/rotate-pdf',
    description: 'Fix sideways or upside-down PDF pages permanently in your browser.',
    longDescription:
      'Scanned receipts and landscape charts often end up rotated the wrong way. Rotate PDF lets you turn pages by 90°, 180°, or 270° inside your browser and save the corrected orientation permanently.',
    keywords: [
      'rotate pdf',
      'turn pdf',
      'flip pdf pages',
      'fix sideways pdf',
      'pdf orientation',
    ],
    icon: 'RotateCw',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Rotate PDF — Fix Page Orientation | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Rotate PDF turns PDF pages 90, 180, or 270 degrees directly in your browser for files up to 50 MB.',
    howTo: [
      {
        title: 'Open your PDF locally',
        description:
          'Load a PDF up to 50 MB in your browser or click Try sample PDF to test rotation.',
      },
      {
        title: 'Pick a rotation angle',
        description:
          'Choose 90° clockwise, 180° flip, or 270° counterclockwise rotation.',
      },
      {
        title: 'Save corrected orientation',
        description:
          'Your browser updates the page rotation flags permanently in a new PDF file.',
      },
    ],
    faqs: [
      {
        question: 'What rotation angles are supported?',
        answer:
          'Standard 90° clockwise, 180° flip, and 270° (90° counterclockwise) rotations are supported.',
      },
      {
        question: 'Does rotating pages re-compress images or text?',
        answer:
          'No. PDF rotation updates the page orientation metadata directly, keeping text and embedded media untouched.',
      },
      {
        question: 'Does Rotate PDF work in the browser without uploading files?',
        answer:
          'Yes. Rotate PDF runs completely client-side in your browser for files up to 50 MB.',
      },
      {
        question: 'Does Rotate PDF add a watermark?',
        answer:
          'No. All output PDFs are completely watermark-free.',
      },
    ],
    relatedTools: ['split-pdf', 'merge-pdf', 'compress-pdf', 'sign-pdf'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    slug: 'sign-pdf',
    category: 'pdf-tools',
    url: '/sign-pdf',
    description: 'Add a visible electronic signature stamp to PDF pages via 100% in-browser qpdf-wasm—not a certified PKCS#7 signature.',
    longDescription:
      'Sign PDF lets you apply a clean visual electronic signature stamp to any PDF page using 100% in-browser qpdf-wasm processing. Draw your signature, type with custom signature typography, or upload a signature image. Position the stamp precisely, pick target pages, and optionally display your printed signer name and date. Honest limits notice: This tool applies a visible electronic signature stamp—it does NOT create a certified PKCS#7 digital signature, cryptographic certificate authority (CA) certificate, or timestamp token.',
    keywords: [
      'sign pdf',
      'electronic signature',
      'esign pdf',
      'add signature to pdf',
      'fill and sign pdf',
      'visual signature stamp',
      'browser qpdf sign',
    ],
    icon: 'PenTool',
    acceptedFormats: ['PDF', 'PNG', 'JPG'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Sign PDF — Visible Electronic Signature Stamp | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Apply a visible electronic signature stamp to PDF documents via 100% in-browser qpdf-wasm. Transparent notice: visual signature stamp, not a PKCS#7 certified digital signature.',
    howTo: [
      {
        title: 'Upload your PDF document',
        description:
          'Select any PDF up to 50 MB (or test with the built-in 3-page sample PDF). Files never leave your browser.',
      },
      {
        title: 'Create or upload your signature',
        description:
          'Draw with mouse or finger, type your name in signature cursive, or upload a PNG/JPG signature image.',
      },
      {
        title: 'Choose placement & apply stamp',
        description:
          'Select the target page and position (bottom-right, bottom-left, top-right, or custom), then apply the visual stamp processed and linearized via 100% in-browser qpdf-wasm.',
      },
    ],
    faqs: [
      {
        question: 'Is this a certified PKCS#7 digital signature with cryptographic certificate?',
        answer:
          'No. Sign PDF applies a visible electronic signature stamp and standardizes the PDF via 100% in-browser qpdf-wasm. It does not issue PKCS#7 cryptographic digital signatures, X.509 CA certificates, or qualified eIDAS trust tokens. Use it for agreements, permission slips, and internal approvals that accept visible signatures.',
      },
      {
        question: 'Are my uploaded files or signatures stored or sent to a server?',
        answer:
          'No. Files and signatures are processed 100% locally inside your browser via WASM. They never leave your device and are never uploaded or logged.',
      },
      {
        question: 'Can I choose which page the signature appears on?',
        answer:
          'Yes. You can place your signature on Page 1, any specific internal page, or the final page of your document.',
      },
      {
        question: 'Can I include signer name, date, and verification frame?',
        answer:
          'Yes. You can toggle a neat verification badge displaying your printed signer name, date, and an honest visual stamp notice.',
      },
    ],
    relatedTools: ['protect-pdf', 'merge-pdf', 'word-to-pdf', 'rotate-pdf'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    slug: 'unlock-pdf',
    category: 'pdf-tools',
    url: '/unlock-pdf',
    description: 'Remove password protection from an encrypted PDF via 100% in-browser qpdf-wasm using its existing password.',
    longDescription:
      'Unlock PDF decrypts password-protected PDFs using genuine 100% in-browser qpdf-wasm when you supply the valid document password. Strict security: Unlock PDF strictly decrypts with the authorized password—it NEVER cracks, brute-forces, or bypasses unknown passwords. Incorrect passwords fail immediately with a clear error and zero output. Passwords are entered per operation only and are never saved, stored, logged, or placed in URLs.',
    keywords: [
      'unlock pdf',
      'remove pdf password',
      'decrypt pdf',
      'unprotect pdf',
      'open password pdf',
      'browser qpdf decrypt',
    ],
    icon: 'Unlock',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 75,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Unlock PDF — Decrypt With Valid Password | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Remove encryption from password-protected PDFs via 100% in-browser qpdf-wasm using your valid document password. Zero cracking or bypass.',
    howTo: [
      {
        title: 'Upload the encrypted PDF',
        description:
          'Select your password-protected PDF up to 75 MB (or test with our sample encrypted file). Processed entirely client-side.',
      },
      {
        title: 'Enter the existing document password',
        description:
          'Supply the valid open or owner password required to authorize decryption. Passwords are never saved or logged.',
      },
      {
        title: 'Download the unlocked PDF',
        description:
          '100% in-browser qpdf-wasm decrypts the file cleanly. If the password is wrong, decryption is blocked with zero file output.',
      },
    ],
    faqs: [
      {
        question: 'Can Unlock PDF crack or bypass a password if I forgot it?',
        answer:
          'No. Unlock PDF strictly requires the valid document password. It will never crack, brute-force, or bypass unknown PDF passwords.',
      },
      {
        question: 'Are passwords or decrypted files stored or sent to a server?',
        answer:
          'No. Passwords are processed per operation in memory inside your browser and never transmitted or stored anywhere. Files never leave your device.',
      },
      {
        question: 'What happens if I enter an incorrect password?',
        answer:
          'The 100% in-browser qpdf-wasm engine halts immediately with a clear error message and does not generate or return any output file.',
      },
      {
        question: 'Can I add encryption back to the unlocked file later?',
        answer:
          'Yes. Use our Protect PDF tool to re-encrypt any document with AES-256 open password protection.',
      },
    ],
    relatedTools: ['protect-pdf', 'merge-pdf', 'split-pdf', 'compress-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    slug: 'protect-pdf',
    category: 'pdf-tools',
    url: '/protect-pdf',
    description: 'Encrypt a PDF with AES-256 password protection via 100% in-browser qpdf-wasm and optional viewer permissions.',
    longDescription:
      'Protect PDF encrypts documents with industry-standard AES-256 password protection via 100% in-browser qpdf-wasm. Set a secure user open password (plus optional owner password) and configure advisory viewer restrictions for printing, modifications, and content copying. Security & honesty rules: Passwords are entered per operation only, never stored, never logged, and never put in URLs; files are processed entirely in browser memory and never uploaded. Important notice: PDF permission restrictions are advisory flags in the PDF specification that compliant readers respect, while user open passwords provide genuine cryptographic AES encryption.',
    keywords: [
      'protect pdf',
      'lock pdf',
      'encrypt pdf',
      'password protect pdf',
      'add password to pdf',
      'secure pdf',
      'aes 256 pdf',
      'browser qpdf encrypt',
    ],
    icon: 'Lock',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Protect PDF — AES-256 Password Encryption | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Encrypt PDF documents with AES-256 password protection via 100% in-browser qpdf-wasm. Optional advisory permission flags. Zero uploads.',
    howTo: [
      {
        title: 'Select a PDF document',
        description:
          'Choose a PDF up to 50 MB (or test immediately with our 3-page sample PDF). Zero server uploads.',
      },
      {
        title: 'Set user password & optional permissions',
        description:
          'Enter a strong open password, confirm it, and optionally restrict printing or copying permissions.',
      },
      {
        title: 'Generate AES-256 encrypted PDF',
        description:
          '100% in-browser qpdf-wasm encrypts the document. Recipients must enter the exact password to open and view the pages.',
      },
    ],
    faqs: [
      {
        question: 'What encryption standard is used by Protect PDF?',
        answer:
          'Protect PDF uses genuine AES-256 encryption via 100% in-browser qpdf-wasm, compatible with Adobe Acrobat, Apple Preview, Google Chrome, and standard mobile PDF viewers.',
      },
      {
        question: 'Are PDF viewer permissions guaranteed to prevent copying or printing?',
        answer:
          'Advisory Notice: PDF permission flags (such as print or copy restrictions) are advisory signals in the PDF specification. Standard-compliant PDF readers respect them, but they cannot guarantee that third-party software will strictly enforce them. The user open password, however, provides genuine AES-256 cryptographic encryption.',
      },
      {
        question: 'Are passwords or uploaded documents stored or sent to a server?',
        answer:
          'No. Passwords are used solely for the single encryption operation in browser memory and are never stored, logged, or retained. Files are processed 100% locally with zero network uploads.',
      },
      {
        question: 'How do I open or remove the password later?',
        answer:
          'Keep a secure copy of your password. You can remove encryption at any time using our Unlock PDF tool by supplying the same password.',
      },
    ],
    relatedTools: ['unlock-pdf', 'sign-pdf', 'merge-pdf', 'compress-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-editor',
    name: 'PDF Editor',
    slug: 'pdf-editor',
    category: 'pdf-tools',
    url: '/pdf-editor',
    description: 'Add text, highlights, freehand drawings, images, and annotations to PDFs.',
    longDescription:
      'Need to fill out a form, mark up a contract, or drop a logo onto a PDF page? PDF Editor runs directly in your browser so you can add text, highlight regions, draw annotations, or stamp images onto pages. Note: Existing PDF text cannot be edited like Word — text does not reflow.',
    keywords: [
      'pdf editor',
      'edit pdf',
      'annotate pdf',
      'add text to pdf',
      'draw on pdf',
      'markup pdf',
    ],
    icon: 'SquarePen',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF Editor — Annotate & Mark Up PDFs | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF Editor lets you add text, highlight, add images, and annotate PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Open a PDF document',
        description:
          'Load a PDF up to 50 MB inside your browser (or click Try sample PDF) without uploading it.',
      },
      {
        title: 'Add overlays and markups',
        description:
          'Enter new text boxes, toggle highlight overlays, or optionally attach an image stamp on your chosen page.',
      },
      {
        title: 'Export the updated PDF',
        description:
          'Your browser embeds your annotations cleanly into a downloadable PDF.',
      },
    ],
    faqs: [
      {
        question: 'Can I edit existing PDF paragraphs so text reflows like Microsoft Word?',
        answer:
          'No. Existing PDF text cannot be edited like Word — text does not reflow. PDF Editor adds text, highlights, image overlays, and annotations over pages.',
      },
      {
        question: 'Does PDF Editor upload my files to a remote server?',
        answer:
          'No. All editing overlays and rendering run locally inside your web browser.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'PDF Editor supports PDF documents up to 50 MB per file.',
      },
      {
        question: 'What if I need to change underlying paragraphs directly?',
        answer:
          'Use PDF to Word to convert the file into an editable DOCX document first.',
      },
    ],
    relatedTools: ['add-text-to-pdf', 'annotate-pdf', 'sign-pdf', 'pdf-to-word'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    slug: 'pdf-to-excel',
    category: 'pdf-tools',
    url: '/pdf-to-excel',
    description: 'Extract tables from PDF reports and statements into Excel (.xlsx) sheets.',
    longDescription:
      'Invoices, price sheets, and financial summaries often lock tabular numbers inside PDF files. PDF to Excel detects text rows locally in your browser and exports an .xlsx workbook. Table detection is for simple tables only and is imperfect on complex layouts.',
    keywords: [
      'pdf to excel',
      'pdf to xlsx',
      'extract tables from pdf',
      'pdf table to excel',
      'convert pdf to spreadsheet',
    ],
    icon: 'FileSpreadsheet',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to Excel — Extract Tables to XLSX | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to Excel extracts simple tables from PDFs up to 50 MB into .xlsx spreadsheets locally in your browser.',
    howTo: [
      {
        title: 'Load your PDF file',
        description:
          'Select a PDF document up to 50 MB (or click Try sample PDF) containing structured tables.',
      },
      {
        title: 'Run table extraction',
        description:
          'Your browser scans text rows and column spacing across pages automatically.',
      },
      {
        title: 'Save the .xlsx workbook',
        description:
          'Extracted tabular rows are packaged into an Excel .xlsx file locally.',
      },
    ],
    faqs: [
      {
        question: 'Does PDF to Excel capture every complex table perfectly?',
        answer:
          'No. It is designed for simple tables only—detection is imperfect on complex layouts, merged cells, rotated headers, or scanned PDFs without selectable text.',
      },
      {
        question: 'Can I export to plain CSV instead?',
        answer:
          'Yes. If you prefer lightweight comma-separated data, use our companion PDF to CSV tool.',
      },
      {
        question: 'Is there a file size cap?',
        answer:
          'Yes. PDF to Excel supports PDF files up to 50 MB.',
      },
      {
        question: 'Where does table extraction run?',
        answer:
          'Extraction runs locally in your browser without sending financial files to external servers.',
      },
    ],
    relatedTools: ['pdf-to-csv', 'pdf-to-word', 'pdf-to-text', 'merge-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    slug: 'png-to-pdf',
    category: 'pdf-tools',
    url: '/png-to-pdf',
    description: 'Convert lossless PNG screenshots and graphics into a crisp PDF file.',
    longDescription:
      'Design mockups, UI captures, and transparent PNG graphics often need to be shared as standardized documents. PNG to PDF compiles PNG images up to 20 MB per image into a clean multi-page PDF directly inside your browser.',
    keywords: [
      'png to pdf',
      'convert png to pdf',
      'screenshot to pdf',
      'png image to pdf',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['PNG'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `PNG to PDF — Convert PNGs to PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PNG to PDF turns crisp PNG images up to 20 MB each (max 20 images) into a multi-page PDF directly in your browser.',
    howTo: [
      {
        title: 'Select PNG images',
        description:
          'Pick up to 20 PNG images (max 20 MB per image) from your device, or click Try sample image to test immediately.',
      },
      {
        title: 'Review selected images',
        description:
          'Verify your uploaded PNG list before assembling each image onto its own PDF page.',
      },
      {
        title: 'Compile the PDF locally',
        description:
          'Your browser bundles the PNGs into one shareable PDF with no watermark.',
      },
    ],
    faqs: [
      {
        question: 'How are transparent areas in PNG images handled?',
        answer:
          'Transparent PNG backgrounds render over a clean white PDF page canvas by default.',
      },
      {
        question: 'What is the maximum size per PNG image?',
        answer:
          'Each PNG image can be up to 20 MB, with up to 20 images per PDF batch.',
      },
      {
        question: 'Does PNG to PDF add a watermark to my PDF?',
        answer:
          'No. PNG to PDF produces clean output without platform watermarks.',
      },
      {
        question: 'Can I mix JPG, PNG, and WebP together?',
        answer:
          'Yes. Use IMAGES to PDF when combining mixed image formats into one PDF.',
      },
    ],
    relatedTools: ['pdf-to-png', 'images-to-pdf', 'jpg-to-pdf', 'webp-to-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    slug: 'pdf-to-powerpoint',
    category: 'pdf-tools',
    url: '/pdf-to-powerpoint',
    description: 'Turn PDF decks and handouts into editable PowerPoint (.pptx) slides.',
    longDescription:
      'When you only have a PDF export of a presentation and need to reuse slide copy, PDF to PowerPoint reconstructs pages into editable .pptx slides inside your browser. Slide layout is approximate, not pixel-perfect.',
    keywords: [
      'pdf to powerpoint',
      'pdf to pptx',
      'pdf to ppt',
      'pdf to slides',
      'convert pdf to presentation',
    ],
    icon: 'Presentation',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to PowerPoint — Convert PDF to PPTX | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to PowerPoint converts PDF decks up to 50 MB into editable .pptx slides in your browser. Slide layout is approximate.',
    howTo: [
      {
        title: 'Load a PDF presentation',
        description:
          'Select a PDF file up to 50 MB (or click Try sample PDF) directly inside your browser.',
      },
      {
        title: 'Map pages to slides',
        description:
          'Selectable text from each PDF page is extracted and placed onto 16:9 PowerPoint slides.',
      },
      {
        title: 'Export the .pptx file',
        description:
          'Your browser packages the reconstructed slides into a downloadable .pptx deck.',
      },
    ],
    faqs: [
      {
        question: 'Does the exported PowerPoint look identical to the PDF?',
        answer:
          'No. Slide layout is approximate, not pixel-perfect—custom PDF fonts, vector shading, and multi-column positioning may shift.',
      },
      {
        question: 'Does PDF to PowerPoint run in the browser?',
        answer:
          'Yes. Slide extraction and .pptx assembly execute client-side without remote uploads.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'PDF to PowerPoint supports source PDFs up to 50 MB.',
      },
      {
        question: 'Can I extract just the images from a PDF deck instead?',
        answer:
          'Yes. Use Extract Images from PDF to pull out embedded graphics directly.',
      },
    ],
    relatedTools: ['pdf-to-word', 'pdf-to-excel', 'extract-images-from-pdf', 'pdf-to-png'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-epub',
    name: 'PDF to EPUB',
    slug: 'pdf-to-epub',
    category: 'pdf-tools',
    url: '/pdf-to-epub',
    description: 'Convert text-heavy PDFs into reflowable EPUB e-books for e-readers.',
    longDescription:
      'Fixed-page PDFs are hard to read on compact e-reader screens because you have to pinch and zoom. PDF to EPUB will extract readable text in your browser into an EPUB file. Layout is mostly lost—output is text-first for comfortable reading.',
    keywords: [
      'pdf to epub',
      'pdf to ebook',
      'convert pdf to epub',
      'pdf for kindle',
      'reflowable epub',
    ],
    icon: 'BookOpen',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to EPUB — Text-First E-Book Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to EPUB will convert text PDFs up to 50 MB into reflowable EPUB e-books in your browser. Layout is mostly lost, text-first.',
    howTo: [
      {
        title: 'Choose a text PDF',
        description:
          'Once active, you will load a PDF document up to 50 MB inside your browser.',
      },
      {
        title: 'Extract text chapters',
        description:
          'The converter will gather selectable text flow in reading order for e-reader reflow.',
      },
      {
        title: 'Save the EPUB e-book',
        description:
          'Your browser will bundle an EPUB file ready for mobile and dedicated e-readers.',
      },
    ],
    faqs: [
      {
        question: 'Will complex PDF magazine layouts be preserved in EPUB?',
        answer:
          'No. Layout is mostly lost, and output is text-first so paragraphs reflow naturally across screen sizes.',
      },
      {
        question: 'Does PDF to EPUB work on scanned image-only PDFs?',
        answer:
          'Best results require PDFs with selectable text rather than scanned page images.',
      },
      {
        question: 'What is the PDF size limit?',
        answer:
          'PDF to EPUB accepts PDF files up to 50 MB.',
      },
      {
        question: 'Do I also have a plain-text export option?',
        answer:
          'Yes. Use PDF to Text when you only need a clean .txt transcript.',
      },
    ],
    relatedTools: ['pdf-to-text', 'pdf-to-word', 'create-pdf', 'split-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    slug: 'crop-pdf',
    category: 'pdf-tools',
    url: '/crop-pdf',
    description: 'Trim unwanted white margins or crop specific areas on PDF pages.',
    longDescription:
      'Academic papers, scanned forms, and exported print proofs often carry wide empty margins. Crop PDF lets you set exact top, right, bottom, and left margin trims across every page directly in your browser.',
    keywords: [
      'crop pdf',
      'trim pdf margins',
      'remove pdf whitespace',
      'resize pdf cropbox',
    ],
    icon: 'Crop',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Crop PDF — Trim PDF Page Margins | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Crop PDF trims blank page margins with exact top, right, bottom, and left bounds for PDFs up to 50 MB in your browser.',
    howTo: [
      {
        title: 'Load a PDF document',
        description:
          'Open a PDF file up to 50 MB locally in your browser tab or click Try sample PDF.',
      },
      {
        title: 'Adjust crop margins',
        description:
          'Set top, right, bottom, and left trim margins in points to apply across pages.',
      },
      {
        title: 'Save the trimmed PDF',
        description:
          'Updated PDF crop boxes are written cleanly without re-compressing text.',
      },
    ],
    faqs: [
      {
        question: 'Does Crop PDF apply the crop box to all pages?',
        answer:
          'Yes. Your top, right, bottom, and left margin trims are applied consistently across every page in the PDF.',
      },
      {
        question: 'Does cropping a PDF blur crisp vector text?',
        answer:
          'No. Updating page crop dimensions keeps vector text and fonts completely sharp.',
      },
      {
        question: 'What is the maximum file size?',
        answer:
          'Crop PDF supports PDF documents up to 50 MB.',
      },
      {
        question: 'Does Crop PDF work locally on my device?',
        answer:
          'Yes. Cropping runs client-side in your browser with zero server uploads.',
      },
    ],
    relatedTools: ['rotate-pdf', 'rearrange-pdf', 'pdf-page-deleter', 'split-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    slug: 'pdf-to-png',
    category: 'pdf-tools',
    url: '/pdf-to-png',
    description: 'Render PDF pages into sharp, lossless PNG images right in your browser.',
    longDescription:
      'When you need crisp screenshots of charts, diagrams, or typography without JPEG compression artifacts, PDF to PNG rasterizes PDF pages into lossless PNG images directly in your browser with no platform watermark.',
    keywords: [
      'pdf to png',
      'convert pdf to png',
      'pdf page to png',
      'lossless pdf image',
    ],
    icon: 'ImageDown',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to PNG — Render Pages as PNG | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to PNG renders pages from PDFs up to 50 MB into sharp lossless PNG images in your browser with no watermark.',
    howTo: [
      {
        title: 'Select a PDF file',
        description:
          'Load a PDF document up to 50 MB in your browser or click Try sample PDF.',
      },
      {
        title: 'Pick page number',
        description:
          'Choose which page number to render into a sharp lossless PNG image.',
      },
      {
        title: 'Save the lossless PNG',
        description:
          'Your browser exports a clean, unwatermarked PNG image ready for immediate download.',
      },
    ],
    faqs: [
      {
        question: 'When should I choose PDF to PNG over PDF to JPG?',
        answer:
          'Choose PNG for crisp diagrams, UI screenshots, and sharp text edges without JPEG artifacts or watermarks.',
      },
      {
        question: 'Does PDF to PNG add a platform watermark?',
        answer:
          'No. PDF to PNG exports clean PNG pages without a watermark.',
      },
      {
        question: 'What is the PDF size limit?',
        answer:
          'PDF to PNG supports PDF files up to 50 MB.',
      },
      {
        question: 'Are PDF pages rendered locally?',
        answer:
          'Yes. Rendering takes place locally inside your browser tab.',
      },
    ],
    relatedTools: ['png-to-pdf', 'pdf-to-jpg', 'pdf-to-tiff', 'extract-images-from-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-page-deleter',
    name: 'PDF Page Deleter',
    slug: 'pdf-page-deleter',
    category: 'pdf-tools',
    url: '/pdf-page-deleter',
    description: 'Remove blank, duplicate, or unwanted pages from a PDF in seconds.',
    longDescription:
      'Trailing cover sheets, accidental blank scans, or unnecessary appendices are easy to strip out. PDF Page Deleter removes any page numbers or ranges you specify right inside your browser and saves the cleaned PDF.',
    keywords: [
      'pdf page deleter',
      'delete pdf pages',
      'remove pages from pdf',
      'drop pdf page',
    ],
    icon: 'Trash2',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF Page Deleter — Remove PDF Pages | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF Page Deleter lets you remove unwanted pages from PDFs up to 50 MB locally in your browser.',
    howTo: [
      {
        title: 'Open your PDF',
        description:
          'Load a PDF up to 50 MB in the browser workspace or click Try sample PDF.',
      },
      {
        title: 'Enter pages to delete',
        description:
          'Specify individual page numbers or ranges (such as 2 or 2-3) to remove from the document.',
      },
      {
        title: 'Download the cleaned PDF',
        description:
          'Your browser assembles the remaining pages cleanly without quality loss.',
      },
    ],
    faqs: [
      {
        question: 'Does deleting pages modify the formatting of kept pages?',
        answer:
          'No. Remaining pages keep their original fonts, links, and resolution intact.',
      },
      {
        question: 'Can I reorder remaining pages instead?',
        answer:
          'For changing page sequence, use Rearrange PDF.',
      },
      {
        question: 'What is the file size limit?',
        answer:
          'PDF Page Deleter accepts PDF files up to 50 MB.',
      },
      {
        question: 'Does this tool run privately in my browser?',
        answer:
          'Yes. Page removal runs 100% locally in your browser.',
      },
    ],
    relatedTools: ['rearrange-pdf', 'split-pdf', 'merge-pdf', 'crop-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'rearrange-pdf',
    name: 'Rearrange PDF',
    slug: 'rearrange-pdf',
    category: 'pdf-tools',
    url: '/rearrange-pdf',
    description: 'Reorder and organize PDF pages in any sequence you need.',
    longDescription:
      'Scanned handouts or combined reports often end up out of order. Rearrange PDF lets you specify any custom page sequence or reverse all pages with one click inside your browser and export a clean PDF.',
    keywords: [
      'rearrange pdf',
      'reorder pdf pages',
      'sort pdf pages',
      'organize pdf',
      'move pdf pages',
    ],
    icon: 'ArrowUpDown',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Rearrange PDF — Reorder PDF Pages | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Rearrange PDF lets you reorder or reverse pages in PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Load a PDF file',
        description:
          'Open a PDF document up to 50 MB in your browser or click Try sample PDF.',
      },
      {
        title: 'Set your page sequence',
        description:
          'Type your desired page order (e.g., 3, 1, 2) or click Reverse Order to flip the sequence.',
      },
      {
        title: 'Save the reordered PDF',
        description:
          'Your browser writes a fresh PDF matching your updated page sequence.',
      },
    ],
    faqs: [
      {
        question: 'Can I reverse the page order of a backwards scan?',
        answer:
          'Yes. Click Reverse Order to populate the reversed sequence or type any custom order.',
      },
      {
        question: 'Does reordering change text searchability?',
        answer:
          'No. Searchable text layers and vector sharpness stay untouched on every page.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'Rearrange PDF supports PDF files up to 50 MB.',
      },
      {
        question: 'Are files uploaded to external servers?',
        answer:
          'No. Page reorganization runs entirely client-side inside your browser.',
      },
    ],
    relatedTools: ['pdf-page-deleter', 'rotate-pdf', 'merge-pdf', 'split-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'extract-images-from-pdf',
    name: 'Extract Images from PDF',
    slug: 'extract-images-from-pdf',
    category: 'pdf-tools',
    url: '/extract-images-from-pdf',
    description: 'Pull original embedded photos and graphics out of any PDF document.',
    longDescription:
      'Instead of taking blurry screenshots of graphics inside a brochure or report, Extract Images from PDF inspects PDF pages locally in your browser and extracts embedded raster image objects into downloadable PNG files.',
    keywords: [
      'extract images from pdf',
      'get images from pdf',
      'pdf image extractor',
      'pull photos from pdf',
    ],
    icon: 'Images',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Extract Images from PDF — Free Browser Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Extract Images from PDF pulls embedded photos and graphics from PDFs up to 50 MB locally in your browser.',
    howTo: [
      {
        title: 'Open your PDF document',
        description:
          'Select a PDF file up to 50 MB (or click Try sample PDF, which includes an embedded graphic on Page 1).',
      },
      {
        title: 'Scan embedded image objects',
        description:
          'Click Run Extract Images from PDF to detect embedded raster images across your PDF pages.',
      },
      {
        title: 'Download extracted images',
        description:
          'Save each detected image directly to your device without leaving your browser.',
      },
    ],
    faqs: [
      {
        question: 'How is this different from PDF to PNG or PDF to JPG?',
        answer:
          'PDF to PNG/JPG renders full pages (including text and layout). Extract Images from PDF pulls out standalone embedded raster pictures.',
      },
      {
        question: 'What if a graphic in my PDF is vector artwork?',
        answer:
          'Only raster image objects embedded in the PDF are extracted directly; pure vector drawings remain part of the page.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'Extract Images from PDF supports PDFs up to 50 MB.',
      },
      {
        question: 'Does extraction happen in my browser?',
        answer:
          'Yes. Inspection and extraction run locally without remote uploads.',
      },
    ],
    relatedTools: ['pdf-to-png', 'pdf-to-jpg', 'images-to-pdf', 'pdf-to-text'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'create-pdf',
    name: 'Create PDF',
    slug: 'create-pdf',
    category: 'pdf-tools',
    url: '/create-pdf',
    description: 'Build a clean PDF from typed text and uploaded images in your browser.',
    longDescription:
      'Need to put together a quick letter, simple handout, or photo-and-notes document without opening a heavy word processor? Create PDF lets you type or paste text, optionally attach images up to 20 MB per image, and compile a standard PDF locally.',
    keywords: [
      'create pdf',
      'make pdf',
      'new pdf',
      'pdf creator',
      'text and images to pdf',
    ],
    icon: 'FilePlus',
    acceptedFormats: ['TXT', 'JPG', 'PNG'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `Create PDF — Build PDFs from Text & Images | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create PDF lets you compose text and images up to 20 MB each into a clean PDF directly in your browser.',
    howTo: [
      {
        title: 'Add text or select images',
        description:
          'Write or paste text in the editor and optionally attach up to 20 images (max 20 MB per image) or click Try sample image.',
      },
      {
        title: 'Run PDF generation',
        description:
          'Click Run Create PDF to paginate your text onto A4 pages and append attached image pages.',
      },
      {
        title: 'Download the PDF locally',
        description:
          'Your browser builds a clean, watermark-free PDF file in seconds.',
      },
    ],
    faqs: [
      {
        question: 'Can I combine both written notes and photos in Create PDF?',
        answer:
          'Yes. Create PDF supports plain text paragraphs alongside optional attached images.',
      },
      {
        question: 'What is the size limit for images added to Create PDF?',
        answer:
          'Images can be up to 20 MB per image, with up to 20 attachments per document.',
      },
      {
        question: 'Does Create PDF run privately in my browser?',
        answer:
          'Yes. Document assembly happens completely inside your browser.',
      },
      {
        question: 'What if I only want to convert multiple photos into a PDF?',
        answer:
          'Use IMAGES to PDF for fast multi-photo page bundling.',
      },
    ],
    relatedTools: ['images-to-pdf', 'pdf-editor', 'add-text-to-pdf', 'merge-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-csv',
    name: 'PDF to CSV',
    slug: 'pdf-to-csv',
    category: 'pdf-tools',
    url: '/pdf-to-csv',
    description: 'Extract tabular rows from PDFs into plain comma-separated CSV files.',
    longDescription:
      'CSV files are ideal for importing structured lists into databases, scripts, and spreadsheet apps. PDF to CSV extracts tabular rows locally in your browser and outputs UTF-8 CSV data. Note: built for simple tables—table detection is imperfect on complex layouts.',
    keywords: [
      'pdf to csv',
      'extract csv from pdf',
      'pdf table to csv',
      'convert pdf to csv',
    ],
    icon: 'Table',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to CSV — Extract PDF Tables to CSV | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to CSV extracts simple tabular rows from PDFs up to 50 MB into UTF-8 CSV files in your browser.',
    howTo: [
      {
        title: 'Select a PDF with tables',
        description:
          'Load a PDF file up to 50 MB inside your browser or click Try sample PDF.',
      },
      {
        title: 'Extract rows and columns',
        description:
          'Your browser groups aligned text items across pages into comma-separated rows.',
      },
      {
        title: 'Save the CSV output',
        description:
          'Download a clean UTF-8 .csv file ready for spreadsheets and data imports.',
      },
    ],
    faqs: [
      {
        question: 'How accurate is PDF to CSV on multi-line cells or complex layouts?',
        answer:
          'Table detection is for simple tables only and is imperfect on complex layouts—merged cells, wrapped lines, or irregular spacing may need quick cleanup after export.',
      },
      {
        question: 'When should I pick PDF to Excel instead of PDF to CSV?',
        answer:
          'Use PDF to Excel if you want a formatted .xlsx workbook instead of a plain text CSV.',
      },
      {
        question: 'What is the PDF file size limit?',
        answer:
          'PDF to CSV supports PDF documents up to 50 MB.',
      },
      {
        question: 'Does PDF to CSV send files to a server?',
        answer:
          'No. Table parsing runs directly inside your browser.',
      },
    ],
    relatedTools: ['pdf-to-excel', 'pdf-to-text', 'pdf-to-word', 'split-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'add-numbers-to-pdf',
    name: 'Add Numbers to PDF',
    slug: 'add-numbers-to-pdf',
    category: 'pdf-tools',
    url: '/add-numbers-to-pdf',
    description: 'Insert clean page numbers across PDF headers or footers.',
    longDescription:
      'After merging multiple contracts or chapters together, page numbering often gets out of sync. Add Numbers to PDF stamps crisp footer page numbers directly onto every page inside your browser.',
    keywords: [
      'add numbers to pdf',
      'pdf page numbers',
      'number pdf pages',
      'bates numbering',
      'footer page numbers pdf',
    ],
    icon: 'Hash',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Add Numbers to PDF — Stamp Page Numbers | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Add Numbers to PDF inserts clean page numbers across PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Open your PDF document',
        description:
          'Load a PDF up to 50 MB into your browser or click Try sample PDF.',
      },
      {
        title: 'Run page numbering',
        description:
          'Click Run Add Numbers to PDF to stamp sequential Page X of Y numbers along the bottom margin.',
      },
      {
        title: 'Download the numbered PDF',
        description:
          'Your browser embeds crisp vector page numbers onto each page with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Does Add Numbers to PDF preserve existing text and graphics?',
        answer:
          'Yes. Page numbers are stamped over the footer margin while keeping all original page content intact.',
      },
      {
        question: 'Are page numbers crisp when printed?',
        answer:
          'Yes. Numbers are written as vector PDF text rather than low-resolution images.',
      },
      {
        question: 'What is the maximum file size?',
        answer:
          'Add Numbers to PDF supports PDFs up to 50 MB.',
      },
      {
        question: 'Does this run locally in my browser?',
        answer:
          'Yes. All page stamping runs locally without remote uploads.',
      },
    ],
    relatedTools: ['merge-pdf', 'add-watermark-to-pdf', 'add-text-to-pdf', 'rearrange-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'add-watermark-to-pdf',
    name: 'Add Watermark to PDF',
    slug: 'add-watermark-to-pdf',
    category: 'pdf-tools',
    url: '/add-watermark-to-pdf',
    description: 'Stamp your own custom text or image watermark onto your PDF pages.',
    longDescription:
      'Need to mark a draft "CONFIDENTIAL" or place your studio emblem across proof pages? Add Watermark to PDF lets you stamp your own custom text or image watermark with adjustable opacity directly inside your browser.',
    keywords: [
      'add watermark to pdf',
      'watermark pdf',
      'stamp pdf',
      'confidential watermark pdf',
      'custom pdf watermark',
    ],
    icon: 'Stamp',
    acceptedFormats: ['PDF', 'PNG', 'JPG'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Add Watermark to PDF — Custom PDF Stamps | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Add Watermark to PDF stamps your own custom text or logo watermark onto PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Choose your PDF file',
        description:
          'Select a PDF document up to 50 MB in your browser or click Try sample PDF.',
      },
      {
        title: 'Configure your own watermark',
        description:
          'Enter custom watermark text (or optionally pick a PNG/JPG image watermark) and adjust the opacity slider.',
      },
      {
        title: 'Save the watermarked PDF',
        description:
          'Your browser stamps your custom mark cleanly across every page.',
      },
    ],
    faqs: [
      {
        question: 'Can I use my own company logo or custom text?',
        answer:
          'Yes. Supply your own text string or PNG/JPG image watermark—the platform never inserts its own branding onto your PDF.',
      },
      {
        question: 'Can I adjust watermark opacity?',
        answer:
          'Yes. Use the opacity slider to dial in light proof watermarks or bold stamps.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'Add Watermark to PDF accepts PDF files up to 50 MB.',
      },
      {
        question: 'Does Add Watermark to PDF upload my confidential draft?',
        answer:
          'No. Watermark stamping runs locally inside your browser.',
      },
    ],
    relatedTools: ['add-numbers-to-pdf', 'protect-pdf', 'add-text-to-pdf', 'sign-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'images-to-pdf',
    name: 'IMAGES to PDF',
    slug: 'images-to-pdf',
    category: 'pdf-tools',
    url: '/images-to-pdf',
    description: 'Combine up to 20 mixed JPG, PNG, WebP, GIF, or TIFF images into one PDF.',
    longDescription:
      'When your folder holds a mix of PNG screenshots, JPG photos, WebP exports, or GIF graphics, IMAGES to PDF bundles up to 20 images (max 20 MB per image) into a single organized PDF document inside your browser.',
    keywords: [
      'images to pdf',
      'multiple images to pdf',
      'photos to pdf',
      'pictures to pdf',
      'combine images to pdf',
    ],
    icon: 'Images',
    acceptedFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'TIFF'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `IMAGES to PDF — Batch Images to PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'IMAGES to PDF combines up to 20 mixed images (max 20 MB per image) into one clean PDF directly in your browser.',
    howTo: [
      {
        title: 'Select up to 20 images',
        description:
          'Pick up to 20 JPG, PNG, WebP, GIF, or TIFF files (max 20 MB each), or click Try sample image to load test graphics.',
      },
      {
        title: 'Review your batch',
        description:
          'Check the uploaded image list before converting each image onto its own fitted PDF page.',
      },
      {
        title: 'Create your PDF locally',
        description:
          'Your browser builds one multi-page PDF with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'How many images can I bundle at once?',
        answer:
          'IMAGES to PDF supports up to 20 images per batch, up to 20 MB per image.',
      },
      {
        question: 'Can I mix different image formats in the same PDF?',
        answer:
          'Yes. Combine JPG, PNG, WebP, GIF, and browser-supported TIFF images together in one document.',
      },
      {
        question: 'Does IMAGES to PDF work locally without uploading photos?',
        answer:
          'Yes. Image decoding and PDF assembly happen inside your browser.',
      },
      {
        question: 'Are HEIC iPhone photos supported too?',
        answer:
          'For Apple HEIC photos, use our dedicated HEIC to PDF tool.',
      },
    ],
    relatedTools: ['jpg-to-pdf', 'png-to-pdf', 'webp-to-pdf', 'heic-to-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'heic-to-pdf',
    name: 'HEIC to PDF',
    slug: 'heic-to-pdf',
    category: 'pdf-tools',
    url: '/heic-to-pdf',
    description: 'Convert Apple HEIC and HEIF photos into a universal PDF in your browser.',
    longDescription:
      'iPhone and iPad cameras default to HEIC images that many portals and offices cannot open. HEIC to PDF decodes browser-readable HEIC/HEIF photos up to 20 MB per image locally into a shareable PDF. Decoding may be slow on large files.',
    keywords: [
      'heic to pdf',
      'heif to pdf',
      'iphone photo to pdf',
      'convert heic to pdf',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['HEIC', 'HEIF'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `HEIC to PDF — Convert iPhone HEICs | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'HEIC to PDF converts HEIC and HEIF photos up to 20 MB each into PDFs inside your browser. May be slow on large files.',
    howTo: [
      {
        title: 'Choose HEIC photos',
        description:
          'Select up to 20 HEIC or HEIF photos (max 20 MB per image), or click Try sample image to test the PDF workflow.',
      },
      {
        title: 'Convert locally in browser',
        description:
          'Your browser decodes supported image frames onto fitted PDF pages.',
      },
      {
        title: 'Download the PDF file',
        description:
          'Save a standard PDF readable on desktop, mobile, and upload portals.',
      },
    ],
    faqs: [
      {
        question: 'Why can HEIC to PDF feel slower or depend on browser support?',
        answer:
          'HEIC decoding in the browser relies on native OS/browser codecs (such as Safari) or CPU decoding, so support and speed vary by device and file size.',
      },
      {
        question: 'What is the maximum size per HEIC file?',
        answer:
          'Each HEIC or HEIF image can be up to 20 MB, with up to 20 images per batch.',
      },
      {
        question: 'Are my personal iPhone photos sent to a server?',
        answer:
          'No. Conversion runs completely inside your browser.',
      },
      {
        question: 'Does HEIC to PDF add a watermark?',
        answer:
          'No. Output PDFs never include a platform watermark.',
      },
    ],
    relatedTools: ['images-to-pdf', 'jpg-to-pdf', 'png-to-pdf', 'convert-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'add-text-to-pdf',
    name: 'Add Text to PDF',
    slug: 'add-text-to-pdf',
    category: 'pdf-tools',
    url: '/add-text-to-pdf',
    description: 'Type and position clean text boxes directly onto any PDF page.',
    longDescription:
      'Filling out flat non-interactive forms, adding dates, or inserting short labels is fast with Add Text to PDF. Pick a page, corner/position, and font size, and embed crisp vector text right in your browser.',
    keywords: [
      'add text to pdf',
      'type on pdf',
      'fill pdf form',
      'write on pdf',
      'insert text pdf',
    ],
    icon: 'Type',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Add Text to PDF — Type onto PDF Pages | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Add Text to PDF lets you stamp custom text onto PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Load your PDF file',
        description:
          'Open a PDF up to 50 MB locally in your browser or click Try sample PDF.',
      },
      {
        title: 'Configure text, page, and position',
        description:
          'Enter your text, choose the target page, pick top/center/bottom placement, and adjust font size.',
      },
      {
        title: 'Save the updated PDF',
        description:
          'Your browser embeds the new vector text cleanly into the PDF document.',
      },
    ],
    faqs: [
      {
        question: 'Can Add Text to PDF edit existing locked paragraphs?',
        answer:
          'It adds new text overlays onto pages; existing PDF text cannot be edited or reflowed like Word. For broader markup, see PDF Editor.',
      },
      {
        question: 'Does added text stay crisp when printed?',
        answer:
          'Yes. Text is embedded as vector PDF text rather than low-resolution bitmap pixels.',
      },
      {
        question: 'What is the PDF file size limit?',
        answer:
          'Add Text to PDF accepts PDFs up to 50 MB.',
      },
      {
        question: 'Are my forms kept private on my device?',
        answer:
          'Yes. Text placement runs locally in your browser with no remote uploads.',
      },
    ],
    relatedTools: ['pdf-editor', 'annotate-pdf', 'sign-pdf', 'add-numbers-to-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'annotate-pdf',
    name: 'Annotate PDF',
    slug: 'annotate-pdf',
    category: 'pdf-tools',
    url: '/annotate-pdf',
    description: 'Highlight text, attach review notes, and add markups to PDF pages.',
    longDescription:
      'Reviewing essays, contracts, and design proofs is faster when highlights and review notes sit right on the document. Annotate PDF runs in your browser for PDFs up to 50 MB without remote uploads.',
    keywords: [
      'annotate pdf',
      'highlight pdf',
      'pdf notes',
      'draw on pdf',
      'comment on pdf',
    ],
    icon: 'Highlighter',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Annotate PDF — Highlight & Review Notes | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Annotate PDF lets you add highlighted callouts and review notes onto PDFs up to 50 MB directly in your browser.',
    howTo: [
      {
        title: 'Open a PDF document',
        description:
          'Open a PDF up to 50 MB directly in your browser or click Try sample PDF.',
      },
      {
        title: 'Add highlights and notes',
        description:
          'Type your annotation note, pick the target page and placement, and toggle highlight shading.',
      },
      {
        title: 'Save the annotated PDF',
        description:
          'Export a clean PDF preserving your highlights and margin notes.',
      },
    ],
    faqs: [
      {
        question: 'What annotation controls are included?',
        answer:
          'Annotate PDF lets you place custom text notes, choose target pages and positions, and add yellow highlight bars.',
      },
      {
        question: 'How is Annotate PDF different from PDF Editor?',
        answer:
          'Annotate PDF streamlines review highlights and notes, while PDF Editor also supports attaching custom image stamps.',
      },
      {
        question: 'What is the file size limit?',
        answer:
          'Annotate PDF supports PDF documents up to 50 MB.',
      },
      {
        question: 'Do annotations stay private on my device?',
        answer:
          'Yes. Markup processing stays 100% in your browser.',
      },
    ],
    relatedTools: ['pdf-editor', 'add-text-to-pdf', 'sign-pdf', 'add-watermark-to-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'tiff-to-pdf',
    name: 'TIFF to PDF',
    slug: 'tiff-to-pdf',
    category: 'pdf-tools',
    url: '/tiff-to-pdf',
    description: 'Convert TIFF scans into lightweight, universal PDF files.',
    longDescription:
      'Office scanners and print archives often produce TIFF files that standard viewers struggle with. TIFF to PDF converts browser-decodable TIFF images up to 20 MB each into universal PDF documents directly inside your browser.',
    keywords: [
      'tiff to pdf',
      'tif to pdf',
      'convert tiff to pdf',
      'scan tiff to pdf',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['TIFF', 'TIF'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `TIFF to PDF — Convert TIFF Scans to PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'TIFF to PDF turns TIFF scans up to 20 MB per image (max 20 files) into standard PDF files inside your browser.',
    howTo: [
      {
        title: 'Select TIFF files',
        description:
          'Load up to 20 TIFF or TIF images (max 20 MB per image), or click Try sample image to test the conversion workflow.',
      },
      {
        title: 'Convert in browser',
        description:
          'Each image is rendered via HTML5 canvas and embedded cleanly onto a fitted PDF page.',
      },
      {
        title: 'Download the PDF',
        description:
          'Your browser packages the pages into one compact, shareable PDF.',
      },
    ],
    faqs: [
      {
        question: 'Does TIFF decoding depend on my browser?',
        answer:
          'Yes. Browsers like Safari support TIFF natively; some Chromium builds only decode standard web formats, in which case converting to PNG/JPG first ensures universal results.',
      },
      {
        question: 'What is the maximum file size per TIFF?',
        answer:
          'TIFF to PDF accepts up to 20 MB per image, up to 20 files per batch.',
      },
      {
        question: 'Can I combine TIFFs with JPG or PNG files?',
        answer:
          'Yes. Use IMAGES to PDF to bundle mixed image formats into a single PDF.',
      },
      {
        question: 'Does conversion run locally in my browser?',
        answer:
          'Yes. Decoding and PDF output stay completely on your device.',
      },
    ],
    relatedTools: ['pdf-to-tiff', 'images-to-pdf', 'png-to-pdf', 'compress-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-tiff',
    name: 'PDF to TIFF',
    slug: 'pdf-to-tiff',
    category: 'pdf-tools',
    url: '/pdf-to-tiff',
    description: 'Export PDF pages as high-clarity archival TIFF images in your browser.',
    longDescription:
      'Legal discovery, print prepress, and document archiving workflows frequently require uncompressed or lossless TIFF pages. When launched, PDF to TIFF will rasterize PDFs up to 50 MB into clean TIFF images right inside your browser.',
    keywords: [
      'pdf to tiff',
      'pdf to tif',
      'convert pdf to tiff',
      'archival tiff pdf',
    ],
    icon: 'ImageDown',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to TIFF — Export PDFs as TIFF Images | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to TIFF will rasterize PDF documents up to 50 MB into high-clarity TIFF images inside your browser. View planned limits.',
    howTo: [
      {
        title: 'Open your PDF document',
        description:
          'Once live, you will pick a PDF file up to 50 MB inside your browser tab.',
      },
      {
        title: 'Choose DPI and output mode',
        description:
          'You will select print resolution presets and per-page or multi-page TIFF output.',
      },
      {
        title: 'Save the TIFF export',
        description:
          'Your browser will generate watermark-free TIFF images directly on your device.',
      },
    ],
    faqs: [
      {
        question: 'Does PDF to TIFF add any platform watermark?',
        answer:
          'No. Only Compress Image, Resize Image, Convert Image, Crop Image, and PDF to JPG carry a subtle corner watermark.',
      },
      {
        question: 'What is the maximum PDF file size?',
        answer:
          'PDF to TIFF is designed for PDF files up to 50 MB.',
      },
      {
        question: 'Can I also export PDF pages as PNG or JPG?',
        answer:
          'Yes. Check out PDF to PNG for lossless web images or PDF to JPG for compact previews.',
      },
      {
        question: 'Do my documents leave my browser?',
        answer:
          'No. Rasterization and TIFF encoding happen locally on your device.',
      },
    ],
    relatedTools: ['tiff-to-pdf', 'pdf-to-png', 'pdf-to-jpg', 'extract-images-from-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'webp-to-pdf',
    name: 'WEBP to PDF',
    slug: 'webp-to-pdf',
    category: 'pdf-tools',
    url: '/webp-to-pdf',
    description: 'Convert modern WebP graphics into universally readable PDF documents.',
    longDescription:
      'Images saved from modern websites often use WebP, which older document viewers and submission portals reject. WEBP to PDF converts WebP images up to 20 MB each into a clean PDF directly inside your browser.',
    keywords: [
      'webp to pdf',
      'convert webp to pdf',
      'web image to pdf',
      'webp document',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `WEBP to PDF — Convert WebP to PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'WEBP to PDF converts WebP images up to 20 MB each (max 20 files) into clean PDF documents inside your browser.',
    howTo: [
      {
        title: 'Select WebP files',
        description:
          'Load up to 20 WebP images (max 20 MB per image) in your browser or click Try sample image.',
      },
      {
        title: 'Convert via browser canvas',
        description:
          'Each WebP image is decoded cleanly in your browser and fitted onto its own PDF page.',
      },
      {
        title: 'Save the PDF document',
        description:
          'Your browser builds a standard, watermark-free PDF file instantly.',
      },
    ],
    faqs: [
      {
        question: 'How many WebP images can I combine into one PDF?',
        answer:
          'You can combine up to 20 WebP images, up to 20 MB per image.',
      },
      {
        question: 'Do transparent WebP images render cleanly?',
        answer:
          'Yes. Transparent areas are composited smoothly onto a crisp white PDF page.',
      },
      {
        question: 'Can I convert WebP to JPG or PNG instead?',
        answer:
          'Yes. Use Convert Image under Image Tools for image-to-image format conversion.',
      },
      {
        question: 'Does WEBP to PDF run locally in my browser?',
        answer:
          'Yes. WebP decoding and PDF generation happen strictly in your browser.',
      },
    ],
    relatedTools: ['images-to-pdf', 'png-to-pdf', 'jpg-to-pdf', 'convert-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    slug: 'pdf-to-text',
    category: 'pdf-tools',
    url: '/pdf-to-text',
    description: 'Extract plain UTF-8 text (.txt) cleanly from any searchable PDF.',
    longDescription:
      'When you just want clean copy without styling, headers, or tables getting in the way, PDF to Text extracts all selectable text from PDFs up to 50 MB into a lightweight .txt file directly in your browser.',
    keywords: [
      'pdf to text',
      'pdf to txt',
      'extract text from pdf',
      'copy text from pdf',
    ],
    icon: 'FileText',
    acceptedFormats: ['PDF'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `PDF to Text — Extract Plain Text (.txt) | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'PDF to Text extracts selectable text from PDFs up to 50 MB into clean .txt files inside your browser.',
    howTo: [
      {
        title: 'Select a PDF document',
        description:
          'Open a PDF up to 50 MB directly in your browser or click Try sample PDF.',
      },
      {
        title: 'Extract page text',
        description:
          'Your browser reads embedded text layers across every page cleanly.',
      },
      {
        title: 'Download the .txt file',
        description:
          'Save a plain UTF-8 text file locally without uploading your document.',
      },
    ],
    faqs: [
      {
        question: 'Does PDF to Text preserve formatting like bold fonts and columns?',
        answer:
          'No. PDF to Text outputs plain unformatted text (.txt); use PDF to Word if you need structured paragraphs.',
      },
      {
        question: 'Does it work on scanned image-only PDFs?',
        answer:
          'It extracts embedded selectable text layers; scanned PDFs without text layers do not contain embedded text.',
      },
      {
        question: 'What is the PDF size limit?',
        answer:
          'PDF to Text supports PDF documents up to 50 MB.',
      },
      {
        question: 'Is extraction performed locally?',
        answer:
          'Yes. Text extraction runs inside your browser tab.',
      },
    ],
    relatedTools: ['pdf-to-epub', 'pdf-to-word', 'pdf-to-csv', 'create-pdf'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'gif-to-pdf',
    name: 'GIF to PDF',
    slug: 'gif-to-pdf',
    category: 'pdf-tools',
    url: '/gif-to-pdf',
    description: 'Convert static or animated GIF images into crisp PDF document pages.',
    longDescription:
      'Need to include a GIF graphic inside a printable document? GIF to PDF turns GIF files up to 20 MB per image into clean static PDF pages directly inside your browser.',
    keywords: [
      'gif to pdf',
      'convert gif to pdf',
      'gif frames to pdf',
      'save gif as pdf',
    ],
    icon: 'FilePlus2',
    acceptedFormats: ['GIF'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `GIF to PDF — Convert GIFs to PDF Pages | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'GIF to PDF converts GIF images up to 20 MB each (max 20 files) into static PDF pages locally in your browser.',
    howTo: [
      {
        title: 'Select GIF files',
        description:
          'Pick up to 20 GIF images (max 20 MB per image) in your browser or click Try sample image.',
      },
      {
        title: 'Render to PDF pages',
        description:
          'Each GIF image is rendered onto its own fitted page in your browser.',
      },
      {
        title: 'Download the PDF',
        description:
          'Your browser packages the pages cleanly into a watermark-free PDF.',
      },
    ],
    faqs: [
      {
        question: 'Do animated GIFs stay animated inside a standard PDF?',
        answer:
          'No. Standard PDFs display static pages, so each GIF renders as a clean static PDF page.',
      },
      {
        question: 'What is the maximum file size per GIF?',
        answer:
          'GIF to PDF accepts up to 20 MB per image and up to 20 files per batch.',
      },
      {
        question: 'Can I turn a video clip into an animated GIF instead?',
        answer:
          'Yes. Check out Video to GIF under Video Tools for short 10-second max GIF clips.',
      },
      {
        question: 'Does GIF to PDF run locally in my browser?',
        answer:
          'Yes. GIF decoding and PDF generation happen inside your browser.',
      },
    ],
    relatedTools: ['images-to-pdf', 'png-to-pdf', 'webp-to-pdf', 'video-to-gif'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },

  // ========================
  // IMAGE TOOLS (6)
  // ========================
  {
    id: 'compress-image',
    name: 'Compress Image',
    slug: 'compress-image',
    category: 'image-tools',
    url: '/compress-image',
    description: 'Shrink JPG, PNG, and WebP file sizes while preserving visual clarity.',
    longDescription:
      'Heavy product shots and hero banners slow down websites and fill up inboxes. Compress Image lets you tune a quality slider or target file size in KB on JPG, PNG, and WebP images (up to 30 MB each, max 20 files) right inside your browser.',
    keywords: [
      'compress image',
      'optimize image',
      'reduce image size',
      'shrink photo',
      'jpg compressor',
      'png compressor',
    ],
    icon: 'Minimize',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 30,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `Compress Image — Shrink JPG, PNG & WebP | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compress Image reduces JPG, PNG, and WebP file sizes (up to 30 MB each, max 20 files) locally in your browser without sacrificing clarity.',
    howTo: [
      {
        title: 'Choose your images',
        description:
          'Select up to 20 JPG, PNG, or WebP files (up to 30 MB each) or click Try sample image to test right away.',
      },
      {
        title: 'Adjust quality or target KB',
        description:
          'Pick Quality % mode or Target KB mode and choose Auto (Smallest) or a specific output format.',
      },
      {
        title: 'Save lighter images',
        description:
          'Your browser encodes the smaller files locally and shows input vs. output sizes ready for download.',
      },
    ],
    faqs: [
      {
        question: 'Does Compress Image upload my photos to a server?',
        answer:
          'No. Image compression runs directly inside your browser using HTML5 canvas encoding.',
      },
      {
        question: 'Which image formats are supported?',
        answer:
          'JPG, PNG, and WebP inputs are supported with batch processing for up to 20 images at once (max 30 MB each).',
      },
      {
        question: 'Is PNG transparency preserved during compression?',
        answer:
          'Yes. Alpha transparency stays intact when exporting as WebP or PNG.',
      },
      {
        question: 'What if I also need to change pixel width and height?',
        answer:
          'Pair this workflow with Resize Image to scale dimensions down before or after compressing.',
      },
    ],
    relatedTools: ['resize-image', 'convert-image', 'crop-image', 'compress-pdf'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    slug: 'resize-image',
    category: 'image-tools',
    url: '/resize-image',
    description: 'Scale photos by exact pixels or percentage with aspect-ratio lock.',
    longDescription:
      'Whether you are preparing thumbnails, blog headers, or marketplace listings, Resize Image scales JPG, PNG, and WebP files (up to 30 MB each, max 20 files) to exact pixel widths and heights or percentages in your browser while optionally locking aspect ratios.',
    keywords: [
      'resize image',
      'scale photo',
      'change image dimensions',
      'image resizer',
      'shrink dimensions',
    ],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 30,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `Resize Image — Change Pixel Dimensions | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize Image scales JPG, PNG, and WebP graphics (up to 30 MB each, max 20 files) by exact pixels or percentage in your browser.',
    howTo: [
      {
        title: 'Select images to resize',
        description:
          'Load up to 20 images (max 30 MB each) or click Try sample image in the workspace.',
      },
      {
        title: 'Enter target dimensions',
        description:
          'Enter exact width and height pixels or choose a percentage scale with Keep aspect ratio toggled as needed.',
      },
      {
        title: 'Export resized files',
        description:
          'Your browser resamples each image to the exact requested dimensions ready for download.',
      },
    ],
    faqs: [
      {
        question: 'Does Resize Image prevent stretching or squishing?',
        answer:
          'Yes. Keep aspect ratio is enabled by default so updating either width or height scales the other dimension proportionally.',
      },
      {
        question: 'Can I resize multiple images in one batch?',
        answer:
          'Yes. Resize Image supports up to 20 images per batch (max 30 MB per file).',
      },
      {
        question: 'What output formats does Resize Image export?',
        answer:
          'You can keep the original image format or export cleanly as PNG, JPG, or WebP.',
      },
      {
        question: 'Does Resize Image run locally in my browser?',
        answer:
          'Yes. Resizing happens client-side on your device without server uploads.',
      },
    ],
    relatedTools: ['crop-image', 'compress-image', 'convert-image', 'jpg-to-pdf'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'convert-image',
    name: 'Convert Image',
    slug: 'convert-image',
    category: 'image-tools',
    url: '/convert-image',
    description: 'Switch smoothly between JPG, PNG, WebP, and AVIF formats.',
    longDescription:
      'Modern web workflows often require converting legacy PNGs into WebP or turning WebP and AVIF downloads back into universally accepted JPGs. Convert Image re-encodes images (up to 30 MB each, max 20 files) directly in your browser.',
    keywords: [
      'convert image',
      'image converter',
      'webp to jpg',
      'png to jpg',
      'jpg to png',
      'avif converter',
    ],
    icon: 'RefreshCw',
    acceptedFormats: ['JPG', 'PNG', 'WebP', 'AVIF'],
    maxFileSizeMB: 30,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `Convert Image — JPG, PNG, WebP & AVIF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert Image transforms photos between JPG, PNG, WebP, and AVIF (up to 30 MB each, max 20 files) directly in your browser.',
    howTo: [
      {
        title: 'Pick source images',
        description:
          'Choose up to 20 JPG, PNG, WebP, or AVIF images (max 30 MB each) or click Try sample image.',
      },
      {
        title: 'Choose the output format',
        description:
          'Select JPG, PNG, or WebP output and adjust quality or background fill color for transparent JPG conversions.',
      },
      {
        title: 'Convert in the browser',
        description:
          'Your device encodes each file with the exact target extension and MIME type.',
      },
    ],
    faqs: [
      {
        question: 'What happens to transparent areas when converting PNG to JPG?',
        answer:
          'Because JPG does not support transparency, you can pick a clean background fill color (defaulting to white) before converting.',
      },
      {
        question: 'Can I convert WebP or AVIF images to PNG or JPG?',
        answer:
          'Yes. Converting WebP or browser-decoded AVIF images to classic JPG, PNG, or WebP works locally.',
      },
      {
        question: 'Does batch conversion support mixed input formats?',
        answer:
          'Yes. You can select up to 20 mixed PNG, JPG, and WebP files and convert all of them to your chosen output format.',
      },
      {
        question: 'Does Convert Image send my photos to an external server?',
        answer:
          'No. Format conversion happens entirely inside your browser.',
      },
    ],
    relatedTools: ['compress-image', 'resize-image', 'jpg-to-pdf', 'pdf-to-jpg'],
    popular: true,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    slug: 'crop-image',
    category: 'image-tools',
    url: '/crop-image',
    description: 'Trim edges and frame photos to custom ratios like 1:1, 4:3, or 16:9.',
    longDescription:
      'Frame your shots cleanly for social headers, square avatars, or widescreen presentations. Crop Image gives you interactive drag selection alongside numeric X, Y, Width, and Height inputs and aspect-ratio presets (Freehand, 1:1, 4:3, 16:9, 3:4) right in your browser.',
    keywords: [
      'crop image',
      'trim photo',
      'cut image',
      'aspect ratio crop',
      'square crop',
    ],
    icon: 'Crop',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 30,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Crop Image — Trim & Frame Aspect Ratios | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Crop Image trims photos up to 30 MB to freehand dimensions or preset 1:1, 4:3, and 16:9 ratios directly in your browser.',
    howTo: [
      {
        title: 'Load an image locally',
        description:
          'Open a JPG, PNG, or WebP file up to 30 MB or click Try sample image in the interactive frame.',
      },
      {
        title: 'Drag crop area or enter coordinates',
        description:
          'Drag the crop box on the preview, snap to an aspect preset (1:1, 4:3, 16:9), or type exact X, Y, Width, and Height values.',
      },
      {
        title: 'Save the cropped image',
        description:
          'Your browser renders the trimmed selection and shows the exact cropped pixel dimensions.',
      },
    ],
    faqs: [
      {
        question: 'Which aspect-ratio presets does Crop Image include?',
        answer:
          'Included presets are Freehand, 1:1 (Square), 4:3, 16:9, and 3:4.',
      },
      {
        question: 'Can I type exact pixel crop coordinates?',
        answer:
          'Yes. Alongside interactive drag-and-resize handles, numeric X, Y, Width, and Height inputs stay synced with your selection.',
      },
      {
        question: 'Does Crop Image run inside my browser?',
        answer:
          'Yes. Cropping happens client-side using HTML5 Canvas without sending your image anywhere.',
      },
      {
        question: 'Can I shrink the cropped file size afterward?',
        answer:
          'Yes. Pass the cropped image into Compress Image or Convert Image for web delivery.',
      },
    ],
    relatedTools: ['resize-image', 'compress-image', 'convert-image', 'pdf-to-jpg'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },

  {
    id: 'profile-photo',
    name: 'Profile Photo Maker',
    slug: 'profile-photo',
    category: 'image-tools',
    url: '/profile-photo',
    description:
      'Create a round profile picture with your chosen solid colour or subtle pattern backdrop.',
    longDescription:
      'Profile Photo Maker creates clean circular avatars for LinkedIn, GitHub, Discord, and Slack. Crop your photo inside a circle frame, pick transparent corners or a custom background colour/pattern, adjust zoom and framing, and export crisp 400×400 or 800×800 PNG images with zero watermark. Simple scope: round crop and background colour/pattern only—no AI, no face detection, and no background removal.',
    keywords: [
      'profile photo maker',
      'round profile picture',
      'circle avatar crop',
      'pfp maker',
      'headshot crop',
    ],
    icon: 'CircleUserRound',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Profile Photo Maker — Round Avatar Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Profile Photo Maker creates round 400x400 and 800x800 PNG avatars (up to 20 MB) with custom background colours or patterns in your browser. No watermark.',
    howTo: [
      {
        title: 'Choose your portrait or logo',
        description:
          'Select a JPG, PNG, or WebP photo up to 20 MB (or click Try sample image) directly inside your browser.',
      },
      {
        title: 'Position circle crop & background',
        description:
          'Adjust zoom and pan inside the circle frame and pick transparent corners, a solid colour, or a subtle pattern backdrop.',
      },
      {
        title: 'Export 400×400 or 800×800 PNG',
        description:
          'Download a sharp, unwatermarked round PNG profile image ready for social and work profiles.',
      },
    ],
    faqs: [
      {
        question: 'Does Profile Photo Maker automatically detect faces or remove backgrounds?',
        answer:
          'No. This tool crops your photo into a round profile picture with the background colour or pattern you choose. It does not use AI, automatic face detection, or background removal.',
      },
      {
        question: 'Which output sizes are supported?',
        answer:
          'You can export standard 400×400 or high-resolution 800×800 circular PNG profile images.',
      },
      {
        question: 'Does Profile Photo Maker add a watermark?',
        answer:
          'No. Outputs from Profile Photo Maker have zero watermarks.',
      },
      {
        question: 'What image formats and file size limit apply?',
        answer:
          'It accepts JPG, PNG, and WebP files up to 20 MB locally in your browser.',
      },
    ],
    relatedTools: ['crop-image', 'resize-image', 'compress-image', 'convert-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'chart-maker',
    name: 'Chart Maker',
    slug: 'chart-maker',
    category: 'image-tools',
    url: '/chart-maker',
    description:
      'Turn spreadsheet rows into Bar, Line, or Pie charts and save clean PNG graphics.',
    longDescription:
      'Need a clean chart for a slide deck or article without wrangling bloated spreadsheet software? Chart Maker lets you enter or edit up to 50 data rows directly in your browser—no file upload required—switch between Bar, Line, and Pie layouts, preview live on canvas, and download crisp unwatermarked PNG images.',
    keywords: [
      'chart maker',
      'bar chart generator',
      'line chart maker',
      'pie chart png',
      'graph maker',
    ],
    icon: 'BarChart3',
    acceptedFormats: ['PNG'],
    maxFileSizeMB: null,
    maxFiles: null,
    maxDataRows: 50,
    processingMethod: 'browser',
    seoTitle: `Chart Maker — Bar, Line & Pie PNG Charts | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Chart Maker turns up to 50 data rows into clean Bar, Line, or Pie PNG charts directly in your browser with no file upload and no watermark.',
    howTo: [
      {
        title: 'Enter up to 50 data rows',
        description:
          'Edit the preloaded sample rows or add up to 50 label and value pairs directly in the browser—no file upload needed.',
      },
      {
        title: 'Pick Bar, Line, or Pie style',
        description:
          'Select Bar, Line, or Pie chart mode, update titles, and choose a palette color theme with instant canvas preview.',
      },
      {
        title: 'Download crisp PNG chart',
        description:
          'Export an unwatermarked PNG graphic straight from your browser canvas for slides or docs.',
      },
    ],
    faqs: [
      {
        question: 'Do I need to upload a file to use Chart Maker?',
        answer:
          'No. Chart Maker requires no file upload—you enter labels and numbers directly in the browser.',
      },
      {
        question: 'How many data rows can Chart Maker plot?',
        answer:
          'Chart Maker supports up to 50 data rows to keep charts crisp and readable.',
      },
      {
        question: 'Which chart types and download format are supported?',
        answer:
          'Chart Maker supports Bar, Line, and Pie charts exported as high-resolution PNG images.',
      },
      {
        question: 'Do exported charts carry a watermark?',
        answer:
          'No. PNG downloads from Chart Maker are completely unwatermarked.',
      },
    ],
    relatedTools: ['csv-to-excel', 'compress-image', 'resize-image', 'convert-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },

  // ========================
  // VIDEO TOOLS (6)
  // ========================
  {
    id: 'compress-video',
    name: 'Compress Video',
    slug: 'compress-video',
    category: 'video-tools',
    url: '/compress-video',
    description: 'Reduce large video file sizes for messaging apps, email, and web.',
    longDescription:
      'Phone recordings and screen captures quickly cross email and chat limits. Compress Video re-encodes MP4, MOV, WebM, and AVI clips up to 100 MB and 3 minutes directly in your browser using open-source FFmpeg, capped at 720p max output resolution.',
    keywords: [
      'compress video',
      'shrink video',
      'reduce video size',
      'smaller mp4',
      'video compressor',
    ],
    icon: 'FileVideo',
    acceptedFormats: ['MP4', 'MOV', 'WebM', 'AVI'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['compress-video'].maxFileSizeMB,
    maxFiles: 1,
    maxDurationMinutes: SITE_CONFIG.videoLimits['compress-video'].maxDurationMinutes,
    maxResolution: SITE_CONFIG.videoLimits['compress-video'].maxResolution,
    processingMethod: 'browser',
    seoTitle: `Compress Video — Shrink Video Size | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compress MP4, MOV, WebM, and AVI clips up to 100 MB (3 min max, 720p max) directly in your browser with open-source FFmpeg.',
    howTo: [
      {
        title: 'Choose a video clip',
        description:
          'Select a video file up to 100 MB and 3 minutes max in MP4, MOV, WebM, or AVI format, or click Try sample video.',
      },
      {
        title: 'Select compression settings',
        description:
          'Pick a quality preset or target size in MB with output capped at 720p max resolution.',
      },
      {
        title: 'Save the compressed MP4',
        description:
          'Open-source FFmpeg runs locally in your browser to produce a smaller MP4 ready for sharing.',
      },
    ],
    faqs: [
      {
        question: 'What are the limits for Compress Video?',
        answer:
          'Compress Video supports source files up to 100 MB, a maximum duration of 3 minutes, and a maximum output resolution of 720p.',
      },
      {
        question: 'Does compressing a video strip the audio track?',
        answer:
          'No. Audio is preserved by default using AAC encoding, with an option to mute audio if you want extra size savings.',
      },
      {
        question: 'How does browser-based video compression work?',
        answer:
          'Compress Video lazy-loads open-source FFmpeg directly in your browser tab so your video stays on your device without server uploads.',
      },
      {
        question: 'Can I also convert an AVI or MKV file to MP4?',
        answer:
          'Yes. If format compatibility is your main goal, check out our Video to MP4 tool.',
      },
    ],
    relatedTools: ['video-to-mp4', 'video-to-gif', 'compress-pdf', 'compress-image'],
    popular: true,
    featured: true,
    rating: null,
    status: 'active',
  },
  {
    id: 'video-to-mp4',
    name: 'Video to MP4',
    slug: 'video-to-mp4',
    category: 'video-tools',
    url: '/video-to-mp4',
    description: 'Convert MOV, WebM, AVI, and MKV recordings into universal MP4 files.',
    longDescription:
      'Some screen recorders and cameras save clips in MOV, WebM, or MKV formats that fail to play on older TVs or presentation decks. Video to MP4 transcodes clips up to 100 MB and 3 minutes directly in your browser with open-source FFmpeg at up to 720p resolution.',
    keywords: [
      'video to mp4',
      'mov to mp4',
      'webm to mp4',
      'mkv to mp4',
      'avi to mp4',
      'convert video to mp4',
    ],
    icon: 'Clapperboard',
    acceptedFormats: ['MOV', 'WebM', 'AVI', 'MKV', 'MP4'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['video-to-mp4'].maxFileSizeMB,
    maxFiles: 1,
    maxDurationMinutes: SITE_CONFIG.videoLimits['video-to-mp4'].maxDurationMinutes,
    maxResolution: SITE_CONFIG.videoLimits['video-to-mp4'].maxResolution,
    processingMethod: 'browser',
    seoTitle: `Video to MP4 — Universal MP4 Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert MOV, WebM, AVI, and MKV clips up to 100 MB (3 min max, 720p max) to universal H.264 MP4 in your browser.',
    howTo: [
      {
        title: 'Pick your source recording',
        description:
          'Choose a MOV, WebM, AVI, or MKV clip up to 100 MB and 3 minutes max, or click Try sample video.',
      },
      {
        title: 'Configure playback settings',
        description:
          'Select your H.264 quality preset and output ceiling up to 720p max resolution.',
      },
      {
        title: 'Save the compatible MP4',
        description:
          'Lazy-loaded open-source FFmpeg transcodes video and audio streams in your browser into standard MP4.',
      },
    ],
    faqs: [
      {
        question: 'What are the limits for Video to MP4?',
        answer:
          'Video to MP4 supports source files up to 100 MB, a maximum duration of 3 minutes, and a maximum output resolution of 720p.',
      },
      {
        question: 'Which codecs does the output MP4 use?',
        answer:
          'Outputs use standard H.264 video and AAC audio so they play reliably across iOS, Android, Windows, macOS, and web browsers.',
      },
      {
        question: 'Does Video to MP4 run locally in my browser?',
        answer:
          'Yes. Open-source FFmpeg loads only when you open a video tool page and converts the clip locally inside your browser.',
      },
      {
        question: 'What if I want an animated loop instead of a video file?',
        answer:
          'Use Video to GIF to turn a short 10-second max clip into a lightweight animated GIF.',
      },
    ],
    relatedTools: ['compress-video', 'video-to-gif', 'convert-image', 'compress-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    slug: 'video-to-gif',
    category: 'video-tools',
    url: '/video-to-gif',
    description: 'Turn short video moments into smooth, shareable animated GIFs.',
    longDescription:
      'Product walkthroughs, reaction clips, and quick UI demos work great as looping GIFs in docs and chats. Video to GIF accepts source videos up to 100 MB and lets you pick a short clip up to 10 seconds max—the whole video is never converted—using browser-based open-source FFmpeg.',
    keywords: [
      'video to gif',
      'mp4 to gif',
      'mov to gif',
      'make gif from video',
      'gif maker',
    ],
    icon: 'Repeat',
    acceptedFormats: ['MP4', 'MOV', 'WebM'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['video-to-gif'].maxFileSizeMB,
    maxFiles: 1,
    maxClipSeconds: SITE_CONFIG.videoLimits['video-to-gif'].maxClipSeconds,
    processingMethod: 'browser',
    seoTitle: `Video to GIF — Create Animated GIFs | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert a 10 sec max clip from MP4, MOV, or WebM videos up to 100 MB into an animated GIF directly in your browser.',
    howTo: [
      {
        title: 'Choose a source video',
        description:
          'Load an MP4, MOV, or WebM video up to 100 MB in your browser, or click Try sample video.',
      },
      {
        title: 'Select a short clip (10 sec max)',
        description:
          'Pick a start time and clip length up to 10 seconds—the full video is never converted to GIF—and set frame rate and width.',
      },
      {
        title: 'Download the animated GIF',
        description:
          'Open-source FFmpeg in your browser builds a palette-optimized animated GIF ready for sharing.',
      },
    ],
    faqs: [
      {
        question: 'Can Video to GIF convert an entire long video?',
        answer:
          'No. You select a short clip of up to 10 seconds maximum. The whole video is never converted to GIF.',
      },
      {
        question: 'What is the maximum source video size?',
        answer:
          'Video to GIF accepts source video files up to 100 MB.',
      },
      {
        question: 'Why does palette optimization matter for GIFs?',
        answer:
          'GIFs only support 256 colors per frame. Generating a custom per-clip color palette prevents grainy dithering and keeps UI text legible.',
      },
      {
        question: 'Do generated GIFs loop automatically?',
        answer:
          'Yes. Output GIFs default to infinite looping, with a checkbox to play once if preferred.',
      },
    ],
    relatedTools: ['compress-video', 'video-to-mp4', 'compress-image', 'resize-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'video-to-audio',
    name: 'Video to Audio',
    slug: 'video-to-audio',
    category: 'video-tools',
    url: '/video-to-audio',
    description: 'Extract clean MP3 audio tracks from video clips right inside your browser.',
    longDescription:
      'Save interviews, lectures, or voiceovers from video recordings without sending bulky media files online. Audio is extracted in your browser — your video never leaves your device. Supports MP4, MOV, WebM, and AVI clips up to 100 MB and 3 minutes max, producing clean MP3 downloads with zero watermarks.',
    keywords: [
      'video to audio',
      'video to mp3',
      'extract audio from video',
      'mp4 to mp3',
      'rip audio browser',
    ],
    icon: 'AudioLines',
    acceptedFormats: ['MP4', 'MOV', 'WebM', 'AVI'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['video-to-audio'].maxFileSizeMB,
    maxFiles: 1,
    maxDurationMinutes: SITE_CONFIG.videoLimits['video-to-audio'].maxDurationMinutes,
    processingMethod: 'browser',
    seoTitle: `Video to Audio — Extract MP3 in Browser | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Extract MP3 audio tracks from MP4, MOV, WebM, or AVI clips up to 100 MB and 3 min max locally in your browser.',
    howTo: [
      {
        title: 'Pick a local video clip',
        description:
          'Choose an MP4, MOV, WebM, or AVI file up to 100 MB and 3 minutes max, or click Try sample video.',
      },
      {
        title: 'Choose MP3 bitrate & extract',
        description:
          'Pick 128–320 kbps and extract the audio locally via browser FFmpeg — your video never leaves your device.',
      },
      {
        title: 'Save your MP3 file',
        description:
          'Preview and download the extracted MP3 audio track cleanly with no watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Is my video uploaded to a server to extract audio?',
        answer:
          'No. Audio is extracted in your browser — your video never leaves your device.',
      },
      {
        question: 'What are the size, duration, and output format limits?',
        answer:
          'Video to Audio supports source files up to 100 MB and 3 minutes max duration, outputting standard MP3 audio.',
      },
      {
        question: 'Which video formats can be converted to MP3?',
        answer:
          'Supported input formats include MP4, MOV, WebM, and AVI.',
      },
      {
        question: 'Does Video to Audio work alongside Compress Video?',
        answer:
          'Yes. Both tools run locally via lazy-loaded open-source FFmpeg in your browser.',
      },
    ],
    relatedTools: ['compress-video', 'video-to-mp4', 'video-to-gif', 'compress-image'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'audio-converter',
    name: 'Audio Converter',
    slug: 'audio-converter',
    category: 'video-tools',
    url: '/audio-converter',
    description:
      'Convert audio to MP3, WAV, or OGG at 128–320 kbps right inside your browser.',
    longDescription:
      'Convert MP3, WAV, M4A, AAC, OGG, and FLAC audio files up to 100 MB into MP3, WAV, or OGG with configurable bitrates from 128 to 320 kbps—processed locally inside your browser using open-source FFmpeg with zero uploads and zero watermarks.',
    keywords: [
      'audio converter',
      'mp3 wav ogg converter',
      'bitrate 128 320 kbps',
      'browser audio converter',
    ],
    icon: 'AudioLines',
    acceptedFormats: ['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['audio-converter'].maxFileSizeMB,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Audio Converter — MP3, WAV & OGG | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert audio files up to 100 MB into MP3, WAV, or OGG at 128–320 kbps locally in your browser.',
    howTo: [
      {
        title: 'Choose a local audio file',
        description:
          'Select an MP3, WAV, M4A, AAC, OGG, or FLAC track up to 100 MB, or click Try sample audio.',
      },
      {
        title: 'Pick output format & bitrate',
        description:
          'Choose MP3, WAV, or OGG output and set bitrate from 128 to 320 kbps for lossy formats.',
      },
      {
        title: 'Convert & download in browser',
        description:
          'Lazy-loaded open-source FFmpeg transcodes locally without uploading your audio.',
      },
    ],
    faqs: [
      {
        question: 'Which output and input audio formats are supported?',
        answer:
          'Audio Converter accepts MP3, WAV, M4A, AAC, OGG, and FLAC inputs and outputs MP3, WAV, or OGG.',
      },
      {
        question: 'What bitrate range and file size limit apply?',
        answer:
          'Bitrates range from 128 to 320 kbps, with a maximum audio file size of 100 MB.',
      },
      {
        question: 'Are audio files uploaded to external servers?',
        answer:
          'No. Transcoding executes locally inside your browser tab.',
      },
      {
        question: 'Need to pull an MP3 soundtrack from a video file instead?',
        answer:
          'Use Video to Audio under Video Tools.',
      },
    ],
    relatedTools: ['video-to-audio', 'video-converter', 'compress-video', 'video-to-mp4'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'video-converter',
    name: 'Video Converter',
    slug: 'video-converter',
    category: 'video-tools',
    url: '/video-converter',
    description:
      'Convert video between MP4, WebM, and MOV formats in your browser.',
    longDescription:
      'Flexible browser video converter powered by lazy-loaded open-source FFmpeg: convert clips between MP4, WebM, and MOV using selectable quality presets—capped at 100 MB, 3 minutes max, and 720p max output with zero uploads and zero watermarks.',
    keywords: [
      'video converter',
      'mp4 webm mov converter',
      'browser video converter',
      'convert video format',
    ],
    icon: 'Film',
    acceptedFormats: ['MP4', 'WebM', 'MOV', 'MKV'],
    maxFileSizeMB: SITE_CONFIG.videoLimits['video-converter'].maxFileSizeMB,
    maxFiles: 1,
    maxDurationMinutes: SITE_CONFIG.videoLimits['video-converter'].maxDurationMinutes,
    maxResolution: SITE_CONFIG.videoLimits['video-converter'].maxResolution,
    processingMethod: 'browser',
    seoTitle: `Video Converter — MP4, WebM & MOV | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert video clips up to 100 MB (3 min max, 720p max) between MP4, WebM, and MOV locally in your browser.',
    howTo: [
      {
        title: 'Load a clip within video limits',
        description:
          'Select a video up to 100 MB and 3 minutes max inside your browser, or click Try sample video.',
      },
      {
        title: 'Choose output format & quality',
        description:
          'Pick MP4, WebM, or MOV along with a quality preset and resolution cap up to 720p max.',
      },
      {
        title: 'Transcode locally via FFmpeg',
        description:
          'Open-source FFmpeg processes the clip in your browser without sending video off your device.',
      },
    ],
    faqs: [
      {
        question: 'What limits apply to Video Converter?',
        answer:
          'Video Converter supports files up to 100 MB, 3 minutes max duration, and 720p max output resolution.',
      },
      {
        question: 'Which output formats are available?',
        answer:
          'You can convert videos to MP4 (H.264), WebM (VP8), or MOV (H.264) directly in your browser.',
      },
      {
        question: 'Does Video Converter add watermarks?',
        answer:
          'No. All Video Tools are free with zero watermarks.',
      },
      {
        question: 'Can I convert standalone audio files too?',
        answer:
          'Yes. Use Audio Converter for MP3, WAV, and OGG conversion.',
      },
    ],
    relatedTools: ['video-to-mp4', 'compress-video', 'video-to-audio', 'audio-converter'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },

  // ========================
  // CONVERTER TOOLS (12)
  // ========================
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    slug: 'excel-to-pdf',
    category: 'converter-tools',
    url: '/excel-to-pdf',
    description:
      'Convert simple Excel spreadsheets (.xlsx, .xls) into clean PDF pages in your browser.',
    longDescription:
      'Turn basic price lists, schedules, and tabular reports into shareable PDFs locally in your browser up to 25 MB. This tool is built for simple spreadsheets only — complex formatting, macros, formulas, and embedded charts are not preserved.',
    keywords: [
      'excel to pdf',
      'xlsx to pdf',
      'xls to pdf',
      'spreadsheet to pdf',
      'convert excel pdf',
    ],
    icon: 'FileSpreadsheet',
    acceptedFormats: ['XLSX', 'XLS'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Excel to PDF — Convert Spreadsheets | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Excel to PDF converts simple XLSX and XLS spreadsheets up to 25 MB into PDF documents directly in your browser. No watermark.',
    howTo: [
      {
        title: 'Select an Excel workbook',
        description:
          'Open a simple .xlsx or .xls file up to 25 MB directly in your browser.',
      },
      {
        title: 'Select sheets and page fit',
        description:
          'Preview tabular columns and pick portrait or landscape orientation.',
      },
      {
        title: 'Save the unwatermarked PDF',
        description:
          'Download a clean PDF rendering of your tabular cells without server uploads.',
      },
    ],
    faqs: [
      {
        question: 'Are complex Excel formulas, charts, and conditional formatting preserved?',
        answer:
          'No. Excel to PDF handles simple spreadsheets only—complex formatting, formulas, macros, and charts are not preserved.',
      },
      {
        question: 'What is the maximum file size for Excel to PDF?',
        answer:
          'Excel to PDF supports workbooks up to 25 MB directly in your browser.',
      },
      {
        question: 'Does Excel to PDF add any watermark?',
        answer:
          'No. All Converter Tools output completely clean, unwatermarked files.',
      },
      {
        question: 'Do I need Microsoft Excel installed?',
        answer:
          'No. Everything parses and converts client-side inside your browser tab.',
      },
    ],
    relatedTools: ['pdf-to-excel', 'excel-to-csv', 'csv-to-excel', 'split-excel'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'csv-to-excel',
    name: 'CSV to Excel',
    slug: 'csv-to-excel',
    category: 'converter-tools',
    url: '/csv-to-excel',
    description: 'Convert comma-separated CSV data into clean XLSX Excel workbooks in seconds.',
    longDescription:
      'Open raw exports cleanly in Excel without broken delimiters or scrambled UTF-8 characters. CSV to Excel parses CSV files or pasted CSV text up to 10 MB locally in your browser and generates standard .xlsx spreadsheets with zero uploads or watermarks.',
    keywords: [
      'csv to excel',
      'csv to xlsx',
      'convert csv excel',
      'comma separated to xlsx',
    ],
    icon: 'Table',
    acceptedFormats: ['CSV'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `CSV to Excel — Convert CSV to XLSX | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'CSV to Excel transforms CSV files up to 10 MB into clean XLSX workbooks locally in your browser with no server uploads.',
    howTo: [
      {
        title: 'Choose or paste CSV data',
        description:
          'Select a CSV file up to 10 MB, paste CSV text, or load the built-in sample CSV directly in your browser.',
      },
      {
        title: 'Confirm delimiter & type inference',
        description:
          'Auto-detect commas, semicolons, or tabs, preview the parsed table, and optionally convert numbers and booleans.',
      },
      {
        title: 'Download the XLSX file',
        description:
          'Save your formatted Excel spreadsheet locally with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Are leading zeros and UTF-8 characters handled cleanly?',
        answer:
          'Yes. Browser-side delimiter and UTF-8 parsing avoids character corruption and preserves leading zeros in IDs and postal codes.',
      },
      {
        question: 'What file size limit applies to CSV to Excel?',
        answer:
          'CSV to Excel supports files up to 10 MB locally in your browser.',
      },
      {
        question: 'Are files sent to a server during conversion?',
        answer:
          'No. Conversion runs client-side in your browser so your tables remain private.',
      },
      {
        question: 'Can I convert back from Excel to CSV later?',
        answer:
          'Yes. Use our Excel to CSV tool whenever you need plain text CSV output.',
      },
    ],
    relatedTools: ['excel-to-csv', 'csv-to-json', 'csv-to-xml', 'split-csv'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'split-excel',
    name: 'Split Excel',
    slug: 'split-excel',
    category: 'converter-tools',
    url: '/split-excel',
    description:
      'Split large Excel workbooks into separate files by worksheet tab, row count, or column value.',
    longDescription:
      'Break apart multi-tab monthly reports or oversized data sheets into smaller, shareable XLSX files. Split Excel runs locally in your browser for workbooks up to 10 MB—splitting by worksheet tab, fixed row count, or unique values in any column.',
    keywords: [
      'split excel',
      'split xlsx by sheet',
      'split spreadsheet rows',
      'separate excel tabs',
    ],
    icon: 'Split',
    acceptedFormats: ['XLSX', 'XLS'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Split Excel — By Sheet, Row Count, or Column | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Split Excel divides XLSX and XLS workbooks up to 10 MB into separate files by sheet, row count, or column value locally in your browser.',
    howTo: [
      {
        title: 'Load your Excel workbook',
        description:
          'Open an .xlsx or .xls workbook up to 10 MB, or try the 2-sheet sample workbook in your browser.',
      },
      {
        title: 'Choose how to split',
        description:
          'Export one workbook per worksheet tab, chunk rows every N rows, or group rows by a chosen column value.',
      },
      {
        title: 'Download split workbooks',
        description:
          'Save each resulting .xlsx file individually or download all parts together in a single ZIP archive.',
      },
    ],
    faqs: [
      {
        question: 'How can I split an Excel workbook?',
        answer:
          'You can split by worksheet tab (one output workbook per tab), by row count, or by unique values in any column.',
      },
      {
        question: 'Are header rows kept when splitting by row count or column?',
        answer:
          'Yes. You can keep the top header row at the top of every generated XLSX file.',
      },
      {
        question: 'What is the maximum file size for Split Excel?',
        answer:
          'Split Excel supports workbooks up to 10 MB locally in your browser.',
      },
      {
        question: 'Need to split plain CSV files instead?',
        answer:
          'Use Split CSV to break large comma-separated files into smaller chunks by row count.',
      },
    ],
    relatedTools: ['split-csv', 'excel-to-csv', 'excel-to-pdf', 'csv-to-excel'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'xml-to-excel',
    name: 'XML to Excel',
    slug: 'xml-to-excel',
    category: 'converter-tools',
    url: '/xml-to-excel',
    description: 'Flatten repeating XML records into clean rows and columns inside an XLSX file.',
    longDescription:
      'Turn structured XML feeds, invoices, and catalog exports into readable spreadsheets without writing XSLT scripts. XML to Excel parses XML files or pasted XML up to 10 MB locally in your browser and maps repeating elements and attributes into clean XLSX columns.',
    keywords: [
      'xml to excel',
      'xml to xlsx',
      'convert xml spreadsheet',
      'parse xml to table',
    ],
    icon: 'FileSpreadsheet',
    acceptedFormats: ['XML'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `XML to Excel — Convert XML to XLSX | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'XML to Excel turns XML feeds up to 10 MB into clean XLSX spreadsheet tables locally in your browser with no server uploads.',
    howTo: [
      {
        title: 'Open or paste your XML data',
        description:
          'Choose an XML file up to 10 MB, paste XML markup, or click Try sample file inside your browser.',
      },
      {
        title: 'Review flattened columns',
        description:
          'Repeating XML nodes and attributes are mapped automatically to tabular headers and cell rows.',
      },
      {
        title: 'Export to XLSX',
        description:
          'Download the structured Excel workbook directly from your browser.',
      },
    ],
    faqs: [
      {
        question: 'How does XML to Excel handle nested elements?',
        answer:
          'Repeating record tags are mapped to rows while child fields and attributes flatten cleanly into named columns.',
      },
      {
        question: 'What file size limit applies to XML to Excel?',
        answer:
          'XML to Excel supports XML files up to 10 MB per conversion.',
      },
      {
        question: 'Is my XML data uploaded anywhere?',
        answer:
          'No. Parsing happens entirely in your browser tab with no external server transmission.',
      },
      {
        question: 'Can I convert Excel back to XML?',
        answer:
          'Yes. Use our Excel to XML converter to export tabular sheets as XML nodes.',
      },
    ],
    relatedTools: ['excel-to-xml', 'xml-to-csv', 'xml-to-json', 'csv-to-excel'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'split-csv',
    name: 'Split CSV',
    slug: 'split-csv',
    category: 'converter-tools',
    url: '/split-csv',
    description:
      'Divide large CSV spreadsheets into smaller chunk files by exact row count.',
    longDescription:
      'Hit an import row limit on your CRM or email platform? Split CSV slices CSV files or pasted CSV data up to 10 MB locally in your browser by your chosen row count per file—with optional header repetition and one-click ZIP download.',
    keywords: [
      'split csv',
      'split csv by rows',
      'chunk csv file',
      'divide large csv',
    ],
    icon: 'Scissors',
    acceptedFormats: ['CSV'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Split CSV — Break CSV by Row Count | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Split CSV divides CSV files up to 10 MB into smaller chunks by row count in your browser while preserving headers.',
    howTo: [
      {
        title: 'Load your CSV data',
        description:
          'Select a CSV file up to 10 MB, paste CSV text, or load the sample CSV in your browser.',
      },
      {
        title: 'Set rows per output file',
        description:
          'Specify the maximum row count per chunk and toggle repeating column headers.',
      },
      {
        title: 'Save split CSV chunks',
        description:
          'Download each chunk individually or grab all CSV parts in one ZIP archive.',
      },
    ],
    faqs: [
      {
        question: 'Do column headers appear in each split CSV file?',
        answer:
          'Yes. Keep the header row enabled and it is included at the top of every chunked file automatically.',
      },
      {
        question: 'Do quoted commas inside text cells break rows?',
        answer:
          'No. RFC-compliant CSV parsing splits only on true row boundaries, never inside quoted values.',
      },
      {
        question: 'What is the file size limit for Split CSV?',
        answer:
          'Split CSV handles CSV files up to 10 MB locally in your browser.',
      },
      {
        question: 'How do I split an Excel workbook instead?',
        answer:
          'Use Split Excel to split XLSX workbooks by worksheet tab, row count, or column value.',
      },
    ],
    relatedTools: ['split-excel', 'csv-to-excel', 'csv-to-json', 'excel-to-csv'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    slug: 'json-to-xml',
    category: 'converter-tools',
    url: '/json-to-xml',
    description: 'Transform JSON objects and arrays into clean, well-formed XML documents.',
    longDescription:
      'Bridge modern REST JSON payloads with legacy SOAP, enterprise ERP, or XML config schemas. JSON to XML validates JSON files or pasted JSON up to 10 MB locally in your browser and outputs indented, escaped XML with customizable root and item tags.',
    keywords: [
      'json to xml',
      'convert json xml',
      'json array to xml',
      'format json as xml',
    ],
    icon: 'FileCode2',
    acceptedFormats: ['JSON'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `JSON to XML — Fast Browser Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'JSON to XML converts JSON objects and arrays up to 10 MB into valid indented XML documents locally in your browser.',
    howTo: [
      {
        title: 'Select or paste JSON',
        description:
          'Open a valid JSON file up to 10 MB, paste raw JSON, or click Try sample file inside your browser.',
      },
      {
        title: 'Set root & array tag names',
        description:
          'Customize the wrapper root tag name, array item tag, and pretty-print indentation.',
      },
      {
        title: 'Save clean XML output',
        description:
          'Download a valid UTF-8 XML document locally without server uploads.',
      },
    ],
    faqs: [
      {
        question: 'Does JSON to XML escape special XML characters?',
        answer:
          'Yes. Ampersands, angle brackets, and quotes inside strings are escaped so the resulting XML stays well-formed.',
      },
      {
        question: 'How are JSON arrays converted into XML?',
        answer:
          'Array items are serialized cleanly as repeating element tags under their parent key or configurable item name.',
      },
      {
        question: 'What is the maximum file size supported?',
        answer:
          'JSON to XML supports JSON files up to 10 MB locally in your browser.',
      },
      {
        question: 'Can I convert XML back into JSON?',
        answer:
          'Yes. Use XML to JSON to turn XML feeds back into clean JSON objects.',
      },
    ],
    relatedTools: ['xml-to-json', 'csv-to-json', 'csv-to-xml', 'xml-to-csv'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'excel-to-csv',
    name: 'Excel to CSV',
    slug: 'excel-to-csv',
    category: 'converter-tools',
    url: '/excel-to-csv',
    description: 'Export Excel worksheets (.xlsx, .xls) as universal UTF-8 CSV files.',
    longDescription:
      'Prepare spreadsheet data for database imports, scripts, and analytics pipelines. Excel to CSV reads workbooks up to 10 MB directly in your browser, lets you pick any worksheet tab and delimiter, and downloads clean UTF-8 CSV files with zero watermarks.',
    keywords: [
      'excel to csv',
      'xlsx to csv',
      'xls to csv',
      'export worksheet csv',
    ],
    icon: 'FileText',
    acceptedFormats: ['XLSX', 'XLS'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Excel to CSV — Export XLSX to CSV | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Excel to CSV converts XLSX and XLS spreadsheets up to 10 MB into clean UTF-8 CSV files locally in your browser.',
    howTo: [
      {
        title: 'Choose an Excel spreadsheet',
        description:
          'Open an .xlsx or .xls workbook up to 10 MB or load the sample 2-sheet workbook.',
      },
      {
        title: 'Select worksheet & delimiter',
        description:
          'Pick the worksheet tab to export and choose comma, semicolon, or tab separation.',
      },
      {
        title: 'Save the UTF-8 CSV',
        description:
          'Download a clean CSV table ready for imports without server uploads.',
      },
    ],
    faqs: [
      {
        question: 'Can I select which Excel tab gets exported to CSV?',
        answer:
          'Yes. When your workbook has multiple worksheets, pick any tab from the worksheet dropdown.',
      },
      {
        question: 'Are formulas exported as calculated values or formula strings?',
        answer:
          'Standard cached cell values are exported so CSV consumers read clean numbers and text.',
      },
      {
        question: 'What file size limit applies to Excel to CSV?',
        answer:
          'Excel to CSV supports Excel workbooks up to 10 MB per conversion.',
      },
      {
        question: 'What if I want PDF output instead of CSV?',
        answer:
          'Use Excel to PDF for simple tabular PDF exports up to 25 MB.',
      },
    ],
    relatedTools: ['csv-to-excel', 'excel-to-pdf', 'excel-to-xml', 'split-excel'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'xml-to-csv',
    name: 'XML to CSV',
    slug: 'xml-to-csv',
    category: 'converter-tools',
    url: '/xml-to-csv',
    description: 'Extract structured XML data nodes into clean comma-separated CSV tables.',
    longDescription:
      'Inspect XML API responses, sitemaps, or product catalogs in spreadsheet apps effortlessly. XML to CSV parses XML files or pasted XML up to 10 MB locally in your browser and exports flattened tabular columns and attributes as UTF-8 CSV.',
    keywords: [
      'xml to csv',
      'convert xml csv',
      'export xml table',
      'xml feed to csv',
    ],
    icon: 'Table',
    acceptedFormats: ['XML'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `XML to CSV — Parse XML Feeds to CSV | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'XML to CSV converts XML feeds up to 10 MB into clean comma-separated CSV tables locally in your browser.',
    howTo: [
      {
        title: 'Open or paste XML',
        description:
          'Load an XML feed up to 10 MB, paste raw XML, or try the sample XML inside your browser tab.',
      },
      {
        title: 'Inspect flattened headers',
        description:
          'Review detected row nodes, nested tags, and attribute columns in the live preview.',
      },
      {
        title: 'Download the CSV table',
        description:
          'Save a clean UTF-8 CSV file ready for Excel, Google Sheets, or SQL imports.',
      },
    ],
    faqs: [
      {
        question: 'How does XML to CSV treat attributes on XML tags?',
        answer:
          'Element attributes and child text values are flattened into distinct columns so no metadata is lost.',
      },
      {
        question: 'What file size limit applies to XML to CSV?',
        answer:
          'XML to CSV supports files up to 10 MB directly inside your browser.',
      },
      {
        question: 'Does my XML file leave my device?',
        answer:
          'No. Conversion runs client-side in your browser with zero remote uploads.',
      },
      {
        question: 'Can I export directly to XLSX instead?',
        answer:
          'Yes. Use XML to Excel when you want native .xlsx workbook output.',
      },
    ],
    relatedTools: ['csv-to-xml', 'xml-to-excel', 'xml-to-json', 'csv-to-excel'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    slug: 'csv-to-json',
    category: 'converter-tools',
    url: '/csv-to-json',
    description: 'Convert CSV spreadsheet tables into structured JSON arrays of objects.',
    longDescription:
      'Seed developer databases, static site data, and web apps from CSV exports without writing custom scripts. CSV to JSON parses CSV files or pasted CSV text up to 10 MB in your browser, maps headers to JSON keys, and outputs pretty or minified JSON.',
    keywords: [
      'csv to json',
      'convert csv json',
      'csv array to json',
      'spreadsheet to json',
    ],
    icon: 'Braces',
    acceptedFormats: ['CSV'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `CSV to JSON — Structured JSON Output | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'CSV to JSON converts CSV rows up to 10 MB into clean JSON arrays of objects locally in your browser. Zero uploads.',
    howTo: [
      {
        title: 'Pick or paste CSV data',
        description:
          'Open a CSV dataset up to 10 MB, paste CSV rows, or load the sample file in your browser.',
      },
      {
        title: 'Choose formatting options',
        description:
          'Auto-detect delimiters, infer numbers/booleans, and toggle pretty-printed or compact JSON.',
      },
      {
        title: 'Save or copy clean JSON',
        description:
          'Download the resulting .json file locally or copy the JSON preview with one click.',
      },
    ],
    faqs: [
      {
        question: 'How does CSV to JSON structure output objects?',
        answer:
          'Column headers become JSON property names and each subsequent row becomes an object inside a JSON array.',
      },
      {
        question: 'Can numeric columns be converted to JSON numbers?',
        answer:
          'Yes. Optional type inference converts numbers and booleans cleanly instead of quoting every value.',
      },
      {
        question: 'What is the file size limit for CSV to JSON?',
        answer:
          'CSV to JSON supports CSV files up to 10 MB locally in your browser.',
      },
      {
        question: 'Does this tool send my CSV data online?',
        answer:
          'No. All parsing and JSON serialization happens inside your browser tab.',
      },
    ],
    relatedTools: ['csv-to-excel', 'csv-to-xml', 'xml-to-json', 'json-to-xml'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'excel-to-xml',
    name: 'Excel to XML',
    slug: 'excel-to-xml',
    category: 'converter-tools',
    url: '/excel-to-xml',
    description: 'Convert Excel worksheet rows into structured, well-formed XML documents.',
    longDescription:
      'Transform tabular spreadsheets into XML records ready for ERP integrations, feeds, or legacy importers. Excel to XML reads XLSX and XLS workbooks up to 10 MB directly in your browser and serializes each row cleanly as escaped XML elements.',
    keywords: [
      'excel to xml',
      'xlsx to xml',
      'spreadsheet to xml',
      'convert excel xml',
    ],
    icon: 'FileCode2',
    acceptedFormats: ['XLSX', 'XLS'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Excel to XML — XLSX to XML Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Excel to XML converts XLSX and XLS spreadsheets up to 10 MB into clean XML files locally in your browser.',
    howTo: [
      {
        title: 'Open your Excel workbook',
        description:
          'Choose an .xlsx or .xls spreadsheet up to 10 MB or try the sample multi-sheet workbook.',
      },
      {
        title: 'Choose sheet & tag names',
        description:
          'Select the worksheet tab to convert and customize root and row XML element names.',
      },
      {
        title: 'Download structured XML',
        description:
          'Save a valid, properly escaped UTF-8 XML document locally.',
      },
    ],
    faqs: [
      {
        question: 'How are Excel column headers turned into XML tags?',
        answer:
          'Column headers are sanitized into valid XML element names for each row node.',
      },
      {
        question: 'What if cell values contain ampersands or angle brackets?',
        answer:
          'All text content is automatically escaped so the output XML remains valid.',
      },
      {
        question: 'What is the maximum Excel file size?',
        answer:
          'Excel to XML supports workbooks up to 10 MB locally in your browser.',
      },
      {
        question: 'Can I convert XML back into Excel?',
        answer:
          'Yes. Use XML to Excel to turn XML documents back into XLSX spreadsheets.',
      },
    ],
    relatedTools: ['xml-to-excel', 'excel-to-csv', 'csv-to-xml', 'json-to-xml'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON',
    slug: 'xml-to-json',
    category: 'converter-tools',
    url: '/xml-to-json',
    description: 'Convert nested XML files and attributes into clean, readable JSON objects.',
    longDescription:
      'Consume legacy XML payloads in modern JavaScript apps and APIs effortlessly. XML to JSON parses XML files or pasted XML up to 10 MB locally in your browser, preserves nested hierarchy, attributes, and repeated sibling arrays, and outputs formatted or compact JSON.',
    keywords: [
      'xml to json',
      'convert xml json',
      'parse xml to json',
      'xml feed to json',
    ],
    icon: 'FileJson',
    acceptedFormats: ['XML'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `XML to JSON — Browser XML Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'XML to JSON parses XML documents up to 10 MB into clean JSON objects locally in your browser with zero uploads.',
    howTo: [
      {
        title: 'Select or paste XML',
        description:
          'Choose an XML file up to 10 MB, paste XML markup, or load the sample XML in your browser.',
      },
      {
        title: 'Configure attribute & indent options',
        description:
          'Choose how XML tag attributes map into JSON keys and pick pretty or compact formatting.',
      },
      {
        title: 'Download clean JSON',
        description:
          'Save the structured JSON output directly from your browser tab.',
      },
    ],
    faqs: [
      {
        question: 'How does XML to JSON represent XML attributes?',
        answer:
          'Attributes can use the @ prefix, _ prefix, or bare names so nested elements and attributes stay cleanly organized.',
      },
      {
        question: 'Are repeated sibling XML tags converted into JSON arrays?',
        answer:
          'Yes. Repeated tags at the same level serialize cleanly as JSON arrays.',
      },
      {
        question: 'What is the maximum XML file size?',
        answer:
          'XML to JSON supports XML files up to 10 MB locally in your browser.',
      },
      {
        question: 'Need the reverse conversion from JSON to XML?',
        answer:
          'Use JSON to XML to transform JSON payloads back into well-formed XML.',
      },
    ],
    relatedTools: ['json-to-xml', 'xml-to-csv', 'xml-to-excel', 'csv-to-json'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'csv-to-xml',
    name: 'CSV to XML',
    slug: 'csv-to-xml',
    category: 'converter-tools',
    url: '/csv-to-xml',
    description: 'Convert CSV spreadsheet tables into valid, neatly indented XML records.',
    longDescription:
      'Turn comma-separated tables into valid XML feeds for legacy connectors, catalogs, and data imports. CSV to XML parses CSV files or pasted CSV text up to 10 MB directly in your browser and emits escaped, readable XML records.',
    keywords: [
      'csv to xml',
      'convert csv xml',
      'csv records to xml',
      'table to xml',
    ],
    icon: 'FileCode2',
    acceptedFormats: ['CSV'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `CSV to XML — Convert CSV to XML | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'CSV to XML transforms CSV tables up to 10 MB into valid, formatted XML documents directly in your browser.',
    howTo: [
      {
        title: 'Open or paste CSV data',
        description:
          'Choose a CSV file up to 10 MB, paste CSV rows, or load the sample CSV inside your browser.',
      },
      {
        title: 'Customize root and row tags',
        description:
          'Confirm delimiter detection and name the wrapper root and record element tags.',
      },
      {
        title: 'Save valid XML output',
        description:
          'Download a clean, properly escaped UTF-8 XML document locally.',
      },
    ],
    faqs: [
      {
        question: 'How are CSV column headers handled when building XML tags?',
        answer:
          'Column headers are normalized into valid XML element names for every generated record.',
      },
      {
        question: 'Are special characters in CSV cells escaped?',
        answer:
          'Yes. Ampersands, quotes, and brackets are escaped automatically for valid XML syntax.',
      },
      {
        question: 'What is the maximum file size for CSV to XML?',
        answer:
          'CSV to XML supports CSV files up to 10 MB locally in your browser.',
      },
      {
        question: 'Does CSV to XML upload data to external servers?',
        answer:
          'No. Everything runs locally inside your browser tab with no remote uploads.',
      },
    ],
    relatedTools: ['xml-to-csv', 'csv-to-json', 'csv-to-excel', 'excel-to-xml'],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },

  // ========================
  // YOUTUBE TOOLS (40)
  // ========================
  {
    id: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    slug: 'youtube-thumbnail-downloader',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-downloader',
    description: 'Fetch and save public YouTube video thumbnails in standard and widescreen resolutions.',
    longDescription:
      'Need to preview or save a public video thumbnail from a YouTube link for reference or design inspiration? When launched, YouTube Thumbnail Downloader will extract video thumbnail image URLs directly in your browser across SD, HQ, and MQ resolutions with zero watermarks.',
    keywords: [
      'youtube thumbnail downloader',
      'download yt thumbnail',
      'save youtube cover image',
      'youtube thumb url',
    ],
    icon: 'Download',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Downloader | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Downloader previews and saves public video thumbnail sizes cleanly in your browser with no watermark.',
    howTo: [
      {
        title: 'Paste a YouTube video link',
        description:
          'Once active, paste any standard watch, youtu.be, or Shorts link inside your browser.',
      },
      {
        title: 'Preview available resolutions',
        description:
          'Inspect SD, MQ, HQ, and max-resolution thumbnail previews side by side.',
      },
      {
        title: 'Download the clean image',
        description:
          'Save the thumbnail image directly to your device with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Which YouTube link formats work with the downloader?',
        answer:
          'Standard youtube.com/watch links, shortened youtu.be URLs, Shorts links, and embed URLs are all supported.',
      },
      {
        question: 'Does YouTube Thumbnail Downloader add a watermark?',
        answer:
          'No. Downloaded thumbnail images are unwatermarked.',
      },
      {
        question: 'Where should I go for guaranteed 1280x720 HD thumbnails?',
        answer:
          'Try our dedicated YouTube HD Thumbnail Downloader for maxresdefault 1280x720 checks.',
      },
      {
        question: 'Is this utility free and browser-based?',
        answer:
          'Yes. URL parsing and thumbnail previews run locally in your browser.',
      },
    ],
    relatedTools: [
      'youtube-hd-thumbnail-downloader',
      'youtube-thumbnail-preview',
      'youtube-video-id-extractor',
      'youtube-thumbnail-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'youtube-hd-thumbnail-downloader',
    name: 'YouTube HD Thumbnail Downloader',
    slug: 'youtube-hd-thumbnail-downloader',
    category: 'youtube-tools',
    url: '/youtube-hd-thumbnail-downloader',
    description: 'Check and download crisp 1280x720 HD max-res thumbnails from public YouTube links.',
    longDescription:
      'When you need the highest available 1280x720 HD thumbnail frame for editorial coverage or channel audits, YouTube HD Thumbnail Downloader resolves the video ID locally in your browser and checks maxresdefault and sddefault availability cleanly with zero watermarks.',
    keywords: [
      'youtube hd thumbnail downloader',
      '1280x720 youtube thumbnail',
      'maxresdefault downloader',
      'hd yt thumbnail',
    ],
    icon: 'Download',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube HD Thumbnail Downloader | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube HD Thumbnail Downloader fetches 1280x720 maxresdefault thumbnails from public links directly in your browser.',
    howTo: [
      {
        title: 'Enter a YouTube link',
        description:
          'Once live, paste the video URL or 11-character ID into the input box.',
      },
      {
        title: 'Check 1280x720 HD availability',
        description:
          'The browser tool inspects maxresdefault and high-resolution fallback sizes.',
      },
      {
        title: 'Save your HD thumbnail',
        description:
          'Download the full-resolution JPG thumbnail without watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Why do some older videos lack a 1280x720 maxresdefault thumbnail?',
        answer:
          'Videos uploaded at low resolution or without a custom HD thumbnail fall back to 640x480 or 480x360.',
      },
      {
        question: 'Does this tool add any logo or watermark?',
        answer:
          'No. Outputs carry zero watermarks.',
      },
      {
        question: 'Can I extract colors or text from a saved thumbnail?',
        answer:
          'Yes. Pass it to YouTube Thumbnail Color Extractor or Text Extractor.',
      },
      {
        question: 'Does it work with YouTube Shorts URLs?',
        answer:
          'Yes. Standard, Shorts, and youtu.be URLs are parsed automatically.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-downloader',
      'youtube-thumbnail-size-checker',
      'youtube-thumbnail-color-extractor',
      'youtube-thumbnail-text-extractor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'youtube-video-id-extractor',
    name: 'YouTube Video ID Extractor',
    slug: 'youtube-video-id-extractor',
    category: 'youtube-tools',
    url: '/youtube-video-id-extractor',
    description: 'Extract the clean 11-character video ID from any watch, Shorts, embed, or share URL.',
    longDescription:
      'Working with CMS forms, playlists, or embed templates often requires only the 11-character video ID instead of the full URL. YouTube Video ID Extractor parses watch links, youtu.be short links, Shorts, and live URLs locally in your browser in one click.',
    keywords: [
      'youtube video id extractor',
      'get youtube id from url',
      'extract yt video id',
      '11 char youtube id',
    ],
    icon: 'Link2',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Video ID Extractor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Video ID Extractor isolates the 11-character video ID from watch, Shorts, and youtu.be URLs in your browser.',
    howTo: [
      {
        title: 'Paste any YouTube URL',
        description:
          'Paste any YouTube watch, Shorts, embed, or youtu.be link (or 11-character ID) directly in your browser.',
      },
      {
        title: 'Parse link pattern locally',
        description:
          'Watch parameters, share links, Shorts, and embed paths are stripped cleanly.',
      },
      {
        title: 'Copy the 11-character ID',
        description:
          'Grab the extracted video ID ready for embeds, databases, or tools.',
      },
    ],
    faqs: [
      {
        question: 'Which YouTube URL patterns are supported?',
        answer:
          'youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/, and m.youtube.com links are supported.',
      },
      {
        question: 'Does it ignore extra tracking or playlist query parameters?',
        answer:
          'Yes. Extra parameters such as si=, list=, and t= are ignored when isolating the 11-character ID.',
      },
      {
        question: 'Does it send URLs to a remote API?',
        answer:
          'No. Extraction runs purely client-side using JavaScript URL parsing.',
      },
      {
        question: 'Can I also see every parameter inside the link?',
        answer:
          'Yes. Use YouTube URL Parser to inspect timestamps, playlists, and query parameters.',
      },
    ],
    relatedTools: [
      'youtube-url-parser',
      'youtube-embed-code-generator',
      'youtube-timestamp-link-generator',
      'youtube-thumbnail-downloader',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-url-parser',
    name: 'YouTube URL Parser',
    slug: 'youtube-url-parser',
    category: 'youtube-tools',
    url: '/youtube-url-parser',
    description: 'Break down any YouTube link into video ID, playlist ID, timestamp, and clean URL.',
    longDescription:
      'Long YouTube links often carry tracking tokens (?si=), playlist indices, and start offsets. YouTube URL Parser dissects any YouTube link locally in your browser into structured fields—video ID, playlist ID, index, start time, and stripped canonical links.',
    keywords: [
      'youtube url parser',
      'clean youtube url',
      'strip youtube tracking si',
      'parse youtube link',
    ],
    icon: 'Code2',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube URL Parser — Clean & Inspect | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube URL Parser extracts video IDs, playlist IDs, timestamps, and clean share links locally in your browser.',
    howTo: [
      {
        title: 'Paste a full YouTube URL',
        description:
          'Drop any watch, playlist, or mobile share link into the parser.',
      },
      {
        title: 'Inspect parsed link fields',
        description:
          'View extracted video ID, playlist ID, index, timestamp seconds, and link type.',
      },
      {
        title: 'Copy clean canonical link',
        description:
          'Copy a stripped, tracking-free URL or normalized parameter set.',
      },
    ],
    faqs: [
      {
        question: 'Can YouTube URL Parser strip tracking parameters like ?si=?',
        answer:
          'Yes. It separates essential video and timestamp parameters from tracking query keys.',
      },
      {
        question: 'Does it extract playlist IDs too?',
        answer:
          'Yes. Whenever a list= parameter is present, both the playlist ID and index are displayed.',
      },
      {
        question: 'Are links processed privately in the browser?',
        answer:
          'Yes. URL parsing runs client-side with zero external requests.',
      },
      {
        question: 'Can I build a start-time link directly?',
        answer:
          'Use YouTube Timestamp Link Generator to attach exact start times.',
      },
    ],
    relatedTools: [
      'youtube-video-id-extractor',
      'youtube-timestamp-link-generator',
      'youtube-embed-code-generator',
      'youtube-handle-format-validator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-embed-code-generator',
    name: 'YouTube Embed Code Generator',
    slug: 'youtube-embed-code-generator',
    category: 'youtube-tools',
    url: '/youtube-embed-code-generator',
    description: 'Create responsive YouTube iframe embed HTML snippets from formula-based options.',
    longDescription:
      'Embed videos cleanly on blogs, landing pages, and docs without writing boilerplate CSS containers by hand. This tool is template/formula-based only (NOT AI-generated)—assembling standard responsive YouTube iframe HTML code locally in your browser with privacy-enhanced mode, start time, and control toggles.',
    keywords: [
      'youtube embed code generator',
      'responsive youtube iframe',
      'youtube html embed',
      'nocookie embed generator',
    ],
    icon: 'Code2',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Embed Code Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Embed Code Generator builds responsive iframe HTML snippets via templates in your browser (not AI). Free, no watermark.',
    howTo: [
      {
        title: 'Enter video URL & options',
        description:
          'Paste a YouTube link or 11-char ID and toggle responsive sizing, start/end times, or youtube-nocookie.',
      },
      {
        title: 'Assemble HTML template locally',
        description:
          'Deterministic HTML formulas format a clean iframe snippet in your browser (not AI).',
      },
      {
        title: 'Copy into your website',
        description:
          'Paste the responsive embed code into WordPress, Markdown, or HTML pages.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Embed Code Generator use AI?',
        answer:
          'No. It is 100% template- and formula-based, assembling standard YouTube iframe HTML attributes in your browser.',
      },
      {
        question: 'Does it support privacy-enhanced youtube-nocookie.com URLs?',
        answer:
          'Yes. Toggle privacy-enhanced youtube-nocookie.com mode with one click.',
      },
      {
        question: 'Can it generate 16:9 responsive CSS wrappers?',
        answer:
          'Yes. Aspect-ratio responsive container snippets are built in.',
      },
      {
        question: 'Can I set an exact start and end time?',
        answer:
          'Yes. Start and end second offsets map directly to iframe query parameters.',
      },
    ],
    relatedTools: [
      'youtube-timestamp-link-generator',
      'youtube-video-id-extractor',
      'youtube-url-parser',
      'youtube-video-aspect-ratio-checker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-timestamp-link-generator',
    name: 'YouTube Timestamp Link Generator',
    slug: 'youtube-timestamp-link-generator',
    category: 'youtube-tools',
    url: '/youtube-timestamp-link-generator',
    description: 'Build exact start-time (?t=) YouTube share links using a simple browser formula.',
    longDescription:
      'Share the exact moment a tutorial step or quote begins without manual second math. This tool is formula-based only (NOT AI)—converting hours, minutes, and seconds into clean ?t= query parameters on your YouTube URL locally in your browser.',
    keywords: [
      'youtube timestamp link generator',
      'youtube start time link',
      'youtube url t parameter',
      'share youtube at time',
    ],
    icon: 'Clock',
    acceptedFormats: ['URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Timestamp Link Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Timestamp Link Generator formats exact start-time ?t= links via formula in your browser (not AI). Free and instant.',
    howTo: [
      {
        title: 'Paste your YouTube link',
        description:
          'Enter any youtube.com, youtu.be link, or 11-character ID inside your browser.',
      },
      {
        title: 'Enter hours, minutes & seconds',
        description:
          'The browser formula calculates total seconds and formats a clean ?t= parameter.',
      },
      {
        title: 'Copy the timestamped link',
        description:
          'Share the exact-moment URL in newsletters, docs, or social posts.',
      },
    ],
    faqs: [
      {
        question: 'Is this tool AI-powered or formula-based?',
        answer:
          'It is strictly formula-based (NOT AI), converting your timestamp into exact YouTube ?t= URL parameters.',
      },
      {
        question: 'Does it work with youtu.be short links?',
        answer:
          'Yes. Both standard watch links and shortened youtu.be links are supported.',
      },
      {
        question: 'Need a full list of 00:00 description chapters instead?',
        answer:
          'Use YouTube Chapter Generator to format multi-section video chapter lists.',
      },
      {
        question: 'Is my link sent anywhere?',
        answer:
          'No. Everything computes locally inside your browser tab.',
      },
    ],
    relatedTools: [
      'youtube-chapter-generator',
      'youtube-embed-code-generator',
      'youtube-url-parser',
      'youtube-video-id-extractor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-preview',
    name: 'YouTube Thumbnail Preview Tool',
    slug: 'youtube-thumbnail-preview',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-preview',
    description: 'Preview how your thumbnail and title look across Home, Search, Suggested, and Mobile feeds.',
    longDescription:
      'Before publishing a video, check whether title truncation or the bottom-right duration badge covers key details in your artwork. YouTube Thumbnail Preview Tool lets you preview local thumbnail files up to 20 MB alongside your draft title in simulated desktop and mobile feed cards inside your browser.',
    keywords: [
      'youtube thumbnail preview',
      'thumbnail tester',
      'preview yt title and thumbnail',
      'youtube feed mockup',
    ],
    icon: 'Eye',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Preview Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Preview Tool lets you inspect local thumbnails and titles in desktop and mobile feed layouts locally.',
    howTo: [
      {
        title: 'Load your draft thumbnail & title',
        description:
          'Upload a JPG, PNG, or WebP thumbnail up to 20 MB (or enter a public YouTube link/ID) and type your draft title.',
      },
      {
        title: 'Switch feed & theme layouts',
        description:
          'Inspect simulated desktop and mobile feed cards in light or dark mode.',
      },
      {
        title: 'Refine clarity before upload',
        description:
          'Catch awkward duration-badge overlaps or clipped headlines early.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Thumbnail Preview Tool upload my unpublished thumbnail?',
        answer:
          'No. Local image files render strictly inside your browser tab without server uploads.',
      },
      {
        question: 'Can I preview dark mode as well as light mode?',
        answer:
          'Yes. Both light and dark card themes plus Desktop and Mobile feed toggles are built in.',
      },
      {
        question: 'What image formats and size limit apply?',
        answer:
          'Supports JPG, PNG, and WebP images up to 20 MB locally.',
      },
      {
        question: 'Can I check exact pixel dimensions and YouTube 2 MB file limits too?',
        answer:
          'Yes. Try YouTube Thumbnail Size Checker to validate 1280x720 dimensions and file weight.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-size-checker',
      'youtube-thumbnail-resizer',
      'youtube-title-character-counter',
      'youtube-thumbnail-compressor',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-size-checker',
    name: 'YouTube Thumbnail Size Checker',
    slug: 'youtube-thumbnail-size-checker',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-size-checker',
    description: 'Verify YouTube thumbnail resolution, 16:9 aspect ratio, and under-2 MB file size limits.',
    longDescription:
      'YouTube Studio rejects thumbnails over 2 MB or flags distorted aspect ratios. YouTube Thumbnail Size Checker inspects your JPG, PNG, or WebP file locally in your browser—checking width, height, 16:9 proportion, and byte size against YouTube guidelines.',
    keywords: [
      'youtube thumbnail size checker',
      'check 1280x720 thumbnail',
      'youtube 2mb thumbnail limit',
      'thumbnail dimension validator',
    ],
    icon: 'Ruler',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Size Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Size Checker validates 1280x720 resolution, 16:9 ratio, and YouTube 2 MB file size limits in your browser.',
    howTo: [
      {
        title: 'Choose your thumbnail file',
        description:
          'Pick a JPG, PNG, or WebP file up to 20 MB in your browser.',
      },
      {
        title: 'Read resolution & size checks',
        description:
          'Inspect pass/fail checks for 1280x720 recommended size, 16:9 ratio, and 2 MB Studio limit.',
      },
      {
        title: 'Fix sizing or compression if needed',
        description:
          'Jump straight to Thumbnail Resizer or Thumbnail Compressor when adjustments are required.',
      },
    ],
    faqs: [
      {
        question: 'What are YouTube’s official thumbnail size requirements?',
        answer:
          'YouTube recommends 1280x720 pixels (16:9 aspect ratio), minimum width of 640 pixels, and a maximum file size under 2 MB.',
      },
      {
        question: 'Can it check thumbnails larger than 2 MB to help diagnose upload errors?',
        answer:
          'Yes. It accepts images up to 20 MB locally so you can inspect oversized files and then compress them.',
      },
      {
        question: 'Are my images uploaded to check dimensions?',
        answer:
          'No. File metadata and pixel dimensions are read locally in your browser.',
      },
      {
        question: 'How do I resize an image to 1280x720?',
        answer:
          'Use YouTube Thumbnail Resizer right after checking.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-resizer',
      'youtube-thumbnail-compressor',
      'youtube-thumbnail-preview',
      'youtube-video-aspect-ratio-checker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-resizer',
    name: 'YouTube Thumbnail Resizer',
    slug: 'youtube-thumbnail-resizer',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-resizer',
    description: 'Resize and frame any photo to exact 1280x720 16:9 YouTube thumbnail dimensions.',
    longDescription:
      'Convert vertical screenshots or wide banners into crisp 1280x720 (or 1920x1080) 16:9 artwork ready for YouTube Studio. YouTube Thumbnail Resizer crops or fits images cleanly inside your browser up to 20 MB and exports unwatermarked JPG or PNG files.',
    keywords: [
      'youtube thumbnail resizer',
      'resize image to 1280x720',
      '16:9 thumbnail cropper',
      'yt thumbnail size converter',
    ],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Resizer — 1280x720 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Resizer crops and scales photos to 1280x720 16:9 dimensions locally in your browser with zero watermark.',
    howTo: [
      {
        title: 'Open your image file',
        description:
          'Load a JPG, PNG, or WebP photo up to 20 MB in your browser.',
      },
      {
        title: 'Choose 1280x720 crop or pad fit',
        description:
          'Center your 16:9 framing or pad edges cleanly to preserve the full photo.',
      },
      {
        title: 'Save unwatermarked thumbnail',
        description:
          'Download a crisp 1280x720 JPG or PNG ready for YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'Will resized thumbnails carry a watermark?',
        answer:
          'No. YouTube Thumbnail Resizer outputs completely unwatermarked images.',
      },
      {
        question: 'Can I choose 1280x720 or 1920x1080 presets?',
        answer:
          'Yes. 1280x720 is selected by default with optional 1920x1080 16:9 output.',
      },
      {
        question: 'What if my resized PNG ends up over 2 MB?',
        answer:
          'Pass it directly to YouTube Thumbnail Image Compressor to bring it safely under YouTube’s 2 MB cap.',
      },
      {
        question: 'Does resizing happen inside my browser?',
        answer:
          'Yes. HTML5 Canvas processes your image locally without remote uploads.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-compressor',
      'youtube-thumbnail-size-checker',
      'youtube-thumbnail-preview',
      'crop-image',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-compressor',
    name: 'YouTube Thumbnail Image Compressor',
    slug: 'youtube-thumbnail-compressor',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-compressor',
    description: 'Compress oversized thumbnails cleanly under YouTube’s 2 MB upload limit in your browser.',
    longDescription:
      'Exported a sharp Photoshop or Figma thumbnail at 4.5 MB that YouTube Studio rejects? YouTube Thumbnail Image Compressor compresses JPG, PNG, and WebP thumbnails up to 20 MB locally in your browser to target safely under 2 MB with zero watermarks.',
    keywords: [
      'youtube thumbnail compressor',
      'compress thumbnail under 2mb',
      'reduce yt thumbnail size',
      'thumbnail image optimizer',
    ],
    icon: 'Minimize',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Image Compressor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Image Compressor shrinks thumbnails under the 2 MB YouTube limit locally in your browser with no watermark.',
    howTo: [
      {
        title: 'Choose your oversized thumbnail',
        description:
          'Load a JPG, PNG, or WebP thumbnail up to 20 MB inside your browser.',
      },
      {
        title: 'Target under 2 MB quality',
        description:
          'Preview compressed file size against YouTube’s 2 MB ceiling before saving.',
      },
      {
        title: 'Save clean, unwatermarked artwork',
        description:
          'Download a crisp thumbnail under 2 MB ready for immediate upload.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Thumbnail Image Compressor add any watermark?',
        answer:
          'No. Output thumbnails are completely free of watermarks.',
      },
      {
        question: 'Why does YouTube cap thumbnails at 2 MB?',
        answer:
          'YouTube enforces a 2 MB maximum upload limit per custom video thumbnail.',
      },
      {
        question: 'Will it run locally without uploading my design?',
        answer:
          'Yes. Compression runs client-side inside your browser tab.',
      },
      {
        question: 'What formats are accepted?',
        answer:
          'Accepts JPG, PNG, and WebP images up to 20 MB.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-size-checker',
      'youtube-thumbnail-resizer',
      'youtube-thumbnail-preview',
      'compress-image',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-color-extractor',
    name: 'YouTube Thumbnail Color Extractor',
    slug: 'youtube-thumbnail-color-extractor',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-color-extractor',
    description: 'Sample dominant color palettes and HEX/RGB codes from any thumbnail image in your browser.',
    longDescription:
      'Maintain consistent channel branding across thumbnails and banners. YouTube Thumbnail Color Extractor inspects local thumbnail files up to 20 MB inside your browser and outputs dominant colors with copyable HEX, RGB, and contrast values.',
    keywords: [
      'youtube thumbnail color extractor',
      'thumbnail color palette',
      'extract hex from thumbnail',
      'yt thumbnail colors',
    ],
    icon: 'Palette',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Color Extractor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Color Extractor finds dominant HEX and RGB color palettes from thumbnail images locally in your browser.',
    howTo: [
      {
        title: 'Select a thumbnail image',
        description:
          'Load any JPG, PNG, or WebP thumbnail up to 20 MB in your browser.',
      },
      {
        title: 'Sample dominant color swatches',
        description:
          'Client-side pixel quantization identifies top background and accent tones.',
      },
      {
        title: 'Copy HEX or RGB values',
        description:
          'Click any swatch to copy color codes for Figma, Canva, or Photoshop.',
      },
    ],
    faqs: [
      {
        question: 'Which color code formats are shown?',
        answer:
          'Each extracted swatch shows HEX and RGB values ready for one-click copying.',
      },
      {
        question: 'Does color extraction upload images to a server?',
        answer:
          'No. Canvas pixel sampling happens directly inside your browser.',
      },
      {
        question: 'How can I also read text written on a thumbnail?',
        answer:
          'YouTube Thumbnail Text Extractor is currently in development and coming soon.',
      },
      {
        question: 'What is the maximum image file size?',
        answer:
          'Supports JPG, PNG, and WebP files up to 20 MB.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-text-extractor',
      'youtube-thumbnail-preview',
      'youtube-hd-thumbnail-downloader',
      'youtube-thumbnail-downloader',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-thumbnail-text-extractor',
    name: 'YouTube Thumbnail Text Extractor',
    slug: 'youtube-thumbnail-text-extractor',
    category: 'youtube-tools',
    url: '/youtube-thumbnail-text-extractor',
    description: 'Extract text headlines from thumbnail images (Coming Soon).',
    longDescription:
      'Pull headline copy, quotes, or timestamps directly out of thumbnail graphics for accessibility notes or research. In-browser optical character recognition is not yet supported in this build, so this tool is currently coming soon.',
    keywords: [
      'youtube thumbnail text extractor',
      'thumbnail text extractor',
      'extract text from thumbnail',
      'youtube thumbnail text',
    ],
    icon: 'ScanText',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `YouTube Thumbnail Text Extractor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Thumbnail Text Extractor is coming soon for reading text from thumbnails locally.',
    howTo: [
      {
        title: 'Open a thumbnail image',
        description:
          'Once active, choose a JPG, PNG, or WebP thumbnail up to 20 MB inside your browser.',
      },
      {
        title: 'Optical text scan',
        description:
          'Once available, optical character recognition will scan headline text locally on your device.',
      },
      {
        title: 'Copy recognized text',
        description:
          'Copy the extracted text cleanly for captions, notes, or translation.',
      },
    ],
    faqs: [
      {
        question: 'Is YouTube Thumbnail Text Extractor available yet?',
        answer:
          'No, this tool is currently coming soon. Reliable in-browser optical character recognition is not yet supported.',
      },
      {
        question: 'How accurate is OCR on bold stylized thumbnail fonts?',
        answer:
          'High-contrast clean typography extracts accurately, while heavily skewed, shadowed, or 3D fonts may require light manual cleanup.',
      },
      {
        question: 'What image formats and file limit are supported?',
        answer:
          'Supports JPG, PNG, and WebP images up to 20 MB.',
      },
      {
        question: 'Does extracting text add any watermark or cost?',
        answer:
          'No. It is completely free with no watermarks.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-color-extractor',
      'youtube-hd-thumbnail-downloader',
      'youtube-title-character-counter',
      'youtube-thumbnail-preview',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'coming-soon',
  },
  {
    id: 'youtube-title-character-counter',
    name: 'YouTube Title Character Counter',
    slug: 'youtube-title-character-counter',
    category: 'youtube-tools',
    url: '/youtube-title-character-counter',
    description: 'Count characters against YouTube’s 100-char limit and check mobile truncation cutoff.',
    longDescription:
      'Avoid having the hook of your video title cut off with "..." on mobile feeds. YouTube Title Character Counter checks your draft title locally in your browser against YouTube’s 100-character maximum and ~60–70 character visible preview sweet spot.',
    keywords: [
      'youtube title character counter',
      'youtube title length checker',
      'yt 100 char limit',
      'title truncation checker',
    ],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Title Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Title Character Counter checks the 100-character limit and ~65-character feed cutoff locally in your browser.',
    howTo: [
      {
        title: 'Type or paste your draft title',
        description:
          'Enter your headline directly in the browser—no upload needed.',
      },
      {
        title: 'Check limit & truncation markers',
        description:
          'Track total count against 100 chars and see where mobile and desktop cards truncate.',
      },
      {
        title: 'Copy your polished title',
        description:
          'Keep key words before the cutoff and copy into YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'What is the maximum character limit for a YouTube video title?',
        answer:
          'YouTube allows up to 100 characters, though desktop and mobile feeds typically truncate around 60–70 characters.',
      },
      {
        question: 'Does this tool store or upload my draft titles?',
        answer:
          'No. Counting runs instantly inside your browser tab.',
      },
      {
        question: 'Can I preview the title paired with my thumbnail?',
        answer:
          'Yes. Use YouTube Thumbnail Preview Tool to see them together.',
      },
      {
        question: 'Is this tool formula-based and free?',
        answer:
          'Yes. Exact character counting runs in real time for free.',
      },
    ],
    relatedTools: [
      'youtube-description-character-counter',
      'youtube-tags-character-counter',
      'youtube-title-generator',
      'youtube-thumbnail-preview',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-description-character-counter',
    name: 'YouTube Description Character Counter',
    slug: 'youtube-description-character-counter',
    category: 'youtube-tools',
    url: '/youtube-description-character-counter',
    description: 'Check YouTube description length against the 5,000-character cap and above-the-fold preview.',
    longDescription:
      'Track total character count against YouTube’s 5,000-character description ceiling while keeping your main hook and link inside the first ~150 visible characters before "Show more". Runs cleanly in your browser.',
    keywords: [
      'youtube description character counter',
      'youtube 5000 character limit',
      'yt description length checker',
      'above the fold youtube description',
    ],
    icon: 'AlignLeft',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Description Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Description Character Counter validates the 5,000-character cap and 150-char fold snippet locally in your browser.',
    howTo: [
      {
        title: 'Paste your video description',
        description:
          'Type or paste your description text, chapters, and links in the browser.',
      },
      {
        title: 'Monitor 5,000-char & fold limits',
        description:
          'See exact remaining characters and highlight the first ~150 visible fold characters.',
      },
      {
        title: 'Copy formatted description',
        description:
          'Transfer the verified text straight into YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'What is YouTube’s maximum description character limit?',
        answer:
          'YouTube allows up to 5,000 characters in a video description, including links, chapters, and hashtags.',
      },
      {
        question: 'How many characters appear before "Show more"?',
        answer:
          'Roughly the first 100–150 characters are visible above the fold before viewers click "Show more".',
      },
      {
        question: 'Does this counter count hashtags too?',
        answer:
          'Yes, all characters count toward 5,000; use YouTube Hashtag Counter to verify the 15-tag policy.',
      },
      {
        question: 'Is my draft description uploaded anywhere?',
        answer:
          'No. Counting runs purely client-side inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-title-character-counter',
      'youtube-tags-character-counter',
      'youtube-hashtag-counter',
      'youtube-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-tags-character-counter',
    name: 'YouTube Tags Character Counter',
    slug: 'youtube-tags-character-counter',
    category: 'youtube-tools',
    url: '/youtube-tags-character-counter',
    description: 'Count comma-separated YouTube video tags against YouTube’s strict 500-character limit.',
    longDescription:
      'YouTube silently blocks saving tags once your combined tag string passes 500 characters (counting commas and multi-word quotes). YouTube Tags Character Counter calculates your exact YouTube Studio tag character budget locally in your browser.',
    keywords: [
      'youtube tags character counter',
      'youtube 500 character tag limit',
      'check yt tag length',
      'youtube tag counter',
    ],
    icon: 'Tag',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Tags Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Tags Character Counter tracks comma-separated tag lists against YouTube’s 500-character Studio cap in your browser.',
    howTo: [
      {
        title: 'Paste comma-separated tags',
        description:
          'Paste or type your video tags directly inside your browser.',
      },
      {
        title: 'Check 500-char budget',
        description:
          'Inspect total tag count, remaining character room, and any oversized multi-word tags.',
      },
      {
        title: 'Copy clean tag list',
        description:
          'Trim excess tags cleanly and copy into YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'What is the maximum character limit for YouTube tags?',
        answer:
          'YouTube enforces a strict 500-character total cap across all tags on a video.',
      },
      {
        question: 'Why does YouTube Studio sometimes count more characters than plain letters?',
        answer:
          'Commas, spaces, and implicit quote wrapping around multi-word tags count toward the 500-character budget.',
      },
      {
        question: 'Can I generate template tags to fill the budget?',
        answer:
          'Yes. Pair this with YouTube Tag Generator (template/keyword-based, not AI).',
      },
      {
        question: 'Does this run completely in the browser?',
        answer:
          'Yes. No files or text are sent off your device.',
      },
    ],
    relatedTools: [
      'youtube-tag-generator',
      'youtube-hashtag-counter',
      'youtube-description-character-counter',
      'youtube-title-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-hashtag-counter',
    name: 'YouTube Hashtag Counter',
    slug: 'youtube-hashtag-counter',
    category: 'youtube-tools',
    url: '/youtube-hashtag-counter',
    description: 'Count #hashtags in titles and descriptions and warn before exceeding YouTube’s 15-tag cap.',
    longDescription:
      'YouTube only highlights the first 3 hashtags above your video title and ignores ALL hashtags on a video if you exceed 15–60 policy thresholds. YouTube Hashtag Counter detects every #tag in your text locally in your browser so you never trigger hashtag suppression.',
    keywords: [
      'youtube hashtag counter',
      'check youtube hashtags',
      'youtube 15 hashtag rule',
      'count hashtags youtube',
    ],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Hashtag Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Hashtag Counter scans your description for #hashtags, highlights the top 3, and checks YouTube’s 15-hashtag limit.',
    howTo: [
      {
        title: 'Paste your description or tag list',
        description:
          'Enter your video description text in your browser.',
      },
      {
        title: 'Inspect detected #hashtags',
        description:
          'View total unique hashtags, see the top 3 displayed tags, and check policy warnings.',
      },
      {
        title: 'Trim & copy clean text',
        description:
          'Keep focused hashtags cleanly within recommended guidelines.',
      },
    ],
    faqs: [
      {
        question: 'How many hashtags should I put in a YouTube description?',
        answer:
          'YouTube recommends using only 3–5 relevant hashtags; exceeding policy limits (over 15 or 60 depending on context) can cause YouTube to ignore all hashtags.',
      },
      {
        question: 'Which hashtags appear above the video title?',
        answer:
          'YouTube displays up to the first 3 hashtags found in your video description above the title when no title hashtags are set.',
      },
      {
        question: 'Does this check hashtags for duplicates?',
        answer:
          'Yes. Duplicate #tags are flagged cleanly.',
      },
      {
        question: 'Does it run locally in the browser?',
        answer:
          'Yes. Regex hashtag counting runs client-side with zero uploads.',
      },
    ],
    relatedTools: [
      'youtube-hashtag-generator',
      'youtube-tags-character-counter',
      'youtube-description-character-counter',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-tag-generator',
    name: 'YouTube Tag Generator',
    slug: 'youtube-tag-generator',
    category: 'youtube-tools',
    url: '/youtube-tag-generator',
    description: 'Build structured comma-separated video tags from keyword templates (template-based, not AI).',
    longDescription:
      'Create organized tag variations from your main topic, format, and year cleanly without bloat. YouTube Tag Generator is strictly template- and keyword-combination based inside your browser—NOT AI-generated—expanding your seed keyword with curated tutorial, review, and year patterns while watching the 500-char limit.',
    keywords: [
      'youtube tag generator',
      'yt tag template builder',
      'comma separated youtube tags',
      'video tag builder',
    ],
    icon: 'Tag',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Tag Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Tag Generator builds structured keyword tag sets using deterministic browser templates (NOT AI). Free, 500-char safe.',
    howTo: [
      {
        title: 'Enter topic & key details',
        description:
          'Type your primary video topic plus optional comma-separated sub-topics in the browser.',
      },
      {
        title: 'Combine keyword templates',
        description:
          'Structured template rules generate varied tag variations locally without repeated words (NOT AI, NOT live trending data).',
      },
      {
        title: 'Copy within 500 characters',
        description:
          'Generated tag sets stay within YouTube’s 500-character limit automatically; copy all or copy individual tags.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Tag Generator use AI?',
        answer:
          'No. It is 100% template- and keyword-rule based inside your browser—no AI models, live search volume, or external APIs are used.',
      },
      {
        question: 'Does it enforce YouTube’s 500-character tag cap?',
        answer:
          'Yes. Generated tag sets are automatically capped at 500 characters and display an exact character count next to the output.',
      },
      {
        question: 'Are generated tags formatted with commas for easy pasting?',
        answer:
          'Yes. Copying joins selected tags cleanly with commas for YouTube Studio.',
      },
      {
        question: 'Can I count custom tags separately?',
        answer:
          'Yes. Check YouTube Tags Character Counter anytime.',
      },
    ],
    relatedTools: [
      'youtube-tags-character-counter',
      'youtube-hashtag-generator',
      'youtube-title-generator',
      'youtube-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-hashtag-generator',
    name: 'YouTube Hashtag Generator',
    slug: 'youtube-hashtag-generator',
    category: 'youtube-tools',
    url: '/youtube-hashtag-generator',
    description: 'Format clean CamelCase #hashtags from topic keywords using browser templates (not AI).',
    longDescription:
      'Format your video topic and niche phrases into clean, space-free #Hashtags ready for descriptions and Shorts. YouTube Hashtag Generator is strictly template- and rule-based inside your browser (NOT AI-generated), helping you select 3–5 focused tags safely below YouTube’s limits.',
    keywords: [
      'youtube hashtag generator',
      'shorts hashtag builder',
      'format youtube hashtags',
      'yt hashtag templates',
    ],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Hashtag Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Hashtag Generator formats CamelCase #hashtags from keyword templates in your browser (NOT AI). Free and instant.',
    howTo: [
      {
        title: 'Type topic & niche keywords',
        description:
          'Enter topic keywords and toggle the #Shorts preset.',
      },
      {
        title: 'Assemble hashtag templates',
        description:
          'Rule-based formatting strips invalid punctuation and pairs niche prefixes (NOT AI).',
      },
      {
        title: 'Pick top 3–5 hashtags & copy',
        description:
          'Copy clean #hashtags straight into your YouTube description.',
      },
    ],
    faqs: [
      {
        question: 'Is YouTube Hashtag Generator AI-generated?',
        answer:
          'No. It is purely template- and formatting-rule based inside your browser.',
      },
      {
        question: 'Why does it recommend picking 3 to 5 hashtags?',
        answer:
          'YouTube surfaces only the top 3 hashtags above your title and warns against over-tagging.',
      },
      {
        question: 'Does it automatically include #Shorts for vertical clips?',
        answer:
          'Yes. Toggling the Shorts preset includes #Shorts cleanly in your selection.',
      },
      {
        question: 'How do I audit hashtags already written in my description?',
        answer:
          'Use YouTube Hashtag Counter to count and check duplicates.',
      },
    ],
    relatedTools: [
      'youtube-hashtag-counter',
      'youtube-tag-generator',
      'youtube-shorts-idea-generator',
      'youtube-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-title-generator',
    name: 'YouTube Title Generator',
    slug: 'youtube-title-generator',
    category: 'youtube-tools',
    url: '/youtube-title-generator',
    description: 'Plug your topic into proven click-worthy headline templates (formula-based, not AI).',
    longDescription:
      'Brainstorm clearer headlines faster using classic editorial frameworks—How-To, Mistakes-to-Avoid, Comparison, and Step-by-Step lists. YouTube Title Generator is strictly template- and formula-based inside your browser—NOT AI-written—and tracks the 100-character limit live.',
    keywords: [
      'youtube title generator',
      'video title formulas',
      'youtube headline templates',
      'title builder not ai',
    ],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Title Generator — Formulas | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Title Generator fills proven editorial headline formulas with your topic in the browser (NOT AI). Tracks 100-char cap.',
    howTo: [
      {
        title: 'Enter topic, key details & angle',
        description:
          'Type your core video topic, add optional key details or sub-topics, and pick an editorial angle or mixed set.',
      },
      {
        title: 'Fill proven title templates',
        description:
          'Browser formulas slot your words into structured tutorial, review, and listicle templates (NOT AI).',
      },
      {
        title: 'Edit wording inline & copy',
        description:
          'Click Edit on any title row to customize wording with live 100-character and mobile cutoff indicators, then copy.',
      },
    ],
    faqs: [
      {
        question: 'Are titles written by an AI model?',
        answer:
          'No. YouTube Title Generator uses deterministic headline formulas and curated editorial templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does it show character counts beside each title formula?',
        answer:
          'Yes. Every template row shows exact character count against the 100-char limit and mobile cutoff.',
      },
      {
        question: 'Can I preview my chosen title next to a thumbnail?',
        answer:
          'Yes. Test it right inside YouTube Thumbnail Preview Tool.',
      },
      {
        question: 'Is this tool completely free?',
        answer:
          'Yes. Free and browser-based with zero account required.',
      },
    ],
    relatedTools: [
      'youtube-title-character-counter',
      'youtube-hook-generator',
      'youtube-thumbnail-preview',
      'youtube-video-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-description-generator',
    name: 'YouTube Description Generator',
    slug: 'youtube-description-generator',
    category: 'youtube-tools',
    url: '/youtube-description-generator',
    description: 'Assemble clean structured video descriptions with timestamps, links, and disclaimers via templates (not AI).',
    longDescription:
      'Keep every upload organized with a repeatable layout: intro hook, key resource links, 00:00 chapter block, social handles, and affiliate disclaimer. YouTube Description Generator is strictly template-based inside your browser (NOT AI-written) so your channel branding stays consistent.',
    keywords: [
      'youtube description generator',
      'youtube description template builder',
      'video description formatter',
      'yt studio description boilerplate',
    ],
    icon: 'FileText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Description Generator assembles structured summary, chapter, and link templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Fill section fields & steps',
        description:
          'Enter your video summary hook, optional key steps for topic timestamps, your own links/handles, and call-to-action.',
      },
      {
        title: 'Assemble from template blocks',
        description:
          'Deterministic templates build topic-specific timestamps, your entered links, and topic hashtags locally without placeholder URLs (NOT AI).',
      },
      {
        title: 'Copy within 5,000 characters',
        description:
          'Review the character counter and copy cleanly into YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Description Generator use AI to write paragraphs?',
        answer:
          'No. It is purely template- and form-based—structuring your own summary, links, timestamps, and boilerplate blocks cleanly.',
      },
      {
        question: 'Can I include affiliate or sponsorship disclosure blocks?',
        answer:
          'Yes. One-click template checkboxes insert clean disclosure and copyright sections.',
      },
      {
        question: 'Does it check YouTube’s 5,000-character description limit?',
        answer:
          'Yes. A live character counter verifies total description length.',
      },
      {
        question: 'Can I combine it with chapter timestamps?',
        answer:
          'Yes. Pair with YouTube Chapter Generator to paste formatted timestamps directly.',
      },
    ],
    relatedTools: [
      'youtube-description-character-counter',
      'youtube-chapter-generator',
      'youtube-pinned-comment-generator',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-channel-name-generator',
    name: 'YouTube Channel Name Generator',
    slug: 'youtube-channel-name-generator',
    category: 'youtube-tools',
    url: '/youtube-channel-name-generator',
    description: 'Combine niche words with prefix and suffix templates to brainstorm channel names (not AI).',
    longDescription:
      'Starting a new channel and need clean naming directions without paying for branding tools? YouTube Channel Name Generator is strictly template- and word-combination based inside your browser (NOT AI-generated)—pairing your niche keyword with curated prefixes, suffixes, and formatting styles.',
    keywords: [
      'youtube channel name generator',
      'channel name templates',
      'youtube brand name combinator',
      'channel naming helper',
    ],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Channel Name Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Channel Name Generator builds niche naming combinations from browser templates (NOT AI). Free, no account needed.',
    howTo: [
      {
        title: 'Enter 1–2 niche keywords',
        description:
          'Enter your niche keyword and pick a naming style theme in your browser.',
      },
      {
        title: 'Combine naming templates',
        description:
          'Deterministic word-combination templates generate structured lists locally (NOT AI).',
      },
      {
        title: 'Validate handle format',
        description:
          'Copy favorite names and verify @handle formatting right away.',
      },
    ],
    faqs: [
      {
        question: 'Are channel names generated by AI?',
        answer:
          'No. Suggestions are created locally in your browser using deterministic prefix, suffix, and word-pairing templates.',
      },
      {
        question: 'Does this check live YouTube handle availability?',
        answer:
          'No. It checks format rules and generates combinations locally; final handle availability must be verified in YouTube Studio.',
      },
      {
        question: 'Can I turn a chosen channel name into @handle options?',
        answer:
          'Yes. Pair with YouTube Username Generator and YouTube Handle Format Validator.',
      },
      {
        question: 'Is this tool free with zero sign-up?',
        answer:
          'Yes. Runs completely in your browser for free.',
      },
    ],
    relatedTools: [
      'youtube-username-generator',
      'youtube-handle-format-validator',
      'youtube-video-idea-generator',
      'youtube-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-username-generator',
    name: 'YouTube Username Generator',
    slug: 'youtube-username-generator',
    category: 'youtube-tools',
    url: '/youtube-username-generator',
    description: 'Format clean @handle and username variations from your name or brand using templates (not AI).',
    longDescription:
      'Convert spaces, punctuation, and channel names into compliant YouTube @handles without hitting format errors. YouTube Username Generator is strictly template- and rule-based inside your browser (NOT AI-generated), applying YouTube’s 3–30 character, dot, underscore, and hyphen handle patterns.',
    keywords: [
      'youtube username generator',
      'youtube handle generator',
      'yt handle templates',
      'create youtube @handle',
    ],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Username Generator formats compliant @handle ideas from rules and templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your channel name or initials',
        description:
          'Enter your brand words or creator name directly inside your browser.',
      },
      {
        title: 'Apply handle rules & templates',
        description:
          'Rule-based templates strip invalid characters and suggest clean @handle variations (NOT AI).',
      },
      {
        title: 'Verify & copy your @handle',
        description:
          'Validate the selected handle against YouTube formatting guidelines before claiming it.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Username Generator use AI?',
        answer:
          'No. It is 100% rule- and template-based in your browser—NOT AI-written.',
      },
      {
        question: 'Does it follow YouTube @handle character rules?',
        answer:
          'Yes. Output patterns respect the 3–30 character length and allowed letters, numbers, underscores, hyphens, and periods.',
      },
      {
        question: 'Can I validate an existing handle I typed myself?',
        answer:
          'Yes. Use YouTube Handle Format Validator.',
      },
      {
        question: 'Does this reserve handles on YouTube?',
        answer:
          'No. Handle availability and claiming happen inside YouTube Studio.',
      },
    ],
    relatedTools: [
      'youtube-handle-format-validator',
      'youtube-channel-name-generator',
      'youtube-url-parser',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-handle-format-validator',
    name: 'YouTube Handle Format Validator',
    slug: 'youtube-handle-format-validator',
    category: 'youtube-tools',
    url: '/youtube-handle-format-validator',
    description: 'Validate any @handle against YouTube’s official character, length, and punctuation syntax rules.',
    longDescription:
      'Before updating your channel handle or printing business cards, verify that your handle passes every syntax rule. YouTube Handle Format Validator checks length (3–30 characters), allowed characters, leading/trailing punctuation restrictions, and URL normalization locally in your browser.',
    keywords: [
      'youtube handle format validator',
      'check youtube handle rules',
      'valid youtube @handle',
      'youtube handle syntax checker',
    ],
    icon: 'CheckSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Handle Format Validator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Handle Format Validator checks @handle length, characters, and URL formatting rules locally in your browser.',
    howTo: [
      {
        title: 'Enter a proposed @handle',
        description:
          'Type a handle with or without the leading @ symbol.',
      },
      {
        title: 'Run syntax & length checks',
        description:
          'Verify 3–30 character length, allowed symbols, and URL normalization rules client-side.',
      },
      {
        title: 'Copy normalized handle URL',
        description:
          'Fix any flagged character errors and copy your clean youtube.com/@handle URL.',
      },
    ],
    faqs: [
      {
        question: 'What characters are allowed in a YouTube @handle?',
        answer:
          'YouTube handles allow 3 to 30 alphanumeric characters plus underscores (_), hyphens (-), periods (.), and middle dots within YouTube formatting rules.',
      },
      {
        question: 'Does this check if someone already owns a handle on YouTube?',
        answer:
          'No. This browser tool checks syntax and format rules locally; live claim availability must be checked on YouTube.',
      },
      {
        question: 'Does it detect forbidden phone-number-like handles?',
        answer:
          'Yes. Format rules warn on patterns resembling phone numbers or disallowed URL prefixes.',
      },
      {
        question: 'Is any handle text stored?',
        answer:
          'No. Validation runs locally inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-username-generator',
      'youtube-channel-name-generator',
      'youtube-url-parser',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-script-generator',
    name: 'YouTube Script Generator',
    slug: 'youtube-script-generator',
    category: 'youtube-tools',
    url: '/youtube-script-generator',
    description: 'Build editable video script outlines using structured templates (TEMPLATE outline only, NOT AI-written).',
    longDescription:
      'Beat blank-page friction with proven storytelling scaffolding. YouTube Script Generator provides a TEMPLATE outline only, NOT AI-written prose—assembling editable sections for Hook, Setup, Main Steps, Pattern Interrupt, and Call-to-Action with target word counts directly in your browser.',
    keywords: [
      'youtube script generator',
      'youtube script template outline',
      'video outline builder',
      'script template not ai',
    ],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Script Generator — Outlines | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Script Generator creates editable template script outlines locally in your browser (TEMPLATE outline only, NOT AI-written).',
    howTo: [
      {
        title: 'Choose format & target length',
        description:
          'Enter your video subject, pick Tutorial, Review, Listicle, or Story template, and set your target minute runtime.',
      },
      {
        title: 'Generate editable template outline',
        description:
          'Structured sections, timing cues, and bullet prompts populate locally (NOT AI-written).',
      },
      {
        title: 'Copy & customize talking points',
        description:
          'Copy the structured script outline and fill in your own points in your notes app.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Script Generator use AI to write full scripts?',
        answer:
          'No. It generates a TEMPLATE outline only, NOT AI-written prose—you fill in your own insights and talking points inside structured sections.',
      },
      {
        question: 'Does it estimate spoken runtime from section target counts?',
        answer:
          'Yes. Standard ~140 words-per-minute pacing cues help size each section of your outline.',
      },
      {
        question: 'Can I pair this outline with opening hooks?',
        answer:
          'Yes. Check YouTube Hook Generator for template opening frameworks.',
      },
      {
        question: 'Does any draft leave my browser?',
        answer:
          'No. Templates and edits stay locally inside your browser tab.',
      },
    ],
    relatedTools: [
      'youtube-hook-generator',
      'youtube-video-idea-generator',
      'youtube-chapter-generator',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-hook-generator',
    name: 'YouTube Hook Generator',
    slug: 'youtube-hook-generator',
    category: 'youtube-tools',
    url: '/youtube-hook-generator',
    description: 'Frame crisp 15-second opening hooks from proven retention templates (formula-based, not AI).',
    longDescription:
      'The first 15 seconds decide whether viewers stay or click away. YouTube Hook Generator is strictly template- and formula-based inside your browser—NOT AI-written—slotting your topic and viewer outcome into structured Problem-Promise, Myth-Busting, and Quick-Result hook frameworks.',
    keywords: [
      'youtube hook generator',
      'video intro hook formulas',
      'youtube opening line templates',
      'hook framework builder',
    ],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Hook Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Hook Generator slots your topic into proven opening-line templates locally in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter topic & viewer pain point',
        description:
          'Type your video topic or core subject in the input box.',
      },
      {
        title: 'Slot into hook templates',
        description:
          'Browser formulas format concise 15-second spoken opener prompts (NOT AI).',
      },
      {
        title: 'Refine & paste into your outline',
        description:
          'Tweak the wording to match your voice and start filming.',
      },
    ],
    faqs: [
      {
        question: 'Is YouTube Hook Generator powered by AI?',
        answer:
          'No. It is 100% template- and formula-based inside your browser—NOT AI-generated.',
      },
      {
        question: 'Which hook frameworks are included?',
        answer:
          'Templates include Question-Hook, Result-First Preview, Common-Mistake Warning, and Contrarian Comparison.',
      },
      {
        question: 'Does it work for both long-form videos and Shorts?',
        answer:
          'Yes. Compact 1-sentence Shorts hooks and 15-second long-form intros are included.',
      },
      {
        question: 'Can I build a full outline next?',
        answer:
          'Yes. Use YouTube Script Generator for full template outlines.',
      },
    ],
    relatedTools: [
      'youtube-script-generator',
      'youtube-title-generator',
      'youtube-shorts-idea-generator',
      'youtube-pinned-comment-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-video-idea-generator',
    name: 'YouTube Video Idea Generator',
    slug: 'youtube-video-idea-generator',
    category: 'youtube-tools',
    url: '/youtube-video-idea-generator',
    description: 'Mix your niche keyword with proven video format matrices using templates (not AI).',
    longDescription:
      'Never run dry when planning next month’s uploads. YouTube Video Idea Generator is strictly template- and formula-based inside your browser (NOT AI-written)—combining your niche subject, audience level, and proven editorial angles into dozens of structured episode prompts.',
    keywords: [
      'youtube video idea generator',
      'video topic templates',
      'youtube content matrix',
      'video ideas not ai',
    ],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Video Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Video Idea Generator combines your niche with proven editorial format templates in the browser (NOT AI).',
    howTo: [
      {
        title: 'Enter niche topic & skill level',
        description:
          'Enter your channel niche and filter by Tutorials, Comparisons, or Listicles.',
      },
      {
        title: 'Apply format template matrix',
        description:
          'Browser formulas cross your topic with Tutorial, Teardown, Challenge, and vs. templates (NOT AI).',
      },
      {
        title: 'Save prompts to your calendar',
        description:
          'Copy favorite episode ideas directly into your content calendar.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Video Idea Generator use AI?',
        answer:
          'No. Ideas are assembled locally inside your browser using structured topic-format matrices and templates—NOT AI.',
      },
      {
        question: 'Can I filter by tutorial, comparison, or listicle templates?',
        answer:
          'Yes. Category toggles let you focus on specific proven formats.',
      },
      {
        question: 'Need 60-second vertical Shorts ideas specifically?',
        answer:
          'Check out YouTube Shorts Idea Generator.',
      },
      {
        question: 'Is there any usage limit or login?',
        answer:
          'No. Completely free and runs locally in your browser.',
      },
    ],
    relatedTools: [
      'youtube-shorts-idea-generator',
      'youtube-content-calendar-generator',
      'youtube-title-generator',
      'youtube-script-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-shorts-idea-generator',
    name: 'YouTube Shorts Idea Generator',
    slug: 'youtube-shorts-idea-generator',
    category: 'youtube-tools',
    url: '/youtube-shorts-idea-generator',
    description: 'Generate punchy 15–60 second vertical Shorts prompts using deterministic templates (not AI).',
    longDescription:
      'Adapt your niche topics into fast-paced vertical clips without guessing. YouTube Shorts Idea Generator is strictly template- and formula-based inside your browser (NOT AI-written)—turning your core topic into Quick-Tip, Myth-vs-Fact, Behind-the-Scenes, and Before-After Shorts templates.',
    keywords: [
      'youtube shorts idea generator',
      'shorts prompt templates',
      '60 second video ideas',
      'yt shorts builder',
    ],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Shorts Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Shorts Idea Generator creates 15–60 sec vertical video prompts via browser templates (NOT AI). Free, no sign-up.',
    howTo: [
      {
        title: 'Type your topic or tip',
        description:
          'Enter your Shorts niche or subject keyword.',
      },
      {
        title: 'Fill vertical Shorts templates',
        description:
          'Deterministic templates generate 15s, 30s, and 60s short-form prompts locally (NOT AI).',
      },
      {
        title: 'Pick your hook & #Shorts tags',
        description:
          'Copy your prompt and verify 9:16 framing before uploading.',
      },
    ],
    faqs: [
      {
        question: 'Are Shorts ideas written by AI?',
        answer:
          'No. Every prompt uses repeatable vertical video templates and formulas locally in your browser—NOT AI.',
      },
      {
        question: 'Can I check 9:16 vertical aspect ratio for my Shorts file?',
        answer:
          'Yes. Use YouTube Video Aspect Ratio Checker.',
      },
      {
        question: 'Can I pair these with #Shorts hashtags?',
        answer:
          'Yes. Use YouTube Hashtag Generator to format clean #Shorts tags.',
      },
      {
        question: 'Is this tool free and private?',
        answer:
          'Yes. Runs locally in your browser with no account required.',
      },
    ],
    relatedTools: [
      'youtube-video-idea-generator',
      'youtube-video-aspect-ratio-checker',
      'youtube-hashtag-generator',
      'youtube-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-chapter-generator',
    name: 'YouTube Chapter Generator',
    slug: 'youtube-chapter-generator',
    category: 'youtube-tools',
    url: '/youtube-chapter-generator',
    description: 'Format and validate 00:00 YouTube description timestamps using template rules (not AI).',
    longDescription:
      'YouTube quietly disables video chapters if the first timestamp is not 00:00, if chapters are shorter than 10 seconds, or if fewer than 3 timestamps exist. YouTube Chapter Generator is strictly template- and rule-based inside your browser (NOT AI)—validating your list and copying clean 00:00 formatted chapters.',
    keywords: [
      'youtube chapter generator',
      'youtube timestamps formatter',
      '00:00 chapters helper',
      'validate youtube chapters',
    ],
    icon: 'ListVideo',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Chapter Generator — 00:00 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Chapter Generator formats and validates 00:00 timestamp chapters using rules in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter timestamp & chapter labels',
        description:
          'Add your section start times and labels directly in your browser.',
      },
      {
        title: 'Validate 00:00 & 10-sec rules',
        description:
          'Rule checks ensure ascending order, 00:00 start, at least 3 chapters, and >=10 sec spacing (NOT AI).',
      },
      {
        title: 'Copy clean chapter block',
        description:
          'Paste the formatted timestamp lines directly into your YouTube description.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Chapter Generator auto-watch videos with AI?',
        answer:
          'No. It is a deterministic timestamp formatter and rule validator in your browser (NOT AI)—you type your chapter times and titles.',
      },
      {
        question: 'What rules must YouTube chapters follow to show on the seek bar?',
        answer:
          'The first timestamp must start at 00:00, you need at least 3 timestamps in ascending order, and each chapter must be at least 10 seconds long.',
      },
      {
        question: 'Can I combine chapters with a full description layout?',
        answer:
          'Yes. Paste directly into YouTube Description Generator.',
      },
      {
        question: 'Is there any limit or server upload?',
        answer:
          'No. Formatting runs instantly inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-timestamp-link-generator',
      'youtube-description-generator',
      'youtube-description-character-counter',
      'youtube-upload-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-pinned-comment-generator',
    name: 'YouTube Pinned Comment Generator',
    slug: 'youtube-pinned-comment-generator',
    category: 'youtube-tools',
    url: '/youtube-pinned-comment-generator',
    description: 'Craft engaging pinned comments, links, and discussion questions via templates (not AI).',
    longDescription:
      'A thoughtful pinned comment sparks early discussion and boosts clicks to resources without cluttering the intro of your video. YouTube Pinned Comment Generator is strictly template-based inside your browser (NOT AI-written)—giving you proven poll, question, correction, and resource-link comment templates.',
    keywords: [
      'youtube pinned comment generator',
      'pinned comment templates',
      'yt comment engagement builder',
      'creator pinned comment',
    ],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Pinned Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Pinned Comment Generator builds customizable engagement and resource comment templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick comment goal & links',
        description:
          'Choose Question, Poll, Resource Link, or Subscribe CTA template and fill your text.',
      },
      {
        title: 'Fill template placeholders',
        description:
          'Your topic and URLs slot cleanly into structured comment templates locally (NOT AI).',
      },
      {
        title: 'Copy & pin after publishing',
        description:
          'Post and pin your comment right inside YouTube Studio.',
      },
    ],
    faqs: [
      {
        question: 'Are pinned comments generated by AI?',
        answer:
          'No. Comments are built from customizable engagement templates and fill-in-the-blank formulas in your browser—NOT AI.',
      },
      {
        question: 'Can I include clean line breaks and bulleted links?',
        answer:
          'Yes. Templates preserve YouTube comment line-break formatting cleanly.',
      },
      {
        question: 'Should I measure comment engagement too?',
        answer:
          'Yes. Use YouTube Engagement Rate Calculator to track likes and comments per view.',
      },
      {
        question: 'Is this tool completely free?',
        answer:
          'Yes. Free and client-side with zero sign-up.',
      },
    ],
    relatedTools: [
      'youtube-description-generator',
      'youtube-engagement-rate-calculator',
      'youtube-upload-checklist',
      'youtube-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-upload-checklist',
    name: 'YouTube Upload Checklist',
    slug: 'youtube-upload-checklist',
    category: 'youtube-tools',
    url: '/youtube-upload-checklist',
    description: 'Step through pre-publish title, thumbnail, end-screen, chapter, and audio checks.',
    longDescription:
      'Prevent silent missing captions, forgotten end screens, or missing affiliate disclosures right before hitting Publish. YouTube Upload Checklist provides an interactive browser checklist covering encoding, 1280x720 thumbnail checks, 00:00 chapters, cards, end screens, and pinned comment prep.',
    keywords: [
      'youtube upload checklist',
      'pre publish youtube list',
      'video launch checklist',
      'yt studio checklist',
    ],
    icon: 'ListChecks',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Upload Checklist | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Upload Checklist guides creators through title, thumbnail, caption, end-screen, and chapter checks in the browser.',
    howTo: [
      {
        title: 'Open checklist before upload',
        description:
          'Open the interactive checklist alongside YouTube Studio and pick Long-Form or Shorts mode.',
      },
      {
        title: 'Tick pre- & post-upload steps',
        description:
          'Verify HD processing, thumbnail under 2 MB, captions, end screens, and pinned comment.',
      },
      {
        title: 'Reset for your next video',
        description:
          'Clear ticks with one click when preparing your next upload.',
      },
    ],
    faqs: [
      {
        question: 'Does YouTube Upload Checklist connect to my YouTube account?',
        answer:
          'No. It is a clean, private interactive checklist inside your browser with zero account login.',
      },
      {
        question: 'Are thumbnail, title, and chapter validators linked?',
        answer:
          'Yes. Quick links connect directly to our Size Checker, Title Counter, and Chapter Generator.',
      },
      {
        question: 'Can I customize or toggle Shorts vs. Long-form items?',
        answer:
          'Yes. Switch between Long-Form Video and YouTube Shorts checklist modes at the top.',
      },
      {
        question: 'Is my checklist progress saved locally?',
        answer:
          'Optional browser local-only storage lets you keep progress between tabs without server sync.',
      },
    ],
    relatedTools: [
      'youtube-thumbnail-size-checker',
      'youtube-title-character-counter',
      'youtube-chapter-generator',
      'youtube-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-content-calendar-generator',
    name: 'YouTube Content Calendar Generator',
    slug: 'youtube-content-calendar-generator',
    category: 'youtube-tools',
    url: '/youtube-content-calendar-generator',
    description: 'Generate an editable weekly publishing schedule from cadence templates (formula-based, not AI).',
    longDescription:
      'Plan a realistic upload rhythm across tutorials, Shorts, and community posts without spreadsheet setup. YouTube Content Calendar Generator is strictly template- and formula-based inside your browser (NOT AI-written)—mapping your chosen cadence, start date, and content pillar onto calendar dates you can copy as CSV.',
    keywords: [
      'youtube content calendar generator',
      'youtube upload schedule template',
      'creator editorial calendar',
      'publishing cadence planner',
    ],
    icon: 'Calendar',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Content Calendar Generator builds editable weekly upload schedules using date formulas in your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick cadence & start date',
        description:
          'Choose 1–3 uploads/week, pick a start date, and enter your core content pillar.',
      },
      {
        title: 'Generate schedule from date formula',
        description:
          'Browser date formulas populate balanced Long-form and Shorts slots cleanly (NOT AI).',
      },
      {
        title: 'Copy schedule as CSV',
        description:
          'Review your 4-week schedule and click Copy CSV Text for your spreadsheet.',
      },
    ],
    faqs: [
      {
        question: 'Does Content Calendar Generator use AI to invent topics?',
        answer:
          'No. It is purely formula- and template-based in your browser (NOT AI), framing your chosen pillar across real calendar dates.',
      },
      {
        question: 'Can I copy the generated schedule as CSV?',
        answer:
          'Yes. Click Copy CSV Text to copy comma-separated rows ready to paste into Excel or Google Sheets.',
      },
      {
        question: 'Can I generate episode prompts to fill the slots?',
        answer:
          'Yes. Pair with YouTube Video Idea Generator and Shorts Idea Generator.',
      },
      {
        question: 'Are any calendar dates stored on external servers?',
        answer:
          'No. Everything computes locally inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-video-idea-generator',
      'youtube-shorts-idea-generator',
      'youtube-upload-checklist',
      'csv-to-excel',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-earnings-calculator',
    name: 'YouTube Earnings Calculator',
    slug: 'youtube-earnings-calculator',
    category: 'youtube-tools',
    url: '/youtube-earnings-calculator',
    description: 'Estimate potential daily, monthly, and yearly ad revenue ranges from views and RPM.',
    longDescription:
      'Model what different view milestones and RPM brackets could mean for a channel budget. Estimate-only disclaimer: actual earnings vary by niche, country and ad rates. YouTube Earnings Calculator runs simple transparent math formulas locally in your browser with zero server tracking.',
    keywords: [
      'youtube earnings calculator',
      'youtube money calculator',
      'yt revenue estimator',
      'estimate youtube income',
    ],
    icon: 'DollarSign',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Earnings Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Earnings Calculator estimates potential revenue ranges from views and RPM in your browser (estimate-only).',
    howTo: [
      {
        title: 'Enter expected views & RPM range',
        description:
          'Enter daily views alongside your expected RPM rate in USD.',
      },
      {
        title: 'Calculate estimate ranges locally',
        description:
          'Browser formulas compute daily, monthly, and annualized estimate ranges instantaneously.',
      },
      {
        title: 'Compare sensitivity scenarios',
        description:
          'Remember: this is an estimate only—actual earnings vary by niche, country and ad rates.',
      },
    ],
    faqs: [
      {
        question: 'Are figures from YouTube Earnings Calculator guaranteed?',
        answer:
          'No. Estimate-only disclaimer: actual earnings vary by niche, country and ad rates, viewer ad-block usage, video length, and seasonality.',
      },
      {
        question: 'Why does the calculator ask for RPM instead of only CPM?',
        answer:
          'RPM reflects creator revenue per 1,000 total views after YouTube’s revenue share, whereas CPM reflects advertiser spend per 1,000 monetized ad impressions.',
      },
      {
        question: 'Can I calculate my exact historical RPM from Studio totals?',
        answer:
          'Yes. Use YouTube RPM Calculator.',
      },
      {
        question: 'Does it send any numbers off my device?',
        answer:
          'No. Math runs locally inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-rpm-calculator',
      'youtube-cpm-calculator',
      'youtube-watch-hours-calculator',
      'youtube-subscriber-goal-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-rpm-calculator',
    name: 'YouTube RPM Calculator',
    slug: 'youtube-rpm-calculator',
    category: 'youtube-tools',
    url: '/youtube-rpm-calculator',
    description: 'Compute Revenue Per Mille (RPM) from total video views and creator revenue.',
    longDescription:
      'Understand how much revenue each 1,000 video views earns across long-form videos, Shorts, or channel totals. Using the standard formula (Total Revenue ÷ Total Views × 1,000), YouTube RPM Calculator calculates RPM cleanly in your browser. Estimate-only rates vary by niche, country and ad rates.',
    keywords: [
      'youtube rpm calculator',
      'calculate rpm youtube',
      'revenue per 1000 views',
      'yt rpm formula',
    ],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube RPM Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube RPM Calculator computes revenue per 1,000 views cleanly inside your browser. Free and formula-based.',
    howTo: [
      {
        title: 'Enter total revenue & total views',
        description:
          'Input estimated creator earnings and total views for the period.',
      },
      {
        title: 'Run RPM formula locally',
        description:
          'Your browser divides total revenue by views and multiplies by 1,000.',
      },
      {
        title: 'Compare against CPM',
        description:
          'Track how effectively total views convert into creator revenue.',
      },
    ],
    faqs: [
      {
        question: 'How is YouTube RPM calculated?',
        answer:
          'RPM equals (Estimated Creator Revenue ÷ Total Video Views) × 1,000.',
      },
      {
        question: 'How does RPM differ from CPM?',
        answer:
          'CPM measures gross advertiser cost per 1,000 monetized ad playbacks, while RPM measures net creator earnings per 1,000 total video views.',
      },
      {
        question: 'Do actual RPM rates stay constant across videos?',
        answer:
          'No. Actual RPM varies by niche, audience country, season, and ad formats.',
      },
      {
        question: 'Is any revenue figure stored?',
        answer:
          'No. All math stays locally inside your browser.',
      },
    ],
    relatedTools: [
      'youtube-cpm-calculator',
      'youtube-earnings-calculator',
      'youtube-engagement-rate-calculator',
      'youtube-watch-hours-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-cpm-calculator',
    name: 'YouTube CPM Calculator',
    slug: 'youtube-cpm-calculator',
    category: 'youtube-tools',
    url: '/youtube-cpm-calculator',
    description: 'Calculate Cost Per Mille (CPM) from ad spend and monetized playbacks in your browser.',
    longDescription:
      'Evaluate advertiser demand or sponsorship rate equivalencies quickly. Using the standard formula (Total Ad Cost ÷ Monetized Impressions × 1,000), YouTube CPM Calculator computes CPM cleanly inside your browser. Actual CPM rates vary by niche, geography and seasonal demand.',
    keywords: [
      'youtube cpm calculator',
      'cost per 1000 impressions youtube',
      'yt cpm formula',
      'ad cpm calculator',
    ],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube CPM Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube CPM Calculator computes Cost Per Mille (CPM) from ad cost and monetized views locally in your browser.',
    howTo: [
      {
        title: 'Enter ad spend & monetized views',
        description:
          'Enter total advertiser ad spend ($) and monetized playbacks.',
      },
      {
        title: 'Compute CPM instantaneously',
        description:
          'Browser formulas solve (Cost ÷ Monetized Views) × 1,000 with zero server calls.',
      },
      {
        title: 'Compare with creator RPM',
        description:
          'Pair with YouTube RPM Calculator to model full monetization.',
      },
    ],
    faqs: [
      {
        question: 'What is the YouTube CPM formula?',
        answer:
          'CPM equals (Total Advertiser Spend ÷ Monetized Ad Impressions) × 1,000.',
      },
      {
        question: 'Does this also estimate the creator revenue share?',
        answer:
          'Yes. Alongside gross advertiser CPM, the calculator displays an illustrative 55% creator share.',
      },
      {
        question: 'Are CPM estimates guarantees of ad rates?',
        answer:
          'No. Actual advertiser CPM rates vary widely by niche, geography, and quarter.',
      },
      {
        question: 'Does this work completely client-side?',
        answer:
          'Yes. Runs locally inside your browser tab.',
      },
    ],
    relatedTools: [
      'youtube-rpm-calculator',
      'youtube-earnings-calculator',
      'youtube-engagement-rate-calculator',
      'youtube-subscriber-goal-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-watch-hours-calculator',
    name: 'YouTube Watch Hours Calculator',
    slug: 'youtube-watch-hours-calculator',
    category: 'youtube-tools',
    url: '/youtube-watch-hours-calculator',
    description: 'Track progress toward the 4,000 public watch hours milestone and model daily watch targets.',
    longDescription:
      'Working toward YouTube Partner Program thresholds? YouTube Watch Hours Calculator converts average view duration and daily views into projected watch hours—showing exact remaining hours toward 3,000 or 4,000 public watch hours locally in your browser.',
    keywords: [
      'youtube watch hours calculator',
      '4000 watch hours calculator',
      'yt monetization hours tracker',
      'calculate watch time hours',
    ],
    icon: 'Clock',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Watch Hours Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Watch Hours Calculator models daily views needed to reach 3,000 or 4,000 public watch hours in your browser.',
    howTo: [
      {
        title: 'Enter current watch hours & avg duration',
        description:
          'Enter your current watch hours, target watch hours (such as 4,000), and average view duration in minutes.',
      },
      {
        title: 'Calculate daily views & hours needed',
        description:
          'Browser formulas compute daily minutes and views required to hit 3,000 or 4,000 hours.',
      },
      {
        title: 'Adjust pacing scenarios',
        description:
          'Test how higher retention or upload frequency shortens the timeline.',
      },
    ],
    faqs: [
      {
        question: 'Why does YouTube require 3,000 or 4,000 public watch hours?',
        answer:
          'YouTube Partner Program tiers currently use 3,000 public watch hours (fan funding tier) and 4,000 public watch hours (ad revenue tier) in the past 365 days, alongside subscriber thresholds.',
      },
      {
        question: 'Do YouTube Shorts views count toward the 4,000 watch hours threshold?',
        answer:
          'No. Shorts follow a separate 90-day Shorts views milestone rather than long-form public watch hours.',
      },
      {
        question: 'Can I project subscriber milestones too?',
        answer:
          'Yes. Pair with YouTube Subscriber Goal Calculator.',
      },
      {
        question: 'Does this connect to Studio APIs?',
        answer:
          'No. Enter your own figures manually—all calculations stay local in your browser.',
      },
    ],
    relatedTools: [
      'youtube-subscriber-goal-calculator',
      'youtube-playlist-duration-calculator',
      'youtube-earnings-calculator',
      'youtube-rpm-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-subscriber-goal-calculator',
    name: 'YouTube Subscriber Goal Calculator',
    slug: 'youtube-subscriber-goal-calculator',
    category: 'youtube-tools',
    url: '/youtube-subscriber-goal-calculator',
    description: 'Estimate milestone dates for 1K, 10K, or 100K subscribers from your daily growth rate.',
    longDescription:
      'Curious when your channel might cross 500, 1,000, 10,000, or 100,000 subscribers at your current pace? YouTube Subscriber Goal Calculator applies linear daily-pace formulas locally in your browser to project milestone timelines.',
    keywords: [
      'youtube subscriber goal calculator',
      'when will i hit 1000 subscribers',
      'subscriber milestone estimator',
      'yt sub growth calculator',
    ],
    icon: 'Users',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Subscriber Goal Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Subscriber Goal Calculator projects timeline dates for 1K, 10K, and 100K milestones inside your browser.',
    howTo: [
      {
        title: 'Enter current count & target goal',
        description:
          'Enter your subscriber count, target milestone (or pick a quick preset), and average new subscribers per day.',
      },
      {
        title: 'Calculate projected timeline',
        description:
          'Browser formulas compute days and approximate months remaining alongside weekly pace.',
      },
      {
        title: 'Review timeline & weekly pace',
        description:
          'Inspect remaining subscribers needed, estimated days and months to reach your goal, and your weekly subscriber pace.',
      },
    ],
    faqs: [
      {
        question: 'Can it calculate dates for 500 and 1,000 YPP milestones?',
        answer:
          'Yes. Quick presets include 500, 1K, 10K, 100K, and 1M subscribers plus custom targets.',
      },
      {
        question: 'Does this fetch live channel counts from YouTube?',
        answer:
          'No. You type your own starting numbers directly in the browser for private, instant calculation.',
      },
      {
        question: 'How is the timeline calculated?',
        answer:
          'It divides remaining subscribers needed by your average new subscribers per day (linear pace) and shows equivalent months and weekly pace.',
      },
      {
        question: 'Can I pair this with watch hours planning?',
        answer:
          'Yes. Use YouTube Watch Hours Calculator alongside it.',
      },
    ],
    relatedTools: [
      'youtube-watch-hours-calculator',
      'youtube-engagement-rate-calculator',
      'youtube-earnings-calculator',
      'youtube-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-engagement-rate-calculator',
    name: 'YouTube Engagement Rate Calculator',
    slug: 'youtube-engagement-rate-calculator',
    category: 'youtube-tools',
    url: '/youtube-engagement-rate-calculator',
    description: 'Compute video engagement rate percentage from views, likes, comments, and shares.',
    longDescription:
      'Benchmark viewer response across individual uploads or sponsorship recaps. Using standard engagement formulas ((Likes + Comments + Shares) ÷ Views × 100), YouTube Engagement Rate Calculator calculates exact percentages plus like-to-view ratios locally in your browser.',
    keywords: [
      'youtube engagement rate calculator',
      'calculate yt engagement percentage',
      'likes comments views ratio',
      'youtube sponsorship metrics',
    ],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Engagement Rate Calculator computes video engagement % and like-to-view ratios locally in your browser.',
    howTo: [
      {
        title: 'Enter views, likes & comments',
        description:
          'Enter total video views, likes, comments, and shares in your browser.',
      },
      {
        title: 'Calculate engagement percentage',
        description:
          'Browser formulas return overall engagement % alongside separate like-ratio and comment-ratio metrics.',
      },
      {
        title: 'Benchmark against past uploads',
        description:
          'Compare tutorials, Shorts, and announcements cleanly.',
      },
    ],
    faqs: [
      {
        question: 'What formula does YouTube Engagement Rate Calculator use?',
        answer:
          'Standard engagement rate equals ((Likes + Comments + Optional Shares) ÷ Total Views) × 100.',
      },
      {
        question: 'Does it also show separate Like Rate and Comment Rate?',
        answer:
          'Yes. Individual breakdown percentages help diagnose passive vs. discussion-heavy videos.',
      },
      {
        question: 'Is any channel or analytics account connected?',
        answer:
          'No. Calculations run client-side from numbers you type in.',
      },
      {
        question: 'How can I increase comment engagement?',
        answer:
          'Try posting a question with YouTube Pinned Comment Generator.',
      },
    ],
    relatedTools: [
      'youtube-pinned-comment-generator',
      'youtube-rpm-calculator',
      'youtube-subscriber-goal-calculator',
      'youtube-earnings-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-playlist-duration-calculator',
    name: 'YouTube Playlist Duration Calculator',
    slug: 'youtube-playlist-duration-calculator',
    category: 'youtube-tools',
    url: '/youtube-playlist-duration-calculator',
    description: 'Sum total playlist length and view adjusted playback times at 1.25x, 1.5x, and 2x speeds.',
    longDescription:
      'Planning a weekend course binge or checking the runtime of your tutorial series? YouTube Playlist Duration Calculator sums video lengths cleanly inside your browser and displays exact completion times at 1x, 1.25x, 1.5x, 1.75x, and 2x playback speeds.',
    keywords: [
      'youtube playlist duration calculator',
      'total playlist length',
      'playlist watch time at 1.5x',
      'sum video durations',
    ],
    icon: 'ListVideo',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Playlist Duration Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Playlist Duration Calculator totals video runtimes and computes 1.25x, 1.5x, and 2x watch speeds in your browser.',
    howTo: [
      {
        title: 'Paste playlist durations or video list',
        description:
          'Paste video runtimes (MM:SS or HH:MM:SS), one per line, directly in your browser.',
      },
      {
        title: 'Sum total runtime & average length',
        description:
          'Browser formulas compute exact hours, minutes, seconds, and average episode length.',
      },
      {
        title: 'Check 1.25x to 2x speeds',
        description:
          'Compare total study time across common playback speeds.',
      },
    ],
    faqs: [
      {
        question: 'Which timestamp formats can I enter?',
        answer:
          'Standard MM:SS and HH:MM:SS durations (for example 12:45 or 1:05:20) sum cleanly.',
      },
      {
        question: 'Does it calculate adjusted watch times at faster playback speeds?',
        answer:
          'Yes. 1.25x, 1.5x, 1.75x, and 2x totals display automatically.',
      },
      {
        question: 'Does it also report average video duration?',
        answer:
          'Yes. Average length per video is computed alongside total playlist runtime.',
      },
      {
        question: 'Is this tool completely browser-based?',
        answer:
          'Yes. Duration arithmetic runs locally in your browser.',
      },
    ],
    relatedTools: [
      'youtube-watch-hours-calculator',
      'youtube-chapter-generator',
      'youtube-timestamp-link-generator',
      'youtube-video-file-size-estimator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-video-aspect-ratio-checker',
    name: 'YouTube Video Aspect Ratio Checker',
    slug: 'youtube-video-aspect-ratio-checker',
    category: 'youtube-tools',
    url: '/youtube-video-aspect-ratio-checker',
    description: 'Check video resolution and aspect ratio against YouTube 16:9 widescreen and 9:16 Shorts specs.',
    longDescription:
      'Ensure you will not end up with unexpected black bars on widescreen monitors or vertical Shorts feeds. YouTube Video Aspect Ratio Checker reads your entered dimensions or local video metadata in your browser to verify exact 16:9 standard or 9:16 Shorts compliance and calculate crop dimensions.',
    keywords: [
      'youtube video aspect ratio checker',
      'check 16:9 or 9:16 shorts',
      'youtube resolution validator',
      'video aspect calculator',
    ],
    icon: 'Ratio',
    acceptedFormats: ['Numbers', 'MP4', 'MOV'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Video Aspect Ratio Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Video Aspect Ratio Checker validates 16:9 landscape and 9:16 Shorts resolutions locally in your browser.',
    howTo: [
      {
        title: 'Enter pixel width & height',
        description:
          'Type pixel width and height (e.g. 1920x1080 or 1080x1920) or click a preset.',
      },
      {
        title: 'Check 16:9 & 9:16 compliance',
        description:
          'Browser math computes exact reduced ratio and flags letterboxing or Shorts eligibility.',
      },
      {
        title: 'View ideal YouTube scale targets',
        description:
          'Compare 720p, 1080p, 1440p, and 4K UHD recommended dimensions.',
      },
    ],
    faqs: [
      {
        question: 'What aspect ratios does YouTube recommend for videos and Shorts?',
        answer:
          'Standard widescreen videos use 16:9 (such as 1920x1080 or 1280x720), while YouTube Shorts perform best in 9:16 vertical (1080x1920) or square 1:1.',
      },
      {
        question: 'Does this checker upload my video files?',
        answer:
          'No. Ratio math and optional local file metadata checks happen strictly in your browser.',
      },
      {
        question: 'Can I check thumbnail 16:9 dimensions too?',
        answer:
          'Yes. Use YouTube Thumbnail Size Checker for image files.',
      },
      {
        question: 'Need to estimate upload file size before rendering?',
        answer:
          'Use YouTube Video File Size Estimator.',
      },
    ],
    relatedTools: [
      'youtube-video-file-size-estimator',
      'youtube-thumbnail-size-checker',
      'youtube-shorts-idea-generator',
      'youtube-embed-code-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'youtube-video-file-size-estimator',
    name: 'YouTube Video File Size Estimator',
    slug: 'youtube-video-file-size-estimator',
    category: 'youtube-tools',
    url: '/youtube-video-file-size-estimator',
    description: 'Estimate exported video MB/GB size and upload time from resolution, bitrate, and duration.',
    longDescription:
      'Before rendering a long 1080p or 4K project on tight disk space or slow hotel Wi-Fi, calculate approximate export size and upload duration. YouTube Video File Size Estimator uses standard bitrate formulas locally in your browser across YouTube’s recommended SDR/HDR bitrates.',
    keywords: [
      'youtube video file size estimator',
      'bitrate file size calculator',
      'estimate youtube upload time',
      'video render size calculator',
    ],
    icon: 'HardDrive',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `YouTube Video File Size Estimator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'YouTube Video File Size Estimator calculates expected render size (MB/GB) and upload time from bitrate in your browser.',
    howTo: [
      {
        title: 'Choose resolution, frame rate & runtime',
        description:
          'Enter video duration in minutes, choose a YouTube bitrate preset, and optionally enter your upload speed in Mbps.',
      },
      {
        title: 'Run bitrate formula locally',
        description:
          'Your browser computes (Duration in seconds × Bitrate in Mbps) ÷ 8 = MB (with 1 GB = 1,000 MB) and shows a separate 384 kbps audio track note.',
      },
      {
        title: 'Estimate upload time',
        description:
          'Enter your Mbps upload speed to see approximate YouTube upload duration.',
      },
    ],
    faqs: [
      {
        question: 'How accurately can bitrate estimate exported file size?',
        answer:
          'Constant-bitrate (CBR) exports match the formula closely, while variable-bitrate (VBR) exports fluctuate depending on scene motion.',
      },
      {
        question: 'Does it include YouTube’s recommended upload bitrate presets?',
        answer:
          'Yes. Presets for 720p, 1080p (30/60fps), 1440p, and 4K UHD bitrates are built in.',
      },
      {
        question: 'What if my video file is too large for fast sharing?',
        answer:
          'Try Compress Video for clips up to 100 MB and 3 minutes max.',
      },
      {
        question: 'Is this estimator completely browser-based?',
        answer:
          'Yes. Pure math runs instantaneously inside your browser tab.',
      },
    ],
    relatedTools: [
      'youtube-video-aspect-ratio-checker',
      'compress-video',
      'video-to-mp4',
      'youtube-playlist-duration-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  ...INSTAGRAM_TOOLS,
  ...FACEBOOK_TOOLS,
  ...TIKTOK_TOOLS,
  ...PINTEREST_TOOLS,
  ...LINKEDIN_TOOLS,
  ...REDDIT_TOOLS,
  ...TWITTER_TOOLS,
  ...SNAPCHAT_TOOLS,
  ...THREADS_TOOLS,
  ...PRODUCTIVITY_TOOLS,
  ...UNIT_CONVERTER_TOOLS,
  ...UNIT_CONVERTER_ADDITIONS,
  ...LAND_AREA_UNIT_TOOLS,
  ...NUMBER_SYSTEM_TOOLS,
  ...LOOKUP_TOOLS,
  ...SCIENCE_TOOLS,
  ...GENERATOR_TOOLS,
  ...DEVELOPER_TOOLS,
  ...DOCUMENT_TOOLS,
  ...FINANCE_TOOLS,
] as const;

export function getCategoryById(id: ToolCategoryId): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(categoryId: ToolCategoryId): Tool[] {
  return TOOLS.filter((t) => t.category === categoryId);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

export const POPULAR_TOOL_ORDER = [
  'compress-pdf',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'compress-image',
  'compress-video',
  'sign-pdf',
  'pdf-to-word',
  'merge-pdf',
  'split-pdf',
  'resize-image',
  'rotate-pdf',
  'convert-image',
] as const;

export function getPopularTools(): Tool[] {
  const rank = new Map<string, number>(
    POPULAR_TOOL_ORDER.map((id, index) => [id, index]),
  );
  return TOOLS.filter((t) => t.popular).sort(
    (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999),
  );
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((t) => t.featured);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedTools
    .map((id) => getToolById(id))
    .filter((item): item is Tool => Boolean(item));
}
