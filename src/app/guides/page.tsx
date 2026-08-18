import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { JsonLdScript } from "@/components/shared/JsonLd";
import { guides, guideHref } from "@/config/guides";
import { absoluteUrl, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Guides",
  description: `Plain-English answers to the questions that come before the tool — image formats, social media sizes, and getting a file under a limit.`,
  alternates: { canonical: absoluteUrl("/guides") },
};

export default function GuidesPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Guides</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The questions that come before the tool. Which format, what size, how to
          get under a limit — answered properly, then pointed at something that
          does the job.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={guideHref(guide)}
                className={cn(
                  "surface-card surface-card-interactive group flex h-full flex-col gap-3 p-6",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                )}
              >
                <span className="grid size-10 place-items-center rounded-md border border-border bg-background">
                  <Icon className="size-5 text-foreground" strokeWidth={1.75} />
                </span>
                <h2 className="text-[0.9375rem] font-medium text-foreground">{guide.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
                <span className="mt-auto flex items-center gap-3 pt-2 text-xs text-subtle-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" strokeWidth={1.75} />
                    {guide.minutes} min
                  </span>
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${siteConfig.name} guides`,
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(guideHref(guide)),
            name: guide.title,
          })),
        }}
      />
    </>
  );
}
