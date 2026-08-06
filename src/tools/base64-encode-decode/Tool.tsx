"use client";

import * as React from "react";
import { ArrowUpDown, TriangleAlert } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes } from "@/lib/utils";
import { decodeBase64, encodeBase64, fileToDataUri, isProbablyBase64 } from "./logic";

type Direction = "encode" | "decode";
type Source = "text" | "file";

export default function Base64Tool() {
  const [direction, setDirection] = React.useState<Direction>("encode");
  const [source, setSource] = React.useState<Source>("text");
  const [input, setInput] = React.useState("");
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dataUri, setDataUri] = React.useState("");
  const [fileError, setFileError] = React.useState<string | null>(null);

  const file = files[0];

  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;
    fileToDataUri(file)
      .then((uri) => {
        if (!cancelled) setDataUri(uri);
      })
      .catch(() => {
        if (!cancelled) setFileError("That file could not be read.");
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  const { output, error } = React.useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };

    try {
      return {
        output:
          direction === "encode"
            ? encodeBase64(input, urlSafe)
            : decodeBase64(input, urlSafe),
        error: null as string | null,
      };
    } catch {
      return {
        output: "",
        error:
          direction === "decode"
            ? "That isn't valid Base64, or it doesn't decode to UTF-8 text. Check for stray characters, and try the URL-safe toggle."
            : "That text could not be encoded.",
      };
    }
  }, [input, direction, urlSafe]);

  // Nudge rather than auto-switch: silently flipping mode under someone mid-task
  // is worse than a hint they can ignore.
  const looksMisdirected =
    direction === "encode" && input.trim().length > 16 && isProbablyBase64(input);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={direction} onValueChange={(value) => setDirection(value as Direction)}>
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={source} onValueChange={(value) => setSource(value as Source)}>
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Switch id="url-safe" checked={urlSafe} onCheckedChange={setUrlSafe} />
          <Label htmlFor="url-safe">URL-safe</Label>
        </div>
      </div>

      {source === "text" ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="base64-input">
                {direction === "encode" ? "Text to encode" : "Base64 to decode"}
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Round-trip: the output becomes the next input.
                    setInput(output);
                    setDirection(direction === "encode" ? "decode" : "encode");
                  }}
                  disabled={!output}
                >
                  <ArrowUpDown strokeWidth={1.75} />
                  Swap
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              id="base64-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={direction === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="}
              className="min-h-40 font-mono text-sm"
              spellCheck={false}
            />
            <FieldHint>
              {urlSafe
                ? "URL-safe mode uses - and _ instead of + and /, and drops the = padding."
                : "Standard Base64. Non-ASCII text is encoded as UTF-8 first, so accents and emoji survive."}
            </FieldHint>
          </div>

          {looksMisdirected ? (
            <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                That looks like it is already Base64. Switch to <strong>Decode</strong> if you meant
                to go the other way.
              </span>
            </p>
          ) : null}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <CodeOutput
            value={output}
            label={direction === "encode" ? "Base64" : "Decoded text"}
            fileName={direction === "encode" ? "encoded.txt" : "decoded.txt"}
            className="whitespace-pre-wrap break-all"
          />
        </>
      ) : (
        <>
          <FileDropzone
            accept="*/*"
            acceptLabel="any file"
            maxSizeMb={5}
            files={files}
            onFilesChange={(next) => {
              setFiles(next);
              setDataUri("");
              setFileError(null);
            }}
          />

          {fileError ? (
            <p role="alert" className="text-sm text-destructive">
              {fileError}
            </p>
          ) : null}

          {dataUri ? (
            <>
              <CodeOutput
                value={dataUri}
                label="Data URI"
                fileName="data-uri.txt"
                className="whitespace-pre-wrap break-all"
              />
              <p className="text-sm text-muted-foreground">
                Encoded size:{" "}
                <span className="font-mono text-foreground" data-numeric>
                  {formatBytes(dataUri.length)}
                </span>{" "}
                — Base64 adds roughly a third to the original {formatBytes(file?.size ?? 0)}. Paste
                it into an <code className="font-mono">src</code> or a CSS{" "}
                <code className="font-mono">url()</code>.
              </p>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
