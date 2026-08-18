import type { ToolContent } from "@/config/tool-content";

export const whatsappChatGeneratorContent: ToolContent = {
  steps: [
    "Set the contact name, status line and avatar.",
    "Add messages from either side, with timestamps and one, two or blue ticks.",
    "Switch between light and dark, then download at up to 3× for a crisp image.",
  ],
  notes: [
    "Builds a mock WhatsApp conversation as an image — message bubbles, timestamps, read receipts, contact name and the familiar layout. Useful for tutorials, support documentation, app mockups, comics and storyboards where you need to show a conversation rather than describe one.",
    "It is drawn on a canvas at whatever resolution you choose, so the result stays legible in a slide deck or a printed document, which a phone screenshot cropped from a real chat does not.",
    "A word of caution, because this is the tool most open to misuse: a fabricated conversation presented as evidence of what someone said is forgery, and courts and employers take it seriously. Use it for illustration, not to represent something that did not happen.",
  ],
  faq: [
    {
      question: "Does this send any messages?",
      answer: "No. It draws a picture of a conversation. No WhatsApp account is involved, nothing is sent, and there is no chat behind the image.",
    },
    {
      question: "What is this useful for?",
      answer: "Tutorials and support documentation, app and design mockups, comics and storyboards, and slides where you need to show a conversation rather than describe it — anywhere a real screenshot would be awkward to obtain or would expose private messages.",
    },
    {
      question: "Can I add both sides of the conversation?",
      answer: "Yes. Each message is assigned to either side, with timestamps and read receipts, so a realistic back-and-forth can be built up line by line.",
    },
    {
      question: "Is it legal to make a fake chat screenshot?",
      answer: "Making one is not, in itself, illegal. Presenting it as a real record of what someone said is forgery and can be a criminal matter as well as grounds for dismissal or a lawsuit — the question is what you do with it.",
    },
    {
      question: "Are my messages uploaded?",
      answer: "No. The image is rendered on a canvas in your browser, so whatever you type stays on your device.",
    },
  ],
};
