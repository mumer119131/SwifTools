import type { Metadata } from "next";

import { absoluteUrl, pageTitle, siteConfig } from "@/config/site";
import { getCategory } from "@/config/categories";
import { toolHref, type Tool } from "@/config/tools";

/** Shared Open Graph / Twitter block so every page advertises itself the same way. */
function socialCard(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
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
  const segment = `${tool.name} — Free Online ${category?.label ?? ""} Tool`.replace(/\s+/g, " ").trim();
  const description = tool.description;

  return {
    title: segment,
    description,
    keywords: [...tool.keywords, tool.name.toLowerCase(), "free", "online", "no signup"],
    ...socialCard(pageTitle(segment), description, toolHref(tool)),
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
  if (!tool.steps?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    totalTime: "PT1M",
    supply: [],
    tool: [{ "@type": "HowToTool", name: tool.name }],
    step: tool.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
      url: `${absoluteUrl(toolHref(tool))}#how-it-works`,
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
    publisher: { "@type": "Organization", name: siteConfig.author },
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
