import { Network } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sitemapGenerator: Tool = {
  slug: "sitemap-generator",
  name: "Sitemap Generator",
  category: "seo",
  description: "Turn a list of URLs into a valid XML sitemap with priorities and change frequency.",
  keywords: ["sitemap generator", "xml sitemap", "sitemap xml creator", "seo sitemap"],
  icon: Network,
  processing: "client",
  status: "live",
  steps: [
    "Paste your URLs, one per line — relative paths are resolved against the base URL.",
    "Set the last-modified date, change frequency and priority defaults.",
    "Download sitemap.xml, upload it to your site root, and reference it from robots.txt.",
  ],
  notes: [
    "An XML sitemap lists the URLs you want indexed, with optional last-modified dates. It does not guarantee indexing and it does not improve ranking — what it does is help a crawler discover pages that internal linking alone would leave buried, which matters most for large sites and for pages more than a few clicks from the homepage.",
    "Only include URLs that should be indexed: canonical, returning 200, and not blocked by robots.txt or noindex. A sitemap full of redirects, 404s and non-canonical duplicates is a signal that the site is not well maintained, and it wastes crawl budget.",
    "The lastmod date should be honest. Setting every URL to today on each deploy tells a crawler the entire site changed, which is false and which crawlers learn to disregard — after which a genuine update carries no signal either.",
  ],
  faq: [
    {
      question: "Do I need an XML sitemap?",
      answer: "A small, well-linked site usually does not. It matters for large sites, new sites with few inbound links, and pages that are more than a few clicks from the homepage — anything a crawler would struggle to discover by following links.",
    },
    {
      question: "Does a sitemap improve my search ranking?",
      answer: "No. It helps pages get discovered and crawled; it does not affect where they rank once they are. Discovery is a real problem for large sites, which is the whole value.",
    },
    {
      question: "Which URLs should I include?",
      answer: "Only canonical URLs that return 200 and are not blocked by robots.txt or a noindex tag. Including redirects, error pages or duplicates wastes crawl budget and signals a poorly maintained site.",
    },
    {
      question: "What should lastmod be set to?",
      answer: "The date the page's content actually changed. Setting every URL to today on each deploy claims the whole site changed, which crawlers learn to ignore — and then a genuine update carries no signal either.",
    },
    {
      question: "How many URLs can one sitemap hold?",
      answer: "50,000 URLs or 50 MB uncompressed. Beyond that, split into several sitemaps and list them in a sitemap index file, which is what large sites do.",
    },
  ],
};
