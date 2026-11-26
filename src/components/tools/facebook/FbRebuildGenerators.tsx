import React, {useState} from 'react';
import {
  generateAdCopy,
  generateAdHeadlines,
  generateCamelCaseHashtags,
  generateFacebookComments,
  generateFacebookCtas,
  generateFacebookDms,
  generateFacebookReplies,
  generateGroupDescriptions,
  generateGroupNames,
  generatePostCaptions,
  generatePostIdeas,
  generateReelCaptions,
  generateReelIdeas,
  generateStoryIdeas,
  generateVideoDescriptions,
  generateVideoTitles,
  type AdCopyCta,
  type AdCopyTone,
  type AdCopyVariation,
  type AdHeadlineItem,
  type AdHeadlineStyle,
  type CommentTone,
  type CtaGoal,
  type CtaTone,
  type DmPurpose,
  type DmTone,
  type DmVariation,
  type GroupDescTone,
  type GroupNameStyle,
  type GroupPurpose,
  type PostCaptionGoal,
  type PostCaptionLength,
  type PostCaptionTone,
  type PostIdeaContentType,
  type ReelCaptionTone,
  type ReelIdeaItem,
  type ReelVideoStyle,
  type ReplyTone,
  type StoryIdeaItem,
  type StoryIdeaType,
  type VideoTitleStyle,
} from '../../../lib/facebook/textGenerators';
import {
  FbCopyButton,
  FbErrorAlert,
  FbGeneratorActionBar,
  FbWarningAlert,
  useClipboardState,
} from './FbSharedControls';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none focus:ring-2 focus:ring-[#0A8CFF]/20';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

function TemplateNotice({text}: {text: string}) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/30 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-200">
      {text}
    </div>
  );
}

// ============================================================================
// 1. Facebook Post Caption Generator
// ============================================================================
export function FbPostCaptionGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<PostCaptionTone>('Friendly');
  const [goal, setGoal] = useState<PostCaptionGoal>('Engagement');
  const [length, setLength] = useState<PostCaptionLength>('Medium');
  const [count, setCount] = useState<3 | 5>(3);
  const [cta, setCta] = useState('');
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generatePostCaptions({topic, audience, tone, goal, length, count, cta, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setAudience('');
    setTone('Friendly');
    setGoal('Engagement');
    setLength('Medium');
    setCount(3);
    setCta('');
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Enter your topic and options to build conversational Facebook captions." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="fb-pc-topic" className={LABEL_CLASS}>Topic / Subject <span className="text-rose-500">*</span></label>
          <input id="fb-pc-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Sunday meal prep for busy families" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pc-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-pc-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., working parents" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pc-cta" className={LABEL_CLASS}>Call to Action (optional)</label>
          <input id="fb-pc-cta" type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g., Share your favorite shortcut below!" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pc-tone" className={LABEL_CLASS}>Tone</label>
          <select id="fb-pc-tone" value={tone} onChange={(e) => setTone(e.target.value as PostCaptionTone)} className={INPUT_CLASS}>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Funny">Funny</option>
            <option value="Inspirational">Inspirational</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-pc-goal" className={LABEL_CLASS}>Post Goal</label>
          <select id="fb-pc-goal" value={goal} onChange={(e) => setGoal(e.target.value as PostCaptionGoal)} className={INPUT_CLASS}>
            <option value="Engagement">Engagement</option>
            <option value="Inform">Inform</option>
            <option value="Promote">Promote</option>
            <option value="Celebrate">Celebrate</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-pc-len" className={LABEL_CLASS}>Desired Length</label>
          <select id="fb-pc-len" value={length} onChange={(e) => setLength(e.target.value as PostCaptionLength)} className={INPUT_CLASS}>
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-pc-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-pc-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 3 | 5)} className={INPUT_CLASS}>
            <option value={3}>3 variations</option>
            <option value={5}>5 variations</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar
        primaryLabel="Generate Post Captions"
        hasOutput={output.length > 0}
        onGenerate={() => run(0)}
        onRegenerate={() => run(batch + 1)}
        onReset={reset}
      />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Generated Captions ({output.length})
            </span>
            <FbCopyButton text={output.join('\n\n---\n\n')} id="pc-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {output.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Variation {i + 1}</span>
                <FbCopyButton text={item} id={`pc-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
              <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {item}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. Facebook Hashtag Generator
// ============================================================================
export function FbHashtagGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [keywords, setKeywords] = useState('');
  const [niche, setNiche] = useState('');
  const [count, setCount] = useState<5 | 10 | 15>(10);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateCamelCaseHashtags({keywords, niche, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setKeywords('');
    setNiche('');
    setCount(10);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  const blockText = output.join(' ');

  return (
    <div className="space-y-4">
      <TemplateNotice text="Keyword-rule based only (no AI). Produces #CamelCase hashtags derived from your keywords. Note: hashtag reach is not guaranteed." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="fb-ht-kw" className={LABEL_CLASS}>Topic / Keywords <span className="text-rose-500">*</span></label>
          <input id="fb-ht-kw" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., local coffee shop" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ht-cnt" className={LABEL_CLASS}>Number of Hashtags</label>
          <select id="fb-ht-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10 | 15)} className={INPUT_CLASS}>
            <option value={5}>5 hashtags</option>
            <option value={10}>10 hashtags</option>
            <option value={15}>15 hashtags</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="fb-ht-niche" className={LABEL_CLASS}>Niche (optional)</label>
          <input id="fb-ht-niche" type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., small business" className={INPUT_CLASS} />
        </div>
      </div>

      <FbGeneratorActionBar
        primaryLabel="Generate Hashtags"
        hasOutput={output.length > 0}
        onGenerate={() => run(0)}
        onRegenerate={() => run(batch + 1)}
        onReset={reset}
      />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {output.length} #CamelCase Hashtags
            </span>
            <div className="flex items-center gap-2">
              <FbCopyButton text={blockText} id="ht-hashtags" copiedId={copiedId} onCopy={copy} label="Copy Hashtags" />
              <FbCopyButton text={output.join('\n')} id="ht-all" copiedId={copiedId} onCopy={copy} label="Copy All (Lines)" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {output.map((tag, i) => (
              <button
                key={`${tag}-${i}`}
                type="button"
                onClick={() => copy(tag, `ht-item-${i}`)}
                title="Click to copy hashtag"
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300 hover:border-blue-400 cursor-pointer"
              >
                <span>{tag}</span>
                {copiedId === `ht-item-${i}` && <span className="text-[10px] text-emerald-600">Copied</span>}
              </button>
            ))}
          </div>
          <pre data-result className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full">
            {blockText}
          </pre>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Note: Hashtag reach is not guaranteed on Facebook. Keep posts readable with focused, relevant tags.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Facebook Post Idea Generator
// ============================================================================
export function FbPostIdeaGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [contentType, setContentType] = useState<PostIdeaContentType>('Any');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generatePostIdeas({topic, audience, contentType, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setAudience('');
    setContentType('Any');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Generates concrete Facebook Page and Group post ideas tailored to your niche." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-pi-topic" className={LABEL_CLASS}>Niche / Topic <span className="text-rose-500">*</span></label>
          <input id="fb-pi-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., home baking" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pi-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-pi-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., weekend bakers" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-pi-type" className={LABEL_CLASS}>Content Type</label>
          <select id="fb-pi-type" value={contentType} onChange={(e) => setContentType(e.target.value as PostIdeaContentType)} className={INPUT_CLASS}>
            <option value="Any">Any</option>
            <option value="Question">Question</option>
            <option value="Story">Story</option>
            <option value="Tip">Tip</option>
            <option value="Poll">Poll</option>
            <option value="Behind-the-scenes">Behind-the-scenes</option>
            <option value="Promotion">Promotion</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-pi-cnt" className={LABEL_CLASS}>Number of Ideas</label>
          <select id="fb-pi-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
            <option value={5}>5 ideas</option>
            <option value={10}>10 ideas</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Post Ideas" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Publishable Post Ideas ({output.length})
            </span>
            <FbCopyButton text={output.map((it, i) => `${i + 1}. ${it}`).join('\n')} id="pi-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ol data-result className="space-y-2">
            {output.map((idea, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex items-start justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong className="font-mono text-blue-600 dark:text-blue-400 mr-2">{i + 1}.</strong>
                  {idea}
                </span>
                <FbCopyButton text={idea} id={`pi-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. Facebook Reel Idea Generator
// ============================================================================
export function FbReelIdeaGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState<ReelVideoStyle>('Tutorial');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<ReelIdeaItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateReelIdeas({topic, audience, style, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setAudience('');
    setStyle('Tutorial');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  const formatItem = (it: ReelIdeaItem, idx?: number) =>
    `${idx !== undefined ? `${idx + 1}. ` : ''}Hook (first 3 sec): ${it.hook}\nConcept: ${it.concept}\nSuggested length: ${it.length}`;

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Produces vertical Facebook Reel prompts with a 3-second hook, concept, and suggested duration." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-ri-topic" className={LABEL_CLASS}>Niche / Topic <span className="text-rose-500">*</span></label>
          <input id="fb-ri-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., indoor plants" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ri-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-ri-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., apartment renters" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ri-style" className={LABEL_CLASS}>Video Style</label>
          <select id="fb-ri-style" value={style} onChange={(e) => setStyle(e.target.value as ReelVideoStyle)} className={INPUT_CLASS}>
            <option value="Tutorial">Tutorial</option>
            <option value="Funny">Funny</option>
            <option value="Story">Story</option>
            <option value="Trend">Trend</option>
            <option value="Behind-the-scenes">Behind-the-scenes</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-ri-cnt" className={LABEL_CLASS}>Number of Ideas</label>
          <select id="fb-ri-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
            <option value={5}>5 ideas</option>
            <option value={10}>10 ideas</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Reel Ideas" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reel Ideas ({output.length})</span>
            <FbCopyButton text={output.map((it, i) => formatItem(it, i)).join('\n\n')} id="ri-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ol data-result className="space-y-2.5">
            {output.map((it, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">#{i + 1}</span>
                    <span className="rounded bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                      {it.length}
                    </span>
                  </div>
                  <FbCopyButton text={formatItem(it)} id={`ri-${i}`} copiedId={copiedId} onCopy={copy} />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Hook (0–3s): {it.hook}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{it.concept}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. Facebook Story Idea Generator
// ============================================================================
export function FbStoryIdeaGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [storyType, setStoryType] = useState<StoryIdeaType>('Any');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<StoryIdeaItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateStoryIdeas({topic, storyType, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setStoryType('Any');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Each Story idea specifies the Facebook Story format and exact frame prompt." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label htmlFor="fb-si-topic" className={LABEL_CLASS}>Niche / Topic <span className="text-rose-500">*</span></label>
          <input id="fb-si-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., boutique fitness studio" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-si-type" className={LABEL_CLASS}>Story Type</label>
          <select id="fb-si-type" value={storyType} onChange={(e) => setStoryType(e.target.value as StoryIdeaType)} className={INPUT_CLASS}>
            <option value="Any">Any</option>
            <option value="Poll">Poll</option>
            <option value="Q&A">Q&amp;A</option>
            <option value="Behind-the-scenes">Behind-the-scenes</option>
            <option value="Tip">Tip</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-si-cnt" className={LABEL_CLASS}>Number of Ideas</label>
          <select id="fb-si-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
            <option value={5}>5 ideas</option>
            <option value={10}>10 ideas</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Story Ideas" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Story Ideas ({output.length})</span>
            <FbCopyButton text={output.map((it, i) => `${i + 1}. [${it.format}] ${it.content}`).join('\n')} id="si-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ol data-result className="space-y-2">
            {output.map((it, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex items-start justify-between gap-3">
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{i + 1}.</span>
                    <span className="rounded bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      Format: {it.format}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{it.content}</p>
                </div>
                <FbCopyButton text={`[${it.format}] ${it.content}`} id={`si-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. Facebook Reel Caption Generator
// ============================================================================
export function FbReelCaptionGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ReelCaptionTone>('Casual');
  const [count, setCount] = useState<3 | 5>(3);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateReelCaptions({topic, tone, count, includeHashtags, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setTone('Casual');
    setCount(3);
    setIncludeHashtags(true);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Short, hook-first 1–3 line captions built for above the Facebook Reels player bar." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="fb-rc-topic" className={LABEL_CLASS}>Reel Topic <span className="text-rose-500">*</span></label>
          <input id="fb-rc-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., iced latte recipe in 30 seconds" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-rc-tone" className={LABEL_CLASS}>Tone</label>
          <select id="fb-rc-tone" value={tone} onChange={(e) => setTone(e.target.value as ReelCaptionTone)} className={INPUT_CLASS}>
            <option value="Funny">Funny</option>
            <option value="Informative">Informative</option>
            <option value="Inspirational">Inspirational</option>
            <option value="Casual">Casual</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-rc-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-rc-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 3 | 5)} className={INPUT_CLASS}>
            <option value={3}>3 variations</option>
            <option value={5}>5 variations</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="rounded border-slate-300 text-[#0A8CFF]" />
            <span>Include #CamelCase topic hashtags</span>
          </label>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Reel Captions" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Reel Captions ({output.length})</span>
            <FbCopyButton text={output.join('\n\n---\n\n')} id="rc-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {output.map((cap, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex items-start justify-between gap-3">
              <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{cap}</pre>
              <FbCopyButton text={cap} id={`rc-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. Facebook Video Title Generator
// ============================================================================
export function FbVideoTitleGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState<VideoTitleStyle>('How-to');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateVideoTitles({topic, audience, style, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setAudience('');
    setStyle('How-to');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Formula-based only (no AI). Generates clickable, readable titles for Facebook Watch and Page videos." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-vt-topic" className={LABEL_CLASS}>Video Topic <span className="text-rose-500">*</span></label>
          <input id="fb-vt-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., DSLR camera settings" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-vt-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-vt-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., beginners" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-vt-style" className={LABEL_CLASS}>Title Style</label>
          <select id="fb-vt-style" value={style} onChange={(e) => setStyle(e.target.value as VideoTitleStyle)} className={INPUT_CLASS}>
            <option value="How-to">How-to</option>
            <option value="List">List</option>
            <option value="Question">Question</option>
            <option value="Curiosity">Curiosity</option>
            <option value="Direct">Direct</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-vt-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-vt-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
            <option value={5}>5 titles</option>
            <option value={10}>10 titles</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Video Titles" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Video Titles ({output.length})</span>
            <FbCopyButton text={output.join('\n')} id="vt-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ul data-result className="space-y-2">
            {output.map((title, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-3.5 py-2.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span>
                  <span className="ml-2 text-[11px] font-mono text-slate-500">({title.length} chars)</span>
                </div>
                <FbCopyButton text={title} id={`vt-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 8. Facebook Video Description Generator
// ============================================================================
export function FbVideoDescriptionGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [cta, setCta] = useState('');
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState<string | undefined>();

  const run = (nextBatch = 0) => {
    const res = generateVideoDescriptions({topic, videoTitle, keyPoints, includeTimestamps, cta, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setNote(res.note);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setVideoTitle('');
    setKeyPoints('');
    setIncludeTimestamps(true);
    setCta('');
    setBatch(0);
    setOutput([]);
    setErrors([]);
    setNote(undefined);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Builds structured Facebook video descriptions from your topic, key points, and timestamps." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-vd-topic" className={LABEL_CLASS}>Video Topic <span className="text-rose-500">*</span></label>
          <input id="fb-vd-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Sourdough starter maintenance" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-vd-title" className={LABEL_CLASS}>Video Title (optional)</label>
          <input id="fb-vd-title" type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="e.g., Keep Your Starter Active All Week" className={INPUT_CLASS} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fb-vd-pts" className={LABEL_CLASS}>Key Points to Cover (optional, one per line)</label>
          <textarea id="fb-vd-pts" rows={3} value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} placeholder={"Feeding ratios explained\nRoom temp vs fridge storage\nHow to spot peak readiness"} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-vd-cta" className={LABEL_CLASS}>Call to Action (optional)</label>
          <input id="fb-vd-cta" type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g., Comment your baking questions below!" className={INPUT_CLASS} />
        </div>
        <div className="flex items-end pb-2">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" checked={includeTimestamps} onChange={(e) => setIncludeTimestamps(e.target.checked)} className="rounded border-slate-300 text-[#0A8CFF]" />
            <span>Include timestamps section</span>
          </label>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Video Descriptions" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Structured Descriptions ({output.length})</span>
            <FbCopyButton text={output.join('\n\n---\n\n')} id="vd-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {note && <p className="text-xs text-slate-500 dark:text-slate-400">{note}</p>}
          {output.map((desc, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Option {i + 1}</span>
                <FbCopyButton text={desc} id={`vd-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
              <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{desc}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. Facebook Comment Generator
// ============================================================================
export function FbCommentGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [postText, setPostText] = useState('');
  const [tone, setTone] = useState<CommentTone>('Supportive');
  const [count, setCount] = useState<3 | 5>(3);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateFacebookComments({postText, tone, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setPostText('');
    setTone('Supportive');
    setCount(3);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Drafts conversational comments tailored to the post topic or text you paste. Post manually on Facebook." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="fb-cm-post" className={LABEL_CLASS}>Post Topic or Pasted Post Text <span className="text-rose-500">*</span></label>
          <textarea id="fb-cm-post" rows={3} value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="e.g., Just launched our neighborhood weekend farmers market stand!" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-cm-tone" className={LABEL_CLASS}>Comment Tone</label>
          <select id="fb-cm-tone" value={tone} onChange={(e) => setTone(e.target.value as CommentTone)} className={INPUT_CLASS}>
            <option value="Supportive">Supportive</option>
            <option value="Funny">Funny</option>
            <option value="Thoughtful">Thoughtful</option>
            <option value="Congratulatory">Congratulatory</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-cm-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-cm-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 3 | 5)} className={INPUT_CLASS}>
            <option value={3}>3 variations</option>
            <option value={5}>5 variations</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Comments" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Draft Comments ({output.length})</span>
            <FbCopyButton text={output.join('\n\n')} id="cm-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {output.map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex items-start justify-between gap-3">
              <p data-result className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{c}</p>
              <FbCopyButton text={c} id={`cm-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 10. Facebook Reply Generator
// ============================================================================
export function FbReplyGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [receivedComment, setReceivedComment] = useState('');
  const [tone, setTone] = useState<ReplyTone>('Friendly');
  const [count, setCount] = useState<3 | 5>(3);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState<string | undefined>();

  const run = (nextBatch = 0) => {
    const res = generateFacebookReplies({receivedComment, tone, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setNote(res.note);
    setBatch(nextBatch);
  };

  const reset = () => {
    setReceivedComment('');
    setTone('Friendly');
    setCount(3);
    setBatch(0);
    setOutput([]);
    setErrors([]);
    setNote(undefined);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Drafts contextual replies to comments on your posts—replace bracketed placeholders with your specifics." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="fb-rp-comment" className={LABEL_CLASS}>Comment Received <span className="text-rose-500">*</span></label>
          <textarea id="fb-rp-comment" rows={3} value={receivedComment} onChange={(e) => setReceivedComment(e.target.value)} placeholder="e.g., Does this shipping schedule cover weekend orders too?" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-rp-tone" className={LABEL_CLASS}>Reply Tone</label>
          <select id="fb-rp-tone" value={tone} onChange={(e) => setTone(e.target.value as ReplyTone)} className={INPUT_CLASS}>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Funny">Funny</option>
            <option value="Thankful">Thankful</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-rp-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-rp-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 3 | 5)} className={INPUT_CLASS}>
            <option value={3}>3 variations</option>
            <option value={5}>5 variations</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Replies" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Draft Replies ({output.length})</span>
            <FbCopyButton text={output.join('\n\n')} id="rp-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {note && <p className="text-xs text-slate-500 dark:text-slate-400">{note}</p>}
          {output.map((r, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex items-start justify-between gap-3">
              <p data-result className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{r}</p>
              <FbCopyButton text={r} id={`rp-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. Facebook DM Generator
// ============================================================================
export function FbDmGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [purpose, setPurpose] = useState<DmPurpose>('Outreach');
  const [recipientName, setRecipientName] = useState('');
  const [keyDetails, setKeyDetails] = useState('');
  const [tone, setTone] = useState<DmTone>('Friendly');
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<DmVariation[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateFacebookDms({purpose, recipientName, keyDetails, tone, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setPurpose('Outreach');
    setRecipientName('');
    setKeyDetails('');
    setTone('Friendly');
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Produces one polished DM plus 2 shorter alternatives for Facebook Messenger." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label htmlFor="fb-dm-purpose" className={LABEL_CLASS}>Message Purpose</label>
          <select id="fb-dm-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value as DmPurpose)} className={INPUT_CLASS}>
            <option value="Outreach">Outreach</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Thank you">Thank you</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Customer reply">Customer reply</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-dm-name" className={LABEL_CLASS}>Recipient Name (optional)</label>
          <input id="fb-dm-name" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g., Sarah" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-dm-tone" className={LABEL_CLASS}>Tone</label>
          <select id="fb-dm-tone" value={tone} onChange={(e) => setTone(e.target.value as DmTone)} className={INPUT_CLASS}>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="fb-dm-details" className={LABEL_CLASS}>Key Details (what the message is about) <span className="text-rose-500">*</span></label>
          <textarea id="fb-dm-details" rows={3} value={keyDetails} onChange={(e) => setKeyDetails(e.target.value)} placeholder="e.g., co-hosting a live Q&A next Thursday on community gardening" className={INPUT_CLASS} />
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate DMs" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Messenger Drafts (1 Full + 2 Shorter)</span>
            <FbCopyButton text={output.map((d) => `[${d.label}]\n${d.message}`).join('\n\n---\n\n')} id="dm-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {output.map((dm, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{dm.label}</span>
                <FbCopyButton text={dm.message} id={`dm-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
              <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{dm.message}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 12. Facebook Ad Headline Generator (strict <= 40 chars)
// ============================================================================
export function FbAdHeadlineGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [benefitOrOffer, setBenefitOrOffer] = useState('');
  const [style, setStyle] = useState<AdHeadlineStyle>('Benefit');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<AdHeadlineItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateAdHeadlines({product, audience, benefitOrOffer, style, count, batch: nextBatch});
    setErrors(res.errors);
    setWarnings(res.warnings);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setProduct('');
    setAudience('');
    setBenefitOrOffer('');
    setStyle('Benefit');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
    setWarnings([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Formula-based only (no AI). Strictly enforces Facebook's 40-character ad headline limit and rejects candidates over 40 chars." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-ah-prod" className={LABEL_CLASS}>Product / Offer (≤ 40 chars) <span className="text-rose-500">*</span></label>
          <input id="fb-ah-prod" type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., Meal Planner" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ah-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-ah-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Busy Parents" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ah-ben" className={LABEL_CLASS}>Benefit or Offer Detail (optional)</label>
          <input id="fb-ah-ben" type="text" value={benefitOrOffer} onChange={(e) => setBenefitOrOffer(e.target.value)} placeholder="e.g., 20% Off" className={INPUT_CLASS} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="fb-ah-style" className={LABEL_CLASS}>Style</label>
            <select id="fb-ah-style" value={style} onChange={(e) => setStyle(e.target.value as AdHeadlineStyle)} className={INPUT_CLASS}>
              <option value="Benefit">Benefit</option>
              <option value="Question">Question</option>
              <option value="Offer">Offer</option>
              <option value="Urgency">Urgency</option>
            </select>
          </div>
          <div>
            <label htmlFor="fb-ah-cnt" className={LABEL_CLASS}>Count</label>
            <select id="fb-ah-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Ad Headlines" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />
      <FbWarningAlert warnings={warnings} />

      {output.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ad Headlines ≤ 40 Chars ({output.length})</span>
            <FbCopyButton text={output.map((h) => h.text).join('\n')} id="ah-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ul data-result className="space-y-2">
            {output.map((h, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-3.5 py-2.5 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{h.text}</span>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    {h.length}/40 chars
                  </span>
                </div>
                <FbCopyButton text={h.text} id={`ah-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 13. Facebook Ad Copy Generator
// ============================================================================
export function FbAdCopyGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [benefit, setBenefit] = useState('');
  const [offer, setOffer] = useState('');
  const [tone, setTone] = useState<AdCopyTone>('Persuasive');
  const [cta, setCta] = useState<AdCopyCta>('Learn More');
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<AdCopyVariation[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateAdCopy({product, audience, benefit, offer, tone, cta, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setProduct('');
    setAudience('');
    setBenefit('');
    setOffer('');
    setTone('Persuasive');
    setCta('Learn More');
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  const formatAd = (ad: AdCopyVariation) =>
    `Primary Text:\n${ad.primaryText}\n\nHeadline (${ad.headlineLength}/40): ${ad.headline}\nDescription: ${ad.descriptionLine}\nCTA Button: ${ad.cta}`;

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Structures complete Facebook ads with Primary Text, ≤40-char Headline, Description, and CTA." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-ac-prod" className={LABEL_CLASS}>Product / Offer <span className="text-rose-500">*</span></label>
          <input id="fb-ac-prod" type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., CloudBook Notes" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ac-aud" className={LABEL_CLASS}>Audience (optional)</label>
          <input id="fb-ac-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., freelance designers" className={INPUT_CLASS} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fb-ac-ben" className={LABEL_CLASS}>Key Benefit <span className="text-rose-500">*</span></label>
          <input id="fb-ac-ben" type="text" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="e.g., organize client briefs and invoices in one place" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-ac-offer" className={LABEL_CLASS}>Offer / Discount (optional)</label>
          <input id="fb-ac-offer" type="text" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g., 14-day free trial" className={INPUT_CLASS} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="fb-ac-tone" className={LABEL_CLASS}>Tone</label>
            <select id="fb-ac-tone" value={tone} onChange={(e) => setTone(e.target.value as AdCopyTone)} className={INPUT_CLASS}>
              <option value="Persuasive">Persuasive</option>
              <option value="Friendly">Friendly</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label htmlFor="fb-ac-cta" className={LABEL_CLASS}>Call to Action</label>
            <select id="fb-ac-cta" value={cta} onChange={(e) => setCta(e.target.value as AdCopyCta)} className={INPUT_CLASS}>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Message Us">Message Us</option>
            </select>
          </div>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Ad Copy" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ad Copy Variations ({output.length})</span>
            <FbCopyButton text={output.map((a, i) => `--- Ad Variation ${i + 1} ---\n${formatAd(a)}`).join('\n\n')} id="ac-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {output.map((ad, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ad Variation {i + 1}</span>
                <FbCopyButton text={formatAd(ad)} id={`ac-${i}`} copiedId={copiedId} onCopy={copy} label="Copy Full Ad" />
              </div>
              <div data-result className="space-y-2.5 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Primary Text</span>
                  <pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-slate-800 dark:text-slate-200 leading-relaxed">{ad.primaryText}</pre>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white">{ad.headline}</strong>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {ad.headlineLength}/40 chars
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ad.descriptionLine}</p>
                  </div>
                  <span className="rounded-lg bg-slate-200 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    {ad.cta}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 14. Facebook CTA Generator
// ============================================================================
export function FbCtaGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [goal, setGoal] = useState<CtaGoal>('Buy');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<CtaTone>('Direct');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateFacebookCtas({goal, topic, tone, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setGoal('Buy');
    setTopic('');
    setTone('Direct');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Produces single-sentence Facebook CTAs matched to your exact campaign goal and tone." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-cta-goal" className={LABEL_CLASS}>Goal</label>
          <select id="fb-cta-goal" value={goal} onChange={(e) => setGoal(e.target.value as CtaGoal)} className={INPUT_CLASS}>
            <option value="Buy">Buy</option>
            <option value="Sign up">Sign up</option>
            <option value="Learn more">Learn more</option>
            <option value="Comment">Comment</option>
            <option value="Share">Share</option>
            <option value="Message">Message</option>
            <option value="Visit">Visit</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-cta-topic" className={LABEL_CLASS}>Product / Topic (optional)</label>
          <input id="fb-cta-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Spring Skincare Kit" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-cta-tone" className={LABEL_CLASS}>Tone</label>
          <select id="fb-cta-tone" value={tone} onChange={(e) => setTone(e.target.value as CtaTone)} className={INPUT_CLASS}>
            <option value="Direct">Direct</option>
            <option value="Friendly">Friendly</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-cta-cnt" className={LABEL_CLASS}>Variations</label>
          <select id="fb-cta-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
            <option value={5}>5 variations</option>
            <option value={10}>10 variations</option>
          </select>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate CTAs" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Call-to-Action Lines ({output.length})</span>
            <FbCopyButton text={output.join('\n')} id="cta-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ul data-result className="space-y-2">
            {output.map((line, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-3.5 py-2.5 flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">{line}</span>
                <FbCopyButton text={line} id={`cta-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 15. Facebook Group Name Generator
// ============================================================================
export function FbGroupNameGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [topic, setTopic] = useState('');
  const [purpose, setPurpose] = useState<GroupPurpose>('Community');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState<GroupNameStyle>('Descriptive');
  const [count, setCount] = useState<5 | 10>(5);
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const run = (nextBatch = 0) => {
    const res = generateGroupNames({topic, purpose, audience, style, count, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setBatch(nextBatch);
  };

  const reset = () => {
    setTopic('');
    setPurpose('Community');
    setAudience('');
    setStyle('Descriptive');
    setCount(5);
    setBatch(0);
    setOutput([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Builds group names directly from your topic and inputs—never checks live Facebook availability." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-gn-topic" className={LABEL_CLASS}>Group Topic / Niche <span className="text-rose-500">*</span></label>
          <input id="fb-gn-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Urban Gardening" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-gn-aud" className={LABEL_CLASS}>Audience or Location (optional)</label>
          <input id="fb-gn-aud" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Austin or Balcony Growers" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-gn-purpose" className={LABEL_CLASS}>Group Purpose</label>
          <select id="fb-gn-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value as GroupPurpose)} className={INPUT_CLASS}>
            <option value="Community">Community</option>
            <option value="Learning">Learning</option>
            <option value="Buy & Sell">Buy &amp; Sell</option>
            <option value="Support">Support</option>
            <option value="Hobby">Hobby</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="fb-gn-style" className={LABEL_CLASS}>Name Style</label>
            <select id="fb-gn-style" value={style} onChange={(e) => setStyle(e.target.value as GroupNameStyle)} className={INPUT_CLASS}>
              <option value="Descriptive">Descriptive</option>
              <option value="Creative">Creative</option>
              <option value="Short & catchy">Short &amp; catchy</option>
            </select>
          </div>
          <div>
            <label htmlFor="fb-gn-cnt" className={LABEL_CLASS}>Variations</label>
            <select id="fb-gn-cnt" value={count} onChange={(e) => setCount(Number(e.target.value) as 5 | 10)} className={INPUT_CLASS}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Group Names" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Group Name Ideas ({output.length})</span>
            <FbCopyButton text={output.join('\n')} id="gn-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          <ul data-result className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {output.map((name, i) => (
              <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</span>
                <FbCopyButton text={name} id={`gn-${i}`} copiedId={copiedId} onCopy={copy} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 16. Facebook Group Description Generator
// ============================================================================
export function FbGroupDescriptionGenerator() {
  const {copiedId, copy} = useClipboardState();
  const [groupName, setGroupName] = useState('');
  const [topic, setTopic] = useState('');
  const [whoFor, setWhoFor] = useState('');
  const [rulesSummary, setRulesSummary] = useState('');
  const [tone, setTone] = useState<GroupDescTone>('Welcoming');
  const [batch, setBatch] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState<string | undefined>();

  const run = (nextBatch = 0) => {
    const res = generateGroupDescriptions({groupName, topic, whoFor, rulesSummary, tone, batch: nextBatch});
    setErrors(res.errors);
    setOutput(res.items);
    setNote(res.note);
    setBatch(nextBatch);
  };

  const reset = () => {
    setGroupName('');
    setTopic('');
    setWhoFor('');
    setRulesSummary('');
    setTone('Welcoming');
    setBatch(0);
    setOutput([]);
    setErrors([]);
    setNote(undefined);
  };

  return (
    <div className="space-y-4">
      <TemplateNotice text="Template-based only (no AI). Assembles structured Facebook Group About sections and rules directly from your entries." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="fb-gd-name" className={LABEL_CLASS}>Group Name <span className="text-rose-500">*</span></label>
          <input id="fb-gd-name" type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g., Austin Balcony Gardeners" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-gd-topic" className={LABEL_CLASS}>Group Topic <span className="text-rose-500">*</span></label>
          <input id="fb-gd-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., container herbs and small-space gardening" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-gd-who" className={LABEL_CLASS}>Who It's For (optional)</label>
          <input id="fb-gd-who" type="text" value={whoFor} onChange={(e) => setWhoFor(e.target.value)} placeholder="e.g., apartment renters and first-time growers" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="fb-gd-tone" className={LABEL_CLASS}>Tone</label>
          <select id="fb-gd-tone" value={tone} onChange={(e) => setTone(e.target.value as GroupDescTone)} className={INPUT_CLASS}>
            <option value="Welcoming">Welcoming</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fb-gd-rules" className={LABEL_CLASS}>Group Rules Summary (optional, one rule per line)</label>
          <textarea id="fb-gd-rules" rows={3} value={rulesSummary} onChange={(e) => setRulesSummary(e.target.value)} placeholder={"Be respectful in all comments\nNo unapproved promo links\nShare location/climate when asking plant care questions"} className={INPUT_CLASS} />
        </div>
      </div>

      <FbGeneratorActionBar primaryLabel="Generate Group Descriptions" hasOutput={output.length > 0} onGenerate={() => run(0)} onRegenerate={() => run(batch + 1)} onReset={reset} />
      <FbErrorAlert errors={errors} />

      {output.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Group About Descriptions ({output.length})</span>
            <FbCopyButton text={output.join('\n\n---\n\n')} id="gd-all" copiedId={copiedId} onCopy={copy} label="Copy All" />
          </div>
          {note && <p className="text-xs text-slate-500 dark:text-slate-400">{note}</p>}
          {output.map((desc, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Option {i + 1}</span>
                <FbCopyButton text={desc} id={`gd-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
              <pre data-result className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{desc}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
