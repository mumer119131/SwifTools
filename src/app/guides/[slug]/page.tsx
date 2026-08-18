import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideShell } from "@/components/shared/GuideShell";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { guides, getGuide, guideHref } from "@/config/guides";
import { guideContent } from "@/guides/loaders";
import { absoluteUrl, pageTitle, siteConfig } from "@/config/site";
import { breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: absoluteUrl(guideHref(guide)) },
    openGraph: {
      type: "article",
      title: pageTitle(guide.title),
      description: guide.description,
      url: absoluteUrl(guideHref(guide)),
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const Body = guideContent[slug];

  if (!guide || !Body) notFound();

  return (
    <>
      <GuideShell guide={guide}>
        <Body />
      </GuideShell>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.heading,
          description: guide.description,
          datePublished: guide.published,
          dateModified: guide.updated,
          author: { "@type": "Organization", name: siteConfig.author },
          publisher: { "@type": "Organization", name: siteConfig.author },
          mainEntityOfPage: absoluteUrl(guideHref(guide)),
        }}
      />
      <JsonLdScript
        data={breadcrumbLd([
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title, href: guideHref(guide) },
        ])}
      />
    </>
  );
}
