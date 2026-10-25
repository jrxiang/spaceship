// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  // Replace with your production domain. Used for canonical URLs and RSS.
  site: 'https://example.com',
  markdown: {
    // remark/rehype pipeline, required for KaTeX math rendering.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            throwOnError: false,
            strict: false,
            macros: {
              '\\softmax': '\\operatorname{softmax}',
            },
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
