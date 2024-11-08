import { formatNumber } from "@/lib/utils";
import TagBadge from "./TagBadge";
import Link from "next/link";
import { type Tables } from "@/lib/types";

type Orientation = "horizontal" | "vertical";

function tilePackLink(tilePack: Tables<"tilepacks">, children: React.ReactNode) {
  return (
    <Link
      href={`/tilepacks/${tilePack.public_id}/${tilePack.slug}`}
      className=""
    >
      {children}
    </Link>
  );
}

const fakeTags = [
  { name: "PvM", slug: "pvm" },
  { name: "Skilling", slug: "skilling" },
  { name: "Colusseum", slug: "colusseum" },
  { name: "Minigame", slug: "minigame" },
  { name: "Quest", slug: "quest" },
  { name: "Misc", slug: "misc" },
];

export default function Result({
  tilePack,
  orientation = "horizontal",
}: {
  tilePack: Tables<"tilepacks">;
  orientation?: Orientation;
}) {
  return (
    <div
      className={`flex ${
        orientation == "horizontal" ? "flex-row" : "flex-col"
      } text-card-foreground bg-card rounded-md overflow-hidden h-full`}
    >
      {tilePackLink(
        tilePack,
        <img
          src={`https://loremflickr.com/640/480?random=${Math.random()}`}
          alt={tilePack.name}
          className={`object-cover h-full ${
            orientation == "horizontal" ? "min-w-64 w-64" : "min-h-48 h-48"
          }`}
        />
      )}
      <div className="p-4 flex flex-col gap-2 h-full">
        {tilePackLink(
          tilePack,
          <h3 className="font-runescape text-primary text-2xl inline hover:underline">
            {tilePack.name}
          </h3>
        )}
        <ul className="flex flex-wrap">
          <li>{tilePack.author_id}</li>
          <li className="mx-2" role="presentation">
            &bull;
          </li>
          <li>123 installs</li>
        </ul>
        <p className="h-full line-clamp-3">{tilePack.description}</p>
        <ul className="flex gap-2 flex-wrap">
          {fakeTags.slice(0, 3).map((tag) => (
            <li key={tag.name}>
              <TagBadge tag={tag} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
