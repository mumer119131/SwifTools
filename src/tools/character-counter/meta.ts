import { ALargeSmall } from "lucide-react";

import type { Tool } from "@/config/tools";

export const characterCounter: Tool = {
  slug: "character-counter",
  name: "Character Counter",
  category: "text",
  description: "Count characters with live limits for X, meta descriptions, SMS and more.",
  keywords: [
    "character counter",
    "count characters online",
    "twitter character limit",
    "meta description length checker",
    "sms character count",
  ],
  icon: ALargeSmall,
  processing: "client",
  status: "live",
  steps: [
    "Paste or type your text.",
    "Watch the counter against the limits that matter — X posts, meta titles and descriptions, SMS segments.",
    "Trim until every limit you care about shows green, then copy the text out.",
  ],
  notes: [
    "Character limits are enforced in different units by different platforms, and this shows all of them at once. The count you need depends on the destination: a meta description is measured in characters, an SMS in septets or UCS-2 units, and a database column in bytes.",
    "Emoji are where the counts diverge most sharply. A single emoji is one character to a person, but may be two UTF-16 code units to JavaScript, four bytes in UTF-8, and — for a family emoji built from several joined glyphs — a dozen or more of each. A field that allows 100 characters may reject a string of 40 emoji.",
    "Common limits worth having to hand: 60 characters for a page title before Google truncates, 155 for a meta description, 160 for a single SMS in the Latin alphabet, and 70 if the message contains any non-Latin character, because it switches the whole message to a wider encoding.",
  ],
  faq: [
    {
      question: "How many characters is a single SMS?",
      answer: "160 using the standard GSM alphabet. Adding any character outside it — an emoji, an accented letter, a curly quote — switches the entire message to UCS-2 encoding and drops the limit to 70, which is why one emoji can turn one text into two.",
    },
    {
      question: "How many characters should a meta description be?",
      answer: "About 155. Google truncates around there on desktop and slightly shorter on mobile, so put the important part first. There is no penalty for going over — the tail is simply not shown.",
    },
    {
      question: "Why does an emoji count as more than one character?",
      answer: "Because software counts code units, not glyphs. Most emoji are two UTF-16 units and four UTF-8 bytes, and composite ones like a family or a flag are built from several joined together. A 100-character field can reject far fewer than 100 emoji.",
    },
    {
      question: "What is the difference between characters and bytes?",
      answer: "A character is what you see; a byte is storage. In UTF-8 an ASCII letter is one byte, an accented letter two, most CJK characters three, and emoji four. Database column limits are usually in bytes, so a field that holds 255 bytes may hold far fewer characters.",
    },
    {
      question: "Is my text uploaded to be counted?",
      answer: "No. Counting happens live in your browser as you type, so nothing is transmitted at any point — which matters when the text is a draft, a password hint or anything else you would rather not paste elsewhere.",
    },
  ],
};
