import type { LucideIcon } from "lucide-react";
import { Braces, ChefHat, HardDrive, CircuitBoard, Clock, Dices, FileDown, FileText, FlaskConical, ImageIcon, KeyRound, LayoutGrid, MessageSquare, Network, Palette, PiggyBank, Rocket, Type, Regex, Ruler, Search, ShieldCheck, Scale } from "lucide-react";

/**
 * The guides registry.
 *
 * Guides exist to answer the questions people ask *before* they know which tool
 * they need — "png or jpg", "what size is an Instagram post", "how do I get
 * this under 5MB". A tool page cannot rank for those without becoming a worse
 * tool page, and a visitor who arrives on one is a visitor with a job to do.
 *
 * Kept deliberately separate from the prose, the same way `tools.ts` is: the
 * registry is small and structural, the writing lives in `content.tsx` beside
 * each guide and is rendered server-side only. See `@/config/tool-content` for
 * why that split matters.
 */
export interface Guide {
  slug: string;
  title: string;
  /** The <h1>, which can be longer and more natural than the nav title. */
  heading: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
  /** ISO date. Used for `datePublished` and the sitemap. */
  published: string;
  updated: string;
  /** Roughly how long it takes to read, in minutes. */
  minutes: number;
  /**
   * Tools this guide is the front door for.
   *
   * Rendered as a "tools mentioned" rail, and used to link the two directions:
   * a guide that sends nobody to a tool is just an article.
   */
  tools: string[];
}

export const guides: Guide[] = [
  {
    slug: "image-formats",
    title: "Choosing an image format",
    heading: "PNG, JPG, WebP or AVIF: which should you use?",
    description:
      "A straight answer for each kind of image — photographs, logos, screenshots, transparency — and what each format costs you.",
    keywords: [
      "png vs jpg",
      "webp vs png",
      "jpg vs jpeg",
      "avif vs webp",
      "best image format for web",
      "which image format should i use",
      "png or jpg for photos",
      "image format comparison",
    ],
    icon: ImageIcon,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: [
      "png-to-jpg",
      "jpg-to-png",
      "png-to-webp",
      "webp-to-png",
      "heic-to-jpg",
      "svg-to-png",
      "convert-image",
      "compress-image",
    ],
  },
  {
    slug: "social-media-image-sizes",
    title: "Social media image sizes",
    heading: "Every social media image size, and why they keep changing",
    description:
      "Current upload dimensions for Instagram, X, LinkedIn, Facebook, YouTube, TikTok and Pinterest — plus how to crop without losing the subject.",
    // Deliberately broad. The specific placement queries — "instagram post
    // size", "youtube thumbnail size" — belong to the resizer, which can
    // actually do the job; a guide bidding for them would put two of our own
    // pages against each other. check-guides.ts enforces the divide.
    keywords: [
      "social media image sizes",
      "social media image dimensions",
      "social media aspect ratios",
      "what size should social media images be",
      "image sizes for every platform",
      "social media size guide",
      "why do social media image sizes change",
    ],
    icon: LayoutGrid,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["social-media-resizer", "crop-image", "resize-image", "play-store-screenshot-generator"],
  },
  {
    slug: "reduce-file-size",
    title: "Making a file smaller",
    heading: "How to get a file under the size limit",
    description:
      "What actually makes a PDF or an image large, which lever to pull first, and how to lose the least quality doing it.",
    keywords: [
      "reduce file size",
      "how to compress a file",
      "email attachment too large",
      "file too large to upload",
      "compress pdf under 5mb",
      "make image smaller",
      "reduce photo file size",
      "resize or compress first",
    ],
    icon: FileDown,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["compress-image", "resize-image", "compress-pdf", "convert-image", "split-pdf"],
  },
  {
    slug: "online-tool-privacy",
    title: "Are online tools safe?",
    heading: "What actually happens to a file you put into an online tool",
    description:
      "Most converters upload your file to a server you know nothing about. Some do not need to \u2014 here is how to tell the difference, and how to check for yourself.",
    keywords: [
      "are online converters safe",
      "do online tools upload my files",
      "is it safe to upload documents online",
      "online pdf converter privacy",
      "client side file processing",
      "browser based tools privacy",
      "what happens to files i upload",
    ],
    icon: ShieldCheck,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: ["exif-viewer", "compress-pdf", "merge-pdf", "compress-image", "password-generator"],
  },
  {
    slug: "hashing-encoding-encryption",
    title: "Hashing, encoding and encryption",
    heading: "Hashing, encoding and encryption are three different things",
    description:
      "Base64 is not encryption, a hash is not reversible, and confusing them is how credentials end up in plain sight. What each one is actually for.",
    keywords: [
      "encoding vs encryption",
      "is base64 encryption",
      "hashing vs encryption",
      "what is a hash",
      "difference between hashing and encoding",
      "is md5 secure",
      "why can't you decrypt a hash",
    ],
    icon: KeyRound,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 8,
    tools: [
      "sha256-hash-generator",
      "md5-hash-generator",
      "base64-encode-decode",
      "hmac-generator",
      "jwt-decoder",
      "password-generator",
    ],
  },
  {
    slug: "pdf-basics",
    title: "Working with PDFs",
    heading: "Why PDFs behave the way they do",
    description:
      "Why the text will not copy, why the file is 40MB, why editing one is awkward \u2014 and what to do about each.",
    keywords: [
      "how do pdfs work",
      "why is my pdf so big",
      "why can't i copy text from a pdf",
      "scanned pdf vs text pdf",
      "pdf explained",
      "why are pdfs hard to edit",
    ],
    icon: FileText,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "colour-formats",
    title: "Colour on the web",
    heading: "HEX, RGB, HSL and OKLCH: which colour format to use",
    description:
      "Four ways to write the same colour, and why the newest one finally makes lightness mean what you expect.",
    keywords: [
      "hex vs rgb",
      "what is hsl",
      "oklch colour",
      "css colour formats",
      "how do hex colours work",
      "rgb vs hsl",
      "which colour format should i use",
    ],
    icon: Palette,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["color-picker", "color-palette-generator", "color-mixer", "contrast-checker"],
  },
  {
    slug: "metric-imperial",
    title: "Metric and imperial",
    heading: "Metric and imperial: what actually differs, and what to watch for",
    description:
      "Why two systems still exist, the conversions worth memorising, and the three that catch people out \u2014 including a gallon that is not a gallon.",
    keywords: [
      "metric vs imperial",
      "why does the us use imperial",
      "metric imperial differences",
      "us gallon vs uk gallon",
      "imperial system explained",
      "why is a us pint smaller",
      "conversion factors worth memorising",
    ],
    icon: Scale,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: [
      "unit-converter",
      "length-converter",
      "weight-converter",
      "temperature-converter",
      "volume-converter",
      "cooking-measurement-converter",
    ],
  },
  {
    slug: "measuring-a-room",
    title: "Measuring a room",
    heading: "How to measure a room for paint, flooring or tiles",
    description:
      "Which measurements each job actually needs, how much to add for waste, and the openings people forget to subtract.",
    keywords: [
      "how to measure a room",
      "measuring a room step by step",
      "how much paint do i need for a room",
      "measuring for flooring",
      "how much waste to add tiles",
      "measuring a room for wallpaper",
    ],
    icon: Ruler,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: [
      "square-footage-calculator",
      "room-size-calculator",
      "paint-calculator",
      "flooring-calculator",
      "tile-calculator",
      "wallpaper-calculator",
    ],
  },
  {
    slug: "regular-expressions",
    title: "Regular expressions",
    heading: "Regular expressions, from the parts you actually need",
    description:
      "The dozen or so pieces that cover almost every real use, why greedy matching surprises everyone, and when not to reach for a regex at all.",
    keywords: [
      "regex explained",
      "regular expressions tutorial",
      "what does .* mean in regex",
      "greedy vs lazy matching",
      "regex cheat sheet",
      "when not to use regex",
    ],
    icon: Regex,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 9,
    tools: ["regex-tester", "find-and-replace", "extract-from-text", "sort-lines"],
  },
  {
    slug: "randomness",
    title: "How random is random?",
    heading: "How random is random, and when it matters",
    description:
      "Why a coin flip on a computer is not a coin flip, the bias hiding in the obvious implementation, and when any of it actually matters.",
    keywords: [
      "how random are online randomisers",
      "is math.random truly random",
      "pseudorandom vs true random",
      "modulo bias",
      "fair shuffle algorithm",
      "are online dice fair",
    ],
    icon: Dices,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 8,
    tools: [
      "random-number-generator",
      "coin-flipper",
      "dice-roller",
      "wheel-spinner",
      "list-randomizer",
      "random-name-picker",
      "password-generator",
    ],
  },
  {
    slug: "electronics-basics",
    title: "Electronics basics",
    heading: "Ohm's law, resistors and why your LED needs one",
    description:
      "The one equation that explains most of a beginner circuit, how to read a resistor, and the calculation that stops an LED burning out.",
    keywords: [
      "ohms law explained",
      "why do leds need a resistor",
      "how to read resistor colour bands",
      "voltage divider explained",
      "electronics for beginners",
      "what is a current limiting resistor",
    ],
    icon: CircuitBoard,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 8,
    tools: [
      "ohms-law-calculator",
      "led-resistor-calculator",
      "resistor-color-code-calculator",
      "voltage-divider-calculator",
      "capacitor-calculator",
    ],
  },
  {
    slug: "technical-seo",
    title: "Technical SEO",
    heading: "The technical SEO that actually matters",
    description:
      "Robots, canonicals, structured data and sitemaps \u2014 what each one really does, and the confusions that cost people their rankings.",
    keywords: [
      "technical seo basics",
      "robots.txt vs noindex",
      "what is a canonical tag",
      "what is structured data",
      "why is my page not indexed",
      "technical seo checklist",
    ],
    icon: Search,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 9,
    tools: [
      "meta-tag-generator",
      "schema-generator",
      "robots-txt-generator",
      "robots-txt-tester",
      "sitemap-generator",
      "hreflang-generator",
      "utm-builder",
    ],
  },
  {
    slug: "social-media-mockups",
    title: "Social media mockups",
    heading: "Making social media mockups, and the line not to cross",
    description:
      "Why designers fake a feed, how to make one that reads convincingly in a presentation, and where a mockup stops being a mockup.",
    keywords: [
      "social media mockup",
      "fake tweet for a presentation",
      "designing social proof mockups",
      "how to mock up a social post",
      "chat mockup for a tutorial",
      "social media mockup ethics",
    ],
    icon: MessageSquare,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: [
      "tweet-generator",
      "tweet-to-image",
      "instagram-post-generator",
      "whatsapp-chat-generator",
      "imessage-chat-generator",
    ],
  },
  {
    slug: "timestamps-and-timezones",
    title: "Timestamps and timezones",
    heading: "Unix time, UTC and why your dates are an hour out",
    description:
      "What a timestamp actually counts, why UTC is not a timezone you should ever store in, and the four bugs that catch everyone.",
    keywords: [
      "unix timestamp explained",
      "utc vs gmt",
      "why is my date an hour out",
      "how to store dates in a database",
      "iso 8601 format",
      "daylight saving time bugs",
      "epoch time explained",
    ],
    icon: Clock,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 8,
    tools: [
      "unix-timestamp-converter",
      "timezone-converter",
      "date-difference-calculator",
      "cron-expression-builder",
    ],
  },
  {
    slug: "dns-records",
    title: "How DNS works",
    heading: "DNS records explained: A, CNAME, MX, TXT and the rest",
    description:
      "What each record type is for, why a CNAME cannot sit on your bare domain, and why the change you made an hour ago still has not taken effect.",
    keywords: [
      "what is dns",
      "how dns works",
      "dns records explained",
      "what is an a record",
      "a record vs cname",
      "what does an mx record do",
      "dns ttl explained",
      "types of dns record",
    ],
    icon: Network,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 9,
    tools: [
      "dns-lookup",
      "http-header-checker",
      "http-status-codes",
      "subnet-calculator",
      "what-is-my-ip",
    ],
  },
  {
    slug: "data-formats",
    title: "JSON, YAML and CSV",
    heading: "JSON, YAML or CSV: which one, and what each gets wrong",
    description:
      "Why JSON is strict on purpose, the YAML values that silently change meaning, and the number precision bug that quietly corrupts large IDs.",
    keywords: [
      "json vs yaml",
      "what is json",
      "yaml vs csv",
      "when to use yaml",
      "json syntax rules",
      "why is my json invalid",
      "json number precision",
      "csv quoting rules",
    ],
    icon: Braces,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 10,
    tools: [
      "json-formatter",
      "json-tree-viewer",
      "json-diff",
      "json-to-typescript",
      "csv-to-json",
      "yaml-to-json",
      "sql-formatter",
    ],
  },
  {
    slug: "chemistry-calculations",
    title: "Chemistry calculations",
    heading: "Moles, molarity and pH: the calculations that come up most",
    description:
      "The mole, molar mass, dilution, limiting reagents, pH as a logarithm, and the significant-figure rule most people merge with the wrong one.",
    keywords: [
      "what is a mole in chemistry",
      "how to calculate molar mass",
      "molarity vs molality",
      "what does ph measure",
      "limiting reagent explained",
      "significant figures rules",
      "avogadro's number explained",
      "theoretical yield vs percent yield",
    ],
    icon: FlaskConical,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 11,
    tools: [
      "ph-calculator",
      "molecular-weight-calculator",
      "stoichiometry-calculator",
      "dilution-calculator",
      "ideal-gas-law-calculator",
      "significant-figures-calculator",
      "density-calculator",
    ],
  },
  {
    slug: "mechanics-formulas",
    title: "Mechanics formulas",
    heading: "Force, energy and momentum: the mechanics formulas that recur",
    description:
      "F = ma, kinetic energy, momentum, work, torque, springs and projectiles — and why noticing which quantity is squared decides the answer.",
    keywords: [
      "physics formulas explained",
      "difference between work and power",
      "kinetic energy vs momentum",
      "why does speed matter in a crash",
      "what is a newton",
      "inverse square law explained",
      "projectile motion explained",
    ],
    icon: Rocket,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 10,
    tools: [
      "force-calculator",
      "kinetic-energy-calculator",
      "momentum-calculator",
      "work-done-calculator",
      "torque-calculator",
      "hookes-law-calculator",
      "projectile-motion-calculator",
      "gravitational-force-calculator",
    ],
  },
  {
    slug: "kitchen-conversions",
    title: "Kitchen conversions",
    heading: "Cups, ovens and scaling: the conversions recipes get wrong",
    description:
      "Why a cup of flour has no fixed weight, what a fan oven really runs at, and the three things that do not scale when you double a recipe.",
    keywords: [
      "why weigh baking ingredients",
      "fan oven vs conventional",
      "how to double a recipe",
      "cup measurements explained",
      "us vs uk tablespoon",
      "does cooking time double",
      "cake tin size conversion",
    ],
    icon: ChefHat,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 8,
    tools: [
      "cooking-measurement-converter",
      "oven-temperature-converter",
      "recipe-scaler",
      "cooking-time-calculator",
    ],
  },
  {
    slug: "household-running-costs",
    title: "Household running costs",
    heading: "What things actually cost to run, and where the money goes",
    description:
      "Kilowatt-hours and standing charges, metered versus unmetered water, why solar payback depends on when you use power, and the costs people miss.",
    keywords: [
      "how to work out appliance running cost",
      "what is a kilowatt hour",
      "what is a standing charge",
      "metered vs unmetered water",
      "does solar pay for itself",
      "which appliances cost most to run",
      "how to compare tariffs",
    ],
    icon: PiggyBank,
    published: "2026-08-22",
    updated: "2026-08-22",
    minutes: 9,
    tools: [
      "electricity-cost-calculator",
      "water-bill-calculator",
      "solar-savings-calculator",
      "subscription-tracker",
      "unit-price-calculator",
      "fuel-cost-calculator",
    ],
  },
  {
    slug: "data-sizes",
    title: "Bytes, bits and drive sizes",
    heading: "Why your 1TB drive says 931GB, and other size confusions",
    description:
      "Bits versus bytes, the 1000-versus-1024 split that eats 69GB of a terabyte, which convention applies where, and the hidden 33% Base64 adds.",
    keywords: [
      "why is my 1tb drive 931gb",
      "mb vs mib",
      "bits vs bytes",
      "what is a kibibyte",
      "megabits vs megabytes",
      "why is my internet slower than advertised",
      "how big is a gigabyte",
    ],
    icon: HardDrive,
    published: "2026-08-25",
    updated: "2026-08-25",
    minutes: 8,
    tools: [
      "data-converter",
      "compress-image",
      "compress-pdf",
      "image-to-base64",
      "base64-encode-decode",
    ],
  },
  {
    slug: "formatting-and-minifying",
    title: "Formatting and minifying",
    heading: "Formatting and minifying: the same tool pointed both ways",
    description:
      "Why a formatter doubles as a syntax check, what minifying actually removes, why renaming variables is safe, and where it stops being safe.",
    keywords: [
      "what does minifying do",
      "why minify javascript",
      "formatting vs minifying",
      "what is a source map",
      "is minified code safe",
      "does minifying replace gzip",
      "why is my json invalid trailing comma",
    ],
    icon: Braces,
    published: "2026-08-25",
    updated: "2026-08-25",
    minutes: 8,
    tools: [
      "js-formatter",
      "js-minifier",
      "css-formatter",
      "css-minifier",
      "html-formatter",
      "sql-formatter",
      "json-formatter",
    ],
  },
  {
    slug: "counting-text",
    title: "Counting words and characters",
    heading: "Why two tools disagree about how long your text is",
    description:
      "What counts as a word, why one emoji can be 1, 8 or 25 depending on how you ask, and the invisible characters that quietly break comparisons.",
    keywords: [
      "what counts as a word",
      "why do character counts differ",
      "how many characters is an emoji",
      "smart quotes syntax error",
      "non breaking space problem",
      "crlf vs lf line endings",
      "characters vs bytes",
    ],
    icon: Type,
    published: "2026-08-25",
    updated: "2026-08-25",
    minutes: 9,
    tools: [
      "word-counter",
      "character-counter",
      "unicode-lookup",
      "text-diff",
      "remove-duplicate-lines",
      "case-converter",
      "strip-html",
      "remove-line-breaks",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideHref(guide: Pick<Guide, "slug">): string {
  return `/guides/${guide.slug}`;
}
