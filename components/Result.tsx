import TagBadge from "./TagBadge";
import Link from "next/link";
import type { TilepackWithTags, Tilepack } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { tilepackImagesBucketName } from "@/lib/constants";
import { formatNumber, randomInteger } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";

function tilePackLink(tilePack: Tilepack, children: React.ReactNode) {
  return (
    <Link
      href={`/tilepacks/${tilePack.public_id}/${tilePack.slug}`}
      className=""
    >
      {children}
    </Link>
  );
}

export default async function ({
  tilePack,
  orientation = "horizontal",
}: {
  tilePack: TilepackWithTags;
  orientation?: Orientation;
}) {
  const supabase = createClient();
  const {
    data: { publicUrl: imageUrl },
  } = supabase.storage
    .from(tilepackImagesBucketName)
    .getPublicUrl(tilePack.image_name);

  return (
    <Link
      href={`/tilepacks/${tilePack.public_id}/${tilePack.slug}`}
      legacyBehavior
    >
      <div
        className={`flex ${
          orientation == "horizontal" ? "flex-row" : "flex-col"
        } text-card-foreground bg-card rounded-md overflow-hidden h-full cursor-pointer`}
      >
        <img
          src={imageUrl}
          alt={tilePack.name}
          className={`object-cover ${
            orientation == "horizontal" ? "min-w-64 w-64 h-96 min-h-96" : "min-h-48 h-48"
          }`}
        />
        <div className="p-4 flex flex-col gap-2 justify-stretch">
          <h3 className="font-runescape text-primary text-2xl inline hover:underline">
            {tilePack.name}
          </h3>
          <ul className="flex flex-wrap">
            <li>{tilePack.author_id}</li>
            <li className="mx-2" role="presentation">
              &bull;
            </li>
            <li>{formatNumber(randomInteger(1000, 10000))} installs</li>
          </ul>
          <p className="h-full grow line-clamp-3">{tilePack.description}</p>
          <ul className="flex gap-2 flex-wrap">
            {tilePack.tags.map((tag) => (
              <li key={tag.name}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}
