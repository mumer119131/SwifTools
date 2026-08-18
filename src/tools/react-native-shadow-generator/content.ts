import type { ToolContent } from "@/config/tool-content";

export const reactNativeShadowGeneratorContent: ToolContent = {
  steps: [
    "Drag the sliders, or start from a preset, and watch the preview update.",
    "Android's elevation and iOS's four shadow props are kept in sync — change either and the other follows.",
    "Copy the StyleSheet, choosing the legacy cross-platform props or the newer boxShadow.",
  ],
  notes: [
    "React Native does not share CSS's box-shadow. iOS uses shadowColor, shadowOffset, shadowOpacity and shadowRadius, which map onto Core Animation's shadow properties; Android uses a single elevation number that drives Material Design's own shadow rendering. There is no way to express one exactly in terms of the other.",
    "That is why this outputs both, plus the CSS equivalent for a web target. An elevation value produces a shadow whose colour, offset and blur are chosen by the platform, so matching an iOS shadow on Android means picking the elevation that looks closest rather than converting a value.",
    "One iOS gotcha worth knowing: shadows are not drawn on a view with no background colour, and setting overflow hidden removes them entirely. If a shadow refuses to appear, those two are almost always the reason.",
  ],
  faq: [
    {
      question: "Why doesn't box-shadow work in React Native?",
      answer: "React Native does not implement CSS. iOS exposes Core Animation's shadow properties — colour, offset, opacity and radius — while Android exposes a single elevation value that drives Material Design's shadow renderer. They are different systems.",
    },
    {
      question: "How do I match an iOS shadow on Android?",
      answer: "You approximate it. Elevation chooses the colour, offset and blur for you according to Material Design, so you pick the value that looks closest rather than converting. This tool shows both side by side so you can judge.",
    },
    {
      question: "Why is my shadow not showing on iOS?",
      answer: "Two usual causes: the view has no background colour, in which case iOS has no shape to cast from, or overflow is set to hidden, which clips the shadow away entirely.",
    },
    {
      question: "Does elevation affect anything besides the shadow on Android?",
      answer: "Yes — it also controls z-ordering. A higher elevation draws above lower ones regardless of position in the tree, which can surprise you when raising a shadow unexpectedly brings a view in front of its siblings.",
    },
    {
      question: "Can I use the same values on web?",
      answer: "The CSS box-shadow equivalent is generated alongside, so a React Native Web target can use it directly. It will be close to the iOS rendering, since both blur similarly.",
    },
  ],
};
