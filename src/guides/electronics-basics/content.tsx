import Link from "next/link";

export default function ElectronicsBasicsGuide() {
  return (
    <>
      <p>
        Most of a beginner circuit is one equation and a handful of consequences.
        Learn what the three quantities mean physically rather than as letters,
        and the rest follows — including why the LED you wired straight to a
        battery lasted about a second.
      </p>

      <h2>Ohm&rsquo;s law, and what the letters actually are</h2>
      <p>
        <strong>V = I × R.</strong> Voltage equals current times resistance. The
        water analogy is imperfect but genuinely useful:
      </p>
      <ul>
        <li>
          <strong>Voltage (V, volts)</strong> — the pressure pushing charge
          along. A battery is a pump. Voltage is measured <em>across</em> two
          points, never at one.
        </li>
        <li>
          <strong>Current (I, amps)</strong> — how much charge is actually
          flowing. Measured <em>through</em> a point.
        </li>
        <li>
          <strong>Resistance (R, ohms)</strong> — how much the path fights the
          flow. A narrow pipe.
        </li>
      </ul>
      <p>
        Rearranged: <code>I = V / R</code> and <code>R = V / I</code>. Nearly
        every beginner question is one of those three, and the{" "}
        <Link href="/science/ohms-law-calculator">Ohm&rsquo;s law calculator</Link>{" "}
        solves for whichever you are missing.
      </p>
      <p>
        Power matters too: <strong>P = V × I</strong>, in watts. This is what
        decides whether a component gets warm or gets destroyed, and it is the
        figure people forget to check. A resistor with the right resistance and
        the wrong power rating will still burn.
      </p>

      <h2>Why an LED needs a resistor</h2>
      <p>
        An LED is not a resistor. It does not obey Ohm&rsquo;s law — below its
        forward voltage almost no current flows, and above it the current rises
        almost vertically. There is no self-limiting behaviour at all.
      </p>
      <p>
        Connect a 2 V LED directly to a 5 V supply and the circuit has nothing
        left to drop the extra 3 V across. Current runs away, the junction
        overheats, and the LED fails — sometimes instantly, sometimes after
        minutes of looking fine, which is worse because it seems to have worked.
      </p>
      <p>
        The resistor absorbs the difference. Size it like this:
      </p>
      <p>
        <code>R = (supply voltage − LED forward voltage) / desired current</code>
      </p>
      <p>
        For a red LED (about 2 V, 20 mA) on 5 V:{" "}
        <code>(5 − 2) / 0.02 = 150 Ω</code>. The next standard value up is 150 Ω
        or 220 Ω — <strong>always round up</strong>, since a larger resistor
        means slightly less current and a slightly dimmer LED, while rounding
        down means more current than intended.
      </p>
      <p>
        Forward voltage varies by colour, which surprises people: red and yellow
        sit near 2 V, blue and white nearer 3 to 3.4 V. Swapping a red LED for a
        blue one without recalculating gives a noticeably dim result.{" "}
        <Link href="/science/led-resistor-calculator">The LED resistor
        calculator</Link> has the usual figures built in.
      </p>

      <h2>Reading a resistor</h2>
      <p>
        The bands encode the value. On a four-band resistor: the first two are
        digits, the third is how many zeros to add, and the fourth — separated by
        a gap, usually gold or silver — is the tolerance.
      </p>
      <p>
        Brown, black, red, gold is 1, 0, then two zeros: 1000 Ω, or 1 kΩ, ±5%.
        Five-band resistors add a third digit for precision parts.
      </p>
      <p>
        Two practical notes. Read from the end <em>away</em> from the tolerance
        band, or you will read the value backwards — and brown/red/orange are
        genuinely hard to tell apart under warm light, so check with a meter when
        it matters.{" "}
        <Link href="/science/resistor-color-code-calculator">The colour code
        calculator</Link> works in both directions.
      </p>

      <h2>Voltage dividers</h2>
      <p>
        Two resistors in series split the voltage between them in proportion to
        their resistance. Tap the junction and you get a fraction of the input:
      </p>
      <p>
        <code>V_out = V_in × R2 / (R1 + R2)</code>
      </p>
      <p>
        Two equal resistors give you half the input. This is how a sensor reading
        gets scaled into a range a microcontroller can read.
      </p>
      <p>
        The trap: <strong>a divider is not a power supply.</strong> As soon as
        you draw meaningful current from the tap, the output voltage sags,
        because the load is effectively a third resistor in the network. Dividers
        are for signals and references, not for powering anything.{" "}
        <Link href="/science/voltage-divider-calculator">The divider
        calculator</Link> works out the ratio and the resistor pair.
      </p>

      <h2>Series and parallel, in one line each</h2>
      <ul>
        <li>
          <strong>Resistors in series add.</strong> Same current through each,
          voltage splits between them.
        </li>
        <li>
          <strong>In parallel the total is smaller than the smallest.</strong>{" "}
          Same voltage across each, current splits. Two equal resistors in
          parallel give half the value.
        </li>
        <li>
          <strong>Capacitors do the opposite</strong> — parallel adds, series
          reduces. This catches out anyone who learned resistors first.
        </li>
      </ul>

      <h2>Capacitors, briefly</h2>
      <p>
        A capacitor stores charge and resists <em>changes</em> in voltage. Two
        jobs cover most beginner use: smoothing a supply that dips when something
        switches on, and setting a time constant with a resistor.
      </p>
      <p>
        That time constant is <code>τ = R × C</code> — the time to reach about
        63% of the way to the final voltage, and roughly five of those to
        effectively arrive. It is the basis of simple timers and debouncing.{" "}
        <Link href="/science/capacitor-calculator">The capacitor
        calculator</Link> handles series, parallel and time constants.
      </p>

      <h2>Four mistakes worth avoiding</h2>
      <ol>
        <li>
          <strong>No resistor on an LED.</strong> The most common first mistake,
          and the LED does not survive it.
        </li>
        <li>
          <strong>Ignoring power ratings.</strong> Check P = V × I against the
          component&rsquo;s rating. A quarter-watt resistor asked to dissipate a
          watt will smell distinctive.
        </li>
        <li>
          <strong>Measuring current like voltage.</strong> Voltage goes across a
          component with the meter in parallel; current goes through, with the
          meter in series. Putting an ammeter across a supply is a short circuit.
        </li>
        <li>
          <strong>Assuming the supply is exactly what it says.</strong> A
          &ldquo;5 V&rdquo; USB supply can sit anywhere from 4.75 to 5.25 V, and
          a 9 V battery reads about 9.5 V fresh and 7 V tired.
        </li>
      </ol>
    </>
  );
}
