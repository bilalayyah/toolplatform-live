import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const LAND_AREA_UNIT_TOOLS: readonly Tool[] = [
  {
    id: 'acreage-calculator',
    name: 'Acreage Calculator',
    slug: 'acreage-calculator',
    category: 'unit-converters',
    url: '/acreage-calculator',
    description:
      'Pure formula acreage calculator measuring a rectangular lot, triangular parcel, or circular plot into acres, sq ft, sq m, and hectares.',
    longDescription:
      'Calculate land plot area directly inside your browser by choosing a rectangular lot (length × width), triangular parcel (base × height ÷ 2 or Heron’s 3-side formula), or circular plot (πr²)—converting dimensions entered in feet, metres, yards, or rods into exact acres, square feet, square metres, and hectares with zero AI.',
    keywords: [
      'acreage calculator',
      'land plot area rectangular triangular circular',
      'lot size in acres',
      'measure parcel acreage',
    ],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acreage Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Measure a rectangular lot, triangular parcel, or circular plot cleanly into acres, square feet, square metres, and hectares in your browser.',
    howTo: [
      {
        title: 'Choose plot geometry',
        description:
          'Once live, pick rectangular lot, triangular parcel (base/height or 3 sides), or circular plot.',
      },
      {
        title: 'Enter edge or radius measurements',
        description:
          'Type dimensions in feet, metres, or yards—pure geometry formulas run locally in your browser.',
      },
      {
        title: 'Inspect acreage & area breakdown',
        description:
          'View exact acres alongside square feet (43,560 sq ft/ac), square metres, and hectares.',
      },
    ],
    faqs: [
      {
        question: 'Which plot shapes does Acreage Calculator support?',
        answer:
          'Rectangular lots, triangular parcels (using base & height or all 3 side lengths via Heron’s formula), and circular plots.',
      },
      {
        question: 'How many square feet equal 1 acre?',
        answer:
          'One international acre equals exactly 43,560 square feet (or ~4,046.8564 square metres).',
      },
      {
        question: 'Does Acreage Calculator replace a licensed land survey?',
        answer:
          'No—it computes exact geometric area from your entered boundary lengths; formal boundary lines require a registered surveyor.',
      },
      {
        question: 'Is AI used in Acreage Calculator?',
        answer:
          'No—pure Euclidean geometry and standard acreage multipliers only.',
      },
    ],
    relatedTools: [
      'acres-to-square-feet-converter',
      'acres-to-hectares-converter',
      'square-feet-to-acres-converter',
      'unit-land-area-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-hectares-converter',
    name: 'Acres to Hectares Converter',
    slug: 'acres-to-hectares-converter',
    category: 'unit-converters',
    url: '/acres-to-hectares-converter',
    description:
      'Pure formula converter turning acres into hectares cleanly in your browser using 1 acre = 0.40468564224 hectares.',
    longDescription:
      'Convert farmland, estate plots, and real-estate acreage into exact metric hectares (10,000 m² each) locally in your browser using the exact international factor `1 acre = 0.40468564224 ha`—pure formula math with zero AI.',
    keywords: ['acres to hectares', 'ac to ha converter', 'farm acreage to hectares', 'land area formula'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Hectares Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to exact metric hectares (ha) cleanly inside your browser using 1 acre = 0.40468564 ha.',
    howTo: [
      {title: 'Enter area in acres', description: 'Once live, enter any parcel size in acres.'},
      {title: 'Multiply by 0.40468564224', description: 'Pure browser math applies the exact international acre-to-hectare factor.'},
      {title: 'Copy hectares result', description: 'Use the exact hectare figure for land registries or agricultural records.'},
    ],
    faqs: [
      {question: 'How many hectares equal 1 acre?', answer: '1 international acre equals 0.40468564224 hectares (4,046.8564224 square metres).'},
      {question: 'Need Hectares back to Acres?', answer: 'Use Hectares to Acres Converter under Unit Converters.'},
      {question: 'How many square metres are in 1 hectare?', answer: 'Exactly 10,000 square metres (a 100 m × 100 m square).'},
      {question: 'Is this a pure formula converter?', answer: 'Yes—pure browser arithmetic with zero AI.'},
    ],
    relatedTools: [
      'hectares-to-acres-converter',
      'acres-to-square-meters-converter',
      'acres-to-square-feet-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-perches-converter',
    name: 'Acres to Perches Converter',
    slug: 'acres-to-perches-converter',
    category: 'unit-converters',
    url: '/acres-to-perches-converter',
    description:
      'Pure formula converter turning acres into square perches (1 acre = 160 perches) cleanly inside your browser.',
    longDescription:
      'Convert acres into traditional square perches (also known as square rods or poles, widely used in Sri Lankan, Caribbean, and historic British deeds) inside your browser using the exact statutory ratio `1 acre = 160 square perches`—NOT AI.',
    keywords: ['acres to perches', 'square perch converter', '160 perches per acre', 'deed land unit'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Perches Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to square perches (1 acre = 160 perches) accurately using pure formulas in your browser.',
    howTo: [
      {title: 'Enter area in acres', description: 'Once live, type any whole or decimal acreage.'},
      {title: 'Multiply cleanly by 160', description: 'Pure browser math applies the exact 160 perches per acre definition.'},
      {title: 'Copy square perches result', description: 'Also inspect square feet (272.25 sq ft/perch) cleanly.'},
    ],
    faqs: [
      {question: 'How many square perches equal 1 acre?', answer: 'Exactly 160 square perches equal 1 acre (and 1 rood equals 40 square perches).'},
      {question: 'How large is 1 square perch in square feet?', answer: 'Since 1 perch (rod) is 16.5 feet, 1 square perch equals 272.25 square feet (~25.2929 m²).'},
      {question: 'Need Perches back to Acres?', answer: 'Use Perches to Acres Converter under Unit Converters.'},
      {question: 'Does this tool use AI?', answer: 'No—exact 160× statutory multiplication only.'},
    ],
    relatedTools: [
      'perches-to-acres-converter',
      'acres-to-square-feet-converter',
      'acres-to-hectares-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-square-feet-converter',
    name: 'Acres to Square Feet Converter',
    slug: 'acres-to-square-feet-converter',
    category: 'unit-converters',
    url: '/acres-to-square-feet-converter',
    description:
      'Pure formula converter turning acres into square feet (sq ft) inside your browser—one acre = 43,560 square feet.',
    longDescription:
      'Convert residential, commercial, or agricultural acreage into exact square feet locally inside your browser using the exact international and US survey definition `one acre = 43,560 square feet`—pure formula math with zero uploads and zero AI.',
    keywords: ['acres to square feet', 'ac to sq ft', '43560 sq ft per acre', 'plot square footage'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Square Feet Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to square feet cleanly in your browser using the exact 1 acre = 43,560 sq ft factor.',
    howTo: [
      {title: 'Enter value in acres', description: 'Once live, input any fractional or whole acre value (such as 0.25 ac).'},
      {title: 'Multiply by exactly 43,560', description: 'Pure browser math calculates exact square feet instantaneously.'},
      {title: 'Copy square footage output', description: 'Inspect sq ft cleanly for listings, builders, or site plans.'},
    ],
    faqs: [
      {question: 'Exactly how many square feet are in one acre?', answer: 'One acre equals exactly 43,560 square feet (for instance, 0.5 acre = 21,780 sq ft).'},
      {question: 'Why does an acre equal 43,560 square feet?', answer: 'Historically defined as 1 chain (66 ft) × 1 furlong (660 ft) = 43,560 sq ft.'},
      {question: 'Need Square Feet back to Acres?', answer: 'Use Square Feet to Acres Converter under Unit Converters.'},
      {question: 'Is AI used?', answer: 'No—pure 43,560 multiplication only.'},
    ],
    relatedTools: [
      'square-feet-to-acres-converter',
      'acreage-calculator',
      'acres-to-square-meters-converter',
      'acres-to-square-yards-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-square-meters-converter',
    name: 'Acres to Square Meters Converter',
    slug: 'acres-to-square-meters-converter',
    category: 'unit-converters',
    url: '/acres-to-square-meters-converter',
    description:
      'Pure formula converter turning acres into square metres (m²) using 1 acre = 4,046.8564224 square metres.',
    longDescription:
      'Convert acres accurately into metric square metres (m²) locally inside your browser using the exact international foot-to-metre standard (`1 acre = 4,046.8564224 m²`)—pure formula calculation with zero AI.',
    keywords: ['acres to square meters', 'ac to m2 sqm', '4046.86 square meters per acre', 'metric land area'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Square Meters Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to square metres (m²) accurately using the exact 4,046.8564 factor in your browser.',
    howTo: [
      {title: 'Enter acreage value', description: 'Once live, type any parcel size in acres.'},
      {title: 'Multiply by 4,046.8564224', description: 'Pure browser math calculates exact metric square metres.'},
      {title: 'Copy m² figure', description: 'Use the exact square-metre total for planning and CAD docs.'},
    ],
    faqs: [
      {question: 'How many square metres are in 1 acre?', answer: '1 international acre equals 4,046.8564224 square metres.'},
      {question: 'Need Square Meters back to Acres?', answer: 'Use Square Meters to Acres Converter under Unit Converters.'},
      {question: 'Need hectares as well?', answer: 'Divide square metres by 10,000, or use Acres to Hectares Converter.'},
      {question: 'Does this tool run offline without AI?', answer: 'Yes—pure browser arithmetic.'},
    ],
    relatedTools: [
      'square-meters-to-acres-converter',
      'acres-to-hectares-converter',
      'acres-to-square-feet-converter',
      'square-feet-to-square-meters-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-square-miles-converter',
    name: 'Acres to Square Miles Converter',
    slug: 'acres-to-square-miles-converter',
    category: 'unit-converters',
    url: '/acres-to-square-miles-converter',
    description:
      'Pure formula converter turning acres into square miles (sq mi) using exact 640 acres = 1 square mile.',
    longDescription:
      'Convert large ranch parcels, forest reserves, and municipal tracts from acres into statute square miles (sq mi) inside your browser using the exact Public Land Survey System ratio `1 square mile = 640 acres`—NOT AI.',
    keywords: ['acres to square miles', 'ac to sq mi', '640 acres per square mile', 'section land area'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Square Miles Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to square miles (sq mi) cleanly in your browser using exact division by 640.',
    howTo: [
      {title: 'Enter area in acres', description: 'Once live, enter any parcel or tract acreage.'},
      {title: 'Divide cleanly by 640', description: 'Pure browser formula converts acres into exact square miles.'},
      {title: 'Copy square miles output', description: 'Inspect exact decimal square miles immediately.'},
    ],
    faqs: [
      {question: 'How many acres are in 1 square mile?', answer: 'Exactly 640 acres equal 1 statute square mile (one US survey section).'},
      {question: 'Need Square Miles back to Acres?', answer: 'Use Square Miles to Acres Converter under Unit Converters.'},
      {question: 'Can it convert smaller quarter-sections like 160 acres?', answer: 'Yes—160 acres divides cleanly into 0.25 square miles.'},
      {question: 'Is this purely formula-driven?', answer: 'Yes—no AI or uploads.'},
    ],
    relatedTools: [
      'square-miles-to-acres-converter',
      'acres-to-hectares-converter',
      'acres-to-square-yards-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'acres-to-square-yards-converter',
    name: 'Acres to Square Yards Converter',
    slug: 'acres-to-square-yards-converter',
    category: 'unit-converters',
    url: '/acres-to-square-yards-converter',
    description:
      'Pure formula converter turning acres into square yards (sq yd / gaj) using exact 1 acre = 4,840 square yards.',
    longDescription:
      'Convert land area from acres into exact square yards (sq yd, equivalent to standard gaj = 9 sq ft) inside your browser using the exact statutory ratio `1 acre = 4,840 square yards`—pure formula math with zero AI.',
    keywords: ['acres to square yards', 'ac to sq yd gaj', '4840 square yards per acre', 'plot yardage'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Acres to Square Yards Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert acres to exact square yards (sq yd) in your browser using 1 acre = 4,840 sq yd.',
    howTo: [
      {title: 'Enter value in acres', description: 'Once live, input any acreage figure.'},
      {title: 'Multiply by exactly 4,840', description: 'Pure browser math outputs exact square yards.'},
      {title: 'Copy square yards output', description: 'View square feet (×9) alongside square yards.'},
    ],
    faqs: [
      {question: 'How many square yards equal 1 acre?', answer: 'Exactly 4,840 square yards equal 1 acre (43,560 sq ft ÷ 9 sq ft/yd² = 4,840).'},
      {question: 'Need Square Yards back to Acres?', answer: 'Use Square Yards to Acres Converter under Unit Converters.'},
      {question: 'Does square yard equal 1 standard South Asian gaj?', answer: 'Yes—standard gaj equals 1 square yard (9 sq ft); for regional plots like bigha, see Indian Land Unit Converter.'},
      {question: 'Is AI used?', answer: 'No—pure 4,840 multiplication only.'},
    ],
    relatedTools: [
      'square-yards-to-acres-converter',
      'acres-to-square-feet-converter',
      'indian-land-unit-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'hectares-to-acres-converter',
    name: 'Hectares to Acres Converter',
    slug: 'hectares-to-acres-converter',
    category: 'unit-converters',
    url: '/hectares-to-acres-converter',
    description:
      'Pure formula converter turning metric hectares (ha) into acres cleanly using 1 hectare ≈ 2.47105381 acres.',
    longDescription:
      'Convert agricultural land, zoning blocks, and forest areas from metric hectares (10,000 m² each) into exact international acres locally inside your browser using exact factor math (`ha × 2.4710538147`)—pure formula calculation, NOT AI.',
    keywords: ['hectares to acres', 'ha to ac converter', '2.471 acres per hectare', 'land registry conversion'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Hectares to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert metric hectares (ha) to exact acres cleanly in your browser using 1 ha = 2.4710538 acres.',
    howTo: [
      {title: 'Enter area in hectares (ha)', description: 'Once live, input any metric hectare number.'},
      {title: 'Divide by 0.40468564224', description: 'Pure browser math computes exact acres accurately.'},
      {title: 'Copy acreage result', description: 'Compare acres alongside square feet and square metres.'},
    ],
    faqs: [
      {question: 'How many acres are in 1 hectare?', answer: '1 hectare (10,000 m²) equals approximately 2.47105 acres.'},
      {question: 'Need Acres back to Hectares?', answer: 'Use Acres to Hectares Converter under Unit Converters.'},
      {question: 'Does this cover square metres and square feet too?', answer: 'Yes—exact m² (ha × 10,000) and sq ft equivalents compute cleanly.'},
      {question: 'Is AI involved?', answer: 'No—pure SI-to-acre math only.'},
    ],
    relatedTools: [
      'acres-to-hectares-converter',
      'square-meters-to-acres-converter',
      'acreage-calculator',
      'indian-land-unit-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'indian-land-unit-converter',
    name: 'Indian Land Unit Converter',
    slug: 'indian-land-unit-converter',
    category: 'unit-converters',
    url: '/indian-land-unit-converter',
    description:
      'Convert bigha, biswa, katha, kanal, marla, guntha, cent, ground, and gaj with state selection—local unit names vary by Indian state.',
    longDescription:
      'Convert traditional South Asian and Indian regional land measurements—bigha, biswa, biswansi, katha, chatak, dhur, kanal, marla, guntha, cent, ground, ankanam, and gaj—into sq ft, sq m, and acres inside your browser. Important honesty note: local land-unit names represent DIFFERENT areas in different Indian states and districts (for example, pucca vs. kachha bigha in UP vs. Rajasthan vs. West Bengal vs. Assam), so state presets are clearly labeled.',
    keywords: [
      'indian land unit converter',
      'indian land unit',
      'bigha biswa katha kanal marla guntha cent state wise',
      'india land area calculator',
    ],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric + State Selection'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Indian Land Unit Converter — State-Wise | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert state-wise Indian land units (bigha, biswa, katha, kanal, marla, guntha, cent). Local unit sizes vary by state.',
    howTo: [
      {
        title: 'Pick your Indian state preset',
        description:
          'Once live, choose your state because local land-unit names (like bigha or katha) vary widely across states.',
      },
      {
        title: 'Enter area & source regional unit',
        description:
          'Select bigha, biswa, katha, kanal, marla, guntha, cent, or gaj and type your plot value.',
      },
      {
        title: 'Read state-calibrated sq ft, sq m & acres',
        description:
          'Inspect exact converted output and override custom local deed factors if needed.',
      },
    ],
    faqs: [
      {
        question: 'Why do local Indian land-unit names convert to different areas in different states?',
        answer:
          'Honest notice: traditional units such as bigha, biswa, and katha are NOT standardized nationwide—for example, 1 bigha in Assam (14,400 sq ft) differs sharply from Uttar Pradesh pucca bigha (27,225 sq ft) or Himachal Pradesh bigha (~8,712 sq ft).',
      },
      {
        question: 'Which Indian land units have fixed nationwide values?',
        answer:
          'Guntha (1,089 sq ft), cent (435.6 sq ft), acre (43,560 sq ft), hectare (107,639.1 sq ft), and standard marla/kanal (when standardized as 272.25 / 5,445 sq ft) use consistent ratios.',
      },
      {
        question: 'Should I verify with my local Tehsil or Patwari record?',
        answer:
          'Yes—always confirm sub-district revenue definitions on official state Bhulekh deeds before legal transactions.',
      },
      {
        question: 'Does Indian Land Unit Converter use AI?',
        answer:
          'No—pure state lookup tables and area multiplication only.',
      },
    ],
    relatedTools: [
      'unit-land-area-converter',
      'acreage-calculator',
      'acres-to-square-feet-converter',
      'hectares-to-acres-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'perches-to-acres-converter',
    name: 'Perches to Acres Converter',
    slug: 'perches-to-acres-converter',
    category: 'unit-converters',
    url: '/perches-to-acres-converter',
    description:
      'Pure formula converter turning square perches into acres cleanly inside your browser—160 square perches per acre.',
    longDescription:
      'Convert deed measurements from square perches (square rods/poles) into exact acres, square feet, and square metres locally inside your browser using the exact statutory ratio `160 square perches per acre`—pure formula math with zero AI.',
    keywords: ['perches to acres', '160 perches per acre', 'square perch to acre', 'land deed perches'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Perches to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square perches to acres cleanly in your browser using the exact 160 square perches per acre ratio.',
    howTo: [
      {title: 'Enter area in square perches', description: 'Once live, enter perches from a land survey or deed.'},
      {title: 'Divide cleanly by 160', description: 'Pure browser formula divides by 160 square perches per acre.'},
      {title: 'Inspect acres, sq ft & m²', description: 'View exact acres alongside 272.25 sq ft per perch.'},
    ],
    faqs: [
      {question: 'How many square perches equal one acre?', answer: 'There are exactly 160 square perches per acre (so 40 perches = 0.25 acre).'},
      {question: 'How many square feet is 20 perches?', answer: '20 perches = 0.125 acre = 5,445 square feet (~505.86 m²).'},
      {question: 'Need Acres back to Perches?', answer: 'Use Acres to Perches Converter under Unit Converters.'},
      {question: 'Is AI used?', answer: 'No—exact 160 divisor math only.'},
    ],
    relatedTools: [
      'acres-to-perches-converter',
      'square-feet-to-acres-converter',
      'acreage-calculator',
      'acres-to-hectares-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-feet-to-acres-converter',
    name: 'Square Feet to Acres Converter',
    slug: 'square-feet-to-acres-converter',
    category: 'unit-converters',
    url: '/square-feet-to-acres-converter',
    description:
      'Pure formula converter turning square feet (sq ft) into acres cleanly inside your browser using sq ft ÷ 43,560.',
    longDescription:
      'Convert lot square footage (`sq ft` or `ft²`) cleanly into exact acres locally inside your browser using `acres = square feet ÷ 43,560`—pure formula math with zero uploads and zero AI.',
    keywords: ['square feet to acres', 'sq ft to ac', 'divide by 43560', 'lot size to acres'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Feet to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square feet (sq ft) to exact acres cleanly in your browser using exact division by 43,560.',
    howTo: [
      {title: 'Enter area in square feet (sq ft)', description: 'Once live, input any building lot or floor/parcel sq ft value.'},
      {title: 'Divide cleanly by 43,560', description: 'Pure browser math outputs exact acres instantaneously.'},
      {title: 'Copy acreage figure', description: 'Read precise decimal acres without login or AI.'},
    ],
    faqs: [
      {question: 'What is 10,000 square feet in acres?', answer: '10,000 sq ft ÷ 43,560 = 0.229568 acres (just under a quarter acre).'},
      {question: 'How many square feet make a quarter acre?', answer: 'Exactly 10,890 square feet equal 0.25 acre.'},
      {question: 'Need Acres back to Square Feet?', answer: 'Use Acres to Square Feet Converter under Unit Converters.'},
      {question: 'Does this run offline?', answer: 'Yes—pure browser division.'},
    ],
    relatedTools: [
      'acres-to-square-feet-converter',
      'square-feet-to-square-meters-converter',
      'acreage-calculator',
      'square-meters-to-acres-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-feet-to-square-meters-converter',
    name: 'Square Feet to Square Meters Converter',
    slug: 'square-feet-to-square-meters-converter',
    category: 'unit-converters',
    url: '/square-feet-to-square-meters-converter',
    description:
      'Pure formula floor & land converter turning square feet (sq ft) into square metres (m²) using 1 sq ft = 0.09290304 m².',
    longDescription:
      'Convert apartment floor plans, office space, and land lots from square feet (`sq ft`) into exact metric square metres (`m²`) directly inside your browser using the exact international constant `1 sq ft = 0.3048² m² = 0.09290304 m²`—NOT AI.',
    keywords: ['square feet to square meters', 'sq ft to sq m m2', 'floor area converter', '0.09290304'],
    icon: 'Ruler',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Feet to Square Meters Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square feet (sq ft) to exact square metres (m²) using 1 sq ft = 0.09290304 m² in your browser.',
    howTo: [
      {title: 'Enter area in square feet (sq ft)', description: 'Once live, input any apartment, room, or lot area in sq ft.'},
      {title: 'Multiply by 0.09290304', description: 'Pure browser math applies the exact squared foot factor (0.3048²).'},
      {title: 'Copy metric square metres', description: 'Inspect clean m² output immediately.'},
    ],
    faqs: [
      {question: 'What is the exact formula from sq ft to sq m?', answer: 'Multiply square feet by exactly 0.09290304 (since 1 ft = 0.3048 m).'},
      {question: 'How many square metres is a 1,000 sq ft apartment?', answer: '1,000 sq ft equals approximately 92.90 square metres.'},
      {question: 'Need Square Meters back to Square Feet?', answer: 'Use Square Meters to Square Feet Converter under Unit Converters.'},
      {question: 'Is AI used?', answer: 'No—exact 0.09290304 multiplication only.'},
    ],
    relatedTools: [
      'square-meters-to-square-feet-converter',
      'square-feet-to-acres-converter',
      'unit-feet-to-meters-converter',
      'unit-land-area-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-meters-to-acres-converter',
    name: 'Square Meters to Acres Converter',
    slug: 'square-meters-to-acres-converter',
    category: 'unit-converters',
    url: '/square-meters-to-acres-converter',
    description:
      'Pure formula converter turning metric square metres (m²) into acres using m² ÷ 4,046.8564224.',
    longDescription:
      'Convert metric plot areas from square metres (`m²`) cleanly into international acres inside your browser using `acres = m² ÷ 4,046.8564224`—showing exact acres alongside hectares (`m² ÷ 10,000`) with zero AI.',
    keywords: ['square meters to acres', 'sq m m2 to acres', 'metric lot to acres', 'land conversion'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Meters to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square metres (m²) to exact acres cleanly in your browser using exact m² ÷ 4,046.8564 math.',
    howTo: [
      {title: 'Enter area in square metres (m²)', description: 'Once live, input any parcel area in metric m².'},
      {title: 'Divide by 4,046.8564224', description: 'Pure browser math outputs exact acres and hectares.'},
      {title: 'Copy acreage result', description: 'Read clean international acres immediately.'},
    ],
    faqs: [
      {question: 'How many acres equal 5,000 square metres?', answer: '5,000 m² ÷ 4,046.8564 = ~1.2355 acres (half a hectare).'},
      {question: 'Need Acres back to Square Meters?', answer: 'Use Acres to Square Meters Converter under Unit Converters.'},
      {question: 'Need Square Meters to Square Feet instead?', answer: 'Use Square Meters to Square Feet Converter under Unit Converters.'},
      {question: 'Is this purely formula math?', answer: 'Yes—pure browser arithmetic with zero AI.'},
    ],
    relatedTools: [
      'acres-to-square-meters-converter',
      'square-meters-to-square-feet-converter',
      'hectares-to-acres-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-meters-to-square-feet-converter',
    name: 'Square Meters to Square Feet Converter',
    slug: 'square-meters-to-square-feet-converter',
    category: 'unit-converters',
    url: '/square-meters-to-square-feet-converter',
    description:
      'Pure formula converter turning metric square metres (m²) into square feet (sq ft) using 1 m² ≈ 10.76391042 sq ft.',
    longDescription:
      'Convert architectural floor plans, interiors, and land dimensions from metric square metres (`m²`) into exact square feet (`sq ft`) inside your browser using the exact inverse of `0.3048²` (`m² ÷ 0.09290304`)—pure formula calculation, NOT AI.',
    keywords: ['square meters to square feet', 'm2 sqm to sq ft', '10.7639 sq ft per sqm', 'room area converter'],
    icon: 'Ruler',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Meters to Square Feet Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square metres (m²) to exact square feet (sq ft) using 1 m² = 10.7639104 sq ft in your browser.',
    howTo: [
      {title: 'Enter area in square metres (m²)', description: 'Once live, input any floor, office, or parcel metric area.'},
      {title: 'Divide cleanly by 0.09290304', description: 'Pure browser math outputs exact square feet instantaneously.'},
      {title: 'Copy square feet result', description: 'Compare room or property area in sq ft right away.'},
    ],
    faqs: [
      {question: 'How many square feet equal 1 square metre?', answer: '1 square metre equals approximately 10.76391 square feet (exact 1 ÷ 0.3048²).'},
      {question: 'What is 100 square metres in square feet?', answer: '100 m² equals approximately 1,076.39 square feet.'},
      {question: 'Need Square Feet back to Square Meters?', answer: 'Use Square Feet to Square Meters Converter under Unit Converters.'},
      {question: 'Does this run without AI?', answer: 'Yes—pure browser arithmetic only.'},
    ],
    relatedTools: [
      'square-feet-to-square-meters-converter',
      'square-meters-to-acres-converter',
      'unit-meters-to-feet-converter',
      'unit-land-area-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-miles-to-acres-converter',
    name: 'Square Miles to Acres Converter',
    slug: 'square-miles-to-acres-converter',
    category: 'unit-converters',
    url: '/square-miles-to-acres-converter',
    description:
      'Pure formula converter turning statute square miles (sq mi) into acres cleanly using exact 1 sq mi = 640 acres.',
    longDescription:
      'Convert geographic regions, counties, watersheds, and large estates from statute square miles (`sq mi`) directly into exact acres locally inside your browser using the exact statutory ratio `1 square mile = 640 acres`—NOT AI.',
    keywords: ['square miles to acres', 'sq mi to acres', '640 acres per square mile', 'geographic area converter'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Miles to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert statute square miles (sq mi) to exact acres cleanly in your browser using exact × 640 math.',
    howTo: [
      {title: 'Enter area in square miles (sq mi)', description: 'Once live, input any fractional or large square-mile value.'},
      {title: 'Multiply by exactly 640', description: 'Pure browser math outputs exact acres and hectares.'},
      {title: 'Copy acreage total', description: 'Read large-tract acreage cleanly.'},
    ],
    faqs: [
      {question: 'How many acres are in 1 square mile?', answer: 'Exactly 640 acres equal 1 statute square mile.'},
      {question: 'How many acres equal 0.5 square miles?', answer: '0.5 square miles equals exactly 320 acres (a half-section).'},
      {question: 'Need Acres back to Square Miles?', answer: 'Use Acres to Square Miles Converter under Unit Converters.'},
      {question: 'Is AI used?', answer: 'No—pure 640× multiplication only.'},
    ],
    relatedTools: [
      'acres-to-square-miles-converter',
      'hectares-to-acres-converter',
      'acreage-calculator',
      'unit-miles-to-km-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'square-yards-to-acres-converter',
    name: 'Square Yards to Acres Converter',
    slug: 'square-yards-to-acres-converter',
    category: 'unit-converters',
    url: '/square-yards-to-acres-converter',
    description:
      'Pure formula converter turning square yards (sq yd / gaj) into acres cleanly using sq yd ÷ 4,840.',
    longDescription:
      'Convert residential plot sizes measured in square yards (`sq yd` or standard `gaj`) into exact acres locally inside your browser using `acres = square yards ÷ 4,840`—pure formula math with zero AI.',
    keywords: ['square yards to acres', 'sq yd gaj to acres', 'divide by 4840', 'plot conversion'],
    icon: 'LandPlot',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Square Yards to Acres Converter | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Convert square yards (sq yd) to exact acres cleanly in your browser using exact division by 4,840.',
    howTo: [
      {title: 'Enter area in square yards (sq yd)', description: 'Once live, input plot area in square yards or standard gaj.'},
      {title: 'Divide cleanly by 4,840', description: 'Pure browser math computes exact decimal acres.'},
      {title: 'Inspect acres & square feet', description: 'View exact acres alongside sq ft (sq yd × 9).' },
    ],
    faqs: [
      {question: 'How many acres is 1,000 square yards?', answer: '1,000 sq yd ÷ 4,840 = ~0.2066 acres (9,000 sq ft).'},
      {question: 'Why divide square yards by 4,840?', answer: 'Because 1 acre contains exactly 4,840 square yards (43,560 sq ft ÷ 9).'},
      {question: 'Need Acres back to Square Yards?', answer: 'Use Acres to Square Yards Converter under Unit Converters.'},
      {question: 'Does this work for regional bigha or katha plots?', answer: 'Use Indian Land Unit Converter for state-wise bigha, katha, and regional plot units.'},
    ],
    relatedTools: [
      'acres-to-square-yards-converter',
      'square-feet-to-acres-converter',
      'indian-land-unit-converter',
      'acreage-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
