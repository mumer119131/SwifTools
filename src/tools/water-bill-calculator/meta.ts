import { Droplets } from "lucide-react";

import type { Tool } from "@/config/tools";

export const waterBillCalculator: Tool = {
  slug: "water-bill-calculator",
  name: "Water Bill Calculator",
  category: "home",
  description: "Estimate a household water bill from showers, laundry, dishes and a dripping tap.",
  keywords: [
    "water bill calculator",
    "water usage calculator",
    "household water consumption",
    "how much water does a shower use",
    "dripping tap water waste",
  ],
  icon: Droplets,
  processing: "client",
  status: "live",
  steps: [
    "Set how many people live there and how often each fixture is used.",
    "Enter your rate per 1,000 gallons — it is on the bill.",
    "You get daily and monthly usage, the bill, and where the water goes.",
  ],
  notes: [
    "Estimates household water use from how the fixtures are actually used, then applies your rate. The breakdown is the useful part: showers and toilets usually dominate, and seeing the split tells you where a change would make a difference.",
    "Toilets are where the biggest single saving usually sits. A pre-1994 US toilet uses 3.5 gallons or more per flush against 1.6 for a modern one — for a household of four that is over 13,000 gallons a year from one fixture.",
    "Most bills also charge for sewer, usually as a multiple of the water used, so the real bill is often close to double the water figure alone. A tap dripping once a second wastes about five gallons a day — 1,800 a year, from a washer that costs pennies.",
  ],
  faq: [
    {
      question: "How much water does a shower use?",
      answer: "About 2.1 gallons a minute for a modern low-flow head, so an eight-minute shower is roughly 17 gallons. Older unrestricted heads can use two or three times that.",
    },
    {
      question: "How much water does a dripping tap waste?",
      answer: "About five gallons a day at one drip per second — around 1,800 gallons a year. The washer that fixes it costs pennies, which makes it the best-value repair in most homes.",
    },
    {
      question: "How much does a toilet flush use?",
      answer: "1.6 gallons for a post-1994 US toilet and 3.5 or more for an older one. For a household of four, replacing an old toilet saves over 13,000 gallons a year.",
    },
    {
      question: "Why is my water bill higher than this estimate?",
      answer: "Because most bills also charge for sewer, often as a multiple of water used, plus standing charges. The real total is frequently close to double the water figure alone.",
    },
    {
      question: "What uses the most water in a home?",
      answer: "Toilets and showers typically dominate indoor use, followed by laundry. Outdoor watering can exceed all of them combined in summer, which is why bills are seasonal.",
    },
  ],
};
