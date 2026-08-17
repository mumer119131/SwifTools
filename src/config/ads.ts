/**
 * Advertising configuration — one switch for the whole site.
 *
 * Everything ad-related reads from here: the script tag, the slot components,
 * ads.txt, and the wording of the privacy policy. That last one is the point.
 * A privacy page that says "no tracking cookies" while an ad script sets them
 * is not a stale document, it is a false statement — so the page is generated
 * from the same flag that turns the ads on and cannot drift out of step.
 *
 * With no publisher ID set, nothing ships: no script, no slots, no third-party
 * requests, and the privacy page says so plainly.
 */

/**
 * The AdSense publisher ID, in the form `ca-pub-0000000000000000`.
 *
 * Public by necessity — it appears in the page source of every AdSense site,
 * and ads.txt publishes it deliberately. It is an identifier, not a secret,
 * so it is defaulted here rather than left to an environment variable someone
 * has to remember: a missing ID means the verification tag never ships and the
 * application silently fails review. Override it for a staging property.
 */
const clientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || "ca-pub-1659754718895137";

/** Google's fixed identifier for AdSense in an ads.txt record. */
const GOOGLE_SELLER_ID = "f08c47fec0942fa0";

/** A publisher ID has a fixed shape; a malformed one silently serves nothing. */
const CLIENT_ID_PATTERN = /^ca-pub-\d{16}$/;

export const adsConfig = {
  clientId,
  /** True only when a well-formed publisher ID is configured. */
  enabled: CLIENT_ID_PATTERN.test(clientId),
  /**
   * Per-placement ad unit IDs, created in the AdSense dashboard.
   *
   * A slot with no unit ID renders nothing rather than an empty bordered box,
   * so you can switch placements on one at a time.
   */
  units: {
    "tool-rail": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL?.trim() ?? "",
    "between-steps": process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE?.trim() ?? "",
    "below-results": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW?.trim() ?? "",
  } as Record<string, string>,
} as const;

/**
 * The ads.txt body.
 *
 * Required by AdSense: without it, a large share of programmatic demand will
 * not bid, because buyers cannot verify the inventory is legitimately yours.
 * The file must be served at the domain root as plain text.
 */
export function adsTxt(): string {
  if (!adsConfig.enabled) {
    return "# No advertising is configured for this site.\n";
  }

  const publisherId = adsConfig.clientId.replace(/^ca-/, "");

  return [
    "# Authorised digital sellers for this domain.",
    "# https://iabtechlab.com/ads-txt/",
    `google.com, ${publisherId}, DIRECT, ${GOOGLE_SELLER_ID}`,
    "",
  ].join("\n");
}
