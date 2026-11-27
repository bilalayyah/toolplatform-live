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
  {
    id: 'heat-index-calculator',
    name: 'Heat Index Calculator',
    slug: 'heat-index-calculator',
    category: 'science-tools',
    url: '/heat-index-calculator',
    description:
      'Calculate the heat index using air temperature and humidity. Find out how hot it feels with our free Fahrenheit and Celsius heat index calculator.',
    longDescription:
      'What the Heat Index Measures: The heat index estimates what hot air feels like to a resting human body in the shade when air temperature and relative humidity act together. Normally, perspiration cools skin as sweat evaporates into the surrounding air. When atmospheric moisture climbs, evaporation slows down, trapping heat close to the skin and making an ordinary summer afternoon feel markedly hotter than a dry thermometer reading alone indicates. How to Calculate Feels-Like Temperature: Using this heat index calculator online takes seconds and runs strictly in your browser with zero external requests or AI guesswork. Enter your air temperature, select Fahrenheit or Celsius, type a relative humidity percentage from 0 to 100, and press Calculate Heat Index or hit Enter. The workspace instantly displays actual temperature alongside apparent temperature in both °F and °C, the exact degree difference between air temperature and perceived warmth, the active risk band, and the specific formula branch used. You can also compare two temperature-and-humidity pairs side by side, browse the live formula-generated reference table, copy a formatted summary, print the result card, or click a recent calculation in your session history to reload it. Understanding the NWS Rothfusz Formula: Our calculation engine follows the standardized two-step National Weather Service (NWS) methodology without rounding intermediate values. First, it evaluates the preliminary simple approximation HI_simple = 0.5 × (T + 61.0 + ((T − 68.0) × 1.2) + (RH × 0.094)) and averages that number with the dry-bulb air temperature T in Fahrenheit. Whenever that average sits below 80°F (26.7°C), the tool reports that simpler averaged result. At 80°F and above, it switches to the nine-term Rothfusz multiple regression equation and applies two conditional boundary adjustments: when relative humidity drops below 13% between 80°F and 112°F, it subtracts ((13 − RH) / 4) × sqrt((17 − |T − 95|) / 17); when relative humidity rises above 85% between 80°F and 87°F, it adds ((RH − 85) / 10) × ((87 − T) / 5). Why Humidity Amplifies Apparent Heat: Humid air already carries a high fraction of the water vapor it can hold at a given temperature, leaving less capacity for sweat evaporation. Look at two conditions at an identical 90°F air temperature: at 40% relative humidity, apparent temperature calculates to 90.7°F, barely above air temperature, whereas raising humidity to 70% pushes the heat index to 105.9°F—a 15.2°F jump in thermal strain without any change on a standard wall thermometer. Fahrenheit and Celsius Consistency: Every Celsius calculation converts your input directly to Fahrenheit using °F = (°C × 9/5) + 32, evaluates the exact NWS Rothfusz model on that Fahrenheit temperature, and converts the result back via °C = (°F − 32) × 5/9. Converting thresholds through the identical scale avoids conflicting boundary behavior between °F and °C modes. Risk Classification Tiers: Calculated values map to four general guidance bands: Caution from 80°F to under 90°F (26.7°C to under 32.2°C), where fatigue may develop during prolonged activity; Extreme Caution from 90°F to under 103°F (32.2°C to under 39.4°C), where heat cramps and heat exhaustion become greater risks; Danger from 103°F to under 125°F (39.4°C to under 51.7°C), where serious heat illness becomes likely with sustained exertion; and Extreme Danger at 125°F (51.7°C) and above, indicating severe heat stroke risk requiring cool shelter and urgent medical care if symptoms occur. Values under 80°F sit below Caution. Practical Worked Examples: Entering 95°F at 60% humidity yields 113.1°F (Danger, +18.1°F hotter than air temperature); 88°F at 45% humidity gives 89.4°F (Caution); 102°F at 70% humidity reaches 151.8°F (Extreme Danger); 30°C at 65% humidity produces 93.0°F or 33.9°C (Extreme Caution); and 27°C at 40% humidity evaluates to 80.4°F or 26.9°C (Caution). In the built-in Reference Chart, picking any temperature and humidity displays the live engine output—matching every cell directly to the underlying equation. Heat Index vs. Actual Temperature & Honest Limits: Unlike air temperature measured inside a shaded thermometer shelter, apparent temperature blends moisture stress into an equivalent heat load, though in cool dry conditions the simple averaged approximation can actually sit slightly lower than air temperature. Standard heat-index calculations assume shaded conditions with light wind and do not reflect direct solar radiation, strong breezes, protective gear, exertion level, or personal health factors. Heat index is distinct from Wet Bulb Globe Temperature (WBGT), which accounts for sunlight and wind directly, and because this page only processes manually typed numbers rather than live station feeds, always check official weather authorities for active local advisories and safety decisions.',
    keywords: [
      'heat index calculator',
      'heat index calculator online',
      'calculate heat index',
      'heat index calculator Fahrenheit',
      'heat index calculator Celsius',
      'feels like temperature calculator',
      'apparent temperature calculator',
      'temperature and humidity calculator',
      'heat index temperature calculator',
      'heat index formula calculator',
      'humidity heat calculator',
    ],
    icon: 'Thermometer',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Heat Index Calculator – Calculate Feels Like Temperature | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate the heat index using air temperature and humidity. Find out how hot it feels with our free Fahrenheit and Celsius heat index calculator.',
    howTo: [
      {
        title: 'Enter air temperature and relative humidity',
        description:
          'Type an outdoor or indoor air temperature, toggle between Fahrenheit and Celsius, and enter a relative humidity percentage from 0 to 100.',
      },
      {
        title: 'Inspect the heat index and risk band',
        description:
          'Click Calculate Heat Index or press Enter to view apparent temperature in both °F and °C, the temperature difference from actual air temp, and the matching risk classification.',
      },
      {
        title: 'Compare conditions, check the chart, or reuse history',
        description:
          'Run side-by-side Condition A vs. Condition B comparisons, look up values in the dynamically computed reference chart, copy or print the result, or reload any recent entry from session history.',
      },
    ],
    faqs: [
      {
        question: 'What is a heat index calculator?',
        answer:
          'A heat index calculator is a browser-based utility that combines air temperature and relative humidity to estimate how warm conditions feel to the human body in shade with light wind. Rather than relying on a single thermometer value alone, it accounts for how atmospheric moisture slows sweat evaporation and raises apparent thermal load.',
      },
      {
        question: 'How do I calculate the heat index?',
        answer:
          'Select Fahrenheit or Celsius, enter the air temperature and a relative humidity percentage between 0 and 100, and press Calculate Heat Index or hit Enter. The tool executes the official two-stage NWS calculation locally in your browser and outputs the feels-like temperature in both units along with the risk category.',
      },
      {
        question: 'What is the heat index formula?',
        answer:
          'The calculation first tests a preliminary equation averaged with air temperature: 0.5 × (T + 61.0 + ((T − 68.0) × 1.2) + (RH × 0.094)). Whenever that averaged value is 80°F or higher, it evaluates the nine-term Rothfusz regression polynomial using temperature T in Fahrenheit and relative humidity RH in percent, plus conditional low- or high-humidity correction terms.',
      },
      {
        question: 'What is the difference between temperature and heat index?',
        answer:
          'Air temperature reflects the kinetic energy of dry air measured by a shaded thermometer. Heat index represents apparent temperature—what that air feels like when humidity restricts sweat evaporation. For example, 95°F air at 60% relative humidity registers 95.0°F on a thermometer yet produces an apparent heat index of 113.1°F.',
      },
      {
        question: 'How does humidity affect the heat index?',
        answer:
          'Higher relative humidity makes warm weather feel hotter because moisture-laden air cannot absorb evaporated perspiration quickly, reducing the body’s primary cooling mechanism. At 90°F, shifting humidity from 40% to 70% raises the heat index from 90.7°F to 105.9°F—an increase of 15.2°F even though air temperature stays identical.',
      },
      {
        question: 'What is the heat index at 90°F and 50% humidity?',
        answer:
          'At an air temperature of 90°F and 50% relative humidity, the Rothfusz equation computes a heat index of 94.6°F (approximately 95°F, or 34.8°C). That places conditions in the Extreme Caution band, meaning prolonged outdoor exertion increases the risk of fatigue, cramps, and heat exhaustion.',
      },
      {
        question: 'Can I calculate heat index in Celsius?',
        answer:
          'Yes. Switch the unit selector to Celsius and enter your temperature in °C. To avoid drift or inconsistent boundary behavior, the engine converts your Celsius reading cleanly to Fahrenheit, runs the exact Rothfusz method, and converts the resulting heat index back into Celsius—for instance, 30°C at 65% RH outputs 33.9°C (93.0°F).',
      },
      {
        question: 'Can I calculate heat index in Fahrenheit?',
        answer:
          'Yes. Fahrenheit is selected by default and evaluates directly against the NWS Rothfusz coefficients and adjustment ranges, displaying output values to one decimal place in both °F and °C simultaneously so you never need a second conversion step.',
      },
      {
        question: 'What is considered a dangerous heat index?',
        answer:
          'Under standard NWS guidance bands, Danger begins at a heat index of 103°F (39.4°C) and runs up to 125°F (51.7°C), where heat cramps and exhaustion become likely and heat stroke risk climbs during prolonged activity. Values of 125°F (51.7°C) or higher fall into Extreme Danger, where severe heat illness is highly likely.',
      },
      {
        question: 'What does extreme caution mean?',
        answer:
          'Extreme Caution covers apparent temperatures from 90°F up to 103°F (32.2°C up to 39.4°C). In this tier, heat cramps, sunstroke, and heat exhaustion become noticeably more likely during extended outdoor stays or physical labor, warranting regular shade, hydration, and slower pacing.',
      },
      {
        question: 'What is the Rothfusz regression?',
        answer:
          'Developed in 1990 by Lans P. Rothfusz at the National Weather Service, the Rothfusz regression is a nine-term multiple linear regression fit over Robert Steadman’s foundational apparent-temperature tables. It turns Steadman’s physiological comfort calculations into a compact algebraic equation that accepts temperature and relative humidity directly.',
      },
      {
        question: 'Is heat index the same as feels like temperature?',
        answer:
          'In warm weather without wind chill considerations, weather reports commonly use heat index as the basis for “feels like” temperature. However, some forecast services modify their “feels like” display for wind speed or sunshine, whereas the classic heat index strictly evaluates shaded air temperature and relative humidity with light wind.',
      },
      {
        question: 'Does direct sunlight affect heat index?',
        answer:
          'Standard heat-index equations assume shaded measurement conditions and a light breeze, so they do not include solar radiation heating your skin and clothing. Exposure to direct midday sun can add meaningful thermal load beyond the shaded heat index figure, increasing physical strain during outdoor work.',
      },
      {
        question: 'Is heat index the same as WBGT?',
        answer:
          'No. Heat index is not the same as Wet Bulb Globe Temperature (WBGT). Heat index uses only shaded air temperature and relative humidity, whereas WBGT combines natural wet-bulb temperature, black-globe solar radiation temperature, and ambient air temperature alongside wind exposure to assess heat stress in full sun.',
      },
      {
        question: 'Can heat index be lower than actual temperature?',
        answer:
          'Yes, in cooler or dry scenarios. When the preliminary simple approximation runs below the 80°F Rothfusz threshold and gets averaged with air temperature, the resulting figure can sit slightly lower than the dry thermometer reading—such as 77°F air at 50% humidity yielding 76.9°F—or when very dry heat promotes rapid evaporative cooling.',
      },
      {
        question: 'Is this heat index calculator free?',
        answer:
          'Yes. You can calculate single values, run Condition A vs. Condition B comparisons, check the full dynamic chart, and copy or print results completely free inside your browser with no account, paywall, or usage limits.',
      },
      {
        question: 'How accurate is the heat index formula?',
        answer:
          'The Rothfusz regression closely reproduces Steadman’s physiological shade-and-light-wind model within its intended warm-weather range, typically within roughly one to two degrees Fahrenheit when humidity adjustments are applied. Outside shaded, lightly breezy assumptions—such as strong winds, intense sun, heavy gear, or extreme temperatures above 110°F—real human comfort diverges noticeably.',
      },
      {
        question: 'Does this calculator provide live weather information?',
        answer:
          'No. This is a manual deterministic calculator that computes results strictly from the temperature and humidity numbers you enter—it does not fetch live weather feeds, station observations, or forecasts. Always consult official local weather authorities for active alerts and safety guidance.',
      },
    ],
    relatedTools: [
      'unit-unit-converter',
      'science-chemistry-solutions-calculator',
      'science-physics-calculator',
      'science-dna-rna-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
