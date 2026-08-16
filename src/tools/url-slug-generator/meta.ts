import { Link } from "lucide-react";

import type { Tool } from "@/config/tools";

export const urlSlugGenerator: Tool = {
  slug: "url-slug-generator",
  name: "URL Slug Generator",
  category: "developer",
  description: "Turn any title into a clean, readable URL slug — accents folded, punctuation gone.",
  keywords: [
    "url slug generator",
    "slugify online",
    "permalink generator",
    "seo friendly url",
    "title to slug",
  ],
  icon: Link,
  processing: "client",
  status: "live",
  steps: [
    "Paste one title per line — the whole list is converted at once.",
    "Accented letters fold to their ASCII base, punctuation is dropped and spaces become your chosen separator.",
    "Duplicate slugs are numbered automatically, so a batch is always safe to use as URLs.",
  ],
  notes: [
    "A slug is the human-readable part of a URL. Making one means lowercasing, replacing spaces with hyphens, stripping punctuation, and collapsing runs of separators — so 'How to Bake Bread: A Beginner's Guide' becomes how-to-bake-bread-a-beginners-guide.",
    "Accented and non-Latin characters are transliterated rather than dropped, so café becomes cafe rather than caf. That is the behaviour you want for search and for sharing: percent-encoded UTF-8 in a URL is legal but turns into an unreadable string of escapes the moment it is copied into a plain-text context.",
    "Hyphens rather than underscores, by convention and for a practical reason: a URL is often rendered underlined, and an underscore disappears beneath the line. Google has also long treated hyphens as word separators and underscores as joiners.",
  ],
  faq: [
    {
      question: "Should I use hyphens or underscores in a URL?",
      answer: "Hyphens. Search engines treat them as word separators and underscores as joiners, so my_blog_post reads as one token and my-blog-post as three. Underscores also vanish under the underline that links usually carry.",
    },
    {
      question: "What happens to accented characters?",
      answer: "They are transliterated — café becomes cafe, naïve becomes naive. Leaving them in would produce percent-encoded escapes that turn unreadable the moment the URL is pasted into plain text.",
    },
    {
      question: "How long should a slug be?",
      answer: "Long enough to be descriptive, short enough to read at a glance — three to six words is typical. Dropping filler words like 'the' and 'a' usually improves it without losing meaning.",
    },
    {
      question: "Should I include numbers or dates in a slug?",
      answer: "Only if they are genuinely part of the identity of the page. A date in the URL makes an evergreen article look stale and makes it awkward to update, which is why most publications moved away from it.",
    },
    {
      question: "Does changing a slug affect SEO?",
      answer: "Yes — the old URL becomes a 404 and loses whatever ranking it had. If you must change one, set up a 301 redirect from the old address so links and ranking signals carry over.",
    },
  ],
};
