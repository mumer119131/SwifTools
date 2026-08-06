"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Info, Plus, X } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blankMessage, renderChat, themes, type Message, type Side } from "@/lib/chat-mockup";
import { canvasToPng, loadImage } from "@/lib/mockup";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-client-value";

interface ChatMockupShellProps {
  themeId: "whatsapp" | "imessage" | "instagram";
  defaultContact: string;
  defaultStatus: string;
  seed: { side: Side; text: string; time: string }[];
}

/**
 * Shared editor for the WhatsApp and iMessage mockup generators.
 *
 * The two apps differ in bubble shape, colour, where the timestamp sits and how
 * delivery is reported — all of which live in the theme — so one editor drives
 * both.
 */
export function ChatMockupShell({
  themeId,
  defaultContact,
  defaultStatus,
  seed,
}: ChatMockupShellProps) {
  const hydrated = useHydrated();

  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [contactName, setContactName] = React.useState(defaultContact);
  const [contactStatus, setContactStatus] = React.useState(defaultStatus);
  const [statusBarTime, setStatusBarTime] = React.useState("9:41");
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showInputBar, setShowInputBar] = React.useState(true);
  const [scale, setScale] = React.useState("2");
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [avatar, setAvatar] = React.useState<ImageBitmap | null>(null);

  // Message ids use Math.random, so the seed is built on the client.
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [seeded, setSeeded] = React.useState(false);

  if (hydrated && !seeded) {
    setSeeded(true);
    setMessages(
      seed.map((entry) => ({ ...blankMessage(entry.side, entry.time), text: entry.text })),
    );
  }

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const theme = themes[themeId][mode];

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
    if (!canvas || messages.length === 0) return;

    renderChat(canvas, {
      theme,
      contactName,
      contactStatus,
      statusBarTime,
      messages,
      avatar,
      showStatusBar,
      showInputBar,
      width: 420,
      scale: Number(scale),
    });
  }, [theme, contactName, contactStatus, statusBarTime, messages, avatar, showStatusBar, showInputBar, scale]);

  function updateMessage(id: string, patch: Partial<Message>) {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= messages.length) return;
    const next = [...messages];
    [next[index], next[target]] = [next[target], next[index]];
    setMessages(next);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="surface-card grid place-items-start justify-center overflow-x-auto bg-surface-hover p-6">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`${theme.label} conversation mockup`}
            className="h-auto max-w-full rounded-xl shadow-overlay"
            style={{ width: 420 }}
          />
        </div>

        <section className="surface-card space-y-5 p-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "light" | "dark")}>
            <TabsList className="w-full">
              <TabsTrigger value="light" className="flex-1">
                Light
              </TabsTrigger>
              <TabsTrigger value="dark" className="flex-1">
                Dark
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="chat-name">Contact name</Label>
            <Input
              id="chat-name"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-status">Status line</Label>
            <Input
              id="chat-status"
              value={contactStatus}
              onChange={(event) => setContactStatus(event.target.value)}
              placeholder={themeId === "whatsapp" ? "online" : "Active now"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-time">Status bar time</Label>
            <Input
              id="chat-time"
              value={statusBarTime}
              onChange={(event) => setStatusBarTime(event.target.value)}
              className="w-28 font-mono"
            />
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
            <FieldHint>Optional — initials on a generated colour are used otherwise.</FieldHint>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="chat-statusbar" checked={showStatusBar} onCheckedChange={setShowStatusBar} />
            <Label htmlFor="chat-statusbar">Show status bar</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="chat-inputbar" checked={showInputBar} onCheckedChange={setShowInputBar} />
            <Label htmlFor="chat-inputbar">Show input bar</Label>
          </div>
        </section>
      </div>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Messages
        </h2>

        <ul className="divide-y divide-border">
          {messages.map((message, index) => (
            <li key={message.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Tabs
                  value={message.side}
                  onValueChange={(value) => updateMessage(message.id, { side: value as Side })}
                >
                  <TabsList>
                    <TabsTrigger value="in">Them</TabsTrigger>
                    <TabsTrigger value="out">You</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Input
                  value={message.time}
                  onChange={(event) => updateMessage(message.id, { time: event.target.value })}
                  className="w-24 font-mono"
                  aria-label={`Time for message ${index + 1}`}
                />

                {message.side === "out" ? (
                  <Select
                    value={message.status}
                    onValueChange={(value) =>
                      updateMessage(message.id, { status: value as Message["status"] })
                    }
                  >
                    <SelectTrigger className="w-32" aria-label={`Delivery status for message ${index + 1}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}

                <span className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Move message ${index + 1} up`}
                  >
                    <ArrowUp strokeWidth={1.75} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    disabled={index === messages.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Move message ${index + 1} down`}
                  >
                    <ArrowDown strokeWidth={1.75} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    disabled={messages.length <= 1}
                    onClick={() =>
                      setMessages((current) => current.filter((entry) => entry.id !== message.id))
                    }
                    aria-label={`Remove message ${index + 1}`}
                  >
                    <X strokeWidth={1.75} />
                  </Button>
                </span>
              </div>

              <textarea
                value={message.text}
                onChange={(event) => updateMessage(message.id, { text: event.target.value })}
                placeholder="Message text…"
                rows={2}
                aria-label={`Text for message ${index + 1}`}
                className={cn(
                  "flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm",
                  "text-foreground placeholder:text-subtle-foreground",
                  "focus-visible:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--ring)]",
                )}
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 border-t border-border p-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMessages((current) => [...current, blankMessage("in", statusBarTime)])
            }
          >
            <Plus strokeWidth={1.75} />
            Add from them
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMessages((current) => [...current, blankMessage("out", statusBarTime)])
            }
          >
            <Plus strokeWidth={1.75} />
            Add from you
          </Button>
        </div>
      </section>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="chat-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="chat-scale" className="w-28">
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
          fileName={`${themeId}-mockup.png`}
          label="Download PNG"
        />
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          This produces a <strong className="text-foreground">mockup</strong> — a picture of a
          conversation that never happened. It is meant for design comps, tutorials, app-store
          screenshots and jokes. Passing one off as a real exchange is another matter entirely, and
          in many places a legal one.
        </span>
      </p>
    </div>
  );
}
