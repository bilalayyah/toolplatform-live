export function integerToRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }

  const values: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let result = '';
  let n = num;
  for (const [val, roman] of values) {
    while (n >= val) {
      result += roman;
      n -= val;
    }
  }
  return result;
}

export function romanToInteger(romanStr: string): number {
  if (!romanStr || typeof romanStr !== 'string') {
    throw new Error('Please enter a Roman numeral string.');
  }
  const clean = romanStr.trim().toUpperCase();
  if (!clean) {
    throw new Error('Roman numeral cannot be empty.');
  }

  const validation = validateRoman(clean);
  if (!validation.valid || validation.value === null) {
    throw new Error(validation.error || 'Invalid Roman numeral.');
  }

  return validation.value;
}

export function validateRoman(romanStr: string): { valid: boolean; error: string | null; value: number | null } {
  if (!romanStr || typeof romanStr !== 'string') {
    return { valid: false, error: 'Input is empty.', value: null };
  }
  const clean = romanStr.trim().toUpperCase();
  if (!clean) {
    return { valid: false, error: 'Input is empty.', value: null };
  }

  // Check valid characters
  const validChars = /^[IVXLCDM]+$/;
  if (!validChars.test(clean)) {
    return { valid: false, error: 'Contains invalid characters. Only I, V, X, L, C, D, M are allowed.', value: null };
  }

  // Strict repetition rules: V, L, D cannot repeat. I, X, C, M cannot repeat > 3 times in a row.
  if (/V{2,}|L{2,}|D{2,}/.test(clean)) {
    return { valid: false, error: 'Invalid repetition: V, L, and D cannot repeat.', value: null };
  }
  if (/I{4,}|X{4,}|C{4,}|M{4,}/.test(clean)) {
    return { valid: false, error: 'Invalid repetition: I, X, C, and M cannot repeat more than three times consecutively.', value: null };
  }

  // Parse value
  const map: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const current = map[clean[i]];
    const next = map[clean[i + 1]] || 0;

    if (current < next) {
      // Check if subtractive pair is valid: IV, IX, XL, XC, CD, CM
      const pair = clean[i] + clean[i + 1];
      if (pair !== 'IV' && pair !== 'IX' && pair !== 'XL' && pair !== 'XC' && pair !== 'CD' && pair !== 'CM') {
        return { valid: false, error: `Invalid subtractive combination: ${pair}.`, value: null };
      }
      total += next - current;
      i++; // skip next
    } else {
      total += current;
    }
  }

  if (total < 1 || total > 3999) {
    return { valid: false, error: 'Resulting value must be between 1 and 3999.', value: null };
  }

  // Canonical round-trip validation (rejects IIII, VIIII, etc.)
  try {
    const canonical = integerToRoman(total);
    if (canonical !== clean) {
      return { valid: false, error: `Non-canonical Roman numeral. Did you mean ${canonical}?`, value: null };
    }
  } catch {
    return { valid: false, error: 'Invalid Roman numeral calculation.', value: null };
  }

  return { valid: true, error: null, value: total };
}

export function validateCalendarDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1 || year > 3999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= daysInMonths[month - 1];
}

export function convertDateToRoman(day: number, month: number, year: number): { day: string; month: string; year: string } {
  if (!validateCalendarDate(day, month, year)) {
    throw new Error('Please enter a valid calendar date between years 1 and 3999.');
  }
  return {
    day: integerToRoman(day),
    month: integerToRoman(month),
    year: integerToRoman(year),
  };
}

export function formatRomanDate(parts: { day: string; month: string; year: string }, format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'): string {
  if (format === 'MM/DD/YYYY') {
    return `${parts.month}/${parts.day}/${parts.year}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${parts.year}-${parts.month}-${parts.day}`;
  }
  return `${parts.day}/${parts.month}/${parts.year}`;
}

export function convertRomanToDate(romanDateStr: string): { day: number; month: number; year: number } {
  if (!romanDateStr || typeof romanDateStr !== 'string') {
    throw new Error('Please enter a Roman date string.');
  }
  const parts = romanDateStr.trim().split(/[\/\-\.]/);
  if (parts.length !== 3) {
    throw new Error('Roman date must have three components separated by slashes, dashes, or dots (e.g. XXVII/XI/MMXXVI).');
  }

  const day = romanToInteger(parts[0]);
  const month = romanToInteger(parts[1]);
  const year = romanToInteger(parts[2]);

  if (!validateCalendarDate(day, month, year)) {
    throw new Error(`Parsed components (Day: ${day}, Month: ${month}, Year: ${year}) do not form a valid calendar date.`);
  }

  return { day, month, year };
}

export function formatStandardDate(day: number, month: number, year: number, format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'): string {
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const yyyy = String(year);

  if (format === 'MM/DD/YYYY') {
    return `${mm}/${dd}/${yyyy}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${yyyy}-${mm}-${dd}`;
  }
  return `${dd}/${mm}/${yyyy}`;
}
