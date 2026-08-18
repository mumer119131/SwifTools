import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // A stable identity, so a change of start_url does not read as a
    // different app and install twice.
    id: "/",
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#08090a",
    theme_color: "#08090a",
    orientation: "any",
    categories: ["utilities", "productivity"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops to the launcher's shape; without a maskable icon it
      // crops the ordinary one and takes the corners off the mark.
      { src: "/icon-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    /*
     * Long-pressing the installed icon jumps straight to a tool. Only the ones
     * someone genuinely opens repeatedly are worth a slot — a shortcut to a
     * one-off conversion would never be used twice.
     */
    shortcuts: [
      { name: "Timer and stopwatch", short_name: "Timer", url: "/generator/timer" },
      { name: "Notepad", short_name: "Notepad", url: "/fun/online-notepad" },
      { name: "To-do list", short_name: "To-do", url: "/fun/to-do-list" },
      { name: "All tools", short_name: "Tools", url: "/tools" },
    ],
  };
}
