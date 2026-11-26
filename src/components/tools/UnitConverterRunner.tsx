import React, {useState, useMemo} from 'react';
import {Copy, Check, ArrowRightLeft, Scale, AlertCircle, Sparkles, BookOpen} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

// Definition of a unit with conversion to a base unit
interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (b: number) => number;
}

interface UnitCategoryConfig {
  name: string;
  defaultFrom: string;
  defaultTo: string;
  units: UnitDef[];
  formulaDesc?: (from: UnitDef, to: UnitDef, val: number, res: number) => string;
}

// Speed of light in vacuum (m/s)
const SPEED_OF_LIGHT = 299792458;
// Planck's constant in eV*s
const PLANCK_EV_S = 4.135667696e-15;

export function UnitConverterRunner({tool}: Props) {
  const slug = tool.slug;

  // Render specialized sub-runners if tool requires compound or non-linear fields
  if (slug === 'unit-cm-to-feet-and-inches-converter') {
    return <CmToFeetInchesRunner tool={tool} />;
  }
  if (slug === 'unit-feet-and-inches-to-cm-converter') {
    return <FeetInchesToCmRunner tool={tool} />;
  }
  if (slug === 'unit-scale-model-conversion-calculator') {
    return <ScaleModelRunner tool={tool} />;
  }
  if (slug === 'unit-frequency-wavelength-converter') {
    return <FrequencyWavelengthRunner tool={tool} />;
  }
  if (slug === 'unit-fuel-efficiency-converter') {
    return <FuelEfficiencyRunner tool={tool} />;
  }

  return <StandardUnitConverter slug={slug} tool={tool} />;
}

// =========================================================================
// 1. STANDARD CONFIGURATION MAPPINGS FOR ALL OTHER 48 CONVERTERS
// =========================================================================
function getToolConfig(slug: string): {
  title: string;
  categories?: {id: string; name: string}[];
  activeCategory?: string;
  defaultAmount?: string;
  defaultFrom: string;
  defaultTo: string;
  units: UnitDef[];
} {
  // 1. Temperature pair converters
  if (slug === 'unit-celsius-to-fahrenheit-converter') {
    return {
      title: 'Celsius to Fahrenheit',
      defaultAmount: '100',
      defaultFrom: 'c',
      defaultTo: 'f',
      units: [
        {id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (b) => b},
        {id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32},
        {id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15},
      ],
    };
  }
  if (slug === 'unit-fahrenheit-to-celsius-converter') {
    return {
      title: 'Fahrenheit to Celsius',
      defaultAmount: '212',
      defaultFrom: 'f',
      defaultTo: 'c',
      units: [
        {id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32},
        {id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (b) => b},
        {id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15},
      ],
    };
  }
  if (slug === 'unit-temperature-converter') {
    return {
      title: 'Temperature Converter',
      defaultAmount: '100',
      defaultFrom: 'c',
      defaultTo: 'f',
      units: [
        {id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (b) => b},
        {id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32},
        {id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15},
        {id: 'r', name: 'Rankine', symbol: '°R', toBase: (v) => ((v - 491.67) * 5) / 9, fromBase: (b) => ((b + 273.15) * 9) / 5},
      ],
    };
  }

  // 2. Length & Distance
  if (slug === 'unit-km-to-miles-converter') {
    return {
      title: 'Kilometers to Miles',
      defaultAmount: '1',
      defaultFrom: 'km',
      defaultTo: 'mi',
      units: [
        {id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344},
        {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
      ],
    };
  }
  if (slug === 'unit-miles-to-km-converter') {
    return {
      title: 'Miles to Kilometers',
      defaultAmount: '1',
      defaultFrom: 'mi',
      defaultTo: 'km',
      units: [
        {id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344},
        {id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
      ],
    };
  }
  if (slug === 'unit-cm-to-inches-converter') {
    return {
      title: 'Centimeters to Inches',
      defaultAmount: '10',
      defaultFrom: 'cm',
      defaultTo: 'in',
      units: [
        {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01},
        {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254},
        {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
        {id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
      ],
    };
  }
  if (slug === 'unit-inches-to-cm-converter') {
    return {
      title: 'Inches to Centimeters',
      defaultAmount: '1',
      defaultFrom: 'in',
      defaultTo: 'cm',
      units: [
        {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254},
        {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01},
        {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
      ],
    };
  }
  if (slug === 'unit-inches-to-mm-converter') {
    return {
      title: 'Inches to Millimeters',
      defaultAmount: '1',
      defaultFrom: 'in',
      defaultTo: 'mm',
      units: [
        {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 25.4, fromBase: (b) => b / 25.4},
        {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 10, fromBase: (b) => b / 10},
      ],
    };
  }
  if (slug === 'unit-mm-to-inches-converter') {
    return {
      title: 'Millimeters to Inches',
      defaultAmount: '25.4',
      defaultFrom: 'mm',
      defaultTo: 'in',
      units: [
        {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 25.4, fromBase: (b) => b / 25.4},
        {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 10, fromBase: (b) => b / 10},
      ],
    };
  }
  if (slug === 'unit-feet-to-meters-converter') {
    return {
      title: 'Feet to Meters',
      defaultAmount: '1',
      defaultFrom: 'ft',
      defaultTo: 'm',
      units: [
        {id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
        {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144},
      ],
    };
  }
  if (slug === 'unit-meters-to-feet-converter') {
    return {
      title: 'Meters to Feet',
      defaultAmount: '1',
      defaultFrom: 'm',
      defaultTo: 'ft',
      units: [
        {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
        {id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144},
      ],
    };
  }
  if (slug === 'unit-length-converter') {
    return {
      title: 'Length & Distance Converter',
      defaultAmount: '1',
      defaultFrom: 'm',
      defaultTo: 'ft',
      units: [
        {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01},
        {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
        {id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344},
        {id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144},
        {id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
        {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254},
        {id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (b) => b / 1852},
      ],
    };
  }
  if (slug === 'unit-astronomical-unit-converter') {
    return {
      title: 'Astronomical Unit Converter',
      defaultAmount: '1',
      defaultFrom: 'au',
      defaultTo: 'km',
      units: [
        {id: 'au', name: 'Astronomical Units', symbol: 'AU', toBase: (v) => v * 149597870700, fromBase: (b) => b / 149597870700},
        {id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344},
        {id: 'ly', name: 'Light-Years', symbol: 'ly', toBase: (v) => v * 9.4607304725808e15, fromBase: (b) => b / 9.4607304725808e15},
        {id: 'pc', name: 'Parsecs', symbol: 'pc', toBase: (v) => v * 3.08567758149137e16, fromBase: (b) => b / 3.08567758149137e16},
        {id: 'ld', name: 'Lunar Distances', symbol: 'LD', toBase: (v) => v * 384400000, fromBase: (b) => b / 384400000},
      ],
    };
  }

  // 3. Weight & Mass
  if (slug === 'unit-kg-to-lbs-converter') {
    return {
      title: 'Kilograms to Pounds',
      defaultAmount: '1',
      defaultFrom: 'kg',
      defaultTo: 'lbs',
      units: [
        {id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b},
        {id: 'lbs', name: 'Pounds', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237},
        {id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
        {id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125},
      ],
    };
  }
  if (slug === 'unit-lbs-to-kg-converter') {
    return {
      title: 'Pounds to Kilograms',
      defaultAmount: '1',
      defaultFrom: 'lbs',
      defaultTo: 'kg',
      units: [
        {id: 'lbs', name: 'Pounds', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237},
        {id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b},
        {id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125},
        {id: 'stone', name: 'Stones', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (b) => b / 6.35029318},
      ],
    };
  }
  if (slug === 'unit-weight-converter') {
    return {
      title: 'Weight (Mass) Converter',
      defaultAmount: '1',
      defaultFrom: 'kg',
      defaultTo: 'lbs',
      units: [
        {id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b},
        {id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
        {id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6},
        {id: 'lbs', name: 'Pounds', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237},
        {id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125},
        {id: 'tola', name: 'Tola (South Asia)', symbol: 'tola', toBase: (v) => v * 0.0116638, fromBase: (b) => b / 0.0116638},
        {id: 'quintal', name: 'Quintal', symbol: 'q', toBase: (v) => v * 100, fromBase: (b) => b / 100},
        {id: 'ton', name: 'Metric Tonne', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'stone', name: 'Stone (UK)', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (b) => b / 6.35029318},
      ],
    };
  }

  // 4. Land Area Pairs (All 14 Land Area addition pair tools)
  if (slug === 'acres-to-square-feet-converter') {
    return {
      title: 'Acres to Square Feet',
      defaultAmount: '1',
      defaultFrom: 'acre',
      defaultTo: 'sq_ft',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 43560, fromBase: (b) => b / 43560},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v * 10.76391041671, fromBase: (b) => b / 10.76391041671},
        {id: 'hectare', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 107639.1041671, fromBase: (b) => b / 107639.1041671},
      ],
    };
  }
  if (slug === 'square-feet-to-acres-converter') {
    return {
      title: 'Square Feet to Acres',
      defaultAmount: '43560',
      defaultFrom: 'sq_ft',
      defaultTo: 'acre',
      units: [
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v, fromBase: (b) => b},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 43560, fromBase: (b) => b / 43560},
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v * 10.76391041671, fromBase: (b) => b / 10.76391041671},
      ],
    };
  }
  if (slug === 'acres-to-hectares-converter') {
    return {
      title: 'Acres to Hectares',
      defaultAmount: '1',
      defaultFrom: 'acre',
      defaultTo: 'ha',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224},
        {id: 'ha', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304},
      ],
    };
  }
  if (slug === 'hectares-to-acres-converter') {
    return {
      title: 'Hectares to Acres',
      defaultAmount: '1',
      defaultFrom: 'ha',
      defaultTo: 'acre',
      units: [
        {id: 'ha', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224},
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b},
      ],
    };
  }
  if (slug === 'acres-to-square-meters-converter') {
    return {
      title: 'Acres to Square Meters',
      defaultAmount: '1',
      defaultFrom: 'acre',
      defaultTo: 'sq_m',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224},
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304},
      ],
    };
  }
  if (slug === 'square-meters-to-acres-converter') {
    return {
      title: 'Square Meters to Acres',
      defaultAmount: '4046.86',
      defaultFrom: 'sq_m',
      defaultTo: 'acre',
      units: [
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304},
      ],
    };
  }
  if (slug === 'acres-to-square-yards-converter') {
    return {
      title: 'Acres to Square Yards',
      defaultAmount: '1',
      defaultFrom: 'acre',
      defaultTo: 'sq_yd',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4840, fromBase: (b) => b / 4840},
        {id: 'sq_yd', name: 'Square Yards', symbol: 'sq yd', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v / 9, fromBase: (b) => b * 9},
      ],
    };
  }
  if (slug === 'square-yards-to-acres-converter') {
    return {
      title: 'Square Yards to Acres',
      defaultAmount: '4840',
      defaultFrom: 'sq_yd',
      defaultTo: 'acre',
      units: [
        {id: 'sq_yd', name: 'Square Yards', symbol: 'sq yd', toBase: (v) => v, fromBase: (b) => b},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4840, fromBase: (b) => b / 4840},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v / 9, fromBase: (b) => b * 9},
      ],
    };
  }
  if (slug === 'acres-to-square-miles-converter') {
    return {
      title: 'Acres to Square Miles',
      defaultAmount: '640',
      defaultFrom: 'acre',
      defaultTo: 'sq_mi',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_mi', name: 'Square Miles', symbol: 'sq mi', toBase: (v) => v * 640, fromBase: (b) => b / 640},
        {id: 'sq_km', name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 247.105381, fromBase: (b) => b / 247.105381},
      ],
    };
  }
  if (slug === 'square-miles-to-acres-converter') {
    return {
      title: 'Square Miles to Acres',
      defaultAmount: '1',
      defaultFrom: 'sq_mi',
      defaultTo: 'acre',
      units: [
        {id: 'sq_mi', name: 'Square Miles', symbol: 'sq mi', toBase: (v) => v * 640, fromBase: (b) => b / 640},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v, fromBase: (b) => b},
      ],
    };
  }
  if (slug === 'acres-to-perches-converter') {
    return {
      title: 'Acres to Perches',
      defaultAmount: '1',
      defaultFrom: 'acre',
      defaultTo: 'perch',
      units: [
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 160, fromBase: (b) => b / 160},
        {id: 'perch', name: 'Perches', symbol: 'perch', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v / 272.25, fromBase: (b) => b * 272.25},
      ],
    };
  }
  if (slug === 'perches-to-acres-converter') {
    return {
      title: 'Perches to Acres',
      defaultAmount: '160',
      defaultFrom: 'perch',
      defaultTo: 'acre',
      units: [
        {id: 'perch', name: 'Perches', symbol: 'perch', toBase: (v) => v, fromBase: (b) => b},
        {id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 160, fromBase: (b) => b / 160},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v / 272.25, fromBase: (b) => b * 272.25},
      ],
    };
  }
  if (slug === 'square-feet-to-square-meters-converter') {
    return {
      title: 'Square Feet to Square Meters',
      defaultAmount: '100',
      defaultFrom: 'sq_ft',
      defaultTo: 'sq_m',
      units: [
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304},
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_yd', name: 'Square Yards', symbol: 'sq yd', toBase: (v) => v * 0.83612736, fromBase: (b) => b / 0.83612736},
      ],
    };
  }
  if (slug === 'square-meters-to-square-feet-converter') {
    return {
      title: 'Square Meters to Square Feet',
      defaultAmount: '10',
      defaultFrom: 'sq_m',
      defaultTo: 'sq_ft',
      units: [
        {id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b},
        {id: 'sq_ft', name: 'Square Feet', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304},
        {id: 'sq_yd', name: 'Square Yards', symbol: 'sq yd', toBase: (v) => v * 0.83612736, fromBase: (b) => b / 0.83612736},
      ],
    };
  }

  // 5. Speed Converters
  if (slug === 'unit-mph-to-kmh-converter') {
    return {
      title: 'MPH to KMH',
      defaultAmount: '60',
      defaultFrom: 'mph',
      defaultTo: 'kmh',
      units: [
        {id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: (v) => v * 1.609344, fromBase: (b) => b / 1.609344},
        {id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v, fromBase: (b) => b},
        {id: 'knot', name: 'Knots', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (b) => b / 1.852},
        {id: 'ms', name: 'Meters per second', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (b) => b / 3.6},
      ],
    };
  }
  if (slug === 'unit-knots-to-mph-converter') {
    return {
      title: 'Knots to MPH',
      defaultAmount: '10',
      defaultFrom: 'knot',
      defaultTo: 'mph',
      units: [
        {id: 'knot', name: 'Knots', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (b) => b / 1.852},
        {id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: (v) => v * 1.609344, fromBase: (b) => b / 1.609344},
        {id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v, fromBase: (b) => b},
        {id: 'ms', name: 'Meters per second', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (b) => b / 3.6},
      ],
    };
  }
  if (slug === 'unit-speed-converter') {
    return {
      title: 'Speed Converter',
      defaultAmount: '100',
      defaultFrom: 'kmh',
      defaultTo: 'mph',
      units: [
        {id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6},
        {id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: (v) => (v * 1609.344) / 3600, fromBase: (b) => (b * 3600) / 1609.344},
        {id: 'ms', name: 'Meters per second', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b},
        {id: 'knot', name: 'Knots', symbol: 'kn', toBase: (v) => (v * 1852) / 3600, fromBase: (b) => (b * 3600) / 1852},
        {id: 'fts', name: 'Feet per second', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
        {id: 'mach', name: 'Mach (std air)', symbol: 'Ma', toBase: (v) => v * 340.29, fromBase: (b) => b / 340.29},
      ],
    };
  }

  // 6. Pressure Converters
  if (slug === 'unit-bar-to-psi-converter') {
    return {
      title: 'Bar to PSI',
      defaultAmount: '1',
      defaultFrom: 'bar',
      defaultTo: 'psi',
      units: [
        {id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000},
        {id: 'psi', name: 'Pounds per sq inch', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (b) => b / 6894.75729},
        {id: 'kpa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'atm', name: 'Atmospheres', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (b) => b / 101325},
      ],
    };
  }
  if (slug === 'unit-psi-to-bar-converter') {
    return {
      title: 'PSI to Bar',
      defaultAmount: '14.5038',
      defaultFrom: 'psi',
      defaultTo: 'bar',
      units: [
        {id: 'psi', name: 'Pounds per sq inch', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (b) => b / 6894.75729},
        {id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000},
        {id: 'kpa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
      ],
    };
  }
  if (slug === 'unit-kpa-to-psi-converter') {
    return {
      title: 'kPa to PSI',
      defaultAmount: '100',
      defaultFrom: 'kpa',
      defaultTo: 'psi',
      units: [
        {id: 'kpa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'psi', name: 'Pounds per sq inch', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (b) => b / 6894.75729},
        {id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000},
      ],
    };
  }
  if (slug === 'unit-psi-to-kpa-converter') {
    return {
      title: 'PSI to kPa',
      defaultAmount: '1',
      defaultFrom: 'psi',
      defaultTo: 'kpa',
      units: [
        {id: 'psi', name: 'Pounds per sq inch', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (b) => b / 6894.75729},
        {id: 'kpa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000},
      ],
    };
  }
  if (slug === 'unit-pressure-converter') {
    return {
      title: 'Pressure Converter',
      defaultAmount: '1',
      defaultFrom: 'bar',
      defaultTo: 'psi',
      units: [
        {id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000},
        {id: 'psi', name: 'Pounds per sq in (psi)', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (b) => b / 6894.75729},
        {id: 'pa', name: 'Pascals', symbol: 'Pa', toBase: (v) => v, fromBase: (b) => b},
        {id: 'kpa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mpa', name: 'Megapascals', symbol: 'MPa', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6},
        {id: 'atm', name: 'Atmospheres', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (b) => b / 101325},
        {id: 'torr', name: 'Torr (mmHg)', symbol: 'Torr', toBase: (v) => v * 133.322368, fromBase: (b) => b / 133.322368},
        {id: 'inhg', name: 'Inches of Mercury', symbol: 'inHg', toBase: (v) => v * 3386.389, fromBase: (b) => b / 3386.389},
      ],
    };
  }

  // 7. PPM & Percent
  if (slug === 'unit-percent-to-ppm-converter') {
    return {
      title: 'Percent to PPM',
      defaultAmount: '1',
      defaultFrom: 'pct',
      defaultTo: 'ppm',
      units: [
        {id: 'pct', name: 'Percentage (%)', symbol: '%', toBase: (v) => v * 10000, fromBase: (b) => b / 10000},
        {id: 'ppm', name: 'Parts per million', symbol: 'ppm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'ppb', name: 'Parts per billion', symbol: 'ppb', toBase: (v) => v / 1000, fromBase: (b) => b * 1000},
      ],
    };
  }
  if (slug === 'unit-ppm-to-percent-converter') {
    return {
      title: 'PPM to Percent',
      defaultAmount: '10000',
      defaultFrom: 'ppm',
      defaultTo: 'pct',
      units: [
        {id: 'ppm', name: 'Parts per million', symbol: 'ppm', toBase: (v) => v, fromBase: (b) => b},
        {id: 'pct', name: 'Percentage (%)', symbol: '%', toBase: (v) => v * 10000, fromBase: (b) => b / 10000},
        {id: 'ppb', name: 'Parts per billion', symbol: 'ppb', toBase: (v) => v / 1000, fromBase: (b) => b * 1000},
      ],
    };
  }

  // 8. Physical & Engineering Converters
  if (slug === 'unit-angle-converter') {
    return {
      title: 'Angle Converter',
      defaultAmount: '90',
      defaultFrom: 'deg',
      defaultTo: 'rad',
      units: [
        {id: 'deg', name: 'Degrees', symbol: '°', toBase: (v) => (v * Math.PI) / 180, fromBase: (b) => (b * 180) / Math.PI},
        {id: 'rad', name: 'Radians', symbol: 'rad', toBase: (v) => v, fromBase: (b) => b},
        {id: 'grad', name: 'Gradians', symbol: 'grad', toBase: (v) => (v * Math.PI) / 200, fromBase: (b) => (b * 200) / Math.PI},
        {id: 'arcmin', name: 'Arcminutes', symbol: "'", toBase: (v) => (v * Math.PI) / (180 * 60), fromBase: (b) => (b * 180 * 60) / Math.PI},
        {id: 'arcsec', name: 'Arcseconds', symbol: "''", toBase: (v) => (v * Math.PI) / (180 * 3600), fromBase: (b) => (b * 180 * 3600) / Math.PI},
        {id: 'rev', name: 'Revolutions / Turns', symbol: 'rev', toBase: (v) => v * 2 * Math.PI, fromBase: (b) => b / (2 * Math.PI)},
      ],
    };
  }
  if (slug === 'unit-energy-converter') {
    return {
      title: 'Energy Converter',
      defaultAmount: '1',
      defaultFrom: 'kwh',
      defaultTo: 'j',
      units: [
        {id: 'j', name: 'Joules', symbol: 'J', toBase: (v) => v, fromBase: (b) => b},
        {id: 'kj', name: 'Kilojoules', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'cal', name: 'Calories', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (b) => b / 4.184},
        {id: 'kcal', name: 'Kilocalories (Food kcal)', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (b) => b / 4184},
        {id: 'wh', name: 'Watt-hours', symbol: 'Wh', toBase: (v) => v * 3600, fromBase: (b) => b / 3600},
        {id: 'kwh', name: 'Kilowatt-hours', symbol: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (b) => b / 3.6e6},
        {id: 'btu', name: 'British Thermal Units', symbol: 'BTU', toBase: (v) => v * 1055.056, fromBase: (b) => b / 1055.056},
        {id: 'ftlb', name: 'Foot-pounds', symbol: 'ft·lb', toBase: (v) => v * 1.355818, fromBase: (b) => b / 1.355818},
        {id: 'ev', name: 'Electronvolts', symbol: 'eV', toBase: (v) => v * 1.602176634e-19, fromBase: (b) => b / 1.602176634e-19},
      ],
    };
  }
  if (slug === 'unit-power-converter') {
    return {
      title: 'Power Converter',
      defaultAmount: '1',
      defaultFrom: 'hp',
      defaultTo: 'kw',
      units: [
        {id: 'w', name: 'Watts', symbol: 'W', toBase: (v) => v, fromBase: (b) => b},
        {id: 'kw', name: 'Kilowatts', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mw', name: 'Megawatts', symbol: 'MW', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6},
        {id: 'hp', name: 'Horsepower (Mechanical/HP)', symbol: 'hp', toBase: (v) => v * 745.699872, fromBase: (b) => b / 745.699872},
        {id: 'hpm', name: 'Horsepower (Metric/PS)', symbol: 'PS', toBase: (v) => v * 735.49875, fromBase: (b) => b / 735.49875},
        {id: 'btuh', name: 'BTU per hour', symbol: 'BTU/h', toBase: (v) => v * 0.293071, fromBase: (b) => b / 0.293071},
        {id: 'ftlbs', name: 'Foot-pounds per second', symbol: 'ft·lb/s', toBase: (v) => v * 1.355818, fromBase: (b) => b / 1.355818},
      ],
    };
  }
  if (slug === 'unit-torque-converter') {
    return {
      title: 'Torque Converter',
      defaultAmount: '10',
      defaultFrom: 'nm',
      defaultTo: 'lbft',
      units: [
        {id: 'nm', name: 'Newton-meters', symbol: 'N·m', toBase: (v) => v, fromBase: (b) => b},
        {id: 'lbft', name: 'Pound-feet', symbol: 'lb-ft', toBase: (v) => v * 1.3558179483314, fromBase: (b) => b / 1.3558179483314},
        {id: 'lbin', name: 'Pound-inches', symbol: 'lb-in', toBase: (v) => v * 0.1129848290276, fromBase: (b) => b / 0.1129848290276},
        {id: 'kgm', name: 'Kilogram-meters', symbol: 'kg·m', toBase: (v) => v * 9.80665, fromBase: (b) => b / 9.80665},
        {id: 'dyncm', name: 'Dyne-centimeters', symbol: 'dyn·cm', toBase: (v) => v * 1e-7, fromBase: (b) => b / 1e-7},
      ],
    };
  }
  if (slug === 'unit-volume-converter') {
    return {
      title: 'Volume Converter',
      defaultAmount: '1',
      defaultFrom: 'l',
      defaultTo: 'gal_us',
      units: [
        {id: 'l', name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (b) => b},
        {id: 'ml', name: 'Milliliters', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
        {id: 'm3', name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'gal_us', name: 'US Gallons (Liquid)', symbol: 'gal (US)', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784},
        {id: 'gal_uk', name: 'Imperial Gallons (UK)', symbol: 'gal (UK)', toBase: (v) => v * 4.54609, fromBase: (b) => b / 4.54609},
        {id: 'floz_us', name: 'US Fluid Ounces', symbol: 'fl oz (US)', toBase: (v) => v * 0.0295735295625, fromBase: (b) => b / 0.0295735295625},
        {id: 'cup_us', name: 'US Cups', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (b) => b / 0.2365882365},
        {id: 'tbsp', name: 'Tablespoons', symbol: 'tbsp', toBase: (v) => v * 0.01478676478125, fromBase: (b) => b / 0.01478676478125},
        {id: 'tsp', name: 'Teaspoons', symbol: 'tsp', toBase: (v) => v * 0.00492892159375, fromBase: (b) => b / 0.00492892159375},
        {id: 'cuft', name: 'Cubic Feet', symbol: 'ft³', toBase: (v) => v * 28.316846592, fromBase: (b) => b / 28.316846592},
        {id: 'cuin', name: 'Cubic Inches', symbol: 'in³', toBase: (v) => v * 0.016387064, fromBase: (b) => b / 0.016387064},
      ],
    };
  }
  if (slug === 'unit-file-size-converter') {
    return {
      title: 'File Size Converter',
      defaultAmount: '1',
      defaultFrom: 'gb',
      defaultTo: 'mb',
      units: [
        {id: 'b', name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (b) => b},
        {id: 'kb', name: 'Kilobytes (Decimal)', symbol: 'KB', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mb', name: 'Megabytes (Decimal)', symbol: 'MB', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6},
        {id: 'gb', name: 'Gigabytes (Decimal)', symbol: 'GB', toBase: (v) => v * 1e9, fromBase: (b) => b / 1e9},
        {id: 'tb', name: 'Terabytes (Decimal)', symbol: 'TB', toBase: (v) => v * 1e12, fromBase: (b) => b / 1e12},
        {id: 'kib', name: 'Kibibytes (Binary 1024)', symbol: 'KiB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024},
        {id: 'mib', name: 'Mebibytes (Binary 1024²)', symbol: 'MiB', toBase: (v) => v * 1048576, fromBase: (b) => b / 1048576},
        {id: 'gib', name: 'Gibibytes (Binary 1024³)', symbol: 'GiB', toBase: (v) => v * 1073741824, fromBase: (b) => b / 1073741824},
        {id: 'tib', name: 'Tebibytes (Binary 1024⁴)', symbol: 'TiB', toBase: (v) => v * 1099511627776, fromBase: (b) => b / 1099511627776},
      ],
    };
  }
  if (slug === 'unit-data-transfer-rate-converter') {
    return {
      title: 'Data Transfer Rate Converter',
      defaultAmount: '100',
      defaultFrom: 'mbps',
      defaultTo: 'mbytes',
      units: [
        {id: 'bps', name: 'Bits per second', symbol: 'bps', toBase: (v) => v, fromBase: (b) => b},
        {id: 'kbps', name: 'Kilobits per second', symbol: 'Kbps', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
        {id: 'mbps', name: 'Megabits per second', symbol: 'Mbps', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6},
        {id: 'gbps', name: 'Gigabits per second', symbol: 'Gbps', toBase: (v) => v * 1e9, fromBase: (b) => b / 1e9},
        {id: 'bytes', name: 'Bytes per second', symbol: 'B/s', toBase: (v) => v * 8, fromBase: (b) => b / 8},
        {id: 'kbytes', name: 'Kilobytes per sec', symbol: 'KB/s', toBase: (v) => v * 8000, fromBase: (b) => b / 8000},
        {id: 'mbytes', name: 'Megabytes per sec', symbol: 'MB/s', toBase: (v) => v * 8e6, fromBase: (b) => b / 8e6},
        {id: 'gbytes', name: 'Gigabytes per sec', symbol: 'GB/s', toBase: (v) => v * 8e9, fromBase: (b) => b / 8e9},
      ],
    };
  }

  // Master Unit Converter (default fallback)
  return {
    title: 'Universal Multi-Unit Converter',
    defaultAmount: '1',
    defaultFrom: 'm',
    defaultTo: 'ft',
    units: [
      {id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b},
      {id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000},
      {id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01},
      {id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001},
      {id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048},
      {id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254},
      {id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144},
      {id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344},
      {id: 'kg', name: 'Kilograms (Mass)', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b},
      {id: 'lbs', name: 'Pounds (Mass)', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237},
      {id: 'l', name: 'Liters (Volume)', symbol: 'L', toBase: (v) => v, fromBase: (b) => b},
      {id: 'gal', name: 'Gallons (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (b) => b / 3.78541},
    ],
  };
}

// -------------------------------------------------------------------------
// STANDARD DUAL UNIT CONVERTER COMPONENT
// -------------------------------------------------------------------------
function StandardUnitConverter({slug, tool}: {slug: string; tool: Tool}) {
  const config = useMemo(() => getToolConfig(slug), [slug]);

  const [amount, setAmount] = useState<string>(config.defaultAmount || '1');
  const [fromId, setFromId] = useState<string>(config.defaultFrom);
  const [toId, setToId] = useState<string>(config.defaultTo);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fromUnit = useMemo(() => config.units.find((u) => u.id === fromId) || config.units[0], [config, fromId]);
  const toUnit = useMemo(() => config.units.find((u) => u.id === toId) || config.units[1] || config.units[0], [config, toId]);

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const numVal = parseFloat(amount);
  const isValid = !isNaN(numVal);

  const convertedResult = useMemo(() => {
    if (!isValid) return 0;
    const base = fromUnit.toBase(numVal);
    const res = toUnit.fromBase(base);
    return res;
  }, [numVal, isValid, fromUnit, toUnit]);

  // Format with high accuracy for verification tests
  const formattedResult = useMemo(() => {
    if (!isValid) return '0';
    // For small or large numbers
    const abs = Math.abs(convertedResult);
    if (abs !== 0 && (abs < 0.000001 || abs > 1e12)) {
      return convertedResult.toExponential(6);
    }
    // Round to 6 decimals, but strip trailing zero decimals unless necessary
    const rounded = Number(convertedResult.toFixed(6));
    return rounded.toLocaleString(undefined, {maximumFractionDigits: 6});
  }, [convertedResult, isValid]);

  const copyResult = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser calculation · Instant formula execution · Zero AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Quick sample buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Quick values:</span>
          {['1', '5', '10', '50', '100', '1000'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-[#0A8CFF]/10 hover:text-[#0A8CFF] transition-colors"
            >
              {val}
            </button>
          ))}
        </div>

        {/* Input & Unit selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Value
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              From Unit
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {config.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center pb-1">
            <button
              type="button"
              onClick={swap}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF] hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-[#0A8CFF] transition-all"
              title="Swap units"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              To Unit
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
            >
              {config.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Alert */}
        {!isValid && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Please enter a valid numeric value.</span>
          </div>
        )}

        {/* Result Card */}
        {isValid && (
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Conversion Result
              </span>
              <button
                type="button"
                onClick={() => copyResult(`${numVal} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`, 'res')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-all shadow-xs"
              >
                {copiedKey === 'res' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {numVal} {fromUnit.name} ({fromUnit.symbol}) =
              </div>
              <div className="mt-1 font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
                {formattedResult}{' '}
                <span className="text-xl sm:text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">
                  {toUnit.name}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-mono">
                Symbol: <strong className="text-slate-800 dark:text-slate-200">{numVal} {fromUnit.symbol} = {formattedResult} {toUnit.symbol}</strong>
              </div>
            </div>

            {/* Quick Multi-Unit Reference Table for Available Units */}
            {config.units.length > 2 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Equivalent Values Across All Configured Units:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {config.units.map((u) => {
                    const b = fromUnit.toBase(numVal);
                    const val = u.fromBase(b);
                    const formatted = Math.abs(val) < 0.000001 && val !== 0 ? val.toExponential(4) : Number(val.toFixed(6)).toLocaleString(undefined, {maximumFractionDigits: 6});
                    return (
                      <div
                        key={u.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 flex flex-col justify-between"
                      >
                        <span className="text-[11px] text-slate-500 truncate">{u.name} ({u.symbol})</span>
                        <span className="mt-1 font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {formatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 2. SPECIALIZED SUB-RUNNERS: CM <-> FEET AND INCHES (COMPOUND)
// =========================================================================
function CmToFeetInchesRunner({tool}: {tool: Tool}) {
  const [cm, setCm] = useState<string>('180');
  const [copied, setCopied] = useState<boolean>(false);

  const parsed = parseFloat(cm);
  const isValid = !isNaN(parsed) && parsed >= 0;

  const result = useMemo(() => {
    if (!isValid) return null;
    const totalInches = parsed / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return {
      feet,
      inches: Number(inches.toFixed(2)),
      totalInches: Number(totalInches.toFixed(2)),
    };
  }, [parsed, isValid]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${parsed} cm = ${result.feet} ft ${result.inches} in`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            {tool.name} — Interactive Workspace
          </h2>
          <p className="text-xs text-slate-500">Converts height or length from centimeters into feet + inches</p>
        </div>
      </div>

      <div className="max-w-md">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Enter Centimeters (cm)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={cm}
          onChange={(e) => setCm(e.target.value)}
          placeholder="e.g. 180"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
        />
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Output</span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-center">
            <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
              {result.feet}′ {result.inches}″
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {result.feet} Feet and {result.inches} Inches (Total: {result.totalInches} in)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeetInchesToCmRunner({tool}: {tool: Tool}) {
  const [feet, setFeet] = useState<string>('5');
  const [inches, setInches] = useState<string>('11');
  const [copied, setCopied] = useState<boolean>(false);

  const numFeet = parseFloat(feet) || 0;
  const numInches = parseFloat(inches) || 0;

  const cmResult = useMemo(() => {
    const totalInches = numFeet * 12 + numInches;
    return (totalInches * 2.54).toFixed(2);
  }, [numFeet, numInches]);

  const copy = () => {
    navigator.clipboard.writeText(`${numFeet} ft ${numInches} in = ${cmResult} cm`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          {tool.name} — Interactive Workspace
        </h2>
        <p className="text-xs text-slate-500">Converts height or length from feet and inches into centimeters</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Feet (ft)
          </label>
          <input
            type="number"
            min="0"
            value={feet}
            onChange={(e) => setFeet(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Inches (in)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inches}
            onChange={(e) => setInches(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Output</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-center">
          <div className="font-mono text-3xl sm:text-5xl font-extrabold text-[#0A8CFF]">
            {cmResult} <span className="text-xl sm:text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">cm</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {numFeet}′ {numInches}″ = {(parseFloat(cmResult) / 100).toFixed(4)} Meters (m)
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. SPECIALIZED RUNNER: SCALE MODEL CONVERSION
// =========================================================================
function ScaleModelRunner({tool}: {tool: Tool}) {
  const [scaleRatio, setScaleRatio] = useState<number>(24); // 1:24
  const [direction, setDirection] = useState<'real2model' | 'model2real'>('real2model');
  const [val, setVal] = useState<string>('4.8'); // e.g. 4.8 meters real car
  const [unit, setUnit] = useState<'m' | 'ft' | 'in' | 'cm' | 'mm'>('m');
  const [copied, setCopied] = useState<boolean>(false);

  const num = parseFloat(val);
  const isValid = !isNaN(num) && num > 0 && scaleRatio > 0;

  const result = useMemo(() => {
    if (!isValid) return null;
    let baseMm = 0;
    if (unit === 'm') baseMm = num * 1000;
    else if (unit === 'cm') baseMm = num * 10;
    else if (unit === 'mm') baseMm = num;
    else if (unit === 'ft') baseMm = num * 304.8;
    else if (unit === 'in') baseMm = num * 25.4;

    const outMm = direction === 'real2model' ? baseMm / scaleRatio : baseMm * scaleRatio;

    return {
      mm: Number(outMm.toFixed(2)),
      cm: Number((outMm / 10).toFixed(2)),
      m: Number((outMm / 1000).toFixed(4)),
      in: Number((outMm / 25.4).toFixed(3)),
      ft: Number((outMm / 304.8).toFixed(3)),
    };
  }, [isValid, num, unit, direction, scaleRatio]);

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500">Calculate scale model dimensions for miniature modeling & dioramas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Scale Preset (1:X)
          </label>
          <select
            value={scaleRatio}
            onChange={(e) => setScaleRatio(parseFloat(e.target.value))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
          >
            <option value="12">1:12 (Dollhouse / Large scale)</option>
            <option value="18">1:18 (Diecast cars)</option>
            <option value="24">1:24 (Model cars)</option>
            <option value="32">1:32 (Slot cars)</option>
            <option value="35">1:35 (Military armor)</option>
            <option value="48">1:48 (O Scale / Aircraft)</option>
            <option value="72">1:72 (Military aircraft)</option>
            <option value="87">1:87 (HO Scale trains)</option>
            <option value="160">1:160 (N Scale trains)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Conversion Mode
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'real2model' | 'model2real')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
          >
            <option value="real2model">Full-Size Real → Model Size</option>
            <option value="model2real">Model Size → Full-Size Real</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Enter Dimension
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-base font-bold"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs font-bold"
            >
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="ft">ft</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Calculated Dimensions at 1:{scaleRatio} Scale:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Centimeters</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.cm} cm</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Millimeters</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.mm} mm</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Inches</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.in} in</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Meters</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.m} m</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. SPECIALIZED RUNNER: FREQUENCY & WAVELENGTH CONVERTER
// =========================================================================
function FrequencyWavelengthRunner({tool}: {tool: Tool}) {
  const [mode, setMode] = useState<'freq2wave' | 'wave2freq'>('freq2wave');
  const [val, setVal] = useState<string>('2.4'); // 2.4 GHz WiFi
  const [freqUnit, setFreqUnit] = useState<number>(1e9); // GHz
  const [waveUnit, setWaveUnit] = useState<number>(0.01); // cm
  const [copied, setCopied] = useState<boolean>(false);

  const num = parseFloat(val);
  const isValid = !isNaN(num) && num > 0;

  const result = useMemo(() => {
    if (!isValid) return null;
    if (mode === 'freq2wave') {
      const fHz = num * freqUnit;
      const lambdaMeters = SPEED_OF_LIGHT / fHz;
      const energyEv = PLANCK_EV_S * fHz;
      return {
        type: 'freq2wave' as const,
        lambdaMeters,
        lambdaMm: lambdaMeters * 1000,
        lambdaCm: lambdaMeters * 100,
        lambdaNm: lambdaMeters * 1e9,
        energyEv,
      };
    } else {
      const lambdaMeters = num * waveUnit;
      const fHz = SPEED_OF_LIGHT / lambdaMeters;
      const energyEv = PLANCK_EV_S * fHz;
      return {
        type: 'wave2freq' as const,
        fHz,
        fKhz: fHz / 1e3,
        fMhz: fHz / 1e6,
        fGhz: fHz / 1e9,
        energyEv,
      };
    }
  }, [isValid, num, mode, freqUnit, waveUnit]);

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-white">{tool.name}</h2>
        <p className="text-xs text-slate-500">Calculate electromagnetic wavelength (λ = c / f) and photon energy (E = hf) in vacuum</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('freq2wave');
            setVal('2.4');
            setFreqUnit(1e9);
          }}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${mode === 'freq2wave' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
        >
          Frequency → Wavelength
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('wave2freq');
            setVal('12.5');
            setWaveUnit(0.01);
          }}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${mode === 'wave2freq' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'}`}
        >
          Wavelength → Frequency
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            {mode === 'freq2wave' ? 'Frequency Value' : 'Wavelength Value'}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Unit
          </label>
          {mode === 'freq2wave' ? (
            <select
              value={freqUnit}
              onChange={(e) => setFreqUnit(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
            >
              <option value="1">Hertz (Hz)</option>
              <option value="1000">Kilohertz (kHz)</option>
              <option value="1000000">Megahertz (MHz)</option>
              <option value="1000000000">Gigahertz (GHz)</option>
              <option value="1000000000000">Terahertz (THz)</option>
            </select>
          ) : (
            <select
              value={waveUnit}
              onChange={(e) => setWaveUnit(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
            >
              <option value="1">Meters (m)</option>
              <option value="0.01">Centimeters (cm)</option>
              <option value="0.001">Millimeters (mm)</option>
              <option value="0.000001">Micrometers (µm)</option>
              <option value="0.000000001">Nanometers (nm)</option>
            </select>
          )}
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Calculated Results:</div>
          {result.type === 'freq2wave' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Wavelength (cm)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.lambdaCm.toFixed(4)} cm</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Wavelength (m)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.lambdaMeters.toFixed(6)} m</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Wavelength (mm)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.lambdaMm.toFixed(3)} mm</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Photon Energy</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.energyEv.toExponential(3)} eV</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Gigahertz (GHz)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.fGhz.toFixed(4)} GHz</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Megahertz (MHz)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.fMhz.toFixed(2)} MHz</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Hertz (Hz)</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.fHz.toExponential(4)} Hz</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
                <span className="text-xs text-slate-400">Photon Energy</span>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{result.energyEv.toExponential(3)} eV</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. SPECIALIZED RUNNER: FUEL EFFICIENCY CONVERTER
// =========================================================================
function FuelEfficiencyRunner({tool}: {tool: Tool}) {
  const [val, setVal] = useState<string>('30');
  const [unit, setUnit] = useState<'mpg_us' | 'mpg_uk' | 'l100km' | 'kml'>('mpg_us');

  const num = parseFloat(val);
  const isValid = !isNaN(num) && num > 0;

  const results = useMemo(() => {
    if (!isValid) return null;
    let l100km = 0;
    if (unit === 'l100km') l100km = num;
    else if (unit === 'mpg_us') l100km = 235.214583 / num;
    else if (unit === 'mpg_uk') l100km = 282.4809363 / num;
    else if (unit === 'kml') l100km = 100 / num;

    const mpgUs = 235.214583 / l100km;
    const mpgUk = 282.4809363 / l100km;
    const kml = 100 / l100km;

    return {
      mpgUs: Number(mpgUs.toFixed(2)),
      mpgUk: Number(mpgUk.toFixed(2)),
      l100km: Number(l100km.toFixed(2)),
      kml: Number(kml.toFixed(2)),
    };
  }, [isValid, num, unit]);

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-white">{tool.name}</h2>
        <p className="text-xs text-slate-500">Reciprocal fuel economy converter across US, UK, and metric standards</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Enter Fuel Consumption
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold"
          >
            <option value="mpg_us">Miles per Gallon (US MPG)</option>
            <option value="mpg_uk">Miles per Gallon (UK Imperial)</option>
            <option value="l100km">Liters per 100 km (L/100km)</option>
            <option value="kml">Kilometers per Liter (km/L)</option>
          </select>
        </div>
      </div>

      {results && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Equivalents:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">US MPG</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{results.mpgUs} MPG</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">UK Imperial MPG</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{results.mpgUk} MPG</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Liters / 100km</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{results.l100km} L/100km</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-center">
              <span className="text-xs text-slate-400">Kilometers / Liter</span>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#0A8CFF]">{results.kml} km/L</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
