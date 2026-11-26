import {
  ArrowRight,
  Clock,
  Cpu,
  FileType,
  HardDrive,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {FaqAccordion} from '../components/FaqAccordion';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  SeoHead,
} from '../components/SeoHead';
import {ToolCard} from '../components/ToolCard';
import {ActiveToolRunner} from '../components/tools/ActiveToolRunner';
import {SITE_CONFIG, toolHasWatermark} from '../config/site';
import {
  getCategoryById,
  getRelatedTools,
  getToolBySlug,
  type ProcessingMethod,
} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {getCategoryStyle, getToolIcon} from '../lib/icons';

interface ToolPageProps {
  slug: string;
}

function getProcessingDetail(method: ProcessingMethod): {
  shortLabel: string;
  explanation: string;
} {
  switch (method) {
    case 'browser':
      return {
        shortLabel: 'Browser-based',
        explanation:
          'This tool is planned to run directly inside your web browser, so files will stay on your device without remote uploads.',
      };
    case 'server-service':
      return {
        shortLabel: 'Server-service',
        explanation:
          'This tool is planned to run on a dedicated, encrypted server pipeline for reliable heavy conversion, security, or encoding.',
      };
    case 'external-api':
      return {
        shortLabel: 'External API',
        explanation:
          'This utility is planned to process requests over an encrypted external API endpoint on demand.',
      };
  }
}

const SPECIAL_DISCLOSURES: Record<string, string> = {
  'sign-pdf':
    'Signature scope notice: Sign PDF will place a basic electronic signature (drawn, typed, or image placement). It is not a certified or cryptographic Certificate Authority (CA) digital signature.',
  'unlock-pdf':
    'Authorization notice: Unlock PDF will strictly require the valid existing password. There will be no password cracking, brute-forcing, or security bypass.',
  'protect-pdf':
    'Permissions notice: While an open password encrypts the file, PDF permission flags (printing, copying, editing) are advisory and depend on viewer software respecting them.',
  'pdf-editor':
    'Editing scope notice: Existing PDF text cannot be edited like Word — text does not reflow. You can add text, highlight, draw, place images, and annotate pages.',
  'pdf-to-excel':
    'Table detection notice: Table detection is imperfect on complex layouts, merged cells, or nested grids.',
  'pdf-to-powerpoint':
    'Layout notice: Slide layout is approximate, not pixel-perfect, when converting PDF pages into PowerPoint slides.',
  'pdf-to-epub':
    'Layout notice: Layout is mostly lost—EPUB output is text-first for clean e-reader reflow.',
  'pdf-to-csv':
    'Table detection notice: Table detection is imperfect on complex layouts and multi-line cells.',
  'heic-to-pdf':
    'Performance notice: Decoding HEIC photos inside the browser may be slow on large files.',
  'video-to-audio':
    'Audio is extracted in your browser — your video never leaves your device. Supports up to 100 MB and 3 minutes max with MP3 output.',
  'profile-photo':
    'This tool crops your photo into a round profile picture with the background colour you choose. It does not automatically detect faces or remove backgrounds.',
  'excel-to-pdf':
    'Simple spreadsheets only — complex formatting, macros, formulas, and embedded charts are not preserved.',
  'youtube-embed-code-generator':
    'Template/formula-based only — NOT AI-generated. Builds standard responsive YouTube iframe HTML code from your parameters in the browser.',
  'youtube-timestamp-link-generator':
    'Formula-based only — NOT AI-generated. Computes exact start-time query parameters (?t=...) locally in your browser.',
  'youtube-thumbnail-text-extractor':
    'Coming soon — reliable in-browser text extraction from thumbnail images is not yet supported in-browser. This tool is currently in development.',
  'youtube-tag-generator':
    'Template and keyword-combination based only — NOT AI-generated. Expands your topic with curated tag patterns locally in your browser.',
  'youtube-hashtag-generator':
    'Template and keyword-rule based only — NOT AI-generated. Builds clean YouTube hashtag combinations from your seed keywords in the browser.',
  'youtube-title-generator':
    'Template/formula-based only — NOT AI-generated. Applies proven structural title formulas to your topic keywords locally in your browser.',
  'youtube-description-generator':
    'Template-based only — NOT AI-generated. Assembles structured summary, link, timestamp, and call-to-action blocks using editable templates.',
  'youtube-channel-name-generator':
    'Template and word-combination based only — NOT AI-generated. Mixes niche prefixes, suffixes, and formatting rules locally in your browser.',
  'youtube-username-generator':
    'Template and handle-rule based only — NOT AI-generated. Formats clean handle suggestions matching YouTube character rules in your browser.',
  'youtube-script-generator':
    'Template outline only — NOT AI-written. Builds editable hook, intro, talking-point, and CTA script sections from structured templates in your browser.',
  'youtube-hook-generator':
    'Template/formula-based only — NOT AI-generated. Generates opening-line prompts from proven retention hook frameworks in your browser.',
  'youtube-video-idea-generator':
    'Template/formula-based only — NOT AI-generated. Combines your niche keyword with proven video format matrices in your browser.',
  'youtube-shorts-idea-generator':
    'Template/formula-based only — NOT AI-generated. Maps your topic into vertical 60-second Shorts prompt templates locally in your browser.',
  'youtube-chapter-generator':
    'Template and timestamp-formatting helper only — NOT AI-generated. Validates and formats 00:00 chapter markers cleanly in your browser.',
  'youtube-pinned-comment-generator':
    'Template-based only — NOT AI-generated. Provides editable engagement question, link, and poll comment templates locally in your browser.',
  'youtube-content-calendar-generator':
    'Template/formula-based only — NOT AI-generated. Generates an editable weekly publishing schedule from your cadence and video pillars.',
  'youtube-earnings-calculator':
    'Estimate-only disclaimer: actual earnings vary by niche, country and ad rates. Formula results are for educational planning only.',
  'youtube-rpm-calculator':
    'Estimate-only disclaimer: actual RPM varies by niche, audience country, season and ad formats.',
  'youtube-cpm-calculator':
    'Estimate-only disclaimer: actual advertiser CPM rates vary by niche, geography and seasonal demand.',
  'instagram-username-availability-format-checker':
    'Format check only — validates Instagram username syntax rules (1–30 characters, letters, numbers, periods, and underscores). It cannot check live username availability on Instagram.',
  'instagram-giveaway-winner-picker':
    'Pasted entries only — picks random winners strictly from the names or comments you paste into the browser. It cannot connect to Instagram or fetch real entrants or comments.',
  'instagram-random-comment-picker':
    'Pasted comments only — picks random comments strictly from the list you paste into the browser. It cannot connect to Instagram or fetch real post comments.',
  'instagram-best-posting-time-planner':
    'Planning guide only — combines general engagement-window benchmarks with your own audience timezone and schedule inputs. It cannot connect to Instagram or fetch real account analytics.',
  'facebook-giveaway-winner-picker':
    'Pasted entries only — picks random winners strictly from the names or comments you paste into the browser. It cannot connect to Facebook or fetch real entrants or comments.',
  'facebook-random-comment-picker':
    'Pasted comments only — picks random comments strictly from the list you paste into the browser. It cannot connect to Facebook or fetch real post comments.',
  'facebook-post-scheduler-planner':
    'Plan only — organizes and exports your upcoming Facebook publishing calendar locally in your browser. It cannot connect to Facebook, schedule live posts, or publish automatically.',
  'tiktok-username-format-checker':
    'Format check only — validates TikTok handle length (2–24 characters), allowed letters/numbers/underscores/periods, and trailing-period syntax locally. Never checks live TikTok username availability.',
  'tiktok-trending-hashtag-ideas-generator':
    'Template hashtag ideas only — NOT live TikTok trending data and NOT AI-generated. Provides curated category starter tag templates for manual review.',
  'tiktok-viral-video-idea-generator':
    'Template brainstorming frameworks only — NOT AI-generated and cannot guarantee virality, views, or For You placement.',
  'tiktok-script-generator':
    'Template outline only — NOT AI-written. Builds editable Hook, Setup, Value Steps, and CTA bullet sections inside your browser.',
  'tiktok-money-calculator':
    'Estimate-only disclaimer: actual TikTok payouts vary significantly by viewer region, qualified 1-minute+ views, niche, watch time, and sponsorship terms.',
  'tiktok-earnings-calculator':
    'Estimate-only disclaimer: actual TikTok Creator Rewards and brand-deal earnings vary by country, niche, qualified view share, and advertiser rates.',
  'tiktok-best-posting-time-planner':
    'Planning guide only — combines general engagement-window benchmarks with your own timezone and schedule inputs. Cannot fetch live TikTok analytics.',
  'tiktok-giveaway-winner-picker':
    'Pasted entries only — draws random winners strictly from names or handles you paste into the browser. Cannot connect to TikTok or fetch real entrants.',
  'tiktok-random-comment-picker':
    'Pasted comments only — picks random comments strictly from the list you paste into the browser. Cannot fetch live TikTok post comments.',
  'tiktok-video-file-size-estimator':
    'Estimate only — approximates MP4 file weight from bitrate and duration formulas. Actual variable-bitrate (VBR) exports vary with motion complexity.',
  'pinterest-pin-text-extractor':
    'Uses free in-browser OCR — text is recognized locally on your device without external paid APIs or image uploads. Accuracy depends on font clarity and contrast.',
  'pinterest-alt-text-generator':
    'User-described alt text only — builds accessible alt text strictly from YOUR own visual description of the image using browser templates. NOT auto-vision and NOT AI.',
  'reddit-username-checker':
    'Format check only — validates Reddit u/ username syntax (3–20 characters and allowed letters, numbers, underscores, or hyphens) locally in your browser. Never checks live Reddit availability or logs into Reddit.',
  'snapchat-username-format-checker':
    'Format check only — validates Snapchat username syntax (3–15 characters, starts with a letter, allowed letters/numbers/periods/underscores/hyphens) locally in your browser. Never checks live Snapchat availability.',
  'reddit-karma-calculator':
    "Estimate-only disclaimer: Reddit's exact karma calculation formula is not public. Results are directional estimates based on submission scores and upvote ratios, with zero Reddit login.",
  'reddit-comment-picker':
    'Pasted comments only — picks random winners or replies strictly from text you paste into the browser. Designed for Reddit users without posting to Reddit or logging into an account.',
  'snapchat-score-tracker-template':
    'Browser-saved tracker only — records your manual Snap Score log entries locally inside your browser without Snapchat login or live account syncing.',
  'linkedin-profile-optimization-checklist':
    'Browser-saved checklist only — saves your LinkedIn profile audit progress locally in your browser with zero LinkedIn login required.',
  'unit-land-area-converter':
    'Regional variation notice: Bigha size varies by region (alongside biswa and katha) depending on state and local revenue definitions. Fixed units such as acre, hectare, cent, guntha, and gaj follow standard multipliers.',
  'indian-land-unit-converter':
    'State-variation notice: Local Indian land-unit names (such as bigha, biswa, katha, and dhur) represent DIFFERENT areas in different Indian states and districts. Select your state preset carefully and confirm with local revenue deeds.',
  'unit-currency-converter':
    'Indicative mid-market rate notice: Exchange rates will load via a free public exchange-rate API with no API key, or manual rate entry if the API is unavailable. Displayed rates are indicative mid-market rates, not bank or remittance rates.',
  'productivity-expense-reminder':
    'Currency-neutral local tracker: Type any currency symbol or code you prefer. All entries and category spending totals stay saved locally in your browser.',
  'productivity-medicine-reminder':
    'Personal reminder checklist only: Saves doses and times locally in your browser with daily tick resets. Not medical advice and does not send push alarms.',
  'developer-text-to-speech':
    'Device SpeechSynthesis notice: Reads pasted text aloud via your browser SpeechSynthesis API—available voices depend on your device and browser, with zero cloud AI uploads.',
  'developer-speech-to-text':
    'Microphone & browser support notice: Requires microphone permission and uses your browser Web Speech Recognition API. Browser support varies—works mainly in Chrome and Safari.',
  'document-contract-generator':
    'Legal scope notice: Contract Generator formats starter agreements (such as NDAs) from templates and your entered clauses (NOT AI). Templates are general documents only, NOT legal advice.',
  'document-bill-generator':
    'Currency-neutral template notice: Formats simple bills with business details, optional GSTIN, customer, line items, and tax from browser templates (NOT AI) in any currency you type.',
  'document-invoice-generator':
    'Currency-neutral template notice: Builds invoices with logo, client details, line items, tax rate, and due date from browser templates (NOT AI) in any currency you type.',
  'finance-gst-calculator':
    'Country scope notice: GST Calculator is India-specific—tailored for Indian GST rates and 50/50 CGST/SGST splits.',
  'finance-income-tax-calculator':
    'Country scope notice: Income Tax Calculator is India-specific—modeled strictly for Indian income-tax slabs (FY 2025–26 & FY 2026–27) with ₹75,000 standard deduction, Section 87A rebate, surcharge, and 4% cess.',
  'finance-salary-calculator':
    'Country scope notice: Salary Calculator is India-specific—structured for Indian CTC packages, EPF, professional tax, and FY 2026–27 New-Regime income tax.',
  'finance-sip-calculator':
    'ESTIMATE-ONLY disclaimer: Mutual fund SIP projections apply a constant hypothetical annual return rate for planning illustration only. Actual market returns vary and are not guaranteed.',
  'lookup-mac-address-lookup':
    'Vendor-only scope notice: Searches public IEEE OUI prefixes by full/partial MAC address or company name to identify the hardware manufacturer ONLY—it can never identify an individual device owner, person, or location.',
  'lookup-trademark-class-finder':
    'Classification guide only: Narrows down goods and services across the 45 standard Nice Classification trademark classes inside your browser (NOT AI). This is a preliminary reference guide ONLY and NOT legal advice.',
  'mac-address-generator':
    'Test-address scope notice: Generates random locally-administered MAC addresses via Web Crypto for development and network QA tests (NOT AI)—never real physical device addresses.',
  'django-secret-key-generator':
    'Browser-only security notice: Uses Web Crypto (crypto.getRandomValues) locally inside your browser tab (NOT AI). Generated SECRET_KEY strings are never sent or stored.',
  'wordpress-secret-key-generator':
    'Browser-only security notice: Generates all 8 WordPress security keys and salts locally via Web Crypto (NOT AI). Generated wp-config.php keys are never transmitted or logged.',
};

function getSpecialDisclosure(toolId: string, category: string): string | undefined {
  if (SPECIAL_DISCLOSURES[toolId]) {
    return SPECIAL_DISCLOSURES[toolId];
  }
  if (category === 'generators' && toolId.endsWith('-generator')) {
    return 'Deterministic rules & browser randomness only — NOT AI-generated. Runs locally inside your browser tab without storing or transmitting your inputs.';
  }
  if (category === 'document-tools' && toolId.endsWith('-generator')) {
    return 'Template-based only — NOT AI-generated. Builds structured print and PDF layouts deterministically from your own form entries locally in your browser.';
  }
  if (category === 'number-system-converters') {
    return 'Pure formula calculator — NOT AI. Evaluates deterministic digital logic and two-way bitwise conversions directly inside your browser.';
  }
  if (
    (category === 'instagram-tools' ||
      category === 'facebook-tools' ||
      category === 'tiktok-tools' ||
      category === 'pinterest-tools' ||
      category === 'linkedin-tools' ||
      category === 'reddit-tools' ||
      category === 'twitter-tools' ||
      category === 'snapchat-tools' ||
      category === 'threads-tools') &&
    toolId.endsWith('-generator')
  ) {
    if (toolId.includes('font-generator') || toolId.includes('stylish-text')) {
      return 'Template & Unicode mapping only — NOT AI-generated. Converts your text into styled Unicode characters and pairing presets locally in your browser with zero social login.';
    }
    if (toolId.includes('mockup-generator') || toolId.includes('preview-generator')) {
      return 'Template mockup only — NOT AI-generated. Arranges your entered text and images inside an editable browser layout frame with zero social login.';
    }
    if (category === 'reddit-tools') {
      return 'Template-based only — NOT AI-generated. Built for Reddit users locally in your browser with zero social login and no posting on Reddit.';
    }
    return 'Template-based only — NOT AI-generated. Combines structured editorial templates, formulas, and your topic inputs locally in your browser with zero social login.';
  }
  if (category === 'reddit-tools') {
    return 'Browser utility for Reddit users — runs locally with zero Reddit login and cannot post or submit content to Reddit.';
  }
  return undefined;
}

export function ToolPage({slug}: ToolPageProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const category = getCategoryById(tool.category);
  const relatedTools = getRelatedTools(tool);
  const Icon = getToolIcon(tool.icon);
  const style = getCategoryStyle(tool.category);
  const processingDetail = getProcessingDetail(tool.processingMethod);
  const specialDisclosure = getSpecialDisclosure(tool.id, tool.category);
  const showWatermarkNotice = toolHasWatermark(tool.id);
  const isVideoTool = tool.category === 'video-tools';

  useEffect(() => {
    if (!isVideoTool) return;
    // Lazy-load open-source FFmpeg processor spec ONLY when a video tool page opens
    void import('../lib/videoProcessor');
  }, [isVideoTool]);

  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    ...(category ? [{label: category.name, url: category.url}] : []),
    {label: tool.name, url: tool.url},
  ];

  const sizeLabel =
    tool.maxFileSizeMB !== null
      ? tool.maxDurationMinutes !== undefined
        ? tool.maxResolution
          ? `${tool.maxFileSizeMB} MB · ${tool.maxDurationMinutes} min max · ${tool.maxResolution} max`
          : tool.slug === 'video-to-audio'
            ? `${tool.maxFileSizeMB} MB · ${tool.maxDurationMinutes} min max · MP3 output`
            : `${tool.maxFileSizeMB} MB · ${tool.maxDurationMinutes} min max`
        : tool.maxClipSeconds !== undefined
          ? `${tool.maxFileSizeMB} MB · ${tool.maxClipSeconds} sec clip max`
          : tool.slug === 'audio-converter'
            ? `${tool.maxFileSizeMB} MB · 128–320 kbps`
            : tool.maxFiles && tool.maxFiles > 1
              ? `${tool.maxFileSizeMB} MB each`
              : `${tool.maxFileSizeMB} MB per file`
      : tool.maxDataRows !== undefined
        ? 'No file upload'
        : 'No file upload';

  const maxFilesLabel =
    tool.maxFiles !== null
      ? `${tool.maxFiles} ${tool.maxFiles === 1 ? 'file' : 'files'}`
      : tool.maxDataRows !== undefined
        ? `${tool.maxDataRows} rows max`
        : 'Browser tool';

  return (
    <>
      <SeoHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        canonicalPath={tool.url}
        jsonLd={[buildBreadcrumbSchema(breadcrumbs), buildFaqSchema(tool.faqs)]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        {/* TinyWow-Style Centered Tool Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${style.solidIconBg} shadow-xs`}
          >
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {tool.description}
          </p>
        </div>

        {/* Visible Limit Strip */}
        <section
          aria-label={tool.status === 'active' ? 'Tool limits' : 'Planned tool limits'}
          className="mx-auto mt-8 max-w-4xl grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 sm:grid-cols-4"
        >
          <div className="bg-white dark:bg-slate-900 p-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <FileType className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
              <span>Formats</span>
            </div>
            <div className="mt-1 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
              {tool.acceptedFormats.join(', ')}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <HardDrive className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
              <span>{isVideoTool ? 'Video Limits' : 'File Limit'}</span>
            </div>
            <div className="mt-1 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {sizeLabel}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Layers className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
              <span>Batch Limit</span>
            </div>
            <div className="mt-1 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {maxFilesLabel}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-[#0A8CFF]" aria-hidden="true" />
              <span>Processing</span>
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
              {processingDetail.shortLabel}
            </div>
          </div>
        </section>

        {/* Active Tool Runner OR Centered Coming Soon Panel */}
        {tool.status === 'active' ? (
          <div id="tool-workspace">
            <ActiveToolRunner key={tool.slug} tool={tool} />
          </div>
        ) : (
          <section
            aria-label="Tool availability status"
            className="mx-auto mt-6 max-w-4xl rounded-[18px] border-2 border-dashed border-sky-200 dark:border-slate-700 bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900/90 dark:to-slate-900/60 p-8 sm:p-12 text-center"
          >
            <div className="mx-auto max-w-xl">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${style.tileBg} ${style.tileText}`}
              >
                <Clock className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                {tool.name} — Coming Soon
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {tool.longDescription}
              </p>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Planned execution ({processingDetail.shortLabel}):{' '}
                </strong>
                {processingDetail.explanation} File uploads and processing are not active yet in Phase 1.
              </p>

              {specialDisclosure && (
                <div className="mt-5 rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-left flex items-start gap-3">
                  <ShieldAlert
                    className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-xs sm:text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                    {specialDisclosure}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {category && (
                  <Link
                    to={category.url}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-6 text-sm font-semibold text-white transition-colors whitespace-nowrap"
                  >
                    <span>Browse {category.name}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
                <Link
                  to="/tools"
                  className="inline-flex h-11 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap"
                >
                  {EN_STRINGS.common.browseAllTools}
                </Link>
              </div>
            </div>
          </section>
        )}

        {showWatermarkNotice && (
          <p className="mx-auto mt-3.5 max-w-2xl text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Downloads include a small {SITE_CONFIG.siteName} logo watermark in the bottom-right
            corner.
          </p>
        )}

        {isVideoTool && (
          <p className="mx-auto mt-3.5 max-w-2xl text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Video processing runs in your browser and can take a while for larger files. Please keep
            your video within the limits above.
          </p>
        )}

        {/* 3-Step "How To" Strip */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white text-center mb-7">
            {tool.status === 'active'
              ? `How to Use ${tool.name}`
              : `How to Use ${tool.name} (Planned Workflow)`}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {tool.howTo.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] dark:shadow-none"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/15 font-mono text-sm font-bold text-[#0A8CFF] tabular-nums">
                  {idx + 1}
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Long Description */}
        <section className="mt-12 rounded-[14px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            About {tool.name}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {tool.longDescription}
          </p>
        </section>

        {/* 4 FAQs in an Accordion */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-5">
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={tool.faqs} />
        </section>

        {/* 4 Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Related Tools
              </h2>
              <Link
                to="/tools"
                className="text-sm font-semibold text-[#0A8CFF] hover:text-[#0077E6] transition-colors"
              >
                View all tools
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
