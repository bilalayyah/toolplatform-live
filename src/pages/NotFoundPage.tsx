import {ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {SearchBar} from '../components/SearchBar';
import {SeoHead} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {CATEGORIES} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';

export function NotFoundPage() {
  return (
    <>
      <SeoHead
        title={`Page Not Found (404) | ${SITE_CONFIG.siteName}`}
        description={`The page you requested could not be found on ${SITE_CONFIG.siteName}. Search our tools directory or return home.`}
        canonicalPath="/404"
        noindex={true}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <p className="font-mono text-sm font-semibold text-[#0A8CFF] tabular-nums">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-slate-600 dark:text-slate-400">
          The URL you visited does not exist or may have moved. Search for any tool below or jump
          straight to a category.
        </p>

        <div className="mx-auto mt-8 max-w-xl text-left">
          <SearchBar variant="hero" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors"
          >
            <span>{EN_STRINGS.common.backToHome}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/tools"
            className="inline-flex h-10 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            {EN_STRINGS.common.browseAllTools}
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            Explore categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={category.url}
                className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#0A8CFF] hover:text-[#0A8CFF] transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
