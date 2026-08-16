import { Pencil } from "lucide-react";

import type { Tool } from "@/config/tools";

export const onlineWhiteboard: Tool = {
  slug: "online-whiteboard",
  name: "Online Whiteboard",
  category: "fun",
  description: "A blank canvas to sketch on — pen, eraser, colours, undo and PNG export.",
  keywords: [
    "online whiteboard",
    "free drawing canvas",
    "sketch online",
    "digital whiteboard",
    "draw online free",
    "online sketchpad",
  ],
  icon: Pencil,
  processing: "client",
  status: "live",
  steps: [
    "Draw with a mouse, trackpad, stylus or finger.",
    "Change the colour and brush size, or switch to the eraser.",
    "Undo as far back as you like, and download the result as a PNG.",
  ],
  notes: [
    "The board is redrawn from a list of strokes rather than painted permanently onto pixels, which is what makes undo and redo work at all — there are no pixels to reverse, only a list to shorten.",
    "Pointer events are used throughout, so a mouse, a trackpad, a finger and a stylus all behave identically with no separate code path. Pressure is not used, so line weight is set by the size control rather than by how hard you press.",
    "Nothing is saved. A reload clears the board, which is deliberate for a scratch surface but means anything worth keeping should be downloaded as a PNG before you close the tab.",
  ],
  faq: [
    {
      question: "Is my drawing saved if I refresh the page?",
      answer: "No. The board is a scratch surface and clears on reload. Download the PNG before closing the tab if you want to keep anything.",
    },
    {
      question: "How does undo work?",
      answer: "The board is redrawn from a list of strokes on every change rather than painted permanently, so undoing is simply shortening the list. That is why it can go back as far as you like.",
    },
    {
      question: "Can I draw with a stylus or my finger?",
      answer: "Yes. Pointer events handle mouse, trackpad, touch and stylus identically. Pressure sensitivity is not used, so line weight comes from the size control rather than how hard you press.",
    },
    {
      question: "Can several people draw on the same board?",
      answer: "No — this is a single-user scratch surface with no server behind it. Collaborative whiteboards need a backend to synchronise strokes between people.",
    },
    {
      question: "What format does it export?",
      answer: "PNG, on a white background at the canvas resolution. That drops straight into a document or a message without further conversion.",
    },
  ],
};
