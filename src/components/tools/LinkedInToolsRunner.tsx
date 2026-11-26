import React, {useState} from 'react';
import {Briefcase} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  LinkedinBannerMaker,
  LinkedinBannerResizer,
  LinkedinCarouselMaker,
  LinkedinCarouselPdfGenerator,
  LinkedinPostImageResizer,
  LinkedinProfilePictureResizer,
} from './linkedin/LinkedinCanvasTools';
import {
  LinkedinCaptionGenerator,
  LinkedinColdDmGenerator,
  LinkedinCommentGenerator,
  LinkedinConnectionMessageGenerator,
  LinkedinContentIdeaGenerator,
  LinkedinExperienceDescriptionGenerator,
  LinkedinJobApplicationMessageGenerator,
  LinkedinJobDescriptionGenerator,
  LinkedinRecommendationGenerator,
  LinkedinReplyGenerator,
  LinkedinSkillsGenerator,
  LinkedinUsernameGenerator,
} from './linkedin/LinkedinGeneratorTools';
import {
  LinkedinContentCalendarGenerator,
  LinkedinEngagementCalculator,
  LinkedinHashtagCounter,
  LinkedinPostCounter,
  LinkedinProfileChecklist,
  LinkedinProfileUrlFormatter,
} from './linkedin/LinkedinUtilityTools';

interface Props {
  tool: Tool;
}

export function LinkedInToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
  };

  const renderTool = () => {
    switch (tool.slug) {
      case 'linkedin-caption-generator':
        return <LinkedinCaptionGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-username-generator':
        return <LinkedinUsernameGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-profile-url-formatter':
        return <LinkedinProfileUrlFormatter onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-profile-picture-resizer':
        return <LinkedinProfilePictureResizer />;
      case 'linkedin-banner-maker':
        return <LinkedinBannerMaker />;
      case 'linkedin-banner-resizer':
        return <LinkedinBannerResizer />;
      case 'linkedin-post-image-resizer':
        return <LinkedinPostImageResizer />;
      case 'linkedin-carousel-maker':
        return <LinkedinCarouselMaker />;
      case 'linkedin-carousel-pdf-generator':
        return <LinkedinCarouselPdfGenerator />;
      case 'linkedin-content-idea-generator':
        return <LinkedinContentIdeaGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-comment-generator':
        return <LinkedinCommentGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-reply-generator':
        return <LinkedinReplyGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-connection-message-generator':
        return <LinkedinConnectionMessageGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-cold-dm-generator':
        return <LinkedinColdDmGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-job-description-generator':
        return <LinkedinJobDescriptionGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-job-application-message-generator':
        return <LinkedinJobApplicationMessageGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-experience-description-generator':
        return <LinkedinExperienceDescriptionGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-skills-generator':
        return <LinkedinSkillsGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-recommendation-generator':
        return <LinkedinRecommendationGenerator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-engagement-rate-calculator':
        return <LinkedinEngagementCalculator onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-post-character-counter':
        return <LinkedinPostCounter onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-hashtag-counter':
        return <LinkedinHashtagCounter onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-profile-optimization-checklist':
        return <LinkedinProfileChecklist onCopy={copyText} copiedKey={copiedKey} />;
      case 'linkedin-content-calendar-generator':
        return <LinkedinContentCalendarGenerator onCopy={copyText} copiedKey={copiedKey} />;
      default:
        return (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
            Unsupported LinkedIn tool slug: <code>{tool.slug}</code>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600/10 text-sky-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · Zero AI · Real in-browser execution · No login required
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">{renderTool()}</div>
    </div>
  );
}
