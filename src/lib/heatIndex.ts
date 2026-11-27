export type TemperatureUnit = 'F' | 'C';

export type HeatIndexMethod = 'simple' | 'rothfusz';

export type HeatRiskBandId =
  | 'below-caution'
  | 'caution'
  | 'extreme-caution'
  | 'danger'
  | 'extreme-danger';

export interface HeatIndexResult {
  airTempF: number;
  airTempC: number;
  relativeHumidity: number;
  heatIndexF: number;
  heatIndexC: number;
  differenceF: number;
  differenceC: number;
  method: HeatIndexMethod;
  lowHumidityAdjustmentApplied: boolean;
  highHumidityAdjustmentApplied: boolean;
  rawRothfuszF: number | null;
  adjustmentF: number;
  outsideStandardRange: boolean;
  rangeNote: string | null;
}

export interface HeatRiskBandInfo {
  band: HeatRiskBandId;
  label: string;
  explanation: string;
  thresholdLabelF: string;
  thresholdLabelC: string;
}

export const HEAT_INDEX_SAFETY_DISCLAIMER =
  'This calculator provides an estimated heat index based on entered air temperature and relative humidity. Standard heat-index calculations assume shaded conditions with light wind and do not fully account for direct sunlight, wind, clothing, activity level, or individual health factors. For local alerts and safety decisions, consult official weather authorities.';

export const HEAT_INDEX_REFERENCES: ReadonlyArray<{ label: string; url: string }> = [
  {
    label: 'NWS Heat Index Safety & Reference Chart',
    url: 'https://www.weather.gov/safety/heat-index',
  },
  {
    label: 'NWS Heat Safety Overview',
    url: 'https://www.weather.gov/ctp/heat',
  },
  {
    label: 'NWS Heat Index Equation & Methodology',
    url: 'https://www.weather.gov/epz/wxcalc_heatindex',
  },
];

export function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

export function celsiusToFahrenheit(c: number): number {
  if (!Number.isFinite(c)) {
    throw new Error('Celsius temperature must be a finite number.');
  }
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  if (!Number.isFinite(f)) {
    throw new Error('Fahrenheit temperature must be a finite number.');
  }
  return ((f - 32) * 5) / 9;
}

export function heatIndexSimple(tempF: number, rh: number): number {
  validateNumericInputs(tempF, rh);
  return 0.5 * (tempF + 61.0 + (tempF - 68.0) * 1.2 + rh * 0.094);
}

export function rothfuszRegression(tempF: number, rh: number): number {
  validateNumericInputs(tempF, rh);
  const T = tempF;
  const RH = rh;
  return (
    -42.379 +
    2.04901523 * T +
    10.14333127 * RH -
    0.22475541 * T * RH -
    0.00683783 * T * T -
    0.05481717 * RH * RH +
    0.00122874 * T * T * RH +
    0.00085282 * T * RH * RH -
    0.00000199 * T * T * RH * RH
  );
}

export function lowHumidityAdjustment(tempF: number, rh: number): number {
  validateNumericInputs(tempF, rh);
  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    return ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
  }
  return 0;
}

export function highHumidityAdjustment(tempF: number, rh: number): number {
  validateNumericInputs(tempF, rh);
  if (rh > 85 && tempF >= 80 && tempF <= 87) {
    return ((rh - 85) / 10) * ((87 - tempF) / 5);
  }
  return 0;
}

function validateNumericInputs(tempF: number, rh: number): void {
  if (typeof tempF !== 'number' || Number.isNaN(tempF) || !Number.isFinite(tempF)) {
    throw new Error('Please enter a valid finite numeric temperature.');
  }
  if (typeof rh !== 'number' || Number.isNaN(rh) || !Number.isFinite(rh)) {
    throw new Error('Please enter a valid finite numeric relative humidity.');
  }
  if (rh < 0 || rh > 100) {
    throw new Error('Relative humidity must be between 0% and 100%.');
  }
}

export function parseHeatIndexInputs(
  tempRaw: string,
  rhRaw: string,
): { valid: true; temp: number; rh: number } | { valid: false; error: string } {
  const tTrim = tempRaw.trim();
  const rhTrim = rhRaw.trim();

  if (!tTrim) {
    return { valid: false, error: 'Please enter an air temperature.' };
  }
  if (!rhTrim) {
    return { valid: false, error: 'Please enter a relative humidity percentage (0–100%).' };
  }

  const numberPattern = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;
  if (!numberPattern.test(tTrim)) {
    return {
      valid: false,
      error: 'Air temperature must be a valid numeric value (for example, 95 or 30).',
    };
  }
  if (!numberPattern.test(rhTrim)) {
    return {
      valid: false,
      error: 'Relative humidity must be a valid numeric percentage between 0 and 100.',
    };
  }

  const temp = Number(tTrim);
  const rh = Number(rhTrim);

  if (!Number.isFinite(temp)) {
    return { valid: false, error: 'Air temperature must be a finite number.' };
  }
  if (!Number.isFinite(rh) || rh < 0 || rh > 100) {
    return {
      valid: false,
      error: 'Relative humidity must be between 0% and 100%.',
    };
  }

  return { valid: true, temp, rh };
}

function getApplicabilityNote(tempF: number, rh: number, method: HeatIndexMethod): {
  outsideStandardRange: boolean;
  rangeNote: string | null;
} {
  if (tempF < 80 && method === 'simple') {
    return {
      outsideStandardRange: true,
      rangeNote:
        'Air temperature is below the 80°F (26.7°C) standard Rothfusz threshold, so the NWS preliminary simple approximation averaged with air temperature was used.',
    };
  }
  if (tempF > 110) {
    return {
      outsideStandardRange: true,
      rangeNote:
        'Air temperature exceeds 110°F (43.3°C), beyond standard NWS heat index table coverage; the Rothfusz regression is extrapolated mathematically.',
    };
  }
  if (tempF >= 80 && rh < 40) {
    return {
      outsideStandardRange: false,
      rangeNote:
        rh < 13 && tempF <= 112
          ? 'Relative humidity is below 13% in the 80°F–112°F band; the NWS low-humidity subtraction adjustment was applied.'
          : null,
    };
  }
  if (tempF >= 80 && tempF <= 87 && rh > 85) {
    return {
      outsideStandardRange: false,
      rangeNote:
        'Relative humidity exceeds 85% in the 80°F–87°F band; the NWS high-humidity addition adjustment was applied.',
    };
  }
  return { outsideStandardRange: false, rangeNote: null };
}

export function calculateHeatIndex(tempF: number, rh: number): HeatIndexResult {
  validateNumericInputs(tempF, rh);

  const airTempC = fahrenheitToCelsius(tempF);
  const hiSimple = heatIndexSimple(tempF, rh);
  const hiAvg = (hiSimple + tempF) / 2;

  if (hiAvg < 80) {
    const heatIndexF = hiAvg;
    const heatIndexC = fahrenheitToCelsius(heatIndexF);
    const { outsideStandardRange, rangeNote } = getApplicabilityNote(tempF, rh, 'simple');
    return {
      airTempF: tempF,
      airTempC,
      relativeHumidity: rh,
      heatIndexF,
      heatIndexC,
      differenceF: heatIndexF - tempF,
      differenceC: heatIndexC - airTempC,
      method: 'simple',
      lowHumidityAdjustmentApplied: false,
      highHumidityAdjustmentApplied: false,
      rawRothfuszF: null,
      adjustmentF: 0,
      outsideStandardRange,
      rangeNote,
    };
  }

  const rawRothfusz = rothfuszRegression(tempF, rh);
  const lowAdj = lowHumidityAdjustment(tempF, rh);
  const highAdj = highHumidityAdjustment(tempF, rh);
  const lowApplied = rh < 13 && tempF >= 80 && tempF <= 112;
  const highApplied = rh > 85 && tempF >= 80 && tempF <= 87;

  const heatIndexF = rawRothfusz - lowAdj + highAdj;
  const heatIndexC = fahrenheitToCelsius(heatIndexF);
  const { outsideStandardRange, rangeNote } = getApplicabilityNote(tempF, rh, 'rothfusz');

  return {
    airTempF: tempF,
    airTempC,
    relativeHumidity: rh,
    heatIndexF,
    heatIndexC,
    differenceF: heatIndexF - tempF,
    differenceC: heatIndexC - airTempC,
    method: 'rothfusz',
    lowHumidityAdjustmentApplied: lowApplied,
    highHumidityAdjustmentApplied: highApplied,
    rawRothfuszF: rawRothfusz,
    adjustmentF: highAdj - lowAdj,
    outsideStandardRange,
    rangeNote,
  };
}

export function calculateHeatIndexFromCelsius(tempC: number, rh: number): HeatIndexResult {
  if (typeof tempC !== 'number' || Number.isNaN(tempC) || !Number.isFinite(tempC)) {
    throw new Error('Please enter a valid finite numeric Celsius temperature.');
  }
  const tempF = celsiusToFahrenheit(tempC);
  return calculateHeatIndex(tempF, rh);
}

export const RISK_BAND_THRESHOLDS_F = {
  cautionMin: 80,
  extremeCautionMin: 90,
  dangerMin: 103,
  extremeDangerMin: 125,
} as const;

export function getRiskThresholdRows(): ReadonlyArray<{
  band: HeatRiskBandId;
  label: string;
  rangeF: string;
  rangeC: string;
  guidance: string;
}> {
  const c80 = roundToOneDecimal(fahrenheitToCelsius(80)).toFixed(1);
  const c90 = roundToOneDecimal(fahrenheitToCelsius(90)).toFixed(1);
  const c103 = roundToOneDecimal(fahrenheitToCelsius(103)).toFixed(1);
  const c125 = roundToOneDecimal(fahrenheitToCelsius(125)).toFixed(1);

  return [
    {
      band: 'caution',
      label: 'Caution',
      rangeF: '80°F – <90°F',
      rangeC: `${c80}°C – <${c90}°C`,
      guidance: 'Fatigue is possible when spending extended periods outdoors or doing physical work.',
    },
    {
      band: 'extreme-caution',
      label: 'Extreme Caution',
      rangeF: '90°F – <103°F',
      rangeC: `${c90}°C – <${c103}°C`,
      guidance:
        'Heat-related strain such as sunstroke, muscle cramps, or heat exhaustion becomes more concerning with ongoing activity.',
    },
    {
      band: 'danger',
      label: 'Danger',
      rangeF: '103°F – <125°F',
      rangeC: `${c103}°C – <${c125}°C`,
      guidance:
        'The risk of heat cramps and heat exhaustion rises substantially, and heat stroke becomes likely during strenuous or prolonged exposure.',
    },
    {
      band: 'extreme-danger',
      label: 'Extreme Danger',
      rangeF: '125°F and above',
      rangeC: `${c125}°C and above`,
      guidance:
        'Severe heat illness and heat stroke risk is very high. Move to a cool shaded or air-conditioned space immediately and seek urgent medical help if anyone develops symptoms of heat stroke.',
    },
  ];
}

export function getRiskBand(heatIndexF: number): HeatRiskBandInfo {
  if (!Number.isFinite(heatIndexF)) {
    throw new Error('Heat index value must be finite to determine risk band.');
  }

  const c80 = roundToOneDecimal(fahrenheitToCelsius(80)).toFixed(1);
  const c90 = roundToOneDecimal(fahrenheitToCelsius(90)).toFixed(1);
  const c103 = roundToOneDecimal(fahrenheitToCelsius(103)).toFixed(1);
  const c125 = roundToOneDecimal(fahrenheitToCelsius(125)).toFixed(1);

  if (heatIndexF < 80) {
    return {
      band: 'below-caution',
      label: 'Below Caution',
      explanation:
        'Apparent temperature is under the 80°F (26.7°C) Caution threshold, where standard NWS heat-stress warning tiers begin.',
      thresholdLabelF: '< 80°F',
      thresholdLabelC: `< ${c80}°C`,
    };
  }

  if (heatIndexF < 90) {
    return {
      band: 'caution',
      label: 'Caution',
      explanation:
        'Fatigue may develop during prolonged outdoor exposure or sustained physical activity. Take water and shade breaks.',
      thresholdLabelF: '80°F to <90°F',
      thresholdLabelC: `${c80}°C to <${c90}°C`,
    };
  }

  if (heatIndexF < 103) {
    return {
      band: 'extreme-caution',
      label: 'Extreme Caution',
      explanation:
        'Heat exhaustion, cramps, and heat-related illness become a greater concern during prolonged exposure or exertion. Pace activity and hydrate regularly.',
      thresholdLabelF: '90°F to <103°F',
      thresholdLabelC: `${c90}°C to <${c103}°C`,
    };
  }

  if (heatIndexF < 125) {
    return {
      band: 'danger',
      label: 'Danger',
      explanation:
        'The likelihood of heat cramps, heat exhaustion, and heat stroke increases sharply, especially with sustained sun exposure or strenuous exertion.',
      thresholdLabelF: '103°F to <125°F',
      thresholdLabelC: `${c103}°C to <${c125}°C`,
    };
  }

  return {
    band: 'extreme-danger',
    label: 'Extreme Danger',
    explanation:
      'The risk of severe heat-related illness and heat stroke is very high. Seek a cool environment right away and get urgent medical care immediately if someone shows signs of heat stroke.',
    thresholdLabelF: '125°F and above',
    thresholdLabelC: `${c125}°C and above`,
  };
}
