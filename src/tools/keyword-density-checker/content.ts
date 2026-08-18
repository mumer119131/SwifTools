import type { ToolContent } from "@/config/tool-content";

export const keywordDensityCheckerContent: ToolContent = {
  steps: [
    "Paste your page copy or article.",
    "Single words, pairs and three-word phrases are counted separately, with density for each.",
    "Watch for anything over about 3% — that's the range where repetition starts reading as stuffing.",
  ],
  notes: [
    "Keyword density is the share of total words that a given term accounts for. It is worth measuring, and worth being clear about what it is for: modern search engines do not have a target density, and writing to hit a number produces text that reads badly and ranks worse.",
    "The genuinely useful signal is the outlier. If a term you did not intend appears at four percent, the page is probably about something other than you think. If your main topic appears twice in two thousand words, a search engine has little to work with. Both are visible in a density count and neither is a target.",
    "Stuffing a keyword to raise its density has been counterproductive since roughly 2011. Google's language models work on meaning rather than term frequency, and repetition past the point of natural writing reads as spam to both the algorithm and the reader.",
  ],
  faq: [
    {
      question: "What is a good keyword density?",
      answer: "There is no target, and that is the honest answer. Anything between roughly 0.5 and 2.5 percent tends to happen naturally when writing about a topic. Writing to hit a number produces worse text and does not improve ranking.",
    },
    {
      question: "Does keyword stuffing still work?",
      answer: "No, and it has been actively harmful since about 2011. Search engines evaluate meaning rather than term frequency, and repetition beyond natural writing is a recognised spam signal.",
    },
    {
      question: "What should I do with the density numbers?",
      answer: "Look for outliers rather than targets. A term you did not intend appearing at four percent suggests the page is about something other than you thought; a main topic appearing twice in 2,000 words gives a search engine nothing to work with.",
    },
    {
      question: "Should I count two-word and three-word phrases?",
      answer: "Yes, and they are usually more informative than single words. Real search queries are phrases, and seeing which two- and three-word combinations dominate tells you what the page reads as being about.",
    },
    {
      question: "Are stop words included?",
      answer: "They are counted in the total but reported separately, because 'the' at six percent tells you nothing. Filtering them out is what makes the remaining distribution readable.",
    },
  ],
};
