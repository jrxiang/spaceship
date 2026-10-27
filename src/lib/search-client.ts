/**
 * Client-side helpers shared by the standalone search page and the global
 * search dialog. Keep this module free of Astro / Node-only imports.
 */

export type SearchRecord = {
  title: string;
  description: string;
  category: string;
  categoryUrl: string;
  tags: string[];
  url: string;
  date: string;
};

export type SearchMatch = {
  record: SearchRecord;
  score: number;
};

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return String(value).replace(
    /[&<>"']/g,
    (char) => HTML_ESCAPES[char] ?? char,
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function splitTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

export function highlight(value: string, terms: string[]): string {
  const safe = escapeHtml(value);
  if (terms.length === 0) return safe;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return safe.replace(pattern, '<mark>$1</mark>');
}

export function renderResult(record: SearchRecord, terms: string[]): string {
  const date = DATE_FORMAT.format(new Date(record.date));
  const tags = record.tags
    .slice(0, 3)
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join('');

  return `
    <li class="post-card search-result">
      <time class="post-card__date" datetime="${record.date}">${date}</time>
      <div>
        <h2 class="post-card__title">
          <a href="${record.url}">${highlight(record.title, terms)}</a>
        </h2>
        <p class="post-card__description">${highlight(
          record.description,
          terms,
        )}</p>
        <div class="post-card__meta">
          <a class="post-card__category" href="${record.categoryUrl}">${escapeHtml(
            record.category,
          )}</a>
          <span aria-hidden="true">·</span>
          <span class="post-card__tags">${tags}</span>
        </div>
      </div>
    </li>`;
}

export function searchRecords(
  records: SearchRecord[],
  query: string,
  limit: number,
): { terms: string[]; total: number; matches: SearchMatch[] } {
  const terms = splitTerms(query);
  if (terms.length === 0) return { terms, total: 0, matches: [] };

  const matches: SearchMatch[] = [];

  for (const record of records) {
    const title = record.title.toLowerCase();
    const description = record.description.toLowerCase();
    const category = record.category.toLowerCase();
    const tags = record.tags.join(' ').toLowerCase();
    const haystack = `${title} ${description} ${category} ${tags}`;

    if (!terms.every((term) => haystack.includes(term))) continue;

    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 10;
      if (tags.includes(term)) score += 4;
      if (category.includes(term)) score += 3;
      if (description.includes(term)) score += 2;
    }
    matches.push({ record, score });
  }

  matches.sort(
    (a, b) => b.score - a.score || b.record.date.localeCompare(a.record.date),
  );

  return { terms, total: matches.length, matches: matches.slice(0, limit) };
}

let cachedIndex: Promise<SearchRecord[]> | null = null;

/** Fetch `/search.json` once and reuse it for the rest of the session. */
export function loadSearchRecords(): Promise<SearchRecord[]> {
  if (!cachedIndex) {
    cachedIndex = fetch('/search.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Search index request failed: ${response.status}`);
        }
        return response.json() as Promise<SearchRecord[]>;
      })
      .catch((error: unknown) => {
        cachedIndex = null;
        throw error;
      });
  }
  return cachedIndex;
}
