#!/usr/bin/env node
/**
 * Checks the everyday-life batch: sleep, fuel, oven, subscriptions, heart rate.
 *
 * Three of these have a unit trap that produces a plausible wrong answer rather
 * than an error — MPG and L/100km are reciprocals so converting is a division;
 * a US gallon and an imperial gallon differ by 21%; and a fan oven needs a
 * lower dial than the recipe says. None of those throw.
 *
 *   pnpm check:daily
 */

import process from "node:process";

import {
  CYCLE_MINUTES, bedtimesFor, formatSleep, formatTime, parseTime, wakeTimesFor,
} from "@/tools/sleep-calculator/logic";
import {
  annualComparison, calculate as fuelCost, fromL100km, litresPer, toL100km,
} from "@/tools/fuel-cost-calculator/logic";
import {
  FAN_REDUCTION, TABLE, convert, fanTimeAdjustment, toConventionalCelsius,
} from "@/tools/oven-temperature-converter/logic";
import {
  PER_YEAR, STARTERS, annualCost, totals, type Subscription,
} from "@/tools/subscription-tracker/logic";
import { calculateZones, formulaDifference, maxHeartRate } from "@/tools/heart-rate-zones/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) < tol;

/* ============================================================== sleep */

console.log("Sleep");

{
  assert("7am parses", parseTime("7am") === 420);
  assert("07:00 parses", parseTime("07:00") === 420);
  assert("10:45pm parses", parseTime("10:45pm") === 1365);
  assert("12am is midnight", parseTime("12am") === 0);
  assert("12pm is noon", parseTime("12pm") === 720);
  assert("rejects 25:00", parseTime("25:00") === null);

  assert("formats 24h", formatTime(1365) === "22:45");
  assert("formats 12h", formatTime(1365, "12") === "10:45pm");
  assert("midnight in 12h reads as 12", formatTime(0, "12") === "12:00am");

  // Waking at 07:00 after six cycles: 9h sleep + 15m to fall asleep = 21:45.
  const beds = bedtimesFor(420);
  assert(`six cycles before 7am is 21:45 (${formatTime(beds[0].minutes)})`,
    formatTime(beds[0].minutes) === "21:45");
  assert("cycles are counted down from six", beds.map((b) => b.cycles).join() === "6,5,4,3");
  assert("five and six cycles are the recommended ones",
    beds.filter((b) => b.recommended).map((b) => b.cycles).join() === "6,5");

  // Crossing midnight must wrap rather than go negative.
  const early = bedtimesFor(parseTime("5am")!);
  assert(`a 5am wake wraps to the previous evening (${formatTime(early[0].minutes)})`,
    formatTime(early[0].minutes) === "19:45");
  assert("no bedtime is negative", early.every((b) => b.minutes >= 0 && b.minutes < 1440));

  // Going to bed at 23:00: +15m, then cycles.
  const wakes = wakeTimesFor(parseTime("23:00")!);
  assert(`bed at 23:00, five cycles wakes at 06:45 (${formatTime(wakes[2].minutes)})`,
    formatTime(wakes[2].minutes) === "06:45");
  assert("wake times cross midnight correctly", wakes.every((w) => w.minutes >= 0 && w.minutes < 1440));

  assert("a cycle is 90 minutes", CYCLE_MINUTES === 90);
  assert("sleep is described in hours", formatSleep(450) === "7h 30m" && formatSleep(540) === "9h");
}

/* =============================================================== fuel */

console.log("\nFuel");

{
  // Published equivalences.
  assert(`40 mpg (imperial) is 7.06 L/100km (${toL100km(40, "mpg-uk")!.toFixed(2)})`,
    near(toL100km(40, "mpg-uk")!, 7.06, 0.02));
  assert(`40 mpg (US) is 5.88 L/100km (${toL100km(40, "mpg-us")!.toFixed(2)})`,
    near(toL100km(40, "mpg-us")!, 5.88, 0.02));

  // The two gallons differ by about 20%, which is far too much to ignore.
  const gap = toL100km(40, "mpg-uk")! / toL100km(40, "mpg-us")!;
  assert(`imperial and US mpg differ by ~20% (${((gap - 1) * 100).toFixed(0)}%)`, near(gap, 1.2, 0.01));

  assert("10 km/L is 10 L/100km", near(toL100km(10, "kml")!, 10, 0.001));
  assert("L/100km passes through", toL100km(7.5, "l100km") === 7.5);
  assert("zero economy is rejected", toL100km(0, "mpg-uk") === null);
  assert("negative economy is rejected", toL100km(-5, "mpg-uk") === null);

  // Every unit must round-trip.
  for (const unit of ["mpg-uk", "mpg-us", "l100km", "kml"] as const) {
    const l100 = toL100km(45, unit)!;
    assert(`${unit} round-trips (${fromL100km(l100, unit).toFixed(2)})`, near(fromL100km(l100, unit), 45, 0.01));
  }

  assert("an imperial gallon is 4.546 L", near(litresPer("gallon-uk"), 4.54609, 0.001));
  assert("a US gallon is 3.785 L", near(litresPer("gallon-us"), 3.78541, 0.001));

  // 100 km at 8 L/100km is 8 litres; at £1.50/L that is £12.
  const trip = fuelCost({
    distance: 100, distanceUnit: "km", economy: 8, economyUnit: "l100km",
    price: 1.5, priceUnit: "litre", people: 1,
  })!;
  assert(`100km at 8L/100km uses 8 litres (${trip.litres.toFixed(2)})`, near(trip.litres, 8, 0.001));
  assert(`and costs 12.00 (${trip.cost.toFixed(2)})`, near(trip.cost, 12, 0.001));
  assert("the return trip is double", near(trip.returnCost, 24, 0.001));

  const shared = fuelCost({
    distance: 100, distanceUnit: "km", economy: 8, economyUnit: "l100km",
    price: 1.5, priceUnit: "litre", people: 4,
  })!;
  assert("splitting four ways gives 3.00", near(shared.perPerson, 3, 0.001));
  assert("splitting does not change the total", near(shared.cost, 12, 0.001));

  // A price per gallon must be converted before multiplying.
  const perGallon = fuelCost({
    distance: 100, distanceUnit: "mi", economy: 30, economyUnit: "mpg-us",
    price: 3.5, priceUnit: "gallon-us", people: 1,
  })!;
  // 100 miles at 30 mpg = 3.333 gallons at $3.50 = $11.67
  assert(`100mi at 30mpg US costs 11.67 (${perGallon.cost.toFixed(2)})`, near(perGallon.cost, 11.67, 0.02));

  // The reciprocal point: a small mpg gain at the bottom saves more fuel than
  // a large one at the top.
  const lowEnd = annualComparison(20, 25, "mpg-uk", 10000, "mi", 1.5)!;
  const highEnd = annualComparison(40, 50, "mpg-uk", 10000, "mi", 1.5)!;
  assert(
    `20->25 mpg saves more than 40->50 (${lowEnd.saving.toFixed(0)} vs ${highEnd.saving.toFixed(0)})`,
    lowEnd.saving > highEnd.saving * 1.9,
  );
}

/* =============================================================== oven */

console.log("\nOven");

{
  assert("180C is gas 4", convert(180, "c")!.gas === 4);
  assert("200C is gas 6", convert(200, "c")!.gas === 6);
  assert("220C is gas 7", convert(220, "c")!.gas === 7);
  assert("350F is 180C", near(convert(350, "f")!.celsius, 176.67, 0.1));
  assert("gas 4 is 180C", convert(4, "gas")!.celsius === 180);
  assert("gas 6 is 200C", convert(6, "gas")!.celsius === 200);

  // The whole point of the tool.
  const conventional = convert(200, "c")!;
  assert(`200C conventional is 180C fan (${conventional.fanCelsius})`, conventional.fanCelsius === 180);
  assert("the fan reduction is 20C", FAN_REDUCTION === 20);

  // Entering a fan temperature must work the other way round.
  const fan = convert(180, "fan")!;
  assert(`180C fan means a 200C recipe (${fan.celsius})`, fan.celsius === 200);
  assert("and gas 6", fan.gas === 6);

  assert("standard rows are flagged as standard", convert(180, "c")!.standard);
  assert("in-between values are not", !convert(185, "c")!.standard);
  assert("an in-between value still gets a nearest row", convert(185, "c")!.nearest !== null);

  assert("negative temperatures are rejected", convert(-10, "c") === null);
  assert("the table is ascending", TABLE.every((row, i) => i === 0 || row.celsius > TABLE[i - 1].celsius));
  assert("every row has a gas mark", TABLE.every((row) => row.gas !== null));
  assert("every row's fan value is 20 lower", TABLE.every((row) => row.fanCelsius === row.celsius - 20));

  assert("gas marks interpolate", near(toConventionalCelsius(4.5, "gas")!, 185, 0.5));
  // The other half of the fan adjustment.
  assert("a fan oven needs about three quarters of the time", fanTimeAdjustment(60) === 45);
}

/* ====================================================== subscriptions */

console.log("\nSubscriptions");

{
  // A year is 365.25 days, so weekly is not 52 payments.
  assert(`weekly is 52.18 payments a year (${PER_YEAR.weekly.toFixed(2)})`, near(PER_YEAR.weekly, 52.18, 0.01));
  assert("monthly is 12", PER_YEAR.monthly === 12);
  assert("quarterly is 4", PER_YEAR.quarterly === 4);
  assert("yearly is 1", PER_YEAR.yearly === 1);

  const monthly: Subscription = { id: "a", name: "x", amount: 10, cycle: "monthly", active: true };
  assert("10/month is 120/year", annualCost(monthly) === 120);

  const yearly: Subscription = { id: "b", name: "y", amount: 120, cycle: "yearly", active: true };
  assert("120/year is 120/year", annualCost(yearly) === 120);
  assert("the two are equivalent", annualCost(monthly) === annualCost(yearly));

  const summary = totals(STARTERS);
  // 10.99*12 + 11.99*12 + 24.99 = 131.88 + 143.88 + 24.99
  assert(`the starters total 300.75 (${summary.annual.toFixed(2)})`, near(summary.annual, 300.75, 0.01));
  assert("monthly is a twelfth", near(summary.monthly, summary.annual / 12, 0.001));
  assert("all three start active", summary.active === 3 && summary.inactive === 0);
  assert("the largest is identified", summary.largest?.name === "Music");
  assert("categories are ranked", summary.byCategory[0].annual >= summary.byCategory[1].annual);
  assert("category shares sum to one", near(summary.byCategory.reduce((n, c) => n + c.share, 0), 1, 0.001));

  // Deactivating excludes from the total but keeps the row.
  const withCancelled = totals(STARTERS.map((s, i) => (i === 1 ? { ...s, active: false } : s)));
  assert("an inactive line is excluded", near(withCancelled.annual, 156.87, 0.01));
  assert("and counted as a saving", near(withCancelled.potentialInactiveSaving, 143.88, 0.01));
  assert("and still counted as a row", withCancelled.inactive === 1);

  assert("an empty list totals zero", totals([]).annual === 0);
  assert("a negative amount contributes nothing",
    annualCost({ id: "c", name: "z", amount: -5, cycle: "monthly", active: true }) === 0);
}

/* ========================================================= heart rate */

console.log("\nHeart rate");

{
  assert("Haskell at 40 is 180", maxHeartRate(40, "haskell") === 180);
  assert(`Tanaka at 40 is 180 (${maxHeartRate(40, "tanaka")})`, near(maxHeartRate(40, "tanaka")!, 180, 0.01));
  /*
   * The two formulas cross at 40 and diverge in opposite directions either
   * side, which is the whole reason Tanaka is preferred: 220 − age
   * overestimates the maximum for young people and underestimates it for older
   * ones. At 20 Tanaka gives 194 against Haskell's 200; at 60 it gives 166
   * against 160.
   */
  assert(`at 20 Tanaka is 6 lower (${formulaDifference(20)})`, formulaDifference(20) === -6);
  assert(`at 60 Tanaka is 6 higher (${formulaDifference(60)})`, formulaDifference(60) === 6);
  assert("they cross at 40", formulaDifference(40) === 0);
  assert("Tanaka at 20 is 194", maxHeartRate(20, "tanaka") === 194);
  assert("Tanaka at 60 is 166", maxHeartRate(60, "tanaka") === 166);

  assert("an absurd age is rejected", maxHeartRate(200, "tanaka") === null);
  assert("a measured max is used as given", maxHeartRate(40, "measured", 195) === 195);
  assert("a missing measured max is rejected", maxHeartRate(40, "measured") === null);

  // Without a resting rate: straight percentage of max.
  const plain = calculateZones(40, "haskell", null)!;
  assert("percentage method without a resting rate", plain.method === "percentage");
  assert("five zones", plain.zones.length === 5);
  assert(`zone 2 of 180 is 108-126 (${plain.zones[1].low}-${plain.zones[1].high})`,
    plain.zones[1].low === 108 && plain.zones[1].high === 126);
  assert("zones are contiguous", plain.zones.every((z, i) => i === 0 || z.low === plain.zones[i - 1].high));

  // With a resting rate: Karvonen, which gives higher numbers.
  const karvonen = calculateZones(40, "haskell", 60)!;
  assert("Karvonen when a resting rate is given", karvonen.method === "karvonen");
  assert("reserve is max minus resting", karvonen.reserve === 120);
  // 60 + 120*0.6 = 132
  assert(`zone 2 low is 132 (${karvonen.zones[1].low})`, karvonen.zones[1].low === 132);
  assert("Karvonen zones sit above percentage zones", karvonen.zones[1].low > plain.zones[1].low);
  assert("the top of zone 5 is the max", karvonen.zones[4].high === karvonen.max);

  // A nonsense resting rate must be ignored rather than producing nonsense.
  assert("a resting rate above max is ignored", calculateZones(40, "haskell", 250)!.method === "percentage");
  assert("an implausibly low resting rate is ignored", calculateZones(40, "haskell", 10)!.method === "percentage");
}

console.log(
  failures === 0
    ? "\nDaily-life tool checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
