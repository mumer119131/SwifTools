import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unitConverter: Tool = {
  slug: "unit-converter",
  name: "Unit Converter",
  category: "units",
  description:
    "Every measurement in one place — length, weight, temperature, volume, area, speed, data and time.",
  keywords: [
    "unit converter",
    "metric to imperial",
    "measurement converter",
    "convert units online",
    "unit conversion calculator",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick a category — length, weight, temperature, and so on.",
    "Type a value and choose the units to convert from and to.",
    "The result updates instantly, with the same value shown in every other unit below.",
  ],
  notes: [
    "One place for every measurement type — length, weight, volume, area, speed, data, pressure, time and temperature. Pick a category and the units for it appear; values convert as you type in either direction.",
    "Every conversion goes through a base unit rather than storing a factor for each pair. That is why the numbers agree in both directions and why round-tripping a value returns exactly what you started with, which a table of hand-entered pair factors reliably fails to do.",
    "Temperature is handled separately from everything else, because it is the one measurement where the scales do not share a zero. Converting it needs an offset as well as a factor, so it cannot use the same code path as the multiplicative units.",
  ],
  faq: [
    {
      question: "Which units can I convert between?",
      answer: "Length, weight, volume, area, speed, data storage, pressure, time and temperature — nine categories with the common units of each. Conversions only work within a category, since converting kilograms to metres is not a meaningful question.",
    },
    {
      question: "Why is temperature handled differently?",
      answer: "Because Celsius, Fahrenheit and Kelvin do not share a zero point. Every other conversion is a single multiplication; temperature needs a scale factor and an offset, so doubling a Celsius value does not double the Fahrenheit one.",
    },
    {
      question: "Are the conversions exact?",
      answer: "Where the definitions are exact, yes — an inch is precisely 25.4 millimetres and a pound precisely 0.45359237 kilograms by international agreement. Displayed values are rounded for readability, but the underlying arithmetic is not.",
    },
    {
      question: "Can I convert between metric and imperial?",
      answer: "Yes, in both directions and within every category. The units are listed together rather than split by system, so metres and feet sit in the same dropdown.",
    },
    {
      question: "Is there a page for a specific conversion?",
      answer: "Yes. Common conversions such as pounds to kilograms or Celsius to Fahrenheit have their own pages with the formula written out and a table of typical values, which is often quicker than setting up the dropdowns.",
    },
  ],
};
