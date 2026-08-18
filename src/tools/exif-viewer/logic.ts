/**
 * A focused EXIF reader and a lossless metadata stripper.
 *
 * Reading is done by hand rather than with a library because the interesting
 * part is small: EXIF lives in a JPEG's APP1 segment as a TIFF structure, and
 * the tags people care about are perhaps thirty of the several hundred defined.
 *
 * Stripping is done by removing whole marker segments from the byte stream
 * rather than by redrawing through a canvas. A canvas re-encode does remove
 * metadata, but it also recompresses the image — so the "privacy" operation
 * would silently cost you quality. Cutting the segments out leaves the
 * compressed image data untouched.
 */

export interface Tag {
  name: string;
  value: string;
  /** Grouped in the UI, and used to decide what counts as sensitive. */
  group: "camera" | "capture" | "location" | "software" | "other";
  sensitive: boolean;
}

export interface ExifResult {
  tags: Tag[];
  gps: { latitude: number; longitude: number } | null;
  hasMetadata: boolean;
  /** Bytes occupied by metadata segments. */
  metadataBytes: number;
}

/* The subset worth surfacing, by IFD tag number. */
const TAGS: Record<number, { name: string; group: Tag["group"]; sensitive?: boolean }> = {
  0x010f: { name: "Camera make", group: "camera" },
  0x0110: { name: "Camera model", group: "camera", sensitive: true },
  0x0112: { name: "Orientation", group: "other" },
  0x0131: { name: "Software", group: "software", sensitive: true },
  0x0132: { name: "Date modified", group: "capture", sensitive: true },
  0x013b: { name: "Artist", group: "software", sensitive: true },
  0x8298: { name: "Copyright", group: "software" },
  0x829a: { name: "Exposure time", group: "capture" },
  0x829d: { name: "Aperture", group: "capture" },
  0x8827: { name: "ISO", group: "capture" },
  0x9003: { name: "Date taken", group: "capture", sensitive: true },
  0x9004: { name: "Date digitised", group: "capture", sensitive: true },
  0x920a: { name: "Focal length", group: "capture" },
  0xa002: { name: "Width", group: "other" },
  0xa003: { name: "Height", group: "other" },
  0xa430: { name: "Camera owner", group: "camera", sensitive: true },
  0xa431: { name: "Body serial number", group: "camera", sensitive: true },
  0xa433: { name: "Lens make", group: "camera" },
  0xa434: { name: "Lens model", group: "camera" },
  0xa435: { name: "Lens serial number", group: "camera", sensitive: true },
};

const GPS_TAGS: Record<number, string> = {
  0x0001: "latitudeRef",
  0x0002: "latitude",
  0x0003: "longitudeRef",
  0x0004: "longitude",
  0x0006: "altitude",
};

/** Bytes per TIFF component type, indexed by the type code. */
const TYPE_SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

export function readExif(buffer: ArrayBuffer): ExifResult {
  const view = new DataView(buffer);
  const empty: ExifResult = { tags: [], gps: null, hasMetadata: false, metadataBytes: 0 };

  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return empty;

  let offset = 2;
  let exifStart = -1;
  let metadataBytes = 0;

  // Walk the marker segments looking for APP1 with an Exif header.
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;

    const marker = view.getUint8(offset + 1);
    // Start of scan: image data follows, so there are no more headers.
    if (marker === 0xda) break;

    const length = view.getUint16(offset + 2);
    if (length < 2) break;

    // Every APPn segment is metadata of some kind, EXIF or otherwise.
    if (marker >= 0xe0 && marker <= 0xef) {
      metadataBytes += length + 2;
      if (
        marker === 0xe1 &&
        offset + 10 <= view.byteLength &&
        view.getUint32(offset + 4) === 0x45786966
      ) {
        exifStart = offset + 10;
      }
    }

    offset += 2 + length;
  }

  if (exifStart === -1) {
    return { ...empty, hasMetadata: metadataBytes > 0, metadataBytes };
  }

  // TIFF header: byte order, then the magic 42, then the offset to IFD0.
  const byteOrder = view.getUint16(exifStart);
  const little = byteOrder === 0x4949;
  if (!little && byteOrder !== 0x4d4d) {
    return { ...empty, hasMetadata: true, metadataBytes };
  }

  const tags: Tag[] = [];
  const gpsValues: Record<string, unknown> = {};

  function readEntries(ifdOffset: number, kind: "main" | "gps"): number[] {
    const subIfds: number[] = [];
    if (ifdOffset + 2 > view.byteLength) return subIfds;

    const count = view.getUint16(exifStart + ifdOffset, little);

    for (let index = 0; index < count; index += 1) {
      const entry = exifStart + ifdOffset + 2 + index * 12;
      if (entry + 12 > view.byteLength) break;

      const tag = view.getUint16(entry, little);
      const type = view.getUint16(entry + 2, little);
      const length = view.getUint32(entry + 4, little);
      const size = (TYPE_SIZES[type] ?? 1) * length;

      // Values of four bytes or fewer are stored inline; longer ones are a
      // pointer relative to the start of the TIFF header.
      const valueAt = size > 4 ? exifStart + view.getUint32(entry + 8, little) : entry + 8;
      if (valueAt + size > view.byteLength) continue;

      // Pointers to the Exif and GPS sub-directories.
      if (tag === 0x8769 || tag === 0x8825) {
        subIfds.push(view.getUint32(entry + 8, little));
        if (tag === 0x8825) {
          readEntries(view.getUint32(entry + 8, little), "gps");
        }
        continue;
      }

      const value = readValue(view, valueAt, type, length, little);
      if (value === null) continue;

      if (kind === "gps") {
        const name = GPS_TAGS[tag];
        if (name) gpsValues[name] = value;
        continue;
      }

      const definition = TAGS[tag];
      if (!definition) continue;

      tags.push({
        name: definition.name,
        value: formatValue(tag, value),
        group: definition.group,
        sensitive: definition.sensitive ?? false,
      });
    }

    return subIfds;
  }

  const ifd0 = view.getUint32(exifStart + 4, little);
  for (const sub of readEntries(ifd0, "main")) readEntries(sub, "main");

  const gps = toCoordinates(gpsValues);
  if (gps) {
    tags.push({
      name: "GPS coordinates",
      value: `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`,
      group: "location",
      sensitive: true,
    });
  }

  return { tags, gps, hasMetadata: true, metadataBytes };
}

function readValue(
  view: DataView,
  at: number,
  type: number,
  length: number,
  little: boolean,
): string | number | number[] | null {
  try {
    switch (type) {
      case 2: {
        let text = "";
        for (let index = 0; index < length; index += 1) {
          const code = view.getUint8(at + index);
          if (code === 0) break;
          text += String.fromCharCode(code);
        }
        return text.trim() || null;
      }
      case 3:
        return view.getUint16(at, little);
      case 4:
        return view.getUint32(at, little);
      case 5:
      case 10: {
        // Rationals are a numerator and denominator pair.
        const values: number[] = [];
        for (let index = 0; index < length; index += 1) {
          const numerator = view.getUint32(at + index * 8, little);
          const denominator = view.getUint32(at + index * 8 + 4, little);
          values.push(denominator === 0 ? 0 : numerator / denominator);
        }
        return length === 1 ? values[0] : values;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function formatValue(tag: number, value: string | number | number[]): string {
  if (Array.isArray(value)) return value.map((entry) => entry.toFixed(4)).join(", ");

  if (tag === 0x829a && typeof value === "number" && value > 0 && value < 1) {
    return `1/${Math.round(1 / value)} s`;
  }
  if (tag === 0x829d && typeof value === "number") return `f/${value.toFixed(1)}`;
  if (tag === 0x920a && typeof value === "number") return `${value.toFixed(0)} mm`;
  if (tag === 0x0112 && typeof value === "number") {
    const names: Record<number, string> = {
      1: "Normal", 3: "Rotated 180°", 6: "Rotated 90° CW", 8: "Rotated 90° CCW",
    };
    return names[value] ?? String(value);
  }

  return String(value);
}

/** Degrees-minutes-seconds triplets to a signed decimal. */
function toCoordinates(
  values: Record<string, unknown>,
): { latitude: number; longitude: number } | null {
  const lat = values.latitude;
  const lon = values.longitude;
  if (!Array.isArray(lat) || !Array.isArray(lon)) return null;

  const decimal = (parts: number[]) => (parts[0] ?? 0) + (parts[1] ?? 0) / 60 + (parts[2] ?? 0) / 3600;

  const latitude = decimal(lat as number[]) * (values.latitudeRef === "S" ? -1 : 1);
  const longitude = decimal(lon as number[]) * (values.longitudeRef === "W" ? -1 : 1);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

/**
 * Removes every APPn marker segment, losslessly.
 *
 * The compressed image data is copied across untouched, so this is not a
 * re-encode — the pixels are bit-for-bit what they were. That distinction is
 * the whole point: a canvas round-trip would strip the metadata and quietly
 * cost you image quality at the same time.
 */
export function stripMetadata(buffer: ArrayBuffer): Uint8Array | null {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

  const source = new Uint8Array(buffer);
  const keep: [number, number][] = [[0, 2]];

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;

    const marker = view.getUint8(offset + 1);
    if (marker === 0xda) {
      // Everything from the scan header to the end is image data.
      keep.push([offset, view.byteLength]);
      break;
    }

    const length = view.getUint16(offset + 2);
    if (length < 2) break;

    const isApp = marker >= 0xe0 && marker <= 0xef;
    // COM is a free-text comment, also metadata.
    const isComment = marker === 0xfe;
    if (!isApp && !isComment) keep.push([offset, offset + 2 + length]);

    offset += 2 + length;
  }

  const total = keep.reduce((sum, [start, end]) => sum + (end - start), 0);
  const output = new Uint8Array(total);

  let cursor = 0;
  for (const [start, end] of keep) {
    output.set(source.subarray(start, end), cursor);
    cursor += end - start;
  }

  return output;
}

export const GROUP_LABELS: Record<Tag["group"], string> = {
  location: "Location",
  camera: "Camera",
  capture: "Capture settings",
  software: "Software and authorship",
  other: "Image",
};
