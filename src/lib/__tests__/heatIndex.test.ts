import { describe, expect, it } from 'vitest';
import {
  calculateHeatIndex,
  calculateHeatIndexFromCelsius,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getRiskBand,
  getRiskThresholdRows,
  heatIndexSimple,
  highHumidityAdjustment,
  lowHumidityAdjustment,
  parseHeatIndexInputs,
  rothfuszRegression,
  roundToOneDecimal,
} from '../heatIndex';

describe('Heat Index Calculator Engine (NWS Rothfusz)', () => {
  it('converts between Celsius and Fahrenheit accurately', () => {
    expect(celsiusToFahrenheit(0)).toBeCloseTo(32, 6);
    expect(celsiusToFahrenheit(32)).toBeCloseTo(89.6, 6);
    expect(fahrenheitToCelsius(80)).toBeCloseTo(26.6667, 3);
    expect(fahrenheitToCelsius(125)).toBeCloseTo(51.6667, 3);
  });

  it('computes exact canonical Fahrenheit test cases', () => {
    // 100°F / 55% -> 123.6°F (≈ 124°F), Danger
    const r1 = calculateHeatIndex(100, 55);
    expect(roundToOneDecimal(r1.heatIndexF)).toBe(123.6);
    expect(r1.method).toBe('rothfusz');
    expect(getRiskBand(r1.heatIndexF).band).toBe('danger');

    // 96°F / 65% -> 121.0°F (≈ 121°F), Danger
    const r2 = calculateHeatIndex(96, 65);
    expect(roundToOneDecimal(r2.heatIndexF)).toBe(121.0);
    expect(getRiskBand(r2.heatIndexF).band).toBe('danger');

    // 90°F / 70% -> 105.9°F (≈ 106°F), Danger
    const r3 = calculateHeatIndex(90, 70);
    expect(roundToOneDecimal(r3.heatIndexF)).toBe(105.9);
    expect(getRiskBand(r3.heatIndexF).band).toBe('danger');

    // 90°F / 50% -> 94.6°F (≈ 95°F), Extreme Caution (FAQ Q6 verified value)
    const r4 = calculateHeatIndex(90, 50);
    expect(roundToOneDecimal(r4.heatIndexF)).toBe(94.6);
    expect(getRiskBand(r4.heatIndexF).band).toBe('extreme-caution');
  });

  it('handles Celsius round-trip and lower-temperature simple NWS method', () => {
    // 32°C / 60% -> 89.6°F -> 98.7°F = 37.1°C, Extreme Caution
    const c1 = calculateHeatIndexFromCelsius(32, 60);
    expect(roundToOneDecimal(c1.airTempF)).toBe(89.6);
    expect(roundToOneDecimal(c1.heatIndexF)).toBe(98.7);
    expect(roundToOneDecimal(c1.heatIndexC)).toBe(37.1);
    expect(c1.method).toBe('rothfusz');
    expect(getRiskBand(c1.heatIndexF).band).toBe('extreme-caution');

    // 25°C / 50% -> 77°F -> simple method -> 76.9°F = 24.9°C, below Caution
    const simple77 = heatIndexSimple(77, 50);
    expect(roundToOneDecimal(simple77)).toBe(76.8);
    const c2 = calculateHeatIndexFromCelsius(25, 50);
    expect(roundToOneDecimal(c2.airTempF)).toBe(77.0);
    expect(roundToOneDecimal(c2.heatIndexF)).toBe(76.9);
    expect(roundToOneDecimal(c2.heatIndexC)).toBe(24.9);
    expect(c2.method).toBe('simple');
    expect(getRiskBand(c2.heatIndexF).band).toBe('below-caution');
  });

  it('applies NWS low-humidity and high-humidity adjustments properly', () => {
    // 100°F / 10% -> raw ~94.75°F, low-humidity adj -0.63 -> 94.1°F
    const rawLow = rothfuszRegression(100, 10);
    const adjLow = lowHumidityAdjustment(100, 10);
    expect(roundToOneDecimal(rawLow)).toBe(94.8);
    expect(adjLow).toBeCloseTo(0.63, 2);
    const resLow = calculateHeatIndex(100, 10);
    expect(resLow.lowHumidityAdjustmentApplied).toBe(true);
    expect(resLow.highHumidityAdjustmentApplied).toBe(false);
    expect(roundToOneDecimal(resLow.heatIndexF)).toBe(94.1);

    // 100°F / 0% -> adj -2.73 -> 91.4°F
    const adjZero = lowHumidityAdjustment(100, 0);
    expect(adjZero).toBeCloseTo(2.73, 2);
    const resZero = calculateHeatIndex(100, 0);
    expect(resZero.lowHumidityAdjustmentApplied).toBe(true);
    expect(roundToOneDecimal(resZero.heatIndexF)).toBe(91.4);

    // 85°F / 90% -> raw ~101.58°F, high-humidity adj +0.20 -> 101.8°F
    const rawHigh = rothfuszRegression(85, 90);
    const adjHigh = highHumidityAdjustment(85, 90);
    expect(roundToOneDecimal(rawHigh)).toBe(101.6);
    expect(adjHigh).toBeCloseTo(0.2, 2);
    const resHigh = calculateHeatIndex(85, 90);
    expect(resHigh.highHumidityAdjustmentApplied).toBe(true);
    expect(resHigh.lowHumidityAdjustmentApplied).toBe(false);
    expect(roundToOneDecimal(resHigh.heatIndexF)).toBe(101.8);

    // 100°F / 100% -> 195.3°F, Extreme Danger
    const resMax = calculateHeatIndex(100, 100);
    expect(roundToOneDecimal(resMax.heatIndexF)).toBe(195.3);
    expect(getRiskBand(resMax.heatIndexF).band).toBe('extreme-danger');
  });

  it('matches threshold boundaries at 90°F and risk band cutoffs', () => {
    expect(Math.abs(calculateHeatIndex(90, 38).heatIndexF - 90)).toBeLessThanOrEqual(1);
    expect(Math.abs(calculateHeatIndex(90, 66).heatIndexF - 103)).toBeLessThanOrEqual(1);
    expect(Math.abs(calculateHeatIndex(90, 93).heatIndexF - 125)).toBeLessThanOrEqual(1);

    expect(getRiskBand(79.9).band).toBe('below-caution');
    expect(getRiskBand(80).band).toBe('caution');
    expect(getRiskBand(89.9).band).toBe('caution');
    expect(getRiskBand(90).band).toBe('extreme-caution');
    expect(getRiskBand(102.9).band).toBe('extreme-caution');
    expect(getRiskBand(103).band).toBe('danger');
    expect(getRiskBand(124.9).band).toBe('danger');
    expect(getRiskBand(125).band).toBe('extreme-danger');

    // Celsius thresholds dynamically converted from 80, 90, 103, 125°F
    const rows = getRiskThresholdRows();
    expect(rows[0].rangeC).toContain('26.7°C');
    expect(rows[1].rangeC).toContain('32.2°C');
    expect(rows[2].rangeC).toContain('39.4°C');
    expect(rows[3].rangeC).toContain('51.7°C');
  });

  it('keeps Fahrenheit and Celsius switching consistent for identical physical conditions', () => {
    const fromF = calculateHeatIndex(95, 60);
    const fromC = calculateHeatIndexFromCelsius(fahrenheitToCelsius(95), 60);
    expect(Math.abs(fromF.heatIndexF - fromC.heatIndexF)).toBeLessThan(0.01);
    expect(Math.abs(fromF.heatIndexC - fromC.heatIndexC)).toBeLessThan(0.01);
  });

  it('throws clear errors and rejects invalid inputs', () => {
    expect(() => calculateHeatIndex(90, -5)).toThrow(/between 0% and 100%/i);
    expect(() => calculateHeatIndex(90, 105)).toThrow(/between 0% and 100%/i);
    expect(() => calculateHeatIndex(Number.NaN, 50)).toThrow(/valid finite numeric temperature/i);
    expect(() => calculateHeatIndex(90, Number.POSITIVE_INFINITY)).toThrow(/valid finite numeric relative humidity/i);

    expect(parseHeatIndexInputs('', '50').valid).toBe(false);
    expect(parseHeatIndexInputs('90', '').valid).toBe(false);
    expect(parseHeatIndexInputs('abc', '50').valid).toBe(false);
    expect(parseHeatIndexInputs('90', 'xyz').valid).toBe(false);
    expect(parseHeatIndexInputs('90', '-5').valid).toBe(false);
    expect(parseHeatIndexInputs('90', '105').valid).toBe(false);
  });
});
