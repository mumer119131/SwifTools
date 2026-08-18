/** The snippet flavours worth offering. A data URI goes in more than one place. */
export type Flavour = "uri" | "css" | "html" | "markdown" | "raw";

export const flavourLabels: Record<Flavour, string> = {
  uri: "Data URI",
  css: "CSS background",
  html: "HTML <img>",
  markdown: "Markdown",
  raw: "Base64 only",
};

export interface Encoded {
  /** The full `data:` URI. */
  uri: string;
  /** Base64 payload without the scheme prefix. */
  base64: string;
  mime: string;
  originalBytes: number;
  encodedBytes: number;
}

/**
 * Reads a file into a data URI.
 *
 * `FileReader` is used rather than reading the bytes and encoding by hand: it
 * produces exactly the same result, and doing it manually means building a
 * megabyte-long string one character at a time, which is slow enough to lock
 * the tab on a large photo.
 */
export function encodeFile(file: File): Promise<Encoded> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.onload = () => {
      const uri = String(reader.result);
      const comma = uri.indexOf(",");
      if (!uri.startsWith("data:") || comma === -1) {
        reject(new Error("That file could not be encoded."));
        return;
      }

      resolve({
        uri,
        base64: uri.slice(comma + 1),
        mime: file.type || "application/octet-stream",
        originalBytes: file.size,
        // The string's length in characters is its length in bytes here: Base64
        // only ever emits ASCII.
        encodedBytes: uri.length,
      });
    };

    reader.readAsDataURL(file);
  });
}

/** Wraps the URI in whatever the destination expects. */
export function snippet(encoded: Encoded, flavour: Flavour, alt: string): string {
  switch (flavour) {
    case "css":
      return `background-image: url("${encoded.uri}");`;
    case "html":
      return `<img src="${encoded.uri}" alt="${alt.replace(/"/g, "&quot;")}">`;
    case "markdown":
      return `![${alt.replace(/[[\]]/g, "")}](${encoded.uri})`;
    case "raw":
      return encoded.base64;
    default:
      return encoded.uri;
  }
}

/** Base64 packs 3 bytes into 4 characters, so the growth is about a third. */
export function overhead(encoded: Encoded): number {
  if (encoded.originalBytes === 0) return 0;
  return (encoded.encodedBytes - encoded.originalBytes) / encoded.originalBytes;
}

/**
 * Whether inlining is a reasonable idea at this size.
 *
 * The number is a judgement, not a standard. Below a couple of kilobytes an
 * inlined icon genuinely saves a request; past a few tens of kilobytes it
 * bloats every page that carries it and cannot be cached separately.
 */
export function verdict(bytes: number): { tone: "good" | "warn" | "bad"; message: string } {
  if (bytes <= 4 * 1024) {
    return {
      tone: "good",
      message: "Small enough that inlining is a genuine win — one fewer request, no extra round trip.",
    };
  }
  if (bytes <= 32 * 1024) {
    return {
      tone: "warn",
      message:
        "Workable, but it is now a meaningful share of your stylesheet or markup. Worth inlining only if the image appears on nearly every page.",
    };
  }
  return {
    tone: "bad",
    message:
      "Too big to inline sensibly. Embedded here it cannot be cached on its own, blocks the file it sits in, and costs every visitor the full size on every page load. Serve it as a file.",
  };
}
