"use client";

import * as React from "react";
import { Info, Link2, Link2Off } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  defaultShadow,
  elevationToIos,
  generateStyle,
  iosToElevation,
  presets,
  toCssShadow,
  type ShadowInput,
  type Target,
} from "./logic";

export default function ReactNativeShadowTool() {
  const [shadow, setShadow] = React.useState<ShadowInput>(defaultShadow);
  const [target, setTarget] = React.useState<Target>("legacy");
  const [linked, setLinked] = React.useState(true);

  /** Editing an iOS value updates elevation too, when the two are linked. */
  function updateIos<K extends keyof ShadowInput>(key: K, value: ShadowInput[K]) {
    setShadow((current) => {
      const next = { ...current, [key]: value };
      if (linked && (key === "offsetY" || key === "radius")) {
        next.elevation = iosToElevation(next.offsetY, next.radius);
      }
      return next;
    });
  }

  function updateElevation(value: number) {
    setShadow((current) =>
      linked ? { ...current, elevation: value, ...elevationToIos(value) } : { ...current, elevation: value },
    );
  }

  const sliders = [
    { key: "offsetX" as const, label: "Offset X", min: -40, max: 40, step: 1, suffix: "" },
    { key: "offsetY" as const, label: "Offset Y", min: -40, max: 40, step: 1, suffix: "" },
    { key: "radius" as const, label: "Radius (blur)", min: 0, max: 60, step: 1, suffix: "" },
    { key: "opacity" as const, label: "Opacity", min: 0, max: 1, step: 0.01, suffix: "" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => setShadow(preset.shadow)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="surface-card grid min-h-64 place-items-center bg-surface-hover p-10">
          <div
            className="grid h-32 w-full max-w-xs place-items-center rounded-xl bg-background text-sm text-muted-foreground"
            style={{ boxShadow: toCssShadow(shadow) }}
          >
            Preview
          </div>
        </div>

        <section className="surface-card space-y-5 p-5">
          {sliders.map((slider) => (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`rn-${slider.key}`}>{slider.label}</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {shadow[slider.key]}
                </span>
              </div>
              <Slider
                id={`rn-${slider.key}`}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={[shadow[slider.key]]}
                onValueChange={([value]) => updateIos(slider.key, value)}
                aria-label={slider.label}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="rn-color">Colour</Label>
            <div className="flex items-center gap-2">
              <input
                id="rn-color"
                type="color"
                value={shadow.color}
                onChange={(event) =>
                  setShadow((current) => ({ ...current, color: event.target.value }))
                }
                className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-1"
              />
              <Input
                value={shadow.color}
                onChange={(event) =>
                  setShadow((current) => ({ ...current, color: event.target.value }))
                }
                className="font-mono"
                aria-label="Shadow colour hex"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="rn-elevation">Android elevation</Label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {shadow.elevation}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setLinked((value) => !value)}
                  aria-pressed={linked}
                  aria-label={linked ? "Unlink from iOS values" : "Link to iOS values"}
                >
                  {linked ? <Link2 strokeWidth={1.75} /> : <Link2Off strokeWidth={1.75} />}
                </Button>
              </div>
            </div>
            <Slider
              id="rn-elevation"
              min={0}
              max={24}
              step={1}
              value={[shadow.elevation]}
              onValueChange={([value]) => updateElevation(value)}
              aria-label="Android elevation"
            />
            <FieldHint>
              {linked
                ? "Linked — changing either side updates the other using an approximate mapping."
                : "Unlinked — set each platform independently."}
            </FieldHint>
          </div>
        </section>
      </div>

      <Tabs value={target} onValueChange={(value) => setTarget(value as Target)}>
        <TabsList>
          <TabsTrigger value="legacy">Cross-platform</TabsTrigger>
          <TabsTrigger value="modern">boxShadow (RN 0.76+)</TabsTrigger>
          <TabsTrigger value="web">Web / CSS</TabsTrigger>
        </TabsList>
      </Tabs>

      <CodeOutput
        value={generateStyle(shadow, target)}
        label="Style"
        fileName="shadow.ts"
        mimeType="text/typescript"
      />

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">
            There is no exact mapping between the two platforms.
          </strong>{" "}
          iOS gives you offset, radius, opacity and colour independently; Android has a single{" "}
          <code className="font-mono">elevation</code> whose shadow is derived by the system — and
          which also changes the view&rsquo;s z-order. The link above approximates the Material
          elevation curve, so treat it as a sensible start and check it on a real device. React
          Native 0.76 added <code className="font-mono">boxShadow</code>, which behaves the same on
          both and is worth preferring on new code.
        </span>
      </p>
    </div>
  );
}
