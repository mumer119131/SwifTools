import type { ToolContent } from "@/config/tool-content";

export const whatIsMyIpContent: ToolContent = {
  steps: [
    "Your public IP address is shown as soon as the page loads — nothing to click.",
    "Below it, see what your browser reports about itself: operating system, time zone, screen size and language.",
    "Copy the address with one tap if you need to paste it into a support ticket or an allowlist.",
  ],
  notes: [
    "Your public IP address is the one the rest of the internet sees. It usually belongs to your router or your provider rather than to your computer, which is why every device in your home typically shares the same one. The address your computer shows in its own network settings — normally something starting 192.168 or 10 — is a private address that only exists inside your network.",
    "Addresses come in two versions. IPv4 is the familiar four-number form like 203.0.113.9, and there are only about 4.3 billion of them, which the internet ran out of years ago. IPv6 replaces it with a much longer hexadecimal form and enough addresses that running out is not a practical concern. Many connections now have both, and which one a site sees depends on how the connection was made.",
    "Your address is not usually fixed. Most home connections get a dynamic address that changes when the router restarts or when the provider decides to rotate it. A static address generally has to be requested, and is more common on business lines.",
    "What can be learned from it is narrower than people expect. An IP address maps to a provider and typically to a city or region, which is how sites guess your country for currency or language. It does not identify you personally, and the geolocation is often wrong by a good distance — particularly on mobile networks, where traffic can surface hundreds of miles from where you are.",
    "Everything shown below the address is read from your own browser and stays there. The address itself is read by this site's own endpoint from the connection, so using this page does not hand your address to a third-party lookup service, and nothing is logged or stored.",
  ],
  faq: [
    {
      question: "Why is my IP address different on my phone and my laptop?",
      answer:
        "If they are on the same Wi-Fi they will normally show the same public address, because both go out through the same router. If your phone is on mobile data it is on a different network entirely, so it gets an address from your mobile provider instead.",
    },
    {
      question: "Does my IP address reveal my home address?",
      answer:
        "No. It identifies your provider and usually a city or region, which is how sites guess your country. It does not give a street address, and the location is frequently wrong by a considerable distance — especially on mobile networks.",
    },
    {
      question: "How do I hide my IP address?",
      answer:
        "A VPN or proxy routes your traffic through another server, so sites see that server's address rather than yours. Your VPN provider can still see the connection, so this moves the trust rather than removing it.",
    },
    {
      question: "What is the difference between IPv4 and IPv6?",
      answer:
        "IPv4 is the four-number form like 203.0.113.9 and has about 4.3 billion addresses, which have effectively run out. IPv6 uses a longer hexadecimal form with a vastly larger space. Many connections have both, and this page shows whichever one your browser used to reach it.",
    },
    {
      question: "Why does my IP address keep changing?",
      answer:
        "Most home connections use a dynamic address that the provider can rotate, often when the router restarts. This is normal. A fixed address is usually something you have to request, and is more typical of business connections.",
    },
  ],
};
