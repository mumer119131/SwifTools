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
};
