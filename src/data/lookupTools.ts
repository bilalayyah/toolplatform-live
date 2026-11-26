import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const LOOKUP_TOOLS: readonly Tool[] = [
  {
    id: 'lookup-mac-address-lookup',
    name: 'MAC Address Lookup',
    slug: 'lookup-mac-address-lookup',
    category: 'lookup-tools',
    url: '/lookup-mac-address-lookup',
    description:
      'Search the public OUI database by full/partial MAC address or vendor name—identifies the manufacturer only, never an individual device owner.',
    longDescription:
      'Look up Ethernet or Wi-Fi hardware prefixes in the public IEEE OUI registry by entering a full MAC address, a 6-character OUI prefix, or a manufacturer name locally in your browser. Important honesty note: OUI lookup identifies the hardware manufacturer only—it can never identify an individual device owner, person, or physical location.',
    keywords: [
      'mac address lookup',
      'oui vendor lookup',
      'mac prefix manufacturer',
      'network interface vendor',
      'find mac manufacturer',
    ],
    icon: 'Router',
    acceptedFormats: ['MAC / OUI / Company'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `MAC Address Lookup — OUI Vendor Finder | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Search public IEEE OUI prefixes by full/partial MAC address or vendor name in your browser. Identifies manufacturer only, never owners.',
    howTo: [
      {
        title: 'Enter full/partial MAC or company name',
        description:
          'Paste formats like AA:BB:CC:11:22:33, AABBCC, or type a hardware brand name.',
      },
      {
        title: 'Match against public OUI registry',
        description:
          'Browser index matching finds the assigned IEEE Organizationally Unique Identifier (OUI) vendor block.',
      },
      {
        title: 'Inspect manufacturer details',
        description:
          'Read the registered hardware manufacturer name—remembering it identifies the vendor only, never a personal device owner.',
      },
    ],
    faqs: [
      {
        question: 'Can MAC Address Lookup identify who owns a device or where it is?',
        answer:
          'No—never. A MAC OUI prefix identifies only the network hardware manufacturer (or a randomized/locally administered bit), never an individual person, owner, or location.',
      },
      {
        question: 'Can I search by partial MAC prefix or vendor company name?',
        answer:
          'Yes. You can query by full MAC address, partial hex OUI prefix, or manufacturer name.',
      },
      {
        question: 'What if a device uses MAC address randomization?',
        answer:
          'Modern phones and laptops often generate locally administered random addresses (second hex char 2, 6, A, or E), which do not map to a hardware manufacturer.',
      },
      {
        question: 'Need dummy MAC addresses for lab testing instead?',
        answer:
          'Use MAC Address Generator under Generators to create locally-administered test addresses.',
      },
    ],
    relatedTools: [
      'mac-address-generator',
      'lookup-trademark-class-finder',
      'uuid-generator',
      'developer-url-encoder-decoder',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'lookup-trademark-class-finder',
    name: 'Trademark Class Finder',
    slug: 'lookup-trademark-class-finder',
    category: 'lookup-tools',
    url: '/lookup-trademark-class-finder',
    description:
      'Describe your goods or services to narrow down Nice Classification trademark classes (1–45) in your browser—guide only, not legal advice.',
    longDescription:
      'Match product descriptions or service keywords against the standard international Nice Classification (45 classes: Classes 1–34 for goods and Classes 35–45 for services) inside your browser using deterministic keyword indexing—NOT AI. Important honesty note: this tool is a general classification guide only and does NOT constitute legal advice or guarantee trademark registration.',
    keywords: [
      'trademark class finder',
      'nice classification 45 classes',
      'trademark goods services class',
      'brand class lookup',
      'nice classes search',
    ],
    icon: 'Search',
    acceptedFormats: ['Keyword / Description'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Trademark Class Finder (Nice 45 Classes) | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Narrow down standard Nice Classification trademark classes (1–45) from goods or services descriptions. Guide only, not legal advice.',
    howTo: [
      {
        title: 'Describe your goods or services',
        description:
          'Type keywords such as "mobile app software", "cotton t-shirts", or "coffee shop".',
      },
      {
        title: 'Browse matched Nice classes (1–45)',
        description:
          'Deterministic keyword search highlights relevant Goods (1–34) and Services (35–45) classes—NOT AI.',
      },
      {
        title: 'Use as a preliminary filing guide',
        description:
          'Review matching class titles and notes before consulting a trademark attorney or national registry—this is a guide only, not legal advice.',
      },
    ],
    faqs: [
      {
        question: 'Is Trademark Class Finder legal advice?',
        answer:
          'No—this tool is a preliminary reference guide only and is NOT legal advice. Consult a qualified trademark attorney or official trademark office before filing.',
      },
      {
        question: 'Which classification system does it cover?',
        answer:
          'It indexes the standard international Nice Classification across all 45 classes (Classes 1–34 for goods and Classes 35–45 for services).',
      },
      {
        question: 'Does Trademark Class Finder use AI?',
        answer:
          'No. Matching runs deterministically against Nice Classification headings and term keywords in your browser.',
      },
      {
        question: 'Does it search whether a specific brand name is already registered?',
        answer:
          'No. It narrows down applicable Nice Classes for goods/services only and does not query national trademark databases.',
      },
    ],
    relatedTools: [
      'lookup-mac-address-lookup',
      'document-contract-generator',
      'document-proposal-generator',
      'slug-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
