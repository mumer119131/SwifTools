import { CreditCard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const subscriptionTracker: Tool = {
  slug: "subscription-tracker",
  name: "Subscription Cost Tracker",
  category: "home",
  description: "Add up every subscription across weekly, monthly and yearly billing — and see the annual total.",
  keywords: [
    "subscription tracker",
    "how much do i spend on subscriptions",
    "subscription cost calculator",
    "monthly subscription total",
    "recurring payments tracker",
  ],
  icon: CreditCard,
  processing: "client",
  status: "live",
};
