export type Bucket = "needs" | "wants" | "savings";

export interface Line {
  id: string;
  label: string;
  amount: string;
  bucket: Bucket;
}

export interface Summary {
  income: number;
  spent: number;
  left: number;
  byBucket: Record<Bucket, number>;
  /** Actual share of income, against the 50/30/20 targets. */
  shares: Record<Bucket, number>;
  savingsRate: number;
}

export const BUCKETS: { id: Bucket; label: string; target: number; description: string }[] = [
  { id: "needs", label: "Needs", target: 50, description: "Rent, food, bills, transport, minimum debt payments." },
  { id: "wants", label: "Wants", target: 30, description: "Eating out, subscriptions, hobbies, holidays." },
  { id: "savings", label: "Savings & debt", target: 20, description: "Saving, investing, and paying debt down faster." },
];

export function summarise(income: number, lines: Line[]): Summary {
  const byBucket: Record<Bucket, number> = { needs: 0, wants: 0, savings: 0 };

  for (const line of lines) {
    const amount = Number(line.amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    byBucket[line.bucket] += amount;
  }

  const spent = byBucket.needs + byBucket.wants + byBucket.savings;
  const safeIncome = income > 0 ? income : 0;

  const shares: Record<Bucket, number> = {
    needs: safeIncome > 0 ? (byBucket.needs / safeIncome) * 100 : 0,
    wants: safeIncome > 0 ? (byBucket.wants / safeIncome) * 100 : 0,
    savings: safeIncome > 0 ? (byBucket.savings / safeIncome) * 100 : 0,
  };

  return {
    income: safeIncome,
    spent,
    left: safeIncome - spent,
    byBucket,
    shares,
    // Unallocated income counts as saved — it is money not yet spent.
    savingsRate: safeIncome > 0 ? ((byBucket.savings + Math.max(0, safeIncome - spent)) / safeIncome) * 100 : 0,
  };
}

export const STARTER: Line[] = [
  { id: "l1", label: "Rent or mortgage", amount: "1200", bucket: "needs" },
  { id: "l2", label: "Groceries", amount: "400", bucket: "needs" },
  { id: "l3", label: "Utilities", amount: "150", bucket: "needs" },
  { id: "l4", label: "Transport", amount: "120", bucket: "needs" },
  { id: "l5", label: "Eating out", amount: "180", bucket: "wants" },
  { id: "l6", label: "Subscriptions", amount: "45", bucket: "wants" },
  { id: "l7", label: "Emergency fund", amount: "300", bucket: "savings" },
];
