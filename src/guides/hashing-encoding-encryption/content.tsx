import Link from "next/link";

export default function HashingEncodingEncryptionGuide() {
  return (
    <>
      <p>
        These three get used interchangeably in conversation and they are not
        remotely the same thing. The confusion is not academic: it is how
        credentials end up sitting in plain sight in a config file, and how
        password databases end up crackable in an afternoon.
      </p>

      <h2>The distinction in one table</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-4 font-medium text-foreground" />
              <th className="py-2.5 pr-4 font-medium text-foreground">Reversible?</th>
              <th className="py-2.5 pr-4 font-medium text-foreground">Needs a key?</th>
              <th className="py-2.5 font-medium text-foreground">For</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr>
              <td className="font-medium text-foreground">Encoding</td>
              <td>Yes, by anyone</td>
              <td>No</td>
              <td>Making data survive transport</td>
            </tr>
            <tr>
              <td className="font-medium text-foreground">Hashing</td>
              <td>No, ever</td>
              <td>No</td>
              <td>Proving something is unchanged</td>
            </tr>
            <tr>
              <td className="font-medium text-foreground">Encryption</td>
              <td>Yes, with the key</td>
              <td>Yes</td>
              <td>Keeping something secret</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read the first column and you have most of it. Only encryption keeps a
        secret. Encoding keeps none, and hashing does not keep the data at all.
      </p>

      <h2>Encoding: not security, at all</h2>
      <p>
        Encoding rewrites data into a different alphabet so it can travel
        somewhere that would otherwise mangle it. Base64 exists because email and
        URLs were built for text, and raw binary put through them arrives
        corrupted — so the bytes are re-expressed using 64 safe characters.
      </p>
      <p>
        There is no key and no secret. <code>cGFzc3dvcmQxMjM=</code> looks
        scrambled and takes about one second to turn back into{" "}
        <code>password123</code>. Anyone can do it; that is the whole design.
      </p>
      <p>
        <strong>Base64 is not encryption.</strong> If you find credentials
        &ldquo;protected&rdquo; by Base64 in a config file or a request header,
        they are stored in plain text with extra steps. This is a genuinely
        common and genuinely serious mistake.
      </p>
      <p>
        Useful for: embedding a small image in CSS, putting binary in JSON,{" "}
        <Link href="/developer/base64-encode-decode">inspecting a payload</Link>.
        Never for: keeping anything private.
      </p>

      <h3>JWTs catch people out for exactly this reason</h3>
      <p>
        A JSON Web Token looks encrypted. It is not — the standard ones are
        Base64-encoded JSON with a signature attached. Anyone holding the token
        can read every claim inside it, which you can confirm by{" "}
        <Link href="/developer/jwt-decoder">decoding one</Link> without supplying
        any key at all.
      </p>
      <p>
        The signature stops it being <em>modified</em>, not <em>read</em>. Never
        put anything in a JWT you would not hand to the bearer.
      </p>

      <h2>Hashing: a one-way fingerprint</h2>
      <p>
        A hash function takes any input and produces a fixed-length string. The
        same input always gives the same output; changing a single character
        changes the output completely. Crucially, <strong>there is no way
        back</strong> — the original is not in there to recover.
      </p>
      <p>That one-way property is what makes it useful:</p>
      <ul>
        <li>
          <strong>Verifying a download.</strong> Hash the file you received and
          compare with the publisher&rsquo;s. Match means byte-identical.
        </li>
        <li>
          <strong>Storing passwords.</strong> A service stores the hash, not the
          password. At login it hashes what you typed and compares. A stolen
          database yields hashes, not passwords.
        </li>
        <li>
          <strong>Detecting change.</strong> Deduplication, caching, integrity
          checks.
        </li>
      </ul>

      <h3>&ldquo;Decrypt this hash&rdquo; is not a thing</h3>
      <p>
        You cannot. A hash of a 5GB file is 64 characters — the information is
        not compressed, it is discarded. What sites offering to &ldquo;reverse a
        hash&rdquo; actually do is look it up in a table of pre-computed hashes
        of common inputs. If your password is in that table, they find it. That
        is a dictionary attack, not decryption, and it is exactly why password
        hashing needs a salt.
      </p>

      <h3>Which hash to use</h3>
      <ul>
        <li>
          <strong>MD5</strong> — broken for security. Collisions can be produced
          deliberately, so it proves nothing about authenticity. Fine as a
          checksum against accidental corruption, and still widely used for that.
        </li>
        <li>
          <strong>SHA-1</strong> — also broken, demonstrated in practice. Do not
          choose it for anything new.
        </li>
        <li>
          <strong><Link href="/developer/sha256-hash-generator">SHA-256</Link></strong>{" "}
          — the sensible default for integrity and signatures.
        </li>
        <li>
          <strong>bcrypt, scrypt, Argon2</strong> — for passwords, and only these.
          They are deliberately <em>slow</em>, which is the point: SHA-256 is fast
          enough to try billions of guesses per second, and these are not.
        </li>
      </ul>
      <p>
        That last one is the mistake worth avoiding. Hashing passwords with
        SHA-256 is better than plain text and much worse than bcrypt, because the
        speed that makes SHA-256 good at checksums makes it bad at resisting
        guessing.
      </p>

      <h2>Encryption: the only one that keeps a secret</h2>
      <p>
        Encryption transforms data so it can be transformed back — but only by
        someone holding the key. It is the only one of the three that actually
        protects confidentiality.
      </p>
      <ul>
        <li>
          <strong>Symmetric</strong> (AES) — one key both encrypts and decrypts.
          Fast; the difficulty is getting the key to the other party.
        </li>
        <li>
          <strong>Asymmetric</strong> (RSA, elliptic curve) — a public key
          encrypts, a private key decrypts. Slower, and solves the key-sharing
          problem. HTTPS uses asymmetric to agree a symmetric key, then switches.
        </li>
      </ul>
      <p>
        The security is entirely in the key, never in the algorithm. Good
        algorithms are public and heavily studied; an algorithm kept secret
        because it would not survive inspection is the classic warning sign.
      </p>

      <h2>Where signing fits</h2>
      <p>
        <Link href="/developer/hmac-generator">HMAC</Link> is hashing plus a key,
        which answers a question a plain hash cannot: not only &ldquo;is this
        unchanged&rdquo; but &ldquo;was it written by someone holding the
        secret&rdquo;. It is what webhook providers use to sign payloads.
      </p>
      <p>
        Note that HMAC is not simply <code>hash(key + message)</code>. That
        construction is vulnerable to length-extension attacks, where someone who
        never sees the key can still append to the message and produce a valid
        digest. HMAC&rsquo;s nested design exists specifically to prevent it —
        which is a good illustration of why you use the standard primitive rather
        than assembling your own.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>Anyone can decode encoding. It protects nothing.</li>
        <li>Nobody can reverse hashing. It proves sameness, it does not store data.</li>
        <li>Only the key-holder can decrypt encryption. It is the only one that hides anything.</li>
        <li>Hash passwords with bcrypt or Argon2, never SHA-256, never MD5.</li>
        <li>Assume anything in a JWT is public.</li>
      </ul>
    </>
  );
}
