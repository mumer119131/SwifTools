import type { ToolContent } from "@/config/tool-content";

export const workDoneCalculatorContent: ToolContent = {
  steps: [
    "Enter any two of work, force and distance.",
    "Distance must be measured along the direction of the force.",
    "The result converts into calories and the power it represents.",
  ],
  notes: [
    "Work is force times the distance moved in the direction of that force, measured in joules. The qualifier is the whole of it: only motion along the force counts, and anything perpendicular contributes nothing.",
    "Which produces a result that sounds wrong and is not. Carrying a heavy box across a level floor does no work in the physics sense at all — the force you apply is upward, the motion is horizontal, and the two are at right angles. You get tired because holding the box requires continuous muscular effort, but no energy is transferred to the box. Lifting it does work; carrying it does not.",
    "At an intermediate angle only the component along the motion counts, so the work is F × d × cos θ. Pulling a sledge with a rope at 30 degrees does about 87% of the work the same force applied horizontally would.",
    "Work and energy are the same quantity measured different ways — doing work on something changes its energy by exactly that amount. Dividing work by the time taken gives power in watts, which is why the tool reports what the same work would represent done in one second and in ten.",
  ],
  faq: [
    {
      question: "How do you calculate work done?",
      answer: "Multiply force by the distance moved in the direction of the force. 100 N over 5 m is 500 joules. Motion perpendicular to the force contributes nothing.",
    },
    {
      question: "Why is carrying a box not work?",
      answer: "Because the force is upward and the motion horizontal, and only motion along the force counts. You tire because holding the box takes muscular effort, but no energy is transferred to it. Lifting it does work; carrying it across a level floor does not.",
    },
    {
      question: "What if the force is at an angle?",
      answer: "Only the component along the motion counts, so the work is F × d × cos θ. At 30 degrees you do about 87% of what the same force applied straight along the motion would.",
    },
    {
      question: "What is the difference between work and power?",
      answer: "Work is energy transferred; power is how fast you transfer it. Divide work by time to get power in watts — the same 500 joules is 500 W done in a second, or 50 W done over ten.",
    },
  ],
};
