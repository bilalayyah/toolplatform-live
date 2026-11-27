export type TimeFormat = '12h' | '24h';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR' | 'INR' | 'CAD' | 'AUD';

export interface BreakPeriod {
  id: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface PayInput {
  hourlyRate: number;
  currency: CurrencyCode;
  totalWorkingMinutes: number;
  overtimeHours: number;
  overtimeMultiplier: number;
}

export interface PayResult {
  regularEarnings: number;
  overtimeEarnings: number;
  totalEarnings: number;
  totalWorkingHours: number;
  averageHourlyRate: number;
}

export function parseTime24(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') {
    throw new Error('Please enter a valid time.');
  }
  const parts = timeStr.trim().split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time values: ${timeStr}`);
  }
  return hours * 60 + minutes;
}

export function buildTime12(hour: number, minutes: number, period: 'AM' | 'PM'): number {
  if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid 12-hour time values.');
  }
  let h24 = hour % 12;
  if (period === 'PM') {
    h24 += 12;
  }
  return h24 * 60 + minutes;
}

export function splitTime12(totalMinutes: number): { hour: number; minutes: number; period: 'AM' | 'PM' } {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period: 'AM' | 'PM' = h24 < 12 ? 'AM' : 'PM';
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour, minutes, period };
}

export function formatClockTime(totalMinutes: number, format: TimeFormat): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  if (format === '24h') {
    const h = Math.floor(normalized / 60).toString().padStart(2, '0');
    const m = (normalized % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  } else {
    const split = splitTime12(normalized);
    const m = split.minutes.toString().padStart(2, '0');
    return `${split.hour}:${m} ${split.period}`;
  }
}

export function formatDuration(totalMinutes: number): string {
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const sign = totalMinutes < 0 ? '-' : '';
  if (hours === 0) {
    return `${sign}${mins}m`;
  }
  if (mins === 0) {
    return `${sign}${hours}h`;
  }
  return `${sign}${hours}h ${mins}m`;
}

export function formatDurationHm(totalMinutes: number): string {
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const sign = totalMinutes < 0 ? '-' : '';
  return `${sign}${hours} hours ${mins} minutes`;
}

export function minutesBetween(startMins: number, endMins: number, isOvernight: boolean): number {
  if (isOvernight) {
    return (1440 - startMins) + endMins;
  }
  let diff = endMins - startMins;
  if (diff < 0) {
    diff += 1440; // auto rollover if end < start and not explicitly checked
  }
  return diff;
}

export function calculateBreakMinutes(breaks: BreakPeriod[], additionalUnpaidMinutes: number): number {
  let total = Math.max(0, additionalUnpaidMinutes);
  for (const b of breaks) {
    try {
      const s = parseTime24(b.start);
      const e = parseTime24(b.end);
      let diff = e - s;
      if (diff < 0) diff += 1440;
      total += diff;
    } catch {
      // ignore invalid break inputs during calculation
    }
  }
  return total;
}

export function validateBreaks(shiftStartMins: number, shiftEndMins: number, isOvernight: boolean, breaks: BreakPeriod[]): string | null {
  const shiftTotal = minutesBetween(shiftStartMins, shiftEndMins, isOvernight);
  let accumulatedBreak = 0;

  for (let i = 0; i < breaks.length; i++) {
    const b = breaks[i];
    if (!b.start || !b.end) continue;
    const bs = parseTime24(b.start);
    const be = parseTime24(b.end);
    let bLen = be - bs;
    if (bLen < 0) bLen += 1440;

    if (bLen <= 0) {
      return `Break #${i + 1} end time must be after start time.`;
    }

    accumulatedBreak += bLen;

    // Check overlap with previous breaks
    for (let j = 0; j < i; j++) {
      const prev = breaks[j];
      if (!prev.start || !prev.end) continue;
      const ps = parseTime24(prev.start);
      const pe = parseTime24(prev.end);
      if (Math.max(bs, ps) < Math.min(be, pe)) {
        return `Break #${i + 1} overlaps with Break #${j + 1}.`;
      }
    }
  }

  if (accumulatedBreak >= shiftTotal) {
    return 'Total break time cannot equal or exceed total shift duration.';
  }

  return null;
}

export function toDecimalHours(hours: number, minutes: number, precision: number = 2): number {
  const total = hours + minutes / 60;
  const p = Math.max(0, Math.min(4, precision));
  return parseFloat(total.toFixed(p));
}

export function minutesToDecimalHours(totalMinutes: number, precision: number = 2): number {
  const hours = totalMinutes / 60;
  const p = Math.max(0, Math.min(4, precision));
  return parseFloat(hours.toFixed(p));
}

export function fromDecimalHours(decimal: number): { hours: number; minutes: number } {
  const totalMins = Math.round(Math.max(0, decimal) * 60);
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  return { hours, minutes };
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    PKR: 'Rs ',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'AU$',
  };
  const sym = symbols[currency] || '$';
  return `${sym}${amount.toFixed(2)}`;
}

export function calculatePay(input: PayInput): PayResult {
  const rate = Math.max(0, input.hourlyRate);
  const totalWorkHours = input.totalWorkingMinutes / 60;
  const regularHours = Math.max(0, totalWorkHours - Math.max(0, input.overtimeHours));
  const otHours = Math.max(0, input.overtimeHours);
  const otMultiplier = Math.max(1, input.overtimeMultiplier);

  const regularEarnings = regularHours * rate;
  const overtimeEarnings = otHours * rate * otMultiplier;
  const totalEarnings = regularEarnings + overtimeEarnings;
  const avgRate = totalWorkHours > 0 ? totalEarnings / totalWorkHours : rate;

  return {
    regularEarnings: parseFloat(regularEarnings.toFixed(2)),
    overtimeEarnings: parseFloat(overtimeEarnings.toFixed(2)),
    totalEarnings: parseFloat(totalEarnings.toFixed(2)),
    totalWorkingHours: parseFloat(totalWorkHours.toFixed(2)),
    averageHourlyRate: parseFloat(avgRate.toFixed(2)),
  };
}
