import React from 'react';
import {Facebook} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {FacebookPageNameGenerator} from './FacebookPageNameGenerator';
import {
  FbPostCaptionGenerator,
  FbHashtagGenerator,
  FbPostIdeaGenerator,
  FbReelIdeaGenerator,
  FbStoryIdeaGenerator,
  FbReelCaptionGenerator,
  FbVideoTitleGenerator,
  FbVideoDescriptionGenerator,
  FbCommentGenerator,
  FbReplyGenerator,
  FbDmGenerator,
  FbAdHeadlineGenerator,
  FbAdCopyGenerator,
  FbCtaGenerator,
  FbGroupNameGenerator,
  FbGroupDescriptionGenerator,
} from './facebook/FbRebuildGenerators';
import {
  FbProfilePictureResizer,
  FbHashtagCounter,
  FbTextFormatter,
  FbCharacterCounter,
  FbFollowerGrowthCalculator,
  FbImageCompressor,
  FbPostPreviewGenerator,
} from './facebook/FbBuiltUtilities';
import {
  FbBioGenerator,
  FbEngagementCalculator,
  FbFontGenerator,
  FbImageResizer,
  FbPlannerTool,
  FbUsernameGenerator,
  FbWinnerPicker,
} from './facebook/FbVerifiedAndFixedTools';

interface Props {
  tool: Tool;
}

function renderFacebookWorkspace(slug: string) {
  switch (slug) {
    // 5.1 Rebuilt deterministic generators (16 tools)
    case 'facebook-post-caption-generator':
      return <FbPostCaptionGenerator />;
    case 'facebook-hashtag-generator':
      return <FbHashtagGenerator />;
    case 'facebook-post-idea-generator':
      return <FbPostIdeaGenerator />;
    case 'facebook-reel-idea-generator':
      return <FbReelIdeaGenerator />;
    case 'facebook-story-idea-generator':
      return <FbStoryIdeaGenerator />;
    case 'facebook-reel-caption-generator':
      return <FbReelCaptionGenerator />;
    case 'facebook-video-title-generator':
      return <FbVideoTitleGenerator />;
    case 'facebook-video-description-generator':
      return <FbVideoDescriptionGenerator />;
    case 'facebook-comment-generator':
      return <FbCommentGenerator />;
    case 'facebook-reply-generator':
      return <FbReplyGenerator />;
    case 'facebook-dm-generator':
      return <FbDmGenerator />;
    case 'facebook-ad-headline-generator':
      return <FbAdHeadlineGenerator />;
    case 'facebook-ad-copy-generator':
      return <FbAdCopyGenerator />;
    case 'facebook-cta-generator':
      return <FbCtaGenerator />;
    case 'facebook-group-name-generator':
      return <FbGroupNameGenerator />;
    case 'facebook-group-description-generator':
      return <FbGroupDescriptionGenerator />;

    // 5.2 Built-from-scratch utilities (7 tools)
    case 'facebook-profile-picture-resizer':
      return <FbProfilePictureResizer />;
    case 'facebook-hashtag-counter':
      return <FbHashtagCounter />;
    case 'facebook-text-formatter':
      return <FbTextFormatter />;
    case 'facebook-character-counter':
      return <FbCharacterCounter />;
    case 'facebook-follower-growth-calculator':
      return <FbFollowerGrowthCalculator />;
    case 'facebook-image-compressor':
      return <FbImageCompressor />;
    case 'facebook-post-preview-generator':
      return <FbPostPreviewGenerator />;

    // 5.3 Fixed (1 tool)
    case 'facebook-giveaway-winner-picker':
      return <FbWinnerPicker isComment={false} />;

    // 5.4 Verified & flaw-fixed (15 tools)
    case 'facebook-random-comment-picker':
      return <FbWinnerPicker isComment={true} />;
    case 'facebook-page-name-generator':
      return <FacebookPageNameGenerator />;
    case 'facebook-cover-photo-resizer':
    case 'facebook-cover-photo-maker':
    case 'facebook-post-image-resizer':
    case 'facebook-image-resizer':
    case 'facebook-reel-cover-maker':
      return <FbImageResizer toolSlug={slug} />;
    case 'facebook-bio-generator':
      return <FbBioGenerator isPageBio={false} />;
    case 'facebook-page-bio-generator':
      return <FbBioGenerator isPageBio={true} />;
    case 'facebook-username-generator':
      return <FbUsernameGenerator />;
    case 'facebook-stylish-text-generator':
      return <FbFontGenerator isStylish={true} />;
    case 'facebook-font-generator':
      return <FbFontGenerator isStylish={false} />;
    case 'facebook-engagement-rate-calculator':
      return <FbEngagementCalculator />;
    case 'facebook-post-scheduler-planner':
      return <FbPlannerTool isCalendar={false} />;
    case 'facebook-content-calendar-generator':
      return <FbPlannerTool isCalendar={true} />;

    default:
      return null;
  }
}

export function FacebookToolsRunner({tool}: Props) {
  return (
    <div className="mx-auto mt-6 w-full max-w-4xl min-w-0 rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <Facebook className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-950 dark:text-white break-words">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser-based tool · No AI · Private local processing
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
          Browser Workspace
        </span>
      </div>

      <div className="p-4 sm:p-8 space-y-6 min-w-0 max-w-full overflow-x-hidden">{renderFacebookWorkspace(tool.slug)}</div>
    </div>
  );
}
