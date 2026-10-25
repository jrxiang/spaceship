import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export type Term = {
  /** URL-safe identifier derived from the display name. */
  slug: string;
  /** Display name, taken from the most recent post using it. */
  name: string;
  count: number;
};

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

export function postUrl(post: Post): string {
  return `/posts/${post.id}/`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Keep letters and numbers from any script so Chinese tags stay usable.
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function byNewest(a: Post, b: Post): number {
  return b.data.published.valueOf() - a.data.published.valueOf();
}

/** All posts that should be publicly listed (drafts stay local). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort(byNewest);
}

/** Post count per year, newest first. */
export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.published.getUTCFullYear();
    const group = groups.get(year) ?? [];
    group.push(post);
    groups.set(year, group);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, posts: items }));
}

function collectTerms(posts: Post[], pick: (post: Post) => string[]): Term[] {
  const terms = new Map<string, Term>();
  for (const post of posts) {
    for (const name of pick(post)) {
      const slug = slugify(name);
      if (!slug) continue;
      const existing = terms.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        terms.set(slug, { slug, name, count: 1 });
      }
    }
  }
  return [...terms.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function getCategories(posts: Post[]): Term[] {
  return collectTerms(posts, (post) => [post.data.category]);
}

export function getTags(posts: Post[]): Term[] {
  return collectTerms(posts, (post) => post.data.tags);
}

/** Posts in the same category or sharing at least one tag, best match first. */
export function getRelatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const shared = candidate.data.tags.filter((tag) => tags.has(tag)).length;
      const sameCategory = candidate.data.category === post.data.category ? 1 : 0;
      return { candidate, score: shared * 2 + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.candidate, b.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Reading time in minutes, counting CJK characters and Latin words separately. */
export function getReadingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = toPlainText(body);
  const cjkPattern = /[\u3400-\u4dbf\u4e00-\u9fff]/g;
  const cjk = (text.match(cjkPattern) ?? []).length;
  const words = text
    .replace(cjkPattern, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}

/** Rough markdown-to-text conversion for search indexing. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, '')
    .replace(/\[\^[^\]]*\]/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type SearchRecord = {
  title: string;
  description: string;
  category: string;
  categoryUrl: string;
  tags: string[];
  url: string;
  date: string;
  text: string;
};

export async function getSearchIndex(): Promise<SearchRecord[]> {
  const posts = await getPosts();
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    categoryUrl: `/categories/${slugify(post.data.category)}/`,
    tags: post.data.tags,
    url: postUrl(post),
    date: post.data.published.toISOString(),
    text: toPlainText(post.body ?? ''),
  }));
}
