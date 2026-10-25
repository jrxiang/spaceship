export const SITE = {
  /** Site name, also used in the header logo and page titles. */
  title: 'SPACESHIP',
  /** One-line summary shown on the home page and in meta tags. */
  description: '朝饮木兰之坠露兮，夕餐秋菊之落英。',
  /** Used in the footer and feed metadata. */
  author: 'Thomas Bob',
  /** Optional. Leave empty to hide the email link. */
  email: '1648768667@qq.com',
  /** Primary navigation. `match` controls active-link detection. */
  nav: [
    { label: 'Posts', href: '/posts', match: '/posts' },
    { label: 'Categories', href: '/categories', match: '/categories' },
    { label: 'Tags', href: '/tags', match: '/tags' },
    { label: 'About', href: '/about', match: '/about' },
  ],
  /** Links shown as icons below the hero avatar. */
  social: [
    { label: 'GitHub', href: 'https://github.com/jrxiang' },
    { label: 'RSS', href: '/rss.xml' },
  ],
} as const;
