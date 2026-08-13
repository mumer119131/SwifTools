"use client";

import * as React from "react";
import { Eraser, Info, Pencil, Redo2, Trash2, Undo2 } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  erase: boolean;
}

const PALETTE = [
  "#111113", "#e05a4a", "#e0913f", "#d9b93c", "#4a9e6b",
  "#3f8fc4", "#5f6fd0", "#8a5fc4", "#c45f9e", "#8a8f98",
];

export default function WhiteboardTool() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawingRef = React.useRef(false);

  const [strokes, setStrokes] = React.useState<Stroke[]>([]);
  const [undone, setUndone] = React.useState<Stroke[]>([]);
  const [current, setCurrent] = React.useState<Stroke | null>(null);
  const [color, setColor] = React.useState("#111113");
  const [width, setWidth] = React.useState(4);
  const [erasing, setErasing] = React.useState(false);

  /*
   * Everything is redrawn from the stroke list on every change rather than
   * painted incrementally. That is what makes undo trivial — there is no
   * pixel state to reverse, only a list to shorten.
   */
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineCap = "round";
    context.lineJoin = "round";

    for (const stroke of [...strokes, ...(current ? [current] : [])]) {
      if (stroke.points.length === 0) continue;

      context.beginPath();
      context.strokeStyle = stroke.erase ? "#ffffff" : stroke.color;
      context.lineWidth = stroke.erase ? stroke.width * 3 : stroke.width;

      context.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (const point of stroke.points.slice(1)) context.lineTo(point.x, point.y);

      // A single tap is a dot, which a line with one point would not draw.
      if (stroke.points.length === 1) {
        context.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y);
      }

      context.stroke();
    }
  }, [strokes, current]);

  function positionOf(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // The canvas is scaled by CSS, so client coordinates need converting.
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-center gap-4 p-4">
        <div className="flex gap-1">
          <Button
            variant={erasing ? "ghost" : "default"}
            size="sm"
            onClick={() => setErasing(false)}
            aria-pressed={!erasing}
          >
            <Pencil className="size-4" strokeWidth={1.75} />
            Pen
          </Button>
          <Button
            variant={erasing ? "default" : "ghost"}
            size="sm"
            onClick={() => setErasing(true)}
            aria-pressed={erasing}
          >
            <Eraser className="size-4" strokeWidth={1.75} />
            Eraser
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PALETTE.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => {
                setColor(entry);
                setErasing(false);
              }}
              aria-label={`Use ${entry}`}
              className={cn(
                "size-7 cursor-pointer rounded-full border-2 transition-transform duration-[180ms] ease-out-expo hover:scale-110",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                color === entry && !erasing ? "border-foreground" : "border-border",
              )}
              style={{ backgroundColor: entry }}
            />
          ))}
          <Input
            type="color"
            value={color}
            onChange={(event) => {
              setColor(event.target.value);
              setErasing(false);
            }}
            aria-label="Custom colour"
            className="size-7 rounded-full p-0.5"
          />
        </div>

        <div className="flex min-w-40 items-center gap-3">
          <Label htmlFor="wb-width" className="shrink-0 text-xs">
            Size {width}
          </Label>
          <Slider
            id="wb-width"
            min={1}
            max={40}
            step={1}
            value={[width]}
            onValueChange={([value]) => setWidth(value)}
          />
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Undo"
            disabled={strokes.length === 0}
            onClick={() => {
              setUndone((entries) => [strokes[strokes.length - 1], ...entries]);
              setStrokes((entries) => entries.slice(0, -1));
            }}
          >
            <Undo2 className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Redo"
            disabled={undone.length === 0}
            onClick={() => {
              setStrokes((entries) => [...entries, undone[0]]);
              setUndone((entries) => entries.slice(1));
            }}
          >
            <Redo2 className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear the board"
            disabled={strokes.length === 0}
            onClick={() => {
              setStrokes([]);
              setUndone([]);
            }}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </Button>
        </div>

        <DownloadButton
          blob={() =>
            new Promise<Blob>((resolve, reject) => {
              canvasRef.current?.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the drawing."))),
                "image/png",
              );
            })
          }
          fileName="whiteboard.png"
          label="Download PNG"
          size="sm"
        />
      </div>

      <canvas
        ref={canvasRef}
        width={1600}
        height={1000}
        className="w-full cursor-crosshair touch-none rounded-lg border border-border bg-white shadow-card"
        aria-label="Drawing canvas"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          drawingRef.current = true;
          setUndone([]);
          setCurrent({ points: [positionOf(event)], color, width, erase: erasing });
        }}
        onPointerMove={(event) => {
          if (!drawingRef.current) return;
          const point = positionOf(event);
          setCurrent((stroke) =>
            stroke ? { ...stroke, points: [...stroke.points, point] } : stroke,
          );
        }}
        onPointerUp={() => {
          drawingRef.current = false;
          setCurrent((stroke) => {
            if (stroke) setStrokes((entries) => [...entries, stroke]);
            return null;
          });
        }}
        onPointerLeave={() => {
          if (!drawingRef.current) return;
          drawingRef.current = false;
          setCurrent((stroke) => {
            if (stroke) setStrokes((entries) => [...entries, stroke]);
            return null;
          });
        }}
      />

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The board is redrawn from a list of strokes rather than painted
          permanently, which is what makes undo and redo work at all — there are
          no pixels to reverse, only a list to shorten. Pointer events are used
          throughout, so a stylus, a finger and a mouse all behave the same.
          Nothing is saved: a reload clears the board, so download anything you
          want to keep.
        </span>
      </p>
    </div>
  );
}
