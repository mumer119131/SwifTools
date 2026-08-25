import type { Metadata } from "next";

import { absoluteUrl, pageTitle, siteConfig } from "@/config/site";
import { getCategory } from "@/config/categories";
import { getToolContent } from "@/config/tool-content";
import { isIndexable, toolHref, type Tool } from "@/config/tools";

/**
 * Shared Open Graph / Twitter block so every page advertises itself the same way.
 *
 * `useOwnImage` leaves `images` unset, which lets Next's colocated
 * `opengraph-image.tsx` supply the card. Setting `images` here would replace
 * the generated per-tool image with the generic one — the file convention only
 * applies when metadata does not override it.
 */
function socialCard(
  title: string,
  description: string,
  path: string,
  useOwnImage = false,
): Metadata {
  const url = absoluteUrl(path);

  const images = useOwnImage
    ? {}
    : {
        openGraph: {
          images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: title }],
        },
        twitter: { images: [absoluteUrl("/opengraph-image")] },
      };

  return {
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      ...(images.openGraph ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images.twitter ?? {}),
      ...(siteConfig.links.twitter ? { creator: siteConfig.links.twitter } : {}),
    },
  };
}

/**
 * Page titles are returned as the bare segment, because the root layout's
 * `title.template` already appends "| <site name>". Building the full string
 * here as well would render it twice.
 *
 * Social cards do need the complete title — they are read out of context, with
 * no template applied — so `pageTitle` is used for those only.
 */
export function buildToolMetadata(tool: Tool): Metadata {
  const category = getCategory(tool.category);

  /*
   * Google truncates a title around 60 characters, and `pageTitle` appends
   * " | <site name>" after this one. The budget below subtracts that, which the
   * previous threshold of 52 did not — so 82 of 232 titles ran past 60 and were
   * clipped in results, the longest at 72.
   *
   * Three forms, longest first, and the first that fits wins. The old pair had
   * no fallback for a long name: "Series and Parallel Resistor Calculator" was
   * already using the short suffix and still overflowed. The tool's own name is
   * the part worth keeping, so it is what survives.
   */
  const brandCost = pageTitle("x").length - 1;
  const budget = 60 - brandCost;

  const forms = [
    `${tool.name} — Free Online ${category?.label ?? ""} Tool`.replace(/\s+/g, " ").trim(),
    `${tool.name} — Free Online Tool`,
    tool.name,
  ];

  const segment = forms.find((form) => form.length <= budget) ?? tool.name;

  const description = tool.description;

  return {
    title: segment,
    description,
    keywords: [...tool.keywords, tool.name.toLowerCase(), "free", "online", "no signup"],
    // follow, not none: the page still passes value through its links, and it
    // stays perfectly usable for anyone who reaches it.
    ...(isIndexable(tool) ? {} : { robots: { index: false, follow: true } }),
    // Tool pages generate their own card from opengraph-image.tsx.
    ...socialCard(pageTitle(segment), description, toolHref(tool), true),
  };
}

export function buildCategoryMetadata(slug: string): Metadata | undefined {
  const category = getCategory(slug);
  if (!category) return undefined;

  const segment = `${category.label} Tools`;
  return {
    title: segment,
    description: category.metaDescription,
    keywords: [
      `${category.label.toLowerCase()} tools`,
      `free online ${category.label.toLowerCase()} tools`,
      `${category.label.toLowerCase()} converter`,
    ],
    ...socialCard(pageTitle(segment), category.metaDescription, `/${category.slug}`),
  };
}

/* ------------------------------------------------------------------ JSON-LD */

export type JsonLd = Record<string, unknown>;

export function softwareApplicationLd(tool: Tool): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(toolHref(tool)),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: siteConfig.author },
  };
}

export function howToLd(tool: Tool): JsonLd | null {
  const { steps } = getToolContent(tool.slug);
  if (!steps?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    totalTime: "PT1M",
    supply: [],
    tool: [{ "@type": "HowToTool", name: tool.name }],
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
      url: `${absoluteUrl(toolHref(tool))}#how-it-works`,
    })),
  };
}

/**
 * FAQPage, emitted only when a tool actually has questions.
 *
 * Google will not show FAQ rich results for pages that pad the schema with
 * questions nobody asked, and an empty or filler FAQPage is worse than none —
 * so this returns null rather than inventing anything.
 */
export function faqLd(tool: Tool): JsonLd | null {
  const { faq } = getToolContent(tool.slug);
  if (!faq?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function breadcrumbLd(items: { label: string; href: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.author,
      url: siteConfig.url,
      /*
       * A reachable contact in the structured data is a trust signal, and one
       * that ad and search reviewers do look for. It has to be the same address
       * the contact page publishes, which is why both read from siteConfig.
       */
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.email,
        availableLanguage: "English",
      },
    },
  };
}

export function itemListLd(tools: readonly Tool[], name: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(toolHref(tool)),
    })),
  };
}
