"use client";

import { Button } from "@components/ui/button";

export default function UploadSection() {
  return (
    <section className="text-center">
      <h2 className="font-runescape text-6xl leading-[4.5rem]">
        Upload Your Own
      </h2>
      <Button
        size="lg"
        className="w-full mt-4 shadow-secondary-behind-sm hover:shadow-secondary-behind-md active:shadow-secondary-behind-lg"
        onClick={() => {
          window.location.href = "/tilepacks/upload";
        }}
      >
        Upload
      </Button>
    </section>
  );
}
