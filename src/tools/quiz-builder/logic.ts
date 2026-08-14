export interface Question {
  id: string;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  correct: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export const STARTER: Quiz = {
  title: "My quiz",
  questions: [
    {
      id: "q1",
      prompt: "Which planet has the shortest day?",
      options: ["Mercury", "Jupiter", "Mars", "Venus"],
      correct: 1,
    },
    {
      id: "q2",
      prompt: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: 2,
    },
  ],
};

export interface Marked {
  score: number;
  total: number;
  percent: number;
  results: { question: Question; chosen: number | null; correct: boolean }[];
}

/**
 * Marks an attempt.
 *
 * An unanswered question counts as wrong rather than being skipped — a score of
 * "3 out of 3 answered" out of a ten-question quiz tells you nothing useful.
 */
export function mark(quiz: Quiz, answers: Record<string, number>): Marked {
  const results = quiz.questions.map((question) => {
    const chosen = question.id in answers ? answers[question.id] : null;
    return { question, chosen, correct: chosen === question.correct };
  });

  const score = results.filter((result) => result.correct).length;
  const total = quiz.questions.length;

  return { score, total, percent: total > 0 ? (score / total) * 100 : 0, results };
}
