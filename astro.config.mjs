// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://altaskur.github.io',
  base: '/portfolio',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()],
  devToolbar: {
    enabled: false
  }
});