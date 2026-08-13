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
};
