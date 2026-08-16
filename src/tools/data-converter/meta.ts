import { HardDrive } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dataConverter: Tool = {
  slug: "data-converter",
  name: "Data Size Converter",
  category: "units",
  description: "Convert bytes, KB, MB, GB and TB — including the 1024-based binary units.",
  keywords: [
    "data size converter",
    "mb to gb",
    "gb to tb",
    "bytes converter",
    "kib vs kb",
    "file size converter",
  ],
  icon: HardDrive,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between bytes, kilobytes, megabytes, gigabytes and their binary counterparts in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "There are two systems and they are routinely confused. Decimal prefixes count in powers of 1,000 — a kilobyte is 1,000 bytes — and binary prefixes count in powers of 1,024, written KiB, MiB and GiB. The gap compounds: a kilobyte and a kibibyte differ by 2.4 percent, a gigabyte and a gibibyte by 7.4 percent.",
    "This is the whole explanation for the missing space on a new drive. Manufacturers sell in decimal, so a '1 TB' drive holds 1,000,000,000,000 bytes. Windows reports in binary but labels it TB, so it shows 931 GB. Nothing is missing and no one is lying — the same number is being divided by 1024 and labelled as though it were divided by 1000.",
  ],
  faq: [
    {
      question: "Why does my 1 TB hard drive show as 931 GB?",
      answer: "The drive holds a trillion bytes, which is a terabyte in decimal. Windows divides by 1024 three times, giving 931, but labels the result GB rather than GiB. Both figures describe the same drive.",
    },
    {
      question: "What is the difference between MB and MiB?",
      answer: "A megabyte is 1,000,000 bytes; a mebibyte is 1,048,576. The binary units — KiB, MiB, GiB — were standardised in 1998 precisely to end this ambiguity, though adoption is still patchy.",
    },
    {
      question: "How many megabytes are in a gigabyte?",
      answer: "1,000 using decimal prefixes, or 1,024 if you mean mebibytes in a gibibyte. Which one is correct depends entirely on which system the source was using.",
    },
    {
      question: "What is the difference between a bit and a byte?",
      answer: "A byte is eight bits. Network speeds are quoted in bits per second and file sizes in bytes, so a 100 Mbps connection downloads at about 12.5 MB/s at best — the factor of eight surprises people constantly.",
    },
    {
      question: "Why do network speeds use bits instead of bytes?",
      answer: "Historical convention from telecommunications, where the bit is the natural unit of a serial line. It also produces a larger number, which providers have never been in a hurry to change.",
    },
  ],
};
