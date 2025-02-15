"use server";

import { createClient } from "@/lib/supabase/server";
import ResultList from "@/components/ResultList";

export default async function Tilepacks() {
  const supabase = await createClient();
  let { data: tilePacks, error } = await supabase
    .from("tilepacks")
    .select("*, tags (*), profiles (*)");

  if (error) {
    throw error;
  }

  return (
    <div>
      <h1 className="font-runescape text-6xl text-primary">Tile Packs</h1>
      <ResultList tilePacks={tilePacks ?? []} />
    </div>
  );
}
