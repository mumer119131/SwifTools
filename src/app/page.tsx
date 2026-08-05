import Link from "next/link";
import { ArrowRight, Gauge, Infinity as InfinityIcon, Lock, ShieldCheck, Sparkles } from "lucide-react";

import { categories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { popularTools, publishedTools, toolCountByCategory, tools } from "@/config/tools";
import { SearchTrigger } from "@/components/layout/SearchCommand";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolDirectory } from "@/components/home/ToolDirectory";
import { JsonLdScript } from "@/components/shared/JsonLd";
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

export default function HomePage() {
  const featured = popularTools.length > 0 ? popularTools : publishedTools.slice(0, 6);

  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="ambient-wash" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
          <Badge variant="outline" className="animate-reveal mb-7">
            <Sparkles className="size-3" strokeWidth={2} aria-hidden="true" />
            <span data-numeric>{tools.length}</span> tools and counting
          </Badge>

          <h1
            className="animate-reveal mx-auto max-w-4xl text-balance font-semibold tracking-[-0.035em] text-foreground"
            style={{ fontSize: "clamp(2.75rem, 6vw, 4.5rem)", lineHeight: 1.05, animationDelay: "40ms" }}
          >
            {siteConfig.tagline}
          </h1>

          <p
            className="animate-reveal mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "80ms" }}
          >
            {siteConfig.description}
          </p>

          <div
            className="animate-reveal mx-auto mt-9 flex max-w-xl flex-col items-center gap-3"
            style={{ animationDelay: "120ms" }}
          >
            <SearchTrigger variant="hero" />
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#tools">
                Browse all tools
                <ArrowRight strokeWidth={1.75} />
              </Link>
            </Button>
          </div>

          {/* --------------------------------------------------- Trust strip */}
          <ul
            className="animate-reveal mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
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

      {/* --------------------------------------------------- Category grid */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Browse by category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Eight collections covering the things people actually need to get done.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={cn(
                  "surface-card surface-card-interactive animate-reveal group flex flex-col gap-3 p-5",
                  `accent-${category.slug}`,
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                )}
                style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
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
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------- Popular tools */}
      {featured.length > 0 ? (
        <section className="border-y border-border bg-surface/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Popular tools
                </h2>
                <p className="mt-2 text-muted-foreground">The ones people reach for most.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="#tools">
                  See everything
                  <ArrowRight strokeWidth={1.75} />
                </Link>
              </Button>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((tool) => (
                <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------ Why <name> */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <header className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Why {siteConfig.name}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Most online tool sites upload your files to a server you know nothing about. This one
            mostly doesn&rsquo;t need to.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {valueProps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface-card flex gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-background">
                <Icon className="size-5 text-foreground" strokeWidth={1.75} />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-[0.9375rem] font-medium text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------- Full tool directory */}
      <section id="tools" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">All tools</h2>
          <p className="mt-2 text-muted-foreground">
            Every tool in one place. Filter below, or press{" "}
            <kbd className="inline-flex h-5 items-center rounded border border-border bg-surface px-1.5 font-mono text-[0.6875rem] text-muted-foreground">
              ⌘K
            </kbd>{" "}
            from anywhere.
          </p>
        </header>

        <ToolDirectory />
      </section>

      <JsonLdScript data={itemListLd(tools, `All ${siteConfig.name} tools`)} />
    </>
  );
}
