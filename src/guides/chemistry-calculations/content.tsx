import Link from "next/link";

export default function ChemistryCalculationsGuide() {
  return (
    <>
      <p>
        Most of introductory chemistry is one idea applied repeatedly: you cannot
        count atoms, but you can weigh them. Every calculation below is a way of
        getting from something you can measure — a mass, a volume, a
        concentration — to the number of particles actually taking part.
      </p>

      <h2>The mole is a counting word</h2>
      <p>
        A mole is a quantity, in the same way a dozen is. It is
        6.02214076&nbsp;&times;&nbsp;10<sup>23</sup> of something &mdash;
        Avogadro&rsquo;s number, which since 2019 has been an exact defined value
        rather than a measured one.
      </p>
      <p>
        The number itself is chosen so that the arithmetic disappears:{" "}
        <strong>one mole of a substance weighs its atomic or formula mass in
        grams</strong>. Carbon has an atomic mass of 12.011, so a mole of carbon
        weighs 12.011&nbsp;g. That correspondence is the whole reason the mole is
        useful, and it is why the periodic table is the only lookup you need to
        convert between mass and particle count.
      </p>

      <h3>Molar mass from a formula</h3>
      <p>
        Add up the atomic masses, multiplied by how many of each atom the formula
        contains. For H<sub>2</sub>SO<sub>4</sub>: two hydrogens at 1.008, one
        sulfur at 32.06, four oxygens at 15.999, giving 98.07&nbsp;g/mol.
      </p>
      <p>
        The arithmetic is trivial and the transcription is where mistakes happen
        — a miscounted subscript in something like
        Ca(NO<sub>3</sub>)<sub>2</sub>, where the subscript outside the bracket
        multiplies everything inside it. The{" "}
        <Link href="/science/molecular-weight-calculator">molecular weight
        calculator</Link> parses the formula, which removes that particular class
        of error.
      </p>

      <h2>Concentration: molarity and its cousin</h2>
      <p>
        <strong>Molarity</strong> is moles of solute per litre of solution, written
        M. It is what almost every problem means by concentration, and the thing
        to watch is that it is per litre of <em>final solution</em>, not per litre
        of solvent you started with.
      </p>
      <p>
        <strong>Molality</strong> is moles per kilogram of solvent, written m. It
        appears in freezing point and boiling point problems for a specific
        reason: it is based on mass, so it does not change with temperature, while
        molarity does as the solution expands.
      </p>

      <h3>Dilution is one equation</h3>
      <p>
        <code>C₁V₁ = C₂V₂</code>. Concentration times volume gives moles, and
        diluting adds solvent without adding solute — so the moles on both sides
        are the same number, and three knowns give you the fourth.
      </p>
      <p>
        The practical trap is what the answer means. If you solve for
        V<sub>1</sub> and get 25&nbsp;mL of stock to make 500&nbsp;mL, you add
        solvent <em>up to</em> 500&nbsp;mL — you do not add 500&nbsp;mL to the 25.
        Serial dilutions compound this: each step multiplies, so ten tenfold steps
        is a factor of 10<sup>10</sup>. The{" "}
        <Link href="/science/dilution-calculator">dilution calculator</Link>{" "}
        handles both the single step and the series.
      </p>

      <h2>Stoichiometry and the limiting reagent</h2>
      <p>
        A balanced equation is a recipe in moles. The coefficients say that two
        moles of hydrogen react with one of oxygen, not two grams with one gram —
        so every stoichiometry problem is the same three steps: convert what you
        have to moles, apply the mole ratio, convert back.
      </p>
      <p>
        <strong>The limiting reagent is the one that runs out first</strong>, and
        it caps the product no matter how much of everything else is present. To
        find it, divide each reactant&rsquo;s moles by its coefficient in the
        balanced equation; the smallest result is limiting. Comparing raw masses
        is the standard mistake, and it gives the wrong answer whenever the
        molar masses differ much.
      </p>
      <p>
        What you calculate from it is the <strong>theoretical yield</strong>, the
        most you could possibly get. Real reactions produce less, and{" "}
        <strong>percent yield</strong> — actual divided by theoretical, times 100
        — is how that gap is reported. The{" "}
        <Link href="/science/stoichiometry-calculator">stoichiometry
        calculator</Link> works through the ratio, the limiting reagent and the
        yield together.
      </p>

      <h2>pH is a logarithm, which changes how to read it</h2>
      <p>
        pH is the negative base-10 logarithm of the hydrogen ion concentration:{" "}
        <code>pH = &minus;log₁₀[H⁺]</code>. Because it is logarithmic,{" "}
        <strong>each whole unit is a tenfold change</strong>. A pH of 3 is not
        slightly more acidic than 4, it is ten times more; and stomach acid near
        pH 1 is roughly a million times more acidic than water at 7.
      </p>
      <p>
        At 25&nbsp;&deg;C, pH and pOH sum to 14, which is where the familiar scale
        comes from. That 14 is temperature-dependent — it is derived from the
        ionisation of water, which changes as water warms. Neutral water at
        50&nbsp;&deg;C has a pH nearer 6.6 and is still neutral, because neutral
        means equal H⁺ and OH⁻, not pH&nbsp;7.
      </p>
      <p>
        The <Link href="/science/ph-calculator">pH calculator</Link> converts in
        both directions, between concentration and pH or pOH.
      </p>

      <h2>Gases: PV = nRT</h2>
      <p>
        The ideal gas law ties pressure, volume, amount and temperature together,
        and the two things that go wrong with it are both about units.
      </p>
      <p>
        <strong>Temperature must be absolute.</strong> Kelvin, always. Celsius in
        this equation gives nonsense, and at low temperatures it gives negative
        volumes.
      </p>
      <p>
        <strong>R has to match the other units.</strong> It is
        8.314&nbsp;J/(mol&middot;K) with pressure in pascals and volume in cubic
        metres, or 0.08206&nbsp;L&middot;atm/(mol&middot;K) with atmospheres and
        litres. Mixing them is the most common error in the whole topic.
      </p>
      <p>
        One more worth flagging: many textbooks give the molar volume of a gas at
        STP as 22.4&nbsp;L/mol, which assumes 1&nbsp;atm. IUPAC&rsquo;s definition
        of standard pressure has been 100&nbsp;kPa since 1982, which gives
        22.71&nbsp;L/mol. Both numbers are correct for their own definition, so
        check which one your course uses. The{" "}
        <Link href="/science/ideal-gas-law-calculator">ideal gas law
        calculator</Link> solves for whichever variable you leave blank.
      </p>

      <h2>Significant figures, where the marks actually go</h2>
      <p>
        A calculator will hand you ten digits regardless of how precisely you
        measured anything, and reporting all of them claims a precision you do
        not have. Two rules cover nearly every case, and they are different from
        each other:
      </p>
      <p>
        <strong>Multiplying or dividing:</strong> the answer gets the same number
        of significant figures as the least precise input.
      </p>
      <p>
        <strong>Adding or subtracting:</strong> the answer gets the same number of{" "}
        <em>decimal places</em> as the input with the fewest — not significant
        figures, decimal places. This is the one people merge with the first rule
        and get wrong.
      </p>
      <p>
        Exact numbers — counted objects, defined conversions, the 2 in a balanced
        equation — have unlimited significant figures and never limit an answer.
        And round once, at the end; rounding at each step accumulates error. The{" "}
        <Link href="/science/significant-figures-calculator">significant figures
        calculator</Link> counts and rounds, and the{" "}
        <Link href="/science/density-calculator">density calculator</Link> is the
        quickest check on a mass-and-volume result that looks implausible.
      </p>
    </>
  );
}
