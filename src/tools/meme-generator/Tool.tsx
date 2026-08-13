"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONTS, render } from "./logic";

export default function MemeGeneratorTool() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  const [files, setFiles] = React.useState<File[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [topText, setTopText] = React.useState("One does not simply");
  const [bottomText, setBottomText] = React.useState("Walk into Mordor");
  const [fontSize, setFontSize] = React.useState(10);
  const [strokeWidth, setStrokeWidth] = React.useState(12);
  const [color, setColor] = React.useState("#ffffff");
  const [strokeColor, setStrokeColor] = React.useState("#000000");
  const [uppercase, setUppercase] = React.useState(true);
  const [fontFamily, setFontFamily] = React.useState("impact");

  const options = React.useMemo(
    () => ({ topText, bottomText, fontSize, strokeWidth, color, strokeColor, uppercase, fontFamily }),
    [topText, bottomText, fontSize, strokeWidth, color, strokeColor, uppercase, fontFamily],
  );

  // Redraw whenever anything changes. The canvas is the output, so this is the
  // one place a DOM write belongs in an effect.
  React.useEffect(() => {
    if (!loaded || !canvasRef.current || !imageRef.current) return;
    render(canvasRef.current, imageRef.current, options);
  }, [loaded, options]);

  async function load(next: File[]) {
    setFiles(next);
    const file = next[0];
    if (!file) {
      setLoaded(false);
      return;
    }

    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Could not read that image."));
        element.src = url;
      });
      imageRef.current = image;
      setLoaded(true);
    } catch {
      setLoaded(false);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function toBlob(): Promise<Blob> {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Nothing to download yet.");

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image."))),
        "image/png",
      );
    });
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="PNG, JPG, WebP or GIF"
        multiple={false}
        files={files}
        onFilesChange={load}
      />

      {loaded ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meme-top">Top text</Label>
              <Textarea
                id="meme-top"
                value={topText}
                onChange={(event) => setTopText(event.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meme-bottom">Bottom text</Label>
              <Textarea
                id="meme-bottom"
                value={bottomText}
                onChange={(event) => setBottomText(event.target.value)}
                rows={2}
              />
              <FieldHint>Long lines wrap automatically to fit the image.</FieldHint>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meme-font">Font</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="meme-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldHint>
                Impact needs to be installed on your device — it is on Windows
                and macOS, and the next font in the stack is used otherwise.
              </FieldHint>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meme-size">Text size — {fontSize}% of height</Label>
              <Slider
                id="meme-size"
                min={3}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meme-stroke">Outline — {strokeWidth}%</Label>
              <Slider
                id="meme-stroke"
                min={0}
                max={30}
                step={1}
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meme-color">Text colour</Label>
                <Input
                  id="meme-color"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-full p-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meme-stroke-color">Outline colour</Label>
                <Input
                  id="meme-stroke-color"
                  type="color"
                  value={strokeColor}
                  onChange={(event) => setStrokeColor(event.target.value)}
                  className="h-10 w-full p-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="meme-upper" checked={uppercase} onCheckedChange={setUppercase} />
              <Label htmlFor="meme-upper">Force uppercase</Label>
            </div>

            <DownloadButton
              blob={toBlob}
              fileName={`meme-${files[0]?.name.replace(/\.[^.]+$/, "") ?? "image"}.png`}
              label="Download meme"
            />
          </div>

          <div className="surface-card grid place-items-center p-4">
            <canvas
              ref={canvasRef}
              className="max-h-[36rem] w-full max-w-full object-contain"
              aria-label="Meme preview"
            />
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The image is drawn to a canvas in your own browser and never uploaded —
          there is no server involved and nothing to delete afterwards. Text
          wraps by measuring against the real font rather than counting
          characters, which is the only way that works: &ldquo;WWWWW&rdquo; and
          &ldquo;iiiii&rdquo; are the same length and nothing like the same
          width. Size is set as a percentage of image height, so a caption looks
          the same on a thumbnail and on a 4000-pixel photo.
        </span>
      </p>
    </div>
  );
}
