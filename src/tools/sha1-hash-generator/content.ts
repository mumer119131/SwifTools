import type { ToolContent } from "@/config/tool-content";

export const sha1HashGeneratorContent: ToolContent = {
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-1 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 160-bit value — 40 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "SHA-1 was theoretically weakened from 2005 and practically broken in 2017, when Google produced two different PDFs sharing a hash. Every major browser stopped trusting SHA-1 certificates that year, and NIST formally retired it in 2030 planning.",
    "Git still uses SHA-1 for object identifiers, which is safe in that context because it is guarding against accidental collision rather than a deliberate attacker, and Git has hardened against the known attack. Do not use it for anything new.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "Has SHA-1 actually been broken?",
      answer: "Yes, in practice. In 2017 Google published two different PDF files with the same SHA-1 hash, which took large but achievable computing resources. The cost has fallen considerably since.",
    },
    {
      question: "Why does Git still use SHA-1?",
      answer: "Because Git guards against accidental collision rather than a determined attacker, and it has since added detection for the known attack pattern. Git is also migrating to SHA-256. Neither reason makes SHA-1 suitable for new work.",
    },
    {
      question: "What should I use instead of SHA-1?",
      answer: "SHA-256 for general hashing, and bcrypt, scrypt or Argon2 for passwords. SHA-256 is a drop-in replacement in almost every context and has no known practical weakness.",
    },
    {
      question: "How long is a SHA-1 hash?",
      answer: "160 bits, shown as 40 hexadecimal characters — longer than MD5's 32 and shorter than SHA-256's 64.",
    },
    {
      question: "Is SHA-1 still safe for file checksums?",
      answer: "For detecting accidental corruption, yes. For verifying that a file has not been tampered with by someone who wants to deceive you, no — that is exactly the property that was broken.",
    },
  ],
};
