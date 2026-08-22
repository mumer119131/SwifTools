import type { ToolContent } from "@/config/tool-content";

export const viewingDistanceCalculatorContent: ToolContent = {
  steps: [
    "Enter a screen size, its resolution, and how far away you sit.",
    "Compare the recommended distances against where your sofa actually is.",
    "The verdict says whether the resolution is doing visible work at that distance.",
  ],
  notes: [
    "Two different figures answer two different questions, and conflating them is behind most of the confused advice about screen sizes. The viewing-angle recommendations — SMPTE's 30 degrees, THX's 40 — are about immersion: how much of your field of view the picture fills. The pixel-pitch limit is about detail: the distance beyond which you can no longer resolve individual pixels, so a higher resolution stops earning its keep.",
    "People conflate the two and conclude that 4K is pointless. It is only pointless if you sit where a 1080p set would have been fine anyway. Sit at the distance THX suggests and the extra resolution is doing plenty of visible work; sit across the room and it genuinely is not.",
    "A screen is sold by its diagonal, which is why a 55-inch 16:9 television is only about 48 inches wide. That also makes diagonal a poor way to compare different shapes — a 34-inch ultrawide monitor and a 34-inch 16:9 one have quite different amounts of screen, and the ultrawide has considerably less height.",
    "The size most people should buy is larger than the one they do. Working backwards from a typical seating distance to a 40-degree field of view usually produces a number that feels excessive, and almost nobody who buys it regrets going bigger. The commonest complaint after upgrading is the opposite one.",
    "None of this accounts for content. A poor-quality stream at 4K looks worse than a good 1080p source, and compression artefacts become more visible as you sit closer, not less.",
  ],
  faq: [
    {
      question: "How far should I sit from a 55-inch TV?",
      answer: "About 5.5 feet for a cinematic 40-degree field of view, or about 7.5 feet for the more relaxed 30-degree recommendation. At 4K you can sit as close as roughly 3.6 feet before individual pixels become resolvable.",
    },
    {
      question: "Is 4K worth it?",
      answer: "It depends entirely on where you sit. Inside the pixel-resolution distance it is doing visible work; beyond it, a higher resolution adds nothing you can see, and screen size and picture quality matter far more. The distance is shown for whatever screen you enter.",
    },
    {
      question: "What size TV should I buy for my room?",
      answer: "Work backwards from your seating distance. For a 40-degree field of view the answer is usually larger than expected — and almost nobody who buys the larger size regrets it, while plenty regret buying small.",
    },
    {
      question: "Why is a 55-inch TV not 55 inches wide?",
      answer: "Because screens are measured diagonally. A 55-inch 16:9 screen is about 48 inches wide and 27 tall. It also makes diagonal a poor comparison between different shapes — an ultrawide of the same diagonal is wider and noticeably shorter.",
    },
  ],
};
