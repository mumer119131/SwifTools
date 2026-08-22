import type { ToolContent } from "@/config/tool-content";

export const decibelCalculatorContent: ToolContent = {
  steps: [
    "Convert a ratio to decibels, or the reverse.",
    "Add several sound sources — decibels do not simply add.",
    "See how a level falls with distance from a point source.",
  ],
  notes: [
    "A decibel is a ratio expressed logarithmically, not a quantity. That is why a bare decibel figure is meaningless without a reference — sound pressure levels are quoted against the threshold of hearing, which is what the dB SPL scale means, and a gain of 6 dB says something about amplification rather than absolute loudness.",
    "The formula depends on what you are comparing, and getting it wrong puts you out by a factor of two. Power uses 10·log₁₀ and amplitude uses 20·log₁₀. They agree physically because power goes as the square of amplitude, and squaring inside a logarithm becomes a factor of two outside it. Doubling power is +3 dB; doubling voltage or sound pressure is +6 dB.",
    "Decibels do not add arithmetically, which surprises people constantly. Two 60 dB sources together give 63 dB, not 120 — the underlying powers add and the logarithm is applied afterwards. The practical consequence is that a quiet source next to a loud one contributes almost nothing: adding 40 dB to 80 dB changes the total by well under a thousandth of a decibel.",
    "Level falls with distance because a point source spreads its energy over a sphere, and a sphere's area grows with the square of its radius. That gives 6 dB lost per doubling of distance — so moving from one metre to two costs the same 6 dB as moving from ten metres to twenty.",
    "The landmarks are worth knowing for a reason that is not academic. Sustained exposure above about 85 dB risks permanent hearing damage, and the time it takes falls sharply as level rises — a nightclub at 100 dB does damage in around fifteen minutes.",
  ],
  faq: [
    {
      question: "Why is doubling power 3 dB but doubling voltage 6 dB?",
      answer: "Because power uses 10·log₁₀ and amplitude uses 20·log₁₀. Power goes as the square of amplitude, and the square becomes a factor of two once inside a logarithm. Using the wrong formula puts you out by exactly that factor.",
    },
    {
      question: "How do you add decibels?",
      answer: "Not by adding them. Convert each to a power ratio, add those, then take the logarithm. Two 60 dB sources give 63 dB — doubling the power adds about 3 dB wherever you started.",
    },
    {
      question: "How much quieter is a sound twice as far away?",
      answer: "6 dB. A point source spreads over a sphere whose area grows with the square of the radius, so every doubling of distance costs the same 6 dB — one metre to two, or ten to twenty.",
    },
    {
      question: "What decibel level is dangerous?",
      answer: "Sustained exposure above about 85 dB risks permanent damage, and the safe duration falls sharply as level rises. A nightclub at 100 dB can do damage in roughly fifteen minutes.",
    },
    {
      question: "Is 0 dB silence?",
      answer: "No — it is the reference point, the quietest sound a healthy young ear can detect. Negative decibel values are perfectly possible and simply mean quieter than that reference.",
    },
  ],
};
