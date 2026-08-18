import type { ToolContent } from "@/config/tool-content";

export const md5HashGeneratorContent: ToolContent = {
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The MD5 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 128-bit value — 32 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "MD5 was broken for collision resistance in 2004, and collisions can now be produced in seconds on a laptop. Two different files can be made to share an MD5 hash deliberately, which has been used to forge certificates. It must not be used for signatures, certificates or anything an attacker has an interest in fooling.",
    "It survives as a checksum against accidental corruption — verifying a download arrived intact, or spotting duplicate files — where nobody is trying to deceive you. For that it is fast and perfectly adequate.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "Is MD5 still safe to use?",
      answer: "Not for anything security-related. Collisions can be generated in seconds, so two different files can be made to share a hash on purpose. It remains fine as a checksum against accidental corruption, where no one is trying to deceive you.",
    },
    {
      question: "Why do people still use MD5?",
      answer: "Speed and inertia. It is faster than SHA-2 and embedded in a great deal of older software and file-integrity tooling. For detecting a truncated download or finding duplicate files it is entirely adequate.",
    },
    {
      question: "Can I reverse an MD5 hash?",
      answer: "Not by computation — hashing is one-way. But short or common inputs are trivially recovered from precomputed rainbow tables, which is why hashing a password with MD5 offers almost no protection.",
    },
    {
      question: "Should I hash passwords with MD5?",
      answer: "No, and this is the single most important thing to know about it. Use bcrypt, scrypt or Argon2, which are deliberately slow and salted. MD5 is fast, which is exactly the wrong property for a password hash.",
    },
    {
      question: "What length is an MD5 hash?",
      answer: "128 bits, written as 32 hexadecimal characters. The length is fixed regardless of whether the input is one byte or one gigabyte.",
    },
  ],
};
