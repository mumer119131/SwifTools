import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * MDX is used for blog posts only. Posts live in `src/posts` and are
   * imported rather than routed, so adding `mdx` here does not turn stray
   * markdown into pages — `src/app` contains no .mdx files.
   */
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

/*
 * No remark or rehype plugins: under Turbopack they must be named as strings
 * and cannot take non-serializable options, so anything clever here is a
 * future trap. Plain MDX is enough for prose.
 */
const withMDX = createMDX({});

export default withMDX(nextConfig);
