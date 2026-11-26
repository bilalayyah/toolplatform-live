import {ChevronDown, Layers, Menu, Moon, Search, Sun, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {SITE_CONFIG} from '../config/site';
import {CATEGORIES, type ToolCategoryId} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {useTheme} from '../lib/theme';
import {LanguageSelector} from './LanguageSelector';
import {SearchBar} from './SearchBar';

const PRIMARY_HEADER_ORDER: readonly ToolCategoryId[] = [
  'pdf-tools',
  'image-tools',
  'video-tools',
  'converter-tools',
  'youtube-tools',
  'instagram-tools',
  'facebook-tools',
  'tiktok-tools',
  'pinterest-tools',
];

const MORE_HEADER_ORDER: readonly ToolCategoryId[] = [
  'linkedin-tools',
  'reddit-tools',
  'twitter-tools',
  'snapchat-tools',
  'threads-tools',
  'productivity-tools',
  'unit-converters',
  'science-tools',
  'generators',
  'developer-tools',
  'document-tools',
  'finance-tools',
  'number-system-converters',
  'lookup-tools',
  'file-tools',
  'web-tools',
];

const PRIMARY_NAV_CATEGORIES = PRIMARY_HEADER_ORDER.map((id) =>
  CATEGORIES.find((c) => c.id === id),
).filter((c): c is NonNullable<typeof c> => Boolean(c));

const MORE_NAV_CATEGORIES = MORE_HEADER_ORDER.map((id) =>
  CATEGORIES.find((c) => c.id === id),
).filter((c): c is NonNullable<typeof c> => Boolean(c));

const ALL_MOBILE_NAV_CATEGORIES = [...PRIMARY_NAV_CATEGORIES, ...MORE_NAV_CATEGORIES];

export function Header() {
  const {theme, toggleTheme} = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const searchBarContainerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const {pathname} = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen && !moreOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMoreOpen(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('keydown', onEscape);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [searchOpen, moreOpen]);

  const isMoreRouteActive = MORE_NAV_CATEGORIES.some((cat) => pathname === cat.url);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap min-w-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] rounded-lg"
        >
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-[#0A8CFF] text-white shadow-sm shrink-0">
            <Layers className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true" />
          </span>
          <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
            {SITE_CONFIG.logoText}
          </span>
        </Link>

        {/* Center: Nav Links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-2.5 lg:gap-4 xl:gap-5 text-xs lg:text-[13px] xl:text-sm font-semibold text-slate-600 dark:text-slate-300"
        >
          {PRIMARY_NAV_CATEGORIES.map((cat) => (
            <NavLink
              key={cat.id}
              to={cat.url}
              className={({isActive}) =>
                `whitespace-nowrap shrink-0 transition-colors hover:text-[#0A8CFF] ${
                  isActive ? 'text-[#0A8CFF]' : ''
                }`
              }
            >
              {cat.shortName === 'Files' ? 'File' : cat.shortName}
            </NavLink>
          ))}

          {/* More Categories Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#0A8CFF] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] rounded-md px-1 py-0.5 ${
                moreOpen || isMoreRouteActive ? 'text-[#0A8CFF]' : ''
              }`}
            >
              <span>More</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                  moreOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-88 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-lg ring-1 ring-slate-950/5"
              >
                <div className="grid grid-cols-2 gap-1">
                  {MORE_NAV_CATEGORIES.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={cat.url}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className={({isActive}) =>
                        `block rounded-xl px-3 py-2 text-xs lg:text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-sky-50 dark:bg-sky-500/15 text-[#0A8CFF]'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />
                <NavLink
                  to="/tools"
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={({isActive}) =>
                    `block rounded-xl px-3 py-2 text-center text-xs lg:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-500/15 text-[#0A8CFF]'
                        : 'text-[#0A8CFF] hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {EN_STRINGS.nav.allTools}
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Search Icon, Dark Toggle, Language Selector, Mobile Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] cursor-pointer ${
              searchOpen
                ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF] dark:bg-sky-500/15'
                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:text-slate-900 dark:hover:border-slate-600 dark:hover:text-white'
            }`}
          >
            {searchOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? EN_STRINGS.common.themeToggleLight
                : EN_STRINGS.common.themeToggleDark
            }
            className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:text-slate-900 dark:hover:border-slate-600 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <LanguageSelector />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Header Search Bar */}
      {searchOpen && (
        <div
          ref={searchBarContainerRef}
          className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1120] py-3 px-4 sm:px-6 lg:px-8 shadow-sm"
        >
          <div className="mx-auto max-w-2xl">
            <SearchBar variant="hero" autoFocus />
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-4 space-y-4">
          <SearchBar variant="header" />
          <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2">
            {ALL_MOBILE_NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.url}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {cat.shortName === 'Files' ? 'File' : cat.shortName}
              </Link>
            ))}
            <Link
              to="/tools"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0A8CFF] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {EN_STRINGS.nav.allTools}
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {EN_STRINGS.nav.faq}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {EN_STRINGS.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
