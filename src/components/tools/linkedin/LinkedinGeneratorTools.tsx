import React, {useMemo, useState} from 'react';
import {AlertCircle, Check, Copy, Download, RefreshCw, RotateCcw} from 'lucide-react';
import {
  generateLinkedInCaptions,
  generateLinkedInColdDms,
  generateLinkedInComments,
  generateLinkedInConnectionMessages,
  generateLinkedInContentIdeas,
  generateLinkedInExperienceBullets,
  generateLinkedInJobApplicationMessages,
  generateLinkedInJobDescription,
  generateLinkedInRecommendations,
  generateLinkedInReplies,
  generateLinkedInSkills,
  generateLinkedInUsernames,
  type LinkedInCaptionTone,
  type LinkedInCommentAngle,
  type LinkedInConnectionCategory,
  type LinkedInDmGoal,
  type LinkedInExperienceFormat,
  type LinkedInIdeaFocus,
  type LinkedInJobAppTemplate,
  type LinkedInRelationship,
  type LinkedInReplyGoal,
  type LinkedInSkillTrack,
} from '../linkedinHelpers';

interface CopyProps {
  onCopy: (txt: string, key: string) => void;
  copiedKey: string | null;
}

function downloadTxt(filename: string, content: string) {
  const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function TemplateNotice({extra}: {extra?: string}) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
      <strong>Template/formula-based only — NOT AI-generated.</strong>
      {extra ? ` ${extra}` : ''}
    </div>
  );
}

function InlineErr({message}: {message: string | null}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function CopyBtn({text, copyId, onCopy, copiedKey, label = 'Copy'}: CopyProps & {text: string; copyId: string; label?: string}) {
  const isCopied = copiedKey === copyId;
  return (
    <button
      type="button"
      onClick={() => onCopy(text, copyId)}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
    >
      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{isCopied ? 'Copied' : label}</span>
    </button>
  );
}

// ============================================================================
// 1. LinkedIn Caption Generator
// ============================================================================
export function LinkedinCaptionGenerator({onCopy, copiedKey}: CopyProps) {
  const [topic, setTopic] = useState('Async Team Documentation');
  const [takeaway, setTakeaway] = useState('Clear decision logs save 3+ hours of status meetings every week');
  const [example, setExample] = useState('We replaced Monday syncs with a 5-bullet weekly changelog');
  const [cta, setCta] = useState('What async habit saved your team the most time?');
  const [tone, setTone] = useState<LinkedInCaptionTone>('framework');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInCaptions({topic, takeaway, example, cta, tone, variation})),
    [topic, takeaway, example, cta, tone, variation, error],
  );

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter a post topic before generating captions.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Builds scannable posts within LinkedIn’s 3,000-character limit and ~210-character 'See more' fold." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Core Topic *</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value.trim()) setError(null);
            }}
            placeholder="e.g., B2B SaaS Onboarding"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Post Angle / Template</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as LinkedInCaptionTone)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="framework">Framework / How-To</option>
            <option value="story">Lesson Learned / Story</option>
            <option value="contrarian">Myth vs Reality</option>
            <option value="milestone">Milestone / Retrospective</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Key Takeaway</span>
          <input
            type="text"
            value={takeaway}
            onChange={(e) => setTakeaway(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Concrete Example / Proof</span>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Closing Question / CTA</span>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Rotate Caption Templates
        </button>
        {items.length > 0 && (
          <>
            <CopyBtn
              text={items.map((i) => `[${i.label}]\n${i.text}`).join('\n\n---\n\n')}
              copyId="li-cap-all"
              label="Copy All"
              onCopy={onCopy}
              copiedKey={copiedKey}
            />
            <button
              type="button"
              onClick={() => downloadTxt('linkedin_captions.txt', items.map((i) => i.text).join('\n\n---\n\n'))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-semibold"
            >
              <Download className="h-3.5 w-3.5" /> Save .txt
            </button>
          </>
        )}
      </div>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100">{c.label}</span>
                <span className={`font-mono text-[11px] ${c.overLimit ? 'text-rose-600' : 'text-slate-500'}`}>
                  {c.chars} / 3,000 chars · Hook: {c.hookChars}/210
                </span>
              </div>
              <CopyBtn text={c.text} copyId={c.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 leading-relaxed">
              {c.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 2. LinkedIn Username Generator
// ============================================================================
export function LinkedinUsernameGenerator({onCopy, copiedKey}: CopyProps) {
  const [firstName, setFirstName] = useState('Jordan');
  const [lastName, setLastName] = useState('Patel');
  const [keyword, setKeyword] = useState('Product');
  const [credential, setCredential] = useState('');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(
    () => (error ? [] : generateLinkedInUsernames({firstName, lastName, keyword, credential, variation})),
    [firstName, lastName, keyword, credential, variation, error],
  );

  const handleGenerate = () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError('Please enter at least a first or last name.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Formats valid 3–100 character /in/ handles (letters, numbers, hyphens). Does NOT check live LinkedIn availability." />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">First Name *</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (e.target.value.trim() || lastName.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Last Name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (e.target.value.trim() || firstName.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Specialty / Role</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., UX, Cloud, CPA"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Credential (Optional)</span>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="e.g., PMP, MBA, PhD"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Generate / Rotate Handles
        </button>
        {options.length > 0 && (
          <CopyBtn
            text={options.map((o) => `${o.handle} (${o.url})`).join('\n')}
            copyId="li-user-all"
            label="Copy All"
            onCopy={onCopy}
            copiedKey={copiedKey}
          />
        )}
      </div>

      <InlineErr message={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-xs">
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500">{o.style} · {o.chars} chars</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white truncate">{o.handle}</div>
              <div className="text-[11px] text-sky-600 truncate">{o.url}</div>
            </div>
            <CopyBtn text={o.handle} copyId={o.id} label="Copy Slug" onCopy={onCopy} copiedKey={copiedKey} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 3. LinkedIn Content Idea Generator
// ============================================================================
export function LinkedinContentIdeaGenerator({onCopy, copiedKey}: CopyProps) {
  const [role, setRole] = useState('Operations Lead');
  const [topic, setTopic] = useState('Remote Onboarding');
  const [audience, setAudience] = useState('growing B2B teams');
  const [focus, setFocus] = useState<LinkedInIdeaFocus>('b2b');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ideas = useMemo(
    () => (error ? [] : generateLinkedInContentIdeas({role, topic, audience, focus, variation})),
    [role, topic, audience, focus, variation, error],
  );

  const handleGenerate = () => {
    if (!role.trim() || !topic.trim()) {
      setError('Please enter both your role and core topic.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Generates repeatable B2B & career post prompts locally." />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Your Role *</span>
          <input
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (e.target.value.trim() && topic.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Core Topic *</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (role.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Target Audience</span>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Goal / Focus</span>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value as LinkedInIdeaFocus)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="b2b">B2B Specialist</option>
            <option value="career">Career / Job Search</option>
            <option value="founder">Founder / Build in Public</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Rotate Prompt Angles
        </button>
        {ideas.length > 0 && (
          <CopyBtn
            text={ideas.map((i) => `${i.angle} (${i.recommendedFormat})\nHook: ${i.hook}\n${i.outline.map((o) => `- ${o}`).join('\n')}`).join('\n\n')}
            copyId="li-ideas-all"
            label="Copy All Prompts"
            onCopy={onCopy}
            copiedKey={copiedKey}
          />
        )}
      </div>

      <InlineErr message={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ideas.map((idea) => {
          const fullText = `${idea.hook}\n\n${idea.outline.map((o) => `• ${o}`).join('\n')}`;
          return (
            <div key={idea.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{idea.angle}</div>
                  <div className="text-[11px] font-medium text-sky-600">{idea.recommendedFormat}</div>
                </div>
                <CopyBtn text={fullText} copyId={idea.id} onCopy={onCopy} copiedKey={copiedKey} />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{idea.hook}</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                {idea.outline.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 4. LinkedIn Comment Generator
// ============================================================================
export function LinkedinCommentGenerator({onCopy, copiedKey}: CopyProps) {
  const [topic, setTopic] = useState('Customer Retention');
  const [point, setPoint] = useState('proactive 30-day check-ins prevent silent churn');
  const [angle, setAngle] = useState<LinkedInCommentAngle>('addition');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInComments({topic, point, angle, variation})),
    [topic, point, angle, variation, error],
  );

  const handleGenerate = () => {
    if (!topic.trim() || !point.trim()) {
      setError('Please enter both the post topic and your key takeaway/point.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Formats constructive comments under LinkedIn’s 1,250-character comment limit. Never posts automatically." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Post Topic *</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value.trim() && point.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Comment Angle</span>
          <select
            value={angle}
            onChange={(e) => setAngle(e.target.value as LinkedInCommentAngle)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="addition">Constructive Addition</option>
            <option value="praise">Specific Praise</option>
            <option value="question">Follow-Up Question</option>
            <option value="example">Shared Example</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Your Specific Point / Observation *</span>
          <input
            type="text"
            value={point}
            onChange={(e) => {
              setPoint(e.target.value);
              if (topic.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Rotate Comment Templates
      </button>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {item.label} <span className="font-mono font-normal text-slate-500">({item.chars} / {item.limit} chars)</span>
              </span>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. LinkedIn Reply Generator
// ============================================================================
export function LinkedinReplyGenerator({onCopy, copiedKey}: CopyProps) {
  const [commenterName, setCommenterName] = useState('Alex');
  const [topic, setTopic] = useState('product roadmaps');
  const [detail, setDetail] = useState('trimming meetings to one 20-minute async doc review');
  const [goal, setGoal] = useState<LinkedInReplyGoal>('followup');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInReplies({commenterName, topic, detail, goal, variation})),
    [commenterName, topic, detail, goal, variation, error],
  );

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Please enter your post topic.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Drafts polite replies to comments on your own posts (≤1,250 chars)." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Commenter Name (Optional)</span>
          <input
            type="text"
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Post Topic *</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Reply Goal</span>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as LinkedInReplyGoal)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="followup">Follow-Up Question</option>
            <option value="thanks">Warm Thank-You</option>
            <option value="resource">Resource / Takeaway Pointer</option>
            <option value="clarify">Polite Clarification</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Answer Detail / Key Note</span>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Rotate Reply Templates
      </button>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {item.label} <span className="font-mono font-normal text-slate-500">({item.chars} / {item.limit} chars)</span>
              </span>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. LinkedIn Connection Message Generator (300 / 200 char limit toggle)
// ============================================================================
export function LinkedinConnectionMessageGenerator({onCopy, copiedKey}: CopyProps) {
  const [recipientName, setRecipientName] = useState('Maya');
  const [sharedContext, setSharedContext] = useState('Platform Engineering');
  const [yourRole, setYourRole] = useState('Backend Engineer');
  const [category, setCategory] = useState<LinkedInConnectionCategory>('peer');
  const [maxLimit, setMaxLimit] = useState<300 | 200>(300);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInConnectionMessages({recipientName, sharedContext, yourRole, category, maxLimit, variation})),
    [recipientName, sharedContext, yourRole, category, maxLimit, variation, error],
  );

  const handleGenerate = () => {
    if (!sharedContext.trim()) {
      setError('Please enter a shared topic, company, school, or group context.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Strictly tracks LinkedIn’s 300-character invite note limit (or 200-char free-account limit toggle)." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Recipient First Name</span>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Shared Context / Niche *</span>
          <input
            type="text"
            value={sharedContext}
            onChange={(e) => {
              setSharedContext(e.target.value);
              if (e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Your Role (Optional)</span>
          <input
            type="text"
            value={yourRole}
            onChange={(e) => setYourRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Connection Type</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LinkedInConnectionCategory)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="peer">Industry / Event Peer</option>
            <option value="recruiter">Recruiter / Talent</option>
            <option value="hiring_manager">Hiring Manager</option>
            <option value="alumni">School / Company Alumni</option>
            <option value="admirer">Content Creator / Author</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Rotate Invite Notes
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Note Limit:</span>
          <button
            type="button"
            onClick={() => setMaxLimit(300)}
            className={`px-2.5 py-1 rounded-lg font-medium ${maxLimit === 300 ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            300 Chars (Standard)
          </button>
          <button
            type="button"
            onClick={() => setMaxLimit(200)}
            className={`px-2.5 py-1 rounded-lg font-medium ${maxLimit === 200 ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            200 Chars (Free Cap)
          </button>
        </div>
      </div>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.label}</span>
                <span className={`font-mono text-[11px] font-semibold ${item.withinLimit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.chars} / {item.limit} chars
                </span>
              </div>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 7. LinkedIn Cold DM Generator
// ============================================================================
export function LinkedinColdDmGenerator({onCopy, copiedKey}: CopyProps) {
  const [recipientName, setRecipientName] = useState('Daniel');
  const [companyOrWork, setCompanyOrWork] = useState('scaling self-serve analytics at Northstar');
  const [yourValue, setYourValue] = useState('we help B2B data teams trim SQL dashboard latency by 50%');
  const [goal, setGoal] = useState<LinkedInDmGoal>('info_chat');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInColdDms({recipientName, companyOrWork, yourValue, goal, variation})),
    [recipientName, companyOrWork, yourValue, goal, variation, error],
  );

  const handleGenerate = () => {
    if (!companyOrWork.trim() || !yourValue.trim()) {
      setError('Please fill both what you observed and your context/value.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Manual outreach drafts only — never connects to LinkedIn or sends automated DMs." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Recipient Name</span>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Outreach Goal</span>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as LinkedInDmGoal)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="info_chat">Informational Chat / Advice</option>
            <option value="partnership">Partnership / Collab Pitch</option>
            <option value="b2b_intro">B2B Value Intro</option>
            <option value="followup">Polite Warm Follow-Up</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Recipient Work / Observation *</span>
          <input
            type="text"
            value={companyOrWork}
            onChange={(e) => {
              setCompanyOrWork(e.target.value);
              if (e.target.value.trim() && yourValue.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Your Context / Relevance *</span>
          <input
            type="text"
            value={yourValue}
            onChange={(e) => {
              setYourValue(e.target.value);
              if (companyOrWork.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Rotate DM Templates
      </button>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {item.label} <span className="font-mono font-normal text-slate-500">({item.words} words · {item.chars} chars)</span>
              </span>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 leading-relaxed">
              {item.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. LinkedIn Job Description Generator
// ============================================================================
export function LinkedinJobDescriptionGenerator({onCopy, copiedKey}: CopyProps) {
  const [roleTitle, setRoleTitle] = useState('Senior Frontend Engineer');
  const [company, setCompany] = useState('Acme Analytics');
  const [workModel, setWorkModel] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [location, setLocation] = useState('Austin, TX (or US Remote)');
  const [level, setLevel] = useState('Senior');
  const [salaryRange, setSalaryRange] = useState('$155,000 – $180,000 + equity');
  const [teamSummary, setTeamSummary] = useState('Build accessible, fast interactive analytics tools used by 40k+ product teams daily.');
  const [responsibilities, setResponsibilities] = useState(
    'Architect modular React & TypeScript interfaces\nPartner with design to uphold WCAG accessibility\nWrite thorough unit & Playwright browser tests',
  );
  const [qualifications, setQualifications] = useState(
    '5+ years production TypeScript and React experience\nStrong track record shipping customer-facing web apps\nClear async written communication skills',
  );
  const [benefits, setBenefits] = useState('Medical, dental & vision coverage\n401(k) match + annual learning stipend');
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(
    () =>
      error
        ? {text: '', chars: 0, words: 0}
        : generateLinkedInJobDescription({
            roleTitle,
            company,
            workModel,
            location,
            level,
            salaryRange,
            teamSummary,
            responsibilities,
            qualifications,
            benefits,
          }),
    [roleTitle, company, workModel, location, level, salaryRange, teamSummary, responsibilities, qualifications, benefits, error],
  );

  const validateAndRefresh = () => {
    if (!roleTitle.trim()) {
      setError('Please enter a role title to format a job description.');
      return;
    }
    setError(null);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Formats structured hiring posts ready to copy into LinkedIn Jobs manually." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Role Title *</span>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => {
              setRoleTitle(e.target.value);
              if (e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Company</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Work Model</span>
          <select
            value={workModel}
            onChange={(e) => setWorkModel(e.target.value as 'Remote' | 'Hybrid' | 'On-site')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Location</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Seniority Level</span>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Salary Range (Optional)</span>
          <input
            type="text"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Team / Role Overview</span>
          <input
            type="text"
            value={teamSummary}
            onChange={(e) => setTeamSummary(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Responsibilities (one per line)</span>
          <textarea
            rows={3}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Qualifications (one per line)</span>
          <textarea
            rows={3}
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Benefits (one per line)</span>
          <textarea
            rows={2}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={validateAndRefresh}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          Format Job Description
        </button>
        {output.text && (
          <>
            <CopyBtn text={output.text} copyId="li-jd-copy" label="Copy Job Post" onCopy={onCopy} copiedKey={copiedKey} />
            <button
              type="button"
              onClick={() => downloadTxt('linkedin_job_description.txt', output.text)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-semibold"
            >
              <Download className="h-3.5 w-3.5" /> Download .txt
            </button>
          </>
        )}
      </div>

      <InlineErr message={error} />

      {output.text && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
          <div className="flex justify-between font-mono text-[11px] text-slate-500">
            <span>Formatted Job Listing</span>
            <span>{output.words} words · {output.chars} chars</span>
          </div>
          <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3.5 leading-relaxed">
            {output.text}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. LinkedIn Job Application Message Generator
// ============================================================================
export function LinkedinJobApplicationMessageGenerator({onCopy, copiedKey}: CopyProps) {
  const [recipientName, setRecipientName] = useState('Taylor');
  const [roleTitle, setRoleTitle] = useState('Product Designer');
  const [company, setCompany] = useState('Harbor Health');
  const [proofMetric, setProofMetric] = useState('redesigned checkout flows boosting completion by 24%');
  const [mode, setMode] = useState<'full_dm' | 'connection_note'>('full_dm');
  const [template, setTemplate] = useState<LinkedInJobAppTemplate>('post_apply');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInJobApplicationMessages({recipientName, roleTitle, company, proofMetric, mode, template, variation})),
    [recipientName, roleTitle, company, proofMetric, mode, template, variation, error],
  );

  const handleGenerate = () => {
    if (!roleTitle.trim() || !company.trim() || !proofMetric.trim()) {
      setError('Please enter role title, company name, and 1 relevant proof point.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Switch between 300-char Connection Note mode and Full DM recruiter outreach." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Recipient Name</span>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Scenario Template</span>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as LinkedInJobAppTemplate)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="post_apply">Post-Application Recruiter Follow-Up</option>
            <option value="hiring_manager">Direct Hiring Manager Note</option>
            <option value="referral">Team Member / Referral Ask</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Role Applied For *</span>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => {
              setRoleTitle(e.target.value);
              if (e.target.value.trim() && company.trim() && proofMetric.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Company Name *</span>
          <input
            type="text"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (roleTitle.trim() && e.target.value.trim() && proofMetric.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">1 Relevant Achievement / Metric *</span>
          <input
            type="text"
            value={proofMetric}
            onChange={(e) => {
              setProofMetric(e.target.value);
              if (roleTitle.trim() && company.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Rotate Messages
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('full_dm')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'full_dm' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Full DM / InMail
          </button>
          <button
            type="button"
            onClick={() => setMode('connection_note')}
            className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'connection_note' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Short Connection Note (≤300)
          </button>
        </div>
      </div>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {item.label}{' '}
                <span className={`font-mono text-[11px] ${item.withinLimit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({item.chars} / {item.limit} chars)
                </span>
              </span>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 leading-relaxed">
              {item.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 10. LinkedIn Experience Description Generator (2,000 char Experience limit)
// ============================================================================
export function LinkedinExperienceDescriptionGenerator({onCopy, copiedKey}: CopyProps) {
  const [roleTitle, setRoleTitle] = useState('Growth Marketing Manager');
  const [company, setCompany] = useState('CloudScale');
  const [actionOwned, setActionOwned] = useState('rebuilt SEO landing page funnel & lifecycle onboarding emails');
  const [metricOutcome, setMetricOutcome] = useState('+38% qualified trial signups over 2 quarters');
  const [toolsUsed, setToolsUsed] = useState('HubSpot, GA4, SQL, Looker Studio');
  const [format, setFormat] = useState<LinkedInExperienceFormat>('summary_plus_bullets');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(
    () =>
      error
        ? {text: '', chars: 0, limit: 2000, withinLimit: true}
        : generateLinkedInExperienceBullets({roleTitle, company, actionOwned, metricOutcome, toolsUsed, format, variation}),
    [roleTitle, company, actionOwned, metricOutcome, toolsUsed, format, variation, error],
  );

  const handleGenerate = () => {
    if (!roleTitle.trim() || !actionOwned.trim() || !metricOutcome.trim()) {
      setError('Please enter your role title, action owned, and measurable outcome.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Formats Action + Metric + Outcome bullets within LinkedIn’s 2,000-character Experience entry limit." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Role Title *</span>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => {
              setRoleTitle(e.target.value);
              if (e.target.value.trim() && actionOwned.trim() && metricOutcome.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Company</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Bullet Format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as LinkedInExperienceFormat)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="summary_plus_bullets">Summary + Achievement Bullets</option>
            <option value="impact_first">Metric-First Bullets</option>
            <option value="car_method">Challenge → Action → Result</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">What You Owned / Built *</span>
          <input
            type="text"
            value={actionOwned}
            onChange={(e) => {
              setActionOwned(e.target.value);
              if (roleTitle.trim() && e.target.value.trim() && metricOutcome.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Measurable Outcome / Metric *</span>
          <input
            type="text"
            value={metricOutcome}
            onChange={(e) => {
              setMetricOutcome(e.target.value);
              if (roleTitle.trim() && actionOwned.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Tools / Stack</span>
          <input
            type="text"
            value={toolsUsed}
            onChange={(e) => setToolsUsed(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Format / Rotate Variant
      </button>

      <InlineErr message={error} />

      {result.text && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-mono text-[11px] font-semibold ${result.withinLimit ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.chars} / {result.limit} chars {result.withinLimit ? '(Fits LinkedIn Experience field)' : '(Exceeds 2,000 limit)'}
            </span>
            <CopyBtn text={result.text} copyId="li-exp-copy" label="Copy Bullets" onCopy={onCopy} copiedKey={copiedKey} />
          </div>
          <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3.5 leading-relaxed">
            {result.text}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. LinkedIn Skills Generator (Max 50 LinkedIn Profile Skills)
// ============================================================================
export function LinkedinSkillsGenerator({onCopy, copiedKey}: CopyProps) {
  const [track, setTrack] = useState<LinkedInSkillTrack>('engineering');
  const [customTools, setCustomTools] = useState('GraphQL, Kubernetes, Terraform');
  const [selected, setSelected] = useState<string[] | null>(null);

  const generated = useMemo(() => generateLinkedInSkills({track, customTools}), [track, customTools]);
  const activeSkills = selected ?? generated.allSkills;

  const toggleSkill = (skill: string) => {
    const current = new Set(activeSkills);
    if (current.has(skill)) {
      current.delete(skill);
    } else if (current.size < 50) {
      current.add(skill);
    }
    setSelected(Array.from(current));
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Organizes Hard Skills, Tools, and Domain Competencies within LinkedIn’s 50-skill profile cap. Does not inspect your live profile." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Career Track</span>
          <select
            value={track}
            onChange={(e) => {
              setTrack(e.target.value as LinkedInSkillTrack);
              setSelected(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="engineering">Software Engineering</option>
            <option value="product">Product Management</option>
            <option value="design">Product Design / UX</option>
            <option value="marketing">B2B / Growth Marketing</option>
            <option value="sales">B2B Sales / Account Exec</option>
            <option value="finance">Finance / FP&amp;A</option>
            <option value="ops">Operations &amp; Program Mgmt</option>
            <option value="custom">Custom List Only</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Custom Priority Tools / Skills (comma-separated)</span>
          <input
            type="text"
            value={customTools}
            onChange={(e) => {
              setCustomTools(e.target.value);
              setSelected(null);
            }}
            placeholder="e.g., Python, Snowflake, dbt"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <div className="rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/30 p-3.5 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-sky-900 dark:text-sky-200">
            Top 5 Priority Skills (Put First on Profile)
          </span>
          <CopyBtn
            text={activeSkills.slice(0, 5).join(', ')}
            copyId="li-skills-top5"
            label="Copy Top 5"
            onCopy={onCopy}
            copiedKey={copiedKey}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeSkills.slice(0, 5).map((s) => (
            <span key={s} className="rounded-lg bg-sky-600 text-white px-2.5 py-1 font-semibold">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-100">
            Curated Skills ({activeSkills.length} / {generated.limit} LinkedIn max) — Click any skill to toggle
          </span>
          <div className="flex items-center gap-2">
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
            <CopyBtn
              text={activeSkills.join(', ')}
              copyId="li-skills-all"
              label="Copy All"
              onCopy={onCopy}
              copiedKey={copiedKey}
            />
            <button
              type="button"
              onClick={() => downloadTxt('linkedin_skills.txt', activeSkills.join('\n'))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-semibold"
            >
              <Download className="h-3.5 w-3.5" /> .txt
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {generated.allSkills.map((skill) => {
            const on = activeSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-lg border px-2.5 py-1 font-medium transition ${
                  on
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. LinkedIn Recommendation Generator (3,000 char cap)
// ============================================================================
export function LinkedinRecommendationGenerator({onCopy, copiedKey}: CopyProps) {
  const [personName, setPersonName] = useState('Elena');
  const [relationship, setRelationship] = useState<LinkedInRelationship>('peer');
  const [strengths, setStrengths] = useState('calm technical judgment and reliable cross-team communication');
  const [projectOutcome, setProjectOutcome] = useState('our Q4 billing migration with zero downtime');
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => (error ? [] : generateLinkedInRecommendations({personName, relationship, strengths, projectOutcome, variation})),
    [personName, relationship, strengths, projectOutcome, variation, error],
  );

  const handleGenerate = () => {
    if (!personName.trim() || !strengths.trim() || !projectOutcome.trim()) {
      setError('Please enter your colleague’s name, key strengths, and a specific project/outcome.');
      return;
    }
    setError(null);
    setVariation((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice extra="Formats 100–180 word colleague endorsements strictly within LinkedIn’s 3,000-character recommendation limit." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Colleague Name *</span>
          <input
            type="text"
            value={personName}
            onChange={(e) => {
              setPersonName(e.target.value);
              if (e.target.value.trim() && strengths.trim() && projectOutcome.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Working Relationship</span>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as LinkedInRelationship)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            <option value="peer">Peer / Teammate</option>
            <option value="direct_report">Direct Report (I managed them)</option>
            <option value="manager">Manager (They managed me)</option>
            <option value="mentor">Mentor / Advisor</option>
            <option value="client">Client / External Partner</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">2 Concrete Strengths *</span>
          <input
            type="text"
            value={strengths}
            onChange={(e) => {
              setStrengths(e.target.value);
              if (personName.trim() && e.target.value.trim() && projectOutcome.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Specific Project / Outcome *</span>
          <input
            type="text"
            value={projectOutcome}
            onChange={(e) => {
              setProjectOutcome(e.target.value);
              if (personName.trim() && strengths.trim() && e.target.value.trim()) setError(null);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Rotate Endorsement Drafts
      </button>

      <InlineErr message={error} />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {item.label}{' '}
                <span className="font-mono font-normal text-slate-500">
                  ({item.words} words · {item.chars} / 3,000 chars)
                </span>
              </span>
              <CopyBtn text={item.text} copyId={item.id} onCopy={onCopy} copiedKey={copiedKey} />
            </div>
            <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 leading-relaxed">
              {item.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
