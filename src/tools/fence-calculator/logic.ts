export interface FenceEstimate {
  sections: number;
  posts: number;
  rails: number;
  pickets: number;
  postHoleDepthFt: number;
  concreteBagsPerPost: number;
  concreteBags: number;
  cost: number | null;
}

/**
 * Materials for a straight fence run.
 *
 * The post count is the classic fencepost problem: eight sections need nine
 * posts, not eight. Getting this wrong by one is the single most common
 * estimating mistake on a fence, and it is always short.
 */
export function estimate(
  lengthFt: number,
  spacingFt: number,
  heightFt: number,
  railsPerSection: number,
  picketWidthIn: number,
  gapIn: number,
  postPrice: number,
  railPrice: number,
  picketPrice: number,
): FenceEstimate {
  const length = Math.max(0, lengthFt);
  const spacing = Math.max(0.1, spacingFt);

  const sections = Math.ceil(length / spacing);
  // One more post than sections — the run has two ends.
  const posts = sections > 0 ? sections + 1 : 0;

  const rails = sections * Math.max(0, railsPerSection);

  const picketPitch = Math.max(0.1, picketWidthIn + Math.max(0, gapIn));
  const pickets = Math.ceil((length * 12) / picketPitch);

  /*
   * A post hole goes a third of the post's above-ground height into the
   * ground, and below the frost line in a cold climate. A 10-inch hole at that
   * depth takes about two 50 lb bags of post mix.
   */
  const postHoleDepthFt = Math.max(2, heightFt / 3);
  const holeVolumeFt3 = Math.PI * (10 / 12 / 2) ** 2 * postHoleDepthFt;
  const concreteBagsPerPost = Math.ceil(holeVolumeFt3 / 0.375);

  const cost =
    postPrice > 0 || railPrice > 0 || picketPrice > 0
      ? posts * postPrice + rails * railPrice + pickets * picketPrice
      : null;

  return {
    sections,
    posts,
    rails,
    pickets,
    postHoleDepthFt,
    concreteBagsPerPost,
    concreteBags: posts * concreteBagsPerPost,
    cost,
  };
}
