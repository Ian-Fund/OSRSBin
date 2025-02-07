"use server";

import { notFound } from "next/navigation";
import TagBadge from "@components/TagBadge";
import CopyButton from "./CopyButton";
import { createClient } from "@lib/supabase/server";
import { randomInteger, formatNumber } from "@lib/utils";
import { tilepackImagesBucketName } from "@lib/constants";

async function getTilePackWithId(id: string) {
  const supabase = await createClient();
  const { data: tilepacks, error } = await supabase
    .from("tilepacks")
    .select(
      `
      *,
      tilepacks_tags (
        tag: tags (
          id,
          name,
          slug
        )
      )
    `
    )
    .eq("public_id", id)
    .limit(1);
  if (error || !tilepacks || tilepacks.length === 0) {
    return null;
  }
  return tilepacks[0];
}

export default async function TilePack({ id }: { id: string }) {
  const tilePack = await getTilePackWithId(id);

  const [installCount, viewCount, favoriteCount] = Array.from({
    length: 3,
  }).map(() => randomInteger(1000, 10000));

  if (!tilePack) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { publicUrl: imageUrl },
  } = supabase.storage
    .from(tilepackImagesBucketName)
    .getPublicUrl(tilePack.image_name);

  // TODO load image from storage, load tags from tags table, etc
  return (
    <div className="grid grid-flow-row gap-4">
      <h1 className="font-runescape text-6xl">{tilePack.name}</h1>

      <h2 className="sr-only">Data</h2>
      <CopyButton text={tilePack.data}>
        Copy &quot;{tilePack.name}&quot; to Clipboard
      </CopyButton>
      <details className="cursor-pointer">
        <summary className="font-runescape text-2xl">Data</summary>
        <textarea
          value={JSON.stringify(JSON.parse(tilePack.data), undefined, 2)}
          rows={5}
          readOnly
          className="w-full h-64 font-mono rounded-lg p-6 bg-card text-card-foreground "
        />
      </details>

      <h2 className="sr-only">Metadata</h2>
      <ul>
        <li>
          <span className="font-runescape text-2xl">Author</span>:{" "}
          {tilePack.author_id}
        </li>
        <li>
          <span className="font-runescape text-2xl">Installs</span>:{" "}
          {formatNumber(installCount!)}
        </li>
        <li>
          <span className="font-runescape text-2xl">Views</span>:{" "}
          {formatNumber(viewCount!)}
        </li>
        <li>
          <span className="font-runescape text-2xl">Favorites</span>:{" "}
          {formatNumber(favoriteCount!)}
        </li>
      </ul>

      <h2 className="sr-only">Description</h2>
      <p className="bg-card text-card-foreground px-4 py-2 rounded-lg">
        {tilePack.description}
      </p>

      <img src={imageUrl} alt={tilePack.name} className="w-full h-auto" />

      <h2 className="sr-only">Tags</h2>
      <ul className="flex gap-2 flex-wrap">
        {tilePack.tilepacks_tags
          .map((tag) => tag.tag)
          .filter((tag) => !!tag)
          .map((tag) => (
            <li key={tag.name}>
              <TagBadge tag={tag} />
            </li>
          ))}
      </ul>
    </div>
  );
}
