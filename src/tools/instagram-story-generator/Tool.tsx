"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STORY_EXPORT_SCALE,
  canvasToPng,
  gradients,
  loadImage,
  renderStory,
} from "./logic";

export default function InstagramStoryGeneratorTool() {
  const [username, setUsername] = React.useState("ada.builds");
  const [text, setText] = React.useState("Shipping all week");
  const [timeAgo, setTimeAgo] = React.useState("3h");
  const [gradientId, setGradientId] = React.useState("sunset");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([]);
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [photo, setPhoto] = React.useState<ImageBitmap | null>(null);
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);

  const previewRef = React.useRef<HTMLCanvasElement>(null);
  const exportRef = React.useRef<HTMLCanvasElement>(null);

  useDecoded(photoFiles[0], setPhoto);
  useDecoded(avatarFiles[0], setAvatar);

  const gradient = gradients.find((entry) => entry.id === gradientId) ?? gradients[0];

  React.useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    renderStory(preview, {
      username,
      text,
      timeAgo,
      avatar,
      photo,
      gradient: gradient.stops,
      textColor,
      scale: 1,
    });
  }, [username, text, timeAgo, avatar, photo, gradient, textColor]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-center bg-surface-hover p-6">
          <canvas
            ref={previewRef}
            role="img"
            aria-label="Instagram story mockup"
            className="h-auto max-h-[36rem] rounded-2xl shadow-overlay"
          />
          <canvas ref={exportRef} className="hidden" aria-hidden="true" />
        </div>

        <section className="surface-card space-y-5 p-5">
          <div className="space-y-2">
            <Label>Background photo</Label>
            <FileDropzone
              accept="image/*"
              acceptLabel="an image"
              maxSizeMb={20}
              files={photoFiles}
              onFilesChange={(next) => {
                setPhotoFiles(next);
                if (next.length === 0) setPhoto(null);
              }}
            />
            <FieldHint>Optional — a gradient is used when there is no photo.</FieldHint>
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-gradient">Gradient</Label>
            <Select value={gradientId} onValueChange={setGradientId} disabled={!!photo}>
              <SelectTrigger id="story-gradient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradients.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-text">Caption</Label>
            <Input id="story-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-color">Caption colour</Label>
            <div className="flex items-center gap-2">
              <input
                id="story-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-1"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="font-mono"
                aria-label="Caption colour hex"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="story-username">Username</Label>
              <Input
                id="story-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-time">Posted</Label>
              <Input id="story-time" value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} />
            </div>
          </div>

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

      <DownloadButton
        blob={async () => {
          const canvas = exportRef.current;
          if (!canvas) throw new Error("Nothing to export.");
          // Re-rendered at export scale so the PNG is a true 1080×1920.
          renderStory(canvas, {
            username,
            text,
            timeAgo,
            avatar,
            photo,
            gradient: gradient.stops,
            textColor,
            scale: STORY_EXPORT_SCALE,
          });
          return canvasToPng(canvas);
        }}
        fileName="instagram-story.png"
        label="Download 1080×1920 PNG"
      />

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The preview is scaled down for the screen; the download is re-rendered at the full
          1080×1920 so text stays crisp rather than being upscaled.
        </span>
      </p>
    </div>
  );
}

function useDecoded(file: File | undefined, onImage: (image: ImageBitmap | null) => void) {
  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;
    loadImage(file)
      .then((bitmap) => {
        if (!cancelled) onImage(bitmap);
      })
      .catch(() => {
        if (!cancelled) onImage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [file, onImage]);
}
