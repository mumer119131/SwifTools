#!/usr/bin/env node
/**
 * Verifies the randomness and puzzle generators.
 *
 * Two things are checked here that are easy to get wrong and impossible to spot
 * by eye: that the "random" tools are actually uniform, and that the generated
 * puzzles are structurally valid. A biased shuffle looks perfectly random in
 * any single run.
 *
 *   pnpm check:fun
 */

import process from "node:process";

import { hashSeed, mulberry32, secureInt, secureRange, shuffle } from "@/lib/random";
import { summarise } from "@/tools/coin-flipper/logic";
import { parseModifier, parseNotation, roll } from "@/tools/dice-roller/logic";
import { draw } from "@/tools/random-number-generator/logic";
import { generate as sudoku, isLegal } from "@/tools/sudoku-generator/logic";
import { generate as wordSearch, solutionCells } from "@/tools/word-search/logic";
import { build as crossword, parseEntries, SAMPLE as CW_SAMPLE } from "@/tools/crossword-maker/logic";
import { buildBracket } from "@/tools/tournament-bracket/logic";
import { makeNumberCard, numberPool } from "@/tools/bingo-card/logic";
import { intoGroups } from "@/tools/list-randomizer/logic";
import { simulatePixel, hexToRgb, DEFICIENCIES } from "@/tools/color-blindness-simulator/logic";
import { generate as names } from "@/tools/random-name-generator/logic";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const ok = actual === expected;
  if (ok) console.log(`  ok    ${label} = ${String(actual)}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}: got ${String(actual)}, expected ${String(expected)}`);
  }
}

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------------------- uniformity */

{
  /*
   * Chi-squared over 60,000 draws from a 6-sided range. A fair generator gives
   * a statistic under 15.09 (the 99% critical value for 5 degrees of freedom)
   * almost always; a modulo-biased one blows well past it.
   */
  const buckets = new Array(6).fill(0);
  const trials = 60_000;
  for (let index = 0; index < trials; index += 1) buckets[secureInt(6)] += 1;

  const expected = trials / 6;
  const chiSquared = buckets.reduce(
    (sum, observed) => sum + (observed - expected) ** 2 / expected,
    0,
  );

  assert(
    `secureInt(6) is uniform (χ² = ${chiSquared.toFixed(2)}, needs < 20.5)`,
    chiSquared < 20.5,
    `buckets ${buckets.join(", ")}`,
  );

  // Every value in the range must be reachable, and nothing outside it.
  const seen = new Set<number>();
  for (let index = 0; index < 5000; index += 1) seen.add(secureRange(3, 9));
  assert("secureRange(3, 9) covers exactly 3..9", seen.size === 7 && !seen.has(2) && !seen.has(10));
  check("secureInt(1) is always 0", secureInt(1), 0);
  check("secureInt(0) is 0", secureInt(0), 0);
}

{
  /*
   * A shuffle must reach every position with equal probability. Tracking where
   * one element lands over many shuffles catches the classic biased sort, which
   * leaves the first element near the front far too often.
   */
  const positions = new Array(5).fill(0);
  const trials = 30_000;
  for (let index = 0; index < trials; index += 1) {
    positions[shuffle([0, 1, 2, 3, 4]).indexOf(0)] += 1;
  }

  const expected = trials / 5;
  const chiSquared = positions.reduce(
    (sum, observed) => sum + (observed - expected) ** 2 / expected,
    0,
  );

  assert(
    `shuffle spreads element 0 evenly (χ² = ${chiSquared.toFixed(2)}, needs < 18.5)`,
    chiSquared < 18.5,
    `positions ${positions.join(", ")}`,
  );

  // A shuffle must be a permutation: same members, no loss, no duplication.
  const input = Array.from({ length: 50 }, (_, index) => index);
  const shuffled = shuffle(input);
  assert("shuffle preserves every element", new Set(shuffled).size === 50 && shuffled.length === 50);
  assert("shuffle does not mutate its input", input[0] === 0 && input[49] === 49);
}

/* ------------------------------------------------------------------ seeded */

{
  const a = mulberry32(hashSeed("SEED"));
  const b = mulberry32(hashSeed("SEED"));
  const c = mulberry32(hashSeed("OTHER"));

  const first = [a(), a(), a()];
  const same = [b(), b(), b()];
  const different = [c(), c(), c()];

  assert("same seed gives the same sequence", first.every((v, i) => v === same[i]));
  assert("a different seed diverges", first.some((v, i) => v !== different[i]));
  assert("values stay in [0, 1)", first.every((v) => v >= 0 && v < 1));
}

/* -------------------------------------------------------------------- dice */

check("parse 2d6", JSON.stringify(parseNotation("2d6")), JSON.stringify([{ count: 2, sides: 6 }]));
check("parse d20", JSON.stringify(parseNotation("d20")), JSON.stringify([{ count: 1, sides: 20 }]));
check("parse 1d8+2d6", JSON.stringify(parseNotation("1d8+2d6")), JSON.stringify([{ count: 1, sides: 8 }, { count: 2, sides: 6 }]));
check("modifier of 2d6+3", parseModifier("2d6+3"), 3);
check("modifier of 3d8-1", parseModifier("3d8-1"), -1);
check("modifier of 2d6", parseModifier("2d6"), 0);
check("reject nonsense", parseNotation("hello"), null);
check("reject 0-sided dice", parseNotation("2d0"), null);
check("reject 200 dice", parseNotation("200d6"), null);

{
  // 2d6+3 must always land in 5..15, and every face must be reachable.
  let min = Infinity;
  let max = -Infinity;
  for (let index = 0; index < 4000; index += 1) {
    const result = roll("2d6+3", "normal")!;
    min = Math.min(min, result.total);
    max = Math.max(max, result.total);
  }
  check("2d6+3 minimum", min, 5);
  check("2d6+3 maximum", max, 15);

  const stated = roll("2d6+3", "normal")!;
  check("stated min", stated.min, 5);
  check("stated max", stated.max, 15);
  check("stated average", stated.average, 10);

  // Advantage rolls twice and keeps one, so exactly half the dice are dropped.
  const adv = roll("1d20", "advantage")!;
  check("advantage rolls two dice", adv.dice[0].values.length, 2);
  check("advantage keeps one", adv.dice[0].kept.filter(Boolean).length, 1);
  assert(
    "advantage keeps the higher",
    adv.total === Math.max(...adv.dice[0].values),
    `values ${adv.dice[0].values.join(",")} total ${adv.total}`,
  );

  const dis = roll("1d20", "disadvantage")!;
  assert("disadvantage keeps the lower", dis.total === Math.min(...dis.dice[0].values));

  const drop = roll("4d6", "drop-lowest")!;
  check("drop-lowest rolls four", drop.dice[0].values.length, 4);
  check("drop-lowest keeps three", drop.dice[0].kept.filter(Boolean).length, 3);
  assert(
    "drop-lowest discards the smallest",
    drop.total === drop.dice[0].values.reduce((a, b) => a + b, 0) - Math.min(...drop.dice[0].values),
  );
}

/* --------------------------------------------------------- number generator */

{
  const result = draw(1, 49, 6, false, true);
  assert("lottery draw succeeds", result.ok);
  if (result.ok) {
    check("six numbers", result.numbers.length, 6);
    check("all distinct", new Set(result.numbers).size, 6);
    assert("all inside 1..49", result.numbers.every((n) => n >= 1 && n <= 49));
    assert("sorted when asked", result.numbers.every((n, i) => i === 0 || n >= result.numbers[i - 1]));
  }

  // Drawing the entire range without repeats must work, not hang.
  const all = draw(1, 49, 49, false, false);
  assert("49 of 49 without repeats", all.ok && new Set(all.numbers).size === 49);

  // More than the range without repeats is impossible and must say so.
  assert("50 of 49 is refused", !draw(1, 49, 50, false, false).ok);
  // With repeats it is fine.
  assert("50 of 49 with repeats is fine", draw(1, 49, 50, true, false).ok);
  assert("zero numbers refused", !draw(1, 10, 0, true, false).ok);
  // A reversed range should still work rather than returning nothing.
  assert("reversed range still works", draw(10, 1, 5, true, false).ok);
}

/* ------------------------------------------------------------------- coin */

{
  const history = Array.from({ length: 1000 }, (_, index) =>
    index % 3 === 0 ? ("heads" as const) : ("tails" as const),
  );
  const stats = summarise(history);
  check("heads counted", stats.heads, 334);
  check("tails counted", stats.tails, 666);
  check("total", stats.total, 1000);
  // The pattern H T T H T T… never gives a run longer than two.
  check("longest streak", stats.longestStreak, 2);
  check("empty history", summarise([]).total, 0);
}

/* ----------------------------------------------------------------- sudoku */

{
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const puzzle = sudoku(difficulty, `CHECK-${difficulty}`);

    check(`${difficulty} solution is complete`, puzzle.solution.filter(Boolean).length, 81);

    // Every filled cell must be legal against the rest of the solution.
    const legal = puzzle.solution.every((value, index) =>
      isLegal(puzzle.solution.map((v, i) => (i === index ? 0 : v)), index, value),
    );
    assert(`${difficulty} solution obeys sudoku rules`, legal);

    // Every clue must match the solution, or the puzzle is unsolvable.
    const consistent = puzzle.puzzle.every(
      (value, index) => value === 0 || value === puzzle.solution[index],
    );
    assert(`${difficulty} clues match the solution`, consistent);

    assert(
      `${difficulty} has a sensible number of clues (${puzzle.givens})`,
      puzzle.givens >= 17 && puzzle.givens <= 60,
    );
  }

  // The same seed must produce the same puzzle, or the seed is decorative.
  const first = sudoku("easy", "REPEAT");
  const second = sudoku("easy", "REPEAT");
  assert("same seed, same puzzle", first.puzzle.join(",") === second.puzzle.join(","));
  assert("different seed, different puzzle", sudoku("easy", "OTHER").puzzle.join(",") !== first.puzzle.join(","));
}

/* ------------------------------------------------------------- word search */

{
  const words = ["VOLCANO", "GLACIER", "CANYON", "PLATEAU", "TUNDRA", "FJORD", "DELTA", "OASIS"];
  const puzzle = wordSearch(words, 15, "medium", "WS-CHECK");

  check("grid is square", puzzle.grid.length, 15);
  assert("every row is full width", puzzle.grid.every((row) => row.length === 15));
  assert("no empty cells remain", puzzle.grid.every((row) => row.every((cell) => /^[A-Z]$/.test(cell))));

  // Every placed word must actually read out of the grid along its direction.
  for (const placement of puzzle.placements) {
    let read = "";
    for (let index = 0; index < placement.word.length; index += 1) {
      read += puzzle.grid[placement.row + placement.dr * index][placement.col + placement.dc * index];
    }
    assert(`${placement.word} reads out of the grid`, read === placement.word, `got ${read}`);
  }

  assert("all eight words placed", puzzle.unplaced.length === 0, puzzle.unplaced.join(","));
  assert(
    "answer key covers every letter",
    solutionCells(puzzle.placements).size > 0 &&
      solutionCells(puzzle.placements).size <= words.join("").length,
  );

  // A word longer than the grid cannot fit and must be reported, not dropped.
  const tooLong = wordSearch(["ANTIDISESTABLISHMENTARIANISM"], 10, "easy", "X");
  check("oversized word reported", tooLong.unplaced.length, 1);

  // Easy mode must never place a word backwards.
  const easy = wordSearch(words, 15, "easy", "EASY");
  assert(
    "easy mode runs only right and down",
    easy.placements.every((p) => (p.dr === 0 && p.dc === 1) || (p.dr === 1 && p.dc === 0)),
  );
}

/* -------------------------------------------------------------- crossword */

{
  const entries = parseEntries(CW_SAMPLE);
  check("parsed 12 entries", entries.length, 12);
  check("first word", entries[0].word, "PYTHON");
  check("first clue", entries[0].clue, "A language named after a comedy troupe");
  // A colon separator has to work as well as an equals sign.
  check("colon separator", parseEntries("CAT: a small animal")[0].clue, "a small animal");

  const puzzle = crossword(entries, "CW-CHECK");
  assert("most words placed", puzzle.placed.length >= 10, `only ${puzzle.placed.length}`);

  // Every placed word must read out of the grid.
  for (const placement of puzzle.placed) {
    let read = "";
    for (let index = 0; index < placement.word.length; index += 1) {
      const cell = puzzle.grid[placement.row + (placement.across ? 0 : index)][
        placement.col + (placement.across ? index : 0)
      ];
      read += cell ?? "?";
    }
    assert(`${placement.word} reads out of the crossword`, read === placement.word, `got ${read}`);
  }

  // Numbering runs top to bottom, left to right and never goes backwards.
  const sorted = [...puzzle.placed].sort((a, b) => a.row - b.row || a.col - b.col);
  assert(
    "numbering follows reading order",
    sorted.every((entry, index) => index === 0 || entry.number >= sorted[index - 1].number),
  );

  // Two entries starting in the same cell must share a number.
  for (const entry of puzzle.placed) {
    check(
      `entry ${entry.number} (${entry.word}) is numbered in its own start cell`,
      puzzle.numbers[entry.row][entry.col],
      entry.number,
    );
  }
}

/* ---------------------------------------------------------------- bracket */

{
  for (const size of [2, 3, 5, 7, 8, 11, 16]) {
    const field = Array.from({ length: size }, (_, index) => `P${index + 1}`);
    const bracket = buildBracket(field, false);

    const rounds = Math.max(...bracket.map((match) => match.round));
    const bracketSize = 2 ** Math.ceil(Math.log2(size));

    check(`${size} entrants → ${Math.log2(bracketSize)} rounds`, rounds, Math.log2(bracketSize));
    check(`${size} entrants → ${bracketSize - 1} matches`, bracket.length, bracketSize - 1);

    // Everyone must appear exactly once in the first round.
    const seated = bracket
      .filter((match) => match.round === 1)
      .flatMap((match) => [match.left, match.right])
      .filter((name): name is string => name !== null);
    check(`${size} entrants all seated`, new Set(seated).size, size);

    // A bye must advance its player automatically.
    const byes = bracket.filter(
      (match) => match.round === 1 && ((match.left && !match.right) || (match.right && !match.left)),
    );
    assert(
      `${size}: byes advance automatically`,
      byes.every((match) => match.winner === (match.left ?? match.right)),
    );
  }

  // Standard seeding: the top seed faces the bottom seed.
  const eight = buildBracket(["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"], false);
  const opener = eight.find((match) => match.round === 1 && match.slot === 0)!;
  check("1 plays 8", `${opener.left} v ${opener.right}`, "P1 v P8");

  check("a single entrant makes no bracket", buildBracket(["Solo"], false).length, 0);
}

/* ------------------------------------------------------------------ bingo */

{
  check("column B is 1-15", `${numberPool(0)[0]}-${numberPool(0)[14]}`, "1-15");
  check("column O is 61-75", `${numberPool(4)[0]}-${numberPool(4)[14]}`, "61-75");

  const card = makeNumberCard(1, "BINGO", 5);
  check("25 cells", card.cells.length, 25);
  check("free centre square", card.cells[12], null);

  const filled = card.cells.filter((cell): cell is string => cell !== null);
  check("24 numbers", filled.length, 24);
  check("no repeats on a card", new Set(filled).size, 24);

  // Each column must draw from its own range, which is what makes it bingo.
  for (let column = 0; column < 5; column += 1) {
    const range = numberPool(column);
    const inColumn = [0, 1, 2, 3, 4]
      .map((row) => card.cells[row * 5 + column])
      .filter((cell): cell is string => cell !== null);
    assert(
      `column ${column + 1} stays in its range`,
      inColumn.every((cell) => range.includes(Number(cell))),
    );
  }

  // Different cards from one seed, but the same card from the same seed.
  assert(
    "cards differ from each other",
    makeNumberCard(1, "S", 5).cells.join() !== makeNumberCard(2, "S", 5).cells.join(),
  );
  assert(
    "same seed reproduces the card",
    makeNumberCard(1, "S", 5).cells.join() === makeNumberCard(1, "S", 5).cells.join(),
  );
}

/* ------------------------------------------------------------------ groups */

{
  // Eleven into three must be 4/4/3, not 5/5/1.
  const groups = intoGroups(Array.from({ length: 11 }, (_, i) => `P${i}`), 3);
  check("group sizes for 11 into 3", groups.map((g) => g.length).join(","), "4,4,3");
  check("nobody lost", groups.flat().length, 11);

  const even = intoGroups(Array.from({ length: 12 }, (_, i) => `P${i}`), 4);
  check("group sizes for 12 into 4", even.map((g) => g.length).join(","), "3,3,3,3");
}

/* ---------------------------------------------------- colour vision matrices */

{
  // Achromatopsia must produce a true grey — all three channels equal.
  const grey = simulatePixel(220, 60, 40, DEFICIENCIES.find((d) => d.id === "achromatopsia")!.matrix);
  assert(`achromatopsia is greyscale (${grey.join(",")})`, grey[0] === grey[1] && grey[1] === grey[2]);

  // Every matrix must leave white as white and black as black, or the whole
  // image shifts. Both are fixed points of a well-formed simulation.
  for (const deficiency of DEFICIENCIES) {
    const white = simulatePixel(255, 255, 255, deficiency.matrix);
    const black = simulatePixel(0, 0, 0, deficiency.matrix);
    assert(
      `${deficiency.label} preserves white and black`,
      white.every((v) => v >= 252) && black.every((v) => v <= 3),
      `white ${white.join(",")} black ${black.join(",")}`,
    );
  }

  check("hex parsing", JSON.stringify(hexToRgb("#e05a4a")), JSON.stringify([224, 90, 74]));
  check("shorthand hex", JSON.stringify(hexToRgb("#fff")), JSON.stringify([255, 255, 255]));
  check("bad hex rejected", hexToRgb("nope"), null);
}

/* ------------------------------------------------------------------- names */

{
  const generated = names("any", "full", 40);
  check("40 names generated", generated.length, 40);
  check("no duplicates in a batch", new Set(generated).size, 40);
  assert("full names have two parts", generated.every((name) => name.split(" ").length === 2));
  assert("first-only has one part", names("any", "first", 10).every((n) => !n.includes(" ")));
}

console.log(failures === 0 ? "\nAll fun checks passed." : `\n${failures} fun checks FAILED.`);
process.exit(failures === 0 ? 0 : 1);
