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
];
