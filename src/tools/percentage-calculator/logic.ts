export interface Mode {
  id: string;
  label: string;
  /** Templated question with {a} and {b} placeholders for the two inputs. */
  question: string;
  firstLabel: string;
  secondLabel: string;
  defaults: [number, number];
  compute: (a: number, b: number) => { value: number; suffix: string; working: string } | null;
}

const round = (value: number) => Math.round(value * 1e6) / 1e6;

export const modes: readonly Mode[] = [
  {
    id: "of",
    label: "X% of Y",
    question: "What is {a}% of {b}?",
    firstLabel: "Percentage",
    secondLabel: "Of this number",
    defaults: [15, 200],
    compute: (a, b) => ({
      value: round((a / 100) * b),
      suffix: "",
      working: `${a} ÷ 100 × ${b}`,
    }),
  },
  {
    id: "is-what-percent",
    label: "X is what % of Y",
    question: "{a} is what percent of {b}?",
    firstLabel: "This number",
    secondLabel: "Out of",
    defaults: [30, 200],
    compute: (a, b) =>
      b === 0 ? null : { value: round((a / b) * 100), suffix: "%", working: `${a} ÷ ${b} × 100` },
  },
  {
    id: "increase",
    label: "Increase by %",
    question: "{a} increased by {b}%",
    firstLabel: "Starting number",
    secondLabel: "Increase by (%)",
    defaults: [200, 15],
    compute: (a, b) => ({
      value: round(a * (1 + b / 100)),
      suffix: "",
      working: `${a} × (1 + ${b} ÷ 100)`,
    }),
  },
  {
    id: "decrease",
    label: "Decrease by %",
    question: "{a} decreased by {b}%",
    firstLabel: "Starting number",
    secondLabel: "Decrease by (%)",
    defaults: [200, 15],
    compute: (a, b) => ({
      value: round(a * (1 - b / 100)),
      suffix: "",
      working: `${a} × (1 − ${b} ÷ 100)`,
    }),
  },
  {
    id: "change",
    label: "% change",
    question: "Percentage change from {a} to {b}",
    firstLabel: "From",
    secondLabel: "To",
    defaults: [200, 250],
    compute: (a, b) =>
      a === 0
        ? null
        : {
            value: round(((b - a) / a) * 100),
            suffix: "%",
            working: `(${b} − ${a}) ÷ ${a} × 100`,
          },
  },
  {
    id: "difference",
    label: "% difference",
    question: "Percentage difference between {a} and {b}",
    firstLabel: "First number",
    secondLabel: "Second number",
    defaults: [200, 250],
    compute: (a, b) => {
      // Difference is symmetric — measured against the mean, not against one side.
      const mean = (a + b) / 2;
      return mean === 0
        ? null
        : {
            value: round((Math.abs(a - b) / mean) * 100),
            suffix: "%",
            working: `|${a} − ${b}| ÷ ((${a} + ${b}) ÷ 2) × 100`,
          };
    },
  },
  {
    id: "discount",
    label: "Discount",
    question: "{a} with {b}% off",
    firstLabel: "Original price",
    secondLabel: "Discount (%)",
    defaults: [89.99, 25],
    compute: (a, b) => ({
      value: round(a * (1 - b / 100)),
      suffix: "",
      working: `${a} × (1 − ${b} ÷ 100) — you save ${round(a * (b / 100))}`,
    }),
  },
  {
    id: "tip",
    label: "Tip",
    question: "{b}% tip on a bill of {a}",
    firstLabel: "Bill total",
    secondLabel: "Tip (%)",
    defaults: [64.5, 18],
    compute: (a, b) => ({
      value: round(a * (b / 100)),
      suffix: "",
      working: `${a} × ${b} ÷ 100 — total to pay ${round(a * (1 + b / 100))}`,
    }),
  },
  {
    id: "reverse",
    label: "Reverse %",
    question: "{a} is {b}% of what number?",
    firstLabel: "This number",
    secondLabel: "Is this percent (%)",
    defaults: [30, 15],
    compute: (a, b) =>
      b === 0 ? null : { value: round((a / b) * 100), suffix: "", working: `${a} ÷ ${b} × 100` },
  },
];

export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Number(value.toFixed(4)).toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function fillQuestion(mode: Mode, a: string, b: string): string {
  return mode.question.replace("{a}", a || "…").replace("{b}", b || "…");
}
