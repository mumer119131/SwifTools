#!/usr/bin/env node
/**
 * Checks the pure logic behind the image batch — the crop rectangle, the
 * Base64 size verdict and the rotate transform helpers.
 *
 * The crop maths is the part worth testing. Getting it wrong does not throw; it
 * silently returns a picture with someone's head cut off, which only a human
 * looking at the output would notice.
 *
 *   pnpm check:image-batch
 */

import process from "node:process";

import { coverRect, presets, retained, type Preset } from "@/tools/social-media-resizer/logic";
import { describe, isIdentity } from "@/tools/rotate-image/logic";
import { overhead, snippet, verdict, type Encoded } from "@/tools/image-to-base64/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tolerance = 0.001) => Math.abs(a - b) < tolerance;

/* ------------------------------------------------------- the crop rectangle */

// Landscape 2000×1000 into a 1080×1920 story: the height is the binding axis,
// so the full height is kept and the width is cut to 1000 × (1080/1920).
{
  const rect = coverRect(2000, 1000, 1080, 1920, "center");
  assert("landscape → story keeps full height", near(rect.height, 1000));
  assert(`landscape → story narrows to 562.5 (got ${rect.width})`, near(rect.width, 562.5));
  assert("centre crop is horizontally centred", near(rect.x, (2000 - 562.5) / 2));
  assert("centre crop has no vertical offset", near(rect.y, 0));
}

// Portrait 1000×2000 into a 1600×900 landscape post: now width binds.
{
  const rect = coverRect(1000, 2000, 1600, 900, "center");
  assert("portrait → landscape keeps full width", near(rect.width, 1000));
  assert(`portrait → landscape shortens to 562.5 (got ${rect.height})`, near(rect.height, 562.5));
}

// Matching ratios must not crop at all — the commonest case and the easiest to
// break with a stray rounding step.
for (const [w, h, tw, th] of [
  [1080, 1080, 400, 400],
  [1200, 630, 1200, 630],
  [2400, 1260, 1200, 630],
] as const) {
  const rect = coverRect(w, h, tw, th, "center");
  assert(
    `${w}×${h} → ${tw}×${th} crops nothing`,
    near(rect.width, w) && near(rect.height, h) && near(rect.x, 0) && near(rect.y, 0),
  );
}

/* -------------------------------------------------------------- the anchors */

// A tall source cropped to a wide target: this is the "don't cut the head off"
// case, and the top anchor is the reason the control exists.
{
  const top = coverRect(1000, 2000, 1600, 900, "top");
  const bottom = coverRect(1000, 2000, 1600, 900, "bottom");
  const center = coverRect(1000, 2000, 1600, 900, "center");

  assert("top anchor starts at the top edge", near(top.y, 0));
  assert("bottom anchor ends at the bottom edge", near(bottom.y + bottom.height, 2000));
  assert("centre sits between the two", center.y > top.y && center.y < bottom.y);

  // A vertical anchor must not disturb horizontal placement.
  assert("a vertical anchor leaves x centred", near(top.x, center.x) && near(bottom.x, center.x));
}

{
  const left = coverRect(2000, 1000, 1080, 1920, "left");
  const right = coverRect(2000, 1000, 1080, 1920, "right");
  assert("left anchor starts at the left edge", near(left.x, 0));
  assert("right anchor ends at the right edge", near(right.x + right.width, 2000));
  assert("a horizontal anchor leaves y alone", near(left.y, 0) && near(right.y, 0));
}

/* --------------------------------------- every rect must stay inside bounds */

const sources: [number, number][] = [
  [4032, 3024], [3024, 4032], [1080, 1080], [1920, 1080], [640, 480], [5000, 1000],
];

let escaped = 0;
for (const [sw, sh] of sources) {
  for (const preset of presets) {
    for (const anchor of ["center", "top", "bottom", "left", "right"] as const) {
      const r = coverRect(sw, sh, preset.width, preset.height, anchor);
      const inside =
        r.x >= -0.001 &&
        r.y >= -0.001 &&
        r.x + r.width <= sw + 0.001 &&
        r.y + r.height <= sh + 0.001 &&
        r.width > 0 &&
        r.height > 0;

      // The crop must have the target's aspect ratio, or the output is stretched.
      const ratioMatches = near(r.width / r.height, preset.width / preset.height, 0.0001);

      if (!inside || !ratioMatches) escaped += 1;
    }
  }
}
assert(
  `every crop stays in bounds and keeps the target ratio (${sources.length * presets.length * 5} combinations)`,
  escaped === 0,
  `${escaped} bad rectangles`,
);

/* -------------------------------------------------------------- the presets */

const ids = new Set(presets.map((preset) => preset.id));
assert("preset ids are unique", ids.size === presets.length);
assert(
  "every preset has sane dimensions",
  presets.every((preset) => preset.width >= 100 && preset.height >= 100),
);

// The two placements that share the Open Graph shape should agree, since they
// are the same specification described by two platforms.
const byId = (id: string): Preset => presets.find((preset) => preset.id === id)!;
assert(
  "Facebook's shared link matches Open Graph",
  byId("fb-post").width === byId("og").width && byId("fb-post").height === byId("og").height,
);
assert("the profile picture is square", byId("avatar").width === byId("avatar").height);

/* ------------------------------------------------------------- area kept */

// A square source into a 1500×500 header keeps a third of the frame; worth
// surfacing, because it is the difference between a crop and a disaster.
assert(
  `a square source loses two thirds to an X header (kept ${(retained(1000, 1000, byId("x-header")) * 100).toFixed(0)}%)`,
  near(retained(1000, 1000, byId("x-header")), 1 / 3, 0.01),
);
assert("a matching ratio keeps everything", near(retained(1200, 630, byId("og")), 1));

/* ---------------------------------------------------------------- Base64 */

const encoded: Encoded = {
  uri: "data:image/png;base64,AAAA",
  base64: "AAAA",
  mime: "image/png",
  originalBytes: 3000,
  encodedBytes: 4022,
};

assert(
  `Base64 overhead is about a third (got ${(overhead(encoded) * 100).toFixed(1)}%)`,
  near(overhead(encoded), 0.34, 0.01),
);
assert("a zero-byte file does not divide by zero", overhead({ ...encoded, originalBytes: 0 }) === 0);

assert("2 KB is worth inlining", verdict(2 * 1024).tone === "good");
assert("20 KB is borderline", verdict(20 * 1024).tone === "warn");
assert("200 KB is not worth inlining", verdict(200 * 1024).tone === "bad");

assert("CSS output is a url()", snippet(encoded, "css", "x") === `background-image: url("${encoded.uri}");`);
assert("raw output drops the scheme", snippet(encoded, "raw", "x") === "AAAA");
assert(
  "a quote in the alt text cannot break out of the attribute",
  !snippet(encoded, "html", 'a "quoted" name').replace("&quot;", "").includes('""'),
);
// The `![` and `](` of the syntax itself always contain brackets, so only the
// alt text between them can be checked.
{
  const markdown = snippet(encoded, "markdown", "a [bracketed] name");
  const altText = markdown.slice(2, markdown.indexOf("]("));
  assert(
    `brackets are stripped from Markdown alt text (got ${JSON.stringify(altText)})`,
    altText === "a bracketed name",
  );
}

/* ---------------------------------------------------------------- rotate */

assert("no transform reads as unchanged", isIdentity({ rotation: 0, flipX: false, flipY: false }));
assert("a flip is not the identity", !isIdentity({ rotation: 0, flipX: true, flipY: false }));
assert(
  "a described transform names both parts",
  describe({ rotation: 90, flipX: true, flipY: false }) === "90° clockwise, flipped horizontally",
);
assert(
  "an untouched image is described as unchanged",
  describe({ rotation: 0, flipX: false, flipY: false }) === "unchanged",
);

console.log(
  failures === 0
    ? "\nAll image batch checks passed."
    : `\n${failures} image batch checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
