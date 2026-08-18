import type { ToolContent } from "@/config/tool-content";

export const jsMinifierContent: ToolContent = {
  steps: [
    "Paste your JavaScript, as a module or a plain script.",
    "Terser parses it to an AST, removes unreachable code and renames local variables.",
    "Compare the byte saving, then copy or download the result.",
  ],
  notes: [
    "Minification uses Terser, which does considerably more than strip whitespace. It renames local variables to single letters, removes unreachable code, collapses expressions that can be evaluated at build time, and drops comments — typically 40 to 60 percent smaller before compression.",
    "Only local names are renamed. Anything reachable from outside the scope — exported functions, object properties, global names — has to keep its identifier, because renaming it would break every caller. This is why heavily object-oriented code minifies less than code full of local helpers.",
    "Minified JavaScript is undebuggable without a source map. Generate one in your build, keep it out of production or serve it only to authenticated users, and never rely on minification as a way of hiding logic — anything shipped to a browser can be read.",
  ],
  faq: [
    {
      question: "How much smaller does minifying JavaScript make a file?",
      answer: "Typically 40 to 60 percent before gzip, because Terser renames local variables to single letters and removes dead code as well as whitespace. Gzip on top of that usually gets the transferred size down by around 70 percent overall.",
    },
    {
      question: "Can minification break my code?",
      answer: "Rarely, but it can if the code relies on function or variable names at runtime — reading Function.prototype.name, or matching on a constructor name. Those names are exactly what minification changes.",
    },
    {
      question: "Does minifying protect my source code?",
      answer: "No. It makes code harder to read, not impossible — anything sent to a browser can be recovered and reformatted. Treat minification as a size optimisation, never as a security measure.",
    },
    {
      question: "What is a source map and do I need one?",
      answer: "A file mapping minified positions back to your original source, so browser dev tools show real names and line numbers. You need one to debug production issues; serve it carefully, since it exposes your original code.",
    },
    {
      question: "Is my code uploaded to be minified?",
      answer: "No. Terser runs in your browser, so proprietary source stays on your machine — which is worth knowing before pasting a bundle into an online tool.",
    },
  ],
};
