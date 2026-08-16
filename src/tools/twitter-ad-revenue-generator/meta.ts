import { BadgeDollarSign } from "lucide-react";

import type { Tool } from "@/config/tools";

export const twitterAdRevenueGenerator: Tool = {
  slug: "twitter-ad-revenue-generator",
  name: "Ad Revenue Payout Mockup",
  category: "social",
  description: "Design a creator-payout dashboard mockup for concepts, decks and satire.",
  keywords: [
    "twitter ad revenue generator",
    "x payout screenshot",
    "creator earnings mockup",
    "ad revenue dashboard mockup",
  ],
  icon: BadgeDollarSign,
  processing: "client",
  status: "live",
  steps: [
    "Set the handle, payout amount, period and the impression and engagement figures.",
    "The card renders as a payout summary, in light or dark.",
    "Export a PNG. It is a mockup — see the note on the page about passing one off as real.",
  ],
  notes: [
    "Produces a mock image of an X ad-revenue payout notification. These screenshots circulate constantly and are trivially faked, which is precisely the point worth making: a screenshot of a number is not evidence of anything.",
    "The honest uses are satire, illustrating how easily such images are fabricated, and mockups. It is a picture of an interface, with no account, no payout and no platform behind it.",
    "Presenting a fabricated earnings figure as real to sell a course, attract clients or solicit investment is fraud, not exaggeration. That is a genuine risk with this particular format, which is why it is stated here rather than left implied.",
  ],
  faq: [
    {
      question: "Is this a real payout screenshot?",
      answer: "No. It is an image you have typed the numbers into, with no account and no platform behind it. That is worth knowing in both directions — including when you see one posted by someone else.",
    },
    {
      question: "What is this legitimately for?",
      answer: "Satire, and demonstrating how easily earnings screenshots are fabricated. A screenshot of a number has never been evidence, and showing that is a reasonable thing to want to do.",
    },
    {
      question: "Can I use a fake earnings screenshot to promote a course?",
      answer: "No. Presenting fabricated earnings as real to sell something is fraud rather than marketing, and it is prosecuted as such. Use real figures or none.",
    },
    {
      question: "How can I tell if someone's payout screenshot is fake?",
      answer: "You generally cannot from the image alone, which is the point. Fonts, spacing and figures are all trivially editable. Treat any unverifiable earnings claim as unverified.",
    },
    {
      question: "Is anything sent to X?",
      answer: "No. The image is drawn on a canvas in your browser. No account is connected and no request is made to any platform.",
    },
  ],
};
