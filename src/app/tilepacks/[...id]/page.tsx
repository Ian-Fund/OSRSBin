import TilePack from "./View";
import Upload from "./Upload";
import { createClient } from "@lib/supabase/server";

async function fetchTags() {
  const supabase = await createClient();
  const { data: tags } = await supabase.from("tags").select("*");
  return tags ?? [];
}

export default async function ViewOrUpload(props: {
  params: Promise<{ id: string[] }>;
}) {
  const params = await props.params;
  const id = params.id[0];

  if (id === "upload") {
    return <Upload allTags={await fetchTags()} />;
  } else {
    return <TilePack id={id} />;
  }
}
