import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const INSTAGRAM_TOOLS: readonly Tool[] = [
  {
    id: 'instagram-bio-generator',
    name: 'Instagram Bio Generator',
    slug: 'instagram-bio-generator',
    category: 'instagram-tools',
    url: '/instagram-bio-generator',
    description: 'Build crisp Instagram profile bios within 150 characters using editable templates (not AI).',
    longDescription:
      'Introduce who you help, what you share, and your link call-to-action cleanly within Instagram’s tight 150-character bio cap. Instagram Bio Generator is strictly template-based inside your browser—NOT AI-written—combining structured role, niche, and CTA templates with live character counting.',
    keywords: ['instagram bio generator', 'ig bio templates', 'bio builder not ai', '150 char bio'],
    icon: 'Instagram',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Bio Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Bio Generator formats 150-char profile bios using editable templates locally in your browser (NOT AI). Free and unwatermarked.',
    howTo: [
      {
        title: 'Enter role, niche & call-to-action',
        description: 'Once active, fill in your specialty, location or proof point, and link CTA inside your browser.',
      },
      {
        title: 'Pick structured bio templates',
        description: 'Browser templates organize stacked bullet lines, dividers, and spacing deterministically (NOT AI).',
      },
      {
        title: 'Copy within 150 characters',
        description: 'Check the live 150-character limit indicator and paste straight into Edit Profile.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Bio Generator use AI?',
        answer: 'No. It is 100% template-based inside your browser using structured bio formulas—NOT AI-written.',
      },
      {
        question: 'Does it enforce Instagram’s 150-character bio limit?',
        answer: 'Yes. Every template shows live character count against the 150-character limit.',
      },
      {
        question: 'Can I preserve stacked multi-line spacing?',
        answer: 'Yes. Line breaks format cleanly for pasting into the Instagram app.',
      },
      {
        question: 'Can I pair this with special fonts?',
        answer: 'Yes. Style headings or highlights using Instagram Font Generator.',
      },
    ],
    relatedTools: [
      'instagram-bio-character-counter',
      'instagram-username-generator',
      'instagram-line-break-generator',
      'instagram-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-username-generator',
    name: 'Instagram Username Generator',
    slug: 'instagram-username-generator',
    category: 'instagram-tools',
    url: '/instagram-username-generator',
    description: 'Create clean @username variations from your name or brand via rules and templates (not AI).',
    longDescription:
      'Turn your brand or name words into memorable, punctuation-safe Instagram handles. Instagram Username Generator is strictly template- and rule-based inside your browser (NOT AI-written)—combining your keywords with dot, underscore, and niche prefix/suffix patterns within 30 characters.',
    keywords: ['instagram username generator', 'ig handle templates', 'instagram name combinator'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Username Generator formats clean 30-char handle ideas using rules and templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter name or brand keywords',
        description: 'Once live, type up to 2 core words and choose optional prefixes or separators.',
      },
      {
        title: 'Generate template handle variations',
        description: 'Browser rules build dot, underscore, and niche-word combinations cleanly (NOT AI).',
      },
      {
        title: 'Check syntax rules & copy',
        description: 'Verify valid formatting and copy your favorite @username candidates.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Username Generator use AI or check live availability?',
        answer: 'No. It uses deterministic browser templates (NOT AI) and cannot check whether an account is already taken on Instagram.',
      },
      {
        question: 'Do results follow Instagram username syntax rules?',
        answer: 'Yes. Generated strings stay within 1–30 lowercase letters, numbers, periods, and underscores.',
      },
      {
        question: 'Can I validate a username I typed myself?',
        answer: 'Yes. Use Instagram Username Availability Format Checker.',
      },
      {
        question: 'Does this run completely in the browser?',
        answer: 'Yes. No remote requests or account login needed.',
      },
    ],
    relatedTools: [
      'instagram-username-availability-format-checker',
      'instagram-username-formatter',
      'instagram-bio-generator',
      'facebook-username-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-username-availability-format-checker',
    name: 'Instagram Username Availability Format Checker',
    slug: 'instagram-username-availability-format-checker',
    category: 'instagram-tools',
    url: '/instagram-username-availability-format-checker',
    description: 'Validate any handle against Instagram formatting rules (FORMAT ONLY, never real availability).',
    longDescription:
      'Avoid frustrating registration errors caused by consecutive periods, trailing dots, or length violations. This tool checks FORMAT ONLY inside your browser—validating Instagram syntax rules (1–30 characters, letters, numbers, underscores, non-consecutive periods). It never checks real live availability on Instagram.',
    keywords: [
      'instagram username availability format checker',
      'instagram handle rules',
      'ig username syntax validator',
      'check instagram username format',
    ],
    icon: 'CheckSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Username Format Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Validates Instagram username syntax rules locally in your browser (FORMAT ONLY, never real live account availability).',
    howTo: [
      {
        title: 'Type a proposed Instagram username',
        description: 'Once active, enter the handle with or without the leading @ symbol.',
      },
      {
        title: 'Check syntax & character rules',
        description: 'Inspect 30-char ceiling, forbidden spaces/symbols, trailing dots, and consecutive periods.',
      },
      {
        title: 'Test live claim directly on Instagram',
        description: 'Remember this tool checks FORMAT ONLY—live claim availability must be checked inside Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Can this tool tell me if an Instagram username is actually available to register?',
        answer: 'No. It checks FORMAT ONLY against Instagram syntax rules and never queries Instagram for real account availability.',
      },
      {
        question: 'What are Instagram’s official username format rules?',
        answer: 'Usernames must be 1–30 characters long using only letters, numbers, periods, and underscores, with no consecutive or trailing periods.',
      },
      {
        question: 'Can it auto-fix invalid spaces or symbols?',
        answer: 'Yes. Try Instagram Username Formatter to clean raw strings automatically.',
      },
      {
        question: 'Does any typed handle leave my device?',
        answer: 'No. Validation runs client-side in your browser.',
      },
    ],
    relatedTools: [
      'instagram-username-formatter',
      'instagram-username-generator',
      'instagram-bio-character-counter',
      'youtube-handle-format-validator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-caption-generator',
    name: 'Instagram Caption Generator',
    slug: 'instagram-caption-generator',
    category: 'instagram-tools',
    url: '/instagram-caption-generator',
    description: 'Assemble clean post captions with hooks, value points, and CTAs using templates (not AI).',
    longDescription:
      'Structure engaging carousel and feed post captions cleanly in seconds. Instagram Caption Generator is strictly template-based inside your browser—NOT AI-written—offering curated story, tip-list, question, and product-launch caption templates with live character and hashtag counting.',
    keywords: ['instagram caption generator', 'ig caption templates', 'caption builder not ai'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Caption Generator builds structured hook, story, and CTA captions from browser templates (NOT AI). Free.',
    howTo: [
      {
        title: 'Select caption style & enter key point',
        description: 'Once live, pick Carousel Tip, Story, Launch, or Question template and add your details.',
      },
      {
        title: 'Apply template structure',
        description: 'Browser templates organize your hook, body spacing, and call-to-action cleanly (NOT AI).',
      },
      {
        title: 'Copy with clean line breaks',
        description: 'Copy directly into Instagram with intact paragraph spacing.',
      },
    ],
    faqs: [
      {
        question: 'Are captions generated by an AI model?',
        answer: 'No. All captions are built deterministically from editable templates and your own inputs—NOT AI-written.',
      },
      {
        question: 'Does it track Instagram’s 2,200-character caption limit?',
        answer: 'Yes. Character count stays visible toward the 2,200-character ceiling and ~125-char "More" cutoff.',
      },
      {
        question: 'Can I attach formatted hashtags at the bottom?',
        answer: 'Yes. Pair with Instagram Hashtag Generator and Line Break Generator.',
      },
      {
        question: 'Does it cost anything or require sign-up?',
        answer: 'No. Free and runs locally in your browser.',
      },
    ],
    relatedTools: [
      'instagram-caption-character-counter',
      'instagram-line-break-generator',
      'instagram-reel-caption-generator',
      'instagram-hashtag-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-hashtag-generator',
    name: 'Instagram Hashtag Generator',
    slug: 'instagram-hashtag-generator',
    category: 'instagram-tools',
    url: '/instagram-hashtag-generator',
    description: 'Combine topic keywords into clean niche Instagram hashtag sets via templates (not AI).',
    longDescription:
      'Build focused hashtag groups for photography, fitness, food, business, and Reels without copying spammy irrelevant tags. Instagram Hashtag Generator is strictly template- and keyword-rule based inside your browser (NOT AI-written), letting you select and copy clean sets within Instagram’s 30-tag cap.',
    keywords: ['instagram hashtag generator', 'ig hashtags template builder', '30 hashtags instagram'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Hashtag Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Hashtag Generator builds clean topic hashtag lists from keyword templates in your browser (NOT AI). Tracks 30-tag cap.',
    howTo: [
      {
        title: 'Enter 1–3 topic keywords',
        description: 'Once active, enter your post subject, niche, or city directly in your browser.',
      },
      {
        title: 'Build from keyword templates',
        description: 'Deterministic templates combine root tags and category modifiers locally (NOT AI).',
      },
      {
        title: 'Pick up to 30 tags & copy',
        description: 'Select focused tags within the 30-tag maximum and copy in one click.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Hashtag Generator use AI?',
        answer: 'No. It uses deterministic keyword templates and tag lists locally in your browser—NOT AI.',
      },
      {
        question: 'Does it prevent exceeding Instagram’s 30-hashtag limit?',
        answer: 'Yes. A live counter tracks selections cleanly up to 30 tags.',
      },
      {
        question: 'Can I blend two separate hashtag lists?',
        answer: 'Yes. Use Instagram Hashtag Mixer to combine and shuffle lists without duplicates.',
      },
      {
        question: 'Is there a fast copy utility for saved sets?',
        answer: 'Yes. Check Instagram Hashtag Copy Tool.',
      },
    ],
    relatedTools: [
      'instagram-hashtag-counter',
      'instagram-hashtag-mixer',
      'instagram-hashtag-copy-tool',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-hashtag-counter',
    name: 'Instagram Hashtag Counter',
    slug: 'instagram-hashtag-counter',
    category: 'instagram-tools',
    url: '/instagram-hashtag-counter',
    description: 'Count #hashtags in captions or comments, flag duplicates, and stay under the 30-tag cap.',
    longDescription:
      'Instagram silently wipes your entire caption if you post more than 30 hashtags. Instagram Hashtag Counter scans your pasted draft locally in your browser, counts unique vs. duplicate #tags, and alerts you cleanly before you hit publish.',
    keywords: ['instagram hashtag counter', '30 hashtag limit checker', 'count ig hashtags'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Hashtag Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Hashtag Counter counts unique #hashtags, removes duplicates, and enforces Instagram’s 30-tag ceiling in your browser.',
    howTo: [
      {
        title: 'Paste your caption or tag block',
        description: 'Once live, paste any caption or hashtag list inside your browser.',
      },
      {
        title: 'Inspect tag count & duplicates',
        description: 'Spot duplicate tags immediately and verify total count against Instagram’s 30-tag max.',
      },
      {
        title: 'Copy deduplicated hashtags',
        description: 'Keep only unique, clean tags ready to paste into your post.',
      },
    ],
    faqs: [
      {
        question: 'What happens if I post 31 hashtags on Instagram?',
        answer: 'Instagram typically rejects the caption and publishes your photo or Reel with a blank caption.',
      },
      {
        question: 'Does this remove duplicate hashtags automatically?',
        answer: 'Yes. One click removes duplicate tags while counting total unique entries.',
      },
      {
        question: 'Does it also count caption characters?',
        answer: 'Pair with Instagram Caption Character Counter for full 2,200-char verification.',
      },
      {
        question: 'Does it upload my text anywhere?',
        answer: 'No. Counting runs strictly locally inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-hashtag-generator',
      'instagram-hashtag-mixer',
      'instagram-caption-character-counter',
      'instagram-hashtag-copy-tool',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-hashtag-mixer',
    name: 'Instagram Hashtag Mixer',
    slug: 'instagram-hashtag-mixer',
    category: 'instagram-tools',
    url: '/instagram-hashtag-mixer',
    description: 'Shuffle, merge, and deduplicate saved hashtag groups into fresh randomized sets under 30 tags.',
    longDescription:
      'Avoid pasting the exact same static block of 30 hashtags on every post. Instagram Hashtag Mixer blends multiple topic buckets locally in your browser, strips duplicates, lets you pick a target count (for example 10, 15, or 25), and outputs a randomized set ready to copy.',
    keywords: ['instagram hashtag mixer', 'shuffle instagram hashtags', 'combine hashtag lists'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Hashtag Mixer — Deduplicate | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Hashtag Mixer merges and shuffles multiple hashtag lists without duplicates locally in your browser.',
    howTo: [
      {
        title: 'Paste 2 or more hashtag lists',
        description: 'Once active, enter small, medium, and niche tag groups into separate boxes.',
      },
      {
        title: 'Choose sample count & shuffle',
        description: 'Deduplicate combined tags and draw a balanced subset locally in your browser.',
      },
      {
        title: 'Copy formatted block',
        description: 'Copy space-separated or dot-padded tags cleanly for your post.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Hashtag Mixer remove duplicate tags across lists?',
        answer: 'Yes. Case-insensitive deduplication strips repeats automatically before sampling.',
      },
      {
        question: 'Can I cap output at 15 or 30 tags?',
        answer: 'Yes. Choose your target count slider cleanly between 3 and 30 hashtags.',
      },
      {
        question: 'Is this powered by AI?',
        answer: 'No. It uses pure browser list randomization and deduplication.',
      },
      {
        question: 'Can I format dots before copying?',
        answer: 'Yes. Pair with Instagram Line Break Generator for dot-spacer formatting.',
      },
    ],
    relatedTools: [
      'instagram-hashtag-copy-tool',
      'instagram-hashtag-counter',
      'instagram-hashtag-generator',
      'instagram-line-break-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-hashtag-copy-tool',
    name: 'Instagram Hashtag Copy Tool',
    slug: 'instagram-hashtag-copy-tool',
    category: 'instagram-tools',
    url: '/instagram-hashtag-copy-tool',
    description: 'Clean, normalize missing # symbols, strip spaces, and copy neat hashtag blocks in one click.',
    longDescription:
      'Got plain keywords or messy comma-separated tags from notes? Instagram Hashtag Copy Tool prefixes missing # symbols, trims invalid characters, removes duplicates, and formats a clean single-line or dot-separated block ready for one-click clipboard copying inside your browser.',
    keywords: ['instagram hashtag copy tool', 'format hashtag block', 'add # to keywords'],
    icon: 'Copy',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Hashtag Copy Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Hashtag Copy Tool cleans comma or space lists into valid #hashtags for instant clipboard copying in your browser.',
    howTo: [
      {
        title: 'Paste keywords or raw tags',
        description: 'Once live, paste comma-separated words or messy hashtags into the box.',
      },
      {
        title: 'Auto-normalize #prefixes',
        description: 'Client-side formatting strips commas, adds missing #, and deduplicates items.',
      },
      {
        title: 'One-click clipboard copy',
        description: 'Verify count under 30 and copy cleanly straight to Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Can it convert comma-separated keywords into #hashtags?',
        answer: 'Yes. Phrases like "street photography, nikon" become #streetphotography #nikon automatically.',
      },
      {
        question: 'Does it add optional dot spacers above the tags?',
        answer: 'Yes. Toggle clean dot line breaks before copying.',
      },
      {
        question: 'Are any pasted lists saved on a server?',
        answer: 'No. Everything processes client-side inside your browser.',
      },
      {
        question: 'How many hashtags can it output cleanly?',
        answer: 'Warns automatically if total unique tags pass 30.',
      },
    ],
    relatedTools: [
      'instagram-hashtag-mixer',
      'instagram-hashtag-counter',
      'instagram-hashtag-generator',
      'instagram-line-break-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-reel-caption-generator',
    name: 'Instagram Reel Caption Generator',
    slug: 'instagram-reel-caption-generator',
    category: 'instagram-tools',
    url: '/instagram-reel-caption-generator',
    description: 'Create punchy Reels captions paired with save/share CTAs using templates (not AI).',
    longDescription:
      'Short-form Reels viewers only read the first line over your video unless a strong prompt makes them tap "more". Instagram Reel Caption Generator is strictly template-based inside your browser—NOT AI-written—combining short curiosity openers with clean Save/Comment CTAs.',
    keywords: ['instagram reel caption generator', 'reels caption templates', 'short ig caption'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Reel Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Reel Caption Generator assembles Reels openers and save/share CTAs using browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter Reel topic & desired action',
        description: 'Once live, enter your clip summary and choose Save, Share, Follow, or Comment CTA.',
      },
      {
        title: 'Apply Reels caption templates',
        description: 'Deterministic templates slot your inputs into short mobile-friendly openers (NOT AI).',
      },
      {
        title: 'Copy directly for Reels upload',
        description: 'Paste clean formatting without awkward text truncation over your Reel.',
      },
    ],
    faqs: [
      {
        question: 'Are Reels captions written by AI?',
        answer: 'No. They are built deterministically inside your browser from structured caption templates—NOT AI-written.',
      },
      {
        question: 'Why are Reels captions formatted shorter than feed captions?',
        answer: 'Only ~55–80 characters display over a playing Reel before viewers tap to expand.',
      },
      {
        question: 'Can I generate matching Reels hooks too?',
        answer: 'Yes. Pair with Instagram Reel Hook Generator.',
      },
      {
        question: 'Is this tool free and private?',
        answer: 'Yes. Runs client-side inside your browser tab.',
      },
    ],
    relatedTools: [
      'instagram-reel-hook-generator',
      'instagram-reel-idea-generator',
      'instagram-reel-cover-maker',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-reel-hook-generator',
    name: 'Instagram Reel Hook Generator',
    slug: 'instagram-reel-hook-generator',
    category: 'instagram-tools',
    url: '/instagram-reel-hook-generator',
    description: 'Format 2-second visual/on-screen Reels opening lines from proven hook templates (not AI).',
    longDescription:
      'Stop the scroll in the first 1.5 seconds with concise on-screen text overlays. Instagram Reel Hook Generator is strictly template-based inside your browser—NOT AI-written—fitting your topic into visual contrast, quick-secret, and step-by-step opening text templates.',
    keywords: ['instagram reel hook generator', 'reels on screen hook templates', 'short video hook'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Reel Hook Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Reel Hook Generator builds short on-screen Reels opening hooks from browser templates (NOT AI). Free.',
    howTo: [
      {
        title: 'Enter niche problem or quick tip',
        description: 'Once active, enter the core mistake, result, or number behind your Reel.',
      },
      {
        title: 'Populate visual hook templates',
        description: 'Browser formulas return punchy 5–9 word overlay prompts cleanly (NOT AI).',
      },
      {
        title: 'Copy for your Reels text overlay',
        description: 'Keep text clear in the 9:16 safe center zone.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Reel Hook Generator use AI?',
        answer: 'No. Every line is built deterministically from reusable hook templates in your browser—NOT AI.',
      },
      {
        question: 'Are hooks kept short enough for 9:16 mobile text overlays?',
        answer: 'Yes. Word-count cues keep overlay headlines brief and scannable.',
      },
      {
        question: 'Can I design a matching 1080x1920 Reel cover?',
        answer: 'Yes. Pair with Instagram Reel Cover Maker.',
      },
      {
        question: 'Is there any account sign-up?',
        answer: 'No. Runs free inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-reel-caption-generator',
      'instagram-reel-idea-generator',
      'instagram-reel-cover-maker',
      'youtube-hook-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-post-idea-generator',
    name: 'Instagram Post Idea Generator',
    slug: 'instagram-post-idea-generator',
    category: 'instagram-tools',
    url: '/instagram-post-idea-generator',
    description: 'Combine your niche topic with proven Carousel and Single-Post templates (not AI).',
    longDescription:
      'Plan saveable educational carousels, checklists, and before/after posts without staring at a blank grid. Instagram Post Idea Generator is strictly template-based inside your browser—NOT AI-written—crossing your subject keywords with proven carousel and static post prompt matrices.',
    keywords: ['instagram post idea generator', 'carousel ideas template', 'ig content ideas not ai'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Post Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Post Idea Generator pairs your niche with proven Carousel and feed post templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your niche topic & goal',
        description: 'Once live, enter your subject and toggle Educate, Inspire, Promote, or Behind-the-Scenes.',
      },
      {
        title: 'Match against post templates',
        description: 'Deterministic template matrices assemble structured Carousel and feed prompts (NOT AI).',
      },
      {
        title: 'Add favorites to your calendar',
        description: 'Copy prompts directly into Instagram Content Calendar Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Post Idea Generator use AI?',
        answer: 'No. All ideas combine your keywords with pre-built editorial templates inside your browser—NOT AI.',
      },
      {
        question: 'Does it include Carousel slide outlines?',
        answer: 'Yes. Many prompts include slide-by-slide cover, point, and CTA structure hints.',
      },
      {
        question: 'Need Reels or Stories prompts instead?',
        answer: 'Check Instagram Reel Idea Generator and Instagram Story Idea Generator.',
      },
      {
        question: 'Are my niche inputs stored online?',
        answer: 'No. Everything runs locally inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-reel-idea-generator',
      'instagram-story-idea-generator',
      'instagram-content-calendar-generator',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-reel-idea-generator',
    name: 'Instagram Reel Idea Generator',
    slug: 'instagram-reel-idea-generator',
    category: 'instagram-tools',
    url: '/instagram-reel-idea-generator',
    description: 'Generate vertical Reels concepts from format & transition templates in your browser (not AI).',
    longDescription:
      'Keep your Reels pipeline consistent with repeatable POV, quick-tutorial, myth-busting, and day-in-the-life structures. Instagram Reel Idea Generator is strictly template-based inside your browser (NOT AI-written)—building practical filming prompts directly from your niche keywords.',
    keywords: ['instagram reel idea generator', 'reels concept templates', 'ig reels prompts'],
    icon: 'Film',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Reel Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Reel Idea Generator formats repeatable 9:16 video filming prompts from browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter your niche & filming style',
        description: 'Once active, enter your topic and select Talking Head, B-Roll Text, or Tutorial style.',
      },
      {
        title: 'Fill Reels prompt templates',
        description: 'Deterministic browser templates pair your topic with shot and pacing prompts (NOT AI).',
      },
      {
        title: 'Pair with a Reel hook & cover',
        description: 'Move straight into Reel Hook Generator and Reel Cover Maker.',
      },
    ],
    faqs: [
      {
        question: 'Are Reel ideas generated by AI?',
        answer: 'No. Suggestions come from structured filming templates and keyword pairing inside your browser—NOT AI.',
      },
      {
        question: 'Can it suggest faceless B-roll Reels templates too?',
        answer: 'Yes. Filtering lets you view B-roll + text-overlay concept templates separately.',
      },
      {
        question: 'What size should my Reel cover be?',
        answer: 'Use 1080x1920 pixels in Instagram Reel Cover Maker.',
      },
      {
        question: 'Is this tool completely free?',
        answer: 'Yes. Free and client-side with zero sign-up.',
      },
    ],
    relatedTools: [
      'instagram-reel-hook-generator',
      'instagram-reel-caption-generator',
      'instagram-post-idea-generator',
      'instagram-reel-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-story-idea-generator',
    name: 'Instagram Story Idea Generator',
    slug: 'instagram-story-idea-generator',
    category: 'instagram-tools',
    url: '/instagram-story-idea-generator',
    description: 'Plan daily interactive Stories with Poll, Slider, Quiz, and Link sticker templates (not AI).',
    longDescription:
      'Turn quiet Story frames into daily conversations using interactive sticker prompts. Instagram Story Idea Generator is strictly template-based inside your browser (NOT AI-written)—giving creators structured Poll, This-or-That, Q&A Box, and Mini-Sequence templates tailored to their topic.',
    keywords: ['instagram story idea generator', 'ig stories poll templates', 'daily story prompts'],
    icon: 'Camera',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Story Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Story Idea Generator creates Poll, Quiz, and Q&A Story sequence templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick your topic & interactive sticker',
        description: 'Once live, enter your subject and filter by Poll, Quiz, Question Box, or Countdown.',
      },
      {
        title: 'Generate multi-frame Story prompts',
        description: 'Browser templates map 3-frame Setup, Sticker, and Payoff prompts locally (NOT AI).',
      },
      {
        title: 'Format 1080x1920 Story graphics',
        description: 'Resize accompanying Story backgrounds cleanly to 1080x1920.',
      },
    ],
    faqs: [
      {
        question: 'Is Instagram Story Idea Generator AI-powered?',
        answer: 'No. It uses deterministic interactive-sticker templates and keyword substitution in your browser—NOT AI.',
      },
      {
        question: 'Does it include interactive Poll and Quiz copy?',
        answer: 'Yes. Templates include ready-to-paste A/B poll labels and quiz prompts.',
      },
      {
        question: 'What dimensions fit full-screen Stories cleanly?',
        answer: '1080x1920 pixels (9:16)—available in Instagram Story Image Resizer.',
      },
      {
        question: 'Are any prompts saved or sent online?',
        answer: 'No. Everything operates locally in your browser.',
      },
    ],
    relatedTools: [
      'instagram-story-image-resizer',
      'instagram-post-idea-generator',
      'instagram-reel-idea-generator',
      'instagram-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-bio-character-counter',
    name: 'Instagram Bio Character Counter',
    slug: 'instagram-bio-character-counter',
    category: 'instagram-tools',
    url: '/instagram-bio-character-counter',
    description: 'Count exact bio characters against Instagram’s 150-character limit and 4-line mobile fold.',
    longDescription:
      'Instagram cuts off profile bios at 150 characters and collapses lines beyond ~4 rows behind "more". Instagram Bio Character Counter counts characters, line breaks, and emoji lengths locally in your browser so your entire bio fits cleanly.',
    keywords: ['instagram bio character counter', 'ig 150 char limit', 'bio length checker'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Bio Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Bio Character Counter verifies your bio against the 150-char limit and line fold locally in your browser.',
    howTo: [
      {
        title: 'Paste or type your Instagram bio',
        description: 'Once active, enter your multi-line bio draft directly inside your browser.',
      },
      {
        title: 'Monitor 150-char & emoji counts',
        description: 'Live counters highlight remaining characters, line count, and mobile "more" cutoff.',
      },
      {
        title: 'Copy trimmed bio text',
        description: 'Paste cleanly into your Instagram profile without truncation.',
      },
    ],
    faqs: [
      {
        question: 'What is Instagram’s maximum bio character limit?',
        answer: 'Instagram strictly caps profile bios at 150 characters, including spaces, emojis, and line breaks.',
      },
      {
        question: 'Do Unicode fancy fonts take more characters?',
        answer: 'Certain Unicode characters and multi-codepoint emojis count differently—checking here catches overflows early.',
      },
      {
        question: 'Need help drafting a bio?',
        answer: 'Try Instagram Bio Generator (template-based, not AI).',
      },
      {
        question: 'Does this run strictly in the browser?',
        answer: 'Yes. Zero uploads or tracking.',
      },
    ],
    relatedTools: [
      'instagram-bio-generator',
      'instagram-caption-character-counter',
      'instagram-line-break-generator',
      'instagram-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-caption-character-counter',
    name: 'Instagram Caption Character Counter',
    slug: 'instagram-caption-character-counter',
    category: 'instagram-tools',
    url: '/instagram-caption-character-counter',
    description: 'Check caption length against the 2,200-character limit, ~125-char preview cutoff, and 30 hashtags.',
    longDescription:
      'Ensure your opening hook lands before the "...more" fold while keeping total text under 2,200 characters and hashtags under 30. Instagram Caption Character Counter validates all three limits simultaneously inside your browser.',
    keywords: ['instagram caption character counter', '2200 char limit instagram', 'caption length checker'],
    icon: 'AlignLeft',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Caption Char Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Caption Character Counter checks the 2,200-char ceiling, 125-char preview fold, and hashtag count in your browser.',
    howTo: [
      {
        title: 'Paste your full post caption',
        description: 'Once live, drop your draft caption and hashtags into the editor.',
      },
      {
        title: 'Check 2,200 chars & 125-char fold',
        description: 'Inspect visible fold preview, line count, remaining characters, and detected #hashtags.',
      },
      {
        title: 'Copy verified caption text',
        description: 'Copy with clean spacing straight into Instagram.',
      },
    ],
    faqs: [
      {
        question: 'What is the maximum length of an Instagram caption?',
        answer: 'Instagram allows up to 2,200 characters total across text, line breaks, and hashtags.',
      },
      {
        question: 'How much text shows before "...more" on feeds?',
        answer: 'Usually roughly the first 100–125 characters before a line break trigger the "...more" button.',
      },
      {
        question: 'Does it count hashtags toward the 30-tag limit too?',
        answer: 'Yes. Hashtags are detected and counted alongside total characters.',
      },
      {
        question: 'Is any draft text uploaded?',
        answer: 'No. Everything runs locally inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-caption-generator',
      'instagram-hashtag-counter',
      'instagram-bio-character-counter',
      'instagram-line-break-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-font-generator',
    name: 'Instagram Font Generator',
    slug: 'instagram-font-generator',
    category: 'instagram-tools',
    url: '/instagram-font-generator',
    description: 'Convert plain text into bold, italic, serif, and script Unicode fonts in your browser (not AI).',
    longDescription:
      'Emphasize key words in your bio or display name without image editing. Instagram Font Generator maps standard ASCII letters onto Unicode Mathematical Alphanumeric symbols inside your browser (template/character-mapping only, NOT AI) for instant copy-and-paste styling.',
    keywords: ['instagram font generator', 'unicode fonts for instagram', 'bold italic ig bio font'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Font Generator — Unicode | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Font Generator converts text to bold, italic, and script Unicode styles via character mapping in your browser (NOT AI).',
    howTo: [
      {
        title: 'Type your text or bio line',
        description: 'Once live, enter plain text inside your browser.',
      },
      {
        title: 'Preview Unicode font styles',
        description: 'Deterministic character tables map letters into Serif Bold, Sans Italic, Script, and Monospace (NOT AI).',
      },
      {
        title: 'Copy & paste into Instagram',
        description: 'Click any style to copy Unicode characters straight into bios or captions.',
      },
    ],
    faqs: [
      {
        question: 'How do custom Instagram fonts work if Instagram has one UI font?',
        answer: 'They map standard characters to genuine Unicode glyphs defined in international character standards—no AI involved.',
      },
      {
        question: 'Are Unicode styled fonts accessible everywhere?',
        answer: 'Use styled text sparingly for short headings because screen readers read some mathematical Unicode blocks letter by letter.',
      },
      {
        question: 'Does this tool track what I type?',
        answer: 'No. Mapping runs locally in JavaScript inside your browser.',
      },
      {
        question: 'Want decorative borders and frames too?',
        answer: 'Check Instagram Stylish Text Generator.',
      },
    ],
    relatedTools: [
      'instagram-stylish-text-generator',
      'instagram-text-formatter',
      'instagram-bio-generator',
      'facebook-font-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-stylish-text-generator',
    name: 'Instagram Stylish Text Generator',
    slug: 'instagram-stylish-text-generator',
    category: 'instagram-tools',
    url: '/instagram-stylish-text-generator',
    description: 'Decorate headlines with Unicode fonts, brackets, and divider templates in your browser (not AI).',
    longDescription:
      'Make callout quotes, story highlights labels, and bio headers stand out cleanly. Instagram Stylish Text Generator uses deterministic Unicode character mappings and typographic frame templates in your browser (NOT AI) with one-click copying.',
    keywords: ['instagram stylish text generator', 'ig text decorator', 'fancy text instagram'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Stylish Text Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Stylish Text Generator combines Unicode styling and symbol frame templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter short heading or quote',
        description: 'Once active, type the word or phrase you want decorated.',
      },
      {
        title: 'Pick font & divider template',
        description: 'Apply deterministic Unicode styles, wide spacing, and clean bracket borders (NOT AI).',
      },
      {
        title: 'Copy into bio or highlight name',
        description: 'Paste straight into Instagram profiles, Reels captions, or comments.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Stylish Text Generator use AI?',
        answer: 'No. It uses fixed Unicode character maps and decorative border templates locally in your browser.',
      },
      {
        question: 'Will styled text stay legible across iOS and Android?',
        answer: 'Presets prioritize widely supported Unicode blocks so characters avoid turning into blank boxes.',
      },
      {
        question: 'Can I count characters after styling?',
        answer: 'Yes. Paste styled bios into Instagram Bio Character Counter.',
      },
      {
        question: 'Need clean plain formatting without decorations?',
        answer: 'Use Instagram Text Formatter.',
      },
    ],
    relatedTools: [
      'instagram-font-generator',
      'instagram-text-formatter',
      'instagram-line-break-generator',
      'facebook-stylish-text-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-text-formatter',
    name: 'Instagram Text Formatter',
    slug: 'instagram-text-formatter',
    category: 'instagram-tools',
    url: '/instagram-text-formatter',
    description: 'Clean up pasted captions with consistent spacing, bullets, case formatting, and bold accents.',
    longDescription:
      'Writing captions in Docs or Notes often introduces weird indentation or collapsed blank lines when pasted into Instagram. Instagram Text Formatter normalizes bullet lists, strips double spaces, optionally highlights key phrases, and preserves line breaks inside your browser.',
    keywords: ['instagram text formatter', 'clean ig caption formatting', 'bullet list instagram'],
    icon: 'WrapText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Text Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Text Formatter cleans spacing, bullet points, case styles, and blank lines for clean pasting in your browser.',
    howTo: [
      {
        title: 'Paste messy draft text',
        description: 'Once live, paste draft notes or rich-text copy inside your browser.',
      },
      {
        title: 'Format bullets & spacing',
        description: 'Normalize smart bullets, line breaks, and optional bold subheadings cleanly.',
      },
      {
        title: 'Copy formatted caption',
        description: 'Transfer intact spacing directly into Instagram.',
      },
    ],
    faqs: [
      {
        question: 'How does Instagram Text Formatter preserve blank lines?',
        answer: 'It cleans trailing spaces and inserts standard invisible spacing where needed so Instagram retains paragraph breaks.',
      },
      {
        question: 'Can it convert hyphen lists into clean bullet points?',
        answer: 'Yes. Standard bullets (•, —, 1.) align cleanly across mobile screens.',
      },
      {
        question: 'Need pure blank-line spacing insertion?',
        answer: 'Use Instagram Line Break Generator.',
      },
      {
        question: 'Is draft text sent anywhere?',
        answer: 'No. Formatting runs locally inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-line-break-generator',
      'instagram-font-generator',
      'instagram-caption-character-counter',
      'facebook-text-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-line-break-generator',
    name: 'Instagram Line Break Generator',
    slug: 'instagram-line-break-generator',
    category: 'instagram-tools',
    url: '/instagram-line-break-generator',
    description: 'Preserve invisible blank lines in Instagram captions and bios using formula spacing (not AI).',
    longDescription:
      'Stop Instagram from collapsing your carefully spaced paragraphs into one unreadable wall of text. Instagram Line Break Generator uses deterministic Unicode spacing templates inside your browser (NOT AI) so blank lines in your caption or bio stay intact when copied.',
    keywords: ['instagram line break generator', 'blank lines ig caption', 'ig space spacer'],
    icon: 'WrapText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Line Break Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Line Break Generator inserts reliable blank-line spacing via templates in your browser (NOT AI). Zero uploads.',
    howTo: [
      {
        title: 'Paste your caption or bio',
        description: 'Once active, enter paragraphs separated by blank lines.',
      },
      {
        title: 'Apply blank-line conversion',
        description: 'Client-side spacing rules trim trailing spaces and insert safe invisible spacers (NOT AI).',
      },
      {
        title: 'Copy into Instagram app',
        description: 'Paste straight into your post or bio with intact breathing room.',
      },
    ],
    faqs: [
      {
        question: 'Why does Instagram strip blank lines when you paste text?',
        answer: 'Trailing spaces before Enter or unsupported whitespace often cause mobile apps to collapse empty lines—trimming and clean invisible spacers fix that.',
      },
      {
        question: 'Does Instagram Line Break Generator use AI?',
        answer: 'No. It uses simple deterministic text transformation rules in your browser.',
      },
      {
        question: 'Does it work for both bios and captions?',
        answer: 'Yes. Outputs preserve spacing across both Instagram bios and post captions.',
      },
      {
        question: 'Can I count characters simultaneously?',
        answer: 'Yes. Live character counters stay visible toward 150-char bio and 2,200-char caption caps.',
      },
    ],
    relatedTools: [
      'instagram-text-formatter',
      'instagram-caption-character-counter',
      'instagram-bio-character-counter',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-comment-generator',
    name: 'Instagram Comment Generator',
    slug: 'instagram-comment-generator',
    category: 'instagram-tools',
    url: '/instagram-comment-generator',
    description: 'Draft thoughtful community comments and pinned prompts from editable templates (not AI).',
    longDescription:
      'Stay consistent when engaging with peers or seeding a pinned comment under your own post. Instagram Comment Generator is strictly template-based inside your browser—NOT AI-written—offering customizable appreciation, question, and follow-up comment templates.',
    keywords: ['instagram comment generator', 'pinned comment ig template', 'ig comment ideas'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Comment Generator fills customizable engagement comment templates locally in your browser (NOT AI).',
    howTo: [
      {
        title: 'Pick comment type & topic',
        description: 'Once live, choose Pinned Creator Prompt, Peer Compliment, or Q&A Follow-Up template.',
      },
      {
        title: 'Customize placeholders cleanly',
        description: 'Browser templates slot in your specific detail locally (NOT AI).',
      },
      {
        title: 'Copy & personalize before posting',
        description: 'Review to make sure it sounds authentic and post natively in Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Comment Generator use AI or auto-comment bots?',
        answer: 'No. It uses editable browser templates ONLY (NOT AI) and never automates or posts comments to Instagram.',
      },
      {
        question: 'Can it help write pinned first comments under Reels?',
        answer: 'Yes. Includes dedicated creator pinned-question templates.',
      },
      {
        question: 'Need templates for answering commenters?',
        answer: 'Use Instagram Reply Generator.',
      },
      {
        question: 'Are typed details stored anywhere?',
        answer: 'No. Runs client-side inside your browser.',
      },
    ],
    relatedTools: [
      'instagram-reply-generator',
      'instagram-dm-generator',
      'instagram-random-comment-picker',
      'facebook-comment-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-reply-generator',
    name: 'Instagram Reply Generator',
    slug: 'instagram-reply-generator',
    category: 'instagram-tools',
    url: '/instagram-reply-generator',
    description: 'Organize fast, polite FAQ, pricing, and thank-you comment replies via templates (not AI).',
    longDescription:
      'Answer recurring "Where is this link?" and customer support comments cleanly without retyping from scratch. Instagram Reply Generator is strictly template-based inside your browser (NOT AI-written)—letting creators prepare consistent Saved Reply snippets cleanly.',
    keywords: ['instagram reply generator', 'ig comment reply templates', 'faq reply snippets'],
    icon: 'Reply',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Reply Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Reply Generator organizes thank-you, link, and FAQ comment replies via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Select reply scenario',
        description: 'Once active, choose Link Request, Thank You, Customer Support, or Collab Inquiry template.',
      },
      {
        title: 'Fill personalized variables',
        description: 'Slot in name, product handle, or bio link text cleanly (NOT AI).',
      },
      {
        title: 'Copy reply into Instagram',
        description: 'Copy fast, consistent responses directly into comments or Saved Replies.',
      },
    ],
    faqs: [
      {
        question: 'Are replies written by AI?',
        answer: 'No. All replies come from customizable fill-in-the-blank templates in your browser—NOT AI.',
      },
      {
        question: 'Does this connect to my Instagram inbox?',
        answer: 'No. It runs privately offline in your browser with zero Instagram credentials required.',
      },
      {
        question: 'Want direct-message outreach templates too?',
        answer: 'Check Instagram DM Generator.',
      },
      {
        question: 'Is it free without daily limits?',
        answer: 'Yes.',
      },
    ],
    relatedTools: [
      'instagram-dm-generator',
      'instagram-comment-generator',
      'facebook-reply-generator',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-dm-generator',
    name: 'Instagram DM Generator',
    slug: 'instagram-dm-generator',
    category: 'instagram-tools',
    url: '/instagram-dm-generator',
    description: 'Draft welcome, collaboration, and order-support DM scripts using templates (not AI).',
    longDescription:
      'Prepare respectful, clear direct messages for brand collaborations, podcast pitches, or new-follower welcomes. Instagram DM Generator is strictly template-based inside your browser (NOT AI-written)—building concise scripts ready to personalize and paste manually.',
    keywords: ['instagram dm generator', 'ig dm outreach templates', 'collab dm script'],
    icon: 'Send',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram DM Generator — Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram DM Generator builds collab, welcome, and support DM templates inside your browser (NOT AI). Never auto-sends.',
    howTo: [
      {
        title: 'Pick DM template category',
        description: 'Once live, choose Brand Collab, Welcome Message, Event Invite, or Support Update.',
      },
      {
        title: 'Customize sender & offer details',
        description: 'Editable placeholders format a polite, concise message locally (NOT AI).',
      },
      {
        title: 'Copy & send manually',
        description: 'Review the message in your own voice before sending inside Instagram DMs.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram DM Generator use AI or send bulk automated DMs?',
        answer: 'No. It uses editable browser templates ONLY (NOT AI) and cannot access Instagram or send automated messages.',
      },
      {
        question: 'Are DMs formatted short enough for mobile previews?',
        answer: 'Yes. Templates keep messages under 2–3 brief paragraphs for easy mobile reading.',
      },
      {
        question: 'Can I save or reuse templates?',
        answer: 'Copy generated scripts into your Instagram Quick Replies settings anytime.',
      },
      {
        question: 'Is there a Facebook equivalent?',
        answer: 'Yes—check Facebook DM Generator.',
      },
    ],
    relatedTools: [
      'instagram-reply-generator',
      'instagram-comment-generator',
      'facebook-dm-generator',
      'instagram-bio-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-engagement-rate-calculator',
    name: 'Instagram Engagement Rate Calculator',
    slug: 'instagram-engagement-rate-calculator',
    category: 'instagram-tools',
    url: '/instagram-engagement-rate-calculator',
    description: 'Calculate Instagram engagement rate % from followers, likes, comments, saves, and shares.',
    longDescription:
      'Evaluate post or creator campaign performance with transparent math. Instagram Engagement Rate Calculator computes standard ER by Followers ((Likes + Comments + Saves + Shares) ÷ Followers × 100) and optional ER by Reach locally in your browser from numbers you enter.',
    keywords: ['instagram engagement rate calculator', 'ig engagement formula', 'er calculator'],
    icon: 'TrendingUp',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Engagement Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Engagement Rate Calculator computes ER by followers or reach locally in your browser from entered metrics.',
    howTo: [
      {
        title: 'Enter follower count & post metrics',
        description: 'Once active, enter followers (or reach), average likes, comments, saves, and shares.',
      },
      {
        title: 'Calculate exact engagement %',
        description: 'Browser formulas return overall engagement percentage and interaction breakdowns.',
      },
      {
        title: 'Compare across recent posts',
        description: 'Benchmark Reels vs. Carousels cleanly.',
      },
    ],
    faqs: [
      {
        question: 'Does it connect to Instagram to scrape public profiles?',
        answer: 'No. You enter follower and interaction numbers manually; calculations run strictly locally in your browser.',
      },
      {
        question: 'Which formulas are supported?',
        answer: 'Both Engagement Rate by Followers (ERR) and Engagement Rate by Reach (when reach is supplied).',
      },
      {
        question: 'Should saves and shares be included?',
        answer: 'Yes—optional Saves and Shares fields give a fuller picture of Carousel and Reel performance.',
      },
      {
        question: 'Can I project future follower milestones too?',
        answer: 'Use Instagram Follower Growth Calculator.',
      },
    ],
    relatedTools: [
      'instagram-follower-growth-calculator',
      'facebook-engagement-rate-calculator',
      'youtube-engagement-rate-calculator',
      'instagram-best-posting-time-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-follower-growth-calculator',
    name: 'Instagram Follower Growth Calculator',
    slug: 'instagram-follower-growth-calculator',
    category: 'instagram-tools',
    url: '/instagram-follower-growth-calculator',
    description: 'Project Instagram follower milestones (1K, 10K, 50K, 100K) from daily or monthly growth.',
    longDescription:
      'See how long it takes to cross 1K, 10K, or 100K followers at your current daily net growth rate. Instagram Follower Growth Calculator runs transparent linear and percentage-compounding growth math inside your browser from the counts you supply.',
    keywords: ['instagram follower growth calculator', 'ig milestone estimator', 'follower projection'],
    icon: 'Users',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Follower Growth Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Follower Growth Calculator projects milestone dates for 1K, 10K, and 100K followers locally in your browser.',
    howTo: [
      {
        title: 'Enter current followers & net gain',
        description: 'Once live, input current followers, target goal, and average daily or weekly net growth.',
      },
      {
        title: 'Model growth timelines',
        description: 'Browser formulas output days needed and target milestone dates under steady or compound rates.',
      },
      {
        title: 'Test pacing scenarios',
        description: 'Compare different posting frequencies effortlessly.',
      },
    ],
    faqs: [
      {
        question: 'Does this tool track real Instagram accounts automatically?',
        answer: 'No. Calculations depend strictly on the numbers you type in inside your browser.',
      },
      {
        question: 'Can it calculate negative churn or net growth?',
        answer: 'Yes—net daily or monthly followers accounts for gains minus unfollows.',
      },
      {
        question: 'Are milestone timelines guaranteed?',
        answer: 'No. Real account growth varies with content reach, seasonality, and Reels spikes.',
      },
      {
        question: 'Can I check engagement rate alongside growth?',
        answer: 'Yes—pair with Instagram Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'instagram-engagement-rate-calculator',
      'facebook-follower-growth-calculator',
      'youtube-subscriber-goal-calculator',
      'instagram-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-giveaway-winner-picker',
    name: 'Instagram Giveaway Winner Picker',
    slug: 'instagram-giveaway-winner-picker',
    category: 'instagram-tools',
    url: '/instagram-giveaway-winner-picker',
    description: 'Draw fair random winners strictly from giveaway entrant names you paste in your browser.',
    longDescription:
      'Run transparent community giveaways without sketchy third-party logins. Instagram Giveaway Winner Picker works ONLY from names or comment entries you paste into your browser—it cannot connect to Instagram or fetch real entrants/comments automatically—and uses cryptographic browser randomness (`crypto.getRandomValues`) to pick winners and backup alternates.',
    keywords: ['instagram giveaway winner picker', 'paste names giveaway picker', 'ig contest winner'],
    icon: 'Trophy',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Giveaway Winner Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Giveaway Winner Picker draws fair random winners ONLY from pasted entrant names in your browser (cannot fetch live IG data).',
    howTo: [
      {
        title: 'Paste entrant names or usernames',
        description: 'Once active, paste one entrant per line into the browser—this tool cannot fetch live Instagram comments.',
      },
      {
        title: 'Configure deduplication & winner count',
        description: 'Choose number of winners, backup alternates, and whether duplicate entries are allowed.',
      },
      {
        title: 'Draw fair random winners locally',
        description: 'Web Crypto randomness selects winners transparently on screen.',
      },
    ],
    faqs: [
      {
        question: 'Can Instagram Giveaway Winner Picker fetch comments directly from an Instagram URL?',
        answer: 'No. It works ONLY from names or comments that you paste manually—it cannot log into Instagram or fetch real entrants/comments.',
      },
      {
        question: 'Can I pick 1st place plus backup runners-up?',
        answer: 'Yes. Selecting multiple non-repeating winners and backup alternates is built in.',
      },
      {
        question: 'Can it filter duplicate usernames from the pasted list?',
        answer: 'Yes. Toggle one-entry-per-username deduplication cleanly before drawing.',
      },
      {
        question: 'Is entrant data kept private?',
        answer: 'Yes. Everything stays strictly inside your browser tab.',
      },
    ],
    relatedTools: [
      'instagram-random-comment-picker',
      'facebook-giveaway-winner-picker',
      'facebook-random-comment-picker',
      'instagram-comment-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-random-comment-picker',
    name: 'Instagram Random Comment Picker',
    slug: 'instagram-random-comment-picker',
    category: 'instagram-tools',
    url: '/instagram-random-comment-picker',
    description: 'Pick random winning comments strictly from the comment list you paste in your browser.',
    longDescription:
      'Select a winner from Q&A prompts or post giveaways privately without sharing Instagram account passwords. Instagram Random Comment Picker works ONLY from comments you paste manually—it cannot fetch real comments from Instagram URLs—picking unbiased winners locally via Web Crypto.',
    keywords: ['instagram random comment picker', 'pasted comment picker', 'random ig comment draw'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Random Comment Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Random Comment Picker draws unbiased winners ONLY from pasted comments in your browser (cannot fetch live IG comments).',
    howTo: [
      {
        title: 'Paste copied comment entries',
        description: 'Once live, paste comments or handles into the text box—it cannot fetch live Instagram comments.',
      },
      {
        title: 'Filter keywords or duplicates',
        description: 'Optionally require a keyword (e.g. a trivia answer) or remove duplicate lines.',
      },
      {
        title: 'Draw random winning comments',
        description: 'Pick one or multiple random comments cleanly inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch real comments from an Instagram post link?',
        answer: 'No. It works ONLY from comments that you paste into the tool—it cannot connect to Instagram or fetch real comments.',
      },
      {
        question: 'Why require pasting instead of Instagram OAuth?',
        answer: 'Pasting keeps giveaways 100% browser-based with zero account permissions, API tokens, or login risks.',
      },
      {
        question: 'Can I filter entries containing a required word or @mention?',
        answer: 'Yes. Simple client-side text filters let you narrow eligible pasted entries.',
      },
      {
        question: 'Is there a giveaway picker for Facebook comments too?',
        answer: 'Yes—check Facebook Random Comment Picker.',
      },
    ],
    relatedTools: [
      'instagram-giveaway-winner-picker',
      'facebook-random-comment-picker',
      'facebook-giveaway-winner-picker',
      'instagram-reply-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-image-resizer',
    name: 'Instagram Image Resizer',
    slug: 'instagram-image-resizer',
    category: 'instagram-tools',
    url: '/instagram-image-resizer',
    description: 'Resize photos cleanly to 1080x1080 Square, 1080x1350 Portrait, or 1080x1920 Stories/Reels.',
    longDescription:
      'Prepare crisp feed graphics without Instagram blurring or cropping off important borders. Instagram Image Resizer scales and frames JPG, PNG, and WebP files up to 20 MB inside your browser to exact 1080x1080 (1:1), 1080x1350 (4:5), or 1080x1920 (9:16) specs with zero watermarks.',
    keywords: ['instagram image resizer', '1080x1080 resizer', '1080x1350 portrait ig', '1080x1920 story size'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Image Resizer — 1080px | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Image Resizer formats photos to 1080x1080, 1080x1350, or 1080x1920 locally in your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Choose your image file',
        description: 'Once active, select a JPG, PNG, or WebP photo up to 20 MB in your browser.',
      },
      {
        title: 'Pick 1080x1080, 1080x1350, or 1080x1920',
        description: 'Select Square feed, 4:5 Portrait feed, or 9:16 Stories/Reels framing with crop or background fit.',
      },
      {
        title: 'Save clean resized photo',
        description: 'Download unwatermarked artwork ready for crisp Instagram uploads.',
      },
    ],
    faqs: [
      {
        question: 'Which exact Instagram dimensions are supported?',
        answer: 'Includes presets for 1080x1080 (1:1 Square), 1080x1350 (4:5 Portrait), and 1080x1920 (9:16 Stories & Reels).',
      },
      {
        question: 'Will Instagram Image Resizer add a watermark?',
        answer: 'No. Downloads are completely unwatermarked.',
      },
      {
        question: 'Can I keep the whole photo without cropping edges?',
        answer: 'Yes. Choosing Pad/Fit mode adds clean white, black, or blurred margins instead of cropping.',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'Accepts JPG, PNG, and WebP images up to 20 MB locally in your browser.',
      },
    ],
    relatedTools: [
      'instagram-image-compressor',
      'instagram-square-image-cropper',
      'instagram-story-image-resizer',
      'instagram-reel-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-image-compressor',
    name: 'Instagram Image Compressor',
    slug: 'instagram-image-compressor',
    category: 'instagram-tools',
    url: '/instagram-image-compressor',
    description: 'Optimize high-res photos before Instagram upload to avoid aggressive app compression artifacts.',
    longDescription:
      'Uploading massive 18 MB raw JPEGs forces Instagram’s mobile servers to aggressively re-encode them. Instagram Image Compressor optimizes JPG, PNG, and WebP images up to 20 MB locally in your browser into lightweight, clean sRGB files with zero watermarks.',
    keywords: ['instagram image compressor', 'optimize photo for instagram', 'prevent ig blur'],
    icon: 'Minimize',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Image Compressor | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Image Compressor reduces photo bloat up to 20 MB cleanly in your browser for sharper Instagram uploads. No watermark.',
    howTo: [
      {
        title: 'Load your high-res photo',
        description: 'Once live, open a JPG, PNG, or WebP file up to 20 MB directly inside your browser.',
      },
      {
        title: 'Adjust target size & sharpness',
        description: 'Preview balanced JPEG quality and sRGB output without heavy band artifacts.',
      },
      {
        title: 'Download clean, unwatermarked file',
        description: 'Save the optimized photo locally before uploading to Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Image Compressor add any watermark?',
        answer: 'No. Outputs carry zero watermarks.',
      },
      {
        question: 'Why pre-compress images before uploading to Instagram?',
        answer: 'Pre-sizing width to 1080px and keeping JPEG weight reasonable reduces Instagram’s aggressive server-side downsampling.',
      },
      {
        question: 'Does compression happen locally in the browser?',
        answer: 'Yes. Pixel processing uses HTML5 Canvas strictly on your device.',
      },
      {
        question: 'Should I resize dimensions first?',
        answer: 'Yes—try Instagram Image Resizer to lock exact 1080px dimensions first.',
      },
    ],
    relatedTools: [
      'instagram-image-resizer',
      'instagram-square-image-cropper',
      'facebook-image-compressor',
      'compress-image',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-square-image-cropper',
    name: 'Instagram Square Image Cropper',
    slug: 'instagram-square-image-cropper',
    category: 'instagram-tools',
    url: '/instagram-square-image-cropper',
    description: 'Crop any photo into an exact 1:1 (1080x1080) Instagram square frame in your browser.',
    longDescription:
      'Frame product shots, portraits, and Carousel tiles into symmetrical 1:1 squares ready for grid aesthetics. Instagram Square Image Cropper lets you drag, pan, and crop JPG, PNG, and WebP photos up to 20 MB into sharp 1080x1080 square files locally with zero watermarks.',
    keywords: ['instagram square image cropper', '1:1 square crop ig', 'crop 1080x1080'],
    icon: 'Crop',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Square Image Cropper | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Square Image Cropper frames photos into sharp 1:1 (1080x1080) squares locally in your browser. Zero watermark.',
    howTo: [
      {
        title: 'Open any photo in your browser',
        description: 'Once live, pick a JPG, PNG, or WebP file up to 20 MB.',
      },
      {
        title: 'Position the 1:1 square crop box',
        description: 'Drag the locked 1:1 frame over your subject—or toggle square white-border padding.',
      },
      {
        title: 'Save clean 1080x1080 square',
        description: 'Download an unwatermarked square photo ready for feed posts.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Square Image Cropper add watermarks?',
        answer: 'No. Output downloads have zero watermarks.',
      },
      {
        question: 'Can I preview how multiple squares look on a 3-column grid?',
        answer: 'Yes—check Instagram Grid Preview Maker.',
      },
      {
        question: 'What output resolution is exported?',
        answer: 'Standard 1080x1080 pixels (1:1 aspect ratio), or native square crop.',
      },
      {
        question: 'Is any photo uploaded to external servers?',
        answer: 'No. Cropping runs client-side in your browser.',
      },
    ],
    relatedTools: [
      'instagram-image-resizer',
      'instagram-grid-preview-maker',
      'crop-image',
      'instagram-story-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-story-image-resizer',
    name: 'Instagram Story Image Resizer',
    slug: 'instagram-story-image-resizer',
    category: 'instagram-tools',
    url: '/instagram-story-image-resizer',
    description: 'Resize and pad horizontal or square photos into full 1080x1920 9:16 Story frames.',
    longDescription:
      'Stop Instagram Stories from awkwardly zooming into landscape product photos or cutting off faces. Instagram Story Image Resizer fits JPG, PNG, and WebP files up to 20 MB into full 1080x1920 9:16 frames with clean safe-zone guides and custom backdrop colors—zero watermarks.',
    keywords: ['instagram story image resizer', '1080x1920 story resizer', '9:16 story photo'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Story Image Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Story Image Resizer turns any image into crisp 1080x1920 (9:16) Stories artwork in your browser. No watermark.',
    howTo: [
      {
        title: 'Load your photo',
        description: 'Once active, pick a JPG, PNG, or WebP photo up to 20 MB inside your browser.',
      },
      {
        title: 'Choose 1080x1920 crop or padded fit',
        description: 'Verify top/bottom Story UI safe zones and choose solid or blurred background fill.',
      },
      {
        title: 'Save clean 1080x1920 PNG/JPG',
        description: 'Download unwatermarked vertical artwork ready for Instagram Stories.',
      },
    ],
    faqs: [
      {
        question: 'What exact dimensions does Instagram Story Image Resizer output?',
        answer: 'Exports crisp 1080x1920 pixels (9:16 vertical aspect ratio).',
      },
      {
        question: 'Does it show safe-zone guides for the top username and bottom reply bar?',
        answer: 'Yes. Optional overlay guides prevent important text from being covered by Story UI elements.',
      },
      {
        question: 'Will resized Story graphics have a watermark?',
        answer: 'No. Zero watermarks.',
      },
      {
        question: 'Is everything handled inside my browser?',
        answer: 'Yes. Canvas resizing happens locally without uploading your photos.',
      },
    ],
    relatedTools: [
      'instagram-reel-cover-maker',
      'instagram-image-resizer',
      'instagram-story-idea-generator',
      'facebook-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-reel-cover-maker',
    name: 'Instagram Reel Cover Maker',
    slug: 'instagram-reel-cover-maker',
    category: 'instagram-tools',
    url: '/instagram-reel-cover-maker',
    description: 'Design 1080x1920 Reel cover images with both 9:16 full view and 1:1 profile-grid crop guides.',
    longDescription:
      'A great Reel cover must look balanced in full 1080x1920 Reels feeds AND avoid clipped titles when cropped to 1:1 or 3:4 on your profile grid. Instagram Reel Cover Maker lets you frame local images up to 20 MB, preview safe profile-grid zones, and export unwatermarked 1080x1920 covers in your browser.',
    keywords: ['instagram reel cover maker', '1080x1920 reel cover', 'reel cover safe zone'],
    icon: 'Camera',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Reel Cover Maker — 1080x1920 | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Reel Cover Maker frames 1080x1920 covers with profile-grid crop guides locally in your browser. No watermark.',
    howTo: [
      {
        title: 'Choose cover image & add title overlay',
        description: 'Once active, load a JPG, PNG, or WebP photo up to 20 MB in your browser.',
      },
      {
        title: 'Check center grid safe zone',
        description: 'Verify your headline sits cleanly inside the center square/vertical grid crop.',
      },
      {
        title: 'Export unwatermarked 1080x1920 cover',
        description: 'Download crisp JPG/PNG artwork ready to set as your Reel Cover.',
      },
    ],
    faqs: [
      {
        question: 'What size is an Instagram Reel Cover?',
        answer: 'Reels covers use 1080x1920 pixels (9:16), while your profile tab crops the center section for grid thumbnails.',
      },
      {
        question: 'Will exported Reel covers carry a watermark?',
        answer: 'No. Downloads are completely unwatermarked.',
      },
      {
        question: 'Can I preview how the cover fits next to older profile posts?',
        answer: 'Yes—use Instagram Grid Preview Maker.',
      },
      {
        question: 'Does this run locally in my browser?',
        answer: 'Yes. All canvas rendering happens strictly client-side.',
      },
    ],
    relatedTools: [
      'instagram-grid-preview-maker',
      'instagram-story-image-resizer',
      'instagram-reel-hook-generator',
      'facebook-reel-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-grid-preview-maker',
    name: 'Instagram Grid Preview Maker',
    slug: 'instagram-grid-preview-maker',
    category: 'instagram-tools',
    url: '/instagram-grid-preview-maker',
    description: 'Preview and reorder up to 12 planned photos in a 3-column Instagram profile grid locally.',
    longDescription:
      'Check color balance, row alignment, and Reel-cover spacing before publishing posts one by one. Instagram Grid Preview Maker lets you load up to 12 local images (20 MB each) inside your browser, drag tiles to test sequence order, and toggle 1:1 or 3:4 grid aspect ratio.',
    keywords: ['instagram grid preview maker', 'ig feed planner grid', '3 column grid preview'],
    icon: 'Grid3x3',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 12,
    processingMethod: 'browser',
    seoTitle: `Instagram Grid Preview Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Grid Preview Maker lets you arrange up to 12 local photos in a 3-column feed simulator inside your browser.',
    howTo: [
      {
        title: 'Select planned post images',
        description: 'Once live, load up to 12 JPG, PNG, or WebP files (20 MB each) locally.',
      },
      {
        title: 'Drag & reorder grid tiles',
        description: 'Swap tile positions and toggle square 1:1 vs. 3:4 profile grid layout.',
      },
      {
        title: 'Review cohesive look',
        description: 'Spot color clashes cleanly before uploading to Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Grid Preview Maker log into my Instagram account?',
        answer: 'No. You preview strictly from local images selected in your browser without connecting any Instagram account.',
      },
      {
        question: 'How many tiles can I arrange at once?',
        answer: 'Up to 12 images per grid board (up to 20 MB per image).',
      },
      {
        question: 'Can I extract a cohesive color palette from my grid photos?',
        answer: 'Yes. Try Instagram Color Palette Extractor.',
      },
      {
        question: 'Are my draft photos uploaded anywhere?',
        answer: 'No. Previews render using local browser object URLs only.',
      },
    ],
    relatedTools: [
      'instagram-color-palette-extractor',
      'instagram-square-image-cropper',
      'instagram-reel-cover-maker',
      'instagram-image-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-color-palette-extractor',
    name: 'Instagram Color Palette Extractor',
    slug: 'instagram-color-palette-extractor',
    category: 'instagram-tools',
    url: '/instagram-color-palette-extractor',
    description: 'Pull dominant HEX and RGB brand color swatches from any photo locally in your browser.',
    longDescription:
      'Keep Stories, Carousels, and Highlights visually cohesive by sampling exact colors from photography or brand artwork. Instagram Color Palette Extractor inspects local JPG, PNG, or WebP files up to 20 MB inside your browser and outputs copyable HEX and RGB swatches.',
    keywords: ['instagram color palette extractor', 'extract hex from ig photo', 'brand palette tool'],
    icon: 'Palette',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Color Palette Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Color Palette Extractor samples dominant HEX and RGB color swatches from images locally in your browser.',
    howTo: [
      {
        title: 'Select a photo from your device',
        description: 'Once active, choose any JPG, PNG, or WebP file up to 20 MB in your browser.',
      },
      {
        title: 'Inspect extracted color swatches',
        description: 'Client-side quantization identifies primary, accent, and neutral tones.',
      },
      {
        title: 'Copy HEX & RGB codes',
        description: 'Use exact color codes in Canva, Figma, or Instagram Story color pickers.',
      },
    ],
    faqs: [
      {
        question: 'Which color formats are exported?',
        answer: 'HEX and RGB values for each dominant swatch, copyable in one click.',
      },
      {
        question: 'Can I extract a PNG palette card?',
        answer: 'Yes—click Download Swatch Card PNG to export an unwatermarked palette card.',
      },
      {
        question: 'Does this upload my brand photos?',
        answer: 'No. Pixel quantization runs locally via HTML5 Canvas.',
      },
      {
        question: 'Can I plan matching typography alongside colors?',
        answer: 'Yes—check Instagram Font Pairing Generator.',
      },
    ],
    relatedTools: [
      'instagram-grid-preview-maker',
      'instagram-font-pairing-generator',
      'youtube-thumbnail-color-extractor',
      'instagram-reel-cover-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-font-pairing-generator',
    name: 'Instagram Font Pairing Generator',
    slug: 'instagram-font-pairing-generator',
    category: 'instagram-tools',
    url: '/instagram-font-pairing-generator',
    description: 'Browse curated Carousel headline and body font pairing templates in your browser (not AI).',
    longDescription:
      'Design clean Carousel slides and Reel covers with balanced contrast between display headings and readable body type. Instagram Font Pairing Generator uses curated editorial typography templates inside your browser (NOT AI) so you can preview custom sample text across Modern, Editorial, Minimal, and Bold pairings.',
    keywords: ['instagram font pairing generator', 'carousel font combos', 'story typography guide'],
    icon: 'Type',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Font Pairing Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Font Pairing Generator lets you preview curated display + body typography templates in your browser (NOT AI).',
    howTo: [
      {
        title: 'Enter sample headline & body text',
        description: 'Once live, enter your Carousel slide heading and short subtitle in the browser.',
      },
      {
        title: 'Filter aesthetic mood templates',
        description: 'Compare curated Minimal, Editorial Serif, Geometric Sans, and Bold pairings (NOT AI).',
      },
      {
        title: 'Note font names & copy pairing specs',
        description: 'Copy font family names and recommended size ratios for your design tool.',
      },
    ],
    faqs: [
      {
        question: 'Does Instagram Font Pairing Generator use AI?',
        answer: 'No. Pairings come from a curated typographic matrix and interactive preview templates inside your browser—NOT AI.',
      },
      {
        question: 'Are suggested fonts free to use in Canva or Figma?',
        answer: 'Yes. Curated pairings prioritize widely available Google Fonts and standard design-app typefaces.',
      },
      {
        question: 'Looking for copy-paste Unicode fonts for bios instead?',
        answer: 'Use Instagram Font Generator.',
      },
      {
        question: 'Can I pair typography with photo colors?',
        answer: 'Yes—check Instagram Color Palette Extractor.',
      },
    ],
    relatedTools: [
      'instagram-font-generator',
      'instagram-color-palette-extractor',
      'instagram-reel-cover-maker',
      'instagram-grid-preview-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-content-calendar-generator',
    name: 'Instagram Content Calendar Generator',
    slug: 'instagram-content-calendar-generator',
    category: 'instagram-tools',
    url: '/instagram-content-calendar-generator',
    description: 'Create an editable weekly Reels, Carousel, and Stories schedule from templates (not AI).',
    longDescription:
      'Organize an intentional publishing rhythm across Reels, Carousels, and Stories without building spreadsheets from scratch. Instagram Content Calendar Generator uses deterministic date formulas and pillar templates inside your browser (NOT AI-written) with clean CSV export.',
    keywords: ['instagram content calendar generator', 'ig posting schedule template', 'reels carousel planner'],
    icon: 'Calendar',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Content Calendar Tool | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Content Calendar Generator builds weekly Reels, Carousel, and Story schedules using formulas in your browser (NOT AI).',
    howTo: [
      {
        title: 'Set frequency & content pillars',
        description: 'Once active, choose weekly upload days, start date, and up to 4 recurring themes.',
      },
      {
        title: 'Generate balanced schedule template',
        description: 'Date formulas map Reels, Carousels, and Stories across weeks automatically (NOT AI).',
      },
      {
        title: 'Edit slots & export CSV',
        description: 'Fill in your specific post notes and download a clean CSV schedule.',
      },
    ],
    faqs: [
      {
        question: 'Does Content Calendar Generator generate posts with AI?',
        answer: 'No. It uses deterministic calendar date formulas and format rotation templates inside your browser—NOT AI.',
      },
      {
        question: 'Does it export directly to Instagram?',
        answer: 'No. You export your schedule as CSV or copy it—no automated Instagram posting.',
      },
      {
        question: 'Can I combine this with posting time windows?',
        answer: 'Yes—check Instagram Best Posting Time Planner.',
      },
      {
        question: 'Is there a Facebook planner too?',
        answer: 'Yes—use Facebook Content Calendar Generator.',
      },
    ],
    relatedTools: [
      'instagram-best-posting-time-planner',
      'instagram-post-idea-generator',
      'instagram-reel-idea-generator',
      'facebook-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-best-posting-time-planner',
    name: 'Instagram Best Posting Time Planner',
    slug: 'instagram-best-posting-time-planner',
    category: 'instagram-tools',
    url: '/instagram-best-posting-time-planner',
    description: 'Map suggested posting slots from general benchmarks plus your audience timezone inputs.',
    longDescription:
      'Coordinate uploads when followers in your target cities are actually awake. Instagram Best Posting Time Planner combines general engagement-window benchmarks with your own audience timezone and working-hours inputs inside your browser—it cannot connect to Instagram or fetch real account analytics.',
    keywords: ['instagram best posting time planner', 'when to post on instagram timezone', 'ig schedule helper'],
    icon: 'Clock',
    acceptedFormats: ['Interactive'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Posting Time Planner | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Best Posting Time Planner pairs general engagement benchmarks with your audience timezone inputs (no real analytics).',
    howTo: [
      {
        title: 'Select creator & audience timezones',
        description: 'Once live, set your local timezone, primary audience region, and niche industry.',
      },
      {
        title: 'Convert generic windows locally',
        description: 'Browser logic converts benchmark peak windows into your exact local publishing times.',
      },
      {
        title: 'Add chosen slots to your calendar',
        description: 'Keep testing against your real Instagram Insights inside the app.',
      },
    ],
    faqs: [
      {
        question: 'Can this planner fetch my real Instagram Insights follower activity?',
        answer: 'No. It uses general industry benchmark windows plus the timezone and schedule inputs you enter—it cannot access real Instagram analytics.',
      },
      {
        question: 'Why convert audience timezones manually?',
        answer: 'If you live in Europe and target US readers, converting peak morning and evening hours prevents midnight posting mistakes.',
      },
      {
        question: 'Does it schedule posts automatically?',
        answer: 'No. It is a planning reference only inside your browser.',
      },
      {
        question: 'Can I export a weekly posting plan?',
        answer: 'Pair with Instagram Content Calendar Generator.',
      },
    ],
    relatedTools: [
      'instagram-content-calendar-generator',
      'instagram-engagement-rate-calculator',
      'facebook-post-scheduler-planner',
      'instagram-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-username-formatter',
    name: 'Instagram Username Formatter',
    slug: 'instagram-username-formatter',
    category: 'instagram-tools',
    url: '/instagram-username-formatter',
    description: 'Clean raw business names into compliant lowercase, dot, and underscore Instagram handles.',
    longDescription:
      'Got a brand name with uppercase letters, spaces, hyphens, or emojis that Instagram rejects as a username? Instagram Username Formatter transforms raw strings inside your browser into clean, 30-char compliant handle variations using dots or underscores.',
    keywords: ['instagram username formatter', 'clean ig handle', 'strip spaces instagram username'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Instagram Username Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Username Formatter cleans uppercase letters, hyphens, and spaces into valid Instagram handle syntax in your browser.',
    howTo: [
      {
        title: 'Enter raw brand or display name',
        description: 'Once active, type or paste any business or personal name into your browser.',
      },
      {
        title: 'Auto-clean disallowed characters',
        description: 'Client-side rules lowercase text, replace hyphens or spaces cleanly, and trim at 30 characters.',
      },
      {
        title: 'Copy clean formatted handle',
        description: 'Pick dot, underscore, or joined variants ready to check inside Instagram.',
      },
    ],
    faqs: [
      {
        question: 'Why does Instagram reject hyphens in usernames?',
        answer: 'Instagram handles allow only letters, numbers, periods (.), and underscores (_)—never hyphens (-).',
      },
      {
        question: 'Does formatting verify real username availability?',
        answer: 'No. Like our Format Checker, it strictly validates and formats handle syntax locally.',
      },
      {
        question: 'Can it batch format multiple handle drafts?',
        answer: 'Yes. Line-by-line normalization is supported.',
      },
      {
        question: 'Are typed names stored online?',
        answer: 'No. Everything stays in your browser.',
      },
    ],
    relatedTools: [
      'instagram-username-availability-format-checker',
      'instagram-username-generator',
      'instagram-bio-generator',
      'facebook-username-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'instagram-screenshot-mockup-generator',
    name: 'Instagram Screenshot Mockup Generator',
    slug: 'instagram-screenshot-mockup-generator',
    category: 'instagram-tools',
    url: '/instagram-screenshot-mockup-generator',
    description: 'Compose clean presentation mockups of Instagram feed posts from layout templates (not AI).',
    longDescription:
      'Showcase portfolio social campaigns cleanly inside client pitch decks or case studies. Instagram Screenshot Mockup Generator arranges your local post image (up to 20 MB), typed handle, caption, and light/dark card framing using an editable browser mockup template (NOT AI) with unwatermarked PNG export.',
    keywords: ['instagram screenshot mockup generator', 'ig post mockup template', 'client pitch mockup'],
    icon: 'Camera',
    acceptedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Instagram Mockup Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Instagram Screenshot Mockup Generator builds presentation post frames from templates in your browser (NOT AI). No watermark.',
    howTo: [
      {
        title: 'Add handle, caption & local post image',
        description: 'Once live, enter sample profile details and select a local JPG, PNG, or WebP up to 20 MB.',
      },
      {
        title: 'Adjust card layout template',
        description: 'Toggle light/dark frame, header elements, and aspect framing locally in your browser (NOT AI).',
      },
      {
        title: 'Download PNG presentation card',
        description: 'Export an unwatermarked mockup PNG for portfolios or slide decks.',
      },
    ],
    faqs: [
      {
        question: 'Is Instagram Screenshot Mockup Generator AI-powered?',
        answer: 'No. It uses a clean HTML/Canvas layout template in your browser—NOT AI.',
      },
      {
        question: 'Does exported mockup artwork carry a watermark?',
        answer: 'No. PNG exports are completely unwatermarked.',
      },
      {
        question: 'Does this fetch data from real Instagram posts?',
        answer: 'No. You supply your own text and local image file solely for design mockups.',
      },
      {
        question: 'Is there a Facebook post mockup tool too?',
        answer: 'Yes—check Facebook Post Preview Generator.',
      },
    ],
    relatedTools: [
      'facebook-post-preview-generator',
      'instagram-image-resizer',
      'instagram-grid-preview-maker',
      'instagram-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
] as const;
