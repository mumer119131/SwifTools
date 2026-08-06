export interface PostImage {
  imageUrl: string;
  title: string | null;
  source: string;
}

/** Accepts /p/, /reel/, /reels/ and /tv/ post URLs. */
export function normaliseInstagramUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!url.hostname.replace(/^www\./, "").startsWith("instagram.com")) return null;

    const match = url.pathname.match(/^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;

    // Strip tracking parameters — they are noise and change the cache key.
    return `https://www.instagram.com/${match[1] === "reels" ? "reel" : match[1]}/${match[2]}/`;
  } catch {
    return null;
  }
}

export async function fetchPostImage(postUrl: string): Promise<PostImage> {
  const response = await fetch(`/api/og-image?url=${encodeURIComponent(postUrl)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "That post could not be read.");
  }

  return (await response.json()) as PostImage;
}
