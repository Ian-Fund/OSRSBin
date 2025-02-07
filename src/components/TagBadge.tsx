import { Badge } from "@components/ui/badge";
import Link from "next/link";

export default function TagBadge({
  tag,
}: {
  tag: { name: string; slug: string };
}) {
  return (
    <Link href={`/tags/${tag.slug}`}>
      <Badge size="sm">{tag.name}</Badge>
    </Link>
  );
}
