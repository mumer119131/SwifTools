import type { ToolContent } from "@/config/tool-content";

export const ledResistorCalculatorContent: ToolContent = {
  steps: [
    "Enter your supply voltage, the LED's forward voltage and the current you want through it.",
    "The exact resistance is calculated, then rounded up to the nearest standard E24 value.",
    "Check the power rating — a resistor dissipating more than it is rated for will cook.",
  ],
  notes: [
    "An LED is not a resistor. Above its forward voltage its current rises almost vertically with voltage, so connecting one directly across a supply draws whatever current the supply can deliver — and destroys the LED in an instant. A series resistor is what limits that current.",
    "The value comes from Ohm's law applied to the resistor alone: R = (Vsupply − Vforward) / Iforward. The forward voltage is the LED's, not the supply's, and it depends on colour — roughly 1.8 to 2.2 V for red, 3.0 to 3.4 V for blue, green and white.",
    "The calculated value is almost never a value you can buy, so the next standard E24 value above it is what to use. Always round up: a slightly larger resistor means slightly less current and a slightly dimmer LED, while rounding down means running the LED over its rated current and shortening its life.",
  ],
  faq: [
    {
      question: "Why does an LED need a resistor?",
      answer: "Because its current rises almost vertically once the forward voltage is exceeded. Without something to limit it, the LED draws whatever the supply can deliver and destroys itself immediately.",
    },
    {
      question: "How do I calculate the resistor value for an LED?",
      answer: "R = (supply voltage − LED forward voltage) / desired current. For a red LED at 2 V and 20 mA on a 5 V supply, that is 3 V divided by 0.02, or 150 ohms.",
    },
    {
      question: "What is the forward voltage of an LED?",
      answer: "It depends on colour, because it depends on the semiconductor. Red is roughly 1.8 to 2.2 V, yellow and orange about 2.0 to 2.2, and blue, green and white 3.0 to 3.4. The datasheet is authoritative.",
    },
    {
      question: "Should I round the resistor value up or down?",
      answer: "Up, always. A larger resistor means slightly less current and a marginally dimmer LED; a smaller one runs the LED above its rated current and shortens its life considerably.",
    },
    {
      question: "Can I use one resistor for several LEDs?",
      answer: "For LEDs in series, yes — one resistor limits the whole string. For LEDs in parallel, no: small differences in forward voltage make one LED take most of the current, and it fails first.",
    },
  ],
};
