import type { ToolContent } from "@/config/tool-content";

export const barcodeGeneratorContent: ToolContent = {
  steps: [
    "Pick the symbology — Code 128 for anything internal, EAN or UPC for retail.",
    "Type the value. Check digits are calculated for you where the format needs one.",
    "Adjust the size and download it as SVG, which stays sharp at any scale.",
  ],
  notes: [
    "Which format you need is usually decided for you. Code 128 takes any printable text and is what shipping labels, asset tags and warehouse systems use. EAN-13 and UPC-A are retail product codes — thirteen and twelve digits — and the numbers in them are allocated by GS1, so you cannot invent one for a product you intend to sell in shops. Code 39 is older, less dense and still required by some industrial and defence systems.",
    "The check digit is the part worth getting right, and the reason this calculates it for you. EAN and UPC codes end in a digit derived from the others by a weighted sum. Get it wrong and the barcode renders perfectly, looks entirely convincing, and scans as nothing at all — there is no visual feedback of any kind. Paste a full code and the last digit is recomputed rather than trusted, so a mistyped one is corrected.",
    "Downloads are SVG rather than PNG on purpose. A barcode is a precision object: the ratio between bar widths is what a scanner reads, and a bitmap scaled up develops soft edges that blur narrow bars into their neighbours. Vector output stays exact at any size, including at the printer's resolution rather than your screen's.",
    "Two practical points for printing. Keep the white space either side — the quiet zone is part of the symbol, and scanners use it to find the edges. And print at 100% rather than 'fit to page', which silently rescales and can push narrow bars below what a scanner resolves. Test one with the actual scanner before committing to a print run.",
    "Everything is generated in your browser. No account, no watermark, and nothing about your product codes is sent anywhere.",
  ],
  faq: [
    {
      question: "Which barcode format should I use?",
      answer: "Code 128 for anything internal — shipping, inventory, asset tags — because it takes letters as well as digits and is compact. EAN-13 or UPC-A only for retail products, and only with a number allocated to you by GS1.",
    },
    {
      question: "Can I make my own EAN-13 for a product I sell?",
      answer: "Not for retail. The number identifies your company and is issued by GS1, so an invented one either fails to scan against a retailer's catalogue or collides with someone else's product. For your own internal stock control, use Code 128 and any numbering you like.",
    },
    {
      question: "What is the check digit and do I need to work it out?",
      answer: "It is a final digit calculated from the others by a weighted sum, so a scanner can detect a misread. You do not need to work it out — enter the 12 digits of an EAN-13 and it is appended for you. Paste all 13 and the last one is recalculated rather than trusted.",
    },
    {
      question: "Why does my printed barcode not scan?",
      answer: "Usually scale or quiet zone. Printing 'fit to page' rescales the bars unevenly; print at 100%. And the white margin either side is part of the symbol, so cropping tight to the bars removes what the scanner uses to find them. Low contrast and glossy laminate are the next two causes.",
    },
    {
      question: "Why SVG rather than PNG?",
      answer: "Because a barcode is read from the ratio of bar widths. A bitmap enlarged for print softens those edges and can blur narrow bars together; a vector stays exact at any size and prints at the printer's resolution rather than your screen's.",
    },
  ],
};
