import type { ToolContent } from "@/config/tool-content";

export const sha256HashGeneratorContent: ToolContent = {
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-256 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 256-bit value — 64 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "SHA-256 is part of the SHA-2 family, published by NIST in 2001, and has no known practical weakness. It is what TLS certificates, Bitcoin, package managers and code-signing all rely on, and it is the sensible default whenever a hash is needed and nothing specific says otherwise.",
    "The output is 256 bits, which puts a brute-force search beyond any conceivable hardware and gives a collision resistance of 128 bits — comfortably past the point where the number of attempts exceeds the atoms available to store them.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "Is SHA-256 secure?",
      answer: "Yes. It has no known practical weakness after two decades of analysis, and it underpins TLS certificates, code signing and Bitcoin. It is the right default whenever you need a cryptographic hash.",
    },
    {
      question: "Can a SHA-256 hash be decrypted?",
      answer: "No, and not because it is well encrypted — hashing is not encryption. It is one-way by construction, mapping any input to a fixed 256 bits, and the original cannot be derived from the result.",
    },
    {
      question: "Is SHA-256 suitable for passwords?",
      answer: "Not on its own. It is designed to be fast, which helps an attacker guessing billions of candidates per second. Use bcrypt, scrypt or Argon2, which are deliberately slow and salted.",
    },
    {
      question: "What is the difference between SHA-256 and SHA-2?",
      answer: "SHA-2 is the family; SHA-256 is the 256-bit member of it, alongside SHA-224, SHA-384 and SHA-512. When people say SHA-2 they usually mean SHA-256.",
    },
    {
      question: "Is my input sent to a server to be hashed?",
      answer: "No. Hashing runs through the Web Crypto API in your browser, so passwords, keys or file contents you are checking never leave the machine.",
    },
  ],
};
