#!/usr/bin/env node
/**
 * Verifies the home and lifestyle calculators against hand-worked answers.
 *
 * These tools produce numbers people spend money on — boxes of tile, yards of
 * concrete, a solar quote. Every expected value below was worked out by hand
 * from the stated inputs, not read off the tool's own output.
 *
 *   pnpm check:home
 */

import process from "node:process";

import { SQFT_PER_SQM, formatKitchen, INGREDIENTS } from "@/lib/home";
import { totalArea } from "@/tools/square-footage-calculator/logic";
import { estimate as paint } from "@/tools/paint-calculator/logic";
import { estimate as flooring } from "@/tools/flooring-calculator/logic";
import { estimate as tile } from "@/tools/tile-calculator/logic";
import { estimate as wallpaper } from "@/tools/wallpaper-calculator/logic";
import { estimate as concrete } from "@/tools/concrete-calculator/logic";
import { estimate as fence } from "@/tools/fence-calculator/logic";
import { estimate as solar } from "@/tools/solar-savings-calculator/logic";
import { runningCost } from "@/tools/electricity-cost-calculator/logic";
import { estimate as water } from "@/tools/water-bill-calculator/logic";
import { compare } from "@/tools/unit-price-calculator/logic";
import { convert } from "@/tools/cooking-measurement-converter/logic";
import { parseQuantity, scaleRecipe } from "@/tools/recipe-scaler/logic";
import { metrics } from "@/tools/room-size-calculator/logic";
import { shoppingList } from "@/tools/meal-planner/logic";
import { guessAisle } from "@/tools/grocery-list/logic";
import { caloriesFromMacros, macroTargets } from "@/tools/calorie-tracker/logic";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown, tolerance = 1e-6): void {
  const ok =
    typeof actual === "number" && typeof expected === "number"
      ? Math.abs(actual - expected) <= Math.max(tolerance, Math.abs(expected) * tolerance)
      : actual === expected;

  if (ok) {
    console.log(`  ok    ${label} = ${String(actual)}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${label}: got ${String(actual)}, expected ${String(expected)}`);
  }
}

/* ------------------------------------------------------------------- area */

{
  const one = totalArea([{ id: "a", label: "Main", length: "12", width: "10" }], "ft");
  check("12 × 10 ft", one.squareFeet, 120);
  // 120 ÷ 10.7639 = 11.1484 m²
  check("120 sq ft in m²", round(one.squareMetres, 4), 11.1484);
  check("120 sq ft in sq yd", round(one.squareYards, 4), 13.3333);

  // An L-shape is two rectangles summed.
  const two = totalArea(
    [
      { id: "a", label: "Main", length: "12", width: "10" },
      { id: "b", label: "Alcove", length: "6", width: "4" },
    ],
    "ft",
  );
  check("L-shape 120 + 24", two.squareFeet, 144);

  // Metres in, square feet out: 4 × 3 m = 12 m² = 129.167 sq ft.
  const metric = totalArea([{ id: "a", label: "Main", length: "4", width: "3" }], "m");
  check("4 × 3 m in sq ft", round(metric.squareFeet, 3), round(12 * SQFT_PER_SQM, 3));
}

/* ------------------------------------------------------------------ paint */

{
  /*
   * 12 × 10 room, 8 ft walls. Perimeter 44 ft × 8 = 352 sq ft of wall.
   * One door (21) and two windows (2 × 15 = 30) = 51 sq ft off, leaving 301.
   * Two coats = 602 sq ft to cover, at 350 sq ft/gal = 1.72 gallons.
   */
  const result = paint(352, 1, 2, 2, 350, 0, 45);
  check("paint deductions", result.deducted, 51);
  check("paintable area", result.paintableArea, 301);
  check("total to cover", result.totalCoverage, 602);
  check("gallons", round(result.gallons, 4), 1.72);
  // Sold in quarter-gallon steps, rounded up.
  check("gallons to buy", result.gallonsToBuy, 1.75);
  // 1.72 gal × 3.785411784 = 6.511 L
  check("litres", round(result.litres, 3), 6.511);

  // Ceiling included adds the floor area.
  const withCeiling = paint(352, 1, 2, 2, 350, 120, 0);
  check("ceiling adds floor area", withCeiling.paintableArea, 421);
}

/* --------------------------------------------------------------- flooring */

{
  // 120 sq ft + 10% = 132, at 20 sq ft a box = 6.6 → 7 boxes = 140 sq ft.
  const result = flooring(120, 20, 10, 55);
  check("flooring area with waste", round(result.areaWithWaste, 6), 132);
  check("flooring boxes", result.boxes, 7);
  check("flooring covered", result.covered, 140);
  check("flooring spare", result.spare, 20);
  check("flooring cost", result.cost, 385);

  // Rounding must always go up: 121 sq ft at 20/box is 7 boxes, not 6.
  check("boxes always round up", flooring(121, 20, 0, 0).boxes, 7);
}

/* ------------------------------------------------------------------- tile */

{
  /*
   * 12" × 24" tile with a 3 mm joint. 3 mm = 0.11811", so each tile occupies
   * 12.11811 × 24.11811 = 292.26 in² = 2.0296 sq ft.
   */
  const result = tile(120, 12, 24, 3, 10, 8, 38);
  check("tile footprint sq ft", round(result.tileAreaSqft, 4), 2.0296);
  // 120 ÷ 2.0296 = 59.13 tiles, +10% = 65.04 → 66
  check("tiles with waste", result.tilesWithWaste, 66);
  check("tile boxes", result.boxes, 9);

  // A zero grout gap gives exactly area ÷ tile area: 12×24 = 2 sq ft, 120/2 = 60.
  check("no grout, exact fit", tile(120, 12, 24, 0, 0, 8, 0).tilesWithWaste, 60);
}

/* -------------------------------------------------------------- wallpaper */

{
  /*
   * 12 × 10 room, 8 ft walls, 44 ft perimeter. One door and one window remove
   * 36 sq ft ÷ 8 ft = 4.5 ft of width, leaving 39.5 ft.
   * A 20.5" roll is 1.7083 ft wide, so 39.5 / 1.7083 = 23.12 → 24 drops.
   * A 21" repeat is 1.75 ft; 8 ft + 0.25 trim = 8.25 rounds up to 8.75 ft.
   * A 33 ft roll gives floor(33 / 8.75) = 3 drops, so 24 / 3 = 8 rolls.
   */
  const result = wallpaper(44, 8, 1, 1, 20.5, 33, 21, "straight", 55);
  check("usable perimeter", round(result.perimeterFt, 4), 39.5);
  check("drops needed", result.dropsNeeded, 24);
  check("drop length", round(result.dropLengthFt, 4), 8.75);
  check("drops per roll", result.dropsPerRoll, 3);
  check("wallpaper rolls", result.rolls, 8);

  // A plain paper with no repeat wastes far less: 8.25 ft drops, 4 per roll.
  const plain = wallpaper(44, 8, 1, 1, 20.5, 33, 0, "free", 0);
  check("plain paper drop length", round(plain.dropLengthFt, 4), 8.25);
  check("plain paper drops per roll", plain.dropsPerRoll, 4);
  check("plain paper rolls", plain.rolls, 6);
}

/* --------------------------------------------------------------- concrete */

{
  // 10 × 10 slab, 4" thick = 33.333 ft³. +10% = 36.667 ft³ = 1.358 yd³.
  const result = concrete("slab", 10, 10, 4, 0, 0, 1, 10, 140);
  check("slab cubic feet", round(result.cubicFeet, 4), 36.6667);
  check("slab cubic yards", round(result.cubicYards, 4), 1.358);
  // Ordered in quarter-yard steps, rounded up.
  check("yards to order", result.yardsToOrder, 1.5);
  check("80 lb bags", result.bags80, 62);

  // A 1 ft diameter, 4 ft column: π × 0.5² × 4 = 3.1416 ft³.
  const column = concrete("column", 0, 0, 0, 1, 4, 1, 0, 0);
  check("column cubic feet", round(column.cubicFeet, 4), 3.1416);

  // Six identical footings multiply.
  const six = concrete("column", 0, 0, 0, 1, 4, 6, 0, 0);
  check("six columns", round(six.cubicFeet, 4), round(3.14159265 * 6, 4));
}

/* ------------------------------------------------------------------ fence */

{
  /*
   * 100 ft at 8 ft spacing is 12.5 → 13 sections, and 14 posts: the fencepost
   * problem. 5.5" pickets butted together over 1200 inches is 219 pickets.
   */
  const result = fence(100, 8, 6, 3, 5.5, 0, 18, 9, 4);
  check("fence sections", result.sections, 13);
  check("fence posts", result.posts, 14);
  check("posts are sections + 1", result.posts - result.sections, 1);
  check("fence rails", result.rails, 39);
  check("fence pickets", result.pickets, 219);
  // 14 × 18 + 39 × 9 + 219 × 4 = 252 + 351 + 876 = 1479
  check("fence cost", result.cost, 1479);

  // A 1" gap between pickets: pitch 6.5", 1200 / 6.5 = 184.6 → 185.
  check("spaced pickets", fence(100, 8, 6, 3, 5.5, 1, 0, 0, 0).pickets, 185);
}

/* ------------------------------------------------------------ electricity */

{
  // 1500 W for 6 h = 9 kWh a day. At $0.17 that is $1.53.
  const result = runningCost(1500, 6, 0.17, 1);
  check("kWh per day", result.kwhPerDay, 9);
  check("cost per day", round(result.perDay, 4), 1.53);
  // 9 × 365.2425 = 3287.18 kWh, × 0.17 = $558.82
  check("cost per year", round(result.perYear, 2), 558.82);

  // Twelve 9 W bulbs for 6 h: 0.648 kWh a day.
  check("twelve LED bulbs", round(runningCost(9, 6, 0.17, 12).kwhPerDay, 6), 0.648);
}

/* ------------------------------------------------------------------ water */

{
  // One person, 10-minute shower at 2.1 gal/min = 21 gallons, nothing else.
  const result = water({
    people: 1, showerMinutes: 10, showersPerDay: 1, toiletFlushes: 0,
    oldToilets: false, laundryPerWeek: 0, highEfficiencyWasher: true,
    dishwasherPerWeek: 0, faucetMinutes: 0, outdoorMinutesPerWeek: 0,
    drippingTaps: 0, ratePer1000Gal: 6.5,
  });
  check("shower only", round(result.gallonsPerDay, 4), 21);

  // Old toilets are more than double new ones: 5 flushes × 3.5 vs × 1.6.
  const base = {
    people: 1, showerMinutes: 0, showersPerDay: 0, toiletFlushes: 5,
    laundryPerWeek: 0, highEfficiencyWasher: true, dishwasherPerWeek: 0,
    faucetMinutes: 0, outdoorMinutesPerWeek: 0, drippingTaps: 0, ratePer1000Gal: 6.5,
  };
  check("new toilets", round(water({ ...base, oldToilets: false }).gallonsPerDay, 4), 8);
  check("old toilets", round(water({ ...base, oldToilets: true }).gallonsPerDay, 4), 17.5);

  // A dripping tap alone: 5 gallons a day, $0.99 a year at $6.50/1000 gal.
  const drip = water({ ...base, toiletFlushes: 0, oldToilets: false, drippingTaps: 1 });
  check("one dripping tap", drip.gallonsPerDay, 5);
}

/* ------------------------------------------------------------------ solar */

{
  /*
   * 12,000 kWh a year, 4.5 sun hours, 100% offset.
   * 12000 / (4.5 × 365 × 0.8) = 9.1324 kW. At $2.80/W that is $25,571 gross,
   * $17,900 after a 30% credit.
   */
  const result = solar({
    annualKwh: 12000, ratePerKwh: 0.17, sunHours: 4.5, costPerWatt: 2.8,
    incentivePercent: 30, offsetPercent: 100, panelWatts: 400,
    rateInflation: 3, years: 25,
  });
  check("system size kW", round(result.systemKw, 3), 9.132);
  check("panels", result.panels, 23);
  check("gross cost", round(result.grossCost, 0), 25571);
  check("net cost", round(result.netCost, 0), 17900);
  // First year: 12,000 kWh × $0.17 = $2,040
  check("first-year savings", round(result.firstYearSavings, 0), 2040);
  // Payback lands between 7 and 9 years at these numbers.
  check("payback is plausible", result.paybackYears !== null && result.paybackYears > 7 && result.paybackYears < 9, true);
  check("25 years of rows", result.yearly.length, 25);
  // Output degrades: year 25 produces less than year 1.
  check("output degrades", result.yearly[24].savings > 0 && result.lifetimeProduction < 12000 * 25, true);
}

/* ------------------------------------------------------------- unit price */

{
  /*
   * $4.99 for 750 g is $0.006653/g. $3.29 for 16 oz (453.59 g) is $0.007253/g.
   * The larger box wins, which is not obvious from the shelf price.
   */
  const rows = compare([
    { id: "a", label: "A", price: "4.99", size: "750", unit: "g" },
    { id: "b", label: "B", price: "3.29", size: "16", unit: "oz" },
  ]);
  check("A is cheaper per gram", rows[0].best, true);
  check("B is not the best", rows[1].best, false);
  check("A price per gram", round(rows[0].perBase, 8), 0.00665333);
  check("B premium %", round(rows[1].premium, 2), 9.02);

  // The bigger box is not always cheaper — that is the point of the tool.
  const trap = compare([
    { id: "a", label: "Big", price: "9.99", size: "1", unit: "kg" },
    { id: "b", label: "Small", price: "2.29", size: "250", unit: "g" },
  ]);
  check("small box wins here", trap[1].best, true);
}

/* ---------------------------------------------------------------- cooking */

{
  // The whole reason this tool exists: same volume, very different weights.
  check("1 cup flour", round(convert(1, "cup", "flour-ap")!.grams, 1), 120);
  check("1 cup honey", round(convert(1, "cup", "honey")!.grams, 1), 340);
  check("1 cup sugar", round(convert(1, "cup", "sugar-white")!.grams, 1), 200);
  // Water is 1 g per ml by definition of the gram.
  check("1 cup water in ml", round(convert(1, "cup", "water")!.volumeMl, 4), 236.5882);
  check("water is ~1 g/ml", round(convert(1, "cup", "water")!.grams, 1), 236.6);

  // Weight in, volume out — the reverse direction.
  const reverse = convert(240, "g", "flour-ap")!;
  check("240 g flour in cups", round(reverse.volumeMl / 236.5882365, 3), 2);

  // Every ingredient must have a positive density, or its page divides by zero.
  check("all densities positive", INGREDIENTS.every((i) => i.gramsPerCup > 0), true);
}

check("formatKitchen 0.6667", formatKitchen(2 / 3), "⅔");
check("formatKitchen 1.5", formatKitchen(1.5), "1 ½");
check("formatKitchen 2", formatKitchen(2), "2");
check("formatKitchen 0.75", formatKitchen(0.75), "¾");
// Rounding up to a whole unit has to carry, not print "1 " with an empty part.
check("formatKitchen 0.97", formatKitchen(0.97), "1");
check("formatKitchen 2.98", formatKitchen(2.98), "3");

/* ----------------------------------------------------------- recipe scaler */

check("parse 1 1/2", parseQuantity("1 1/2"), 1.5);
check("parse 3/4", parseQuantity("3/4"), 0.75);
check("parse 1½", parseQuantity("1½"), 1.5);
check("parse ¾", parseQuantity("¾"), 0.75);
check("parse 0.25", parseQuantity("0.25"), 0.25);
check("parse nonsense", parseQuantity("salt"), null);

{
  const lines = scaleRecipe("2 cups flour\n1 1/2 tsp baking powder\n115 g butter\nSalt to taste", 1.5);
  check("2 cups × 1.5", lines[0].scaled, "3 cups flour");
  // 1.5 × 1.5 = 2.25 tsp, which a measuring spoon can do as 2¼.
  check("1 1/2 tsp × 1.5", lines[1].scaled, "2 ¼ tsp baking powder");
  // Grams stay decimal rather than becoming "172 ½ g", and round to whole
  // grams above 10 because no kitchen scale reads finer than that.
  check("115 g × 1.5", lines[2].scaled, "173 g butter");
  // A line with no quantity is left exactly alone.
  check("no quantity untouched", lines[3].scaled, "Salt to taste");
  check("no quantity not marked changed", lines[3].changed, false);
}
{
  const halved = scaleRecipe("2 cups flour\n1 tsp salt", 0.5);
  check("halved cups", halved[0].scaled, "1 cups flour");
  check("halved tsp", halved[1].scaled, "½ tsp salt");
}

/* ------------------------------------------------------------- room size */

{
  // 12 × 10 × 8: floor 120, walls 2 × 22 × 8 = 352, volume 960.
  const result = metrics(12, 10, 8, "ft")!;
  check("room floor", result.floorSqft, 120);
  check("room walls", result.wallSqft, 352);
  check("room perimeter", result.perimeterFt, 44);
  check("room volume", result.volumeFt3, 960);
  check("cooling BTU", result.coolingBtu, 2400);
  // A 10 × 12 room leaves room for an 8 × 10 rug with a border all round.
  check("rug size", `${result.rug?.width}x${result.rug?.length}`, "6x9");

  check("zero dimension rejected", metrics(0, 10, 8, "ft"), null);
}

/* --------------------------------------------------------------- planners */

{
  // The same ingredient in two meals is one thing to buy, counted twice.
  const list = shoppingList({
    "Monday:Dinner": { dish: "Roast", ingredients: "Chicken, potatoes" },
    "Friday:Dinner": { dish: "Curry", ingredients: "chicken\nrice" },
  });
  check("merged list length", list.length, 3);
  check("chicken counted twice", list.find((i) => i.name.toLowerCase() === "chicken")?.count, 2);
}

check("aisle for milk", guessAisle("Milk"), "Dairy & eggs");
check("aisle for chicken thighs", guessAisle("chicken thighs"), "Meat & fish");
check("aisle for bananas", guessAisle("Bananas"), "Produce");
check("aisle for toilet roll", guessAisle("toilet roll"), "Household");
check("aisle for something odd", guessAisle("birthday candles"), "Other");

// Protein and carbs are 4 kcal/g, fat is 9.
check("macros to calories", caloriesFromMacros({ calories: 0, protein: 100, carbs: 100, fat: 50 }), 1250);
{
  // 2000 kcal at 30/40/30 = 150 g protein, 200 g carbs, 66.7 g fat.
  const targets = macroTargets(2000, 30, 40, 30);
  check("protein target", targets.protein, 150);
  check("carb target", targets.carbs, 200);
  check("fat target", round(targets.fat, 2), 66.67);
}

function round(value: number, places: number): number {
  return Number(value.toFixed(places));
}

console.log(
  failures === 0 ? "\nAll home checks passed." : `\n${failures} home checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
