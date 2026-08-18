import type { ToolContent } from "@/config/tool-content";

export const colorBlindnessSimulatorContent: ToolContent = {
  steps: [
    "Drop in a screenshot, or type hex codes to check a palette.",
    "Every simulation is shown side by side with the original.",
    "Everything happens in your browser — the image is never uploaded.",
  ],
  notes: [
    "The simulation matrices come from Machado, Oliveira and Fernandes (2009), the model most accessibility tooling uses. They are applied in linear RGB — the sRGB gamma curve is undone first and reapplied after — which most quick implementations skip, and which is why their results come out visibly too dark.",
    "Around one man in twelve has some form of colour vision deficiency. Deuteranomaly alone is roughly one in twenty and frequently undiagnosed, so it is not a niche case: if two colours in your palette collapse into one here, a meaningful share of your audience sees them that way.",
    "The practical rule this leads to is never to use colour as the only carrier of meaning. Add a shape, a label, a pattern or a position — a legend that says red is bad and green is good is useless to someone who sees both as the same brown.",
  ],
  faq: [
    {
      question: "How common is colour blindness?",
      answer: "About one man in twelve and one woman in two hundred has some form. Deuteranomaly, reduced green sensitivity, is the most common at roughly one in twenty men and is often undiagnosed.",
    },
    {
      question: "What is the difference between deuteranopia and deuteranomaly?",
      answer: "Deuteranopia is the complete absence of green cones; deuteranomaly is reduced green sensitivity. The anomalous forms are far more common and milder, but still enough to collapse two palette colours into one.",
    },
    {
      question: "How do I make a chart accessible to colour blind users?",
      answer: "Never rely on colour alone. Add direct labels, different shapes or line styles, or patterns. A legend mapping red to bad and green to good conveys nothing to someone who sees both as the same brown.",
    },
    {
      question: "Why do other simulators give different results?",
      answer: "Usually because they apply the matrix in sRGB without undoing the gamma curve, which makes the output visibly too dark. This one converts to linear RGB first, which is what the model specifies.",
    },
    {
      question: "Is my image uploaded to be simulated?",
      answer: "No. The simulation runs pixel by pixel on a canvas in your browser, so screenshots of unreleased work stay on your machine.",
    },
  ],
};
