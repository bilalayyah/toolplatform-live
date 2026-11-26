import {Breadcrumbs} from '../components/Breadcrumbs';
import {buildBreadcrumbSchema, SeoHead} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {EN_STRINGS} from '../i18n/en';

export function PrivacyPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: 'Privacy Policy', url: '/privacy'},
  ];

  return (
    <>
      <SeoHead
        title={`Privacy Policy | ${SITE_CONFIG.siteName}`}
        description={`Read the ${SITE_CONFIG.siteName} Privacy Policy covering Phase 1 browsing, local theme storage, and contact inquiries.`}
        canonicalPath="/privacy"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Applies to {SITE_CONFIG.siteName} ({SITE_CONFIG.canonicalBaseUrl})
        </p>

        <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              1. Phase 1 Platform Status
            </h2>
            <p className="mt-2">
              {SITE_CONFIG.siteName} is currently in Phase 1 (foundation and tool specification
              preview). No file upload, document storage, account creation, or advertising tracking
              is active on this site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              2. Information You Voluntarily Provide
            </h2>
            <p className="mt-2">
              If you submit the Contact form, your name, email address, subject, and message are
              transmitted via FormSubmit solely to deliver your inquiry to{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-[#0A8CFF] hover:underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>{' '}
              and allow us to reply.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              3. Planned Future File Processing
            </h2>
            <p className="mt-2">
              When tools launch in future phases, tools designated as browser-based are planned to
              run locally on your device, while server-based and external API tools will transmit
              inputs over encrypted connections only for requested processing. Updated retention
              disclosures will accompany live tool launches.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              4. Contact
            </h2>
            <p className="mt-2">
              For privacy questions, email us at{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-[#0A8CFF] hover:underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}

export function TermsPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: 'Terms of Service', url: '/terms'},
  ];

  return (
    <>
      <SeoHead
        title={`Terms of Service | ${SITE_CONFIG.siteName}`}
        description={`Review the Terms of Service for using ${SITE_CONFIG.siteName} tool previews, specifications, and contact services.`}
        canonicalPath="/terms"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Applies to {SITE_CONFIG.siteName}
        </p>

        <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              1. Informational Phase 1 Preview
            </h2>
            <p className="mt-2">
              All tools cataloged on {SITE_CONFIG.siteName} are currently marked as Coming Soon.
              Listed file formats, maximum file sizes, and workflows describe planned capabilities
              and may be adjusted prior to live launch.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              2. Tool Scope Disclosures
            </h2>
            <p className="mt-2">
              Upcoming security and signature utilities carry explicit technical scopes: Sign PDF
              will place a basic electronic signature (not a certified or CA-backed digital
              signature); Unlock PDF will require the valid existing password with no bypass; and
              Protect PDF permission flags are advisory signals for compatible PDF readers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              3. Acceptable Use
            </h2>
            <p className="mt-2">
              You agree not to abuse contact forms, scrape the service excessively, or attempt to
              disrupt site availability.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              4. Contact
            </h2>
            <p className="mt-2">
              Questions about these terms may be sent to{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-[#0A8CFF] hover:underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}

export function CookiePolicyPage() {
  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: 'Cookie Policy', url: '/cookie-policy'},
  ];

  return (
    <>
      <SeoHead
        title={`Cookie Policy | ${SITE_CONFIG.siteName}`}
        description={`Understand how ${SITE_CONFIG.siteName} uses local browser storage for your light or dark theme preference without ad cookies.`}
        canonicalPath="/cookie-policy"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Cookie Policy
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Last reviewed for Phase 1
        </p>

        <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              1. No Advertising or Analytics Cookies
            </h2>
            <p className="mt-2">
              {SITE_CONFIG.siteName} does not set third-party advertising trackers, behavioral
              profiling cookies, or analytics cookies in Phase 1.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              2. Local Preference Storage
            </h2>
            <p className="mt-2">
              When you toggle between Light and Dark theme, we store your selection in browser{' '}
              <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                localStorage
              </code>{' '}
              under the key{' '}
              <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                tp_theme
              </code>{' '}
              so your display stays consistent across page loads.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              3. Managing Storage
            </h2>
            <p className="mt-2">
              You can clear site data or disable local storage anytime in your browser settings.
              Questions can be sent to{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-[#0A8CFF] hover:underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
