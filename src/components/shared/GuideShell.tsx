import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import { ToolCard } from "@/components/shared/ToolCard";
import { guides, guideHref, type Guide } from "@/config/guides";
import { tools } from "@/config/tools";

/**
 * The frame every guide shares: breadcrumb, title block, the writing, then the
 * tools the guide is a front door for.
 *
 * A server component throughout. Guides are prose — there is nothing here for
 * the client to run, and rendering them server-side is the entire point.
 */
export function GuideShell({ guide, children }: { guide: Guide; children: React.ReactNode }) {
  const mentioned = guide.tools
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

  const others = guides.filter((other) => other.slug !== guide.slug);

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: guide.title, href: guideHref(guide) },
  ];

  const updated = new Date(guide.updated);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />

      <header className="mt-6">
        <h1 className="font-display text-3xl text-balance text-foreground sm:text-4xl">
          {guide.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          {guide.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-subtle-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" strokeWidth={1.75} />
            {guide.minutes} min read
          </span>
          <time dateTime={guide.updated}>
            Updated{" "}
            {updated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </time>
        </div>
      </header>

      <article
        className="
          mt-10
          [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground
          [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground
          [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
          [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
          [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5
          [&_li]:leading-relaxed [&_li]:text-muted-foreground
          [&_strong]:font-medium [&_strong]:text-foreground
          [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-70
          [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-foreground
        "
      >
        {children}
      </article>

      {mentioned.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl text-foreground">Tools for this</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything below runs in your browser. Nothing is uploaded.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {mentioned.map((tool) => (
              <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <nav className="mt-14 border-t border-border pt-8">
          <h2 className="text-sm font-medium text-foreground">More guides</h2>
          <ul className="mt-4 space-y-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={guideHref(other)}
                  className="group flex items-baseline gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-foreground underline underline-offset-4">
                    {other.title}
                  </span>
                  <ArrowRight
                    className="size-3.5 shrink-0 self-center transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
