import type { TilepackWithTags } from "@/src/lib/types";
import Result from "./Result";

export default function ResultList({ tilePacks }: { tilePacks: TilepackWithTags[] }) {
  if (tilePacks.length === 0) {
    return <p>No tile packs found.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {tilePacks.map((tilePack) => (
        <li key={tilePack.id}>
          <Result tilePack={tilePack} />
        </li>
      ))}
    </ul>
  );
}
