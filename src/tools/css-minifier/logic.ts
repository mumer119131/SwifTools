export {
  defaultMinifyCssOptions,
  minifyCss,
  type MinifyCssOptions,
} from "@/lib/code-format";

export const SAMPLE = `/*! banner comment — kept */
/* a normal comment — removed */
.card {
  margin : 0px auto;
  padding: 0.5rem  1rem;
  color  : #aabbcc;
  background : url( /images/bg.png );
  content: "keep   these   spaces";
}

.card:hover { color : #ffffff ; }
`;
