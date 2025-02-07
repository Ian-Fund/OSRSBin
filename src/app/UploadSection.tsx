"use client";

import { Button } from "@components/ui/button";

export default function UploadSection() {
  return (
    <section className="text-center">
      <h2 className="font-runescape text-6xl leading-[4.5rem] leading text-primary">
        Upload Your Own
      </h2>
      <Button
        variant="secondary"
        size="lg"
        className="w-full hover:hover:bg-secondary mt-4 drop-shadow-[0_0_1rem_hsl(from_var(--primary)_h_s_l_/_0.5)] hover:drop-shadow-[0_0_1.5rem_hsl(from_var(--primary)_h_s_l_/_0.6)] active:drop-shadow-[0_0_1.5rem_hsl(from_var(--primary)_h_s_l_/_0.7)]"
        onClick={() => {
          window.location.href = "/tilepacks/upload";
        }}
      >
        Upload
      </Button>
    </section>
  );
}
