/**
 * A blog post's metadata, exported from the top of its own `.mdx` file.
 *
 * Kept as an export inside the post rather than in a separate registry so a
 * post is genuinely one file: write the markdown, fill in the header, add one
 * import line to `index.ts`. That is as close to a CMS as this site needs, and
 * unlike a CMS it is type-checked, versioned in git and costs nothing to run.
 *
 * Blog posts are dated and chronological. Evergreen reference material belongs
 * in `@/config/guides` instead — see the guides section for why the two are
 * kept apart.
 */
export interface PostMeta {
  slug: string;
  title: string;
  /** One or two sentences. Used as the meta description and the card summary. */
  summary: string;
  /** ISO date. Drives ordering, the visible date and the RSS feed. */
  date: string;
  /** Optional, for a substantive revision of an already-published post. */
  updated?: string;
  keywords: string[];
  /** Roughly how long it takes to read. */
  minutes: number;
  /** Tool slugs this post is worth pointing at, rendered as a rail below it. */
  tools?: string[];
  /** Set while writing. Excluded from the index, the sitemap and the feed. */
  draft?: boolean;
}
