import { NextResponse } from "next/server";

/**
 * Resolves the preview image a public page advertises to link crawlers.
 *
 * Used by the Instagram photo downloader. It fetches the post page and reads
 * its `og:image` — the same tag Slack or WhatsApp reads to build a link
 * preview — rather than scraping the private API. That keeps this to publicly
 * advertised metadata, but it is genuinely fragile: Instagram serves that tag
 * inconsistently to datacenter IPs and changes its markup often. The tool page
 * says so rather than letting a failure look like a bug.
 *
 * Nothing is stored, and the route only ever returns a URL.
 */
export const revalidate = 600;

const ALLOWED_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
]);

export interface OgImageResponse {
  imageUrl: string;
  title: string | null;
  source: string;
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "Pass a ?url= parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "That isn't a valid URL." }, { status: 400 });
  }

  // An allowlist, not a blocklist: without one this route is an open proxy that
  // could be pointed at internal addresses.
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json(
      { error: "Only public Instagram and Vimeo URLs are supported." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      next: { revalidate },
      headers: {
        // Identify as a link-preview crawler, which is what we actually are —
        // that is the request the og: tags exist to answer.
        "user-agent": "Mozilla/5.0 (compatible; SwiftKnifeBot/1.0; +link-preview)",
        accept: "text/html",
        "accept-language": "en",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            upstream.status === 404
              ? "That post doesn't exist, or it is private."
              : `The page could not be read (${upstream.status}). Private posts and rate limiting both cause this.`,
        },
        { status: 502 },
      );
    }

    // Only the head is needed; stop reading once the metadata is in.
    const html = (await upstream.text()).slice(0, 300_000);

    const imageUrl = matchMeta(html, "og:image") ?? matchMeta(html, "twitter:image");
    const title = matchMeta(html, "og:title");

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "No preview image was advertised on that page. It is probably private, or the markup changed.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { imageUrl: decodeEntities(imageUrl), title: title ? decodeEntities(title) : null, source: parsed.hostname } satisfies OgImageResponse,
      { headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json(
      { error: "That page could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }
}

/** Handles both attribute orders, which vary between sites. */
function matchMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
