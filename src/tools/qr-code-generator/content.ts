import type { ToolContent } from "@/config/tool-content";

export const qrCodeGeneratorContent: ToolContent = {
  steps: [
    "Pick what the code should contain — a URL, plain text, Wi-Fi credentials or a contact card.",
    "Adjust size, colours and error-correction level. The preview redraws as you type.",
    "Download a PNG for print or an SVG that stays sharp at any size.",
  ],
  notes: [
    "QR codes encode data in a two-dimensional grid with built-in Reed-Solomon error correction, which is why a code still scans with a logo over the middle or a corner scuffed. Four correction levels are available, recovering roughly 7, 15, 25 and 30 percent of the code.",
    "Higher correction means a denser grid for the same data, so it is a trade rather than a free upgrade. Use low correction for a clean screen or a flat printed page, and high correction only when you are covering part of the code or printing on something that will be handled.",
    "The commonest practical failure is size. A QR code needs roughly one centimetre of width for every ten centimetres of scanning distance, plus a clear quiet zone around it of at least four modules. A code printed small on a poster read from across a room will not scan no matter how good the phone is.",
  ],
  faq: [
    {
      question: "What size should a QR code be printed?",
      answer: "Roughly one centimetre of code for every ten centimetres of scanning distance, so a poster read from two metres needs about twenty centimetres. Leave a clear margin of at least four modules around it as well.",
    },
    {
      question: "Can I put a logo in the middle of a QR code?",
      answer: "Yes, thanks to the built-in error correction. Use the high correction level and keep the logo under about 25 percent of the area — beyond that you are eating into the data the correction is meant to protect.",
    },
    {
      question: "Do QR codes expire?",
      answer: "The code itself never expires — it is a static encoding of whatever you put in it. What expires is the destination: if it points at a URL you later remove, the code breaks. Point it at a URL you control and can redirect.",
    },
    {
      question: "How much data can a QR code hold?",
      answer: "Up to about 4,300 alphanumeric characters in theory, but a dense code is hard to scan. For URLs, shorter is better — a long URL produces a fine grid that struggles on a phone camera at any distance.",
    },
    {
      question: "Is the QR code generated on a server?",
      answer: "No, it is encoded in your browser. That matters when the code contains a WiFi password, a private URL or contact details, none of which are transmitted.",
    },
  ],
};
