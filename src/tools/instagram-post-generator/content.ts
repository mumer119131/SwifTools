import type { ToolContent } from "@/config/tool-content";

export const instagramPostGeneratorContent: ToolContent = {
  steps: [
    "Upload a photo and pick one of Instagram's three aspect ratios.",
    "Set the username, location, caption and engagement counts.",
    "Export a PNG for a pitch deck, a portfolio piece or a social preview.",
  ],
  notes: [
    "Builds a mock Instagram feed post — image, profile row, caption, like and comment counts — rendered as a downloadable picture. Instagram feed posts are 1080 pixels wide, and the three supported shapes are 1:1 square, 4:5 portrait and 1.91:1 landscape.",
    "Portrait at 4:5 takes the most vertical space in a feed and is what most accounts default to for reach. Square is the safest for a grid, because the profile grid crops everything to squares anyway and a portrait post loses its top and bottom there.",
    "This produces a picture of a post, not a post. It is for mockups, pitch decks, client presentations and content planning — showing what something will look like in situ before it is published.",
  ],
  faq: [
    {
      question: "What size is an Instagram post?",
      answer: "1080 pixels wide, with three supported shapes: 1:1 square, 4:5 portrait and 1.91:1 landscape. Portrait takes the most feed space and is what most accounts use for reach.",
    },
    {
      question: "Should I post square or portrait?",
      answer: "Portrait for the feed, because it occupies more of the screen. Square if the grid matters to you — the profile grid crops everything to squares, so a portrait post loses its top and bottom there.",
    },
    {
      question: "Does this publish to Instagram?",
      answer: "No. It produces an image showing what a post would look like. There is no account connection and nothing is published.",
    },
    {
      question: "What is an Instagram post mockup used for?",
      answer: "Client presentations, pitch decks, content calendars and design reviews — anywhere you need to show how something will look in a feed before committing to publishing it.",
    },
    {
      question: "Is my image uploaded?",
      answer: "No. The mockup is composited on a canvas in your browser, so unpublished creative work stays on your machine.",
    },
  ],
};
