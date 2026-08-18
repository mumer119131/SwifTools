import type { ToolContent } from "@/config/tool-content";

export const cookingMeasurementConverterContent: ToolContent = {
  steps: [
    "Pick the ingredient — this is what a plain volume converter cannot do.",
    "Enter an amount in cups, spoons, millilitres, grams or ounces.",
    "Every other measure appears at once, with a full conversion table.",
  ],
  notes: [
    "A cup is a volume and a gram is a weight, and nothing converts between them without knowing what is in the cup. A cup of flour is 120 g, a cup of sugar 200 g and a cup of honey 340 g — nearly three times the flour for the same volume. That is why a generic volume converter cannot answer 'how many grams in a cup'.",
    "Flour is the worst offender even at fixed volume. Scooped straight from the bag it packs to 150 g or more; spooned in and levelled it is 120. That 25 percent difference is enough to change a cake from tender to dry, and it is the single most common cause of a recipe not working.",
    "If a recipe gives grams, weigh it. That is why the author wrote it that way — professional and serious home baking moved to weight precisely because volume measurement of dry ingredients is unreliable.",
  ],
  faq: [
    {
      question: "How many grams are in a cup?",
      answer: "It depends entirely on the ingredient. A cup of flour is about 120 g, sugar 200 g, butter 227 g and honey 340 g. There is no single answer, which is why a plain volume converter cannot help.",
    },
    {
      question: "Why do my baking results vary when I measure by cups?",
      answer: "Because dry ingredients pack differently. Flour scooped from the bag can be 150 g where spooned and levelled it is 120 — a 25 percent difference, enough to change the texture of a cake completely.",
    },
    {
      question: "How many millilitres in a cup?",
      answer: "236.6 for a US cup and 250 for a metric one. That six percent gap is small enough to ignore in a soup and large enough to matter in a cake.",
    },
    {
      question: "Should I measure by weight or volume?",
      answer: "Weight, for anything baked. It removes packing differences entirely and is why professional recipes give grams. Volume is fine for liquids and for anything forgiving.",
    },
    {
      question: "How many tablespoons are in a cup?",
      answer: "Sixteen in a US cup, and three teaspoons to a tablespoon. Australian tablespoons are 20 ml against 15 elsewhere, which is worth knowing when following recipes from there.",
    },
  ],
};
