import { Hash } from "lucide-react";

import type { Tool } from "@/config/tools";

export const numberBaseConverter: Tool = {
  slug: "number-base-converter",
  name: "Number Base Converter",
  category: "converter",
  description: "Convert between binary, octal, decimal, hexadecimal and any base from 2 to 36.",
  keywords: ["binary to decimal", "hex converter", "number base converter", "octal converter"],
  icon: Hash,
  processing: "client",
  status: "live",
  steps: [
    "Type a number into any of the base fields — they all stay in sync.",
    "Use the custom base selector for anything from base 2 to base 36.",
    "Big integers are handled exactly, so 64-bit values don't lose their low digits.",
  ],
  notes: [
    "Converts between binary, octal, decimal and hexadecimal, and any base from 2 to 36. Hexadecimal is the one that comes up most in practice — colour values, memory addresses, byte dumps — because each hex digit maps to exactly four binary bits, so a byte is always two hex characters.",
    "Octal is largely historical except for one place it survives conspicuously: Unix file permissions. chmod 755 is three octal digits, each holding three bits for read, write and execute — which is exactly why the numbers look arbitrary until you write them in binary.",
    "Very large numbers are handled with BigInt rather than floating-point arithmetic. That matters above 2^53, where a JavaScript number stops being able to represent every integer and conversions start silently returning values that are close but wrong.",
  ],
  faq: [
    {
      question: "How do I convert decimal to binary?",
      answer: "Enter the decimal value and the binary form appears alongside. By hand, divide repeatedly by two and read the remainders bottom to top — 13 gives 1, 0, 1, 1 reversed, which is 1101.",
    },
    {
      question: "Why is hexadecimal used so much in computing?",
      answer: "Because each hex digit is exactly four bits, so one byte is always two hex characters and the mapping is clean. Decimal has no such relationship to binary, which makes it awkward for anything addressing memory or describing bytes.",
    },
    {
      question: "What base are Unix file permissions?",
      answer: "Octal. Each digit holds three bits for read, write and execute, which is why 755 means read-write-execute for the owner and read-execute for everyone else — obvious once written as 111 101 101 in binary.",
    },
    {
      question: "Can it handle very large numbers?",
      answer: "Yes. Conversion uses BigInt rather than floating-point, so integers beyond 2^53 convert exactly. Ordinary JavaScript arithmetic starts losing precision above that point and returns answers that are close but wrong.",
    },
    {
      question: "What is base 36?",
      answer: "Digits 0-9 followed by letters a-z, giving the most compact representation using only alphanumeric characters. It is used for short identifiers and URL slugs where every character has to be safe and typeable.",
    },
  ],
};
