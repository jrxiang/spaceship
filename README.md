# SPACESHIP

A minimal, content-first blog and knowledge base built with [Astro](https://astro.build). Plain Markdown, static HTML, a full-text search index, KaTeX math, and almost no client-side JavaScript.

## Features

- **Content collections** with validated frontmatter (title, description, date, category, tags, draft).
- **Two-level taxonomy** — one category per post, any number of cross-cutting tags. Index pages, term pages, and counts are generated automatically. Unicode tags (e.g. `计网`) are supported.
- **Reading experience** — narrow measure, serif headings, table of contents with scroll highlighting, related posts, older/newer navigation.
- **Math** — `$inline$` and `$$display$$` LaTeX rendered at build time with KaTeX (MathJax syntax from the old blog is compatible).
- **Light and dark themes** that follow the system preference, with a remembered manual toggle.
- **Static search** — a JSON index generated at build time, filtered in the browser with keyword highlighting and URL-synced queries.
- **Archive, RSS, canonical URLs, Open Graph metadata**, and a custom 404 page.
- **Responsive and accessible** — skip link, visible focus states, semantic landmarks, `prefers-reduced-motion` support.

## Commands

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`   |
| `npm run preview` | Preview the production build locally     |

## Project structure

```text
public/
└── images/              # Post images, referenced as /images/...
src/
├── components/          # Header, footer, post card, table of contents, head
├── content/
│   └── posts/           # Markdown posts (add a file to publish)
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   └── posts.ts         # Queries: sorting, taxonomy, related posts, search index
├── pages/
│   ├── index.astro
│   ├── posts/           # Archive + [slug] article pages
│   ├── categories/      # Index + [category]
│   ├── tags/            # Index + [tag]
│   ├── about.astro
│   ├── search.astro     # Client-side search UI
│   ├── search.json.ts   # Generated search index
│   ├── rss.xml.ts
│   └── 404.astro
├── styles/global.css    # Design tokens and all styles
├── content.config.ts    # Collection schema
└── site.config.ts       # Site name, description, navigation, links
```

## Writing a post

Create `src/content/posts/my-post.md`:

```md
---
title: A Clear, Specific Title
description: One sentence that explains what the reader will get.
published: 2026-10-18
updated: 2026-10-21        # optional
category: Notes            # exactly one broad area
tags:                      # zero or more narrow keywords
  - note-taking
  - systems
draft: false               # true excludes the post from the built site
---

Your content starts here. Use `##` for section headings to populate the table
of contents.
```

The file name becomes the URL (`my-post` → `/posts/my-post/`). Subfolders are supported for organisation and appear in the URL.

### Category vs. tag

- **Category**: the broad shelf — currently `Tools` and `AI`. Keep the list short.
- **Tag**: a reusable keyword — `git`, `cuda`, `architecture`, `计网`. Use the same spelling across posts; display names are taken from the most recent post.

URLs are slugified automatically (`Knowledge Management` → `/tags/knowledge-management/`, `计网` → `/tags/计网/`). Renaming a category or tag changes its URL, which is why the spelling should stay stable.

## Migrated from Hexo

The content in `src/content/posts` was migrated from the Hexo site in `backup/`. Mapping decisions:

| Hexo | Astro |
| --- | --- |
| `date: 2026-01-12 15:19:04` | `published: 2026-01-12` (time is not displayed) |
| `categories: tools` | `category: Tools` |
| `tags: CUDA` / `tags:` (empty) | `tags: [cuda]` / `tags: []` |
| Post images in `source/images/...` | `public/images/...`, referenced as `/images/...` |
| MathJax `$...$` and `$$...$$` | KaTeX via `remark-math` + `rehype-katex` |
| `permalink: :year/:month/:day/:title/` | `/posts/<file-name>/` |

All migrated posts received a Chinese `description` for listings, search results, and meta tags. Two posts had no category and were filed under `Tools` and `AI` respectively; empty tag lists were left empty rather than invented.

The old favicon (`/img/favicon.png`, the "JR" monogram) is now `public/favicon.png` and doubles as the header logo. The old Hexo theme, CSS animation, and avatar (`backup/source/uploads`) are not part of the new design. Old permalinks are not redirected — add host-level redirects if those URLs are still in circulation.

## Customisation

- **Site identity**: edit `src/site.config.ts` — title, description, author, email, nav items, footer links.
- **Domain**: set `site` in `astro.config.mjs`. It is used for canonical URLs and the RSS feed.
- **Design tokens**: typography, colours, spacing, and layout widths live at the top of `src/styles/global.css`. Dark mode overrides are under `html[data-theme='dark']`.
- **Markdown pipeline**: remark/rehype plugins and KaTeX macros are configured in `astro.config.mjs`. Add a macro there if the notes use a custom LaTeX command.
- **Code highlighting**: the Shiki themes are configured in `astro.config.mjs` (`github-light` / `github-dark`).
- **Search scope**: `getSearchIndex()` in `src/lib/posts.ts` controls which fields are indexed.

## Deploying

`npm run build` produces a fully static site in `dist/`. Deploy it to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a plain web server).

Set the production domain in `astro.config.mjs` before going live. If the site is served from a sub-path (for example `https://jrxiang.github.io/myblog/`), set `base` in the same config and prefix internal links accordingly — the template currently assumes it is served from the domain root.
