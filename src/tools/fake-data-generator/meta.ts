import { Dices } from "lucide-react";

import type { Tool } from "@/config/tools";

export const fakeDataGenerator: Tool = {
  slug: "fake-data-generator",
  name: "Fake Data Generator",
  category: "generator",
  description: "Generate realistic placeholder records as JSON, CSV or SQL insert statements.",
  keywords: ["fake data generator", "mock data", "test data generator", "dummy data json"],
  icon: Dices,
  processing: "client",
  status: "live",
};
