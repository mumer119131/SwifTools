import type { ComponentType } from "react";

import ColourFormatsGuide from "@/guides/colour-formats/content";
import HashingEncodingEncryptionGuide from "@/guides/hashing-encoding-encryption/content";
import ImageFormatsGuide from "@/guides/image-formats/content";
import MeasuringARoomGuide from "@/guides/measuring-a-room/content";
import MetricImperialGuide from "@/guides/metric-imperial/content";
import OnlineToolPrivacyGuide from "@/guides/online-tool-privacy/content";
import PdfBasicsGuide from "@/guides/pdf-basics/content";
import RegularExpressionsGuide from "@/guides/regular-expressions/content";
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
  "online-tool-privacy": OnlineToolPrivacyGuide,
  "hashing-encoding-encryption": HashingEncodingEncryptionGuide,
  "pdf-basics": PdfBasicsGuide,
  "colour-formats": ColourFormatsGuide,
  "metric-imperial": MetricImperialGuide,
  "measuring-a-room": MeasuringARoomGuide,
  "regular-expressions": RegularExpressionsGuide,
};
