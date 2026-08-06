"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatNumber } from "@/lib/utils";
import { analyseDensity, verdictFor, type KeywordRow } from "./logic";

type View = "single" | "pairs" | "triples";

export default function KeywordDensityTool() {
  const [text, setText] = React.useState("");
  const [view, setView] = React.useState<View>("single");

  const report = React.useMemo(() => analyseDensity(text), [text]);
  const rows: KeywordRow[] =
    view === "single" ? report.single : view === "pairs" ? report.pairs : report.triples;

  const peak = rows[0]?.count ?? 1;
  const overused = report.single.filter((row) => verdictFor(row.density) === "high");

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="density-input">Your content</Label>
          <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
            Clear
          </Button>
        </div>
        <Textarea
          id="density-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste the page copy or article you want to analyse…"
          className="min-h-56"
          spellCheck
        />
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Total words", value: formatNumber(report.totalWords) },
          { label: "Unique words", value: formatNumber(report.uniqueWords) },
          { label: "Lexical variety", value: `${report.lexicalDiversity.toFixed(0)}%` },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-2xl tracking-[-0.02em] text-foreground" data-numeric>
              {card.value}
            </dd>
          </div>
        ))}
      </dl>

      {overused.length > 0 ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
          <span>
            <strong className="text-foreground">
              {overused.map((row) => `“${row.phrase}”`).join(", ")}
            </strong>{" "}
            {overused.length === 1 ? "appears" : "appear"} above 3% density. That&rsquo;s usually a
            sign the copy is repeating itself rather than an SEO problem — read those sentences back
            and see whether a synonym reads better.
          </span>
        </p>
      ) : null}

      <Tabs value={view} onValueChange={(value) => setView(value as View)}>
        <TabsList>
          <TabsTrigger value="single">Single words</TabsTrigger>
          <TabsTrigger value="pairs">Two-word phrases</TabsTrigger>
          <TabsTrigger value="triples">Three-word phrases</TabsTrigger>
        </TabsList>
      </Tabs>

      {rows.length > 0 ? (
        <section className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Most frequent terms with their count and density as a percentage of all words.
              </caption>
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 text-left font-medium">Term</th>
                  <th scope="col" className="px-5 py-2.5 text-left font-medium">Frequency</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium">Count</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium">Density</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const verdict = verdictFor(row.density);
                  return (
                    <tr key={row.phrase} className="border-b border-border last:border-0">
                      <td className="max-w-64 truncate px-5 py-2.5 text-foreground">{row.phrase}</td>
                      <td className="w-40 px-5 py-2.5">
                        <span className="block h-1.5 overflow-hidden rounded-full bg-border">
                          <span
                            className={cn(
                              "block h-full rounded-full",
                              verdict === "high" ? "bg-destructive" : "bg-primary",
                            )}
                            style={{ width: `${(row.count / peak) * 100}%` }}
                          />
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono text-muted-foreground" data-numeric>
                        {row.count}×
                      </td>
                      <td
                        className={cn(
                          "px-5 py-2.5 text-right font-mono",
                          verdict === "high" ? "text-destructive" : "text-foreground",
                        )}
                        data-numeric
                      >
                        {row.density.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          {text ? "Not enough repeated terms to report on yet." : "Paste some content to analyse."}
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Single-word counts exclude common filler like &ldquo;the&rdquo; and &ldquo;and&rdquo;;
        phrase counts keep them, because &ldquo;cost of living&rdquo; falls apart without the
        &ldquo;of&rdquo;. Density is a readability signal, not a ranking factor — search engines
        stopped scoring keyword percentages a long time ago.
      </p>
    </div>
  );
}
