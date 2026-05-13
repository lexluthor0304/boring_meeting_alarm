import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alarm.tokugai.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    assets: 'assets',
  },
});
