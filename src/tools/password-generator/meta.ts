import { KeyRound } from "lucide-react";

import type { Tool } from "@/config/tools";

export const passwordGenerator: Tool = {
  slug: "password-generator",
  name: "Password Generator",
  category: "generator",
  description: "Generate strong random passwords or passphrases, with a real entropy estimate.",
  keywords: ["password generator", "strong password", "random password", "secure password"],
  icon: KeyRound,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Choose a random string or a memorable passphrase, and set the length.",
    "Entropy is calculated from the character set you picked, with a plain-English crack-time estimate.",
    "Copy it straight into your password manager — nothing is generated on or sent to a server.",
  ],
  notes: [
    "Passwords are generated with the Web Crypto API rather than Math.random, which matters more than it sounds: Math.random is predictable enough that an attacker who knows roughly when a password was generated can narrow the search dramatically. Nothing is transmitted — the password exists only in your browser.",
    "Length beats complexity, and by a wide margin. Each additional character multiplies the search space by the size of the alphabet, while adding a symbol class multiplies it once. A sixteen-character lowercase password has vastly more entropy than an eight-character one with every symbol class in it.",
    "This is why passphrases work. Four unrelated words are around 44 bits of entropy, easy to remember and impossible to shoulder-surf, while the mangled-word passwords that complexity rules encourage are both weaker and harder to recall — which is why people write them down.",
  ],
  faq: [
    {
      question: "How long should a password be?",
      answer: "Sixteen characters or more for anything that matters. Length multiplies the search space per character, while adding a symbol class multiplies it only once — so length is the far more efficient way to gain strength.",
    },
    {
      question: "Are these passwords sent to a server?",
      answer: "No. They are generated in your browser with crypto.getRandomValues and never transmitted, which is the only arrangement under which generating a password on a web page is defensible.",
    },
    {
      question: "Is a passphrase better than a random password?",
      answer: "For anything you have to remember, yes. Four unrelated words give around 44 bits of entropy and are easy to recall. For passwords a manager will store, random characters are fine — you never type them.",
    },
    {
      question: "Should I change my passwords regularly?",
      answer: "No, unless you suspect a breach. NIST dropped the forced-rotation advice in 2017 because it pushes people towards predictable variations — Password1, Password2 — which is worse than one strong password kept.",
    },
    {
      question: "What makes a password weak?",
      answer: "Being short, being reused, or being based on a word or a personal detail. Substituting 3 for e and @ for a is the first thing every cracking tool tries, so it adds essentially nothing.",
    },
  ],
};
