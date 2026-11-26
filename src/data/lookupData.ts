export interface OuiLookupResult {
  query: string;
  normalizedPrefix: string | null;
  vendor: string | null;
  isLocallyAdministered: boolean | null;
  isMulticast: boolean | null;
  matches: Array<{ prefix: string; vendor: string }>;
}

// Bundled public IEEE OUI prefix table (first 6 hex chars -> manufacturer name).
// Used strictly offline in the browser—no remote API calls.
export const BUNDLED_OUI_TABLE: Record<string, string> = {
  // Apple
  '000393': 'Apple, Inc.',
  '000A95': 'Apple, Inc.',
  '000D93': 'Apple, Inc.',
  '0016CB': 'Apple, Inc.',
  '0017F2': 'Apple, Inc.',
  '001B63': 'Apple, Inc.',
  '001EC2': 'Apple, Inc.',
  '002500': 'Apple, Inc.',
  '0026BB': 'Apple, Inc.',
  '040CCE': 'Apple, Inc.',
  '18E7F4': 'Apple, Inc.',
  '28CFE9': 'Apple, Inc.',
  '3C0754': 'Apple, Inc.',
  '406C8F': 'Apple, Inc.',
  '5855CA': 'Apple, Inc.',
  '60C547': 'Apple, Inc.',
  '705681': 'Apple, Inc.',
  '7831C1': 'Apple, Inc.',
  '843835': 'Apple, Inc.',
  '8C8590': 'Apple, Inc.',
  '9801A7': 'Apple, Inc.',
  'A483E7': 'Apple, Inc.',
  'ACBC32': 'Apple, Inc.',
  'B8E856': 'Apple, Inc.',
  'D02598': 'Apple, Inc.',
  'DC2B2A': 'Apple, Inc.',
  'E0B9BA': 'Apple, Inc.',
  'F01898': 'Apple, Inc.',
  'F45C89': 'Apple, Inc.',

  // Samsung
  '0007AB': 'Samsung Electronics Co., Ltd.',
  '0012FB': 'Samsung Electronics Co., Ltd.',
  '0015B9': 'Samsung Electronics Co., Ltd.',
  '001D25': 'Samsung Electronics Co., Ltd.',
  '0021D1': 'Samsung Electronics Co., Ltd.',
  '002454': 'Samsung Electronics Co., Ltd.',
  '10D542': 'Samsung Electronics Co., Ltd.',
  '183A2D': 'Samsung Electronics Co., Ltd.',
  '28BA18': 'Samsung Electronics Co., Ltd.',
  '3423BA': 'Samsung Electronics Co., Ltd.',
  '5001BB': 'Samsung Electronics Co., Ltd.',
  '5CC1D7': 'Samsung Electronics Co., Ltd.',
  '78ABBB': 'Samsung Electronics Co., Ltd.',
  '8425DB': 'Samsung Electronics Co., Ltd.',
  '94350A': 'Samsung Electronics Co., Ltd.',
  'A0821F': 'Samsung Electronics Co., Ltd.',
  'B407F9': 'Samsung Electronics Co., Ltd.',
  'CC07AB': 'Samsung Electronics Co., Ltd.',
  'E47CF9': 'Samsung Electronics Co., Ltd.',
  'F409D8': 'Samsung Electronics Co., Ltd.',

  // Google & Nest
  '001A11': 'Google, Inc.',
  '18B430': 'Nest Labs Inc. (Google)',
  '3C5AB4': 'Google, Inc.',
  '546009': 'Google, Inc.',
  '641666': 'Nest Labs Inc. (Google)',
  '94EB2C': 'Google, Inc.',
  'A47733': 'Google, Inc.',
  'D86C63': 'Google, Inc.',
  'F4F5D8': 'Google, Inc.',
  'F88FCA': 'Google, Inc.',

  // Intel
  '0002B3': 'Intel Corporate',
  '000E0C': 'Intel Corporate',
  '0013CE': 'Intel Corporate',
  '001517': 'Intel Corporate',
  '001B21': 'Intel Corporate',
  '001E64': 'Intel Corporate',
  '0024D7': 'Intel Corporate',
  '08D40C': 'Intel Corporate',
  '1C1B0D': 'Intel Corporate',
  '340286': 'Intel Corporate',
  '4851B7': 'Intel Corporate',
  '5C514F': 'Intel Corporate',
  '6805CA': 'Intel Corporate',
  '7C7A91': 'Intel Corporate',
  '8086F2': 'Intel Corporate',
  '94659C': 'Intel Corporate',
  'A4C494': 'Intel Corporate',
  'B4B676': 'Intel Corporate',
  'D05099': 'Intel Corporate',
  'E4A471': 'Intel Corporate',
  'F8633F': 'Intel Corporate',

  // Microsoft
  '0003FF': 'Microsoft Corporation',
  '00155D': 'Microsoft Corporation (Hyper-V)',
  '0017FA': 'Microsoft Corporation',
  '0050F2': 'Microsoft Corporation',
  '281878': 'Microsoft Corporation',
  '501AC5': 'Microsoft Corporation',
  '7C1E52': 'Microsoft Corporation',
  '985FD3': 'Microsoft Corporation',
  'C83F26': 'Microsoft Corporation',

  // Dell / HP / Lenovo
  '00065B': 'Dell Inc.',
  '001422': 'Dell Inc.',
  '001E4F': 'Dell Inc.',
  '180373': 'Dell Inc.',
  '24B6FD': 'Dell Inc.',
  'B083FE': 'Dell Inc.',
  'D4BED9': 'Dell Inc.',
  'F8B156': 'Dell Inc.',
  '000802': 'Hewlett Packard Enterprise / HP Inc.',
  '00110A': 'Hewlett Packard',
  '001CC4': 'Hewlett Packard',
  '3C4A92': 'Hewlett Packard',
  '9457A5': 'Hewlett Packard',
  'D4C9EF': 'HP Inc.',
  '00092D': 'Lenovo / IBM',
  '28D244': 'LCFC (Hefei) / Lenovo',
  '54EE75': 'Lenovo',
  '8C1645': 'Lenovo',
  'C85B76': 'Lenovo',

  // Cisco / Juniper / Arista / Ubiquiti
  '00000C': 'Cisco Systems, Inc.',
  '000142': 'Cisco Systems, Inc.',
  '001B0D': 'Cisco Systems, Inc.',
  '002304': 'Cisco Systems, Inc.',
  '004096': 'Cisco Systems, Inc.',
  '5897BD': 'Cisco Systems, Inc.',
  'B0AA77': 'Cisco Systems, Inc.',
  '000585': 'Juniper Networks',
  '00121E': 'Juniper Networks',
  '2C6BF5': 'Juniper Networks',
  '001C73': 'Arista Networks',
  '28993A': 'Arista Networks',
  '00156D': 'Ubiquiti Inc.',
  '0418D6': 'Ubiquiti Inc.',
  '18E829': 'Ubiquiti Inc.',
  '24A43C': 'Ubiquiti Inc.',
  '44D9E7': 'Ubiquiti Inc.',
  '687251': 'Ubiquiti Inc.',
  '7483C2': 'Ubiquiti Inc.',
  '802AA8': 'Ubiquiti Inc.',
  'B4FBE4': 'Ubiquiti Inc.',
  'DC9FDB': 'Ubiquiti Inc.',
  'F09FC2': 'Ubiquiti Inc.',

  // Consumer Networking (TP-Link, Netgear, ASUS, D-Link, Linksys, MikroTik)
  '0023CD': 'TP-Link Technologies Co., Ltd.',
  '14CC20': 'TP-Link Technologies Co., Ltd.',
  '50C7BF': 'TP-Link Technologies Co., Ltd.',
  '60E327': 'TP-Link Technologies Co., Ltd.',
  '98DAC4': 'TP-Link Technologies Co., Ltd.',
  'B09575': 'TP-Link Systems Inc.',
  'C025E9': 'TP-Link Technologies Co., Ltd.',
  'E8DE27': 'TP-Link Technologies Co., Ltd.',
  '00095B': 'NETGEAR',
  '00146C': 'NETGEAR',
  '204E7F': 'NETGEAR',
  '4494FC': 'NETGEAR',
  'A42B8C': 'NETGEAR',
  'C40415': 'NETGEAR',
  '0011D8': 'ASUSTek Computer Inc.',
  '04D9F5': 'ASUSTek Computer Inc.',
  '1C872C': 'ASUSTek Computer Inc.',
  '2C4D54': 'ASUSTek Computer Inc.',
  '74D02B': 'ASUSTek Computer Inc.',
  'AC9E17': 'ASUSTek Computer Inc.',
  '00055D': 'D-Link Corporation',
  '00179A': 'D-Link Corporation',
  '1C7EE5': 'D-Link International',
  'B8A386': 'D-Link International',
  '0014BF': 'Cisco-Linksys, LLC',
  '20AA4B': 'Linksys / Belkin International',
  '000C42': 'Routerboard.com (MikroTik)',
  '4C5E0C': 'Routerboard.com (MikroTik)',
  '6C3B6B': 'Routerboard.com (MikroTik)',
  'B869F4': 'Routerboard.com (MikroTik)',

  // Embedded / IoT / SBCs
  '28CDC1': 'Raspberry Pi Foundation',
  'B827EB': 'Raspberry Pi Foundation',
  'D83ADD': 'Raspberry Pi Trading Ltd',
  'DCA632': 'Raspberry Pi Trading Ltd',
  'E45F01': 'Raspberry Pi Trading Ltd',
  '18FE34': 'Espressif Inc. (ESP8266/ESP32)',
  '240AC4': 'Espressif Inc. (ESP8266/ESP32)',
  '30AEA4': 'Espressif Inc. (ESP8266/ESP32)',
  '7C9EBD': 'Espressif Inc. (ESP8266/ESP32)',
  '84CCA8': 'Espressif Inc. (ESP8266/ESP32)',
  'A4CF12': 'Espressif Inc. (ESP8266/ESP32)',
  'ECFABC': 'Espressif Inc. (ESP8266/ESP32)',
  '90A2DA': 'Arduino LLC',
  'A8610A': 'Arduino SRL',
  '001788': 'Philips Lighting BV (Hue)',
  '000E58': 'Sonos, Inc.',
  '5CAAFD': 'Sonos, Inc.',
  '949F3E': 'Sonos, Inc.',
  '000D4B': 'Roku, Inc.',
  'B0A737': 'Roku, Inc.',
  'D83134': 'Roku, Inc.',
  '0C47C9': 'Amazon Technologies Inc.',
  '44650D': 'Amazon Technologies Inc.',
  '6837E9': 'Amazon Technologies Inc.',
  'F0272D': 'Amazon Technologies Inc.',

  // Smartphones / Telecom / Printers / Storage / Virtualization
  '009EC8': 'Xiaomi Communications Co Ltd',
  '286C07': 'Xiaomi Communications Co Ltd',
  '64B473': 'Xiaomi Communications Co Ltd',
  '7811DC': 'Xiaomi Communications Co Ltd',
  '001882': 'Huawei Technologies Co., Ltd',
  '00E0FC': 'Huawei Technologies Co., Ltd',
  '283152': 'Huawei Technologies Co., Ltd',
  '70723C': 'Huawei Technologies Co., Ltd',
  'A086C6': 'OnePlus Technology (Shenzhen) Co., Ltd',
  'C0EEFB': 'OnePlus Technology (Shenzhen) Co., Ltd',
  '0016B8': 'Sony Mobile Communications',
  '00041F': 'Sony Interactive Entertainment (PlayStation)',
  '280DFC': 'Sony Interactive Entertainment',
  '001CBE': 'Nintendo Co., Ltd.',
  '98B6E9': 'Nintendo Co., Ltd.',
  '005056': 'VMware, Inc.',
  '000C29': 'VMware, Inc.',
  '000569': 'VMware, Inc.',
  '080027': 'PCS Systemtechnik GmbH (VirtualBox)',
  '525400': 'QEMU / KVM Virtual NIC',
  '0242AC': 'Docker Container Default Bridge',
  '001132': 'Synology Incorporated',
  '9009D0': 'Synology Incorporated',
  '00089B': 'ICP Electronics / QNAP Systems',
  '00E04C': 'Realtek Semiconductor Corp.',
  '001018': 'Broadcom',
  '00037F': 'Qualcomm Atheros Communications',
  '00044B': 'NVIDIA Corporation',
  '48B02D': 'NVIDIA Corporation',
  '001B11': 'D-Link / Realtek',
  '000048': 'Seiko Epson Corporation',
  '001E8F': 'Canon Inc.',
  '008077': 'Brother Industries, Ltd.',
  '0000AA': 'Xerox Corporation',
};

export function lookupOui(rawInput: string): OuiLookupResult {
  const query = rawInput.trim();
  if (!query) {
    return {
      query: '',
      normalizedPrefix: null,
      vendor: null,
      isLocallyAdministered: null,
      isMulticast: null,
      matches: [],
    };
  }

  // Strip separators to check if user entered hex MAC/OUI digits
  const hexCandidate = query.replace(/[:\-.\s]/g, '').toUpperCase();
  const isHexQuery = /^[0-9A-F]{6,12}$/.test(hexCandidate);

  if (isHexQuery) {
    const prefix = hexCandidate.slice(0, 6);
    const firstByte = parseInt(prefix.slice(0, 2), 16);
    const isMulticast = (firstByte & 0x01) !== 0;
    const isLocallyAdministered = (firstByte & 0x02) !== 0;
    const vendor = BUNDLED_OUI_TABLE[prefix] ?? null;

    return {
      query,
      normalizedPrefix: `${prefix.slice(0, 2)}:${prefix.slice(2, 4)}:${prefix.slice(4, 6)}`,
      vendor,
      isLocallyAdministered,
      isMulticast,
      matches: vendor ? [{ prefix, vendor }] : [],
    };
  }

  // Otherwise search vendor names and prefixes by keyword
  const lower = query.toLowerCase();
  const seen = new Set<string>();
  const matches: Array<{ prefix: string; vendor: string }> = [];

  for (const [prefix, vendor] of Object.entries(BUNDLED_OUI_TABLE)) {
    if (prefix.length !== 6) continue;
    const formatted = `${prefix.slice(0, 2)}:${prefix.slice(2, 4)}:${prefix.slice(4, 6)}`;
    if (
      vendor.toLowerCase().includes(lower) ||
      prefix.toLowerCase().includes(lower) ||
      formatted.toLowerCase().includes(lower)
    ) {
      const key = `${prefix}:${vendor}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ prefix: formatted, vendor });
      }
    }
  }

  return {
    query,
    normalizedPrefix: null,
    vendor: null,
    isLocallyAdministered: null,
    isMulticast: null,
    matches: matches.slice(0, 40),
  };
}

export interface NiceClassEntry {
  classNumber: number;
  type: 'Goods' | 'Services';
  heading: string;
  description: string;
  keywords: string[];
}

// Standard international Nice Classification (Classes 1–34 Goods, Classes 35–45 Services)
export const NICE_CLASSES: NiceClassEntry[] = [
  {
    classNumber: 1,
    type: 'Goods',
    heading: 'Chemicals & Industrial Substances',
    description:
      'Chemicals for industry, science, photography, agriculture, horticulture, forestry, unprocessed plastics, fertilizers, fire-extinguishing compositions, and industrial adhesives.',
    keywords: ['chemical', 'fertilizer', 'resin', 'adhesive', 'glue', 'plastic', 'reagent', 'industrial', 'compost'],
  },
  {
    classNumber: 2,
    type: 'Goods',
    heading: 'Paints, Coatings & Colorants',
    description:
      'Paints, varnishes, lacquers, preservatives against rust and wood deterioration, colorants, dyes, printing inks, and raw natural resins.',
    keywords: ['paint', 'varnish', 'lacquer', 'dye', 'ink', 'toner', 'coating', 'primer', 'pigment', 'rust'],
  },
  {
    classNumber: 3,
    type: 'Goods',
    heading: 'Cosmetics, Skincare & Cleaning Preparations',
    description:
      'Non-medicated cosmetics, skincare, toiletries, perfumes, essential oils, shampoos, soaps, dentifrices, and household bleaching/cleaning/polishing preparations.',
    keywords: ['cosmetic', 'skincare', 'perfume', 'soap', 'shampoo', 'lotion', 'cream', 'makeup', 'detergent', 'cleaner', 'fragrance'],
  },
  {
    classNumber: 4,
    type: 'Goods',
    heading: 'Industrial Oils, Fuels & Candles',
    description:
      'Industrial oils and greases, wax, lubricants, dust absorbing compositions, fuels, motor spirit, illuminants, candles, and wicks for lighting.',
    keywords: ['oil', 'lubricant', 'grease', 'fuel', 'diesel', 'gasoline', 'candle', 'wax', 'charcoal', 'firewood'],
  },
  {
    classNumber: 5,
    type: 'Goods',
    heading: 'Pharmaceuticals, Supplements & Medical Supplies',
    description:
      'Pharmaceuticals, medical and veterinary preparations, sanitary products, dietary supplements, baby food, plasters, bandages, disinfectants, and fungicides.',
    keywords: ['medicine', 'pharmaceutical', 'vitamin', 'supplement', 'bandage', 'sanitizer', 'disinfectant', 'baby food', 'veterinary', 'drug'],
  },
  {
    classNumber: 6,
    type: 'Goods',
    heading: 'Common Metals & Metal Hardware',
    description:
      'Common metals and alloys, metal building materials, pipes and tubes of metal, safes, locks, nails, screws, bolts, wire, and small metal hardware.',
    keywords: ['metal', 'steel', 'aluminum', 'iron', 'lock', 'safe', 'pipe', 'screw', 'nail', 'hardware', 'cable'],
  },
  {
    classNumber: 7,
    type: 'Goods',
    heading: 'Machines, Motors & Power Tools',
    description:
      'Machines, machine tools, power-operated tools, motors and engines (except for land vehicles), industrial robots, 3D printers, agricultural implements, and vending machines.',
    keywords: ['machine', 'engine', 'motor', 'pump', 'robot', '3d printer', 'power tool', 'drill', 'washing machine', 'dishwasher', 'blender'],
  },
  {
    classNumber: 8,
    type: 'Goods',
    heading: 'Hand Tools & Cutlery',
    description:
      'Hand-operated tools and implements, cutlery, forks and spoons, side arms (other than firearms), razors, scissors, and manicure sets.',
    keywords: ['hand tool', 'hammer', 'wrench', 'screwdriver', 'knife', 'cutlery', 'razor', 'scissors', 'shaver'],
  },
  {
    classNumber: 9,
    type: 'Goods',
    heading: 'Software, Electronics, Computers & Scientific Apparatus',
    description:
      'Downloadable computer software, mobile apps, computers, smartphones, cameras, eyewear, headphones, batteries, chargers, scientific/measuring apparatus, and downloadable digital files.',
    keywords: ['software', 'app', 'mobile app', 'saas download', 'computer', 'laptop', 'phone', 'smartphone', 'electronics', 'camera', 'headphones', 'glasses', 'sunglasses', 'battery', 'charger', 'ebook'],
  },
  {
    classNumber: 10,
    type: 'Goods',
    heading: 'Medical, Surgical & Dental Devices',
    description:
      'Surgical, medical, dental, and veterinary apparatus and instruments, artificial limbs, orthopedic articles, suture materials, thermometers, and massage apparatus.',
    keywords: ['medical device', 'surgical', 'dental', 'orthopedic', 'thermometer', 'massage', 'wheelchair', 'hearing aid', 'mask'],
  },
  {
    classNumber: 11,
    type: 'Goods',
    heading: 'Lighting, Heating, Cooling & Plumbing Appliances',
    description:
      'Apparatus and installations for lighting, heating, steam generating, cooking, refrigerating, drying, ventilating, water supply, and sanitary purposes.',
    keywords: ['lamp', 'light', 'led', 'bulb', 'oven', 'microwave', 'refrigerator', 'fridge', 'air conditioner', 'heater', 'fan', 'faucet', 'coffee maker', 'toaster'],
  },
  {
    classNumber: 12,
    type: 'Goods',
    heading: 'Vehicles & Conveyances',
    description:
      'Vehicles, apparatus for locomotion by land, air, or water, automobiles, bicycles, electric scooters, drones, tires, strollers, and vehicle parts.',
    keywords: ['car', 'vehicle', 'automobile', 'bike', 'bicycle', 'scooter', 'ev', 'truck', 'boat', 'drone', 'tire', 'stroller'],
  },
  {
    classNumber: 13,
    type: 'Goods',
    heading: 'Firearms, Ammunition & Fireworks',
    description:
      'Firearms, ammunition, projectiles, explosives, and fireworks.',
    keywords: ['firearm', 'gun', 'ammunition', 'explosive', 'firework', 'pyrotechnic'],
  },
  {
    classNumber: 14,
    type: 'Goods',
    heading: 'Jewelry, Precious Metals & Watches',
    description:
      'Precious metals and alloys, jewelry, precious and semi-precious stones, horological and chronometric instruments, wristwatches, and clocks.',
    keywords: ['jewelry', 'jewellery', 'ring', 'necklace', 'bracelet', 'watch', 'clock', 'gold', 'silver', 'diamond'],
  },
  {
    classNumber: 15,
    type: 'Goods',
    heading: 'Musical Instruments',
    description:
      'Musical instruments, music stands, conductors’ batons, guitars, pianos, drums, and electronic keyboards.',
    keywords: ['musical instrument', 'guitar', 'piano', 'drum', 'violin', 'keyboard', 'synthesizer', 'flute'],
  },
  {
    classNumber: 16,
    type: 'Goods',
    heading: 'Paper, Printed Matter & Stationery',
    description:
      'Paper and cardboard, printed matter, books, magazines, photographs, stationery, office requisites (except furniture), adhesives for stationery, artists’ materials, and packaging bags of paper/plastic.',
    keywords: ['paper', 'book', 'magazine', 'notebook', 'pen', 'pencil', 'stationery', 'print', 'poster', 'packaging', 'box', 'card'],
  },
  {
    classNumber: 17,
    type: 'Goods',
    heading: 'Rubber, Insulation & Flexible Pipes',
    description:
      'Unprocessed and semi-processed rubber, gutta-percha, gum, plastics and resins in extruded form for use in manufacture, packing/insulating materials, and flexible non-metal hoses.',
    keywords: ['rubber', 'silicone', 'insulation', 'sealant', 'hose', 'tape', 'foam', 'gasket'],
  },
  {
    classNumber: 18,
    type: 'Goods',
    heading: 'Leather Goods, Bags & Luggage',
    description:
      'Leather and imitations of leather, luggage, suitcases, backpacks, handbags, wallets, umbrellas, parasols, walking sticks, and pet collars/leashes.',
    keywords: ['bag', 'handbag', 'backpack', 'luggage', 'suitcase', 'wallet', 'purse', 'leather', 'umbrella', 'collar', 'leash'],
  },
  {
    classNumber: 19,
    type: 'Goods',
    heading: 'Non-Metallic Building Materials',
    description:
      'Materials (not of metal) for building and construction, lumber, timber, concrete, cement, bricks, tiles, glass for building, and asphalt.',
    keywords: ['wood', 'timber', 'lumber', 'brick', 'tile', 'cement', 'concrete', 'stone', 'marble', 'glass', 'roofing', 'flooring'],
  },
  {
    classNumber: 20,
    type: 'Goods',
    heading: 'Furniture, Mirrors & Home Fixtures',
    description:
      'Furniture, mirrors, picture frames, mattresses, pillows, cushions, indoor blinds, and containers (not of metal) for storage or transport.',
    keywords: ['furniture', 'chair', 'table', 'desk', 'sofa', 'bed', 'mattress', 'pillow', 'mirror', 'shelf', 'cabinet', 'frame'],
  },
  {
    classNumber: 21,
    type: 'Goods',
    heading: 'Household Utensils, Cookware & Glassware',
    description:
      'Household or kitchen utensils and containers, cookware, tableware, combs, sponges, brushes, toothbrushes, glassware, porcelain, and mugs/bottles.',
    keywords: ['kitchenware', 'cookware', 'pan', 'pot', 'mug', 'cup', 'bottle', 'plate', 'bowl', 'glassware', 'ceramic', 'toothbrush', 'broom'],
  },
  {
    classNumber: 22,
    type: 'Goods',
    heading: 'Ropes, Tents, Tarpaulins & Raw Fibers',
    description:
      'Ropes and strings, nets, tents, awnings, tarpaulins, sails, sacks for transport/storage of bulk materials, padding materials, and raw fibrous textile materials.',
    keywords: ['tent', 'canopy', 'tarp', 'rope', 'net', 'hammock', 'sail', 'sack', 'yarn fiber', 'cotton raw'],
  },
  {
    classNumber: 23,
    type: 'Goods',
    heading: 'Yarns & Threads for Textile Use',
    description:
      'Yarns and threads for textile use, sewing thread, embroidery thread, and wool/cotton spun yarns.',
    keywords: ['yarn', 'thread', 'wool', 'sewing thread', 'knitting'],
  },
  {
    classNumber: 24,
    type: 'Goods',
    heading: 'Textiles, Fabrics & Household Linens',
    description:
      'Textiles and substitutes for textiles, household linen, bed sheets, blankets, towels, curtains of textile or plastic, and tablecloths.',
    keywords: ['fabric', 'textile', 'bedding', 'sheet', 'blanket', 'towel', 'curtain', 'linen', 'cloth', 'quilt'],
  },
  {
    classNumber: 25,
    type: 'Goods',
    heading: 'Clothing, Footwear & Headwear',
    description:
      'Clothing, t-shirts, hoodies, dresses, pants, coats, sportswear, footwear, shoes, boots, sneakers, socks, and headwear including hats and caps.',
    keywords: ['clothing', 'apparel', 'shirt', 't-shirt', 'hoodie', 'dress', 'jeans', 'pants', 'jacket', 'shoes', 'sneakers', 'boots', 'hat', 'cap', 'footwear', 'fashion'],
  },
  {
    classNumber: 26,
    type: 'Goods',
    heading: 'Lace, Embroidery, Buttons & Hair Accessories',
    description:
      'Lace, braid, embroidery, ribbons, buttons, hooks and eyes, pins, needles, artificial flowers, hair ornaments, and false hair/wigs.',
    keywords: ['button', 'zipper', 'ribbon', 'lace', 'embroidery', 'hair clip', 'wig', 'needle', 'patch', 'pin'],
  },
  {
    classNumber: 27,
    type: 'Goods',
    heading: 'Carpets, Rugs, Mats & Wallpaper',
    description:
      'Carpets, rugs, mats and matting, yoga mats, linoleum and floor coverings, and wall hangings (non-textile) including wallpaper.',
    keywords: ['carpet', 'rug', 'mat', 'yoga mat', 'doormat', 'wallpaper', 'linoleum'],
  },
  {
    classNumber: 28,
    type: 'Goods',
    heading: 'Games, Toys & Sporting Goods',
    description:
      'Games, toys, playthings, video game consoles and controllers, board games, plush toys, gymnastic and sporting articles, fitness equipment, and Christmas tree decorations.',
    keywords: ['toy', 'game', 'board game', 'puzzle', 'doll', 'plush', 'sport', 'fitness', 'dumbbell', 'ball', 'racket', 'golf', 'console'],
  },
  {
    classNumber: 29,
    type: 'Goods',
    heading: 'Meat, Dairy, Eggs & Preserved Foods',
    description:
      'Meat, fish, poultry, preserved/frozen/dried/cooked fruits and vegetables, jellies, jams, eggs, milk, cheese, butter, yogurt, edible oils, and nut snacks.',
    keywords: ['meat', 'fish', 'chicken', 'milk', 'cheese', 'yogurt', 'butter', 'egg', 'jam', 'olive oil', 'nuts', 'chips', 'preserved fruit'],
  },
  {
    classNumber: 30,
    type: 'Goods',
    heading: 'Coffee, Tea, Bakery, Confectionery & Spices',
    description:
      'Coffee, tea, cocoa, rice, pasta, flour, bread, pastries, cakes, cookies, chocolate, candy, honey, ice cream, sauces, vinegar, and spices.',
    keywords: ['coffee', 'tea', 'chocolate', 'candy', 'bakery', 'bread', 'cake', 'cookie', 'pasta', 'rice', 'spice', 'sauce', 'honey', 'ice cream', 'snacks'],
  },
  {
    classNumber: 31,
    type: 'Goods',
    heading: 'Fresh Produce, Plants, Seeds & Pet Food',
    description:
      'Raw and unprocessed agricultural/horticultural products, fresh fruits and vegetables, live plants and flowers, seeds, animal foodstuffs, pet food, and malt.',
    keywords: ['fresh fruit', 'vegetable', 'plant', 'flower', 'seed', 'pet food', 'dog food', 'cat food', 'grain', 'tree'],
  },
  {
    classNumber: 32,
    type: 'Goods',
    heading: 'Beers & Non-Alcoholic Beverages',
    description:
      'Beers, non-alcoholic beverages, mineral and aerated waters, fruit drinks and juices, smoothies, energy drinks, and syrups for making beverages.',
    keywords: ['beer', 'water', 'soda', 'juice', 'smoothie', 'energy drink', 'soft drink', 'lemonade', 'mocktail'],
  },
  {
    classNumber: 33,
    type: 'Goods',
    heading: 'Wines, Spirits & Alcoholic Beverages (Except Beer)',
    description:
      'Alcoholic beverages (except beers), wines, spirits, whiskey, vodka, gin, rum, tequila, liqueurs, and hard ciders.',
    keywords: ['wine', 'whiskey', 'vodka', 'gin', 'rum', 'tequila', 'liquor', 'spirits', 'champagne', 'cocktail'],
  },
  {
    classNumber: 34,
    type: 'Goods',
    heading: 'Tobacco, Smokers’ Articles & E-Cigarettes',
    description:
      'Tobacco and tobacco substitutes, cigarettes and cigars, electronic cigarettes and oral vaporizers for smokers, smokers’ articles, lighters, and matches.',
    keywords: ['tobacco', 'cigarette', 'cigar', 'vape', 'e-cigarette', 'lighter', 'matches'],
  },
  {
    classNumber: 35,
    type: 'Services',
    heading: 'Advertising, Retail, E-Commerce & Business Management',
    description:
      'Advertising, marketing, business management and administration, office functions, online retail store services, wholesale services, accounting, and recruiting.',
    keywords: ['advertising', 'marketing', 'agency', 'retail', 'ecommerce', 'online store', 'marketplace', 'consulting business', 'accounting', 'seo', 'hr'],
  },
  {
    classNumber: 36,
    type: 'Services',
    heading: 'Insurance, Financial, Banking & Real Estate Services',
    description:
      'Insurance, financial affairs, banking, payment processing, cryptocurrency exchange/wallet services, lending, investment advisory, and real estate brokerage/management.',
    keywords: ['finance', 'fintech', 'bank', 'banking', 'payment', 'insurance', 'real estate', 'property', 'investment', 'loan', 'crypto', 'mortgage'],
  },
  {
    classNumber: 37,
    type: 'Services',
    heading: 'Construction, Repair & Installation Services',
    description:
      'Building construction, renovation, plumbing, electrical installation, vehicle/electronics repair, cleaning services, and hardware installation/maintenance.',
    keywords: ['construction', 'building', 'repair', 'maintenance', 'plumbing', 'electrical', 'installation', 'cleaning', 'mechanic', 'carpentry'],
  },
  {
    classNumber: 38,
    type: 'Services',
    heading: 'Telecommunications & Streaming Transmission',
    description:
      'Telecommunications services, internet service provision, wireless/mobile communications, video/audio broadcasting, chat rooms, and digital message transmission.',
    keywords: ['telecom', 'telecommunications', 'isp', 'streaming broadcast', 'wireless', 'messaging', 'telephony', 'voip', 'podcast transmission'],
  },
  {
    classNumber: 39,
    type: 'Services',
    heading: 'Transport, Logistics, Delivery & Travel Arrangement',
    description:
      'Transport, packaging and storage of goods, courier delivery, freight shipping, warehousing, car rental, and travel tour/booking arrangement.',
    keywords: ['transport', 'logistics', 'shipping', 'delivery', 'courier', 'warehouse', 'storage', 'travel', 'airline', 'taxi', 'freight'],
  },
  {
    classNumber: 40,
    type: 'Services',
    heading: 'Manufacturing, Printing & Material Treatment',
    description:
      'Custom manufacturing and assembly for others, 3D printing, textile/screen printing, woodworking, metalworking, recycling of waste, and water/air treatment.',
    keywords: ['manufacturing', 'custom printing', 'engraving', 'recycling', 'tailoring', 'framing', 'embroidery', 'water treatment'],
  },
  {
    classNumber: 41,
    type: 'Services',
    heading: 'Education, Training, Entertainment & Publishing',
    description:
      'Education, online courses, training, workshops, entertainment, live events, film/music production, online gaming services, and digital publishing of blogs/books.',
    keywords: ['education', 'training', 'course', 'coaching', 'school', 'tutoring', 'entertainment', 'music', 'podcast', 'gaming', 'publishing', 'events', 'gym', 'fitness class'],
  },
  {
    classNumber: 42,
    type: 'Services',
    heading: 'SaaS, Software Development, Cloud & Scientific Services',
    description:
      'Software as a Service (SaaS), web design, software engineering, cloud computing, IT security/cybersecurity, hosting, UI/UX design, architecture, and scientific research.',
    keywords: ['saas', 'software as a service', 'cloud', 'web development', 'web design', 'it', 'cybersecurity', 'hosting', 'api', 'tech', 'architecture', 'engineering', 'research'],
  },
  {
    classNumber: 43,
    type: 'Services',
    heading: 'Restaurants, Cafes, Catering & Temporary Accommodation',
    description:
      'Services for providing food and drink, restaurants, coffee shops, cafes, bars, catering, food trucks, and temporary lodging including hotels and vacation rentals.',
    keywords: ['restaurant', 'cafe', 'coffee shop', 'catering', 'bar', 'bakery cafe', 'hotel', 'motel', 'hostel', 'hospitality', 'food delivery prep'],
  },
  {
    classNumber: 44,
    type: 'Services',
    heading: 'Medical, Healthcare, Wellness & Beauty Salon Services',
    description:
      'Medical services, clinics, telehealth, dentistry, veterinary care, mental health therapy, spas, hair/nail beauty salons, and agriculture/horticulture/landscaping.',
    keywords: ['healthcare', 'clinic', 'hospital', 'doctor', 'dentist', 'therapy', 'salon', 'spa', 'barber', 'wellness', 'veterinary', 'landscaping', 'gardening'],
  },
  {
    classNumber: 45,
    type: 'Services',
    heading: 'Legal, Security & Personal/Social Services',
    description:
      'Legal services, trademark/IP licensing, physical security guard services, background screening, online social networking services, wedding planning, and personal concierge.',
    keywords: ['legal', 'law firm', 'attorney', 'licensing', 'security', 'social network', 'dating', 'wedding', 'concierge', 'funeral'],
  },
];
