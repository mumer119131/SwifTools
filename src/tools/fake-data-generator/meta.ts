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
  steps: [
    "Choose the fields you need — names, emails, addresses, dates, IDs and more.",
    "Set how many rows to generate and pick JSON, CSV or SQL output.",
    "Copy or download the result and load it straight into your test database.",
  ],
};
