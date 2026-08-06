"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aspects, canvasToPng, loadImage, palettes, renderInstagramPost } from "./logic";

export default function InstagramPostGeneratorTool() {
  const [username, setUsername] = React.useState("ada.builds");
  const [location, setLocation] = React.useState("London, United Kingdom");
  const [caption, setCaption] = React.useState("shipped something small today. it works.");
  const [likes, setLikes] = React.useState(1284);
  const [comments, setComments] = React.useState(42);
  const [timeAgo, setTimeAgo] = React.useState("2 HOURS AGO");
  const [verified, setVerified] = React.useState(false);
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [aspectId, setAspectId] = React.useState("square");
  const [scale, setScale] = React.useState("2");

  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([]);
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);
  const [photo, setPhoto] = React.useState<ImageBitmap | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useDecoded(avatarFiles[0], setAvatar);
  useDecoded(photoFiles[0], setPhoto);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderInstagramPost(canvas, {
      username,
      location,
      caption,
      likes,
      comments,
      timeAgo,
      verified,
      avatar,
      photo,
      palette: palettes[mode],
      width: 400,
      scale: Number(scale),
      aspect: aspects.find((entry) => entry.id === aspectId)?.value ?? 1,
    });
  }, [username, location, caption, likes, comments, timeAgo, verified, avatar, photo, mode, scale, aspectId]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-start justify-center overflow-x-auto bg-surface-hover p-6">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Instagram post mockup"
            className="h-auto max-w-full rounded-lg shadow-overlay"
            style={{ width: 400 }}
          />
        </div>

        <section className="surface-card space-y-5 p-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "light" | "dark")}>
            <TabsList className="w-full">
              <TabsTrigger value="light" className="flex-1">Light</TabsTrigger>
              <TabsTrigger value="dark" className="flex-1">Dark</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label>Photo</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig-aspect">Aspect ratio</Label>
            <Select value={aspectId} onValueChange={setAspectId}>
              <SelectTrigger id="ig-aspect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspects.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig-username">Username</Label>
            <Input id="ig-username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig-location">Location</Label>
            <Input id="ig-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig-caption">Caption</Label>
            <Input id="ig-caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ig-likes">Likes</Label>
              <Input
                id="ig-likes"
                type="number"
                min={0}
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig-comments">Comments</Label>
              <Input
                id="ig-comments"
                type="number"
                min={0}
                value={comments}
                onChange={(e) => setComments(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig-time">Posted</Label>
            <Input id="ig-time" value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} />
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

          <div className="flex items-center gap-3">
            <Switch id="ig-verified" checked={verified} onCheckedChange={setVerified} />
            <Label htmlFor="ig-verified">Verified badge</Label>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="ig-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="ig-scale" className="w-28">
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
          fileName="instagram-post.png"
          label="Download PNG"
        />
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A mockup, not a real post. Everything is drawn in your browser and nothing is uploaded —
          including the photo you choose.
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
