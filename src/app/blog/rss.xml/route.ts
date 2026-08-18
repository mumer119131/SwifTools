import { postHref, posts } from "@/posts";
import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * RSS 2.0 for the blog.
 *
 * A feed is the one piece of syndication that still costs nothing and is still
 * read — by feed readers, and by the aggregators that occasionally pick up a
 * post and link back to it. Backlinks are the thing publishing on your own site
 * cannot manufacture, and this is one of the few levers that helps.
 *
 * Built by hand rather than with a library: it is forty lines of XML and a
 * dependency would be larger than the code.
 */
export const dynamic = "force-static";

/** XML has five predefined entities and no others. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const items = posts
    .map((post) => {
      const url = absoluteUrl(postHref(post));
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  // The build date is the newest post rather than now: rebuilding the site
  // without publishing anything should not tell readers the feed changed.
  const latest = posts[0] ? new Date(posts[0].date) : new Date();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
