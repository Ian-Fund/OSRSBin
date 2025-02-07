import ResultList from "@components/ResultList";
import { createClient } from "@lib/supabase/server";

export default async function Tag({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // first, get the tilepacks with the slug tag. the tags property will only
  // have one tag in it.
  const { data: matchingTilePacks, error: matchingError } = await supabase
    .from("tilepacks")
    .select(`*, tags!inner (*)`)
    .eq("tags.slug", slug);

  if (matchingError) {
    throw matchingError;
  }

  const tilePackIds = matchingTilePacks.map((tilePack) => tilePack.id);

  // now, run another query, but get the full tags
  const { data: fullTilePacks, error: fullError } = await supabase
    .from("tilepacks")
    .select(`*, tags (*)`)
    .in("id", tilePackIds);

  if (fullError) {
    throw fullError;
  }

  return (
    <div>
      <h1 className="font-runescape text-6xl text-primary">{slug}</h1>

      <ResultList tilePacks={fullTilePacks} />
    </div>
  );
}
