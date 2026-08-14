import { NotepadText } from "lucide-react";

import type { Tool } from "@/config/tools";

export const onlineNotepad: Tool = {
  slug: "online-notepad",
  name: "Online Notepad",
  category: "fun",
  description: "A plain text pad that saves as you type and stays in your browser.",
  keywords: [
    "online notepad",
    "notepad online free",
    "text editor online",
    "scratch pad",
    "quick notes online",
    "notepad that saves",
  ],
  icon: NotepadText,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Start typing. Everything is saved as you go.",
    "Word and character counts update live.",
    "Download it as a .txt file, or copy it out.",
  ],
};
