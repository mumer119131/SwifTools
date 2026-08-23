import type { ToolContent } from "@/config/tool-content";

export const httpHeaderCheckerContent: ToolContent = {
  steps: [
    "Enter a URL — https:// is assumed if you leave the scheme off.",
    "Redirects are followed one hop at a time, and the whole chain is shown with its status codes.",
    "The security headers of the final response are checked, with an explanation of what each one does.",
  ],
  notes: [
    "Every HTTP response carries headers before its body: metadata describing what was sent, how it may be cached, and what the browser is allowed to do with it. They are invisible in normal browsing but decide a great deal about how a page behaves.",
    "The redirect chain is often the most immediately useful part. A request for a bare http address on a well-configured site usually becomes a 301 to https and then a 200, and seeing each hop makes it obvious when a site has an accidental loop, a redirect through the wrong hostname, or a chain several hops longer than it needs to be. Each extra hop is a full round trip before anything renders.",
    "Among the security headers, Strict-Transport-Security and Content-Security-Policy do the heaviest lifting. HSTS tells the browser to use HTTPS for this site from now on, closing the window where a first plain-http request could be intercepted. CSP restricts where scripts and styles may load from, and is the main structural defence against cross-site scripting.",
    "Clickjacking protection is the one case where a missing header is not necessarily a problem. X-Frame-Options was the original way to stop a page being embedded in someone else's frame, but a Content-Security-Policy frame-ancestors directive does the same job, takes precedence in modern browsers, and is the more expressive of the two. A site setting only the CSP directive is protected, so this tool counts that as covered rather than reporting it missing.",
    "A word on what a header check can and cannot tell you. It reports what the server sent for this one request. It cannot tell you whether a Content-Security-Policy is actually strict enough, whether the caching directives suit the content, or whether the site is secure in any broader sense.",
  ],
  faq: [
    {
      question: "What are HTTP response headers?",
      answer:
        "Metadata a server sends with every response, ahead of the page itself. They describe the content type, how long it may be cached, whether cookies are set, and what security rules the browser should apply.",
    },
    {
      question: "Which security headers should a site set?",
      answer:
        "Strict-Transport-Security and Content-Security-Policy matter most. X-Content-Type-Options: nosniff, a Referrer-Policy, and clickjacking protection through either X-Frame-Options or CSP frame-ancestors round out the usual set.",
    },
    {
      question: "Do I still need X-Frame-Options if I have a CSP?",
      answer:
        "Not if your Content-Security-Policy includes a frame-ancestors directive, which supersedes it in modern browsers. Setting both is harmless and still helps very old clients, so plenty of sites do.",
    },
    {
      question: "Why does my URL show several redirects?",
      answer:
        "Commonly one hop upgrades http to https and another moves between the bare domain and www. That is normal. A chain longer than two or three hops is worth shortening, since each one is a round trip before the page starts loading.",
    },
    {
      question: "What does HSTS do?",
      answer:
        "Strict-Transport-Security tells a browser to contact the site over HTTPS only, for a stated period. After the first visit, an accidental http link is upgraded by the browser before any request leaves the device.",
    },
  ],
};
