import { UserRoundCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomNamePicker: Tool = {
  slug: "random-name-picker",
  name: "Random Name Picker",
  category: "fun",
  description: "Pick a name at random from a list — for classrooms, draws and choosing who goes first.",
  keywords: [
    "random name picker",
    "pick a name",
    "name picker wheel",
    "classroom name picker",
    "random student picker",
    "raffle picker",
  ],
  icon: UserRoundCheck,
  processing: "client",
  status: "live",
  steps: [
    "Paste the names, one per line.",
    "Pick one, or pick several at once for teams and prizes.",
    "Turn on 'no repeats' so everyone gets a turn before anyone repeats.",
  ],
  notes: [
    "Picks a name at random from a list, with an option that matters more than it sounds: drawing without replacement, so everyone is picked once before anyone is picked twice.",
    "Uniform picking every time is fair in the statistical sense and obviously unfair in a classroom. It will happily call the same child four turns running while another is never called, because independent draws have no memory. Drawing without replacement gives everyone a turn, which is what a teacher actually wants.",
    "Picking several at once is useful for teams and for prize draws. The names come from the browser's cryptographic random source, so a draw run here is defensible.",
  ],
  faq: [
    {
      question: "How do I make sure everyone gets a turn?",
      answer: "Turn on drawing without repeats. Everyone is picked once before anyone is picked twice, which is what a classroom needs — uniform picking will call the same person four times running and skip someone entirely.",
    },
    {
      question: "Can I pick several names at once?",
      answer: "Yes. Set how many you want and that many are drawn together without duplicates, which is how you split a group into teams or draw several prize winners.",
    },
    {
      question: "Is it fair for a prize draw?",
      answer: "The selection uses the browser's cryptographic random source with the bias removed, so every name is equally likely. Recording who was drawn matters as much as the randomness if the result may be questioned.",
    },
    {
      question: "What happens when everyone has been picked?",
      answer: "The round ends and you can start it again, which reshuffles and begins a fresh pass. Nobody is picked twice within a round.",
    },
    {
      question: "How many names can I add?",
      answer: "As many as you can paste — one per line. Hundreds are no problem, since the draw happens in your browser with no server involved.",
    },
  ],
};
