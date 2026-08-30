import { appAdsTxt } from "@/config/ads";

/**
 * Authorises the Android apps, and is looked for at the root of whatever
 * website each Play Store listing names as the developer site. It is served
 * here so that pointing those listings at this domain does not silently break
 * app ad demand — the file is already in place before the switch, rather than
 * 404ing until someone notices.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(appAdsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
