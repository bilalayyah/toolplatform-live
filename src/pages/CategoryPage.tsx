import {ArrowRight, Clock} from 'lucide-react';
import {Link} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {FaqAccordion} from '../components/FaqAccordion';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  SeoHead,
} from '../components/SeoHead';
import {ToolCard} from '../components/ToolCard';
import {
  CATEGORIES,
  getCategoryById,
  getToolsByCategory,
  TOOLS,
  type ToolCategoryId,
} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {getCategoryStyle, getToolIcon} from '../lib/icons';

interface CategoryPageProps {
  categoryId: ToolCategoryId;
}

export function CategoryPage({categoryId}: CategoryPageProps) {
  const category = getCategoryById(categoryId);

  if (!category) {
    return null;
  }

  const tools = getToolsByCategory(category.id);
  const Icon = getToolIcon(category.icon);
  const style = getCategoryStyle(category.id);

  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: category.name, url: category.url},
  ];

  const jsonLd = [
    buildBreadcrumbSchema(breadcrumbs),
    buildFaqSchema(category.faqs),
    ...(tools.length > 0 ? [buildItemListSchema(category.name, tools)] : []),
  ];

  const otherCategories = CATEGORIES.filter((c) => c.id !== category.id);

  return (
    <>
      <SeoHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonicalPath={category.url}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        {/* TinyWow-Style Category Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${style.solidIconBg} shadow-xs`}
          >
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {category.name}
          </h1>
          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {category.intro}
          </p>
          <p className="mt-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            {tools.length > 0
              ? `${tools.length} tools · ${
                  tools.every((t) => t.status === 'active')
                    ? 'Free browser tools'
                    : tools.some((t) => t.status === 'active')
                    ? 'Active & coming soon tools'
                    : EN_STRINGS.common.comingSoonLabel
                }`
              : 'Category planned · Tools coming soon'}
          </p>
        </div>

        {/* Tools Grid OR Honest Empty State */}
        {tools.length > 0 ? (
          <section className="mt-12" aria-label={`${category.name} list`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} showComingSoon={true} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto mt-12 max-w-2xl rounded-[16px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-8 sm:p-10 text-center">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${style.tileBg} ${style.tileText}`}
            >
              <Clock className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-slate-950 dark:text-white">
              {category.name} — Tools Coming Soon
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              No individual tools have launched in {category.name} yet. We are rolling out the
              initial {TOOLS.length} utilities across PDF, Image, Video, Converter, Productivity,
              Unit Converters, Number Systems, Lookup, Science, Generators, Developer, Document,
              and Finance Tools first, and will expand {category.name} in a future update.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/tools"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-6 text-sm font-semibold text-white transition-colors whitespace-nowrap"
              >
                <span>{EN_STRINGS.common.browseAllTools}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-10 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap"
              >
                Request a Tool
              </Link>
            </div>
          </section>
        )}

        {/* Links to Other Categories */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Explore Other Categories
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Switch directly to another tool suite.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A8CFF] hover:text-[#0077E6] whitespace-nowrap"
            >
              <span>All Tools</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherCategories.map((other) => {
              const OtherIcon = getToolIcon(other.icon);
              const otherStyle = getCategoryStyle(other.id);
              const count = getToolsByCategory(other.id).length;

              return (
                <Link
                  key={other.id}
                  to={other.url}
                  className={`group flex items-center gap-3.5 rounded-[14px] border ${otherStyle.cardBorder} ${otherStyle.cardBg} p-4 transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${otherStyle.solidIconBg}`}
                  >
                    <OtherIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-bold text-slate-950 dark:text-white truncate">
                      {other.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      {count > 0 ? `${count} tools` : 'Coming soon'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Category FAQs */}
        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-5">
            {category.name} FAQs
          </h2>
          <FaqAccordion faqs={category.faqs} />
        </section>
      </div>
    </>
  );
}
