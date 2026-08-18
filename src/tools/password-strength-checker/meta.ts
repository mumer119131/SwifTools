import { ShieldQuestion } from "lucide-react";

import type { Tool } from "@/config/tools";

export const passwordStrengthChecker: Tool = {
  slug: "password-strength-checker",
  name: "Password Strength Checker",
  category: "generator",
  description: "How long a password would actually take to guess, and what is weakening it.",
  keywords: [
    "password strength checker",
    "how strong is my password",
    "password entropy calculator",
    "test password strength",
    "is my password secure",
    "password checker",
  ],
  icon: ShieldQuestion,
  processing: "client",
  status: "live",
};
