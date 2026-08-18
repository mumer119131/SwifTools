import type { ToolContent } from "@/config/tool-content";

export const subscriptionTrackerContent: ToolContent = {
  steps: [
    "Add each subscription with its amount and how often it bills.",
    "Everything is converted to an annual figure, so mixed billing periods add up correctly.",
    "Untick anything you are thinking of cancelling to see the total without it.",
  ],
  notes: [
    "The number this exists to show you is the annual one. Individually every subscription is small and framed as monthly, which is precisely why they accumulate unnoticed — nobody thinks of £11.99 as £143.88, and eight of those is well over a thousand pounds a year that never appears as a single line anywhere.",
    "Mixed billing periods are what make it genuinely hard to add up in your head. One service bills monthly, another annually, a third every four weeks. Normalising everything to a yearly cost is the only way the total means anything, and it is the calculation people skip.",
    "A small detail with a real effect: a year is 365.25 days, so weekly billing is 52.18 payments rather than 52. Rounding to 52 understates every weekly line by a fifth of a payment, which on a £15 weekly subscription is about £2.70 a year. Small individually, and the entire point of the tool is a total that is actually right.",
    "Unticking rather than deleting is deliberate. Deciding what to cancel means seeing the total both with and without something, and a row you have deleted cannot be put back for comparison. Untick, look at the new figure, then decide.",
    "Your list is kept in this browser and never transmitted, which means it survives closing the tab and is still here next month — when it is worth checking again, because subscriptions are far easier to start than to remember.",
  ],
  faq: [
    {
      question: "How much do people spend on subscriptions?",
      answer: "Consistently more than they estimate. Surveys repeatedly find people underestimate their own total by a factor of two or more, because each subscription is small, framed monthly, and charged automatically. Adding them up is usually the surprising part.",
    },
    {
      question: "Why convert everything to a yearly figure?",
      answer: "Because mixed billing periods cannot be compared otherwise. £12 monthly and £120 yearly look similar and are not — the first is £144 a year. Normalising to an annual cost is the only way the total is meaningful.",
    },
    {
      question: "Is a weekly subscription 52 payments a year?",
      answer: "Slightly more — 52.18, because a year is 365.25 days. It is a minor difference per line and the tool uses the accurate figure, since an approximate total defeats the purpose.",
    },
    {
      question: "Is my list saved?",
      answer: "In this browser only, so it is still here next month. It is never transmitted anywhere, and clearing your browser data clears it.",
    },
  ],
};
