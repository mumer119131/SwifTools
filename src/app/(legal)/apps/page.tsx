import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { JsonLdScript } from "@/components/shared/JsonLd";
import { playApps, playStoreUrl } from "@/config/apps";
import { getToolBySlug, toolHref } from "@/config/tools";
import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Android apps",
  description: `The Android apps from ${siteConfig.author}, the same people behind ${siteConfig.name} — including an offline currency converter and a random picker.`,
  alternates: { canonical: absoluteUrl("/apps") },
};

export default function AppsPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Android apps</h1>

        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            {siteConfig.name} is made by {siteConfig.author}, who also publish a handful of Android
            apps. They are listed here because a phone can do two things this site cannot: keep
            working with no connection at all, and stay on your home screen rather than in a tab.
          </p>
          <p>
            The currency converter is the clearest example. The{" "}
            <Link href="/converter/currency-converter">web version</Link> fetches the day&rsquo;s
            rates, so it needs a network to be accurate — which is no use on a plane or a foreign
            SIM. The app carries its rates with it.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {playApps.map((app) => {
            const related = app.relatedTools
              .map((slug) => getToolBySlug(slug))
              .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

            return (
              <article key={app.packageName} className="surface-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Image
                      src={app.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-xl border border-border"
                    />
                    <div>
                      <h2 className="text-[0.9375rem] font-medium text-foreground">{app.name}</h2>
                      <p className="text-sm text-muted-foreground">{app.tagline}</p>
                    </div>
                  </div>

                  <a
                    href={playStoreUrl(app)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                  >
                    Google Play
                    <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
                  </a>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {app.description}
                </p>

                {related.length > 0 ? (
                  <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    On this site:{" "}
                    {related.map((tool, index) => (
                      <span key={tool.slug}>
                        {index > 0 ? ", " : ""}
                        <Link href={toolHref(tool)}>{tool.name}</Link>
                      </span>
                    ))}
                    .
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          Everything on {siteConfig.name} stays free and needs no account, and that is not changing
          — the apps are a separate thing for the jobs a browser cannot do, not a paywall around
          the tools.
        </p>
      </div>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${siteConfig.author} Android apps`,
          itemListElement: playApps.map((app, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: app.name,
              description: app.description,
              applicationCategory: "MobileApplication",
              operatingSystem: "Android",
              url: playStoreUrl(app),
              author: { "@type": "Organization", name: siteConfig.author },
            },
          })),
        }}
      />
    </>
  );
}
