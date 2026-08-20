import type { ToolContent } from "@/config/tool-content";

export const httpStatusCodesContent: ToolContent = {
  steps: [
    "Search by number, name or meaning — 404, teapot, redirect.",
    "Each entry says what the server is claiming and when to use it.",
    "The confusable pairs are listed first, because that is what people arrive for.",
  ],
  notes: [
    "The first digit tells you who is at fault and what to do. 2xx means it worked. 3xx means look elsewhere. 4xx means the request was wrong and sending it again unchanged will not help. 5xx means the request was fine and something on the server failed — which is the one worth retrying.",
    "The distinction that costs people the most is 301 against 302. A 301 is permanent: it passes ranking signals to the new URL and browsers cache it hard, often indefinitely. A 302 is temporary and keeps the original URL indexed. Using 302 for a move that is actually permanent leaves your rankings attached to a URL you have abandoned, and using 301 by mistake is genuinely difficult to undo, because visitors stop asking your server at all.",
    "401 and 403 are swapped constantly, partly because 401 is misnamed. It means unauthenticated — we do not know who you are, so log in. 403 means authenticated and still refused — we know exactly who you are, and the answer is no. Logging in again fixes one and not the other, which is why sending the wrong one sends people round in circles.",
    "The mistake that does the most quiet damage is returning 200 with an error message in the body. Clients treat it as success, caches store it, monitoring reports everything as healthy, and retry logic never fires. If the request failed, say so in the status line.",
    "418 I'm a Teapot began as an April Fools' joke in 1998 and has survived every serious attempt to remove it from the standard, on the grounds that people rather like it being there.",
  ],
  faq: [
    {
      question: "What is the difference between 301 and 302?",
      answer: "301 is permanent and 302 is temporary. A 301 passes ranking signals to the new URL and is cached hard by browsers; a 302 keeps them on the original. Using 302 for a permanent move is the classic mistake — the rankings stay on a URL you no longer use.",
    },
    {
      question: "What is the difference between 401 and 403?",
      answer: "401 means we do not know who you are — authenticate. 403 means we do know, and you are still not allowed. Logging in resolves a 401 and does nothing for a 403.",
    },
    {
      question: "What does a 404 actually mean?",
      answer: "There is nothing at that address. It says nothing about whether there ever was — for something deliberately removed, 410 Gone is more accurate and search engines drop it much faster.",
    },
    {
      question: "Should I return 200 with an error message?",
      answer: "No, and it causes real damage. Clients, caches, monitoring and retry logic all read the status line rather than the body, so a failure dressed as a 200 is treated as a success by every layer between you and the user.",
    },
    {
      question: "When should I use 400 rather than 422?",
      answer: "400 for a request the server could not parse — malformed syntax. 422 for one that parsed perfectly and failed validation. The distinction tells the client whether to fix the shape or the contents.",
    },
  ],
};
