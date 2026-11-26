import {SITE_CONFIG} from '../config/site';
import type {SiteStrings} from './types';

export const EN_STRINGS: SiteStrings = {
  nav: {
    allTools: 'All Tools',
    pdfTools: 'PDF Tools',
    imageTools: 'Image Tools',
    videoTools: 'Video Tools',
    faq: 'FAQ',
    about: 'About',
    contact: 'Contact',
    blog: 'Blog',
  },
  search: {
    placeholderHero: 'Search for tools…',
    placeholderHeader: 'Search for tools…',
    placeholderDirectory: 'Search for tools…',
    buttonLabel: 'Search',
    noResultsTitle: 'No matching tools found',
    noResultsSubtitle: 'Try another keyword or start with one of these popular tools.',
    popularSuggestionsLabel: 'Popular tools',
    viewAllResults: 'View all matching results',
    clearLabel: 'Clear search',
  },
  common: {
    comingSoonLabel: 'Coming Soon',
    browseAllTools: 'Browse All Tools',
    exploreCategory: 'Explore category',
    home: 'Home',
    allTools: 'All Tools',
    backToHome: 'Back to Home',
    languageLabel: 'Language',
    themeToggleLight: 'Switch to light theme',
    themeToggleDark: 'Switch to dark theme',
    processingMethodLabels: {
      browser: 'Browser-based',
      'server-service': 'Server-service',
      'external-api': 'External API',
    },
  },
  footer: {
    toolsHeading: 'Tools',
    companyHeading: 'Navigate',
    legalHeading: 'Legal',
    rightsNotice: `© 2026 ${SITE_CONFIG.siteName}. All rights reserved.`,
    phaseNotice: `${SITE_CONFIG.siteName} provides free online conversion, PDF, and other handy tools to help you solve problems of all types.`,
  },
};
