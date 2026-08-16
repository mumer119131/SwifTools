import { AudioWaveform } from "lucide-react";

import type { Tool } from "@/config/tools";

export const frequencyCalculator: Tool = {
  slug: "frequency-calculator",
  name: "Frequency Calculator",
  category: "science",
  description: "Convert between frequency, period and wavelength for any wave speed.",
  keywords: ["frequency calculator","wavelength calculator","period to frequency","hz to wavelength","frequency period converter"],
  icon: AudioWaveform,
  processing: "client",
  status: "live",
  steps: [
    "Enter any one of frequency, period or wavelength.",
    "Pick the medium — light in vacuum or sound in air — or type your own wave speed.",
    "The other two update immediately, with the band the frequency falls in.",
  ],
  notes: [
    "Frequency, wavelength and wave speed are one relationship: v = fλ. For light in a vacuum the speed is exactly 299,792,458 metres per second — a defined constant since 1983, when the metre was redefined in terms of it rather than the other way round.",
    "Period is simply the reciprocal of frequency. A 50 Hz mains supply has a period of 20 milliseconds; a 2.4 GHz WiFi signal has a period of about 417 picoseconds and a wavelength of 12.5 centimetres, which is why WiFi antennas are the size they are.",
    "Sound is the case where the speed is not a constant. It travels at about 343 m/s in air at 20°C and faster when warmer, so a musical frequency's wavelength changes with the temperature of the room — which is why wind instruments go sharp as they warm up.",
  ],
  faq: [
    {
      question: "How do I convert frequency to wavelength?",
      answer: "Divide the wave speed by the frequency. For electromagnetic waves that is 299,792,458 m/s, so a 100 MHz FM signal has a wavelength of about 3 metres.",
    },
    {
      question: "What is the relationship between frequency and period?",
      answer: "They are reciprocals: period equals one over frequency. A 50 Hz supply has a 20 millisecond period, and a 1 kHz tone repeats every millisecond.",
    },
    {
      question: "Why is WiFi 2.4 GHz wavelength 12.5 cm?",
      answer: "Because 299,792,458 divided by 2.4 billion is about 0.125 metres. That wavelength is why WiFi antennas are a few centimetres long — antenna length is typically a half or quarter of the wavelength.",
    },
    {
      question: "Does sound have a fixed speed?",
      answer: "No. It travels at about 343 m/s in air at 20°C and faster in warmer air, denser gases, liquids and solids. That is why the wavelength of a given note changes with room temperature.",
    },
    {
      question: "What frequencies can humans hear?",
      answer: "Roughly 20 Hz to 20 kHz for a young adult, with the upper limit falling with age — most adults over forty cannot hear much above 15 kHz. That range corresponds to wavelengths from 17 metres down to 17 millimetres.",
    },
  ],
};
