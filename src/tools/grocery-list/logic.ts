export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  aisle: string;
  done: boolean;
}

/** Supermarket sections, in roughly the order you walk them. */
export const AISLES = [
  "Produce",
  "Bakery",
  "Meat & fish",
  "Dairy & eggs",
  "Frozen",
  "Pantry",
  "Drinks",
  "Household",
  "Other",
];

/**
 * Keywords that place an item in an aisle.
 *
 * A guess, not a rule — the aisle is editable on every row. The point is that
 * typing twenty items and having them group themselves saves the tedious part,
 * and a wrong guess costs one click to fix.
 */
const AISLE_HINTS: [string, string[]][] = [
  ["Produce", ["apple", "banana", "orange", "lemon", "lime", "lettuce", "spinach", "kale", "tomato", "potato", "onion", "garlic", "carrot", "celery", "pepper", "cucumber", "broccoli", "avocado", "berry", "berries", "strawberry", "strawberries", "grape", "mushroom", "herb", "basil", "cilantro", "parsley", "salad", "fruit", "veg"]],
  ["Bakery", ["bread", "bagel", "roll", "bun", "baguette", "croissant", "muffin", "cake", "pastry", "tortilla", "pita", "naan"]],
  ["Meat & fish", ["chicken", "beef", "pork", "lamb", "turkey", "bacon", "sausage", "mince", "steak", "salmon", "tuna", "shrimp", "prawn", "fish", "cod", "ham"]],
  ["Dairy & eggs", ["milk", "cheese", "yogurt", "yoghurt", "butter", "cream", "egg", "eggs", "sour cream", "cottage"]],
  ["Frozen", ["frozen", "ice cream", "peas", "fries", "pizza"]],
  ["Pantry", ["flour", "sugar", "rice", "pasta", "noodle", "oil", "vinegar", "sauce", "bean", "lentil", "can", "tin", "cereal", "oats", "honey", "jam", "peanut butter", "spice", "salt", "pepper", "stock", "broth", "tea", "coffee", "chocolate", "snack", "crisp", "chip", "cracker", "nut"]],
  ["Drinks", ["water", "juice", "soda", "cola", "beer", "wine", "drink", "squash", "lemonade"]],
  ["Household", ["soap", "detergent", "bleach", "paper", "towel", "toilet", "tissue", "bin bag", "foil", "wrap", "sponge", "shampoo", "toothpaste", "razor", "battery", "batteries", "light bulb", "cleaner"]],
];

/**
 * Picks the aisle whose longest keyword matches the item name.
 *
 * Two things a plain `includes` gets wrong, both found in testing: "toilet
 * roll" landed in Bakery because "roll" was checked before "toilet", and
 * "birthday candles" landed in Pantry because it contains the letters of
 * "can". Matching whole words (with an optional plural) fixes the second, and
 * preferring the longest match fixes the first — the more specific keyword is
 * the better guess.
 */
export function guessAisle(name: string): string {
  const lower = name.toLowerCase();

  let bestAisle = "Other";
  let bestLength = 0;

  for (const [aisle, keywords] of AISLE_HINTS) {
    for (const keyword of keywords) {
      if (keyword.length <= bestLength) continue;

      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`);
      if (pattern.test(lower)) {
        bestAisle = aisle;
        bestLength = keyword.length;
      }
    }
  }

  return bestAisle;
}

export function itemTotal(item: GroceryItem): number {
  const price = Number(item.price);
  const quantity = Number(item.quantity);
  if (!(price > 0)) return 0;
  return price * (quantity > 0 ? quantity : 1);
}
