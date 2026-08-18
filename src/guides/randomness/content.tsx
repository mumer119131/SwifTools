import Link from "next/link";

export default function RandomnessGuide() {
  return (
    <>
      <p>
        A computer cannot flip a coin. It follows instructions, and instructions
        are the opposite of chance — so every random number a machine produces is
        either calculated from a starting value, or measured from something
        physical it does not control. Which of the two you get changes what the
        result is safe to be used for.
      </p>

      <h2>Pseudorandom: a very long, very convincing sequence</h2>
      <p>
        Most randomness in software is <strong>pseudorandom</strong>. A
        generator starts from a seed and applies arithmetic to produce the next
        number, then the next. The sequence passes statistical tests for
        randomness, has no visible pattern, and will not repeat for an
        astronomically long time.
      </p>
      <p>
        But it is entirely determined. Same seed, same sequence, every time —
        which is a feature as often as a flaw. Procedural game worlds, shuffled
        playlists you can reproduce, simulations you need to run twice with
        identical inputs: all of those want a seed you can write down.
      </p>
      <p>
        The catch is that anyone who learns the seed knows every number that
        follows. That is fine for a dice roll and fatal for a password.
      </p>

      <h3>Math.random is not for anything that matters</h3>
      <p>
        JavaScript&rsquo;s <code>Math.random()</code> is pseudorandom, seeded by
        the browser in a way the specification deliberately does not pin down. It
        makes no security guarantee at all, and browsers say so. It is the right
        tool for animating something, and the wrong tool for anything a person
        might act on.
      </p>

      <h2>Cryptographic randomness</h2>
      <p>
        Browsers also expose <code>crypto.getRandomValues()</code>, which draws
        from the operating system&rsquo;s entropy pool — timing jitter, hardware
        noise, interrupt patterns. The output is not predictable even to someone
        who knows everything about the program that requested it.
      </p>
      <p>
        It is slower, which almost never matters. Every randomiser on this site
        uses it, including the{" "}
        <Link href="/fun/coin-flipper">coin flipper</Link> and the{" "}
        <Link href="/fun/dice-roller">dice roller</Link> — not because a coin
        flip needs cryptographic security, but because there is no reason to have
        two implementations when the good one is fast enough.
      </p>

      <h2>The bias almost every implementation has</h2>
      <p>
        Here is the part that catches people, and it is subtle enough that most
        online randomisers get it wrong.
      </p>
      <p>
        Suppose you want a number from 1 to 6 and you have a source of random
        bytes, each 0–255. The obvious approach is a remainder:
      </p>
      <p>
        <code>roll = (byte % 6) + 1</code>
      </p>
      <p>
        That looks fine and is not. 256 does not divide by 6 — it goes 42 times
        with 4 left over. Bytes 0 to 251 spread evenly across the six outcomes,
        but the leftovers 252, 253, 254 and 255 map to results 1, 2, 3 and 4.
        Those four outcomes come up 43 times per 256 and the other two come up
        42. <strong>Results 1 to 4 are about 2.4% more likely than 5 and 6.</strong>
      </p>
      <p>
        This is called <strong>modulo bias</strong>. It is invisible in casual
        use — you would need thousands of rolls to notice — and it is real. The
        fix is to reject the leftovers: if the byte lands in the uneven tail,
        throw it away and draw another. It costs a negligible number of extra
        draws and makes every outcome exactly equally likely.
      </p>
      <p>
        That is what the tools here do. It is worth knowing because &ldquo;pick a
        random winner&rdquo; is a real use, and a subtly loaded draw is worse than
        an obviously broken one.
      </p>

      <h2>Shuffling is where it goes wrong most often</h2>
      <p>
        The naive shuffle — walk the list and swap each item with any random
        position — looks correct and is not uniform. Some orderings come out more
        often than others, for the same reason as above: the number of ways the
        algorithm can run is not divisible by the number of possible orderings.
      </p>
      <p>
        The correct one is the <strong>Fisher–Yates shuffle</strong>: walk from
        the end, and swap each item with a random position at or before it. One
        pass, every ordering equally likely. The difference between the two is a
        single character in the range, which is why the broken version is so
        common.
      </p>
      <p>
        <Link href="/fun/list-randomizer">Shuffling a list</Link> and{" "}
        <Link href="/fun/random-name-picker">picking a name</Link> both use it.
      </p>

      <h2>When none of this matters, and when it very much does</h2>
      <ul>
        <li>
          <strong>Doesn&rsquo;t matter:</strong> deciding where to eat, a{" "}
          <Link href="/fun/wheel-spinner">wheel spin</Link> among friends,
          randomising a quiz. A slightly biased die is still a fine way to settle
          an argument.
        </li>
        <li>
          <strong>Matters:</strong> anything with a prize attached, anything
          people will contest, and above all{" "}
          <Link href="/generator/password-generator">generating a password</Link>{" "}
          or a key. A predictable password generator is not a weak password
          generator, it is no password generator at all.
        </li>
      </ul>

      <h2>Two things about randomness that are not intuitive</h2>
      <h3>Randomness clumps</h3>
      <p>
        Genuinely random sequences contain runs. Twenty coin flips will very
        often include a streak of four or five heads, and people reading that
        assume the generator is broken. A sequence that looks evenly spread — no
        long runs, no repeats — is usually the one that has been tampered with.
        Music streaming services learned this and now deliberately make shuffle
        <em>less</em> random, because true shuffle plays the same artist twice in
        a row and listeners complain.
      </p>
      <h3>The previous result changes nothing</h3>
      <p>
        After four heads, the next flip is still 50/50. The coin has no memory,
        and neither does the generator. The belief that a run is &ldquo;due&rdquo;
        to break is the gambler&rsquo;s fallacy, and it is remarkably persistent
        even among people who can state why it is wrong.
      </p>

      <h2>Everything here runs in your browser</h2>
      <p>
        The numbers are drawn on your own machine and never sent anywhere, which
        also means nobody — including this site — could bias a draw in your
        favour or against it even if they wanted to. For a prize draw, that is
        worth more than any assurance.
      </p>
    </>
  );
}
