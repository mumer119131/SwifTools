export { renderStory, type StoryOptions } from "@/lib/social-mockup";
export { canvasToPng, loadImage } from "@/lib/mockup";

export const gradients: { id: string; label: string; stops: [string, string] }[] = [
  { id: "sunset", label: "Sunset", stops: ["#f76b15", "#d6409f"] },
  { id: "indigo", label: "Indigo", stops: ["#5e6ad2", "#8e4ec6"] },
  { id: "mint", label: "Mint", stops: ["#30a46c", "#00a2c7"] },
  { id: "ember", label: "Ember", stops: ["#e5484d", "#ffb224"] },
  { id: "night", label: "Night", stops: ["#0f172a", "#334155"] },
];

/** Story frames are 1080×1920; the preview is a 405-wide scale of that. */
export const STORY_PREVIEW_WIDTH = 405;
export const STORY_EXPORT_SCALE = 1080 / STORY_PREVIEW_WIDTH;
