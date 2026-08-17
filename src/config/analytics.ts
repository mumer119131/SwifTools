/**
 * Analytics configuration.
 *
 * Like the ad config, this is the single switch everything reads — the script,
 * the route-change tracking, and the wording of the privacy and about pages.
 * A site that claims it runs no analytics while loading gtag is not out of
 * date, it is lying, so the copy is generated from the same flag.
 */

/**
 * The GA4 measurement ID.
 *
 * Not a secret — it ships in the page source of every site using it. Kept in
 * config rather than only in the environment so a production deploy cannot
 * silently collect nothing because someone forgot a variable, but still
 * overridable for a staging property.
 */
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-G119BLT8H3";

/** A GA4 ID is "G-" followed by an alphanumeric string. */
const ID_PATTERN = /^G-[A-Z0-9]+$/i;

export const analyticsConfig = {
  measurementId: MEASUREMENT_ID,
  /**
   * Off in development, always.
   *
   * Otherwise every `pnpm dev` session and every local test run lands in the
   * production property, and the numbers you are trying to make decisions with
   * are mostly you. Set NEXT_PUBLIC_GA_DEBUG=1 to override when you genuinely
   * need to verify the wiring.
   */
  enabled:
    ID_PATTERN.test(MEASUREMENT_ID) &&
    (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_GA_DEBUG === "1"),
} as const;

/**
 * Consent Mode v2 defaults, region-scoped.
 *
 * Storage is denied by default in the UK and EEA and granted everywhere else.
 * That is Google's own recommended shape and it is the honest reading of the
 * law: consent is required where it is required, and blanket-denying
 * everywhere would mean collecting nothing at all until a consent platform is
 * configured.
 *
 * `wait_for_update` holds tags briefly so a consent banner can answer before
 * anything fires, rather than firing and being retroactively sorry.
 */
export const CONSENT_REGIONS = [
  // EEA
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE",
  // UK and Switzerland, which have equivalent regimes
  "GB", "CH",
];

/** The inline bootstrap, kept here so the component stays presentational. */
export function gtagBootstrap(measurementId: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
  region: ${JSON.stringify(CONSENT_REGIONS)}
});
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});

gtag('js', new Date());
gtag('config', '${measurementId}', {
  // Page views are sent explicitly on navigation instead, because the App
  // Router changes routes without a document load and the automatic
  // history-based measurement misses those inconsistently.
  send_page_view: false,
  anonymize_ip: true
});
`.trim();
}
