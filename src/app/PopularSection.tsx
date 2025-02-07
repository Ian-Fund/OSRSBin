"use server";

import Result from "@components/Result";
import { createClient } from "@lib/supabase/server";

export default async function PopularSection() {
  const supabase = await createClient();
  let { data: tilepacks, error } = await supabase
    .from("tilepacks")
    .select("*, tags (*)")
    .limit(3);

  if (error) {
    throw error;
  }

  return (
    <section className="mx-auto">
      <div className="text-center">
        <h2 className="font-runescape text-6xl leading-[4.5rem] leading text-primary">
          Popular Packs
        </h2>
        <p>Check out what other people are&hellip; checking out!</p>
      </div>

      <ul className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-4 mt-6">
        {(tilepacks ?? []).map((tilePack) => (
          <li key={tilePack.id}>
            <Result tilePack={tilePack} orientation="vertical" />
          </li>
        ))}
      </ul>
    </section>
  );
}
