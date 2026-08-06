"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { canvasToPng, loadImage } from "@/lib/mockup";
import { currencies } from "@/tools/loan-calculator/logic";
import { palettes, renderPayout } from "./logic";

export default function AdRevenueMockupTool() {
  const [name, setName] = React.useState("Ada Lovelace");
  const [handle, setHandle] = React.useState("ada");
  const [amount, setAmount] = React.useState(2481.36);
  const [currency, setCurrency] = React.useState("USD");
  const [period, setPeriod] = React.useState("1–31 July");
  const [impressions, setImpressions] = React.useState(4_820_000);
  const [engagements, setEngagements] = React.useState(196_400);
  const [followers, setFollowers] = React.useState(84_200);
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const [scale, setScale] = React.useState("2");
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const file = avatarFiles[0];
    if (!file) return;
    let cancelled = false;
    loadImage(file)
      .then((bitmap) => {
        if (!cancelled) setAvatar(bitmap);
      })
      .catch(() => {
        if (!cancelled) setAvatar(null);
      });
    return () => {
      cancelled = true;
    };
  }, [avatarFiles]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPayout(canvas, {
      name,
      handle,
      amount,
      currency,
      period,
      impressions,
      engagements,
      followers,
      avatar,
      palette: palettes[mode],
      width: 520,
      scale: Number(scale),
    });
  }, [name, handle, amount, currency, period, impressions, engagements, followers, avatar, mode, scale]);

  const numbers: [string, number, (value: number) => void][] = [
    ["Impressions", impressions, setImpressions],
    ["Engagements", engagements, setEngagements],
    ["Followers", followers, setFollowers],
  ];

  return (
    <div className="space-y-5">
      <p
        className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        role="note"
      >
        <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong>This produces a mockup, not a statement.</strong> It is for design concepts,
          decks and satire. Using a fabricated earnings screenshot to solicit money, sell a course,
          or induce someone into a deal is fraud in most jurisdictions — the fact that it came from
          a design tool is not a defence.
        </span>
      </p>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-center overflow-x-auto bg-surface-hover p-6">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Creator payout mockup"
            className="h-auto max-w-full rounded-xl shadow-overlay"
            style={{ width: 520 }}
          />
        </div>

        <section className="surface-card space-y-5 p-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "light" | "dark")}>
            <TabsList className="w-full">
              <TabsTrigger value="light" className="flex-1">Light</TabsTrigger>
              <TabsTrigger value="dark" className="flex-1">Dark</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ar-name">Name</Label>
              <Input id="ar-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ar-handle">Handle</Label>
              <Input
                id="ar-handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ar-amount">Payout</Label>
              <Input
                id="ar-amount"
                type="number"
                step="0.01"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ar-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="ar-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ar-period">Period</Label>
            <Input id="ar-period" value={period} onChange={(e) => setPeriod(e.target.value)} />
          </div>

          {numbers.map(([label, value, setter]) => (
            <div key={label} className="space-y-2">
              <Label htmlFor={`ar-${label}`}>{label}</Label>
              <Input
                id={`ar-${label}`}
                type="number"
                min={0}
                value={value}
                onChange={(e) => setter(Number(e.target.value) || 0)}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label>Avatar</Label>
            <FileDropzone
              accept="image/*"
              acceptLabel="an image"
              maxSizeMb={10}
              files={avatarFiles}
              onFilesChange={(next) => {
                setAvatarFiles(next);
                if (next.length === 0) setAvatar(null);
              }}
            />
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="ar-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="ar-scale" className="w-28">
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
          fileName="payout-mockup.png"
          label="Download PNG"
        />
      </div>
    </div>
  );
}
