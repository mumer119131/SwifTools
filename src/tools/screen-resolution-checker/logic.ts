export interface DisplayInfo {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  /** Screen size in actual device pixels, not CSS pixels. */
  physicalWidth: number;
  physicalHeight: number;
  colorDepth: number;
  orientation: string;
  aspectRatio: string;
  breakpoint: string;
  touchPoints: number;
  reducedMotion: boolean;
  colorScheme: string;
}

/** Tailwind's default breakpoints, so the reading matches what CSS is doing. */
const BREAKPOINTS: [number, string][] = [
  [1536, "2xl — 1536px and up"],
  [1280, "xl — 1280px and up"],
  [1024, "lg — 1024px and up"],
  [768, "md — 768px and up"],
  [640, "sm — 640px and up"],
];

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

export function aspectRatioOf(width: number, height: number): string {
  if (!width || !height) return "—";
  const divisor = greatestCommonDivisor(width, height);
  const w = width / divisor;
  const h = height / divisor;
  // Reduce anything unwieldy to a decimal ratio instead of e.g. 1440:2419.
  return w > 40 || h > 40 ? `${(width / height).toFixed(2)}:1` : `${w}:${h}`;
}

export function breakpointFor(width: number): string {
  return BREAKPOINTS.find(([min]) => width >= min)?.[1] ?? "base — under 640px";
}

export function readDisplayInfo(): DisplayInfo {
  const pixelRatio = window.devicePixelRatio || 1;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth,
    viewportHeight,
    pixelRatio,
    physicalWidth: Math.round(screen.width * pixelRatio),
    physicalHeight: Math.round(screen.height * pixelRatio),
    colorDepth: screen.colorDepth,
    orientation: viewportWidth >= viewportHeight ? "Landscape" : "Portrait",
    aspectRatio: aspectRatioOf(screen.width, screen.height),
    breakpoint: breakpointFor(viewportWidth),
    touchPoints: navigator.maxTouchPoints ?? 0,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light",
  };
}

export interface FeatureCheck {
  label: string;
  supported: boolean;
  note: string;
}

/**
 * Capability checks that actually affect what a page can do, tested by feature
 * detection rather than by sniffing the user agent — which lies.
 */
export function readFeatures(): FeatureCheck[] {
  const hasCanvas = (() => {
    try {
      return !!document.createElement("canvas").getContext("2d");
    } catch {
      return false;
    }
  })();

  const supportsWebp = (() => {
    try {
      return document
        .createElement("canvas")
        .toDataURL("image/webp")
        .startsWith("data:image/webp");
    } catch {
      return false;
    }
  })();

  return [
    { label: "Canvas 2D", supported: hasCanvas, note: "Image editing and PDF rendering" },
    { label: "WebP encoding", supported: supportsWebp, note: "Smaller image exports" },
    {
      label: "Web Workers",
      supported: typeof Worker !== "undefined",
      note: "Heavy work off the main thread",
    },
    {
      label: "WebAssembly",
      supported: typeof WebAssembly !== "undefined",
      note: "Near-native processing speed",
    },
    {
      label: "File System Access",
      supported: "showSaveFilePicker" in window,
      note: "Save directly to a chosen file",
    },
    {
      label: "Clipboard API",
      supported: typeof navigator !== "undefined" && !!navigator.clipboard,
      note: "One-click copy",
    },
    {
      label: "Intl.Segmenter",
      supported: typeof Intl !== "undefined" && "Segmenter" in Intl,
      note: "Accurate word and emoji counting",
    },
    {
      label: "Touch input",
      supported: (navigator.maxTouchPoints ?? 0) > 0,
      note: "Pointer coarse — larger tap targets",
    },
  ];
}
