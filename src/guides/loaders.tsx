import type { ComponentType } from "react";

import ImageFormatsGuide from "@/guides/image-formats/content";
import ReduceFileSizeGuide from "@/guides/reduce-file-size/content";
import SocialSizesGuide from "@/guides/social-media-image-sizes/content";

/**
 * Guide bodies, keyed by slug.
 *
 * Static imports rather than the lazy pattern the tools use: these are server
 * components made of prose, so there is nothing to defer — the whole point is
 * that they render into the HTML.
 */
export const guideContent: Record<string, ComponentType> = {
  "image-formats": ImageFormatsGuide,
  "social-media-image-sizes": SocialSizesGuide,
  "reduce-file-size": ReduceFileSizeGuide,
};
