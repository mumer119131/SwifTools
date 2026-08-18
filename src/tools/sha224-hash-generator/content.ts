import type { ToolContent } from "@/config/tool-content";

export const sha224HashGeneratorContent: ToolContent = {
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-224 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 224-bit value — 56 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "SHA-224 is SHA-256 computed with different initial values and truncated to 224 bits. It exists to match the security level of 3DES and 112-bit symmetric keys, which is why it turns up in older standards and in DSA parameter sets rather than in new designs.",
    "Like SHA-384, the truncation gives it resistance to length-extension attacks. Outside of interoperating with a specification that names it, there is little reason to prefer it over SHA-256, which is only marginally longer and far more widely implemented.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "What is SHA-224 for?",
      answer: "Matching a 112-bit security level, which is where it came from — pairing with 3DES and certain DSA parameter sets. It appears mainly when interoperating with older standards rather than in new designs.",
    },
    {
      question: "Is SHA-224 weaker than SHA-256?",
      answer: "It offers a smaller margin — 112-bit collision resistance against 128 — but both are far beyond feasible attack. The practical difference is negligible; the compatibility difference is not.",
    },
    {
      question: "How is SHA-224 different from SHA-256?",
      answer: "It is the same algorithm with different initial constants, truncated to 224 bits. The truncation also gives it resistance to length-extension attacks, which full SHA-256 lacks.",
    },
    {
      question: "How long is a SHA-224 hash?",
      answer: "224 bits, shown as 56 hexadecimal characters. Like every hash function, the output length is fixed regardless of whether you hash a single byte or a gigabyte of data.",
    },
    {
      question: "Should I use SHA-224 for new work?",
      answer: "Rarely. SHA-256 is barely longer, more widely supported and more likely to be what another system expects. Choose SHA-224 only when something specific requires it.",
    },
  ],
};
