"use client";

import * as React from "react";
import { FileWarning, Plus, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";

export interface FileDropzoneProps {
  /** Comma-separated accept string, e.g. "application/pdf" or "image/*". */
  accept: string;
  /** Human-readable version of `accept`, shown in the hint line. */
  acceptLabel: string;
  multiple?: boolean;
  maxSizeMb?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  /** Optional thumbnail renderer, used by the image tools. */
  renderPreview?: (file: File) => React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) return true;

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern);
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));
    return type === pattern;
  });
}

/**
 * Drag-and-drop plus click-to-browse, with type and size validation.
 *
 * The whole zone is a button so it is reachable by keyboard; the file input is
 * kept off-screen rather than hidden with `display:none`, which some browsers
 * refuse to activate programmatically.
 */
export function FileDropzone({
  accept,
  acceptLabel,
  multiple = false,
  maxSizeMb = 100,
  files,
  onFilesChange,
  renderPreview,
  className,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const dragDepth = React.useRef(0);

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      const candidates = Array.from(incoming);
      const rejected: string[] = [];
      const accepted: File[] = [];

      for (const file of candidates) {
        if (!matchesAccept(file, accept)) {
          rejected.push(`${file.name} is not ${acceptLabel}`);
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          rejected.push(`${file.name} is larger than ${maxSizeMb} MB`);
          continue;
        }
        accepted.push(file);
      }

      setError(rejected.length ? rejected[0] : null);
      if (accepted.length === 0) return;
      onFilesChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
    },
    [accept, acceptLabel, files, maxSizeMb, multiple, onFilesChange],
  );

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (disabled) return;
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  }

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
    setError(null);
  }

  const hasFiles = files.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-describedby="dropzone-hint"
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center",
            "cursor-pointer transition-[border-color,background-color,transform] duration-[180ms] ease-out-expo",
            "border-border bg-surface hover:border-border-strong hover:bg-surface-hover",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
            "disabled:cursor-not-allowed disabled:opacity-45",
            isDragging && "scale-[1.005] border-border-strong bg-surface-hover",
            hasFiles && "py-8",
          )}
        >
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full border border-border bg-background",
              "transition-transform duration-[180ms] ease-out-expo",
              isDragging && "scale-110",
            )}
          >
            <UploadCloud className="size-5 text-muted-foreground" strokeWidth={1.75} />
          </span>
          <span className="space-y-1">
            <span className="block text-sm font-medium text-foreground">
              {isDragging
                ? "Drop to add"
                : hasFiles && multiple
                  ? "Add more files"
                  : `Drop ${multiple ? "files" : "a file"} here, or click to browse`}
            </span>
            <span id="dropzone-hint" className="block text-xs text-muted-foreground">
              {acceptLabel} · up to {maxSizeMb} MB{multiple ? " each" : ""}
            </span>
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files?.length) addFiles(event.target.files);
          // Reset so re-selecting the same file still fires a change event.
          event.target.value = "";
        }}
      />

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-3 py-2 text-sm text-destructive"
        >
          <FileWarning className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{error}</span>
        </p>
      ) : null}

      {hasFiles ? (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 rounded-md border border-border bg-surface p-2.5"
            >
              {renderPreview ? (
                <span className="shrink-0">{renderPreview(file)}</span>
              ) : (
                <span className="grid size-9 shrink-0 place-items-center rounded bg-surface-hover font-mono text-[0.625rem] font-medium uppercase text-muted-foreground">
                  {file.name.split(".").pop()?.slice(0, 4) ?? "file"}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-foreground">{file.name}</span>
                <span className="block text-xs text-muted-foreground" data-numeric>
                  {formatBytes(file.size)}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X strokeWidth={1.75} />
              </Button>
            </li>
          ))}
          {multiple && files.length > 1 ? (
            <li>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onFilesChange([])}
                className="text-xs"
              >
                <X strokeWidth={1.75} />
                Clear all
              </Button>
            </li>
          ) : null}
        </ul>
      ) : null}

      {hasFiles && multiple ? (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Plus strokeWidth={1.75} />
          Add files
        </Button>
      ) : null}
    </div>
  );
}
