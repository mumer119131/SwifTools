import { Vault } from "lucide-react";

import type { Tool } from "@/config/tools";

export const passwordManager: Tool = {
  slug: "password-manager",
  name: "Password Manager",
  category: "fun",
  description: "An offline vault encrypted with your master password — stored only in this browser.",
  keywords: [
    "password manager",
    "offline password vault",
    "local password manager",
    "encrypted password storage",
    "browser password vault",
  ],
  icon: Vault,
  processing: "client",
  status: "live",
  steps: [
    "Set a master password. It is never stored — the key is derived from it each time.",
    "Add entries. They are encrypted with AES-GCM before anything is written down.",
    "The vault locks itself after five minutes of inactivity.",
  ],
};
