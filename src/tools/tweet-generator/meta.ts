import { Feather } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tweetGenerator: Tool = {
  slug: "tweet-generator",
  name: "Tweet Generator",
  category: "social",
  description: "Design a realistic tweet mockup with avatar, badge and engagement counts.",
  keywords: [
    "tweet generator",
    "fake tweet generator",
    "twitter post mockup",
    "x post generator",
  ],
  icon: Feather,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Enter a name, handle and the post text, and upload an avatar if you have one.",
    "Set engagement counts, add an image, and switch between light and dark.",
    "Download a PNG at up to 3× for slides, mockups or memes.",
  ],
  notes: [
    "Builds a mock tweet with your own text, name, handle, avatar and engagement figures, rendered as an image you can download. It is drawn directly onto a canvas rather than screenshotted from HTML, which is what makes the output consistent regardless of which fonts your machine happens to have.",
    "The legitimate uses are design mockups, presentation slides, tutorials and satire that is obviously satire. What it produces is a picture, not a tweet — there is no post behind it, and anyone who checks will find nothing.",
    "That cuts both ways, and it is worth saying plainly: fabricating a post attributed to a real person and presenting it as genuine is defamatory in most jurisdictions and gets people sued. Use your own name, an obviously fictional one, or make the context unmistakable.",
  ],
  faq: [
    {
      question: "Does this create a real tweet?",
      answer: "No. It produces an image that looks like a tweet. Nothing is posted, no account is involved, and anyone who searches for the post will find that it does not exist.",
    },
    {
      question: "What can I legitimately use a fake tweet image for?",
      answer: "Design mockups, presentation slides, tutorials, and satire that is clearly satire. Anywhere you need to show what a post would look like without publishing one.",
    },
    {
      question: "Is it legal to make a fake tweet from someone else?",
      answer: "Fabricating a statement and attributing it to a real person can be defamation, and presenting it as genuine has led to real lawsuits. Use your own name, an obviously fictional one, or make the parody unmistakable in context.",
    },
    {
      question: "Why does the image not match X exactly?",
      answer: "Because the platform's interface changes constantly and any mockup is a snapshot of one moment. It is close enough for a slide or a design review, not a forensic reproduction.",
    },
    {
      question: "Are my details uploaded when I generate one?",
      answer: "No. The image is drawn on a canvas in your browser and downloaded from memory. Your text and avatar never leave your device.",
    },
  ],
};
