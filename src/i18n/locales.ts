import type {LocaleCode, LocaleDefinition} from './types';

export const LOCALES: readonly LocaleDefinition[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    status: 'live',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'hi-Latn',
    name: 'Hindi (Roman)',
    nativeName: 'Hindi (Roman)',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    status: 'coming-soon',
    badgeLabel: 'Coming Soon',
  },
] as const;

export const LIVE_LOCALE: LocaleCode = 'en';
