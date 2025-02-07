"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { uploadTilepack } from "./actions";
import { createClient } from "@/src/lib/supabase/client";
import { Badge } from "@/src/components/ui/badge";
import type { Tag } from "@/src/lib/types";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

// TODO: add real captcha (hCaptcha?) for anonymous users. all users?

const maxTags = 7;

const uploadFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(5000),
  tiles: z
    .string()
    .min(1)
    .transform((value, ctx) => {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid JSON",
        });
        return z.NEVER;
      }
      return parsed;
    })
    .refine((o) => tilePackTileSchema.safeParse(o).success === true, {
      message: "Invalid tile data",
    }),
  image: z.instanceof(FileList).refine((o) => o.length === 1, {
    message: "Please upload an image",
  }),
  captcha: z.boolean().refine((val) => val === true, {
    message: "Please solve the captcha",
  }),
  tags: z.array(z.string()).min(1).max(maxTags),
});

export type UploadFormSchema = z.infer<typeof uploadFormSchema>;

const tilePackTileSchema = z
  .array(
    z
      .object({
        regionId: z.number().nonnegative().finite().safe(),
        regionX: z.number().nonnegative().finite().safe(),
        regionY: z.number().nonnegative().finite().safe(),
        z: z.number().nonnegative().finite().safe(),
        color: z.string().regex(/^#[0-9a-f]{8}$/i),
        label: z.string().optional(),
      })
      .strict()
  )
  .min(1)
  .max(200);

async function fetchTags() {
  const supabase = createClient();
  let { data: tags, error } = await supabase.from("tags").select("*");
  return tags ?? [];
}

export default function Upload({ allTags }: Readonly<{ allTags: Tag[] }>) {
  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });
  const [remainingTags, setRemainingTags] = useState<Tag[]>([...allTags]);
  const tagsByName = new Map(allTags.map((tag) => [tag.name, tag]));

  const onSubmit = async (values: UploadFormSchema) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("tiles", JSON.stringify(values.tiles));
    formData.append("image", values.image[0]);
    formData.append(
      "tags",
      JSON.stringify(values.tags.map((tag) => tagsByName.get(tag)!))
    );

    await uploadTilepack(formData);
  };

  if (remainingTags.length === 0) return <div>failed to load</div>;

  const tagChildren = remainingTags.map((tag) => (
    <li
      key={tag.id}
      onClick={() => {
        console.log(tag.name);
        const tags = [...form.getValues("tags"), tag.name];
        form.setValue("tags", tags);
        setRemainingTags(remainingTags.filter((t) => t.id !== tag.id));
      }}
    >
      <Badge variant="outline" className="cursor-pointer">
        {tag.name}
      </Badge>
    </li>
  ));

  return (
    <Form {...form}>
      <h1 className="font-runescape text-6xl text-primary">Upload Tilepack</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a title"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  spellCheck="false"
                  placeholder="Enter a description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tile Data</FormLabel>
              <FormControl>
                <Textarea
                  className="font-mono"
                  spellCheck="false"
                  placeholder="Paste your tile data here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="captcha"
          render={({ field }) => (
            <FormItem className="flex flex-row gap-4 items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Captcha</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a category"
                  {...field}
                  autoComplete="off"
                  readOnly
                  type="hidden"
                />
              </FormControl>
              <ol className="flex flex-wrap gap-2">
                {form.getValues("tags").map((tag, i) => (
                  <li key={tag}>
                    <Badge variant="secondary" className="flex gap-2">
                      <span>{tag}</span>{" "}
                      <X
                        size="18"
                        className="cursor-pointer"
                        onClick={() => {
                          const tags = form
                            .getValues("tags")
                            .filter((_, j) => i !== j);
                          form.setValue("tags", tags);
                          setRemainingTags([
                            ...remainingTags,
                            tagsByName.get(tag)!,
                          ]);
                        }}
                      />
                    </Badge>
                  </li>
                ))}
              </ol>
              {form.getValues("tags").length < maxTags && (
                <ol className="flex flex-wrap gap-2 max-h-48 min-h-32 overflow-y-scroll p-2 border rounded-lg">
                  {tagChildren}
                </ol>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
