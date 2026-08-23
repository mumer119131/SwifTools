import Link from "next/link";

export default function DnsRecordsGuide() {
  return (
    <>
      <p>
        DNS is the internet&rsquo;s address book. People remember names, machines
        route to numbers, and DNS is the lookup in between. Every page you load
        starts with it: before a single byte of the site arrives, your device has
        to ask where that name lives.
      </p>
      <p>
        Most of the confusion around DNS comes from two things — not knowing
        which record type answers which question, and not understanding why a
        change you made an hour ago still has not taken effect.
      </p>

      <h2>What actually happens when you type a name</h2>
      <p>
        Your device asks a <strong>resolver</strong>, usually run by your
        provider or by a public service. If the resolver already knows the answer
        it returns it immediately. If not, it works down the hierarchy: a{" "}
        <strong>root</strong> server points it at the servers for{" "}
        <code>.com</code>, those point it at the nameservers for your domain, and
        those — the <strong>authoritative</strong> servers — give the real
        answer.
      </p>
      <p>
        That last step matters. The authoritative nameservers are the only place
        the truth lives. Everything else in the chain is a cache, and caches are
        the source of nearly every &ldquo;but I already changed it&rdquo; problem.
      </p>

      <h2>The record types worth knowing</h2>
      <p>
        <strong>A</strong> maps a name to an IPv4 address, and{" "}
        <strong>AAAA</strong> does the same for IPv6. These are the fundamental
        lookups — the thing that turns a hostname into somewhere to send packets.
      </p>
      <p>
        <strong>CNAME</strong> makes one name an alias for another. The resolver
        finds the CNAME, then starts again on the name it points to. It is how
        you point <code>www</code> at a hosting provider without caring what
        address they use this week.
      </p>
      <p>
        <strong>MX</strong> says where mail for the domain should be delivered.
        Each entry carries a number, and senders try the lowest first. It is a
        preference, not a ranking — a lower number just means try this one
        earlier, and equal numbers share the load.
      </p>
      <p>
        <strong>TXT</strong> holds arbitrary text, and does far more work than
        that description suggests. Nearly all email authentication and almost
        every domain verification runs through it.
      </p>
      <p>
        <strong>NS</strong> lists the nameservers with authority for the zone,{" "}
        <strong>SOA</strong> carries its serial number and timers, and{" "}
        <strong>CAA</strong> names which certificate authorities are allowed to
        issue certificates for the domain — a useful thing to set, and one almost
        nobody does.
      </p>
      <p>
        You can read any of these for a live domain with the{" "}
        <Link href="/developer/dns-lookup">DNS lookup tool</Link>.
      </p>

      <h2>The CNAME rule that catches everyone</h2>
      <p>
        A CNAME cannot coexist with any other record on the same name. That
        sounds like a technicality until you try to put one on your bare domain
        — <code>example.com</code> rather than <code>www.example.com</code> — and
        your provider refuses.
      </p>
      <p>
        The reason is that your bare domain <em>must</em> carry SOA and NS
        records, because it is the top of the zone. A CNAME there would conflict
        with both, so the standard forbids it.
      </p>
      <p>
        <strong>The workaround is provider-specific.</strong> Many DNS hosts
        offer ALIAS, ANAME, or &ldquo;CNAME flattening&rdquo;, which resolve the
        target behind the scenes and hand back a plain A record. If your host
        does not, you are stuck pointing the apex at an address directly.
      </p>

      <h2>TTL, and why changes are not instant</h2>
      <p>
        Every record carries a <strong>TTL</strong> — the number of seconds a
        resolver may cache the answer before asking again. A record with a TTL of
        3600 can be served from cache for an hour after you have changed it, by
        every resolver that happened to ask just before the edit.
      </p>
      <p>
        This is why DNS changes appear to roll out gradually and inconsistently:
        different resolvers cached at different moments, so they expire at
        different moments. Nothing is propagating anywhere. Caches are simply
        timing out one by one.
      </p>
      <p>
        <strong>The practical move is to lower the TTL before you need it.</strong>{" "}
        Drop it to 300 seconds a day ahead of a planned migration, make the
        change, then raise it again once things have settled. Lowering it at the
        same time as the change does nothing — the old TTL is already cached.
      </p>

      <h2>The email records, in one place</h2>
      <p>
        Three TXT records decide whether your mail is trusted, and they are
        easier to reason about as a set:
      </p>
      <p>
        <strong>SPF</strong> lists which servers may send mail as your domain. It
        lives on the domain itself and starts <code>v=spf1</code>. There must be
        exactly one — two SPF records is a misconfiguration, not twice the
        protection.
      </p>
      <p>
        <strong>DKIM</strong> publishes the public key used to sign your outgoing
        mail, so a receiver can verify the message was not altered. It lives on a
        subdomain like <code>selector._domainkey.example.com</code>, which means
        you have to query that exact name to see it.
      </p>
      <p>
        <strong>DMARC</strong> lives at <code>_dmarc.example.com</code> and tells
        receiving servers what to do when a message fails the other two — nothing,
        quarantine it, or reject it. Starting at <code>p=none</code> and reading
        the reports before tightening is the standard, and sensible, order.
      </p>

      <h2>When a site is reachable but wrong</h2>
      <p>
        If DNS resolves correctly and the site still misbehaves, the problem has
        usually moved up a layer. Two things are worth checking before anything
        else.
      </p>
      <p>
        The <Link href="/developer/http-header-checker">response headers and
        redirect chain</Link> will show whether requests are being bounced
        somewhere unexpected — an accidental loop, or a chain three hops longer
        than it needs to be, each hop a full round trip before anything renders.
        And if you are seeing an unfamiliar response code, the{" "}
        <Link href="/developer/http-status-codes">status code reference</Link>{" "}
        will tell you whether it is your problem or theirs.
      </p>
      <p>
        For the network layer itself, the{" "}
        <Link href="/developer/subnet-calculator">subnet calculator</Link> works
        out ranges and host counts from CIDR notation, and{" "}
        <Link href="/developer/what-is-my-ip">what is my IP</Link> tells you which
        address the internet currently sees you as — useful when a firewall rule
        or an allowlist is not behaving.
      </p>

      <h2>A short checklist</h2>
      <p>
        Before assuming DNS is broken: check the record actually exists at the
        name you think it does, remember that subdomains like{" "}
        <code>_dmarc</code> and <code>_domainkey</code> must be queried directly,
        confirm the TTL has had time to expire, and make sure you are not looking
        at a cached answer from your own machine. Most &ldquo;DNS is
        broken&rdquo; turns out to be one of those four.
      </p>
    </>
  );
}
