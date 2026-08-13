import { secureInt, toLines } from "@/lib/random";

/** Fisher–Yates over the parsed lines. */
export function shuffleLines(text: string): string[] {
  const items = toLines(text);
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = secureInt(index + 1);
    [items[index], items[swap]] = [items[swap], items[index]];
  }
  return items;
}

/**
 * Splits a shuffled list into groups.
 *
 * Dealing round-robin rather than slicing into blocks keeps the sizes within
 * one of each other — eleven people into three teams gives 4/4/3, not 4/4/3
 * by luck or 5/5/1 by a careless slice.
 */
export function intoGroups(items: string[], groupCount: number): string[][] {
  const count = Math.max(1, Math.min(items.length || 1, Math.floor(groupCount)));
  const groups: string[][] = Array.from({ length: count }, () => []);

  items.forEach((item, index) => {
    groups[index % count].push(item);
  });

  return groups;
}

/** Splits into groups of a fixed size instead of a fixed number of groups. */
export function bySize(items: string[], size: number): string[][] {
  const chunk = Math.max(1, Math.floor(size));
  const groups: string[][] = [];

  for (let index = 0; index < items.length; index += chunk) {
    groups.push(items.slice(index, index + chunk));
  }

  return groups;
}
