/**
 * Image format data and the direct conversion pages built from it.
 *
 * The same play as the unit pair pages: someone searching "png to webp" wants
 * that specific answer, and a general-purpose converter can never rank for it
 * because the page says nothing about either format. A page per pair can —
 * provided it carries real content rather than just a file input, which is why
 * each one explains what the two formats actually differ on.
 */

export interface ImageFormat {
  id: string;
  /** URL segment: "png". */
  url: string;
  /** "PNG" */
  label: string;
  /** "Portable Network Graphics" */
  fullName: string;
  /** MIME type, or null where browsers can decode but not encode it. */
  mime: string | null;
  lossy: boolean;
  transparency: boolean;
  animation: boolean;
  /** What it is genuinely good at. */
  strength: string;
  /** Where it falls down. */
  weakness: string;
  aliases: string[];
}

export const FORMATS: ImageFormat[] = [
  {
    id: "png",
    url: "png",
    label: "PNG",
    fullName: "Portable Network Graphics",
    mime: "image/png",
    lossy: false,
    transparency: true,
    animation: false,
    strength: "Lossless, with full alpha transparency. Perfect for screenshots, logos, diagrams and anything with hard edges or flat colour.",
    weakness: "Large for photographs — it stores every pixel exactly, and a photograph has no repeating detail to compress.",
    aliases: ["png"],
  },
  {
    id: "jpeg",
    url: "jpg",
    label: "JPG",
    fullName: "JPEG",
    mime: "image/jpeg",
    lossy: true,
    transparency: false,
    animation: false,
    strength: "Built for photographs. Its compression discards detail the eye is least sensitive to, so a photo can drop by 90% with no visible change.",
    weakness: "No transparency at all, and it puts visible halos around hard edges — which makes it the wrong choice for text, logos and screenshots.",
    aliases: ["jpg", "jpeg"],
  },
  {
    id: "webp",
    url: "webp",
    label: "WebP",
    fullName: "WebP",
    mime: "image/webp",
    lossy: true,
    transparency: true,
    animation: true,
    strength: "Does both jobs: lossy like JPG but 25–35% smaller at matching quality, and lossless with transparency like PNG. Supported by every current browser.",
    weakness: "Older desktop software and some email clients still cannot open it, so it is a web format rather than a delivery format.",
    aliases: ["webp"],
  },
  {
    id: "gif",
    url: "gif",
    label: "GIF",
    fullName: "Graphics Interchange Format",
    mime: null,
    lossy: false,
    transparency: true,
    animation: true,
    strength: "Universally supported animation, and transparency that works everywhere including decades-old software.",
    weakness: "Capped at 256 colours, so photographs band badly, and the files are far larger than an equivalent video or animated WebP.",
    aliases: ["gif"],
  },
  {
    id: "bmp",
    url: "bmp",
    label: "BMP",
    fullName: "Bitmap",
    mime: null,
    lossy: false,
    transparency: false,
    animation: false,
    strength: "Utterly simple and uncompressed, which makes it readable by anything, including very old and very small systems.",
    weakness: "Enormous. A photo that is 2 MB as a JPG can be 30 MB as a BMP, for no visible gain.",
    aliases: ["bmp"],
  },
  {
    id: "avif",
    url: "avif",
    label: "AVIF",
    fullName: "AV1 Image File Format",
    mime: "image/avif",
    lossy: true,
    transparency: true,
    animation: true,
    strength: "The smallest of the modern formats — often half the size of JPG at the same quality, with transparency and wide colour support.",
    weakness: "Slow to encode, and support outside browsers is still patchy. Encoding depends on your browser having an AVIF encoder.",
    aliases: ["avif"],
  },
  {
    id: "heic",
    url: "heic",
    label: "HEIC",
    fullName: "High Efficiency Image Container",
    mime: null,
    lossy: true,
    transparency: false,
    animation: false,
    strength: "What an iPhone shoots by default. Roughly half the size of a JPG at the same quality.",
    weakness: "Decoding requires Apple hardware or a licensed decoder, so most browsers cannot open it at all — which is exactly why people need to convert it.",
    aliases: ["heic", "heif"],
  },
  {
    id: "svg",
    url: "svg",
    label: "SVG",
    fullName: "Scalable Vector Graphics",
    mime: null,
    lossy: false,
    transparency: true,
    animation: true,
    strength: "Vector rather than pixels, so it is sharp at any size and usually tiny. The right format for logos, icons and diagrams.",
    weakness: "Cannot represent a photograph, and converting one to a raster format fixes its resolution permanently.",
    aliases: ["svg"],
  },
];

export function getFormat(id: string): ImageFormat | undefined {
  return FORMATS.find((format) => format.id === id || format.url === id);
}

export interface FormatPair {
  slug: string;
  from: ImageFormat;
  to: ImageFormat;
  /** "PNG to WebP" */
  title: string;
  keywords: string[];
  /** True when the browser cannot encode the target format. */
  unsupportedTarget: boolean;
  /** True when the browser may not be able to decode the source. */
  riskySource: boolean;
}

/**
 * The conversions people actually search for.
 *
 * Deliberately not every permutation. Eight formats both ways would be 56
 * pages competing with each other for the same handful of queries; these are
 * the ones with real demand, expanded in both directions only where both
 * directions are things people genuinely do.
 */
const POPULAR: [string, string][] = [
  ["png", "jpeg"],
  ["jpeg", "png"],
  ["png", "webp"],
  ["webp", "png"],
  ["jpeg", "webp"],
  ["webp", "jpeg"],
  ["heic", "jpeg"],
  ["heic", "png"],
  ["gif", "png"],
  ["gif", "jpeg"],
  ["bmp", "png"],
  ["bmp", "jpeg"],
  ["svg", "png"],
  ["svg", "jpeg"],
  ["avif", "png"],
  ["avif", "jpeg"],
];

/*
 * Targets are limited to PNG, JPG and WebP on purpose — they are the only
 * three every browser can actually encode from a canvas.
 *
 * GIF has no canvas encoder at all, and AVIF encoding is unsupported in most
 * browsers. Both matter more than they sound, because `canvas.toBlob` does not
 * fail on an unsupported type: it silently produces a PNG. A "PNG to AVIF"
 * page would have handed people a PNG named .avif, which is worse than not
 * offering the conversion.
 *
 * Both remain useful as *sources*, which is where the demand actually is —
 * people convert away from HEIC and GIF far more often than towards them.
 */

/** Every phrasing of "X to Y" worth indexing, aliases included. */
function pairKeywords(from: ImageFormat, to: ImageFormat): string[] {
  const plain: string[] = [];
  for (const a of from.aliases) {
    for (const b of to.aliases) {
      plain.push(`${a} to ${b}`);
    }
  }

  return [
    ...new Set([
      ...plain,
      `convert ${from.aliases[0]} to ${to.aliases[0]}`,
      `${from.aliases[0]} to ${to.aliases[0]} converter`,
      `${from.label.toLowerCase()} to ${to.label.toLowerCase()} online`,
      "image converter",
    ]),
  ];
}

export const formatPairs: readonly FormatPair[] = (() => {
  const pairs: FormatPair[] = [];

  for (const [fromId, toId] of POPULAR) {
    const from = getFormat(fromId);
    const to = getFormat(toId);
    // A format with no entry is skipped rather than producing a broken route.
    if (!from || !to || from.id === to.id) continue;

    pairs.push({
      slug: `${from.url}-to-${to.url}`,
      from,
      to,
      title: `${from.label} to ${to.label}`,
      keywords: pairKeywords(from, to),
      // Canvas can only encode what the browser has an encoder for.
      unsupportedTarget: to.mime === null,
      // HEIC and SVG both need the browser to decode something unusual.
      riskySource: from.id === "heic" || from.id === "svg",
    });
  }

  return pairs;
})();

export function getFormatPair(slug: string): FormatPair | undefined {
  return formatPairs.find((pair) => pair.slug === slug);
}

/** The row of differences shown on every pair page. */
export function comparison(pair: FormatPair): { label: string; from: string; to: string }[] {
  const yesNo = (value: boolean) => (value ? "Yes" : "No");

  return [
    { label: "Compression", from: pair.from.lossy ? "Lossy" : "Lossless", to: pair.to.lossy ? "Lossy" : "Lossless" },
    { label: "Transparency", from: yesNo(pair.from.transparency), to: yesNo(pair.to.transparency) },
    { label: "Animation", from: yesNo(pair.from.animation), to: yesNo(pair.to.animation) },
  ];
}

/**
 * What is actually lost in this conversion, in plain terms.
 *
 * Stated because it is the thing a converter should tell you and almost never
 * does — converting a transparent PNG to JPG silently fills the background,
 * and people only find out when they see the result.
 */
export function caveats(pair: FormatPair): string[] {
  const notes: string[] = [];

  if (pair.from.transparency && !pair.to.transparency) {
    notes.push(
      `${pair.to.label} has no transparency. Anything transparent in your ${pair.from.label} will be filled with a solid colour — white unless you choose otherwise.`,
    );
  }

  if (pair.from.animation && !pair.to.animation) {
    notes.push(
      `${pair.to.label} holds a single image. An animated ${pair.from.label} will be converted to its first frame only.`,
    );
  }

  if (!pair.from.lossy && pair.to.lossy) {
    notes.push(
      `${pair.from.label} is lossless and ${pair.to.label} is not, so this conversion discards detail permanently. Keep the original if you may need to edit it later.`,
    );
  }

  if (pair.from.lossy && !pair.to.lossy) {
    notes.push(
      `Converting to ${pair.to.label} cannot restore what ${pair.from.label} already discarded. The file will get larger without getting better — the compression artefacts are stored losslessly along with everything else.`,
    );
  }

  if (pair.from.id === "svg") {
    notes.push(
      "SVG is vector, so it is sharp at any size. Converting to pixels fixes the resolution permanently — pick a size larger than you think you need.",
    );
  }

  return notes;
}
