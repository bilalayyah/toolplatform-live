import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const UNIT_CONVERTER_TOOLS: readonly Tool[] = [
  {
    id: 'unit-unit-converter',
    name: 'Unit Converter',
    slug: 'unit-unit-converter',
    category: 'unit-converters',
    url: '/unit-unit-converter',
    description:
      'Exact browser conversions for cm to inches, kg to pounds, °C to °F, km/h to mph, litres to gallons, tola, quintal, and feet to cm.',
    longDescription:
      'Convert everyday length, weight, temperature, speed, and liquid volume units instantaneously in your browser using exact standard factors—covering cm ↔ inches, feet ↔ cm, kg ↔ pounds, tola (11.6638 g), quintal (100 kg), °C ↔ °F, km/h ↔ mph, and litres ↔ gallons with zero tracking or AI.',
    keywords: [
      'unit converter',
      'cm to inches',
      'kg to pounds',
      'celsius to fahrenheit',
      'tola quintal converter',
      'feet to cm',
    ],
    icon: 'Scale',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Unit Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert cm to inches, kg to pounds, °C to °F, km/h to mph, litres to gallons, tola, quintal, and feet to cm using exact factors.',
    howTo: [
      {
        title: 'Choose measurement category',
        description:
          'Pick length, mass/weight (including tola and quintal), temperature, speed, or volume.',
      },
      {
        title: 'Enter value and source unit',
        description:
          'Type any number and select units like cm, inches, feet, kg, pounds, °C, °F, km/h, mph, or litres.',
      },
      {
        title: 'Copy exact converted output',
        description:
          'Read precise two-way conversion results computed instantaneously in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Which South Asian and international mass units are included?',
        answer:
          'Alongside kilograms, grams, and pounds, it includes tola (11.6638 grams) and quintal (100 kilograms) using exact standard factors.',
      },
      {
        question: 'Are gallon conversions US or Imperial?',
        answer:
          'Litres-to-gallons presets clearly label US liquid gallons (3.78541 L) and Imperial gallons (4.54609 L) separately.',
      },
      {
        question: 'Does Unit Converter work instantaneously without server calls?',
        answer:
          'Yes. All unit formulas execute directly inside your browser.',
      },
      {
        question: 'Does this cover regional land measurements like bigha or marla?',
        answer:
          'Use our dedicated Land Area Converter under Unit Converters for bigha, biswa, katha, gaj, marla, kanal, guntha, cent, acre, and hectare.',
      },
    ],
    relatedTools: [
      'unit-land-area-converter',
      'unit-currency-converter',
      'productivity-expense-reminder',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'unit-land-area-converter',
    name: 'Land Area Converter',
    slug: 'unit-land-area-converter',
    category: 'unit-converters',
    url: '/unit-land-area-converter',
    description:
      'Convert bigha, biswa, katha, gaj, marla, kanal, guntha, cent, acre, and hectare to sq ft (bigha size varies by region).',
    longDescription:
      'Calculate land area cleanly in square feet (sq ft) across bigha, biswa, katha, gaj, marla, kanal, guntha, cent, acre, and hectare. Important note: bigha size varies by region across states and countries, so regional presets and custom sq ft multipliers are clearly labeled.',
    keywords: [
      'land area converter',
      'bigha to sq ft',
      'biswa katha gaj marla kanal',
      'guntha cent acre hectare',
      'plot measurement',
    ],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Land Area Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert bigha, biswa, katha, gaj, marla, kanal, guntha, cent, acre, and hectare to sq ft with regional bigha notes.',
    howTo: [
      {
        title: 'Select land unit and region',
        description:
          'Pick bigha, biswa, katha, gaj, marla, kanal, guntha, cent, acre, or hectare and choose a regional preset where applicable.',
      },
      {
        title: 'Enter area value',
        description:
          'Type the plot measurement or override the sq ft per bigha/biswa factor if your local registry differs.',
      },
      {
        title: 'Read square feet & cross-units',
        description:
          'See converted sq ft alongside acres, hectares, and gaj instantaneously in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Why does the page note that bigha size varies by region?',
        answer:
          'Unlike standardized international acres (43,560 sq ft) or hectares, traditional units such as bigha, biswa, and katha vary significantly by state and locality (for example, pucca vs. kachha bigha).',
      },
      {
        question: 'Can I verify my local land registry factor?',
        answer:
          'Yes. Regional presets are clearly labeled and you can verify against your local revenue authority or deed factor.',
      },
      {
        question: 'Which fixed-ratio units convert identically everywhere?',
        answer:
          'Standard acre (43,560 sq ft), hectare (107,639.104 sq ft), cent (435.6 sq ft), guntha (1,089 sq ft), and standard square yard/gaj (9 sq ft) use exact fixed factors.',
      },
      {
        question: 'Does Land Area Converter run in the browser without login?',
        answer:
          'Yes. Pure math executes locally on your device.',
      },
    ],
    relatedTools: [
      'unit-unit-converter',
      'unit-currency-converter',
      'productivity-expense-reminder',
      'productivity-daily-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'unit-currency-converter',
    name: 'Currency Converter',
    slug: 'unit-currency-converter',
    category: 'unit-converters',
    url: '/unit-currency-converter',
    description:
      'Convert 150+ currencies via a free public exchange-rate API (no key) with manual rate fallback—indicative mid-market rates only.',
    longDescription:
      'Convert across 150+ world currencies directly in your browser using a free public exchange-rate API with zero API key required, plus a manual exchange-rate input mode if the API is unreachable or you are offline. Displayed rates are indicative mid-market rates, not bank or remittance execution rates.',
    keywords: [
      'currency converter',
      'exchange rate calculator',
      '150 currencies',
      'mid-market exchange rates',
      'manual rate converter',
    ],
    icon: 'Banknote',
    acceptedFormats: ['Numeric', 'Public API'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Currency Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert 150+ currencies using a free no-key public exchange-rate API or manual rate entry. Indicative mid-market rates.',
    howTo: [
      {
        title: 'Choose source and target currencies',
        description:
          'Select from 150+ international currencies and enter an amount to convert.',
      },
      {
        title: 'Fetch free public mid-market rate',
        description:
          'Rates load in-browser from a free public exchange-rate endpoint with no API key.',
      },
      {
        title: 'Use manual rate fallback anytime',
        description:
          'If the public API is unavailable or you want your own bank quote, type a custom rate manually.',
      },
    ],
    faqs: [
      {
        question: 'Are these exact bank or wire-transfer rates?',
        answer:
          'No. Rates shown are indicative mid-market reference rates, not bank, card, or remittance buy/sell rates.',
      },
      {
        question: 'What happens if the free public exchange-rate API is unavailable?',
        answer:
          'You can switch directly to manual rate entry and calculate conversions offline with any custom rate.',
      },
      {
        question: 'How many currencies are supported?',
        answer:
          'Currency Converter is specified to cover 150+ global ISO currency codes.',
      },
      {
        question: 'Does this require creating an API key or user account?',
        answer:
          'No. It uses a free, keyless public exchange-rate feed and runs directly in your browser.',
      },
    ],
    relatedTools: [
      'unit-unit-converter',
      'unit-land-area-converter',
      'productivity-expense-reminder',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
