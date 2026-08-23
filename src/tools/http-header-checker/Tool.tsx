"use client";

import * as React from "react";
import { ArrowRight, Check, Search, TriangleAlert, X } from "lucide-react";

import type { HeaderHop } from "@/app/api/headers/route";
import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { auditSecurityHeaders, fetchHeaders } from "./logic";

export default function HttpHeaderCheckerTool() {
  const [url, setUrl] = React.useState("");
  const [hops, setHops] = React.useState<HeaderHop[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const final = hops?.[hops.length - 1] ?? null;
  const findings = final ? auditSecurityHeaders(final.headers) : [];

  async function run() {
    const trimmed = url.trim();
    if (trimmed === "") return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchHeaders(trimmed);
      setHops(result.hops);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The check failed.");
      setHops(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <Label htmlFor="header-url">URL</Label>
        <div className="flex gap-2">
          <Input
            id="header-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="example.com"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <Button type="submit" disabled={loading || url.trim() === ""}>
            {loading ? <Spinner className="text-current" /> : <Search strokeWidth={1.75} />}
            Check
          </Button>
        </div>
        <FieldHint>https:// is assumed if you leave the scheme off. Redirects are followed.</FieldHint>
      </form>

      {error !== null ? (
        <p className="flex items-start gap-2 rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}

      {hops !== null && hops.length > 1 ? (
        <div className="space-y-2">
          <h2 className="text-[0.9375rem] font-medium text-foreground">
            Redirect chain ({hops.length - 1} {hops.length === 2 ? "hop" : "hops"})
          </h2>
          <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {hops.map((hop) => (
              <li key={hop.url} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="font-mono text-xs text-subtle-foreground" data-numeric>
                  {hop.status}
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-subtle-foreground" strokeWidth={1.75} />
                <span className="break-all text-muted-foreground">{hop.url}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {final !== null ? (
        <>
          <div className="space-y-2">
            <h2 className="text-[0.9375rem] font-medium text-foreground">Security headers</h2>
            <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
              {findings.map((finding) => (
                <li key={finding.header} className="bg-surface px-4 py-3">
                  <div className="flex items-center gap-2">
                    {finding.present ? (
                      <Check className="size-4 shrink-0 text-foreground" strokeWidth={2} />
                    ) : (
                      <X className="size-4 shrink-0 text-subtle-foreground" strokeWidth={2} />
                    )}
                    <span className="text-sm font-medium text-foreground">{finding.header}</span>
                    <span className="ml-auto text-xs text-subtle-foreground">
                      {finding.present ? "Set" : "Not set"}
                    </span>
                  </div>
                  {finding.value !== null ? (
                    <p className="mt-1.5 break-all pl-6 font-mono text-xs text-muted-foreground">
                      {finding.value}
                    </p>
                  ) : null}
                  <p className="mt-1.5 pl-6 text-sm leading-relaxed text-muted-foreground">
                    {finding.advice}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[0.9375rem] font-medium text-foreground">
                All response headers ({final.headers.length})
              </h2>
              <CopyButton
                value={final.headers.map(([name, value]) => `${name}: ${value}`).join("\n")}
                label="Copy all"
              />
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-border">
                  {final.headers.map(([name, value]) => (
                    <tr key={name}>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs font-medium text-foreground"
                      >
                        {name}
                      </th>
                      <td className="break-all px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
