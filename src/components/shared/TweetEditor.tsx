"use client";

import * as React from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadImage } from "@/lib/mockup";
import { cn } from "@/lib/utils";

export interface TweetState {
  name: string;
  handle: string;
  text: string;
  time: string;
  verified: boolean;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  mode: "light" | "dark";
  showMetrics: boolean;
}

export const defaultTweet: TweetState = {
  name: "Ada Lovelace",
  handle: "ada",
  text: "shipped the whole thing in one sitting and the tests actually passed first try. today is a good day.",
  time: "2h",
  verified: true,
  replies: 128,
  reposts: 934,
  likes: 8200,
  views: 142000,
  mode: "light",
  showMetrics: true,
};

/**
 * The post-composition form, shared by the tweet generator, the tweet-to-image
 * tool and the ad-revenue mockup — all three describe the same author and post.
 */
export function TweetEditor({
  state,
  onChange,
  onAvatar,
  onAttachment,
  showAttachment = true,
  showMetrics = true,
}: {
  state: TweetState;
  onChange: (patch: Partial<TweetState>) => void;
  onAvatar: (image: ImageBitmap | null) => void;
  onAttachment?: (image: ImageBitmap | null) => void;
  showAttachment?: boolean;
  showMetrics?: boolean;
}) {
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [attachmentFiles, setAttachmentFiles] = React.useState<File[]>([]);

  useDecodedImage(avatarFiles[0], onAvatar);
  useDecodedImage(attachmentFiles[0], onAttachment);

  const counts: [keyof TweetState, string][] = [
    ["replies", "Replies"],
    ["reposts", "Reposts"],
    ["likes", "Likes"],
    ["views", "Views"],
  ];

  return (
    <section className="surface-card space-y-5 p-5">
      <Tabs
        value={state.mode}
        onValueChange={(value) => onChange({ mode: value as "light" | "dark" })}
      >
        <TabsList className="w-full">
          <TabsTrigger value="light" className="flex-1">
            Light
          </TabsTrigger>
          <TabsTrigger value="dark" className="flex-1">
            Dark
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tw-name">Display name</Label>
          <Input
            id="tw-name"
            value={state.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tw-handle">Handle</Label>
          <Input
            id="tw-handle"
            value={state.handle}
            onChange={(event) => onChange({ handle: event.target.value })}
            className="font-mono"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tw-text">Post text</Label>
        <textarea
          id="tw-text"
          value={state.text}
          onChange={(event) => onChange({ text: event.target.value })}
          rows={4}
          className={cn(
            "flex w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm",
            "text-foreground placeholder:text-subtle-foreground",
            "focus-visible:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--ring)]",
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tw-time">Timestamp</Label>
          <Input
            id="tw-time"
            value={state.time}
            onChange={(event) => onChange({ time: event.target.value })}
            className="w-28"
          />
        </div>
        <div className="flex items-center gap-3 sm:pt-7">
          <Switch
            id="tw-verified"
            checked={state.verified}
            onCheckedChange={(value) => onChange({ verified: value })}
          />
          <Label htmlFor="tw-verified">Verified badge</Label>
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
            if (next.length === 0) onAvatar(null);
          }}
        />
        <FieldHint>Optional — initials on a generated colour are used otherwise.</FieldHint>
      </div>

      {showAttachment && onAttachment ? (
        <div className="space-y-2">
          <Label>Attached image</Label>
          <FileDropzone
            accept="image/*"
            acceptLabel="an image"
            maxSizeMb={10}
            files={attachmentFiles}
            onFilesChange={(next) => {
              setAttachmentFiles(next);
              if (next.length === 0) onAttachment(null);
            }}
          />
        </div>
      ) : null}

      {showMetrics ? (
        <>
          <div className="flex items-center gap-3">
            <Switch
              id="tw-metrics"
              checked={state.showMetrics}
              onCheckedChange={(value) => onChange({ showMetrics: value })}
            />
            <Label htmlFor="tw-metrics">Show engagement counts</Label>
          </div>

          {state.showMetrics ? (
            <div className="grid grid-cols-2 gap-3">
              {counts.map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`tw-${key}`}>{label}</Label>
                  <Input
                    id={`tw-${key}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={state[key] as number}
                    onChange={(event) => onChange({ [key]: Number(event.target.value) || 0 })}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

/** Decodes a selected file and hands the bitmap up, tolerating rapid changes. */
function useDecodedImage(
  file: File | undefined,
  onImage: ((image: ImageBitmap | null) => void) | undefined,
) {
  React.useEffect(() => {
    if (!file || !onImage) return;

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
