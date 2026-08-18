import type { ComponentType } from "react";

import type { PostMeta } from "./types";

export type { PostMeta } from "./types";
import WhatsNewAugust2026, { meta as whatsNewAugust2026 } from "./whats-new-august-2026.mdx";

/**
 * Every post, newest first.
 *
 * To publish: write `src/posts/<slug>.mdx`, export a `meta` from the top of
 * it, and add one line to each list below. Ordering is by date, so the
 * position in this file does not matter.
 */
const entries: { meta: PostMeta; Body: ComponentType }[] = [
  { meta: whatsNewAugust2026, Body: WhatsNewAugust2026 },
];

const published = entries.filter((entry) => !entry.meta.draft);

export const posts: PostMeta[] = published
  .map((entry) => entry.meta)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

/**
 * Post bodies, keyed by slug.
 *
 * Exposed as a plain record rather than behind a lookup function: the React
 * Compiler cannot see through a call to tell that the returned component is
 * stable, and flags `const Body = getPostBody(slug)` as creating a component
 * during render. Indexing a record is transparent to it.
 */
export const postBodies: Record<string, ComponentType> = Object.fromEntries(
  published.map((entry) => [entry.meta.slug, entry.Body]),
);

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((post) => post.slug === slug);
}

export function postHref(post: Pick<PostMeta, "slug">): string {
  return `/blog/${post.slug}`;
}

/** Slugs of every entry, drafts included — used by the checks. */
export const allPostSlugs = entries.map((entry) => entry.meta.slug);
