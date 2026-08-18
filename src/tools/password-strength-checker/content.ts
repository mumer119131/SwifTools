import type { ToolContent } from "@/config/tool-content";

export const passwordStrengthCheckerContent: ToolContent = {
  steps: [
    "Type or paste a password. Nothing is transmitted.",
    "Read the estimate: bits of entropy, and how long it would take to guess offline.",
    "The findings say what is weakening it, not just that it is weak.",
  ],
  notes: [
    "Most strength meters count character classes — one capital, one digit, one symbol — and rate `P@ssw0rd1` as strong. It is one of the worst passwords in existence. Every cracking tool tries dictionary words first, then the same words with `a` swapped for `@` and `o` for `0`, then those with a digit appended. Rules about character classes measure whether a password annoyed the person who chose it, not whether it resists guessing.",
    "This estimates the thing that actually matters: how many guesses are needed. That starts from the size of the alphabet and the length, then applies real penalties for patterns that collapse the search space — a common word, a keyboard run like `qwerty`, a sequence like `1234`, a repeated block, or a four-digit year. A pattern does not subtract a token amount from the score; it caps it, because a password that is guessable in a thousand attempts is guessable in a thousand attempts however many symbols it contains.",
    "The crack time assumes an offline attack at 100 billion guesses a second against a fast hash. That is deliberately pessimistic. A well-built service stores passwords with bcrypt or Argon2, which are slow on purpose and would take far longer — but you do not control how a service stores yours, and the sensible assumption is the worst realistic case.",
    "The single most effective change is length. Four unrelated words are both stronger and easier to remember than a short scrambled string, which is why `correct horse battery staple` outscores `Tr0ub4dor&3` here — and why it is the example everybody cites.",
    "The common-password list is short by necessity: a real checker compares against a corpus of millions of leaked passwords, and shipping one to your browser is not practical. Passing this check is not proof your password is unbreached. Use a password manager and a unique password per service, and the question stops mattering.",
    "Everything runs in your browser and nothing is sent, stored or logged. Even so, the sensible habit is not to type a password you actually use into any web page — including this one. Try a variation.",
  ],
  faq: [
    {
      question: "Is P@ssw0rd1 a strong password?",
      answer: "No — it is close to the weakest possible. Cracking tools try dictionary words, then the same words with lookalike character substitutions, then those with digits appended. All three of those describe it. Meters that call it strong are counting character classes rather than measuring guessability.",
    },
    {
      question: "What actually makes a password strong?",
      answer: "Length, and being unpredictable. Four unrelated words beat a short scrambled string on both counts — more total entropy, and far easier to remember. Character-class rules add very little once a password is long.",
    },
    {
      question: "What does entropy in bits mean?",
      answer: "Roughly the number of times an attacker must double their guesses. Each extra bit doubles the work: 40 bits is about a trillion guesses, 80 bits is beyond any feasible attack. Under about 40 bits is not safe for anything that matters.",
    },
    {
      question: "Is my password sent anywhere when I check it?",
      answer: "No. Everything runs in your browser, with no request to make — you can disconnect and it still works. Even so, do not type a password you are actively using into any web page, including this one. Check a variation instead.",
    },
    {
      question: "Does passing this mean my password is safe?",
      answer: "No. It cannot tell whether your password has appeared in a breach, which is the most important question and needs a corpus of millions of entries that cannot practically be shipped to a browser. Use a password manager and a unique password per service.",
    },
  ],
};
