import type { ToolContent } from "@/config/tool-content";

export const standardDeviationCalculatorContent: ToolContent = {
  steps: [
    "Paste numbers separated by commas, spaces or newlines.",
    "Choose sample or population — sample is almost always right.",
    "Mean, median, quartiles, outliers and the spread are all calculated.",
  ],
  notes: [
    "Standard deviation measures how spread out numbers are around their mean. It is the square root of the variance, and the square root matters because it returns the figure to the original units — a variance of metres-squared means nothing intuitive, whereas a standard deviation in metres does.",
    "The choice that trips people is sample against population, and it is not cosmetic. A population standard deviation divides by n; a sample divides by n − 1. The reason is that a sample mean sits closer to its own data than the true population mean does, so the deviations come out slightly too small — dividing by the smaller number corrects for it. This is Bessel's correction, and using the wrong one is the commonest error in an introductory statistics course.",
    "Use sample unless you genuinely have every member of the group. Measuring every pupil in one class is a population if the class is what you care about, and a sample if you are drawing conclusions about the school.",
    "The outlier flag uses the standard rule of 1.5 interquartile ranges beyond the quartiles. It is worth being clear about what that means: it identifies points worth looking at, not points to delete. Outliers are frequently the most informative values in a dataset, and removing them because a formula flagged them is how genuine findings get discarded.",
    "The distribution figures compare how much of your data falls within one, two and three standard deviations against what a normal distribution would give. A poor match does not indicate an error — it indicates the data is not normally distributed, which is itself worth knowing before applying any test that assumes it is.",
  ],
  faq: [
    {
      question: "What is the difference between sample and population standard deviation?",
      answer: "Sample divides by n − 1, population by n. A sample mean sits closer to its own data than the true mean does, which understates the spread, and dividing by the smaller number corrects for it. Use sample unless you have every member of the group.",
    },
    {
      question: "How do you calculate standard deviation?",
      answer: "Find the mean, subtract it from each value and square the result, average those squares, and take the square root. The averaging step divides by n − 1 for a sample and n for a population.",
    },
    {
      question: "What does standard deviation actually tell me?",
      answer: "How far values typically sit from the mean, in the same units as the data. A small one means the numbers cluster tightly; a large one means they are spread out. Two datasets can share a mean and be completely different.",
    },
    {
      question: "Should I remove outliers?",
      answer: "Not because a formula flagged them. The 1.5 IQR rule identifies points worth investigating, and outliers are often the most informative values you have. Remove one only when you can show it is a genuine error.",
    },
    {
      question: "Why is my data not matching the normal percentages?",
      answer: "Because it is probably not normally distributed, which is common and not a problem in itself. It matters only if you intend to use a test that assumes normality — in which case the mismatch is exactly what you needed to know.",
    },
  ],
};
