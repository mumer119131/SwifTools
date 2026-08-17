"use client";

import * as React from "react";
import { Info, Trash2 } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

interface Note {
  title: string;
  body: string;
}

const EMPTY: Note = { title: "Untitled note", body: "" };

export default function OnlineNotepadTool() {
  const [note, setNote, clear] = useLocalStorage<Note>("pockettoolz:notepad", EMPTY);
  const [monospace, setMonospace] = React.useState(false);

  const words = note.body.trim() ? note.body.trim().split(/\s+/).length : 0;
  const lines = note.body ? note.body.split("\n").length : 0;

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="note-title">Title</Label>
          <Input
            id="note-title"
            value={note.title}
            onChange={(event) => setNote((current) => ({ ...current, title: event.target.value }))}
          />
        </div>

        <div className="flex items-center gap-3 pb-2">
          <Switch id="note-mono" checked={monospace} onCheckedChange={setMonospace} />
          <Label htmlFor="note-mono">Monospace</Label>
        </div>

        <div className="flex flex-wrap gap-2 pb-1">
          <CopyButton value={note.body} label="Copy" />
          <DownloadButton
            blob={() => new Blob([note.body], { type: "text/plain;charset=utf-8" })}
            fileName={`${note.title.replace(/[^\w\s-]/g, "").trim() || "note"}.txt`}
            label="Download .txt"
          />
          <Button
            variant="ghost"
            onClick={clear}
            disabled={!note.body && note.title === EMPTY.title}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
            Clear
          </Button>
        </div>
      </div>

      <Textarea
        value={note.body}
        onChange={(event) => setNote((current) => ({ ...current, body: event.target.value }))}
        rows={22}
        spellCheck
        placeholder="Start typing. Everything is saved as you go."
        aria-label="Note body"
        className={cn("text-base leading-relaxed", monospace && "font-mono text-sm")}
      />

      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span>
          <span className="font-mono text-foreground" data-numeric>
            {words.toLocaleString("en-US")}
          </span>{" "}
          words
        </span>
        <span>
          <span className="font-mono text-foreground" data-numeric>
            {note.body.length.toLocaleString("en-US")}
          </span>{" "}
          characters
        </span>
        <span>
          <span className="font-mono text-foreground" data-numeric>
            {lines.toLocaleString("en-US")}
          </span>{" "}
          lines
        </span>
        <span className="text-subtle-foreground">Saved automatically</span>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The note is stored in this browser&rsquo;s local storage — there is no
          account and nothing is uploaded, which also means it will not appear on
          another device and that clearing site data will delete it. Download
          anything you would be sorry to lose. Browsers cap local storage at a
          few megabytes, which is a very long note but not an unlimited one.
        </span>
      </p>
    </div>
  );
}
