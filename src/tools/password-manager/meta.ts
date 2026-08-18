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
};
