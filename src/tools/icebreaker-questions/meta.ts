import { MessagesSquare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const icebreakerQuestions: Tool = {
  slug: "icebreaker-questions",
  name: "Icebreaker Questions",
  category: "fun",
  description: "Questions a real group will answer without wincing — for meetings, classes and parties.",
  keywords: ["icebreaker questions","team icebreakers","conversation starters","meeting icebreaker","get to know you questions"],
  icon: MessagesSquare,
  processing: "client",
  status: "live",
  steps: [
    "Generate a set of questions.",
    "Read them out, or copy them into the invite.",
    "Regenerate for a different set.",
  ],
};
