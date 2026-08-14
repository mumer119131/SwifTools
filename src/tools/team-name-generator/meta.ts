import { Users } from "lucide-react";

import type { Tool } from "@/config/tools";

export const teamNameGenerator: Tool = {
  slug: "team-name-generator",
  name: "Team Name Generator",
  category: "fun",
  description: "Names for quiz teams, sports sides and work squads — adjective plus noun, done right.",
  keywords: ["team name generator","quiz team names","funny team names","sports team name ideas","group name generator"],
  icon: Users,
  processing: "client",
  status: "live",
  steps: [
    "Generate a batch of adjective-and-noun team names.",
    "Regenerate until one makes the group laugh.",
    "Copy the whole list to put to a vote.",
  ],
};
