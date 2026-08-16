import { Thermometer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const temperatureConverter: Tool = {
  slug: "temperature-converter",
  name: "Temperature Converter",
  category: "units",
  description: "Convert Celsius, Fahrenheit and Kelvin, with the formula shown.",
  keywords: [
    "temperature converter",
    "celsius to fahrenheit",
    "fahrenheit to celsius",
    "c to f",
    "kelvin converter",
  ],
  icon: Thermometer,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between Celsius, Fahrenheit and Kelvin in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "Temperature is the one conversion that cannot be done by multiplication alone, because the scales do not share a zero. Celsius and Fahrenheit have different zero points and different degree sizes, so the conversion needs both a scale factor and an offset — which is why doubling 20°C does not give you double the temperature in Fahrenheit.",
    "Kelvin shares Celsius's degree size but starts at absolute zero, the point at which molecular motion stops. That is why it has no negative values and no degree symbol: it is an absolute scale, and 0 K is the coldest anything can be rather than an arbitrary reference like the freezing point of water.",
  ],
  faq: [
    {
      question: "What is the formula to convert Celsius to Fahrenheit?",
      answer: "Multiply by 9/5 and add 32. The multiplication accounts for Fahrenheit's smaller degree and the addition for its different zero point — both are needed, which is why temperature conversion is not a simple ratio.",
    },
    {
      question: "At what temperature do Celsius and Fahrenheit agree?",
      answer: "Minus 40. It is the single point where the two scales cross, so −40°C and −40°F are the same temperature — a useful sanity check on any conversion.",
    },
    {
      question: "Why does Kelvin have no degree symbol?",
      answer: "Because it is an absolute scale, not a relative one. It measures from absolute zero rather than from an arbitrary reference, so a value is simply 300 K rather than 300 degrees Kelvin.",
    },
    {
      question: "What is absolute zero in Celsius and Fahrenheit?",
      answer: "−273.15°C and −459.67°F. It is the point at which a system has minimum thermal energy, and it cannot be reached — only approached, which laboratories have done to within billionths of a degree.",
    },
    {
      question: "Is normal body temperature 37°C or 98.6°F?",
      answer: "Both, and the precision of 98.6 is an artefact of conversion. The original 19th-century measurement was 37°C to two significant figures; converting it produced 98.6, which reads as far more precise than the underlying figure ever was.",
    },
  ],
};
