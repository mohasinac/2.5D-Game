import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beyblade Game Admin",
  description: "Administration interface for Beyblade game server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
