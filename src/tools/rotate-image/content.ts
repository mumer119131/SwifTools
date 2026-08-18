import type { ToolContent } from "@/config/tool-content";

export const rotateImageContent: ToolContent = {
  steps: [
    "Drop in the image.",
    "Turn it in quarter steps, or mirror it horizontally or vertically.",
    "Download the corrected version.",
  ],
  notes: [
    "A photo that looks upright on your phone and sideways everywhere else is almost always correct already — the pixels are rotated, and an orientation flag in the metadata tells viewers to turn it back. Software that reads the flag shows it properly; software that ignores it does not. Rotating here bakes the correction into the pixels themselves, so it looks the same everywhere.",
    "Only quarter turns and mirroring are offered, and that is deliberate. At a right angle every source pixel lands exactly on a destination pixel, so nothing is interpolated and no detail is invented. An arbitrary angle has to resample the whole image and decide what fills the newly empty corners, which softens the result.",
    "Mirroring is not the same as rotating, though the two get confused. A 180° turn and a pair of flips look identical; a single flip reverses the image, which is what you want for a selfie that came out back-to-front and what you must not do to anything containing text.",
  ],
  faq: [
    {
      question: "Why does my photo look upright on my phone but sideways elsewhere?",
      answer: "The image data is rotated, and a metadata flag tells viewers which way to turn it. Your phone reads that flag; the other program does not. Rotating the pixels themselves, as this does, removes the disagreement.",
    },
    {
      question: "Does rotating lose quality?",
      answer: "The turn itself does not — at a right angle each pixel moves to an exact new position with no interpolation. Saving as JPEG re-compresses the file, so choose PNG if you want to be certain nothing is lost, or accept a single generation of JPEG loss.",
    },
    {
      question: "What is the difference between flipping and rotating?",
      answer: "Rotating turns the image; flipping mirrors it. A 180° rotation and flipping both ways look the same, but a single flip reverses the picture — fine for a selfie that came out backwards, wrong for anything with writing in it.",
    },
    {
      question: "Can I rotate by an arbitrary angle?",
      answer: "Not here. Anything other than a right angle has to resample every pixel and fill the corners the rotation leaves empty, which softens the image and needs choices this tool deliberately does not make.",
    },
  ],
};
