/**
 * Hash algorithms, shared by the six per-algorithm tool pages.
 *
 * These are one-way functions. There is no inverse — "decrypting" a hash is
 * mathematically impossible, and sites that claim to do it are looking the
 * digest up in a table of already-cracked common inputs. Every page here says
 * so rather than implying otherwise.
 */
export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-224" | "SHA-256" | "SHA-384" | "SHA-512";

export interface AlgorithmInfo {
  id: HashAlgorithm;
  /** URL-friendly identifier used in the tool slug. */
  slug: string;
  label: string;
  /** Digest length in bits. */
  bits: number;
  /** Honest guidance on where the algorithm still belongs. */
  security: "broken" | "weak" | "strong";
  note: string;
}

export const algorithms: Record<HashAlgorithm, AlgorithmInfo> = {
  MD5: {
    id: "MD5",
    slug: "md5",
    label: "MD5",
    bits: 128,
    security: "broken",
    note: "Collisions can be produced on a laptop in seconds. Fine as a non-security checksum for detecting accidental corruption; never use it for passwords, signatures or integrity you actually rely on.",
  },
  "SHA-1": {
    id: "SHA-1",
    slug: "sha1",
    label: "SHA-1",
    bits: 160,
    security: "broken",
    note: "Practically collided in 2017 (SHAttered). Deprecated for certificates and signatures everywhere. Still seen in legacy systems and Git object IDs.",
  },
  "SHA-224": {
    id: "SHA-224",
    slug: "sha224",
    label: "SHA-224",
    bits: 224,
    security: "strong",
    note: "A truncated SHA-256. No known practical attacks, but SHA-256 is more widely supported for the same work.",
  },
  "SHA-256": {
    id: "SHA-256",
    slug: "sha256",
    label: "SHA-256",
    bits: 256,
    security: "strong",
    note: "The sensible default. No known practical attacks, and supported everywhere.",
  },
  "SHA-384": {
    id: "SHA-384",
    slug: "sha384",
    label: "SHA-384",
    bits: 384,
    security: "strong",
    note: "A truncated SHA-512. Faster than SHA-256 on 64-bit hardware and resistant to length-extension attacks.",
  },
  "SHA-512": {
    id: "SHA-512",
    slug: "sha512",
    label: "SHA-512",
    bits: 512,
    security: "strong",
    note: "Faster than SHA-256 on 64-bit hardware. Overkill for most uses, but never the wrong answer.",
  },
};

const toHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

/**
 * SHA family via Web Crypto — the platform's own audited implementation.
 * MD5 is not offered by Web Crypto (deliberately, because it is broken), so it
 * has a small implementation below.
 */
export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  return hashBytes(bytes, algorithm);
}

export async function hashBytes(
  bytes: Uint8Array,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm === "MD5") return md5(bytes);

  if (algorithm === "SHA-224") {
    // Web Crypto has no SHA-224; it is SHA-256 with different initial values.
    return sha224(bytes);
  }

  const digest = await crypto.subtle.digest(
    algorithm,
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
  );
  return toHex(digest);
}

export async function hashFile(file: File, algorithm: HashAlgorithm): Promise<string> {
  return hashBytes(new Uint8Array(await file.arrayBuffer()), algorithm);
}

/**
 * HMAC — a keyed hash, which is what you actually want for verifying that a
 * message came from someone holding a shared secret. Plain `hash(key + message)`
 * is vulnerable to length-extension; HMAC is not.
 */
export async function hmac(
  message: string,
  secret: string,
  algorithm: Exclude<HashAlgorithm, "MD5" | "SHA-224">,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(signature);
}

/* ------------------------------------------------------------------- SHA-224 */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

/** SHA-224 is SHA-256 with a different IV, truncated to 224 bits. */
function sha224(bytes: Uint8Array): string {
  const h = new Uint32Array([
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4,
  ]);

  const bitLength = bytes.length * 8;
  const withPadding = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  withPadding.set(bytes);
  withPadding[bytes.length] = 0x80;
  new DataView(withPadding.buffer).setUint32(withPadding.length - 4, bitLength, false);

  const view = new DataView(withPadding.buffer);
  const w = new Uint32Array(64);

  for (let offset = 0; offset < withPadding.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, hh] = h;

    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  // Truncated to seven words — that is what makes it SHA-224 rather than 256.
  return [...h.slice(0, 7)].map((word) => word.toString(16).padStart(8, "0")).join("");
}

const rotr = (value: number, bits: number) => ((value >>> bits) | (value << (32 - bits))) >>> 0;

/* ----------------------------------------------------------------------- MD5 */

/** RFC 1321. Present only because Web Crypto refuses to implement a broken hash. */
function md5(bytes: Uint8Array): string {
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const T = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296),
  );

  const bitLength = bytes.length * 8;
  const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  // MD5 is little-endian, unlike the SHA family.
  view.setUint32(padded.length - 8, bitLength >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bitLength / 4294967296), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const m = new Uint32Array(16);
    for (let i = 0; i < 16; i += 1) m[i] = view.getUint32(offset + i * 4, true);

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const sum = (a + f + T[i] + m[g]) >>> 0;
      b = (b + ((sum << S[i]) | (sum >>> (32 - S[i])))) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return [a0, b0, c0, d0]
    .map((word) =>
      [0, 8, 16, 24].map((shift) => ((word >>> shift) & 0xff).toString(16).padStart(2, "0")).join(""),
    )
    .join("");
}
