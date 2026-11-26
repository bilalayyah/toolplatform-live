import {ArrowRight, BookOpen} from 'lucide-react';
import {Link} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {buildBreadcrumbSchema, SeoHead} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {EN_STRINGS} from '../i18n/en';

export function BlogPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: EN_STRINGS.nav.blog, url: '/blog'},
  ];

  return (
    <>
      <SeoHead
        title={`Blog & Updates — Coming Soon | ${SITE_CONFIG.siteName}`}
        description={`Official updates, release notes, and practical file workflow guides from ${SITE_CONFIG.siteName} will appear here as tools launch.`}
        canonicalPath="/blog"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Blog
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Product announcements, format guides, and workflow notes from {SITE_CONFIG.siteName}.
        </p>

        <section className="mt-10 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-8 sm:p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0A8CFF]">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-slate-950 dark:text-white">
            No articles published yet
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            In Phase 1, our focus is the core site foundation and tool catalog. Practical guides
            and release notes will be published here once live tool processing begins.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/tools"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors"
            >
              <span>{EN_STRINGS.common.browseAllTools}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex h-10 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              Read About Phase 1
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
