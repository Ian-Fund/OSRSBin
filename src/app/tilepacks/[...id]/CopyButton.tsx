"use client";

import { Button } from "@/src/components/ui/button";
import { useState, useRef } from "react";

export default function CopyButton({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      className={`font-bold text-lg transition-colors ${
        copied ? "bg-green-700 hover:bg-green-700 active:bg-green-800" : ""
      }`}
      onClick={handleClick}
    >
      {copied ? "Copied!" : children}
    </Button>
  );
}
