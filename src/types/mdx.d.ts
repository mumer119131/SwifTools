/**
 * `@types/mdx` declares the default export of an `.mdx` module but not the
 * named ones, so importing a post's `meta` alongside its body does not type
 * check without this.
 *
 * Declared as `PostMeta` rather than `unknown` so a post with a missing or
 * misspelled field is a compile error rather than something the blog index
 * discovers at runtime.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { PostMeta } from "@/posts/types";

  export const meta: PostMeta;
  const Component: ComponentType<Record<string, unknown>>;
  export default Component;
}
