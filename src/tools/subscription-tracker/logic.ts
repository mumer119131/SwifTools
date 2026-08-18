/**
 * What your subscriptions actually cost.
 *
 * The point of the tool is a single number nobody normally sees. Individually
 * every subscription is small and monthly; together they are a large annual
 * figure, and the mixture of billing periods — monthly here, yearly there,
 * weekly for one — makes it genuinely hard to add up in your head.
 *
 * So everything is normalised to an annual cost and shown per month as well.
 */

export type Cycle = "weekly" | "fortnightly" | "monthly" | "quarterly" | "yearly";

export const CYCLE_LABELS: Record<Cycle, string> = {
  weekly: "Weekly",
  fortnightly: "Every 2 weeks",
  monthly: "Monthly",
  quarterly: "Every 3 months",
  yearly: "Yearly",
};

/**
 * Payments per year for each cycle.
 *
 * Weekly is 52.1775 rather than 52, because a year is 365.25 days. Over a
 * £15/week subscription that is a couple of pounds a year — small, but the
 * whole point of the tool is an accurate total, and rounding to 52 quietly
 * understates every weekly line.
 */
export const PER_YEAR: Record<Cycle, number> = {
  weekly: 365.25 / 7,
  fortnightly: 365.25 / 14,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: Cycle;
  /** Unticked lines are kept but excluded — for deciding what to cancel. */
  active: boolean;
  category?: string;
}

export const CATEGORIES = [
  "Streaming",
  "Music",
  "Software",
  "Gaming",
  "News",
  "Fitness",
  "Storage",
  "Other",
] as const;

export function annualCost(subscription: Subscription): number {
  if (!Number.isFinite(subscription.amount) || subscription.amount < 0) return 0;
  return subscription.amount * PER_YEAR[subscription.cycle];
}

export function monthlyCost(subscription: Subscription): number {
  return annualCost(subscription) / 12;
}

export interface Totals {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  active: number;
  inactive: number;
  /** Annual total per category, largest first. */
  byCategory: { category: string; annual: number; share: number }[];
  /** The single largest annual line. */
  largest: Subscription | null;
  /** What switching every yearly-capable line to annual billing might save. */
  potentialInactiveSaving: number;
}

export function totals(subscriptions: Subscription[]): Totals {
  const active = subscriptions.filter((entry) => entry.active);

  const annual = active.reduce((sum, entry) => sum + annualCost(entry), 0);

  const grouped = new Map<string, number>();
  for (const entry of active) {
    const key = entry.category ?? "Other";
    grouped.set(key, (grouped.get(key) ?? 0) + annualCost(entry));
  }

  const byCategory = [...grouped.entries()]
    .map(([category, value]) => ({
      category,
      annual: value,
      share: annual > 0 ? value / annual : 0,
    }))
    .sort((a, b) => b.annual - a.annual);

  const largest = active.reduce<Subscription | null>((best, entry) => {
    if (!best) return entry;
    return annualCost(entry) > annualCost(best) ? entry : best;
  }, null);

  const potentialInactiveSaving = subscriptions
    .filter((entry) => !entry.active)
    .reduce((sum, entry) => sum + annualCost(entry), 0);

  return {
    annual,
    monthly: annual / 12,
    weekly: annual / (365.25 / 7),
    daily: annual / 365.25,
    active: active.length,
    inactive: subscriptions.length - active.length,
    byCategory,
    largest,
    potentialInactiveSaving,
  };
}

export function blankSubscription(): Subscription {
  return {
    id: `sub-${Math.random().toString(36).slice(2, 9)}`,
    name: "",
    amount: 0,
    cycle: "monthly",
    active: true,
    category: "Other",
  };
}

/** A few to start with, so the tool is not an empty table. */
export const STARTERS: Subscription[] = [
  { id: "starter-1", name: "Streaming service", amount: 10.99, cycle: "monthly", active: true, category: "Streaming" },
  { id: "starter-2", name: "Music", amount: 11.99, cycle: "monthly", active: true, category: "Music" },
  { id: "starter-3", name: "Cloud storage", amount: 24.99, cycle: "yearly", active: true, category: "Storage" },
];
