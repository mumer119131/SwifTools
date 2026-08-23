import type { HeadersResponse } from "@/app/api/headers/route";

export async function fetchHeaders(url: string): Promise<HeadersResponse> {
  const response = await fetch(`/api/headers?url=${encodeURIComponent(url)}`);
  const data = (await response.json()) as HeadersResponse & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The check failed.");
  return data;
}

export interface SecurityFinding {
  header: string;
  present: boolean;
  value: string | null;
  advice: string;
}

/**
 * Checks a response for the security headers a site is normally expected to
 * set, and explains what each one does.
 *
 * Clickjacking protection is the one case where presence alone is the wrong
 * test: `frame-ancestors` in a Content-Security-Policy supersedes
 * `X-Frame-Options` and modern browsers prefer it, so a site setting only the
 * CSP directive is correctly protected and must not be reported as missing.
 */
export function auditSecurityHeaders(headers: [string, string][]): SecurityFinding[] {
  const map = new Map(headers.map(([name, value]) => [name.toLowerCase(), value]));
  const csp = map.get("content-security-policy") ?? "";
  const framedByCsp = /frame-ancestors/i.test(csp);

  return [
    {
      header: "Strict-Transport-Security",
      present: map.has("strict-transport-security"),
      value: map.get("strict-transport-security") ?? null,
      advice:
        "Tells browsers to reach this site over HTTPS only, which closes the gap where a first visit over http could be intercepted.",
    },
    {
      header: "Content-Security-Policy",
      present: map.has("content-security-policy"),
      value: map.get("content-security-policy") ?? null,
      advice:
        "Restricts where scripts, styles and frames may load from — the main defence against cross-site scripting.",
    },
    {
      header: "X-Content-Type-Options",
      present: (map.get("x-content-type-options") ?? "").toLowerCase().trim() === "nosniff",
      value: map.get("x-content-type-options") ?? null,
      advice:
        "Set to nosniff, it stops a browser second-guessing a declared content type and running an upload as script.",
    },
    {
      header: "X-Frame-Options",
      present: map.has("x-frame-options") || framedByCsp,
      value: map.get("x-frame-options") ?? (framedByCsp ? "Covered by CSP frame-ancestors" : null),
      advice:
        "Stops the page being embedded in a frame on another site, which is what makes clickjacking possible. A CSP frame-ancestors directive does the same job and takes precedence.",
    },
    {
      header: "Referrer-Policy",
      present: map.has("referrer-policy"),
      value: map.get("referrer-policy") ?? null,
      advice:
        "Controls how much of the current URL is passed on when a visitor follows a link away from the page.",
    },
    {
      header: "Permissions-Policy",
      present: map.has("permissions-policy"),
      value: map.get("permissions-policy") ?? null,
      advice:
        "Declares which browser features — camera, microphone, geolocation — the page and anything it embeds may use.",
    },
  ];
}
