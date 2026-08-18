import type { ToolContent } from "@/config/tool-content";

export const sha512HashGeneratorContent: ToolContent = {
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-512 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 512-bit value — 128 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "SHA-512 is the 512-bit member of the SHA-2 family. It uses 64-bit words internally, which makes it genuinely faster than SHA-256 on 64-bit processors despite producing twice the output — an unusual case where the stronger option is also the quicker one.",
    "The extra length is rarely needed for security, since SHA-256 already exceeds any feasible attack. It is used where a longer digest is specified — in some key-derivation schemes, and as the basis for SHA-512/256, which truncates the output to gain SHA-512's speed with SHA-256's length.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "Is SHA-512 more secure than SHA-256?",
      answer: "In theory it offers a larger margin, but SHA-256 is already far beyond any feasible attack, so the practical difference is nil. Choose SHA-512 when a specification calls for it, not for extra safety.",
    },
    {
      question: "Why is SHA-512 sometimes faster than SHA-256?",
      answer: "It operates on 64-bit words, which modern 64-bit processors handle in a single operation. On such hardware it processes more data per round despite producing a longer digest.",
    },
    {
      question: "How long is a SHA-512 hash?",
      answer: "512 bits, written as 128 hexadecimal characters. That is twice the length of SHA-256 and four times MD5.",
    },
    {
      question: "What is SHA-512/256?",
      answer: "SHA-512 run with different initial values and truncated to 256 bits. It gives SHA-512's speed on 64-bit hardware with a SHA-256-length output, and resists length-extension attacks that plain SHA-256 does not.",
    },
    {
      question: "Can I use SHA-512 for password storage?",
      answer: "Not directly. Like all SHA-2 functions it is built for speed, which favours the attacker. Use a purpose-built password hash such as Argon2, bcrypt or scrypt.",
    },
  ],
};
