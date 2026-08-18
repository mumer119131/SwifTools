import type { ToolContent } from "@/config/tool-content";

export const imessageChatGeneratorContent: ToolContent = {
  steps: [
    "Set the contact name and avatar.",
    "Add messages from either side — yours render in iMessage blue, theirs in grey.",
    "Choose light or dark, then download at up to 3×.",
  ],
  notes: [
    "Creates a mock iMessage conversation as an image, with the blue and grey bubble convention, tapbacks, delivery status and the iOS layout. The blue-versus-green distinction is reproduced because it carries meaning: blue is iMessage between Apple devices, green is SMS to everything else.",
    "The output is drawn on a canvas at a resolution you choose, so it holds up in a presentation or a printed page rather than being a low-resolution crop of a phone screen.",
    "As with any chat mockup, the honest uses are illustration — app design, tutorials, fiction, comics — and the dishonest one is passing a fabricated conversation off as a record of something real. That distinction matters legally as well as ethically.",
  ],
  faq: [
    {
      question: "Why are some iMessage bubbles blue and others green?",
      answer: "Blue means the message went over iMessage between Apple devices; green means it fell back to SMS, which happens when the recipient is not on an Apple device or has no data connection. The mockup reproduces both.",
    },
    {
      question: "Does this send real messages?",
      answer: "No. It produces an image of a conversation. No account, no device and no message is involved at any point.",
    },
    {
      question: "Can I include tapbacks and delivery status?",
      answer: "Yes — reactions, delivered and read indicators and timestamps are all available, which is usually what makes a mockup read as authentic in a design review.",
    },
    {
      question: "What is this used for?",
      answer: "App design mockups, tutorials, storyboards, comics and fiction — showing a conversation without needing a real one, and without exposing anyone's actual messages.",
    },
    {
      question: "Is the conversation stored anywhere?",
      answer: "No. Everything is rendered locally in your browser and the image is downloaded from memory. Nothing is transmitted or retained.",
    },
  ],
};
