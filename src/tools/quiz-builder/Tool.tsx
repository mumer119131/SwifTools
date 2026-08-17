"use client";

import * as React from "react";
import { Check, Info, Plus, RotateCcw, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { STARTER, mark, type Quiz } from "./logic";

export default function QuizBuilderTool() {
  const [quiz, setQuiz, clear] = useLocalStorage<Quiz>("pockettoolz:quiz", STARTER);
  const [mode, setMode] = React.useState<"build" | "play">("build");
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const marked = mark(quiz, answers);

  function updateQuestion(id: string, patch: Partial<Quiz["questions"][number]>) {
    setQuiz((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === id ? { ...question, ...patch } : question,
      ),
    }));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end justify-between gap-4 p-5">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="quiz-title">Quiz title</Label>
          <Input
            id="quiz-title"
            value={quiz.title}
            onChange={(event) => setQuiz((current) => ({ ...current, title: event.target.value }))}
          />
        </div>

        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as "build" | "play");
            setAnswers({});
            setSubmitted(false);
          }}
        >
          <TabsList>
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="play">Take it</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <CopyButton
            value={[
              quiz.title,
              "",
              ...quiz.questions.map(
                (question, index) =>
                  `${index + 1}. ${question.prompt}\n${question.options
                    .map((option, i) => `   ${String.fromCharCode(97 + i)}) ${option}${i === question.correct ? "  ✓" : ""}`)
                    .join("\n")}`,
              ),
            ].join("\n")}
            label="Copy quiz"
          />
          <Button variant="ghost" onClick={clear}>
            Reset
          </Button>
        </div>
      </div>

      {mode === "build" ? (
        <>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <section key={question.id} className="surface-card space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="pt-2.5 font-mono text-sm text-subtle-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor={`${question.id}-prompt`}>Question</Label>
                    <Input
                      id={`${question.id}-prompt`}
                      value={question.prompt}
                      onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })}
                      placeholder="What do you want to ask?"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete question ${index + 1}`}
                    onClick={() =>
                      setQuiz((current) => ({
                        ...current,
                        questions: current.questions.filter((entry) => entry.id !== question.id),
                      }))
                    }
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </Button>
                </div>

                <div className="space-y-2 pl-9">
                  <span className="text-sm font-medium text-foreground">
                    Options — click the circle to mark the right one
                  </span>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuestion(question.id, { correct: optionIndex })}
                        aria-label={`Mark option ${optionIndex + 1} correct`}
                        aria-pressed={question.correct === optionIndex}
                        className={cn(
                          "grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border-2",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                          question.correct === optionIndex
                            ? "border-[var(--success)] bg-[var(--success)] text-background"
                            : "border-border hover:border-border-strong",
                        )}
                      >
                        {question.correct === optionIndex ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : null}
                      </button>
                      <Input
                        value={option}
                        onChange={(event) =>
                          updateQuestion(question.id, {
                            options: question.options.map((entry, i) =>
                              i === optionIndex ? event.target.value : entry,
                            ),
                          })
                        }
                        aria-label={`Option ${optionIndex + 1}`}
                        className="h-9"
                      />
                      {question.options.length > 2 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove option ${optionIndex + 1}`}
                          onClick={() =>
                            updateQuestion(question.id, {
                              options: question.options.filter((_, i) => i !== optionIndex),
                              // Keep the correct answer pointing at the same option.
                              correct:
                                question.correct > optionIndex
                                  ? question.correct - 1
                                  : Math.min(question.correct, question.options.length - 2),
                            })
                          }
                        >
                          <X className="size-3.5" strokeWidth={1.75} />
                        </Button>
                      ) : null}
                    </div>
                  ))}

                  {question.options.length < 6 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuestion(question.id, { options: [...question.options, ""] })
                      }
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                      Add an option
                    </Button>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <Button
            onClick={() =>
              setQuiz((current) => ({
                ...current,
                questions: [
                  ...current.questions,
                  {
                    id: `q-${Date.now()}`,
                    prompt: "",
                    options: ["", "", "", ""],
                    correct: 0,
                  },
                ],
              }))
            }
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add a question
          </Button>
          <FieldHint>Saved in this browser as you type.</FieldHint>
        </>
      ) : (
        <>
          {submitted ? (
            <div className="surface-card p-6 text-center" aria-live="polite">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="mt-2 font-mono text-5xl tracking-[-0.03em] text-foreground" data-numeric>
                {marked.score} / {marked.total}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {marked.percent.toFixed(0)}%
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
              >
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Try again
              </Button>
            </div>
          ) : null}

          <ol className="space-y-4">
            {quiz.questions.map((question, index) => {
              const chosen = answers[question.id];

              return (
                <li key={question.id} className="surface-card space-y-3 p-5">
                  <p className="flex gap-3 text-base text-foreground">
                    <span className="font-mono text-sm text-subtle-foreground">{index + 1}</span>
                    {question.prompt || <em className="text-muted-foreground">Untitled question</em>}
                  </p>

                  <div className="space-y-2 pl-9">
                    {question.options.map((option, optionIndex) => {
                      const picked = chosen === optionIndex;
                      const isCorrect = question.correct === optionIndex;

                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                          }
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm",
                            "transition-colors duration-[180ms] ease-out-expo",
                            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]",
                            submitted && isCorrect
                              ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-foreground"
                              : submitted && picked
                                ? "border-destructive bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] text-foreground"
                                : picked
                                  ? "border-border-strong bg-surface-hover text-foreground"
                                  : "border-border bg-surface text-foreground hover:bg-surface-hover",
                          )}
                        >
                          <span className="font-mono text-xs text-subtle-foreground">
                            {String.fromCharCode(97 + optionIndex)}
                          </span>
                          {option || <em className="text-muted-foreground">empty option</em>}
                          {submitted && isCorrect ? (
                            <Check className="ml-auto size-4 text-[var(--success)]" strokeWidth={2} />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>

          {!submitted ? (
            <Button size="lg" onClick={() => setSubmitted(true)} disabled={quiz.questions.length === 0}>
              Mark my answers
            </Button>
          ) : null}
        </>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Unanswered questions are marked wrong rather than skipped — a score out
          of the questions you happened to attempt tells you nothing. The quiz
          lives in this browser only: there is no link to send anyone, so use
          &ldquo;copy quiz&rdquo; to get the text out and share that.
        </span>
      </p>
    </div>
  );
}
