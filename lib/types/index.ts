import type {
  Json,
  CompositeTypes,
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./supabase-generated";

export type {
  Json,
  CompositeTypes,
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
};

// See https://supabase.com/docs/reference/javascript/typescript-support

export type Tag = Tables<"tags">;
export type Tilepack = Tables<"tilepacks">;
export type TilepacksTags = Tables<"tilepacks_tags">;
export type Profile = Tables<"profiles">;

export type TilepackWithTags = Tilepack & { tags: Tag[] } & {
  profiles: Profile | null;
};
