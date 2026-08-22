import type { ToolContent } from "@/config/tool-content";

export const projectileMotionCalculatorContent: ToolContent = {
  steps: [
    "Enter a launch speed and drag the angle.",
    "Add a launch height if it is not thrown from ground level.",
    "The trajectory, range, peak height and impact speed are all calculated.",
  ],
  notes: [
    "Projectile motion separates cleanly into two independent problems: constant velocity horizontally, and constant acceleration vertically. Nothing couples them, which is why a bullet fired horizontally and one dropped from the same height hit the ground at the same moment. That result is genuinely counterintuitive and follows directly from the separation.",
    "From ground level, 45 degrees always gives the greatest range — the horizontal and vertical components trade off symmetrically. From a raised launch point the optimum drops below 45, because the extra time spent falling rewards a flatter, faster horizontal component. It is why a shot putter releases at around 37 degrees rather than 45: the shot leaves the hand about two metres up.",
    "A launch height also turns the flight time from the simple symmetric case into a quadratic, since the projectile no longer lands at the height it left. That is the part hand calculations most often get wrong, because the tidy 2v_y/g formula only holds when the two heights match.",
    "The omission that matters: air resistance is ignored entirely. In a vacuum the path is a perfect parabola; in air a real projectile falls well short of the predicted range and the optimal angle drops further still. For a golf ball or a bullet the difference is large. These are the textbook formulas, and the textbook describes a vacuum.",
  ],
  faq: [
    {
      question: "What angle gives the maximum range?",
      answer: "45 degrees, when launching and landing at the same height. From a raised position the optimum is lower — the extra fall time rewards a flatter trajectory, which is why shot putters release at around 37 degrees.",
    },
    {
      question: "Do heavier objects fall faster?",
      answer: "No, not in a vacuum — mass does not appear in the equations at all. A bullet fired horizontally and one dropped at the same instant hit the ground together, because the horizontal and vertical motions are entirely independent.",
    },
    {
      question: "Why is my answer different from a real throw?",
      answer: "Because air resistance is ignored, and it is not a small effect. A real projectile falls well short of the vacuum prediction and its optimal angle is lower. The difference is substantial for anything light or fast.",
    },
    {
      question: "How is flight time calculated from a height?",
      answer: "It solves a quadratic rather than the symmetric 2v_y/g, because the projectile does not land at the height it left. That simpler formula only applies when launch and landing heights match, and using it from a raised position gives a short answer.",
    },
  ],
};
