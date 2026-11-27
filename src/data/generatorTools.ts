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
  {
    id: 'alphabets-to-word-generator',
    name: 'Alphabets to Word Generator',
    slug: 'alphabets-to-word-generator',
    category: 'generators',
    url: '/alphabets-to-word-generator',
    description:
      'Enter your letters and discover all the words you can make from them.',
    longDescription: `An alphabets to word generator is a deterministic browser utility that converts loose sets of letters into genuine English words verified against a bundled lexicon—never random gibberish and never guessed by AI. Whenever you have scrambled tiles, jumbled puzzle clues, or spare alphabet letters, this word generator from letters searches 274,137 English entries from the open Letterpress English Word List (atebits/Words, CC0 1.0 Universal Public Domain / sindresorhus word-list, MIT license) so every match reflects both real spelling and your exact letter counts.

### How to Generate Words from Letters

Creating valid English words from your letters follows three quick steps directly inside your browser:

- Enter up to 15 English letters (A–Z, uppercase or lowercase, with optional spaces)—such as LISTEN or APPLE—and select one of six modes: Generate Words, Find Anagrams, Find Short Words, Find Long Words, Exact Letter Anagrams, or Word Pattern Finder.
- Optionally narrow results with minimum or maximum length, starting or ending letters, must-include or must-exclude letters, positional patterns like P_A___, sort order, and display cap (200 results by default, adjustable up to 1,000).
- Click Generate Words to inspect matching entries with character counts, copy a single word or the full list to your clipboard, or download everything as a plain TXT file.

### How the Anagram Solver Works

At the heart of this letters to words generator and anagram solver is strict letter-frequency matching. The engine counts how often each letter appears in your input and rejects any dictionary candidate that demands more copies of a letter than you supplied. With APPLE (one A, two Ps, one L, one E), the solver accepts APPLE, PALE, PEAL, LEAP, APE, and LAP while automatically blocking words needing three Ps or two As. In Find Anagrams and Exact Letter Anagrams modes, every supplied letter must be used once with none left over—turning LISTEN into LISTEN, SILENT, ENLIST, TINSEL, and INLETS while keeping shorter subset words out of exact-anagram results.

### Find the Longest Words

When puzzle boards or vocabulary tasks call for maximum length, switch to Find Long Words or sort by Longest Words First. Find Long Words places every dictionary word tied for the highest available character count at the top of the list and displays shorter alternatives underneath.

### Find the Short Words

Compact words unlock tight grid hooks and help learners spot familiar roots and suffixes. In Find Short Words mode, toggle quick 2-, 3-, 4-, or 5-letter presets or set custom bounds to browse words like APE and LAP grouped clearly by length.

### Tips for Making More Words

Try these practical techniques to get fuller word sets when unscrambling letters:

- Combine common vowels with flexible high-frequency consonants such as S, T, R, N, and L.
- Test familiar prefixes and suffixes in Word Pattern Finder using Starts With, Ends With, and positional wildcards.
- Filter locked board positions directly—for instance, entering PLANET with Starts With P or pattern P_A___ isolates PLANET cleanly.
- Use Must Include and Must Exclude filters to match fixed grid letters or eliminate tiles already ruled out.
- Experiment with repeated letters in your input to check longer inflected forms and derivatives.

### Examples of Words from Letters

Tested directly against the bundled 274,137-word Letterpress dictionary, familiar inputs form clear word families:

- LISTEN produces exact 6-letter anagrams LISTEN, SILENT, ENLIST, TINSEL, and INLETS alongside shorter subset words.
- APPLE generates APPLE, PALE, PEAL, LEAP, APE, and LAP while strictly enforcing the two-P cap.
- EARTH forms exact anagrams HEART and HATER alongside EARTH.
- STONE yields NOTES, ONSET, and TONES alongside STONE.
- CARE generates RACE and ACRE alongside CARE.
- ANGLE produces ANGLE, ANGEL, GLEAN, GLEN, LEAN, LANE, AGE, and ALE.

### Who Can Use This Tool

Everything runs locally in your browser without registration or server uploads for:

- Students practicing spelling patterns and vocabulary recognition.
- Teachers assembling classroom word-building exercises and printable TXT sheets.
- Word game players checking valid tile combinations and letter-unscrambler possibilities.
- English learners exploring real spelling structures and letter-frequency constraints.
- Writers brainstorming concise lexical choices for titles or copy.
- Puzzle enthusiasts solving newspaper anagrams and pattern clues offline-ready.

### Honest Limits

Results draw exclusively from the bundled 274,137-word Letterpress English Word List (lowercase A–Z words of two or more letters, excluding capitalized proper nouns, hyphenated compounds, and punctuated abbreviations). Words absent from that list cannot appear, and because different board and word games maintain separate official word lists, acceptance in every game cannot be guaranteed. Processing stays strictly client-side, inputs accept up to 15 letters, and displayed output defaults to 200 words (adjustable up to 1,000 in Filters) to keep scrolling responsive on desktop and mobile devices.`,
    keywords: [
      'alphabets to word generator',
      'alphabet to word generator',
      'letters to words generator',
      'word generator from letters',
      'generate words from letters',
      'make words from letters',
      'words from letters',
      'anagram solver',
      'find anagrams',
      'word finder from letters',
    ],
    icon: 'Type',
    acceptedFormats: ['Letters'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Alphabets to Word Generator – Make Words from Letters | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate words from letters instantly with our free alphabets to word generator. Find short and long words, anagrams, and possible word combinations.',
    howTo: [
      {
        title: 'Enter your letters and pick a mode',
        description:
          'Type up to 15 English letters (A–Z) into the workspace and select one of six modes: Generate Words, Find Anagrams, Find Short Words, Find Long Words, Exact Letter Anagrams, or Word Pattern Finder.',
      },
      {
        title: 'Adjust filters and generate words',
        description:
          'Optionally filter by word length, starting or ending letters, required or excluded letters, known letter positions, sorting order, and result limit, then click Generate Words.',
      },
      {
        title: 'Copy results or download TXT',
        description:
          'Review matching dictionary words with character counts, copy single words or the full list to your clipboard, or save everything directly as a plain TXT file.',
      },
    ],
    faqs: [
      {
        question: 'What is an alphabets to word generator?',
        answer:
          'An alphabets to word generator is a browser-based word finder from letters that checks every entry in a bundled English dictionary against the exact letters you enter. Instead of inventing random letter sequences, it lists genuine English words you can spell using only your available characters.',
      },
      {
        question: 'How do I make words from letters?',
        answer:
          'Type your letters into the input box (for example, LISTEN or APPLE), choose Generate Words or any specialized mode, optionally apply length or letter filters, and click Generate Words. Matching words appear instantly in a clean grid with character counts and copy buttons.',
      },
      {
        question: 'Can I generate multiple words from one set of letters?',
        answer:
          'Yes. In Generate Words, Find Short Words, Find Long Words, and Word Pattern Finder modes, the engine returns all valid dictionary combinations from 2 letters up to your full input length, displaying up to 200 results by default (and up to 1,000 when adjusted in Filters).',
      },
      {
        question: 'What is an anagram?',
        answer:
          'An anagram is a valid word formed by rearranging every single letter of another word or letter set without adding new letters or leaving any behind. For instance, SILENT, ENLIST, TINSEL, and INLETS are exact anagrams of LISTEN, while HEART and HATER are exact anagrams of EARTH.',
      },
      {
        question: 'What is the difference between a word generator and an anagram solver?',
        answer:
          'A general word generator from letters finds both shorter subset words and full-length combinations from your letter pool, whereas an anagram solver narrows results exclusively to words that consume every supplied letter at its exact frequency—never listing shorter partial words.',
      },
      {
        question: 'Can I find the longest word from letters?',
        answer:
          'Yes. Switch to Find Long Words mode or select Longest Words First in the sort dropdown. Find Long Words places every dictionary entry tied for the maximum available length in a highlighted top group and shows shorter alternatives underneath.',
      },
      {
        question: 'Can I find short words from letters?',
        answer:
          'Yes. Open Find Short Words mode to filter directly to 2-, 3-, 4-, or 5-letter words using the preset buttons or custom min/max controls, with matching results organized clearly into groups by word length.',
      },
      {
        question: 'Can I use repeated letters?',
        answer:
          'Yes, and the engine tracks repeated letters strictly according to how many times each letter appears in your input. Entering APPLE gives you two Ps, so words like APPLE, PALE, and PEAL are valid while any word requiring a third P or a second A is excluded.',
      },
      {
        question: 'Does the generator use every letter?',
        answer:
          'That depends on which mode you pick. Generate Words, Find Short Words, Find Long Words, and Word Pattern Finder allow shorter subset words starting at 2 letters, whereas Find Anagrams and Exact Letter Anagrams require every supplied letter to be used once.',
      },
      {
        question: 'Can I find words using all the letters?',
        answer:
          'Yes. Use Find Anagrams or Exact Letter Anagrams (or click the Find Anagrams action button) to find only exact full-length matches that use every letter in your input. If no English word uses all your letters, the tool shows an honest empty state instead of shorter words.',
      },
      {
        question: 'Can I exclude specific letters?',
        answer:
          'Yes. Expand the Filters & Pattern panel and type letters into the Must Exclude Letters field to filter out any candidate word containing those characters—without having to re-type your main letter set.',
      },
      {
        question: 'Can I find words starting with a particular letter?',
        answer:
          'Yes. Enter one or more starting letters in the Starts With filter (or use Word Pattern Finder with known positions such as P_A___ for PLANET) to restrict results to words beginning with that exact prefix.',
      },
      {
        question: 'Does the tool work offline?',
        answer:
          'Yes, after loading. When you open the Alphabets to Word Generator page, the bundled dictionary file is fetched once into your browser memory as a separate asset, so subsequent searches, filter changes, and TXT downloads continue working locally without sending data to any server.',
      },
      {
        question: 'Is this word generator free?',
        answer:
          'Yes. Alphabets to Word Generator is completely free to use in your browser with no account registration, no usage quotas, and no watermarks.',
      },
      {
        question: 'Are all generated words valid English words?',
        answer:
          'Every output comes directly from our bundled 274,137-word Letterpress English Word List (CC0 1.0 Universal / MIT), which contains lowercase alphabetic English words of two or more letters and excludes random strings, capitalized proper nouns, and punctuated abbreviations.',
      },
      {
        question: 'Does the tool support every word game dictionary?',
        answer:
          'No. Different word games and tournaments maintain separate official word lists (such as TWL, CSW, or custom app lexicons). While the Letterpress list covers a broad English vocabulary, word acceptance in every specific word game is not guaranteed.',
      },
    ],
    relatedTools: [
      'password-generator',
      'random-name-generator',
      'slug-generator',
      'uuid-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
