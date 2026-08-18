import type { ToolContent } from "@/config/tool-content";

export const faviconGeneratorContent: ToolContent = {
  steps: [
    "Upload a logo, or type a letter and pick colours.",
    "Check the previews at real size — 16 pixels is smaller than people expect.",
    "Download the ZIP: every PNG, a multi-resolution favicon.ico, the manifest and the HTML to paste.",
  ],
  notes: [
    "A complete favicon set is more than one file. Browsers want a 16 and 32 pixel PNG for tabs, iOS wants a 180 pixel apple-touch-icon and ignores the web manifest entirely, and Android reads 192 and 512 pixel icons from the manifest for the home screen and the install prompt. All of them are produced here along with a real multi-resolution favicon.ico.",
    "The ICO is written by hand, because there is no canvas.toBlob for it — the format is an old Windows container with a six-byte header, a sixteen-byte directory entry per image and the image data appended. Modern browsers accept PNG payloads inside an ICO, which is what this writes. It still matters: a browser requests /favicon.ico whether or not you link one, so a site without it takes a 404 on every page load.",
    "Every size is rendered from your original artwork rather than by shrinking one large rendering. Downscaling a detailed 512 pixel icon to 16 pixels turns it into grey mush; drawing each size from the full-resolution source lets the browser resample from the original every time. It still pays to check the 16 pixel preview — anything with fine detail or more than two words will not survive it.",
  ],
  faq: [
    {
      question: "What sizes do I need for a favicon?",
      answer: "16 and 32 pixels for browser tabs, 48 for Windows shortcuts, 180 for the iOS home screen, and 192 and 512 for Android and the PWA install prompt. A favicon.ico containing 16, 32 and 48 covers browsers that request it directly.",
    },
    {
      question: "Do I still need favicon.ico?",
      answer: "Yes. Browsers request /favicon.ico from the site root whether or not you link to one, so without the file every page load takes a 404. It is also what appears in some older bookmark and history views that ignore the PNG links.",
    },
    {
      question: "Why does my favicon look blurry or muddy?",
      answer: "Almost always too much detail for 16 pixels. A favicon has about the area of a full stop at reading distance — a full logo with text will not survive it. Use a single letter, a monogram or the most distinctive shape from your mark, and check the 16 pixel preview before shipping.",
    },
    {
      question: "Can a favicon have a transparent background?",
      answer: "PNG icons can, and it looks right in a light browser tab. Bear in mind dark mode and the iOS home screen, where iOS composites the apple-touch-icon onto black — a transparent dark logo becomes invisible. A solid background is the safer choice for the touch icon.",
    },
    {
      question: "Where do the favicon files go?",
      answer: "In the site root, so they resolve at /favicon.ico and /apple-touch-icon.png, then paste the supplied link tags into your head. On Next.js App Router put them in the app directory instead — favicon.ico, icon.png, apple-icon.png and manifest.webmanifest — and the framework emits the tags for you.",
    },
    {
      question: "Is my logo uploaded to make the icons?",
      answer: "No. Every size is drawn on a canvas in your own browser and the ZIP is assembled locally, so an unreleased brand mark never leaves your machine.",
    },
  ],
};
