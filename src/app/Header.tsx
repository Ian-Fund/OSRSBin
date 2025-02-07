import Link from "next/link";
import { appName } from "@lib/constants";
import { type Tag } from "@lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu";
import { cn } from "@lib/utils";
import * as React from "react";
import { signOutAction } from "@app/actions";
import { Button } from "@components/ui/button";
import { createClient } from "@lib/supabase/server";
import Logo from "@components/Logo";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const metadata = user?.user_metadata;

  const { data: tags, error } = await supabase.from("tags").select("*");

  if (error || tags === null) {
    console.error(error);
    throw new Error("Failed to fetch tags");
  }

  const parentTags = tags.filter((tag) => tag.parent_id === null);
  type TagMap = Map<number, { tag: Tag; children: Tag[] }>;
  const tagMap: TagMap = new Map(
    parentTags.map((tag) => [tag.id, { tag, children: [] }])
  );
  tags.forEach((tag) => {
    if (tag.parent_id != null) {
      tagMap.get(tag.parent_id)?.children.push(tag);
    }
  });

  return (
    <header className="font-runescape">
      <div className="bg-header">
        <nav className="flex justify-between items-center py-2 container mx-auto px-8">
          <div className="text-4xl font-runescape">
            <Link href="/" className="flex gap-4 items-center">
              <Logo className="size-12" />
              <span>{appName}</span>
            </Link>
          </div>
          <ul className="flex gap-8 text-3xl text-primary">
            <li>
              <Link href="/help">Help</Link>
            </li>
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {metadata?.displayName}!
                <form action={signOutAction}>
                  <Button type="submit" variant={"outline"}>
                    Sign out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant={"outline"}>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </ul>
        </nav>
      </div>
      <div className="bg-header-lighter">
        <nav className="container mx-auto text-2xl px-8">
          <ul className="flex gap-4 items-center">
            <li className="uppercase px-12 py-1 border-primary border-2">
              <Link href="/tilepacks/upload">Upload</Link>
            </li>
            <NavigationMenu>
              <NavigationMenuList>
                {[...tagMap.values()].map((bucket) => (
                  <NavigationMenuItem key={bucket.tag.id}>
                    <NavigationMenuTrigger>
                      {bucket.tag.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {bucket.children.map((child, i) => (
                          <ListItem
                            key={i}
                            title={`${child.name}`}
                            href={`/tags/${child.slug}`}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <Link href="/tags" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      All Tags
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </ul>
        </nav>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="leading-none">{title}</div>
          {/* <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p> */}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
