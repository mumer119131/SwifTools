#!/usr/bin/env node
/**
 * Checks the second science batch.
 *
 * Same principle as the first: every solver is verified by round trip, because
 * a wrong rearrangement still returns a confident number. The projectile,
 * statistics and decibel tools carry their own traps — a launch height turns
 * the flight time into a quadratic, sample and population variance differ by
 * one in the divisor, and decibels use 10log for power and 20log for
 * amplitude.
 *
 *   pnpm check:science-batch2
 */

import process from "node:process";

import * as dilution from "@/tools/dilution-calculator/logic";
import * as gravity from "@/tools/gravitational-force-calculator/logic";
import * as work from "@/tools/work-done-calculator/logic";
import { G, GRAVITIES, calculate as projectile, optimalAngle } from "@/tools/projectile-motion-calculator/logic";
import { calculate as stats, distribution, parseNumbers } from "@/tools/standard-deviation-calculator/logic";
import {
  LANDMARKS, atDistance, combine, decibelsToRatio, factor, nearestLandmark, ratioToDecibels,
} from "@/tools/decibel-calculator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

function roundTrip(
  name: string,
  module: {
    variables: { id: string }[];
    solve: (values: Record<string, number>, target: string) => number | null;
  },
  known: Record<string, number>,
): void {
  for (const { id } of module.variables) {
    const others = { ...known };
    delete others[id];
    const got = module.solve(others, id);
    assert(
      `${name}: solving for ${id} recovers ${known[id]}`,
      got !== null && near(got, known[id], 1e-9),
      `got ${got}`,
    );
  }
}

/* =========================================================== dilution */

console.log("Dilution");

{
  // C1V1 = C2V2: 25 mL of 2M diluted to 100 mL gives 0.5M.
  roundTrip("dilution", dilution, { C1: 2, V1: 25, C2: 0.5, V2: 100 });

  assert("25 mL of 2M to 100 mL is 0.5M",
    near(dilution.solve({ C1: 2, V1: 25, V2: 100 }, "C2")!, 0.5, 1e-9));
  assert("a zero final volume cannot give a concentration",
    dilution.solve({ C1: 2, V1: 25, V2: 0 }, "C2") === null);

  const rows = dilution.derive({ C1: 2, V1: 25, C2: 0.5, V2: 100 });
  assert("solvent to add is the difference", rows[0].value === 75);
  assert("the dilution factor is 4", near(rows[1].value, 4, 1e-9));
}

/* ================================================== gravitational force */

console.log("\nGravitational force");

{
  // Earth and Moon: about 1.98e20 N at their mean separation.
  const F = (gravity.G * 5.972e24 * 7.348e22) / (3.844e8 ** 2);
  roundTrip("gravity", gravity, { F, m1: 5.972e24, m2: 7.348e22, r: 3.844e8 });

  assert(`Earth–Moon force is ~1.98e20 N (${F.toExponential(2)})`, near(F, 1.98e20, 0.02));
  assert("G is the gravitational constant", near(gravity.G, 6.6743e-11, 1e-6));

  // Inverse square: doubling the distance quarters the force.
  const base = gravity.solve({ m1: 1e10, m2: 1e10, r: 100 }, "F")!;
  const doubled = gravity.solve({ m1: 1e10, m2: 1e10, r: 200 }, "F")!;
  assert(`doubling the distance quarters the force (${(base / doubled).toFixed(3)}×)`,
    near(base / doubled, 4, 1e-9));

  assert("a zero distance is refused", gravity.solve({ m1: 1, m2: 1, r: 0 }, "F") === null);
  assert("a zero force cannot give a distance", gravity.solve({ F: 0, m1: 1, m2: 1 }, "r") === null);
  assert("every listed body has a positive mass", gravity.BODIES.every((b) => b.mass > 0));
}

/* =============================================================== work */

console.log("\nWork done");

{
  roundTrip("work", work, { W: 500, F: 100, d: 5 });

  assert("W = Fd", work.solve({ F: 100, d: 5 }, "W") === 500);
  assert("a zero distance cannot give a force", work.solve({ W: 500, d: 0 }, "F") === null);

  // Only the component along the motion does work.
  assert("a force along the motion does full work", near(work.withAngle(100, 5, 0), 500, 1e-9));
  assert("a perpendicular force does none", near(work.withAngle(100, 5, 90), 0, 1e-9));
  assert("a backwards force does negative work", work.withAngle(100, 5, 180) < 0);
}

/* ==================================================== projectile motion */

console.log("\nProjectile motion");

{
  // Launched and landing at the same height, the flight time is 2v_y/g.
  const flat = projectile({ speed: 20, angle: 45, height: 0, gravity: G })!;
  const expectedTime = (2 * 20 * Math.sin(Math.PI / 4)) / G;
  assert(`flat launch flight time is ${expectedTime.toFixed(3)}s (${flat.flightTime.toFixed(3)})`,
    near(flat.flightTime, expectedTime, 1e-9));
  // Range at 45 degrees from ground level is v²/g.
  assert(`range is v²/g (${flat.range.toFixed(2)} m)`, near(flat.range, (20 * 20) / G, 1e-9));
  assert("apex is half the flight", near(flat.timeToApex, flat.flightTime / 2, 1e-9));
  // Symmetry: landing speed equals launch speed when heights match.
  assert("it lands at the speed it left", near(flat.impactSpeed, 20, 1e-9));
  assert("and at the same angle", near(flat.impactAngle, 45, 1e-6));

  // 45 degrees is the maximum range only from ground level.
  const angles = [30, 40, 45, 50, 60].map((angle) => ({
    angle,
    range: projectile({ speed: 20, angle, height: 0, gravity: G })!.range,
  }));
  const best = angles.reduce((a, b) => (b.range > a.range ? b : a));
  assert(`45 degrees gives the greatest range from the ground (${best.angle})`, best.angle === 45);
  assert("optimal angle from the ground is 45", near(optimalAngle(20, 0), 45, 1e-9));
  // From a height, the optimum drops below 45.
  assert(`from 10 m the optimum is below 45 (${optimalAngle(20, 10).toFixed(1)})`,
    optimalAngle(20, 10) < 45);

  // A launch height makes the flight longer and the landing faster.
  const raised = projectile({ speed: 20, angle: 45, height: 10, gravity: G })!;
  assert("a raised launch stays airborne longer", raised.flightTime > flat.flightTime);
  assert("and travels further", raised.range > flat.range);
  assert("and lands faster", raised.impactSpeed > flat.impactSpeed);
  assert("max height includes the launch height", raised.maxHeight > flat.maxHeight);

  // Lower gravity, longer flight.
  const moon = projectile({ speed: 20, angle: 45, height: 0, gravity: 1.62 })!;
  assert("the Moon gives a much longer range", moon.range > flat.range * 5);

  assert("the path starts at the launch height", near(flat.path[0].y, 0, 1e-9));
  assert("and ends on the ground", near(flat.path[flat.path.length - 1].y, 0, 1e-6));
  assert("the path never dips below ground", flat.path.every((p) => p.y >= 0));

  assert("zero speed is refused", projectile({ speed: 0, angle: 45, height: 0, gravity: G }) === null);
  assert("an impossible angle is refused", projectile({ speed: 20, angle: 120, height: 0, gravity: G }) === null);
  assert("every listed gravity is positive", GRAVITIES.every((g) => g.value > 0));
}

/* ================================================ standard deviation */

console.log("\nStandard deviation");

{
  // A worked textbook example: 2,4,4,4,5,5,7,9 has a population SD of exactly 2.
  const values = [2, 4, 4, 4, 5, 5, 7, 9];
  const population = stats(values, "population")!;

  assert(`population SD of the textbook set is 2 (${population.standardDeviation})`,
    near(population.standardDeviation, 2, 1e-9));
  assert("mean is 5", near(population.mean, 5, 1e-9));
  assert("variance is 4", near(population.variance, 4, 1e-9));
  assert("median is 4.5", near(population.median, 4.5, 1e-9));
  assert("mode is 4", population.mode.join() === "4");
  assert("range is 7", population.range === 7);
  assert("sum is 40", population.sum === 40);

  // Bessel's correction: sample divides by n−1, so it is always larger.
  const sample = stats(values, "sample")!;
  assert(`sample SD exceeds population (${sample.standardDeviation.toFixed(4)} vs 2)`,
    sample.standardDeviation > population.standardDeviation);
  assert("and by exactly the Bessel factor",
    near(sample.variance, (population.variance * 8) / 7, 1e-9));

  assert("a single value has no sample SD", stats([5], "sample") === null);
  assert("but has a population SD of zero", stats([5], "population")!.standardDeviation === 0);
  assert("an empty list returns nothing", stats([], "population") === null);
  assert("identical values have no spread", stats([3, 3, 3], "population")!.standardDeviation === 0);
  assert("no mode when nothing repeats", stats([1, 2, 3], "population")!.mode.length === 0);

  // Quartiles and outliers.
  const withOutlier = stats([1, 2, 3, 4, 5, 6, 7, 8, 100], "population")!;
  assert("an obvious outlier is caught", withOutlier.outliers.includes(100));
  assert("and ordinary values are not", !withOutlier.outliers.includes(5));
  assert("the IQR is the quartile gap", near(withOutlier.iqr, withOutlier.q3 - withOutlier.q1, 1e-9));

  assert("standard error shrinks with n",
    stats([1, 2, 3, 4], "sample")!.standardError < stats([1, 2, 3, 4], "sample")!.standardDeviation);

  // Parsing whatever people paste.
  assert("commas parse", parseNumbers("1,2,3").join() === "1,2,3");
  assert("spaces parse", parseNumbers("1 2 3").join() === "1,2,3");
  assert("newlines parse", parseNumbers("1\n2\n3").join() === "1,2,3");
  assert("mixed separators parse", parseNumbers("1, 2;3\n4").join() === "1,2,3,4");
  assert("decimals and negatives parse", parseNumbers("-1.5, 2.25").join() === "-1.5,2.25");
  assert("junk is dropped", parseNumbers("1, abc, 3").join() === "1,3");
  assert("an empty string gives nothing", parseNumbers("   ").length === 0);

  const spread = distribution(population);
  assert("three sigma bands are reported", spread.length === 3);
  assert("the bands are nested", spread[0].count <= spread[1].count && spread[1].count <= spread[2].count);
  assert("normal expectations are quoted", near(spread[0].expected, 68.27, 0.01));
}

/* ============================================================ decibels */

console.log("\nDecibels");

{
  assert("power uses 10 log", factor("power") === 10);
  assert("amplitude uses 20 log", factor("amplitude") === 20);

  // Doubling power is +3 dB; doubling amplitude is +6 dB.
  assert(`double power is +3 dB (${ratioToDecibels(2, "power")!.toFixed(2)})`,
    near(ratioToDecibels(2, "power")!, 3.0103, 0.001));
  assert(`double amplitude is +6 dB (${ratioToDecibels(2, "amplitude")!.toFixed(2)})`,
    near(ratioToDecibels(2, "amplitude")!, 6.0206, 0.001));
  assert("ten times power is exactly 10 dB", near(ratioToDecibels(10, "power")!, 10, 1e-9));
  assert("ten times amplitude is exactly 20 dB", near(ratioToDecibels(10, "amplitude")!, 20, 1e-9));
  assert("a ratio of one is 0 dB", ratioToDecibels(1, "power") === 0);

  // Round trip both ways.
  for (const quantity of ["power", "amplitude"] as const) {
    const back = decibelsToRatio(ratioToDecibels(7.5, quantity)!, quantity)!;
    assert(`${quantity} ratios round-trip (${back.toFixed(4)})`, near(back, 7.5, 1e-9));
  }

  assert("a zero ratio has no decibel value", ratioToDecibels(0, "power") === null);
  assert("a negative ratio has none either", ratioToDecibels(-2, "power") === null);

  // Two equal sources add 3 dB, not double the number.
  assert(`two 60 dB sources give 63 dB (${combine([60, 60])!.toFixed(2)})`,
    near(combine([60, 60])!, 63.0103, 0.001));
  assert("ten equal sources add 10 dB", near(combine(Array(10).fill(60))!, 70, 1e-9));
  // A much quieter source barely matters.
  assert("a 40 dB source adds almost nothing to 80 dB",
    near(combine([80, 40])!, 80, 0.001));
  assert("an empty set returns nothing", combine([]) === null);

  // Inverse square: 6 dB lost per doubling of distance.
  assert(`doubling the distance loses 6 dB (${atDistance(100, 1, 2)!.toFixed(2)})`,
    near(atDistance(100, 1, 2)!, 93.9794, 0.001));
  assert("ten times the distance loses 20 dB", near(atDistance(100, 1, 10)!, 80, 1e-9));
  assert("halving the distance gains 6 dB", near(atDistance(100, 2, 1)!, 106.0206, 0.001));
  assert("a zero distance is refused", atDistance(100, 1, 0) === null);

  assert("landmarks ascend", LANDMARKS.every((l, i) => i === 0 || l.db > LANDMARKS[i - 1].db));
  assert("a conversation is found", nearestLandmark(61).label === "Normal conversation");
  assert("the damage threshold is flagged",
    LANDMARKS.find((l) => l.db === 85)!.note!.includes("damage"));
}

console.log(
  failures === 0
    ? "\nSecond science batch passed — every solver round-trips."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
