export {
  palettes,
  renderInstagramPost,
  type InstagramPostOptions,
  type Palette,
} from "@/lib/social-mockup";
export { canvasToPng, loadImage } from "@/lib/mockup";

/** Instagram accepts three ratios; anything else gets cropped on upload. */
export const aspects: { id: string; label: string; value: number }[] = [
  { id: "square", label: "1:1 square", value: 1 },
  { id: "portrait", label: "4:5 portrait", value: 4 / 5 },
  { id: "landscape", label: "1.91:1 landscape", value: 1.91 },
];
