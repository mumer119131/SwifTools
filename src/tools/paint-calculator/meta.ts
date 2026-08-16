import { PaintRoller } from "lucide-react";

import type { Tool } from "@/config/tools";

export const paintCalculator: Tool = {
  slug: "paint-calculator",
  name: "Paint Calculator",
  category: "home",
  description: "How many gallons or litres to buy for a room, doors and windows deducted.",
  keywords: [
    "paint calculator",
    "how much paint do i need",
    "paint coverage calculator",
    "gallons of paint for a room",
    "wall paint estimator",
  ],
  icon: PaintRoller,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Enter the room's dimensions and how many coats you want.",
    "Say how many doors and windows there are so their area comes off.",
    "You get gallons, litres and a cost estimate at your price per gallon.",
  ],
  notes: [
    "A gallon of interior paint covers roughly 350 square feet in one coat on a primed, smooth surface. That figure moves a long way with the surface: smooth new drywall gets closer to 400, textured walls about 300, and rough masonry or stucco can drink twice as much at around 200.",
    "Doors and windows are deducted because you are not painting them — a standard door is about 21 square feet and a window about 15. On a room with three windows and two doors that is nearly 80 square feet, which is a meaningful part of a gallon.",
    "Two coats is the realistic default. One coat only works when repainting the same colour, and a strong colour over a light one often needs three. Priming bare drywall first is cheaper than a third coat of colour and gives a more even finish.",
  ],
  faq: [
    {
      question: "How much paint do I need for a room?",
      answer: "Work out the wall area, subtract doors and windows, multiply by the number of coats and divide by the coverage on the tin — usually about 350 square feet per gallon. A typical 12 by 10 room with 8 foot walls needs a little under two gallons for two coats.",
    },
    {
      question: "How many square feet does a gallon of paint cover?",
      answer: "About 350 on a primed, smooth surface, per coat. Smooth new drywall gets closer to 400; textured walls about 300; rough masonry or stucco as little as 200.",
    },
    {
      question: "Do I need one coat or two?",
      answer: "Two, unless you are repainting the same colour. A strong colour over a light one often needs three, and bare drywall should be primed first — primer is cheaper than another coat of colour.",
    },
    {
      question: "Should I subtract windows and doors?",
      answer: "Yes. A standard door is about 21 square feet and a window about 15, so a room with two doors and three windows loses nearly 80 square feet of paintable wall.",
    },
    {
      question: "How much paint do I need for the ceiling?",
      answer: "The ceiling area equals the floor area, so add that to the wall total. Ceilings often need two coats even in the same colour, because they show roller marks more readily than walls do.",
    },
  ],
};
