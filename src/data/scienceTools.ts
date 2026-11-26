import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const SCIENCE_TOOLS: readonly Tool[] = [
  {
    id: 'science-chemistry-solutions-calculator',
    name: 'Chemistry Solutions Calculator',
    slug: 'science-chemistry-solutions-calculator',
    category: 'science-tools',
    url: '/science-chemistry-solutions-calculator',
    description:
      'Compute molarity, molality, normality, mole fraction, M1V1 = M2V2 dilutions, and pH from pH, [H+], or pOH in your browser.',
    longDescription:
      'Solve everyday analytical and general chemistry solution problems accurately inside your browser: molarity (M), molality (m), normality (N), mole fraction, M1V1 = M2V2 dilution ratios, and pH conversions from pH, [H+], or pOH—free with zero AI and no uploads.',
    keywords: [
      'chemistry solutions calculator',
      'molarity calculator',
      'molality normality mole fraction',
      'm1v1 m2v2 dilution',
      'ph poh calculator',
    ],
    icon: 'FlaskConical',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Chemistry Solutions Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate molarity, molality, normality, mole fraction, M1V1 = M2V2 dilutions, and pH/[H+]/pOH directly in your browser.',
    howTo: [
      {
        title: 'Choose solution formula',
        description:
          'Once live, pick molarity, molality, normality, mole fraction, dilution (M1V1 = M2V2), or pH/[H+]/pOH.',
      },
      {
        title: 'Enter known lab values',
        description:
          'Input solute mass or moles, molar mass, volume or solvent kg, equivalents, or concentration.',
      },
      {
        title: 'Read exact step results',
        description:
          'Inspect computed concentration, dilution volume, or pH balance directly in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Which concentration formulas are supported?',
        answer:
          'It supports molarity, molality, normality, mole fraction, dilution (M1V1 = M2V2), and pH from pH, [H+], or pOH.',
      },
      {
        question: 'Can it solve any unknown variable in M1V1 = M2V2?',
        answer:
          'Yes. Enter any three values and the calculator solves the fourth.',
      },
      {
        question: 'Does Chemistry Solutions Calculator require internet or AI?',
        answer:
          'No. Exact stoichiometric math runs directly inside your browser tab with zero AI.',
      },
      {
        question: 'Are aqueous pH/pOH conversions assumed at 25 °C?',
        answer:
          'Yes. Standard pH + pOH = 14.00 at 25 °C (Kw = 1.0 × 10^-14) is applied.',
      },
    ],
    relatedTools: [
      'science-physics-calculator',
      'science-dna-rna-converter',
      'unit-unit-converter',
      'finance-advanced-scientific-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'science-physics-calculator',
    name: 'Physics Calculator',
    slug: 'science-physics-calculator',
    category: 'science-tools',
    url: '/science-physics-calculator',
    description:
      'Solve F = ma, KE = ½mv², PE = mgh, W = Fd, P = W/t, pressure, speed, wave speed, and V = IR—for whichever variable is left empty.',
    longDescription:
      'Pick classic mechanics, waves, or electricity equations—F = ma, KE = ½mv², PE = mgh, W = Fd, P = W/t, pressure (P = F/A), speed (v = d/t), wave speed (v = fλ), and Ohm’s Law (V = IR)—and leave any one field blank so the browser algebraically solves for the missing variable.',
    keywords: [
      'physics calculator',
      'f=ma kinetic potential energy',
      'ohms law v=ir',
      'wave speed work power pressure',
      'solve missing variable',
    ],
    icon: 'Atom',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Physics Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Solve F = ma, KE = ½mv², PE = mgh, W = Fd, P = W/t, pressure, speed, wave speed, and V = IR for whichever variable is left empty.',
    howTo: [
      {
        title: 'Pick an equation',
        description:
          'Once live, select F = ma, KE = ½mv², PE = mgh, W = Fd, P = W/t, pressure, speed, wave speed, or V = IR.',
      },
      {
        title: 'Leave one field empty',
        description:
          'Enter known SI values and leave the unknown variable blank.',
      },
      {
        title: 'Calculate missing value',
        description:
          'The calculator isolates and solves for the empty field instantaneously in your browser.',
      },
    ],
    faqs: [
      {
        question: 'How does leaving a value empty work?',
        answer:
          'If a formula has three variables (like V, I, and R), entering any two automatically rearranges the formula to solve the empty field.',
      },
      {
        question: 'Which physics equations are included?',
        answer:
          'F = ma, KE = ½mv², PE = mgh, W = Fd, P = W/t, pressure (F/A), speed (d/t), wave speed (fλ), and Ohm’s Law (V = IR).',
      },
      {
        question: 'What value of gravity g is used in PE = mgh?',
        answer:
          'Standard Earth gravity g = 9.80665 m/s² (editable if your coursework uses 9.8 or 10 m/s²).',
      },
      {
        question: 'Does Physics Calculator use AI?',
        answer:
          'No. Exact deterministic algebraic equations run locally in your browser.',
      },
    ],
    relatedTools: [
      'science-chemistry-solutions-calculator',
      'science-dna-rna-converter',
      'unit-unit-converter',
      'finance-advanced-scientific-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'science-dna-rna-converter',
    name: 'DNA/RNA Converter',
    slug: 'science-dna-rna-converter',
    category: 'science-tools',
    url: '/science-dna-rna-converter',
    description:
      'Convert DNA ↔ RNA strands, substitute T to U, and generate exact complement and reverse-complement sequences in your browser.',
    longDescription:
      'Transcribe DNA coding or template sequences to RNA (T ↔ U) and back cleanly inside your browser, generating exact complementary (A↔T/U, C↔G) and 5′→3′ reverse-complement strands with invalid-base validation and zero uploads.',
    keywords: [
      'dna rna converter',
      'dna to rna transcription',
      'reverse complement dna',
      't to u sequence',
      'complement strand',
    ],
    icon: 'Dna',
    acceptedFormats: ['FASTA / Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `DNA/RNA Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert DNA ↔ RNA sequences (T to U) and compute exact complement and reverse-complement strands locally in your browser.',
    howTo: [
      {
        title: 'Paste nucleotide sequence',
        description:
          'Once live, enter raw A/T/C/G or A/U/C/G bases directly in your browser tab.',
      },
      {
        title: 'Choose conversion mode',
        description:
          'Pick DNA ↔ RNA (T ↔ U), complement strand, or reverse complement output.',
      },
      {
        title: 'Copy clean sequence',
        description:
          'Validate base counts and copy the resulting sequence with one click.',
      },
    ],
    faqs: [
      {
        question: 'What conversions does DNA/RNA Converter perform?',
        answer:
          'It converts DNA ↔ RNA (T ↔ U), produces exact base-paired complements, and outputs 5′→3′ reverse complements.',
      },
      {
        question: 'Does it ignore whitespace or FASTA headers cleanly?',
        answer:
          'Yes. Spaces and line breaks are stripped automatically while flagging non-standard base characters.',
      },
      {
        question: 'Are genetic sequences sent to external servers?',
        answer:
          'No. Sequence mapping executes strictly inside your browser.',
      },
      {
        question: 'Is there any AI or protein folding prediction claimed?',
        answer:
          'No. It strictly performs deterministic nucleotide base mapping and reverse-complement rules.',
      },
    ],
    relatedTools: [
      'science-chemistry-solutions-calculator',
      'science-physics-calculator',
      'developer-base64-encoder-decoder',
      'unit-unit-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
