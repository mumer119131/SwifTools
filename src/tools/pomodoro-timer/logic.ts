export type Phase = "focus" | "short-break" | "long-break";

export interface Settings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Focus rounds before the long break. */
  roundsBeforeLongBreak: number;
  autoStartNext: boolean;
  soundEnabled: boolean;
}

export const defaultSettings: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  roundsBeforeLongBreak: 4,
  autoStartNext: false,
  soundEnabled: true,
};

export const phaseLabels: Record<Phase, string> = {
  focus: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

export function durationFor(phase: Phase, settings: Settings): number {
  const minutes =
    phase === "focus"
      ? settings.focusMinutes
      : phase === "short-break"
        ? settings.shortBreakMinutes
        : settings.longBreakMinutes;
  return Math.max(1, Math.round(minutes)) * 60;
}

/** Focus → break → focus, with a long break every N completed rounds. */
export function nextPhase(current: Phase, completedFocusRounds: number, settings: Settings): Phase {
  if (current !== "focus") return "focus";
  return completedFocusRounds % settings.roundsBeforeLongBreak === 0 ? "long-break" : "short-break";
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * A short two-tone chime, synthesised with the Web Audio API.
 *
 * No audio file to load, and no autoplay problem: the AudioContext is created
 * from a user gesture (pressing start), which is what browsers require.
 */
export function playChime(context: AudioContext, phase: Phase): void {
  const now = context.currentTime;
  // Rising for a break, falling back into focus — the direction tells you which
  // without needing to look at the screen.
  const notes = phase === "focus" ? [660, 880] : [880, 660];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    const start = now + index * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.4);
  });
}
