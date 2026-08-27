import Link from "next/link";

export default function FormattingAndMinifyingGuide() {
  return (
    <>
      <p>
        Formatting and minifying are the same operation pointed in opposite
        directions. One rewrites code so a person can read it; the other strips
        everything a person needed and leaves only what the machine requires.
        Neither changes what the code does.
      </p>
      <p>
        That last point is what makes both safe, and it is worth stating plainly:
        a formatter and a minifier both parse your code into a syntax tree and
        print it back out. They are not editing text with clever find-and-replace.
      </p>

      <h2>Formatting is about ending the argument</h2>
      <p>
        The practical value of a formatter is not that its output is beautiful.
        It is that the output is <strong>deterministic</strong> — the same input
        always produces the same result, so nobody has to have an opinion about
        it.
      </p>
      <p>
        A team that runs a formatter stops reviewing indentation and starts
        reviewing logic. Diffs stop containing whitespace churn. The style
        question is settled once, by a tool, rather than repeatedly, by people.
      </p>
      <p>
        Because it reprints from the parsed structure rather than nudging text
        around, a formatter also doubles as a syntax check: code that will not
        parse will not format. That is why{" "}
        <Link href="/developer/json-formatter">formatting JSON</Link> is the
        fastest way to find the trailing comma in a 4,000-line file — the
        formatter stops exactly where the structure breaks.
      </p>
      <p>
        The same applies across languages:{" "}
        <Link href="/developer/js-formatter">JavaScript and TypeScript</Link>,{" "}
        <Link href="/developer/css-formatter">CSS</Link>,{" "}
        <Link href="/developer/html-formatter">HTML</Link> and{" "}
        <Link href="/developer/sql-formatter">SQL</Link> all benefit, though SQL
        benefits most dramatically — a long query written as one line is nearly
        unreadable, and the same query with its clauses broken out is obvious.
      </p>

      <h2>Minifying is about bytes on the wire</h2>
      <p>
        A minifier removes what the browser does not need: whitespace, comments,
        and any structure that exists purely for human benefit. For JavaScript it
        goes further, renaming local variables to single letters and dropping
        code it can prove is unreachable.
      </p>
      <p>
        Typical savings are substantial — often 30 to 60% before compression for
        JavaScript, less for CSS, which has less redundancy to remove. On a page
        loading several hundred kilobytes of script, that is the difference
        between a fast first render and a slow one.
      </p>
      <p>
        Worth knowing:{" "}
        <strong>minification and gzip are not redundant.</strong> They compound.
        Minifying shortens the actual symbols; gzip then compresses the repeated
        patterns in what remains. Doing both beats doing either.
      </p>
      <p>
        <Link href="/developer/js-minifier">Minifying JavaScript</Link> and{" "}
        <Link href="/developer/css-minifier">minifying CSS</Link> are the two
        that matter most, because they are what a browser must download and parse
        before the page becomes usable.
      </p>

      <h3>Why variable renaming is safe, and where it stops</h3>
      <p>
        Renaming <code>userAccountBalance</code> to <code>a</code> sounds
        dangerous and is not, because a minifier only renames names it can see
        the full scope of. A local variable inside a function is invisible from
        outside, so shortening it cannot break anything.
      </p>
      <p>
        What it will not touch is anything reachable from elsewhere: exported
        names, object properties accessed as strings, and globals. This is also
        the failure mode to know about — code that looks up a property
        dynamically, like <code>obj[someString]</code>, can break under
        aggressive settings, because the minifier cannot see the connection.
      </p>

      <h2>Source maps put the readable version back</h2>
      <p>
        Debugging minified code would be miserable, and you do not have to. A
        <strong> source map</strong> is a separate file recording which position
        in the minified output corresponds to which line of the original.
      </p>
      <p>
        With one present, browser dev tools show you the original code while
        running the minified version. Breakpoints land on real lines, and stack
        traces name real functions. It costs nothing at runtime, because the map
        is only fetched when dev tools are open.
      </p>

      <h2>Which to use when</h2>
      <p>
        The rule is simply which audience the code is for.
      </p>
      <p>
        <strong>Format</strong> everything you commit. Source control should hold
        readable code, and the formatter should run automatically so nobody has
        to remember.
      </p>
      <p>
        <strong>Minify</strong> only what ships to a browser, and only as a build
        step. Minified code should never be what you edit or commit — it is
        output, and it is regenerated every build.
      </p>
      <p>
        For anything else — a config file, a query you are debugging, an API
        response you are reading — formatting is the only one you want. Nothing
        is being downloaded, so the bytes do not matter and the readability does.
      </p>
    </>
  );
}
