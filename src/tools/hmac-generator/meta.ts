import { FileKey } from "lucide-react";

import type { Tool } from "@/config/tools";

export const hmacGenerator: Tool = {
  slug: "hmac-generator",
  name: "HMAC Generator",
  category: "developer",
  description: "Sign a message with a secret key, and verify a signature you have been sent.",
  keywords: [
    "hmac generator",
    "hmac sha256",
    "webhook signature",
    "verify webhook signature",
    "hmac calculator",
    "sign message with secret key",
    "hmac sha512",
  ],
  icon: FileKey,
  processing: "client",
  status: "live",
  steps: [
    "Paste the message and the secret key.",
    "Pick the hash — SHA-256 unless you have been told otherwise — and the output encoding.",
    "Compare against a signature you were sent, if you are checking a webhook.",
  ],
  notes: [
    "HMAC answers a question a plain hash cannot: not just \"has this message changed\", but \"was it written by someone holding the key\". That is why every webhook provider worth using signs its payloads with one, and why the signature they send has to be checked rather than trusted.",
    "It is not the same as hashing the key and the message together. `sha256(key + message)` is vulnerable to a length-extension attack — an attacker who never sees the key can still append to the message and produce a valid-looking digest. HMAC's nested construction exists specifically to prevent that. This tool calls the browser's own Web Crypto implementation rather than reimplementing it, and the results are checked against the published RFC 4231 test vectors.",
    "Getting a webhook check wrong usually comes down to what you signed. The signature covers the exact raw request body, byte for byte, before any JSON parsing. Parse it and re-serialise it and the bytes change, so the signature stops matching even though nothing was tampered with.",
    "When comparing, use a constant-time comparison rather than `===`. An ordinary comparison stops at the first differing character, and the time it takes leaks how much of a guess was right — enough, over many attempts, to recover a valid signature. The verify box here uses one.",
    "Everything happens in your browser. Your secret key is never sent anywhere, which is not a claim you should accept casually from any site asking for one.",
  ],
  faq: [
    {
      question: "What is HMAC used for?",
      answer: "Proving a message came from someone holding a shared secret and has not been altered. Webhook providers sign their payloads with it so you can tell a genuine delivery from anyone who happened to find your endpoint.",
    },
    {
      question: "How is HMAC different from a plain hash?",
      answer: "A hash tells you the content has not changed; anyone can compute one. An HMAC needs the secret key, so it also tells you who produced it. It is also not simply `hash(key + message)` — that construction is open to length-extension attacks, which HMAC's nested design prevents.",
    },
    {
      question: "Why does my webhook signature not match?",
      answer: "Almost always because you signed the wrong bytes. The signature covers the raw request body exactly as it arrived — parse the JSON and re-serialise it and the bytes change. Check the encoding too: providers vary between hex and Base64.",
    },
    {
      question: "Why should I not compare signatures with ===?",
      answer: "Because it returns as soon as two characters differ, so how long it takes reveals how many leading characters were correct. Repeated enough times that leaks a valid signature. Use a constant-time comparison, as the verify box here does.",
    },
    {
      question: "Which hash should I use?",
      answer: "SHA-256 unless the service you are integrating with specifies otherwise. SHA-1 is here because plenty of older APIs still require it — HMAC-SHA1 is not broken in the way plain SHA-1 is, but do not choose it for something new.",
    },
    {
      question: "Is my secret key sent anywhere?",
      answer: "No. The signing uses your browser's own Web Crypto implementation and nothing leaves your device — which is the only acceptable answer for a page asking you to paste a production secret.",
    },
  ],
};
