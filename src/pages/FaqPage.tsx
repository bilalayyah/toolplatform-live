import {Link} from 'react-router-dom';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {FaqAccordion} from '../components/FaqAccordion';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  SeoHead,
} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {CATEGORIES, TOOLS, type ToolFaq} from '../data/tools';
import {EN_STRINGS} from '../i18n/en';

const PLATFORM_FAQS: readonly ToolFaq[] = [
  {
    question: `What is ${SITE_CONFIG.siteName} and what is available in Phase 1?`,
    answer: `${SITE_CONFIG.siteName} is an all-in-one online utilities platform. Phase 1 delivers the full site architecture, central tool registry of ${TOOLS.length} upcoming tools across ${CATEGORIES.length} categories, unified search, light and dark themes, and complete tool specifications.`,
  },
  {
    question: 'Are any file uploads or conversions working right now?',
    answer:
      'No. Every tool is currently marked Coming Soon in Phase 1. You can inspect accepted file formats, size caps, batch limits, and planned workflows, while actual processing launches in upcoming releases.',
  },
  {
    question: 'How will browser-based tools differ from server-service tools?',
    answer:
      'Browser-based tools (such as Merge PDF, Split PDF, Rotate PDF, Compress Image, Crop Image, and browser FFmpeg video tools) are planned to run locally inside your browser tab without uploading files. Server-service tools (such as Word to PDF, PDF to Word, and Protect PDF) will run on dedicated encrypted server pipelines.',
  },
  {
    question: 'Does Sign PDF provide a legally certified digital signature?',
    answer:
      'No. Sign PDF is designed to place a basic electronic signature (drawn, typed, or image placement). It does not issue Certificate Authority (CA) cryptographic signatures.',
  },
  {
    question: 'Can Unlock PDF remove a password if I forgot it?',
    answer:
      'No. Unlock PDF will strictly require the valid existing password. There will be no password cracking, brute-forcing, or security bypass.',
  },
  {
    question: 'What does "advisory permission flags" mean for Protect PDF?',
    answer:
      'While setting an open password encrypts the PDF file, optional permission flags (such as print or copy restrictions) are advisory instructions that rely on PDF viewer applications respecting them.',
  },
  {
    question: 'Why are File Tools and Web Tools empty right now?',
    answer: `We are building out the initial ${TOOLS.length} tools across PDF, Image, Video, Converter, social creator suites, Productivity, Unit Converters, Number Systems, Lookup, Science, Generators, Developer, Document, and Finance Tools first. File Tools and Web Tools are reserved categories whose individual utilities will be announced in later phases.`,
  },
  {
    question: 'Which languages are supported right now?',
    answer:
      'English is currently the only live language. Eleven additional languages are listed in the header selector as Coming Soon and do not have separate URLs yet.',
  },
  {
    question: 'How can I contact the team or request a new tool?',
    answer: `You can reach us anytime using the Contact page form, which delivers directly to ${SITE_CONFIG.contactEmail}.`,
  },
];

export function FaqPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: EN_STRINGS.nav.faq, url: '/faq'},
  ];

  return (
    <>
      <SeoHead
        title={`Frequently Asked Questions | ${SITE_CONFIG.siteName}`}
        description={`Answers to common questions about ${SITE_CONFIG.siteName} Phase 1, upcoming PDF, image, video, converter, and social creator tools, privacy, and limits.`}
        canonicalPath="/faq"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs), buildFaqSchema(PLATFORM_FAQS)]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-2xl mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Everything you need to know about Phase 1 tool previews, processing models, and
            technical scopes.
          </p>
        </div>

        <FaqAccordion faqs={PLATFORM_FAQS} />

        <div className="mt-10 rounded-[14px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
              Still have a question?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Send us a message and we will get back to you.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
