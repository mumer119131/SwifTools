import { CONSTANTS } from "@/lib/science";

export const MEDIA: { id: string; label: string; speed: number }[] = [
  { id: "light", label: "Light in vacuum", speed: CONSTANTS.speedOfLight },
  { id: "sound-air", label: "Sound in air (20 °C)", speed: 343 },
  { id: "sound-water", label: "Sound in water", speed: 1481 },
  { id: "sound-steel", label: "Sound in steel", speed: 5960 },
  { id: "custom", label: "Custom speed", speed: 343 },
];

/** Named bands, for context on whatever number the user lands on. */
const BANDS: { max: number; label: string }[] = [
  { max: 20, label: "Infrasound — below human hearing" },
  { max: 20_000, label: "Audible sound" },
  { max: 20_000_000, label: "Ultrasound / VLF radio" },
  { max: 300_000_000, label: "Radio — HF to VHF" },
  { max: 3_000_000_000, label: "UHF — TV, mobile, Wi-Fi 2.4 GHz" },
  { max: 300_000_000_000, label: "Microwave / SHF" },
  { max: 400_000_000_000_000, label: "Infrared" },
  { max: 790_000_000_000_000, label: "Visible light" },
  { max: 3e16, label: "Ultraviolet" },
  { max: 3e19, label: "X-ray" },
  { max: Infinity, label: "Gamma ray" },
];

export function bandFor(frequency: number): string {
  if (!Number.isFinite(frequency) || frequency <= 0) return "—";
  return BANDS.find((band) => frequency < band.max)?.label ?? "—";
}

export interface WaveValues {
  frequency: number;
  period: number;
  wavelength: number;
}

/**
 * All three quantities follow from any one, given the wave speed:
 * f = 1/T and λ = v/f. Solving from whichever the user typed avoids the usual
 * trap of forcing them to enter frequency first.
 */
export function solveWave(field: "frequency" | "period" | "wavelength", value: number, speed: number): WaveValues | null {
  if (!(value > 0) || !(speed > 0)) return null;

  if (field === "frequency") {
    return { frequency: value, period: 1 / value, wavelength: speed / value };
  }
  if (field === "period") {
    const frequency = 1 / value;
    return { frequency, period: value, wavelength: speed / frequency };
  }
  const frequency = speed / value;
  return { frequency, period: 1 / frequency, wavelength: value };
}
