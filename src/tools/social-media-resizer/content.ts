import type { ToolContent } from "@/config/tool-content";

export const socialMediaResizerContent: ToolContent = {
  steps: [
    "Drop in the image you want to adapt.",
    "Tick every placement you need — a square post, a story, a thumbnail, a banner.",
    "Choose which part of the picture to keep, then download them all.",
  ],
  notes: [
    "Every placement gets the full frame cropped to fill it, never squashed. Stretching an image to a new aspect ratio is the one thing that always looks wrong, so the crop takes the largest region of your picture that already has the right shape and scales that.",
    "Which region is the decision that matters, and it is why there is an anchor control rather than just two numbers. A landscape photo cropped centrally to a 1080×1920 story cuts a standing figure off at the chest; anchoring to the top keeps the head. Nothing can rescue a crop that discards three quarters of the frame, and the percentage shown against each size tells you when that is what you are asking for.",
    "The sizes here are what each platform documents as its recommended upload size, not the size it displays at. Uploading larger and letting the platform downscale gives a sharper result than uploading small and letting it upscale. They also change without notice, which is why custom dimensions are available alongside.",
    "Everything is drawn in your browser and nothing is uploaded — which is the point for a tool people reach for with unreleased campaign artwork.",
  ],
  faq: [
    {
      question: "What size should an Instagram post be?",
      answer: "1080×1080 for a square, 1080×1350 for the portrait crop that takes up the most feed space, and 1080×1920 for a story or reel. All three are here as presets.",
    },
    {
      question: "What size is a YouTube thumbnail?",
      answer: "1280×720 — sixteen by nine, matching the video. That is the recommended upload size; YouTube scales it down for the smaller placements, and starting larger keeps it sharp.",
    },
    {
      question: "Why does my image get cropped instead of shrunk to fit?",
      answer: "Because the target has a different shape. Fitting the whole picture inside would leave bars down the sides, and stretching it to fit would distort everything in the frame. Cropping keeps the picture undistorted and fills the space — the anchor control decides which part survives.",
    },
    {
      question: "Can I stop the crop cutting off the important part?",
      answer: "Yes — that is what the anchor is for. A landscape photo cropped centrally into a story usually loses the top of the subject's head; anchoring to the top keeps it. The percentage shown per size warns you when a crop is discarding most of the frame.",
    },
    {
      question: "Are these sizes still current?",
      answer: "They are each platform's documented recommendation, but platforms change them without announcement. Treat them as a good default and use the custom size box when you have been given an exact spec.",
    },
    {
      question: "Are my images uploaded?",
      answer: "No. Every crop is drawn by your browser and the files never leave your device, which matters when the artwork is for a campaign that has not launched.",
    },
  ],
};
