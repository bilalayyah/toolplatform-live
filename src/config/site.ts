export const SITE_CONFIG = {
  siteName: 'ToolPlatform',
  logoText: 'ToolPlatform',
  tagline: 'All-in-one online utilities for PDFs, images, and video.',
  canonicalBaseUrl: 'https://toolplatform.example.com',
  contactEmail: 'bilalayyah@gmail.com',
  primaryColor: '#0A8CFF',
  defaultLocale: 'en' as const,
  watermark: {
    enabled: true,
    type: 'logo',
    position: 'bottom-right',
    opacity: 0.6,
    maxWidthPercent: 15,
    appliesTo: [
      'compress-image',
      'resize-image',
      'convert-image',
      'crop-image',
      'pdf-to-jpg',
    ],
  },
  videoLimits: {
    'compress-video': {
      maxFileSizeMB: 100,
      maxDurationMinutes: 3,
      maxResolution: '720p',
    },
    'video-to-mp4': {
      maxFileSizeMB: 100,
      maxDurationMinutes: 3,
      maxResolution: '720p',
    },
    'video-to-gif': {
      maxFileSizeMB: 100,
      maxClipSeconds: 10,
    },
    'video-to-audio': {
      maxFileSizeMB: 100,
      maxDurationMinutes: 3,
      outputFormat: 'MP3',
    },
    'audio-converter': {
      maxFileSizeMB: 100,
    },
    'video-converter': {
      maxFileSizeMB: 100,
      maxDurationMinutes: 3,
      maxResolution: '720p',
    },
  },
} as const;

export function toolHasWatermark(toolId: string): boolean {
  return (
    SITE_CONFIG.watermark.enabled &&
    (SITE_CONFIG.watermark.appliesTo as readonly string[]).includes(toolId)
  );
}

export const STATIC_ROUTES = [
  '/',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookie-policy',
  '/faq',
  '/blog',
] as const;

export function buildCanonicalUrl(pathname: string): string {
  const base = SITE_CONFIG.canonicalBaseUrl.replace(/\/+$/, '');
  const cleanPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  return cleanPath === '/' ? `${base}/` : `${base}${cleanPath}`;
}
