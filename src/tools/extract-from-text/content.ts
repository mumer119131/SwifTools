import type { ToolContent } from "@/config/tool-content";

export const extractFromTextContent: ToolContent = {
  steps: [
    "Paste any text — an email thread, a page of HTML, a document.",
    "Choose what to pull out: emails, URLs, phone numbers, dates and more.",
    "Deduplicate and sort in the same pass, then copy the list.",
  ],
  notes: [
    "The patterns are pragmatic rather than specification-complete, and that is a deliberate choice. A fully RFC 5322 compliant email pattern runs to several hundred characters, matches addresses nobody has ever used, and still cannot tell you whether an address exists. What people actually want is the things a human would point at in the text, which is a different and more useful job.",
    "Some patterns are stricter than they look. IP addresses are range-checked, so 999.1.1.1 is not matched. Hashtags must start with a letter, which keeps colour codes and bare numbers out. Mentions exclude the local part of an email address, so a thread full of addresses does not produce a list of fake usernames. URLs require a scheme, so bare domains are skipped — matching those reliably means guessing, and guessing produces noise.",
    "Phone numbers are the least reliable of the set, and unavoidably so: formats vary enormously by country and there is no pattern that catches them all without also catching order numbers, reference codes and long integers. Expect to skim the results rather than trust them, and use the deduplicate option, which usually removes most of the accidental matches.",
  ],
  faq: [
    {
      question: "How do I extract all email addresses from a block of text?",
      answer: "Paste the text and choose email addresses. Every address is pulled out in one pass, and turning on deduplicate collapses the repeats that a long email thread inevitably contains.",
    },
    {
      question: "Why are some phone numbers missed or wrongly matched?",
      answer: "Phone formats vary by country more than any other kind of data here, and no single pattern covers them all without also matching order numbers and reference codes. It errs towards finding too many rather than too few, on the basis that skimming a list is easier than noticing an absence.",
    },
    {
      question: "Does it find bare domains like example.com?",
      answer: "No — a URL has to include http:// or https://. Matching bare domains reliably means guessing whether a full stop separates a domain or ends a sentence, and that guess produces far more noise than it removes.",
    },
    {
      question: "Can I extract from HTML?",
      answer: "Yes. Paste the source and the patterns find what is in it, including URLs inside href attributes. If you only want the visible text, strip the tags first with find and replace.",
    },
    {
      question: "Is my text uploaded?",
      answer: "No. Extraction runs in your browser as you type, which matters here more than most — the text people paste into an extractor is usually a customer list, an email thread or a support export.",
    },
  ],
};
