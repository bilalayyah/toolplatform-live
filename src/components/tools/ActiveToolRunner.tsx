import React, {Suspense, lazy} from 'react';
import type {Tool} from '../../data/tools';
import {NumberSystemRunner} from './NumberSystemRunner';
import {CurrencyConverterRunner} from './CurrencyConverterRunner';
import {AcreageCalculatorRunner} from './AcreageCalculatorRunner';
import {IndianLandUnitRunner} from './IndianLandUnitRunner';
import {LandAreaConverterRunner} from './LandAreaConverterRunner';
import {SizingConverterRunner} from './SizingConverterRunner';
import {UnitConverterRunner} from './UnitConverterRunner';
import {ScienceToolsRunner} from './ScienceToolsRunner';
import {FinanceToolsRunner} from './FinanceToolsRunner';
import {DeveloperToolsRunner} from './DeveloperToolsRunner';
import {PdfToolsRunner} from './PdfToolsRunner';
import {ImageToolsRunner} from './ImageToolsRunner';

const LazyVideoToolsRunner = lazy(() =>
  import('./VideoToolsRunner').then((m) => ({default: m.VideoToolsRunner})),
);

const LazyConverterToolsRunner = lazy(() =>
  import('./ConverterToolsRunner').then((m) => ({default: m.ConverterToolsRunner})),
);

const LazyDocumentToolsRunner = lazy(() =>
  import('./DocumentToolsRunner').then((m) => ({default: m.DocumentToolsRunner})),
);

const LazyGeneratorToolsRunner = lazy(() =>
  import('./GeneratorToolsRunner').then((m) => ({default: m.GeneratorToolsRunner})),
);

const LazyLookupToolsRunner = lazy(() =>
  import('./LookupToolsRunner').then((m) => ({default: m.LookupToolsRunner})),
);

const LazyProductivityToolsRunner = lazy(() =>
  import('./ProductivityToolsRunner').then((m) => ({default: m.ProductivityToolsRunner})),
);

interface Props {
  tool: Tool;
}

const SIZING_SLUGS = new Set([
  'unit-clothing-size-converter',
  'unit-shoe-size-converter',
  'unit-ring-size-converter',
  'unit-hat-size-converter',
  'unit-glove-size-calculator',
]);

export function ActiveToolRunner({tool}: Props) {
  // Category-level routing
  if (tool.category === 'video-tools') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyVideoToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'pdf-tools' || tool.slug === 'excel-to-pdf') {
    return <PdfToolsRunner tool={tool} />;
  }

  if (tool.category === 'converter-tools') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyConverterToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'image-tools') {
    return <ImageToolsRunner tool={tool} />;
  }

  if (tool.category === 'document-tools') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyDocumentToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'generators') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyGeneratorToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'lookup-tools') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyLookupToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'productivity-tools') {
    return (
      <Suspense
        fallback={
          <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            Loading {tool.name} workspace...
          </section>
        }
      >
        <LazyProductivityToolsRunner tool={tool} />
      </Suspense>
    );
  }

  if (tool.category === 'science-tools') {
    return <ScienceToolsRunner tool={tool} />;
  }

  if (tool.category === 'finance-tools') {
    return <FinanceToolsRunner tool={tool} />;
  }

  if (tool.category === 'developer-tools') {
    return <DeveloperToolsRunner tool={tool} />;
  }

  if (tool.category === 'number-system-converters') {
    return <NumberSystemRunner tool={tool} />;
  }

  // Specialized Unit Converters
  if (tool.slug === 'unit-currency-converter') {
    return <CurrencyConverterRunner tool={tool} />;
  }

  if (tool.slug === 'acreage-calculator') {
    return <AcreageCalculatorRunner tool={tool} />;
  }

  if (tool.slug === 'indian-land-unit-converter') {
    return <IndianLandUnitRunner tool={tool} />;
  }

  if (tool.slug === 'unit-land-area-converter') {
    return <LandAreaConverterRunner tool={tool} />;
  }

  if (SIZING_SLUGS.has(tool.slug)) {
    return <SizingConverterRunner tool={tool} />;
  }

  // All other unit converters
  return <UnitConverterRunner tool={tool} />;
}
