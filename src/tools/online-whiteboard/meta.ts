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
};
