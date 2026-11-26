import {AlertCircle, CheckCircle2, Mail, Send} from 'lucide-react';
import {useState, type FormEvent} from 'react';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {buildBreadcrumbSchema, SeoHead} from '../components/SeoHead';
import {SITE_CONFIG} from '../config/site';
import {EN_STRINGS} from '../i18n/en';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const breadcrumbs = [
    {label: EN_STRINGS.common.home, url: '/'},
    {label: EN_STRINGS.nav.contact, url: '/contact'},
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email address, and message.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');

    try {
      const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(SITE_CONFIG.contactEmail)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          _subject: cleanSubject || `${SITE_CONFIG.siteName} Contact Inquiry`,
          message: cleanMessage,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;

      if (!response.ok || (data && data.success === false)) {
        throw new Error(
          data?.message || 'Unable to deliver your message right now.',
        );
      }

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? `${err.message} You can also email us directly at ${SITE_CONFIG.contactEmail}.`
          : `Submission failed. Please email ${SITE_CONFIG.contactEmail} directly.`,
      );
    }
  };

  return (
    <>
      <SeoHead
        title={`Contact ${SITE_CONFIG.siteName} — Feedback & Questions`}
        description={`Reach the ${SITE_CONFIG.siteName} team with tool requests, feedback, or support inquiries via our contact form.`}
        canonicalPath="/contact"
        jsonLd={[buildBreadcrumbSchema(breadcrumbs)]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Contact Us
            </h1>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Have a question about upcoming tools, want to suggest a utility for File Tools or Web
              Tools, or spotted an issue? Send us a message directly.
            </p>

            <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Mail className="h-4 w-4 text-[#0A8CFF]" aria-hidden="true" />
                <span>Direct Email</span>
              </div>
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="block text-sm font-medium text-[#0A8CFF] hover:underline break-all"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Form submissions are routed through FormSubmit directly to our inbox.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.06)] dark:shadow-none">
              {status === 'success' ? (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 text-center"
                >
                  <CheckCircle2
                    className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <h2 className="mt-3 font-display text-xl font-bold text-slate-950 dark:text-white">
                    Message sent
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    Thank you for reaching out to {SITE_CONFIG.siteName}. Your note has been
                    submitted to {SITE_CONFIG.contactEmail}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-5 inline-flex h-10 items-center rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] px-5 text-sm font-semibold text-white transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {status === 'error' && errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50/80 dark:bg-rose-950/30 p-3.5 text-sm text-rose-800 dark:text-rose-200"
                    >
                      <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Subject <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Feature request or question"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you're looking for or how we can help..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#0A8CFF] hover:bg-[#0077E6] disabled:opacity-60 px-7 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A8CFF] cursor-pointer"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
