import { NextResponse } from "next/server";

/**
 * Exchange-rate proxy.
 *
 * Rates come from Frankfurter, which republishes the European Central Bank's
 * daily reference rates. Going through our own route rather than calling it
 * from the browser buys three things: one cached upstream request shared by all
 * visitors instead of one per user, a stable response shape if the upstream
 * changes, and no third-party request originating from the user's browser —
 * which matters given the privacy claim made everywhere else on the site.
 *
 * No request body, no user data, nothing stored.
 */
const UPSTREAM = "https://api.frankfurter.dev/v1/latest";

/** The ECB publishes once per working day, so an hour of cache is generous. */
export const revalidate = 3600;

export interface RatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function GET(request: Request) {
  const base = (new URL(request.url).searchParams.get("base") ?? "EUR").toUpperCase();

  if (!/^[A-Z]{3}$/.test(base)) {
    return NextResponse.json({ error: "base must be a 3-letter currency code." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${UPSTREAM}?base=${base}`, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Rates are unavailable right now (upstream returned ${upstream.status}).` },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as RatesResponse;

    return NextResponse.json(
      { base: data.base, date: data.date, rates: data.rates } satisfies RatesResponse,
      {
        headers: {
          // Serve stale while refreshing so a slow upstream never blocks a user.
          "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach the exchange-rate service. Try again in a moment." },
      { status: 502 },
    );
  }
}
