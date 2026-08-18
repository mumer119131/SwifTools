import { ScanEye } from "lucide-react";

import type { Tool } from "@/config/tools";

export const exifViewer: Tool = {
  slug: "exif-viewer",
  name: "EXIF Viewer and Remover",
  category: "image",
  description: "See the hidden data in a photo — including GPS coordinates — and strip it without re-encoding.",
  keywords: [
    "exif viewer",
    "remove exif data",
    "photo metadata",
    "strip gps from photo",
    "exif remover",
    "check photo location data",
    "image metadata viewer",
  ],
  icon: ScanEye,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in a photo. It is read by your browser and never uploaded.",
    "Every tag is listed, with anything identifying flagged.",
    "Download a stripped copy — the image data is untouched, only the metadata goes.",
  ],
  notes: [
    "Every photo a phone or camera takes carries a block of metadata alongside the picture. Usually that means the make and model, the exposure settings and the date. Often it also means the exact GPS coordinates where the shot was taken, accurate to a few metres, and sometimes the camera's serial number — which links every photo you have ever published to the same device.",
    "That data survives being emailed, put in a document, or uploaded to most file hosts. Some social networks strip it on upload and some do not, and which is which changes without announcement. The reliable move is to remove it yourself before the file leaves your machine, which is what this does.",
    "Stripping here removes whole marker segments from the JPEG byte stream rather than redrawing the image through a canvas. The distinction matters: a canvas round-trip does remove metadata, and it also silently recompresses the photo, so the privacy operation would cost you image quality. Cutting the segments out leaves the compressed image data bit-for-bit identical — verified in the test suite by comparing the bytes after the scan header before and after.",
    "The whole thing runs in your browser. A tool that asks you to upload a photograph in order to remove its location data has, at the moment of upload, done the exact thing you were trying to prevent.",
  ],
  faq: [
    {
      question: "What is EXIF data and why does it matter?",
      answer: "It is a block of information cameras and phones attach to every photo — make, model, exposure, date, and very often the GPS coordinates of where it was taken. The location is the part that matters: a photo posted from home can carry your address to within a few metres.",
    },
    {
      question: "Do social networks remove EXIF automatically?",
      answer: "Some do, some do not, and which is which changes without notice. It also does not help for a photo emailed, put in a document, or uploaded to a file host. Removing it yourself before the file leaves your machine is the only approach that does not depend on someone else's current policy.",
    },
    {
      question: "Does removing metadata reduce image quality?",
      answer: "Not here. The metadata segments are cut out of the file and the compressed image data is copied across untouched, so the pixels are bit-for-bit identical. Tools that redraw the image through a canvas do remove the metadata, but they also recompress the photo — quietly costing you quality in the name of privacy.",
    },
    {
      question: "Is my photo uploaded to read its metadata?",
      answer: "No, and that is rather the point. A tool that asks you to upload a photograph in order to strip its location data has already done the thing you were trying to prevent. The file is read by your browser and never transmitted.",
    },
    {
      question: "Which formats are supported?",
      answer: "JPEG, which is what phones and cameras produce and where EXIF actually lives. PNG carries far less metadata and rarely any location. HEIC stores it too, but browsers cannot decode HEIC without Apple's libraries.",
    },
  ],
};
