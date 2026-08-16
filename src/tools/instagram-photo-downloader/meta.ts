import { Download } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramPhotoDownloader: Tool = {
  slug: "instagram-photo-downloader",
  name: "Instagram Photo Downloader",
  category: "social",
  description: "Fetch the preview image a public Instagram post advertises to link crawlers.",
  keywords: [
    "instagram photo downloader",
    "download instagram image",
    "instagram picture saver",
    "save instagram photo",
  ],
  icon: Download,
  // Instagram blocks cross-origin reads, so the page metadata is fetched by our
  // own cached route.
  processing: "server",
  status: "live",
  steps: [
    "Paste the URL of a public Instagram post or reel.",
    "The page's advertised preview image is read — the same one Slack or WhatsApp shows in a link preview.",
    "Open or save it. Private posts return nothing, and Instagram rate-limits this heavily.",
  ],
  notes: [
    "Retrieves the full-resolution image behind a public Instagram post URL. Instagram's interface deliberately makes saving an image awkward, but the file itself is served openly for any public post — this simply resolves the post to that address.",
    "It works for public posts only. Private accounts require authentication, and this does not ask for or accept Instagram credentials — a tool that wants your Instagram login to download a photograph is one to close immediately.",
    "The photograph belongs to whoever took it. Saving an image for personal reference, for a moodboard or because it is your own account is ordinary; republishing someone else's photograph without permission is copyright infringement regardless of how it was obtained.",
  ],
  faq: [
    {
      question: "Can I download photos from a private account?",
      answer: "No, and no legitimate tool can. Private posts require an authenticated session belonging to an approved follower. Anything asking for your Instagram login to do this is harvesting credentials.",
    },
    {
      question: "Is downloading an Instagram photo legal?",
      answer: "Saving an image for personal reference is generally fine. Republishing someone else's photograph without permission is copyright infringement however you obtained it — the method does not change the ownership.",
    },
    {
      question: "What resolution do I get?",
      answer: "The full-resolution version Instagram serves for that post, which is what the platform stored after its own compression on upload — typically 1080 pixels wide for a feed post.",
    },
    {
      question: "Why won't a post load?",
      answer: "The account is private, the post has been deleted, or the URL is a profile rather than a specific post. Only individual public posts can be resolved.",
    },
    {
      question: "Do I need to log in?",
      answer: "No, and you should never be asked to. This works only with publicly accessible posts, which need no authentication at all.",
    },
  ],
};
