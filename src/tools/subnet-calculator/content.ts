import type { ToolContent } from "@/config/tool-content";

export const subnetCalculatorContent: ToolContent = {
  steps: [
    "Type an address in CIDR form, like 10.0.0.1/24, or with a dotted netmask.",
    "Read off the network, broadcast, host range and address count.",
    "Split the block into smaller subnets if you need to divide it.",
  ],
  notes: [
    "A prefix length is a count of leading bits that identify the network. /24 means the first 24 bits are fixed and the last 8 vary, giving 256 addresses of which 254 can be assigned — the first is the network address and the last is the broadcast address, and neither goes on a host.",
    "Two prefixes break that rule, and both are shown correctly here rather than reported as having zero or minus one hosts. A /31 has no network or broadcast address at all: RFC 3021 defines it for point-to-point links, where both addresses are usable. A /32 is a single address, which is how you write one specific host in a firewall rule or route.",
    "The wildcard mask is the netmask inverted. Cisco access lists and several routing protocols take that form rather than the netmask, and converting it in your head is a reliable way to make a mistake at two in the morning.",
    "Where both a network and a host portion are given, the address is masked down to its network first — so 192.168.1.130/26 and 192.168.1.128/26 describe the same block, which is usually what you want to confirm.",
  ],
  faq: [
    {
      question: "How many hosts are in a /24?",
      answer: "256 addresses, 254 of them usable. The first is the network address and the last is the broadcast address; neither can be assigned to a machine.",
    },
    {
      question: "Why does a /31 show two usable addresses instead of none?",
      answer: "Because RFC 3021 says so. A /31 is meant for point-to-point links, where there is no need for a broadcast address and both addresses go on interfaces. Applying the usual minus-two rule would report zero usable hosts, which is wrong.",
    },
    {
      question: "What is a wildcard mask?",
      answer: "The netmask with every bit flipped — 0.0.0.255 where the netmask is 255.255.255.0. Cisco access lists and OSPF take this form, and it is easy to invert incorrectly by hand.",
    },
    {
      question: "What is the difference between the network address and the first host?",
      answer: "The network address identifies the block itself and is always the lowest address in it. The first usable host is the one immediately after. On a /24 that is x.x.x.0 and x.x.x.1 respectively.",
    },
    {
      question: "Which address ranges are private?",
      answer: "10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16, set aside by RFC 1918 for use inside networks. Anything in those ranges is flagged here, along with loopback, link-local and carrier-grade NAT space.",
    },
  ],
};
