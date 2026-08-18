import type { ToolContent } from "@/config/tool-content";

export const utmBuilderContent: ToolContent = {
  steps: [
    "Paste the URL you are linking to.",
    "Fill in source, medium and campaign — the three that matter.",
    "Anything that would break your reports is flagged before you copy the link.",
  ],
  notes: [
    "UTM parameters are just query string values that analytics tools agree to read. utm_source is where the traffic came from, utm_medium is the kind of channel, and utm_campaign is the specific push — those three are effectively required, because a link missing any of them usually gets reported as direct traffic, which is the bucket where attribution goes to die.",
    "Case is the mistake that costs the most and warns the least. Google Analytics treats utm_source=Newsletter and utm_source=newsletter as two entirely separate sources, so one stray capital splits a campaign across two rows in every report from then on, and nothing anywhere tells you it happened. Lowercase everything, always — it is flagged here as you type.",
    "The other frequent error is the medium value. Analytics only recognises \"cpc\" as paid search; \"ppc\", \"paid\" and \"adwords\" all get bucketed as something else and quietly vanish from paid reports. Keeping mediums to a short fixed list — email, cpc, social, paid_social, affiliate, referral — is the single thing that makes campaign reporting usable a year later.",
    "Existing parameters on your URL are preserved, and any utm_ values already present are replaced rather than duplicated. Pasting an already-tagged link back in is the most common route to a URL with two utm_source values, where analytics silently picks one and you never learn which.",
  ],
  faq: [
    {
      question: "Which UTM parameters are required?",
      answer: "Source, medium and campaign in practice. A link missing any of them is usually reported as direct traffic, which means the campaign gets no credit at all. Term and content are optional and mostly used for paid search keywords and A/B testing individual links.",
    },
    {
      question: "Does UTM tagging affect SEO?",
      answer: "Not if the page has a proper canonical tag, which it should anyway. Tagged URLs are different addresses, so without a canonical they can be indexed as duplicates. Never put UTM parameters on internal links for the same reason — you will overwrite the original source of the session and attribute your own traffic to yourself.",
    },
    {
      question: "Should UTM parameters be lowercase?",
      answer: "Yes, without exception. Google Analytics is case-sensitive, so Newsletter and newsletter become two separate sources and your campaign is split across two rows in every report. Nothing warns you when it happens, which is why it is worth being strict from the start.",
    },
    {
      question: "What is the difference between source and medium?",
      answer: "Source is where the visit came from — a specific referrer like newsletter, google or partner-blog. Medium is the type of channel — email, cpc, social, referral. A useful check: if source and medium are the same word, one of them is wrong.",
    },
    {
      question: "Why is my paid traffic not showing as paid?",
      answer: "Almost always utm_medium. Analytics only counts \"cpc\" as paid search — \"ppc\", \"paid\" and \"adwords\" are treated as some other channel entirely and never reach the paid reports.",
    },
  ],
};
