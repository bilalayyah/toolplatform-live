import {ArrowRight, Search, X} from 'lucide-react';
import {useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {getCategoryById, getPopularTools, type Tool} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {getCategoryStyle, getToolIcon} from '../lib/icons';
import {searchTools} from '../lib/search';

interface SearchBarProps {
  variant?: 'hero' | 'header' | 'directory';
  value?: string;
  onValueChange?: (next: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  variant = 'hero',
  value,
  onValueChange,
  placeholder,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputId = useId();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = typeof value === 'string' && typeof onValueChange === 'function';
  const [internalQuery, setInternalQuery] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return location.pathname === '/tools' ? params.get('q') ?? '' : '';
  });

  // Keep uncontrolled header/hero query synced if user navigates with ?q=
  useEffect(() => {
    if (!isControlled && location.pathname === '/tools') {
      const q = new URLSearchParams(location.search).get('q') ?? '';
      if (q) {
        setInternalQuery(q);
      }
    }
  }, [isControlled, location.pathname, location.search]);

  const query = isControlled ? value : internalQuery;
  const setQuery = (next: string) => {
    if (isControlled) {
      onValueChange(next);
    } else {
      setInternalQuery(next);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmed = query.trim();
  const showDropdown = isOpen && trimmed.length >= 1;
  const suggestions = trimmed.length >= 1 ? searchTools(trimmed, {limit: 8}) : [];
  const popularSuggestions = getPopularTools().slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToSearch = (raw: string) => {
    const clean = raw.trim();
    setIsOpen(false);
    setActiveIndex(-1);
    if (clean) {
      navigate(`/tools?q=${encodeURIComponent(clean)}`);
    } else {
      navigate('/tools');
    }
  };

  const handleSelectTool = (tool: Tool) => {
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(tool.url);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showDropdown && activeIndex >= 0 && activeIndex < suggestions.length) {
      handleSelectTool(suggestions[activeIndex]);
      return;
    }
    if (variant === 'directory' && isControlled) {
      setIsOpen(false);
      return;
    }
    navigateToSearch(query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' && trimmed.length >= 1) {
        setIsOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1,
        );
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const resolvedPlaceholder =
    placeholder ??
    (variant === 'header'
      ? EN_STRINGS.search.placeholderHeader
      : variant === 'directory'
        ? EN_STRINGS.search.placeholderDirectory
        : EN_STRINGS.search.placeholderHero);

  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} role="search" aria-label="Search tools">
        <label htmlFor={inputId} className="sr-only">
          {resolvedPlaceholder}
        </label>
        <div
          className={`flex items-center rounded-full border transition-all duration-150 ${
            isHeader
              ? 'h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 pl-3.5 pr-1.5 focus-within:border-[#0A8CFF] focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-[#0A8CFF]/20'
              : 'h-13 sm:h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 pl-5 pr-2 shadow-[0_6px_24px_-6px_rgba(15,23,42,0.08)] dark:shadow-none focus-within:border-[#0A8CFF] focus-within:ring-4 focus-within:ring-[#0A8CFF]/15'
          }`}
        >
          <Search
            className={`shrink-0 text-slate-400 dark:text-slate-500 ${
              isHeader ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'
            }`}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            autoFocus={autoFocus}
            autoComplete="off"
            placeholder={resolvedPlaceholder}
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? listboxId : undefined}
            aria-activedescendant={
              showDropdown && activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            onFocus={() => {
              if (trimmed.length >= 1) {
                setIsOpen(true);
              }
            }}
            onChange={(e) => {
              const nextVal = e.target.value;
              setQuery(nextVal);
              setActiveIndex(-1);
              setIsOpen(nextVal.trim().length >= 1);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full min-w-0 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none ${
              isHeader ? 'text-sm' : 'text-sm sm:text-base'
            }`}
          />

          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label={EN_STRINGS.search.clearLabel}
              className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          {!isHeader && (
            <button
              type="submit"
              className="ml-1 inline-flex h-10 sm:h-10.5 shrink-0 items-center justify-center rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 sm:px-6 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A8CFF] whitespace-nowrap cursor-pointer"
            >
              {EN_STRINGS.search.buttonLabel}
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)]"
        >
          {suggestions.length > 0 ? (
            <>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-88 overflow-y-auto">
                {suggestions.map((tool, index) => {
                  const Icon = getToolIcon(tool.icon);
                  const category = getCategoryById(tool.category);
                  const style = getCategoryStyle(tool.category);
                  const isActive = index === activeIndex;

                  return (
                    <li
                      key={tool.id}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectTool(tool);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-sky-50/80 dark:bg-slate-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.tileBg} ${style.tileText}`}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {tool.name}
                            </div>
                            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {tool.description}
                            </div>
                          </div>
                        </div>

                        {category && (
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${style.chipBg} ${style.chipText}`}
                          >
                            {category.shortName}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  navigateToSearch(query);
                }}
                className="flex w-full items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-[#0A8CFF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>
                  {EN_STRINGS.search.viewAllResults} &ldquo;{trimmed}&rdquo;
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {EN_STRINGS.search.noResultsTitle}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {EN_STRINGS.search.noResultsSubtitle}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {EN_STRINGS.search.popularSuggestionsLabel}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {popularSuggestions.map((pop) => {
                    const PopIcon = getToolIcon(pop.icon);
                    const popStyle = getCategoryStyle(pop.category);
                    return (
                      <button
                        key={pop.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectTool(pop);
                        }}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${popStyle.tileBg} ${popStyle.tileText}`}
                        >
                          <PopIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="truncate">{pop.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
