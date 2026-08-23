import { NextResponse } from "next/server";

import { clientIp, ipVersion } from "@/lib/net";

/**
 * Reports the caller's own IP address, read from the proxy headers.
 *
 * This response is specific to one visitor, so it must never be cached. A
 * shared cache in front of this route would serve the first visitor's address
 * to everyone behind it — a privacy leak rather than a stale number, which is
 * why both the route config and the header say so explicitly.
 *
 * Nothing is logged, stored, or looked up against a third party.
 */
export const dynamic = "force-dynamic";

export interface IpResponse {
  ip: string | null;
  version: 4 | 6 | null;
}

export async function GET(request: Request) {
  const ip = clientIp(request.headers);

  return NextResponse.json({ ip, version: ip ? ipVersion(ip) : null } satisfies IpResponse, {
    headers: { "cache-control": "no-store, no-cache, must-revalidate, private" },
  });
}
