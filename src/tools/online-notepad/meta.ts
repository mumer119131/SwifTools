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
  notes: [
    "A plain text pad that saves as you type. There is no account, no sign-up and no upload — the note lives in this browser's local storage, which is why it opens instantly and asks nothing of you.",
    "That is a real trade rather than a free lunch. It will not appear on another device, and clearing site data deletes it. Download anything you would be sorry to lose; browsers also cap local storage at a few megabytes, which is a very long note but not an unlimited one.",
    "Word, character and line counts update live, which makes it usable for drafting to a limit as well as for scratch notes.",
  ],
  faq: [
    {
      question: "Does the notepad save automatically?",
      answer: "Yes, as you type, in this browser's local storage. Closing the tab and returning later brings the note back — but it does not sync to another device and clearing site data deletes it.",
    },
    {
      question: "Is my note private?",
      answer: "It never leaves your browser. There is no server and no account, so nothing is transmitted — which also means nobody can recover it for you if the browser data is cleared.",
    },
    {
      question: "Can I download my note?",
      answer: "Yes, as a plain .txt file. That is worth doing for anything you would be sorry to lose, since browser storage is not a backup.",
    },
    {
      question: "How much text can it hold?",
      answer: "Browsers cap local storage at a few megabytes, which is on the order of a million characters — a very long document, but not unlimited. Very large notes are better kept in a file.",
    },
    {
      question: "Does it work offline?",
      answer: "Once the page has loaded, yes — nothing it does requires a network connection, since all the work happens in the browser.",
    },
  ],
};
