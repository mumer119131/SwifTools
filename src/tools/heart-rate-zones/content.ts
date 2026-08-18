import type { ToolContent } from "@/config/tool-content";

export const heartRateZonesContent: ToolContent = {
  steps: [
    "Enter your age, or your measured maximum heart rate if you know it.",
    "Add your resting heart rate — measured first thing, before getting up — for better zones.",
    "Train mostly in zone 2, however slow it feels.",
  ],
  notes: [
    "Two things are worth being clear about, and most calculators skip both. The first is that `220 − age` is not a measurement. It came from a rough fit to a small dataset in the 1970s, was never intended as a clinical formula, and has a standard deviation of ten to twelve beats per minute — so for any individual it can easily be twenty beats out. Tanaka's `208 − 0.7 × age` fits the population data better. The two cross at forty and diverge either side: 220 − age overestimates the maximum for younger people and underestimates it for older ones.",
    "The second is that zones calculated from maximum heart rate alone ignore fitness completely. Two people with the same maximum but resting rates of 45 and 75 have very different capacities, and straight percentages of maximum give them identical zones. The Karvonen method works from heart rate reserve — the gap between resting and maximum — which accounts for the difference and produces higher, more useful numbers. If you know your resting rate, supply it.",
    "The advice that follows from all this is duller than most people expect: the great majority of training should sit in zone 2, at an effort that feels too easy to be doing anything. It builds the aerobic base that everything else rests on, and the commonest mistake in endurance training is spending too much time in zone 3 — hard enough to accumulate fatigue, not hard enough to drive adaptation.",
    "To measure your resting rate properly, take it immediately on waking, before getting out of bed, across several mornings. Anything measured after coffee, stress or standing up is not a resting rate.",
    "These are population estimates and this is training guidance, not medical advice. If you have a heart condition, take medication that affects heart rate, or are returning to exercise after a long absence, ask a doctor rather than a web page.",
  ],
  faq: [
    {
      question: "Is 220 minus age accurate?",
      answer: "Not for individuals. It was a rough fit to limited data and has a standard deviation of ten to twelve beats, so it can be twenty out for a given person. Tanaka's 208 − 0.7 × age fits the population better — the two agree at forty, and 220 − age overestimates for the young and underestimates for the old.",
    },
    {
      question: "What is zone 2 and why does everyone talk about it?",
      answer: "Roughly 60–70% — comfortable enough to hold a conversation in full sentences. It builds aerobic capacity, and most endurance training should happen there. It feels too easy to be useful, which is exactly why people drift out of it.",
    },
    {
      question: "What is the Karvonen method?",
      answer: "Calculating zones from heart rate reserve — maximum minus resting — rather than from maximum alone. It accounts for fitness, so a fitter person with a lower resting rate gets appropriately higher zones. It needs a resting heart rate, which is why supplying one improves the result.",
    },
    {
      question: "How do I measure my resting heart rate?",
      answer: "Immediately on waking, before getting out of bed, over several mornings. Anything taken after standing up, caffeine or stress is higher and will skew the zones.",
    },
    {
      question: "Should I train by heart rate or by feel?",
      answer: "Both. Heart rate lags effort by a minute or two and drifts upward in heat and dehydration, so a number that looks right can misrepresent how hard you are working. Use the zones as a guide and the talk test as a check.",
    },
  ],
};
