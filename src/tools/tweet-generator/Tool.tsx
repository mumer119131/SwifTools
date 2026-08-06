"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { TweetEditor, defaultTweet, type TweetState } from "@/components/shared/TweetEditor";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { canvasToPng } from "@/lib/mockup";
import { palettes, renderTweet } from "./logic";

export default function TweetGeneratorTool() {
  const [state, setState] = React.useState<TweetState>(defaultTweet);
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);
  const [attachment, setAttachment] = React.useState<ImageBitmap | null>(null);
  const [scale, setScale] = React.useState("2");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderTweet(canvas, {
      ...state,
      avatar,
      attachment,
      palette: palettes[state.mode],
      width: 520,
      scale: Number(scale),
    });
  }, [state, avatar, attachment, scale]);

  const update = (patch: Partial<TweetState>) =>
    setState((current) => ({ ...current, ...patch }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-center overflow-x-auto bg-surface-hover p-6">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Post mockup"
            className="h-auto max-w-full rounded-xl shadow-overlay"
            style={{ width: 520 }}
          />
        </div>

        <TweetEditor
          state={state}
          onChange={update}
          onAvatar={setAvatar}
          onAttachment={setAttachment}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="tweet-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="tweet-scale" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1×</SelectItem>
              <SelectItem value="2">2×</SelectItem>
              <SelectItem value="3">3×</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadButton
          blob={async () => {
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Nothing to export.");
            return canvasToPng(canvas);
          }}
          fileName="post-mockup.png"
          label="Download PNG"
        />
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          This is a <strong className="text-foreground">mockup</strong> — an image of a post that
          was never published. Useful for design comps, decks and jokes. Attributing an invented
          quote to a real person is defamation in most jurisdictions, whatever the tool used.
        </span>
      </p>
    </div>
  );
}
