import { lookup } from "node:dns/promises";

import { NextResponse } from "next/server";

import { isPrivateAddress, isValidHostname } from "@/lib/net";

/**
 * Reports the HTTP response headers a URL returns, following redirects.
 *
 * This route fetches a URL the visitor chose, which makes it the one endpoint
 * on the site that could be pointed at the private network the server sits in.
 * The guard is to resolve each hostname first and refuse if any address it
 * resolves to is private — checking the resolved address rather than the name,
 * because a public name is free to point at 169.254.169.254.
 *
 * Redirects are followed by hand rather than by `fetch` so that every hop is
 * resolved and checked the same way; letting fetch follow them would validate
 * the first URL and then silently visit whatever it pointed at.
 *
 * One honest limitation: the name is resolved, checked, and then resolved again
 * by fetch, so a resolver that returns a public address to us and a private one
 * to fetch a moment later would slip through. Closing that fully means pinning
 * the connection to the address we checked, which cannot be done through fetch
 * without breaking TLS certificate validation. The window is small and the
 * blast radius is a header dump, so it is documented rather than papered over.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HOPS = 5;
const TIMEOUT_MS = 8000;

export interface HeaderHop {
  url: string;
  status: number;
  statusText: string;
  headers: [string, string][];
}

export interface HeadersResponse {
  hops: HeaderHop[];
}

/** Rejects anything that is not a public http(s) URL, with the reason why. */
async function assertFetchable(target: URL): Promise<string | null> {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return "Only http and https URLs can be checked.";
  }

  const host = target.hostname.replace(/^\[|\]$/g, "");

  // A bare address skips DNS entirely, so it is judged directly.
  if (!isValidHostname(host)) {
    if (isPrivateAddress(host)) return "That address is not publicly reachable.";
    return "Enter a full domain name, like example.com.";
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(host, { all: true });
  } catch {
    return `Could not resolve ${host}.`;
  }

  if (addresses.length === 0) return `Could not resolve ${host}.`;

  // Every address, not just the first: a name that resolves to one public and
  // one private address must be refused outright.
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    return "That hostname resolves to a private address, so it will not be fetched.";
  }

  return null;
}

export async function GET(request: Request) {
  const raw = (new URL(request.url).searchParams.get("url") ?? "").trim();
  if (raw === "") {
    return NextResponse.json({ error: "Enter a URL to check." }, { status: 400 });
  }

  let target: URL;
  try {
    // A scheme is anything before the first colon with no dot in it, which
    // distinguishes "file:" and "javascript:" from "example.com:8080". Only
    // genuinely scheme-less input gets https:// prepended — prepending it to
    // "file:///etc/passwd" produced the host "file" and the wrong refusal,
    // leaving the protocol check below unreachable for the input it exists for.
    const hasScheme = /^[a-z][a-z0-9+-]*:/i.test(raw);
    target = new URL(hasScheme ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "That is not a valid URL." }, { status: 400 });
  }

  const hops: HeaderHop[] = [];

  for (let hop = 0; hop < MAX_HOPS; hop += 1) {
    const refusal = await assertFetchable(target);
    if (refusal) {
      return NextResponse.json({ error: refusal }, { status: hops.length === 0 ? 400 : 502 });
    }

    let response: Response;
    try {
      response = await fetch(target, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "PocketToolz-HeaderChecker/1.0 (+https://pockettoolz.com)" },
      });
    } catch {
      return NextResponse.json(
        { error: `Could not reach ${target.hostname}. It may be down or blocking automated requests.` },
        { status: 502 },
      );
    }

    // Only the headers are wanted; dropping the body keeps a large page from
    // being pulled through the function for nothing.
    void response.body?.cancel();

    hops.push({
      url: target.toString(),
      status: response.status,
      statusText: response.statusText,
      headers: [...response.headers.entries()].sort(([a], [b]) => a.localeCompare(b)),
    });

    const location = response.headers.get("location");
    if (response.status < 300 || response.status >= 400 || !location) {
      return NextResponse.json({ hops } satisfies HeadersResponse, {
        headers: { "cache-control": "no-store" },
      });
    }

    try {
      target = new URL(location, target); // Relative Location headers are legal.
    } catch {
      return NextResponse.json({ hops } satisfies HeadersResponse);
    }
  }

  return NextResponse.json(
    { error: `Stopped after ${MAX_HOPS} redirects — the URL may be in a redirect loop.` },
    { status: 508 },
  );
}
