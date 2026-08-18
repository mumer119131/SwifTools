import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Rss } from "lucide-react";

import { JsonLdScript } from "@/components/shared/JsonLd";
import { postHref, posts } from "@/posts";
import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `What's new on ${siteConfig.name} — new tools, changes and the occasional note on how things are built.`,
  alternates: {
    canonical: absoluteUrl("/blog"),
    types: { "application/rss+xml": absoluteUrl("/blog/rss.xml") },
  },
};

export default function BlogPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">Blog</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              New tools, changes, and the occasional note on how something here
              is built. For the evergreen explanations, see the{" "}
              <Link href="/guides" className="text-foreground underline underline-offset-4">
                guides
              </Link>
              .
            </p>
          </div>
          <Link
            href="/blog/rss.xml"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Rss className="size-3.5" strokeWidth={1.75} />
            RSS
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">Nothing published yet.</p>
        ) : (
          <ol className="mt-12 space-y-10">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-border pb-10 last:border-0">
                <article>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3" strokeWidth={1.75} />
                      {post.minutes} min
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-medium text-foreground">
                    <Link href={postHref(post)} className="hover:opacity-70">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{post.summary}</p>
                  <Link
                    href={postHref(post)}
                    className="mt-3 inline-block text-sm text-foreground underline underline-offset-4 hover:opacity-70"
                  >
                    Read it
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${siteConfig.name} blog`,
          url: absoluteUrl("/blog"),
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            url: absoluteUrl(postHref(post)),
          })),
        }}
      />
    </>
  );
}
