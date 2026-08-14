/**
 * A vault encrypted with a key derived from a master password.
 *
 * The design, and its limits, stated plainly:
 *
 *   - The master password is never stored anywhere. A key is derived from it
 *     with PBKDF2-SHA256 at 600,000 iterations (the OWASP 2023 figure) every
 *     time the vault is unlocked, and lives only in memory.
 *   - Entries are encrypted with AES-GCM, which authenticates as well as
 *     encrypts, so a tampered vault fails to decrypt rather than returning
 *     plausible rubbish.
 *   - Only ciphertext, the salt and the IV are written to localStorage. Someone
 *     reading the stored data learns the number of entries and nothing else.
 *
 * What this does NOT protect against, and cannot: any script that runs on this
 * page while the vault is unlocked can read every decrypted entry. A dedicated
 * password manager runs in a browser extension or a native app precisely so
 * that a compromised web page cannot reach the vault. This one cannot make that
 * guarantee, and no amount of cryptography inside the page changes it.
 */

export interface Entry {
  id: string;
  site: string;
  username: string;
  password: string;
  notes: string;
}

interface StoredVault {
  version: 1;
  /** Base64 — random per vault, never reused. */
  salt: string;
  /** Base64 — random per save; AES-GCM must never repeat an IV under one key. */
  iv: string;
  ciphertext: string;
  iterations: number;
}

/** OWASP's 2023 recommendation for PBKDF2-HMAC-SHA256. */
export const ITERATIONS = 600_000;

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(text: string): Uint8Array {
  return Uint8Array.from(atob(text), (character) => character.charCodeAt(0));
}

async function deriveKey(
  master: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(master),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptVault(entries: Entry[], master: string): Promise<StoredVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(master, salt, ITERATIONS);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(entries)),
  );

  return {
    version: 1,
    salt: toBase64(salt.buffer as ArrayBuffer),
    iv: toBase64(iv.buffer as ArrayBuffer),
    ciphertext: toBase64(ciphertext),
    iterations: ITERATIONS,
  };
}

/**
 * Returns null on a wrong password.
 *
 * AES-GCM verifies its authentication tag before returning anything, so a wrong
 * key throws rather than producing garbage — there is no way to half-decrypt.
 */
export async function decryptVault(
  stored: StoredVault,
  master: string,
): Promise<Entry[] | null> {
  try {
    const key = await deriveKey(
      master,
      fromBase64(stored.salt),
      stored.iterations ?? ITERATIONS,
    );

    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(stored.iv) as BufferSource },
      key,
      fromBase64(stored.ciphertext) as BufferSource,
    );

    return JSON.parse(new TextDecoder().decode(plaintext)) as Entry[];
  } catch {
    return null;
  }
}

export type { StoredVault };

/** Rough strength feedback for the master password. */
export function assessMaster(password: string): { score: number; label: string; hint: string } {
  const length = password.length;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((pattern) =>
    pattern.test(password),
  ).length;

  if (length === 0) return { score: 0, label: "", hint: "" };
  if (length < 8) {
    return { score: 1, label: "Too short", hint: "Use at least 12 characters — length beats complexity." };
  }
  if (length < 12) {
    return { score: 2, label: "Weak", hint: "Twelve characters is the practical minimum for a vault key." };
  }
  if (length < 16 || classes < 3) {
    return { score: 3, label: "Reasonable", hint: "Four unrelated words is stronger than this and easier to remember." };
  }
  return { score: 4, label: "Strong", hint: "Good. Write it down somewhere physical — there is no recovery." };
}
