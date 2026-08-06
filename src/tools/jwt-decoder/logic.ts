export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  /** The `header.payload` string the signature covers. */
  signedContent: string;
}

export type JwtResult =
  | { ok: true; parts: JwtParts }
  | { ok: false; error: string };

/** JWT uses base64url: `-_` instead of `+/`, and no padding. */
function decodeSegment(segment: string): string {
  const normalised = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalised.padEnd(
    normalised.length + ((4 - (normalised.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function decodeJwt(token: string): JwtResult {
  const trimmed = token.trim().replace(/^Bearer\s+/i, "");
  if (!trimmed) return { ok: false, error: "Paste a token to decode." };

  const segments = trimmed.split(".");
  if (segments.length !== 3) {
    return {
      ok: false,
      error: `A JWT has three dot-separated segments; this has ${segments.length}. Check for a truncated copy-paste.`,
    };
  }

  try {
    const header = JSON.parse(decodeSegment(segments[0])) as Record<string, unknown>;
    const payload = JSON.parse(decodeSegment(segments[1])) as Record<string, unknown>;

    return {
      ok: true,
      parts: {
        header,
        payload,
        signature: segments[2],
        signedContent: `${segments[0]}.${segments[1]}`,
      },
    };
  } catch {
    return {
      ok: false,
      error: "The header or payload isn't valid base64url-encoded JSON.",
    };
  }
}

export interface ClaimReading {
  key: string;
  label: string;
  raw: unknown;
  /** Human-readable interpretation, for registered claims. */
  detail?: string;
  state?: "ok" | "warn" | "error";
}

const REGISTERED: Record<string, string> = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expires at",
  nbf: "Not valid before",
  iat: "Issued at",
  jti: "JWT ID",
};

/**
 * Registered time claims are Unix seconds, not milliseconds — a distinction
 * that quietly breaks a lot of hand-written verification code.
 */
export function readClaims(payload: Record<string, unknown>, now = Date.now()): ClaimReading[] {
  return Object.entries(payload).map(([key, raw]) => {
    const label = REGISTERED[key] ?? key;

    if ((key === "exp" || key === "iat" || key === "nbf") && typeof raw === "number") {
      const date = new Date(raw * 1000);
      const readable = date.toISOString().replace("T", " ").slice(0, 19) + " UTC";

      if (key === "exp") {
        const expired = date.getTime() < now;
        return {
          key,
          label,
          raw,
          detail: `${readable} — ${expired ? "expired" : `expires ${formatRelative(date.getTime() - now)}`}`,
          state: expired ? "error" : "ok",
        };
      }

      if (key === "nbf") {
        const notYet = date.getTime() > now;
        return {
          key,
          label,
          raw,
          detail: `${readable}${notYet ? " — not valid yet" : ""}`,
          state: notYet ? "warn" : "ok",
        };
      }

      return { key, label, raw, detail: `${readable} — ${formatRelative(now - date.getTime())} ago` };
    }

    return { key, label, raw };
  });
}

function formatRelative(milliseconds: number): string {
  const seconds = Math.abs(milliseconds) / 1000;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`;
  return `${Math.round(seconds / 86400)} days`;
}

export type VerifyResult =
  | { status: "idle" }
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "unsupported"; algorithm: string };

const HMAC_ALGORITHMS: Record<string, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

/**
 * Verifies an HMAC signature locally.
 *
 * Only the HS family is supported: RS/ES/PS tokens are signed with a private
 * key, so the holder of a public key can verify but this tool has no way to
 * obtain the right one. Saying so beats silently reporting "invalid".
 */
export async function verifySignature(
  parts: JwtParts,
  secret: string,
): Promise<VerifyResult> {
  if (!secret) return { status: "idle" };

  const algorithm = String(parts.header.alg ?? "");
  const hash = HMAC_ALGORITHMS[algorithm];
  if (!hash) return { status: "unsupported", algorithm: algorithm || "unknown" };

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash },
      false,
      ["verify"],
    );

    const signatureBytes = Uint8Array.from(
      atob(parts.signature.replace(/-/g, "+").replace(/_/g, "/").padEnd(
        parts.signature.length + ((4 - (parts.signature.length % 4)) % 4),
        "=",
      )),
      (character) => character.charCodeAt(0),
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(parts.signedContent),
    );

    return { status: valid ? "valid" : "invalid" };
  } catch {
    return { status: "invalid" };
  }
}
