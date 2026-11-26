import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const REDDIT_TOOLS: readonly Tool[] = [
  {
    id: 'reddit-subreddit-name-generator',
    name: 'Reddit Subreddit Name Generator',
    slug: 'reddit-subreddit-name-generator',
    category: 'reddit-tools',
    url: '/reddit-subreddit-name-generator',
    description: 'Format r/subreddit community name ideas from keywords via rules & templates (not AI).',
    longDescription:
      'Brainstorm memorable, compliant r/CommunityName candidates within Reddit’s 3–21 character alphanumeric/underscore naming rules. Strictly rule- and template-based in your browser (NOT AI)—for Reddit users with no Reddit login or posting.',
    keywords: ['reddit subreddit name generator', 'r community name ideas', 'subreddit naming template not ai'],
    icon: 'AtSign',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Subreddit Name Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate compliant 3–21 character r/subreddit name ideas locally using keyword templates (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Enter topic or hobby words',
        description: 'Enter 1–2 core words describing your community niche.',
      },
      {
        title: 'Apply r/ naming templates',
        description: 'Browser rules build CamelCase and underscore variations inside 3–21 characters (NOT AI).',
      },
      {
        title: 'Verify directly on Reddit',
        description: 'Check live community availability manually when creating your community on Reddit.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Subreddit Name Generator use AI?',
        answer: 'No. It uses word-combining rules and naming templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does it create or post anything on Reddit?',
        answer: 'No. These tools are strictly helper utilities for Reddit users—no Reddit login or posting occurs.',
      },
      {
        question: 'What rules govern subreddit names?',
        answer: 'Subreddit names must be 3–21 characters long using letters, numbers, and underscores only (no spaces).',
      },
      {
        question: 'Need a community blurb once you pick a name?',
        answer: 'Yes. Open Reddit Subreddit Description Generator.',
      },
    ],
    relatedTools: [
      'reddit-subreddit-description-generator',
      'reddit-flair-generator',
      'reddit-username-checker',
      'reddit-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-subreddit-description-generator',
    name: 'Reddit Subreddit Description Generator',
    slug: 'reddit-subreddit-description-generator',
    category: 'reddit-tools',
    url: '/reddit-subreddit-description-generator',
    description: 'Draft clear r/ sidebar & community descriptions using editable templates (not AI).',
    longDescription:
      'Summarize what belongs in your community, who it serves, and core posting norms within Reddit’s 500-character description box. Strictly template-based inside your browser (NOT AI)—for Reddit users with no posting or Reddit login required.',
    keywords: ['reddit subreddit description generator', 'subreddit sidebar template', 'community bio not ai'],
    icon: 'AlignLeft',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Subreddit Description Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Write concise 500-char Reddit community descriptions using browser templates (NOT AI). No Reddit login or posting.',
    howTo: [
      {
        title: 'Enter subreddit topic & focus',
        description: 'Input community theme, allowed posts, and welcome note.',
      },
      {
        title: 'Choose sidebar blurb templates',
        description: 'Templates structure concise welcome + topic scope + rule reminder lines (NOT AI).',
      },
      {
        title: 'Copy within 500 characters',
        description: 'Paste manually into Mod Tools -> Community Appearance or Settings on Reddit.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Subreddit Description Generator use AI?',
        answer: 'No. It uses editable browser templates—NOT AI-written.',
      },
      {
        question: 'Can this tool update my subreddit settings automatically?',
        answer: 'No. Reddit tools are offline helpers for Reddit users—no posting or account connection.',
      },
      {
        question: 'How long can a Reddit community description be?',
        answer: 'Reddit caps standard community descriptions at 500 characters.',
      },
      {
        question: 'Need matching post & user flairs?',
        answer: 'Try Reddit Flair Generator next.',
      },
    ],
    relatedTools: [
      'reddit-subreddit-name-generator',
      'reddit-flair-generator',
      'reddit-markdown-formatter',
      'reddit-post-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-flair-generator',
    name: 'Reddit Flair Generator',
    slug: 'reddit-flair-generator',
    category: 'reddit-tools',
    url: '/reddit-flair-generator',
    description: 'Organize clean post & user flair labels from curated category templates (not AI).',
    longDescription:
      'Keep busy subreddits easy to filter with crisp [Tag] and category flairs. Reddit Flair Generator formats consistent topic, status, and role flair sets inside your browser using structured templates—NOT AI and no Reddit login.',
    keywords: ['reddit flair generator', 'post flair templates', 'subreddit tag builder not ai'],
    icon: 'Tag',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Flair Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create organized Reddit post and user flair tag sets from curated templates in browser (NOT AI). Zero login.',
    howTo: [
      {
        title: 'Pick community type',
        description: 'Choose Help/Q&A, Showcase, News/Discussion, Marketplace, or Gaming.',
      },
      {
        title: 'Customize bracket & emoji templates',
        description: 'Templates format short scannable flair tags under Reddit’s 64-char flair limit (NOT AI).',
      },
      {
        title: 'Copy list into Mod Tools',
        description: 'Paste your clean flair labels directly inside Reddit’s Post Flair setup.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Flair Generator use AI?',
        answer: 'No. It combines category presets and editable labels inside your browser—NOT AI.',
      },
      {
        question: 'What is Reddit’s flair text length limit?',
        answer: 'Individual Reddit flairs allow up to 64 characters, though 1–3 short words filter best.',
      },
      {
        question: 'Does this modify live subreddit flairs?',
        answer: 'No. No Reddit login or posting access is used.',
      },
      {
        question: 'Can I format Mod announcement posts cleanly too?',
        answer: 'Yes. Use Reddit Markdown Formatter.',
      },
    ],
    relatedTools: [
      'reddit-subreddit-description-generator',
      'reddit-subreddit-name-generator',
      'reddit-markdown-formatter',
      'reddit-poll-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-markdown-formatter',
    name: 'Reddit Markdown Formatter',
    slug: 'reddit-markdown-formatter',
    category: 'reddit-tools',
    url: '/reddit-markdown-formatter',
    description: 'Preview & format Reddit-flavored Markdown tables, spoilers, >quotes, and headings locally.',
    longDescription:
      'Draft complex guides, comparisons, and `>!spoiler!<` tags cleanly without broken Reddit table syntax. Format and live-preview Reddit-flavored Markdown directly in your browser—no posting on Reddit and zero account login.',
    keywords: ['reddit markdown formatter', 'reddit table markdown', 'reddit spoiler syntax', 'markdown preview'],
    icon: 'Code2',
    acceptedFormats: ['Text', 'Markdown'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Markdown Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Write and preview Reddit-flavored Markdown headings, tables, code blocks, and spoilers locally in browser.',
    howTo: [
      {
        title: 'Type or paste Markdown draft',
        description: 'write headings, lists, blockquotes, tables, or >!spoiler!< text.',
      },
      {
        title: 'Insert Reddit-safe syntax',
        description: 'Toolbar buttons insert verified Markdown tables, links, superscript, and horizontal rules.',
      },
      {
        title: 'Copy Markdown for Old/New Reddit',
        description: 'Switch Reddit editor to "Markdown Mode" and paste cleanly—no Reddit posting occurs here.',
      },
    ],
    faqs: [
      {
        question: 'How does Reddit spoiler formatting work?',
        answer: 'Wrap spoiler text as >!hidden text!< without spaces next to the exclamation marks.',
      },
      {
        question: 'Does this post directly to Reddit?',
        answer: 'No. It formats and previews Markdown locally for Reddit users to copy and paste.',
      },
      {
        question: 'Can I convert plain notes into Reddit Markdown automatically?',
        answer: 'Yes. Open Reddit Text to Markdown Converter.',
      },
      {
        question: 'Can I check if my guide stays under 40,000 characters?',
        answer: 'Yes. Check length in Reddit Post Character Counter.',
      },
    ],
    relatedTools: [
      'reddit-text-to-markdown-converter',
      'reddit-markdown-to-html-converter',
      'reddit-text-formatter',
      'reddit-post-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-text-formatter',
    name: 'Reddit Text Formatter',
    slug: 'reddit-text-formatter',
    category: 'reddit-tools',
    url: '/reddit-text-formatter',
    description: 'Fix Reddit double-line-break spacing, paragraphs, and quote formatting in browser.',
    longDescription:
      'Prevent long Reddit stories or technical explanations from turning into unreadable walls of text. Automatically normalize single-to-double line breaks (Reddit Markdown requires blank lines between paragraphs), strip stray tabs, and tidy bullet spacing locally.',
    keywords: ['reddit text formatter', 'fix reddit line breaks', 'reddit paragraph spacer'],
    icon: 'WrapText',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Text Formatter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Fix collapsed Reddit line breaks, clean messy paragraphs, and tidy bullet spacing locally in your browser.',
    howTo: [
      {
        title: 'Paste plain draft text',
        description: 'Paste notes copied from email, docs, or mobile notes.',
      },
      {
        title: 'Normalize Reddit paragraph breaks',
        description: 'Applies Reddit-friendly blank lines and clean list indentation deterministically.',
      },
      {
        title: 'Copy clean formatted text',
        description: 'Paste straight into Reddit’s editor manually.',
      },
    ],
    faqs: [
      {
        question: 'Why do single Enter breaks collapse on Reddit?',
        answer: 'Reddit’s Markdown parser requires either two spaces before Enter or a full blank line to separate paragraphs.',
      },
      {
        question: 'Does this rewrite my words using AI?',
        answer: 'No. It applies deterministic whitespace, paragraph, and list cleanup only.',
      },
      {
        question: 'Does it post anything to Reddit?',
        answer: 'No. Copy and paste manually whenever you are ready to post.',
      },
      {
        question: 'Want full Markdown tables and headings too?',
        answer: 'Try Reddit Markdown Formatter or Reddit Text to Markdown Converter.',
      },
    ],
    relatedTools: [
      'reddit-markdown-formatter',
      'reddit-text-to-markdown-converter',
      'reddit-post-character-counter',
      'reddit-title-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-post-character-counter',
    name: 'Reddit Post Character Counter',
    slug: 'reddit-post-character-counter',
    category: 'reddit-tools',
    url: '/reddit-post-character-counter',
    description: 'Check long-form posts against Reddit’s 40,000-character body limit and 10,000 comment cap.',
    longDescription:
      'Writing a massive megathread, guide, or update? Check exact Markdown character length against Reddit’s 40,000-character text-post body limit and 10,000-character comment limit in your browser before pasting.',
    keywords: ['reddit post character counter', '40000 character limit reddit', 'reddit comment length'],
    icon: 'Ruler',
    acceptedFormats: ['Text', 'Markdown'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Post Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Measure posts against Reddit’s 40,000-character self-post body cap and 10,000-character comment limit in browser.',
    howTo: [
      {
        title: 'Select Post (40,000) or Comment (10,000)',
        description: 'Toggle between text post body, comment, and subreddit rule/sidebar limits.',
      },
      {
        title: 'Paste Markdown or plain text',
        description: 'Inspect exact character count, word count, and split suggestions if over limit.',
      },
      {
        title: 'Copy verified text',
        description: 'Paste safely into Reddit with zero login required.',
      },
    ],
    faqs: [
      {
        question: 'What is Reddit’s maximum text post length?',
        answer: 'Reddit text (self) posts support up to 40,000 characters in the post body.',
      },
      {
        question: 'What is Reddit’s comment character limit?',
        answer: 'Standard Reddit comments allow up to 10,000 characters.',
      },
      {
        question: 'Does Markdown syntax count toward the 40,000 characters?',
        answer: 'Yes. Asterisks, brackets, URLs, and table pipes all count toward total character length.',
      },
      {
        question: 'Checking a post headline too?',
        answer: 'Use Reddit Title Character Counter (300-character limit).',
      },
    ],
    relatedTools: [
      'reddit-title-character-counter',
      'reddit-markdown-formatter',
      'reddit-text-formatter',
      'reddit-post-idea-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-title-character-counter',
    name: 'Reddit Title Character Counter',
    slug: 'reddit-title-character-counter',
    category: 'reddit-tools',
    url: '/reddit-title-character-counter',
    description: 'Check Reddit post headlines cleanly against Reddit’s strict 300-character title cap locally.',
    longDescription:
      'Avoid getting your Reddit post title chopped or rejected at submit time. Paste your headline plus any required `[Bracket Flair]` prefix into Reddit Title Character Counter to track exact characters out of 300 in your browser.',
    keywords: ['reddit title character counter', '300 char reddit title', 'post headline length'],
    icon: 'Type',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Title Character Counter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Measure post headlines against Reddit’s strict 300-character title limit instantaneously in your browser.',
    howTo: [
      {
        title: 'Type headline & bracket tag',
        description: 'Include any required subreddit prefix like [Guide] or [Question].',
      },
      {
        title: 'Track 300-char limit & mobile preview',
        description: 'Browser counter warns over 300 characters and highlights mobile feed truncation (~100–140 chars).',
      },
      {
        title: 'Copy tidy headline',
        description: 'Paste directly into Reddit’s Title box when creating your post.',
      },
    ],
    faqs: [
      {
        question: 'What is Reddit’s exact title character limit?',
        answer: 'Reddit post titles are capped strictly at 300 characters across desktop and mobile.',
      },
      {
        question: 'Can I include subreddit prefix tags in the count?',
        answer: 'Yes—type the full title including [Tag] brackets so your count matches Reddit submission rules.',
      },
      {
        question: 'Does this submit posts to Reddit?',
        answer: 'No. Runs strictly inside your browser with no Reddit login.',
      },
      {
        question: 'Need to measure your post body next?',
        answer: 'Open Reddit Post Character Counter (40,000 limit).',
      },
    ],
    relatedTools: [
      'reddit-post-character-counter',
      'reddit-question-generator',
      'reddit-post-idea-generator',
      'reddit-flair-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-karma-calculator',
    name: 'Reddit Karma Calculator',
    slug: 'reddit-karma-calculator',
    category: 'reddit-tools',
    url: '/reddit-karma-calculator',
    description: 'Roughly estimate Reddit karma from upvotes & post age—ESTIMATE ONLY (formula not public).',
    longDescription:
      'Understand why a post with 10,000 net upvotes rarely adds 10,000 exact karma to your profile. Reddit Karma Calculator simulates diminishing-return vote curves inside your browser—ESTIMATE ONLY, because Reddit’s exact karma formula is not public.',
    keywords: ['reddit karma calculator', 'karma upvote estimate', 'reddit karma formula not public'],
    icon: 'Flame',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Karma Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Model approximate Reddit karma from upvotes in your browser. Estimate only—Reddit’s exact karma formula is not public.',
    howTo: [
      {
        title: 'Enter post upvotes & time window',
        description: 'Input net upvote count and rough time span since posting.',
      },
      {
        title: 'Inspect diminishing-return estimate curve',
        description: 'Displays a conservative–optimistic karma range rather than a false exact integer.',
      },
      {
        title: 'Review transparent disclaimer',
        description: 'Always presented as an educational estimate—no Reddit login or profile sync.',
      },
    ],
    faqs: [
      {
        question: 'Is Reddit Karma Calculator exact?',
        answer: 'No. It is ESTIMATE ONLY—Reddit intentionally keeps its exact upvote-to-karma decay formula non-public to prevent vote manipulation.',
      },
      {
        question: 'Why do high-upvote posts give less than 1:1 karma?',
        answer: 'Reddit applies logarithmic/time-decayed scaling after early upvotes, so massive viral posts contribute progressively less karma per vote.',
      },
      {
        question: 'Does this access my Reddit account?',
        answer: 'No. No Reddit login is needed and all math runs in your browser.',
      },
      {
        question: 'Can I measure comment/vote ratio per view too?',
        answer: 'Yes. Try Reddit Engagement Rate Calculator.',
      },
    ],
    relatedTools: [
      'reddit-engagement-rate-calculator',
      'reddit-post-idea-generator',
      'reddit-question-generator',
      'reddit-title-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-engagement-rate-calculator',
    name: 'Reddit Engagement Rate Calculator',
    slug: 'reddit-engagement-rate-calculator',
    category: 'reddit-tools',
    url: '/reddit-engagement-rate-calculator',
    description: 'Calculate Reddit upvote + comment ratio against post views or subreddit members locally.',
    longDescription:
      'Evaluate how effectively your post sparked community discussion. Enter net votes, comment count, and Post Insights views (or subreddit size) to compute engagement percentages cleanly in your browser—no Reddit login required.',
    keywords: ['reddit engagement rate calculator', 'subreddit post engagement ratio', 'upvote comment rate'],
    icon: 'Calculator',
    acceptedFormats: ['Numbers'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Engagement Rate Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compute Reddit post engagement from upvotes, comments, and post views locally in browser. Zero login needed.',
    howTo: [
      {
        title: 'Enter votes, comments & views',
        description: 'Input upvotes, comment count, and Post Insights view total (or member count).',
      },
      {
        title: 'Compare discussion ratio',
        description: 'Calculates both Total Engagement % and Comment-to-View discussion %.',
      },
      {
        title: 'Track winning post formats',
        description: 'Compare guides, questions, and polls cleanly inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does this pull live metrics from Reddit?',
        answer: 'No. You enter numbers manually from Reddit Post Insights with zero login.',
      },
      {
        question: 'Why track comment rate alongside upvotes on Reddit?',
        answer: 'High comment depth signals active discussion even in technical or niche subreddits with fewer votes.',
      },
      {
        question: 'Can I estimate approximate karma from votes too?',
        answer: 'Yes. Open Reddit Karma Calculator (estimate only).',
      },
      {
        question: 'Is any data stored on servers?',
        answer: 'No. Pure math runs inside your browser.',
      },
    ],
    relatedTools: [
      'reddit-karma-calculator',
      'reddit-post-idea-generator',
      'reddit-poll-generator',
      'reddit-content-calendar-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-post-idea-generator',
    name: 'Reddit Post Idea Generator',
    slug: 'reddit-post-idea-generator',
    category: 'reddit-tools',
    url: '/reddit-post-idea-generator',
    description: 'Draft helpful, discussion-first Reddit post concepts from templates (not AI, no posting).',
    longDescription:
      'Brainstorm authentic community discussions, detailed guides, and honest feedback requests suited to Reddit’s anti-self-promo culture. Strictly template-based in your browser (NOT AI)—for Reddit users with no posting on Reddit.',
    keywords: ['reddit post idea generator', 'subreddit discussion prompts', 'reddit guide ideas not ai'],
    icon: 'BookOpen',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Post Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate community-friendly Reddit discussion and guide prompts from browser templates (NOT AI, no posting).',
    howTo: [
      {
        title: 'Enter subreddit niche & subject',
        description: 'Input your topic and pick Breakdown, Honest Review, Case Notes, or Open Debate.',
      },
      {
        title: 'Populate community-first templates',
        description: 'Templates structure value-first posts without promotional fluff (NOT AI).',
      },
      {
        title: 'Format & post manually on Reddit',
        description: 'Check subreddit rules first, refine in Reddit Markdown Formatter, and post manually.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Post Idea Generator use AI?',
        answer: 'No. Prompts use deterministic community-discussion templates inside your browser—NOT AI.',
      },
      {
        question: 'Does this tool post on Reddit for me?',
        answer: 'No. Reddit tools are browser helpers for Reddit users—zero posting or Reddit login occurs.',
      },
      {
        question: 'Want randomized wildcard subreddit angles instead?',
        answer: 'Try Reddit Random Post Idea Generator.',
      },
      {
        question: 'Need clear open-ended questions?',
        answer: 'Open Reddit Question Generator.',
      },
    ],
    relatedTools: [
      'reddit-random-post-idea-generator',
      'reddit-question-generator',
      'reddit-markdown-formatter',
      'reddit-title-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-question-generator',
    name: 'Reddit Question Generator',
    slug: 'reddit-question-generator',
    category: 'reddit-tools',
    url: '/reddit-question-generator',
    description: 'Frame clear AskReddit-style & niche Q&A questions from templates (not AI, no posting).',
    longDescription:
      'Write open-ended, non-leading questions that invite detailed Reddit thread answers instead of yes/no replies. Built strictly from structured question templates in your browser (NOT AI) and checks Reddit’s 300-char title rule—no posting on Reddit.',
    keywords: ['reddit question generator', 'askreddit question templates', 'open ended thread questions not ai'],
    icon: 'MessageSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Question Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format open-ended discussion questions for Reddit threads from browser templates (NOT AI, no posting).',
    howTo: [
      {
        title: 'Enter topic or curiosity prompt',
        description: 'Enter your subject, profession, or hobby angle.',
      },
      {
        title: 'Apply open-ended question templates',
        description: 'Formats specific "How/Why/What experience..." questions under 300 characters (NOT AI).',
      },
      {
        title: 'Verify subreddit rules & post manually',
        description: 'Confirm your target subreddit allows open Q&A posts before submitting on Reddit.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Question Generator use AI?',
        answer: 'No. It uses curated open-ended question templates locally in your browser—NOT AI.',
      },
      {
        question: 'Does this post questions to Reddit?',
        answer: 'No. You copy the title and post manually on Reddit.',
      },
      {
        question: 'Does it keep questions inside Reddit’s 300-character title cap?',
        answer: 'Yes. Live counting ensures every template fits under 300 characters.',
      },
      {
        question: 'Prefer structured voting options instead?',
        answer: 'Use Reddit Poll Generator.',
      },
    ],
    relatedTools: [
      'reddit-title-character-counter',
      'reddit-poll-generator',
      'reddit-post-idea-generator',
      'reddit-comment-picker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-poll-generator',
    name: 'Reddit Poll Generator',
    slug: 'reddit-poll-generator',
    category: 'reddit-tools',
    url: '/reddit-poll-generator',
    description: 'Draft balanced 2–6 option Reddit poll questions & choices via templates (not AI, no posting).',
    longDescription:
      'Structure clean Reddit polls where options do not overlap and always include a "Results / Just checking" option so voters do not skew outcomes. Strictly template-based in your browser (NOT AI)—zero posting on Reddit.',
    keywords: ['reddit poll generator', 'subreddit poll options template', 'poll maker not ai'],
    icon: 'ListChecks',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Poll Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Design balanced 2–6 option Reddit polls with neutral Results slots using browser templates (NOT AI, no posting).',
    howTo: [
      {
        title: 'Enter decision topic & choices',
        description: 'Input your poll question and 2–5 candidate answer options.',
      },
      {
        title: 'Apply poll balance templates',
        description: 'Templates organize clear mutually exclusive choices under 120 chars plus an optional Results option (NOT AI).',
      },
      {
        title: 'Copy into Reddit’s Poll tab',
        description: 'Paste title and options manually into Reddit’s native Create Poll form.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Poll Generator use AI?',
        answer: 'No. Polls are formatted strictly from structured question and choice templates—NOT AI.',
      },
      {
        question: 'How many options does a Reddit poll allow?',
        answer: 'Reddit native polls allow between 2 and 6 answer options (up to 120 characters per option).',
      },
      {
        question: 'Can this tool publish a live poll on Reddit?',
        answer: 'No. No Reddit login or posting is connected.',
      },
      {
        question: 'Why add a "View Results" option?',
        answer: 'Without a neutral Results option, curious readers pick random choices just to see totals.',
      },
    ],
    relatedTools: [
      'reddit-question-generator',
      'reddit-post-idea-generator',
      'reddit-title-character-counter',
      'reddit-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-comment-picker',
    name: 'Reddit Comment Picker',
    slug: 'reddit-comment-picker',
    category: 'reddit-tools',
    url: '/reddit-comment-picker',
    description: 'Pick random winners ONLY from pasted Reddit comments—no Reddit login or live thread scraping.',
    longDescription:
      'Run fair community raffles, game-key giveaways, or feedback draws locally in your browser. Paste your copied comments or u/usernames line by line—Reddit Comment Picker picks strictly from pasted text (cannot fetch live threads or post on Reddit).',
    keywords: ['reddit comment picker', 'reddit raffle picker pasted', 'random u username picker'],
    icon: 'Trophy',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Comment Picker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draw random winners strictly from Reddit comments or usernames you paste locally. No scraping or Reddit login.',
    howTo: [
      {
        title: 'Paste copied comments or u/handles',
        description: 'Paste one entry per line inside your browser.',
      },
      {
        title: 'Enable deduplication & keyword filters',
        description: 'Strip duplicate u/usernames or filter pasted entries containing a required phrase.',
      },
      {
        title: 'Draw fair random winners',
        description: 'Uses local browser Web Crypto randomness—no Reddit posting or scraping.',
      },
    ],
    faqs: [
      {
        question: 'Can this fetch comments from a Reddit post URL?',
        answer: 'No. It works ONLY from comments or usernames you paste directly—no live scraping, login, or posting on Reddit.',
      },
      {
        question: 'Does it deduplicate repeated usernames?',
        answer: 'Yes. Toggle duplicate-username removal so one commenter only counts once.',
      },
      {
        question: 'Are pasted comments uploaded anywhere?',
        answer: 'No. Everything stays privately inside your browser.',
      },
      {
        question: 'Is there any entry count fee?',
        answer: 'No. Free for all Reddit moderators and users.',
      },
    ],
    relatedTools: [
      'reddit-poll-generator',
      'reddit-question-generator',
      'reddit-engagement-rate-calculator',
      'reddit-flair-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-random-post-idea-generator',
    name: 'Reddit Random Post Idea Generator',
    slug: 'reddit-random-post-idea-generator',
    category: 'reddit-tools',
    url: '/reddit-random-post-idea-generator',
    description: 'Shuffle random Reddit thread prompts & formats from local templates (not AI, no posting).',
    longDescription:
      'Break out of predictable posting ruts with a one-click prompt spinner across AMA-style threads, tool teardowns, unpopular opinions, and resource roundups. Uses curated local browser templates—NOT AI and no posting on Reddit.',
    keywords: ['reddit random post idea generator', 'random thread prompt', 'reddit prompt spinner not ai'],
    icon: 'Shuffle',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Random Post Idea Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Spin random discussion, guide, and showcase prompts for Reddit from browser templates (NOT AI, no posting).',
    howTo: [
      {
        title: 'Optionally enter a broad niche',
        description: 'Enter an optional hobby or industry tag (or leave blank for general prompts).',
      },
      {
        title: 'Click shuffle for random templates',
        description: 'Randomly selects structured discussion and teardown templates locally (NOT AI).',
      },
      {
        title: 'Adapt & post manually',
        description: 'Refine your own story in Markdown and follow subreddit guidelines when posting.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Random Post Idea Generator use AI?',
        answer: 'No. It randomly draws from structured prompt templates in your browser—NOT AI.',
      },
      {
        question: 'Does this post anything to Reddit?',
        answer: 'No. Zero Reddit account connection or posting.',
      },
      {
        question: 'How is it different from Reddit Post Idea Generator?',
        answer: 'Post Idea Generator maps specifically to your structured inputs, while Random Post Idea Generator surprises you with shuffled formats.',
      },
      {
        question: 'Can I schedule chosen prompts?',
        answer: 'Yes. Organize posting dates in Reddit Content Calendar Generator.',
      },
    ],
    relatedTools: [
      'reddit-post-idea-generator',
      'reddit-content-calendar-generator',
      'reddit-question-generator',
      'reddit-markdown-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-username-checker',
    name: 'Reddit Username Checker',
    slug: 'reddit-username-checker',
    category: 'reddit-tools',
    url: '/reddit-username-checker',
    description: 'Validate Reddit u/username syntax & 3–20 char format rules ONLY—never checks live availability.',
    longDescription:
      'Test whether a desired u/username satisfies Reddit’s exact naming constraints (3–20 characters using letters, numbers, underscores, and hyphens—no spaces) locally in your browser. Checks FORMAT ONLY and never checks live Reddit account availability.',
    keywords: ['reddit username checker', 'u handle format validator', 'check reddit username rules'],
    icon: 'CheckSquare',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Username Checker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Validate Reddit u/username length (3–20 chars) and character rules in browser. Format check only—never real availability.',
    howTo: [
      {
        title: 'Type a candidate u/username',
        description: 'Enter your desired handle with or without the u/ prefix.',
      },
      {
        title: 'Inspect syntax & length rules',
        description: 'Checks 3–20 character bounds and allowed characters (A-Z, 0-9, underscore, hyphen).',
      },
      {
        title: 'Verify live availability on Reddit',
        description: 'Because this tool checks FORMAT ONLY, confirm real availability during Reddit sign-up.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Username Checker check real Reddit availability?',
        answer: 'No. It checks FORMAT ONLY (length 3–20 and valid characters)—never live account availability.',
      },
      {
        question: 'Are hyphens allowed in Reddit usernames?',
        answer: 'Yes. Usernames allow letters, numbers, underscores (_), and hyphens (-), whereas subreddit names omit hyphens.',
      },
      {
        question: 'Does this require signing into Reddit?',
        answer: 'No. Runs 100% locally in your browser.',
      },
      {
        question: 'Checking a community r/ name instead?',
        answer: 'Use Reddit Subreddit Name Generator (3–21 characters, underscores only).',
      },
    ],
    relatedTools: [
      'reddit-subreddit-name-generator',
      'reddit-title-character-counter',
      'reddit-post-character-counter',
      'reddit-markdown-formatter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-text-to-markdown-converter',
    name: 'Reddit Text to Markdown Converter',
    slug: 'reddit-text-to-markdown-converter',
    category: 'reddit-tools',
    url: '/reddit-text-to-markdown-converter',
    description: 'Convert plain notes, pasted lists & URLs into clean Reddit-flavored Markdown locally.',
    longDescription:
      'Turn raw notes or pasted spreadsheet columns into properly escaped Reddit Markdown with headings, numbered/bulleted lists, quote blocks, and tables. Deterministic browser conversion only—zero AI and no posting on Reddit.',
    keywords: ['reddit text to markdown converter', 'plain text to reddit markdown', 'csv to reddit table'],
    icon: 'ArrowLeftRight',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Text to Markdown Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert plain notes and pasted rows into clean Reddit-flavored Markdown syntax locally in your browser.',
    howTo: [
      {
        title: 'Paste plain notes or tab-separated rows',
        description: 'Paste structured notes, links, or spreadsheet snippets.',
      },
      {
        title: 'Run rule-based Markdown conversion',
        description: 'Escapes special Markdown symbols and outputs valid Reddit lists, links, and pipe tables.',
      },
      {
        title: 'Preview & copy for Markdown Mode',
        description: 'Copy formatted Markdown directly into Reddit’s Markdown editor manually.',
      },
    ],
    faqs: [
      {
        question: 'Does this handle Reddit pipe tables?',
        answer: 'Yes. Tab- or comma-separated pasted rows convert cleanly into aligned Reddit Markdown tables.',
      },
      {
        question: 'Does it use AI to summarize text?',
        answer: 'No. It preserves your exact text and deterministically converts structure to Markdown.',
      },
      {
        question: 'Need to export Reddit Markdown back into web HTML?',
        answer: 'Use Reddit Markdown to HTML Converter.',
      },
      {
        question: 'Does this upload my notes?',
        answer: 'No. Conversion runs completely inside your browser tab.',
      },
    ],
    relatedTools: [
      'reddit-markdown-formatter',
      'reddit-markdown-to-html-converter',
      'reddit-text-formatter',
      'reddit-post-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-markdown-to-html-converter',
    name: 'Reddit Markdown to HTML Converter',
    slug: 'reddit-markdown-to-html-converter',
    category: 'reddit-tools',
    url: '/reddit-markdown-to-html-converter',
    description: 'Convert Reddit Markdown posts, guides & tables into clean semantic HTML locally.',
    longDescription:
      'Republish your long-form Reddit tutorials or subreddit wiki pages on a blog or documentation site. Converts Reddit-flavored Markdown (including tables, code blocks, quotes, and links) into clean semantic HTML inside your browser—zero uploads.',
    keywords: ['reddit markdown to html converter', 'subreddit wiki to html', 'markdown html browser converter'],
    icon: 'FileCode2',
    acceptedFormats: ['Markdown', 'Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Markdown to HTML Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert Reddit Markdown guides, wiki docs, and tables into clean HTML code locally in your browser.',
    howTo: [
      {
        title: 'Paste Reddit Markdown source',
        description: 'Paste a saved Reddit post or wiki page written in Markdown.',
      },
      {
        title: 'Convert & inspect HTML preview',
        description: 'Deterministic parser transforms headings, lists, blockquotes, and tables into clean HTML.',
      },
      {
        title: 'Copy clean HTML markup',
        description: 'Toggle between raw HTML snippet and rendered preview with zero server requests.',
      },
    ],
    faqs: [
      {
        question: 'Does this support Reddit spoiler tags or tables?',
        answer: 'Yes. Pipe tables convert to standard HTML `<table>` tags, and spoilers map to clean spans/details.',
      },
      {
        question: 'Does it sanitize HTML safely?',
        answer: 'Yes. Output uses clean semantic HTML tags without raw unsafe script injection.',
      },
      {
        question: 'Can I convert plain text into Reddit Markdown first?',
        answer: 'Yes. Open Reddit Text to Markdown Converter.',
      },
      {
        question: 'Is any server call made?',
        answer: 'No. Parsing executes locally in your browser.',
      },
    ],
    relatedTools: [
      'reddit-markdown-formatter',
      'reddit-text-to-markdown-converter',
      'reddit-text-formatter',
      'reddit-post-character-counter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'reddit-content-calendar-generator',
    name: 'Reddit Content Calendar Generator',
    slug: 'reddit-content-calendar-generator',
    category: 'reddit-tools',
    url: '/reddit-content-calendar-generator',
    description: 'Organize subreddit discussions & mod threads with browser templates (not AI, no posting).',
    longDescription:
      'Keep subreddit weekly megathreads, AMA announcements, and community discussions organized across weeks. Built strictly from editable browser templates (NOT AI)—for Reddit users and moderators with zero Reddit login or automated posting.',
    keywords: ['reddit content calendar generator', 'subreddit megathread planner', 'mod schedule template not ai'],
    icon: 'Calendar',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Reddit Content Calendar Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build an editable subreddit discussion & megathread schedule using browser templates (NOT AI, no posting).',
    howTo: [
      {
        title: 'List target subreddits or recurring threads',
        description: 'Enter your weekly themes (e.g., Monday Q&A, Friday Showcase) and cadence.',
      },
      {
        title: 'Generate template schedule',
        description: 'Deterministic calendar builder spreads posts cleanly to avoid over-posting in one community (NOT AI).',
      },
      {
        title: 'Export CSV/Markdown checklist',
        description: 'Track drafts locally and submit manually on Reddit.',
      },
    ],
    faqs: [
      {
        question: 'Does Reddit Content Calendar Generator use AI?',
        answer: 'No. It arranges your threads using structured recurring calendar templates—NOT AI.',
      },
      {
        question: 'Can this tool auto-post scheduled threads on Reddit?',
        answer: 'No. Reddit tools never connect to Reddit or publish posts automatically.',
      },
      {
        question: 'Is it helpful for subreddit moderators?',
        answer: 'Yes. Great for organizing recurring weekly megathreads, rule reminders, and community events.',
      },
      {
        question: 'Need help writing the actual Markdown post templates?',
        answer: 'Use Reddit Markdown Formatter alongside your calendar.',
      },
    ],
    relatedTools: [
      'reddit-post-idea-generator',
      'reddit-random-post-idea-generator',
      'reddit-markdown-formatter',
      'reddit-engagement-rate-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
