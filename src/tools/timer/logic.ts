/**
 * Timing for the countdown timer and stopwatch.
 *
 * Everything here works from wall-clock deadlines rather than from accumulated
 * ticks, which is the one thing a timer has to get right. Adding 1000ms per
 * `setInterval` callback drifts — the callback is late by a few milliseconds
 * every time, and browsers throttle intervals to once a second or slower in a
 * background tab, so a ten-minute timer left in another tab can finish minutes
 * late. Storing the moment it should end and subtracting `Date.now()` is
 * immune to both: however irregularly the tick arrives, the answer is right.
 */

export interface Split {
  index: number;
  /** Milliseconds since the stopwatch started. */
  total: number;
  /** Milliseconds since the previous split. */
  lap: number;
}

/** Presets, in seconds. The ones people actually search for. */
export const PRESETS = [60, 120, 180, 300, 600, 900, 1200, 1800, 2700, 3600] as const;

export function presetLabel(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/**
 * Formats a duration for the big readout.
 *
 * Hours are dropped below an hour rather than shown as `00:`, because a
 * stopwatch reading `00:00:09.4` is harder to read at a glance than `0:09.4`.
 */
export function formatDuration(ms: number, showTenths = false): string {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((safe % 1000) / 100);

  const pad = (value: number) => String(value).padStart(2, "0");

  const base =
    hours > 0
      ? `${hours}:${pad(minutes)}:${pad(seconds)}`
      : `${minutes}:${pad(seconds)}`;

  return showTenths ? `${base}.${tenths}` : base;
}

/** A compact form for the document title, so a background tab still shows it. */
export function formatForTitle(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/**
 * Parses what someone types into the duration field.
 *
 * Accepts `90`, `1:30`, `1m30s`, `2h`, `1:02:03` — people type all of these and
 * a timer that only accepts one of them is annoying in a way that is entirely
 * avoidable. A bare number is read as minutes, which is what someone typing
 * "10" into a timer means.
 */
export function parseDuration(input: string): number | null {
  const text = input.trim().toLowerCase();
  if (text === "") return null;

  // 1:30 or 1:02:03
  if (text.includes(":")) {
    const parts = text.split(":");
    if (parts.length > 3 || parts.some((part) => !/^\d*$/.test(part))) return null;

    const numbers = parts.map((part) => (part === "" ? 0 : Number(part)));
    const [hours, minutes, seconds] =
      numbers.length === 3 ? numbers : [0, numbers[0], numbers[1] ?? 0];

    if (minutes >= 60 && numbers.length === 3) return null;
    if (seconds >= 60) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }

  // 1h30m, 90s, 2m
  if (/[hms]/.test(text)) {
    const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*([hms])/g)];
    if (matches.length === 0) return null;
    // Reject trailing junk: "5m banana" should not silently become five minutes.
    const consumed = matches.reduce((sum, match) => sum + match[0].length, 0);
    if (consumed !== text.replace(/\s/g, "").length) return null;

    const unit = { h: 3600, m: 60, s: 1 };
    return matches.reduce(
      (total, [, value, suffix]) => total + Number(value) * unit[suffix as "h" | "m" | "s"],
      0,
    );
  }

  // A bare number means minutes.
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  return Math.round(Number(text) * 60);
}

/** Milliseconds left, from a deadline. Never negative. */
export function remainingFrom(deadline: number, now: number): number {
  return Math.max(0, deadline - now);
}

/** Records a split against the ones already taken. */
export function addSplit(splits: Split[], total: number): Split[] {
  const previous = splits.length > 0 ? splits[splits.length - 1].total : 0;
  return [...splits, { index: splits.length + 1, total, lap: total - previous }];
}

/** The fastest and slowest laps, for highlighting. Null until there are two. */
export function lapExtremes(splits: Split[]): { fastest: number; slowest: number } | null {
  if (splits.length < 2) return null;
  const laps = splits.map((split) => split.lap);
  return { fastest: Math.min(...laps), slowest: Math.max(...laps) };
}

/**
 * A two-note chime, built from an oscillator rather than an audio file.
 *
 * Nothing to download, and no autoplay problem: the AudioContext is created
 * from the gesture that starts the timer, which is what browsers require.
 * Repeated a few times because the whole point is to be noticed from another
 * room.
 */
export function playAlarm(context: AudioContext, repeats = 3): void {
  const start = context.currentTime;

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    [880, 660].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      const at = start + repeat * 0.9 + index * 0.22;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.25, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.4);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.45);
    });
  }
}
