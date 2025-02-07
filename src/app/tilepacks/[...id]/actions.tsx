"use server";

import { createClient } from "@lib/supabase/server";
import { generateNewId } from "@lib/utils";
import { redirect } from "next/navigation";
import { tilepackImagesBucketName } from "@lib/constants";
import { Tag } from "@lib/types";
// import type Tile

function slugifyTitle(title: string) {
  let slugged = title
    .trim()
    .toLowerCase()
    .replace("'", "")
    .replace(/[\p{P}\W]+/gu, "-");
  if (slugged.startsWith("-")) {
    slugged = slugged.slice(1);
  }
  if (slugged.endsWith("-")) {
    slugged = slugged.slice(0, -1);
  }
  return slugged;
}

const getFileExtension = (file: File) => {
  const name = file.name.trim();
  const lastDot = name.lastIndexOf(".");

  // Check if dot exists and isn't first/last char
  if (lastDot > 0 && lastDot < name.length - 1) {
    return name.slice(lastDot + 1).toLowerCase();
  }

  return undefined;
};

export async function uploadTilepack(formData: FormData) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  // if anonymous, become null
  const userId = userData?.user?.id ?? null;

  // TODO: zod validation. can/should we reuse the form schema?
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const tiles = JSON.parse(formData.get("tiles") as string);
  const image = formData.get("image") as File;
  const tags: Tag[] = JSON.parse(formData.get("tags") as string);

  // upload image
  const extension = getFileExtension(image);
  if (!extension) {
    // this isn't a problem until later: if we get an image with no extension,
    // the storage server will not know with which content-type to serve it, and
    // browsers will instead interpret it generic binary data for download
    throw new Error("File should have extension");
  }
  const imageName = `${generateNewId()}${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(tilepackImagesBucketName)
    .upload(imageName, image);

  if (uploadError) {
    throw uploadError;
  }

  const row = {
    author_id: userId,
    data: tiles,
    description,
    name,
    public_id: generateNewId(),
    slug: slugifyTitle(name),
    image_name: imageName,
  };

  const { data: tilepack, error: insertError } = await supabase
    .from("tilepacks")
    .insert(row)
    .select();

  if (insertError) {
    throw insertError;
  }

  const { error: tagsError } = await supabase.from("tilepacks_tags").insert(
    tags.map((tag) => ({
      tilepack_id: tilepack[0].id,
      tag_id: tag.id,
    }))
  );

  if (tagsError) {
    throw tagsError;
  }

  redirect(`/tilepacks/${row.public_id}/${row.slug}`);
}
