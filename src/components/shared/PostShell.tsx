import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import { ToolCard } from "@/components/shared/ToolCard";
import { postHref, type PostMeta } from "@/posts";
import { tools } from "@/config/tools";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * The frame around a blog post.
 *
 * Close to `GuideShell` but not shared with it, because the two differ in the
 * ways that matter: a post leads with its publication date and reads as a
 * dated record, a guide leads with when it was last revised and reads as
 * current. Merging them would mean a flag deciding which of those a page is,
 * and the flag would eventually be wrong.
 */
export function PostShell({ post, children }: { post: PostMeta; children: React.ReactNode }) {
  const mentioned = (post.tools ?? [])
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: postHref(post) },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />

      <header className="mt-6">
        <h1 className="font-display text-3xl text-balance text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          {post.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-subtle-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated ? <span>Updated {formatDate(post.updated)}</span> : null}
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" strokeWidth={1.75} />
            {post.minutes} min read
          </span>
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
          [&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground
          [&_hr]:my-10 [&_hr]:border-border
        "
      >
        {children}
      </article>

      {mentioned.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl text-foreground">Mentioned in this post</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {mentioned.map((tool) => (
              <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="mt-14 border-t border-border pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.75} />
          All posts
        </Link>
      </nav>
    </div>
  );
}
