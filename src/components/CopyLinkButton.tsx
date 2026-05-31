"use client";

import { useState } from "react";

type Props = {
  url: string;
};

export function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation"
    >
      {copied ? "Kopyalandı" : "Bağlantıyı kopyala"}
    </button>
  );
}
