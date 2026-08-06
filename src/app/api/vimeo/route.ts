import { NextResponse } from "next/server";

/**
 * Proxies Vimeo's official oEmbed endpoint.
 *
 * oEmbed is the documented, public way to ask for a video's metadata — no key,
 * no scraping. It just has no CORS headers, so a browser cannot call it
 * directly. Going through our own route also means one cached upstream request
 * is shared across visitors.
 */
export const revalidate = 3600;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");

  if (!id || !/^\d{6,12}$/.test(id)) {
    return NextResponse.json({ error: "Pass a numeric Vimeo video ID." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}`)}`,
      { next: { revalidate }, headers: { accept: "application/json" } },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            upstream.status === 404
              ? "No public video with that ID. Private and password-protected videos can't be read."
              : `Vimeo returned ${upstream.status}.`,
        },
        { status: upstream.status === 404 ? 404 : 502 },
      );
    }

    const data = (await upstream.json()) as Record<string, unknown>;

    return NextResponse.json(
      {
        title: String(data.title ?? "Untitled"),
        authorName: String(data.author_name ?? ""),
        thumbnailUrl: String(data.thumbnail_url ?? ""),
        width: Number(data.thumbnail_width ?? 0),
        height: Number(data.thumbnail_height ?? 0),
        duration: Number(data.duration ?? 0),
      },
      { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json({ error: "Vimeo could not be reached." }, { status: 502 });
  }
}
