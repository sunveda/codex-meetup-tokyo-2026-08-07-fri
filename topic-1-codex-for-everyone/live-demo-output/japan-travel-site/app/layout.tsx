import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "sunveda.tech";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return {
    title: "Kokoro Japan | Private Japan Journeys for Europe",
    description: "Discover 20 of Japan's most beautiful places and plan a private, locally designed journey with European-language support.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Japan, beautifully personal.",
      description: "20 remarkable places. One journey designed around you.",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og-kokoro-japan.png`, width: 1731, height: 909 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Japan, beautifully personal.",
      description: "20 remarkable places. One journey designed around you.",
      images: [`${origin}/og-kokoro-japan.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
