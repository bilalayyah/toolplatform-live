import {buildCanonicalUrl, STATIC_ROUTES} from '../config/site';
import {CATEGORIES, TOOLS} from '../data/tools';

export function generateRobotsTxt(): string {
  const sitemapUrl = buildCanonicalUrl('/sitemap.xml');
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}

export function generateSitemapXml(): string {
  const urls = new Set<string>();

  for (const route of STATIC_ROUTES) {
    urls.add(buildCanonicalUrl(route));
  }

  for (const category of CATEGORIES) {
    urls.add(buildCanonicalUrl(category.url));
  }

  for (const tool of TOOLS) {
    urls.add(buildCanonicalUrl(tool.url));
  }

  const today = new Date().toISOString().split('T')[0];

  const entries = Array.from(urls)
    .map((loc) => {
      const isHome = loc === buildCanonicalUrl('/');
      const priority = isHome ? '1.0' : '0.8';
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
