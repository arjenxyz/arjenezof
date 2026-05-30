"use client";

import { useEffect, useState } from "react";

type Quote = {
  id: string;
  text: string;
  author: string;
};

type Props = {
  quotes: Quote[];
  intervalMs?: number;
};

function pickRandom(quotes: Quote[]) {
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)] ?? null;
}

export function RandomQuote({ quotes, intervalMs = 8000 }: Props) {
  const [current, setCurrent] = useState<Quote | null>(() => pickRandom(quotes));

  useEffect(() => {
    if (quotes.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => {
        if (quotes.length <= 1) return prev;
        let next = pickRandom(quotes);
        while (next?.id === prev?.id && quotes.length > 1) {
          next = pickRandom(quotes);
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [quotes, intervalMs]);

  if (!current) return null;

  return (
    <blockquote className="mt-10 border-t border-stone-200 pt-8 text-center">
      <p className="font-serif text-lg leading-relaxed text-stone-800 sm:text-xl">
        “{current.text}”
      </p>
      {current.author && (
        <footer className="mt-3 text-sm text-stone-500">— {current.author}</footer>
      )}
    </blockquote>
  );
}
