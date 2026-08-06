"use client";

import * as React from "react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { TweetEditor, defaultTweet, type TweetState } from "@/components/shared/TweetEditor";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { canvasToPng, palettes, renderTweet } from "./logic";
import { backdrops, compose, type Ratio } from "./logic";

export default function TweetToImageTool() {
  const [state, setState] = React.useState<TweetState>({ ...defaultTweet, showMetrics: false });
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);
  const [backdropId, setBackdropId] = React.useState("indigo");
  const [padding, setPadding] = React.useState(72);
  const [ratio, setRatio] = React.useState<Ratio>("square");
  const [scale, setScale] = React.useState("2");

  const cardRef = React.useRef<HTMLCanvasElement>(null);
  const outputRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const card = cardRef.current;
    const output = outputRef.current;
    if (!card || !output) return;

    const factor = Number(scale);
    renderTweet(card, {
      ...state,
      avatar,
      attachment: null,
      palette: palettes.light,
      width: 520,
      scale: factor,
      showMetrics: state.showMetrics,
    });

    const backdrop = backdrops.find((entry) => entry.id === backdropId) ?? backdrops[0];
    compose(output, card, backdrop.stops, padding, ratio, factor);
  }, [state, avatar, backdropId, padding, ratio, scale]);

  const update = (patch: Partial<TweetState>) =>
    setState((current) => ({ ...current, ...patch }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-center overflow-x-auto p-6">
          {/* The card is rendered off-screen, then composited onto the backdrop. */}
          <canvas ref={cardRef} className="hidden" aria-hidden="true" />
          <canvas
            ref={outputRef}
            role="img"
            aria-label="Post image on a gradient backdrop"
            className="h-auto max-h-[32rem] max-w-full rounded-lg"
          />
        </div>

        <div className="space-y-5">
          <section className="surface-card space-y-5 p-5">
            <div className="space-y-2">
              <Label htmlFor="tti-backdrop">Backdrop</Label>
              <Select value={backdropId} onValueChange={setBackdropId}>
                <SelectTrigger id="tti-backdrop">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backdrops.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tti-ratio">Aspect ratio</Label>
              <Select value={ratio} onValueChange={(value) => setRatio(value as Ratio)}>
                <SelectTrigger id="tti-ratio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">1:1 — Instagram</SelectItem>
                  <SelectItem value="landscape">16:9 — slides, LinkedIn</SelectItem>
                  <SelectItem value="auto">Fit the card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tti-padding">Padding</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {padding}
                </span>
              </div>
              <Slider
                id="tti-padding"
                min={16}
                max={160}
                step={4}
                value={[padding]}
                onValueChange={([value]) => setPadding(value)}
                aria-label="Backdrop padding"
              />
              <FieldHint>
                The card keeps its own height; the frame grows around it to hit the chosen ratio.
              </FieldHint>
            </div>
          </section>

          <TweetEditor
            state={state}
            onChange={update}
            onAvatar={setAvatar}
            showAttachment={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="tti-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="tti-scale" className="w-28">
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
            const canvas = outputRef.current;
            if (!canvas) throw new Error("Nothing to export.");
            return canvasToPng(canvas);
          }}
          fileName="post-image.png"
          label="Download PNG"
        />
      </div>
    </div>
  );
}
