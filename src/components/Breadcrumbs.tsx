import {ChevronRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import type {BreadcrumbItem} from './SeoHead';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({items}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-[#0A8CFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
