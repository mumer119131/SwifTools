import type { ToolContent } from "@/config/tool-content";

export const gpaCalculatorContent: ToolContent = {
  steps: [
    "Pick your scale — a US 4.0, one with plus and minus grades, or UK percentages.",
    "Enter each course with its grade and credit hours.",
    "Add a target to see what you would need across the credits you have left.",
  ],
  notes: [
    "A GPA is a weighted mean, and the weight is credit hours rather than courses. That is the part people get wrong when working it out by hand: averaging the grade points as though every course counted equally gives a different — and wrong — number. A poor grade in a four-credit course hurts four times as much as the same grade in a one-credit course, which is exactly the intuition a plain average destroys. Both figures are shown here so the difference is visible.",
    "The honours or AP bonus adds a point to each marked course, producing the weighted GPA that can exceed 4.0. It is worth knowing that institutions differ on this considerably: some add a full point, some half, some do not weight at all, and many recalculate an unweighted figure for admissions regardless of what your school reports. The unweighted number is the one that travels.",
    "UK degree classifications work differently and are not a GPA at all. Marks are percentages, the average is weighted by credits in the same way, and the classification comes from bands — 70 and above for a first, 60 for a 2:1, 50 for a 2:2. Many universities also weight later years more heavily than earlier ones, which this does not attempt to model because the rules vary by institution.",
    "The most useful question is usually not what your GPA is but what you need next term to reach a target, which is why that calculation is here. When the answer comes out above the maximum, the target is not reachable from where you are — worth discovering now rather than at the end of the year.",
    "Your courses are kept in this browser so the list survives closing the tab, and never sent anywhere.",
  ],
  faq: [
    {
      question: "How is GPA calculated?",
      answer: "Multiply each course's grade points by its credit hours, add those up, and divide by the total credits. The weighting by credits is the part hand calculations usually miss — averaging the grade points equally gives a different answer.",
    },
    {
      question: "What is the difference between weighted and unweighted GPA?",
      answer: "An unweighted GPA caps at 4.0. A weighted one adds a point for honours or AP courses, so it can exceed 4.0. Institutions vary in how much they add and many recalculate an unweighted figure for admissions, so the unweighted number is the one that travels.",
    },
    {
      question: "Does a course with more credits count more?",
      answer: "Yes, in proportion. A four-credit course counts four times as much as a one-credit course. That is the whole point of weighting, and it is why a bad grade in a heavy course is worth more attention than one in a light one.",
    },
    {
      question: "How do UK degree classifications work?",
      answer: "By percentage bands rather than grade points: 70 and above is a first, 60 a 2:1, 50 a 2:2, 40 a third. The average is credit-weighted the same way, though many universities also weight later years more heavily, which varies too much between institutions to model here.",
    },
    {
      question: "What do I need to reach a target GPA?",
      answer: "Enter the target and how many credits you have left. If the required average comes out above the scale maximum, the target cannot be reached from your current position — which is more useful to know early than late.",
    },
  ],
};
