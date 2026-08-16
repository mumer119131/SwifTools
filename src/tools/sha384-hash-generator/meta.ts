import { ShieldCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha384HashGenerator: Tool = {
  slug: "sha384-hash-generator",
  name: "SHA-384 Hash Generator",
  category: "developer",
  description: "Generate a SHA-384 hash for text or files, with HMAC signing and checksum verification.",
  keywords: [
    "sha384 generator",
    "sha-384 hash",
    "sha384 online",
  ],
  icon: ShieldCheck,
  processing: "client",
  status: "live",
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-384 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
  notes: [
    "A hash is a one-way function: it turns any input, of any length, into a fixed 384-bit value — 96 hexadecimal characters — and there is no way back. Change a single bit of the input and roughly half the output bits flip, which is what makes a hash useful for detecting that something has changed.",
    "SHA-384 is SHA-512 computed with different initial values and truncated to 384 bits. That truncation is not merely cosmetic: it makes SHA-384 immune to the length-extension attack that affects SHA-256 and SHA-512, because an attacker cannot reconstruct the full internal state from the published digest.",
    "It appears most often in TLS cipher suites and in Suite B cryptography, where a 192-bit security level is specified. If you are implementing to a standard that names SHA-384, use it; otherwise SHA-256 is the more common default.",
    "Hashing here runs through the Web Crypto API in your own browser, so nothing is transmitted. That matters: a hash tool is often used on passwords, keys and file contents, and pasting those into a server-side tool hands them over.",
  ],
  faq: [
    {
      question: "What is SHA-384 used for?",
      answer: "Mostly TLS cipher suites and government cryptographic standards that specify a 192-bit security level. It is rarely chosen for general-purpose hashing, where SHA-256 is the convention.",
    },
    {
      question: "Why is SHA-384 immune to length-extension attacks?",
      answer: "Because it is SHA-512 truncated. The published digest is only part of the internal state, so an attacker cannot resume the computation from it — which is exactly what a length-extension attack requires.",
    },
    {
      question: "How long is a SHA-384 digest?",
      answer: "384 bits, written as 96 hexadecimal characters — sitting between SHA-256 at 64 characters and SHA-512 at 128. The length is fixed no matter how large the input is.",
    },
    {
      question: "Is SHA-384 slower than SHA-256?",
      answer: "No, generally faster on 64-bit processors, because it is built on SHA-512's 64-bit word operations. The longer output does not cost extra time on such hardware.",
    },
    {
      question: "Should I choose SHA-384 over SHA-256?",
      answer: "Only when a specification requires it. Both are secure, SHA-256 is far more widely supported, and there is no practical security gain from the longer digest.",
    },
  ],
};
