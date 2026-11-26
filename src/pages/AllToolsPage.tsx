import {ArrowDownAZ, Flame, FolderKanban, RotateCcw} from 'lucide-react';
import {useMemo} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {SearchBar} from '../components/SearchBar';
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  SeoHead,
} from '../components/SeoHead';
import {ToolCard} from '../components/ToolCard';
import {SITE_CONFIG} from '../config/site';
import {
  CATEGORIES,
  getPopularTools,
  TOOLS,
  type ToolCategoryId,
} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {searchTools} from '../lib/search';

type SortOption = 'popular' | 'az' | 'category';

function isCategoryId(value: string | null): value is ToolCategoryId {
  return Boolean(value && CATEGORIES.some((c) => c.id === value));
}

function isSortOption(value: string | null): value is SortOption {
  return value === 'popular' || value === 'az' || value === 'category';
}

export function AllToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const rawCategory = searchParams.get('category');
  const activeCategory: ToolCategoryId | 'all' = isCategoryId(rawCategory)
    ? rawCategory
    : 'all';
  const rawSort = searchParams.get('sort');
  const sortBy: SortOption = isSortOption(rawSort) ? rawSort : 'popular';

  const updateParams = (updates: {
    q?: string;
    category?: ToolCategoryId | 'all';
    sort?: SortOption;
  }) => {
    const next = new URLSearchParams(searchParams);

    if (updates.q !== undefined) {
      if (updates.q === '') {
        next.delete('q');
      } else {
        next.set('q', updates.q);
      }
    }

    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        next.delete('category');
      } else {
        next.set('category', updates.category);
      }
    }

    if (updates.sort !== undefined) {
      if (updates.sort === 'popular') {
        next.delete('sort');
      } else {
        next.set('sort', updates.sort);
      }
    }

    setSearchParams(next, {replace: true});
  };

  const filteredTools = useMemo(() => {
    const matched = searchTools(query, {category: activeCategory});
    const list = [...matched];

    // If a text query is active and sort is default 'popular', preserve search relevance first
    if (query.trim().length > 0 && sortBy === 'popular') {
      return list;
    }

    if (sortBy === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      const catOrder = new Map(CATEGORIES.map((c, idx) => [c.id, idx]));
      list.sort((a, b) => {
        const diff = (catOrder.get(a.category) ?? 0) - (catOrder.get(b.category) ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    } else {
      list.sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [query, activeCategory, sortBy]);

  const popularFallback = getPopularTools().slice(0, 4);
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: EN_STRINGS.common.allTools, url: '/tools'},
  ];

  const seoTitle = `All Online Tools (${TOOLS.length}) | ${SITE_CONFIG.siteName}`;
  const seoDescription = `Browse and filter all ${TOOLS.length} upcoming PDF, image, video, converter, productivity, and developer tools across ${CATEGORIES.length} categories.`;

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath="/tools"
        jsonLd={[
          buildBreadcrumbSchema(breadcrumbs),
          buildItemListSchema(`All ${SITE_CONFIG.siteName} Tools`, TOOLS),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            All Online Tools
          </h1>
          <p className="mt-2.5 text-base text-slate-600 dark:text-slate-400">
            Search across {TOOLS.length} upcoming tools by task, file format, or keyword. Every
            tool page previews accepted formats, limits, and planned processing mode.
          </p>
        </div>

        {/* Search & Controls */}
        <div className="mt-8 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="w-full lg:max-w-xl">
              <SearchBar
                variant="directory"
                value={query}
                onValueChange={(nextVal) => updateParams({q: nextVal})}
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Sort by:
              </span>
              <div
                role="group"
                aria-label="Sort tools"
                className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1"
              >
                <button
                  type="button"
                  onClick={() => updateParams({sort: 'popular'})}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    sortBy === 'popular'
                      ? 'bg-white dark:bg-slate-800 text-[#0A8CFF] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Popular</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateParams({sort: 'az'})}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    sortBy === 'az'
                      ? 'bg-white dark:bg-slate-800 text-[#0A8CFF] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowDownAZ className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>A–Z</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateParams({sort: 'category'})}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    sortBy === 'category'
                      ? 'bg-white dark:bg-slate-800 text-[#0A8CFF] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Category</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              onClick={() => updateParams({category: 'all'})}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              All Categories ({TOOLS.length})
            </button>
            {CATEGORIES.map((category) => {
              const count = TOOLS.filter((t) => t.category === category.id).length;
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => updateParams({category: category.id})}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer tabular-nums ${
                    active
                      ? 'bg-[#0A8CFF] text-white'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p className="tabular-nums">
            Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTools.length}</strong>{' '}
            of {TOOLS.length} tools
            {query.trim() ? ` for “${query.trim()}”` : ''}
          </p>
          {(query || activeCategory !== 'all' || sortBy !== 'popular') && (
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams(), {replace: true})}
              className="inline-flex items-center gap-1 font-semibold text-[#0A8CFF] hover:text-[#0077E6] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {filteredTools.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-8 sm:p-10 text-center">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              {EN_STRINGS.search.noResultsTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              {activeCategory !== 'all' &&
              TOOLS.filter((t) => t.category === activeCategory).length === 0
                ? 'This category is scheduled for an upcoming phase and does not contain tools yet.'
                : EN_STRINGS.search.noResultsSubtitle}
            </p>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams(), {replace: true})}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Show All Tools</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
              <p className="mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
                {EN_STRINGS.search.popularSuggestionsLabel}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {popularFallback.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
              Missing a specific utility?{' '}
              <Link to="/contact" className="font-semibold text-[#0A8CFF] hover:underline">
                Suggest a tool
              </Link>
              .
            </div>
          </div>
        )}
      </div>
    </>
  );
}
