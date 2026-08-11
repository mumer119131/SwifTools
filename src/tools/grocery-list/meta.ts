import { ShoppingCart } from "lucide-react";

import type { Tool } from "@/config/tools";

export const groceryList: Tool = {
  slug: "grocery-list",
  name: "Grocery List",
  category: "home",
  description: "A shopping list that sorts itself by aisle and keeps a running total.",
  keywords: [
    "grocery list",
    "shopping list maker",
    "online grocery list",
    "printable shopping list",
    "grocery list app",
    "shopping list with prices",
  ],
  icon: ShoppingCart,
  processing: "client",
  status: "live",
  steps: [
    "Type an item and press enter — the aisle is guessed from the name.",
    "Add a quantity and price if you want a running total.",
    "Tick things off as you shop. The list is saved in this browser.",
  ],
};
