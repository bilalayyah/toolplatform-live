import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const DEVELOPER_TOOLS: readonly Tool[] = [
  {
    id: 'developer-json-formatter',
    name: 'JSON Formatter',
    slug: 'developer-json-formatter',
    category: 'developer-tools',
    url: '/developer-json-formatter',
    description:
      'Format messy JSON payloads with clean indentation, minify for compact transfer, and catch exact syntax errors in your browser.',
    longDescription:
      'Paste raw API responses or config blobs to pretty-print nested objects, minify whitespace down to one line, and pinpoint exact JSON syntax errors with line/column feedback directly in your browser—zero server uploads and no AI.',
    keywords: [
      'json formatter',
      'json validator',
      'minify json',
      'catch json syntax errors',
      'pretty print json',
    ],
    icon: 'Braces',
    acceptedFormats: ['JSON', 'Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `JSON Formatter — Format, Minify & Validate | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format messy JSON, minify payloads cleanly, and catch syntax errors locally inside your browser.',
    howTo: [
      {
        title: 'Paste JSON input',
        description:
          'Once live, paste raw or single-line JSON straight into the editor.',
      },
      {
        title: 'Format, minify, or validate',
        description:
          'Switch between indented formatting and compact minification while catching syntax errors immediately.',
      },
      {
        title: 'Copy clean JSON',
        description:
          'Copy validated JSON output without sending data over the network.',
      },
    ],
    faqs: [
      {
        question: 'Are private API payloads uploaded anywhere?',
        answer:
          'No. Parsing, validation, and formatting happen entirely inside your browser.',
      },
      {
        question: 'Does JSON Formatter report invalid syntax locations?',
        answer:
          'Yes. Syntax errors surface the exact failing token or line position.',
      },
      {
        question: 'Can I both pretty-print and minify JSON?',
        answer:
          'Yes. Both formatted and single-line minified outputs are one click apart.',
      },
      {
        question: 'Can I convert JSON to XML or CSV instead?',
        answer:
          'Yes. Use JSON to XML or CSV to JSON under Converter Tools.',
      },
    ],
    relatedTools: [
      'developer-xml-formatter',
      'developer-code-beautifier',
      'json-to-xml',
      'csv-to-json',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-xml-formatter',
    name: 'XML Formatter',
    slug: 'developer-xml-formatter',
    category: 'developer-tools',
    url: '/developer-xml-formatter',
    description:
      'Format XML documents, minify tags, and validate structure using your browser’s built-in XML parser.',
    longDescription:
      'Beautify tangled sitemaps, SOAP responses, or RSS feeds, minify whitespace cleanly, and validate well-formed XML trees with your browser’s native DOMParser XML engine—zero remote calls and no AI.',
    keywords: [
      'xml formatter',
      'xml validator',
      'minify xml',
      'browser xml parser',
      'pretty print xml',
    ],
    icon: 'FileCode2',
    acceptedFormats: ['XML', 'Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `XML Formatter — Format, Minify & Validate | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format XML tags, minify files, and validate structure using your browser’s native XML parser.',
    howTo: [
      {
        title: 'Paste XML source',
        description:
          'Once live, paste an XML snippet, sitemap, or feed directly in the browser.',
      },
      {
        title: 'Validate with browser XML parser',
        description:
          'Native browser XML parsing checks unclosed tags and attribute syntax instantly.',
      },
      {
        title: 'Format or minify & copy',
        description:
          'Pick clean indentation or single-line XML and copy the result.',
      },
    ],
    faqs: [
      {
        question: 'How does XML Formatter validate XML?',
        answer:
          'It validates document structure using your browser’s built-in DOMParser XML engine without external servers.',
      },
      {
        question: 'Can I both indent and minify XML?',
        answer:
          'Yes. Toggle cleanly between indented tree formatting and compact minification.',
      },
      {
        question: 'Does it preserve CDATA and XML comments?',
        answer:
          'Yes. Valid XML comments and CDATA nodes stay intact during formatting.',
      },
      {
        question: 'Can I convert XML to JSON or CSV?',
        answer:
          'Yes. Use XML to JSON or XML to CSV under Converter Tools.',
      },
    ],
    relatedTools: [
      'developer-json-formatter',
      'developer-code-beautifier',
      'xml-to-json',
      'xml-to-csv',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-code-beautifier',
    name: 'Code Beautifier',
    slug: 'developer-code-beautifier',
    category: 'developer-tools',
    url: '/developer-code-beautifier',
    description:
      'Format minified or messy JavaScript, HTML, CSS, and JSON with automatic language detection and 2/4 spaces or tabs.',
    longDescription:
      'Clean up minified bundles or pasted snippets across JavaScript, HTML, CSS, and JSON right inside your browser. Language is auto-detected (with manual override), and you can pick 2 spaces, 4 spaces, or tabs cleanly—rule-based formatting, NOT AI.',
    keywords: [
      'code beautifier',
      'js html css json formatter',
      'auto detect language',
      '2 4 spaces tabs',
      'unminify code',
    ],
    icon: 'Code2',
    acceptedFormats: ['JS', 'HTML', 'CSS', 'JSON'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Code Beautifier — JS, HTML, CSS & JSON | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format minified or messy JavaScript, HTML, CSS, and JSON with auto-detected language and 2/4 spaces or tab indentation.',
    howTo: [
      {
        title: 'Paste messy or minified code',
        description:
          'Once live, paste JS, HTML, CSS, or JSON—language detection identifies the format automatically.',
      },
      {
        title: 'Select 2/4 spaces or tabs',
        description:
          'Choose your preferred indentation width or switch the detected language manually.',
      },
      {
        title: 'Copy beautified code',
        description:
          'Copy neatly indented source code directly inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Which languages does Code Beautifier format?',
        answer:
          'JavaScript, HTML, CSS, and JSON are supported with automatic language detection.',
      },
      {
        question: 'What indentation options are included?',
        answer:
          'Choose 2 spaces, 4 spaces, or tabs.',
      },
      {
        question: 'Does Code Beautifier rewrite logic using AI?',
        answer:
          'No. It uses deterministic parser/formatter rules only—NOT AI—so code logic never changes.',
      },
      {
        question: 'Is my source code uploaded to a server?',
        answer:
          'No. Formatting executes locally inside your browser tab.',
      },
    ],
    relatedTools: [
      'developer-json-formatter',
      'developer-xml-formatter',
      'developer-base64-encoder-decoder',
      'developer-url-encoder-decoder',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-color-picker',
    name: 'Color Picker',
    slug: 'developer-color-picker',
    category: 'developer-tools',
    url: '/developer-color-picker',
    description:
      'Pick any colour, read exact HEX, RGB, and HSL codes, and explore complementary, analogous, and triadic colour matches.',
    longDescription:
      'Select exact UI shades visually or type HEX/RGB/HSL values to convert across formats instantaneously, while previewing mathematically computed complementary, analogous, and triadic harmony swatches in your browser.',
    keywords: [
      'color picker',
      'hex rgb hsl converter',
      'complementary analogous triadic',
      'ui color harmony',
      'colour picker',
    ],
    icon: 'Palette',
    acceptedFormats: ['HEX', 'RGB', 'HSL'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Color Picker — HEX, RGB, HSL & Harmonies | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Pick a colour and get exact HEX, RGB, and HSL codes plus complementary, analogous, and triadic swatches in your browser.',
    howTo: [
      {
        title: 'Pick or paste a colour',
        description:
          'Once live, drag the spectrum picker or enter a HEX, RGB, or HSL value.',
      },
      {
        title: 'Read HEX, RGB, and HSL codes',
        description:
          'Inspect synchronized format codes ready for CSS, Tailwind, or design tokens.',
      },
      {
        title: 'Copy colour harmonies',
        description:
          'Explore complementary, analogous, and triadic swatches calculated deterministically.',
      },
    ],
    faqs: [
      {
        question: 'Which colour code formats are displayed?',
        answer:
          'Every selected colour shows live synchronized HEX, RGB, and HSL values.',
      },
      {
        question: 'Which colour harmonies are calculated?',
        answer:
          'Complementary, analogous, and triadic colour matches are calculated directly via hue rotation math.',
      },
      {
        question: 'Does this need image uploads or AI?',
        answer:
          'No. Instant HSL math runs inside your browser.',
      },
      {
        question: 'Can I copy colours straight into CSS or design tools?',
        answer:
          'Yes. Copy any HEX, RGB, HSL, or harmony swatch with one click.',
      },
    ],
    relatedTools: [
      'developer-code-beautifier',
      'developer-json-formatter',
      'convert-image',
      'developer-base64-encoder-decoder',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-text-to-speech',
    name: 'Text to Speech',
    slug: 'developer-text-to-speech',
    category: 'developer-tools',
    url: '/developer-text-to-speech',
    description:
      'Paste text and hear it read aloud with device voices plus speed and pitch sliders via browser SpeechSynthesis.',
    longDescription:
      'Listen back to drafts, articles, or code docs directly in your browser using your operating system’s built-in `SpeechSynthesis` API with voice selector, speaking speed, and pitch controls. Available voices depend on your device and browser—no cloud TTS APIs or AI voices are used.',
    keywords: [
      'text to speech',
      'browser speechsynthesis',
      'read aloud speed pitch',
      'device voices tts',
      'tts reader',
    ],
    icon: 'Volume2',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Text to Speech — Browser SpeechSynthesis | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Paste text to hear it read aloud with device voices, speed, and pitch controls via browser SpeechSynthesis (voices vary by device).',
    howTo: [
      {
        title: 'Paste text to read aloud',
        description:
          'Once live, enter any paragraph, draft, or notes into the text area.',
      },
      {
        title: 'Pick device voice, speed & pitch',
        description:
          'Select from voices exposed by your browser/OS via SpeechSynthesis and tune speed or pitch.',
      },
      {
        title: 'Play, pause, or stop locally',
        description:
          'Audio plays locally on your device without sending text to remote servers.',
      },
    ],
    faqs: [
      {
        question: 'Why does voice availability differ between computers or phones?',
        answer:
          'Text to Speech uses your browser’s native SpeechSynthesis API, so the available voices depend entirely on your device operating system and browser.',
      },
      {
        question: 'Does this upload my text to a cloud AI voice service?',
        answer:
          'No. Playback runs locally using browser SpeechSynthesis—zero cloud APIs and NOT AI.',
      },
      {
        question: 'Can I adjust speaking speed and pitch?',
        answer:
          'Yes. Both playback rate (speed) and pitch controls are included.',
      },
      {
        question: 'Need voice-to-text typing instead?',
        answer:
          'Open Speech to Text for microphone dictation in supported browsers.',
      },
    ],
    relatedTools: [
      'developer-speech-to-text',
      'developer-code-beautifier',
      'productivity-meeting-notes',
      'document-letter-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-speech-to-text',
    name: 'Speech to Text',
    slug: 'developer-speech-to-text',
    category: 'developer-tools',
    url: '/developer-speech-to-text',
    description:
      'Dictate text with your microphone in supported browsers (Chrome/Safari)—browser support varies and requires mic permission.',
    longDescription:
      'Capture quick notes hands-free by dictating through your device microphone using the browser’s native Web Speech Recognition API (NOT AI cloud transcription). Honest browser note: this requires microphone permission, and browser support varies—it works best in Chrome and Safari and may be unavailable in Firefox or privacy-locked browsers.',
    keywords: [
      'speech to text',
      'voice typing browser',
      'web speech api dictation',
      'microphone permission',
      'chrome safari dictation',
    ],
    icon: 'Mic',
    acceptedFormats: ['Microphone / Audio'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Speech to Text — Browser Voice Typing | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Dictate text using microphone permission in supported browsers (Chrome/Safari; browser support varies). Free browser tool.',
    howTo: [
      {
        title: 'Allow microphone permission',
        description:
          'Once live, click Start Dictation in Chrome or Safari and grant microphone access.',
      },
      {
        title: 'Speak clearly into your mic',
        description:
          'Spoken words transcribe directly into editable text inside your browser.',
      },
      {
        title: 'Copy or edit transcript',
        description:
          'Clean up punctuation and copy your dictated text locally.',
      },
    ],
    faqs: [
      {
        question: 'Does Speech to Text work in every web browser?',
        answer:
          'No. Browser support varies significantly—the Web Speech Recognition API works primarily in Chrome and Safari, while some browsers (including Firefox) do not enable it by default.',
      },
      {
        question: 'Does it require microphone permission?',
        answer:
          'Yes. You must grant microphone access when prompted by your browser.',
      },
      {
        question: 'Can I upload MP3/WAV files here for AI transcription?',
        answer:
          'No. Speech to Text is live microphone dictation only—not file-based AI transcription.',
      },
      {
        question: 'Does ToolPlatform record or store my voice?',
        answer:
          'No. ToolPlatform never uploads or stores microphone audio.',
      },
    ],
    relatedTools: [
      'developer-text-to-speech',
      'productivity-meeting-notes',
      'productivity-sticky-notes',
      'document-letter-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    slug: 'developer-base64-encoder-decoder',
    category: 'developer-tools',
    url: '/developer-base64-encoder-decoder',
    description:
      'Encode plain UTF-8 text or small snippets to Base64 and decode Base64 strings safely inside your browser.',
    longDescription:
      'Quickly encode UTF-8 text or decode Base64 payloads for headers, configs, and debugging directly inside your browser using safe UTF-8 handling—zero remote transmission and zero AI.',
    keywords: [
      'base64 encoder decoder',
      'encode base64',
      'decode base64 utf8',
      'browser base64 converter',
    ],
    icon: 'Binary',
    acceptedFormats: ['Text', 'Base64'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Base64 Encoder/Decoder | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Encode text to Base64 or decode Base64 strings safely with full UTF-8 support directly inside your browser.',
    howTo: [
      {
        title: 'Paste plain text or Base64',
        description:
          'Once live, enter raw UTF-8 text or an existing Base64 string.',
      },
      {
        title: 'Choose Encode or Decode',
        description:
          'Switch modes cleanly to inspect encoded output or decoded plain text.',
      },
      {
        title: 'Copy result locally',
        description:
          'Copy the converted output with zero data leaving your tab.',
      },
    ],
    faqs: [
      {
        question: 'Does Base64 Encoder/Decoder handle emojis and non-ASCII UTF-8 characters?',
        answer:
          'Yes. UTF-8 byte encoding ensures accented characters and emojis encode/decode cleanly without errors.',
      },
      {
        question: 'Is Base64 encryption?',
        answer:
          'No. Base64 is an encoding format, not security encryption.',
      },
      {
        question: 'Are tokens or strings sent over the network?',
        answer:
          'No. Encoding and decoding happen entirely locally in your browser.',
      },
      {
        question: 'Do you also offer URL percent encoding?',
        answer:
          'Yes. Open URL Encoder/Decoder under Developer Tools.',
      },
    ],
    relatedTools: [
      'developer-url-encoder-decoder',
      'developer-json-formatter',
      'developer-code-beautifier',
      'uuid-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'developer-url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    slug: 'developer-url-encoder-decoder',
    category: 'developer-tools',
    url: '/developer-url-encoder-decoder',
    description:
      'Percent-encode query strings and parameters or decode unreadable URLs safely inside your browser.',
    longDescription:
      'Safely percent-encode special characters (`encodeURIComponent` / `encodeURI`) for query parameters and UTM links, or decode messy `%20`/`%3F` URLs back into human-readable strings right in your browser.',
    keywords: [
      'url encoder decoder',
      'percent encode url',
      'decode query string',
      'encodeuricomponent',
    ],
    icon: 'Link2',
    acceptedFormats: ['URL / Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `URL Encoder/Decoder | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Percent-encode URL parameters or decode encoded query strings safely inside your browser with zero uploads.',
    howTo: [
      {
        title: 'Enter URL or query parameter',
        description:
          'Once live, paste a link, query string, or percent-encoded URL value.',
      },
      {
        title: 'Encode or decode cleanly',
        description:
          'Switch between `encodeURIComponent` (parameter) and full URL encoding or decoding.',
      },
      {
        title: 'Copy clean output',
        description:
          'Copy the valid URL or decoded parameters in one click.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between encoding a full URL and a parameter component?',
        answer:
          'Full URL encoding preserves `://` and `?`, whereas component encoding escapes reserved symbols inside individual query parameter values.',
      },
      {
        question: 'Does URL Encoder/Decoder handle invalid `%` sequences gracefully?',
        answer:
          'Yes. Malformed percent sequences surface a clear inline warning instead of failing silently.',
      },
      {
        question: 'Are private links or auth query tokens logged?',
        answer:
          'Never. Everything runs client-side in your browser tab.',
      },
      {
        question: 'Need clean SEO permalinks instead?',
        answer:
          'Use Slug Generator under Generators to build hyphenated URL slugs from titles.',
      },
    ],
    relatedTools: [
      'developer-base64-encoder-decoder',
      'slug-generator',
      'developer-json-formatter',
      'qr-code-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
