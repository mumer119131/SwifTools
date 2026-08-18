import type { ToolContent } from "@/config/tool-content";

export const instagramStoryGeneratorContent: ToolContent = {
  steps: [
    "Upload a photo, or pick a gradient if you want a text-only frame.",
    "Add your caption and username — the caption sits on a translucent plate so it stays readable.",
    "Export at 1080×1920, the exact size Instagram expects.",
  ],
  notes: [
    "Stories are 1080 by 1920 pixels, a 9:16 ratio matching a phone screen held upright. Getting the dimensions right matters more here than for a feed post, because a story that is the wrong shape is either cropped or letterboxed and both look careless.",
    "The safe area is the part people forget. The top and bottom roughly 250 pixels are covered by the interface — profile row and progress bars above, reply box and share controls below — so anything important placed there is obscured on a real phone even though it looked fine in the editor.",
    "The mockup shows those overlays, which is the point: it lets you check that your text sits where it will actually be readable rather than discovering the problem after publishing.",
  ],
  faq: [
    {
      question: "What size is an Instagram story?",
      answer: "1080 by 1920 pixels, a 9:16 ratio. Anything else is cropped or letterboxed, and both look careless next to correctly sized stories.",
    },
    {
      question: "What is the safe area in a story?",
      answer: "The middle portion, avoiding roughly 250 pixels top and bottom where the interface sits — profile and progress bars above, reply and share controls below. Text placed there is covered on a real phone.",
    },
    {
      question: "Can I mock up a multi-slide story?",
      answer: "Generate each slide separately at the same dimensions. Keeping the safe area consistent across them is what makes a sequence look designed rather than assembled.",
    },
    {
      question: "Does this post the story?",
      answer: "No. It produces images showing what stories would look like, including the interface overlays, so you can check placement before publishing anything.",
    },
    {
      question: "Why does my text get covered on my phone?",
      answer: "Because it is inside the interface overlay zone. The editor shows the full 1080 by 1920 canvas; the app draws its own controls over the top and bottom of it.",
    },
  ],
};
