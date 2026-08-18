import type { ToolContent } from "@/config/tool-content";

export const youtubeThumbnailGrabberContent: ToolContent = {
  steps: [
    "Paste any YouTube URL — watch, share, embed, Shorts or a bare video ID.",
    "Every available size appears, from 120px up to maxres where the uploader provided one.",
    "Open or download the one you need. Images come from Google's public thumbnail CDN.",
  ],
  notes: [
    "YouTube publishes several thumbnail sizes for every video at predictable URLs, and this fetches them by video ID. The largest is maxresdefault at 1280 by 720, then sddefault at 640 by 480, hqdefault at 480 by 360 and mqdefault at 320 by 180.",
    "maxresdefault is not always present. It only exists if the uploader provided a thumbnail at that resolution or the source video was high definition, which is why older and lower-resolution videos fall back to hqdefault. Both are shown so you can take the best one available.",
    "These images belong to whoever uploaded the video. Downloading one for reference, for a moodboard or to check what your own thumbnails look like is uncontroversial; republishing someone else's thumbnail as your own artwork is a copyright matter.",
  ],
  faq: [
    {
      question: "How do I download a YouTube thumbnail?",
      answer: "Paste the video URL or ID and every available size is shown for download. The largest is usually 1280 by 720, though not every video has one at that resolution.",
    },
    {
      question: "Why is the maximum resolution thumbnail missing?",
      answer: "maxresdefault only exists if the uploader supplied a thumbnail that large or the source was high definition. Older and lower-resolution videos fall back to hqdefault at 480 by 360, which is shown instead.",
    },
    {
      question: "What size are YouTube thumbnails?",
      answer: "1280 by 720 for the full size, with 640 by 480, 480 by 360 and 320 by 180 also published. If you are making one, 1280 by 720 is what to design for.",
    },
    {
      question: "Can I use someone else's thumbnail?",
      answer: "For reference, research or a moodboard, that is ordinary use. Republishing it as your own artwork is a copyright question and the image belongs to whoever uploaded the video.",
    },
    {
      question: "Does this work for private or unlisted videos?",
      answer: "Unlisted videos generally work, since their thumbnails are publicly addressable. Private videos do not — their thumbnails are not served publicly.",
    },
  ],
};
