import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://alarm.tokugai.com';
const LAUNCH_DATE = '2026-05-13';
const LOCALES = ['en', 'zh', 'ja'];

function readFrontmatter(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) return {};
    const out = {};
    for (const line of fm[1].split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*"?([^"\n]*?)"?\s*$/);
      if (m) out[m[1]] = m[2].trim();
    }
    return out;
  } catch {
    return {};
  }
}

function buildLastmodMap() {
  const map = new Map();

  for (const locale of LOCALES) {
    const path = locale === 'en' ? '/' : `/${locale}/`;
    map.set(SITE + path, LAUNCH_DATE);
  }

  for (const locale of LOCALES) {
    const fm = readFrontmatter(`./src/content/privacy/${locale}.md`);
    const date = fm.lastUpdated || LAUNCH_DATE;
    const path = locale === 'en' ? '/privacy/' : `/${locale}/privacy/`;
    map.set(SITE + path, date);
  }

  const postsByLocale = {};
  for (const locale of LOCALES) {
    const dir = `./src/content/blog/${locale}`;
    let entries;
    try {
      entries = readdirSync(dir).filter((f) => f.endsWith('.md'));
    } catch {
      entries = [];
    }
    postsByLocale[locale] = entries.map((file) => {
      const fm = readFrontmatter(join(dir, file));
      const date = fm.dateModified || fm.datePublished || LAUNCH_DATE;
      return { slug: fm.slug, date };
    });
    for (const post of postsByLocale[locale]) {
      if (!post.slug) continue;
      const path = locale === 'en' ? `/blog/${post.slug}/` : `/${locale}/blog/${post.slug}/`;
      map.set(SITE + path, post.date);
    }
  }

  for (const locale of LOCALES) {
    const dates = (postsByLocale[locale] ?? []).map((p) => p.date).sort();
    const latest = dates.length > 0 ? dates[dates.length - 1] : LAUNCH_DATE;
    const path = locale === 'en' ? '/blog/' : `/${locale}/blog/`;
    map.set(SITE + path, latest);
  }

  return map;
}

const lastmodMap = buildLastmodMap();

export default defineConfig({
  site: SITE,
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
          ja: 'ja',
        },
      },
      serialize(item) {
        const lastmod = lastmodMap.get(item.url) ?? LAUNCH_DATE;
        return { ...item, lastmod };
      },
    }),
  ],
  build: {
    assets: 'assets',
  },
});
