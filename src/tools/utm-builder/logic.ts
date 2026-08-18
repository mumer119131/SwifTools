export interface Params {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  id: string;
}

export interface Issue {
  level: "error" | "warning";
  field: keyof Params | "url";
  message: string;
}

/** The five original Urchin parameters, plus the newer campaign id. */
export const FIELDS: {
  key: keyof Params;
  param: string;
  label: string;
  required: boolean;
  hint: string;
  example: string;
}[] = [
  { key: "source", param: "utm_source", label: "Source", required: true, hint: "Where the traffic comes from — the referrer, not the format.", example: "newsletter" },
  { key: "medium", param: "utm_medium", label: "Medium", required: true, hint: "The channel type. Keep these few and consistent, or reports fragment.", example: "email" },
  { key: "campaign", param: "utm_campaign", label: "Campaign", required: true, hint: "The specific push this link belongs to.", example: "spring-launch" },
  { key: "term", param: "utm_term", label: "Term", required: false, hint: "Paid keyword. Usually set automatically by the ad platform.", example: "free pdf tools" },
  { key: "content", param: "utm_content", label: "Content", required: false, hint: "Which link, when several point at the same place. This is how you A/B test.", example: "header-cta" },
  { key: "id", param: "utm_id", label: "Campaign ID", required: false, hint: "Ties the link to a campaign in your ad platform.", example: "spring-2026" },
];

/** Media that people routinely mislabel; the value people should use instead. */
export const MEDIUM_PRESETS = [
  { label: "Email", source: "newsletter", medium: "email" },
  { label: "Paid search", source: "google", medium: "cpc" },
  { label: "Paid social", source: "facebook", medium: "paid_social" },
  { label: "Organic social", source: "instagram", medium: "social" },
  { label: "Affiliate", source: "partner", medium: "affiliate" },
  { label: "QR code", source: "poster", medium: "offline" },
];

/**
 * Builds the tagged URL.
 *
 * Existing query parameters on the base URL are preserved, and existing utm_
 * parameters are replaced rather than duplicated — pasting an already-tagged
 * link back in is the most common way people end up with two utm_source values
 * and analytics that silently picks one.
 */
export function build(params: Params): string {
  const raw = params.url.trim();
  if (!raw) return "";

  let url: URL;
  try {
    url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return "";
  }

  for (const field of FIELDS) {
    const value = params[field.key].trim();
    url.searchParams.delete(field.param);
    if (value) url.searchParams.set(field.param, value);
  }

  return url.toString();
}

/**
 * Checks the values against the conventions that actually cause trouble.
 *
 * The big one is case. Google Analytics treats utm_source=Newsletter and
 * utm_source=newsletter as two different sources, so a single stray capital
 * splits a campaign across two rows in every report — and nothing warns you.
 */
export function validate(params: Params): Issue[] {
  const issues: Issue[] = [];
  const raw = params.url.trim();

  if (!raw) {
    issues.push({ level: "error", field: "url", message: "Enter the URL you are linking to." });
  } else {
    try {
      const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        issues.push({ level: "error", field: "url", message: "Only http and https links can be tagged." });
      }
      if (url.hash) {
        issues.push({
          level: "warning",
          field: "url",
          message: "The fragment after # is never sent to the server, so anything analytics needs must be in the query string, not after the hash.",
        });
      }
    } catch {
      issues.push({ level: "error", field: "url", message: "That is not a URL this can parse." });
    }
  }

  for (const field of FIELDS) {
    const value = params[field.key].trim();

    if (field.required && !value) {
      issues.push({ level: "error", field: field.key, message: `${field.label} is required — without it the visit is reported as direct traffic.` });
      continue;
    }
    if (!value) continue;

    if (value !== value.toLowerCase()) {
      issues.push({
        level: "warning",
        field: field.key,
        message: `Analytics treats "${value}" and "${value.toLowerCase()}" as different values, so a stray capital splits this campaign across two rows. Lowercase is the convention.`,
      });
    }
    if (/\s/.test(value)) {
      issues.push({
        level: "warning",
        field: field.key,
        message: "Spaces become %20 in the URL and read badly in reports. Use a hyphen or underscore.",
      });
    }
  }

  const medium = params.medium.trim().toLowerCase();
  if (medium === "ppc" || medium === "paid" || medium === "adwords") {
    issues.push({
      level: "warning",
      field: "medium",
      message: `Google Analytics only recognises "cpc" as paid search — "${medium}" will be bucketed separately and will not appear in paid reports.`,
    });
  }
  if (medium === "email" && params.source.trim().toLowerCase() === "email") {
    issues.push({
      level: "warning",
      field: "source",
      message: "Source and medium are both \"email\", which tells you nothing beyond the channel. Source should name the sender — newsletter, product-update, onboarding.",
    });
  }

  return issues;
}
