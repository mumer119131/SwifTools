import Link from "next/link";
import { ArrowRight, Gauge, Infinity as InfinityIcon, Lock, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  browsableTools,
  populatedCategories,
  popularTools,
  publishedTools,
  toolCountByCategory,
} from "@/config/tools";
import { SearchTrigger } from "@/components/layout/SearchCommand";
import { ToolCard } from "@/components/shared/ToolCard";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { itemListLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const trustPoints = [
  { label: "Free, with no limits", icon: InfinityIcon },
  { label: "No account, ever", icon: Lock },
  { label: "Files stay on your device", icon: ShieldCheck },
];

const valueProps = [
  {
    icon: Lock,
    title: "Private by default",
    body: "Almost every tool runs entirely in your browser. Your files are read locally, processed on your own device, and never uploaded to a server.",
  },
  {
    icon: Gauge,
    title: "Instant, not queued",
    body: "No upload wait, no processing queue, no email-me-the-file. Work starts the moment you drop a file and finishes at the speed of your machine.",
  },
  {
    icon: InfinityIcon,
    title: "No limits, no accounts",
    body: "No daily caps, no watermarks on your output, no sign-up wall before you can see the result. Use it as often as you need.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about the rest",
    body: "The handful of tools that genuinely need a server say so on the page. Those endpoints are stateless — nothing is written to disk or retained.",
  },
];

/** The stagger cap from the design system: six items, 40ms apart. */
function stagger(index: number): number {
  return Math.min(index, 5) * 40;
}

export default function HomePage() {
  const featured = (popularTools.length > 0 ? popularTools : publishedTools).slice(0, 6);
  const clientSide = browsableTools.filter((tool) => tool.processing === "client").length;

  /* Broad entry points rather than the biggest categories — someone landing
     cold is more likely to want "PDF" than "Units". */
  const quickLinks = ["pdf", "image", "text", "developer", "calculator", "converter"]
    .map((slug) => populatedCategories.find((category) => category.slug === slug))
    .filter((category): category is (typeof populatedCategories)[number] => Boolean(category));

  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="ambient-wash" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-4xl px-5 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
          <h1
            className="animate-reveal font-display text-balance text-center text-foreground"
            style={{ fontSize: "clamp(2.75rem, 7.5vw, 5.25rem)", lineHeight: 0.98 }}
          >
            {siteConfig.tagline}
          </h1>

          <p
            className="animate-reveal mx-auto mt-7 max-w-xl text-pretty text-center text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "60ms" }}
          >
            {browsableTools.length} free tools for files, images, text and code.{" "}
            <span className="text-foreground">{clientSide} of them never upload anything</span> —
            the work happens on your own device.
          </p>

          {/* The search is the hero's main action, not an afterthought below a
              button. Most people arrive knowing what they want. */}
          <div
            className="animate-reveal mx-auto mt-10 max-w-xl"
            style={{ animationDelay: "100ms" }}
          >
            <SearchTrigger variant="hero" />
          </div>

          {/* Jump straight in. Six categories, chosen as the broadest entry
              points rather than the largest. */}
          <div
            className="animate-reveal mt-6 flex flex-wrap items-center justify-center gap-2"
            style={{ animationDelay: "140ms" }}
          >
            {quickLinks.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-muted-foreground",
                    "transition-[color,border-color,transform] duration-[180ms] ease-out-expo",
                    "hover:-translate-y-px hover:border-border-strong hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    `accent-${category.slug}`,
                  )}
                >
                  <Icon className="text-accent size-3.5" strokeWidth={2} />
                  {category.label}
                </Link>
              );
            })}
            <Link
              href="/tools"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm text-foreground underline underline-offset-4",
                "transition-opacity duration-[180ms] ease-out-expo hover:opacity-70",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              )}
            >
              All {browsableTools.length}
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </Link>
          </div>

          <ul
            className="animate-reveal mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-8 text-sm text-muted-foreground"
            style={{ animationDelay: "180ms" }}
          >
            {trustPoints.map((point) => (
              <li key={point.label} className="flex items-center gap-2">
                <point.icon className="size-4 text-subtle-foreground" strokeWidth={1.75} />
                {point.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------- Popular tools */}
      {featured.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                  Start here
                </h2>
                <p className="mt-2 text-muted-foreground">The ones people reach for most.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/tools">
                  See everything
                  <ArrowRight strokeWidth={1.75} />
                </Link>
              </Button>
            </header>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool, index) => (
              <Reveal key={`${tool.category}/${tool.slug}`} delay={stagger(index)}>
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------- Category grid */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <header className="mb-10 max-w-2xl">
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                Browse by category
              </h2>
              <p className="mt-2 text-muted-foreground">
                {populatedCategories.length} collections covering the things people actually need to
                get done.
              </p>
            </header>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {populatedCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Reveal key={category.slug} delay={stagger(index % 6)}>
                  <Link
                    href={`/${category.slug}`}
                    className={cn(
                      "surface-card surface-card-interactive group flex h-full flex-col gap-3 p-5",
                      `accent-${category.slug}`,
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    )}
                  >
                    <span className="bg-accent-tint grid size-10 place-items-center rounded-md">
                      <Icon className="text-accent size-5" strokeWidth={1.75} />
                    </span>
                    <span className="space-y-1">
                      <span className="block text-[0.9375rem] font-medium text-foreground">
                        {category.label}
                      </span>
                      <span className="block text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </span>
                    </span>
                    <span className="mt-auto pt-1 text-xs text-subtle-foreground" data-numeric>
                      {toolCountByCategory[category.slug]} tools
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Why <name> */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <header className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Why {siteConfig.name}
            </h2>
            <p className="mt-2 text-muted-foreground">
              Most online tool sites upload your files to a server you know nothing about. This one
              mostly doesn&rsquo;t need to.
            </p>
          </header>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {valueProps.map(({ icon: Icon, title, body }, index) => (
            <Reveal key={title} delay={stagger(index)}>
              <div className="surface-card flex h-full gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-background">
                  <Icon className="size-5 text-foreground" strokeWidth={1.75} />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-[0.9375rem] font-medium text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Closing */}
      <section className="border-t border-border">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-24 text-center sm:px-6 lg:px-8">
          <div className="ambient-wash" aria-hidden="true" />
          <Reveal className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl text-foreground sm:text-4xl">
              Every tool, one page, nothing to sign up for.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              {browsableTools.length} tools across {populatedCategories.length} categories, filterable
              in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/tools">
                  Browse all tools
                  <ArrowRight strokeWidth={1.75} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/*
        The structured data describes what this page actually lists. The full
        catalogue's ItemList lives on /tools, where the full catalogue is —
        claiming 163 items here would describe a page that no longer exists.
      */}
      <JsonLdScript data={itemListLd(featured, `Popular ${siteConfig.name} tools`)} />
    </>
  );
}
