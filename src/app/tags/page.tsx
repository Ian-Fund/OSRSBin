import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { formatNumber } from "@lib/utils";
import { createClient } from "@lib/supabase/server";

export default async function Tags() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select(`*, tilepacks(count)`);

  // this filter isn't working, so we do it in JS
  // .order("count", { referencedTable: "tilepacks", ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  const tags = data.sort((a, b) => b.tilepacks[0].count - a.tilepacks[0].count);

  return (
    <div>
      <h1 className="font-runescape text-6xl text-primary">Tags</h1>
      <ul className="list-disc list-inside">
        {Array.from(tags).map((tag) => (
          <li key={tag.id}>
            <Link
              href={`tags/${tag.slug}`}
              className="underline hover:text-foreground/80"
            >
              {tag.name}
            </Link>
            <span className="italic ms-2">
              ({formatNumber(tag.tilepacks[0].count)} packs)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
