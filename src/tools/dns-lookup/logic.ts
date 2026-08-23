import type { DnsResponse, DnsType } from "@/app/api/dns/route";

export const RECORD_TYPES: { id: DnsType; label: string; blurb: string }[] = [
  { id: "A", label: "A", blurb: "The IPv4 address the name points to." },
  { id: "AAAA", label: "AAAA", blurb: "The IPv6 address the name points to." },
  { id: "MX", label: "MX", blurb: "Where mail for this domain is delivered, lowest number first." },
  { id: "TXT", label: "TXT", blurb: "Free-form text, used for SPF, DKIM and domain verification." },
  { id: "NS", label: "NS", blurb: "The nameservers that answer for this domain." },
  { id: "CNAME", label: "CNAME", blurb: "An alias pointing at another name." },
  { id: "SOA", label: "SOA", blurb: "The zone's start of authority and its timers." },
  { id: "CAA", label: "CAA", blurb: "Which certificate authorities may issue for this domain." },
];

export async function fetchDns(name: string, type: DnsType): Promise<DnsResponse> {
  const response = await fetch(
    `/api/dns?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
  );

  const data = (await response.json()) as DnsResponse & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The lookup failed.");
  return data;
}
