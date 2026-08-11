export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

/** Keyed "Monday:Dinner" — a flat map beats a nested one for a fixed grid. */
export type Plan = Record<string, { dish: string; ingredients: string }>;

export function cellKey(day: string, meal: string): string {
  return `${day}:${meal}`;
}

/**
 * Collects every ingredient line in the week into one list.
 *
 * Duplicates are merged case-insensitively and counted, because "chicken
 * thighs" appearing on Tuesday and Friday is one thing to buy, not two — but
 * knowing it is needed twice changes how much you buy.
 */
export function shoppingList(plan: Plan): { name: string; count: number }[] {
  const tally = new Map<string, { name: string; count: number }>();

  for (const cell of Object.values(plan)) {
    if (!cell?.ingredients) continue;

    for (const raw of cell.ingredients.split(/[\n,]/)) {
      const name = raw.trim();
      if (!name) continue;

      const key = name.toLowerCase();
      const existing = tally.get(key);
      if (existing) existing.count += 1;
      else tally.set(key, { name, count: 1 });
    }
  }

  return [...tally.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function planToText(plan: Plan): string {
  return DAYS.map((day) => {
    const lines = MEALS.map((meal) => {
      const cell = plan[cellKey(day, meal)];
      return cell?.dish ? `  ${meal}: ${cell.dish}` : null;
    }).filter(Boolean);

    return lines.length > 0 ? `${day}\n${lines.join("\n")}` : null;
  })
    .filter(Boolean)
    .join("\n\n");
}
