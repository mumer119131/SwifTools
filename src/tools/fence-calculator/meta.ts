import { Fence } from "lucide-react";

import type { Tool } from "@/config/tools";

export const fenceCalculator: Tool = {
  slug: "fence-calculator",
  name: "Fence Calculator",
  category: "home",
  description: "Posts, rails, pickets and concrete for a fence run, from length and post spacing.",
  keywords: [
    "fence calculator",
    "fence post calculator",
    "how many fence pickets",
    "fence materials estimator",
    "picket fence calculator",
  ],
  icon: Fence,
  processing: "client",
  status: "live",
  steps: [
    "Enter the total fence length and how far apart the posts go.",
    "Set the picket width and gap, and how many rails per section.",
    "You get posts, rails, pickets, concrete per post and a total cost.",
  ],
  notes: [
    "The post count is the classic fencepost problem, and it is always wrong in the same direction: a run of thirteen sections needs fourteen posts, because there is one at each end. Ordering by section count leaves you one post short every time.",
    "Post holes go a third of the fence's above-ground height into the ground, or below the frost line where the ground freezes, whichever is deeper. A ten-inch hole at that depth takes roughly two 50 lb bags of post mix per post.",
    "Gates need their own heavier posts on both sides. A gate hangs its whole weight off one post and swings against the other, and a standard line post will lean within a season.",
  ],
  faq: [
    {
      question: "How many fence posts do I need?",
      answer: "One more than the number of sections, because there is a post at each end of the run. A 100 foot fence at 8 foot spacing is 13 sections and 14 posts — the off-by-one that leaves people short.",
    },
    {
      question: "How far apart should fence posts be?",
      answer: "Six to eight feet for most fences. Closer in exposed or windy locations, and closer for heavy panels, because the span is what determines how much the rails sag.",
    },
    {
      question: "How deep should a fence post go?",
      answer: "A third of its above-ground height, or below the frost line if the ground freezes where you are, whichever is deeper. A six foot fence therefore needs at least two feet in the ground.",
    },
    {
      question: "How many bags of concrete per fence post?",
      answer: "About two 50 lb bags for a ten-inch hole at typical depth. Wider holes and deeper settings use more, and gate posts should be set deeper and wider than line posts.",
    },
    {
      question: "How many pickets do I need?",
      answer: "Total fence length in inches divided by the picket width plus the gap. A 100 foot privacy fence with 5.5 inch pickets butted together needs about 219 of them.",
    },
  ],
};
