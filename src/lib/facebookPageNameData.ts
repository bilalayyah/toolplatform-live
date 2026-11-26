export type Tone = 'neutral' | 'professional' | 'fun' | 'bold' | 'friendly' | 'premium';

export type NamingStyle =
  | 'mixAll'
  | 'brandWord'
  | 'prefixBrand'
  | 'brandPlace'
  | 'alliteration'
  | 'joined'
  | 'community';

export type CategoryName =
  | 'General'
  | 'Gaming'
  | 'Food'
  | 'Business'
  | 'Fashion & Beauty'
  | 'Fitness & Health'
  | 'Education'
  | 'Travel'
  | 'Technology'
  | 'Music & Fun'
  | 'Real Estate'
  | 'Photo & Art'
  | 'News & Media'
  | 'Sports'
  | 'Online Store'
  | 'Motivation';

export interface ToneOption {
  id: Tone;
  label: string;
  prefixes: readonly string[];
  adjectives: readonly string[];
}

export const TONE_OPTIONS: readonly ToneOption[] = [
  {
    id: 'neutral',
    label: 'Neutral',
    prefixes: ['The', 'Team', 'Real', 'Pro'],
    adjectives: ['Prime', 'Smart', 'Pure', 'Bright', 'Grand', 'Top'],
  },
  {
    id: 'professional',
    label: 'Professional',
    prefixes: ['The', 'Pro', 'Prime', 'First'],
    adjectives: ['Elite', 'Premier', 'Trusted', 'Smart', 'Pure', 'Prime'],
  },
  {
    id: 'fun',
    label: 'Fun',
    prefixes: ['Team', 'Happy', 'Super', 'Mega'],
    adjectives: ['Lucky', 'Epic', 'Happy', 'Wild', 'Funky', 'Crazy'],
  },
  {
    id: 'bold',
    label: 'Bold',
    prefixes: ['Alpha', 'Ultra', 'Mega', 'Rebel'],
    adjectives: ['Fierce', 'Bold', 'Titan', 'Rogue', 'Apex', 'Iron'],
  },
  {
    id: 'friendly',
    label: 'Friendly',
    prefixes: ['Our', 'Team', 'Pure', 'Daily'],
    adjectives: ['Cozy', 'Warm', 'Friendly', 'United', 'Open', 'Bright'],
  },
  {
    id: 'premium',
    label: 'Premium',
    prefixes: ['The', 'Royal', 'Grand', 'Luxe'],
    adjectives: ['Royal', 'Golden', 'Luxe', 'Signature', 'Grand', 'Crown'],
  },
] as const;

export const TONES_MAP: Record<Tone, {P: readonly string[]; A: readonly string[]}> = {
  neutral: {
    P: ['The', 'Team', 'Real', 'Pro'],
    A: ['Prime', 'Smart', 'Pure', 'Bright', 'Grand', 'Top'],
  },
  professional: {
    P: ['The', 'Pro', 'Prime', 'First'],
    A: ['Elite', 'Premier', 'Trusted', 'Smart', 'Pure', 'Prime'],
  },
  fun: {
    P: ['Team', 'Happy', 'Super', 'Mega'],
    A: ['Lucky', 'Epic', 'Happy', 'Wild', 'Funky', 'Crazy'],
  },
  bold: {
    P: ['Alpha', 'Ultra', 'Mega', 'Rebel'],
    A: ['Fierce', 'Bold', 'Titan', 'Rogue', 'Apex', 'Iron'],
  },
  friendly: {
    P: ['Our', 'Team', 'Pure', 'Daily'],
    A: ['Cozy', 'Warm', 'Friendly', 'United', 'Open', 'Bright'],
  },
  premium: {
    P: ['The', 'Royal', 'Grand', 'Luxe'],
    A: ['Royal', 'Golden', 'Luxe', 'Signature', 'Grand', 'Crown'],
  },
};

export const NAMING_STYLES: readonly {id: NamingStyle; label: string}[] = [
  {id: 'mixAll', label: 'Mix all'},
  {id: 'brandWord', label: 'Brand + Word'},
  {id: 'prefixBrand', label: 'Prefix + Brand'},
  {id: 'brandPlace', label: 'Brand + Place'},
  {id: 'alliteration', label: 'Alliteration'},
  {id: 'joined', label: 'Joined word'},
  {id: 'community', label: 'Community / Fans'},
] as const;

export const GENERIC_SUFFIXES: readonly string[] = [
  'Hub',
  'Zone',
  'Club',
  'World',
  'Point',
  'Space',
  'Nation',
  'Network',
  'Corner',
  'Spot',
] as const;

export const COMMUNITY_WORDS: readonly string[] = [
  'Fans',
  'Community',
  'Lovers',
  'Family',
  'Friends',
  'Followers',
] as const;

export const JOINERS: readonly string[] = [
  'Hub',
  'Zone',
  'Verse',
  'Nation',
  'Ville',
  'Base',
  'Lab',
  'Box',
  'Nest',
  'Spot',
  'Hive',
  'Land',
] as const;

export interface CategorySuffixEntry {
  suffixes: readonly string[];
  extraCommunity: readonly string[];
}

export const CATEGORIES: readonly CategoryName[] = [
  'General',
  'Gaming',
  'Food',
  'Business',
  'Fashion & Beauty',
  'Fitness & Health',
  'Education',
  'Travel',
  'Technology',
  'Music & Fun',
  'Real Estate',
  'Photo & Art',
  'News & Media',
  'Sports',
  'Online Store',
  'Motivation',
] as const;

export const CATEGORY_SUFFIXES: Record<CategoryName, CategorySuffixEntry> = {
  General: {
    suffixes: [
      'Hub',
      'Zone',
      'Club',
      'Community',
      'World',
      'Point',
      'Place',
      'Corner',
      'Spot',
      'Network',
      'Nation',
      'Space',
    ],
    extraCommunity: [],
  },
  Gaming: {
    suffixes: [
      'Hub',
      'Arena',
      'Squad',
      'Zone',
      'Club',
      'Gamers',
      'Clan',
      'Legends',
      'League',
      'Players',
      'Nation',
      'Lounge',
    ],
    extraCommunity: ['Players', 'Gamers'],
  },
  Food: {
    suffixes: [
      'Kitchen',
      'Bites',
      'Corner',
      'Eats',
      'Table',
      'Bistro',
      'Cafe',
      'Flavors',
      'Grill',
      'Spoon',
      'Treats',
      'House',
    ],
    extraCommunity: [],
  },
  Business: {
    suffixes: [
      'Solutions',
      'Group',
      'Studio',
      'Ventures',
      'Partners',
      'Agency',
      'Works',
      'Labs',
      'Consulting',
      'Services',
      'Collective',
      'Network',
    ],
    extraCommunity: [],
  },
  'Fashion & Beauty': {
    suffixes: [
      'Boutique',
      'Style',
      'Closet',
      'Couture',
      'Trends',
      'Studio',
      'Glam',
      'Wardrobe',
      'Beauty',
      'Atelier',
      'Looks',
      'Collection',
    ],
    extraCommunity: [],
  },
  'Fitness & Health': {
    suffixes: [
      'Fitness',
      'Gym',
      'Training',
      'Wellness',
      'Coach',
      'Club',
      'Strong',
      'Active',
      'Life',
      'Studio',
      'Nation',
      'Zone',
    ],
    extraCommunity: [],
  },
  Education: {
    suffixes: [
      'Academy',
      'Institute',
      'Learning',
      'School',
      'Classes',
      'Tutors',
      'Campus',
      'Hub',
      'Lab',
      'Mentor',
      'Skills',
      'Guide',
    ],
    extraCommunity: [],
  },
  Travel: {
    suffixes: [
      'Travels',
      'Tours',
      'Journeys',
      'Escapes',
      'Voyages',
      'Adventures',
      'Trails',
      'Explorers',
      'Getaways',
      'Guide',
      'Diaries',
      'Routes',
    ],
    extraCommunity: [],
  },
  Technology: {
    suffixes: [
      'Tech',
      'Labs',
      'Digital',
      'Systems',
      'Soft',
      'Cloud',
      'Hub',
      'Works',
      'Bytes',
      'Code',
      'Dev',
      'Solutions',
    ],
    extraCommunity: [],
  },
  'Music & Fun': {
    suffixes: [
      'Beats',
      'Records',
      'Studio',
      'Sounds',
      'Live',
      'Vibes',
      'Tunes',
      'Radio',
      'Stage',
      'Club',
      'Nation',
      'Entertainment',
    ],
    extraCommunity: [],
  },
  'Real Estate': {
    suffixes: [
      'Properties',
      'Realty',
      'Estates',
      'Homes',
      'Land',
      'Builders',
      'Group',
      'Investments',
      'Living',
      'Developers',
      'Listings',
      'Associates',
    ],
    extraCommunity: [],
  },
  'Photo & Art': {
    suffixes: [
      'Studio',
      'Gallery',
      'Frames',
      'Photography',
      'Lens',
      'Creations',
      'Arts',
      'Canvas',
      'Visuals',
      'Captures',
      'Works',
      'Collective',
    ],
    extraCommunity: [],
  },
  'News & Media': {
    suffixes: [
      'Daily',
      'Times',
      'News',
      'Post',
      'Media',
      'Today',
      'Update',
      'Herald',
      'Report',
      'Journal',
      'Network',
      'Live',
    ],
    extraCommunity: [],
  },
  Sports: {
    suffixes: [
      'Sports',
      'FC',
      'Club',
      'League',
      'Zone',
      'Arena',
      'Academy',
      'United',
      'Team',
      'Nation',
      'Squad',
      'Fans',
    ],
    extraCommunity: ['Supporters'],
  },
  'Online Store': {
    suffixes: [
      'Store',
      'Shop',
      'Mart',
      'Outlet',
      'Bazaar',
      'Deals',
      'Hub',
      'Collection',
      'Express',
      'Online',
      'Market',
      'Point',
    ],
    extraCommunity: [],
  },
  Motivation: {
    suffixes: [
      'Vibes',
      'Life',
      'Mindset',
      'Daily',
      'Quotes',
      'Inspire',
      'Journey',
      'Stories',
      'Thoughts',
      'Wisdom',
      'Moments',
      'Hub',
    ],
    extraCommunity: [],
  },
};

export const GENERIC_KEYWORDS = new Set<string>([
  'pizza',
  'food',
  'shop',
  'store',
  'news',
  'music',
  'travel',
  'fashion',
  'fitness',
  'gym',
  'games',
  'gaming',
  'cars',
  'car',
  'books',
  'beauty',
  'salon',
  'coffee',
  'cafe',
  'restaurant',
  'hotel',
  'school',
  'college',
  'business',
  'marketing',
  'jobs',
  'sports',
  'football',
  'cricket',
  'photos',
  'videos',
  'memes',
  'quotes',
  'love',
  'life',
  'health',
  'tech',
  'mobile',
  'phones',
  'property',
  'properties',
  'clothes',
  'shoes',
]);

export const KNOWN_CITIES = new Set<string>([
  'dubai',
  'abu dhabi',
  'riyadh',
  'jeddah',
  'doha',
  'cairo',
  'karachi',
  'lahore',
  'islamabad',
  'delhi',
  'new delhi',
  'mumbai',
  'bangalore',
  'bengaluru',
  'chennai',
  'hyderabad',
  'kolkata',
  'pune',
  'london',
  'manchester',
  'birmingham',
  'paris',
  'berlin',
  'munich',
  'madrid',
  'barcelona',
  'rome',
  'milan',
  'amsterdam',
  'istanbul',
  'new york',
  'los angeles',
  'chicago',
  'houston',
  'miami',
  'austin',
  'seattle',
  'boston',
  'toronto',
  'vancouver',
  'montreal',
  'sydney',
  'melbourne',
  'singapore',
  'tokyo',
  'seoul',
  'bangkok',
  'jakarta',
  'manila',
  'kuala lumpur',
  'nairobi',
  'lagos',
]);

export const BLOCKED_WORDS = new Set<string>(['facebook', 'fb', 'official']);

export const TRADEMARKED_BRANDS = new Set<string>([
  'nike', 'adidas', 'puma', 'reebok', 'converse', 'vans', 'lululemon', 'under armour', 'new balance',
  'gucci', 'prada', 'chanel', 'zara', 'rolex', 'versace', 'balenciaga', 'dior', 'hermes', 'louis vuitton',
  'apple', 'iphone', 'ipad', 'macbook', 'samsung', 'google', 'youtube', 'instagram', 'whatsapp',
  'messenger', 'meta', 'tiktok', 'twitter', 'snapchat', 'linkedin', 'pinterest', 'reddit',
  'microsoft', 'windows', 'xbox', 'playstation', 'sony', 'nintendo', 'nvidia', 'intel', 'amd',
  'amazon', 'netflix', 'spotify', 'tesla', 'openai', 'chatgpt', 'uber', 'airbnb',
  'starbucks', 'mcdonalds', 'kfc', 'burger king', 'coca cola', 'pepsi', 'red bull', 'nutella',
  'disney', 'marvel', 'pixar', 'bmw', 'mercedes', 'ferrari', 'lamborghini', 'toyota', 'honda', 'ford', 'porsche',
  'visa', 'mastercard', 'paypal', 'stripe', 'lego',
]);

export const SMALL_TITLE_WORDS = new Set<string>(['and', 'of', 'the', 'for', 'in']);

export const END_STOP_WORDS = new Set<string>(['the', 'of', 'and', 'for', 'in', 'at']);

export const FAN_SAFE_WORDS = new Set<string>([
  'fans',
  'community',
  'lovers',
  'family',
  'friends',
  'followers',
  'players',
  'gamers',
]);

export const PAGE_NAME_TIPS: readonly string[] = [
  'Keep it to 2 to 4 words',
  'Make it easy to spell and say aloud',
  'Put the brand word first',
  'Avoid emojis, symbols and ALL CAPS',
  'Do not use a generic word or a city alone',
  'Use the same name on your other platforms',
] as const;

export const PAGE_NAME_FAQS: readonly {question: string; answer: string}[] = [
  {
    question: 'Is this tool AI-powered?',
    answer:
      'No. It combines your keyword with fixed word lists and patterns and ranks the results with simple rules, so the same inputs give the same first results.',
  },
  {
    question: 'How long should a Page name be?',
    answer:
      'Short and clear, usually 2 to 4 words. This tool keeps names within 40 characters so they stay readable on mobile. Facebook makes the final decision when it reviews a name.',
  },
  {
    question: 'Can I use emojis or special characters?',
    answer:
      "No. Facebook's guidelines discourage special characters, unnecessary symbols, emojis, excessive capital letters and excessive punctuation, so the tool outputs clean text.",
  },
  {
    question: 'Can I add Official or Facebook to the name?',
    answer:
      'No. Facebook does not allow variations of Facebook or Official in Page names, so the tool blocks them.',
  },
  {
    question: 'Does the tool check if a name is available?',
    answer:
      "No tool can promise that without Facebook's own systems. Use the Check on Facebook button on each name to search in a new tab.",
  },
  {
    question: 'Can I change the name later?',
    answer:
      'Usually yes, but Facebook limits how often a name can change and reviews each request without a guaranteed time frame.',
  },
  {
    question: "My keyword is another company's brand. Is that allowed?",
    answer:
      'Facebook does not allow names that mislead people into thinking an unofficial Page is connected to a brand, and trademarked terms need permission. Words such as Fans or Community make a fan Page clear. This is general information, not legal advice.',
  },
] as const;
