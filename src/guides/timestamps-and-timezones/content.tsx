import Link from "next/link";

export default function TimestampsAndTimezonesGuide() {
  return (
    <>
      <p>
        Dates are the subject where confident developers ship confident bugs.
        Nearly all of them come from one mistake made in four different places:
        treating a moment in time and a reading on a clock as the same thing.
      </p>

      <h2>What a Unix timestamp actually is</h2>
      <p>
        A count of seconds since <strong>1 January 1970, 00:00:00 UTC</strong>.
        That is all. It has no timezone, because it is not a clock reading — it
        is a distance from a fixed point, the same number everywhere on Earth at
        the same instant.
      </p>
      <p>
        <code>1755475200</code> is a moment. What clock face that moment
        corresponds to depends entirely on where you are standing, and the
        timestamp neither knows nor cares.
      </p>
      <p>
        Two things routinely trip people up:
      </p>
      <ul>
        <li>
          <strong>Seconds or milliseconds.</strong> Unix time is seconds;
          JavaScript&rsquo;s <code>Date.now()</code> is milliseconds. Mixing them
          puts you in 1970 or in the year 57000, which is at least an obvious
          failure. <Link href="/converter/unix-timestamp-converter">The
          converter</Link> takes either and says which it read.
        </li>
        <li>
          <strong>Leap seconds are ignored.</strong> Unix time pretends every day
          has exactly 86,400 seconds. It is a count of an idealised day, not of
          actual elapsed seconds, which is fine for everything except precision
          timing.
        </li>
      </ul>

      <h2>UTC is not a timezone</h2>
      <p>
        UTC is the reference all timezones are offsets from. It never changes and
        has no daylight saving. GMT is, for everyday purposes, the same thing —
        with the awkward difference that the UK uses GMT in winter and BST in
        summer, so &ldquo;GMT&rdquo; in a British context sometimes means
        &ldquo;local time&rdquo; and sometimes means UTC.
      </p>
      <p>
        Which is why <strong>+00:00 is a better thing to write than
        &ldquo;GMT&rdquo;</strong> in anything a machine will read.
      </p>

      <h2>The rule that prevents most date bugs</h2>
      <p>
        <strong>Store the moment. Convert on display.</strong>
      </p>
      <p>
        Keep timestamps in UTC — as a Unix number or an ISO string with an
        offset — everywhere in your database, your logs and your APIs. Convert to
        the viewer&rsquo;s local time only when you render it, and never store
        the converted value.
      </p>
      <p>
        The moment a local time is stored without its offset, the information
        needed to interpret it is gone for good. &ldquo;14:00&rdquo; is not a
        time; it is a time in some timezone nobody wrote down.
      </p>

      <h3>ISO 8601, and the one detail that matters</h3>
      <p>
        <code>2026-08-18T14:30:00Z</code> — year, month, day, then time, with a
        trailing <code>Z</code> meaning UTC. Or an explicit offset:{" "}
        <code>2026-08-18T14:30:00+05:00</code>.
      </p>
      <p>
        The detail: a string with <em>no</em> offset —{" "}
        <code>2026-08-18T14:30:00</code> — is ambiguous, and different languages
        resolve it differently. Some assume UTC, some assume local. Always
        include the offset.
      </p>
      <p>
        It also sorts correctly as plain text, which is why it is the right
        format for filenames and log lines.
      </p>

      <h2>Four bugs everyone ships once</h2>

      <h3>The off-by-an-hour that appears in spring</h3>
      <p>
        Code that adds 86,400 seconds to get &ldquo;tomorrow&rdquo; is right 363
        days a year. On the two days a region changes its clocks, a day is 23 or
        25 hours long, and the result lands an hour out. Add one <em>day</em>{" "}
        using a date library, not 24 hours using arithmetic.
      </p>

      <h3>Times that do not exist, and times that happen twice</h3>
      <p>
        When clocks go forward, an hour is skipped — in the UK, 01:30 on that
        morning simply never occurs. When they go back, 01:30 happens twice.
        Scheduling anything in that window is genuinely ambiguous, and a recurring
        job set for 01:30 will either be skipped or run twice a year.
      </p>
      <p>
        This is the commonest cause of a cron job firing at an unexpected time.
        The <Link href="/developer/cron-expression-builder">cron builder</Link>{" "}
        shows the next runs in your own timezone precisely so the mismatch with a
        UTC server is visible.
      </p>

      <h3>Offsets are not fixed</h3>
      <p>
        A timezone is not an offset — it is a set of rules about which offset
        applies when, and governments change those rules with little notice.
        Storing &ldquo;+05:30&rdquo; records what the offset was; storing{" "}
        <code>Asia/Kolkata</code> records the rule, which is what you want for
        anything in the future. This is why recurring calendar events need a
        named zone rather than a number.
      </p>

      <h3>The date changes before the day does</h3>
      <p>
        A user in Auckland and one in Los Angeles are on different calendar dates
        for most of the day. &ldquo;Today&rsquo;s orders&rdquo; means two
        different sets of rows depending on whose midnight you use — and a daily
        report that runs in UTC will look wrong to everyone not in UTC. Decide
        whose day you mean and write it down.
      </p>

      <h2>When a local time is the right thing to store</h2>
      <p>
        Occasionally the clock reading genuinely is the fact. A shop opens at
        09:00 local time whatever the offset that week; a birthday is a date, not
        a moment; an alarm for 07:00 should ring at 07:00 wherever you have
        flown to.
      </p>
      <p>
        For those, store the local value and the rule — never a converted UTC
        instant, which will drift the moment the rules change or the user moves.
        Recognising which kind you have is most of the skill.
      </p>

      <h2>2038</h2>
      <p>
        A 32-bit signed timestamp runs out on 19 January 2038 and wraps to 1901.
        Modern systems use 64-bit values and are fine for longer than the sun
        will last, but 32-bit fields survive in embedded devices, old file
        formats and database columns nobody has looked at. Worth checking if you
        maintain anything of that age.
      </p>

      <h2>Converting</h2>
      <p>
        <Link href="/converter/unix-timestamp-converter">Timestamp
        converter</Link> for reading an epoch value both ways,{" "}
        <Link href="/converter/timezone-converter">timezone converter</Link> for
        seeing one moment across several zones, and{" "}
        <Link href="/calculator/date-difference-calculator">date
        difference</Link> for counting days, weeks and working days between two
        dates.
      </p>
    </>
  );
}
