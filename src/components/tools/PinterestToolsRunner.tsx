import React, {useState} from 'react';
import {Pin} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  PinterestUsernameGenerator,
  PinterestBioGenerator,
  PinterestPinIdeaGenerator,
  PinterestContentCalendarGenerator,
  PinterestEngagementCalculator,
  PinterestFollowerGrowthCalculator,
  PinterestBoardDescGenerator,
  PinterestSeoDescGenerator,
  PinterestAltTextGenerator,
  PinterestStylishTextGenerator,
  PinterestFontGenerator,
} from './pinterest/PinterestTextAndCalcTools';
import {
  PinterestColorPaletteExtractor,
  PinterestRichPinPreviewGenerator,
  PinterestCollageMaker,
  PinterestBoardCoverMaker,
  PinterestPinMockupGenerator,
} from './pinterest/PinterestCanvasTools';

interface Props {
  tool: Tool;
}

export function PinterestToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const isComingSoon = tool.status === 'coming-soon';

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderTool = () => {
    switch (tool.slug) {
      case 'pinterest-pin-text-extractor':
        return (
          <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-sm text-amber-900 dark:text-amber-200 space-y-2">
            <p className="font-bold">Coming Soon — Reliable In-Browser OCR Not Yet Supported</p>
            <p className="text-xs leading-relaxed">
              Reliable in-browser optical character recognition (OCR) for Pinterest pins is not yet supported without external server APIs. If you already know the text printed on your Pin graphic, you can format screen-reader copy in{' '}
              <a href="/pinterest-alt-text-generator" className="underline font-semibold">
                Pinterest Alt Text Generator
              </a>
              .
            </p>
          </div>
        );

      // 8 Built-from-scratch Pinterest tools
      case 'pinterest-username-generator':
        return <PinterestUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-bio-generator':
        return <PinterestBioGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-pin-idea-generator':
        return <PinterestPinIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-content-calendar-generator':
        return <PinterestContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-engagement-rate-calculator':
        return <PinterestEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-follower-growth-calculator':
        return <PinterestFollowerGrowthCalculator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-color-palette-extractor':
        return <PinterestColorPaletteExtractor onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-rich-pin-preview-generator':
        return <PinterestRichPinPreviewGenerator onCopy={copyText} copiedKey={copiedKey} />;

      // 8 Verified / fixed Pinterest tools
      case 'pinterest-board-description-generator':
        return <PinterestBoardDescGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-seo-description-generator':
        return <PinterestSeoDescGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-alt-text-generator':
        return <PinterestAltTextGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-stylish-text-generator':
        return <PinterestStylishTextGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-font-generator':
        return <PinterestFontGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'pinterest-collage-maker':
        return <PinterestCollageMaker />;
      case 'pinterest-board-cover-maker':
        return <PinterestBoardCoverMaker />;
      case 'pinterest-pin-mockup-generator':
        return <PinterestPinMockupGenerator />;

      default:
        return (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
            This Pinterest utility is currently unavailable.
          </div>
        );
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
            <Pin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isComingSoon
                ? 'In-browser OCR status · Coming Soon'
                : 'Deterministic browser-based tool · Zero AI · Real in-browser execution'}
            </p>
          </div>
        </div>
        {isComingSoon ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Coming Soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Browser Tool
          </span>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6">{renderTool()}</div>
    </div>
  );
}
