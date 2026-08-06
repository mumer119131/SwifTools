/**
 * `btoa` only accepts Latin-1, so any non-ASCII character throws. Encoding to
 * UTF-8 bytes first is what makes "café" and emoji round-trip correctly —
 * this is the single most common Base64 bug in the browser.
 */
export function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  // Chunked to stay well under the argument-count limit on large inputs.
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  const encoded = btoa(binary);
  return urlSafe ? toUrlSafe(encoded) : encoded;
}

export function decodeBase64(value: string, urlSafe: boolean): string {
  const normalised = urlSafe ? fromUrlSafe(value) : value.trim();
  const binary = atob(normalised);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  // `fatal` surfaces invalid byte sequences instead of silently emitting U+FFFD.
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/** RFC 4648 §5: +/ become -_ and padding is dropped. */
function toUrlSafe(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromUrlSafe(value: string): string {
  const restored = value.trim().replace(/-/g, "+").replace(/_/g, "/");
  // Re-add the padding atob requires.
  return restored.padEnd(restored.length + ((4 - (restored.length % 4)) % 4), "=");
}

export function isProbablyBase64(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length % 4 === 1) return false;
  return /^[A-Za-z0-9+/\-_]+={0,2}$/.test(trimmed);
}

/** Reads a file as a `data:` URI, which is Base64 with a MIME prefix. */
export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.readAsDataURL(file);
  });
}
