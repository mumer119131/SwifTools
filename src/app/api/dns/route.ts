import { Resolver } from "node:dns/promises";

import { NextResponse } from "next/server";

import { isValidHostname } from "@/lib/net";

/**
 * Public DNS record lookup.
 *
 * Only queries names that look like real public hostnames — `isValidHostname`
 * requires a dot, which keeps internal single-label names like "localhost" or a
 * container hostname from being probed through this endpoint.
 *
 * A DNS query is not a fetch: nothing here connects to the resolved address, so
 * this route cannot be used to reach the private network the way the header
 * checker could. The hostname filter is defence in depth, not the only guard.
 */
export const runtime = "nodejs";

/** Records change on their own TTL; a minute keeps a retry from being pointless. */
export const revalidate = 60;

const TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "CAA"] as const;
export type DnsType = (typeof TYPES)[number];

export interface DnsResponse {
  name: string;
  type: DnsType;
  records: string[];
}

/** Flattens node's per-type shapes into displayable lines. */
function formatRecords(type: DnsType, raw: unknown): string[] {
  if (type === "MX") {
    return (raw as { priority: number; exchange: string }[])
      .sort((a, b) => a.priority - b.priority)
      .map((entry) => `${entry.priority} ${entry.exchange}`);
  }

  // A TXT record arrives as an array of chunks that must be joined without a
  // separator — long values are split at 255 bytes on the wire, and a DKIM key
  // reassembled with spaces in it is silently wrong.
  if (type === "TXT") return (raw as string[][]).map((chunks) => chunks.join(""));

  if (type === "SOA") {
    const soa = raw as {
      nsname: string; hostmaster: string; serial: number;
      refresh: number; retry: number; expire: number; minttl: number;
    };
    return [
      `${soa.nsname} ${soa.hostmaster}`,
      `serial ${soa.serial}`,
      `refresh ${soa.refresh}s, retry ${soa.retry}s, expire ${soa.expire}s, min TTL ${soa.minttl}s`,
    ];
  }

  if (type === "CAA") {
    return (raw as Record<string, string>[]).map((entry) =>
      Object.entries(entry)
        .filter(([key]) => key !== "critical")
        .map(([key, value]) => `${key} "${value}"`)
        .join(" "),
    );
  }

  return (raw as string[]).map(String);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const name = (params.get("name") ?? "").trim().toLowerCase();
  const type = (params.get("type") ?? "A").toUpperCase() as DnsType;

  if (!isValidHostname(name)) {
    return NextResponse.json(
      { error: "Enter a full domain name, like example.com." },
      { status: 400 },
    );
  }

  if (!TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Unsupported record type. Choose one of ${TYPES.join(", ")}.` },
      { status: 400 },
    );
  }

  const resolver = new Resolver({ timeout: 5000, tries: 2 });

  try {
    const raw = await resolver.resolve(name, type);

    return NextResponse.json(
      { name, type, records: formatRecords(type, raw) } satisfies DnsResponse,
      { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (cause) {
    // ENODATA means the name exists but has no record of this type, which is a
    // real answer rather than a failure — telling someone their domain does not
    // exist because it has no CAA record would be actively misleading.
    const code = (cause as NodeJS.ErrnoException)?.code;

    if (code === "ENODATA") {
      return NextResponse.json({ name, type, records: [] } satisfies DnsResponse);
    }

    if (code === "ENOTFOUND" || code === "NXDOMAIN") {
      return NextResponse.json({ error: `No DNS record found for ${name}.` }, { status: 404 });
    }

    return NextResponse.json(
      { error: "The lookup did not complete. Try again in a moment." },
      { status: 502 },
    );
  }
}
