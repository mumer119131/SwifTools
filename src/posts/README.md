# Writing a blog post

1. Create `src/posts/<slug>.mdx`. The filename must match the `slug` in the
   meta block — `pnpm check:blog` enforces it.

2. Start the file with a meta export, then write markdown underneath:

   ```mdx
   export const meta = {
     slug: "my-post",
     title: "…",
     summary: "One or two sentences, 50–250 characters.",
     date: "2026-09-01",
     keywords: ["…"],
     minutes: 5,
     tools: ["compress-image"],   // optional, rendered as a rail below the post
     draft: true,                 // optional, hides it everywhere until removed
   };

   Markdown goes here. Internal links like [this](/image/compress-image)
   automatically route through next/link.
   ```

   **Plain JavaScript only in that block.** MDX parses its exports with acorn,
   so `import type` and `satisfies` fail the build with an unhelpful parse
   error. The shape is still type-checked via `src/types/mdx.d.ts`.

3. Add two lines to `src/posts/index.ts` — the import, and an entry in
   `entries`. Ordering is by date, so position does not matter.

4. Run `pnpm check:blog`.

## What belongs here rather than in a guide

Posts are **dated**: releases, changes, notes on how something was built. They
are read once and judged by recency.

Evergreen reference material — "which image format", "what size is an Instagram
post" — belongs in `src/guides` instead. A guide has no publication date and is
never stale by virtue of age.

The keyword divide is enforced: `check-blog` fails if a post targets a keyword a
tool or a guide already owns, because two of our own pages competing for one
query splits the signal and can leave both worse off.
