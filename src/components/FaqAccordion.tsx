import {ChevronDown} from 'lucide-react';
import {useId, useState} from 'react';
import type {ToolFaq} from '../data/tools';

interface FaqAccordionProps {
  faqs: readonly ToolFaq[];
  defaultOpenIndex?: number | null;
}

export function FaqAccordion({faqs, defaultOpenIndex = 0}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-btn-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-[#0A8CFF] dark:hover:text-[#0A8CFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0A8CFF] cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#0A8CFF]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
