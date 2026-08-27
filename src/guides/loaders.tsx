import type { ComponentType } from "react";

import ChemistryCalculationsGuide from "@/guides/chemistry-calculations/content";
import ColourFormatsGuide from "@/guides/colour-formats/content";
import CountingTextGuide from "@/guides/counting-text/content";
import DataSizesGuide from "@/guides/data-sizes/content";
import FormattingAndMinifyingGuide from "@/guides/formatting-and-minifying/content";
import HouseholdRunningCostsGuide from "@/guides/household-running-costs/content";
import KitchenConversionsGuide from "@/guides/kitchen-conversions/content";
import MechanicsFormulasGuide from "@/guides/mechanics-formulas/content";
import DataFormatsGuide from "@/guides/data-formats/content";
import DnsRecordsGuide from "@/guides/dns-records/content";
import ElectronicsBasicsGuide from "@/guides/electronics-basics/content";
import HashingEncodingEncryptionGuide from "@/guides/hashing-encoding-encryption/content";
import ImageFormatsGuide from "@/guides/image-formats/content";
import MeasuringARoomGuide from "@/guides/measuring-a-room/content";
import MetricImperialGuide from "@/guides/metric-imperial/content";
import OnlineToolPrivacyGuide from "@/guides/online-tool-privacy/content";
import PdfBasicsGuide from "@/guides/pdf-basics/content";
import RandomnessGuide from "@/guides/randomness/content";
import RegularExpressionsGuide from "@/guides/regular-expressions/content";
import SocialMediaMockupsGuide from "@/guides/social-media-mockups/content";
import TechnicalSeoGuide from "@/guides/technical-seo/content";
import TimestampsAndTimezonesGuide from "@/guides/timestamps-and-timezones/content";
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
  "chemistry-calculations": ChemistryCalculationsGuide,
  "data-formats": DataFormatsGuide,
  "dns-records": DnsRecordsGuide,
  "household-running-costs": HouseholdRunningCostsGuide,
  "kitchen-conversions": KitchenConversionsGuide,
  "mechanics-formulas": MechanicsFormulasGuide,
  "counting-text": CountingTextGuide,
  "data-sizes": DataSizesGuide,
  "formatting-and-minifying": FormattingAndMinifyingGuide,
  "colour-formats": ColourFormatsGuide,
  "metric-imperial": MetricImperialGuide,
  "measuring-a-room": MeasuringARoomGuide,
  "regular-expressions": RegularExpressionsGuide,
  "randomness": RandomnessGuide,
  "electronics-basics": ElectronicsBasicsGuide,
  "technical-seo": TechnicalSeoGuide,
  "social-media-mockups": SocialMediaMockupsGuide,
  "timestamps-and-timezones": TimestampsAndTimezonesGuide,
};
