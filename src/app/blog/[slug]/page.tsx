import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/shared/JsonLd";
import { PostShell } from "@/components/shared/PostShell";
import { getPost, postBodies, postHref, posts } from "@/posts";
import { absoluteUrl, pageTitle, siteConfig } from "@/config/site";
import { breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    alternates: { canonical: absoluteUrl(postHref(post)) },
    openGraph: {
      type: "article",
      title: pageTitle(post.title),
      description: post.summary,
      url: absoluteUrl(postHref(post)),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const Body = postBodies[slug];

  if (!post || !Body) notFound();

  return (
    <>
      <PostShell post={post}>
        <Body />
      </PostShell>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          author: { "@type": "Organization", name: siteConfig.author },
          publisher: { "@type": "Organization", name: siteConfig.author },
          mainEntityOfPage: absoluteUrl(postHref(post)),
        }}
      />
      <JsonLdScript
        data={breadcrumbLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: postHref(post) },
        ])}
      />
    </>
  );
}
