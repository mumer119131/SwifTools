import type { ToolContent } from "@/config/tool-content";

export const robotsTxtGeneratorContent: ToolContent = {
  steps: [
    "Start from a preset — allow everything, block everything, or a common CMS layout.",
    "Add rule groups per crawler, with the paths to allow or disallow, and your sitemap URL.",
    "Copy the file or download it, then put it at the root of your domain.",
  ],
  notes: [
    "robots.txt sits at the root of a domain and tells crawlers which paths they may request. It is a convention that well-behaved crawlers follow voluntarily — it is not access control, and a malicious scraper will ignore it entirely.",
    "The most damaging misuse is trying to hide a page with it. Disallowing a URL stops Google crawling it but not indexing it: if other pages link there, it can appear in results with no description, and Google cannot see a noindex tag on a page it is not allowed to fetch. To keep a page out of results, allow the crawl and use noindex, or require authentication.",
    "Disallow: / blocks the entire site. It is a single character away from Allow and has taken more sites out of search results than any other line of configuration — always check the deployed file at yourdomain.com/robots.txt after a change.",
  ],
  faq: [
    {
      question: "Does robots.txt keep a page out of Google?",
      answer: "No — that is the most common and most damaging misunderstanding. Disallow stops crawling, not indexing. A disallowed page linked from elsewhere can still appear in results, listed without a description, and Google cannot see a noindex tag on a page it will not fetch.",
    },
    {
      question: "How do I actually stop a page appearing in search results?",
      answer: "Allow crawling and add a noindex meta tag, or put it behind authentication. The crawler has to be able to read the page to obey the instruction not to index it.",
    },
    {
      question: "Where does robots.txt go?",
      answer: "At the root of the domain, at yourdomain.com/robots.txt. It applies only to that host and protocol, so a subdomain needs its own file.",
    },
    {
      question: "Is robots.txt a security measure?",
      answer: "No, and treating it as one is dangerous. It is a public file that lists the paths you would rather people did not visit, which is an invitation to anyone scanning for admin URLs. Use authentication for anything that matters.",
    },
    {
      question: "Should I include my sitemap in robots.txt?",
      answer: "Yes. A Sitemap line pointing at the full URL of your sitemap.xml helps crawlers discover it without submitting it manually to each search engine.",
    },
  ],
};
