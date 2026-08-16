import { Vault } from "lucide-react";

import type { Tool } from "@/config/tools";

export const passwordManager: Tool = {
  slug: "password-manager",
  name: "Password Manager",
  category: "fun",
  description: "An offline vault encrypted with your master password — stored only in this browser.",
  keywords: [
    "password manager",
    "offline password vault",
    "local password manager",
    "encrypted password storage",
    "browser password vault",
  ],
  icon: Vault,
  processing: "client",
  status: "live",
  steps: [
    "Set a master password. It is never stored — the key is derived from it each time.",
    "Add entries. They are encrypted with AES-GCM before anything is written down.",
    "The vault locks itself after five minutes of inactivity.",
  ],
  notes: [
    "The encryption here is real. A key is derived from your master password with PBKDF2-SHA256 at 600,000 iterations — the OWASP 2023 figure — and entries are encrypted with AES-GCM, which authenticates as well as encrypts. Only ciphertext, a random salt and a random IV are stored, and a fresh salt and IV are generated on every save.",
    "It still should not hold anything that matters, and that is worth stating plainly rather than burying. Any script running on this page while the vault is unlocked can read every decrypted entry, and a web page cannot defend against that. Real password managers ship as browser extensions or native apps precisely so a compromised page cannot reach the vault.",
    "What it is good for is keeping a handful of low-stakes credentials out of a plain text file on a machine where you cannot install software. For your email, your bank, or anything with money or identity behind it, use a dedicated password manager.",
  ],
  faq: [
    {
      question: "Is a browser-based password manager safe?",
      answer: "Less safe than a dedicated one, and the reason is structural rather than about the cryptography. Any script running on the page while the vault is unlocked can read every entry — which is exactly why real password managers ship as extensions or native apps.",
    },
    {
      question: "How is the vault encrypted?",
      answer: "AES-GCM with a key derived from your master password using PBKDF2-SHA256 at 600,000 iterations. A fresh random salt and IV are generated on every save, and only ciphertext is stored.",
    },
    {
      question: "What happens if I forget my master password?",
      answer: "The vault is unrecoverable. The password is never stored — the key is derived from it each time — so there is no reset and no recovery. That is what makes it secure and what makes it unforgiving.",
    },
    {
      question: "Where is my vault stored?",
      answer: "In this browser's local storage, as ciphertext only. Nothing is uploaded, which also means it does not sync and is lost if you clear site data.",
    },
    {
      question: "What should I actually use this for?",
      answer: "Low-stakes credentials on a machine where you cannot install anything — a shared work computer, a temporary setup. For email, banking or anything tied to your identity, use a dedicated password manager.",
    },
  ],
};
