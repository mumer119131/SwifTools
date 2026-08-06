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
  steps: [
    "Paste a JWT. The header and payload decode instantly — no signature needed to read them.",
    "Expiry and issued-at claims are shown as readable dates, with a warning if the token has expired.",
    "Add the shared secret to verify an HS256/384/512 signature, entirely in your browser.",
  ],
};
