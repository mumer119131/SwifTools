import { Blocks } from "lucide-react";

import type { Tool } from "@/config/tools";

export const concreteCalculator: Tool = {
  slug: "concrete-calculator",
  name: "Concrete Calculator",
  category: "home",
  description: "Cubic yards of concrete for a slab, footing or column, plus bags if mixing it yourself.",
  keywords: [
    "concrete calculator",
    "cubic yards of concrete",
    "concrete slab calculator",
    "how many bags of concrete",
    "footing calculator",
    "concrete volume calculator",
  ],
  icon: Blocks,
  processing: "client",
  status: "live",
  steps: [
    "Pick the shape — slab, footing, column or round pad.",
    "Enter the dimensions; thickness is in inches, the rest in feet.",
    "You get cubic yards, cubic metres and how many 60 or 80 lb bags that is.",
  ],
  notes: [
    "Volume is worked out in cubic feet from the dimensions, then converted — 27 cubic feet to a cubic yard. Ready-mix is ordered in quarter-yard steps with a minimum load, and a short-load fee applies below it, so ordering slightly over is almost always cheaper than ordering slightly under.",
    "The bag counts assume the yield printed on the bag rather than dividing weight by density, because concrete takes up water as it cures. A 60 lb bag makes about 0.45 cubic feet and an 80 lb bag about 0.60.",
    "Past about a cubic yard, mixing by hand stops being sensible — that is forty-five 80 lb bags, and concrete sets while you are still opening them. Running out halfway through a pour leaves a cold joint you cannot undo, which is the real reason to order over rather than under.",
  ],
  faq: [
    {
      question: "How much concrete do I need for a slab?",
      answer: "Length times width times thickness, in consistent units, divided by 27 for cubic yards. A 10 by 10 slab at 4 inches thick is 33.3 cubic feet, or about 1.24 cubic yards before waste.",
    },
    {
      question: "How many bags of concrete are in a cubic yard?",
      answer: "About 60 bags at 80 lb, or 45 at 60 lb. That is the point where hand mixing stops being practical — concrete sets faster than you can open that many bags.",
    },
    {
      question: "Should I order extra concrete?",
      answer: "Yes, around 10 percent. Subgrade is never perfectly level and some is always lost to spillage. Running out mid-pour leaves a cold joint in the slab that cannot be repaired.",
    },
    {
      question: "How thick should a concrete slab be?",
      answer: "Four inches for a patio or footpath, six if a vehicle will sit on it. Thicker slabs need reinforcement and a properly compacted base to be worth the extra material.",
    },
    {
      question: "What is a short-load fee?",
      answer: "A surcharge ready-mix suppliers apply below their minimum load, usually around one cubic yard. It often makes ordering the minimum cheaper than ordering slightly less.",
    },
  ],
};
