import type { ToolContent } from "@/config/tool-content";

export const jwtDecoderContent: ToolContent = {
  steps: [
    "Paste a JWT. The header and payload decode instantly — no signature needed to read them.",
    "Expiry and issued-at claims are shown as readable dates, with a warning if the token has expired.",
    "Add the shared secret to verify an HS256/384/512 signature, entirely in your browser.",
  ],
  notes: [
    "A JSON Web Token is three Base64url-encoded parts separated by dots: a header saying which algorithm signed it, a payload of claims, and a signature. The first two are encoded, not encrypted — anyone holding a token can read its contents. That is by design, and it is why a JWT should never carry a secret.",
    "This decodes the header and payload and, if you supply the secret or public key, verifies the signature with Web Crypto. Decoding tells you what a token claims; only verification tells you whether to believe it. A decoder that skips verification is fine for debugging and disastrous as an authorisation check.",
    "The claims worth checking are exp and nbf. exp is expiry and nbf is not-before, both as Unix seconds, and both are shown here as readable dates alongside whether the token is currently valid. A surprising share of authentication bugs are a clock difference of a few seconds between two servers.",
  ],
  faq: [
    {
      question: "Can anyone read the contents of a JWT?",
      answer: "Yes. The header and payload are Base64url-encoded, not encrypted, and decode with no key at all. Never put anything secret in a token — the signature proves it has not been altered, it does not hide it.",
    },
    {
      question: "What is the difference between decoding and verifying a JWT?",
      answer: "Decoding reads the claims and requires nothing. Verifying checks the signature against the secret or public key and proves the token was issued by who it says and has not been tampered with. Only verification is a security check.",
    },
    {
      question: "Why is my token showing as expired?",
      answer: "The exp claim is a Unix timestamp in seconds, and it has passed. A common cause of unexpected expiry is clock skew between the issuing and validating servers — even a few seconds can reject a freshly issued token.",
    },
    {
      question: "Which signing algorithms are supported?",
      answer: "HS256, HS384 and HS512 with a shared secret, and RS256, RS384 and RS512 with a public key. Verification runs through Web Crypto in the browser.",
    },
    {
      question: "Is my token sent anywhere when I paste it?",
      answer: "No. Decoding and signature verification both happen locally. That matters a great deal here — a JWT pasted into a debugger is usually a live session credential.",
    },
  ],
};
