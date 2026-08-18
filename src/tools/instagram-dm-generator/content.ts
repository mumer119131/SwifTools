import type { ToolContent } from "@/config/tool-content";

export const instagramDmGeneratorContent: ToolContent = {
  steps: [
    "Set the contact name and avatar.",
    "Add messages from either side — yours use Instagram's purple-to-orange gradient.",
    "Choose light or dark, then export a PNG.",
  ],
  notes: [
    "Creates a mock Instagram direct message thread as an image — bubbles, profile row, timestamps and seen indicators. The usual reasons to want one are app design mockups, tutorials showing how a feature works, and illustrating a support flow without exposing anyone's real messages.",
    "Rendering on a canvas rather than screenshotting means the output is at whatever resolution you need and free of the surrounding interface, which is what makes it usable in a slide or a document.",
    "Fabricating a message thread and presenting it as a genuine record of what someone said is a form of forgery, and it is treated as such by employers, platforms and courts. The tool has honest uses; this is not one of them.",
  ],
  faq: [
    {
      question: "Does this send an Instagram DM?",
      answer: "No. It draws an image of a message thread. No account is connected and nothing is sent to anyone.",
    },
    {
      question: "What would I use a mock DM for?",
      answer: "App and feature design mockups, tutorials and support documentation, and illustrating a conversation flow in a presentation — cases where a real screenshot would expose private messages.",
    },
    {
      question: "Can I set the profile picture and name?",
      answer: "Yes, along with timestamps, seen indicators and both sides of the conversation, which is what makes a mockup convincing enough to be useful in a design review.",
    },
    {
      question: "Is making a fake DM screenshot against the law?",
      answer: "Creating one is not inherently illegal; presenting it as a genuine record of what someone said can amount to forgery or defamation and has real consequences. The use, not the tool, is what matters.",
    },
    {
      question: "Where is the image generated?",
      answer: "Entirely in your browser on a canvas. Nothing you type or upload is transmitted anywhere.",
    },
  ],
};
