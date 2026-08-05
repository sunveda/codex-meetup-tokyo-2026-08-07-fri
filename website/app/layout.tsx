import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "sunveda.tech";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return {
    title: "Codexはエンジニアだけのものじゃない | SunVeda Technologies",
    description:
      "Codex Meetup Tokyo #2の5分LT。5人のための10のCodex活用例とバイリンガル発表資料。",
    openGraph: {
      title: "Codexはエンジニアだけのものじゃない",
      description:
        "5人 × 2つの成果を5分で。Codex Meetup Tokyo #2 LT。",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Codex Isn’t Just for Engineers",
      description:
        "Five people, ten useful outcomes, and one live Codex build in five minutes.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
