import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const roomSizeCalculator: Tool = {
  slug: "room-size-calculator",
  name: "Room Size Calculator",
  category: "home",
  description: "Floor, wall, ceiling and volume for a room, plus the heating and cooling it needs.",
  keywords: [
    "room size calculator",
    "room volume calculator",
    "wall area calculator",
    "room dimensions calculator",
    "btu calculator for room",
    "air changes per hour",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
  steps: [
    "Enter the room's length, width and ceiling height.",
    "Every derived measurement appears at once — floor, walls, ceiling, volume, perimeter.",
    "Heating and cooling estimates and a rug size suggestion come with it.",
  ],
  notes: [
    "Gives every measurement a room project needs from three dimensions: floor area for flooring, wall area for paint and wallpaper, perimeter for skirting and trim, and volume for heating, cooling and ventilation.",
    "Wall area is the perimeter times the height, before any deduction for doors and windows. Whether to deduct depends on the job: for paint, yes, because you are not painting the glass. For plasterboard, no, because you cut sheets to fit and the offcuts are waste.",
    "The heating and cooling figures use the square-footage rules of thumb contractors use for a first pass — roughly 20 BTU per square foot for cooling and 35 for heating. They ignore insulation, window area, ceiling height, climate and orientation, all of which matter enough that a proper load calculation can land well either side. Use them to sanity-check a quote, not to size a unit.",
  ],
  faq: [
    {
      question: "How do I calculate the wall area of a room?",
      answer: "Multiply the perimeter by the ceiling height — for a 12 by 10 room with 8 foot walls, that is 44 times 8, or 352 square feet, before deducting doors and windows.",
    },
    {
      question: "Should I deduct doors and windows from wall area?",
      answer: "For paint, yes — you are not painting the glass. For plasterboard or panelling, no, because you cut sheets to fit and the cut-outs become waste rather than savings.",
    },
    {
      question: "How many BTU do I need to heat or cool a room?",
      answer: "As a first pass, about 20 BTU per square foot for cooling and 35 for heating. Those figures ignore insulation, windows, ceiling height and climate, so treat them as a way to check a quote rather than to buy a unit.",
    },
    {
      question: "How do I calculate the volume of a room?",
      answer: "Floor area times ceiling height. Volume is what matters for ventilation and air changes per hour, which is why a room with a high ceiling needs more airflow than its floor area suggests.",
    },
    {
      question: "What size rug fits my room?",
      answer: "Aim to leave 18 to 24 inches of floor showing on each side, so subtract about three feet from each dimension and take the nearest standard size below that. The calculation is done for you from the dimensions entered.",
    },
  ],
};
