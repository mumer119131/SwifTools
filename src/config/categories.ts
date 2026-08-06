import {
  ArrowLeftRight,
  Ruler,
  AtSign,
  Calculator,
  Code2,
  FileText,
  Image as ImageIcon,
  Palette,
  Search,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "pdf"
  | "image"
  | "text"
  | "developer"
  | "converter"
  | "calculator"
  | "seo"
  | "generator"
  | "color"
  | "social"
  | "units";

export interface CategoryMeta {
  slug: ToolCategory;
  label: string;
  /** Short line used on category cards and the category page hero. */
  description: string;
  /** Longer copy used as the category page meta description. */
  metaDescription: string;
  icon: LucideIcon;
  /**
   * CSS custom property holding this category's accent hue. Both themes are
   * defined in `globals.css`; components read the variable, never a hex value.
   */
  accentVar: `--accent-${ToolCategory}`;
}

export const categories: readonly CategoryMeta[] = [
  {
    slug: "pdf",
    label: "PDF",
    description: "Merge, split, compress and convert PDF files.",
    metaDescription:
      "Free online PDF tools. Merge, split, compress, and convert PDFs to Word, JPG and back — right in your browser, with no uploads and no signup.",
    icon: FileText,
    accentVar: "--accent-pdf",
  },
  {
    slug: "image",
    label: "Image",
    description: "Compress, resize, crop and convert images.",
    metaDescription:
      "Free online image tools. Compress, resize, crop, convert between PNG, JPG and WEBP, add watermarks and remove backgrounds — all processed locally.",
    icon: ImageIcon,
    accentVar: "--accent-image",
  },
  {
    slug: "text",
    label: "Text",
    description: "Count, clean, compare and transform text.",
    metaDescription:
      "Free online text tools. Count words and characters, convert case, remove duplicate lines and compare two texts side by side.",
    icon: Type,
    accentVar: "--accent-text",
  },
  {
    slug: "developer",
    label: "Developer",
    description: "Format, encode, decode and generate for developers.",
    metaDescription:
      "Free developer tools. Format and validate JSON, encode Base64 and URLs, test regular expressions, pick colors and generate UUIDs.",
    icon: Code2,
    accentVar: "--accent-developer",
  },
  {
    slug: "converter",
    label: "Converter",
    description: "Convert units, currencies, timezones and number bases.",
    metaDescription:
      "Free online converters for units, currencies with live rates, timezones and number bases — fast, accurate and free.",
    icon: ArrowLeftRight,
    accentVar: "--accent-converter",
  },
  {
    slug: "calculator",
    label: "Calculator",
    description: "Finance, health and everyday calculators.",
    metaDescription:
      "Free online calculators for loans and EMI, compound interest, tax, BMI, calories, age and percentages.",
    icon: Calculator,
    accentVar: "--accent-calculator",
  },
  {
    slug: "seo",
    label: "SEO",
    description: "Meta tags, robots, sitemaps and content analysis.",
    metaDescription:
      "Free SEO tools. Generate meta tags, robots.txt and sitemaps, and analyse keyword density in your content.",
    icon: Search,
    accentVar: "--accent-seo",
  },
  {
    slug: "generator",
    label: "Generator",
    description: "Passwords, QR codes, placeholder data and more.",
    metaDescription:
      "Free online generators for secure passwords, QR codes, fake test data, lorem ipsum placeholder text and more.",
    icon: Sparkles,
    accentVar: "--accent-generator",
  },
  {
    slug: "units",
    label: "Units",
    description: "Convert length, weight, temperature and more.",
    metaDescription:
      "Free unit converters for length, weight, temperature, volume, area, speed, data and time — plus direct pages for common conversions like lb to kg and cm to inches.",
    icon: Ruler,
    accentVar: "--accent-units",
  },
  {
    slug: "social",
    label: "Social",
    description: "Mockups, chat generators and thumbnail grabbers.",
    metaDescription:
      "Free social media tools. Generate Instagram, tweet and chat mockups, apply filters, and grab video thumbnails from YouTube and Vimeo.",
    icon: AtSign,
    accentVar: "--accent-social",
  },
  {
    slug: "color",
    label: "Color",
    description: "Pick, convert, mix and build colour palettes.",
    metaDescription:
      "Free colour tools. Convert between HEX, RGB, HSL and OKLCH, generate harmonious palettes, mix two colours and check contrast.",
    icon: Palette,
    accentVar: "--accent-color",
  },
] as const;

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getCategory(slug: string): CategoryMeta | undefined {
  return categoryBySlug.get(slug as ToolCategory);
}

export const categorySlugs = categories.map((category) => category.slug);
