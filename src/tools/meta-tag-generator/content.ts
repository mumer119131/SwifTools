import type { ToolContent } from "@/config/tool-content";

export const metaTagGeneratorContent: ToolContent = {
  steps: [
    "Fill in your page title, description, URL and social image.",
    "Watch the Google and social previews update, with length warnings before anything gets truncated.",
    "Copy the generated tags straight into your page's head.",
  ],
  notes: [
    "Meta tags tell search engines and social platforms how to present your page. The title and description govern the search result; Open Graph tags govern how a link looks when shared on Facebook, LinkedIn, Slack or WhatsApp; Twitter Card tags do the same for X.",
    "Length is what people get wrong. Google truncates titles around 60 characters and descriptions around 155, and the cut is by pixel width rather than character count, so a title full of capitals is clipped earlier. There is no penalty for going over — the tail is simply not shown, which is why the important words belong at the front.",
    "The description does not affect ranking directly, and Google frequently rewrites it using text from the page when it judges its own snippet more relevant to the query. It is worth writing well anyway: it is the sentence that decides whether someone clicks a result they can already see.",
  ],
  faq: [
    {
      question: "How long should a meta description be?",
      answer: "About 155 characters. Google truncates around there and measures by pixel width, so capitals and wide letters clip earlier. Put the important part first — the tail is often not shown at all.",
    },
    {
      question: "Do meta descriptions affect search ranking?",
      answer: "Not directly. They affect click-through rate, which matters commercially. Google also rewrites descriptions frequently when it thinks page text answers the query better than your written one.",
    },
    {
      question: "What are Open Graph tags for?",
      answer: "They control how a link looks when shared — the title, description and image shown in Facebook, LinkedIn, Slack, WhatsApp and most messaging apps. Without them the platform guesses, usually badly.",
    },
    {
      question: "What size should an Open Graph image be?",
      answer: "1200 by 630 pixels, a 1.91:1 ratio. Smaller images are shown as a small thumbnail rather than a large card, which is a considerable difference in how much attention a shared link attracts.",
    },
    {
      question: "Do I still need the meta keywords tag?",
      answer: "No. Google stopped using it in 2009 after it was abused into uselessness, and no major search engine considers it. Including it does no harm and no good.",
    },
  ],
};
