import type { ToolContent } from "@/config/tool-content";

export const groceryListContent: ToolContent = {
  steps: [
    "Type an item and press enter — the aisle is guessed from the name.",
    "Add a quantity and price if you want a running total.",
    "Tick things off as you shop. The list is saved in this browser.",
  ],
  notes: [
    "Items are sorted into supermarket aisles automatically from their name, so a list typed in any order comes out in the order you walk the shop. The guess is editable on every row, because no keyword list is going to get every item right.",
    "Adding prices gives a running basket total and, more usefully, a total for what is still unticked — so you can see what the remaining shop will cost rather than only what you have already picked up.",
    "The list is kept in this browser only. There is no account and nothing is uploaded, which means it works instantly and asks nothing of you, and equally means it will not appear on your phone when you get to the shop.",
  ],
  faq: [
    {
      question: "How does the list sort items into aisles?",
      answer: "By matching words in the item name against keyword lists for each supermarket section. It matches whole words and prefers the most specific match, so 'toilet roll' goes to household rather than bakery.",
    },
    {
      question: "Can I change which aisle an item is in?",
      answer: "Yes, on every row. The automatic sorting is a guess to save typing, not a rule — layouts differ between shops and the guess only has to be right most of the time to be useful.",
    },
    {
      question: "Does the list track the total cost?",
      answer: "Yes, if you add prices. Both the full basket total and the total for items still unticked are shown, so you can see what the rest of the shop will cost.",
    },
    {
      question: "Is my shopping list saved?",
      answer: "In this browser, yes — it survives closing the tab. It does not sync to another device, because there is no account and nothing is uploaded.",
    },
    {
      question: "Can I print or share the list?",
      answer: "Copy it out as plain text, grouped by aisle with tick boxes. That pastes into a message, a note or a document, which is more portable than any format tied to this page.",
    },
  ],
};
