import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { SolokitBadge } from "@/components/SolokitBadge";

export const metadata: Metadata = {
  title: "Mumbai Local Train Game",
  description: "A strategy game where you compete for a seat on a Mumbai local train",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
        <SolokitBadge />
        <Analytics />
      </body>
    </html>
  );
}
