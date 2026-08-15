import { FileImage } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pdfToJpg: Tool = {
  slug: "pdf-to-jpg",
  name: "PDF to JPG",
  category: "pdf",
  description: "Turn every page of a PDF into a high-quality JPG or PNG image.",
  keywords: [
    "pdf to jpg",
    "pdf to image",
    "convert pdf to png",
    "pdf to jpg converter free",
    "extract images from pdf",
  ],
  icon: FileImage,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in your PDF.",
    "Choose the output format and resolution — 150 DPI suits the screen, 300 DPI suits print.",
    "Convert, then download a single image or a ZIP of every page.",
  ],
  notes: [
    "Each page is rendered to a canvas at the resolution you choose and saved as a JPG. Rendering is done by pdf.js — the same engine Firefox uses to display PDFs — so what you get is what a PDF reader would show, including vector graphics and embedded fonts rasterised at the target size.",
    "Resolution is the setting that matters. 150 DPI is fine for viewing on screen; 300 DPI is what you want if the image will be printed, and produces files roughly four times larger. Rendering a page at higher DPI genuinely recovers detail from vector content and text, because those are drawn fresh at whatever size you ask for rather than scaled up from pixels.",
    "The output is JPG, which is lossy and does not support transparency. For pages that are mostly text or line art, PNG at the same resolution will look cleaner and often be smaller — convert the result with the image converter if that matters.",
  ],
  faq: [
    {
      question: "What resolution should I use?",
      answer: "150 DPI for anything viewed on a screen, and 300 DPI if it will be printed. Going above 300 rarely helps: it quadruples the file size for detail the eye cannot resolve on paper.",
    },
    {
      question: "Can I convert only some pages?",
      answer: "Yes. Choose the pages you want before converting, and only those are rendered. Each page becomes its own JPG file.",
    },
    {
      question: "Why does my text look soft in the JPG?",
      answer: "Either the resolution is too low, or JPG compression is showing. Text is line art, and JPG is designed for photographs — it puts faint halos around sharp edges. Render at 300 DPI, or convert to PNG instead, which handles hard edges without artefacts.",
    },
    {
      question: "Does this work with password-protected PDFs?",
      answer: "Not while they are encrypted. The page content cannot be rendered without the password, so remove the protection first and convert the unprotected file.",
    },
    {
      question: "Are my pages uploaded to convert them?",
      answer: "No. pdf.js renders each page onto a canvas in your own browser and the images are encoded on your device. Nothing is transmitted.",
    },
  ],
};
