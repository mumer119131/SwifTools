"use client";

import * as React from "react";
import { AlertTriangle, Eraser, Info, PenLine } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { baseName, cn } from "@/lib/utils";
import {
  SIGNATURE_FONTS,
  clampPlacement,
  signatureBox,
  defaultStampText,
  signPdf,
  trimTransparent,
  type Placement,
  type SignatureFont,
} from "./logic";

type Source = "draw" | "type";

export default function SignPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [bytes, setBytes] = React.useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [signed, setSigned] = React.useState<Uint8Array | null>(null);

  const [source, setSource] = React.useState<Source>("draw");
  const [typed, setTyped] = React.useState("");
  const [font, setFont] = React.useState<SignatureFont>(SIGNATURE_FONTS[0].id);
  const [addDate, setAddDate] = React.useState(true);
  const [stampText, setStampText] = React.useState(defaultStampText());

  const [placement, setPlacement] = React.useState<Placement>({
    x: 0.6,
    y: 0.85,
    width: 0.25,
    pageNumber: 1,
  });

  const padRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const [hasInk, setHasInk] = React.useState(false);

  /* The drawn signature as it will actually appear, refreshed each time a
     stroke ends, so the page preview shows the real thing rather than a box. */
  const [ink, setInk] = React.useState<{ url: string; aspect: number } | null>(null);
  /** Page width over height, needed to turn a width fraction into a height. */
  const [pageRatio, setPageRatio] = React.useState(210 / 297);

  /* Where the signature will sit. Derived here rather than inside the markup
     so the drag handlers measure the same rectangle the page draws. */
  const signatureAspect = source === "draw" ? (ink?.aspect ?? 0.35) : 0.28;
  const box = signatureBox(placement, signatureAspect, pageRatio);

  /* Offset from the box's top-left to where the pointer grabbed it, so a drag
     holds the signature at the point picked up instead of snapping it. */
  const dragRef = React.useRef<{ dx: number; dy: number } | null>(null);


  /* ------------------------------------------------------ load the PDF */

  async function load(next: File[]) {
    setFiles(next);
    setError(null);
    setSigned(null);
    setPreview(null);
    setBytes(null);
    setPageCount(0);

    const file = next[0];
    if (!file) return;

    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      setBytes(buffer);

      const document = await openPdf(buffer.slice(0));
      setPageCount(document.numPages);
      setPlacement((current) => ({ ...current, pageNumber: 1 }));
      const rendered = await renderPage(document, 1, 1.4);
      setPreview(rendered.canvas.toDataURL("image/png"));
      setPageRatio(rendered.canvas.width / rendered.canvas.height);
      await closePdf(document);
    } catch {
      setError("That PDF could not be opened. If it is password-protected, remove the password first.");
    } finally {
      setBusy(false);
    }
  }

  /* --------------------------------------------------- re-render a page */

  async function showPage(pageNumber: number) {
    if (!bytes) return;
    setPlacement((current) => ({ ...current, pageNumber }));
    setBusy(true);
    try {
      const document = await openPdf(bytes.slice(0));
      const rendered = await renderPage(document, pageNumber, 1.4);
      setPreview(rendered.canvas.toDataURL("image/png"));
      setPageRatio(rendered.canvas.width / rendered.canvas.height);
      await closePdf(document);
    } catch {
      setError("That page could not be rendered.");
    } finally {
      setBusy(false);
    }
  }

  /* --------------------------------------------------------- drawing */

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = padRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(event.pointerId);
    drawing.current = true;

    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(
      ((event.clientX - rect.left) / rect.width) * canvas.width,
      ((event.clientY - rect.top) / rect.height) * canvas.height,
    );
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = padRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    context.lineTo(
      ((event.clientX - rect.left) / rect.width) * canvas.width,
      ((event.clientY - rect.top) / rect.height) * canvas.height,
    );
    context.strokeStyle = "#0b1020";
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    setHasInk(true);
  }

  function pointerUp() {
    drawing.current = false;
    captureInk();
  }

  /**
   * Snapshots the pad the same way signing does — trimmed of its transparent
   * margin — so what the page preview shows is what gets embedded.
   */
  function captureInk() {
    const canvas = padRef.current;
    if (!canvas) return;

    const trimmed = trimTransparent(canvas);
    if (!trimmed || trimmed.width === 0 || trimmed.height === 0) {
      setInk(null);
      return;
    }

    setInk({
      url: trimmed.toDataURL("image/png"),
      aspect: trimmed.height / trimmed.width,
    });
  }

  function clearPad() {
    const canvas = padRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    setInk(null);
  }

  /* --------------------------------------------------------- placing */

  /** The pointer's position on the page, as fractions of it. */
  function pointFraction(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  function pagePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const point = pointFraction(event);
    const insideBox =
      point.x >= box.left &&
      point.x <= box.left + box.width &&
      point.y >= box.top &&
      point.y <= box.top + box.height;

    // Grabbing the signature keeps hold of the spot picked up; pressing
    // anywhere else moves it there first, then drags from its top-left.
    dragRef.current = insideBox
      ? { dx: point.x - box.left, dy: point.y - box.top }
      : { dx: 0, dy: 0 };

    if (!insideBox) {
      setPlacement((current) => clampPlacement({ ...current, ...point }, box.height));
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const grab = dragRef.current;
    if (!grab) return;

    const point = pointFraction(event);
    setPlacement((current) =>
      clampPlacement({ ...current, x: point.x - grab.dx, y: point.y - grab.dy }, box.height),
    );
  }

  function pagePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  /* ----------------------------------------------------------- apply */

  async function apply() {
    if (!bytes) return;
    setBusy(true);
    setError(null);

    try {
      let signature: Uint8Array | undefined;

      if (source === "draw") {
        const canvas = padRef.current;
        const trimmed = canvas ? trimTransparent(canvas) : null;
        if (!trimmed) throw new Error("Draw your signature first.");
        const blob = await new Promise<Blob | null>((resolve) => trimmed.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("That signature could not be saved.");
        signature = new Uint8Array(await blob.arrayBuffer());
      }

      const result = await signPdf({
        pdf: bytes.slice(0),
        signature,
        typed: source === "type" ? { text: typed, font } : undefined,
        placement,
        stamp: addDate ? { text: stampText, size: 9 } : undefined,
      });

      setSigned(result);
    } catch (cause) {
      setSigned(null);
      setError(cause instanceof Error ? cause.message : "That PDF could not be signed.");
    } finally {
      setBusy(false);
    }
  }

  const ready = source === "draw" ? hasInk : typed.trim() !== "";

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
        <span>
          This places a picture of your signature on the page — which is what
          almost every emailed contract is signed with. It is{" "}
          <strong>not</strong> a qualified electronic signature: there is no
          certificate and no audit trail, so it proves nothing about who applied
          it. For anything requiring legal proof of identity, use a service that
          issues one.
        </span>
      </p>

      <FileDropzone
        accept="application/pdf"
        acceptLabel="A PDF — it is read by your browser and never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {bytes ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
          {/* -------------------------------------------------- preview */}
          <div className="space-y-3">
            {pageCount > 1 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Page</span>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => void showPage(number)}
                    className={cn(
                      "size-8 rounded-md border text-sm transition-colors",
                      placement.pageNumber === number
                        ? "border-border-strong text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {number}
                  </button>
                ))}
              </div>
            ) : null}

            {preview ? (
              <div
                onPointerDown={pagePointerDown}
                onPointerMove={pagePointerMove}
                onPointerUp={pagePointerUp}
                onPointerCancel={pagePointerUp}
                // Stops a drag turning into a text selection or a page scroll.
                className="surface-card relative touch-none select-none overflow-hidden"
                role="presentation"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={`Page ${placement.pageNumber}`} className="w-full" />
                {(() => {
                  return (
                    <div
                      className="absolute cursor-grab border border-dashed border-[var(--accent-pdf)] active:cursor-grabbing"
                      style={{
                        left: `${box.left * 100}%`,
                        top: `${box.top * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                      }}
                    >
                      {source === "draw" && ink ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ink.url}
                          alt=""
                          className="h-full w-full"
                          style={{ objectFit: "fill" }}
                        />
                      ) : source === "type" && typed.trim() !== "" ? (
                        /* Drawn as SVG so the text scales with the box without
                           needing to measure it. signPdf sizes the font so the
                           text spans the chosen width, and textLength does the
                           same here. */
                        <svg
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className="h-full w-full"
                          aria-hidden="true"
                        >
                          <text
                            x="0"
                            y="82"
                            fontSize="88"
                            textLength="100"
                            lengthAdjust="spacingAndGlyphs"
                            fill="#0b1020"
                          >
                            {typed}
                          </text>
                        </svg>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="surface-card grid h-96 place-items-center text-sm text-muted-foreground">
                {busy ? "Rendering…" : "No preview"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Drag the signature to position it, or press anywhere on the page
              to send it there. The box shows exactly where and how large it
              will be.
            </p>
          </div>

          {/* -------------------------------------------------- controls */}
          <div className="space-y-4">
            <Tabs value={source} onValueChange={(value) => setSource(value as Source)}>
              <TabsList className="w-full">
                <TabsTrigger value="draw" className="flex-1">Draw</TabsTrigger>
                <TabsTrigger value="type" className="flex-1">Type</TabsTrigger>
              </TabsList>
            </Tabs>

            {source === "draw" ? (
              <div className="space-y-2">
                <canvas
                  ref={padRef}
                  width={600}
                  height={200}
                  onPointerDown={pointerDown}
                  onPointerMove={pointerMove}
                  onPointerUp={pointerUp}
                  onPointerLeave={pointerUp}
                  className="w-full touch-none rounded-md border border-border bg-background"
                  aria-label="Draw your signature"
                />
                <Button variant="ghost" size="sm" onClick={clearPad} disabled={!hasInk}>
                  <Eraser strokeWidth={1.75} />
                  Clear
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="typed">Your name</Label>
                  <Input
                    id="typed"
                    value={typed}
                    onChange={(event) => setTyped(event.target.value)}
                    placeholder="A. Lovelace"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="font">Style</Label>
                  <Select value={font} onValueChange={(value) => setFont(value as SignatureFont)}>
                    <SelectTrigger id="font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIGNATURE_FONTS.map((entry) => (
                        <SelectItem key={entry.id} value={entry.id}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="size">Width — {Math.round(placement.width * 100)}% of the page</Label>
              <Slider
                id="size"
                min={5}
                max={80}
                step={1}
                value={[placement.width * 100]}
                onValueChange={([value]) =>
                  setPlacement((current) => clampPlacement({ ...current, width: value / 100 }))
                }
              />
            </div>

            <label className="flex items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={addDate}
                onChange={(event) => setAddDate(event.target.checked)}
                className="size-4 cursor-pointer accent-[var(--accent-pdf)]"
              />
              Add a dated caption
            </label>

            {addDate ? (
              <Input
                value={stampText}
                onChange={(event) => setStampText(event.target.value)}
                className="text-sm"
                aria-label="Caption text"
              />
            ) : null}

            <Button onClick={() => void apply()} disabled={busy || !ready} className="w-full">
              <PenLine strokeWidth={1.75} />
              {busy ? "Working…" : "Sign the PDF"}
            </Button>

            {signed ? (
              <DownloadButton
                blob={() => new Blob([signed.slice().buffer as ArrayBuffer], { type: "application/pdf" })}
                fileName={`${baseName(files[0]?.name ?? "document")}-signed.pdf`}
                label="Download signed PDF"
                className="w-full"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Your document is read and modified entirely in your browser. Nothing is
          uploaded — which matters more here than almost anywhere else on this
          site, since the PDFs people sign are contracts, tenancy agreements and
          employment paperwork.
        </span>
      </p>
    </div>
  );
}
