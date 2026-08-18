import type { ToolContent } from "@/config/tool-content";

export const contrastCheckerContent: ToolContent = {
  steps: [
    "Enter a text colour and a background colour, in hex or RGB.",
    "The ratio is checked against AA and AAA for normal text, large text and UI components.",
    "If it fails, the nearest passing colour is offered — the smallest change that works.",
  ],
  notes: [
    "Contrast is calculated from relative luminance, not from the raw colour values. Each channel is normalised, the sRGB gamma curve is undone, and the results are weighted 0.2126 red, 0.7152 green and 0.0722 blue — coefficients that reflect how much each primary contributes to perceived brightness, which is why green dominates and blue barely registers. Comparing HSL lightness instead produces plausible-looking numbers that are wrong, and a checker that certifies an inaccessible pair as passing is worse than no checker.",
    "The thresholds differ by context. Normal text needs 4.5:1 for AA and 7:1 for AAA. Large text — 18pt and up, or 14pt bold and up — needs 3:1 and 4.5:1, because bigger glyphs have more area for the eye to work with. Non-text elements such as icons, input borders and focus indicators need 3:1 under WCAG 2.1, and that last one is missed constantly: a beautiful pale grey input border almost never passes.",
    "The ratio scale runs from 1:1 for identical colours to 21:1 for black on white, and it is capped there by a 0.05 offset in the formula that models ambient light reflecting off the screen. Meeting the threshold is a floor, not a target — WCAG is a minimum standard, and text at exactly 4.5:1 is legible rather than comfortable.",
  ],
  faq: [
    {
      question: "What contrast ratio do I need to pass WCAG?",
      answer: "4.5:1 for normal text at AA, and 7:1 at AAA. Large text — 18pt or more, or 14pt bold or more — needs 3:1 at AA and 4.5:1 at AAA. Icons, input borders and focus rings need 3:1 under WCAG 2.1 non-text contrast.",
    },
    {
      question: "What counts as large text?",
      answer: "18 point, which is 24 pixels at the default browser size, or 14 point bold, which is about 18.66 pixels. The allowance exists because larger glyphs have more area and thicker strokes, so the eye needs less contrast to resolve them.",
    },
    {
      question: "Why does my grey placeholder text fail?",
      answer: "Because placeholder greys are usually chosen to look soft rather than to be readable — a common #9ca3af on white is only about 2.5:1. Placeholder text is still text and still has to pass, which is one reason a visible label above the field is better than relying on a placeholder at all.",
    },
    {
      question: "Does contrast apply to icons and borders?",
      answer: "Yes, since WCAG 2.1. Any non-text element that conveys meaning or state — icons, input borders, focus indicators, chart lines — needs 3:1 against what is behind it. Pale one-pixel input borders are the most common failure on the web.",
    },
    {
      question: "How is the contrast ratio calculated?",
      answer: "Take the relative luminance of both colours, add 0.05 to each, and divide the larger by the smaller. The 0.05 models ambient light reflecting off the screen and is what caps the scale at 21:1 rather than letting it run to infinity for pure black on pure white.",
    },
    {
      question: "Is passing AA enough?",
      answer: "It is the legal minimum in most jurisdictions and it is genuinely a minimum. Text at exactly 4.5:1 is legible, not comfortable, and it gets harder in sunlight, on a cheap screen, or for anyone over about forty. Aim above the line where you can.",
    },
  ],
};
