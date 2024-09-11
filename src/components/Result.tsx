import { formatNumber } from "@/lib/utils";
import TagBadge from "./TagBadge";
import Link from "next/link";
import { type TilePack } from "@/lib/types";

type Orientation = "horizontal" | "vertical";

function tilePackLink(tilePack: TilePack, children: React.ReactNode) {
  return (
    <Link href={`/tilepacks/${tilePack.id}/${tilePack.slug}`} className="">
      {children}
    </Link>
  );
}

export default function Result({
  tilePack,
  orientation = "horizontal",
}: {
  tilePack: TilePack;
  orientation?: Orientation;
}) {
  return (
    <div
      className={`flex ${
        orientation == "horizontal" ? "flex-row" : "flex-col"
      } text-card-foreground bg-card rounded-md overflow-hidden min-h-full result-card`}
    >
      {tilePackLink(
        tilePack,
        <img
          src={tilePack.imageHref}
          alt={tilePack.name}
          className={`object-cover h-full ${
            orientation == "horizontal" ? "min-w-64 w-64" : "min-h-48 h-48"
          }`}
        />
      )}
      <div className="card-content p-4 flex flex-col justify-between gap-2 flex-grow">
        {tilePackLink(
          tilePack,
          <h3 className="font-runescape text-primary text-2xl inline hover:underline">
            {tilePack.name}
          </h3>
        )}
        <ul className="flex flex-wrap">
          <li>{tilePack.author.name}</li>
          <li className="mx-2" role="presentation">
            &bull;
          </li>
          <li>{formatNumber(tilePack.installCount)} installs</li>
        </ul>
        <p className="flex flex-grow">{tilePack.description}</p>
        <ul className="flex gap-2">
          {tilePack.tags.map((tag) => (
            <li key={tag.name}>
              <TagBadge tag={tag} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
