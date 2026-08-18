"use client";

import * as React from "react";
import { Minimize2 } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SqlLanguage } from "sql-formatter";
import { dialects, formatSql, minifySql, type KeywordCase } from "./logic";

const SAMPLE =
  "select u.id, u.email, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.created_at > '2026-01-01' and u.active = true group by u.id, u.email having count(o.id) > 3 order by orders desc limit 50;";

export default function SqlFormatterTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [dialect, setDialect] = React.useState<SqlLanguage>("sql");
  const [keywordCase, setKeywordCase] = React.useState<KeywordCase>("upper");
  const [indent, setIndent] = React.useState("2");
  const [expandLists, setExpandLists] = React.useState(false);
  const [minified, setMinified] = React.useState(false);

  const result = React.useMemo(() => {
    if (minified) return minifySql(input, dialect);
    return formatSql(input, { dialect, indent: Number(indent), keywordCase, expandLists });
  }, [input, dialect, indent, keywordCase, expandLists, minified]);

  const failed = "error" in result;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dialect">Dialect</Label>
          <Select value={dialect} onValueChange={(value) => setDialect(value as SqlLanguage)}>
            <SelectTrigger id="dialect" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dialects.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="keyword-case">Keywords</Label>
          <Select
            value={keywordCase}
            onValueChange={(value) => setKeywordCase(value as KeywordCase)}
          >
            <SelectTrigger id="keyword-case" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upper">UPPERCASE</SelectItem>
              <SelectItem value="lower">lowercase</SelectItem>
              <SelectItem value="preserve">As written</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sql-indent">Indent</Label>
          <Select value={indent} onValueChange={setIndent}>
            <SelectTrigger id="sql-indent" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["2", "4", "8"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value} spaces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2.5 pb-2 text-sm text-foreground">
          <Switch checked={expandLists} onCheckedChange={setExpandLists} />
          One column per line
        </label>

        <Button
          variant={minified ? "default" : "outline"}
          onClick={() => setMinified((value) => !value)}
          className="ml-auto"
        >
          <Minimize2 strokeWidth={1.75} />
          {minified ? "Formatted" : "Minify"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sql-input">Query</Label>
          <Textarea
            id="sql-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
            aria-invalid={failed}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="sql-output">{minified ? "Minified" : "Formatted"}</Label>
            {!failed && result.output !== "" ? <CopyButton value={result.output} /> : null}
          </div>
          <Textarea
            id="sql-output"
            value={failed ? "" : result.output}
            readOnly
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
      </div>

      {failed ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 font-mono text-sm text-foreground">
          {result.error}
        </p>
      ) : null}
    </div>
  );
}
