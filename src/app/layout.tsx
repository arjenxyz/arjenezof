import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Bu düşüncelerde ne? | Arjen",
    template: "%s | Bu düşüncelerde ne?",
  },
  description:
    "Arjen'in akıl denemeleri: din, tanrı, yaşam, doğa ve varoluş üzerine düşünceler.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Bu düşüncelerde ne?",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-[#f7f5f0] font-sans text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
