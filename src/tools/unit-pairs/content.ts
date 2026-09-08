import type { ToolContent } from "@/config/tool-content";

import { UNIT_NOTES } from "@/lib/unit-notes";
import { TEMPERATURE_CATEGORY, convertPair, getCategory, unitPairs, type UnitPair } from "@/lib/units";

/**
 * Content for the 110 generated unit pair pages.
 *
 * These used to carry three templated sentences and nothing else — 58 words
 * apiece, sharing 86% of their vocabulary with each other, which is what a
 * search engine reads as near-duplicate. They are also the pages the site
 * actually ranks for, so thin was the wrong thing for them to be.
 *
 * Each page is now built from three things that differ: this pair's real
 * conversion factor, a note on each of its two units, and a worked example in
 * its own numbers. Two pages overlap only where they share a unit, and no pair
 * shares both.
 */

/** Trims a converted value to something a person would actually write. */
function tidy(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const abs = Math.abs(value);
  const decimals = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return Number(value.toFixed(decimals))
    .toLocaleString("en-GB", { maximumFractionDigits: decimals });
}

/**
 * How the conversion is actually done, in this pair's own numbers.
 *
 * Temperature is stated as a rule rather than a factor because its scales
 * carry an offset — saying "multiply by 1.8" would be wrong by 32 degrees.
 */
function formulaNote(pair: UnitPair): string {
  const one = convertPair(pair, 1);

  if (pair.categoryId === TEMPERATURE_CATEGORY) {
    const zero = convertPair(pair, 0);
    const hundred = convertPair(pair, 100);
    return `These are scales rather than multiples, so there is an offset as well as a ratio: 0 ${pair.fromSymbol} is ${tidy(zero)} ${pair.toSymbol} and 100 ${pair.fromSymbol} is ${tidy(hundred)} ${pair.toSymbol}. That is why you cannot convert a temperature by multiplying alone, and why a difference of ten degrees is not the same thing as a temperature of ten degrees.`;
  }

  return `One ${pair.fromLabel.toLowerCase()} is ${tidy(one)} ${pair.toSymbol}, so the conversion is a single multiplication: ${pair.fromSymbol} × ${tidy(one)} = ${pair.toSymbol}. Dividing by the same number goes back the other way, which is why round-tripping a value returns exactly what you started with.`;
}

/** A worked example in numbers someone might plausibly type. */
function exampleNote(pair: UnitPair): string {
  const samples = pair.categoryId === TEMPERATURE_CATEGORY ? [0, 20, 100] : [1, 10, 100];
  const worked = samples
    .map((value) => `${value} ${pair.fromSymbol} is ${tidy(convertPair(pair, value))} ${pair.toSymbol}`)
    .join(", ");

  return `Worked through: ${worked}. The table on this page carries the values people look up most, and the box above takes anything else.`;
}

function toContent(pair: UnitPair): ToolContent {
  const categoryLabel =
    pair.categoryId === TEMPERATURE_CATEGORY
      ? "Temperature"
      : (getCategory(pair.categoryId)?.label ?? "Unit");

  const notes = [
    formulaNote(pair),
    UNIT_NOTES[pair.fromId],
    UNIT_NOTES[pair.toId],
    exampleNote(pair),
  ].filter((note): note is string => Boolean(note));

  return {
    steps: [
      `Type a value in ${pair.fromLabel.toLowerCase()} — the result appears as you type.`,
      "The formula is shown, so you can check the arithmetic rather than trusting it.",
      `Use the table for common values, or open the full ${categoryLabel} Converter for other units.`,
    ],
    notes,
    faq: [
      {
        question: `How many ${pair.toLabel.toLowerCase()}s are in a ${pair.fromLabel.toLowerCase()}?`,
        answer:
          pair.categoryId === TEMPERATURE_CATEGORY
            ? `Temperature scales do not work that way — they have an offset, so there is no fixed number of one per the other. What is true is that ${1} ${pair.fromSymbol} reads as ${tidy(convertPair(pair, 1))} ${pair.toSymbol}, while 0 ${pair.fromSymbol} reads as ${tidy(convertPair(pair, 0))} ${pair.toSymbol}.`
            : `One ${pair.fromLabel.toLowerCase()} is ${tidy(convertPair(pair, 1))} ${pair.toSymbol}. Ten is ${tidy(convertPair(pair, 10))}, and a hundred is ${tidy(convertPair(pair, 100))}.`,
      },
      {
        question: `What is the formula for ${pair.shorthand}?`,
        answer:
          pair.categoryId === TEMPERATURE_CATEGORY
            ? `Apply the scale conversion rather than a multiplier: 0 ${pair.fromSymbol} becomes ${tidy(convertPair(pair, 0))} ${pair.toSymbol} and 100 ${pair.fromSymbol} becomes ${tidy(convertPair(pair, 100))} ${pair.toSymbol}. The calculator above does it exactly.`
            : `Multiply by ${tidy(convertPair(pair, 1))}. To go the other way, divide by the same figure — the conversion is exact in both directions.`,
      },
    ],
  };
}

export const unitPairContent: Record<string, ToolContent> = Object.fromEntries(
  unitPairs.map((pair) => [pair.slug, toContent(pair)]),
);
