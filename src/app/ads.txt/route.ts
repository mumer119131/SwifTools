import { adsTxt } from "@/config/ads";

/**
 * Served from a route rather than a static file so it stays in step with the
 * configured publisher ID. A stale ads.txt naming a publisher you no longer
 * use is worse than none: it authorises someone else to sell your inventory.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(adsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
