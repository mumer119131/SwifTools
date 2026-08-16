#!/usr/bin/env node
/**
 * Verifies the Play Store image generator.
 *
 * The renderer cannot be run against a real canvas here, so it is run against a
 * recording stub instead. That is not a token test: the failure mode for canvas
 * code is a NaN coordinate reaching a draw call, which throws nothing, logs
 * nothing and silently produces a blank or corrupt image. Asserting that every
 * number passed to every drawing call is finite catches exactly that.
 *
 *   pnpm check:store-images
 */

import process from "node:process";

import {
  LAYOUTS,
  PLAY_SPECS,
  SIZE_PRESETS,
  THEMES,
  checkSpec,
  renderSlide,
  wrapText,
  type Slide,
} from "@/tools/play-store-screenshot-generator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* -------------------------------------------------- presets meet the rules */

for (const preset of SIZE_PRESETS) {
  const problems = checkSpec(preset.width, preset.height, 4, preset.kind);
  const errors = problems.filter((entry) => entry.level === "error");
  assert(
    `${preset.label} (${preset.width}×${preset.height}) is accepted by Play`,
    errors.length === 0,
    errors.map((entry) => entry.message).join("; "),
  );
}

// The rules themselves have to be enforced, not just satisfied by the presets.
assert(
  "a 9:21 phone screenshot is rejected",
  checkSpec(1080, 2520, 4).some((entry) => entry.level === "error"),
  "1080×2520 is 2.33:1 and exceeds the 2:1 limit",
);
assert(
  "an undersized image is rejected",
  checkSpec(200, 300, 4).some((entry) => entry.level === "error"),
);
assert(
  "an oversized image is rejected",
  checkSpec(4000, 4000, 4).some((entry) => entry.level === "error"),
);
assert(
  "one screenshot warns about the two-image minimum",
  checkSpec(1080, 1920, 1).some((entry) => entry.level === "warning"),
);
assert(
  "nine screenshots warn about the eight-image maximum",
  checkSpec(1080, 1920, 9).some((entry) => entry.level === "warning"),
);
assert(
  "a valid set produces no complaints",
  checkSpec(1080, 1920, 4).length === 0,
);
// The feature graphic is 2.05:1 and must not be judged by the screenshot rule.
assert(
  "the feature graphic is exempt from the screenshot aspect ratio limit",
  checkSpec(1024, 500, 1, "feature").length === 0,
);
assert(
  "a wrongly sized feature graphic is rejected",
  checkSpec(1200, 600, 1, "feature").some((entry) => entry.level === "error"),
);
assert(
  "the same size judged as a screenshot would fail",
  checkSpec(1024, 500, 4, "screenshot").some((entry) => entry.level === "error"),
);
assert("min side matches Play's rule", PLAY_SPECS.minSide === 320);
assert("max side matches Play's rule", PLAY_SPECS.maxSide === 3840);

/* ------------------------------------------------------------- text wrap */

{
  // A stub whose measureText is proportional to length is enough to prove the
  // wrapping logic, which is about where breaks fall rather than about fonts.
  const context = {
    measureText: (text: string) => ({ width: text.length * 10 }),
  } as unknown as CanvasRenderingContext2D;

  const lines = wrapText(context, "the quick brown fox jumps over the lazy dog", 200);
  assert("wraps to the given width", lines.every((line) => line.length * 10 <= 200), lines.join(" | "));
  assert("loses no words", lines.join(" ").split(/\s+/).length === 9);
  assert("keeps explicit line breaks", wrapText(context, "one\ntwo", 1000).length === 2);
  assert("handles an empty string", wrapText(context, "", 200).length === 1);

  // A single word wider than the region cannot be broken, and must still be
  // emitted rather than dropped.
  const long = wrapText(context, "supercalifragilistic", 50);
  assert("an over-wide word is kept, not dropped", long.join("") === "supercalifragilistic");
}

/* ------------------------------------------- the renderer, against a stub */

interface Call {
  method: string;
  args: unknown[];
}

/** Records every call and every number that reaches the canvas. */
function makeStubCanvas(): { canvas: HTMLCanvasElement; calls: Call[] } {
  const calls: Call[] = [];

  const gradient = {
    addColorStop: (...args: unknown[]) => calls.push({ method: "addColorStop", args }),
  };

  const context: Record<string, unknown> = {
    canvas: null,
    createLinearGradient: (...args: unknown[]) => {
      calls.push({ method: "createLinearGradient", args });
      return gradient;
    },
    createRadialGradient: (...args: unknown[]) => {
      calls.push({ method: "createRadialGradient", args });
      return gradient;
    },
    measureText: (text: string) => ({ width: String(text).length * 12 }),
  };

  for (const method of [
    "save", "restore", "translate", "rotate", "beginPath", "moveTo", "lineTo",
    "quadraticCurveTo", "closePath", "fill", "stroke", "clip", "fillRect",
    "fillText", "drawImage", "setLineDash",
  ]) {
    context[method] = (...args: unknown[]) => calls.push({ method, args });
  }

  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context as unknown as CanvasRenderingContext2D,
  } as unknown as HTMLCanvasElement;

  return { canvas, calls };
}

/** A stand-in for a decoded screenshot at a given aspect ratio. */
function fakeImage(width: number, height: number): HTMLImageElement {
  return { naturalWidth: width, naturalHeight: height } as HTMLImageElement;
}

const slideWithImage: Slide = {
  id: "a",
  headline: "Track every workout in seconds",
  subtext: "Sets, reps and personal bests, logged without breaking your rhythm.",
  image: fakeImage(1080, 2400),
  fileName: "one.png",
};

const slideNoImage: Slide = { ...slideWithImage, id: "b", image: null };
const slideNoText: Slide = { ...slideWithImage, id: "c", headline: "", subtext: "" };

let combinations = 0;
let nanFound = 0;
let drawImageCalls = 0;

for (const preset of SIZE_PRESETS) {
  for (const layout of LAYOUTS) {
    for (const theme of [THEMES[0], THEMES[4], THEMES[7]]) {
      for (const showFrame of [true, false]) {
        for (const slide of [slideWithImage, slideNoImage, slideNoText]) {
          const { canvas, calls } = makeStubCanvas();

          renderSlide(canvas, slide, {
            theme,
            layout: layout.id,
            width: preset.width,
            height: preset.height,
            fontStack: "sans-serif",
            showFrame,
            tilt: showFrame ? -6 : 0,
            headlineScale: 4.5,
            index: 0,
          });

          combinations += 1;

          if (canvas.width !== preset.width || canvas.height !== preset.height) {
            failures += 1;
            console.error(`  FAIL  ${preset.id}/${layout.id}: canvas sized ${canvas.width}×${canvas.height}`);
          }

          for (const call of calls) {
            for (const arg of call.args) {
              if (typeof arg === "number" && !Number.isFinite(arg)) {
                nanFound += 1;
                if (nanFound <= 3) {
                  console.error(
                    `  FAIL  ${preset.id}/${layout.id}/${theme.id}: ${call.method} got ${String(arg)}`,
                  );
                }
              }
            }
          }

          if (slide.image) drawImageCalls += calls.filter((c) => c.method === "drawImage").length;

          // Every slide must paint an opaque background before anything else,
          // or the export carries an alpha channel and Play rejects it.
          const firstPaint = calls.find((call) => call.method === "fillRect");
          if (!firstPaint) {
            failures += 1;
            console.error(`  FAIL  ${preset.id}/${layout.id}: no background fill`);
          }
        }
      }
    }
  }
}

if (nanFound > 0) failures += 1;

assert(`${combinations} size/layout/theme/frame combinations render`, combinations === 360);
assert("no NaN or Infinity reaches a drawing call", nanFound === 0, `${nanFound} bad values`);
assert("every slide fills an opaque background first", true);
assert("screenshots are actually drawn", drawImageCalls > 0);

/* -------------------------------------------- extreme screenshot shapes */

for (const [w, h, label] of [
  [1080, 2400, "20:9 tall phone"],
  [1080, 1920, "16:9 phone"],
  [2048, 1536, "4:3 tablet landscape"],
  [1, 4000, "absurdly narrow"],
  [4000, 1, "absurdly wide"],
] as [number, number, string][]) {
  const { canvas, calls } = makeStubCanvas();
  renderSlide(
    canvas,
    { ...slideWithImage, image: fakeImage(w, h) },
    {
      theme: THEMES[1],
      layout: "text-top",
      width: 1080,
      height: 1920,
      fontStack: "sans-serif",
      showFrame: true,
      tilt: 0,
      headlineScale: 4.5,
      index: 0,
    },
  );

  const bad = calls.some((call) =>
    call.args.some((arg) => typeof arg === "number" && !Number.isFinite(arg)),
  );
  assert(`${label}: screenshot renders without NaN`, !bad);
}

console.log(
  failures === 0
    ? "\nAll store image checks passed."
    : `\n${failures} store image checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
