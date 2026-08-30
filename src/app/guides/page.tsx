import type { Metadata } from "next";
import { GuideCard } from "@/components/shared/GuideCard";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { guideHref, guides } from "@/config/guides";
import { absoluteUrl, siteConfig } from "@/config/site";

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
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
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
