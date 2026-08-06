/** A curated list, since the full IANA database is ~600 entries of noise. */
export const commonZones = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Lisbon",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Athens",
  "Europe/Moscow",
  "Africa/Lagos",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Perth",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

/** Today's date and the current hour, as `<input>`-ready strings. */
export function nowFields(): { date: string; time: string } {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:00`,
  };
}

export function detectZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function zoneLabel(zone: string): string {
  return zone === "UTC" ? "UTC" : zone.split("/").pop()!.replace(/_/g, " ");
}

/**
 * Reads a zone's UTC offset at a given instant, in minutes.
 *
 * `Intl` is the only source that knows the historical and DST rules, so the
 * offset is derived by formatting the instant in that zone and diffing against
 * the same instant in UTC. Hardcoding offsets would be wrong twice a year.
 */
export function offsetMinutes(instant: Date, zone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    // Intl renders midnight as "24" in some locales' hour12:false output.
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );

  return Math.round((asUtc - instant.getTime()) / 60000);
}

export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "−" : "+";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const rest = String(absolute % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${rest}`;
}

/**
 * Turns a wall-clock time in a given zone into a real instant.
 *
 * There is no direct API for this, so it is solved by iteration: guess that the
 * wall time is UTC, measure the zone's offset at that guess, correct, then
 * repeat once. The second pass fixes the edge case where the correction itself
 * crosses a DST boundary.
 */
export function zonedTimeToInstant(
  dateText: string,
  timeText: string,
  zone: string,
): Date | null {
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  if ([year, month, day, hour, minute].some((part) => !Number.isFinite(part))) return null;

  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let pass = 0; pass < 2; pass += 1) {
    const offset = offsetMinutes(new Date(guess), zone);
    guess = Date.UTC(year, month - 1, day, hour, minute) - offset * 60000;
  }

  const instant = new Date(guess);
  return Number.isFinite(instant.getTime()) ? instant : null;
}

export interface ZoneReading {
  zone: string;
  label: string;
  time: string;
  date: string;
  weekday: string;
  offset: string;
  /** −1, 0 or +1 relative to the reference zone's calendar day. */
  dayShift: number;
  hour: number;
}

export function readZone(instant: Date, zone: string, referenceDay: string): ZoneReading {
  const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(instant);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);

  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    day: "numeric",
    month: "short",
  }).format(instant);

  const weekday = new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short" }).format(
    instant,
  );

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", hour12: false }).format(
      instant,
    ),
  );

  const dayShift = Math.sign(new Date(dayKey).getTime() - new Date(referenceDay).getTime());

  return {
    zone,
    label: zoneLabel(zone),
    time,
    date,
    weekday,
    offset: formatOffset(offsetMinutes(instant, zone)),
    dayShift,
    hour: Number.isFinite(hour) ? hour % 24 : 0,
  };
}

export function dayKeyIn(instant: Date, zone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(instant);
}

/** Working hours, used to shade the day strip. */
export function isWorkingHour(hour: number): boolean {
  return hour >= 9 && hour < 18;
}
