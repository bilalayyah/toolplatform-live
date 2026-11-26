export type LocaleStatus = 'live' | 'coming-soon';

export type LocaleCode =
  | 'en'
  | 'es'
  | 'pt-BR'
  | 'fr'
  | 'de'
  | 'it'
  | 'id'
  | 'ja'
  | 'hi-Latn'
  | 'ko'
  | 'ru'
  | 'zh-CN';

export interface LocaleDefinition {
  code: LocaleCode;
  name: string;
  nativeName: string;
  status: LocaleStatus;
  badgeLabel?: string;
}

export interface SiteStrings {
  nav: {
    allTools: string;
    pdfTools: string;
    imageTools: string;
    videoTools: string;
    faq: string;
    about: string;
    contact: string;
    blog: string;
  };
  search: {
    placeholderHero: string;
    placeholderHeader: string;
    placeholderDirectory: string;
    buttonLabel: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    popularSuggestionsLabel: string;
    viewAllResults: string;
    clearLabel: string;
  };
  common: {
    comingSoonLabel: string;
    browseAllTools: string;
    exploreCategory: string;
    home: string;
    allTools: string;
    backToHome: string;
    languageLabel: string;
    themeToggleLight: string;
    themeToggleDark: string;
    processingMethodLabels: {
      browser: string;
      'server-service': string;
      'external-api': string;
    };
  };
  footer: {
    toolsHeading: string;
    companyHeading: string;
    legalHeading: string;
    rightsNotice: string;
    phaseNotice: string;
  };
}
