import type { ToolContent } from "@/config/tool-content";

export const currencyConverterContent: ToolContent = {
  steps: [
    "Enter an amount and pick the currencies to convert between.",
    "Rates are the European Central Bank's daily reference rates, fetched through our own cached endpoint.",
    "The reverse rate and a table of other currencies update alongside the result.",
  ],
  notes: [
    "Rates are fetched from a public exchange-rate feed and are indicative mid-market rates — the midpoint between what buyers and sellers are quoting on the interbank market. They are what you see quoted in the news and what a search engine shows.",
    "They are not what you will get. A bank or card issuer adds a spread to the mid-market rate, typically 1 to 3 percent, and often a fixed fee on top. That is where the money is made, and it is why a transfer of a thousand pounds can arrive noticeably lighter than the headline rate suggests.",
    "Rates move continuously during market hours and are stale over a weekend. For anything where the exact amount matters — an invoice, a tax return, a large transfer — use the rate your provider actually quotes at the moment of the transaction, not an indicative one.",
  ],
  faq: [
    {
      question: "Why is the rate different from what my bank offers?",
      answer: "This shows the mid-market rate, the midpoint of interbank buying and selling prices. Banks and card issuers add a spread of typically 1 to 3 percent plus sometimes a fixed fee, which is how the service is paid for.",
    },
    {
      question: "How often are the rates updated?",
      answer: "They come from a public feed that refreshes regularly during market hours. Currency markets are closed at weekends, so a Saturday rate is Friday's closing figure rather than a live one.",
    },
    {
      question: "Can I use these rates for accounting or tax?",
      answer: "No. Tax authorities specify which rate to use — often a published official rate for the date of the transaction — and an indicative mid-market rate is not it. Check what your jurisdiction requires.",
    },
    {
      question: "What is the mid-market rate?",
      answer: "The midpoint between the highest price buyers will pay and the lowest sellers will accept on the interbank market. It is the fairest single number to quote, and it is not a rate any retail customer is actually offered.",
    },
    {
      question: "Why does the rate move so much day to day?",
      answer: "Currency values respond to interest rates, inflation figures, trade balances and political events, and the market trades continuously. Moves of one percent in a day are routine, and more around a central bank announcement.",
    },
  ],
};
