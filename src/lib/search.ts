import {CATEGORIES, TOOLS, type Tool, type ToolCategoryId} from '../data/tools';

export interface SearchResult {
  tool: Tool;
  score: number;
}

const SYNONYM_MAP: Record<string, string[]> = {
  lock: ['protect pdf', 'password', 'encrypt'],
  password: ['protect pdf', 'unlock pdf', 'encrypt', 'decrypt', 'password generator'],
  combine: ['merge pdf', 'join'],
  join: ['merge pdf', 'combine'],
  shrink: ['compress pdf', 'compress image', 'compress video'],
  smaller: ['compress pdf', 'compress image', 'compress video'],
  esign: ['sign pdf'],
  signature: ['sign pdf'],
  extract: ['split pdf', 'extract images from pdf'],
  orientation: ['rotate pdf'],
  turn: ['rotate pdf'],
  gif: ['video to gif', 'gif to pdf'],
  mov: ['video to mp4'],
  docx: ['word to pdf', 'pdf to word'],
  xlsx: [
    'pdf to excel',
    'excel to pdf',
    'csv to excel',
    'split excel',
    'xml to excel',
    'excel to csv',
    'excel to xml',
  ],
  spreadsheet: [
    'pdf to excel',
    'pdf to csv',
    'excel to pdf',
    'csv to excel',
    'split excel',
    'excel to csv',
  ],
  pptx: ['pdf to powerpoint'],
  slides: ['pdf to powerpoint'],
  ebook: ['pdf to epub'],
  kindle: ['pdf to epub'],
  trim: ['crop pdf'],
  margins: ['crop pdf'],
  delete: ['pdf page deleter'],
  reorder: ['rearrange pdf'],
  numbering: ['add numbers to pdf'],
  watermark: ['add watermark to pdf'],
  stamp: ['add watermark to pdf'],
  highlight: ['annotate pdf', 'pdf editor'],
  markup: ['annotate pdf', 'pdf editor'],
  iphone: ['heic to pdf'],
  heif: ['heic to pdf'],
  txt: ['pdf to text'],
  audio: ['video to audio', 'audio converter'],
  mp3: ['video to audio', 'audio converter'],
  soundtrack: ['video to audio'],
  avatar: ['profile photo maker'],
  pfp: ['profile photo maker'],
  headshot: ['profile photo maker'],
  circle: ['profile photo maker'],
  chart: ['chart maker'],
  graph: ['chart maker'],
  bar: ['chart maker', 'bar to psi converter', 'psi to bar converter', 'pressure converter'],
  pie: ['chart maker'],
  csv: [
    'pdf to csv',
    'csv to excel',
    'split csv',
    'excel to csv',
    'xml to csv',
    'csv to json',
    'csv to xml',
  ],
  json: ['json to xml', 'csv to json', 'xml to json', 'code beautifier'],
  xml: [
    'xml to excel',
    'json to xml',
    'xml to csv',
    'excel to xml',
    'xml to json',
    'csv to xml',
  ],
  yt: ['youtube'],
  thumb: ['youtube thumbnail', 'tiktok thumbnail maker'],
  iframe: ['youtube embed code generator'],
  ocr: ['youtube thumbnail text extractor', 'pinterest pin text extractor'],
  palette: ['youtube thumbnail color extractor', 'instagram color palette extractor', 'pinterest color palette extractor'],
  revenue: ['youtube earnings calculator', 'youtube rpm calculator', 'youtube cpm calculator', 'tiktok money calculator', 'tiktok earnings calculator'],
  money: ['youtube earnings calculator', 'tiktok money calculator', 'tiktok earnings calculator'],
  monetization: ['youtube watch hours calculator', 'youtube subscriber goal calculator', 'youtube earnings calculator', 'tiktok money calculator', 'tiktok earnings calculator'],
  shorts: ['youtube shorts idea generator', 'tiktok video idea generator'],
  bitrate: ['youtube video file size estimator', 'tiktok video file size estimator'],
  aspect: ['youtube video aspect ratio checker', 'tiktok video aspect ratio checker'],
  playlist: ['youtube playlist duration calculator'],
  chapters: ['youtube chapter generator'],
  timestamp: ['youtube timestamp link generator', 'youtube chapter generator'],
  handle: ['youtube handle format validator', 'youtube username generator', 'instagram username availability format checker', 'tiktok username format checker', 'pinterest username generator', 'reddit username checker', 'twitter username generator', 'snapchat username generator', 'snapchat username format checker', 'threads username generator'],
  ig: ['instagram'],
  insta: ['instagram'],
  fb: ['facebook'],
  tt: ['tiktok'],
  tiktok: ['tiktok tools'],
  pin: ['pinterest', 'pinterest pin'],
  pinterest: ['pinterest tools'],
  li: ['linkedin'],
  linkedin: ['linkedin tools'],
  inmail: ['linkedin inmail generator'],
  reddit: ['reddit tools'],
  subreddit: ['reddit subreddit description generator', 'reddit post generator'],
  karma: ['reddit karma calculator'],
  flair: ['reddit flair preview generator'],
  spoiler: ['reddit spoiler text generator'],
  markdown: ['reddit markdown formatter', 'reddit table generator'],
  ama: ['reddit ama question generator'],
  twitter: ['twitter tools'],
  tweet: ['twitter post generator', 'twitter character counter', 'twitter thread maker'],
  x: ['twitter'],
  snap: ['snapchat'],
  snapchat: ['snapchat tools'],
  snapstreak: ['snapchat streak calculator'],
  streak: ['snapchat streak calculator'],
  snapcode: ['snapchat snapcode generator'],
  bitmoji: ['snapchat bitmoji outfit idea generator'],
  spotlight: ['snapchat spotlight idea generator'],
  geofilter: ['snapchat geofilter size helper'],
  threads: ['threads tools'],
  fyp: ['tiktok'],
  viral: ['tiktok viral video idea generator'],
  collage: ['pinterest collage maker'],
  board: ['pinterest board description generator', 'pinterest board cover maker'],
  alt: ['instagram alt text', 'pinterest alt text generator'],
  'alt text': ['pinterest alt text generator'],
  'rich pin': ['pinterest rich pin preview generator'],
  mockup: ['instagram screenshot mockup generator', 'facebook post preview generator', 'pinterest pin mockup generator', 'twitter post generator', 'threads post preview generator'],
  reel: ['instagram reel', 'facebook reel'],
  reels: ['instagram reel', 'facebook reel'],
  story: ['instagram story', 'facebook story', 'tiktok video idea generator', 'snapchat story'],
  stories: ['instagram story', 'facebook story', 'snapchat story'],
  bio: ['instagram bio', 'facebook bio', 'facebook page bio', 'tiktok bio', 'tiktok profile bio', 'pinterest bio', 'linkedin headline', 'reddit bio', 'twitter bio', 'snapchat bio', 'threads bio'],
  caption: ['instagram caption', 'instagram reel caption', 'facebook post caption', 'facebook reel caption', 'tiktok caption', 'snapchat caption'],
  grid: ['instagram grid preview maker'],
  cover: ['facebook cover photo', 'instagram reel cover maker', 'facebook reel cover maker', 'tiktok video cover maker', 'pinterest board cover maker', 'linkedin banner', 'twitter header'],
  banner: ['linkedin banner maker', 'linkedin banner resizer', 'twitter header resizer'],
  header: ['twitter header resizer'],
  dp: ['facebook profile picture resizer', 'linkedin profile picture resizer', 'twitter profile picture resizer'],
  giveaway: ['instagram giveaway winner picker', 'facebook giveaway winner picker', 'tiktok giveaway winner picker', 'reddit comment picker'],
  raffle: ['instagram giveaway winner picker', 'facebook giveaway winner picker', 'tiktok giveaway winner picker', 'reddit comment picker'],
  contest: ['instagram giveaway winner picker', 'facebook giveaway winner picker', 'tiktok giveaway winner picker', 'reddit comment picker'],
  unicode: ['instagram font generator', 'instagram stylish text generator', 'facebook font generator', 'facebook stylish text generator', 'tiktok font generator', 'tiktok stylish text generator', 'pinterest font generator', 'pinterest stylish text generator', 'linkedin text formatter', 'twitter font generator', 'threads font generator'],
  linebreak: ['instagram line break generator', 'tiktok text formatter', 'linkedin line break generator', 'threads line break generator'],
  scheduler: ['facebook post scheduler planner'],
  ads: ['facebook ad headline generator', 'facebook ad copy generator'],
  cta: ['facebook cta generator', 'threads cta generator'],
  quote: ['twitter quote generator', 'threads quote generator', 'linkedin quote image generator'],
  poll: ['twitter poll question generator', 'threads poll generator', 'linkedin poll idea generator'],
  carousel: ['linkedin carousel maker', 'threads carousel text generator'],
  dm: ['instagram dm generator', 'facebook dm generator', 'tiktok dm generator', 'linkedin connection message generator', 'linkedin inmail generator'],
  character: ['linkedin post character counter', 'reddit post character counter', 'reddit title character counter', 'twitter character counter', 'twitter bio character counter', 'threads character counter', 'threads bio character counter'],
  '1584x396': ['linkedin banner maker', 'linkedin banner resizer'],
  '1200x627': ['linkedin post image resizer'],
  '400x400': ['linkedin profile picture resizer', 'twitter profile picture resizer'],
  '1500x500': ['twitter header resizer'],
  '1600x900': ['twitter post image resizer'],
  '1080x1920': ['snapchat story image resizer'],
  todo: ['smart to-do list', 'task board'],
  'to-do': ['smart to-do list', 'task board'],
  kanban: ['task board'],
  planner: ['daily planner'],
  sticky: ['sticky notes'],
  minutes: ['meeting notes', 'countdown timer'],
  countdown: ['countdown timer'],
  pomodoro: ['pomodoro timer'],
  habit: ['habit streak'],
  water: ['water tracker'],
  hydration: ['water tracker'],
  mood: ['mood tracker'],
  expense: ['expense reminder'],
  budget: ['expense reminder'],
  medicine: ['medicine reminder'],
  pill: ['medicine reminder'],
  dosage: ['medicine reminder'],
  productivity: ['productivity tools'],
  unit: ['unit converter', 'unit converters'],
  units: ['unit converter', 'unit converters'],
  cm: ['unit converter', 'cm to inches converter', 'inches to cm converter', 'cm to feet and inches converter', 'feet and inches to cm converter'],
  inches: ['unit converter', 'cm to inches converter', 'inches to cm converter', 'inches to mm converter', 'mm to inches converter', 'cm to feet and inches converter', 'feet and inches to cm converter'],
  kg: ['unit converter', 'kg to lbs converter', 'lbs to kg converter', 'weight converter'],
  pounds: ['unit converter', 'kg to lbs converter', 'lbs to kg converter', 'weight converter'],
  celsius: ['unit converter', 'celsius to fahrenheit converter', 'fahrenheit to celsius converter', 'temperature converter'],
  fahrenheit: ['unit converter', 'celsius to fahrenheit converter', 'fahrenheit to celsius converter', 'temperature converter'],
  tola: ['unit converter'],
  quintal: ['unit converter'],
  land: ['land area converter', 'indian land unit converter', 'acreage calculator'],
  area: ['land area converter', 'acreage calculator', 'indian land unit converter'],
  bigha: ['land area converter', 'indian land unit converter'],
  biswa: ['land area converter', 'indian land unit converter'],
  katha: ['land area converter', 'indian land unit converter'],
  gaj: ['land area converter', 'indian land unit converter', 'acres to square yards converter', 'square yards to acres converter'],
  marla: ['land area converter', 'indian land unit converter'],
  kanal: ['land area converter', 'indian land unit converter'],
  guntha: ['land area converter', 'indian land unit converter'],
  acre: ['land area converter', 'acreage calculator', 'acres to hectares converter', 'acres to square feet converter', 'acres to perches converter', 'hectares to acres converter', 'square feet to acres converter'],
  hectare: ['land area converter', 'acres to hectares converter', 'hectares to acres converter'],
  sqft: ['land area converter', 'acres to square feet converter', 'square feet to acres converter', 'square feet to square meters converter', 'square meters to square feet converter'],
  currency: ['currency converter'],
  exchange: ['currency converter'],
  forex: ['currency converter'],
  wav: ['audio converter'],
  flac: ['audio converter'],
  aac: ['audio converter'],
  ogg: ['audio converter'],
  mkv: ['video converter', 'video to mp4'],
  webm: ['video converter', 'video to mp4'],
  molarity: ['chemistry solutions calculator'],
  molality: ['chemistry solutions calculator'],
  normality: ['chemistry solutions calculator'],
  dilution: ['chemistry solutions calculator'],
  ph: ['chemistry solutions calculator'],
  physics: ['physics calculator'],
  ohms: ['physics calculator'],
  dna: ['dna/rna converter'],
  rna: ['dna/rna converter'],
  qr: ['qr code generator'],
  upi: ['qr code generator'],
  wifi: ['qr code generator'],
  barcode: ['barcode generator'],
  ean: ['barcode generator'],
  upc: ['barcode generator'],
  uuid: ['uuid generator'],
  guid: ['uuid generator'],
  slug: ['slug generator'],
  permalink: ['slug generator'],
  beautifier: ['code beautifier'],
  unminify: ['code beautifier'],
  color: ['color picker', 'instagram color palette extractor', 'pinterest color palette extractor'],
  hex: ['color picker'],
  rgb: ['color picker'],
  hsl: ['color picker'],
  tts: ['text to speech'],
  speech: ['text to speech', 'speech to text'],
  stt: ['speech to text'],
  dictation: ['speech to text'],
  base64: ['base64 encoder/decoder'],
  url: ['url encoder/decoder', 'slug generator'],
  receipt: ['receipt generator'],
  certificate: ['certificate generator'],
  letter: ['letter generator'],
  contract: ['contract generator'],
  nda: ['contract generator'],
  proposal: ['proposal generator'],
  quotation: ['quote generator'],
  bill: ['bill generator'],
  gstin: ['bill generator', 'gst calculator'],
  invoice: ['invoice generator'],
  gst: ['gst calculator'],
  cgst: ['gst calculator'],
  sgst: ['gst calculator'],
  tax: ['income tax calculator', 'gst calculator', 'salary calculator'],
  ctc: ['salary calculator'],
  salary: ['salary calculator'],
  discount: ['discount calculator'],
  emi: ['emi calculator'],
  loan: ['emi calculator'],
  sip: ['sip calculator'],
  fd: ['fd calculator'],
  scientific: ['advanced scientific calculator'],
  trigonometry: ['advanced scientific calculator'],
  ppm: ['percent to ppm converter', 'ppm to percent converter'],
  angle: ['angle converter'],
  radians: ['angle converter'],
  gradians: ['angle converter'],
  clothing: ['clothing size converter'],
  apparel: ['clothing size converter'],
  bandwidth: ['data transfer rate converter'],
  mbps: ['data transfer rate converter'],
  kbps: ['data transfer rate converter'],
  energy: ['energy converter'],
  joules: ['energy converter'],
  kcal: ['energy converter'],
  kwh: ['energy converter'],
  btu: ['energy converter'],
  storage: ['file size converter'],
  kb: ['file size converter'],
  mb: ['file size converter'],
  gb: ['file size converter'],
  gib: ['file size converter'],
  mib: ['file size converter'],
  mpg: ['fuel efficiency converter'],
  mileage: ['fuel efficiency converter'],
  glove: ['glove size calculator'],
  hat: ['hat size converter'],
  knots: ['knots to mph converter', 'speed converter'],
  lbs: ['kg to lbs converter', 'lbs to kg converter', 'weight converter'],
  length: ['length converter', 'scale model conversion calculator'],
  mph: ['mph to kmh converter', 'knots to mph converter', 'speed converter'],
  kmh: ['mph to kmh converter', 'speed converter'],
  horsepower: ['power converter'],
  pressure: ['pressure converter', 'bar to psi converter', 'kpa to psi converter', 'psi to bar converter', 'psi to kpa converter'],
  kpa: ['kpa to psi converter', 'psi to kpa converter', 'pressure converter'],
  psi: ['bar to psi converter', 'kpa to psi converter', 'psi to bar converter', 'psi to kpa converter', 'pressure converter'],
  ring: ['ring size converter'],
  scale: ['scale model conversion calculator'],
  shoe: ['shoe size converter'],
  footwear: ['shoe size converter'],
  speed: ['speed converter', 'mph to kmh converter', 'knots to mph converter'],
  kelvin: ['temperature converter'],
  rankine: ['temperature converter'],
  torque: ['torque converter'],
  frequency: ['ultimate frequency wavelength converter'],
  wavelength: ['ultimate frequency wavelength converter'],
  volume: ['volume converter'],
  litres: ['volume converter'],
  gallons: ['volume converter'],
  mass: ['weight converter'],
  feet: ['cm to feet and inches converter', 'feet and inches to cm converter', 'feet to meters converter', 'meters to feet converter'],
  meters: ['feet to meters converter', 'meters to feet converter'],
  mm: ['inches to mm converter', 'mm to inches converter'],
  miles: ['km to miles converter', 'miles to km converter'],
  km: ['km to miles converter', 'miles to km converter'],
  au: ['astronomical unit converter'],
  parsec: ['astronomical unit converter'],
  lightyear: ['astronomical unit converter'],
  bcd: ['bcd converter'],
  gray: ['binary to gray code converter'],
  oui: ['mac address lookup'],
  mac: ['mac address lookup', 'mac address generator'],
  trademark: ['trademark class finder'],
  nice: ['trademark class finder'],
  django: ['django secret key generator'],
  secret_key: ['django secret key generator'],
  wordpress: ['wordpress secret key generator'],
  salts: ['wordpress secret key generator'],
  acreage: ['acreage calculator', 'land area converter', 'acres to square feet converter'],
  indian: ['indian land unit converter', 'land area converter'],
  perch: ['acres to perches converter', 'perches to acres converter'],
  perches: ['acres to perches converter', 'perches to acres converter'],
  acres: ['acreage calculator', 'acres to hectares converter', 'acres to perches converter', 'acres to square feet converter', 'acres to square meters converter', 'acres to square miles converter', 'acres to square yards converter', 'hectares to acres converter', 'perches to acres converter', 'square feet to acres converter', 'square meters to acres converter', 'square miles to acres converter', 'square yards to acres converter'],
  hectares: ['acres to hectares converter', 'hectares to acres converter'],
  sqm: ['acres to square meters converter', 'square meters to acres converter', 'square feet to square meters converter', 'square meters to square feet converter'],
  sq: ['acres to square feet converter', 'square feet to acres converter', 'square feet to square meters converter', 'square meters to square feet converter', 'square yards to acres converter', 'square miles to acres converter'],
};

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    const mapped = SYNONYM_MAP[token];
    if (mapped) {
      for (const phrase of mapped) {
        expanded.add(phrase);
      }
    }
  }
  return Array.from(expanded);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function scoreToolMatch(tool: Tool, rawQuery: string): number {
  const query = normalize(rawQuery);
  if (!query) return 0;

  const name = tool.name.toLowerCase();
  const slug = tool.slug.toLowerCase();
  const keywords = tool.keywords.map((k) => k.toLowerCase());
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const categoryName = category ? category.name.toLowerCase() : '';
  const description = tool.description.toLowerCase();
  const longDescription = tool.longDescription.toLowerCase();
  const formats = tool.acceptedFormats.map((f) => f.toLowerCase());

  let score = 0;

  const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(query)}`);

  // 1. Name match (highest priority for word-aligned matches)
  if (name === query) {
    score += 1000;
  } else if (name.startsWith(query)) {
    score += 750;
  } else if (wordBoundaryRegex.test(name)) {
    score += 640;
  } else if (name.split(' ').some((word) => word.startsWith(query))) {
    score += 600;
  } else if (name.includes(query)) {
    score += 180;
  } else if (slug.includes(query.replace(/\s+/g, '-'))) {
    score += 160;
  }

  // 2. Keywords & synonyms match
  for (const kw of keywords) {
    if (kw === query) {
      score += 520;
    } else if (kw.startsWith(query)) {
      score += 360;
    } else if (new RegExp(`\\b${escapeRegex(query)}`).test(kw)) {
      score += 320;
    } else if (kw.includes(query)) {
      score += 140;
    }
  }

  // Token & synonym expansion
  const tokens = query.split(' ').filter(Boolean);
  const expanded = expandTokens(tokens);

  if (tokens.length > 1) {
    const searchableTexts = [
      name,
      slug.replace(/-/g, ' '),
      categoryName,
      description,
      ...keywords,
      ...formats,
    ];
    const tokenSatisfied = (token: string): boolean => {
      const startsWithWord = /^\w/.test(token);
      if (!startsWithWord) {
        if (searchableTexts.some((txt) => txt.includes(token))) {
          return true;
        }
        const stripped = token.replace(/^[^\w]+|[^\w]+$/g, '');
        if (!stripped) return true;
        const strippedRegex = new RegExp(`\\b${escapeRegex(stripped)}`);
        return searchableTexts.some((txt) => strippedRegex.test(txt));
      }
      const tokenRegex = new RegExp(`\\b${escapeRegex(token)}`);
      if (searchableTexts.some((txt) => tokenRegex.test(txt))) {
        return true;
      }
      const synonyms = SYNONYM_MAP[token] ?? [];
      return synonyms.some((syn) => {
        const synRegex = new RegExp(`\\b${escapeRegex(syn)}`);
        return (
          synRegex.test(name) || keywords.some((kw) => synRegex.test(kw))
        );
      });
    };

    if (name !== query && !tokens.every(tokenSatisfied)) {
      return 0;
    }
  }

  if (tokens.length > 0) {
    const allTokensInName = tokens.every((t) =>
      new RegExp(`\\b${escapeRegex(t)}`).test(name),
    );
    if (allTokensInName && score < 500) {
      score += 480;
    }

    const allTokensInKeywords = tokens.every((t) =>
      keywords.some((kw) => new RegExp(`\\b${escapeRegex(t)}`).test(kw)),
    );
    if (allTokensInKeywords) {
      score += 260;
    }

    for (const phrase of expanded) {
      const phraseRegex = new RegExp(`\\b${escapeRegex(phrase)}`);
      if (phraseRegex.test(name)) {
        score += 210;
      }
      if (keywords.some((kw) => phraseRegex.test(kw))) {
        score += 170;
      }
    }
  }

  // 3. Category & accepted formats match
  if (categoryName.includes(query) || tool.category.includes(query)) {
    score += 140;
  }
  if (formats.some((fmt) => fmt === query || fmt.includes(query))) {
    score += 120;
  }

  // 4. Description match
  if (description.includes(query)) {
    score += 90;
  } else if (tokens.length > 0 && tokens.every((t) => description.includes(t))) {
    score += 65;
  } else if (longDescription.includes(query)) {
    score += 40;
  }

  if (score > 0 && tool.popular) {
    score += 5;
  }

  return score;
}

export function searchTools(
  rawQuery: string,
  options?: {category?: ToolCategoryId | 'all'; limit?: number},
): Tool[] {
  const query = normalize(rawQuery);
  const categoryFilter = options?.category ?? 'all';

  let pool =
    categoryFilter === 'all'
      ? [...TOOLS]
      : TOOLS.filter((t) => t.category === categoryFilter);

  if (!query) {
    return options?.limit ? pool.slice(0, options.limit) : pool;
  }

  const scored: SearchResult[] = pool
    .map((tool) => ({
      tool,
      score: scoreToolMatch(tool, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tool.name.localeCompare(b.tool.name);
    });

  const results = scored.map((item) => item.tool);
  return options?.limit ? results.slice(0, options.limit) : results;
}
