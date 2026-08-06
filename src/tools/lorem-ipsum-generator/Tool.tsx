"use client";

import * as React from "react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import { countStats, generate, type Flavour, type OutputFormat, type Unit } from "./logic";

export default function LoremIpsumTool() {
  const [unit, setUnit] = React.useState<Unit>("paragraphs");
  const [count, setCount] = React.useState(3);
  const [flavour, setFlavour] = React.useState<Flavour>("latin");
  const [startWithLorem, setStartWithLorem] = React.useState(true);
  const [format, setFormat] = React.useState<OutputFormat>("plain");

  const output = React.useMemo(
    () => generate({ unit, count, flavour, startWithLorem, format }),
    [unit, count, flavour, startWithLorem, format],
  );

  const stats = countStats(output);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="lorem-unit">Generate</Label>
          <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
            <SelectTrigger id="lorem-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
              <SelectItem value="list">List items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lorem-count">How many</Label>
          <Input
            id="lorem-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            value={count}
            onChange={(event) =>
              setCount(Math.max(1, Math.min(200, Number(event.target.value) || 1)))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lorem-format">Output</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
            <SelectTrigger id="lorem-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plain">Plain text</SelectItem>
              <SelectItem value="html">HTML tags</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Language</span>
          <Tabs value={flavour} onValueChange={(value) => setFlavour(value as Flavour)}>
            <TabsList className="w-full">
              <TabsTrigger value="latin" className="flex-1">
                Latin
              </TabsTrigger>
              <TabsTrigger value="english" className="flex-1">
                English
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {flavour === "latin" ? (
          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
            <Switch
              id="lorem-start"
              checked={startWithLorem}
              onCheckedChange={setStartWithLorem}
            />
            <Label htmlFor="lorem-start">
              Start with &ldquo;Lorem ipsum dolor sit amet…&rdquo;
            </Label>
          </div>
        ) : (
          <FieldHint className="sm:col-span-2 lg:col-span-4">
            English placeholder uses real words with realistic length, which makes it much easier to
            judge whether a line length or heading actually reads well.
          </FieldHint>
        )}
      </div>

      <CodeOutput
        value={output}
        label="Placeholder text"
        fileName={format === "html" ? "lorem.html" : "lorem.txt"}
        mimeType={format === "html" ? "text/html;charset=utf-8" : "text/plain;charset=utf-8"}
        className="whitespace-pre-wrap"
      />

      <p className="text-sm text-muted-foreground">
        <span data-numeric>{formatNumber(stats.words)}</span> words ·{" "}
        <span data-numeric>{formatNumber(stats.characters)}</span> characters
      </p>
    </div>
  );
}
