import type { Metadata } from "next";

import { ToolDirectory } from "@/components/home/ToolDirectory";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { absoluteUrl, siteConfig } from "@/config/site";
import { browsableTools, populatedCategories } from "@/config/tools";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Tools",
  description: `Every one of the ${browsableTools.length} free tools on ${siteConfig.name}, filterable by category. No signup, and almost all of them run entirely in your browser.`,
  alternates: { canonical: absoluteUrl("/tools") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/tools"),
    siteName: siteConfig.name,
    title: `All ${browsableTools.length} Tools | ${siteConfig.name}`,
    description: `Every tool on ${siteConfig.name}, filterable by category.`,
  },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "All tools", href: "/tools" },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbLd(crumbs),
          itemListLd(browsableTools, `All ${siteConfig.name} tools`),
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} className="mb-8" />

        <header className="max-w-2xl">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            All {browsableTools.length} tools
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Everything on {siteConfig.name}, across {populatedCategories.length} categories. Filter
            by category or search by name — most people find what they need faster with{" "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">
              ⌘K
            </kbd>
            .
          </p>
        </header>

        <div className="mt-10">
          <ToolDirectory />
        </div>
      </div>
    </>
  );
}
