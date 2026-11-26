import {ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {getCategoryById, type Tool} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {getCategoryStyle, getToolIcon} from '../lib/icons';

interface ToolCardProps {
  tool: Tool;
  showCategory?: boolean;
  showComingSoon?: boolean;
}

export function ToolCard({
  tool,
  showCategory = false,
  showComingSoon = false,
}: ToolCardProps) {
  const Icon = getToolIcon(tool.icon);
  const category = getCategoryById(tool.category);
  const style = getCategoryStyle(tool.category);

  return (
    <Link
      to={tool.url}
      className="group flex flex-col justify-between rounded-[14px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.06)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A8CFF]/60 dark:hover:border-[#0A8CFF]/60 hover:shadow-[0_12px_28px_-10px_rgba(10,140,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
    >
      <div>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.tileBg} ${style.tileText} transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <ArrowRight
            className="h-4 w-4 text-slate-300 dark:text-slate-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0A8CFF]"
            aria-hidden="true"
          />
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100 group-hover:text-[#0A8CFF] transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 truncate">
          {tool.description}
        </p>
      </div>

      {(showComingSoon || showCategory) && (
        <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          {showCategory && category && (
            <span className="font-medium">{category.shortName}</span>
          )}
          {showCategory && showComingSoon && category && (
            <span aria-hidden="true">·</span>
          )}
          {showComingSoon && (
            <span
              className={`font-medium ${
                tool.status === 'active'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tool.status === 'active' ? 'Free tool' : EN_STRINGS.common.comingSoonLabel}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
