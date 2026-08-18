import Link from "next/link";

export default function MeasuringARoomGuide() {
  return (
    <>
      <p>
        Every one of these jobs needs a different measurement, and getting the
        wrong one is how people end up two boxes of tiles short on a Sunday.
        Paint needs wall area minus the openings. Flooring needs floor area plus
        waste. Wallpaper needs wall <em>width</em> rather than area. They are not
        interchangeable.
      </p>

      <h2>Measure it once, properly</h2>
      <ol>
        <li>
          <strong>Length and width at floor level</strong>, in the same units
          throughout. Mixing feet and inches with metres is the single most
          common source of error.
        </li>
        <li>
          <strong>Ceiling height</strong>, measured in two or three places. Older
          houses are rarely square, and the shortest measurement is the one that
          matters for wallpaper drops.
        </li>
        <li>
          <strong>Every door and window</strong> — width and height of each.
        </li>
        <li>
          <strong>Anything that breaks the wall</strong>: a chimney breast, an
          alcove, built-in wardrobes.
        </li>
      </ol>
      <p>
        For anything but a plain rectangle, split the room into rectangles,
        calculate each, and add them. An L-shaped room is two rectangles. This is
        much more reliable than trying to be clever with the overall footprint.
      </p>

      <h2>Floor area — flooring, carpet, underfloor heating</h2>
      <p>
        Length × width, in the same units. That is your floor area, and{" "}
        <Link href="/home/square-footage-calculator">the square footage
        calculator</Link> will do it in whichever units you measured in.
      </p>
      <p>Then add waste, which is not optional:</p>
      <ul>
        <li><strong>Straight-laid planks or tiles</strong> — add 10%.</li>
        <li><strong>Diagonal or herringbone</strong> — add 15–20%, because every edge piece is a cut.</li>
        <li><strong>Patterned carpet or vinyl</strong> — add enough to match the repeat, which can be substantial.</li>
        <li><strong>An awkward room</strong> — more alcoves means more cuts means more waste.</li>
      </ul>
      <p>
        Buy it all at once. Batch numbers matter: the same product from a
        different batch can be visibly a different shade, and it is the reason
        &ldquo;I&rsquo;ll get more if I run out&rdquo; goes wrong.{" "}
        <Link href="/home/flooring-calculator">The flooring calculator</Link>{" "}
        takes the waste percentage and works in packs, since that is how it is
        actually sold.
      </p>

      <h2>Wall area — paint</h2>
      <p>
        Add up the wall widths — that is the perimeter — and multiply by the
        ceiling height. Then <strong>subtract the doors and windows</strong>,
        which people routinely forget. A standard door is around 1.8 m², a
        typical window 1.5 m²; in a small room with two of each that is a fifth
        of the wall gone.
      </p>
      <p>Two things that surprise people about paint:</p>
      <ul>
        <li>
          <strong>Coverage is per coat.</strong> A tin saying 12 m² per litre
          means one coat. You almost always need two, and three over a colour
          change or bare plaster.
        </li>
        <li>
          <strong>Bare plaster drinks the first coat.</strong> A mist coat —
          watered-down emulsion — is a separate quantity on top.
        </li>
      </ul>
      <p>
        <Link href="/home/paint-calculator">The paint calculator</Link> handles
        coats and openings together, which is where hand arithmetic usually goes
        astray.
      </p>

      <h2>Wall width — wallpaper</h2>
      <p>
        Wallpaper is the one that is <em>not</em> an area calculation, and
        treating it as one is why people under-order. It comes in rolls of fixed
        width, so what matters is how many full drops you can cut from a roll.
      </p>
      <p>
        A standard roll is 10.05 m long and 53 cm wide. With a 2.4 m ceiling you
        get four drops per roll — 9.6 m used, with 45 cm left over that is no use
        to anyone. Divide your wall width by 0.53 to get the number of drops, then
        divide by drops-per-roll.
      </p>
      <p>
        <strong>Patterned paper needs more.</strong> Each drop has to be cut so
        the pattern lines up, and the offcut is wasted. A 64 cm repeat can cost
        you a drop per roll — closer to 20% more paper, not 5%.{" "}
        <Link href="/home/wallpaper-calculator">The wallpaper calculator</Link>{" "}
        accounts for the repeat rather than assuming it away.
      </p>

      <h2>Tiles</h2>
      <p>
        Area again, but the waste allowance is higher because every edge is a
        cut: <strong>10% for a simple rectangular room, 15% if it is awkward or
        the tiles are laid diagonally.</strong> Add a few spare beyond that —
        tiles get chipped during fitting and, again, batches vary.
      </p>
      <p>
        For a wall, measure each wall separately rather than totalling. You
        rarely tile all of them to the same height, and a single number hides
        that. <Link href="/home/tile-calculator">The tile calculator</Link> works
        in tiles and boxes, which is what you actually buy.
      </p>

      <h2>Volume — plaster, screed, concrete</h2>
      <p>
        Area × depth, and the depth is where the mistakes live because it is in
        millimetres while everything else is in metres. A 50 mm screed over 20 m²
        is 20 × 0.05 = 1 m³, not 20 × 50.
      </p>
      <p>
        Concrete is sold by the cubic metre and always over-order slightly —
        ground is never perfectly level, and a short pour cannot be fixed later.{" "}
        <Link href="/home/concrete-calculator">The concrete calculator</Link>{" "}
        works in cubic metres and bags.
      </p>

      <h2>The short version</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-4 font-medium text-foreground">Job</th>
              <th className="py-2.5 pr-4 font-medium text-foreground">Measure</th>
              <th className="py-2.5 font-medium text-foreground">Add</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2.5 [&_td]:pr-4 [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr><td className="text-foreground">Flooring</td><td>Floor area</td><td>10%, or 15–20% diagonal</td></tr>
            <tr><td className="text-foreground">Paint</td><td>Wall area − openings</td><td>× number of coats</td></tr>
            <tr><td className="text-foreground">Wallpaper</td><td>Wall width</td><td>Extra for the pattern repeat</td></tr>
            <tr><td className="text-foreground">Tiles</td><td>Area per wall</td><td>10–15%</td></tr>
            <tr><td className="text-foreground">Concrete</td><td>Area × depth</td><td>5–10%</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        If you are measuring in feet and buying in metres, or the other way
        round, <Link href="/guides/metric-imperial">metric and imperial</Link>{" "}
        covers the conversions and the ones that catch people out.
      </p>
    </>
  );
}
