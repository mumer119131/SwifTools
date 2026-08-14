import { Lock, Server, Zap } from "lucide-react";

import { getCategory } from "@/config/categories";
import { getRelatedTools, type Tool } from "@/config/tools";
import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { ToolCard } from "@/components/shared/ToolCard";
import { AdSlotReservation } from "@/components/shared/AdSlot";
import { Badge } from "@/components/ui/misc";

interface ToolShellProps {
  tool: Tool;
  children: React.ReactNode;
}

/**
 * The consistent frame for every tool page: breadcrumb, title block, the tool
 * body, "how it works", and related tools — plus the reserved ad regions from
 * §10 that stay empty until ads are switched on.
 */
export function ToolShell({ tool, children }: ToolShellProps) {
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const Icon = tool.icon;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: category?.label ?? tool.category, href: `/${tool.category}` },
    { label: tool.name, href: `/${tool.category}/${tool.slug}` },
  ];

  const isClientSide = tool.processing === "client";

  return (
    <div className={`accent-${tool.category}`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumbs items={crumbs} className="mb-8" />

        <div className="flex gap-10">
          <div className="min-w-0 flex-1">
            <header className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="bg-accent-tint grid size-12 shrink-0 place-items-center rounded-lg">
                  <Icon className="text-accent size-6" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 space-y-2">
                  <h1 className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
                    {tool.name}
                  </h1>
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={tool.category} />
                <Badge variant="outline">
                  {isClientSide ? (
                    <Lock className="size-3" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Server className="size-3" strokeWidth={2} aria-hidden="true" />
                  )}
                  {isClientSide ? "Runs in your browser" : "Processed on our server"}
                </Badge>
                <Badge variant="outline">
                  <Zap className="size-3" strokeWidth={2} aria-hidden="true" />
                  Free, no signup
                </Badge>
              </div>
            </header>

            <div className="mt-10">{children}</div>

            {/* Reserved ad region (§10): between the tool and the explainer. */}
            <AdSlotReservation placement="between-steps" />

            {tool.notes?.length ? (
              <section id="about" className="mt-14 scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                  About the {tool.name}
                </h2>
                <div className="mt-5 max-w-2xl space-y-4">
                  {tool.notes.map((note) => (
                    <p key={note} className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {note}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            {tool.steps?.length ? (
              <section id="how-it-works" className="mt-14 scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                  How it works
                </h2>
                <ol className="mt-5 space-y-4">
                  {tool.steps.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-surface font-mono text-xs text-muted-foreground"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {tool.faq?.length ? (
              <section id="faq" className="mt-14 scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                  Frequently asked questions
                </h2>
                {/*
                  Plain markup rather than an accordion: collapsed content is
                  weighted lower by search engines, and there is no reason to
                  hide four short answers behind a click.
                */}
                <dl className="mt-5 max-w-2xl space-y-6">
                  {tool.faq.map((entry) => (
                    <div key={entry.question}>
                      <dt className="text-[0.9375rem] font-medium text-foreground">
                        {entry.question}
                      </dt>
                      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {entry.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section className="mt-14">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                Privacy
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                {isClientSide
                  ? `Everything happens locally. Your files are read by your own browser, processed on your device, and never uploaded — closing the tab is all it takes to erase them.`
                  : `Your file is streamed to a stateless endpoint, processed in memory and streamed straight back. Nothing is written to disk and nothing is retained after the response.`}
              </p>
            </section>

            {related.length > 0 ? (
              <section className="mt-14">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                  Related {category?.label} tools
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <ToolCard key={item.slug} tool={item} showCategory={false} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Reserved ad rail (§10). Only occupies space at xl and above. */}
          <AdSlotReservation placement="tool-rail" />
        </div>
      </div>
    </div>
  );
}
