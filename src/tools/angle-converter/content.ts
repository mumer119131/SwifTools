import type { ToolContent } from "@/config/tool-content";

export const angleConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Degrees are arbitrary and radians are not, which is why mathematics uses radians and everyone else uses degrees. A radian is the angle subtended when the arc length equals the radius — a definition that comes from the circle itself rather than from a decision — and it is why calculus formulas for sine and cosine only work cleanly in radians.",
    "The 360 in a degree circle is generally traced to Babylonian base-60 arithmetic, helped along by 360 having a great many divisors: it divides evenly by 2, 3, 4, 5, 6, 8, 9, 10, 12 and more, which makes fractions of a circle come out as whole numbers.",
    "The conversion worth memorising is that π radians is 180 degrees, so a right angle is π/2 and a full turn is 2π. Multiplying degrees by π/180 converts one way and by 180/π the other.",
    "Gradians divide the circle into 400 rather than 360, making a right angle exactly 100 — tidy for surveying, and almost unused elsewhere. Arcminutes and arcseconds subdivide a degree by sixty and then sixty again, and are how astronomical positions and latitude are quoted.",
  ],
  faq: [
    {
      question: "How do you convert degrees to radians?",
      answer: "Multiply by π/180. So 180 degrees is π radians, 90 degrees is π/2, and 1 degree is about 0.01745 radians. Going the other way, multiply radians by 180/π.",
    },
    {
      question: "Why does mathematics use radians?",
      answer: "Because a radian is defined by the circle itself — the angle where the arc length equals the radius — rather than by an arbitrary division. Calculus formulas for sine and cosine only come out cleanly when angles are in radians.",
    },
    {
      question: "Why are there 360 degrees in a circle?",
      answer: "Generally traced to Babylonian base-60 arithmetic, and helped by 360 having an unusual number of divisors. It divides evenly by 2, 3, 4, 5, 6, 8, 9, 10 and 12, so common fractions of a circle are whole numbers.",
    },
    {
      question: "What is a gradian?",
      answer: "A four-hundredth of a circle, so a right angle is exactly 100 gradians. Tidy for surveying, where it originated, and almost unused anywhere else.",
    },
  ],
};
