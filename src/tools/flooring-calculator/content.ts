import type { ToolContent } from "@/config/tool-content";

export const flooringCalculatorContent: ToolContent = {
  steps: [
    "Enter the room size and how many square feet a box covers.",
    "Set the waste allowance — 10% for straight runs, more for diagonals.",
    "You get boxes to buy, total cost and how much spare you end up with.",
  ],
  notes: [
    "Boxes are worked out from the floor area plus a waste allowance, then rounded up — you cannot buy 6.6 boxes. The waste allowance is not padding: every plank cut at a wall leaves an offcut too short to start the next row, and a diagonal or herringbone layout wastes considerably more.",
    "Ten percent is the standard allowance for a straight lay in a simple room. Fifteen is sensible for a room with angled walls or many cuts, twenty for a diagonal lay, and thirty for herringbone or chevron.",
    "Buy it all in one order. Flooring is manufactured in batches and two orders of the same product can differ slightly in shade — invisible in the shop and obvious across a finished floor. Keep the spare boxes too: a damaged plank three years later is easy to replace from stock and impossible to match once the line is discontinued.",
  ],
  faq: [
    {
      question: "How much extra flooring should I buy?",
      answer: "Ten percent for a straight lay in a simple room, 15 for angled walls or many cuts, 20 for a diagonal lay and 30 for herringbone. The offcut from each cut plank is usually too short to start the next row.",
    },
    {
      question: "How many boxes of flooring do I need?",
      answer: "Floor area plus waste, divided by the coverage printed on the box, rounded up. A 120 square foot room at 10 percent waste with 20 square feet per box needs seven boxes.",
    },
    {
      question: "Why should I buy all my flooring at once?",
      answer: "Because it is made in batches and two orders can differ slightly in shade. The difference is invisible in the shop and obvious across a finished floor.",
    },
    {
      question: "Should I keep leftover flooring?",
      answer: "Yes. A damaged plank a few years later is trivial to replace from your own stock and impossible to match once the product line changes or is discontinued.",
    },
    {
      question: "How do I measure a room for flooring?",
      answer: "Length times width, splitting irregular rooms into rectangles and adding them. Include doorways and closets you will floor, and measure at the widest point of each section.",
    },
  ],
};
