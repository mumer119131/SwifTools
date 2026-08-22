#!/usr/bin/env node
/**
 * Checks the six science calculators added after Search Console showed that
 * this category is what a new domain actually surfaces with.
 *
 * Formula tools have a specific failure mode: a rearrangement that is wrong
 * still returns a confident number. So every solver is checked by round trip —
 * solve for each variable in turn and confirm it reproduces the input — which
 * catches an algebra slip that spot values might not.
 *
 *   pnpm check:science-batch
 */

import process from "node:process";

import * as momentum from "@/tools/momentum-calculator/logic";
import * as gas from "@/tools/ideal-gas-law-calculator/logic";
import * as heat from "@/tools/specific-heat-calculator/logic";
import * as hooke from "@/tools/hookes-law-calculator/logic";
import * as torque from "@/tools/torque-calculator/logic";
import {
  calculate as network, formatOhms, nearestStandard, parallel, parseOhms, series,
} from "@/tools/resistor-network-calculator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

/**
 * Solves for every variable in turn from a known-consistent set, and checks
 * each comes back. A wrong rearrangement fails here even when the forward
 * direction is right.
 */
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

/* =========================================================== momentum */

console.log("Momentum");

{
  // p = mv: 1000 kg at 1.5 m/s is 1500 kg·m/s.
  roundTrip("momentum", momentum, { p: 1500, m: 1000, v: 1.5 });

  assert("p = mv", momentum.solve({ m: 2, v: 3 }, "p") === 6);
  assert("a zero velocity cannot give a mass", momentum.solve({ p: 10, v: 0 }, "m") === null);
  assert("a zero mass cannot give a velocity", momentum.solve({ p: 10, m: 0 }, "v") === null);
  assert("missing inputs return nothing", momentum.solve({ m: 2 }, "p") === null);

  const derived = momentum.derive({ p: 1500, m: 1000, v: 1.5 });
  assert("impulse equals momentum", derived[0].value === 1500);
  // KE = ½mv² = 0.5 * 1000 * 2.25 = 1125
  assert("kinetic energy is derived", near(derived[1].value, 1125));
  // Stopping in a tenth of the time needs ten times the force.
  const oneSecond = derived.find((d) => d.label.includes("1s"))!.value;
  const tenth = derived.find((d) => d.label.includes("0.1s"))!.value;
  assert(`stopping ten times faster needs ten times the force (${oneSecond} -> ${tenth})`,
    near(tenth, oneSecond * 10));
}

/* ========================================================== ideal gas */

console.log("\nIdeal gas law");

{
  // A mole at STP: 101325 Pa, 273.15 K, 0.0224 m³ — close to the textbook
  // molar volume of 22.4 litres.
  const V = (1 * gas.R * 273.15) / 101_325;
  roundTrip("gas", gas, { P: 101_325, V, n: 1, T: 273.15 });

  assert(`a mole at STP is ~22.4 litres (${(V * 1000).toFixed(2)} L)`, near(V * 1000, 22.41, 0.01));
  assert("R is the SI gas constant", near(gas.R, 8.3144626, 1e-6));

  // Doubling pressure at fixed temperature halves the volume — Boyle's law
  // falling out of the general equation.
  const halved = gas.solve({ n: 1, T: 273.15, P: 202_650 }, "V")!;
  assert(`doubling the pressure halves the volume (${(halved * 1000).toFixed(2)} L)`,
    near(halved, V / 2, 1e-9));

  // Doubling temperature doubles volume — Charles's law.
  const doubled = gas.solve({ n: 1, P: 101_325, T: 546.3 }, "V")!;
  assert("doubling the temperature doubles the volume", near(doubled, V * 2, 1e-9));

  assert("a zero volume cannot give a pressure", gas.solve({ n: 1, T: 273, V: 0 }, "P") === null);
  assert("a zero mole count cannot give a temperature", gas.solve({ P: 1, V: 1, n: 0 }, "T") === null);

  const rows = gas.derive({ P: 101_325, V: 0.0224, n: 1, T: 273.15 });
  assert("atmospheres are derived", near(rows.find((r) => r.unit === "atm")!.value, 1, 1e-4));
  assert("celsius is derived", near(rows.find((r) => r.unit === "°C")!.value, 0, 1e-9));
}

/* ======================================================= specific heat */

console.log("\nSpecific heat");

{
  // Heating 1 kg of water by 10 K takes 41,810 J.
  roundTrip("heat", heat, { Q: 41_810, m: 1, c: 4181, dT: 10 });

  assert("Q = mcΔT", heat.solve({ m: 2, c: 4181, dT: 5 }, "Q") === 41_810);
  assert("a zero temperature change cannot give a mass", heat.solve({ Q: 100, c: 4181, dT: 0 }, "m") === null);
  assert("a zero mass cannot give a capacity", heat.solve({ Q: 100, m: 0, dT: 10 }, "c") === null);

  const rows = heat.derive({ Q: 41_810 });
  assert("kilojoules are derived", near(rows[0].value, 41.81));
  // A 3 kW kettle takes about 14 seconds to do this.
  assert(`kettle time is derived (${rows[3].value.toFixed(1)}s)`, near(rows[3].value, 13.94, 0.01));

  assert("water is the highest common capacity",
    heat.MATERIALS.every((m) => m.c <= heat.MATERIALS[0].c));
  assert("every material has a positive capacity", heat.MATERIALS.every((m) => m.c > 0));
}

/* ========================================================= Hooke's law */

console.log("\nHooke's law");

{
  roundTrip("hooke", hooke, { F: 20, k: 100, x: 0.2 });

  assert("F = kx", hooke.solve({ k: 100, x: 0.2 }, "F") === 20);
  assert("a zero extension cannot give a constant", hooke.solve({ F: 20, x: 0 }, "k") === null);

  const rows = hooke.derive({ F: 20, k: 100, x: 0.2 });
  // Energy is ½kx² = 0.5 * 100 * 0.04 = 2 J. Fx would give 4, which is the
  // mistake this assertion exists to catch.
  assert(`stored energy is 2 J, not 4 (${rows[0].value})`, near(rows[0].value, 2));
  assert("the equivalent hanging mass is derived", near(rows[1].value, 20 / 9.80665, 1e-6));
}

/* ============================================================= torque */

console.log("\nTorque");

{
  roundTrip("torque", torque, { T: 50, F: 200, r: 0.25 });

  assert("τ = Fr", torque.solve({ F: 200, r: 0.25 }, "T") === 50);
  assert("a zero lever arm cannot give a force", torque.solve({ T: 50, r: 0 }, "F") === null);

  const rows = torque.derive({ T: 50 });
  assert("pound-feet are derived", near(rows[0].value, 36.878, 0.001));

  // A perpendicular force gives full torque; along the arm it gives none.
  assert("a perpendicular force is full torque", near(torque.withAngle(200, 0.25, 90), 50, 1e-9));
  assert("a force along the arm gives no torque", near(torque.withAngle(200, 0.25, 0), 0, 1e-9));
  assert("45 degrees gives 1/√2 of it", near(torque.withAngle(200, 0.25, 45), 50 / Math.SQRT2, 1e-9));
}

/* =================================================== resistor networks */

console.log("\nResistor networks");

{
  assert("series adds", series([100, 220, 330]) === 650);
  // Two equal resistors in parallel halve.
  assert("two equal resistors in parallel halve", parallel([100, 100]) === 50);
  assert("three equal thirds", near(parallel([300, 300, 300]), 100));
  // The property people find counterintuitive.
  assert("parallel is always below the smallest",
    parallel([100, 220, 330]) < 100, String(parallel([100, 220, 330])));
  assert("a single resistor is itself, either way",
    series([470]) === 470 && parallel([470]) === 470);
  // A zero-ohm path shorts the network; that is a real answer, not an error.
  assert("a zero-ohm resistor shorts a parallel network", parallel([0, 100]) === 0);
  assert("an empty set is zero", parallel([]) === 0 && series([]) === 0);

  // 100 || 220 = 68.75
  assert(`100 and 220 in parallel is 68.75 (${parallel([100, 220]).toFixed(2)})`,
    near(parallel([100, 220]), 68.75, 1e-9));

  // Standard values.
  assert("4700 is already standard", nearestStandard(4700) === 4700);
  assert("4650 rounds to 4700", nearestStandard(4650) === 4700);
  assert("68.75 rounds to 68", nearestStandard(68.75) === 68, String(nearestStandard(68.75)));
  assert("1 megohm survives", nearestStandard(1_000_000) === 1_000_000);
  assert("zero returns zero", nearestStandard(0) === 0);

  // Series: same current, voltage divides in proportion.
  const inSeries = network([100, 200], "series", 12)!;
  assert("series total is 300", inSeries.total === 300);
  assert("current is 40 mA", near(inSeries.current!, 0.04, 1e-9));
  assert("the larger resistor takes more voltage",
    inSeries.shares[1].voltage! > inSeries.shares[0].voltage!);
  assert("the shares add to the supply",
    near(inSeries.shares[0].voltage! + inSeries.shares[1].voltage!, 12, 1e-9));
  assert("every resistor carries the same current",
    near(inSeries.shares[0].current!, inSeries.shares[1].current!, 1e-9));

  // Parallel: same voltage, current divides inversely.
  const inParallel = network([100, 200], "parallel", 12)!;
  assert(`parallel total is 66.67 (${inParallel.total.toFixed(2)})`, near(inParallel.total, 200 / 3, 1e-9));
  assert("every resistor sees the full voltage",
    inParallel.shares.every((s) => near(s.voltage!, 12, 1e-9)));
  assert("the smaller resistor takes more current",
    inParallel.shares[0].current! > inParallel.shares[1].current!);
  assert("the branch currents add to the total",
    near(inParallel.shares[0].current! + inParallel.shares[1].current!, inParallel.current!, 1e-9));

  // Power must balance either way.
  for (const arrangement of ["series", "parallel"] as const) {
    const result = network([100, 220, 330], arrangement, 9)!;
    const summed = result.shares.reduce((total, share) => total + (share.power ?? 0), 0);
    assert(`${arrangement}: the parts dissipate the whole (${summed.toFixed(4)} vs ${result.power!.toFixed(4)})`,
      near(summed, result.power!, 1e-9));
  }

  assert("no voltage means no current or power",
    network([100], "series", null)!.current === null);
  assert("an empty network returns nothing", network([], "series", 12) === null);

  // Schematic notation.
  assert("470 parses", parseOhms("470") === 470);
  assert("2.2k parses", parseOhms("2.2k") === 2200);
  assert("4k7 parses", parseOhms("4k7") === 4700);
  assert("1M parses", parseOhms("1M") === 1_000_000);
  assert("1m5 parses", parseOhms("1m5") === 1_500_000);
  assert("ohms suffix is stripped", parseOhms("330 ohms") === 330);
  assert("nonsense is refused", parseOhms("abc") === null);
  assert("empty is refused", parseOhms("") === null);
  assert("negatives are refused", parseOhms("-100") === null);

  assert("formatting uses kilohms", formatOhms(4700) === "4.7 kΩ");
  assert("and megohms", formatOhms(1_000_000) === "1 MΩ");
  assert("and plain ohms", formatOhms(470) === "470 Ω");
}

console.log(
  failures === 0
    ? "\nScience batch checks passed — every solver round-trips."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
