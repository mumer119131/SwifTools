import { KeyRound } from "lucide-react";

import type { Tool } from "@/config/tools";

export const passwordGenerator: Tool = {
  slug: "password-generator",
  name: "Password Generator",
  category: "generator",
  description: "Generate strong random passwords or passphrases, with a real entropy estimate.",
  keywords: ["password generator", "strong password", "random password", "secure password"],
  icon: KeyRound,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Choose a random string or a memorable passphrase, and set the length.",
    "Entropy is calculated from the character set you picked, with a plain-English crack-time estimate.",
    "Copy it straight into your password manager — nothing is generated on or sent to a server.",
  ],
};
