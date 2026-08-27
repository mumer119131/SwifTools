import type { ToolContent } from "@/config/tool-content";

export const markdownToMediumContent: ToolContent = {
  steps: [
    "Paste your Markdown into the box — the preview shows how it will read.",
    "Check the warnings, which list anything Medium's editor cannot reproduce.",
    "Press Copy for Medium, then paste into a Medium draft. The formatting comes with it.",
  ],
  notes: [
    "Medium does not read Markdown. Paste a document with hash marks and asterisks in it and you get hash marks and asterisks — the editor treats it as ordinary text, which is why writers who draft in Markdown end up reformatting everything by hand.",
    "What Medium does honour is rich text. Copy formatted content from a web page or a word processor and the headings, links, bold and lists arrive intact, because the clipboard carries an HTML version alongside the plain one. This tool writes that HTML version itself: your Markdown is rendered, and the result is placed on the clipboard as formatted text rather than as characters.",
    "That is also why the button says copy rather than download. There is no file to move — the formatting only exists on the clipboard, so the paste has to be the next thing you do.",
    "Not everything survives the trip, and the warnings above are specific about which parts. Tables are the big one: Medium has no table support at all, so rows arrive as loose lines of text. Images are the other, because Medium hosts its own — a linked file will not embed, and each one has to be added in the editor afterwards.",
    "Headings are worth knowing about too. Medium offers two sizes, so anything below H2 lands as a small heading and the distinction between your levels is lost. If a piece leans on three levels of structure, it will read flatter on Medium than in your draft.",
    "Nothing is uploaded. The Markdown is parsed in your browser and the preview is rendered inside a sandboxed frame, so a document containing raw HTML cannot run anything.",
  ],
  faq: [
    {
      question: "Does Medium support Markdown?",
      answer:
        "Not in the editor. Pasting Markdown as plain text shows the syntax literally. Medium does accept pasted rich text, which is the route this tool takes — it puts a formatted version on the clipboard so the paste arrives with headings and links intact.",
    },
    {
      question: "Why does my table not appear?",
      answer:
        "Medium has no table support. The rows paste as separate lines of text. The usual workarounds are a screenshot of the table or restructuring it as a list.",
    },
    {
      question: "Why did my images not come through?",
      answer:
        "Medium serves images from its own storage, so a Markdown image pointing at a URL will not embed on paste. Add each image in the editor after pasting the text.",
    },
    {
      question: "What happens to my H3 and H4 headings?",
      answer:
        "Medium has two heading levels rather than six. H3 and deeper arrive as small headings, so several levels collapse into one. Worth flattening your structure before pasting if the hierarchy matters.",
    },
    {
      question: "Is the read time the same as Medium's?",
      answer:
        "It is an estimate on the same basis — roughly 265 words a minute. Medium also adds time for images, so a picture-heavy piece will read slightly longer there than the number shown here.",
    },
  ],
};
