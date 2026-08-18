import { KeySquare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jwtDecoder: Tool = {
  slug: "jwt-decoder",
  name: "JWT Decoder",
  category: "developer",
  description: "Decode a JSON Web Token's header and payload, and verify an HMAC signature.",
  keywords: ["jwt decoder", "jwt debugger", "decode json web token", "jwt verify signature"],
  icon: KeySquare,
  processing: "client",
  status: "live",
  popular: true,
};
