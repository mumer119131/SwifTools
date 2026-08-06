export interface Thumbnail {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
  note?: string;
}

/**
 * Extracts a video ID from every URL shape YouTube uses.
 *
 * Covers watch links, youtu.be shortlinks, /embed/, /v/, /shorts/, /live/ and a
 * bare 11-character ID — which is what people paste about half the time.
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // A bare ID: exactly 11 characters of the YouTube alphabet.
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const param = url.searchParams.get("v");
      if (param && /^[\w-]{11}$/.test(param)) return param;

      const segments = url.pathname.split("/").filter(Boolean);
      const marker = segments.findIndex((segment) =>
        ["embed", "v", "shorts", "live"].includes(segment),
      );
      if (marker !== -1 && segments[marker + 1]) {
        const id = segments[marker + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Google's thumbnail CDN serves fixed filenames per video. `maxresdefault` only
 * exists when the source was at least 1280×720, so it is flagged rather than
 * promised — a missing one returns a 120×90 placeholder, not a 404.
 */
export function thumbnailsFor(videoId: string): Thumbnail[] {
  const base = `https://i.ytimg.com/vi/${videoId}`;

  return [
    { id: "maxres", label: "Max resolution", url: `${base}/maxresdefault.jpg`, width: 1280, height: 720, note: "Only exists if the video was uploaded in HD" },
    { id: "sd", label: "Standard definition", url: `${base}/sddefault.jpg`, width: 640, height: 480 },
    { id: "hq", label: "High quality", url: `${base}/hqdefault.jpg`, width: 480, height: 360, note: "Always available" },
    { id: "mq", label: "Medium quality", url: `${base}/mqdefault.jpg`, width: 320, height: 180 },
    { id: "default", label: "Default", url: `${base}/default.jpg`, width: 120, height: 90 },
  ];
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
