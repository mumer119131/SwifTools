import Link from "next/link";

export default function DataFormatsGuide() {
  return (
    <>
      <p>
        JSON, YAML and CSV all store structured data as text, and they are not
        interchangeable. Each was designed around a different priority, and
        picking the wrong one usually shows up later as a class of bug that the
        right one would have made impossible.
      </p>
      <p>
        The short version: <strong>JSON</strong> for anything a machine writes
        and another machine reads, <strong>YAML</strong> for anything a human has
        to edit by hand, and <strong>CSV</strong> only for flat tables of rows.
      </p>

      <h2>JSON is strict on purpose</h2>
      <p>
        JSON&rsquo;s value is that it barely has any features. Objects, arrays,
        strings, numbers, booleans and null — that is the whole format. There is
        nothing to configure and very little to disagree about, which is why it
        won.
      </p>
      <p>Four rules trip people up, and all four are deliberate:</p>
      <p>
        <strong>No trailing commas.</strong>{" "}
        <code>{"[1, 2, 3,]"}</code> is invalid. Most languages allow it; JSON does
        not.
      </p>
      <p>
        <strong>Double quotes only</strong>, on both strings and keys.{" "}
        <code>{"{'a': 1}"}</code> is not JSON.
      </p>
      <p>
        <strong>No comments.</strong> This one is genuinely inconvenient, and it
        is the single most common reason a config file that started as JSON ends
        up as YAML.
      </p>
      <p>
        <strong>No <code>NaN</code> or <code>Infinity</code>.</strong> They are
        not representable, so serialisers either error or quietly turn them into{" "}
        <code>null</code>.
      </p>
      <p>
        When a file will not parse, it is almost always one of those. The{" "}
        <Link href="/developer/json-formatter">JSON formatter</Link> will point at
        the offending character, and the{" "}
        <Link href="/developer/json-tree-viewer">tree viewer</Link> is the faster
        way to find your way around a large response once it is valid.
      </p>

      <h3>The number problem nobody warns you about</h3>
      <p>
        JSON numbers have no declared precision, and most parsers read them as
        64-bit floats. That is fine until a value exceeds about 9 quadrillion —
        roughly 2<sup>53</sup> — at which point it starts silently losing
        accuracy.
      </p>
      <p>
        This is not hypothetical. Large database IDs, Twitter-style snowflake
        IDs, and anything counting nanoseconds all land in that range, and the
        failure is quiet: the ID comes back off by one and nothing errors.{" "}
        <strong>The fix is to send large identifiers as strings.</strong>
      </p>

      <h2>YAML is for humans, and that costs something</h2>
      <p>
        YAML exists because editing JSON by hand is unpleasant. It has comments,
        does not need quotes or braces, and uses indentation for structure — all
        of which make a config file far more readable.
      </p>
      <p>
        The cost is that YAML is a much larger specification with room for
        surprises. Two are worth knowing about.
      </p>
      <p>
        <strong>Indentation must be spaces.</strong> Tabs are forbidden outright,
        and since a tab and some spaces look identical, this produces errors that
        are invisible on screen.
      </p>
      <p>
        <strong>Unquoted values get interpreted.</strong> In older YAML versions{" "}
        <code>no</code> parses as boolean false — which famously turned the
        country code for Norway into <code>false</code> — and{" "}
        <code>1.20</code> becomes the number 1.2, dropping the trailing zero. A
        version number like <code>1.10</code> becomes 1.1, which is a different
        version. <strong>Quote anything that is meant to stay a string.</strong>
      </p>
      <p>
        Because YAML is a superset of JSON, any valid JSON is already valid YAML.
        Converting <Link href="/developer/yaml-to-json">between the two</Link> is
        mostly lossless in that direction; going back loses comments, since JSON
        cannot represent them.
      </p>

      <h2>CSV is simpler than it looks, and messier</h2>
      <p>
        CSV is rows of values separated by commas. There is no schema, no types,
        and no nesting — everything is text, and the reader decides what it
        means.
      </p>
      <p>
        The messiness comes from values containing the separator. The convention
        is to wrap those in double quotes, and to escape a literal quote by
        doubling it, so a field containing <code>He said &quot;hi&quot;</code>{" "}
        is written <code>&quot;He said &quot;&quot;hi&quot;&quot;&quot;</code>.
        Hand-rolled parsers that split on commas break the first time they meet
        a quoted field, which is why using a real parser matters more here than
        the format&rsquo;s simplicity suggests.
      </p>
      <p>
        The other hazard is spreadsheet software, which will helpfully reformat
        your data on open. Leading zeros disappear from postcodes and product
        codes, long numbers become scientific notation, and anything that looks
        remotely like a date becomes one. If a CSV is going to be opened in
        Excel, that is a property of the file you have to design around.
      </p>
      <p>
        For moving a table into something structured, the{" "}
        <Link href="/developer/csv-to-json">CSV to JSON converter</Link> handles
        the quoting rules properly and goes in both directions.
      </p>

      <h2>Choosing between them</h2>
      <p>
        Use <strong>JSON</strong> for APIs and anything machine-generated. It is
        universally supported, unambiguous, and its strictness is what makes it
        safe to pass between systems that know nothing about each other.
      </p>
      <p>
        Use <strong>YAML</strong> for configuration a person maintains, where
        comments and readability are worth the extra footguns. This is why CI
        pipelines and container orchestration settled on it.
      </p>
      <p>
        Use <strong>CSV</strong> for flat tabular data that has to open in a
        spreadsheet. The moment your data has nesting or optional fields, it is
        the wrong format and forcing it will hurt.
      </p>

      <h2>Working with them day to day</h2>
      <p>
        Two jobs come up constantly. Comparing two responses to find what
        changed is far easier with a{" "}
        <Link href="/developer/json-diff">structural diff</Link> than a text one,
        because key order does not matter in JSON but does to a line-based diff.
      </p>
      <p>
        And if you are consuming an API in a typed language, generating{" "}
        <Link href="/developer/json-to-typescript">types from a sample
        response</Link> is quicker than writing them out and much less likely to
        drift from what the server actually sends.
      </p>
      <p>
        For the other text format that shows up in the same work,{" "}
        <Link href="/developer/sql-formatter">formatting a SQL query</Link> makes
        the structure of a long statement visible in a way that a single-line
        query never is.
      </p>
    </>
  );
}
