import type { ToolContent } from "@/config/tool-content";

export const hreflangGeneratorContent: ToolContent = {
  steps: [
    "Add one row per language version, with its full URL.",
    "Invalid codes are flagged — en-UK is the one nearly everyone gets wrong.",
    "Copy the link tags, or the sitemap form if you have more than a few pages.",
  ],
  notes: [
    "hreflang tells Google that several URLs are the same page in different languages, so it can serve the right one rather than treating them as duplicates. The rule that makes it work is reciprocity: every page in the set must list every other page, including itself. A page that is pointed at but does not point back is ignored, and no error appears anywhere — the tag simply has no effect.",
    "The region subtag is a country, not a language, and this is where most implementations break. The code for the United Kingdom is GB, so en-UK is invalid and Google discards the entire tag without reporting it. zh-CN and zh-TW are similarly wrong for simplified and traditional Chinese, which are script variants: zh-Hans and zh-Hant. Both mistakes are flagged here as you type.",
    "x-default is for everyone the set does not cover. Without it, a visitor whose language matches nothing gets whatever Google decides — usually the version that ranks best, which is rarely the one you would have chosen. It normally points at a language selector or the English version.",
    "Past a handful of pages, put hreflang in the XML sitemap instead of in link tags. Tags must appear on every page in the set and each must list all the others, so ten languages means a hundred tags to keep in step; the sitemap form declares the same relationships once, in a file you generate rather than maintain.",
  ],
  faq: [
    {
      question: "What is the correct hreflang code for the UK?",
      answer: "en-GB. The region subtag uses ISO 3166 country codes, where the United Kingdom is GB — en-UK is invalid and Google ignores the whole tag without telling you. It is the most common hreflang error there is.",
    },
    {
      question: "Do hreflang tags need to be reciprocal?",
      answer: "Yes, and this is the requirement most implementations miss. Every page in the set must list every other page including itself. A page that is referenced but does not reference back is dropped from the set entirely, silently.",
    },
    {
      question: "What does x-default do?",
      answer: "It names the page to serve when a visitor's language matches nothing else in the set. Without one, Google picks for you — usually whichever version ranks best. It normally points at a language selector or your primary-language page.",
    },
    {
      question: "Should I use link tags or the sitemap?",
      answer: "Link tags for a few pages, sitemap once it grows. Tags must be repeated on every page in the set and each must list all the others, so the count grows with the square of your languages. The sitemap declares the same thing once in a file you generate.",
    },
    {
      question: "Can I use hreflang for regional variants of the same language?",
      answer: "Yes, and it is one of the best uses — en-GB and en-US, or es-ES and es-MX. It stops Google treating near-identical pages as duplicates and lets it serve the right currency, spelling and shipping information to each country.",
    },
  ],
};
