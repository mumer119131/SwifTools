#!/usr/bin/env node
/**
 * Verifies unit conversions against known values.
 *
 * A converter that returns a wrong number is worse than no converter, because
 * the output looks exactly as authoritative either way. Many of these are exact
 * by definition — an inch is 25.4 mm and a pound is 0.45359237 kg by
 * international agreement, not by measurement — so they are checked tightly.
 *
 *   pnpm check:units
 */

import process from "node:process";

import {
  convertPair,
  getPair,
  getUnit,
  convert,
  convertTemperature,
  unitPairs,
} from "@/lib/units";

/** [category, from, to, input, expected, tolerance] */
const conversions: [string, string, string, number, number, number][] = [
  // Exact by international definition.
  ["weight", "lb", "kg", 1, 0.45359237, 1e-12],
  ["weight", "kg", "lb", 1, 2.2046226218, 1e-9],
  ["weight", "oz", "g", 1, 28.349523125, 1e-9],
  ["weight", "st", "kg", 1, 6.35029318, 1e-9],
  ["weight", "kg", "g", 2.5, 2500, 1e-9],

  ["length", "in", "cm", 1, 2.54, 1e-12],
  ["length", "cm", "in", 2.54, 1, 1e-12],
  ["length", "ft", "m", 1, 0.3048, 1e-12],
  ["length", "mi", "km", 1, 1.609344, 1e-12],
  ["length", "yd", "m", 1, 0.9144, 1e-12],
  ["length", "nmi", "m", 1, 1852, 1e-9],

  ["volume", "galus", "l", 1, 3.785411784, 1e-9],
  ["volume", "l", "ml", 1, 1000, 1e-9],
  ["volume", "cup", "ml", 1, 236.5882365, 1e-7],

  ["area", "acre", "m2", 1, 4046.8564224, 1e-6],
  ["area", "ft2", "m2", 1, 0.09290304, 1e-12],
  ["area", "ha", "m2", 1, 10000, 1e-9],

  ["speed", "mph", "kph", 1, 1.609344, 1e-9],
  ["speed", "kn", "kph", 1, 1.852, 1e-9],
  ["speed", "mps", "kph", 1, 3.6, 1e-9],

  // Decimal vs binary prefixes — the distinction the tool exists to make clear.
  ["data", "GB", "MB", 1, 1000, 1e-6],
  ["data", "MiB", "MB", 1, 1.048576, 1e-9],
  ["data", "GiB", "MiB", 1, 1024, 1e-6],
  ["data", "B", "b", 1, 8, 1e-9],

  ["time", "h", "min", 1, 60, 1e-9],
  ["time", "d", "h", 1, 24, 1e-9],
  ["time", "wk", "d", 1, 7, 1e-9],
];

/** [from, to, input, expected] */
const temperatures: [string, string, number, number][] = [
  ["c", "f", 0, 32],
  ["c", "f", 100, 212],
  ["c", "f", 37, 98.6],
  ["f", "c", 32, 0],
  ["f", "c", 212, 100],
  // The one temperature both scales agree on.
  ["c", "f", -40, -40],
  ["f", "c", -40, -40],
  ["c", "k", 0, 273.15],
  ["k", "c", 273.15, 0],
  ["f", "k", 32, 273.15],
];

let failures = 0;

for (const [category, fromId, toId, input, expected, tolerance] of conversions) {
  const from = getUnit(category, fromId);
  const to = getUnit(category, toId);

  if (!from || !to) {
    failures += 1;
    console.error(`  FAIL  ${category}: unit ${fromId} or ${toId} is missing`);
    continue;
  }

  const actual = convert(input, from, to);
  if (Math.abs(actual - expected) <= tolerance) {
    console.log(`  ok    ${input} ${from.symbol} = ${expected} ${to.symbol}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${input} ${from.symbol} → ${to.symbol}: got ${actual}, expected ${expected}`);
  }
}

for (const [fromId, toId, input, expected] of temperatures) {
  const actual = convertTemperature(input, fromId as "c" | "f" | "k", toId as "c" | "f" | "k");
  if (Math.abs(actual - expected) < 1e-9) {
    console.log(`  ok    ${input}${fromId.toUpperCase()} = ${expected}${toId.toUpperCase()}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${input}${fromId} → ${toId}: got ${actual}, expected ${expected}`);
  }
}

/* Structural checks on the generated pair pages. */

const slugs = new Set<string>();
for (const pair of unitPairs) {
  if (slugs.has(pair.slug)) {
    failures += 1;
    console.error(`  FAIL  duplicate pair slug: ${pair.slug}`);
  }
  slugs.add(pair.slug);

  // Every pair must resolve and produce a finite number, or its page is broken.
  const value = convertPair(pair, 1);
  if (!Number.isFinite(value)) {
    failures += 1;
    console.error(`  FAIL  ${pair.slug} does not convert: got ${value}`);
  }

  if (!getPair(pair.slug)) {
    failures += 1;
    console.error(`  FAIL  ${pair.slug} is not resolvable by slug`);
  }
}

console.log(`  ok    ${unitPairs.length} pair pages, all unique and converting`);

// Round-tripping must return the original, which catches an inverted ratio that
// a one-way check would miss.
for (const pair of unitPairs) {
  const reverse = unitPairs.find(
    (entry) =>
      entry.categoryId === pair.categoryId &&
      entry.fromId === pair.toId &&
      entry.toId === pair.fromId,
  );
  if (!reverse) continue;

  const roundTripped = convertPair(reverse, convertPair(pair, 7));
  if (Math.abs(roundTripped - 7) > 1e-6) {
    failures += 1;
    console.error(`  FAIL  ${pair.slug} does not round-trip: 7 → ${roundTripped}`);
  }
}
console.log("  ok    every pair round-trips through its reverse");

const total = conversions.length + temperatures.length;
console.log(
  failures === 0
    ? `\n${total} conversions and ${unitPairs.length} pair pages verified.`
    : `\n${failures} unit checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
