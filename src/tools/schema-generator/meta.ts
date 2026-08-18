import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const schemaGenerator: Tool = {
  slug: "schema-generator",
  name: "Schema Markup Generator",
  category: "seo",
  description: "Build valid JSON-LD structured data for articles, products, FAQs, events and more.",
  keywords: [
    "schema generator",
    "json-ld generator",
    "structured data generator",
    "schema markup",
    "rich results markup",
    "faq schema generator",
    "product schema",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick the type that matches the page — article, product, FAQ, event and more.",
    "Fill in the fields. Empty ones are dropped rather than emitted as null.",
    "Copy the script tag into your page's head.",
  ],
  notes: [
    "JSON-LD is the format Google recommends, and the reason is practical: it sits in one script tag rather than being woven through your markup as attributes, so it can be generated, cached and changed without touching the HTML around it. Microdata and RDFa still work, but nothing new should use them.",
    "Empty fields are dropped entirely rather than written as empty strings or nulls. That matters because a property present but empty is worse than one absent — validators flag it, and Google treats a malformed block as untrusted rather than partially useful.",
    "The one rule that gets sites penalised is marking up content that is not on the page. Structured data has to describe what a visitor actually sees: an FAQ block must correspond to questions visible in the page body, a rating must be a real rating shown to users, and a price must be the price you are charging. Marking up invisible or invented content is a manual-action offence, and the penalty applies to the whole site rather than the page.",
    "Times are emitted as ISO 8601 durations because that is what schema.org expects — 40 minutes becomes PT40M. Dates should be ISO too. Getting either wrong is the most common reason a block validates as syntactically fine and still produces no rich result.",
  ],
  faq: [
    {
      question: "What is JSON-LD and why use it over microdata?",
      answer: "JSON-LD puts your structured data in a single script tag instead of scattering attributes through the markup. Google recommends it, and it is far easier to maintain — you can generate or change the data without editing the HTML around it. Microdata still works but nothing new should use it.",
    },
    {
      question: "Where do I put the schema markup?",
      answer: "In a script tag with type=\"application/ld+json\", anywhere in the head or body. Position makes no difference to how it is read. One page can carry several blocks — an Article and a BreadcrumbList together is common and entirely valid.",
    },
    {
      question: "Will adding schema markup guarantee a rich result?",
      answer: "No. Valid markup makes a page eligible for one; Google decides case by case, and eligibility is not a promise. It also takes time — the page has to be recrawled first, so nothing changes the day you add it.",
    },
    {
      question: "Can I mark up content that is not visible on the page?",
      answer: "No, and this is the rule worth taking seriously. Structured data must describe what a visitor actually sees. Marking up invisible FAQs, invented ratings or prices you are not charging is a manual-action offence, and the penalty lands on the whole site rather than the single page.",
    },
    {
      question: "How do I check my markup is valid?",
      answer: "Paste the output into Google's Rich Results Test, which tells you both whether it parses and whether it qualifies for a rich result — those are different answers, and a block can pass the first and fail the second. The Schema Markup Validator checks conformance more broadly.",
    },
  ],
};
