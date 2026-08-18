#!/usr/bin/env node
/**
 * Verifies the EXIF reader and the metadata stripper.
 *
 * A synthetic JPEG is built with known tag values and read back, which tests
 * the byte-level parsing properly — offsets, byte order, inline versus pointer
 * values and rational arithmetic are exactly the things that go wrong silently
 * and cannot be spotted by looking at a photo.
 *
 * The stripper matters more than the reader: it is the one that makes a
 * promise about privacy, and a bug there means someone publishes a photograph
 * still carrying their home coordinates.
 *
 *   pnpm check:exif
 */

import process from "node:process";

import { readExif, stripMetadata } from "@/tools/exif-viewer/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------- build a synthetic JPEG */

interface Entry {
  tag: number;
  type: number;
  count: number;
  /** Inline value, or bytes appended after the IFD with a pointer to them. */
  inline?: number;
  bytes?: number[];
}

/**
 * Assembles a little-endian TIFF block with one IFD0, one Exif sub-IFD and one
 * GPS IFD, then wraps it in an APP1 segment inside a minimal JPEG.
 */
function buildJpeg(): ArrayBuffer {
  const trailing: number[] = [];
  const TIFF_HEADER = 8;

  // Offsets are relative to the TIFF header, so the layout has to be planned
  // before anything is written.
  const ifd0Entries: Entry[] = [];
  const gpsEntries: Entry[] = [];

  function addString(entries: Entry[], tag: number, text: string): void {
    const bytes = [...text].map((c) => c.charCodeAt(0)).concat(0);
    entries.push({ tag, type: 2, count: bytes.length, bytes });
  }

  function addRationals(entries: Entry[], tag: number, values: [number, number][]): void {
    const bytes: number[] = [];
    for (const [numerator, denominator] of values) {
      for (const value of [numerator, denominator]) {
        bytes.push(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
      }
    }
    entries.push({ tag, type: 5, count: values.length, bytes });
  }

  addString(ifd0Entries, 0x010f, "Canon");
  addString(ifd0Entries, 0x0110, "EOS R6");
  addString(ifd0Entries, 0x0131, "PocketToolz Test");
  ifd0Entries.push({ tag: 0x0112, type: 3, count: 1, inline: 6 });

  addString(gpsEntries, 0x0001, "N");
  addRationals(gpsEntries, 0x0002, [[51, 1], [30, 1], [26, 1]]);
  addString(gpsEntries, 0x0003, "W");
  addRationals(gpsEntries, 0x0004, [[0, 1], [7, 1], [39, 1]]);

  const ifd0Size = 2 + ifd0Entries.length * 12 + 4 + 12; // + the GPS pointer entry
  const gpsIfdStart = TIFF_HEADER + ifd0Size;
  const gpsSize = 2 + gpsEntries.length * 12 + 4;
  let dataCursor = gpsIfdStart + gpsSize;

  function writeIfd(entries: Entry[], extra: { tag: number; pointer: number }[]): number[] {
    const out: number[] = [];
    const total = entries.length + extra.length;
    out.push(total & 0xff, (total >> 8) & 0xff);

    for (const entry of entries) {
      out.push(entry.tag & 0xff, (entry.tag >> 8) & 0xff);
      out.push(entry.type & 0xff, (entry.type >> 8) & 0xff);
      out.push(entry.count & 0xff, (entry.count >> 8) & 0xff, (entry.count >> 16) & 0xff, (entry.count >> 24) & 0xff);

      if (entry.bytes && entry.bytes.length > 4) {
        const pointer = dataCursor;
        out.push(pointer & 0xff, (pointer >> 8) & 0xff, (pointer >> 16) & 0xff, (pointer >> 24) & 0xff);
        trailing.push(...entry.bytes);
        dataCursor += entry.bytes.length;
      } else if (entry.bytes) {
        const padded = [...entry.bytes, 0, 0, 0, 0].slice(0, 4);
        out.push(...padded);
      } else {
        const value = entry.inline ?? 0;
        out.push(value & 0xff, (value >> 8) & 0xff, 0, 0);
      }
    }

    for (const { tag, pointer } of extra) {
      out.push(tag & 0xff, (tag >> 8) & 0xff, 4, 0, 1, 0, 0, 0);
      out.push(pointer & 0xff, (pointer >> 8) & 0xff, (pointer >> 16) & 0xff, (pointer >> 24) & 0xff);
    }

    out.push(0, 0, 0, 0); // no next IFD
    return out;
  }

  const ifd0 = writeIfd(ifd0Entries, [{ tag: 0x8825, pointer: gpsIfdStart }]);
  const gpsIfd = writeIfd(gpsEntries, []);

  const tiff = [
    0x49, 0x49, 0x2a, 0x00, // "II", 42
    TIFF_HEADER & 0xff, 0, 0, 0, // IFD0 offset
    ...ifd0,
    ...gpsIfd,
    ...trailing,
  ];

  const app1Body = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff];
  const app1Length = app1Body.length + 2;

  const jpeg = [
    0xff, 0xd8,
    0xff, 0xe1, (app1Length >> 8) & 0xff, app1Length & 0xff, ...app1Body,
    // A comment segment, which the stripper must also remove.
    0xff, 0xfe, 0x00, 0x08, 0x68, 0x69, 0x64, 0x64, 0x65, 0x6e,
    // Minimal scan header, then "image data", then EOI.
    0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
    0xaa, 0xbb, 0xcc, 0xdd,
    0xff, 0xd9,
  ];

  return new Uint8Array(jpeg).buffer;
}

/* ------------------------------------------------------------- read it back */

const jpeg = buildJpeg();
const result = readExif(jpeg);

assert("metadata is detected", result.hasMetadata);
assert("some tags were read", result.tags.length > 0, `${result.tags.length} tags`);

function tag(name: string): string | undefined {
  return result.tags.find((entry) => entry.name === name)?.value;
}

assert(`camera make is Canon (got ${tag("Camera make")})`, tag("Camera make") === "Canon");
assert(`camera model is EOS R6 (got ${tag("Camera model")})`, tag("Camera model") === "EOS R6");
assert(`software is read (got ${tag("Software")})`, tag("Software") === "PocketToolz Test");
assert(`orientation is decoded (got ${tag("Orientation")})`, tag("Orientation") === "Rotated 90° CW");

// 51°30'26"N 0°7'39"W is central London — checks the DMS arithmetic and both
// hemisphere signs in one go.
assert("GPS was parsed", result.gps !== null);
if (result.gps) {
  assert(
    `latitude ≈ 51.5072 (got ${result.gps.latitude.toFixed(4)})`,
    Math.abs(result.gps.latitude - 51.5072) < 0.001,
  );
  assert(
    `longitude ≈ -0.1275 (got ${result.gps.longitude.toFixed(4)})`,
    Math.abs(result.gps.longitude + 0.1275) < 0.001,
  );
  assert("western longitude is negative", result.gps.longitude < 0);
}

assert(
  "GPS is marked sensitive",
  result.tags.some((entry) => entry.group === "location" && entry.sensitive),
);
assert(
  "camera model is marked sensitive",
  result.tags.find((entry) => entry.name === "Camera model")?.sensitive === true,
);

/* ---------------------------------------------------------------- strip it */

const stripped = stripMetadata(jpeg);
assert("stripping returns bytes", stripped !== null);

if (stripped) {
  const after = readExif(stripped.buffer as ArrayBuffer);

  assert("no EXIF survives", after.tags.length === 0, `${after.tags.length} tags remain`);
  assert("no GPS survives", after.gps === null);
  assert("no metadata segments survive", after.metadataBytes === 0);
  assert("the file got smaller", stripped.length < jpeg.byteLength);

  // Still a valid JPEG: starts with SOI, ends with EOI.
  assert("still starts with SOI", stripped[0] === 0xff && stripped[1] === 0xd8);
  assert(
    "still ends with EOI",
    stripped[stripped.length - 2] === 0xff && stripped[stripped.length - 1] === 0xd9,
  );

  // The load-bearing claim: image data is byte-identical, not re-encoded.
  const source = new Uint8Array(jpeg);
  const scanIn = source.indexOf(0xda, 2);
  const scanOut = stripped.indexOf(0xda, 2);
  assert("a scan segment survives", scanIn > 0 && scanOut > 0);

  const tail = (bytes: Uint8Array, from: number) => [...bytes.subarray(from)].join(",");
  assert(
    "image data is byte-identical after stripping",
    tail(source, scanIn) === tail(stripped, scanOut),
  );

  // The comment segment must go too — it is metadata even though it is not EXIF.
  assert(
    "the comment segment is removed",
    ![...stripped].some((_, i) => stripped[i] === 0xff && stripped[i + 1] === 0xfe),
  );
}

/* ------------------------------------------------------------- edge cases */

assert("a non-JPEG is refused", stripMetadata(new Uint8Array([1, 2, 3, 4]).buffer) === null);
assert(
  "a JPEG with no metadata reads as clean",
  readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xda, 0x00, 0x02, 0xff, 0xd9]).buffer).hasMetadata === false,
);
assert("an empty buffer does not throw", readExif(new ArrayBuffer(0)).tags.length === 0);

console.log(
  failures === 0
    ? "\nAll EXIF checks passed — parsed, and stripped without touching image data."
    : `\n${failures} EXIF checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
