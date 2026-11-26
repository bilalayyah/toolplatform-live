import {Check, ChevronDown, Globe} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {EN_STRINGS} from '../i18n/en';
import {LIVE_LOCALE, LOCALES} from '../i18n/locales';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeLocale = LOCALES.find((l) => l.code === LIVE_LOCALE) ?? LOCALES[0];

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutsideClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${EN_STRINGS.common.languageLabel}: ${activeLocale.name}`}
        className="inline-flex h-8 sm:h-9 items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 px-2 sm:px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <span>EN</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 top-full z-50 mt-2 w-68 max-w-[calc(100vw-1.5rem)] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65)]"
        >
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {EN_STRINGS.common.languageLabel}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/70 dark:divide-slate-800/70">
            {LOCALES.map((locale) => {
              const isLive = locale.status === 'live';
              const isSelected = locale.code === LIVE_LOCALE;

              if (isLive) {
                return (
                  <button
                    key={locale.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm font-medium text-slate-900 dark:text-slate-100 bg-sky-50/70 dark:bg-sky-500/10 hover:bg-sky-50 dark:hover:bg-sky-500/15 transition-colors cursor-pointer"
                  >
                    <span>
                      {locale.name}
                    </span>
                    <Check className="h-4 w-4 text-[#0A8CFF] shrink-0" aria-hidden="true" />
                  </button>
                );
              }

              return (
                <div
                  key={locale.code}
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm text-slate-400 dark:text-slate-500 select-none cursor-not-allowed"
                >
                  <span className="truncate">{locale.name}</span>
                  <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {locale.badgeLabel ?? EN_STRINGS.common.comingSoonLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
