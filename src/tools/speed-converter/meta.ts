import { Gauge } from "lucide-react";

import type { Tool } from "@/config/tools";

export const speedConverter: Tool = {
  slug: "speed-converter",
  name: "Speed Converter",
  category: "units",
  description: "Convert km/h, mph, knots, feet per second and metres per second.",
  keywords: [
    "speed converter",
    "kmh to mph",
    "mph to kmh",
    "knots to mph",
    "velocity converter",
  ],
  icon: Gauge,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between mph, km/h, m/s, knots and more in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "The conversions people need most are mph to km/h for driving abroad and m/s to km/h for physics. The second is easy once you see it: multiplying metres per second by 3.6 gives kilometres per hour, because there are 3,600 seconds in an hour and 1,000 metres in a kilometre.",
    "Knots exist for the same reason nautical miles do. A knot is one nautical mile per hour, and since a nautical mile approximates one minute of latitude, a vessel making 10 knots covers 10 minutes of latitude per hour — which is directly readable off a chart.",
  ],
  faq: [
    {
      question: "How do I convert m/s to km/h?",
      answer: "Multiply by 3.6. There are 3,600 seconds in an hour and 1,000 metres in a kilometre, so the factor is 3600/1000 — one of the few conversions worth memorising.",
    },
    {
      question: "How fast is a knot in mph?",
      answer: "1.15078 mph, or 1.852 km/h exactly. A knot is one nautical mile per hour, and the nautical mile is defined as 1,852 metres.",
    },
    {
      question: "What is 100 km/h in mph?",
      answer: "62.14 mph. The reverse — 60 mph — is 96.6 km/h, which is why 100 km/h and 60 mph are commonly treated as roughly equivalent motorway speeds.",
    },
    {
      question: "Why do ships and aircraft use knots?",
      answer: "Because a nautical mile is about one minute of latitude, so speed in knots translates directly to progress across a chart. It is a navigational convenience that no metric unit replaces.",
    },
    {
      question: "What is the speed of sound in these units?",
      answer: "About 343 m/s at 20°C, which is 1,235 km/h or 767 mph. It varies with temperature — sound travels faster in warmer air — which is why aviation figures always state conditions.",
    },
  ],
};
