import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bu düşüncelerde ne?",
    short_name: "Arjen",
    description: "Arjen'in akıl denemeleri: din, tanrı, yaşam, doğa ve varoluş üzerine düşünceler.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#4a5d49",
    lang: "tr",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
