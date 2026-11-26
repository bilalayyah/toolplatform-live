import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const GENERATOR_TOOLS: readonly Tool[] = [
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'generators',
    url: '/qr-code-generator',
    description:
      'Generate static QR codes for website links, UPI IDs, Wi-Fi credentials, or text—download/copy locally; codes never expire.',
    longDescription:
      'Build clean, static QR codes for any URL, UPI payment ID, Wi-Fi SSID/password card, or text message directly inside your browser using deterministic QR matrix encoding (NOT AI). Because static QR codes encode your text directly with zero tracking redirects, they never expire and carry zero watermarks.',
    keywords: [
      'qr code generator',
      'wifi qr code',
      'upi qr code',
      'static qr never expires',
      'download qr png',
    ],
    icon: 'QrCode',
    acceptedFormats: ['URL / Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `QR Code Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create static QR codes for links, UPI IDs, Wi-Fi logins, or text locally in your browser—download clean PNGs that never expire.',
    howTo: [
      {
        title: 'Choose QR payload type',
        description:
          'Enter a website URL, UPI ID string, Wi-Fi network + password, or plain message.',
      },
      {
        title: 'Customize colours & margin',
        description:
          'Adjust foreground/background contrast and error correction deterministically in your browser (NOT AI).',
      },
      {
        title: 'Download PNG or copy QR',
        description:
          'Export an unwatermarked static QR image that scans indefinitely and never expires.',
      },
    ],
    faqs: [
      {
        question: 'Do generated QR codes ever expire?',
        answer:
          'No. Static QR codes encode your destination data directly without intermediate short links, so they never expire.',
      },
      {
        question: 'Can I generate UPI or Wi-Fi QR codes?',
        answer:
          'Yes. Presets format standard `upi://pay` strings and `WIFI:` payloads automatically.',
      },
      {
        question: 'Does QR Code Generator use AI or upload my Wi-Fi password?',
        answer:
          'No. Matrix encoding runs locally in your browser—NOT AI and zero data leaves your device.',
      },
      {
        question: 'Are downloaded QR codes watermarked?',
        answer:
          'No. All Generator tools are free with zero watermarks.',
      },
    ],
    relatedTools: [
      'barcode-generator',
      'slug-generator',
      'uuid-generator',
      'password-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    slug: 'barcode-generator',
    category: 'generators',
    url: '/barcode-generator',
    description:
      'Create Code 128, Code 39, EAN-13, and UPC-A barcodes deterministically in your browser and download as PNG or PDF.',
    longDescription:
      'Render crisp retail and inventory barcodes across Code 128, Code 39, EAN-13, and UPC-A standards directly in your browser using deterministic barcode encoding (NOT AI), with checksum validation and watermark-free PNG or PDF download.',
    keywords: [
      'barcode generator',
      'code 128 code 39',
      'ean 13 upc a',
      'barcode png pdf',
      'inventory label',
    ],
    icon: 'Barcode',
    acceptedFormats: ['Numeric / Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Barcode Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate Code 128, Code 39, EAN-13, and UPC-A barcodes in your browser with PNG or PDF download and zero watermarks.',
    howTo: [
      {
        title: 'Pick barcode symbology',
        description:
          'Select Code 128, Code 39, EAN-13, or UPC-A.',
      },
      {
        title: 'Enter code & verify digits',
        description:
          'Input your SKU or numeric code—browser logic validates digit length and check digits (NOT AI).',
      },
      {
        title: 'Download PNG or PDF',
        description:
          'Export sharp printable bars cleanly as PNG or PDF with zero watermarks.',
      },
    ],
    faqs: [
      {
        question: 'Which barcode formats are supported?',
        answer:
          'Code 128, Code 39, EAN-13, and UPC-A are supported.',
      },
      {
        question: 'Can I download generated barcodes as both PNG and PDF?',
        answer:
          'Yes. You can export crisp PNG graphics or printable PDF sheets cleanly in your browser.',
      },
      {
        question: 'Does Barcode Generator validate EAN-13 and UPC-A check digits?',
        answer:
          'Yes. Standard modulo-10 check digits are computed and validated locally.',
      },
      {
        question: 'Does this tool use AI?',
        answer:
          'No. Bar widths strictly follow ISO/GS1 encoding tables—NOT AI.',
      },
    ],
    relatedTools: [
      'qr-code-generator',
      'document-bill-generator',
      'document-invoice-generator',
      'uuid-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'generators',
    url: '/password-generator',
    description:
      'Generate strong random passwords with custom length and character sets using your browser’s secure random—never sent or stored.',
    longDescription:
      'Create high-entropy random passwords using your browser’s cryptographically secure `crypto.getRandomValues` generator (NOT AI). Choose exact length, uppercase, lowercase, digits, symbols, and copy locally—passwords are never sent over the network or stored anywhere.',
    keywords: [
      'password generator',
      'random secure password',
      'crypto getrandomvalues',
      'strong password maker',
      'offline password',
    ],
    icon: 'KeyRound',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Password Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate strong random passwords with custom length and character types via browser secure random—never sent or stored.',
    howTo: [
      {
        title: 'Choose length and character types',
        description:
          'Set password length and toggle uppercase, lowercase, numbers, and symbols.',
      },
      {
        title: 'Generate using secure random',
        description:
          'Your browser uses `crypto.getRandomValues` locally (NOT AI).',
      },
      {
        title: 'Copy directly without saving',
        description:
          'Copy the generated password cleanly—nothing is logged, transmitted, or stored.',
      },
    ],
    faqs: [
      {
        question: 'Are generated passwords sent to or saved on any server?',
        answer:
          'Never. Passwords are created strictly in memory via your browser’s secure random generator and never sent or stored.',
      },
      {
        question: 'Which random source does Password Generator use?',
        answer:
          'It uses the Web Crypto API (`crypto.getRandomValues`), not weak `Math.random()` or AI.',
      },
      {
        question: 'Can I exclude ambiguous characters like O/0 or l/1?',
        answer:
          'Yes. Toggle character classes and ambiguous-character exclusion cleanly.',
      },
      {
        question: 'Do I need an account to use Password Generator?',
        answer:
          'No. Completely free with zero login.',
      },
    ],
    relatedTools: [
      'uuid-generator',
      'developer-base64-encoder-decoder',
      'protect-pdf',
      'slug-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'generators',
    url: '/uuid-generator',
    description:
      'Generate 1 to 1,000 random version 4 UUIDs in your browser—copy or download cleanly as TXT, CSV, or JSON.',
    longDescription:
      'Produce between 1 and 1,000 RFC 4122 version 4 UUIDs instantaneously inside your browser using secure browser randomness (`crypto.randomUUID` / `crypto.getRandomValues`, NOT AI). Copy all UUIDs to clipboard or download as TXT, CSV, or JSON.',
    keywords: [
      'uuid generator',
      'guid generator',
      'version 4 uuid',
      'bulk uuid txt csv json',
      '1000 uuids',
    ],
    icon: 'Fingerprint',
    acceptedFormats: ['TXT', 'CSV', 'JSON'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `UUID Generator — Bulk v4 UUIDs | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate 1 to 1,000 random version 4 UUIDs in your browser and copy or download cleanly as TXT, CSV, or JSON.',
    howTo: [
      {
        title: 'Choose batch count (1–1,000)',
        description:
          'Enter how many v4 UUIDs to generate (up to 1,000 at once) and casing preference.',
      },
      {
        title: 'Generate version 4 UUIDs',
        description:
          'Browser Web Crypto produces RFC-compliant random v4 identifiers deterministically (NOT AI).',
      },
      {
        title: 'Copy or download TXT/CSV/JSON',
        description:
          'Copy lines directly or export as clean TXT, CSV, or JSON files.',
      },
    ],
    faqs: [
      {
        question: 'How many UUIDs can I generate at once?',
        answer:
          'You can generate anywhere from 1 to 1,000 random version 4 UUIDs in a single click.',
      },
      {
        question: 'Which export formats are supported?',
        answer:
          'You can copy to clipboard or download directly as TXT, CSV, or JSON.',
      },
      {
        question: 'Are UUIDs generated server-side or via AI?',
        answer:
          'No. All version 4 UUIDs come from your browser’s secure crypto random generator—NOT AI.',
      },
      {
        question: 'Can I format UUIDs in uppercase or without hyphens?',
        answer:
          'Yes. Uppercase and hyphen toggles are included.',
      },
    ],
    relatedTools: [
      'password-generator',
      'slug-generator',
      'developer-json-formatter',
      'qr-code-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    slug: 'slug-generator',
    category: 'generators',
    url: '/slug-generator',
    description:
      'Convert article titles and headings into clean, lowercase, hyphenated URL slugs deterministically in your browser.',
    longDescription:
      'Turn blog titles, product names, or messy unicode strings into clean, SEO-friendly URL slugs in milliseconds using deterministic character transliteration, punctuation stripping, and hyphen normalization in your browser—NOT AI.',
    keywords: [
      'slug generator',
      'url slug maker',
      'title to url slug',
      'permalink formatter',
      'clean url slug',
    ],
    icon: 'Link2',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Slug Generator — Title to URL Slug | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert any article or page title into a clean, hyphenated URL slug locally in your browser using deterministic rules (NOT AI).',
    howTo: [
      {
        title: 'Paste page title or phrase',
        description:
          'Type or paste one or more titles directly into the input field.',
      },
      {
        title: 'Apply deterministic slug rules',
        description:
          'Accents normalize, special symbols strip out, and spaces become clean hyphens (NOT AI).',
      },
      {
        title: 'Copy clean URL slug',
        description:
          'Copy the formatted permalink ready for blogs, CMS entries, or routes.',
      },
    ],
    faqs: [
      {
        question: 'Does Slug Generator use AI to rewrite titles?',
        answer:
          'No. It strictly applies deterministic lowercase, diacritic, and hyphenation rules inside your browser—NOT AI.',
      },
      {
        question: 'Can I switch separators between hyphens and underscores?',
        answer:
          'Yes. Standard hyphens (-) default cleanly with an optional underscore (_) toggle.',
      },
      {
        question: 'Are optional stop words removable?',
        answer:
          'Yes. You can keep full words or optionally strip common filler stop words.',
      },
      {
        question: 'Does Slug Generator save my unpublished headlines?',
        answer:
          'No. Everything stays inside your browser tab.',
      },
    ],
    relatedTools: [
      'developer-url-encoder-decoder',
      'uuid-generator',
      'qr-code-generator',
      'random-name-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'random-name-generator',
    name: 'Random Name Generator',
    slug: 'random-name-generator',
    category: 'generators',
    url: '/random-name-generator',
    description:
      'Draw up to 50 random English names at once—male, female, unisex, or full names—from built-in browser lists (not AI).',
    longDescription:
      'Pick placeholder names for demos, fiction drafts, test datasets, or classroom examples by drawing up to 50 English first or full names at once across male, female, or unisex filters. Uses a curated built-in wordlist shuffled with browser randomness—strictly rule/list-based, NOT AI.',
    keywords: [
      'random name generator',
      'english name picker',
      'male female unisex names',
      '50 random names',
      'placeholder names not ai',
    ],
    icon: 'Users',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Random Name Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Draw up to 50 random English male, female, unisex, or full names at once from built-in browser lists (NOT AI).',
    howTo: [
      {
        title: 'Select category and count',
        description:
          'Choose male, female, or unisex names, first or full name format, and 1–50 results.',
      },
      {
        title: 'Shuffle built-in wordlist',
        description:
          'Browser logic draws non-repeating names from curated English name lists (NOT AI).',
      },
      {
        title: 'Copy generated names list',
        description:
          'Copy individual picks or the entire batch of up to 50 names.',
      },
    ],
    faqs: [
      {
        question: 'How many names can Random Name Generator output at once?',
        answer:
          'You can generate up to 50 random English names per click.',
      },
      {
        question: 'Does Random Name Generator use AI?',
        answer:
          'No. It shuffles a curated built-in wordlist locally inside your browser—NOT AI.',
      },
      {
        question: 'Can I filter between male, female, unisex, and full names?',
        answer:
          'Yes. All four name modes are selectable before generating.',
      },
      {
        question: 'Are real people’s private records ever used?',
        answer:
          'No. Names combine common public first and surname lists randomly.',
      },
    ],
    relatedTools: [
      'uuid-generator',
      'password-generator',
      'slug-generator',
      'document-letter-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'mac-address-generator',
    name: 'MAC Address Generator',
    slug: 'mac-address-generator',
    category: 'generators',
    url: '/mac-address-generator',
    description:
      'Generate sample locally-administered MAC addresses for network & dev tests—honest notice: random test addresses, not real hardware devices.',
    longDescription:
      'Create formatted sample 48-bit MAC addresses (colon, hyphen, dot, or uppercase/lowercase formats) for virtual machine labs, unit tests, and QA fixtures directly inside your browser using Web Crypto randomness—NOT AI. Important honesty note: generates random locally-administered test addresses (unicast bit 0, locally-administered bit 1), never real physical device addresses.',
    keywords: [
      'mac address generator',
      'random test mac address',
      'locally administered mac',
      'dummy hardware address',
      'network testing mac',
    ],
    icon: 'Network',
    acceptedFormats: ['TXT', 'CSV'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `MAC Address Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate sample locally-administered MAC addresses for dev and network tests in your browser. Not real physical device addresses.',
    howTo: [
      {
        title: 'Choose count and MAC separator style',
        description:
          'Pick colon (AA:BB:CC:DD:EE:FF), hyphen, Cisco dot notation, and uppercase or lowercase hex.',
      },
      {
        title: 'Generate locally-administered test addresses',
        description:
          'Browser Web Crypto creates compliant locally-administered unicast test MACs (NOT AI).',
      },
      {
        title: 'Copy sample MAC list for QA tests',
        description:
          'Copy directly into mock fixtures or lab configs—never real device hardware addresses.',
      },
    ],
    faqs: [
      {
        question: 'Are generated MAC addresses tied to real hardware devices?',
        answer:
          'No—never. MAC Address Generator sets the IEEE locally-administered bit so addresses are strictly random test addresses, not real device addresses.',
      },
      {
        question: 'Can I choose colon, dash, or dot delimiters?',
        answer:
          'Yes. Format output with colons (`:`), hyphens (`-`), Cisco dots (`.`), or plain unseparated hex.',
      },
      {
        question: 'Does MAC Address Generator use AI or send data remotely?',
        answer:
          'No. Web Crypto generates random bytes deterministically inside your browser tab.',
      },
      {
        question: 'How do I check which company owns an existing hardware MAC prefix?',
        answer:
          'Use MAC Address Lookup under Lookup Tools.',
      },
    ],
    relatedTools: [
      'lookup-mac-address-lookup',
      'uuid-generator',
      'password-generator',
      'django-secret-key-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'django-secret-key-generator',
    name: 'Django Secret Key Generator',
    slug: 'django-secret-key-generator',
    category: 'generators',
    url: '/django-secret-key-generator',
    description:
      'Generate cryptographically random Django SECRET_KEY strings locally via Web Crypto—never transmitted or stored anywhere.',
    longDescription:
      'Produce fresh 50-character Django `SECRET_KEY` strings using Python/Django’s standard 50-character alphanumeric + symbol pool powered by your browser’s Web Crypto random generator (`crypto.getRandomValues`, NOT AI). Keys stay strictly inside your browser memory and are never uploaded or logged.',
    keywords: [
      'django secret key generator',
      'django secret_key',
      'random django key',
      'settings py secret key',
      'web crypto django key',
    ],
    icon: 'Key',
    acceptedFormats: ['ENV / Python Snippet'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Django Secret Key Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate cryptographically random Django SECRET_KEY strings locally in your browser via Web Crypto—never sent or stored.',
    howTo: [
      {
        title: 'Choose key length (default 50 chars)',
        description:
          'Keep Django’s standard 50-character preset or adjust length and quoting options.',
      },
      {
        title: 'Generate via Web Crypto locally',
        description:
          'Browser `crypto.getRandomValues` picks uniform random symbols cleanly (NOT AI).',
      },
      {
        title: 'Copy SECRET_KEY into .env',
        description:
          'Copy directly into your `.env` or environment secret manager without server transmission.',
      },
    ],
    faqs: [
      {
        question: 'Are generated Django SECRET_KEY values sent or logged anywhere?',
        answer:
          'No. Generation runs strictly inside your browser via Web Crypto and values are never transmitted or saved.',
      },
      {
        question: 'Does it match Django’s official get_random_secret_key() character set?',
        answer:
          'Yes. It draws from Django’s standard 50-character alphanumeric + punctuation alphabet (`a-z0-9!@#$%^&*(-_=+)`).',
      },
      {
        question: 'Does Django Secret Key Generator use AI?',
        answer:
          'No. Random secrets must use uniform cryptographic RNG, never AI.',
      },
      {
        question: 'Should I paste SECRET_KEY directly into committed settings.py files?',
        answer:
          'Keep production secrets in environment variables (such as `.env`) rather than committing them to version control.',
      },
    ],
    relatedTools: [
      'wordpress-secret-key-generator',
      'password-generator',
      'uuid-generator',
      'mac-address-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'wordpress-secret-key-generator',
    name: 'WordPress Secret Key Generator',
    slug: 'wordpress-secret-key-generator',
    category: 'generators',
    url: '/wordpress-secret-key-generator',
    description:
      'Generate all 8 random WordPress security keys and salts for wp-config.php locally in your browser—never sent or stored.',
    longDescription:
      'Create a fresh block of all eight WordPress authentication keys and salts (`AUTH_KEY`, `SECURE_AUTH_KEY`, `LOGGED_IN_KEY`, `NONCE_KEY`, `AUTH_SALT`, `SECURE_AUTH_SALT`, `LOGGED_IN_SALT`, `NONCE_SALT`) ready for `wp-config.php`, powered by your browser’s Web Crypto random generator—NOT AI, with zero network transmission.',
    keywords: [
      'wordpress secret key generator',
      'wp config salts',
      'wordpress auth keys',
      'generate wp salts',
      'wp config security keys',
    ],
    icon: 'ShieldCheck',
    acceptedFormats: ['PHP / wp-config.php'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `WordPress Secret Key Generator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate all 8 random WordPress security keys and salts for wp-config.php locally in your browser via Web Crypto.',
    howTo: [
      {
        title: 'Click Generate Keys & Salts',
        description:
          'Click once to create all 8 64-character WordPress keys and salts at once.',
      },
      {
        title: 'Inspect wp-config.php PHP define block',
        description:
          'Web Crypto locally builds standard `define(...)` PHP lines using 64 high-entropy characters each (NOT AI).',
      },
      {
        title: 'Copy directly into wp-config.php',
        description:
          'Paste into your WordPress configuration file—no key ever leaves your browser.',
      },
    ],
    faqs: [
      {
        question: 'Which 8 constants does WordPress Secret Key Generator produce?',
        answer:
          'It generates AUTH_KEY, SECURE_AUTH_KEY, LOGGED_IN_KEY, NONCE_KEY, AUTH_SALT, SECURE_AUTH_SALT, LOGGED_IN_SALT, and NONCE_SALT in exact `define(...)` syntax.',
      },
      {
        question: 'Are generated WordPress salts transmitted over the internet?',
        answer:
          'No. Everything is computed locally in memory using Web Crypto `crypto.getRandomValues` and never leaves your browser.',
      },
      {
        question: 'What happens if I rotate WordPress salts on an existing site?',
        answer:
          'All existing logged-in browser sessions are invalidated immediately, forcing users to sign in again cleanly.',
      },
      {
        question: 'Does this tool use AI?',
        answer:
          'No. Security keys require cryptographic randomness, not AI.',
      },
    ],
    relatedTools: [
      'django-secret-key-generator',
      'password-generator',
      'uuid-generator',
      'mac-address-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
