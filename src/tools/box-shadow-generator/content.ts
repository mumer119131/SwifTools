import type { ToolContent } from "@/config/tool-content";

export const boxShadowGeneratorContent: ToolContent = {
  steps: [
    "Drag the offset, blur and spread until it looks right.",
    "Add more layers — convincing shadows are almost always two or three.",
    "Copy the CSS or the Tailwind arbitrary-value class.",
  ],
  notes: [
    "The four numbers are horizontal offset, vertical offset, blur radius and spread, in that order. Offset moves the shadow, blur softens its edge, and spread grows or shrinks it before the blur is applied — a negative spread is how you pull a shadow in so it peeks out only at the bottom, which is what most card shadows actually do.",
    "A single shadow almost always looks wrong, and it is the most common reason a hand-written shadow reads as a sticker. Real shadows have two parts: a tight, darker one where the object nearly touches the surface, and a wide, soft one from ambient light. Every convincing preset here layers at least two, which is also how Material Design and Tailwind's elevation scale are built.",
    "Layer order matters and it is the reverse of what most people assume — the first shadow in the list paints on top of the ones after it. A tight dark shadow written last will be hidden behind a wide soft one written first, which looks like the shadow simply not working.",
    "An inset shadow paints inside the border box instead of outside, which is how pressed buttons, inset fields and inner glows are made. A shadow with zero offset and zero blur but positive spread is a ring, and it is the standard way to draw a focus indicator without a border that shifts the layout.",
  ],
  faq: [
    {
      question: "What do the box-shadow numbers mean?",
      answer: "Horizontal offset, vertical offset, blur radius, then spread. Offset moves the shadow, blur softens its edge, and spread grows or shrinks the shadow before blurring. Negative spread pulls it in, which is how a card shadow shows only at the bottom edge.",
    },
    {
      question: "Why does my box shadow look fake?",
      answer: "Almost always because it is a single layer. Real shadows have a tight dark contact shadow plus a wide soft ambient one. Stack two — a small tight shadow and a larger diffuse one at lower opacity — and it stops reading as a sticker immediately.",
    },
    {
      question: "How do I add multiple shadows in CSS?",
      answer: "Separate them with commas in one box-shadow declaration. The first in the list paints on top, which is the opposite of what most people expect and the usual reason a tight shadow seems to vanish behind a soft one.",
    },
    {
      question: "What does inset do?",
      answer: "It paints the shadow inside the element's border box rather than outside, which is how pressed buttons, inset input fields and inner glows are made. Inset and outer shadows can be mixed in the same declaration.",
    },
    {
      question: "How do I make a focus ring with box-shadow?",
      answer: "Use zero offset, zero blur and a positive spread — that gives a solid ring at a fixed width. Because box-shadow does not affect layout, unlike a border, nothing shifts when the ring appears, which is why it is the standard approach.",
    },
    {
      question: "Does box-shadow hurt performance?",
      answer: "A few static shadows cost nothing. Large blur radii on many elements can, and animating a box-shadow forces a repaint every frame. Where a shadow must animate, cross-fade a pseudo-element's opacity instead, which the compositor can handle.",
    },
  ],
};
