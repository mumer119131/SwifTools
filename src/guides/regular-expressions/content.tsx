import Link from "next/link";

export default function RegularExpressionsGuide() {
  return (
    <>
      <p>
        Regular expressions have a reputation for being unreadable, and the
        reputation is deserved for the elaborate ones. But almost every real use
        needs about a dozen pieces, and those dozen are worth knowing properly
        rather than pasting from an answer you do not understand.
      </p>

      <h2>The pieces that cover most of it</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-4 font-medium text-foreground">Pattern</th>
              <th className="py-2.5 pr-4 font-medium text-foreground">Matches</th>
              <th className="py-2.5 font-medium text-foreground">Example</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr><td className="font-mono text-foreground">.</td><td>Any single character</td><td className="font-mono">a.c → abc, a7c</td></tr>
            <tr><td className="font-mono text-foreground">\d \w \s</td><td>Digit, word character, whitespace</td><td className="font-mono">\d\d → 42</td></tr>
            <tr><td className="font-mono text-foreground">[abc]</td><td>Any one of these</td><td className="font-mono">[aeiou] → a vowel</td></tr>
            <tr><td className="font-mono text-foreground">[^abc]</td><td>Anything except these</td><td className="font-mono">[^0-9] → not a digit</td></tr>
            <tr><td className="font-mono text-foreground">*  +  ?</td><td>None or more, one or more, optional</td><td className="font-mono">colou?r → color, colour</td></tr>
            <tr><td className="font-mono text-foreground">{"{2,4}"}</td><td>Between two and four</td><td className="font-mono">\d{"{4}"} → a year</td></tr>
            <tr><td className="font-mono text-foreground">^  $</td><td>Start and end of the string</td><td className="font-mono">^abc$ → exactly abc</td></tr>
            <tr><td className="font-mono text-foreground">|</td><td>Either side</td><td className="font-mono">cat|dog</td></tr>
            <tr><td className="font-mono text-foreground">(…)</td><td>Group, and capture it</td><td className="font-mono">(\d+)-(\d+)</td></tr>
            <tr><td className="font-mono text-foreground">\b</td><td>A word boundary</td><td className="font-mono">\bcat\b → not concatenate</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        That is genuinely most of it. The capital versions of the shorthands
        invert them — <code>\D</code> is any non-digit, <code>\S</code> any
        non-whitespace — which is two more for free.
      </p>

      <h2>Greedy matching, the thing that surprises everyone</h2>
      <p>
        Quantifiers are <strong>greedy</strong>: they take as much as they can
        and only give back what they must. This is the single most common source
        of a regex that looks right and behaves wrongly.
      </p>
      <p>
        Given <code>{"<b>bold</b> and <i>italic</i>"}</code>, the pattern{" "}
        <code>{"<.*>"}</code> does not match <code>{"<b>"}</code>. It matches the
        entire string, from the first <code>&lt;</code> to the last{" "}
        <code>&gt;</code>, because <code>.*</code> grabs everything and then
        backtracks only far enough to find a final <code>&gt;</code>.
      </p>
      <p>
        Add <code>?</code> to make a quantifier <strong>lazy</strong> — it then
        takes as little as possible. <code>{"<.*?>"}</code> matches{" "}
        <code>{"<b>"}</code>, as intended.
      </p>
      <p>
        Often better still: stop it crossing the boundary at all.{" "}
        <code>{"<[^>]*>"}</code> says &ldquo;anything that is not a closing
        bracket&rdquo;, which cannot overshoot and does not need backtracking.
        That is faster and clearer than either.
      </p>

      <h2>Escaping</h2>
      <p>
        Characters with a special meaning need a backslash to match literally:{" "}
        <code>. * + ? ( ) [ ] {"{ }"} ^ $ | \</code>. A dot in a domain name is{" "}
        <code>\.</code>, not <code>.</code> — and <code>example.com</code> as a
        pattern will happily match <code>exampleXcom</code>.
      </p>
      <p>
        Inside a character class most of them lose their meaning, so{" "}
        <code>[.]</code> is just a dot. Three still matter there:{" "}
        <code>^</code> at the start negates, <code>-</code> between characters
        makes a range, and <code>]</code> ends the class.
      </p>

      <h2>Capture groups</h2>
      <p>
        Parentheses group, and they also capture what matched for later use.
        This is what makes find-and-replace powerful: match{" "}
        <code>(\w+)@(\w+)\.com</code> and you can refer back to the two halves as{" "}
        <code>$1</code> and <code>$2</code> in the replacement.
      </p>
      <p>
        If you only want grouping without capturing, use{" "}
        <code>(?:…)</code>. And in anything longer than one line, name them —{" "}
        <code>(?&lt;year&gt;\d{"{4}"})</code> reads far better than counting
        brackets to work out which group is which.
      </p>

      <h2>Flags change everything</h2>
      <ul>
        <li><strong><code>g</code></strong> — find every match, not just the first.</li>
        <li><strong><code>i</code></strong> — ignore case.</li>
        <li>
          <strong><code>m</code></strong> — make <code>^</code> and{" "}
          <code>$</code> match at each line rather than only the whole string.
        </li>
        <li>
          <strong><code>s</code></strong> — let <code>.</code> match newlines,
          which it does not by default. This one catches people out on
          multi-line input constantly.
        </li>
      </ul>

      <h2>When not to use a regex</h2>
      <p>
        This matters more than any pattern here.
      </p>
      <ul>
        <li>
          <strong>HTML and XML.</strong> They nest arbitrarily and regexes cannot
          count nesting. Use a parser. Every &ldquo;it works for my case&rdquo;
          version breaks on an attribute containing a bracket.
        </li>
        <li>
          <strong>Validating email addresses.</strong> The real specification
          permits things no one expects, and the patterns people paste reject
          valid addresses. Check for an <code>@</code> with something either
          side, then send a confirmation email — that is the only test that
          proves anything anyway.
        </li>
        <li>
          <strong>Anything a plain string function does.</strong>{" "}
          <code>includes</code>, <code>startsWith</code> and <code>split</code>{" "}
          are clearer and faster.
        </li>
        <li>
          <strong>Structured formats with a parser.</strong> JSON, CSV, dates —
          use the parser. It handles the quoting and escaping you will get wrong.
        </li>
      </ul>

      <h3>One performance trap worth knowing</h3>
      <p>
        Nested quantifiers over overlapping patterns —{" "}
        <code>(a+)+$</code> is the classic — can take exponential time on input
        that nearly matches. On a server handling user input that is a denial of
        service, and it has taken down real sites. If a pattern has a quantifier
        inside a group that is itself quantified, look at it again.
      </p>

      <h2>Build them piece by piece</h2>
      <p>
        Nobody writes a working regex in one go. Start with the simplest thing
        that matches one example, then widen it until it covers the rest, testing
        against real input at every step — including the input that should{" "}
        <em>not</em> match, which is the half people skip.
      </p>
      <p>
        <Link href="/developer/regex-tester">The regex tester</Link> highlights
        matches and capture groups live as you type. For the jobs that do not
        need a regex at all, there is{" "}
        <Link href="/text/find-and-replace">find and replace</Link>,{" "}
        <Link href="/text/extract-from-text">extract emails and URLs from
        text</Link>, and <Link href="/text/sort-lines">sort lines</Link>.
      </p>
    </>
  );
}
