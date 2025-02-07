import { cn } from "@/src/lib/utils";

export default function Logo(props: { className?: string }) {
  // make an svg
  const squareSize = 6;
  const imageViewBoxSize = 6 * 4;
  const viewBox = `0 0 ${imageViewBoxSize} ${imageViewBoxSize}`;
  const strokeWidth = 1;

  const blue = "#1f77b4";
  const red = "#d62728";
  const green = "#2ca02c";
  const yellow = "#ff7f0e";

  function squareOrigin(x: number, y: number) {
    return {
      x: x * squareSize + 1,
      y: y * squareSize + 1,
    };
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={cn(props.className)}
    >
      {/* red */}
      {[
        [0, 1],
        [1, 1],
      ].map(([x, y]) => {
        const { x: sx, y: sy } = squareOrigin(x, y);
        return (
          <rect
            key={`${x}-${y}`}
            x={sx}
            y={sy}
            width={squareSize - 2 * strokeWidth}
            height={squareSize - 2 * strokeWidth}
            strokeWidth={strokeWidth}
            stroke={red}
            fill={"none"}
          />
        );
      })}

      {/* blue */}
      {[
        [2, 0],
        [2, 1],
      ].map(([x, y]) => {
        const { x: sx, y: sy } = squareOrigin(x, y);
        return (
          <rect
            key={`${x}-${y}`}
            x={sx}
            y={sy}
            width={squareSize - 2 * strokeWidth}
            height={squareSize - 2 * strokeWidth}
            strokeWidth={strokeWidth}
            stroke={blue}
            fill={"none"}
          />
        );
      })}

      {/* yellow */}
      {[
        [2, 2],
        [3, 2],
      ].map(([x, y]) => {
        const { x: sx, y: sy } = squareOrigin(x, y);
        return (
          <rect
            key={`${x}-${y}`}
            x={sx}
            y={sy}
            width={squareSize - 2 * strokeWidth}
            height={squareSize - 2 * strokeWidth}
            strokeWidth={strokeWidth}
            stroke={yellow}
            fill={"none"}
          />
        );
      })}

      {/* green */}
      {[
        [1, 2],
        [1, 3],
      ].map(([x, y]) => {
        const { x: sx, y: sy } = squareOrigin(x, y);
        return (
          <rect
            key={`${x}-${y}`}
            x={sx}
            y={sy}
            width={squareSize - 2 * strokeWidth}
            height={squareSize - 2 * strokeWidth}
            strokeWidth={strokeWidth}
            stroke={green}
            fill={"none"}
          />
        );
      })}
    </svg>
  );
}
