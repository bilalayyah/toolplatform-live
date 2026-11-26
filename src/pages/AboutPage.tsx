import {ArrowRight, Cpu, Layers, ShieldCheck} from 'lucide-react';
import {Link} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {buildBreadcrumbSchema, SeoHead} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {CATEGORIES, TOOLS} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';

export function AboutPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: EN_STRINGS.nav.about, url: '/about'},
  ];

  return (
    <>
      <SeoHead
        title={`About ${SITE_CONFIG.siteName} — Phase 1 Foundation`}
        description={`Learn how ${SITE_CONFIG.siteName} is designed as a transparent, fast online utilities workspace across ${TOOLS.length} planned tools.`}
        canonicalPath="/about"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          About {SITE_CONFIG.siteName}
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {SITE_CONFIG.siteName} is being built as a clean, reliable home for everyday PDF, image,
          and video utilities—without cluttered popups, dark patterns, or misleading claims.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <Layers className="h-5 w-5 text-[#0A8CFF]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-base font-bold text-slate-950 dark:text-white">
              Structured Catalog
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {TOOLS.length} planned tools organized across {CATEGORIES.length} clear categories so
              you can find the right utility in seconds.
            </p>
          </div>

          <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <Cpu className="h-5 w-5 text-[#0A8CFF]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-base font-bold text-slate-950 dark:text-white">
              Clear Architecture
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Every tool states upfront whether it is designed to run locally in your browser, on a
              secure server pipeline, or via an external API.
            </p>
          </div>

          <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <ShieldCheck className="h-5 w-5 text-[#0A8CFF]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-base font-bold text-slate-950 dark:text-white">
              Honest Scope
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We document real limits and technical constraints—including basic electronic
              signatures and advisory PDF permissions.
            </p>
          </div>
        </div>

        <section className="mt-10 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Where we are in Phase 1
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            This Phase 1 release focuses on the complete platform architecture, central tool
            registry, search experience, accessibility, light and dark themes, and technical SEO
            foundation. Live file processing will roll out in subsequent phases.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors"
            >
              <span>Explore All {TOOLS.length} Tools</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-10 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              Contact the Team
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
