import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const LINKEDIN_TOOLS: readonly Tool[] = [
  {
    id: 'linkedin-caption-generator',
    name: 'LinkedIn Caption Generator',
    slug: 'linkedin-caption-generator',
    category: 'linkedin-tools',
    url: '/linkedin-caption-generator',
    description: 'Build clear LinkedIn post openers and captions from structured templates (not AI).',
    longDescription:
      'Turn project updates, lessons learned, or industry news into readable LinkedIn posts with clear line breaks and a closing question. LinkedIn Caption Generator runs strictly on editable browser templates (NOT AI-written) with zero social login required.',
    keywords: ['linkedin caption generator', 'linkedin post templates', 'professional post builder not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Caption Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draft structured LinkedIn post captions using editable browser templates (NOT AI). No LinkedIn login required.',
    howTo: [
      {
        title: 'Enter topic, key takeaway & CTA',
        description: 'Fill in your core professional insight, brief example, and ending question.',
      },
      {
        title: 'Choose a caption template',
        description: 'Browser presets format crisp 2-line hooks, bullet points, and scannable spacing (NOT AI).',
      },
      {
        title: 'Check character count & copy',
        description: 'Stay neatly inside LinkedIn’s 3,000-character limit and paste without signing in.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Caption Generator use AI?',
        answer: 'No. Captions are assembled strictly from fill-in editorial templates inside your browser—NOT AI.',
      },
      {
        question: 'Do I need to connect my LinkedIn account?',
        answer: 'No. None of these tools require any social login.',
      },
      {
        question: 'How long can a LinkedIn post be?',
        answer: 'Standard LinkedIn posts allow up to 3,000 characters, with the first ~210 characters visible above "See more".',
      },
      {
        question: 'Are outputs watermarked or rate-limited?',
        answer: 'No. Outputs are plain text ready to copy cleanly.',
      },
    ],
    relatedTools: [
      'linkedin-post-character-counter',
      'linkedin-content-idea-generator',
      'linkedin-hashtag-counter',
      'linkedin-reply-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-username-generator',
    name: 'LinkedIn Username Generator',
    slug: 'linkedin-username-generator',
    category: 'linkedin-tools',
    url: '/linkedin-username-generator',
    description: 'Create clean LinkedIn custom /in/ handle options via deterministic rules & templates (not AI).',
    longDescription:
      'Generate crisp, recruiter-friendly custom URL handles from your first name, last name, credentials, or industry specialty. Runs locally in your browser using separator rules and templates—NOT AI and no LinkedIn login needed.',
    keywords: ['linkedin username generator', 'custom linkedin handle', 'linkedin vanity url ideas not ai'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Username Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build clean LinkedIn /in/ handle ideas from your name and specialty using browser rules and templates (NOT AI).',
    howTo: [
      {
        title: 'Enter name & role keyword',
        description: 'Input first name, last name, and optional discipline or credential.',
      },
      {
        title: 'Generate slug templates',
        description: 'Deterministic rules format clean lowercase hyphenated and compact handle ideas (NOT AI).',
      },
      {
        title: 'Format & test on LinkedIn',
        description: 'Finalize slug hygiene in LinkedIn Profile URL Formatter before claiming in LinkedIn Settings.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Username Generator use AI?',
        answer: 'No. It uses deterministic name-and-keyword combination templates inside your browser—NOT AI.',
      },
      {
        question: 'Does this check whether a LinkedIn custom URL is available?',
        answer: 'No. Check live availability inside your LinkedIn Public Profile Settings.',
      },
      {
        question: 'What characters are valid in LinkedIn custom URLs?',
        answer: 'LinkedIn allows 3–100 letters, numbers, and hyphens without spaces or symbols.',
      },
      {
        question: 'Does it require signing into LinkedIn?',
        answer: 'No. Runs 100% locally in your browser.',
      },
    ],
    relatedTools: [
      'linkedin-profile-url-formatter',
      'linkedin-profile-optimization-checklist',
      'linkedin-caption-generator',
      'linkedin-connection-message-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-profile-url-formatter',
    name: 'LinkedIn Profile URL Formatter',
    slug: 'linkedin-profile-url-formatter',
    category: 'linkedin-tools',
    url: '/linkedin-profile-url-formatter',
    description: 'Clean messy LinkedIn profile URLs, strip tracking parameters, and validate custom /in/ slugs.',
    longDescription:
      'Remove ugly ?trk= query strings, mobile share parameters, and trailing random characters from LinkedIn links before adding them to resumes, email signatures, or portfolios. Pure browser formatting with zero account access.',
    keywords: ['linkedin profile url formatter', 'clean linkedin link', 'strip linkedin tracking params'],
    icon: 'Link2',
    acceptedFormats: ['Text', 'URL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Profile URL Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Clean tracking queries and format resume-ready https://www.linkedin.com/in/ handles locally in your browser.',
    howTo: [
      {
        title: 'Paste any LinkedIn profile URL',
        description: 'Paste a copied profile URL with tracking strings or raw handle text.',
      },
      {
        title: 'Clean & normalize format',
        description: 'Browser logic strips tracking query params and normalizes https://www.linkedin.com/in/... syntax.',
      },
      {
        title: 'Copy resume-ready link',
        description: 'Copy clean short URL or Markdown link directly to your CV or portfolio.',
      },
    ],
    faqs: [
      {
        question: 'Does this change my live URL on LinkedIn?',
        answer: 'No. It formats clean shareable URLs and checks slug syntax—edit your vanity slug inside LinkedIn Settings.',
      },
      {
        question: 'Why strip query parameters from LinkedIn links?',
        answer: 'Copied share links often include long tracking tokens that clutter resumes and cover letters.',
      },
      {
        question: 'Does this send my link anywhere?',
        answer: 'No. URL parsing runs instantaneously inside your browser tab.',
      },
      {
        question: 'Need a cleaner vanity handle first?',
        answer: 'Yes. Try LinkedIn Username Generator.',
      },
    ],
    relatedTools: [
      'linkedin-username-generator',
      'linkedin-profile-optimization-checklist',
      'linkedin-job-application-message-generator',
      'linkedin-experience-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-profile-picture-resizer',
    name: 'LinkedIn Profile Picture Resizer',
    slug: 'linkedin-profile-picture-resizer',
    category: 'linkedin-tools',
    url: '/linkedin-profile-picture-resizer',
    description: 'Resize and circle-preview LinkedIn profile headshots to exact 400x400 specs—no watermark.',
    longDescription:
      'Prepare sharp, well-centered LinkedIn headshots before uploading. Resize JPG, PNG, or WEBP photos up to 20 MB to LinkedIn’s recommended 400x400 pixel square with a live circular crop preview inside your browser—zero uploads and zero watermarks.',
    keywords: ['linkedin profile picture resizer', '400x400 linkedin headshot', 'linkedin dp resizer no watermark'],
    icon: 'CircleUserRound',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Profile Picture Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize LinkedIn headshots to exact 400x400 pixels with circle-crop preview locally in browser. Zero watermarks.',
    howTo: [
      {
        title: 'Choose headshot photo (max 20 MB)',
        description: 'Load a JPG, PNG, or WEBP portrait directly inside your browser.',
      },
      {
        title: 'Frame inside 400x400 circle guide',
        description: 'Pan and zoom with a circular overlay matching LinkedIn’s profile avatar crop.',
      },
      {
        title: 'Download clean 400x400 image',
        description: 'Save sharp output instantaneously with zero watermarks or logins.',
      },
    ],
    faqs: [
      {
        question: 'What size does LinkedIn Profile Picture Resizer export?',
        answer: 'Exact 400x400 pixels (1:1 square), LinkedIn’s standard crisp headshot specification.',
      },
      {
        question: 'Will my headshot have a watermark?',
        answer: 'No. Every LinkedIn tool exports completely clean images with zero watermarks.',
      },
      {
        question: 'Does this upload my photo to any server?',
        answer: 'No. Resizing runs locally in your browser up to 20 MB per photo.',
      },
      {
        question: 'Can I size my LinkedIn cover banner too?',
        answer: 'Yes. Use LinkedIn Banner Maker or LinkedIn Banner Resizer (1584x396).',
      },
    ],
    relatedTools: [
      'linkedin-banner-maker',
      'linkedin-banner-resizer',
      'linkedin-post-image-resizer',
      'linkedin-profile-optimization-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-banner-maker',
    name: 'LinkedIn Banner Maker',
    slug: 'linkedin-banner-maker',
    category: 'linkedin-tools',
    url: '/linkedin-banner-maker',
    description: 'Design 1584x396 LinkedIn profile banners with avatar safe-zones in browser—no watermark.',
    longDescription:
      'Build a clean 1584x396 personal header banner that frames your headline, role, or brand colors clearly without getting covered by LinkedIn’s bottom-left profile avatar. Compose locally from images up to 20 MB—no watermark and no LinkedIn login.',
    keywords: ['linkedin banner maker', '1584x396 linkedin banner', 'linkedin header creator no watermark'],
    icon: 'LayoutTemplate',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Banner Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create 1584x396 LinkedIn cover banners with desktop/mobile avatar safe-zone guides in your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Pick color or background photo',
        description: 'Pick a solid theme or load a JPG, PNG, or WEBP background up to 20 MB.',
      },
      {
        title: 'Align text inside safe zones',
        description: 'Guides show the bottom-left avatar overlap zone across desktop and mobile crops.',
      },
      {
        title: 'Export clean 1584x396 banner',
        description: 'Download crisp PNG or JPG artwork with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What are LinkedIn’s recommended banner dimensions?',
        answer: '1584x396 pixels (4:1 aspect ratio) for crisp desktop and mobile header display.',
      },
      {
        question: 'Why does safe-zone placement matter on LinkedIn banners?',
        answer: 'Your profile circle overlaps the bottom-left area differently on mobile vs desktop screens.',
      },
      {
        question: 'Is there any watermark on exported banners?',
        answer: 'No. Every LinkedIn tool produces 100% unwatermarked exports.',
      },
      {
        question: 'Already have artwork you just need to fit to 1584x396?',
        answer: 'Use LinkedIn Banner Resizer.',
      },
    ],
    relatedTools: [
      'linkedin-banner-resizer',
      'linkedin-profile-picture-resizer',
      'linkedin-post-image-resizer',
      'linkedin-profile-optimization-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-banner-resizer',
    name: 'LinkedIn Banner Resizer',
    slug: 'linkedin-banner-resizer',
    category: 'linkedin-tools',
    url: '/linkedin-banner-resizer',
    description: 'Resize existing header graphics cleanly to LinkedIn’s 1584x396 banner spec—no watermark.',
    longDescription:
      'Fit any wide photo, slide, or brand graphic cleanly to LinkedIn’s 1584x396 personal cover dimensions without stretching faces or clipping logos. Runs completely client-side up to 20 MB with zero watermarks.',
    keywords: ['linkedin banner resizer', 'resize 1584x396', 'linkedin background photo resizer'],
    icon: 'Maximize2',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Banner Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize background images to exact 1584x396 LinkedIn banner specs locally in your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Select image (max 20 MB)',
        description: 'Open your JPG, PNG, or WEBP background image in the browser.',
      },
      {
        title: 'Adjust 1584x396 crop window',
        description: 'Drag crop framing and check avatar overlap overlay before exporting.',
      },
      {
        title: 'Download clean 1584x396 file',
        description: 'Save resized banner output without watermarks or uploads.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Banner Resizer add a watermark?',
        answer: 'No. All exports are completely clean and unwatermarked.',
      },
      {
        question: 'What dimensions does it output?',
        answer: 'Standard 1584x396 pixels (with an optional 1128x191 company page cover preset).',
      },
      {
        question: 'Do images leave my device?',
        answer: 'No. Canvas resizing stays inside your browser tab.',
      },
      {
        question: 'What is the file size limit?',
        answer: 'Up to 20 MB per image.',
      },
    ],
    relatedTools: [
      'linkedin-banner-maker',
      'linkedin-profile-picture-resizer',
      'linkedin-post-image-resizer',
      'linkedin-carousel-maker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-post-image-resizer',
    name: 'LinkedIn Post Image Resizer',
    slug: 'linkedin-post-image-resizer',
    category: 'linkedin-tools',
    url: '/linkedin-post-image-resizer',
    description: 'Resize LinkedIn feed photos and link cards to exact 1200x627 (plus 1080x1080) —no watermark.',
    longDescription:
      'Stop awkward feed cropping on shared charts, screenshots, and link previews. Resize JPG, PNG, or WEBP images up to 20 MB to LinkedIn’s landscape 1200x627 (1.91:1) or square 1080x1080 post specs directly in your browser with zero watermarks.',
    keywords: ['linkedin post image resizer', '1200x627 linkedin image', 'resize photo for linkedin feed'],
    icon: 'Image',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Post Image Resizer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Resize images to exact 1200x627 (1.91:1) and 1080x1080 LinkedIn feed dimensions in your browser. Zero watermarks.',
    howTo: [
      {
        title: 'Load feed graphic (max 20 MB)',
        description: 'Choose a JPG, PNG, or WEBP file locally.',
      },
      {
        title: 'Choose 1200x627 or 1080x1080',
        description: 'Pick landscape link-card (1200x627) or crisp square (1080x1080) with cover crop or padding.',
      },
      {
        title: 'Download unwatermarked output',
        description: 'Save ready-to-post artwork locally with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'What size works best for LinkedIn single post images?',
        answer: '1200x627 pixels (1.91:1) is standard for link/landscape shares, while 1080x1080 works cleanly for square visuals.',
      },
      {
        question: 'Is any watermark placed on resized images?',
        answer: 'No. Every LinkedIn tool exports 100% clean, unwatermarked files.',
      },
      {
        question: 'Are files uploaded to external servers?',
        answer: 'No. Processing happens privately in your browser.',
      },
      {
        question: 'Need multi-slide swipeable PDF carousels?',
        answer: 'Yes. Open LinkedIn Carousel Maker or LinkedIn Carousel PDF Generator.',
      },
    ],
    relatedTools: [
      'linkedin-carousel-maker',
      'linkedin-carousel-pdf-generator',
      'linkedin-banner-resizer',
      'linkedin-profile-picture-resizer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-carousel-maker',
    name: 'LinkedIn Carousel Maker',
    slug: 'linkedin-carousel-maker',
    category: 'linkedin-tools',
    url: '/linkedin-carousel-maker',
    description: 'Compose multi-slide 1080x1080 or 1080x1350 LinkedIn carousel templates in browser—no watermark.',
    longDescription:
      'Design swipeable LinkedIn educational decks with consistent headers, slide numbers, brand colors, and visual alignment directly in your browser. Supports slide images up to 20 MB each (max 20 slides)—no AI and zero watermarks.',
    keywords: ['linkedin carousel maker', '1080x1350 linkedin slides', 'swipeable linkedin deck no watermark'],
    icon: 'Layers',
    acceptedFormats: ['JPG', 'PNG', 'WEBP', 'Text'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Carousel Maker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Design clean 1080x1080 and 1080x1350 LinkedIn carousel slides inside your browser. Zero uploads and zero watermarks.',
    howTo: [
      {
        title: 'Pick 1080x1080 or 1080x1350 deck layout',
        description: 'Choose square or portrait 4:5 dimensions and set brand colors locally.',
      },
      {
        title: 'Add slide text & images',
        description: 'Populate cover, body tips, and closing CTA slides (up to 20 slides, max 20 MB per image).',
      },
      {
        title: 'Export slides or PDF',
        description: 'Download crisp PNG slides or bundle straight into LinkedIn Carousel PDF Generator.',
      },
    ],
    faqs: [
      {
        question: 'How do carousels work natively on LinkedIn?',
        answer: 'LinkedIn renders uploaded multi-page PDFs natively as swipeable document carousels in the feed.',
      },
      {
        question: 'Will exported slides carry a watermark?',
        answer: 'No. All LinkedIn carousel outputs are completely unwatermarked.',
      },
      {
        question: 'Does this write carousel slides using AI?',
        answer: 'No. It provides structured slide layout templates—you enter your own insights.',
      },
      {
        question: 'Want to pack existing PNG/JPG slides into one PDF?',
        answer: 'Use LinkedIn Carousel PDF Generator.',
      },
    ],
    relatedTools: [
      'linkedin-carousel-pdf-generator',
      'linkedin-post-image-resizer',
      'linkedin-caption-generator',
      'linkedin-content-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-carousel-pdf-generator',
    name: 'LinkedIn Carousel PDF Generator',
    slug: 'linkedin-carousel-pdf-generator',
    category: 'linkedin-tools',
    url: '/linkedin-carousel-pdf-generator',
    description: 'Bundle JPG, PNG & WEBP slides into a LinkedIn carousel PDF locally via templates (not AI).',
    longDescription:
      'LinkedIn document carousels require a clean multi-page PDF. Combine ordered slide images (up to 20 files, 20 MB max per image) or template cover/CTA cards into one crisp PDF inside your browser—NOT AI, zero server uploads, and zero watermarks.',
    keywords: ['linkedin carousel pdf generator', 'images to linkedin pdf', 'document carousel builder not ai'],
    icon: 'FilePlus2',
    acceptedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSizeMB: 20,
    maxFiles: 20,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Carousel PDF Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Package ordered slides into a crisp LinkedIn document carousel PDF in your browser (NOT AI, zero watermarks).',
    howTo: [
      {
        title: 'Select ordered slide images',
        description: 'Add up to 20 JPG, PNG, or WEBP slides (max 20 MB each) in your browser.',
      },
      {
        title: 'Uniform size & template check',
        description: 'Standardize page dimensions (1080x1080 or 1080x1350) using deterministic layout rules (NOT AI).',
      },
      {
        title: 'Download ready PDF',
        description: 'Save a single clean PDF file ready to attach as a LinkedIn Document post—zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Carousel PDF Generator use AI?',
        answer: 'No. It packages your ordered images and optional template slide sizes strictly in your browser—NOT AI.',
      },
      {
        question: 'Are generated carousel PDFs watermarked?',
        answer: 'No. Your PDF is 100% unwatermarked.',
      },
      {
        question: 'What limits apply?',
        answer: 'Up to 20 slide images per carousel, max 20 MB per image.',
      },
      {
        question: 'Do I need to sign into LinkedIn here?',
        answer: 'No. Upload the downloaded PDF directly inside LinkedIn when posting.',
      },
    ],
    relatedTools: [
      'linkedin-carousel-maker',
      'linkedin-post-image-resizer',
      'jpg-to-pdf',
      'merge-pdf',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-content-idea-generator',
    name: 'LinkedIn Content Idea Generator',
    slug: 'linkedin-content-idea-generator',
    category: 'linkedin-tools',
    url: '/linkedin-content-idea-generator',
    description: 'Generate B2B & career post prompts from structured topic templates in browser (not AI).',
    longDescription:
      'Never run dry on weekly LinkedIn posts. Combine your industry, role, and target audience with repeatable thought-leadership formats (lessons learned, case study breakdown, hiring tip, framework comparison) using browser templates—NOT AI.',
    keywords: ['linkedin content idea generator', 'b2b post prompts', 'linkedin topic templates not ai'],
    icon: 'BookOpen',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Content Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Turn your role and industry into repeatable LinkedIn post prompts via local browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter role & core topic',
        description: 'Input your discipline, client problem, or recent milestone.',
      },
      {
        title: 'Apply B2B post templates',
        description: 'Browser rules generate actionable prompt cards across tutorial, contrarian, and reflection angles (NOT AI).',
      },
      {
        title: 'Move favorites into a schedule',
        description: 'Plan weekly slots inside LinkedIn Content Calendar Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Content Idea Generator use AI?',
        answer: 'No. Prompts come strictly from curated editorial templates combined with your inputs—NOT AI.',
      },
      {
        question: 'Is this useful for both job seekers and founders?',
        answer: 'Yes. Toggle prompt sets between Career/Job Search, Founder/Build-in-Public, and B2B Specialist.',
      },
      {
        question: 'Does this require a LinkedIn login?',
        answer: 'No. Everything runs locally in your browser.',
      },
      {
        question: 'Can I turn an idea into a draft caption?',
        answer: 'Yes. Open LinkedIn Caption Generator.',
      },
    ],
    relatedTools: [
      'linkedin-caption-generator',
      'linkedin-content-calendar-generator',
      'linkedin-carousel-maker',
      'linkedin-post-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-comment-generator',
    name: 'LinkedIn Comment Generator',
    slug: 'linkedin-comment-generator',
    category: 'linkedin-tools',
    url: '/linkedin-comment-generator',
    description: 'Draft thoughtful LinkedIn networking comments via structured templates (not AI).',
    longDescription:
      'Add constructive value on colleagues’ and industry peers’ posts instead of generic one-word reactions. LinkedIn Comment Generator formats experience-backed agree, add-on, and follow-up question templates inside your browser—NOT AI.',
    keywords: ['linkedin comment generator', 'networking comment templates', 'thoughtful linkedin comments not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Comment Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build constructive LinkedIn comment starters from structured templates in your browser (NOT AI). Zero login needed.',
    howTo: [
      {
        title: 'Select comment angle',
        description: 'Pick constructive addition, specific praise, question, or shared example.',
      },
      {
        title: 'Fill topic & point',
        description: 'Templates combine your concrete point with natural opening phrasing (NOT AI).',
      },
      {
        title: 'Copy & personalize manually',
        description: 'Review and tailor your wording before commenting on LinkedIn.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Comment Generator use AI?',
        answer: 'No. It provides fill-in networking comment templates in your browser—NOT AI.',
      },
      {
        question: 'Does this auto-comment or connect to LinkedIn?',
        answer: 'No. None of these tools log into LinkedIn or post automatically.',
      },
      {
        question: 'Why avoid AI-sounding comments on LinkedIn?',
        answer: 'Authentic personal perspective builds genuine credibility and avoids spam-like replies.',
      },
      {
        question: 'Need replies to people commenting on your own posts?',
        answer: 'Yes. Try LinkedIn Reply Generator.',
      },
    ],
    relatedTools: [
      'linkedin-reply-generator',
      'linkedin-connection-message-generator',
      'linkedin-cold-dm-generator',
      'linkedin-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-reply-generator',
    name: 'LinkedIn Reply Generator',
    slug: 'linkedin-reply-generator',
    category: 'linkedin-tools',
    url: '/linkedin-reply-generator',
    description: 'Organize clear, polite replies to LinkedIn post comments using templates (not AI).',
    longDescription:
      'Keep conversations active in your own comment section without losing track of common questions. LinkedIn Reply Generator formats appreciative, clarifying, and resource-sharing reply templates inside your browser—NOT AI.',
    keywords: ['linkedin reply generator', 'comment reply templates', 'linkedin creator replies not ai'],
    icon: 'Reply',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Reply Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Assemble professional LinkedIn comment replies from editable browser templates (NOT AI). Zero social login needed.',
    howTo: [
      {
        title: 'Pick reply tone & goal',
        description: 'Choose follow-up question, thank-you, resource pointer, or polite clarification.',
      },
      {
        title: 'Customize editable template',
        description: 'Insert commenter name or answer details cleanly in browser templates (NOT AI).',
      },
      {
        title: 'Copy & reply on LinkedIn',
        description: 'Paste your tailored reply manually inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Reply Generator use AI?',
        answer: 'No. Every reply comes from structured editable templates inside your browser—NOT AI.',
      },
      {
        question: 'Does this connect to my LinkedIn notifications?',
        answer: 'No. Zero LinkedIn account login or API connection is used.',
      },
      {
        question: 'Can I write cold outreach notes too?',
        answer: 'Yes. Open LinkedIn Connection Message Generator or LinkedIn Cold DM Generator.',
      },
      {
        question: 'Is this free?',
        answer: 'Yes. 100% free with zero fees or watermarks.',
      },
    ],
    relatedTools: [
      'linkedin-comment-generator',
      'linkedin-connection-message-generator',
      'linkedin-cold-dm-generator',
      'linkedin-caption-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-connection-message-generator',
    name: 'LinkedIn Connection Message Generator',
    slug: 'linkedin-connection-message-generator',
    category: 'linkedin-tools',
    url: '/linkedin-connection-message-generator',
    description: 'Craft 300-character LinkedIn connection request notes via clean templates (not AI).',
    longDescription:
      'Never send a blank invite when a concise context note opens doors. LinkedIn Connection Message Generator populates personalized alumni, recruiter, event-peer, and industry intro templates strictly inside LinkedIn’s 300-character invite limit—NOT AI.',
    keywords: ['linkedin connection message generator', '300 char invite note', 'networking request template not ai'],
    icon: 'UserCheck',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Connection Message Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Write concise 300-character LinkedIn connection invite notes using browser templates (NOT AI). Zero login required.',
    howTo: [
      {
        title: 'Choose connection context',
        description: 'Select recruiter, hiring manager, conference peer, alumni, or content admirer.',
      },
      {
        title: 'Fill name & shared point',
        description: 'Templates merge shared company, post, or event context within 300 characters (NOT AI).',
      },
      {
        title: 'Copy within 300-char cap',
        description: 'Verify live count under 300 characters and paste into LinkedIn’s "Add a note" box.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Connection Message Generator use AI?',
        answer: 'No. It uses concise fill-in outreach templates locally in your browser—NOT AI.',
      },
      {
        question: 'What is LinkedIn’s character cap for connection request notes?',
        answer: 'Standard personalized connection notes allow up to 300 characters (some free accounts cap at 200 characters—a toggle lets you target either).',
      },
      {
        question: 'Does it connect to my LinkedIn account?',
        answer: 'No. Zero LinkedIn authentication is needed.',
      },
      {
        question: 'Need longer follow-up messages after accepting?',
        answer: 'Yes. Try LinkedIn Cold DM Generator or LinkedIn Job Application Message Generator.',
      },
    ],
    relatedTools: [
      'linkedin-cold-dm-generator',
      'linkedin-job-application-message-generator',
      'linkedin-reply-generator',
      'linkedin-profile-url-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-cold-dm-generator',
    name: 'LinkedIn Cold DM Generator',
    slug: 'linkedin-cold-dm-generator',
    category: 'linkedin-tools',
    url: '/linkedin-cold-dm-generator',
    description: 'Format concise B2B, partnership & advisory LinkedIn DMs using templates (not AI).',
    longDescription:
      'Write respectful, clear direct messages without spammy fluff. LinkedIn Cold DM Generator builds short relevance-hook, value-proposition, and low-friction CTA message structures inside your browser—strictly template-based, NOT AI.',
    keywords: ['linkedin cold dm generator', 'b2b outreach dm template', 'linkedin inmail template not ai'],
    icon: 'Send',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Cold DM Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draft respectful, direct LinkedIn outreach messages from editable browser templates (NOT AI). No login needed.',
    howTo: [
      {
        title: 'Pick outreach purpose',
        description: 'Pick informational chat, partnership pitch, B2B intro, or warm follow-up.',
      },
      {
        title: 'Fill observation & relevance',
        description: 'Templates organize greeting, genuine reason for reaching out, and a no-pressure ask (NOT AI).',
      },
      {
        title: 'Copy & send manually',
        description: 'Keep messages concise (75–120 words) and paste straight into LinkedIn Messaging.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Cold DM Generator use AI?',
        answer: 'No. It relies strictly on structured browser templates you customize—NOT AI.',
      },
      {
        question: 'Does this send automated bulk DMs on LinkedIn?',
        answer: 'No. It never connects to LinkedIn or automates outreach.',
      },
      {
        question: 'Applying specifically for an open job role?',
        answer: 'Use LinkedIn Job Application Message Generator for recruiter and hiring-manager templates.',
      },
      {
        question: 'Is there any usage limit?',
        answer: 'No. Generate and copy template DMs freely.',
      },
    ],
    relatedTools: [
      'linkedin-connection-message-generator',
      'linkedin-job-application-message-generator',
      'linkedin-reply-generator',
      'linkedin-recommendation-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-job-description-generator',
    name: 'LinkedIn Job Description Generator',
    slug: 'linkedin-job-description-generator',
    category: 'linkedin-tools',
    url: '/linkedin-job-description-generator',
    description: 'Structure clear role summaries, responsibilities & qualifications via templates (not AI).',
    longDescription:
      'Save hiring teams formatting headaches when drafting LinkedIn job listings. Assemble clean Role Overview, Key Responsibilities, Must-Have Qualifications, and Compensation/Location blocks using deterministic browser templates—NOT AI.',
    keywords: ['linkedin job description generator', 'hiring post template', 'job listing builder not ai'],
    icon: 'Briefcase',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Job Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format structured LinkedIn job postings with role, duties, and skills sections via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Enter role title, location & level',
        description: 'Input job title, remote/hybrid model, team summary, and salary range.',
      },
      {
        title: 'Organize template bullet blocks',
        description: 'Structured sections arrange duties, core skills, and benefits clearly (NOT AI).',
      },
      {
        title: 'Copy clean job post',
        description: 'Paste formatted text straight into LinkedIn Jobs or a hiring announcement post.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Job Description Generator use AI?',
        answer: 'No. It organizes your role details into structured hiring templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does it include a clear salary and hybrid/remote slot?',
        answer: 'Yes. Optional fields format transparent compensation and work-location details cleanly.',
      },
      {
        question: 'Does this publish directly to LinkedIn Jobs?',
        answer: 'No. Zero LinkedIn login is required—copy and paste into LinkedIn manually.',
      },
      {
        question: 'Want to polish resume bullet descriptions instead?',
        answer: 'Use LinkedIn Experience Description Generator.',
      },
    ],
    relatedTools: [
      'linkedin-experience-description-generator',
      'linkedin-skills-generator',
      'linkedin-job-application-message-generator',
      'linkedin-recommendation-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-job-application-message-generator',
    name: 'LinkedIn Job Application Message Generator',
    slug: 'linkedin-job-application-message-generator',
    category: 'linkedin-tools',
    url: '/linkedin-job-application-message-generator',
    description: 'Build concise hiring-manager & recruiter application notes via templates (not AI).',
    longDescription:
      'Follow up cleanly after submitting a job application without sounding scripted. LinkedIn Job Application Message Generator formats concise role-fit, proof-metric, and resume-link notes using local browser templates—NOT AI.',
    keywords: ['linkedin job application message generator', 'recruiter follow up template', 'hiring manager note not ai'],
    icon: 'FileText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Job Application Message Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draft respectful recruiter and hiring-manager follow-up messages using browser templates (NOT AI). Zero login needed.',
    howTo: [
      {
        title: 'Enter role applied for & proof point',
        description: 'Input job title, company name, and 1 relevant achievement.',
      },
      {
        title: 'Select follow-up template',
        description: 'Choose post-application note, referral ask, or direct hiring-manager outreach (NOT AI).',
      },
      {
        title: 'Verify length & send manually',
        description: 'Switch between 300-char connection note length and full DM length before pasting.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Job Application Message Generator use AI?',
        answer: 'No. Messages are assembled strictly from fill-in templates inside your browser—NOT AI.',
      },
      {
        question: 'Can I keep the message under the 300-character connection note limit?',
        answer: 'Yes. Toggle Short Connection Note mode for strict 300-character compliance.',
      },
      {
        question: 'Does this access my LinkedIn profile or applications?',
        answer: 'No. Zero LinkedIn login is ever requested.',
      },
      {
        question: 'Can I clean my LinkedIn profile link first?',
        answer: 'Yes. Strip clutter in LinkedIn Profile URL Formatter.',
      },
    ],
    relatedTools: [
      'linkedin-connection-message-generator',
      'linkedin-experience-description-generator',
      'linkedin-profile-url-formatter',
      'linkedin-recommendation-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-experience-description-generator',
    name: 'LinkedIn Experience Description Generator',
    slug: 'linkedin-experience-description-generator',
    category: 'linkedin-tools',
    url: '/linkedin-experience-description-generator',
    description: 'Format impact-oriented LinkedIn job experience bullets from your inputs via templates (not AI).',
    longDescription:
      'Turn raw job duties into crisp Action + Metric + Outcome profile bullet lines within LinkedIn’s 2,000-character experience limit. Built strictly with structured browser templates—NOT AI and zero social login.',
    keywords: ['linkedin experience description generator', 'profile job bullets', 'action metric template not ai'],
    icon: 'ListChecks',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Experience Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Structure impact-focused LinkedIn profile role bullets via browser templates (NOT AI). Zero login required.',
    howTo: [
      {
        title: 'Enter role, action, metric & tool',
        description: 'Fill what you owned, measurable results achieved, and key skills used.',
      },
      {
        title: 'Format structured bullet templates',
        description: 'Browser formulas format clean role summary + 3–5 scannable achievement bullets (NOT AI).',
      },
      {
        title: 'Copy into LinkedIn Experience',
        description: 'Check character count under 2,000 characters and paste into Edit Experience.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Experience Description Generator use AI?',
        answer: 'No. It formats your own role facts and metrics into clean bullet formulas locally—NOT AI.',
      },
      {
        question: 'What is LinkedIn’s character limit per job description?',
        answer: 'Each Experience entry allows up to 2,000 characters.',
      },
      {
        question: 'Does it include a skill keyword summary line?',
        answer: 'Yes. Pair your bullets with LinkedIn Skills Generator for clean skill alignment.',
      },
      {
        question: 'Is my career data saved on any server?',
        answer: 'No. Everything stays privately in your browser session.',
      },
    ],
    relatedTools: [
      'linkedin-skills-generator',
      'linkedin-profile-optimization-checklist',
      'linkedin-recommendation-generator',
      'linkedin-job-application-message-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-skills-generator',
    name: 'LinkedIn Skills Generator',
    slug: 'linkedin-skills-generator',
    category: 'linkedin-tools',
    url: '/linkedin-skills-generator',
    description: 'Organize structured role-matched LinkedIn skills lists via curated templates (not AI).',
    longDescription:
      'Curate balanced hard skills, tools, and domain competencies tailored to your job track without exceeding LinkedIn’s 50-skill profile cap. Uses deterministic role-taxonomy templates inside your browser—NOT AI.',
    keywords: ['linkedin skills generator', 'profile skill tags', 'role skill list template not ai'],
    icon: 'Tag',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Skills Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build organized hard, tool, and domain skill lists for LinkedIn profiles via local templates (NOT AI).',
    howTo: [
      {
        title: 'Select career track or enter tools',
        description: 'Pick Engineering, Design, Marketing, Finance, Ops, or custom core competencies.',
      },
      {
        title: 'Curate up to 50 balanced skills',
        description: 'Template lists organize technical tools alongside strategic competencies (NOT AI).',
      },
      {
        title: 'Copy top 3–5 priority skills',
        description: 'Highlight top skills at the front of your LinkedIn Experience and Skills sections.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Skills Generator use AI?',
        answer: 'No. It uses curated role-skill lookup templates inside your browser—NOT AI.',
      },
      {
        question: 'How many skills can a LinkedIn profile hold?',
        answer: 'LinkedIn allows up to 50 listed skills per profile.',
      },
      {
        question: 'Does this inspect my live LinkedIn profile?',
        answer: 'No. Zero LinkedIn login or profile scraping is used.',
      },
      {
        question: 'Want a full profile audit checklist too?',
        answer: 'Open LinkedIn Profile Optimization Checklist.',
      },
    ],
    relatedTools: [
      'linkedin-experience-description-generator',
      'linkedin-profile-optimization-checklist',
      'linkedin-job-description-generator',
      'linkedin-recommendation-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-recommendation-generator',
    name: 'LinkedIn Recommendation Generator',
    slug: 'linkedin-recommendation-generator',
    category: 'linkedin-tools',
    url: '/linkedin-recommendation-generator',
    description: 'Write warm peer, manager & report LinkedIn recommendations via templates (not AI).',
    longDescription:
      'Write sincere, specific recommendations for coworkers, direct reports, managers, or clients without staring at a blank form. LinkedIn Recommendation Generator uses structured relationship + strength + project templates inside your browser—NOT AI.',
    keywords: ['linkedin recommendation generator', 'coworker endorsement template', 'manager review builder not ai'],
    icon: 'Award',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Recommendation Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draft specific LinkedIn recommendations for colleagues, managers, or clients via browser templates (NOT AI).',
    howTo: [
      {
        title: 'Choose working relationship',
        description: 'Select peer teammate, direct report, manager, mentor, or client vendor.',
      },
      {
        title: 'Add 2 concrete strengths & project',
        description: 'Browser templates combine your real observations into warm, specific paragraphs (NOT AI).',
      },
      {
        title: 'Review & paste on LinkedIn',
        description: 'Refine personal voice and submit manually inside LinkedIn Recommendations.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Recommendation Generator use AI?',
        answer: 'No. It uses structured fill-in sentence templates in your browser—NOT AI.',
      },
      {
        question: 'Does this post recommendations to LinkedIn for me?',
        answer: 'No. Copy your finished text and paste it directly on your colleague’s LinkedIn profile.',
      },
      {
        question: 'What is LinkedIn’s recommendation character limit?',
        answer: 'LinkedIn recommendations support up to 3,000 characters, though 100–180 words reads best.',
      },
      {
        question: 'Can I request a recommendation via DM too?',
        answer: 'Yes. Customize a quick request note using LinkedIn Cold DM Generator.',
      },
    ],
    relatedTools: [
      'linkedin-experience-description-generator',
      'linkedin-cold-dm-generator',
      'linkedin-skills-generator',
      'linkedin-profile-optimization-checklist',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-engagement-rate-calculator',
    name: 'LinkedIn Engagement Rate Calculator',
    slug: 'linkedin-engagement-rate-calculator',
    category: 'linkedin-tools',
    url: '/linkedin-engagement-rate-calculator',
    description: 'Compute LinkedIn engagement rate by impressions or followers locally using clear math.',
    longDescription:
      'Evaluate how strongly your LinkedIn posts, carousels, and articles resonate. Enter reactions, comments, reposts, and either impressions or followers to compute exact engagement percentages in your browser—no LinkedIn login required.',
    keywords: ['linkedin engagement rate calculator', 'linkedin impression engagement ratio', 'b2b engagement formula'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate LinkedIn post engagement rate by impressions or followers instantaneously in your browser. Zero login.',
    howTo: [
      {
        title: 'Enter reactions, comments & reposts',
        description: 'Input engagement totals from a post or multi-post average.',
      },
      {
        title: 'Add impressions or follower count',
        description: 'Switch between Impression-based ER and Follower-based ER modes.',
      },
      {
        title: 'Inspect ratio breakdown',
        description: 'View transparent formula math instantaneously inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does this fetch my LinkedIn analytics automatically?',
        answer: 'No. You enter numbers manually with zero social login.',
      },
      {
        question: 'Can I include link clicks alongside reactions and comments?',
        answer: 'Yes. Optional clicks let you measure click-inclusive LinkedIn engagement.',
      },
      {
        question: 'Which benchmark is more reliable on LinkedIn?',
        answer: 'Impressions-based engagement rate measures content relevance regardless of follower count.',
      },
      {
        question: 'Can I test different post formats like carousels?',
        answer: 'Yes. Pair insights with LinkedIn Carousel Maker and LinkedIn Content Calendar Generator.',
      },
    ],
    relatedTools: [
      'linkedin-content-calendar-generator',
      'linkedin-carousel-maker',
      'linkedin-post-character-counter',
      'linkedin-hashtag-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-post-character-counter',
    name: 'LinkedIn Post Character Counter',
    slug: 'linkedin-post-character-counter',
    category: 'linkedin-tools',
    url: '/linkedin-post-character-counter',
    description: 'Measure draft posts against LinkedIn’s 3,000-character limit and ~210-char "See more" fold.',
    longDescription:
      'Avoid mid-sentence truncation before publishing. Paste your post into LinkedIn Post Character Counter to track exact characters against the 3,000-character LinkedIn post limit, flag the ~210-character mobile "See more" cutoff, and check headline/about limits locally.',
    keywords: ['linkedin post character counter', '3000 character limit linkedin', 'see more fold preview'],
    icon: 'Ruler',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Post Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Check draft text against LinkedIn’s 3,000-character post limit and 210-character "See more" fold locally in browser.',
    howTo: [
      {
        title: 'Select LinkedIn field preset',
        description: 'Switch between Post (3,000), Headline (220), About (2,600), and Comment (1,250).',
      },
      {
        title: 'Paste or draft text',
        description: 'Inspect live count, remaining space, and exact preview before the "See more" button.',
      },
      {
        title: 'Trim & copy cleanly',
        description: 'Refine opening lines for maximum clarity before pasting into LinkedIn.',
      },
    ],
    faqs: [
      {
        question: 'What is LinkedIn’s maximum post length?',
        answer: 'Standard LinkedIn feed posts support up to 3,000 characters.',
      },
      {
        question: 'Where does LinkedIn hide text behind "See more"?',
        answer: 'Usually around ~210 characters (or 3 desktop lines), so placing your strongest hook first matters.',
      },
      {
        question: 'Does this also count hashtags inside my post?',
        answer: 'Yes, and LinkedIn Hashtag Counter isolates #tags separately.',
      },
      {
        question: 'Is any LinkedIn login required?',
        answer: 'No. Counting stays 100% inside your browser tab.',
      },
    ],
    relatedTools: [
      'linkedin-hashtag-counter',
      'linkedin-caption-generator',
      'linkedin-profile-optimization-checklist',
      'linkedin-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-hashtag-counter',
    name: 'LinkedIn Hashtag Counter',
    slug: 'linkedin-hashtag-counter',
    category: 'linkedin-tools',
    url: '/linkedin-hashtag-counter',
    description: 'Count #hashtags, spot duplicates, and keep LinkedIn posts focused on 3–5 clean tags.',
    longDescription:
      'Keep LinkedIn posts looking editorial rather than spammy. Paste any draft into LinkedIn Hashtag Counter to count total #tags, catch duplicate tags, and verify formatting cleanly in your browser—no login required.',
    keywords: ['linkedin hashtag counter', 'count linkedin tags', 'clean post hashtags'],
    icon: 'Hash',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Hashtag Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Count LinkedIn hashtags, detect duplicates, and keep posts within the recommended 3–5 tag range in your browser.',
    howTo: [
      {
        title: 'Paste post draft or tag list',
        description: 'Paste your LinkedIn caption or trailing hashtag block.',
      },
      {
        title: 'Check count & duplicates',
        description: 'Flags over-tagging (>5 tags), duplicate tags, and broken spacing.',
      },
      {
        title: 'Copy tidy hashtag footer',
        description: 'Trim down to 3–5 relevant industry tags and copy cleanly.',
      },
    ],
    faqs: [
      {
        question: 'How many hashtags are recommended on LinkedIn?',
        answer: 'Most LinkedIn creators stick to 3–5 targeted tags at the end of a post.',
      },
      {
        question: 'Does this check hashtag search volume on LinkedIn?',
        answer: 'No. It parses, counts, and deduplicates tags locally without connecting to LinkedIn.',
      },
      {
        question: 'Can I count full post characters too?',
        answer: 'Yes. Pair it with LinkedIn Post Character Counter (3,000 limit).',
      },
      {
        question: 'Does this require an account?',
        answer: 'No. Runs client-side with zero sign-in.',
      },
    ],
    relatedTools: [
      'linkedin-post-character-counter',
      'linkedin-caption-generator',
      'linkedin-engagement-rate-calculator',
      'linkedin-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-profile-optimization-checklist',
    name: 'LinkedIn Profile Optimization Checklist',
    slug: 'linkedin-profile-optimization-checklist',
    category: 'linkedin-tools',
    url: '/linkedin-profile-optimization-checklist',
    description: 'Interactive browser-saved LinkedIn profile audit checklist—no account login required.',
    longDescription:
      'Audit every section of your LinkedIn presence step by step: 400x400 headshot, 1584x396 banner, clean /in/ vanity URL, value-driven headline, Featured links, metric-backed Experience bullets, and Skills order. Saves progress locally in your browser without LinkedIn login.',
    keywords: ['linkedin profile optimization checklist', 'linkedin audit list', 'job seeker profile checklist'],
    icon: 'CheckSquare',
    acceptedFormats: ['Checklist'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Profile Optimization Checklist | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Work through a complete browser-saved LinkedIn profile optimization checklist locally with zero account login.',
    howTo: [
      {
        title: 'Select your profile goal',
        description: 'Switch emphasis between Job Search, Consulting/Freelance, and Founder/B2B.',
      },
      {
        title: 'Check off each profile section',
        description: 'Progress saves locally in your browser across Headshot, Banner, Headline, About, Experience, and Skills.',
      },
      {
        title: 'Export or jump to linked tools',
        description: 'Launch our resizers, URL cleaner, and template builders directly from checklist items.',
      },
    ],
    faqs: [
      {
        question: 'Does this scan my live LinkedIn profile automatically?',
        answer: 'No. None of these tools require social login—you check items off privately in your browser.',
      },
      {
        question: 'Does checklist progress persist if I refresh?',
        answer: 'Yes. Your checklist state is designed to save locally in browser storage.',
      },
      {
        question: 'What image sizes does the checklist verify?',
        answer: 'Includes exact links to our 400x400 Profile Picture Resizer and 1584x396 Banner Maker.',
      },
      {
        question: 'Is any personal info transmitted?',
        answer: 'No. Runs 100% locally.',
      },
    ],
    relatedTools: [
      'linkedin-profile-picture-resizer',
      'linkedin-banner-maker',
      'linkedin-profile-url-formatter',
      'linkedin-experience-description-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'linkedin-content-calendar-generator',
    name: 'LinkedIn Content Calendar Generator',
    slug: 'linkedin-content-calendar-generator',
    category: 'linkedin-tools',
    url: '/linkedin-content-calendar-generator',
    description: 'Plan a weekly B2B & creator LinkedIn posting schedule using browser templates (not AI).',
    longDescription:
      'Stay consistent with 2–5 weekly LinkedIn posts across text insights, 1200x627 visuals, and document carousels. Builds an editable weekly/monthly schedule from your topic pillars inside your browser—strictly template-based (NOT AI) with zero LinkedIn login.',
    keywords: ['linkedin content calendar generator', 'b2b posting planner', 'linkedin schedule template not ai'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `LinkedIn Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create an editable LinkedIn posting calendar from pillar templates in your browser (NOT AI). No LinkedIn login needed.',
    howTo: [
      {
        title: 'Enter 3–4 content pillars & cadence',
        description: 'Input your core themes and preferred posting days per week.',
      },
      {
        title: 'Generate balanced format rotation',
        description: 'Templates alternate text stories, frameworks, carousels, and case studies deterministically (NOT AI).',
      },
      {
        title: 'Export clean CSV/Markdown',
        description: 'Save your calendar offline without connecting any social account.',
      },
    ],
    faqs: [
      {
        question: 'Does LinkedIn Content Calendar Generator use AI?',
        answer: 'No. Schedules rotate strictly from structured pillar and format templates—NOT AI.',
      },
      {
        question: 'Can this schedule or auto-post to LinkedIn?',
        answer: 'No. None of these tools log into LinkedIn—export your plan to manage publishing.',
      },
      {
        question: 'Can I plan carousel weeks alongside image posts?',
        answer: 'Yes. Built-in format slots alternate text, 1200x627 image, and carousel PDF days.',
      },
      {
        question: 'Need prompt ideas for each calendar slot?',
        answer: 'Yes. Pair it with LinkedIn Content Idea Generator.',
      },
    ],
    relatedTools: [
      'linkedin-content-idea-generator',
      'linkedin-caption-generator',
      'linkedin-carousel-maker',
      'linkedin-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
