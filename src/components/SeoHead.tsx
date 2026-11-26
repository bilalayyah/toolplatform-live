import {useEffect} from 'react';
import {buildCanonicalUrl, SITE_CONFIG} from '../config/site';
import type {Tool, ToolFaq} from '../data/tools';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SeoHead({
  title,
  description,
  canonicalPath,
  noindex = false,
  jsonLd = [],
}: SeoHeadProps) {
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    upsertCanonical(canonicalUrl);

    // Open Graph
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_CONFIG.siteName);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    // Clear previous dynamic JSON-LD scripts
    const existing = document.head.querySelectorAll('script[data-tp-jsonld="true"]');
    existing.forEach((node) => node.remove());

    for (const schema of jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-tp-jsonld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const stale = document.head.querySelectorAll('script[data-tp-jsonld="true"]');
      stale.forEach((node) => node.remove());
    };
  }, [title, description, canonicalUrl, noindex, jsonLd]);

  return null;
}

export function buildWebSiteSchema(): Record<string, unknown> {
  const homeUrl = buildCanonicalUrl('/');
  const searchTarget = `${buildCanonicalUrl('/tools')}?q={search_term_string}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: homeUrl,
    description: SITE_CONFIG.tagline,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchTarget,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: buildCanonicalUrl(item.url),
    })),
  };
}

export function buildItemListSchema(
  name: string,
  tools: readonly Tool[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: buildCanonicalUrl(tool.url),
    })),
  };
}

export function buildFaqSchema(faqs: readonly ToolFaq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
