import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategory } from "@/config/categories";
import { getTool, tools } from "@/config/tools";
import { ToolShell } from "@/components/shared/ToolShell";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { ToolRuntime } from "@/tools/loaders";
import {
  breadcrumbLd,
  buildToolMetadata,
  faqLd,
  howToLd,
  softwareApplicationLd,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ category: string; tool: string }>;
}

/** Every registered tool — live or planned — is pre-rendered at build time. */
export function generateStaticParams() {
  return tools.map((tool) => ({ category: tool.category, tool: tool.slug }));
}

/** Unknown combinations 404 rather than rendering an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) return {};

  const metadata = buildToolMetadata(tool);
  // Planned tools stay crawlable but shouldn't compete for the query yet.
  return tool.status === "live" ? metadata : { ...metadata, robots: { index: false, follow: true } };
}

export default async function ToolPage({ params }: PageProps) {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) notFound();

  const categoryMeta = getCategory(tool.category);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: categoryMeta?.label ?? tool.category, href: `/${tool.category}` },
    { label: tool.name, href: `/${tool.category}/${tool.slug}` },
  ];

  return (
    <>
      <ToolShell tool={tool}>
        <ToolRuntime slug={tool.slug} name={tool.name} />
      </ToolShell>
      <JsonLdScript
        data={[
          softwareApplicationLd(tool),
          howToLd(tool),
          faqLd(tool),
          breadcrumbLd(crumbs),
        ]}
      />
    </>
  );
}
