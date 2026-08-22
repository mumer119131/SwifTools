#!/usr/bin/env node
/**
 * Checks the redaction, DPI, viewing distance, clothing size and GPA tools.
 *
 * The redaction assertions matter most. A tool that claims to obscure something
 * and merely draws over it is worse than no tool at all, so the tests read the
 * pixels back and confirm the originals are gone rather than covered.
 *
 *   pnpm check:batch7
 */

import process from "node:process";

import {
  STRENGTH, blur, block, clampRegion, pixelate, regionFromDrag, toPixels,
} from "@/tools/redact-image/logic";
import {
  assess, effectiveDpi, fromInches, pixelsNeeded, printSize, toInches,
} from "@/tools/dpi-calculator/logic";
import {
  RESOLUTIONS, dimensions, distances, resolutionVerdict, sizeForDistance,
} from "@/tools/viewing-distance-calculator/logic";
import { TABLES, convert as sizeConvert, fromMeasurement } from "@/tools/clothing-size-converter/logic";
import { calculate as gpa, pointsFor, requiredAverage, type Course } from "@/tools/gpa-calculator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) < tol;

/* =========================================================== redaction */

console.log("Redaction");

{
  // A 40x40 image of distinct pixel values, so any surviving original is
  // detectable.
  const size = 40;
  const make = () => {
    const data = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < size * size; i += 1) {
      data[i * 4] = i % 256;
      data[i * 4 + 1] = (i * 7) % 256;
      data[i * 4 + 2] = (i * 13) % 256;
      data[i * 4 + 3] = 255;
    }
    return data;
  };

  const area = { x: 10, y: 10, width: 20, height: 20 };
  const at = (data: Uint8ClampedArray, x: number, y: number) => {
    const i = (y * size + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // ---- pixelate: the values inside a block must all become the same.
  {
    const original = make();
    const data = make();
    pixelate(data, size, area, 10);

    const a = at(data, 12, 12);
    const b = at(data, 17, 17);
    assert("pixelate flattens a block to one colour", a.join() === b.join(), `${a} vs ${b}`);
    assert("and destroys the original values",
      at(data, 12, 12).join() !== at(original, 12, 12).join());
    assert("while leaving the rest untouched",
      at(data, 2, 2).join() === at(original, 2, 2).join());
    // Two different blocks should differ, or the whole region was flattened.
    assert("separate blocks stay distinct", at(data, 12, 12).join() !== at(data, 25, 25).join());
  }

  // ---- block: everything becomes the fill colour.
  {
    const data = make();
    block(data, size, area, { r: 0, g: 0, b: 0 });
    let wrong = 0;
    for (let y = area.y; y < area.y + area.height; y += 1) {
      for (let x = area.x; x < area.x + area.width; x += 1) {
        if (at(data, x, y).join() !== "0,0,0") wrong += 1;
      }
    }
    assert("a block fills the whole region", wrong === 0, `${wrong} pixels survived`);
    assert("and does not touch outside", at(data, 5, 5).join() !== "0,0,0");
    assert("alpha is made opaque", data[(15 * size + 15) * 4 + 3] === 255);
  }

  // ---- blur: values must change, and neighbours must converge.
  {
    const original = make();
    const data = make();
    blur(data, size, size, area, 3, 3);
    assert("blur changes the pixels", at(data, 20, 20).join() !== at(original, 20, 20).join());
    assert("blur leaves the outside alone", at(data, 2, 2).join() === at(original, 2, 2).join());

    // Adjacent pixels inside the region should be closer together after
    // blurring than before.
    const spread = (d: Uint8ClampedArray) =>
      Math.abs(at(d, 20, 20)[0] - at(d, 21, 20)[0]);
    assert(`blur reduces local variation (${spread(original)} -> ${spread(data)})`,
      spread(data) <= spread(original));
  }

  // ---- regions
  const dragged = regionFromDrag(0.8, 0.7, 0.2, 0.1, "r");
  assert("dragging backwards still gives a positive region",
    dragged.width > 0 && dragged.height > 0 && near(dragged.x, 0.2) && near(dragged.y, 0.1));

  const clamped = clampRegion({ id: "r", x: 0.9, y: 0.9, width: 0.5, height: 0.5 });
  assert("regions are clamped inside the image",
    clamped.x + clamped.width <= 1.0001 && clamped.y + clamped.height <= 1.0001);
  assert("a zero-size region is given a minimum",
    clampRegion({ id: "r", x: 0, y: 0, width: 0, height: 0 }).width > 0);

  const pixels = toPixels({ id: "r", x: 0.25, y: 0.5, width: 0.5, height: 0.25 }, 800, 400);
  assert("regions map to pixels", pixels.x === 200 && pixels.y === 200 && pixels.width === 400);
  const edge = toPixels({ id: "r", x: 0.9, y: 0.9, width: 0.2, height: 0.2 }, 100, 100);
  assert("and are clipped to the bitmap", edge.x + edge.width <= 100 && edge.y + edge.height <= 100);

  // The honesty requirement: blur must not be presented as safe.
  assert("blur is marked as the weakest option", STRENGTH.blur.safe === false);
  assert("a solid block is marked irreversible", STRENGTH.block.safe === true);
  assert("pixelation warns about fine blocks", STRENGTH.pixelate.note.includes("large blocks"));
}

/* ================================================================= DPI */

console.log("\nDPI and print size");

{
  assert("an inch is an inch", toInches(1, "in") === 1);
  assert("25.4mm is an inch", near(toInches(25.4, "mm"), 1, 0.0001));
  assert("2.54cm is an inch", near(toInches(2.54, "cm"), 1, 0.0001));
  assert("inches round-trip through mm", near(fromInches(toInches(100, "mm"), "mm"), 100, 0.0001));

  // 3000x2000 at 300 DPI is 10x6.67 inches.
  const size = printSize(3000, 2000, 300, "in")!;
  assert(`3000px at 300 DPI is 10 inches (${size.width.toFixed(2)})`, near(size.width, 10, 0.01));
  assert("and 6.67 tall", near(size.height, 6.667, 0.01));

  const mm = printSize(3000, 2000, 300, "mm")!;
  assert(`the same in mm is 254 (${mm.width.toFixed(1)})`, near(mm.width, 254, 0.1));

  // A4 at 300 DPI needs 2480x3508.
  const needed = pixelsNeeded(210, 297, "mm", 300)!;
  assert(`A4 at 300 DPI needs 2480px wide (${needed.width})`, needed.width === 2480);
  assert("and 3508 tall", needed.height === 3508);
  assert(`which is 8.7 megapixels (${needed.megapixels})`, near(needed.megapixels, 8.7, 0.1));

  const effective = effectiveDpi(3000, 2000, 10, 6.667, "in")!;
  assert("effective DPI comes back out at 300", effective.horizontal === 300);
  // The worse axis is what limits quality.
  const uneven = effectiveDpi(3000, 1000, 10, 10, "in")!;
  assert("the lower axis is reported as the limit", uneven.lowest === 100);

  assert("300 DPI is print quality", assess(300).tone === "good");
  assert("200 is acceptable", assess(200).tone === "acceptable");
  assert("72 is too low for print", assess(72).tone === "poor");
  assert("and says why", assess(72).detail.includes("cannot add detail"));

  assert("zero pixels are refused", printSize(0, 100, 300, "in") === null);
  assert("zero DPI is refused", printSize(100, 100, 0, "in") === null);
}

/* ==================================================== viewing distance */

console.log("\nViewing distance");

{
  // A 55-inch 16:9 screen is about 48 inches wide, which is the figure people
  // are surprised by.
  const screen = dimensions(55)!;
  assert(`a 55" 16:9 screen is 47.9" wide (${screen.widthInches.toFixed(1)})`,
    near(screen.widthInches, 47.94, 0.05));
  assert("and 27.0 tall", near(screen.heightInches, 26.96, 0.05));
  // Pythagoras must hold.
  assert("width and height give back the diagonal",
    near(Math.hypot(screen.widthInches, screen.heightInches), 55, 0.01));
  assert("centimetres are converted", near(screen.widthCm, 47.94 * 2.54, 0.2));

  // An ultrawide of the same diagonal is wider and shorter.
  const ultrawide = dimensions(55, 21, 9)!;
  assert("a 21:9 screen of the same diagonal is wider", ultrawide.widthInches > screen.widthInches);
  assert("and shorter", ultrawide.heightInches < screen.heightInches);

  const advice = distances(screen, "4k");
  assert("THX sits closer than SMPTE", advice.thxFeet < advice.smpteFeet);
  assert("metres agree with feet", near(advice.smpteMetres, advice.smpteFeet * 0.3048, 0.001));

  // 4K lets you sit closer before pixels stop resolving than 1080p does.
  const hd = distances(screen, "1080p");
  assert(`4K resolves closer than 1080p (${advice.pixelLimitFeet.toFixed(1)} vs ${hd.pixelLimitFeet.toFixed(1)} ft)`,
    advice.pixelLimitFeet < hd.pixelLimitFeet);
  assert("8K closer still", distances(screen, "8k").pixelLimitFeet < advice.pixelLimitFeet);

  assert("sitting inside the limit makes the resolution worthwhile",
    resolutionVerdict(advice.pixelLimitFeet - 1, advice).worthwhile);
  assert("sitting beyond it does not",
    !resolutionVerdict(advice.pixelLimitFeet + 5, advice).worthwhile);

  // Round trip: the size recommended for a distance should want that distance.
  const recommended = sizeForDistance(advice.thxFeet, 40)!;
  assert(`the recommended size round-trips (${recommended.toFixed(1)}")`, near(recommended, 55, 0.5));

  assert("a zero diagonal is refused", dimensions(0) === null);
  assert("every resolution is defined",
    Object.values(RESOLUTIONS).every((r) => r.width > 0 && r.height > 0));
}

/* ====================================================== clothing sizes */

console.log("\nClothing sizes");

{
  const uk12 = sizeConvert("12", "uk", "women", "tops")!;
  assert("UK 12 women's top is US 8", uk12.row.us === "8");
  assert("and EU 40", uk12.row.eu === "40");
  assert("and Italian 44", uk12.row.it === "44");
  assert("and an M", uk12.row.alpha === "M");

  // Alpha sizes deliberately cover more than one numeric size, which is the
  // whole reason S/M/L is unreliable.
  const medium = sizeConvert("S", "alpha", "women", "tops")!;
  assert("an alpha size matches more than one row", medium.alsoMatching.length > 0,
    `${medium.alsoMatching.length}`);

  const mens = sizeConvert("40", "uk", "men", "tops")!;
  assert("men's UK 40 chest is EU 50", mens.row.eu === "50");

  // Every row must be reachable from every column.
  let unreachable = 0;
  for (const fit of ["women", "men"] as const) {
    for (const garment of ["tops", "bottoms"] as const) {
      for (const row of TABLES[fit][garment]) {
        for (const region of ["uk", "us", "eu", "it"] as const) {
          if (!sizeConvert(row[region], region, fit, garment)) unreachable += 1;
        }
      }
    }
  }
  assert("every row is reachable from every numeric column", unreachable === 0, `${unreachable}`);

  // Body measurements must ascend, or a table has a typo.
  for (const fit of ["women", "men"] as const) {
    for (const garment of ["tops", "bottoms"] as const) {
      const lows = TABLES[fit][garment].map((row) => Number(row.bodyCm.split("–")[0]));
      assert(`${fit} ${garment} measurements ascend`,
        lows.every((value, i) => i === 0 || value > lows[i - 1]));
    }
  }

  const byChest = fromMeasurement(93, "women", "tops");
  assert("a chest measurement finds a size", byChest.length > 0);
  assert("and it is the right one", byChest[0].uk === "12", byChest[0].uk);
  assert("an absurd measurement finds nothing", fromMeasurement(400, "women", "tops").length === 0);
  assert("an unknown size returns nothing", sizeConvert("99", "uk", "women", "tops") === null);
}

/* ================================================================= GPA */

console.log("\nGPA");

{
  const course = (grade: string, credits: number, honours = false): Course => ({
    id: grade + credits + String(honours), name: "x", grade, credits, honours,
  });

  assert("an A is 4 points", pointsFor("A", "4.0") === 4);
  assert("an A- is 3.7 on the plus scale", pointsFor("A-", "4.0-plus") === 3.7);
  assert("A- is not a grade on the plain scale", pointsFor("A-", "4.0") === null);
  assert("a UK mark is the percentage", pointsFor("68", "uk") === 68);
  assert("an out-of-range mark is refused", pointsFor("150", "uk") === null);
  assert("nonsense is refused", pointsFor("Z", "4.0") === null);

  // The point of the tool: credits weight the average.
  const weighted = gpa([course("A", 4), course("C", 1)], "4.0")!;
  // (4*4 + 2*1) / 5 = 3.6
  assert(`credits weight the mean (${weighted.gpa})`, near(weighted.gpa, 3.6, 0.001));
  assert("the unweighted mean differs", near(weighted.simpleMean, 3, 0.001));
  assert("total credits are summed", weighted.totalCredits === 5);
  assert("courses are counted", weighted.countedCourses === 2);

  // Reversing the credits must move the answer the other way.
  const reversed = gpa([course("A", 1), course("C", 4)], "4.0")!;
  assert(`reversing the credits changes the result (${reversed.gpa})`, near(reversed.gpa, 2.4, 0.001));

  const honours = gpa([course("A", 4, true), course("A", 4)], "4.0")!;
  assert("an honours bonus raises the weighted figure", honours.weightedGpa === 4.5);
  assert("but not the plain one", honours.gpa === 4);
  assert("no weighted figure without honours courses", weighted.weightedGpa === null);

  const uk = gpa([course("72", 30), course("65", 30)], "uk")!;
  assert(`a UK average of 68.5 (${uk.gpa})`, near(uk.gpa, 68.5, 0.001));
  assert("classified as a 2:1", uk.classification === "Upper second (2:1)");
  assert("a 71 average is a first", gpa([course("71", 10)], "uk")!.classification === "First (1st)");
  assert("honours does not apply to UK marks", gpa([course("72", 10, true)], "uk")!.weightedGpa === null);

  assert("blank grades are skipped", gpa([course("A", 3), course("", 3)], "4.0")!.countedCourses === 1);
  assert("zero-credit courses are skipped", gpa([course("A", 3), course("B", 0)], "4.0")!.countedCourses === 1);
  assert("nothing valid returns nothing", gpa([course("", 3)], "4.0") === null);

  // What is needed to reach a target.
  const current = gpa([course("B", 30)], "4.0")!;
  const needed = requiredAverage(current, 3.5, 30)!;
  // (3.5*60 - 3*30) / 30 = 4
  assert(`reaching 3.5 needs a 4.0 average (${needed.required})`, near(needed.required, 4, 0.01));
  assert("which is just achievable", needed.achievable);
  const impossible = requiredAverage(current, 3.9, 30)!;
  assert("an out-of-reach target is flagged", !impossible.achievable);
  assert("zero remaining credits returns nothing", requiredAverage(current, 3.5, 0) === null);
}

console.log(
  failures === 0
    ? "\nRedaction, DPI, viewing distance, clothing and GPA checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
