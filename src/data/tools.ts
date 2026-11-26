import {SITE_CONFIG} from '../config/site';
import {DEVELOPER_TOOLS} from './developerTools';
import {DOCUMENT_TOOLS} from './documentTools';
import {FINANCE_TOOLS} from './financeTools';
import {GENERATOR_TOOLS} from './generatorTools';
import {LAND_AREA_UNIT_TOOLS} from './landAreaTools';
import {LOOKUP_TOOLS} from './lookupTools';
import {NUMBER_SYSTEM_TOOLS} from './numberSystemTools';
import {PRODUCTIVITY_TOOLS} from './productivityTools';
import {SCIENCE_TOOLS} from './scienceTools';
import {UNIT_CONVERTER_ADDITIONS} from './unitConverterAdditions';
import {UNIT_CONVERTER_TOOLS} from './unitConverters';

export type ProcessingMethod = 'browser' | 'server-service' | 'external-api';

export type ToolCategoryId =
  | 'pdf-tools'
  | 'image-tools'
  | 'video-tools'
  | 'converter-tools'
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
          'We are launching the platform in focused stages. Our initial 172 planned tools span PDF, Image, Video, Converter, Productivity, Unit Converters, Number Systems, Lookup, Science, Generators, Developer, Document, and Finance Tools, while File Tools utilities are scheduled for a later phase.',
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
          'Not yet. This category is part of our 15-category architecture and will be populated after the initial 172 tools across our active suites are rolled out.',
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
        question: 'Where can I browse the 172 tools already in the catalog?',
        answer:
          'You can browse every currently cataloged tool on the All Tools directory page or explore all populated categories across media, productivity, unit converter, number system, lookup, science, generator, developer, document, and finance suites.',
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
          'Select any PDF up to 50 MB (or test with the built-in 3-page sample PDF) to view a live page preview directly in your browser. Files never leave your device.',
      },
      {
        title: 'Create or upload your signature',
        description:
          'Draw with mouse or finger, type your name in signature cursive, or upload a PNG/JPG signature image.',
      },
      {
        title: 'Drag to position & apply stamp',
        description:
          'Switch pages in the PDF preview, drag your signature directly with touch or mouse (or choose a preset / exact X-Y coordinates), and apply the visual stamp cleanly in your browser.',
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
