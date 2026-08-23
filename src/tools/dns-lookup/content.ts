import type { ToolContent } from "@/config/tool-content";

export const dnsLookupContent: ToolContent = {
  steps: [
    "Enter a domain name such as example.com — no http:// and no path.",
    "Pick the record type you want. A is the address the name points to; MX is where its mail goes.",
    "Results are read live from public DNS. Copy the whole set with one tap.",
  ],
  notes: [
    "DNS is the internet's address book. Names are what people remember and addresses are what machines route to, and DNS is the lookup that turns one into the other. Every time you load a page, your device asks a resolver where that name lives before a single byte of the site is fetched.",
    "The types answer different questions. A and AAAA give the IPv4 and IPv6 addresses a name points to. MX says where mail for the domain should be delivered, lowest priority number first. NS lists the nameservers with authority for the zone. CNAME makes one name an alias for another. SOA carries the zone's serial number and timers. CAA names which certificate authorities are permitted to issue certificates for the domain.",
    "TXT is the one that does the most work in practice, because it holds arbitrary text and the email world built on top of it. SPF records list which servers may send mail as your domain, DKIM holds the public key that signs your outgoing mail, and DMARC tells receiving servers what to do when a message fails those checks. Most domain verification — for a search console, a mail provider, a certificate — also happens by publishing a TXT record.",
    "Changes are not instant. Every record carries a TTL, the number of seconds a resolver may cache the answer before asking again, so an edit propagates as caches expire rather than all at once. A record with a TTL of 3600 can be served from cache for an hour after you change it, which is why lowering the TTL a day before a planned migration is standard practice.",
    "If a lookup returns nothing, that is an answer rather than a failure. A domain that publishes no CAA record simply has not set one, which is different from the domain not existing at all.",
  ],
  faq: [
    {
      question: "What is an A record?",
      answer:
        "It maps a domain name to an IPv4 address — the fundamental lookup that lets a browser find the server for a name. AAAA is the same thing for IPv6 addresses.",
    },
    {
      question: "How do I check my SPF or DKIM record?",
      answer:
        "Both are published as TXT records. Look up the TXT records for your domain and an SPF record is the entry starting v=spf1. DKIM lives on a subdomain like selector._domainkey.yourdomain.com, so query that name directly.",
    },
    {
      question: "Why does my DNS change not show up yet?",
      answer:
        "Resolvers cache answers for the length of the record's TTL. Until that expires they keep serving the old value. If you know a change is coming, lower the TTL a day beforehand so the cached copies expire quickly.",
    },
    {
      question: "What is the difference between a CNAME and an A record?",
      answer:
        "An A record points a name at an address. A CNAME points a name at another name, and the resolver then looks that one up. A CNAME cannot coexist with other records on the same name, which is why it cannot be used on a bare domain.",
    },
    {
      question: "What does an MX priority number mean?",
      answer:
        "It is the order in which sending servers should try your mail hosts, lowest first. Equal numbers share the load. It is a preference, not a quality ranking — a lower number simply means try this one earlier.",
    },
  ],
};
