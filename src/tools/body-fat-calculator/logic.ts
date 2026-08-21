/**
 * Body fat percentage from tape measurements.
 *
 * The US Navy method, which is the one worth implementing: it needs only a tape
 * measure, and its published accuracy is around ±3–4% against hydrostatic
 * weighing. That is genuinely useful for tracking a direction over months, and
 * genuinely not precise enough to agonise over a single reading.
 *
 * The BMI-derived estimate is offered alongside because people ask for it, with
 * the honest note that it cannot distinguish muscle from fat and so misreads
 * anyone muscular quite badly.
 */

export type Sex = "male" | "female";
export type Units = "metric" | "imperial";

export interface Measurements {
  sex: Sex;
  units: Units;
  height: number;
  /** At the navel. */
  waist: number;
  neck: number;
  /** Widest point. Required for the female formula only. */
  hip?: number;
  weight?: number;
  age?: number;
}

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

function toCm(value: number, units: Units): number {
  return units === "metric" ? value : value * CM_PER_INCH;
}

function toKg(value: number, units: Units): number {
  return units === "metric" ? value : value * KG_PER_LB;
}

export interface Category {
  label: string;
  range: string;
  tone: "low" | "good" | "raised" | "high";
}

/**
 * The commonly published ranges, which differ by sex.
 *
 * Essential fat is what the body requires to function — below it is a medical
 * concern rather than an achievement, which is worth saying on a page people
 * arrive at with a target in mind.
 */
export function categorise(percent: number, sex: Sex): Category {
  const bands: [number, Category][] =
    sex === "male"
      ? [
          [6, { label: "Essential fat", range: "2–5%", tone: "low" }],
          [14, { label: "Athletic", range: "6–13%", tone: "good" }],
          [18, { label: "Fitness", range: "14–17%", tone: "good" }],
          [25, { label: "Average", range: "18–24%", tone: "raised" }],
          [Infinity, { label: "Above average", range: "25%+", tone: "high" }],
        ]
      : [
          [14, { label: "Essential fat", range: "10–13%", tone: "low" }],
          [21, { label: "Athletic", range: "14–20%", tone: "good" }],
          [25, { label: "Fitness", range: "21–24%", tone: "good" }],
          [32, { label: "Average", range: "25–31%", tone: "raised" }],
          [Infinity, { label: "Above average", range: "32%+", tone: "high" }],
        ];

  return bands.find(([ceiling]) => percent < ceiling)![1];
}

export interface BodyFatResult {
  navy: number;
  /** Null without a weight, since it needs BMI. */
  bmiEstimate: number | null;
  bmi: number | null;
  category: Category;
  /** Kilograms of fat and of everything else, when a weight was supplied. */
  fatMass: number | null;
  leanMass: number | null;
}

/**
 * The US Navy circumference formula.
 *
 * Logarithmic rather than linear, which is why it cannot be done in your head
 * and why the measurements need to be reasonably careful — a centimetre out on
 * the waist moves the result by roughly a percentage point.
 */
export function calculate(input: Measurements): BodyFatResult | null {
  const { sex, units } = input;

  const height = toCm(input.height, units);
  const waist = toCm(input.waist, units);
  const neck = toCm(input.neck, units);
  const hip = input.hip === undefined ? undefined : toCm(input.hip, units);

  if (!(height > 50 && height < 260)) return null;
  if (!(waist > 30 && waist < 250)) return null;
  if (!(neck > 15 && neck < 80)) return null;
  if (sex === "female" && !(hip !== undefined && hip > 40 && hip < 250)) return null;

  // The formula takes the difference between the waist and the neck; if the
  // neck is not smaller the logarithm is undefined.
  const girth = sex === "male" ? waist - neck : waist + (hip as number) - neck;
  if (girth <= 0) return null;

  const navy =
    sex === "male"
      ? 495 / (1.0324 - 0.19077 * Math.log10(girth) + 0.15456 * Math.log10(height)) - 450
      : 495 / (1.29579 - 0.35004 * Math.log10(girth) + 0.221 * Math.log10(height)) - 450;

  if (!Number.isFinite(navy) || navy <= 0 || navy > 75) return null;

  let bmi: number | null = null;
  let bmiEstimate: number | null = null;
  let fatMass: number | null = null;
  let leanMass: number | null = null;

  if (input.weight !== undefined && input.weight > 0) {
    const kg = toKg(input.weight, units);
    const metres = height / 100;
    bmi = kg / (metres * metres);

    if (input.age !== undefined && input.age > 0) {
      // Deurenberg: a BMI-derived estimate, included because it is asked for
      // and not because it is good.
      bmiEstimate = 1.2 * bmi + 0.23 * input.age - 10.8 * (sex === "male" ? 1 : 0) - 5.4;
    }

    fatMass = (kg * navy) / 100;
    leanMass = kg - fatMass;
  }

  return {
    navy: Math.round(navy * 10) / 10,
    bmiEstimate: bmiEstimate === null ? null : Math.round(bmiEstimate * 10) / 10,
    bmi: bmi === null ? null : Math.round(bmi * 10) / 10,
    category: categorise(navy, sex),
    fatMass: fatMass === null ? null : Math.round(fatMass * 10) / 10,
    leanMass: leanMass === null ? null : Math.round(leanMass * 10) / 10,
  };
}

export const MEASURING_NOTES: Record<string, string> = {
  waist: "At the navel, tape level all the way round, at the end of a normal breath out. Do not pull it tight or hold your stomach in — both make the number wrong in the flattering direction.",
  neck: "Just below the larynx, sloping slightly downward at the front.",
  hip: "At the widest point, feet together.",
  height: "Without shoes, standing straight against a wall.",
};
