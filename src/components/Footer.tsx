import {Layers} from 'lucide-react';
import {Link} from 'react-router-dom';
import {SITE_CONFIG} from '../config/site';
import {TOOLS} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';

export function Footer() {
  const topTools = TOOLS.slice(0, 15);

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#080D1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* About Blurb */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] rounded-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A8CFF] text-white">
                <Layers className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                {SITE_CONFIG.logoText}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              {SITE_CONFIG.siteName} provides free online conversion, PDF, and other handy tools
              to help you solve problems of all types.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="hover:text-[#0A8CFF] transition-colors"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </p>
          </div>

          {/* Navigate Column */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-bold text-slate-950 dark:text-slate-100">
              {EN_STRINGS.footer.companyHeading}
            </h2>
            <ul className="mt-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-[#0A8CFF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#0A8CFF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#0A8CFF] transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0A8CFF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#0A8CFF] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0A8CFF] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Column: Top 15 tools + Others -> /tools */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-sm font-bold text-slate-950 dark:text-slate-100">
              {EN_STRINGS.footer.toolsHeading}
            </h2>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              {topTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={tool.url}
                    className="hover:text-[#0A8CFF] transition-colors truncate block"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tools"
                  className="hover:text-[#0A8CFF] transition-colors truncate block"
                >
                  Others
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400">
          <p>{EN_STRINGS.footer.rightsNotice}</p>
          <p>Phase 1 foundation — tool previews and specifications.</p>
        </div>
      </div>
    </footer>
  );
}
