import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategory } from "@/config/categories";
import { getToolsByCategory, populatedCategories } from "@/config/tools";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolCard } from "@/components/shared/ToolCard";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { Badge } from "@/components/ui/misc";
import { breadcrumbLd, buildCategoryMetadata, itemListLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return populatedCategories.map((category) => ({ category: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return buildCategoryMetadata(category) ?? {};
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(category.slug);
  const liveCount = categoryTools.filter((tool) => tool.status === "live").length;
  const Icon = category.icon;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: category.label, href: `/${category.slug}` },
  ];

  return (
    <div className={`accent-${category.slug}`}>
      <section className="relative border-b border-border">
        <div className="ambient-wash" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <div className="flex items-start gap-4">
            <span className="bg-accent-tint grid size-12 shrink-0 place-items-center rounded-lg">
              <Icon className="text-accent size-6" strokeWidth={1.75} />
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
                {category.label} Tools
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {category.metaDescription}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  <span data-numeric>{categoryTools.length}</span> tools
                </Badge>
                {liveCount < categoryTools.length ? (
                  <Badge>
                    <span data-numeric>{liveCount}</span> available now
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <h2 className="sr-only">All {category.label} tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showCategory={false} />
          ))}
        </div>
      </section>

      <JsonLdScript
        data={[
          itemListLd(categoryTools, `${category.label} tools`),
          breadcrumbLd(crumbs),
        ]}
      />
    </div>
  );
}
