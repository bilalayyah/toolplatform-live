import {
  ArrowRight,
  FileText,
  Film,
  Image as ImageIcon,
  LayoutGrid,
} from 'lucide-react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {FaqAccordion} from '../components/FaqAccordion';
import {HeroParticles} from '../components/HeroParticles';
import {SearchBar} from '../components/SearchBar';
import {
  buildFaqSchema,
  buildWebSiteSchema,
  SeoHead,
} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {
  getCategoryById,
  getPopularTools,
  getToolsByCategory,
  TOOLS,
  type ToolCategoryId,
  type ToolFaq,
} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';
import {getCategoryStyle, getToolIcon} from '../lib/icons';

const ROTATING_WORDS = [
  {label: 'Business', bgClass: 'bg-[#0E7C7B]'},
  {label: 'Everything', bgClass: 'bg-[#F97316]'},
  {label: 'Your Life', bgClass: 'bg-[#E11D48]'},
  {label: 'Education', bgClass: 'bg-[#0A8CFF]'},
  {label: 'Work', bgClass: 'bg-[#7C3AED]'},
] as const;

const HOME_CATEGORY_ORDER: readonly ToolCategoryId[] = [
  'pdf-tools',
  'image-tools',
  'video-tools',
  'converter-tools',
  'youtube-tools',
  'instagram-tools',
  'facebook-tools',
  'tiktok-tools',
  'pinterest-tools',
  'linkedin-tools',
  'reddit-tools',
  'twitter-tools',
  'snapchat-tools',
  'threads-tools',
  'productivity-tools',
  'unit-converters',
  'science-tools',
  'generators',
  'developer-tools',
  'document-tools',
  'finance-tools',
  'number-system-converters',
  'lookup-tools',
  'file-tools',
  'web-tools',
];

const HOME_FAQS: readonly ToolFaq[] = [
  {
    question: `Is ${SITE_CONFIG.siteName} free to use without creating an account?`,
    answer: `Yes. Browsing all ${TOOLS.length} cataloged tools requires zero sign-up, and core everyday utilities are planned to start 100% free with no account required.`,
  },
  {
    question: 'Are the tools processing files right now?',
    answer:
      'Not yet. In Phase 1, every tool page lets you preview accepted formats, file limits, and whether processing will run locally in your browser or on a secure server. Live processing launches in upcoming releases.',
  },
  {
    question: 'How will my files stay private when tools launch?',
    answer:
      'Tools marked Browser-based (such as Merge PDF, Split PDF, Compress Image, and Crop Image) are designed to run directly on your device. Server-service tools will use encrypted connections for transient processing only.',
  },
  {
    question: 'Which devices and browsers will be supported?',
    answer: `${SITE_CONFIG.siteName} is designed for modern desktop, tablet, and mobile browsers across Windows, macOS, Linux, iOS, and Android.`,
  },
];

const POPULAR_TABS: readonly {
  id: 'all' | ToolCategoryId;
  label: string;
  Icon: typeof LayoutGrid;
}[] = [
  {id: 'all', label: 'All Tools', Icon: LayoutGrid},
  {id: 'pdf-tools', label: 'PDF Tools', Icon: FileText},
  {id: 'image-tools', label: 'Image Tools', Icon: ImageIcon},
  {id: 'video-tools', label: 'Video Tools', Icon: Film},
];

const POPULAR_CATEGORY_LABEL_COLOR: Record<ToolCategoryId, string> = {
  'pdf-tools': 'text-orange-600 dark:text-orange-400',
  'image-tools': 'text-teal-600 dark:text-teal-400',
  'video-tools': 'text-violet-600 dark:text-violet-400',
  'converter-tools': 'text-amber-600 dark:text-amber-400',
  'youtube-tools': 'text-red-600 dark:text-red-400',
  'instagram-tools': 'text-pink-600 dark:text-pink-400',
  'facebook-tools': 'text-blue-600 dark:text-blue-400',
  'tiktok-tools': 'text-fuchsia-600 dark:text-fuchsia-400',
  'pinterest-tools': 'text-orange-600 dark:text-orange-400',
  'linkedin-tools': 'text-indigo-600 dark:text-indigo-400',
  'reddit-tools': 'text-[#FF4500] dark:text-orange-400',
  'twitter-tools': 'text-sky-600 dark:text-sky-400',
  'snapchat-tools': 'text-yellow-700 dark:text-yellow-400',
  'threads-tools': 'text-slate-700 dark:text-slate-300',
  'productivity-tools': 'text-teal-600 dark:text-teal-400',
  'unit-converters': 'text-purple-600 dark:text-purple-400',
  'science-tools': 'text-emerald-600 dark:text-emerald-400',
  generators: 'text-amber-600 dark:text-amber-400',
  'developer-tools': 'text-sky-700 dark:text-sky-400',
  'document-tools': 'text-indigo-700 dark:text-indigo-400',
  'finance-tools': 'text-green-700 dark:text-green-400',
  'number-system-converters': 'text-cyan-700 dark:text-cyan-400',
  'lookup-tools': 'text-violet-700 dark:text-violet-400',
  'file-tools': 'text-emerald-600 dark:text-emerald-400',
  'web-tools': 'text-cyan-600 dark:text-cyan-400',
};

const EDITORIAL_BENEFITS = [
  {
    number: '01',
    title: 'Easy to Use',
    description: 'Simple tools. Effortless workflows.',
  },
  {
    number: '02',
    title: 'Completely Free',
    description: 'No account or sign-up required.',
  },
  {
    number: '03',
    title: 'Works Across Devices',
    description: 'Your tools, wherever you need them.',
  },
] as const;

export function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activePopularTab, setActivePopularTab] = useState<'all' | ToolCategoryId>('all');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, []);

  const currentWord = ROTATING_WORDS[wordIndex];

  const orderedCategories = HOME_CATEGORY_ORDER.map((id) =>
    getCategoryById(id),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const popularTools = getPopularTools(); // 12 tools in exact requested order
  const visiblePopularTools =
    activePopularTab === 'all'
      ? popularTools
      : popularTools.filter((tool) => tool.category === activePopularTab);

  const seoTitle = `${SITE_CONFIG.siteName} — Free Online PDF, Image & Video Tools`;
  const seoDescription = `Free tools to make everything simple. Explore ${TOOLS.length} upcoming online tools across PDF, video, image, converter, and social creator workflows on ToolPlatform.`;

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath="/"
        jsonLd={[buildWebSiteSchema(), buildFaqSchema(HOME_FAQS)]}
      />

      {/* 2. Hero + 3. Category Cards Band */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0B1120]">
        <HeroParticles />

        {/* 2. Hero Section */}
        <section className="relative z-10 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mx-auto flex flex-col items-center justify-center gap-y-2 lg:flex-row lg:gap-x-3 lg:gap-y-0 lg:whitespace-nowrap font-display font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15] text-[clamp(1.65rem,3.65vw,3.25rem)]">
              <span className="whitespace-nowrap">Free Tools to Make</span>
              <span className="inline-flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap">
                <span
                  aria-live="polite"
                  className={`inline-flex h-[1.24em] items-center justify-center overflow-hidden rounded-[4px] px-3 text-white transition-colors duration-200 ease-out ${currentWord.bgClass}`}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={currentWord.label}
                      initial={shouldReduceMotion ? false : {y: '65%', opacity: 0}}
                      animate={{y: '0%', opacity: 1}}
                      exit={shouldReduceMotion ? {opacity: 0} : {y: '-65%', opacity: 0}}
                      transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                      className="inline-block whitespace-nowrap leading-none"
                    >
                      {currentWord.label}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span>Simple</span>
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Free tools to make everything simple. We offer PDF, video, image and other online
              tools to make your life easier.
            </p>

            {/* Large Pill-Shaped Search Box */}
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar variant="hero" placeholder="Search for tools…" />
            </div>
          </div>
        </section>

        {/* 3. Horizontally Scrollable Pastel Category Cards Row */}
        <section
          aria-label="Tool categories"
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12"
        >
          <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {orderedCategories.map((category) => {
              const Icon = getToolIcon(category.icon);
              const style = getCategoryStyle(category.id);
              const count = getToolsByCategory(category.id).length;

              return (
                <Link
                  key={category.id}
                  to={category.url}
                  className={`group snap-start shrink-0 w-48 sm:w-52 lg:w-auto flex flex-col justify-between rounded-[16px] border ${style.cardBorder} ${style.cardBg} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.solidIconBg} shadow-xs transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-800 dark:group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-5">
                    <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                      {category.name}
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                      {count > 0 ? `${count} tools` : 'Coming soon'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* 4. Editorial SaaS Value Section */}
      <section
        aria-labelledby="editorial-productivity-heading"
        className="border-t border-slate-100 dark:border-slate-800/70 bg-white dark:bg-[#0B1120] py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A8CFF]">
              MADE FOR EVERYDAY PRODUCTIVITY
            </p>
            <h2
              id="editorial-productivity-heading"
              className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.028em] text-slate-950 dark:text-white leading-[1.12] text-balance"
            >
              Less Hassle. More Done.
            </h2>
            <p className="mt-3.5 max-w-xl text-base sm:text-[17px] leading-relaxed text-slate-600 dark:text-slate-400">
              Everything you need to work with documents, images and files — beautifully simple,
              completely online.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-7 md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200/80 dark:md:divide-slate-800/80">
            {EDITORIAL_BENEFITS.map((item, idx) => (
              <div
                key={item.number}
                className={
                  idx === 0
                    ? 'md:pr-6 lg:pr-10'
                    : idx === 1
                      ? 'md:px-6 lg:px-10'
                      : 'md:pl-6 lg:pl-10'
                }
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-medium tracking-wider text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                    {item.number}
                  </span>
                  <h3 className="font-display text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Most Popular Tools — TinyWow-style blue-grey rounded section with working filter tabs */}
      <section className="rounded-t-[28px] sm:rounded-t-[40px] bg-[#F2F6FB] dark:bg-[#0D1526] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Our Most Popular Tools
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              We present the best of the best. All free, no catch
            </p>
          </div>

          {/* White Pill-Shaped Category Tab Bar */}
          <div className="mt-8 flex justify-center">
            <div
              role="tablist"
              aria-label="Filter popular tools by category"
              className="inline-flex max-w-full items-center gap-1 overflow-x-auto no-scrollbar rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.08)] dark:shadow-none"
            >
              {POPULAR_TABS.map((tab) => {
                const TabIcon = tab.Icon;
                const isSelected = activePopularTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActivePopularTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF] ${
                      isSelected
                        ? 'bg-[#0A8CFF] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
                    }`}
                  >
                    <TabIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-column mobile, 3-4 column desktop card grid */}
          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {visiblePopularTools.map((tool) => {
              const Icon = getToolIcon(tool.icon);
              const style = getCategoryStyle(tool.category);
              const category = getCategoryById(tool.category);
              const categoryColorClass =
                POPULAR_CATEGORY_LABEL_COLOR[tool.category];

              return (
                <Link
                  key={tool.id}
                  to={tool.url}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-[0_6px_24px_-8px_rgba(15,23,42,0.07)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A8CFF]/60 hover:shadow-[0_12px_28px_-10px_rgba(10,140,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A8CFF]"
                >
                  <div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.tileBg} ${style.tileText} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <h3 className="mt-4 font-display text-sm sm:text-base font-bold tracking-tight text-slate-950 dark:text-white group-hover:text-[#0A8CFF] transition-colors">
                      {tool.name}
                    </h3>

                    {category && (
                      <p className={`mt-1 text-xs font-semibold ${categoryColorClass}`}>
                        {category.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium">
                    <span
                      className={
                        tool.status === 'active'
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-400 dark:text-slate-500'
                      }
                    >
                      {tool.status === 'active' ? 'Free tool' : EN_STRINGS.common.comingSoonLabel}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#0A8CFF]"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-9 text-center">
            <Link
              to="/tools"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-7 text-sm font-semibold text-white shadow-sm transition-colors whitespace-nowrap"
            >
              <span>Explore All {TOOLS.length} Tools</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ Teaser (4 general questions) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Quick answers about {SITE_CONFIG.siteName} Phase 1 and upcoming tools.
            </p>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A8CFF] hover:text-[#0077E6] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View all FAQs</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <FaqAccordion faqs={HOME_FAQS} />
      </section>
    </>
  );
}
