/**
 * Parses and explains five-field cron expressions, and works out when one will
 * next fire.
 *
 * The "next run" list is the part that earns its place. A plain English reading
 * still leaves you guessing at the edges — whether `0 0 * * 0` means Sunday
 * here, what a step of 7 does on a 31-day month, whether day-of-month and
 * day-of-week together mean AND or OR. Showing the actual timestamps answers all of that
 * without anyone having to trust the description.
 */

export interface Field {
  name: string;
  min: number;
  max: number;
  /** Names accepted in place of numbers, lowest value first. */
  names?: string[];
}

export const FIELDS: Field[] = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "day of month", min: 1, max: 31 },
  {
    name: "month",
    min: 1,
    max: 12,
    names: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  },
  {
    name: "day of week",
    min: 0,
    max: 6,
    names: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  },
];

export interface ParseError {
  field: string;
  message: string;
}

export interface Parsed {
  values: number[][];
  /** True when the field was a bare `*`, which changes how the two day fields combine. */
  wildcard: boolean[];
}

const ALIASES: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export function expandAlias(expression: string): string {
  return ALIASES[expression.trim().toLowerCase()] ?? expression;
}

export const aliasNames = Object.keys(ALIASES);

/** Expands one field into the sorted set of values it matches. */
function parseField(raw: string, field: Field): number[] | string {
  const values = new Set<number>();

  for (const part of raw.split(",")) {
    if (part === "") return "empty value in the list";

    // Step syntax: `*/5`, `10-30/5`, `5/10`.
    const [rangePart, stepPart, ...extra] = part.split("/");
    if (extra.length > 0) return `too many slashes in ${JSON.stringify(part)}`;

    let step = 1;
    if (stepPart !== undefined) {
      if (!/^\d+$/.test(stepPart)) return `${JSON.stringify(stepPart)} is not a step`;
      step = Number(stepPart);
      if (step === 0) return "a step of 0 would never advance";
    }

    let start: number;
    let end: number;

    if (rangePart === "*") {
      start = field.min;
      end = field.max;
    } else if (rangePart.includes("-")) {
      const [a, b] = rangePart.split("-");
      const from = named(a, field);
      const to = named(b, field);
      if (from === null || to === null) return `${JSON.stringify(rangePart)} is not a range`;
      if (from > to) return `${JSON.stringify(rangePart)} counts backwards`;
      start = from;
      end = to;
    } else {
      const single = named(rangePart, field);
      if (single === null) return `${JSON.stringify(rangePart)} is not a ${field.name}`;
      start = single;
      // `5/10` means "from 5, every 10" — an open-ended range, not a single value.
      end = stepPart !== undefined ? field.max : single;
    }

    if (start < field.min || end > field.max) {
      return `${field.name} must be between ${field.min} and ${field.max}`;
    }

    for (let value = start; value <= end; value += step) values.add(value);
  }

  return [...values].sort((a, b) => a - b);
}

function named(token: string, field: Field): number | null {
  const trimmed = token.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  const index = field.names?.indexOf(trimmed.slice(0, 3)) ?? -1;
  if (index === -1) return null;
  return index + field.min;
}

export function parse(expression: string): { parsed: Parsed | null; errors: ParseError[] } {
  const expanded = expandAlias(expression);
  const parts = expanded.trim().split(/\s+/).filter(Boolean);
  const errors: ParseError[] = [];

  if (parts.length !== 5) {
    return {
      parsed: null,
      errors: [
        {
          field: "expression",
          message: `A cron expression has five fields — minute, hour, day of month, month, day of week. This has ${parts.length}.`,
        },
      ],
    };
  }

  const values: number[][] = [];
  const wildcard: boolean[] = [];

  parts.forEach((part, index) => {
    const field = FIELDS[index];
    // `7` is Sunday in most implementations, alongside `0`. Normalising here
    // keeps the day arithmetic in one convention.
    const normalised = index === 4 ? part.replace(/\b7\b/g, "0") : part;

    const result = parseField(normalised, field);
    if (typeof result === "string") {
      errors.push({ field: field.name, message: result });
      values.push([]);
    } else if (result.length === 0) {
      errors.push({ field: field.name, message: "matches nothing" });
      values.push([]);
    } else {
      values.push(result);
    }
    wildcard.push(part === "*");
  });

  return { parsed: errors.length === 0 ? { values, wildcard } : null, errors };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function list(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Renders the schedule as a sentence. */
export function describe(parsed: Parsed): string {
  const [minutes, hours, days, months, weekdays] = parsed.values;
  const [minuteAll, hourAll, dayAll, monthAll, weekdayAll] = parsed.wildcard;

  let time: string;
  if (minuteAll && hourAll) {
    time = "Every minute";
  } else if (minuteAll) {
    time = `Every minute of ${list(hours.map((h) => `${pad(h)}:00–${pad(h)}:59`))}`;
  } else if (hourAll) {
    time =
      minutes.length === 1
        ? `At ${pad(minutes[0])} minutes past every hour`
        : `At ${list(minutes.map((m) => `:${pad(m)}`))} past every hour`;
  } else {
    const stamps: string[] = [];
    for (const hour of hours) for (const minute of minutes) stamps.push(`${pad(hour)}:${pad(minute)}`);
    time = stamps.length <= 6 ? `At ${list(stamps)}` : `At ${stamps.length} times a day`;
  }

  const scope: string[] = [];

  // The rule that surprises people: when both day fields are restricted, cron
  // fires if *either* matches, not both.
  if (!dayAll && !weekdayAll) {
    scope.push(
      `on day ${list(days.map(String))} of the month, or on ${list(weekdays.map((d) => DAYS[d]))} — whichever comes first, because cron treats the two day fields as OR when both are set`,
    );
  } else if (!dayAll) {
    scope.push(`on day ${list(days.map(String))} of the month`);
  } else if (!weekdayAll) {
    scope.push(`on ${list(weekdays.map((d) => DAYS[d]))}`);
  }

  if (!monthAll) scope.push(`in ${list(months.map((m) => MONTHS[m - 1]))}`);

  return scope.length > 0 ? `${time}, ${scope.join(", ")}.` : `${time}, every day.`;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Finds the next occurrences after `from`, by walking forward a minute at a
 * time.
 *
 * Brute force, and deliberately so: the field-skipping version is where cron
 * libraries get their edge-case bugs, and a scan of at most four years of
 * minutes finishes in well under the time it takes to paint the result.
 */
export function nextRuns(parsed: Parsed, from: Date, count = 5): Date[] {
  const [minutes, hours, days, months, weekdays] = parsed.values;
  const dayRestricted = !parsed.wildcard[2];
  const weekdayRestricted = !parsed.wildcard[4];

  const minuteSet = new Set(minutes);
  const hourSet = new Set(hours);
  const daySet = new Set(days);
  const monthSet = new Set(months);
  const weekdaySet = new Set(weekdays);

  const out: Date[] = [];
  const cursor = new Date(from.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  // Four years covers every 29 February a schedule could be waiting for.
  const limit = 366 * 4 * 24 * 60;

  for (let i = 0; i < limit && out.length < count; i += 1) {
    if (
      minuteSet.has(cursor.getMinutes()) &&
      hourSet.has(cursor.getHours()) &&
      monthSet.has(cursor.getMonth() + 1) &&
      matchesDay(cursor, daySet, weekdaySet, dayRestricted, weekdayRestricted)
    ) {
      out.push(new Date(cursor.getTime()));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return out;
}

function matchesDay(
  date: Date,
  days: Set<number>,
  weekdays: Set<number>,
  dayRestricted: boolean,
  weekdayRestricted: boolean,
): boolean {
  const dayMatch = days.has(date.getDate());
  const weekdayMatch = weekdays.has(date.getDay());

  // Both restricted: OR. One restricted: that one decides. Neither: any day.
  if (dayRestricted && weekdayRestricted) return dayMatch || weekdayMatch;
  if (dayRestricted) return dayMatch;
  if (weekdayRestricted) return weekdayMatch;
  return true;
}
