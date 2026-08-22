/**
 * Grade point averages.
 *
 * The arithmetic is a weighted mean, and the thing that trips people is which
 * weight. A GPA weights each course by its credit hours, not by counting
 * courses equally — so a bad grade in a four-credit course hurts considerably
 * more than the same grade in a one-credit one, which is exactly the intuition
 * a plain average destroys.
 */

export interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  /** Honours or AP courses, worth an extra point on a weighted scale. */
  honours: boolean;
}

export type Scale = "4.0" | "4.0-plus" | "uk";

export const SCALE_LABELS: Record<Scale, string> = {
  "4.0": "US 4.0",
  "4.0-plus": "US 4.0 with +/−",
  uk: "UK degree classification",
};

const POINTS_4: Record<string, number> = {
  A: 4, B: 3, C: 2, D: 1, F: 0,
};

const POINTS_4_PLUS: Record<string, number> = {
  "A+": 4, A: 4, "A-": 3.7,
  "B+": 3.3, B: 3, "B-": 2.7,
  "C+": 2.3, C: 2, "C-": 1.7,
  "D+": 1.3, D: 1, "D-": 0.7,
  F: 0,
};

/** UK marks are percentages; the classification comes from the average. */
export const UK_CLASSES = [
  { min: 70, label: "First (1st)" },
  { min: 60, label: "Upper second (2:1)" },
  { min: 50, label: "Lower second (2:2)" },
  { min: 40, label: "Third (3rd)" },
  { min: 0, label: "Fail" },
];

export function gradeOptions(scale: Scale): string[] {
  if (scale === "uk") return [];
  return Object.keys(scale === "4.0" ? POINTS_4 : POINTS_4_PLUS);
}

/** Points for a grade, or null when it is not a grade on this scale. */
export function pointsFor(grade: string, scale: Scale): number | null {
  const key = grade.trim().toUpperCase();
  if (key === "") return null;

  if (scale === "uk") {
    const mark = Number(key);
    return Number.isFinite(mark) && mark >= 0 && mark <= 100 ? mark : null;
  }

  const table = scale === "4.0" ? POINTS_4 : POINTS_4_PLUS;
  return table[key] ?? null;
}

export interface GpaResult {
  /** Weighted by credits. */
  gpa: number;
  /** With the honours bonus applied, when any course is marked. */
  weightedGpa: number | null;
  totalCredits: number;
  countedCourses: number;
  /** UK classification, when that scale is in use. */
  classification: string | null;
  /** The unweighted mean, for the comparison that makes the point. */
  simpleMean: number;
}

export function calculate(courses: Course[], scale: Scale): GpaResult | null {
  let points = 0;
  let weightedPoints = 0;
  let credits = 0;
  let counted = 0;
  let simpleTotal = 0;
  let anyHonours = false;

  for (const course of courses) {
    const value = pointsFor(course.grade, scale);
    if (value === null) continue;

    const weight = Number.isFinite(course.credits) && course.credits > 0 ? course.credits : 0;
    if (weight === 0) continue;

    // The honours bonus applies to US scales only; a UK mark is a percentage
    // and adding one to it would be meaningless.
    const bonus = scale !== "uk" && course.honours ? 1 : 0;
    if (course.honours) anyHonours = true;

    points += value * weight;
    weightedPoints += (value + bonus) * weight;
    credits += weight;
    simpleTotal += value;
    counted += 1;
  }

  if (counted === 0 || credits === 0) return null;

  const gpa = points / credits;

  return {
    gpa: Math.round(gpa * 1000) / 1000,
    weightedGpa: anyHonours && scale !== "uk" ? Math.round((weightedPoints / credits) * 1000) / 1000 : null,
    totalCredits: credits,
    countedCourses: counted,
    classification:
      scale === "uk" ? (UK_CLASSES.find((entry) => gpa >= entry.min)?.label ?? null) : null,
    simpleMean: Math.round((simpleTotal / counted) * 1000) / 1000,
  };
}

/**
 * What is needed across remaining credits to reach a target.
 *
 * The question people actually have, and the one a plain GPA figure does not
 * answer. Returns null when the target is already unreachable, which is more
 * useful than a number above the scale maximum.
 */
export function requiredAverage(
  current: GpaResult,
  targetGpa: number,
  remainingCredits: number,
  maximum = 4,
): { required: number; achievable: boolean } | null {
  if (!(remainingCredits > 0) || !(targetGpa > 0)) return null;

  const totalAfter = current.totalCredits + remainingCredits;
  const pointsNeeded = targetGpa * totalAfter - current.gpa * current.totalCredits;
  const required = pointsNeeded / remainingCredits;

  return {
    required: Math.round(required * 100) / 100,
    achievable: required <= maximum && required >= 0,
  };
}

export function blankCourse(index: number): Course {
  return {
    id: `course-${Math.random().toString(36).slice(2, 8)}`,
    name: `Course ${index}`,
    grade: "",
    credits: 3,
    honours: false,
  };
}
