import type { ToolContent } from "@/config/tool-content";

export const redactImageContent: ToolContent = {
  steps: [
    "Drop in the photo or screenshot.",
    "Drag over anything you want obscured — a face, a plate, an address, a name.",
    "Pick how strongly to obscure it, then download.",
  ],
  notes: [
    "The important property of a redaction tool is that it actually destroys the pixels. Drawing a black rectangle over something in a document editor famously does not — the content sits underneath, recoverable by anyone who copies it — and governments, law firms and newspapers have all published documents that way. The same mistake is easy to make with images by compositing an overlay and calling it done. Here the pixels are read, replaced and written back, so the originals are gone from the file rather than hidden behind something.",
    "The three options are not equally safe, and the tool says which is which rather than leaving you to assume. A solid block is irreversible: the values are replaced with a flat colour and nothing survives. Pixelation is strong provided the blocks are coarse — fine pixelation of text has been reversed by rendering candidate strings and comparing them against the output, so use larger blocks than feel necessary. Blur is the weakest: a mild blur is in principle invertible and has been reversed on real images. Use it for aesthetics, not for anything that matters.",
    "The output is PNG rather than JPEG deliberately. Lossy compression works by discarding detail in a way that depends on the surrounding pixels, and a redacted region in a lossy file can in principle carry traces of what the encoder saw. PNG is lossless, so what you see is exactly what is stored.",
    "One thing this cannot remove: metadata. A photo also carries the camera, the timestamp and often the GPS coordinates, none of which are visible in the picture. Blurring a face and leaving the coordinates of where it was taken is a common and self-defeating mistake — the EXIF tool handles that half.",
    "All of it runs in your browser. Uploading an image to a stranger's server in order to hide something in it would rather defeat the purpose.",
  ],
  faq: [
    {
      question: "Is blurring a face actually safe?",
      answer: "Less than people assume. A mild blur is mathematically invertible in principle and has been reversed on real images. For anything that matters — an address, a document, a plate — use a solid block or coarse pixelation, both of which genuinely destroy the underlying values.",
    },
    {
      question: "Can pixelation be reversed?",
      answer: "Coarse pixelation cannot: each block becomes a single average colour and the detail inside it is gone. Fine pixelation of text has been reversed, by rendering candidate strings and matching them against the output. If in doubt, use bigger blocks than look necessary.",
    },
    {
      question: "Why does it save as PNG rather than JPEG?",
      answer: "Because PNG is lossless. JPEG discards detail in a way that depends on neighbouring pixels, so a redacted area in a lossy file can in principle retain traces of what was there. What you see in a PNG is exactly what is stored.",
    },
    {
      question: "Does this remove location data from the photo?",
      answer: "No — that is separate, and worth doing too. A photo carries the camera, timestamp and often GPS coordinates in its metadata, none of which are visible in the image. Blurring a face while leaving the coordinates attached is a common mistake.",
    },
    {
      question: "Does the picture get sent anywhere to be redacted?",
      answer: "No. It is read and modified entirely by your browser, which is rather the point — sending an image to someone else's server in order to hide something in it is self-defeating.",
    },
  ],
};
