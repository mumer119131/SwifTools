import type { ToolContent } from "@/config/tool-content";

export const signPdfContent: ToolContent = {
  steps: [
    "Drop in the PDF. It is opened by your browser, not uploaded.",
    "Draw your signature with a mouse or finger, or type your name and pick a style.",
    "Click the page where it should go, set the width, and download the signed copy.",
  ],
  notes: [
    "This places a picture of your signature onto the page. That is what people mean by signing a PDF, and it is what the overwhelming majority of contracts sent by email are signed with — a scanned or drawn mark, positioned on the right line.",
    "It is worth being precise about what that is and is not. This is a simple electronic signature: there is no certificate, no cryptographic binding to your identity, and no audit trail recording who applied it or when. It does not prove who signed, and it does not detect whether the document was altered afterwards. For most agreements between parties who already know each other, that is exactly what is being asked for. For anything requiring legal proof of identity — a deed, a mortgage, certain court filings — you need a qualified electronic signature from a provider who can issue one, and no browser tool can do that.",
    "A drawn signature is trimmed to its ink before being placed. Without that step, the empty space around your scribble is baked into the image, so a signature drawn in one corner of the pad lands nowhere near where you clicked and appears far smaller than the width you chose.",
    "The document is read, modified and written back entirely in your browser. That matters more here than almost anywhere else on this site: the PDFs people sign are tenancy agreements, employment contracts, NDAs and financial paperwork, and uploading one to a free converter to add a signature means handing the whole document to a stranger. Open your browser's network tab and watch — nothing leaves.",
  ],
  faq: [
    {
      question: "Is a signature added this way legally binding?",
      answer: "In many places a simple electronic signature is legally valid for ordinary contracts, and this produces one. But it carries no certificate and no audit trail, so it proves nothing about who applied it. For anything needing proof of identity — deeds, mortgages, some court documents — use a provider who issues a qualified signature.",
    },
    {
      question: "Is my document uploaded anywhere?",
      answer: "No. The PDF is opened, modified and saved entirely by your browser. Nothing is transmitted, which is the only sensible arrangement for a contract or a tenancy agreement.",
    },
    {
      question: "Can I sign more than one page?",
      answer: "Sign one page, download the result, then drop that file back in to sign another. Each pass adds a signature to the page you choose.",
    },
    {
      question: "Why does my drawn signature look different on the page?",
      answer: "It is trimmed to the ink before being placed, so the blank space around your drawing is discarded. That is deliberate — without it, the signature would sit away from where you clicked and look much smaller than the width you set.",
    },
    {
      question: "Can I sign a password-protected PDF?",
      answer: "Not while it is protected. Remove the password in whatever opened it originally, sign the file, then re-protect it if you need to.",
    },
    {
      question: "Does signing change the rest of the document?",
      answer: "No. The existing pages, text and images are untouched — the signature is drawn on top of the page you pick, and everything else is written back exactly as it was.",
    },
  ],
};
