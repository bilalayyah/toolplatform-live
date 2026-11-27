import { describe, expect, it } from 'vitest';
import {
  parseTime24,
  minutesBetween,
  calculateBreakMinutes,
  validateBreaks,
  toDecimalHours,
  minutesToDecimalHours,
  calculatePay,
} from '../hourlyCalculations';

describe('Online Hourly Calculator Calculation Engine', () => {
  it('parses 24-hour time correctly', () => {
    expect(parseTime24('09:00')).toBe(540);
    expect(parseTime24('17:00')).toBe(1020);
    expect(parseTime24('22:30')).toBe(1350);
  });

  it('calculates elapsed minutes between times (including overnight)', () => {
    // 09:00 to 17:00 = 8 hours (480 mins)
    expect(minutesBetween(540, 1020, false)).toBe(480);
    // 10:30 PM (1350) to 06:30 AM (390) overnight = 8 hours (480 mins)
    expect(minutesBetween(1350, 390, true)).toBe(480);
  });

  it('calculates net work hours and break deductions with overlap validation', () => {
    const shiftStart = 540; // 09:00
    const shiftEnd = 1020; // 17:00 (8h)
    const breaks = [
      { id: '1', start: '12:30', end: '13:00' }, // 30 mins
    ];
    const breakMins = calculateBreakMinutes(breaks, 0);
    expect(breakMins).toBe(30);

    const validationError = validateBreaks(shiftStart, shiftEnd, false, breaks);
    expect(validationError).toBeNull();

    // Overlapping breaks check
    const overlappingBreaks = [
      { id: '1', start: '12:00', end: '13:00' },
      { id: '2', start: '12:30', end: '13:30' },
    ];
    expect(validateBreaks(shiftStart, shiftEnd, false, overlappingBreaks)).not.toBeNull();
  });

  it('converts minutes to decimal hours with correct precision', () => {
    expect(minutesToDecimalHours(90, 2)).toBe(1.5);
    expect(minutesToDecimalHours(135, 2)).toBe(2.25);
    expect(toDecimalHours(7, 20, 2)).toBe(7.33);
  });

  it('calculates hourly pay and overtime correctly', () => {
    // $20/hour x 8 hours = $160
    const pay1 = calculatePay({
      hourlyRate: 20,
      currency: 'USD',
      totalWorkingMinutes: 480,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
    });
    expect(pay1.totalEarnings).toBe(160);

    // $20/hour x 6 regular hours + 2 overtime hours at 1.5 multiplier = $120 + $60 = $180
    const pay2 = calculatePay({
      hourlyRate: 20,
      currency: 'USD',
      totalWorkingMinutes: 480,
      overtimeHours: 2,
      overtimeMultiplier: 1.5,
    });
    expect(pay2.totalEarnings).toBe(180);
    expect(pay2.overtimeEarnings).toBe(60);
  });
});
