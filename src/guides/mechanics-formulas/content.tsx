import Link from "next/link";

export default function MechanicsFormulasGuide() {
  return (
    <>
      <p>
        Introductory mechanics is a handful of equations that keep reappearing in
        different costumes. What makes them hard is rarely the algebra — it is
        knowing which one applies, and noticing when a quantity is squared,
        because that changes the answer&rsquo;s behaviour completely.
      </p>

      <h2>Force: F = ma</h2>
      <p>
        Newton&rsquo;s second law says force equals mass times acceleration. A
        newton is the force that accelerates one kilogram at one metre per second
        squared, which is roughly the weight of a small apple in your hand.
      </p>
      <p>
        The word doing the work here is <strong>acceleration</strong>, meaning any
        change in velocity — speeding up, slowing down, or turning. A car going
        round a bend at constant speed is accelerating, because its direction is
        changing, and that is why it needs grip to do it.
      </p>
      <p>
        The other half is that <strong>net</strong> force is what matters. A book
        resting on a table has gravity pulling it down and the table pushing it
        up; they cancel, the net force is zero, and it stays put. The{" "}
        <Link href="/science/force-calculator">force calculator</Link> solves for
        whichever of the three you leave out.
      </p>

      <h2>Kinetic energy, and why the square matters</h2>
      <p>
        <code>KE = ½mv²</code>. Energy of motion, in joules. The square is the
        whole story: <strong>doubling the speed quadruples the energy</strong>.
      </p>
      <p>
        This is the single most practically important fact in this guide. A car at
        60&nbsp;km/h carries four times the energy it does at 30, not twice, and
        all of it has to go somewhere in a crash. It is also why stopping
        distances grow so sharply with speed — the brakes have to dissipate energy
        that grew with the square.
      </p>
      <p>
        Compare that with <strong>momentum</strong>, <code>p = mv</code>, which is
        linear. Two objects can have the same momentum and very different
        energies, which is why a slow lorry and a fast car are not
        interchangeable problems. Momentum is conserved in a collision; kinetic
        energy generally is not, because some becomes heat and deformation. The{" "}
        <Link href="/science/kinetic-energy-calculator">kinetic energy</Link> and{" "}
        <Link href="/science/momentum-calculator">momentum</Link> calculators sit
        either side of that distinction.
      </p>

      <h2>Work and power are not the same thing</h2>
      <p>
        <code>W = Fd</code> — work is force times the distance moved{" "}
        <em>along that force</em>. Carrying a heavy box across a level room does
        no work on the box in the physics sense, because the force is upward and
        the motion is horizontal. It is exhausting, but that energy goes into
        holding your muscles tense, not into the box.
      </p>
      <p>
        <strong>Power is work divided by time.</strong> Lifting the same box up
        the same stairs is the same work whether you take five seconds or five
        minutes; the power differs by a factor of sixty. This is exactly what
        separates a watt from a joule, and the{" "}
        <Link href="/science/work-done-calculator">work done calculator</Link>{" "}
        reports both.
      </p>
      <p>
        Because power and energy get quoted in so many different units — watts,
        horsepower, joules, calories, kilowatt-hours — the{" "}
        <Link href="/units/power-converter">power</Link> and{" "}
        <Link href="/units/energy-converter">energy</Link> converters are often
        the faster route than doing it by hand.
      </p>

      <h2>Torque is force with leverage</h2>
      <p>
        <code>τ = Fr</code>. Torque is a twisting effect, and it depends on{" "}
        <em>where</em> you push as much as how hard. Doubling the spanner length
        doubles the torque for the same effort, which is the entire reason long
        spanners exist.
      </p>
      <p>
        The subtlety is that <code>r</code> is the{" "}
        <strong>perpendicular</strong> distance from the pivot to the line of the
        force. Pushing along the spanner rather than across it produces no torque
        at all, however hard you push. The{" "}
        <Link href="/science/torque-calculator">torque calculator</Link> converts
        into pound-feet as well, since fasteners are still specified that way in
        much of the world.
      </p>

      <h2>Springs: F = kx</h2>
      <p>
        Hooke&rsquo;s law says the force a spring exerts is proportional to how far
        it is stretched or compressed. The constant <code>k</code> is the
        stiffness, in newtons per metre.
      </p>
      <p>
        Stored energy, though, is <code>½kx²</code> — squared again. Pulling a
        spring twice as far stores four times the energy, which is why the last
        centimetre of a drawn bow does so much more than the first.
      </p>
      <p>
        Hooke&rsquo;s law holds only up to the elastic limit. Past that the
        material deforms permanently and the equation stops describing anything
        real, which is a genuine limit rather than a technicality. The{" "}
        <Link href="/science/hookes-law-calculator">Hooke&rsquo;s law
        calculator</Link> gives the stored energy alongside the force.
      </p>

      <h2>Projectiles: two problems, not one</h2>
      <p>
        The trick that makes projectile motion tractable is that the horizontal
        and vertical motions are <strong>independent</strong>. Horizontally,
        nothing accelerates it, so it travels at constant speed. Vertically,
        gravity acts at about 9.81&nbsp;m/s² regardless of what it is doing
        sideways.
      </p>
      <p>
        The famous consequence: a bullet fired horizontally and one dropped from
        the same height hit the ground at the same moment. Their vertical stories
        are identical, and the horizontal motion has no say in it.
      </p>
      <p>
        On level ground, maximum range comes at <strong>45 degrees</strong>, and
        angles either side of it pair up — 30 and 60 degrees give the same
        distance by different routes, one flatter and faster, one higher and
        slower. The{" "}
        <Link href="/science/projectile-motion-calculator">projectile motion
        calculator</Link> gives range, flight time and peak height together. All
        of this assumes no air resistance, which is fine for a thrown ball and
        badly wrong for anything light or very fast.
      </p>

      <h2>Gravity between any two masses</h2>
      <p>
        <code>F = Gm₁m₂/r²</code>. Every mass attracts every other, with{" "}
        <code>G</code> at 6.674&nbsp;&times;&nbsp;10<sup>&minus;11</sup> — a tiny
        number, which is why you feel no pull toward the person next to you.
      </p>
      <p>
        The <code>r²</code> is an inverse square: <strong>double the distance and
        the force drops to a quarter</strong>, not a half. And <code>r</code> is
        measured centre to centre, so for anything sitting on Earth&rsquo;s
        surface it is the planet&rsquo;s radius — which is why climbing a mountain
        barely changes your weight. The{" "}
        <Link href="/science/gravitational-force-calculator">gravitational force
        calculator</Link> handles the very large and very small numbers involved.
      </p>

      <h2>The habits that prevent most mistakes</h2>
      <p>
        Convert to SI before substituting — kilograms, metres, seconds — and most
        unit errors disappear on their own. Check whether the quantity you want is
        squared, because that decides whether doubling an input doubles or
        quadruples the answer. And check the result is the right size: if a
        thrown ball comes out with the kinetic energy of a truck, the mistake is
        upstream, and finding it is faster than redoing the algebra.
      </p>
    </>
  );
}
