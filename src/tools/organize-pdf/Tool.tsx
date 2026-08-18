"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Info, RotateCcw, RotateCw, Trash2, Undo2 } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { baseName, cn } from "@/lib/utils";
import {
  buildPdf,
  initialPages,
  isUnchanged,
  kept,
  movePage,
  reverse,
  rotateAll,
  rotatePage,
  toggleDelete,
  type PageState,
} from "./logic";

export default function OrganizePdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [bytes, setBytes] = React.useState<ArrayBuffer | null>(null);
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [pages, setPages] = React.useState<PageState[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load(next: File[]) {
    setFiles(next);
    setError(null);
    setThumbs([]);
    setPages([]);
    setBytes(null);

    const file = next[0];
    if (!file) return;

    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      setBytes(buffer);

      const document = await openPdf(buffer.slice(0));
      setPages(initialPages(document.numPages));

      // Thumbnails are small on purpose: a 200-page document rendered at full
      // size would exhaust memory long before it finished.
      const rendered: string[] = [];
      for (let page = 1; page <= document.numPages; page += 1) {
        const result = await renderPage(document, page, 0.3);
        rendered.push(result.canvas.toDataURL("image/jpeg", 0.7));
      }
      setThumbs(rendered);
      await closePdf(document);
    } catch {
      setError("That PDF could not be opened. If it is password-protected, remove the password first.");
    } finally {
      setBusy(false);
    }
  }

  async function download(): Promise<Blob> {
    if (!bytes) throw new Error("No document loaded.");
    const result = await buildPdf(bytes.slice(0), pages);
    return new Blob([result.slice().buffer as ArrayBuffer], { type: "application/pdf" });
  }

  const survivors = kept(pages);
  const unchanged = isUnchanged(pages);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="application/pdf"
        acceptLabel="A PDF — opened in your browser, never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {busy && pages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Rendering pages…</p>
      ) : null}

      {pages.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPages((p) => rotateAll(p, 90))}>
              <RotateCw strokeWidth={1.75} />
              Rotate all
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPages((p) => reverse(p))}>
              Reverse order
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPages(initialPages(thumbs.length))}
              disabled={unchanged}
            >
              <Undo2 strokeWidth={1.75} />
              Reset
            </Button>

            <span className="ml-auto text-sm text-muted-foreground" data-numeric>
              {survivors.length} of {pages.length} pages kept
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((page, index) => (
              <li
                key={`${page.source}-${index}`}
                className={cn(
                  "surface-card overflow-hidden transition-opacity",
                  page.deleted && "opacity-40",
                )}
              >
                <div className="grid h-40 place-items-center bg-surface-hover p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbs[page.source]}
                    alt={`Page ${page.source + 1}`}
                    className="max-h-full w-auto max-w-full shadow-sm transition-transform"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-1 border-t border-border px-2 py-1.5">
                  <span className="pl-1 text-xs text-muted-foreground" data-numeric>
                    {page.source + 1}
                  </span>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Move page ${page.source + 1} earlier`}
                      disabled={index === 0}
                      onClick={() => setPages((p) => movePage(p, index, index - 1))}
                    >
                      <ArrowLeft className="size-3.5" strokeWidth={1.75} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Move page ${page.source + 1} later`}
                      disabled={index === pages.length - 1}
                      onClick={() => setPages((p) => movePage(p, index, index + 1))}
                    >
                      <ArrowRight className="size-3.5" strokeWidth={1.75} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Rotate page ${page.source + 1}`}
                      onClick={() => setPages((p) => rotatePage(p, index, 90))}
                    >
                      <RotateCcw className="size-3.5" strokeWidth={1.75} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={page.deleted ? `Restore page ${page.source + 1}` : `Delete page ${page.source + 1}`}
                      onClick={() => setPages((p) => toggleDelete(p, index))}
                    >
                      <Trash2
                        className={cn("size-3.5", page.deleted && "text-destructive")}
                        strokeWidth={1.75}
                      />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <DownloadButton
            blob={download}
            fileName={`${baseName(files[0]?.name ?? "document")}-organised.pdf`}
            label={unchanged ? "Download (nothing changed yet)" : `Download ${survivors.length} pages`}
          />
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Reordering, rotating and deleting are all page-level operations, so
          nothing inside a page is decoded or re-encoded. Text stays selectable,
          images keep their original quality, and the file does not degrade —
          unlike anything that renders pages to images first.
        </span>
      </p>
    </div>
  );
}
