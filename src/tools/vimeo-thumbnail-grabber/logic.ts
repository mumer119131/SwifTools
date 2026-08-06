export interface VimeoInfo {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  duration: number;
}

/** Accepts a full URL, a /channels/ or /groups/ path, or a bare numeric ID. */
export function extractVimeoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d{6,12}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/vimeo\.com\/(?:.*\/)?(\d{6,12})/);
  return match ? match[1] : null;
}

export async function fetchVimeoInfo(videoId: string): Promise<VimeoInfo> {
  const response = await fetch(`/api/vimeo?id=${encodeURIComponent(videoId)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "That video could not be found.");
  }

  return (await response.json()) as VimeoInfo;
}

/**
 * Vimeo's oEmbed thumbnail URL ends in `-dNNNxNNN`, which can be rewritten to
 * request a different size — undocumented but long-standing, and the only way
 * to get anything larger than the default.
 */
export function resize(thumbnailUrl: string, width: number): string {
  return thumbnailUrl.replace(/-d_\d+x\d+$/, `-d_${width}`).replace(/_\d+x\d+(\.\w+)?$/, `_${width}$1`);
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
