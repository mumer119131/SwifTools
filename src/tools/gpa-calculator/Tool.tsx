"use client";

import * as React from "react";
import { Info, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import {
  SCALE_LABELS, blankCourse, calculate, gradeOptions, pointsFor, requiredAverage,
  type Course, type Scale,
} from "./logic";

const STARTERS: Course[] = [
  { id: "c1", name: "Course 1", grade: "A", credits: 3, honours: false },
  { id: "c2", name: "Course 2", grade: "B", credits: 4, honours: false },
  { id: "c3", name: "Course 3", grade: "A", credits: 3, honours: false },
];

export default function GpaCalculatorTool() {
  const [scale, setScale] = React.useState<Scale>("4.0-plus");
  const [courses, setCourses] = useLocalStorage<Course[]>("pockettoolz:gpa", STARTERS);
  const [target, setTarget] = React.useState("");
  const [remaining, setRemaining] = React.useState("");

  const result = calculate(courses, scale);
  const options = gradeOptions(scale);

  const needed =
    result && Number(target) > 0 && Number(remaining) > 0
      ? requiredAverage(result, Number(target), Number(remaining))
      : null;

  function update(id: string, patch: Partial<Course>) {
    setCourses((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="scale">Grading scale</Label>
        <Select value={scale} onValueChange={(v) => setScale(v as Scale)}>
          <SelectTrigger id="scale" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SCALE_LABELS) as Scale[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SCALE_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Course</th>
              <th className="px-4 py-2.5 font-medium">{scale === "uk" ? "Mark (%)" : "Grade"}</th>
              <th className="px-4 py-2.5 font-medium">Credits</th>
              {scale !== "uk" ? <th className="px-4 py-2.5 font-medium">Honours</th> : null}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => {
              const valid = pointsFor(course.grade, scale) !== null;
              return (
                <tr key={course.id} className={cn(!valid && course.grade !== "" && "opacity-60")}>
                  <td className="px-4 py-2">
                    <Input
                      value={course.name}
                      onChange={(e) => update(course.id, { name: e.target.value })}
                      className="h-9 w-40"
                      aria-label="Course name"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {options.length > 0 ? (
                      <Select
                        value={course.grade}
                        onValueChange={(v) => update(course.id, { grade: v })}
                      >
                        <SelectTrigger className="h-9 w-24">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        inputMode="numeric"
                        value={course.grade}
                        onChange={(e) => update(course.id, { grade: e.target.value })}
                        className="h-9 w-24 font-mono"
                        placeholder="68"
                        aria-label="Mark"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      inputMode="numeric"
                      value={String(course.credits)}
                      onChange={(e) => update(course.id, { credits: Number(e.target.value) || 0 })}
                      className="h-9 w-20 font-mono"
                      aria-label="Credits"
                    />
                  </td>
                  {scale !== "uk" ? (
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={course.honours}
                        onChange={(e) => update(course.id, { honours: e.target.checked })}
                        className="size-4 cursor-pointer accent-[var(--accent-calculator)]"
                        aria-label="Honours or AP"
                      />
                    </td>
                  ) : null}
                  <td className="px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Remove ${course.name}`}
                      disabled={courses.length <= 1}
                      onClick={() => setCourses((list) => list.filter((c) => c.id !== course.id))}
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCourses((list) => [...list, blankCourse(list.length + 1)])}
        >
          <Plus strokeWidth={1.75} />
          Add a course
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCourses(STARTERS)}>
          Start over
        </Button>
      </div>

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [scale === "uk" ? "Average mark" : "GPA", scale === "uk" ? result.gpa.toFixed(1) : result.gpa.toFixed(2), true],
              ["Total credits", String(result.totalCredits), false],
              ["Courses counted", String(result.countedCourses), false],
              [
                result.weightedGpa !== null ? "Weighted GPA" : "Unweighted mean",
                result.weightedGpa !== null ? result.weightedGpa.toFixed(2) : result.simpleMean.toFixed(2),
                false,
              ],
            ].map(([label, value, highlight]) => (
              <div key={label as string} className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd
                  className={cn("mt-0.5 font-mono text-xl", highlight ? "text-[var(--accent-calculator)]" : "text-foreground")}
                  data-numeric
                >
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {result.classification ? (
            <p className="surface-card px-5 py-4">
              <span className="text-xs text-muted-foreground">Classification</span>
              <span className="mt-0.5 block text-xl text-foreground">{result.classification}</span>
            </p>
          ) : null}

          {scale !== "uk" && Math.abs(result.gpa - result.simpleMean) > 0.01 ? (
            <p className="text-sm text-muted-foreground">
              Weighted by credits your GPA is{" "}
              <span className="font-mono text-foreground">{result.gpa.toFixed(2)}</span>, but
              treating every course equally would give{" "}
              <span className="font-mono text-foreground">{result.simpleMean.toFixed(2)}</span>.
              A grade in a four-credit course counts for four times as much as one
              in a single-credit course, which is exactly what a plain average
              throws away.
            </p>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-foreground">What do I need next term?</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="target">Target {scale === "uk" ? "average" : "GPA"}</Label>
                <Input id="target" inputMode="decimal" value={target}
                  onChange={(e) => setTarget(e.target.value)} className="w-28 font-mono"
                  placeholder={scale === "uk" ? "70" : "3.5"} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remaining">Credits remaining</Label>
                <Input id="remaining" inputMode="numeric" value={remaining}
                  onChange={(e) => setRemaining(e.target.value)} className="w-28 font-mono"
                  placeholder="30" />
              </div>
            </div>

            {needed ? (
              <p
                className={cn(
                  "rounded-md border px-4 py-3 text-sm",
                  needed.achievable
                    ? "border-border bg-surface text-muted-foreground"
                    : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-foreground",
                )}
              >
                {needed.achievable ? (
                  <>
                    You would need to average{" "}
                    <span className="font-mono text-foreground">{needed.required}</span> across
                    the remaining {remaining} credits.
                  </>
                ) : (
                  <>
                    That would need an average of{" "}
                    <span className="font-mono">{needed.required}</span> across the remaining
                    credits, which is above the maximum. The target is not reachable
                    from here — worth knowing now rather than at the end of term.
                  </>
                )}
              </p>
            ) : null}
          </section>
        </>
      ) : (
        <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          Enter at least one grade with credits above zero.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Institutions vary in how they map letters to points, whether they count
          plus and minus grades, and how they treat resits — check yours before
          relying on a figure. Your courses are kept in this browser and never
          sent anywhere.
        </span>
      </p>
    </div>
  );
}
