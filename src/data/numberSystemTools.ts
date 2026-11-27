import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const NUMBER_SYSTEM_TOOLS: readonly Tool[] = [
  {
    id: 'number-bcd-converter',
    name: 'BCD Converter',
    slug: 'number-bcd-converter',
    category: 'number-system-converters',
    url: '/number-bcd-converter',
    description:
      'Pure formula converter between decimal integers and Binary-Coded Decimal (BCD), encoding each decimal digit as a 4-bit code.',
    longDescription:
      'Convert decimal numbers to Binary-Coded Decimal (8421 BCD) and decode valid 4-bit BCD nibbles back into decimal locally in your browser using deterministic digit-by-digit mapping—pure formula calculation, NOT AI, with clear per-digit bit groups.',
    keywords: [
      'bcd converter',
      'binary coded decimal',
      'decimal to bcd',
      'bcd to decimal',
      '4 bit nibble 8421',
    ],
    icon: 'Binary',
    acceptedFormats: ['Numeric / Binary'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `BCD Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert decimal ↔ Binary-Coded Decimal (BCD) in your browser by encoding or decoding each decimal digit as a 4-bit code.',
    howTo: [
      {
        title: 'Pick Decimal → BCD or BCD → Decimal',
        description:
          'Once live, select your conversion direction and enter a decimal number or 4-bit BCD groups.',
      },
      {
        title: 'Inspect 4-bit digit mapping',
        description:
          'Pure browser formulas map each decimal digit (0–9) to its exact 4-bit 8421 binary nibble.',
      },
      {
        title: 'Copy spaced or compact bits',
        description:
          'Copy the formatted 4-bit groups or decimal output immediately—zero uploads or AI.',
      },
    ],
    faqs: [
      {
        question: 'How is Binary-Coded Decimal different from standard binary?',
        answer:
          'Standard binary converts the entire number in base 2, whereas BCD encodes each individual decimal digit (0–9) as its own 4-bit binary code (for example, 25 becomes 0010 0101).',
      },
      {
        question: 'Does BCD Converter work in both directions?',
        answer:
          'Yes. It handles both decimal → BCD and BCD → decimal, flagging invalid nibbles (1010–1111) clearly.',
      },
      {
        question: 'Does BCD Converter use AI or servers?',
        answer:
          'No. It is a pure deterministic formula calculator running in your browser.',
      },
      {
        question: 'Are outputs free and unwatermarked?',
        answer:
          'Yes. Every Number System Converter is free with zero watermarks.',
      },
    ],
    relatedTools: [
      'number-binary-to-gray-code-converter',
      'developer-base64-encoder-decoder',
      'unit-file-size-converter',
      'finance-advanced-scientific-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'number-binary-to-gray-code-converter',
    name: 'Binary to Gray Code Converter',
    slug: 'number-binary-to-gray-code-converter',
    category: 'number-system-converters',
    url: '/number-binary-to-gray-code-converter',
    description:
      'Pure formula converter between standard Binary and reflected Gray code in both directions with step-by-step XOR working.',
    longDescription:
      'Convert unsigned binary bitstrings to reflected Gray code and convert Gray code back into standard binary locally in your browser using pure bitwise XOR formulas—displaying every step-by-step bit operation cleanly with zero uploads and zero AI.',
    keywords: [
      'binary to gray code',
      'gray code to binary',
      'xor gray converter',
      'reflected binary code',
      'step by step binary working',
    ],
    icon: 'Cpu',
    acceptedFormats: ['Binary Bits'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Binary to Gray Code Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert binary ↔ Gray code in both directions in your browser with clear step-by-step XOR working and zero uploads.',
    howTo: [
      {
        title: 'Choose Binary → Gray or Gray → Binary',
        description:
          'Once live, pick the direction and paste or type any valid bit sequence (0s and 1s).',
      },
      {
        title: 'View step-by-step XOR working',
        description:
          'Inspect how the MSB copies directly and each subsequent bit computes via deterministic XOR logic.',
      },
      {
        title: 'Copy Gray or Binary bitstring',
        description:
          'Copy the converted bits along with the decimal equivalent right from your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Binary to Gray Code Converter work in both directions?',
        answer:
          'Yes. You can convert Binary → Gray code and Gray code → Binary inside the same tool.',
      },
      {
        question: 'Does it show the step-by-step XOR working?',
        answer:
          'Yes. Every bit comparison (b[i] ⊕ b[i-1] or running cumulative XOR) is displayed step by step for digital logic study.',
      },
      {
        question: 'Why is Gray code useful in hardware encoders?',
        answer:
          'Successive Gray code values differ by only one bit, minimizing transitional glitch errors in rotary and optical encoders.',
      },
      {
        question: 'Is this a pure formula calculator without AI?',
        answer:
          'Yes. Bitwise XOR conversions run deterministically in your browser with no AI.',
      },
    ],
    relatedTools: [
      'number-bcd-converter',
      'developer-base64-encoder-decoder',
      'unit-data-transfer-rate-converter',
      'finance-advanced-scientific-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    slug: 'roman-numeral-converter',
    category: 'number-system-converters',
    url: '/roman-numeral-converter',
    description:
      'Convert numbers to Roman numerals and Roman numerals back to integers (1 to 3999), plus Roman calendar dates.',
    longDescription:
      'Bidirectional Roman numeral converter supporting integers from 1 to 3999, historical subtraction rules, strict syntax validation, and date conversion to/from Roman numerals (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD) running instantly in your browser. Roman numerals originated in ancient Rome and remained the standard writing system across Europe throughout the Middle Ages. Numbers are represented through combinations of letters from the Latin alphabet using seven core symbols: I for 1, V for 5, X for 10, L for 50, C for 100, D for 500, and M for 1000. Unlike modern Arabic numerals which rely on positional value notation and a zero placeholder, Roman numerals operate on an additive and subtractive principle where symbols placed after larger values are added, while symbols placed before larger values of ten times or five times magnitude are subtracted. For instance, IV represents 4 (5 minus 1), IX represents 9 (10 minus 1), XL represents 40 (50 minus 10), XC represents 90 (100 minus 10), CD represents 400 (500 minus 100), and CM represents 900 (1000 minus 100). The standard upper bound for traditional Roman numerals without vinculum overlines is 3999, which is written as MMMCMXCIX (3000 + 900 + 90 + 9). This comprehensive browser tool enforces strict historical syntax validation to reject invalid repetitions like IIII, VV, or CCCC, checks proper subtractive ordering, provides session history logging up to eight recent conversions, and supports full calendar date formatting into Roman numerals such as XXVII/XI/MMXXVI. Everything operates entirely client-side in your web browser with zero server uploads or AI involvement, ensuring absolute data privacy and instantaneous deterministic formula computation.',
    keywords: [
      'roman numeral converter',
      'roman to arabic number',
      'arabic to roman numerals',
      'roman date converter',
      'roman numbers 1 to 3999',
    ],
    icon: 'Hash',
    acceptedFormats: ['Numeric / Roman Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Roman Numeral Converter & Date Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert numbers 1–3999 to Roman numerals and back in your browser, plus convert calendar dates to Roman numeral formats.',
    howTo: [
      {
        title: 'Choose conversion mode',
        description:
          'Select Integer to Roman numeral, Roman numeral to Integer, or Calendar Date conversion mode from the interactive workspace tabs.',
      },
      {
        title: 'Enter number or date',
        description:
          'Type any valid whole number between 1 and 3999, paste a standard Roman numeral string, or input calendar day, month, and year values.',
      },
      {
        title: 'Copy result instantly',
        description:
          'View live conversion results, inspect step-by-step breakdown notes, and copy formatted outputs with zero uploads or AI.',
      },
    ],
    faqs: [
      {
        question: 'What is the maximum number supported by Roman Numeral Converter?',
        answer:
          'Standard Roman numerals support integers from 1 to 3999 (represented as I up to MMMCMXCIX). Numbers above 4000 traditionally required overlines or specialized vincula which are outside standard text representations.',
      },
      {
        question: 'Does it validate incorrect Roman numeral syntax?',
        answer:
          'Yes. The strict syntax engine checks for invalid character repetitions such as IIII, VV, LL, or DDD, improper subtractive combinations like IL or IC, and out-of-order descending symbol sequences.',
      },
      {
        question: 'Can I convert calendar dates into Roman numerals?',
        answer:
          'Yes. Mode 3 converts full calendar dates in DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD formats into clean Roman numeral date strings (for example, 27/11/2026 converts to XXVII/XI/MMXXVI).',
      },
      {
        question: 'Is this calculator free and browser-based?',
        answer:
          'Yes. It runs entirely in your web browser with zero server uploads, cookies tracking, or AI dependency, ensuring complete speed and privacy.',
      },
      {
        question: 'How are subtractive combinations handled in Roman numerals?',
        answer:
          'Subtractive notation uses specific pairs: I before V or X (IV = 4, IX = 9), X before L or C (XL = 40, XC = 90), and C before D or M (CD = 400, CM = 900). Other combinations like IC or XM are strictly invalid.',
      },
      {
        question: 'Does the tool support lowercase Roman numeral inputs?',
        answer:
          'Yes. You can paste lowercase strings such as mmxxvi or mcmlxxxiv, and the converter automatically normalizes and evaluates them correctly.',
      },
      {
        question: 'Is there any number zero in Roman numerals?',
        answer:
          'No. The ancient Roman numbering system did not include a symbol for zero. Calculations relied on abacus counters for zero or empty place values.',
      },
      {
        question: 'How does session history work in this converter?',
        answer:
          'Every successful conversion is automatically recorded in a quick-access session history list storing up to your last eight queries for effortless reference.',
      },
      {
        question: 'Can I copy converted strings with one click?',
        answer:
          'Yes. Dedicated copy buttons beside each output field copy the Roman numeral or integer directly to your device clipboard with visual confirmation.',
      },
      {
        question: 'What happens if I enter zero or a negative number?',
        answer:
          'The validator immediately catches out-of-range inputs and displays a clear error notice explaining that values must be positive integers between 1 and 3999.',
      },
      {
        question: 'Are historical dates before year 1 supported?',
        answer:
          'No. The calculator focuses on standard common era positive integers from 1 to 3999 and standard Gregorian calendar dates.',
      },
      {
        question: 'Does this converter require an internet connection?',
        answer:
          'Once loaded, all conversion logic executes locally via JavaScript functions embedded in the page, allowing seamless offline operation without external network dependencies.',
      },
      {
        question: 'Why do some clock faces use IIII instead of IV?',
        answer:
          'Using IIII instead of IV provides visual symmetry with the VIII on the opposite side of the clock dial and avoids confusing IV with the god Jupiter (IVPITER).',
      },
      {
        question: 'How are centuries and regnal years denoted in Roman numerals?',
        answer:
          'Centuries and monarchs are typically written in Roman numerals, such as King Henry VIII or the 21st century written as XXI.',
      },
      {
        question: 'Can I use this tool for academic or architectural inscription planning?',
        answer:
          'Yes. Monumental inscriptions, cornerstone dates, and movie copyright production years are easily verified and converted using this utility.',
      },
      {
        question: 'Are there any hidden API calls or external trackers?',
        answer:
          'None whatsoever. All conversion algorithms run in pure client-side JavaScript without any third-party tracking beacons or telemetry.',
      },
      {
        question: 'How does Roman arithmetic work without place values?',
        answer:
          'Ancient Romans performed arithmetic using counting boards and abacuses, adding symbol values together and grouping like units.',
      },
      {
        question: 'What is the history of the letter M for one thousand?',
        answer:
          'The symbol M originally stood for mille (thousand) in Latin, evolving from early Greek epigraphic characters.',
      },
      {
        question: 'Can I convert large numbers past 3999?',
        answer:
          'Standard representation stops at 3999 (MMMCMXCIX). Numbers above 4000 require historical overline vinculum multipliers not used in standard text.',
      },
      {
        question: 'Is case sensitivity enforced on Roman numeral inputs?',
        answer:
          'The parser automatically accepts both uppercase and lowercase inputs, normalizing them internally before validating structure.',
      },
      {
        question: 'How are calendar leap years handled in date conversion mode?',
        answer:
          'Standard Gregorian calendar leap year rules apply during date validation so invalid calendar days like February 29 in non-leap years are correctly caught.',
      },
      {
        question: 'Can I export or save my conversion history?',
        answer:
          'Session history persists in your browser tab memory during your active session for quick review and copying.',
      },
      {
        question: 'Is there any character limit for input fields?',
        answer:
          'Input fields accept standard numeric digits up to 4 digits and Roman numeral strings up to 15 characters corresponding to valid values up to 3999.',
      },
      {
        question: 'Can students use this for mathematics and Latin history coursework?',
        answer:
          'Yes. Students and educators frequently use this tool for verifying Latin grammar exercises, classical numbering homework, and historical timeline studies.',
      },
      {
        question: 'Does this tool support screen readers and keyboard navigation?',
        answer:
          'Yes. All interactive tabs, input fields, and copy triggers are fully accessible via standard keyboard navigation and semantic aria labels.',
      },
      {
        question: 'Are numbers formatted with grouping separators in integer mode?',
        answer:
          'Integer outputs display cleanly formatted numbers for maximum readability alongside instant Roman numeral equivalents.',
      },
      {
        question: 'Can I bookmark specific conversion queries?',
        answer:
          'While direct deep-linking state is stored in session memory, you can easily copy and share conversion outputs instantly.',
      },
      {
        question: 'Does the calculator handle invalid character symbols gracefully?',
        answer:
          'Yes. Any non-Roman characters or unsupported symbols typed into Roman fields are rejected with clear instructional feedback.',
      },
    ],
    relatedTools: [
      'number-bcd-converter',
      'number-binary-to-gray-code-converter',
      'developer-base64-encoder-decoder',
      'finance-advanced-scientific-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
