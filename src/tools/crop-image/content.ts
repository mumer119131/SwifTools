import type { ToolContent } from "@/config/tool-content";

export const cropImageContent: ToolContent = {
  steps: [
    "Drop in the image you want to crop.",
    "Drag the corners of the selection box, or pick a fixed ratio like 1:1 or 16:9.",
    "Crop and download. The output is cut at full resolution, not at preview size.",
  ],
  notes: [
    "Cropping removes pixels from the edges. It is lossless in the sense that the pixels kept are untouched — nothing is rescaled or re-encoded beyond what saving in the chosen format requires — but the removed area is gone, so work from a copy if you might want it back.",
    "The preset ratios exist because most crops end up in a slot with a fixed shape: 1:1 for a profile picture, 16:9 for a video thumbnail or slide, 4:5 for an Instagram portrait post, 3:2 for a standard print. Locking the ratio before you drag saves discovering afterwards that the frame is three pixels off square.",
    "Crop first, then resize. Cropping decides what is in the picture and resizing decides how many pixels describe it; doing them the other way round means you resize data you are about to throw away, and the surviving area ends up with fewer pixels than it needed.",
  ],
  faq: [
    {
      question: "Does cropping reduce image quality?",
      answer: "The pixels you keep are unchanged. Nothing is rescaled or blurred — the image is simply smaller because the edges are gone. If you save to JPEG the re-encode costs a little, so use PNG when you need an exact copy of the retained area.",
    },
    {
      question: "What aspect ratio should I use for a profile picture?",
      answer: "1:1, square. Almost every platform crops to a circle inside a square, so anything else will be cut. Keep the subject well inside the frame — the circular mask removes the corners.",
    },
    {
      question: "Can I crop to an exact pixel size?",
      answer: "Crop to the right shape first using the ratio lock, then resize the result to the exact dimensions. Trying to hit an exact pixel count by dragging is fiddly and unnecessary.",
    },
    {
      question: "Should I crop or resize first?",
      answer: "Crop first. It determines what is in the picture; resizing then decides how many pixels describe that area. Resizing first wastes effort on pixels you are about to discard and leaves the kept region with fewer than it should have.",
    },
    {
      question: "Is my image uploaded when I crop it?",
      answer: "No. The crop is performed on a canvas in your browser and the result is downloaded from memory, so the picture never leaves your device.",
    },
  ],
};
