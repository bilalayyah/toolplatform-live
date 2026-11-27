import { describe, expect, it } from 'vitest';
import {
  integerToRoman,
  romanToInteger,
  validateRoman,
  validateCalendarDate,
  convertDateToRoman,
  convertRomanToDate,
} from '../romanNumerals';

describe('Roman Numerals Conversion Engine', () => {
  it('converts integers to Roman numerals correctly', () => {
    expect(integerToRoman(1)).toBe('I');
    expect(integerToRoman(4)).toBe('IV');
    expect(integerToRoman(9)).toBe('IX');
    expect(integerToRoman(14)).toBe('XIV');
    expect(integerToRoman(19)).toBe('XIX');
    expect(integerToRoman(40)).toBe('XL');
    expect(integerToRoman(49)).toBe('XLIX');
    expect(integerToRoman(90)).toBe('XC');
    expect(integerToRoman(99)).toBe('XCIX');
    expect(integerToRoman(400)).toBe('CD');
    expect(integerToRoman(500)).toBe('D');
    expect(integerToRoman(900)).toBe('CM');
    expect(integerToRoman(1000)).toBe('M');
    expect(integerToRoman(1984)).toBe('MCMLXXXIV');
    expect(integerToRoman(1999)).toBe('MCMXCIX');
    expect(integerToRoman(2024)).toBe('MMXXIV');
    expect(integerToRoman(2025)).toBe('MMXXV');
    expect(integerToRoman(2026)).toBe('MMXXVI');
    expect(integerToRoman(3999)).toBe('MMMCMXCIX');
  });

  it('converts Roman numerals to integers correctly', () => {
    expect(romanToInteger('I')).toBe(1);
    expect(romanToInteger('IV')).toBe(4);
    expect(romanToInteger('IX')).toBe(9);
    expect(romanToInteger('XIV')).toBe(14);
    expect(romanToInteger('XL')).toBe(40);
    expect(romanToInteger('XC')).toBe(90);
    expect(romanToInteger('CD')).toBe(400);
    expect(romanToInteger('CM')).toBe(900);
    expect(romanToInteger('MCMXCIV')).toBe(1994);
    expect(romanToInteger('MMXXIV')).toBe(2024);
    expect(romanToInteger('MMXXV')).toBe(2025);
    expect(romanToInteger('MMXXVI')).toBe(2026);
    expect(romanToInteger('MMMCMXCIX')).toBe(3999);
    expect(romanToInteger('mmxxvi')).toBe(2026); // lowercase normalization
  });

  it('rejects invalid Roman numerals and out of range values', () => {
    expect(validateRoman('IIII').valid).toBe(false);
    expect(validateRoman('VV').valid).toBe(false);
    expect(validateRoman('XXXX').valid).toBe(false);
    expect(validateRoman('IC').valid).toBe(false);
    expect(validateRoman('IL').valid).toBe(false);
    expect(validateRoman('XM').valid).toBe(false);
    expect(validateRoman('VX').valid).toBe(false);
    expect(validateRoman('ABC').valid).toBe(false);
    expect(validateRoman('MMMM').valid).toBe(false);
    expect(validateRoman('').valid).toBe(false);

    expect(() => integerToRoman(0)).toThrow();
    expect(() => integerToRoman(-1)).toThrow();
    expect(() => integerToRoman(4000)).toThrow();
    expect(() => integerToRoman(1.5)).toThrow();
  });

  it('validates and converts calendar dates', () => {
    expect(validateCalendarDate(29, 2, 2024)).toBe(true); // leap year
    expect(validateCalendarDate(29, 2, 2025)).toBe(false); // not leap year
    expect(validateCalendarDate(31, 4, 2026)).toBe(false); // April has 30 days

    const romanDate = convertDateToRoman(27, 11, 2026);
    expect(romanDate).toEqual({ day: 'XXVII', month: 'XI', year: 'MMXXVI' });

    const parsed = convertRomanToDate('XXVII/XI/MMXXVI');
    expect(parsed).toEqual({ day: 27, month: 11, year: 2026 });
  });
});
