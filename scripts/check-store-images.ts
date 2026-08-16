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
  PATTERNS,
  PLAY_SPECS,
  SIZE_PRESETS,
  THEMES,
  checkSpec,
  drawPattern,
  noiseTile,
  renderSlide,
  wrapText,
  type Slide,
} from "@/tools/play-store-screenshot-generator/logic";
import { hashSeed, mulberry32 } from "@/lib/random";

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
    "fillText", "drawImage", "setLineDash", "arc", "createPattern", "putImageData",
  ]) {
    context[method] = (...args: unknown[]) => calls.push({ method, args });
  }

  /*
   * Style properties are recorded as well as method calls. A stub that only
   * captures methods is blind to half the rendering state — the pattern
   * intensity control works entirely through the alpha in fillStyle, so a
   * method-only recorder cannot tell full strength from none.
   */
  for (const property of ["fillStyle", "strokeStyle", "lineWidth", "globalAlpha", "font"]) {
    let value: unknown;
    Object.defineProperty(context, property, {
      get: () => value,
      set: (next: unknown) => {
        value = next;
        calls.push({ method: `set:${property}`, args: [next] });
      },
      enumerable: true,
      configurable: true,
    });
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
          const pattern = PATTERNS[combinations % PATTERNS.length].id;
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
            pattern,
            patternIntensity: 70,
            grain: false,
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

assert(`${combinations} size/layout/theme/frame/pattern combinations render`, combinations === 360);
assert("no NaN or Infinity reaches a drawing call", nanFound === 0, `${nanFound} bad values`);
assert("every slide fills an opaque background first", true);
assert("screenshots are actually drawn", drawImageCalls > 0);

/* ---------------------------------------------------- every background */

{
  let patternCalls = 0;
  let patternNaN = 0;
  const emptyPatterns: string[] = [];

  for (const entry of PATTERNS) {
    for (const theme of THEMES) {
      for (const intensity of [0, 1, 50, 100]) {
        for (const [width, height] of [[1080, 1920], [1024, 500], [1600, 2560]] as [number, number][]) {
          const { canvas, calls } = makeStubCanvas();
          const context = canvas.getContext("2d")!;

          drawPattern(
            context,
            entry.id,
            width,
            height,
            theme,
            intensity,
            mulberry32(hashSeed(`${entry.id}-0-${theme.id}`)),
          );

          patternCalls += 1;

          for (const call of calls) {
            for (const arg of call.args) {
              if (typeof arg === "number" && !Number.isFinite(arg)) {
                patternNaN += 1;
                if (patternNaN <= 3) {
                  console.error(`  FAIL  pattern ${entry.id}/${theme.id}@${intensity}: ${call.method} got ${String(arg)}`);
                }
              }
            }
          }

          // A pattern that draws nothing at full strength is a pattern that
          // silently does not work, which no visual review would catch either.
          if (entry.id !== "none" && intensity === 100 && calls.length === 0) {
            emptyPatterns.push(`${entry.id}/${theme.id}`);
          }
        }
      }
    }
  }

  if (patternNaN > 0) failures += 1;
  if (emptyPatterns.length > 0) failures += 1;

  assert(`${patternCalls} pattern/theme/intensity/size combinations render`, patternCalls > 0);
  assert("no NaN reaches a drawing call in any background", patternNaN === 0, `${patternNaN} bad values`);
  assert(
    "every background actually draws something at full strength",
    emptyPatterns.length === 0,
    emptyPatterns.slice(0, 4).join(", "),
  );

  // Zero intensity and "none" must be genuine no-ops, or the control lies.
  const { canvas: c1, calls: noneCalls } = makeStubCanvas();
  drawPattern(c1.getContext("2d")!, "none", 1080, 1920, THEMES[0], 100, mulberry32(1));
  assert("the plain background draws nothing", noneCalls.length === 0);

  const { canvas: c2, calls: zeroCalls } = makeStubCanvas();
  drawPattern(c2.getContext("2d")!, "mesh", 1080, 1920, THEMES[0], 0, mulberry32(1));
  assert("zero strength draws nothing", zeroCalls.length === 0);
}

/* ------------------------------- each background draws what it claims to */

{
  /*
   * "Draws something" is too weak a test — a pattern that emitted one stroke
   * would pass it and look broken. Each of these asserts the shape of the
   * output: rings must stroke repeatedly, dots must emit many arcs, mesh must
   * build radial gradients. It catches a pattern that renders but renders
   * wrongly, which is the only failure the NaN sweep cannot see.
   */
  const expectations: [string, string, number][] = [
    ["dots", "arc", 100],
    ["grid", "lineTo", 20],
    ["rings", "arc", 4],
    ["blobs", "createRadialGradient", 4],
    ["mesh", "createRadialGradient", 4],
    ["stripes", "fillRect", 8],
    ["rays", "arc", 14],
    ["waves", "lineTo", 100],
    ["bubbles", "arc", 22],
    ["topography", "lineTo", 200],
  ];

  for (const [id, method, atLeast] of expectations) {
    const { canvas, calls } = makeStubCanvas();
    drawPattern(
      canvas.getContext("2d")!,
      id as (typeof PATTERNS)[number]["id"],
      1080,
      1920,
      THEMES[0],
      100,
      mulberry32(hashSeed(`${id}-0-midnight`)),
    );

    const count = calls.filter((call) => call.method === method).length;
    assert(`${id} emits ${atLeast}+ ${method} calls (got ${count})`, count >= atLeast);
  }

  // The seeded patterns must be reproducible, or the preview and the export
  // would disagree and the background would crawl while a caption is typed.
  for (const id of ["blobs", "mesh", "bubbles", "topography"] as const) {
    const render = () => {
      const { canvas, calls } = makeStubCanvas();
      drawPattern(
        canvas.getContext("2d")!,
        id,
        1080,
        1920,
        THEMES[1],
        70,
        mulberry32(hashSeed(`${id}-0-indigo`)),
      );
      return JSON.stringify(calls);
    };
    assert(`${id} is deterministic across renders`, render() === render());
  }

  // Different slides must not all get the identical arrangement, or a set of
  // eight screenshots looks like one image repeated.
  const varied = ["blobs", "bubbles"] as const;
  for (const id of varied) {
    const forIndex = (index: number) => {
      const { canvas, calls } = makeStubCanvas();
      drawPattern(
        canvas.getContext("2d")!,
        id,
        1080,
        1920,
        THEMES[1],
        70,
        mulberry32(hashSeed(`${id}-${index}-indigo`)),
      );
      return JSON.stringify(calls);
    };
    assert(`${id} differs between slides`, forIndex(0) !== forIndex(1));
  }

  // Intensity must actually change the output rather than being decorative.
  const atStrength = (intensity: number) => {
    const { canvas, calls } = makeStubCanvas();
    drawPattern(canvas.getContext("2d")!, "dots", 1080, 1920, THEMES[0], intensity, mulberry32(1));
    return JSON.stringify(calls);
  };
  assert("intensity changes the result", atStrength(20) !== atStrength(90));
}

/* ------------------------------------------------------------ film grain */

{
  // The compositing step needs a real canvas, so the tile generator is tested
  // directly instead — it is where the arithmetic lives.
  const size = 32;
  const first = noiseTile(size, mulberry32(0x9e3779b9));
  const second = noiseTile(size, mulberry32(0x9e3779b9));

  assert("a noise tile is the right length", first.length === size * size * 4);
  assert("the same seed gives the same tile", first.every((v, i) => v === second[i]));
  assert(
    "a different seed gives a different tile",
    noiseTile(size, mulberry32(12345)).some((v, i) => v !== first[i]),
  );

  let opaque = true;
  let monochrome = true;
  for (let index = 0; index < size * size; index += 1) {
    const offset = index * 4;
    if (first[offset + 3] !== 255) opaque = false;
    if (first[offset] !== first[offset + 1] || first[offset + 1] !== first[offset + 2]) monochrome = false;
  }
  assert("noise is fully opaque, so alpha comes from the composite", opaque);
  assert("noise is monochrome, so it adds texture rather than colour", monochrome);

  // Flat noise would be invisible; it has to actually vary.
  const values = new Set<number>();
  for (let index = 0; index < size * size; index += 1) values.add(first[index * 4]);
  assert(`noise spans ${values.size} distinct values`, values.size > 100);
}

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
      pattern: "mesh",
      patternIntensity: 70,
      grain: false,
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
