import type { ToolContent } from "@/config/tool-content";

export const bmiCalculatorContent: ToolContent = {
  steps: [
    "Switch between metric and imperial, then enter your height and weight.",
    "Your BMI is shown against the WHO categories, with the healthy weight range for your height.",
    "Read the caveats — BMI is a population screening tool, not an individual diagnosis.",
  ],
  notes: [
    "BMI is weight in kilograms divided by height in metres squared. It was devised in the 1830s by Adolphe Quetelet as a way of describing populations, not individuals — a point he made explicitly and which has been widely ignored since.",
    "As a population measure it is useful; as an individual diagnosis it is crude. It takes no account of muscle mass, bone density, body composition or fat distribution, so a well-muscled athlete is routinely classified as overweight and someone with low muscle mass and high visceral fat can score in the healthy range.",
    "The thresholds also derive from studies of predominantly European populations, and health risks appear at lower BMI values in South Asian and some East Asian populations — which is why several countries use lower cut-offs. Waist circumference and waist-to-height ratio track health risk better for an individual than BMI does.",
  ],
  faq: [
    {
      question: "How is BMI calculated?",
      answer: "Weight in kilograms divided by height in metres squared. In imperial units, multiply weight in pounds by 703 and divide by height in inches squared — which gives the same number.",
    },
    {
      question: "Is BMI accurate for athletes?",
      answer: "No. Muscle is denser than fat, so a well-trained athlete frequently registers as overweight or obese while carrying very little body fat. BMI cannot distinguish weight from muscle and weight from fat.",
    },
    {
      question: "What is a healthy BMI range?",
      answer: "Conventionally 18.5 to 24.9. Several countries use lower thresholds for South Asian and East Asian populations, where health risks appear at lower BMI values than the original European-derived data suggested.",
    },
    {
      question: "What is a better measure than BMI?",
      answer: "Waist-to-height ratio is a better single indicator of health risk for an individual, because it reflects abdominal fat specifically. Keeping your waist under half your height is the usual rule of thumb.",
    },
    {
      question: "Should I be worried if my BMI is outside the healthy range?",
      answer: "It is a prompt to look further, not a diagnosis. BMI ignores muscle, body composition and fat distribution entirely. A doctor looking at the whole picture will tell you far more than a single ratio can.",
    },
  ],
};
