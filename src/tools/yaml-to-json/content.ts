import type { ToolContent } from "@/config/tool-content";

export const yamlToJsonContent: ToolContent = {
  steps: [
    "Paste your YAML — or JSON, if you are going the other way.",
    "The conversion runs as you type, and syntax errors are reported with their line.",
    "Copy the result.",
  ],
  notes: [
    "Every JSON document is already valid YAML, so that direction is really a reformat. The other way round is a genuine conversion, and it loses things — which this tool says out loud rather than letting the output look complete.",
    "Comments go first. YAML has them and JSON does not, so any explanation of why a setting is what it is disappears in the conversion. Anchors and aliases are expanded into full copies, because JSON cannot point at a value defined elsewhere. And a multi-document file separated by `---` has no JSON equivalent at all, so only the first document converts.",
    "This is also a quick way to find out why a config file is being rejected. YAML is whitespace-significant and unforgiving about tabs, and a parse error here gives you the line and column, which is usually more than the tool that rejected it told you.",
    "Both directions run in your browser. Config files tend to be the ones with credentials in them, and pasting those into a server you do not control is a bad habit.",
  ],
  faq: [
    {
      question: "Is JSON valid YAML?",
      answer: "Yes — YAML 1.2 is a strict superset of JSON, so any JSON document parses as YAML unchanged. Converting JSON to YAML is really just reformatting it into the more readable style.",
    },
    {
      question: "What gets lost converting YAML to JSON?",
      answer: "Comments, which JSON has no syntax for. Anchors and aliases, which are expanded into full copies. And every document after the first in a multi-document file, since JSON has no equivalent of the `---` separator. Each of these is flagged when it happens.",
    },
    {
      question: "Why does my YAML fail to parse?",
      answer: "Usually indentation. YAML is whitespace-significant and rejects tabs outright, so a tab that looks identical to spaces in your editor will break it. Unquoted colons inside values are the other common cause. The error here gives you the line and column.",
    },
    {
      question: "Can I convert a Docker Compose or Kubernetes file?",
      answer: "Yes, and it is a good way to inspect one. Bear in mind Kubernetes manifests are often multi-document files, in which case only the first document converts — you will see a note when that happens.",
    },
  ],
};
