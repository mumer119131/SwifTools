import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Infinity as InfinityIcon,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
import { Badge } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { itemListLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const trustPoints = ["100% free", "No signup", "Files never leave your browser"];

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

  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="ambient-wash" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-20 pt-20 text-center sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
          <Badge variant="outline" className="animate-reveal mb-8">
            <Sparkles className="size-3" strokeWidth={2} aria-hidden="true" />
            <span data-numeric>{browsableTools.length}</span> tools ·{" "}
            <span data-numeric>{clientSide}</span> never upload a thing
          </Badge>

          <h1
            className="animate-reveal mx-auto max-w-4xl text-balance font-semibold tracking-[-0.04em] text-foreground"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              lineHeight: 1.02,
              animationDelay: "40ms",
            }}
          >
            {siteConfig.tagline}
          </h1>

          <p
            className="animate-reveal mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "80ms" }}
          >
            {siteConfig.description}
          </p>

          {/* Search first: it is how most people actually find a tool here. */}
          <div
            className="animate-reveal mx-auto mt-10 flex max-w-xl flex-col items-center gap-3"
            style={{ animationDelay: "120ms" }}
          >
            <SearchTrigger variant="hero" />
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/tools">
                Browse all {browsableTools.length} tools
                <ArrowRight strokeWidth={1.75} />
              </Link>
            </Button>
          </div>

          <ul
            className="animate-reveal mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            style={{ animationDelay: "160ms" }}
          >
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-subtle-foreground" aria-hidden="true" />
                {point}
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
                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
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
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
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
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
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
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
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
