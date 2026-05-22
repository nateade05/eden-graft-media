import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Graft Media — AI-Led Creative Production Studio",
  description:
    "Graft Media is an AI-led creative production studio. We take your product and build the full visual campaign around it — stills, video, and every format — in days, not weeks.",
  keywords: ["AI creative studio", "AI campaign production", "creative direction", "product photography AI", "campaign content", "fashion content studio"],
  openGraph: {
    title: "Graft Media — AI-Led Creative Production Studio",
    description: "Brief in. Campaign out. AI-led creative production for consumer brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full grain-overlay">{children}</body>
    </html>
  );
}
