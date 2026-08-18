import type { ToolContent } from "@/config/tool-content";

export const fuelCostCalculatorContent: ToolContent = {
  steps: [
    "Enter the distance, in miles or kilometres.",
    "Enter your car's economy in whichever unit you know it — MPG, L/100km or km per litre.",
    "Add the fuel price, and how many of you are splitting it.",
  ],
  notes: [
    "There are two incompatible ways of expressing fuel economy, and they run in opposite directions. MPG is distance per volume, so higher is better. L/100km is volume per distance, so lower is better. They are reciprocals of one another, which means converting is a division rather than a multiplication — and that averaging two MPG figures gives the wrong answer, which is why official fuel economy figures are calculated in litres per 100km even where they are published as MPG.",
    "There are also two different gallons, and the difference is far too large to ignore. An imperial gallon is 4.546 litres and a US gallon is 3.785 — about 20% smaller. The same figure of 40 mpg therefore describes two noticeably different cars depending on which side of the Atlantic wrote it. If the number came from a UK source it is almost certainly imperial.",
    "The reciprocal relationship has a genuinely counterintuitive consequence when comparing cars. Improving from 20 to 25 mpg saves considerably more fuel over a year than improving from 40 to 50, even though the second looks like a bigger jump. Going from 20 to 25 mpg saves a gallon per hundred miles; 40 to 50 saves half of one. This is why replacing the least efficient vehicle in a household matters more than upgrading the most efficient.",
    "The figure your car reports on its dashboard is usually optimistic by a few percent, and real economy varies substantially with speed, load, traffic and weather. For budgeting a trip, use the number you calculate from your own fill-ups rather than the manufacturer's.",
  ],
  faq: [
    {
      question: "How do I convert MPG to L/100km?",
      answer: "Divide, do not multiply — they are reciprocals. 235.2 divided by US MPG, or 282.5 divided by imperial MPG, gives litres per 100km. This tool does it either way round, and shows both.",
    },
    {
      question: "Why is US MPG different from UK MPG?",
      answer: "Because the gallons differ. An imperial gallon is 4.546 litres and a US gallon 3.785, so an imperial MPG figure is about 20% higher than the US figure for the same car. A car doing 40 mpg in Britain does roughly 33 mpg by American measure.",
    },
    {
      question: "Which improvement saves more fuel, 20 to 25 mpg or 40 to 50?",
      answer: "20 to 25, by roughly double — despite looking like the smaller gain. Over 100 miles it saves a full gallon while 40 to 50 saves half of one. That is the reciprocal at work, and it is the strongest argument for replacing the least efficient car you own first.",
    },
    {
      question: "Should I use my car's reported economy figure?",
      answer: "It is a reasonable starting point but usually a few percent optimistic. A figure worked out from your own fill-ups — distance covered divided by fuel added — is more reliable for budgeting.",
    },
  ],
};
