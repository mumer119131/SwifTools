import type { ToolContent } from "@/config/tool-content";

export const mergePdfContent: ToolContent = {
  steps: [
    "Drop in the PDFs you want to combine — add as many as you need.",
    "Drag the arrows to put them in the order you want them merged.",
    "Press Merge. The files are combined on your own device, then download the result.",
  ],
  notes: [
    "Merging happens entirely in your browser using pdf-lib. The pages of each file are copied into a new document in the order you set, and the result is written back out as a fresh PDF. Nothing is uploaded, so file size is limited only by your device's memory rather than by an upload cap.",
    "Page order is set by dragging the files, and the drag handles work with a keyboard as well as a mouse. Bookmarks, form fields and annotations from the source files are not carried across — pdf-lib copies page content, not the document-level structures that sit above it. For a straightforward merge of scans, reports or invoices that makes no difference; for a PDF portfolio with a bookmark tree, it does.",
    "An encrypted PDF cannot be merged until it is decrypted, because the page content is unreadable without the password. If a file fails to load, that is usually why.",
  ],
  faq: [
    {
      question: "How do I merge PDF files without uploading them?",
      answer: "Drop them onto this page. The merge runs in your own browser using the File API and pdf-lib, so the documents are read from disk into memory on your device and the combined file is written back the same way. Nothing is sent to a server at any point.",
    },
    {
      question: "Is there a limit on how many PDFs I can merge?",
      answer: "There is no fixed limit. Because the work happens on your device, the practical ceiling is your available memory — a few hundred megabytes of documents is comfortable on a modern laptop, and a phone will manage less.",
    },
    {
      question: "Will merging reduce the quality of my PDF?",
      answer: "No. Pages are copied across as they are, with no re-encoding of images or text, so the output is visually identical to the inputs. The file size of the result is roughly the sum of the sources.",
    },
    {
      question: "Can I change the order of the pages before merging?",
      answer: "You can reorder the files by dragging them, and the merged document follows that order. To reorder or remove individual pages, split the PDF first and merge the pieces in the order you want.",
    },
    {
      question: "Why won't my PDF load?",
      answer: "The usual cause is password protection — an encrypted PDF cannot be read without its password, so its pages cannot be copied. Remove the password in the application that created it, then try again. A corrupted or partially downloaded file will also fail to parse.",
    },
  ],
};
