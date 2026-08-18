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
};
